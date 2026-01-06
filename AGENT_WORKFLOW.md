# AI Agent Workflow Log

## Agents Used

* **Cursor Agent (Primary):**
  Used throughout the project for generating boilerplate code, setting up hexagonal architecture, implementing use cases, and refactoring large sections of the codebase.

* **GitHub Copilot:**
  Used mainly for inline suggestions while writing TypeScript, React components, Prisma models, and small refactors. It helped speed up repetitive coding tasks.

* **ChatGPT:**
  Used for debugging errors, understanding Prisma and Vite issues, validating formulas, and clarifying architectural or conceptual doubts during development.

---

## Prompts & Outputs

### Example 1: Initial Project Setup

**Prompt:**

> “Create a Node.js backend with TypeScript, Express, and Prisma for PostgreSQL following hexagonal architecture”

**Output Produced:**

* Generated a clean folder structure separating `core`, `adapters`, and `infrastructure`
* Set up Prisma with PostgreSQL
* Created a TypeScript configuration suitable for backend development

**Validation:**
I manually checked that the folder structure followed hexagonal architecture principles and that no framework-specific code leaked into the core domain. Prisma setup was aligned with the assignment requirements.

---

### Example 2: Domain Model Creation

**Prompt:**

> “Create domain entities for Route, ComplianceBalance, BankEntry, and Pool following the assignment specifications”

**Generated Snippet:**

```ts
export class Route {
  constructor(
    public readonly id: string,
    public readonly routeId: string,
    // other properties
  ) {}
}
```

**Refinement:**
The agent correctly generated immutable domain entities using `readonly` fields. I reviewed naming and ensured the models remained framework-agnostic.

---

### Example 3: Compliance Balance Calculation

**Prompt:**

> “Implement CalculateComplianceBalanceUseCase with formula: CB = (Target - Actual) × Energy in scope / 1000”

**Generated Logic:**

```ts
const TARGET_INTENSITY = 89.3368;
const ENERGY_PER_TONNE = 41000;
const energyInScope = route.fuelConsumption * ENERGY_PER_TONNE;
const cbGco2Eq = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope / 1000;
```

**Validation:**
I verified the formula against the assignment brief and FuelEU references. Constants and units were checked manually to ensure correctness.

---

### Example 4: Prisma Schema Relations

**Prompt:**

> “Create Prisma schema with proper relations between ShipCompliance, BankEntry, Pool, and PoolMember”

**Initial Output Issues:**

* Incorrect relation references in `PoolMember`
* Attempted to reference `Pool` using a composite key that didn’t exist

**Corrections Made:**

* Updated relations to reference `Pool` by `id`
* Used composite unique key `[shipId, year]` for `ShipCompliance`
* Fixed foreign keys based on Prisma validation errors

---

### Example 5: React Component Generation

**Prompt:**

> “Create a React component for Routes tab with filtering by vesselType, fuelType, and year”

**Generated Output:**

* Complete `RoutesTab` component
* Filter dropdowns with derived unique values
* Table rendering with Tailwind styling

**Refinement:**
I added loading states, error handling, and wired the “Set Baseline” button to the backend API.

---

### Example 6: API Client Implementation

**Prompt:**

> “Create a TypeScript API client for all backend endpoints”

**Generated Output:**

* Centralized API client
* Typed request/response interfaces
* Basic error handling logic

**Validation:**
I cross-checked all routes against backend controllers and ensured types matched exactly.

---

## Validation / Corrections

### Schema Validation Issues

1. **PoolMember → Pool relation**

   * Issue: Referenced non-existent composite key
   * Fix: Changed reference to `poolId` only

2. **BankEntry → ShipCompliance relation**

   * Issue: Single-field relation caused constraint issues
   * Fix: Used composite key `[shipId, year]`

---

### Formula Verification

* Compliance Balance: `(Target − Actual) × Energy / 1000`
* Target intensity: `89.3368 gCO₂e/MJ`
* Energy conversion: `41,000 MJ/t`

All calculations were verified manually with sample values.

---

### Frontend–Backend Integration

* API paths verified against Express routes
* CORS tested locally
* Type mismatches resolved using TypeScript compiler feedback

---

## Observations

### Where AI Saved Time

1. Rapid generation of boilerplate repositories, controllers, and use cases
2. Consistent TypeScript typing across frontend and backend
3. Maintaining architectural consistency across many files
4. Speeding up React component scaffolding

---

### Where AI Needed Correction

1. Prisma relation definitions required manual fixes
2. Shell commands needed PowerShell-compatible alternatives
3. Some package versions required verification
4. UI spacing and visual polish required human judgment

---

### How Tools Were Used Together

* **Cursor Agent:** Large-scale generation and refactoring
* **GitHub Copilot:** Inline suggestions and repetitive code
* **ChatGPT:** Debugging errors, clarifying concepts, validating formulas

This combination worked well when paired with regular manual review.

---

## Best Practices Followed

* Strict hexagonal architecture
* Domain isolation from frameworks
* Typed API contracts
* Clear separation of concerns
* Dependency inversion via ports
* Defensive error handling

---

## Challenges Overcome

1. Prisma 7 configuration changes/ faced errors due to version6 and version7 of prisma
2. PowerShell vs Unix command differences
3. Tailwind + PostCSS configuration issues
4. Ensuring consistent data flow between frontend and backend

---

## Final Takeaway

AI tools significantly accelerated development, but **human review was essential**, especially for:

* Business rules
* Database schema design
* UI quality
* Integration testing

