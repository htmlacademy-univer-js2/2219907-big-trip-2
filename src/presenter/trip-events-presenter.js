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
import { render, RenderPosition } from '../render.js';

export default class TripEventPresenter {
  init() {
    const tripMain = document.body.querySelector('.trip-main');
    const navigation = tripMain.querySelector('.trip-controls__navigation');
    const filters = tripMain.querySelector('.trip-controls__filters');
    const tripEvents = document.body.querySelector('.trip-events');
    const pointList = new PointListView();

    render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
    render(new NavigationView(), navigation);
    render(new FilterView(), filters);
    render(new SortView(), tripEvents);
    render(pointList, tripEvents);

    render(new NewPointView(), pointList.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), pointList.getElement());
    }
    render(new EditPointView(), pointList.getElement());
  }
}
