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
