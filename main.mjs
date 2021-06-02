import Database from './database.mjs';

console.time('db');
let database = new Database();
database
	.execute("create table author (id number, name string, age number, city string, state string, country string)")
	.then(db => {
		return Promise.all([
			db.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)"),
			db.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)"),
			db.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)")
		]);
	})
	.then(([db]) => db.execute("select name, age from author"))
	.then(data => console.log(data))
	.finally(() => {
		console.timeEnd('db');
	})
	.catch(e => {
		console.log(e.message)
	});

