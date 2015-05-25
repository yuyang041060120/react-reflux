Reflux.ActionMethods.print = function (str) {
    console.log(str);
};

var addItem = Reflux.createAction();

var TodoStore = Reflux.createStore({
    init: function () {
        this.listenTo(addItem, 'addItem');
    },
    addItem: function (params) {
        console.log('addItem:' + params);
    }
});

addItem.print('xxx');
