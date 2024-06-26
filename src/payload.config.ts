import { buildConfig } from 'payload/config'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { Users } from './collections/Users'
import Products from './collections/Products'
import dotenv from 'dotenv';
import Categories from './collections/Categories'
import Subscriptions from './collections/Subscriptions'
import { Media } from './collections/Media'
import { Invoices } from './collections/Invoices'
import { Orders } from './collections/Orders'
import Tiers from './collections/Tiers'
import FflDealers from './collections/FflDealers'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [Users, Products, Categories, Subscriptions, Media, Invoices, Orders, Tiers, FflDealers],
  routes: {
    admin: '/admin'
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Awsh',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    }
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  }
})