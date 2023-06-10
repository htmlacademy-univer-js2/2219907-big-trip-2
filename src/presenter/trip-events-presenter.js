// import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NavigationView from '../view/navigation-menu-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
// import StatsView from '../view/stats-view.js';
// import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';
import { isEscape } from '../util.js';
import EmptyView from '../view/empty-view.js';


export default class TripEventPresenter {
  #tripPointsModel;
  #pointsList;
  #tripMain;
  #navigation;
  #filters;
  #tripEvents;

  constructor() {
    this.#tripPointsModel = null;
    this.#pointsList = new PointListView();
    this.#tripMain = document.body.querySelector('.trip-main');
    this.#navigation = this.#tripMain.querySelector('.trip-controls__navigation');
    this.#filters = this.#tripMain.querySelector('.trip-controls__filters');
    this.#tripEvents = document.body.querySelector('.trip-events');
  }

  init(tripPointsModel) {
    this.#tripPointsModel = tripPointsModel;
    this.tripPoints = this.#tripPointsModel.TripPoints;
    this.offers = this.#tripPointsModel.offers;
    this.destinations = this.#tripPointsModel.destinations;


    render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
    render(new NavigationView(), this.#navigation);
    render(new FilterView(), this.#filters);
    render(new SortView(), this.#tripEvents);
    render(this.#pointsList, this.#tripEvents);

    if (this.tripPoints.lenght === 0) {
      render(new EmptyView(), this.#pointsList);
    } else {
      for (const tripPoint of this.tripPoints) {
        this.#renderTripPoint(tripPoint);
      }
    }
  }

  #renderTripPoint(tripPoint) {
    const editComponent = new EditPointView(tripPoint, this.destinations, this.offers);
    // const newPointComponent = new NewPointView(tripPoint, this.destinations, this.offers);
    const pointComponent = new PointView(tripPoint, this.destinations, this.offers);

    const replacePointToEdit = () => {
      this.#pointsList.element.replaceChild(editComponent.element, pointComponent.element);
    };

    const replaceEditToPoint = () => {
      this.#pointsList.element.replaceChild(pointComponent.element, editComponent.element);
    };

    const onEscEvt = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscEvt  );
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscEvt);
    });

    editComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscEvt);
    });

    editComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscEvt);
    });

    render(pointComponent, this.#pointsList.element);
  }
}
