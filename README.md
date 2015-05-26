#概念#
Reflux是根据React的flux创建的单向数据流类库。
Reflux的单向数据流模式主要由actions和stores组成。例如，当组件list新增item时，会调用actions的某个方法（如addItem(data)）,并将新的数据当参数传递进去，通过事件机制，数据会传递到stroes中，stores可以向服务器发起请求，并更新数据数据库。数据更新成功后，还是通过事件机制传递的组件list当中，并更新ui。整个过程的对接是通过事件驱动的。就像这样：

    ╔═════════╗       ╔════════╗       ╔═════════════════╗
    ║ Actions ║──────>║ Stores ║──────>║ View Components ║
    ╚═════════╝       ╚════════╝       ╚═════════════════╝
         ^                                      │
         └──────────────────────────────────────┘
代码看起来像这样的：

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
    
#同React Flux比较#
##相同点##

 - 有actions
 - 有stores
 - 单向数据流
##不同点##
 - 通过内部拓展actions的行为，移除了单例的dispatcher
 - stores可以监听actions的行为，无需进行冗杂的switch判断
 - stores可以相互监听，可以进行进一步的数据聚合操作，类似于，map/reduce
 - waitFor被连续和平行的数据流所替代

#创建Action#

    var statusUpdate = Reflux.createAction(options);
返回值是一个函数，调用这个函数就会触发相应的事件，在store中监听这个函数，并作相应的处理

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
    
##创建多个Action##

    var TodoActions = Reflux.createActions([
        'addItem',
        'deleteItem'
    ]);
    
store监听actions的行为：

    var TodoActions = Reflux.createActions([
        'addItem',
        'deleteItem'
    ]);
    
    var TodoStore = Reflux.createStore({
        init: function () {
            this.listenTo(TodoActions.addItem, 'addItem');
            this.listenTo(TodoActions.deleteItem, 'deleteItem');
        },
        addItem: function (model) {
           console.log(model)
        },
        deleteItem:function(model){
            console.log(model);
        }
    });
    
    TodoActions.addItem({name:'xxx'});
    TodoActions.deleteItem({name:'yyy'});
    
##异步Action##
真实的应用场景中，几乎所有的操作都会向后端请求，而这些操作都是异步的，Reflux也提供了相应的Promise接口
    
    var getAll = Reflux.createAction({asyncResult:true});
    
例如获取全部数据：

    var getAll = Reflux.createAction({asyncResult: true});
    
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
    
    getAll({name: 'xxx'})
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            throw err;
        });
        
##Action hooks##

Reflux为每个action都提供了两个hook方法

 - preEmit(params)，action emit之前调用，参数是action传递过来的，返回值会传递给shouldEmit
 - shouldEmit(params) action emit之前调用，参数默认是action传递，如果preEmit有返回值，则是preEmit返回值，返回值决定是否emit

情景一：

    var addItem = Reflux.createAction({
        preEmit: function (params) {
            console.log('preEmit:' + params);           
        },
        shouldEmit: function (params) {
            console.log('shouldEmit:' + params);           
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

    控制台打印
    $ preEmit:xxx
    $ shouldEmit:xxx

情景二：

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
    
    控制台打印
    $ preEmit:xxx
    $ shouldEmit:324
    $ addItem:324
 

> 注意几个返回值和参数的关系

##Action Methods##

当需要给所有的action添加公用方法时，可以这么干：

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
    
##trigger、triggerAsync和triggerPromise##

**直接调用addItem()**实际上是调用trigger或者triggerAsync或者triggerPromise，它们区别在于

    var addItem = Reflux.createAction(); addItem();                 #默认调用triggerAsync，相当于addItem.triggerAsync()
    var addItem = Reflux.createAction({sync:true});addItem();       #默认调用trigger，相当于addItem.trigger()
    var addItem = Reflux.createAction({asyncResult:true});addItem();#默认调用triggerPromise，相当于addItem.triggerPromise()
    
trigger和triggerAsync区别在于：

    triggerAsync = setTimeout(function () {
        trigger()
    }, 0);
trigger和triggerPromise区别在于，triggerPromise的返回值是promise
#创建Store#
Store可以响应Action的行为，并同服务器交互。
##监听单个Action##
在init方法中添加监听处理

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
    
##监听多个Action##
###作死写法###

    var TodoActions = Reflux.createActions([
        'addItem',
        'deleteItem'
    ]);
    
    var TodoStore = Reflux.createStore({
        init: function () {
            this.listenTo(TodoActions.addItem, 'addItem');
            this.listenTo(TodoActions.deleteItem, 'deleteItem');
        },
        addItem: function (model) {
            console.log(model);
        },
        deleteItem: function (model) {
            console.log(model);
        }
    });
    
    TodoActions.addItem({name: 'xxx'});
    TodoActions.deleteItem({name: 'yyy'});
两个action的时候在init里写了两遍监听处理方法，如果有十个甚至多个的话，写起来就像这样的：

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
        init: function () {
            this.listenTo(TodoActions.item1, 'item1');
            this.listenTo(TodoActions.item2, 'item2');
            this.listenTo(TodoActions.item3, 'item3');
            this.listenTo(TodoActions.item4, 'item4');
            this.listenTo(TodoActions.item5, 'item5');
            this.listenTo(TodoActions.item6, 'item6');
            this.listenTo(TodoActions.item7, 'item7');
            this.listenTo(TodoActions.item8, 'item8');
            this.listenTo(TodoActions.item9, 'item9');
            this.listenTo(TodoActions.item10, 'item10');
    
        },
        item1: function (model) {
            console.log(model);
        },
        item2: function (model) {
            console.log(model);
        }
    });
    
    TodoActions.item1({name: 'xxx'});
    TodoActions.item2({name: 'yyy'});
    
###listenToMany###
还好Reflux给我们提供了listenToMany方法，避免重复劳动：

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
        init: function () {
            this.listenToMany(TodoActions);
        },
        onItem1: function (model) {
            console.log(model);
        },
        onItem2: function (model) {
            console.log(model);
        }
    });
    
    TodoActions.item1({name: 'xxx'});
    TodoActions.item2({name: 'yyy'});
