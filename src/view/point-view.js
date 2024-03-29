import dayjs from 'dayjs';
import { capitalizeFirstLetter, dateDifference } from '../utils/trip.js';
import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';

function createPointTemplate(tripPoint, destinations, offersByType) {
  const {type, dateFrom, dateTo, basePrice, destination, offers, isFavorite} = tripPoint;

  const pointOffers = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((currentDestination) => currentDestination.id === destination);

  const dateDiff = dateDifference(dateFrom, dateTo);

  const offersTemplate = pointOffers.offers
    .filter((offer) => offers.includes(offer.id))
    .map((offer) => `<li class="event__offer">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </li>`).join('');

  return `
<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('MMM DD')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${capitalizeFirstLetter(type)} ${he.encode(pointDestination.name)}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(dateFrom)}">${dayjs(dateFrom).format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(dateTo)}">${dayjs(dateTo).format('HH:mm')}</time>
      </p>
      <p class="event__duration">${dateDiff}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offersTemplate}
    </ul>
    <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
`;}

export default class PointView extends AbstractView {
  #tripPoint;
  #destinations;
  #offersByType;

  constructor(tripPoint, destinations, offersByType) {
    super();
    this.#tripPoint = tripPoint;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get template() {
    return createPointTemplate(this.#tripPoint, this.#destinations, this.#offersByType);
  }

  setToEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toEditClickHandler);
  };

  setfavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #toEditClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
