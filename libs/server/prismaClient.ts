/* eslint-disable no-var */
/* eslint-disable import/prefer-default-export */
/* eslint-disable vars-on-top */
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    //log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
