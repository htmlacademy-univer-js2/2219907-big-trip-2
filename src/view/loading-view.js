import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createLoadingTemplate = () => (`
<p class="trip-events__msg">Loading...</p>
`);

export default class LoadingView extends AbstractStatefulView {
  get template() {
    return createLoadingTemplate;
  }
}
