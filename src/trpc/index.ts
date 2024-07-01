import { getPayloadClient } from "../get-payload";
import { authRouter } from "./auth-router";
import { paymentRouter } from "./payment-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    auth: authRouter,
    payment: paymentRouter,
    getTiers: publicProcedure.query(async () => {
        const payload = await getPayloadClient()
        const { docs: items } = await payload.find({
            collection: 'tiers',
        })
        return items
    }),
    getCategories: publicProcedure.query(async () => {
        const payload = await getPayloadClient()
        const { docs: items } = await payload.find({
            collection: 'categories',
        })
        return items
    }),
    getProductsFiltered: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(10).optional(),
                sort: z.string().optional(),
                color: z.array(z.string()).optional(),
                size: z.array(z.string()).optional(),
                price: z.array(z.number()).optional()
                // price: z.object({
                //     isCustom: z.boolean().optional(),
                //     range: z.array(z.number()).optional(),
                // }).optional(),
            })
        )
        .query(async () => {
            const payload = await getPayloadClient()
            const { docs: items } = await payload.find({
                collection: 'products',
                where: {
                    approvedForSale: {
                        equals: 'published',
                    },
                    // TODO ADD FEATURED CHECKBOX ON PRODUCTS
                },
                // depth: 1,
                // limit,
            })
            return items
        }),
    getFeaturedProducts: publicProcedure.input(
        z.object({
            limit: z.number().min(1).max(10),
        })
    )
        .query(async ({ input }) => {
            const { limit } = input
            const payload = await getPayloadClient()
            const { docs: items } = await payload.find({
                collection: 'products',
                where: {
                    approvedForSale: {
                        equals: 'published',
                    },
                    // TODO ADD FEATURED CHECKBOX ON PRODUCTS
                },
                depth: 1,
                limit,
            })
            return items
        }),
    getInfiniteProducts: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100),
                cursor: z.number().nullish(),
                query: QueryValidator,
            })
        )
        .query(async ({ input }) => {
            const { query, cursor } = input
            const { sort, limit, ...queryOpts } = query

            const payload = await getPayloadClient()

            // const parsedQueryOpts: Record<
            //     string,
            //     { equals: string }
            // > = {}

            // Object.entries(queryOpts).forEach(([key, value]) => {
            //     parsedQueryOpts[key] = {
            //         equals: value,
            //     }
            // })

            // console.log('parsedQueryOpts', parsedQueryOpts);

            const page = cursor || 1

            const {
                docs: items,
                hasNextPage,
                nextPage,
            } = await payload.find({
                collection: 'products',
                where: {
                    approvedForSale: {
                        equals: 'published',
                    },
                    // ...parsedQueryOpts,
                },
                sort,
                depth: 1,
                limit,
                page,
            })

            return {
                items,
                nextPage: hasNextPage ? nextPage : null,
            }
        }),
    getOrderDetails: publicProcedure.input(
        z.object({ orderNumber: z.string() })
    )
        .mutation(async ({ input }) => {
            const { orderNumber } = input

            const payload = await getPayloadClient()

            // check user exists
            const { docs: orders } = await payload.find({
                collection: 'orders',
                where: {
                    id: {
                        equals: orderNumber
                    }
                }
            })

            console.log('orders', orders)
            if (orders.length === 0) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }
            const [order] = orders
            console.log('order', order)
            return { foundOrder: order }

        }),
    getDealers: publicProcedure.input(
        z.object({
            limit: z.number().min(1).max(100),
            cursor: z.string().nullish(),
            name: z.string().optional(),
        })
    )
        .query(async ({ ctx, input }) => {
            const { limit, cursor, name } = input
            const payload = await getPayloadClient()


            const {
                docs: items,
                hasNextPage,
                nextPage,
            } = await payload.find({
                collection: 'fflDealers',
                where: {
                    name: {

                        contains: name,
                        // contains: name ? name : undefined,
                    },
                    // ...parsedQueryOpts,
                },
                // sort,
                depth: 1,
                limit,
                // page,
            })

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                const nextItem = items.pop(); // return the last item from the array
                nextCursor = nextItem?.id;
            }
            return {
                items,
                nextCursor,
            };
        })
})

export type AppRouter = typeof appRouter