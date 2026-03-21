document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const searchInput = document.getElementById('search-input');
    const gamePlayer = document.getElementById('game-player');
    const hero = document.getElementById('hero');
    const gameFrame = document.getElementById('game-frame');
    const currentGameTitle = document.getElementById('current-game-title');
    const closeBtn = document.getElementById('close-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const logoBtn = document.getElementById('logo-btn');
    const playerStarRating = document.getElementById('player-star-rating');
    const sortSelect = document.getElementById('sort-select');
    const categorySelect = document.getElementById('category-select');
    const gameDescription = document.getElementById('game-description');

    let allGames = [];
    let currentGameId = null;
    let currentFilter = 'all';

    // Fetch games from JSON
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            updateGames();
        })
        .catch(err => console.error('Error loading games:', err));

    // Rating Logic
    function getRating(gameId) {
        const ratings = JSON.parse(localStorage.getItem('nexus-games-ratings') || '{}');
        return ratings[gameId] || 0;
    }

    function setRating(gameId, rating) {
        const ratings = JSON.parse(localStorage.getItem('nexus-games-ratings') || '{}');
        ratings[gameId] = rating;
        localStorage.setItem('nexus-games-ratings', JSON.stringify(ratings));
        updateGames(); // Refresh grid to show new rating
    }

    // Favorites Logic
    function getFavorites() {
        return JSON.parse(localStorage.getItem('nexus-games-favorites') || '[]');
    }

    function isFavorite(gameId) {
        return getFavorites().includes(gameId);
    }

    function toggleFavorite(gameId) {
        let favorites = getFavorites();
        if (favorites.includes(gameId)) {
            favorites = favorites.filter(id => id !== gameId);
        } else {
            favorites.push(gameId);
        }
        localStorage.setItem('nexus-games-favorites', JSON.stringify(favorites));
        updateGames();
    }

    function updateStars(container, rating) {
        const stars = container.querySelectorAll('i');
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.className = 'fas fa-star';
            } else {
                star.className = 'far fa-star';
            }
        });
    }

    function renderGames(games) {
        gamesGrid.innerHTML = '';
        if (games.length === 0) {
            gamesGrid.innerHTML = '<div class="no-results">No games found matching your criteria.</div>';
            return;
        }
        games.forEach(game => {
            const rating = getRating(game.id);
            const favorite = isFavorite(game.id);
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="thumb-container">
                    <img src="${game.thumbnail}" alt="${game.title}" referrerPolicy="no-referrer">
                    <div class="play-overlay">
                        <div class="overlay-buttons">
                            <button class="overlay-play-btn">Play Now</button>
                            <button class="overlay-fs-btn" title="Fullscreen"><i class="fas fa-expand"></i></button>
                        </div>
                    </div>
                    <button class="favorite-btn ${favorite ? 'active' : ''}" title="${favorite ? 'Remove from Favorites' : 'Add to Favorites'}">
                        <i class="${favorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="card-info">
                    <h3>${game.title}</h3>
                    <div class="game-tags">
                        ${(game.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(i => `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
                    </div>
                    <p>Unblocked • Web</p>
                </div>
            `;
            
            // Main card click opens game normally
            card.addEventListener('click', (e) => {
                // If the fullscreen button or favorite button was clicked, don't trigger the card's main click
                if (e.target.closest('.overlay-fs-btn') || e.target.closest('.favorite-btn')) return;
                openGame(game);
            });

            // Fullscreen button click opens game and triggers fullscreen
            const fsBtn = card.querySelector('.overlay-fs-btn');
            fsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openGame(game, true);
            });

            // Favorite button click
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(game.id);
            });

            gamesGrid.appendChild(card);
        });
    }

    function updateGames() {
        const query = searchInput.value.toLowerCase();
        const sortType = sortSelect.value;

        // 1. Filter by search query
        let filtered = allGames.filter(game => 
            game.title.toLowerCase().includes(query) || 
            (game.tags && game.tags.some(tag => tag.toLowerCase().includes(query)))
        );

        // 2. Filter by category/tag (if not 'all')
        if (currentFilter === 'favorites') {
            filtered = filtered.filter(game => isFavorite(game.id));
        } else if (currentFilter !== 'all') {
            filtered = filtered.filter(game => 
                (game.tags && game.tags.some(tag => tag.toLowerCase() === currentFilter)) ||
                game.title.toLowerCase().includes(currentFilter)
            );
        }

        // 3. Sort
        if (sortType === 'title-az') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'title-za') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sortType === 'rating-high') {
            filtered.sort((a, b) => getRating(b.id) - getRating(a.id));
        } else if (sortType === 'rating-low') {
            filtered.sort((a, b) => getRating(a.id) - getRating(b.id));
        }

        renderGames(filtered);
    }

    function openGame(game, autoFullscreen = false) {
        currentGameId = game.id;
        gameFrame.src = game.iframeUrl;
        currentGameTitle.textContent = game.title;
        gameDescription.textContent = game.description || 'Play unblocked on Nexus Games. Instant browser play, no downloads required.';
        gamePlayer.classList.remove('hidden');
        hero.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update player stars
        updateStars(playerStarRating, getRating(game.id));

        if (autoFullscreen) {
            // Small delay to ensure iframe is loaded/visible before requesting fullscreen
            setTimeout(() => {
                triggerFullscreen();
            }, 100);
        }
    }

    // Handle player star clicks
    playerStarRating.addEventListener('click', (e) => {
        const star = e.target.closest('i');
        if (star && currentGameId) {
            const rating = parseInt(star.getAttribute('data-rating'));
            setRating(currentGameId, rating);
            updateStars(playerStarRating, rating);
        }
    });

    function triggerFullscreen() {
        const player = document.getElementById('game-player');
        if (!document.fullscreenElement) {
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            } else if (player.msRequestFullscreen) {
                player.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Update button icon when fullscreen changes (e.g. via Esc key)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        }
    });

    function closeGame() {
        gamePlayer.classList.add('hidden');
        hero.classList.remove('hidden');
        gameFrame.src = '';
    }

    // Search functionality
    searchInput.addEventListener('input', updateGames);

    // Sort functionality
    sortSelect.addEventListener('change', updateGames);

    // Category dropdown functionality
    categorySelect.addEventListener('change', () => {
        currentFilter = categorySelect.value;
        // Deactivate all buttons if a specific category is selected from dropdown
        // except if it's 'all'
        filterBtns.forEach(b => b.classList.remove('active'));
        if (currentFilter === 'all') {
            filterBtns[0].classList.add('active');
        }
        updateGames();
    });

    // Filter functionality (basic)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Reset category dropdown when a button is clicked
            categorySelect.value = 'all';
            
            // Use innerText and trim to get clean text even with icons
            currentFilter = btn.innerText.trim().toLowerCase();
            updateGames();
        });
    });

    closeBtn.addEventListener('click', closeGame);
    logoBtn.addEventListener('click', () => {
        closeGame();
        searchInput.value = '';
        sortSelect.value = 'default';
        categorySelect.value = 'all';
        currentFilter = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns[0].classList.add('active');
        updateGames();
    });

    fullscreenBtn.addEventListener('click', triggerFullscreen);
});
