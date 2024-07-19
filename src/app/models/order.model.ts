import { OrderProduct } from "./orderProduct.model";

export interface Order {
    id?: number;
    userId: number;
    products: OrderProduct[],
    totalPrice: number;
    date: string;
    status: string;
}