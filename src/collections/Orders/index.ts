import { admins } from '../../payload/access/admin'
import { adminsOrOrderedBy } from '../../payload/access/adminsOrOrderedBy'
import type { CollectionConfig } from 'payload/types'
import { adminsOrLoggedIn } from '../../payload/access/adminsOrLoggedIn'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { LinkToPaymentIntent } from './ui/LinktoPaymentIntent'


export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  // hooks: {
  //   afterChange: [updateUserPurchases, clearUserCart],
  // },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
      // admin: {
      //   hidden: true,
      // },
      required: true,
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      options: [
        {
          label: 'delivered',
          value: 'delivered',
        },
        {
          label: 'pending',
          value: 'pending',
        },

      ],
      defaultValue: 'pending',
      required: false
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'completed',
          value: 'completed',
        },
        {
          label: 'incomplete',
          value: 'incomplete',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'incomplete',
      required: false
    },
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      // hooks: {
      //   beforeChange: [populateOrderedBy],
      // },
      // required: true,
    },
    {
      name: 'customerEmail',
      label: 'Customer Email',
      type: 'text',
    },
    // {
    //   name: 'user',
    //   type: 'relationship',
    //   relationTo: 'users',
    //   // hooks: {
    //   //   beforeChange: [populateOrderedBy],
    //   // },
    // },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
    },
    {
      name: 'customerOrderDetails', // required
      type: 'json', // required
      required: true,
    },
    // {
    //   name: 'stripePaymentIntentID',
    //   label: 'Stripe Payment Intent ID',
    //   type: 'text',
    //   admin: {
    //     position: 'sidebar',
    //     components: {
    //       Field: LinkToPaymentIntent,
    //     },
    //   },
    // },
    {
      name: 'total',
      type: 'number',
      required: false,
      min: 0,
    },
    // {
    //   name: 'items',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'product',
    //       type: 'relationship',
    //       relationTo: 'products',
    //       required: true,
    //     },
    //     {
    //       name: 'price',
    //       type: 'number',
    //       min: 0,
    //     },
    //     {
    //       name: 'quantity',
    //       type: 'number',
    //       min: 0,
    //     },
    //   ],
    // },
  ],
}