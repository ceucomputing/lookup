import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'excel-formula/dist/excel-formula.min';
import 'jexcel/dist/css/jquery.jexcel.css';
import './styles/index.scss';
import $ from 'jquery/dist/jquery';
import bootbox from 'bootbox/bootbox.min'
import formulajs from '@handsontable/formulajs/dist/formula';
import Countdown from './Countdown';

global.jQuery = $;
require('jexcel/dist/js/jquery.jexcel');

global.VLOOKUP = function (needle, table, index, rangeLookup) {
    if (needle.hasOwnProperty('v')) needle = needle.v;
    var firstColumn = table[0].k.match(/[A-Z]+/gi)[0];
    var width = 0;
    do {
        ++width;
    } while (width < table.length && table[width].k.match(/[A-Z]+/gi)[0] != firstColumn);
    var newTable = [];
    for (var start = 0; start < table.length; start += width) {
        newTable.push(table.slice(start, Math.min(start + width, table.length)));
    }
    newTable = recursiveMapIf(value => value.hasOwnProperty('v'), value => value.v, newTable);
    return formulajs.VLOOKUP(needle, newTable, index, rangeLookup);
};

function recursiveMapIf(predicate, fn, value) {
    if (value.hasOwnProperty('length')) {
        var result = [];
        for (var i = 0; i < value.length; i++) {
            result.push(recursiveMapIf(predicate, fn, value[i]));
        }
        return result;
    }
    if (predicate(value)) return fn(value);
    return value;
}

