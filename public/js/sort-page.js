$(document).ready(function() {
    database = firebase.database();
    database.ref('sort_notes').orderByChild('overall').once('value').then(function (notes_obj){
        var notes = Object.values(notes_obj.val());
        var note_keys = Object.keys(notes_obj.val());
        var i = 0;
        notes.forEach(note => {
            var note_name = Object.values(note)[4];
            var note_id = Object.values(note)[3];
            var overall = Object.values(note)[5];
           
            $('#sort').append('<div style="float:left;margin-left:16px;">'+
            '<div class="circle2">'+
                '<a class="note_id" href="/note/?id=' + note_id + '"><font color="white" size=4>' +  note_name.slice(0,9) + '</font></a>'+
            '</div>'+
            '<div style="margin-left:50px;" class="overall"><font size="5" color="red">' + overall + '</font></div>'+
            '</div>'+
            '<div style="float:left;margin-left:5px;">'+
                '<input type="hidden" class="sort_note_id" value="'+note_keys[i++]+'">'+
                '<div style="align:center;">'+
                    '<label class="">clarity: </label>'+
                    '<select class="clarity">'+
                        '<option value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label class="">typesetting: </label>'+
                    '<select class="typesetting">'+
                        '<option value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+ 
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label class="">content richness: </label>'+
                    '<select class="content-richness">'+
                        '<option value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+ 
                    '</select>'+
                '</div>'+
                '<div style="align:center;">'+
                    '<label>helpfulness: </label>'+
                    '<select class="helpfulness">'+
                        '<option value="0">0</option>'+
                        '<option value="1">1</option>'+
                        '<option value="2">2</option>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+ 
                    '</select>'+
                '</div>'+
                '<div class="">'+
                    '<button type="submit" class="btn btn-primary select-submit">Confirm</button>'+
                '</div>'+
            '</div>');       
        }); 
    });
});



$('.select-submit').click(function() {
    const sort_note_id = $('.sort_note_id').val();
    const clarity = $('.clarity').val();
    const typesetting = $('.typesetting').val();
    const content_richness = $('.content-richness').val();
    const helpfulness = $('.helpfulness').val();
    
    database.ref('sort_notes/' + sort_note_id).once('value').then(function(sort_note) {
        var sort_clarity = Object.values(sort_note.val())[0];
        var sort_content_richness = Object.values(sort_note.val())[1];
        var sort_helpfulness = Object.values(sort_note.val())[2];
        var sort_typesetting = Object.values(sort_note.val())[7];
        var times = Object.values(sort_note.val())[6];
        sort_clarity = (sort_clarity*times+clarity)/(times+1);
        sort_content_richness = (sort_content_richness*times+content_richness)/(times+1);
        sort_helpfulness = (sort_helpfulness*times+helpfulness)/(times+1);
        sort_typesetting = (sort_typesetting*times+typesetting)/(times+1);
        times = times+1;
        var overall = (sort_clarity+sort_content_richness+sort_helpfulness+sort_typesetting)/4;

        note_obj = {'clarity': sort_clarity, 'content_richness': sort_content_richness, 'helpfulness': sort_helpfulness, 
            'note_id': Object.values(sort_note.val())[3],'note_name': Object.values(sort_note.val())[4],'overall': overall,
            'times': times,'typesetting': sort_typesetting};
        database.ref('sort_notes/' + sort_note_id).set(note_obj);
        
        window.location.href = '/sort-page';
       
    });
       
    
});