import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../utils/sort.js';
import { capitalizeFirstLetter } from '../utils/trip.js';

const DISABLED_TYPES = [SortType.EVENT, SortType.OFFER];

function createSortTemplate(sortType) {
  const sortTemplate = Object.values(SortType).map((type) => `<div class="trip-sort__item  trip-sort__item--${type}">
  <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${type}" value="sort-${type}" ${sortType === type ? 'checked' : ''} ${DISABLED_TYPES.includes(type) ? 'disabled' : ''}>
  <label class="trip-sort__btn" for="sort-${type}">${capitalizeFirstLetter(type)}</label>
</div>`).join('');

  return`
<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortTemplate}
</form>
`;}

export default class SortView extends AbstractView {
  #sortType;

  constructor(sortType=SortType.DAY) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }

  setSortTypeHandler = (callback) => {
    this._callback.changeSort = callback;
    this.element.addEventListener('click', this.#sortTypeHandler);
  };

  #sortTypeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.changeSort(evt.target.dataset.sortType);
  };
}
