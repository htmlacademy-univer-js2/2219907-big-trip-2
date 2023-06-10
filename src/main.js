import TripEventPresenter from './presenter/trip-events-presenter.js';
import TripPointsModel from './model/trip-points-model.js';


const Presenter = new TripEventPresenter();
const tripPointsModel = new TripPointsModel();
tripPointsModel.init(10, 7);
Presenter.init(tripPointsModel);
