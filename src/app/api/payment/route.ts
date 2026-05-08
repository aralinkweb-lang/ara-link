import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { createOrder } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { appendOrderToSheet } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, items, shippingAddress } = body;

    // Validate required fields
    if (!amount || !items || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => 
        sum + item.price * item.quantity,
      0
    );

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(amount, orderNumber);

    // Create order in database
    const order = await createOrder({
      orderNumber,
      items,
      shippingAddress,
      subtotal,
      shipping: 0,
      discount: 0,
      total: amount,
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "pending",
    });

    // Sync to Google Sheets (non-blocking — failure must not break order creation)
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
      paymentMethod: "Razorpay",
      paymentStatus: "pending",
      orderStatus: "pending",
    }); } catch (sheetsErr) { console.error("Sheets sync failed:", sheetsErr); }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
