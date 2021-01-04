Ext.define('TodoApp.model.Position', {
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
			'latitude',
			'longitude',
			'online'
		],
		proxy: {
        	type: 'localstorage',
        	id: 'todoapp-positions'
        }
	}
});