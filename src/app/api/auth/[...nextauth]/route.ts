import NextAuth from 'next-auth'
import { nextAuthOptions } from '../../../../../session'

const handler = NextAuth(nextAuthOptions);
export const GET = handler.GET;
export const POST = handler.POST;