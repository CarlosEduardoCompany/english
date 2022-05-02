// Button menu hamburgue
(function clickHamburgueBtn() {
  const $dialoguesMenuBtn = document.querySelector('.menu-btn');
  const $dialoguesSvgOpen = document.querySelector('.svg-open');
  const $dialoguesSvgClose = document.querySelector('.svg-close');
  const $dialoguesHomeBtn = document.querySelector('.home-btn');

  $dialoguesMenuBtn.addEventListener('click', ()=>{
    $dialoguesMenuBtn.style.setProperty('box-shadow', 'none')

    if(!$dialoguesSvgOpen.classList.contains('d-none')){
      $dialoguesHomeBtn.style.setProperty('transform', 'translateX(0)')
    } else {
      $dialoguesHomeBtn.style.setProperty('transform', 'translateX(-100vw)')
    }
    setTimeout(() => {
      $dialoguesMenuBtn.style.setProperty('box-shadow', '0.25rem 0.25rem 0.25rem #00000075')
      $dialoguesSvgOpen.classList.toggle('d-none');
      $dialoguesSvgClose.classList.toggle('d-none');      
    }, 500);
  });

})();

const $loaderContainer = document.querySelector('.loader-container');
const $ldsSpinner = document.querySelector('.lds-spinner');

window.addEventListener('load', ()=>{
  $loaderContainer.classList.add('d-none');
  $loaderContainer.removeChild($ldsSpinner);
});