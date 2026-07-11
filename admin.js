/**
 * Glamour Beauty Advanced Admin Platform
 * Task 4 Implementation: State Management, Async APIs, Drag & Drop, CRUD
 * All bugs fixed: sidebar, modals, navigation, theme toggle, filter statuses
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Auth Verification (Fallback Check) ---
  if (localStorage.getItem('gb_admin_logged_in') !== 'true') {
    window.location.replace('login.html');
    return;
  }

  // --- Logout Event ---
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('gb_admin_logged_in');
    window.location.replace('login.html');
  });

  // =============================================
  // THEME TOGGLE (Day / Night Mode)
  // =============================================
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const iconDark = themeToggle.querySelector('.toggle-icon-dark');
    const iconLight = themeToggle.querySelector('.toggle-icon-light');

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('gb-admin-theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('gb-admin-theme', next);
    });

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        iconDark?.classList.remove('hidden');
        iconLight?.classList.add('hidden');
      } else {
        iconDark?.classList.add('hidden');
        iconLight?.classList.remove('hidden');
      }
    }
  }

  // =============================================
  // SIDEBAR TOGGLE (Mobile)
  // =============================================
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');

  sidebarOpen?.addEventListener('click', () => sidebar?.classList.add('open'));
  sidebarClose?.addEventListener('click', () => sidebar?.classList.remove('open'));

  // Close sidebar when nav item is clicked on mobile
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) sidebar?.classList.remove('open');
    });
  });


  // =============================================
  // 1. ADVANCED STATE MANAGEMENT (APP STORE)
  // =============================================

  class Store {
    constructor(initialState) {
      this.state = initialState;
      this.listeners = [];
    }
    subscribe(listener) {
      this.listeners.push(listener);
      return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }
    setState(updater) {
      const newState = typeof updater === 'function' ? updater(this.state) : updater;
      this.state = { ...this.state, ...newState };
      this.notify();
    }
    notify() {
      this.listeners.forEach(listener => listener(this.state));
    }
    getState() { return this.state; }
  }

  // Initial State with correct status values matching the filter
  const appStore = new Store({
    clients: [],
    bookings: [
      { id: 'BK-1042', name: 'Priya Kumari',    service: 'Bridal Makeup',    datetime: '2026-07-03 10:00 AM', status: 'completed' },
      { id: 'BK-1043', name: 'Sarah Fernando',  service: 'Hair Styling',     datetime: '2026-07-03 01:30 PM', status: 'inservice' },
      { id: 'BK-1044', name: 'Nadia Perera',    service: 'Facial',           datetime: '2026-07-04 09:00 AM', status: 'completed' },
      { id: 'BK-1045', name: 'Chamari Wickrama',service: 'Nail Art',         datetime: '2026-07-04 11:15 AM', status: 'upcoming'  },
      { id: 'BK-1046', name: 'Malini Silva',    service: 'Herbal Treatment', datetime: '2026-07-05 03:00 PM', status: 'upcoming'  }
    ],
    bookingsFilter: 'all',
    bookingsSearch: '',
    clientsSearch: ''
  });


  // =============================================
  // 2. SIMULATED ASYNC API
  // =============================================

  const API = {
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    async fetchClients() {
      await this.delay(800);
      return [
        { id: 'C-001', name: 'Priya Kumari',    email: 'priya@example.com',    phone: '0771234567', visits: 4  },
        { id: 'C-002', name: 'Sarah Fernando',  email: 'sarah.f@example.com',  phone: '0719876543', visits: 12 },
        { id: 'C-003', name: 'Nadia Perera',    email: 'nadia99@example.com',  phone: '0765554444', visits: 2  }
      ];
    },

    async saveClient(clientData) {
      await this.delay(600);
      if (!clientData.name || !clientData.email) throw new Error('Invalid data');
      return {
        ...clientData,
        id: clientData.id || `C-${Math.floor(Math.random() * 900) + 100}`,
        visits: clientData.visits || 0
      };
    },

    async updateBookingStatus(id, newStatus) {
      await this.delay(300);
      return { success: true };
    }
  };


  // =============================================
  // 3. TOAST NOTIFICATION SYSTEM
  // =============================================

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 3000);
  }


  // =============================================
  // 4. SPA ROUTING & NAVIGATION
  // =============================================

  const navItems = document.querySelectorAll('.nav-item');
  const views    = document.querySelectorAll('.app-view');
  const pageTitle = document.getElementById('page-title');

  const viewTitles = {
    dashboard: 'Dashboard',
    bookings:  'Bookings',
    clients:   'Clients',
    operations:'Operations'
  };

  function navigateTo(viewId) {
    const id = viewId || 'dashboard';
    navItems.forEach(item => item.classList.toggle('active', item.dataset.view === id));
    views.forEach(view => view.classList.toggle('active-view', view.id === `view-${id}`));
    if (pageTitle) pageTitle.textContent = viewTitles[id] || 'Dashboard';
    if (id === 'clients' && appStore.getState().clients.length === 0) {
      loadClients();
    }
  }

  // Handle nav item clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.dataset.view;
      if (view) navigateTo(view);
    });
  });

  // Handle browser hash changes
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash.substring(1) || 'dashboard');
  });

  // Initial navigation on page load
  navigateTo(window.location.hash.substring(1) || 'dashboard');


  // =============================================
  // 5. DASHBOARD RENDERING
  // =============================================

  function renderDashboard(state) {
    const totalBookings = state.bookings.length;
    const revenue = totalBookings * 5000;

    const revenueEl  = document.querySelector('.metric-card:nth-child(1) .metric-value');
    const bookingsEl = document.querySelector('.metric-card:nth-child(2) .metric-value');

    if (revenueEl)  revenueEl.textContent  = `Rs ${revenue.toLocaleString()}`;
    if (bookingsEl) bookingsEl.textContent = totalBookings;

    // Dynamically update Saturday bar
    const chartBars = document.querySelectorAll('.css-chart .bar');
    if (chartBars.length > 0) {
      const satBar = chartBars[5]; // Saturday
      if (satBar) {
        const h = Math.min(50 + totalBookings * 5, 150);
        satBar.style.height = `${h}%`;
        satBar.title = `Sat: ${totalBookings} (Peak)`;
      }
    }
  }


  // =============================================
  // 6. BOOKINGS DATA TABLE
  // =============================================

  function renderBookingsTable(state) {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    const filtered = state.bookings.filter(b => {
      const term = state.bookingsSearch || '';
      const matchSearch = b.name.toLowerCase().includes(term) || b.id.toLowerCase().includes(term);
      const matchFilter = state.bookingsFilter === 'all' || b.status === state.bookingsFilter;
      return matchSearch && matchFilter;
    });

    // Map status → badge class
    const badgeClass = { upcoming: 'pending', inservice: 'confirmed', completed: 'completed' };

    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td><strong>${b.id}</strong></td>
        <td>${b.name}</td>
        <td>${b.service}</td>
        <td>${b.datetime}</td>
        <td><span class="badge ${badgeClass[b.status] || 'pending'}">${b.status}</span></td>
        <td class="text-right">
          <div class="action-btns">
            <button class="btn btn-outline btn-view-booking" data-id="${b.id}" style="padding:4px 10px;font-size:0.7rem;">👁 View</button>
            <button class="btn btn-warning btn-edit-booking" data-id="${b.id}" style="padding:4px 10px;font-size:0.7rem;">✏️ Edit</button>
            <button class="btn btn-danger btn-delete-row" data-id="${b.id}" style="padding:4px 10px;font-size:0.7rem;">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach action listeners after rendering rows
    tbody.querySelectorAll('.btn-view-booking').forEach(btn => {
      btn.addEventListener('click', e => {
        const booking = appStore.getState().bookings.find(b => b.id === e.currentTarget.dataset.id);
        if (booking) openViewBookingModal(booking);
      });
    });
    tbody.querySelectorAll('.btn-edit-booking').forEach(btn => {
      btn.addEventListener('click', e => {
        const booking = appStore.getState().bookings.find(b => b.id === e.currentTarget.dataset.id);
        if (booking) openEditBookingModal(booking);
      });
    });
    tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        deleteBooking(id);
      });
    });

    const empty = document.getElementById('table-empty');
    if (empty) {
      if (filtered.length === 0) {
        empty.classList.remove('hidden');
        tbody.parentElement.classList.add('hidden');
      } else {
        empty.classList.add('hidden');
        tbody.parentElement.classList.remove('hidden');
      }
    }

    // Update pagination info
    const info = document.getElementById('pagination-info');
    if (info) info.textContent = `Showing 1 to ${filtered.length} of ${filtered.length} entries`;
  }

  document.getElementById('table-search')?.addEventListener('input', e => {
    appStore.setState({ bookingsSearch: e.target.value.toLowerCase() });
  });

  document.getElementById('table-filter')?.addEventListener('change', e => {
    appStore.setState({ bookingsFilter: e.target.value });
  });

  // Add Booking button → open modal
  document.getElementById('btn-add-booking')?.addEventListener('click', () => {
    openModal('modal-add');
  });

  // --- View Booking Modal ---
  function openViewBookingModal(booking) {
    const badgeClass = { upcoming: 'pending', inservice: 'confirmed', completed: 'completed' };
    document.getElementById('view-id').textContent       = booking.id;
    document.getElementById('view-name').textContent     = booking.name;
    document.getElementById('view-service').textContent  = booking.service;
    document.getElementById('view-datetime').textContent = booking.datetime;
    document.getElementById('view-status').innerHTML =
      `<span class="badge ${badgeClass[booking.status] || 'pending'}">${booking.status}</span>`;
    openModal('modal-view-booking');

    // "Edit" button inside View modal
    const editBtn = document.getElementById('btn-view-edit');
    // Remove old listeners by cloning
    const newEditBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(newEditBtn, editBtn);
    newEditBtn.addEventListener('click', () => {
      closeModals();
      openEditBookingModal(booking);
    });
  }

  // --- Edit Booking Modal ---
  function openEditBookingModal(booking) {
    document.getElementById('edit-booking-id').value = booking.id;
    document.getElementById('edit-name').value        = booking.name;
    document.getElementById('edit-service').value     = booking.service;
    document.getElementById('edit-status').value      = booking.status;

    // Parse datetime into date + time fields
    const parts = booking.datetime.split(' ');
    if (parts.length >= 1) document.getElementById('edit-date').value = parts[0];
    if (parts.length >= 3) {
      // convert "10:00 AM" to 24h for input[type=time]
      const timeStr = `${parts[1]} ${parts[2]}`;
      const d = new Date(`1970-01-01 ${timeStr}`);
      if (!isNaN(d)) {
        const hh = String(d.getHours()).padStart(2,'0');
        const mm = String(d.getMinutes()).padStart(2,'0');
        document.getElementById('edit-time').value = `${hh}:${mm}`;
      }
    }
    openModal('modal-edit-booking');
  }

  // Edit Booking Form Submit
  document.getElementById('form-edit-booking')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('btn-save-edit-booking');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const id      = document.getElementById('edit-booking-id').value;
    const name    = document.getElementById('edit-name').value;
    const service = document.getElementById('edit-service').value;
    const status  = document.getElementById('edit-status').value;
    const date    = document.getElementById('edit-date').value;
    const time    = document.getElementById('edit-time').value;

    // Format datetime back as readable string
    let datetime = date;
    if (time) {
      const d = new Date(`1970-01-01T${time}`);
      if (!isNaN(d)) {
        const hh = d.getHours();
        const mm = String(d.getMinutes()).padStart(2,'0');
        const ampm = hh >= 12 ? 'PM' : 'AM';
        const h12 = hh % 12 || 12;
        datetime = `${date} ${h12}:${mm} ${ampm}`;
      }
    }

    appStore.setState(prev => ({
      bookings: prev.bookings.map(b =>
        b.id === id ? { ...b, name, service, status, datetime } : b
      )
    }));

    closeModals();
    showToast(`Booking ${id} updated successfully!`);
    btn.textContent = 'Save Changes';
    btn.disabled = false;
  });

  // --- Delete Booking ---
  function deleteBooking(id) {
    if (!confirm(`Are you sure you want to delete booking ${id}? This cannot be undone.`)) return;
    appStore.setState(prev => ({
      bookings: prev.bookings.filter(b => b.id !== id)
    }));
    showToast(`Booking ${id} deleted.`, 'error');
  }

  // Delete button inside Edit modal
  document.getElementById('btn-delete-booking')?.addEventListener('click', () => {
    const id = document.getElementById('edit-booking-id').value;
    closeModals();
    deleteBooking(id);
  });


  // =============================================
  // 7. KANBAN BOARD (DRAG & DROP)
  // =============================================

  let draggedCardId = null;

  function renderKanban(state) {
    const cols = {
      upcoming:  document.getElementById('kb-upcoming'),
      inservice: document.getElementById('kb-inservice'),
      completed: document.getElementById('kb-completed')
    };
    if (!cols.upcoming) return;

    Object.values(cols).forEach(col => { if (col) col.innerHTML = ''; });

    state.bookings.forEach(b => {
      const col = cols[b.status];
      if (!col) return;

      const card = document.createElement('div');
      card.className = 'k-card';
      card.draggable = true;
      card.dataset.id = b.id;

      const parts = b.datetime.split(' ');
      const timeDisplay = parts.length >= 3 ? `${parts[1]} ${parts[2]}` : b.datetime;

      card.innerHTML = `
        <div class="k-card-header">
          <span>${b.id}</span>
          <span>${timeDisplay}</span>
        </div>
        <div class="k-card-title">${b.name}</div>
        <div class="k-card-service">${b.service}</div>
      `;

      card.addEventListener('dragstart', e => {
        draggedCardId = b.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedCardId = null;
        document.querySelectorAll('.dropzone').forEach(z => z.classList.remove('drag-over'));
      });

      col.appendChild(card);
    });

    // Update column badges
    const badgeSel = {
      upcoming:  '.kanban-column[data-status="upcoming"] .badge',
      inservice: '.kanban-column[data-status="inservice"] .badge',
      completed: '.kanban-column[data-status="completed"] .badge'
    };
    Object.entries(badgeSel).forEach(([key, sel]) => {
      const el = document.querySelector(sel);
      if (el && cols[key]) el.textContent = cols[key].children.length;
    });
  }

  // Dropzone Events
  document.querySelectorAll('.dropzone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', async e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const newStatus = zone.parentElement.dataset.status;
      if (!draggedCardId || !newStatus) return;

      const oldBookings = [...appStore.getState().bookings];
      appStore.setState(prev => ({
        bookings: prev.bookings.map(b => b.id === draggedCardId ? { ...b, status: newStatus } : b)
      }));

      try {
        await API.updateBookingStatus(draggedCardId, newStatus);
        showToast('Booking status updated!');
      } catch {
        appStore.setState({ bookings: oldBookings });
        showToast('Failed to update status', 'error');
      }
    });
  });


  // =============================================
  // 8. CLIENTS CRUD
  // =============================================

  async function loadClients() {
    const loader = document.getElementById('clients-loader');
    const table  = document.getElementById('clients-table');
    if (!loader || !table) return;

    loader.classList.remove('hidden');
    table.classList.add('hidden');

    try {
      const clients = await API.fetchClients();
      appStore.setState({ clients });
    } catch {
      showToast('Error loading clients', 'error');
    } finally {
      loader.classList.add('hidden');
      table.classList.remove('hidden');
    }
  }

  function renderClientsTable(state) {
    const tbody = document.getElementById('clients-tbody');
    if (!tbody) return;

    // Apply search filter
    const term = (state.clientsSearch || '').toLowerCase();
    const filtered = term
      ? state.clients.filter(c =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term)
        )
      : state.clients;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 2rem; color: var(--clr-text-muted); font-size: var(--fs-sm);">
            No clients found matching "${term}"
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td><span class="badge completed">${c.visits}</span></td>
        <td class="text-right">
          <div class="action-btns">
            <button class="btn btn-outline edit-client" data-id="${c.id}" style="padding:4px 10px;font-size:0.7rem;">✏️ Edit</button>
            <button class="btn btn-danger delete-client" data-id="${c.id}" style="padding:4px 10px;font-size:0.7rem;">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Edit listeners
    tbody.querySelectorAll('.edit-client').forEach(btn => {
      btn.addEventListener('click', e => {
        const client = state.clients.find(c => c.id === e.currentTarget.dataset.id);
        if (client) openClientModal(client);
      });
    });

    // Delete listeners
    tbody.querySelectorAll('.delete-client').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        const client = state.clients.find(c => c.id === id);
        if (!client) return;
        if (!confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;
        appStore.setState(prev => ({
          clients: prev.clients.filter(c => c.id !== id)
        }));
        showToast(`Client "${client.name}" deleted.`, 'error');
      });
    });
  }

  document.getElementById('btn-add-client')?.addEventListener('click', () => openClientModal());

  // Wire up the client search input
  document.getElementById('client-search')?.addEventListener('input', e => {
    appStore.setState({ clientsSearch: e.target.value.trim() });
  });


  // =============================================
  // 9. MODAL SYSTEM
  // =============================================

  const backdrop = document.getElementById('modal-backdrop');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || !backdrop) return;
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
  }

  function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    backdrop?.classList.add('hidden');
  }

  backdrop?.addEventListener('click', closeModals);
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn =>
    btn.addEventListener('click', closeModals)
  );

  // Client Modal (Add / Edit)
  const formClient     = document.getElementById('form-client');
  const modalClientEl  = document.getElementById('modal-client');

  function openClientModal(client = null) {
    if (!modalClientEl || !backdrop) return;
    if (client) {
      document.getElementById('modal-client-title').textContent = 'Edit Client';
      document.getElementById('client-id').value    = client.id;
      document.getElementById('client-name').value  = client.name;
      document.getElementById('client-email').value = client.email;
      document.getElementById('client-phone').value = client.phone;
    } else {
      document.getElementById('modal-client-title').textContent = 'Add New Client';
      formClient?.reset();
      document.getElementById('client-id').value = '';
    }
    modalClientEl.classList.remove('hidden');
    backdrop.classList.remove('hidden');
  }

  formClient?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('btn-save-client');
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const data = {
      id:    document.getElementById('client-id').value,
      name:  document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      phone: document.getElementById('client-phone').value
    };

    try {
      const saved = await API.saveClient(data);
      appStore.setState(prev => {
        const clients = [...prev.clients];
        const idx = clients.findIndex(c => c.id === saved.id);
        if (idx >= 0) clients[idx] = saved;
        else clients.push(saved);
        return { clients };
      });
      closeModals();
      showToast('Client saved successfully!');
    } catch {
      showToast('Failed to save client', 'error');
    } finally {
      btn.textContent = 'Save Client';
      btn.disabled = false;
    }
  });

  // Add Booking Form Submit
  document.getElementById('form-add-booking')?.addEventListener('submit', e => {
    e.preventDefault();
    const newId = `BK-${1046 + appStore.getState().bookings.length}`;
    const newBooking = {
      id:       newId,
      name:     document.getElementById('mod-name').value,
      service:  document.getElementById('mod-service').value,
      datetime: `${document.getElementById('mod-date').value} ${document.getElementById('mod-time').value}`,
      status:   'upcoming'
    };
    appStore.setState(prev => ({ bookings: [newBooking, ...prev.bookings] }));
    closeModals();
    showToast(`Booking ${newId} added successfully!`);
    document.getElementById('form-add-booking').reset();
  });




// =============================================
  // 10. NOTIFICATIONS SYSTEM
  // =============================================

  const notifications = [
    { id: 1, message: 'New booking from Priya Kumari', time: '10 mins ago', read: false },
    { id: 2, message: 'Nadia Perera rescheduled her Facial', time: '2 hours ago', read: false },
    { id: 3, message: 'New review received from Chamari', time: '4 hours ago', read: false },
  ];

  const btnNotif      = document.getElementById('btn-notif');
  const notifPanel    = document.getElementById('notif-panel');
  const notifList     = document.getElementById('notif-list');
  const notifEmpty    = document.getElementById('notif-empty');
  const notifIndicator = document.getElementById('notif-indicator');
  const notifClearAll = document.getElementById('notif-clear-all');

  function renderNotifications() {
    const unread = notifications.filter(n => !n.read);

    // Show/hide red indicator dot
    if (unread.length > 0) {
      notifIndicator?.classList.remove('hidden');
    } else {
      notifIndicator?.classList.add('hidden');
    }

    // Render list items
    if (notifList) {
      notifList.innerHTML = notifications.map(n => `
        <li class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
          <div class="notif-dot"></div>
          <div class="notif-content">
            <p class="notif-message">${n.message}</p>
            <span class="notif-time">${n.time}</span>
          </div>
        </li>
      `).join('');

      // Click each item to mark as read
      notifList.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = parseInt(item.dataset.id);
          const notif = notifications.find(n => n.id === id);
          if (notif) notif.read = true;
          renderNotifications();
        });
      });
    }

    // Show empty state if all read
    if (notifications.every(n => n.read)) {
      notifEmpty?.classList.remove('hidden');
      notifList?.classList.add('hidden');
    } else {
      notifEmpty?.classList.add('hidden');
      notifList?.classList.remove('hidden');
    }
  }

  // Toggle panel open/close
  btnNotif?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = notifPanel?.classList.contains('hidden');
    if (isHidden) {
      notifPanel?.classList.remove('hidden');
      btnNotif.setAttribute('aria-expanded', 'true');
      renderNotifications();
    } else {
      notifPanel?.classList.add('hidden');
      btnNotif.setAttribute('aria-expanded', 'false');
    }
  });

  // Mark all as read
  notifClearAll?.addEventListener('click', () => {
    notifications.forEach(n => n.read = true);
    renderNotifications();
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('notif-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      notifPanel?.classList.add('hidden');
      btnNotif?.setAttribute('aria-expanded', 'false');
    }
  });

  // Initial render
  renderNotifications();






  // =============================================
  // 11. REACTIVE SUBSCRIPTIONS (STATE → UI)
  // =============================================

  appStore.subscribe(renderDashboard);
  appStore.subscribe(renderBookingsTable);
  appStore.subscribe(renderKanban);
  appStore.subscribe(renderClientsTable);

  // Initial render
  appStore.notify();

});
