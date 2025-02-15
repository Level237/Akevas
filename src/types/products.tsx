export interface Product{
    id:string,
    product_name:string,
    product_price:number,
    product_quantity:number,
    product_description:string,
    product_profile:string,
    product_images:string[],
    product_categories:Category[],
    product_attributes:string[] | null,
    product_variants:string[] | null,
    status:boolean,
    created_at:string,
}

export type Category = {
    id:string,
    category_name:string,
}