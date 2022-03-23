import { PrismaClient, User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface Context {
  // user: User;
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
}
