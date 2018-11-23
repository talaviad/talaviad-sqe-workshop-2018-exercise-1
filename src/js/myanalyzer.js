/* eslint-disable no-console */

import TableLine from './TableLine.js';

let list = [];

const parsingJson = (parsedCode) => {
    list = [];
    parsingAndTableMaking(parsedCode);
    let lines = '<tr> <td> Line </td> <td> Type </td> <td> Name </td> <td> Condition </td> <td> Value </td> </tr> ';
    for (let i = 0; i < list.length; i++) {
        let line = list[i].line;
        let type = list[i].type;
        let name = list[i].name;
        let condition = list[i].condition;
        let value = list[i].value;
        let str = '<tr> ' + '<td> ' + line + ' </td>' + '<td> ' + type + ' </td>' + '<td> ' + name + ' </td>' + '<td> ' + condition + ' </td>' + '<td> ' + value + ' </td>' + ' </tr>';
        lines = lines + str;
        console.log('Line: ' + line + ', Type: ' + type + ', Name: ' + name + ', Condition: ' + condition + ', Value: ' + value);
    }
    return lines;
};

const parsingAndTableMaking = (parsedCode) => {
    if (parsedCode === null) return null;
    let result=null;
    switch (parsedCode.type) {
    case 'Program' : console.log('in program'); result = parsingAndTableMaking(parsedCode.body[0]); break;
    case 'FunctionDeclaration' : result = AnalyzeFunctionDecleration(parsedCode); break;
    default: result = parsingAndTableMaking2(parsedCode); break;
    }
    return result;
};

const parsingAndTableMaking2 = (parsedCode) => {
    let result=null;
    switch (parsedCode.type) {
    case 'BlockStatement' : console.log('BlockStatement'); for(let exp of parsedCode.body) { result = parsingAndTableMaking(exp); } break;
    case 'VariableDeclaration' : console.log('VariableDeclaration'); result = AnalyzeDeclerationsArray(parsedCode.declarations); break;
    case 'ExpressionStatement' : console.log('ExpressionStatement'); result = parsingAndTableMaking(parsedCode.expression); break;
    default: result = parsingAndTableMaking3(parsedCode); break;
    }
    return result;
};

const parsingAndTableMaking3 = (parsedCode) => {
    let result=null;
    switch (parsedCode.type) {
    case 'AssignmentExpression' : result = AnalyzeAssignmentExpression(parsedCode); break;
    case 'Identifier' : result = AnalyzeIdentifier(parsedCode); break;
    case 'Literal' : result = AnalyzeLiteral(parsedCode); break;
    case 'MemberExpression' : result = AnalyzeMemberExpression(parsedCode); break;
    default: result = parsingAndTableMaking4(parsedCode); break;
    }
    return result;
};

const parsingAndTableMaking4 = (parsedCode) => {
    let result=null;
    switch (parsedCode.type) {
    case 'BinaryExpression' : result = AnalyzeBinaryExpression(parsedCode); break;
    case 'WhileStatement' : result = AnalyzeWhileStatement(parsedCode); break;
    case 'IfStatement' : result = AnalyzeIfStatement(parsedCode,0); break;
    case 'ReturnStatement' : result = AnalyzeReturnStatement(parsedCode); break;
    default: result = parsingAndTableMaking5(parsedCode); break;
    }
    return result;
};

const parsingAndTableMaking5 = (parsedCode) => {
    let result=null;
    switch (parsedCode.type) {
    case 'LogicalExpression' : result = AnalyzeLogicalExpression(parsedCode); break;
    case 'UnaryExpression' : result = AnalizeUnaryExpression(parsedCode); break;
    case 'ForStatement' : result = AnalyzeForStatement(parsedCode); break;
    case 'UpdateExpression' : result = AnalyzeUpdateExpression(parsedCode); break;
    default: break;
    }
    return result;
};

