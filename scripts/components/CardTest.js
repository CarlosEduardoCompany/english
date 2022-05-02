/***************************************** Component *****************************************/
export class CardTest extends HTMLElement {
  constructor(options) {
    super();
    const { data, audioDir, typeCardTest } = options;
    this.attachShadow({ mode: "open" });
    this.data = this.transformData(data, audioDir, typeCardTest);
    this.typeCardTest = typeCardTest;

    // Position of questionAndResponses
    this.position = 0;

    // Accountant
    this.corrects = 0;
    this.incorrects = 0;
    this.percent = 0;
    this.percentAudioText = 0;
    this.percentText = 0;
    this.percentAudio = 0;
    this.isFirstTime = true;
    this.isAudioText = false;
    this.isText = false;
    this.isAudio = false;

    // Response
    this.globalResponse;

    // Others
    this.isClickItem = false;
    this.clickClose = false;
  }

  /********************* Functions *********************/
  // Connected Callback 
  connectedCallback() {
    let cssTemplate = `
    <style>
          /*************************************** Select type test ***************************************/
      :host {
        --first-color: #fd6107;
        --first-alpha-color: #fd610750;
        --box-shadow: 0.25rem 0.25rem 0.25rem #00000075;
        --text-shadow: 0.25rem 0.25rem 0.25rem #00000075;
        --black-color: #000000;
        --green-color: #2ae409ca;
        --red-color: #be0c0c;
        font-family: sans-serif;
        font-weight: 400;
      }
    
      .test-type-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem;
        box-shadow: var(--box-shadow);
        border: thin solid var(--black-color);
        border-radius: 0.5rem;
      }

      .test-type-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0;
      }

      .test-type-header h3 {
        margin: 0;
        font-family: sans-serif;
        font-weight: 700;
      }

      .test-type-btn {
        padding: 0.3rem;
        color: var(--first-color);
        background-color: transparent;
        border-radius: 50%;
        border: thin solid var(--first-color);
        cursor: pointer;
        transition: box-shadow 0.5s linear;
      }

      .test-type-select-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding-bottom: 0.5rem;
      }

      .test-type-select-item {
        width: 70%;
        margin-bottom: 0.5rem;
        padding: 0.2rem;
        text-align: center;
        box-shadow: var(--box-shadow);
        border: thin solid var(--first-color);
        border-radius: 0.5rem;
        transform: translateX(-110vw);
        transition: transform 0.5s linear, box-shadow 0.5s linear;
      }

      .test-type-select-container div:first-child {
        margin-top: 0.75rem;
      }

      .test-type-select-container div:last-child {
        margin-bottom: 0;
      }

      .test-type-label {
        display: block;
        margin: 0;
        padding: 0.2rem;
        cursor: pointer;
        transition: box-shadow 0.5s linear;
      }

      .test-type-label span {
        display: block;
        color: var(--first-color);
        font-family: sans-serif;
        font-weight: 600;
      }

      .test-type-radio {
        display: none;
        pointer-events: none;
      }

      /*************************************** Select The Response ***************************************/
      .card-response {
        position: relative;
        width: 90%;
        margin: 1rem auto;
        padding: 0.5rem;
        border: thin solid var(--first-color);
        border-radius: 0.5rem;
        transform: translateX(-110vw);
        transition: transform 0.5s linear, box-shadow 0.5s linear;
      }

      #card-response-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 1.5rem;
        margin: 0.2rem 0.2rem 0 0;
        align-self: flex-end;
        font-size: 1.5rem;
        color: var(--first-color);
        font-family: sans-serif;
        font-weight: 800;
        text-align: center;
        text-shadow: var(--text-shadow);
        border-radius: 0 0.5rem 0 0;
        cursor: pointer;
        transition: text-shadow 0.5s linear;
      }

      .card-response-title {
        width: 90%;
        margin: 0 auto 0.5rem auto;
        padding-bottom: 0.5rem;
        text-align: center;
        font-family: sans-serif;
        font-weight: 600;
        border-bottom: thin solid var(--first-color);
      }

      .card-response-accountant-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .card-response-question-word-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem auto 2rem auto;
        padding: 0;
        border: thin solid var(--black-color);
        transition: box-shadow 0.5s linear;
      }

      .card-response-question-word {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        text-align: center;
        cursor: pointer;
        padding: 0.5rem;
      }

      .card-response-question-word span {
        font-family: sans-serif;
        font-weight: 800;
        color: var(--first-color);
      }

      .card-response-question-word svg {
        fill: var(--first-color);
        width: 24px;
        height: 24px;
      }

      .card-response-select-content {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 2rem;
      }

      .card-response-select-content div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-radius: 0.5rem;
        transition: box-shadow 0.5s linear;
      }

      .card-response-select-content label,
      .card-response-select-content input {
        cursor: pointer;
        padding: 0.2rem;
      }

      .card-response-select-content label {
        width: 100%;
        border-radius: 0.5rem;
      }

      .card-response-select-content input {
        display: none;
      }

      .response-word-place {
        margin: 0;
      }

      .messages {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        border-radius: 0.5rem;
        backdrop-filter: blur(5px);
        transition: backdrop-filter 0.5s linear;
      }

      .messages-correct {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .correct {
        margin: 0 auto;
        font-size: 3rem;
        font-family: sans-serif;
        font-weight: 800;
        text-align: center;
        color: var(--green-color);
      }

      .messages-incorrect {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .incorrect {
        margin: 0 auto;
        font-size: 3rem;
        font-family: sans-serif;
        font-weight: 800;
        text-align: center;
        color: var(--red-color);
      }

      .messages-finished {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .finished {
        margin: 0 auto;
        font-size: 3rem;
        font-family: sans-serif;
        font-weight: 800;
        text-align: center;
        color: var(--first-color);
        letter-spacing: 5px;
      }

      .finished-correct-container,
      .finished-incorrect-container {
        display: flex;
        justify-content: space-between;
        width: 75%;
        font-size: 1.5rem;
      }

      .finished-percent {
        font-size: 3rem;
      }

      /*************************** Card Test Utilities ***************************/
      .border-none {
        border: none;
      }

      .card-btn {
        display: block;
        width: 50%;
        margin: 1rem auto;
        padding: 0.5rem;
        cursor: pointer;
        border-radius: 0.5rem;
        border: thin solid var(--black-color);
        box-shadow: var(--box-shadow);
        transition: box-shadow 0.5s ease;
      }

      .shadow {
        box-shadow: var(--box-shadow);
      }

      .itemSelected {
        box-shadow: none;
        pointer-events: none;
        border: thin solid var(--first-color);
      }

      .labelSelected {
        background-color: var(--first-alpha-color);
      }

      .notItemSelected {
        box-shadow: var(--box-shadow);
        pointer-events: auto;
        border: thin solid;
      }

      .pointer-events-none {
        pointer-events: none;
      }

      .d-none {
        display: none;
      }

</style>
    `;

    let htmlTemplate = `
    <!--------------- Select the type test ------------------->
    <section class="test-type-container">
      <div class="test-type-header">
        <h3>Select the type test</h3>
        <button class="test-type-btn shadow">Open</button>
      </div>
      <div class="test-type-select-container d-none">
        <div class="test-type-select-item">
          <input type="radio" name="radioTypeTest" id="type-select1" value="audioText" class="test-type-radio">
          <label for="type-select1" class="test-type-label">Audio y Texto<span class="percent-audio-text">${this.percentAudioText}%</span></label>
        </div>
        <div class="test-type-select-item">
          <input type="radio" name="radioTypeTest" id="type-select2" value="text" class="test-type-radio">
          <label for="type-select2" class="test-type-label">Texto<span class="percent-text">${this.percentText}%</span></label>
        </div>
        <div class="test-type-select-item">
          <input type="radio" name="radioTypeTest" id="type-select3" value="audio" class="test-type-radio">
          <label for="type-select3" class="test-type-label">Audio<span class="percent-audio">${this.percentAudio}%</span></label>
        </div>
      </div>
    </section>

    <!--------------- Select the Response ------------------->
    <section class="card-response">
      <!--------- Title ---------->
      <div class="card-response-title-container">
        <i id="card-response-close">X</i>
        <h3 class="card-response-title">Select the correct traduction</h3>
      </div>
      <!--------- Accountant ---------->
      <div class="card-response-accountant-container">
        <p><span id="part"></span> de <span id="total"></span></p>
      </div>
      <!--------- Question Word ---------->
      <div id="card-response-question-word-container" class="card-response-question-word-container shadow">
        <label id="card-response-question-word" class="card-response-question-word">
          <span id="question-word-place">Question Word</span>
          <svg id="question-svg-place" class="d-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M9 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H3zM15.08 7.05c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27l-1.68 1.69zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z" />
          </svg>
        </label>
        <audio id="question-word-audio"></audio>
      </div>
      <!--------- Select Response ---------->
      <div class="card-response-select-content">
        <div class="select-response-container notItemSelected">
          <label for="select-respose1" class="response-word-place">Word Response 1</label>
          <input type="radio" id="select-respose1" name="selectResponse" class="selectResponse">
        </div>
        <div class="select-response-container notItemSelected">
          <label for="select-respose2" class="response-word-place">Word Response 2</label>
          <input type="radio" id="select-respose2" name="selectResponse" class="selectResponse">
        </div>
        <div class="select-response-container notItemSelected">
          <label for="select-respose3" class="response-word-place">Word Response 3</label>
          <input type="radio" id="select-respose3" name="selectResponse" class="selectResponse">
        </div>
        <div class="select-response-container notItemSelected">
          <label for="select-respose4" class="response-word-place">Word Response 4</label>
          <input type="radio" id="select-respose4" name="selectResponse" class="selectResponse">
        </div>
      </div>
      <!--------- Select Buttons ---------->
      <div>
        <button id="btn-accept" class="card-btn">Aceptar</button>
      </div>
      <!--------- Select Messages ---------->
      <div id="messages" class="messages d-none">
        <div id="messages-correct" class="messages-correct d-none">
          <p class="correct">Correct</p>
          <button id="btn-next" class="card-btn">Siguiente</button>
        </div>
        <div id="messages-incorrect" class="messages-incorrect d-none">
          <p class="incorrect">Incorrect</p>
          <button id="btn-retry" class="card-btn">Reintentar</button>
        </div>
        <div id="messages-finished" class="messages-finished d-none">
          <p class="finished">Finished</p>
          <div class="finished-correct-container">
            <p class="finished-correct">Corrects:</p>
            <p id="finished-correct-data" class="finished-correct-data"></p>
          </div>
          <div class="finished-incorrect-container">
            <p class="finished-incorrect">Incorrects:</p>
            <p id="finished-incorrect-data" class="finished-incorrect-data"></p>
          </div>
          <p id="finished-percent" class="finished-percent"></p>
          <button class="card-btn">Comenzar</button>
        </div>
      </div>
    </section>
    `;

    let cardTest = `${cssTemplate} ${htmlTemplate}`;
    this.shadowRoot.innerHTML = cardTest;

    // Initial functions
    this.clickItems(this.data, this.typeCardTest);
    this.clickSelectItems();
    this.clickBtnClose();
    this.clickBtnMenu(this.data, this.typeCardTest);
    this.btnRetry();
  }

