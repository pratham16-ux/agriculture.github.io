/* ══════════════════════════════════════════
   AGRIFLOW — Full Shared App JS
   Auth + Validation + Sidebar + Dashboard
══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   AUTH HELPERS
───────────────────────────────────────── */

function saveUser(email, role, name) {
  localStorage.setItem('af_email', email);
  localStorage.setItem('af_role', role);
  localStorage.setItem('af_name', name || email.split('@')[0]);
}

function getUser() {
  return {
    email: localStorage.getItem('af_email') || '',
    role: localStorage.getItem('af_role') || '',
    name: localStorage.getItem('af_name') || 'User'
  };
}

function logout() {
  localStorage.removeItem('af_email');
  localStorage.removeItem('af_role');
  localStorage.removeItem('af_name');

  alert("Logged out successfully");

  window.location.href = './login.html';
}

/* ─────────────────────────────────────────
   ROLE SELECT
───────────────────────────────────────── */

function selectRole(btn) {

  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  btn.classList.add('active');

  const role = btn.dataset.role;

  document.getElementById('selectedRole').value = role;

  // Toggle extra fields
  const ff = document.getElementById('farmerFields');
  const bf = document.getElementById('buyerFields');

  if (ff) {
    ff.style.display = role === 'farmer'
      ? 'block'
      : 'none';
  }

  if (bf) {
    bf.style.display = role === 'buyer'
      ? 'block'
      : 'none';
  }
}

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */

function handleLogin(e) {

  e.preventDefault();

  const email =
    document.getElementById('email').value.trim();

  const password =
    document.getElementById('password')
      ? document.getElementById('password').value.trim()
      : '';

  const role =
    document.getElementById('selectedRole').value;

  const msg =
    document.getElementById('auth-msg');

  // Email validation
  if (!email) {
    if (msg) msg.textContent = 'Please enter email';
    return;
  }

  // Password validation
  if (!password) {
    if (msg) msg.textContent = 'Please enter password';
    return;
  }

  // Role validation
  if (!role) {
    if (msg) msg.textContent = 'Please select role';
    return;
  }

  // Save user
  saveUser(email, role);

  // Redirect
  const pages = {
    farmer: './dashboard-farmer.html',
    buyer: './dashboard-buyer.html',
    admin: './dashboard-admin.html'
  };

  window.location.href = pages[role];
}

/* ─────────────────────────────────────────
   PASSWORD TOGGLE
───────────────────────────────────────── */

function togglePass(id, btn) {

  const input = document.getElementById(id);

  if (!input) return;

  const icon = btn.querySelector('i');

  if (input.type === 'password') {

    input.type = 'text';

    if (icon) {
      icon.className = 'fa-solid fa-eye-slash';
    }

  } else {

    input.type = 'password';

    if (icon) {
      icon.className = 'fa-solid fa-eye';
    }
  }
}

/* ─────────────────────────────────────────
   REGISTER STEPS
───────────────────────────────────────── */

let regStep = 1;

function nextStep(n) {

  const current =
    document.getElementById('step' + regStep);

  const next =
    document.getElementById('step' + n);

  const dotCurrent =
    document.getElementById('dot' + regStep);

  const dotNext =
    document.getElementById('dot' + n);

  if (current) current.classList.remove('active');

  if (dotCurrent) {
    dotCurrent.classList.remove('active');
    dotCurrent.classList.add('done');
  }

  regStep = n;

  if (next) next.classList.add('active');

  if (dotNext) {
    dotNext.classList.add('active');
  }
}

function prevStep(n) {

  const current =
    document.getElementById('step' + regStep);

  const prev =
    document.getElementById('step' + n);

  const dotCurrent =
    document.getElementById('dot' + regStep);

  const dotPrev =
    document.getElementById('dot' + n);

  if (current) current.classList.remove('active');

  if (dotCurrent) {
    dotCurrent.classList.remove('active');
  }

  regStep = n;

  if (prev) prev.classList.add('active');

  if (dotPrev) {
    dotPrev.classList.remove('done');
    dotPrev.classList.add('active');
  }
}

/* ─────────────────────────────────────────
   REGISTER
───────────────────────────────────────── */

function handleRegister(e) {

  e.preventDefault();

  // Inputs
  const role =
    document.getElementById('selectedRole').value;

  const firstNameInput =
    document.querySelector('#step1 input[type=text]');

  const emailInput =
    document.querySelector('#step1 input[type=email]');

  const passwordInput =
    document.getElementById('reg-pass');

  const confirmInput =
    document.getElementById('confirm-pass');

  // Values
  const firstName =
    firstNameInput
      ? firstNameInput.value.trim()
      : '';

  const email =
    emailInput
      ? emailInput.value.trim()
      : '';

  const password =
    passwordInput
      ? passwordInput.value.trim()
      : '';

  const confirmPassword =
    confirmInput
      ? confirmInput.value.trim()
      : '';

  /* VALIDATION */

  // Name
  if (!firstName) {
    alert('Please enter your name');
    return;
  }

  // Email
  if (!email) {
    alert('Please enter your email');
    return;
  }

  // Email format
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert('Enter valid email address');
    return;
  }

  // Password
  if (!password) {
    alert('Please enter password');
    return;
  }

  // Password length
  if (password.length < 8) {
    alert('Password must be minimum 8 characters');
    return;
  }

  // Confirm password
  if (!confirmPassword) {
    alert('Please confirm password');
    return;
  }

  // Match
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Role
  if (!role) {
    alert('Please select role');
    return;
  }

  // Save user
  saveUser(email, role, firstName);

  alert('Account created successfully');

  // Redirect
  window.location.href = './login.html';
}

