import NavigationView from '../view/navigation-menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripHeaderPresenter {
  #tripMainContainer = document.body.querySelector('.trip-main');
  #navigationContainer = this.#tripMainContainer.querySelector('.trip-controls__navigation');

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();

  #tripPointsModel;
  #tripOffersModel;
  #tripDestinationsModel;

  constructor(tripPointsModel, tripOffersModel, tripDestinationsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripOffersModel = tripOffersModel;
    this.#tripDestinationsModel = tripDestinationsModel;
  }

  init() {
    render(this.#navigationComponent, this.#navigationContainer);
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#tripPointsModel.addObserver(this.#tripInfoHandler);
  }

  #tripInfoHandler = () => {
    if (this.#tripPointsModel.tripPoints.length === 0) {
      return;
    }
    this.#tripInfoComponent.updateElement({
      tripPoints: this.#tripPointsModel.tripPoints,
      offersByType: this.#tripOffersModel.offersByType,
      destinations: this.#tripDestinationsModel.destinations
    });
  };
}
