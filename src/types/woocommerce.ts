// file:///home/mike/projects/astro/melipone-astro/src/types/woocommerce.ts
export interface Product {
    id: number;
    slug: string;
    name: string;
    price: string;
    regular_price: string;
    sale_price: string;
    description: string;
    short_description: string;
    images: {
        src: string;
        alt: string;
    }[];
    attributes: {
        id: number;
        name: string;
        options: string[];
    }[];
    permalink: string;
}
