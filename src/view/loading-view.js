import { createElement } from '../render.js';

const createLoadingTemplate = () => (`
<p class="trip-events__msg">Loading...</p>
`);

export default class LoadingView {
  #element;

  constructor() {
    this.#element = null;
  }

  get Template() {
    return createLoadingTemplate;
  }

  get Element() {
    if (!this.#element) {
      this.#element = createElement(this.Template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
