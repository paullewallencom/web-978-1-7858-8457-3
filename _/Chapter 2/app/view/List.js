Ext.define('TodoApp.view.List', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-list',
    requires: [
        'Ext.TitleBar',
        'Ext.dataview.DataView'
    ],

    config: {
    	items: [
	        {
	            docked: 'top',
	            xtype: 'titlebar',
	            title: 'Things to do',
	            items: {
	                align: 'right',
	                text: 'Add',
	                action: 'new'
	            }
	        },
	        {
	        	xtype: 'dataview',
	        	height: '100%',
	        	useComponents: true,
	        	defaultType: 'todolistitem',
            store: 'Item'
	        }
    	]
    },

    initialize: function() {
    	// Autoload appears to be broken for dataviews
    	Ext.getStore('Item').load();

    	this.callParent();
    }
});
