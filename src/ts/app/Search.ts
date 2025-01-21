import type { IForecast } from './types';
import { INVALID_PATTERN_MESSAGE } from './constants';
import { show, hide } from './utils';

export default function Search(forecast: IForecast) {
  const input = document.querySelector('.search-input') as HTMLInputElement;
  const searchForm = document.querySelector('.search-form') as HTMLFormElement;
  const clearButton = document.querySelector(
    '.search-form__clear-input'
  ) as HTMLButtonElement;

  function validatePattern() {
    if (input.validity.patternMismatch) {
      input.setCustomValidity(INVALID_PATTERN_MESSAGE);
    } else {
      input.setCustomValidity('');
    }
  }

  function switchClearButtonVisibility() {
    if (input.value) show(clearButton);
    else hide(clearButton);
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (input.checkValidity()) {
      forecast.update(input.value);
    }
  }

  function handleClear() {
    clearInput();
    hide(clearButton);
  }

  function clearInput() {
    input.value = '';
  }

  input.addEventListener('input', validatePattern);
  input.addEventListener('input', switchClearButtonVisibility);
  searchForm.addEventListener('submit', handleSubmit);
  clearButton.addEventListener('click', handleClear);

  forecast.update('Москва');
}
