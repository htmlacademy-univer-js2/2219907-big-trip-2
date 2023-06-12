import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NewPointView from '../view/new-point-view.js';
import EmptyView from '../view/empty-view.js';
import {render, RenderPosition} from '../framework/render.js';
import TripPointPresenter from './trip-point-presenter.js';
import TripHeaderPresenter from './trip-header-presenter.js';
import { sortingBy, SortType } from '../utils/sort.js';


export default class TripPresenter {
  #tripPointsModel;
  #tripPointsContainer;
  #tripEventsContainer;

  #tripPoints;
  #offersByType;
  #destinations;

  #tripPointPresenters;
  #currentSortType;
  #sortComponent;

  constructor() {
    this.#tripPointsModel = null;
    this.#tripPoints = null;
    this.#offersByType = null;
    this.#destinations = null;
    this.#tripPointsContainer = new PointListView();
    this.#tripEventsContainer = document.body.querySelector('.trip-events');
    this.#tripPointPresenters = new Map();
    this.#sortComponent = new SortView();
    this.#currentSortType = SortType.DAY;
  }

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = this.#tripPointsModel.TripPoints;
    this.#offersByType = this.#tripPointsModel.offersByType;
    this.#destinations = this.#tripPointsModel.destinations;

    this.#renderHeader();
    this.#newPointButton();
    this.#renderTripPointsList();
    if (this.#tripPoints.length === 0) {
      render(new EmptyView(), this.#tripPointsContainer);
    } else {
      this.#renderSort();
      this.#renderTripPoints();
    }
  }

  #renderHeader() {
    const header = new TripHeaderPresenter();
    header.init();
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
    sortingBy[SortType.DAY](this.#tripPoints);
    this.#sortComponent.setSortTypeHandler(this.#sortTypeHandler);
  }

  #renderTripPointsList() {
    render(this.#tripPointsContainer, this.#tripEventsContainer);
  }

  #renderTripPoints() {
    for (const tripPoint of this.#tripPoints) {
      const tripPointPresenter = new TripPointPresenter(this.#tripPointsContainer, this.#destinations, this.#offersByType, this.#changeDataHandler, this.#resetPointPresentersHandler);
      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);
      tripPointPresenter.init(tripPoint);
    }
  }

  #newPointButton() {
    /*    const newPointTripPresenter = new TripPointPresenter(this.#tripPointsContainer, this.#destinations, this.#offersByType, this.#changeDataHandler, this.#resetPointPresentersHandler);
    newPointTripPresenter.init({}); */
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

  #sortTripPoints = (sortType) => {
    sortingBy[sortType](this.#tripPoints);
    this.#currentSortType = sortType;
  };

  #sortTypeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortTripPoints(sortType);
    this.#clearTripPointsContainer();
    this.#renderTripPoints();
  };

  #clearTripPointsContainer = () => {
    this.#tripPointPresenters.forEach((presenter) => presenter.removePresenter());
    this.#tripPointPresenters.clear();
  };
}
