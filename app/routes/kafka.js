/*jslint node: true */
'use strict';

var path = require('path');
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client("centos-hdp:2181/"),
    producer = new Producer(client);

producer.addListener('ready', function() {
    console.log('Kafka producer is ready');
});

var PATH = '/api/kafka';
var VERSION = '1.0.0';

module.exports = function(server) {
    server.post({
        path: PATH + '/:topicId',
        version: VERSION
    }, sendToKafka);

    function sendToKafka(req, res, next) {
        if (producer) {
            var message = {
                topic: req.params.topicId,
                messages: JSON.stringify(req.body)
            }

            producer.send([message], function(err, data) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.send(200);
                }
            });
        }

        return next();
    }
};
