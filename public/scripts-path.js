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
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("nav-links");
  const lillogo = document.getElementById("lillogo");
  const logo = document.getElementById("logo");
    
  navbar?.classList.add("bg-[#f5f5f0]", "shadow-md");
  logo?.classList.replace("text-white", "text-black");
  lillogo?.classList.replace("text-gray-300", "text-gray-900");
  hamburgerLines?.forEach(line => line.style.backgroundColor = "black");
  navLinks?.classList.replace("text-white", "text-black");  
});

  