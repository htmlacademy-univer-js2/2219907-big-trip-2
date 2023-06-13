import {remove, render, RenderPosition, replace} from '../framework/render.js';
import NavigationView from '../view/navigation-menu-view.js';
import TripInfoView from '../view/trip-info-view.js';
// import StatsView from '../view/stats-view.js';


export default class TripHeaderPresenter {
  #tripMainContainer;
  #navigationContainer;
  #tripInfoComponent;
  #navigationComponent;

  #tripPointsModel;

  constructor() {
    this.#tripMainContainer = document.body.querySelector('.trip-main');
    this.#navigationContainer = this.#tripMainContainer.querySelector('.trip-controls__navigation');
    this.#tripInfoComponent = new TripInfoView();
    this.#navigationComponent = new NavigationView();
  }

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#renderHeader();
    this.totalPriceHandler();
  }

  #renderHeader() {
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
