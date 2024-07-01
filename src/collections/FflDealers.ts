import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { admins } from "../payload/access/admin";
import { slugField } from "../payload/fields/slug";
import { CollectionConfig } from "payload/types";

const FflDealers: CollectionConfig = {
    slug: "fflDealers",
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
            name: 'address',
            type: 'textarea',
            label: 'Address',
        },
        {
            label: 'Name',
            name: 'name',
            type: 'text',
            required: true,
        },


    ]
}

export default FflDealers