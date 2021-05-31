let cmd = `create table author (id number, name string, age number, city string, state string, country string)`;

function parseSQL(cmd) {
	let regExp = /table (\w+) \((.*)\)/;
	let result = regExp.exec(cmd);
	return result;
}

function getTableName(cmd) {
	let result = parseSQL(cmd)
	let tableName = result[1];
	return tableName;
}

function getColumns(cmd) {
	let result = parseSQL(cmd)
	let tableName = result[2].split(', ');
	return tableName;
}

function createColumnsObj(columns) {
	let columnsObj = {};
	for (let column of columns) {
		let data = column.split(' ');
		columnsObj[data[0]] = data[1];
	}
	return columnsObj;
};

// Exercício 1

console.log(`
==§== Exercício 1 ==§==
`);

let tableName_1 = getTableName(cmd);
let columns_1 = getColumns(cmd);

console.log(tableName_1);
console.log(columns_1);

// Exercício 2

console.log(`
==§== Exercício 2 ==§==
`);

let columnsObj_2 = createColumnsObj(columns_1);

let database_2 = {
	tables: {
		[tableName_1]: {
			columns: columnsObj_2,
			data: []
		}
	}
};

console.log(JSON.stringify(database_2, null, '  '));

// Exercício 3

console.log(`
==§== Exercício 3 ==§==
`);

let database_3 = {
	createTable(cmd) {
		this.tables = {};

		let tableName = getTableName(cmd);
		let columns = getColumns(cmd);
		let columnsObj = createColumnsObj(columns);

		this.tables = {
			[tableName]: {
				columns: columnsObj,
				data: []
			}
		}
	},
	execute(cmd) {
		if (cmd.startsWith('create table'))
			this.createTable(cmd);
	}
};

database_3.execute(cmd);
console.log(JSON.stringify(database_3, null, '  '));

