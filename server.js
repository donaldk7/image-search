var express = require('express')
var app = express()
var path = require('path')
var url = require('url')
var Bing = require('node-bing-api')({'accKey': 'fa77ac20625f42c78547f9325007c9fb'})


app.use(express.static(path.join(__dirname, 'public')))

var port = process.env.PORT || 8080

var router = express.Router()

var searchTerm = ''
var offset = 5
var output = 
[{"when":"2016-12-13T00:38:14.832Z","term":"it's a wonderful life"},
{"when":"2016-12-13T00:37:43.238Z","term":"playstation4"},
{"when":"2016-12-13T00:37:10.938Z","term":"black friday"},
{"when":"2016-12-13T00:35:17.882Z","term":"tesla"},
{"when":"2016-12-13T00:35:07.530Z","term":"tesla"},
{"when":"2016-12-13T00:34:39.560Z","term":"christmas"},
{"when":"2016-12-13T00:34:25.926Z","term":"christmas"},
{"when":"2016-12-12T21:14:24.113Z","term":"snow traffic"},
{"when":"2016-12-12T21:09:03.849Z","term":"snow traffic"}]


router.use(function(req, res, next) {
    // do logging
    console.log('something is happening')
    next()  // make sure we go to the next routes and don't stop here
})


router.route('/image/:searchTerm')
    .get(function(req, res) {  
        searchTerm = req.params.searchTerm  //comes before the ? mark, searchTerm is a string
        var reqUrl = url.parse(req.url, true)
        var query = reqUrl.query    // json {'offset':10} for example
        offset = query['offset']
        
        if (offset < 0) {
            offset = 1
        } else if (offset > 50) {
            offset = 50
        }
        
        function dispImages() {
            res.json(output)
        }
        
        getImages(searchTerm, offset, dispImages)   //using async callback method
        

    })

router.route('/latest')
    .get(function(req, res){
        var options = {
            "limit": 10,
            "sort": {'when': -1}
        }
        

    })

app.use('/api', router)

app.listen(port)

console.log('App listening in port ' + port)

function getImages(searchT, offS, callback) {
    Bing.images(searchT, {
        top: offS
    }, function(err, res, body) {
        if (err) {throw err}
        
        for (var i = 0; i < offS; i++) {
            output[i] = 
                {'name': body.value[i].name,
                'url': body.value[i].thumbnailUrl
                }
        }
    callback()    
    })
}