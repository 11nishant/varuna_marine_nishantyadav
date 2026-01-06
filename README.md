# Fuel EU Maritime Compliance Platform

A full-stack application for managing Fuel EU Maritime compliance, including route management, compliance balance calculations, banking, and pooling operations.

## Overview

 This project implements a compliance dashboard for Fuel EU Maritime Regulation (EU) 2023/1805, featuring:

- **Routes Management:** View and manage shipping routes with GHG intensity tracking
- **Route Comparison:** Compare routes against baseline with compliance checking
- **Banking (Article 20):** Bank surplus compliance balance for future use
- **Pooling (Article 21):** Create compliance pools to optimize CB across multiple ships

## Architecture

The project follows **Hexagonal Architecture (Ports & Adapters)** principles:

### Backend Structure
```
backend/
  src/
    core/
      domain/          # Domain entities (Route, ComplianceBalance, etc.)
      application/     # Use cases (business logic)
      ports/           # Interfaces (repositories, services)
    adapters/
      inbound/http/    # HTTP controllers (Express routes)
      outbound/postgres/ # Prisma repository implementations
    infrastructure/
      db/              # Prisma client setup
      server/          # Express app configuration
```

### Frontend Structure
```
frontend/
  src/
    core/
      domain/          # Domain models
      application/     # Business logic hooks
      ports/           # Interface definitions
    adapters/
      ui/              # React components
      infrastructure/  # API client
```

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure database:
   - Create a PostgreSQL database (e.g., `fueleu`)
   - Update `backend/.env` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/fueleu"
   ```

4. Run Prisma migrations:
```bash
npm run prisma:migrate
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Seed the database:
```bash
npm run prisma:seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL (optional):
   - Create `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Routes
- `GET /routes` - Get all routes
- `POST /routes/:routeId/baseline` - Set a route as baseline
- `GET /routes/comparison` - Get route comparisons

### Compliance
- `GET /compliance/cb?shipId=XXX&year=YYYY` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId=XXX&year=YYYY` - Get adjusted compliance balance

### Banking
- `POST /banking/bank` - Bank surplus compliance balance
  ```json
  { "shipId": "R001", "year": 2024 }
  ```
- `POST /banking/apply` - Apply banked surplus
  ```json
  { "shipId": "R001", "year": 2024, "amount": 100.5 }
  ```

### Pooling
- `POST /pools` - Create a compliance pool
  ```json
  { "year": 2024, "shipIds": ["R001", "R002", "R003"] }
  ```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Key Formulas

### Compliance Balance (CB)
```
CB = (Target Intensity - Actual Intensity) × Energy in Scope / 1000
Energy in Scope = Fuel Consumption (t) × 41,000 MJ/t
Target Intensity = 89.3368 gCO₂e/MJ (2% below 91.16)
```

### Percentage Difference
```
percentDiff = ((comparison / baseline) - 1) × 100
```

## Sample Data

The seed script creates 5 routes:
- R001: Container, HFO, 2024 (Baseline)
- R002: BulkCarrier, LNG, 2024
- R003: Tanker, MGO, 2024
- R004: RoRo, HFO, 2025
- R005: Container, LNG, 2025

## Technologies Used

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

### Frontend
- React + TypeScript
- TailwindCSS
- Chart.js (for data visualization)
- Vite

## Project Structure Highlights

- **Domain-Driven Design:** Clear separation between domain logic and infrastructure
- **Dependency Inversion:** Core layer doesn't depend on frameworks
- **Type Safety:** Full TypeScript coverage with strict mode
- **Clean Code:** Consistent naming, proper error handling, and documentation

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Check database exists: `CREATE DATABASE fueleu;`

### CORS Errors
- Ensure backend CORS is configured to allow frontend origin
- Check `VITE_API_URL` matches backend URL

### Prisma Client Not Found
- Run `npm run prisma:generate` after schema changes
- Ensure Prisma client is generated before running the app

## License

ISC

## Author

Full-Stack Developer Assignment - Fuel EU Maritime Compliance Platform
<img width="1890" height="897" alt="proof" src="https://github.com/user-attachments/assets/0c41908c-f8f8-4bc1-8140-8e6132f85e63" />



