import "./index.scss";

import $ from "jquery";
import _ from "lodash";
import data from "./index.json";
import custom from "./components/custom";
import refresh from "./components/refresh";
//import actions from "./components/actions";
import { message,messageRemove } from "./components/message";
import flags from "./components/flags";
import playerBar from "./components/playerbar";
import instruction from "./components/instruction";
import { autoResize, fixPosition } from "./events/events";
import centerbutton from "./components/centerbutton";


var blockTemp = [];
var excuteNum = 0;
var initCounts = 1;
var firstFlag = true;
var difficulty = "normal";
var time = 0;
var inter = 0;
var maxLevel = 9;
var expRequire = [];
var playerInfo;
var gameInfo;
var mineNum = [];
var mineExp = [];
var mineFlaged = [];
var mineProportion = [];
var expMultiplier = [];
var blockList = [];
let difficultyName;
var $box = $(".box");
var $toolbar = $(".toolbar");
var $toolbarWrapper = $(".toolbar-wrapper");

//根据雷自动调节经验需求
function caculateExpreuire() {
  var expTemp = [];
  expTemp[0] = 0;
  expRequire[0] = 0;

  //先根据雷数量设置极限升级经验
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j <= i; j++) {
      expTemp[i + 1] = mineNum[j] * mineExp[j];
      if (expTemp[i + 1] === 0) {

        expTemp[i - 1] = 999999;
      }


    }
    expTemp[i + 1] += expTemp[i];
  }

  for (var k = 0; k < 9; k++) {
    expRequire[k + 1] = expTemp[k] + parseInt(mineNum[k] * mineExp[k] * expMultiplier[k]);

    if (expRequire[k + 1] > 99999) {
      maxLevel = k + 1;
      break;
    }
  }
  expRequire[9] = 999999;
}



//根据当前经验计算玩家等级
function levelUp() {
  while (playerInfo.exp >= (expRequire[playerInfo.level] - expRequire[playerInfo.level - 1])) {
    playerInfo.exp -= (expRequire[playerInfo.level] - expRequire[playerInfo.level - 1]);
    playerInfo.level++;
  }
}

function autoClick(index, i) {

  const height = gameInfo.height;
  const width = gameInfo.width;
  let n, x, y;
  let mine = blockList[index];
  let mineSum = 0;
  let mineSumTemp = 0;
  //计算周围标记以及挖开雷等级之和
  for (n = 0; n < 9; n++) {
    x = parseInt(n / 3) - 1;
    y = parseInt(n % 3) - 1;
    if (i < width && y === -1) {
      continue;
    }
    if (i > width * (height - 1) && y === 1) {
      continue;
    }
    if (i % width === 0 && x === -1) {
      continue;
    }
    if (i % width === width - 1 && x === 1) {
      continue;
    }
    if (x === 0 && y === 0) {
      continue;
    }


    mineSumTemp = (blockList[i + x + y * width].type === 'mine' && blockList[i + x + y * width].clicked === true) ? blockList[i + x + y * width].number : blockList[i + x + y * width].flag;

    mineSum += parseInt(mineSumTemp);

  }

  if (mine.type === "space" && mine.number - mineSum >= 0 && (mine.number - mineSum) <= playerInfo.level) {
    for (n = 0; n < 9; n++) {
      x = parseInt(n / 3) - 1;
      y = parseInt(n % 3) - 1;
      if (i % width === 0 && x === -1) {
        continue;
      }
      if (i % width === width - 1 && x === 1) {
        continue;
      }
      if (x === 0 && y === 0) {
        continue;
      }

      if (mine.clicked !== false) blockClick(i + x + y * width, initCounts);
    }
  }
}


