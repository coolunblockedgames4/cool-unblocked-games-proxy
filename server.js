const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "", // target is dynamic
    changeOrigin: true,
    router: (req) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        let targetUrl = url.searchParams.get("url");
        if (!targetUrl) {
          return "https://example.com";
        }
        // Add protocol if missing
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
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
  res.send(`
    <html>
      <head><title>Cool Unblocked Games Proxy</title></head>
      <body>
        <h1>Cool Unblocked Games Proxy</h1>
        <form method="GET" action="/proxy" onsubmit="addProtocol()">
          <input
            type="text"
            id="urlInput"
            name="url"
            placeholder="Enter full URL like https://example.com"
            style="width:300px"
            required
          />
          <button type="submit">Go</button>
        </form>

        <script>
          function addProtocol() {
            const input = document.getElementById('urlInput');
            if (!input.value.startsWith('http://') && !input.value.startsWith('https://')) {
              input.value = 'https://' + input.value;
            }
          }
        </script>
      </body>
    </html>
  `);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port);
});
