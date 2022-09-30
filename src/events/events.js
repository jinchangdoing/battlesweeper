import $ from "jquery";


const $main =$('.main');
const $boxWrapper =$('.box-wrapper');
const $box =$('.box');
const $topBar =$('.topbar');
let zoomLevel = 1;
export const autoResize = function(e){
    

    const windowHeight = window.innerHeight-140;
    const windowWidth = window.innerWidth-60;   
    const boxWidth=$box.width();
    const boxHeight=$box.height();
    let widthPerportion = windowWidth/boxWidth;
    let heightPerportion = windowHeight/boxHeight;
    let perportion =Math.min(widthPerportion,heightPerportion);
    perportion =Math.min(perportion,2.0);
    perportion =Math.max(perportion,0.95);
    $boxWrapper.css("transform", `scale(${perportion})`);
  /*  const windowTopHeight = window.innerHeight-800;
    const windowTopWidth = window.innerWidth-300;  
    const topBarWidth=$topBar.width();
    const topBarHeight=$topBar.height();
    widthPerportion = windowTopWidth /topBarWidth;
    heightPerportion = windowTopHeight/topBarHeight;
    perportion =Math.min(widthPerportion,heightPerportion);
    perportion =Math.min(perportion,2.0);
    perportion =Math.max(perportion,1);
    $topBar.css("transform", `scale(${perportion})`);
   */   
    

};
export const fixPosition=function(){
  $box.css("left", `0`);
  $box.css("top", `0`);
  cx = 0;
  cy = 0;
  mx = 0;
  my = 0;
};


// 鼠标拖拽事件
let cx = 0,
  cy = 0,
  mx = 0,
  my = 0;
$main.on("mousedown", function (e) {
  if (e.button !== 1) {
    return;
  }
  cx = e.clientX;
  cy = e.clientY;
  $main.on("mousemove", onMouseMove);
});

$main.on("mouseup", function (e) {
  if (e.button !== 1) {
    return;
  }
  mx = mx - cx + e.clientX;
  my = my - cy + e.clientY;
  $main.off("mousemove", onMouseMove);

  if (!$(e.target).is(".block-mask")) {
    return;
  }
  if (Math.abs(e.clientX - cx) > 5 || Math.abs(e.clientY - cy > 5)) {
    return;
  }
});

let mouseMoveTime = 0;
function onMouseMove(e) {
  const time = new Date().getTime();
  if (mouseMoveTime > time) {
    return;
  }
  mouseMoveTime = time + 25;

  $box.css("left", `${mx - cx + e.clientX}px`);
  $box.css("top", `${my - cy + e.clientY}px`);
}




window.onresize = autoResize;
window.onload = autoResize;