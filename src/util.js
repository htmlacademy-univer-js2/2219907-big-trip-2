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

function CapitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function DateDifference(dateFrom, dateTo) {
  let dateDiff = dayjs.duration(dateTo.diff(dateFrom, 'millisecond'));

  if (dateDiff.hours() > 0) {
    dateDiff = dateDiff.format('HH[H] mm[M]');
  } else {
    dateDiff = dateDiff.format('mm[M]');
  }
  return dateDiff;
}

export {GetRandomPositiveNumber, GetRandomElement, ShuffleArray, CapitalizeFirstLetter, DateDifference};
