export function enableButton(button: HTMLButtonElement) {
  button.removeAttribute('disabled');
}

export function disableButton(button: HTMLButtonElement) {
  button.setAttribute('disabled', '');
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}
