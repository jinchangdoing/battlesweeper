import './message.scss';
import $ from 'jquery';
const $app = $('#app');
let $messageStay;
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
      $messageStay = $message;
  }, 0);
  setTimeout(function () {
    if (!stay) {
      $message.css("top", "-100px");
      $message.css("opacity", "0");

    }
  }, 2000);
  setTimeout(function () {
    if (!stay){  
      console.log(1);
      $message.remove();
    }    
  }, 3000);
};

export function messageRemove() {
  if ($messageStay) {
    setTimeout(function () {

      $messageStay.css("top", "-100px");
      $messageStay.css("opacity", "0");


    }, 0);
    setTimeout(function () {
      $messageStay.remove();
    }, 1000);
  }
}