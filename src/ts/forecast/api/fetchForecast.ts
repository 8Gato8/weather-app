import type { IRequestData, TFetchForecast } from '../types';

/* const API_KEY = 'MUDWJGC5JWDQ4FZZ8SMD93KKR'; */
const API_KEY = 'D9GW7MDHRZ45HXYPHJYLB5GM8';

const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const searchParams = `?unitGroup=metric&lang=ru&key=${API_KEY}&`;

export const fetchForecast: TFetchForecast = async function ({
  address,
  date,
  params,
}: IRequestData) {
  const url = `${BASE_URL}/${address}/${date}${searchParams}${params}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}`);

  const data = await response.json();

  return data;
};
