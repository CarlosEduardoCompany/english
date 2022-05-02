/***************************************** Component *****************************************/
export class DialogueConversation extends HTMLElement {
  constructor(options) {
    super()
    this.attachShadow({ mode: 'open' })

    const {
      data,
      audioDir,
      characterDir,
      animationFrom,
      animationTo,
      animationDuration,
      visibility,
    } = options
    this.data = this.transformData(data, audioDir, characterDir)
    this.animationFrom = animationFrom || ''
    this.animationTo = animationTo || ''
    this.animationDuration = animationDuration || ''
    this.visibility = visibility
    this.play = false
  }

  /********************* Functions *********************/
  // Connected Callback
  connectedCallback() {
    let cssTemplate = `

     /***** Animation *****/
    @keyframes animation {
        from {
              transform: ${this.animationFrom}
            }
            to {            
              transform: ${this.animationTo}
          }
      }
      .animation {                    
          animation-name: animation;
          animation-duration: ${this.animationDuration};
          animation-timing-function: ease;
          animation-fill-mode: both;
      }

       /***** Dialogue *****/
      .dialogue-container {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          max-width: 300px;
          margin: 1rem auto auto 1rem;
      }

      .dialogue-avatar {
        position: relative;
      }

      .dialogue-avatar img {
          display: flex;
          width: 50px;
          height: 50px;
          margin-right: 15px;
          padding: 2px;
          border: thin solid #fd6107;
          border-radius: 50%;
          box-shadow: 0.25rem 0.25rem 0.25rem #00000075;
          cursor: pointer;
          transition: box-shadow 0.5s linear;
      }

      .dialogue-cover {
        position: absolute;
        top: 0;
        left: 0;
        rigth: 0;
        bottom: 0;        
        width: 100%;
        height: 100%;
      }

      .dialogue-text {	
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-top: 1rem;
          padding: 0 10px;
          background-color: #ffffff;
          border: thin solid #fd6107;
          border-left: 2px solid #fd6107;
          border-radius: 14px;
          border-top-left-radius: 0;                    
          cursor: pointer;
      }

      .dialogue-text::after {
          content: "";
          position: absolute;
          left: -8px;
          top: 0px;
          border-bottom: 12px solid transparent;
          border-right: 12px solid #ffffff;
      }

      .dialogue-text::before {	
          content: "";
          position: absolute;
          left: -12px;
          top: -1px;
          border-bottom: 12px solid transparent;
          border-right: 12px solid #fd6107;
          border-top-left-radius: 50%;
      }

      .dialogue-spanish-word-container hr {
          width: 75%;
          border-color: #fd6107;
      }

      /***** Middle-text *****/
      .middle-text-container {
        display: flex;
        align-items: center;
        max-width: 280px;
        margin: 1rem auto auto 1rem; 
        transition: box-shadow 1s linear;
		}

    .middle-text-container-svg-cover {
      position: relative;      
      align-self: flex-start;   
    }

    .middle-text-svg-container {   
      margin-right: 15px;
      padding: 0;
      border-radius: 50%;
      cursor: pointer;
    }

    .middle-text-cover {
      position: absolute;
      top: 0;
      left: 0;
      rigth: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }

		.middle-text-svg {
      width: 30px;
      height: 30px;
      padding: 0.3rem;
			fill: var(--first-color);
			border: thin solid var(--first-color);
			border-radius: 50%;	
			box-shadow: 0.25rem 0.25rem 0.25rem #00000075;
			transition: box-shadow 0.5s linear;
      
		}

    .middle-text-word-container {
     padding: 0.5rem;   
      border-radius: 14px; 
      border: thin solid var(--first-color);
      cursor: pointer;
    }
				
		.middle-text-container .middle-text-spanish-word-container hr {
			width: 75%;
			margin: 1rem auto;
			border-color: #fd6107;
		}
		
		.middle-text-container .english-word-container {
			width: 100%;
		}

		.middle-text-container svg {
			align-self: flex-start;
		}

		.middle-text-container p {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 0;
			margin-left: 1rem;
		}

    .d-none {
        display: none;
    }
    `

    let style = document.createElement('style')
    style.innerHTML = cssTemplate

    const conversations = this.createDialogueConversation(
      this.data,
      this.visibility,
    )

    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(conversations)

    // Set AddEventListener
    const dialogueAvatars = this.shadowRoot.querySelectorAll('.avatar-img')
    const dialogueText = this.shadowRoot.querySelectorAll('.dialogue-text')
    const dialogueSpanishWordContainers = this.shadowRoot.querySelectorAll(
      '.dialogue-spanish-word-container',
    )
    const dialogueAudios = this.shadowRoot.querySelectorAll(
      '.audio-dialogue-conversation',
    )

    const middleTextSvgs = this.shadowRoot.querySelectorAll('.middle-text-svg')
    const middleTextSvgContainer = this.shadowRoot.querySelectorAll(
      '.middle-text-svg-container',
    )
    const middleTextSvgAudios = this.shadowRoot.querySelectorAll(
      '.audio-middle-text',
    )
    const middleTextWordContainer = this.shadowRoot.querySelectorAll(
      '.middle-text-word-container',
    )
    const middleTextSpanishWordContainer = this.shadowRoot.querySelectorAll(
      '.middle-text-spanish-word-container',
    )

    // For dialogues
    for (let i = 0; i < dialogueAvatars.length; i++) {
      dialogueAvatars[i].addEventListener('click', () => {
        this.playAudio(dialogueAudios[i], dialogueAvatars[i])
      })

      dialogueText[i].addEventListener('click', () => {
        dialogueSpanishWordContainers[i].classList.toggle('d-none')
      })
    }

    // For middle text
    for (let i = 0; i < middleTextSvgs.length; i++) {
      middleTextSvgContainer[i].addEventListener('click', () => {
        this.playAudio(middleTextSvgAudios[i], middleTextSvgs[i])
      })

      middleTextWordContainer[i].addEventListener('click', () => {
        middleTextSpanishWordContainer[i].classList.toggle('d-none')
      })
    }
  }

