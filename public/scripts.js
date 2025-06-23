document.addEventListener("DOMContentLoaded", function () {
  // ✅ AOS başlat
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: false
    });
  }
  
  // ✅ Hamburger Menü
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');
  const body = document.body;
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  function toggleMenu() {
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    hamburgerLines[0].classList.toggle('rotate-45');
    hamburgerLines[0].classList.toggle('translate-y-2.5');
    hamburgerLines[1].classList.toggle('opacity-0');
    hamburgerLines[2].classList.toggle('-rotate-45');
    hamburgerLines[2].classList.toggle('-translate-y-2.5');
  }
  
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', toggleMenu);
    
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            toggleMenu();
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        } else {
          toggleMenu();
        }
      });
    });
    
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu || e.target.classList.contains('bg-black')) {
        toggleMenu();
      }
    });
  }
  
  // ✅ Scroll navbar effects
  const hero = document.getElementById("hero");
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("nav-links");
  const lillogo = document.getElementById("lillogo");
  const logo = document.getElementById("logo");
  
  window.addEventListener("scroll", () => {
    if (hero && window.scrollY > hero.offsetHeight - 50) {
      body.classList.add("after-hero");
    } else {
      body.classList.remove("after-hero");
    }
    
    if (window.scrollY > 20) {
      navbar?.classList.add("bg-[#f5f5f0]", "shadow-md");
      logo?.classList.replace("text-white", "text-black");
      lillogo?.classList.replace("text-gray-300", "text-gray-900");
      hamburgerLines?.forEach(line => line.style.backgroundColor = "black");
      navLinks?.classList.replace("text-white", "text-black");
    } else {
      navbar?.classList.remove("bg-[#f5f5f0]", "shadow-md");
      logo?.classList.replace("text-black", "text-white");
      lillogo?.classList.replace("text-gray-900", "text-gray-300");
      hamburgerLines?.forEach(line => line.style.backgroundColor = "white");
      navLinks?.classList.replace("text-black", "text-white");
    }
  });
  
  // ✅ Counter
  function animateCounter(id, target, duration = 2000) {
    const element = document.getElementById(id);
    if (!element) return;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
  
  if (hero) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter('projects-counter', 6);
          animateCounter('clients-counter', 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(hero);
  }
  
  // ✅ Form işlemleri
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("successMessage");
  
  if (form && successBox) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const formBody = new URLSearchParams(formData);
      
      try {
        const res = await fetch("/submit", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString(),
        });
        
        const data = await res.json();
        if (data.success) {
          successBox.classList.remove("hidden");
          form.reset();
        } else {
          alert("Form gönderilirken bir hata oluştu.");
        }
      } catch (err) {
        alert("Sunucuya ulaşılamıyor.");
        console.error("Hata:", err);
      }
    });
  }
  
  
  // Aşağı Scroll TR & ENG
  const nextSection = document.getElementById('about'); 
  const scrollBtn = document.getElementById('scroll-btn');
  
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nextSection.scrollIntoView({ behavior: "smooth"});
  });

  const nextSection_eng = document.getElementById('about_en'); 
  
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nextSection_eng.scrollIntoView({ behavior: "smooth"});
  });

});