import type { IForecast } from './types';
import { show, hide } from './utils';

export default function Search(forecast: IForecast) {
  const input = document.querySelector('.search-input') as HTMLInputElement;
  const searchButton = document.querySelector(
    '.header__search-button'
  ) as HTMLButtonElement;
  const clearButton = document.querySelector(
    '.header__clear-search-input'
  ) as HTMLButtonElement;

  function checkInputValid() {
    return input.validity.valid;
  }

  function switchClearButtonVisibility() {
    if (input.value) show(clearButton);
    else hide(clearButton);
  }

  function getForecast() {
    if (checkInputValid()) {
      forecast.update(input.value);
    }
  }

  function clearInput() {
    input.value = '';
  }

  input.addEventListener('input', checkInputValid);
  input.addEventListener('input', switchClearButtonVisibility);
  searchButton.addEventListener('click', getForecast);
  clearButton.addEventListener('click', clearInput);
  document.addEventListener('keydown', (e) => {
    const keyName = e.key;

    if (keyName === 'Enter') {
      getForecast();
    }
  });

  forecast.update('Москва');
}
