Ext.define('TodoApp.model.User', {
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
			'username',
			'password'
		],
		proxy: {
        	type: 'localstorage',
        	id: 'todoapp-users'
        }
	}
});