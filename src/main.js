import TripPointsModel from './model/trip-points-model.js';
import TripDestinationsModel from './model/trip-destinations-model.js';
import TripOffersModel from './model/trip-offers-model.js';
import TripFiltersModel from './model/trip-filter-model.js';

import TripPresenter from './presenter/trip-presenter.js';
import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripFiltersPresenter from './presenter/trip-filters-presenter.js';

import TripPointsApiService from './api-service/trip-points-api-service.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const tripPointsModel = new TripPointsModel(new TripPointsApiService(END_POINT, AUTHORIZATION));
const tripDestinationsModel = new TripDestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const tripOffersModel = new TripOffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const tripFiltersModel = new TripFiltersModel();

const tripPresenter = new TripPresenter(tripPointsModel, tripDestinationsModel, tripOffersModel, tripFiltersModel);
const tripHeaderPresenter = new TripHeaderPresenter(tripPointsModel, tripOffersModel, tripDestinationsModel);
const tripFiltersPresenter = new TripFiltersPresenter(tripPointsModel, tripFiltersModel);

tripPresenter.init();
tripHeaderPresenter.init();
tripFiltersPresenter.init();

tripOffersModel.init().finally(() => {
  tripDestinationsModel.init().finally(() => {
    tripPointsModel.init().finally();
  });
});
