// dependency : jquery, Rainbow

var getParamStr = function(map) {
    var bag = [];
    for (var k in map) {
        bag.push(k + "=" + encodeURIComponent(map[k]));
    }
    return bag.join("&");
};
var openTweet = function() {
    window.open('http://twitter.com/intent/tweet?' + getParamStr({
        url: location.href,
        via: 'hitokuns',
        tw_p: 'tweetbutton'
    }), '_blank', 'width=640,height=480,top=' + (screen.height - 640) / 2 + ',left=' + (screen.width - 480) / 2);
    return false;
};
var openFacebook = function() {
    window.open('http://www.facebook.com/plugins/like.php?' + getParamStr({
        href: location.href
    }), '_blank', 'width=640,height=30,top=' + (screen.height - 640) / 2 + ',left=' + (screen.width - 480) / 2);
    return false;
};
var showSource = function() {
    $(".src-output").show(300);
};

var deleteIndent = function(text) {
    var lines = text.split("\n");
    if (lines[0].trim().length === 0) {
        lines.shift();
    }
    ;
    var indent = lines[0].length - lines[0].trim().length;
    return lines.map(function(v) {
        return v.substr(indent);
    }).join("\n");
};

var escape = function(str) {
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    return str;
};

$(function() {
    // header construction
    $.get("component/header.html").done(function(header) {
        $("body").prepend(header);
        $(".twitter").on("click", openTweet);
        $(".facebook").on("click", openFacebook);
    });

    //wrap content in bootstrap layout syaytem
    $("#content").wrap("<div class='container'><div class='row'><div class='col-centered col-lg-10'>");

    if ($("#src-js").length === 0)
        return;

    $("<div id='btn-source'></div>").text("source").click(showSource).appendTo($("#content"));

    $("<pre id='src-html-output' class='src-output'></pre>").appendTo($("#content")).hide();
    $("<pre id='src-css-output' class='src-output'></pre>").appendTo($("#content")).hide();
    $("<pre id='src-js-output' class='src-output'></pre>").appendTo($("#content")).hide();
    
    // add link to author info
    $("#content").append("<a href='author.html'>@hitokuns</a>");

    // coloring source
    Rainbow.color(deleteIndent($("#src-html").html()), "html", function(highlighted_code) {
        $("#src-html-output").html(highlighted_code);
    });
    Rainbow.color(deleteIndent($("#src-css").text()), "css", function(highlighted_code) {
        $("#src-css-output").html(highlighted_code);
    });
    Rainbow.color(deleteIndent($("#src-js").text()), "javascript", function(highlighted_code) {
        $("#src-js-output").html(highlighted_code);
    });
});


