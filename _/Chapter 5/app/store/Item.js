Ext.define('TodoApp.store.Item', {
 	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Item',
		autoSync: true,
		listeners: {
			load: 'onLoad',
			addrecords: 'onAddRecords',
			removerecords: 'onRemoveRecords',
			updaterecord: 'onUpdateRecord'
		}
  	},
  	remoteMetaDB: null,
  	remoteTextDB: null,
  	remoteMapsDB: null,
  	remoteImagesDB: null,
  	localMetaDB: null,
  	localTextDB: null,
  	localMapsDB: null,
  	localImagesDB: null,
  	username: 'nobody',
  	password: null,
  	currentListId: null,
  	doWithDocs: function(store, func) {
  		var me = this;

  		store.allDocs({
					include_docs: true,
					attachments: true,
					startKey: me.currentListId + "_",
					endKey: me.currentListId + "_\uffff"
				}, function (error, result) {
					func(store, result.rows.map(function(e) {
						return e.doc;
					}));
				});
  	},
  	onLoad: function(store, records, successful, operation) {
  		var me = this;
  		var updateImages = function(docsArray) {
  			me.doWithDocs(store.localImagesDB, function(pouchdb, docs) {
				for (var i = 0; i < docs.length; ++i) {
					docsArray = docsArray.map(function(e) {
						if (e._id == docs[i]._id) {
							e.media = docs[i].media
						}
						return e;
					});
	  			}
	  			store.setData(docsArray);
  			});
  		};
  		var updateMaps = function(docsArray) {
  			me.doWithDocs(store.localMapsDB, function(pouchdb, docs) {
  				for (var i = 0; i < docs.length; ++i) {
					docsArray = docsArray.map(function(e) {
						if (e._id == docs[i]._id) {
							e.latitude = docs[i].latitude;
							e.longitude = docs[i].longitude;
						}
						return e;
					});
  				}
  				updateImages(docsArray);
  			});
  		};
		var setData = function(pouchdb, docs) {
			var docstoadd = [];
			for (var i = 0; i < records.length; ++i) {
				var data = records[i].getData();
				if (docs.every(function(l) { return l._id != data._id })) {
					var model = new TodoApp.model.Item({
						_id: data._id.replace(/.*_/, me.currentListId + "_"),
						list: store.currentListId,
						description: data.description,
						media: data.media,
						latitude: data.latitude,
						longitude: data.longitude
					});
					docstoadd.push(model);
				}
			}
			if (docstoadd.length > 0) {
				docs = docs.concat(docstoadd);
			}
			updateMaps(docs);
		};
		me.doWithDocs(store.localTextDB, setData);
	},
	onAddRecords: function(store, records) {
		var me = this;

		var addText = function(pouchdb, lists) {
			var toadd = [];
			for (var i = 0; i < records.length; ++i) {
				var data = records[i].getData();
				if (data.description && lists.every(function(l) { return l._id != data._id })) {
					toadd.push({
						'_id': data._id,
						'list': me.currentListId,
						'description': data.description
					});
				}
			}
			if (toadd.length > 0) {
				lists = lists.concat(toadd);
				pouchdb.bulkDocs(toadd, function() {
					me.flagStoreForSync('text');
				});
			}
		};
		var addMaps = function(pouchdb, lists) {
			var toadd = [];
			for (var i = 0; i < records.length; ++i) {
				var data = records[i].getData();
				if (data.latitude && data.longitude && lists.every(function(l) { return l._id != data._id })) {
					toadd.push({
						'_id': data._id,
						'list': me.currentListId,
						'latitude': data.latitude,
						'longitude': data.longitude
					});
				}
			}
			if (toadd.length > 0) {
				lists = lists.concat(toadd);
				pouchdb.bulkDocs(toadd, function() {
					me.flagStoreForSync('maps');
				});
			}
		};
		var addImages = function(pouchdb, lists) {
			var toadd = [];
			for (var i = 0; i < records.length; ++i) {
				var data = records[i].getData();
				if (data.media && data.media !== "" && lists.every(function(l) { return l._id != data._id })) {
					toadd.push({
						'_id': data._id,
						'list': me.currentListId,
						'media': data.media
					});
				}
			}
			if (toadd.length > 0) {
				lists = lists.concat(toadd);
				pouchdb.bulkDocs(toadd, function() {
					me.flagStoreForSync('images');
				});
			}
		};

		this.doWithDocs(store.localTextDB, addText);
		this.doWithDocs(store.localMapsDB, addMaps);
		this.doWithDocs(store.localImagesDB, addImages);
	},
	onRemoveRecords: function(store, records, indices) {
		var me = this;
		var func = function(pouchdb, lists) {
			for (var i = 0; i < records.length; ++i) {
				lists = lists.filter(function(e) { return e._id == records[i].getData()._id; });
			}
			for (var i = 0; i < lists.length; ++i) {
				lists[i]._deleted = true;
			}
			if (lists.length > 0) {
				pouchdb.bulkDocs(lists, function() {
					if (pouchdb === store.localTextDB) {
						me.flagStoreForSync('text');
					} else if (pouchdb === store.localMapsDB) {
						me.flagStoreForSync('maps');
					} else if (pouchdb === store.localImagesDB) {
						me.flagStoreForSync('images');
					}
				});
			}
		};

		me.doWithDocs(store.localTextDB, func);
		me.doWithDocs(store.localMapsDB, func);
		me.doWithDocs(store.localImagesDB, func);
	},
	onUpdateRecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues) {
		var me = this;
		if (modifiedFieldNames.length == 0) {
			// No changes, don’t bother updating the list
			return;
		}
		var data = record.getData();
		if (modifiedValues['description']) {
			store.localTextDB.get(data['_id'], function(error, doc) {
				if (!doc) {
					doc = {
						'_id': data['_id'],
						'list': me.currentListId
					}
				}
				if (doc.description != data.description) {
					doc.description = data.description;
					store.localTextDB.put(doc, function() {
						store.flagStoreForSync('text');
					});
				}
			});
		}
		if (modifiedValues['media'] !== null) {
			store.localImagesDB.get(data['_id'], function(error, doc) {
				if (!doc) {
					doc = {
						'_id': data['_id'],
						'list': me.currentListId
					}
				}
				if (!doc.media) {
					doc.media = "";
				}
				if (doc.media != data.media) {
					doc.media = data.media;
					store.localImagesDB.put(doc, function() {
						store.flagStoreForSync('images');
					});
				}
			});
		}
		store.localMapsDB.get(data['_id'], function(error, doc) {
			if (!doc) {
				doc = {
					'_id': data['_id'],
					'list': me.currentListId
				}
			}
			if (doc.latitude != data.latitude || doc.longitude != data.longitude) {
				doc.latitude = data.latitude;
				doc.longitude = data.longitude;
				store.localMapsDB.put(doc, function() {
					store.flagStoreForSync('maps');
				});
			}
		});
	},
	flagStoreForSync: function(store) {
		var me = this;
		me.localMetaDB.get(store, function(error, doc) {
			if (!doc) {
				me.localMetaDB.put({
					'_id': store
				});
			} else {
				me.localMetaDB.put(doc);
			}
		});
	}
});