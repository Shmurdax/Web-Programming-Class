// es6_assignment.js
// JavaScript ES6 Assignment - COMS-3163
// Task 2 NOW REQUIRES YOU TO TYPE A NUMBER (real input via prompt)

// =============================================
// Task 1 – Variables (let vs const)
// =============================================
console.log("=== Task 1: Variables (let vs const) ===");

const course = "Web Programming";
let students = 30;
students += 5;

console.log("Course:", course);
console.log("Total Students:", students);
console.log("");


// =============================================
// Task 2 – Arrow Functions (TYPE A NUMBER HERE)
// =============================================
console.log("=== Task 2: Arrow Functions ===");

// Arrow function named square
const square = (num) => num * num;
const userInput = parseInt(prompt("Task 2 - Enter a number to square:"));
console.log(`The Square of ${userInput} is ${square(userInput)}`);
console.log("");


// =============================================
// Task 3 – Template Literals
// =============================================
console.log("=== Task 3: Template Literals ===");

const name = "Alice";
const age = 21;
const city = "Dallas";

console.log(`My name is ${name}, I am ${age} years old, and I live in ${city}.`);
console.log("");


// =============================================
// Task 4 – Array Destructuring
// =============================================
console.log("=== Task 4: Array Destructuring ===");

let fruits = ["Apple", "Banana", "Cherry"];
const [firstFruit, secondFruit, thirdFruit] = fruits;

console.log(firstFruit);
console.log(secondFruit);
console.log(thirdFruit);
console.log("");


// =============================================
// Task 5 – Object Destructuring
// =============================================
console.log("=== Task 5: Object Destructuring ===");

const student = {
  name: "John",
  major: "Computer Science",
  year: 2
};

const { name: studentName, major, year } = student;

console.log("Name:", studentName);
console.log("Major:", major);
console.log("Year:", year);
console.log("");


// =============================================
// Task 6 – Spread Operator
// =============================================
console.log("=== Task 6: Spread Operator ===");

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

const combined = [...arr1, ...arr2];
console.log(combined);
console.log("");


// =============================================
// Task 7 – Array Method (map)
// =============================================
console.log("=== Task 7: Array Method (map) ===");

let numbers = [1, 2, 3, 4];
const multiplied = numbers.map(num => num * 3);
console.log(multiplied);
console.log("");


// =============================================
// Task 8 – Array Method (filter)
// =============================================
console.log("=== Task 8: Array Method (filter) ===");

let numbers2 = [5, 10, 15, 20, 25];
const greaterThan15 = numbers2.filter(num => num > 15);
console.log(greaterThan15);
console.log("");


// =============================================
// Task 9 – Array Method (forEach)
// =============================================
console.log("=== Task 9: Array Method (forEach) ===");

let colors = ["Red", "Green", "Blue"];
colors.forEach(color => console.log(color));