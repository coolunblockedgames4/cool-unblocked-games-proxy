const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use('/proxy', createProxyMiddleware({
  target: '', // target will be dynamic based on query param
  changeOrigin: true,
  router: (req) => {
    // Get target URL from query string: /proxy?url=https://example.com
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('url') || 'https://example.com';
  },
  pathRewrite: {
    '^/proxy': '', // remove /proxy prefix when forwarding
  },
  logLevel: 'debug',
}));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Cool Unblocked Games Proxy</title></head>
      <body>
        <h1>Cool Unblocked Games Proxy</h1>
        <form method="GET" action="/proxy">
          <input name="url" placeholder="https://example.com" style="width:300px" />
          <button type="submit">Go</button>
        </form>
      </body>
    </html>
  `);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(\`Listening on port \${listener.address().port}\`);
});