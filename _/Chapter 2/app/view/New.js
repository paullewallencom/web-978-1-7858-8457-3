Ext.define('TodoApp.view.New', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-new',
    requires: [
        'Ext.TitleBar',
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Radio'
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
                        xtype: 'fieldset',
                        title: 'Image',
                        items: {
                            xtype: 'button',
                            text: 'Select image…'
                        }
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
                                value: 'here',
                                checked: true,
                                label: 'Current location'
                            },
                            {
                                name: 'location',
                                value: 'home',
                                label: 'Home'
                            },
                            {
                                name: 'location',
                                value: 'work',
                                label: 'Work'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});