import { CreateDestination } from '../mock/data.js';

export default class TripDestinationsModel {
  #destinations;

  constructor() {
    this.#destinations = null;
  }

  init(destinationsQuantity) {
    this.#destinations = Array.from({length: destinationsQuantity}, CreateDestination);
  }

  get Destinations() {
    return this.#destinations;
  }

  set Destinations(destinations) {
    this.#destinations = destinations;
  }

  changeDestination(editedDestination) {
    const i = this.#destinations.findIndex((item) => item.id === editedDestination.id);
    this.#destinations[i] = editedDestination;
  }
}
