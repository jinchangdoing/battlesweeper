import $ from "jquery";



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




window.onresize = autoResize;
window.onload = autoResize;