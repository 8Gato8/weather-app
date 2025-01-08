export interface ISlider {
  number: number;
  width: number;
  gap: number;
}
export default function Slider() {
  let cardsNumber = 0;
  let cardWidth = 0;
  let gapBetween = 0;

  let step = 0;
  let hourlyListWidth = 0;
  let displayAreaWidth = 0;

  const hoursSlider = document.querySelector('.hours__slider');
  const hourlyList = document.querySelector(
    '.hourly-weather-cards'
  ) as HTMLUListElement;

  const slideLeft = document.querySelector('#slide-left');
  const slideRight = document.querySelector('#slide-right');

  const sliderWidth = parseInt(getComputedStyle(hoursSlider).width);

  function calculateOptions() {
    hourlyListWidth = (cardWidth + gapBetween) * cardsNumber - gapBetween;
    displayAreaWidth = -(hourlyListWidth - sliderWidth);
    step = (cardWidth + gapBetween) * 3;
  }

  function setOptions({ number, width, gap }: ISlider) {
    cardsNumber = number;
    cardWidth = width;
    gapBetween = gap;

    calculateOptions();
  }

  function slide(direction: string) {
    const currentLeft = parseInt(getComputedStyle(hourlyList).left);

    if (direction === 'right') {
      if (currentLeft - step <= displayAreaWidth) {
        hourlyList.style.left = `${displayAreaWidth}px`;
        return;
      }
      hourlyList.style.left = `${currentLeft - step}px`;
    } else {
      if (currentLeft + step >= 0) {
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

    if (keyName === 'ArrowRight') slide('right');
    if (keyName === 'ArrowLeft') slide('left');
  });

  return { setOptions };
}
