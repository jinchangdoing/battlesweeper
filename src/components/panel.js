import $ from "jquery";
import "./panel.scss";
import { message } from "./message.js";
import data from "../index.json";

const $app = $("#app");
const wrapperTemplete = `<div class="panel-wrapper">
    <div class="panel">
        <div class="panel-title"></div>
        <div class="panel-content"></div>
        <div class="panel-footer">
            <button class="panel-cancel default-button" style="margin-right: 8px">取消</button>
            <button class="panel-submit prime-button">确定</button>
        </div>
    </div>
</div>`;

export const popPanel = function ({ title, content, style, submit, showCancel = true }) {
  const $wrapper = $(wrapperTemplete);
  const $title = $wrapper.find(".panel-title");
  const $panel = $wrapper.find(".panel");
  const $content = $wrapper.find(".panel-content");
  const $cancel = $wrapper.find(".panel-cancel");
  const $submit = $wrapper.find(".panel-submit");
  $cancel.css("display", showCancel ? "block" : "none");
  $panel.attr("style", style);
  $title.text(title);
  $content.append(content);
  $panel.css("top", "-100px");
  $panel.css("opacity", "0");
  $app.append($wrapper);
  $submit.on("click", function () {
    if (submit())
      cancel();
  });
  $cancel.on("click", function () {
    cancel();
  });
  function cancel() {
    $panel.css("top", "-100px");
    $panel.css("opacity", "0");
    setTimeout(function () {
      $wrapper.remove();
    }, 200);
  }
  setTimeout(function () {
    $panel.css("top", "0");
    $panel.css("opacity", "1");
  }, 0);
};
