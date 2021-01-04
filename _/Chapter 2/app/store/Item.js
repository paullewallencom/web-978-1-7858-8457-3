Ext.define('TodoApp.store.Item', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Item',
		autoLoad: true
  	}
});