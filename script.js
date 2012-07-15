/**
* @file Javascript file to handle the audio/video recording
* of the mediacapture plugin
*/

 /**
* Start the appropriate audio/video recorder via ajax
* in response to user selection
*/
function load_recorder(media) {
    // Create a YUI instance using io-base module.
    YUI().use('node', 'io-base', function(Y) {
        var uri = decodeURIComponent(Y.one('#ajax_uri').get('value'));
        var applet = Y.one('#appletcontainer');
        // Define a function to handle the response data.
        function complete(id, o) {
            var id = id; // Transaction ID.
            var data = o.responseText; // Response data.
            applet.setContent(data);
        };

        // Subscribe to event "io:complete"
        Y.on('io:complete', complete, Y);

        // Make an HTTP POST request to posturl.
        cfg = {
            method: 'POST',
            data: 'media='+media+
                    '&java='+BrowserPlugins.java+
                    '&flash='+BrowserPlugins.flash+
                    '&quicktime='+BrowserPlugins.quicktime+
                    '&os='+BrowserDetect.OS
        };

        var request = Y.io(uri, cfg);
    });

    return false;
}
 
/**
* Status of the applet.
* This is the hidden element in the interface
* Useful for debug options (document.getElementById('Status').value)
*/
function setStatus(num, str) {
    // Handle status changes
    //**********************
    // Status codes:
    // StartUpload = 0;
    // UploadDone = 1;
    // StartRecord = 2;
    // StartPlay = 3;
    // PauseSet = 4;
    // Stopped = 5;
    document.getElementById('Status').value = str;
}

/**
* Start the timer for the recording
*/
function setTimer(str) {
    document.getElementById('Timer').value = str;
}

/**
* Start recording
*/
function record_rp() {
    document.VimasVideoApplet.RECORD_VIDEO();
    document.getElementById('rec').disabled=true;
    document.getElementById('play').disabled=true;
    document.getElementById('stop').disabled=false;
    document.getElementById('pause').disabled=false;
    return false;
}

/**
* Playback for the recorded video
*/
function playback_rp() {
    document.VimasVideoApplet.PLAY_VIDEO();
    document.getElementById('pause').disabled=false;
    return false;
}

/**
* Pause the playback/recording
*/
function pause_rp() {
    document.VimasVideoApplet.PAUSE_VIDEO();
    return false;
}

/**
* Stop recording
*/
function stop_rp() {
    document.VimasVideoApplet.STOP_VIDEO();
    document.getElementById('rec').disabled=false;
    document.getElementById('stop').disabled=true;
    document.getElementById('pause').disabled=true;
    document.getElementById('play').disabled=false;
    return false;
}

/**
* Method to upload the recorded video to
* a tmp location on server.
*/
function upload_rp() {
    var filename = document.getElementById('filename'),
        fileloc = document.getElementById('fileloc'),
        duration = document.getElementById('Timer');

    if (!duration.value.trim()) {
        alert(mediacapture['norecordingfound']);
        return false;
    }

    filename.value = filename.value.replace('.mp4', '');
    filename.value = filename.value.replace('*', '');
    if (!filename.value) {
        alert(mediacapture['nonamefound']);
        filename.value = '*.mp4';
        return false;
    }
    filename.value = filename.value + '.mp4';

    document.VimasVideoApplet.UPLOAD_VIDEO(String(filename.value));
    fileloc.value = encodeURIComponent(decodeURIComponent(fileloc.value) + '/' + filename.value);
    
    return true;
}

/**
* Submits the video recording to the server
* for processing upload
*/
function submit_flash_video() {
    var filename = document.getElementById('filename'),
        fileloc = document.getElementById('fileloc');

    filename.value = filename.value.replace('.flv', '');
    filename.value = filename.value.replace('*', '');
    if (!filename.value) {
        alert(mediacapture['nonamefound']);
        filename.value = '*.flv';
        return false;
    }
    
    filename.value = filename.value + '.flv';

    var duration = 90; // max-duration

    // Create a YUI instance using io-base module.
    YUI().use('node', 'io-base', function(Y) {
        var uri = decodeURIComponent(Y.one('#posturl').get('value'));
        // Define a function to handle the response data.
        function complete(id, o) {
            var id = id; // Transaction ID.
            var data = o.responseText; // Response data.
            if (data === 'NONE') {
                duration = 0;
            }
        };

        // Subscribe to event "io:complete"
        Y.on('io:complete', complete, Y);

        // Make an HTTP POST request to posturl.
        cfg = {
            method: 'POST',
            data: 'type=check_duration'+
                    '&tmp_loc='+fileloc.value,
            sync:true
        };
        var request = Y.io(uri, cfg);
    });

    if (duration <= 0) {
        alert(mediacapture['norecordingfound']);
        return false;
    }

    return true;
}