import { Product } from "./product.model";

export interface OrderProduct {
    productId: number;
    quantity: number;
    productDetails?: Product;
}