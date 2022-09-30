import $ from 'jquery';
import './centerbutton.scss';
import { fixPosition } from "../events/events.js";

export default {
    init({selector, style}) {
      var $button = $(
        `<div class="centerbutton" style="${style}"><i class="fa fa-anchor"></i></div>`
      );
      $button.on('click', function() {
        fixPosition();
      });
      $(selector).append($button);
    },
  };