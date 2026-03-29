(function initializeMovieApi() {
    const API_BASE_URL = (
        window.MOVIE_API_BASE_URL ||
        (window.location.port === '5000' ? window.location.origin : 'http://localhost:5000')
    ).replace(/\/$/, '');

    const TOKEN_KEY = 'movie_streaming_token';
    const USER_KEY = 'movie_streaming_user';

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getStoredUser() {
        const rawUser = localStorage.getItem(USER_KEY);

        if (!rawUser) {
            return null;
        }

        try {
            return JSON.parse(rawUser);
        } catch (error) {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    }

    function saveAuthSession(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function clearAuthSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    async function apiRequest(endpoint, options) {
        const requestOptions = Object.assign({ method: 'GET' }, options || {});
        const headers = Object.assign({ Accept: 'application/json' }, requestOptions.headers || {});
        const token = requestOptions.token || getToken();
        const hasJsonBody =
            requestOptions.body &&
            typeof requestOptions.body === 'object' &&
            !(requestOptions.body instanceof FormData);

        if (hasJsonBody && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (token && !headers.Authorization) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (hasJsonBody) {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        requestOptions.headers = headers;

        let response;

        try {
            response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
        } catch (error) {
            const networkError = new Error('Unable to reach the backend API. Make sure it is running on port 5000.');
            networkError.cause = error;
            throw networkError;
        }

        const contentType = response.headers.get('content-type') || '';
        let data = null;

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = text ? { message: text } : null;
        }

        if (!response.ok) {
            const error = new Error((data && data.message) || `Request failed with status ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    window.movieApi = {
        API_BASE_URL,
        getToken,
        getStoredUser,
        saveAuthSession,
        clearAuthSession,
        checkHealth: function checkHealth() {
            return apiRequest('/api/health');
        },
        getMovies: function getMovies() {
            return apiRequest('/api/movies');
        },
        registerUser: function registerUser(payload) {
            return apiRequest('/api/auth/register', {
                method: 'POST',
                body: payload
            });
        },
        loginUser: function loginUser(payload) {
            return apiRequest('/api/auth/login', {
                method: 'POST',
                body: payload
            });
        },
        getWatchlist: function getWatchlist() {
            return apiRequest('/api/watchlist');
        },
        addToWatchlist: function addToWatchlist(movieId) {
            return apiRequest('/api/watchlist', {
                method: 'POST',
                body: { movie_id: movieId }
            });
        },
        removeFromWatchlist: function removeFromWatchlist(movieId) {
            return apiRequest(`/api/watchlist/${movieId}`, {
                method: 'DELETE'
            });
        }
    };
})();
