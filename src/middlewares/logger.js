const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url, body } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} - ${
        res.statusCode
      } (${duration}ms)`
    );
    if (Object.keys(body).length) {
      console.log("Request Body:", JSON.stringify(body, null, 2));
    }
  });

  next();
};

module.exports = loggerMiddleware;
