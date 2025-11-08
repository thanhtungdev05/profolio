// ====== Utility & small helpers ======
const $ = (s, host = document) => host.querySelector(s);
const $$ = (s, host = document) => Array.from(host.querySelectorAll(s));

// set current year
document.getElementById('curYear').textContent = new Date().getFullYear();

// ====== Theme toggle ======
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

function toggleTheme() {
  const t = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = t;
  localStorage.setItem('theme', t);
}
themeToggle.addEventListener('click', toggleTheme);

// ====== Mobile menu ======
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') mobileMenu.classList.remove('open');
});

// ====== Smooth scroll for internal links ======
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

// ====== Typing effect (simple) ======
class Typer {
  constructor(el, phrases = [], delay = 60, pause = 1400) {
    this.el = el;
    this.phrases = phrases;
    this.delay = delay;
    this.pause = pause;
    this.idx = 0;
    this.ch = 0;
    this.typing = true;
    this.run();
  }
  run() {
    const phrase = this.phrases[this.idx % this.phrases.length];
    if (this.typing) {
      this.ch++;
      this.el.textContent = phrase.slice(0, this.ch);
      if (this.ch >= phrase.length) {
        this.typing = false;
        setTimeout(() => this.run(), this.pause);
      } else {
        setTimeout(() => this.run(), this.delay + Math.random() * 60);
      }
    } else {
      this.ch--;
      this.el.textContent = phrase.slice(0, this.ch);
      if (this.ch <= 0) {
        this.typing = true;
        this.idx++;
        setTimeout(() => this.run(), 200);
      } else {
        setTimeout(() => this.run(), this.delay / 2);
      }
    }
  }
}
const typingEl = document.querySelector('.typing');
if (typingEl) {
  const phrases = JSON.parse(typingEl.dataset.phrases || '[]');
  new Typer(typingEl, phrases, 50, 1400);
}

// ====== Scroll reveal & animations ======
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      // animate progress bars when .skills section visible
      if (entry.target.closest('#skills')) animateProgressBars();
    }
  });
}, {threshold: 0.12});

$$('.reveal').forEach(el => io.observe(el));

// progress bars
function animateProgressBars() {
  $$('.progress-bar').forEach(pb => {
    const p = Number(pb.dataset.percent || 0);
    pb.style.width = p + '%';
  });
}

// ====== Project card hover tilt (mouse parallax) ======
$$('.project-card').forEach(card => {
  const inner = card.querySelector('.pc-inner');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * 6; // rotateX
    const ry = (px - 0.5) * -10; // rotateY
    inner.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = '';
  });
});

// ====== Contact form (client-only validation/demo) ======
const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();
    if (!name || !email || !msg) {
      result.style.color = 'tomato';
      result.textContent = 'Vui lòng điền đầy đủ thông tin.';
      return;
    }
    // simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      result.style.color = 'tomato';
      result.textContent = 'Email không hợp lệ.';
      return;
    }

    // demo "send"
    result.style.color = '';
    result.textContent = 'Đang gửi...';

    setTimeout(() => {
      result.style.color = 'var(--accent-2)';
      result.textContent = 'Gửi thành công! Mình sẽ trả lời sớm nhất có thể.';
      form.reset();
    }, 900);
  });
}

// ====== Back to top button ======
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('scroll', () => {
  backTop.style.opacity = window.scrollY > 400 ? 1 : 0;
});

// ====== small: close mobile menu on resize to desktop ======
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) mobileMenu.classList.remove('open');
});
// ====== Skill chart (Data Analyst Style) ======
function initSkillChart() {
  const canvas = document.getElementById('skillsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Python', 'SQL', 'Power BI / Tableau', 'Excel',
        'HTML', 'CSS', 'C#', 'JavaScript', 'PHP'
      ],
      datasets: [{
        label: 'Skill Level (%)',
        data: [18.37, 18.37, 16.33, 10.20, 16.33, 6.12, 4.08, 6.12, 4.08],
        backgroundColor: [
          '#2ecc71', '#3498db', '#f1c40f', '#9b59b6',
          '#e67e22', '#1abc9c', '#e74c3c', '#34495e', '#f39c12'
        ],
        borderWidth: 2,
        borderColor: '#0a0a0a',
        hoverOffset: 18,
        cutout: '60%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff',
            font: { size: 14, weight: 'bold' },
            boxWidth: 16,
            padding: 12
          }
        },
        title: {
          display: true,
          text: 'Data Analyst Skill Distribution',
          color: '#fff',
          font: { size: 20, weight: 'bold' },
          padding: { bottom: 20 }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500
      }
    }
  });
}

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
  const ioChart = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initSkillChart();
        ioChart.disconnect();
      }
    });
  }, { threshold: 0.3 });
  ioChart.observe(skillsSection);
}
// === Animate Skill Bars + Percent Number When in View ===
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = document.querySelectorAll(".skill-card");
  const options = { threshold: 0.3 };

  const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bar = card.querySelector(".progress-bar");
        const percentText = card.querySelector(".percent");
        const targetPercent = parseInt(bar.getAttribute("data-percent"));
        let currentPercent = 0;

        // Reset trước khi animate
        bar.style.width = "0%";
        percentText.textContent = "0%";

        // Thanh tiến trình chạy
        setTimeout(() => {
          bar.style.width = targetPercent + "%";
        }, 150);

        // Số phần trăm tăng dần
        const counter = setInterval(() => {
          if (currentPercent < targetPercent) {
            currentPercent++;
            percentText.textContent = currentPercent + "%";
          } else {
            clearInterval(counter);
          }
        }, 15); // tốc độ tăng

        observer.unobserve(card); // chỉ chạy 1 lần
      }
    });
  };

  const observer = new IntersectionObserver(animateSkills, options);
  skillCards.forEach(card => observer.observe(card));
});
// === About Section Counter Animation ===
const counters = document.querySelectorAll('.stat-value');
const speed = 100;

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const update = () => {
      const value = +counter.innerText;
      const increment = target / speed;
      if (value < target) {
        counter.innerText = Math.ceil(value + increment);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + (counter.innerText.includes('%') ? '%' : '');
      }
    };
    update();
  });
};

// Kích hoạt khi scroll tới vùng "about"
const aboutSection = document.querySelector('#about');
let animated = false;
window.addEventListener('scroll', () => {
  const rect = aboutSection.getBoundingClientRect();
  if (!animated && rect.top < window.innerHeight - 100) {
    animateCounters();
    animated = true;
  }
});
