import type { IHandleRequestParams } from './types';

export function show(element: HTMLElement) {
  element.classList.remove('hidden');
}

export function hide(element: HTMLElement) {
  element.classList.add('hidden');
}

export function enableButton(button: HTMLButtonElement) {
  button.removeAttribute('disabled');
}

export function disableButton(button: HTMLButtonElement) {
  button.setAttribute('disabled', '');
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function highlightButton(button: HTMLButtonElement) {
  button.classList.add('forecast-card-button_selected');
}

export function removeHighlightFromButton(button: HTMLButtonElement) {
  button.classList.remove('forecast-card-button_selected');
}

export async function handleRequest({
  parentElement,
  error,
  loader,
  request,
  fetchForecast,
  render,
}: IHandleRequestParams) {
  try {
    hide(error);
    hide(parentElement);
    show(loader);

    const data = await fetchForecast(request);
    render(data.days);

    hide(loader);
    hide(error);
    show(parentElement);
  } catch (err) {
    hide(loader);
    if (err.message === '429') {
      error.textContent = 'Слишком много запросов, повторите попытку позже';
    }
    if (err.message === '400') {
      error.textContent =
        'По вашему запросу ничего не найдено, попробуйте поискать что-нибудь другое';
    }
    show(error);
  }
}
