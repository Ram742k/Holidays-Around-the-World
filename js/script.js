document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '7MrbI4caQzAWi9nogVY0L8RedfIXoM5q';
    const countrySelect = document.getElementById('countrySelect');
    const holidaysList = document.getElementById('holidays-list');

    // Function to fetch supported countries
    function fetchSupportedCountries() {
        const apiUrl = `https://calendarific.com/api/v2/countries?api_key=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.response.countries.forEach(country => {
                    
                    const option = document.createElement('option');
                    option.value = country['iso-3166'];
                    option.textContent = country['country_name'];

                    
                    countrySelect.appendChild(option);

                    
                    fetchCountryFlag(option, country['iso-3166']);
                });
            })
            .catch(error => {
                console.error('Error fetching supported countries:', error);
            });
    }

    function fetchCountryFlag(option, countryCode) {
        
        const body = document.body;

        
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then(response => response.json())
            .then(data => {
        
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
            })
            .catch(error => {
                console.error(`Error fetching flag for ${countryCode}:`, error);
            });
    }
    function formatDate(isoDate) {
        const dateParts = isoDate.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    // Function to create Bootstrap cards for holidays
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

    // Function to fetch and display holidays
    function fetchHolidays(countryCode, year) {
        const apiUrl = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${countryCode}&year=${year}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                holidaysList.innerHTML = '';

                data.response.holidays.forEach(holiday => {
                    
                    const card = createHolidayCard(holiday);
                    
                    holidaysList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching holidays:', error);
            });
    }

    
    countrySelect.addEventListener('change', function() {
        const selectedCountry = countrySelect.value;
        const currentYear = new Date().getFullYear();
        fetchHolidays(selectedCountry, currentYear);
        fetchCountryFlag(null, selectedCountry);
    });

    
    fetchSupportedCountries();
});
