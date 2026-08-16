import type { Request, Response } from 'express';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DB_FILE = process.env['DB_PATH']
  ? path.resolve(process.env['DB_PATH'])
  : path.join(process.cwd(), 'db', 'blog.db');

let db: Database | null = null;

const connectDB = async (): Promise<Database> => {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });

  await db.run(/* sql */ `PRAGMA foreign_keys = ON`);

  await db.run(/* sql */ `
    CREATE TABLE IF NOT EXISTS users
    (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name  TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE
    )
  `);

  await db.run(/* sql */ `
    CREATE TABLE IF NOT EXISTS roles
    (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  await db.run(/* sql */ `
    CREATE TABLE IF NOT EXISTS users_roles
    (
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, role_id)
    )
  `);

  console.log('Database connected and tables initialized.');
  return db;
};

connectDB()
  .then(() => console.log('DB is up and running.'))
  .finally(() => console.log('Could not connect to database.'));

/* Functional Programming: Pure Functions */

/* Bad pattern - Impure function (result depends on live DB state, not just the argument) */
// const toUserResponse = async (userId: number): Promise<UserResponse> => {
//   const db = await connectDB();
//   const row = await db.get(/*sql*/ 'SELECT * FROM users WHERE id = ?', [
//     userId,
//   ]);
//   const role = await db.get(
//     /*sql*/
//     'SELECT role FROM roles WHERE id = ?',
//     [userId],
//   );
//
//   return {
//     id: row.id,
//     fullName: `${row.first_name} ${row.last_name}`,
//     email: row.email,
//     role: role.name,
//   };
// };

type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type UserResponse = {
  id: number;
  fullName: string;
  email: string;
};

/* Good pattern - Pure function (depends only on its argument, easy to test) */
const toUserResponse = (row: UserRow): UserResponse => {
  return {
    id: row.id,
    fullName: `${row.first_name} ${row.last_name}`,
    email: row.email,
  };
};

const sampleUserRow: UserRow = {
  id: 1,
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
};
console.log(toUserResponse(sampleUserRow));

/* Functional Programming: Immutability */
type Order = {
  id: number;
  status: 'open' | 'paid';
};

/* Bad pattern - Mutates the object the caller passed in */
const markAsPaidMutates = (order: Order): void => {
  order.status = 'paid';
};

const orderToMutate: Order = { id: 1, status: 'open' };
markAsPaidMutates(orderToMutate);
console.log(orderToMutate.status); // "paid" - the original was silently changed

/* Good pattern - Returns a new object instead of mutating the old one */
const markAsPaidImmutable = (order: Order): Order => {
  return {
    ...order,
    status: 'paid',
  };
};

const orderToKeep: Order = { id: 2, status: 'open' };
const paidOrder = markAsPaidImmutable(orderToKeep);
console.log(orderToKeep.status); // still "open"
console.log(paidOrder.status); // "paid"

/* Functional Programming: Array and Value Transformations */
type Product = {
  id: number;
  name: string;
  priceInCents: number;
  isActive: boolean;
};

const products: Product[] = [
  { id: 1, name: 'Keyboard', priceInCents: 9900, isActive: true },
  { id: 2, name: 'Mouse', priceInCents: 4900, isActive: false },
  { id: 3, name: 'Monitor', priceInCents: 19900, isActive: true },
];

const activeProductNames = products
  .filter((product) => product.isActive)
  .map((product) => product.name);

console.log(activeProductNames);

/* Functional Programming: Side Effects at the Edges */
type CreateUserInput = {
  firstName: string;
  lastName: string;
};

/* Good pattern - Pure transformation logic, kept separate from persistence */
const buildUserInsert = (input: CreateUserInput) => {
  return {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
  };
};

type User = {
  first_name: string;
  last_name: string;
};

const users: User[] = [];

class UserRepository {
  create(user: User): User {
    users.push(user);
    return user;
  }
}

const repository = new UserRepository();

/* Good pattern - Side effects (persistence, HTTP response) isolated in the handler */
const createUserHandler = async (req: Request, res: Response) => {
  const userInsert = buildUserInsert(req.body);
  const savedUser = repository.create(userInsert);

  res.status(201).json(savedUser);
};

const seedUser = repository.create({
  first_name: 'John',
  last_name: 'Doe',
});

console.log(seedUser);

// mock req/res so createUserHandler can be demoed without a running Express server
const mockCreateUserReq = {
  body: { firstName: 'Grace', lastName: 'Hopper' },
} as unknown as Request;

const mockRes = {
  status(code: number) {
    console.log(`response status: ${code}`);
    return this;
  },
  json(body: unknown) {
    console.log('response body:', body);
    return this;
  },
} as unknown as Response;

await createUserHandler(mockCreateUserReq, mockRes);

/* Object-Oriented Programming: Objects, Classes, and Instances */
class BankAccount {
  ownerName: string;
  balance: number;

  constructor(ownerName: string, balance: number) {
    this.ownerName = ownerName;
    this.balance = balance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount('John', 20000);
account.deposit(250);
console.log(account.getBalance());

/* JavaScript Classes: Defining a Class */
class Book {
  title: string;
  author: string;

  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
  }

  describe() {
    return `${this.title} by ${this.author}`;
  }
}

const harryPotterBook = new Book('Harry Potter', 'J.K Rowling');
console.log(harryPotterBook.describe());

/* JavaScript Classes: Public, Private, and Static Fields */
class Counter {
  static description = 'Count things';
  #count = 0;

  increment(): void {
    this.#count++;
  }

  getCount(): number {
    return this.#count;
  }
}

const testCounter = new Counter();
testCounter.increment();
console.log(testCounter.getCount());
testCounter.increment();
testCounter.increment();
console.log(testCounter.getCount());

/* JavaScript Classes: Getters and Setters */
class BankAccountWithGetSet {
  #balance = 0;

  constructor(initialBalance: number) {
    this.#balance = initialBalance;
  }

  get balance(): number {
    return this.#balance;
  }

  set balance(newBalance: number) {
    if (newBalance < 0) {
      throw new Error('Balance cannot be negative');
    }

    this.#balance = newBalance;
  }
}

const accountGetSet = new BankAccountWithGetSet(500);
console.log(accountGetSet.balance);
accountGetSet.balance = 250;

// accountGetSet.balance = -100; // throws, since newBalance is smaller than 0

/* JavaScript Classes: Inheritance (extends / super) */
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): string {
    return `${this.name} makes noise.`;
  }
}

class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  override speak(): string {
    return `${this.name} barks.`;
  }
}

const fluffy = new Animal('Fluffy');
console.log(fluffy.speak());

const bronx = new Dog('Barky', 'Golden retriever');
console.log(bronx.speak());

/* JavaScript Classes: Optional - Methods Before ES6 (plain object literal) */
const book = {
  title: 'LOTR',
  describe() {
    return this.title;
  },
};

console.log(book.describe());

/* JavaScript Classes: Optional - Constructor Functions + Prototype (pre-class syntax, commented reference) */
// function Book(title, author) {
//   this.title = title;
//   this.author = author;
// }
//
// Book.prototype.describe = function () {
//   return `${this.title} by ${this.author}`;
// };
//
// const dune = new Book("Dune", "Frank Herbert");
// console.log(dune.describe()); // "Dune by Frank Herbert"

/* JavaScript Classes: Optional - Prototype Chain Inspection */

class BookClass {
  title: string;

  constructor(title: string) {
    this.title = title;
  }

  describe() {
    return this.title;
  }
}

const duneBook = new BookClass('Dune');
console.log(Object.getPrototypeOf(duneBook) === BookClass.prototype); // true
console.log(Object.getPrototypeOf(BookClass.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null

/* TypeScript Classes: Typed Properties and Constructors */

class TypedUser {
  id: number;
  email: string;
  isActive: boolean;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
    this.isActive = true;
  }
}

const typedUsr = new TypedUser(2, 'example@mail.com');
console.log(typedUsr.email);
console.log(typedUsr.isActive);

/* TypeScript Classes: Access Modifiers (public / private / protected) */
class UserAccount {
  public email: string;
  private failedLoginAttempts: number;
  protected role: 'user' | 'admin';

  constructor(email: string, role: 'user' | 'admin') {
    this.email = email;
    this.role = role;
    this.failedLoginAttempts = 0;
  }

  registerFailedLogin(): void {
    this.failedLoginAttempts++;
  }

  getFailedLoginCount(): number {
    return this.failedLoginAttempts;
  }
}

const user1 = new UserAccount('mail@mail.com', 'user');
console.log(user1.email);
user1.registerFailedLogin();
// console.log(user1.role); // Error: 'role' is protected
console.log(user1.getFailedLoginCount());

/* TypeScript Classes: protected Members and Inheritance */
class Employee {
  protected department: string;

  constructor(department: string) {
    this.department = department;
  }
}

class Manager extends Employee {
  describeDepartment(): string {
    return `Manages the ${this.department} department.`;
  }
}

const manager = new Manager('Engineering');
// console.log(manager.department); // Error: 'department' is protected
console.log(manager.describeDepartment());

/* TypeScript Classes: private vs #private */
class Wallet {
  private readonly ownerId: string;
  readonly #balance: number;

  constructor(ownerId: string, initialBalance: number) {
    this.ownerId = ownerId;
    this.#balance = initialBalance;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getBalance(): number {
    return this.#balance;
  }
}

const wallet = new Wallet('2', 500);
// console.log(wallet.ownerId); // TypeScript error, private is compile-time only
// console.log(wallet.#balance); // Real JavaScript error, #private is runtime-enforced
console.log(wallet.getOwnerId());
console.log(wallet.getBalance());

/* TypeScript Classes: Constructor Parameter Shorthand */
class UserAccountShorthand {
  private failedLoginAttempts: number = 0;

  constructor(
    public email: string,
    protected role: string,
  ) {}

  getFailedLogins(): number {
    return this.failedLoginAttempts;
  }
}

const newShortHand = new UserAccountShorthand('mail@mail.com', 'It');
console.log(newShortHand);
console.log(newShortHand.getFailedLogins());

/* TypeScript Classes: Encapsulation with #private */
class BankAccountPrivate {
  #balance: number;

  constructor(initialBalance: number) {
    this.#balance = initialBalance;
  }

  deposit(amount: number): string {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero.');
    }

    this.#balance += amount;
    return `Money is deposited`;
  }

  getDeposit(): string {
    return `Your balance is: ${this.#balance}`;
  }
}

