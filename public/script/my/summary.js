var TodoActions = Reflux.createActions([
    'addItem'
]);

var TodoStore = Reflux.createStore({
    items: [1, 2],
    listenables: [TodoActions],
    onAddItem: function (model) {
        $.post('/server/add', {data: model}, function (data) {
            this.items.unshift(data);
            this.trigger(this.items);
        });
    }
});


var TodoComponent = React.createClass({
    mixins: [Reflux.listenTo(TodoStore, 'onStatusChange')],
    getInitialState: function () {
        return {list: []};
    },
    onStatusChange: function () {
        this.setState({list: TodoStore.items});
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