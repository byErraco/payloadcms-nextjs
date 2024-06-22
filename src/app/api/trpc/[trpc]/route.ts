import { appRouter } from "@/trpc"
import {fetchRequestHandler} from "@trpc/server/adapters/fetch"
const handler=(req:Request) => {
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        // @ts-expect-error context already passed frm express middelware
        createContext: () => ({})
    })
}

export {handler as GET, handler as POST}