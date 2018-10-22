require('normalize.css/normalize.css');
require('./styles/index.scss');

const $ = require('jquery/dist/jquery.slim');
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

    var data = [
        ['Name', 'Age', 'Height', '', 'Name', 'Height']
    ];

    for (var i = 0; i < NAMES.length; ++i) {
        data.push([NAMES[i], 12 + Math.floor(Math.random() * 5), 150 + Math.floor(Math.random() * 31)]);
    }

    var selected = [];
    var swapped = {};
    for (var i = 0; i < N; ++i) {
        var random = i + Math.floor(Math.random() * (NAMES.length - i));
        selected.push(swapped[random] || random);
        swapped[random] = swapped[i] || i;
        data[i + 1] = data[i + 1].concat(['', NAMES[selected[i]]]);
    }

    $('#spreadsheet').jexcel({
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
        defaultColWidth: 100,
        rowDrag: false,
    });

    $('#spreadsheet').jexcel('updateSettings', {
        cells: function (cell, col, row) {
            if (col == 5) {
                if (row >= 1 && row <= N) {
                    $(cell).css('background-color', 'yellow');
                } else {
                    $(cell).addClass('readonly');
                }
            }
            if (row == 0) {
                $(cell).css('font-weight', 'bold');
            }
            if (col < 3) {
                if (row == 0) {
                    $(cell).css('background-color', 'silver');
                    $(cell).css('border-top-color', 'gray');
                }
                if (col == 0) {
                    $(cell).css('border-left-color', 'gray');
                }
                $(cell).css('border-bottom-color', 'gray');
                $(cell).css('border-right-color', 'gray');
            }
            if (col > 3) {
                if (row == 0) {
                    $(cell).css('background-color', 'silver');
                    $(cell).css('border-top-color', 'gray');
                }
                if (row <= N) {
                    if (col == 4) {
                        $(cell).css('border-left-color', 'gray');
                    }
                    $(cell).css('border-bottom-color', 'gray');
                    $(cell).css('border-right-color', 'gray');
                }
            }
            $(cell).css('color', 'black');
        }
    });

});
