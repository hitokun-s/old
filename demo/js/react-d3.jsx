import React from "react";
import ReactDOM from "react-dom";

var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

var d3Chart = {};

d3Chart.create = function(el, props, state) {
    var svg = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('width', props.width)
        .attr('height', props.height);

    svg.append('g').attr('class', 'd3-points');

    this.update(el, state);
};

d3Chart._scales = function(el, domain) {
    if (!domain) {
        return null;
    }

    var width = el.offsetWidth;
    var height = el.offsetHeight;

    var x = d3.scale.linear()
        .range([0, width])
        .domain(domain.x);

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(domain.y);

    var z = d3.scale.linear()
        .range([5, 20])
        .domain([1, 10]);

    return {x: x, y: y, z: z};
};


d3Chart._drawPoints = function(el, scales, data) {
    var g = d3.select(el).selectAll('.d3-points');

    var point = g.selectAll('.d3-point')
        .data(data, function(d) { return d.id; });

    // ENTER
    point.enter().append('circle')
        .attr('class', 'd3-point');

    // ENTER & UPDATE
    point.attr('cx', function(d) { return scales.x(d.x); })
        .attr('cy', function(d) { return scales.y(d.y); })
        .attr('r', function(d) { return scales.z(d.z); });

    // EXIT
    point.exit()
        .remove();
};

d3Chart.update = function(el, state) {
    var scales = this._scales(el, state.domain);
    this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {
    // Any clean-up would go here
    // in this example there is nothing to do
};


class Chart extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var el = ReactDOM.findDOMNode(this);
        d3Chart.create(el, {
            width: '100%',
            height: '300px'
        }, this.getChartState());
    }

    componentDidUpdate() {
        var el = ReactDOM.findDOMNode(this);
        d3Chart.update(el, this.getChartState());
    }

    getChartState() {
        return {
            data: this.props.data,
            domain: this.props.domain
        };
    }

    componentWillUnmount() {
        var el = ReactDOM.findDOMNode(this);
        d3Chart.destroy(el);
    }

    render() {
        return (
            <div className="Chart"></div>
        );
    }
}

Chart.propTypes = {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
};
Chart.defaultProps = {

};

var sampleData = [
    {id: '5fbmzmtc', x: 7, y: 41, z: 6},
    {id: 's4f8phwm', x: 11, y: 45, z: 9}
];

class App extends React.Component{

    constructor() {
        super();
        this.state = {
            data: sampleData,
            domain: {x: [0, 30], y: [0, 100]}
        };
    }

    render() {
        return (
            <div className="App">
                <Chart
                    data={this.state.data}
                    domain={this.state.domain} />
            </div>
        );
    }
}


//React.renderComponent(App(), document.body);
ReactDOM.render(
    <App />, // propsに格納される
    document.body // 第二引数：mmount対象dom要素
);