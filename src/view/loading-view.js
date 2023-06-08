import { createElement } from '../render.js';

const createLoadingTemplate = () => (`
<p class="trip-events__msg">Loading...</p>
`);

export default class LoadingView {
  #element;

  constructor() {
    this.#element = null;
  }

  get template() {
    return createLoadingTemplate;
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
