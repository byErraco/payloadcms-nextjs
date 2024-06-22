export const PRODUCT_CATEGORIES = [
    {
        label: 'Cinema',
        value: 'cinema' as const,
        featured: [
            {
                name: 'Editor picks',
                href: `/products?category=ui_kits`,
                imageSrc: '/nav/ui-kits/mixed.jpg',
            },
            {
                name: 'New Arrivals',
                href: '/products?category=ui_kits&sort=desc',
                imageSrc: '/nav/ui-kits/blue.jpg',
            },
            {
                name: 'Bestsellers',
                href: '/products?category=ui_kits',
                imageSrc: '/nav/ui-kits/purple.jpg',
            },
        ],
    },

]