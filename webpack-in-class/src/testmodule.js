//separate scope from index.js
const var1 = 20;

// console.log("Hi from test module");

function testFunction(v) {
  return v*20;
}

export {testFunction, var1};
