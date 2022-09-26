(function () {
  var version = 1;
  var difficulty = "normal";
  var time = 0;
  var inter = 0;
  var expRequire = [];
  var playerInfo;
  var gameInfo;
  var mineNum = [];
  var expRequire = [];
  var expTemp = [];
  var mineProportion = [0.3, 0.2, 0.165, 0.135, 0.105, 0.09, 0.06, 0.04, 0.015];
  var expMultiplier = [0.5, 0.3, 0.75, 0.875, 0.96875, 1, 1, 1, 1];
  var forceWhiteCount = 0;
  var mineList = [];
  var $app = $("#app");
  var $actions = $(".actions");
  var $box = $(".box");
  var $boxWrapper = $(".box-wrapper");
  var $info = $(".info");
  var $main = $(".main");
  var $toolbar = $(".toolbar");
  var $toolbarWrapper = $(".toolbar-wrapper");

  //根据雷自动调节经验需求\
  function caculateExpreuire() {
    expTemp[0] = 0;
    expRequire[0] = 0;
    //先根据雷数量设置极限升级经验

    for (var i = 0; i < 10; i++) {
      for (var j = 0; j <= i; j++) {
        expTemp[i + 1] = mineNum[j] * gameInfo.mineExp[j];
        if (expTemp[i + 1] === 0) {
          expTemp[i] = 999999;
        }
      }
      expTemp[i + 1] += expTemp[i];

      //expRequire[i+1]=expRequire[i+1]*expMultiplier[i];
    }

    for (var k = 0; k < 9; k++) {
      expRequire[k + 1] =
        expTemp[k] +
        parseInt(mineNum[k] * gameInfo.mineExp[k] * expMultiplier[k]);
    }
    expRequire[9] = 999999;
  }
  function getPlayerLevel() {
    var level = 0;
    _.forEach(expRequire, function (exp, i) {
      if (exp <= playerInfo.exp) {
        level = i + 1;
      }
    });
    return level;
  }
  function getNextLevelExp() {
    var nextExp = 0;
    nextExp = expRequire[getPlayerLevel()] - playerInfo.exp;
    if (nextExp > 10000) return "-";
    return nextExp;
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
    // 标记已点击
    mine.clicked = true;
    //扣除标记数
    if (mine.flag) {
      gameInfo.mineFlaged[mine.flag - 1]--;
    }

    // 第一次点击必白
    if ((mine.type !== "space" || mine.number !== 0) && forceWhiteCount == 0) {
      initData();
      initView();
      forceWhiteCount++;
      if (forceWhiteCount < 100) {
        setTimeout(function () {
          blockClick(i, ver);
        }, 0);
        return;
      }
    }

    // 打开雷
    var $block = $(`.block[index="${i}"]`);
    $block.html(`
       <div class="block-${mine.type} num-${mine.number}">
        ${mine.number ? mine.number : ""}
       </div>
       `);
    // 点击到空白时 点击周围八格
    if (mine.type === "space" && mine.number === 0) {
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
          blockClick(index, ver);
        }
      }, 50);
      return;
    }

    // 点击到雷时 扣除血量
    if (mine.type === "mine" && mine.number > getPlayerLevel()) {
      playerInfo.hp -= mine.number * (mine.number - getPlayerLevel());
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
      playerInfo.exp += gameInfo.mineExp[mine.number - 1];
    }
    // 更新展示数据
      updateInfo();
  }

  // 消息提示
  function message(msg) {
    var $message = $(`<div class="message" style="top: -100px; opacity: 0;">
            <div class="message-content">
                ${msg}
            </div>
        </div>`);
    $app.append($message);
    setTimeout(function () {
      $message.css("top", "140px");
      $message.css("opacity", "1");
    }, 0);
    setTimeout(function () {
      $message.css("top", "-100px");
      $message.css("opacity", "0");
    }, 2000);
    setTimeout(function () {
      $app.remove($message);
    }, 3000);
  }

  function messageCustom(msg) {
    var $messageWrapper = $(`
            <div class="custom-warpper">
                <div class="custom-message" style="top: -100px; opacity: 0;">
                    <span>行:</span>
                    <input class="custom-input custom-row" value="30"   oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')" />
                    <span>列:</span>
                    <input class="custom-input custom-column" value="30""  oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')" />
                    <span>雷数:</span>
                    <input class="custom-input custom-mine" value="300" oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')"  />
                    <span>HP:</span>
                    <input class="custom-input custom-hp" value="30"   oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')"  />
                    <span></span>
                    <div>
                        <button class="prime-button custom-submit">确定</button>
                        <button class="default-button custom-cancel">关闭</button>
                    </div>  
                </div>)
            </div>`);
    $app.append($messageWrapper);
    var $message = $messageWrapper.find(".custom-message");
    var $hp = $message.find(".custom-hp");
    var $mine = $message.find(".custom-mine");
    var $row = $message.find(".custom-row");
    var $column = $message.find(".custom-column");
    $messageWrapper.find(".custom-submit").on("click", function (e) {
      if (!$hp.val() || !$mine.val() || !$row.val() || !$column.val()) {
        return message("输入不合法");
      }
      if ($row.val() < 5 || $row.val() > 100) return message("行数为5-100");
      if ($column.val() < 5 || $column.val() > 100)
        return message("列数为5-100");
      if ($mine.val() > $row.val() * $column.val() * 0.4)
        return message("雷数应小于总棋盘数的40%！");
      if ($mine.val() < 10) return message("雷数至少为10");

      window.data.custom = {
        playerInfo: {
          hp: $hp.val(),
          exp: 0,
        },
        gameInfo: {
          width: $column.val(),
          height: $row.val(),
          mineExp: [1, 2, 4, 8, 16, 32, 64, 128, 256],
          mineNumTotal: $mine.val(),
          mineFlaged: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      };
      init("custom");
      $message.css("top", "-100px");
      $message.css("opacity", "0");
      setTimeout(function () {
        $messageWrapper.remove();
      }, 500);
    });

    $messageWrapper.find(".custom-cancel").on("click", function () {
      $message.css("top", "-100px");
      $message.css("opacity", "0");
      setTimeout(function () {
        $messageWrapper.remove();
      }, 500);
    });

    setTimeout(function () {
      $message.css("top", "240px");
      $message.css("opacity", "1");
    }, 0);
  }

  function gameOver() {
    message("你输了 - ^ -");
    // 结束计时器
    if (inter) {
      clearInterval(inter);
    }
    // 取消点击事件
    $(`.block > .block-mask`).each(function (i, d) {
      $(d).css("pointer-events", "none");
    });
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

  function updateInfo() {
    $info.html(`
            <table cellspacing=0>
                <tr>
                    <th>雷等级</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>    
                </tr>
                <tr>
                    <td>剩余雷数</td>
                    <td>${mineNum[0]}</td>
                    <td>${mineNum[1]}</td>
                    <td>${mineNum[2]}</td>
                    <td>${mineNum[3]}</td>
                    <td>${mineNum[4]}</td>
                    <td>${mineNum[5]}</td>
                    <td>${mineNum[6]}</td>
                    <td>${mineNum[7]}</td>
                    <td>${mineNum[8]}</td>   
                </tr>
                <tr>
                    <td>标记雷数</td>
                    <td>${gameInfo.mineFlaged[0]}</td>
                    <td>${gameInfo.mineFlaged[1]}</td>
                    <td>${gameInfo.mineFlaged[2]}</td>
                    <td>${gameInfo.mineFlaged[3]}</td>
                    <td>${gameInfo.mineFlaged[4]}</td>
                    <td>${gameInfo.mineFlaged[5]}</td>
                    <td>${gameInfo.mineFlaged[6]}</td>
                    <td>${gameInfo.mineFlaged[7]}</td>
                    <td>${gameInfo.mineFlaged[8]}</td>   
                </tr>
                <tr>
                    <th>难度</th> 
                    <th colspan="2">HP</th> 
                    <th colspan="2">等级</th> 
                    <th colspan="3">升级经验</th> 
                    <th colspan="2">TIME</th> 
                </tr>    
                <tr>
                    <td>${difficulty}</td>
                    <td colspan="2">${playerInfo.hp}</td>
                    <td colspan="2">${getPlayerLevel()}</td>
                    <td colspan="3">${getNextLevelExp()}</td>
                    <td colspan="2" class="time">${time}</td>
                </tr>    
            </table>
            `);
  }

  // 数据初始化
  function initData() {
    playerInfo = JSON.parse(JSON.stringify(data[difficulty].playerInfo));
    gameInfo = JSON.parse(JSON.stringify(data[difficulty].gameInfo));
    mineList = [];
    forceWhiteCount = 0;
    var width = gameInfo.width;
    var height = gameInfo.height;
    var num = width * height;
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
      _.fill(new Array(num - mineList.length), space)
    );
    // 打乱顺序
    mineList = _.sortBy(mineList, function () {
      return Math.random();
    });
    // 计算坐标
    _.forEach(mineList, function (m, i) {
      mineList[i] = JSON.parse(JSON.stringify(m));
      var mine = mineList[i];
      mine.x = parseInt(i / height);
      mine.y = parseInt(i % height);
      mine.i = i;
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
    var $blocks = $(`<div class="blocks"></div>`);
    $box.html("");
    _.forEach(mineList, function (m, i) {
      if (m.y === 0) {
        $box.append($blocks);
      }
      var $block = $(`<div class="block" index="${i}">
            <div class="block-mask purple-body"></div>
            <div class="block-show red-body"></div>
            <div class="block-flag"></div>
            </div>`);
      $blocks.append($block);
      $block.find(".block-mask").on("click", function (e) {
        var index = $(e.target.parentElement).attr("index");
        blockClick(parseInt(index), version);
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
    $(".clearflag").on("click", function (e) {
      if (!targetMask) {
        return;
      }
      var $block = $(targetMask.parentElement);
      var $blockFlag = $(
        `.block[index="${$block.attr("index")}"] > .block-flag`
      );
      var index = $block.attr("index");
      var mine = mineList[index];
      // 减去原有标记的等级
      if (mine.flag) {
        gameInfo.mineFlaged[mine.flag - 1]--;
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
        gameInfo.mineFlaged[mine.flag - 1]--;
      }
      // 标记新等级
      mine.flag = flagNum;
      $blockFlag.html(flagNum ? flagNum : "");
      gameInfo.mineFlaged[flagNum - 1]++;
      updateInfo();
    });
    // 展示数据
    updateInfo();
  }

  function init(diff) {
    version++;
    difficulty = diff;
    $actions.html("");
    $actions.append(createButtonReset("重新开始"));
    $actions.append(createButton("easy", "初级"));
    $actions.append(createButton("normal", "中级"));
    $actions.append(createButton("hard", "高级"));
    $actions.append(createButton("lunatic", "疯狂"));
    $actions.append(createButton("extra", "鱼"));
    $actions.append(createButtonZoom("up", "放大"));
    $actions.append(createButtonZoom("down", "缩小"));
    $actions.append(createButtonCustom("自定义"));

    initData();
    caculateExpreuire();
    initView();
    time = 0;
    if (inter) clearInterval(inter);
    inter = setInterval(function () {
      time++;
      var $time = document.querySelector(".time");
      if ($time) $time.innerText = time;
    }, 1000);

    message(`游戏开始, 等级${diff}`);
    function createButton(level, text) {
      var $button = $(
        `<button class="actions-button purple-body">${text}</button>`
      );
      $button.on("click", function (e) {
        init(level);
      });
      return $button;
    }

    function createButtonReset(text) {
      var $button = $(`
                <div class="shinpei">
                    <div class="shinpei-01"></div>
                    <div class="shinpei-02"></div>
                    <div class="shinpei-03"></div>
                </div>`);

      $button.on("click", function (e) {
        init(difficulty);
        $box.css("transition", "0s");
        $box.css("transform", "rotateY(0deg)");

        $box.css("transition", "0.25s");
        $box.css("transform", "rotateY(90deg)");

        setTimeout(function () {
          $box.css("transition", "0s");
          $box.css("transform", "rotateY(-90deg)");
          $box.css("transition", "0.25s");
          $box.css("transform", "rotateY(0deg)");
        }, 250);
      });
      return $button;
    }
    function createButtonCustom(text) {
      var $button = $(
        `<button class="actions-button purple-body">${text}</button>`
      );
      $button.on("click", function (e) {
        messageCustom();
      });
      return $button;
    }

    function createButtonZoom(up, text) {
      var $button = $(
        `<button class="actions-button purple-body">${text}</button>`
      );
      $button.on("click", function (e) {
        if (up === "up") {
          $boxWrapper.css("transform", `scale(${zoomList[++zoomLevel]})`);
        } else {
          $boxWrapper.css("transform", `scale(${zoomList[--zoomLevel]})`);
        }
        if (zoomLevel < 0) zoomLevel = 0;
        if (zoomLevel >= zoomList.length) zoomLevel = zoomList.length - 1;
      });
      return $button;
    }
  }
  init("normal");

  // 禁用默认右键
  window.oncontextmenu = function (e) {
    return false;
  };
  // 缩放事件
  var zoomList = [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0];
  var zoomLevel = 5;
  $(window).on("wheel", function (e) {
    if (e.originalEvent.deltaY > 0) {
      $boxWrapper.css("transform", `scale(${zoomList[--zoomLevel]})`);
    } else {
      $boxWrapper.css("transform", `scale(${zoomList[++zoomLevel]})`);
    }
    if (zoomLevel < 0) zoomLevel = 0;
    if (zoomLevel >= zoomList.length) zoomLevel = zoomList.length - 1;
  });

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

  function onMouseMove(e) {
    $box.css("left", `${mx - cx + e.clientX}px`);
    $box.css("top", `${my - cy + e.clientY}px`);
  }

  // 右键工具栏点击关闭事件
  $toolbarWrapper.on("click", function (e) {
    $toolbarWrapper.css("display", "none");
  });
})();
