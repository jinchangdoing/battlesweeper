import $ from "jquery";
import "./flags.scss";

const $floatItems = $(`<div class="float-panel">
    <div class="float-items float-bombs"></div>
    <div class="float-items float-flags"></div>
</div>`);
const $flags = $floatItems.find(".float-flags");
const $bombs = $floatItems.find(".float-bombs");

for (let i = 0; i < 9; i++) {
  const $flag = $(`<div class="float-item float-item-flag" data-name="${i + 1}">
        <div class="float-item-back-02"></div>
        <div class="float-item-back-01"></div>
        <i class="float-item-icon fa fa-flag" aria-hidden="true"></i>
        <div class="float-item-name">${i + 1}</div>
        <div class="float-item-data">0</div>
    </div>`);
  $flags.append($flag);
}

for (let i = 0; i < 9; i++) {
  const $bomb = $(`<div class="float-item float-item-bomb" data-name="${i + 1}">
        <div class="float-item-back-02"></div>
        <div class="float-item-back-01"></div>
        <i class="float-item-icon fa fa-bomb" aria-hidden="true"></i>
        <div class="float-item-name">${i + 1}</div>
        <div class="float-item-data">0</div>
    </div>`);
  $bombs.append($bomb);
}

export default {
  init({ selector, dblclick }) {
    $(selector).append($floatItems);
    $flags.find(".float-item-flag").on("dblclick", dblclick);
  },
  update(dataList, bombList) {
    if (dataList)
      for (let i = 0; i < dataList.length; i++) {
        const $flag = $flags.find(`.float-item-flag[data-name="${i + 1}"] .float-item-data`);
        $flag.html(dataList[i]);
      }
    if (bombList)
      for (let i = 0; i < bombList.length; i++) {
        const $bomb = $bombs.find(`.float-item-bomb[data-name="${i + 1}"] .float-item-data`);
        $bomb.html(bombList[i]);
      }
  },
};
