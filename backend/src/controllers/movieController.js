const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../models/movieModel');

function buildMoviePayload(body, currentMovie) {
  const payload = {
    title: body.title !== undefined ? body.title : currentMovie && currentMovie.title,
    description: body.description !== undefined ? body.description : currentMovie && currentMovie.description,
    genre: body.genre !== undefined ? body.genre : currentMovie && currentMovie.genre,
    release_year:
      body.release_year !== undefined ? Number(body.release_year) : currentMovie && currentMovie.release_year,
    rating:
      body.rating !== undefined && body.rating !== ''
        ? Number(body.rating)
        : currentMovie && currentMovie.rating !== null
          ? Number(currentMovie.rating)
          : null,
    poster_url: body.poster_url !== undefined ? body.poster_url : currentMovie && currentMovie.poster_url,
    trailer_url: body.trailer_url !== undefined ? body.trailer_url : currentMovie && currentMovie.trailer_url
  };

  return payload;
}

function validateMoviePayload(movie) {
  if (!movie.title || !movie.description || !movie.genre || !movie.release_year) {
    return 'Title, description, genre, and release_year are required';
  }

  if (Number.isNaN(movie.release_year)) {
    return 'release_year must be a valid number';
  }

  if (movie.rating !== null && Number.isNaN(movie.rating)) {
    return 'rating must be a valid number';
  }

  return null;
}

async function getMovies(req, res, next) {
  try {
    const movies = await getAllMovies();

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    return next(error);
  }
}

async function getMovie(req, res, next) {
  try {
    const movie = await getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    return next(error);
  }
}

async function createMovieHandler(req, res, next) {
  try {
    const moviePayload = buildMoviePayload(req.body);
    const validationError = validateMoviePayload(moviePayload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const movie = await createMovie(moviePayload);

    return res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    return next(error);
  }
}

async function updateMovieHandler(req, res, next) {
  try {
    const existingMovie = await getMovieById(req.params.id);

    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const moviePayload = buildMoviePayload(req.body, existingMovie);
    const validationError = validateMoviePayload(moviePayload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const updatedMovie = await updateMovie(req.params.id, moviePayload);

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteMovieHandler(req, res, next) {
  try {
    const movie = await getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await deleteMovie(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMovies,
  getMovie,
  createMovie: createMovieHandler,
  updateMovie: updateMovieHandler,
  deleteMovie: deleteMovieHandler
};