  // Transform data
  transformData(data, audioDir, typeCardTest) {
    let transformedData = JSON.parse(JSON.stringify(data));

    if(typeCardTest === 'dialogue'){
      let oldValueAudio;
  
      for (let i = 0; i < Object.keys(data).length; i++) {
        oldValueAudio = data[`register${i}`].audio;
        transformedData[`register${i}`].audio = `${audioDir}${oldValueAudio}`;
      }
  
      return transformedData;
    } else if(typeCardTest === 'lesson'){
        let oldValueAudio;
  
        for (let i = 0; i < Object.keys(data).length; i++) {
          oldValueAudio = data[`word${i}`].audio;
          transformedData[`word${i}`].audio = `${audioDir}${oldValueAudio}`;
        }

      return transformedData;
    }
  }

  // Generate random number
  randomNumber(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }

  // Generate question and responses
  generateQuestionAndResponses(data, typeTest, typeCardTest) {
    /******************** Variables ********************/
    let indexWords = generateRandomIndex(data);
    const questionAndResponses = new Array(indexWords.length);

    /******************** Functions ********************/
    // Create random index words
    function generateRandomIndex(data) {
      let indexWords = new Array(Object.keys(data).length);

      for (let i = 0; i < indexWords.length; i++) {
        indexWords[i] = i;
      }

      // Create random values
      return indexWords.sort(() => Math.random() - 0.5);
    }

    /******************** Logic ********************/    
    for (let i = 0; i < questionAndResponses.length; i++) {
      // Fill responses
      let responses = [null, null, null, null];
      let response;
       if(this.typeCardTest === 'dialogue') {
         response = data[`register${indexWords[i]}`].spanishText;
        } else if(this.typeCardTest === 'lesson'){
          response = data[`word${indexWords[i]}`].spanishText;
       }
      responses[this.randomNumber(0, 3)] = response;
      let indexResponsesFalse = generateRandomIndex(data);

      for (let z = 0; z < 4; z++) {
        if (responses[z] === null) {

        if(this.typeCardTest === 'dialogue') {
         responses[z] = data[`register${indexResponsesFalse[z]}`].spanishText;
        } else if(this.typeCardTest === 'lesson'){
         responses[z] = data[`word${indexResponsesFalse[z]}`].spanishText;
       }

          if (responses[z] === response) {
        if(this.typeCardTest === 'dialogue') {
          responses[z] = data[`register${indexResponsesFalse[indexResponsesFalse.length - 1 - z]}`].spanishText;
        } else if(this.typeCardTest === 'lesson'){
          responses[z] = data[`word${indexResponsesFalse[indexResponsesFalse.length - 1 - z]}`].spanishText;
       }
          }
        }
      }

      let questionWord;
      let audioQuestionWord;
      if(this.typeCardTest === 'dialogue') {
      questionWord = data[`register${indexWords[i]}`].englishText;
      audioQuestionWord = data[`register${indexWords[i]}`].audio;
      } else if(this.typeCardTest === 'lesson'){
      questionWord = data[`word${indexWords[i]}`].englishText;
      audioQuestionWord = data[`word${indexWords[i]}`].audio;
       }

      questionAndResponses[i] = {
        response,
        questionWord,
        audioQuestionWord,
        responses,
        typeTest,
      };
    }

    return questionAndResponses;
  }

