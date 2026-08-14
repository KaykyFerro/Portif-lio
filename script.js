document.getElementById('year').textContent = new Date().getFullYear();

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => link.addEventListener('click', e => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
}));

const cards = document.querySelectorAll('.project-card');
cards.forEach(card => card.addEventListener('mousemove', e => {
  const r = card.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width - .5) * 4;
  const y = ((e.clientY - r.top) / r.height - .5) * -4;
  card.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
}));
cards.forEach(card => card.addEventListener('mouseleave', () => { card.style.transform = ''; }));

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submit = document.getElementById('contact-submit');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.querySelector('[name="_honey"]').value) return;

    submit.disabled = true;
    submit.innerHTML = '<span>⌛</span> Enviando...';
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const data = await response.json();

      if (response.ok && data.success !== false) {
        form.reset();
        status.textContent = '✓ Mensagem enviada com sucesso! Obrigado pelo contato.';
        status.style.color = '#78e5b5';
      } else {
        throw new Error(data.message || 'Não foi possível enviar a mensagem.');
      }
    } catch (error) {
      status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
      status.style.color = '#ff8d8d';
    } finally {
      submit.disabled = false;
      submit.innerHTML = '<span>➤</span> Enviar mensagem';
    }
  });
}

// Tema: respeita a preferência do sistema e permite alternância manual.
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');

function applyTheme(theme) {
  const light = theme === 'light';
  root.classList.toggle('theme-light', light);
  if (themeToggle) {
    themeToggle.textContent = light ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', light ? 'Ativar tema escuro' : 'Ativar tema claro');
    themeToggle.title = light ? 'Ativar tema escuro' : 'Ativar tema claro';
  }
}

function getTheme() {
  const saved = localStorage.getItem('theme');
  return saved || (systemTheme.matches ? 'light' : 'dark');
}

applyTheme(getTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.classList.contains('theme-light') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

systemTheme.addEventListener('change', event => {
  if (!localStorage.getItem('theme')) applyTheme(event.matches ? 'light' : 'dark');
});
