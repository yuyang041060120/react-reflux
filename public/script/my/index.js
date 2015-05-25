var TodoActions = Reflux.createActions([
    'getAll'
]);

var TodoStore = Reflux.createStore({
    items: [],
    listenables: [TodoActions],
    onGetAll: function () {
        this.items = [1, 2, 3];
        this.trigger(this.items);
    }
});


var TodoComponent = React.createClass({
    mixins:[Reflux.listenTo(TodoStore,'onStatusChange')],
    getInitialState: function () {
        return {list: []};
    },
    onStatusChange: function () {
        this.setState({list: TodoStore.items});
    },
    componentDidMount: function () {
        //this.listenTo(TodoStore,this.onStatusChange);
        ////TodoStore.listen(this.onStatusChange);
        TodoActions.getAll();
    },
    render: function () {
        return (
            <div>
                {this.state.list.map(function (item) {
                    return <p>{item}</p>
                })}
            </div>
        )
    }
});


React.render(<TodoComponent />, document.getElementById('container'));