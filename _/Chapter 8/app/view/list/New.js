Ext.define('TodoApp.view.list.New', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-list-new',
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
                title: 'Add list',
                items: [
                    {
                        align: 'left',
                        text: 'Back',
                        action: 'back'
                    },
                    {
                        align: 'right',
                        text: 'Create',
                        action: 'create'
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
                            name: 'name'
                        }
                    }
                ]
            }
        ]
    }
});