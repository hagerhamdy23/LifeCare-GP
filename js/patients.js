(function () {
    const openBtn = document.getElementById('openAddPatient');
    const modal = document.getElementById('addPatientModal');
    const closeBtn = document.getElementById('closeAddPatient');
    const backdrop = document.getElementById('closeAddPatientBackdrop');
    const form = document.getElementById('addPatientForm');
    const rowsContainer = document.getElementById('patientsRows');

    if (!openBtn || !modal || !closeBtn || !backdrop || !form || !rowsContainer) {
        return;
    }

    const storageKey = 'patients';

    const getPatients = () => {
        const raw = localStorage.getItem(storageKey);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const setPatients = (patients) => {
        localStorage.setItem(storageKey, JSON.stringify(patients));
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

    const escapeHtml = (value) => {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const renderRow = (patient) => {
        const d = patient.visitAt ? new Date(patient.visitAt) : new Date();
        const date = formatDate(d);
        const time = formatTime(d);

        const row = document.createElement('div');
        row.className = 'table-row';
        row.setAttribute('role', 'row');
        row.innerHTML = `
            <div class="table-cell">${escapeHtml(patient.name)}</div>
            <div class="table-cell">${escapeHtml(patient.code)}</div>
            <div class="table-cell">${escapeHtml(patient.email)}</div>
            <div class="table-cell">${escapeHtml(patient.phone)}</div>
            <div class="table-cell">${escapeHtml(patient.age)}</div>
            <div class="table-cell">${escapeHtml(patient.status)}</div>
            <div class="table-cell">
                <span class="date-badge">${escapeHtml(date)}</span>
                <span class="time-badge">${escapeHtml(time)}</span>
            </div>
            <div class="table-cell">${escapeHtml(patient.doctorName)}</div>
            <div class="table-cell">${escapeHtml(patient.doctorCode)}</div>
        `.trim();

        return row;
    };

    const renderPatients = (patients) => {
        rowsContainer.innerHTML = '';
        patients.forEach((p) => rowsContainer.appendChild(renderRow(p)));
    };

    const getDefaultDoctor = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            return { doctorName: 'كريم محمد', doctorCode: '65' };
        }

        try {
            const user = JSON.parse(loggedInUser);
            const name = (user && (user.name || user.email)) ? String(user.name || user.email) : 'كريم محمد';
            return { doctorName: name, doctorCode: '65' };
        } catch {
            return { doctorName: 'كريم محمد', doctorCode: '65' };
        }
    };

    const seedIfEmpty = () => {
        const existing = getPatients();
        if (existing.length) {
            return existing;
        }

        const { doctorName, doctorCode } = getDefaultDoctor();
        const seeded = [
            {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                name: 'إبراهيم محمد',
                code: '32+',
                email: 'mohamed99@gmail.com',
                phone: '011166552899',
                age: '23',
                gender: 'ذكر',
                status: 'مرضي السكري',
                visitAt: new Date().toISOString(),
                doctorName,
                doctorCode,
                avatarIndex: 0,
            },
        ];

        setPatients(seeded);
        return seeded;
    };

    let patients = seedIfEmpty();
    renderPatients(patients);

    const open = () => {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
    };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            close();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const phone = String(data.get('phone') || '').trim();
        const age = String(data.get('age') || '').trim();
        const gender = String(data.get('gender') || '').trim();
        const status = String(data.get('status') || '').trim();

        if (!name || !email || !phone || !age || !gender || !status) {
            alert('من فضلك املأ جميع الحقول');
            return;
        }

        const { doctorName, doctorCode } = getDefaultDoctor();
        const next = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            name,
            code: `${patients.length + 1}+`,
            email,
            phone,
            age,
            gender,
            status,
            visitAt: new Date().toISOString(),
            doctorName,
            doctorCode,
            avatarIndex: patients.length % 4,
        };

        patients = [next, ...patients];
        setPatients(patients);
        rowsContainer.prepend(renderRow(next));
        close();
    });
})();
