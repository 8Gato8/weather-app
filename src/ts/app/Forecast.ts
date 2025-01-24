import type {
  TOnCardButtonClick,
  IForecastSelectionParams,
  TFormatDaysData,
} from './types';

import TenDay from './TenDay';
import ThirtyDay from './ThirtyDay';
import SelectedDayForecast from './selectedDayForecast/SelectedDayForecast';

import { ru } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import {
  show,
  hide,
  highlightButton,
  removeHighlightFromButton,
} from './utils';

export default function Forecast() {
  let address: null | string = null;

  const selectTenDayForecast = document.querySelector(
    '#select-ten-day-forecast'
  ) as HTMLButtonElement;
  const selectThirtyDayForecast = document.querySelector(
    '#select-thirty-day-forecast'
  ) as HTMLButtonElement;

  let selectedCardButton: HTMLButtonElement | null = null;
  function setSelectedCardButton(button: HTMLButtonElement) {
    selectedCardButton = button;
  }

  const today = new Date();
  const todayISO = format(today, 'yyyy-MM-dd', { locale: ru });

  const onCardButtonClick: TOnCardButtonClick = function (e) {
    const target = e.target as HTMLElement;

    const button = target.closest('.forecast-card-button') as HTMLButtonElement;

    if (button === null) return;

    if (selectedCardButton !== null) {
      removeHighlightFromButton(selectedCardButton);
    }

    setSelectedCardButton(button);
    highlightButton(selectedCardButton);

    selectedDay.getForecast(address, button.dataset.date);
    document.body.scrollIntoView(true);
  };

  const formatDaysData: TFormatDaysData = function (day, options?) {
    const { datetime, tempmin, tempmax } = day;

    const date = parseISO(datetime);
    const dayData = format(date, 'd', { locale: ru });
    const month = format(date, 'MMM', { locale: ru }).slice(0, -1);

    const formattedData: {
      date: Date;
      dayData: string;
      month: string;
      tempmin: number;
      tempmax: number;
      weekday?: string;
    } = {
      date,
      dayData,
      month,
      tempmin: Math.round(tempmin),
      tempmax: Math.round(tempmax),
    };

    if (options?.weekday) {
      formattedData.weekday = format(date, 'eeeeee', { locale: ru });
    }

    return {
      ...day,
      ...formattedData,
    };
  };

  const selectedDay = SelectedDayForecast();
  const tenDay = TenDay(
    onCardButtonClick,
    setSelectedCardButton,
    formatDaysData
  );
  const thirtyDay = ThirtyDay(
    today,
    onCardButtonClick,
    setSelectedCardButton,
    formatDaysData
  );

  function handleForecastSelection({
    buttonToHighlight,
    buttonToDefault,
    forecastToShow,
    forecastToHide,
    address,
  }: IForecastSelectionParams) {
    buttonToDefault.classList.remove('select-period__button_selected');
    buttonToHighlight.classList.add('select-period__button_selected');

    hide(forecastToHide.forecastElement);

    selectedDay.getForecast(address, todayISO);
    forecastToShow.getForecast(address);
    show(forecastToShow.forecastElement);
  }

  selectTenDayForecast.addEventListener('click', () => {
    handleForecastSelection({
      buttonToHighlight: selectTenDayForecast,
      buttonToDefault: selectThirtyDayForecast,
      forecastToShow: tenDay,
      forecastToHide: thirtyDay,
      address,
    });
  });

  selectThirtyDayForecast.addEventListener('click', () => {
    handleForecastSelection({
      buttonToHighlight: selectThirtyDayForecast,
      buttonToDefault: selectTenDayForecast,
      forecastToShow: thirtyDay,
      forecastToHide: tenDay,
      address,
    });
  });

  function update(newValue: string) {
    address = newValue;
    handleForecastSelection({
      buttonToHighlight: selectTenDayForecast,
      buttonToDefault: selectThirtyDayForecast,
      forecastToShow: tenDay,
      forecastToHide: thirtyDay,
      address,
    });
  }

  return { update };
}
