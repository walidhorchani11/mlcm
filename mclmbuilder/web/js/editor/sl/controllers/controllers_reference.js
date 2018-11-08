'use strict';

export const controllerReferences = {
    init: function (e) {
        this.editor = e,
            this.slidesChanged = new signals.Signal,
            this.List_id_ref_change = [],
            this.List_ValRef_change = [],
            this.List_linkedRef_changed = false,
            this.pSave,
            this.spanSave,
            this.textFieldSave,
            this.refId,
            this.textFieldSaveinput,
            this.ckeditor_config = {
                height: '80px',
                entities: true,
                basicEntities: true,
                toolbarGroups: [
                    { name: 'basicstyles', groups: [ 'Bold', 'Italic', 'Underline' ] },
                    { name: 'paragraph',   groups: [ 'list', 'indent', 'align' ] },
                    { name: 'links' },
                    { name: 'styles', item: [ 'Styles' ]  },
                    { name: 'colors' }
                ],
                on: {
                    change: function(evt) {
                        this.updateElement();
                    },
                    instanceReady : function(evt){
                        let id =$(this.container).attr('id');
                        $('#'+id).find('.cke_top').find('.cke_combo.cke_combo__styles.cke_combo_off').remove();
                        $('#'+id).find('.cke_top').find('.cke_combo.cke_combo__format.cke_combo_off').remove();
                    }
                }
            };
            this.setup()

    },
    setup: function () {
        this.linkToReferenceRefreshListner();
    },
    GetblockFocused: function (block) {
        this.blockFocused = block;
    },
    sortLinkedRef: function () {
        $('#tab-2 .linked-ref').each(function () {
            var $LinkedReference = $(this),
                alpha = [],
                number = [];
            $LinkedReference.find(' .item-ref').each(function () {
                var $itemReference = $(this),
                    alphaArr = [],
                    numArr = [];
                if ($.isNumeric($itemReference.find(".ref-code").attr('value')) == false) {
                    $itemReference.find(".ref-code").val($itemReference.find(".ref-code").attr('value'));
                    alphaArr.push($itemReference.find(".ref-code").attr('value'));
                    alphaArr.push($itemReference);
                    alpha.push(alphaArr);
                    alpha.sort();

                } else {
                    $itemReference.find(".ref-code").val($itemReference.find(".ref-code").attr('value'));
                    numArr.push($itemReference.find(".ref-code").attr('value'));
                    numArr.push($itemReference);
                    number.push(numArr);
                    number.sort(function sortEm(a, b) {
                        return parseInt(a) > parseInt(b) ? 1 : -1;
                    });
                }
            });
            for (var i = 0; i < alpha.length; i++) {
                $LinkedReference.append(alpha[i][1]);
            }
            for (var i = 0; i < number.length; i++) {
                $LinkedReference.append(number[i][1]);
            }

        });
    },
    TooltipRefView: function () {
        var TableauCodeLinkedRef = [];
        $(".ref-code").each(function () {
            $('.tooltip-ref').remove();
            TableauCodeLinkedRef.push($(this).val());
        });
        $(".ref-code").each(function (index) {
            if (!($.inArray($(this).val(), TableauCodeLinkedRef) == index)) {
                $('<div class="popover tooltip-ref fade left in" role="tooltip"><div class="arrow" style="top: 50%;"></div><h3 class="popover-title" style="display: none;"></h3><div class="popover-content"> Only character , number and * not repeated are allowed.</div></div>')
                    .appendTo($(this).parent());
            }
        });
        TableauCodeLinkedRef = [];
    },
    ToolTipRefEXclueNumber: function () {
        var TableauCodeLinkedRef = [];
        $(".ref-code").each(function () {
            $('.tooltip-ref').remove();
            TableauCodeLinkedRef.push($(this).val());
        });
        $(".ref-code").each(function (index) {
            if (!($.inArray($(this).val(), TableauCodeLinkedRef) == index)) {
                $('<div class="popover tooltip-ref fade left in" role="tooltip"><div class="arrow" style="top: 50%;"></div><h3 class="popover-title" style="display: none;"></h3><div class="popover-content">You cannot enter a number. Any repetition are not allowed.</div></div>')
                    .appendTo($(this).parent());
            }
        });
        TableauCodeLinkedRef = [];
    },
    DuplicationReferenceExist: function () {
        var TableauCodeLinkedRef = [],
            DuplicationExist = false;
        $(".ref-code").each(function () {
            $('.tooltip-ref').remove();
            TableauCodeLinkedRef.push($(this).val());
        });
        $(".ref-code").each(function (index) {
            if (!($.inArray($(this).val(), TableauCodeLinkedRef) == index)) {
                DuplicationExist = true;
            }

        });
        $(".ref-code").each(function () {
            var $this = $(this);
            if ($.isNumeric($this.val()) && !$.isNumeric($this.context.defaultValue)) {
                DuplicationExist = true;
            }

        });
        TableauCodeLinkedRef = [];
        return DuplicationExist;
    },
    listOflinkedRefByslide: function () {
        var $this = this,
            itemreferences = [],
            List_reference_id = [],
            List_reference_id_unique = [];
        $(Reveal.getCurrentSlide()).find(".ref").map(function () {
            var item = {};
            item["code"] = this.innerText;
            item["id"] = this.id;
            if (List_reference_id.indexOf(item.id) == -1) {
                List_reference_id.push(item.id);
                itemreferences.push(item);
            }
        });

        var listOfvaleurBySlide = $this.vallistOflinkedRefByslide();
        for (var i = 0; i < listOfvaleurBySlide.length; i++) {
            $.each(itemreferences, function (key, value) {
                if (value.code == listOfvaleurBySlide[i]) {
                    List_reference_id_unique.push(value.id);
                }

            });
        }
        return List_reference_id_unique;
    },
    vallistOflinkedRefByslide: function () {

        var all_reference_code = $(Reveal.getCurrentSlide()).find(".ref").map(function () {
            return this.innerText;
        }).get();

        var List_reference_val_unique = all_reference_code.filter(function (itm, i, all_reference_id) {
            return i == all_reference_code.indexOf(itm);
        });
        var alpha = [],
            number = [],
            tableautree = [];

        $(List_reference_val_unique).each(function (index, value) {
            if ($.isNumeric(value) == false) {
                alpha.push(value);
                alpha.sort();

            } else {
                number.push(value);
                number.sort(function sortEm(a, b) {
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                });
            }
        });

        tableautree = $.merge(alpha, number);
        return tableautree;
    },
    formaBaseReference: function (objet) {
        var ojectFinal = "";
        $.each(objet, function (index, value) {
            ojectFinal = ojectFinal + value + "#"
        });
        return ojectFinal;
    },
    uploadref: function () {
        var $id_References = $('.ref-opt'),
            $valeur_References = $('.ref-opt2'),
            $linked_References = $('#tab-2 .linked-ref');
        $id_References.html("");
        $valeur_References.html("");
        $linked_References.html("");
        $('#tab-2 .linked-ref').html("");

        var List_reference_id_unique = this.listOflinkedRefByslide();
        _.each(List_reference_id_unique, function (reference_id_unique) {
            var $slblock = $(Reveal.getCurrentSlide()).find(".sl-block");
            var inputvalueref = $slblock.find("#" + reference_id_unique).html();
            var titleRef = "";
            var descRef = "";
            if ($("#tab-1 .item-ref.sheet").length >= 1) {
                var idreflinked = reference_id_unique;
                var $sheet_reference = $("#tab-1 .item-ref.sheet#" + idreflinked);

                if ($($sheet_reference).attr('id') == reference_id_unique) {
                    titleRef = $($sheet_reference).find('.ref-title').html();
                    descRef = $($sheet_reference).find('.ref-desc').html();
                    $('#tab-2 .linked-ref').append('<div class="item-ref" id="' + idreflinked + '"><span class="title">' + titleRef + '</span><button class="btn btn-success btn-circle pull-right diss-ref"type="button"><i class="fa fa-link"></i></button><input type="text" class="pull-right m-xxs  ref-code" placeholder="" pattern="[A-Za-z*]" value="' + inputvalueref + '"  style="width: 30px; height: 30px">' + descRef + ' </div>');
                    $id_References.append(idreflinked + "#");
                    $valeur_References.append(inputvalueref + "#");
                }
            }
        });
        this.sortLinkedRef();
    },
    sortref: function () {
        $('.sl-block .ref-container').each(function () {
            var $conteneur_references = $(this),
                alpha = [],
                number = [];
            $conteneur_references.find('.ref').each(function () {
                var $reference = $(this),
                    alphaArr = [],
                    numArr = [];

                if ($.isNumeric($reference.text()) == false) {
                    alphaArr.push($reference.text());
                    alphaArr.push($reference);
                    alpha.push(alphaArr);
                    alpha.sort();

                } else {
                    numArr.push($reference.text());
                    numArr.push($reference);
                    number.push(numArr);
                    number.sort(function sortEm(a, b) {
                        return parseInt(a) > parseInt(b) ? 1 : -1;
                    });
                }
            });
            for (var i = 0; i < alpha.length; i++) {
                $conteneur_references.append(alpha[i][1]);
            }
            for (var i = 0; i < number.length; i++) {

                $conteneur_references.append(number[i][1]);
            }

        });
    },
    changeCodeReference: function ($input_code_ref, new_val_Reference) {
        $('.tooltip-ref').remove();
        var idreflinked = $input_code_ref.parent().attr('id');

        $input_code_ref.val(new_val_Reference);
        if (($.inArray(idreflinked, this.List_id_ref_change) == -1)) {
            this.List_id_ref_change.push(idreflinked);
            this.List_ValRef_change.push(new_val_Reference);
            this.List_linkedRef_changed = true;
        } else {
            for (var w = 0; w < this.List_id_ref_change.length; w++) {
                if ((this.List_id_ref_change[w]) == idreflinked) {
                    this.List_ValRef_change[w] = new_val_Reference;
                }
            }

        }
    },
    dissociationReference: function () {
        $(document).on("click", ".diss-ref", function () {
            var $Reference_diss = $(this).parent(),
                refdiss = $Reference_diss.attr('id');

            $(Reveal.getCurrentSlide()).find('.sl-block').find('#' + refdiss).remove();
            $('.reference-select option[value="' + refdiss + '"]').prop('selected', false);
            $Reference_diss.remove();

            var list_id_ref_link = $('.ref-opt').html(),
                split_list_id_ref_link = list_id_ref_link.split('#'),
                IndexValChange = split_list_id_ref_link.indexOf(refdiss),
                New_list_id_ref_link = $.trim(list_id_ref_link.replace(split_list_id_ref_link[IndexValChange] + "#", ""));

            $('.ref-opt').html(New_list_id_ref_link);

            var list_val_ref_link = $('.ref-opt2').html(),
                split_list_val_ref_link = list_val_ref_link.split('#'),
                New_list_val_ref_link = $.trim(list_val_ref_link.replace(split_list_val_ref_link[IndexValChange] + "#", ""));

            $('.ref-opt2').html(New_list_val_ref_link);

            setTimeout(function () {
                $(".references-ok").trigger("click");
                $(".references-list").trigger("click");
            }, 10);
        });
    },
    link_References_toList: function (List_reference_id_unique) {
        _.each(List_reference_id_unique, function (reference_id_unique) {
            var $slblock = $(Reveal.getCurrentSlide()).find(".sl-block"),
                inputvalueref = $slblock.find("#" + reference_id_unique).html(),
                titleRef = "",
                descRef = "";
            if ($("#tab-1 .item-ref.sheet").length >= 1) {
                var idreflinked = reference_id_unique,
                    $sheet_reference = $("#tab-1 .item-ref.sheet#" + idreflinked);
                if ($($sheet_reference).attr('id') == reference_id_unique) {
                    titleRef = $($sheet_reference).find('.ref-title').html();
                    descRef = $($sheet_reference).find('.ref-desc').html();
                    $('#tab-2 .linked-ref').append('<div class="item-ref" id="' + idreflinked + '"><span class="title">' + titleRef + '</span><button class="btn btn-success btn-circle pull-right diss-ref"type="button"><i class="fa fa-link"></i></button><input type="text" class="pull-right m-xxs  ref-code" placeholder="" pattern="[A-Za-z*]" value="' + inputvalueref + '"  style="width: 30px; height: 30px">' + descRef + ' </div>');
                }
            }
        });
    },
    filter_References: function () {
        let $this = this;
        var List_linked_ref = $this.listOflinkedRefByslide();
            _.each(List_linked_ref, function (reference_id_unique) {

                if ($("#tab-1 .item-ref.sheet").length >= 1) {
                    var $Nbre_reference = $("#tab-1 .item-ref.sheet#" + reference_id_unique).length;

                    if ($Nbre_reference == 0) {
                        $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + reference_id_unique).remove();
                    }
                }
            });
    },
    referenceUniquemultiVal: function (){
        let $this = this;
    var List_linked_ref = $this.listOflinkedRefByslide(),
        reference_multivaleur = false;
    _.each(List_linked_ref, function (reference_id_unique) {
        var all_reference_code = $(Reveal.getCurrentSlide()).find('.ref#'+reference_id_unique).map(function () {
            return this.innerText;
        }).get();
        var List_reference_val_unique = all_reference_code.filter(function (itm, i, all_reference_id) {
            return i == all_reference_code.indexOf(itm);
        });

        List_reference_val_unique.length > 1 ? reference_multivaleur = true:null;

    });
    return reference_multivaleur;

},
    unifyValrefernces : function(){
        let $this = this;
        var list_ofVal_ref = $('.ref-opt2').html().split("#"),
            List_linked_ref = $this.listOflinkedRefByslide();
        if (List_linked_ref.length != 0) {
            _.each(List_linked_ref, function (reference_id_unique, index) {
                $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + reference_id_unique).html(list_ofVal_ref[index]);
            });
            $this.sortref();
        }

    },
    stabilisationReferences: function () {
        var $this = this;
        $this.filter_References();
        var List_linked_ref = $this.listOflinkedRefByslide(),
            number_of_element = $('.ref-opt').html().split('#').length - 1;
        if (number_of_element != List_linked_ref.length && number_of_element > 0) {

            var $list_id_ref_init = $('.ref-opt'),
                $list_val_ref_init = $('.ref-opt2'),
                list_id_ref_init_split = $list_id_ref_init.html().split('#').filter(function (val) {
                    return val !== ''
                }),
                list_val_ref_init_split = $list_val_ref_init.html().split('#').filter(function (val) {
                    return val !== ''
                }),
                list_id_ref_final = $.merge(list_id_ref_init_split, $.map(List_linked_ref, function (a) {
                        return $.inArray(a, list_id_ref_init_split) >= 0 ? null : a;
                    })
                );

            var list_val_ref_num = jQuery.grep(list_val_ref_init_split, function (a) {
                    return $.isNumeric(a) && a > 0
                }),
                val_ref_max = Math.max.apply(Math, list_val_ref_num) + 1,
                length_decalage = list_id_ref_final.length - list_val_ref_init_split.length,
                val_elemin_decalge = [];
            for (var i = 0; i < length_decalage; i++) {
                val_elemin_decalge.push(val_ref_max);
                val_ref_max = val_ref_max + 1;
            }
            var list_val_ref_final = $.merge(list_val_ref_init_split, val_elemin_decalge)
            $list_id_ref_init.html($this.formaBaseReference(list_id_ref_final));
            $list_val_ref_init.html($this.formaBaseReference(list_val_ref_final));

            for (var w = 0; w < list_id_ref_final.length; w++) {
                if (list_id_ref_final[w] != "") {
                    $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + list_id_ref_final[w]).html(list_val_ref_final[w]);
                }
            }
            $this.List_linkedRef_changed = true;
        }
    },
    UpdateRefRang: function () {
        let $this = this;
        $this.filter_References();
        var List_linked_ref = $this.listOflinkedRefByslide(),
            number_of_element = $('.ref-opt').html().split('#').length - 1;

        if (TWIG.urlBase.indexOf('merck') == -1) {
            var references_liee = $this.listOflinkedRefByslide(),
                id_references_initial = $('.ref-opt').html().split('#'),
                val_references_initial = $this.vallistOflinkedRefByslide(),
                id_references_final = $.map(references_liee, function (a) {
                    return $.inArray(a, id_references_initial) < 0 ? null : a;
                }),
                tab_valeurs_Referenes = [],
                List_valeurs_Referenes = val_references_initial,
                compteur_ref_numerique = 0,
                id_references_change = [];

            for (var i = 0; i < List_valeurs_Referenes.length; i++) {
                if (!$.isNumeric(List_valeurs_Referenes[i])) {
                    tab_valeurs_Referenes.push(List_valeurs_Referenes[i]);
                } else {
                    if (List_valeurs_Referenes[i] == compteur_ref_numerique + 1) {
                        tab_valeurs_Referenes.push(List_valeurs_Referenes[i]);
                        compteur_ref_numerique++;
                    } else {
                        var val_ref_ajour = compteur_ref_numerique + 1;
                        id_references_change.push(id_references_final[i]);
                        tab_valeurs_Referenes.push(val_ref_ajour);
                        compteur_ref_numerique++;
                    }

                }
            }

            if (number_of_element != List_linked_ref.length) {
                if (List_linked_ref.length == tab_valeurs_Referenes.length) {
                    $('.ref-opt').html($this.formaBaseReference(List_linked_ref));
                    $('.ref-opt2').html($this.formaBaseReference(tab_valeurs_Referenes));
                    for (var w = 0; w < List_linked_ref.length; w++) {
                        if (List_linked_ref[w] != "") {
                            $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + List_linked_ref[w]).html(tab_valeurs_Referenes[w]);
                        }
                    }
                   $this.List_linkedRef_changed = true;
                }
            }else if( $this.referenceUniquemultiVal()){
                $this.unifyValrefernces();
            }
        } else {
            this.uploadref();
        }
    },
    Upload_Ref_slidechange: function () {
        let $this = this;
        Reveal.addEventListener('slidechanged', function (event) {
            var $change_ref= $('#ref-popt');
            $change_ref.siblings ('.ref-link.cancel-link').click();
            $this.uploadref();
        });
    },
    editReference: function(_this,$this){
        var itemReference = _this.parent(".item-ref");
        itemReference.find(".ref-save").show();
        itemReference.find(".cancel-link").show();
        itemReference.find(".ref-edit").hide();
        itemReference.find(".close-link").hide();
        $(".references-ok").hide();
        $(".item-ref").addClass("disabled");
        itemReference.removeClass("disabled");
        $this.pSave = itemReference.find(".ref-desc").html();
        $this.spanSave = itemReference.find("span.title").html();
        if(itemReference.find(".ref-desc").parents(".import-from-reveal").length == 0){
            itemReference.find(".ref-desc").replaceWith("<div class='import-from-reveal'><textarea id='edit-ref' name='edit-ref' class='import-input'>" + $this.pSave + "</textarea></div>");
        } else{
            itemReference.find(".import-from-reveal").html("<textarea id='edit-ref' name='edit-ref' class='import-input'>" + $this.pSave + "</textarea>");
        }
        itemReference.find("span.title").replaceWith("<input id='ref-popt' class='title-ref' value='" + $this.spanSave + "' />");

        _this.closest('.item-ref').find('#edit-ref').ckeditor($this.ckeditor_config);
    },
    saveReference: function(_this,$this){
        var itemReference = _this.parent(".item-ref"),
            idReference = itemReference.attr('id');

        itemReference.find(".ref-save").hide();
        itemReference.find(".cancel-link").hide();
        itemReference.find(".ref-edit").show();
        itemReference.find(".close-link").show();
        $(".references-ok").show();
        $(".item-ref").removeClass("disabled");
        $this.refId = itemReference.find(".refId").val();
        $this.textFieldSave = itemReference.find("textarea").val();
        _this.closest('.item-ref').find('#edit-ref').ckeditor().editor.destroy();
        itemReference.find("textarea").replaceWith("<div class='ref-desc'>" +$this.textFieldSave + "</div>");
        if(itemReference.find(".ref-desc").parent().is(".import-from-reveal")){
            itemReference.find(".ref-desc").unwrap();
        }
        $this.textFieldSaveinput = itemReference.find("input.title-ref").val();
        itemReference.find("input.title-ref").replaceWith("<span class='title ref-title'>" + $this.textFieldSaveinput + "</span>");
         var $linked_itemReference = $( "#tab-2 .item-ref#" + idReference);
        if( $linked_itemReference.length != 0) {
            $linked_itemReference.find("p").html("");
            $linked_itemReference.find("p").first().replaceWith($this.textFieldSave);
            $linked_itemReference.find("span").first().html($this.textFieldSaveinput);
        }
        $.ajax({
            type: "POST",
            data : {
                title       : $this.textFieldSaveinput,
                description : $this.textFieldSave,
                refId       : $this.refId
            },
            dataType: "html",
            url:TWIG.updateREF,
            cache:false,
            success: function(){
            }
        });
    },
    cancelEditReference: function(_this,$this){
        var itemReference =  _this.parent(".item-ref");
        $(".references-ok").show();
        $(".item-ref").removeClass("disabled");
        itemReference.find(".ref-save").hide();
        itemReference.find(".cancel-link").hide();
        itemReference.find(".ref-edit").show();
        itemReference.find(".close-link").show();
        _this.closest('.item-ref').find('#edit-ref').ckeditor().editor.destroy();
        itemReference.find("textarea").replaceWith("<div class='ref-desc'>" + $this.pSave + "</div>");
        if(_this.parent(".item-ref").find(".ref-desc").parent().is(".import-from-reveal")){
            itemReference.find(".ref-desc").unwrap();
        }
        itemReference.find("input.title-ref").replaceWith("<span class='title ref-title'>" + $this.spanSave + "</span>");
      },
    deleteReference: function(_this){
        var refDelete = _this.parent().attr('id'),
            cptLink = 0,
            item = _this.parent(".item-ref");
        $('.slides').find('.ref').each(function () {
           if ($(this).attr('id') == refDelete) {
                cptLink++;
            }
        });
        var url = _this.attr('data-href');
        if (cptLink > 0) {
            swal(
                'Notification',
                '“You can not delete this reference from your references sheet because it is already linked to a screen in your CLM presentation. Please, unlink this reference first than you will be able to delete it later”',
                'info'
            )
        } else {
            swal({
                    title: 'Are you sure, you want delete this reference',
                    text: 'Are you sure, you want delete this reference', type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function (isConfirm) {
                    if (!isConfirm) return;
                    $.ajax({
                        type: "POST",
                        url: url,
                        cache: false,
                        success: function () {
                            swal("Done!", "It was succesfully deleted!", "success");
                            item.remove();
                        }
                    });
                });
        }

    },
    update_createdReference:function(){
        /* Edit references */
        let $this = this,
            $document = $(document);

        $document.ready(function() {
            $('#reference_description').ckeditor($this.ckeditor_config);
        });

        $document.off("click", ".ref-edit").on("click", ".ref-edit", function () {
            var _this = $(this);
            $this.editReference(_this,$this);
        });
        $document.off("click", ".ref-save").on("click", ".ref-save", function(){
            var _this = $(this);
            $this.saveReference(_this,$this);
        });
        $document.off("click", ".cancel-link").on("click", ".cancel-link", function(){
            var _this = $(this);
            $this.cancelEditReference(_this,$this);
        });
        $document.on("click", ".close-link", function () {
         var _this = $(this);
            $this.deleteReference(_this);
        });
    },
    f1: function () {
        let $this = this;
        let $blockFocused = this.blockFocused;

        $('select.reference-select').change(function () {
            $blockFocused.has(".ref-container").length == 0 ? $blockFocused.append("<div class='ref-container'></div>") : null;
            $blockFocused.find("span.ref").each(function () {
                var idselected = $(this).attr('id');
                $('.reference-select option[value=" ' + idselected + ' "]').prop('selected', true);
                $('.selectpicker').selectpicker('refresh');
            });
            $blockFocused.find('.ref').remove();
            $('select.reference-select option:selected').each(function () {
                var $optionSelected = $(this),
                    $id_References = $('.ref-opt'),
                    $valeur_References = $('.ref-opt2');

                if ($id_References.text().indexOf($optionSelected.val()) == -1) {
                    $id_References.append($optionSelected.val() + "#");
                }
                var Data_id_References = $id_References.html(),
                    Split_id_References = Data_id_References.split('#');

                for (var ii = 0; ii < Split_id_References.length; ii++) {
                    if ((Split_id_References[ii]) == $optionSelected.val()) {

                        var valeur_Ref_possible = ii + 1,
                            Data_valeur_References = $valeur_References.html(),
                            Split_valeur_References = Data_valeur_References.split('#');

                        if (((TWIG.urlBase.indexOf('merck') == -1) && ($('.ref-opt2').text().indexOf(valeur_Ref_possible) == -1) && (Split_id_References.length == Split_valeur_References.length + 1)) || ((TWIG.urlBase.indexOf('merck') != -1) && Split_id_References.length == Split_valeur_References.length + 1)) {
                            var Valeur_ref_max = 0;
                            for (var i = 0; i < Split_valeur_References.length; i++) {
                                if (!isNaN(parseInt(Split_valeur_References[i]))) {
                                    if ((Valeur_ref_max < parseInt(Split_valeur_References[i]))) {
                                        Valeur_ref_max = parseInt(Split_valeur_References[i]);
                                    }
                                }
                            }
                            $('.ref-opt2').append(Valeur_ref_max + 1 + "#");
                        }
                    }
                }

                var Data_valeur_References = $valeur_References.html(),
                    Split_valeur_References = Data_valeur_References.split('#');

                for (var w = 0; w < Split_id_References.length; w++) {
                    if ((Split_id_References[w]) == $optionSelected.val()) {
                        $('.sl-block.is-focused:last .ref-container').append("<span class='ref' id=" + $optionSelected.val() + " >" + Split_valeur_References[w] + "</span>");
                        $this.sortref();
                    }
                }
            });
            $("#tab-2 .item-ref").remove();
            $this.List_linkedRef_changed = true;
         });
    },
    f2: function () {
        let $blockFocused = this.blockFocused;
        $('.selectpicker').selectpicker('refresh');
        if (this.blockFocused != undefined) {
            $blockFocused.find("span.ref").each(function () {
                var idselected = $(this).attr('id');
                $('.reference-select option[value="' + idselected + '"]').prop('selected', true);
            });
        }
    },
    f3: function () {
        let $this = this;
        $(document).on("click", ".references-ok", function () {
            if (!$this.DuplicationReferenceExist()) {

                for (var i = 0; i < $this.List_id_ref_change.length; i++) {
                    var idreflinked = $this.List_id_ref_change[i],
                        newcode_Ref = $this.List_ValRef_change[i],
                        List_idRef = $('.ref-opt').html(),
                        split_List_idRef = List_idRef.split('#'),
                        IndexOf_valRef_ajour = 0;
                    IndexOf_valRef_ajour = split_List_idRef.lastIndexOf(idreflinked);
                    var List_valRef = $('.ref-opt2').html(),
                        split_List_valRef = List_valRef.split('#'),
                        List_valRef_ajour = $.trim($('.ref-opt2').html().replace(split_List_valRef[IndexOf_valRef_ajour], newcode_Ref));
                    $('.ref-opt2').html("");
                    $('.ref-opt2').append(List_valRef_ajour);
                }
                if (TWIG.urlBase.indexOf('merck') == -1) {
                    var List_valeurs_Referenes = $('.ref-opt2').html(),
                        compteur_ref_numerique = 0,
                        tab_valeurs_Referenes = [];
                    for (var i = 0; i < List_valeurs_Referenes.split('#').length; i++) {

                        if (!$.isNumeric(List_valeurs_Referenes.split('#')[i])) {
                            tab_valeurs_Referenes.push(List_valeurs_Referenes.split('#')[i]);
                        } else {
                            if (List_valeurs_Referenes.split('#')[i] == compteur_ref_numerique + 1) {
                                tab_valeurs_Referenes.push(List_valeurs_Referenes.split('#')[i]);
                                compteur_ref_numerique++;
                            } else {
                                var val_ref_ajour = compteur_ref_numerique + 1;
                                tab_valeurs_Referenes.push(val_ref_ajour);
                                compteur_ref_numerique++;
                            }

                        }
                    }
                    var List_valeurs_Ref_ajour = "";
                    for (i = 0; i < tab_valeurs_Referenes.length - 1; i++) {
                        List_valeurs_Ref_ajour = List_valeurs_Ref_ajour + tab_valeurs_Referenes[i] + "#";
                    }
                    $('.ref-opt2').html("");
                    $('.ref-opt2').append(List_valeurs_Ref_ajour);

                    var List_id_reference = $('.ref-opt').html(),
                        split_List_id_reference = List_id_reference.split('#'),
                        split_List_valeurs_Ref_ajour = List_valeurs_Ref_ajour.split('#');
                    for (var w = 0; w < split_List_id_reference.length; w++) {
                        if (split_List_id_reference[w] != "") {
                            $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + split_List_id_reference[w]).html(split_List_valeurs_Ref_ajour[w]);
                        }
                    }
                    $this.sortref();
                    $this.List_id_ref_change = [];
                    $this.List_ValRef_change = [];

                } else {
                    var List_valeurs_Referenes = $('.ref-opt2').html(),
                        List_id_reference = $('.ref-opt').html(),
                        split_List_id_reference = List_id_reference.split('#'),
                        split_List_valeurs_Referenes = List_valeurs_Referenes.split('#');
                    for (var w = 0; w < split_List_id_reference.length; w++) {
                        if (split_List_id_reference[w] != "") {
                            $(Reveal.getCurrentSlide()).find(".sl-block .ref-container").find("#" + split_List_id_reference[w]).html(split_List_valeurs_Referenes[w]);
                        }
                    }
                    $this.List_id_ref_change = [];
                    $this.List_ValRef_change = [];
                    $this.sortref();
                }
                $this.sortLinkedRef();
            } else {
                if (TWIG.urlBase.indexOf('merck') == -1) {
                    $this.ToolTipRefEXclueNumber();
                } else {
                    $this.TooltipRefView();
                }
            }
            $this.uploadref();
        });
    },
    f4: function () {
        let $this = this;
        $(document).on("click", ".references-list:not(.active)", function () {
            $this.uploadref();
        });
        $(document).on("click", ".references-list", function () {
            $("#tab-2 p:empty").remove();
            if ($this.List_linkedRef_changed) {
                $('#tab-2 .linked-ref').html("");
                var List_reference_id_unique = $this.listOflinkedRefByslide();
                $this.link_References_toList(List_reference_id_unique);
                $this.sortLinkedRef();
                $this.List_linkedRef_changed = false;
            }

            $('#tab-2 .linked-ref .item-ref').find('.ref-code').on('input', function (e) {
                if (!$this.DuplicationReferenceExist()) {
                    if (TWIG.urlBase.indexOf('merck') == -1) {
                        var $input_code_ref = $(this),
                            exp_regulier_input_ref = new RegExp('[A-Za-z*]'),
                            new_val_Reference = $input_code_ref.val();

                        if (exp_regulier_input_ref.test(new_val_Reference) && !/\d/.test(new_val_Reference)) {
                            $this.changeCodeReference($input_code_ref, new_val_Reference);
                        } else {
                            let notification = '<div class="popover tooltip-ref fade left in" role="tooltip"><div class="arrow" style="top: 50%;"></div><h3 class="popover-title" style="display: none;"></h3><div class="popover-content">You can not enter a number into this field. Only character and * are allowed.</div></div>'
                            $(notification).appendTo($input_code_ref.parent());
                        }
                    } else {
                        var $input_code_ref = $(this),
                            exp_regulier_input_ref = new RegExp('[A-Za-z1-9*]'),
                            ValideUpdateRef = true,
                            TabRef = [],
                            new_val_Reference = $(this).val();

                        if (($.inArray($(this).val(), TabRef) == -1)) {
                            TabRef.push($(this).val());
                        } else {
                            ValideUpdateRef = false;
                        }
                        if (exp_regulier_input_ref.test(new_val_Reference) && ValideUpdateRef) {
                            $this.changeCodeReference($input_code_ref, new_val_Reference);
                        }
                        $this.TooltipRefView();
                    }
                } else {
                    $this.List_id_ref_change = [];
                    $this.List_ValRef_change = [];
                    if (TWIG.urlBase.indexOf('merck') == -1) {
                        $this.ToolTipRefEXclueNumber();
                    } else {
                        $this.TooltipRefView();
                    }
                }
            });
            $this.sortLinkedRef();

        });
    },
    linkToReferenceRefreshListner: function () {
        setTimeout(function () {
            this.update_createdReference();
            this.Upload_Ref_slidechange();
            this.uploadref();
            this.dissociationReference();
            this.f4();
            this.f3();
        }.bind(this), 20);
    },
    linkToReferenceListner: function () {
        setTimeout(function () {
            this.f2();
            this.f1();
        }.bind(this), 10);

    }
};