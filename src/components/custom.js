import $ from "jquery";
import "./custom.scss";
import { message } from "./message.js";
import { popPanel } from "./panel.js";
import data from "../index.json";

var $customForm = $(`
  <div class="custom-form">
    <span>难度:</span>
    <div class="custom-radio-group">
      <div name="easy" class="custom-radio" data-check="1">简单</div>
      <div name="normal" class="custom-radio">普通</div>
      <div name="hard" class="custom-radio">困难</div>
      <div name="lunatic" class="custom-radio">疯狂</div>
      <div name="extra" class="custom-radio">终极</div>
      <div name="super" class="custom-radio custom-radio-fish">鱼</div>
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
  </div>`);
var $radios = $customForm.find(".custom-radio");
var $inputs = $customForm.find(".custom-input");
var $hp = $customForm.find(".custom-hp");
var $mine = $customForm.find(".custom-mine");
var $row = $customForm.find(".custom-row");
var $column = $customForm.find(".custom-column");

function changeRadio(e) {
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
}

function verify() {
  if (!$hp.val() || !$mine.val() || !$row.val() || !$column.val()) {
    message("输入不合法");
    
  }
  if ($row.val() < 5 || $row.val() > 100) {
    message("行数为5-100");
    return false;
  }
  if ($column.val() < 5 || $column.val() > 100) {
    message("列数为5-100");
    return false;
  }
  if ($mine.val() > $row.val() * $column.val() * 0.4) {
    message("雷数应小于总棋盘数的40%！");
    return false;
  }
  if ($mine.val() < 10) {
    message("雷数至少为10");
    return false;
  }
  return true;
}

export default {
  // 初始化
  init({ selector, callback, style }) {
    var $button = $(
      `<div class="game-start" style="${style}"><i class="fa fa-cogs"></i></div>`
    );
    $button.on("click", function () {
      $radios.on("click", changeRadio);
      popPanel({
        title: '开始游戏',
        content: $customForm,
        submit() {
          const diff = $(`.custom-form .custom-radio[data-check="1"]`).attr(
            "name"
          );
          const data = {
            playerInfo: {
              hp: $hp.val(),
              exp: 0,
              level:1
            },
            gameInfo: {
              difficulty:"自定义",
              winMessage: "要不要试试100x100,4000雷？",
              expMultiplier: [0.5, 0.3, 0.75, 0.875, 0.96875, 0.958, 0.95, 1, 1],
              width: $column.val(),
              height: $row.val(),
              mineExp: [1, 2, 4, 8, 16, 32, 64, 128, 256],
              mineNumTotal: $mine.val(),
              mineFlaged: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
          };
          if (callback&&verify()) {
            
            callback(diff, data);
            return true;
          }
        },
      });
    });
    $(selector).append($button);
  },
};
