/**
 * @file Javascript file to handle the audio/video recording
 * of the mediacapture plugin
 */

 /**
  * Start the appropriate audio/video recorder via ajax
  * in response to user selection
  */
function load_recorder(type) {
    // Create a YUI instance using io-base module.
    YUI().use('node', 'io-base', function(Y) {
        var uri = decodeURIComponent(Y.one('#ajax_uri').get('value')) +
                 '?type=' + type;
        var applet = Y.one('#appletcontainer');
        // Define a function to handle the response data.
        function complete(id, o) {
            var id = id; // Transaction ID.
            var data = o.responseText; // Response data.
            applet.setContent(data);
        };

        // Subscribe to event "io:complete"
        Y.on('io:complete', complete, Y);

        // Make an HTTP request to posturl.
        var request = Y.io(uri);
    });

    return false;
}  
 
/**
 * Method to validate the audio recording form and save
 * the recording to temp file
 */
function submitAudio() {
    var filename    = document.getElementById('filename'),
        recorder    = document.getElementById('audio_recorder'),
        posturl     = document.getElementById('posturl'),
        fileloc     = document.getElementById('fileloc');
        
    filename.value = filename.value.replace('*.wav', '');
    if (!filename.value) {
        alert(mediacapture['nonamefound']);
        filename.value = '*.wav';
        return false;
    }
    filename.value += '.wav';

    if (!recorder || !(recorder.sendGongRequest)) {
        alert(mediacapture['appletnotfound']);
        return false;
    }

    var duration = parseInt(recorder.sendGongRequest("GetMediaDuration", "audio")) || 0
    if (duration <= 0) {
        alert(mediacapture['norecordingfound']);
        return false;
    }

    fileloc.value = encodeURIComponent(recorder.sendGongRequest("PostToForm", decodeURIComponent(posturl.value), "repo_upload_audio", "cookie=nanogong", "myfile"));
    
    if (!fileloc.value) {
        alert(mediacapture['filenotsaved']);
        return false;
    }
    
    simulateClick(recorder, '.wav');

    return true;
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
}

/**
 * Playback for the recorded video
 */
function playback_rp() {
    document.VimasVideoApplet.PLAY_VIDEO();
}

/**
 * Pause the playback/recording
 */
function pause_rp() {
    document.VimasVideoApplet.PAUSE_VIDEO();
}

/**
 * Stop recording
 */
function stop_rp() {
    document.VimasVideoApplet.STOP_VIDEO();
}

/**
 * Method to upload the recorded audio to
 * a tmp location on server.
 */
function upload_rp() {
    var filename = document.getElementById('filename'),
        fileloc = document.getElementById('fileloc');
        
    filename.value = filename.value.replace('.mp4', '') + '.mp4';
    document.VimasVideoApplet.UPLOAD_VIDEO(String(filename.value));
    fileloc.value = encodeURIComponent(decodeURIComponent(fileloc.value) + '/' + filename.value);
    simulateClick(filename, '.mp4');
}

/**
 * Simulates the 'click' event for the form upload
 */
function simulateClick(el, type) {

    while(el.tagName != 'FORM') {
        el = el.parentNode;
    }

    el.repo_upload_file.type = 'hidden';
    el.repo_upload_file.value = 'temp'+type;
    el.nextElementSibling.getElementsByTagName('button')[0].click();
}