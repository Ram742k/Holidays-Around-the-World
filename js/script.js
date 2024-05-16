document.addEventListener('DOMContentLoaded', async function() {
    const apiKey = '7MrbI4caQzAWi9nogVY0L8RedfIXoM5q';
    const countrySelect = document.getElementById('countrySelect');
    const holidaysList = document.getElementById('holidays-list');

    async function fetchSupportedCountries() {
        const apiUrl = `https://calendarific.com/api/v2/countries?api_key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            for (const country of data.response.countries) {
                const option = document.createElement('option');
                option.value = country['iso-3166'];
                option.textContent = country['country_name'];
                countrySelect.appendChild(option);
                await fetchCountryFlag(option, country['iso-3166']);
            }
        } catch (error) {
            console.error('Error fetching supported countries:', error);
        }
    }

    async function fetchCountryFlag(option, countryCode) {
        const body = document.body;

        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            const data = await response.json();
            if (!data[0].flags || !data[0].flags.svg) {
                console.error(`Flag data not found for ${countryCode}`);
                return;
            }
            const flagUrl = data[0].flags.svg;
            body.style.backgroundImage = `url('${flagUrl}')`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundPosition = 'center';
            const overlay = document.createElement('div');
            overlay.classList.add('background-overlay');
            body.appendChild(overlay);
        } catch (error) {
            console.error(`Error fetching flag for ${countryCode}:`, error);
        }
    }

    function formatDate(isoDate) {
        const dateParts = isoDate.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    function createHolidayCard(holiday) {
        const card = document.createElement('div');
        card.classList.add('card', 'col-sm-4', 'mb-3');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = holiday.name;
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        const formattedDate = formatDate(holiday.date.iso);
        cardText.textContent = formattedDate;
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardBody);
        return card;
    }

    async function fetchHolidays(countryCode, year) {
        const apiUrl = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${countryCode}&year=${year}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            holidaysList.innerHTML = '';
            for (const holiday of data.response.holidays) {
                const card = createHolidayCard(holiday);
                holidaysList.appendChild(card);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    }

    countrySelect.addEventListener('change', async function() {
        const selectedCountry = countrySelect.value;
        const currentYear = new Date().getFullYear();
        await fetchHolidays(selectedCountry, currentYear);
        await fetchCountryFlag(null, selectedCountry);
    });

    await fetchSupportedCountries();
});
