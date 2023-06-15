import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class TripPointsModel extends Observable {
  #tripPointsApiService = null;
  #tripPoints = [];

  constructor(tripPointsApiService) {
    super();
    this.#tripPointsApiService = tripPointsApiService;
  }

  async init() {
    try {
      const tripPoints = await this.#tripPointsApiService.tripPoints;
      this.#tripPoints = tripPoints.map(this.#adaptToClient);
    } catch(err) {
      this.#tripPoints = [];
    }
    this._notify(UpdateType.INIT);
  }

  get TripPoints () {
    return this.#tripPoints;
  }

  set TripPoints(tripPoints) {
    this.#tripPoints = tripPoints;
    this._notify();
  }

  async addTripPoint(updateType, updatePoint) {
    try{
      const response = await this.#tripPointsApiService.addTripPoint(updatePoint);
      const updatedPoint = this.#adaptToClient(response);
      this.#tripPoints.push(updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t add trip point');
    }
  }

  async editTripPoint(updateType, updatePoint) {
    const i = this.#tripPoints.findIndex((item) => item.id === updatePoint.id);

    if (i === -1) {
      throw new Error('Can\'t edit unexisting trip point');
    }

    try {
      const responce = await this.#tripPointsApiService.updateTripPoint(updatePoint);
      const updatedPoint = this.#adaptToClient(responce);
      this.#tripPoints[i] = updatedPoint;
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t edit trip point');
    }

  }

  async deleteTripPoint(updateType, updatePoint) {
    try {
      await this.#tripPointsApiService.deleteTripPoint(updatePoint);
      this.#tripPoints = this.#tripPoints.filter((point) => point.id !== updatePoint.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip point');
    }
  }

  #adaptToClient(tripPoint) {
    const adaptedTripPoint = {...tripPoint,
      basePrice: tripPoint['base_price'],
      dateFrom: new Date(tripPoint['date_from']),
      dateTo: new Date(tripPoint['date_to']),
      isFavorite: tripPoint['is_favorite'],
    };

    delete adaptedTripPoint['base_price'];
    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['is_favorite'];

    return adaptedTripPoint;
  }
}
