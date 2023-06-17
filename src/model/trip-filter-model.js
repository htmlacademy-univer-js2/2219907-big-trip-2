import Observable from '../framework/observable.js';
import { FilterState } from '../utils/filter.js';


export default class TripFilterModel extends Observable {
  #filterState = FilterState.EVERYTHING;

  get filterState() {
    return this.#filterState;
  }

  setFilterState(updateType, filterState) {
    this.#filterState = filterState;
    this._notify(updateType, filterState);
  }
}
