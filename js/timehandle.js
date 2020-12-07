var TimeHandle = function(parentSelector, opt, delegate) {
    var baseColor = opt.baseColor || "#ccff33";
    var txtColor = opt.txtColor || "black";
    var showValFontSize = opt.showValFontSize || "50px";
    var ratioPerDeg = opt.ratioPerDeg || 1;
    var base = opt.initVal || 0;
    var amount = base;
    var drag = d3.behavior.drag()
            .on("drag", function(d, i) {
                var predeg = d.deg;
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d.deg = (d.x === 0) ? 0 : parseInt(Math.atan2(d.y, d.x) * 180 / Math.PI);

                var dif = d.deg - predeg;
                if (Math.abs(dif) > 350) {
                    base = base + parseInt((dif > 0 ? -1 : 1) * 360 * ratioPerDeg);
                }
                ;
                amount = base + parseInt(d.deg * ratioPerDeg);
                
                if (amount > opt.max || amount < opt.min) {
                    amount = (amount > opt.max) ? opt.max : opt.min;
                    d3.select(".show-val").text(amount);
                    d.x -= d3.event.dx;
                    d.y -= d3.event.dy;
                    return;
                }
                d3.select(".show-val").text(amount);

                d3.select(this).attr("transform", function(d, i) {
                    return "rotate(" + d.deg + ")translate(" + opt.radius + ",0)";
                });
            });

    var svgg = d3.select(parentSelector).append("svg").attr("id", "timehandle")
            .attr({
                width: opt.width,
                height: opt.height
            }).append("g").attr("transform", "translate(" + opt.width / 2 + "," + opt.height / 2 + ")rotate(-90)");
    var big = svgg.append("circle")
            .attr({
                cx: 0,
                cy: 0,
                r: opt.radius,
                stroke: "black",
                "stroke-width": 2,
                fill: "transparent"
            });
    var smallg = svgg.append("g")
            .data([{x: opt.radius, y: 0, deg: 0}])
            .attr({
                transform: "rotate(0)translate(" + opt.radius + ",0)"
            }).call(drag);
    ;
    var textArea = svgg.append("g").attr({transform: "rotate(90)"});
    textArea.append("text")
            .attr({
                transform: "translate(0,-90)",
                "text-anchor": "middle",
                fill: txtColor,
                "font-size": "20px",
              class: "destination-year"
            }).text("Destination Year : [A.D.]");
    textArea.append("text").classed("show-val", true)
            .attr({
                "text-anchor": "middle",
                fill: txtColor,
                "font-size": showValFontSize
            }).text(amount);
    var btnArea = textArea.append("g").classed("th-btn-grp", true)
            .attr({transform: "translate(0,50)"})
            .on("mouseover", function() {
                d3.select(".btn-rect").attr("fill", "white");
            })
            .on("mouseout", function() {
                d3.select(".btn-rect").attr("fill", baseColor);
            })
            .on("click", opt.onClickHandler);
    btnArea.append("rect").classed("btn-rect", true).attr({
        width: 100,
        height: 40,
        x: -50,
        y: -20,
        rx: 20,
        ry: 20,
        fill: baseColor,
        stroke: "black",
        "stroke-width": 3
    });
    btnArea.append("text").classed("th-btn-txt", true)
            .attr({
                y: 10,
                "text-anchor": "middle",
                fill: "black",
                "font-size": "30px"
            }).text("G O");//may be 'Historip!'
    var small1 = smallg.append("circle")
            .data([{x: opt.radius, y: 0, deg: 0}])
            .attr({
                cx: 0,
                cy: 0,
                r: Math.min(opt.width, opt.height) / 2 - opt.radius - 1,
                stroke: "black",
                "stroke-width": 3,
                fill: "transparent"
            });
    var small2 = smallg.append("circle").classed("th-knob",true)
            .data([{x: opt.radius, y: 0, deg: 0}])
            .attr({
                cx: 0,
                cy: 0,
                r: Math.min(opt.width, opt.height) / 2 - opt.radius - 10,
                stroke: "black",
                "stroke-width": 3,
                fill: baseColor
            });
    this.getValue = function() {
        return amount;
    };
};


