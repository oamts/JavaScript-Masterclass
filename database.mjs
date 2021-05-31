import DatabaseError from './databaseError.mjs'
import Parser from './parser.mjs'

export default class Database {
	constructor(){
		this.tables = {};
		this.parser = new Parser();
	}

	createTable(parsedStatement) {
		const tableName = parsedStatement[1];
		const columns = parsedStatement[2].split(', ')
		const columnsObj = {};
		for (const column of columns) {
			const data = column.split(' ');
			columnsObj[data[0]] = data[1];
		}

		this.tables = {
			[tableName]: {
				columns: columnsObj,
				data: []
			}
		}
	}

	insert(parsedStatement) {
		const tableName = parsedStatement.groups.tableName
		const columns = parsedStatement.groups.columns.split(', ');
		const values = parsedStatement.groups.values.split(', ');

		const row = {};
		columns.forEach((_, index) => { row[columns[index]] = values[index]; });
		this.tables[tableName].data.push(row);
	}

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
	}

	delete(parsedStatement) {
		const { tableName, columnWhere, valueWhere } = parsedStatement.groups;
		this.tables[tableName].data = this.tables[tableName].data
			.filter(row => row[columnWhere] !== valueWhere)
	}
	
	execute(statement) {
		const { command, parsedStatement } = this.parser.parse(statement);
		if (!parsedStatement)
			throw new DatabaseError(statement, `Syntax error: '${statement}'`);
		return this[command](parsedStatement);
	}
};