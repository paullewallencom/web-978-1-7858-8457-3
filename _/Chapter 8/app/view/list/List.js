Ext.define('TodoApp.view.list.List', {
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
	            items: [
                    {
                        align: 'left',
                        text: 'Back',
                        action: 'back'
                    },
		            {
		                align: 'right',
		                text: 'Add',
		                action: 'new'
		            }
	            ]
	        },
	        {
	        	xtype: 'dataview',
	        	height: '100%',
	        	useComponents: true,
	        	defaultType: 'todo-dataitem',
	        	store: 'Item',
                emptyText: '<div style="' +
                            'text-align: center;' +
                            'height: 100%;' +
                            'margin-top: 50%;">' +
                            'Add a todo item to this list' +
                            '</div>',
                deferEmptyText: true
	        }
    	]
    },

    initialize: function() {
    	// Autoload appears to be broken for dataviews
    	Ext.getStore('Item').load();

    	this.callParent();
    }
});
