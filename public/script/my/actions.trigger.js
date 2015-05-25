var addItem = Reflux.createAction();

var TodoStore = Reflux.createStore({
    init: function () {
        this.listenTo(addItem, 'addItem');
    },
    addItem: function (model) {
        console.log(model);
    }
});

addItem({name: 'xxx'});


//addItem.triggerAsync({name: 'xxx'});
//addItem.trigger({name: 'yyy'});

//triggerAsync = setTimeout(function () {
//    trigger()
//}, 0);