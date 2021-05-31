var obj1 = {};
for (let v1 = 0; v1 < 3; v1++) {
  obj1[v1] = function () {
    console.log(v1);
  };
}
obj1[0]();
obj1[1]();
obj1[2]();
