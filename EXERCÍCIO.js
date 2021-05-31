function Parser() {
	this.commands = new Map([
		['createTable', /create table (\w+) \((.*)\)/],
		['insert', /insert into (?<tableName>\w+) \((?<columns>.*?)\) values \((?<values>.*?)\)/],
		['select', /select (?<columns>.*) from (?<tableName>\w+)( where (?<columnWhere>\w+) = (?<valueWhere>\w+))?/],
		['delete', /delete from (?<tableName>\w+)( where (?<columnWhere>\w+) = (?<valueWhere>([\w ]+)))?/],
	]);
	this.parse = function (statement) {
		for (let [command, regexp] of this.commands) {
			const parsedStatement = statement.match(regexp);
			if (parsedStatement)
				return { command, parsedStatement }
		}
	};
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

// Exercício 8

console.log(`
==§== Exercício 8 ==§==
`);

const database_8 = {
	createTable(parsedStatement) {
		const tableName = parsedStatement[1];
		const columns = createColumnsObj(parsedStatement[2].split(', '))
		this.tables = {
			[tableName]: {
				columns: columns,
				data: []
			}
		}
	},
	insert(parsedStatement) {
		const tableName = parsedStatement.groups.tableName
		const columns = parsedStatement.groups.columns.split(', ');
		const values = parsedStatement.groups.values.split(', ');

		const row = {};
		columns.forEach((_, index) => { row[columns[index]] = values[index]; });
		this.tables[tableName].data.push(row);
	},
	select(parsedStatement) {
		const tableName = parsedStatement.groups.tableName
		const columns = parsedStatement.groups.columns.split(', ');
		const columnWhere = parsedStatement.groups.columnWhere;
		const valueWhere = parsedStatement.groups.valueWhere;

		return this.tables[tableName].data
			.filter(row => {
				if (columnWhere === undefined || valueWhere === undefined || row[columnWhere] === valueWhere)
					return true;
				else
					return false;
			})
			.map(row => {
				return columns.reduce((resultRow, column) => {
					resultRow[column] = row[column];
					return resultRow
				}, {})
			})
	},
	delete(parsedStatement) {
		const { tableName, columnWhere, valueWhere } = parsedStatement.groups;
		this.tables[tableName].data = this.tables[tableName].data
			.filter(row => row[columnWhere] !== valueWhere)
	},
	parser: new Parser(),
	execute(statement) {
		const { command, parsedStatement } = this.parser.parse(statement);
		if (!parsedStatement)
			throw new DatabaseError(statement, `Syntax error: '${statement}'`);
		return this[command](parsedStatement);
	}
};

try {
	database_8.execute("create table author (id number, name string, age number, city string, state string, country string)");
	database_8.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
	database_8.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
	database_8.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
	console.log(JSON.stringify(database_8, undefined, "  "));
	database_8.execute("delete from author where id = 2");
	console.log(JSON.stringify(database_8, undefined, "  "));
	console.log(database_8.execute("select name, age from author"));

} catch (e) {
	console.log(e.message);
}