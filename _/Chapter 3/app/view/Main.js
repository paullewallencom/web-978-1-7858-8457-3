Ext.define('TodoApp.view.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.todo-main',
    fullscreen: true,
    config: {
        layout: 'card',
        items: { xtype: 'todo-list' }
    },
    activeIndex: 0
});