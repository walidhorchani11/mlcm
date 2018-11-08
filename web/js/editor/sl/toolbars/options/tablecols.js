'use strict';

export const toolbarsoptionstablecols = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-cols",
            label: TWIG.toolbar.options.columns,
            property: "attribute.data-table-cols",
            progressbar: !1
        }, t)), this.onTableSizeChanged = this.onTableSizeChanged.bind(this), e.tableSizeChanged.add(this.onTableSizeChanged)
    },
    onTableSizeChanged: function() {
        this.readFromBlock()
    },
    destroy: function() {
        this.block.tableSizeChanged && this.block.tableSizeChanged.remove(this.onTableSizeChanged), this._super()
    }
};
