import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';

import TripPointPresenter from './trip-point-presenter.js';
import TripNewPointPresenter from './trip-new-point-presenter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortingBy, SortType } from '../utils/sort.js';
import { filterBy, FilterState } from '../utils/filter.js';
import { TimeLimit, UpdateType, UserAction } from '../const.js';

export default class TripPresenter {
  #tripEventsContainer = document.body.querySelector('.trip-events');
  #newPointButtonContainer = document.body.querySelector('.trip-main__event-add-btn');

  #tripPointPresenters = new Map();
  #tripPointsListComponent = new PointListView();
  #tripNewPointPresenter = null;
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
  #isNewPoint = false;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(tripPointsModel, tripDestinationsModel, tripOffersModel, tripFiltersModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripDestinationsModel = tripDestinationsModel;
    this.#tripOffersModel = tripOffersModel;
    this.#tripFiltersModel = tripFiltersModel;
  }

  init() {
    this.#tripFiltersModel.addObserver(this.#modelEventHandler);
    this.#tripPointsModel.addObserver(this.#modelEventHandler);
    this.#renderTripPresenter();
  }

  #setNewPointClickHandler() {
    this.#newPointButtonContainer.addEventListener('click', this.#newPointClickHandler);
  }

  #renderTripPresenter = () => {
    if (this.#isLoading) {
      this.#newPointButtonContainer.disabled = true;
      this.#renderLoading();
      return;
    }

    this.#updateTripPoints();
    this.#destinations = this.#tripDestinationsModel.destinations;
    this.#offersByType = this.#tripOffersModel.offersByType;

    if (this.#EmptyCheck()) {
      this.#renderSort();
      this.#renderTripPoints();
    }
  };

  #renderLoading = () => render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

  #updateTripPoints() {
    this.#tripPoints = this.#tripPointsModel.tripPoints;
    this.#tripPoints = filterBy[this.#tripFiltersModel.filterState](this.#tripPoints);
    sortingBy[this.#currentSortType](this.#tripPoints);
  }

  #clearTripPresenter = ({resetSortType = false} = {}) => {
    if (this.#tripNewPointPresenter) {
      this.#tripNewPointPresenter.destroy();
    }
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

  #EmptyCheck = () => {
    if (this.#tripPoints.length !== 0 || this.#isNewPoint) {
      return true;
    }
    this.#emptyComponent.changeState(this.#tripFiltersModel.filterState);
    render(this.#emptyComponent, this.#tripEventsContainer);
    return false;
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeHandler(this.#sortTypeHandler);
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderTripPoints() {
    render(this.#tripPointsListComponent, this.#tripEventsContainer);
    for (const tripPoint of this.#tripPoints) {
      const tripPointPresenter = new TripPointPresenter(this.#tripPointsListComponent, this.#destinations, this.#offersByType, this.#changeDataHandler, this.#stateChangeHandler);
      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);
      tripPointPresenter.init(tripPoint);
    }
  }

  #sortTypeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripPresenter();
    this.#renderTripPresenter();
  };

  #stateChangeHandler = () => {
    if (this.#tripNewPointPresenter) {
      this.#tripNewPointPresenter.destroy();
    }
    this.#tripPointPresenters.forEach((presenter) => presenter.resetView());
  };

  #changeDataHandler = async (userAction, updateType, tripPoint) => {
    this.#uiBlocker.block();
    switch (userAction) {
      case UserAction.ADD:
        this.#tripNewPointPresenter.setSaving();
        try {
          await this.#tripPointsModel.addTripPoint(updateType, tripPoint);
        } catch(err) {
          this.#tripNewPointPresenter.setAborting();
        }
        break;
      case UserAction.EDIT:
        this.#tripPointPresenters.get(tripPoint.id).setSaving();
        try {
          await this.#tripPointsModel.editTripPoint(updateType, tripPoint);
        } catch(err) {
          this.#tripPointPresenters.get(tripPoint.id).setAborting();
        }
        break;
      case UserAction.DELETE:
        this.#tripPointPresenters.get(tripPoint.id).setDeleting();
        try {
          await this.#tripPointsModel.deleteTripPoint(updateType, tripPoint);
        } catch(err) {
          this.#tripPointPresenters.get(tripPoint.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
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
        this.#newPointButtonContainer.disabled = false;
        this.#setNewPointClickHandler();
        remove(this.#loadingComponent);
        this.#renderTripPresenter();
        break;
    }
  };

  #newPointClickHandler = (evt) => {
    evt.preventDefault();
    this.#currentSortType = SortType.DAY;
    this.#isNewPoint = true;
    this.#tripFiltersModel.setFilterState(UpdateType.MAJOR, FilterState.EVERYTHING);
    this.#tripNewPointPresenter = new TripNewPointPresenter(this.#tripPointsListComponent, this.#changeDataHandler);
    this.#tripNewPointPresenter.init(this.#destinations, this.#offersByType, this.#newPointCloseHandler);
    this.#newPointButtonContainer.disabled = true;
  };

  #newPointCloseHandler = () => {
    this.#isNewPoint = false;
    this.#newPointButtonContainer.disabled = false;
    this.#EmptyCheck();
  };
}
