const API_BASE_URL = "https://rent-management-168879.onrender.com";
const API_URL = API_BASE_URL;

let currentMode = 'login';
let currentUser = null;

function switchMode(mode) {
  currentMode = mode;
  document.getElementById('loginTab').classList.toggle('active', mode === 'login');
  document.getElementById('registerTab').classList.toggle('active', mode === 'register');
  document.getElementById('roomType').classList.toggle('hidden', mode === 'login');
  document.getElementById('authBtnText').textContent = mode === 'login' ? 'Login' : 'Register';
  document.getElementById('authMessage').textContent = '';
}

function setAuthLoading(isLoading) {
  document.getElementById('authBtn').disabled = isLoading;
  document.getElementById('authSpinner').classList.toggle('hidden', !isLoading);
  document.getElementById('authBtnText').textContent = isLoading ? (currentMode === 'login' ? 'Logging in...' : 'Registering...') : (currentMode === 'login' ? 'Login' : 'Register');
}

function setPayLoading(isLoading) {
  document.getElementById('payBtn').disabled = isLoading;
  document.getElementById('paySpinner').classList.toggle('hidden', !isLoading);
  document.getElementById('payBtnText').textContent = isLoading ? 'Processing...' : 'Pay';
}

async function handleAuth(e) {
  e.preventDefault();
  setAuthLoading(true);
  document.getElementById('authMessage').textContent = '';
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const roomType = document.getElementById('roomType').value;
  const endpoint = currentMode === 'login' ? '/api/rent/login' : '/api/rent/register';
  const payload = currentMode === 'login' ? { email, password } : { email, password, roomType };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      document.getElementById('authMessage').textContent = data.message || 'Failed';
      return;
    }
    currentUser = currentMode === 'login' ? data : data.tenant;
    showDashboard();
  } catch (err) {
    document.getElementById('authMessage').textContent = 'Cannot connect to API. Render is waking up, try again in 30s...';
  } finally {
    setAuthLoading(false);
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
  const el = document.getElementById('pricingInfo');
  try {
    const res = await fetch(`${API_BASE_URL}/api/rent/pricing`);
    const data = await res.json();
    el.innerHTML = Object.entries(data).map(([k, v]) => `<strong>${k}</strong>: Rent ${v.rent}, Power ${v.power}, Water ${v.water}`).join(' | ');
  } catch {
    el.innerHTML = '<span style="color:#e74c3c">Failed to load pricing</span>';
  }
}

async function handlePay(e) {
  e.preventDefault();
  setPayLoading(true);
  document.getElementById('payMessage').textContent = '';
  
  const billType = document.getElementById('billType').value;
  const amountPaid = parseFloat(document.getElementById('amount').value);
  try {
    const res = await fetch(`${API_BASE_URL}/api/rent/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email, billType, amountPaid }),
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
  } catch {
    document.getElementById('payMessage').textContent = 'Payment failed - check connection';
  } finally {
    setPayLoading(false);
  }
}

function logout() {
  currentUser = null;
  document.getElementById('dashboardSection').classList.add('hidden');
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('authForm').reset();
}