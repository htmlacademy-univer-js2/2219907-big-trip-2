import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalizeFirstLetter, formatDate } from '../utils/trip.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';

const EMPTY_TRIP_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createEditPointTemplate(tripPoint, destinations, offersByType, tripPointOffers, isNewPoint) {
  const {type, dateFrom, dateTo, basePrice, destination, offers, isDisabled, isDeleting, isSaving} = tripPoint;

  const pointDestination = destinations.find((currentDestination) => currentDestination.id === destination);
  const photos = pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
  const destinationsTemplate = destinations.map((currentDestination) => `<option value="${currentDestination.name}"></option>`);

  const offerTypesTemplate = offersByType.map((offer) => `
  <div class="event__type-item">
  <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${capitalizeFirstLetter(offer.type)}</label>
</div>
  `).join('');

  const offersTemplate = tripPointOffers
    .map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
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
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${offerTypesTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalizeFirstLetter(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(pointDestination.name)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${destinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isNewPoint ? 'Cancel' : `${isDeleting ? 'Deleting...' : 'Delete'}`}</button>
      ${isNewPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}

    </header>
    <section class="event__details">
      ${tripPointOffers.length > 0 ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersTemplate}
        </div>
      </section>
      `: ''}
      ${pointDestination.description === '' && photos.length === 0 ? '' : `
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
  #datePickerFrom = null;
  #datePickerTo = null;
  #isNewPoint;


  constructor({tripPoint=EMPTY_TRIP_POINT, destinations, offersByType, isNewPoint}) {
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
    return createEditPointTemplate(this._state, this.#destinations, this.#offersByType, this.#getTripPointOffers(), this.#isNewPoint);
  }

  _restoreHandlers = () => {
    if (!this.#isNewPoint) {
      this.setToPointClickHandler(this._callback.pointClick);
    }
    this.#setEditViewHandlers();
    this.setSubmitHandler(this._callback.formSubmit);
    this.setDeleteHandler(this._callback.delete);
    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  };

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset = (tripPoint) => this.updateElement(this.#parseTripPointToState(tripPoint));

  #getTripPointOffers = () => (this.#offersByType.find((offerByType) => offerByType.type === this._state.type).offers);

  #setEditViewHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#tripPointTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#tripPointDestinationHandler);
    if (this.#getTripPointOffers().length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#tripPointOffersHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('change', this.#tripPointPriceHandler);
  };

  #setDatePickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datePickerFrom = flatpickr(
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

  #parseTripPointToState = (tripPoint) => ({...tripPoint,
    dateTo: dayjs(tripPoint.dateTo).toDate(),
    dateFrom: dayjs(tripPoint.dateFrom).toDate(),
    isDisabled: false,
    isDeleting: false,
    isSaving: false
  });

  #parseStateToTripPoint = (state) => {
    const tripPoint = {...state};
    delete tripPoint.isDisabled;
    delete tripPoint.isDeleting;
    delete tripPoint.isSaving;
    return tripPoint;
  };

  #setDatePickerTo = () => {
    if (this._state.dateTo) {
      this.#datePickerTo = flatpickr(
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

  setToPointClickHandler = (callback) => {
    this._callback.pointClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#toPointclickHandler);
  };

  setDeleteHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
  };

  #toPointclickHandler = (evt) => {
    evt.preventDefault();
    this._callback.pointClick();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#parseStateToTripPoint(this._state));
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(this.#parseStateToTripPoint(this._state));
  };

  #tripPointTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: []});
  };

  #tripPointDestinationHandler = (evt) => {
    if(!this.#destinations.map((currentDestination) => currentDestination.name).includes(evt.target.value)) {
      return;
    }
    evt.preventDefault();
    const destination = this.#destinations.find((currentDestination) => currentDestination.name === evt.target.value);
    this.updateElement({destination: destination.id});
  };

  #tripPointOffersHandler = (evt) => {
    evt.preventDefault();
    const offerIdToChange = Number(evt.target.id.split('-').at(-1));
    let selectedOffers = [...this._state.offers];
    if (selectedOffers.includes(offerIdToChange)) {
      selectedOffers = selectedOffers.filter((offer) => offer !== offerIdToChange);
    } else {
      selectedOffers.push(offerIdToChange);
    }
    this._setState({offers: selectedOffers});
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

  #tripPointPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({basePrice: Number(evt.target.value)});
  };
}
