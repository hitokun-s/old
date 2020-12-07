var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

class Child extends React.Component {

    constructor(props) {
        console.log("Child constructor() called.");
        console.log("message from parent:" + props.message);
    }

    render() {
        console.log("Child::render() called");
        return <button onClick={this.props.methodOfParent}>Click Here!</button>
    }

    componentWillUpdate() {
        console.log("componentWillUpdate");
    }

    componentDidUpdate() {
        console.log("componentDidUpdate()");
    }

    //shouldComponentUpdate(nextProps, nextState) {
    //    console.log("shouldComponentUpdate");
    //    return true;
    //}
}

// コンポーネント指向のコンポーネント
// すべてのコンポーネント（＝仮想DOM）は必ずElementを返す
// コンポーネントの入れ子でコンポーネントができている
// props : 変更できない。コンポーネント呼び出し時の属性値としてセットする
// state:変更できる
class Parent extends React.Component {

    constructor(props) { // props引数なしのconstructor()でもよい。this.propsで取れるので。
        //super(props); // 意味ある？
        console.log("Parent constructor() called.");
        console.log(props === this.props); // true
        console.log(this.state == undefined);// true

        // 本来はsetStateを使うべきだが、初期値セットだけはこうするしかなさそう。
        // そうしないと、render()が2回呼ばれることになる。
        this.state = {hoge: 1};

        // this.hoge.bind(this); // これだけだとダメ！（hoge()実行時にthisがnullになる）
        this.hoge = this.hoge.bind(this);

        this.children = [
            //React.createElement(Child, {key:"1", message:"I love you,son!" }),
            //React.createElement(Child, {key:"2", message:"I love you,son2!" }),
            <Child key="1" message="I love you,son!" methodOfParent={this.hoge}/>,
            <Child key="2" message="I love you,daughter!" methodOfParent={this.hoge}/>
        ];
    }

    componentWillMount() {
        console.log("componentWillMount() called:" + this.state.hoge);//初回のみ呼ばれる
        console.log(this.props.greeting);
    }

    componentDidMount() {
        console.log("componentDidMount() called" + this.state.hoge);//二回目以降も呼ばれる
        console.log(this.state);
        ReactDOM.findDOMNode(this.refs.name).value = "Mr.Parent";
    }

    hoge() {
        console.log("hoge() called.");
        console.log(this.refs.name.value); // ref属性から仮想DOMコンポーネントを取得する
        console.log(ReactDOM.findDOMNode(this.refs.name).value); // さらに実際のDOMを取得する
        console.log(this.refs.name === ReactDOM.findDOMNode(this.refs.name)); // true あれ？

        // this.refs.name.valueの値を取得して、ajaxでサーバに送信するとかいろいろ。

        this.setState({
            hoge: this.state.hoge + 1,
            //children: this.state.children
        });
    }

    render() {
        console.log("Parent::render() called" + this.state.hoge);//二回目以降も呼ばれる
        //var children = [
        //    <Child key="1" message="I love you,son!" methodOfParent={this.hoge}/>,
        //    <Child key="2" message="I love you,daughter!" methodOfParent={this.hoge}/>
        //]
        return (
            <div>
                {this.state.hoge}
                <input type="text" ref="name"/>
                {this.children}
            </div>
        )
    }
}

ReactDOM.render(
    <Parent greeting="hello!"/>, // propsに格納される
    $('#tgt')[0] // 第二引数：mmount対象dom要素
);