Ext.define('TodoApp.model.Item', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.proxy.LocalStorage',
		'Ext.data.identifier.Uuid'
	],
	config: {
		identifier: {
			type: 'uuid'
		},
		fields: [
			{ name: 'id', type: 'string' },
			{ name: 'description', type: 'string' },
			{ name: 'media', type: 'string' },
			{ name: 'latitude', type: 'number' },
			{ name: 'longitude', type: 'number' }
		],
		proxy: {
			type: 'localstorage',
			id: 'todoapp-items'
		}
	}
});