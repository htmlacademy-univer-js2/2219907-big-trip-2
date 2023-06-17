import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { isEscape } from '../utils/trip.js';
import { UserAction, TripPointState, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';

export default class TripPointPresenter {
  #tripPointsListComponent;

  #tripPoint = null;
  #destinations;
  #offersByType;

  #tripPointComponent = null;
  #editComponent = null;

  #handleChangeData;
  #handleChangeState;
  #state = TripPointState.POINT;

  constructor(tripPointsListComponent, destinations, offersByType, changeDataHandler, changeStateHandler) {
    this.#tripPointsListComponent = tripPointsListComponent;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handleChangeData = changeDataHandler;
    this.#handleChangeState = changeStateHandler;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevEditComponent = this.#editComponent;

    this.#tripPointComponent = new PointView(this.#tripPoint, this.#destinations, this.#offersByType);
    this.#editComponent = new EditPointView({
      tripPoint: this.#tripPoint,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      isNewPoint: false});

    this.#setPointHandlers();

    if (prevTripPointComponent === null) {
      render(this.#tripPointComponent, this.#tripPointsListComponent.element);
      return;
    }

    if (this.#state === TripPointState.POINT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    } else if ( this.#state === TripPointState.EDIT)  {
      replace(this.#tripPointComponent, prevEditComponent);
      this.#state = TripPointState.POINT;
    }

    remove(prevTripPointComponent);
    remove(prevEditComponent);
  }

  setSaving() {
    if (this.#state === TripPointState.EDIT) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#state === TripPointState.EDIT) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#state === TripPointState.POINT) {
      this.#tripPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editComponent.shake(resetFormState);
  }

  resetView = () => {
    if (this.#state !== TripPointState.POINT) {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    }
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#editComponent);
  };

  #setPointHandlers = () => {
    this.#tripPointComponent.setToEditClickHandler(this.#toEditClickHandler);
    this.#tripPointComponent.setfavoriteClickHandler(this.#changeFavoriteHandler);
    this.#editComponent.setToPointClickHandler(this.#toPointClickHandler);
    this.#editComponent.setSubmitHandler(this.#submitClickHandler);
    this.#editComponent.setDeleteHandler(this.#deleteClickHandler);
  };

  #replaceEditToPoint = () => {
    replace(this.#tripPointComponent, this.#editComponent);
    this.#state = TripPointState.POINT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #toEditClickHandler = () => {
    replace(this.#editComponent, this.#tripPointComponent);
    this.#handleChangeState();
    this.#state = TripPointState.EDIT;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #changeFavoriteHandler = () => {
    const editedPoint = {
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    };
    this.#handleChangeData(UserAction.EDIT, UpdateType.PATCH, editedPoint);
  };

  #toPointClickHandler = () => {
    this.resetView();
  };

  #submitClickHandler = (tripPoint) => {
    this.#handleChangeData(UserAction.EDIT, UpdateType.MINOR, tripPoint);
    this.#replaceEditToPoint();
  };

  #deleteClickHandler = (tripPoint) => {
    this.#handleChangeData(UserAction.DELETE, UpdateType.MINOR, tripPoint);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };
}
