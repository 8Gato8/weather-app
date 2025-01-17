import type { TOnCardButtonClick } from './types';

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
  );
  const selectThirtyDayForecast = document.querySelector(
    '#select-thirty-day-forecast'
  );

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

  selectTenDayForecast.addEventListener('click', () => {
    selectThirtyDayForecast.classList.remove('select-period__button_selected');
    selectTenDayForecast.classList.add('select-period__button_selected');

    hide(thirtyDay.forecastElement);

    tenDay.getForecast(address);
    show(tenDay.forecastElement);
  });

  selectThirtyDayForecast.addEventListener('click', () => {
    selectTenDayForecast.classList.remove('select-period__button_selected');
    selectThirtyDayForecast.classList.add('select-period__button_selected');

    hide(tenDay.forecastElement);

    thirtyDay.getForecast(address);
    show(thirtyDay.forecastElement);
  });

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