// 点击事件
function blockClick(i, ver) {
  // 获取全局变量
  var width = gameInfo.width;
  var block = blockList[i];

  // 校验
  if (ver && ver != initCounts) {
    return;
  }

  if (!block) {
    return;
  }

  if (block.clicked) {
    return;
  }
  if (block.flag > playerInfo.level) {
    return;
  }

  // 标记已点击
  block.clicked = true;
  //扣除标记数
  if (block.flag) {
    mineFlaged[block.flag - 1]--;
    block.flag = 0;
  }
  //第一次点击必白
  if ((block.type !== "space" || block.number !== 0) && firstFlag) {
    initBlockData(i);
    initBlockView();
    blockClick(i, ver);
    time = 0;
    if (inter) clearInterval(inter);
    inter = setInterval(function () {
      time++;
      playerBar.updateTime(time);
    }, 1000);
    return;
  }
  firstFlag = false;

  // 打开雷

  blockTemp.push(block);


  // 点击到空白时 点击周围八格
  if (block.type === "space" && block.number === 0) {
    excuteNum++;
    setTimeout(function () {
      for (var n = 0; n < 9; n++) {
        var x = parseInt(n / 3) - 1;
        var y = parseInt(n % 3) - 1;
        if (i % width === 0 && x === -1) {
          continue;
        }
        if (i % width === width - 1 && x === 1) {
          continue;
        }
        var index = i + x + y * width;
        if (block.clicked !== false)
          blockClick(index, ver);
      }

      if (--excuteNum === 0) {
        updateTable();
      }
    }, 0);

    return;
  }
  // 点击到雷时 增加经验,扣除雷数
  if (block.type === "mine") {
    mineNum[block.number - 1]--;
    playerInfo.exp += mineExp[block.number - 1];
    message(`Exp+${mineExp[block.number - 1]}`, '#44c013');
    levelUp();
  }
  // 点击到雷时 扣除血量
  if (block.type === "mine" && block.number > playerInfo.level) {
    const damage = block.number * (block.number - playerInfo.level);
    playerInfo.hp -= damage;
    message(`Hp-${damage}`, '#a70c0c');
    $box.css("transition", "0.05s");
    $box.css("transform", "rotate(3deg)");
    setTimeout(function () {
      $box.css("transform", "rotate(-3deg)");
    }, 50);
    setTimeout(function () {
      $box.css("transform", "rotate(3deg)");
    }, 150);
    setTimeout(function () {
      $box.css("transform", "rotate(-3deg)");
    }, 200);
    setTimeout(function () {
      $box.css("transform", "rotate(3deg)");
    }, 250);
    setTimeout(function () {
      $box.css("transform", "rotate(0deg)");
    }, 300);
  }
  // 血量归零时 游戏结束
  if (playerInfo.hp <= 0) {
    gameOver();
    return;
  }


  if (
    _.reduce(
      mineNum,
      function (sum, n) {
        return sum + n;
      },
      0
    ) === 0
  ) {
    gameWin();
  }
  if (excuteNum === 0) {
    updateTable();
  }
}
//点击相应数字时挖开

function updateTable() {
  _.forEach(blockTemp, function (m) {
    m.$block.html(m.blockHtml);
  });
  blockTemp = [];
}

function gameOver() {
  message("你输了 - ^ -");
  // 结束计时器
  if (inter) {
    clearInterval(inter);
  }
  // 取消点击事件
  $(`.block`).css("pointer-events", "none");

  // 展示雷的位置
  _.filter(blockList, function (m) {
    return m.type === "mine";
  }).forEach(function (m) {
    var $dom = $(`.block[index="${m.i}"] > .block-show`);
    setTimeout(function () {
      if ($dom[0]) {
        $dom.css("display", "block");
        $dom.html(m.number);
      }
    }, 1 * m.i);
  });
}
function gameWin() {
  switch (difficulty) {
    case 'easy':
      message("害搁这挖easy那？","",1);
      break;
    case 'normal':
      message("你好像会了点啊","",1);
      break;
    case 'hard':
      message("可以可以，要不试试上难度？","",1);
      break;
    case 'extra':
      message("您就是挖雷至尊？","",1);
      break;
    case 'super':
      message("鱼哥牛逼！","",1);
      break;
    case 'custom':
      message("要不要试试100x100,4000雷？","",1);
      break;
    default:
        console.log(`这难度不对劲`,"",1);
  }
  // 结束计时器
  if (inter) {
    clearInterval(inter);
  }
  // 取消点击事件
  $(`.block > .block-mask`).each(function (i, d) {
    $(d).css("pointer-events", "none");
  });
  //////////////////
  //胜利相关动画
  //
  //
  //S
}
//更新显示数据面板
function updateInfo() {
  var infoCurremtExp = (playerInfo.level >= maxLevel) ? '-' : playerInfo.exp;
  var infoNextExp = (playerInfo.level >= maxLevel) ? '-' : (expRequire[playerInfo.level] - expRequire[playerInfo.level - 1]);
  var infoHp = (playerInfo.hp > 0) ? playerInfo.hp : 0;
  var infoFlag = [];
  playerBar.update(playerInfo.level, difficultyName, infoHp, infoCurremtExp, infoNextExp);
  for (var i = 0; i < mineFlaged.length; i++) {
    infoFlag[i] = mineNum[i] - mineFlaged[i];
  }
  flags.update(infoFlag, mineNum);
}
//游戏基本数据初始化
function initGameData() {
  const dataclone = JSON.parse(JSON.stringify(data));
  playerInfo = dataclone[difficulty].playerInfo;
  mineFlaged = dataclone.mineFlaged;
  mineExp = dataclone.mineExp;
  expMultiplier = dataclone[difficulty].gameInfo.expMultiplier;
  difficultyName = dataclone[difficulty].gameInfo.difficulty;
  mineProportion = dataclone.mineProportion;
  firstFlag = true;
  playerBar.updateMaxhp(playerInfo.hp);
  clearInterval(inter);
  playerBar.updateTime(0);



}




