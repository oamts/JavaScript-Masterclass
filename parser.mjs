export default class Parser {
	constructor() {
		this.commands = new Map([
			['createTable', /create table (\w+) \((.*)\)/],
			['insert', /insert into (?<tableName>\w+) \((?<columns>.*?)\) values \((?<values>.*?)\)/],
			['select', /select (?<columns>.*) from (?<tableName>\w+)( where (?<columnWhere>\w+) = (?<valueWhere>\w+))?/],
			['delete', /delete from (?<tableName>\w+)( where (?<columnWhere>\w+) = (?<valueWhere>([\w ]+)))?/],
		]);
	}

	parse(statement) {
		for (let [command, regexp] of this.commands) {
			const parsedStatement = statement.match(regexp);
			if (parsedStatement)
				return { command, parsedStatement };
		}
		return {};
	};
}