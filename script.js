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