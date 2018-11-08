$(document).ready(function () {

    var oldName = $("#create_project_name").val();
    $("#edit_project").submit(function (e) {

        var newName = $("#create_project_name").val();
        if (oldName != newName) {
            e.preventDefault();
            var projectTitle = $("#create_project_name").val();
            var typeForm = $(this).attr('class');
            if (projectTitle != "") {
                var form = this;
                $.get(TWIG.isUniqueTitle, {name: projectTitle, type: typeForm}, function (R) {
                    callback(R, form);
                });
                var callback = function (R, form) {
                    if (R.success == true) {
                        form.submit();
                    }
                    else {
                        swal("Title must be unique");
                        $("#create_project_name").val(oldName);
                    }
                };
            }
        }

    });
});
