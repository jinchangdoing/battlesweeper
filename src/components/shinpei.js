import $ from 'jquery';
import './shinpei.scss';

var $box = $(".box");

export default {
  init({callback, selector}) {
    var $button = $(`<div class="shinpei">
        <div class="shinpei-01"></div>
        <div class="shinpei-02"></div>
        <div class="shinpei-03"></div>
    </div>`);
    $button.on("click", function () {
      if (callback) {
        callback();
      }
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
    $(selector).append($button);
  },
};
