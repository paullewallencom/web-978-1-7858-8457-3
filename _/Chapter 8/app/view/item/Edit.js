Ext.define('TodoApp.view.item.Edit', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-edit',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'Ext.field.Hidden',
        'TodoApp.view.item.Image',
        'TodoApp.view.item.Map',
        'TodoApp.view.item.Conflict'
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
                        name: '_id'
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'list'
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Description',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'description'
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'textrev'
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'textconflicts'
                            },
                            {
                                xtype: 'todo-conflict'
                            }
                        ]
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
