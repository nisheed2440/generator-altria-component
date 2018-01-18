import <%= compName %> from './<%= compNameFile %>.component';

describe('<%= compNamePretty %> Component', function() {
    beforeEach(() => {});

    afterEach(() => {});

    it('should initialize', () => {
        <%= compName %>.initialize();
        expect(true).to.equal(true);
    });

});
