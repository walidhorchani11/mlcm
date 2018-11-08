$(document).ready(function () {

    $("#create_presentation_isActive").parent().insertAfter($("#create_presentation_viewers").parent());
    $("#create_presentation_saveAndReturn").parent().insertAfter($("#create_presentation_isActive").parent());

    var localisation = [];
    $("#tabss").tabs();
    $('.create-label input').click(function () {

        swal({
                title: "test",
                text: "test 2",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, test it!",
                closeOnConfirm: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    document.location.href = url;

                } else {
                    $(".radio-inline.test").click();
                }
            })
    });
    $("#create_presentation_type").change(function () {

        $(".addLoc").hide();
        localisation = [];
        $("#skeleton-table").html('');
        var type = $(this).val();
        if (type == "Standard") {
            $(".addLoc").hide();
        } else if (type == "Master") {
            if ($(".addLoc").length) {
                $(".addLoc").show();
            } else {
                $("#create_presentation_company").after("<a  class='addLoc' style='font-size: 16px;color: #018aff;'>+Add Localisation</a>");
            }
        }
    });


    $('#create_presentation_territory').change(function () {
        var value = $('#create_presentation_territory option:selected').val();
        if (value != "") {
            $('#create_presentation_territories option').show();
            $('#create_presentation_territories option[value=' + value + ']').hide();
        }
    });
    $(document).on('change', '#create_presentation_owner', function () {

        var value = $('#create_presentation_owner option:selected').val();
        if (value != "") {
            $('#create_presentation_editors option').show();
            $('#create_presentation_editors option[value=' + value + ']').hide();
            $('#create_presentation_viewers option').show();
            $('#create_presentation_viewers option[value=' + value + ']').hide();
        } else {
            $('#create_presentation_editors option').show();
            $('#create_presentation_viewers option').show();
        }
    });
    $(document).on('change', '#create_presentation_editors', function () {

        $('#create_presentation_viewers option').show();
        var owner = $('#create_presentation_owner').val();
        if (owner != "") {
            $('#create_presentation_viewers option[value=' + owner + ']').hide();
        }
        $('#create_presentation_editors :selected').each(function (i, selected) {
            var value = $(selected).val();
            $('#create_presentation_viewers option[value=' + value + ']').hide();

        });

    });
    /************** get company by project selected **********/
    $(document).on('change', '#create_presentation_project', function () {

        var idProject = $(this).val();
        $.get(urlgetCompanyByProject, {
            idProject: idProject
        }, function (Resp) {
            $('#create_presentation_company').html("");

            $('#create_presentation_company').append("<option value='' selected='selected'>choose the pharma Company</option>");
            for (var i = 0; i < Resp.listCompany.length; i++) {
                $('#create_presentation_company').append("<option value=" + Resp.listCompany[i].id + ">" + Resp.listCompany[i].name + "</option>");

            }
        });
    })
    /************** get basic users by company selected **********/
    $(document).on('change', '#create_presentation_company', function () {
        if ($("#wait").length) {
            $("#wait").show();
        } else {
            $("#create_presentation_company").parent().after("<img id='wait' src='" + waitPath + "' />");
        }
        $("#create_presentation_saveAndReturn").prop('disabled', true);
        $('#create_presentation_territory option').show();
        $('#territory option').show();
        localisation = [];
        $("#skeleton-table").html("");
        var idCompany = $(this).val();

        var form = $(this).closest('form');
        var data = {};
        data[$(this).attr('name')] = $(this).val();

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: data,
            success: function (html) {

                $('#create_presentation_owner').replaceWith(
                    $(html).find('#create_presentation_owner')
                );
                $('#create_presentation_editors').replaceWith(
                    $(html).find('#create_presentation_editors')
                );
                $('#create_presentation_viewers').replaceWith(
                    $(html).find('#create_presentation_viewers')
                );
                $("#wait").hide();
                $("#create_presentation_saveAndReturn").prop('disabled', false);
            }
        });

        $('#companyTerritory').html('');
        $.get(urlCompanyTerritory, {
            idCompany: idCompany
        }, function (Resp) {
            $('#companyTerritory').append("<option value='' selected>Choose a Company</option>");
            for (var k = 0; k < Resp.listCompany.length; k++) {

                if (Resp.listCompany[k].id != idCompany) {
                    $('#companyTerritory').append("<option value=" + Resp.listCompany[k].id + ">" + Resp.listCompany[k].name + "</option>");
                }
            }
        });
        $("#create_presentation_products").html("");
        $.get(urlListProduct, {
            idCompany: idCompany
        }, function (R) {
            for (var j = 0; j < R.listProducts.length; j++) {
                $('#create_presentation_products').append("<option value=" + R.listProducts[j].id + ">" + R.listProducts[j].name + "</option>");
            }
        })
    });
    $(document).on('click', '.addLoc', function () {

        var idPres = $(this).attr('id');
        $("#add_local").modal("show");
        var availableTerritory = $("#create_presentation_territory").html();
        var value = $("#create_presentation_territory").val();

        $("#territory").html(availableTerritory);
        if (value != "") {
            $('#territory option[value=' + value + ']').hide();
        }
    });
    $(document).on('change', '#territory', function () {
        var value = $("#territory").val();
        $('#create_presentation_territory option[value=' + value + ']').hide();
    })
    $(document).on('submit', '#myForm', function (e) {
        e.preventDefault();
        var territoryLabel = $("#territory option:selected").text();
        var territoryVal = $("#territory").val();
        var campanyLabel = $("#companyTerritory option:selected").text();
        var campanyVal = $("#companyTerritory").val();
        if (campanyVal == "" || campanyVal == null) {
            campanyVal = $("#create_presentation_company").val();
            campanyLabel = $("#create_presentation_company option:selected").text();
        }
        $('#create_presentation_territory option[value=' + territoryVal + ']').hide();
        $('#territory option[value=' + territoryVal + ']').hide();
        $('#companyTerritory option[value=' + campanyVal + ']').hide();
        $('#companyTerritory option[value=' + campanyVal + ']').prop("selected", false);
        localisation.push({
            idTerr: territoryVal,
            labelTerr: territoryLabel,
            idCamp: campanyVal,
            labelCamp: campanyLabel
        });
        $("#skeleton-table").append("<tr><td>" + territoryLabel + "</td><td>" + campanyLabel + "</td><td><a data-idTr='" + territoryVal + "' data-idCamp='" + campanyVal + "' class='delete-affected'>x</a></td></tr>");
        $("#tabss").tabs("option", "active", 1);
        $("#companyTerritory").find('option:selected').removeAttr("selected");
        $("#territory").find('option:selected').removeAttr("selected");

    });
    $(document).on('click', '.delete-affected', function () {
        var idTr = $(this).attr('data-idTr');
        var idCamp = $(this).attr('data-idCamp');
        $('#create_presentation_territory option[value=' + idTr + ']').show();
        $('#territory option[value=' + idTr + ']').show();
        $('#companyTerritory option[value=' + idCamp + ']').show();
        $(this).parent().parent().remove();
        for (var i = 0; i < localisation.length; i++) {
            if (localisation[i].idTerr == idTr) {
                localisation.splice(i, 1);
                break;
            }
        }
    });
    $('#form_pres').submit(function (e) {
        e.preventDefault();
        var presTitle = $("#create_presentation_name").val();
        var typePres = $("#create_presentation_type").val();
        var territoryPres = $("#create_presentation_territory option:selected").text();
        if (typePres == "Master") {
            presTitle = presTitle + "_" + territoryPres;
        }
        if (presTitle != "") {

            var form = this;
            $.get(TWIG.isUniqueTitlePres, {name: presTitle}, function (R) {
                callback(R, form);
            });
            var callback = function (R, form) {
                if (R.success == true) {
                    for (var i = 0; i < localisation.length; i++) {
                        $("#form_pres").append("<input type='hidden' name='territories[]' value='" + localisation[i].idTerr + "'>");
                        $("#form_pres").append("<input type='hidden' name='campanies[]' value='" + localisation[i].idCamp + "'>");
                    }
                    form.submit();
                }
                else {
                    swal("Title must be unique");
                }
            };
        }

    });
    $(document).on('click', '.saveLoc', function () {
        $("#add_local").modal("hide");
    })

});