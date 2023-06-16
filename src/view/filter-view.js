import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FilterStates } from '../utils/filter.js';
import { CapitalizeFirstLetter } from '../utils/trip.js';

function createFilterTemplate({currentFilter, disabledFilters}) {
  if (disabledFilters.includes(currentFilter)) {
    currentFilter = FilterStates.EVERYTHING;
  }
  const filtersTemplate = Object.values(FilterStates).map((filter) => `<div class="trip-filters__filter">
  <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === currentFilter ? 'checked' : ''} ${disabledFilters.includes(filter)? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${filter}">${CapitalizeFirstLetter(filter)}</label>
</div>`).join('');

  return`
<form class="trip-filters" action="#" method="get">
  ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>
`;}

export default class FilterView extends AbstractStatefulView {
  constructor(state) {
    super();
    this._state = state;
  }

  get template() {
    if(!this._state) {
      return '<div></div>';
    }
    return createFilterTemplate(this._state);
  }

  _restoreHandlers() {
    this.setFilterChangeHandler(this._callback.changeFilter);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.changeFilter(evt.target.value);
  };

  setFilterChangeHandler = (callback) => {
    this._callback.changeFilter = callback;
    this.element.addEventListener('click', this.#filterChangeHandler);
  };
}
