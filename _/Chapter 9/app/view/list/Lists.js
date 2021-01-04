Ext.define('TodoApp.view.list.Lists', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-lists',
    requires: [
        'Ext.TitleBar',
        'Ext.dataview.DataView'
    ],

    config: {
    	items: [
	        {
	            docked: 'top',
	            xtype: 'titlebar',
	            title: 'Lists',
	            items: [
	            	{
	            		align: 'left',
	            		text: 'Sign in',
	            		action: 'signin'
	            	},
	            	{
	            		align: 'left',
	            		text: 'Sign out',
	            		action: 'signout',
	            		hidden: true
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
	        	defaultType: 'todo-list-dataitem',
            	store: 'List',
            	emptyText: '<div style="' +
				            'text-align: center;' +
				            'height: 100%;' +
				            'margin-top: 50%;">' +
				            'Create a todo list and help your brain' +
				            '</div>',
				deferEmptyText: true
	        }
    	]
    },

    initialize: function() {
    	// Autoload appears to be broken for dataviews
    	Ext.getStore('List').load();

    	this.callParent();
    }
});
