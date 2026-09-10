// World Clock System

// Comprehensive timezone database
const TIMEZONES = [
    // Americas
    { city: 'New York', region: 'USA (Eastern)', timezone: 'America/New_York', offset: -5 },
    { city: 'Los Angeles', region: 'USA (Pacific)', timezone: 'America/Los_Angeles', offset: -8 },
    { city: 'Chicago', region: 'USA (Central)', timezone: 'America/Chicago', offset: -6 },
    { city: 'Denver', region: 'USA (Mountain)', timezone: 'America/Denver', offset: -7 },
    { city: 'Toronto', region: 'Canada (Eastern)', timezone: 'America/Toronto', offset: -5 },
    { city: 'Vancouver', region: 'Canada (Pacific)', timezone: 'America/Vancouver', offset: -8 },
    { city: 'Mexico City', region: 'Mexico', timezone: 'America/Mexico_City', offset: -6 },
    { city: 'São Paulo', region: 'Brazil', timezone: 'America/Sao_Paulo', offset: -3 },
    { city: 'Buenos Aires', region: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', offset: -3 },
    
    // Europe
    { city: 'London', region: 'United Kingdom', timezone: 'Europe/London', offset: 0 },
    { city: 'Paris', region: 'France', timezone: 'Europe/Paris', offset: 1 },
    { city: 'Berlin', region: 'Germany', timezone: 'Europe/Berlin', offset: 1 },
    { city: 'Madrid', region: 'Spain', timezone: 'Europe/Madrid', offset: 1 },
    { city: 'Rome', region: 'Italy', timezone: 'Europe/Rome', offset: 1 },
    { city: 'Moscow', region: 'Russia', timezone: 'Europe/Moscow', offset: 3 },
    { city: 'Istanbul', region: 'Turkey', timezone: 'Europe/Istanbul', offset: 3 },
    { city: 'Dubai', region: 'UAE', timezone: 'Asia/Dubai', offset: 4 },
    
    // Asia
    { city: 'Hong Kong', region: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8 },
    { city: 'Shanghai', region: 'China', timezone: 'Asia/Shanghai', offset: 8 },
    { city: 'Tokyo', region: 'Japan', timezone: 'Asia/Tokyo', offset: 9 },
    { city: 'Seoul', region: 'South Korea', timezone: 'Asia/Seoul', offset: 9 },
    { city: 'Bangkok', region: 'Thailand', timezone: 'Asia/Bangkok', offset: 7 },
    { city: 'Singapore', region: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
    { city: 'Delhi', region: 'India', timezone: 'Asia/Kolkata', offset: 5.5 },
    { city: 'Manila', region: 'Philippines', timezone: 'Asia/Manila', offset: 8 },
    
    // Oceania
    { city: 'Sydney', region: 'Australia', timezone: 'Australia/Sydney', offset: 10 },
    { city: 'Melbourne', region: 'Australia', timezone: 'Australia/Melbourne', offset: 10 },
    { city: 'Auckland', region: 'New Zealand', timezone: 'Pacific/Auckland', offset: 12 },
    { city: 'Fiji', region: 'Fiji', timezone: 'Pacific/Fiji', offset: 12 },
    { city: 'Honolulu', region: 'USA (Hawaii)', timezone: 'Pacific/Honolulu', offset: -10 },
];

class WorldClock {
    constructor() {
        this.currentSort = 'offset';
        this.init();
    }

    init() {
        this.renderTimezoneClocks();
        this.populateSelects();
        this.setupEventListeners();
        this.startClocks();
    }

    // Format time with leading zeros
    formatTime(hours, minutes, seconds) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Get current time in specific timezone
    getTimeInTimezone(timezone) {
        const now = new Date();
        const utcTime = now.toLocaleString('en-US', { timeZone: 'UTC' });
        const tzTime = now.toLocaleString('en-US', { timeZone: timezone });
        
        const tzDate = new Date(tzTime);
        return {
            hours: tzDate.getHours(),
            minutes: tzDate.getMinutes(),
            seconds: tzDate.getSeconds(),
            date: tzDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        };
    }

    // Get local timezone
    getLocalTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            return 'UTC';
        }
    }

    // Update local clock
    updateLocalClock() {
        const localTz = this.getLocalTimezone();
        const time = this.getTimeInTimezone(localTz);
        const formattedTime = this.formatTime(time.hours, time.minutes, time.seconds);
        
        const localTimeEl = document.getElementById('localTime');
        if (localTimeEl) {
            localTimeEl.querySelector('.time').textContent = formattedTime;
            document.getElementById('localDate').textContent = time.date;
            document.getElementById('localTimezone').textContent = localTz;
        }
    }

    // Render timezone clocks
    renderTimezoneClocks(filter = '') {
        const grid = document.getElementById('timezonesGrid');
        let timezones = [...TIMEZONES];

        // Filter
        if (filter) {
            timezones = timezones.filter(tz => 
                tz.city.toLowerCase().includes(filter.toLowerCase()) ||
                tz.region.toLowerCase().includes(filter.toLowerCase())
            );
        }

        // Sort
        if (this.currentSort === 'offset') {
            timezones.sort((a, b) => a.offset - b.offset);
        } else {
            timezones.sort((a, b) => a.city.localeCompare(b.city));
        }

        grid.innerHTML = timezones.map((tz, index) => `
            <div class="timezone-clock" data-timezone="${tz.timezone}" data-index="${index}">
                <div class="city">${tz.city}</div>
                <div class="region">${tz.region}</div>
                <div class="time" data-time="${tz.timezone}">00:00:00</div>
                <div class="am-pm" data-ampm="${tz.timezone}">AM</div>
                <div class="offset">UTC ${tz.offset > 0 ? '+' : ''}${tz.offset}</div>
            </div>
        `).join('');

        this.updateAllClocks();
    }

    // Update all timezone clocks
    updateAllClocks() {
        document.querySelectorAll('.timezone-clock').forEach(clock => {
            const timezone = clock.getAttribute('data-timezone');
            const time = this.getTimeInTimezone(timezone);
            const formattedTime = this.formatTime(time.hours, time.minutes, time.seconds);
            const ampm = time.hours >= 12 ? 'PM' : 'AM';
            
            clock.querySelector('[data-time]').textContent = formattedTime;
            clock.querySelector('[data-ampm]').textContent = ampm;
        });
    }

    // Start continuous updates
    startClocks() {
        this.updateLocalClock();
        this.updateAllClocks();

        setInterval(() => {
            this.updateLocalClock();
            this.updateAllClocks();
        }, 1000);
    }

    // Populate timezone selects
    populateSelects() {
        const fromSelect = document.getElementById('fromTimezone');
        const toSelect = document.getElementById('toTimezone');
        
        if (!fromSelect || !toSelect) return;

        const options = TIMEZONES.map(tz => 
            `<option value="${tz.timezone}" data-offset="${tz.offset}">${tz.city} (${tz.region})</option>`
        ).join('');

        fromSelect.innerHTML = options;
        toSelect.innerHTML = options;
        
        // Set defaults
        fromSelect.value = this.getLocalTimezone();
        toSelect.value = 'America/New_York';
    }

    // Convert time between zones
    convertTime() {
        const fromTz = document.getElementById('fromTimezone').value;
        const toTz = document.getElementById('toTimezone').value;
        const fromTimeStr = document.getElementById('fromTime').value;

        if (!fromTimeStr) return;

        const [hours, minutes] = fromTimeStr.split(':').map(Number);
        
        const fromTime = this.getTimeInTimezone(fromTz);
        const toTime = this.getTimeInTimezone(toTz);
        
        // Calculate difference
        const diffMinutes = ((toTime.hours * 60 + toTime.minutes) - (fromTime.hours * 60 + fromTime.minutes));
        
        let convertedHours = hours + Math.floor(diffMinutes / 60);
        let convertedMinutes = minutes + (diffMinutes % 60);
        
        if (convertedMinutes < 0) {
            convertedHours--;
            convertedMinutes += 60;
        }
        
        if (convertedHours < 0) convertedHours += 24;
        if (convertedHours >= 24) convertedHours -= 24;
        
        const result = `${String(convertedHours).padStart(2, '0')}:${String(convertedMinutes).padStart(2, '0')}`;
        document.getElementById('toTime').value = result;

        const resultDiv = document.getElementById('convertedTime');
        const fromTzName = document.getElementById('fromTimezone').selectedOptions[0].text;
        const toTzName = document.getElementById('toTimezone').selectedOptions[0].text;
        
        resultDiv.innerHTML = `
            <strong>${fromTimeStr}</strong> in ${fromTzName} = 
            <strong>${result}</strong> in ${toTzName}
        `;
        resultDiv.classList.remove('empty');
    }

    // Setup event listeners
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('timezoneSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.renderTimezoneClocks(e.target.value);
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                const searchValue = searchInput?.value || '';
                this.renderTimezoneClocks(searchValue);
            });
        }

        // Converter
        const fromTime = document.getElementById('fromTime');
        const fromTz = document.getElementById('fromTimezone');
        const toTz = document.getElementById('toTimezone');
        
        if (fromTime) fromTime.addEventListener('change', () => this.convertTime());
        if (fromTz) fromTz.addEventListener('change', () => this.convertTime());
        if (toTz) toTz.addEventListener('change', () => this.convertTime());
    }
}

// Initialize clock system
const worldClock = new WorldClock();

// Meeting Planner Function
function planMeeting() {
    const meetingInput = document.getElementById('meetingTime');
    const resultsDiv = document.getElementById('meetingResults');

    if (!meetingInput.value) {
        alert('Please select a date and time');
        return;
    }

    const meetingTime = new Date(meetingInput.value);
    resultsDiv.innerHTML = TIMEZONES.map(tz => {
        // Convert meeting time to timezone
        const tzTime = new Date(meetingTime.toLocaleString('en-US', { timeZone: tz.timezone }));
        const hours = String(tzTime.getHours()).padStart(2, '0');
        const minutes = String(tzTime.getMinutes()).padStart(2, '0');
        const date = tzTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return `
            <div class="meeting-time">
                <div class="city">${tz.city}</div>
                <div class="time">${hours}:${minutes}</div>
                <div class="date">${date}</div>
            </div>
        `;
    }).join('');
}

// Make functions globally available
window.planMeeting = planMeeting;