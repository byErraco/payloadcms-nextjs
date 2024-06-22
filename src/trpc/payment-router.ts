import { z } from "zod";
import { privateProcedure, router } from "./trpc";
// import { stripe } from "../lib/stripe";
import type { Stripe as TStripe } from "stripe";
import { Stripe } from "stripe";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from '../get-payload';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export const paymentRouter = router({
    // createMemberShipSession: privateProcedure
    createMemberShipSession: privateProcedure
        .input(z.object({ subscription: z.boolean(), priceId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' })
            const { subscription, priceId } = input
            const customers = await stripe.customers.list({ email: user.email });
            const customer = customers.data.length ? customers.data[0] : null;
            // return

            const params: TStripe.Checkout.SessionCreateParams = {
                payment_method_types: ["card"],
                metadata: { userId: user.id, email: user.email, subscription: priceId },
                // @ts-ignore
                customer: customer.id,
                // customer_email: user.email,
                subscription_data: {
                    metadata: { userId: user.id, email: user.email, subscription: priceId },
                },
                mode: "subscription",
                // allow_promotion_codes: true,
                line_items: [{
                    price: priceId,
                    quantity: 1
                }],
                success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cancel`,
            }

            if (subscription && params) {
                try {
                    const checkoutSession: TStripe.Checkout.Session =
                        await stripe.checkout.sessions.create(params);
                    return { url: checkoutSession.url, sessionId: checkoutSession.id }
                } catch (error) {
                    return { url: null }
                }
            }
        }),
    createSession: privateProcedure
        .input(z.object({ productIds: z.array(z.string()), data: z.object({}) }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            let { productIds, data: orderDetails } = input

            if (productIds.length === 0) {
                throw new TRPCError({ code: 'BAD_REQUEST' })
            }

            const payload = await getPayloadClient()

            const customers = await stripe.customers.list({ email: user.email });
            const customer = customers.data.length ? customers.data[0] : null;

            const { docs: products } = await payload.find({
                collection: 'products',
                where: {
                    id: {
                        in: productIds,
                    },
                },
            })

            const filteredProducts = products.filter((prod) =>
                Boolean(prod.priceId)
            )

            const order = await payload.create({
                collection: 'orders',
                data: {
                    _isPaid: false,
                    //@ts-ignore
                    products: filteredProducts.map((prod) => prod.id),
                    orderedBy: user.id,
                    customerOrderDetails: orderDetails
                },
            })

            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
                []

            filteredProducts.forEach((product) => {
                line_items.push({
                    // @ts-ignore
                    price: product.priceId!,
                    quantity: 1,
                })
            })

            line_items.push({
                price: 'price_1PReMiINj6G1UXat3av6lzwO',
                quantity: 1,
                adjustable_quantity: {
                    enabled: false,
                },
            })

            try {
                const stripeSession =
                    await stripe.checkout.sessions.create({
                        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
                        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
                        payment_method_types: ['card'],
                        mode: 'payment',
                        metadata: {
                            userId: user.id,
                            orderId: order.id,
                        },
                        line_items,
                        // @ts-ignore
                        customer: customer.id,
                    })

                return { url: stripeSession.url }
            } catch (err) {
                console.log('err', err)
                return { url: null }
            }
        }),
    pollOrderStatus: privateProcedure
        .input(z.object({ orderId: z.string() }))
        .query(async ({ input }) => {
            const { orderId } = input

            const payload = await getPayloadClient()

            const { docs: orders } = await payload.find({
                collection: 'orders',
                where: {
                    id: {
                        equals: orderId,
                    },
                },
            })

            if (!orders.length) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const [order] = orders

            return { isPaid: order._isPaid }
        }),
})