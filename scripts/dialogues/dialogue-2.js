import {dataDialogue002 as dataDialogue} from '../../dataBase/dataBase.js'
import {startDialogue} from './dialogue-index.js'

/******************** Functions ********************/
/* Start Lesson */
startDialogue(dataDialogue);

const $loaderContainer = document.querySelector('.loader-container');
const $ldsSpinner = document.querySelector('.lds-spinner');

window.addEventListener('load', ()=>{
  $loaderContainer.classList.add('d-none');
  $loaderContainer.removeChild($ldsSpinner);
});