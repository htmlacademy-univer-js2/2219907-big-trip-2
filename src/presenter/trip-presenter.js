import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import { sortingBy, SortType } from '../utils/sort.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filterBy, FilterStates } from '../utils/filter.js';
import { TripPointStates, UserActions } from '../const.js';

export default class TripPresenter {
  #tripPointsModel;
  #tripDestinationsModel;
  #tripOffersModel;
  #tripPointsContainer;
  #tripEventsContainer;
  #newPointButtonContainer;

  #tripPoints;
  #offersByType;
  #destinations;

  #tripPointPresenters;
  #currentSortType;
  #sortComponent;
  #emptyComponent;

  constructor() {
    this.#tripPointsModel = null;
    this.#tripDestinationsModel = null;
    this.#tripOffersModel = null;
    this.#tripPoints = null;
    this.#offersByType = null;
    this.#destinations = null;
    this.#tripPointsContainer = new PointListView();
    this.#tripEventsContainer = document.body.querySelector('.trip-events');
    this.#tripPointPresenters = new Map();
    this.#sortComponent = new SortView();
    this.#currentSortType = SortType.DAY;
    this.#emptyComponent = new EmptyView();
    this.#newPointButtonContainer = document.body.querySelector('.trip-main__event-add-btn');
  }

  init(tripPointsModel, tripDestinationsModel, tripOffersModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripDestinationsModel = tripDestinationsModel;
    this.#tripOffersModel = tripOffersModel;

    this.#tripPoints = this.#tripPointsModel.TripPoints;
    this.#destinations = this.#tripDestinationsModel.Destinations;
    this.#offersByType = this.#tripOffersModel.OffersByType;

    this.#newPointButton();
    this.#renderTripPointsList();
    this.#renderSort();
    this.#EmptyCheck();
    this.#renderTripPoints();
  }

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = new SortView();
    }
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
    sortingBy[SortType.DAY](this.#tripPoints);
    this.#sortComponent.setSortTypeHandler(this.#sortTypeHandler);
  }

  #renderTripPointsList() {
    render(this.#tripPointsContainer, this.#tripEventsContainer);
  }

  #renderTripPoints() {
    for (const tripPoint of this.#tripPoints) {
      const tripPointPresenter = new TripPointPresenter(this.#tripPointsContainer, this.#destinations, this.#offersByType, this.#changeData, this.#resetPointPresentersHandler);
      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);
      tripPointPresenter.init(tripPoint, TripPointStates.Null);
    }
  }

  #newPointButton() {
    const newEventButtonHandler = (evt) => {
      const newPointPresenter = new TripPointPresenter(this.#tripPointsContainer, this.#destinations, this.#offersByType, this.#changeData, this.#newPointCancel);
      evt.preventDefault();
      this.#resetPointPresentersHandler();
      this.filterChange(FilterStates.EVERYTHING);
      this.#tripPointPresenters.set(-1, newPointPresenter);
      newPointPresenter.init({}, TripPointStates.New);
      evt.target.disabled = true;
    };

    this.#newPointButtonContainer.addEventListener('click', newEventButtonHandler);
  }

  #newPointButtonEnable = () => (this.#newPointButtonContainer.disabled = false);

  #newPointCancel = (presenter) => {
    this.#newPointButtonEnable();
    this.#tripPointPresenters.delete(-1);
    presenter.removePresenter();
  };

  #changeData = (userAction, tripPoint) => {
    switch (userAction) {
      case UserActions.ADD:
        this.#tripPointsModel.addTripPoint(tripPoint);
        break;
      case UserActions.EDIT:
        this.#tripPointsModel.editTripPoint(tripPoint);
        break;
      case UserActions.DELETE:
        this.#tripPointsModel.deleteTripPoint(tripPoint);
        break;
    }
  };

  changeDataHandler = () => {
    this.#tripPoints = this.#tripPointsModel.TripPoints;
    this.#clearTripPointsContainer();
    this.#renderSort();
    this.#EmptyCheck();
    this.#renderTripPoints();
    this.#newPointButtonEnable();
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

  #resetSort = () => {
    this.#renderSort();
    this.#clearTripPointsContainer();
    this.#renderTripPoints();
  };

  #clearTripPointsContainer = () => {
    this.#tripPointPresenters.forEach((presenter) => presenter.removePresenter());
    this.#tripPointPresenters.clear();
  };

  filterChange = (filterState) => {
    this.#resetSort();
    this.#tripPoints = filterBy[filterState](this.#tripPointsModel.TripPoints);
    this.#clearTripPointsContainer();
    this.#EmptyCheck();
    this.#renderTripPoints();
  };

  #EmptyCheck = (filterState = FilterStates.EVERYTHING) => {
    remove(this.#emptyComponent);
    if (this.#tripPoints.length !== 0) { return; }
    this.#emptyComponent.changeState(filterState);
    render(this.#emptyComponent, this.#tripEventsContainer);
  };
}
