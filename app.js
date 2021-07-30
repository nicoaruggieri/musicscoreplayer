const express = require('express')
const ejsMate = require('ejs-mate')
const favicon = require('serve-favicon')
const compression = require('compression')
const path = require('path')
const fs = require('fs')
const app = express()
let port = process.env.PORT || 5000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/static'));
app.use(favicon(path.join(__dirname, 'static', 'img', 'favicon.ico')))
app.use(compression());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));
app.set('etag', false)


app.get('/', (req, res) => {
    let songs = []
    songs = fs.readdirSync('./stems').filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
    let songTitles = []
    songs.forEach(song => {
        try {
            let songInfoData = fs.readFileSync(`./stems/${song}` + '/songInfo.json')
            songInfo = JSON.parse(songInfoData)
            let splitInfo = songInfo.songTitle.split(" - ")
            songTitles.push([song, splitInfo])
        } catch {
            songTitles.push([song, [song, '']])
        }
    })
    res.render('pages/index', {songInfo : songTitles})
})

app.get('/:song', (req, res) => {
    const { song: songTitle } = req.params
    const songDirectory = `/stems/${songTitle}`
    let songInfo
    let songBPM
    let songLength
    let stems
    let images
    try {
        songInfoData = fs.readFileSync('.' + `${songDirectory}` + '/songInfo.json')
        let songInfoJSON = JSON.parse(songInfoData)
        songInfo = songInfoJSON.songTitle
        songBPM = songInfoJSON.songBPM
        songLength = songInfoJSON.songLength
    } catch (err) {
        console.log(`Can't find Song Info`);
    }
    try {
        let directoryContents = fs.readdirSync('.' + `${songDirectory}`);
        images = directoryContents.filter(file => file.endsWith('.svg'))
        // stems = directoryContents.filter(file => file.endsWith('.mp3'))
        stems = []
        images.forEach(image => {
            let preStem = image.replace('svg', 'mp3')
            stems.push(preStem)
        })        
    } catch (err) {
        console.log(err);
        res.render('pages/404')
        return
    }
    res.render('pages/song', {songDirectory : songDirectory, songTitle: songTitle, songInfo : songInfo, songBPM : songBPM, songLength : songLength, stems : stems, images : images})
})

app.get('/stems/:songTitle/:file', (req,res) => {
    const { songTitle: songTitle , file: file} = req.params
    var filePath = path.join(__dirname, 'stems', songTitle, file);
    res.sendFile(filePath)
})

app.get('/stems/:songTitle/:rate/:file', (req,res) => {
    const { songTitle: songTitle , file: file, rate: rate} = req.params
    var filePath = path.join(__dirname, 'stems', songTitle, rate, file);
    res.sendFile(filePath)
})

app.get('/static/img/:file', (req,res) => {
    const {file: file} = req.params
    res.sendFile(__dirname + `/static/img/${file}`)
})

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/favicon.ico');
});

app.get('*', (req, res) => {
    console.log('404');
    res.render('pages/404')
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})