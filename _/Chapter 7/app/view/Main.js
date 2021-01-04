Ext.define('TodoApp.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-main',
    fullscreen: true,
    config: {
    	layout: 'vbox',
    	items: [
	    	{
	    		xtype: 'panel',
		        layout: 'card',
		        itemId: 'todo-main-panel',
		        items: { xtype: 'todo-lists' },
		        flex: 1
		    },
	        {
	        	xtype: 'toolbar',
	        	docked: 'bottom'
	        }
    	]
    },
    activeIndex: 0
});