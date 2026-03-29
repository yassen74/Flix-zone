const API_BASE_URL = (
    window.MOVIE_API_BASE_URL ||
    (window.location.port === '5000' ? window.location.origin : 'http://localhost:5000')
).replace(/\/$/, '');

document.addEventListener('DOMContentLoaded', function onDomReady() {
    cleanupAuthQueryParam();
    bindFaqToggles();
    bindAuthActions();
    updateAuthUi();
    loadTrendingMovies();
});

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const image = document.createElement('img');
    image.src = getPosterUrl(movie && movie.poster_url);
    image.alt = (movie && movie.title) || 'Movie Poster';
    image.addEventListener('error', function onImageError() {
        image.src = 'Front-page/pos1.jpg';
    });

    const title = document.createElement('span');
    title.className = 'movie-title';
    title.textContent = (movie && movie.title) || 'Untitled Movie';

    card.appendChild(image);
    card.appendChild(title);

    return card;
}

async function loadTrendingMovies() {
    const movieCarousel = document.querySelector('.trending-now .movie-carousel');

    if (!movieCarousel) {
        return;
    }

    const fallbackCards = movieCarousel.innerHTML;

    try {
        const response = await fetch(`${API_BASE_URL}/api/movies`);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        const movies = Array.isArray(result && result.data) ? result.data : [];

        if (!movies.length) {
            return;
        }

        movieCarousel.innerHTML = '';
        movies.forEach(function appendMovie(movie) {
            movieCarousel.appendChild(createMovieCard(movie));
        });
    } catch (error) {
        console.error('Unable to load movies from the backend API.', error);
        movieCarousel.innerHTML = fallbackCards;
    }
}

function bindFaqToggles() {
    document.querySelectorAll('.faq-question').forEach(function bindFaq(button) {
        button.addEventListener('click', function onFaqClick() {
            const answer = button.nextElementSibling;

            if (!answer) {
                return;
            }

            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
}

function bindAuthActions() {
    getAuthTriggers('login').forEach(function bindLoginTrigger(trigger) {
        trigger.addEventListener('click', handleLoginClick);
    });

    getAuthTriggers('signup').forEach(function bindSignupTrigger(trigger) {
        trigger.addEventListener('click', handleSignupClick);
    });

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogoutClick);
    }
}

function getAuthTriggers(action) {
    return Array.from(
        document.querySelectorAll(
            `[data-auth-action="${action}"], #${action === 'login' ? 'loginBtn' : 'signupBtn'}, a[href*="auth=${action}"]`
        )
    );
}

function getMovieApi() {
    if (!window.movieApi) {
        console.error('window.movieApi is missing. Make sure frontend-api.js loads before script.js.');
        return null;
    }

    if (
        typeof window.movieApi.loginUser !== 'function' ||
        typeof window.movieApi.registerUser !== 'function' ||
        typeof window.movieApi.saveAuthSession !== 'function'
    ) {
        console.error('window.movieApi is loaded, but required auth methods are missing.');
        return null;
    }

    return window.movieApi;
}

async function handleLoginClick(event) {
    event.preventDefault();

    const movieApi = getMovieApi();

    if (!movieApi) {
        window.alert('Authentication is unavailable. Make sure frontend-api.js loads before script.js.');
        return;
    }

    const emailPrompt = window.prompt('Enter your email:');

    if (emailPrompt === null) {
        return;
    }

    const passwordPrompt = window.prompt('Enter your password:');

    if (passwordPrompt === null) {
        return;
    }

    const email = emailPrompt.trim().toLowerCase();
    const password = passwordPrompt.trim();

    if (!email || !password) {
        window.alert('Email and password are required.');
        return;
    }

    try {
        const result = await movieApi.loginUser({ email: email, password: password });
        const authData = result && result.data ? result.data : null;

        if (!authData || !authData.token || !authData.user) {
            throw new Error('Login succeeded, but the server response was incomplete.');
        }

        movieApi.saveAuthSession(authData.token, authData.user);
        updateAuthUi();
        window.alert(result.message || 'Login successful.');
    } catch (error) {
        console.error(error);
        window.alert(error.message || 'Login failed.');
    }
}

async function handleSignupClick(event) {
    event.preventDefault();

    const movieApi = getMovieApi();

    if (!movieApi) {
        window.alert('Authentication is unavailable. Make sure frontend-api.js loads before script.js.');
        return;
    }

    const usernamePrompt = window.prompt('Enter a username:');

    if (usernamePrompt === null) {
        return;
    }

    const emailPrompt = window.prompt('Enter your email:');

    if (emailPrompt === null) {
        return;
    }

    const passwordPrompt = window.prompt('Create a password (minimum 6 characters):');

    if (passwordPrompt === null) {
        return;
    }

    const username = usernamePrompt.trim();
    const email = emailPrompt.trim().toLowerCase();
    const password = passwordPrompt.trim();

    if (!username || !email || !password) {
        window.alert('Username, email, and password are required.');
        return;
    }

    try {
        const result = await movieApi.registerUser({
            username: username,
            email: email,
            password: password
        });

        window.alert(result.message || 'Sign up successful. You can log in now.');
    } catch (error) {
        console.error(error);
        window.alert(error.message || 'Sign up failed.');
    }
}

function handleLogoutClick() {
    const movieApi = getMovieApi();

    if (!movieApi || typeof movieApi.clearAuthSession !== 'function') {
        return;
    }

    movieApi.clearAuthSession();
    updateAuthUi();
    window.alert('Logged out successfully.');
}

function updateAuthUi() {
    const movieApi = getMovieApi();
    const storedUser =
        movieApi && typeof movieApi.getStoredUser === 'function'
            ? movieApi.getStoredUser()
            : null;

    const userLabel = document.getElementById('auth-user-label');
    const logoutButton = document.getElementById('logout-button');
    const isLoggedIn = Boolean(storedUser);

    getAuthTriggers('login').forEach(function updateLoginTrigger(trigger) {
        trigger.classList.toggle('hidden', isLoggedIn);
    });

    getAuthTriggers('signup').forEach(function updateSignupTrigger(trigger) {
        trigger.classList.toggle('hidden', isLoggedIn);
    });

    if (userLabel) {
        userLabel.textContent = isLoggedIn
            ? (storedUser.username || storedUser.email || 'Profile')
            : '';
        userLabel.classList.toggle('hidden', !isLoggedIn);
    }

    if (logoutButton) {
        logoutButton.classList.toggle('hidden', !isLoggedIn);
    }
}

function cleanupAuthQueryParam() {
    const url = new URL(window.location.href);
    const authValue = url.searchParams.get('auth');

    if (authValue !== 'login' && authValue !== 'signup') {
        return;
    }

    url.searchParams.delete('auth');
    const nextSearch = url.searchParams.toString();
    const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
}

function getPosterUrl(posterUrl) {
    const safePosterUrl = String(posterUrl || '').trim();

    if (!safePosterUrl || /^https?:\/\/example\.com\//i.test(safePosterUrl)) {
        return 'Front-page/pos1.jpg';
    }

    if (safePosterUrl.startsWith('/')) {
        return safePosterUrl.slice(1);
    }

    return safePosterUrl;
}
