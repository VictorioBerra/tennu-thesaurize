/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "should" }]*/
/*global describe*/
/*global it*/

var should = require('should');

var plugin = require('../plugin').init({
    _logger: {
        error: () => {} // noop
    },
    config: function() {
        return {
            lookBackLimit: 3
        };
    }
});

should.Assertion.add('noticeFailure', function() {
    this.params = {
        operator: 'to be a notice with an error in the message'
    };

    this.obj.should.have.property('intent').which.is.equal('notice');
    this.obj.should.have.property('query').which.is.equal(true);
    this.obj.should.have.property('message').which.is.not.empty();
});

describe('tennu-thesaurize', function() {

    describe('t/', function() {

        it('Should thesaurize a newly added message.', function() {
            plugin.handlers['privmsg']({
                message: 'hello world',
                nickname: 'tester',
                channel: '#helloworld'
            });
            plugin.handlers['privmsg']({
                message: 't/hello world',
                nickname: 'smith',
                channel: '#helloworld'
            }).should.eventually.startWith('Correction, <tester> ');
        });

        it('Should thesaurize a newly added message.', function() {
            plugin.handlers['privmsg']({
                message: 'hello world',
                nickname: 'tester',
                channel: '#helloworld'
            });
            plugin.handlers['privmsg']({
                message: 't/hello world',
                nickname: 'smith',
                channel: '#helloworld'
            }).should.eventually.not.startWith('Correction, <tester> hello');
        });
    
        it('Should fail with incorrect number of arguments', function() {
            plugin.handlers['privmsg']({
                message: 't/',
                nickname: 'smith',
                channel: '#helloworld'
            }).then(r => should(r).be.undefined());
        });

    });

});
