import Observable from '../framework/observable.js';
import { FilterStates } from '../utils/filter.js';


export default class TripFilterModel extends Observable {
  #filterState = FilterStates.EVERYTHING;

  get FilterState() {
    return this.#filterState;
  }

  setFilterState(updateType, filterState) {
    this.#filterState = filterState;
    this._notify(updateType, filterState);
  }
}