  // Transform data
  transformData(data, audioDir, characterDir) {
    let transformedData = JSON.parse(JSON.stringify(data))
    let oldValueAudio
    let oldValueCharacter

    for (let i = 0; i < Object.keys(data).length; i++) {
      oldValueAudio = data[`register${i}`].audio
      oldValueCharacter = data[`register${i}`].character

      transformedData[`register${i}`].audio = `${audioDir}${oldValueAudio}`
      if (oldValueCharacter !== '') {
        transformedData[
          `register${i}`
        ].character = `${characterDir}${oldValueCharacter}`
      }
    }

    return transformedData
  }

  // Create Dialogues Conversation
  createDialogueConversation(data, visibility) {
    let conversations = document.createElement('div')
    let display
    if (visibility) {
      display = ''
    } else {
      display = 'd-none'
    }

    for (let i = 0; i < Object.keys(data).length; i++) {
      let character = data[`register${i}`].character
      let audio = data[`register${i}`].audio
      let englishText = data[`register${i}`].englishText
      let spanishText = data[`register${i}`].spanishText

      if (character !== '') {
        let htmlTemplateConversation = `    
          <div class="dialogue-container animation ${display}">
              <div class="dialogue-avatar">
                  <img class="avatar-img" src="${character}" alt="character">
                  <audio class='audio-dialogue-conversation' src="${audio}"></audio>
                  <div class='dialogue-cover d-none'></div>
              </div>
              <div class="dialogue-text">
                  <p class="english-word">${englishText}</p>
                  <div class="dialogue-spanish-word-container d-none">
                      <hr/>
                      <p class="spanish-word">${spanishText}</p>
                  </div>
              </div>
          </div>`

        conversations.innerHTML += htmlTemplateConversation
      } else {
        let htmlTemplateMiddleText = `
          <div class="middle-text-container animation ${display}">
            <div class='middle-text-container-svg-cover'>
              <div class='middle-text-svg-container'>
                <svg id="middle-text-svg" class="middle-text-svg" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27l-1.68 1.69zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"/></svg>
              </div>
              <div class='middle-text-cover d-none'></div>
            </div>
              <div class='middle-text-word-container'>
                <div class="english-word-container">
                  <p class="p">${englishText}</p>                
                </div>
                <div class="middle-text-spanish-word-container d-none">
                  <hr/>
                  <p class="spanish-word">${spanishText}</p>
                </div>
              </div>
              <audio class="audio-middle-text" src="${audio}"></audio>
          </div>`

        conversations.innerHTML += htmlTemplateMiddleText
      }
    }

    return conversations
  }

