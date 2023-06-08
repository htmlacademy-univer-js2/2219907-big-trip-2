import TripEventPresenter from './presenter/trip-events-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import { destinations, offersByType, tripPoints } from './mock/data.js';

const Presenter = new TripEventPresenter();
const tripPointsModel = new TripPointsModel();
tripPointsModel.init(tripPoints, destinations, offersByType)
Presenter.init(tripPointsModel);
