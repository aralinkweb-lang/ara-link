import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber, getOrdersByEmail, getAllOrders, getOrderByAwb } from "@/lib/db";

function serializeOrder(order: Record<string, unknown>) {
  return {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    total: order.total,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    items: order.items,
    shippingAddress: order.shippingAddress,
    awbCode: order.awbCode,
    courierName: order.courierName,
    trackingUrl: order.trackingUrl,
    createdAt: order.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const awb = searchParams.get("awb");
    const email = searchParams.get("email");

    if (orderNumber) {
      const order = await getOrderByNumber(orderNumber);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: serializeOrder(order) });
    }

    if (awb) {
      const order = await getOrderByAwb(awb);
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found for this AWB" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: serializeOrder(order) });
    }

    if (email) {
      const orders = await getOrdersByEmail(email);
      return NextResponse.json({
        success: true,
        data: orders.map((o) => ({
          orderNumber: o.orderNumber,
          orderStatus: o.orderStatus,
          paymentStatus: o.paymentStatus,
          total: o.total,
          itemCount: o.items.length,
          createdAt: o.createdAt,
        })),
      });
    }

    const orders = await getAllOrders();
    return NextResponse.json({
      success: true,
      data: orders.map((o) => ({
        orderNumber: o.orderNumber,
        customerName: o.shippingAddress?.fullName,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        total: o.total,
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
