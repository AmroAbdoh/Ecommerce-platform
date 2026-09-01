# E-Commerce Platform - Architecture Documentation

## System Overview

The E-Commerce Platform is a full-stack MERN application with a clear separation of concerns between frontend (React/TypeScript) and backend (Express/Node.js). The system is designed to handle user authentication, product management, shopping cart operations, and Stripe-based payment processing.

## Architecture Layers

### 1. **Presentation Layer (Frontend)**

**Technology**: React 19 + TypeScript + Vite

**Components**:

- **Pages**: Full-page components for major features (Home, Cart, Auth, Profile, etc.)
- **Reusable Components**: Button, InputField, Navbar, ModalCheckout
- **Services Layer**: API client modules (authApi, productApi, cartApi, paymentApi)
- **Styling**: CSS modules and global styles

**Key Responsibilities**:

- User interface rendering
- Form handling and validation
- State management for cart and user data
- API communication via axios
- Stripe integration via @stripe/react-stripe-js

**Data Flow**:

```
User Action → Component State → API Service → Backend → Response → UI Update
```

### 2. **Application/Business Logic Layer (Frontend Services)**

**Location**: `front-end/src/services/`

**Modules**:

- `authApi.ts` - User authentication calls
- `productApi.ts` - Product data retrieval
- `cartApi.ts` - Shopping cart operations
- `paymentApi.ts` - Payment processing
- `becomeSellerAPI.ts` - Seller registration

**Responsibilities**:

- Centralized API communication
- Request/response handling
- Bearer token injection (JWT)
- Error handling and data transformation

**Configuration**:

```
Base URL: http://localhost:3000/api
Headers: Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### 3. **Backend API Layer**

**Technology**: Express.js + Node.js

**Structure**:

```
Backend
├── Routes Layer
│   ├── Endpoint definitions
│   ├── Middleware chain setup
│   └── Route guards (authenticateUser)
│
├── Controllers Layer
│   ├── Request validation
│   ├── Business logic execution
│   ├── Error handling
│   └── Response formatting
│
└── Service/Utility Layer
    ├── Database operations
    ├── External service integration
    └── Helper functions
```

**Route → Controller Flow**:

1. **Route Definition** (e.g., `POST /api/payments/process`)
2. **Middleware Chain** (authenticate, validate)
3. **Controller Execution** (process payment logic)
4. **Database Operations** (create order, update stock)
5. **Response Return** (success/error)

### 4. **Data Access Layer (Database)**

**Technology**: MongoDB + Mongoose ODM

**Data Models**:

```
User
├── Authentication data (email, password, role)
└── Profile information

Store
├── Owner reference (User)
├── Store details (name, logo, description)
└── Contact information

Product
├── Store reference
├── Product details (name, price, stock, category)
└── Images and description

Cart
├── Owner reference (User)
├── Items (array of product references + quantities)
└── Timestamps

Order
├── Owner reference (User)
├── Cart reference (single source of truth)
├── Payment metadata (Stripe paymentId, status)
└── Total amount and timestamps
```

## Key Data Flow Diagrams

### User Authentication Flow

```
Login Form
    ↓
→ POST /api/auth/login
    ↓
Backend: Validate credentials & create JWT
    ↓
← Return JWT token
    ↓
Frontend: Store in localStorage
    ↓
Axios Interceptor: Auto-inject in all requests
    ↓
Protected Routes: Verify token via authenticateUser middleware
```

### Shopping Cart Flow

```
Product Page
    ↓
User: Click "Add to Cart"
    ↓
Frontend: Check if own product (prevent self-purchase)
    ↓
→ POST /api/cart/add
    ↓
Backend: Validate & update Cart.items
    ↓
← Return updated cart
    ↓
Frontend: Update cart badge count
```

### Payment Processing Flow

```
Cart Page
    ↓
User: Click "Checkout"
    ↓
ModalCheckout Opens with Stripe CardElement
    ↓
User: Enter card details (test: 4242 4242 4242 4242)
    ↓
Frontend: stripe.createPaymentMethod()
    ↓
→ POST /api/payments/process
  {
    amount: totalInCents,
    paymentMethodId: Stripe_PM_ID,
    cartItems: [{ productId, quantity }]
  }
    ↓
Backend:
  1. Verify cart exists & not empty
  2. Validate product stock
  3. Confirm payment with Stripe
  4. Update product stock
  5. Create Order document
  6. Clear cart items
    ↓
← Return { orderId, success: true }
    ↓
Frontend: Clear cart, redirect to success
```

### Order Retrieval Flow

```
Profile/Orders Page
    ↓
→ GET /api/orders (with JWT)
    ↓
Backend: Find all orders for user
    ↓
Populate: Order → Cart → Products → Store
    ↓
← Return fully populated orders with product details
    ↓
