function LoopList(source_files){
    this.loops = [];
    for(var i=0; i < source_files.length; i++){
        this.loops.push(new Loop(source_files[i][0], source_files[i][1], source_files[i][2], source_files[i][3], false, this));
    }
    this.cued_loops = 0;

    __this = this;

    window.addEventListener('loop_cued', function(e){
        console.log('loop_cued');
        __this.cued_loops ++;
        console.log(__this);
        if(__this.cued_loops == __this.loops.length){
            for(var i = 0; i < __this.loops.length; i++){
                __this.loops[i].playSound();
            }
        }
    });
}

function Loop(source_file, init_volume, keyCode, length, trigger_interval, loop_list){
    this.source = source_file;
    this.length = length;
    this.trigger = trigger_interval;
    this.loaded = false;
    this.volume = init_volume;
    this.keyCode = keyCode;

    this.bar_counter = 1;

    this.load_buffer = function(){
        this.buffer_request = new XMLHttpRequest();
        this.buffer_request.open('GET', this.source, true);
        this.buffer_request.responseType = 'arraybuffer';

        var _this = this;

        this.buffer_request.onload = function(){
            context.decodeAudioData(_this.buffer_request.response, function(buffer){
                _this.audio_buffer = buffer;
                _this.cue_sound();
                console.log('loaded');
            });

            document.addEventListener('keydown', function(e){
                if(e.keyCode == _this.keyCode){
                    if(_this.gainNode.gain.value == 1){
                        _this.gainNode.gain.value = 0;
                        _this.volume = 0;
                        document.getElementById(_this.keyCode).classList.remove('active');
                    }else{
                        _this.gainNode.gain.value = 1;
                        _this.volume = 1;
                        document.getElementById(_this.keyCode).classList.add('active');
                    }
                }
            }, false);
        }

        this.buffer_request.send();
    }

    this.cue_sound = function(){
        this.loaded = true;
        // this.loop(buffer);
        var event = new CustomEvent("loop_cued", {"detail":{"loop":this}});
        window.dispatchEvent(event);

        var _this = this;

        // window.addEventListener("Metronome.1", function(e) {
        //     if(_this.bar_counter == 1)
        //         _this.playSound();
        //     _this.bar_counter++;
        //     if(_this.bar_counter > _this.length)
        //         _this.bar_counter = 1;
        // });
    }

    // this.loop = function(){
    //     this.playSound();
    //     var _this = this;
    //     var interval = 8000;
    //     setTimeout(function(){
    //         _this.loop();
    //     }, interval);
    // }

    this.playSound = function() {
        // console.log(this.audio_buffer);
        this.buffer_source = context.createBufferSource();      // creates a sound source
        this.buffer_source.buffer = this.audio_buffer;          // tell the source which sound to play

        this.gainNode = context.createGain();
        this.buffer_source.connect(this.gainNode);
        this.gainNode.connect(context.destination);

        this.buffer_source.loop = true;

        this.gainNode.gain.value = this.volume;
        // console.log(this.volume);

        // this.buffer_source.connect(context.destination);        // connect the source to the context's destination (the speakers)
        this.buffer_source.start(0);                            // play the source now
                                                                // note: on older systems, may have to use deprecated noteOn(time);
    }

    this.load_buffer();
}

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

}

var list = new LoopList([
    // ['/html5/audio/sound/1-1.wav', 1, 49, 1],

    // ['/html5/audio/sound/2-4.wav', 1, 50, 4],

    ['/html5/audio/sound/mns1.wav', 0, 49, 4],
    ['/html5/audio/sound/mns2.wav', 0, 50, 4],
    ['/html5/audio/sound/mns3.wav', 0, 51, 4],
    ['/html5/audio/sound/mns4.wav', 0, 52, 4],
    ['/html5/audio/sound/mns5.wav', 0, 81, 4],
    ['/html5/audio/sound/mns6.wav', 0, 87, 4],
    ['/html5/audio/sound/mns7.wav', 0, 69, 4],
    ['/html5/audio/sound/mns8.wav', 0, 82, 4],
    ['/html5/audio/sound/mns9.wav', 0, 65, 4],
    ['/html5/audio/sound/mns10.wav', 0, 83, 4],
    ['/html5/audio/sound/mns11.wav', 0, 68, 4],
    ['/html5/audio/sound/mns12.wav', 0, 70, 4],
    ['/html5/audio/sound/mns13.wav', 0, 90, 4],
    ['/html5/audio/sound/mns14.wav', 0, 88, 4],
    ['/html5/audio/sound/mns15.wav', 0, 67, 4],
    ['/html5/audio/sound/mns16.wav', 0, 86, 4],
]);