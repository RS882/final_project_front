const burger = document.querySelector(".burger");
const panel = document.querySelector(".panel");
const burgerLinks = document.querySelectorAll(".b_link a");

burger.addEventListener("click", e => {
	burger.classList.toggle("_show");
	panel.classList.toggle("_go");

})

burgerLinks.forEach(e => {
	e.addEventListener("click", ev => {
		panel.classList.remove("_go");
		burger.classList.remove("_show");
	})
})



const parseWeatherCode = (code) => {
	switch (+code) {
		case 0:
			return `Clear sky`;
		case 1:
			return `Mainly clear`;
		case 2:
			return `Partly cloudy`;
		case 3:
			return `Overcast`;
		case 45:
			return `Fog`;
		case 48:
			return `Depositing rime fog`;
		case 51:
			return `Drizzle: Light`;
		case 53:
			return `Drizzle: Moderate`;
		case 55:
			return `Drizzle: Dense intensity`;
		case 56:
			return `Freezing Drizzle: Light `;
		case 57:
			return `Freezing Drizzle: Dense intensity`;
		case 61:
			return `Rain: Slight`;
		case 63:
			return `Rain: Moderate`;
		case 65:
			return `Rain: Heavy intensity`;
		case 66:
			return `Freezing Rain: Light`;
		case 67:
			return `Freezing Rain: Heavy intensity`;
		case 71:
			return `Snow fall: Slight`;
		case 73:
			return `Snow fall: Moderate`;
		case 75:
			return `Snow fall: Heavy intensity`;
		case 77:
			return `Snow grains`;
		case 80:
			return `Rain showers: Slight`;
		case 81:
			return `Rain showers: Moderate`;
		case 82:
			return `Rain showers: Violent`;
		case 85:
			return `Snow showers slight`;
		case 86:
			return `Snow showers heavy`;
		case 95:
			return `Thunderstorm: Slight or moderate`;
		case 96:
			return `Thunderstorm with slight`;
		case 99:
			return `Thunderstorm with heavy hail`;
		default:
			return `The weather is very strange right now...`;
	}

}

const parseWindSpead = (speed) => {
	if (speed < 1) return '#FFF';
	else if (speed <= 5) return '#AEF1F9';
	else if (speed <= 11) return '#96F7DC';
	else if (speed <= 19) return '#96F7B4';
	else if (speed <= 28) return '#6FF46F';
	else if (speed <= 38) return '#73ED12';
	else if (speed <= 49) return '#A4ED12';
	else if (speed <= 61) return '#DAED12';
	else if (speed <= 88) return '#EDC212';
	else if (speed <= 102) return '#ED6312';
	else if (speed <= 117) return '##ED2912';
	else return '#D5102D';

}

const parseWindDirection = (dir) => {

	if (dir > 337.5 || dir <= 22.5) {
		return 'North';
	} else if (dir <= 67.5) {
		return 'North-East';
	} else if (dir <= 112.5) {
		return 'East';
	} else if (dir <= 157.5) {
		return 'South-East';
	} else if (dir <= 202.5) {
		return 'South';
	} else if (dir <= 247.5) {
		return 'South-West';
	} else if (dir <= 292.5) {
		return 'West';
	} else if (dir <= 337.5) {
		return 'North-West';
	} else {
		return 'Unknown direction';
	}

}

const getGeodata = async () => {
	try {
		const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
		const { latitude, longitude, city, country, region } = await res.json();
		return { latitude, longitude, city, country, region };
	} catch (e) { throw e }

}

const getMeteo = async () => {
	try {
		const { latitude, longitude, ...props } = await getGeodata();
		const res = await fetch(`https://api.open-meteo.com/v1/forecast?
		latitude=${latitude}&
		longitude=${longitude}&
		current_weather=${true}`);



		const {
			current_weather: { temperature, windspeed, winddirection, weathercode },
			current_weather_units
		} = await res.json();

		const {
			temperature: uT = current_weather_units.temperature,
			windspeed: uWs = current_weather_units.windspeed,
			winddirection: uWd = current_weather_units.winddirection
		} = current_weather_units;

		return {
			temperature: [temperature, uT], windspeed: [windspeed, uWs],
			winddirection: [winddirection, uWd], weathercode: parseWeatherCode(weathercode), ...props
		};
	} catch (e) { throw e }
};





const addWeatherCard = async () => {
	const cartN = document.querySelector(`.weather_card`);

	try {
		const {
			temperature, windspeed,
			winddirection, weathercode, city, country, region } = await getMeteo();

		const addP = (el, text = '') => {
			const span = document.createElement('span');
			const p = document.createElement('p');
			span.textContent = el;
			p.innerText = text;
			if (text.startsWith('Temperature')) {
				span.style.color = +temperature[0] > 0 ? '#ff4d6d' : '#4361ee';
			}
			if (text.startsWith('Wind speed')) {
				span.style.color = parseWindSpead(+windspeed[0]);
			}
			if (text.startsWith('Wind direction')) {
				const dir = el.split(' ');
				span.textContent = parseWindDirection(+dir[0]) + ' (' + el + ')';

			}

			p.append(span);
			return p;
		}

		const nodes = [];
		nodes.push(addP(country, `Country: `));
		nodes.push(addP(region, `Region: `));
		nodes.push(addP(city, 'City: '));
		nodes.push(addP(temperature[0] + " " + temperature[1], 'Temperature: '));
		nodes.push(addP(windspeed[0] + " " + windspeed[1], 'Wind speed: '));
		nodes.push(addP(winddirection[0] + " " + winddirection[1], 'Wind direction: '));
		nodes.push(addP(weathercode, 'General: '));

		cartN.append(...nodes)

	} catch (e) {
		return "Something went wrong :" + e;
	}
}

addWeatherCard();