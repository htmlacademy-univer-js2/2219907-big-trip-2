import dayjs from 'dayjs';
import { remove } from '../framework/render.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { CapitalizeFirstLetter } from '../utils/trip.js';

function createNewPointTemplate(destinations, offersByType) {
  const type = 'flight';
  const destination = 1;
  const pointOffers = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((dest) => dest.id === destination);

  const offersTemplate = pointOffers.offers
    .map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

  const photos = pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  return `
<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${CapitalizeFirstLetter(type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs().format('DD/MM/YY hh:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photos}
        </div>
      </div>
    </section>
  </section>
</form>
</li>
`;}

export default class NewPointView extends AbstractStatefulView {
  #destinations;
  #offersByType;

  constructor(destinations, offersByType) {
    super();
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.setCancelHandler(() => {
      this.element.querySelector('.event__reset-btn').removeEventListener('click', this.#cancelHandler);
      remove(this);
    });
  }

  get template() {
    return createNewPointTemplate(this.#destinations, this.#offersByType);
  }

  #cancelHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancel();
  };

  setCancelHandler = (callback) => {
    this._callback.cancel = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelHandler);
  };

  #changeHandler = (evt) => {
    evt.preventDefault();
    this._callback.change();
  };

  setChangeHandler = (callback) => {
    this._callback.change = callback;
    this.element.querySelector('.event__type-toggle').addEventListener('click', this.#changeHandler);
  };

  #setNewPointViewHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#tripPointTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#tripPointDestinationHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#tripPointOffersHandler);
  };

  reset = (tripPoint) => this.updateElement({...tripPoint});

  _restoreHandlers = () => {
    this.#setNewPointViewHandlers();
    this.setClickHandler(this._callback.click);
    this.setSubmitHandler(this._callback.formSubmit);
  };

  #tripPointTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: []});
  };

  #tripPointDestinationHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((d) => d.name === evt.target.value);
    this.updateElement({destination: destination.id});
  };

  #tripPointOffersHandler = (evt) => {
    evt.preventDefault();
    const offerIdToChange = Number(evt.target.id.split('-').at(-1));
    if (this._state.offers.includes(offerIdToChange)) {
      this._state.offers.filter((offer) => offer !== offerIdToChange);
    } else {
      this._state.offers.push(offerIdToChange);
    }
    this.updateElement({offers: this._state.offers});
  };
}
