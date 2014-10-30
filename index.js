'use strict';


function UnsetVariableError(message) { this.message = message; }
UnsetVariableError.prototype = Object.create(Error.prototype);
UnsetVariableError.prototype.name = 'UnsetVariableError';
exports.UnsetVariableError = UnsetVariableError;

function ValueError(message) { this.message = message; }
ValueError.prototype = Object.create(Error.prototype);
ValueError.prototype.name = 'ValueError';
exports.ValueError = ValueError;


function def(type, coerce) {
  return function(name, value) {
    if (arguments.length < 2) {
      if (!Object.prototype.hasOwnProperty.call(process.env, name)) {
        throw new UnsetVariableError(
          'No environment variable named "' + name + '"'
        );
      }
    } else {
      if (!(Object(value) instanceof type)) {
        throw new TypeError(
          'Default value of process.env["' + name + '"] is not of type ' +
          type.name
        );
      }
      if (!Object.prototype.hasOwnProperty.call(process.env, name)) {
        return value;
      }
    }
    return coerce(name, process.env[name]);
  };
}


exports.boolean = def(Boolean, function(name, value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new ValueError(
    'Value of process.env["' + name + '"] is neither "true" nor "false"');
});

exports.number = def(Number, function(name, value) {
  var num = Number(value);
  if (num === num) return num;
  throw new ValueError(
    'Value of process.env["' + name + '"] does not represent a number');
});

exports.string = def(String, function(name, value) {
  return value;
});
