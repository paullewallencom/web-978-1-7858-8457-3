StartTest(function(t) {
	t.chain(
	    t.diag("Add a todo item"),
	    {waitFor: 'CQ', args: '>>todo-lists'},
	    {click: '>>todo-lists button[action=new]'},
	    {waitFor: 'CQ', args: '>>todo-list-new'},
	    function(next) {
	    	var field = t.cq1('>>textfield[name=name]');
	    	field.setValue('Test');
	    	next();
	    },
	    {waitFor: 'CQ', args: '>>textfield[value=Test]'},
	    {click: '>>todo-list-new button[action=create]'},
	    {waitFor: 'CQ', args: '>>todo-lists'},
	    {waitForMs: 1000},
	    {click: '>>todo-list-dataitem button[action=edit]'},
	    {waitFor: 'CQ', args: '>>todo-list'},
	    {click: '>>todo-list button[action=new]'},
	    {waitFor: 'CQ', args: '>>todo-new'},
	    function(next) {
	    	var field = t.cq1('>>textfield[name=description]');
	    	field.setValue('Item');
	    	next();
	    },
	    {waitFor: 'CQ', args: '>>textfield[value=Item]'},
	    {click: '>>todo-new button[action=create]'},
	    {waitFor: 'CQVisible', args: '>>todo-list'},
	    function(next) {
	    	t.ok(t.cq1('>>todo-list label[html=Item]'));
	    	next();
	    }
	);
});