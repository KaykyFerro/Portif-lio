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
      const response = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const data = await response.json();
      if (response.ok && data.success !== false) { form.reset(); status.textContent = '✓ Mensagem enviada com sucesso! Obrigado pelo contato.'; status.style.color = '#78e5b5'; }
      else throw new Error(data.message || 'Não foi possível enviar a mensagem.');
    } catch (error) { status.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.'; status.style.color = '#ff8d8d'; }
    finally { submit.disabled = false; submit.innerHTML = '<span>➤</span> Enviar mensagem'; }
  });
}

// Tema claro/escuro com preferência do sistema como padrão.
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');

const lightThemeStyle = document.createElement('style');
lightThemeStyle.textContent = `
html.theme-light body{background:#f5f7fb;color:#101522}
html.theme-light .nav{background:#f5f7fbdc;border-color:#10152215}
html.theme-light .nav nav a,html.theme-light .nav-cta{color:#596274}
html.theme-light .nav nav a:hover,html.theme-light .nav-cta:hover{color:#101522}
html.theme-light .theme-toggle{background:#fff;color:#101522;border-color:#10152220}
html.theme-light .brand{color:#101522}
html.theme-light .hero h1{color:#101522}
html.theme-light .lead{color:#596274}
html.theme-light .ghost{color:#101522;border-color:#10152220}
html.theme-light .primary{background:#101522;color:#fff}
html.theme-light .profile-card{background:linear-gradient(145deg,#fff,#eef1f7);border-color:#10152218;box-shadow:0 30px 70px #10152218}
html.theme-light .profile-name{color:#101522}
html.theme-light .profile-role{color:#697386}
html.theme-light .split,html.theme-light .stack-section,html.theme-light footer{border-color:#10152212}
html.theme-light .content-block p,html.theme-light .stack-wrap p,html.theme-light .contact-head p{color:#596274}
html.theme-light .section-heading p{color:#697386}
html.theme-light .project-card{background:#fff;border-color:#10152212;box-shadow:0 10px 30px #10152208}
html.theme-light .project-card.featured{background:linear-gradient(145deg,#fff,#f1f3f9)}
html.theme-light .project-card h3,html.theme-light .project-card p{color:#101522}
html.theme-light .tags span,html.theme-light .stack-cloud span{border-color:#10152215;color:#596274}
html.theme-light .contact-item,html.theme-light .contact-form{background:#fff;border-color:#10152212;color:#101522;box-shadow:0 10px 30px #10152208}
html.theme-light .contact-form label{color:#101522}
html.theme-light .contact-form input,html.theme-light .contact-form textarea{background:#f5f7fb;border-color:#10152218;color:#101522}
html.theme-light .contact-form input::placeholder,html.theme-light .contact-form textarea::placeholder{color:#7a8495}
html.theme-light .contact-item strong{color:#101522}
html.theme-light .contact-icon{background:#edf3ff}
html.theme-light footer{color:#687286}
`;
document.head.appendChild(lightThemeStyle);

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
