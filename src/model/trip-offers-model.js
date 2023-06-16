export default class TripOffersModel {
  #offersApiService = null;
  #offersByType = null;

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
  }

  get offersByType() {
    return this.#offersByType;
  }

  set offersByType(offersByType) {
    this.#offersByType = offersByType;
  }

  async init() {
    try {
      const offersByType = await this.#offersApiService.offers;
      this.#offersByType = offersByType;
    } catch(err) {
      this.#offersByType = [];
    }
  }

  changeOffersByType(editedOffer) {
    const i = this.#offersByType.findIndex((item) => item.id === editedOffer.id);
    this.#offersByType[i] = editedOffer;
  }
}
