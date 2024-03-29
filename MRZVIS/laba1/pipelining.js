/*
Лабораторная работа №1
по дисциплине МРЗВИС
Выполнена студентами группы 121703
Тарбая Данила Игоревич, Терлеев Алексей Сергеевич
Вариант 1:
Алгоритм вычисления произведения пары 4-разряда чисел умножения с младших разрядов со сдвигом множимого влево 
Для упрощения реализации таблицы и динамической отрисовки элементов страницы
была использована билиотека jQuery.
Список используемых источников
https://github.com/kitanoyouru/multiply-with-left-shift
*/

$(document).ready(function () {
    var binaryZero = "00000000";
    var bitCount = 8;
    var decimalLimit = 255;
    var pairsCount = 1;
    var maxPairs = 1000;
    var maxBits = 256;

    $(document).on(
        "input",
        ".first_number_input, .second_number_input",
        function (e) {
            var value = $(this).val();
            if (value > decimalLimit) {
                alert(
                    "Pleace input numbers less or equal to " +
                        decimalLimit +
                        "."
                );
                $(this).val(decimalLimit);
                $(this).val(decimalLimit);
            }
        }
    );

    $("#input_bits").on("input", function (e) {
        var input = $("#input_bits");
        bitCount = parseInt(input.val(), 10);
        if (bitCount > maxBits) {
            alert(
                bitCount + " bits is too much, " + maxBits + " is the limit!"
            );
            input.val(maxBits);
            bitsCount = maxBits;
        }
        binaryZero = "";
        decimalLimit = Math.pow(2, bitCount) - 1;
        for (var i = 0; i < bitCount; i++) {
            binaryZero += "0";
        }
    });

    $("#input_pairs_count").on("input", function (e) {
        var input = $("#input_pairs_count");
        pairsCount = parseInt($("#input_pairs_count").val(), 10);
        if (pairsCount > maxPairs) {
            alert(
                pairsCount +
                    " pairs is too much, " +
                    maxPairs +
                    " is the limit!"
            );
            input.val(maxPairs);
            pairsCount = maxPairs;
        }

        if (pairsCount) {
            $(".form_label").removeClass("hidden");
        } else {
            $(".form_label").addClass("hidden");
        }
        $(".numbers_form").find("br").remove();
        $(".first_number_input, .second_number_input").each(function () {
            $(this).remove();
        });
        for (var i = 0; i < pairsCount; i++) {
            $("#first_numbers").append(
                '<input type="text" class="first_number_input input_field"><br>'
            );
            $("#second_numbers").append(
                '<input type="text" class="second_number_input input_field"><br>'
            );
        }
    });

    $("#submit").click(function (e) {
        var first_values = [];
        var second_values = [];
        var value = 0;
        var binaryValue = binaryZero;
        $(".first_number_input").each(function () {
            value = parseInt($(this).val());
            if (!value) {
                value = 0;
                $(this).val("0");
            }
            binaryValue = toBitCount(value.toString(2));
            console.log(binaryValue);
            first_values.push(binaryValue);
        });
        $(".second_number_input").each(function () {
            value = parseInt($(this).val());
            if (!value) {
                value = 0;
                $(this).val("0");
            }
            binaryValue = toBitCount(value.toString(2));
            console.log(binaryValue);
            second_values.push(binaryValue);
        });

        var columns = bitCount;
        var rows = bitCount + pairsCount - 1;
        buildTable(columns, rows);
        var result = binaryZero;
        var decimalResults = [];
        for (var i = 0; i < pairsCount; i++) {
            result = multiplyAndAddToTable(
                first_values[i],
                second_values[i],
                i
            );
            decimalResults.push(parseInt(result, 2));
        }
        printResults(decimalResults);
    });

    function toBitCount(number) {
        var diff = bitCount - number.length;
        for (var i = 0; i < diff; i++) {
            number = "0" + number;
        }
        return number;
    }

    function multiplyAndAddToTable(first, second, offset) {
        var result = binaryZero;
        var multResult = binaryZero;
        var position = 0;
        for (var i = bitCount - 1; i >= 0; i--) {
            multResult = multiplyOneBit(first, second[i]);
            multResult = leftShift(multResult, bitCount - 1 - i);
            result = binarySum(multResult, result);
            position = (bitCount - 1 - i) * (bitCount + 1) + offset * bitCount;
            addToTable(multResult, result, position);
        }
        return result;
    }

    function multiplyOneBit(binary, bit) {
        return bit == "0" ? binaryZero : binary;
    }

    function binarySum(first, second) {
        first = reverse(first);
        second = reverse(second);
        var remainder = 0;
        var subResult = [];
        var result = "";
        for (var i = 0; i < first.length; i++) {
            subResult = addOneBit(first[i], second[i] || "0", remainder);
            result += subResult[0];
            remainder = subResult[1];
        }
        if (remainder == "1") {
            result += "1";
        }
        return reverse(result);
    }

    function reverse(string) {
        return string.split("").reverse().join("");
    }

    function addOneBit(firstBit, secondBit, remainder) {
        var sum =
            parseInt(firstBit) + parseInt(secondBit) + parseInt(remainder);
        switch (sum) {
            case 0:
                return ["0", "0"];
            case 1:
                return ["1", "0"];
            case 2:
                return ["0", "1"];
            case 3:
                return ["1", "1"];
        }
    }

    function leftShift(binary, count) {
        for (var i = 0; i < count; i++) {
            binary += "0";
        }
        return binary;
    }

    function buildTable(columns, rows) {
        var table = $("#data_table");
        var tableRow = "";
        var number = 0;
        table.empty();
        table.append("<thead><tr>");
        head = $("#data_table > thead tr");
        for (var column = 0; column < columns + 1; column++) {
            if (column == 0) {
                head.append("<th>tacts\\stages</th>");
                continue;
            }
            head.append("<th>stage " + column + "</th>");
        }
        for (var row = 0; row < rows; row++) {
            tableRow = $("<tr>");
            table.append(tableRow);
            for (var column = 0; column < columns + 1; column++) {
                if (column == 0) {
                    tableRow.append($("<th>tact " + (row + 1) + "</th>"));
                } else {
                    number = row * columns + column - 1;
                    tableRow.append($('<td id="' + number + '">'));
                }
            }
        }
    }

    function addToTable(subresult, result, position) {
        $("#" + position).text(
            "mutiplicant: " + subresult + "\n" + "sum: " + result
        );
    }

    function printResults(results) {
        $("#list_label").remove();
        $("#list").remove();
        $(".result_list").append('<label id="list_label">Results:</label>');
        $(".result_list").append('<ol type="1" id="list">');
        list = $("#list");
        for (var i = 0; i < results.length; i++) {
            list.append("<li>" + results[i] + "</li>");
        }
    }
});

