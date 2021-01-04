Ext.define('TodoApp.controller.Main', {
	extend: 'Ext.app.Controller',
	config: {
		views: [
			'List',
			'New',
			'Edit',
			'Location',
			'TodoListItem'
		],
		models: [
			'Item'
		],
		stores: [
			'Item'
		],
		refs: {
			mainPanel: 'todo-main',
			listPanel: {
				selector: 'todo-list',
				xtype: 'todo-list',
				autoCreate: true
			},
			listDataView: 'todo-list dataview',
			newPanel: {
				selector: 'todo-new',
				xtype: 'todo-new',
				autoCreate: true
			},
			newForm: 'todo-new formpanel',
			editPanel: {
				selector: 'todo-edit',
				xtype: 'todo-edit',
				autoCreate: true
			},
			editForm: 'todo-edit formpanel',
			locationPanel: {
				selector: 'todo-location',
				xtype: 'todo-location',
				autoCreate: true
			}
		},
		control: {
			// HACK: Sencha says you shouldn’t define listeners in the config object, so don’t do this
			'todo-list button[action=new]': {
				tap: 'showNewView'
			},
			'todo-list button[action=edit]': {
				tap: 'editTodoItem'
			},
			'todo-list button[action=delete]': {
				tap: 'deleteTodoItem'
			},
			'todo-new button[action=create]': {
				tap: 'createTodoItem'
			},
			'todo-new button[action=back]': {
				tap: 'goBack'
			},
			'todo-edit button[action=save]': {
				tap: 'saveTodoItem'
			},
			'todo-edit button[action=back]': {
				tap: 'goBack'
			},
			'todo-map button[action=set]': {
				tap: 'showLocationView'
			},
			'todo-location button[action=back]': {
				tap: 'goBack'
			},
			'todo-location button[action=set]': {
				tap: 'setLocation'
			}
		}
	},
	createTodoItem: function(button, e, eOpts) {
		var store = Ext.getStore('Item');

		store.add(this.getNewForm().getValues())
		store.sync();
    	store.load();
		
		this.showListView();
	},
	editTodoItem: function(button, e, eOpts) {
		var store = this.getListDataView().getStore(),
			editPanel = this.getEditPanel(),
			editForm = this.getEditForm(),
			imagePanel = editForm.down('todo-image'),
			record = store.findRecord('id', button.getData()),
			mediaData = record.get('media');

		editForm.setRecord(record);

		// Show the associated image
		if (mediaData) {
			imagePanel.down('panel').setHtml('<img src="' + record.get('media') + '" alt="todo image" width="100%"/>');
			imagePanel.down('button[text=Select]').setHidden(true);
			imagePanel.down('button[text=Remove]').setHidden(false);
		} else {
			imagePanel.down('panel').setHtml('No image loaded');
			imagePanel.down('button[text=Select]').setHidden(false);
			imagePanel.down('button[text=Remove]').setHidden(true);
		}

		this.showEditView();
	},
	deleteTodoItem: function(button, e, eOpts) {
		var dataview = this.getListDataView(),
			store = dataview.getStore(),
			record = store.findRecord('id', button.getData()).erase();

		record.erase();
		store.load();
		dataview.refresh();
	},
	saveTodoItem: function(button, e, eOpts) {
		var store = Ext.getStore('Item'),
			values = this.getEditForm().getValues(),
			record = store.findRecord('id', values.id);

		record.setData(values);
		record.setDirty(); // Needed otherwise update record will not sync
		store.sync();

		this.showListView();
	},
	showView: function(view, index) {
		this.createMapResource();
		this.unloadMapResource();

		for (var i = this.getMainPanel().getItems().length - 1; i >= index; --i) {
			this.getMainPanel().remove(this.getMainPanel().getAt(i), false);
		}
		this.getMainPanel().add(view);
		this.getMainPanel().setActiveItem(index);
		this.getMainPanel().activeIndex = index;

		this.loadMapResource();
	},
	goBack: function() {
		this.unloadMapResource();

		if (this.getMainPanel().activeIndex > 0) {
			this.getMainPanel().activeIndex--;
		}
		this.getMainPanel().setActiveItem(this.getMainPanel().activeIndex);

		this.loadMapResource();
	},
	showNewView: function() {
		var newPanel = this.getNewPanel(),
			newForm = this.getNewForm();

		// Reset the new panel
		newForm.reset();
		newForm.down('todo-image').down('panel').setHtml('No image loaded');
		newForm.down('todo-image').down('button[text=Select]').setHidden(false);
		newForm.down('todo-image').down('button[text=Remove]').setHidden(true);

		this.showView(newPanel, 1);
	},
	showEditView: function() {
		this.showView(this.getEditPanel(), 1);
	},
	showListView: function() {
		this.showView(this.getListPanel(), 0);
	},
	showLocationView: function() {
		this.showView(this.getLocationPanel(), 2);
	},
	setLocation: function() {
		var panel = this.getLocationPanel(),
			position,
			map;

		position = panel.down('map').getMap().mapMarker.getPosition();
		this.goBack();

		panel = this.getMainPanel().getActiveItem().down('todo-map');
		panel.down('hiddenfield[name=latitude]').setValue(position.lat());
		panel.down('hiddenfield[name=longitude]').setValue(position.lng());
		panel.hideMap(panel, false);
    	panel.setMarker(panel, position.lat(), position.lng());
	},
	createMapResource: function() {
		var me = this;
		if (!this.mapResource) {
			this.mapResource = Ext.create('widget.map', {
	            xtype: 'map',
	            mapOptions: {
	                zoom: 15,
	                disableDefaultUI: true
	            },
	            listeners: {
	            	maprender: function(obj, map) {
				        var mapPanel = obj.up('todo-map') || obj.up('todo-location');

						map.mapMarker = new google.maps.Marker({
							map: map
						});

						// Trigger a resize when the bounds of the map change
						google.maps.event.addListener(map, 'bounds_changed', function() {
							var panel = obj.up('todo-map') || obj.up('todo-location');
							panel.onMapAdd(obj, map);
						});

				        if (!mapPanel.mapRendered) {
				            map.mapRendered = true;
				            mapPanel.onMapAdd(obj, map);
				        }
				    }
	            }
	        });
		}
	},
	unloadMapResource: function() {
		var map = this.getMainPanel().down('map');

		if (map) {
			map.up('panel').remove(this.mapResource, false);
		}
	},
	loadMapResource: function() {
		var map = this.getMainPanel().getActiveItem().down('todo-map') || this.getMainPanel().down('todo-location');

		if (map) {
			map.down('panel').add(this.mapResource);
		}
	}
});
