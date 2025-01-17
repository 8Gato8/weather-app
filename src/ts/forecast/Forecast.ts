import type { TDays } from './types';
import type { IRequestData } from './api/fetchForecast';

import fetchForecast from './api/fetchForecast';

import SelectedDayForecast from './selectedDayForecast/SelectedDayForecast';

import { ru } from 'date-fns/locale';
import { getDay, setDate, parseISO, format } from 'date-fns';
import { show, hide } from './utils';

export default function Forecast() {
  const selectTenDayForecast = document.querySelector(
    '#select-ten-day-forecast'
  );
  const selectThirtyDayForecast = document.querySelector(
    '#select-thirty-day-forecast'
  );

  let selectedCard: HTMLButtonElement | null = null;

  const today = new Date();
  const todayISO = format(today, 'yyyy-MM-dd', { locale: ru });

  function onCardButtonClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    const button = target.closest('.forecast-card-button') as HTMLButtonElement;

    if (button === null) return;

    if (selectedCard !== null) {
      selectedCard.classList.remove('forecast-card-button_selected');
    }

    selectedCard = button;
    selectedCard.classList.add('forecast-card-button_selected');

    selectedDay.getForecast('Irkutsk', button.dataset.date);
  }

  function TenDay() {
    const loader = document.querySelector(
      '#ten-day-loader'
    ) as HTMLImageElement;

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
        params:
          'include=days&elements=tempmin,tempmax,datetime,icon,conditions',
      };

      let data = null;

      try {
        hide(forecastList);
        show(loader);

        data = await fetchForecast(request);
      } catch (err) {
        console.log(err.message);
      } finally {
        hide(loader);
        show(forecastList);
      }

      renderCards(data.days);
    }
    return { forecastElement, getForecast, clear };
  }

  function ThirtyDay() {
    const loader = document.querySelector(
      '#thirty-day-loader'
    ) as HTMLImageElement;

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

    function renderCards(days: TDays) {
      let rowIndex = 0;
      let dayCount = 0;

      const daysBeforeToday = days.slice(0, priorDays);

      days.forEach((day) => {
        dayCount++;

        const { datetime, icon, tempmax, tempmin, conditions } = day;

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

        const date = parseISO(datetime);
        const dayData = format(date, 'd', { locale: ru });
        const month = format(date, 'MMM', { locale: ru }).slice(0, -1);
        dayElement.textContent = `${dayData} ${month}`;
        dayElement.dateTime = datetime;
        cardButtonElement.dataset.date = datetime;

        import(`../../assets/img/forecast/${icon}.svg`).then(
          (res) => (iconElement.src = res.default)
        );
        iconElement.alt = conditions;

        const tempmaxRounded = Math.round(tempmax);
        const tempminRounded = Math.round(tempmin);

        highestTempElement.textContent = `${tempmaxRounded}°`;
        lowestTempElement.textContent = `${tempminRounded}°`;

        forecastRowNodeList[rowIndex].appendChild(forecastColElement);

        if (dayCount % 7 === 0) rowIndex++;
      });

      forecastBody.addEventListener('click', onCardButtonClick);
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
        params:
          'include=days&elements=tempmin,tempmax,datetime,icon,conditions',
      };

      let data = null;

      try {
        hide(forecastTable);
        show(loader);

        data = await fetchForecast(request);
      } catch (err) {
        console.log(err.message);
      } finally {
        hide(loader);
        show(forecastTable);
      }

      renderCards(data.days);
    }
    return { forecastElement, getForecast, clear };
  }

  const selectedDay = SelectedDayForecast();
  const tenDay = TenDay();
  const thirtyDay = ThirtyDay();

  selectTenDayForecast.addEventListener('click', () => {
    selectThirtyDayForecast.classList.remove('select-period__button_selected');
    selectTenDayForecast.classList.add('select-period__button_selected');

    thirtyDay.clear();
    hide(thirtyDay.forecastElement);

    tenDay.getForecast('Irkutsk');
    show(tenDay.forecastElement);
  });

  selectThirtyDayForecast.addEventListener('click', () => {
    selectTenDayForecast.classList.remove('select-period__button_selected');
    selectThirtyDayForecast.classList.add('select-period__button_selected');

    tenDay.clear();
    hide(tenDay.forecastElement);

    thirtyDay.getForecast('Irkutsk');
    show(thirtyDay.forecastElement);
  });

  selectedDay.getForecast('Irkutsk', todayISO);
  tenDay.getForecast('Irkutsk');
}
