Ext.define('TodoApp.model.Collaborator', {
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
			'id'
		],
		proxy: {
        	type: 'localstorage',
        	id: 'todoapp-shares'
        }
	}
});