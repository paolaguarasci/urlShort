var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var mongo = require('mongodb').MongoClient
var base62 = require('base62')
var url = 'mongodb://urlShort:urlShort@ds021026.mlab.com:21026/ahivelasquez'
var urlLong

function getRandom () {
  return Math.floor((Math.random() * 100000000) + 1)
}

// TODO controllare perchè non funziona!
// EDIT è importante specificare la path da risolvere
// (in questo caso '/')
// app.use('/howto', express.static('./'))

app.get('/new/*', function (req, res) {
  var urlShort = 'http://' + req.headers.host + '/'
  var random = getRandom()
  urlLong = req.url.slice(5)
  urlShort += base62.encode(random)

  mongo.connect(url, function (err, db) {
    if (err) {
      throw err
    }

    if (urlLong.slice(0, 4) !== 'http') {
      urlLong = 'http://' + urlLong
    }

    db.collection('url').insert({
      original: urlLong,
      short: urlShort,
      hash: base62.encode(random)
    })

    db.collection('url').find({
      hash: base62.encode(random)},
      {_id: 0,
        hash: 0
      })
    // db.collection('url').find({ hash: base62.encode(random)})
      .toArray(function (err, data) {
        if (err) {
          throw err
        }
        console.log(data)
        res.send(JSON.stringify(data[0]))
      })
    db.close()
  })
})
app.get('/:hash', function (req, res) {
  var hash = req.params.hash
  if (hash) {
    mongo.connect(url, function (err, db) {
      if (err) {
        throw err
      }

      db.collection('url').findOne(
        {
          hash: hash
        },
      function (err, data) {
        if (err) {
          throw err
        }
        console.log(data.original)
        res.redirect(data.original)
      })

      db.close()
    })
  }
})
app.listen(port)