function AnalyzeFunctionDecleration(functionDecleration) {
    console.log('AnalyzeFunctionDecleration');
    let newTableLine = new TableLine();
    newTableLine.type = 'function declaration';
    newTableLine.line = functionDecleration.loc.start.line;
    newTableLine.name = functionDecleration.id.name;
    list.push(newTableLine);
    AnalyzeParams(functionDecleration.params);
    parsingAndTableMaking(functionDecleration.body);
    return newTableLine;
}

function AnalyzeParams(paramsArray)  {
    console.log('AnalyzeParams');
    for(let param of paramsArray) {
        let newTableLine = new TableLine();
        newTableLine.line = param.loc.start.line;
        newTableLine.name = param.name;
        newTableLine.type = 'variable declaration';
        list.push(newTableLine);
    }
    return 0;
}

function AnalyzeDeclerationsArray(declerationsArray) {
    console.log('AnalyzeDeclerationsArray');
    for(let varDecl of declerationsArray) {
        let newTableLine = new TableLine();
        newTableLine.line = varDecl.loc.start.line;
        newTableLine.name = varDecl.id.name;
        newTableLine.type = 'variable declaration';
        newTableLine.value = (varDecl.init === null)? null : parsingAndTableMaking(varDecl.init).name;
        list.push(newTableLine);
    }
    return 0;
}

function AnalyzeAssignmentExpression(assignmentExpression) {
    console.log('AnalyzeAssignmentExpression');
    let newTableLine = new TableLine();
    let left = parsingAndTableMaking(assignmentExpression.left);
    let right = parsingAndTableMaking(assignmentExpression.right);
    newTableLine.type = 'assignment expression';
    newTableLine.name = left.name;
    newTableLine.line = assignmentExpression.loc.start.line;
    newTableLine.value = right.name;
    list.push(newTableLine);
    return newTableLine;
}

function AnalyzeIdentifier(identifierExpression) {
    console.log('AnalyzeIdentifier');

    let newTableLine = new TableLine();
    newTableLine.type = 'Identifier';
    newTableLine.line = identifierExpression.loc.start.line;
    newTableLine.name = identifierExpression.name;
    return newTableLine;
}

function AnalyzeLiteral(literalExpression) {
    console.log('AnalyzeLiteral');

    let newTableLine = new TableLine();
    newTableLine.name = literalExpression.value.toString();
    newTableLine.type ='Literal Expression';
    newTableLine.line = literalExpression.loc.start.line;
    newTableLine.value = literalExpression.value.toString(); //mabye the literal is a string and not a number
    return newTableLine;
}

function AnalyzeMemberExpression(memberExpression) {
    console.log('AnalyzeMemberExpression');

    let newTableLine = new TableLine();
    let object = parsingAndTableMaking(memberExpression.object);
    let property = parsingAndTableMaking(memberExpression.property);
    newTableLine.line = memberExpression.loc.start.line;
    newTableLine.type = 'Member Expression';
    newTableLine.name = object.name + '['+ property.name + ']';  //catenation of two strings
    return newTableLine;
}

function AnalyzeBinaryExpression(binaryExpression) {
    console.log('AnalyzeBinaryExpression');
    let newTableLine = new TableLine();
    let left = parsingAndTableMaking(binaryExpression.left);
    let right = parsingAndTableMaking(binaryExpression.right);
    newTableLine.line=binaryExpression.loc.start.line;
    newTableLine.type = 'Binary Expression';
    let leftName = (left.type !== 'Binary Expression') ? left.name : '( ' + left.name + ' )';
    let rightName = (right.type !== 'Binary Expression') ? right.name : '( ' + right.name + ' )';
    newTableLine.name = leftName + ' ' + binaryExpression.operator + ' ' + rightName;
    return newTableLine;
}

