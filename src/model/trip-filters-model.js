import Observable from '../framework/observable.js';
import { FilterStates } from '../utils/filter.js';


export default class TripFilterModel extends Observable {
  #filterState = FilterStates.EVERYTHING;

  get FilterState() {
    return this.#filterState;
  }

  setFilterState(filterState) {
    this.#filterState = filterState;
    this._notify(filterState);
  }
}
