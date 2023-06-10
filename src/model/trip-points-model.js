import { CreateDestination, CreateOffersByType, CreatePoint } from './mock/data.js';

export default class TripPointsModel {
  #tripPoints;
  #destinations;
  #offersByType;

  constructor() {
    this.#tripPoints = null;
    this.#destinations = null;
    this.#offersByType = null;
  }

  init(destinationsQuantity, tripPointsQuantity) {
    this.#destinations = Array.from({length: destinationsQuantity}, CreateDestination);
    this.#offersByType = CreateOffersByType();
    this.#tripPoints = Array.from({length: tripPointsQuantity}, CreatePoint);
  }

  get TripPoints () {
    return this.#tripPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}
