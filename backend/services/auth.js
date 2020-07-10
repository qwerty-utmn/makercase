const jwt = require('jsonwebtoken');

const JWT_SECRET = 'SECRET';

const generateToken = async (user) => {
  const token = await jwt.sign({
    id: user.id,
    email: user.email
  },
  JWT_SECRET);
  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    await jwt.verify(token, JWT_SECRET, (err, res) => {
      if (res.id) {
        req.user = res;
        next();
      } else {
        throw new Error('bad token');
      }
    });
  } catch (err) {
    console.log('err', err);
    return {
      error: true
    };
  }
};

module.exports = {
  verifyToken,
  generateToken
};
