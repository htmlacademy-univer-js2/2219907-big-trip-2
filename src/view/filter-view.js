import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FilterState } from '../utils/filter.js';
import { capitalizeFirstLetter } from '../utils/trip.js';

function createFilterTemplate({currentFilter, disabledFilters}) {
  const filtersTemplate = Object.values(FilterState).map((filter) => `<div class="trip-filters__filter">
  <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === currentFilter ? 'checked' : ''} ${disabledFilters.includes(filter)? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
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

  setFilterChangeHandler = (callback) => {
    this._callback.changeFilter = callback;
    this.element.addEventListener('click', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.changeFilter(evt.target.value);
  };
}
