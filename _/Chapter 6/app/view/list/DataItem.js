Ext.define('TodoApp.view.list.DataItem', {
	extend: 'Ext.dataview.component.DataItem',
	alias: 'widget.todo-list-dataitem',
	requires: [
		'Ext.Label'
	],

	config: {
		name: {
			flex: 1
		},
		share: {
			text: 'Share',
			action: 'share',
			margin: '0 7px 0 0'
		},
		edit: {
			text: 'Edit',
			action: 'edit',
			margin: '0 7px 0 0'
		},
		destroy: {
			text: 'Delete',
			action: 'delete'
		},
		padding: 7,
		layout: {
			type: 'hbox',
			align: 'center'
		},
		dataMap: {
			getName: {
				setHtml: 'name'
			},
			getShare: {
				setData: '_id'
			},
			getEdit: {
				setData: '_id'
			},
			getDestroy: {
				setData: '_id'
			}
		}
	},

	applyName: function(config) {
		return Ext.factory(config, 'Ext.Label', this.getName());
	},
	updateName: function(newName, oldName) {
		if (newName) {
			this.add(newName);
		}
		if (oldName) {
			this.remove(oldName);
		}
	},
	applyShare: function(config) {
		return Ext.factory(config, 'Ext.Button', this.getShare());
	},
	updateShare: function(newButton, oldButton) {
		if (newButton) {
			this.add(newButton);
		}
		if (oldButton) {
			this.remove(oldButton);
		}
	},
	applyEdit: function(config) {
		return Ext.factory(config, 'Ext.Button', this.getEdit());
	},
	updateEdit: function(newButton, oldButton) {
		if (newButton) {
			this.add(newButton);
		}
		if (oldButton) {
			this.remove(oldButton);
		}
	},
	applyDestroy: function(config) {
		return Ext.factory(config, 'Ext.Button', this.getDestroy());
	},
	updateDestroy: function(newButton, oldButton) {
		if (newButton) {
			this.add(newButton);
		}
		if (oldButton) {
			this.remove(oldButton);
		}
	}
});