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
					startKey: me.currentListId + "_",
					endKey: me.currentListId + "_\uffff",
					conflicts: true
				}, function (error, result) {
					func(store, result.rows.map(function(e) {
						return e.doc;
					}));
				});
  	},
  	setDataIfNeeded: function(store, docs, flag) {
  		var sortFn = function(a, b) {
  			return a._id > b._id ? 1 : a._id == b._id ? 0 : -1;
  		};
  		var records = store.getData().all.map(
  			function(r) {
  				return r.getData();
  			}
		).sort(sortFn);
		docs = docs.filter(function(n) {
			for (var i = 0; i < records.length; ++i) {
				if (n._id == records[i]._id) {
					return true;
				}
			}
			return !!n[flag + 'rev'];
		}).sort(sortFn);

  		if (records.length !== docs.length) {
  			store.setData(docs);
  			return;
  		}

  		for (var i = 0; i < records.length; ++i) {
  			if (records[i]._id != docs[i]._id || records[i]._rev != docs[i]._rev) {
  				store.setData(docs);
  				return;
  			}
  		}
  	},
  	loadDocsAttributes: function(me, store, docsArray, attributes, flag, callback) {
		me.doWithDocs(store, function(pouchdb, docs) {
			for (var i = 0; i < docs.length; ++i) {
				var indexOf = -1;
				for (var j = 0; j < docsArray.length; ++j) {
					if (docsArray[j]._id == docs[i]._id) {
						indexOf = j;
						break;
					}
				}
				if (indexOf === -1) {
					var obj = Ext.clone(docs[i]);
					obj[flag + 'rev'] = obj['_rev'];
					obj['_rev'] = undefined;
					if (obj['_conflicts'].length) {
						obj[flag + 'conflicts'] = docs[i]['_conflicts'];
					}
					docsArray.push(obj);
				} else {
					if (docs[i]._conflicts.length) {
						docsArray[indexOf][flag + 'conflicts'] = docs[i]['_conflicts'];
					}
					docsArray[indexOf][flag + 'rev'] = docs[i]['_rev'];
					Ext.each(attributes, function(attr) {
						docsArray[indexOf][attr] = docs[i][attr];
					});
				}
  			}
  			callback(docsArray);
		});
  	},
  	onLoad: function(store, records, successful, operation) {
  		var me = this;
  		var updateImages = function(docsArray) {
  			me.loadDocsAttributes(me, store.localImagesDB, docsArray, ['media'], 'images', function(docs) {
  				me.setDataIfNeeded(store, docs, 'images');
  			});
  		};
  		var updateMaps = function(docsArray) {
  			me.loadDocsAttributes(me, store.localMapsDB, docsArray, ['latitude', 'longitude'], 'maps', function(docs) {
  				me.setDataIfNeeded(store, docs, 'maps');
  				updateImages(docs);
  			});
  		};
		var updateText = function(docsArray) {
			me.loadDocsAttributes(me, store.localTextDB, docsArray, ['description'], 'text', function(docs) {
				me.setDataIfNeeded(store, docs, 'text');
				updateMaps(docs);
			});
		};
		updateText(records.map(
			function(r) {
				return r.getData();
			})
		);
	},
  	addDocsAttributes: function(me, store, docsArray, attributes, flag, callback) {
		me.doWithDocs(store, function(pouchdb, docs) {
			var toadd = [];
	  		for (var i = 0; i < docsArray.length; ++i) {
	  			var exists = docs.some(function(d) { return d._id == docsArray[i]._id; });
	  			if (!exists) {
	  				var obj = {
	  					'_id': docsArray[i]._id,
	  					'list': me.currentListId
	  				};
	  				var change = false;
	  				Ext.each(attributes, function(attr) {
	  					if (docsArray[i][attr]) {
	  						obj[attr] = docsArray[i][attr];
	  						change = true;
	  					}
	  				});
	  				if (change) {
	  					toadd.push(obj);
	  				}
	  			}
	  		}
	  		if (toadd.length > 0) {
	  			store.bulkDocs(toadd, function() {
	  				me.flagStoreForSync(flag);
	  				callback(docsArray);
	  			})
	  		} else {
	  			callback(docsArray);
	  		}
		});
  	},
	onAddRecords: function(store, records) {
		var me = this;

		var addImages = function(docsArray) {
			me.addDocsAttributes(me, store.localImagesDB, docsArray, ['media'], 'images', Ext.emptyFn);
		};
		var addMaps = function(docsArray) {
			me.addDocsAttributes(me, store.localMapsDB, docsArray, ['latitude', 'longitude'], 'maps', function(docs) {
				addImages(docs);
			});
		};
		var addText = function(docsArray) {
			me.addDocsAttributes(me, store.localTextDB, docsArray, ['description'], 'text', function(docs) {
				addMaps(docs);
			});
		};
		addText(records.map(
			function(r) {
				return r.getData();
			})
		);
	},
  	removeDocsAttributes: function(me, store, docsArray, flag, callback) {
		me.doWithDocs(store, function(pouchdb, docs) {
			docs = docs.filter(
				function(e) {
					return docsArray.some(
						function(r) {
							return r._id == e._id;
						}
					);
				}
			);
			for (var i = 0; i < docs.length; ++i) {
				docs[i]._deleted = true;
			}
			if (docs.length > 0) {
				pouchdb.bulkDocs(docs, function() {
						me.flagStoreForSync(flag);
						callback(docsArray);
				});
			} else {
				callback(docsArray);
			}
		});
	},
	onRemoveRecords: function(store, records, indices) {
		var me = this;

		var removeImages = function(docsArray) {
			me.removeDocsAttributes(me, store.localImagesDB, docsArray, 'images', Ext.emptyFn);
		};
		var removeMaps = function(docsArray) {
			me.removeDocsAttributes(me, store.localMapsDB, docsArray, 'maps', function(docs) {
				removeImages(docs);
			});
		};
		var removeText = function(docsArray) {
			me.removeDocsAttributes(me, store.localTextDB, docsArray, 'text', function(docs) {
				removeMaps(docs);
			})
		};
		removeText(records.map(
			function(r) {
				return r.getData();
			})
		);
	},
  	updateDocsAttributes: function(me, store, data, attributes, flag, callback) {
		store.get(data['_id'], function(error, doc) {
			if (!doc) {
				doc = {
					'_id': data['_id'],
					'list': me.currentListId
				}
			}
			var changes = attributes.some(
				function(attr) {
					if (!doc[attr] && !data[attr]) {
						return false;
					}
					return doc[attr] != data[attr];
				}
			);

			if (changes) {
				doc['_rev'] = data[flag + 'rev'];
				Ext.each(attributes, function(attr) {
					doc[attr] = data[attr];
				});
				store.put(doc, function(error, response) {
					me.flagStoreForSync(flag);
					callback(data);
				});
			} else {
				callback(data);
			}
		});
	},
	onUpdateRecord: function(store, record, newIndex, oldIndex, modifiedFieldNames, modifiedValues) {
		var me = this;

		var updateImages = function(data) {
			if (modifiedValues['media'] !== null) {
				me.updateDocsAttributes(me, store.localImagesDB, data, ['media'], 'images', function(doc) {
					me.load();
				});
			}
		};
		var updateMaps = function(data) {
			me.updateDocsAttributes(me, store.localMapsDB, data, ['latitude', 'longitude'], 'maps', function(doc) {
				updateImages(doc);
			});
		};
		var updateText = function(data) {
			if (modifiedValues['description']) {
				me.updateDocsAttributes(me, store.localTextDB, data, ['description'], 'text', function(doc) {
					updateMaps(doc);
				});
			} else {
				updateMaps(data);
			}
		}
		updateText(record.getData());
	},
	flagStoreForSync: function(store) {
		var me = this;
		me.localMetaDB.get(store + '_' + me.username, function(error, doc) {
			if (!doc) {
				me.localMetaDB.put({
					'_id': store + '_' + me.username
				});
			} else {
				me.localMetaDB.put(doc);
			}
		});
	},
	getAllConflicts: function(me, store, id, revs, docs, callback) {
		if (!revs.length) {
			callback(docs);
			return;
		}
		store.get(id, { rev: revs.shift() }, function(error, doc) {
			docs.push(doc);
			me.getAllConflicts(me, store, id, revs, docs, callback);
		});
	},
	resolveConflicts: function(me, store, id, revs, callback) {
		store.remove(id, revs.shift(), function(error, doc) {
			if (!revs.length) {
				store.get(id, function(error, doc) {
					callback(doc);
				});
				return;
			}
			me.resolveConflicts(me, store, id, revs, callback);
		});
	}
});