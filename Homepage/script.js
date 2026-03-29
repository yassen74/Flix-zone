const authUi = {};
const appUi = {};

let authHideTimer = null;
let profileHideTimer = null;
let movieHideTimer = null;
let heroRotationTimer = null;
let currentHeroIndex = 0;
let heroStatusTimer = null;
let movieStatusTimer = null;
let currentMovieData = null;

const FEATURED_MOVIES = [
    {
        badge: 'FEATURED',
        title: 'Man Of Steel',
        meta: 'Action / Sci-fi | 2013 | 2h 23m',
        ratingLabel: 'IMDB',
        ratingValue: '8.2 (12,827)',
        description: 'A world-changing origin story where Clark Kent steps out of the shadows and becomes Earth\'s most visible hope.',
        backdrop: 'Assets/bg3.jpg',
        trailerUrl: 'Assets/First.mp4',
        browseTarget: '#best-picks'
    },
    {
        badge: 'NEW DROP',
        title: 'Kraven The Hunter',
        meta: 'Action / Thriller | 2024 | 2h 7m',
        ratingLabel: 'TRENDING',
        ratingValue: 'High-intensity buzz',
        description: 'A brutal survival chase unfolds through a darker, moodier wilderness with a relentless antihero at the center.',
        backdrop: 'Assets/kraven-the-hunter-3840x2160-18281.jpeg',
        trailerUrl: 'Assets/trailer.mp4',
        browseTarget: '#top-rated'
    },
    {
        badge: 'EDITOR\'S PICK',
        title: 'Midnight Protocol',
        meta: 'Mystery / Action | 2024 | 1h 58m',
        ratingLabel: 'FLIXZONE',
        ratingValue: 'Staff favorite',
        description: 'An elite crew races through one impossible night, trading secrets, high stakes, and neon-lit danger.',
        backdrop: 'Assets/bg1.jpg',
        trailerUrl: 'Assets/First.mp4',
        browseTarget: '#my-list'
    },
    {
        badge: 'COMING SOON',
        title: 'Shadow Realm',
        meta: 'Fantasy / Epic | 2024 | 2h 11m',
        ratingLabel: 'PREMIERE',
        ratingValue: 'Trailer pending',
        description: 'A mythical kingdom stands on the edge of collapse as a reluctant hero crosses into an ancient war.',
        backdrop: 'Assets/Mainpos.jpg',
        trailerUrl: '',
        browseTarget: '#best-picks'
    }
];

const POSTER_LIBRARY = {
    'Rectangle 6.png': {
        title: 'Dune',
        description: 'A young heir rises on the deadliest planet in the galaxy and discovers a destiny larger than any empire.',
        genre: 'Sci-fi / Adventure',
        year: '2021',
        rating: '8.0 / 10',
        trailerUrl: 'Assets/First.mp4'
    },
    'pos5.jpg': {
        title: 'Uncharted',
        description: 'A fast-moving treasure hunt pulls two unlikely partners into a globe-trotting race filled with deception and danger.',
        genre: 'Action / Adventure',
        year: '2022',
        rating: '6.3 / 10',
        trailerUrl: 'Assets/trailer.mp4'
    },
    'pos1.jpg': {
        title: 'Tenet',
        description: 'A secret operative enters a time-bending mission where every decision ripples backward and forward at once.',
        genre: 'Action / Sci-fi',
        year: '2020',
        rating: '7.3 / 10',
        trailerUrl: 'Assets/trailer.mp4'
    },
    'pos2.jpg': {
        title: '96',
        description: 'Two former classmates reunite after decades apart and spend one unforgettable evening revisiting old emotions.',
        genre: 'Romance / Drama',
        year: '2018',
        rating: '8.5 / 10',
        trailerUrl: ''
    },
    'pos3.jpg': {
        title: 'Joker',
        description: 'A lonely man pushed to the margins spirals into chaos and becomes the face of a citywide uprising.',
        genre: 'Crime / Drama',
        year: '2019',
        rating: '8.4 / 10',
        trailerUrl: 'Assets/First.mp4'
    },
    'pos6.jpg': {
        title: 'The Adam Project',
        description: 'A time-traveling pilot crashes into his past and teams up with his younger self to save the future.',
        genre: 'Sci-fi / Adventure',
        year: '2022',
        rating: '6.7 / 10',
        trailerUrl: 'Assets/trailer.mp4'
    },
    'Pos7.jpeg': {
        title: 'Aladdin',
        description: 'A street-smart dreamer, a magical lamp, and a soaring kingdom adventure collide in a vibrant fantasy ride.',
        genre: 'Fantasy / Adventure',
        year: '2019',
        rating: '6.9 / 10',
        trailerUrl: 'Assets/First.mp4'
    },
    'pos8.jpeg': {
        title: 'Confused',
        description: 'A tense mystery unfolds as a fractured lead follows half-truths through a city glowing with late-night neon.',
        genre: 'Thriller / Mystery',
        year: '2024',
        rating: '7.1 / 10',
        trailerUrl: ''
    },
    'pos9.jpeg': {
        title: 'Midnight Chase',
        description: 'One desperate escape turns into a relentless city sprint where every alley hides a new threat.',
        genre: 'Action / Thriller',
        year: '2024',
        rating: '7.0 / 10',
        trailerUrl: ''
    }
};

