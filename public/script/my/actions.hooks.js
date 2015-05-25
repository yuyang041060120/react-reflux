var addItem = Reflux.createAction({
    preEmit: function (params) {
        console.log('preEmit:' + params);
        return 324;
    },
    shouldEmit: function (params) {
        console.log('shouldEmit:' + params);
        return true;
    }
});

var TodoStore = Reflux.createStore({
    init: function () {
        this.listenTo(addItem, 'addItem');
    },
    addItem: function (params) {
        console.log('addItem:' + params);
    }
});

addItem('xxx');