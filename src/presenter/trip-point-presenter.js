import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import { isEscape } from '../utils/trip.js';
import { UserActions, TripPointStates, UpdateType } from '../const.js';
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
  #state = TripPointStates.Point;

  constructor(tripPointsListComponent, destinations, offersByType, changeData, changeState) {
    this.#tripPointsListComponent = tripPointsListComponent;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handleChangeData = changeData;
    this.#handleChangeState = changeState;
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

    if (this.#state === TripPointStates.Point) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    } else if ( this.#state === TripPointStates.Edit)  {
      replace(this.#tripPointComponent, prevEditComponent);
      this.#state = TripPointStates.Point;
    }

    remove(prevTripPointComponent);
    remove(prevEditComponent);
  }

  setSaving() {
    if (this.#state === TripPointStates.Edit) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#state === TripPointStates.Edit) {
      this.#editComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#state === TripPointStates.Point) {
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

  #setPointHandlers = () => {
    this.#tripPointComponent.setToEditClickHandler(this.#handleToEditClick);
    this.#tripPointComponent.setfavoriteClickHandler(this.#changeFavoriteHandler);
    this.#editComponent.setToPointClickHandler(this.#handleToPointClick);
    this.#editComponent.setSubmitHandler(this.#handleSubmitClick);
    this.#editComponent.setDeleteHandler(this.#handleDeleteClick);
  };

  #handleToEditClick = () => {
    replace(this.#editComponent, this.#tripPointComponent);
    this.#handleChangeState();
    this.#state = TripPointStates.Edit;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #changeFavoriteHandler = () => {
    const editedPoint = {
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    };
    this.#handleChangeData(UserActions.EDIT, UpdateType.PATCH, editedPoint);
  };

  #handleToPointClick = () => {
    this.resetView();
  };

  #handleSubmitClick = (tripPoint) => {
    this.#handleChangeData(UserActions.EDIT, UpdateType.MINOR, tripPoint);
    this.#replaceEditToPoint();
  };

  #handleDeleteClick = (tripPoint) => {
    this.#handleChangeData(UserActions.DELETE, UpdateType.MINOR, tripPoint);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  #replaceEditToPoint = () => {
    replace(this.#tripPointComponent, this.#editComponent);
    this.#state = TripPointStates.Point;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  resetView = () => {
    if (this.#state !== TripPointStates.Point) {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    }
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#editComponent);
  };
}
