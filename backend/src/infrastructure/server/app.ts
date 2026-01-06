// Ensure environment variables are loaded before any imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { RoutesController } from '../../adapters/inbound/http/routesController';
import { ComplianceController } from '../../adapters/inbound/http/complianceController';
import { BankingController } from '../../adapters/inbound/http/bankingController';
import { PoolingController } from '../../adapters/inbound/http/poolingController';
import { GetRoutesUseCase } from '../../core/application/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../core/application/SetBaselineUseCase';
import { CompareRoutesUseCase } from '../../core/application/CompareRoutesUseCase';
import { CalculateComplianceBalanceUseCase } from '../../core/application/CalculateComplianceBalanceUseCase';
import { GetAdjustedCbUseCase } from '../../core/application/GetAdjustedCbUseCase';
import { BankSurplusUseCase } from '../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../core/application/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../../core/application/CreatePoolUseCase';
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../../adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaBankRepository } from '../../adapters/outbound/postgres/PrismaBankRepository';
import { PrismaPoolRepository } from '../../adapters/outbound/postgres/PrismaPoolRepository';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize repositories
const routeRepository = new PrismaRouteRepository();
const bankRepository = new PrismaBankRepository();
const complianceRepository = new PrismaComplianceRepository(bankRepository);
const poolRepository = new PrismaPoolRepository();

// Initialize use cases
const getRoutesUseCase = new GetRoutesUseCase(routeRepository);
const setBaselineUseCase = new SetBaselineUseCase(routeRepository);
const compareRoutesUseCase = new CompareRoutesUseCase(routeRepository);
const calculateCbUseCase = new CalculateComplianceBalanceUseCase(complianceRepository, routeRepository);
const getAdjustedCbUseCase = new GetAdjustedCbUseCase(complianceRepository);
const bankSurplusUseCase = new BankSurplusUseCase(complianceRepository, bankRepository);
const applyBankedUseCase = new ApplyBankedUseCase(complianceRepository, bankRepository);
const createPoolUseCase = new CreatePoolUseCase(complianceRepository, poolRepository);

// Initialize controllers
const routesController = new RoutesController(getRoutesUseCase, setBaselineUseCase, compareRoutesUseCase);
const complianceController = new ComplianceController(calculateCbUseCase, getAdjustedCbUseCase);
const bankingController = new BankingController(bankSurplusUseCase, applyBankedUseCase);
const poolingController = new PoolingController(createPoolUseCase);

// Routes
app.get('/routes', (req, res) => routesController.getAll(req, res));
app.post('/routes/:routeId/baseline', (req, res) => routesController.setBaseline(req, res));
app.get('/routes/comparison', (req, res) => routesController.getComparison(req, res));

app.get('/compliance/cb', (req, res) => complianceController.getCb(req, res));
app.get('/compliance/adjusted-cb', (req, res) => complianceController.getAdjustedCb(req, res));

app.post('/banking/bank', (req, res) => bankingController.bank(req, res));
app.post('/banking/apply', (req, res) => bankingController.apply(req, res));

app.post('/pools', (req, res) => poolingController.createPool(req, res));

export default app;

