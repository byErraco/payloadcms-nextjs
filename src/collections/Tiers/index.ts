import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { admins } from "../../payload/access/admin";
import { slugField } from "../../payload/fields/slug";
import { CollectionConfig } from "payload/types";

const Tiers: CollectionConfig = {
    slug: "tiers",
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
            label: 'Tier Description',
        },
        {
            name: 'price',
            label: 'Price in USD',
            min: 0,
            max: 1000,
            type: 'number',
            required: true,
        },
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'actionLabel',
            type: 'text',
            required: true,
        },
        {
            name: 'priceIdYearly',
            label: 'Stripe Yearly Price ID',
            type: 'text',
            required: true,
        },
        slugField(),
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
            ],
        },
        {
            name: 'popular',
            type: 'checkbox',
            access: {
                read: admins,
                create: admins,
                update: admins,
            },
            required: false,
        },
        {
            name: 'features', // required
            type: 'array', // required
            label: 'Tier Features',
            minRows: 1,
            maxRows: 10,
            labels: {
                singular: 'Feature',
                plural: 'Features',
            },
            fields: [
                // required
                {
                    name: 'feature',
                    type: 'text',
                },
            ],
            admin: {
                components: {
                    RowLabel: ({ data, index }: RowLabelArgs) => {
                        return data?.title || `Feature ${String(index).padStart(2, '0')}`
                    },
                },
            },
        },
    ]
}

export default Tiers