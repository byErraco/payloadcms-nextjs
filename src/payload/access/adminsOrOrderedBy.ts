import type { Access } from 'payload/config'
import { checkRole } from '../collectionUtils/checkRole'


export const adminsOrOrderedBy: Access = ({ req: { user } }) => {
    if (checkRole(['admin'], user)) {
        return true
    }

    return {
        orderedBy: {
            equals: user?.id,
        },
    }
}