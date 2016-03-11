# envvar

envvar is a tiny JavaScript package for deriving JavaScript values from
environment variables.

```javascript
const envvar = require('envvar');

const GITHUB_API_TOKEN = envvar.string('GITHUB_API_TOKEN');
const HTTP_MAX_SOCKETS = envvar.number('HTTP_MAX_SOCKETS');
const ENABLE_FEATURE_X = envvar.boolean('ENABLE_FEATURE_X', false);
```

If one argument is provided the environment variable is __required__. If the
environment variable is not set, an `envvar.UnsetVariableError` is thrown:

    UnsetVariableError: No environment variable named "GITHUB_API_TOKEN"

If two arguments are provided the environment variable is __optional__. If the
environment variable is not set, the default value is used. The default value
must be of type Boolean in the case of `envvar.boolean`, of type Number in the
case of `envvar.number`, or of type String in the case of `envvar.string`. If
it is not, a `TypeError` is thrown.

The value of the environment variable must be the string representation of a
value of the appropriate type: for `envvar.boolean` the only valid strings are
`'true'` and `'false'`; for `envvar.number` applying `Number` to the string
must not produce `NaN`. If the environment variable is set but does not have
a suitable value, an `envvar.ValueError` is thrown:

    ValueError: Value of process.env["HTTP_MAX_SOCKETS"] does not represent a number

### `envvar.enum`

This is similar to `envvar.string`, but with constraints. There may be a small
number of valid values for a given environment variable. For example:

```javascript
const NODE_ENV = envvar.enum('NODE_ENV', ['development', 'staging', 'production']);
```

This states that `process.env.NODE_ENV` must be set to `development`,
`staging`, or `production`.

A default value may be provided:

```javascript
const NODE_ENV = envvar.enum('NODE_ENV', ['development', 'staging', 'production'], 'production');
```

This states that `process.env.NODE_ENV` must either be unset (in which case the
default value is assumed), or set to `development`, `staging`, or `production`.
