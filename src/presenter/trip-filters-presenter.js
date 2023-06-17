import FilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';
import { UpdateType } from '../const.js';
import { filterBy, FilterState } from '../utils/filter.js';

export default class TripFiltersPresenter {
  #filtersContainer = document.body.querySelector('.trip-controls__filters');

  #tripFiltersModel = null;
  #tripPointsModel = null;
  #filterComponent = null;

  constructor(tripPointsModel, tripFiltersModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripFiltersModel = tripFiltersModel;
  }

  init() {
    this.#tripPointsModel.addObserver(this.#handleFiltersNecessary);
    this.#tripFiltersModel.addObserver(this.#handleFiltersNecessary);
  }

  #handleFiltersNecessary = () => {
    if (!this.#filterComponent) {
      this.#filterComponent = new FilterView({
        currentFilter: this.#tripFiltersModel.filterState,
        disabledFilters: []});
      this.#filterComponent.setFilterChangeHandler(this.#handleFilterChange);
      render(this.#filterComponent, this.#filtersContainer);
    }
    const emptyFilters = Object.values(FilterState).filter((filter) => filterBy[filter](this.#tripPointsModel.tripPoints).length === 0);
    this.#filterComponent.updateElement({
      currentFilter: this.#tripFiltersModel.filterState,
      disabledFilters: emptyFilters
    });
  };

  #handleFilterChange = (filterState) => {
    if (this.#tripFiltersModel.filterState === filterState) {
      return;
    }
    this.#tripFiltersModel.setFilterState(UpdateType.MAJOR, filterState);
    this.#handleFiltersNecessary();
  };
}
