export default class TripDestinationsModel {
  #destinationsApiService = null;
  #destinations = null;

  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }

  changeDestination(editedDestination) {
    const i = this.#destinations.findIndex(
      (item) => item.id === editedDestination.id
    );
    this.#destinations[i] = editedDestination;
  }
}
