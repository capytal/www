// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @copyright Big Sky Software 2024
 * @license 0BSD
 * @author Big Sky Software <https://github.com/bigskysoftware>
 *
 * This source code is copied from HTMX's GitHub repository, located at
 * https://github.com/bigskysoftware/htmx/blob/master/dist/htmx.esm.js.
 *
 * This source code and the original are licensed under the Zero-Clause BSD license,
 * which a  copy is available in the original [GitHub](https://github.com/bigskysoftware/htmx/blob/master/LICENSE)
 * and here below:
 *
 * Zero-Clause BSD
 * =============
 *
 * Permission to use, copy, modify, and/or distribute this software for
 * any purpose with or without fee is hereby granted.
 *
 * THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
 * AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * @author Big Sky Software <https://github.com/bigskysoftware>
 */

/* eslint-disable */

var htmx = (function () {
	'use strict';

	// Public API
	const htmx = {
		/** @type {typeof internalEval} */
		_: null,
		/** @type {typeof addClassToElement} */
		addClass: null,
		/** @type {typeof ajaxHelper} */
		ajax: null,
		/** @type {typeof closest} */
		closest: null,
		/**
		 * A property holding the configuration htmx uses at runtime.
		 *
		 * Note that using a [meta tag](https://htmx.org/docs/#config) is the preferred mechanism for setting these properties.
		 * @see https://htmx.org/api/#config
		 */
		config: {
			/**
			 * The class to temporarily place on elements that htmx has added to the DOM.
			 * @type string
			 * @default 'htmx-added'
			 */
			addedClass: 'htmx-added',
			/**
			 * Allows the use of eval-like functionality in htmx, to enable **hx-vars**, trigger conditions & script tag evaluation. Can be set to **false** for CSP compatibility.
			 * @type boolean
			 * @default true
			 */
			allowEval: true,
			/**
			 * Whether to process OOB swaps on elements that are nested within the main response element.
			 * @type boolean
			 * @default true
			 */
			allowNestedOobSwaps: true,
			/**
			 * If set to false, disables the interpretation of script tags.
			 * @type boolean
			 * @default true
			 */
			allowScriptTags: true,
			/**
			 * The attributes to settle during the settling phase.
			 * @type string[]
			 * @default ['class', 'style', 'width', 'height']
			 */
			attributesToSettle: ['class', 'style', 'width', 'height'],
			/**
			 * If the focused element should be scrolled into view.
			 * @type boolean
			 * @default false
			 */
			defaultFocusScroll: false,
			/**
			 * The default delay between completing the content swap and settling attributes.
			 * @type number
			 * @default 20
			 */
			defaultSettleDelay: 20,
			/**
			 * The default delay between receiving a response from the server and doing the swap.
			 * @type number
			 * @default 0
			 */
			defaultSwapDelay: 0,
			/**
			 * The default swap style to use if **[hx-swap](https://htmx.org/attributes/hx-swap)** is omitted.
			 * @type HtmxSwapStyle
			 * @default 'innerHTML'
			 */
			defaultSwapStyle: 'innerHTML',
			/** @type boolean */
			disableInheritance: false,
			/**
			 * @type string
			 * @default '[hx-disable], [data-hx-disable]'
			 */
			disableSelector: '[hx-disable], [data-hx-disable]',
			/**
			 * If set to true htmx will include a cache-busting parameter in GET requests to avoid caching partial responses by the browser.
			 * @type boolean
			 * @default false
			 */
			getCacheBusterParam: false,
			/**
			 * If set to true, htmx will use the View Transition API when swapping in new content.
			 * @type boolean
			 * @default false
			 */
			globalViewTransitions: false,
			/**
			 * The number of pages to keep in **localStorage** for history support.
			 * @type number
			 * @default 10
			 */
			historyCacheSize: 10,
			/**
			 * Whether to use history.
			 * @type boolean
			 * @default true
			 */
			historyEnabled: true,
			/**
			 * If set to true htmx will not update the title of the document when a title tag is found in new content.
			 * @type boolean
			 * @default false
			 */
			ignoreTitle: false,
			/**
			 * If true, htmx will inject a small amount of CSS into the page to make indicators invisible unless the **htmx-indicator** class is present.
			 * @type boolean
			 * @default true
			 */
			includeIndicatorStyles: true,
			/**
			 * The class to place on indicators when a request is in flight.
			 * @type string
			 * @default 'htmx-indicator'
			 */
			indicatorClass: 'htmx-indicator',
			/**
			 * If set, the nonce will be added to inline scripts.
			 * @type string
			 * @default ''
			 */
			inlineScriptNonce: '',
			/**
			 * If set, the nonce will be added to inline styles.
			 * @type string
			 * @default ''
			 */
			inlineStyleNonce: '',
			/**
			 * Htmx will format requests with these methods by encoding their parameters in the URL, not the request body.
			 * @type {(HttpVerb)[]}
			 * @default ['get', 'delete']
			 */
			methodsThatUseUrlParams: ['get', 'delete'],
			/**
			 * @type boolean
			 * @default false
			 */
			refreshOnHistoryMiss: false,
			/**
			 * The class to place on triggering elements when a request is in flight.
			 * @type string
			 * @default 'htmx-request'
			 */
			requestClass: 'htmx-request',
			/** @type HtmxResponseHandlingConfig[] */
			responseHandling: [
				{ code: '204', swap: false },
				{ code: '[23]..', swap: true },
				{ code: '[45]..', error: true, swap: false },
			],
			/**
			 * @type {'auto' | 'instant' | 'smooth'}
			 * @default 'instant'
			 */
			scrollBehavior: 'instant',
			/**
			 * Whether the target of a boosted element is scrolled into the viewport.
			 * @type boolean
			 * @default true
			 */
			scrollIntoViewOnBoost: true,
			/**
			 * If set to true, disables htmx-based requests to non-origin hosts.
			 * @type boolean
			 * @default false
			 */
			selfRequestsOnly: true,
			/**
			 * The class to place on target elements when htmx is in the settling phase.
			 * @type string
			 * @default 'htmx-settling'
			 */
			settlingClass: 'htmx-settling',
			/**
			 * The class to place on target elements when htmx is in the swapping phase.
			 * @type string
			 * @default 'htmx-swapping'
			 */
			swappingClass: 'htmx-swapping',
			/**
			 * @type number
			 * @default 0
			 */
			timeout: 0,
			/**
			 * The cache to store evaluated trigger specifications into.
			 * You may define a simple object to use a never-clearing cache, or implement your own system using a [proxy object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
			 * @type {object | null}
			 * @default null
			 */
			triggerSpecsCache: null,
			/**
			 * Allow cross-site Access-Control requests using credentials such as cookies, authorization headers or TLS client certificates.
			 * @type boolean
			 * @default false
			 */
			withCredentials: false,
			/**
			 * The type of binary data being received over the WebSocket connection.
			 * @type BinaryType
			 * @default 'blob'
			 */
			wsBinaryType: 'blob',
			/**
			 * The default implementation of **getWebSocketReconnectDelay** for reconnecting after unexpected connection loss by the event code **Abnormal Closure**, **Service Restart** or **Try Again Later**.
			 * @type {'full-jitter' | ((retryCount:number) => number)}
			 * @default "full-jitter"
			 */
			wsReconnectDelay: 'full-jitter',
		},
		/* Extension entrypoints */
		/** @type {typeof defineExtension} */
		defineExtension: null,
		/* DOM querying helpers */
		/** @type {typeof find} */
		find: null,
		/** @type {typeof findAll} */
		findAll: null,
		/* Debugging */
		/** @type {typeof logAll} */
		logAll: null,
		/* Debugging */
		/**
		 * The logger htmx uses to log with.
		 * @see https://htmx.org/api/#logger
		 */
		logger: null,
		/** @type {typeof logNone} */
		logNone: null,
		/** @type {typeof removeEventListenerImpl} */
		off: null,
		/** @type {typeof addEventListenerImpl} */
		on: null,
		// Tsc madness here, assigning the functions directly results in an invalid TypeScript output, but reassigning is fine
		/* Event processing */
		/** @type {typeof onLoadHelper} */
		onLoad: null,
		/** @type {typeof parseInterval} */
		parseInterval: null,
		/** @type {typeof processNode} */
		process: null,
		/* DOM manipulation helpers */
		/** @type {typeof removeElement} */
		remove: null,
		/** @type {typeof removeClassFromElement} */
		removeClass: null,
		/** @type {typeof removeExtension} */
		removeExtension: null,
		/** @type {typeof swap} */
		swap: null,
		/** @type {typeof takeClassForElement} */
		takeClass: null,
		/** @type {typeof toggleClassOnElement} */
		toggleClass: null,
		/** @type {typeof triggerEvent} */
		trigger: null,
		/**
		 * Returns the input values that would resolve for a given element via the htmx value resolution mechanism.
		 * @param {Element} elt - The element to resolve values on.
		 * @param {HttpVerb} type - The request type (e.g. **get** or **post**) non-GET's will include the enclosing form of the element. Defaults to **post**.
		 * @returns {object}
		 * @see https://htmx.org/api/#values
		 */
		values: function (elt, type) {
			const inputValues = getInputValues(elt, type || 'post');
			return inputValues.values;
		},
		version: '2.0.3',
	};
	// Tsc madness part 2
	htmx.onLoad = onLoadHelper;
	htmx.process = processNode;
	htmx.on = addEventListenerImpl;
	htmx.off = removeEventListenerImpl;
	htmx.trigger = triggerEvent;
	htmx.ajax = ajaxHelper;
	htmx.find = find;
	htmx.findAll = findAll;
	htmx.closest = closest;
	htmx.remove = removeElement;
	htmx.addClass = addClassToElement;
	htmx.removeClass = removeClassFromElement;
	htmx.toggleClass = toggleClassOnElement;
	htmx.takeClass = takeClassForElement;
	htmx.swap = swap;
	htmx.defineExtension = defineExtension;
	htmx.removeExtension = removeExtension;
	htmx.logAll = logAll;
	htmx.logNone = logNone;
	htmx.parseInterval = parseInterval;
	htmx._ = internalEval;

	const internalAPI = {
		addTriggerHandler,
		bodyContains,
		canAccessLocalStorage,
		filterValues,
		findThisElement,
		getAttributeValue,
		getClosestAttributeValue,
		getClosestMatch,
		getExpressionVars,
		getHeaders,
		getInputValues,
		getInternalData,
		getSwapSpecification,
		getTarget,
		getTriggerSpecs,
		hasAttribute,
		makeFragment,
		makeSettleInfo,
		mergeObjects,
		oobSwap,
		querySelectorExt,
		settleImmediately,
		shouldCancel,
		swap,
		triggerErrorEvent,
		triggerEvent,
		withExtensions,
	};

	const VERBS = ['get', 'post', 'put', 'delete', 'patch'];
	const VERB_SELECTOR = VERBS.map(function (verb) {
		return '[hx-' + verb + '], [data-hx-' + verb + ']';
	}).join(', ');

	// = ===================================================================
	// Utilities
	// = ===================================================================

	/**
	 * Parses an interval string consistent with the way htmx does. Useful for plugins that have timing-related attributes.
	 *
	 * Caution: Accepts an int followed by either **s** or **ms**. All other values use **parseFloat**.
	 * @param {string} str - Timing string.
	 * @returns {number|undefined}
	 * @see https://htmx.org/api/#parseInterval
	 */
	function parseInterval(str) {
		if (str == undefined) {
			return undefined;
		}

		let interval = NaN;
		if (str.slice(-2) == 'ms') {
			interval = parseFloat(str.slice(0, -2));
		}
		else if (str.slice(-1) == 's') {
			interval = parseFloat(str.slice(0, -1)) * 1000;
		}
		else if (str.slice(-1) == 'm') {
			interval = parseFloat(str.slice(0, -1)) * 1000 * 60;
		}
		else {
			interval = parseFloat(str);
		}
		return isNaN(interval) ? undefined : interval;
	}

	/**
	 * @param {Node} elt
	 * @param {string} name
	 * @returns {(string | null)}
	 */
	function getRawAttribute(elt, name) {
		return elt instanceof Element && elt.getAttribute(name);
	}

	/**
	 * @param {Element} elt
	 * @param {string} qualifiedName
	 * @returns {boolean}
	 */
	/**
	 * Resolve with both hx and data-hx prefixes.
	 * @param elt
	 * @param qualifiedName
	 */
	function hasAttribute(elt, qualifiedName) {
		return !!elt.hasAttribute && (elt.hasAttribute(qualifiedName)
			|| elt.hasAttribute('data-' + qualifiedName));
	}

	/**
	 * @param {Node} elt
	 * @param {string} qualifiedName
	 * @returns {(string | null)}
	 */
	function getAttributeValue(elt, qualifiedName) {
		return getRawAttribute(elt, qualifiedName) || getRawAttribute(elt, 'data-' + qualifiedName);
	}

	/**
	 * @param {Node} elt
	 * @returns {Node | null}
	 */
	function parentElt(elt) {
		const parent = elt.parentElement;
		if (!parent && elt.parentNode instanceof ShadowRoot) return elt.parentNode;
		return parent;
	}

	/**
	 * @returns {Document}
	 */
	function getDocument() {
		return document;
	}

	/**
	 * @param {Node} elt
	 * @param {boolean} global
	 * @returns {Node|Document}
	 */
	function getRootNode(elt, global) {
		return elt.getRootNode ? elt.getRootNode({ composed: global }) : getDocument();
	}

	/**
	 * @param {Node} elt
	 * @param {(e:Node) => boolean} condition
	 * @returns {Node | null}
	 */
	function getClosestMatch(elt, condition) {
		while (elt && !condition(elt)) {
			elt = parentElt(elt);
		}

		return elt || null;
	}

	/**
	 * @param {Element} initialElement
	 * @param {Element} ancestor
	 * @param {string} attributeName
	 * @returns {string|null}
	 */
	function getAttributeValueWithDisinheritance(initialElement, ancestor, attributeName) {
		const attributeValue = getAttributeValue(ancestor, attributeName);
		const disinherit = getAttributeValue(ancestor, 'hx-disinherit');
		var inherit = getAttributeValue(ancestor, 'hx-inherit');
		if (initialElement !== ancestor) {
			if (htmx.config.disableInheritance) {
				if (inherit && (inherit === '*' || inherit.split(' ').indexOf(attributeName) >= 0)) {
					return attributeValue;
				}
				else {
					return null;
				}
			}
			if (disinherit && (disinherit === '*' || disinherit.split(' ').indexOf(attributeName) >= 0)) {
				return 'unset';
			}
		}
		return attributeValue;
	}

	/**
	 * @param {Element} elt
	 * @param {string} attributeName
	 * @returns {string | null}
	 */
	function getClosestAttributeValue(elt, attributeName) {
		let closestAttr = null;
		getClosestMatch(elt, function (e) {
			return !!(closestAttr = getAttributeValueWithDisinheritance(elt, asElement(e), attributeName));
		});
		if (closestAttr !== 'unset') {
			return closestAttr;
		}
	}

	/**
	 * @param {Node} elt
	 * @param {string} selector
	 * @returns {boolean}
	 */
	function matches(elt, selector) {
		// @ts-ignore: non-standard properties for browser compatibility
		// noinspection JSUnresolvedVariable
		const matchesFunction = elt instanceof Element && (elt.matches || elt.matchesSelector || elt.msMatchesSelector || elt.mozMatchesSelector || elt.webkitMatchesSelector || elt.oMatchesSelector);
		return !!matchesFunction && matchesFunction.call(elt, selector);
	}

	/**
	 * @param {string} str
	 * @returns {string}
	 */
	function getStartTag(str) {
		const tagMatcher = /<([a-z][^\0\t\n\f\r />]*)/i;
		const match = tagMatcher.exec(str);
		if (match) {
			return match[1].toLowerCase();
		}
		else {
			return '';
		}
	}

	/**
	 * @param {string} resp
	 * @returns {Document}
	 */
	function parseHTML(resp) {
		const parser = new DOMParser();
		return parser.parseFromString(resp, 'text/html');
	}

	/**
	 * @param {DocumentFragment} fragment
	 * @param {Node} elt
	 */
	function takeChildrenFor(fragment, elt) {
		while (elt.childNodes.length > 0) {
			fragment.append(elt.childNodes[0]);
		}
	}

	/**
	 * @param {HTMLScriptElement} script
	 * @returns {HTMLScriptElement}
	 */
	function duplicateScript(script) {
		const newScript = getDocument().createElement('script');
		forEach(script.attributes, function (attr) {
			newScript.setAttribute(attr.name, attr.value);
		});
		newScript.textContent = script.textContent;
		newScript.async = false;
		if (htmx.config.inlineScriptNonce) {
			newScript.nonce = htmx.config.inlineScriptNonce;
		}
		return newScript;
	}

	/**
	 * @param {HTMLScriptElement} script
	 * @returns {boolean}
	 */
	function isJavaScriptScriptNode(script) {
		return script.matches('script') && (script.type === 'text/javascript' || script.type === 'module' || script.type === '');
	}

	/**
	 * We have to make new copies of script tags that we are going to insert because
	 * SOME browsers (not saying who, but it involves an element and an animal) don't
	 * execute scripts created in <template> tags when they are inserted into the DOM
	 * and all the others do lmao.
	 * @param {DocumentFragment} fragment
	 */
	function normalizeScriptTags(fragment) {
		Array.from(fragment.querySelectorAll('script')).forEach(/** @param {HTMLScriptElement} script */ (script) => {
			if (isJavaScriptScriptNode(script)) {
				const newScript = duplicateScript(script);
				const parent = script.parentNode;
				try {
					parent.insertBefore(newScript, script);
				}
				catch (e) {
					logError(e);
				}
				finally {
					script.remove();
				}
			}
		});
	}

	/**
	 * @typedef {DocumentFragment & {title?: string}} DocumentFragmentWithTitle
	 * @description  A document fragment representing the response HTML, including
	 * a `title` property for any title information found.
	 */

	/**
	 * @param {string} response - HTML.
	 * @returns {DocumentFragmentWithTitle}
	 */
	function makeFragment(response) {
		// strip head tag to determine shape of response we are dealing with
		const responseWithNoHead = response.replace(/<head(\s[^>]*)?>[\S\s]*?<\/head>/i, '');
		const startTag = getStartTag(responseWithNoHead);
		/** @type DocumentFragmentWithTitle */
		let fragment;
		if (startTag === 'html') {
			// if it is a full document, parse it and return the body
			fragment = /** @type DocumentFragmentWithTitle */ (new DocumentFragment());
			const doc = parseHTML(response);
			takeChildrenFor(fragment, doc.body);
			fragment.title = doc.title;
		}
		else if (startTag === 'body') {
			// parse body w/o wrapping in template
			fragment = /** @type DocumentFragmentWithTitle */ (new DocumentFragment());
			const doc = parseHTML(responseWithNoHead);
			takeChildrenFor(fragment, doc.body);
			fragment.title = doc.title;
		}
		else {
			// otherwise we have non-body partial HTML content, so wrap it in a template to maximize parsing flexibility
			const doc = parseHTML('<body><template class="internal-htmx-wrapper">' + responseWithNoHead + '</template></body>');
			fragment = /** @type DocumentFragmentWithTitle */ (doc.querySelector('template').content);
			// extract title into fragment for later processing
			fragment.title = doc.title;

			// for legacy reasons we support a title tag at the root level of non-body responses, so we need to handle it
			var titleElement = fragment.querySelector('title');
			if (titleElement && titleElement.parentNode === fragment) {
				titleElement.remove();
				fragment.title = titleElement.innerText;
			}
		}
		if (fragment) {
			if (htmx.config.allowScriptTags) {
				normalizeScriptTags(fragment);
			}
			else {
				// remove all script tags if scripts are disabled
				fragment.querySelectorAll('script').forEach((script) => { script.remove(); });
			}
		}
		return fragment;
	}

	/**
	 * @param {Function} func
	 */
	function maybeCall(func) {
		if (func) {
			func();
		}
	}

	/**
	 * @param {any} o
	 * @param {string} type
	 * @returns
	 */
	function isType(o, type) {
		return Object.prototype.toString.call(o) === '[object ' + type + ']';
	}

	/**
	 * @param {*} o
	 * @returns {o is Function}
	 */
	function isFunction(o) {
		return typeof o === 'function';
	}

	/**
	 * @param {*} o
	 * @returns {o is object}
	 */
	function isRawObject(o) {
		return isType(o, 'Object');
	}

	/**
	 * @typedef {object} OnHandler
	 * @property {(keyof HTMLElementEventMap)|string} event
	 * @property {EventListener} listener
	 */

	/**
	 * @typedef {object} ListenerInfo
	 * @property {string} trigger
	 * @property {EventListener} listener
	 * @property {EventTarget} on
	 */

	/**
	 * @typedef {object} HtmxNodeInternalData
	 * Element data
	 * @property {number} [initHash]
	 * @property {boolean} [boosted]
	 * @property {OnHandler[]} [onHandlers]
	 * @property {number} [timeout]
	 * @property {ListenerInfo[]} [listenerInfos]
	 * @property {boolean} [cancelled]
	 * @property {boolean} [triggeredOnce]
	 * @property {number} [delayed]
	 * @property {number|null} [throttle]
	 * @property {WeakMap<HtmxTriggerSpecification,WeakMap<EventTarget,string>>} [lastValue]
	 * @property {boolean} [loaded]
	 * @property {string} [path]
	 * @property {string} [verb]
	 * @property {boolean} [polling]
	 * @property {HTMLButtonElement|HTMLInputElement|null} [lastButtonClicked]
	 * @property {number} [requestCount]
	 * @property {XMLHttpRequest} [xhr]
	 * @property {(() => void)[]} [queuedRequests]
	 * @property {boolean} [abortable]
	 *
	 * Event data.
	 * @property {HtmxTriggerSpecification} [triggerSpec]
	 * @property {EventTarget[]} [handledFor]
	 */

	/**
	 * GetInternalData retrieves "private" data stored by htmx within an element.
	 * @param {EventTarget|Event} elt
	 * @returns {HtmxNodeInternalData}
	 */
	function getInternalData(elt) {
		const dataProp = 'htmx-internal-data';
		let data = elt[dataProp];
		if (!data) {
			data = elt[dataProp] = {};
		}
		return data;
	}

	/**
	 * ToArray converts an ArrayLike object into a real array.
	 * @template T
	 * @param {ArrayLike<T>} arr
	 * @returns {T[]}
	 */
	function toArray(arr) {
		const returnArr = [];
		if (arr) {
			for (let i = 0; i < arr.length; i++) {
				returnArr.push(arr[i]);
			}
		}
		return returnArr;
	}

	/**
	 * @template T
	 * @param {T[]|NamedNodeMap|HTMLCollection|HTMLFormControlsCollection|ArrayLike<T>} arr
	 * @param {(T) => void} func
	 */
	function forEach(arr, func) {
		if (arr) {
			for (let i = 0; i < arr.length; i++) {
				func(arr[i]);
			}
		}
	}

	/**
	 * @param {Element} el
	 * @returns {boolean}
	 */
	function isScrolledIntoView(el) {
		const rect = el.getBoundingClientRect();
		const elemTop = rect.top;
		const elemBottom = rect.bottom;
		return elemTop < window.innerHeight && elemBottom >= 0;
	}

	/**
	 * @param {Node} elt
	 * @returns {boolean}
	 */
	function bodyContains(elt) {
		// IE Fix
		const rootNode = elt.getRootNode && elt.getRootNode();
		if (rootNode && rootNode instanceof window.ShadowRoot) {
			return getDocument().body.contains(rootNode.host);
		}
		else {
			return getDocument().body.contains(elt);
		}
	}

	/**
	 * @param {string} trigger
	 * @returns {string[]}
	 */
	function splitOnWhitespace(trigger) {
		return trigger.trim().split(/\s+/);
	}

	/**
	 * MergeObjects takes all the keys from
	 * obj2 and duplicates them into obj1.
	 * @template T1
	 * @template T2
	 * @param {T1} obj1
	 * @param {T2} obj2
	 * @returns {T1 & T2}
	 */
	function mergeObjects(obj1, obj2) {
		for (const key in obj2) {
			if (obj2.hasOwnProperty(key)) {
				// @ts-ignore tsc doesn't seem to properly handle types merging
				obj1[key] = obj2[key];
			}
		}
		// @ts-ignore tsc doesn't seem to properly handle types merging
		return obj1;
	}

	/**
	 * @param {string} jString
	 * @returns {any|null}
	 */
	function parseJSON(jString) {
		try {
			return JSON.parse(jString);
		}
		catch (error) {
			logError(error);
			return null;
		}
	}

	/**
	 * @returns {boolean}
	 */
	function canAccessLocalStorage() {
		const test = 'htmx:localStorageTest';
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		}
		catch (e) {
			return false;
		}
	}

	/**
	 * @param {string} path
	 * @returns {string}
	 */
	function normalizePath(path) {
		try {
			const url = new URL(path);
			if (url) {
				path = url.pathname + url.search;
			}
			// remove trailing slash, unless index page
			if (!(/^\/$/.test(path))) {
				path = path.replace(/\/+$/, '');
			}
			return path;
		}
		catch (e) {
			// be kind to IE11, which doesn't support URL()
			return path;
		}
	}

	// = =========================================================================================
	// public API
	// = =========================================================================================

	/**
	 * @param {string} str
	 * @returns {any}
	 */
	function internalEval(str) {
		return maybeEval(getDocument().body, function () {
			return eval(str);
		});
	}

	/**
	 * Adds a callback for the **htmx:load** event. This can be used to process new content, for example initializing the content with a javascript library.
	 * @param {(elt: Node) => void} callback - The callback to call on newly loaded content.
	 * @returns {EventListener}
	 * @see https://htmx.org/api/#onLoad
	 */
	function onLoadHelper(callback) {
		const value = htmx.on('htmx:load', /** @param {CustomEvent} evt */ function (evt) {
			callback(evt.detail.elt);
		});
		return value;
	}

	/**
	 * Log all htmx events, useful for debugging.
	 * @see https://htmx.org/api/#logAll
	 */
	function logAll() {
		htmx.logger = function (elt, event, data) {
			if (console) {
				console.log(event, elt, data);
			}
		};
	}

	/**
	 *
	 */
	function logNone() {
		htmx.logger = null;
	}

	/**
	 * Finds an element matching the selector.
	 * @param {ParentNode|string} eltOrSelector - The root element to find the matching element in, inclusive | The selector to match.
	 * @param {string} [selector] - The selector to match.
	 * @returns {Element|null}
	 * @see https://htmx.org/api/#find
	 */
	function find(eltOrSelector, selector) {
		if (typeof eltOrSelector !== 'string') {
			return eltOrSelector.querySelector(selector);
		}
		else {
			return find(getDocument(), eltOrSelector);
		}
	}

	/**
	 * Finds all elements matching the selector.
	 * @param {ParentNode|string} eltOrSelector - The root element to find the matching elements in, inclusive | The selector to match.
	 * @param {string} [selector] - The selector to match.
	 * @returns {NodeListOf<Element>}
	 * @see https://htmx.org/api/#findAll
	 */
	function findAll(eltOrSelector, selector) {
		if (typeof eltOrSelector !== 'string') {
			return eltOrSelector.querySelectorAll(selector);
		}
		else {
			return findAll(getDocument(), eltOrSelector);
		}
	}

	/**
	 * @returns Window.
	 */
	function getWindow() {
		return window;
	}

	/**
	 * Removes an element from the DOM.
	 * @param {Node} elt
	 * @param {number} [delay]
	 * @see https://htmx.org/api/#remove
	 */
	function removeElement(elt, delay) {
		elt = resolveTarget(elt);
		if (delay) {
			getWindow().setTimeout(function () {
				removeElement(elt);
				elt = null;
			}, delay);
		}
		else {
			parentElt(elt).removeChild(elt);
		}
	}

	/**
	 * @param {any} elt
	 * @returns {Element|null}
	 */
	function asElement(elt) {
		return elt instanceof Element ? elt : null;
	}

	/**
	 * @param {any} elt
	 * @returns {HTMLElement|null}
	 */
	function asHtmlElement(elt) {
		return elt instanceof HTMLElement ? elt : null;
	}

	/**
	 * @param {any} value
	 * @returns {string|null}
	 */
	function asString(value) {
		return typeof value === 'string' ? value : null;
	}

	/**
	 * @param {EventTarget} elt
	 * @returns {ParentNode|null}
	 */
	function asParentNode(elt) {
		return elt instanceof Element || elt instanceof Document || elt instanceof DocumentFragment ? elt : null;
	}

	/**
	 * This method adds a class to the given element.
	 * @param {Element|string} elt - The element to add the class to.
	 * @param {string} clazz - The class to add.
	 * @param {number} [delay] - The delay (in milliseconds) before class is added.
	 * @see https://htmx.org/api/#addClass
	 */
	function addClassToElement(elt, clazz, delay) {
		elt = asElement(resolveTarget(elt));
		if (!elt) {
			return;
		}
		if (delay) {
			getWindow().setTimeout(function () {
				addClassToElement(elt, clazz);
				elt = null;
			}, delay);
		}
		else {
			elt.classList && elt.classList.add(clazz);
		}
	}

	/**
	 * Removes a class from the given element.
	 * @param {Node|string} node - Element to remove the class from.
	 * @param {string} clazz - The class to remove.
	 * @param {number} [delay] - The delay (in milliseconds before class is removed).
	 * @see https://htmx.org/api/#removeClass
	 */
	function removeClassFromElement(node, clazz, delay) {
		let elt = asElement(resolveTarget(node));
		if (!elt) {
			return;
		}
		if (delay) {
			getWindow().setTimeout(function () {
				removeClassFromElement(elt, clazz);
				elt = null;
			}, delay);
		}
		else {
			if (elt.classList) {
				elt.classList.remove(clazz);
				// if there are no classes left, remove the class attribute
				if (elt.classList.length === 0) {
					elt.removeAttribute('class');
				}
			}
		}
	}

	/**
	 * Toggles the given class on an element.
	 * @param {Element|string} elt - The element to toggle the class on.
	 * @param {string} clazz - The class to toggle.
	 * @see https://htmx.org/api/#toggleClass
	 */
	function toggleClassOnElement(elt, clazz) {
		elt = resolveTarget(elt);
		elt.classList.toggle(clazz);
	}

	/**
	 * Takes the given class from its siblings, so that among its siblings, only the given element will have the class.
	 * @param {Node|string} elt - The element that will take the class.
	 * @param {string} clazz - The class to take.
	 * @see https://htmx.org/api/#takeClass
	 */
	function takeClassForElement(elt, clazz) {
		elt = resolveTarget(elt);
		forEach(elt.parentElement.children, function (child) {
			removeClassFromElement(child, clazz);
		});
		addClassToElement(asElement(elt), clazz);
	}

	/**
	 * Finds the closest matching element in the given elements parentage, inclusive of the element.
	 * @param {Element|string} elt - The element to find the selector from.
	 * @param {string} selector - The selector to find.
	 * @returns {Element|null}
	 * @see https://htmx.org/api/#closest
	 */
	function closest(elt, selector) {
		elt = asElement(resolveTarget(elt));
		if (elt && elt.closest) {
			return elt.closest(selector);
		}
		else {
			// TODO remove when IE goes away
			do {
				if (elt == null || matches(elt, selector)) {
					return elt;
				}
			}
			while (elt = elt && asElement(parentElt(elt)));
			return null;
		}
	}

	/**
	 * @param {string} str
	 * @param {string} prefix
	 * @returns {boolean}
	 */
	function startsWith(str, prefix) {
		return str.substring(0, prefix.length) === prefix;
	}

	/**
	 * @param {string} str
	 * @param {string} suffix
	 * @returns {boolean}
	 */
	function endsWith(str, suffix) {
		return str.substring(str.length - suffix.length) === suffix;
	}

	/**
	 * @param {string} selector
	 * @returns {string}
	 */
	function normalizeSelector(selector) {
		const trimmedSelector = selector.trim();
		if (startsWith(trimmedSelector, '<') && endsWith(trimmedSelector, '/>')) {
			return trimmedSelector.substring(1, trimmedSelector.length - 2);
		}
		else {
			return trimmedSelector;
		}
	}

	/**
	 * @param {Node|Element|Document|string} elt
	 * @param {string} selector
	 * @param {boolean=} global
	 * @returns {(Node|Window)[]}
	 */
	function querySelectorAllExt(elt, selector, global) {
		elt = resolveTarget(elt);
		if (selector.indexOf('closest ') === 0) {
			return [closest(asElement(elt), normalizeSelector(selector.substr(8)))];
		}
		else if (selector.indexOf('find ') === 0) {
			return [find(asParentNode(elt), normalizeSelector(selector.substr(5)))];
		}
		else if (selector === 'next') {
			return [asElement(elt).nextElementSibling];
		}
		else if (selector.indexOf('next ') === 0) {
			return [scanForwardQuery(elt, normalizeSelector(selector.substr(5)), !!global)];
		}
		else if (selector === 'previous') {
			return [asElement(elt).previousElementSibling];
		}
		else if (selector.indexOf('previous ') === 0) {
			return [scanBackwardsQuery(elt, normalizeSelector(selector.substr(9)), !!global)];
		}
		else if (selector === 'document') {
			return [document];
		}
		else if (selector === 'window') {
			return [window];
		}
		else if (selector === 'body') {
			return [document.body];
		}
		else if (selector === 'root') {
			return [getRootNode(elt, !!global)];
		}
		else if (selector === 'host') {
			return [(/** @type ShadowRoot */(elt.getRootNode())).host];
		}
		else if (selector.indexOf('global ') === 0) {
			return querySelectorAllExt(elt, selector.slice(7), true);
		}
		else {
			return toArray(asParentNode(getRootNode(elt, !!global)).querySelectorAll(normalizeSelector(selector)));
		}
	}

	/**
	 * @param {Node} start
	 * @param {string} match
	 * @param {boolean} global
	 * @returns {Element}
	 */
	var scanForwardQuery = function (start, match, global) {
		const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
		for (let i = 0; i < results.length; i++) {
			const elt = results[i];
			if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_PRECEDING) {
				return elt;
			}
		}
	};

	/**
	 * @param {Node} start
	 * @param {string} match
	 * @param {boolean} global
	 * @returns {Element}
	 */
	var scanBackwardsQuery = function (start, match, global) {
		const results = asParentNode(getRootNode(start, global)).querySelectorAll(match);
		for (let i = results.length - 1; i >= 0; i--) {
			const elt = results[i];
			if (elt.compareDocumentPosition(start) === Node.DOCUMENT_POSITION_FOLLOWING) {
				return elt;
			}
		}
	};

	/**
	 * @param {Node|string} eltOrSelector
	 * @param {string=} selector
	 * @returns {Node|Window}
	 */
	function querySelectorExt(eltOrSelector, selector) {
		if (typeof eltOrSelector !== 'string') {
			return querySelectorAllExt(eltOrSelector, selector)[0];
		}
		else {
			return querySelectorAllExt(getDocument().body, eltOrSelector)[0];
		}
	}

	/**
	 * @template {EventTarget} T
	 * @param {T|string} eltOrSelector
	 * @param {T} [context]
	 * @returns {Element|T|null}
	 */
	function resolveTarget(eltOrSelector, context) {
		if (typeof eltOrSelector === 'string') {
			return find(asParentNode(context) || document, eltOrSelector);
		}
		else {
			return eltOrSelector;
		}
	}

	/**
	 * @typedef {keyof HTMLElementEventMap|string} AnyEventName
	 */

	/**
	 * @typedef {object} EventArgs
	 * @property {EventTarget} target
	 * @property {AnyEventName} event
	 * @property {EventListener} listener
	 * @property {object | boolean} options
	 */

	/**
	 * @param {EventTarget|AnyEventName} arg1
	 * @param {AnyEventName|EventListener} arg2
	 * @param {EventListener | object | boolean} [arg3]
	 * @param {object | boolean} [arg4]
	 * @returns {EventArgs}
	 */
	function processEventArgs(arg1, arg2, arg3, arg4) {
		if (isFunction(arg2)) {
			return {
				event: asString(arg1),
				listener: arg2,
				options: arg3,
				target: getDocument().body,
			};
		}
		else {
			return {
				event: asString(arg2),
				listener: arg3,
				options: arg4,
				target: resolveTarget(arg1),
			};
		}
	}

	/**
	 * Adds an event listener to an element.
	 * @param {EventTarget|string} arg1 - The element to add the listener to | the event name to add the listener for.
	 * @param {string|EventListener} arg2 - The event name to add the listener for | the listener to add.
	 * @param {EventListener | object | boolean} [arg3] - The listener to add | Options to add.
	 * @param {object | boolean} [arg4] - Options to add.
	 * @returns {EventListener}
	 * @see https://htmx.org/api/#on
	 */
	function addEventListenerImpl(arg1, arg2, arg3, arg4) {
		ready(function () {
			const eventArgs = processEventArgs(arg1, arg2, arg3, arg4);
			eventArgs.target.addEventListener(eventArgs.event, eventArgs.listener, eventArgs.options);
		});
		const b = isFunction(arg2);
		return b ? arg2 : arg3;
	}

	/**
	 * Removes an event listener from an element.
	 * @param {EventTarget|string} arg1 - The element to remove the listener from | the event name to remove the listener from.
	 * @param {string|EventListener} arg2 - The event name to remove the listener from | The listener to remove.
	 * @param {EventListener} [arg3] - The listener to remove.
	 * @returns {EventListener}
	 * @see https://htmx.org/api/#off
	 */
	function removeEventListenerImpl(arg1, arg2, arg3) {
		ready(function () {
			const eventArgs = processEventArgs(arg1, arg2, arg3);
			eventArgs.target.removeEventListener(eventArgs.event, eventArgs.listener);
		});
		return isFunction(arg2) ? arg2 : arg3;
	}

	// = ===================================================================
	// Node processing
	// = ===================================================================

	/**
	 * Dummy element for bad selectors.
	 */
	const DUMMY_ELT = getDocument().createElement('output');
	/**
	 * @param {Element} elt
	 * @param {string} attrName
	 * @returns {(Node|Window)[]}
	 */
	function findAttributeTargets(elt, attrName) {
		const attrTarget = getClosestAttributeValue(elt, attrName);
		if (attrTarget) {
			if (attrTarget === 'this') {
				return [findThisElement(elt, attrName)];
			}
			else {
				const result = querySelectorAllExt(elt, attrTarget);
				if (result.length === 0) {
					logError('The selector "' + attrTarget + '" on ' + attrName + ' returned no matches!');
					return [DUMMY_ELT];
				}
				else {
					return result;
				}
			}
		}
	}

	/**
	 * @param {Element} elt
	 * @param {string} attribute
	 * @returns {Element|null}
	 */
	function findThisElement(elt, attribute) {
		return asElement(getClosestMatch(elt, function (elt) {
			return getAttributeValue(asElement(elt), attribute) != null;
		}));
	}

	/**
	 * @param {Element} elt
	 * @returns {Node|Window|null}
	 */
	function getTarget(elt) {
		const targetStr = getClosestAttributeValue(elt, 'hx-target');
		if (targetStr) {
			if (targetStr === 'this') {
				return findThisElement(elt, 'hx-target');
			}
			else {
				return querySelectorExt(elt, targetStr);
			}
		}
		else {
			const data = getInternalData(elt);
			if (data.boosted) {
				return getDocument().body;
			}
			else {
				return elt;
			}
		}
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	function shouldSettleAttribute(name) {
		const attributesToSettle = htmx.config.attributesToSettle;
		for (let i = 0; i < attributesToSettle.length; i++) {
			if (name === attributesToSettle[i]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Element} mergeTo
	 * @param {Element} mergeFrom
	 */
	function cloneAttributes(mergeTo, mergeFrom) {
		forEach(mergeTo.attributes, function (attr) {
			if (!mergeFrom.hasAttribute(attr.name) && shouldSettleAttribute(attr.name)) {
				mergeTo.removeAttribute(attr.name);
			}
		});
		forEach(mergeFrom.attributes, function (attr) {
			if (shouldSettleAttribute(attr.name)) {
				mergeTo.setAttribute(attr.name, attr.value);
			}
		});
	}

	/**
	 * @param {HtmxSwapStyle} swapStyle
	 * @param {Element} target
	 * @returns {boolean}
	 */
	function isInlineSwap(swapStyle, target) {
		const extensions = getExtensions(target);
		for (let i = 0; i < extensions.length; i++) {
			const extension = extensions[i];
			try {
				if (extension.isInlineSwap(swapStyle)) {
					return true;
				}
			}
			catch (e) {
				logError(e);
			}
		}
		return swapStyle === 'outerHTML';
	}

	/**
	 * @param {string} oobValue
	 * @param {Element} oobElement
	 * @param {HtmxSettleInfo} settleInfo
	 * @param {Node|Document} [rootNode]
	 * @returns
	 */
	function oobSwap(oobValue, oobElement, settleInfo, rootNode) {
		rootNode = rootNode || getDocument();
		let selector = '#' + getRawAttribute(oobElement, 'id');
		/** @type HtmxSwapStyle */
		let swapStyle = 'outerHTML';
		if (oobValue === 'true') {
			// do nothing
		}
		else if (oobValue.indexOf(':') > 0) {
			swapStyle = oobValue.substr(0, oobValue.indexOf(':'));
			selector = oobValue.substr(oobValue.indexOf(':') + 1, oobValue.length);
		}
		else {
			swapStyle = oobValue;
		}
		oobElement.removeAttribute('hx-swap-oob');
		oobElement.removeAttribute('data-hx-swap-oob');

		const targets = querySelectorAllExt(rootNode, selector, false);
		if (targets) {
			forEach(
				targets,
				function (target) {
					let fragment;
					const oobElementClone = oobElement.cloneNode(true);
					fragment = getDocument().createDocumentFragment();
					fragment.appendChild(oobElementClone);
					if (!isInlineSwap(swapStyle, target)) {
						fragment = asParentNode(oobElementClone); // if this is not an inline swap, we use the content of the node, not the node itself
					}

					const beforeSwapDetails = { fragment, shouldSwap: true, target };
					if (!triggerEvent(target, 'htmx:oobBeforeSwap', beforeSwapDetails)) return;

					target = beforeSwapDetails.target; // allow re-targeting
					if (beforeSwapDetails.shouldSwap) {
						handlePreservedElements(fragment);
						swapWithStyle(swapStyle, target, target, fragment, settleInfo);
						restorePreservedElements();
					}
					forEach(settleInfo.elts, function (elt) {
						triggerEvent(elt, 'htmx:oobAfterSwap', beforeSwapDetails);
					});
				},
			);
			oobElement.parentNode.removeChild(oobElement);
		}
		else {
			oobElement.parentNode.removeChild(oobElement);
			triggerErrorEvent(getDocument().body, 'htmx:oobErrorNoTarget', { content: oobElement });
		}
		return oobValue;
	}

	/**
	 *
	 */
	function restorePreservedElements() {
		const pantry = find('#--htmx-preserve-pantry--');
		if (pantry) {
			for (const preservedElt of [...pantry.children]) {
				const existingElement = find('#' + preservedElt.id);
				// @ts-ignore - use proposed moveBefore feature
				existingElement.parentNode.moveBefore(preservedElt, existingElement);
				existingElement.remove();
			}
			pantry.remove();
		}
	}

	/**
	 * @param {DocumentFragment|ParentNode} fragment
	 */
	function handlePreservedElements(fragment) {
		forEach(findAll(fragment, '[hx-preserve], [data-hx-preserve]'), function (preservedElt) {
			const id = getAttributeValue(preservedElt, 'id');
			const existingElement = getDocument().getElementById(id);
			if (existingElement != null) {
				if (preservedElt.moveBefore) { // if the moveBefore API exists, use it
					// get or create a storage spot for stuff
					let pantry = find('#--htmx-preserve-pantry--');
					if (pantry == null) {
						getDocument().body.insertAdjacentHTML('afterend', '<div id=\'--htmx-preserve-pantry--\'></div>');
						pantry = find('#--htmx-preserve-pantry--');
					}
					// @ts-ignore - use proposed moveBefore feature
					pantry.moveBefore(existingElement, null);
				}
				else {
					preservedElt.parentNode.replaceChild(existingElement, preservedElt);
				}
			}
		});
	}

	/**
	 * @param {Node} parentNode
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function handleAttributes(parentNode, fragment, settleInfo) {
		forEach(fragment.querySelectorAll('[id]'), function (newNode) {
			const id = getRawAttribute(newNode, 'id');
			if (id && id.length > 0) {
				const normalizedId = id.replace('\'', '\\\'');
				const normalizedTag = newNode.tagName.replace(':', '\\:');
				const parentElt = asParentNode(parentNode);
				const oldNode = parentElt && parentElt.querySelector(normalizedTag + '[id=\'' + normalizedId + '\']');
				if (oldNode && oldNode !== parentElt) {
					const newAttributes = newNode.cloneNode();
					cloneAttributes(newNode, oldNode);
					settleInfo.tasks.push(function () {
						cloneAttributes(newNode, newAttributes);
					});
				}
			}
		});
	}

	/**
	 * @param {Node} child
	 * @returns {HtmxSettleTask}
	 */
	function makeAjaxLoadTask(child) {
		return function () {
			removeClassFromElement(child, htmx.config.addedClass);
			processNode(asElement(child));
			processFocus(asParentNode(child));
			triggerEvent(child, 'htmx:load');
		};
	}

	/**
	 * @param {ParentNode} child
	 */
	function processFocus(child) {
		const autofocus = '[autofocus]';
		const autoFocusedElt = asHtmlElement(matches(child, autofocus) ? child : child.querySelector(autofocus));
		if (autoFocusedElt != null) {
			autoFocusedElt.focus();
		}
	}

	/**
	 * @param {Node} parentNode
	 * @param {Node} insertBefore
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function insertNodesBefore(parentNode, insertBefore, fragment, settleInfo) {
		handleAttributes(parentNode, fragment, settleInfo);
		while (fragment.childNodes.length > 0) {
			const child = fragment.firstChild;
			addClassToElement(asElement(child), htmx.config.addedClass);
			parentNode.insertBefore(child, insertBefore);
			if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) {
				settleInfo.tasks.push(makeAjaxLoadTask(child));
			}
		}
	}

	/**
	 * Based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0,
	 * derived from Java's string hashcode implementation.
	 * @param {string} string
	 * @param {number} hash
	 * @returns {number}
	 */
	function stringHash(string, hash) {
		let char = 0;
		while (char < string.length) {
			hash = (hash << 5) - hash + string.charCodeAt(char++) | 0; // bitwise or ensures we have a 32-bit int
		}
		return hash;
	}

	/**
	 * @param {Element} elt
	 * @returns {number}
	 */
	function attributeHash(elt) {
		let hash = 0;
		// IE fix
		if (elt.attributes) {
			for (let i = 0; i < elt.attributes.length; i++) {
				const attribute = elt.attributes[i];
				if (attribute.value) { // only include attributes w/ actual values (empty is same as non-existent)
					hash = stringHash(attribute.name, hash);
					hash = stringHash(attribute.value, hash);
				}
			}
		}
		return hash;
	}

	/**
	 * @param {EventTarget} elt
	 */
	function deInitOnHandlers(elt) {
		const internalData = getInternalData(elt);
		if (internalData.onHandlers) {
			for (let i = 0; i < internalData.onHandlers.length; i++) {
				const handlerInfo = internalData.onHandlers[i];
				removeEventListenerImpl(elt, handlerInfo.event, handlerInfo.listener);
			}
			delete internalData.onHandlers;
		}
	}

	/**
	 * @param {Node} element
	 */
	function deInitNode(element) {
		const internalData = getInternalData(element);
		if (internalData.timeout) {
			clearTimeout(internalData.timeout);
		}
		if (internalData.listenerInfos) {
			forEach(internalData.listenerInfos, function (info) {
				if (info.on) {
					removeEventListenerImpl(info.on, info.trigger, info.listener);
				}
			});
		}
		deInitOnHandlers(element);
		forEach(Object.keys(internalData), function (key) { delete internalData[key]; });
	}

	/**
	 * @param {Node} element
	 */
	function cleanUpElement(element) {
		triggerEvent(element, 'htmx:beforeCleanupElement');
		deInitNode(element);
		// @ts-ignore IE11 code
		// noinspection JSUnresolvedReference
		if (element.children) { // IE
			// @ts-ignore
			forEach(element.children, function (child) { cleanUpElement(child); });
		}
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapOuterHTML(target, fragment, settleInfo) {
		if (target instanceof Element && target.tagName === 'BODY') { // special case the body to innerHTML because DocumentFragments can't contain a body elt unfortunately
			swapInnerHTML(target, fragment, settleInfo); return;
		}
		/** @type {Node} */
		let newElt;
		const eltBeforeNewContent = target.previousSibling;
		const parentNode = parentElt(target);
		if (!parentNode) { // when parent node disappears, we can't do anything
			return;
		}
		insertNodesBefore(parentNode, target, fragment, settleInfo);
		if (eltBeforeNewContent == null) {
			newElt = parentNode.firstChild;
		}
		else {
			newElt = eltBeforeNewContent.nextSibling;
		}
		settleInfo.elts = settleInfo.elts.filter(function (e) { return e !== target; });
		// scan through all newly added content and add all elements to the settle info so we trigger
		// events properly on them
		while (newElt && newElt !== target) {
			if (newElt instanceof Element) {
				settleInfo.elts.push(newElt);
			}
			newElt = newElt.nextSibling;
		}
		cleanUpElement(target);
		if (target instanceof Element) {
			target.remove();
		}
		else {
			target.parentNode.removeChild(target);
		}
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapAfterBegin(target, fragment, settleInfo) {
		insertNodesBefore(target, target.firstChild, fragment, settleInfo);
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapBeforeBegin(target, fragment, settleInfo) {
		insertNodesBefore(parentElt(target), target, fragment, settleInfo);
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapBeforeEnd(target, fragment, settleInfo) {
		insertNodesBefore(target, null, fragment, settleInfo);
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapAfterEnd(target, fragment, settleInfo) {
		insertNodesBefore(parentElt(target), target.nextSibling, fragment, settleInfo);
	}

	/**
	 * @param {Node} target
	 */
	function swapDelete(target) {
		cleanUpElement(target);
		const parent = parentElt(target);
		if (parent) {
			return parent.removeChild(target);
		}
	}

	/**
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapInnerHTML(target, fragment, settleInfo) {
		const firstChild = target.firstChild;
		insertNodesBefore(target, firstChild, fragment, settleInfo);
		if (firstChild) {
			while (firstChild.nextSibling) {
				cleanUpElement(firstChild.nextSibling);
				target.removeChild(firstChild.nextSibling);
			}
			cleanUpElement(firstChild);
			target.removeChild(firstChild);
		}
	}

	/**
	 * @param {HtmxSwapStyle} swapStyle
	 * @param {Element} elt
	 * @param {Node} target
	 * @param {ParentNode} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 */
	function swapWithStyle(swapStyle, elt, target, fragment, settleInfo) {
		switch (swapStyle) {
			case 'afterbegin':
				swapAfterBegin(target, fragment, settleInfo);
				return;
			case 'afterend':
				swapAfterEnd(target, fragment, settleInfo);
				return;
			case 'beforebegin':
				swapBeforeBegin(target, fragment, settleInfo);
				return;
			case 'beforeend':
				swapBeforeEnd(target, fragment, settleInfo);
				return;
			case 'delete':
				swapDelete(target);
				return;
			case 'none':
				return;
			case 'outerHTML':
				swapOuterHTML(target, fragment, settleInfo);
				return;
			default:
				var extensions = getExtensions(elt);
				for (let i = 0; i < extensions.length; i++) {
					const ext = extensions[i];
					try {
						const newElements = ext.handleSwap(swapStyle, target, fragment, settleInfo);
						if (newElements) {
							if (Array.isArray(newElements)) {
								// if handleSwap returns an array (like) of elements, we handle them
								for (let j = 0; j < newElements.length; j++) {
									const child = newElements[j];
									if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.COMMENT_NODE) {
										settleInfo.tasks.push(makeAjaxLoadTask(child));
									}
								}
							}
							return;
						}
					}
					catch (e) {
						logError(e);
					}
				}
				if (swapStyle === 'innerHTML') {
					swapInnerHTML(target, fragment, settleInfo);
				}
				else {
					swapWithStyle(htmx.config.defaultSwapStyle, elt, target, fragment, settleInfo);
				}
		}
	}

	/**
	 * @param {DocumentFragment} fragment
	 * @param {HtmxSettleInfo} settleInfo
	 * @param {Node|Document} [rootNode]
	 */
	function findAndSwapOobElements(fragment, settleInfo, rootNode) {
		var oobElts = findAll(fragment, '[hx-swap-oob], [data-hx-swap-oob]');
		forEach(oobElts, function (oobElement) {
			if (htmx.config.allowNestedOobSwaps || oobElement.parentElement === null) {
				const oobValue = getAttributeValue(oobElement, 'hx-swap-oob');
				if (oobValue != null) {
					oobSwap(oobValue, oobElement, settleInfo, rootNode);
				}
			}
			else {
				oobElement.removeAttribute('hx-swap-oob');
				oobElement.removeAttribute('data-hx-swap-oob');
			}
		});
		return oobElts.length > 0;
	}

	/**
	 * Implements complete swapping pipeline, including: focus and selection preservation,
	 * title updates, scroll, OOB swapping, normal swapping and settling.
	 * @param {string|Element} target
	 * @param {string} content
	 * @param {HtmxSwapSpecification} swapSpec
	 * @param {SwapOptions} [swapOptions]
	 */
	function swap(target, content, swapSpec, swapOptions) {
		if (!swapOptions) {
			swapOptions = {};
		}

		target = resolveTarget(target);
		const rootNode = swapOptions.contextElement ? getRootNode(swapOptions.contextElement, false) : getDocument();

		// preserve focus and selection
		const activeElt = document.activeElement;
		let selectionInfo = {};
		try {
			selectionInfo = {
				elt: activeElt,
				// @ts-ignore
				end: activeElt ? activeElt.selectionEnd : null,
				// @ts-ignore
				start: activeElt ? activeElt.selectionStart : null,
			};
		}
		catch (e) {
			// safari issue - see https://github.com/microsoft/playwright/issues/5894
		}
		const settleInfo = makeSettleInfo(target);

		// For text content swaps, don't parse the response as HTML, just insert it
		if (swapSpec.swapStyle === 'textContent') {
			target.textContent = content;
			// Otherwise, make the fragment and process it
		}
		else {
			let fragment = makeFragment(content);

			settleInfo.title = fragment.title;

			// select-oob swaps
			if (swapOptions.selectOOB) {
				const oobSelectValues = swapOptions.selectOOB.split(',');
				for (let i = 0; i < oobSelectValues.length; i++) {
					const oobSelectValue = oobSelectValues[i].split(':', 2);
					let id = oobSelectValue[0].trim();
					if (id.indexOf('#') === 0) {
						id = id.substring(1);
					}
					const oobValue = oobSelectValue[1] || 'true';
					const oobElement = fragment.querySelector('#' + id);
					if (oobElement) {
						oobSwap(oobValue, oobElement, settleInfo, rootNode);
					}
				}
			}
			// oob swaps
			findAndSwapOobElements(fragment, settleInfo, rootNode);
			forEach(findAll(fragment, 'template'), /** @param {HTMLTemplateElement} template */function (template) {
				if (findAndSwapOobElements(template.content, settleInfo, rootNode)) {
					// Avoid polluting the DOM with empty templates that were only used to encapsulate oob swap
					template.remove();
				}
			});

			// normal swap
			if (swapOptions.select) {
				const newFragment = getDocument().createDocumentFragment();
				forEach(fragment.querySelectorAll(swapOptions.select), function (node) {
					newFragment.appendChild(node);
				});
				fragment = newFragment;
			}
			handlePreservedElements(fragment);
			swapWithStyle(swapSpec.swapStyle, swapOptions.contextElement, target, fragment, settleInfo);
			restorePreservedElements();
		}

		// apply saved focus and selection information to swapped content
		if (selectionInfo.elt
			&& !bodyContains(selectionInfo.elt)
			&& getRawAttribute(selectionInfo.elt, 'id')) {
			const newActiveElt = document.getElementById(getRawAttribute(selectionInfo.elt, 'id'));
			const focusOptions = { preventScroll: swapSpec.focusScroll !== undefined ? !swapSpec.focusScroll : !htmx.config.defaultFocusScroll };
			if (newActiveElt) {
				// @ts-ignore
				if (selectionInfo.start && newActiveElt.setSelectionRange) {
					try {
						// @ts-ignore
						newActiveElt.setSelectionRange(selectionInfo.start, selectionInfo.end);
					}
					catch (e) {
						// the setSelectionRange method is present on fields that don't support it, so just let this fail
					}
				}
				newActiveElt.focus(focusOptions);
			}
		}

		target.classList.remove(htmx.config.swappingClass);
		forEach(settleInfo.elts, function (elt) {
			if (elt.classList) {
				elt.classList.add(htmx.config.settlingClass);
			}
			triggerEvent(elt, 'htmx:afterSwap', swapOptions.eventInfo);
		});
		if (swapOptions.afterSwapCallback) {
			swapOptions.afterSwapCallback();
		}

		// merge in new title after swap but before settle
		if (!swapSpec.ignoreTitle) {
			handleTitle(settleInfo.title);
		}

		/**
		 * Settle.
		 */
		const doSettle = function () {
			forEach(settleInfo.tasks, function (task) {
				task.call();
			});
			forEach(settleInfo.elts, function (elt) {
				if (elt.classList) {
					elt.classList.remove(htmx.config.settlingClass);
				}
				triggerEvent(elt, 'htmx:afterSettle', swapOptions.eventInfo);
			});

			if (swapOptions.anchor) {
				const anchorTarget = asElement(resolveTarget('#' + swapOptions.anchor));
				if (anchorTarget) {
					anchorTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
				}
			}

			updateScrollState(settleInfo.elts, swapSpec);
			if (swapOptions.afterSettleCallback) {
				swapOptions.afterSettleCallback();
			}
		};

		if (swapSpec.settleDelay > 0) {
			getWindow().setTimeout(doSettle, swapSpec.settleDelay);
		}
		else {
			doSettle();
		}
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {string} header
	 * @param {EventTarget} elt
	 */
	function handleTriggerHeader(xhr, header, elt) {
		const triggerBody = xhr.getResponseHeader(header);
		if (triggerBody.indexOf('{') === 0) {
			const triggers = parseJSON(triggerBody);
			for (const eventName in triggers) {
				if (triggers.hasOwnProperty(eventName)) {
					let detail = triggers[eventName];
					if (isRawObject(detail)) {
						// @ts-ignore
						elt = detail.target !== undefined ? detail.target : elt;
					}
					else {
						detail = { value: detail };
					}
					triggerEvent(elt, eventName, detail);
				}
			}
		}
		else {
			const eventNames = triggerBody.split(',');
			for (let i = 0; i < eventNames.length; i++) {
				triggerEvent(elt, eventNames[i].trim(), []);
			}
		}
	}

	const WHITESPACE = /\s/;
	const WHITESPACE_OR_COMMA = /[\s,]/;
	const SYMBOL_START = /[$A-Z_a-z]/;
	const SYMBOL_CONT = /[\w$]/;
	const STRINGISH_START = ['"', '\'', '/'];
	const NOT_WHITESPACE = /\S/;
	const COMBINED_SELECTOR_START = /[({]/;
	const COMBINED_SELECTOR_END = /[)}]/;

	/**
	 * @param {string} str
	 * @returns {string[]}
	 */
	function tokenizeString(str) {
		/** @type string[] */
		const tokens = [];
		let position = 0;
		while (position < str.length) {
			if (SYMBOL_START.exec(str.charAt(position))) {
				var startPosition = position;
				while (SYMBOL_CONT.exec(str.charAt(position + 1))) {
					position++;
				}
				tokens.push(str.substr(startPosition, position - startPosition + 1));
			}
			else if (STRINGISH_START.indexOf(str.charAt(position)) !== -1) {
				const startChar = str.charAt(position);
				var startPosition = position;
				position++;
				while (position < str.length && str.charAt(position) !== startChar) {
					if (str.charAt(position) === '\\') {
						position++;
					}
					position++;
				}
				tokens.push(str.substr(startPosition, position - startPosition + 1));
			}
			else {
				const symbol = str.charAt(position);
				tokens.push(symbol);
			}
			position++;
		}
		return tokens;
	}

	/**
	 * @param {string} token
	 * @param {string|null} last
	 * @param {string} paramName
	 * @returns {boolean}
	 */
	function isPossibleRelativeReference(token, last, paramName) {
		return SYMBOL_START.exec(token.charAt(0))
			&& token !== 'true'
			&& token !== 'false'
			&& token !== 'this'
			&& token !== paramName
			&& last !== '.';
	}

	/**
	 * @param {EventTarget|string} elt
	 * @param {string[]} tokens
	 * @param {string} paramName
	 * @returns {ConditionalFunction|null}
	 */
	function maybeGenerateConditional(elt, tokens, paramName) {
		if (tokens[0] === '[') {
			tokens.shift();
			let bracketCount = 1;
			let conditionalSource = ' return (function(' + paramName + '){ return (';
			let last = null;
			while (tokens.length > 0) {
				const token = tokens[0];
				// @ts-ignore For some reason tsc doesn't understand the shift call, and thinks we're comparing the same value here, i.e. '[' vs ']'
				if (token === ']') {
					bracketCount--;
					if (bracketCount === 0) {
						if (last === null) {
							conditionalSource = conditionalSource + 'true';
						}
						tokens.shift();
						conditionalSource += ')})';
						try {
							const conditionFunction = maybeEval(elt, function () {
								return Function(conditionalSource)();
							},
							function () { return true; });
							conditionFunction.source = conditionalSource;
							return conditionFunction;
						}
						catch (e) {
							triggerErrorEvent(getDocument().body, 'htmx:syntax:error', { error: e, source: conditionalSource });
							return null;
						}
					}
				}
				else if (token === '[') {
					bracketCount++;
				}
				if (isPossibleRelativeReference(token, last, paramName)) {
					conditionalSource += '((' + paramName + '.' + token + ') ? (' + paramName + '.' + token + ') : (window.' + token + '))';
				}
				else {
					conditionalSource = conditionalSource + token;
				}
				last = tokens.shift();
			}
		}
	}

	/**
	 * @param {string[]} tokens
	 * @param {RegExp} match
	 * @returns {string}
	 */
	function consumeUntil(tokens, match) {
		let result = '';
		while (tokens.length > 0 && !match.test(tokens[0])) {
			result += tokens.shift();
		}
		return result;
	}

	/**
	 * @param {string[]} tokens
	 * @returns {string}
	 */
	function consumeCSSSelector(tokens) {
		let result;
		if (tokens.length > 0 && COMBINED_SELECTOR_START.test(tokens[0])) {
			tokens.shift();
			result = consumeUntil(tokens, COMBINED_SELECTOR_END).trim();
			tokens.shift();
		}
		else {
			result = consumeUntil(tokens, WHITESPACE_OR_COMMA);
		}
		return result;
	}

	const INPUT_SELECTOR = 'input, textarea, select';

	/**
	 * @param {Element} elt
	 * @param {string} explicitTrigger
	 * @param {object} cache - For trigger specs.
	 * @returns {HtmxTriggerSpecification[]}
	 */
	function parseAndCacheTrigger(elt, explicitTrigger, cache) {
		/** @type HtmxTriggerSpecification[] */
		const triggerSpecs = [];
		const tokens = tokenizeString(explicitTrigger);
		do {
			consumeUntil(tokens, NOT_WHITESPACE);
			const initialLength = tokens.length;
			const trigger = consumeUntil(tokens, /[\s,[]/);
			if (trigger !== '') {
				if (trigger === 'every') {
					/** @type HtmxTriggerSpecification */
					const every = { trigger: 'every' };
					consumeUntil(tokens, NOT_WHITESPACE);
					every.pollInterval = parseInterval(consumeUntil(tokens, /[\s,[]/));
					consumeUntil(tokens, NOT_WHITESPACE);
					var eventFilter = maybeGenerateConditional(elt, tokens, 'event');
					if (eventFilter) {
						every.eventFilter = eventFilter;
					}
					triggerSpecs.push(every);
				}
				else {
					/** @type HtmxTriggerSpecification */
					const triggerSpec = { trigger };
					var eventFilter = maybeGenerateConditional(elt, tokens, 'event');
					if (eventFilter) {
						triggerSpec.eventFilter = eventFilter;
					}
					consumeUntil(tokens, NOT_WHITESPACE);
					while (tokens.length > 0 && tokens[0] !== ',') {
						const token = tokens.shift();
						if (token === 'changed') {
							triggerSpec.changed = true;
						}
						else if (token === 'once') {
							triggerSpec.once = true;
						}
						else if (token === 'consume') {
							triggerSpec.consume = true;
						}
						else if (token === 'delay' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec.delay = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
						}
						else if (token === 'from' && tokens[0] === ':') {
							tokens.shift();
							if (COMBINED_SELECTOR_START.test(tokens[0])) {
								var from_arg = consumeCSSSelector(tokens);
							}
							else {
								var from_arg = consumeUntil(tokens, WHITESPACE_OR_COMMA);
								if (from_arg === 'closest' || from_arg === 'find' || from_arg === 'next' || from_arg === 'previous') {
									tokens.shift();
									const selector = consumeCSSSelector(tokens);
									// `next` and `previous` allow a selector-less syntax
									if (selector.length > 0) {
										from_arg += ' ' + selector;
									}
								}
							}
							triggerSpec.from = from_arg;
						}
						else if (token === 'target' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec.target = consumeCSSSelector(tokens);
						}
						else if (token === 'throttle' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec.throttle = parseInterval(consumeUntil(tokens, WHITESPACE_OR_COMMA));
						}
						else if (token === 'queue' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec.queue = consumeUntil(tokens, WHITESPACE_OR_COMMA);
						}
						else if (token === 'root' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec[token] = consumeCSSSelector(tokens);
						}
						else if (token === 'threshold' && tokens[0] === ':') {
							tokens.shift();
							triggerSpec[token] = consumeUntil(tokens, WHITESPACE_OR_COMMA);
						}
						else {
							triggerErrorEvent(elt, 'htmx:syntax:error', { token: tokens.shift() });
						}
						consumeUntil(tokens, NOT_WHITESPACE);
					}
					triggerSpecs.push(triggerSpec);
				}
			}
			if (tokens.length === initialLength) {
				triggerErrorEvent(elt, 'htmx:syntax:error', { token: tokens.shift() });
			}
			consumeUntil(tokens, NOT_WHITESPACE);
		} while (tokens[0] === ',' && tokens.shift());
		if (cache) {
			cache[explicitTrigger] = triggerSpecs;
		}
		return triggerSpecs;
	}

	/**
	 * @param {Element} elt
	 * @returns {HtmxTriggerSpecification[]}
	 */
	function getTriggerSpecs(elt) {
		const explicitTrigger = getAttributeValue(elt, 'hx-trigger');
		let triggerSpecs = [];
		if (explicitTrigger) {
			const cache = htmx.config.triggerSpecsCache;
			triggerSpecs = (cache && cache[explicitTrigger]) || parseAndCacheTrigger(elt, explicitTrigger, cache);
		}

		if (triggerSpecs.length > 0) {
			return triggerSpecs;
		}
		else if (matches(elt, 'form')) {
			return [{ trigger: 'submit' }];
		}
		else if (matches(elt, 'input[type="button"], input[type="submit"]')) {
			return [{ trigger: 'click' }];
		}
		else if (matches(elt, INPUT_SELECTOR)) {
			return [{ trigger: 'change' }];
		}
		else {
			return [{ trigger: 'click' }];
		}
	}

	/**
	 * @param {Element} elt
	 */
	function cancelPolling(elt) {
		getInternalData(elt).cancelled = true;
	}

	/**
	 * @param {Element} elt
	 * @param {TriggerHandler} handler
	 * @param {HtmxTriggerSpecification} spec
	 */
	function processPolling(elt, handler, spec) {
		const nodeData = getInternalData(elt);
		nodeData.timeout = getWindow().setTimeout(function () {
			if (bodyContains(elt) && nodeData.cancelled !== true) {
				if (!maybeFilterEvent(spec, elt, makeEvent('hx:poll:trigger', {
					target: elt,
					triggerSpec: spec,
				}))) {
					handler(elt);
				}
				processPolling(elt, handler, spec);
			}
		}, spec.pollInterval);
	}

	/**
	 * @param {HTMLAnchorElement} elt
	 * @returns {boolean}
	 */
	function isLocalLink(elt) {
		return location.hostname === elt.hostname
			&& getRawAttribute(elt, 'href')
			&& getRawAttribute(elt, 'href').indexOf('#') !== 0;
	}

	/**
	 * @param {Element} elt
	 */
	function eltIsDisabled(elt) {
		return closest(elt, htmx.config.disableSelector);
	}

	/**
	 * @param {Element} elt
	 * @param {HtmxNodeInternalData} nodeData
	 * @param {HtmxTriggerSpecification[]} triggerSpecs
	 */
	function boostElement(elt, nodeData, triggerSpecs) {
		if ((elt instanceof HTMLAnchorElement && isLocalLink(elt) && (elt.target === '' || elt.target === '_self')) || (elt.tagName === 'FORM' && String(getRawAttribute(elt, 'method')).toLowerCase() !== 'dialog')) {
			nodeData.boosted = true;
			let path, verb;
			if (elt.tagName === 'A') {
				verb = (/** @type HttpVerb */('get'));
				path = getRawAttribute(elt, 'href');
			}
			else {
				const rawAttribute = getRawAttribute(elt, 'method');
				verb = (/** @type HttpVerb */(rawAttribute ? rawAttribute.toLowerCase() : 'get'));
				path = getRawAttribute(elt, 'action');
				if (verb === 'get' && path.includes('?')) {
					path = path.replace(/\?[^#]+/, '');
				}
			}
			triggerSpecs.forEach(function (triggerSpec) {
				addEventListener(elt, function (node, evt) {
					const elt = asElement(node);
					if (eltIsDisabled(elt)) {
						cleanUpElement(elt);
						return;
					}
					issueAjaxRequest(verb, path, elt, evt);
				}, nodeData, triggerSpec, true);
			});
		}
	}

	/**
	 * @param {Event} evt
	 * @param {Node} node
	 * @returns {boolean}
	 */
	function shouldCancel(evt, node) {
		const elt = asElement(node);
		if (!elt) {
			return false;
		}
		if (evt.type === 'submit' || evt.type === 'click') {
			if (elt.tagName === 'FORM') {
				return true;
			}
			if (matches(elt, 'input[type="submit"], button') && closest(elt, 'form') !== null) {
				return true;
			}
			if (elt instanceof HTMLAnchorElement && elt.href
				&& (elt.getAttribute('href') === '#' || elt.getAttribute('href').indexOf('#') !== 0)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Node} elt
	 * @param {Event|MouseEvent|KeyboardEvent|TouchEvent} evt
	 * @returns {boolean}
	 */
	function ignoreBoostedAnchorCtrlClick(elt, evt) {
		return getInternalData(elt).boosted && elt instanceof HTMLAnchorElement && evt.type === 'click'
		// @ts-ignore this will resolve to undefined for events that don't define those properties, which is fine
			&& (evt.ctrlKey || evt.metaKey);
	}

	/**
	 * @param {HtmxTriggerSpecification} triggerSpec
	 * @param {Node} elt
	 * @param {Event} evt
	 * @returns {boolean}
	 */
	function maybeFilterEvent(triggerSpec, elt, evt) {
		const eventFilter = triggerSpec.eventFilter;
		if (eventFilter) {
			try {
				return !eventFilter.call(elt, evt);
			}
			catch (e) {
				const source = eventFilter.source;
				triggerErrorEvent(getDocument().body, 'htmx:eventFilter:error', { error: e, source });
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Node} elt
	 * @param {TriggerHandler} handler
	 * @param {HtmxNodeInternalData} nodeData
	 * @param {HtmxTriggerSpecification} triggerSpec
	 * @param {boolean} [explicitCancel]
	 */
	function addEventListener(elt, handler, nodeData, triggerSpec, explicitCancel) {
		const elementData = getInternalData(elt);
		/** @type {(Node|Window)[]} */
		let eltsToListenOn;
		if (triggerSpec.from) {
			eltsToListenOn = querySelectorAllExt(elt, triggerSpec.from);
		}
		else {
			eltsToListenOn = [elt];
		}
		// store the initial values of the elements, so we can tell if they change
		if (triggerSpec.changed) {
			if (!('lastValue' in elementData)) {
				elementData.lastValue = new WeakMap();
			}
			eltsToListenOn.forEach(function (eltToListenOn) {
				if (!elementData.lastValue.has(triggerSpec)) {
					elementData.lastValue.set(triggerSpec, new WeakMap());
				}
				// @ts-ignore value will be undefined for non-input elements, which is fine
				elementData.lastValue.get(triggerSpec).set(eltToListenOn, eltToListenOn.value);
			});
		}
		forEach(eltsToListenOn, function (eltToListenOn) {
			/** @type EventListener */
			const eventListener = function (evt) {
				if (!bodyContains(elt)) {
					eltToListenOn.removeEventListener(triggerSpec.trigger, eventListener);
					return;
				}
				if (ignoreBoostedAnchorCtrlClick(elt, evt)) {
					return;
				}
				if (explicitCancel || shouldCancel(evt, elt)) {
					evt.preventDefault();
				}
				if (maybeFilterEvent(triggerSpec, elt, evt)) {
					return;
				}
				const eventData = getInternalData(evt);
				eventData.triggerSpec = triggerSpec;
				if (eventData.handledFor == null) {
					eventData.handledFor = [];
				}
				if (eventData.handledFor.indexOf(elt) < 0) {
					eventData.handledFor.push(elt);
					if (triggerSpec.consume) {
						evt.stopPropagation();
					}
					if (triggerSpec.target && evt.target) {
						if (!matches(asElement(evt.target), triggerSpec.target)) {
							return;
						}
					}
					if (triggerSpec.once) {
						if (elementData.triggeredOnce) {
							return;
						}
						else {
							elementData.triggeredOnce = true;
						}
					}
					if (triggerSpec.changed) {
						const node = event.target;
						// @ts-ignore value will be undefined for non-input elements, which is fine
						const value = node.value;
						const lastValue = elementData.lastValue.get(triggerSpec);
						if (lastValue.has(node) && lastValue.get(node) === value) {
							return;
						}
						lastValue.set(node, value);
					}
					if (elementData.delayed) {
						clearTimeout(elementData.delayed);
					}
					if (elementData.throttle) {
						return;
					}

					if (triggerSpec.throttle > 0) {
						if (!elementData.throttle) {
							triggerEvent(elt, 'htmx:trigger');
							handler(elt, evt);
							elementData.throttle = getWindow().setTimeout(function () {
								elementData.throttle = null;
							}, triggerSpec.throttle);
						}
					}
					else if (triggerSpec.delay > 0) {
						elementData.delayed = getWindow().setTimeout(function () {
							triggerEvent(elt, 'htmx:trigger');
							handler(elt, evt);
						}, triggerSpec.delay);
					}
					else {
						triggerEvent(elt, 'htmx:trigger');
						handler(elt, evt);
					}
				}
			};
			if (nodeData.listenerInfos == null) {
				nodeData.listenerInfos = [];
			}
			nodeData.listenerInfos.push({
				listener: eventListener,
				on: eltToListenOn,
				trigger: triggerSpec.trigger,
			});
			eltToListenOn.addEventListener(triggerSpec.trigger, eventListener);
		});
	}

	/**
	 * Used by initScrollHandler.
	 */
	let windowIsScrolling = false;
	let scrollHandler = null;
	/**
	 *
	 */
	function initScrollHandler() {
		if (!scrollHandler) {
			scrollHandler = function () {
				windowIsScrolling = true;
			};
			window.addEventListener('scroll', scrollHandler);
			window.addEventListener('resize', scrollHandler);
			setInterval(function () {
				if (windowIsScrolling) {
					windowIsScrolling = false;
					forEach(getDocument().querySelectorAll('[hx-trigger*=\'revealed\'],[data-hx-trigger*=\'revealed\']'), function (elt) {
						maybeReveal(elt);
					});
				}
			}, 200);
		}
	}

	/**
	 * @param {Element} elt
	 */
	function maybeReveal(elt) {
		if (!hasAttribute(elt, 'data-hx-revealed') && isScrolledIntoView(elt)) {
			elt.setAttribute('data-hx-revealed', 'true');
			const nodeData = getInternalData(elt);
			if (nodeData.initHash) {
				triggerEvent(elt, 'revealed');
			}
			else {
				// if the node isn't initialized, wait for it before triggering the request
				elt.addEventListener('htmx:afterProcessNode', function () { triggerEvent(elt, 'revealed'); }, { once: true });
			}
		}
	}

	// = ===================================================================

	/**
	 * @param {Element} elt
	 * @param {TriggerHandler} handler
	 * @param {HtmxNodeInternalData} nodeData
	 * @param {number} delay
	 */
	function loadImmediately(elt, handler, nodeData, delay) {
		const load = function () {
			if (!nodeData.loaded) {
				nodeData.loaded = true;
				handler(elt);
			}
		};
		if (delay > 0) {
			getWindow().setTimeout(load, delay);
		}
		else {
			load();
		}
	}

	/**
	 * @param {Element} elt
	 * @param {HtmxNodeInternalData} nodeData
	 * @param {HtmxTriggerSpecification[]} triggerSpecs
	 * @returns {boolean}
	 */
	function processVerbs(elt, nodeData, triggerSpecs) {
		let explicitAction = false;
		forEach(VERBS, function (verb) {
			if (hasAttribute(elt, 'hx-' + verb)) {
				const path = getAttributeValue(elt, 'hx-' + verb);
				explicitAction = true;
				nodeData.path = path;
				nodeData.verb = verb;
				triggerSpecs.forEach(function (triggerSpec) {
					addTriggerHandler(elt, triggerSpec, nodeData, function (node, evt) {
						const elt = asElement(node);
						if (closest(elt, htmx.config.disableSelector)) {
							cleanUpElement(elt);
							return;
						}
						issueAjaxRequest(verb, path, elt, evt);
					});
				});
			}
		});
		return explicitAction;
	}

	/**
	 * @callback TriggerHandler
	 * @param {Node} elt
	 * @param {Event} [evt]
	 */

	/**
	 * @param {Node} elt
	 * @param {HtmxTriggerSpecification} triggerSpec
	 * @param {HtmxNodeInternalData} nodeData
	 * @param {TriggerHandler} handler
	 */
	function addTriggerHandler(elt, triggerSpec, nodeData, handler) {
		if (triggerSpec.trigger === 'revealed') {
			initScrollHandler();
			addEventListener(elt, handler, nodeData, triggerSpec);
			maybeReveal(asElement(elt));
		}
		else if (triggerSpec.trigger === 'intersect') {
			const observerOptions = {};
			if (triggerSpec.root) {
				observerOptions.root = querySelectorExt(elt, triggerSpec.root);
			}
			if (triggerSpec.threshold) {
				observerOptions.threshold = parseFloat(triggerSpec.threshold);
			}
			const observer = new IntersectionObserver(function (entries) {
				for (let i = 0; i < entries.length; i++) {
					const entry = entries[i];
					if (entry.isIntersecting) {
						triggerEvent(elt, 'intersect');
						break;
					}
				}
			}, observerOptions);
			observer.observe(asElement(elt));
			addEventListener(asElement(elt), handler, nodeData, triggerSpec);
		}
		else if (triggerSpec.trigger === 'load') {
			if (!maybeFilterEvent(triggerSpec, elt, makeEvent('load', { elt }))) {
				loadImmediately(asElement(elt), handler, nodeData, triggerSpec.delay);
			}
		}
		else if (triggerSpec.pollInterval > 0) {
			nodeData.polling = true;
			processPolling(asElement(elt), handler, triggerSpec);
		}
		else {
			addEventListener(elt, handler, nodeData, triggerSpec);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {boolean}
	 */
	function shouldProcessHxOn(node) {
		const elt = asElement(node);
		if (!elt) {
			return false;
		}
		const attributes = elt.attributes;
		for (let j = 0; j < attributes.length; j++) {
			const attrName = attributes[j].name;
			if (startsWith(attrName, 'hx-on:') || startsWith(attrName, 'data-hx-on:')
				|| startsWith(attrName, 'hx-on-') || startsWith(attrName, 'data-hx-on-')) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Node} elt
	 * @returns {Element[]}
	 */
	const HX_ON_QUERY = new XPathEvaluator()
		.createExpression('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or'
			+ ' starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]');

	/**
	 * @param elt
	 * @param elements
	 */
	function processHXOnRoot(elt, elements) {
		if (shouldProcessHxOn(elt)) {
			elements.push(asElement(elt));
		}
		const iter = HX_ON_QUERY.evaluate(elt);
		let node = null;
		while (node = iter.iterateNext()) elements.push(asElement(node));
	}

	/**
	 * @param elt
	 */
	function findHxOnWildcardElements(elt) {
		/** @type {Element[]} */
		const elements = [];
		if (elt instanceof DocumentFragment) {
			for (const child of elt.childNodes) {
				processHXOnRoot(child, elements);
			}
		}
		else {
			processHXOnRoot(elt, elements);
		}
		return elements;
	}

	/**
	 * @param {Element} elt
	 * @returns {NodeListOf<Element>|[]}
	 */
	function findElementsToProcess(elt) {
		if (elt.querySelectorAll) {
			const boostedSelector = ', [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]';

			const extensionSelectors = [];
			for (const e in extensions) {
				const extension = extensions[e];
				if (extension.getSelectors) {
					var selectors = extension.getSelectors();
					if (selectors) {
						extensionSelectors.push(selectors);
					}
				}
			}

			const results = elt.querySelectorAll(VERB_SELECTOR + boostedSelector + ', form, [type=\'submit\'],'
				+ ' [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]' + extensionSelectors.flat().map(s => ', ' + s).join(''));

			return results;
		}
		else {
			return [];
		}
	}

	/**
	 * Handle submit buttons/inputs that have the form attribute set
	 * see https://developer.mozilla.org/docs/Web/HTML/Element/button.
	 * @param {Event} evt
	 */
	function maybeSetLastButtonClicked(evt) {
		const elt = /** @type {HTMLButtonElement|HTMLInputElement} */ (closest(asElement(evt.target), 'button, input[type=\'submit\']'));
		const internalData = getRelatedFormData(evt);
		if (internalData) {
			internalData.lastButtonClicked = elt;
		}
	}

	/**
	 * @param {Event} evt
	 */
	function maybeUnsetLastButtonClicked(evt) {
		const internalData = getRelatedFormData(evt);
		if (internalData) {
			internalData.lastButtonClicked = null;
		}
	}

	/**
	 * @param {Event} evt
	 * @returns {HtmxNodeInternalData|undefined}
	 */
	function getRelatedFormData(evt) {
		const elt = closest(asElement(evt.target), 'button, input[type=\'submit\']');
		if (!elt) {
			return;
		}
		const form = resolveTarget('#' + getRawAttribute(elt, 'form'), elt.getRootNode()) || closest(elt, 'form');
		if (!form) {
			return;
		}
		return getInternalData(form);
	}

	/**
	 * @param {EventTarget} elt
	 */
	function initButtonTracking(elt) {
		// need to handle both click and focus in:
		//   focusin - in case someone tabs in to a button and hits the space bar
		//   click - on OSX buttons do not focus on click see https://bugs.webkit.org/show_bug.cgi?id=13724
		elt.addEventListener('click', maybeSetLastButtonClicked);
		elt.addEventListener('focusin', maybeSetLastButtonClicked);
		elt.addEventListener('focusout', maybeUnsetLastButtonClicked);
	}

	/**
	 * @param {Element} elt
	 * @param {string} eventName
	 * @param {string} code
	 */
	function addHxOnEventHandler(elt, eventName, code) {
		const nodeData = getInternalData(elt);
		if (!Array.isArray(nodeData.onHandlers)) {
			nodeData.onHandlers = [];
		}
		let func;
		/** @type EventListener */
		const listener = function (e) {
			maybeEval(elt, function () {
				if (eltIsDisabled(elt)) {
					return;
				}
				if (!func) {
					func = new Function('event', code);
				}
				func.call(elt, e);
			});
		};
		elt.addEventListener(eventName, listener);
		nodeData.onHandlers.push({ event: eventName, listener });
	}

	/**
	 * @param {Element} elt
	 */
	function processHxOnWildcard(elt) {
		// wipe any previous on handlers so that this function takes precedence
		deInitOnHandlers(elt);

		for (let i = 0; i < elt.attributes.length; i++) {
			const name = elt.attributes[i].name;
			const value = elt.attributes[i].value;
			if (startsWith(name, 'hx-on') || startsWith(name, 'data-hx-on')) {
				const afterOnPosition = name.indexOf('-on') + 3;
				const nextChar = name.slice(afterOnPosition, afterOnPosition + 1);
				if (nextChar === '-' || nextChar === ':') {
					let eventName = name.slice(afterOnPosition + 1);
					// if the eventName starts with a colon or dash, prepend "htmx" for shorthand support
					if (startsWith(eventName, ':')) {
						eventName = 'htmx' + eventName;
					}
					else if (startsWith(eventName, '-')) {
						eventName = 'htmx:' + eventName.slice(1);
					}
					else if (startsWith(eventName, 'htmx-')) {
						eventName = 'htmx:' + eventName.slice(5);
					}

					addHxOnEventHandler(elt, eventName, value);
				}
			}
		}
	}

	/**
	 * @param {Element|HTMLInputElement} elt
	 */
	function initNode(elt) {
		if (closest(elt, htmx.config.disableSelector)) {
			cleanUpElement(elt);
			return;
		}
		const nodeData = getInternalData(elt);
		if (nodeData.initHash !== attributeHash(elt)) {
			// clean up any previously processed info
			deInitNode(elt);

			nodeData.initHash = attributeHash(elt);

			triggerEvent(elt, 'htmx:beforeProcessNode');

			const triggerSpecs = getTriggerSpecs(elt);
			const hasExplicitHttpAction = processVerbs(elt, nodeData, triggerSpecs);

			if (!hasExplicitHttpAction) {
				if (getClosestAttributeValue(elt, 'hx-boost') === 'true') {
					boostElement(elt, nodeData, triggerSpecs);
				}
				else if (hasAttribute(elt, 'hx-trigger')) {
					triggerSpecs.forEach(function (triggerSpec) {
						// For "naked" triggers, don't do anything at all
						addTriggerHandler(elt, triggerSpec, nodeData, function () {
						});
					});
				}
			}

			// Handle submit buttons/inputs that have the form attribute set
			// see https://developer.mozilla.org/docs/Web/HTML/Element/button
			if (elt.tagName === 'FORM' || (getRawAttribute(elt, 'type') === 'submit' && hasAttribute(elt, 'form'))) {
				initButtonTracking(elt);
			}

			triggerEvent(elt, 'htmx:afterProcessNode');
		}
	}

	/**
	 * Processes new content, enabling htmx behavior. This can be useful if you have content that is added to the DOM outside of the normal htmx request cycle but still want htmx attributes to work.
	 * @param {Element|string} elt - Element to process.
	 * @see https://htmx.org/api/#process
	 */
	function processNode(elt) {
		elt = resolveTarget(elt);
		if (closest(elt, htmx.config.disableSelector)) {
			cleanUpElement(elt);
			return;
		}
		initNode(elt);
		forEach(findElementsToProcess(elt), function (child) { initNode(child); });
		forEach(findHxOnWildcardElements(elt), processHxOnWildcard);
	}

	// = ===================================================================
	// Event/Log Support
	// = ===================================================================

	/**
	 * @param {string} str
	 * @returns {string}
	 */
	function kebabEventName(str) {
		return str.replace(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	/**
	 * @param {string} eventName
	 * @param {any} detail
	 * @returns {CustomEvent}
	 */
	function makeEvent(eventName, detail) {
		let evt;
		if (window.CustomEvent && typeof window.CustomEvent === 'function') {
			// TODO: `composed: true` here is a hack to make global event handlers work with events in shadow DOM
			// This breaks expected encapsulation but needs to be here until decided otherwise by core devs
			evt = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true, detail });
		}
		else {
			evt = getDocument().createEvent('CustomEvent');
			evt.initCustomEvent(eventName, true, true, detail);
		}
		return evt;
	}

	/**
	 * @param {EventTarget|string} elt
	 * @param {string} eventName
	 * @param {any=} detail
	 */
	function triggerErrorEvent(elt, eventName, detail) {
		triggerEvent(elt, eventName, mergeObjects({ error: eventName }, detail));
	}

	/**
	 * @param {string} eventName
	 * @returns {boolean}
	 */
	function ignoreEventForLogging(eventName) {
		return eventName === 'htmx:afterProcessNode';
	}

	/**
	 * `withExtensions` locates all active extensions for a provided element, then
	 * executes the provided function using each of the active extensions.  It should
	 * be called internally at every extendable execution point in htmx.
	 * @param {Element} elt
	 * @param {(extension:HtmxExtension) => void} toDo
	 * @returns Void.
	 */
	function withExtensions(elt, toDo) {
		forEach(getExtensions(elt), function (extension) {
			try {
				toDo(extension);
			}
			catch (e) {
				logError(e);
			}
		});
	}

	/**
	 * @param msg
	 */
	function logError(msg) {
		if (console.error) {
			console.error(msg);
		}
		else if (console.log) {
			console.log('ERROR: ', msg);
		}
	}

	/**
	 * Triggers a given event on an element.
	 * @param {EventTarget|string} elt - The element to trigger the event on.
	 * @param {string} eventName - The name of the event to trigger.
	 * @param {any=} detail - Details for the event.
	 * @returns {boolean}
	 * @see https://htmx.org/api/#trigger
	 */
	function triggerEvent(elt, eventName, detail) {
		elt = resolveTarget(elt);
		if (detail == null) {
			detail = {};
		}
		detail.elt = elt;
		const event = makeEvent(eventName, detail);
		if (htmx.logger && !ignoreEventForLogging(eventName)) {
			htmx.logger(elt, eventName, detail);
		}
		if (detail.error) {
			logError(detail.error);
			triggerEvent(elt, 'htmx:error', { errorInfo: detail });
		}
		let eventResult = elt.dispatchEvent(event);
		const kebabName = kebabEventName(eventName);
		if (eventResult && kebabName !== eventName) {
			const kebabedEvent = makeEvent(kebabName, event.detail);
			eventResult = eventResult && elt.dispatchEvent(kebabedEvent);
		}
		withExtensions(asElement(elt), function (extension) {
			eventResult = eventResult && (extension.onEvent(eventName, event) && !event.defaultPrevented);
		});
		return eventResult;
	}

	// = ===================================================================
	// History Support
	// = ===================================================================
	let currentPathForHistory = location.pathname + location.search;

	/**
	 * @returns {Element}
	 */
	function getHistoryElement() {
		const historyElt = getDocument().querySelector('[hx-history-elt],[data-hx-history-elt]');
		return historyElt || getDocument().body;
	}

	/**
	 * @param {string} url
	 * @param {Element} rootElt
	 */
	function saveToHistoryCache(url, rootElt) {
		if (!canAccessLocalStorage()) {
			return;
		}

		// get state to save
		const innerHTML = cleanInnerHtmlForHistory(rootElt);
		const title = getDocument().title;
		const scroll = window.scrollY;

		if (htmx.config.historyCacheSize <= 0) {
			// make sure that an eventually already existing cache is purged
			localStorage.removeItem('htmx-history-cache');
			return;
		}

		url = normalizePath(url);

		const historyCache = parseJSON(localStorage.getItem('htmx-history-cache')) || [];
		for (let i = 0; i < historyCache.length; i++) {
			if (historyCache[i].url === url) {
				historyCache.splice(i, 1);
				break;
			}
		}

		/** @type HtmxHistoryItem */
		const newHistoryItem = { content: innerHTML, scroll, title, url };

		triggerEvent(getDocument().body, 'htmx:historyItemCreated', { cache: historyCache, item: newHistoryItem });

		historyCache.push(newHistoryItem);
		while (historyCache.length > htmx.config.historyCacheSize) {
			historyCache.shift();
		}

		// keep trying to save the cache until it succeeds or is empty
		while (historyCache.length > 0) {
			try {
				localStorage.setItem('htmx-history-cache', JSON.stringify(historyCache));
				break;
			}
			catch (e) {
				triggerErrorEvent(getDocument().body, 'htmx:historyCacheError', { cache: historyCache, cause: e });
				historyCache.shift(); // shrink the cache and retry
			}
		}
	}

	/**
	 * @typedef {object} HtmxHistoryItem
	 * @property {string} url
	 * @property {string} content
	 * @property {string} title
	 * @property {number} scroll
	 */

	/**
	 * @param {string} url
	 * @returns {HtmxHistoryItem|null}
	 */
	function getCachedHistory(url) {
		if (!canAccessLocalStorage()) {
			return null;
		}

		url = normalizePath(url);

		const historyCache = parseJSON(localStorage.getItem('htmx-history-cache')) || [];
		for (let i = 0; i < historyCache.length; i++) {
			if (historyCache[i].url === url) {
				return historyCache[i];
			}
		}
		return null;
	}

	/**
	 * @param {Element} elt
	 * @returns {string}
	 */
	function cleanInnerHtmlForHistory(elt) {
		const className = htmx.config.requestClass;
		const clone = /** @type Element */ (elt.cloneNode(true));
		forEach(findAll(clone, '.' + className), function (child) {
			removeClassFromElement(child, className);
		});
		// remove the disabled attribute for any element disabled due to an htmx request
		forEach(findAll(clone, '[data-disabled-by-htmx]'), function (child) {
			child.removeAttribute('disabled');
		});
		return clone.innerHTML;
	}

	/**
	 *
	 */
	function saveCurrentPageToHistory() {
		const elt = getHistoryElement();
		const path = currentPathForHistory || location.pathname + location.search;

		// Allow history snapshot feature to be disabled where hx-history="false"
		// is present *anywhere* in the current document we're about to save,
		// so we can prevent privileged data entering the cache.
		// The page will still be reachable as a history entry, but htmx will fetch it
		// live from the server onpopstate rather than look in the localStorage cache
		let disableHistoryCache;
		try {
			disableHistoryCache = getDocument().querySelector('[hx-history="false" i],[data-hx-history="false" i]');
		}
		catch (e) {
			// IE11: insensitive modifier not supported so fallback to case sensitive selector
			disableHistoryCache = getDocument().querySelector('[hx-history="false"],[data-hx-history="false"]');
		}
		if (!disableHistoryCache) {
			triggerEvent(getDocument().body, 'htmx:beforeHistorySave', { historyElt: elt, path });
			saveToHistoryCache(path, elt);
		}

		if (htmx.config.historyEnabled) history.replaceState({ htmx: true }, getDocument().title, window.location.href);
	}

	/**
	 * @param {string} path
	 */
	function pushUrlIntoHistory(path) {
		// remove the cache buster parameter, if any
		if (htmx.config.getCacheBusterParam) {
			path = path.replace(/org\.htmx\.cache-buster=[^&]*&?/, '');
			if (endsWith(path, '&') || endsWith(path, '?')) {
				path = path.slice(0, -1);
			}
		}
		if (htmx.config.historyEnabled) {
			history.pushState({ htmx: true }, '', path);
		}
		currentPathForHistory = path;
	}

	/**
	 * @param {string} path
	 */
	function replaceUrlInHistory(path) {
		if (htmx.config.historyEnabled) history.replaceState({ htmx: true }, '', path);
		currentPathForHistory = path;
	}

	/**
	 * @param {HtmxSettleTask[]} tasks
	 */
	function settleImmediately(tasks) {
		forEach(tasks, function (task) {
			task.call(undefined);
		});
	}

	/**
	 * @param {string} path
	 */
	function loadHistoryFromServer(path) {
		const request = new XMLHttpRequest();
		const details = { path, xhr: request };
		triggerEvent(getDocument().body, 'htmx:historyCacheMiss', details);
		request.open('GET', path, true);
		request.setRequestHeader('HX-Request', 'true');
		request.setRequestHeader('HX-History-Restore-Request', 'true');
		request.setRequestHeader('HX-Current-URL', getDocument().location.href);
		request.onload = function () {
			if (this.status >= 200 && this.status < 400) {
				triggerEvent(getDocument().body, 'htmx:historyCacheMissLoad', details);
				const fragment = makeFragment(this.response);
				/** @type ParentNode */
				const content = fragment.querySelector('[hx-history-elt],[data-hx-history-elt]') || fragment;
				const historyElement = getHistoryElement();
				const settleInfo = makeSettleInfo(historyElement);
				handleTitle(fragment.title);

				handlePreservedElements(fragment);
				swapInnerHTML(historyElement, content, settleInfo);
				restorePreservedElements();
				settleImmediately(settleInfo.tasks);
				currentPathForHistory = path;
				triggerEvent(getDocument().body, 'htmx:historyRestore', { cacheMiss: true, path, serverResponse: this.response });
			}
			else {
				triggerErrorEvent(getDocument().body, 'htmx:historyCacheMissLoadError', details);
			}
		};
		request.send();
	}

	/**
	 * @param {string} [path]
	 */
	function restoreHistory(path) {
		saveCurrentPageToHistory();
		path = path || location.pathname + location.search;
		const cached = getCachedHistory(path);
		if (cached) {
			const fragment = makeFragment(cached.content);
			const historyElement = getHistoryElement();
			const settleInfo = makeSettleInfo(historyElement);
			handleTitle(cached.title);
			handlePreservedElements(fragment);
			swapInnerHTML(historyElement, fragment, settleInfo);
			restorePreservedElements();
			settleImmediately(settleInfo.tasks);
			getWindow().setTimeout(function () {
				window.scrollTo(0, cached.scroll);
			}, 0); // next 'tick', so browser has time to render layout
			currentPathForHistory = path;
			triggerEvent(getDocument().body, 'htmx:historyRestore', { item: cached, path });
		}
		else {
			if (htmx.config.refreshOnHistoryMiss) {
				// @ts-ignore: optional parameter in reload() function throws error
				// noinspection JSUnresolvedReference
				window.location.reload(true);
			}
			else {
				loadHistoryFromServer(path);
			}
		}
	}

	/**
	 * @param {Element} elt
	 * @returns {Element[]}
	 */
	function addRequestIndicatorClasses(elt) {
		let indicators = /** @type Element[] */ (findAttributeTargets(elt, 'hx-indicator'));
		if (indicators == null) {
			indicators = [elt];
		}
		forEach(indicators, function (ic) {
			const internalData = getInternalData(ic);
			internalData.requestCount = (internalData.requestCount || 0) + 1;
			ic.classList.add.call(ic.classList, htmx.config.requestClass);
		});
		return indicators;
	}

	/**
	 * @param {Element} elt
	 * @returns {Element[]}
	 */
	function disableElements(elt) {
		let disabledElts = /** @type Element[] */ (findAttributeTargets(elt, 'hx-disabled-elt'));
		if (disabledElts == null) {
			disabledElts = [];
		}
		forEach(disabledElts, function (disabledElement) {
			const internalData = getInternalData(disabledElement);
			internalData.requestCount = (internalData.requestCount || 0) + 1;
			disabledElement.setAttribute('disabled', '');
			disabledElement.setAttribute('data-disabled-by-htmx', '');
		});
		return disabledElts;
	}

	/**
	 * @param {Element[]} indicators
	 * @param {Element[]} disabled
	 */
	function removeRequestIndicators(indicators, disabled) {
		forEach(indicators.concat(disabled), function (ele) {
			const internalData = getInternalData(ele);
			internalData.requestCount = (internalData.requestCount || 1) - 1;
		});
		forEach(indicators, function (ic) {
			const internalData = getInternalData(ic);
			if (internalData.requestCount === 0) {
				ic.classList.remove.call(ic.classList, htmx.config.requestClass);
			}
		});
		forEach(disabled, function (disabledElement) {
			const internalData = getInternalData(disabledElement);
			if (internalData.requestCount === 0) {
				disabledElement.removeAttribute('disabled');
				disabledElement.removeAttribute('data-disabled-by-htmx');
			}
		});
	}

	// = ===================================================================
	// Input Value Processing
	// = ===================================================================

	/**
	 * @param {Element[]} processed
	 * @param {Element} elt
	 * @returns {boolean}
	 */
	function haveSeenNode(processed, elt) {
		for (let i = 0; i < processed.length; i++) {
			const node = processed[i];
			if (node.isSameNode(elt)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {Element} element
	 * @returns {boolean}
	 */
	function shouldInclude(element) {
		// Cast to trick tsc, undefined values will work fine here
		const elt = /** @type {HTMLInputElement} */ (element);
		if (elt.name === '' || elt.name == null || elt.disabled || closest(elt, 'fieldset[disabled]')) {
			return false;
		}
		// ignore "submitter" types (see jQuery src/serialize.js)
		if (elt.type === 'button' || elt.type === 'submit' || elt.tagName === 'image' || elt.tagName === 'reset' || elt.tagName === 'file') {
			return false;
		}
		if (elt.type === 'checkbox' || elt.type === 'radio') {
			return elt.checked;
		}
		return true;
	}

	/**
	 * @param {string} name
	 * @param {string|Array|FormDataEntryValue} value
	  * @param {FormData} formData */
	function addValueToFormData(name, value, formData) {
		if (name != null && value != null) {
			if (Array.isArray(value)) {
				value.forEach(function (v) { formData.append(name, v); });
			}
			else {
				formData.append(name, value);
			}
		}
	}

	/**
	 * @param {string} name
	 * @param {string|Array} value
	  * @param {FormData} formData */
	function removeValueFromFormData(name, value, formData) {
		if (name != null && value != null) {
			let values = formData.getAll(name);
			if (Array.isArray(value)) {
				values = values.filter(v => value.indexOf(v) < 0);
			}
			else {
				values = values.filter(v => v !== value);
			}
			formData.delete(name);
			forEach(values, (v) => { formData.append(name, v); });
		}
	}

	/**
	 * @param {Element[]} processed
	 * @param {FormData} formData
	 * @param {HtmxElementValidationError[]} errors
	 * @param {Element|HTMLInputElement|HTMLSelectElement|HTMLFormElement} elt
	 * @param {boolean} validate
	 */
	function processInputValue(processed, formData, errors, elt, validate) {
		if (elt == null || haveSeenNode(processed, elt)) {
			return;
		}
		else {
			processed.push(elt);
		}
		if (shouldInclude(elt)) {
			const name = getRawAttribute(elt, 'name');
			// @ts-ignore value will be undefined for non-input elements, which is fine
			let value = elt.value;
			if (elt instanceof HTMLSelectElement && elt.multiple) {
				value = toArray(elt.querySelectorAll('option:checked')).map(function (e) { return (/** @type HTMLOptionElement */(e)).value; });
			}
			// include file inputs
			if (elt instanceof HTMLInputElement && elt.files) {
				value = toArray(elt.files);
			}
			addValueToFormData(name, value, formData);
			if (validate) {
				validateElement(elt, errors);
			}
		}
		if (elt instanceof HTMLFormElement) {
			forEach(elt.elements, function (input) {
				if (processed.indexOf(input) >= 0) {
					// The input has already been processed and added to the values, but the FormData that will be
					//  constructed right after on the form, will include it once again. So remove that input's value
					//  now to avoid duplicates
					removeValueFromFormData(input.name, input.value, formData);
				}
				else {
					processed.push(input);
				}
				if (validate) {
					validateElement(input, errors);
				}
			});
			new FormData(elt).forEach(function (value, name) {
				if (value instanceof File && value.name === '') {
					return; // ignore no-name files
				}
				addValueToFormData(name, value, formData);
			});
		}
	}

	/**
	 * @param {Element} elt
	 * @param {HtmxElementValidationError[]} errors
	 */
	function validateElement(elt, errors) {
		const element = /** @type {HTMLElement & ElementInternals} */ (elt);
		if (element.willValidate) {
			triggerEvent(element, 'htmx:validation:validate');
			if (!element.checkValidity()) {
				errors.push({ elt: element, message: element.validationMessage, validity: element.validity });
				triggerEvent(element, 'htmx:validation:failed', { message: element.validationMessage, validity: element.validity });
			}
		}
	}

	/**
	 * Override values in the one FormData with those from another.
	 * @param {FormData} receiver - The formdata that will be mutated.
	 * @param {FormData} donor - The formdata that will provide the overriding values.
	 * @returns {FormData} The {@linkcode receiver}.
	 */
	function overrideFormData(receiver, donor) {
		for (const key of donor.keys()) {
			receiver.delete(key);
		}
		donor.forEach(function (value, key) {
			receiver.append(key, value);
		});
		return receiver;
	}

	/**
	 * @param {Element|HTMLFormElement} elt
	 * @param {HttpVerb} verb
	 * @returns {{errors: HtmxElementValidationError[], formData: FormData, values: object}}
	 */
	function getInputValues(elt, verb) {
		/** @type Element[] */
		const processed = [];
		const formData = new FormData();
		const priorityFormData = new FormData();
		/** @type HtmxElementValidationError[] */
		const errors = [];
		const internalData = getInternalData(elt);
		if (internalData.lastButtonClicked && !bodyContains(internalData.lastButtonClicked)) {
			internalData.lastButtonClicked = null;
		}

		// only validate when form is directly submitted and novalidate or formnovalidate are not set
		// or if the element has an explicit hx-validate="true" on it
		let validate = (elt instanceof HTMLFormElement && !elt.noValidate) || getAttributeValue(elt, 'hx-validate') === 'true';
		if (internalData.lastButtonClicked) {
			validate = validate && !internalData.lastButtonClicked.formNoValidate;
		}

		// for a non-GET include the closest form
		if (verb !== 'get') {
			processInputValue(processed, priorityFormData, errors, closest(elt, 'form'), validate);
		}

		// include the element itself
		processInputValue(processed, formData, errors, elt, validate);

		// if a button or submit was clicked last, include its value
		if (internalData.lastButtonClicked || elt.tagName === 'BUTTON'
			|| (elt.tagName === 'INPUT' && getRawAttribute(elt, 'type') === 'submit')) {
			const button = internalData.lastButtonClicked || (/** @type HTMLInputElement|HTMLButtonElement */(elt));
			const name = getRawAttribute(button, 'name');
			addValueToFormData(name, button.value, priorityFormData);
		}

		// include any explicit includes
		const includes = findAttributeTargets(elt, 'hx-include');
		forEach(includes, function (node) {
			processInputValue(processed, formData, errors, asElement(node), validate);
			// if a non-form is included, include any input values within it
			if (!matches(node, 'form')) {
				forEach(asParentNode(node).querySelectorAll(INPUT_SELECTOR), function (descendant) {
					processInputValue(processed, formData, errors, descendant, validate);
				});
			}
		});

		// values from a <form> take precedence, overriding the regular values
		overrideFormData(formData, priorityFormData);

		return { errors, formData, values: formDataProxy(formData) };
	}

	/**
	 * @param {string} returnStr
	 * @param {string} name
	 * @param {any} realValue
	 * @returns {string}
	 */
	function appendParam(returnStr, name, realValue) {
		if (returnStr !== '') {
			returnStr += '&';
		}
		if (String(realValue) === '[object Object]') {
			realValue = JSON.stringify(realValue);
		}
		const s = encodeURIComponent(realValue);
		returnStr += encodeURIComponent(name) + '=' + s;
		return returnStr;
	}

	/**
	 * @param {FormData | object} values
	 * @returns String.
	 */
	function urlEncode(values) {
		values = formDataFromObject(values);
		let returnStr = '';
		values.forEach(function (value, key) {
			returnStr = appendParam(returnStr, key, value);
		});
		return returnStr;
	}

	// = ===================================================================
	// Ajax
	// = ===================================================================

	/**
	 * @param {Element} elt
	 * @param {Element} target
	 * @param {string} prompt
	 * @returns {HtmxHeaderSpecification}
	 */
	function getHeaders(elt, target, prompt) {
		/** @type HtmxHeaderSpecification */
		const headers = {
			'HX-Current-URL': getDocument().location.href,
			'HX-Request': 'true',
			'HX-Target': getAttributeValue(target, 'id'),
			'HX-Trigger': getRawAttribute(elt, 'id'),
			'HX-Trigger-Name': getRawAttribute(elt, 'name'),
		};
		getValuesForElement(elt, 'hx-headers', false, headers);
		if (prompt !== undefined) {
			headers['HX-Prompt'] = prompt;
		}
		if (getInternalData(elt).boosted) {
			headers['HX-Boosted'] = 'true';
		}
		return headers;
	}

	/**
	 * FilterValues takes an object containing form input values
	 * and returns a new object that only contains keys that are
	 * specified by the closest "hx-params" attribute.
	 * @param {FormData} inputValues
	 * @param {Element} elt
	 * @returns {FormData}
	 */
	function filterValues(inputValues, elt) {
		const paramsValue = getClosestAttributeValue(elt, 'hx-params');
		if (paramsValue) {
			if (paramsValue === 'none') {
				return new FormData();
			}
			else if (paramsValue === '*') {
				return inputValues;
			}
			else if (paramsValue.indexOf('not ') === 0) {
				forEach(paramsValue.substr(4).split(','), function (name) {
					name = name.trim();
					inputValues.delete(name);
				});
				return inputValues;
			}
			else {
				const newValues = new FormData();
				forEach(paramsValue.split(','), function (name) {
					name = name.trim();
					if (inputValues.has(name)) {
						inputValues.getAll(name).forEach(function (value) { newValues.append(name, value); });
					}
				});
				return newValues;
			}
		}
		else {
			return inputValues;
		}
	}

	/**
	 * @param {Element} elt
	 * @returns {boolean}
	 */
	function isAnchorLink(elt) {
		return !!getRawAttribute(elt, 'href') && getRawAttribute(elt, 'href').indexOf('#') >= 0;
	}

	/**
	 * @param {Element} elt
	 * @param {HtmxSwapStyle} [swapInfoOverride]
	 * @returns {HtmxSwapSpecification}
	 */
	function getSwapSpecification(elt, swapInfoOverride) {
		const swapInfo = swapInfoOverride || getClosestAttributeValue(elt, 'hx-swap');
		/** @type HtmxSwapSpecification */
		const swapSpec = {
			settleDelay: htmx.config.defaultSettleDelay,
			swapDelay: htmx.config.defaultSwapDelay,
			swapStyle: getInternalData(elt).boosted ? 'innerHTML' : htmx.config.defaultSwapStyle,
		};
		if (htmx.config.scrollIntoViewOnBoost && getInternalData(elt).boosted && !isAnchorLink(elt)) {
			swapSpec.show = 'top';
		}
		if (swapInfo) {
			const split = splitOnWhitespace(swapInfo);
			if (split.length > 0) {
				for (let i = 0; i < split.length; i++) {
					const value = split[i];
					if (value.indexOf('swap:') === 0) {
						swapSpec.swapDelay = parseInterval(value.substr(5));
					}
					else if (value.indexOf('settle:') === 0) {
						swapSpec.settleDelay = parseInterval(value.substr(7));
					}
					else if (value.indexOf('transition:') === 0) {
						swapSpec.transition = value.substr(11) === 'true';
					}
					else if (value.indexOf('ignoreTitle:') === 0) {
						swapSpec.ignoreTitle = value.substr(12) === 'true';
					}
					else if (value.indexOf('scroll:') === 0) {
						const scrollSpec = value.substr(7);
						var splitSpec = scrollSpec.split(':');
						const scrollVal = splitSpec.pop();
						var selectorVal = splitSpec.length > 0 ? splitSpec.join(':') : null;
						// @ts-ignore
						swapSpec.scroll = scrollVal;
						swapSpec.scrollTarget = selectorVal;
					}
					else if (value.indexOf('show:') === 0) {
						const showSpec = value.substr(5);
						var splitSpec = showSpec.split(':');
						const showVal = splitSpec.pop();
						var selectorVal = splitSpec.length > 0 ? splitSpec.join(':') : null;
						swapSpec.show = showVal;
						swapSpec.showTarget = selectorVal;
					}
					else if (value.indexOf('focus-scroll:') === 0) {
						const focusScrollVal = value.substr('focus-scroll:'.length);
						swapSpec.focusScroll = focusScrollVal == 'true';
					}
					else if (i == 0) {
						swapSpec.swapStyle = value;
					}
					else {
						logError('Unknown modifier in hx-swap: ' + value);
					}
				}
			}
		}
		return swapSpec;
	}

	/**
	 * @param {Element} elt
	 * @returns {boolean}
	 */
	function usesFormData(elt) {
		return getClosestAttributeValue(elt, 'hx-encoding') === 'multipart/form-data'
			|| (matches(elt, 'form') && getRawAttribute(elt, 'enctype') === 'multipart/form-data');
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {Element} elt
	 * @param {FormData} filteredParameters
	 * @returns {*|string|null}
	 */
	function encodeParamsForBody(xhr, elt, filteredParameters) {
		let encodedParameters = null;
		withExtensions(elt, function (extension) {
			if (encodedParameters == null) {
				encodedParameters = extension.encodeParameters(xhr, filteredParameters, elt);
			}
		});
		if (encodedParameters != null) {
			return encodedParameters;
		}
		else {
			if (usesFormData(elt)) {
				// Force conversion to an actual FormData object in case filteredParameters is a formDataProxy
				// See https://github.com/bigskysoftware/htmx/issues/2317
				return overrideFormData(new FormData(), formDataFromObject(filteredParameters));
			}
			else {
				return urlEncode(filteredParameters);
			}
		}
	}

	/**
	 * @param {Element} target
	 * @returns {HtmxSettleInfo}
	 */
	function makeSettleInfo(target) {
		return { elts: [target], tasks: [] };
	}

	/**
	 * @param {Element[]} content
	 * @param {HtmxSwapSpecification} swapSpec
	 */
	function updateScrollState(content, swapSpec) {
		const first = content[0];
		const last = content[content.length - 1];
		if (swapSpec.scroll) {
			var target = null;
			if (swapSpec.scrollTarget) {
				target = asElement(querySelectorExt(first, swapSpec.scrollTarget));
			}
			if (swapSpec.scroll === 'top' && (first || target)) {
				target = target || first;
				target.scrollTop = 0;
			}
			if (swapSpec.scroll === 'bottom' && (last || target)) {
				target = target || last;
				target.scrollTop = target.scrollHeight;
			}
		}
		if (swapSpec.show) {
			var target = null;
			if (swapSpec.showTarget) {
				let targetStr = swapSpec.showTarget;
				if (swapSpec.showTarget === 'window') {
					targetStr = 'body';
				}
				target = asElement(querySelectorExt(first, targetStr));
			}
			if (swapSpec.show === 'top' && (first || target)) {
				target = target || first;
				// @ts-ignore For some reason tsc doesn't recognize "instant" as a valid option for now
				target.scrollIntoView({ behavior: htmx.config.scrollBehavior, block: 'start' });
			}
			if (swapSpec.show === 'bottom' && (last || target)) {
				target = target || last;
				// @ts-ignore For some reason tsc doesn't recognize "instant" as a valid option for now
				target.scrollIntoView({ behavior: htmx.config.scrollBehavior, block: 'end' });
			}
		}
	}

	/**
	 * @param {Element} elt
	 * @param {string} attr
	 * @param {boolean=} evalAsDefault
	 * @param {object=} values
	 * @returns {object}
	 */
	function getValuesForElement(elt, attr, evalAsDefault, values) {
		if (values == null) {
			values = {};
		}
		if (elt == null) {
			return values;
		}
		const attributeValue = getAttributeValue(elt, attr);
		if (attributeValue) {
			let str = attributeValue.trim();
			let evaluateValue = evalAsDefault;
			if (str === 'unset') {
				return null;
			}
			if (str.indexOf('javascript:') === 0) {
				str = str.substr(11);
				evaluateValue = true;
			}
			else if (str.indexOf('js:') === 0) {
				str = str.substr(3);
				evaluateValue = true;
			}
			if (str.indexOf('{') !== 0) {
				str = '{' + str + '}';
			}
			let varsValues;
			if (evaluateValue) {
				varsValues = maybeEval(elt, function () { return Function('return (' + str + ')')(); }, {});
			}
			else {
				varsValues = parseJSON(str);
			}
			for (const key in varsValues) {
				if (varsValues.hasOwnProperty(key)) {
					if (values[key] == null) {
						values[key] = varsValues[key];
					}
				}
			}
		}
		return getValuesForElement(asElement(parentElt(elt)), attr, evalAsDefault, values);
	}

	/**
	 * @param {EventTarget|string} elt
	 * @param {() => any} toEval
	 * @param {any=} defaultVal
	 * @returns {any}
	 */
	function maybeEval(elt, toEval, defaultVal) {
		if (htmx.config.allowEval) {
			return toEval();
		}
		else {
			triggerErrorEvent(elt, 'htmx:evalDisallowedError');
			return defaultVal;
		}
	}

	/**
	 * @param {Element} elt
	 * @param {*?} expressionVars
	 * @returns
	 */
	function getHXVarsForElement(elt, expressionVars) {
		return getValuesForElement(elt, 'hx-vars', true, expressionVars);
	}

	/**
	 * @param {Element} elt
	 * @param {*?} expressionVars
	 * @returns
	 */
	function getHXValsForElement(elt, expressionVars) {
		return getValuesForElement(elt, 'hx-vals', false, expressionVars);
	}

	/**
	 * @param {Element} elt
	 * @returns {FormData}
	 */
	function getExpressionVars(elt) {
		return mergeObjects(getHXVarsForElement(elt), getHXValsForElement(elt));
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {string} header
	 * @param {string|null} headerValue
	 */
	function safelySetHeaderValue(xhr, header, headerValue) {
		if (headerValue !== null) {
			try {
				xhr.setRequestHeader(header, headerValue);
			}
			catch (e) {
				// On an exception, try to set the header URI encoded instead
				xhr.setRequestHeader(header, encodeURIComponent(headerValue));
				xhr.setRequestHeader(header + '-URI-AutoEncoded', 'true');
			}
		}
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @returns {string}
	 */
	function getPathFromResponse(xhr) {
		// NB: IE11 does not support this stuff
		if (xhr.responseURL && typeof (URL) !== 'undefined') {
			try {
				const url = new URL(xhr.responseURL);
				return url.pathname + url.search;
			}
			catch (e) {
				triggerErrorEvent(getDocument().body, 'htmx:badResponseUrl', { url: xhr.responseURL });
			}
		}
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @param {RegExp} regexp
	 * @returns {boolean}
	 */
	function hasHeader(xhr, regexp) {
		return regexp.test(xhr.getAllResponseHeaders());
	}

	/**
	 * Issues an htmx-style AJAX request.
	 * @param {HttpVerb} verb
	 * @param {string} path - The URL path to make the AJAX.
	 * @param {Element|string|HtmxAjaxHelperContext} context - The element to target (defaults to the **body**) | a selector for the target | a context object that contains any of the following.
	 * @returns {Promise<void>} Promise that resolves immediately if no request is sent, or when the request is complete.
	 * @see https://htmx.org/api/#ajax
	 */
	function ajaxHelper(verb, path, context) {
		verb = (/** @type HttpVerb */(verb.toLowerCase()));
		if (context) {
			if (context instanceof Element || typeof context === 'string') {
				return issueAjaxRequest(verb, path, null, null, {
					returnPromise: true,
					targetOverride: resolveTarget(context) || DUMMY_ELT,
				});
			}
			else {
				let resolvedTarget = resolveTarget(context.target);
				// If target is supplied but can't resolve OR both target and source can't be resolved
				// then use DUMMY_ELT to abort the request with htmx:targetError to avoid it replacing body by mistake
				if ((context.target && !resolvedTarget) || (!resolvedTarget && !resolveTarget(context.source))) {
					resolvedTarget = DUMMY_ELT;
				}
				return issueAjaxRequest(verb, path, resolveTarget(context.source), context.event,
					{
						handler: context.handler,
						headers: context.headers,
						returnPromise: true,
						select: context.select,
						swapOverride: context.swap,
						targetOverride: resolvedTarget,
						values: context.values,
					});
			}
		}
		else {
			return issueAjaxRequest(verb, path, null, null, {
				returnPromise: true,
			});
		}
	}

	/**
	 * @param {Element} elt
	 * @returns {Element[]}
	 */
	function hierarchyForElt(elt) {
		const arr = [];
		while (elt) {
			arr.push(elt);
			elt = elt.parentElement;
		}
		return arr;
	}

	/**
	 * @param {Element} elt
	 * @param {string} path
	 * @param {HtmxRequestConfig} requestConfig
	 * @returns {boolean}
	 */
	function verifyPath(elt, path, requestConfig) {
		let sameHost;
		let url;
		if (typeof URL === 'function') {
			url = new URL(path, document.location.href);
			const origin = document.location.origin;
			sameHost = origin === url.origin;
		}
		else {
			// IE11 doesn't support URL
			url = path;
			sameHost = startsWith(path, document.location.origin);
		}

		if (htmx.config.selfRequestsOnly) {
			if (!sameHost) {
				return false;
			}
		}
		return triggerEvent(elt, 'htmx:validateUrl', mergeObjects({ sameHost, url }, requestConfig));
	}

	/**
	 * @param {object | FormData} obj
	 * @returns {FormData}
	 */
	function formDataFromObject(obj) {
		if (obj instanceof FormData) return obj;
		const formData = new FormData();
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] && typeof obj[key].forEach === 'function') {
					obj[key].forEach(function (v) { formData.append(key, v); });
				}
				else if (typeof obj[key] === 'object' && !(obj[key] instanceof Blob)) {
					formData.append(key, JSON.stringify(obj[key]));
				}
				else {
					formData.append(key, obj[key]);
				}
			}
		}
		return formData;
	}

	/**
	 * @param {FormData} formData
	 * @param {string} name
	 * @param {Array} array
	 * @returns {Array}
	 */
	function formDataArrayProxy(formData, name, array) {
		// mutating the array should mutate the underlying form data
		return new Proxy(array, {
			get: function (target, key) {
				if (typeof key === 'number') return target[key];
				if (key === 'length') return target.length;
				if (key === 'push') {
					return function (value) {
						target.push(value);
						formData.append(name, value);
					};
				}
				if (typeof target[key] === 'function') {
					return function () {
						target[key].apply(target, arguments);
						formData.delete(name);
						target.forEach(function (v) { formData.append(name, v); });
					};
				}

				if (target[key] && target[key].length === 1) {
					return target[key][0];
				}
				else {
					return target[key];
				}
			},
			set: function (target, index, value) {
				target[index] = value;
				formData.delete(name);
				target.forEach(function (v) { formData.append(name, v); });
				return true;
			},
		});
	}

	/**
	 * @param {FormData} formData
	 * @returns {object}
	 */
	function formDataProxy(formData) {
		return new Proxy(formData, {
			deleteProperty: function (target, name) {
				if (typeof name === 'string') {
					target.delete(name);
				}
				return true;
			},
			get: function (target, name) {
				if (typeof name === 'symbol') {
					// Forward symbol calls to the FormData itself directly
					return Reflect.get(target, name);
				}
				if (name === 'toJSON') {
					/**
					 * Support JSON.stringify call on proxy.
					 */
					return () => Object.fromEntries(formData);
				}
				if (name in target) {
					// Wrap in function with apply to correctly bind the FormData context, as a direct call would result in an illegal invocation error
					if (typeof target[name] === 'function') {
						return function () {
							return formData[name].apply(formData, arguments);
						};
					}
					else {
						return target[name];
					}
				}
				const array = formData.getAll(name);
				// Those 2 undefined & single value returns are for retro-compatibility as we weren't using FormData before
				if (array.length === 0) {
					return undefined;
				}
				else if (array.length === 1) {
					return array[0];
				}
				else {
					return formDataArrayProxy(target, name, array);
				}
			},
			getOwnPropertyDescriptor: function (target, prop) {
				return Reflect.getOwnPropertyDescriptor(Object.fromEntries(target), prop);
			},
			/**
			 * Support Object.assign call from proxy.
			 * @param target
			 */
			ownKeys: function (target) {
				return Reflect.ownKeys(Object.fromEntries(target));
			},
			set: function (target, name, value) {
				if (typeof name !== 'string') {
					return false;
				}
				target.delete(name);
				if (value && typeof value.forEach === 'function') {
					value.forEach(function (v) { target.append(name, v); });
				}
				else if (typeof value === 'object' && !(value instanceof Blob)) {
					target.append(name, JSON.stringify(value));
				}
				else {
					target.append(name, value);
				}
				return true;
			},
		});
	}

	/**
	 * @param {HttpVerb} verb
	 * @param {string} path
	 * @param {Element} elt
	 * @param {Event} event
	 * @param {HtmxAjaxEtc} [etc]
	 * @param {boolean} [confirmed]
	 * @returns {Promise<void>}
	 */
	function issueAjaxRequest(verb, path, elt, event, etc, confirmed) {
		let resolve = null;
		let reject = null;
		etc = etc != null ? etc : {};
		if (etc.returnPromise && typeof Promise !== 'undefined') {
			var promise = new Promise(function (_resolve, _reject) {
				resolve = _resolve;
				reject = _reject;
			});
		}
		if (elt == null) {
			elt = getDocument().body;
		}
		const responseHandler = etc.handler || handleAjaxResponse;
		const select = etc.select || null;

		if (!bodyContains(elt)) {
			// do not issue requests for elements removed from the DOM
			maybeCall(resolve);
			return promise;
		}
		const target = etc.targetOverride || asElement(getTarget(elt));
		if (target == null || target == DUMMY_ELT) {
			triggerErrorEvent(elt, 'htmx:targetError', { target: getAttributeValue(elt, 'hx-target') });
			maybeCall(reject);
			return promise;
		}

		let eltData = getInternalData(elt);
		const submitter = eltData.lastButtonClicked;

		if (submitter) {
			const buttonPath = getRawAttribute(submitter, 'formaction');
			if (buttonPath != null) {
				path = buttonPath;
			}

			const buttonVerb = getRawAttribute(submitter, 'formmethod');
			if (buttonVerb != null) {
				// ignore buttons with formmethod="dialog"
				if (buttonVerb.toLowerCase() !== 'dialog') {
					verb = (/** @type HttpVerb */(buttonVerb));
				}
			}
		}

		const confirmQuestion = getClosestAttributeValue(elt, 'hx-confirm');
		// allow event-based confirmation w/ a callback
		if (confirmed === undefined) {
			const issueRequest = function (skipConfirmation) {
				return issueAjaxRequest(verb, path, elt, event, etc, !!skipConfirmation);
			};
			const confirmDetails = { elt, etc, issueRequest, path, question: confirmQuestion, target, triggeringEvent: event, verb };
			if (!triggerEvent(elt, 'htmx:confirm', confirmDetails)) {
				maybeCall(resolve);
				return promise;
			}
		}

		let syncElt = elt;
		let syncStrategy = getClosestAttributeValue(elt, 'hx-sync');
		let queueStrategy = null;
		let abortable = false;
		if (syncStrategy) {
			const syncStrings = syncStrategy.split(':');
			const selector = syncStrings[0].trim();
			if (selector === 'this') {
				syncElt = findThisElement(elt, 'hx-sync');
			}
			else {
				syncElt = asElement(querySelectorExt(elt, selector));
			}
			// default to the drop strategy
			syncStrategy = (syncStrings[1] || 'drop').trim();
			eltData = getInternalData(syncElt);
			if (syncStrategy === 'drop' && eltData.xhr && eltData.abortable !== true) {
				maybeCall(resolve);
				return promise;
			}
			else if (syncStrategy === 'abort') {
				if (eltData.xhr) {
					maybeCall(resolve);
					return promise;
				}
				else {
					abortable = true;
				}
			}
			else if (syncStrategy === 'replace') {
				triggerEvent(syncElt, 'htmx:abort'); // abort the current request and continue
			}
			else if (syncStrategy.indexOf('queue') === 0) {
				const queueStrArray = syncStrategy.split(' ');
				queueStrategy = (queueStrArray[1] || 'last').trim();
			}
		}

		if (eltData.xhr) {
			if (eltData.abortable) {
				triggerEvent(syncElt, 'htmx:abort'); // abort the current request and continue
			}
			else {
				if (queueStrategy == null) {
					if (event) {
						const eventData = getInternalData(event);
						if (eventData && eventData.triggerSpec && eventData.triggerSpec.queue) {
							queueStrategy = eventData.triggerSpec.queue;
						}
					}
					if (queueStrategy == null) {
						queueStrategy = 'last';
					}
				}
				if (eltData.queuedRequests == null) {
					eltData.queuedRequests = [];
				}
				if (queueStrategy === 'first' && eltData.queuedRequests.length === 0) {
					eltData.queuedRequests.push(function () {
						issueAjaxRequest(verb, path, elt, event, etc);
					});
				}
				else if (queueStrategy === 'all') {
					eltData.queuedRequests.push(function () {
						issueAjaxRequest(verb, path, elt, event, etc);
					});
				}
				else if (queueStrategy === 'last') {
					eltData.queuedRequests = []; // dump existing queue
					eltData.queuedRequests.push(function () {
						issueAjaxRequest(verb, path, elt, event, etc);
					});
				}
				maybeCall(resolve);
				return promise;
			}
		}

		const xhr = new XMLHttpRequest();
		eltData.xhr = xhr;
		eltData.abortable = abortable;
		const endRequestLock = function () {
			eltData.xhr = null;
			eltData.abortable = false;
			if (eltData.queuedRequests != null
				&& eltData.queuedRequests.length > 0) {
				const queuedRequest = eltData.queuedRequests.shift();
				queuedRequest();
			}
		};
		const promptQuestion = getClosestAttributeValue(elt, 'hx-prompt');
		if (promptQuestion) {
			var promptResponse = prompt(promptQuestion);
			// prompt returns null if cancelled and empty string if accepted with no entry
			if (promptResponse === null
				|| !triggerEvent(elt, 'htmx:prompt', { prompt: promptResponse, target })) {
				maybeCall(resolve);
				endRequestLock();
				return promise;
			}
		}

		if (confirmQuestion && !confirmed) {
			if (!confirm(confirmQuestion)) {
				maybeCall(resolve);
				endRequestLock();
				return promise;
			}
		}

		let headers = getHeaders(elt, target, promptResponse);

		if (verb !== 'get' && !usesFormData(elt)) {
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		if (etc.headers) {
			headers = mergeObjects(headers, etc.headers);
		}
		const results = getInputValues(elt, verb);
		let errors = results.errors;
		const rawFormData = results.formData;
		if (etc.values) {
			overrideFormData(rawFormData, formDataFromObject(etc.values));
		}
		const expressionVars = formDataFromObject(getExpressionVars(elt));
		const allFormData = overrideFormData(rawFormData, expressionVars);
		let filteredFormData = filterValues(allFormData, elt);

		if (htmx.config.getCacheBusterParam && verb === 'get') {
			filteredFormData.set('org.htmx.cache-buster', getRawAttribute(target, 'id') || 'true');
		}

		// behavior of anchors w/ empty href is to use the current URL
		if (path == null || path === '') {
			path = getDocument().location.href;
		}

		/**
		 * @type {object}
		 * @property {boolean} [credentials]
		 * @property {number} [timeout]
		 * @property {boolean} [noHeaders]
		 */
		const requestAttrValues = getValuesForElement(elt, 'hx-request');

		const eltIsBoosted = getInternalData(elt).boosted;

		let useUrlParams = htmx.config.methodsThatUseUrlParams.indexOf(verb) >= 0;

		/** @type HtmxRequestConfig */
		const requestConfig = {
			boosted: eltIsBoosted,
			errors,
			formData: filteredFormData,
			headers,
			parameters: formDataProxy(filteredFormData),
			path,
			target,
			timeout: etc.timeout || requestAttrValues.timeout || htmx.config.timeout,
			triggeringEvent: event,
			unfilteredFormData: allFormData,
			unfilteredParameters: formDataProxy(allFormData),
			useUrlParams,
			verb,
			withCredentials: etc.credentials || requestAttrValues.credentials || htmx.config.withCredentials,
		};

		if (!triggerEvent(elt, 'htmx:configRequest', requestConfig)) {
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}

		// copy out in case the object was overwritten
		path = requestConfig.path;
		verb = requestConfig.verb;
		headers = requestConfig.headers;
		filteredFormData = formDataFromObject(requestConfig.parameters);
		errors = requestConfig.errors;
		useUrlParams = requestConfig.useUrlParams;

		if (errors && errors.length > 0) {
			triggerEvent(elt, 'htmx:validation:halted', requestConfig);
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}

		const splitPath = path.split('#');
		const pathNoAnchor = splitPath[0];
		const anchor = splitPath[1];

		let finalPath = path;
		if (useUrlParams) {
			finalPath = pathNoAnchor;
			const hasValues = !filteredFormData.keys().next().done;
			if (hasValues) {
				if (finalPath.indexOf('?') < 0) {
					finalPath += '?';
				}
				else {
					finalPath += '&';
				}
				finalPath += urlEncode(filteredFormData);
				if (anchor) {
					finalPath += '#' + anchor;
				}
			}
		}

		if (!verifyPath(elt, finalPath, requestConfig)) {
			triggerErrorEvent(elt, 'htmx:invalidPath', requestConfig);
			maybeCall(reject);
			return promise;
		}

		xhr.open(verb.toUpperCase(), finalPath, true);
		xhr.overrideMimeType('text/html');
		xhr.withCredentials = requestConfig.withCredentials;
		xhr.timeout = requestConfig.timeout;

		// request headers
		if (requestAttrValues.noHeaders) {
			// ignore all headers
		}
		else {
			for (const header in headers) {
				if (headers.hasOwnProperty(header)) {
					const headerValue = headers[header];
					safelySetHeaderValue(xhr, header, headerValue);
				}
			}
		}

		/** @type {HtmxResponseInfo} */
		const responseInfo = {
			boosted: eltIsBoosted,
			etc,
			pathInfo: {
				anchor,
				finalRequestPath: finalPath,
				requestPath: path,
				responsePath: null,
			},
			requestConfig,
			select,
			target,
			xhr,
		};

		xhr.onload = function () {
			try {
				const hierarchy = hierarchyForElt(elt);
				responseInfo.pathInfo.responsePath = getPathFromResponse(xhr);
				responseHandler(elt, responseInfo);
				if (responseInfo.keepIndicators !== true) {
					removeRequestIndicators(indicators, disableElts);
				}
				triggerEvent(elt, 'htmx:afterRequest', responseInfo);
				triggerEvent(elt, 'htmx:afterOnLoad', responseInfo);
				// if the body no longer contains the element, trigger the event on the closest parent
				// remaining in the DOM
				if (!bodyContains(elt)) {
					let secondaryTriggerElt = null;
					while (hierarchy.length > 0 && secondaryTriggerElt == null) {
						const parentEltInHierarchy = hierarchy.shift();
						if (bodyContains(parentEltInHierarchy)) {
							secondaryTriggerElt = parentEltInHierarchy;
						}
					}
					if (secondaryTriggerElt) {
						triggerEvent(secondaryTriggerElt, 'htmx:afterRequest', responseInfo);
						triggerEvent(secondaryTriggerElt, 'htmx:afterOnLoad', responseInfo);
					}
				}
				maybeCall(resolve);
				endRequestLock();
			}
			catch (e) {
				triggerErrorEvent(elt, 'htmx:onLoadError', mergeObjects({ error: e }, responseInfo));
				throw e;
			}
		};
		xhr.onerror = function () {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
			triggerErrorEvent(elt, 'htmx:sendError', responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		xhr.onabort = function () {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
			triggerErrorEvent(elt, 'htmx:sendAbort', responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		xhr.ontimeout = function () {
			removeRequestIndicators(indicators, disableElts);
			triggerErrorEvent(elt, 'htmx:afterRequest', responseInfo);
			triggerErrorEvent(elt, 'htmx:timeout', responseInfo);
			maybeCall(reject);
			endRequestLock();
		};
		if (!triggerEvent(elt, 'htmx:beforeRequest', responseInfo)) {
			maybeCall(resolve);
			endRequestLock();
			return promise;
		}
		var indicators = addRequestIndicatorClasses(elt);
		var disableElts = disableElements(elt);

		forEach(['loadstart', 'loadend', 'progress', 'abort'], function (eventName) {
			forEach([xhr, xhr.upload], function (target) {
				target.addEventListener(eventName, function (event) {
					triggerEvent(elt, 'htmx:xhr:' + eventName, {
						lengthComputable: event.lengthComputable,
						loaded: event.loaded,
						total: event.total,
					});
				});
			});
		});
		triggerEvent(elt, 'htmx:beforeSend', responseInfo);
		const params = useUrlParams ? null : encodeParamsForBody(xhr, elt, filteredFormData);
		xhr.send(params);
		return promise;
	}

	/**
	 * @typedef {object} HtmxHistoryUpdate
	 * @property {string|null} [type]
	 * @property {string|null} [path]
	 */

	/**
	 * @param {Element} elt
	 * @param {HtmxResponseInfo} responseInfo
	 * @returns {HtmxHistoryUpdate}
	 */
	function determineHistoryUpdates(elt, responseInfo) {
		const xhr = responseInfo.xhr;

		// = ==========================================
		// First consult response headers
		// = ==========================================
		let pathFromHeaders = null;
		let typeFromHeaders = null;
		if (hasHeader(xhr, /hx-push:/i)) {
			pathFromHeaders = xhr.getResponseHeader('HX-Push');
			typeFromHeaders = 'push';
		}
		else if (hasHeader(xhr, /hx-push-url:/i)) {
			pathFromHeaders = xhr.getResponseHeader('HX-Push-Url');
			typeFromHeaders = 'push';
		}
		else if (hasHeader(xhr, /hx-replace-url:/i)) {
			pathFromHeaders = xhr.getResponseHeader('HX-Replace-Url');
			typeFromHeaders = 'replace';
		}

		// if there was a response header, that has priority
		if (pathFromHeaders) {
			if (pathFromHeaders === 'false') {
				return {};
			}
			else {
				return {
					path: pathFromHeaders,
					type: typeFromHeaders,
				};
			}
		}

		// = ==========================================
		// Next resolve via DOM values
		// = ==========================================
		const requestPath = responseInfo.pathInfo.finalRequestPath;
		const responsePath = responseInfo.pathInfo.responsePath;

		const pushUrl = getClosestAttributeValue(elt, 'hx-push-url');
		const replaceUrl = getClosestAttributeValue(elt, 'hx-replace-url');
		const elementIsBoosted = getInternalData(elt).boosted;

		let saveType = null;
		let path = null;

		if (pushUrl) {
			saveType = 'push';
			path = pushUrl;
		}
		else if (replaceUrl) {
			saveType = 'replace';
			path = replaceUrl;
		}
		else if (elementIsBoosted) {
			saveType = 'push';
			path = responsePath || requestPath; // if there is no response path, go with the original request path
		}

		if (path) {
			// false indicates no push, return empty object
			if (path === 'false') {
				return {};
			}

			// true indicates we want to follow wherever the server ended up sending us
			if (path === 'true') {
				path = responsePath || requestPath; // if there is no response path, go with the original request path
			}

			// restore any anchor associated with the request
			if (responseInfo.pathInfo.anchor && path.indexOf('#') === -1) {
				path = path + '#' + responseInfo.pathInfo.anchor;
			}

			return {
				path,
				type: saveType,
			};
		}
		else {
			return {};
		}
	}

	/**
	 * @param {HtmxResponseHandlingConfig} responseHandlingConfig
	 * @param {number} status
	 * @returns {boolean}
	 */
	function codeMatches(responseHandlingConfig, status) {
		var regExp = new RegExp(responseHandlingConfig.code);
		return regExp.test(status.toString(10));
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @returns {HtmxResponseHandlingConfig}
	 */
	function resolveResponseHandling(xhr) {
		for (var i = 0; i < htmx.config.responseHandling.length; i++) {
			/** @type HtmxResponseHandlingConfig */
			var responseHandlingElement = htmx.config.responseHandling[i];
			if (codeMatches(responseHandlingElement, xhr.status)) {
				return responseHandlingElement;
			}
		}
		// no matches, return no swap
		return {
			swap: false,
		};
	}

	/**
	 * @param {string} title
	 */
	function handleTitle(title) {
		if (title) {
			const titleElt = find('title');
			if (titleElt) {
				titleElt.innerHTML = title;
			}
			else {
				window.document.title = title;
			}
		}
	}

	/**
	 * @param {Element} elt
	 * @param {HtmxResponseInfo} responseInfo
	 */
	function handleAjaxResponse(elt, responseInfo) {
		const xhr = responseInfo.xhr;
		let target = responseInfo.target;
		const etc = responseInfo.etc;
		const responseInfoSelect = responseInfo.select;

		if (!triggerEvent(elt, 'htmx:beforeOnLoad', responseInfo)) return;

		if (hasHeader(xhr, /hx-trigger:/i)) {
			handleTriggerHeader(xhr, 'HX-Trigger', elt);
		}

		if (hasHeader(xhr, /hx-location:/i)) {
			saveCurrentPageToHistory();
			let redirectPath = xhr.getResponseHeader('HX-Location');
			/** @type {HtmxAjaxHelperContext&{path:string}} */
			var redirectSwapSpec;
			if (redirectPath.indexOf('{') === 0) {
				redirectSwapSpec = parseJSON(redirectPath);
				// what's the best way to throw an error if the user didn't include this
				redirectPath = redirectSwapSpec.path;
				delete redirectSwapSpec.path;
			}
			ajaxHelper('get', redirectPath, redirectSwapSpec).then(function () {
				pushUrlIntoHistory(redirectPath);
			});
			return;
		}

		const shouldRefresh = hasHeader(xhr, /hx-refresh:/i) && xhr.getResponseHeader('HX-Refresh') === 'true';

		if (hasHeader(xhr, /hx-redirect:/i)) {
			responseInfo.keepIndicators = true;
			location.href = xhr.getResponseHeader('HX-Redirect');
			shouldRefresh && location.reload();
			return;
		}

		if (shouldRefresh) {
			responseInfo.keepIndicators = true;
			location.reload();
			return;
		}

		if (hasHeader(xhr, /hx-retarget:/i)) {
			if (xhr.getResponseHeader('HX-Retarget') === 'this') {
				responseInfo.target = elt;
			}
			else {
				responseInfo.target = asElement(querySelectorExt(elt, xhr.getResponseHeader('HX-Retarget')));
			}
		}

		const historyUpdate = determineHistoryUpdates(elt, responseInfo);

		const responseHandling = resolveResponseHandling(xhr);
		const shouldSwap = responseHandling.swap;
		let isError = !!responseHandling.error;
		let ignoreTitle = htmx.config.ignoreTitle || responseHandling.ignoreTitle;
		let selectOverride = responseHandling.select;
		if (responseHandling.target) {
			responseInfo.target = asElement(querySelectorExt(elt, responseHandling.target));
		}
		var swapOverride = etc.swapOverride;
		if (swapOverride == null && responseHandling.swapOverride) {
			swapOverride = responseHandling.swapOverride;
		}

		// response headers override response handling config
		if (hasHeader(xhr, /hx-retarget:/i)) {
			if (xhr.getResponseHeader('HX-Retarget') === 'this') {
				responseInfo.target = elt;
			}
			else {
				responseInfo.target = asElement(querySelectorExt(elt, xhr.getResponseHeader('HX-Retarget')));
			}
		}
		if (hasHeader(xhr, /hx-reswap:/i)) {
			swapOverride = xhr.getResponseHeader('HX-Reswap');
		}

		var serverResponse = xhr.response;
		/** @type HtmxBeforeSwapDetails */
		var beforeSwapDetails = mergeObjects({
			ignoreTitle,
			isError,
			selectOverride,
			serverResponse,
			shouldSwap,
			swapOverride,
		}, responseInfo);

		if (responseHandling.event && !triggerEvent(target, responseHandling.event, beforeSwapDetails)) return;

		if (!triggerEvent(target, 'htmx:beforeSwap', beforeSwapDetails)) return;

		target = beforeSwapDetails.target; // allow re-targeting
		serverResponse = beforeSwapDetails.serverResponse; // allow updating content
		isError = beforeSwapDetails.isError; // allow updating error
		ignoreTitle = beforeSwapDetails.ignoreTitle; // allow updating ignoring title
		selectOverride = beforeSwapDetails.selectOverride; // allow updating select override
		swapOverride = beforeSwapDetails.swapOverride; // allow updating swap override

		responseInfo.target = target; // Make updated target available to response events
		responseInfo.failed = isError; // Make failed property available to response events
		responseInfo.successful = !isError; // Make successful property available to response events

		if (beforeSwapDetails.shouldSwap) {
			if (xhr.status === 286) {
				cancelPolling(elt);
			}

			withExtensions(elt, function (extension) {
				serverResponse = extension.transformResponse(serverResponse, xhr, elt);
			});

			// Save current page if there will be a history update
			if (historyUpdate.type) {
				saveCurrentPageToHistory();
			}

			var swapSpec = getSwapSpecification(elt, swapOverride);

			if (!swapSpec.hasOwnProperty('ignoreTitle')) {
				swapSpec.ignoreTitle = ignoreTitle;
			}

			target.classList.add(htmx.config.swappingClass);

			// optional transition API promise callbacks
			let settleResolve = null;
			let settleReject = null;

			if (responseInfoSelect) {
				selectOverride = responseInfoSelect;
			}

			if (hasHeader(xhr, /hx-reselect:/i)) {
				selectOverride = xhr.getResponseHeader('HX-Reselect');
			}

			const selectOOB = getClosestAttributeValue(elt, 'hx-select-oob');
			const select = getClosestAttributeValue(elt, 'hx-select');

			let doSwap = function () {
				try {
					// if we need to save history, do so, before swapping so that relative resources have the correct base URL
					if (historyUpdate.type) {
						triggerEvent(getDocument().body, 'htmx:beforeHistoryUpdate', mergeObjects({ history: historyUpdate }, responseInfo));
						if (historyUpdate.type === 'push') {
							pushUrlIntoHistory(historyUpdate.path);
							triggerEvent(getDocument().body, 'htmx:pushedIntoHistory', { path: historyUpdate.path });
						}
						else {
							replaceUrlInHistory(historyUpdate.path);
							triggerEvent(getDocument().body, 'htmx:replacedInHistory', { path: historyUpdate.path });
						}
					}

					swap(target, serverResponse, swapSpec, {
						afterSettleCallback: function () {
							if (hasHeader(xhr, /hx-trigger-after-settle:/i)) {
								let finalElt = elt;
								if (!bodyContains(elt)) {
									finalElt = getDocument().body;
								}
								handleTriggerHeader(xhr, 'HX-Trigger-After-Settle', finalElt);
							}
							maybeCall(settleResolve);
						},
						afterSwapCallback: function () {
							if (hasHeader(xhr, /hx-trigger-after-swap:/i)) {
								let finalElt = elt;
								if (!bodyContains(elt)) {
									finalElt = getDocument().body;
								}
								handleTriggerHeader(xhr, 'HX-Trigger-After-Swap', finalElt);
							}
						},
						anchor: responseInfo.pathInfo.anchor,
						contextElement: elt,
						eventInfo: responseInfo,
						select: selectOverride || select,
						selectOOB,
					});
				}
				catch (e) {
					triggerErrorEvent(elt, 'htmx:swapError', responseInfo);
					maybeCall(settleReject);
					throw e;
				}
			};

			let shouldTransition = htmx.config.globalViewTransitions;
			if (swapSpec.hasOwnProperty('transition')) {
				shouldTransition = swapSpec.transition;
			}

			if (shouldTransition
				&& triggerEvent(elt, 'htmx:beforeTransition', responseInfo)
				&& typeof Promise !== 'undefined'
			// @ts-ignore experimental feature atm
				&& document.startViewTransition) {
				const settlePromise = new Promise(function (_resolve, _reject) {
					settleResolve = _resolve;
					settleReject = _reject;
				});
				// wrap the original doSwap() in a call to startViewTransition()
				const innerDoSwap = doSwap;
				doSwap = function () {
					// @ts-ignore experimental feature atm
					document.startViewTransition(function () {
						innerDoSwap();
						return settlePromise;
					});
				};
			}

			if (swapSpec.swapDelay > 0) {
				getWindow().setTimeout(doSwap, swapSpec.swapDelay);
			}
			else {
				doSwap();
			}
		}
		if (isError) {
			triggerErrorEvent(elt, 'htmx:responseError', mergeObjects({ error: 'Response Status Error Code ' + xhr.status + ' from ' + responseInfo.pathInfo.requestPath }, responseInfo));
		}
	}

	// = ===================================================================
	// Extensions API
	// = ===================================================================

	/** @type {Object<string, HtmxExtension>} */
	const extensions = {};

	/**
	 * ExtensionBase defines the default functions for all extensions.
	 * @returns {HtmxExtension}
	 */
	function extensionBase() {
		return {
			encodeParameters: function (xhr, parameters, elt) { return null; },
			getSelectors: function () { return null; },
			handleSwap: function (swapStyle, target, fragment, settleInfo) { return false; },
			init: function (api) { return null; },
			isInlineSwap: function (swapStyle) { return false; },
			onEvent: function (name, evt) { return true; },
			transformResponse: function (text, xhr, elt) { return text; },
		};
	}

	/**
	 * DefineExtension initializes the extension and adds it to the htmx registry.
	 * @param {string} name - The extension name.
	 * @param {HtmxExtension} extension - The extension definition.
	 * @see https://htmx.org/api/#defineExtension
	 */
	function defineExtension(name, extension) {
		if (extension.init) {
			extension.init(internalAPI);
		}
		extensions[name] = mergeObjects(extensionBase(), extension);
	}

	/**
	 * RemoveExtension removes an extension from the htmx registry.
	 * @param {string} name
	 * @see https://htmx.org/api/#removeExtension
	 */
	function removeExtension(name) {
		delete extensions[name];
	}

	/**
	 * GetExtensions searches up the DOM tree to return all extensions that can be applied to a given element.
	 * @param {Element} elt
	 * @param {HtmxExtension[]=} extensionsToReturn
	 * @param {string[]=} extensionsToIgnore
	 * @returns {HtmxExtension[]}
	 */
	function getExtensions(elt, extensionsToReturn, extensionsToIgnore) {
		if (extensionsToReturn == undefined) {
			extensionsToReturn = [];
		}
		if (elt == undefined) {
			return extensionsToReturn;
		}
		if (extensionsToIgnore == undefined) {
			extensionsToIgnore = [];
		}
		const extensionsForElement = getAttributeValue(elt, 'hx-ext');
		if (extensionsForElement) {
			forEach(extensionsForElement.split(','), function (extensionName) {
				extensionName = extensionName.replace(/ /g, '');
				if (extensionName.slice(0, 7) == 'ignore:') {
					extensionsToIgnore.push(extensionName.slice(7));
					return;
				}
				if (extensionsToIgnore.indexOf(extensionName) < 0) {
					const extension = extensions[extensionName];
					if (extension && extensionsToReturn.indexOf(extension) < 0) {
						extensionsToReturn.push(extension);
					}
				}
			});
		}
		return getExtensions(asElement(parentElt(elt)), extensionsToReturn, extensionsToIgnore);
	}

	// = ===================================================================
	// Initialization
	// = ===================================================================
	var isReady = false;
	getDocument().addEventListener('DOMContentLoaded', function () {
		isReady = true;
	});

	/**
	 * Execute a function now if DOMContentLoaded has fired, otherwise listen for it.
	 *
	 * This function uses isReady because there is no reliable way to ask the browser whether
	 * the DOMContentLoaded event has already been fired; there's a gap between DOMContentLoaded
	 * firing and readystate=complete.
	 * @param fn
	 */
	function ready(fn) {
		// Checking readyState here is a failsafe in case the htmx script tag entered the DOM by
		// some means other than the initial page load.
		if (isReady || getDocument().readyState === 'complete') {
			fn();
		}
		else {
			getDocument().addEventListener('DOMContentLoaded', fn);
		}
	}

	/**
	 *
	 */
	function insertIndicatorStyles() {
		if (htmx.config.includeIndicatorStyles) {
			const nonceAttribute = htmx.config.inlineStyleNonce ? ` nonce="${htmx.config.inlineStyleNonce}"` : '';
			getDocument().head.insertAdjacentHTML('beforeend',
				'<style' + nonceAttribute + '>\
				.' + htmx.config.indicatorClass + '{opacity:0}\
				.' + htmx.config.requestClass + ' .' + htmx.config.indicatorClass + '{opacity:1; transition: opacity 200ms ease-in;}\
				.' + htmx.config.requestClass + '.' + htmx.config.indicatorClass + '{opacity:1; transition: opacity 200ms ease-in;}\
      </style>');
		}
	}

	/**
	 *
	 */
	function getMetaConfig() {
		/** @type HTMLMetaElement */
		const element = getDocument().querySelector('meta[name="htmx-config"]');
		if (element) {
			return parseJSON(element.content);
		}
		else {
			return null;
		}
	}

	/**
	 *
	 */
	function mergeMetaConfig() {
		const metaConfig = getMetaConfig();
		if (metaConfig) {
			htmx.config = mergeObjects(htmx.config, metaConfig);
		}
	}

	// initialize the document
	ready(function () {
		mergeMetaConfig();
		insertIndicatorStyles();
		let body = getDocument().body;
		processNode(body);
		const restoredElts = getDocument().querySelectorAll(
			'[hx-trigger=\'restored\'],[data-hx-trigger=\'restored\']',
		);
		body.addEventListener('htmx:abort', function (evt) {
			const target = evt.target;
			const internalData = getInternalData(target);
			if (internalData && internalData.xhr) {
				internalData.xhr.abort();
			}
		});
		/** @type {(ev: PopStateEvent) => any} */
		const originalPopstate = window.onpopstate ? window.onpopstate.bind(window) : null;
		/** @type {(ev: PopStateEvent) => any} */
		window.onpopstate = function (event) {
			if (event.state && event.state.htmx) {
				restoreHistory();
				forEach(restoredElts, function (elt) {
					triggerEvent(elt, 'htmx:restored', {
						document: getDocument(),
						triggerEvent,
					});
				});
			}
			else {
				if (originalPopstate) {
					originalPopstate(event);
				}
			}
		};
		getWindow().setTimeout(function () {
			triggerEvent(body, 'htmx:load', {}); // give ready handlers a chance to load up before firing this event
			body = null; // kill reference for gc
		}, 0);
	});

	return htmx;
})();

/** @typedef {'get'|'head'|'post'|'put'|'delete'|'connect'|'options'|'trace'|'patch'} HttpVerb */

/**
 * @typedef {object} SwapOptions
 * @property {string} [select]
 * @property {string} [selectOOB]
 * @property {*} [eventInfo]
 * @property {string} [anchor]
 * @property {Element} [contextElement]
 * @property {swapCallback} [afterSwapCallback]
 * @property {swapCallback} [afterSettleCallback]
 */

/**
 * @callback swapCallback
 */

/**
 * @typedef {'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend' | 'delete' | 'none' | string} HtmxSwapStyle
 */

/**
 * @typedef HtmxSwapSpecification
 * @property {HtmxSwapStyle} swapStyle
 * @property {number} swapDelay
 * @property {number} settleDelay
 * @property {boolean} [transition]
 * @property {boolean} [ignoreTitle]
 * @property {string} [head]
 * @property {'top' | 'bottom'} [scroll]
 * @property {string} [scrollTarget]
 * @property {string} [show]
 * @property {string} [showTarget]
 * @property {boolean} [focusScroll]
 */

/**
 * @typedef {((this:Node, evt:Event) => boolean) & {source: string}} ConditionalFunction
 */

/**
 * @typedef {object} HtmxTriggerSpecification
 * @property {string} trigger
 * @property {number} [pollInterval]
 * @property {ConditionalFunction} [eventFilter]
 * @property {boolean} [changed]
 * @property {boolean} [once]
 * @property {boolean} [consume]
 * @property {number} [delay]
 * @property {string} [from]
 * @property {string} [target]
 * @property {number} [throttle]
 * @property {string} [queue]
 * @property {string} [root]
 * @property {string} [threshold]
 */

/**
 * @typedef {{elt: Element, message: string, validity: ValidityState}} HtmxElementValidationError
 */

/**
 * @typedef {Record<string, string>} HtmxHeaderSpecification
 * @property {'true'} HX-Request
 * @property {string|null} HX-Trigger
 * @property {string|null} HX-Trigger-Name
 * @property {string|null} HX-Target
 * @property {string} HX-Current-URL
 * @property {string} [HX-Prompt]
 * @property {'true'} [HX-Boosted]
 * @property {string} [Content-Type]
 * @property {'true'} [HX-History-Restore-Request]
 */

/**
 * @typedef HtmxAjaxHelperContext
 * @property {Element|string} [source]
 * @property {Event} [event]
 * @property {HtmxAjaxHandler} [handler]
 * @property {Element|string} [target]
 * @property {HtmxSwapStyle} [swap]
 * @property {object | FormData} [values]
 * @property {Record<string,string>} [headers]
 * @property {string} [select]
 */

/**
 * @typedef {object} HtmxRequestConfig
 * @property {boolean} boosted
 * @property {boolean} useUrlParams
 * @property {FormData} formData
 * @property {object} parameters FormData proxy.
 * @property {FormData} unfilteredFormData
 * @property {object} unfilteredParameters UnfilteredFormData proxy.
 * @property {HtmxHeaderSpecification} headers
 * @property {Element} target
 * @property {HttpVerb} verb
 * @property {HtmxElementValidationError[]} errors
 * @property {boolean} withCredentials
 * @property {number} timeout
 * @property {string} path
 * @property {Event} triggeringEvent
 */

/**
 * @typedef {object} HtmxResponseInfo
 * @property {XMLHttpRequest} xhr
 * @property {Element} target
 * @property {HtmxRequestConfig} requestConfig
 * @property {HtmxAjaxEtc} etc
 * @property {boolean} boosted
 * @property {string} select
 * @property {{requestPath: string, finalRequestPath: string, responsePath: string|null, anchor: string}} pathInfo
 * @property {boolean} [failed]
 * @property {boolean} [successful]
 * @property {boolean} [keepIndicators]
 */

/**
 * @typedef {object} HtmxAjaxEtc
 * @property {boolean} [returnPromise]
 * @property {HtmxAjaxHandler} [handler]
 * @property {string} [select]
 * @property {Element} [targetOverride]
 * @property {HtmxSwapStyle} [swapOverride]
 * @property {Record<string,string>} [headers]
 * @property {object | FormData} [values]
 * @property {boolean} [credentials]
 * @property {number} [timeout]
 */

/**
 * @typedef {object} HtmxResponseHandlingConfig
 * @property {string} [code]
 * @property {boolean} swap
 * @property {boolean} [error]
 * @property {boolean} [ignoreTitle]
 * @property {string} [select]
 * @property {string} [target]
 * @property {string} [swapOverride]
 * @property {string} [event]
 */

/**
 * @typedef {HtmxResponseInfo & {shouldSwap: boolean, serverResponse: any, isError: boolean, ignoreTitle: boolean, selectOverride:string, swapOverride:string}} HtmxBeforeSwapDetails
 */

/**
 * @callback HtmxAjaxHandler
 * @param {Element} elt
 * @param {HtmxResponseInfo} responseInfo
 */

/**
 * @typedef {(() => void)} HtmxSettleTask
 */

/**
 * @typedef {object} HtmxSettleInfo
 * @property {HtmxSettleTask[]} tasks
 * @property {Element[]} elts
 * @property {string} [title]
 */

/**
 * @typedef {object} HtmxExtension
 * @property {(api: any) => void} init
 * @property {(name: string, event: Event|CustomEvent) => boolean} onEvent
 * @property {(text: string, xhr: XMLHttpRequest, elt: Element) => string} transformResponse
 * @property {(swapStyle: HtmxSwapStyle) => boolean} isInlineSwap
 * @property {(swapStyle: HtmxSwapStyle, target: Node, fragment: Node, settleInfo: HtmxSettleInfo) => boolean|Node[]} handleSwap
 * @property {(xhr: XMLHttpRequest, parameters: FormData, elt: Node) => *|string|null} encodeParameters
 * @property {() => string[]|null} getSelectors
 * @see https://github.com/bigskysoftware/htmx-extensions/blob/main/README.md
 */
export default htmx;
