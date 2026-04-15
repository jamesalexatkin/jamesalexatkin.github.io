// ── WMO weather code → emoji + description ───────────────────────────────────
const WMO = {
    0: { icon: "☀️", desc: "Clear sky" },
    1: { icon: "🌤", desc: "Mainly clear" },
    2: { icon: "⛅", desc: "Partly cloudy" },
    3: { icon: "☁️", desc: "Overcast" },
    45: { icon: "🌫", desc: "Fog" },
    48: { icon: "🌫", desc: "Rime fog" },
    51: { icon: "🌦", desc: "Light drizzle" },
    53: { icon: "🌦", desc: "Drizzle" },
    55: { icon: "🌦", desc: "Dense drizzle" },
    56: { icon: "🌧", desc: "Freezing drizzle" },
    57: { icon: "🌧", desc: "Heavy freezing drizzle" },
    61: { icon: "🌧", desc: "Slight rain" },
    63: { icon: "🌧", desc: "Rain" },
    65: { icon: "🌧", desc: "Heavy rain" },
    66: { icon: "🌧", desc: "Freezing rain" },
    67: { icon: "🌧", desc: "Heavy freezing rain" },
    71: { icon: "🌨", desc: "Slight snow" },
    73: { icon: "🌨", desc: "Snow" },
    75: { icon: "❄️", desc: "Heavy snow" },
    77: { icon: "🌨", desc: "Snow grains" },
    80: { icon: "🌦", desc: "Slight showers" },
    81: { icon: "🌧", desc: "Showers" },
    82: { icon: "⛈", desc: "Violent showers" },
    85: { icon: "🌨", desc: "Snow showers" },
    86: { icon: "🌨", desc: "Heavy snow showers" },
    95: { icon: "⛈", desc: "Thunderstorm" },
    96: { icon: "⛈", desc: "Thunderstorm with hail" },
    99: { icon: "⛈", desc: "Thunderstorm with heavy hail" },
};

