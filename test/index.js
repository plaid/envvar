'use strict';

/* global beforeEach, describe, it */

var assert = require('assert');

var envvar = require('..');


var eq = assert.strictEqual;

function createMatcher(type, message) {
  return function(err) {
    return err instanceof type && err.message === message;
  };
}


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

  it('coerces value to Boolean', function() {
    process.env.FOO = 'true';
    eq(envvar.boolean('FOO'), true);

    process.env.FOO = 'false';
    eq(envvar.boolean('FOO'), false);
  });

  it('throws a ValueError if value is neither "true" nor "false"', function() {
    process.env.FOO = '1';
    assert.throws(function() { envvar.boolean('FOO'); }, createMatcher(
      envvar.ValueError,
      'Value of process.env["FOO"] is neither "true" nor "false"'
    ));
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    assert.throws(function() { envvar.boolean('FOO'); }, createMatcher(
      envvar.UnsetVariableError,
      'No environment variable named "FOO"'
    ));
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

  it('throws a ValueError if default value is not Boolean', function() {
    assert.throws(function() { envvar.boolean('FOO', 'true'); }, createMatcher(
      TypeError,
      'Default value of process.env["FOO"] is not of type Boolean'
    ));
  });

});


describe('envvar.number', function() {

  it('coerces value to number', function() {
    process.env.FOO = '42';
    eq(envvar.number('FOO'), 42);
  });

  it('throws a ValueError if value does not represent a number', function() {
    process.env.FOO = '1.2.3';
    assert.throws(function() { envvar.number('FOO'); }, createMatcher(
      envvar.ValueError,
      'Value of process.env["FOO"] does not represent a number'
    ));
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    assert.throws(function() { envvar.number('FOO'); }, createMatcher(
      envvar.UnsetVariableError,
      'No environment variable named "FOO"'
    ));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.number('FOO', 42), 42);
  });

  it('ignores default value if variable is set', function() {
    process.env.FOO = '123.45';
    eq(envvar.number('FOO', 42), 123.45);
  });

  it('throws a ValueError if default value is not a number', function() {
    assert.throws(function() { envvar.number('FOO', '42'); }, createMatcher(
      TypeError,
      'Default value of process.env["FOO"] is not of type Number'
    ));
  });

});


describe('envvar.string', function() {

  it('returns value', function() {
    process.env.FOO = 'quux';
    eq(envvar.string('FOO'), 'quux');
  });

  it('throws an UnsetVariableError if variable is not set', function() {
    assert.throws(function() { envvar.string('FOO'); }, createMatcher(
      envvar.UnsetVariableError,
      'No environment variable named "FOO"'
    ));
  });

  it('returns default value if variable is not set', function() {
    eq(envvar.string('FOO', 'quux'), 'quux');
  });

  it('ignores default value if variable is set', function() {
    process.env.FOO = 'baz';
    eq(envvar.string('FOO', 'quux'), 'baz');
  });

  it('throws a ValueError if default value is not a string', function() {
    assert.throws(function() { envvar.string('FOO', 42); }, createMatcher(
      TypeError,
      'Default value of process.env["FOO"] is not of type String'
    ));
  });

});
