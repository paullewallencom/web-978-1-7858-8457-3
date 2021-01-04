Ext.define('TodoApp.patch.MapsError', {
	override: 'Ext.Map',

	constructor: function() {
        this.callParent(arguments);

        if (!(window.google || {}).maps) {
            this.setHtml('Must be online to use Google Maps');
        }
    }
});