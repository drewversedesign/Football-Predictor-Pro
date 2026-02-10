const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

const client = jwksRsa.jwksClient({
  jwksUri: process.env.JWKS_URL
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, getKey, {
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = checkAuth;
