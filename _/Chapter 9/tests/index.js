var Harness = Siesta.Harness.Browser.SenchaTouch;

Harness.configure({
    title : 'Todo App',
    viewportWidth: 320,
    viewportHeight: 600
});

Harness.start(
    { 
        group : 'Todo app tests',
        hostPageUrl : '/',
        performSetup : false,
        items : [ 
            '01_add_todo_item.t.js'
        ] 
    } 
);