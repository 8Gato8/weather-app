import Forecast from './Forecast';

export function Search() {
  const forecast = Forecast();

  const input = document.querySelector('.search-input') as HTMLInputElement;
  const searchButton = document.querySelector(
    '.header__search-button'
  ) as HTMLButtonElement;

  function checkInputValid() {
    return input.validity.valid;
  }

  function getForecast() {
    if (checkInputValid()) {
      forecast.update(input.value);
    }
  }

  input.addEventListener('input', checkInputValid);
  searchButton.addEventListener('click', getForecast);
  document.addEventListener('keydown', (e) => {
    const keyName = e.key;

    if (keyName === 'Enter') {
      getForecast();
    }
  });

  forecast.update('Москва');
}
