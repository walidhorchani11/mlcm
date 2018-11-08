'use strict';

export const toolbarsoptionsblockdepth = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "block-depth",
            label: TWIG.toolbar.options.depth,
            items: [{
                value: "back",
                icon: "arrow-down",
                tooltip: TWIG.toolbar.options.moveBAck
            }, {
                value: "front",
                icon: "arrow-up",
                tooltip: TWIG.toolbar.options.moveFront
            }]
        }, t))
    },
    trigger: function(e) {
         "front" === e ? SL.editor.controllers.Blocks.moveBlocksToDepth(SL.editor.controllers.Blocks.getFocusedBlocks(), 1e4) : "back" === e && SL.editor.controllers.Blocks.moveBlocksToDepth(SL.editor.controllers.Blocks.getFocusedBlocks(), 0);
        if("front" === e || "back" === e  )
        {
            SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.find('.block-style').css('z-index', SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.find('.sl-block-content').css('z-index'));
        }
        $('.sl-block').each(function() {
            $(this).find('.block-style').css('z-index',$(this).find('.sl-block-content').css('z-index'));

        });

        /* if("front" === e )
        {
            var MoveToFront=false;
            var blockFocused=SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.find('.sl-block-content');
            SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.find('.sl-block-content').css('z-index');
            $('.sl-block').find('.sl-block-content').filter(function() {
                return $(this).css('z-index') == (parseInt($(blockFocused).css('z-index'))+1);
            }).each(function() {
                $(this).css('z-index',parseInt($(blockFocused).css('z-index')));
                MoveToFront=true;
            });
            if( MoveToFront)
            {
                $(blockFocused).css('z-index',parseInt($(blockFocused).css('z-index'))+1);
                MoveToFront=false;
            }

        }
        else if ("back" === e )
        {
            var MoveToBack=false;
            var blockFocused=SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.find('.sl-block-content');
            $('.sl-block').find('.sl-block-content').filter(function() {
                return $(this).css('z-index') == (parseInt($(blockFocused).css('z-index'))-1);
            }).each(function() {
                $(this).css('z-index',parseInt($(blockFocused).css('z-index')));
                MoveToBack=true;
            });
            if( MoveToBack)
            {
                $(blockFocused).css('z-index',parseInt($(blockFocused).css('z-index'))-1);
                MoveToBack =false;
            }
        }*/


      }
};
