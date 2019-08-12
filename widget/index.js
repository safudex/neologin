import connectToParent from 'penpal/lib/connectToParent';
 
const connection = connectToParent({
  // Methods child is exposing to parent
  methods: {
    multiply(num1, num2) {
      return num1 * num2;
    },
    divide(num1, num2) {
      // Return a promise if the value being returned requires asynchronous processing.
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(num1 / num2);
        }, 1000);
      });
    }
  }
});
 
connection.promise.then(parent => {
  parent.add(3, 1).then(total => console.log(total));
});
