import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { CapitalizeFirstLetter, DateFormat } from '../utils/trip.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';

const EmptyTripPoint = {
  'basePrice': 0,
  'dateFrom': dayjs(),
  'dateTo': dayjs(),
  'destination': -1,
  'id': -1,
  'isFavorite': false,
  'offers': [],
  'type': 'flight'
};

function createEditPointTemplate(tripPoint, destinations, offersByType, isNewPoint) {
  const {type, dateFrom, dateTo, basePrice, destination, offers} = tripPoint;

  const pointOffers = offersByType.find((offer) => offer.type === type);
  let pointDestination = {name: '', description: ''};
  let photos = '';
  if (destination !== -1) {
    pointDestination = destinations.find((dest) => dest.id === destination);
    photos = pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
  }


  const offersTemplate = pointOffers.offers
    .map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${offers.includes(offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

  return`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(pointDestination.name)}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${DateFormat(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${DateFormat(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
      ${isNewPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}

    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersTemplate}
        </div>
      </section>
      ${destination === -1 ? '' : `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photos}
          </div>
        </div>
      </section>
      `}
    </section>
  </form>
</li>
`;}

export default class EditPointView extends AbstractStatefulView {
  #destinations;
  #offersByType;
  #datePicker = null;
  #isNewPoint;

  constructor({tripPoint=EmptyTripPoint, destinations, offersByType, isNewPoint}) {
    super();
    this._state = this.#parseTripPointToState(tripPoint);
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#isNewPoint = isNewPoint;

    this.#setEditViewHandlers();
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offersByType, this.#isNewPoint);
  }

  removeElement() {
    super.removeElement();

    if (this.#datePicker) {
      this.#datePicker.destroy();
      this.#datePicker = null;
    }
  }

  setToPointClickHandler = (callback) => {
    this._callback.pointClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toPointclickHandler);
  };

  #toPointclickHandler = (evt) => {
    evt.preventDefault();
    this._callback.pointClick();
  };

  setSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#parseStateToTripPoint({...this._state, id: dayjs().unix()}));
  };

  setDeleteHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(this.#parseStateToTripPoint(this._state));
  };

  reset = (tripPoint) => this.updateElement(this.#parseTripPointToState(tripPoint));

  _restoreHandlers = () => {
    if (!this.#isNewPoint) {
      this.setClickHandler(this._callback.click);
    }
    this.#setEditViewHandlers();
    this.setSubmitHandler(this._callback.formSubmit);
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  };

  #setEditViewHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#tripPointTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#tripPointDestinationHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#tripPointOffersHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#tripPointPriceHandler);
  };

  #tripPointTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: []});
  };

  #tripPointDestinationHandler = (evt) => {
    if(!this.#destinations.map((dest) => dest.name).includes(evt.target.value)) {
      return;
    }
    evt.preventDefault();
    const destination = this.#destinations.find((d) => d.name === evt.target.value);
    this.updateElement({destination: destination.id});
  };

  #tripPointOffersHandler = (evt) => {
    evt.preventDefault();
    const offerIdToChange = Number(evt.target.id.split('-').at(-1));
    if (this._state.offers.includes(offerIdToChange)) {
      this._state.offers = this._state.offers.filter((offer) => offer !== offerIdToChange);
    } else {
      this._state.offers.push(offerIdToChange);
    }
    this.updateElement({offers: this._state.offers});
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).toDate(),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate(),
    });
  };

  #setDatePickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datePicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#dateFromChangeHandler
        }

      );
    }
  };

  #setDatePickerTo = () => {
    if (this._state.dateTo) {
      this.#datePicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler
        }

      );
    }
  };

  #tripPointPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({basePrice: Number(evt.target.value)});
  };

  #parseTripPointToState = (tripPoint) => ({...tripPoint, dateTo: dayjs(tripPoint.dateTo).toDate(), dateFrom: dayjs(tripPoint.dateFrom).toDate()});

  #parseStateToTripPoint = (state) => ({...state});
}
