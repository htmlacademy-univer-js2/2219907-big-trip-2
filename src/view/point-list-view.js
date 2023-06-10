import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointListView extends AbstractStatefulView {
  get template() {
    return createPointListTemplate;
  }
}
