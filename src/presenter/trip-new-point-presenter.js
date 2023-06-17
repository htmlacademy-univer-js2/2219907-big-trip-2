import EditPointView from '../view/edit-point-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils/trip.js';
import { UserAction, UpdateType } from '../const.js';


export default class TripNewPointPresenter {
  #tripPointsListComponent;
  #editComponent = null;

  #destinations = null;
  #offersByType = null;

  #handleDataChange;
  #handleDestroy = null;

  constructor(tripPointsListComponent, changeData) {
    this.#tripPointsListComponent = tripPointsListComponent;
    this.#handleDataChange = changeData;
  }

  init(destinations, offersByType, destroy) {
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handleDestroy = destroy;

    this.#editComponent = new EditPointView({
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      isNewPoint: true
    });

    this.#editComponent.setSubmitHandler(this.#submitClickHandler);
    this.#editComponent.setDeleteHandler(this.#deleteClickHandler);

    render(this.#editComponent, this.#tripPointsListComponent.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#EscKeyDownHandler);
  }

  setSaving() {
    this.#editComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editComponent.shake(resetFormState);
  }

  destroy = () => {
    if (this.#editComponent === null) {
      return;
    }

    this.#handleDestroy?.();
    remove(this.#editComponent);
    this.#editComponent = null;

    document.removeEventListener('keydown', this.#EscKeyDownHandler);
  };

  #submitClickHandler = (tripPoint) => {
    this.#handleDataChange(UserAction.ADD, UpdateType.MINOR, tripPoint);
  };

  #deleteClickHandler = () => this.destroy();

  #EscKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
