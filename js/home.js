$(document).ready(function () {
    const categoryPageMap = {
        "bread-based": "cat-one.html",
        "grilled": "cat-two.html",
        "fried": "cat-three.html",
        "wraps": "cat-four.html",
        "noodles": "cat-five.html",
        "rice-based": "cat-six.html",
        "soup": "cat-seven.html",
        "desserts": "cat-eight.html"
    };
    // =====================
    // Slider / Featured Foods
    // =====================
    $.getJSON("../data/food.json", function (foods) {
        const pageCategory = $("body").data("category");
        if (pageCategory) return;

        const displayFoods = foods
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 10);
        const $container = $("#food-slider");
        $container.empty();

        displayFoods.forEach(food => {
            const $card = $(`
                <div class="food-card slider-card">
                    <img src="${food.images[0]}" alt="${food.name}">
                    <div class="p-3">
                        <h5>${food.name}</h5>
                        <p class="text-muted small mb-2">${food.location.city}, ${food.location.state}</p>
                        <div class="food-stats">
                            <span class="likes"><i class="fas fa-thumbs-up"></i> ${food.likes}</span>
                            <span class="saved"><i class="fas fa-heart"></i> ${food.favorites}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-dark view-info" data-id="${food.id}">
                            View Info
                        </button>
                    </div>
                </div>
            `);
            $container.append($card);
        });

        // =====================
        // Overlay popup
        // =====================
        $(document).on("click", ".view-info", function () {
            const foodId = $(this).data("id");
            const food = foods.find(f => f.id === foodId);
            if (!food) return;

            const ingredientsHTML = (food.ingredients || [])
                .map(i => `<span class="item">${i}</span>`)
                .join("");
            const tagsHTML = (food.tags || [])
                .map(t => `<span class="item">${t}</span>`)
                .join("");
            const commentsHTML = (food.comment || [])
                .map(c => `
                    <div class="comment d-flex mb-3">
                        <div class="comment-avatar me-2">
                            ${c.avatar ? `<img src="${c.avatar}" alt="${c.userID}" class="rounded-circle" width="40" height="40">` 
                                       : `<i class="bi bi-person fs-2"></i>`}
                        </div>
                        <div class="comment-content">
                            <strong class="comment-username">${c.userID}</strong>
                            <p class="comment-text mb-0">${c.text}</p>
                        </div>
                    </div>
                `).join("");

            const $overlay = $(`
                <div class="food-overlay">
                    <div class="food-overlay-content">
                        <span class="close-overlay">&times;</span>
                        <div class="overlay-left">
                            <img src="${food.images[0]}" alt="${food.name}">
                        </div>
                        <div class="overlay-right">
                            <h2>${food.name}</h2>
                            <p>${food.description}</p>
                            <h5>Ingredients:</h5>
                            <div class="ingredients-tags">${ingredientsHTML}</div>
                            <h5>Tags:</h5>
                            <div class="ingredients-tags">${tagsHTML}</div>
                            <h5>Comments:</h5>
                            <div class="comments-section">${commentsHTML}</div>
                            <a href="${categoryPageMap[food.category] || '#'}" class="btn btn-outline-secondary find-out-more">
                                Find Out More
                            </a>
                        </div>
                    </div>
                </div>
            `);
            $("body").append($overlay);

            // Close overlay on click outside
            $overlay.on("click", function(e) {
                if (e.target === this) $overlay.remove();
            });

            // Close overlay via close button
            $overlay.find(".close-overlay").on("click", function () {
                $overlay.remove();
            });
        });
    });

    // =====================
    // Subscription Form
    // =====================
    $("#subscription-form").on("submit", function (e) {
        e.preventDefault();
        const email = $("#email").val().trim();
        const consent = $("#consent").is(":checked");
        this.classList.add("was-validated");

        if (!email || !consent) return;

        let subs = JSON.parse(localStorage.getItem("subscriptions")) || [];
        subs.push({ email, date: new Date().toISOString() });
        localStorage.setItem("subscriptions", JSON.stringify(subs));

        this.reset();
        this.classList.remove("was-validated");
        alert("🎉 Subscription successful!");
    });
});
