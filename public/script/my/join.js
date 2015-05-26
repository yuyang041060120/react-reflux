var TodoActions = Reflux.createActions([
    'say',
    'do',
    'print'
]);


var TodoStore = Reflux.createStore({
    listenables:[TodoActions],
    init: function () {
        this.joinConcat(TodoActions.say, TodoActions.do, this.handle);
    },
    onSay: function () {
        console.log('onSay');
    },
    handle: function (s,b) {
        console.log(s);
        console.log(b);
    }
});


TodoActions.say('say');
TodoActions.say('say1');
TodoActions.do('do');
TodoActions.do('do1');

