var net = require('net');
var socketCache = require('./cache.js');
var args = require('margs').setDefault({maxmem: 100});

var host = args.get('host');
var port = args.get('port');
var maxMem = args.get('maxmem');

if (host === undefined && port === undefined) {
    console.log('nodejs index.js -port=<PORT> -host=<HOST>');
    process.exit();
}

function verbose(message) {
    if (args.get('v') === true) {
        console.log(message);
    }
}

/**
 * Command 'SET'
 * e.g. set:::key:::[1,2,3]
 */
socketCache.commands.register('set', function (params) {
    verbose('Command: SET');
    var memAllocated = socketCache.cache.memsize();
    if (memAllocated / (1024 * 1024) > maxMem) {
        return 'ERROR:Memory limit error';
    } else {
        return socketCache.cache.set(params[1], params[2]) ? true : false;
    }
});

/**
 * Command 'GET'
 * e.g. get:::key
 */
socketCache.commands.register('get', function (params) {
    verbose('Command: GET');
    return socketCache.cache.get(params[1]);
});

/**
 * Command 'COUNT'
 * e.g. count
 */
socketCache.commands.register('count', function (params) {
    verbose('Command: COUNT');
    return socketCache.cache.count();
});

/**
 * Commands 'HEAPUSED'
 * e.g. heapused
 */
socketCache.commands.register('heapused', function (params) {
    verbose('Command: HEAPUSED');
    return socketCache.cache.heapused();
});

/**
 * Commands 'MEMSIZE'
 * e.g. memsize
 */
socketCache.commands.register('memsize', function (params) {
    verbose('Command: MEMSIZE');
    return socketCache.cache.memsize();
});

socketCache.commands.register('keys', function (params) {
    verbose('Command: KEYS');
    return JSON.stringify(socketCache.cache.keys());
});

function parseData(data, cb) {
    var result,
        command;
    data = data.split(':::');
    command = data[0];
    if (!socketCache.commands.is(command)) {
        result = 'ERROR:Command unknown (' + command + ')';
    } else {
        result = socketCache.commands.invoke(command, data);
    }
    if (cb) {
        cb(result);
    }
}

net.createServer(function (sock) {
    sock.setEncoding('utf8');

    sock.on('data', function (data) {
        setTimeout(function (data, cb) {
            parseData(data, cb);
        }(data, function (result) { sock.write(result + "\n") }), 0);
    });

    sock.on('close', function (data) {
    });

    sock.on('error', function (error) {
    });

}).listen(port, host);

console.log('Server listening on ' + host + ':' + port);