// 方块数据初始化
function initBlockData(safe) {

  gameInfo = JSON.parse(JSON.stringify(data[difficulty].gameInfo));
  blockList = [];
  var width = gameInfo.width;
  var height = gameInfo.height;
  var num = width * height;
  var safeList = [];
  if (safe) {
    for (var n = 0; n < 9; n++) {
      var x = parseInt(n / 3) - 1;
      var y = parseInt(n % 3) - 1;
      if (safe < width && y === -1) {
        continue;
      }
      if (safe > width * (height - 1) && y === 1) {
        continue;
      }

      if (safe % width === 0 && x === -1) {
        continue;
      }
      if (safe % width === width - 1 && x === 1) {
        continue;
      }

      const index = safe + x * width + y;
      safeList.push(index);
    }
  }

  for (var i = 0; i < 9; i++) {
    mineNum[i] = parseInt(gameInfo.mineNumTotal * mineProportion[i]);
  }
  // 填充雷
  _.forEach(mineNum, function (n, i) {
    var mine = { type: "mine", number: i + 1 };
    blockList = _.concat(blockList, _.fill(new Array(n), mine));
  });

  // 填充空格
  var space = { type: "space", number: 0 };

  blockList = _.concat(
    blockList,
    _.fill(new Array(num - blockList.length - safeList.length), space)
  );

  // 打乱顺序
  blockList = _.sortBy(blockList, function () {
    return Math.random();
  });
  //保证空白
  for (var n1 = 0; n1 < safeList.length; n1++) {
    blockList.splice(safeList[n1], 0, space);
  }

  // 计算坐标,初始化标记为0
  _.forEach(blockList, function (m, i) {
    blockList[i] = JSON.parse(JSON.stringify(m));
    var mine = blockList[i];
    mine.x = parseInt(i / width);
    mine.y = parseInt(i % width);
    mine.i = i;
    mine.flag = 0;
  });
  // 计算数值
  _.forEach(blockList, function (m, i) {
    if (m.type !== "mine") {
      return;
    }
    for (var n = 0; n < 9; n++) {
      var x = parseInt(n / 3) - 1;
      var y = parseInt(n % 3) - 1;
      if (i % width === 0 && x === -1) {
        continue;
      }
      if (i % width === width - 1 && x === 1) {
        continue;
      }

      var index = i + x + y * width;
      if (blockList[index] && blockList[index].type === "space") {
        blockList[index].number += m.number;
      }
    }
  });
}

