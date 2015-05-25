//var addItem = Reflux.createAction();
//
//var TodoStore = Reflux.createStore({
//    init: function () {
//        this.listenTo(addItem, 'addItem');
//    },
//    addItem: function (model) {
//        console.log(model);
//    }
//});
//
//addItem({name: 'xxx'});


//var TodoActions = Reflux.createActions([
//    'addItem',
//    'deleteItem'
//]);
//
//var TodoStore = Reflux.createStore({
//    init: function () {
//        this.listenTo(TodoActions.addItem, 'addItem');
//        this.listenTo(TodoActions.deleteItem, 'deleteItem');
//    },
//    addItem: function (model) {
//        console.log(model);
//    },
//    deleteItem: function (model) {
//        console.log(model);
//    }
//});
//
//TodoActions.addItem({name: 'xxx'});
//TodoActions.deleteItem({name: 'yyy'});


//var TodoActions = Reflux.createActions([
//    'item1',
//    'item2',
//    'item3',
//    'item4',
//    'item5',
//    'item6',
//    'item7',
//    'item8',
//    'item9',
//    'item10'
//]);
//
//var TodoStore = Reflux.createStore({
//    init: function () {
//        this.listenTo(TodoActions.item1, 'item1');
//        this.listenTo(TodoActions.item2, 'item2');
//        this.listenTo(TodoActions.item3, 'item3');
//        this.listenTo(TodoActions.item4, 'item4');
//        this.listenTo(TodoActions.item5, 'item5');
//        this.listenTo(TodoActions.item6, 'item6');
//        this.listenTo(TodoActions.item7, 'item7');
//        this.listenTo(TodoActions.item8, 'item8');
//        this.listenTo(TodoActions.item9, 'item9');
//        this.listenTo(TodoActions.item10, 'item10');
//
//    },
//    item1: function (model) {
//        console.log(model);
//    },
//    item2: function (model) {
//        console.log(model);
//    }
//});
//
//TodoActions.item1({name: 'xxx'});
//TodoActions.item2({name: 'yyy'});


var TodoActions = Reflux.createActions([
    'item1',
    'item2',
    'item3',
    'item4',
    'item5',
    'item6',
    'item7',
    'item8',
    'item9',
    'item10'
]);

var TodoStore = Reflux.createStore({
    listenables: [TodoActions],
    onItem1: function (model) {
        console.log(model);
    },
    onItem2: function (model) {
        console.log(model);
    }
});

TodoActions.item1({name: 'xxx'});
TodoActions.item2({name: 'yyy'});
