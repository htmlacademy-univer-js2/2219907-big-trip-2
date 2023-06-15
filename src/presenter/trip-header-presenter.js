import NavigationView from '../view/navigation-menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripHeaderPresenter {
  #tripMainContainer = document.body.querySelector('.trip-main');
  #navigationContainer = this.#tripMainContainer.querySelector('.trip-controls__navigation');

  #tripPointsModel;
  #tripOffersModel;
  #tripDestinationsModel;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();

  constructor(tripPointsModel, tripOffersModel, tripDestinationsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;
    this.#tripDestinationsModel = tripDestinationsModel;
  }

  init() {
    render(this.#navigationComponent, this.#navigationContainer);
    this.#tripPointsModel.addObserver(this.totalPriceHandler);
    this.#tripPointsModel.addObserver(this.renderTripInfo);
  }

  renderTripInfo = () => {
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#tripPointsModel.removeObserver(this.renderTripInfo);
  };

  totalPriceHandler = () => {
    this.#tripInfoComponent.updateElement({
      tripPoints: this.#tripPointsModel.TripPoints,
      offersByType: this.#tripOffersModel.OffersByType,
      destinations: this.#tripDestinationsModel.Destinations
    });
  };
}
