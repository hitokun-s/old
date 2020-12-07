/* 
 * dependency:jquery, d3
 */

// svg : d3 selection object
// data : [
// {{val:, full:, text: },
//]
// opt:{radius:, translate:{x:,y:}}
var createRaderChart = function(svg, data, opt) {
    console.log(data);
    var opt = opt || {};
    var half_width = $(svg.node()).width() / 2;
    var translate = opt.translate || {x: half_width, y: half_width};
    var g = svg.append("g").attr("transform", "translate(" + translate.x + "," + translate.y + ")");
    var theta = 2 * Math.PI / data.length;
    var R = opt.radius || half_width - 30;
    var dragend = opt.dragend || function(){};
    var customDrag = opt.drag || function(){};
    var raderLine = function(data, ratio) {
        var temp_r = R * ratio;
        var line = d3.svg.line()
                .x(function(d, i) {
                    return temp_r * Math.sin(i * theta);
                })
                .y(function(d, i) {
                    return -temp_r * Math.cos(i * theta);
                })
                .interpolate("linear");
        return line(data);
    };
    var mainLine = d3.svg.line()
            .x(function(d, i) {
                return R * (d.val / d.full) * Math.sin(i * theta);
            })
            .y(function(d, i) {
                return -R * (d.val / d.full) * Math.cos(i * theta);
            })
            .interpolate("linear");
    [0.2, 0.4, 0.6, 0.8, 1].forEach(function(ratio) {
        g.append("path").attr({
            d: raderLine(data, ratio) + " z", // close path
            stroke: "green",
            fill: "none",
            "stroke-dasharray": "5,5"
        });
    });
    // ハンドル円のドラッグイベント
    var drag = d3.behavior.drag();
    drag.on("drag", function(d, i) {
        var prev_cx = d.cx;
        var prev_cy = d.cy;
        d.cx += d3.event.dx;
        d.cy += d3.event.dy;
        d.cratio = Math.sqrt(d.cx * d.cx + d.cy * d.cy) / R; // レーダ中心までの距離の割合
        if(d.cratio > 1){　// はみ出し防止
            d.cx = prev_cx;
            d.cy = prev_cy;
            return
        }
        d3.select(this).attr({
            cx: R * d.cratio * Math.sin(d.theta),
            cy: -R * d.cratio * Math.cos(d.theta)
        });
        // レーダの線も動かす
        _.find(data, function(v){
            return v.type === d.type;
        }).val = d.cratio * 10;
        g.select(".mainline").attr("d", mainLine(data) + " z");
        customDrag(d);
    });
    drag.on("dragend", dragend);
    
    // 中心から出る放射線
    data.forEach(function(v, i) {
        g.append("path").attr({
            d: "M0,0L" + R * Math.sin(i * theta) + "," + -R * Math.cos(i * theta),
            stroke: "green",
            "stroke-width": 3,
            opacity: "0.3"
        });
    });
    // 実体データをグラフ化
    g.append("path").attr({
        class:"mainline",
        d: mainLine(data) + " z", // close path
        stroke: "green",
        "stroke-width": 3,
        fill: "yellow",
        "fill-opacity": 0.3
    });
    // legend
    g.selectAll("text").data(data).enter().append("text").text(function(d) {
        return d.text;
    }).attr("x", function(d, i) {
        return (R + 20) * Math.sin(i * theta) - this.getBBox().width / 2; // horizontal centering
    }).attr("y", function(d, i) {
        return -(R + 20) * Math.cos(i * theta);
    }).attr({
        "dominant-baseline": "middle"
    });
    
    data.forEach(function(v, i) {
        // ハンドル用に頂点に円を追加
        var cratio = v.val / 10;
        var prop = {
            cx: R * cratio * Math.sin(i * theta),
            cy: -R * cratio * Math.cos(i * theta),
            r: 6,
            full:v.full,
            cratio: cratio,
            type:v.type,
            theta:i * theta,
            idx:i
        };
        console.log(prop);
        var handleCircle = g.append("circle").datum(prop).attr({
            class: "rader-handle",
            cx: R * (v.val / 10) * Math.sin(i * theta),
            cy: -R * (v.val / 10) * Math.cos(i * theta),
            r: 6,
            cursor:"pointer",
            fill: "green"
        });
        handleCircle.call(drag);
    });
};