'use strict';

export const controllerAddtext = {
    init: function (e) {
        this.editor = e,
            this.slidesChanged = new signals.Signal,
            this.ckeditor_config_subSection = {
                entities: true,
                basicEntities: true,
                entities_greek: true,
                entities_latin: true,
                toolbarGroups: [
                    {name: 'basicstyles', groups: ['Bold', 'Italic', 'Underline']},
                    {name: 'paragraph', groups: ['list', 'indent', 'align']},
                    {name: 'links'},
                    {name: 'styles', item: ['Styles']},
                    {name: 'colors'}
                ],
                on: {
                    change: function () {
                        this.updateElement();
                    },
                    instanceReady: function (evt) {
                        let id = $(this.container).attr('id');
                        $('#' + id).find('.cke_top').find('.cke_combo.cke_combo__styles.cke_combo_off').remove();
                        $('#' + id).find('.cke_top').find('.cke_combo.cke_combo__format.cke_combo_off').remove();
                    }
                }
            },
            this.html = '',
            this.setup()
    },
    setup: function () {
        this.AddtextListner();
    },
    SupSubsection: function () {
        $('.add_subsection').each(function () {
            let $this = $(this);
            if ($this.attr('id') == $('section.present').attr('data-id')) {
                $(Reveal.getCurrentSlide()).find('.block-AdditionalText').text("");
                $this.text("");
            }
        });
        document.getElementById('remove').style.display = 'none';
        document.getElementById('create').style.display = '';
    },
    CloseEditor: function () {
        if (CKEDITOR.instances.editor1 != undefined) {
            var SubsectionCourant = null;
            $('.add_subsection').each(function () {
                let $this = $(this);
                if ($this.attr('id') == $('section.present').attr('data-id')) {
                    SubsectionCourant = $this;
                }
            });
            var obj_SubsectionCourant = $(SubsectionCourant);
            obj_SubsectionCourant.find('.save-addit').css('display', 'none');
            obj_SubsectionCourant.find('.cancel-additional').css('display', 'none');
            obj_SubsectionCourant.find('.close-additional2').css('display', '');
            obj_SubsectionCourant.find('.additional-edit2 ').css('display', '');
            CKEDITOR.instances.editor1.destroy();
        }
    },
    EditSubsection: function () {
        var SubsectionCourant = null;
        $('.add_subsection').each(function () {
            let $this = $(this);
            if ($this.attr('id') == $('section.present').attr('data-id')) {
                SubsectionCourant = $this;
            }
        });
        var obj_SubsectionCourant = $(SubsectionCourant);
        obj_SubsectionCourant.find('.save-addit').css('display', '');
        obj_SubsectionCourant.find('.cancel-additional').css('display', '');
        obj_SubsectionCourant.find('.close-additional2').css('display', 'none');
        obj_SubsectionCourant.find('.additional-edit2 ').css('display', 'none');
        this.html = obj_SubsectionCourant.find('.additional-desc').html();
        CKEDITOR.replace('editor1', this.ckeditor_config_subSection, this.html);
        CKEDITOR.instances.editor1.setData(this.html);
    },
    createEditor: function () {
        this.html = "";
        CKEDITOR.replace('editor1', this.ckeditor_config_subSection, this.html);
        CKEDITOR.instances.editor1.setData(this.html);
        var SubsectionCourant = null;
        $('.add_subsection').each(function () {
            let $this = $(this);
            if ($this.attr('id') == $('section.present').attr('data-id')) {
                SubsectionCourant = $this;
            }
        });
        if ($(SubsectionCourant).find('.additional-desc').text() == "") {
            document.getElementById('remove').style.display = '';
        }
        document.getElementById('create').style.display = 'none';
    },
    removeEditor: function () {

        if (CKEDITOR.instances.editor1 != undefined) {
            var html = CKEDITOR.instances.editor1.getData(),
                $curent_slide = $(Reveal.getCurrentSlide());
            if (html != "") {
                $('.add_subsection').each(function () {
                    let $this = $(this);
                    if ($this.attr('id') == $('section.present').attr('data-id')) {
                        $this.remove();
                    }
                });
                $curent_slide.find('.block-AdditionalText').remove();
                $curent_slide.append('<div class=\'block-AdditionalText\' style="display:none;" >' + html + '</div>');
                $('.import-Subsection').append('<div class=\'add_subsection\' id=' + $('section.present').attr('data-id') + '><div class=\'icons-addit\'><a class="close-additional2 pull-right" onclick="SL.editor.controllers.Addtext.SupSubsection()" style="margin-left:10px ;">' +
                    '<i class=\'fa fa-trash\'></i></a><a class="additional-edit2 pull-right" onclick="SL.editor.controllers.Addtext.EditSubsection()"  style=\'margin-left:10px;\'>' +
                    '<i class=\'fa fa-edit\'></i></a><a class="cancel-additional pull-right" onclick="SL.editor.controllers.Addtext.CloseEditor()" style=\'margin-left:10px;display: none;\'>' +
                    '<i class=\'fa fa-close\'></i></a><a class="save-addit pull-right"  onclick="SL.editor.controllers.Addtext.removeEditor()" style=\'margin-left:10px;display: none;\'>' +
                    '<i class =\'fa fa-save\'></i></a> <div class="additional-desc">' + html + '</div></div></div>');
            } else {
                document.getElementById('create').style.display = '';
            }

            document.getElementById('remove').style.display = 'none';
            CKEDITOR.instances.editor1.destroy();
        }

    },
    f1: function () {
        var $this = SL.editor.controllers.Addtext;
        $(document).on("click", ".references-list", function () {
            if (TWIG.urlBase.indexOf('merck') != -1) {
                $this.CloseEditor();
                var compt = 0;
                if ($(Reveal.getCurrentSlide()).find('.block-AdditionalText').text() != "") {
                    $('.import-Subsection').html('<div class=\'add_subsection\' id=' + $('section.present').attr('data-id') + '><div class=\'icons-addit\'><a class=\'close-additional2 pull-right\' onclick="SL.editor.controllers.Addtext.SupSubsection()" style="margin-left:10px ;">' +
                        '<i class=\'fa fa-trash\'></i></a><a class=\'additional-edit2 pull-right\' onclick="SL.editor.controllers.Addtext.EditSubsection();"  style=\'margin-left:10px;\'>' +
                        '<i class=\'fa fa-edit\'></i></a><a class=\'cancel-additional pull-right\' onclick="SL.editor.controllers.Addtext.CloseEditor()" style=\'margin-left:10px;display: none;\'>' +
                        '<i class=\'fa fa-close\'></i></a><a class=\'save-addit pull-right\'  onclick="SL.editor.controllers.Addtext.removeEditor()" style=\'margin-left:10px;display: none;\'>' +
                        '<i class =\'fa fa-save\'></i></a> <div class=\'additional-desc\'><p>' + $(Reveal.getCurrentSlide()).find('.block-AdditionalText').html() + '</p></div></div></div>');
                    compt++;
                }
                else
                    compt = 0;

                $('.add_subsection').each(function () {

                    if ($(this).attr('id') == $('section.present').attr('data-id')) {
                        $(this).css("display", "block");
                    } else {
                        $(this).css("display", "none");
                    }
                });
                if (compt == 0) {
                    $('.add_subsection').html('');
                    document.getElementById('create').style.display = '';
                    document.getElementById('remove').style.display = 'none';

                } else {
                    document.getElementById('create').style.display = 'none';
                    document.getElementById('remove').style.display = 'none';

                }
            }
        });
        $(document).on("click", ".references-ok", function () {
            if (TWIG.urlBase.indexOf('merck') != -1) {
                $this.removeEditor();
            }
        });
    },
    AddtextListner: function () {
        this.f1();
    }
};