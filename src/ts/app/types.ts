export interface ISlider {
  update: (number: number) => void;
}

export interface IForecast {
  update: (newValue: string) => void;
}

export interface ISelectedDayForecast {
  getForecast: (address: string, date: string) => Promise<void>;
}

export interface IForecastForDays {
  forecastElement: HTMLElement;
  getForecast: (address: string) => Promise<void>;
  clear: () => void;
}

export type TOnCardButtonClick = (e: MouseEvent) => void;

interface IHour {
  datetime: string;
  icon: string;
  temp: number;
  conditions: string;
}

export interface IDay {
  hours?: [IHour];
  datetime: string;
  icon: string;
  conditions: string;
  temp: number;
  tempmax: number;
  tempmin: number;
  humidity: number;
  pressure: number;
  feelslike: number;
  windspeed: number;
  winddir: number;
}

export type TDays = [IDay];

export interface IRequestData {
  address: string;
  date: string | { from: string; to: string };
  params?: string;
}

interface IForecastData {
  days: TDays;
  currentConditions?: IDay;
  resolvedAddress: string;
}

export type TFetchForecast = ({
  address,
  date,
  params,
}: IRequestData) => Promise<IForecastData>;

export interface IHandleRequestParams {
  parentElement: HTMLElement;
  loader: HTMLImageElement;
  error: HTMLParagraphElement;
  request: IRequestData;
  fetchForecast: TFetchForecast;
  handleCardsCreation: (days: TDays) => void;
}

export interface IForecastSelectionParams {
  buttonToHighlight: HTMLButtonElement;
  buttonToDefault: HTMLButtonElement;
  forecastToShow: IForecastForDays;
  forecastToHide: IForecastForDays;
  address: string;
}

export type TFormatDaysData = (
  day: IDay,
  options?: {
    weekday: boolean;
  }
) => {
  date: Date;
  datetime: string;
  dayData: string;
  month: string;
  conditions: string;
  icon: string;
  tempminRounded: number;
  tempmaxRounded: number;
  weekday?: string;
};
