const SQLQueryDistance = require('./dist/index');

(async () => {

let distance, steps, path;


const config_atomic = `
setDistinct:2
unsetDistinct:2
addSelectElement:1
removeSelectElement:1
addSelectAsterisk:1
removeSelectAsterisk:1
setSelectAsteriskTable:10
unsetSelectAsteriskTable:1
addSelectColumnReference:1
removeSelectColumnReference:1
setSelectColumnReferenceTable:10
unsetSelectColumnReferenceTable:1
addSelectLiteral:1
removeSelectLiteral:1
addSelectNot:1
removeSelectNot:1
addSelectAggregationFunction:1
removeSelectAggregationFunction:1
setSelectAggregationFunctionDistinct:2
unsetSelectAggregationFunctionDistinct:2
addSelectBinaryExpression:1
removeSelectBinaryExpression:1
setSelectAlias:2
unsetSelectAlias:0
addFromElement:2
removeFromElement:2
setTableJoinType:1
unsetTableJoinType:1
addFromColumnReference:1
removeFromColumnReference:1
setFromColumnReferenceTable:10
unsetFromColumnReferenceTable:1
addFromLiteral:1
removeFromLiteral:1
addFromNot:1
removeFromNot:1
addFromBinaryExpression:1
removeFromBinaryExpression:1
setFromAlias:10
unsetFromAlias:1
addWhereColumnReference:1
removeWhereColumnReference:1
setWhereColumnReferenceTable:10
unsetWhereColumnReferenceTable:1
addWhereLiteral:1
removeWhereLiteral:1
addWhereNot:1
removeWhereNot:1
addWhereBinaryExpression:1
removeWhereBinaryExpression:1
addGroupbyElement:1
removeGroupbyElement:2
addGroupbyColumnReference:1
removeGroupbyColumnReference:1
setGroupbyColumnReferenceTable:10
unsetGroupbyColumnReferenceTable:1
addGroupbyLiteral:1
removeGroupbyLiteral:1
addGroupbyNot:1
removeGroupbyNot:1
addGroupbyBinaryExpression:1
removeGroupbyBinaryExpression:1
addHavingColumnReference:1
removeHavingColumnReference:1
setHavingColumnReferenceTable:10
unsetHavingColumnReferenceTable:1
addHavingLiteral:1
removeHavingLiteral:1
addHavingNot:1
removeHavingbyNot:1
addHavingAggregationFunction:1
removeHavingAggregationFunction:1
setHavingAggregationFunctionDistinct:2
unsetHavingAggregationFunctionDistinct:2
addHavingBinaryExpression:1
removeHavingBinaryExpression:1
addOrderbyElement:1
removeOrderbyElement:1
setOrderbyDescending:1
unsetOrderbyDescending:1
addOrderbyColumnReference:1
removeOrderbyColumnReference:1
setOrderbyColumnReferenceTable:10
unsetOrderbyColumnReferenceTable:1
addOrderbyLiteral:1
removeOrderbyLiteral:1
addOrderbyNot:1
removeOrderbyNot:1
addOrderbyAggregationFunction:1
removeOrderbyAggregationFunction:1
setOrderbyAggregationFunctionDistinct:2
unsetOrderbyAggregationFunctionDistinct:2
addOrderbyBinaryExpression:1
removeOrderbyBinaryExpression:1
`;
const config_horizontal = `
swapSelectElements:1
changeSelectAsteriskTable:1
changeSelectColumnReferenceColumn:1
changeSelectColumnReferenceTable:1
changeSelectLiteralValue:1
changeSelectAggregationFunctionAggregation:1
changeSelectBinaryExpressionOperator:1
swapSelectBinaryExpressionArguments:0
swapSelectBinaryExpressionNesting:0
mirrorSelectBinaryExpressionInequation:0
changeSelectAlias:2
swapFromElements:0
changeFromJoinType:1
changeFromColumnReferenceColumn:1
changeFromColumnReferenceTable:1
changeFromLiteralValue:1
changeFromBinaryExpressionOperator:1
swapFromBinaryExpressionArguments:0
swapFromBinaryExpressionNesting:0
mirrorFromBinaryExpressionInequation:0
changeFromAlias:2
changeWhereColumnReferenceColumn:1
changeWhereColumnReferenceTable:1
changeWhereLiteralValue:1
changeWhereBinaryExpressionOperator:1
swapWhereBinaryExpressionArguments:0
swapWhereBinaryExpressionNesting:0
mirrorWhereBinaryExpressionInequation:0
swapGroupbyElements:0
changeGroupbyColumnReferenceColumn:1
changeGroupbyColumnReferenceTable:1
changeGroupbyLiteralValue:1
changeGroupbyBinaryExpressionOperator:1
swapGroupbyBinaryExpressionArguments:0
swapGroupbyBinaryExpressionNesting:0
mirrorGroupbyBinaryExpressionInequation:0
changeHavingColumnReferenceColumn:1
changeHavingColumnReferenceTable:1
changeHavingLiteralValue:1
changeHavingAggregationFunctionAggregation:1
changeHavingBinaryExpressionOperator:1
swapHavingBinaryExpressionArguments:0
swapHavingBinaryExpressionNesting:0
mirrorHavingBinaryExpressionInequation:0
changeOrderbyElements:1
changeOrderbyColumnReferenceColumn:1
changeOrderbyColumnReferenceTable:1
changeOrderbyLiteralValue:1
changeOrderbyAggregationFunctionAggregation:1
changeOrderbyBinaryExpressionOperator:1
swapOrderbyBinaryExpressionArguments:0
swapOrderbyBinaryExpressionNesting:0
mirrorOrderbyBinaryExpressionInequation:0
`;
const config_shortcut = `
applySelectTautologyLaw:0
applySelectDoubleNegationLaw:0
applySelectDistributiveLaw:0
applySelectDeMorgan:0
applySelectAbsorptionLaw:0
applyFromTautologyLaw:0
applyFromDoubleNegationLaw:0
applyFromDistributiveLaw:0
applyFromDeMorgan:0
applyFromAbsorptionLaw:0
applyWhereTautologyLaw:0
applyWhereDoubleNegationLaw:0
applyWhereDistributiveLaw:0
applyWhereDeMorgan:0
applyWhereAbsorptionLaw:0
applyGroupbyTautologyLaw:0
applyGroupbyDoubleNegationLaw:0
applyGroupbyDistributiveLaw:0
applyGroupbyDeMorgan:0
applyGroupbyAbsorptionLaw:0
applyHavingTautologyLaw:0
applyHavingDoubleNegationLaw:0
applyHavingDistributiveLaw:0
applyHavingDeMorgan:0
applyHavingAbsorptionLaw:0
applyOrderbyTautologyLaw:0
applyOrderbyDoubleNegationLaw:0
applyOrderbyDistributiveLaw:0
applyOrderbyDeMorgan:0
applyOrderbyAbsorptionLaw:0
moveInnerJoinConditionToWhere:0
moveWhereToInnerJoinCondition:0
expandAsterisk:0
collapseAsterisk:0
`;
const config = config_atomic + config_horizontal + config_shortcut;

const schema = `
themengebiet ( _id_, bezeichnung )
modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )
semester ( _nummer_ )
modul_semester ( _modul [modul]_, _semester [semester]_, ects )
`;




// ===== Szenarios 1-X =====

const reference_1 = `
SELECT bezeichnung, semester, ects 
FROM modul 
JOIN modul_semester ON id = modul;
`;


console.log(`===== Szenario 1-1 =====`);

const student_1_1 = `
SELECT modul, semester, ects
FROM modul_semester;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_1, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 1-2 =====`);

const student_1_2 = `
SELECT bezeichnung, semester, ects 
FROM modul
JOIN modul_semester ON id = modul 
GROUP BY bezeichnung;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's multiple orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_2, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 1-3 =====`);

