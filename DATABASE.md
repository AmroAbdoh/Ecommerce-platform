# E-Commerce Platform - Database Schema Documentation

## Overview

The E-Commerce Platform uses MongoDB with Mongoose ODM. MongoDB stores data in **collections** (similar to tables in SQL) with **documents** (similar to rows). Each document is a JSON-like object with fields.

---

## 1. USER Collection

**Purpose**: Store user account information and authentication data

### Schema Fields

| Field Name  | Data Type | Required | Unique | Description                                   |
| ----------- | --------- | -------- | ------ | --------------------------------------------- |
| `_id`       | ObjectId  | Yes      | Yes    | Auto-generated MongoDB ID                     |
| `email`     | String    | Yes      | Yes    | User's email address (login credential)       |
| `password`  | String    | Yes      | No     | Hashed password (bcryptjs)                    |
| `name`      | String    | Yes      | No     | User's full name                              |
| `role`      | Enum      | Yes      | No     | Either "buyer" or "seller" (default: "buyer") |
| `createdAt` | Date      | Auto     | No     | Account creation timestamp                    |
| `updatedAt` | Date      | Auto     | No     | Last update timestamp                         |

### Example Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "email": "john@example.com",
  "password": "$2b$10$encrypted_hash_here",
  "name": "John Doe",
  "role": "buyer",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

### Key Relationships

- **One User → Many Products** (via Store)
- **One User → One Cart**
- **One User → Many Orders**

---

## 2. STORE Collection

**Purpose**: Store seller shop information

### Schema Fields

| Field Name    | Data Type      | Required | Unique | Description                |
| ------------- | -------------- | -------- | ------ | -------------------------- |
| `_id`         | ObjectId       | Yes      | Yes    | Auto-generated MongoDB ID  |
| `name`        | String         | Yes      | No     | Store/shop name            |
| `logo`        | String         | No       | No     | URL to store logo image    |
| `description` | String         | No       | No     | Store description          |
| `owner`       | ObjectId (ref) | Yes      | Yes    | Reference to User (seller) |
| `street`      | String         | No       | No     | Store street address       |
| `city`        | String         | No       | No     | Store city                 |
| `state`       | String         | No       | No     | Store state/province       |
| `zipCode`     | String         | No       | No     | Store postal/zip code      |
| `country`     | String         | No       | No     | Store country              |
| `phone`       | String         | No       | No     | Store contact phone        |
| `createdAt`   | Date           | Auto     | No     | Store creation timestamp   |
| `updatedAt`   | Date           | Auto     | No     | Last update timestamp      |

### Example Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  "name": "TechHub Store",
  "logo": "https://example.com/store-logo.png",
  "description": "Premium electronics and gadgets",
  "owner": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "street": "123 Market St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "+1-555-1234",
  "createdAt": "2026-01-20T14:20:00Z",
  "updatedAt": "2026-01-20T14:20:00Z"
}
```

### Key Relationships

- **One Store ← One User** (owner)
- **One Store → Many Products**

---

## 3. PRODUCT Collection

**Purpose**: Store product catalog information

### Schema Fields

| Field Name    | Data Type      | Required | Unique | Description                                        |
| ------------- | -------------- | -------- | ------ | -------------------------------------------------- |
| `_id`         | ObjectId       | Yes      | Yes    | Auto-generated MongoDB ID                          |
| `name`        | String         | Yes      | No     | Product name                                       |
| `description` | String         | Yes      | No     | Detailed product description                       |
| `price`       | Number         | Yes      | No     | Product price in USD                               |
| `images`      | Array[String]  | No       | No     | Array of image URLs                                |
| `stock`       | Number         | No       | No     | Available inventory quantity (default: 0)          |
| `category`    | String         | Yes      | No     | Product category (e.g., "Electronics", "Clothing") |
| `store`       | ObjectId (ref) | Yes      | No     | Reference to Store (owner)                         |
| `createdAt`   | Date           | Auto     | No     | Product creation timestamp                         |
| `updatedAt`   | Date           | Auto     | No     | Last update timestamp                              |

### Example Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k3"),
  "name": "Wireless Headphones",
  "description": "High-quality Bluetooth headphones with noise cancellation",
  "price": 79.99,
  "images": [
    "https://example.com/headphones-1.jpg",
    "https://example.com/headphones-2.jpg"
  ],
  "stock": 45,
  "category": "Electronics",
  "store": ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  "createdAt": "2026-02-01T08:00:00Z",
  "updatedAt": "2026-02-15T12:30:00Z"
}
```

### Key Features

