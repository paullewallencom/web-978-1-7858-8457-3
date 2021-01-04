Ext.define('TodoApp.view.collaborator.DataItem', {
	extend: 'Ext.dataview.component.DataItem',
	alias: 'widget.todo-collaborator-dataitem',
	requires: [
		'Ext.Label'
	],

	config: {
		name: {
			flex: 1
		},
		unshare: {
			text: 'Unshare',
			action: 'delete'
		},
		padding: 7,
		layout: {
			type: 'hbox',
			align: 'center'
		},
		dataMap: {
			getName: {
				setHtml: 'id'
			},
			getUnshare: {
				setData: 'id'
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
	applyUnshare: function(config) {
		return Ext.factory(config, 'Ext.Button', this.getUnshare());
	},
	updateUnshare: function(newButton, oldButton) {
		if (newButton) {
			this.add(newButton);
		}
		if (oldButton) {
			this.remove(oldButton);
		}
	}
});