const student_1_3 = `
SELECT bezeichnung, semester, ects 
FROM modul, modul_semester 
WHERE modul = id 
GROUP BY id, semester;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's multiple orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_3, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 2-X =====

const reference_2 = `
SELECT semester
FROM modul
JOIN modul_semester ON (modul = id)
GROUP BY semester
HAVING COUNT(DISTINCT themengebiet) > 3;
`;


console.log(`===== Szenario 2-1 =====`);

const student_2_1 = `
select semester as semester 
from modul_semester 
join modul on id = modul 
group by semester 
having count(themengebiet) > 3;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_1, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 2-2 =====`);

const student_2_2 = `
select semester as semester, 
count(themengebiet) as themengebiete 
from modul_semester 
join modul on modul = id 
group by semester 
having count(themengebiet) > 3;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_2, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 2-3 =====`);

const student_2_3 = `
select semester AS semester 
from modul_semester 
join modul on modul = id 
group by semester 
having COUNT(distinct themengebiet) = 3;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_3, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 3-X =====

const reference_3 = `
SELECT bezeichnung, SUM(ects) AS ects
FROM modul
JOIN modul_semester ON (modul = id)
GROUP BY id, bezeichnung;
`;


console.log(`===== Szenario 3-1 =====`);

const student_3_1 = `
select bezeichnung, count (ects) as ects 
from modul 
join modul_semester on id = modul 
group by id;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_1, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-2 =====`);

const student_3_2 = `
SELECT bezeichnung, SUM(ects) AS ects 
FROM modul 
JOIN modul_semester ON id = modul 
GROUP BY bezeichnung;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_2, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-3 =====`);

const student_3_3 = `
select bezeichnung, sum(ects) as ects 
from modul, modul_semester 
group by bezeichnung 
order by bezeichnung desc;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_3, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-4 =====`);

const student_3_4 = `
select bezeichnung, ects 
from modul 
join modul_semester on modul = id 
group by modul;
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_4, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 4-X =====

const reference_4 = `
SELECT SUM(ects) AS summe
FROM modul
JOIN modul_semester ON (modul = id)
WHERE gop = "ja";
`;


console.log(`===== Szenario 4-1 =====`);

const student_4_1 = `
Select DISTINCT Sum(ects) as summe 
From modul_semester, modul 
Where gop = 'ja';
`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_4, student_4_1, schema, config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




console.log("\n\n");
})();