// 页面初始化
function initBlockView() {
  const height = gameInfo.height;
  const width = gameInfo.width;
  var $blocks = $(`<div class="blocks"></div>`);
  $box.html("");
  _.forEach(blockList, function (m, i) {
    if (m.y === 0) {
      $box.append($blocks);
    }
    //
    var $block = $(`<div class="block" index="${i}">
              <div class="block-mask purple-body"></div>
              <div class="block-show red-body"></div>
              <div class="block-flag"></div>
              </div>`);
    $blocks.append($block);
    m.$block = $block;
    m.blockHtml = `
         <div class="block-${m.type}" block-num="${m.number}">
          ${m.number ? m.number : ""}
         </div>
         `;

    $block.on("click", function (e) {
      var index = $(this).attr("index");
      blockClick(parseInt(index), initCounts);
      autoClick(parseInt(index), i);
      flags.ondblclick = function (e) { };
      updateInfo();

    });

    if (m.y === width - 1) {
      $blocks = $(`<div class="blocks"></div>`);
    }
  });

  $toolbar.html(`    
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
          `);

  // 右键事件
  var targetMask;
  $(`.block > .block-mask`).on("contextmenu", function (e) {
    targetMask = e.target;
    const windowWidth = window.innerWidth;
    e.clientX = (e.clientX + 210 < windowWidth) ? e.clientX : e.clientX - 210;
    $toolbar.css("left", e.clientX + "px");
    $toolbar.css("top", e.clientY + "px");
    $toolbarWrapper.css("display", "block");

  });

  // 清除雷等级
  $(".clearflag").on("click", function () {
    if (!targetMask) {
      return;
    }
    var $block = $(targetMask.parentElement);
    var $blockFlag = $(`.block[index="${$block.attr("index")}"] > .block-flag`);
    var index = $block.attr("index");
    var mine = blockList[index];
    // 减去原有标记的等级
    if (mine.flag) {
      mineFlaged[mine.flag - 1]--;
      updateInfo();
    }
    // 取消标记等级
    mine.flag = 0;
    $blockFlag.html("");
  });

  // 标记雷等级
  $(`.setflag`).on("click", function (e) {
    if (!targetMask) {
      return;
    }
    var flagNum = $(e.target).attr("data");
    var $block = $(targetMask.parentElement);
    var index = $block.attr("index");
    var $blockFlag = $(`.block[index="${index}"] > .block-flag`);
    var mine = blockList[index];
    // 减去原有标记的等级
    if (mine.flag) {
      mineFlaged[mine.flag - 1]--;
    }
    // 标记新等级
    mine.flag = flagNum;
    $blockFlag.html(flagNum ? flagNum : "");
    mineFlaged[flagNum - 1]++;
    updateInfo();
  });
  // 展示数据
  updateInfo();
}

// 每次游戏启动调用
function init(diff) {
  initCounts++;
  difficulty = diff;
  messageRemove();
  initGameData();
  initBlockData();
  caculateExpreuire();
  initBlockView();
  fixPosition();
  autoResize();
  message(`游戏开始,等级${difficultyName}`);
}



// 进页面时调用一次

init("normal");
playerBar.init({
  selector: ".topbar",
});




// 初始化重开键
refresh.init({
  selector: ".topbar",
  // style: "top: 10px; left: calc(50% - 170px)",
  callback() {
    init(difficulty);
  },
});
centerbutton.init({
  selector: ".topbar",
  // style: "top: 10px; left: calc(50% - 220px)",
});


// 初始化自定义按钮
custom.init({
  selector: ".topbar",
  //  style: "top: 10px; left: calc(50% - 120px)",
  callback(diff, customData) {
    data.custom = customData;
    init(diff);
  },
});

// 初始化旗子标记
flags.init({
  selector: ".topbar",
  //  style: "top: 10px; left: calc(50% - 70px)",
  dblclick() {
    var $this = $(this);
    var buttonNum = parseInt($this.attr("data-name"));
    _.forEach(blockList, function (m, i) {
      if (parseInt(m.flag) === buttonNum && m.flag <= playerInfo.level)
        blockClick(i, initCounts);
    });
    updateInfo();
  },
});
instruction.init({
  selector: ".topbar",
  // style: "top: 10px; left: calc(50% - 220px)",
});

// 禁用默认右键
window.oncontextmenu = function () {
  return false;
};



// 右键工具栏点击关闭事件
$toolbarWrapper.on("click", function () {
  $toolbarWrapper.css("display", "none");
});
