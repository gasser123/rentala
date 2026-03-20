# Real Estate Rental Platform

A full-stack **real estate rental platform** that allows tenants to browse properties, submit rental applications, make payments, and manage leases, while property managers can manage listings, review applications, and track payments.

The project is built using a modern **microservice-style architecture** with a **Next.js frontend** and **Node.js (Express) backend**, using **PostgreSQL with PostGIS** for geospatial queries.

---

# Tech Stack

## Frontend

- Next.js
- Redux Toolkit
- RTK Query
- TypeScript
- Tailwind CSS
- AWS Amplify (Authentication)

## Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL + PostGIS
- REST API

## Third-Party Services

- Stripe (Payments)
- AWS Cognito (Authentication)
- Mapbox (Map rendering)
- Nominatim (Geocoding)
- AWS S3 (File storage)

## DevOps / Infrastructure

- Docker
- Docker Compose

---

# Features

## Authentication

- User authentication via **AWS Cognito**
- Role-based access:
  - Tenant
  - Manager

## Property Management

Managers can:

- Create properties
- Upload property images
- View applications
- Manage leases

Tenants can:

- Browse properties
- View location on map
- Submit rental applications

---

## Applications Workflow

1. Tenant submits a rental application
2. Manager reviews the application
3. Manager accepts or declines the application
4. If accepted, a lease is created
5. Tenant proceeds to payment

---

## Payments

Payments are handled securely using **Stripe**.

Features:

- Checkout session integration
- Webhook-based payment confirmation
- Automatic lease activation after payment
- Payment notifications

---

## Notifications

The platform includes an **in-app notification system**.

Users receive notifications for events such as:

- Application submitted
- Application approved
- Payment successful
- Lease created

Notifications are displayed in a **notification bell dropdown** in the UI.

---

## Maps & Geolocation

Properties are displayed on an interactive map using **Mapbox**.

Features:

- Property location markers
- Reverse geocoding
- Address lookup using **Nominatim**

The backend uses **PostGIS** to support geospatial queries.

---

# Project Architecture

```
client (Next.js)
        |
        | REST API
        v
server (Express)
        |
        | Prisma ORM
        v
PostgreSQL + PostGIS
```

External services:

```
AWS Cognito  → Authentication
Stripe       → Payments
Mapbox       → Map rendering
Nominatim    → Geocoding
AWS S3       → Image storage
```

---

# Environment Variables

## Client (`.env`)

```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Server (`.env`)

```
PORT=
DATABASE_URL=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_USER_POOL_CLIENT_ID=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
API_SERVER_URL=
```

---

# Local Development

This project uses **Docker Compose** for local development.

It includes:

- Client container
- Server container
- PostgreSQL + PostGIS container

## Start the development environment

```
docker compose up --watch
```

Watch mode enables:

- automatic rebuild when dependencies change
- live file synchronization for development

---

# Stripe Webhook Testing

To test Stripe webhooks locally, use the **Stripe CLI**:

```
stripe listen --forward-to localhost:8080/webhook
```

Copy the generated webhook secret into:

```
STRIPE_WEBHOOK_SECRET
```

in the server `.env` file.

---

# Database

The application uses **PostgreSQL with PostGIS** to support geospatial queries.

Prisma is used as the ORM.

To apply migrations in the postgres container:

```
docker compose exec server npm run migrate:deploy
```

---

# License

This project is for educational and portfolio purposes.
