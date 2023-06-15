import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function CapitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function DateDifference(dateFrom, dateTo) {
  let dateDiff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom), 'millisecond'));

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
  return dayjs(date).format('DD/MM/YY HH:mm');
}

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {CapitalizeFirstLetter, DateDifference, DateFormat, isEscape};
