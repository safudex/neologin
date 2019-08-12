import connectToChild from 'penpal/lib/connectToChild';
 
const iframe = document.createElement('iframe');
iframe.src = 'http://example.com/iframe.html';
document.body.appendChild(iframe);
 
const connection = connectToChild({
  // The iframe to which a connection should be made
  iframe,
  // Methods the parent is exposing to the child
  methods: {
    add(num1, num2) {
      return num1 + num2;
    }
  }
});
 
connection.promise.then(child => {
  child.multiply(2, 6).then(total => console.log(total));
  child.divide(12, 4).then(total => console.log(total));
});
