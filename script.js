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

    let allGames = [];

    // Fetch games from JSON
    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            renderGames(allGames);
        })
        .catch(err => console.error('Error loading games:', err));

    function renderGames(games) {
        gamesGrid.innerHTML = '';
        games.forEach(game => {
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
                </div>
                <h3>${game.title}</h3>
                <p>Unblocked • Web</p>
            `;
            
            // Main card click opens game normally
            card.addEventListener('click', (e) => {
                // If the fullscreen button was clicked, don't trigger the card's main click
                if (e.target.closest('.overlay-fs-btn')) return;
                openGame(game);
            });

            // Fullscreen button click opens game and triggers fullscreen
            const fsBtn = card.querySelector('.overlay-fs-btn');
            fsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openGame(game, true);
            });

            gamesGrid.appendChild(card);
        });
    }

    function openGame(game, autoFullscreen = false) {
        gameFrame.src = game.iframeUrl;
        currentGameTitle.textContent = game.title;
        gamePlayer.classList.remove('hidden');
        hero.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (autoFullscreen) {
            // Small delay to ensure iframe is loaded/visible before requesting fullscreen
            setTimeout(() => {
                triggerFullscreen();
            }, 100);
        }
    }

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
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allGames.filter(game => 
            game.title.toLowerCase().includes(query)
        );
        renderGames(filtered);
    });

    closeBtn.addEventListener('click', closeGame);
    logoBtn.addEventListener('click', closeGame);

    fullscreenBtn.addEventListener('click', triggerFullscreen);
});
