import type {
  IForecastForDays,
  IForecastData,
  TDays,
  TOnCardButtonClick,
  IRequestData,
  TFormatDaysData,
} from './types';

import { fetchForecast } from './api/fetchForecast';
import { isToday } from 'date-fns';
import { handleRequest, highlightButton } from './utils';

export default function TenDay(
  onCardButtonClick: TOnCardButtonClick,
  setSelectedCardButton: (button: HTMLButtonElement) => void,
  formatDaysData: TFormatDaysData
): IForecastForDays {
  const loader = document.querySelector('#ten-day-loader') as HTMLImageElement;
  const error = document.querySelector(
    '#ten-day-error'
  ) as HTMLParagraphElement;

  const forecastElement = document.querySelector(
    '.ten-day-forecast'
  ) as HTMLElement;
  const forecastList = document.querySelector(
    '.ten-day-forecast__list'
  ) as HTMLUListElement;
  const cardTemplate = document.querySelector(
    '#ten-day-forecast-card-template'
  ) as HTMLTemplateElement;

  function createCards(days: TDays) {
    days.forEach((day) => {
      const formattedData = formatDaysData(day, { weekday: true });

      const {
        date,
        datetime,
        weekday,
        dayData,
        month,
        icon,
        conditions,
        tempmin,
        tempmax,
      } = formattedData;

      const clone = cardTemplate.content.cloneNode(true) as DocumentFragment;
      const cardButtonElement = clone.querySelector(
        '.ten-day-forecast__card-button'
      ) as HTMLButtonElement;
      const cardElement = cardButtonElement.querySelector('.ten-day-card');
      const weekdayElement = cardElement.querySelector(
        '.ten-day-card__week-day'
      );
      const dayElement = cardElement.querySelector(
        '.ten-day-card__day'
      ) as HTMLTimeElement;
      const iconElement = cardElement.querySelector(
        '.ten-day-card__icon'
      ) as HTMLImageElement;

      const highestTempElement = cardElement.querySelector(
        '#ten-day-card-highest-temp'
      );
      const lowestTempElement = cardElement.querySelector(
        '#ten-day-card-lowest-temp'
      );

      weekdayElement.textContent = weekday;
      dayElement.textContent = `${dayData} ${month}`;
      dayElement.dateTime = datetime;
      cardButtonElement.dataset.date = datetime;

      import(`../../assets/img/forecast/${icon}.svg`).then(
        (res) => (iconElement.src = res.default)
      );
      iconElement.alt = conditions;

      highestTempElement.textContent = `${tempmax}°`;
      lowestTempElement.textContent = `${tempmin}°`;

      if (isToday(date)) {
        setSelectedCardButton(cardButtonElement);
        highlightButton(cardButtonElement);
      }

      forecastList.appendChild(cardButtonElement);
    });
  }

  function handleCardsCreation(data: IForecastData) {
    clear();

    const days = data.days;

    createCards(days);
  }

  function clear() {
    while (forecastList.hasChildNodes()) {
      forecastList.removeChild(forecastList.lastChild);
    }
  }

  async function getForecast(address: string) {
    const request: IRequestData = {
      address,
      date: 'next9days',
      params: 'include=days&elements=tempmin,tempmax,datetime,icon,conditions',
    };

    handleRequest({
      parentElement: forecastList,
      loader,
      error,
      request,
      fetchForecast,
      handleCardsCreation,
    });
  }

  forecastList.addEventListener('click', onCardButtonClick);
  return { forecastElement, getForecast, clear };
}
