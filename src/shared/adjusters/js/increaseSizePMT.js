/*!
Cloud4all Preferences Management Tools

Copyright 2013 OCAD University
Copyright 2013 CERTH/HIT

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/prefsEditors/LICENSE.txt
*/

/*global fluid, jQuery, gpii*/
/*jslint white: true, onevar: true, funcinvoke: true, forvar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

(function ($, fluid) {

    fluid.defaults("gpii.panel.increaseSizePMT", {
        gradeNames: ["gpii.panel.increaseSizePCP", "gpii.panel.expandingAdjusters", "autoInit"],
        model: {
            moreLessEnabledSwitch: false
        },
        protoTree: {
            increaseSizeHeader: {messagekey: "increaseSizeHeader"},
            appearanceHeading: {messagekey: "appearance"},
            magnifierHeading:  {messagekey: "magnifier"}
        },
        selectors: {
            expandingAdjusters: ".gpiic-magnifier-hidden",
            moreLess: ".gpiic-magnifier-category"
        },
        listeners: {
            "afterRender.setExpandedAriaLabel": {
                "this": "{that}.dom.expandingAdjusters",
                "method": "attr",
                "args": ["aria-label", "{that}.stringBundle.additionalMagnifierAdjusters"]
            }
        },
        invokers: {
            // override this invoker to use the "magnifierEnabled" model value
            toggleMoreLessInstant: {
                "funcName": "gpii.panel.expandingAdjusters.showOrHideDependingOnState",
                "args": [
                    "{that}.model.gpii_primarySchema_magnifierEnabled",
                    "{that}.events.onShowMoreLess.fire",
                    "{that}.events.onHideMoreLess.fire",
                    0
                ],
                dynamic: true
            }
        }
    });
})(jQuery, fluid);