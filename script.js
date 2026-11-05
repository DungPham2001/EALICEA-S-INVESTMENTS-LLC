document.addEventListener('DOMContentLoaded', function () {
  var EMAIL = 'surveybasic@gmail.com';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('menu');
  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  // Highlight active nav link on scroll
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var s = document.querySelector(l.getAttribute('href'));
      if (s) io.observe(s);
    });
  }

  // Contact form: validate, then open the visitor's email app (no backend needed)
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get('name') || '').toString().trim();
    var email = (d.get('email') || '').toString().trim();
    var topic = (d.get('topic') || '').toString();
    var message = (d.get('message') || '').toString().trim();

    Array.prototype.forEach.call(form.elements, function (el) { el.classList && el.classList.remove('invalid'); });
    status.className = 'form-status';

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !message) {
      if (!name) form.elements.name.classList.add('invalid');
      if (!emailOk) form.elements.email.classList.add('invalid');
      if (!message) form.elements.message.classList.add('invalid');
      status.textContent = 'Please fill in your name, a valid email and a message.';
      status.classList.add('err');
      return;
    }

    var subject = 'Website inquiry: ' + topic;
    var body = 'Name: ' + name + '\nEmail: ' + email + '\nInterested in: ' + topic + '\n\n' + message;
    var href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = href;

    status.innerHTML = 'Thank you! Your email app should open with your message ready to send. If it does not, write to us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
    status.classList.add('ok');
    form.reset();
  });
});
