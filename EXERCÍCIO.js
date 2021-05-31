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

function parseSelectSQL(cmd) {
	const regExp = /select (?<columns>.*) from (?<tableName>\w+)( where (?<columnWhere>\w+) = (?<valueWhere>\w+))?/;
	const result = regExp.exec(cmd);

	const tableName = result.groups.tableName
	const columns = result.groups.columns.split(', ');
	const columnWhere = result.groups.columnWhere;
	const valueWhere = result.groups.valueWhere;

	return { tableName, columns, columnWhere, valueWhere }
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

// Exercício 6

console.log(`
==§== Exercício 6 ==§==
`);

const database_6 = {
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
	select(cmd) {
		const { tableName, columns, columnWhere, valueWhere } = parseSelectSQL(cmd);
		return this.tables[tableName].data
			.filter(row => {
				if (columnWhere === undefined || valueWhere === undefined || row[columnWhere] === valueWhere)
					return true;
				else
					return false;
			})
			.map( row =>{
				return columns.reduce((resultRow, column) => {
					resultRow[column] = row[column];
					return resultRow
				}, {})
			})
	},
	execute(cmd) {
		if (cmd.startsWith('create table')) {
			return this.createTable(cmd);
		} else if (cmd.startsWith('insert into')) {
			return this.insert(cmd);
		} else if (cmd.startsWith('select')) {
			return this.select(cmd);
		} else {
			throw new DatabaseError(cmd, `Syntax error: '${cmd}'`);
		};
	}
};

try {
	database_6.execute("create table author (id number, name string, age number, city string, state string, country string)");
	database_6.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
	database_6.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
	database_6.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
	console.log(JSON.stringify(database_6.execute("select name, age from author"), undefined, "  "));
	console.log(JSON.stringify(database_6.execute("select name, age from author where id = 1"), undefined, "  "));
} catch (e) {
	console.log(e.message);
}
