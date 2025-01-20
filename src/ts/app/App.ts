import Forecast from './Forecast';
import Search from './Search';

export default function App() {
  const forecast = Forecast();

  Search(forecast);
}
