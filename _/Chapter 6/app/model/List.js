Ext.define('TodoApp.model.List', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.identifier.Uuid',
		'Ext.data.proxy.LocalStorage'
	],
	config: {
		identifier: {
			type: 'uuid'
		},
		idProperty: '_id',
		fields: [
			'_id',
			'_rev',
			'name',
			'owner',
			'collaborators',
			'items'
		],
		proxy: {
        	type: 'localstorage',
        	id: 'todoapp-lists'
        }
	}
});