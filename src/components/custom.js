import $ from "jquery";
import "./custom.scss";
import { message } from "./message.js";
import data from "../index.json";

var $app = $('#app');
var $wrapper = $(`<div class="custom-warpper">
  <div class="custom-message" style="top: -100px; opacity: 0;">
    <span>难度:</span>
    <div class="custom-radio-group">
      <div name="easy" class="custom-radio" data-check="1">简单</div>
      <div name="normal" class="custom-radio">普通</div>
      <div name="hard" class="custom-radio">困难</div>
      <div name="lunatic" class="custom-radio">疯狂</div>
      <div name="extra" class="custom-radio">鱼</div>
      <div name="custom" class="custom-radio">自制</div>
    </div>
    <span>行:</span>
    <input class="custom-input custom-row" value="16" disabled  oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')" />
    <span>列:</span>
    <input class="custom-input custom-column" value="14" disabled oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')" />
    <span>雷数:</span>
    <input class="custom-input custom-mine" value="48" disabled oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')"  />
    <span>HP:</span>
    <input class="custom-input custom-hp" value="5"  disabled oninput="value=value.startsWith('0')?'':value.replace(/[^\\d]/g,'').replace(/^0/g,'')"  />
    <span></span>
    <div class="custom-button-group">
    </div>  
  </div>
</div>`);
$wrapper.css("display", "none");
$app.append($wrapper);
var $content = $wrapper.find(".custom-message");
var $radios = $wrapper.find(".custom-radio");
var $buttons = $wrapper.find(".custom-button-group");
var $inputs = $wrapper.find(".custom-input");
var $hp = $content.find(".custom-hp");
var $mine = $content.find(".custom-mine");
var $row = $content.find(".custom-row");
var $column = $content.find(".custom-column");

$radios.on("click", function (e) {
  var $radio = $(e.currentTarget);
  var name = $radio.attr("name");
  var playerInfo = data[name] && data[name].playerInfo;
  var gameInfo = data[name] && data[name].gameInfo;

  $hp.val(playerInfo && playerInfo.hp);
  $mine.val(gameInfo && gameInfo.mineNumTotal);
  $row.val(gameInfo && gameInfo.height);
  $column.val(gameInfo && gameInfo.width);

  $radios.attr("data-check", "0");
  $radio.attr("data-check", "1");
  if (name === "custom") {
    $inputs.removeAttr("disabled");
  } else {
    $inputs.attr("disabled", "true");
  }
});

function verify() {
  if (!$hp.val() || !$mine.val() || !$row.val() || !$column.val()) {
    return message("输入不合法");
  }
  if ($row.val() < 5 || $row.val() > 100) {
    return message("行数为5-100");
  }
  if ($column.val() < 5 || $column.val() > 100) {
    return message("列数为5-100");
  }
  if ($mine.val() > $row.val() * $column.val() * 0.4) {
    return message("雷数应小于总棋盘数的40%！");
  }
  if ($mine.val() < 10) {
    return message("雷数至少为10");
  }
}

function custom(callback) {
  var $submit = $('<button class="prime-button custom-submit">确定</button>');
  var $cancel = $('<button class="default-button custom-cancel">关闭</button>');
  $submit.on("click", function () {
    var data = {
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
    if (callback) {
      const diff = $(`.custom-message .custom-radio[data-check="1"]`).attr('name');
      verify();
      callback(diff, data);
    }
    $content.css("top", "-100px");
    $content.css("opacity", "0");
    setTimeout(function () {
      $wrapper.css("display", "none");
    }, 500);
  });

  $cancel.on("click", function () {
    $content.css("top", "-100px");
    $content.css("opacity", "0");
    setTimeout(function () {
      $wrapper.css("display", "none");
    }, 500);
  });

  $buttons.html("");
  $buttons.append($submit);
  $buttons.append($cancel);
  $wrapper.css("display", "block");
  setTimeout(function () {
    $content.css("top", "140px");
    $content.css("opacity", "1");
  }, 0);
}

export default {
  // 初始化
  init({ selector, callback }) {
    var $button = $(`<div class="game-start">开始游戏</div>`);
    $button.on("click", function () {
      custom(callback);
    });
    $(selector).append($button);
  },
  // 展开表单
  open({ callback }) {
    custom(callback);
  },
};