- **Stock Filtering**: Products with `stock: 0` are hidden from home page
- **Stock Update**: Decremented after successful payment
- **Relationships**:
  - **Many Products ← One Store**
  - **Many Products → Many CartItems** (via Cart)
  - **Many Products → Many OrderItems** (via Order)

---

## 4. CART Collection

**Purpose**: Store shopping cart data for each user

### Schema Fields

| Field Name         | Data Type      | Required | Unique | Description                         |
| ------------------ | -------------- | -------- | ------ | ----------------------------------- |
| `_id`              | ObjectId       | Yes      | Yes    | Auto-generated MongoDB ID           |
| `owner`            | ObjectId (ref) | Yes      | Yes    | Reference to User (unique per user) |
| `items`            | Array[Object]  | No       | No     | Array of cart items                 |
| `items[].product`  | ObjectId (ref) | Yes      | No     | Reference to Product                |
| `items[].quantity` | Number         | Yes      | No     | Quantity of this product in cart    |
| `createdAt`        | Date           | Auto     | No     | Cart creation timestamp             |
| `updatedAt`        | Date           | Auto     | No     | Last update timestamp               |

### Example Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k4"),
  "owner": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "items": [
    {
      "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k5"),
      "product": ObjectId("65a1b2c3d4e5f6g7h8i9j0k3"),
      "quantity": 2
    },
    {
      "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k6"),
      "product": ObjectId("65a1b2c3d4e5f6g7h8i9j0k7"),
      "quantity": 1
    }
  ],
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-02-18T15:45:00Z"
}
```

### Key Operations

- **Add Item**: Push new item object to `items` array
- **Remove Item**: Pull specific item from array
- **Update Quantity**: Find item and update its quantity
- **Clear Cart**: Set items to empty array `[]`

### Key Relationships

- **One Cart ← One User** (owner, unique)
- **One Cart → Many Products** (via items array)

---

## 5. ORDER Collection

**Purpose**: Store completed purchase orders

### Schema Fields

| Field Name                | Data Type      | Required | Unique | Description                                                 |
| ------------------------- | -------------- | -------- | ------ | ----------------------------------------------------------- |
| `_id`                     | ObjectId       | Yes      | Yes    | Auto-generated MongoDB ID                                   |
| `owner`                   | ObjectId (ref) | Yes      | No     | Reference to User who placed order                          |
| `cart`                    | ObjectId (ref) | Yes      | No     | Reference to Cart (snapshot of purchase)                    |
| `total`                   | Number         | Yes      | No     | Total order amount in USD                                   |
| `paymentId`               | String         | Yes      | No     | Stripe payment intent ID (for tracking)                     |
| `status`                  | Enum           | Yes      | No     | Order status ("pending", "completed", "failed", "refunded") |
| `shippingAddress`         | Object         | No       | No     | Shipping address details                                    |
| `shippingAddress.street`  | String         | No       | No     | Shipping street                                             |
| `shippingAddress.city`    | String         | No       | No     | Shipping city                                               |
| `shippingAddress.state`   | String         | No       | No     | Shipping state                                              |
| `shippingAddress.zipCode` | String         | No       | No     | Shipping zip code                                           |
| `shippingAddress.country` | String         | No       | No     | Shipping country                                            |
| `createdAt`               | Date           | Auto     | No     | Order creation timestamp                                    |
| `updatedAt`               | Date           | Auto     | No     | Last update timestamp                                       |

### Example Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k8"),
  "owner": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "cart": ObjectId("65a1b2c3d4e5f6g7h8i9j0k4"),
  "total": 159.97,
  "paymentId": "pi_1234567890abcdef",
  "status": "completed",
  "shippingAddress": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  },
  "createdAt": "2026-02-18T16:00:00Z",
  "updatedAt": "2026-02-18T16:00:00Z"
}
```

### Key Design Decision

- **Cart Reference** instead of duplicating items
  - **Why?**: Preserves exact cart state at time of purchase
  - **Benefit**: Can trace back what customer actually ordered
  - **Querying**: Populate cart to see products and quantities

### Key Relationships

- **Many Orders ← One User** (owner)
- **One Order → One Cart** (reference)
- **Via Cart → Products and Quantities**

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    USER     │
├─────────────┤
│ _id (PK)    │
│ email       │ ◄─────┐
│ password    │       │ (unique)
│ name        │       │
│ role        │       │
│ createdAt   │       │
│ updatedAt   │       │
└─────────────┘       │
      ▲               │
      │               │
      │               │
      │ 1:1           │ 1:1
      └───────────────┘

    STORE ◄────────── USER (owner)
    ├─ _id (PK)      │
    ├─ name          │ 1:many
    ├─ logo          │
    ├─ description   │
    ├─ owner (FK)    │
    └─ ...addresses  │
         │           │
         │ 1:many    │
         │           │
      PRODUCT        │
      ├─ _id (PK)    │
      ├─ name        │
      ├─ price       │
      ├─ stock       │
      ├─ category    │
      └─ store (FK)  │
         │           │
         │ many      │
         │           │
    ┌────┴──────┐    │
    │            │    │
      CART
     ├─ _id
     ├─ owner (FK)
     ├─ items[]
     │  ├─ product (FK)
     │  └─ quantity
     └─ ...

