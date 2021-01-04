Ext.define('TodoApp.view.item.Map', {
	extend: 'Ext.form.FieldSet',
	alias: 'widget.todo-map',
	requires: [
		'Ext.Map'
	],

	config: {
        title: 'Location',
        layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'start'
        },
        items: [
        	{
        		xtype: 'hiddenfield',
        		name: 'latitude'
        	},
        	{
        		xtype: 'hiddenfield',
        		name: 'longitude'
        	},
            {
                xtype: 'container',
                layout: 'fit',
                html: 'No location selected'
            },
            {
                xtype: 'panel',
                layout: 'fit',
                height: 300,
                listeners: {
                    add: function(obj, item, index) {
                        var parent = obj.up('todo-map');
                        parent.onMapAdd(obj, item.getMap());
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Set',
                action: 'set'
            },
            {
                xtype: 'button',
                text: 'Clear',
                hidden: true,
                handler: function(button) {
                    var parent = button.up('todo-map');
                    parent.hideMap(parent, true);
                }
            }
        ]
	},

    onMapAdd: function(obj, map) {
        var mapPanel = obj.up('todo-map'),
            longitude = mapPanel.down('hiddenfield[name=longitude]').getValue(),
            latitude = mapPanel.down('hiddenfield[name=latitude]').getValue();
        
        // Resize the Google map
        google.maps.event.trigger(map, 'resize');

        if (map.mapRendered) {
            if (longitude && latitude) {
                mapPanel.hideMap(mapPanel, false);
                mapPanel.setMarker(mapPanel, latitude, longitude);
            } else {
              mapPanel.hideMap(mapPanel, true);
            }
        }
    },

	setMarker: function(me, latitude, longitude) {
		var map = me.down('map').getMap(),
            position;

		map.mapMarker.setPosition(new google.maps.LatLng(latitude, longitude));

		me.down('map').setMapOptions({
            center: map.mapMarker.getPosition(),
            draggable: false
        });
	},

    hideMap: function(me, hidden) {
        if (hidden) {
            me.down('hiddenfield[name=latitude]').setValue(null);
            me.down('hiddenfield[name=longitude]').setValue(null);
        }

        me.down('container').setHidden(!hidden);
        me.down('panel').setHidden(hidden);
        me.down('button[text=Set]').setHidden(!hidden);
        me.down('button[text=Clear]').setHidden(hidden);
    }
});
