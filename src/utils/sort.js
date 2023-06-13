import dayjs from 'dayjs';

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const priceSort = (tripPoint1, tripPoint2) => tripPoint2.basePrice - tripPoint1.basePrice;
const daySort = (tripPoint1, tripPoint2) => dayjs(tripPoint1.dateFrom).diff(dayjs(tripPoint2.dateFrom));
const timeSort = (tripPoint1, tripPoint2) => dayjs(tripPoint1.dateTo).diff(dayjs(tripPoint1.dateFrom)) - dayjs(tripPoint2.dateTo).diff(dayjs(tripPoint2.dateFrom));

const sortingBy = {
  [SortType.DAY]: (tripPoints) => tripPoints.sort(daySort),
  [SortType.TIME]: (tripPoints) => tripPoints.sort(timeSort),
  [SortType.PRICE]: (tripPoints) => tripPoints.sort(priceSort)
};


export { SortType, sortingBy };
