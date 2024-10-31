// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @copyright Big Sky Software 2024
 * @license 0BSD
 * @copyright Big Sky Software 2024
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
 */

/* eslint-disable */

export default htmx;
export type HttpVerb = "get" | "head" | "post" | "put" | "delete" | "connect" | "options" | "trace" | "patch";
export type SwapOptions = {
    select?: string;
    selectOOB?: string;
    eventInfo?: any;
    anchor?: string;
    contextElement?: Element;
    afterSwapCallback?: swapCallback;
    afterSettleCallback?: swapCallback;
};
export type swapCallback = () => any;
export type HtmxSwapStyle = "innerHTML" | "outerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend" | "delete" | "none" | string;
export type HtmxSwapSpecification = {
    swapStyle: HtmxSwapStyle;
    swapDelay: number;
    settleDelay: number;
    transition?: boolean;
    ignoreTitle?: boolean;
    head?: string;
    scroll?: "top" | "bottom";
    scrollTarget?: string;
    show?: string;
    showTarget?: string;
    focusScroll?: boolean;
};
export type ConditionalFunction = ((this: Node, evt: Event) => boolean) & {
    source: string;
};
export type HtmxTriggerSpecification = {
    trigger: string;
    pollInterval?: number;
    eventFilter?: ConditionalFunction;
    changed?: boolean;
    once?: boolean;
    consume?: boolean;
    delay?: number;
    from?: string;
    target?: string;
    throttle?: number;
    queue?: string;
    root?: string;
    threshold?: string;
};
export type HtmxElementValidationError = {
    elt: Element;
    message: string;
    validity: ValidityState;
};
export type HtmxHeaderSpecification = Record<string, string>;
export type HtmxAjaxHelperContext = {
    source?: Element | string;
    event?: Event;
    handler?: HtmxAjaxHandler;
    target?: Element | string;
    swap?: HtmxSwapStyle;
    values?: any | FormData;
    headers?: Record<string, string>;
    select?: string;
};
export type HtmxRequestConfig = {
    boosted: boolean;
    useUrlParams: boolean;
    formData: FormData;
    /**
     * formData proxy
     */
    parameters: any;
    unfilteredFormData: FormData;
    /**
     * unfilteredFormData proxy
     */
    unfilteredParameters: any;
    headers: HtmxHeaderSpecification;
    target: Element;
    verb: HttpVerb;
    errors: HtmxElementValidationError[];
    withCredentials: boolean;
    timeout: number;
    path: string;
    triggeringEvent: Event;
};
export type HtmxResponseInfo = {
    xhr: XMLHttpRequest;
    target: Element;
    requestConfig: HtmxRequestConfig;
    etc: HtmxAjaxEtc;
    boosted: boolean;
    select: string;
    pathInfo: {
        requestPath: string;
        finalRequestPath: string;
        responsePath: string | null;
        anchor: string;
    };
    failed?: boolean;
    successful?: boolean;
    keepIndicators?: boolean;
};
export type HtmxAjaxEtc = {
    returnPromise?: boolean;
    handler?: HtmxAjaxHandler;
    select?: string;
    targetOverride?: Element;
    swapOverride?: HtmxSwapStyle;
    headers?: Record<string, string>;
    values?: any | FormData;
    credentials?: boolean;
    timeout?: number;
};
export type HtmxResponseHandlingConfig = {
    code?: string;
    swap: boolean;
    error?: boolean;
    ignoreTitle?: boolean;
    select?: string;
    target?: string;
    swapOverride?: string;
    event?: string;
};
export type HtmxBeforeSwapDetails = HtmxResponseInfo & {
    shouldSwap: boolean;
    serverResponse: any;
    isError: boolean;
    ignoreTitle: boolean;
    selectOverride: string;
    swapOverride: string;
};
export type HtmxAjaxHandler = (elt: Element, responseInfo: HtmxResponseInfo) => any;
export type HtmxSettleTask = (() => void);
export type HtmxSettleInfo = {
    tasks: HtmxSettleTask[];
    elts: Element[];
    title?: string;
};
export type HtmxExtension = {
    init: (api: any) => void;
    onEvent: (name: string, event: Event | CustomEvent) => boolean;
    transformResponse: (text: string, xhr: XMLHttpRequest, elt: Element) => string;
    isInlineSwap: (swapStyle: HtmxSwapStyle) => boolean;
    handleSwap: (swapStyle: HtmxSwapStyle, target: Node, fragment: Node, settleInfo: HtmxSettleInfo) => boolean | Node[];
    encodeParameters: (xhr: XMLHttpRequest, parameters: FormData, elt: Node) => any | string | null;
    getSelectors: () => string[] | null;
};
declare namespace htmx {
    let onLoad: (callback: (elt: Node) => void) => EventListener;
    let process: (elt: Element | string) => void;
    let on: (arg1: EventTarget | string, arg2: string | EventListener, arg3?: EventListener | any | boolean, arg4?: any | boolean) => EventListener;
    let off: (arg1: EventTarget | string, arg2: string | EventListener, arg3?: EventListener) => EventListener;
    let trigger: (elt: EventTarget | string, eventName: string, detail?: any | undefined) => boolean;
    let ajax: (verb: HttpVerb, path: string, context: Element | string | HtmxAjaxHelperContext) => Promise<void>;
    let find: (eltOrSelector: ParentNode | string, selector?: string) => Element | null;
    let findAll: (eltOrSelector: ParentNode | string, selector?: string) => NodeListOf<Element>;
    let closest: (elt: Element | string, selector: string) => Element | null;
    function values(elt: Element, type: HttpVerb): any;
    let remove: (elt: Node, delay?: number) => void;
    let addClass: (elt: Element | string, clazz: string, delay?: number) => void;
    let removeClass: (node: Node | string, clazz: string, delay?: number) => void;
    let toggleClass: (elt: Element | string, clazz: string) => void;
    let takeClass: (elt: Node | string, clazz: string) => void;
    let swap: (target: string | Element, content: string, swapSpec: HtmxSwapSpecification, swapOptions?: SwapOptions) => void;
    let defineExtension: (name: string, extension: HtmxExtension) => void;
    let removeExtension: (name: string) => void;
    let logAll: () => void;
    let logNone: () => void;
    let logger: any;
    namespace config {
        let historyEnabled: boolean;
        let historyCacheSize: number;
        let refreshOnHistoryMiss: boolean;
        let defaultSwapStyle: HtmxSwapStyle;
        let defaultSwapDelay: number;
        let defaultSettleDelay: number;
        let includeIndicatorStyles: boolean;
        let indicatorClass: string;
        let requestClass: string;
        let addedClass: string;
        let settlingClass: string;
        let swappingClass: string;
        let allowEval: boolean;
        let allowScriptTags: boolean;
        let inlineScriptNonce: string;
        let inlineStyleNonce: string;
        let attributesToSettle: string[];
        let withCredentials: boolean;
        let timeout: number;
        let wsReconnectDelay: "full-jitter" | ((retryCount: number) => number);
        let wsBinaryType: BinaryType;
        let disableSelector: string;
        let scrollBehavior: "auto" | "instant" | "smooth";
        let defaultFocusScroll: boolean;
        let getCacheBusterParam: boolean;
        let globalViewTransitions: boolean;
        let methodsThatUseUrlParams: (HttpVerb)[];
        let selfRequestsOnly: boolean;
        let ignoreTitle: boolean;
        let scrollIntoViewOnBoost: boolean;
        let triggerSpecsCache: any | null;
        let disableInheritance: boolean;
        let responseHandling: HtmxResponseHandlingConfig[];
        let allowNestedOobSwaps: boolean;
    }
    let parseInterval: (str: string) => number | undefined;
    let _: (str: string) => any;
    let version: string;
}
