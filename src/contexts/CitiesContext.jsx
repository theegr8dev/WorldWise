/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
const BASE_URL = 'http://localhost:8000';
// Creating useContext
const CitiesContext = createContext();
function CitiesProvider({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

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
	async function getCity(id) {
		try {
			setIsLoading(true);
			const res = await fetch(`${BASE_URL}/cities/${id}`);
			const data = await res.json();
			setCurrentCity(data);
		} catch (err) {
			console.log('There was an error loading data...');
		} finally {
			setIsLoading(false);
		}
	}
	return (
		// setting  value
		<CitiesContext.Provider
			value={{
				cities: cities,
				isLoading: isLoading,
				currentCity: currentCity,
				getCity,
			}}
		>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	// consuming value
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error('Cities Context was used outside CitiesProvider');
	return context;
}
export { CitiesProvider, useCities };
