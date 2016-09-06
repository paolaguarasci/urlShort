var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var result = ''

app.get('/', function (req, res) {
  res.send(result)
})

app.use(express.static('./'))
app.listen(port)
