(function () {
    const patientsContainer = document.getElementById('dashboardPatients');
    const visitsCanvas = document.getElementById('visitsChart');
    const statusCanvas = document.getElementById('statusChart');

    if (!patientsContainer || !visitsCanvas || !statusCanvas) {
        return;
    }

    const storageKey = 'patients';
    const avatars = ['images/avatar1.jpeg', 'images/avatar2.jpeg', 'images/avatar3.jpeg', 'images/avatar4.jpeg'];

    const getPatients = () => {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const escapeHtml = (value) => {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const formatDate = (d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const formatTime = (d) => {
        let h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const isAm = h < 12;
        h = h % 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${isAm ? 'صباحاً' : 'مساءً'}`;
    };

    const callIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    `.trim();

    const renderPatientCard = (p) => {
        const visitAt = p.visitAt ? new Date(p.visitAt) : new Date();
        const date = formatDate(visitAt);
        const time = formatTime(visitAt);
        const phone = String(p.phone || '').trim();
        const diagnosis = String(p.status || '').trim();
        const avatarIndex = typeof p.avatarIndex === 'number' ? p.avatarIndex : 0;
        const avatarSrc = avatars[(avatarIndex % avatars.length + avatars.length) % avatars.length];

        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <div class="patient-card-title">
                <div class="patient-name">اسم المريض : ${escapeHtml(p.name)}</div>
                <div class="patient-avatar"><img src="${escapeHtml(avatarSrc)}" alt="" /></div>
            </div>
            <div class="patient-row">
                <div class="patient-label">حالة المريض :</div>
                <div class="patient-value">${escapeHtml(p.status || '')}</div>
            </div>
            <div class="patient-row">
                <div class="patient-label">اخر تشخيص :</div>
                <div class="patient-value">${escapeHtml(diagnosis)}</div>
            </div>
            <div class="patient-row">
                <div class="patient-label">تاريخ الزيارة</div>
                <div class="patient-value">${escapeHtml(time)}</div>
            </div>
            <div class="patient-row">
                <div class="patient-label">${escapeHtml(date)}</div>
                <div class="patient-value">${escapeHtml(time)}</div>
            </div>
            <a class="patient-call" href="${phone ? `tel:${encodeURIComponent(phone)}` : '#'}" aria-label="call">
                ${callIcon}
            </a>
        `.trim();

        return card;
    };

    const groupVisitsByDay = (patients, days) => {
        const result = [];
        const labels = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
            result.push({ key, count: 0 });
        }

        const map = new Map(result.map((x) => [x.key, x]));
        patients.forEach((p) => {
            if (!p.visitAt) return;
            const key = String(p.visitAt).slice(0, 10);
            const bucket = map.get(key);
            if (bucket) bucket.count += 1;
        });

        return { labels, counts: result.map((x) => x.count) };
    };

    const groupByStatus = (patients) => {
        const counts = new Map();
        patients.forEach((p) => {
            const key = String(p.status || 'غير محدد').trim() || 'غير محدد';
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        const labels = Array.from(counts.keys());
        const values = labels.map((l) => counts.get(l) || 0);
        return { labels, values };
    };


    const trendLine = (values) => {
        if (values.length === 0) return [];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return values.map((v, i) => {
            const wave = Math.sin(i * 0.9) * avg * 0.18;
            return Math.max(0, avg * 0.62 + wave);
        });
    };

    const createCharts = (patients) => {
        const visits = groupVisitsByDay(patients, 7);
        const statuses = groupByStatus(patients);

        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                title: {
                    display: true,
                    color: 'rgba(0,0,0,0.65)',
                    font: { size: 11, weight: '600' },
                },
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(0,0,0,0.55)' },
                    grid: { color: 'rgba(0,0,0,0.08)' },
                },
                y: {
                    ticks: { color: 'rgba(0,0,0,0.55)' },
                    grid: { color: 'rgba(0,0,0,0.08)' },
                },
            },
        };

        new Chart(visitsCanvas, {
            type: 'bar',
            data: {
                labels: visits.labels,
                datasets: [
                    {
                        type: 'bar',
                        data: visits.counts,
                        backgroundColor: 'rgba(63, 177, 255, 0.85)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderWidth: 1,
                        order: 1,
                    },
                    {
                        type: 'line',
                        data: trendLine(visits.counts),
                        borderColor: 'rgba(13, 157, 219, 0.55)',
                        pointBackgroundColor: 'rgba(13, 157, 219, 0.6)',
                        pointRadius: 2,
                        tension: 0.35,
                        fill: false,
                        order: 0,
                    },
                ],
            },
            options: {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    title: { ...baseOptions.plugins.title, text: 'زيارات آخر 7 أيام' },
                },
            },
        });

        new Chart(statusCanvas, {
            type: 'bar',
            data: {
                labels: statuses.labels,
                datasets: [
                    {
                        type: 'bar',
                        data: statuses.values,
                        backgroundColor: 'rgba(13, 157, 219, 0.75)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    title: { ...baseOptions.plugins.title, text: 'توزيع حالات المرضى' },
                },
            },
        });
    };

    const renderDashboard = () => {
        const patients = getPatients();
        const cards = patients.slice(0, 4);
        patientsContainer.innerHTML = '';
        cards.forEach((p) => patientsContainer.appendChild(renderPatientCard(p)));
        return patients;
    };

    const patients = renderDashboard();
    createCharts(patients);
})();