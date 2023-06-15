import { remove, render, RenderPosition } from '../framework/render.js';
import NavigationView from '../view/navigation-menu-view.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripHeaderPresenter {
  #tripMainContainer = document.body.querySelector('.trip-main');
  #navigationContainer = this.#tripMainContainer.querySelector('.trip-controls__navigation');

  #tripPointsModel;

  #tripInfoComponent = new TripInfoView();
  #navigationComponent = new NavigationView();

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    render(this.#navigationComponent, this.#navigationContainer);
  }

  totalPriceHandler = () => {
    const totalPrice = this.#tripPointsModel.TripPoints.map((point) => point.basePrice).reduce((total, curVal) => total + curVal, 0);
    this.#tripInfoComponent.changeTotalPrice(totalPrice);
    remove(this.#tripInfoComponent);
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
  };
}
