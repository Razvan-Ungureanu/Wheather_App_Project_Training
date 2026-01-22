import { initTheme } from "./theme.js";
import { geocode, forecast, weatherCodeText } from "./api.js";
import { updateMap } from "./map.js";

const $ = (s) => document.querySelector(s);

let lastResults = [];

/* Umplu dropdown-ul cu rezultatele gasite */
function fillPick(results) {
  const pick = $("#pick");
  pick.innerHTML = "";

  results.forEach((r, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${r.name} (${r.country})`;
    pick.appendChild(opt);
  });

  $("#pickWrap").style.display = results.length ? "block" : "none";
}

/* Afisez tot UI-ul dupa ce am datele */
function render(place, data) {
  $("#out").style.display = "block";

  $("#place").textContent = `${place.name}, ${place.country}`;
  $("#meta").textContent = `Coordonate: ${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;

  const cur = data.current;
  $("#now").textContent =
    `${cur.temperature_2m}${data.current_units.temperature_2m} • ` +
    `${weatherCodeText(cur.weather_code)}`;

  /* update harta */ 
  updateMap({
    lat: place.latitude,
    lon: place.longitude,
    popupHtml:
      `<b>${place.name}, ${place.country}</b><br>` +
      `${cur.temperature_2m}${data.current_units.temperature_2m} • ${weatherCodeText(cur.weather_code)}`,
  });

  /* tabel ore */
  $("#hourRows").innerHTML = "";
  for (let i = 0; i < 12; i++) {
    $("#hourRows").innerHTML += `
      <tr>
        <td>${data.hourly.time[i].replace("T", " ")}</td>
        <td>${data.hourly.temperature_2m[i]}</td>
        <td>${data.hourly.wind_speed_10m[i]}</td>
        <td>${data.hourly.weather_code[i]}</td>
      </tr>`;
  }

  /* tabel zile */
  $("#dayRows").innerHTML = "";
  for (let i = 0; i < data.daily.time.length; i++) {
    $("#dayRows").innerHTML += `
      <tr>
        <td>${data.daily.time[i]}</td>
        <td>${data.daily.temperature_2m_min[i]} / ${data.daily.temperature_2m_max[i]}</td>
        <td>${data.daily.weather_code[i]}</td>
      </tr>`;
  }
}

/* Caut orasul din input */
async function onSearch() {
  $("#status").textContent = "Caut orașe…";
  $("#err").textContent = "";
  $("#out").style.display = "none";

  try {
    const query = $("#q").value.trim();
    lastResults = await geocode(query);

    if (!lastResults.length) {
      $("#status").textContent = "";
      $("#err").textContent = "Nu am găsit rezultate.";
      $("#pickWrap").style.display = "none";
      return;
    }

    fillPick(lastResults);
    $("#status").textContent = "Alege locația.";
  } catch (e) {
    $("#err").textContent = e.message;
  }
}

/* Incarc prognoza pentru orasul selectat */
async function onLoadForecast() {
  const place = lastResults[Number($("#pick").value)];
  const data = await forecast(place.latitude, place.longitude);
  render(place, data);
}

/* init */
initTheme();

$("#searchBtn").addEventListener("click", onSearch);
$("#loadBtn").addEventListener("click", onLoadForecast);
$("#q").addEventListener("keydown", (e) => {
  if (e.key === "Enter") onSearch();
});

/* Auto-run la inceput (Bucuresti e pus by default in input) */
onSearch();