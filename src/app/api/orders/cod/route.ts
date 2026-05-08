import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrder } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { appendOrderToSheet } from "@/lib/sheets";
import { createDelhiveryShipment } from "@/lib/delhivery";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, items, shippingAddress, discount, couponCode } = body;

    if (!amount || !items || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await createOrder({
      orderNumber,
      items,
      shippingAddress,
      subtotal,
      shipping: 0,
      discount: discount ?? 0,
      total: amount,
      couponCode: couponCode ?? null,
      paymentStatus: "pending",
      paymentMethod: "cod",
      orderStatus: "confirmed",
    });

    // Create Delhivery shipment for COD
    let awbCode: string | undefined;
    let courierName: string | undefined;
    try {
      const delhiveryResponse = await createDelhiveryShipment(order);
      const pkg = delhiveryResponse.packages[0];
      awbCode = pkg.waybill || undefined;
      courierName = "Delhivery";
      await updateOrder(order._id.toString(), {
        delhiveryOrderRef: pkg.refnum,
        awbCode,
        courierName,
        trackingUrl: awbCode ? `https://www.delhivery.com/track/package/${awbCode}` : undefined,
        orderStatus: awbCode ? "processing" : "confirmed",
      });
    } catch (delhiveryError) {
      console.error("Delhivery COD shipment creation failed:", delhiveryError);
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderNumber,
        customerName: shippingAddress.fullName,
        email: shippingAddress.email,
        items,
        subtotal,
        total: amount,
        paymentMethod: "cod",
        shippingAddress,
        awbCode,
        courierName,
      });
    } catch (emailError) {
      console.error("Order confirmation email failed:", emailError);
    }

    // Sync to Google Sheets (non-blocking)
    try { await appendOrderToSheet({
      orderNumber,
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      email: shippingAddress.email,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      items: items.map((i: { productName: string; quantity: number; variant?: string }) =>
        `${i.productName}${i.variant ? ` (${i.variant})` : ""} x${i.quantity}`
      ).join(", "),
      total: amount,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "confirmed",
    }); } catch (sheetsErr) { console.error("Sheets sync failed:", sheetsErr); }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber,
      awbCode: awbCode ?? null,
    });
  } catch (error) {
    console.error("COD order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
