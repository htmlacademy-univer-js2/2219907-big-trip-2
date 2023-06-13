import {remove, render, RenderPosition, replace} from '../framework/render.js';
// import LoadingView from '../view/loading-view.js';

import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { isEscape } from '../utils/common.js';
import { UserActions, TripPointStates } from '../const.js';


export default class TripPointPresenter {
  #tripPointsContainer;
  #offersByType;
  #destinations;
  #tripPoint;
  #changeData;
  #editComponent;
  #tripPointComponent;
  #prevEditComponent = null;
  #prevTripPointComponent = null;
  #state;
  #resetStates;

  constructor(
    tripPointsContainer,
    destinations,
    offersByType,
    changeData,
    resetStates
  ) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#changeData = changeData;
    this.#resetStates = resetStates;
  }

  init(tripPoint, state) {
    this.#state = state;
    this.#tripPoint = tripPoint;
    if (this.#state === TripPointStates.New) {
      this.#renderNewTripPoint();
      return;
    }
    this.#renderTripPoint();
  }

  #renderNewTripPoint() {
    this.#editComponent = new EditPointView(
      this.#destinations,
      this.#offersByType,
    );

    this.#setNewPointHandlers();
    render(this.#editComponent, this.#tripPointsContainer.element, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoint() {
    this.#editComponent = new EditPointView(
      this.#destinations,
      this.#offersByType,
      this.#tripPoint
    );

    this.#tripPointComponent = new PointView(
      this.#tripPoint,
      this.#destinations,
      this.#offersByType
    );

    this.#setPointHandlers();
    this.#setEditHandlers();

    if (this.#prevTripPointComponent) {
      if (this.#state === TripPointStates.Edit) {
        replace(this.#editComponent, this.#prevEditComponent);
      } else if (this.#state === TripPointStates.Point) {
        replace(this.#tripPointComponent, this.#prevTripPointComponent);
      }
      remove(this.#prevEditComponent);
      remove(this.#prevTripPointComponent);
    }

    if (this.#state === TripPointStates.Null) {
      render(this.#tripPointComponent, this.#tripPointsContainer.element);
      this.#state = TripPointStates.Point;
    }
    this.#prevEditComponent = this.#editComponent;
    this.#prevTripPointComponent = this.#tripPointComponent;
  }

  #changeFavoriteHandler = () => {
    const editedPoint = {
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    };
    this.#changeData(UserActions.EDIT, editedPoint);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#replaceEditToPoint();
      this.#editComponent.reset(this.#tripPoint);
    }
  };

  #replacePointToEdit = () => {
    replace(this.#editComponent, this.#tripPointComponent);
    this.#state = TripPointStates.Edit;
  };

  #replaceEditToPoint = () => {
    replace(this.#tripPointComponent, this.#editComponent);
    this.#state = TripPointStates.Point;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #formCheck(tripPoint) {
    return tripPoint.basePrice > 0 && tripPoint.destination !== -1;
  }

  #setNewPointHandlers = () => {
    this.#editComponent.setSubmitHandler((tripPoint) => {
      if (!this.#formCheck(tripPoint)){
        return;
      }
      this.#changeData(UserActions.ADD, tripPoint);
    });

    this.#editComponent.setDeleteHandler(() => {
      this.#resetStates(this);
    });

    document.addEventListener('keydown', this.#newPointEscKeyDownHandler);
  };

  #newPointEscKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#resetStates(this);
      document.removeEventListener('keydown', this.#newPointEscKeyDownHandler);
    }
  };

  #setEditHandlers = () => {
    this.#editComponent.setClickHandler(() => {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    });

    this.#editComponent.setSubmitHandler((tripPoint) => {
      this.#changeData(UserActions.EDIT, tripPoint);
    });

    this.#editComponent.setDeleteHandler((tripPoint) => {
      this.#changeData(UserActions.DELETE, tripPoint);
    });
  };

  #setPointHandlers = () => {
    this.#tripPointComponent.setClickHandler(() => {
      this.#resetStates();
      this.#replacePointToEdit();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#tripPointComponent.setfavoriteClickHandler(this.#changeFavoriteHandler);
  };

  resetView() {
    if (this.#state === TripPointStates.Edit) {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    }
  }

  removePresenter = () => {
    if (this.#state !== TripPointStates.New) {
      remove(this.#tripPointComponent);
    }
    remove(this.#editComponent);
  };
}
