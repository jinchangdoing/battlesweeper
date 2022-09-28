import $ from 'jquery';
import { update } from 'lodash';
import './instruction.scss';
var $info = $(
    `<div class="playerinfo">
        <div class="info-bars">
            <span class="player-level-text"></span>
        </div>
        <div class="info-bars">
            <span class="difficulty-text"></span>
        </div>
        <div class="info-bars">
            <div class="player-hpbar-outter">  
                <div class="player-hpbar-inner"></div>       
                <span class="player-hpbar-text"></span>           
            </div>
            <div class="player-expbar=outter"> 
                <div class="player-expbar-inner"></div>                                
                <span class="player-expbar-text"></span>          
            </div>
        </div>
    </div>`
  ); 
let maxHp = 0;
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
        $hp.text(`${hp}/${maxHp}`);
        const $exp=$info.find('.player-expbar-text');
        $exp.text(`${playerExp}/${nextLevelExp}`);
    },
    updateMaxhp(hp){
        maxHp=hp;

    }
  };