// function greeter(person: string) {
//   return "Hello, " + person;
// }
//
// let user = [0, 1, 2];
//
// document.body.textContent = greeter(user);
//

/******************************************************************/
// Interfaces
// interface Person {
//   firstName: string;
//   lastName: string;
// }
//
// function greeter(person: Person) {
//   return `Hello ${person.firstName} ${person.lastName}`;
// }
//
// let user = { firstName: "Jane", lastName: "User" };
//
// document.body.textContent = greeter(user);

/******************************************************************/
// Classes
// class Student {
//   fullName: string;
//   constructor(
//     public firstName: string,
//     public middleInitial: string,
//     public lastName: string
//   ) {
//     this.fullName = `${firstName} ${middleInitial} ${lastName}`;
//   }
// }
//
// interface Person {
//   firstName: string;
//   lastName: string;
// }
//
// function greeter(person: Person) {
//   return `Hello ${person.firstName} ${person.lastName}`;
// }
//
// let user = new Student("Jane", "M.", "User");
//
// document.body.textContent = greeter(user);

/******************************************************************/
// Type Inference
// let x = 3;

// let x  = [0,1,null];

// class Animal {
// }
//
// class Rhino extends Animal {
//
// }
//
// class Elephant extends Animal {
//
// }
//
// class Snake extends Animal {
//
// }
// // let zoo = [new Rhino(), new Elephant(), new Snake()];
// let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
//
// console.log(zoo);
//
// window.onmousedown = function (mouseEvent) {
//   console.log(mouseEvent.button);
//   console.log(mouseEvent.kangaroo);
// }
//
// window.onscroll = function (uiEvent) {
//   console.log(uiEvent.button);
// }
//
// const handler = function (uiEvenet) {
//   console.log(uiEvenet.button);
// }
// window.onscroll = function (uiEvent:any) {
//   console.log(uiEvent.button);
// }
// type Animal = {
//   name: string;
// }
// class Rhino  {
//   public name = "MyRhino"
// }
//
// class Elephant {
//   public name = "MyElephant"
// }
//
// class Snake {
//   public name = "MySnake"
// }
//
// function createZoo(): Animal[] {
//   return [new Rhino(), new Elephant(), new Snake()];
// }
//
// // Parameter type annotation
// function greet(name: string) {
//   console.log("Hello, " + name.toUpperCase() + "!!");
// }

// // Would be a runtime error if executed!
// greet(42);
//
// function getFavoriteNumber(): number {
//   return 26;
// }

// async function getFavoriteNumber(): Promise<number> {
//   return 26;
// }

