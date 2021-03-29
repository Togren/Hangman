
// ~~~~~~~~~~~~~~~~~~~~ TYPES ~~~~~~~~~~~~~~~~~~~~ //

/**
 * Validation that variable is string. Empty string is also considered not a string.
 * @param {Any} str - Variable to be tested to be a string
 * @returns {boolean} - True if variable is string.
 */
export function isString(str) {
  let isString = false;
  // Validate type of variable is string and not empty
  if (str && str.constructor.name === 'String') {
    isString = true;
  }
  return isString;
}

/**
 * Validate that variable is an integer. String of numbers are also considered false.
 * @param {Any} nr - Variable to be tested to be a string
 * @returns {boolean} - True if variable is an integer
 */
export function isInt(nr) {
  let isInt = false;
  if (Number.isInteger(nr)) {
    isInt = true;
  }
  return isInt;
}

/**
 * Validate that variable is an array. Empty array is also considered false.
 * @param {Any} arr - Variable to be tested to be an array
 * @returns {boolean} - True is variable is non-empty array
 */
export function isArray(arr) {
  let isArray = false;
  if (arr && arr.constructor.name === 'Array' && arr.length > 0) {
    isArray = true;
  }
  return isArray;
}
