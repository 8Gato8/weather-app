import type { IHandleRequestParams } from './types';
import {
  HIDDEN_CLASS,
  DISABLED_CLASS,
  SELECTED_CARD_CLASS,
  TOO_MANY_REQUESTS_CODE,
  TOO_MANY_REQUESTS_MESSAGE,
  BAD_REQUEST_CODE,
  BAD_REQUEST_MESSAGE,
} from './constants';

export function show(element: HTMLElement) {
  element.classList.remove(HIDDEN_CLASS);
}

export function hide(element: HTMLElement) {
  element.classList.add(HIDDEN_CLASS);
}

export function enableButton(button: HTMLButtonElement) {
  button.removeAttribute(DISABLED_CLASS);
}

export function disableButton(button: HTMLButtonElement) {
  button.setAttribute(DISABLED_CLASS, '');
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

export function highlightButton(button: HTMLButtonElement) {
  button.classList.add(SELECTED_CARD_CLASS);
}

export function removeHighlightFromButton(button: HTMLButtonElement) {
  button.classList.remove(SELECTED_CARD_CLASS);
}

export async function handleRequest({
  parentElement,
  error,
  loader,
  request,
  fetchForecast,
  handleCardsCreation,
}: IHandleRequestParams) {
  try {
    hide(error);
    hide(parentElement);
    show(loader);

    const data = await fetchForecast(request);
    handleCardsCreation(data.days);

    hide(loader);
    hide(error);
    show(parentElement);
  } catch (err) {
    hide(loader);
    if (err.message === TOO_MANY_REQUESTS_CODE) {
      error.textContent = TOO_MANY_REQUESTS_MESSAGE;
    }
    if (err.message === BAD_REQUEST_CODE) {
      error.textContent = BAD_REQUEST_MESSAGE;
    }
    show(error);
  }
}
