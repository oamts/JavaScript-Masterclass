const languages = new Map([["Fortran", 1957], ["Lisp", 1958], ["COBOL", 1959]]);
const iterator = languages.values();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
