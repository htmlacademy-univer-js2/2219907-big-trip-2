import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDate } from '../utils/trip.js';

function findTripRoute(tripPoints, destinations) {
  const uniqueDestintions = Array.from(new Set(tripPoints.map((tripPoint) => tripPoint.destination)));
  let tripRoute = uniqueDestintions.map((uniqDest) => destinations.find((dest) => dest.id === uniqDest).name);
  if (tripRoute.length > 3) {
    tripRoute = [tripRoute[0], '...', tripRoute.at(-1)];
  }
  return tripRoute.join(' &mdash; ');
}

function countTotalPrice(tripPoints, offersByType) {
  let totalPrice = 0;
  for (const tripPoint of tripPoints) {
    totalPrice += tripPoint.basePrice;
    totalPrice = offersByType
      .find((offer) => offer.type === tripPoint.type).offers
      .filter((offer) => tripPoint.offers.includes(offer.id))
      .reduce((total, curOffer) => total + curOffer.price, totalPrice);
  }
  return totalPrice;
}

function findTripDates(tripPoints) {
  const startDate = tripPoints.at(0).dateFrom;
  const endDate = tripPoints.at(-1).dateTo;
  return [formatDate(startDate, 'MMM DD'), formatDate(endDate, dayjs(startDate).month() === dayjs(endDate).month() ? 'DD' : 'MMM DD')];
}

function createTripInfoTemplate({tripPoints, offersByType, destinations}) {
  const totalPrice = countTotalPrice(tripPoints, offersByType);
  const tripRoute = findTripRoute(tripPoints, destinations);
  const tripDates = findTripDates(tripPoints);

  return`
<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${tripRoute}</h1>

    <p class="trip-info__dates">${tripDates[0]}&nbsp;&mdash;&nbsp;${tripDates[1]}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>
`;}

export default class TripInfoView extends AbstractStatefulView {
  constructor(state) {
    super();
    this._state = state;
  }

  get template() {
    if(!this._state) {
      return '<div></div>';
    }
    return createTripInfoTemplate(this._state);
  }

  _restoreHandlers() {}
}
