import dayjs from 'dayjs';
import Observable from '../framework/observable.js';
import { CreatePoint } from '../mock/data.js';

export default class TripPointsModel extends Observable {
  #tripPointsApiService = null;
  #tripPoints = null;

  constructor({tripPointsApiService}) {
    super();
    this.#tripPointsApiService = tripPointsApiService;

    this.#tripPointsApiService.tripPoints.then((tripPoint) => {
      console.log(tripPoint);
      console.log(tripPoint.map(this.#adaptToClient));
    });
  }

  init(tripPointsQuantity, destinations, offersByType) {
    this.#tripPoints = Array.from({length: tripPointsQuantity}, CreatePoint, {offersByType: offersByType, destinations: destinations }).sort();
  }

  get TripPoints () {
    return this.#tripPoints;
  }

  set TripPoints(tripPoints) {
    this.#tripPoints = tripPoints;
    this._notify();
  }

  addTripPoint(tripPoint) {
    this.#tripPoints.push(tripPoint);
    this._notify();
  }

  editTripPoint(editedPoint) {
    const i = this.#tripPoints.findIndex((item) => item.id === editedPoint.id);
    this.#tripPoints[i] = editedPoint;
    this._notify();
  }

  deleteTripPoint(tripPoint) {
    this.#tripPoints = this.#tripPoints.filter((point) => point.id !== tripPoint.id);
    this._notify();
  }

  #adaptToClient(tripPoint) {
    const adaptedTripPoint = {...tripPoint,
      basePrice: tripPoint['base_price'],
      dateFrom: dayjs(tripPoint['date_from']),
      dateTo: dayjs(tripPoint['date_to']),
      isFavorite: tripPoint['is_favorite'],
    };

    delete adaptedTripPoint['base_price'];
    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['is_favorite'];

    return adaptedTripPoint;
  }
}
