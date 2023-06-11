import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NewPointView from '../view/new-point-view.js';
import EmptyView from '../view/empty-view.js';

import {render, RenderPosition} from '../framework/render.js';
import TripPointPresenter from './trip-point-presenter.js';
import TripHeaderPresenter from './trip-header-presenter.js';


export default class TripPresenter {
  #tripPointsModel;
  #tripPointsContainer;
  #tripEventsContainer;

  #tripPoints;
  #offersByType;
  #destinations;

  #tripPointPresenters;

  constructor() {
    this.#tripPointsModel = null;
    this.#tripPoints = null;
    this.#offersByType = null;
    this.#destinations = null;
    this.#tripPointsContainer = new PointListView();
    this.#tripEventsContainer = document.body.querySelector('.trip-events');
    this.#tripPointPresenters = new Map();
  }

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = this.#tripPointsModel.TripPoints;
    this.#offersByType = this.#tripPointsModel.offersByType;
    this.#destinations = this.#tripPointsModel.destinations;

    this.#renderHeader();
    this.#renderSort();
    this.#newPointButton();
    this.#renderTripPointsList();
    this.#renderTripPoints();
  }

  #renderHeader() {
    const header = new TripHeaderPresenter();
    header.init();
  }

  #renderSort() {
    render(new SortView(), this.#tripEventsContainer);
  }

  #renderTripPointsList() {
    render(this.#tripPointsContainer, this.#tripEventsContainer);
  }

  #renderTripPoints() {
    if (this.#tripPoints.length === 0) {
      render(new EmptyView(), this.#tripPointsContainer);
    } else {
      for (const tripPoint of this.#tripPoints) {
        const tripPresenter = new TripPointPresenter(this.#tripPointsContainer, this.#destinations, this.#offersByType, this.#changeDataHandler, this.#resetPointPresentersHandler);
        this.#tripPointPresenters.set(tripPoint.id, tripPresenter);
        tripPresenter.init(tripPoint);
      }
    }
  }

  #newPointButton() {
    const newEventButtonHandler = (evt) => {
      evt.preventDefault();
      render(new NewPointView(this.#destinations, this.#offersByType), this.#tripPointsContainer.element, RenderPosition.AFTERBEGIN);
    };

    document.body.querySelector('.trip-main__event-add-btn').addEventListener('click', newEventButtonHandler);
  }

  #changeDataHandler = (editedPoint, pres) => {
    const i = this.#tripPoints.findIndex((item) => item.id === editedPoint.id);
    this.#tripPoints[i] = editedPoint;
    pres.init(editedPoint);
  };

  #resetPointPresentersHandler = () => {
    this.#tripPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
