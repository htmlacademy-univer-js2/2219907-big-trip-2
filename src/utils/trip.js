import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function dateDifference(dateFrom, dateTo) {
  let dateDiff = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom), 'millisecond'));

  if (dateDiff.days() > 0) {
    dateDiff = `${Math.floor(dateDiff.asDays())}D ${dateDiff.format('HH[H] mm[M]')}`;
  } else if (dateDiff.hours() > 0) {
    dateDiff = dateDiff.format('HH[H] mm[M]');
  } else {
    dateDiff = dateDiff.format('mm[M]');
  }
  return dateDiff;
}

function formatDate(date, dateFormat = 'DD/MM/YY HH:mm') {
  return dayjs(date).format(dateFormat);
}

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { capitalizeFirstLetter, dateDifference, formatDate, isEscape };