  // Generate percent for accountant
  setPercent(total) {
    if (this.corrects < 0) {
      this.percent = 0;
    } else {
      this.percent = Math.round((this.corrects / total) * 100);
    }
  }

  // Set question and responses
  setQuestionAndResponses(questionAndResponses) {
    /******************** Variables ********************/
    const $questionWordPlace = this.shadowRoot.querySelector(
      "#question-word-place"
    );
    const $questionSvgPlace = this.shadowRoot.querySelector(
      "#question-svg-place"
    );
    const $questionWordAudio = this.shadowRoot.querySelector(
      "#question-word-audio"
    );
    const $cardResponseQuestionWord = this.shadowRoot.querySelector(
      "#card-response-question-word"
    );
    const $cardResponseQuestionWordContainer = this.shadowRoot.querySelector(
      "#card-response-question-word-container"
    );
    const $part = this.shadowRoot.querySelector("#part");
    const $total = this.shadowRoot.querySelector("#total");
    const $finishedCorrectData = this.shadowRoot.querySelector(
      "#finished-correct-data"
    );
    const $finishedIncorrectData = this.shadowRoot.querySelector(
      "#finished-incorrect-data"
    );
    const $finishedPercent = this.shadowRoot.querySelector("#finished-percent");
    const $responseWordPlaces = this.shadowRoot.querySelectorAll(
      ".response-word-place"
    );

    /******************** Logic ********************/
    if (questionAndResponses[this.position].typeTest === "audioText") {
      // Set data finished
      $finishedCorrectData.innerText = this.corrects;
      $finishedIncorrectData.innerText = this.incorrects;
      $finishedPercent.innerHTML = `${this.percent}<span>%</span>`;

      // Set count text
      $part.innerText = this.position + 1;
      $total.innerText = questionAndResponses.length;

      // Set question text
      $cardResponseQuestionWordContainer.classList.remove(
        "pointer-events-none"
      );
      $cardResponseQuestionWordContainer.classList.add("shadow");
      $cardResponseQuestionWordContainer.classList.remove("border-none");
      $questionSvgPlace.classList.add("d-none");
      $questionWordPlace.classList.remove("d-none");
      $questionWordPlace.innerText =
        questionAndResponses[this.position].questionWord;
      $cardResponseQuestionWord.addEventListener("click", () => {
        $questionWordAudio.play().then(() => {
          $cardResponseQuestionWordContainer.classList.remove("shadow");
          $questionWordAudio.addEventListener("ended", () => {
            $cardResponseQuestionWordContainer.classList.add("shadow");
          });
        });
      });

      // Set question audio
      $questionWordAudio.setAttribute(
        "src",
        `${questionAndResponses[this.position].audioQuestionWord}`
      );

      // Set Responses
      for (let i = 0; i < $responseWordPlaces.length; i++) {
        const responseWordPlace = $responseWordPlaces[i];

        responseWordPlace.innerText =
          questionAndResponses[this.position].responses[i];
      }
    } else if (questionAndResponses[this.position].typeTest === "text") {
      // Set data finished
      $finishedCorrectData.innerText = this.corrects;
      $finishedIncorrectData.innerText = this.incorrects;
      $finishedPercent.innerHTML = `${this.percent}<span>%</span>`;

      // Set count text
      $part.innerText = this.position + 1;
      $total.innerText = questionAndResponses.length;

      // Set question text
      $questionSvgPlace.classList.add("d-none");
      $cardResponseQuestionWordContainer.classList.remove("shadow");
      $cardResponseQuestionWordContainer.classList.add("pointer-events-none");
      $cardResponseQuestionWordContainer.classList.add("border-none");
      $questionWordPlace.classList.remove("d-none");
      $questionWordPlace.innerText =
        questionAndResponses[this.position].questionWord;

      // Set Responses
      for (let i = 0; i < $responseWordPlaces.length; i++) {
        const responseWordPlace = $responseWordPlaces[i];

        responseWordPlace.innerText =
          questionAndResponses[this.position].responses[i];
      }
    } else if (questionAndResponses[this.position].typeTest === "audio") {
      // Set data finished
      $finishedCorrectData.innerText = this.corrects;
      $finishedIncorrectData.innerText = this.incorrects;
      $finishedPercent.innerHTML = `${this.percent}<span>%</span>`;

      // Set count text
      $part.innerText = this.position + 1;
      $total.innerText = questionAndResponses.length;

      // Set question svg
      $cardResponseQuestionWordContainer.classList.remove(
        "pointer-events-none"
      );
      $cardResponseQuestionWordContainer.classList.add("shadow");
      $cardResponseQuestionWordContainer.classList.remove("border-none");
      $questionWordPlace.classList.add("d-none");
      $questionSvgPlace.classList.remove("d-none");

      // Set question audio
      $questionWordAudio.setAttribute(
        "src",
        `${questionAndResponses[this.position].audioQuestionWord}`
      );
      $cardResponseQuestionWord.addEventListener("click", () => {
        $questionWordAudio.play().then(() => {
          $cardResponseQuestionWordContainer.classList.remove("shadow");
          $questionWordAudio.addEventListener("ended", () => {
            $cardResponseQuestionWordContainer.classList.add("shadow");
          });
        });
      });

      // Set Responses
      for (let i = 0; i < $responseWordPlaces.length; i++) {
        const responseWordPlace = $responseWordPlaces[i];

        responseWordPlace.innerText =
          questionAndResponses[this.position].responses[i];
      }
    }

    return questionAndResponses;
  }

