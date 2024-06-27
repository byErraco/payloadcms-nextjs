import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { admins } from "../payload/access/admin";
import { slugField } from "../payload/fields/slug";
import { CollectionConfig } from "payload/types";

const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "title",
    },
    access: {
        read: () => true,
        update: admins,
        create: admins,
        delete: admins,
    },
    fields: [
        {
            name: 'description',
            type: 'textarea',
            label: 'Product details',
        },
        {
            name: 'price',
            label: 'Base Price in USD',
            // min: 0,
            // max: 1000,
            type: 'number',
            required: true,
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        // {
        //     name: 'priceId',
        //     type: 'text',
        //     required: true,
        // },
        // {
        //     name: 'stripeId',
        //     type: 'text',
        //     required: true,
        // },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'relatedProducts',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            filterOptions: ({ id }) => {
                return {
                    id: {
                        not_in: [id],
                    },
                }
            },
        },
        slugField(),
        {
            name: 'images',
            type: 'array',
            label: 'Product images',
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: 'Image',
                plural: 'Images',
            },
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
        },
        {
            name: 'approvedForSale',
            label: 'Product Status',
            type: 'select',
            defaultValue: 'draft',
            access: {
                create: admins,
                read: admins,
                update: admins,
            },
            options: [
                {
                    label: 'Draft',
                    value: 'draft',
                },
                {
                    label: 'Published',
                    value: 'published',
                },
                //   {
                //     label: 'Denied',
                //     value: 'denied',
                //   },
            ],
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
        {
            name: 'prices', // required
            type: 'array', // required
            label: 'Product Tier Prices',
            // minRows: 2,
            // maxRows: 10,
            labels: {
                singular: 'Price',
                plural: 'prices',
            },
            fields: [
                // required
                {
                    name: 'price',
                    label: 'Price in USD',
                    // min: 0,
                    // max: 1000,
                    type: 'number',
                    required: true,
                },
                {
                    name: 'availableByTier',
                    type: 'relationship',
                    relationTo: 'tiers',

                }

            ],
            admin: {
                components: {
                    RowLabel: ({ data, index }: RowLabelArgs) => {
                        return data?.title || `Price ${String(index).padStart(2, '0')}`
                    },
                },
            },
        },
    ]
}

export default Products