import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const interestRouter = createTRPCRouter({
    // insertInterest: protectedProcedure.input
})