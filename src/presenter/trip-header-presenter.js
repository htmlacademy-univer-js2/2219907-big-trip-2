import { remove, render, RenderPosition } from '../framework/render.js';
import NavigationView from '../view/navigation-menu-view.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripHeaderPresenter {
  #tripMainContainer = document.body.querySelector('.trip-main');
  #navigationContainer = this.#tripMainContainer.querySelector('.trip-controls__navigation');

  #tripPointsModel;
  #tripOffersModel;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();

  constructor(tripPointsModel, tripOffersModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;
  }

  init() {
    render(this.#navigationComponent, this.#navigationContainer);
    this.#tripPointsModel.addObserver(this.renderTripInfo);
    this.#tripPointsModel.addObserver(this.totalPriceHandler);
  }

  renderTripInfo = () => {
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#tripPointsModel.removeObserver(this.renderTripInfo);
  };

  totalPriceHandler = () => {
    let totalPrice = 0;
    const allOffers = this.#tripOffersModel.OffersByType.map((offerByType) => [offerByType.type, offerByType.offers]);
    for (const tripPoint of this.#tripPointsModel.TripPoints) {
      totalPrice += tripPoint.basePrice;
      const offerOfType =  allOffers.filter((offer) => offer[0] === tripPoint.type)[0][1];
      totalPrice = offerOfType.filter((offer) => offer.id in tripPoint.offers).reduce((total, curOffer) => total + curOffer.price, totalPrice);
    }

    this.#tripInfoComponent.changeTotalPrice(totalPrice);
    remove(this.#tripInfoComponent);
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  };
}
