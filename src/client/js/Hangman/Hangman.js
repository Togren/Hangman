
import { isString, isInt, isArray } from '../utils/utils-validation.js';
import { randomNr} from '../utils/utils-math.js';

// ~~~~~~~~~~~~~~~~~~~~ HANGMAN CLASS ~~~~~~~~~~~~~~~~~~~~ //

export default class Hangman {
  // TODO: Rewrite constructor to use library pattern
  constructor(words, errorContainerId, guessContainerId, remainContainerId, hintContainerId) {
    // Generate random number and select random word object
    this.wordObj = words[randomNr(0, words.length - 1)]
    // Store word as array lower cased
    this.word = this.wordObj.word.toLowerCase().split('');
    // Memory of wrong guesses
    this.wrongGuesses = 0;

    // Pure private data attributes
    // Original word with capitalized letters
    this._wordOriginal = this.wordObj.word.split('')
    // Generate placeholder of same length as word
    this._placeHolder = Array(this.word.length).fill('_');
    // Placeholder for available guesses
    this._availableGuesses = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
      'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    // User Interface objects
    this._errorContainer = document.getElementById(errorContainerId);
    this._guessContainer = document.getElementById(guessContainerId);
    this._remainContainer = document.getElementById(remainContainerId);
    this._hintContainer = document.getElementById(hintContainerId);

    // User Interface initialisation
    this.updateErrorContainer();
    this.updateGuessContainer();
    this.updateRemainContainer();
    this.updateHintContainer();
  }

  get wordObj() {
    return this._wordObj;
  }

  set wordObj(wordObj){
    // Validate obj is filled obj
    if (!wordObj || Object.keys(wordObj).length === 0) {
      throw new TypeError('Word object should not be undefined or empty object.');
    } else if (typeof wordObj.word === 'undefined' || typeof wordObj.description === 'undefined') {
      throw new TypeError('Word object should have both fields description and word.');
    } else if (!isString(wordObj.word) || !isString(wordObj.description)) {
      throw new TypeError('Word fields description and word should be non-empty strings.')
    }
    this._wordObj = wordObj;
  }

  get word() {
    return this._word;
  }

  set word(word){
    // Validate if word is array representation
    if (!isArray(word)) {
      throw new TypeError('Word should be defined and non-empty array.');
    } else if (word.join('') !== this.wordObj.word.toLowerCase()) {
      // Validate word is array representation of word in wordObj
      throw new RangeError('Word should be equal to word in word object.');
    }
    this._word = word;
  }

  get wrongGuesses() {
    return this._wrongGuesses;
  }

  set wrongGuesses(nr) {
    // Validate whether input is number
    if (!isInt(nr)) {
      throw new TypeError('Number of wrong guesses should be a number.');
    } else if (nr < 0) {
      // Validate if number is not negative
      throw new RangeError('Number of wrong guesses should not be negative.');
    } else if (nr > 10) {
      // Validate if number is not larger than 10
      throw new RangeError('Number of wrong guesses cannot be larger than 10.');
    }
    this._wrongGuesses = nr;
  }

  get availableGuesses() {
    return this._availableGuesses;
  }

  get placeHolder () {
    return this._placeHolder;
  }

  get wordOriginal() {
    return this._wordOriginal;
  }

  get errorContainer() {
    return this._errorContainer;
  }

  get guessContainer() {
    return this._guessContainer;
  }

  get remainContainer() {
    return this._remainContainer;
  }

  get hintContainer() {
    return this._hintContainer;
  }

  /**
   * Validate whether a guess is valid.
   * It should be a character and not been guessed before
   * @param {String} char - character to be validated
   * @returns {boolean} - True if char is a character and not been guessed before
   */
  isValidGuess(char) {
    return !!char.match(/[a-zA-Z]/) && this._availableGuesses.includes(char.toLowerCase());
  }

  /**
   * Re-render the container with the amount of wrong guesses
   */
  updateErrorContainer(){
    // TODO: Make hangman an SVG where parts are shown based on wrongGuesses
    this.errorContainer.innerHTML = `<p>The number of wrong guesses is: ${this.wrongGuesses}</p>`
  }

  /**
   * Re-render the container with the correct guesses
   */
  updateGuessContainer() {
    this.guessContainer.innerHTML = `
            <ul class="w-100 list-group list-group-horizontal d-flex justify-content-center">
              ${this.placeHolder.map(placeholderVal => `<li 
                    class="list-group-item 
                    ${placeholderVal === '_' ? 'list-group-item-warning' : 'list-group-item-success'} 
                    mx-2 my-2 border-0 rounded">
                    ${placeholderVal}</li>`).join('')}
            </ul>`
  }

  /**
   * Update the container of the remaining valid guesses
   */
  updateRemainContainer() {
    this.remainContainer.innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center">
          <p>The remaining guesses are:</p>
          <ul class="list-group list-group-horizontal d-flex justify-content-center flex-wrap">
              ${this.availableGuesses.map(availableGuess => `<li class="list-group-item list-group-item-info mx-2 my-2 rounded border-0 text-info">${availableGuess}</li>`).join('')}
          </ul>
        </div>`
  }

  updateHintContainer() {
    // TODO: Make the hint a popup that can be asked or shows when hovered
    this.hintContainer.innerHTML = `Hint: ${this.wordObj.description}`;
  }

  /**
   * Handle the submit of a new guess.
   * Look if the character is in the word. If so, update the UI appropriately.
   * If not, raise the error counter and update the UI.
   * @param {String} char - Submitted character
   */
  submitGuess(char) {
    // Sanitize character
    const sanitizedChar = char.toLowerCase();
    // Validate whether char is in word
    const isInWord = this.word.includes(sanitizedChar);
    if (isInWord) {
      // Char in word, update placeholder
      for (let i = 0; i < this.placeHolder.length; i += 1) {
        // Update placeholder with original char value
        if (sanitizedChar === this.word[i]) this.placeHolder[i] = this.wordOriginal[i];
      }
      // Remove char from available guesses
      this.availableGuesses.splice(this.availableGuesses.indexOf(sanitizedChar), 1);
      // Update UI
      this.updateGuessContainer();
      this.updateRemainContainer();
    } else {
      // Remove char from available guesses
      this.availableGuesses.splice(this.availableGuesses.indexOf(sanitizedChar), 1);
      // Char not in word, raise error counter and update
      this.wrongGuesses = this.wrongGuesses += 1;
      this.updateErrorContainer();
    }
    // Return status of game
    return this.wrongGuesses === 10 ? 'game-over' : this.placeHolder.includes('_') ? 'in-progress' : 'success';
  }
}
