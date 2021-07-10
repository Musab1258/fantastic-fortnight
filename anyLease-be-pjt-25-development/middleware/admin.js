function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res
      .status(404)
      .send(
        "access denied or does not have the permission to access this route"
      );
  next();
}

module.exports = admin;
