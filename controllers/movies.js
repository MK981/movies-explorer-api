const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((films) => res.send({ data: films }))
    .catch((err) => next(err));
};

module.exports.addMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer,
    thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при добавлении фильма');
      }
      throw new Error();
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((data) => {
          res.send({ data });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные карточки');
          }
          throw new Error();
        })
        .catch(next);
    })
    .catch((err) => next(err));
};
