var snippets = document.querySelectorAll('pre');
[].forEach.call(snippets, function(snippet) {
	if (snippet.closest('.snippet') !== null) {
		snippet.firstChild.insertAdjacentHTML('beforebegin', '<button class="btn" data-clipboard-snippet><img class="clippy" height="20" src="/assets/clippy.svg" alt="Copy to clipboard"></button>');
	}
});
var clipboardSnippets = new ClipboardJS('[data-clipboard-snippet]', {
	target: function(trigger) {
		return trigger.nextElementSibling;
	}
});
clipboardSnippets.on('success', function(e) {
	e.clearSelection();
	showTooltip(e.trigger, 'Copied!');
});
clipboardSnippets.on('error', function(e) {
	showTooltip(e.trigger, fallbackMessage(e.action));
});