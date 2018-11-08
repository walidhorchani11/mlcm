/*
(function() {
    jQuery(document).ready(function($) {

      /!*  function InitMenuEditor() {
            if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") == undefined || SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") == "") {
                $(".hide-menu").each(function (index, elm) {
                    if ($(this).is(".hide-menu")) {
                        $(this).removeClass("hide-menu");
                    }
                });
            }
            else if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != "") {
                switch (SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance")) {

                    case "standard":
                        $(".hide-menu").each(function (index, elm) {
                            if ($(this).is(".hide-menu")) {
                                $(this).removeClass("hide-menu");
                            }
                        });
                        break;
                    case "Hide-all":
                        $("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
                        break;
                    case "Hide-chapters":
                        $("#wrapperMenuScroll").is(".hide-menu") ? $("#wrapperMenuScroll").removeClass("hide-menu") : null;
                        $(".menu").is(".hide-menu") == false ? $(".menu").addClass("hide-menu") : null;
                        $(".wrapper-submenu").is(".hide-menu") == false ? $(".wrapper-submenu").addClass("hide-menu") : null;
                        break;
                }
            }
            else {
                SL.editor.controllers.Markup.getCurrentSlide().find(".hide-menu").each(function (index, elm) {
                    if ($(this).is(".hide-menu")) {
                        $(this).removeClass("hide-menu");
                    }
                });
            }
            if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != "") {
                var optionVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance");
                $("#custom-navbar-appearance").val(optionVal).change();
            }
            else {
                $("#custom-navbar-appearance").val("standard").change();
            }
            $(".maxMenu").css("width", '681px');
        }*!/
        /!*Reveal.addEventListener('slidechanged', function(event) {
            $('#ref-popt').siblings ('.ref-link.cancel-link').click();
           // InitMenuEditor();
        });*!/
      /!*  setTimeout(function(){
          InitMenuEditor();
        }, 300);
        $(document).on("click", ".btn-add-ref button", function() {
            $('#reference_title').focus();
        });*!/
/!*
        $(document).off("click", ".clickMenu").on("click", ".clickMenu", function(e) {
            e.preventDefault();
            console.log("clique menu");
            var h = $(this).parent().attr('data-slide-h');
            var v = $(this).parent().attr('data-slide-v');
            Reveal.slide(h - 1, v);

            /!* Scroll active menu swiping *!/
            /!*var clickMenuIndex = SL.editor.controllers.Markup.getCurrentSlide().find(".current").index(),
             clickMenuScreenId = SL.editor.controllers.Markup.getCurrentSlide().find(".menu .current").length > 0 ? SL.editor.controllers.Markup.getCurrentSlide().find(".menu").attr("id") : SL.editor.controllers.Markup.getCurrentSlide().find(".wrapper-submenu").attr("id"),
             clickMenuScreenIndexof = generatedIdMenu.indexOf(clickMenuScreenId);

             //console.log(clickMenuScreenId + " / " + clickMenuScreenIndexof);
             //console.log("clickMenuIndex: " + clickMenuIndex + " / clickMenuScreenIndexof:" + clickMenuScreenIndexof);
             setTimeout(function(){
             scrollHMenu[clickMenuScreenIndexof].scrollToElement('li:nth-child(' + clickMenuIndex + ')', 1000);
             }, 300);*!/
        });
*!/

    });

})();*/
