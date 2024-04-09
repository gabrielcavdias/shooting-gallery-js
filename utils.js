/**
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Retrieve a img based on data-img attribute
 * @param {String} name
 * @returns {HTMLImageElement|null}
 */
export function getImg(name) {
  return document.querySelector(`img[data-img="${name}"]`);
}
