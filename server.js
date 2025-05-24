const express = require("express");
const Unblocker = require("unblocker");

const app = express();
const unblocker = new Unblocker({
  prefix: '/proxy/',
});

app.use(unblocker);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Cool Unblocked Games Proxy</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
          input { width: 300px; padding: 10px; }
          button { padding: 10px 20px; }
        </style>
      </head>
      <body>
        <h1>Cool Unblocked Games Proxy</h1>
        <form method="GET" action="/proxy/">
          <input name="url" placeholder="https://example.com" />
          <button type="submit">Go</button>
        </form>
      </body>
    </html>
  `);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});