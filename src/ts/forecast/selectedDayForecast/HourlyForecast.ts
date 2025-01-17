import type { TDays, ISlider } from '../types';

import { enableButton, disableButton, show, hide } from '../utils';

import { getHours } from 'date-fns';

export default function HourlyForecast() {
  const hoursHint = document.querySelector(
    '.hours__hint'
  ) as HTMLParagraphElement;
  const hoursSlider = document.querySelector(
    '.hours__slider'
  ) as HTMLDivElement;
  const hourlyList = document.querySelector(
    '.hourly-forecast-cards'
  ) as HTMLElement;

  const cardTemplate = document.querySelector(
    '#hour-forecast-card-template'
  ) as HTMLTemplateElement;

  const slideLeft = document.querySelector('#slide-left') as HTMLButtonElement;
  const slideRight = document.querySelector(
    '#slide-right'
  ) as HTMLButtonElement;

  function clearList() {
    while (hourlyList.hasChildNodes()) {
      hourlyList.removeChild(hourlyList.lastChild);
    }
  }

  function renderCards(days: TDays) {
    hide(hoursHint);
    show(hoursSlider);

    let cardsNumber = 0;

    if (hourlyList.hasChildNodes()) clearList();

    days.forEach((day, index) => {
      let hours = [];

      if (index === 0 && days.length > 1) {
        const hourNow = getHours(new Date());
        hours = day.hours.slice(hourNow);
      } else {
        hours = day.hours;
      }

      cardsNumber += hours.length;

      hours.forEach((hour) => {
        const { datetime, icon, conditions, temp } = hour;

        const clone = cardTemplate.content.cloneNode(true) as DocumentFragment;

        const cardElement = clone.querySelector('.hour-forecast-card');

        const timeElement = cardElement.querySelector(
          '.hour-forecast-card__time'
        ) as HTMLTimeElement;
        const iconElement = cardElement.querySelector(
          '.hour-forecast-card__icon'
        ) as HTMLImageElement;
        const tempElement = cardElement.querySelector(
          '.hour-forecast-card__temp'
        );

        const hours = `${datetime.slice(0, 2)}:00`;

        const time = hours;
        timeElement.textContent = time.toString();
        timeElement.dateTime = time.toString();

        const iconName = icon;
        import(`../../../assets/img/forecast/${iconName}.svg`).then(
          (res) => (iconElement.src = res.default)
        );
        iconElement.alt = conditions;

        const tempRounded = Math.round(temp);
        tempElement.textContent = `${tempRounded}°`;

        hourlyList.append(cardElement);
      });
    });

    slider.update(cardsNumber);
  }

  function renderHint() {
    hide(hoursSlider);
    show(hoursHint);
  }

  function Slider(): ISlider {
    const gap = parseInt(
      getComputedStyle(document.body).getPropertyValue('--hourly-card-gap')
    );
    const width = parseInt(
      getComputedStyle(document.body).getPropertyValue('--hourly-card-width')
    );
    const step = (width + gap) * 3;

    let cardsNumber = 0;
    let hourlyListWidth = 0;
    let displayAreaWidth = 0;

    const sliderWidth = parseInt(getComputedStyle(hoursSlider).width);

    function resetListPosition() {
      hourlyList.style.left = '0';
      disableButton(slideLeft);
      enableButton(slideRight);
    }

    function calculateOptions() {
      hourlyListWidth = (width + gap) * cardsNumber - gap;
      displayAreaWidth = -(hourlyListWidth - sliderWidth);
    }

    function update(number: number) {
      cardsNumber = number;

      calculateOptions();
      resetListPosition();
    }

    function slide(direction: string) {
      const currentLeft = parseInt(getComputedStyle(hourlyList).left);

      const canSlideRight = currentLeft - step > displayAreaWidth;
      const canSlideLeft = currentLeft + step < 0;

      if (direction === 'right') {
        enableButton(slideLeft);

        if (!canSlideRight) {
          disableButton(slideRight);

          hourlyList.style.left = `${displayAreaWidth}px`;
          return;
        }
        hourlyList.style.left = `${currentLeft - step}px`;
      } else {
        enableButton(slideRight);

        if (!canSlideLeft) {
          disableButton(slideLeft);
          hourlyList.style.left = `0`;
          return;
        }
        hourlyList.style.left = `${currentLeft + step}px`;
      }
    }

    slideLeft.addEventListener('click', () => slide('left'));
    slideRight.addEventListener('click', () => slide('right'));

    document.addEventListener('keydown', (e) => {
      const keyName = e.key;

      if (keyName === 'ArrowRight') {
        if (slideRight.hasAttribute('disabled')) return;

        slide('right');
      }
      if (keyName === 'ArrowLeft') {
        if (slideLeft.hasAttribute('disabled')) return;

        slide('left');
      }
    });

    return { update };
  }

  const slider = Slider();

  return { renderCards, renderHint };
}
