// ~~~~~~~~~~~~~~~~~~~~ IMPORTS ~~~~~~~~~~~~~~~~~~~~ //
import Hangman from './Hangman/Hangman.js';

// ~~~~~~~~~~~~~~~~~~~~ CONTAINER VARIABLES ~~~~~~~~~~~~~~~~~~~~ //
let hangmanInstance = {}
let WORDS = [];

// ~~~~~~~~~~~~~~~~~~~~ CONSTANTS ~~~~~~~~~~~~~~~~~~~~ //
const ERR_MESSAGE_ELEM = document.getElementById('message__error');
const SUCC_MESSAGE_ELEM = document.getElementById('message__success');
const RESTART_CONTAINER_ELEM = document.getElementById('restart__container');
const UI_IDS = {
  error: 'container__error',
  guess: 'container__word',
  remaining: 'container__remaining',
  hint: 'container__hint'
}

// ~~~~~~~~~~~~~~~~~~~~ HELPERS ~~~~~~~~~~~~~~~~~~~~ //

function showError() {
  ERR_MESSAGE_ELEM.classList.add('visible');
  ERR_MESSAGE_ELEM.classList.remove('invisible');
}

function hideError() {
  ERR_MESSAGE_ELEM.classList.remove('visible');
  ERR_MESSAGE_ELEM.classList.add('invisible');
}

function showSuccess() {
  SUCC_MESSAGE_ELEM.classList.add('visible');
  SUCC_MESSAGE_ELEM.classList.remove('invisible');
}

function hideSuccess() {
  SUCC_MESSAGE_ELEM.classList.remove('visible');
  SUCC_MESSAGE_ELEM.classList.add('invisible');
}

function showRestart() {
  RESTART_CONTAINER_ELEM.classList.add('visible');
  RESTART_CONTAINER_ELEM.classList.remove('invisible');
}

function hideRestart() {
  RESTART_CONTAINER_ELEM.classList.remove('visible');
  RESTART_CONTAINER_ELEM.classList.add('invisible');
}

// Initialise Hangman game
function initHangman() {
  // Initialise new Hangman class
  hangmanInstance = new Hangman(WORDS, UI_IDS.error, UI_IDS.guess, UI_IDS.remaining, UI_IDS.hint);
}

// ~~~~~~~~~~~~~~~~~~~~ FORM VALIDATION AND SUBMIT ~~~~~~~~~~~~~~~~~~~~ //

// Input text field for guesses
// TODO: Make input field fill on keypress event without focuss.
// TODO: Make input field auto focus after each guess, or when key is pressed
const GUESS_INPUT_ELEM = document.getElementById('input__guess');
GUESS_INPUT_ELEM.onkeypress = function (evt) {
  // Validate character is valid guess
  return hangmanInstance.isValidGuess(evt.key);
}

// Form submit for guesses
const FORM_ELEM = document.getElementById('form__guess');
FORM_ELEM.addEventListener('submit', submitHandler);

// TODO: Make submit handler fire on enter key when input is focussed
const SUBMIT_BTN_ELEM = document.getElementById('submit__guess');
let gameStatus = '';
function submitHandler(evt) {
  evt.preventDefault();
  // Extract character value
  const char = GUESS_INPUT_ELEM.value;
  // Reset value of input field
  GUESS_INPUT_ELEM.value = '';
  // Submit character guess
  gameStatus = hangmanInstance.submitGuess(char);
  // Process game status
  if (gameStatus === 'game-over' || gameStatus === 'success') {
    // Disable submit button
    SUBMIT_BTN_ELEM.disabled = true;
    // Show error message
    gameStatus === 'success' ? showSuccess() : showError();
    // Show restart button
    showRestart()
  }
}

// Restart game
const RESTART_BTN_ELEM = document.getElementById('button__restart');
RESTART_BTN_ELEM.addEventListener('click', event => {
  // Initialise a new game of Hangman
  initHangman()
  // Remove messages and restart button
  hideError();
  hideSuccess();
  hideRestart();
  // Enable submit button
  SUBMIT_BTN_ELEM.disabled = false;
});

// ~~~~~~~~~~~~~~~~~~~~ INITIALISATION ~~~~~~~~~~~~~~~~~~~~ //

// Get JSON library of words from the server
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = async () => {
  // Only proceed when successful request
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    // Parse response to object
    WORDS = JSON.parse(httpRequest.responseText);
    // Initialise UI
    initHangman()
  }
}
// Send actual request to get words
httpRequest.open("GET", "/assets/words.json", true);
httpRequest.send(null);
