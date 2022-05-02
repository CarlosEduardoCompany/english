import { CardTest } from '../components/CardTest.js'
import { LessonHeader } from '../components/LessonHeader.js'
import  '../components/Slider.js';

export function startLesson(dataLesson, lessonName, lessonHomeDir, theoryContainer, practiceContainer) { 
// ----------------------------------- Components -----------------------------------
//------------ Lesson Header ------------
const optionLessonHeader = {
  lessonName,
  lessonHomeDir,
  theoryContainer,
  practiceContainer
}
const $headerContainer = document.querySelector('.header-container');
const headerLesson = new LessonHeader(optionLessonHeader);
$headerContainer.appendChild(headerLesson);

//------------ Card Test ------------
const optionsCardTest = {
  data: dataLesson.words,
  audioDir: dataLesson.audioDir,
  typeCardTest: 'lesson'
}
const $cardTestContainer = document.querySelector('.card-test-container')
const cardTest = new CardTest(optionsCardTest)
$cardTestContainer.appendChild(cardTest) 

// ------------------ Functions ------------------
/* Play audio */
function play(audioDir) {
  const $documentSoundNodes = document.querySelectorAll('.sound-container');
   const $documentSoundNodesArray = Array.from($documentSoundNodes)
   let $sounds;

  window.customElements.whenDefined('slider-tag').then(()=>{
    const $sliderTag = document.getElementsByTagName('slider-tag');   
    console.log($sliderTag.length)
    if(!$sliderTag.length === 0){
      const $shadowRootSoundsNode = $sliderTag[0].shadowRoot.querySelectorAll('.sound-container');   
      const $shadowRootSoundsNodeArray = Array.from($shadowRootSoundsNode)
      $sounds = $documentSoundNodesArray.concat($shadowRootSoundsNodeArray);
    }  else {
      $sounds = $documentSoundNodesArray
    }
    

      for (let i = 0; i < $sounds.length; i++) {
    const $sound = $sounds[i];
    
    $sound.addEventListener('click', ()=>{
      const englishText = $sound.querySelector('.english-text').textContent;
      const $englishAudio = $sound.querySelector('.english-audio');
      $englishAudio.setAttribute('src', `${audioDir}${englishText}.mp3`);
  
      $englishAudio.play().then(()=>{
        $sound.style.setProperty('box-shadow', 'none');
        $sound.style.setProperty('pointer-events', 'none');
      });
      
      $englishAudio.addEventListener('ended', ()=>{
        $sound.style.setProperty('box-shadow', '0.25rem 0.25rem 0.25rem #00000075');
        $sound.style.setProperty('pointer-events', 'auto');
      });
    });
  }
  });

}

/* Button menu hamburgue */
(function clickHamburgueBtn() {
  const $dialoguesMenuBtn = document.querySelector('.menu-btn');
  const $dialoguesSvgOpen = document.querySelector('.svg-open');
  const $dialoguesSvgClose = document.querySelector('.svg-close');
  const $dialoguesHomeBtn = document.querySelector('.home-btn');
  const $dialoguesHomeLessonBtn = document.querySelector('.home-lesson-btn');

  $dialoguesMenuBtn.addEventListener('click', ()=>{
    $dialoguesMenuBtn.style.setProperty('box-shadow', 'none')

    if(!$dialoguesSvgOpen.classList.contains('d-none')){
      $dialoguesHomeBtn.style.setProperty('transform', 'translateX(0)')
      setTimeout(() => {
        $dialoguesHomeLessonBtn.style.setProperty('transform', 'translateX(0)')        
      }, 100);
    } else {
      setTimeout(() => {
        $dialoguesHomeLessonBtn.style.setProperty('transform', 'translateX(-100vw)')        
      }, 100);
      $dialoguesHomeBtn.style.setProperty('transform', 'translateX(-100vw)')
    }
    setTimeout(() => {
      $dialoguesMenuBtn.style.setProperty('box-shadow', '0.25rem 0.25rem 0.25rem #00000075')
      $dialoguesSvgOpen.classList.toggle('d-none');
      $dialoguesSvgClose.classList.toggle('d-none');      
    }, 500);
  });

})();

/***************** Initialization *****************/
play(dataLesson.audioDir)

}