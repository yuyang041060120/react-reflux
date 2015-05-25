var TodoActions = Reflux.createActions([
    'getAll',
    'addItem',
    'deleteItem',
    'updateItem'
]);

var TodoStore = Reflux.createStore({
    items: [1, 2, 3],
    listenables: [TodoActions],
    onGetAll: function () {
        $.get('/all', function (data) {
            this.items = data;
            this.trigger(this.items);
        }.bind(this));
    },
    onAddItem: function (model) {
        $.post('/add', model, function (data) {
            this.items.unshift(data);
            this.trigger(this.items);
        }.bind(this));
    },
    onDeleteItem: function (model, index) {
        $.post('/delete', model, function (data) {
            this.items.splice(index, 1);
            this.trigger(this.items);
        }.bind(this));
    },
    onUpdateItem: function (model, index) {
        $.post('/update', model, function (data) {
            this.items[index] = data;
            this.trigger(this.items);
        }.bind(this));
    }
});


var TodoComponent = React.createClass({
    mixins: [Reflux.connect(TodoStore, 'list')],
    getInitialState: function () {
        return {list: []};
    },
    componentDidMount: function () {
        TodoActions.getAll();
    },
    render: function () {
        return (
            <div>
                {this.state.list.map(function(item){
                    return <TodoItem data={item}/>
                })}
            </div>
        )
    }
});

var TodoItem = React.createClass({
    componentDidMount: function () {
        TodoActions.getAll();
    },
    handleAdd: function (model) {
        TodoActions.addItem(model);
    },
    handleDelete: function (model,index) {
        TodoActions.deleteItem(model,index);
    },
    handleUpdate: function (model) {
        TodoActions.updateItem(model);
    },
    render: function () {
        var item=this.props.data;
        return (
            <div>
                <p>{item.name}</p>
                <p>{item.email}</p>
                <p>/*²Ù×÷°´Å¥*/</p>
            </div>
        )
    }
});

React.render(<TodoComponent />, document.getElementById('container'));