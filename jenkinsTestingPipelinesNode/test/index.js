const assert = require('assert');

const mul = require('../');

describe('Multiplication', () => {

    it('positive numbers handling', () => {
        assert.equal(mul(4, 7), 28);
    });

    it('negative numbers handling', () => {
        assert.equal(mul(4, -6), -24);
    });

    it('decimals handling', () => {
        assert.equal(mul(3.5, 7.1), 24.85);
    });

});
