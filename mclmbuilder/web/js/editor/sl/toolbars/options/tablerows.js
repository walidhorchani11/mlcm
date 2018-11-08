'use strict';

export const toolbarsoptionstablerows = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-rows",
            label: TWIG.toolbar.options.rows,
            property: "attribute.data-table-rows",
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
