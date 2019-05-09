var format = require('util').format;
var Promise = require('bluebird');
var split = require('split-fwd-slash');
var thesaurize = require('thesaurize');

const helps = {
    'thesaurize': [
        't/<target>',
        'Correct a previously said message.'
    ]
};

const _getNotice = function(msg) {
    return {
        intent: 'notice',
        query: true,
        message: msg
    };
};

var TennuThesaurize = {
    configDefaults: {
        'thesaurize': {
            'lookBackLimit': 60
        },
    },
    init: function(client) {

        var correctionConfig = client.config('thesaurize');

        var queueHandler = require('tennu-queue-handler')(correctionConfig.lookBackLimit);

        function router(IRCMessage) {
            return Promise.try(function() {

                // isSearchAndReplace will be null if there is nothing after the t/
                var isSearchAndReplace = IRCMessage.message.match(/^[T|t]\/(.+)/);

                if (!isSearchAndReplace) {
                    queueHandler.update(IRCMessage.message, IRCMessage.channel, IRCMessage.nickname);
                    return;
                }

                var splitMessage = split(IRCMessage.message);

                var target = splitMessage[1];

                return handleCorrection(target, IRCMessage.channel);

            }).catch(function(err) {
                client._logger.error(err);
            });
        }

        function handleCorrection(target, channel) {
            return queueHandler.findCorrectable(target, channel).then(function(maybeFound) {
                if (!maybeFound) {
                    return _getNotice(format('I searched the last %s in the cache but couldnt find anything with "%s" in it', correctionConfig.lookBackLimit, target));
                }
                return format('Correction, <%s> %s', maybeFound.nickname, thesaurize(maybeFound.message));
            });
        }

        return {
            handlers: {
                'privmsg': router,
            },
            help: {
                'thesaurize': helps.thesaurize
            },
            exports: {
                queueHandler: queueHandler
            }
        };

    }
};

module.exports = TennuThesaurize;
