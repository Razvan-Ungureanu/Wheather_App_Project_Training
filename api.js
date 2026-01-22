/* Geocoding: gasesc coordonatele orasului */
export async function geocode(name) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", name);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "ro");
  url.searchParams.set("format", "json");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  return data.results || [];
}

/* Forecast: iau prognoza pe coordonate */
export async function forecast(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("current", "temperature_2m,wind_speed_10m,weather_code");
  url.searchParams.set("hourly", "temperature_2m,wind_speed_10m,weather_code");
  url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,weather_code");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Forecast failed");
  return res.json();
}

/* Traduc codurile meteo(WMO) in text */
export function weatherCodeText(code) {
  const c = Number(code);
  if (c === 0) return "Senin";
  if ([1, 2, 3].includes(c)) return "Parțial noros";
  if ([45, 48].includes(c)) return "Ceață";
  if ([51, 53, 55].includes(c)) return "Burniță";
  if ([61, 63, 65].includes(c)) return "Ploaie";
  if ([71, 73, 75].includes(c)) return "Ninsoare";
  if ([80, 81, 82].includes(c)) return "Averse";
  if ([95, 96, 99].includes(c)) return "Furtună";
  return "Cod: " + c;
}