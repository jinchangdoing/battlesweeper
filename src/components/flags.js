import $ from "jquery";
import "./flags.scss";

const $main = $('.main');
const $floatItems = $(`<div class="float-panel">
    <div class="float-items float-bombs" style="display: none;"></div>
    <div class="float-items float-flags"></div>
</div>`);
$main.append($floatItems);
const $flags = $floatItems.find(".float-flags");
const $bombs = $floatItems.find(".float-bombs");
const $showButton = $(`
  <div class="show-button" data-state="flag">
    <i class="show-button-icon fa fa-flag" style="display: none;"></i>
    <i class="show-button-icon fa fa-bomb"></i>
  </div>
`);

$showButton.on('click', function(e) {
  const state = $showButton.attr('data-state');
  const $iconF = $showButton.find('.show-button-icon.fa-flag');
  const $iconB = $showButton.find('.show-button-icon.fa-bomb');
  switch (state) {
    case 'flag':
      $flags.css('display', 'none');
      $bombs.css('display', 'flex');
      $iconF.css('display', 'inline');
      $iconB.css('display', 'none');
      $showButton.attr('data-state', 'bomb');
      break;
    case 'bomb':
      $flags.css('display', 'flex');
      $bombs.css('display', 'none');
      $iconF.css('display', 'none');
      $iconB.css('display', 'inline');
      $showButton.attr('data-state', 'flag');
      break;
  }
});

for (let i = 0; i < 9; i++) {
  const $flag = $(`<div class="float-item float-item-flag" data-name="${i + 1}">
        <div class="float-item-back-02"></div>
        <div class="float-item-back-01"></div>
        <i class="float-item-icon fa fa-flag"></i>
        <div class="float-item-name">${i + 1}</div>
        <div class="float-item-data">0</div>
    </div>`);
  $flags.append($flag);
}

for (let i = 0; i < 9; i++) {
  const $bomb = $(`<div class="float-item float-item-bomb" data-name="${i + 1}">
        <div class="float-item-back-02"></div>
        <div class="float-item-back-01"></div>
        <i class="float-item-icon fa fa-bomb"></i>
        <div class="float-item-name">${i + 1}</div>
        <div class="float-item-data">0</div>
    </div>`);
  $bombs.append($bomb);
}

export default {
  init({ selector, dblclick, style}) {
    $showButton.attr('style', style);
    $(selector).append($showButton);
    $flags.find('.float-item-flag').on('dblclick', dblclick);
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
