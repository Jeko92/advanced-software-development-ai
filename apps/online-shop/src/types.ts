export interface Category {
  name: string;
  description?: string;
}

export interface Product {
  readonly id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface LineItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped";

export interface Order {
  id: number;
  customer: Customer;
  items: LineItem[];
  status: OrderStatus;
}
