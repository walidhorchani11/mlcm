var userRole = {};
userRole.affect = function (uid, pid, role, revoke) {

    $.ajax({
        url: userRolePath,
        type: "POST",
        data: {
            uid: uid,
            pid: pid,
            role: role,
            revoke: revoke
        },
        dataType: 'json',
        success: function (result) {
        }
    });
};
$( '.owner.btn-success' ).parent().find('.editor, .viewer').hide();
$('.button-role > .owner').click(function () {

    var uid = $(this).parent().data('uid');
    var checked = $(this).data('check');
    var button = $(this);
    if(!checked){
        swal({
            title: "Confirmation",
            text: "Change user role ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            closeOnConfirm: true
        },function(){

            button.parent().find('button').removeClass( "btn-success" ).addClass('btn-white');
            $(document).find('.editor, .viewer').show();
            button.parent().find('.editor, .viewer').hide();
            $('.button-role > .owner').each(function () {
                $(this).removeClass( "btn-success" );
                $(this).addClass( "btn-white" );
                $(this).data('check', false);
            });
            button.toggleClass('btn-white btn-success');
            button.data('check', true);
            userRole.affect(uid, presentationId, 'owner', false)
        });
    }
});

$('.button-role > .editor').click(function () {
    var uid = $(this).parent().data('uid');
    var checked = $(this).data('check');

    var button = $(this);
    swal({
        title: "Confirmation",
        text: "Change user role ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Change it!",
        closeOnConfirm: true
    },function(){
        button.parent().find('.viewer').removeClass( "btn-success" ).addClass('btn-white');
        button.toggleClass('btn-white btn-success');
        if (checked === false)
            button.data('check', true);
        else
            button.data('check', false);

        userRole.affect(uid, presentationId, 'editor', checked)
    });

});

$('.button-role > .viewer').click(function () {
    var uid = $(this).parent().data('uid');
    var checked = $(this).data('check');

    var button = $(this);
    swal({
        title: "Confirmation",
        text: "Change user role ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Change it!",
        closeOnConfirm: true
    },function(){
        button.parent().find('.editor').removeClass( "btn-success" ).addClass('btn-white');
        button.toggleClass('btn-white btn-success');
        if (checked === false)
            button.data('check', true);
        else
            button.data('check', false);

        userRole.affect(uid, presentationId, 'viewer', checked)
    });

});