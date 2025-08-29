document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('food-cards-container');
    const category = document.body.dataset.category; // e.g., data-category="cat-one"
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginPage = 'auth.html'; // fallback login page

    const searchInput = document.getElementById('search-input');
    const ingredientsWrapper = document.getElementById('ingredients-filter-wrapper');
    const tagsWrapper = document.getElementById('tags-filter-wrapper');
    const stateFilter = document.getElementById('state-filter');
    const cityFilter = document.getElementById('city-filter');
    const sortBy = document.getElementById('sort-by');
    const resetBtn = document.getElementById('reset-filters');

    let foods = [];
    let selectedIngredients = [];
    let selectedTags = [];

    // ---------------- Load JSON ----------------
    async function loadFoods() {
        const res = await fetch('../data/food.json');
        const data = await res.json();
        foods = data;
        populateFilters(foods);
        renderCards();
    }

    // ---------------- Populate Filters ----------------
    function populateFilters(foods) {
        const ingredientsSet = new Set();
        const tagsSet = new Set();
        const statesSet = new Set();
        const citiesMap = {};

        foods.forEach(f => {
            f.ingredients.forEach(i => ingredientsSet.add(i));
            f.tags.forEach(t => tagsSet.add(t));
            if (f.location?.state && f.location?.city) {
                statesSet.add(f.location.state);
                if (!citiesMap[f.location.state]) citiesMap[f.location.state] = new Set();
                citiesMap[f.location.state].add(f.location.city);
            }
        });

        // Ingredients
        const ingredientsList = ingredientsWrapper.querySelector('.options');
        ingredientsList.innerHTML = Array.from(ingredientsSet).map(i => `<li data-value="${i}">${i}</li>`).join('');
        setupMultiSelect(ingredientsWrapper, selectedIngredients);

        // Tags
        const tagsList = tagsWrapper.querySelector('.options');
        tagsList.innerHTML = Array.from(tagsSet).map(t => `<li data-value="${t}">${t}</li>`).join('');
        setupMultiSelect(tagsWrapper, selectedTags);

        // States
        stateFilter.innerHTML = '<option value="">State</option>' + Array.from(statesSet).map(s => `<option value="${s}">${s}</option>`).join('');
        stateFilter.addEventListener('change', () => {
            const selectedState = stateFilter.value;
            const cities = selectedState ? Array.from(citiesMap[selectedState]) : [];
            cityFilter.innerHTML = '<option value="">City</option>' + cities.map(c => `<option value="${c}">${c}</option>`).join('');
            renderCards();
        });
    }

    // ---------------- Multi-select ----------------
    function setupMultiSelect(wrapper, selectedArray) {
        const selectedDiv = wrapper.querySelector('.selected-items');
        wrapper.addEventListener('click', () => wrapper.classList.toggle('open'));

        wrapper.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', e => {
                e.stopPropagation();
                const val = li.dataset.value;
                if (selectedArray.includes(val)) selectedArray.splice(selectedArray.indexOf(val), 1);
                else selectedArray.push(val);

                li.classList.toggle('selected');
                selectedDiv.textContent = selectedArray.length ? selectedArray.join(', ') : wrapper.id.includes('ingredients') ? 'Ingredients' : 'Tags';
                renderCards();
            });
        });
    }

    // ---------------- Get Filtered Foods ----------------
    function getFilteredFoods() {
        const search = searchInput.value.trim().toLowerCase();
        let filtered = foods.filter(f => f.category === category);

        // Search
        if (search) {
            filtered = filtered.filter(f => f.name.toLowerCase().includes(search) || f.description.toLowerCase().includes(search));
        }

        // Ingredients
        if (selectedIngredients.length) {
            filtered = filtered.filter(f => selectedIngredients.every(i => f.ingredients.includes(i)));
        }

        // Tags
        if (selectedTags.length) {
            filtered = filtered.filter(f => selectedTags.every(t => f.tags.includes(t)));
        }

        // State / City
        if (stateFilter.value) filtered = filtered.filter(f => f.location?.state === stateFilter.value);
        if (cityFilter.value) filtered = filtered.filter(f => f.location?.city === cityFilter.value);

        // Sort
        if (sortBy.value === 'likes') filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        if (sortBy.value === 'favorites') filtered.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));

        return filtered;
    }

    // ---------------- Render Cards ----------------
    function renderCards() {
        container.innerHTML = '';
        const filtered = getFilteredFoods();

        if (!filtered.length) {
            container.innerHTML = `<p class="no-results">No results found.</p>`;
            return;
        }

        filtered.forEach(food => {
            const col = document.createElement('div');
            col.className = 'col-md-3';

            const card = document.createElement('div');
            card.className = 'food-card';
            card.innerHTML = `
                <img src="${food.images[0]}" alt="${food.name}">
                <div class="card-body">
                    <h5>${food.name}</h5>
                    <p class="location">${food.location.city}, ${food.location.state}</p>
                    <div class="food-card-buttons">
                        <button class="like-btn btn btn-sm ${food.likedUsers?.includes(loggedInUser) ? 'btn-danger' : 'btn-outline-danger'}">
                            <i class="bi bi-heart${food.likedUsers?.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.likes || 0}
                        </button>
                        <button class="fav-btn btn btn-sm ${food.favUsers?.includes(loggedInUser) ? 'btn-primary' : 'btn-outline-primary'}">
                            <i class="bi bi-star${food.favUsers?.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.favorites || 0}
                        </button>
                        <button class="view-info btn btn-sm btn-outline-secondary" data-id="${food.id}">
                            <i class="bi bi-eye"></i> View
                        </button>
                    </div>
                </div>
            `;
            col.appendChild(card);
            container.appendChild(col);

            // Button Handlers
            setupCardButtons(card, food);
        });
    }

    // ---------------- Card & Overlay Button Handlers ----------------
    function setupCardButtons(card, food) {
        const likeBtn = card.querySelector('.like-btn');
        const favBtn = card.querySelector('.fav-btn');
        const viewBtn = card.querySelector('.view-info');

        likeBtn.addEventListener('click', () => toggleLike(food, likeBtn));
        favBtn.addEventListener('click', () => toggleFav(food, favBtn));
        viewBtn.addEventListener('click', () => showOverlay(food));
    }

    function toggleLike(food, btn) {
        if (!loggedInUser) { window.location.href = loginPage; return; }
        food.likedUsers = food.likedUsers || [];
        const idx = food.likedUsers.indexOf(loggedInUser);
        if (idx > -1) {
            food.likedUsers.splice(idx, 1); // user unlikes
        } else {
            food.likedUsers.push(loggedInUser); // user likes
        }
        food.likes = food.likedUsers.length; // keep real count
        updateLikeFavDisplay(food); // update cards & overlay
    }

    function toggleFav(food, btn) {
        if (!loggedInUser) { window.location.href = loginPage; return; }
        food.favUsers = food.favUsers || [];
        const idx = food.favUsers.indexOf(loggedInUser);
        if (idx > -1) {
            food.favUsers.splice(idx, 1); // user un-favs
        } else {
            food.favUsers.push(loggedInUser); // user favs
        }
        food.favorites = food.favUsers.length;
        updateLikeFavDisplay(food); // update cards & overlay
    }

    function updateLikeFavDisplay(food) {
        // Update all cards
        document.querySelectorAll(`.food-card`).forEach(card => {
            const name = card.querySelector('h5').textContent;
            if (name === food.name) {
                const likeBtn = card.querySelector('.like-btn');
                const favBtn = card.querySelector('.fav-btn');

                likeBtn.className = `like-btn btn btn-sm ${food.likedUsers.includes(loggedInUser) ? 'btn-danger' : 'btn-outline-danger'}`;
                likeBtn.innerHTML = `<i class="bi bi-heart${food.likedUsers.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.likes}`;

                favBtn.className = `fav-btn btn btn-sm ${food.favUsers.includes(loggedInUser) ? 'btn-primary' : 'btn-outline-primary'}`;
                favBtn.innerHTML = `<i class="bi bi-star${food.favUsers.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.favorites}`;
            }
        })

        // Update overlay if open
        const overlay = document.querySelector('.food-overlay');
        if (overlay) {
            const overlayName = overlay.querySelector('h2').textContent;
            if (overlayName === food.name) {
                const likeBtn = overlay.querySelector('.like-btn');
                const favBtn = overlay.querySelector('.fav-btn');

                likeBtn.className = `like-btn btn btn-sm ${food.likedUsers.includes(loggedInUser) ? 'btn-danger' : 'btn-outline-danger'}`;
                likeBtn.innerHTML = `<i class="bi bi-heart${food.likedUsers.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.likes}`;

                favBtn.className = `fav-btn btn btn-sm ${food.favUsers.includes(loggedInUser) ? 'btn-primary' : 'btn-outline-primary'}`;
                favBtn.innerHTML = `<i class="bi bi-star${food.favUsers.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.favorites}`;
            }
        }
    }
    
    // ---------------- Overlay ----------------
    function showOverlay(food) {
        const ingredientsHTML = (food.ingredients || []).map(i => `<li>${i}</li>`).join('');
        const tagsHTML = (food.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

        const overlay = document.createElement('div');
        overlay.className = 'food-overlay';
        overlay.innerHTML = `
            <div class="food-overlay-content">
                <span class="close-overlay">&times;</span>
                <div class="overlay-left">
                    <img src="${food.images[0]}" alt="${food.name}">
                </div>
                <div class="overlay-right">
                    <h2>${food.name}</h2>
                    <p>${food.description}</p>
                    <h5>Ingredients:</h5>
                    <ul>${ingredientsHTML}</ul>
                    <h5>Tags:</h5>
                    <div>${tagsHTML}</div>
                    <div class="overlay-buttons">
                        <button class="like-btn btn btn-sm ${food.likedUsers?.includes(loggedInUser) ? 'btn-danger' : 'btn-outline-danger'}">
                            <i class="bi bi-heart${food.likedUsers?.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.likes || 0}
                        </button>
                        <button class="fav-btn btn btn-sm ${food.favUsers?.includes(loggedInUser) ? 'btn-primary' : 'btn-outline-primary'}">
                            <i class="bi bi-star${food.favUsers?.includes(loggedInUser) ? '-fill' : ''}"></i> ${food.favorites || 0}
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.close-overlay').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

        // Overlay buttons
        const likeBtn = overlay.querySelector('.like-btn');
        const favBtn = overlay.querySelector('.fav-btn');
        likeBtn.addEventListener('click', () => toggleLike(food, likeBtn));
        favBtn.addEventListener('click', () => toggleFav(food, favBtn));
    }

    // ---------------- Event Listeners ----------------
    searchInput.addEventListener('input', renderCards);
    sortBy.addEventListener('change', renderCards);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        selectedIngredients = [];
        selectedTags = [];
        stateFilter.value = '';
        cityFilter.value = '';
        renderCards();
    });

    // ---------------- Init ----------------
    loadFoods();
});

document.addEventListener("DOMContentLoaded", async () => {
    const session = JSON.parse(localStorage.getItem('auth_session'));
    if (!session || !session.user) return;

    const user = session.user;

    // ---------- 1. Load User Profile ----------
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.innerHTML = `
            <img src="${user.profileImage || '../assets/default-avatar.png'}" alt="${user.fullname}" class="profile-image">
            <h2>${user.fullname}</h2>
            <p>@${user.username}</p>
            <p>${user.email}</p>
        `;
    }

    // ---------- 2. Load Saved Foods (placeholder) ----------
    const savedFoodsList = document.getElementById('saved-foods-list');
    if (savedFoodsList) {
        const res = await fetch('../data/food.json'); // adjust path
        const allFoods = await res.json();

        // Option 1: show top 5 foods by favorites as "Saved"
        const topSavedFoods = allFoods.sort((a,b) => b.favorites - a.favorites).slice(0,5);

        savedFoodsList.innerHTML = '';
        topSavedFoods.forEach(food => {
            const li = document.createElement('li');
            li.textContent = food.name;
            savedFoodsList.appendChild(li);
        });
    }

    // ---------- 3. Load Recommended Foods ----------
    const recCol1 = document.getElementById('rec-food-col1');
    const recCol2 = document.getElementById('rec-food-col2');

    if (recCol1 && recCol2) {
        // Top 20 most-liked foods
        const topFoods = allFoods.sort((a,b) => b.likes - a.likes).slice(0, 20);

        // Split into two columns
        topFoods.forEach((food, index) => {
            const card = document.createElement('div');
            card.className = 'food-card';
            card.innerHTML = `
                <img src="${food.images[0]}" alt="${food.name}">
                <p>${food.name}</p>
            `;

            // Alternate columns
            if (index % 2 === 0) recCol1.appendChild(card);
            else recCol2.appendChild(card);
        });
    }

    // ---------- Cookie Consent ----------
    (function() {
        if (localStorage.getItem("cookiesAccepted")) return; // Already accepted
    
        // Create banner
        const banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.style.cssText = "position:fixed;bottom:0;left:0;width:100%;text-align:center;z-index:9999;";
        banner.innerHTML = `
            This site uses cookies to improve your experience. Click "Accept" to allow, or "Reject" to decline.
            <button id="accept-cookies">Accept</button>
            <button id="reject-cookies">Reject</button>
        `;
        document.body.appendChild(banner);
    
        // Button handlers
        document.getElementById("accept-cookies").addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true");
            document.body.removeChild(banner);
            runCookieTracker(); // Call the tracker script here
        });
        document.getElementById("reject-cookies").addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "false");
            document.body.removeChild(banner);
        });
    
        // Tracker script
        function runCookieTracker() {
            // Track last 5 pages
            const lastPages = getCookie("lastPages") ? JSON.parse(getCookie("lastPages")) : [];
            const currentPage = window.location.pathname;
            if (lastPages[0] !== currentPage) lastPages.unshift(currentPage);
            if (lastPages.length > 5) lastPages.pop();
            setCookie("lastPages", JSON.stringify(lastPages), 30);
        
            // Track total visits
            let visits = parseInt(getCookie("visitCount") || "0", 10);
            visits++;
            setCookie("visitCount", visits, 30);
        
            console.log("Cookie Tracker:", { lastPages, visits });
        }
    
        function setCookie(name, value, days) {
            const expires = days ? "; expires=" + new Date(Date.now() + days*24*60*60*1000).toUTCString() : "";
            document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
        }
    
        function getCookie(name) {
            const matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
            return matches ? decodeURIComponent(matches[1]) : null;
        }
    })();

});

