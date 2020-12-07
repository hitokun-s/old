var Grad = function(elm) {
    var duration = 2000; // expected time(ms) to destination state
    var distance = 0; // difference between start and end(dest)
    var num = 0;
    var start = 0;
    var dest = 0;
    var laststamp;
    var callback;

    var exec = function(timestamp) {
        timestamp = timestamp || 0;
        laststamp = laststamp || timestamp; //important when multiple Grad instances are created
        var t = timestamp - laststamp; //ms
        var c = parseInt(t * distance / duration);
        if (c !== 0) {
            console.log("------------");
            num += c;
            if (Math.abs(num - start) > Math.abs(distance)) {
                elm.text(dest);
                if(callback)callback();
//                cancelAnimationFrame(requestID);
                return;
            }
            elm.text(num);
            laststamp = timestamp;
        }
        requestAnimationFrame(exec);
    }
    this.start = function(opt) {
        callback = opt.callback;
        dest = opt.dest;
        start = opt.start || parseInt(elm.text()) || start;
        num = start;
        distance = dest - num;
        exec();
    };
};