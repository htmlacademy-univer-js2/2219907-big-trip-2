import AbstractView from '../framework/view/abstract-view.js';
import { FilterState } from '../utils/filter.js';

const EmptyStates = {
  [FilterState.EVERYTHING]: 'Click New Event to create your first point',
  [FilterState.FUTURE]: 'There are no future events now',
  [FilterState.PAST]: 'There are no past events now'
};

const createEmptyTemplate = (state) => (`
<p class="trip-events__msg">${EmptyStates[state]}</p>
`);

export default class EmptyView extends AbstractView {
  #state = FilterState.EVERYTHING;

  get template() {
    return createEmptyTemplate(this.#state);
  }

  changeState(state) {
    this.#state = state;
  }
}
