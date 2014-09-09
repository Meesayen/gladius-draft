var nested = require('./nested-file.js');

describe('nested', function(){
  it('should print a fancy string', function () {
    expect(nested.nested()).to.equal("function in the nested file");
  });
});
