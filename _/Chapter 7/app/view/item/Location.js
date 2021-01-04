Ext.define('TodoApp.view.item.Location', {
	extend: 'Ext.Panel',
	alias: 'widget.todo-location',
	requires: [
		'Ext.Map'
	],

	config: {
        layout: 'fit',
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: 'Set location',
                items: [
                    {
                        align: 'left',
                        text: 'Back',
                        action: 'back'
                    },
                    {
                        align: 'right',
                        text: 'Set',
                        action: 'set'
                    }
                ]
            },
            {
                xtype: 'panel',
                layout: 'fit',
                listeners: {
                    add: function(obj, item, index) {
                        var parent = obj.up('todo-location');
                        parent.onMapAdd(obj, item.getMap());
                    }
                }
            }
        ]
	},

    onMapAdd: function(obj, map) {
        var mapPanel = obj.up('todo-location');
        
        // Resize the Google map
        google.maps.event.trigger(map, 'resize');

        if (map.mapRendered) {
            mapPanel.clearMarker(mapPanel);
        }
    },

	clearMarker: function(me) {
        var map = me.down('map').getMap();

		map.mapMarker.bindTo('position', map, 'center');

		me.down('map').setMapOptions({draggable: true});
	}
});
