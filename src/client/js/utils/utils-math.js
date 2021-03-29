
// ~~~~~~~~~~~~~~~~~~~~ RANDOM ~~~~~~~~~~~~~~~~~~~~ //

/**
 * Get a random number with a minimum and maximum. These are inclusive.
 * @param {Number} min - Minimum number
 * @param {Number} max - Maximum number
 */
export function randomNr(min, max) {
  // Get the random number
  const randomBaseNr = Math.random();
  // Scale and translate. Using min+1 together with Math.floor ensures even distribution.
  const randomNrFloat = randomBaseNr * (max - min + 1) + min;
  // Return whole integer
  return Math.floor(randomNrFloat);
}
