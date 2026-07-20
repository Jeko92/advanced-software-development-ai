import { Order, Product } from "./types.ts";

export function orderTotal(order: Order): number {
  return order.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}

export function formatOrder(order: Order): string {
  const products = order.items
    .map((item) => `${item.quantity} x ${item.product.name}`)
    .join(", ");

  return `Order #${order.id}
Customer: ${order.customer.name}
Status: ${order.status}
Items: ${products}
Total: €${orderTotal(order).toFixed(2)}`;
}

export function isInStock(product: Product): boolean {
  return product.stock > 0;
}