const bankAcc = new BankAccountPrivate(10000);
console.log(bankAcc.deposit(500));
console.log(bankAcc.getDeposit());

/* TypeScript Classes: Getters and Setters with Validation */

class EmployeeWithSetGet {
  #salary = 0;

  get salary(): number {
    return this.#salary;
  }

  set salary(newSalary: number) {
    if (newSalary < this.#salary) {
      throw new Error('Salary cannot be decreased.');
    }

    this.#salary = newSalary;
  }
}

const testEmployee = new EmployeeWithSetGet();
testEmployee.salary = 4000; // invokes the setter
console.log(testEmployee.salary);

/* TypeScript Classes: Interfaces as Contracts */

interface Entity {
  id: number;
}

interface Activatable {
  activate(): void;
}

class UserWithInterfaces implements Entity, Activatable {
  id: number;
  isActive: boolean;

  constructor(id: number) {
    this.id = id;
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}

const testUsr = new UserWithInterfaces(2);
console.log(testUsr.isActive);
testUsr.activate();
console.log(testUsr.isActive);

/* TypeScript Classes: Abstract Classes and Polymorphism */
abstract class NotificationChannel {
  abstract send(message: string): void;
}

class EmailChannel extends NotificationChannel {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SmsChannel extends NotificationChannel {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

const email = new EmailChannel();
email.send('Test email');
const sms = new SmsChannel();
sms.send('Test sms');

/* OOP Design Principles: SRP - Bad pattern (validation, record creation, and persistence all mixed together) */
type UserRecord = {
  id: string;
  username: string;
  email: string;
};

const saveToDatabase = (userRecord: UserRecord): UserRecord => {
  console.log(`User: ${userRecord.username} successfully saved to DB.`);
  return userRecord;
};

const registerUser = (username: string, email: string) => {
  if (!email.includes('@')) {
    throw new Error('Invalid Email.');
  }

  const userRecord = {
    id: crypto.randomUUID(),
    username,
    email,
  };

  return saveToDatabase(userRecord);
};

const srpUser = registerUser('max', 'max@mail.com');
console.log(srpUser);

/* OOP Design Principles: SRP - Good pattern (validation, record creation, and persistence separated) */
const validateEmail = (email: string): void => {
  if (!email.includes('@')) {
    throw new Error('Invalid email.');
  }
};

const buildUserRecord = (username: string, email: string): UserRecord => {
  return {
    id: crypto.randomUUID(),
    username,
    email,
  };
};

const registerUserClean = (username: string, email: string) => {
  validateEmail(email);
  const userRecord = buildUserRecord(username, email);
  return saveToDatabase(userRecord);
};

const srpUserClean = registerUserClean('John', 'john@email.com');
console.log(srpUserClean);

/* OOP Design Principles: DRY - Derived Types from a Single Source of Truth */
interface ProductRecord {
  id: number;
  name: string;
  price: number;
  inventory: number;
  supplierId: string;
}

type ProductCard = Pick<ProductRecord, 'id' | 'name' | 'price'>;
type ProductCreatePayload = Omit<ProductRecord, 'id' | 'supplierId'>;

class Store {
  product: ProductRecord;

