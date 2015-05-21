var util = require('util');
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;

var shitty = exports;
shitty.shell = 'bash';
shitty.args = [];
shitty.feed = '\n';

shitty.shit = function shit() {
    if (!(this instanceof shitty.shit)) return new shitty.shit();
    EventEmitter.call(this);
    this.totallyShit = null;
    this.lessShit = this;
    this.bigShit = '';
    this.toilet = [];
    this.stop = null;
    this.timeout = -1;
};
util.inherits(shitty.shit, EventEmitter);

shitty.shit.prototype.shot = function shot(pee) {
    this.totallyShit.stdin.write(pee + shitty.feed);
};

shitty.shit.prototype.grab = function grab(tip) {
    var fun;
    if (typeof tip === 'string' || tip instanceof String) {
        fun = function (poo) {
            var whereIsStuck = poo.lastIndexOf(tip);
            var shitSize = poo.length - tip.length;
            return (whereIsStuck >= 0) && (whereIsStuck === shitSize);
        };
    } else if (tip instanceof RegExp) {
        fun = function (poo) {
            return tip.test(poo);
        };
    } else if (typeof tip === 'function') {
        fun = tip;
    } else {
        throw tip;
    }
    this.toilet.push({ what: 'plunger', tip: fun});
    var moreShit = Object.create(this);
    moreShit.till = function till(sec) {
        this.toilet.push({ what: 'doorbell', sec: sec});
        var yetAnotherMoreShit = Object.create(this);
        yetAnotherMoreShit.fail = function fail(alt) {
            this.toilet.push({ what: 'tumble', alt: alt});
            return this.lessShit;
        }.bind(this);
        return yetAnotherMoreShit;
    }.bind(this);
    return moreShit;
};

shitty.shit.prototype.toss = function toss(cmd) {
    this.toilet.push({ what: 'tissue', cmd: cmd });
    return this.lessShit;
};

shitty.shit.prototype.burp = function burp(fun) {
    this.toilet.push({ what: 'gas', fun: fun });
    return this.lessShit;
};

shitty.shit.prototype.wait = function wait(sec) {
    this.toilet.push({ what: 'constipation', sec: sec });
    return this.lessShit;
};

shitty.shit.prototype.bung = function bung(fin) {
    return new Promise(function (resolve, reject) {
        var totallyShit = this.totallyShit = spawn(
            shitty.shell,
            shitty.args,
            { cwd: process.cwd(), env: process.env }
        );
        var waiting = false;
        var newShit = false;
        var flush = this.toilet.reverse();
        this.toilet = null;
        this.stop = function (reason) {
            totallyShit.kill();
            reject(reason);
        };
        totallyShit.stdout.on('data', function (chunk) {
            this.bigShit += chunk.toString();
            this.emit('stdout', chunk);
            newShit = true;
            poop.call(this);
        }.bind(this));
        totallyShit.stderr.on('data', function (chunk) {
            this.emit('stderr', chunk);
        }.bind(this));
        totallyShit.on('close', reject);
        totallyShit.on('exit', reject);
        poop.call(this);
        function poop(shit) {
            if (waiting) {
                if (shit) flush.push(shit);
                return false;
            }
            if (!shit) {
                if (flush.length) {
                    while (poop.call(this, flush.pop()));
                } else {
                    totallyShit.kill();
                    resolve(fin);
                }
                return false;
            }
            switch (shit.what) {
            case 'plunger': {
                var nextShit = flush.pop();
                if (nextShit) {
                    if (nextShit.what === 'doorbell') {
                        var yetAnotherNextShit = flush.pop();
                        var dirtyJob = function () {};
                        if (yetAnotherNextShit) {
                            if (yetAnotherNextShit.what === 'tumble') {
                                dirtyJob = yetAnotherNextShit.alt;
                            } else {
                                flush.push(yetAnotherNextShit);
                            }
                        }
                        waiting = true;
                        this.timeout = setTimeout(function () {
                            if (dirtyJob.length === 0) {
                                dirtyJob.call(this);
                                waiting = false;
                                poop.call(this);
                            } else {
                                dirtyJob.call(this, function () {
                                    waiting = false;
                                    poop.call(this);
                                }.bind(this));
                            }
                        }.bind(this), nextShit.sec * 1000);
                    } else {
                        flush.push(nextShit);
                    }
                }
                if (newShit) {
                    newShit = false;
                    var litmus = shit.tip.call(this, this.bigShit);
                    if (litmus) {
                        this.bigShit = '';
                        waiting = false;
                        clearTimeout(this.timeout);
                    } else {
                        flush.push(shit);
                    }
                    return litmus;
                } else {
                    flush.push(shit);
                }
            } return false;
            case 'tissue': {
                this.shot(shit.cmd);
            } return true;
            case 'gas': {
                shit.fun.call(this);
            } return true;
            case 'constipation': {
                waiting = true;
                setTimeout(function () {
                    waiting = false;
                    poop.call(this);
                }.bind(this), shit.sec * 1000);
            } return false;
            default: {
                totallyShit.kill();
                reject(shit);
            } return false;
            }
        }
    }.bind(this.lessShit));
};
