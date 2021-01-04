Ext.define('TodoApp.view.item.DataItem', {
	extend: 'Ext.dataview.component.DataItem',
	alias: 'widget.todo-dataitem',
	requires: [
		'Ext.Label'
	],

	config: {
		description: {
			flex: 1
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
			getDescription: {
				setHtml: 'description'
			},
			getEdit: {
				setData: 'id'
			},
			getDestroy: {
				setData: 'id'
			}
		}
	},

	applyDescription: function(config) {
		return Ext.factory(config, 'Ext.Label', this.getDescription());
	},
	updateDescription: function(newDescription, oldDescription) {
		if (newDescription) {
			this.add(newDescription);
		}
		if (oldDescription) {
			this.remove(oldDescription);
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
