// ============================================
// LINUXAWY — Portfolio TypeScript
// ============================================

interface NavLink {
  id: string;
  label: string;
}

interface SkillCategory {
  icon: string;
  name: string;
  tags: { label: string; type?: 'highlight' | 'new' | 'default' }[];
}

// ---- Custom Cursor ----
class Cursor {
  private cursor: HTMLElement;
  private trail: HTMLElement;
  private mouseX = 0;
  private mouseY = 0;
  private trailX = 0;
  private trailY = 0;

  constructor() {
    this.cursor = document.querySelector('.cursor') as HTMLElement;
    this.trail  = document.querySelector('.cursor-trail') as HTMLElement;
    this.init();
  }

  private init(): void {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.cursor.style.left = `${e.clientX}px`;
      this.cursor.style.top  = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor--hover'));
    });

    this.animateTrail();
  }

  private animateTrail(): void {
    this.trailX += (this.mouseX - this.trailX) * 0.15;
    this.trailY += (this.mouseY - this.trailY) * 0.15;
    this.trail.style.left = `${this.trailX}px`;
    this.trail.style.top  = `${this.trailY}px`;
    requestAnimationFrame(() => this.animateTrail());
  }
}

// ---- Scroll Progress ----
class ScrollProgress {
  private bar: HTMLElement;

  constructor() {
    this.bar = document.querySelector('.scroll-progress') as HTMLElement;
    window.addEventListener('scroll', () => this.update(), { passive: true });
  }

  private update(): void {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = Math.min((scrollTop / docHeight) * 100, 100);
    this.bar.style.width = `${progress}%`;
  }
}

// ---- Navigation ----
class Navigation {
  private nav: HTMLElement;
  private links: NodeListOf<HTMLAnchorElement>;

  constructor() {
    this.nav   = document.querySelector('.nav') as HTMLElement;
    this.links = document.querySelectorAll('.nav__links a');
    this.init();
  }

  private init(): void {
    window.addEventListener('scroll', () => {
      this.nav.classList.toggle('nav--scrolled', window.scrollY > 50);
      this.updateActiveLink();
    }, { passive: true });

    // Mobile menu
    const menuBtn  = document.querySelector('.nav__menu-btn') as HTMLElement;
    const mobileNav = document.querySelector('.nav__mobile') as HTMLElement;

    menuBtn?.addEventListener('click', () => mobileNav.classList.toggle('open'));
    mobileNav?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  private updateActiveLink(): void {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) current = section.id;
    });

    this.links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
}

// ---- Typewriter Effect ----
class Typewriter {
  private el: HTMLElement;
  private phrases: string[];
  private current = 0;
  private charIndex = 0;
  private isDeleting = false;

  constructor(el: HTMLElement, phrases: string[]) {
    this.el      = el;
    this.phrases = phrases;
    this.type();
  }

  private type(): void {
    const phrase = this.phrases[this.current];

    if (this.isDeleting) {
      this.el.textContent = phrase.substring(0, --this.charIndex);
    } else {
      this.el.textContent = phrase.substring(0, ++this.charIndex);
    }

    let delay = this.isDeleting ? 60 : 110;

    if (!this.isDeleting && this.charIndex === phrase.length) {
      delay = 2500;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.current = (this.current + 1) % this.phrases.length;
      delay = 400;
    }

    setTimeout(() => this.type(), delay);
  }
}

// ---- Matrix Rain Canvas ----
class MatrixRain {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private columns: number[] = [];
  private fontSize = 13;
  private chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01';

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  private resize(): void {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    const cols = Math.floor(this.canvas.width / this.fontSize);
    this.columns = Array(cols).fill(1);
  }

  private animate(): void {
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00ff88';
    this.ctx.font = `${this.fontSize}px monospace`;

    this.columns.forEach((y, i) => {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(char, i * this.fontSize, y * this.fontSize);
      if (y * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ---- Scroll Reveal ----
class ScrollReveal {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
  }
}

// ---- Skill Tag Hover Ripple ----
function initTagRipples(): void {
  document.querySelectorAll<HTMLElement>('.skills__tag').forEach(tag => {
    tag.addEventListener('click', (e: MouseEvent) => {
      const ripple = document.createElement('span');
      const rect   = tag.getBoundingClientRect();
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: 80px; height: 80px;
        background: rgba(0,255,136,0.15);
        left: ${e.clientX - rect.left - 40}px;
        top: ${e.clientY - rect.top - 40}px;
        animation: ripple 0.5s ease forwards;
        pointer-events: none;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  new Cursor();
  new ScrollProgress();
  new Navigation();
  new MatrixRain('matrix-canvas');
  new ScrollReveal();
  initTagRipples();

  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    new Typewriter(typeEl, [
      'Full Stack Developer',
      'Software Engineer',
      'Rust Enthusiast',
      'OS Dev (coming soon)',
      'I use Arch btw',
    ]);
  }
});
