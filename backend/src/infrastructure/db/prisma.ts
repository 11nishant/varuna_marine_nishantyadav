import { PrismaClient } from '@prisma/client'
// prisma6 is used, that is more stable and compatible
const prisma = new PrismaClient()

export default prisma