function wmo(code) {
    return WMO[code] || { icon: "🌡", desc: "Unknown" };
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const statusEl = document.getElementById("weatherStatus");
const headingEl = document.getElementById("weatherHeading");
const locationNameEl = document.getElementById("weatherLocationName");
const dateLine = document.getElementById("weatherDateLine");
const currentEl = document.getElementById("weatherCurrent");
const currentIcon = document.getElementById("weatherCurrentIcon");
const currentTemp = document.getElementById("weatherCurrentTemp");
const currentDesc = document.getElementById("weatherCurrentDesc");
const currentDetails = document.getElementById("weatherCurrentDetails");
const hourlySection = document.getElementById("hourlySection");
const hourlyStrip = document.getElementById("hourlyStrip");
const weeklySection = document.getElementById("weeklySection");
const dayGrid = document.getElementById("dayGrid");
const searchForm = document.getElementById("weatherSearch");
const searchInput = document.getElementById("weatherSearchInput");
const geoBtn = document.getElementById("weatherGeoBtn");
const suggestionsEl = document.getElementById("weatherSuggestions");

// ── Helpers ───────────────────────────────────────────────────────────────────
function setStatus(msg) {
    statusEl.textContent = msg;
}

function showWeather() {
    headingEl.hidden = false;
    currentEl.hidden = false;
    hourlySection.hidden = false;
    weeklySection.hidden = false;
}

function hideWeather() {
    headingEl.hidden = true;
    currentEl.hidden = true;
    hourlySection.hidden = true;
    weeklySection.hidden = true;
}

function windDirection(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
}

function formatTime(isoString) {
    const d = new Date(isoString);
    return d.getHours().toString().padStart(2, "0") + ":00";
}

function formatDate(isoString) {
    const d = new Date(isoString + "T00:00");
    return d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatDayName(isoString) {
    const d = new Date(isoString + "T00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}

function formatDayDate(isoString) {
    const d = new Date(isoString + "T00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatSunTime(isoString) {
    const d = new Date(isoString);
    return (
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0")
    );
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(data, locationName) {
    const now = new Date();
    const currentHour = now.getHours();

    // Heading
    locationNameEl.textContent = locationName;
    dateLine.textContent = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Current conditions
    const cur = data.current;
    const curWmo = wmo(cur.weather_code);
    currentIcon.textContent = curWmo.icon;
    currentTemp.textContent = Math.round(cur.temperature_2m) + "°";
    currentDesc.textContent = curWmo.desc;
    currentDetails.innerHTML =
        `<span>Feels like ${Math.round(cur.apparent_temperature)}°</span>` +
        `<span>Wind ${Math.round(cur.wind_speed_10m)} km/h ${windDirection(cur.wind_direction_10m)}</span>` +
        `<span>Humidity ${cur.relative_humidity_2m}%</span>` +
        `<span>↑ Sunrise ${formatSunTime(data.daily.sunrise[0])}</span>` +
        `<span>↓ Sunset ${formatSunTime(data.daily.sunset[0])}</span>`;

    // Hourly strip — today only, from current hour onwards
    hourlyStrip.innerHTML = "";
    const times = data.hourly.time;
    const todayStr = now.toISOString().slice(0, 10);

    // Insert a "Now" card first using current conditions
    const nowCard = document.createElement("div");
    nowCard.className = "hour-card is-current";
    nowCard.setAttribute("role", "listitem");
    nowCard.setAttribute("aria-current", "true");
    nowCard.innerHTML =
        `<span class="hour-time">Now</span>` +
        `<span class="hour-icon" aria-hidden="true">${curWmo.icon}</span>` +
        `<span class="hour-temp">${Math.round(cur.temperature_2m)}°</span>` +
        `<span class="hour-precip${cur.precipitation <= 0 ? " is-zero" : ""}">${Math.round(cur.precipitation_probability ?? 0)}%</span>`;
    hourlyStrip.appendChild(nowCard);

    times.forEach(function (timeStr, i) {
        if (!timeStr.startsWith(todayStr)) return;
        const hour = new Date(timeStr).getHours();
        if (hour <= currentHour) return; // past hours and current already shown as "Now"

        const isDay = data.hourly.is_day[i] === 1;
        const code = data.hourly.weather_code[i];
        const w = wmo(code);
        const precip = data.hourly.precipitation_probability[i] ?? 0;

        const card = document.createElement("div");
        card.className = "hour-card" + (isDay ? "" : " is-night");
        card.setAttribute("role", "listitem");
        card.innerHTML =
            `<span class="hour-time">${hour.toString().padStart(2, "0")}:00</span>` +
            `<span class="hour-icon" aria-hidden="true">${w.icon}</span>` +
            `<span class="hour-temp">${Math.round(data.hourly.temperature_2m[i])}°</span>` +
            `<span class="hour-precip${precip === 0 ? " is-zero" : ""}">${precip}%</span>`;
        hourlyStrip.appendChild(card);
    });

    // 7-day grid
    dayGrid.innerHTML = "";
    const todayDate = todayStr;
    data.daily.time.forEach(function (dateStr, i) {
        const isToday = dateStr === todayDate;
        const w = wmo(data.daily.weather_code[i]);
        const precip = data.daily.precipitation_probability_max[i] ?? 0;

        const card = document.createElement("div");
        card.className = "day-card" + (isToday ? " is-today" : "");
        card.setAttribute("role", "listitem");
        card.innerHTML =
            `<span class="day-name">${formatDayName(dateStr)}</span>` +
            `<span class="day-date">${formatDayDate(dateStr)}</span>` +
            `<span class="day-icon" aria-hidden="true">${w.icon}</span>` +
            `<div class="day-temps">` +
            `<span class="day-high">${Math.round(data.daily.temperature_2m_max[i])}°</span>` +
            `<span class="day-low">${Math.round(data.daily.temperature_2m_min[i])}°</span>` +
            `</div>` +
            `<span class="day-precip${precip === 0 ? " is-zero" : ""}">${precip}%</span>`;
        dayGrid.appendChild(card);
    });

    setStatus("");
    showWeather();
}

// ── Fetch from Open-Meteo ─────────────────────────────────────────────────────
async function loadWeather(lat, lon, locationName) {
    hideWeather();
    setStatus("Loading…");
    try {
        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${lat}&longitude=${lon}` +
            "&current=temperature_2m,apparent_temperature,relative_humidity_2m" +
            ",weather_code,wind_speed_10m,wind_direction_10m,is_day,precipitation,precipitation_probability" +
            "&hourly=temperature_2m,precipitation_probability,weather_code,is_day" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
            ",precipitation_probability_max,sunrise,sunset" +
            "&timezone=auto&forecast_days=7";
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Weather fetch failed");
        const data = await resp.json();
        render(data, locationName);
    } catch (e) {
        setStatus("Could not load weather data. Please try again.");
        hideWeather();
    }
}

// ── Geolocation ───────────────────────────────────────────────────────────────
function useGeolocation() {
    if (!navigator.geolocation) {
        setStatus("Geolocation is not supported by your browser.");
        return;
    }
    setStatus("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
        async function (pos) {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            // Reverse-geocode via Nominatim (OpenStreetMap) — free, no key required.
            // User-Agent header is set as required by Nominatim's usage policy.
            let name = `${lat}°, ${lon}°`;
            try {
                const r = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`,
                    { headers: { "Accept-Language": "en" } },
                );
                if (r.ok) {
                    const geo = await r.json();
                    // Prefer town/city > village > county > country as the display name
                    const addr = geo.address || {};
                    name =
                        addr.city ||
                        addr.town ||
                        addr.village ||
                        addr.municipality ||
                        addr.county ||
                        geo.name ||
                        name;
                }
            } catch (_) {}
            loadWeather(lat, lon, name);
        },
        function (err) {
            setStatus(
                err.code === 1
                    ? "Location access denied. Use the search box to find a place."
                    : "Could not determine your location.",
            );
        },
        { timeout: 10000 },
    );
}

// ── Search / autocomplete ─────────────────────────────────────────────────────
let suggestAbort = null;

async function fetchSuggestions(query) {
    if (suggestAbort) suggestAbort.abort();
    suggestAbort = new AbortController();
    try {
        const resp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
            { signal: suggestAbort.signal },
        );
        const data = await resp.json();
        return data.results || [];
    } catch (_) {
        return [];
    }
}

function showSuggestions(results) {
    suggestionsEl.innerHTML = "";
    if (!results.length) {
        suggestionsEl.hidden = true;
        return;
    }
    results.forEach(function (r) {
        const li = document.createElement("li");
        li.className = "weather-suggestion-item";
        li.setAttribute("role", "option");
        li.setAttribute("tabindex", "0");
        const parts = [r.name, r.admin1, r.country].filter(Boolean);
        li.textContent = parts.join(", ");
        li.addEventListener("click", function () {
            pickSuggestion(r);
        });
        li.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") pickSuggestion(r);
        });
        suggestionsEl.appendChild(li);
    });
    suggestionsEl.hidden = false;
}

