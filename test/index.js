'use strict';

/* global beforeEach, describe, it */

var assert = require('assert');

var envvar = require('..');


var eq = assert.strictEqual;

var errorEq = function(type, message) {
  return function(err) {
    return err.name === type.name && err.message === message;
  };
};

var throws = assert.throws;


beforeEach(function() { delete process.env.FOO; });


describe('envvar.UnsetVariableError', function() {

  it('inherits from Error', function() {
    eq(new envvar.UnsetVariableError() instanceof Error, true);
  });

  it('is named "UnsetVariableError"', function() {
    eq(new envvar.UnsetVariableError().name, 'UnsetVariableError');
  });

  it('accepts a message argument', function() {
    eq(new envvar.UnsetVariableError('XXX').message, 'XXX');
  });

});


describe('envvar.ValueError', function() {

  it('inherits from Error', function() {
    eq(new envvar.ValueError() instanceof Error, true);
  });

  it('is named "ValueError"', function() {
    eq(new envvar.ValueError().name, 'ValueError');
  });

  it('accepts a message argument', function() {
    eq(new envvar.ValueError('XXX').message, 'XXX');
  });

});


describe('envvar.boolean', function() {

  it('throws if applied to too few arguments', function() {
    throws(function() { envvar.boolean(); },
           errorEq(Error, 'Too few arguments'));
  });

  it('throws if applied to too many arguments', function() {
    throws(function() { envvar.boolean(1, 2, 3); },
           errorEq(Error, 'Too many arguments'));
  });

  it('throws a TypeError if default value is not Boolean', function() {
    throws(function() { envvar.boolean('FOO', 'true'); },
           errorEq(TypeError,
                   'Default value of process.env["FOO"] ' +
                   'is not of type Boolean'));
  });

  it('throws a ValueError if value is neither "true" nor "false"', function() {
    process.env.FOO = '1';
    throws(function() { envvar.boolean('FOO'); },
           errorEq(envvar.ValueError,
                   'Value of process.env["FOO"] ' +
                   'is neither "true" nor "false"'));
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() { envvar.boolean('FOO'); },
           errorEq(envvar.UnsetVariableError,
                   'No environment variable named "FOO"'));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.boolean('FOO', true), true);
    eq(envvar.boolean('FOO', false), false);
  });

  it('ignores default value if variable is set', function() {
    process.env.FOO = 'true';
    eq(envvar.boolean('FOO', true), true);
    eq(envvar.boolean('FOO', false), true);

    process.env.FOO = 'false';
    eq(envvar.boolean('FOO', true), false);
    eq(envvar.boolean('FOO', false), false);
  });

  it('coerces value to Boolean', function() {
    process.env.FOO = 'true';
    eq(envvar.boolean('FOO'), true);

    process.env.FOO = 'false';
    eq(envvar.boolean('FOO'), false);
  });

});


describe('envvar.number', function() {

  it('throws if applied to too few arguments', function() {
    throws(function() { envvar.number(); },
           errorEq(Error, 'Too few arguments'));
  });

  it('throws if applied to too many arguments', function() {
    throws(function() { envvar.number(1, 2, 3); },
           errorEq(Error, 'Too many arguments'));
  });

  it('throws a TypeError if default value is not a number', function() {
    throws(function() { envvar.number('FOO', '42'); },
           errorEq(TypeError,
                   'Default value of process.env["FOO"] ' +
                   'is not of type Number'));
  });

  it('throws a ValueError if value does not represent a number', function() {
    process.env.FOO = '1.2.3';
    throws(function() { envvar.number('FOO'); },
           errorEq(envvar.ValueError,
                   'Value of process.env["FOO"] does not represent a number'));
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() { envvar.number('FOO'); },
           errorEq(envvar.UnsetVariableError,
                   'No environment variable named "FOO"'));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.number('FOO', 42), 42);
  });

  it('ignores default value if variable is set', function() {
    process.env.FOO = '123.45';
    eq(envvar.number('FOO', 42), 123.45);
  });

  it('coerces value to number', function() {
    process.env.FOO = '42';
    eq(envvar.number('FOO'), 42);
  });

});


describe('envvar.string', function() {

  it('throws if applied to too few arguments', function() {
    throws(function() { envvar.string(); },
           errorEq(Error, 'Too few arguments'));
  });

  it('throws if applied to too many arguments', function() {
    throws(function() { envvar.string(1, 2, 3); },
           errorEq(Error, 'Too many arguments'));
  });

  it('throws a TypeError if default value is not a string', function() {
    throws(function() { envvar.string('FOO', 42); },
           errorEq(TypeError,
                   'Default value of process.env["FOO"] ' +
                   'is not of type String'));
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() { envvar.string('FOO'); },
           errorEq(envvar.UnsetVariableError,
                   'No environment variable named "FOO"'));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.string('FOO', 'quux'), 'quux');
  });

  it('ignores default value if variable is set', function() {
    process.env.FOO = 'baz';
    eq(envvar.string('FOO', 'quux'), 'baz');
  });

  it('returns value', function() {
    process.env.FOO = 'quux';
    eq(envvar.string('FOO'), 'quux');
  });

});


describe('envvar.enum', function() {

  it('throws if applied to too few arguments', function() {
    throws(function() { envvar.enum(); },
           errorEq(Error, 'Too few arguments'));
    throws(function() { envvar.enum(1); },
           errorEq(Error, 'Too few arguments'));
  });

  it('throws if applied to too many arguments', function() {
    throws(function() { envvar.enum(1, 2, 3, 4); },
           errorEq(Error, 'Too many arguments'));
  });

  it('throws a TypeError if the type contains non-string members', function() {
    throws(function() { envvar.enum('FOO', ['0', '1', 2]); },
           errorEq(TypeError,
                   'Enumerated types must consist solely of string values'));
    throws(function() { envvar.enum('FOO', ['0', '1', 2], '0'); },
           errorEq(TypeError,
                   'Enumerated types must consist solely of string values'));
  });

  it('throws a TypeError if default value is not a string', function() {
    throws(function() { envvar.enum('FOO', ['0', '1', '2'], 0); },
           errorEq(TypeError,
                   'Default value of process.env["FOO"] ' +
                   'is not of type String'));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.enum('FOO', ['0', '1', '2'], '0'), '0');
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    throws(function() { envvar.enum('FOO', ['0', '1', '2']); },
           errorEq(envvar.UnsetVariableError,
                   'No environment variable named "FOO"'));
  });

  it('throws a ValueError if value is not a member of the type', function() {
    process.env.FOO = 'X';
    throws(function() { envvar.enum('FOO', ['0', '1', '2']); },
           errorEq(envvar.ValueError,
                   'Value of process.env["FOO"] ' +
                   'is not a member of (0 | 1 | 2)'));
    throws(function() { envvar.enum('FOO', ['0', '1', '2'], '0'); },
           errorEq(envvar.ValueError,
                   'Value of process.env["FOO"] ' +
                   'is not a member of (0 | 1 | 2)'));
  });

  it('returns value', function() {
    process.env.FOO = '2';
    eq(envvar.enum('FOO', ['0', '1', '2']), '2');
  });

});
