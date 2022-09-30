import $ from 'jquery';
import './refresh.scss';

var $box = $(".box");

export default {
  init({callback, selector, style}) {
    var $button = $(`<div class="refresh" style="${style}"><i class="fa fa-sharp fa-solid fa-rotate-right"></i></div>`);
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

