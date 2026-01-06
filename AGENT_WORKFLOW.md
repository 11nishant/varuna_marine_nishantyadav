# AI Agent Workflow Log

## Agents Used
- **Cursor Agent** (Primary): Used throughout the development process for code generation, refactoring, and architectural decisions
- **GitHub Copilot** (Implicit): Used for inline code completions and suggestions

## Prompts & Outputs

### Example 1: Initial Project Setup
**Prompt:** "Create a Node.js backend with TypeScript, Express, and Prisma for PostgreSQL following hexagonal architecture"

**Generated Output:**
- Created directory structure: `src/core/domain`, `src/core/application`, `src/core/ports`, `src/adapters/inbound/http`, `src/adapters/outbound/postgres`
- Initialized Prisma with PostgreSQL datasource
- Set up TypeScript configuration with proper compilation settings

**Validation:** Verified directory structure matches hexagonal architecture principles. Confirmed Prisma schema follows assignment requirements.

### Example 2: Domain Model Creation
**Prompt:** "Create domain entities for Route, ComplianceBalance, BankEntry, and Pool following the assignment specifications"

**Generated Output:**
```typescript
export class Route {
  constructor(
    public readonly id: string,
    public readonly routeId: string,
    // ... other properties
  ) {}
}
```

**Refinement:** Agent correctly created immutable domain entities with readonly properties, maintaining domain purity.

### Example 3: Use Case Implementation
**Prompt:** "Implement CalculateComplianceBalanceUseCase with formula: CB = (Target - Actual) × Energy in scope / 1000"

**Generated Output:**
```typescript
const TARGET_INTENSITY = 89.3368;
const ENERGY_PER_TONNE = 41000;
const energyInScope = route.fuelConsumption * ENERGY_PER_TONNE;
const cbGco2Eq = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope / 1000;
```

**Validation:** Verified formula matches assignment specifications. Constants match Fuel EU Maritime requirements.

### Example 4: Prisma Schema Relations
**Prompt:** "Create Prisma schema with proper relations between ShipCompliance, BankEntry, Pool, and PoolMember"

**Generated Output:**
- Initial schema had incorrect relation references
- Agent attempted to reference Pool by composite key [id, year] which didn't exist
- Corrected to reference Pool by id only, and ShipCompliance by [shipId, year]

**Correction:** Fixed relation definitions after Prisma validation errors. Ensured all foreign keys reference unique constraints correctly.

### Example 5: React Component Generation
**Prompt:** "Create a React component for Routes tab with filtering by vesselType, fuelType, and year"

**Generated Output:**
- Generated complete RoutesTab component with state management
- Implemented filter dropdowns with unique values extraction
- Added table rendering with proper TailwindCSS styling

**Refinement:** Enhanced with error handling and loading states. Added "Set Baseline" button functionality.

### Example 6: API Client Implementation
**Prompt:** "Create a TypeScript API client for all backend endpoints"

**Generated Output:**
- Generated ApiClient class with all CRUD methods
- Properly typed all request/response interfaces
- Implemented error handling with try-catch blocks

**Validation:** Verified all endpoints match backend implementation. Confirmed TypeScript types are consistent.

## Validation / Corrections

### Schema Validation Issues
1. **Problem:** Prisma schema validation failed due to incorrect relation references
   - **Error:** `PoolMember` tried to reference `Pool` by `[id, year]` but Pool only has `id` as unique
   - **Fix:** Changed to reference Pool by `id` only, added `year` field to PoolMember for ShipCompliance relation

2. **Problem:** BankEntry relation to ShipCompliance
   - **Error:** Initial attempt to use single field reference
   - **Fix:** Used composite unique key `[shipId, year]` matching ShipCompliance's unique constraint

### Formula Verification
- Verified Compliance Balance formula: `(Target - Actual) × Energy / 1000`
- Confirmed Target Intensity: 89.3368 gCO₂e/MJ (2% below 91.16)
- Validated Energy conversion: 41,000 MJ/t

### Frontend-Backend Integration
- Verified API endpoints match between frontend API client and backend routes
- Confirmed CORS configuration allows frontend to access backend
- Validated request/response types are consistent

## Observations

### Where Agent Saved Time
1. **Boilerplate Generation:** Quickly generated repository implementations, use cases, and controllers following established patterns
2. **Type Safety:** Automatically inferred and generated TypeScript types for API responses
3. **Architecture Consistency:** Maintained hexagonal architecture patterns across all layers
4. **Component Structure:** Generated React components with proper hooks and state management

### Where Agent Failed or Hallucinated
1. **Prisma Schema Relations:** Initially created incorrect relation references that required manual correction
2. **PowerShell Commands:** Attempted to use Unix-style commands (`&&`, `mkdir -p`) that don't work in PowerShell
3. **Package Versions:** Some generated package.json entries needed version verification

### How Tools Were Combined Effectively
1. **Iterative Refinement:** Used Cursor Agent to generate initial code, then refined based on linter errors and runtime issues
2. **Pattern Recognition:** Agent recognized architectural patterns and applied them consistently across similar components
3. **Error-Driven Development:** Used Prisma validation errors to iteratively improve schema design
4. **Type Safety:** Leveraged TypeScript compiler errors to catch integration issues early

## Best Practices Followed

1. **Hexagonal Architecture:**
   - Separated core domain from infrastructure
   - Used ports (interfaces) to define contracts
   - Implemented adapters for external dependencies (Prisma, Express, React)

2. **Type Safety:**
   - Strict TypeScript configuration
   - Proper interface definitions for all API contracts
   - Domain entities with readonly properties

3. **Separation of Concerns:**
   - Use cases contain business logic only
   - Repositories handle data access
   - Controllers handle HTTP concerns

4. **Error Handling:**
   - Proper error propagation from use cases to controllers
   - User-friendly error messages in frontend
   - Validation at multiple layers

5. **Code Organization:**
   - Clear directory structure following hexagonal architecture
   - Consistent naming conventions
   - Proper dependency injection patterns

## Challenges Overcome

1. **Prisma 7 Changes:** Adapted to new Prisma 7 configuration format (prisma.config.ts vs schema.prisma)
2. **PowerShell Compatibility:** Adjusted commands for Windows PowerShell environment
3. **Type Definitions:** Ensured all React and Node.js types were properly installed
4. **CORS Configuration:** Properly configured Express CORS middleware for frontend-backend communication

