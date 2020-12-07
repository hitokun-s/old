var LinkedList = function() {
    var start, end;
    this.length = 0;
    this.add = function(data) {
        if (!start) {
            start = {data: data};
            end = start;
        } else {
            var prev;
            prev = end;
            end = {data: data};
            prev.next = end;
        }
        ;
        this.length++;
    };
    this.map = function(fn) {
        var elm = start;
        while (elm) {
            fn(elm.data);
            elm = elm.next;
        }
        ;
    };
};
