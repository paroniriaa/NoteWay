$(document).ready(function() {
    storageRef = firebase.storage().ref();
    database = firebase.database();
});

$('#upload-file').change(function () {
    var file_name = $(this).val().replace(/C:\\fakepath\\/i, '');
    $(this).next('.custom-file-label').html(file_name);
});

// Upload note button
$('#confirm-upload').click(function() {
    const files = $('#upload-file').get(0).files;

    // Checks if an upload file was selected
    if (files.length === 0) {
        show_alert_div("Please upload a file.");
        return;
    }

    // Get uploaded file name
    const file = files[0];
    const metadata = {contentType: file.type};

    const note_name = $('#note-name').val();
    const class_name = $('#class-select').val();
    const week = $('#week-select').val();

    var error_messages = [];
    if (!note_name) {
        error_messages.push("Please input a note name.");
    }

    if (!class_name) {
        error_messages.push("Please input a class.");
    }

    if (!week) {
        error_messages.push("Please input a week.");
    }
    
    // Display error div if there is an error
    if (error_messages.length != 0) {
        show_alert_div(error_messages.join("<br/>"));
        return;
    }

    // Uploads note only if it is a PDF
    if (file.type == "application/pdf") {
        // Get note id
        database.ref('note_count').once('value').then(function(note_count) {
            var note_id = note_count.val();

            // Increment note id
            database.ref('note_count').set(note_id+1);

            // Get class_id from class_mapping
            database.ref('class_mapping/' + class_name).once('value').then(function(id) {
                var class_id = id.val();

                note_obj = {'clarity':0,'content_richness':0,'helpfulness':0,'overall':0,'times':0,'typesetting':0,'pdf': note_id + '.pdf', 'note_name': note_name, 'class_id': class_id, 'week': week};
                database.ref('notes/' + note_id).set(note_obj);
                database.ref('classes/' + class_id + '/' + week).push(note_id);

                // Upload note to storage
                const task = storageRef.child(note_id+'.pdf').put(file, metadata);
                task.then(snapshot => snapshot.ref.getDownloadURL()).then(function(url) {
                    // Redirect to note page
                    window.location.href = '/note?id=' + note_id;
                });
            });
        });
    } else {
        console.log('Only accepts .pdf files!');
    }
});

// Shows alert div when an error occurs
function show_alert_div(message) {
    $('#error-msg').html(message);
    $('#alert-div').show();
}

// Hides alert div when alert button is pressed
$('#alert-button').click(function() {
    $('#alert-div').hide();
});