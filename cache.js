exports.cache = (function () {
    'use strict';
    var cache = {};

    function set(key, value) {
        cache[key] = value;
        return true;
    }

    function get(key) {
        if (cache[key]) {
            return cache[key];
        } else {
            return undefined;
        }
    }

    function getAll() {
        return cache;
    }

    function count() {
        var i,
            count = 0;
        for (var i in cache) {
            if (cache.hasOwnProperty(i)) {
                count = count + 1;
            }
        }
        return count;
    }

    function heapused() {
        return process.memoryUsage().heapUsed;
    }

    function memsize() {
        var i,
            memcount = 0;
        for (var i in cache) {
            if (cache.hasOwnProperty(i)) {
                memcount = memcount + cache[i].length;
            }
        }
        return memcount;
    }

    function keys() {
        var i,
            keys = [];
        for (var i in cache) {
            if (cache.hasOwnProperty(i)) {
                keys.push(i);
            }
        }
        return keys;
    }

    return {
        set: set,
        get: get,
        getAll: getAll,
        count: count,
        heapused: heapused,
        memsize: memsize,
        keys: keys
    };
}());

exports.commands = (function () {
    'use strict';
    var commands = {};

    function register(command, cb) {
        if (typeof command !== 'string') {
            throw "Wrong command parameter";
        }
        command = command.toLowerCase();
        commands[command] = cb;
    }

    function invoke(command, params) {
        if (typeof command !== 'string') {
            throw "Wrong command parameter";
        }
        command = command.toLowerCase();
        if (!commands[command]) {
            throw "Unknown command";
        }
        return commands[command](params);
    }

    /**
     * Check if command exists
     *
     * @method is
     * @param command {string}
     * @return {boolean}
     */
    function is(command) {
        if (typeof command === 'string') {
            return commands[command] ? true : false;
        }
        return false;
    }

    return {
        register: register,
        invoke: invoke,
        is: is
    };
}());
