import './actions.scss';
import $ from "jquery";


export default {
  init({ init, custom, selector }) {
    var $actions = $(selector);
    $actions.append(createButton("easy", "初级"));
    $actions.append(createButton("normal", "中级"));
    $actions.append(createButton("hard", "高级"));
    $actions.append(createButton("lunatic", "疯狂"));
    $actions.append(createButton("extra", "鱼"));
    $actions.append(createButtonCustom("自定义"));

    function createButton(level, text) {
      var $button = $(
        `<button class="actions-button purple-body" data-level="${level}">${text}</button>`
      );
      $button.on("click", function () {
        init($button.attr("data-level"));
      });
      return $button;
    }

    function createButtonCustom(text) {
      var $button = $(
        `<button class="actions-button purple-body" button-name="custom">${text}</button>`
      );
      $button.on("click", custom);
      return $button;
    }
  },
};

/*
function () {
    custom.open({
      callback(d) {
        data.custom = d;
        init("custom");
      },
    }
*/
