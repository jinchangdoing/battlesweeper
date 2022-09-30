import $ from 'jquery';
import './instruction.scss';
import { popPanel } from "./panel.js";

const text = `<div style="padding: 20px;">
  <p style="padding: 5px 10px; margin: 0">
    本游戏为战斗扫雷,紫色为未挖开块，红色方块为雷，白色为普通块。
    你可以挖开和你当前等级相同或较低等级的雷来获得经验提升等级，如果挖到高等级的雷则会失去hp。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    左键点击紫色方块可以挖开该方块。挖开的空地会显示周围雷的等级之合。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    右键单击在紫色方块上标记你推测的雷等级吧。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    当一个白色色数字与周围所有已知雷等级之和(包含已被标记或挖开)的差小于等于你的等级时，你可以直接点击该数字展开周围所有未被标记的方块。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    左键双击屏幕正下方的旗子图标，可以挖开所有被该旗子标记的方块。
  </p>
  <p style="padding: 5px 10px; margin: 0">
    版本1.0.2
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
        content: text,
        submit(){
          return true;
        },
        showCancel:false
      });
    });
    $(selector).append($button);
  },
};
