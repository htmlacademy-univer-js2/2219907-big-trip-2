import {render, RenderPosition} from '../framework/render.js';
import NavigationView from '../view/navigation-menu-view.js';
import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
// import StatsView from '../view/stats-view.js';


export default class TripHeaderPresenter {
  #tripMain;
  #navigation;
  #filters;


  constructor() {
    this.#tripMain = document.body.querySelector('.trip-main');
    this.#navigation = this.#tripMain.querySelector('.trip-controls__navigation');
    this.#filters = this.#tripMain.querySelector('.trip-controls__filters');

  }

  init() {
    this.#renderHeader();
  }

  #renderHeader() {
    render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
    render(new NavigationView(), this.#navigation);
    render(new FilterView(), this.#filters);
  }
}
