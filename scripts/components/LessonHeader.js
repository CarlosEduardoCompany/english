/***************************************** Component *****************************************/
export class LessonHeader extends HTMLElement {
  constructor(options) {
    super();
    const { lessonHomeDir, lessonName, practiceContainer, theoryContainer } = options;
    this.attachShadow({ mode: "open" });

    this.lessonHomeDir = lessonHomeDir;
    this.lessonName = lessonName;
    this.practiceContainer = practiceContainer;
    this.theoryContainer = theoryContainer;
    
  }

  /********************* Functions *********************/
  // Connected Callback 
  connectedCallback() {
    let cssTemplate = `
    <style>
          /*************************************** Select type test ***************************************/
      :host {
        --white-color: #ffffff;
        --box-shadow: 0.25rem 0.25rem 0.25rem #00000075;
        --first-color: #fd6107;
        font-family: sans-serif;
        font-weight: 400; 
      }

      .header-container {    
        width: 100%;  
        height: 18vh;
        background-color: var(--white-color);
        box-shadow: var(--box-shadow);
      }

      .title-header {
        width: 90%;
        margin: 0 auto 1rem auto;
        padding: 0.5rem;
        font-family: sans-serif;
        font-weight: 800;
        font-size: 1.5rem;
        color: var(--first-color);
        text-align: center;
        border-top: thin solid var(--first-color);
        border-bottom: thin solid var(--first-color);
      }

      .btn-container-header {
        display: flex;
        justify-content: space-evenly;
        transition: transform 1s linear;
        margin-bottom: 1rem;
      }
      
    .btn-theory-header,
    .btn-practice-header {
      width: 45%;
      padding: 0.5rem;
      font-size: 1rem;
      color: var(--first-color);
      border-radius: 0.5rem;
      border-color: var(--first-color);
      box-shadow: var(--box-shadow);
      background-color: transparent;
      cursor: pointer;
      border: thin solid var(--first-color);
      transition: box-shadow 0.5s linear;
    }

 /*************************************** Utilities ***************************************/
/******************** @keyframes ********************/
@keyframes animationTheoryToRight {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(110vw);
  }
}

.animation-theory-toright {
  animation-name: animationTheoryToRight;
  animation-duration: 0.75s;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

@keyframes animationTheoryToLeft {
  from {
    transform: translateX(110vw);
  }

  to {
    transform: translateX(0);
  }
}

.animation-theory-toleft {
  animation-name: animationTheoryToLeft;
  animation-duration: 0.75s;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

@keyframes animationPracticeToRight {
  from {
    transform: translateX(-110vw);
  }

  to {
    transform: translateX(0);
  }
}

.animation-practice-toright {
  animation-name: animationPracticeToRight;
  animation-duration: 0.75s;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

@keyframes animationPracticeToLeft {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-110vw);
  }
}

.animation-practice-toleft {
  animation-name: animationPracticeToLeft;
  animation-duration: 0.75s;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

/******************** Classes ********************/
.disable {
  color: #aaa;
  border-color: #aaa;
  box-shadow: none;
  pointer-events: none;
}

.d-none {
  display: none;
}
</style>
    `;

    let htmlTemplate = ` 
      <!--------- Lesson Header -------->
      <div class="header-container">
        <h1 class="title-header">${this.lessonName}</h1>
        <div class="btn-container-header">
          <button class="btn-theory-header">Theory</button>
          <button class="btn-practice-header">Practice</button>
        </div>
      </div>
      `;

    let lessonHeader = `${cssTemplate} ${htmlTemplate}`;
    this.shadowRoot.innerHTML = lessonHeader;

  /* Initial Functions */
    this.showTheory();
    this.showPractice();
  }

 showTheory() {
  const $btnTheoryHeader = this.shadowRoot.querySelector('.btn-theory-header');
  
  $btnTheoryHeader.addEventListener('click', ()=>{
    const $btnPracticeHeader = this.shadowRoot.querySelector('.btn-practice-header');
    
    $btnTheoryHeader.classList.add('disable');
    $btnPracticeHeader.classList.remove('disable');
     this.practiceContainer.classList.remove('animation-practice-toright');
     this.practiceContainer.classList.add('animation-practice-toleft');
    
    setTimeout(() => {
      this.theoryContainer.classList.remove('d-none');
      this.theoryContainer.classList.remove('animation-theory-toright');
      this.theoryContainer.classList.add('animation-theory-toleft');
      this.practiceContainer.classList.add('d-none');      
    }, 750);
  });

}

 showPractice() {
  const $btnPracticeHeader = this.shadowRoot.querySelector('.btn-practice-header');
  
  $btnPracticeHeader.addEventListener('click', ()=>{
    const $btnTheoryHeader = this.shadowRoot.querySelector('.btn-theory-header');
    
    $btnTheoryHeader.classList.remove('disable');
    $btnPracticeHeader.classList.add('disable');
    this.theoryContainer.classList.add('animation-theory-toright');
    this.theoryContainer.classList.remove('animation-theory-toleft');

    setTimeout(() => {
       this.practiceContainer.classList.remove('d-none');
       this.practiceContainer.classList.remove('animation-practice-toleft');
       this.practiceContainer.classList.add('animation-practice-toright');
      this.theoryContainer.classList.add('d-none');      
    }, 750);


  });

}
 
}
window.customElements.define("lesson-header", LessonHeader);

/***************************************** Documentation *****************************************/
