Ext.define('TodoApp.view.New', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-new',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'TodoApp.view.Image',
        'TodoApp.view.Map'
    ],

    config: {
        items: [
            {
                docked: 'top',
                xtype: 'titlebar',
                title: 'Add item',
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
                style: 'background: red',

                items: [
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
