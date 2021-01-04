Ext.define('TodoApp.view.Edit', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-edit',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'Ext.field.Hidden',
        'TodoApp.view.Image',
        'TodoApp.view.Map'
    ],

    config: {
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: 'Edit item',
                items: [
                    {
                        align: 'left',
                        text: 'Back',
                        action: 'back'
                    },
                    {
                        align: 'right',
                        text: 'Save',
                        action: 'save'
                    }
                ]
            },
            {
                xtype: 'formpanel',
                height: '100%',
                scrollable: true,

                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Description',
                        items: {
                            xtype: 'textfield',
                            name: 'description'
                        }
                    },
                    {
                        xtype: 'todo-image'
                    },
                    {
                        xtype: 'todo-map'
                    }
                ]
            }
        ]
    }
});
