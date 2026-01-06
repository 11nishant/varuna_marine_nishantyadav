# How to Start All Servers

## Quick Start Commands

### 1. Start Backend Server
Open a terminal in the `backend` directory and run:
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3001`

### 2. Start Frontend Server
Open another terminal in the `frontend` directory and run:
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Database
PostgreSQL should be running on `localhost:5432`
- Database: `fueleu`
- User: `postgres`
- Password: `nishant`

## Verification

### Test Backend API
```bash
curl http://localhost:3001/routes
```

### Access Frontend
Open your browser and navigate to:
```
http://localhost:5173
```

## Features Available

1. **Routes Tab**: View all routes, filter by vessel type, fuel type, year. Set baseline route.
2. **Compare Tab**: Compare routes against baseline with compliance checking and charts.
3. **Banking Tab**: Bank surplus compliance balance and apply banked amounts.
4. **Pooling Tab**: Create compliance pools to optimize CB across multiple ships.

## Database Tables
- `Route` - Shipping routes data
- `ShipCompliance` - Compliance balance records
- `BankEntry` - Banked surplus entries
- `Pool` - Compliance pools
- `PoolMember` - Pool member allocations

