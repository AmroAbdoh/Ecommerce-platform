# E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, product browsing, shopping cart, and Stripe payment integration.

## Features

### 🛍️ Shopping Features

- **Browse Products**: View all available products with real-time stock status
- **Product Filtering**: Filter products by category and store
- **Out-of-Stock Protection**: Products with zero stock are automatically hidden
- **Shopping Cart**: Add/remove items, adjust quantities
- **Product Details**: View comprehensive product information for each item
- **Self-Purchase Prevention**: Users cannot purchase their own products

### 💳 Payment & Orders

- **Stripe Integration**: Secure payment processing with Stripe
- **Order Management**: Track and view order history
- **Payment Processing**: Automated order creation and cart clearing after successful payment
- **Stock Management**: Automatic inventory updates after purchase

### 🏪 Seller Features

- **Store Management**: Create and manage your own store
- **Product Management**: Create, update, and delete products
- **Inventory Control**: Set and manage product stock levels
- **Sales Tracking**: View all orders for your products

### 👤 User Features

- **Authentication**: Secure JWT-based authentication
- **User Profiles**: Manage user information
- **Order History**: View all past orders and details
- **Cart Management**: Persistent shopping cart with item management

### ⭐ Product Features

- **Category System**: Organize products by categories
- **Product Images**: Support for multiple product images
- **Search & Filter**: Advanced filtering options

## Tech Stack

### Frontend

- **React 19.2.8** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router 7.18.3** - Client-side routing
- **Axios** - HTTP client
- **@stripe/react-stripe-js** - Stripe payment integration
- **CSS** - Styling (custom CSS modules)

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Stripe** - Payment processing
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **http-status-codes** - HTTP status codes

## Project Structure

```
Ecommerce-platform/
├── back-end/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── productController.js     # Product CRUD operations
│   │   ├── cartController.js        # Shopping cart logic
│   │   ├── paymentController.js     # Stripe payment processing
│   │   ├── orderController.js       # Order management
│   │   ├── userController.js        # User management
│   │   ├── storeController.js       # Store management
│   │   └── categoryController.js    # Category management
│   ├── middleware/
│   │   └── authenticateUser.js      # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Product.js               # Product schema
│   │   ├── Cart.js                  # Shopping cart schema
│   │   ├── Order.js                 # Order schema
│   │   └── Store.js                 # Store schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── productRoutes.js         # Product endpoints
│   │   ├── cartRoutes.js            # Cart endpoints
│   │   ├── paymentRoutes.js         # Payment endpoints
│   │   ├── orderRoutes.js           # Order endpoints
│   │   ├── userRoutes.js            # User endpoints
│   │   ├── storeRoutes.js           # Store endpoints
│   │   └── categoryRoutes.js        # Category endpoints
│   ├── errors/
│   │   ├── custom-api.js            # Custom error class
│   │   ├── bad-request.js           # 400 error
│   │   ├── not-found.js             # 404 error
│   │   ├── unauthenticated.js       # 401 error
│   │   └── index.js                 # Error exports
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/              # Reusable button component
│   │   │   ├── InputField/          # Reusable input component
│   │   │   ├── Navbar/              # Navigation bar
│   │   │   └── ModalCheckout/       # Stripe payment modal
│   │   ├── pages/
│   │   │   ├── Auth/                # Login/Register pages
│   │   │   ├── Home/                # Product browsing page
│   │   │   ├── Cart/                # Shopping cart page
│   │   │   ├── ProductDetail/       # Product detail page
│   │   │   ├── Profile/             # User profile page
│   │   │   ├── BecomeSeller/        # Seller registration
│   │   │   └── ManageStore/         # Store management
│   │   ├── services/
│   │   │   ├── authApi.ts           # Auth API calls
│   │   │   ├── productApi.ts        # Product API calls
│   │   │   ├── cartApi.ts           # Cart API calls
│   │   │   ├── paymentApi.ts        # Payment API calls
│   │   │   └── becomeSellerAPI.ts   # Seller API calls
│   │   ├── context/                 # React context (if any)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── types/                   # TypeScript types
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # React entry point
│   │   ├── routes.tsx               # Route definitions
│   │   └── index.css                # Global styles
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── package.json
│
└── README.md                         # This file
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Stripe account (for payments)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AmroAbdoh/Ecommerce-platform.git
cd Ecommerce-platform
```

2. **Backend Setup**

```bash
cd back-end
npm install
```

3. **Frontend Setup**

```bash
cd ../front-end
npm install
```

### Environment Variables

**Backend** - Create `.env` file in `back-end/`:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_LIFETIME=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

**Frontend** - Create `.env` file in `front-end/`:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Running the Application

**From the root directory:**

```bash
npm run dev
```

This will start both frontend (port 5173) and backend (port 3000) simultaneously.

Or run separately:

**Backend:**

```bash
cd back-end
npm run dev
```

**Frontend:**

```bash
cd front-end
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Products

- `GET /api/products` - Get all products (with stock > 0)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Shopping Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update item quantity
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details

### Payments

- `POST /api/payments/create-intent` - Create Stripe PaymentIntent
- `POST /api/payments/process` - Process payment and create order

### Store

- `POST /api/stores` - Create store (seller)
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store

### User

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Key Features Implementation

### Stripe Payment Flow

1. User adds items to cart
2. Clicks "Checkout" button
3. Modal opens with payment form
4. User enters card details (test card: 4242 4242 4242 4242)
5. Frontend creates PaymentMethod via Stripe
6. Backend confirms payment and creates Order
7. Product stock is updated
8. Cart is cleared
9. User receives order confirmation

### Self-Purchase Prevention

- Frontend checks if `product.store.owner === currentUserId`
- Disables "Add to Cart" button for own products
- Shows "Your Product" label
- Backend validates in cartController to prevent bypass

### Stock Management

- Products with stock = 0 are hidden from home page
- Stock is decremented on successful payment
- Sellers can update stock via ManageStore page

### Authentication

- JWT tokens stored in localStorage
- Automatic token injection in API requests via axios interceptor
- Protected routes require valid token
- Token includes userId and username

## Testing

### Test Payment Card

- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- This card always succeeds in Stripe test mode

## Database Schema Overview

### User

- Email, password, name, role (buyer/seller)

### Product

- Name, description, price, stock, category, images
- Reference to Store owner

### Cart

- Owner (User reference), items array with product and quantity
- Timestamps for tracking

### Order

- Owner (User reference), cart reference, total amount
- Stripe paymentId, status, timestamps

### Store

- Name, logo, description, owner (User reference)
- Contact and address information

## Deployment

Ready to deploy to production:

1. Use MongoDB Atlas for database
2. Deploy backend to services like Heroku, Railway, or AWS
3. Deploy frontend to Vercel, Netlify, or AWS S3
4. Update API URLs and Stripe keys for production mode
5. Switch Stripe from test to live mode

## Future Enhancements

- [ ] Product search functionality
- [ ] Advanced filters (price range, ratings)
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Real-time order tracking
- [ ] Refund management
- [ ] User ratings and feedback
- [ ] Promotional codes and discounts

## Contributing

Feel free to fork and submit pull requests for improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the repository.

---

**Happy Shopping! 🛒**
