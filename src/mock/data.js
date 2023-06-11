import { GetRandomElement, GetRandomPositiveNumber, ShuffleArray } from '../utils/common.js';
import dayjs from 'dayjs';

const OfferTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const offerTitles = ['Order Uber', 'Add luggage', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Book tickets', 'Lunch in city', 'Upgrade to a business class'];
const cityNames = ['Amsterdam', 'Chamonix', 'Geneva'];
const fish = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];
let lastId = 1;

const CreateDates = () => {
  const time1 = dayjs.unix(GetRandomPositiveNumber(1677610800, 1679252400)); // С 1 по 20 марта
  const time2 = time1.add(dayjs.unix(GetRandomPositiveNumber(60 * 10, 3600 * 50))); // От 10 минут до 5 часов

  return [time1, time2];
};

const CreatePicture = () => ({
  'src': `img/photos/${GetRandomPositiveNumber(1, 5)}.jpg`,
  'description': GetRandomElement(fish)
});

export const CreateDestination = () => ({
  'id': lastId++,
  'description': [...Array(GetRandomPositiveNumber(1,5)).keys()].map(() => (GetRandomElement(fish))).join(' '),
  'name': GetRandomElement(cityNames),
  'pictures': Array.from({length: GetRandomPositiveNumber(1, 5)}, CreatePicture)
});

const CreateOffer = () => ({
  'id': lastId++,
  'title': GetRandomElement(offerTitles),
  'price': GetRandomPositiveNumber(10, 1000)
});

const CreateOfferByType = (i) => ({
  'type': OfferTypes[i],
  'offers': Array.from({length: GetRandomPositiveNumber(2, 5)}, CreateOffer)
});

export const CreateOffersByType = () => [...Array(OfferTypes.length).keys()].map((i) => CreateOfferByType(i));

export function CreatePoint() {
  const dates = CreateDates();
  const pointType = GetRandomElement(OfferTypes);
  const offers = this.offersByType.find((offersType) => offersType.type === pointType).offers;
  return {
    'basePrice': GetRandomPositiveNumber(10, 10000),
    'dateFrom': dates[0],
    'dateTo': dates[1],
    'destination': GetRandomElement(this.destinations).id,
    'id': lastId++,
    'isFavorite': Boolean(GetRandomPositiveNumber(0,1)),
    'offers': ShuffleArray(offers).slice(0, GetRandomPositiveNumber(1, offers.length)).map((offer) => offer.id),
    'type': pointType
  };
}
