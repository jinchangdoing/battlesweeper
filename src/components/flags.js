import $ from 'jquery';
import './flags.scss';

var $main = $('.main');
var $flags = $(`<div class="flags"></div>`);
var callback;
for (var i = 0; i < 9; i++) {
    var $flag = $(`<div class="flag" data-name="${i + 1}">
        <i class="fa fa-flag" aria-hidden="true">
            <div class="flag-name">${i + 1}</div>
        </i>
        <div class="flag-data">0</div>
    </div>`);
    $flags.append($flag);
}

var flags = {
    create({ dblclick }) {
        console.log($flags.find('.flag'));
        $flags.find('.flag').on('click', dblclick);


        return $flags;
    },
    update(dataList) {
        for (var i = 0; i < dataList.length; i++) {
            var $flag = $flags.find(`.flag[data-name="${i + 1}"] .flag-data`);
            $flag.html(dataList[i]);
        }
    }


};

export default flags;
