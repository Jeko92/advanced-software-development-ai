import { formatOrder, isInStock, orderTotal } from "./online-shop.js";
import type { Category, Customer, Order, Product } from "./types.js";

const electronics: Category = {
  name: "Electronics",
  description: "Electronic devices and accessories",
};

const laptop: Product = {
  id: 1,
  name: "Laptop",
  price: 1299,
  stock: 5,
  category: electronics,
};

const mouse: Product = {
  id: 2,
  name: "Wireless Mouse",
  price: 39,
  stock: 0,
  category: electronics,
};

const customer: Customer = {
  id: 1,
  name: "Alice Johnson",
  email: "alice@example.com",
};

const order: Order = {
  id: 1001,
  customer,
  items: [
    {
      product: laptop,
      quantity: 1,
    },
    {
      product: mouse,
      quantity: 2,
    },
  ],
  status: "confirmed",
};

console.log("=== Products ===");
console.log(`${laptop.name} in stock: ${isInStock(laptop)}`);
console.log(`${mouse.name} in stock: ${isInStock(mouse)}`);

console.log();

console.log("=== Order ===");
console.log(formatOrder(order));

console.log();

console.log(`Order total: €${orderTotal(order).toFixed(2)}`);
