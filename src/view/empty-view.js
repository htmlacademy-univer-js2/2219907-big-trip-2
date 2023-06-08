import { createElement } from '../render.js';

const createEmptyTemplate = () => (`
<p class="trip-events__msg">Click New Event to create your first point</p>
`);

export default class LoadingView {
  #element;

  constructor() {
    this.#element = null;
  }

  get template() {
    return createEmptyTemplate;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
