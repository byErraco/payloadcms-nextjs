export const unknownError = "An unknown error occurred. Please try again later."

export const redirects = {
    toLogin: "/signin",
    toSignup: "/signup",
    afterLogin: "/dashboard/stores",
    afterLogout: "/",
    toVerify: "/verify-email",
    afterVerify: "/dashboard/stores",
} as const


export type SortFilterItem = {
    title: string;
    slug: string | null;
    sortKey: 'RELEVANCE' | 'featured' | 'createdAt' | 'price';
    reverse: boolean;
};

export const defaultSort: SortFilterItem = {
    title: 'Relevance',
    slug: null,
    sortKey: 'RELEVANCE',
    reverse: false
};

export const sorting: SortFilterItem[] = [
    defaultSort,
    { title: 'Trending', slug: 'trending-desc', sortKey: 'featured', reverse: false }, // asc
    { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'createdAt', reverse: true },
    { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'price', reverse: false }, // asc
    { title: 'Price: High to low', slug: 'price-desc', sortKey: 'price', reverse: true }
];

export const TAGS = {
    collections: 'collections',
    products: 'products',
    cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';