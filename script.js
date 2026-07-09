const storedContent = localStorage.getItem('portfolioContent');
let activeContent = structuredClone(portfolioContent);

if (storedContent) {
  try {
    activeContent = { ...activeContent, ...JSON.parse(storedContent) };
  } catch {
    localStorage.removeItem('portfolioContent');
  }
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const cursorGlow = document.querySelector('.cursor-glow');
const terminalLines = document.querySelector('#terminalLines');
const typingText = document.querySelector('#typingText');
const editorDialog = document.querySelector('#editorDialog');
const contentEditor = document.querySelector('#contentEditor');
const editorMessage = document.querySelector('#editorMessage');

function getValue(path) {
  return path.split('.').reduce((value, key) => value?.[key], activeContent) ?? '';
}

function renderFieldContent() {
  document.querySelectorAll('[data-field]').forEach((element) => {
    element.textContent = getValue(element.dataset.field);
  });

  document.querySelectorAll('[data-link]').forEach((element) => {
    const value = getValue(element.dataset.link);
    if (element.dataset.link.includes('email')) element.href = `mailto:${value}`;
    if (element.dataset.link.includes('phone')) element.href = `tel:${value.replace(/\D/g, '')}`;
    if (element.dataset.link.includes('website')) element.href = value;
  });
}

function renderCards() {
  document.querySelector('#quickFacts').innerHTML = [
    ['Motto', activeContent.school.motto],
    ['School', activeContent.school.shortName],
    ['Location', 'Prayagraj']
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join('');

  document.querySelector('#schoolFitList').innerHTML = activeContent.schoolFit
    .map((item) => `<article><strong>${item.title}</strong><span>${item.text}</span></article>`).join('');

  document.querySelector('#visionCards').innerHTML = activeContent.school.visionPoints
    .map((text, index) => `<article class="glass-card"><span>0${index + 1}</span><h3>DPPS Value</h3><p>${text}</p></article>`).join('');

  document.querySelector('#skillsGrid').innerHTML = activeContent.skills
    .map((skill) => `<article class="glass-card"><span>${skill.icon}</span><h3>${skill.title}</h3><p>${skill.text}</p></article>`).join('');

  document.querySelector('#projectsList').innerHTML = activeContent.projects
    .map((project) => `<article class="project-card"><div><p class="project-type">${project.type}</p><h3>${project.title}</h3></div><p>${project.text}</p></article>`).join('');
}

function renderTerminal() {
  const messages = [
    `Target school: ${activeContent.school.name}`,
    `Motto locked: ${activeContent.school.motto}`,
    'Avoided temporary data: toppers, current notices, one-time events',
    'Interview mode: honest, respectful, prepared'
  ];

  terminalLines.innerHTML = messages.map((message, index) => `<p>0${index + 1} / ${message}</p>`).join('');
}

function renderAll() {
  renderFieldContent();
  renderCards();
  renderTerminal();
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const phrases = ['Preparing DPPS-ready answers...', 'Connecting goals with school values...', 'Ready for interview confidence.'];
let phraseIndex = 0;
setInterval(() => {
  phraseIndex = (phraseIndex + 1) % phrases.length;
  typingText.textContent = phrases[phraseIndex];
}, 2200);

window.addEventListener('pointermove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('.edit-open').addEventListener('click', () => {
  contentEditor.value = JSON.stringify(activeContent, null, 2);
  editorMessage.textContent = '';
  editorDialog.showModal();
});

document.querySelector('#saveContent').addEventListener('click', () => {
  try {
    activeContent = JSON.parse(contentEditor.value);
    localStorage.setItem('portfolioContent', JSON.stringify(activeContent));
    renderAll();
    editorMessage.textContent = 'Saved! Your updates are stored in this browser.';
  } catch (error) {
    editorMessage.textContent = `Fix the JSON first: ${error.message}`;
  }
});

document.querySelector('#resetContent').addEventListener('click', () => {
  localStorage.removeItem('portfolioContent');
  activeContent = structuredClone(portfolioContent);
  contentEditor.value = JSON.stringify(activeContent, null, 2);
  renderAll();
  editorMessage.textContent = 'Reset to the original DPPS template.';
});

renderAll();
