require('normalize.css/normalize.css');
require('./styles/index.scss');

const $ = require('jquery/dist/jquery');
global.jQuery = $;

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/js/bootstrap.bundle.min');

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

const formulajs = require('@handsontable/formulajs/dist/formula');
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

require('excel-formula/dist/excel-formula.min');
require('jexcel/dist/js/jquery.jexcel');
require('jexcel/dist/css/jquery.jexcel.css');

document.addEventListener("DOMContentLoaded", () => {

    const withLookup = false;

    const titleView = $('#title');
    const gameView = $('#game');
    const contentView = $('#content');
    const spreadsheetView = $('#spreadsheet');
    const formView = $('#form');
    const formBodyView = $('#form-body');

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

    const N = 10;

    const data = [
        withLookup ? ['Name', 'Age', 'Height', '', 'Name', 'Height'] : ['Name', 'Age', 'Height']
    ];

    const selected = new Array(N);

    const correct = new Array(N);

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
        colWidths: withLookup ? [ 100, 100, 100, 100, 100, 200 ] : [ 100, 100, 100 ],
        rowDrag: false,
        onchange: (obj, cell, val) => {
            const index = parseInt(cell[0].id.split('-')[1]) - 1;
            const value = parseInt(cell.text());
            if (data[selected[index] + 1][2] == value) {
                correct[index] = true;
                cell.addClass('correct');
            } else {
                correct[index] = false;
                cell.removeClass('correct');
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

    function startGame() {
        for (var i = 0; i < NAMES.length; ++i) {
            data[i + 1][1] = 12 + Math.floor(Math.random() * 5);
            data[i + 1][2] = 150 + Math.floor(Math.random() * 31);
        }

        var swapped = {};
        for (var i = 0; i < N; ++i) {
            var random = i + Math.floor(Math.random() * (NAMES.length - i));
            selected[i] = swapped[random] || random;
            swapped[random] = swapped[i] || i;
            correct[i] = false;
        }

        if (withLookup) {
            for (var i = 0; i < N; ++i) {
                data[i + 1][4] = NAMES[selected[i]];
                data[i + 1][5] = '';
            }
        } else {
            for (var i = 0; i < N; ++i) {
                $('#name-' + i).text(NAMES[selected[i]]);
            }
            formView[0].reset();
            formBodyView.find('input').removeClass('correct');
        }

        spreadsheetView.jexcel('setData', data);
        contentView[0].scrollTop = 0;
    }

    function handleInput(event) {
        const target = $(event.target);
        const index = parseInt(target[0].id.split('-')[1]);
        const value = parseInt(target[0].value);
        if (data[selected[index] + 1][2] == value) {
            correct[index] = true;
            target.addClass('correct');
        } else {
            correct[index] = true;
            target.removeClass('correct');
        }
        checkEndGame();
    }

    function checkEndGame() {
        console.log(correct);
    }

    if (withLookup) {
        spreadsheetView.removeClass('col-6');
        spreadsheetView.addClass('col-12');
        formView.hide();
    } else {
        var html = ''
        for (var i = 0; i < N; ++i) {
            html += '<tr><td id="name-' + i + '"></td><td><input id="value-' + i + '" type="number"></td></tr>';
        }
        formBodyView.html(html);
        formBodyView.find('input').on('input', handleInput);
    }

    for (var i = 0; i < NAMES.length; ++i) {
        data.push(withLookup ? [NAMES[i], '?', '?', '', '', ''] : [NAMES[i], '?', '?']);
    }

    spreadsheetView.jexcel(initSettings);
    spreadsheetView.jexcel('updateSettings', updateSettings);

    $('#start').on('click', () => {
        titleView.slideUp();
        gameView.slideDown();
        startGame();
    });

    $('#restart').on('click', () => {
        startGame();
    });

    $('#quit').on('click', () => {
        gameView.slideUp();
        titleView.slideDown();
    });


});
