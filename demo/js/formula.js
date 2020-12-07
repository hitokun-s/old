
// 演算子だけが親ノードになれる

// 演算子がきたとき、もし焦点ノード演算子以下の強さ（優先度）ならば、
// => 同じ強さなら、自身で焦点ノードを置換する
// => 自身が弱いなら、焦点ノードから親をたどっていって最初に見つけた同じ強さのノードを置換する
// （元のノードは、自身のleft childにする）
// もし焦点ノード演算子より強ければ、
// => 焦点ノードのright childにする

// 数値がきたとき
// 焦点ノードのright child にする

var foundSameLevelNode = function(node){
  var ans;
  while(!ans && node.parent){
    if(node.parent.op == "+" || node.parent.op == "-"){
      ans = node.parent;
    }
    node = node.parent;
  }
  return ans;
}

var findRoot = function(node){
  var ans;
  while(!ans){
    if(!node.parent){
      ans = node;
    }
    node = node.parent;
  }
  return ans;
}

var replaceNode = function(oldNode, newNode){
  newNode.parent = oldNode.parent;
  newNode.left = oldNode;
  oldNode.parent = newNode;
  return newNode;
}

var findChildArray= function(arr, i){
  var leftParenthesisCount = 1;
  var rightParenthesisCount = 0;
  var newArr = [];
  for(var j = i + 1;j < arr.length;j++){
    if(arr[j] == "("){
      leftParenthesisCount++;
    }else if(arr[j] == ")"){
      rightParenthesisCount++;
    }
    if(leftParenthesisCount == rightParenthesisCount){
      return newArr;
    }
    newArr.push(arr[j]);
  }
}

var createTree = function(arr){

  console.log("createTree!", arr);
  var focusNode;

  for(var i = 0;i < arr.length;i++){
    var c = arr[i];
    var prev = arr[i - 1];
    
    if(_.contains(["+","-","*","/"], c)){
      if(prev && _.contains(["+","-","*","/"], prev)){
        throw Error;
      }
      var currentNode = {op: c};
      if(focusNode.value){
        replaceNode(focusNode, currentNode);
      }else{
        if((focusNode.op == "*" || focusNode.op == "/") && (c == "+" || c == "-")){
          var sameLevelNode = foundSameLevelNode(focusNode) || focusNode;
          replaceNode(sameLevelNode, currentNode);
        }else if((focusNode.op == "+" || focusNode.op == "-") && (c == "*" || c == "/")){
          currentNode.parent = focusNode;
          currentNode.left = focusNode.right;
          focusNode.right = currentNode;
        }else{
          replaceNode(focusNode, currentNode);
        }
      }
      focusNode = currentNode;
    }else if(c == "("){
      if(prev && !_.contains(["+","-","*","/","("], prev)){
        throw Error;
      }
      var childArr = findChildArray(arr, i);
      focusNode.right = createTree(childArr);
      i += (childArr.length + 1);
    }else{
      if(prev && !_.contains(["+","-","*","/"], prev)){
        throw Error;
      }
      var currentNode = {value: isNaN(c) ? c : parseFloat(c)};
      if(focusNode){
        focusNode.right = currentNode;
      }else{
        focusNode = currentNode
      }
    }
  }
  // find root
  console.log("-----");
  console.log("arr", arr);
  console.log("focusNode", focusNode);
  console.log("root",findRoot(focusNode));

  return findRoot(focusNode);
}

var test = "3 + 2 * ( 6 - 1 ) - 10 / 4";
//    test = "3 + 2 * 6 - 10 / 5";

var arr = test.split(" ");

console.log(createTree(arr));

var toObject = function(node){
  var res = {};
  if(node.value){
    return node.value;
  }
  res[node.op] = [toObject(node.left), toObject(node.right)];
  return res;
}

var obj = toObject(createTree(arr));
console.log(JSON.stringify(obj));

var calc = function(node){
  if(node.value){
    return node.value;
  }
  var left = calc(node.left);
  var right = calc(node.right);

  switch(node.op){
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return left / right;
  }
}

console.log("answer", calc(createTree(arr)));

var getOp = function(obj){
  return typeof obj === 'object' ? Object.keys(obj)[0] : null;
}
var isWeakThan = function(op1, op2){
  if(op1 && op2){
    return _.contains(["+", "-"], op1) && _.contains(["*", "/"], op2);
  }
  return false;
}

var isNegative = function(obj){
  if(typeof obj !== 'object' && !isNaN(obj)){
    return parseFloat(obj) < 0;
  }
  return false;
}

var decompile = function(obj){
  if(typeof obj !== 'object'){
    return obj;
  }
  var op = Object.keys(obj)[0];
  var values = obj[op];
  var left = decompile(values[0]);
  var right = decompile(values[1]);

  if(isWeakThan(getOp(values[0]), op) || isNegative(values[0])){
    left = "(" + left + ")";
  }
  if(isWeakThan(getOp(values[1]), op) || isNegative(values[1])){
    right = "(" + right + ")";
  }
  return left + op + right;
}