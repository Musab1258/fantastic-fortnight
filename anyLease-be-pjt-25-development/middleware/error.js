function error(err, req, res, next) {
  res.status(500).send(err.message);
  next();
}
module.exports = error;
