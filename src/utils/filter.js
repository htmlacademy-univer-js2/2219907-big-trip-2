import dayjs from 'dayjs';

const FilterState = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const futureFilter = (tripPoint) => tripPoint.dateFrom >= dayjs();
const pastFilter = (tripPoint) => tripPoint.dateTo < dayjs();

const filterBy = {
  [FilterState.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterState.FUTURE]: (tripPoints) => tripPoints.filter(futureFilter),
  [FilterState.PAST]: (tripPoints) => tripPoints.filter(pastFilter)
};


export { FilterState, filterBy };
