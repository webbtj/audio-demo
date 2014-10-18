function Metronome(opts){
    opts = opts||{};

    defaults = {
        bpm : 120.0,
        lookahead : 50.0,
        scheduleAheadTime : 0.5,
    };

    this.bpm = opts.bpm||defaults.bpm;
    this.temlookahead = opts.lookahead||defaults.lookahead;
    this.scheduleAheadTime = opts.scheduleAheadTime||defaults.scheduleAheadTime;

    this.secondsPerBeat = 60.0 / this.bpm;
    this.current16thNote = 0;
    this.nextNoteTime = 0.0;
    this.notesInQueue = [];
    this.audioContext = new AudioContext();
    this.isPlaying = false;
    this.timerWorker = null;

    this.nextNote = function() {
        this.nextNoteTime += 0.25 * this.secondsPerBeat;

        this.current16thNote++;
        if (this.current16thNote == 16) {
            this.current16thNote = 0;
        }
    };

    this.scheduleNote = function() {
        this.notesInQueue.push( { note: this.current16thNote, time: this.nextNoteTime } );

        var event_sixteenth = new CustomEvent("Metronome.16",
        {
            "detail": {
                time: this.nextNoteTime,
                beatNumber: this.current16thNote
            }
        });
        window.dispatchEvent(event_sixteenth);


        // if(this.current16thNote == 1){
        //     loop.playSound();
        // }

        // var n = this.current16thNote;
        // if(n == 1 || n == 3 || n == 5 || n == 7 || n == 9 || n == 11 || n == 13 || n == 15){
        //     var event_eighth = new CustomEvent("Metronome.8",
        //     {
        //         "detail": {
        //             time: this.nextNoteTime,
        //             beatNumber: this.current16thNote
        //         }
        //     });
        //     window.dispatchEvent(event_eighth);

        //     if(n == 1 || n == 5 || n == 9 || n == 13){
        //         var event_quarter = new CustomEvent("Metronome.4",
        //         {
        //             "detail": {
        //                 time: this.nextNoteTime,
        //                 beatNumber: this.current16thNote
        //             }
        //         });
        //         window.dispatchEvent(event_quarter);

        //         if(n == 1 || n == 9){
        //             var event_half = new CustomEvent("Metronome.2",
        //             {
        //                 "detail": {
        //                     time: this.nextNoteTime,
        //                     beatNumber: this.current16thNote
        //                 }
        //             });
        //             window.dispatchEvent(event_half);

        //             if(n == 1){
        //                 var event_whole = new CustomEvent("Metronome.1",
        //                 {
        //                     "detail": {
        //                         time: this.nextNoteTime,
        //                         beatNumber: this.current16thNote
        //                     }
        //                 });
        //                 window.dispatchEvent(event_whole);
        //             }
        //         }
        //     }
        // }
    };

    this.scheduler = function() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote();
            this.nextNote();
        }
    };

    this.play = function() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.current16thNote = 0;
            this.nextNoteTime = this.audioContext.currentTime;
            this.timerWorker.postMessage("start");
            return "stop";
        } else {
            this.timerWorker.postMessage("stop");
            return "play";
        }
    };

    this.init = function(){

        this.timerWorker = new Worker("js/metronomeworker.js");

        _this = this;

        this.timerWorker.onmessage = function(e) {
            if (e.data == "tick") {
                _this.scheduler();
            }
            else
                console.log("message: " + e.data);
        };
        this.timerWorker.postMessage({"interval":this.lookahead});
    };

    this.init();
    
}


window.addEventListener("Metronome.16", function(e) {;
    //example event listener
    // console.log(16);
});

window.addEventListener("Metronome.8", function(e) {;
    //example event listener
    // console.log(8);
});

window.addEventListener("Metronome.4", function(e) {;
    //example event listener
    // console.log(4);
});

window.addEventListener("Metronome.2", function(e) {;
    //example event listener
    // console.log(2);
});

window.addEventListener("Metronome.1", function(e) {;
    //example event listener
    console.log(1);
    console.log(e.detail);
});



window.addEventListener("load", setup_player );
function setup_player(){
    b = new Metronome({bpm: 120});
    b.play();
}
