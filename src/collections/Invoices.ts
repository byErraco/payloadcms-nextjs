
import { admins } from '../payload/access/admin'
import { checkRole } from '../payload/collectionUtils/checkRole'
import type { Access, CollectionConfig } from 'payload/types'




export const adminsOrOwnedBy: Access = ({ req: { user } }) => {
    if (checkRole(['admin'], user)) {
        return true
    }

    return {
        orderedBy: {
            equals: user?.id,
        },
    }
}
// TODO: ADD BUTTON TO SEND INVOICE EMAIL
export const Invoices: CollectionConfig = {
    slug: 'invoices',
    admin: {
        useAsTitle: 'invoiceId',
        defaultColumns: ['invoiceId', 'ownedBy', 'email'],
        preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/invoices/${doc.id}`,
    },
    // hooks: {
    //   afterChange: [updateUserPurchases, clearUserCart],
    // },
    access: {
        read: adminsOrOwnedBy,
        update: admins,
        create: admins,
        delete: admins,
    },
    fields: [
        {
            name: 'ownedBy',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'email',
            type: 'text',
            required: true,
        },
        {
            name: 'status',
            type: 'text',
            required: true,
        },
        {
            name: 'currency',
            type: 'text',
            required: true,
        },
        {
            name: 'amountPaid',
            type: 'text',
            // required: true,
        },
        {
            name: 'amountDue',
            type: 'text',
            // required: true,
        },
        {
            name: 'subscriptionId',
            type: 'text',
            required: true,
        },
        {
            name: 'invoiceId',
            type: 'text',
            required: true,
        },

    ],
}