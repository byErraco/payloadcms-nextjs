import { AuthCredentialsValidator, LoginCredentialsValidator, TAuthCredentialsValidator } from '../lib/validators/account-credentials-validators';
import { privateProcedure, publicProcedure, router } from './trpc';
import { getPayloadClient } from '../get-payload';
import { TRPCError } from "@trpc/server";
import { z } from 'zod';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input }) => {
        const { email, password, firstName, lastName } = input;
        const payload = await getPayloadClient()

        // check user exists
        const { docs: users } = await payload.find({
            collection: 'users',
            where: {
                email: {
                    equals: email
                }
            }
        })

        if (users.length !== 0) {
            throw new TRPCError({ code: 'CONFLICT' })
        }

        await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                firstName,
                lastName
            }
        })
        return { success: true, sentToEmail: email }

    }),
    signIn: publicProcedure.input(LoginCredentialsValidator).mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        const { req, res } = ctx
        const payload = await getPayloadClient()

        // check user exists
        try {
            await payload.login({
                collection: 'users',
                data: {
                    email,
                    password
                },
                res
            })
            return { success: true }
        } catch (error) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
    }),
    signOut: publicProcedure.mutation(async () => {
        const payload = await getPayloadClient()
        try {

        } catch (error) {

        }
    }),
    updateUserInfo: privateProcedure
        .input(z.object({
            name: z.string(),
        })).mutation(async ({ ctx, input }) => {
            const { user } = ctx
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' })

            const payload = await getPayloadClient()
            try {
                await payload.update({
                    collection: 'users',
                    where: {
                        id: {
                            equals: user.id
                        }
                    },
                    data: {
                        firstName: input.name
                    }
                })
                return { success: true }
            } catch (error) {
                return { success: false, message: 'Error updating user' }
            }
        }),
    createStripeCustomerPortal: privateProcedure
        // .input(z.object({
        //     stripeCustomerID: z.string(),
        // }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            // const { stripeCustomerID } = input
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' })
            const payload = await getPayloadClient()


            const { docs: users } = await payload.find({
                collection: 'users',
                where: {
                    id: {
                        equals: user.id
                    }
                },
            })

            const [userDoc] = users

            try {

                const session = await stripe.billingPortal.sessions.create({
                    customer: userDoc.stripeCustomerID as string,
                    return_url: "http://localhost:3000/account/subscription",
                });
                return { success: true, url: session.url }
            } catch (error) {
                console.log('error', error)
                return { success: false, message: 'Error creating Stripe customer portal' }
            }
        })
})