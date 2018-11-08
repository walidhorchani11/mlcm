

$(document).ready(function() {

    var idUser = TWIG_USER.idUser;

    $('#btn-file-reset').on('click', function(e) {
        var elm = $(this);
        var inputFile = $('#input-file');
        inputFile.wrap('<form>').closest('form').get(0).reset();
        $('.valueOfFile').empty();
        elm.remove();
        inputFile.unwrap();
        $( ".file-content" ).empty();
        sendId(idUser);
    });
});

function sendId(idUser){
    $.post( Routing.generate('update_user_picture_to_avatar', {'id': idUser}), "json");
}