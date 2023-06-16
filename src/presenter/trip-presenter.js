import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';

import TripPointPresenter from './trip-point-presenter.js';
import TripNewPointPresenter from './trip-new-point-presenter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortingBy, SortType } from '../utils/sort.js';
import { filterBy, FilterStates } from '../utils/filter.js';
import { TimeLimit, UpdateType, UserActions } from '../const.js';

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
    this.#renderTripPresenter();
  }

  #setNewPointClickHandler() {
    this.#newPointButtonContainer.addEventListener('click', this.#handleNewPointClick);
  }

  #handleNewPointClick = (evt) => {
    evt.preventDefault();
    this.#currentSortType = SortType.DAY;
    this.#tripFiltersModel.setFilterState(UpdateType.MAJOR, FilterStates.EVERYTHING);
    this.#clearTripPresenter();
    this.#isNewPoint = true;
    this.#renderTripPresenter();
    this.#tripNewPointPresenter = new TripNewPointPresenter(this.#tripPointsListComponent, this.#handleChangeData);
    this.#tripNewPointPresenter.init(this.#destinations, this.#offersByType, this.#handleNewPointClose);
    this.#newPointButtonContainer.disabled = true;
  };

  #handleNewPointClose = () => {
    this.#isNewPoint = false;
    this.#newPointButtonContainer.disabled = false;
  };

  #renderTripPresenter = () => {
    if (this.#isLoading) {
      this.#newPointButtonContainer.disabled = true;
      this.#renderLoading();
      return;
    }

    this.#updateTripPoints();
    if (this.#tripPoints.length === 0 && this.#tripFiltersModel.FilterState !== FilterStates.EVERYTHING) {
      this.#tripFiltersModel.setFilterState(UpdateType.NONE, FilterStates.EVERYTHING);
      this.#updateTripPoints();
    }
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
    remove(this.#tripPointsListComponent);
    this.#emptyComponent.changeState(this.#tripFiltersModel.filterState);
    render(this.#emptyComponent, this.#tripEventsContainer);
    return false;
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
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
    if (this.#tripNewPointPresenter) {
      this.#tripNewPointPresenter.destroy();
    }
    this.#tripPointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleChangeData = async (userAction, updateType, tripPoint) => {
    this.#uiBlocker.block();
    switch (userAction) {
      case UserActions.ADD:
        this.#tripNewPointPresenter.setSaving();
        try {
          await this.#tripPointsModel.addTripPoint(updateType, tripPoint);
        } catch(err) {
          this.#tripNewPointPresenter.setAborting();
        }
        break;
      case UserActions.EDIT:
        this.#tripPointPresenters.get(tripPoint.id).setSaving();
        try {
          await this.#tripPointsModel.editTripPoint(updateType, tripPoint);
        } catch(err) {
          this.#tripPointPresenters.get(tripPoint.id).setAborting();
        }
        break;
      case UserActions.DELETE:
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
