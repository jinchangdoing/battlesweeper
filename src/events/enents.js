import $ from "jquery";



const $boxWrapper =$('.box');
let zoomLevel = 1;
export const autoResize = function(e){
    

    const windowHeight = window.innerHeight-120;
    const windowWidth = window.innerWidth-60;  
    const boxWidth=$boxWrapper.width();
    const boxHeight=$boxWrapper.height();
    const widthPerportion = windowWidth/boxWidth;
    const heightPerportion = windowHeight/boxHeight;
    let perportion =Math.min(widthPerportion,heightPerportion);
    perportion =Math.min(perportion,2.0);
    perportion =Math.max(perportion,1);
    $boxWrapper.css("transform", `scale(${perportion})`);
    
      
    

};
window.onresize = autoResize;
window.onload = autoResize;