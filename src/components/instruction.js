import $ from 'jquery';
import './instruction.scss';
import { popPanel } from "./panel.js";

const text = `<div style="padding: 20px;">
  <p style="padding: 5px 10px; margin: 0">
    本游戏为战斗扫雷,
    你可以挖开低等级的雷来获得经验提升等级，如果挖到高等级的雷则会失去hp。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    左键点击紫色方块可以挖开该方块。挖开的空地会显示周围雷的合计等级。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    左键点击数字较低的空地时，可以挖开周围的八个方块。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    右键单击在紫色方块上标记你推测的雷等级吧。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    左键双击屏幕正下方的旗子图标，可以挖开所有被该旗子标记的方块。
  </p>
</div>`;
export default {
  init({selector, style}) {
    var $button = $(
      `<div class="instruction" style="${style}"><i class="fa fa-info"></i></div>`
    );
    $button.on('click', function() {
      popPanel({
        title: '游戏说明',
        content: text
      });
    });
    $(selector).append($button);
  },
};
