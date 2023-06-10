import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function GetRandomPositiveNumber(min, max) {
  if (min > max || max < 0 || min < 0) {
    throw new Error('Неверный аргумент');
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function GetRandomElement(array) {
  return array[GetRandomPositiveNumber(0, array.length - 1)];
}

function ShuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {GetRandomPositiveNumber, GetRandomElement, ShuffleArray, isEscape};
