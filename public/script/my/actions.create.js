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
//       console.log(model)
//    },
//    deleteItem:function(model){
//        console.log(model);
//    }
//});
//
//TodoActions.addItem({name:'xxx'});
//TodoActions.deleteItem({name:'yyy'});


var getAll = Reflux.createAction({
    asyncResult: true,
    preEmit: function () {
        return 4;
    },
    shouldEmit: function (data) {
        console.log(data);
    }
});

var TodoStore = Reflux.createStore({
    init: function () {
        this.listenTo(getAll, 'getAll');
    },
    getAll: function (model) {
        $.get('/all', function (data) {
            if (data) {
                getAll.completed(data);
            } else {
                getAll.failed(data);
            }

        });
    }
});

getAll()
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        throw err;
    });
