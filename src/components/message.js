import './message.scss';
import $ from 'jquery';
var $app = $('#app');
let $messageWin;
export function message(msg, color, isWin) {
  const $message = $(`<div class="message" style="left: 180px; top: -100px; opacity: 0;">
      <div class="message-content">
        ${msg}
      </div>
    </div>`);
  $app.append($message);
  setTimeout(function () {
    $message.css("top", "15px");
    $message.css("opacity", "1");
    if (color)
      $message.css("color", `${color}`);
    if (isWin)
      $messageWin = $message;
  }, 0);
  setTimeout(function () {
    if (!isWin) {
      $message.css("top", "-100px");
      $message.css("opacity", "0");

    }
  }, 2000);
  setTimeout(function () {
    if (!isWin)
      $app.remove($message);
  }, 3000);
}
export function messageRemove() {
  if ($messageWin) {
    setTimeout(function () {

      $messageWin.css("top", "-100px");
      $messageWin.css("opacity", "0");


    }, 0);
    setTimeout(function () {
      $app.remove($messageWin);
    }, 1000);
  }
}