document.addEventListener("DOMContentLoaded", () => {

    const titleView = $('#title');
    const gameView = $('#game');
    const timeLeftView = $('#timeleft');
    const contentView = $('#content');
    const spreadsheetView = $('#spreadsheet');
    const scoreView = $('#score');
    const NView = $('#N');
    const hintView = $('#hint');

    const winDialog = $('#win');
    const loseDialog = $('#lose');

    const NAMES = [
        'Adam',
        'Adrian',
        'Agnes',
        'Aisha',
        'Ajay',
        'Alex',
        'Alice',
        'Amy',
        'Andrew',
        'Andy',
        'Anika',
        'Bala',
        'Bee Lay',
        'Ben',
        'Boon Kiat',
        'Boon Lim',
        'Charles',
        'Chee Seng',
        'Cher Leng',
        'Choo Tuan',
        'Daniel',
        'Deepak',
        'Denise',
        'Dinesh',
        'Eric',
        'Farhan',
        'Faris',
        'Fei Hung',
        'Gopi',
        'Guanyu',
        'Guiying',
        'Haiming',
        'Hajar',
        'Harish',
        'Hiram',
        'Hon Teng',
        'Hui Ning',
        'Irfan',
        'Ishak',
        'James',
        'Jane',
        'Jayden',
        'Jeff',
        'Joel',
        'Joseph',
        'Jun Ming',
        'Jun Yu',
        'Kamal',
        'Katie',
        'Kim',
        'Kumar',
        'Lewis',
        'Lily',
        'Lukman',
        'Marvin',
        'Mehul',
        'Mei Ling',
        'Minhui',
        'Mo Chou',
        'Mohan',
        'Muthu',
        'Neil',
        'Noraiha',
        'Nurul',
        'Omar',
        'Oscar',
        'Paul',
        'Priya',
        'Qianru',
        'Qing Shan',
        'Rajesh',
        'Ru Shi',
        'Ruo Xi',
        'Sabtu',
        'Sanjay',
        'Sara',
        'Sean',
        'Siti',
        'Steve',
        'Tanya',
        'Timothy',
        'Vincent',
        'Vinesh',
        'Wang Shu',
        'Weijie',
        'Weiliang',
        'Wenqiang',
        'Wira',
        'Xiao Ming',
        'Xinyi',
        'Xiuying',
        'Yang Yang',
        'Yasmin',
        'Yiming',
        'Ying Yue',
        'Yu Yan',
        'Zheng Wei',
        'Zhi Jie',
        'Ziqiang'
    ];

    const N = 20;

    const TIME_LIMITS = [60, 20, 10];

    const data = [
        ['Name', 'Age', 'Height', '', 'Name', 'Height']
    ];

    const selected = new Array(N);
    const correct = new Array(N);
    const dirty = new Array(N);

    const initSettings = {
        data: data,
        allowInsertRow: false,
        allowManualInsertRow: false,
        allowInsertColumn: false,
        allowManualInsertColumn: false,
        allowDeleteRow: false,
        allowDeleteColumn: false,
        columnResize: false,
        columnSorting: false,
        columns: [{
                type: 'text',
                readOnly: true
            },
            {
                type: 'numeric',
                readOnly: true
            },
            {
                type: 'numeric',
                readOnly: true
            },
            {
                readOnly: true
            },
            {
                type: 'text',
                readOnly: true
            },
            {
                type: 'numeric'
            },
        ],
        colWidths: [100, 100, 100, 100, 100, 200],
        rowDrag: false,
        onchange: (obj, cell, val) => {
            if (!timer.isRunning()) return;
            const index = parseInt(cell[0].id.split('-')[1]) - 1;
            const value = parseInt(cell.text());
            dirty[index] = true;
            if (data[selected[index] + 1][2] == value) {
                correct[index] = true;
                cell.addClass('correct');
                cell.removeClass('wrong');
            } else {
                correct[index] = false;
                cell.removeClass('correct');
                cell.addClass('wrong');
            }
            checkEndGame();
        }
    };

    const updateSettings = {
        cells: function (cell, col, row) {
            if (col == 5) {
                if (row >= 1 && row <= N) {
                    $(cell).addClass('input');
                } else {
                    $(cell).addClass('readonly');
                }
            }
            if (col < 3) {
                if (row == 0) {
                    $(cell).addClass('header');
                    $(cell).addClass('bordered-top');
                }
                if (col == 0) {
                    $(cell).addClass('bordered-left');
                }
                $(cell).addClass('bordered');
            }
            if (col > 3) {
                if (row == 0) {
                    $(cell).addClass('header');
                    $(cell).addClass('bordered-top');
                }
                if (row <= N) {
                    if (col == 4) {
                        $(cell).addClass('bordered-left');
                    }
                    $(cell).addClass('bordered');
                }
            }
            $(cell).css('color', 'black');
        }
    };

    const timer = new Countdown((timeLeft) => {
        if (timeLeft > 0) {
            timeLeftView.html('<b>Time Left:</b> ' + timeLeft);
        } else {
            timeLeftView.html('<b>Game Over</b>');
            lock();
            scoreView.text(correct.reduce((acc, cur) => acc + cur, 0).toString());
            bootbox.alert({
                title: 'Time\'s Up!',
                message: loseDialog.html(),
                callback: quitGame
            });
        }
    });

    function lock() {
        spreadsheetView.find('input').blur();
        spreadsheetView.find('.input').addClass('readonly');
    }

    function unlock() {
        spreadsheetView.find('.input').removeClass('readonly');
    }

    function startGame() {
        for (var i = 0; i < NAMES.length; ++i) {
            data[i + 1][1] = 12 + Math.floor(Math.random() * 5);
            data[i + 1][2] = 150 + Math.floor(Math.random() * 31);
        }

        var swapped = {};
        for (var i = 0; i < N; ++i) {
            var random = i + Math.floor(Math.random() * (NAMES.length - i));
            selected[i] = (swapped[random] === undefined) ? random : swapped[random];
            swapped[random] = (swapped[i] === undefined) ? i : swapped[i];
            correct[i] = false;
            dirty[i] = false;
        }

        for (var i = 0; i < N; ++i) {
            data[i + 1][4] = NAMES[selected[i]];
            data[i + 1][5] = '';
        }

        unlock();
        timer.start(TIME_LIMITS[difficulty]);
        spreadsheetView.jexcel('setData', data);
        contentView[0].scrollTop = 0;
        hintView.hide();
    }

    function checkEndGame() {
        if (correct.every(x => x)) {
            timer.clear();
            lock();
            bootbox.alert({
                title: 'Congratulations',
                message: winDialog.html(),
                callback: quitGame
            });
        } else if (dirty.every(x => x)) {
            hintView.show();
        }
    }

    function showGame() {
        titleView.slideUp();
        gameView.slideDown();
    }

    function hideGame() {
        gameView.slideUp();
        titleView.slideDown();
    }

    function quitGame() {
        timer.clear();
        hideGame();
    }

    NView.text(N.toString());

    var difficulty = 0;

    for (var i = 0; i < NAMES.length; ++i) {
        data.push([NAMES[i], '?', '?', '', '', '']);
    }

    spreadsheetView.jexcel(initSettings);
    spreadsheetView.jexcel('updateSettings', updateSettings);

    $('#easy').on('click', () => {
        difficulty = 0;
        showGame();
        startGame();
    });

    $('#restart').on('click', () => {
        startGame();
    });

    $('#quit').on('click', () => {
        quitGame();
    });

});
