function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: 'API is running'
  });
}

module.exports = {
  healthCheck
};
