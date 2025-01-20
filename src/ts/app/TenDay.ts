import type {
  IForecastForDays,
  TDays,
  TOnCardButtonClick,
  IRequestData,
} from './types';

import { fetchForecast } from './api/fetchForecast';

import { ru } from 'date-fns/locale';
import { parseISO, isToday, format } from 'date-fns';
import { handleRequest, highlightButton } from './utils';

export default function TenDay(
  onCardButtonClick: TOnCardButtonClick,
  selectedCardButton: (button: HTMLButtonElement) => void
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

  function renderCards(days: TDays) {
    clear();

    days.forEach((day) => {
      const { datetime, icon, conditions, tempmin, tempmax } = day;

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

      const date = parseISO(datetime);

      const weekday = format(date, 'eeeeee', { locale: ru });
      weekdayElement.textContent = weekday;

      const dayData = format(date, 'd', { locale: ru });
      const month = format(date, 'MMM', { locale: ru }).slice(0, -1);
      dayElement.textContent = `${dayData} ${month}`;
      dayElement.dateTime = datetime;
      cardButtonElement.dataset.date = datetime;

      const iconName = icon;
      import(`../../assets/img/forecast/${iconName}.svg`).then(
        (res) => (iconElement.src = res.default)
      );
      iconElement.alt = conditions;

      const tempmaxRounded = Math.round(tempmax);
      const tempminRounded = Math.round(tempmin);

      highestTempElement.textContent = `${tempmaxRounded}°`;
      lowestTempElement.textContent = `${tempminRounded}°`;

      if (isToday(date)) {
        selectedCardButton(cardButtonElement);
        highlightButton(cardButtonElement);
      }

      forecastList.appendChild(cardButtonElement);
    });

    forecastList.addEventListener('click', onCardButtonClick);
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
      render: renderCards,
    });
  }
  return { forecastElement, getForecast, clear };
}
