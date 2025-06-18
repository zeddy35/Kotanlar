document.addEventListener("DOMContentLoaded", () => {
    // Wait a tiny bit longer to ensure all elements are loaded
    setTimeout(() => {
        const hero = document.getElementById("hero");
        const navbar = document.getElementById("navbar");
        const hamburger_lines = document.querySelectorAll("#hamburger-btn .hamburger-line");
        const lillogo = document.getElementById("lillogo");
        const logo = document.getElementById("logo");

        // Check if elements exist before manipulating them
        if (navbar) {
            navbar.classList.remove("bg-transparent");
            navbar.classList.add("bg-[#f5f5f0]", "shadow-md");
        }

        if (logo) {
            logo.classList.remove("text-white");
            logo.classList.add("text-bla"); // Ensure 'text-bla' is defined in your Tailwind config
        }

        if (lillogo) {
            lillogo.classList.remove("text-gray-300");
            lillogo.classList.add("text-gray-900");
        }

        if (hamburger_lines.length > 0) {
            hamburger_lines.forEach(line => {
                line.style.backgroundColor = "black";
            });
        }
    }, 50); // 50ms delay
});

  // AOS başlat
  AOS.init({
    duration: 800,
    once: false
  });

  // scrollToNext fonksiyonu
  function scrollToNext() {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Lightbox
  const galleryImages = document.querySelectorAll(".gallery-img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (galleryImages.length > 0 && lightbox && lightboxImg) {
    galleryImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove("hidden");
      });
    });

    lightbox.addEventListener("click", () => {
      lightbox.classList.add("hidden");
    });

  }

  // Counter Animation
  function animateCounter(id, target, duration = 2000) {
    const element = document.getElementById(id);
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

  observer.observe(document.getElementById('hero'));

  // Lightbox functionality
  document.querySelectorAll('#projects img').forEach(img => {
    img.addEventListener('click', () => {
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox').classList.remove('hidden');
    });
  });

  document.getElementById('close-lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').classList.add('hidden');
  });

  // Initialize Glide slider
  new Glide('.glide', {
    type: 'carousel',
    perView: 1,
    gap: 30,
    breakpoints: {
      768: {
        perView: 1
      }
    }
  }).mount();

  