import './message.scss';
import $ from 'jquery';
var $app = $('#app');

export function message(msg) {
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
  