document.addEventListener('DOMContentLoaded', function initializeHomepage() {
    cacheAuthUi();
    cacheAppUi();
    bindCarousel('button.prev', 'button.next', '.movie-carousel', 400);
    bindCarousel('button.prev1', 'button.next1', '.movie-carousel1', 300);
    bindHomepageButtons();
    bindMovieCards();
    bindLegacyAuthButtons();
    bindAuthModalEvents();
    bindProfilePanelEvents();
    bindMovieModalEvents();
    renderHeroIndicators();
    renderHeroMovie(0, true);
    startHeroRotation();
    applyLegacyAuthState();
});

function cacheAppUi() {
    appUi.heroSection = document.querySelector('.featured-movie');
    appUi.heroBadge = document.getElementById('hero-badge');
    appUi.heroMeta = document.getElementById('hero-meta');
    appUi.heroTitle = document.getElementById('hero-title');
    appUi.heroRatingLabel = document.getElementById('hero-rating-label');
    appUi.heroRatingValue = document.getElementById('hero-rating-value');
    appUi.heroDescription = document.getElementById('hero-description');
    appUi.heroTrailerButton = document.getElementById('hero-trailer-button');
    appUi.heroBrowseButton = document.getElementById('hero-browse-button');
    appUi.heroStatus = document.getElementById('hero-status');
    appUi.heroIndicators = document.getElementById('hero-indicators');
    appUi.myListBrowseButton = document.getElementById('my-list-browse-button');
    appUi.profilePanel = document.getElementById('profile-panel');
    appUi.profileOverlay = appUi.profilePanel ? appUi.profilePanel.querySelector('.profile-panel__overlay') : null;
    appUi.profileCloseButton = document.getElementById('profile-panel-close');
    appUi.profileUsername = document.getElementById('profile-panel-username');
    appUi.profileEmail = document.getElementById('profile-panel-email');
    appUi.profileMyListButton = document.getElementById('profile-panel-my-list');
    appUi.profileLogoutButton = document.getElementById('profile-panel-logout');
    appUi.movieCards = document.querySelectorAll('.movie-carousel img, .movie-carousel1 img');
    appUi.movieModal = document.getElementById('movie-modal');
    appUi.movieOverlay = appUi.movieModal ? appUi.movieModal.querySelector('.movie-modal__overlay') : null;
    appUi.movieCloseButton = document.getElementById('movie-modal-close');
    appUi.movieCloseAction = document.getElementById('movie-modal-close-action');
    appUi.moviePoster = document.getElementById('movie-modal-poster');
    appUi.movieTitle = document.getElementById('movie-modal-title');
    appUi.movieGenre = document.getElementById('movie-modal-genre');
    appUi.movieYear = document.getElementById('movie-modal-year');
    appUi.movieRating = document.getElementById('movie-modal-rating');
    appUi.movieDescription = document.getElementById('movie-modal-description');
    appUi.movieMessage = document.getElementById('movie-modal-message');
    appUi.movieTrailerButton = document.getElementById('movie-modal-trailer');
}

