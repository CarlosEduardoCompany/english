import { CardTest } from '../components/CardTest.js'
import {
DialogueConversation,
dialogueConversationPlay,
dialogueConversationStop,
} from '../components/DialogueConversation.js'

export function startDialogue(dataDialogue) { 

// ----------------------------------- Components -----------------------------------
//------------ Card Test ------------
const optionsCardTest = {
  data: dataDialogue.conversation,
  audioDir: dataDialogue.audioDir,
  typeCardTest: 'dialogue'
}
const $cardTestContainer = document.querySelector('.card-test-container')
const cardTest = new CardTest(optionsCardTest)
$cardTestContainer.appendChild(cardTest)

//------------ Dialogue Conversation ------------
const optionsDialogueConversation = {
  data: dataDialogue.conversation,
  audioDir: dataDialogue.audioDir,
  characterDir: dataDialogue.characterDir,
  visibility: false,
  animationFrom: 'translateX(-110vw);',
  animationTo: 'translateX(0);',
  animationDuration: '1s',
}

const $dialogueCoversationContainer = document.querySelector(
  '.dialogue-conversation-container',
)
const dialogueConversation = new DialogueConversation(
  optionsDialogueConversation,
)
$dialogueCoversationContainer.appendChild(dialogueConversation)

// ----------------------------------- functions -----------------------------------
// Style for the buttoms
function styleBtn(btn) {
  btn.style.setProperty('box-shadow', 'none')
  setTimeout(() => {
    btn.style.setProperty('box-shadow', '0.25rem 0.25rem 0.25rem #00000075')
  }, 500)
}

(function setHeader() {
  const dialogueHeaderText = document.querySelector('.dialogue-header-text');
  const dialogueHeaderImg = document.querySelector('.dialogue-header-img');
  dialogueHeaderImg.innerHTML = `
    <img src="${dataDialogue.banner}" alt="${dataDialogue.title}">
  `;
  dialogueHeaderText.innerHTML = `    
      <h1>${dataDialogue.title}</h1>
      <audio id="audio-title" src='${dataDialogue.audioTitle}'></audio>  `;
})();

// Button back
(function btnBack() {
  const cardTestSvgContainer = document.querySelector(
    '.card-test-svg-container',
  )
  const cardTestContainer = document.querySelector('.card-test-container')
  const $dialogueSection = document.querySelector('.dialogue-section')

  cardTestSvgContainer.addEventListener('click', () => {
    cardTestSvgContainer.style.setProperty('box-shadow', 'none')
    cardTestSvgContainer.style.setProperty('pointer-events', 'none')

    setTimeout(() => {
      cardTestSvgContainer.style.setProperty(
        'box-shadow',
        '0.25rem 0.25rem 0.25rem #00000075',
      )
      cardTestSvgContainer.style.setProperty('pointer-events', 'auto')
    }, 500)

    setTimeout(() => {
      cardTestContainer.style.setProperty('transform', 'translateY(-110vh)')

      setTimeout(() => {
        $dialogueSection.style.setProperty('transform', 'translateX(0)')
      }, 500)
    }, 1200)
  })
})()

// Button practice
function btnPractice() {
    const cardTestContainer = document.querySelector('.card-test-container')
    const $dialogueSection = document.querySelector('.dialogue-section')
    const practiceBtn = document.querySelector('.practice-btn')

    practiceBtn.addEventListener('click', () => {
      practiceBtn.style.setProperty('box-shadow', 'none')
      practiceBtn.style.setProperty('pointer-events', 'none')

      setTimeout(() => {
        practiceBtn.style.setProperty(
          'box-shadow',
          '0.25rem 0.25rem 0.25rem #00000075',
        )
        practiceBtn.style.setProperty('pointer-events', 'auto')
      }, 500)

      setTimeout(() => {
        $dialogueSection.style.setProperty('transform', 'translateX(-110vw)')
      }, 1200)

      cardTestContainer.style.setProperty('transform', 'translateY(0)')
    })
}

// Button play
(function btnPlay() {
    const $playBtn = document.querySelector('.play-btn')

    $playBtn.addEventListener('click', () => {
      const $dialogueConversationContainer = document.querySelector(
        '.dialogue-conversation-container',
      )
      const $stopBtn = document.querySelector('.stop-btn')
      const $practiceBtn = document.querySelector('.practice-btn')
      const $audioTitle = document.querySelector('#audio-title')

      
      $audioTitle.play().then(()=>{
        styleBtn($playBtn)
        $playBtn.classList.add('disable')
        $stopBtn.classList.remove('disable')
        $practiceBtn.classList.add('disable')
      });

      $audioTitle.addEventListener('ended', ()=>{
        // Start dialogue
        dialogueConversationPlay($dialogueConversationContainer).then(() => {
          $playBtn.classList.remove('disable')
          $stopBtn.classList.add('disable')
          $practiceBtn.classList.remove('disable')
        })
      });

    })
})()

// Button stop
function btnStop() {


    const $stopBtn = document.querySelector('.stop-btn')

    $stopBtn.addEventListener('click', () => {
      const $playBtn = document.querySelector('.play-btn')
      const $practiceBtn = document.querySelector('.practice-btn')

      // Stop dialogue
      dialogueConversationStop()

      styleBtn($stopBtn)
      $stopBtn.classList.add('disable')
      $playBtn.classList.remove('disable')
      $practiceBtn.classList.remove('disable')
    })
}

/* Button menu hamburgue */
(function clickHamburgueBtn() {
  const $menuBtn = document.querySelector('.menu-btn');
  const $svgOpen = document.querySelector('.svg-open');
  const $svgClose = document.querySelector('.svg-close');
  const $homeDialogueBtn = document.querySelector('.home-dialogue-btn');
  const $homeBtn = document.querySelector('.home-btn');

  $menuBtn.addEventListener('click', ()=>{
    $menuBtn.style.setProperty('box-shadow', 'none')

    if(!$svgOpen.classList.contains('d-none')){
      setTimeout(() => {
        $homeDialogueBtn.style.setProperty('transform', 'translateX(0)')        
      }, 100);
      $homeBtn.style.setProperty('transform', 'translateX(0)')

    } else {
      setTimeout(() => {
        $homeDialogueBtn.style.setProperty('transform', 'translateX(-100vw)')        
      }, 100);
      $homeBtn.style.setProperty('transform', 'translateX(-100vw)')
    }
    setTimeout(() => {
      $menuBtn.style.setProperty('box-shadow', '0.25rem 0.25rem 0.25rem #00000075')
      $svgOpen.classList.toggle('d-none');
      $svgClose.classList.toggle('d-none');      
    }, 500);
  });

})();

 btnPractice()
 btnStop()
}