/**
 * Created by argo on 06/10/16.
 */
CKEDITOR.plugins.add( 'screen',
    {
        requires : ['richcombo'], //, 'styles' ],
        init : function( editor )
        {
            var config = editor.config,
                lang = editor.lang.format;

            // Gets the list of tags from the settings.
            var tags = []; //new Array();
            //this.add('value', 'drop_text', 'drop_label');


            length_slide = $('.slides section').size();

            for (var i =0; i < length_slide; i++){
                tags[i]=[i, "screen"+i, "screen"+i];

            }

            // Create style objects for all defined styles.

            editor.ui.addRichCombo( 'screen',
                {
                    label : "screen",
                    title :"screen",
                    voiceLabel : "Insert screen",
                    className : 'cke_format',
                    multiSelect : false,

                    panel :
                    {
                        css : [ config.contentsCss, CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ],
                        voiceLabel : lang.panelVoiceLabel
                    },

                    init : function()
                    {
                        this.startGroup( "screen" );
                        //this.add('value', 'drop_text', 'drop_label');
                        for (var this_tag in tags){
                            this.add(tags[this_tag][0], tags[this_tag][1], tags[this_tag][2]);
                        }
                    },

                    onClick : function( value )
                    {

                        ke = Object.keys(CKEDITOR.instances);
                        ke  = ke[0];
                        chaine_screen = CKEDITOR.instances[ke].getSelectedHtml(true);

                        var chaine_sreen_concat = '<span class="link '+ value +'" >'+ chaine_screen + '</span>' ;

                        editor.focus();
                        editor.fire( 'saveSnapshot' );
                        editor.insertHtml(chaine_sreen_concat);
                      //  editor.insertHtml(value);
                        editor.fire( 'saveSnapshot' );
                    }

                });
            editor.on( 'destroy', function(e) {
                cgotoscrenn();
            });
        }
    });