import TripPresenter from './presenter/trip-presenter.js';
import TripPointsModel from './model/trip-points-model.js';


const presenter = new TripPresenter();
const tripPointsModel = new TripPointsModel();
tripPointsModel.init(10, 7);
presenter.init(tripPointsModel);