  // Play audio
  playAudio(audio, audioBox) {
    audio.play().then(() => {
      audioBox.style.setProperty('box-shadow', 'none')
      audioBox.style.setProperty('pointer-events', 'none')
    })

    audio.addEventListener('ended', () => {
      audioBox.style.setProperty(
        'box-shadow',
        '0.25rem 0.25rem 0.25rem #00000075',
      )
      audioBox.style.setProperty('pointer-events', 'auto')
    })
  }
}
window.customElements.define('dialogue-conversation', DialogueConversation)

/***************************************** Component Tools *****************************************/

export function dialogueConversationPlay(parentNode = false) {
  return new Promise((resolve, reject) => {
    customElements.whenDefined('dialogue-conversation').then(() => {
      const $tagDialogueConversation = document.getElementsByTagName(
        'dialogue-conversation',
      )
      const $conversations =
        $tagDialogueConversation[0].shadowRoot.children[1].children
      const $firstConversation =
        $tagDialogueConversation[0].shadowRoot.children[1].children[0]
      const $firstDialoguePlay = $firstConversation.querySelector('.avatar-img')
      const $firstMiddlePlay = $firstConversation.querySelector(
        '.middle-text-svg-container',
      )

      // Set initial position
      for (let i = 0; i < $conversations.length; i++) {
        const thisConversation = $conversations[i]
        thisConversation.classList.add('d-none')
      }

      // Set the addEventListeners
      for (let i = 0; i < $conversations.length - 1; i++) {
        const thisConversation = $conversations[i]
        const nextConversation = $conversations[i + 1]

        // Remove class "stop"
        thisConversation.classList.remove('stop')

        // Get this items
        const thisDialoguePlay = thisConversation.querySelector('.avatar-img')
        const thisDialogueAudio = thisConversation.querySelector(
          '.audio-dialogue-conversation',
        )
        const thisDialogueCover = thisConversation.querySelector(
          '.dialogue-cover',
        )
        const thisMiddleTextCover = thisConversation.querySelector(
          '.middle-text-cover',
        )
        const thisMiddleTextPlay = thisConversation.querySelector(
          '.middle-text-svg-container',
        )
        const thisMiddleTextAudio = thisConversation.querySelector(
          '.audio-middle-text',
        )

        // Get next items
        const nextDialoguePlay = nextConversation.querySelector('.avatar-img')
        const nextMiddleTextPlay = nextConversation.querySelector(
          '.middle-text-svg-container',
        )
        const nextDialogueAudio = nextConversation.querySelector(
          '.audio-dialogue-conversation',
        )
        const nextDialogueCover = nextConversation.querySelector(
          '.dialogue-cover',
        )
        const nextMiddleTextCover = nextConversation.querySelector(
          '.middle-text-cover',
        )

        // Disable itemPlay
        if (thisDialoguePlay !== null) {
          thisDialogueCover.classList.remove('d-none')
          // Is the end itemPlay
          if (i === $conversations.length - 2) {
            if (nextDialoguePlay !== null) {
              nextDialogueCover.classList.remove('d-none')
            } else if (nextMiddleTextPlay !== null) {
              nextMiddleTextCover.classList.remove('d-none')
            }
          }
        } else if (thisMiddleTextPlay !== null) {
          thisMiddleTextCover.classList.remove('d-none')
          // Is the end itemPlay
          if (i === $conversations.length - 2) {
            if (nextDialoguePlay !== null) {
              nextDialogueCover.classList.remove('d-none')
            } else if (nextMiddleTextPlay !== null) {
              nextMiddleTextCover.classList.remove('d-none')
            }
          }
        }

        if (thisDialoguePlay !== null && nextDialoguePlay !== null) {
          // Handles Functions
          function eventClickHandle() {
            thisDialogueAudio.addEventListener('ended', eventEndedAudioHandle)

            this.removeEventListener('click', eventClickHandle)
          }

          function eventEndedAudioHandle() {
            if (!nextConversation.classList.contains('stop')) {
              nextDialoguePlay.click()
              nextConversation.classList.remove('d-none')
            }
            if (parentNode) {
              parentNode.scrollTop = parentNode.scrollHeight
            }

            // Is the end audio
            if (i === $conversations.length - 2) {
              nextDialogueAudio.addEventListener('ended', () => {
                for (let z = 0; z < $conversations.length; z++) {
                  const newThisConversation = $conversations[z]

                  // Get this items
                  const newThisDialogueAudio = newThisConversation.querySelector(
                    '.audio-dialogue-conversation',
                  )
                  const newThisMiddleTextAudio = newThisConversation.querySelector(
                    '.audio-middle-text',
                  )
                  const newThisDialogueCover = newThisConversation.querySelector(
                    '.dialogue-cover',
                  )
                  const newNextMiddleTextCover = newThisConversation.querySelector(
                    '.middle-text-cover',
                  )

                  // Remove the addEventListeners
                  if (newThisDialogueAudio !== null) {
                    newThisDialogueCover.classList.add('d-none')
                  } else if (newThisMiddleTextAudio !== null) {
                    newNextMiddleTextCover.classList.add('d-none')
                  }
                }
                resolve()
              })
            }

            this.removeEventListener('ended', eventEndedAudioHandle)
          }

          // Add event
          thisDialoguePlay.addEventListener('click', eventClickHandle)
        } else if (thisDialoguePlay !== null && nextMiddleTextPlay !== null) {
          // thisDialogue and nextMiddleText
          // Handles Funcitons
          function eventClickHandle() {
            thisDialogueAudio.addEventListener('ended', eventEndedAudioHandle)

            this.removeEventListener('click', eventClickHandle)
          }

          function eventEndedAudioHandle() {
            if (!nextConversation.classList.contains('stop')) {
              nextMiddleTextPlay.click()
              nextConversation.classList.remove('d-none')
            }
            if (parentNode) {
              parentNode.scrollTop = parentNode.scrollHeight
            }

            // Is the end audio
            if (i === $conversations.length - 2) {
              nextDialogueAudio.addEventListener('ended', () => {
                for (let z = 0; z < $conversations.length; z++) {
                  const newThisConversation = $conversations[z]

                  // Get this items
                  const newThisDialogueAudio = newThisConversation.querySelector(
                    '.audio-dialogue-conversation',
                  )
                  const newThisMiddleTextAudio = newThisConversation.querySelector(
                    '.audio-middle-text',
                  )
                  const newThisDialogueCover = newThisConversation.querySelector(
                    '.dialogue-cover',
                  )
                  const newNextMiddleTextCover = newThisConversation.querySelector(
                    '.middle-text-cover',
                  )

                  // Remove the addEventListeners
                  if (newThisDialogueAudio !== null) {
                    newThisDialogueAudio.removeEventListener('ended', () => {})
                    newThisDialogueCover.classList.add('d-none')
                  } else if (newThisMiddleTextAudio !== null) {
                    newThisMiddleTextAudio.removeEventListener(
                      'ended',
                      () => {},
                    )
                    newNextMiddleTextCover.classList.add('d-none')
                  }
                }
                resolve()
              })
            }

            this.removeEventListener('ended', eventEndedAudioHandle)
          }

          // Add event
          thisDialoguePlay.addEventListener('click', eventClickHandle)
        } else if (thisMiddleTextPlay !== null && nextDialoguePlay !== null) {
          // nextMiddleText and thisDialogue
          // Handle Functions
          function eventClickHandle() {
            thisMiddleTextAudio.addEventListener('ended', eventEndedAudioHandle)

            this.removeEventListener('click', eventClickHandle)
          }

          function eventEndedAudioHandle() {
            if (!nextConversation.classList.contains('stop')) {
              nextDialoguePlay.click()
              nextConversation.classList.remove('d-none')
            }
            if (parentNode) {
              parentNode.scrollTop = parentNode.scrollHeight
            }

            // Is the end audio
            if (i === $conversations.length - 2) {
              nextDialogueAudio.addEventListener('ended', () => {
                for (let z = 0; z < $conversations.length; z++) {
                  const newThisConversation = $conversations[z]

                  // Get this items
                  const newThisDialogueAudio = newThisConversation.querySelector(
                    '.audio-dialogue-conversation',
                  )
                  const newThisMiddleTextAudio = newThisConversation.querySelector(
                    '.audio-middle-text',
                  )
                  const newThisDialogueCover = newThisConversation.querySelector(
                    '.dialogue-cover',
                  )
                  const newNextMiddleTextCover = newThisConversation.querySelector(
                    '.middle-text-cover',
                  )

                  // Remove the addEventListeners
                  if (newThisDialogueAudio !== null) {
                    newThisDialogueAudio.removeEventListener('ended', () => {})
                    newThisDialogueCover.classList.add('d-none')
                  } else if (newThisMiddleTextAudio !== null) {
                    newThisMiddleTextAudio.removeEventListener(
                      'ended',
                      () => {},
                    )
                    newNextMiddleTextCover.classList.add('d-none')
                  }
                }
                resolve()
              })
            }

            this.removeEventListener('ended', eventEndedAudioHandle)
          }

          // Add event
          thisMiddleTextPlay.addEventListener('click', eventClickHandle)
        } else if (thisMiddleTextPlay !== null && nextMiddleTextPlay !== null) {
          // nextMiddleText and thisMiddleText
          // Handle Functions
          function eventClickHandle() {
            thisMiddleTextAudio.addEventListener('ended', eventEndedAudioHandle)
          }

          function eventEndedAudioHandle() {
            if (!nextConversation.classList.contains('stop')) {
              nextMiddleTextPlay.click()
              nextConversation.classList.remove('d-none')
            }
            if (parentNode) {
              parentNode.scrollTop = parentNode.scrollHeight
            }

            // Is the end audio
            if (i === $conversations.length - 2) {
              nextDialogueAudio.addEventListener('ended', () => {
                for (let z = 0; z < $conversations.length; z++) {
                  const newThisConversation = $conversations[z]

                  // Get this items
                  const newThisDialogueAudio = newThisConversation.querySelector(
                    '.audio-dialogue-conversation',
                  )
                  const newThisMiddleTextAudio = newThisConversation.querySelector(
                    '.audio-middle-text',
                  )
                  const newThisDialogueCover = newThisConversation.querySelector(
                    '.dialogue-cover',
                  )
                  const newNextMiddleTextCover = newThisConversation.querySelector(
                    '.middle-text-cover',
                  )

                  // Remove the addEventListeners
                  if (newThisDialogueAudio !== null) {
                    newThisDialogueAudio.removeEventListener('ended', () => {})
                    newThisDialogueCover.classList.add('d-none')
                  } else if (newThisMiddleTextAudio !== null) {
                    newThisMiddleTextAudio.removeEventListener(
                      'ended',
                      () => {},
                    )
                    newNextMiddleTextCover.classList.add('d-none')
                  }
                }
                resolve()
              })
            }

            this.removeEventListener('ended', eventEndedAudioHandle)
          }

          // Add event
          thisMiddleTextPlay.addEventListener('click', eventClickHandle)
        }
      }

      // Start the conversation
      setTimeout(() => {
        if ($firstDialoguePlay !== null) {
          $firstDialoguePlay.click()
          $firstConversation.classList.remove('d-none')
        } else if ($firstMiddlePlay !== null) {
          $firstMiddlePlay.click()
          $firstConversation.classList.remove('d-none')
        }
      }, 500)
    })
  })
}

export function dialogueConversationStop() {
  const $tagDialogueConversation = document.getElementsByTagName(
    'dialogue-conversation',
  )
  const $conversations =
    $tagDialogueConversation[0].shadowRoot.children[1].children

  for (let i = 0; i < $conversations.length; i++) {
    const thisConversation = $conversations[i]

    const $thisDialogueCover = thisConversation.querySelector('.dialogue-cover')
    const $thisMiddleTextCover = thisConversation.querySelector(
      '.middle-text-cover',
    )

    if ($thisDialogueCover !== null) {
      $thisDialogueCover.classList.add('d-none')
    } else if ($thisMiddleTextCover !== null) {
      $thisMiddleTextCover.classList.add('d-none')
    }

    thisConversation.classList.add('stop')
  }
}

/***************************************** Documentation *****************************************/
/* NOTE: Only one component for document  */

/* dialogueConversationPlay() --- recibe un parentNode para que las conversaciones vayan subiendo, en caso que no solo llena el contenedor padre  */
