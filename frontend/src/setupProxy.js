const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Prefix all backend requests with '/api'
    createProxyMiddleware({
      target: 'http://localhost:8080', // Backend URL
      changeOrigin: true, // Required for virtual hosted sites
      pathRewrite: { '^/api': '' }, // Strip the '/api' prefix
    })
  );
};
