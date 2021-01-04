Ext.define('TodoApp.store.Position', {
  	extend: 'Ext.data.Store',
  	config: {
		model: 'TodoApp.model.Position',
		autoSync: true,
		autoLoad: true
  	}
});