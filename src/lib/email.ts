import { Resend } from "resend";

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: Array<{ productName: string; quantity: number; price: number; variant?: string }>;
  subtotal: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
  };
  awbCode?: string;
  courierName?: string;
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function buildTrackingLink(awbCode?: string, orderNumber?: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://ara-skincare.com";
  const id = awbCode || orderNumber || "";
  return `${base}/track?order=${encodeURIComponent(id)}`;
}

function buildEmailHtml(data: OrderEmailData): string {
  const trackLink = buildTrackingLink(data.awbCode, data.orderNumber);
  const isCOD = data.paymentMethod === "cod";

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f3f0ff;">
        <div style="font-weight:600;color:#1a1a2e;font-size:14px;">${item.productName}</div>
        ${item.variant ? `<div style="font-size:12px;color:#6b7280;margin-top:2px;">${item.variant}</div>` : ""}
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f3f0ff;text-align:right;font-weight:700;color:#1a1a2e;font-size:14px;white-space:nowrap;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Order Confirmation – ARA </title>
</head>
<body style="margin:0;padding:0;background:#f8f5ff;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ff;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);border-radius:20px 20px 0 0;padding:40px 36px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">ARA</div>
            <div style="font-size:11px;font-weight:600;color:#ddd6fe;letter-spacing:3px;text-transform:uppercase;margin-top:2px;"></div>
            <div style="margin-top:24px;width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;">📦</span>
            </div>
            <h1 style="margin:16px 0 0;font-size:22px;font-weight:800;color:#fff;">
              ${isCOD ? "Order Placed!" : "Payment Confirmed!"}
            </h1>
            <p style="margin:8px 0 0;font-size:14px;color:#ddd6fe;">
              Thank you, ${data.customerName.split(" ")[0]}! Your order is on its way.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:32px 36px;">

            <!-- Order meta -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ff;border-radius:14px;margin-bottom:28px;">
              <tr>
                <td style="padding:18px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:50%;padding-right:8px;">
                        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Order Number</div>
                        <div style="font-size:15px;font-weight:800;color:#7c3aed;margin-top:4px;">${data.orderNumber}</div>
                      </td>
                      <td style="width:50%;padding-left:8px;border-left:1px solid #e5e7eb;">
                        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Payment</div>
                        <div style="font-size:15px;font-weight:800;color:#1a1a2e;margin-top:4px;">${isCOD ? "Cash on Delivery" : "Paid Online"}</div>
                      </td>
                    </tr>
                    ${
                      data.awbCode
                        ? `<tr>
                      <td colspan="2" style="padding-top:14px;border-top:1px solid #e5e7eb;margin-top:14px;">
                        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">AWB / Tracking ID</div>
                        <div style="font-size:15px;font-weight:800;color:#1a1a2e;margin-top:4px;font-family:monospace;">${data.awbCode}</div>
                        ${data.courierName ? `<div style="font-size:12px;color:#6b7280;margin-top:2px;">via ${data.courierName}</div>` : ""}
                      </td>
                    </tr>`
                        : ""
                    }
                  </table>
                </td>
              </tr>
            </table>

            <!-- Items -->
            <h2 style="margin:0 0 14px;font-size:15px;font-weight:800;color:#1a1a2e;">Items Ordered</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f0ff;border-radius:14px;overflow:hidden;margin-bottom:28px;">
              ${itemRows}
              <tr style="background:#faf5ff;">
                <td style="padding:14px 16px;font-weight:700;color:#1a1a2e;font-size:14px;">Subtotal</td>
                <td style="padding:14px 16px;text-align:right;font-weight:700;color:#1a1a2e;font-size:14px;">${formatPrice(data.subtotal)}</td>
              </tr>
              <tr style="background:#faf5ff;">
                <td style="padding:6px 16px 6px;font-size:13px;color:#6b7280;">Shipping</td>
                <td style="padding:6px 16px 6px;text-align:right;font-size:13px;font-weight:600;color:#16a34a;">Free</td>
              </tr>
              ${data.discount && data.discount > 0 ? `
              <tr style="background:#faf5ff;">
                <td style="padding:6px 16px 6px;font-size:13px;color:#6b7280;">Prepaid discount (5%)</td>
                <td style="padding:6px 16px 6px;text-align:right;font-size:13px;font-weight:600;color:#16a34a;">−${formatPrice(data.discount)}</td>
              </tr>` : ""}
              <tr style="background:#f3f0ff;">
                <td style="padding:16px 16px;font-size:16px;font-weight:900;color:#7c3aed;">Total</td>
                <td style="padding:16px 16px;text-align:right;font-size:16px;font-weight:900;color:#7c3aed;">${formatPrice(data.total)}</td>
              </tr>
            </table>

            <!-- Shipping Address -->
            <h2 style="margin:0 0 14px;font-size:15px;font-weight:800;color:#1a1a2e;">Shipping Address</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5ff;border-radius:14px;margin-bottom:28px;">
              <tr>
                <td style="padding:18px 20px;font-size:14px;line-height:1.7;color:#374151;">
                  <strong style="color:#1a1a2e;font-size:15px;">${data.shippingAddress.fullName}</strong><br/>
                  ${data.shippingAddress.address}<br/>
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} – ${data.shippingAddress.pincode}<br/>
                  <span style="color:#6b7280;">📞 ${data.shippingAddress.phone}</span><br/>
                  <span style="color:#6b7280;">✉️ ${data.shippingAddress.email}</span>
                </td>
              </tr>
            </table>

            <!-- Track CTA -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${trackLink}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;font-weight:800;font-size:15px;padding:16px 40px;border-radius:50px;box-shadow:0 8px 24px rgba(124,58,237,0.35);letter-spacing:0.2px;">
                🚚 &nbsp;Track My Order
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
                Click to view live delivery status — tracking ID auto-filled
              </p>
            </div>

            <!-- Delivery note -->
            <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:12px;padding:14px 18px;margin-bottom:4px;">
              <p style="margin:0;font-size:13px;color:#065f46;font-weight:600;">
                🎯 Estimated delivery in 3–5 business days
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#059669;">
                ${isCOD ? "Please keep exact change ready at the time of delivery." : "Your payment is securely processed via Razorpay."}
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;border-radius:0 0 20px 20px;padding:28px 36px;text-align:center;">
            <div style="font-size:18px;font-weight:900;color:#a78bfa;margin-bottom:4px;">ARA</div>
            <p style="margin:0 0 12px;font-size:12px;color:#6b7280;">
              Questions? Reply to this email or contact us at support@ara-skincare.com
            </p>
            <p style="margin:0;font-size:11px;color:#4b5563;">
              © ${new Date().getFullYear()} Aralink Pvt. Ltd. · All rights reserved
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping order confirmation email");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM || "ARA  <orders@ara-skincare.com>";

  const payload = {
    from,
    to: data.email,
    subject: `Your ARA order ${data.orderNumber} is confirmed!`,
    html: buildEmailHtml(data),
  };

  console.info("Sending order confirmation email via Resend", {
    to: data.email,
    from,
    orderNumber: data.orderNumber,
    resendKeyConfigured: Boolean(apiKey),
  });

  try {
    const result = await resend.emails.send(payload);

    if (result.error) {
      console.error("Resend order confirmation email returned error", {
        to: data.email,
        orderNumber: data.orderNumber,
        from,
        error: result.error,
        headers: result.headers,
      });
      throw new Error(
        `Resend error: ${result.error.name} - ${result.error.message} (${result.error.statusCode})`
      );
    }

    console.info("Resend email sent successfully", {
      messageId: result.data?.id,
      headers: result.headers,
      data: result.data,
      to: data.email,
      orderNumber: data.orderNumber,
    });
    return result;
  } catch (error) {
    console.error("Resend order confirmation email error", {
      to: data.email,
      orderNumber: data.orderNumber,
      from,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
