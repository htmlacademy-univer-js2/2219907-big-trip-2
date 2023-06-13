import dayjs from 'dayjs';

const FilterStates = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const futureFilter = (tripPoint) => tripPoint.dateFrom >= dayjs();
const pastFilter = (tripPoint) => tripPoint.dateTo < dayjs();

const filterBy = {
  [FilterStates.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterStates.FUTURE]: (tripPoints) => tripPoints.filter(futureFilter),
  [FilterStates.PAST]: (tripPoints) => tripPoints.filter(pastFilter)
};


export { FilterStates, filterBy };
