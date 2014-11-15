var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');

//make globals for easy testing
global.chai = chai;
global.sinon = sinon;
global.proxyquire = proxyquire;

//settings/plugins
chai.should();
chai.use(sinonChai);
proxyquire.noCallThru();