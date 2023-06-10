import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

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

export {CapitalizeFirstLetter, DateDifference};
