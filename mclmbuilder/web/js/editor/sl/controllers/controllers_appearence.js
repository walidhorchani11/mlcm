'use strict';

export const controllerappearence = {

    init: function (e) {
        this.document                       = $(document),
            this.basePath                       = window.location.origin,
            this.editor                         = e || {},
            this.sidebar                        = $('.sidebar'),
            this.panelElement                   = $(".sidebar-panel"),
            this.jsonParameters                 = TWIG.parameters,
            this.btnStyleParameters             = this.sidebar.find('button.btn-clm-parameters.style'),
            this.btnScreenParameters            = this.sidebar.find('button.btn-screen-parameters.settings'),
            this.btnZipSizeLimitAlert           = this.sidebar.find('button.zipLimit'),
            this.cancelSettings                 = this.panelElement.find('.settings-clm.style button.cancel'),
            this.saveSettings                   = this.panelElement.find('.settings-clm.style button.save'),
            this.saveScreenSettings             = this.panelElement.find('.settings.screen-parameters .button.save')
            this.cancelScreenSettings           = this.panelElement.find('.settings.screen-parameters .button.cancel')
            this.parameters                     = $('.parameters #params_clm_edidtor'),
            this.zipSizeLimitAlert              = $('#zip_size_alert'),
            this.currentSlide                   = Reveal.getCurrentSlide,
            // editor parameters
            this.logoPresURL                    = this.jsonParameters.dataLogoPresUrl,
            this.bgRefOverlayColor              = this.jsonParameters.dataBgRefOverlaycolor,
            this.imgBtnClose                    = this.jsonParameters.dataBgBtnClose,
            this.bgPresColor                    = this.jsonParameters.dataBgPresColor,
            this.bgPresImg                      = this.jsonParameters.dataBgPresImg,
            this.bgPresSize                     = $('#bg-size-pres option:selected').val();
            this.menuBgColor                    = this.jsonParameters.dataBgMenuColor,
            this.currentItemColor               = this.jsonParameters.dataCurrentItemColor,
            this.menuColorItem                  = this.jsonParameters.dataFontMenuColor,
            this.menuFont                       = this.jsonParameters.dataMenuFont,
            this.menuFontName                   = this.jsonParameters.dataMenuFontname,
            this.menuFontSize                   = this.jsonParameters.dataFontSizeSelect,
            this.allowSubMenu                   = this.jsonParameters.dataAllowSubmenu,
            this.fullWideSubmenu                = this.jsonParameters.dataAllowSubmenuwidth,
            this.highlightMenu                  = this.jsonParameters.dataHighlightMenu,
            this.logoHome                       = this.jsonParameters.dataLogoHomeUrl,
            this.logoRefsUrl                    = this.jsonParameters.dataLogoRefrsUrl,
            this.logoRcpUrl                     = this.jsonParameters.dataLogoRcpUrl,
            this.popupWidth                     = this.jsonParameters.dataPopupWidth,
            this.popupHeight                    = this.jsonParameters.dataPopupHeight,
            this.colorBgPopup                   = this.jsonParameters.dataBgPopupColor,
            this.bgPopupImg                     = this.jsonParameters.dataBgPopupImg,
            this.textRefColor                   = this.jsonParameters.dataTextRefColor,
            this.refWidth                       = this.jsonParameters.dataRefWidth,
            this.refHeight                      = this.jsonParameters.dataRefHeight,
            this.fontReference                  = this.jsonParameters.dataMenuFontTitleRef ,
            this.fontNameReference              = this.jsonParameters.dataMenuFontNameTitleRef,
            this.titleReference                 = this.jsonParameters.dataTitleRefContent,
            this.fontSizeTitleReference         = this.jsonParameters.dataFontSizeTitleRef,
            this.fontSizeRefContent             = this.jsonParameters.dataFontSizeRefContent,
            this.bgRefColor                     = this.jsonParameters.dataBgRefColor,
            this.bgRefImg                       = this.jsonParameters.dataBgRefImg,
            this.disableScroll                  = this.jsonParameters.dataDisableScroll,
            this.bgClosesize                    = this.jsonParameters.dataBgCloseSize,
            this.logoPresSize                   = this.jsonParameters.dataLogoPresSize,
            this.bgPresImgSize                  = this.jsonParameters.dataBgPresSize,
            this.logoHomeSize                   = this.jsonParameters.dataLogoHomeSize,
            this.logoRcpSize                    = this.jsonParameters.dataLogoRcpSize,
            this.logoRefrsSize                  = this.jsonParameters.dataLogoRefrsSize,
            this.bgPopupSize                    = this.jsonParameters.dataBgPopupSize,
            this.bgRefImgSize                   = this.jsonParameters.dataBgRefSize,
            //panel element
            this.presesntationLogo              = this.panelElement.find('#logo_pres_upload'),
            this.closeBtn                       = this.panelElement.find('#bg_btn_close'),
            this.presentationBgBtn              = this.panelElement.find('#bg_pres_upload'),
            this.imgHomeLogoBtn                 = this.panelElement.find('#logo_home_upload'),
            this.imgRefLogoBtn                  = this.panelElement.find('#logo_ref_upload'),
            this.imgRcpBtn                      = this.panelElement.find('#logo_rcp_upload'),
            this.bgPopupBtn                     = this.panelElement.find('#bg_popup_upload'),
            this.bgRefImgBtn                    = this.panelElement.find('#bg_ref_upload'),
            this.bgScreenImgBtn                 = this.panelElement.find('#bg_screen_upload'),
            this.baseUrl                        = TWIG.urlBase,
            this.defaultValuePopupWidth         = "600",
            this.minValuePopupWidth             = "300",
            this.maxValuePopupWidth             = "1024",
            this.defaultValuePopupHeight        = "400",
            this.minValuePopupHeight            = "300",
            this.maxValuePopupHeight            = "768",
            this.setup(), this.bind()
    },
    setup: function () {
        this.ScreenSetup();
        this.settingsSetup();
        setTimeout(function () {
            SL.editor.controllers.Menu.updateCreatedMenu();
            this.renderParamaters()
        }.bind(this), 50);
        Reveal.addEventListener('slidechanged', function (event) {
            if (!$('.reveal.slide').hasClass('overview')){
                SL.editor.controllers.Menu.highlightActiveMenu();
                SL.editor.controllers.Menu.navbarAppearance();
                SL.editor.controllers.Menu.setScrollToMenu();
                SL.editor.controllers.Menu.scrollToMenuElm();
                this.renderParamaters();
                this.ScreenSetup();
            }
            this.zipSizeLimitAlert.fadeOut()
        }.bind(this));
        let fontJson  = {
                "data": [
                    {"name": "merck"},
                    {"name": "futura"},
                    {"name": "proximanova"},
                    {"name": "proximanovabold"},
                    {"name": "proximanovasemibold"},
                    {"name": "merckbold"},
                    {"name": "merckpro"},
                    {"name": "rajdhanibold"},
                    {"name": "RajdhaniRegular"},
                    {"name": "RajdhaniMedium"},
                    {"name": "RajdhaniSemiBold"},
                    {"name": "RajdhaniLight"},
                    {"name": "FuturaBTMediumItalic"},
                    {"name": "FuturaBTMedium"},
                    {"name": "EagleBook"},
                    {"name": "UniversLTStdBoldCn"},
                    {"name": "WhitneyBold"},
                    {"name": "WhitneyBoldItalic"},
                    {"name": "WhitneyBook"},
                    {"name": "WhitneyBookItalic"},
                    {"name": "WhitneyMedium"},
                    {"name": "WhitneyMediumItalic"},
                    {"name": "WhitneySemiblod"},
                    {"name": "WhitneySemiboldItalic"},
                    {"name": "FuturaBTCondMedium"},
                    {"name": "AvenirBlack"},
                    {"name": "AvenirLight"},
                    {"name": "AvenirLightOblique"},
                    {"name": "AvenirMedium"},
                    {"name": "RotisSansSerifStdBold"},
                    {"name": "RotisSansSerifStdExtraBold"},
                    {"name": "RotisSansSerifStdItalic"},
                    {"name": "RotisSansSerifStdLight"},
                    {"name": "RotisSansSerifStdLightItalic"},
                    {"name": "RotisSansSerifStdRegular"},
                    {"name": "GilroySemiBold"},
                    {"name" :"GilroySemiBoldItalic"},
                    {"name": "GilroyRegular"},
                    {"name": "GilroyRegularItalic"},
                    {"name": "GilroyMediumItalic"},
                    {"name": "GilroyMedium"},
                    {"name": "GilroyLightItalic"},
                    {"name": "GilroyLight"},
                    {"name": "GilroyBoldItalic"},
                    {"name": "GilroyBold"},
                    {"name": "avenirHeavy"},
                    {"name": "arialBoldItalic"},
                    {"name": "arialBold"},
                    {"name": "arialItalic"},
                    {"name": "RobotoBlack"},
                    {"name": "RobotoBlackItalic"},
                    {"name": "RobotoBold"},
                    {"name": "RobotoBoldCondensed"},
                    {"name": "RobotoBoldCondensedItalic"},
                    {"name": "RobotoBoldItalic"},
                    {"name": "RobotoCondensed"},
                    {"name": "RobotoCondensedItalic"},
                    {"name": "RobotoItalic"},
                    {"name": "RobotoLight"},
                    {"name": "RobotoConRobotoLightItalicdensed"},
                    {"name": "RobotoMedium"},
                    {"name": "RobotoMediumItalic"},
                    {"name": "RobotoRegular"},
                    {"name": "RobotoThin"},
                    {"name": "RobotoThinItalic"}
                ]
            },
            futuraFonts = {
                "data": [
                    {"name": "FuturaBdCn"},
                    {"name": "FuturaBlackBold"},
                    {"name": "futuraBold"},
                    {"name": "futuraBoldItalic"},
                    {"name": "futuraBoldRegular"},
                    {"name": "futuraBook"},
                    {"name": "futuraBookItalic"},
                    {"name": "futuraExtraBlack"},
                    {"name": "futuraExtraBlackItalic"},
                    {"name": "futuraHeavy"},
                    {"name": "futuraHeavyItalic"},
                    {"name": "futuraLightBT"},
                    {"name": "futuraLightItalic"},
                    {"name": "futuraLtCnLight"},
                    {"name": "futuramediumBt"},
                    {"name": "futuraMediumItalic"},
                    {"name": "futuraMediumMdCn"}
                ]
            };

        if (this.baseUrl.indexOf('merck') == -1){
            $(document).on('vclick', function () {
                $("#menu-font option , #menu-font-ref option").each(function () {
                    let t = $(this);
                    for (let x = 0; fontJson.data.length > x; x++) {
                        if (t.attr('data-font') == fontJson.data[x].name) {
                            t.remove();
                        }
                    }
                });
            }.bind(this));
        }
        $(document).on('vclick', function () {
            $("#menu-font option , #menu-font-ref option").each(function () {
                let t = $(this);
                for (let x = 0; futuraFonts.data.length > x; x++) {
                    if (t.attr('data-font') == fontJson.data[x].name) {
                        t.remove();
                    }
                }
            });
        }.bind(this));

    },
    bind: function () {
        this.openMediaLibrary();
        this.deleteBgData();
        this.changeSelectListner();
        this.cancelSettings.on('vclick', function () { this.cancelParametersListner() }.bind(this)),
            this.btnStyleParameters.on('vclick', function () { this.cancelParametersListner() }.bind(this)),
            this.cancelScreenSettings.on('vclick', function () { this.resetScreenSettings() }.bind(this)),
            this.btnScreenParameters.on('vclick', function () { this.resetScreenSettings() }.bind(this)),
            this.saveSettings.on('vclick', function () { this.saveParametersListner() }.bind(this)),
            this.saveScreenSettings.on('vclick', function () { this.saveScreenParametersListner() }.bind(this)),
            this.editor.addHorizontalSlideButton.on('vclick', function () { this.duplicateSlide() }.bind(this)),
            this.editor.addVerticalSlideButton.on('vclick', function () { this.duplicateSlide() }.bind(this)),
            this.btnZipSizeLimitAlert.on('vclick', function () { this.zipSizeLimitAlert.fadeToggle() }.bind(this))
    },
    settingsSetup: function () {
        $("#bg-ref-overlay-color").spectrum({
            showAlpha: true,
            color: this.bgRefOverlayColor == "" && this.bgRefOverlayColor == undefined ? "#0000ff" : this.bgRefOverlayColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.bgRefOverlayColor = color.toRgbString();
            },
            change: function (color) {
                this.bgRefOverlayColor = color.toRgbString();
            }
        });
        $("#bg-pres-color").spectrum({
            showAlpha: true,
            color: this.bgPresColor == "" && this.bgPresColor == undefined ? "#ffffff" : this.bgPresColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.bgPresColor = color.toRgbString();
                let presColor = this.bgPresColor;

                $(".slides section").each(function () {
                    var slide = $(this);
                    if (!slide.is('.popin')) {
                        if (slide.attr('data-bg-screen-color') == undefined || slide.attr('data-bg-screen-color') == "") {
                            //slide.css("background-color", presColor);
                            slide.attr('data-background-color', presColor);
                        }
                    }
                    Reveal.sync();
                });
            },
            change: function (color) {
                this.bgPresColor = color.toRgbString();
                let presColor = this.bgPresColor;
                $(".slides section").each(function () {
                    var slide = $(this);
                    if (!slide.is('.popin')) {
                        if (slide.attr('data-bg-screen-color') == undefined || slide.attr('data-bg-screen-color') == "") {
                            //slide.css("background-color", presColor);
                            slide.attr('data-background-color', presColor)
                        }
                    }
                    Reveal.sync();
                });
            }
        });
        $("#bg-menu-color").spectrum({
            showAlpha: true,
            color: this.menuBgColor == "" && this.menuBgColor == undefined ? "#4a5667" : this.menuBgColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.menuBgColor = color.toRgbString();
                $(".edit-pres-wrap .slides #wrapperMenuScroll").css("background-color", this.menuBgColor);
                $(".edit-pres-wrap .slides .wrapper-submenu").css("background-color", this.menuBgColor);
            },
            change: function (color) {
                this.menuBgColor = color.toRgbString();
                $(".edit-pres-wrap .slides #wrapperMenuScroll").css("background-color", this.menuBgColor);
                $(".edit-pres-wrap .slides .wrapper-submenu").css("background-color", this.menuBgColor);
            }
        });
        $("#current-item-color").spectrum({
            showAlpha: true,
            color: this.currentItemColor != undefined && this.currentItemColor != "" ? this.currentItemColor : "#3e8787",
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.currentItemColor = color.toRgbString();
                $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", this.currentItemColor);
            },
            change: function (color) {
                this.currentItemColor = color.toRgbString();
                $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", this.currentItemColor);
            }
        });
        $("#font-menu-color").spectrum({
            showAlpha: true,
            color: this.menuColorItem != "" && this.menuColorItem != undefined ? this.menuColorItem : "#fff",
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.menuColorItem = color.toRgbString();
                $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", this.menuColorItem);
                $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", this.menuColorItem);
            },
            change: function (color) {
                this.menuColorItem = color.toRgbString();
                $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", this.menuColorItem);
                $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", this.menuColorItem);
            }
        });
        $('#popup_width').stepper({
            selectorProgressBar: '.stepper-progress',
            selectorInputNumber: '.stepper-number',
            classNameChanging: 'is-changing',
            decimals: 0,
            unit: 'px',
            initialValue: this.defaultValuePopupWidth,
            min: this.minValuePopupWidth,
            max: this.maxValuePopupWidth,
            stepSize: 1
        });
        $('#popup_height').stepper({
            selectorProgressBar: '.stepper-progress',
            selectorInputNumber: '.stepper-number',
            classNameChanging: 'is-changing',
            decimals: 0,
            unit: 'px',
            initialValue: this.defaultValuePopupHeight,
            min: this.minValuePopupHeight,
            max: this.maxValuePopupHeight,
            stepSize: 1
        });
        $("#bg-popup-color").spectrum({
            showAlpha: true,
            color: this.colorBgPopup == "" && this.colorBgPopup == undefined ? "#fff" : this.colorBgPopup,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.colorBgPopup = color.toRgbString();
            },
            change: function (color) {
                this.colorBgPopup = color.toRgbString();
            }
        });
        $("#text-ref-color").spectrum({
            showAlpha: true,
            color: this.textRefColor == "" && this.textRefColor == undefined ? "#000" : this.textRefColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.textRefColor = color.toRgbString();
                $(".reveal div .BlockRef").css("color", this.textRefColor);
            },
            change: function (color) {
                this.textRefColor = color.toRgbString();
                $(".reveal div .BlockRef").css("color", this.textRefColor);
            }
        });
        $('#ref_width').stepper({
            selectorProgressBar: '.stepper-progress',
            selectorInputNumber: '.stepper-number',
            classNameChanging: 'is-changing',
            decimals: 0,
            unit: 'px',
            initialValue: "600",
            min: "300",
            max: "1005",
            stepSize: 1
        });
        $('#ref_height').stepper({
            selectorProgressBar: '.stepper-progress',
            selectorInputNumber: '.stepper-number',
            classNameChanging: 'is-changing',
            decimals: 0,
            unit: 'px',
            initialValue: 310,
            min: 300,
            max: 683,
            stepSize: 1
        });
        $("#bg-ref-color").spectrum({
            showAlpha: true,
            color: this.bgRefColor == "" && this.bgRefColor == undefined ? "#ff" : this.bgRefColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                this.bgRefColor = color.toRgbString();
                $(".reveal div .BlockRef").css("background-color", this.bgRefColor);
                $(".reveal div .BlockRef .arrow-after").css("border-top-color", this.bgRefColor);
            },
            change: function (color) {
                this.bgRefColor = color.toRgbString();
                $(".reveal div .BlockRef").css("background-color", this.bgRefColor);
                $(".reveal div .BlockRef .arrow-after").css("border-top-color", this.bgRefColor);
            }
        });
    },
    ScreenSetup: function () {

        let colorScreen = "",
            bgScreenColor = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color"),
            presColor = this.bgPresColor,
            bgScreenImg = "";

        if (bgScreenColor != "" && bgScreenColor != undefined) {
            colorScreen = bgScreenColor
        } else {
            colorScreen = '#fff';
        }

        $("#bg-screen-color").spectrum({
            showAlpha: true,
            color: colorScreen,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-color", color.toRgbString());
                Reveal.sync();
            },
            change: function (color) {
                SL.editor.controllers.Markup.getCurrentSlide().css("data-background-color", color.toRgbString());
                Reveal.sync();
            }
        });

        this.bgScreenImgBtn.on("vclick", function () {

            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                bgScreenImg = i.data.url;
                $(".bg-screen-image").css("background-image", `url('${bgScreenImg}')`);
                $(".bg-screen-image").show();
                if ($(".wrapper-bg-screen-image .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
                    $(".wrapper-bg-screen-image ").closest('#customize_screen').find('#bg-size-screen').prop('disabled', false);
                }
                SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-img', bgScreenImg);
                SL.editor.controllers.Markup.getCurrentSlide().attr('data-old-size', i.data.size);
                SL.editor.controllers.Markup.getCurrentSlide().attr({
                    "data-background-image": bgScreenImg,
                    "data-background-repeat": "no-repeat",
                    "data-background-position": "center center"
                });
                Reveal.sync();
            }.bind(this));

        }.bind(this));
    },
    cancelParametersListner: function () {

        //Reset Value of Presentation Logo
        this.logoPresURL = this.jsonParameters.dataLogoPresUrl;
        this.logoPresSize = this.jsonParameters.dataLogoPresSize;
        if (this.logoPresURL != "") {
            $(".logo-pres").css({
                "background-image": `url('${this.logoPresURL}')`,
                "display": "block"
            });
            if ($(".wrapper-logo-pres .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".logo-pres");
            }

        }else{
            $(".logo-pres").removeAttr('style').css('display', 'none');
            $(".wrapper-logo-pres .del-current-bg").remove();
        }
        //Reset Value of Presentation Overlay
        if (this.bgRefOverlayColor != "" && this.bgRefOverlayColor != undefined) {
            $("#bg-ref-overlay-color").spectrum("set", this.bgRefOverlayColor);
            $(".reveal .BlockRefOverlay").css("background-color", this.bgRefOverlayColor);
        }else{
            $("#bg-ref-overlay-color").spectrum("set", "#000");
            $(".reveal .BlockRefOverlay").css("background-color", "#000");
        }
        //reset value of bg close popin
        this.imgBtnClose = this.jsonParameters.dataBgBtnClose;
        this.bgClosesize = this.jsonParameters.dataBgCloseSize;
        let _waraperContent = $(".wrapper-bg-btn-close");
        if (this.imgBtnClose != "") {
            $(".reveal div .BlockRef .ref-close-btn").css({
                "background-image": `url('${this.imgBtnClose}')`
            });
            _waraperContent.find(".bg-btn-close").css({
                "background-image": `url('${this.imgBtnClose}')`,
                "display": "block"
            });
            if (_waraperContent.find(".del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
            }
        }else{
            _waraperContent.find(".bg-btn-close").removeAttr('style').css('display','none');
            _waraperContent.find(".del-current-bg").remove();
        }
        //reset value of pres bg color
        this.bgPresColor = this.jsonParameters.dataBgPresColor;
        if (this.bgPresColor != ""  ) {
            $("#bg-pres-color").spectrum("set", this.bgPresColor);
            let presColor = this.bgPresColor;
            $(".slides section").each(function () {
                var slide = $(this);
                if (!slide.is('.popin')) {
                    if (slide.attr('data-bg-screen-color') == "" || slide.attr('data-bg-screen-color') == undefined) {
                        slide.attr("data-background-color", presColor);
                    }
                }
                Reveal.sync();
            })
        } else {
            $("#bg-pres-color").spectrum("set", "#fff");
            $(".slides section").each(function () {
                var slide = $(this);
                if (!$(this).is('.popin')) {
                    if (slide.attr('data-bg-screen-color') == "" || slide.attr('data-bg-screen-color') == undefined) {
                        slide.attr("data-background-color", "#fff");
                    }
                }
            });
            Reveal.sync();
        }


        //Reset value of bg Img pres
        this.bgPresImg      = this.jsonParameters.dataBgPresImg;
        this.bgPresImgSize  = this.jsonParameters.dataBgPresSize;
        let screenBg = SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-screen-img');

        if (screenBg != undefined && screenBg != "") {
            SL.editor.controllers.Markup.getCurrentSlide().attr({
                "data-background-image": screenBg,
                "data-background-repeat": "no-repeat",
                "data-background-position": "center center"
                // backgroundSize: "contain"
            });
            if (this.bgPresImg == "") {
                $(".wrapper-bg-pres .bg-pres").css({
                    "background-image": "",
                    "display": "none"
                });
                $(".wrapper-bg-pres .del-current-bg").remove()

            } else {
                $(".wrapper-bg-pres .bg-pres").css({
                    "background-image": `url('${this.bgPresImg}')`,
                    "display": "block"
                });
                if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
                }
            }
            Reveal.sync()
        } else {
            if (this.bgPresImg == "") {
                $(".wrapper-bg-pres .bg-pres").css({
                    "background-image": "",
                    "display": "none"
                });
                $(".wrapper-bg-pres .del-current-bg").remove()

            } else {
                $(".slides section").not('.popin').attr({
                    "data-background-image": this.bgPresImg,
                    "data-background-repeat": "no-repeat",
                    "data-background-position": "center center"
                    // backgroundSize: "contain"
                });
                $(".wrapper-bg-pres .bg-pres").css({
                    "background-image": `url('${this.bgPresImg}')`,
                    "display": "block"
                });
                if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
                }

                Reveal.sync()
            }
        }
        //reset bg paramters
        var bgPresSize = $('.slides section').attr('data-background-size');
        if (bgPresSize == "contain") {
            $('#bg-size-pres option[value="contain"]').prop('selected', true)
        } else if (bgPresSize == "cover") {
            $('#bg-size-pres option[value="cover"]').prop('selected', true)
        } else {
            $('#bg-size-pres option[value="initial"]').prop('selected', true)
        }
        //reset value of menu  bg color
        this.menuBgColor = this.jsonParameters.dataBgMenuColor;
        if (this.menuBgColor != "" && this.menuBgColor != undefined) {
            $("#bg-menu-color").spectrum("set", this.menuBgColor);
            $(".edit-pres-wrap .slides #wrapperMenuScroll , .edit-pres-wrap .slides .wrapper-submenu").css("background-color", this.menuBgColor);
        } else {
            $("#bg-menu-color").spectrum("set", "#4a5667");
            $(".edit-pres-wrap .slides #wrapperMenuScroll , .edit-pres-wrap .slides .wrapper-submenu").css("background-color", "#4a5667");
        }


        //reset color of current  slide
        this.currentItemColor = this.jsonParameters.dataCurrentItemColor;
        if (this.currentItemColor != "" && this.currentItemColor != undefined) {
            $("#current-item-color").spectrum("set", this.currentItemColor);
            $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", this.currentItemColor);
        } else {
            $("#current-item-color").spectrum("set", "#3e8787");
            $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", "#3e8787");
        }


        //reset color of menu item
        this.menuColorItem = this.jsonParameters.dataFontMenuColor;
        if (this.menuColorItem != "" && this.menuColorItem != undefined) {
            $("#font-menu-color").spectrum("set", this.menuColorItem);
            $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", this.menuColorItem);
            $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", this.menuColorItem);
        } else {
            $("#font-menu-color").spectrum("set", "#fff");
            $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", "#fff");
            $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", "#fff");
        }


        //reset value of menu font
        this.menuFont = this.jsonParameters.dataMenuFont;
        this.menuFontName = this.jsonParameters.dataMenuFontname;
        $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-family", this.menuFont);
        $(`#menu-font option[data-name="${this.menuFontName}"]`).prop('selected', true);

        //reset menuFontSize
        this.menuFontSize = this.jsonParameters.dataFontSizeSelect;
        $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-size", (this.menuFontSize != "" ? this.menuFontSize : "15") + "px");
        $(`#font-size-select option[value="${this.menuFontSize}"]`).prop('selected', true);

        //reset value of allowSubMenu
        this.allowSubMenu = this.jsonParameters.dataAllowSubmenu;
        if (this.allowSubMenu == "true") {
            $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
            $('#allow_submenu').prop('checked', true);
            $('#allow_submenuHeight').prop("disabled", false);
            $('#allow_submenuHeight').parents('.sl-checkbox').removeClass('notAllowedCheck');
        } else {
            $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
            $('#allow_submenu').prop('checked', false);
            $('#allow_submenuHeight').prop("disabled", true);
            $('#allow_submenuHeight').parents('.sl-checkbox').addClass('notAllowedCheck');
        }
        this.fullWideSubmenu = this.jsonParameters.dataAllowSubmenuwidth;
        if (this.fullWideSubmenu == "true" || this.fullWideSubmenu == true) {
            $('#allow_submenuHeight').prop("checked", true);
            $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
        } else {
            $('#allow_submenuHeight').prop("checked", false);
            $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
        }
        //reset highlight_menu
        this.highlightMenu = this.jsonParameters.dataHighlightMenu;
        if (this.highlightMenu == "true") {
            $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                "background-image": "url(/img/selected.png)"
            });
        } else {
            $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                "background-image": "none"
            });
        }

        //reset disable_scroll
        this.disableScroll = this.jsonParameters.dataDisableScroll;
        if (this.disableScroll == "true" || this.disableScroll == true) {
            $('#disable_scroll').prop('checked', true);
            if(SL.editor.controllers.Menu.scrollHMenu.length > 0){
                for(var key in SL.editor.controllers.Menu.scrollHMenu){
                    SL.editor.controllers.Menu.scrollHMenu[key].destroy();
                }
                SL.editor.controllers.Menu.scrollHMenu = [];
            }
        } else {
            $('#disable_scroll').prop('checked', false);
            if(SL.editor.controllers.Menu.scrollHMenu.length == 0){
                SL.editor.controllers.Menu.updateCreatedMenu(true);
            }
        }

        //reset logo home
        this.logoHome       = this.jsonParameters.dataLogoHomeUrl;
        this.logoHomeSize   = this.jsonParameters.dataLogoHomeSize;
        if (this.logoHome != undefined && this.logoHome != "") {
            $(".edit-pres-wrap .slides .link-to-home").css("background-image", `url('${this.logoHome}')`);
            $('.logo-home-link').css({
                'background-image': `url('${this.logoHome}')`,
                'display': 'block'
            });
            $('.logo-home-link').show();
            if ($(".wrapper-logo-home .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
            }
        } else {
            $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(/img/picto-home.png)");
            $('.logo-home-link').hide();
            $(".wrapper-logo-home .del-current-bg").remove();
        }

        //reset logo ref
        this.logoRefsUrl = this.jsonParameters.dataLogoRefrsUrl;
        this.logoRefrsSize = this.jsonParameters.dataLogoRefrsSize;
        if ((this.logoRefsUrl != undefined) && this.logoRefsUrl != "") {
            $(".edit-pres-wrap .slides .ref-link").empty().append(`<img src='${this.logoRefsUrl}' alt='' />`);
            $('.logo-ref-link').css({
                'background-image': `url('${this.logoRefsUrl}')`,
                'display': 'block'
            });
            $('.logo-ref-link').show();
            if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
            }
        } else {
            $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>');
            $(".wrapper-logo-ref .del-current-bg").remove();
            $('.logo-ref-link').hide();

        }

        // reset logo Rcp
        this.logoRcpUrl     = this.jsonParameters.dataLogoRcpUrl;
        this.logoRcpSize    = this.jsonParameters.dataLogoRcpSize;

        if (this.logoRcpUrl != undefined && this.logoRcpUrl != "") {
            $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append(`<img src="${this.logoRcpUrl}" alt='' />`);
            $('.logo-rcp-link').css({
                'background-image': `url('${this.logoRcpUrl}')`,
                'display': 'block'
            });
            $('.logo-rcp-link').show();
            if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
            }
        } else {
            $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>')
            $(".wrapper-rcp-logo .del-current-bg").remove();
            $('.logo-rcp-link').hide()
        }

        //reset popup settings
        this.popupWidth = this.jsonParameters.dataPopupWidth;
        if (this.popupWidth == undefined && this.popupWidth == "") {
            let intiVal = this.defaultValuePopupWidth + "px";
            let scalex_w = ((this.defaultValuePopupWidth - this.minValuePopupWidth) * 100) / (this.maxValuePopupWidth - this.minValuePopupWidth);
            $('#popup_width .stepper-progress').css('transform', 'scaleX(' + scalex_w / 100 + ')');
            $("#popup_width input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.popupWidth != "") {
                intiVal = this.popupWidth;
            } else {
                intiVal = this.defaultValuePopupWidth + "px";
            }
            $("#popup_width input").val(intiVal).trigger("change");
        }

        this.popupHeight = this.jsonParameters.dataPopupHeight;
        if (this.popupHeight == undefined && this.popupHeight == "") {
            let optionVal = this.defaultValuePopupHeight + "px";
            let scalex_h = this.defaultValuePopupHeight / this.maxValuePopupHeight;
            $('#popup_height .stepper-progress').css('transform', 'scaleX(' + scalex_h + ')');
            $("#popup_height input").val(optionVal).trigger("change");
        } else {
            let optionVal;
            if (this.popupHeight != "") {
                optionVal = this.popupHeight;
            } else {
                optionVal = this.defaultValuePopupHeight + "px";
            }
            $("#popup_height input").val(optionVal).trigger("change");
        }
        this.colorBgPopup = this.jsonParameters.dataBgPopupColor;
        if (this.colorBgPopup != "" && this.colorBgPopup != undefined) {
            $("#bg-popup-color").spectrum("set", this.colorBgPopup);
        } else {
            $("#bg-popup-color").spectrum("set", "#fff");
        }


        this.bgPopupImg = this.jsonParameters.dataBgPopupImg;
        this.bgPopupSize = this.jsonParameters.dataBgPopupSize;
        if (this.bgPopupImg != "") {
            $.when(
                $(".bg-popup").css({
                    backgroundImage: `url('${this.bgPopupImg}')`,
                    display: "block"
                })
            ).then(function (x) {
                if ($("#popin_clm .wrapper-bg-popup.popsett .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
                }
            });
        } else {
            $("#popin_clm .bg-popup").removeAttr("style").hide();
            $("#popin_clm .wrapper-bg-popup.popsett .del-current-bg").remove();

        }


        // reset textRefColor
        this.textRefColor = this.jsonParameters.dataTextRefColor;
        if (this.textRefColor != "" && this.textRefColor != undefined) {
            $(".reveal div .BlockRef").css("color", this.textRefColor);
            $("#text-ref-color").spectrum("set", this.textRefColor);
        } else {
            $(".reveal div .BlockRef").css("color", "#000");
            $("#text-ref-color").spectrum("set", "#000");
        }


        //reset ref width
        this.refWidth = this.jsonParameters.dataRefWidth;
        if (this.refWidth == undefined && this.refWidth == "") {
            let intiVal = "600px";
            let scalex_w = ((600 - 300) * 100) / (900 - 300);
            $('#ref_width .stepper-progress').css('transform', 'scaleX(' + scalex_w / 100 + ')');
            $("#ref_width input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.refWidth != "") {
                intiVal = this.refWidth;
            } else {
                intiVal = "600px";
            }
            $("#ref_width input").val(intiVal).trigger("change");
        }

        //reset ref height
        this.refHeight = this.jsonParameters.dataRefHeight;
        if (this.refHeight == undefined && this.refHeight == "") {
            let intiVal = "310px";
            let scalex_h = 310 / 600;
            $('#ref_height .stepper-progress').css('transform', 'scaleX(' + scalex_h / 100 + ')');
            $("#ref_height input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.refHeight != "") {
                intiVal = this.refHeight;
            } else {
                intiVal = "310px";
            }
            $("#ref_height input").val(intiVal).trigger("change");
        }

        //reset font reference
        this.fontReference = this.jsonParameters.dataMenuFontTitleRef;
        this.fontNameReference = this.jsonParameters.dataMenuFontNameTitleRef;
        $(`#menu-font-ref option[data-name="${this.fontNameReference}"]`).prop('selected', true);
        $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", this.fontReference);

        //reset text reference
        this.titleReference = this.jsonParameters.dataTitleRefContent;
        if (this.titleReference !== "") {
            $('#content-ref-title').val(this.titleReference)
        } else {
            $('#content-ref-title').val("Reference")
        }

        //reset fontsize title reference
        this.fontSizeTitleReference = this.jsonParameters.dataFontSizeTitleRef;
        $('.projector .reveal-viewport .slides .BlockRef h3').css("font-size", this.fontSizeTitleReference != "" || this.fontSizeTitleReference !== undefined ? this.fontSizeTitleReference + 'px' : '20');
        $(`#font-size-select-ref option[value="${this.fontSizeTitleReference}"]`).prop('selected', true);

        //reset font size content reference
        this.fontSizeRefContent = this.jsonParameters.dataFontSizeRefContent;
        $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-size", this.fontSizeRefContent != "" || this.fontSizeRefContent !== undefined ? this.fontSizeRefContent + 'px' : '20');
        $(`#font-size-select-ref-content option[value="${this.fontSizeRefContent}"]`).prop('selected', true);

        //reset ref bg color
        this.bgRefColor = this.jsonParameters.dataBgRefColor;
        if (this.bgRefColor != undefined && this.bgRefColor != "") {
            $("#bg-ref-color").spectrum("set", this.bgRefColor);
            $(".reveal div .BlockRef").css("background-color", this.bgRefColor);
            $(".reveal div .BlockRef .arrow-after").css("border-top-color", this.bgRefColor);
        } else {
            $("#bg-ref-color").spectrum("set", "#fff");
            $(".reveal div .BlockRef").css("background-color", "#fff");
            $(".reveal div .BlockRef .arrow-after").css("border-top-color", "#fff");
        }


        //reset bg Referenece
        this.bgRefImg = this.jsonParameters.dataBgRefImg;
        this.bgRefImgSize = this.jsonParameters.dataBgRefSize;

        if (this.bgRefImg != "") {
            $(".bg-ref").css({
                backgroundImage: `url('${this.bgRefImg}')`,
                display: "block"
            });
            if ($("#reference_apearance .wrapper-bg-ref .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
            }
        } else {
            $("#reference_apearance .bg-ref").css("display", "none");
        }
        SL.editor.controllers.Menu.updateCreatedMenu(true);
    },
    resetScreenSettings: function () {
        //reset bg Pres
        var bgScreenColor     = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color"),
            presColor         = this.bgPresColor,
            bgScreenImg       = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img"),
            bgPresSize        = SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-size'),
            disableLeftSwipe  = SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav"),
            disableRightSwipe = SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav");

        $(".error-recommended-field").addClass("hidden");        
        SL.editor.controllers.Markup.getCurrentSlide().attr('data-old-size','');
        if (bgScreenColor != undefined && bgScreenColor != "") {
            $("#bg-screen-color").spectrum('set', bgScreenColor);
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-color', bgScreenColor);
            Reveal.sync();
        } else {

            SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-color', presColor);
            $("#bg-screen-color").spectrum('set', presColor);
            Reveal.sync();
        }

        if (bgScreenImg != undefined && bgScreenImg != "") {
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-image', bgScreenImg)
            $(".bg-screen-image").css("background-image", `url('${bgScreenImg}')`);
            $(".bg-screen-image").show();
            if ($(".wrapper-bg-screen-image .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
                $(".wrapper-bg-screen-image ").closest('#customize_screen').find('#bg-size-screen').prop('disabled', false);
            }
            Reveal.sync();
        } else {
            if (this.bgPresImg != "") {
                SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-image', this.bgPresImg)
            } else {
                if (this.bgPresImg != undefined) {
                    SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-image', this.bgPresImg)
                } else {
                    SL.editor.controllers.Markup.getCurrentSlide().attr('background-image', '')
                }
            }
            $(".bg-screen-image").removeAttr('style');
            $(".bg-screen-image").hide();
            $(".wrapper-bg-screen-image .del-current-bg").remove();
            $(".wrapper-bg-screen-image ").closest('#customize_screen').find('#bg-size-screen').prop('disabled', true);
            Reveal.sync();
        }

        if (bgPresSize == "contain") {
            $('#bg-size-screen option[value="contain"]').prop('selected', true)
        } else if (bgPresSize == "cover") {
            $('#bg-size-screen option[value="cover"]').prop('selected', true)
        } else {
            $('#bg-size-screen option[value="initial"]').prop('selected', true)
        }

        // disbale swipe
        if (typeof disableLeftSwipe == "undefined") {
            $("#Block_Left_nav").prop('checked', false);
        } else {
            if (disableLeftSwipe == "true") {
                $("#Block_Left_nav").prop('checked', true);
            } else {
                $("#Block_Left_nav").prop('checked', false);
            }
        }

        if (typeof disableRightSwipe == "undefined") {
            $("#Block_right_nav").prop('checked', false);
        } else {
            if (disableRightSwipe == "true") {
                $("#Block_right_nav").prop('checked', true);
            } else {
                $("#Block_right_nav").prop('checked', false);
            }
        }
    },
    saveParametersListner: function () {

        this.jsonParameters.dataLogoPresUrl = this.logoPresURL;
        this.jsonParameters.dataLogoPresSize = this.logoPresSize;
        $(".edit-pres-wrap .slides .logoEADV").empty().append(`<img src='${this.logoPresURL}' alt='' />`);

        //set new value of bg ref color overlay
        this.bgRefOverlayColor = $('#bg-ref-overlay-color').next('.sp-replacer.sp-light').find('.sp-preview-inner').css('background-color');
        this.jsonParameters.dataBgRefOverlaycolor = this.bgRefOverlayColor;
        $(".reveal .BlockRefOverlay").css("background-color", this.bgRefOverlayColor);

        //set new value of bg close btn
        this.jsonParameters.dataBgBtnClose = this.imgBtnClose;
        this.jsonParameters.dataBgCloseSize = this.bgClosesize;

        //set new value of bg ref color overlay
        this.bgPresColor = $('#bg-pres-color').next('.sp-replacer.sp-light').find('.sp-preview-inner').css('background-color');
        this.jsonParameters.dataBgPresColor = this.bgPresColor;
        var colorPrez   = this.bgPresColor;

        $(".slides section").not('.popin').each(function () {
            var screencolorBg = $(this).attr('data-bg-screen-color');
            if (typeof  screencolorBg === "undefined" || screencolorBg === "") {
                $(this).attr("data-background-color", colorPrez);
            }else{
                $(this).attr("data-background-color", screencolorBg);
            }
            Reveal.sync();
        });

        //set new bag image of prez
        var presImg     = this.presImg;
        this.jsonParameters.dataBgPresImg = this.bgPresImg;
        this.jsonParameters.dataBgPresSize = this.bgPresImgSize;
        $(".slides section").not('.popin').each(function () {
            var screenImgBg= $(this).attr('data-bg-screen-img');
            if ( typeof screenImgBg === "undefined" ||  screenImgBg === "") {
                $(this).attr("data-background-image", presImg);
            } else {
                $(this).attr("data-background-image", $(this).attr('data-bg-screen-img'));
            }
            Reveal.sync();
        });

        //set new value of menuBgColor
        this.menuBgColor = $('#bg-menu-color').next('.sp-replacer.sp-light').find('.sp-preview-inner').css('background-color');
        this.jsonParameters.dataBgMenuColor = this.menuBgColor;

        //set background size
        $('#bg-size-pres option').each(function () {
            if ($(this).is(':selected')) {
                var valueBg = $(this).val();
                $(".slides section").not('.popin').each(function () {
                    var that = $(this);
                    var bg = that.attr("data-bg-screen-img");
                    if ((bg == "") || (bg == undefined)) {
                        that.attr('data-background-size', valueBg)
                    }
                });
                Reveal.sync();
            }
        });

        //set new color current menu
        this.currentItemColor = $('#current-item-color').next('.sp-replacer.sp-light').find('.sp-preview-inner').css('background-color');
        this.jsonParameters.dataCurrentItemColor = this.currentItemColor;

        //set new color item menu
        this.menuColorItem = $('#font-menu-color').next('.sp-replacer.sp-light').find('.sp-preview-inner').css('background-color');
        this.jsonParameters.dataFontMenuColor = this.menuColorItem;
        //set  new font name to menu
        this.jsonParameters.dataMenuFont = this.menuFont;
        this.jsonParameters.dataMenuFontname = this.menuFontName;

        //set new font size of menu
        this.jsonParameters.dataFontSizeSelect = this.menuFontSize;

        //set new val of allowSubMenu
        this.jsonParameters.dataAllowSubmenu = this.allowSubMenu;

        //set new val of disableScroll
        this.jsonParameters.dataDisableScroll = this.disableScroll;

        //set new value of fullWideSubmenu
        this.jsonParameters.dataAllowSubmenuwidth = this.fullWideSubmenu;

        //set new value highlightMenu
        this.jsonParameters.dataHighlightMenu = this.highlightMenu;

        // set new value of img logo home
        this.jsonParameters.dataLogoHomeUrl = this.logoHome;
        this.jsonParameters.dataLogoHomeSize = this.logoHomeSize;

        // set new image of ref
        this.jsonParameters.dataLogoRefrsUrl = this.logoRefsUrl;
        this.jsonParameters.dataLogoRefrsSize = this.logoRefrsSize;

        //set new logo of rcp
        this.jsonParameters.dataLogoRcpUrl = this.logoRcpUrl;
        this.jsonParameters.dataLogoRcpSize = this.logoRcpSize;

        //set new val of popup width
        this.popupWidth = $("#popup_width .stepper-number").val();
        this.jsonParameters.dataPopupWidth = this.popupWidth;

        //set new val of popup height
        this.popupHeight = $("#popup_height .stepper-number").val();
        this.jsonParameters.dataPopupHeight = this.popupHeight;

        // set new val of color bg popup
        this.colorBgPopup = $("#bg-popup-color").spectrum("get").toRgbString();
        this.jsonParameters.dataBgPopupColor = this.colorBgPopup;

        //set new val bg popup
        this.jsonParameters.dataBgPopupImg = this.bgPopupImg;
        this.jsonParameters.dataBgPopupSize = this.bgPopupSize;

        //set new color of reference text
        this.textRefColor = $("#text-ref-color").spectrum("get").toRgbString();
        this.jsonParameters.dataTextRefColor = this.textRefColor;

        //set new val of ref width
        this.refWidth = $("#ref_width .stepper-number").val();
        this.jsonParameters.dataRefWidth = this.refWidth;
        $(".reveal div .BlockRef").css("width", this.refWidth);

        //set new val of ref height
        this.refHeight = $('#ref_height .stepper-number').val();
        this.jsonParameters.dataRefHeight = this.refHeight;
        $(".reveal div .BlockRef").css("height", this.refHeight);

        //set new font of reference
        this.parameters.attr("data-menu-font-title-ref", this.fontReference);
        this.jsonParameters.dataMenuFontTitleRef = this.fontReference;
        this.jsonParameters.dataMenuFontNameTitleRef = this.fontNameReference;
        $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", this.fontReference);

        //set new title reference
        this.titleReference = $('#content-ref-title').val();
        this.titleReference !== "" ? this.jsonParameters.dataTitleRefContent = this.titleReference : this.jsonParameters.dataTitleRefContent =  "Reference";
        $('#content-ref-title').val(this.titleReference);

        //set new value of fontSizeTitleReference
        this.jsonParameters.dataFontSizeTitleRef = this.fontSizeTitleReference;
        $('.projector .reveal-viewport .slides .BlockRef h3').css('font-size', this.fontSizeTitleReference);

        //set new of content reference
        this.jsonParameters.dataFontSizeRefContent = this.fontSizeRefContent;
        $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs').css('font-size', this.fontSizeRefContent);

        //set new color of reference text
        this.bgRefColor = $("#bg-ref-color").spectrum("get").toRgbString();
        this.jsonParameters.dataBgRefColor = this.bgRefColor;

        //set new bg img reference
        this.jsonParameters.dataBgRefImg = this.bgRefImg;
        this.jsonParameters.dataBgRefSize = this.bgRefImgSize;
        //background size
        this.bgPresSize = $('#bg-size-pres option:selected').val();
    },
    saveScreenParametersListner: function () {

        var savePermession = true;

        $(".error-recommended-field").addClass("hidden");
        if($("#screen-description").val() == "" || $("#screen-description").val() == undefined){
            $(".sidebar-panel").addClass("visible");
            $(".settings.screen-parameters").addClass("visible");
            $("#error-empty-field").removeClass("hidden");
            savePermession = false;
        }
        else{
            savePermession = true;
            $(".slides section").not(".stack").not($(Reveal.getCurrentSlide())).each(function(index, elm){ 
                if($(this).attr("data-screen-description") === $("#screen-description").val()){
                    $(".sidebar-panel").addClass("visible");
                    $(".settings.screen-parameters").addClass("visible");
                    $("#error-used-keymsg").removeClass("hidden");
                    savePermession = false;
                }
            });
        }

        if(savePermession == true){
            var bgScreenColor     = $("#bg-screen-color").spectrum('get').toRgbString(),
                bgScreenImg       = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img"),
                dataScreenBg      = SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-screen-img'),
                _oldSize          = SL.editor.controllers.Markup.getCurrentSlide().attr('data-old-size'),
                valueBg,
                disableLeftSwipe  = $("#Block_Left_nav").prop('checked'),
                disableRightSwipe = $("#Block_right_nav").prop('checked');

            $(document).off("click", ".media-library-list .media-library-list-item");
            if ($("#screen-name").val() !== '') {
                var scrennId = SL.editor.controllers.Markup.getCurrentSlide().attr('data-id');
                $('#linktoscreen > option[value='+scrennId+']').text($("#screen-name").val());
            }
            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");

            $('#bg-size-screen option').each(function () {
                if ($(this).is(':selected')) {
                    valueBg = $(this).val();
                    if (dataScreenBg != "" && dataScreenBg != undefined)
                        SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-size', valueBg);
                }
                Reveal.sync();
            });

            //set new current slide color
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color", bgScreenColor);
            //set new current image slide
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img", bgScreenImg);
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-size", _oldSize);

            SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav", disableLeftSwipe);
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav", disableRightSwipe);
            SL.editor.controllers.Markup.getCurrentSlide().attr({
                "data-screen-name": $("#screen-name").val(),
                "data-chapter-name": $("#chapter-name").val(),
                "data-key-msg": $("#key-msg").val(),
                "data-screen-description": $("#screen-description").val(),
                "data-trigger-anim-ByClick": $("#trigger_anim_by_click").is(":checked"),
                "data-custom-navbar-appearance": $("#custom-navbar-appearance").find("option:selected").val()
            });
            
            setTimeout(function() {
                SL.editor.controllers.Menu.updateCreatedMenu();
                this.renderParamaters()
            }.bind(this), 5);
        }
    },
    openMediaLibrary: function () {
        //Presnetation Logo
        this.presesntationLogo.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.logoPresURL = i.data.url;
                this.logoPresSize = i.data.size;
                $(".logo-pres").css("background-image", "url(" + this.logoPresURL + ")");
                $(".logo-pres").show();
                if ($(".wrapper-logo-pres .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".logo-pres");
                }

            }.bind(this));
        }.bind(this));
        //Button Close popin && Ref
        this.closeBtn.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.imgBtnClose = i.data.url;
                this.bgClosesize = i.data.size;
                $(".bg-btn-close").css("background-image", `url('${this.imgBtnClose}')`);
                $(".bg-btn-close").show();
                if ($(".wrapper-bg-btn-close .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
                }
                $(".reveal div .BlockRef .ref-close-btn").css({
                    "background-image": `url('${this.imgBtnClose}')`

                });
            }.bind(this));
        }.bind(this));

        //Presentation background image
        this.presentationBgBtn.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.bgPresImg = i.data.url;
                this.bgPresImgSize = i.data.size;
                $(".bg-pres").show();
                $(".bg-pres").css("background-image", `url('${this.bgPresImg}')`);
                if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
                }
                $("#clm_bg_screen").find('#bg-size-pres').prop('disabled', false);
                let bgpres = this.bgPresImg;
                $(".slides section").not('.popin').each(function () {
                    if ($(this).attr('data-bg-screen-img') == undefined) {
                        $(this).attr({
                            'data-background-image': bgpres,
                            'data-background-repeat': "no-repeat",
                            'data-background-position': "center center"
                            // backgroundSize: "contain"
                        });
                        Reveal.sync();
                    } else {
                        if ($(this).attr('data-bg-screen-img') == "") {
                            $(this).attr({
                                'data-background-image': bgpres,
                                'data-background-repeat': "no-repeat",
                                'data-background-position': "center center"
                                // backgroundSize: "contain"
                            });
                        } else {
                            $(this).attr({
                                'data-background-image': $(this).attr('data-bg-screen-img'),
                                'data-background-repeat': "no-repeat",
                                'data-background-position': "center center"
                                // backgroundSize: "contain"
                            });
                        }
                        Reveal.sync();
                    }
                });

            }.bind(this));
        }.bind(this));

        //logo home
        this.imgHomeLogoBtn.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.logoHome = i.data.url;
                this.logoHomeSize = i.data.size;
                $(".edit-pres-wrap .slides .link-to-home").css("background-image", `url('${this.logoHome}')`);
                $('.logo-home-link').css({
                    'background-image': `url('${this.logoHome}')`,
                    'display': 'block'
                });

                $('.logo-home-link').show();
                if ($(".wrapper-logo-home .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
                }
            }.bind(this));
        }.bind(this));

        //img ref
        this.imgRefLogoBtn.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.logoRefsUrl    = i.data.url;
                this.logoRefrsSize  = i.data.size;
                $(".edit-pres-wrap .slides .ref-link").empty().append(`<img src='${this.logoRefsUrl}' alt='' />`);
                $('.logo-ref-link').css({
                    'background-image': `url('${this.logoRefsUrl}')`,
                    'display': 'block'
                });
                $('.logo-ref-link').show();
                if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
                }
            }.bind(this));
        }.bind(this));

        //logo rcp
        this.imgRcpBtn.on('vclick', function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.logoRcpUrl = i.data.url;
                this.logoRcpSize = i.data.size;
                $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append(`<img src='${this.logoRcpUrl}' alt='' />`);
                $('.logo-rcp-link').css({
                    'background-image': `url('${this.logoRcpUrl}')`,
                    'display': 'block'
                });

                $('.logo-rcp-link').show();
                if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
                }
            }.bind(this));
        }.bind(this));

        //background image popin
        this.bgPopupBtn.on("vclick", function () {
            if ($('.popin.present').size() == 0) {

                let t = Reveal.getIndices(this.currentSlide),
                    i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                        select: SL.models.Media.IMAGE
                    });
                i.selected.addOnce(function (i) {
                    this.bgPopupImg = i.data.url;
                    this.bgPopupSize = i.data.size;
                    $(".bg-popup").css("background-image", `url('${this.bgPopupImg}')`);
                    $(".bg-popup").show();
                    if ($("#popin_clm .wrapper-bg-popup .del-current-bg").length == 0) {
                        $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
                    }
                }.bind(this));
            }
        }.bind(this));

        //reference bg
        this.bgRefImgBtn.on("click", function () {

            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.bgRefImg = i.data.url;
                this.bgRefImgSize = i.data.size;
                $(".bg-ref").css("background-image", `url('${this.bgRefImg}')`);
                $(".bg-ref").show();
                if ($(".wrapper-bg-ref .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
                }
                $(".reveal div .BlockRef").css({
                    backgroundImage: `url('${this.bgRefImg}')`,
                    backgroundSize: 'cover'
                });
            }.bind(this));
        }.bind(this));

    },
    deleteBgData: function () {
        //Delete Bg popin img
        $(document).on("vclick", ".wrapper-bg-btn-close .del-current-bg a", function () {
            this.imgBtnClose = "";
            this.bgClosesize ="";
            $(".bg-btn-close").removeAttr("style").css("display", "none");
            $(".reveal div .BlockRef .ref-close-btn").css({
                "background-image": "url(/img/close_ref.png)"
            });
            $(".wrapper-bg-btn-close").find(".del-current-bg").remove();
        }.bind(this));

        //delete bg pres logo
        $(document).on("vclick", ".wrapper-logo-pres .del-current-bg a", function () {
            this.logoPresURL = "";
            this.logoPresSize = "";
            $(".logo-pres").removeAttr("style").css("display", "none");
            $(".wrapper-logo-pres").find(".del-current-bg").remove();
        }.bind(this));

        //delete pres Bg image
        $(document).on("vclick", ".wrapper-bg-pres .del-current-bg a", function () {
            this.bgPresImg = "";
            this.bgPresImgSize ="";
            $("#clm_bg_screen").find('#bg-size-pres').prop('disabled', true);
            $(".wrapper-bg-pres").find(".del-current-bg").remove();
            $(".bg-pres").removeAttr("style").css("display", "none");
            $(".slides section").not('.popin').each(function () {
                $(this).attr({
                    "data-background-image": $(this).attr("data-bg-screen-img") != undefined ? $(this).attr("data-bg-screen-img") : "",
                    "data-background-repeat": $(this).attr("data-bg-screen-img") != undefined ? "no-repeat" : "",
                    "data-background-position": $(this).attr("data-bg-screen-img") != undefined ? "center center" : ""
                });
            });
            $(".projector .reveal-viewport").removeAttr("style");
            Reveal.sync();
        }.bind(this));
        // Delete Home logo
        $(document).on("vclick", '.wrapper-logo-home .del-current-bg a', function () {
            this.logoHome = "";
            this.logoHomeSize = "";
            $(".wrapper-logo-home ").find(".del-current-bg").remove();
            $(".logo-home-link").removeAttr("style").css("display", "none");
            $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(/img/picto-home.png)");
        }.bind(this));

        $(document).on("vclick", '.wrapper-logo-ref .del-current-bg a', function () {
            this.logoRefsUrl = "";
            this.logoRefrsSize = "";
            $(".wrapper-logo-ref").find(".del-current-bg").remove();
            $(".logo-ref-link").removeAttr("style").css("display", "none");
            $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>');
        }.bind(this));

        //Delete RCP Icon
        $(document).on("vclick", '.wrapper-rcp-logo .del-current-bg a', function () {
            this.logoRcpUrl = "";
            this.logoRcpSize = "";
            $(".wrapper-rcp-logo").find(".del-current-bg").remove();
            $(".logo-rcp-link").removeAttr("style").css("display", "none");
            $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>');

        }.bind(this));

        //delete img popup
        $(document).on("vclick", ".wrapper-bg-popup .del-current-bg a", function () {
            this.bgPopupImg = "";
            this.bgPopupSize = "";
            if ($('.popin.present').size() == 0) {
                $(".wrapper-bg-popup").find(".del-current-bg").remove();
                $(".bg-popup").removeAttr("style").css("display", "none");
            }
        }.bind(this));

        //delete img reference
        $(document).on("vclick", ".wrapper-bg-ref .del-current-bg a", function () {
            this.bgRefImg = "";
            this.bgRefImgSize = "";
            $(".wrapper-bg-ref").find(".del-current-bg").remove();
            $(".bg-ref").removeAttr("style").css("display", "none");
            $(".reveal div .BlockRef").css({
                backgroundImage: "none"
            });
        }.bind(this));
        //delete screen image
        $(document).on("click", ".wrapper-bg-screen-image .del-current-bg a", function () {
            $(".wrapper-bg-screen-image").closest('#customize_screen').find('#bg-size-screen').prop('disabled', true);
            $(".wrapper-bg-screen-image").find(".del-current-bg").remove();
            $(".bg-screen-image").removeAttr("style").css("display", "none");
            $(".backgrounds .slide-background").removeAttr("style");
            if (this.bgPresImg != undefined) {
                SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-image", this.bgPresImg);
            } else {
                if (this.bgPresImg != "") {
                    SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-image", this.bgPresImg);
                } else {
                    SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-image", "");
                }
            }
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img","");
            SL.editor.controllers.Markup.getCurrentSlide().attr("data-old-size","");
            Reveal.sync()
        }.bind(this));


    },
    changeSelectListner: function () {

        $(document).off("change", "#font-size-select").on("change", "#font-size-select", function () {
            var optionValSize;
            optionValSize = $("#font-size-select").find("option:selected").val();
            this.menuFontSize = optionValSize != "Select font size..." ? optionValSize : "15";
            $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-size", (this.menuFontSize != "Select font size..." ? this.menuFontSize : "15") + "px");
            SL.editor.controllers.Menu.updateCreatedMenu(true);
        }.bind(this));

        $(document).on("change","#menu-font", function () {
            if(this.panelElement.is('.visible')){
                var dataFont, fontName;
                dataFont = $('#menu-font').find("option:selected").attr("data-font");
                fontName = SL.fonts.PACKAGES[dataFont.toString()][0];
                this.menuFont = SL.fonts.FAMILIES[fontName].name;
                this.menuFontName = $('#menu-font').find("option:selected").attr("data-name");
                $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-family", this.menuFont);
                SL.editor.controllers.Menu.updateCreatedMenu(true);
            }
        }.bind(this));

        $(document).on("change","#menu-font-ref", function () {
            if(this.panelElement.is('.visible')){
                var dataFontTitleREF, fontNameTitleREF;
                dataFontTitleREF = $("#menu-font-ref").find("option:selected").attr("data-font");
                fontNameTitleREF = SL.fonts.PACKAGES[dataFontTitleREF.toString()][0];
                this.fontReference = SL.fonts.FAMILIES[fontNameTitleREF].name;
                this.fontNameReference = $("#menu-font-ref").find("option:selected").attr("data-name");
                $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", this.fontReference);
            }
        }.bind(this));

        $("#allow_submenu").on("change", function () {
            this.allowSubMenu = $("#allow_submenu").prop('checked');
            if (this.allowSubMenu === true) {
                this.allowSubMenu = "true";
                $('#allow_submenuHeight').prop("disabled", false);
                $('#allow_submenuHeight').parents('.sl-checkbox').removeClass('notAllowedCheck');
                $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
            } else {
                this.allowSubMenu = "false";
                $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
                $('#allow_submenuHeight').prop("disabled", true);
                $('#allow_submenuHeight').parents('.sl-checkbox').addClass('notAllowedCheck');
            }
        }.bind(this));

        $("#allow_submenuHeight").on("change", function () {
            this.fullWideSubmenu = $("#allow_submenuHeight").prop('checked');
            if (this.fullWideSubmenu == "true" || this.fullWideSubmenu == true) {
                $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
            } else {
                $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
            }
            SL.editor.controllers.Menu.updateCreatedMenu(true);
        }.bind(this));

        $("#highlight_menu").on("change", function () {
            this.highlightMenu = $("#highlight_menu").prop('checked')
            if (this.highlightMenu == true) {
                this.highlightMenu = "true";
                $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                    "background-image": "url(/img/selected.png)"
                });
            } else {
                this.highlightMenu = "false";
                $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                    "background-image": "none"
                });
            }
        }.bind(this));

        $("#disable_scroll").on("change", function () {
            this.disableScroll = $("#disable_scroll").prop('checked')
            if (this.disableScroll == true || this.disableScroll == "true") {
                this.disableScroll = "true";
            }
            else {
                this.disableScroll = "false";
            }
            SL.editor.controllers.Menu.updateCreatedMenu(true);
        }.bind(this));

        $(document).off('change', '#font-size-select-ref').on('change', '#font-size-select-ref', function () {
            var fontsize;
            fontsize = $("#font-size-select-ref").find('option:selected').val();
            this.fontSizeTitleReference = fontsize != "Select font size..." ? fontsize : "20";
            $('.projector .reveal-viewport .slides .BlockRef h3').css("font-size", (this.fontSizeTitleReference != "Select font size..." ? this.fontSizeTitleReference : "20") + "px");
        }.bind(this));

        $(document).off('change', '#font-size-select-ref-content').on('change', '#font-size-select-ref-content', function () {
            var valueContent;
            valueContent = $("#font-size-select-ref-content").find('option:selected').val();
            this.fontSizeRefContent = valueContent != "Select font size..." ? valueContent : "20";
            $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs ').css("font-size", (this.fontSizeRefContent != "Select font size..." ? this.fontSizeRefContent : "20") + "px");
        }.bind(this));
    },
    duplicateSlide: function(){
        var getLastMenuID = SL.editor.controllers.Markup.getCurrentSlide().attr("data-id");
        setTimeout(function () {
            $(".template-item .duplicate-template-item-params").parent(".slides").find("section.present").attr({
                "data-background-color"     : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgcolor"),
                "data-background-size"      : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgsize"),
                "data-background-image"     : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgimg") != undefined ? $(".template-item .duplicate-template-item-params").attr("data-template-item-bgimg") : "",
                "data-background-repeat"    : "no-repeat",
                "data-background-position"  : "center center"

            });
        }, 5);

        $(document).off("click", ".sl-templates-inner .template-item").on("click", ".sl-templates-inner .template-item", function(){
            $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "none");
            /* Menu update */
            setTimeout(function(){
                SL.editor.controllers.Menu.updateCreatedMenu();
            }, 5);
            if($(this).find(".duplicate-template-item-params").length == 0){
                var duplicateInterval = setInterval(function(){
                    if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != getLastMenuID && SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id")){
                        SL.editor.controllers.Markup.getCurrentSlide().attr({
                            'data-background-color'     : SL.editor.controllers.Appearence.bgPresColor != "" && SL.editor.controllers.Appearence.bgPresColor != undefined ? SL.editor.controllers.Appearence.bgPresColor  : "transparent",
                            'data-background-image'     : SL.editor.controllers.Appearence.bgPresImg  != ""  ? SL.editor.controllers.Appearence.bgPresImg  : "",
                            'data-background-repeat'    : "no-repeat",
                            'data-background-size'      : SL.editor.controllers.Appearence.bgPresSize,
                            'data-background-position'  : "center center"
                        }).promise().done(function(){
                            $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "all");
                            Reveal.sync();
                        });
                        clearInterval(duplicateInterval);
                    }
                }, 1);
            }
            else{
                var duplicateTemplateItemELm = $(this).find(".duplicate-template-item-params"),
                    currentBgSizeScreen = SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-size');
                console.log(duplicateTemplateItemELm.attr("data-template-item-bgimg"));
                var createSlideInterval = setInterval(function(){
                    if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != getLastMenuID && SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id")){
                        var sectionPresent = SL.editor.controllers.Markup.getCurrentSlide();
                        SL.editor.controllers.Markup.getCurrentSlide().attr({
                            'data-background-color'     : duplicateTemplateItemELm.attr("data-template-item-bgcolor"),
                            'data-bg-screen-color'      : duplicateTemplateItemELm.attr("data-bg-screen-color"),
                            'data-background-image'     : duplicateTemplateItemELm.attr("data-template-item-bgimg") != '' ? duplicateTemplateItemELm.attr("data-template-item-bgimg") : "",
                            'data-background-size'      : currentBgSizeScreen,
                            'data-background-repeat'    : "no-repeat",
                            'data-background-position'  : "center center"
                        }).promise().done(function(){
                            $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "all");
                            Reveal.sync();
                        });
                        SL.editor.controllers.Menu.updateNavbarAppearance(duplicateTemplateItemELm.attr("data-template-item-navbarappearance"));
                        if(duplicateTemplateItemELm.attr("data-set-screen-img") == "true"){
                            sectionPresent.attr({
                                "data-bg-screen-img": duplicateTemplateItemELm.attr("data-template-item-bgimg") != "none" ? duplicateTemplateItemELm.attr("data-template-item-bgimg") : ""
                            });
                        }
                        if(duplicateTemplateItemELm.attr("data-set-screen-color") == "true"){
                            sectionPresent.attr({
                                "data-bg-screen-color": duplicateTemplateItemELm.attr("data-template-item-bgcolor")
                            });
                        }
                        if(duplicateTemplateItemELm.attr("data-set-custom-navbarappearance") == "true"){
                            sectionPresent.attr({
                                "data-custom-navbar-appearance": duplicateTemplateItemELm.attr("data-template-item-navbarappearance")
                            });
                        }
                        $(".duplicate-template-item-params").remove();
                        clearInterval(createSlideInterval);
                    }
                }, 1);
            }
        });
    },
    convertDate : function(date){
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(date),
            date =  [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/'),
            times = [d.getUTCHours(), d.getUTCMinutes()].join(':');
        return `${date} ${times} GMT(00:00)`;
    },
    renderParamaters: function () {
        // Presentaion Logo Rendering
        if (this.logoPresURL != "" && this.logoPresURL != undefined) {
            $('#wrapperMenuScroll .logoEADV').empty().append(`<img src='${this.logoPresURL}' alt='' />`);
            $('#logo_pres_upload').closest('.wrapper-logo-pres').find('.logo-pres').css({
                "background-image": `url('${this.logoPresURL}')`,
                "display": "block"
            });
            $(".wrapper-logo-pres .logo-pres").css({
                "background-image": `url('${this.logoPresURL}')`,
                "display": "block"
            });
            if ($(".wrapper-logo-pres .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".logo-pres");
            }
        }

        // Presentaion Overlay BG Rendering
        if (this.bgRefOverlayColor != "" && this.bgRefOverlayColor != undefined) {
            $("#bg-ref-overlay-color").spectrum("set", this.bgRefOverlayColor)
            $(".reveal .BlockRefOverlay").css("background-color", this.bgRefOverlayColor);
        } else {
            $("#bg-ref-overlay-color").spectrum("set", "#000");
        }


        // bg img  close popin
        if (this.imgBtnClose != "" && this.imgBtnClose != undefined) {
            $(".reveal div .BlockRef .ref-close-btn").css({
                "background-image": `url('${this.imgBtnClose}')`
            })
            $(".wrapper-bg-btn-close .bg-btn-close").css({
                "background-image": `url('${this.imgBtnClose}')`,
                "display": "block"
            });
            if ($(".wrapper-bg-btn-close .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
            }
        } else {
            this.imgBtnClose = "";
            $(".reveal div .BlockRef .ref-close-btn").css({
                "background-image": "url(/img/close_ref.png)"
            });
        }
        //bgColor  pres
        if (this.bgPresColor != "" && this.bgPresColor != undefined) {
            var bgPresColorVal = this.bgPresColor;
            $("#bg-pres-color").spectrum("set", this.bgPresColor);
            $(".slides section").not('.popin').each(function () {
                var slide = $(this);
                if (slide.attr('data-bg-screen-color') != "" || slide.attr('data-bg-screen-color') != undefined) {
                    slide.attr("data-background-color", bgPresColorVal);
                }
            });
            Reveal.sync();
        } else {
            $("#bg-pres-color").spectrum("set", "#fff");
            $(".slides section").not('.popin').each(function () {
                var slide = $(this);
                if (slide.attr('data-bg-screen-color') != "" || slide.attr('data-bg-screen-color') != undefined) {
                    slide.attr("data-background-color", "#fff");
                }
            });
            Reveal.sync();
        }

        //backgound image  pres
        let currentBgScreen = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img");
        if (currentBgScreen != "" && currentBgScreen != undefined) {
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-image', currentBgScreen);
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-img', currentBgScreen);
            Reveal.sync();
        } else {
            if (this.bgPresImg != "") {
                $(".bg-pres").show();
                $(".bg-pres").css("background-image", `url('${this.bgPresImg}')`);
                if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
                    $(this).closest('#clm_bg_screen').find('#bg-size-pres').prop('disabled', false);
                }
            }
            $(".slides section").not('.popin').attr({
                "data-background-image": this.bgPresImg,
                "data-background-repeat": "no-repeat",
                "data-background-position": "center center"
                // backgroundSize: "contain"
            });
            Reveal.sync();
        }


        //backgound image size pres
        var bgPresSize = $('.slides section').attr('data-background-size');
        if (bgPresSize == "contain") {
            $('#bg-size-pres option[value="contain"]').prop('selected', true)
        } else if (bgPresSize == "cover") {
            $('#bg-size-pres option[value="cover"]').prop('selected', true)
        } else {
            $('#bg-size-pres option[value="initial"]').prop('selected', true)
        }

        //render menu
        this.renderMenuParameters();


        //render allowSubmenu
        if (this.allowSubMenu == "true") {
            $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
            $('#allow_submenu').prop('checked', true);
            $('#allow_submenuHeight').prop("disabled", false);
            $('#allow_submenuHeight').parents('.sl-checkbox').removeClass('notAllowedCheck');
        } else {
            $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
            $('#allow_submenu').prop('checked', false);
            $('#allow_submenuHeight').prop("disabled", true);
            $('#allow_submenuHeight').parents('.sl-checkbox').addClass('notAllowedCheck');
        }

        //render disableScroll
        if (this.disableScroll == "true" || this.disableScroll == true) {
            $('#disable_scroll').prop('checked', true);
        } else {
            $('#disable_scroll').prop('checked', false);
        }

        //render fullWideSubmenu
        if (this.fullWideSubmenu == "true" || this.fullWideSubmenu == true) {
            $('#allow_submenuHeight').prop("checked", true);
            $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
        } else {
            $('#allow_submenuHeight').prop("checked", false);
            $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
        }
        if (this.logoHome != undefined && this.logoHome != "") {
            $(".edit-pres-wrap .slides .link-to-home").css("background-image", `url('${this.logoHome}')`);
            $('.logo-home-link').css({
                'background-image': `url('${this.logoHome}')`,
                'display': 'block'
            });
            $('.logo-home-link').show();
            if ($(".wrapper-logo-home .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
            }
        } else {
            $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(/img/picto-home.png)");
        }

        // render logo ref
        if (this.logoRefsUrl != undefined && this.logoRefsUrl != "") {
            $(".edit-pres-wrap .slides .ref-link").empty().append(`<img src='${this.logoRefsUrl}' alt='' />`);
            $('.logo-ref-link').css({
                'background-image': `url('${this.logoRefsUrl}')`,
                'display': 'block'
            });
            $('.logo-ref-link').show();
            if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
            }
        } else {
            $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>')
        }

        // render logo rcp
        if (this.logoRcpUrl != undefined && this.logoRcpUrl != "") {
            $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append(`<img src="${this.logoRcpUrl}" alt='' />`);
            $('.logo-rcp-link').css({
                'background-image': `url('${this.logoRcpUrl}')`,
                'display': 'block'
            });
            $('.logo-rcp-link').show();
            if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
            }
        } else {
            $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>')
        }

        //render value popin settings
        if (this.popupWidth == undefined && this.popupWidth == "") {
            let intiVal = this.defaultValuePopupWidth + "px";
            let scalex_w = ((this.defaultValuePopupWidth - this.minValuePopupWidth) * 100) / (this.maxValuePopupWidth - this.minValuePopupWidth);
            $('#popup_width .stepper-progress').css('transform', 'scaleX(' + scalex_w / 100 + ')');
            $("#popup_width input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.popupWidth != "") {
                intiVal = this.popupWidth;
            } else {
                intiVal = this.defaultValuePopupWidth + "px";
            }
            $("#popup_width input").val(intiVal).trigger("change");
        }

        if (this.popupHeight == undefined && this.popupHeight == "") {
            let optionVal = this.defaultValuePopupHeight + "px";
            let scalex_h = this.defaultValuePopupHeight / this.maxValuePopupHeight;
            $('#popup_height .stepper-progress').css('transform', 'scaleX(' + scalex_h + ')');
            $("#popup_height input").val(optionVal).trigger("change");
        } else {
            let optionVal;
            if (this.popupHeight != "") {
                optionVal = this.popupHeight;
            } else {
                optionVal = this.defaultValuePopupHeight + "px";
            }
            $("#popup_height input").val(optionVal).trigger("change");
        }

        if (this.bgPopupImg != "") {
            $.when(
                $(".bg-popup").css({
                    backgroundImage: `url('${this.bgPopupImg}')`,
                    display: "block"
                })
            ).then(function (x) {
                if ($("#popin_clm .wrapper-bg-popup.popsett .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
                }
            });
        }
        if (this.colorBgPopup != "" && this.colorBgPopup != undefined) {
            $("#bg-popup-color").spectrum("set", this.colorBgPopup);
        } else {
            $("#bg-popup-color").spectrum("set", "#fff");
        }

        // render textRefColor
        if (this.textRefColor != "" && this.textRefColor != undefined) {
            $(".reveal div .BlockRef").css("color", this.textRefColor);
            $("#text-ref-color").spectrum("set", this.textRefColor);
        } else {
            $(".reveal div .BlockRef").css("color", "#000");
            $("#text-ref-color").spectrum("set", "#000");
        }

        //render ref width
        if (this.refWidth == undefined && this.refWidth == "") {
            let intiVal = "600px";
            let scalex_w = ((600 - 300) * 100) / (900 - 300);
            $('#ref_width .stepper-progress').css('transform', 'scaleX(' + scalex_w / 100 + ')');
            $("#ref_width input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.refWidth != "") {
                intiVal = this.refWidth;
            } else {
                intiVal = "600px";
            }
            $("#ref_width input").val(intiVal).trigger("change");
        }

        //render ref height
        if (this.refHeight == undefined && this.refHeight == "") {
            let intiVal = "310px";
            let scalex_h = 310 / 600;
            $('#ref_height .stepper-progress').css('transform', 'scaleX(' + scalex_h / 100 + ')');
            $("#ref_height input").val(intiVal).trigger("change");
        } else {
            let intiVal;
            if (this.refHeight != "") {
                intiVal = this.refHeight;
            } else {
                intiVal = "310px";
            }
            $("#ref_height input").val(intiVal).trigger("change");
        }

        //render font ref
        if (this.fontReference == undefined) {
            var OptionFontTitle;
            $("#menu-font-ref option").each(function (index, elm) {
                if ($("#menu-font-ref").val() == "Montserrat") {
                    OptionFontTitle = $("#menu-font-ref").val();
                }
            });
            $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", OptionFontTitle);
            this.btnStyleParameters.on('vclick', function () {
                $(`#menu-font-ref option[data-name="${OptionFontTitle}"]`).prop('selected', true);
            }.bind(this));
        } else {
            if (this.fontReference == "") {
                var OptionFontTitle;
                $("#menu-font-ref option").each(function (index, elm) {
                    if ($("#menu-font-ref").val() == "Montserrat") {
                        OptionFontTitle = $("#menu-font-ref").val();
                    }
                });
                $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", OptionFontTitle);
                this.btnStyleParameters.on('vclick', function () {
                    $(`#menu-font-ref option[data-name="${OptionFontTitle}"]`).prop('selected', true);
                }.bind(this));
            } else {
                $("#menu-font-ref").val(this.fontReference).trigger('change');
                $('.projector .reveal-viewport .slides .BlockRef h3 , .projector .reveal-viewport .slides .BlockRef .wrapper-refs').css("font-family", this.fontReference);
                this.btnStyleParameters.on('vclick', function () {
                    $(`#menu-font-ref option[data-name="${this.fontNameReference}"]`).prop('selected', true);
                }.bind(this))
            }
        }

        //render reference title
        if (this.titleReference !== "" && this.titleReference != undefined) {
            $('.projector .reveal-viewport .slides .BlockRef h3').html(this.titleReference);
            $('#content-ref-title').val(this.titleReference)
        } else {
            $('.projector .reveal-viewport .slides .BlockRef h3').html('Reference');
            $('#content-ref-title').val("Reference")
        }

        //render fontSizeTitleReference
        if (this.fontSizeTitleReference == undefined && this.fontSizeTitleReference == "") {
            var sizeTitleRef;
            $("#font-size-select-ref").each(function () {
                if ($("#font-size-select-ref").val() == "Select font size...") {
                    sizeTitleRef = $("#font-size-select-ref").val();
                }
            });
            $("#font-size-select-ref").val(sizeTitleRef).trigger('change');
            $(`#font-size-select-ref option[value="${sizeTitleRef}"]`).prop('selected', true);
        } else {
            if (this.fontSizeTitleReference != "") {
                if ($(`#font-size-select-ref option[value = '${this.fontSizeTitleReference}']`).length == 1) {
                    $('#font-size-select-ref').val(this.fontSizeTitleReference).trigger('change');
                    $(`#font-size-select-ref option[value="${this.fontSizeTitleReference}"]`).prop('selected', true);
                } else {
                    $('#font-size-select-ref').val("Select font size...").trigger('change');
                    $(`#font-size-select-ref option[value="Select font size..."]`).prop('selected', true);
                }
            } else {
                $('#font-size-select-ref').val("Select font size...").trigger('change');
                $(`#font-size-select-ref option[value="Select font size..."]`).prop('selected', true);
            }
        }

        //render fontsize reference content
        if (this.fontSizeRefContent == undefined && this.fontSizeRefContent == "") {
            var sizeTitleRef;
            $("#font-size-select-ref-content").each(function () {
                if ($("#font-size-select-ref-content").val() == "Select font size...") {
                    sizeTitleRef = $("#font-size-select-ref-content").val();
                }
            });
            $("#font-size-select-ref-content").val(sizeTitleRef).trigger('change');
            $(`#font-size-select-ref-content option[value="${sizeTitleRef}"]`).prop('selected', true);
        } else {
            if (this.fontSizeRefContent != "") {
                if ($(`#font-size-select-ref-content option[value = '${this.fontSizeRefContent}']`).length == 1) {
                    $('#font-size-select-ref-content').val(this.fontSizeRefContent).trigger('change');
                    $(`#font-size-select-ref-content option[value="${this.fontSizeRefContent}"]`).prop('selected', true);
                } else {
                    $('#font-size-select-ref-content').val("Select font size...").trigger('change');
                    $(`#font-size-select-ref-content option[value="Select font size..."]`).prop('selected', true);
                }
            } else {
                $('#font-size-select-ref-content').val("Select font size...").trigger('change');
                $(`#font-size-select-ref-content option[value="Select font size..."]`).prop('selected', true);
            }
        }

        //render bg Color reference
        if (this.bgRefColor != "" && this.bgRefColor != undefined) {
            $("#bg-ref-color").spectrum("set", this.bgRefColor);
            $(".reveal div .BlockRef").css("background-color", this.bgRefColor);
            $(".reveal div .BlockRef .arrow-after").css("border-top-color", this.bgRefColor);

        } else {
            $("#bg-ref-color").spectrum("set", "#fff");
            $(".reveal div .BlockRef").css("background-color", "#fff");
            $(".reveal div .BlockRef .arrow-after").css("border-top-color", "#fff");

        }

        //render img bg reference
        if (this.bgRefImg != "") {
            $(".bg-ref").css({
                backgroundImage: `url('${this.bgRefImg}')`,
                display: "block"
            });
            if ($("#reference_apearance .wrapper-bg-ref .del-current-bg").length == 0) {
                $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
            }
        } else {
            $("#reference_apearance .bg-ref").css("display", "none");
        }

        /*Screen paramaeters */
        var bgScreenColor = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color");
        if (bgScreenColor != "" && bgScreenColor != undefined) {
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-color', bgScreenColor);
            Reveal.sync();
        }

        var bgScreenImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img");
        if (bgScreenImg != undefined && bgScreenImg != "") {
            if (SL.editor.controllers.Markup.getCurrentSlide().not('.popin') == false) {
                SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-image', bgScreenImg);
                $(".bg-screen-image").css("background-image", `url('${bgScreenImg}')`);
                $(".bg-screen-image").show();
                if ($(".wrapper-bg-screen-image .del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href='#'><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
                    $(".wrapper-bg-screen-image ").closest('#customize_screen').find('#bg-size-screen').prop('disabled', false);
                }
            }
        } else {
            if (SL.editor.controllers.Markup.getCurrentSlide().not('.popin') == false) {
                if (this.bgPresImg != "" && this.bgPresImg != undefined) {
                    SL.editor.controllers.Markup.getCurrentSlide().css('background-image', `url('${this.bgPresImg}')`)
                } else {
                    SL.editor.controllers.Markup.getCurrentSlide().css('background-image', '')
                }
                $(".bg-screen-image").removeAttr('style');
                $(".bg-screen-image").hide();
                $(".wrapper-bg-screen-image .del-current-bg").remove();
                $(".wrapper-bg-screen-image ").closest('#customize_screen').find('#bg-size-screen').prop('disabled', true);
            }
        }

        //disable swipe
        var disableLeftSwipe = SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav"),
            disableRightSwipe = SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav");
        if (typeof disableLeftSwipe == "undefined") {
            $("#Block_Left_nav").prop('checked', false);
        } else {
            if (disableLeftSwipe == "true") {
                $("#Block_Left_nav").prop('checked', true);
            } else {
                $("#Block_Left_nav").prop('checked', false);
            }
        }

        if (typeof disableRightSwipe == "undefined") {
            $("#Block_right_nav").prop('checked', false);
        } else {
            if (disableRightSwipe == "true") {
                $("#Block_right_nav").prop('checked', true);
            } else {
                $("#Block_right_nav").prop('checked', false);
            }
        }
        //SL.editor.controllers.Menu.updateCreatedMenu(true);
    },
    renderMenuParameters: function(){
        if (this.currentItemColor != "" && this.currentItemColor != undefined) {
            $("#current-item-color").spectrum("set", this.currentItemColor);
            $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", this.currentItemColor);
        } else {
            $("#current-item-color").spectrum("set", "#3e8787");
            $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", "#3e8787");
        }

        //bgColor menu
        if (this.menuBgColor != "" && this.menuBgColor != undefined) {
            $("#bg-menu-color").spectrum("set", this.menuBgColor);
            $(".edit-pres-wrap .slides #wrapperMenuScroll , .edit-pres-wrap .slides .wrapper-submenu").css("background-color", this.menuBgColor);
        } else {
            $("#bg-menu-color").spectrum("set", "#4a5667");
            $(".edit-pres-wrap .slides #wrapperMenuScroll , .edit-pres-wrap .slides .wrapper-submenu").css("background-color", "#4a5667");
        }

        if (this.menuColorItem != "" && this.menuColorItem != undefined) {
            $("#font-menu-color").spectrum("set", this.menuColorItem);
            $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", this.menuColorItem);
            $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", this.menuColorItem);
        } else {
            $("#font-menu-color").spectrum("set", "#fff");
            $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", "#fff");
            $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", "#fff");
        }
        if (this.menuFont != "" && this.menuFont != undefined) {
            $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-family", this.menuFont);
            this.btnStyleParameters.on('vclick', function () {
                $(`#menu-font option[data-name="${this.jsonParameters.dataMenuFontname}"]`).prop('selected', true);
            }.bind(this));
        }

        //render menuFontSize
        this.menuFontSize = this.jsonParameters.dataFontSizeSelect;
        $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-size", (this.menuFontSize != "" ? this.menuFontSize : "15") + "px");
        $(`#font-size-select option[value="${this.menuFontSize}"]`).prop('selected', true);

        // render highlightMenu
        if (this.highlightMenu == "true") {
            $("#highlight_menu").prop('checked', true);
            $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                "background-image": "url(/img/selected.png)"
            });
        } else {
            $("#highlight_menu").prop('checked', false);
            $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                "background-image": "none"
            });
        }

    }
};