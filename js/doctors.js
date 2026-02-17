(function () {
    const openBtn = document.getElementById('openAddDoctor');
    const modal = document.getElementById('addDoctorModal');
    const closeBtn = document.getElementById('closeAddDoctor');
    const backdrop = document.getElementById('closeAddDoctorBackdrop');
    const form = document.getElementById('addDoctorForm');
    const rowsContainer = document.getElementById('doctorsRows');

    if (!openBtn || !modal || !closeBtn || !backdrop || !form || !rowsContainer) {
        return;
    }

    const storageKey = 'doctors';

    const getDoctors = () => {
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

    const setDoctors = (doctors) => {
        localStorage.setItem(storageKey, JSON.stringify(doctors));
    };

    const escapeHtml = (value) => {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const renderRow = (doctor) => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.setAttribute('role', 'row');
        row.innerHTML = `
            <div class="table-cell">${escapeHtml(doctor.name)}</div>
            <div class="table-cell">${escapeHtml(doctor.email)}</div>
            <div class="table-cell">${escapeHtml(doctor.phone)}</div>
            <div class="table-cell"><button type="button" class="details-btn" data-id="${escapeHtml(doctor.id)}">تفاصيل</button></div>
            <div class="table-cell">${escapeHtml(doctor.code)}</div>
        `.trim();

        return row;
    };

    const renderDoctors = (doctors) => {
        rowsContainer.innerHTML = '';
        doctors.forEach((d) => rowsContainer.appendChild(renderRow(d)));
    };

    const seedIfEmpty = () => {
        const existing = getDoctors();
        if (existing.length) {
            return existing;
        }

        const seeded = [
            {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                name: 'إبراهيم محمد',
                email: 'mohamed99@gmail.com',
                phone: '011166552899',
                code: '65',
            },
            {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 1),
                name: 'محمد عصام',
                email: 'mohamed99@gmail.com',
                phone: '011166552899',
                code: '65',
            },
            {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 2),
                name: 'إبراهيم محمد',
                email: 'mohamed99@gmail.com',
                phone: '011166552899',
                code: '65',
            },
            {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 3),
                name: 'إبراهيم محمد',
                email: 'mohamed99@gmail.com',
                phone: '011166552899',
                code: '65',
            },
        ];

        setDoctors(seeded);
        return seeded;
    };

    let doctors = seedIfEmpty();
    renderDoctors(doctors);

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

        if (!name || !email || !phone) {
            alert('من فضلك املأ جميع الحقول');
            return;
        }

        const next = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            name,
            email,
            phone,
            code: String(65 + doctors.length),
        };

        doctors = [next, ...doctors];
        setDoctors(doctors);
        rowsContainer.prepend(renderRow(next));
        close();
    });

    rowsContainer.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('.details-btn') : null;
        if (!btn) {
            return;
        }

        const id = btn.getAttribute('data-id');
        if (!id) {
            return;
        }

        const doctor = doctors.find((d) => d.id === id);
        if (!doctor) {
            return;
        }

        alert(`الدكتور: ${doctor.name}\nالبريد: ${doctor.email}\nالهاتف: ${doctor.phone}\nالكود: ${doctor.code}`);
    });
})();
