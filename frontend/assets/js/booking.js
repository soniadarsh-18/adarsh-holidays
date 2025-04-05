const scriptURL = 'https://script.google.com/macros/s/AKfycbwVScfN1ye1GHYJ59W0q-2NCXUMHw00y28yLP9wDuh20zX1IrgDyWQZwsXdz3kMgA8J/exec'

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