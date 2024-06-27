import { z } from "zod";
import { privateProcedure, router } from "./trpc";
// import { stripe } from "../lib/stripe";
import type { Stripe as TStripe } from "stripe";
import { Stripe } from "stripe";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from '../get-payload';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


const orderDetailsSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    phone: z.string().min(2, {
        message: "Phone number must be at least 2 characters.",
    }),
    addressOne: z
        .string()
        .min(2, {
            message: "Address line 1 must be at least 2 characters.",
        })
        .optional(),
    addressTwo: z
        .string()
        .min(2, {
            message: "Address line 2 must be at least 2 characters.",
        })
        .optional(),
    city: z
        .string()
        .min(2, {
            message: "City must be at least 2 characters.",
        })
        .optional(),
    state: z
        .string()
        .min(2, {
            message: "State must be at least 2 characters.",
        })
        .optional(),
    country: z
        .string()
        .min(2, {
            message: "Country must be at least 2 characters.",
        })
        .optional(),
    zip: z
        .string()
        .min(2, {
            message: "Zip code must be at least 2 characters.",
        })
        .optional(),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    specialInstructions: z
        .string()
        .min(2, {
            message: "Special instructions must be at least 2 characters.",
        })
        .optional(),
    shippingMethod: z
        .string()
        .min(2, {
            message: "Please select a shipping method.",
        })
        .optional(),
    fflDealerId: z
        .string()
        .min(2, {
            message: "Please select a FFL dealer ID.",
        })
        .optional(),
    fflCertificate: z.any().optional(), // Can be any type or left empty
    termsAndConditions: z.boolean(),
});


export const paymentRouter = router({
    // createMemberShipSession: privateProcedure
    createMemberShipSession: privateProcedure
        .input(z.object({ subscription: z.boolean(), priceId: z.string(), id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' })
            const { subscription, priceId, id: tierId } = input
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
                    metadata: { userId: user.id, email: user.email, subscription: priceId, tierId },
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
    createOrder: privateProcedure
        .input(z.object({ products: z.array(z.string()), orderDetails: orderDetailsSchema }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx
            let { products, orderDetails } = input
            // console.log('orderData', orderData);

            // return {
            //     message: 'success',
            //     url: null
            // }

            if (products.length === 0) {
                throw new TRPCError({ code: 'BAD_REQUEST' })
            }

            const payload = await getPayloadClient()

            // @ts-ignore
            const currentUserTier = user.subscription?.tier?.id

            const { docs: productDocs } = await payload.find({
                collection: 'products',
                where: {
                    id: {
                        in: products,
                    },
                },
            })

            const productDocsMap = productDocs.map(p => {
                // @ts-ignore
                let price = p.prices.find(price =>
                    // @ts-ignore
                    price.availableByTier?.id === currentUserTier
                )
                return {
                    id: p.id,
                    title: p.title,
                    // need to set base price for products
                    price: price?.price || 500,
                    images: p.images,
                    quantity: 1,
                }
            })


            const orderData = {
                products: productDocsMap,
                orderDetails,
            }
            const cartTotal = productDocsMap.reduce((total, item) => total + item?.price, 0)


            // const customers = await stripe.customers.list({ email: user.email });
            // const customer = customers.data.length ? customers.data[0] : null;


            // const filteredProducts = products.filter((prod) =>
            //     // @ts-ignore
            //     Boolean(prod.priceId)
            // )

            try {
                const order = await payload.create({
                    collection: 'orders',
                    data: {
                        _isPaid: false,
                        //@ts-ignore
                        // products: filteredProducts.map((prod) => prod.id),
                        products: products,
                        orderedBy: user.id,
                        customerOrderDetails: orderData,
                        total: cartTotal
                    },
                })

                if (order) {
                    return {
                        message: 'Order has been placed successfully',
                        url: `/purchase/${order.id}`,
                    }
                }
            } catch (error) {
                console.log('error', error)
                return {
                    url: null
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
                // @ts-ignore
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