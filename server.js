const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "",
    changeOrigin: true,
    router: (req) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        let targetUrl = url.searchParams.get("url");
        if (!targetUrl) {
          return "https://example.com";
        }
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
              )}" style="width:100%; height:80vh; border:none;"></iframe>`
            : ""
        }

        <script>
          const form = document.querySelector("form");
          form.onsubmit = () => {
            const input = document.getElementById("urlInput");
            if (
              input.value &&
              !input.value.startsWith("http://") &&
              !input.value.startsWith("https://")
            ) {
              input.value = "https://" + input.value;
            }
          };
        </script>
      </body>
    </html>
  `);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port);
});
