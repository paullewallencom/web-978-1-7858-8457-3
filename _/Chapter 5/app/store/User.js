Ext.define('TodoApp.store.User', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.User',
		autoSync: true,
		autoLoad: true
  	}
});