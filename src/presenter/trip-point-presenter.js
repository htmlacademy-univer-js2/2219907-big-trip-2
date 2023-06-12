import {remove, render, replace} from '../framework/render.js';
// import LoadingView from '../view/loading-view.js';

import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { isEscape } from '../utils/common.js';

const States = {
  Point: 'point',
  Edit: 'edit',
  Null: 'null'
};

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
  #state = States.Null;
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

  init(tripPoint) {
    this.#tripPoint = tripPoint;
    this.#renderTripPoint();
  }

  #renderTripPoint() {
    this.#editComponent = new EditPointView(
      this.#tripPoint,
      this.#destinations,
      this.#offersByType
    );
    this.#tripPointComponent = new PointView(
      this.#tripPoint,
      this.#destinations,
      this.#offersByType
    );

    this.#setPointHandlers();
    this.#setEditHandlers();

    if (this.#prevTripPointComponent) {
      if (this.#state === States.Edit) {
        replace(this.#editComponent, this.#prevEditComponent);
      } else if (this.#state === States.Point) {
        replace(this.#tripPointComponent, this.#prevTripPointComponent);
      }
      remove(this.#prevEditComponent);
      remove(this.#prevTripPointComponent);
    }

    if (this.#state === States.Null) {
      render(this.#tripPointComponent, this.#tripPointsContainer.element);
      this.#state = States.Point;
    }
    this.#prevEditComponent = this.#editComponent;
    this.#prevTripPointComponent = this.#tripPointComponent;
  }

  #changeFavoriteHandler = () => {
    const editedPoint = {
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    };
    this.#changeData(editedPoint, this);
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
    this.#state = States.Edit;
  };

  #replaceEditToPoint = () => {
    replace(this.#tripPointComponent, this.#editComponent);
    this.#state = States.Point;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #setEditHandlers = () => {
    this.#editComponent.setClickHandler(() => {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    });

    this.#editComponent.setSubmitHandler((tripPoint) => {
      this.#changeData(tripPoint);
      this.#replaceEditToPoint();
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
    if (this.#state === States.Edit) {
      this.#editComponent.reset(this.#tripPoint);
      this.#replaceEditToPoint();
    }
  }

  removePresenter() {
    remove(this.#tripPointComponent);
    remove(this.#editComponent);
  }
}
