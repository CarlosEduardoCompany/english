import {dataLesson04 as dataLesson} from '../../dataBase/dataBase.js'
import {startLesson} from './lesson-index.js'

let lessonName = 'Articles'
let lessonHomeDir = '../../index.html'
let $theoryContainer = document.querySelector('.theory-container');
let $practiceContainer = document.querySelector('.card-test-container');

startLesson(dataLesson, lessonName, lessonHomeDir, $theoryContainer, $practiceContainer);

const $loaderContainer = document.querySelector('.loader-container');
const $ldsSpinner = document.querySelector('.lds-spinner');

window.addEventListener('load', ()=>{
  $loaderContainer.classList.add('d-none');
  $loaderContainer.removeChild($ldsSpinner);
});