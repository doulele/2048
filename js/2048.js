{//创建表格
    $($('body')[0]).html('<div id="my2048"><div id="myhead"><div id="headtop"><span id="title2048">2048</span><div id="headScore"><div id="nowScore">0</div><div id="bestScore">0</div></div></div><div id="gameIntro"><span id="describe">Play 2048 Game Online</br>Join the numbers and get to the 2048 tile!</span><div id="restart">New Game</div></div></div><div id="table2048" class="addafter"><div id="tablebox"><div class="hang"><li class="item"></li><li class="item"></li><li class="item"></li><li class="item"></li></div><div class="hang"><li class="item"></li><li class="item"></li><li class="item"></li><li class="item"></li></div><div class="hang"><li class="item"></li><li class="item"></li><li class="item"></li><li class="item"></li></div><div class="hang"><li class="item"></li><li class="item"></li><li class="item"></li><li class="item"></li></div></div></div></div>');
  }
  {//table定位处理
    var jianxi = ($('#table2048')[0].offsetWidth-$('.item')[0].offsetWidth*4)/5;//获得每一行除去item后的间隙,均等分为4份
    for (let i = 0; i < 16; i++){//为每一个元素定位
      $('.item')[i].style.left = (i%4)*($('.item')[0].offsetWidth + jianxi) + 'px';
      $('.item')[i].style.top = Math.floor((i/4))*($('.item')[0].offsetWidth + jianxi) + 'px';
    }
    $('.item').css({'margin':jianxi + 'px'});//为每个item添加margin
  }
  {
    var arrNumber = [];//创建空的数字数组
    var newArray = [];//倒置数组
    var score = 0;//初始化分数
    $('#nowScore').text(score);//初始化当前的分
    $('#bestScore').text(window.localStorage.getItem('bestScore')===null? 0:window.localStorage.getItem('bestScore'));

  //随机填充数字2或者4
    var initNumber = function (num){
      var spaceArr = [];
      for(let i = 0; i < 4; i++){//遍历所有值把值为0的放在一个数组里
          for(let j = 0; j < 4; j++){
            if (arrNumber[i][j] === 0) {
              spaceArr.push(i*4+j)
            }
          }
      }
      if(spaceArr.length !== 0){//有空格就继续生成随机数字
        var randomNumber = spaceArr[Math.floor(Math.random()*spaceArr.length)];//在值为0的数组里随机选取一个
        var ranNumRow = Math.floor(randomNumber/4);//将选取的数值转换到某一行某一列
        var ranNumInd = randomNumber - ranNumRow*4;
        arrNumber[ranNumRow][ranNumInd] = num;//设置随机产生的数字所在行所在位置的值
      };
      if(spaceArr.length === 0){//没有空格且不能再合并的时候结束
        var over = true;//初始化为true
        var mapItemSame = function (arr){//判断每一个值临近的有没有相等,如果有over返回false,如果没有不操作
          for(let i = 0; i < 4; i++){
            for(let j = 0; j < 3; j++){
                if(arr[i][j]===arr[i][j+1]){
                  over = false;
                };  
            }
          }
        }
        mapItemSame(arrNumber);
        var haha = invert(arrNumber);
        mapItemSame(haha);
        over? gameOver():null;//执行游戏结束函数
      }
    }

  //初始化
    var init = function(){
      for(let i = 0; i < 4; i++){//初始化表格都是0
        arrNumber[i] = [];
        for(let j = 0; j < 4; j++){
          arrNumber[i][j] = 0; 
        }
      }
      initNumber(2);initNumber(2);initNumber(4);//初始化填充三个数
      return arrNumber;//返回填充数字的数组
    }
    init();
  }
  //渲染重绘
  var bagCor = ['#CDC1B4','#eee4da','#ede0c8','#f2b179','#f59563',"#f67c5f","#f65e3b","#edcf72","#edcc61","#edc850","#edc53f","#edc22e","#ff1c73"];
  function redraw(){
    for (let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++){
        //将数组的数填充到页面,如果是0就不填充
        $('.hang')[i].children[j].innerText = arrNumber[i][j] === 0? null:arrNumber[i][j];
        //设置文字大小,背景颜色
        var item = $($('.hang')[i].children[j]);
        var itemtext = item.text();
        item.css({'backgroundColor':bagCor[0]});//清空颜色
        var size = itemtext > 512? 30:45;//大于512改变字体大小为30
        var weight = itemtext > 512? 600:400;//大于512改变粗体
        for (let k = 0; k < bagCor.length; k++){
          if (itemtext == Math.pow(2,k)) {
            item.css({'backgroundColor':bagCor[k],'fontSize':size + 'px','fontWeight':weight})
          }
        }
      }
    }
  }
  redraw();
  {//算法
    //核心算法
      var countleft = function(arr,reverse){//向左或向上
        for(let i = 0; i < 4;i++){
          let indexI,len = arr[i].length;
          for(let j = 0; j < len; j++){
            indexI = -1;
            for(let k = j+1; k < len; k++){
              if (arr[i][k] !== 0) {
                indexI = k;
                break;
              }
            }
            if (indexI !== -1) {
              if (arr[i][j] === 0) {
                arr[i][j] = arr[i][indexI];
                arr[i][indexI] = 0;
                j-=1;
              }else if (arr[i][j] === arr[i][indexI]) {
                arr[i][j] = arr[i][j]*2;
                arr[i][indexI] = 0;
                score += arr[i][j];
                reverse? animate(j,i):animate(i,j)//是否反转过
              }
            }
          }
        }
        return arr;
      }
      var countright = function(arr,reverse){//向右或向下
        for(let i = 0; i < 4;i++){
          let indexI,len = arr[i].length;
          for(let j = len-1; j >= 0; j--){
            indexI = -1;
            for(let k = j-1; k >= 0; k--){
              if (arr[i][k] !== 0) {
                indexI = k;
                break;
              }
            }
            if (indexI !== -1) {
              if (arr[i][j] === 0) {
                arr[i][j] = arr[i][indexI];
                arr[i][indexI] = 0;
                j+=1;
              }else if (arr[i][j] === arr[i][indexI]) {
                arr[i][j] = arr[i][j]*2;
                arr[i][indexI] = 0;
                score += arr[i][j];
                reverse? animate(j,i):animate(i,j)//注意这里当上下的时候数组已经被反转了，所以i和j的值也要反转一下
              }
            }
          }
        }
        return arr;
      }
    //行列倒置函数
      var invert = function(arr){
        return arr[0].map(
          function (col, i) {         
            return arr.map(
              function (row) {              
                return row[i];     
            });
          });
      }
    //相加时动画效果
    var animate = function(level,vertical){
      $($('.hang')[level].children[vertical]).animate({//合并的时候的动画padding添加间隙的1/2,margin缩小间隙的一半,维持原地等比扩大
        padding: jianxi/2 + 'px',
        margin:jianxi/2 + 'px'
      },100);
      $($('.hang')[level].children[vertical]).animate({//合并之后动画,回到最初的位置
        padding:'0px',
        margin:jianxi + 'px'
      },100);
    }
  }
  {//键盘事件
    var verticalEventHand = function (witchCount) {
      newArray =invert(arrNumber);
      witchCount(newArray,true);
      arrNumber = invert(newArray);
    }
    var playRedraw = function (){
      initNumber(2);//点击一次添加一个数字
      redraw();//重绘
      $('#nowScore').text(score);//当前得分
      window.localStorage.getItem('bestScore')<score? window.localStorage.setItem('bestScore',score):null;
      $('#bestScore').text(window.localStorage.getItem('bestScore'));//最高得分
    }
    document.addEventListener('keydown',function(el){
      switch (el.keyCode){
        case 37:
          countleft(arrNumber);
          break;
        case 39:
          countright(arrNumber);
          break;
        case 38:
          verticalEventHand(countleft);
          break;
        case 40:
          verticalEventHand(countright);
          break;
      }
      if(el.keyCode >= 37&&el.keyCode <= 40){
        playRedraw();
      }
    })
  }
  {//Mible端滑动事件
    var hammer = new Hammer($('#table2048')[0]);//创建滑动的实例
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL});//启动所有方向的滑动
    hammer.on('swipeleft',function(){//左划
      countleft(arrNumber);
    });
    hammer.on('swiperight',function(){//右划
      countright(arrNumber);
    });
    hammer.on('swipeup',function(){//上划
      verticalEventHand(countleft);
    });
    hammer.on('swipedown',function(){//下划
      verticalEventHand(countright);
    });
    hammer.on('swipe',function(ev){//滑动的时候
      playRedraw();
    });
  }
  //结束
  var gameOver = function(){
    $('#table2048').addClass('table2048');
  };
  //重新开始
  $('#restart').click(
    function(){
      init();
      redraw();
      $('#nowScore').text(0);
      score = 0;
    }
  )