import type { TOnCardButtonClick } from './types';

import type { IForecastSelectionParams } from './types';

import TenDay from './TenDay';
import ThirtyDay from './ThirtyDay';
import SelectedDayForecast from './selectedDayForecast/SelectedDayForecast';

import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { show, hide } from './utils';

export default function Forecast() {
  let address: null | string = null;

  const selectTenDayForecast = document.querySelector(
    '#select-ten-day-forecast'
  ) as HTMLButtonElement;
  const selectThirtyDayForecast = document.querySelector(
    '#select-thirty-day-forecast'
  ) as HTMLButtonElement;

  let selectedCard: HTMLButtonElement | null = null;

  const today = new Date();
  const todayISO = format(today, 'yyyy-MM-dd', { locale: ru });

  const onCardButtonClick: TOnCardButtonClick = function (e) {
    const target = e.target as HTMLElement;

    const button = target.closest('.forecast-card-button') as HTMLButtonElement;

    if (button === null) return;

    if (selectedCard !== null) {
      selectedCard.classList.remove('forecast-card-button_selected');
    }

    selectedCard = button;
    selectedCard.classList.add('forecast-card-button_selected');

    selectedDay.getForecast(address, button.dataset.date);
  };

  const selectedDay = SelectedDayForecast();
  const tenDay = TenDay(onCardButtonClick);
  const thirtyDay = ThirtyDay(today, onCardButtonClick);

  function handleForecastSelection({
    buttonToHighlight,
    buttonToDefault,
    forecastToShow,
    forecastToHide,
  }: IForecastSelectionParams) {
    buttonToDefault.classList.remove('select-period__button_selected');
    buttonToHighlight.classList.add('select-period__button_selected');

    hide(forecastToHide.forecastElement);

    forecastToShow.getForecast(address);
    show(forecastToShow.forecastElement);
  }

  selectTenDayForecast.addEventListener('click', () =>
    handleForecastSelection({
      buttonToHighlight: selectTenDayForecast,
      buttonToDefault: selectThirtyDayForecast,
      forecastToShow: tenDay,
      forecastToHide: thirtyDay,
    })
  );

  selectThirtyDayForecast.addEventListener('click', () =>
    handleForecastSelection({
      buttonToHighlight: selectThirtyDayForecast,
      buttonToDefault: selectTenDayForecast,
      forecastToShow: thirtyDay,
      forecastToHide: tenDay,
    })
  );

  function getInitialForecast(address: string) {
    selectedDay.getForecast(address, todayISO);
    tenDay.getForecast(address);
  }

  function update(newValue: string) {
    address = newValue;
    getInitialForecast(address);
  }

  return { update };
}
