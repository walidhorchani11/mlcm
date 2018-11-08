$(document).ready(function(){


    /***Menu left 'nav bar'****/

    if ($( "#side-menu li" ).hasClass( "current_ancestor")) {
        $('#side-menu li.current_ancestor ul.nav-second-level.menu_level_1').collapse("show");
    }

    $('.function-input').on( 'keyup change', function () {
        var i = $('.popup-columns').attr("data-column");
        table_project.column( i )
            .search( $(this).val() )
            .draw();
    });

    /**************js confirm delete Product******************/
    $('#product_table tbody').on('click', 'td.action .delete-product', function () {
        var url = $(this).attr('data-href');
        swal({
                title: TWIGProduct.deleteproduct,
                text: TWIGProduct.deleteproducttext,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });

    /**************js confirm delete company******************/

    //$('#dataTables-companies tbody').on('click', 'td.action .delete-company', function () {


    $('.active-project').click(function () {
        var url = $(this).attr('data-href');

        swal({
                title: TWIG.activeproject,
                text: TWIG.activeproject,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, active it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });

    $('.archive-project').click(function () {
        var url = $(this).attr('data-href');

        swal({
                title: TWIG.archiveproject,
                text: TWIG.archiveproject,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });
    $('.approved').click(function () {
        var url = $(this).attr('data-href');

        swal({
                title: TWIG.approvedpres,
                text: TWIG.approvedpres,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, approve it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });

    $('.disconnect_pres').click(function () {
        var url = $(this).attr('data-href');

        swal({
                title: TWIG.disconnect,
                text: TWIG.disconnectCancel,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, disconnect it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });

    $('.delete_pres').click(function () {
        var url = $(this).attr('data-href');

        swal({
                title: TWIG.deletepres,
                text: TWIG.deletepres,         type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function () {
                document.location.href = url;
            });
    });

    /*********************** Remove Media *********************************/

    $(document).on('click', '.media-remove', function () {
        var url = $(this).attr('data-href');
        var type = $(this).attr('data-type');
        var idmedia = $(this).attr('data-id');
        var flag = $(this).attr('data-flag');
        if(flag ==10){
            var title = "Are you sure do you want to delete this media ?";
            var text = 'Are you sure do you want to delete this media ?';
            swal({
                    title: title,
                    text: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function () {
                    swal.close();
                    $(document).find('.removeMedia-'+idmedia).hide();
                    $.get(url,{id:idmedia},function(R){
                        //document.location.href = url;
                    })
                });
        }else {
            var title = "This media is already integrated into a CLM presentation, are you sure you want to delete it?";
            var text  = "Here is your presentation where your media is inserted : " + "<br>";
            //  text += " presentation Name  </br><table>";
            var text1 = '';
            $.get(TWIG.urlGetPres, {id:idmedia, type:type}, function(R){
                for (var i = 0; i < R.length; i++) {
                    text1 = '<span class="Mypres-title">' + "<tr>" + R[i] + "</tr>" + '</span>';
                    text = text + text1;// console.log(R[i]);
                }
                swal({
                        title: title,
                        text: text,
                        html: true,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        closeOnConfirm: false
                    },
                    function () {
                        $.get(url,{id:idmedia},function(R){

                            $(document).find('.removeMedia-'+idmedia).hide();
                            swal.close();
                            //document.location.href = url;
                        })
                    });


            })

        }

    });
    /*********************** is unique project name ********************/

    $("#form_project").submit(function(e){
        e.preventDefault();
        var projectTitle = $("#create_project_name").val();
        if(projectTitle !="") {
            var  form =this;
            $.get(TWIG.isUniqueTitle, {name: projectTitle}, function (R) {
                callback(R, form);
            });
            var callback = function(R, form){
                if(R.success == true) {
                    form.submit();
                }
                else {
                    swal("Title must be unique");
                }
            };
        }


    });

    /*********************** Replace Media *********************************/

    /**************** Add localisation roject view*********************/
    $(document).on('click','.addLocal',function(){

        var idPres  = $(this).attr('id');
        var idComp  = $(this).attr('data-comp');
        $.get(urlCompanyTerritory, {
            idCompany: idComp
        }, function(Resp) {

            for (var k = 0; k < Resp.listCompany.length; k++) {

                if (Resp.listCompany[k].id != idComp) {
                    $(".companyLoc").append("<option value=" + Resp.listCompany[k].id + ">" + Resp.listCompany[k].name + "</option>");
                }
            }
        });
        $("#add_local"+idPres).modal("show");
    });

    /******************** fin **************************/
    /****   date picker inti() */
    $('.date-picker-bootstrap').datepicker({
        format: 'yyyy-mm-dd'
    });
    /****   date picker inti() */
    /******************************* Test mode edit before redirect ***************/
    $(document).on('click', '.edit_pres', function(){

        var urlModeEdit = $(this).attr('data-href');
        var idPres = $(this).attr('data-id');
        $.get(TWIG.urlTestModeEdit, {idPres:idPres}, function(Response){
            if(Response.modeEdit == false){
                document.location.href = urlModeEdit;
            }else{
                swal(
                    'Notification',
                    '“This presentation is actualy used by another user”',
                    'info'
                )
            }
        })
    })

    $(document).on('click', '.test_mode_edit', function(){
        var url = $(this).attr('data-href');
        var idPres = $(this).attr('data-id');
        $.get(TWIG.urlTestModeEdit, {idPres:idPres}, function(Response){
            if(Response.modeEdit == false){
                document.location.href = url;
            }else{
                swal(
                    'Notification',
                    '“This presentation is actualy used by another user”',
                    'info'
                )
            }
        })
    })
    /********************************* end mode edit test ******************************************/
    /**************  diplicate pres  ***********************/
    $(document).on('click','.pres-duplicate' , function () {
        var url = $(this).attr('data-href');
        var idPres = $(this).attr('data-id');
        $.get(TWIG.urlTestModeEdit, {idPres:idPres}, function(Response){
            if(Response.modeEdit == false){
                swal({
                        title: TWIG.sweetAlert.duplicateTitle,
                        text:  TWIG.sweetAlert.duplicateText,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, duplicate it!",
                        closeOnConfirm: false
                    },
                    function () {
                        document.location.href = url;
                    });
            }else{
                swal(
                    'Notification',
                    '“This presentation is actualy used by another user”',
                    'info'
                )
            }
        })

    });
    /********************* end *********************************/
    /********************* get te value of input ***************/
    $('.fileinput[data-provides="fileinput"] input[type="file"]').on('change', function () {
        var value = $(this).val();
        var filename = value.replace(/C:\\fakepath\\/i, '');
        if (value !== ""){
            $('.valueOfFile').html(filename);
        }else {
            $('.valueOfFile').empty();
        }
    });
    /********************* get te value of input ***************/
});
