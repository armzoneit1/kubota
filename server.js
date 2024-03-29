const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")
const port = 3002
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
}
console.log(httpsOptions);
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log("ready - started server on url: https://localhost:" + port)
  })
})
