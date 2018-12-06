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

        var note_name = '<div id="note-title-text" class="offset-md-2 col-md-8 center">';
        note_name += '<strong>' + note_info['note_name'] + '</strong></div>';

        $('#result-div').append('<div style="float:left;margin-left:16px;">'+
            '<div class="circle2">'+
                '<a class="note_id" href="#"><font color="white" size=4>' +  note_info['note_name'].slice(0,9) + '</font></a>'+
            '</div>'+
            '<div style="margin-left:50px;" class="overall"><font size="5" color="red">' + note_info['overall'] + '</font></div>'+
            '</div>'+
            '<div style="float:left;margin-left:5px;">'+
                '<div style="align:center;">'+
                    '<label style="float:left;">clarity:</label>'+
                    '<div style="float:left;">'+
                    note_info['clarity']+
                    '</div>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label style="float:left;">typesetting:</label>'+
                    '<div style="float:left;">'+
                    note_info['typesetting']+
                    '</div>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label style="float:left;">content richness:</label>'+
                    '<div style="float:left;">'+
                    note_info['content_richness']+
                    '</div>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label style="float:left;">helpfulness:</label>'+
                    '<div style="float:left;">'+
                    note_info['helpfulness']+
                    '</div>'+
                '</div>'+
            '</div>'); 


        $('#rate-div').append('<div style="float:left;margin-left:16px;">'+
            '<div style="float:left;margin-left:5px;">'+
                '<div style="align:center;">'+
                    '<label class="">clarity: &nbsp</label>'+
                    '<select id="clarity">'+
                        '<option value=0>0</option>'+
                        '<option value=1>1</option>'+
                        '<option value=2>2</option>'+
                        '<option value=3>3</option>'+
                        '<option value=4>4</option>'+
                        '<option value=5>5</option>'+
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label id="">typesetting: &nbsp</label>'+
                    '<select id="typesetting">'+
                        '<option value=0>0</option>'+
                        '<option value=1>1</option>'+
                        '<option value=2>2</option>'+
                        '<option value=3>3</option>'+
                        '<option value=4>4</option>'+
                        '<option value=5>5</option>'+
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label class="">content richness: &nbsp</label>'+
                    '<select id="content-richness">'+
                       '<option value=0>0</option>'+
                        '<option value=1>1</option>'+
                        '<option value=2>2</option>'+
                        '<option value=3>3</option>'+
                        '<option value=4>4</option>'+
                        '<option value=5>5</option>'+
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label>helpfulness: &nbsp</label>'+
                    '<select id="helpfulness">'+
                        '<option value=0>0</option>'+
                        '<option value=1>1</option>'+
                        '<option value=2>2</option>'+
                        '<option value=3>3</option>'+
                        '<option value=4>4</option>'+
                        '<option value=5>5</option>'+
                    '</select>'+
                '</div>'+
                '<div class="">'+
                    '<button id="select-submit" type="submit" class="btn btn-primary">Confirm</button>'+
                '</div>'+
            '</div>');    


        $('#select-submit').click(function() {
            var selected_clarity=parseInt($("#clarity option:selected").val());
            var selected_typesetting=parseInt($("#typesetting option:selected").val());
            var selected_content_richness=parseInt($("#content-richness option:selected").val());
            var selected_helpfulness=parseInt($("#helpfulness option:selected").val());

            var final_clarity = (note_info['clarity']*note_info['times']+selected_clarity)/(note_info['times']+1);
            var final_typesetting = (note_info['typesetting']*note_info['times']+selected_typesetting)/(note_info['times']+1);
            var final_content_richness = (note_info['content_richness']*note_info['times']+selected_content_richness)/(note_info['times']+1);
            var final_helpfulness = (note_info['helpfulness']*note_info['times']+selected_helpfulness)/(note_info['times']+1);
            
            
            var final_times = note_info['times']+1;

            var final_overall = (final_clarity+final_typesetting+final_content_richness+final_helpfulness)/4;

            note_obj = {'clarity': final_clarity,'typesetting': final_typesetting,'content_richness': final_content_richness, 'helpfulness': final_helpfulness, 
                'class_id': note_info['class_id'],'note_name': note_info['note_name'],'pdf':note_info['pdf'],'overall': final_overall,'week':note_info['week'],
                'times': final_times};
            database.ref('notes/' + note_id).set(note_obj);
            window.location.href = '/note/?id=' + note_id;      
        });


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