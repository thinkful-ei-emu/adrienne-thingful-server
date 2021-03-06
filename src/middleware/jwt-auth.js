const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
  console.log('require auth');
  const authToken = req.get('Authorization') || '';
  let bearerToken;

  console.log('auth token', authToken);

  if(!authToken.toLowerCase().startsWith('bearer ')) {
    console.log('throw 401');
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
console.log('line 19');
    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if(!user) {
          return res.status(401).json({ error: 'Unauthorized request'});
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  } catch(error) {
    res.status(401).json({ error: 'Unauthorized request' });
  } 
}

module.exports = requireAuth;