'use strict';

const moncash = require('./conf');
const { mockOAuth, mockTransfertError, cleanAll } = require('./mockApi');

describe('check transfert',()=>{
    afterEach(() => {
        cleanAll();
    });

    test('create', done => {
        mockOAuth();
        mockTransfertError();

        moncash.transfert.create({
            "receiver":"50900000000",
            "amount": 50,
            "desc": "test"
        },(err,resp)=>{
            expect(err.type).toBeDefined();
            done();
        });
    });
});
