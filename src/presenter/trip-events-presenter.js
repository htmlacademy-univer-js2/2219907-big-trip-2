import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NavigationView from '../view/navigation-menu-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
// import StatsView from '../view/stats-view.js';
// import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { isEscape } from '../utils/common.js';
import EmptyView from '../view/empty-view.js';
import {render, replace, RenderPosition} from '../framework/render.js';


export default class TripEventPresenter {
  #tripPointsModel;
  #pointsList;
  #tripMain;
  #navigation;
  #filters;
  #tripEvents;
  #tripPoints;
  #offersByType;
  #destinations;

  constructor() {
    this.#tripPointsModel = null;
    this.#tripPoints = null;
    this.#offersByType = null;
    this.#destinations = null;
    this.#pointsList = new PointListView();
    this.#tripMain = document.body.querySelector('.trip-main');
    this.#navigation = this.#tripMain.querySelector('.trip-controls__navigation');
    this.#filters = this.#tripMain.querySelector('.trip-controls__filters');
    this.#tripEvents = document.body.querySelector('.trip-events');
  }

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.#tripPoints = this.#tripPointsModel.TripPoints;
    this.#offersByType = this.#tripPointsModel.offersByType;
    this.#destinations = this.#tripPointsModel.destinations;

    this.#renderHeader();

    if (this.#tripPoints.length === 0) {
      render(new EmptyView(), this.#pointsList);
    } else {
      for (const tripPoint of this.#tripPoints) {
        this.#renderTripPoint(tripPoint);
      }
    }
  }

  #renderTripPoint(tripPoint) {
    const editComponent = new EditPointView(tripPoint, this.#destinations, this.#offersByType);
    const tripPointComponent = new PointView(tripPoint, this.#destinations, this.#offersByType);

    const replacePointToEdit = () => replace(editComponent, tripPointComponent);

    const replaceEditToPoint = () => replace(tripPointComponent, editComponent);

    const escKeyDownHandler = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler  );
      }
    };

    tripPointComponent.setClickHandler(() => {
      replacePointToEdit();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    editComponent.setClickHandler(() => {
      replaceEditToPoint.call(this);
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    editComponent.setSubmitHandler(() => {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(tripPointComponent, this.#pointsList.element);
  }

  #renderHeader() {
    render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
    render(new NavigationView(), this.#navigation);
    render(new FilterView(), this.#filters);
    render(new SortView(), this.#tripEvents);
    render(this.#pointsList, this.#tripEvents);

    const newEventButtonHandler = (evt) => {
      evt.preventDefault();
      render(new NewPointView(this.#destinations, this.#offersByType), this.#pointsList.element, RenderPosition.BEFOREBEGIN);
    };

    this.#tripMain.querySelector('.trip-main__event-add-btn').addEventListener('click', newEventButtonHandler);
  }
}
