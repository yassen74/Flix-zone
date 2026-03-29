document.addEventListener('DOMContentLoaded', function initializeVideoPage() {
    bindVideoPageAuthButtons('../../index.html');
});

function bindVideoPageAuthButtons(basePath) {
    document.querySelectorAll('.login-btn, .signup-btn').forEach(function bindAuthButton(button) {
        button.addEventListener('click', function onAuthButtonClick(event) {
            event.preventDefault();
            handleVideoPageAuthAction(button, basePath);
        });
    });

    applyVideoPageAuthState();
}

function handleVideoPageAuthAction(button, basePath) {
    const action = button.dataset.authAction || (button.classList.contains('login-btn') ? 'login' : 'signup');

    if (action === 'logout') {
        clearVideoPageAuthSession();
        applyVideoPageAuthState();
        window.alert('You have been logged out.');
        return;
    }

    if (action === 'profile') {
        window.location.href = `${basePath}#watchlist`;
        return;
    }

    if (action === 'login') {
        void openVideoPageLoginPrompt();
        return;
    }

    if (action === 'signup') {
        void openVideoPageSignupPrompt();
    }
}

function applyVideoPageAuthState() {
    const storedUser = getVideoPageStoredUser();

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
            button.textContent = 'Signup';
            button.dataset.authAction = 'signup';
        }
    });
}

function getVideoPageStoredUser() {
    const movieApi = getVideoPageMovieApi();

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

function clearVideoPageAuthSession() {
    const movieApi = getVideoPageMovieApi();

    if (movieApi && typeof movieApi.clearAuthSession === 'function') {
        movieApi.clearAuthSession();
        return;
    }

    localStorage.removeItem('movie_streaming_token');
    localStorage.removeItem('movie_streaming_user');
}

function getVideoPageMovieApi() {
    if (!window.movieApi) {
        console.error('window.movieApi is missing on the trailer page. Make sure ../../frontend-api.js loads before Homepage/Vid/script.js.');
        return null;
    }

    if (
        typeof window.movieApi.loginUser !== 'function' ||
        typeof window.movieApi.registerUser !== 'function' ||
        typeof window.movieApi.saveAuthSession !== 'function'
    ) {
        console.error('window.movieApi is loaded on the trailer page, but required auth methods are missing.');
        return null;
    }

    return window.movieApi;
}

async function openVideoPageLoginPrompt() {
    const movieApi = getVideoPageMovieApi();

    if (!movieApi) {
        window.alert('Authentication is unavailable right now.');
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
        applyVideoPageAuthState();
        window.alert(result.message || 'Login successful.');
    } catch (error) {
        console.error(error);
        window.alert(error.message || 'Login failed.');
    }
}

async function openVideoPageSignupPrompt() {
    const movieApi = getVideoPageMovieApi();

    if (!movieApi) {
        window.alert('Authentication is unavailable right now.');
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

        window.alert(result.message || 'Signup successful. You can log in now.');
    } catch (error) {
        console.error(error);
        window.alert(error.message || 'Signup failed.');
    }
}
