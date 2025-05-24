const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/proxy",
  createProxyMiddleware({
    changeOrigin: true,
    selfHandleResponse: false,
    onProxyRes: (proxyRes, req, res) => {
      // Remove headers that block iframe embedding
      delete proxyRes.headers["x-frame-options"];
      delete proxyRes.headers["content-security-policy"];
      delete proxyRes.headers["content-security-policy-report-only"];
    },
    router: (req) => {
      try {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        let targetUrl = urlObj.searchParams.get("url");
        if (!targetUrl) return "https://example.com";
        if (
          !targetUrl.startsWith("http://") &&
          !targetUrl.startsWith("https://")
        ) {
          targetUrl = "https://" + targetUrl;
        }
        new URL(targetUrl); // validate URL
        return targetUrl;
      } catch {
        return "https://example.com";
      }
    },
    pathRewrite: {
      "^/proxy": "",
    },
    logLevel: "debug",
  })
);

app.get("/", (req, res) => {
  const targetUrl = req.query.url || "";
  res.send(`
    <html>
      <head><title>Cool Unblocked Games Proxy</title></head>
      <body>
        <h1>Cool Unblocked Games Proxy</h1>
        <form method="GET" action="/">
          <input
            type="text"
            id="urlInput"
            name="url"
            placeholder="Enter full URL like https://example.com"
            style="width:300px"
            value="${targetUrl}"
            required
          />
          <button type="submit">Go</button>
        </form>
        ${
          targetUrl
            ? `<iframe src="/proxy?url=${encodeURIComponent(
                targetUrl
              )}" style="width:100%; height:90vh; border:none;"></iframe>`
            : ""
        }
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
