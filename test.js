const SQLQueryDistance = require('./dist/index');

(async () => {

let distance, steps, path;

const config = SQLQueryDistance.createDefaultConfig();
config.get("unsetSelectAlias").cost = 0;
const stringified_config = SQLQueryDistance.stringifyConfig(config);

const schema = 
`themengebiet ( _id_, bezeichnung )
modul ( _id_, bezeichnung, gop, themengebiet [themengebiet] )
semester ( _nummer_ )
modul_semester ( _modul [modul]_, _semester [semester]_, ects )`;




// ===== Szenarios 1-X =====

const reference_1 = 
`SELECT bezeichnung, semester, ects 
FROM modul 
JOIN modul_semester ON id = modul;`;


console.log(`===== Szenario 1-1 =====`);

const student_1_1 = 
`SELECT modul, semester, ects
FROM modul_semester;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_1, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 1-2 =====`);

const student_1_2 = 
`SELECT bezeichnung, semester, ects 
FROM modul
JOIN modul_semester ON id = modul 
GROUP BY bezeichnung;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's multiple orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_2, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 1-3 =====`);

const student_1_3 = 
`SELECT bezeichnung, semester, ects 
FROM modul, modul_semester 
WHERE modul = id 
GROUP BY id, semester;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's multiple orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_1, student_1_3, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 2-X =====

const reference_2 = 
`SELECT semester
FROM modul
JOIN modul_semester ON (modul = id)
GROUP BY semester
HAVING COUNT(DISTINCT themengebiet) > 3;`;


console.log(`===== Szenario 2-1 =====`);

const student_2_1 = 
`select semester as semester 
from modul_semester 
join modul on id = modul 
group by semester 
having count(themengebiet) > 3;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_1, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 2-2 =====`);

const student_2_2 = 
`select semester as semester, 
count(themengebiet) as themengebiete 
from modul_semester 
join modul on modul = id 
group by semester 
having count(themengebiet) > 3;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_2, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 2-3 =====`);

const student_2_3 = 
`select semester AS semester 
from modul_semester 
join modul on modul = id 
group by semester 
having COUNT(distinct themengebiet) = 3;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_2, student_2_3, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 3-X =====

const reference_3 = 
`SELECT bezeichnung, SUM(ects) AS ects
FROM modul
JOIN modul_semester ON (modul = id)
GROUP BY id, bezeichnung;`;


console.log(`===== Szenario 3-1 =====`);

const student_3_1 = 
`select bezeichnung, count (ects) as ects 
from modul 
join modul_semester on id = modul 
group by id;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_1, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-2 =====`);

const student_3_2 = 
`SELECT bezeichnung, SUM(ects) AS ects 
FROM modul 
JOIN modul_semester ON id = modul 
GROUP BY bezeichnung;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_2, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-3 =====`);

const student_3_3 = 
`select bezeichnung, sum(ects) as ects 
from modul, modul_semester 
group by bezeichnung 
order by bezeichnung desc;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_3, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));


console.log(`===== Szenario 3-4 =====`);

const student_3_4 = 
`select bezeichnung, ects 
from modul 
join modul_semester on modul = id 
group by modul;`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_3, student_3_4, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




// ===== Szenarios 4-X =====

const reference_4 = 
`SELECT SUM(ects) AS summe
FROM modul
JOIN modul_semester ON (modul = id)
WHERE gop = "ja";`;


console.log(`===== Szenario 4-1 =====`);

const student_4_1 = 
`Select DISTINCT Sum(ects) as summe 
From modul_semester, modul 
Where gop = 'ja';`;

console.log(`calculating...`);
console.log(`WARNING: this may take some time! (For some reason it's orders of magnitude faster in the browser, where it was originally evaluated)`)
console.time();
[distance, steps, path] = await
    SQLQueryDistance.parseAndCalculateDistance(reference_4, student_4_1, schema, stringified_config);
console.timeEnd();
console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




console.log("\n\n");
})();
