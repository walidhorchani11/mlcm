'use strict';

import { AWS } from '../sl/aws/s3';

var pako            = require('pako'),
    http            = require('http'),
    https           = require('https'),
    aws4            = require('aws4'),
    lambda          = new AWS.Lambda(),
    _               = require('underscore'),
    defaultFontList = require('./defaultfontlist'),
    deckSize = require('./size-zip');

export const editor_base = {
    init: function() {
        this._super(),
        //SL.editor.controllers.Capabilities.init(),
        SLConfig.deck.theme_font = SLConfig.deck.theme_font || SL.config.DEFAULT_THEME_FONT,
        SLConfig.deck.theme_color = SLConfig.deck.theme_color || SL.config.DEFAULT_THEME_COLOR,
        SLConfig.deck.transition = SLConfig.deck.transition || SL.config.DEFAULT_THEME_TRANSITION,
        SLConfig.deck.background_transition = SLConfig.deck.background_transition || SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION,
        SLConfig.deck.visibility = SLConfig.deck.visibility || SL.models.Deck.VISIBILITY_ALL,
        this.addHorizontalSlideButton = $(".add-horizontal-slide"),
        this.addVerticalSlideButton = $(".add-vertical-slide"),
        this.previewControlsExit = $(".preview-controls-exit"),
        this.setupPromises = [],
        this.flags = {
            editing: !0,
            saving: !1,
            unsaved: !1,
            newDeck: !SLConfig.deck.id
        },
        this.isNewDeck() && SL.current_user.hasDefaultTheme() && (SLConfig.deck.theme_id = SL.current_user.getDefaultTheme().get("id")),
        this.deckSaved = new signals.Signal,
        this.savedDeck = JSON.parse(JSON.stringify(SLConfig.deck)),
        SL.helpers.PageLoader.show();
        var e = SL.current_user.getThemes().getByProperties({
            id: SLConfig.deck.theme_id
        });
        e ? SL.current_user.isMemberOfCurrentTeam() ? e.load().always(this.setup.bind(this)) : e.load(SL.config.AJAX_DECK_THEME(SLConfig.deck.id)).always(this.setup.bind(this)) : this.setup();
    },
    setup: function() {
        /*SL.fonts.isReady() === !1 && this.setupPromises.push(new Promise(function(e) {
            SL.fonts.ready.add(e)
        })),*/
        SL.keyboard.keydown(this.onDocumentKeyDown.bind(this)),
        this.setupControllers(),
        this.setupComponents(),
        this.setupReveal(),
        this.setupTheme(),
        this.setupWYSIWYG(),
        this.setupDefaultContent(),
        //this.setupActivityMonitor(),
        this.preloadWYSIWYG(),
        this.modifiedSlidesIds = [],
        this.changeInterval = setInterval(this.checkChanges.bind(this),
        SL.config.UNSAVED_CHANGES_INTERVAL),
        this.saveInterval = setInterval(this.checkAutoSave.bind(this),
        SL.config.AUTOSAVE_INTERVAL),
        $("html").toggleClass("is-new", this.isNewDeck()),
        $("html").toggleClass("rtl", SLConfig.deck.rtl),
        this.bind(),
        this.enableEditing(),
        //this.setupCollaboration(),
        this.layout(),
        setTimeout(function() {
            SL.editor.controllers.DeckImport.init(this),
            SL.editor.controllers.Onboarding.init(this),
            SLConfig.deck.data = SL.editor.controllers.Serialize.getDeckAsString(),
            this.firstSlideData = SL.editor.controllers.Serialize.getFirstSlideAsString(),
            this.toolbars.sync(),
            this.checkChanges(),
            this.saveListener(),
            SL.editor.controllers.Rcp.init(this)
        }.bind(this), 1),
        Promise.all(this.setupPromises).then(function() {
            SL.util.deck.afterSlidesChanged(),
            SL.helpers.PageLoader.hide(),
            $("html").addClass("editor-loaded-successfully")
        })
    },
    setupControllers: function() {
        SL.editor.controllers.Popin.init(this),
        SL.editor.controllers.Appearence.init(this),
        SL.editor.controllers.Presentation.init(this),
        SL.editor.controllers.Pdf.init(this),
        SL.editor.controllers.Survey.init(this),
        SL.editor.controllers.References.init(this),
        SL.editor.controllers.Addtext.init(this),
        SL.editor.controllers.Serialize.init(this),
        SL.editor.controllers.Contrast.init(this),
        SL.editor.controllers.Blocks.init(this),
        SL.editor.controllers.Media.init(this),
        SL.editor.controllers.History.init(this),
        SL.editor.controllers.Markup.init(this),
        SL.editor.controllers.Menu.init(this),
        SL.editor.controllers.Migration.init(this),
        SL.editor.controllers.Selection.init(this),
        SL.editor.controllers.Guides.init(this),
        SL.editor.controllers.Grid.init(this),
        SL.editor.controllers.URL.init(this),
        SL.editor.controllers.Mode.init(this, {
            css: new SL.editor.modes.CSS(this),
            arrange: new SL.editor.modes.Arrange(this)
            //preview: new SL.editor.modes.Preview(this),
            //fragment: new SL.editor.modes.Fragment(this)
        }),
        SL.editor.controllers.Mode.modeActivated.add(function() {
            SL.editor.controllers.Blocks.blur()
        }.bind(this)),
        SL.editor.controllers.Mode.modeDeactivated.add(function() {
            Reveal.configure({
                //minScale: SL.editor.controllers.Capabilities.isTouchEditor() ? .4 : 1
                minScale: 1
            }),
            setTimeout(Reveal.layout, 1),
            this.layout(),
            SL.editor.controllers.Grid.refresh()
        }.bind(this)),
        SL.session.enforce()
    },
    setupComponents: function() {
        this.sidebar = new SL.editor.components.Sidebar,
        this.toolbars = new SL.editor.components.Toolbars(this),
        this.colorpicker = new SL.editor.components.Colorpicker,
        // this.slideOptions = new SL.editor.components.SlideOptions(this, {
        //     html: this.isDeveloperMode(),
        //     fragment: !SL.editor.controllers.Capabilities.isTouchEditorSmall()
        // }),
        this.slideOptions = new SL.editor.components.SlideOptions(this),
        //this.slideOptions.syncRemoveSlide(),
        this.templates = new SL.components.Templates
    },
    setupCollaboration: function() {
        this.collaboration = new SL.components.collab.Collaboration({
            container: document.body,
            editor: !0,
            coverPage: !0
        }), SLConfig.deck.collaborative && (this.setupPromises.push(new Promise(function(e) {
            this.collaboration.loaded.add(e)
        }.bind(this))), this.collaboration.load())
    },
    setupReveal: function() {
        var e = {
            controls: !0,
            progress: !1,
            history: !1,
            center: !1,
            touch: !1,
            fragments: !1,
            help: !1,
            pause: !1,
            mouseWheel: !1,
            rollingLinks: !1,
            margin: .16,
            minScale: 1,
            maxScale: 1,
            keyboard: {
                27: null,
                70: null
            },
            keyboardCondition: function() {
                //return SL.editor.controllers.Mode.get("preview").isActive() || 0 === SL.editor.controllers.Blocks.getFocusedBlocks().length && !this.sidebar.isExpanded()
                return 0 === SL.editor.controllers.Blocks.getFocusedBlocks().length && !this.sidebar.isExpanded()
            }.bind(this),
            rtl: SLConfig.deck.rtl,
            loop: SLConfig.deck.should_loop,
            slideNumber: SLConfig.deck.slide_number,
            transition: SLConfig.deck.transition,
            backgroundTransition: SLConfig.deck.background_transition
        };
        // SL.editor.controllers.Capabilities.isTouchEditor() && (e.margin = .05, e.minScale = .4),
        // SL.editor.controllers.Capabilities.isTouchEditorSmall() && (e.margin = .12),
        Reveal.initialize(e), Reveal.addEventListener("ready", function() {
            this.addHorizontalSlideButton.addClass("show"),
            this.addVerticalSlideButton.addClass("show"),
            SL.editor.controllers.Blocks.sync(),
            SL.editor.controllers.Blocks.discoverBlockPairs()
        }.bind(this)), Reveal.addEventListener("slidechanged", function(e) {
            e.previousSlide && SL.editor.controllers.Blocks.blurBlocksBySlide(e.previousSlide),
            SL.editor.controllers.Blocks.sync(),
            SL.editor.controllers.Blocks.discoverBlockPairs()/*,
            SL.editor.controllers.Menu.navbarAppearance()*/
            //this.checkOverflow()
        }.bind(this))
    },
    setupTheme: function() {
        var e = SL.current_user.getThemes().getByProperties({
            id: SLConfig.deck.theme_id
        });
        e ? (SLConfig.deck.transition = e.get("transition"), SLConfig.deck.backgroundTransition = e.get("background_transition")) : e = SL.models.Theme.fromDeck(SLConfig.deck), SL.helpers.ThemeController.paint(e, {
            center: !1
        }), this.syncPageBackground()
    },
    setupWYSIWYG: function() {
        CKEDITOR.timestamp = "34505052016",
        CKEDITOR.on("dialogDefinition", function(e) {
            e.data.definition.resizable = CKEDITOR.DIALOG_RESIZE_NONE
        }),
        CKEDITOR.on("instanceReady", function(e) {
            e.editor.on("paste", function(e) {
                e.data && "html" === e.data.type && (e.data.dataValue = e.data.dataValue.replace(/(font\-size|line\-height):\s?\d+(px|em|pt|%)?;/gi, "")), SL.view.layout(), setTimeout(SL.view.layout.bind(SL.view), 1)
            }, null, null, 9)
            $('.cke').find('.cke_top').find('.cke_combo.cke_combo__styles.cke_combo_off').remove()
            $('.cke').find('.cke_top').find('.cke_combo.cke_combo__format.cke_combo_off').remove()
        }),
        CKEDITOR.disableAutoInline = !0,
        CKEDITOR.config.floatSpaceDockedOffsetY = 1,
        CKEDITOR.config.title = !1,
        CKEDITOR.config.allowedContent = true,
        CKEDITOR.config.enterMode = CKEDITOR.ENTER_P,
        CKEDITOR.config.shiftEnterMode = CKEDITOR.ENTER_BR,
        CKEDITOR.config.coreStyles_bold = { element: 'span', styles: { 'font-weight' : 'bold' } },
        CKEDITOR.config.coreStyles_italic = { element: 'span', styles: { 'font-style' : 'italic' } },
        CKEDITOR.config.language = TWIG.currentLanguage,
        CKEDITOR.config.font_names = "Arial/Arial, Helvetica, sans-serif;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif",
        CKEDITOR.config.removePlugins = "showblocks,image,flash,horizontalRule,smiley,iframe,pagebreak,forms,checkbox,radio,textfield,hiddenfield,imagebutton,select,textarea",
        CKEDITOR.config.removeButtons = 'Table,HorizontalRule,SpecialChar,button';
    },
    preloadWYSIWYG: function() {
        var e = $("<p>").hide().appendTo(document.body),
            t = CKEDITOR.inline(e.get(0));
        t && t.on("instanceReady", function() {
            t.destroy(), e.remove()
        }.bind(this))
    },
    setupDefaultContent: function() {
        this.isNewDeck() && SL.editor.controllers.Markup.replaceCurrentSlide(SL.data.templates.getNewDeckTemplate().get("html"))
        $('.slides section').removeAttr('data-thumb-saved');
    },
    setupActivityMonitor: function() {
        SL.activity.register(1e4, function() {
            this.isNewDeck() || this.hasShownOutdatedMessage || $.ajax({
                url: SL.config.AJAX_GET_DECK(SL.current_deck.get("id")),
                type: "GET",
                context: this
            }).done(function(e) {
                var t = SL.current_deck.get("data_updated_at"),
                    i = e.data_updated_at,
                    n = "number" == typeof t && !isNaN(t),
                    r = "number" == typeof i && !isNaN(i);
                n && r && i > t && (SL.popup.openOne(SL.components.popup.DeckOutdated), this.hasShownOutdatedMessage = !0, SL.analytics.trackEditor("Warning: Newer deck on server"))
            }.bind(this))
        }.bind(this))
    },
    bind: function() {
        $(window).on("keyup", this.onWindowKeyUp.bind(this)),
        $(window).on("beforeunload", this.onWindowBeforeUnload.bind(this)),
        $(window).on("resize", this.onWindowResize.bind(this)),
        this.addHorizontalSlideButton.on("vclick", this.onAddHorizontalSlideClicked.bind(this)),
        this.addVerticalSlideButton.on("vclick", this.onAddVerticalSlideClicked.bind(this)),
        this.previewControlsExit.on("vclick", this.onExitPreviewClicked.bind(this)),
        this.sidebar.saveClicked.add(this.save.bind(this)),
        this.sidebar.previewClicked.add(this.onEnterPreviewClicked.bind(this)),
        this.onUndoOrRedo = this.onUndoOrRedo.bind(this),
        this.onSaveTimeout = this.onSaveTimeout.bind(this)
        // SL.editor.controllers.History.undid.add(this.onUndoOrRedo),
        // SL.editor.controllers.History.redid.add(this.onUndoOrRedo)
    },
    layout: function() {
        var e = this.getSlideSize({
                scaled: !0
            }),
            t = window.innerWidth - this.getSidebarWidth(),
            i = window.innerHeight,
            n = this.slideOptions.getWidth(),
            r = "r",
            o = {
                left: (t + e.width) / 2,
                top: (i - e.height) / 2,
                marginLeft: 0,
                marginTop: 0
            };
        if (this.collaboration) {
            var s = this.collaboration.getCollapsedWidth();
            o.left = Math.min(o.left, t - n - s), o.top = Math.max(o.top, 0), o.left + n < (t + e.width) / 2 && (o.left = (t - e.width) / 2 - n, o.left = Math.max(o.left, 10), r = "l")
        } else o.left = Math.min(o.left, t - n), o.top = Math.max(o.top, 0);
        o.left = Math.round(o.left), o.top = Math.round(o.top), this.slideOptions.domElement.css(o), this.slideOptions.setAlignment(r);
        var a = $(".reveal").get(0);
        (a && 0 !== a.scrollTop || 0 !== a.scrollLeft) && (a.scrollTop = 0, a.scrollLeft = 0)
    },
    disablekeys: function() {
        $(document).on('keydown', function(e) {
            if ((e.which || e.keyCode) === 27 || (e.which || e.keyCode) === 79 ) {
                e.preventDefault();
                return false;
            }
        })
    },
    checkChanges: function() {
        //console.log('check changes');
        if (!this.isSaving()) {

            var e       = SL.editor.controllers.Serialize.getDeckAsString(),
                slideId = SL.editor.controllers.Markup.getCurrentSlide().attr('data-id');

            SL.pointer.isDown() || SL.editor.controllers.History.push(e);

            var t = e !== SLConfig.deck.data,
                i = SLConfig.deck.dirty;

            //this.flags.unsaved = !(!t && !i),
            this.flags.unsaved = !(!t),
            this.hasUnsavedChanges() ? (
                this.sidebar.updateSaveButtonStatus(false, TWIG.infoBulle.saveChange),
                $('.saveBtn button.save').attr('data-saved', false)
            ) : (
                this.sidebar.updateSaveButtonStatus(true, TWIG.infoBulle.changesSaved),
                $('.saveBtn button.save').attr('data-saved', true)
            )
        }
        //this.checkOverflow()
    },
    checkAutoSave: function() {
        this.hasUnsavedChanges() && this.save()
       //this.hasUnsavedChanges() && !SL.editor.controllers.DeckImport.isImporting() && this.save()
    },
    checkOverflow: function() {
        var e = 0,
            t = SL.editor.controllers.Blocks.getCombinedBounds(SL.editor.controllers.Blocks.getCurrentBlocks());
        t.y < -e || t.x < -e || t.right > SL.config.SLIDE_WIDTH + e || t.bottom > SL.config.SLIDE_HEIGHT + e ? (SL.editor.controllers.Markup.getCurrentSlide().addClass("overflowing"), this.slideOptions.showOverflowWarning()) : (SL.editor.controllers.Markup.getCurrentSlide().removeClass("overflowing"), this.slideOptions.hideOverflowWarning())
    },
    save: function(e) {
        this.isSaving() || (this.flags.saving = !0, clearTimeout(this.saveTimeout),
        this.saveTimeout = setTimeout(this.onSaveTimeout, SL.config.DECK_SAVE_TIMEOUT),
        //this.sidebar.updateSaveButton("disabled is-saving", "Saving changes"),
        //this.isNewDeck() ? this.createDeck(e) : this.updateDeck(e))
        process.env.SAVEAUTO ? this.updateDeck(e) : '')
    },
    getSaveData: function(e) {
        var t = {
            deck: {
                title: SL.util.unescapeHTMLEntities((SLConfig.deck.title || "").substr(0, SL.config.DECK_TITLE_MAXLENGTH)),
                description: SL.util.unescapeHTMLEntities(SLConfig.deck.description),
                data: SL.util.string.trim(e),
                css_input: SLConfig.deck.css_input,
                css_output: SLConfig.deck.css_output,
                comments_enabled: SLConfig.deck.comments_enabled,
                forking_enabled: SLConfig.deck.forking_enabled,
                auto_slide_interval: SLConfig.deck.auto_slide_interval,
                transition: SLConfig.deck.transition,
                background_transition: SLConfig.deck.background_transition,
                theme_font: SLConfig.deck.theme_font,
                theme_color: SLConfig.deck.theme_color,
                should_loop: SLConfig.deck.should_loop,
                rtl: SLConfig.deck.rtl,
                share_notes: SLConfig.deck.share_notes,
                slide_number: SLConfig.deck.slide_number,
                notes: JSON.stringify(SLConfig.deck.notes),
                rolling_links: !1,
                center: !1
            },
            version: SL.editor.Editor.VERSION
        };
        return SLConfig.deck.slug !== this.savedDeck.slug && (t.deck.custom_slug = SLConfig.deck.slug), SL.current_user.hasThemes() && (t.deck.theme_id = SLConfig.deck.theme_id), t
    },
    createDeck: function(e) {
        var t = SL.editor.controllers.Serialize.getDeckAsString(),
            i = SLConfig.deck.title;
        if (!i) {
            var n = $(Reveal.getSlide(0)).find("h1").text().trim();
            n && /^(untitled|title\stext)$/gi.test(n) === !1 && (SLConfig.deck.title = n.substr(0, SL.config.DECK_TITLE_MAXLENGTH))
        }
        var r = {
            type: "POST",
            url: SL.config.AJAX_CREATE_DECK(SLConfig.current_user.username),
            context: this,
            data: this.getSaveData(t)
        };
        $.ajax(r).done(function(i) {
            $.extend(SLConfig.deck, i), SLConfig.deck.data_updated_at = i.data_updated_at, SLConfig.deck.data = t, SLConfig.deck.dirty = !1, $("html").removeClass("is-new"), this.flags.newDeck = !1, SL.editor.controllers.URL.write(), SL.editor.controllers.Thumbnail.generate(), this.onSaveSuccess(e, i), cseparateslidepopin()
        }).fail(function(t) {
            this.onSaveError(e, t)
        }).always(function() {
            this.onSaveFinished(e)
        })
    },
    generatePresentationThumbAction: function() {

        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            idCompany   = TWIG.idCompany,
            compnayName = TWIG.companyParentName.replace(/\s/g, '-'),
            thumburl    = `${window.location.protocol}//${window.location.host}${TWIG.phantom_preview}/en/my-clm-presentations/${idRev}/preview-pdf#/`;

        if (idPres && idRev && idCompany) {
            if (process.env.ISPROD) {
                    // let requestParamsBody = {
                    //         "urls"          : [thumburl],
                    //         "companyName"   : compnayName
                    //     },
                    //     requestParamsHeader = `?idpres=${idPres}&idrev=${idRev}&idcompany=${idCompany}`;

                    //this.ajaxApiGateway(process.env.APIHOSTPRESTHUMB, '/prod/presentation-thumbnail', 'POST', requestParamsHeader, requestParamsBody, this.presentationThumbnailDatabaseSave(idPres, idRev, idCompany, compnayName));

                    /* Invoke lambda create thumbnail presentation */
                    let folderName = `${compnayName}/thumbs`,
                        params = {
                            FunctionName : 'veeva-summit-thumb-presentation', /* required */
                            Payload      : JSON.stringify({
                                bucketTarget    : process.env.ENV_BUCKET,
                                urls            : [thumburl],
                                companyName     : compnayName,
                                idPres          : idPres,
                                idRev           : idRev,
                                idCompany       : idCompany,
                                folderName      : folderName
                            })
                        };

                    lambda.invoke(params, function(err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        } else {
                            console.log(data); // successful response
                            this.presentationThumbnailDatabaseSave(idPres, idRev, idCompany, compnayName)
                        }
                    }.bind(this));
                return;
            }

            $.ajax({
                method      : 'POST',
                url         : Routing.generate('thumbnails_generate', { idPres: idPres, idRev: idRev, action: 'presentation_thumb' }),
                data        : JSON.stringify({
                    'previewurl'    : thumburl,
                    'size'          : 'width: 200, height: 150',
                    'fileName'      : 'thumb-' + idPres + '.png',
                    'jsfile'        : 'thumb.js',
                    'dbSave'        : true
                })
            }).done(function() {
                console.log('thumb created with success');
            })
            .fail(function(jqxhr) {
                console.log('error creating thumb');
            })
        }
    },
    presentationThumbnailDatabaseSave: function(idPres, idRev, idCompany, companyName) {
        $.ajax({
            method      : 'GET',
            url         : Routing.generate('pres_thumbnail_s3_generate', { idPres: idPres, idRev: idRev, idCompany: idCompany, companyName: companyName, thumbFolderName: 'thumbs', bucket: process.env.ENV_BUCKET})
        }).done(function() {
            console.log('thumb created with success');
        })
        .fail(function() {
            console.log('error creating thumb');
        })
    },
    generateSlidesListThumbsAction: function(slidesList) {

        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            idCompany   = TWIG.idCompany,
            compnayName = TWIG.companyParentName,
            urls        = [],
            thumburl    = `${window.location.protocol}//${window.location.host}${TWIG.phantom_preview}/en/my-clm-presentations/${idRev}/preview-pdf#/`;

        compnayName = compnayName.replace(/\s/g, '-');

            if (process.env.ISPROD) {
                _.each(slidesList, function(value, key) {
                    if (typeof value.h === 'undefined') {
                        value.h = 0;
                    }
                    if (typeof value.v === 'undefined') {
                        value.v = 0;
                    }
                    urls.push(thumburl + value.h + '/' + value.v + '/' + value.id);
                }.bind(this));

                /* Invoke lambda generate all screens thumbnails */
                let folderName = `${compnayName}/thumbs`,
                    params = {
                        FunctionName : 'veeva-summit-thumb-slides-queue', /* required */
                        Payload      : JSON.stringify({
                            bucketTarget    : process.env.ENV_BUCKET,
                            urls            : urls,
                            companyName     : compnayName,
                            idPres          : idPres,
                            idRev           : idRev,
                            idCompany       : idCompany,
                            folderName      : `${folderName}/${idPres}-${idRev}/slides`
                        })
                    };

                lambda.invoke(params, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                    } else {
                        console.log(data); // successful response
                    }
                }.bind(this));

                //this.ajaxApiGateway(process.env.APIHOSTPRESALLTHUMB, '/prod/slidesqueue', 'POST', '', requestParamsBody);
                return;
            }

        _.each(slidesList, function(value, key) {
            if (typeof value.h === 'undefined') {
                value.h = 0;
            }
            if (typeof value.v === 'undefined') {
                value.v = 0;
            }
            urls += thumburl + value.h + '/' + value.v + '/' + value.id +' ';
        }.bind(this));

        if (idPres && idRev && urls !== '') {
            $.ajax({
                method      : 'POST',
                url         : Routing.generate('presentation_thumbnails', { idPres: idPres, idRev: idRev }),
                data        : JSON.stringify({
                    'urls'              : urls,
                    'modelPath'         : TWIG.phantomjsmodels+'render_multi_url.js',
                    'model'             : 'render_multi_url.js',
                    'modelPathResize'   : TWIG.phantomjsmodels+'render_multi_url_veeva.js',
                    'modelResize'       : 'render_multi_url_veeva.js'
                })
            }).done(function() {
                console.log('Slides thumbs created with success');
            })
            .fail(function() {
                console.log('error creating thumb');
            })
        }
    },
    generatePopinsListThumbnailsAction: function(popinsList) {
        if (process.env.ISPROD) {

            let idRev       = TWIG.idRev,
                idPres      = TWIG.idPres,
                idCompany   = TWIG.idCompany,
                compnayName = TWIG.companyParentName,
                urls        = [],
                thumburl    = `${window.location.protocol}//${window.location.host}${TWIG.phantom_preview}/en/my-clm-presentations/${idRev}`;

            compnayName = compnayName.replace(/\s/g, '-');

            _.each(popinsList, function(value, key) {
                urls.push(`${thumburl}/${value.id}/${value.height}/${value.width}/popin#/`);
            }.bind(this));

            // let requestParamsBody = {
            //     "urls"          : urls,
            //     "idPres"        : idPres,
            //     "idRev"         : idRev,
            //     "idCompany"     : idCompany,
            //     "companyName"   : compnayName
            // };
            //this.ajaxApiGateway(process.env.APIHOSTPRESALLPOPINTHUMB, '/prod/popinsqueue', 'POST', '', requestParamsBody);

            /* Invoke lambda generate all screens thumbnails */
            let folderName = `${compnayName}/thumbs`,
                params = {
                    FunctionName : 'veeva-summit-thumb-popins-queue', /* required */
                    Payload      : JSON.stringify({
                        bucketTarget    : process.env.ENV_BUCKET,
                        urls            : urls,
                        companyName     : compnayName,
                        idPres          : idPres,
                        idRev           : idRev,
                        idCompany       : idCompany,
                        folderName      : `${folderName}/${idPres}-${idRev}`
                    })
                };

            lambda.invoke(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data); // successful response
                }
            }.bind(this));
            return;
        }
        SL.editor.controllers.Popin.generateSavedPopinsThumbMultiple(popinsList);
    },
    ajaxApiGateway: function(host, apiAction, method, requestParamsHeader, requestParamsBody, successAction) {

        let service         = 'execute-api',
            contentType     = 'application/json',
            date            = new Date(),
            opts            = {
                method  : `${method}`,
                service : `${service}`,
                region  : process.env.REGION,
                path    : `${apiAction}${requestParamsHeader}`,
                headers : {
                    'Content-Type'  : `${contentType}`,
                    'Host'          : `${host}`,
                    'X-Amz-Date'    : this.amzLongDate(date)
                }
            };

        if (requestParamsBody) {
            opts.body = JSON.stringify(requestParamsBody);
        }

        aws4.sign(opts);

        var settings = {
            "async"         : true,
            "crossDomain"   : true,
            "url"           : `https://${host}${apiAction}${requestParamsHeader}`,
            "method"        : opts.method,
            "headers"       : opts.headers,
            "data"          : opts.body
        }

        $.ajax(settings)
            .done(function (response) {
                console.log('success');
                if (successAction) {
                    successAction;
                }
            }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
                console.log("Request failed: " + textStatus + jqXHR + errorThrown);
            });
    },
    amzLongDate: function(date) {
        return date.toISOString().replace(/[:\-]|\.\d{3}/g, '').substr(0, 17);
    },
    updateDeck: function(e) {
        console.log('updateDeck');

        let totalSlides = $('.slides section').not(".popin, .popin-overview, .stack").length;

        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            preventDuplicates: true
        };

        if (totalSlides === Reveal.getTotalSlides()) {
            this.normalizeSlides();
            this.saveAction(true);
        } else {
            toastr.error("Your presentation cannot be saved due to structure errors. Please contact our support team through support-mcmbuilder@argolife.fr");
        }

        // var n = SL.editor.controllers.Serialize.getFirstSlideAsString();
        // (this.firstSlideData !== n || SL.editor.controllers.Thumbnail.isInvalidated()) && (this.firstSlideData = n,
        //     this.generateThumb(e)
        //     // SL.editor.controllers.Thumbnail.generate()
        // )
        // var $html_to_save = $('.slides').clone(true, true);

        // // Remove editing style
        // $html_to_save.find('.sl-block.is-focused div.sl-block-transform.editing-ui.visible').remove();

        // var sk = $html_to_save.html();
        // sk = sk.replace(/&quot;/g, "").replace(/"/g, "'");
        // var t = SL.editor.controllers.Serialize.getDeckAsString(),
        //     i = {
        //         type: "PUT",
        //         url: SL.config.AJAX_UPDATE_DECK(this.savedDeck ? this.savedDeck.id : SLConfig.deck.id),
        //         context: this,
        //         data: "dt=" + sk,
        //     };
        // $.ajax(i).done(function(i) {
        //     i && i.deck && (i.deck.slug && (SLConfig.deck.slug = i.deck.slug, SL.editor.controllers.URL.write()), SLConfig.deck.data_updated_at = i.deck.data_updated_at), SLConfig.deck.data = t, SLConfig.deck.dirty = !1;
        //     var n = SL.editor.controllers.Serialize.getFirstSlideAsString();
        //     (this.firstSlideData !== n || SL.editor.controllers.Thumbnail.isInvalidated()) && (this.firstSlideData = n, SL.editor.controllers.Thumbnail.generate())
        //     //,this.onSaveSuccess(e, i)
        // }).fail(function(t) {
        //     this.onSaveError(e, t)
        // }).always(function() {
        //     //this.onSaveFinished(e);
        // });
    },
    onSaveSuccess: function(e, t) {
        this.savedDeck = JSON.parse(JSON.stringify(SLConfig.deck)),
            t && t.deck && t.deck.sanitize_messages && t.deck.sanitize_messages.length && SL.notify(t.deck.sanitize_messages[0], "negative"),
            this.unableToSaveWarning && this.unableToSaveWarning.hide(),
            e && e.apply(null, [!0]), this.deckSaved.dispatch()
    },
    onSaveError: function(e, t) {
        401 === t.status && SL.session.check(), this.unableToSaveWarning || (this.unableToSaveWarning = new SL.components.RetryNotification(SL.locale.get("DECK_SAVE_ERROR"), {
            type: "negative"
        }), this.unableToSaveWarning.destroyed.add(function() {
            this.unableToSaveWarning = null
        }.bind(this)), this.unableToSaveWarning.retryClicked.add(function() {
            this.unableToSaveWarning.destroy(), this.save()
        }.bind(this))), this.hasUnsavedChanges() && this.unableToSaveWarning.startCountdown(SL.config.AUTOSAVE_INTERVAL), e && e.apply(null, [!1])
    },
    onSaveFinished: function(slidesArray, popinsArray) {
        if (slidesArray && slidesArray.length > 0) {
            this.generateSlidesListThumbsAction(slidesArray);
        }
        if (popinsArray && popinsArray.length > 0) {
            this.generatePopinsListThumbnailsAction(popinsArray);
        }
        this.flags.saving = !1,
        clearTimeout(this.saveTimeout),
        this.checkChanges()
        // $("html").addClass("editor-saved-successfully")
    },
    onSaveTimeout: function() {
        SLConfig.deck.dirty = !0,
        this.flags.saving = !1,
        clearTimeout(this.saveTimeout)
    },
    hasSavedThisSession: function() {
        return $("html").hasClass("editor-saved-successfully")
    },
    saveVisibility: function(e) {
        if (this.isNewDeck()) return this.save(this.saveVisibility.bind(this, e)), !1;
        var t = {
            type: "POST",
            url: SL.config.AJAX_PUBLISH_DECK(SLConfig.deck.id),
            context: this,
            data: {
                visibility: SLConfig.deck.visibility
            }
        };
        $.ajax(t).done(function(e) {
            $("html").attr("data-visibility", SLConfig.deck.visibility), e.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : e.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : e.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), this.sidebar.updatePublishButton(), SLConfig.deck.data_updated_at = e.deck.data_updated_at
        }).fail(function() {
            this.sidebar.updatePublishButton(), SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
        })
    },
    navigateToSlide: function(e) {
        if (e) {
            var t = Reveal.getIndices(e);
            setTimeout(function() {
                Reveal.slide(t.h, t.v)
            }, 1)
        }
    },
    enableEditing: function() {
        this.flags.editing = !0, $("html").addClass("is-editing")
    },
    disableEditing: function() {
        this.flags.editing = !1, $("html").removeClass("is-editing")
    },
    redirect: function(e, t) {
        t === !0 && (this.flags.unsaved = !1), window.location = e
    },
    syncPageBackground: function() {
        $("html, body").css("background-color", SL.util.deck.getBackgroundColor())
    },
    getCurrentTheme: function() {
        var e = SL.current_user.getThemes().getByProperties({
            id: SLConfig.deck.theme_id
        });
        return e || (e = SL.models.Theme.fromDeck(SLConfig.deck)), e
    },
    getSlideSize: function(e) {
        var t = Reveal.getConfig(),
            i = 1;
        return e && e.scaled && (i = Reveal.getScale()), {
            width: t.width * i,
            height: t.height * i
        }
    },
    getSidebarWidth: function() {
        var e = 70,
            t = 170;
        return e + t
    },
    // isDeveloperMode: function() {
    //     return SL.current_user.settings.get("developer_mode") && !SL.editor.controllers.Capabilities.isTouchEditor()
    // },
    isEditing: function() {
        return this.flags.editing
    },
    isSaving: function() {
        return this.flags.saving
    },
    isNewDeck: function() {
        return this.flags.newDeck
    },
    hasUnsavedChanges: function() {
        return this.flags.unsaved
    },
    onThemeChanged: function() {
        this.toolbars.sync(), this.slideOptions.syncCustomClasses(), this.syncPageBackground()
    },
    onUserInput: function() {
        clearInterval(this.saveInterval), this.saveInterval = setInterval(this.checkAutoSave.bind(this), SL.config.AUTOSAVE_INTERVAL)
    },
    onAddHorizontalSlideClicked: function(e) {
        e.preventDefault(), e.shiftKey ? SL.editor.controllers.Markup.addHorizontalSlide() : this.templates.show({
            anchor: this.addHorizontalSlideButton,
            alignment: SLConfig.deck.rtl ? "l" : "r",
            callback: function(e) {
                SL.editor.controllers.Markup.addHorizontalSlide(e)
            }
        })
    },
    onAddVerticalSlideClicked: function(e) {
        e.preventDefault(), e.shiftKey ? SL.editor.controllers.Markup.addVerticalSlide() : this.templates.show({
            anchor: this.addVerticalSlideButton,
            alignment: "b",
            callback: function(e) {
                SL.editor.controllers.Markup.addVerticalSlide(e)
            }
        })
    },
    onEnterPreviewClicked: function() {
        SL.editor.controllers.Mode.change("preview")
    },
    onExitPreviewClicked: function(e) {
        e.preventDefault(), SL.editor.controllers.Mode.clear()
    },
    onWindowKeyUp: function() {
        this.onUserInput()
    },
    onDocumentKeyDown: function(e) {
        if (27 === e.keyCode) {
            var t = $("input:focus, textarea:focus, [contenteditable]:focus"),
                i = $(Reveal.getCurrentSlide()),
                n = SL.editor.controllers.Mode.get();
            if (n && n.isActive() && "css" === n.getID()) return !1;
            if (SL.popup.isOpen()) return !1;
            if (this.sidebar.currentPanel != null) {
                if ($(this.sidebar.currentPanel.domElement[0]).hasClass('export') == false) {
                    t && t.length ? t.blur() : this.sidebar.isExpanded() ? this.sidebar.close() :
                    this.colorpicker.isVisible() ? this.colorpicker.hide() :
                    this.slideOptions.hasOpenPanel() ? this.slideOptions.collapse() :
                    this.toolbars.hasOpenPanel() ? this.toolbars.collapse() :
                    SL.editor.controllers.Blocks.getFocusedBlocks().length ? SL.editor.controllers.Blocks.blur() :
                    n && n.isActive() && /(absolute|fragment|preview)/gi.test(n.getID()) ? (n.deactivate(), /(absolute|fragment)/gi.test(n.getID()) && i.focus()) :
                    Reveal.toggleOverview()
                }
            }
        } else {
            if (SL.util.isTypingEvent(e)) return !0;
            var r = this.sidebar.isExpanded(),
                o = e.metaKey || e.ctrlKey;
            8 === e.keyCode ? e.preventDefault() : o && 83 === e.keyCode ? (this.hasUnsavedChanges() && this.save(), e.preventDefault()) : !r && o && 89 === e.keyCode ? (SL.editor.controllers.History.redo(), e.preventDefault()) : !r && o && e.shiftKey && 90 === e.keyCode ? (SL.editor.controllers.History.redo(), e.preventDefault()) : !r && o && 90 === e.keyCode ? (SL.editor.controllers.History.undo(), e.preventDefault()) : r || !o || e.shiftKey || 70 !== e.keyCode ? !r && e.shiftKey && e.altKey && 70 === e.keyCode ? (SL.editor.controllers.Mode.toggle("fragment"), e.preventDefault()) : !r && e.shiftKey && e.altKey && 78 === e.keyCode ? (this.slideOptions.triggerNotes(), e.preventDefault()) : !r && e.shiftKey && e.altKey && 72 === e.keyCode && (this.slideOptions.triggerHTML(), e.preventDefault()) : (SL.editor.controllers.Mode.toggle("preview"), e.preventDefault())
        }
        return !0
    },
    onWindowBeforeUnload: function() {
        return this.hasUnsavedChanges() ? SL.locale.get("LEAVE_UNSAVED_DECK") : void 0
    },
    onWindowResize: function() {
        Reveal.layout(), this.layout()
    },
    onUndoOrRedo: function(e) {
        SL.util.skipCSSTransitions($("html"), 100), SL.editor.controllers.Mode.clear(), SL.editor.controllers.Blocks.blur(), $(".reveal .slides").html(e.data), Reveal.sync(), Reveal.slide(e.indices.h, e.indices.v), this.slideOptions.syncRemoveSlide(), SL.editor.controllers.Blocks.sync();
        var t = SL.editor.controllers.Mode.get(e.mode);
        t ? t.activate() : e.focusedBlocks && e.focusedBlocks.length && SL.editor.controllers.Blocks.getCurrentBlocks().forEach(function(t) {
            e.focusedBlocks.forEach(function(e) {
                t.getID() === e && SL.editor.controllers.Blocks.focus(t, !0)
            })
        })
    },
    normalizeSlides: function() {
        let slides          = '.slides section > *',
            popins          = '.slidespop section > *',
            popinsSection   = '.slides section > *',
            classBloc       = '.sl-block',
            $popins         = $('.slidespop section , .slides section.popin');

        $(`${slides}, ${popins}`).not('section, div.sl-block, div.BlockRefOverlay, div.BlockRef, div.block-AdditionalText').remove();
        // Remove link to screen, link to popin, ref attributes
        $popins.find(`${classBloc} .BlockRefOverlay, ${classBloc} .BlockRef, ${classBloc} sup.ref-container, ${classBloc} div#linkedpopin, ${classBloc} div#linkedscreen, ${classBloc} .ref-container`).remove();
        $popins.find(`${classBloc}`).removeClass('is-focused').removeAttr('data-popup data-link');
    },
    saveListener: function() {
        $('#save_pres').on('click', function () {
            let totalSlides = $('.slides section').not(".popin, .popin-overview, .stack").length;

            deckSize.getSize();

            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                preventDuplicates: true
            };

            if (totalSlides === Reveal.getTotalSlides()) {
                this.normalizeSlides();
                this.saveAction(false)
            } else {
                toastr.error("Your presentation cannot be saved due to structure errors. Please contact our support team through support-mcmbuilder@argolife.fr");
            }
        }.bind(this));
    },
    fixPopinIds: function() {
        _.each($('.slidespop section.popin'), function(value, key) {
            let popinId = $(value).attr('data-id');

            $(value).attr('class', `popin ${popinId}`);
        });
    },
    fixOldlinkedScreenIds: function() {
        let linkedObjects   = $('.sl-block > #linkedscreen'),
            linkToMenu      = '',
            sectionsMenu    = [];

        _.each($('.slides section:not(.stack)'), function(value, key) {
            let sectionLinkId   = {};

            sectionLinkId.id        = $(value).attr('data-id');
            sectionLinkId.datalink  = key;
            sectionsMenu.push(sectionLinkId);
        });

        if (linkedObjects.length > 0) {
            _.each(linkedObjects, function(value, key) {
                let $elm        = $(value),
                    dataId      = $elm.text(),
                    linkedId    =_.findWhere(sectionsMenu, {id: dataId}),
                    block       = $elm.closest('.sl-block');

                if (typeof(linkedId) !== 'undefined' && block.attr('data-link')) {
                    block.attr('data-link', parseInt(linkedId.datalink));
                } else {
                    block.removeAttr('data-link');
                    $elm.remove();
                }
            });
        }
    },
    preparationRefSection: function () {
        var Slides = [],
            saveSlides = [];
        $('section:not(.popin):not(stack)').each(function () {
            var $this = $(this),
                descRef = [],
                valuRef = [],
                itemreferences = [],
                List_reference_id = [],
                List_reference_id_unique = [];

            $this.find(".ref").map(function () {
                var item = {};
                item["code"] = this.innerText;
                item["id"] = this.id;
                if (List_reference_id.indexOf(item.id) == -1) {
                    List_reference_id.push(item.id);
                    itemreferences.push(item);
                }
            });
            var all_reference_code = $this.find(".ref").map(function () {
                return this.innerText;
            }).get();

            var List_reference_val_unique = all_reference_code.filter(function (itm, i, all_reference_id) {
                return i == all_reference_code.indexOf(itm);
            });
            var alpha = [],
                number = [];
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

            var listOfvaleurBySlide = $.merge(alpha, number);
            for (var i = 0; i < listOfvaleurBySlide.length; i++) {
                $.each(itemreferences, function (key, value) {
                    if (value.code == listOfvaleurBySlide[i]) {
                        List_reference_id_unique.push(value.id);
                    }

                });
            }
            var List_reference_id_unique = List_reference_id_unique;
            if (List_reference_id_unique.length != 0) {

                _.each(List_reference_id_unique, function (reference_id_unique) {
                    var $slblock = $this.find(".sl-block"),
                        inputvalueref = $slblock.find("#" + reference_id_unique).html();

                    valuRef.push(inputvalueref);

                    if ($("#tab-1 .item-ref.sheet").length >= 1) {
                        var idreflinked = reference_id_unique,
                            $sheet_reference = $("#tab-1 .item-ref.sheet#" + idreflinked)[0];
                        if ($($sheet_reference).attr('id') == reference_id_unique) {
                            descRef.push($($sheet_reference).find('.ref-desc').html());

                        }
                    }
                });

                if ($(this).attr('data-id') != undefined) {
                    var item = {},
                        objetReferences = {},
                        $additional_textPresent = $("section[data-id=" + $(this).attr('data-id') + "]").find('.block-AdditionalText').html();

                    item ["data_id"] = $this.attr('data-id');
                    objetReferences ["id_reference"] = List_reference_id_unique;
                    objetReferences ["description"] = descRef;
                    objetReferences ["value"] = valuRef;
                    item["Refs"] = objetReferences;
                    $additional_textPresent != undefined ? item ["additional_text"] = $additional_textPresent : item ["additional_text"] = "";
                    Slides.push(item);

                    var objectglobale = {}, itemReferences = [];
                    objectglobale ["data_id"] = $this.attr('data-id');
                    for (var i = 0; i < List_reference_id_unique.length; i++) {
                        var Onlyobjectglobale = {}
                        Onlyobjectglobale ["id_reference"] = List_reference_id_unique[i];
                        Onlyobjectglobale ["description"] = descRef[i];
                        var $data = $($.parseHTML(descRef[i])),
                            codeReference = valuRef[i] + '. ',
                            block = $.parseHTML('<span>' + codeReference + '</span>');

                        if ($data != undefined) {

                            var element = $data;
                            if ($data != undefined) {
                                var color = [], ftSize = [], ftFamily, fntWeig = [], ftstyle = [];
                                $($data).find('span').each(function (tap) {

                                    var $this = $(this);
                                    if ($this.css('color') != "rgb(221, 221, 221)") {
                                        color.push($this.css('color'));
                                    }
                                    if ($this.css('font-size') != "12.6px") {
                                        ftSize.push($this.css('font-size'));
                                    }
                                    if ($this.css('font-family') != '"Lucida Sans Unicode", "Lucida Grande", sans-serif') {
                                        ftFamily = $this.css('font-family');
                                    }
                                    fntWeig.push($this.css('font-weight'));
                                    ftstyle.push($this.css('font-style'));
                                });
                                var color_filtre = color.filter(function (val) {
                                        return val !== ''
                                    }),
                                    ftSize_filtre = ftSize.filter(function (val) {
                                        return val !== ''
                                    }),
                                    fntWeig_filtre = fntWeig.filter(function (val) {
                                        return val !== ''
                                    }),
                                    ftstyle_filtre = ftstyle.filter(function (val) {
                                        return val !== ''
                                    }),
                                    $block = $(block);


                                if (color_filtre.length != 0) {
                                    $block.css("color", color[0]);
                                }
                                if (ftSize_filtre.length != 0) {
                                    $block.css("font-size", parseInt(ftSize_filtre[0].split('px')[0]));
                                }
                                if (fntWeig_filtre.length != 0) {
                                    $block.css("font-weight", fntWeig_filtre[0]);
                                }
                                if (ftstyle_filtre.length != 0) {
                                    $block.css("font-style", ftstyle_filtre[0]);
                                }
                                if (ftFamily != undefined) {
                                    $block.css("font-family", ftFamily);
                                }

                                Onlyobjectglobale ["value"] = $block[0].outerHTML;

                            }

                        }
                        itemReferences.push(Onlyobjectglobale);
                    }
                    objectglobale["Refs"] = itemReferences;
                    $additional_textPresent != undefined ? objectglobale ["additional_text"] = $additional_textPresent : objectglobale ["additional_text"] = "";
                    saveSlides.push(objectglobale);
                }

            }

        });

        var slidesJSON = JSON.stringify(saveSlides);
        $('#tempReferences').html("");
        $.each(saveSlides, function (key, value) {
            var $codehtml = "<div class='refSection'data-id='" + value.data_id + "'></div>";
            $('#tempReferences').append($codehtml);
            var $references_section = $(".refSection[data-id='" + value.data_id + "']");
            for (var i = 0; i < value.Refs.length; i++) {
                var codeReference = value.Refs[i].value,
                    $codeitem_ref_wrapper = '<div class="item-ref-wrapper"><div class="row-ref"><span class="codeRef">' + codeReference + '</span>' + '<span class="descRef">' + value.Refs[i].description + '</span>';
                $references_section.append($codeitem_ref_wrapper);
            }
        });

    },
    generateJsonStructure: function () {
        var data = {
            "slides"        : [],
            "popins"        : [],
            "references"    : [],
            "menu"          : []
        };
        function parseCSSText (cssText) {
            var style = {},
                [, ruleName, rule] = cssText.match(/(.*){([^}]*)}/) || [,, cssText];

            var cssToJs = s => s.replace(/[\W]+\w/g,
                match => match.slice(-1).toUpperCase());

            var properties = rule.split(";")
                .map( o => o.replace(/"/g, "'").replace(/(https?):\/\//g, 'https//').split(":")
                .map( x => x && x.trim() )
            );

            for (var [property,value] of properties) {
                if (property !== "" ) {
                    style[property] = value.replace(/(https?)\/\//g, 'http://');
                }
            }

            return style;
        };
        function getSectionAttributes (section){

            var  attr = {
                        "data-id"					            : section.attr('data-id'),
                        "data-background-size"		        : section.attr('data-background-size'),
                        "data-background-image"		        : section.attr('data-background-image'),
                        "data-background-color"		        : section.attr('data-background-color'),
                        "data-trigger-anim-byclick"           : section.attr('data-trigger-anim-byclick'),
                        "data-index-h"                        : section.attr('data-index-h'),
                        "data-index-v"                        : section.attr('data-index-v'),
                        "data-background-repeat"              : section.attr('data-background-repeat'),
                        "data-background-position"            : section.attr('data-background-position'),
                        "data-screen-name"                    : section.attr('data-screen-name'),
                        "data-chapter-name"                   : section.attr('data-chapter-name'),
                        "data-key-msg"                        : section.attr('data-key-msg'),
                        "data-screen-description"             : section.attr('data-screen-description'),
                        "data-custom-navbar-appearance"       : section.attr('data-custom-navbar-appearance'),
                        "data-bg-screen-color"                : section.attr('data-bg-screen-color'),
                        "data-bg-screen-img"                  : section.attr('data-bg-screen-img'),
                        "data-block-left-nav"                 : section.attr('data-block-left-nav'),
                        "data-block-right-nav"                : section.attr('data-block-right-nav'),
                        // "data-thumb-saved"                    : section.attr('data-thumb-saved'),
                        "data-size"                           : section.attr('data-size')
                    };

            return  attr;

        };
        function getSectionStyles(section) {
            var styleSection    = {},
                screenImg       = section.attr('data-bg-screen-img'),
                bgImg           = section.attr('data-background-image'),
                bgColor         = section.attr('data-background-color'),
                screenColor     = section.attr('data-bg-screen-color'),
                bgsize          = section.attr('data-background-size'),
                bgrepeat        = section.attr('data-background-repeat'),
                bgpostion       = section.attr('data-background-position');

            styleSection = {
                'background-color'   : screenColor != ""   && screenColor !=  undefined ? screenColor   : bgColor,
                'background-image'   : screenImg   != ""   && screenImg   !=  undefined ? screenImg     : bgImg,
                'background-size'    : bgsize      != ""   && bgsize      !=  undefined ? bgsize        : "",
                'background-repeat'  : bgrepeat    != ""   && bgrepeat    !=  undefined ? bgrepeat      : "",
                'background-position': bgpostion   != ""   && bgpostion   !=  undefined ? bgpostion     : ""
            };
            return styleSection;
        }
        function getStyleOrEmpty (style) {
            if (style === undefined || style === "") {
                return "";
            }
            return parseCSSText(style);
        };
        function getPopinAttributes (popin) {
            // console.log(popin.css('background-image').slice(4, -1).replace(/"/g, ""));
            var attr = {
                "data-id"				: popin.attr('data-id'),
                // "data-thumb-saved"      : popin.attr('data-thumb-saved'),
                "data-popin-name"       : popin.attr('data-popin-name'),
                // "thumb-tosave"          : popin.attr('thumb-tosave'),
                "data-bg-image"         : popin.attr('data-bg-image'),
                "data-size"             : popin.attr('data-size')
            };

            return  attr;
        };
        function getBlockData (slBlock ,json) {
            slBlock.each(function(){
                var block 			  = $(this),
                    linkedPop         = block.find("#linkedpopin"),
                    linkedScreen      = block.find("#linkedscreen"),
                    blockStyle        = block.find('.block-style'),
                    slBlockContent    = block.find('.sl-block-content'),
                    blockType         = block.attr('data-block-type'),
                    blockData, contentAttr, slblockAttributes, linkedpopin, linkedscreenData;

                if (blockType === "text" || blockType === "scrollabletext" || blockType === "survey" ) {
                    blockData =  slBlockContent.html();
                    contentAttr = {
                        "data-placeholder-tag"  : slBlockContent.attr('data-placeholder-tag'),
                        "data-placeholder-text" : slBlockContent.attr('data-placeholder-text'),
                        "data-delay-tap"        : slBlockContent.attr('data-delay-tap'),
                        "data-animation-type"   : slBlockContent.attr('data-animation-type'),
                        "data-duration-tap"     : slBlockContent.attr('data-duration-tap')
                    }
                }
                if (blockType === "table") {
                    blockData = {
                        "data"                      : slBlockContent.html()
                    };
                    contentAttr = {
                        "data-table-border-width"   : slBlockContent.attr('data-table-border-width'),
                        "data-table-border-color"   : slBlockContent.attr('data-table-border-color'),
                        "data-table-padding"        : slBlockContent.attr('data-table-padding'),
                        "data-table-rows"           : slBlockContent.attr('data-table-rows'),
                        "data-table-cols"           : slBlockContent.attr('data-table-cols'),
                        "data-delay-tap"            : slBlockContent.attr('data-delay-tap'),
                        "data-animation-type"       : slBlockContent.attr('data-animation-type'),
                        "data-duration-tap"         : slBlockContent.attr('data-duration-tap')
                    }

                }
                if (blockType === "image") {
                    let  imgBlock          = slBlockContent.find('img');
                    blockData = {
                       "src"                 : imgBlock.attr('src'),
                        "attributes"          : {
                            "data-natural-width"  : imgBlock.attr('data-natural-width'),
                            "data-natural-height" : imgBlock.attr('data-natural-height'),
                            "data-size"           : imgBlock.attr('data-size')
                        }

                    };
                    contentAttr={
                        "data-delay-tap"        : slBlockContent.attr('data-delay-tap'),
                        "data-animation-type"   : slBlockContent.attr('data-animation-type'),
                        "data-duration-tap"     : slBlockContent.attr('data-duration-tap')
                    }

                }
                if (blockType === "video") {
                    let  videoBlock        = slBlockContent.find('video');
                    blockData = {
                        "source"              : videoBlock.find('source').attr('src'),
                        "attributes"          : {
                            "data-natural-width"  : videoBlock.attr('data-natural-width'),
                            "data-natural-height" : videoBlock.attr('data-natural-height'),
                            "width"               : videoBlock.attr('width'),
                            "height"              : videoBlock.attr('height'),
                            "data-size"           : videoBlock.attr('data-size')
                        }
                    };
                    slblockAttributes = {
                        'data-block-id'         : block.attr('data-block-id'),
                        'data-block-type'       : block.attr('data-block-type'),
                        "data-video"            : block.attr('data-video'),
                        "data-video-id"         : block.attr('data-video-id'),
                        "data-video-autoplay"   : block.attr('data-video-autoplay'),
                        "data-video-poster"     : block.attr('data-video-poster')
                    }
                } else {
                    slblockAttributes = {
                        'data-block-id'         : block.attr('data-block-id'),
                        'data-block-type'       : block.attr('data-block-type'),
                        "data-block-anim"       : block.attr('data-block-anim'),
                        "data-popup"            : block.attr('data-popup'),
                        "data-pdf-name"         : block.attr('data-pdf-name'),
                        "data-pdf-link"         : block.attr('data-pdf-link'),
                        "data-link"             : block.attr('data-link'),
                        "data-size"             : block.attr('data-size')
                    }
                }
                if (blockType === "shape") {
                    let svgBlock   = slBlockContent.find('svg');
                    blockData = {
                        "attributes"    : {
                            "xmlns"                   : svgBlock.attr('xmlns'),
                            "version"                 : svgBlock.attr('version'),
                            "width"                   : svgBlock.attr('width'),
                            "height"                  : svgBlock.attr('height'),
                            "preserveAspectRation"    : "none",
                            "viewBox"                 : svgBlock[0].attributes.viewBox.textContent
                        },
                        "data" : svgBlock.html()
                    };
                    contentAttr = {
                        "data-shape-fill-color" : slBlockContent.attr('data-shape-fill-color'),
                        "data-shape-stretch"    : slBlockContent.attr('data-shape-stretch'),
                        "data-shape-type"       : slBlockContent.attr('data-shape-type'),
                        "data-delay-tap"        : slBlockContent.attr('data-delay-tap'),
                        "data-animation-type"   : slBlockContent.attr('data-animation-type'),
                        "data-duration-tap"     : slBlockContent.attr('data-duration-tap')
                    }


                }

                if(linkedPop.length > 0){
                    linkedpopin = {
                        "id"    : linkedPop.attr('id'),
                        "class" : linkedPop.attr('class'),
                        "data"  : linkedPop.html()
                    }
                }
                if(linkedScreen.length > 0){
                    linkedscreenData = {
                        "id"    : linkedScreen.attr('id'),
                        "class" : linkedScreen.attr('class'),
                        "data"  : linkedScreen.html()
                    }
                }
                json.push({
                    'class'       : block.attr('class'),
                    'type'        : block.attr('data-block-type'),
                    'style'       : getStyleOrEmpty(block.attr('style')),
                    "linkedpopin" : _.omit(linkedpopin, _.isEmpty),
                    "linkedscreen":  _.omit(linkedscreenData, _.isEmpty),
                    'blockStyle'  : {
                        "class"   : blockStyle.attr('class'),
                        "style"   : getStyleOrEmpty(blockStyle.attr('style')),
                        "blockcontent": {
                            "class"                 : slBlockContent.attr('class'),
                            "data"                  : blockData,
                            "attributes"            : _.omit(contentAttr, _.isEmpty),
                            "style"                 : getStyleOrEmpty(slBlockContent.attr("style"))
                        },
                        "survey"                : {
                            "class"	: slBlockContent.next().attr('class'),
                            "data"	: slBlockContent.next().html()
                        }
                    },
                    "attributes"      : _.omit(slblockAttributes, _.isEmpty)
                })
            });
        }
        function referenceToJson () {
            var Slides = [],
                saveSlides = [];
            $('section:not(.popin):not(.stack)').each(function () {
                var $this = $(this),
                    descRef = [],
                    valuRef = [],
                    itemreferences = [],
                    List_reference_id = [],
                    List_reference_id_unique = [];

                $this.find(".ref").map(function () {
                    var item = {};
                    item["code"] = this.innerText;
                    item["id"] = this.id;
                    if (List_reference_id.indexOf(item.id) == -1) {
                        List_reference_id.push(item.id);
                        itemreferences.push(item);
                    }
                });
                var all_reference_code = $this.find(".ref").map(function () {
                    return this.innerText;
                }).get();

                var List_reference_val_unique = all_reference_code.filter(function (itm, i, all_reference_id) {
                    return i == all_reference_code.indexOf(itm);
                });
                var alpha = [],
                    number = [];
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

                var listOfvaleurBySlide = $.merge(alpha, number);
                for (var i = 0; i < listOfvaleurBySlide.length; i++) {
                    $.each(itemreferences, function (key, value) {
                        if (value.code == listOfvaleurBySlide[i]) {
                            List_reference_id_unique.push(value.id);
                        }

                    });
                }
                var List_reference_id_unique = List_reference_id_unique;
                if (List_reference_id_unique.length != 0) {

                    _.each(List_reference_id_unique, function (reference_id_unique) {
                        var $slblock = $this.find(".sl-block"),
                            inputvalueref = $slblock.find("#" + reference_id_unique).html();

                        valuRef.push(inputvalueref);
                        if ($("#tab-1 .item-ref.sheet").length >= 1) {
                            var idreflinked = reference_id_unique,
                                $sheet_reference = $("#tab-1 .item-ref.sheet#" + idreflinked)[0];
                            if ($($sheet_reference).attr('id') == reference_id_unique) {
                                descRef.push($($sheet_reference).find('.ref-desc').html());

                            }
                        }
                    });

                    if ($(this).attr('data-id') != undefined) {
                        var item = {},
                            objetReferences = {},
                            $additional_textPresent = $("section[data-id=" + $(this).attr('data-id') + "]").find('.block-AdditionalText').html();

                        item ["data_id"] = $this.attr('data-id');
                        objetReferences ["id_reference"] = List_reference_id_unique;
                        objetReferences ["description"] = descRef;
                        objetReferences ["value"] = valuRef;
                        item["Refs"] = objetReferences;
                        $additional_textPresent != undefined ? item ["additional_text"] = $additional_textPresent : item ["additional_text"] = "";
                        Slides.push(item);

                        var objectglobale = {}, itemReferences = [];
                        objectglobale ["data_id"] = $this.attr('data-id');
                        for (var i = 0; i < List_reference_id_unique.length; i++) {
                            var Onlyobjectglobale = {}
                            Onlyobjectglobale ["id_reference"] = List_reference_id_unique[i];
                            Onlyobjectglobale ["description"] = descRef[i];


                            var $data = $($.parseHTML(descRef[i])),
                                codeReference = valuRef[i] + '. ',
                                block = $.parseHTML('<span>' + codeReference + '</span>');

                            if ($data != undefined) {

                                var element = $data;
                                if ($data != undefined) {
                                    var color = [], ftSize = [], ftFamily, fntWeig = [], ftstyle = [];
                                    $($data).find('span').each(function (tap) {

                                        var $this = $(this);
                                        if ($this.css('color') != "rgb(221, 221, 221)") {
                                            color.push($this.css('color'));
                                        }
                                        if ($this.css('font-size') != "12.6px") {
                                            ftSize.push($this.css('font-size'));
                                        }
                                        if ($this.css('font-family') != '"Lucida Sans Unicode", "Lucida Grande", sans-serif') {
                                            ftFamily = $this.css('font-family');
                                        }
                                        fntWeig.push($this.css('font-weight'));
                                        ftstyle.push($this.css('font-style'));
                                    });
                                    var color_filtre = color.filter(function (val) {
                                            return val !== ''
                                        }),
                                        ftSize_filtre = ftSize.filter(function (val) {
                                            return val !== ''
                                        }),
                                        fntWeig_filtre = fntWeig.filter(function (val) {
                                            return val !== ''
                                        }),
                                        ftstyle_filtre = ftstyle.filter(function (val) {
                                            return val !== ''
                                        }),
                                        $block = $(block);


                                    if (color_filtre.length != 0) {
                                        $block.css("color", color[0]);
                                    }
                                    if (ftSize_filtre.length != 0) {
                                        $block.css("font-size", parseInt(ftSize_filtre[0].split('px')[0]));
                                    }
                                    if (fntWeig_filtre.length != 0) {
                                        $block.css("font-weight", fntWeig_filtre[0]);
                                    }
                                    if (ftstyle_filtre.length != 0) {
                                        $block.css("font-style", ftstyle_filtre[0]);
                                    }
                                    if (ftFamily != undefined) {
                                        $block.css("font-family", ftFamily);
                                    }

                                    Onlyobjectglobale ["value"] = $block[0].outerHTML;


                                }

                            }
                            itemReferences.push(Onlyobjectglobale);
                        }
                        objectglobale["Refs"] = itemReferences;
                        $additional_textPresent != undefined ? objectglobale ["additional_text"] = $additional_textPresent : objectglobale ["additional_text"] = "";
                        saveSlides.push(objectglobale);
                    }

                }

            });

            return saveSlides;

        }

        $(".slides > section:not(.popin)").each(function(){
            var section 	= $(this),
                slBlock 	= section.find('.sl-block');

            var blockJson = [];

            if(section.hasClass('stack')){

                var childrenSection = section.find('section'),
                    childJson       = [];

                childrenSection.each(function(){
                    var child = $(this),
                        childBlock      = child.find('.sl-block'),
                        childBlockJson = [];


                    getBlockData(childBlock, childBlockJson);
                    childJson.push({
                        "class" 			: child.attr('class'),
                        "attributes"		: _.omit(getSectionAttributes(child), _.isEmpty),
                        "styles"            : getSectionStyles(child),
                        "blocks"            : childBlockJson
                    });
                });

                data.slides.push({
                    "class" 				    : section.attr('class'),
                    "attributes"				: _.omit(getSectionAttributes(section), _.isEmpty),
                    "children": childJson
                });

            } else {

                getBlockData(slBlock, blockJson);
                data.slides.push({
                    "class" 		: section.attr('class'),
                    "attributes"	: _.omit(getSectionAttributes(section), _.isEmpty),
                    "styles"        : getSectionStyles(section),
                    "blocks"        : blockJson
                })

            }
        });
        $(".slidespop section.popin").each(function(){
            var popin 	    = $(this),
                slBlock 	= popin.find('.sl-block'),
                blockJson   = [];

            getBlockData(slBlock, blockJson);

            data.popins.push({
                "class" 		: popin.attr('class'),
                "attributes"	: getPopinAttributes(popin),
                "style"         : getStyleOrEmpty(popin.attr('style')),
                "blocks"        : blockJson
            });
        });

        data.references = referenceToJson() ;
        data.menu       = this.menuTojsonAction();
        return data;
    },
    menuTojsonAction: function () {
        var  i       = 0,
            subMenu = TWIG.cloneSubmenuUL,
            json    = [], menuJson = [],
            menu    = $('#wrapperMenuScroll .menu .maxMenu li');

        for (i; subMenu.length > i; i++){
            var item     = $(subMenu[i])[0],
                child    = $(item.children);

            _.each(child, function (index ,elm) {
                var obj         = $(child[elm])[0],
                    attr        = $(child[elm])[0].attributes,
                    attrJSon    = {};

                attrJSon = {
                    "class"         : attr[0].value,
                    "data_item"     : attr[1].value,
                    "data_slide_h"  : attr[2].value,
                    "data_slide_v"  : attr[3].value
                };
                json.push({"innerhtml": obj.innerHTML ,"outerhtml": obj.outerHTML, "attributes" : attrJSon})

            });
        };

        menu.each(function () {
            var elem = $(this);
            menuJson.push({
                "class"         : elem.attr('class'),
                "data_item"     : elem.attr('data-item'),
                "data_slide_h"  : elem.attr('data-slide-h'),
                "data_slide_v"  : elem.attr('data-slide-v'),
                "html"          : elem.html(),
                'childs'        : []
            });
        });
        for(var cp = 0 ; json.length> cp ; cp++){
            var child       = json[cp],
                childSlideH = json[cp].attributes.data_slide_h;
            for(var cpt = 0 ; menuJson.length>cpt; cpt++){
                var topMenuItem = menuJson[cpt],
                    slideH = menuJson[cpt].data_slide_h;
                if(slideH === childSlideH){
                    topMenuItem.childs.push(child)
                }
            }
        };
        return menuJson;
    },
    removeEmptyBlocks: function() {
        $(".slides section .sl-block[data-block-type='image'], .slides section .sl-block[data-block-type='video']").find('.sl-block-content:empty').closest('.sl-block').remove();
    },
    getChangedSlidesIds: function(slidesArray, linkedSlides) {
        var slidesIdsArray      = [],
            changedSlidesIds    = [];

        _.each(slidesArray, function(value, key) {
            if ($(`.slides section[data-id="${value.id}"]`)[0].hasAttribute("new-slide") === false) {
                slidesIdsArray.push(value.id);
            }
        });

        changedSlidesIds = _.uniq(slidesIdsArray.concat(linkedSlides));

        $('.slides section').removeAttr('new-slide');
        console.log(changedSlidesIds);

        return changedSlidesIds;
    },
    saveAction: function(saveAuto) {
        this.removeEmptyBlocks();
        this.fixPopinIds();
        this.fixOldlinkedScreenIds();
        var context = this;
        if (saveAuto) {
            SL.editor.controllers.Blocks.blur();
        }
        this.preparationRefSection();

        /********************** Begin Fetch exists Fonts  ******************************/
       var slidesContent = document.querySelectorAll(".slides *");
       var popinContent = document.querySelectorAll(".slidespop *");
       const defaultFontListArray = defaultFontList;
       var j , d,
           fontReference =TWIG.parameters.dataMenuFontTitleRef,
           fontList ={
               data:[]
           };

       //check font Reference
       fontList.data.push(fontReference);

       featchFontsOnPres(slidesContent , fontList);
       featchFontsOnPres(popinContent , fontList);

       var uniqFontList = _.uniq( _.collect( fontList.data, function( x ){
           return  x ;
       }));
       var existFont= []; // This is the last output of font Exist
       var sizeFonts = 0;
       for (j = 0; j < uniqFontList.length; j++) {
          var object =  uniqFontList[j];
           for (d = 0 ; d < defaultFontListArray.fonts.length ; d++){
               if (object == defaultFontListArray.fonts[d].name){
                  existFont.push({ "name" : object ,"url" : defaultFontListArray.fonts[d].url });
                  sizeFonts = sizeFonts +  parseFloat(defaultFontListArray.fonts[d].size);
               }
           }
       }
       var attribute = "";
       for (j = 0; j < existFont.length; j++) {
           var that = existFont[j].url;
           if (attribute != ""){
               attribute = attribute +','+ that;
           }
           else {
               attribute =that;
           }
       }
       TWIG.parameters.dataFontUrlExist = attribute;
       //document.getElementById('params_clm_edidtor').setAttribute('data-font-url-exist',attribute);
       /********************** End Fetch exists Fonts  ******************************/
       function getMenu() {
           var menu = {
               'menuColor'      : null,
               'itemColor'      : null,
               'fontColor'      : null,
               'highlight'      : null,
               'fonts'          : null
           };

           var menuColor = $('div#wrapperMenuScroll').attr('style');
           if (menuColor) {
               menu.menuColor = menuColor;
           }

           var itemColor = $(".edit-pres-wrap .slides .menu  li.current > a").attr('style');
           if (itemColor) {
               menu.itemColor = itemColor;
           }

           var fontColor = $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").attr('style');
           if (fontColor) {
               menu.fontColor = fontColor;
           }

           var highlight = $("#wrapperMenuScroll .menu .maxMenu li.current").css('background-image');
           if (highlight) {
               if (highlight != "none" && highlight.indexOf("selected.png") !== -1 || highlight.indexOf("picto-home-active.png") !== -1) {
                   menu.highlight = "highlight";
               }
           }

           var fonts = $('#wrapperMenuScroll .menu').attr('style');
           if (fonts) {
               menu.fonts = fonts;
           }

            appendSubmenuUL(TWIG.cloneSubmenuUL); ////////////////////////////////////////////////////////////////////////////////// delete comment !!!!!!!!!!!!!!!!!!!!!!!

           var data = $('#wrapperMenuScroll').prop('outerHTML');
           if (data) {
               menu.data = data;
           }

           if (menu.menuColor === null && menu.itemColor === null && menu.fontColor === null && menu.highlight === null && menu.fonts == null) {
               return null;
           }

           return menu;
       }

        function getSurvey(survey, tables, section) {
            var count = 0;
            var arraySelect = [];
            $.each(tables, function( index, value ) {
                if(value === '.q-select'){
                    section.find('.q-select-question').each(function(index){
                        arraySelect.push($(this).text());
                    });
                };
                section.find(value).each(function( index ) {
                    var surveyCode = $(this).attr('id');
                    var question = $(this).text();

                    if ($(this).attr('class') === 'q-select') {
                        question = arraySelect[count++];
                    }

                    var obj = {};

                    if (typeof question === 'undefined') {
                        obj = null;
                    } else {
                        obj = {
                            "surveyCode": surveyCode,
                            "question": $.trim(question),
                            "type": "TEXT"
                        };
                        survey.push(obj);
                    }
                });
            });

            if (survey.length <= 0) {
                return null;
            }

            return survey;
        }

        function getLinkedPfd() {
            var pdf = [];
            $('#linked-rcp .item-pdf span.pdf-title2, #linked-rcp .item-pdf span.pdf-title').each(function() {
                var id = $(this).data('id');
                if (id !== undefined) {
                    pdf.push(id);
                }
            });

            if (pdf.length > 0) {
                return pdf;
            }

            return null;
        }

        function getAttrOrNull(attr) {
            if (typeof obj != 'undefined') {
                return obj;
            }
            return null;
        }

        function getMediaOrNull(param) {
            if (param && typeof param !== 'undefined') {

                return param.replace('url("', '').replace('")', '');
            }

            return null;
        }

        function getLinkedMedia(listeMediaUrl) {

            $(".sl-block-content img").each(function() {
                listeMediaUrl.push($(this).attr('src'));
            });

            var medias = [
                TWIG.parameters.dataLogoPresUrl,
                TWIG.parameters.dataBgBtnClose,
                TWIG.parameters.dataBgPresImg,
                TWIG.parameters.dataBgPopupImg,
                TWIG.parameters.dataBgRefImg,
                TWIG.parameters.dataLogoHomeUrl,
                TWIG.parameters.dataLogoRcpUrl,
                TWIG.parameters.dataLogoRefrsUrl
            ];

            medias.forEach(function(media) {
                let elt = getMediaOrNull(media);
                if (elt !== null) {
                    listeMediaUrl.push(elt);
                }

            });


            return listeMediaUrl;
        }

        function setMedia(section , listeMediaUrl){
            let media = getMediaOrNull(section.css('background-image'));
            if (media !== null) {
                listeMediaUrl.push(media);
            }
        }

        function getLinkedRef(ref, section){
            var dataId = section.attr('data-id');
            var refSection = $('#tempReferences').find(".refSection[data-id='"+ dataId +"']");

            if (refSection && typeof refSection !== 'undefined') {
                refSection.find('.item-ref-wrapper').each(function(){
                    var itemRef    = $(this),
                        codeRef    = itemRef.find('.codeRef').text(),
                        descRef    = itemRef.find('.descRef').html(),
                        obj        = {};

                    if (typeof codeRef == 'undefined' || typeof descRef == 'undefined') {
                        obj = null;
                    } else {
                        obj = {
                            "codeRef": codeRef,
                            "description": descRef
                        };
                        ref.push(obj);
                    }
                });
            }

            var additText = section.find('.block-AdditionalText').html();

            if (typeof additText == 'undefined') {
                additText = "";
            } else {
                var addObj = {};
                addObj = {
                    "codeRef": "",
                    "description": additText
                };
                ref.push(addObj);

            }
            if (ref.length == 0) {
                return null;
            }

            return ref;

        }

        function gatherSectionProperties(section, parent, tagParent) {

            var screenName        = getAttrOrNull(section.data("screen-name")),
                chapterName       = getAttrOrNull(section.data("chapter-name")),
                screenId          = getAttrOrNull(section.data("screen-id")),
                keyMsg            = getAttrOrNull(section.data("key-msg")),
                assetDescription  = getAttrOrNull(section.data("screen-description"));

            var surveyTable = {
                'check_box': ".q-checkbox",
                'radio': ".q-radio",
                'input_text': ".q-textField",
                'dropdown': ".q-select"
            };

            var survey = [],
                ref    = [];

            ref    = getLinkedRef(ref, section);
            survey = getSurvey(survey, surveyTable, section);

            return {
                "section"          : section[0].outerHTML,
                "dataId"           : section.attr('data-id'),
                "parent"           : parent,
                "tagParent"        : tagParent, // tagStack
                "screenName"       : screenName,
                "chapterName"      : chapterName,
                "screenId"         : screenId,
                "keyMsg"           : keyMsg,
                "assetDescription" : assetDescription,
                "survey"           : survey,
                "linkedRef"        : ref
            }
        }

        function gatherSections() {

            var deck          = {}, // plain object to use in AJAX
                sections      = $('.slides > section'), // all sections except section.stack children
                count         = 0, // counter for slides
                listeMediaUrl = [];

            sections.each(function(i, val1) {

                var section = $(this);

                // simple section
                if (!section.hasClass("stack")) {
                    deck[++count] = gatherSectionProperties(section, null, null);

                 // stack section
                } else {

                    var tagStack  = section.clone().children().remove().end()[0].outerHTML,
                        parent    = section.children().first(),
                        children  = section.children(':not(:first)');

                    tagStack       = tagStack.replace("</section>", "");
                    deck[++count]  = gatherSectionProperties(parent, null, tagStack);
                    setMedia(parent, listeMediaUrl);

                    // store index parent
                    var idxParent = count;
                    children.each(function(j, val2) {
                        var child = $(this);
                        setMedia(child, listeMediaUrl);

                        if (j === children.length - 1) {
                            deck[++count] = gatherSectionProperties(child, idxParent, '</section>');
                        } else {
                            deck[++count] = gatherSectionProperties(child, idxParent, null);
                        }
                    });
                }
            });

            listeMediaUrl          = $.unique(getLinkedMedia(listeMediaUrl));
            deck['mediasLinked']   = listeMediaUrl;

            return deck;
        }

        // var deck = gatherSections();
        var deck            = {},
            json  = this.generateJsonStructure();

        deck['menu']        = (getMenu()).data;
        // deck['popin']       = $('.slidespop').html();
        // deck['state']       = $("#saveForm").find("select[name='state']").val();
        // deck['allRef']      = $('#tempReferences')[0].outerHTML;

        if( getLinkedPfd() != null ){
            deck['linkedPdf']   = getLinkedPfd();
        }

        let slidesArray             = [],
            popinsArray             = [],
            changedSlides           = [],
            linkedSlidesArray       = [];

        slidesArray         = getSlidesUrls(slidesArray);
        popinsArray         = getPopinsUrls(popinsArray);
        deck['parameters']  = TWIG.parameters;
        deck['slides']      = json.slides;
        deck['menuJson']    = json.menu;
        deck['popins']      = json.popins;
        deck['references']  = json.references;
        deck['comment']  = $('#saveForm').find('#txtr-comment').val();
        deck['fontSize']  = sizeFonts;
        if (typeof saveAuto !== 'undefined' && saveAuto === false) {
            linkedSlidesArray   = getSlidesLinkedPopinsChanged(slidesArray, popinsArray);
            changedSlides       = context.getChangedSlidesIds(slidesArray, linkedSlidesArray);
            deck['comment']     = $('#saveForm').find('#txtr-comment').val();
            if (changedSlides.length > 0) {
                deck['changedSlides'] = changedSlides;
            }
        }
        console.log(deck);
        // save!
        saveSlides(pako.deflate(JSON.stringify(deck)).toString());

        function getAllSlidesUrls(revisionSlidesArray) {
            _.each($('.slides section:not(".popin"):not(".stack")'), function(value, key) {
                let sectionAttr = SL.util.deck.getSlideIndicesFromIdentifier($(value).attr('data-id'));

                sectionAttr.id = $(value).attr('data-id');
                revisionSlidesArray.push(sectionAttr);
                _.each($(value).find('.sl-block[data-popup]'), function(sectionvalue, sectionkey) {
                    let $divpopin = $(sectionvalue).find('div#linkedpopin');

                    if ($divpopin.length == 0) {
                        $(value).removeAttr('data-popup');
                    }
                });
            });

            return revisionSlidesArray;
        }
        function getSlidesUrls(slidesArray) {
            _.each($('.slides section[data-thumb-saved=false]:not(".popin"):not(".stack")'), function(value, key) {
                let sectionAttr = SL.util.deck.getSlideIndicesFromIdentifier($(value).attr('data-id'));

                sectionAttr.id = $(value).attr('data-id');
                slidesArray.push(sectionAttr);
                _.each($(value).find('.sl-block[data-popup]'), function(sectionvalue, sectionkey) {
                    let $divpopin = $(sectionvalue).find('div#linkedpopin');

                    if ($divpopin.length == 0) {
                        $(value).removeAttr('data-popup');
                    }
                });
            });
            $('.slides section').removeAttr('data-thumb-saved');

            return slidesArray;
        }
        function getAllPopinsUrls(revisionPopinsArray) {
            _.each($('.slidespop section'), function(popvalue, popkey) {
                let popinAttr = {
                    'id'        : $(popvalue).attr('data-id'),
                    'height'    : parseInt($(popvalue).css('height'), 10),
                    'width'     : parseInt($(popvalue).css('width'), 10)
                }
                revisionPopinsArray.push(popinAttr);
            });

            return revisionPopinsArray;
        }
        function getPopinsUrls(popinsArray) {
            _.each($('.slidespop section[thumb-tosave=true]'), function(popvalue, popkey) {
                let popinAttr = {
                    'id'        : $(popvalue).attr('data-id'),
                    'height'    : parseInt($(popvalue).css('height'), 10),
                    'width'     : parseInt($(popvalue).css('width'), 10)
                }
                popinsArray.push(popinAttr);
            });
            $('.slidespop section').removeAttr('thumb-tosave');

            return popinsArray;
        }
        function getSlidesLinkedPopinsChanged(slidesArray, popinsArray) {
            let linkedSlides = [];

            _.each($('.slides section:not(".popin"):not(".stack")'), function(value, key) {
                let $slideContent    = $(value),
                    slideId          = $slideContent.attr('data-id');

                _.each(popinsArray, function(popinId, key) {
                    let linkedObj = $slideContent.find(`.sl-block[data-popup="${popinId.id}"]`);

                    if (linkedObj.length > 0) {
                        let slideId = $(linkedObj[0]).closest('section').attr('data-id');

                        linkedSlides.push(slideId);
                    }
                });
            });

            linkedSlides = _.uniq(linkedSlides);

            return linkedSlides;
        }
        function saveSlides(dataToSave) {
            let revisionSlidesArray     = [],
                revisionPopinsArray     = [];

            revisionSlidesArray = getAllSlidesUrls(revisionSlidesArray);
            revisionPopinsArray = getAllPopinsUrls(revisionPopinsArray);

            // Ajax Manual-Save
            if (typeof saveAuto !== 'undefined' && saveAuto === false) {
                var l = Ladda.create(document.querySelector('.ladda-button-save'));

                l.start();
                $.ajax({
                    type: "POST",
                    url: TWIG.savePresUrl,
                    data: dataToSave,
                    error : function(x, t, m) {
                        l.stop();
                        $('#modal_save_presentation').modal('hide');
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'slideDown',
                            preventDuplicates: true
                        };
                        if(t==="timeout"){
                            console.log('request timeout');
                            toastr.error("Your presentation has not been saved. ['"+t+"']  Please contact our support team through  support-mcmbuilder@argolife.fr");
                        } else {
                            toastr.error("Your presentation has not been saved. ['"+t+"']  Please contact our support team through  support-mcmbuilder@argolife.fr");
                        }
                    }
                }).done(function(data) {
                    l.stop();
                    $('#modal_save_presentation').modal('hide');
                    $('.slides section').removeAttr('data-thumb-saved');
                    toastr.options = {
                        closeButton: true,
                        progressBar: true,
                        showMethod: 'slideDown',
                        preventDuplicates: true,
                        timeOut: 5000
                    };
                    SLConfig.deck.data = SL.editor.controllers.Serialize.getDeckAsString();
                    SLConfig.deck.dirty = !0;
                    if (typeof saveAuto !== 'undefined' && saveAuto === false) {
                        toastr.success(TWIG.tostrSavePres);
                        var version2 = data["version"];
                        var comment = data["comment"] ;
                        var parent = data["parent"] ;
                        if(comment.length < 1){
                            comment = " - ";
                        }
                        if(parent === null){
                            parent = " - ";
                        }
                        var urlPreview = Routing.generate('presentations_preview', { idRev: data["idRev"] });
                        $('#list-revision tr:last').after('<tr id="' + data["idRev"] + '"> <td class="version-revision">V' + version2 + '</td><td' +
                            ' class="revision-comment">' + comment + ' </td> <td class="revision-user">' + data["user"]
                            + '</td><td class="revision-create-at" > ' + data["createAt"] + '' +
                            '  </td><td  class="revision-parent"> ' + parent + ' </td><td  class="revision-veeva-vault"> -  </td></td> <td><a target="_blank" href="' + urlPreview + '"> ' +
                            '<i class="p-view-icon"></i></a> <a class="upload-new-version" id="'+ data["idRev"] +'" >' +
                            '<i class="fa fa-rotate-left"></i></a></td></tr>');
                        TWIG.idRev = data["idRev"];
                        Route.idRev = data["idRev"];
                        $(document).find('#rev-version').html(version2);
                    }
                    context.generatePresentationThumbAction();
                    context.onSaveFinished(revisionSlidesArray, revisionPopinsArray);
                });
            } else {
                // To do : Ajax Action auto save mehrez
                // Ajax Auto-Save
                $.ajax({
                    type: "PUT",
                    url: SL.config.AJAX_UPDATE_DECK,
                    data: dataToSave,
                    error : function(x, t, m) {

                    }
                }).done(function(data) {

                });
            }
        }
        function appendSubmenuUL(ul){

            /*if($("#get-all-ul").length == 0){
                $("#wrapperMenuScroll").prepend("<div id='get-all-ul' style='display:none;'></div>");
            }
            else{*/
                //$("#get-all-ul").html("");
            //}
            var saveUL = "";
            for(var key in ul){
                if($(ul[key]).is(".has-levelSecond") == true){
                    $(ul[key]).removeClass("has-levelSecond");
                }
                //$("#get-all-ul").append($(ul[key]));
                $(ul[key]).find("li").each(function(index, elm){
                    if($(this).is(".current")){
                        $(this).removeClass("current");
                    }
                });
                saveUL += ul[key];
            }
            $("#get-all-ul").html(saveUL);

            $(".edit-pres-wrap .slides #get-all-ul ul").css({
                "font-family": projector.attr("data-menu-font") != "" ? projector.attr("data-menu-font") : "Montserrat",
                "font-size": projector.attr("data-font-size-select") != "" ? projector.attr("data-font-size-select") + "px" : "15px"
            });

            if(projector.attr("data-bg-btn-close") != undefined && projector.attr("data-bg-btn-close") != ""){
                $(".edit-pres-wrap .slides #get-all-ul").attr("data-bg-btn-close", projector.attr("data-bg-btn-close"));
            }
        }
        function featchFontsOnPres (selector , fontListUrl){
            for (j = 0; j < selector.length; j++) {
                $(selector[j]).each(function() {
                    var font =  $(this).css('font-family').replace('"', '');
                    if (font.indexOf("Open Sans") == -1 ){
                        fontListUrl.data.push(font);
                    }else {
                        fontListUrl.data.push("OpenSans");
                    }
                });
            }
            return fontListUrl;
        }

        // set tracking user history
        TWIG.userConnected.saveHistory.unshift({
          'username'  : SL.current_user.username,
          'email'     : SL.current_user.email,
          'saveDate'  : SL.editor.controllers.Appearence.convertDate(Date())
        });

    }
};