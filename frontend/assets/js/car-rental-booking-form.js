const scriptURL = 'https://script.google.com/macros/s/AKfycbwH_C8rSveNYN6uY__WaLgQdZU9zjQME8GtpXpP0ZPfnJlZWxN3Ec1KQ4ZoPK2yBdjGMw/exec'

const form = document.forms['Sign Up-form'];

form.addEventListener('submit', e => {
  e.preventDefault();
  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      alert("Thank you! Your form has been submitted successfully. We will Sign Up you shortly");
      form.reset();
    })
    .catch(error => console.error('Error!', error.message));
});