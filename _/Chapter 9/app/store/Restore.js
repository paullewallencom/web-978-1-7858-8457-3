Ext.define('TodoApp.store.Restore', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Restore',
		autoSync: true,
		autoLoad: true
  	}
});