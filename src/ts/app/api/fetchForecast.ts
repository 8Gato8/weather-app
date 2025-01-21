import type { IRequestData, TFetchForecast } from '../types';
import { API_KEY, BASE_URL } from '../constants';

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
