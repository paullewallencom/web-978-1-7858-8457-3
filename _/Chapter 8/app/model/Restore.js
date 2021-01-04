Ext.define('TodoApp.model.Restore', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.identifier.Uuid',
		'Ext.data.proxy.LocalStorage'
	],
	config: {
		identifier: {
			type: 'uuid'
		},
		fields: [
			'id',
			'currentListId',
			'currentItemId'
		],
		proxy: {
        	type: 'localstorage',
        	id: 'todoapp-restore'
        }
	}
});