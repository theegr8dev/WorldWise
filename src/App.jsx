import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Product from './pages/Product';
import Pricing from './pages/Pricing';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';

const BASE_URL = 'http://localhost:8000';
function App() {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const res = await fetch(`${BASE_URL}/cities`);
				const data = await res.json();
				setCities(data);
			} catch (err) {
				console.log('There was an error loading data...');
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="pricing" element={<Pricing />} />
				<Route path="product" element={<Product />} />
				<Route path="login" element={<Login />} />
				<Route path="app" element={<AppLayout />}>
					<Route
						index
						element={<CityList cities={cities} isLoading={isLoading} />}
					/>
					<Route
						path="cities"
						element={<CityList cities={cities} isLoading={isLoading} />}
					/>
					<Route path="cities/:id" element={<City />} />
					<Route
						path="countries"
						element={<CountryList cities={cities} />}
					/>
					<Route path="form" element={<p>Form</p>} />
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
