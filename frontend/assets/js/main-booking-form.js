const scriptURL = 'https://script.google.com/macros/s/AKfycbzO21nnNxlsxPtnEuN7-X72vNYLE35RAtsjDowYhZzRwl-F0DGW-usFOArd6UzCqUuR/exec'

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