document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('patientModal');
    const closeBackdrop = document.getElementById('closeModalBackdrop');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    const modalPatientName = document.getElementById('modalPatientName');
    const modalOrderId = document.getElementById('modalOrderId');

    const openModal = (patientName, orderId) => {
        if (modalPatientName && modalOrderId) {
            modalPatientName.textContent = patientName;
            modalOrderId.textContent = orderId;
        }
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('.table-row');
            if (row) {
                const patientName = btn.getAttribute('data-patient') || row.querySelector('.cell:nth-child(1)').textContent;
                const orderId = btn.getAttribute('data-order') || row.querySelector('.cell:nth-child(2)').textContent;
                openModal(patientName, orderId);
            }
        });
    });

    if (closeBackdrop) {
        closeBackdrop.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
