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
			'id',
			'description',
			'image',
			'location'
		],
		proxy: {
			type: 'localstorage',
			id: 'todoapp-items'
		}
	}
});