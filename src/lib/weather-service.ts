import type { WeatherData } from '../types/domain';
import { dfs_xy_conv } from './kma-converter';

// KMA Ultra Short Term NCST (Live) API
// Using Proxy: /api/kma -> http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0
const KMA_API_URL = '/api/kma/getUltraSrtNcst';
const SERVICE_KEY = 'obdTxotOzqJ7+DlVVzqj6XNjgHQOpSyVLDW0rk+rNNKZzAfflvqs/ZYld9SGiFnizknwccfbxTWOhYca1FK5vw==';

interface KmaItem {
    baseDate: string;
    baseTime: string;
    category: string; // T1H(Temp), REH(Hum), WSD(WindSpd), VEC(WindDir)
    nx: number;
    ny: number;
    obsrValue: string;
}

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

                    // 1. Convert Lat/Lon to Grid X/Y
                    const grid = dfs_xy_conv("toGRID", latitude, longitude);

                    // 2. Calculate Base Date & Time
                    // API is updated every hour on the hour (e.g., 10:00).
                    // Data is usually available after 40 mins (e.g., 10:40).
                    // So if current min < 40, use previous hour.
                    const now = new Date();
                    if (now.getMinutes() < 40) {
                        now.setHours(now.getHours() - 1);
                    }

                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, '0');
                    const day = now.getDate().toString().padStart(2, '0');
                    const dateStr = `${year}${month}${day}`;

                    const hours = now.getHours().toString().padStart(2, '0');
                    const timeStr = `${hours}00`; // Always 00 minute

                    // 3. Call API
                    // Use URLSearchParams to ensure proper encoding of special characters (e.g. '+' -> '%2B')
                    const params = new URLSearchParams({
                        serviceKey: SERVICE_KEY,
                        pageNo: '1',
                        numOfRows: '1000',
                        dataType: 'JSON',
                        base_date: dateStr,
                        base_time: timeStr,
                        nx: grid.x.toString(),
                        ny: grid.y.toString()
                    });

                    // Note: The serviceKey needs to be passed AS IS if using browser fetch with URLSearchParams?
                    // Actually, URLSearchParams encodes '=' to '%3D', '+' to '%2B'.
                    // Public Data Portal expects the key to be URL-encoded when receiving.
                    // If the provided key is "Encoding" (already has %)? No, user provided key has '+', so it is Base64.
                    // Sending '+' in URL query string is interpreted as SPACE. So it MUST be encoded to '%2B'.
                    // URLSearchParams does exactly this.

                    const fullUrl = `${KMA_API_URL}?${params.toString()}`;

                    const response = await fetch(fullUrl);
                    if (!response.ok) {
                        throw new Error(`KMA API Error: ${response.status}`);
                    }

                    const json = await response.json();

                    // Check KMA Header
                    const header = json.response?.header;
                    if (header?.resultCode !== '00') {
                        throw new Error(`KMA API Fail: ${header?.resultMsg} (${header?.resultCode})`);
                    }

                    const items: KmaItem[] = json.response.body.items.item;

                    // 4. Parse Items
                    // T1H: Temp, REH: Humidity, WSD: Wind Speed, VEC: Wind Direction
                    let temp = 0, hum = 0, windSpd = 0, windDir = 0;

                    items.forEach(item => {
                        const val = parseFloat(item.obsrValue);
                        switch (item.category) {
                            case 'T1H': temp = val; break;
                            case 'REH': hum = val; break;
                            case 'WSD': windSpd = val; break; // m/s
                            case 'VEC': windDir = val; break; // deg
                        }
                    });


                    const formattedTime = `${hours}:${timeStr.substring(2)}`;
                    const weather: WeatherData = {
                        temperature: temp,
                        humidity: hum,
                        windSpeed: windSpd,
                        windDirection: windDir,
                        description: `기상청 (${formattedTime}) 기준`
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
