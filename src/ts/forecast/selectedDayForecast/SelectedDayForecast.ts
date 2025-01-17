import type { ISelectedDayForecast, IDay } from '../types';
import type { IRequestData } from '../api/fetchForecast';

import HourlyForecast from './HourlyForecast';

import fetchForecast from '../api/fetchForecast';

import { ru } from 'date-fns/locale';
import { parseISO, isToday, format } from 'date-fns';
import { capitalize } from '../utils';

export default function SelectedDayForecast(): ISelectedDayForecast {
  const forecastElement = document.querySelector('.selected-day-forecast');
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

  function render(address: string, day: IDay) {
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
    } = day;

    addressElement.textContent = address;

    const date = parseISO(datetime);
    const dayString = format(date, "d MMMM',' eeee", { locale: ru });

    dayElement.textContent = dayString;

    const roundedTemp = Math.round(temp);
    tempElement.textContent = `${roundedTemp}°`;

    import(`../../../assets/img/forecast/${icon}.svg`).then(
      (res) => (iconElement.src = res.default)
    );
    iconElement.alt = conditions;

    const normilizedConditionsString = capitalize(
      conditions.toLocaleLowerCase()
    );
    conditionsElement.textContent = normilizedConditionsString;

    const roundedFeelsLike = Math.round(feelslike);
    feelsLikeTempElement.textContent = `${roundedFeelsLike}°`;

    const roundedWindspeed = Math.round(windspeed / 3.6);
    windTextElement.textContent = `${roundedWindspeed} м/с`;

    const roundedWinddir = Math.round(winddir);
    windDirectionIconElement.style.transform = `rotate(${roundedWinddir}deg)`;
    windDirectionIconElement.alt = 'Иконка, указывающая направление ветра';

    const roundedHumidity = Math.round(humidity);
    humidityTextElement.textContent = `${roundedHumidity}%`;

    const pressureInMercury = pressure / 1.333;
    const roundedPressure = Math.round(pressureInMercury);
    pressureTextElement.textContent = `${roundedPressure} мм.рт.ст.`;
  }

  async function getForecast(address: string, dateISO: string) {
    const date = isToday(parseISO(dateISO)) ? 'next1days' : dateISO;

    const request: IRequestData = {
      address,
      date,
      params:
        'elements=temp,feelslike,humidity,pressure,windspeed,winddir,datetime,icon,conditions',
    };

    const data = await fetchForecast(request);

    const { resolvedAddress, days } = data;
    render(resolvedAddress, days[0]);

    if (days[0].hours) {
      hourlyForecast.renderCards(days);
      return;
    }

    hourlyForecast.renderHint();
  }

  const hourlyForecast = HourlyForecast();

  return { getForecast };
}
