var Sequelize = require(__dirname + "/../../lib/sequelize/Sequelize").Sequelize
var h = Sequelize.Helper
var assert = require("assert")

module.exports = {
  'SQL: manyToManyTableName': function() {
    assert.equal(h.SQL.manyToManyTableName('foo', 'bar'), 'BarFoo')
    assert.equal(h.SQL.manyToManyTableName('bar','foo'), 'BarFoo')
  },
  'SQL: asTableIdentifier': function() {
    assert.equal(h.SQL.asTableIdentifier('Users'), 'userId')
    assert.equal(h.SQL.asTableIdentifier('Children'), 'childId')
    assert.equal(h.SQL.asTableIdentifier('Children'), 'childId')
    assert.equal(h.SQL.asTableIdentifier('Mice'), 'mouseId')
  },
  'SQL: asTableName': function() {
    assert.equal(h.SQL.asTableName('User'), 'Users')
    assert.equal(h.SQL.asTableName('Child'), 'Children')
    assert.equal(h.SQL.asTableName('Mouse'), 'Mice')
  },
  'SQL: asTableName with options': function() {
    h.configure({ disableTableNameModification: true })
    assert.equal(h.SQL.asTableName('User'), 'User')
    assert.equal(h.SQL.asTableName('Child'), 'Child')
    assert.equal(h.SQL.asTableName('Mouse'), 'Mouse')
    h.configure({ disableTableNameModification: false })
  },
  'SQL: asSqlDate': function() {
    var d = new Date(Date.parse("Tue, 1 Jan 2000 00:00:00 GMT"))
    assert.equal(h.SQL.asSqlDate(d), '2000-01-01 01:00:00')
  },
  'SQL: valuesForInsertQuery': function() {
    var s = new Sequelize('sequelize_test', 'test', 'test')
    var Day = s.define('Day', { name: Sequelize.TEXT })
    var result = h.SQL.valuesForInsertQuery(new Day({name: 'asd'}))
    assert.eql(result, ["'asd'", 'NULL', 'NULL'])
  },
  'SQL: fieldsForInsertQuery': function() {
    var s = new Sequelize('sequelize_test', 'test', 'test')
    var Day = s.define('Day', { name: Sequelize.TEXT })
    var result = h.SQL.fieldsForInsertQuery(new Day({name: 'asd'}))
    assert.eql(result, '`name`, `createdAt`, `updatedAt`')
  },
  'SQL: transformValueByDataType': function() {
    assert.equal(h.SQL.transformValueByDataType('asd',  {type: Sequelize.STRING}), "'asd'")
    assert.equal(h.SQL.transformValueByDataType('asd',  {type: Sequelize.TEXT}), "'asd'")
    assert.equal(h.SQL.transformValueByDataType(6,      {type: Sequelize.INTEGER}), "6")
    assert.equal(h.SQL.transformValueByDataType(null,   {type: Sequelize.INTEGER}), "NULL")
    assert.equal(h.SQL.transformValueByDataType(null,   {type: Sequelize.STRING}), "NULL")
    assert.equal(h.SQL.transformValueByDataType(null,   {type: Sequelize.TEXT}), "NULL")

    var d = new Date(Date.parse("Tue, 1 Jan 2000 00:00:00 GMT"))
    assert.equal(h.SQL.transformValueByDataType(d, {type: Sequelize.DATE}), "'2000-01-01 01:00:00'")
  },
  'SQL: valuesForUpdate': function() {
    var s = new Sequelize('sequelize_test', 'test', 'test')
    var Day = s.define('Day', { name: Sequelize.TEXT })
    var day = new Day({name: 'asd'})
    assert.equal(h.SQL.valuesForUpdate(day), "`name` = 'asd', `createdAt` = NULL, `updatedAt` = NULL")
    assert.equal(h.SQL.valuesForUpdate(day, {seperator: '; '}), "`name` = 'asd'; `createdAt` = NULL; `updatedAt` = NULL")
  },
  'SQL: hashToWhereConditions': function() {
    var s = new Sequelize('sequelize_test', 'test', 'test')
    var Day = s.define('Day', { name: Sequelize.TEXT })
    var day = new Day({name: 'asd'})
    assert.equal(h.SQL.hashToWhereConditions(5, Day.attributes), '`id`=5')
    assert.equal(h.SQL.hashToWhereConditions({name: 'asd'}, Day.attributes), "`name`='asd'")
  },
  'SQL: addPrefix': function() {
    assert.equal(h.SQL.addPrefix('foo', 'bar', true), 'fooBar')
    assert.equal(h.SQL.addPrefix('foo', 'bar', false), 'fooBars')
  },
  'getDataTypeForValue': function() {
    var fct = h.SQL.getDataTypeForValue
    assert.equal(fct(1), Sequelize.INTEGER)
    assert.equal(fct(1.2), Sequelize.FLOAT)
    assert.equal(fct("1"), Sequelize.TEXT)
    assert.equal(fct(new Date()), Sequelize.DATE)
    assert.equal(fct(true), Sequelize.BOOLEAN)
  }
}