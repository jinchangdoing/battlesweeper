import './message.scss';
import $ from 'jquery';
var $app = $('#app');
let $messageWin;
export const message = function ({ msg,style,contentStyle,stay = false }){
  const $message = $(`<div class="message" style="${style}">
      <div class="message-content" style="${contentStyle}">
        ${msg}
      </div>
    </div>`);
  $app.append($message);
  setTimeout(function () {
    $message.css("top", "15px");
    $message.css("opacity", "1");
    if (stay)
      $messageWin = $message;
  }, 0);
  setTimeout(function () {
    if (!stay) {
      $message.css("top", "-100px");
      $message.css("opacity", "0");

    }
  }, 2000);
  setTimeout(function () {
    if (!stay)
      $app.remove($message);
  }, 3000);
};

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