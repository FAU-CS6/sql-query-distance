const SQLQueryDistance = require('./dist/index');


const schema1 =
`students(id, name, age, subject)
teachers(id)`;

const start_query_of_shortcut_example =
    "SELECT students.id, students.name, students.age, teachers.id FROM students, teachers";
const destination_query_of_shortcut_example = "SELECT students.*, teachers.id FROM students, teachers";

const query_with_alias_for_the_table_students = "SELECT s.id FROM students s";
const query_with_different_alias_for_the_table_students = "SELECT stud.id FROM students stud";
const query_without_alias_for_the_table_students = "SELECT id FROM students";


const schema2 =
`students(id, name)
teachers(tid)`;

const destination_query = "SELECT name FROM students JOIN teachers ON id = tid";
const semantically_equivalent_start_query = "SELECT name FROM students, teachers WHERE id = tid";
const start_query_with_distance_1 = "SELECT name FROM students, teachers WHERE NOT id = tid";
const start_query_with_distance_3 = "SELECT DISTINCT name FROM students, teachers WHERE NOT id = tid";
const complete_destination_query = "SELECT AVG( id ) FROM students";
const incomplete_destination_query = "SELECT AVG(    ) FROM students";
const query_with_two_columns = "SELECT id, name FROM students";
const query_with_swapped_columns = "SELECT name, id FROM students";

const complete_destination_query_ast = SQLQueryDistance.parseQuery(complete_destination_query);
// the 3rd party SQL parser module "node-sql-parser" cannot parse incomplete queries, 
// so we have to build this one manually
const incomplete_destination_query_ast = complete_destination_query_ast.setSelectElement(0,
    complete_destination_query_ast.getSelect(0).setExpression(
        complete_destination_query_ast.getSelect(0).expression.setArgument(null)));

const modified_config = SQLQueryDistance.createDefaultConfig();
// if we don't care about the order of SELECT-elements, 
// we can give the respective swap-edit a cost of 0
modified_config.get("swapSelectElements").cost = 0;


(async () => {
    let distance, steps, path;

    console.log("\n\n\n\n");
    console.log("Postponing test to the end, because it takes relatively long in Node:");
    console.log(`"${start_query_of_shortcut_example}" \n--> "${destination_query_of_shortcut_example}"`);




    console.log("\n\n\n\n");
    console.log(`Testing: "${query_with_alias_for_the_table_students}" equals "${query_with_different_alias_for_the_table_students}":`);
    console.log(SQLQueryDistance.parseQuery(query_with_alias_for_the_table_students).equals(
        SQLQueryDistance.parseQuery(query_with_different_alias_for_the_table_students)));

    console.log("\n");
    console.log(`Testing: "${query_with_alias_for_the_table_students}" equals "${query_without_alias_for_the_table_students}":`);
    console.log(SQLQueryDistance.parseQuery(query_with_alias_for_the_table_students).equals(
        SQLQueryDistance.parseQuery(query_without_alias_for_the_table_students)));

    console.log("\n");
    console.log(`Testing: "${query_with_different_alias_for_the_table_students}" equals "${query_without_alias_for_the_table_students}":`);
    console.log(SQLQueryDistance.parseQuery(query_with_different_alias_for_the_table_students).equals(
        SQLQueryDistance.parseQuery(query_without_alias_for_the_table_students)));




    console.log("\n\n\n\n");
    console.log(`Testing: "${semantically_equivalent_start_query}" --> "${destination_query}":`);
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(destination_query, semantically_equivalent_start_query, schema2);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n\n\n");
    console.log(`Testing: "${start_query_with_distance_1}" --> "${destination_query}":`);
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(destination_query, start_query_with_distance_1, schema2);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n\n\n");
    console.log(`Testing: "${start_query_with_distance_3}" --> "${destination_query}":`);
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(destination_query, start_query_with_distance_3, schema2);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




    console.log("\n\n\n\n");
    console.log(`Testing: "${incomplete_destination_query}" --> "${complete_destination_query}":`);
    console.time();
    [distance, steps, path] = await SQLQueryDistance.calculateDistance(
        complete_destination_query_ast, incomplete_destination_query_ast, SQLQueryDistance.parseSchema(schema2));
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n\n\n");
    console.log("Postponing test to the end, because it takes relatively long in Node:");
    console.log(`empty AST --> "${destination_query}":`);




    console.log("\n\n\n\n");
    console.log(`Testing with default configuration: "${query_with_swapped_columns}" --> "${query_with_two_columns}":`);
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(query_with_two_columns, query_with_swapped_columns, schema2);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n\n\n");
    console.log(`Testing with modified configuration: "${query_with_swapped_columns}" --> "${query_with_two_columns}":`);
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(query_with_two_columns, query_with_swapped_columns, schema2,
            SQLQueryDistance.stringifyConfig(modified_config));
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));




    console.log("\n\n\n\n");
    console.log(`Testing: "${start_query_of_shortcut_example}" \n--> "${destination_query_of_shortcut_example}":`);
    console.log("WARNING: this might take a bit of time!"
        +" (for some reason, it's way faster in the browser)");
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(destination_query_of_shortcut_example, start_query_of_shortcut_example, schema1);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n\n\n");
    console.log(`Testing: empty AST --> "${destination_query}":`);
    console.log("WARNING: this might take a bit of time!"
        +" (for some reason, it's way faster in the browser)");
    console.time();
    [distance, steps, path] = await
        SQLQueryDistance.parseAndCalculateDistance(destination_query, undefined, schema2);
    console.timeEnd();
    console.log(SQLQueryDistance.stringifyDistance(distance, steps, path));

    console.log("\n\n");
})();