function cacheAuthUi() {
    authUi.modal = document.getElementById('auth-modal');
    authUi.overlay = authUi.modal ? authUi.modal.querySelector('.auth-modal__overlay') : null;
    authUi.closeButton = document.getElementById('auth-modal-close');
    authUi.title = document.getElementById('auth-modal-title');
    authUi.subtitle = document.getElementById('auth-modal-subtitle');
    authUi.message = document.getElementById('auth-modal-message');
    authUi.tabs = document.querySelectorAll('[data-auth-mode]');
    authUi.loginForm = document.getElementById('auth-login-form');
    authUi.signupForm = document.getElementById('auth-signup-form');
    authUi.loginEmail = document.getElementById('auth-login-email');
    authUi.loginPassword = document.getElementById('auth-login-password');
    authUi.signupUsername = document.getElementById('auth-signup-username');
    authUi.signupEmail = document.getElementById('auth-signup-email');
    authUi.signupPassword = document.getElementById('auth-signup-password');
}

function bindHomepageButtons() {
    if (appUi.heroTrailerButton) {
        appUi.heroTrailerButton.addEventListener('click', function onTrailerClick() {
            openTrailerForMovie(FEATURED_MOVIES[currentHeroIndex]);
        });
    }

    if (appUi.heroBrowseButton) {
        appUi.heroBrowseButton.addEventListener('click', function onBrowseClick() {
            scrollToTarget(FEATURED_MOVIES[currentHeroIndex].browseTarget || '#best-picks');
        });
    }

    if (appUi.myListBrowseButton) {
        appUi.myListBrowseButton.addEventListener('click', function onMyListBrowseClick() {
            scrollToTarget('#best-picks');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function bindAnchorLink(link) {
        link.addEventListener('click', function onAnchorClick(event) {
            const target = link.getAttribute('href');

            if (!target || target === '#') {
                return;
            }

            const section = document.querySelector(target);

            if (!section) {
                return;
            }

            event.preventDefault();
            scrollToTarget(target);
            hideSidebar();
        });
    });
}

function bindCarousel(prevSelector, nextSelector, carouselSelector, scrollAmount) {
    const prevButton = document.querySelector(prevSelector);
    const nextButton = document.querySelector(nextSelector);
    const carousel = document.querySelector(carouselSelector);

    if (!prevButton || !nextButton || !carousel) {
        return;
    }

    nextButton.addEventListener('click', function onNextClick() {
        carousel.scrollBy({
            top: 0,
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prevButton.addEventListener('click', function onPrevClick() {
        carousel.scrollBy({
            top: 0,
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
}

function renderHeroIndicators() {
    if (!appUi.heroIndicators) {
        return;
    }

    appUi.heroIndicators.innerHTML = '';

    FEATURED_MOVIES.forEach(function appendIndicator(movie, index) {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.className = 'hero-indicator';
        indicator.setAttribute('aria-label', `Show ${movie.title}`);
        indicator.addEventListener('click', function onIndicatorClick() {
            renderHeroMovie(index);
            restartHeroRotation();
        });
        appUi.heroIndicators.appendChild(indicator);
    });
}

function renderHeroMovie(index, skipTransition) {
    const nextIndex = ((index % FEATURED_MOVIES.length) + FEATURED_MOVIES.length) % FEATURED_MOVIES.length;
    const movie = FEATURED_MOVIES[nextIndex];

    currentHeroIndex = nextIndex;

    if (appUi.heroSection && !skipTransition) {
        appUi.heroSection.classList.add('is-changing');
    }

    window.setTimeout(function applyHeroMovie() {
        if (appUi.heroSection) {
            appUi.heroSection.style.backgroundImage = `linear-gradient(90deg, rgba(7, 7, 11, 0.92) 0%, rgba(7, 7, 11, 0.72) 45%, rgba(7, 7, 11, 0.32) 100%), url("${movie.backdrop}")`;
        }

        if (appUi.heroBadge) {
            appUi.heroBadge.textContent = movie.badge;
        }

        if (appUi.heroMeta) {
            appUi.heroMeta.textContent = movie.meta;
        }

        if (appUi.heroTitle) {
            appUi.heroTitle.textContent = movie.title;
        }

        if (appUi.heroRatingLabel) {
            appUi.heroRatingLabel.textContent = movie.ratingLabel;
        }

        if (appUi.heroRatingValue) {
            appUi.heroRatingValue.textContent = movie.ratingValue;
        }

        if (appUi.heroDescription) {
            appUi.heroDescription.textContent = movie.description;
        }

        if (appUi.heroIndicators) {
            Array.from(appUi.heroIndicators.children).forEach(function updateIndicator(indicator, indicatorIndex) {
                indicator.classList.toggle('is-active', indicatorIndex === currentHeroIndex);
            });
        }

        if (appUi.heroSection) {
            appUi.heroSection.classList.remove('is-changing');
        }
    }, skipTransition ? 0 : 140);
}

function startHeroRotation() {
    if (FEATURED_MOVIES.length <= 1) {
        return;
    }

    heroRotationTimer = window.setInterval(function rotateHero() {
        renderHeroMovie(currentHeroIndex + 1);
    }, 6500);
}

function restartHeroRotation() {
    if (heroRotationTimer) {
        window.clearInterval(heroRotationTimer);
    }

    startHeroRotation();
}

function openTrailerForMovie(movie) {
    if (!movie || !movie.trailerUrl) {
        showHeroStatus('Trailer is not available yet.');
        return;
    }

    window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer');
}

function showHeroStatus(message) {
    if (!appUi.heroStatus) {
        window.alert(message);
        return;
    }

    window.clearTimeout(heroStatusTimer);
    appUi.heroStatus.textContent = message;
    appUi.heroStatus.classList.remove('hidden');

    heroStatusTimer = window.setTimeout(function clearHeroStatusLater() {
        if (!appUi.heroStatus) {
            return;
        }

        appUi.heroStatus.textContent = '';
        appUi.heroStatus.classList.add('hidden');
    }, 2800);
}

function scrollToTarget(targetSelector) {
    const target = document.querySelector(targetSelector);

    if (!target) {
        return;
    }

    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function bindMovieCards() {
    if (!appUi.movieCards || !appUi.movieCards.length) {
        return;
    }

    appUi.movieCards.forEach(function bindMovieCard(card) {
        const movie = getMovieDetailsFromCard(card);

        card.classList.add('movie-poster');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open details for ${movie.title}`);
        card.alt = movie.title;

        card.addEventListener('click', function onCardClick() {
            openMovieModal(movie);
        });

        card.addEventListener('keydown', function onCardKeydown(event) {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            openMovieModal(movie);
        });
    });
}

function bindMovieModalEvents() {
    if (!appUi.movieModal) {
        return;
    }

    if (appUi.movieOverlay) {
        appUi.movieOverlay.addEventListener('click', closeMovieModal);
    }

    if (appUi.movieCloseButton) {
        appUi.movieCloseButton.addEventListener('click', closeMovieModal);
    }

    if (appUi.movieCloseAction) {
        appUi.movieCloseAction.addEventListener('click', closeMovieModal);
    }

    if (appUi.movieTrailerButton) {
        appUi.movieTrailerButton.addEventListener('click', function onMovieTrailerClick() {
            if (!currentMovieData || !currentMovieData.trailerUrl) {
                showMovieModalMessage('Trailer is not available yet.');
                return;
            }

            window.open(currentMovieData.trailerUrl, '_blank', 'noopener,noreferrer');
        });
    }

    document.addEventListener('keydown', function onMovieEscape(event) {
        if (event.key === 'Escape' && isMovieModalOpen()) {
            closeMovieModal();
        }
    });
}

function getMovieDetailsFromCard(card) {
    const src = card.getAttribute('src') || '';
    const fileName = decodeURIComponent(src.split('/').pop() || '');
    const defaults = {
        title: card.alt || 'Featured Movie',
        description: 'Movie details are coming soon.',
        genre: 'Drama',
        year: '2024',
        rating: 'N/A',
        trailerUrl: ''
    };

    return Object.assign({}, defaults, POSTER_LIBRARY[fileName], { posterSrc: src });
}

function openMovieModal(movie) {
    if (!appUi.movieModal || !movie) {
        return;
    }

    closeProfilePanel();
    currentMovieData = movie;
    clearMovieModalMessage();

    if (appUi.moviePoster) {
        appUi.moviePoster.src = movie.posterSrc;
        appUi.moviePoster.alt = `${movie.title} poster`;
    }

    if (appUi.movieTitle) {
        appUi.movieTitle.textContent = movie.title;
    }

    if (appUi.movieGenre) {
        appUi.movieGenre.textContent = movie.genre;
    }

    if (appUi.movieYear) {
        appUi.movieYear.textContent = movie.year;
    }

    if (appUi.movieRating) {
        appUi.movieRating.textContent = movie.rating;
    }

    if (appUi.movieDescription) {
        appUi.movieDescription.textContent = movie.description;
    }

    window.clearTimeout(movieHideTimer);
    appUi.movieModal.hidden = false;
    appUi.movieModal.classList.remove('hidden');
    appUi.movieModal.setAttribute('aria-hidden', 'false');

    window.requestAnimationFrame(function showMoviePanel() {
        appUi.movieModal.classList.add('is-open');
    });
}

function closeMovieModal() {
    if (!appUi.movieModal) {
        return;
    }

    appUi.movieModal.classList.remove('is-open');
    appUi.movieModal.setAttribute('aria-hidden', 'true');

    movieHideTimer = window.setTimeout(function hideMoviePanel() {
        if (!appUi.movieModal) {
            return;
        }

        appUi.movieModal.classList.add('hidden');
        appUi.movieModal.hidden = true;
        clearMovieModalMessage();
    }, 180);
}

function isMovieModalOpen() {
    return Boolean(appUi.movieModal && appUi.movieModal.classList.contains('is-open'));
}

function showMovieModalMessage(message) {
    if (!appUi.movieMessage) {
        window.alert(message);
        return;
    }

    window.clearTimeout(movieStatusTimer);
    appUi.movieMessage.textContent = message;
    appUi.movieMessage.classList.remove('hidden');

    movieStatusTimer = window.setTimeout(function clearMovieMessageLater() {
        clearMovieModalMessage();
    }, 2600);
}

function clearMovieModalMessage() {
    if (!appUi.movieMessage) {
        return;
    }

    appUi.movieMessage.textContent = '';
    appUi.movieMessage.classList.add('hidden');
}

function bindLegacyAuthButtons() {
    document.querySelectorAll('.login-btn, .signup-btn').forEach(function bindAuthButton(button) {
        button.addEventListener('click', function onAuthButtonClick(event) {
            event.preventDefault();
            handleLegacyAuthAction(button);
        });
    });
}

function handleLegacyAuthAction(button) {
    const action = button.dataset.authAction || (button.classList.contains('login-btn') ? 'login' : 'signup');

    if (action === 'logout') {
        handleLogout();
        return;
    }

    if (action === 'profile') {
        openProfilePanel();
        return;
    }

    if (action === 'login') {
        openAuthModal('login');
        return;
    }

    if (action === 'signup') {
        openAuthModal('signup');
    }
}

function bindProfilePanelEvents() {
    if (!appUi.profilePanel) {
        return;
    }

    if (appUi.profileOverlay) {
        appUi.profileOverlay.addEventListener('click', closeProfilePanel);
    }

    if (appUi.profileCloseButton) {
        appUi.profileCloseButton.addEventListener('click', closeProfilePanel);
    }

    if (appUi.profileMyListButton) {
        appUi.profileMyListButton.addEventListener('click', function onProfileListClick() {
            closeProfilePanel();
            scrollToTarget('#my-list');
        });
    }

    if (appUi.profileLogoutButton) {
        appUi.profileLogoutButton.addEventListener('click', function onProfileLogoutClick() {
            closeProfilePanel();
            handleLogout();
        });
    }

    document.addEventListener('keydown', function onProfileEscape(event) {
        if (event.key === 'Escape' && isProfilePanelOpen()) {
            closeProfilePanel();
        }
    });
}

function openProfilePanel() {
    const storedUser = getLegacyStoredUser();

    if (!storedUser || !appUi.profilePanel) {
        openAuthModal('login');
        return;
    }

    closeMovieModal();
    updateProfilePanel(storedUser);
    window.clearTimeout(profileHideTimer);
    appUi.profilePanel.hidden = false;
    appUi.profilePanel.classList.remove('hidden');
    appUi.profilePanel.setAttribute('aria-hidden', 'false');

    window.requestAnimationFrame(function showProfilePanel() {
        appUi.profilePanel.classList.add('is-open');
    });
}

function closeProfilePanel() {
    if (!appUi.profilePanel) {
        return;
    }

    appUi.profilePanel.classList.remove('is-open');
    appUi.profilePanel.setAttribute('aria-hidden', 'true');

    profileHideTimer = window.setTimeout(function hideProfilePanel() {
        if (!appUi.profilePanel) {
            return;
        }

        appUi.profilePanel.classList.add('hidden');
        appUi.profilePanel.hidden = true;
    }, 180);
}

function isProfilePanelOpen() {
    return Boolean(appUi.profilePanel && appUi.profilePanel.classList.contains('is-open'));
}

function updateProfilePanel(user) {
    if (!user) {
        return;
    }

    if (appUi.profileUsername) {
        appUi.profileUsername.textContent = user.username || 'FlixZone Member';
    }

    if (appUi.profileEmail) {
        appUi.profileEmail.textContent = user.email || 'Signed in to FlixZone';
    }
}

function bindAuthModalEvents() {
    if (!authUi.modal) {
        return;
    }

    if (authUi.closeButton) {
        authUi.closeButton.addEventListener('click', closeAuthModal);
    }

    if (authUi.overlay) {
        authUi.overlay.addEventListener('click', closeAuthModal);
    }

    authUi.tabs.forEach(function bindAuthTab(button) {
        button.addEventListener('click', function onTabClick() {
            setAuthMode(button.dataset.authMode);
        });
    });

    document.addEventListener('keydown', function onEscapeClose(event) {
        if (event.key === 'Escape' && isAuthModalOpen()) {
            closeAuthModal();
        }
    });

    if (authUi.loginForm) {
        authUi.loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (authUi.signupForm) {
        authUi.signupForm.addEventListener('submit', handleSignupSubmit);
    }
}

function openAuthModal(mode) {
    if (!authUi.modal) {
        console.error('Auth modal markup is missing on Homepage/home.html.');
        window.alert('Authentication is unavailable right now.');
        return;
    }

    closeMovieModal();
    closeProfilePanel();
    window.clearTimeout(authHideTimer);
    authUi.modal.hidden = false;
    authUi.modal.classList.remove('hidden');
    authUi.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-modal-open');
    setAuthMode(mode || 'login');
    clearAuthMessage();

    window.requestAnimationFrame(function activateModal() {
        authUi.modal.classList.add('is-open');
    });

    focusActiveAuthField();
}

function closeAuthModal() {
    if (!authUi.modal) {
        return;
    }

    authUi.modal.classList.remove('is-open');
    authUi.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('auth-modal-open');

    authHideTimer = window.setTimeout(function hideModal() {
        if (!authUi.modal) {
            return;
        }

        authUi.modal.classList.add('hidden');
        authUi.modal.hidden = true;
        clearAuthMessage();
    }, 180);
}

function isAuthModalOpen() {
    return Boolean(authUi.modal && authUi.modal.classList.contains('is-open'));
}

function setAuthMode(mode) {
    const isLoginMode = mode !== 'signup';

    if (authUi.loginForm) {
        authUi.loginForm.classList.toggle('hidden', !isLoginMode);
    }

    if (authUi.signupForm) {
        authUi.signupForm.classList.toggle('hidden', isLoginMode);
    }

    if (authUi.title) {
        authUi.title.textContent = isLoginMode ? 'Welcome back' : 'Create your account';
    }

    if (authUi.subtitle) {
        authUi.subtitle.textContent = isLoginMode
            ? 'Log in to continue building your personal FlixZone lineup.'
            : 'Create an account to unlock your personalized FlixZone experience.';
    }

    authUi.tabs.forEach(function updateAuthTab(button) {
        const isActive = button.dataset.authMode === (isLoginMode ? 'login' : 'signup');
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });

    clearAuthMessage();
}

function focusActiveAuthField() {
    window.setTimeout(function focusField() {
        if (authUi.loginForm && !authUi.loginForm.classList.contains('hidden') && authUi.loginEmail) {
            authUi.loginEmail.focus();
            return;
        }

        if (authUi.signupForm && !authUi.signupForm.classList.contains('hidden') && authUi.signupUsername) {
            authUi.signupUsername.focus();
        }
    }, 80);
}

function showAuthMessage(message, type) {
    if (!authUi.message) {
        window.alert(message);
        return;
    }

    authUi.message.textContent = message;
    authUi.message.className = `auth-modal__message is-${type}`;
}

function clearAuthMessage() {
    if (!authUi.message) {
        return;
    }

    authUi.message.textContent = '';
    authUi.message.className = 'auth-modal__message hidden';
}

function setAuthSubmitState(form, isLoading, loadingLabel, idleLabel) {
    if (!form) {
        return;
    }

    const submitButton = form.querySelector('.auth-modal__submit');

    if (!submitButton) {
        return;
    }

    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? loadingLabel : idleLabel;
}

function applyLegacyAuthState() {
    const storedUser = getLegacyStoredUser();

    document.querySelectorAll('.login-btn').forEach(function updateLoginButton(button) {
        if (storedUser) {
            button.textContent = storedUser.username || 'Profile';
            button.dataset.authAction = 'profile';
        } else {
            button.textContent = 'Login';
            button.dataset.authAction = 'login';
        }
    });

    document.querySelectorAll('.signup-btn').forEach(function updateSignupButton(button) {
        if (storedUser) {
            button.textContent = 'Logout';
            button.dataset.authAction = 'logout';
        } else {
            button.textContent = 'Sign Up';
            button.dataset.authAction = 'signup';
        }
    });

    updateProfilePanel(storedUser);
}

function getLegacyStoredUser() {
    const movieApi = getLegacyMovieApi();

    if (movieApi && typeof movieApi.getStoredUser === 'function') {
        return movieApi.getStoredUser();
    }

    const rawUser = localStorage.getItem('movie_streaming_user');

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        localStorage.removeItem('movie_streaming_user');
        return null;
    }
}

function clearLegacyAuthSession() {
    const movieApi = getLegacyMovieApi();

    if (movieApi && typeof movieApi.clearAuthSession === 'function') {
        movieApi.clearAuthSession();
        return;
    }

    localStorage.removeItem('movie_streaming_token');
    localStorage.removeItem('movie_streaming_user');
}

function handleLogout() {
    clearLegacyAuthSession();
    applyLegacyAuthState();
    closeAuthModal();
    closeProfilePanel();
    closeMovieModal();
    window.alert('You have been logged out.');
}

function getLegacyMovieApi() {
    if (!window.movieApi) {
        console.error('window.movieApi is missing on Homepage. Make sure ../frontend-api.js loads before Homepage/script.js.');
        return null;
    }

    if (
        typeof window.movieApi.loginUser !== 'function' ||
        typeof window.movieApi.registerUser !== 'function' ||
        typeof window.movieApi.saveAuthSession !== 'function'
    ) {
        console.error('window.movieApi is loaded on Homepage, but required auth methods are missing.');
        return null;
    }

    return window.movieApi;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const movieApi = getLegacyMovieApi();

    if (!movieApi) {
        showAuthMessage('Authentication is unavailable right now.', 'error');
        return;
    }

    if (!authUi.loginForm) {
        return;
    }

    const formData = new FormData(authUi.loginForm);
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '').trim();

    if (!email || !password) {
        showAuthMessage('Email and password are required.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address.', 'error');
        return;
    }

    showAuthMessage('Logging you in...', 'loading');
    setAuthSubmitState(authUi.loginForm, true, 'Logging in...', 'Login');

    try {
        const result = await movieApi.loginUser({ email: email, password: password });
        const authData = result && result.data ? result.data : null;

        if (!authData || !authData.token || !authData.user) {
            throw new Error('Login succeeded, but the server response was incomplete.');
        }

        movieApi.saveAuthSession(authData.token, authData.user);
        applyLegacyAuthState();
        showAuthMessage(result.message || 'Login successful.', 'success');
        authUi.loginForm.reset();

        window.setTimeout(function finishLogin() {
            closeAuthModal();
        }, 500);
    } catch (error) {
        console.error(error);
        showAuthMessage(error.message || 'Login failed.', 'error');
    } finally {
        setAuthSubmitState(authUi.loginForm, false, 'Logging in...', 'Login');
    }
}

async function handleSignupSubmit(event) {
    event.preventDefault();

    const movieApi = getLegacyMovieApi();

    if (!movieApi) {
        showAuthMessage('Authentication is unavailable right now.', 'error');
        return;
    }

    if (!authUi.signupForm) {
        return;
    }

    const formData = new FormData(authUi.signupForm);
    const username = String(formData.get('username') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '').trim();

    if (!username || !email || !password) {
        showAuthMessage('Username, email, and password are required.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address.', 'error');
        return;
    }

    if (!password) {
        showAuthMessage('Password cannot be empty.', 'error');
        return;
    }

    showAuthMessage('Creating your account...', 'loading');
    setAuthSubmitState(authUi.signupForm, true, 'Creating account...', 'Create Account');

    try {
        const result = await movieApi.registerUser({
            username: username,
            email: email,
            password: password
        });

        authUi.signupForm.reset();
        setAuthMode('login');

        if (authUi.loginEmail) {
            authUi.loginEmail.value = email;
        }

        if (authUi.loginPassword) {
            authUi.loginPassword.value = '';
        }

        showAuthMessage(result.message || 'Signup successful. Please log in.', 'success');
    } catch (error) {
        console.error(error);
        showAuthMessage(error.message || 'Signup failed.', 'error');
    } finally {
        setAuthSubmitState(authUi.signupForm, false, 'Creating account...', 'Create Account');
    }
}

function showSidebar() {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        sidebar.style.display = 'flex';
    }
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
        sidebar.style.display = 'none';
    }
}
