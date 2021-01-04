Ext.define('TodoApp.controller.Sync', {
	extend: 'Ext.app.Controller',
	config: {
		views: [
			'TodoApp.view.SignIn'
		],
		models: [
			'Item',
			'List',
			'User',
			'Position'
		],
		stores: [
			'Item',
			'List',
			'User',
			'Position'
		],
		refs: {
			main: 'todo-main',
			listsPanel: {
				selector: 'todo-lists',
				xtype: 'todo-lists',
				autoCreate: true
			},	
			signInForm: 'todo-sign-in formpanel'
		},
		control: {
			'todo-lists button[action=signout]': {
				tap: 'signOut'
			},
			'todo-sign-in button[action=submit]': {
				tap: 'signIn'
			},
			'todo-edit button[action=accept]': {
				tap: 'acceptChange'
			}
		}
	},
	geo: null,
	metaSyncHandler: null,
	init: function() {
		var me = this,
			listStore = Ext.getStore('List'),
			itemStore = Ext.getStore('Item'),
			record = Ext.getStore('User').first(),
			options = { auto_compaction: true },
			data;

		listStore.localDB = new PouchDB('lists', options);
		listStore.localMetaDB = itemStore.localMetaDB = new PouchDB('metadata', options);
		itemStore.localTextDB = new PouchDB('text', options);
		itemStore.localMapsDB = new PouchDB('maps', options);
		itemStore.localImagesDB = new PouchDB('images', options);

		if (record) {
			data = record.getData();
			listStore.username = data.username;
			itemStore.username = data.username;
			me.connect(data.username, data.password);
		}

		me.predictBandwidth();

		me.checkForTurbulence();
	},
	acceptChange: function(button) {
		var store = Ext.getStore('Item'),
			pouchdb = store.localTextDB,
			fieldset = button.up('fieldset'),
			text = fieldset.down('textfield[name=description]'),
			rev = fieldset.down('hiddenfield[name=textrev]'),
			conflicts = fieldset.down('hiddenfield[name=textconflicts]'),
			values = button.up('formpanel').getValues(),
			record = store.findRecord('_id', values._id),
			toremove;

		toremove = record.get('textconflicts').concat(record.get('textrev')).filter(function(r) {
			return r != button.getData();
		});

		store.resolveConflicts(store, pouchdb, values._id, toremove, function(doc) {
			fieldset.down('todo-conflict').setHidden(true);
			fieldset.setTitle('Description');
			text.setHidden(false);

			text.setValue(doc.description);
			rev.setValue(doc._rev);
			conflicts.setValue(undefined);

			record.set('description', doc.description);
			record.set('textrev', doc._rev);
			record.set('textconflicts', undefined);
			record.setDirty();
			store.sync();

			Ext.getStore('Item').flagStoreForSync('text');
		});
	},
	predictBandwidth: function() {
		var me = this;
		me.geo = Ext.create('Ext.util.Geolocation', {
			listeners: {
				locationupdate: function(geo) {
					//console.log("Update location");

					// Is the current positioning information accurate enough?
					if (!geo._accuracy || geo._accuracy > 50)
						return;
					
					// Are there any points in the database?
					var store = Ext.getStore('Position');
					//console.log(store.getCount() + " points in database");
					if (!store.getCount()) {
						store.add({
							latitude: geo._latitude,
							longitude: geo._longitude,
							offline: me.offline
						});
						return;
					}

					// Is the current location more than 10 meters away from the closest location? Save it.
					var records = store.getData().all,
						closest = null,
						closestDistance = null;
					records.forEach(function(e) {
						var distance = Math.sqrt(Math.pow((e.data.latitude - geo._latitude), 2) + Math.pow((e.data.longitude - geo._longitude), 2));
						if (!closest || distance < closestDistance) {
							closest = e.data;
							closestDistance = distance;
							return;
						}
					});
					//console.log(closestDistance);
					if (closestDistance > 10) {
						store.add({
							latitude: geo._longitude,
							longitude: geo._latitude,
							offline: me.offline
						});
					}

					// Is the current location less than 10 meters away from the closest location? Update it.
					if (closestDistance < 10 && closest.online != me.online) {
						var record = store.findRecord('id', closest.id);
						record.set('online', me.online);
						store.sync();
					}

					// Is the current speed significant enough?
					if (!geo._speed || geo._speed < 1)
						return;

					// Determine where user will be in 10 seconds
					var R = 6367444.7, // Earth's radius in meters
						distance = geo._speed * 10, // Current velocity times 10 (seconds)
						dx = distance * (Math.sin(geo._heading * Math.PI / 180)),
						dy = distance * (-Math.cos(geo._heading * Math.PI / 180)),
						dlng = dx / (R * Math.cos(geo._latitude)),
						dlat = dy / R
						newLng = geo._longitude + dlng,
						newLat = geo._latitude + dlat;

					// What is the closest point to that location? (nearest neighbor search)
					closest = null;
					closestDistance = null;
					records.forEach(function(e) {
						var distance = Math.sqrt(Math.pow((e.data.latitude - newLat), 2) + Math.pow((e.data.longitude - newLng), 2));
						if (!closest || distance < closestDistance) {
							closest = e.data;
							closestDistance = distance;
							return;
						}
					});

					// Was the closest point offline? Post a warning…
					if (!closest.online) {
						this.setIndicator("Going offline soon. :-/");
					}
				}
			}
		});
	},
	oneTimeMessage: false,
	checkForTurbulence: function() {
		var me = this;

		return setInterval(function() {
			// Are we online and syncing?
			if (!me.online || !me.syncStarted || me.message.indexOf('offline soon') !== -1)
				return;

			// Have we been attempting to synchronize for at least 30 minutes?
			var duration = (new Date()).getTime() - me.syncStarted;
			if (duration > 30 * 60 * 1000 && me.oneTimeMessage === false) {
				Ext.Msg.show({
					title: "Fasten your seatbelt",
					message: "We've been trying to sync for 30 minutes, but no dice. Your data is safe, but you'll want to connect to better Internet eventually.",
					buttons: Ext.MessageBox.OK
				});
				me.oneTimeMessage = true;
			}
			// 10 minutes?
			else if (duration > 10 * 60 * 1000) {
				me.setIndicator("Are you on GPRS?");
			}
			// 1 minute?
			else if (duration > 60 * 1000) {
				me.setIndicator("Find faster Internet?");
			}
			// 30 seconds?
			else if (duration > 30 * 1000) {
				me.setIndicator("Still working…");
			}
			// 10 seconds?
			else if (duration > 10 * 1000) {
				me.setIndicator("Taking a bit longer…");
			}
		}, 1000);
	},
	signIn: function() {
		var values = this.getSignInForm().getValues();
		this.getSignInForm().down('passwordfield').reset();
		this.connect(values.username, values.password);
		this.getApplication().getController('Main').showListsView();
	},
	signOut: function() {
		this.disconnect();
	},
	connect: function(username, password) {
		var listStore = Ext.getStore('List'),
			itemStore = Ext.getStore('Item'),
			userStore = Ext.getStore('User');

		userStore.removeAll();
		userStore.add({
			username: username,
			password: password
		});

		listStore.username = username;

		itemStore.username = username;
		itemStore.password = password;
		if (this.metaSyncHandler) {
			this.metaSyncHandler.cancel();
		} else {
			this.startMetaSyncing(this);
		}
	},
	disconnect: function() {
		var listStore = Ext.getStore('List'),
			itemStore = Ext.getStore('Item'),
			userStore = Ext.getStore('User');

		if (this.metaSyncHandler) {
			userStore.removeAll();
			listStore.removeAll();
			itemStore.username = 'nobody';
			itemStore.password = null;
			this.metaSyncHandler.cancel();
		}
	},
	syncStarted: null,
	listSyncPending: null,
	textSyncPending: null,
	mapsSyncPending: null,
	imagesSyncPending: null,
	startMetaSyncing: function(me) {
		var me = this,
			options = { auto_compaction: true },
			listStore = Ext.getStore('List'),
			itemStore = Ext.getStore('Item');

		listStore.remoteDB = new PouchDB('https://' + itemStore.username + ':' + itemStore.password + '@djsauble.cloudant.com/lists');
		itemStore.remoteTextDB = new PouchDB('https://' + itemStore.username + ':' + itemStore.password + '@djsauble.cloudant.com/text');
		itemStore.remoteMapsDB = new PouchDB('https://' + itemStore.username + ':' + itemStore.password + '@djsauble.cloudant.com/maps');
		itemStore.remoteImagesDB = new PouchDB('https://' + itemStore.username + ':' + itemStore.password + '@djsauble.cloudant.com/images');
		itemStore.remoteMetaDB = new PouchDB('https://' + itemStore.username + ':' + itemStore.password + '@djsauble.cloudant.com/metadata');
		me.metaSyncHandler = itemStore.localMetaDB.sync(itemStore.remoteMetaDB, {
			live: true,
			retry: true,
			back_off_function: function (delay) {
				me.online = false;
				me.setIndicator("offline :-(");
				return 1000;
			}
		}).on('change', function (change) {
			if (change.change.docs.length) {
				console.log("Sync change");
				me.calculateSync(change.change.docs);
			}
		}).on('paused', function (info) {
			console.log("Sync paused");
			me.online = true;
			me.syncStarted = null;
			me.oneTimeMessage = false;
			me.setIndicator("online :-)");
		}).on('active', function (info) {
			console.log("Sync active");
			me.syncStarted = (new Date()).getTime();
			me.setIndicator("Syncing…");
		}).on('error', function (err) {
			console.log("Sync error");
		});
		me.metaSyncHandler.on('complete', function (info) {
			itemStore.localMetaDB.destroy().then(function() {
				listStore.localDB = new PouchDB('lists', options);
				itemStore.localTextDB = new PouchDB('text', options);
				itemStore.localMapsDB = new PouchDB('maps', options);
				itemStore.localImagesDB = new PouchDB('images', options);
				itemStore.localMetaDB = new PouchDB('metadata', options);
				me.getListsPanel().down('button[action=signin]').show();
				me.getListsPanel().down('button[action=signout]').hide();
				me.metaSyncHandler = null;
				if (itemStore.username && itemStore.password) {
					me.startMetaSyncing(me);
				}
			});
		});
		setTimeout(function() {
			me.getListsPanel().down('button[action=signin]').hide();
			me.getListsPanel().down('button[action=signout]').show();	
		}, 50);

		me.doSync(true, true, true, true);
	},
	calculateSync: function(metadata) {
		var me = this,
			itemStore = Ext.getStore('Item'),
			listStore = Ext.getStore('List'),
			syncLists = false,
			syncText = false,
			syncMaps = false,
			syncImages = false;

		for (var i = 0; i < metadata.length; ++i) {
			var store = metadata[i]._id.replace(/_.*/, "");
			var object = metadata[i]._id.replace(store + "_", "");
			if (store === "lists" && object === listStore.username) {
				console.log("Sync lists");
				syncLists = true;
			} else if (store === "text" && object === itemStore.username) {
				console.log("Sync text");
				syncText = true;
			} else if (store === "maps" && object === itemStore.username) {
				console.log("Sync maps");
				syncMaps = true;
			} else if (store === "images" && object === itemStore.username) {
				console.log("Sync images");
				syncMaps = true;
			}
		}

		me.doSync(syncLists, syncText, syncMaps, syncImages);
	},
	restoreOnLoad: true,
	doSync: function(syncLists, syncText, syncMaps, syncImages) {
		var me = this,
			itemStore = Ext.getStore('Item'),
			listStore = Ext.getStore('List');

		if (syncLists) {
			listStore.localDB.sync(listStore.remoteDB, function() {
				listStore.load(function() {
					me.doSync(false, syncText, syncMaps, syncImages)
				});
			});
		} else if (syncText) {
			itemStore.localTextDB.sync(itemStore.remoteTextDB, function() {
				itemStore.load(function() {
					me.doSync(false, false, syncMaps, syncImages);
				});
			}).on('error', function(err) {
				console.log(err);
			});
		} else if (syncMaps) {
			itemStore.localMapsDB.sync(itemStore.remoteMapsDB, function() {
				itemStore.load(function() {
					me.doSync(false, false, false, syncImages);
				});
			});
		} else if (syncImages) {
			itemStore.localImagesDB.sync(itemStore.remoteImagesDB, function() {
				itemStore.load(function() {
					me.doSync(false, false, false, false);
				});
			});
		} else if (me.restoreOnLoad) {
			var store = Ext.getStore('Restore'),
				record;

			if (store.getCount()) {
				record = store.getAt(0);
				if (record.get('currentListId')) {
					me.getApplication().getController('Main').editList(record.get('currentListId'));
				}
				if (record.get('currentItemId')) {
					me.getApplication().getController('Main').editTodoItem(record.get('currentItemId'));
				}
			}

			me.restoreOnLoad = false;
		}
	},
	online: null,
	message: null,
	setIndicator: function(message) {
		var me = this;

		if (me.message != message) {
			me.getMain().down('toolbar[docked=bottom]').setTitle(message);
			me.message = message;
		}
	}
});
