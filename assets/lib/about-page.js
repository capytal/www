/**
 * Toggle a element to be hidden or not, changing "display" style,
 * aria-disabled and aria-hidden.
 * @param {Element} e - The element to toggle.
 * @param {boolean} toggle - The state to put the element.
 */
function toggleElement(e, toggle) {
	let style = e.getAttribute('style');

	if (toggle) {
		e.setAttribute('aria-hidden', 'false');
		e.setAttribute('aria-disabled', 'false');
		e.setAttribute('style', style
			? style.replaceAll('display:none;', 'display:initial;')
			: 'display:initial;',
		);
	}
	else {
		e.setAttribute('aria-hidden', 'true');
		e.setAttribute('aria-disabled', 'true');
		e.setAttribute('style', style
			? style.replaceAll('display:initial;', 'display:none;')
			: 'display:none;',
		);
	}
}

/**
 * Hello world.
 */
export function main() {
	const anchors = {
		code: document.querySelector('#return-anchor-code'),
		creators: document.querySelector('#return-anchor-creators'),
		root: document.querySelector('#return-anchor-root'),
	};

	if (!anchors.code || !anchors.creators || !anchors.root) {
		return;
	}

	/** @type {URL | undefined} */
	let url = undefined;
	try {
		url = new URL(document.URL);
	}
	catch (error) {
		console.error(`Failed to get document url. Error: ${String(error)}`);
		url = new URL('/');
	}

	switch (url.hash) {
		case '#code':
			toggleElement(anchors.code, true);
			toggleElement(anchors.creators, false);
			toggleElement(anchors.root, false);
			break;
		case '#creators':
			toggleElement(anchors.code, false);
			toggleElement(anchors.creators, true);
			toggleElement(anchors.root, false);
			break;
	}
}
