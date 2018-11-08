$(document).ready(function () {
    var company = $('#create_project_company');
    company.change(function () {
        if ($("#wait").length) {
            $("#wait").show();
        } else {
            $("#create_project_company").after("<img id='wait' src='" + waitPath + "' />");
        }
        $("#create_project_saveAndReturn").prop('disabled', true);
        $('#create_project_owner option').show();

        var $form = $(this).closest('form');

        var data = {};
        data[company.attr('name')] = company.val();

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: data,
            success: function (html) {

                $('#create_project_owner').replaceWith(
                    $(html).find('#create_project_owner')
                );
                $("#wait").hide();
                $("#create_project_saveAndReturn").prop('disabled', false);

            }
        });
    });
})