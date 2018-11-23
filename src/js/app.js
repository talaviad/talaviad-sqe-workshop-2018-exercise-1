/* eslint-disable complexity,no-console */
import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parsingJson} from './myanalyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let lines = parsingJson(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        $('#dataTable').html(lines);
    });
});

