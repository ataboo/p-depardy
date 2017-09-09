module.exports = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash('loginMessage', 'Please log in.');
  res.redirect('/');
};
