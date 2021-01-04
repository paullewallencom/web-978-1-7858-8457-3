Ext.define('TodoApp.store.List', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.List',
		autoSync: true,
		listeners: {
			load: 'onLoad',
			addrecords: 'onAddRecords',
			removerecords: 'onRemoveRecords',
			updaterecord: 'onUpdateRecord'
		}
  	},
  	remoteDB: null,
  	localDB: null,
  	localMetaDB: null,
  	username: 'nobody',
  	currentListId: null,
  	doWithDoc: function(func) {
  		var me = this;

  		me.localDB.get(me.currentListId, function (error, doc) {
			if (error) {
				// Document doesn’t exist yet. Create it.
				me.localDB.put({
					'_id': me.currentListId,
					'name': 'list',
					'owner': me.username,
					'items': []
				}).then(function() {
					me.localDB.get(me.currentListId, function (error, doc) {
						func(doc);
					});
				});
			} else {
				func(doc);
			}
		});
  	},
  	doWithDocs: function(func) {
  		var me = this;
  		
  		me.localDB.allDocs({
					include_docs: true,
					attachments: true,
					startkey: '_design/\uffff',
				}, function (error, result) {
					func(result.rows.map(function(e) {
						return e.doc;
					}));
				});
  	},
  	onLoad: function(store, records, successful, operation) {
  		var me = this;
		me.doWithDocs(function(lists) {
			var liststoadd = [];
			for (var i = 0; i < records.length; ++i) {
				var data = records[i].getData();
				if (lists.every(function(l) { return l._id != data._id })) {
					var model = new TodoApp.model.List({
						_id: data._id.replace(/.*_/, store.username + "_"),
						name: data.name,
						owner: store.username,
						items: data.items
					});
					liststoadd.push(model);
				}
			}
			if (liststoadd.length > 0) {
				lists = lists.concat(liststoadd);
			}
			store.setData(lists);
		});
		me.filter([
			{
				filterFn: function(e) {
					if (e.get('owner') == me.username) {
						return true;
					}
					if (!e.get('collaborators')) {
						return false;
					}
					return e.get('collaborators').some(
						function(c) {
							return c == me.username;
						}
					);
				}
			}
		]);
	},
	onAddRecords: function(store, records) {
		var me = this;
		me.doWithDocs(function(lists) {
			var toadd = [];
			for (var i = 0; i < records.length; ++i) {
				if (lists.every(function(l) { return l._id != records[i].getData()._id })) {
					toadd.push(records[i].getData());
				}
			}
			if (toadd.length > 0) {
				lists = lists.concat(toadd);
				store.localDB.bulkDocs(toadd, function() {
					me.flagStoreForSync();
				});
			}
		});
	},
	onRemoveRecords: function(store, records, indices) {
		var me = this;
		me.doWithDocs(function(lists) {
			for (var i = 0; i < records.length; ++i) {
				lists = lists.filter(function(e) { return e._id == records[i].getData()._id; });
			}
			for (var i = 0; i < lists.length; ++i) {
				lists[i]._deleted = true;
			}
			if (lists.length > 0) {
				store.localDB.bulkDocs(lists, function() {
					me.flagStoreForSync();
				});
			}
		});
	},
	onUpdateRecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues) {
		var me = this;
		if (modifiedFieldNames.length == 0) {
			// No changes, don’t bother updating the list
			return;
		}
		me.doWithDoc(function(doc) {
			var newDoc = record.getData();
			newDoc._rev = doc._rev;
			store.localDB.put(newDoc, function() {
				me.flagStoreForSync();
			});
		});
	},
	flagStoreForSync: function() {
		var me = this;
		me.localMetaDB.get('lists', function(error, doc) {
			if (!doc) {
				me.localMetaDB.put({
					'_id': 'lists'
				});
			} else {
				me.localMetaDB.put(doc);
			}
		});
	}
});
