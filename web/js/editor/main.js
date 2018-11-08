'use strict';

require('underscore');
require('ejs');

// main methods and libraries
import { editorplugins }                        from './editorplugins';
// sl methods files
import { slbase }                               from './sl/base';
import { transformLine }                        from './sl/transformLine';
import { transform }                            from './sl/transform';
import { code }                                 from './sl/code';
import { iframe }                               from './sl/iframe';
import { image }                                from './sl/image';
import { video }                                from './sl/video';
import { slline }                               from './sl/line';
import * as lineGenerate                        from './sl/line-generate';
import { math }                                 from './sl/math';
import { slHtml }                               from './sl/html';
import { slLink }                               from './sl/link';
import { slShape }                              from './sl/shape';
import * as shapeFromType                       from './sl/shapeformtype';
import { snippetBase }                          from './sl/snippet/base';
import { table }                                from './sl/table';
import { text }                                 from './sl/text';
import { scrollabletext }                       from './sl/scrollabletext';
import { survey }                               from './sl/survey';
import { colorpicker }                          from './sl/colorpicker';
import { filters }                              from './sl/medialibrary/filters';
import { listdrag }                             from './sl/medialibrary/listdrag';
import { list }                                 from './sl/medialibrary/list';
import { mediapage }                            from './sl/medialibrary/page';
import { mediapopup }                           from './sl/medialibrary/popup';
import { mediaupload }                          from './sl/medialibrary/uploader';
import { sidebar }                              from './sl/sidebar/sidebar';
import { sidebarbase }                          from './sl/sidebar/base';
import { sidebarpopin }                         from './sl/sidebar/popin';
import { sidebarreferences }                    from './sl/sidebar/references';
import { sidebarexport }                        from './sl/sidebar/export';
import { sidebarpdf }                           from './sl/sidebar/pdf';
import { sidebarzip }                           from './sl/sidebar/zip';
import { sidebarimportfile }                    from './sl/sidebar/importfile';
import { sidebarimportreveal }                  from './sl/sidebar/importreveal';
import { sidebarimport }                        from './sl/sidebar/import';
import { sidebarrevisions }                     from './sl/sidebar/revisions';
import { sidebarreference }                     from './sl/sidebar/reference';
import { sidebarsettings }                      from './sl/sidebar/settings';
import { sidebarstyle }                         from './sl/sidebar/style';
import { slideoptions }                         from './sl/slideoptions';
import { toolbars }                             from './sl/toolbars/toolbars';
import { toolbarsbase }                         from './sl/toolbars/base';
import { toolbarsaddsinppet }                   from './sl/toolbars/addsnippet';
import { toolbarsadd }                          from './sl/toolbars/add';
import { toolbarseditmultiple }                 from './sl/toolbars/editmultiple';
import { toolbarsedit }                         from './sl/toolbars/edit';
import { toolbarsgroupsbase }                   from './sl/toolbars/groups/base';
import { toolbarsgroupsanimation }              from './sl/toolbars/groups/animation';
import { toolbarsgroupsbordercss }              from './sl/toolbars/groups/bordercss';
import { toolbarsgroupsbordersvg }              from './sl/toolbars/groups/bordersvg';
import { toolbarsgroupslink }                   from './sl/toolbars/groups/link';
import { toolbarsgroupstablesize }              from './sl/toolbars/groups/tablesize';
import { toolbarsoptionsbase }                  from './sl/toolbars/options/base';
import { toolbarsoptionsvalue }                 from './sl/toolbars/options/value';
import { toolbarsoptionsbutton }                from './sl/toolbars/options/button';
import { toolbarsoptionscheckbox }              from './sl/toolbars/options/checkbox';
import { toolbarsoptionscolor }                 from './sl/toolbars/options/color';
import { toolbarsoptionsmulti }                 from './sl/toolbars/options/multi';
import { toolbarsoptionsradio }                 from './sl/toolbars/options/radio';
import { toolbarsoptionsrange }                 from './sl/toolbars/options/range';
import { toolbarsoptionsselect }                from './sl/toolbars/options/select';
import { toolbarsoptionsselectlinetype }        from './sl/toolbars/options/selectlinetype';
import { toolbarsoptionsstepper }               from './sl/toolbars/options/stepper';
import { toolbarsoptionstext }                  from './sl/toolbars/options/text';
import { toolbarsoptionstoggle }                from './sl/toolbars/options/toggle';
import { toolbarsoptionsanimationpreview }      from './sl/toolbars/options/animationpreview';
import { toolbarsoptionsanimationtype }         from './sl/toolbars/options/animationtype';
import { toolbarsoptionsback }                  from './sl/toolbars/options/back';
import { toolbarsoptionsbackgroundcolor }       from './sl/toolbars/options/backgroundcolor';
import { toolbarsoptionsblockactions }          from './sl/toolbars/options/blockactions';
import { toolbarsoptionsblockalignhorizontal }  from './sl/toolbars/options/blockalignhorizontal';
import { toolbarsoptionsblockalignvertical }    from './sl/toolbars/options/blockalignvertical';
import { toolbarsoptionsblockdepth }            from './sl/toolbars/options/blockdepth';
import { toolbarsoptionsbordercolor }           from './sl/toolbars/options/bordercolor';
import { toolbarsoptionsborderradius }          from './sl/toolbars/options/borderradius';
import { toolbarsoptionsborderstyle }           from './sl/toolbars/options/borderstyle';
import { toolbarsoptionsborderwidth }           from './sl/toolbars/options/borderwidth';
import { toolbarsoptionsclassname }             from './sl/toolbars/options/classname';
import { toolbarsoptionscodelanguage }          from './sl/toolbars/options/codelanguage';
import { toolbarsoptionscodetheme }             from './sl/toolbars/options/codetheme';
import { toolbarsoptionscode }                  from './sl/toolbars/options/code';
import { toolbarsoptionsdivider }               from './sl/toolbars/options/divider';
import { toolbarsoptionshtml }                  from './sl/toolbars/options/html';
import { toolbarsoptionsiframeautoplay }        from './sl/toolbars/options/iframeautoplay';
import { toolbarsoptionsiframesrc }             from './sl/toolbars/options/iframesrc';
import { toolbarsoptionsimageInlinesvg }        from './sl/toolbars/options/imageInlinesvg';
import { toolbarsoptionsImage }                 from './sl/toolbars/options/image';
import { toolbarsoptionsVideo }                 from './sl/toolbars/options/video';
import { toolbarsoptionsVideoOption }           from './sl/toolbars/options/videooptions';
import { toolbarsoptionsSurveyTypes }           from './sl/toolbars/options/surveytypes';
import { toolbarsoptionsSurveyTextButton }      from './sl/toolbars/options/surveytextbutton';
import { toolbarsoptionsSurveyTextSizeButton }  from './sl/toolbars/options/surveytextsizebutton';
import { toolbarsoptionsSurveyButtonColors }    from './sl/toolbars/options/surveybuttoncolors';
import { toolbarsoptionsSurveyBgButton }        from './sl/toolbars/options/surveybgbutton';
import { toolbarsoptionsSurveyPreviewButton }   from './sl/toolbars/options/surveypreviewbutton';
import { toolbarsoptionsSurveyAddButton }       from './sl/toolbars/options/surveyaddbutton';
import { toolbarsoptionsletterspacing }         from './sl/toolbars/options/letterspacing';
import { toolbarsoptionslinecolor }             from './sl/toolbars/options/linecolor';
import { toolbarsoptionslineendtype }           from './sl/toolbars/options/lineendtype';
import { toolbarsoptionslineheight }            from './sl/toolbars/options/lineheight';
import { toolbarsoptionslinestarttype }         from './sl/toolbars/options/linestarttype';
import { toolbarsoptionslinestyle }             from './sl/toolbars/options/linestyle';
import { toolbarsoptionslinewidth }             from './sl/toolbars/options/linewidth';
import { toolbarsoptionslinkurl }               from './sl/toolbars/options/linkurl';
import { toolbarsoptionslinktopopin }           from './sl/toolbars/options/linktopopin';
import { toolbarsoptionslinktoscreen }          from './sl/toolbars/options/linktoscreen';
import { toolbarsoptionslinktopdf }             from './sl/toolbars/options/linktopdf';
import { toolbarsoptionsmathcolor }             from './sl/toolbars/options/mathcolor';
import { toolbarsoptionsmathinput }             from './sl/toolbars/options/mathinput';
import { toolbarsoptionsmathsize }              from './sl/toolbars/options/mathsize';
import { toolbarsoptionsopacity }               from './sl/toolbars/options/opacity';
import { toolbarsoptionspadding }               from './sl/toolbars/options/padding';
import { toolbarsoptionsreferences }            from './sl/toolbars/options/references';
import { toolbarsoptionsshapefillcolor }        from './sl/toolbars/options/shapefillcolor';
import { toolbarsoptionsshapestretch }          from './sl/toolbars/options/shapestretch';
import { toolbarsoptionsshapestrokecolor }      from './sl/toolbars/options/shapestrokecolor';
import { toolbarsoptionsshapestrokewidth }      from './sl/toolbars/options/shapestrokewidth';
import { toolbarsoptionsshapetype }             from './sl/toolbars/options/shapetype';
import { toolbarsoptionstablebordercolor }      from './sl/toolbars/options/tablebordercolor';
import { toolbarsoptionstableborderwidth }      from './sl/toolbars/options/tableborderwidth';
import { toolbarsoptionstablecols }             from './sl/toolbars/options/tablecols';
import { toolbarsoptionstablehasheader }        from './sl/toolbars/options/tablehasheader';
import { toolbarsoptionstablepadding }          from './sl/toolbars/options/tablepadding';
import { toolbarsoptionstablerows }             from './sl/toolbars/options/tablerows';
import { toolbarsoptionstextcolor }             from './sl/toolbars/options/textcolor';
import { toolbarsoptionstextalign }             from './sl/toolbars/options/textalign';
import { toolbarsoptionstextsize }              from './sl/toolbars/options/textsize';
import { toolbarsoptionstransitiondelay }       from './sl/toolbars/options/transitiondelay';
import { toolbarsoptionstransitionduration }    from './sl/toolbars/options/transitionduration';
import { toolbarspanel }                        from './sl/toolbars/panel';
import { controllersapi }                       from './sl/controllers/controllers_api';
import { controllerblocks }                     from './sl/controllers/controllers_blocks';
// import { controllercapabilities }               from './sl/controllers/controllers_capabilities';
import { controllercontrast }                   from './sl/controllers/controllers_contrast';
import { controllerdeckimport }                 from './sl/controllers/controllers_deckImport';
import { controllergrid }                       from './sl/controllers/controllers_grid';
import { controllerguides }                     from './sl/controllers/controllers_guides';
import { controllerhistory }                    from './sl/controllers/controllers_history';
import { controllermarkup }                     from './sl/controllers/controllers_markup';
import { controllermedia }                      from './sl/controllers/controllers_media';
import { controllermigration }                  from './sl/controllers/controllers_migration';
import { controllermode }                       from './sl/controllers/controllers_mode';
import { controlleronboarding }                 from './sl/controllers/controllers_onboarding';
import { controllerselection }                  from './sl/controllers/controllers_selection';
import { controllerserialize }                  from './sl/controllers/controllers_serialize';
import { controllerthumbnail }                  from './sl/controllers/controllers_thumbnail';
import { controllerpopin }                      from './sl/controllers/controllers_popin';
import { controllerSurvey }                     from './sl/controllers/controllers_survey';
import { controllerReferences }                 from './sl/controllers/controllers_reference';
import { controllerAddtext }                    from './sl/controllers/controllers_addText';
import { controllerMenu }                       from './sl/controllers/controllers_menu';
import { controllerpdf }                        from './sl/controllers/controllers_pdf';
import { controllerRcp }                        from './sl/controllers/controllers_rcp';
import { controllerurl }                        from './sl/controllers/controllers_url';
import { controllerappearence }                 from './sl/controllers/controllers_appearence';
import { controllerpresentation }               from './sl/controllers/controllers_presentations';
import { editor_base }                          from './sl/editor';
import { modesbase }                            from './sl/modes/base';
import { modesarrange }                         from './sl/modes/arrange';
import { modescss }                             from './sl/modes/css';
//import { modesfragment }                        from './sl/modes/fragment';
import { modespreview }                         from './sl/modes/preview';
import { editortests }                          from './sl/tests';

