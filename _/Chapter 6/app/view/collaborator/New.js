Ext.define('TodoApp.view.collaborator.New', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-collaborator-new',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet'
    ],

    config: {
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: 'Add user',
                items: [
                    {
                        align: 'left',
                        text: 'Back',
                        action: 'back'
                    },
                    {
                        align: 'right',
                        text: 'Share',
                        action: 'share'
                    }
                ]
            },
            {
                xtype: 'formpanel',
                height: '100%',
                scrollable: true,

                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Name',
                        items: {
                            xtype: 'textfield',
                            name: 'id'
                        }
                    }
                ]
            }
        ]
    }
});