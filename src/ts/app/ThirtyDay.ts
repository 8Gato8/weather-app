import type {
  IForecastForDays,
  TDays,
  TOnCardButtonClick,
  IRequestData,
  TFormatDaysData,
  IForecastData,
} from './types';

import { fetchForecast } from './api/fetchForecast';

import { setDate, getDay, isToday, format } from 'date-fns';
import { handleRequest, highlightButton } from './utils';
import { DAYS_IN_WEEK } from './constants';

export default function ThirtyDay(
  today: Date,
  onCardButtonClick: TOnCardButtonClick,
  selectedCardButton: (button: HTMLButtonElement) => void,
  formatDaysData: TFormatDaysData
): IForecastForDays {
  const loader = document.querySelector(
    '#thirty-day-loader'
  ) as HTMLImageElement;
  const error = document.querySelector(
    '#thirty-day-error'
  ) as HTMLParagraphElement;

  const forecastElement = document.querySelector(
    '.thirty-day-forecast'
  ) as HTMLElement;
  const forecastTable = forecastElement.querySelector(
    '.thirty-day-forecast__table'
  ) as HTMLTableElement;
  const forecastBody = forecastTable.querySelector('.forecast-table__body');
  const forecastRowNodeList = forecastBody.querySelectorAll(
    '.forecast-table__row'
  );
  const forecastColTemplate = document.querySelector(
    '#forecast-table-col-template'
  ) as HTMLTemplateElement;

  const dayOfTheMonth = today.getDate();

  const weekDayIndex = getDay(today);

  const weekDayNormalizedIndex = normalizeWeekDayIndex(weekDayIndex);

  const priorDays = countPriorDays(weekDayNormalizedIndex);

  function countPriorDays(weekDayNormalizedIndex: number) {
    let priorDays = 0;

    while (priorDays < weekDayNormalizedIndex) {
      priorDays++;
    }

    return priorDays;
  }

  function makeDayColorless(
    cardElement: HTMLDivElement,
    classForColorless: string
  ) {
    cardElement.classList.add(classForColorless);
  }

  function createCards(days: TDays) {
    let rowIndex = 0;
    let dayCount = 0;

    const daysBeforeToday = days.slice(0, priorDays);

    days.forEach((day) => {
      dayCount++;

      const formattedData = formatDaysData(day);

      const {
        date,
        datetime,
        dayData,
        month,
        icon,
        tempmin,
        tempmax,
        conditions,
      } = formattedData;

      const clone = forecastColTemplate.content.cloneNode(
        true
      ) as DocumentFragment;
      const forecastColElement = clone.querySelector(
        '.forecast-table__col'
      ) as HTMLTableCellElement;
      const cardButtonElement = forecastColElement.querySelector(
        '.thirty-day-forecast__card-button'
      ) as HTMLButtonElement;
      const cardElement = cardButtonElement.querySelector(
        '.thirty-day-forecast__card'
      ) as HTMLDivElement;
      const dayElement = cardElement.querySelector(
        '.thirty-day-card__day'
      ) as HTMLTimeElement;
      const iconElement = cardElement.querySelector(
        '.thirty-day-card__icon'
      ) as HTMLImageElement;

      const highestTempElement = cardElement.querySelector(
        '#thirty-day-card-highest-temp'
      );
      const lowestTempElement = cardElement.querySelector(
        '#thirty-day-card-lowest-temp'
      );

      if (daysBeforeToday.includes(day)) {
        makeDayColorless(cardElement, 'thirty-day-card_colorless');
      }

      dayElement.textContent = `${dayData} ${month}`;
      dayElement.dateTime = datetime;
      cardButtonElement.dataset.date = datetime;

      import(`../../assets/img/forecast/${icon}.svg`).then(
        (res) => (iconElement.src = res.default)
      );
      iconElement.alt = conditions;

      highestTempElement.textContent = `${tempmax}°`;
      lowestTempElement.textContent = `${tempmin}°`;

      forecastRowNodeList[rowIndex].appendChild(forecastColElement);

      if (isToday(date)) {
        selectedCardButton(cardButtonElement);
        highlightButton(cardButtonElement);
      }

      if (dayCount % DAYS_IN_WEEK === 0) rowIndex++;
    });
  }

  function handleCardsCreation(data: IForecastData) {
    clear();

    const days = data.days;

    createCards(days);
  }

  function clear() {
    forecastRowNodeList.forEach((row) => {
      while (row.hasChildNodes()) {
        row.removeChild(row.lastChild);
      }
    });
  }

  function normalizeWeekDayIndex(weekDayIndex: number) {
    if (weekDayIndex === 0) return 6;

    return --weekDayIndex;
  }

  function createDatePeriod(priorDays: number, upcomingDays: number) {
    const from = format(
      setDate(today, dayOfTheMonth - priorDays),
      'yyyy-MM-dd'
    );

    const to = format(
      setDate(today, dayOfTheMonth - priorDays + upcomingDays),
      'yyyy-MM-dd'
    );

    const datePeriod = `${from}/${to}`;
    return datePeriod;
  }

  async function getForecast(address: string) {
    const upcomingDays = 34;
    const date = createDatePeriod(priorDays, upcomingDays);

    const request: IRequestData = {
      address,
      date,
      params: 'include=days&elements=tempmin,tempmax,datetime,icon,conditions',
    };

    handleRequest({
      parentElement: forecastTable,
      loader,
      error,
      request,
      fetchForecast,
      handleCardsCreation,
    });
  }
  forecastBody.addEventListener('click', onCardButtonClick);
  return { forecastElement, getForecast, clear };
}
