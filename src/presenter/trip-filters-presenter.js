import FilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class TripFiltersPresenter {
  #filtersContainer = document.body.querySelector('.trip-controls__filters');

  #tripFiltersModel = null;
  #filterComponent = new FilterView();

  constructor(tripFiltersModel) {
    this.#tripFiltersModel = tripFiltersModel;
  }

  init() {
    this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange);
    render(this.#filterComponent, this.#filtersContainer);
  }

  #handleFilterChange = (filterState) => {
    this.#tripFiltersModel.setFilterState(UpdateType.MAJOR, filterState);
  };
}
