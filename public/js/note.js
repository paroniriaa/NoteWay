$(document).ready(function() {
    storageRef = firebase.storage().ref();
    database = firebase.database();

    const urlParams = new URLSearchParams(window.location.search);
    const note_id = urlParams.get('id');

    display_note_information(note_id);
    display_note(note_id);
});

function display_note_information(note_id) {
    // Get note information from Firebase
    database.ref('notes/' + note_id).once('value').then(function(snapshot) {
        var note_info = snapshot.val();

        var note_name = '<div id="note-title-text" class="offset-md-3 col-md-6 center">';
        note_name += '<strong>' + note_info['note_name'] + '</strong></div>';

        // Get class from id_mapping
        database.ref('id_mapping/' + note_info['class_id']).once('value').then(function(class_string) {
            var class_name = class_string.val();

            var note_table = '<table>'
            note_table += '<thead><tr>';
            note_table += '<th>Class</th>';
            note_table += '<th>Week</th>'; 
            note_table += '</tr></thead>';
            note_table += '<tbody><tr>';
            note_table += '<td>' + class_name + '</td>';
            note_table += '<td>' + note_info['week'] + '</td>';
            note_table += '</tr></tbody></table>';

            $('#note-name-div').append(note_name);
            $('#note-class-week-table-div').append(note_table);
        });
    });
}

function display_note(note_id) {

    storageRef.child(note_id + '.pdf').getDownloadURL().then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
            var blob = xhr.response;
            var note = window.URL.createObjectURL(blob);
            load_pdf_viewer(note);
        };
        xhr.open('GET', url);
        xhr.send();
    });
}

// Displays pdf viewer with the note
function load_pdf_viewer(note) {
    var pdf_object = '<div class="offset-md-1 col-md-10">';
    pdf_object += '<object id="pdf-object" data="' + note + '" type="application/pdf"></object>';
    pdf_object += '</div>';
    $('#pdf-div').append(pdf_object);
}