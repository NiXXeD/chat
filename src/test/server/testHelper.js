var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

//make globals for easy testing
global.chai = chai;
global.sinon = sinon;

//settings/plugins for chai
chai.should();
chai.use(sinonChai);