import type {
  ISelectedDayForecast,
  IDay,
  IRequestData,
  IForecastData,
} from '../types';

import HourlyForecast from './HourlyForecast';

import { fetchForecast } from '../api/fetchForecast';

import { ru } from 'date-fns/locale';
import { parseISO, isToday, format } from 'date-fns';
import { capitalize, handleRequest } from '../utils';

export default function SelectedDayForecast(): ISelectedDayForecast {
  const loader = document.querySelector(
    '#selected-day-loader'
  ) as HTMLImageElement;
  const error = document.querySelector(
    '#selected-day-error'
  ) as HTMLParagraphElement;

  const forecastElement = document.querySelector('.selected-day-forecast');
  const forecastDayContainerElement = document.querySelector(
    '.selected-day-forecast__day-container'
  ) as HTMLDivElement;
  const addressElement = forecastElement.querySelector(
    '.selected-day-forecast__address'
  );
  const dayElement = forecastElement.querySelector(
    '.selected-day-forecast__day'
  );
  const tempElement = forecastElement.querySelector(
    '.selected-day-forecast__temp'
  );
  const iconElement = document.querySelector(
    '.selected-day-forecast__icon'
  ) as HTMLImageElement;
  const conditionsElement = document.querySelector(
    '.main-text-info__conditions'
  );
  const feelsLikeTempElement = document.querySelector('.feels-like__temp');
  const windTextElement = document.querySelector('.wind__text');
  const windDirectionIconElement = document.querySelector(
    '.wind__direction-icon'
  ) as HTMLImageElement;
  const humidityTextElement = document.querySelector('.humidity__text');
  const pressureTextElement = document.querySelector('.pressure__text');

  function convertKphToMps(valueInKph: number) {
    return valueInKph / 3.6;
  }

  function convertMillibarToMercury(valueInMillibar: number) {
    return valueInMillibar / 1.333;
  }

  function formatDayData(day: IDay) {
    const {
      datetime,
      temp,
      conditions,
      feelslike,
      humidity,
      windspeed,
      winddir,
      pressure,
    } = day;

    const date = parseISO(datetime);
    const dayString = format(date, "d MMMM',' eeee", { locale: ru });
    const normilizedConditionsString = capitalize(
      conditions.toLocaleLowerCase()
    );
    const windspeedInMps = convertKphToMps(windspeed);
    const pressureInMercury = convertMillibarToMercury(pressure);

    const formattedData = {
      datetime: dayString,
      temp: Math.round(temp),
      conditions: normilizedConditionsString,
      feelslike: Math.round(feelslike),
      windspeed: Math.round(windspeedInMps),
      winddir: Math.round(winddir),
      humidity: Math.round(humidity),
      pressure: Math.round(pressureInMercury),
    };

    return {
      ...day,
      ...formattedData,
    };
  }

  function createCard(day: IDay, address: string) {
    const formattedData = formatDayData(day);

    const {
      datetime,
      temp,
      icon,
      conditions,
      feelslike,
      humidity,
      windspeed,
      winddir,
      pressure,
    } = formattedData;

    addressElement.textContent = address;

    dayElement.textContent = datetime;

    tempElement.textContent = `${temp}°`;

    import(`../../../assets/img/forecast/${icon}.svg`).then(
      (res) => (iconElement.src = res.default)
    );
    iconElement.alt = conditions;

    conditionsElement.textContent = conditions;

    feelsLikeTempElement.textContent = `${feelslike}°`;

    windTextElement.textContent = `${windspeed} м/с`;

    windDirectionIconElement.style.transform = `rotate(${winddir}deg)`;
    windDirectionIconElement.alt = 'Иконка, указывающая направление ветра';

    humidityTextElement.textContent = `${humidity}%`;
    pressureTextElement.textContent = `${pressure} мм.рт.ст.`;
  }

  function handleCardsCreation(data: IForecastData) {
    const { currentConditions, resolvedAddress, days } = data;

    const firstDay = days[0];

    if (currentConditions) {
      createCard(
        {
          ...currentConditions,
          datetime: firstDay.datetime,
        },
        resolvedAddress
      );
      hourlyForecast.handleCardsCreation(days, currentConditions.datetime);
    } else {
      createCard(firstDay, resolvedAddress);
      hourlyForecast.handleCardsCreation(days);
    }
  }

  async function getForecast(address: string, dateISO: string) {
    const date = isToday(parseISO(dateISO)) ? 'next1days' : dateISO;

    const request: IRequestData = {
      address,
      date,
      params:
        'elements=temp,feelslike,humidity,pressure,windspeed,winddir,datetime,icon,conditions',
    };

    handleRequest({
      parentElement: forecastDayContainerElement,
      error,
      loader,
      request,
      fetchForecast,
      handleCardsCreation,
    });
  }

  const hourlyForecast = HourlyForecast();

  return { getForecast };
}
