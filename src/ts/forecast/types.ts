export interface ISlider {
  update: (number: number) => void;
}

export interface ISelectedDayForecast {
  getForecast: (address: string, date: string) => Promise<void>;
}

interface IHour {
  datetime: string;
  icon: string;
  temp: number;
  conditions: string;
}

export interface IDay {
  hours: [IHour];
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