  // Create Card Test
  createCardTest(data, typeCardTest) {
    /******************************** Variables ********************************/
    const $testTypeLabels =
      this.shadowRoot.querySelectorAll(".test-type-label");

    /******************************** Logic ********************************/
    for (let i = 0; i < $testTypeLabels.length; i++) {
      const testTypeLabel = $testTypeLabels[i];

      testTypeLabel.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        if (testTypeLabel.firstChild.data === "Audio y Texto") {
          this.position = 0;
          this.isAudioText = true;
          this.isText = false;
          this.isAudio = false;
          const questionAndResponses = this.generateQuestionAndResponses(
            data,
            "audioText",
            typeCardTest
          );
          this.setQuestionAndResponses(questionAndResponses);
          this.clickAccept(questionAndResponses);
        } else if (testTypeLabel.firstChild.data === "Texto") {
          this.position = 0;
          this.isText = true;
          this.isAudioText = false;
          this.isAudio = false;

          const questionAndResponses = this.generateQuestionAndResponses(
            data,
            "text"
          );
          this.setQuestionAndResponses(questionAndResponses);
          this.clickAccept(questionAndResponses);
        } else if (testTypeLabel.firstChild.data === "Audio") {
          this.position = 0;
          this.isAudio = true;
          this.isAudioText = false;
          this.isText = false;
          const questionAndResponses = this.generateQuestionAndResponses(
            data,
            "audio"
          );
          this.setQuestionAndResponses(questionAndResponses);
          this.clickAccept(questionAndResponses);
        }
      });
    }
  }

  // Click items
  clickItems(data, typeCardTest) {
    /******************** Variables ********************/
    const $labels = this.shadowRoot.querySelectorAll(".test-type-label");
    const $selectItems = this.shadowRoot.querySelectorAll(
      ".test-type-select-item"
    );

    /******************** Logic ********************/

    for (let i = 0; i < $labels.length; i++) {
      const label = $labels[i];
      const selectItem = $selectItems[i];

      label.addEventListener("click", () => {
        // For this label
        this.isClickItem = true;
        this.corrects = 0;
        this.clickClose = false;
        selectItem.style.setProperty("box-shadow", "none");
        selectItem.style.setProperty("background-color", "#fd610750");
        selectItem.style.setProperty("pointer-events", "none");
        this.createCardTest(data, typeCardTest);

        // For others labels
        for (let z = 0; z < $labels.length; z++) {
          const selectItem = $selectItems[z];

          if (z !== i) {
            selectItem.style.setProperty(
              "box-shadow",
              "0.25rem 0.25rem 0.25rem #00000075"
            );
            selectItem.style.setProperty("background-color", "transparent");
            selectItem.style.setProperty("pointer-events", "auto");
          }
        }
      });
    }
  }

  // Click select items
  clickSelectItems() {
    /******************** Variables ********************/
    const $selectResponseContainer = this.shadowRoot.querySelectorAll(
      ".select-response-container"
    );

    /******************** Logic ********************/

    for (let i = 0; i < $selectResponseContainer.length; i++) {
      const selectItem = $selectResponseContainer[i];

      selectItem.addEventListener("click", (e) => {
        // For this label
        selectItem.classList.remove("notItemSelected");
        selectItem.classList.add("itemSelected");
        selectItem.children[0].classList.add("labelSelected");

        // For others labels
        for (let z = 0; z < $selectResponseContainer.length; z++) {
          const selectItem = $selectResponseContainer[z];

          if (z !== i) {
            selectItem.classList.add("notItemSelected");
            selectItem.classList.remove("itemSelected");
            selectItem.children[0].classList.remove("labelSelected");
          }
        }
      });
    }
  }

  // Click button menu
  clickBtnClose() {
    const $cardResponseClose = this.shadowRoot.querySelector(
      "#card-response-close"
    );
    const $cardResponse = this.shadowRoot.querySelector(".card-response");
    const $selectItems = this.shadowRoot.querySelectorAll(
      ".test-type-select-item"
    );

    $cardResponseClose.addEventListener("click", () => {
      this.clickClose = true;
      $cardResponseClose.style.setProperty("text-shadow", "none");

      setTimeout(() => {
        $cardResponseClose.style.setProperty(
          "text-shadow",
          "0.25rem 0.25rem 0.18rem #00000075"
        );
      }, 500);

      setTimeout(() => {
        $cardResponse.style.setProperty("transform", "translateX(-100vw)");

        for (let i = 0; i < $selectItems.length; i++) {
          const selectItem = $selectItems[i];

          selectItem.style.setProperty(
            "box-shadow",
            "0.25rem 0.25rem 0.25rem #00000075"
          );
          selectItem.style.setProperty("background-color", "transparent");
          selectItem.style.setProperty("pointer-events", "auto");
        }
      }, 1200);
    });
  }

  // Click button menu
  clickBtnMenu(data, typeCardTest) {
    const $testTypeBtn = this.shadowRoot.querySelector(".test-type-btn");
    const $cardResponse = this.shadowRoot.querySelector(".card-response");
    const $percentAudioText = this.shadowRoot.querySelector(".percent-audio-text");
    const $percentText = this.shadowRoot.querySelector(".percent-text");
    const $percentAudio = this.shadowRoot.querySelector(".percent-audio");    
    const $testTypeSelectContainer = this.shadowRoot.querySelector(
      ".test-type-select-container"
    );
    const $testTypeSelectItem = this.shadowRoot.querySelectorAll(
      ".test-type-select-item"
    );

    $testTypeBtn.addEventListener("click", () => {
      $percentAudioText.innerHTML = `${this.percentAudioText}%`;
      $percentText.innerHTML = `${this.percentText}%`;
      $percentAudio.innerHTML = `${this.percentAudio}%`;

      $testTypeBtn.classList.toggle("shadow");

      // Show options
      if (!$testTypeBtn.classList.contains("shadow")) {
        $cardResponse.style.setProperty("transform", "translateX(-100vw)");
        setTimeout(() => {
          $testTypeSelectContainer.classList.toggle("d-none");
        }, 500);

        setTimeout(() => {
          $testTypeSelectItem[0].style.setProperty(
            "transform",
            "translateX(0)"
          );
          setTimeout(() => {
            $testTypeSelectItem[1].style.setProperty(
              "transform",
              "translateX(0)"
            );
            setTimeout(() => {
              $testTypeSelectItem[2].style.setProperty(
                "transform",
                "translateX(0)"
              );
            }, 200);
          }, 200);
        }, 700);

        this.createCardTest(data, typeCardTest);
      }

      // Ocult options
      if ($testTypeBtn.classList.contains("shadow")) {
        setTimeout(() => {
          $testTypeSelectItem[0].style.setProperty(
            "transform",
            "translateX(-100vw)"
          );
          setTimeout(() => {
            $testTypeSelectItem[1].style.setProperty(
              "transform",
              "translateX(-100vw)"
            );
            setTimeout(() => {
              $testTypeSelectItem[2].style.setProperty(
                "transform",
                "translateX(-100vw)"
              );
              if (this.isClickItem) {
                setTimeout(() => {
                  $testTypeSelectContainer.classList.toggle("d-none");
                  if (!this.clickClose) {
                    $cardResponse.style.setProperty(
                      "transform",
                      "translateX(0)"
                    );
                  }
                }, 400);
              } else {
                setTimeout(() => {
                  $testTypeSelectContainer.classList.toggle("d-none");
                }, 400);
              }
            }, 200);
          }, 200);
        }, 200);
      }
    });
  }

  // Click button accept
  clickAccept(questionAndResponses) {
    /******************** Variables ********************/
    const $btnAccept = this.shadowRoot.querySelector("#btn-accept");
    const $messages = this.shadowRoot.querySelector("#messages");
    const $messagesCorrect = this.shadowRoot.querySelector("#messages-correct");
    const $messagesIncorrect = this.shadowRoot.querySelector(
      "#messages-incorrect"
    );
    const $messagesFinished =
      this.shadowRoot.querySelector("#messages-finished");
    const $selectResponses =
      this.shadowRoot.querySelectorAll(".selectResponse");

    /******************** Logic ********************/
    this.setPercent(questionAndResponses.length);
    this.globalResponse = questionAndResponses[this.position].response;

    $btnAccept.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      for (let i = 0; i < $selectResponses.length; i++) {
        const selectResponse = $selectResponses[i];
        if (selectResponse.checked) {
          if (selectResponse.labels[0].textContent === this.globalResponse) {
            if (this.isFirstTime) {
              this.corrects++;
            }
            this.isFirstTime = true;

            if (this.position < questionAndResponses.length - 1) {
              $messages.classList.remove("d-none");
              $messagesCorrect.classList.remove("d-none");
              selectResponse.parentElement.classList.remove("itemSelected");
              selectResponse.parentElement.classList.add("notItemSelected");
              selectResponse.parentElement.children[0].classList.remove(
                "labelSelected"
              );
              this.position++;

              this.setQuestionAndResponses(questionAndResponses, this.position);
              this.clickAccept(questionAndResponses, this.position);
              this.btnNext();
            } else {
              $messages.classList.remove("d-none");
              $messagesFinished.classList.remove("d-none");
            }

            if (this.isAudioText) {
              this.percentAudioText = this.percent;
            } else if (this.isText) {
              this.percentText = this.percent;
            } else if (this.isAudio) {
              this.percentAudio = this.percent;
            }
          } else if (
            selectResponse.labels[0].textContent !== this.globalResponse
          ) {
            if (this.isFirstTime) {
              this.incorrects++;
            }
            this.isFirstTime = false;

            $messages.classList.remove("d-none");
            $messagesIncorrect.classList.remove("d-none");
            selectResponse.parentElement.classList.remove("itemSelected");
            selectResponse.parentElement.classList.add("notItemSelected");
            selectResponse.parentElement.children[0].classList.remove(
              "labelSelected"
            );
          }

          selectResponse.checked = false;
        }
      }
    });
  }

  // Click button next
  btnNext() {
    /******************** Variables ********************/
    const $btnNext = this.shadowRoot.querySelector("#btn-next");
    const $messages = this.shadowRoot.querySelector("#messages");
    const $messagesCorrect = this.shadowRoot.querySelector("#messages-correct");

    /******************** Logic ********************/
    $btnNext.addEventListener("click", () => {
      $messages.classList.add("d-none");
      $messagesCorrect.classList.add("d-none");
    });
  }

  // Click button retry
  btnRetry() {
    /******************** Variables ********************/
    const $btnRetry = this.shadowRoot.querySelector("#btn-retry");
    const $messages = this.shadowRoot.querySelector("#messages");
    const $messagesIncorrect = this.shadowRoot.querySelector(
      "#messages-incorrect"
    );

    /******************** Logic ********************/
    $btnRetry.addEventListener("click", () => {
      $messages.classList.add("d-none");
      $messagesIncorrect.classList.add("d-none");
    });
  }
}
window.customElements.define("card-test", CardTest);

/***************************************** Documentation *****************************************/
