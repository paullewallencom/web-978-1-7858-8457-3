Ext.define('TodoApp.model.Item', {
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
			'list',
			'description',
			'media',
			{ name: 'latitude', type: 'float' },
			{ name: 'longitude', type: 'float' }
		],
		proxy: {
	    	type: 'localstorage',
	    	id: 'todoapp-items'
	    }
	}
});