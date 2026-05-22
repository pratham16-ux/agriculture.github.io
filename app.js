/* ═══════════════════════════════════════════
   STACKLY — Unified Dashboard Script
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SIDEBAR TOGGLE ── */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sbOverlay');
  const hamburger = document.getElementById('hamburger');
  const sbClose = document.getElementById('sbClose');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openSidebar);
  sbClose?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });

  /* ── PAGE SWITCHING ── */
  window.showPage = function(id, el) {
    document.querySelectorAll('.db-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sb-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    el?.classList.add('active');

    const titleEl = document.getElementById('topbarTitle');
    if (titleEl && el) {
      titleEl.textContent = el.textContent.trim().replace(/^\S+\s+/, '');
    }

    if (id === 'pg-health') initHealthBars();
    if (window.innerWidth <= 900) closeSidebar();
  };

  /* ── TOAST ── */
  window.showToast = function(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  };

  /* ── LOGOUT ── */
  window.logout = function() {
    localStorage.removeItem('af_email');
    localStorage.removeItem('af_role');
    localStorage.removeItem('af_name');
    showToast('👋 Logging out...');
    setTimeout(() => window.location.href = 'login.html', 1200);
  };

  /* ── KPI COUNTER ANIMATION ── */
  function animateKPI(el) {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g,''));
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const kpiObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateKPI(entry.target);
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.kpi-val[data-target]').forEach(el => kpiObserver.observe(el));

  /* ── HEALTH BARS ── */
  function initHealthBars() {
    setTimeout(() => {
      document.querySelectorAll('.hc-bar').forEach(bar => {
        bar.style.width = (bar.dataset.w || 0) + '%';
      });
    }, 100);
  }

  if (document.querySelector('#pg-health.active')) initHealthBars();

  /* ── CHART DEFAULTS ── */
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    Chart.defaults.color = '#4d6a8a';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;

    const gridOpts = { color: 'rgba(255,255,255,.04)', drawBorder: false };
    Chart.defaults.scale.grid = gridOpts;

    initChart('adminOverviewChart', () => {
      const ctx = document.getElementById('adminOverviewChart')?.getContext('2d');
      if (!ctx) return;
      const g2 = ctx.createLinearGradient(0, 0, 0, 220);
      g2.addColorStop(0, 'rgba(245,158,11,.2)');
      g2.addColorStop(1, 'rgba(245,158,11,0)');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            { label: 'Revenue (₹K)', data: [420, 510, 490, 640, 580, 720, 680, 840], backgroundColor: 'rgba(0,245,212,.7)', borderRadius: 6, borderSkipped: false, yAxisID: 'y' },
            { label: 'Orders', data: [280, 340, 310, 420, 380, 460, 440, 520], type: 'line', borderColor: '#f59e0b', backgroundColor: g2, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#f59e0b', yAxisID: 'y1' }
          ]
        },
        options: {
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { position: 'top' } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true, position: 'left' }, y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } } },
          animation: { duration: 1200 }
        }
      });
    });

    initChart('adminUserChart', () => {
      const ctx = document.getElementById('adminUserChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Farmers', 'Buyers', 'Admins'],
          datasets: [{ data: [560, 685, 5], backgroundColor: ['rgba(0,245,212,.8)', 'rgba(124,58,237,.8)', 'rgba(245,158,11,.8)'], borderColor: '#07101a', borderWidth: 3, hoverOffset: 8 }]
        },
        options: { responsive: true, cutout: '72%', plugins: { legend: { position: 'bottom' } }, animation: { duration: 1200 } }
      });
    });

    initChart('adminRevenueChart', () => {
      const ctx = document.getElementById('adminRevenueChart')?.getContext('2d');
      if (!ctx) return;
      const g = ctx.createLinearGradient(0, 0, 0, 180);
      g.addColorStop(0, 'rgba(0,245,212,.2)');
      g.addColorStop(1, 'rgba(0,245,212,0)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          datasets: [{ data: [420,510,480,620,580,710,660,780,740,880,840,960], borderColor: '#00f5d4', backgroundColor: g, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#00f5d4', pointHoverRadius: 6 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1600 } }
      });
    });

    initChart('buyerSpendChart', () => {
      const ctx = document.getElementById('buyerSpendChart')?.getContext('2d');
      if (!ctx) return;
      const g = ctx.createLinearGradient(0, 0, 0, 220);
      g.addColorStop(0, 'rgba(124,58,237,.3)');
      g.addColorStop(1, 'rgba(124,58,237,0)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Nov','Dec','Jan','Feb','Mar','Apr','May'],
          datasets: [{ data: [8.2, 9.5, 7.8, 11.2, 10.4, 12.8, 12.0], borderColor: '#a78bfa', backgroundColor: g, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#a78bfa', pointHoverRadius: 6 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1200 } }
      });
    });

    initChart('buyerOrderChart', () => {
      const ctx = document.getElementById('buyerOrderChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Delivered', 'Pending', 'In Transit'],
          datasets: [{ data: [27, 3, 2], backgroundColor: ['rgba(0,245,212,.8)', 'rgba(245,158,11,.8)', 'rgba(56,189,248,.8)'], borderColor: '#07101a', borderWidth: 3, hoverOffset: 8 }]
        },
        options: { responsive: true, cutout: '72%', plugins: { legend: { position: 'bottom' } }, animation: { duration: 1200 } }
      });
    });

    initChart('buyerCategoryChart', () => {
      const ctx = document.getElementById('buyerCategoryChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Grains', 'Vegetables', 'Pulses', 'Fruits', 'Spices'],
          datasets: [{ label: 'Orders', data: [14, 9, 5, 3, 1], backgroundColor: ['rgba(0,245,212,.7)','rgba(124,58,237,.7)','rgba(245,158,11,.7)','rgba(56,189,248,.7)','rgba(244,63,94,.7)'], borderRadius: 8, borderSkipped: false }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1200 } }
      });
    });

    initChart('farmerYieldChart', () => {
      const ctx = document.getElementById('farmerYieldChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Rabi 2023','Kharif 2024','Rabi 2024','Kharif 2025'],
          datasets: [
            { label: 'Wheat', data: [2.8, 0, 2.9, 0], backgroundColor: 'rgba(0,245,212,.75)', borderRadius: 6, borderSkipped: false },
            { label: 'Rice', data: [0, 2.3, 0, 2.4], backgroundColor: 'rgba(124,58,237,.7)', borderRadius: 6, borderSkipped: false },
            { label: 'Maize', data: [0, 1.8, 0, 1.9], backgroundColor: 'rgba(245,158,11,.7)', borderRadius: 6, borderSkipped: false }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { stacked: false, grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1200 } }
      });
    });

    initChart('farmerCropMix', () => {
      const ctx = document.getElementById('farmerCropMix')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['Wheat', 'Rice', 'Maize', 'Veggies', 'Chickpea'],
          datasets: [{ data: [18, 10, 8, 6, 3], backgroundColor: ['rgba(0,245,212,.6)', 'rgba(124,58,237,.6)', 'rgba(245,158,11,.6)', 'rgba(16,185,129,.6)', 'rgba(244,63,94,.5)'], borderColor: '#07101a', borderWidth: 2 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, animation: { duration: 1200 } }
      });
    });

    initChart('farmerEarningsChart', () => {
      const ctx = document.getElementById('farmerEarningsChart')?.getContext('2d');
      if (!ctx) return;
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, 'rgba(16,185,129,.25)');
      g.addColorStop(1, 'rgba(16,185,129,0)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
          datasets: [{ data: [1.8, 2.1, 2.4, 2.2, 3.0, 2.8, 3.4, 2.9, 3.6, 3.2, 4.1, 3.8], borderColor: '#10b981', backgroundColor: g, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#10b981', pointHoverRadius: 6 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1400 } }
      });
    });

    initChart('farmerPriceChart', () => {
      const ctx = document.getElementById('farmerPriceChart')?.getContext('2d');
      if (!ctx) return;
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
          datasets: [
            { label: 'Wheat (₹/kg)', data: [28,29,30,31,29,30,32,31], borderColor: '#00f5d4', borderWidth: 2.5, tension: .45, pointRadius: 3, pointBackgroundColor: '#00f5d4', fill: false },
            { label: 'Rice (₹/kg)', data: [40,38,42,44,43,45,46,44], borderColor: '#a78bfa', borderWidth: 2.5, tension: .45, pointRadius: 3, pointBackgroundColor: '#a78bfa', fill: false },
            { label: 'Tomato (₹/kg)', data: [55,60,58,65,70,62,68,60], borderColor: '#f59e0b', borderWidth: 2.5, tension: .45, pointRadius: 3, pointBackgroundColor: '#f59e0b', fill: false }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: false } }, animation: { duration: 1200 } }
      });
    });

    initChart('adminRevenuePage', () => {
      const ctx = document.getElementById('adminRevenuePage')?.getContext('2d');
      if (!ctx) return;
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, 'rgba(0,245,212,.2)');
      g.addColorStop(1, 'rgba(0,245,212,0)');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          datasets: [{ data: [420,510,480,620,580,710,660,780,740,880,840,960], borderColor: '#00f5d4', backgroundColor: g, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#00f5d4' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1600 } }
      });
    });
  }

  function initChart(id, fn) {
    const el = document.getElementById(id);
    if (el && !el._chartInit) {
      el._chartInit = true;
      fn();
    }
  }

  const originalShowPage = window.showPage;
  window.showPage = function(id, el) {
    originalShowPage(id, el);
    setTimeout(() => {
      ['adminRevenuePage'].forEach(cid => {
        if (document.querySelector('#' + id + ' #' + cid)) {
          initChart(cid, () => {
            const ctx = document.getElementById(cid)?.getContext('2d');
            if (!ctx) return;
            const g = ctx.createLinearGradient(0, 0, 0, 200);
            g.addColorStop(0, 'rgba(0,245,212,.2)');
            g.addColorStop(1, 'rgba(0,245,212,0)');
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{ data: [420,510,480,620,580,710,660,780,740,880,840,960], borderColor: '#00f5d4', backgroundColor: g, borderWidth: 2.5, fill: true, tension: .45, pointRadius: 4, pointBackgroundColor: '#00f5d4' }]
              },
              options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }, animation: { duration: 1600 } }
            });
          });
        }
      });
    }, 120);
  };

  console.log('✅ Stackly Dashboard loaded');
});


