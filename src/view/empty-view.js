import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createEmptyTemplate = () => (`
<p class="trip-events__msg">Click New Event to create your first point</p>
`);

export default class EmptyView extends AbstractStatefulView {
  get template() {
    return createEmptyTemplate;
  }
}
