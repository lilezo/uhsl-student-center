document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('room-booking-form');
  const alertBox = document.getElementById('form-alert');
  const dateInput = document.getElementById('reservationDate');
  const tbody = document.getElementById('reservations-tbody');
  const resetScheduleBtn = document.getElementById('reset-schedule-btn');

  // Room catalog
  const ROOMS = {
    'room-101': 'Cougar Quiet Study Room A (Cap: 4)',
    'room-102': 'Collaborative Tech Lab B (Cap: 8)',
    'room-201': 'Executive Conference Room (Cap: 12)',
    'room-205': 'Multipurpose Student Org Hall (Cap: 30)',
    'room-210': 'Esports & Digital Media Lounge (Cap: 10)'
  };

  // Seed sample bookings for realistic testing
  const DEFAULT_BOOKINGS = [
    {
      confirmationId: 'CONF-8821',
      fullName: 'Jane Doe',
      cougarNetEmail: 'jdoe@cougarnet.uh.edu',
      peopleSoftId: '1234567',
      roomId: 'room-101',
      roomName: 'Cougar Quiet Study Room A (Cap: 4)',
      reservationDate: '2026-11-20',
      timeSlot: '10:00 AM - 12:00 PM',
      purpose: 'Senior Project Study Group'
    },
    {
      confirmationId: 'CONF-5412',
      fullName: 'Marcus Vance',
      cougarNetEmail: 'mvance@uh.edu',
      peopleSoftId: '7654321',
      roomId: 'room-102',
      roomName: 'Collaborative Tech Lab B (Cap: 8)',
      reservationDate: '2026-11-22',
      timeSlot: '02:00 PM - 04:00 PM',
      purpose: 'CIS 2336 Group Coding Sprint'
    }
  ];

  const STORAGE_KEY = 'uhsl_room_bookings';

  // Retrieve bookings from localStorage or fallback to defaults
  function getBookings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('localStorage not accessible, using in-memory defaults:', e);
    }
    return [...DEFAULT_BOOKINGS];
  }

  // Save bookings to localStorage
  function saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Unable to persist to localStorage:', e);
    }
  }

  // Render reservations table
  function renderBookingsTable() {
    if (!tbody) return;
    const bookings = getBookings();
    tbody.innerHTML = '';

    if (bookings.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="6" style="text-align: center; color: var(--uh-gray); padding: 1.5rem;">No active reservations recorded.</td>';
      tbody.appendChild(tr);
      return;
    }

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.confirmationId}</strong></td>
        <td>${b.roomName || ROOMS[b.roomId] || b.roomId}</td>
        <td>${b.reservationDate}</td>
        <td>${b.timeSlot}</td>
        <td>${escapeHtml(b.fullName)}</td>
        <td><span class="status-badge">Confirmed</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Set minimum date to today
  function setMinDate() {
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  setMinDate();
  renderBookingsTable();

  // Reset Schedule button handler
  if (resetScheduleBtn) {
    resetScheduleBtn.addEventListener('click', () => {
      if (confirm('Reset reservation schedule to default sample data?')) {
        saveBookings(DEFAULT_BOOKINGS);
        renderBookingsTable();
        showAlert('Schedule reset to default sample bookings.', 'success');
      }
    });
  }

  // Form submission handler
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      hideAlert();

      const fullName = document.getElementById('fullName').value.trim();
      const cougarNetEmail = document.getElementById('cougarNetEmail').value.trim();
      const peopleSoftId = document.getElementById('peopleSoftId').value.trim();
      const roomId = document.getElementById('roomId').value;
      const reservationDate = document.getElementById('reservationDate').value;
      const timeSlot = document.getElementById('timeSlot').value;
      const purpose = document.getElementById('purpose').value.trim();

      // Field Validations
      if (!fullName) {
        showAlert('Please enter your full name.', 'error');
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@(cougarnet\.)?uh\.edu$/i;
      if (!emailRegex.test(cougarNetEmail)) {
        showAlert('A valid UH or CougarNet email address is required (@uh.edu or @cougarnet.uh.edu).', 'error');
        return;
      }

      const psidRegex = /^\d{7}$/;
      if (!psidRegex.test(peopleSoftId)) {
        showAlert('PeopleSoft ID must be exactly 7 numeric digits.', 'error');
        return;
      }

      if (!roomId || !ROOMS[roomId]) {
        showAlert('Please select one of the 5 student center rooms.', 'error');
        return;
      }

      if (!reservationDate) {
        showAlert('Please select a valid reservation date.', 'error');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      if (reservationDate < today) {
        showAlert('Reservation date cannot be in the past.', 'error');
        return;
      }

      if (!timeSlot) {
        showAlert('Please select a reservation time slot.', 'error');
        return;
      }

      const currentBookings = getBookings();

      // Check for scheduling conflict (double-booking)
      const conflict = currentBookings.find(b => 
        b.roomId === roomId &&
        b.reservationDate === reservationDate &&
        b.timeSlot === timeSlot
      );

      if (conflict) {
        showAlert(
          `Scheduling Conflict: ${ROOMS[roomId]} is already reserved for ${timeSlot} on ${reservationDate}. Please select another time or room.`,
          'error'
        );
        return;
      }

      // Generate unique confirmation ID
      const confirmationId = 'CONF-' + Math.floor(1000 + Math.random() * 9000);

      const newBooking = {
        confirmationId,
        fullName,
        cougarNetEmail,
        peopleSoftId,
        roomId,
        roomName: ROOMS[roomId],
        reservationDate,
        timeSlot,
        purpose: purpose || 'General Use / Study'
      };

      // Add to bookings list & persist
      currentBookings.push(newBooking);
      saveBookings(currentBookings);

      // Update UI table
      renderBookingsTable();

      // Show confirmation
      showAlert(
        `Reservation Confirmed! Your confirmation code is ${newBooking.confirmationId} for ${newBooking.roomName} on ${newBooking.reservationDate} (${newBooking.timeSlot}).`,
        'success'
      );

      // Reset form
      bookingForm.reset();
      setMinDate();
    });
  }

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = 'none';
    alertBox.className = 'alert';
    alertBox.textContent = '';
  }
});
