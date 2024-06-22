import { User } from "@/payload-types"
import { Access, AccessArgs } from "payload/config"
import { checkRole } from "../collectionUtils/checkRole"

export const adminsOrLoggedIn: Access = ({ req }: AccessArgs<User>) => {
    if (checkRole(['admin'], req.user)) {
        return true
    }

    return !!req.user
}