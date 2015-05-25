//Reflux.StoreMethods.print = function (str) {
//    console.log(str);
//};
//
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
//TodoStore.print('rrr');

var Mixins = {
    print: function (str) {
        console.log(str);
    }
}

var addItem = Reflux.createAction();

var TodoStore = Reflux.createStore({
    mixins: [Mixins],
    init: function () {
        this.listenTo(addItem, 'addItem');
    },
    addItem: function (model) {
        console.log(model);
    }
});

TodoStore.print('rrr');