describe('Unit: markdownService', function() {
    beforeEach(module('chat'));

    it('should do nothing with plain text', inject(function(markdownService) {
        var expected = 'The quick brown fox...';

        var actual = markdownService.process(expected);

        actual.should.equal(expected);
    }));

    it ('should ignore blockquotes', inject(function(markdownService) {
        var expected = 'test block quote';
        var input = '> ' + expected;

        var actual = markdownService.process(input);

        actual.should.equal(expected);
    }));

    it ('should ignore lists', inject(function(markdownService) {
        var expected = 'text';

        var actual;

        actual = markdownService.process('1. ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('* ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('+ ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('- ' + expected);
        actual.should.equal(expected);
    }));

    it ('should ignore headers', inject(function(markdownService) {
        var expected = 'text';

        var actual;

        actual = markdownService.process('# ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('## ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('### ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('#### ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('##### ' + expected);
        actual.should.equal(expected);

        actual = markdownService.process('###### ' + expected);
        actual.should.equal(expected);
    }));

    it ('should ignore horizontal rules', inject(function(markdownService) {
        var expected = 'undefined';

        var actual;

        actual = markdownService.process('---');
        actual.should.equal(expected);

        actual = markdownService.process('***');
        actual.should.equal(expected);

        actual = markdownService.process('___');
        actual.should.equal(expected);
    }));

    it ('should ignore images', inject(function(markdownService) {
        var expected = 'http://www.invalid.url/some/image.jpg';
        var input = '![alt text](http://www.invalid.url/some/image.jpg "Text")';

        var actual = markdownService.process(input);
        actual.should.equal(expected);
    }));

    it ('should hyperlink urls', inject(function(markdownService) {
        var actual;

        actual = markdownService.process('http://www.invalid.url/some/image.jpg');
        actual.should.equal('<a target="_blank" href="http://www.invalid.url/some/image.jpg">http://www.invalid.url/some/image.jpg</a>');

        actual = markdownService.process('[Test text](http://www.invalid.url/some/image.jpg)');
        actual.should.equal('<a target="_blank" href="http://www.invalid.url/some/image.jpg">Test text</a>');
    }));

    it ('should sanitize html', inject(function(markdownService) {
        var actual;

        actual = markdownService.process('<bold>test</bold>');
        actual.should.equal('&lt;bold&gt;test&lt;/bold&gt;');
    }));
});