/* ─────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────── */

function initStrength() {

  const input =
    document.getElementById('reg-pass');

  if (!input) return;

  input.addEventListener('input', function () {

    const value = this.value;

    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const fill =
      document.getElementById('strengthFill');

    const label =
      document.getElementById('strengthLabel');

    const colors = [
      '#e74c3c',
      '#e67e22',
      '#f1c40f',
      '#2ecc71',
      '#27ae60'
    ];

    const labels = [
      'Too Short',
      'Weak',
      'Fair',
      'Good',
      'Strong'
    ];

    if (fill) {
      fill.style.width = (score * 25) + '%';
      fill.style.background = colors[score];
    }

    if (label) {
      label.textContent = labels[score];
    }
  });
}

/* ─────────────────────────────────────────
   USER INFO
───────────────────────────────────────── */

function populateUser() {

  const user = getUser();

  document.querySelectorAll('.user-email-tag')
    .forEach(el => {
      el.textContent = '✉ ' + user.email;
    });

  document.querySelectorAll('.sb-user-name')
    .forEach(el => {
      el.textContent = user.name;
    });

  document.querySelectorAll('.sb-user-role')
    .forEach(el => {
      el.textContent =
        user.role.charAt(0).toUpperCase() +
        user.role.slice(1);
    });

  document.querySelectorAll('.topbar-avatar')
    .forEach(el => {
      el.textContent =
        user.name.charAt(0).toUpperCase();
    });

  document.querySelectorAll('.sb-avatar')
    .forEach(el => {
      el.textContent =
        user.name.charAt(0).toUpperCase();
    });
}

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */

function initSidebar() {

  const ham =
    document.getElementById('hamburger');

  const sidebar =
    document.getElementById('sidebar');

  const overlay =
    document.getElementById('sbOverlay');

  const close =
    document.getElementById('sbClose');

  if (ham) {
    ham.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    });
  }

  if (close) {
    close.addEventListener('click', closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
}

function closeSidebar() {

  const sidebar =
    document.getElementById('sidebar');

  const overlay =
    document.getElementById('sbOverlay');

  if (sidebar) {
    sidebar.classList.remove('open');
  }

  if (overlay) {
    overlay.classList.remove('active');
  }
}

/* ─────────────────────────────────────────
   PAGE NAVIGATION
───────────────────────────────────────── */

function showPage(pageId, el) {

  document.querySelectorAll('.db-page')
    .forEach(page => {
      page.classList.remove('active');
    });

  document.querySelectorAll('.sb-nav a')
    .forEach(link => {
      link.classList.remove('active');
    });

  const page =
    document.getElementById(pageId);

  if (page) {
    page.classList.add('active');
  }

  if (el) {
    el.classList.add('active');
  }

  const title =
    document.getElementById('topbarTitle');

  if (title && el) {
    title.textContent = el.textContent.trim();
  }

  if (window.innerWidth <= 900) {
    closeSidebar();
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */

function showToast(msg) {

  const toast =
    document.getElementById('toast');

  if (!toast) return;

  toast.textContent = msg;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */

function animCount(el) {

  const target =
    parseFloat(el.dataset.target || 0);

  const prefix =
    el.dataset.prefix || '';

  const suffix =
    el.dataset.suffix || '';

  const decimal =
    parseInt(el.dataset.decimal || 0);

  const duration = 1800;

  const step =
    target / (duration / 16);

  let current = 0;

  const timer = setInterval(() => {

    current += step;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    el.textContent =
      prefix +
      (
        decimal
          ? current.toFixed(decimal)
          : Math.floor(current)
              .toLocaleString('en-IN')
      ) +
      suffix;

  }, 16);
}

/* ─────────────────────────────────────────
   APP INIT
───────────────────────────────────────── */

window.addEventListener('DOMContentLoaded', () => {

  // Protect dashboard
  const currentPage =
    window.location.pathname;

  if (
    currentPage.includes('dashboard') &&
    !localStorage.getItem('af_email')
  ) {
    window.location.href = './login.html';
    return;
  }

  // Init
  populateUser();

  initSidebar();

  initStrength();

  // Counter animation
  document
    .querySelectorAll('.kpi-val[data-target]')
    .forEach(animCount);

  // Health bars
  setTimeout(() => {

    document.querySelectorAll('.hc-bar')
      .forEach(bar => {
        bar.style.width =
          (bar.dataset.w || 0) + '%';
      });

  }, 500);

  console.log('AGRIFLOW initialized');
});