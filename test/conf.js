'use strict';

const Moncash = require('../index');

const clientId = process.env.MONCASH_TEST_CLIENT_ID;
const clientSecret = process.env.MONCASH_TEST_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error('Tests require MONCASH_TEST_CLIENT_ID and MONCASH_TEST_CLIENT_SECRET env vars. Never hardcode credentials.');
}

const moncash = new Moncash();

moncash.configure({
    mode:'sandbox',
    clientId,
    clientSecret
});

module.exports=moncash;
