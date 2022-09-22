


(function(){
    var data = getDataInfo();
    var difficulty = 'normal';
    var time=0;
    var playerInfo = {
        hp: 0,
        exp: 0,
        exprequire: [],
    };
    var gameInfo = {
        width: 0,
        height: 0,
        mineNum: [],
        mineExp: [],
    };
    var firstflag=true;
    var mineList = [];
    var $app = document.querySelector('#app');
    var $actions = document.querySelector('.actions');
    var $box = document.querySelector('.box');
    var $info = document.querySelector('.info');
    var $main = document.querySelector('.main');
    var $toolbar = document.querySelector('.toolbar');
    var $toolbarWrapper = document.querySelector('.toolbar-wrapper');
    function getPlayerLevel() {
        var level = 0;
        _.forEach(playerInfo.exprequire, function(exp, i) {
            if(exp <= playerInfo.exp) {
                level = i + 1;
            }
        });
        return level;
    }
    function getNextLevelExp() {
        var nextExp = 0;
        
        nextExp=playerInfo.exprequire[getPlayerLevel()]-playerInfo.exp
        if(nextExp>10000)
            return '-';
        return nextExp
    }



    // 点击事件
    function blockClick(e) {
        var height = gameInfo.height;
        var $block = e.target.parentElement;
        var i = parseInt($block.attributes.index.value);
        var mine = mineList[i];
       $block.innerHTML = `<div class="block-${mine.type} num-${mine.number}">
       ${mine.number ? mine.number : ''}
       </div>`;
       
       // 第一次点击必白
       if((mine.type !== 'space' || mine.number !== 0)&&firstflag){
            initData();
            initView();
            
            setTimeout(function(){ 
                document.querySelector(`.block[index="${i}"] > .block-mask`).click()
            },0);
            return;    
                    
       }
       firstflag=false;
       
       
       // 点击到空白时 点击周围八格
       if(mine.type === 'space' && mine.number === 0) {
        setTimeout(function() {
            for(var n = 0; n < 9; n++) {
                var x = parseInt(n / 3) - 1;
                var y = parseInt(n % 3) - 1;
                if(i%height === 0 && x=== -1){
                   continue
                }
                if(i%height===(height-1)&&x===1){
                   continue
                }
                var index = i + x + y * height;
                
            var dom = document.querySelector(`.block[index="${index}"] > .block-mask`);
            if(dom) dom.click();
        }
        }, 10);
       }
       // 点击到雷时 扣除血量
       if(mine.type === 'mine' && mine.number > getPlayerLevel()) {
            
            playerInfo.hp -= mine.number * (mine.number - getPlayerLevel());
            $box.style.transform='rotate(3deg)'
            setTimeout(function(){
                $box.style.transform='rotate(-3deg)'
            },50)
            setTimeout(function(){
                $box.style.transform='rotate(3deg)'
            },150)
            setTimeout(function(){
                $box.style.transform='rotate(-3deg)'
            },200)
            setTimeout(function(){
                $box.style.transform='rotate(3deg)'
            },250)
            setTimeout(function(){
                $box.style.transform='rotate(0deg)'
            },300)
       }
       // 血量归零时 游戏结束
       if(playerInfo.hp <= 0) {
            gameOver();
       }

       // 点击到雷时 增加经验,扣除雷数
       if(mine.type === 'mine') {
            gameInfo.mineNum[mine.number-1]--;
            playerInfo.exp += gameInfo.mineExp[mine.number-1];
       }

       // 展示数据
       
       updateInfo();
    }
    function message(msg) {
        var message = document.createElement('div');
        message.classList.add('message');
        message.innerText = msg;
        message.style.top = '-100px';
        message.style.opacity = '0';
        $app.appendChild(message);
        setTimeout(function() {
            message.style.top = '20px';
            message.style.opacity = '1';
        }, 0);
        setTimeout(function() {
            message.style.top = '-100px';
            message.style.opacity = '0';
        }, 2000);
        setTimeout(function() {
            $app.removeChild(message);
        }, 3000);
    }

    function gameOver() {
        message('你输了 - ^ -');
        // 取消点击事件
        var doms = document.querySelectorAll(`.block > .block-mask`);
        _.forEach(doms, function(d, i){
            d.style.pointerEvents = 'none';
        })
        // 展示雷的位置
        _.filter(mineList, function(m) {
            return m.type === 'mine';
        }).forEach(function(m) {
            var dom = document.querySelector(`.block[index="${m.i}"] > .block-mask`);
            setTimeout(function() {
                if(dom) {
                    dom.innerHTML = `<div class="block-${m.type}">
                    ${m.number}
                    </div>`;
                }
            }, 1 * m.i);
        });
    }

    function updateInfo() {
           
        $info.innerHTML = `
            <table>
                <tr>
                    <th>雷等级</th>
                    <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th>    
                </tr>
                <tr>
                    <td>剩余雷数</td>
                    <td>${gameInfo.mineNum[0]}</td>
                    <td>${gameInfo.mineNum[1]}</td>
                    <td>${gameInfo.mineNum[2]}</td>
                    <td>${gameInfo.mineNum[3]}</td>
                    <td>${gameInfo.mineNum[4]}</td>
                    <td>${gameInfo.mineNum[5]}</td>
                    <td>${gameInfo.mineNum[6]}</td>
                    <td>${gameInfo.mineNum[7]}</td>
                    <td>${gameInfo.mineNum[8]}</td>   
                </tr>    
            </table>         
            
            <p>
                <span>难度:${difficulty}</span>
                <span>hp:${playerInfo.hp}</span>
                <span>升级经验:${getNextLevelExp()}</span>
                <span>等级:${getPlayerLevel()}</span>
                <span class="time">TIME: ${time}</span>
            </p>`;
    }

    // 数据初始化
    function initData() {
        playerInfo = JSON.parse(JSON.stringify(data[difficulty].playerInfo));
        gameInfo = JSON.parse(JSON.stringify(data[difficulty].gameInfo));
        mineList = [];
        firstflag=true;
        var width = gameInfo.width;
        var height = gameInfo.height;
        var num = width * height;
        var mineNum = gameInfo.mineNum;
        // 填充雷
        _.forEach(mineNum, function(n, i) {
            var mine = { type: 'mine', number: i + 1 };
            mineList = _.concat(mineList, _.fill(new Array(n), mine));
        });
        // 填充空格
        var space = { type: 'space', number: 0};
        mineList = _.concat(mineList, _.fill(new Array(num - mineList.length), space));
        // 打乱顺序
        mineList = _.sortBy(mineList, function() {
            return Math.random()
        });
        // 计算坐标
        _.forEach(mineList, function(m, i) {
            mineList[i] = JSON.parse(JSON.stringify(m));
            var mine = mineList[i];
            mine.x = parseInt(i / height);
            mine.y = parseInt(i % height);
            mine.i = i;
        });
        // 计算数值
        _.forEach(mineList, function(m, i) {
            if(m.type !== 'mine') {
                return;
            }
            for(var n = 0;n < 9; n++) {
                var x = parseInt(n / 3) - 1;
                var y = parseInt(n % 3) - 1;
                
                
                if(i%height === 0 && x=== -1){
                   continue
                }
                if(i%height===(height-1)&&x===1){
                   continue
                }
                
                
                
                var index = i + x + y * height;
                if(mineList[index] && mineList[index].type === 'space') {
                    mineList[index].number += m.number;
                }
            }
        });
    }

    // 页面初始化
    function initView() {
        var height = gameInfo.height;
        var $blocks = document.createElement('div');
        $box.innerHTML = '';
        $blocks.classList.add('blocks');
        _.forEach(mineList, function(m, i) {
            if(m.y === 0) {
                $box.appendChild($blocks);
            }
            var $block = document.createElement('div');
            var $blockMask = document.createElement('div');
            $block.classList.add('block');
            $blockMask.classList.add('block-mask');
            $block.setAttribute('index', i);
            $block.appendChild($blockMask);
            $blocks.appendChild($block);
            $blockMask.addEventListener('click', blockClick);
            if(m.y === height - 1) {
                $blocks = document.createElement('div');
                $blocks.classList.add('blocks');
            }
        });
        var $mines =document.querySelectorAll(`.block > .block-mask`);
        var targetMask;
        _.forEach($mines,function(m,i){
            m.oncontextmenu=function(e) {
                targetMask=e.target;
                $toolbar.style.left=e.clientX+'px';
                $toolbar.style.top=e.clientY+'px' ;
                $toolbarWrapper.style.display='block' ;
            }
        })
  
    
    
        
        
        $toolbar.innerHTML=`    
                <button class="flag clearflag" data="0">0</button>
                <button class="flag setflag" data="1">1</button> 
                <button class="flag setflag" data="2">2</button> 
                <button class="flag setflag" data="3">3</button> 
                <button class="flag setflag" data="4">4</button> 
                <button class="flag setflag" data="5">5</button> 
                <button class="flag setflag" data="6">6</button> 
                <button class="flag setflag" data="7">7</button> 
                <button class="flag setflag" data="8">8</button> 
                <button class="flag setflag" data="9">9</button>      
        `   
        
       
        var $clearflag = document.querySelector('.clearflag');
        $clearflag.addEventListener('click', function(e) {
            if(targetMask)
                targetMask.innerText='';
     
        });
        var $setflags = document.querySelectorAll(`.setflag`);
        _.forEach($setflags,function(s,i){
            s.addEventListener('click', function(e) {
                if(targetMask)
                targetMask.innerText=e.target.attributes.data.value;
            });
    })
        
        
        
         
        
        // 展示数据
        updateInfo();
    }
    var inter=0;
    function init(diff) {
        difficulty = diff;
        $actions.innerHTML = '';
        $actions.appendChild(createButton('easy', '初级'));
        $actions.appendChild(createButton('normal', '中级'));
        $actions.appendChild(createButton('hard', '高级'));
        $actions.appendChild(createButton('lunatic', '疯狂'));
        $actions.appendChild(createButton('extra', '鱼'));
        $actions.appendChild(createButtonZoom('up', '放大'));
        $actions.appendChild(createButtonZoom('down', '缩小'));
        initData(diff);
        initView();
        time=0;
        if(inter)
            clearInterval(inter);
        inter=setInterval(function(){
            time++;
            var $time = document.querySelector('.time');
            if($time)
                $time.innerText='TIME: '+time;
        },1000)

        message(`游戏开始, 等级${diff}`);
        function createButton(level, text) {
            var $button = document.createElement('button');
            $button.classList.add('actions-button');
            $button.innerText = text;
            $button.addEventListener('click', function(e) {
                init(level);
            });
            return $button;
        };

        var zoomList = [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0];
        var zoomLevel = 5;
        function createButtonZoom(up, text) {
            var $button = document.createElement('button');
            $button.classList.add('actions-button');
            $button.innerText = text;
            $button.addEventListener('click', function(e) {
                if(up === 'up') {
                    $main.style.transform = `scale(${zoomList[++zoomLevel]})`;
                } else {
                    $main.style.transform = `scale(${zoomList[--zoomLevel]})`;
                }
            });
            return $button;
        }
    }
    
    init('normal');
    window.oncontextmenu=function(e) {
        return false;
    }
    
    $toolbarWrapper.addEventListener('click', function(e) {
            $toolbarWrapper.style.display='none' 
     
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})()
