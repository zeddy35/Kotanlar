
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
  // Scroll olaylarını tek yerde topla
  window.addEventListener("scroll", () => {
    const hero = document.getElementById("hero");
    const navbar = document.getElementById("navbar");
    const hamburger_line = document.querySelectorAll("#hamburger-btn .hamburger-line");
    const body = document.body;
    const navLinks = document.getElementById("nav-links");
    const lillogo = document.getElementById("lillogo");
    const logo = document.getElementById("logo");

    if (hero && window.scrollY > hero.offsetHeight - 50) {
      body.classList.add("after-hero");
    } else {
      body.classList.remove("after-hero");
    }

    if (window.scrollY > 20) {
      navbar.classList.remove("bg-transparent");
      navbar.classList.add("bg-[#f5f5f0]", "shadow-md");
      logo.classList.remove("text-white");
      logo.classList.add("text-bla");
      lillogo.classList.remove("text-gray-300");
      lillogo.classList.add("text-gray-900");
      hamburger_line.forEach(line => {
      line.style.backgroundColor = "black";
      });


      if (navLinks) {
        navLinks.classList.remove("text-white");
        navLinks.classList.add("text-black");
      }
    } else {
      navbar.classList.remove("bg-[#f5f5f0]", "shadow-md");
      logo.classList.add("text-white");
      logo.classList.remove("text-black");
      lillogo.classList.add("text-gray-300");
      lillogo.classList.remove("text-gray-900");
      hamburgerLines.forEach(line => {
        line.style.backgroundColor = "white";
      });

      if (navLinks) {
        navLinks.classList.add("text-white");
        navLinks.classList.remove("text-black");
      }
    }
  });


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

  // Initialize counters when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter('projects-counter', 6);
        animateCounter('clients-counter', 200);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

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


  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Sayfa yenilenmesin

    const formData = new FormData(form);
    const formBody = new URLSearchParams(formData);

    try {
      const res = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (data.success) {
        successBox.classList.remove("hidden");
        form.reset(); // Formu temizle
      } else {
        alert("Form gönderilirken bir hata oluştu.");
        console.error(data);
      }
    } catch (err) {
      console.error("Hata:", err);
      alert("Sunucuya ulaşılamıyor.");
    }
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