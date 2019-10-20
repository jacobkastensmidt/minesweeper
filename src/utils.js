/**
 * Shuffle an array using Fisher-Yates/Knuth Shuffle (Found here https://bost.ocks.org/mike/shuffle/
 * from this Stack Overflow https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array).
 * Function edited to be immutable.
 * 
 * @param {array} array The array to be shuffled
 */
export const shuffle = function(array) {
  let shuffledArray = [...array];
  let m = shuffledArray.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = shuffledArray[m];
    shuffledArray[m] = shuffledArray[i];
    shuffledArray[i] = t;
  }

  return shuffledArray;
}