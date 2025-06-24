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
      
  navbar?.classList.add("bg-[#f5f5f0]", "shadow-md");
  navbar?.classList.remove("bg-transparent")
  logo?.classList.replace("text-white", "text-black");
  lillogo?.classList.replace("text-gray-300", "text-gray-900");
  hamburgerLines?.forEach(line => line.style.backgroundColor = "black");
  navLinks?.classList.replace("text-white", "text-black");

});

function removeGalleryImage(button) {
  const imageUrl = button.getAttribute("data-image");
  console.log("Siliniyor:", imageUrl);

  const removedInput = document.getElementById('removedGalleryImages');
  const currentRemoved = removedInput.value ? removedInput.value.split(',') : [];

  if (!currentRemoved.includes(imageUrl)) {
    currentRemoved.push(imageUrl);
    removedInput.value = currentRemoved.join(',');
    console.log("Güncellenmiş input:", removedInput.value);
  }

  const imageCard = button.closest('.relative');
  if (imageCard) {
    imageCard.classList.add('opacity-0', 'transition', 'duration-300');
    setTimeout(() => {
      imageCard.remove();

      const remaining = document.querySelectorAll('.grid .relative');
      if (remaining.length === 0) {
        const container = document.querySelector('.grid');
        if (container) {
          const message = document.createElement('p');
          message.className = 'text-sm text-gray-500';
          message.textContent = 'Mevcut galeri görseli bulunmamaktadır';
          container.parentElement.appendChild(message);
        }
      }
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".gallery-delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => removeGalleryImage(button));
  });
});
