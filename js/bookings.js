(function () {
    const grid = document.getElementById('calendarGrid');
    const selectedDay = document.getElementById('selectedDay');
    const details = document.getElementById('bookingDetails');
    const closeBtn = document.getElementById('closeBooking');

    const bookingDateTitle = document.getElementById('bookingDateTitle');
    const bookingPatient = document.getElementById('bookingPatient');
    const bookingTime = document.getElementById('bookingTime');
    const bookingStatus = document.getElementById('bookingStatus');

    if (!grid || !selectedDay || !details || !closeBtn || !bookingDateTitle || !bookingPatient || !bookingTime || !bookingStatus) {
        return;
    }

    const state = {
        selectedIndex: 0,
    };

    const cells = [];

    const openDetails = (payload) => {
        bookingDateTitle.textContent = payload.dateTitle;
        bookingPatient.textContent = payload.patient;
        bookingTime.textContent = payload.time;
        bookingStatus.textContent = payload.status;

        details.classList.add('is-open');
        details.setAttribute('aria-hidden', 'false');
    };

    const closeDetails = () => {
        details.classList.remove('is-open');
        details.setAttribute('aria-hidden', 'true');
    };

    closeBtn.addEventListener('click', closeDetails);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && details.classList.contains('is-open')) {
            closeDetails();
        }
    });

    const monthLabel = (d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]}`;
    };

    const renderHeader = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        selectedDay.textContent = `${days[date.getDay()]}, ${monthLabel(date)} ${date.getDate()}`;
    };

    const createCells = () => {
        const now = new Date();
        const base = new Date(now);
        base.setDate(now.getDate() - (now.getDay() % 7));
        base.setHours(0, 0, 0, 0);

        for (let i = 0; i < 28; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);

            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.textContent = String(d.getDate());
            cell.setAttribute('data-index', String(i));

            cell.addEventListener('click', () => {
                state.selectedIndex = i;
                cells.forEach((c) => c.classList.remove('is-selected'));
                cell.classList.add('is-selected');
                renderHeader(d);

                openDetails({
                    dateTitle: `${d.getDate()} ${monthLabel(d)} ${d.getFullYear()}`,
                    patient: 'محمد عزت',
                    time: '10:00 صباحاً',
                    status: 'ضغط الدم',
                });
            });

            grid.appendChild(cell);
            cells.push(cell);
        }

        const initialDate = new Date(base);
        initialDate.setDate(base.getDate() + state.selectedIndex);
        cells[state.selectedIndex].classList.add('is-selected');
        renderHeader(initialDate);
    };

    createCells();
})();
