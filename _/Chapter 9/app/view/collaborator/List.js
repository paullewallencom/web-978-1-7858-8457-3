Ext.define('TodoApp.view.collaborator.List', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-collaborator-list',
    requires: [
        'Ext.TitleBar',
        'Ext.dataview.DataView'
    ],

    config: {
    	items: [
	        {
	            docked: 'top',
	            xtype: 'titlebar',
	            title: 'Users',
	            items: [
	            	{
	            		align: 'left',
	            		text: 'Back',
	            		action: 'back'
	            	},
		            {
		                align: 'right',
		                text: 'Add',
		                action: 'add'
		            }
	            ]
	        },
	        {
	        	xtype: 'dataview',
	        	height: '100%',
	        	useComponents: true,
	        	defaultType: 'todo-collaborator-dataitem',
            	store: 'Collaborator',
            	emptyText: '<div style="' +
				            'text-align: center;' +
				            'height: 100%;' +
				            'margin-top: 50%;">' +
				            'Add a collaborator to this list' +
				            '</div>',
				deferEmptyText: true
	        }
    	]
    }
});
