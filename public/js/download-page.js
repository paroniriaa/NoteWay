$(document).ready(function() {
    database = firebase.database();
    database.ref('download_notes').once('value').then(function (notes_obj){
        var notes = Object.values(notes_obj.val());
        var note_keys = Object.keys(notes_obj.val());
        var i = 0;
        notes.forEach(note => {
            var note_name = Object.values(note)[1];
            var note_key = Object.keys(note);
            $('#download').append('<div class="circle1" style="float:left;margin-left:5px;"><a class="name" href="/note/?id=' + note_keys[i++] + '"><font size=4>' +  note_name.slice(0,9) + '</font></a></div>');       
        }); 
    });
});
