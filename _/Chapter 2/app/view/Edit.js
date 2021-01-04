Ext.define('TodoApp.view.Edit', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-edit',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio',
        'Ext.field.Hidden'
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
                        xtype: 'fieldset',
                        title: 'Image',
                        items: [
                            {
                                xtype: 'panel',
                                width: '100%',
                                height: 156,
                                style: 'background: #AAAAAA'
                            },
                            {
                                xtype: 'button',
                                text: 'Remove image'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Location',
                        defaults: {
                            labelAlign: 'right',
                            labelWidth: '240px',
                            xtype: 'radiofield',
                            name: 'location'
                        },
                        items: [
                            {
                                name: 'location',
                                value: 'home',
                                label: 'Home'
                            },
                            {
                                name: 'location',
                                value: 'work',
                                label: 'Work'
                            },
                            {
                                name: 'location',
                                value: 'other',
                                label: 'Other'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});