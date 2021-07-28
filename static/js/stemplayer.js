loopBtnA.addEventListener('click', (e) => {
    let currentTime = audioFiles[0].currentTime
    loopPositionA = currentTime
    localStorage.setItem('loopPositionA', loopPositionA)
    if (localStorage.getItem('loopPositionB') < loopPositionA) {
        let loopPositionB = localStorage.getItem('loopPositionB')
        for (i = audioFiles.length; i--;) {
            wavesurfer[i].clearRegions({id: 0})
            let region = {id: 0, start: loopPositionA, end: loopPositionA, loop: true, drag: false, resize: false, color: "rgba(255, 221, 125, 0.6)"}
            wavesurfer[i].addRegion(region)
            localStorage.setItem('loopStatus', 1)
        }
    } else if (localStorage.getItem('loopPositionB') > loopPositionA) {
        let loopPositionB = localStorage.getItem('loopPositionB')
        for (i = wavesurfer.length; i--;) {
            wavesurfer[i].clearRegions({id: 0})
            let region = {id: 0, start: loopPositionA, end: loopPositionB, loop: true, drag: false, resize: false, color: "rgba(255, 221, 125, 0.6)"}
            wavesurfer[i].addRegion(region)
            localStorage.setItem('loopStatus', 1)
        }
    }
})

loopBtnB.addEventListener('click', (e) => {
    let currentTime = wavesurfer[0].getCurrentTime()
    loopPositionB = currentTime
    localStorage.setItem('loopPositionB', loopPositionB)
    let playbackRate = localStorage.getItem('playbackRate')
    let loopPositionA = localStorage.getItem('loopPositionA')
    for (i = wavesurfer.length; i--;) {
        wavesurfer[i].clearRegions({id: 0})
        let region = {id: 0, start: loopPositionA, end: loopPositionB, loop: true, drag: false, resize: false, color: "rgba(255, 221, 125, 0.6)"}
        wavesurfer[i].addRegion(region)
        localStorage.setItem('loopStatus', 1)
        loopToggle.classList = 'btn btn-warning'
        for (stem of wavesurfer) {
            stem.play(loopPositionA);
            stem.setPlaybackRate(playbackRate)
            
        }
        for (audio of audioFiles) {
            audio.currentTime = audioFiles[0].currentTime
        }
    }
})

loopToggle.addEventListener('click', (e) => {
    if (localStorage.getItem('loopStatus') === null || localStorage.getItem('loopStatus') === '0' ) {
        localStorage.setItem('loopStatus', 1)
        loopToggle.classList = 'btn btn-warning'
        for (i = wavesurfer.length; i--;) {
            wavesurfer[i].clearRegions({id: 0})
            let region = {id: 0, start: loopPositionA, end: loopPositionB, loop: true, drag: false, resize: false, color: "rgba(255, 221, 125, 0.6)"}
            wavesurfer[i].addRegion(region)
        }
    } else if (localStorage.getItem('loopStatus') == 1) {
        localStorage.setItem('loopStatus', '0')
        loopToggle.classList = 'btn btn-outline-warning'
        for (i = wavesurfer.length; i--;) {
            localStorage.setItem('regionData', '{id: 0, start: loopPositionA, end: loopPositionB, loop: false, resize: false, drag: false, color: "rgba(255, 221, 125, 0.6)"}')
            wavesurfer[i].clearRegions({id: 0})
        }
    }
})

playbackRateRange.addEventListener('input', (e) => {
    let playbackRate = e.target.value
    let label = e.target.parentElement.children[0]
    label.innerText = playbackRate
    let playbackPercentage = (playbackRate - .25) * 100
    label.style.left = `${playbackPercentage - 2}%`
    localStorage.setItem('playbackRate', playbackRate)

    for (i = audioFiles.length; i--;) {
        audioFiles[i].playbackRate = playbackRate
    }
})

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('trackVolumeControls')) {
        let value = e.target.value
        let id = e.target.id - 1
        audioFiles[id].volume = value
    }
})

let movingId = null;

function moveImages(elem) {
    var pos = 0;
    clearInterval(movingId);
    movingId = setInterval(frame, 10);
    function frame() {
      if (pos == 350) {
        clearInterval(movingId);
      } else {
        pos++;
        elem.style.left = pos + '%';
      }
    }
  }