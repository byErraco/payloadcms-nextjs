import type { CollectionConfig } from 'payload/types'

const Subscriptions: CollectionConfig = {
    slug: 'subscriptions',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'stripeSubscriptionID',
            label: 'Stripe Subscription',
            type: 'text',
        },
        {
            name: 'stripeCustomerID',
            label: 'Stripe Customer',
            type: 'text',
        },
        {
            name: 'status',
            label: 'Subscription Status',
            type: 'text',
        },
        {
            name: 'startDate',
            label: 'Subscription Start Date',
            type: 'text',
        },
        {
            name: 'endDate',
            label: 'Subscription End Date',
            type: 'text',
        },
        {
            name: 'planId',
            label: 'Plan ID',
            type: 'text',
        },
        {
            name: 'defaultPaymentMethodId',
            label: 'Default Payment Method ID',
            type: 'text',
        },
        {
            name: 'email',
            label: 'Email',
            type: 'text',
        },
        {
            name: 'ownedBy',
            type: 'relationship',
            relationTo: 'users',
        }
    ],
}

export default Subscriptions