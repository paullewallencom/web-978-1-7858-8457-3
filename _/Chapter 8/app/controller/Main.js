Ext.define('TodoApp.controller.Main', {
	extend: 'Ext.app.Controller',
	config: {
		views: [
			'TodoApp.view.SignIn',
			'TodoApp.view.list.Lists',
			'TodoApp.view.list.New',
			'TodoApp.view.list.DataItem',
			'TodoApp.view.list.List',
			'TodoApp.view.item.New',
			'TodoApp.view.item.Edit',
			'TodoApp.view.item.Location',
			'TodoApp.view.item.DataItem',
			'TodoApp.view.collaborator.List',
			'TodoApp.view.collaborator.New',
			'TodoApp.view.collaborator.DataItem'
		],
		models: [
			'User',
			'List',
			'Collaborator',
			'Position',
			'Restore'
		],
		stores: [
			'User',
			'List',
			'Collaborator',
			'Position',
			'Restore'
		],
		refs: {
			main: 'todo-main',
			mainPanel: '#todo-main-panel',
			listsPanel: {
				selector: 'todo-lists',
				xtype: 'todo-lists',
				autoCreate: true
			},
			listsDataView: 'todo-lists dataview',
			newListPanel: {
				selector: 'todo-list-new',
				xtype: 'todo-list-new',
				autoCreate: true
			},
			newListForm: 'todo-list-new formpanel',
			listPanel: {
				selector: 'todo-list',
				xtype: 'todo-list',
				autoCreate: true
			},
			listDataView: 'todo-list dataview',
			collaboratorsPanel: {
				selector: 'todo-collaborator-list',
				xtype: 'todo-collaborator-list',
				autoCreate: true
			},
			collaboratorsDataView: 'todo-collaborator-list dataview',
			newCollaboratorPanel: {
				selector: 'todo-collaborator-new',
				xtype: 'todo-collaborator-new',
				autoCreate: true
			},
			newCollaboratorForm: 'todo-collaborator-new formpanel',
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
			},
			signInPanel: {
				selector: 'todo-sign-in',
				xtype: 'todo-sign-in',
				autoCreate: true
			},
			signInForm: 'todo-sign-in formpanel'
		},
		control: {
			// HACK: Sencha says you shouldn’t define listeners in the config object, so don’t do this
			'todo-lists button[action=signin]': {
				tap: 'showSignInView'
			},
			'todo-lists button[action=new]': {
				tap: 'showNewListView'
			},
			'todo-lists button[action=share]': {
				tap: 'shareList',
			},
			'todo-lists button[action=edit]': {
				tap: 'onEditListClick'
			},
			'todo-lists button[action=delete]': {
				tap: 'deleteList'
			},
			'todo-list-new button[action=back]': {
				tap: 'showListsView'
			},
			'todo-list-new button[action=create]': {
				tap: 'createList',
			},
			'todo-list button[action=back]': {
				tap: 'goBack'
			},
			'todo-list button[action=new]': {
				tap: 'showNewView'
			},
			'todo-list button[action=edit]': {
				tap: 'onEditTodoItemClick'
			},
			'todo-list button[action=delete]': {
				tap: 'deleteTodoItem'
			},
			'todo-collaborator-list button[action=back]': {
				tap: 'goBack'
			},
			'todo-collaborator-list button[action=add]': {
				tap: 'showNewCollaboratorView'
			},
			'todo-collaborator-list button[action=delete]': {
				tap: 'deleteCollaborator'
			},
			'todo-collaborator-new button[action=back]': {
				tap: 'goback'
			},
			'todo-collaborator-new button[action=share]': {
				tap: 'createCollaborator'
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
			},
			'todo-sign-in button[action=back]': {
				tap: 'goBack'
			}
		}
	},
	createTodoItem: function(button, e, eOpts) {
		var store = Ext.getStore('Item');

		var model = new TodoApp.model.Item(this.getNewForm().getValues());
		model.setId(store.currentListId + '_' + model.getId());
		store.add(model);
		
		this.showListView();
	},
	createCollaborator: function(button, e, eOpts) {
		var store = Ext.getStore('Collaborator');

		store.add(this.getNewCollaboratorForm().getValues());

		this.showCollaboratorsView();
	},
	createList: function(button, e, eOpts) {
		var store = Ext.getStore('List');

		var model = new TodoApp.model.List(this.getNewListForm().getValues());
		model.setId(store.username + '_' + model.getId());
		model.set('owner', store.username);
		store.add(model);

		this.showListsView();
	},
	onEditTodoItemClick: function(button, e, eOpts) {
		this.editTodoItem(button.getData());
	},
	editTodoItem: function(itemId) {
		var store = this.getListDataView().getStore(),
			pouchdb = store.localTextDB,
			editPanel = this.getEditPanel(),
			editForm = this.getEditForm(),
			textPanel = editForm.down('fieldset'),
			conflictPanel = textPanel.down('todo-conflict'),
			imagePanel = editForm.down('todo-image'),
			record = store.findRecord('_id', itemId),
			mediaData = record.get('media'),
			textConflicts = record.get('textconflicts'),
			mapsConflicts = record.get('mapsconflicts'),
			imagesConflicts = record.get('imagesconflicts');

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

		// Show conflicts
		if (textConflicts) {
			conflictPanel.removeAll();
			store.getAllConflicts(store, pouchdb, itemId, textConflicts.concat(record.get('textrev')), [], function(docs) {
				Ext.each(docs, function(d) {
					conflictPanel.add({
						xtype: 'button',
						action: 'accept',
						text: d.description,
						data: d._rev
					});
				});
				conflictPanel.setHidden(false);
				textPanel.down('textfield[name=description]').setHidden(true);
				textPanel.setTitle('Description (resolve conflict)');
			});
		} else {
			conflictPanel.setHidden(true);
			textPanel.down('textfield[name=description]').setHidden(false);
			textPanel.setTitle('Description');
		}

		this.saveView(store.currentListId, itemId);
		this.showEditView();
	},
	onEditListClick: function(button, e, eOpts) {
		this.editList(button.getData());
	},
	editList: function(listId) {
		var listStore = Ext.getStore('List'),
			record = listStore.findRecord('_id', listId),
			items = record.getData().items,
			listPanel = this.getListPanel(),
			listDataView = this.getListDataView(),
			itemStore = Ext.getStore('Item');

		listStore.currentListId = listId;
		itemStore.currentListId = listId;
		itemStore.filter([
			{
				filterFn: function(e) {
					return e.get('list') == itemStore.currentListId;
				}
			}
		]);

		listPanel.down('titlebar').setTitle(record.get('name'));
		this.showListView();
	},
	shareList: function(button, e, eOpts) {
		var listStore = Ext.getStore('List'),
			record = listStore.findRecord('_id', button.getData()),
			collaborators = record.getData().collaborators,
			collaboratorsPanel = this.getCollaboratorsPanel(),
			collaboratorsDataView = this.getCollaboratorsDataView(),
			collaboratorStore = Ext.getStore('Collaborator');

		listStore.currentListId = button.getData();
		collaboratorStore.currentListStore = listStore;
		collaboratorStore.currentListRecord = record;
		collaboratorStore.removeAll();
		if (collaborators) {
			collaboratorStore.add(collaborators.map(
				function(c) {
					return {id: c}
				}
			));
		}

		this.showCollaboratorsView();
	},
	deleteTodoItem: function(button, e, eOpts) {
		var dataview = this.getListDataView(),
			store = dataview.getStore(),
			record = store.findRecord('_id', button.getData()).erase();

		store.remove(record);
	},
	deleteCollaborator: function(button, e, eOpts) {
		var dataview = this.getCollaboratorsDataView(),
			store = dataview.getStore(),
			record = store.findRecord('id', button.getData()).erase();

		store.remove(record);
	},
	deleteList: function(button, e, eOpts) {
		var dataview = this.getListsDataView(),
			store = dataview.getStore(),
			record = store.findRecord('_id', button.getData()).erase();

		store.remove(record);
	},
	saveTodoItem: function(button, e, eOpts) {
		var store = Ext.getStore('Item'),
			values = this.getEditForm().getValues(),
			record = store.findRecord('_id', values._id);

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

		var xtype = this.getMainPanel().getActiveItem().xtype;
		if (xtype === 'todo-list') {
			this.saveView(Ext.getStore('List').currentListId, null);
		}
		else if (xtype === 'todo-lists') {
			this.saveView(null, null);
		}

		this.loadMapResource();
	},
	goBack: function() {
		this.unloadMapResource();

		if (this.getMainPanel().activeIndex > 0) {
			this.getMainPanel().activeIndex--;
		}
		this.getMainPanel().setActiveItem(this.getMainPanel().activeIndex);

		var xtype = this.getMainPanel().getActiveItem().xtype;
		if (xtype === 'todo-list') {
			this.saveView(Ext.getStore('List').currentListId, null);
		}
		else if (xtype === 'todo-lists') {
			this.saveView(null, null);
		}

		this.loadMapResource();
	},
	saveView: function(currentListId, currentItemId) {
		var store = Ext.getStore('Restore');

		store.removeAll();
		store.add({
			'currentListId': currentListId,
			'currentItemId': currentItemId
		});
	},
	showListsView: function() {
		this.showView(this.getListsPanel(), 0);
	},
	showCollaboratorsView: function() {
		this.showView(this.getCollaboratorsPanel(), 1);
	},
	showNewListView: function() {
		var newListPanel = this.getNewListPanel(),
			newListForm = this.getNewListForm();

		// Reset the new panel
		newListForm.reset();

		this.showView(newListPanel, 1);
	},
	showNewCollaboratorView: function() {
		this.showView(this.getNewCollaboratorPanel(), 2);
	},
	showNewView: function() {
		var newPanel = this.getNewPanel(),
			newForm = this.getNewForm();

		// Reset the new panel
		newForm.reset();
		newForm.down('hiddenfield[name=list]').setValue(Ext.getStore('List').currentListId);
		newForm.down('todo-image').down('panel').setHtml('No image loaded');
		newForm.down('todo-image').down('button[text=Select]').setHidden(false);
		newForm.down('todo-image').down('button[text=Remove]').setHidden(true);

		this.showView(newPanel, 2);
	},
	showSignInView: function() {
		this.showView(this.getSignInPanel(), 1);
	},
	showEditView: function() {
		this.showView(this.getEditPanel(), 2);
	},
	showListView: function() {
		this.showView(this.getListPanel(), 1);
	},
	showLocationView: function() {
		this.showView(this.getLocationPanel(), 3);
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
