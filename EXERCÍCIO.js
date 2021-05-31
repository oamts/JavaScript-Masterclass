function parseCreateSQL(cmd) {
	const regExp = /table (\w+) \((.*)\)/;
	const result = regExp.exec(cmd);

	const tableName = result[1];
	const columnsObj = createColumnsObj(result[2].split(', '))

	return { tableName, columns: columnsObj };
}

function parseInsertSQL(cmd) {
	const regExp = /into (?<tableName>\w+) \((?<columns>.*?)\) values \((?<values>.*?)\)/;
	const result = regExp.exec(cmd);

	const tableName = result.groups.tableName
	const columns = result.groups.columns.split(', ');
	const values = result.groups.values.split(', ');

	return { tableName, columns, values }
}

function createColumnsObj(columns) {
	const columnsObj = {};
	for (const column of columns) {
		const data = column.split(' ');
		columnsObj[data[0]] = data[1];
	}
	return columnsObj;
};

function DatabaseError(statement, message) {
	this.statement = statement;
	this.message = message;
}

// Exercício 5

console.log(`
==§== Exercício 5 ==§==
`);

const database_5 = {
	createTable(cmd) {
		const { tableName, columns } = parseCreateSQL(cmd);
		this.tables = {
			[tableName]: {
				columns: columns,
				data: []
			}
		}
	},
	insert(cmd) {
		const { tableName, columns, values } = parseInsertSQL(cmd);
		const row = {};
		columns.forEach((_, index) => { row[columns[index]] = values[index]; });
		this.tables[tableName].data.push(row);
	},
	execute(cmd) {
		if (cmd.startsWith('create table')) {
			return this.createTable(cmd);
		} else if (cmd.startsWith('insert into')) {
			return this.insert(cmd);
		} else {
			throw new DatabaseError(cmd, `Syntax error: '${cmd}'`);
		};
	}
};

try {
	database_5.execute("create table author (id number, name string, age number, city string, state string, country string)");
	database_5.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
	database_5.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
	database_5.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");

	console.log(JSON.stringify(database_5, undefined, 2));
} catch (e) {
	console.log(e.message);
}
