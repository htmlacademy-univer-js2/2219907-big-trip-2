import AbstractView from '../framework/view/abstract-view.js';

const EmptyStates = {
  'everything': 'Click New Event to create your first point',
  'past': 'There are no past events now',
  'future': 'There are no future events now'
};

const createEmptyTemplate = (state) => (`
<p class="trip-events__msg">${EmptyStates[state]}</p>
`);

export default class EmptyView extends AbstractView {
  #state = 'everything';

  get template() {
    return createEmptyTemplate(this.#state);
  }

  changeState(state) {
    this.#state = state;
  }
}
