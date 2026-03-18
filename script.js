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
                        <span>Play Now</span>
                    </div>
                </div>
                <h3>${game.title}</h3>
                <p>Unblocked • Web</p>
            `;
            card.addEventListener('click', () => openGame(game));
            gamesGrid.appendChild(card);
        });
    }

    function openGame(game) {
        gameFrame.src = game.iframeUrl;
        currentGameTitle.textContent = game.title;
        gamePlayer.classList.remove('hidden');
        hero.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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

    fullscreenBtn.addEventListener('click', () => {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) { /* Safari */
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) { /* IE11 */
            gameFrame.msRequestFullscreen();
        }
    });
});
