import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { updateOrder, getOrderById } from "@/lib/db";
import { createDelhiveryShipment } from "@/lib/delhivery";
import { updateSheetPaymentStatus } from "@/lib/sheets";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Fetch order to get orderNumber for sheet update
    const existingOrder = await getOrderById(orderId);

    // Update order with payment details
    const updatedOrder = await updateOrder(orderId, {
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      orderStatus: "confirmed",
    });

    // Update Google Sheet status (non-blocking)
    if (existingOrder?.orderNumber) {
      try { await updateSheetPaymentStatus(existingOrder.orderNumber, "paid", "confirmed"); }
      catch (sheetsErr) { console.error("Sheets update failed:", sheetsErr); }
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Create Delhivery shipment (auto-ship)
    let awbCode: string | undefined;
    let courierName: string | undefined;
    try {
      const delhiveryResponse = await createDelhiveryShipment(updatedOrder);
      const pkg = delhiveryResponse.packages[0];
      awbCode = pkg.waybill || undefined;
      courierName = "Delhivery";
      await updateOrder(orderId, {
        delhiveryOrderRef: pkg.refnum,
        awbCode,
        courierName,
        trackingUrl: awbCode ? `https://www.delhivery.com/track/package/${awbCode}` : undefined,
        orderStatus: awbCode ? "processing" : "confirmed",
      });
    } catch (delhiveryError) {
      console.error("Delhivery shipment creation failed:", delhiveryError);
    }

    // Send order confirmation email
    if (updatedOrder) {
      try {
        const addr = updatedOrder.shippingAddress;
        await sendOrderConfirmationEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: addr.fullName,
          email: addr.email,
          items: updatedOrder.items,
          subtotal: updatedOrder.subtotal,
          total: updatedOrder.total,
          paymentMethod: "online",
          shippingAddress: addr,
          awbCode,
          courierName,
        });
      } catch (emailError) {
        console.error("Order confirmation email failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: existingOrder?.orderNumber,
      awbCode: awbCode ?? null,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