ORDER
├─ _id
├─ owner (FK) ────► USER
├─ cart (FK) ─────► CART ──► PRODUCTS
├─ total
├─ paymentId (Stripe)
└─ status
```

---

## Data Flow During Purchase

### Step 1: Adding to Cart

```
1. User clicks "Add to Cart" on Product
   → Frontend checks: product.store.owner !== currentUserId
   → POST /api/cart/add { productId, quantity }

2. Backend:
   → Find Cart by owner (User)
   → Check if product already in cart
   → If yes: increment quantity
   → If no: add new item to items[]
   → Save Cart

3. Database Change:
   CART.items.push({ product: ObjectId, quantity: 1 })
```

### Step 2: Checkout & Payment

```
1. User submits payment in ModalCheckout
   → Stripe creates PaymentMethod
   → Frontend: POST /api/payments/process
     {
       amount: totalInCents,
       paymentMethodId: Stripe_PM_ID,
       cartItems: [{ productId, quantity }]
     }

2. Backend:
   a) Get Cart from database
      SELECT * FROM CART WHERE owner = userId

   b) Verify stock for each product
      FOR EACH item IN cart.items
        SELECT stock FROM PRODUCT WHERE _id = productId
        IF stock < quantity THEN reject

   c) Create Stripe PaymentIntent
      Stripe API call with PaymentMethod
      Wait for confirmation (status = "succeeded")

   d) UPDATE products (reduce stock)
      FOR EACH item IN cart.items
        UPDATE PRODUCT SET stock = stock - quantity

   e) CREATE Order
      INSERT INTO ORDER {
        owner: userId,
        cart: cartId,
        total: calculatedTotal,
        paymentId: stripePaymentId,
        status: "completed"
      }

   f) CLEAR Cart
      UPDATE CART SET items = [] WHERE owner = userId

3. Response to Frontend
   ← { success: true, orderId: newOrderId }

4. Frontend clears cart and redirects
```

---

## Database Indexing Strategy

To optimize queries, these fields are indexed:

| Collection | Indexed Field | Type    | Purpose                     |
| ---------- | ------------- | ------- | --------------------------- |
| User       | email         | Unique  | Fast login lookups          |
| Store      | owner         | Unique  | One store per seller        |
| Product    | store         | Regular | Find products by store      |
| Product    | category      | Regular | Filter by category          |
| Product    | stock         | Regular | Hidden products (stock = 0) |
| Cart       | owner         | Unique  | One cart per user           |
| Order      | owner         | Regular | Find user's orders          |

---

## Collection Size Examples

### Typical Database

```
Users: 5,000 documents (~500KB)
Stores: 500 documents (~100KB)
Products: 10,000 documents (~5MB)
Carts: 5,000 documents (~2MB) - mostly empty items
Orders: 50,000 documents (~10MB)

Total: ~18MB+ (highly scalable)
```

---

## Query Examples

### Get User's Cart with Product Details

```javascript
db.carts
  .findOne({ owner: userId })
  .populate("items.product", "name price images")
  .populate("items.product.store", "name logo owner");
```

### Get User's Order History

```javascript
db.orders
  .find({ owner: userId })
  .populate({
    path: "cart",
    populate: {
      path: "items.product",
      select: "name price images category store",
      populate: { path: "store", select: "name" },
    },
  })
  .sort({ createdAt: -1 });
```

### Get All Products for Sale (with stock > 0)

```javascript
db.products.find({ stock: { $gt: 0 } }).populate("store", "name logo owner");
```

---

## Summary Table

| Table   | Purpose          | Key Unique Field | Count |
| ------- | ---------------- | ---------------- | ----- |
| User    | User accounts    | email            | ~5K   |
| Store   | Seller stores    | owner            | ~500  |
| Product | Product catalog  | \_id             | ~10K  |
| Cart    | Shopping carts   | owner            | ~5K   |
| Order   | Purchase history | \_id             | ~50K  |

---

This documentation provides everything you need to draw your database schema! Each collection has clear field definitions, example documents, relationships, and data flow explanations.
