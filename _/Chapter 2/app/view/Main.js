Ext.define('TodoApp.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-main',
    fullscreen: true,
    config: {
        layout: 'fit',
        items: { xtype: 'todo-list' }
    }
});