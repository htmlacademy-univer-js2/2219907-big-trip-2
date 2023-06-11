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

const priceSort = (tripPoint1, tripPoint2) => tripPoint2.basePrice - tripPoint1.basePrice;
const daySort = (tripPoint1, tripPoint2) => dayjs(tripPoint1.dateFrom).diff(dayjs(tripPoint2.dateFrom));
const timeSort = (tripPoint1, tripPoint2) => tripPoint1.dateTo.diff(tripPoint1.dateFrom) - tripPoint2.dateTo.diff(tripPoint2.dateFrom);

export {CapitalizeFirstLetter, DateDifference, priceSort, daySort, timeSort};
