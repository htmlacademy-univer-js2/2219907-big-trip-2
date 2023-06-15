import dayjs from 'dayjs';
import { ApiMethod } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class TripPointsApiService extends ApiService {
  get tripPoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateTripPoint(tripPoint) {
    const response = await this._load({
      url: `points/${tripPoint.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(tripPoint) {
    const adaptedTripPoint = {...tripPoint,
      'base_price': tripPoint.basePrice,
      'date_from': dayjs(tripPoint.dateFrom).toDate() instanceof Date ? tripPoint.dateFrom.toISOString() : null,
      'date_to': dayjs(tripPoint.dateTo).toDate() instanceof Date ? tripPoint.dateTo.toISOString() : null,
      'is_favorite': tripPoint.isFavorite,
    };

    delete adaptedTripPoint.basePrice;
    delete adaptedTripPoint.dateFrom;
    delete adaptedTripPoint.dateTo;
    delete adaptedTripPoint.isFavorite;

    return adaptedTripPoint;
  }
}
