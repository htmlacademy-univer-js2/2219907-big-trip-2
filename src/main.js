import TripPresenter from './presenter/trip-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import TripDestinationsModel from './model/trip-destinations-model.js';
import TripOffersModel from './model/trip-offers-model.js';
import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripFiltersPresenter from './presenter/trip-filters-presenter.js';
import TripFiltersModel from './model/trip-filters-model.js';
import TripPointsApiService from './api-service/trip-points-api-service.js';

const AUTHORIZATION = 'Basic 3cdher6jpen0n8fl';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';


const tripPointsModel = new TripPointsModel({
  tripPointsApiService: new TripPointsApiService(END_POINT, AUTHORIZATION)
});
const tripDestinationsModel = new TripDestinationsModel();
const tripOffersModel = new TripOffersModel();
const tripFiltersModel = new TripFiltersModel();

tripDestinationsModel.init(7);
tripOffersModel.init();
tripPointsModel.init(10, tripDestinationsModel.Destinations, tripOffersModel.OffersByType);

const tripPresenter = new TripPresenter();
const tripHeaderPresenter = new TripHeaderPresenter();
const tripFiltersPresenter = new TripFiltersPresenter();

tripPresenter.init(tripPointsModel, tripDestinationsModel, tripOffersModel);
tripHeaderPresenter.init(tripPointsModel);
tripFiltersPresenter.init(tripFiltersModel);

tripFiltersModel.addObserver(tripPresenter.filterChange);
tripPointsModel.addObserver(tripPresenter.changeDataHandler);
tripPointsModel.addObserver(tripHeaderPresenter.totalPriceHandler);
