import { NextResponse } from "next/server";
import { registerDelhiveryPickup } from "@/lib/delhivery";

// One-shot endpoint to register the pickup location described in .env.local
// against the Delhivery account that owns DELHIVERY_TOKEN.
//
// Usage (run this once per environment):
//   curl -X POST http://localhost:3000/api/delhivery/register-pickup
//
// After it succeeds, retry a checkout — shipment creation should stop failing
// with the 'NoneType ... end_date' error.
export async function POST() {
  try {
    const data = await registerDelhiveryPickup();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to register pickup";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
