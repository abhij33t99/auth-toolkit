import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient()

declare global {
    var prisma: undefined | PrismaClient
}

export const db = globalThis.prisma ?? prismaClientSingleton()


if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;