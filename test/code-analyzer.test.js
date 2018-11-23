import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parsingJson} from '../src/js/myanalyzer';

describe('The javascript parser', () => {

    /*my tests*/
    it('is parsing an empty function correctly  (Test 1)', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a while loop correctly   (Test 2)', () => {
        assert.equal(
            parsingJson(parseCode('while(x<V[N]) {\n' +
                '  i++;\n' +
                'n = x/4;\n' +
                'if (R>Y) \n' +
                ' arg = 7\n' +
                'else if (x==9)\n' +
                ' r=r+7;\n' +
                'else\n' +
                'm=8;\n' +
                '}')).length,
            900
        );
    });

    it('Avirams example   (Test 3)', () => {
        assert.equal(
            parsingJson(parseCode('function binarySearch(X, V, n){\n' +
            '        let low, high, mid;\n' +
            '        low = 0;\n' +
            '        high = n - 1;\n' +
            '        while (low <= high) {\n' +
            '            mid = (low + high)/2;\n' +
            '            if (X < V[mid])\n' +
            '                high = mid - 1;\n' +
            '            else if (X > V[mid])\n' +
            '                low = mid + 1;\n' +
            '            else\n' +
            '                return mid;\n' +
            '        }\n' +
            '        return -1;\n' +
            '    }')).length,
            1770
        );
    });

    it('for example   (Test 4', () => {
        assert.equal(
            parsingJson(parseCode(
                '    for(y=7; T[8]<9; --j) {\n' +
                '        R=7;\n' +
                '        X = X/2;\n' +
                '    }')).length,
            555
        );
    });

    it('decleration test   (Test 5)', () => {
        assert.equal(
            parsingJson(parseCode(
                'let x=4;')).length,
            186
        );
    });

    it('non type test   (Test 6)', () => {
        assert.equal(
            parsingJson('{\n' +
                '  "type": "Non-Existing-Type",\n' +
                '  "body": [\n' +
                '    {\n' +
                '      "type": "VariableDeclaration",\n' +
                '      "declarations": [\n' +
                '        {\n' +
                '          "type": "VariableDeclarator",\n' +
                '          "id": {\n' +
                '            "type": "Identifier",\n' +
                '            "name": "a",\n' +
                '            "loc": {\n' +
                '              "start": {\n' +
                '                "line": 1,\n' +
                '                "column": 4\n' +
                '              },\n' +
                '              "end": {\n' +
                '                "line": 1,\n' +
                '                "column": 5\n' +
                '              }\n' +
                '            }\n' +
                '          },\n' +
                '          "init": {\n' +
                '            "type": "Literal",\n' +
                '            "value": 5,\n' +
                '            "raw": "5",\n' +
                '            "loc": {\n' +
                '              "start": {\n' +
                '                "line": 1,\n' +
                '                "column": 8\n' +
                '              },\n' +
                '              "end": {\n' +
                '                "line": 1,\n' +
                '                "column": 9\n' +
                '              }\n' +
                '            }\n' +
                '          },\n' +
                '          "loc": {\n' +
                '            "start": {\n' +
                '              "line": 1,\n' +
                '              "column": 4\n' +
                '            },\n' +
                '            "end": {\n' +
                '              "line": 1,\n' +
                '              "column": 9\n' +
                '            }\n' +
                '          }\n' +
                '        }\n' +
                '      ],\n' +
                '      "kind": "let",\n' +
                '      "loc": {\n' +
                '        "start": {\n' +
                '          "line": 1,\n' +
                '          "column": 0\n' +
                '        },\n' +
                '        "end": {\n' +
                '          "line": 1,\n' +
                '          "column": 10\n' +
                '        }\n' +
                '      }\n' +
                '    }\n' +
                '  ],\n' +
                '  "sourceType": "script",\n' +
                '  "loc": {\n' +
                '    "start": {\n' +
                '      "line": 1,\n' +
                '      "column": 0\n' +
                '    },\n' +
                '    "end": {\n' +
                '      "line": 1,\n' +
                '      "column": 10\n' +
                '    }\n' +
                '  }\n' +
                '}'),
            '<tr> <td> Line </td> <td> Type </td> <td> Name </td> <td> Condition </td> <td> Value </td> </tr> '
        );
    });

    it('if-else test   (Test 7)', () => {
        assert.equal(
            parsingJson(parseCode(
                'if (x>9)\n' +
                ' r++;\n' +
                'else\n' +
                'r--;')).length,
            438
        );
    });

    it('if-else-if-else test   (Test 8)', () => {
        assert.equal(
            parsingJson(parseCode(
                'if (x>9)\n' +
                ' r++;\n' +
                'else if(x==9)\n' +
                'r--;\n' +
                'else\n' +
                'r=r+6;')).length,
            622
        );
    });

    it('nested function test   (Test 9)', () => {
        assert.equal(
            parsingJson(parseCode(
                'if (a && b) a;')).length,
            186
        );
    });

    it('only if(without else); test   (Test 10)', () => {
        assert.equal(
            parsingJson(parseCode(
                'function t (x,y,n,f) {\n' +
                '   while(true) {\n' +
                '      x--;\n' +
                '      y++;\n' +
                '      if (x>9)\n' +
                '         x=x-1;\n' +
                '   }\n' +
                '   return n;\n' +
                '}')).length,
            1061
        );
    });

    it('binary both-sides expression test   (Test 11)', () => {
        assert.equal(
            parsingJson(parseCode(
                'let x = (r/9)/(r/8)')).length,
            206
        );
    });

    it('logical expression test   (Test 12)', () => {
        assert.equal(
            parsingJson(parseCode(
                'if (a&& b) p;')).length,
            186
        );
    });

    it('null test   (Test 13)', () => {
        assert.equal(
            parsingJson(null).length,
            97
        );
    });



});