editorplugins,
SL("editor.blocks").Base                        = Class.extend(slbase),
SL("editor.blocks.behavior").TransformLine      = Class.extend(transformLine),
SL("editor.blocks.behavior").Transform          = Class.extend(transform),
SL("editor.blocks").Code                        = SL.editor.blocks.Base.extend(code),
SL("editor.blocks").Iframe                      = SL.editor.blocks.Base.extend(iframe),
SL("editor.blocks").Image                       = SL.editor.blocks.Base.extend(image),
SL("editor.blocks").Video                       = SL.editor.blocks.Base.extend(video),
SL("editor.blocks").Line                        = SL.editor.blocks.Base.extend(slline),
SL.editor.blocks.Line.DEFAULT_COLOR             = "#000000",
SL.editor.blocks.Line.DEFAULT_LINE_WIDTH        = 2,
SL.editor.blocks.Line.POINT_1                   = "p1",
SL.editor.blocks.Line.POINT_2                   = "p2",
SL.editor.blocks.Line.roundPoints = function() {
    for (var e = 0; e < arguments.length; e++) arguments[e].x = Math.round(arguments[e].x), arguments[e].y = Math.round(arguments[e].y)
},
SL.editor.blocks.Line.generate                  = lineGenerate,
SL("editor.blocks").Math                        = SL.editor.blocks.Base.extend(math),
SL("editor.blocks.plugin").HTML                 = Class.extend(slHtml),
SL("editor.blocks.plugin").Link                 = Class.extend(slLink),
SL("editor.blocks").Shape                       = SL.editor.blocks.Base.extend(slShape),
SL.editor.blocks.Shape.shapeFromType = function(e, t, i) {
    return t = t || 32, i = i || 32, /^symbol\-/.test(e) ? SL.util.svg.symbol(e.replace(/^symbol\-/, "")) : "rect" === e ? SL.util.svg.rect(t, i) : "circle" === e ? SL.util.svg.ellipse(t, i) : "diamond" === e ? SL.util.svg.polygon(t, i, 4) : "octagon" === e ? SL.util.svg.polygon(t, i, 8) : "triangle-up" === e ? SL.util.svg.triangleUp(t, i) : "triangle-down" === e ? SL.util.svg.triangleDown(t, i) : "triangle-left" === e ? SL.util.svg.triangleLeft(t, i) : "triangle-right" === e ? SL.util.svg.triangleRight(t, i) : "arrow-up" === e ? SL.util.svg.arrowUp(t, i) : "arrow-down" === e ? SL.util.svg.arrowDown(t, i) : "arrow-left" === e ? SL.util.svg.arrowLeft(t, i) : "arrow-right" === e ? SL.util.svg.arrowRight(t, i) : void 0
},
SL("editor.blocks").Snippet                     = SL.editor.blocks.Base.extend(snippetBase),
SL.editor.blocks.Snippet.DEFAULT_WIDTH          = 300,
SL.editor.blocks.Snippet.DEFAULT_HEIGHT         = 300,
SL("editor.blocks").Table                       = SL.editor.blocks.Base.extend(table),
SL.editor.blocks.Table.DEFAULT_WIDTH            = 800,
SL.editor.blocks.Table.DEFAULT_HEIGHT           = 400,
SL.editor.blocks.Table.MIN_COL_WIDTH            = 40,
SL("editor.blocks").Text                        = SL.editor.blocks.Base.extend(text),
SL.editor.blocks.Text.DEFAULT_WIDTH             = 600,
SL("editor.blocks").ScrollableText              = SL.editor.blocks.Base.extend(scrollabletext),
SL.editor.blocks.ScrollableText.DEFAULT_WIDTH   = 400,
SL.editor.blocks.ScrollableText.DEFAULT_HEIGHT  = 300,
SL("editor.blocks").Survey = SL.editor.blocks.Base.extend(survey),
SL("editor.components").Colorpicker             = Class.extend(colorpicker),
SL("editor.components.medialibrary").Filters    = Class.extend(filters),
SL.editor.components.medialibrary.Filters.FILTER_TYPE_MEDIA     = "media",
SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG       = "tag",
SL.editor.components.medialibrary.Filters.FILTER_TYPE_SEARCH    = "search",
SL("editor.components.medialibrary").ListDrag           = Class.extend(listdrag),
SL("editor.components.medialibrary").List               = Class.extend(list),
SL("editor.components.medialibrary").MediaLibraryPage   = Class.extend(mediapage),
SL("editor.components.medialibrary").MediaLibrary       = SL.components.popup.Popup.extend(mediapopup),
SL("editor.components.medialibrary").Uploader           = Class.extend(mediaupload),
SL("editor.components").Sidebar                         = Class.extend(sidebar),
SL("editor.components.sidebar").Base                    = Class.extend(sidebarbase),
SL("editor.components.sidebar").popin                   = SL.editor.components.sidebar.Base.extend(sidebarpopin),
SL("editor.components.sidebar").Export                  = SL.editor.components.sidebar.Base.extend(sidebarexport),
SL("editor.components.sidebar").Export.PDF              = Class.extend(sidebarpdf),
SL("editor.components.sidebar").Export.ZIP              = Class.extend(sidebarzip),
SL("editor.components.sidebar").ImportFile              = Class.extend(sidebarimportfile),
SL("editor.components.sidebar").ImportReveal            = Class.extend(sidebarimportreveal),
SL("editor.components.sidebar").Import                  = SL.editor.components.sidebar.Base.extend(sidebarimport),
SL("editor.components.sidebar").Revisions               = SL.editor.components.sidebar.Base.extend(sidebarrevisions),
SL("editor.components.sidebar").reference               = SL.editor.components.sidebar.Base.extend(sidebarreference),
SL("editor.components.sidebar").Settings                = SL.editor.components.sidebar.Base.extend(sidebarsettings),
SL("editor.components.sidebar").Style                   = SL.editor.components.sidebar.Base.extend(sidebarstyle),
SL("editor.components").SlideOptions                    = Class.extend(slideoptions),
SL("editor.components").Toolbars                        = Class.extend(toolbars),
SL("editor.components.toolbars").Base                   = Class.extend(toolbarsbase),
SL("editor.components.toolbars").AddSnippet             = SL.editor.components.toolbars.Base.extend(toolbarsaddsinppet),
SL("editor.components.toolbars").Add                    = SL.editor.components.toolbars.Base.extend(toolbarsadd),
SL("editor.components.toolbars").EditMultiple           = SL.editor.components.toolbars.Base.extend(toolbarseditmultiple),
SL("editor.components.toolbars").Edit                   = SL.editor.components.toolbars.Base.extend(toolbarsedit),
SL("editor.components.toolbars.groups").Base            = Class.extend(toolbarsgroupsbase),
SL("editor.components.toolbars.groups").Animation       = SL.editor.components.toolbars.groups.Base.extend(toolbarsgroupsanimation),
SL("editor.components.toolbars.groups").BorderCSS       = SL.editor.components.toolbars.groups.Base.extend(toolbarsgroupsbordercss),
SL("editor.components.toolbars.groups").BorderSVG       = SL.editor.components.toolbars.groups.Base.extend(toolbarsgroupsbordersvg),
SL("editor.components.toolbars.groups").LineType        = SL.editor.components.toolbars.groups.Base.extend({
    init: function(e, t) {

    }
}),
SL("editor.components.toolbars.groups").Link            = SL.editor.components.toolbars.groups.Base.extend(toolbarsgroupslink),
SL("editor.components.toolbars.groups").TableSize       = SL.editor.components.toolbars.groups.Base.extend(toolbarsgroupstablesize),
SL("editor.components.toolbars.options").Base           = Class.extend(toolbarsoptionsbase),
SL("editor.components.toolbars.options").Value          = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsvalue),
SL("editor.components.toolbars.options").Button         = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsbutton),
SL("editor.components.toolbars.options").Checkbox       = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionscheckbox),
SL("editor.components.toolbars.options").Color          = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionscolor),
SL("editor.components.toolbars.options").Multi          = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsmulti),
SL("editor.components.toolbars.options").Radio          = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionsradio),
SL("editor.components.toolbars.options").Range          = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionsrange),
SL("editor.components.toolbars.options").Select         = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionsselect),
SL("editor.components.toolbars.options").SelectLineType = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionsselectlinetype),
SL("editor.components.toolbars.options").Stepper        = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionsstepper),
SL("editor.components.toolbars.options").Text           = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionstext),
SL("editor.components.toolbars.options").Toggle         = SL.editor.components.toolbars.options.Value.extend(toolbarsoptionstoggle),
SL("editor.components.toolbars.options").AnimationPreview = SL.editor.components.toolbars.options.Button.extend(toolbarsoptionsanimationpreview),
SL("editor.components.toolbars.options").AnimationType  = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionsanimationtype),
SL("editor.components.toolbars.options").Back           = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsback),
SL("editor.components.toolbars.options").BackgroundColor = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionsbackgroundcolor),
SL("editor.components.toolbars.options").BlockActions   = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionsblockactions),
SL("editor.components.toolbars.options").BlockAlignHorizontal   = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionsblockalignhorizontal),
SL("editor.components.toolbars.options").BlockAlignVertical     = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionsblockalignvertical),
SL("editor.components.toolbars.options").BlockDepth             = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionsblockdepth),
SL("editor.components.toolbars.options").BorderColor            = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionsbordercolor),
SL("editor.components.toolbars.options").BorderRadius           = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsborderradius),
SL("editor.components.toolbars.options").BorderStyle            = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionsborderstyle),
SL("editor.components.toolbars.options").BorderWidth            = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsborderwidth),
SL("editor.components.toolbars.options").ClassName              = SL.editor.components.toolbars.options.Text.extend(toolbarsoptionsclassname),
SL("editor.components.toolbars.options").CodeLanguage           = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionscodelanguage),
SL("editor.components.toolbars.options").CodeTheme              = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionscodetheme),
SL("editor.components.toolbars.options").Code                   = SL.editor.components.toolbars.options.Text.extend(toolbarsoptionscode),
SL("editor.components.toolbars.options").Divider                = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsdivider),
SL("editor.components.toolbars.options").HTML                   = SL.editor.components.toolbars.options.Button.extend(toolbarsoptionshtml),
SL("editor.components.toolbars.options").IframeAutoplay         = SL.editor.components.toolbars.options.Checkbox.extend(toolbarsoptionsiframeautoplay),
SL("editor.components.toolbars.options").IframeSRC              = SL.editor.components.toolbars.options.Text.extend(toolbarsoptionsiframesrc),
SL("editor.components.toolbars.options").ImageInlineSVG         = SL.editor.components.toolbars.options.Checkbox.extend(toolbarsoptionsimageInlinesvg),
SL("editor.components.toolbars.options").Image                  = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsImage),
SL("editor.components.toolbars.options").Video                  = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsVideo),
SL("editor.components.toolbars.options").VideoOptions           = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsVideoOption),
SL("editor.components.toolbars.options").SurveyTypes                  = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyTypes),
SL("editor.components.toolbars.options").SurveyTextButton             = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyTextButton),
SL("editor.components.toolbars.options").SurveyTextSizeButton         = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyTextSizeButton),
SL("editor.components.toolbars.options").SurveyTextSizeButtonColors   = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyButtonColors),
SL("editor.components.toolbars.options").SurveyBgButton               = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyBgButton),
SL("editor.components.toolbars.options").SurveyPreviewButton          = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyPreviewButton),
SL("editor.components.toolbars.options").SurveyAddButton              = SL.editor.components.toolbars.options.Base.extend(toolbarsoptionsSurveyAddButton),
SL("editor.components.toolbars.options").LetterSpacing          = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsletterspacing),
SL("editor.components.toolbars.options").LineColor              = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionslinecolor),
SL("editor.components.toolbars.options").LineEndType            = SL.editor.components.toolbars.options.SelectLineType.extend(toolbarsoptionslineendtype),
SL("editor.components.toolbars.options").LineHeight             = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionslineheight),
SL("editor.components.toolbars.options").LineStartType          = SL.editor.components.toolbars.options.SelectLineType.extend(toolbarsoptionslinestarttype),
SL("editor.components.toolbars.options").LineStyle              = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionslinestyle),
SL("editor.components.toolbars.options").LineWidth              = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionslinewidth),
SL("editor.components.toolbars.options").LinkURL                = SL.editor.components.toolbars.options.Text.extend(toolbarsoptionslinkurl),
SL("editor.components.toolbars.options").LinkToPopin            = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionslinktopopin),
SL("editor.components.toolbars.options").LinkToScreen           = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionslinktoscreen),
SL("editor.components.toolbars.options").LinkToPdf              = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionslinktopdf),
SL("editor.components.toolbars.options").MathColor              = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionsmathcolor),
SL("editor.components.toolbars.options").MathInput              = SL.editor.components.toolbars.options.Text.extend(toolbarsoptionsmathinput),
SL("editor.components.toolbars.options").MathSize               = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsmathsize),
SL("editor.components.toolbars.options").Opacity                = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsopacity),
SL("editor.components.toolbars.options").Padding                = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionspadding),
SL("editor.components.toolbars.options").Reference              = SL.editor.components.toolbars.options.Multi.extend(toolbarsoptionsreferences),
SL("editor.components.toolbars.options").ShapeFillColor         = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionsshapefillcolor),
SL("editor.components.toolbars.options").ShapeStretch           = SL.editor.components.toolbars.options.Checkbox.extend(toolbarsoptionsshapestretch),
SL("editor.components.toolbars.options").ShapeStrokeColor       = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionsshapestrokecolor),
SL("editor.components.toolbars.options").ShapeStrokeWidth       = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionsshapestrokewidth),
SL("editor.components.toolbars.options").ShapeType              = SL.editor.components.toolbars.options.Select.extend(toolbarsoptionsshapetype),
SL("editor.components.toolbars.options").TableBorderColor       = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionstablebordercolor),
SL("editor.components.toolbars.options").TableBorderWidth       = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstableborderwidth),
SL("editor.components.toolbars.options").TableCols              = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstablecols),
SL("editor.components.toolbars.options").TableHasHeader         = SL.editor.components.toolbars.options.Checkbox.extend(toolbarsoptionstablehasheader),
SL("editor.components.toolbars.options").TablePadding           = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstablepadding),
SL("editor.components.toolbars.options").TableRows              = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstablerows),
SL("editor.components.toolbars.options").TextAlign              = SL.editor.components.toolbars.options.Radio.extend(toolbarsoptionstextalign),
SL("editor.components.toolbars.options").TextColor              = SL.editor.components.toolbars.options.Color.extend(toolbarsoptionstextcolor),
SL("editor.components.toolbars.options").TextSize               = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstextsize),
SL("editor.components.toolbars.options").TransitionDelay        = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstransitiondelay),
SL("editor.components.toolbars.options").TransitionDuration = SL.editor.components.toolbars.options.Stepper.extend(toolbarsoptionstransitionduration),
SL("editor.components.toolbars.util").Panel = Class.extend(toolbarspanel),
SL.editor.components.toolbars.util.Panel.INSTANCES = [],
SL("editor.controllers").API            = controllersapi,
SL("editor.controllers").Blocks         = controllerblocks,
// SL("editor.controllers").Capabilities   = controllercapabilities,
SL("editor.controllers").Contrast       = controllercontrast,
SL("editor.controllers").DeckImport     = controllerdeckimport,
SL("editor.controllers").Grid           = controllergrid,
SL("editor.controllers").Guides         = controllerguides,
SL("editor.controllers").History        = controllerhistory,
SL("editor.controllers").Markup         = controllermarkup,
SL("editor.controllers").Media          = controllermedia,
SL("editor.controllers").Migration      = controllermigration,
SL("editor.controllers").Mode           = controllermode,
SL("editor.controllers").Onboarding     = controlleronboarding,
SL("editor.controllers").Selection      = controllerselection,
SL("editor.controllers").Serialize      = controllerserialize,
SL("editor.controllers").Thumbnail      = controllerthumbnail,
SL("editor.controllers").Popin          = controllerpopin,
SL("editor.controllers").Survey         = controllerSurvey,
SL("editor.controllers").References     = controllerReferences,
SL("editor.controllers").Addtext        = controllerAddtext,
SL("editor.controllers").Menu           = controllerMenu,
SL("editor.controllers").Pdf            = controllerpdf,
SL("editor.controllers").Rcp            = controllerRcp,
SL("editor.controllers").URL            = controllerurl,
SL("editor.controllers").Appearence     = controllerappearence,
SL("editor.controllers").Presentation   = controllerpresentation,
SL("editor").Editor                     = SL.views.Base.extend(editor_base),
SL.editor.Editor.VERSION                = 2,
SL("editor.modes").Base                 = Class.extend(modesbase),
SL("editor.modes").Arrange              = SL.editor.modes.Base.extend(modesarrange),
SL("editor.modes").CSS                  = SL.editor.modes.Base.extend(modescss),
//SL("editor.modes").Fragment             = SL.editor.modes.Base.extend(modesfragment),
SL("editor.modes").Preview              = SL.editor.modes.Base.extend(modespreview),
SL("editor").Tests                      = editortests;