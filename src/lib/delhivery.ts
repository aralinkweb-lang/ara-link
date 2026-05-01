import axios from "axios";
import type {
  DelhiveryShipmentPayload,
  DelhiveryCreateResponse,
  DelhiveryTrackingResponse,
  Order,
} from "@/types";

const DELHIVERY_BASE_URL =
  process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";

function getDelhiveryClient() {
  const token = process.env.DELHIVERY_TOKEN;
  if (!token) {
    throw new Error("Delhivery API token not configured");
  }

  return axios.create({
    baseURL: DELHIVERY_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export async function createDelhiveryShipment(
  order: Order
): Promise<DelhiveryCreateResponse> {
  const client = getDelhiveryClient();

  const pickupName = process.env.DELHIVERY_PICKUP_NAME || "";
  const returnPin = process.env.DELHIVERY_PICKUP_PINCODE || "";
  const returnCity = process.env.DELHIVERY_PICKUP_CITY || "";
  const returnState = process.env.DELHIVERY_PICKUP_STATE || "";
  const returnAdd = process.env.DELHIVERY_PICKUP_ADDRESS || "";
  const returnPhone = process.env.DELHIVERY_PICKUP_PHONE || "";
  const sellerName = process.env.DELHIVERY_SELLER_NAME || pickupName;

  const productsDesc = order.items
    .map((i) => `${i.productName} x${i.quantity}`)
    .join(", ");

  const shipment: DelhiveryShipmentPayload = {
    name: order.shippingAddress.fullName,
    add: order.shippingAddress.address,
    pin: order.shippingAddress.pincode,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    country: "India",
    phone: order.shippingAddress.phone,
    order: order.orderNumber,
    payment_mode: "Prepaid",
    return_pin: returnPin,
    return_city: returnCity,
    return_phone: returnPhone,
    return_add: returnAdd,
    return_name: sellerName,
    return_email: order.shippingAddress.email,
    return_state: returnState,
    return_country: "India",
    products_desc: productsDesc,
    hsn_code: "",
    cod_amount: "0",
    order_date: new Date(order.createdAt).toISOString().split("T")[0],
    total_amount: String(order.total),
    seller_add: returnAdd,
    seller_name: sellerName,
    seller_inv: order.orderNumber,
    quantity: order.items.reduce((sum, i) => sum + i.quantity, 0),
    waybill: "",
    shipment_width: 15,
    shipment_height: 10,
    weight: 0.5,
    shipment_length: 20,
    seller_gst_tin: process.env.DELHIVERY_GST || "",
    shipping_mode: "Surface",
    address_type: "home",
  };

  const data = JSON.stringify({
    shipments: [shipment],
    pickup_location: { name: pickupName },
  });

  try {
    const response = await client.post(
      "/api/cmu/create.json",
      `format=json&data=${encodeURIComponent(data)}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const body = response.data as
      | DelhiveryCreateResponse
      | { rmk?: string; error?: string; success?: boolean; packages?: unknown[] }
      | undefined;

    const pkg = (body as DelhiveryCreateResponse | undefined)?.packages?.[0];

    if (!pkg || pkg.status !== "Success") {
      // Delhivery surfaces the real failure reason in a few different fields
      // depending on which validation failed. Pull whichever one is populated.
      const reason =
        (pkg?.remarks && pkg.remarks.length > 0 && pkg.remarks.join(", ")) ||
        (body && typeof body === "object" && "rmk" in body && (body as { rmk?: string }).rmk) ||
        (body && typeof body === "object" && "error" in body && (body as { error?: string }).error) ||
        JSON.stringify(body);

      console.error("Delhivery rejected shipment. Full response:", JSON.stringify(body, null, 2));
      throw new Error(`Delhivery shipment creation failed: ${reason}`);
    }

    return body as DelhiveryCreateResponse;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
    const responseData = axiosError.response?.data;
    console.error(
      "Delhivery create shipment error:",
      responseData ? JSON.stringify(responseData, null, 2) : axiosError.message || error
    );
    // Preserve the original message instead of replacing it with a generic one,
    // so the API caller / log reader can see why it actually failed.
    if (error instanceof Error) throw error;
    throw new Error(
      typeof responseData === "string"
        ? responseData
        : axiosError.message || "Failed to create Delhivery shipment"
    );
  }
}

export async function trackDelhiveryShipment(
  waybill: string
): Promise<DelhiveryTrackingResponse> {
  const client = getDelhiveryClient();

  try {
    const response = await client.get("/api/v1/packages/json/", {
      params: { waybill, verbose: 1 },
    });
    return response.data as DelhiveryTrackingResponse;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "Delhivery tracking error:",
      axiosError.response?.data || axiosError.message || error
    );
    throw new Error("Failed to track Delhivery shipment");
  }
}

export async function cancelDelhiveryShipment(waybill: string) {
  const client = getDelhiveryClient();

  const data = JSON.stringify({ waybill, cancellation: true });

  try {
    const response = await client.post(
      "/api/p/edit",
      `format=json&data=${encodeURIComponent(data)}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "Delhivery cancel error:",
      axiosError.response?.data || axiosError.message || error
    );
    throw new Error("Failed to cancel Delhivery shipment");
  }
}

// Register a pickup / warehouse location with Delhivery.
// Run this ONCE per environment (staging or prod). After it succeeds, the
// pickup name can be used as `pickup_location.name` in createDelhiveryShipment.
export async function registerDelhiveryPickup() {
  const client = getDelhiveryClient();

  const name = process.env.DELHIVERY_PICKUP_NAME?.trim();
  const pin = process.env.DELHIVERY_PICKUP_PINCODE?.trim();
  const city = process.env.DELHIVERY_PICKUP_CITY?.trim();
  const state = process.env.DELHIVERY_PICKUP_STATE?.trim();
  const address = process.env.DELHIVERY_PICKUP_ADDRESS?.trim();
  const phone = process.env.DELHIVERY_PICKUP_PHONE?.trim();
  const sellerName = process.env.DELHIVERY_SELLER_NAME?.trim() || name;

  if (!name || !pin || !city || !state || !address || !phone) {
    throw new Error(
      "Pickup details missing. Set DELHIVERY_PICKUP_NAME / PINCODE / CITY / STATE / ADDRESS / PHONE in .env.local."
    );
  }

  const payload = {
    name,
    email: "support@ara-skincare.com",
    phone,
    address,
    city,
    pin,
    country: "India",
    registered_name: sellerName,
    return_address: address,
    return_pin: pin,
    return_city: city,
    return_state: state,
    return_country: "India",
  };

  try {
    const response = await client.post(
      "/api/backend/clientwarehouse/create/",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
    const responseData = axiosError.response?.data;
    console.error(
      "Delhivery pickup registration error:",
      responseData ? JSON.stringify(responseData, null, 2) : axiosError.message || error
    );
    if (error instanceof Error) throw error;
    throw new Error(
      typeof responseData === "string"
        ? responseData
        : axiosError.message || "Failed to register pickup location"
    );
  }
}

export async function checkDelhiveryServiceability(pincode: string) {
  const client = getDelhiveryClient();

  try {
    const response = await client.get("/c/api/pin-codes/json/", {
      params: { filter_codes: pincode },
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "Delhivery serviceability error:",
      axiosError.response?.data || axiosError.message || error
    );
    throw new Error("Failed to check Delhivery serviceability");
  }
}
