export class Slider extends HTMLElement {

  constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.newStyle = '';
    this.height = '50vh';
    this.outsideBorder = 'thin solid #000000'
    this.insideBorder = 'thin solid #000000'
    this.backgroundColorBtn = '#ffffff';
    this.textColorBtn = '#000000';
    this.bordercolorbtn = '#000000';
  }

   /******************** Function ********************/   
  static get observedAttributes(){
    return['data-style', 'data-height', 'data-outsideborder', 'data-insideborder', 'data-backgroundcolorbtn', 'data-textcolorbtn', 'data-bordercolorbtn'];
  }

  attributeChangedCallback(nameAttr, oldValue, newValue){
    switch (nameAttr) {
      case 'data-style':
        this.newStyle = newValue;
        break;
    
      case 'data-height':
        this.height = newValue;
        break;

      case 'data-outsideborder':
        this.outsideBorder = newValue;
        break;

      case 'data-insideborder':
        this.insideBorder = newValue;

      case 'data-backgroundcolorbtn':
         this.backgroundColorBtn = newValue;
         break;
      
      case 'data-textcolorbtn':
        this.textColorBtn = newValue;
        break;

      case 'data-bordercolorbtn':
        this.borderColorBtn = newValue;
        break;

      default:
        break;
    }
  }

  startSlider() {
      const $sliderContainer = this.shadowRoot.querySelector('.slider-container');
      const $sliderBtnNext = this.shadowRoot.querySelector('.slider-btn-next');
      const $sliderBtnPrev = this.shadowRoot.querySelector('.slider-btn-prev');
      const $sliderTag = document.getElementsByTagName('slider-tag');
      const $slides = $sliderTag[0].querySelectorAll('.slide');
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < $slides.length; i++) {
        const slide = $slides[i];
        fragment.appendChild(slide);    
      }

      $sliderContainer.appendChild(fragment);
    
      let i = 0;
      // Next button
      $sliderBtnNext.addEventListener('click', ()=>{
        let thisSlide =$slides[i];
        let nextSlide =$slides[i+1];

        if(nextSlide === undefined){
          nextSlide = $slides[0];
        }

        thisSlide.classList.remove('toRight');
        // For the syncronic
        setTimeout(() => {
          thisSlide.style.setProperty('transform', 'translateX(-100vw)');      
        }, 0);

        setTimeout(() => {
          thisSlide.classList.remove('active');
          thisSlide.removeAttribute('style');
          nextSlide.classList.add('active');      
        }, 500);
        
        i++;

        if(i === $slides.length){
          i = 0;
        } 
      });

      // Prev button
      $sliderBtnPrev.addEventListener('click', ()=>{
        let thisSlide =$slides[i];
        let preSlide =$slides[i-1];

        if(preSlide === undefined){
          preSlide = $slides[$slides.length-1];
        }

      if(i === 0){
      i = $slides.length;
      } 
      i--;

      thisSlide.classList.remove('toRight');
      // For the syncronic
      setTimeout(() => {
        thisSlide.style.setProperty('transform', 'scale(0.1)');     
      }, 0);
      
      setTimeout(() => {
        thisSlide.removeAttribute('style');
        thisSlide.classList.remove('active');
        preSlide.classList.add('active');
        preSlide.classList.add('toRight');
        }, 500);
      }); 

  }

   connectedCallback(){
    let cssTemplate = `
    <style>
    /********************** host **********************/
      :host {
        --white-color: #ffffff;
        --box-shadow: 0.25rem 0.25rem 0.25rem #00000075;
        width: 100%;
      }

      /********************** @keyframes **********************/
      @keyframes animationToRight {
      from {
        transform: translateX(-100vw);
      }

      to {
        transform: translateX(0);
      }
    }

    @keyframes animationToLeft {
      from {
        transform: translateX(-100vw);
      }

      to {
        transform: translateX(0);
      }
    }

    .toRight {
      animation-name: animationToRight;
      animation-duration: 0.5s;
      animation-timing-function: linear;
      animation-fill-mode: both;
    }

    .toLeft {
      animation-name: animationToLeft;
      animation-duration: 0.5s;
      animation-timing-function: linear;
      animation-fill-mode: both;
    }

    /********************** Styles for this component **********************/
    .slider {
      position: relative;
      height: ${this.height};
      margin: 0;
      padding: 1rem;
      overflow: hidden;
      border: ${this.outsideBorder};
    }

    .slider-container {  
      position: relative;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 100%;
      padding: 0;
      margin: 0;
    }

    .slide {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      background-color: var(--white-color);
      border-radius: 0.5rem;
      border: ${this.insideBorder};
      box-shadow: var(--box-shadow);
      transform: scale(0.5);
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      transition: opacity 0.5s linear, transform 0.5s linear;
    }

    .slide.active {
      opacity: 1;
      transform: scale(1);
      visibility: visible;
    }

    .slider-btn-next {
      position: absolute;
      top: calc(50% - 2.5rem); 
      right: 0;
      width: 1rem;
      height: 5rem;
      margin: 0;
      padding: 0;
      font-size: 1.5rem;
      color: ${this.textColorBtn};
      text-align: center;
      background-color: ${this.backgroundColorBtn};
      border-color: ${this.borderColorBtn};
      border-radius:0 0.5rem 0.5rem 0;
      box-shadow: var(--box-shadow);
      cursor: pointer;
    }

    .slider-btn-prev {
      position: absolute;
      top: calc(50% - 2.5rem); 
      left: 0;
      width: 1rem;
      height: 5rem;
      margin: 0;
      padding: 0;
      font-size: 1.5rem;
      color: ${this.textColorBtn};
      text-align: center;
      background-color: ${this.backgroundColorBtn};
      border-color: ${this.borderColorBtn};
      border-radius: 0.5rem 0 0 0.5rem;
      box-shadow: var(--box-shadow);
      cursor: pointer;
    }

    /**********************  New styles for this component **********************/
    ${this.newStyle} 

   /********************** utilities **********************/
    .d-none {
      display: none;
    }
    </style>
    `;
    let htmlTemplate = `
      <div class="slider">
          <!--------- Content ------------->
          <div class="slider-container">
          </div>
          <!--------- Controls ------------->
          <button class="slider-btn-next">&raquo;</button>
          <button class="slider-btn-prev">&laquo;</button>
      </div>
    `;    
     
     this.shadowRoot.innerHTML += `${cssTemplate}${htmlTemplate}`;     
     this.startSlider();

   }
}
window.customElements.define('slider-tag', Slider);

/***************************************** Documentation *****************************************/