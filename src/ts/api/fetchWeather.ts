const API_KEY = 'MUDWJGC5JWDQ4FZZ8SMD93KKR';

const BASE_URL =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

const searchParams = `?unitGroup=uk&key=${API_KEY}`;

export default async function fetchWeather(address: string, daysCount: string) {
  const url = `${BASE_URL}/${address}/${daysCount}${searchParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}`);

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}
