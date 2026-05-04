# ARA Store — Full Implementation Reference

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend — API Endpoints](#backend--api-endpoints)
6. [Database Schema](#database-schema)
7. [State Management](#state-management)
8. [Utilities & Libraries](#utilities--libraries)
9. [Payment Flow (Razorpay)](#payment-flow-razorpay)
10. [Logistics Flow (Delhivery)](#logistics-flow-delhivery)
11. [Data Model](#data-model)
12. [Coupons](#coupons)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand v5 (cart, persisted to localStorage) |
| Forms | React Hook Form v7 + Zod v4 |
| Database | MongoDB via Mongoose v9 |
| Payments | Razorpay v2 |
| Logistics | Delhivery REST API |
| HTTP Client | Axios |
| Icons | Lucide React |
| Fonts | Playfair Display, DM Sans, DM Mono (Google Fonts) |

---

## Project Structure

```
ara-store/
├── public/                      # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, providers, header/footer)
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Design tokens, base styles, Tailwind import
│   │   ├── checkout/
│   │   │   └── page.tsx         # Checkout form + Razorpay integration
│   │   ├── track/
│   │   │   └── page.tsx         # Order tracking page
│   │   ├── products/
│   │   │   ├── page.tsx         # Product listing
│   │   │   └── [slug]/page.tsx  # Product detail (dynamic)
│   │   ├── privacy-policy/
│   │   │   └── page.tsx         # Static privacy policy
│   │   └── api/
│   │       ├── orders/route.ts           # GET orders
│   │       ├── payment/route.ts          # POST create Razorpay order
│   │       ├── payment/verify/route.ts   # POST verify payment + ship
│   │       ├── delhivery/create-shipment/route.ts
│   │       ├── delhivery/track/route.ts
│   │       └── delhivery/register-pickup/route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductView.tsx
│   │   ├── Herosection.tsx
│   │   ├── ReviewsCarousel.tsx
│   │   ├── AddOnSection.tsx / AddOnSectionClient.tsx
│   │   ├── AddOnCard.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── StickyOrderCTA.tsx
│   │   ├── ExitIntentPopup.tsx
│   │   ├── AnnouncementBar1.tsx
│   │   └── CountdownTimer.tsx
│   ├── data/
│   │   └── products.ts          # Product catalog, reviews, benefits, add-ons
│   ├── lib/
│   │   ├── db.ts                # MongoDB connection + Order model + helpers
│   │   ├── razorpay.ts          # Razorpay SDK wrappers
│   │   ├── delhivery.ts         # Delhivery API wrappers
│   │   ├── coupons.ts           # Coupon config + applyCoupon()
│   │   └── utils.ts             # Formatters, validators, helpers
│   ├── store/
│   │   └── cart.tsx             # Zustand cart store + CartProvider
│   └── types/
│       └── index.ts             # All TypeScript interfaces
```

---

## Environment Variables

Create `.env.local` in project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ara-store

# Razorpay (use test keys for dev)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Delhivery
DELHIVERY_TOKEN=your_delhivery_api_token
DELHIVERY_BASE_URL=https://staging-express.delhivery.com   # or production URL

# Delhivery Pickup / Warehouse Address
DELHIVERY_PICKUP_NAME=ARA Warehouse
DELHIVERY_PICKUP_PINCODE=110001
DELHIVERY_PICKUP_CITY=New Delhi
DELHIVERY_PICKUP_STATE=Delhi
DELHIVERY_PICKUP_ADDRESS=123, Example Street
DELHIVERY_PICKUP_PHONE=9999999999
DELHIVERY_SELLER_NAME=ARA Cold Therapy

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **One-time setup**: After setting Delhivery vars, call `POST /api/delhivery/register-pickup` once to register your warehouse with Delhivery. Without this, shipment creation will fail.

---

## Frontend Architecture

### Pages

#### `/` — Home (`src/app/page.tsx`)
Server component. Renders:
1. `<HeroSection />` — video + title + CTAs
2. Owner profiles section (The Performer, The Biohacker)
3. Ritual steps (4 steps from `ritualSteps` data)
4. Science benefits (5 benefits from `benefits` data)
5. `<ReviewsCarousel />` — 3 rotating testimonials
6. Products grid — first 4 products from catalog with `<ProductCard />`

#### `/products` — Listing (`src/app/products/page.tsx`)
Server component. Renders all 7 products in a 4-column grid plus a trust bar (free shipping, easy returns, secure payments).

#### `/products/[slug]` — Product Detail (`src/app/products/[slug]/page.tsx`)
Server component + embedded client components. Renders:
- `<ProductView />` — main product UI (image, variants, quantity, add-to-cart)
- `<StickyOrderCTA />` — sticky bottom bar with direct "Order Now"
- `<AddOnSection />` — recommended powder add-ons
- Ritual steps + science benefits
- `<ReviewsCarousel />`

#### `/checkout` — Checkout (`src/app/checkout/page.tsx`)
**Client component.** Full checkout flow:
1. Reads cart from Zustand store
2. Validates cart not empty (redirects if empty)
3. Shipping address form (React Hook Form + Zod)
4. Add-on upsell via `<AddOnSectionClient />`
5. Coupon code input → calls `applyCoupon()` from `src/lib/coupons.ts`
6. Order summary with line items, discount, total
7. "Place Order" → `POST /api/payment` → opens Razorpay modal
8. On Razorpay success → `POST /api/payment/verify`
9. On verified → clears cart, redirects to `/track?order=ARA-xxx`

#### `/track` — Order Tracking (`src/app/track/page.tsx`)
**Client component.**
- Input form: order number or email
- `GET /api/orders?orderNumber=ARA-xxx` or `GET /api/orders?email=user@example.com`
- Renders: progress stepper (pending → confirmed → processing → shipped → delivered), tracking timeline from Delhivery, order items, shipping address

#### `/privacy-policy` — Static page (10 sections)

---

### Components

#### `Header` (Client)
- Sticky top bar, z-40
- Logo (left), centered nav (Shop, Track Order), icon buttons (Search, Account, Cart)
- Cart icon shows item count badge from `useCart()`
- Mobile hamburger menu
- Renders `<CartDrawer />`

#### `CartDrawer` (Client)
- Fixed right drawer, z-50, slides in via `translate-x-full` → `translate-x-0`
- Overlay applies `backdrop-blur-sm` only when `isOpen` is true
- Renders cart items with quantity controls
- "Checkout" button → navigates to `/checkout`

#### `ProductCard` (Client)
Props: `product: Product`
- Discount badge (e.g. "33% off")
- Product image, category eyebrow, name, star rating, price pair

#### `ProductView` (Client)
Props: `product: Product`
- Image display, variant selector (color swatches), quantity selector
- "Add to Cart" → `cart.addItem(product, qty, variant)`
- "Order Now" → adds to cart then navigates to `/checkout`

#### `AnnouncementBar1` (Client)
- Rotates through 3 messages every 5 seconds
- Renders above Header in layout

#### `ExitIntentPopup` (Client)
- Fires once when mouse moves toward top of viewport (exit intent)

---

## Backend — API Endpoints

### `POST /api/payment`
**Create payment order**

Request body:
```json
{
  "amount": 798,
  "items": [
    {
      "productId": "1",
      "name": "ARA Face Ice Bowl",
      "price": 399,
      "quantity": 2,
      "variant": { "id": "v1", "name": "Glacier White" }
    }
  ],
  "shippingAddress": {
    "fullName": "Priya Sharma",
    "phone": "9876543210",
    "email": "priya@example.com",
    "address": "123 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  }
}
```

Success response `200`:
```json
{
  "orderId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "orderNumber": "ARA-1718123456789-4729",
  "razorpayOrderId": "order_Pxxxxxxxxxxxxxxx",
  "amount": 798
}
```

Error responses:
- `400` — Missing required fields
- `500` — Razorpay/DB error

**Implementation:**
1. Validates `amount`, `items`, `shippingAddress` present
2. Calls `generateOrderNumber()` → `ARA-{timestamp}-{random4}`
3. Calculates `subtotal` from items array
4. Calls `getRazorpayInstance().orders.create({ amount: amount * 100, currency: 'INR', receipt: orderNumber })`
5. Calls `createOrder({ orderNumber, items, shippingAddress, subtotal, total: amount, paymentStatus: 'pending', orderStatus: 'pending', razorpayOrderId })`
6. Returns IDs to client for Razorpay modal

---

### `POST /api/payment/verify`
**Verify payment signature and confirm order**

Request body:
```json
{
  "orderId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "razorpay_order_id": "order_Pxxxxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_Qxxxxxxxxxxxxxxx",
  "razorpay_signature": "abc123..."
}
```

Success response `200`:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

Error responses:
- `400` — Missing fields or invalid signature
- `404` — Order not found
- `500` — DB or Delhivery error

**Implementation:**
1. Calls `verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)` — HMAC-SHA256 check
2. Updates order: `paymentStatus: 'paid'`, `orderStatus: 'confirmed'`, `razorpayPaymentId`
3. Auto-creates Delhivery shipment (non-blocking — logs error but doesn't fail the response)
4. If shipment created → updates order with `awbCode`, `courierName`, `trackingUrl`, `orderStatus: 'processing'`

---

### `GET /api/orders`
**Fetch orders**

Query params (one of):
- `?orderNumber=ARA-xxx` → single order
- `?email=user@example.com` → all orders for email
- (none) → all orders, last 50

Success response `200`:
```json
{
  "success": true,
  "order": {
    "orderNumber": "ARA-1718123456789-4729",
    "status": "confirmed",
    "paymentStatus": "paid",
    "total": 798,
    "items": [...],
    "shippingAddress": {...},
    "awbCode": "1234567890",
    "courierName": "Delhivery",
    "trackingUrl": "https://...",
    "createdAt": "2024-06-12T10:30:00.000Z"
  }
}
```

Error responses:
- `404` — Order not found
- `500` — DB error

---

### `POST /api/delhivery/create-shipment`
**Manually create or retry a Delhivery shipment**

Request body:
```json
{ "orderId": "64f1a2b3c4d5e6f7a8b9c0d1" }
```

Success response `200`:
```json
{
  "success": true,
  "waybill": "1234567890",
  "refNumber": "ARA-xxx",
  "sortCode": "DEL-NH"
}
```

Error responses:
- `400` — Missing orderId or order not paid
- `404` — Order not found
- `500` — Delhivery API error

**Implementation:**
1. Looks up order by ID
2. Validates `paymentStatus === 'paid'`
3. Calls `createDelhiveryShipment(order)` from `src/lib/delhivery.ts`
4. Updates order with `awbCode`, `courierName`, `trackingUrl`, `orderStatus: 'processing'`

---

### `GET /api/delhivery/track`
**Track a shipment**

Query params:
- `?awb=1234567890` — Delhivery waybill number

Success response `200`:
```json
{
  "success": true,
  "tracking": [
    {
      "date": "2024-06-13T14:22:00.000Z",
      "status": "In Transit",
      "activity": "Shipment picked up",
      "location": "New Delhi Hub"
    }
  ],
  "currentStatus": "In Transit",
  "shipmentDetails": {
    "awb": "1234567890",
    "origin": "New Delhi",
    "destination": "Bangalore",
    "pickupDate": "2024-06-12",
    "expectedDelivery": "2024-06-15",
    "receivedBy": null
  }
}
```

Error responses:
- `400` — Missing awb param
- `404` — Waybill not found
- `500` — Delhivery API error

---

### `POST /api/delhivery/register-pickup`
**One-time setup: Register warehouse pickup location**

No request body needed. Reads all `DELHIVERY_PICKUP_*` env vars.

Success response `200`:
```json
{
  "success": true,
  "data": { ...delhiveryResponse }
}
```

> Call this once after first deploy or when changing warehouse address.

---

## Database Schema

Defined in `src/lib/db.ts` using Mongoose.

### Order Schema

```typescript
{
  orderNumber:      String,   // "ARA-1718123456789-4729", unique, indexed
  items: [{
    productId:      String,
    name:           String,
    price:          Number,
    quantity:       Number,
    variant: {
      id:           String,
      name:         String,
      colorCode:    String,
      additionalPrice: Number
    }
  }],
  shippingAddress: {
    fullName:       String,
    phone:          String,
    email:          String,   // indexed
    address:        String,
    city:           String,
    state:          String,
    pincode:        String,
    country:        String    // default: "India"
  },
  subtotal:         Number,
  total:            Number,
  discount:         Number,   // default: 0
  paymentStatus:    String,   // "pending" | "paid" | "failed" | "refunded"
  orderStatus:      String,   // "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  razorpayOrderId:  String,
  razorpayPaymentId: String,
  awbCode:          String,   // Delhivery waybill
  courierName:      String,
  trackingUrl:      String,
  createdAt:        Date,     // auto
  updatedAt:        Date      // auto
}
```

### DB Helper Functions

```typescript
createOrder(data)                          // → Order
getOrderByNumber(orderNumber)              // → Order | null
getOrderById(id)                           // → Order | null
updateOrder(id, updateData)                // → Order | null
updateOrderByNumber(orderNumber, data)     // → Order | null
getOrdersByEmail(email)                    // → Order[]
getAllOrders(limit = 50, skip = 0)         // → Order[]
```

Connection is pooled — reuses existing Mongoose connection across serverless invocations via a global cache on `global.mongoose`.

---

## State Management

### Cart Store (`src/store/cart.tsx`)

**Persisted to** `localStorage` key `ara-cart-v1`.

```typescript
// State
{
  items: CartItem[],    // [{ product, quantity, variant? }]
  isOpen: boolean
}

// Actions
addItem(product, quantity?, variant?)   // Merges qty if same product+variant
removeItem(productId, variantId?)
updateQuantity(productId, qty, variantId?)  // Removes if qty <= 0
clearCart()
toggleCart() / openCart() / closeCart()

// Computed
getSubtotal()    // Σ (price + variant.additionalPrice) * qty
getTotal()       // Same as subtotal (no shipping in cart)
getItemCount()   // Σ qty
```

**Cart line identity** — two items are the same line if they share the same `productId` AND `variantId` (or both have no variant):
```typescript
getItemKey(item)  // → "productId" or "productId:variantId"
```

Use `<CartProvider>` in layout to hydrate from localStorage on mount.

---

## Utilities & Libraries

### `src/lib/utils.ts`

```typescript
formatPrice(price: number): string        // → "₹399"
formatDate(date: Date | string): string   // → "12 Jun 2024"
generateOrderNumber(): string             // → "ARA-1718123456789-4729"
cn(...classes: string[]): string          // Joins class names
validatePhone(phone: string): boolean     // 10-digit Indian mobile
validatePincode(pincode: string): boolean // 6-digit
validateEmail(email: string): boolean
calculateDiscount(orig, sale): number     // Percentage
slugify(text: string): string             // "ARA Face Bowl" → "ara-face-bowl"
truncate(text, length): string
debounce(func, wait): Function
```

### `src/lib/razorpay.ts`

```typescript
getRazorpayInstance(): Razorpay
createRazorpayOrder(amount: number, receipt: string)
  // amount in rupees, converted to paise internally
verifyPaymentSignature(orderId, paymentId, signature): boolean
  // HMAC-SHA256: key=RAZORPAY_KEY_SECRET, data="orderId|paymentId"
getPaymentDetails(paymentId: string)
getRazorpayConfig()
  // Returns { key: NEXT_PUBLIC_RAZORPAY_KEY_ID } for client modal
```

### `src/lib/delhivery.ts`

```typescript
getDelhiveryClient(): AxiosInstance
  // Axios with Authorization: Token <DELHIVERY_TOKEN>

createDelhiveryShipment(order: Order): Promise<{waybill, refNumber, sortCode}>
  // Builds DelhiveryShipmentPayload from order
  // POST /api/create-packages-for-express-shipment
  // Pickup name from DELHIVERY_PICKUP_NAME env var

trackDelhiveryShipment(waybill: string)
  // GET /api/v1/packages/json/?waybill=xxx

cancelDelhiveryShipment(waybill: string)
  // DELETE /api/v1/packages/cancel/

registerDelhiveryPickup()
  // POST /api/backend/clientwarehouse/create/
  // Uses all DELHIVERY_PICKUP_* env vars

checkDelhiveryServiceability(pincode: string)
  // GET /c/api/pin-codes/json/?filter_codes=pincode
```

---

## Payment Flow (Razorpay)

```
Client                          Server                      Razorpay
  |                               |                             |
  |-- POST /api/payment --------> |                             |
  |   { amount, items, addr }     |-- createRazorpayOrder() --> |
  |                               |<-- { razorpayOrderId } -----|
  |<-- { orderId, rzpOrderId } ---|                             |
  |                               |                             |
  |-- Open Razorpay Modal ------> |                             |
  |                               |                  User pays  |
  |<-- handler.success callback --|<----------------------------|
  |   { payment_id, signature }   |                             |
  |                               |                             |
  |-- POST /api/payment/verify -> |                             |
  |   { orderId, rzp_*, sig }     |-- verifySignature()         |
  |                               |-- updateOrder(paid)         |
  |                               |-- createDelhiveryShipment() |
  |<-- { success: true } ---------|                             |
  |                               |                             |
  |-- clearCart()                 |                             |
  |-- redirect /track?order=xxx   |                             |
```

**Client-side Razorpay modal config** (from `/checkout/page.tsx`):
```typescript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: amount * 100,
  currency: "INR",
  name: "ARA Cold Therapy",
  order_id: razorpayOrderId,
  handler: async (response) => {
    // response.razorpay_payment_id, .razorpay_order_id, .razorpay_signature
    await fetch('/api/payment/verify', { method: 'POST', body: JSON.stringify({...}) })
  },
  prefill: { name, email, contact },
  theme: { color: "#7c3aed" }
}
new window.Razorpay(options).open()
```

---

## Logistics Flow (Delhivery)

```
Payment Verified
      |
      v
createDelhiveryShipment(order)
      |
      |-- Build payload:
      |     shipments: [{
      |       name, add, pin, city, state, country,
      |       phone, order: orderNumber,
      |       payment_mode: "Prepaid",
      |       return_pin, return_city, return_add,    ← from DELHIVERY env vars
      |       return_phone, return_name,
      |       products_desc, hsn_code: "3304",
      |       cod_amount: 0,
      |       order_date, total_amount,
      |       waybill: ""                              ← Delhivery auto-assigns
      |     }]
      |     pickup_location: DELHIVERY_PICKUP_NAME
      |
      v
POST /api/create-packages-for-express-shipment
      |
      v
Response → waybill, sort_code, remark
      |
      v
updateOrder({ awbCode: waybill, courierName: "Delhivery",
              trackingUrl: "/track?order=ARA-xxx",
              orderStatus: "processing" })
```

**Tracking lookup:**
```
GET /api/delhivery/track?awb=1234567890
      |
      v
GET https://delhivery.com/api/v1/packages/json/?waybill=1234567890
      |
      v
Returns scan history → renders timeline on /track page
```

---

## Data Model

### Products (`src/data/products.ts`)

| id | name | price | originalPrice | variants |
|----|------|-------|---------------|---------|
| 1 | ARA Face Ice Bowl | ₹399 | ₹599 | Glacier White, Midnight Frost, Arctic Sage |
| 2 | Rose Petal Powder | ₹299 | ₹499 | — |
| 3 | Beetroot Powder | ₹199 | ₹349 | — |
| 4 | Mint Powder | ₹199 | ₹349 | — |
| 5 | Orange Peel Powder | ₹199 | ₹349 | — |
| 6 | Starter Ritual Combo | ₹599 | ₹996 | — |
| 7 | Pro Ritual Combo | ₹799 | ₹1,296 | — |

### Add-ons (during checkout)
4 powder sachets (30g) shown as upsell on product and checkout pages.

---

## Coupons

Defined in `src/lib/coupons.ts`:

| Code | Type | Value | Min Subtotal | Max Discount | Notes |
|------|------|-------|-------------|--------------|-------|
| `COLDTHERAPY` | percentage | 10% | — | — | |
| `WELCOME15` | percentage | 15% | — | ₹200 | First-time only |
| `ARAFRESH` | flat | ₹100 | ₹499 | — | |
| `ICEBOWL50` | flat | ₹50 | — | — | |
| `COMBO20` | percentage | 20% | ₹599 | ₹300 | |

```typescript
applyCoupon(code: string, subtotal: number): {
  valid: boolean,
  discount: number,
  coupon?: Coupon,
  error?: string
}
```

Validation order:
1. Code exists and is active
2. Not expired (`expiresAt`)
3. Subtotal meets minimum
4. Calculate raw discount
5. Apply `maxDiscount` cap
6. Clamp to subtotal (discount can't exceed what's owed)
