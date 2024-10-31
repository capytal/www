// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @copyright Big Sky Software 2024
 * @license 0BSD
 * @author Big Sky Software <https://github.com/bigskysoftware>
 *
 * This source code is copied from HTMX Extensions's GitHub repository, located at
 * https://github.com/bigskysoftware/htmx-extensions/blob/457da4b34ed330edd641d56ea7d85a12f2099cf9/src/head-support/head-support.js.
 * The file was modified to make the extension support ECMAScript Modules.
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

//==========================================================
// head-support.js
//
// An extension to add head tag merging.
//==========================================================
function htmxHeadSupport(htmx) {

    var api = null;

    function log() {
        //console.log(arguments);
    }

    function mergeHead(newContent, defaultMergeStrategy) {

        if (newContent && newContent.indexOf('<head') > -1) {
            const htmlDoc = document.createElement("html");
            // remove svgs to avoid conflicts
            var contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, '');
            // extract head tag
            var headTag = contentWithSvgsRemoved.match(/(<head(\s[^>]*>|>)([\s\S]*?)<\/head>)/im);

            // if the  head tag exists...
            if (headTag) {

                var added = []
                var removed = []
                var preserved = []
                var nodesToAppend = []

                htmlDoc.innerHTML = headTag;
                var newHeadTag = htmlDoc.querySelector("head");
                var currentHead = document.head;

                if (newHeadTag == null) {
                    return;
                } else {
                    // put all new head elements into a Map, by their outerHTML
                    var srcToNewHeadNodes = new Map();
                    for (const newHeadChild of newHeadTag.children) {
                        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
                    }
                }



                // determine merge strategy
                var mergeStrategy = api.getAttributeValue(newHeadTag, "hx-head") || defaultMergeStrategy;

                // get the current head
                for (const currentHeadElt of currentHead.children) {

                    // If the current head element is in the map
                    var inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
                    var isReAppended = currentHeadElt.getAttribute("hx-head") === "re-eval";
                    var isPreserved = api.getAttributeValue(currentHeadElt, "hx-preserve") === "true";
                    if (inNewContent || isPreserved) {
                        if (isReAppended) {
                            // remove the current version and let the new version replace it and re-execute
                            removed.push(currentHeadElt);
                        } else {
                            // this element already exists and should not be re-appended, so remove it from
                            // the new content map, preserving it in the DOM
                            srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
                            preserved.push(currentHeadElt);
                        }
                    } else {
                        if (mergeStrategy === "append") {
                            // we are appending and this existing element is not new content
                            // so if and only if it is marked for re-append do we do anything
                            if (isReAppended) {
                                removed.push(currentHeadElt);
                                nodesToAppend.push(currentHeadElt);
                            }
                        } else {
                            // if this is a merge, we remove this content since it is not in the new head
                            if (api.triggerEvent(document.body, "htmx:removingHeadElement", {headElement: currentHeadElt}) !== false) {
                                removed.push(currentHeadElt);
                            }
                        }
                    }
                }

                // Push the tremaining new head elements in the Map into the
                // nodes to append to the head tag
                nodesToAppend.push(...srcToNewHeadNodes.values());
                log("to append: ", nodesToAppend);

                for (const newNode of nodesToAppend) {
                    log("adding: ", newNode);
                    var newElt = document.createRange().createContextualFragment(newNode.outerHTML);
                    log(newElt);
                    if (api.triggerEvent(document.body, "htmx:addingHeadElement", {headElement: newElt}) !== false) {
                        currentHead.appendChild(newElt);
                        added.push(newElt);
                    }
                }

                // remove all removed elements, after we have appended the new elements to avoid
                // additional network requests for things like style sheets
                for (const removedElement of removed) {
                    if (api.triggerEvent(document.body, "htmx:removingHeadElement", {headElement: removedElement}) !== false) {
                        currentHead.removeChild(removedElement);
                    }
                }

                api.triggerEvent(document.body, "htmx:afterHeadMerge", {added: added, kept: preserved, removed: removed});
            }
        }
    }

    htmx.defineExtension("head-support", {
        init: function(apiRef) {
            // store a reference to the internal API.
            api = apiRef;

            htmx.on('htmx:afterSwap', function(evt){
                var serverResponse = evt.detail.xhr.response;
                if (api.triggerEvent(document.body, "htmx:beforeHeadMerge", evt.detail)) {
                    mergeHead(serverResponse, evt.detail.boosted ? "merge" : "append");
                }
            })

            htmx.on('htmx:historyRestore', function(evt){
                if (api.triggerEvent(document.body, "htmx:beforeHeadMerge", evt.detail)) {
                    if (evt.detail.cacheMiss) {
                        mergeHead(evt.detail.serverResponse, "merge");
                    } else {
                        mergeHead(evt.detail.item.head, "merge");
                    }
                }
            })

            htmx.on('htmx:historyItemCreated', function(evt){
                var historyItem = evt.detail.item;
                historyItem.head = document.head.outerHTML;
            })
        }
    });

}

export default htmxHeadSupport