Frontend: Display order history with items
```

## API Endpoint Architecture

### Authentication Endpoints

```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login & get JWT
POST   /api/auth/refresh         Refresh JWT token
```

### Product Endpoints

```
GET    /api/products             List all products (stock > 0)
GET    /api/products/:id         Get product details
POST   /api/products             Create product (seller)
PUT    /api/products/:id         Update product (seller)
DELETE /api/products/:id         Delete product (seller)
```

### Cart Endpoints

```
GET    /api/cart                 Get user cart
POST   /api/cart/add             Add item to cart
PUT    /api/cart/item/:itemId    Update quantity
DELETE /api/cart/item/:itemId    Remove item
DELETE /api/cart/clear           Clear cart
```

### Payment Endpoints

```
POST   /api/payments/create-intent      Create Stripe PaymentIntent
POST   /api/payments/process            Process payment & create order
```

### Order Endpoints

```
GET    /api/orders               List user orders
GET    /api/orders/:orderId      Get order details
```

## Middleware Architecture

### Authentication Middleware

```
authenticateUser
  ↓
Checks Authorization header
  ↓
Extracts & verifies JWT token
  ↓
Decodes userId & name
  ↓
Attaches to req.user
  ↓
Next middleware/controller
```

**Protected Routes**:

- All `/api/cart/*` endpoints
- All `/api/orders/*` endpoints
- All `/api/payments/*` endpoints
- Seller-specific product operations
- User profile endpoints

## Security Architecture

### Authentication

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Token Storage**: localStorage (frontend)
- **Auto-Injection**: Axios interceptor adds Authorization header

### Authorization

- **Role-Based**: User vs Seller roles
- **Ownership Verification**: Only store owners can modify products
- **Cart Ownership**: Users can only access their own cart

### Business Logic Validation

- **Self-Purchase Prevention**:
  - Frontend: Check product.store.owner === currentUserId
  - Backend: Validate in cartController
- **Stock Verification**: Ensure sufficient stock before payment
- **Amount Validation**: Verify calculated total matches requested amount

### Payment Security

- **Stripe Integration**: PCI-DSS compliant
- **No Card Storage**: Cards handled entirely by Stripe
- **Payment Confirmation**: Verify payment status before creating order
- **Automatic Stock Update**: Only after successful payment

## Error Handling Architecture

### Custom Error Classes

```
CustomAPIError (base)
├── BadRequestError (400)
├── UnauthenticatedError (401)
└── NotFoundError (404)
```

### Error Flow

```
Controller → Catch error
    ↓
Determine error type
    ↓
Create appropriate error instance
    ↓
Pass to next(error)
    ↓
Global error middleware
    ↓
Format & return response
```

### Frontend Error Handling

```
API Call (axios)
    ↓
Success: Process response
    ↓
Error: Catch & display to user
    ↓
Console logging for debugging
```

## Database Relationships

### Entity Relationship Diagram

```
User (1) ──→ (many) Store
    │
    ├──→ (many) Product (via Store)
    │
    ├──→ (1) Cart
    │
    └──→ (many) Order

Store (1) ──→ (many) Product

Product (1) ──→ (many) CartItem

Cart (1) ──→ (many) CartItem

Order (1) ──→ (1) Cart
```

## Performance Considerations

### Database Query Optimization

- **Populate Strategy**: Multi-level population for Order → Cart → Product → Store
- **Stock Filtering**: Filter stock > 0 at query level (not application)
- **Indexed Fields**: owner, category for faster searches

### Frontend Optimization

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety reduces runtime errors
- **Component Splitting**: Lazy-loaded pages via React Router
- **API Service Layer**: Centralized, cacheable API calls

### Payment Processing

- **Automatic Payment Methods**: Stripe handles redirect-based methods
- **Async Confirmations**: Payment processing doesn't block response

## Deployment Considerations

### Backend Deployment

- Environment variables for sensitive data
- MongoDB Atlas connection string
- Stripe API keys (test → production)
- CORS configuration for deployed frontend URL

### Frontend Deployment

- Build optimization: `npm run build`
- Environment variables for backend URL
- Stripe publishable key for production

### Environment Differences

```
Development:
  Backend: http://localhost:3000
  Frontend: http://localhost:5173
  Stripe: Test mode

Production:
  Backend: Production URL
  Frontend: Production URL
  Stripe: Live mode
```

## State Management Architecture

### Frontend State

- **Component State**: Local form state (login, checkout)
- **localStorage**: JWT token persistence
- **URL Params**: Product ID, category filters (via React Router)
- **No Redux/Context**: Kept simple for this scale

### Backend State

- **Database**: MongoDB as single source of truth
- **No Session State**: Stateless API design
- **No Caching**: Direct database queries (can add Redis later)

## Extensibility Points

### Future Enhancement Areas

1. **Search & Analytics**: Add Elasticsearch for product search
2. **Caching**: Implement Redis for frequently accessed data
3. **Real-time Features**: WebSocket integration for notifications
4. **Admin Dashboard**: Separate admin routes and UI
5. **Logging**: ELK stack for centralized logging
6. **Monitoring**: Application performance monitoring (APM)

## Summary

The architecture follows a classic three-tier pattern:

1. **Presentation** (React) - User interface
2. **Application** (Express) - Business logic & API
3. **Data** (MongoDB) - Persistent storage

This design provides:

- **Separation of Concerns**: Each layer has specific responsibility
- **Scalability**: Can be deployed independently
- **Maintainability**: Clear structure and dependencies
- **Security**: Multiple validation layers
- **Flexibility**: Easy to extend and modify

---

**Last Updated**: September 1, 2026
