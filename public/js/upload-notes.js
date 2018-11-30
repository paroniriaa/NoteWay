$(document).ready(function() {
    storageRef = firebase.storage().ref();
    notesRef = firebase.database().ref('notes');
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

    // TODO: Validate the class, professor, and section before proceeding

    // Uploads note only if it is a PDF
    if (file.type == "application/pdf") {
        const task = storageRef.child(name).put(file, metadata);
        task.then(snapshot => snapshot.ref.getDownloadURL())
            .then(function (url) {
                console.log('Successfully uploaded file!');
                console.log(url);

                // Storing notes to database
                notesRef.push({'country': country, 'capital_guess': capital_guess, 
                               'capital_answer': capital_answer, 'isCorrect': correct});

                // TODO: Need to send user to the view note page

            });
                // url => console.log(url));
    } else {
        console.log('Only accepts .pdf files!');
    }
});