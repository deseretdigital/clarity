/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

/*
 * We've modified this code to use more of a module approach instead of
 * using a class like in the original. (Who uses classes in JS? Sheesh)
 */

"use strict";

var invariant = require('invariant');
var objectAssign = require('object-assign');
var Promise = require('bluebird');
var _ = require('underscore');

var _lastID = 1;
var _prefix = 'ID_';

/* Constructor */
var BaseDispatcher = function(){
    this.baseInit();
};

/* Methods */
BaseDispatcher.prototype = objectAssign(BaseDispatcher.prototype, {
    baseInit: function(){
        console.log("base init called");
        this._callbacks = {};
        this._promises = [];
        this._isDispatching = false;
        this._pendingPayload = null;
    },

    /**
     * Registers a callback to be invoked with every dispatched payload. Returns
     * a token that can be used with `waitFor()`.
     *
     * @param {function} callback
     * @return {string}
     */
    register: function(callback) {
        var id = _prefix + _lastID++;
        this._callbacks[id] = callback;
        return id;
    },

    /**
     * Removes a callback based on its token.
     *
     * @param {string} id
     */
    unregister: function(id) {
        invariant(
            this._callbacks[id],
            'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
            id
        );
        delete this._callbacks[id];
    },

    /**
     * Waits for the callbacks specified to be invoked before continuing execution
     * of the current callback. This method should only be used by a callback in
     * response to a dispatched payload.
     *
     * @param {array<string>} ids
     */
    waitFor: function(promiseIndexes, callback) {
        var selectedPromises = promiseIndexes.map(function(index) {
            return _promises[index];
        });
        return Promise.all(selectedPromises).then(callback);
    },

    /**
     * Dispatches a payload to all registered callbacks.
     *
     * @param {object} payload
     */
    dispatch: function(payload) {
        invariant(
            !this._isDispatching,
            'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
        );

        this._isDispatching = true;
        var self = this;
        var resolves = [];
        var rejects = [];
        this._promises = _.map(this._callbacks, function(_, i) {
            return new Promise(function(resolve, reject) {
                resolves[i] = resolve;
                rejects[i] = reject;
            });
        });

        _.each(this._callbacks, function(callback,i) {
            Promise.resolve(callback(payload)).then(function() {
                resolves[i](payload);
            }, function() {
                rejects[i](new Error('Dispatcher callback unsuccessful'));
            });
        });

        return Promise.all(this._promises).then(function(){
            self._isDispatching = false;
        });
    },

    /**
     * Is this Dispatcher currently dispatching.
     *
     * @return {boolean}
     */
    isDispatching: function() {
        return this._isDispatching;
    }
});

module.exports = BaseDispatcher;
