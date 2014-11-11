angular.module('chat')
    .service('markdownService', function() {
        var markdownService = {};

        //we want access to the renderer
        var renderer = new marked.Renderer();
        var options = {
            renderer: renderer,
            tables: false,
            sanitize: true
        };

        //deactivate the following render methods
        function noop(text) {
            return text;
        }
        renderer.blockquote = noop;
        renderer.list = noop;
        renderer.listitem = noop;
        renderer.image = noop;
        renderer.hr = noop;
        renderer.heading = noop;
        renderer.paragraph = noop;

        //process text method
        markdownService.process = function(text) {
            return marked(text, options)
                .replace('a href', 'a target="_blank" href');
        };

        return markdownService;
    });