$(document).ready(function() {
    database = firebase.database();
    const urlParams = new URLSearchParams(window.location.search);
    const section_id = urlParams.get('id');
    checkSubscribed(section_id);
    database.ref('id_mapping/' + section_id).once('value').then(async function(name_obj) {
        var name = name_obj.val();
        $('#section').prepend('<h3 class="col-md-8 offset-md-4 title">' + name + ' Notes</h3>');
        $("#accordion").css("visibility", "visible");
        await database.ref('classes/' + section_id).once('value').then(async function (weeks_obj) {
            var weeks = weeks_obj.val();
            if (weeks.length != null) {
                for (var weekNum = 1; weekNum < weeks.length; weekNum++) {
                    var week = weeks[weekNum];
                    if (week != null) {
                        for (note of Object.values(week)) {
                            await database.ref('notes/' + note).once('value').then(function(note_obj){
                                var note_json = note_obj.val();
                                $('#card-' + weekNum).append('<div class="note-item"><div class="card-body border border-dark"><h5 class="card-title">' + note_json['note_name'] +  ' Notes</h5><a href="/note/?id=' + note + '" class="card-link">Note link</a></div></div>');
                            });
                        }
                    }
                    $('#accordion').append('</div></div>');
                }
            }
            else {
                var weeks_nums = Object.keys(weeks);
                for (week of weeks_nums) {
                    var notes = Object.values(weeks[week]);
                    for (var note of notes) {
                        await database.ref('notes/' + note).once('value').then(function(note_obj){
                            var note_json = note_obj.val();
                            $('#card-' + week).append('<div class="note-item"><div class="card-body border border-dark"><h5 class="card-title">' + note_json['note_name'] +  ' Notes</h5><a href="/note/?id=' + note + '" class="card-link">Note link</a></div></div>');
                        });
                    }
                }
            }
        });          
    });  
});

subscribe = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const section_id = urlParams.get('id');
    database.ref('subscriptions').push(section_id);
    markAsSubscribed();
}

checkSubscribed = function(id) {
    database.ref('subscriptions').once('value').then(function(subscriptions_obj){
        var subscriptions_json = subscriptions_obj.val();
        var subscriptions = Object.values(subscriptions_json);
        if (subscriptions.indexOf(id) > -1) {
            markAsSubscribed();
        }
    });
}

markAsSubscribed = function() {
    $('#subscribe-text').text("Subscribed");
    $('#subscribe-button').removeClass('btn-success').addClass('btn-secondary ');
    $("#subscribe-button").prop("onclick", null).off("click");
}

