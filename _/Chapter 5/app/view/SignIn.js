Ext.define('TodoApp.view.SignIn', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-sign-in',
    requires: [
        'Ext.TitleBar',
        'Ext.field.Email',
        'Ext.field.Password'
    ],

    config: {
    	items: [
	        {
	            docked: 'top',
	            xtype: 'titlebar',
	            title: 'Sign in',
	            items: {
                    align: 'left',
                    text: 'Back',
                    action: 'back'
                },
	        },
	        {
	        	xtype: 'formpanel',
	        	scrollable: false,
	        	height: '100%',
            	items: [
            		{
	            		xtype: 'emailfield',
	            		name: 'username',
	            		label: 'Username'	
            		},
            		{
            			xtype: 'passwordfield',
            			name: 'password',
            			label: 'Password'
            		},
            		{
            			xtype: 'button',
            			text: 'Sign in',
            			action: 'submit'
            		}
            	]
	        }
    	]
    }
});