function pickSuggestion(r) {
    const parts = [r.name, r.admin1, r.country].filter(Boolean);
    searchInput.value = parts.join(", ");
    suggestionsEl.hidden = true;
    loadWeather(r.latitude, r.longitude, r.name);
}

function closeSuggestions() {
    suggestionsEl.hidden = true;
}

searchInput.addEventListener("input", async function () {
    const q = searchInput.value.trim();
    if (q.length < 2) {
        closeSuggestions();
        return;
    }
    const results = await fetchSuggestions(q);
    showSuggestions(results);
});

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSuggestions();
    if (e.key === "ArrowDown") {
        const first = suggestionsEl.querySelector(".weather-suggestion-item");
        if (first) first.focus();
    }
});

document.addEventListener("click", function (e) {
    if (!searchForm.contains(e.target) && !suggestionsEl.contains(e.target)) {
        closeSuggestions();
    }
});

searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const q = searchInput.value.trim();
    if (!q) return;
    closeSuggestions();
    setStatus("Searching…");
    const results = await fetchSuggestions(q);
    if (!results.length) {
        setStatus(`No results found for "${q}".`);
        return;
    }
    pickSuggestion(results[0]);
});

geoBtn.addEventListener("click", useGeolocation);

// ── Init: try geolocation automatically ──────────────────────────────────────
useGeolocation();
