const SmartApp = require('@smartthings/smartapp');
const express = require('express');
const server = express();
const PORT = 8080;


/* Define the SmartApp */
const smartapp = new SmartApp()
    .enableEventLogging(2) // logs all lifecycle event requests and responses as pretty-printed JSON. Omit in production
    .page('mainPage', (context, page, configData) => {
        page.section('sensors', section => {
            section
                .deviceSetting('contactSensor')
                .capabilities(['contactSensor'])
        });
        page.section('lights', section => {
            section
                .deviceSetting('lights')
                .capabilities(['switch'])
                .permissions('rx')
                .multiple(true);
        });
        page
            .name('SmartApp Authorization Example')
            .complete(true)
            .section('my-section', section => {
                section
                    .paragraphSetting('my-paragraph')
                    .text('SmartApp Authorization Example')
                    .description('An example of how to authorize incoming SmartThings requests to your SmartApp.')

        });
    })
    // Called for both INSTALLED and UPDATED lifecycle events if there is no separate installed() handler
    .updated(async (context, updateData) => {
        await context.api.subscriptions.delete() // clear any existing configuration
        await context.api.subscriptions.subscribeToDevices(context.config.contactSensor, 'contactSensor', 'contact', 'myDeviceEventHandler');
    })
    .subscribedEventHandler('myDeviceEventHandler', async (context, event) => {
        const value = event.value === 'open' ? 'on' : 'off';
        await context.api.devices.sendCommands(context.config.lights, 'switch', value);
    });

server.use(express.json());

/* Handle POST requests */
server.post('/', function (req, res, next) {
    smartapp.handleHttpCallback(req, res);
});

server.get('/', function (req, res) {
    res.send('This is the root path. No GET endpoint available here.');
});

server.post('/confirmation', (req, res) => {
// Assuming the confirmation request is sent as a POST request
    const confirmationData = req.body.confirmationData;
    console.log(confirmationData);
    res.send('Confirmation request received');
});

/* Start listening at your defined PORT */
server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));