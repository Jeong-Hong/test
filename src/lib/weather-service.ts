import type { WeatherData } from '../types/domain';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchCurrentWeather(): Promise<WeatherData> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Gelocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Params for Open-Meteo
                    const params = new URLSearchParams({
                        latitude: latitude.toString(),
                        longitude: longitude.toString(),
                        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m',
                        wind_speed_unit: 'ms' // Use m/s as per request implies standard units, or km/h? Let's use m/s for wind.
                    });

                    const response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }

                    const data = await response.json();
                    const current = data.current;

                    const weather: WeatherData = {
                        temperature: current.temperature_2m,
                        humidity: current.relative_humidity_2m,
                        windSpeed: current.wind_speed_10m,
                        windDirection: current.wind_direction_10m,
                        description: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`
                    };

                    resolve(weather);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(new Error(`Location access denied: ${error.message}`));
            }
        );
    });
}
