/**
 * Cloud4all Preferences Management Tools - Sign Up UI
 *
 * Copyright 2014 CERTH/HIT
 * Copyright 2014 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 * You may obtain a copy of the License at
 * https://github.com/GPII/prefsEditors/LICENSE.txt
 */

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.loginPanel");

    fluid.defaults("gpii.loginPanel.renderer", {
        gradeNames: ["fluid.rendererComponent", "fluid.prefs.msgLookup", "autoInit"],
        listeners: {
            "onCreate.render": "gpii.loginPanel.showTemplate",
            "afterRender.clickLogin": {
                "this": "{that}.dom.loginButton",
                "method": "click",
                "args": ["{that}.clickLogin"]
            },
            "afterRender.clickCloseButton": {
                "this": "{that}.dom.closeButton",
                "method": "click",
                "args": ["{that}.clickCloseButton"]
            }
        },
        invokers: {
            clickLogin: {
                "funcName": "gpii.loginPanel.clickLogin",
                "args": ["{that}"]
            },
            clickCloseButton: {
                "funcName": "gpii.loginPanel.clickCloseButton",
                "args": ["{that}.dom.overlayPanel","{that}.dom.modalPanel"]
            }
        },
        selectors: {
            signUpLabel: ".gpiic-login-label",
            signUpDescription: ".gpiic-signup-description",
            usernameLabel: ".gpiic-signup-login-usernameLabel",
            passwordLabel: ".gpiic-signup-login-passwordLabel",
            cancelButton: ".gpiic-signup-login-cancelButton",
            loginButton: ".gpiic-signup-login-loginButton",
            recoveryBackButton: ".gpiic-signup-login-recoveryBackButton",
            username: ".gpiic-signup-login-usernameTextfield",
            passwd: ".gpiic-signup-login-passwdTextfield",
            usernameDescription: ".gpiic-signup-login-usernameDescription",
            overlayPanel: ".gpiic-login-overlay",
            modalPanel: ".gpiic-login-modal",
            loginFailed: ".gpiic-login-failed-notification"
        },
        selectorsToIgnore: ["username","passwd", "usernameDescription", "overlayPanel", "modalPanel"],
        protoTree: {
            signUpLabel: {messagekey: "signUpLabel"},
            signUpDescription: {messagekey: "signUpDescription"},
            usernameLabel: {messagekey: "usernameLabel"},
            passwordLabel: {messagekey: "passwordLabel"},
            cancelButton: {messagekey: "cancelButton"},
            loginButton: {messagekey: "loginButton"},
            loginFailed: {messagekey: "loginFailed"}
        },
        strings: {
        }
    });

    fluid.defaults("gpii.loginPanel", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        components: {
            templateLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    templates: {
                        signup: "%prefix/html/loginPanelTemplate.html"
                    },
                    events: {
                        onResourcesLoaded: "{loginPanel}.events.onLoginTemplatesLoaded"
                    }
                }
            },
            messageLoader: {
                type: "fluid.prefs.resourceLoader",
                options: {
                    templates: {
                        login: "%prefix/login.json"
                    },
                    events: {
                        onResourcesLoaded: "{loginPanel}.events.onLoginMessagesLoaded"
                    }
                }
            },
            loginRenderer: {
                type: "gpii.loginPanel.renderer",
                container: "{that}.container",
                createOnEvent: "onResourcesReady",
                options: {
                    parentBundle: "{loginPanel}.msgResolver",
                    resources: {
                        template: "{templateLoader}.resources.signup"
                    }
                }
            }
        },
        events: {
            onLoginTemplatesLoaded: null,
            onLoginMessagesLoaded: null,
            onMsgResolverReady: null,
            onResourcesReady: {
                events: {
                    templates: "onLoginTemplatesLoaded",
                    messages: "onLoginMessagesLoaded",
                    resolver: "onMsgResolverReady"
                },
                args: ["{that}"]
            }
        },
        distributeOptions: [{
            source: "{that}.options.loginPanelRenderer",
            removeSource: true,
            target: "{that > loginPanelRenderer}.options"
        }, {
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }, {
            source: "{that}.options.messageLoader",
            removeSource: true,
            target: "{that > messageLoader}.options"
        }, {
            source: "{that}.options.templatePrefix",
            target: "{that > templateLoader > resourcePath}.options.value"
        }, {
            source: "{that}.options.messagePrefix",
            target: "{that > messageLoader > resourcePath}.options.value"
        }],
        listeners: {
            "onLoginMessagesLoaded.createMsgResolver": {
                funcName: "gpii.loginPanel.createMsgResolver",
                args: ["{arguments}.0", "{that}"]
            }
        }
    });
    
    gpii.loginPanel.createMsgResolver = function (messageResources, that) {
        var completeMessage;
        fluid.each(messageResources, function (oneResource) {
            var message = JSON.parse(oneResource.resourceText);
            completeMessage = $.extend({}, completeMessage, message);
        });
        that.msgResolver = fluid.messageResolver({messageBase: completeMessage});
        that.events.onMsgResolverReady.fire();
    };
    
    gpii.loginPanel.showTemplate = function (that) {
        fluid.fetchResources(that.options.resources, function () {
            that.refreshView();
            var oPanel = that.locate("overlayPanel");
            oPanel.hide();
            var mPanel = that.locate("modalPanel");
            mPanel.hide();
        });
    };

    gpii.loginPanel.clickLogin = function (that) {
        var loginUrl = "http://localhost:8081/user/"+that.locate("username").val()+"/login";
        $.ajax({
            url: loginUrl,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType:"text",
            crossDomain: true,
            success: function(data, textStatus, jqXHR) {
                window.location.href= location.origin + "/prefsEditors/demos/prefsEditor/index.html";
            },
            error: function(response) {
                that.locate("overlayPanel").show();
                that.locate("modalPanel").show();
            }
        });
    };

    gpii.loginPanel.clickCloseButton = function (overlayPanel,modalPanel) {
        overlayPanel.hide();
        modalPanel.hide();
    };

})(jQuery, fluid);