  constructor(product: ProductRecord) {
    this.product = product;
  }

  getProductCard() {
    return { id: 3 } as ProductCard;
  }

  createProductPayload() {
    return {
      name: 'Motherboard',
      price: 200,
      inventory: 100,
    } as ProductCreatePayload;
  }
}

const sampleProduct = {
  id: 1,
  name: 'Motherboard',
  price: 200,
  inventory: 101,
  supplierId: crypto.randomUUID(),
};
const myStore = new Store(sampleProduct);
console.log(myStore);
console.log(myStore.getProductCard());
console.log(myStore.createProductPayload());

/* OOP Design Principles: Separation of Concerns */
/* Bad pattern - Illustrative only, does not compile on its own: `userService` is
   assumed to exist somewhere else, so the controller can't be reasoned about or
   tested without knowing that hidden dependency. */
// const createUserControllerBeforeDI = async (req: Request, res: Response) => {
//   const newUser = await userService.createUser(req.body);
//   res.status(201).json(newUser);
// };

type SoCUser = {
  username: string;
};

interface UserService {
  createUser(username: string): Promise<SoCUser>;
}

/* Good pattern - Controller depends on the UserService contract, not a concrete class */
class SqlUserService implements UserService {
  async createUser(username: string): Promise<SoCUser> {
    console.log(`Saving user "${username}" via SQL.`);
    return { username };
  }
}

const createUserController = async (
  req: Request,
  res: Response,
  userService: UserService,
) => {
  const newUser = await userService.createUser(req.body.username);
  res.status(201).json(newUser);
};

const sqlUserService = new SqlUserService();
const mockSoCReq = { body: { username: 'grace' } } as unknown as Request;
await createUserController(mockSoCReq, mockRes, sqlUserService);
