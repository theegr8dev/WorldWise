/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvent,
} from 'react-leaflet';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';
function Map() {
	const { cities } = useCities();
	const [mapPosition, setMapPosition] = useState([40, 0]);
	const {
		isLoading: isLoadingPosition,
		position: geoLocationPosition,
		getPosition,
	} = useGeolocation();
	const [mapLat, mapLng] = useUrlPosition();
	useEffect(() => {
		if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
	}, [mapLat, mapLng]);
	useEffect(() => {
		if (geoLocationPosition)
			setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
	}, [geoLocationPosition]);
	return (
		<div className={styles.mapContainer}>
			{!geoLocationPosition && (
				<Button type="position" onClick={getPosition}>
					{isLoadingPosition ? 'Loading...' : 'Use your Position'}
				</Button>
			)}
			<MapContainer
				center={mapPosition}
				zoom={13}
				scrollWheelZoom={false}
				className={styles.map}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.map(city => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						// position={mapPosition}
						key={city.id}
					>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}
function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}
function DetectClick() {
	const navigate = useNavigate();

	useMapEvent({
		click: e => {
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
		},
	});
}

export default Map;