function AnalyzeWhileStatement(whilestatementExpression) {
    console.log('AnalyzeWhileStatement');
    let newTableLine = new TableLine();
    let test = parsingAndTableMaking(whilestatementExpression.test);
    newTableLine.line = whilestatementExpression.loc.start.line;
    newTableLine.type = 'while statement';
    newTableLine.condition = test.name;
    list.push(newTableLine);
    parsingAndTableMaking(whilestatementExpression.body);
    return newTableLine;
}

function AnalyzeIfStatement(ifstatementExpression,ifOrElse) {
    let newTableLine = new TableLine();
    let test = parsingAndTableMaking(ifstatementExpression.test);
    newTableLine.line = ifstatementExpression.loc.start.line;
    newTableLine.type = (ifOrElse === 0)? 'if statement' : 'else if statement';
    newTableLine.condition = test.name;
    list.push(newTableLine);
    let lastTableLine = parsingAndTableMaking(ifstatementExpression.consequent);
    if (ifstatementExpression.alternate === null) return newTableLine;
    else if (ifstatementExpression.alternate.type === 'IfStatement') AnalyzeIfStatement(ifstatementExpression.alternate,1);
    else {
        let newElseTableLine = new TableLine();
        newElseTableLine.type = 'else statement';
        newElseTableLine.line = lastTableLine.line+1;
        list.push(newElseTableLine);
        parsingAndTableMaking(ifstatementExpression.alternate);
    }
    return newTableLine;
}

function AnalyzeReturnStatement(returnstatementExpression) {
    console.log('AnalyzeReturnStatement');
    let newTableLine = new TableLine();
    newTableLine.line = returnstatementExpression.loc.start.line;
    newTableLine.type = 'return statement';
    let argument = parsingAndTableMaking(returnstatementExpression.argument);
    newTableLine.value = argument.name;
    list.push(newTableLine);
    return newTableLine;
}
function AnalizeUnaryExpression(unaryexpression) {
    console.log('AnalizeUnaryExpression');
    let newTableLine = new TableLine();
    newTableLine.type = 'unary expression';
    newTableLine.line = unaryexpression.loc.start.line; //mabye unnessecary
    let argument = parsingAndTableMaking(unaryexpression.argument);
    newTableLine.name = unaryexpression.operator + argument.name;
    return newTableLine;
}

function AnalyzeForStatement(forstatementExpression) {  //should be changed
    console.log('AnalyzeForStatement');
    let newTableLine = new TableLine();
    newTableLine.type = 'for-statement';
    newTableLine.line = forstatementExpression.loc.start.line;
    list.push(newTableLine);
    let init = parsingAndTableMaking(forstatementExpression.init);
    let test = parsingAndTableMaking(forstatementExpression.test);
    let update = parsingAndTableMaking(forstatementExpression.update);
    newTableLine.condition = init.name +  '=' + init.value + ';' + test.name + ';' + update.value;
    parsingAndTableMaking(forstatementExpression.body);
    return newTableLine;
}

function AnalyzeUpdateExpression(updateExpression) {
    console.log('AnalyzeUpdateExpression');
    let newTableLine = new TableLine();
    newTableLine.type = 'update expression';
    newTableLine.name = updateExpression.argument.name;
    newTableLine.value = (updateExpression.prefix === true)? updateExpression.operator+newTableLine.name : newTableLine.name+updateExpression.operator;
    newTableLine.line = updateExpression.loc.start.line;
    list.push(newTableLine);
    return newTableLine;
}

function AnalyzeLogicalExpression(logicalExpression) {
    console.log('AnalyzeLogicalExpression');
    let newTableLine = new TableLine();
    newTableLine.type = 'Logical Expression';
    let left = parsingAndTableMaking(logicalExpression.left);
    let right = parsingAndTableMaking(logicalExpression.right);
    newTableLine.line = logicalExpression.loc.start.line;
    newTableLine.name = '( ' + left.name + ' ' + logicalExpression.operator + ' ' + right.name + ' )';
    return newTableLine;
}


//for, how should it be presented
//for statement- assignments in different lines


export {parsingJson};

