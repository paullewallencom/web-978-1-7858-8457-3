Ext.define('TodoApp.store.Collaborator', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Collaborator',
		autoSync: true,
		listeners: {
			addrecords: 'onAddRecords',
			removerecords: 'onRemoveRecords',
			updaterecord: 'onUpdateRecord'
		}
  	},
  	currentListStore: null,
  	currentListRecord: null,
  	onAddRecords: function(store, records) {
		if (store.currentListStore && store.currentListRecord) {
			var data = store.currentListRecord.getData(),
				toadd = [];
			if (!data.collaborators) {
				data.collaborators = [];
			}
			for (var i = 0; i < records.length; ++i) {
				if (data.collaborators.every(function(id) { return id != records[i].getData().id })) {
					toadd.push(records[i].getData().id);	
				}
				if (toadd.length > 0) {
					data.collaborators = data.collaborators.concat(toadd);
					store.currentListRecord.setData(data);
					store.currentListRecord.setDirty();
					store.currentListStore.sync();
				}
			}
		}
	},
	onRemoveRecords: function(store, records, indices) {
		if (store.currentListStore && store.currentListRecord) {
			var data = store.currentListRecord.getData();
			for (var i = 0; i < records.length; ++i) {
				data.collaborators = data.collaborators.filter(function(id) { return id != records[i].getData().id; });
			}
			store.currentListRecord.setData(data);
			store.currentListRecord.setDirty();
			store.currentListStore.sync();
		}
	},
	onUpdateRecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues) {
		if (modifiedFieldNames.length == 0) {
			// No changes, don’t bother updating the list
			return;
		}
		if (store.currentListStore && store.currentListRecord) {
			var data = store.currentListRecord.getData();
			data.collaborators = data.items.map(function(id) {
				if (id == record.getData().id) {
					return record.getData().id;
				} else {
					return id;	
				}
			});
			store.currentListRecord.setData(data);
			store.currentListRecord.setDirty();
			store.currentListStore.sync();
		}
	}
});