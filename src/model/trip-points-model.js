export default class TripPointsModel {
  #points;
  #destinations;
  #offers;

  constructor() {
    this.#points = null;
    this.#destinations = null;
    this.#offers = null;
  }


  init(points, destinations, offers) {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get TripPoints () {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
