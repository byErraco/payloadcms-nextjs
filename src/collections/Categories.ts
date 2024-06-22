import { slugField } from '../payload/fields/slug'
import type { CollectionConfig } from 'payload/types'
import { admins } from "../payload/access/admin";


const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
        },
        slugField(),
        {
            name: 'description',
            type: 'textarea',
            label: 'Product details',
        },
        {
            name: 'featured',
            type: 'checkbox',
            access: {
                read: admins,
                create: admins,
                update: admins,
            },
            required: false,
        },
    ],
}

export default Categories