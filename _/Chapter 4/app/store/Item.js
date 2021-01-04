Ext.define('TodoApp.store.Item', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Item',
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
			if (!data.items) {
				data.items = [];
			}
			for (var i = 0; i < records.length; ++i) {
				if (data.items.every(function(e) { return e.id != records[i].getData().id })) {
					toadd.push(records[i].getData());	
				}
				if (toadd.length > 0) {
					data.items = data.items.concat(toadd);
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
				data.items = data.items.filter(function(e) { return e.id != records[i].getData().id; });
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
			data.items = data.items.map(function(e) {
				if (e.id == record.getData().id) {
					return record.getData();
				} else {
					return e;	
				}
			});
			store.currentListRecord.setData(data);
			store.currentListRecord.setDirty();
			store.currentListStore.sync();
		}
	}
});
