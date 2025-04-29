function toggleMenu() {
    const nav = document.querySelector('.navbar-nav');
    nav.classList.toggle('active');
}

function toggleAttendance(checkbox, otherClass, type, index, kelompok) {
    const row = checkbox.parentElement.parentElement;
    const otherCheckbox = row.querySelector(`.${otherClass}`);
    const reasonInput = row.querySelector(`.reason-input.${type}-${index}`);
    
    if (checkbox.checked) {
        otherCheckbox.checked = false;
    }
    
    reasonInput.style.display = row.querySelector(`.tidak-${type}`).checked ? 'block' : 'none';
}

function saveAttendance() {
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    let attendanceData = {};
    let tidakHadirPutra = [];
    let tidakHadirPutri = [];
    const timestamp = new Date().toISOString();

    kelompok.forEach(group => {
        attendanceData[group] = { putra: [], putri: [] };

        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value || '';

            if (nama) {
                let status = hadir ? 'Hadir' : (tidakHadir ? 'Tidak Hadir' : 'Tidak Hadir Tanpa Keterangan');
                attendanceData[group].putra.push({ no, nama, status, alasan, kelompok: group });
                if (!hadir) {
                    tidakHadirPutra.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
                }
            }
        });

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value || '';

            if (nama) {
                let status = hadir ? 'Hadir' : (tidakHadir ? 'Tidak Hadir' : 'Tidak Hadir Tanpa Keterangan');
                attendanceData[group].putri.push({ no, nama, status, alasan, kelompok: group });
                if (!hadir) {
                    tidakHadirPutri.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
                }
            }
        });
    });

    const tidakHadirPutraUl = document.getElementById('tidakHadirPutra');
    tidakHadirPutraUl.innerHTML = '';
    if (tidakHadirPutra.length === 0) {
        tidakHadirPutraUl.innerHTML = '<li>Tidak ada yang tidak hadir.</li>';
    } else {
        tidakHadirPutra.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            tidakHadirPutraUl.appendChild(li);
        });
    }

    const tidakHadirPutriUl = document.getElementById('tidakHadirPutri');
    tidakHadirPutriUl.innerHTML = '';
    if (tidakHadirPutri.length === 0) {
        tidakHadirPutriUl.innerHTML = '<li>Tidak ada yang tidak hadir.</li>';
    } else {
        tidakHadirPutri.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            tidakHadirPutriUl.appendChild(li);
        });
    }

    let savedData = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
    savedData.push({ timestamp, data: attendanceData });
    localStorage.setItem('attendanceHistory', JSON.stringify(savedData));

    console.log(attendanceData);
    alert('Absensi telah disimpan! Cek konsol untuk data.');
}

function sendToWhatsApp() {
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    let tidakHadirPutra = [];
    let tidakHadirPutri = [];

    kelompok.forEach(group => {
        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value || '';

            if (nama && !hadir) {
                tidakHadirPutra.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
            }
        });

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value || '';

            if (nama && !hadir) {
                tidakHadirPutri.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
            }
        });
    });

    let message = '*Daftar Tidak Hadir*\n\n*Putra:*\n';
    if (tidakHadirPutra.length === 0) {
        message += 'Tidak ada yang tidak hadir.\n';
    } else {
        tidakHadirPutra.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });
    }

    message += '\n*Putri:*\n';
    if (tidakHadirPutri.length === 0) {
        message += 'Tidak ada yang tidak hadir.\n';
    } else {
        tidakHadirPutri.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+6283801847614?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function loginAdmin() {
    const adminName = document.getElementById('adminName').value;
    const adminPassword = document.getElementById('adminPassword').value;

    if (adminName === 'admin' && adminPassword === 'password123') {
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        loadDashboard();
    } else {
        alert('Nama atau password salah!');
    }
}

function loadDashboard() {
    const savedData = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
    let attendanceStats = {};
    let reasonStats = {};
    let noReasonStats = {};

    savedData.forEach(entry => {
        Object.keys(entry.data).forEach(group => {
            ['putra', 'putri'].forEach(type => {
                entry.data[group][type].forEach(person => {
                    const key = `${person.nama} (${person.kelompok})`;
                    if (!attendanceStats[key]) {
                        attendanceStats[key] = { hadir: 0, izin: 0, tanpaKeterangan: 0 };
                    }
                    if (person.status === 'Hadir') {
                        attendanceStats[key].hadir++;
                    } else if (person.status === 'Tidak Hadir' && person.alasan) {
                        attendanceStats[key].izin++;
                        if (!reasonStats[key]) {
                            reasonStats[key] = 0;
                        }
                        reasonStats[key]++;
                    } else if (person.status === 'Tidak Hadir Tanpa Keterangan') {
                        attendanceStats[key].tanpaKeterangan++;
                        if (!noReasonStats[key]) {
                            noReasonStats[key] = 0;
                        }
                        noReasonStats[key]++;
                    }
                });
            });
        });
    });

    const attendanceLabels = Object.keys(attendanceStats);
    const attendanceData = attendanceLabels.map(key => attendanceStats[key].hadir);
    new Chart(document.getElementById('attendanceChart'), {
        type: 'bar',
        data: {
            labels: attendanceLabels,
            datasets: [{
                label: 'Jumlah Kehadiran',
                data: attendanceData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: {
                    labels: { font: { size: 12 } }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const reasonLabels = Object.keys(reasonStats);
    const reasonData = reasonLabels.map(key => reasonStats[key]);
    new Chart(document.getElementById('reasonChart'), {
        type: 'bar',
        data: {
            labels: reasonLabels,
            datasets: [{
                label: 'Jumlah Izin',
                data: reasonData,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: {
                    labels: { font: { size: 12 } }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const noReasonLabels = Object.keys(noReasonStats);
    const noReasonData = noReasonLabels.map(key => noReasonStats[key]);
    new Chart(document.getElementById('noReasonChart'), {
        type: 'bar',
        data: {
            labels: noReasonLabels,
            datasets: [{
                label: 'Jumlah Tanpa Keterangan',
                data: noReasonData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: {
                    labels: { font: { size: 12 } }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const warningTableBody = document.getElementById('warningTableBody');
    warningTableBody.innerHTML = '';
    Object.keys(noReasonStats).forEach(key => {
        if (noReasonStats[key] >= 3) {
            const [nama, kelompok] = key.split(' (');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nama}</td>
                <td>${kelompok.slice(0, -1)}</td>
                <td>${noReasonStats[key]}</td>
            `;
            warningTableBody.appendChild(row);
        }
    });
    if (warningTableBody.innerHTML === '') {
        warningTableBody.innerHTML = '<tr><td colspan="3">Tidak ada yang tidak hadir 3 kali tanpa keterangan.</td></tr>';
    }
}

if (window.location.pathname.includes('admin.html')) {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        loadDashboard();
    }
}