const $loaderContainer = document.querySelector('.loader-container');
const $ldsSpinner = document.querySelector('.lds-spinner');

window.addEventListener('load', ()=>{
  $loaderContainer.classList.add('d-none');
  $loaderContainer.removeChild($ldsSpinner);

  /* Login */
  const $loginBtn = document.querySelector('.login-btn');
  /* Set code for this form */
});
