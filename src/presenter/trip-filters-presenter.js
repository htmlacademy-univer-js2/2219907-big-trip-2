import {render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';


export default class TripFiltersPresenter {
  #tripMain;
  #filtersContainer;
  #tripFiltersModel;
  #filterComponent;

  constructor() {
    this.#tripMain = document.body.querySelector('.trip-main');
    this.#filtersContainer = this.#tripMain.querySelector('.trip-controls__filters');
  }

  init(tripFiltersModel) {
    this.#tripFiltersModel = tripFiltersModel;
    this.#filterComponent = new FilterView();
    this.#setChangeFilterHandler();
    this.#renderFilters();
  }

  #renderFilters() {
    render(this.#filterComponent, this.#filtersContainer);
  }

  #changeFilter(newFilterState) {
    this.#tripFiltersModel.setFilterState(newFilterState);
  }

  #setChangeFilterHandler() {
    this.#filterComponent.setFilterChangeHandler((filterState) => {
      this.#changeFilter(filterState);
    });
  }
}
