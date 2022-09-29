import "./index.scss";

import $ from "jquery";
import _, { min, update } from "lodash";
import data from "./index.json";
import custom from "./components/custom";
import shinpei from "./components/shinpei";
//import actions from "./components/actions";
import { message } from "./components/message";
import flags from "./components/flags";
import playerBar from "./components/playerbar";
import instruction from "./components/instruction";
import { autoResize } from "./events/enents.js";


var blockTemp = [];
var excuteNum = 0;
var version = 1;
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
var mineList = [];
var $box = $(".box");
var $info = $(".info");
var $main = $(".main");
var $toolbar = $(".toolbar");
var $toolbarWrapper = $(".toolbar-wrapper");
var $codeVersion = $(".version");

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
      console.log('aaa', maxLevel);
      break;
    }
  }
  expRequire[9] = 999999;
}
//根据当前经验计算玩家等级
function levelUp() {
  while(playerInfo.exp >= (expRequire[playerInfo.level] - expRequire[playerInfo.level - 1])){
    playerInfo.exp -= (expRequire[playerInfo.level] - expRequire[playerInfo.level - 1]);
    // console.log(playerInfo.exp);
    playerInfo.level++;
  }
}

// 点击事件
function blockClick(i, ver) {
  // 获取全局变量
  var height = gameInfo.height;
  var mine = mineList[i];

  // 校验
  if (ver && ver != version) {
    return;
  }

  if (!mine) {
    return;
  }

  if (mine.clicked) {
    return;
  }
  if (mine.flag > playerInfo.level) {
    return;
  }

  // 标记已点击
  mine.clicked = true;
  //扣除标记数
  if (mine.flag) {
    mineFlaged[mine.flag - 1]--;
  }
  //第一次点击必白
  if ((mine.type !== "space" || mine.number !== 0) && firstFlag) {
    initData(i);
    initView();
    blockClick(i, ver);
    return;
  }
  firstFlag = false;

  // 打开雷

  blockTemp.push(mine);
  // mine.$block.html(mine.blockHtml);

  // 点击到空白时 点击周围八格
  if (mine.type === "space" && mine.number === 0) {
    excuteNum++;
    setTimeout(function () {
      for (var n = 0; n < 9; n++) {
        var x = parseInt(n / 3) - 1;
        var y = parseInt(n % 3) - 1;
        if (i % height === 0 && x === -1) {
          continue;
        }
        if (i % height === height - 1 && x === 1) {
          continue;
        }
        var index = i + x + y * height;
        if (mineList[i].clicked !== false) blockClick(index, ver);
      }

      if (--excuteNum === 0) {
        updateTable();
      }
    }, 0);

    return;
  }

  // 点击到雷时 扣除血量
  if (mine.type === "mine" && mine.number > playerInfo.level) {
    playerInfo.hp -= mine.number * (mine.number - playerInfo.level);
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
  }
  // 点击到雷时 增加经验,扣除雷数
  if (mine.type === "mine") {
    mineNum[mine.number - 1]--;
    playerInfo.exp += mineExp[mine.number - 1];
    levelUp();
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
  _.filter(mineList, function (m) {
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
  message("您就是挖雷至尊？");
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
  playerBar.update(playerInfo.level, difficulty, infoHp, infoCurremtExp, infoNextExp);
  flags.update(mineFlaged, mineNum);
}

// 数据初始化
function initData(safe) {
  playerInfo = JSON.parse(JSON.stringify(data[difficulty].playerInfo));
  gameInfo = JSON.parse(JSON.stringify(data[difficulty].gameInfo));
  mineExp = data.mineExp;
  mineFlaged = JSON.parse(JSON.stringify(data.mineFlaged));
  expMultiplier = data.expMultiplier;
  mineProportion = data.mineProportion;
  mineList = [];
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

      if (safe % height === 0 && x === -1) {
        continue;
      }
      if (safe % height === height - 1 && x === 1) {
        continue;
      }

      var index = safe + x * height + y;
      safeList.push(index);
    }
  }

  for (var i = 0; i < 9; i++) {
    mineNum[i] = parseInt(gameInfo.mineNumTotal * mineProportion[i]);
  }
  // 填充雷
  _.forEach(mineNum, function (n, i) {
    var mine = { type: "mine", number: i + 1 };
    mineList = _.concat(mineList, _.fill(new Array(n), mine));
  });

  // 填充空格
  var space = { type: "space", number: 0 };

  mineList = _.concat(
    mineList,
    _.fill(new Array(num - mineList.length - safeList.length), space)
  );

  // 打乱顺序
  mineList = _.sortBy(mineList, function () {
    return Math.random();
  });
  //保证空白
  for (var n1 = 0; n1 < safeList.length; n1++) {
    mineList.splice(safeList[n1], 0, space);
  }

  // 计算坐标,初始化标记为0
  _.forEach(mineList, function (m, i) {
    mineList[i] = JSON.parse(JSON.stringify(m));
    var mine = mineList[i];
    mine.x = parseInt(i / height);
    mine.y = parseInt(i % height);
    mine.i = i;
    mine.flag = 0;
  });
  // 计算数值
  _.forEach(mineList, function (m, i) {
    if (m.type !== "mine") {
      return;
    }
    for (var n = 0; n < 9; n++) {
      var x = parseInt(n / 3) - 1;
      var y = parseInt(n % 3) - 1;
      if (i % height === 0 && x === -1) {
        continue;
      }
      if (i % height === height - 1 && x === 1) {
        continue;
      }

      var index = i + x + y * height;
      if (mineList[index] && mineList[index].type === "space") {
        mineList[index].number += m.number;
      }
    }
  });


}

// 页面初始化
function initView() {
  var height = gameInfo.height;
  var width = gameInfo.width;
  var $blocks = $(`<div class="blocks"></div>`);
  $box.html("");
  $box.css("left", `0px`);
  $box.css("top", `0px`);




  _.forEach(mineList, function (m, i) {
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
      blockClick(parseInt(index), version);
      var n, x, y;
      var mine = mineList[index];
      var mineSum = 0;
      var mineSumTemp = 0;
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
        if (i % height === 0 && x === -1) {
          continue;
        }
        if (i % height === height - 1 && x === 1) {
          continue;
        }
        if (x === 0 && y === 0) {
          continue;
        }
        mineSumTemp = mineList[i + x + y * height] === 'mine' ? mineList[i + x + y * height].number : mineList[i + x + y * height].flag;
        console.log(mineSumTemp);
        mineSum += parseInt(mineSumTemp);
      }
      console.log(mine.number,mineSum);
      if (mine.type === "space" && mine.number - mineSum >= 0 && (mine.number - mineSum) <= playerInfo.level) {
        for (n = 0; n < 9; n++) {
          x = parseInt(n / 3) - 1;
          y = parseInt(n % 3) - 1;
          if (i % height === 0 && x === -1) {
            continue;
          }
          if (i % height === height - 1 && x === 1) {
            continue;
          }
          if (x === 0 && y === 0) {
            continue;
          }

          if (mine.clicked !== false) blockClick(i + x + y * height, version);
        }
      }

      flags.ondblclick = function (e) { };

      updateInfo();
      // updateBlock();
    });

    if (m.y === height - 1) {
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
    var mine = mineList[index];
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
    var mine = mineList[index];
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
  version++;
  firstFlag = true;
  difficulty = diff;
  initData();
  playerBar.updateMaxhp(playerInfo.hp);
  caculateExpreuire();
  initView();
  autoResize();
  console.log(111);
  time = 0;
  if (inter) clearInterval(inter);
  inter = setInterval(function () {
    time++;
    var $time = document.querySelector(".time");
    if ($time) $time.innerText = time;
  }, 1000);

  message(`游戏开始, 等级${diff}`);
}
// 进页面时调用一次
init("normal");
playerBar.init({
  selector: ".topbar",
});


instruction.init({
  selector: ".topbar",
  // style: "top: 10px; left: calc(50% - 220px)",
});

// 初始化重开键
shinpei.init({
  selector: ".topbar",
  // style: "top: 10px; left: calc(50% - 170px)",
  callback() {
    init(difficulty);
  },
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
    _.forEach(mineList, function (m, i) {
      if (parseInt(m.flag) === buttonNum && m.flag <= playerInfo.level)
        blockClick(i, version);
    });
    updateInfo();
  },
});

// 禁用默认右键
window.oncontextmenu = function () {
  return false;
};

// 鼠标拖拽事件
var cx = 0,
  cy = 0,
  mx = 0,
  my = 0;
$main.on("mousedown", function (e) {
  if (e.button !== 1) {
    return;
  }
  cx = e.clientX;
  cy = e.clientY;
  $main.on("mousemove", onMouseMove);
});

$main.on("mouseup", function (e) {
  if (e.button !== 1) {
    return;
  }
  mx = mx - cx + e.clientX;
  my = my - cy + e.clientY;
  $main.off("mousemove", onMouseMove);

  if (!$(e.target).is(".block-mask")) {
    return;
  }
  if (Math.abs(e.clientX - cx) > 5 || Math.abs(e.clientY - cy > 5)) {
    return;
  }
});

let mouseMoveTime = 0;
function onMouseMove(e) {
  const time = new Date().getTime();
  if (mouseMoveTime > time) {
    return;
  }
  mouseMoveTime = time + 50;

  $box.css("left", `${mx - cx + e.clientX}px`);
  $box.css("top", `${my - cy + e.clientY}px`);
}

// 右键工具栏点击关闭事件
$toolbarWrapper.on("click", function () {
  $toolbarWrapper.css("display", "none");
});