/* ═══════════════════════════════════════
   DYNAMIC USER INFO
   FIX: Skip auth redirect if already on login/index page
═══════════════════════════════════════ */
(function initUserInfo() {
  const email = localStorage.getItem('af_email') || '';
  const role  = localStorage.getItem('af_role')  || '';

  /* ── FIX: Don't redirect if we're already on the login/auth page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isAuthPage = ['login.html', 'index.html', 'register.html', 'signup.html', ''].includes(currentPage);

  if (!email) {
    /* Only redirect to login if we're NOT already on an auth page */
    if (!isAuthPage) {
      window.location.href = 'login.html';
    }
    return; /* Stop here — don't try to populate user info */
  }

  /* Derive display name */
  const rawName = localStorage.getItem('af_name') || email.split('@')[0];
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  /* ── Welcome heading ── */
  const welcomeMsg = document.getElementById('welcomeMsg');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome back, ${displayName} 👋`;
  }

  /* ── Topbar email chip ── */
  ['userEmail', 'sidebarEmail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = email;
  });

  /* ── Sidebar user block (mobile) ── */
  const sbUser = document.querySelector('.sb-user');
  if (sbUser) {
    /* Only inject if it's empty (avoids duplicates on re-run) */
    if (!sbUser.querySelector('.sb-user-name')) {
      const initial = displayName.charAt(0).toUpperCase();
      sbUser.innerHTML = `
        <div class="sb-avatar">${initial}</div>
        <div class="sb-user-info">
          <div class="sb-user-name" id="sidebarName">${displayName}</div>
          <div class="sb-user-email" id="sidebarEmail">${email}</div>
        </div>
      `;
    }
  }

  /* ── Sidebar name & initial (explicit ids) ── */
  const sidebarName = document.getElementById('sidebarName');
  if (sidebarName) sidebarName.textContent = displayName;

  const sidebarInitial = document.getElementById('sidebarInitial');
  if (sidebarInitial) sidebarInitial.textContent = initial;

  /* ── Avatar letter ── */
  const avatar = document.getElementById('userAvatar');
  if (avatar) avatar.textContent = displayName.charAt(0).toUpperCase();

  /* ── User role badge ── */
  const userRole = document.getElementById('userRole');
  if (userRole) userRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
})();


/* ═══════════════════════════════════════
   AGRIFLOW — FULL AUTH JS
═══════════════════════════════════════ */

function saveUser(email, role, name) {
  localStorage.setItem('af_email', email);
  localStorage.setItem('af_role', role);
  localStorage.setItem('af_name', name || email.split('@')[0]);
}

function getUser() {
  return {
    email: localStorage.getItem('af_email'),
    role: localStorage.getItem('af_role'),
    name: localStorage.getItem('af_name')
  };
}

function logout() {
  localStorage.removeItem('af_email');
  localStorage.removeItem('af_role');
  localStorage.removeItem('af_name');
  window.location.href = 'login.html';
}

function selectRole(button) {
  document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('active'));
  button.classList.add('active');
  document.getElementById('selectedRole').value = button.getAttribute('data-role');
}

function togglePass(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('selectedRole').value;
  const msg = document.getElementById('auth-msg');

  if (!email || !password) {
    msg.innerHTML = 'Please fill all fields';
    msg.style.color = '#ff4d4d';
    return;
  }

  saveUser(email, role);
  msg.innerHTML = 'Login successful!';
  msg.style.color = '#27c46b';

  setTimeout(() => {
    if (role === 'farmer') window.location.href = 'dashboard-farmer.html';
    else if (role === 'buyer') window.location.href = 'dashboard-buyer.html';
    else if (role === 'admin') window.location.href = 'dashboard-admin.html';
  }, 1000);
}

function protectPage(requiredRole) {
  const user = getUser();
  if (!user.email) { window.location.href = 'login.html'; return; }
  if (requiredRole && user.role !== requiredRole) {
    alert('Access Denied!');
    window.location.href = 'login.html';
  }
}