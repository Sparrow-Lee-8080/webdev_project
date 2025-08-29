document.addEventListener("DOMContentLoaded", () => {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (!navbar) return; // safeguard if navbar doesn’t exist

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop && currentScroll > 200) {
            navbar.classList.add('hide');   // scrolling down → hide
        } else {
            navbar.classList.remove('hide'); // scrolling up → show
        }

        lastScrollTop = Math.max(currentScroll, 0); // avoid negatives
    });
});

const overlay = document.querySelector('.food-overlay');
const closeBtn = document.querySelector('.close-overlay');

closeBtn.addEventListener('click', closeOverlay);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
});

function closeOverlay() {
    const content = document.querySelector('.food-overlay-content');
    content.style.animation = 'popOut 0.4s forwards';
    overlay.style.animation = 'fadeOutOverlay 0.4s forwards';
    setTimeout(() => overlay.remove(), 400);
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('food-cards-container');

    // Only apply the flowing animation to food cards
    function initFoodFlowAnimation() {
        const cards = container.querySelectorAll('.food-card');
        cards.forEach(card => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.zIndex = '10';
                card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
                card.style.zIndex = '1';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Watch for dynamic content changes (food cards loaded asynchronously)
    const observer = new MutationObserver(initFoodFlowAnimation);
    observer.observe(container, { childList: true });

    // Initial run (in case cards already exist)
    initFoodFlowAnimation();

    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
});
