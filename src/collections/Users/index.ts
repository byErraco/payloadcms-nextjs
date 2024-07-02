import { checkRole } from '../../payload/collectionUtils/checkRole'
import { CollectionConfig } from 'payload/types'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
import adminsAndUser from './access/adminsAndUser'
import { anyone } from '../../payload/access/anyone'
import { admins } from '../../payload/access/admin'
import { CustomerSelect } from './ui/CustomSelect'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    // auth:{
    //     verify: {

    //     }
    // },
    access: {
        read: adminsAndUser,
        create: anyone,
        // update: () => true,
        update: admins,
        delete: admins,
        // admin: ({ req: { user } }) => checkRole(['admin'], user),
        // admin:({req: {user}}) => user.role === 'admin',
    },
    hooks: {
        beforeChange: [createStripeCustomer],
        // afterChange: [loginAfterCreate],
    },
    fields: [
        {
            name: 'firstName',
            type: 'text',
        },
        {
            name: 'lastName',
            type: 'text',
        },

        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: ['customer'],
            options: [
                {
                    label: 'admin',
                    value: 'admin',
                },
                {
                    label: 'customer',
                    value: 'customer',
                },
            ],
            hooks: {
                beforeChange: [ensureFirstUserIsAdmin],
            },
            access: {
                read: admins,
                create: admins,
                update: admins,
            },
        },
        {
            name: 'purchases',
            label: 'Purchases',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            hooks: {
                beforeChange: [resolveDuplicatePurchases],
            },
        },
        {
            name: 'subscription',
            label: 'Subscription',
            type: 'relationship',
            relationTo: 'subscriptions',
        },
        {
            name: 'stripeCustomerID',
            label: 'Stripe Customer',
            type: 'text',
            access: {
                read: ({ req: { user } }) => checkRole(['admin'], user),
            },
            admin: {
                position: 'sidebar',
                components: {
                    Field: CustomerSelect,
                },
            },
        },

    ]
}