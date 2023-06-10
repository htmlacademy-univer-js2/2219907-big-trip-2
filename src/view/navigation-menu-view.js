import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createNavigationTemplate = () => (`
<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
  <a class="trip-tabs__btn" href="#">Stats</a>
</nav>
`);

export default class NavigationView extends AbstractStatefulView {
  get template() {
    return createNavigationTemplate;
  }
}
