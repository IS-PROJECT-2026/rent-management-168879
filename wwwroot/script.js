const API_URL = "https://rent-management-168879.onrender.com"

let currentMode = 'login';
let currentUser = null;

function switchMode(mode) {
    currentMode = mode;
    document.getElementById('loginTab').classList.toggle('active', mode === 'login');
    document.getElementById('registerTab').classList.toggle('active', mode === 'register');
    document.getElementById('roomType').classList.toggle('hidden', mode === 'login');
    document.getElementById('authBtn').textContent = mode === 'login' ? 'Login' : 'Register';
    document.getElementById('authMessage').textContent = '';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const roomType = document.getElementById('roomType').value;
    const endpoint = currentMode === 'login' ? '/api/rent/login' : '/api/rent/register';
    const payload = currentMode === 'login' ? { email, password } : { email, password, roomType };

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
            document.getElementById('authMessage').textContent = data.message || 'Failed';
            return;
        }
        currentUser = currentMode === 'login' ? data : data.tenant;
        showDashboard();
    } catch (err) {
        document.getElementById('authMessage').textContent = 'Cannot connect to API. Is server running on ' + API_BASE_URL;
    }
}

function showDashboard() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRoom').textContent = currentUser.roomType;
    document.getElementById('dateJoined').textContent = currentUser.dateJoined;
    document.getElementById('rentPaid').textContent = currentUser.rentPaid;
    document.getElementById('rentBalance').textContent = currentUser.rentBalance;
    document.getElementById('rentDate').textContent = currentUser.dateRentWasPaid || '-';
    document.getElementById('powerPaid').textContent = currentUser.powerPaid;
    document.getElementById('powerBalance').textContent = currentUser.powerBalance;
    document.getElementById('powerDate').textContent = currentUser.datePowerWasPaid || '-';
    document.getElementById('waterPaid').textContent = currentUser.waterPaid;
    document.getElementById('waterBalance').textContent = currentUser.waterBalance;
    document.getElementById('waterDate').textContent = currentUser.dateWaterWasPaid || '-';
    loadPricing();
}

async function loadPricing() {
    const res = await fetch(`${API_BASE_URL}/api/rent/pricing`);
    const data = await res.json();
    document.getElementById('pricingInfo').innerHTML = Object.entries(data).map(([k,v]) => 
        `<strong>${k}</strong>: Rent ${v.rent}, Power ${v.power}, Water ${v.water}`
    ).join(' | ');
}

async function handlePay(e) {
    e.preventDefault();
    const billType = document.getElementById('billType').value;
    const amountPaid = parseFloat(document.getElementById('amount').value);
    const res = await fetch(`${API_BASE_URL}/api/rent/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, billType, amountPaid })
    });
    const data = await res.json();
    if (!res.ok) {
        document.getElementById('payMessage').textContent = data.message;
        return;
    }
    currentUser = data;
    showDashboard();
    document.getElementById('payMessage').textContent = 'Payment successful!';
    document.getElementById('amount').value = '';
}

function logout() {
    currentUser = null;
    document.getElementById('dashboardSection').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('authForm').reset();
}