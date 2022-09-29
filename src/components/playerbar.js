import $ from 'jquery';
import { update } from 'lodash';
import './playerbar.scss';
var $info = $(
    `<div class="player-bar">
        <div class="info-bar">
            <span class="player-level-text"></span>
        </div>
        <div class="info-bar">
            <span class="difficulty-text"></span>
        </div>
        <div class="info-bars">
            <div class="player-bar-outter">  
                <div class="player-hpbar-inner"></div>
                <div class="player-bar-span"><span class="player-hpbar-text"></span></div>     
                         
            </div>
            <div class="player-bar-outter"> 
                <div class="player-expbar-inner"></div>
                <div class="player-bar-span"><span class="player-expbar-text"></span></div>                                 
                          
            </div>
        </div>
        <div class="timer">
            <span class="timer-text">Time:0</span>
        </div>
        <div class="result"></div>
    </div>`
  ); 
let maxHp = 0;
const $time=$info.find('.timer-text');
export default {
    init({selector, style}) {
      $info.attr('style',style);    
      $(selector).append($info);
      
      
    },
    update(playerLevel,difficulty,hp,playerExp,nextLevelExp) {
        const $playerLevel=$info.find('.player-level-text');
        $playerLevel.text(`Lv: ${playerLevel}`);
        const $difficulty=$info.find('.difficulty-text');
        $difficulty.text(`难度: ${difficulty}`);
        const $hp=$info.find('.player-hpbar-text');
        $hp.text(`HP:${hp}/${maxHp}`);
        const $exp=$info.find('.player-expbar-text');
        $exp.text(`EXP:${playerExp}/${nextLevelExp}`);
        const $hpbar=$info.find('.player-hpbar-inner'); 
        $hpbar.width(`${100*hp/maxHp}%`);  
        const $expbar=$info.find('.player-expbar-inner');
        if(nextLevelExp==='-') 
            $expbar.width(`100%`);
        else 
            $expbar.width(`${100*playerExp/nextLevelExp}%`);

    },
    updateMaxhp(hp){
        maxHp=hp;

    },
    updateTime(time){
        $time.text(`Time: ${time}`);
    }
  };