import Observable from '../framework/observable.js';
import { CreatePoint } from '../mock/data.js';

export default class TripPointsModel extends Observable {
  #tripPoints = null;

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
}
