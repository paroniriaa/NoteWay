$(document).ready(function() {
    database = firebase.database();
    database.ref('subscriptions').once('value').then(function (subscriptions_obj){
        var subscriptions = Object.values(subscriptions_obj.val());
        subscriptions.forEach(async (subscription) => {
            await database.ref('id_mapping/' + subscription).once('value').then(function (name_obj) {
                var class_name = name_obj.val();
                $('#dashboard').append('<div class="container-fluid border border-dark stream"><div class="circle"><a class="name" href="/section/?id=' + subscription + '">' +  class_name + '</a></div><div id="class-' +  subscription + '" class="stream"></div>');
                database.ref('classes/' + subscription).once('value').then(function (weeks_obj) {
                    var weeks = weeks_obj.val();
                    if (weeks.length != null) {
                        for (var weekNum = 1; weekNum < weeks.length; weekNum++) {
                            var week = weeks[weekNum];
                            if (week != null) {
                                var note = Object.values(week)[0];
                                $('#class-' + subscription).append('<div class="note-item"><div class="card-body border border-dark"><h5 class="card-title">Week ' + weekNum +  ' Notes</h5><a href="/note/?id=' + note + '" class="card-link">Note link</a></div></div>');                                             
                            }
                        }
                    }
                    else {
                        var week = Object.keys(weeks)[0];
                        var note = Object.values(weeks[week])[0];
                        $('#class-' + subscription).append('<div class="note-item"><div class="card-body border border-dark"><h5 class="card-title">Week ' + week +  ' Notes</h5><a href="/note/' + note + '" class="card-link">Note link</a></div></div>');                                             
                    }
                });            
            });
        }); 
    });
});