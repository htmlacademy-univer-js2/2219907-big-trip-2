import { CreateOffersByType } from '../mock/data.js';

export default class TripOffersModel {
  #offersByType;

  constructor() {
    this.#offersByType = null;
  }

  init() {
    this.#offersByType = CreateOffersByType();
  }

  get OffersByType() {
    return this.#offersByType;
  }

  set OffersByType(offersByType) {
    this.#offersByType = offersByType;
  }

  changeOffersByType(editedOffer) {
    const i = this.#offersByType.findIndex((item) => item.id === editedOffer.id);
    this.#offersByType[i] = editedOffer;
  }
}
