import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function CapitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function DateDifference(dateFrom, dateTo, isNumber=false) {
  let dateDiff = dayjs.duration(dateTo.diff(dateFrom, 'millisecond'));

  if (isNumber) {
    return dateDiff;
  }

  if (dateDiff.days() > 0) {
    dateDiff = dateDiff.format('DD[D] HH[H] mm[M]');
  } else if (dateDiff.hours() > 0) {
    dateDiff = dateDiff.format('HH[H] mm[M]');
  } else {
    dateDiff = dateDiff.format('mm[M]');
  }
  return dateDiff;
}

function DateFormat(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
}

export {CapitalizeFirstLetter, DateDifference, DateFormat};
