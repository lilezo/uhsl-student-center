document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('main-nav');
  if (!navContainer) return;

  // Extract the filename from the pathname; defaults to index.html if root or empty
  let currentFile = window.location.pathname.split('/').pop().toLowerCase();
  if (!currentFile || currentFile === '') {
    currentFile = 'index.html';
  }

  const menuItems = [
    { label: 'Home', href: 'index.html' },
    { label: 'Room Booking', href: 'booking.html' },
    { label: 'FAQs', href: 'faq.html' }
  ];

  const ul = document.createElement('ul');

  menuItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;

    if (currentFile === item.href.toLowerCase()) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  navContainer.appendChild(ul);
});
