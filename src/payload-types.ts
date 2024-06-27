/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    products: Product;
    categories: Category;
    subscriptions: Subscription;
    media: Media;
    invoices: Invoice;
    orders: Order;
    tiers: Tier;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  name?: string | null;
  roles?: ('admin' | 'customer')[] | null;
  purchases?: (string | Product)[] | null;
  subscription?: (string | null) | Subscription;
  stripeCustomerID?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Product {
  id: string;
  description?: string | null;
  price: number;
  title: string;
  categories?: (string | Category)[] | null;
  relatedProducts?: (string | Product)[] | null;
  slug?: string | null;
  images: {
    image: string | Media;
    id?: string | null;
  }[];
  approvedForSale?: ('draft' | 'published') | null;
  featured?: boolean | null;
  prices?:
    | {
        price: number;
        availableByTier?: (string | null) | Tier;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface Category {
  id: string;
  title: string;
  media?: string | Media | null;
  slug?: string | null;
  description?: string | null;
  featured?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  alt: string;
  caption?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
export interface Tier {
  id: string;
  description?: string | null;
  price: number;
  title: string;
  actionLabel: string;
  priceIdYearly: string;
  slug?: string | null;
  approvedForSale?: ('draft' | 'published') | null;
  popular?: boolean | null;
  features?:
    | {
        feature?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface Subscription {
  id: string;
  stripeSubscriptionID?: string | null;
  stripeCustomerID?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  planId?: string | null;
  defaultPaymentMethodId?: string | null;
  email?: string | null;
  ownedBy?: (string | null) | User;
  tier?: (string | null) | Tier;
  updatedAt: string;
  createdAt: string;
}
export interface Invoice {
  id: string;
  ownedBy?: (string | null) | User;
  email: string;
  status: string;
  currency: string;
  amountPaid?: string | null;
  amountDue?: string | null;
  subscriptionId: string;
  invoiceId: string;
  updatedAt: string;
  createdAt: string;
}
export interface Order {
  id: string;
  _isPaid: boolean;
  deliveryStatus?: ('delivered' | 'pending') | null;
  status?: ('completed' | 'incomplete' | 'cancelled') | null;
  orderedBy?: (string | null) | User;
  products: (string | Product)[];
  customerOrderDetails:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  total?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}