处理方法只需让action的标识首字母大写并加上on就可以了。

> 标识如果首字母大写就会识别不了，例如将上面的**item1**改成**Itme1**。这坑爹的！

###listenables###

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
    
一般我们写真实应用的时候都应该采用这种写法！！！
##Store Methods##
拓展Store的公用方法有两种方式。
###方式一###

    Reflux.StoreMethods.print = function (str) {
        console.log(str);
    };
    
    var addItem = Reflux.createAction();
    
    var TodoStore = Reflux.createStore({
        init: function () {
            this.listenTo(addItem, 'addItem');
        },
        addItem: function (model) {
            console.log(model);
        }
    });
    
    TodoStore.print('rrr');
    
###方式二###

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
#同组件结合#
前面说了，Action、Store和组件这三者是通过事件机制响应变化的，构建组件的时候首先需要监听Store的状态。
先定义Action和Store

    var TodoActions = Reflux.createActions([
        'getAll'
    ]);
    
    var TodoStore = Reflux.createStore({
        items: [1,2,3],
        listenables: [TodoActions],
        onGetAll: function () {
            this.trigger(this.items);
        }
    });
    
##基本##
    
    var TodoComponent = React.createClass({
        getInitialState: function () {
            return {list: []};
        },
        onStatusChange: function (list) {
            this.setState({list: list});
        },
        componentDidMount: function () {
            this.unsubscribe = TodoStore.listen(this.onStatusChange);
            TodoActions.getAll();
        },
        componentWillUnmount: function () {
            this.unsubscribe();
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
这里有两点需要注意：

 - 当组件的生命周期结束时需要解除对Store的监听
 - 当Store调用trigger时，才会执行onStatusChange函数，所以每次Store更新时，需要手动调用trigger函数

##Mixins##
    
    var TodoComponent = React.createClass({
        mixins: [Reflux.ListenerMixin],
        getInitialState: function () {
            return {list: []};
        },
        onStatusChange: function (list) {
            this.setState({list: list});
        },
        componentDidMount: function () {
            this.unsubscribe = TodoStore.listen(this.onStatusChange);
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
##Reflux.listenTo##

    var TodoComponent = React.createClass({
        mixins: [Reflux.listenTo(TodoStore,'onStatusChange')],
        getInitialState: function () {
            return {list: []};
        },
        onStatusChange: function (list) {
            this.setState({list: list});
        },
        componentDidMount: function () {
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
##Reflux.connect##

    var TodoComponent = React.createClass({
        mixins: [Reflux.connect(TodoStore,'list')],
        getInitialState: function () {
            return {list: []};
        },
        componentDidMount: function () {
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
数据会自动更新到state的list当中。
##Reflux.connectFilter##

    var TodoComponent = React.createClass({
        mixins: [Reflux.connectFilter(TodoStore, 'list', function (list) {
            return list.filter(function (item) {
                return item > 1;
            });
        })],
        getInitialState: function () {
            return {list: []};
        },
        componentDidMount: function () {
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
对数据加了一层过滤器。

> 以上便Component同Store交互的内容，大家可以根据实际情况选择不同的写法。

#小结#
我这人喜欢拿代码来表述思想。

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
                    <p>/*操作按钮*/</p>
                </div>
            )
        }
    });
    React.render(<TodoComponent />, document.getElementById('container'));
实际情况远比这复杂，只是提供一个思路供大家参考。
#参考#
[Reflux][1]


  [1]: https://github.com/spoike/refluxjs
