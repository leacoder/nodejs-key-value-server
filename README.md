# nodejs-key-value-server
Light-weight key-value server.
Server works using standard nodejs 'net' library. Server requires two parameters to run, port number and host address.

```javascript
nodejs index.js -port=PORT -host=HOST
// e.g
nodejs index.js -port=8888 -host=127.0.0.1
```
Command line options:
* port - port number
* host - host address
* mamxmem - max memory size available for values (in MB)
* v - verbose

## Communication

Communication is done using commands. Command has a special format:

**COMMAND_NAME:::PARAM_1:::...:::PARAM_n**

Parameters are optional. Number of parameters depends on command.

### Available commands

#### get
**syntax:** get:::key

**returns:** string or undefined

Returns value assigned to key. If key doesn't exists command will return undefined.

#### set
**syntax:** set:::key:::value

**returns:** boolean

Creates new key and assigns value to it. If key exists value is reassigned. Command return true if key was created, false otherwise.

#### count

**syntax:** count

**returns:** int

Returns number of assgined keys

#### heapused

**syntax:** heapused

**returns:** int

Returns size of memory allocated by server (uses process.memoryUsage() command)

#### memsize

**syntax:** memsize

**returns:** int

Returns sum of lengths of all values

#### keys:

**syntax:** keys

**returns:** string (array in json format)

Returns array of all assigned keys

### Examples

```javascript
count	// returns 0
set:::test::test value // creates new key - test, and assigned "test value" to id
get:::test // returns "test value"
get:::test2 // returns undefined
count	// returns 1
```
