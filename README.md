# 2048
this is a  game
### 核心计算原理
从当前位置开始,循环检查剩余项有没有不为0的数。
如果没有不进行操作。
如果有就把此不为0项的下标保存一下,结束循环; 在剩余项有不为0的情况下
如果当前位置为0, 就把不为0项赋值给当前位置,不为0项值为0,然后i-=1重新检查
如果不为0项和当前位置的值相等,就把当前位置的值*2保存,不为0项的值为0

```javaScript
var arr0=[0,0,2,0];
var arr1=[0,2,0,0];
var arr2=[2,0,0,0];
var arr3=[2,8,4,2];
var play = function(arr){
  let indexI,len = arr.length;
  for(let i = 0; i < len; i++){
    indexI = -1;
    for(let j = i+1; j < len; j++){
      if (arr[j] !== 0) {
        indexI = j;
        break;
      }
    }
    if (indexI !== -1) {
      if (arr[i] === 0) {
        arr[i] = arr[indexI];
        arr[indexI] = 0;
        i-=1;
      }else if (arr[i] === arr[indexI]) {
        arr[i] = arr[i]*2;
        arr[indexI] = 0;
      }
    }
  }
  return arr;
}
play(arr0);
```
