const scriptURL = 'https://script.google.com/macros/s/AKfycbwDcKPic_QtwZfGP0EbF40eVlKRgvt5gd_lCj9MJ_Qs5BIbigcphCuITyH2Xq87DiaOAg/exec'

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
