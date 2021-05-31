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

function DatabaseError(statement, message) {
	this.statement = statement;
	this.message = message;
}

// Exercício 4

console.log(`
==§== Exercício 4 ==§==
`);

let database_4 = {
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
		if (cmd.startsWith('create table')) {
			return this.createTable(cmd);
		} else {
			throw new DatabaseError(cmd, `Syntax error: '${cmd}'`);
		};
	}
};

try {
	database_4.execute('create table author (id number, name string, age number, city string, state string, country string)');
	//database_4.execute('select id, name from author');
	console.log(JSON.stringify(database_4, undefined, 2));
} catch (e) {
	console.log(e.message);
}
