Ext.define('TodoApp.view.item.Image', {
	extend: 'Ext.form.FieldSet',
	alias: 'widget.todo-image',

	config: {
        title: 'Image',
		items: [
			{
				xtype: 'hiddenfield',
				name: 'media'
			},
			{
				xtype: 'panel',
				layout: 'fit',
				html: 'No image loaded'
			},
            {
                xtype: 'button',
                text: 'Select',
                handler: function(button) {
                	var parent = button.up('todo-image');
                	parent.selectImage(parent);
                }
            },
            {
            	xtype: 'button',
            	text: 'Remove',
            	hidden: true,
            	handler: function(button) {
            		var parent = button.up('todo-image');
            		parent.removeImage(parent);
            	}
            }
		]
	},

	removeImage: function(scope) {
		scope.down('hiddenfield').setValue('');
		scope.down('panel').setHtml('No image loaded');
		scope.down('button[text=Select]').setHidden(false);
		scope.down('button[text=Remove]').setHidden(true);
	},

	selectImage: function(scope) {
        navigator.camera.getPicture(
        	function(dataUrl) { // Success
        		var media = 'data:image/jpeg;base64,' + dataUrl;
        		scope.down('hiddenfield').setValue(media)
				scope.down('panel').setHtml('<img src="' + media + '" alt="todo image" width="100%"/>');
				scope.down('button[text=Select]').setHidden(true);
				scope.down('button[text=Remove]').setHidden(false);
	        },
	        function(message) { // Failure
				scope.down('panel').setHtml(message);
	        },
	        { // Options
	            quality: 50,
	            destinationType: navigator.camera.DestinationType.DATA_URL,
	            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
	            CameraUsesGeolocation: true
	        }
        );
	}
});
