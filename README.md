# 📄 Software Requirements Specification (SRS) — Imagify

**Project:** Imagify — AI Image Generation Web Application
**Repository:** [ManiishPal/imagify](https://github.com/ManiishPal/imagify)
**Version:** 1.0.0
**Date:** 2026-03-03
**Author:** ManiishPal

---

## 1. Introduction

### 1.1 Purpose
This SRS document provides a comprehensive description of the **Imagify** web application. It details the functional and non-functional requirements, system architecture, external interfaces, and constraints. The document serves as a reference for developers, testers, and stakeholders.

### 1.2 Scope
Imagify is a full-stack **AI-powered text-to-image generation** web application. Users can register, log in, enter text prompts, and receive AI-generated images. The platform uses a **credit-based system** where new users receive 5 free credits and can purchase additional credits through **Razorpay** payment integration.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| MERN | MongoDB, Express.js, React, Node.js |
| UI | User Interface |
| CORS | Cross-Origin Resource Sharing |

### 1.4 References
- GitHub Repository: https://github.com/ManiishPal/imagify
- Deployed Backend: https://imagify-backend-nu.vercel.app
- ClipDrop API: https://clipdrop-api.co/text-to-image/v1
- Razorpay Documentation: https://razorpay.com/docs/

### 1.5 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | ^19.1.0 |
| Build Tool | Vite | ^7.0.4 |
| Routing | react-router-dom | ^7.7.1 |
| CSS Framework | Tailwind CSS | ^3.4.17 |
| Animations | Motion (Framer Motion) | ^12.23.9 |
| Notifications | react-toastify | ^11.0.5 |
| HTTP Client | Axios | ^1.11.0 |
| Backend Framework | Express.js | ^5.1.0 |
| Database | MongoDB (via Mongoose) | ^8.16.4 |
| Authentication | JSON Web Token (jsonwebtoken) | ^9.0.2 |
| Password Hashing | bcrypt | ^6.0.0 |
| Payment Gateway | Razorpay | ^2.9.6 |
| AI Image API | ClipDrop Text-to-Image v1 | External |
| Deployment | Vercel | — |

### 1.6 Language Composition

| Language | Percentage |
|----------|-----------|
| JavaScript | 98.2% |
| HTML | 1.1% |
| CSS | 0.7% |
|
---

## 2. Overall Description

### 2.1 Product Perspective
Imagify is a standalone **SaaS-style** web application following a **client-server (monorepo)** architecture. It integrates with external services (ClipDrop AI API and Razorpay payment gateway) to deliver AI image generation and payment capabilities.

### 2.2 Product Functions (High-Level)
1. **User Authentication** — Registration and login with secure password hashing
2. **AI Image Generation** — Text-to-image generation using the ClipDrop API
3. **Credit Management** — Credit-based usage model with balance tracking
4. **Payment Processing** — Purchase credit plans via Razorpay
5. **User Dashboard** — View credit balance and generated images

### 2.3 User Classes and Characteristics

| User Class | Description |
|-----------|-------------|
| **Guest User** | Can view the landing page, description, testimonials, and steps. Cannot generate images. |
| **Registered User** | Has an account with a credit balance. Can log in, generate images, view results, and purchase credits. |

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server:** Node.js runtime hosted on Vercel
- **Database:** MongoDB Atlas (cloud)
- **Network:** Requires active internet connection for API calls

### 2.5 Design and Implementation Constraints
- The application relies on the **ClipDrop API** for image generation (third-party dependency)
- Payment processing is limited to **Razorpay** (primarily for INR/Indian market)
- No email verification on user registration
- No admin panel or admin user role
- ES Module (`"type": "module"`) syntax used across both client and server

### 2.6 Assumptions and Dependencies
- Users have a modern web browser with JavaScript enabled
- MongoDB Atlas is available and accessible
- ClipDrop API key is valid and has sufficient quota
- Razorpay credentials are correctly configured
- Environment variables are properly set on deployment

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐ │
│  │  Pages   │ │Components│ │  Context   │ │     Assets       │ │
│  │ - Home   │ │ - Navbar │ │ AppContext │ │  (images, icons) │ │
│  │ - Result │ │ - Footer │ │            │ │                  │ │
│  │ - Buy    │ │ - Login  │ │            │ │                  │ │
│  │  Credit  │ │ - Header │ │            │ │                  │ │
│  │          │ │ - Steps  │ │            │ │                  │ │
│  │          │ │-Descript.│ │            │ │                  │ │
│  │          │ │-Testimon.│ │            │ │                  │ │
│  │          │ │-Generate │ │            │ │                  │ │
│  │          │ │   Btn    │ │            │ │                  │ │
│  └──────────┘ └──────────┘ └────────────┘ └──────────────────┘ │
│                            │ Axios HTTP                         │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER (Express.js + Node.js)               │
│  ┌──────────┐ ┌───────────────┐ ┌───────────┐ ┌─────────────┐ │
│  │  Routes  │ │  Controllers  │ │Middlewares│ │   Config    │ │
│  │ - /user  │ │ - userCtrl    │ │ - auth.js │ │ - mongodb.js│ │
│  │ - /image │ │ - imageCtrl   │ │   (JWT)   │ │             │ │
│  └──────────┘ └───────────────┘ └───────────┘ └─────────────┘ │
│  ┌──────────────────────┐                                       │
│  │       Models         │                                       │
│  │ - userModel          │                                       │
│  │ - transcationModel   │                                       │
│  └──────────────────────┘                                       │
└────────────────┬──────────────────────┬─────────────────────────┘
                 │                      │
                 ▼                      ▼
         ┌──────────────┐     ┌──────────────────┐
         │  MongoDB     │     │  External APIs   │
         │  (Atlas)     │     │ - ClipDrop AI    │
         │              │     │ - Razorpay       │
         └──────────────┘     └──────────────────┘
```

### 3.2 Directory Structure

```
imagify/
├── .gitignore
├── README.md
├── client/                          # Frontend (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── vercel.json
│   ├── public/
│   └── src/
│       ├── main.jsx                 # Entry point
│       ├── App.jsx                  # Root component with routing
│       ├── index.css                # Global styles
│       ├── assets/                  # Static images & icons
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Login.jsx
│       │   ├── Header.jsx
│       │   ├── Steps.jsx
│       │   ├── Description.jsx
│       │   ├── Testimonials.jsx
│       │   └── GenerateBtn.jsx
│       ├── context/
│       │   └── AppContext.jsx       # Global state management
│       └── pages/
│           ├── Home.jsx
│           ├── Result.jsx
│           └── BuyCredit.jsx
└── server/                          # Backend (Express.js)
    ├── server.js                    # App entry point
    ├── package.json
    ├── config/
    │   └── mongodb.js               # DB connection
    ├── controllers/
    │   ├── userController.js        # Auth, credits, payments
    │   └── imageController.js       # Image generation
    ├── middlewares/
    │   └── auth.js                  # JWT authentication
    ├── models/
    │   ├── userModel.js             # User schema
    │   └── transcationModel.js      # Transaction schema
    └── routes/
        ├── userRoute.js             # User-related endpoints
        └── imageRoute.js            # Image-related endpoints
```

---

## 4. Functional Requirements

### 4.1 User Registration (FR-001)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-001 |
| **Priority** | High |
| **Description** | The system shall allow new users to create an account. |

**Detailed Requirements:**
- The system shall accept `name`, `email`, and `password` from the user.
- The system shall validate that all three fields are provided (non-empty).
- The system shall hash the password using `bcrypt` with a salt round of 10 before storing.
- The system shall store the user in MongoDB with a default `creditBalance` of **5**.
- Upon successful registration, the system shall return a **JWT token** and the user's name.
- If any field is missing, the system shall return `{success: false, message: "Missing Details"}`.

**API Endpoint:**
```
POST /api/user/register
Body: { name: string, email: string, password: string }
Response: { success: boolean, token: string, user: { name: string } }
```

### 4.2 User Login (FR-002)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-002 |
| **Priority** | High |
| **Description** | The system shall allow registered users to log in. |

**Detailed Requirements:**
- The system shall accept `email` and `password`.
- The system shall look up the user by email in MongoDB.
- The system shall compare the provided password with the stored hashed password using `bcrypt.compare`.
- On successful match, the system shall return a JWT token and the user's name.
- If the user is not found, return `{success: false, message: "User does not found"}`.
- If credentials are invalid, return `{success: false, message: "Invalid credentials"}`.

**API Endpoint:**
```
POST /api/user/login
Body: { email: string, password: string }
Response: { success: boolean, token: string, user: { name: string } }
```

### 4.3 JWT Authentication Middleware (FR-003)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-003 |
| **Priority** | High |
| **Description** | The system shall authenticate protected API routes using JWT. |

**Detailed Requirements:**
- The system shall extract the `token` from request headers.
- If no token is present, return `{success: false, message: "Not Authorized, Login again"}`.
- The system shall verify the token using `jwt.verify` with the `JWT_SECRET` environment variable.
- If valid, the decoded `userId` shall be injected into `req.body.userId`.
- If invalid or expired, return an authorization error.

### 4.4 View User Credits (FR-004)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-004 |
| **Priority** | High |
| **Description** | The system shall allow authenticated users to view their credit balance. |

**API Endpoint:**
```
GET /api/user/credits
Headers: { token: string }
Response: { success: boolean, credits: number, user: { name: string } }
```

### 4.5 AI Image Generation (FR-005)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-005 |
| **Priority** | High |
| **Description** | The system shall generate images from text prompts using the ClipDrop API. |

**Detailed Requirements:**
- The system shall accept a `prompt` (text) from the authenticated user.
- The system shall verify the user exists and the prompt is provided.
- The system shall check the user's `creditBalance` is greater than 0.
- If insufficient credits, return `{success: false, message: "No credit Balance"}`.
- The system shall send the prompt to the ClipDrop API (`https://clipdrop-api.co/text-to-image/v1`).
- The system shall convert the returned binary image data to a **base64-encoded PNG** string.
- The system shall decrement the user's `creditBalance` by 1.
- The system shall return the generated image and updated credit balance.

**API Endpoint:**
```
POST /api/image/generate-image
Headers: { token: string }
Body: { prompt: string }
Response: { success: boolean, message: string, creditBalance: number, resultImage: string }
```

### 4.6 Purchase Credits — Initiate Payment (FR-006)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-006 |
| **Priority** | High |
| **Description** | The system shall allow users to purchase credit plans via Razorpay. |

**Credit Plans:**

| Plan ID | Plan Name | Credits | Amount (INR) |
|---------|-----------|---------|-------------|
| Basic | Basic | 100 | ₹10 |
| Advanced | Advanced | 500 | ₹50 |
| Business | Business | 5,000 | ₹250 |

**Detailed Requirements:**
- The system shall accept `planId` from the authenticated user.
- The system shall validate the plan exists (Basic, Advanced, or Business).
- The system shall create a **Transaction** record in MongoDB with `payment: false`.
- The system shall create a Razorpay order with `amount * 100` (paise).
- The system shall return the Razorpay order object.

**API Endpoint:**
```
POST /api/user/pay-razor
Headers: { token: string }
Body: { planId: string }
Response: { success: boolean, order: object }
```

### 4.7 Verify Payment (FR-007)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-007 |
| **Priority** | High |
| **Description** | The system shall verify Razorpay payment and add credits to the user's account. |

**Detailed Requirements:**
- The system shall accept `razorpay_order_id`.
- The system shall fetch order info from Razorpay.
- If order status is `'paid'`:
  - Look up the transaction by `receipt` (transaction ID).
  - If `payment` is already `true`, return failure (duplicate payment guard).
  - Add the plan's credits to the user's `creditBalance`.
  - Mark the transaction as `payment: true`.
  - Return success with "Credits Added" message.
- If not paid, return `{success: false, message: "Payment Failed"}`.

**API Endpoint:**
```
POST /api/user/verify-razor
Body: { razorpay_order_id: string }
Response: { success: boolean, message: string }
```

### 4.8 Frontend Routing (FR-008)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-008 |
| **Priority** | Medium |
| **Description** | The system shall provide client-side routing for the SPA. |

**Routes:**

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | `Home` | Landing page with Header, Steps, Description, Testimonials, GenerateBtn |
| `/result` | `Result` | Image generation prompt input and result display |
| `/buy` | `BuyCredit` | Credit purchase plans and payment initiation |

### 4.9 Login/Signup Modal (FR-009)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-009 |
| **Priority** | Medium |
| **Description** | The system shall display a modal dialog for Login and Sign Up. |

**Detailed Requirements:**
- The modal shall toggle between "Login" and "Sign Up" modes.
- The modal visibility shall be controlled via `showLogin` state in `AppContext`.
- On successful login/register, the token shall be stored (via context) and the modal dismissed.

---

## 5. Data Models

### 5.1 User Model

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `name` | String | Yes | — | — |
| `email` | String | Yes | — | Unique |
| `password` | String | Yes | — | Stored as bcrypt hash |
| `creditBalance` | Number | No | 5 | — |

### 5.2 Transaction Model

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `userId` | String | Yes | — | Reference to User |
| `plan` | String | Yes | — | Plan name (Basic/Advanced/Business) |
| `amount` | Number | Yes | — | Amount in INR |
| `credits` | Number | Yes | — | Credits purchased |
| `payment` | Boolean | No | `false` | Payment status |
| `date` | Number | No | — | Timestamp (`Date.now()`) |

---

## 6. API Specification Summary

### 6.1 User Routes (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/user/register` | No | Register a new user |
| POST | `/api/user/login` | No | Login an existing user |
| GET | `/api/user/credits` | JWT | Get user credit balance |
| POST | `/api/user/pay-razor` | JWT | Initiate Razorpay payment |
| POST | `/api/user/verify-razor` | No | Verify Razorpay payment |

### 6.2 Image Routes (`/api/image`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/image/generate-image` | JWT | Generate image from text prompt |

### 6.3 Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Returns "API Working" |

---

## 7. Non-Functional Requirements

### 7.1 Performance (NFR-001)
- The server shall handle API requests on default port **4000** (configurable via `PORT` env).
- Image generation latency depends on the external ClipDrop API response time.
- The database connection shall be established at server startup using `await connectDB()`.

### 7.2 Security (NFR-002)
- Passwords shall be hashed using **bcrypt** with salt rounds of 10.
- JWT tokens shall be used for authenticating protected routes.
- API keys and secrets shall be stored in **environment variables** (via `dotenv`), never hardcoded.
- **CORS** shall be enabled for cross-origin frontend-to-backend communication.

### 7.3 Scalability (NFR-003)
- The application follows a **monorepo** with independent `client/` and `server/` deployments.
- Both client and server are deployable on **Vercel** (vercel.json configuration present).

### 7.4 Usability (NFR-004)
- The UI shall be **responsive** across mobile, tablet, and desktop using Tailwind CSS utility classes (`px-4 sm:px-10 md:px-14 lg:px-28`).
- The UI shall use a **gradient background** (`from-teal-50 to-orange-50`) for visual appeal.
- Toast notifications (`react-toastify`) shall appear at the **bottom-right** of the screen.
- Animations shall be provided via the **Motion** library.

### 7.5 Reliability (NFR-005)
- All controller functions shall have **try-catch** error handling.
- Error messages shall be returned in a consistent JSON format: `{success: false, message: string}`.
- Transaction records shall track `payment: false` until verified, preventing credit without payment.

### 7.6 Deployment (NFR-006)
- The frontend shall be built using `vite build` and deployed to Vercel.
- The backend shall be deployed to Vercel as a serverless function.
- Both `client/vercel.json` exists for deployment configuration.

---

## 8. External Interface Requirements

### 8.1 ClipDrop API
| Property | Value |
|----------|-------|
| Endpoint | `https://clipdrop-api.co/text-to-image/v1` |
| Method | POST |
| Auth | `x-api-key` header |
| Request | FormData with `prompt` field |
| Response | Binary image data (arraybuffer) |
| Env Variable | `CLIPDROP_API` |

### 8.2 Razorpay Payment Gateway
| Property | Value |
|----------|-------|
| SDK | `razorpay` npm package |
| Auth | `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` |
| Currency | Configurable via `CURRENCY` env variable |
| Order Amount | In **paise** (amount × 100) |

### 8.3 MongoDB
| Property | Value |
|----------|-------|
| ORM | Mongoose ^8.16.4 |
| Connection | `MONGODB_URI` env variable |
| Database Name | `imagify` |

---

## 9. Environment Variables

| Variable | Description | Used In |
|----------|-------------|---------|
| `PORT` | Server port (default: 4000) | server.js |
| `MONGODB_URI` | MongoDB connection string | config/mongodb.js |
| `JWT_SECRET` | Secret key for JWT signing/verification | userController.js, auth.js |
| `CLIPDROP_API` | ClipDrop API key for image generation | imageController.js |
| `RAZORPAY_KEY_ID` | Razorpay key ID | userController.js |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | userController.js |
| `CURRENCY` | Payment currency code (e.g., INR) | userController.js |

---

## 10. Frontend Component Hierarchy

```
App
├── ToastContainer
├── Navbar
├── Login (conditional: showLogin)
├── Routes
│   ├── "/" → Home
│   │        ├── Header
│   │        ├── Steps
│   │        ├── Description
│   │        ├── Testimonials
│   │        └── GenerateBtn
│   ├── "/result" → Result
│   └── "/buy" → BuyCredit
└── Footer
```

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **Credit** | A unit of currency within the application; 1 credit = 1 image generation |
| **Prompt** | A text description provided by the user to generate an AI image |
| **Transaction** | A record of a credit purchase attempt through Razorpay |
| **ClipDrop** | Third-party AI API service used for text-to-image generation |
| **Razorpay** | Indian payment gateway used for processing credit purchases |

---

## 12. Appendix

### A. Complete API Request/Response Examples

**Register:**
```json
// Request
POST /api/user/register
{ "name": "John", "email": "john@example.com", "password": "secret123" }

// Response (success)
{ "success": true, "token": "eyJhbGci...", "user": { "name": "John" } }
```

**Generate Image:**
```json
// Request
POST /api/image/generate-image
Headers: { "token": "eyJhbGci..." }
{ "prompt": "A sunset over mountains" }

// Response (success)
{ "success": true, "message": "Image Generated", "creditBalance": 4, "resultImage": "data:image/png;base64,..." }
```

### B. Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-03-03 | Initial SRS document created from codebase analysis |