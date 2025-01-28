import type { TDays, ISlider, IHour, IDay } from '../types';

import { enableButton, disableButton, show, hide } from '../utils';

export default function HourlyForecast() {
  const hintElement = document.querySelector(
    '.hours__hint'
  ) as HTMLParagraphElement;
  const sliderElement = document.querySelector(
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

  function formatHoursData(hour: IHour) {
    const { datetime, temp } = hour;

    const hours = `${datetime.slice(0, 2)}:00`;

    return {
      ...hour,
      hours,
      temp: Math.round(temp),
    };
  }

  function handleCardsCreation(days: TDays, currentTime?: string) {
    const hasHoursData = days[0].hours;

    if (!hasHoursData) {
      show(hintElement);
      hide(sliderElement);

      return;
    }

    clearList();

    hide(hintElement);
    show(sliderElement);

    createCards(days, currentTime);
  }

  function createHoursArray(day: IDay, dayIndex: number, currentTime?: string) {
    let hours = [];

    const isFirstDay = dayIndex === 0;

    if (isFirstDay && currentTime) {
      const hourNow = +currentTime.slice(0, 2) + 1;
      hours = day.hours.slice(hourNow);
    } else {
      hours = day.hours;
    }

    return hours;
  }

  function createCards(days: TDays, currentTime?: string) {
    let cardsCount = 0;

    days.forEach((day, dayIndex) => {
      const hours = createHoursArray(day, dayIndex, currentTime);

      cardsCount += hours.length;

      hours.forEach((hour) => {
        const { hours, icon, conditions, temp } = formatHoursData(hour);

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

        timeElement.textContent = hours.toString();
        timeElement.dateTime = hours.toString();

        import(`../../../assets/img/forecast/${icon}.svg`).then(
          (res) => (iconElement.src = res.default)
        );
        iconElement.alt = conditions;

        tempElement.textContent = `${temp}°`;

        hourlyList.append(cardElement);
      });
    });

    slider.update(cardsCount);
  }

  function Slider(): ISlider {
    const gap = parseInt(
      getComputedStyle(document.body).getPropertyValue('--hourly-card-gap')
    );
    const width = parseInt(
      getComputedStyle(document.body).getPropertyValue('--hourly-card-width')
    );
    const step = (width + gap) * 3;

    let cardsCount = 0;
    let hourlyListWidth = 0;
    let displayAreaWidth = 0;
    let sliderWidth = 0;

    function resetListPosition() {
      hourlyList.style.left = '0';
      disableButton(slideLeft);
      enableButton(slideRight);
    }

    function calculateOptions() {
      sliderWidth = parseInt(getComputedStyle(sliderElement).width);
      hourlyListWidth = (width + gap) * cardsCount - gap;
      displayAreaWidth = -(hourlyListWidth - sliderWidth);
    }

    function update(newCount: number) {
      cardsCount = newCount;

      calculateOptions();
      resetListPosition();
    }

    let currentLeft = 0;
    let startPoint = 0;
    let isClicked = false;

    function slideByClick(direction: string) {
      currentLeft = parseInt(getComputedStyle(hourlyList).left);

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

    function slideByDrag(e: MouseEvent) {
      if (!isClicked) return;

      const step = e.clientX - startPoint;
      const direction = Math.sign(step) > 0 ? 'left' : 'right';

      const canSlideLeft = currentLeft + step < 0;
      const canSlideRight = currentLeft + step > displayAreaWidth;

      if (direction === 'right') {
        enableButton(slideLeft);
        if (!canSlideRight) {
          disableButton(slideRight);
          hourlyList.style.left = `${displayAreaWidth}px`;
          return;
        }
      } else {
        enableButton(slideRight);
        if (!canSlideLeft) {
          disableButton(slideLeft);
          hourlyList.style.left = `0`;
          return;
        }
      }

      hourlyList.style.left = `${currentLeft + step}px`;
    }

    slideLeft.addEventListener('click', () => slideByClick('left'));
    slideRight.addEventListener('click', () => slideByClick('right'));

    document.addEventListener('keydown', (e) => {
      const keyName = e.key;

      if (keyName === 'ArrowRight') {
        if (slideRight.hasAttribute('disabled')) return;

        slideByClick('right');
      }
      if (keyName === 'ArrowLeft') {
        if (slideLeft.hasAttribute('disabled')) return;

        slideByClick('left');
      }
    });

    hourlyList.addEventListener('mousedown', (e) => {
      e.preventDefault();

      hourlyList.classList.remove('hourly-forecast-cards_slider');
      isClicked = true;

      startPoint = e.clientX;
      currentLeft = parseInt(getComputedStyle(hourlyList).left);
    });

    hourlyList.addEventListener('mousemove', slideByDrag);

    window.addEventListener('mouseup', () => {
      isClicked = false;
      hourlyList.classList.add('hourly-forecast-cards_slider');
    });

    window.addEventListener('resize', () => {
      update(cardsCount);
    });

    return { update };
  }

  const slider = Slider();

  return { handleCardsCreation };
}
