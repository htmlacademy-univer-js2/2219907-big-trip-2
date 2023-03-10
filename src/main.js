import TripEventPresenter from './presenter/trip-events-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import { tripPoints } from './mock/data.js';

const Presenter = new TripEventPresenter();
const tripPointsModel = new TripPointsModel(tripPoints);
Presenter.init(tripPointsModel);
