document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.accordion-icon');

      // Close all other accordion panels
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherTrigger.nextElementSibling) {
            otherTrigger.nextElementSibling.style.display = 'none';
          }
          const otherIcon = otherTrigger.querySelector('.accordion-icon');
          if (otherIcon) {
            otherIcon.textContent = '+';
          }
        }
      });

      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (content) content.style.display = 'none';
        if (icon) icon.textContent = '+';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    });
  });
});
