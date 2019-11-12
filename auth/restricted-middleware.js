module.exports = (req, res, next) => {
  // use the session functionality
  if(req.session && req.session.username){
    next();
  } else{
    res.status(401).json({ you: 'cannot pass'})
  }
};
