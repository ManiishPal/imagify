# System Design Architecture Presentation — Imagify

**Project:** Imagify — AI-Powered Text-to-Image Generation Platform
**Repository:** [ManiishPal/imagify](https://github.com/ManiishPal/imagify)
**Date:** 2026-03-14
**Author:** Manish Pal

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architectural Style & Patterns](#3-architectural-style--patterns)
4. [High-Level System Architecture](#4-high-level-system-architecture)
5. [UML Diagrams](#5-uml-diagrams)
   - 5.1 [Component Diagram](#51-component-diagram)
   - 5.2 [Class Diagram](#52-class-diagram)
   - 5.3 [Sequence Diagrams](#53-sequence-diagrams)
   - 5.4 [Deployment Diagram](#54-deployment-diagram)
   - 5.5 [Use Case Diagram](#55-use-case-diagram)
   - 5.6 [State Machine Diagram](#56-state-machine-diagram)
   - 5.7 [Activity Diagram](#57-activity-diagram)
   - 5.8 [Package Diagram](#58-package-diagram)
6. [Data Flow Architecture](#6-data-flow-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Technology Stack Summary](#8-technology-stack-summary)
9. [Conclusion](#9-conclusion)

---

## 1. Executive Summary

Imagify is a full-stack **SaaS-style AI image generation** web application built on the **MERN stack** (MongoDB, Express.js, React, Node.js). It follows a **client-server monorepo** architecture where:

- The **frontend** (React + Vite) provides an interactive single-page application (SPA) for users to register, log in, generate AI images from text prompts, and purchase credits.
- The **backend** (Express.js + Node.js) exposes a RESTful API that handles authentication, credit management, AI image generation via ClipDrop API, and payment processing via Razorpay.
- **MongoDB Atlas** serves as the cloud-hosted NoSQL database for persisting user data and transaction records.

The platform operates on a **credit-based model** — new users receive 5 free credits and can purchase additional credits through integrated payment plans.

---

## 2. System Overview

```
 ┌──────────────┐        HTTPS/REST         ┌──────────────────┐
 │              │  ◄─────────────────────►   │                  │
 │   React SPA  │        Axios + JWT         │  Express.js API  │
 │   (Client)   │                            │    (Server)      │
 │              │                            │                  │
 └──────────────┘                            └────────┬─────────┘
                                                      │
                                          ┌───────────┼───────────┐
                                          │           │           │
                                          ▼           ▼           ▼
                                    ┌──────────┐ ┌─────────┐ ┌──────────┐
                                    │ MongoDB  │ │ClipDrop │ │ Razorpay │
                                    │  Atlas   │ │   API   │ │ Gateway  │
                                    └──────────┘ └─────────┘ └──────────┘
```

**Key Characteristics:**
- **Separation of Concerns:** Frontend and backend are independently deployable
- **Stateless API:** JWT-based authentication; no server-side sessions
- **Credit-based Access Control:** Users must have credits to generate images
- **Third-party Integration:** External APIs for AI (ClipDrop) and payments (Razorpay)

---

## 3. Architectural Style & Patterns

| Pattern | Application |
|---------|-------------|
| **Client-Server** | React SPA communicates with Express.js REST API |
| **MVC (Model-View-Controller)** | Server uses Models (Mongoose), Controllers (business logic), and Routes (request routing) |
| **Context Pattern (Frontend)** | React Context API (`AppContext`) provides global state management |
| **Middleware Pipeline** | Express middleware chain for CORS, JSON parsing, and JWT authentication |
| **Repository Pattern** | Mongoose models abstract database operations |
| **Monorepo** | Both `client/` and `server/` reside in a single repository |
| **RESTful API** | Resource-oriented HTTP endpoints (`/api/user`, `/api/image`) |
| **Token-based Auth** | Stateless JWT authentication for protected routes |

---

## 4. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION TIER                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    React SPA (Vite + Tailwind CSS)                  │    │
│  │                                                                     │    │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────┐  ┌───────────────┐  │    │
│  │  │  Pages    │  │Components │  │  Context   │  │   Assets      │  │    │
│  │  │ Home      │  │ Navbar    │  │ AppContext │  │ Images/Icons  │  │    │
│  │  │ Result    │  │ Footer    │  │ (State)    │  │               │  │    │
│  │  │ BuyCredit │  │ Login     │  │            │  │               │  │    │
│  │  │           │  │ Header    │  │            │  │               │  │    │
│  │  │           │  │ Steps     │  │            │  │               │  │    │
│  │  │           │  │ Descript. │  │            │  │               │  │    │
│  │  │           │  │ Testimon. │  │            │  │               │  │    │
│  │  │           │  │ GenBtn    │  │            │  │               │  │    │
│  │  └───────────┘  └───────────┘  └────────────┘  └───────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                     │ Axios HTTP (JSON + JWT)               │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             APPLICATION TIER                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   Express.js REST API (Node.js)                     │    │
│  │                                                                     │    │
│  │  ┌───────────┐  ┌───────────────┐  ┌───────────┐  ┌────────────┐  │    │
│  │  │  Routes   │  │  Controllers  │  │Middleware │  │   Config   │  │    │
│  │  │ userRoute │  │ userCtrl      │  │ auth.js   │  │ mongodb.js │  │    │
│  │  │ imageRoute│  │ imageCtrl     │  │ (JWT)     │  │            │  │    │
│  │  └───────────┘  └───────────────┘  └───────────┘  └────────────┘  │    │
│  │  ┌───────────────────────┐                                         │    │
│  │  │       Models          │                                         │    │
│  │  │  userModel            │                                         │    │
│  │  │  transcationModel     │                                         │    │
│  │  └───────────────────────┘                                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
                    ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                DATA TIER                                    │
│                                                                             │
│     ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐     │
│     │  MongoDB     │     │  ClipDrop AI     │     │  Razorpay        │     │
│     │  Atlas       │     │  API             │     │  Payment Gateway │     │
│     │  (Database)  │     │  (External)      │     │  (External)      │     │
│     └──────────────┘     └──────────────────┘     └──────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. UML Diagrams

### 5.1 Component Diagram

This diagram shows the major structural components and their dependencies.

```mermaid
graph TB
    subgraph "Frontend - React SPA"
        direction TB
        A[App.jsx<br/>Root Component]
        B[AppContext<br/>Global State]
        C[Navbar]
        D[Login Modal]
        E[Home Page]
        F[Result Page]
        G[BuyCredit Page]
        H[Footer]
        I[Header]
        J[Steps]
        K[Description]
        L[Testimonials]
        M[GenerateBtn]
    end

    subgraph "Backend - Express.js API"
        direction TB
        N[server.js<br/>Entry Point]
        O[userRoute.js]
        P[imageRoute.js]
        Q[userController.js]
        R[imageController.js]
        S[auth.js<br/>JWT Middleware]
        T[mongodb.js<br/>DB Config]
    end

    subgraph "Data Layer"
        U[userModel<br/>Mongoose Schema]
        V[transcationModel<br/>Mongoose Schema]
    end

    subgraph "External Services"
        W[(MongoDB Atlas)]
        X[ClipDrop AI API]
        Y[Razorpay Gateway]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    A --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M

    B -->|Axios HTTP| N

    N --> O
    N --> P
    O --> S
    P --> S
    O --> Q
    P --> R
    N --> T

    Q --> U
    Q --> V
    R --> U

    U --> W
    V --> W
    R --> X
    Q --> Y
```

---

### 5.2 Class Diagram

This diagram models the data entities and controller classes in the system.

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +String password
        +Number creditBalance = 5
    }

    class Transaction {
        +String userId
        +String plan
        +Number amount
        +Number credits
        +Boolean payment = false
        +Number date
    }

    class UserController {
        +registerUser(req, res) Promise
        +loginUser(req, res) Promise
        +userCredits(req, res) Promise
        +paymentRazorpay(req, res) Promise
        +verifyRazorpay(req, res) Promise
    }

    class ImageController {
        +generateImage(req, res) Promise
    }

    class AuthMiddleware {
        +userAuth(req, res, next) Promise
    }

    class AppContext {
        +Object user
        +Boolean showLogin
        +String token
        +Number credit
        +String backendUrl
        +loadCreditsData() Promise
        +generateImage(prompt) Promise
        +logout() void
    }

    class RazorpayInstance {
        +String key_id
        +String key_secret
        +orders.create(options, callback)
        +orders.fetch(order_id)
    }

    UserController --> User : reads/writes
    UserController --> Transaction : creates/updates
    UserController --> RazorpayInstance : creates orders
    UserController --> AuthMiddleware : protected routes
    ImageController --> User : reads/updates credits
    ImageController --> AuthMiddleware : protected routes
    AppContext --> UserController : HTTP calls
    AppContext --> ImageController : HTTP calls
    Transaction --> User : references via userId
```

---

### 5.3 Sequence Diagrams

#### 5.3.1 User Registration Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB Atlas

    U->>C: Fill name, email, password
    U->>C: Click "Create Account"
    C->>S: POST /api/user/register<br/>{name, email, password}
    S->>S: Validate fields (non-empty)
    S->>S: bcrypt.genSalt(10)
    S->>S: bcrypt.hash(password, salt)
    S->>DB: new userModel({name, email, hashedPassword}).save()
    DB-->>S: User document (with _id)
    S->>S: jwt.sign({id: user._id}, JWT_SECRET)
    S-->>C: {success: true, token, user: {name}}
    C->>C: Store token in localStorage
    C->>C: setToken(token), setUser(user)
    C->>C: Close Login modal
    C-->>U: Logged in with 5 free credits
```

#### 5.3.2 User Login Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB Atlas

    U->>C: Enter email, password
    U->>C: Click "Login"
    C->>S: POST /api/user/login<br/>{email, password}
    S->>DB: userModel.findOne({email})
    DB-->>S: User document (or null)
    alt User not found
        S-->>C: {success: false, message: "User does not found"}
        C-->>U: Show error toast
    else User found
        S->>S: bcrypt.compare(password, user.password)
        alt Password mismatch
            S-->>C: {success: false, message: "Invalid credentials"}
            C-->>U: Show error toast
        else Password matches
            S->>S: jwt.sign({id: user._id}, JWT_SECRET)
            S-->>C: {success: true, token, user: {name}}
            C->>C: Store token in localStorage
            C->>C: setToken, setUser, close modal
            C-->>U: Logged in successfully
        end
    end
```

#### 5.3.3 AI Image Generation Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant CTX as AppContext
    participant S as Express Server
    participant MW as Auth Middleware
    participant DB as MongoDB Atlas
    participant AI as ClipDrop API

    U->>C: Enter text prompt
    U->>C: Click "Generate"
    C->>CTX: generateImage(prompt)
    CTX->>S: POST /api/image/generate-image<br/>Headers: {token}<br/>Body: {prompt}
    S->>MW: userAuth(req, res, next)
    MW->>MW: jwt.verify(token, JWT_SECRET)
    MW->>MW: Inject userId into req.body
    MW-->>S: next()
    S->>DB: userModel.findById(userId)
    DB-->>S: User document
    S->>S: Check creditBalance > 0
    alt No credits
        S-->>CTX: {success: false, message: "No credit Balance"}
        CTX->>C: toast.error() + navigate('/buy')
        C-->>U: Redirect to Buy Credits page
    else Has credits
        S->>S: Create FormData with prompt
        S->>AI: POST /text-to-image/v1<br/>Headers: {x-api-key}<br/>Body: FormData
        AI-->>S: Binary image data (arraybuffer)
        S->>S: Buffer.from(data).toString('base64')
        S->>DB: findByIdAndUpdate(creditBalance - 1)
        DB-->>S: Updated user
        S-->>CTX: {success: true, resultImage: "data:image/png;base64,...",<br/>creditBalance: N-1}
        CTX->>CTX: loadCreditsData()
        CTX-->>C: Return resultImage
        C->>C: Display generated image
        C-->>U: Show image with download option
    end
```

#### 5.3.4 Credit Purchase Flow (Razorpay)

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client (BuyCredit)
    participant S as Express Server
    participant MW as Auth Middleware
    participant DB as MongoDB Atlas
    participant RZ as Razorpay Gateway

    U->>C: Select a plan (Basic/Advanced/Business)
    U->>C: Click "Purchase"
    C->>S: POST /api/user/pay-razor<br/>Headers: {token}<br/>Body: {planId}
    S->>MW: userAuth(req, res, next)
    MW-->>S: next() [userId injected]
    S->>S: Resolve plan details (credits, amount)
    S->>DB: transcationModel.create({userId, plan, amount, credits, date})
    DB-->>S: Transaction document
    S->>RZ: razorpayInstance.orders.create({amount*100, currency, receipt})
    RZ-->>S: Razorpay Order object
    S-->>C: {success: true, order}
    C->>C: initPay(order)
    C->>RZ: Open Razorpay checkout modal
    U->>RZ: Complete payment
    RZ-->>C: Payment response (razorpay_order_id)
    C->>S: POST /api/user/verify-razor<br/>{razorpay_order_id}
    S->>RZ: razorpayInstance.orders.fetch(razorpay_order_id)
    RZ-->>S: Order info (status)
    alt status === 'paid'
        S->>DB: Find transaction by receipt ID
        S->>S: Check duplicate payment guard
        S->>DB: Update user creditBalance += credits
        S->>DB: Update transaction payment = true
        S-->>C: {success: true, message: "Credits Added"}
        C->>C: loadCreditsData() + navigate('/')
        C-->>U: Toast "Credit Added"
    else status !== 'paid'
        S-->>C: {success: false, message: "Payment Failed"}
        C-->>U: Show error
    end
```

#### 5.3.5 JWT Authentication Middleware Flow

```mermaid
sequenceDiagram
    participant C as Client Request
    participant MW as auth.js Middleware
    participant S as Controller

    C->>MW: HTTP Request with Headers: {token}
    MW->>MW: Extract token from req.headers

    alt No token present
        MW-->>C: {success: false,<br/>message: "Not Authorized, Login again"}
    else Token present
        MW->>MW: jwt.verify(token, JWT_SECRET)
        alt Token valid
            MW->>MW: Extract userId from decoded token
            MW->>MW: req.body.userId = tokenDecode.id
            MW->>S: next()
            S-->>C: Protected resource response
        else Token invalid/expired
            MW-->>C: {success: false,<br/>message: "Not Authorized, Login again"}
        end
    end
```

---

### 5.4 Deployment Diagram

This diagram shows the physical deployment architecture of the system.

```mermaid
graph TB
    subgraph "User Device"
        Browser["Web Browser<br/>(Chrome, Firefox, Safari, Edge)"]
    end

    subgraph "Vercel Cloud - Frontend"
        FE["React SPA<br/>(Static Build)<br/>Vite + Tailwind CSS<br/>vercel.json configured"]
    end

    subgraph "Vercel Cloud - Backend"
        BE["Express.js API<br/>(Serverless Function)<br/>Node.js Runtime<br/>Port 4000"]
    end

    subgraph "MongoDB Atlas"
        DB[("MongoDB Cluster<br/>Database: imagify<br/>Collections:<br/>- users<br/>- transcations")]
    end

    subgraph "ClipDrop (Stability AI)"
        AI["Text-to-Image API<br/>clipdrop-api.co<br/>/text-to-image/v1"]
    end

    subgraph "Razorpay"
        PAY["Payment Gateway<br/>Order Creation<br/>Payment Verification<br/>INR Currency"]
    end

    Browser -->|"HTTPS"| FE
    FE -->|"Axios HTTP<br/>REST API calls<br/>JWT in headers"| BE
    BE -->|"Mongoose<br/>MONGODB_URI"| DB
    BE -->|"POST FormData<br/>x-api-key header"| AI
    BE -->|"Razorpay SDK<br/>KEY_ID + KEY_SECRET"| PAY
    PAY -->|"Checkout Modal<br/>(Client-side SDK)"| Browser
```

---

### 5.5 Use Case Diagram

```mermaid
graph TB
    subgraph "Imagify System"
        UC1["View Landing Page<br/>(Home, Steps, Testimonials)"]
        UC2["Register Account"]
        UC3["Login"]
        UC4["View Credit Balance"]
        UC5["Generate AI Image<br/>from Text Prompt"]
        UC6["Download Generated Image"]
        UC7["Browse Credit Plans"]
        UC8["Purchase Credits<br/>(Razorpay)"]
        UC9["Logout"]
    end

    Guest["Guest User"]
    Registered["Registered User"]

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC7

    Registered --> UC1
    Registered --> UC4
    Registered --> UC5
    Registered --> UC6
    Registered --> UC7
    Registered --> UC8
    Registered --> UC9

    UC5 -.->|"requires credits > 0"| UC4
    UC5 -.->|"uses"| ClipDrop["ClipDrop AI API"]
    UC8 -.->|"uses"| Razorpay["Razorpay Gateway"]
    UC2 -.->|"includes"| UC3
```

---

### 5.6 State Machine Diagram

#### 5.6.1 User Authentication State

```mermaid
stateDiagram-v2
    [*] --> Guest : App loads

    Guest --> LoginModal : Click "Login" button
    Guest --> LoginModal : Click "Generate Images" (unauthenticated)
    Guest --> LoginModal : Click "Purchase" (unauthenticated)

    LoginModal --> LoginForm : Default state
    LoginModal --> SignUpForm : Click "Sign up"
    SignUpForm --> LoginForm : Click "Login"

    LoginForm --> Authenticating : Submit credentials
    SignUpForm --> Registering : Submit registration

    Authenticating --> Authenticated : Valid credentials
    Authenticating --> LoginForm : Invalid credentials (toast error)
    Registering --> Authenticated : Registration success
    Registering --> SignUpForm : Registration failed (toast error)

    Authenticated --> Guest : Click "Logout"
    Authenticated --> [*] : Close browser

    Guest --> Guest : Browse Home, Pricing

    state Authenticated {
        [*] --> Idle
        Idle --> GeneratingImage : Submit prompt
        GeneratingImage --> ImageReady : Image received
        GeneratingImage --> NoCredits : creditBalance == 0
        NoCredits --> BuyingCredits : Redirected to /buy
        BuyingCredits --> PaymentProcessing : Select plan
        PaymentProcessing --> Idle : Credits added
        PaymentProcessing --> BuyingCredits : Payment failed
        ImageReady --> Idle : "Generate another"
    }
```

#### 5.6.2 Transaction Payment State

```mermaid
stateDiagram-v2
    [*] --> PlanSelected : User selects plan

    PlanSelected --> TransactionCreated : POST /pay-razor<br/>(payment: false)
    TransactionCreated --> RazorpayCheckoutOpen : Order created
    RazorpayCheckoutOpen --> PaymentSubmitted : User completes payment
    RazorpayCheckoutOpen --> [*] : User cancels

    PaymentSubmitted --> Verifying : POST /verify-razor
    Verifying --> Paid : status === 'paid'<br/>credits added<br/>payment: true
    Verifying --> Failed : status !== 'paid'

    Paid --> [*]
    Failed --> [*]
```

---

### 5.7 Activity Diagram

#### Image Generation End-to-End Activity

```mermaid
flowchart TD
    A([Start]) --> B{User Authenticated?}
    B -->|No| C[Show Login Modal]
    C --> D{Login or Register?}
    D -->|Login| E[Enter email + password]
    D -->|Register| F[Enter name + email + password]
    E --> G[POST /api/user/login]
    F --> H[POST /api/user/register]
    G --> I{Credentials Valid?}
    H --> J{Registration Successful?}
    I -->|No| E
    I -->|Yes| K[Store JWT token]
    J -->|No| F
    J -->|Yes| K
    K --> L[Close modal]

    B -->|Yes| M[Navigate to /result]
    L --> M

    M --> N[Enter text prompt]
    N --> O[Click Generate]
    O --> P[POST /api/image/generate-image<br/>with JWT + prompt]
    P --> Q[Auth Middleware validates JWT]
    Q --> R{Token Valid?}
    R -->|No| S[Return 401 Unauthorized]
    S --> C
    R -->|Yes| T[Lookup user in DB]
    T --> U{creditBalance > 0?}
    U -->|No| V[Return "No credit Balance"]
    V --> W[Redirect to /buy]
    W --> X[Select credit plan]
    X --> Y[Process Razorpay payment]
    Y --> Z{Payment Successful?}
    Z -->|No| X
    Z -->|Yes| AA[Add credits to user]
    AA --> M

    U -->|Yes| AB[Send prompt to ClipDrop API]
    AB --> AC[Receive binary image data]
    AC --> AD[Convert to Base64 PNG]
    AD --> AE[Decrement creditBalance by 1]
    AE --> AF[Return resultImage + updated credits]
    AF --> AG[Display generated image]
    AG --> AH{User Action?}
    AH -->|Download| AI[Download image]
    AH -->|Generate Another| N
    AI --> AJ([End])
    AH -->|Done| AJ
```

---

### 5.8 Package Diagram

```mermaid
graph TB
    subgraph "client/ (Frontend Package)"
        direction TB
        subgraph "src/"
            subgraph "pages/"
                P1["Home.jsx"]
                P2["Result.jsx"]
                P3["BuyCredit.jsx"]
            end
            subgraph "components/"
                C1["Navbar.jsx"]
                C2["Footer.jsx"]
                C3["Login.jsx"]
                C4["Header.jsx"]
                C5["Steps.jsx"]
                C6["Description.jsx"]
                C7["Testimonials.jsx"]
                C8["GenerateBtn.jsx"]
            end
            subgraph "context/"
                CTX["AppContext.jsx"]
            end
            subgraph "assets/"
                AST["assets.js<br/>(images, icons)"]
            end
            MAIN["main.jsx"]
            APP["App.jsx"]
        end
        subgraph "config files"
            VC["vite.config.js"]
            TC["tailwind.config.js"]
            PC["postcss.config.js"]
            VJ["vercel.json"]
        end
    end

    subgraph "server/ (Backend Package)"
        direction TB
        subgraph "routes/"
            R1["userRoute.js"]
            R2["imageRoute.js"]
        end
        subgraph "controllers/"
            CT1["userController.js"]
            CT2["imageController.js"]
        end
        subgraph "middlewares/"
            MW["auth.js"]
        end
        subgraph "models/"
            M1["userModel.js"]
            M2["transcationModel.js"]
        end
        subgraph "config/"
            CFG["mongodb.js"]
        end
        SRV["server.js"]
    end

    MAIN --> APP
    APP --> CTX
    APP --> P1
    APP --> P2
    APP --> P3
    APP --> C1
    APP --> C2
    APP --> C3
    P1 --> C4
    P1 --> C5
    P1 --> C6
    P1 --> C7
    P1 --> C8

    SRV --> R1
    SRV --> R2
    SRV --> CFG
    R1 --> CT1
    R1 --> MW
    R2 --> CT2
    R2 --> MW
    CT1 --> M1
    CT1 --> M2
    CT2 --> M1
```

---

## 6. Data Flow Architecture

### 6.1 Request-Response Data Flow

```
┌───────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐    ┌────────────┐
│  Browser  │───►│  React SPA   │───►│  Axios     │───►│  Express.js  │───►│  MongoDB   │
│           │    │  (UI Layer)  │    │  (HTTP)    │    │  (API Layer) │    │  (Data)    │
│           │◄───│              │◄───│            │◄───│              │◄───│            │
└───────────┘    └──────────────┘    └────────────┘    └──────────────┘    └────────────┘
                                                              │
                                                              ├───►  ClipDrop API
                                                              │      (AI Generation)
                                                              │
                                                              └───►  Razorpay
                                                                     (Payments)
```

### 6.2 Authentication Data Flow

```
1. Client sends credentials ──► Server validates ──► Server returns JWT
2. Client stores JWT in localStorage
3. Client sends JWT in request headers for protected routes
4. Auth middleware extracts & verifies JWT ──► Injects userId into req.body
5. Controller uses userId to identify the user in the database
```

### 6.3 Credit System Data Flow

```
Registration:     User gets 5 free credits (default in schema)
Image Generation: User spends 1 credit per image (creditBalance - 1)
Credit Purchase:  User selects plan ──► Razorpay order ──► Payment ──► Verify ──► Add credits
```

---

## 7. Security Architecture

```mermaid
graph LR
    subgraph "Client Security"
        A["JWT stored in<br/>localStorage"]
        B["Token sent via<br/>request headers"]
    end

    subgraph "Transport Security"
        C["HTTPS encryption<br/>(Vercel)"]
        D["CORS enabled"]
    end

    subgraph "Server Security"
        E["JWT verification<br/>(auth middleware)"]
        F["bcrypt password hashing<br/>(salt rounds: 10)"]
        G["Environment variables<br/>(dotenv)"]
        H["Input validation<br/>(field checks)"]
    end

    subgraph "Payment Security"
        I["Razorpay server-side<br/>order creation"]
        J["Server-side payment<br/>verification"]
        K["Duplicate payment<br/>guard"]
    end

    A --> B
    B --> C
    C --> E
    E --> F
    E --> G
    E --> H
    G --> I
    I --> J
    J --> K
```

**Security Measures Summary:**

| Layer | Mechanism | Details |
|-------|-----------|---------|
| Password Storage | bcrypt | Salt rounds of 10; passwords never stored in plaintext |
| Authentication | JWT | Signed tokens with `JWT_SECRET`; stateless verification |
| Authorization | Auth Middleware | `auth.js` validates JWT before protected routes |
| Transport | HTTPS | Enforced by Vercel deployment |
| Cross-Origin | CORS | Enabled via `cors()` middleware |
| API Keys | Environment Variables | `CLIPDROP_API`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` via `dotenv` |
| Payment | Server-side Verification | Razorpay order verification + duplicate payment guard |
| Error Handling | Try-Catch | All controllers wrapped in try-catch; consistent JSON error responses |

---

## 8. Technology Stack Summary

```mermaid
graph TB
    subgraph "Frontend"
        direction LR
        React["React 19"]
        Vite["Vite 7"]
        TW["Tailwind CSS 3"]
        RRD["React Router DOM 7"]
        Motion["Motion (Framer)"]
        Toast["React Toastify"]
        Axios1["Axios"]
    end

    subgraph "Backend"
        direction LR
        Node["Node.js"]
        Express["Express.js 5"]
        Mongoose["Mongoose 8"]
        JWT["jsonwebtoken"]
        Bcrypt["bcrypt"]
        RazorpaySDK["Razorpay SDK"]
        Axios2["Axios"]
        FormData["form-data"]
    end

    subgraph "Infrastructure"
        direction LR
        Vercel["Vercel (Hosting)"]
        MongoAtlas["MongoDB Atlas"]
        ClipDrop["ClipDrop API"]
        RazorpayGW["Razorpay Gateway"]
    end

    React --> Vite
    Express --> Node
    Vercel --> MongoAtlas
```

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend Framework** | React 19 | Component-based UI |
| **Build Tool** | Vite 7 | Fast dev server + production builds |
| **CSS** | Tailwind CSS 3 | Utility-first responsive styling |
| **Routing** | React Router DOM 7 | Client-side SPA routing |
| **Animations** | Motion (Framer Motion) | Page transitions and UI animations |
| **Notifications** | React Toastify | Toast notification system |
| **HTTP Client** | Axios | API communication |
| **Backend Framework** | Express.js 5 | REST API server |
| **Database ORM** | Mongoose 8 | MongoDB object modeling |
| **Authentication** | jsonwebtoken (JWT) | Stateless token-based auth |
| **Password Hashing** | bcrypt | Secure password storage |
| **Payment SDK** | Razorpay | Credit purchase processing |
| **AI API** | ClipDrop | Text-to-image generation |
| **Hosting** | Vercel | Frontend + Backend deployment |
| **Database** | MongoDB Atlas | Cloud NoSQL database |

---

## 9. Conclusion

The Imagify system follows a clean, well-structured **3-tier architecture** with clear separation between the presentation, application, and data layers:

1. **Presentation Tier (React SPA):** A responsive, animated single-page application that manages global state through React Context and communicates with the backend via Axios HTTP calls with JWT authentication.

2. **Application Tier (Express.js API):** A RESTful API organized in the MVC pattern with route handlers, controllers for business logic, middleware for authentication, and Mongoose models for data access. It integrates with two external services — ClipDrop for AI image generation and Razorpay for payment processing.

3. **Data Tier (MongoDB Atlas):** A cloud-hosted NoSQL database storing two primary collections — `users` (with credit balances) and `transactions` (with payment tracking).

**Key Architectural Strengths:**
- Independent deployability of frontend and backend
- Stateless JWT authentication enabling horizontal scalability
- Credit-based access control with transactional payment verification
- Consistent error handling and JSON response format across all endpoints
- Responsive UI with smooth animations for enhanced user experience

**Potential Areas for Enhancement:**
- Email verification during registration
- Admin dashboard for user/transaction management
- Rate limiting and request throttling
- Image generation history/gallery per user
- WebSocket integration for real-time generation progress
- Refresh token rotation for improved security

---

*This document was generated as part of the system design analysis of the Imagify project.*
