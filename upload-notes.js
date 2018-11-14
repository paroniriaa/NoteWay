$(document).ready(function() {
    notesRef = firebase.storage().ref();
});

$('#upload-file').change(function () {
    var file_name = $(this).val().replace(/C:\\fakepath\\/i, '');
    $(this).next('.custom-file-label').html(file_name);
});

// Upload note button
$('#confirm-upload').click(function() {
    // Grab file
    const file = $('#upload-file').get(0).files[0];
    const name = (+new Date()) + '-' + file.name;
    const metadata = {contentType: file.type};

    if (file.type == "application/pdf") {
        const task = notesRef.child(name).put(file, metadata);
        task.then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => console.log(url));
    }
});