function isEmpty(map) {
  for(var key in map) {
    return !map.hasOwnProperty(key);
  }
  return true;
}

function css(a) {
  var sheets = document.styleSheets, o = [];
  for (var i in sheets) {
    var rules = sheets[i].rules || sheets[i].cssRules;
    for (var r in rules) {
      if (a.is(rules[r].selectorText)) {
        o.push(rules[r].style.cssText);
      }
    }
  }
  return o;
}

var createConvFunc = function(canvas){

  var ctx = canvas.getContext('2d');
  
  return function(){
    var children = canvas.children;

    for (var i = 0; i < children.length; i++){
      var elm = children[i];
      var tag = elm.tagName;
      console.log(tag);
      console.log(elm.getAttribute("x"));
      console.log(elm.textContent);

      if(tag == "TEXT"){
        
        var background = {};
        var padding= {}; 
        var x = parseInt(elm.getAttribute("x")), y = parseInt(elm.getAttribute("y"));

        var all_rule = css($(elm))[0].split(';');
        all_rule.forEach(function (elem) {
          if (elem.trim() != '') {
            var attr_value = elem.split(':');

            if (!attr_value[1]) return;

            var prop = attr_value[0].trim();
            var value = attr_value[1].trim();
            console.log(prop, value);

            if(prop == "font-size"){
              console.log(ctx.font);
              ctx.font=value + " Arial";
            }
            if(prop == "padding"){
              console.log("padding", value.replace("px",""));
              padding.top = padding.bottom = padding.right = padding.left = parseInt(value.replace("px",""));
            }
            if(prop == "background" || prop == "background-color"){
              background.color = value;
            }
          }
        });
        if(!isEmpty(background)){
          var w = ctx.measureText(elm.textContent).width;
          var h = ctx.measureText("M").width;
          console.log("w,h:", w, h);
          var _x = x;
          var _y = y;
          console.log("_y, h", _y, h);
          if(!isEmpty(padding)){
            console.log("padding", padding);
            w += padding.left + padding.right;
            h += padding.top + padding.bottom;
            _x -= padding.left;
            _y += padding.bottom;
          }
          ctx.fillStyle = background.color || ctx.fillStyle;
          console.log("_y, h", _y, h);
          console.log("fillRect", _x, _y-h, w, h);
          ctx.fillRect(_x, _y - h, w, h);
        }
        
        ctx.fillStyle = "black";
        ctx.fillText(elm.textContent,x, y);
      }
    }
  };
};


// acceptable : img, json
var loadResources = function(paths){
  var promises = paths.map(function(path){
    if(!path){
      var d = $.Deferred();
      d.resolve(null);
      return d.promise();
    }
    var ext = path.split('.').pop();
    if(ext == "png" || ext == "jpg" || ext == "svg"){
      var d = $.Deferred();
      var img = new Image();
      img.src = path;
      img.onload = function(){
        d.resolve(img);
      };
      return d.promise();
    }else if(ext == "json"){
      return $.getJSON(path);
    }
    return null;
  });
  return Promise.all(promises);
};


Vue.directive('canvas-bg', {
  // twoWay: true,
  // params: ['bg'],
  bind: function (el, binding, vnode) {
    
    // console.log(el);
    // console.log(binding);
    // console.log(vnode);
    // console.log(this);

    var canvas = el;
    var ctx = canvas.getContext('2d');
    
    var path = binding.value;
    console.log(path);

    loadResources([path]).then(function (resources) {
        ctx.drawImage(resources[0], 0, 0);
    });
    
    // var bg = vnode.data.attrs.bg;
    // var canvas = el;
    // var ctx = canvas.getContext('2d');
    //
    // var conv = createConvFunc(canvas);
    // var render = function(){
    //   ctx.clearRect(0,0,canvas.width, canvas.height);
    //   if(bg){
    //     loadResources([bg]).then(function(resources){
    //       ctx.drawImage(resources[0], 0, 0);
    //       conv();
    //     });
    //   }else{
    //     conv();
    //   }
    // };
    //
    // render();
  },

  update: function (el,binding,vnode) {
    console.log("=== update ===");

    console.log(el);
    console.log(binding);
    console.log(vnode);
    console.log(value);

    // var bg = vnode.data.attrs.bg;
    // var canvas = el;
    // var ctx = canvas.getContext('2d');
    // var conv = createConvFunc(canvas);
    //
    // var render = function(){
    //   ctx.clearRect(0,0,canvas.width, canvas.height);
    //   if(bg){
    //     loadResources([bg]).then(function(resources){
    //       ctx.drawImage(resources[0], 0, 0);
    //       conv();
    //     });
    //   }else{
    //     conv();
    //   }
    // };
    // render();
  }
});