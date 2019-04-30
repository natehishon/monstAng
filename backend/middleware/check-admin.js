

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken  = jwt.verify(token, process.env.JWT_KEY);
    const role = decodedToken.role;

    if (role === 'ADMIN') {
      next();
      return;
    }

    res.status(401).json({
      message: 'failed'
    })

  } catch (error) {
    res.status(401).json({
      message: 'failed'
    })
  }
}
