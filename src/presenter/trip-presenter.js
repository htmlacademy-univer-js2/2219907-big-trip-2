import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';

import TripPointPresenter from './trip-point-presenter.js';
import TripNewPointPresenter from './trip-new-point-presenter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { sortingBy, SortType } from '../utils/sort.js';
import { filterBy, FilterStates } from '../utils/filter.js';
import { UpdateType, UserActions } from '../const.js';

export default class TripPresenter {
  #tripEventsContainer = document.body.querySelector('.trip-events');
  #newPointButtonContainer = document.body.querySelector('.trip-main__event-add-btn');

  #tripPointPresenters = new Map();
  #tripPointsListComponent = new PointListView();
  #tripNewPointPresenter = new TripNewPointPresenter(this.#tripPointsListComponent, this.#handleChangeData);
  #loadingComponent = new LoadingView();
  #sortComponent = new SortView();
  #emptyComponent = new EmptyView();

  #tripPointsModel;
  #tripDestinationsModel;
  #tripOffersModel;
  #tripFiltersModel;

  #tripPoints = null;
  #destinations = null;
  #offersByType = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;

  constructor(tripPointsModel, tripDestinationsModel, tripOffersModel, tripFiltersModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripDestinationsModel = tripDestinationsModel;
    this.#tripOffersModel = tripOffersModel;
    this.#tripFiltersModel = tripFiltersModel;
  }

  init() {

    this.#renderTripPresenter();
  }

  #setNewPointClickHandler() {
    this.#newPointButtonContainer.addEventListener('click', this.#handleNewPointClick);
  }

  #handleNewPointClick = (evt) => {
    evt.preventDefault();
    this.#currentSortType = SortType.DAY;
    this.#tripFiltersModel.setFilterState(UpdateType.MAJOR, FilterStates.EVERYTHING);
    this.#tripNewPointPresenter.init(this.#destinations, this.#offersByType, this.#handleNewPointClose);
    this.#newPointButtonContainer.disabled = true;
  };

  #handleNewPointClose = () => (this.#newPointButtonContainer.disabled = false);

  #renderTripPresenter = () => {
    if (this.#isLoading) {
      this.#newPointButtonContainer.disabled = true;
      this.#renderLoading();
      return;
    }

    this.#updateTripPoints();
    this.#destinations = this.#tripDestinationsModel.Destinations;
    this.#offersByType = this.#tripOffersModel.OffersByType;

    if (this.#EmptyCheck()) {
      this.#renderSort();
      this.#renderTripPoints();
    }
  };

  #renderLoading = () => render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

  #updateTripPoints() {
    this.#tripPoints = filterBy[this.#tripFiltersModel.FilterState](this.#tripPoints);
    sortingBy[SortType.DAY](this.#tripPoints);
  }

  #clearTripPresenter = ({resetSortType = false} = {}) => {
    this.#tripNewPointPresenter.destroy();
    this.#tripPointPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #EmptyCheck = (filterState = FilterStates.EVERYTHING) => {
    if (this.#tripPoints.length !== 0) {
      return true;
    }
    remove(this.#tripPointsListComponent);
    this.#emptyComponent.changeState(filterState);
    render(this.#emptyComponent, this.#tripEventsContainer);
    return false;
  };

  #renderSort = () => {
    this.#sortComponent = new SortView();
    this.#sortComponent.setSortTypeHandler(this.#handleSortType);
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #handleSortType = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripPresenter();
    this.#renderTripPresenter();
  };

  #renderTripPoints() {
    render(this.#tripPointsListComponent, this.#tripEventsContainer);
    for (const tripPoint of this.#tripPoints) {
      const tripPointPresenter = new TripPointPresenter(this.#tripPointsListComponent, this.#destinations, this.#offersByType, this.#handleChangeData, this.#handleStateChange);
      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);
      tripPointPresenter.init(tripPoint);
    }
  }

  #handleStateChange = () => {
    // this.#tripNewPointPresenter.destroy();
    this.#tripPointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleChangeData = (userAction, updateType, tripPoint) => {
    switch (userAction) {
      case UserActions.ADD:
        this.#tripPointsModel.addTripPoint(updateType, tripPoint);
        break;
      case UserActions.EDIT:
        this.#tripPointsModel.editTripPoint(updateType, tripPoint);
        break;
      case UserActions.DELETE:
        this.#tripPointsModel.deleteTripPoint(updateType, tripPoint);
        break;
    }
  };

  handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripPresenter();
        this.#renderTripPresenter();
        break;
      case UpdateType.MAJOR:
        this.#clearTripPresenter({resetSortType: true});
        this.#renderTripPresenter();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#handleNewPointClose();
        this.#setNewPointClickHandler();
        remove(this.#loadingComponent);
        this.#renderTripPresenter();
        break;
    }
  };
}
