(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-notifications', ['exports', '@angular/core'], factory) :
    (factory((global['ngx-notifications'] = {}),global.ng.core));
}(this, (function (exports,i0) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = new Error();
                /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            else if (_enable_super_gross_mode_that_will_cause_bad_things) {
                /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function hostReportError(err) {
        setTimeout(function () { throw err; });
    }

    /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x != null && typeof x === 'object';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var errorObject = { e: {} };

    /** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
    var tryCatchTarget;
    function tryCatcher() {
        try {
            return tryCatchTarget.apply(this, arguments);
        }
        catch (e) {
            errorObject.e = e;
            return errorObject;
        }
    }
    function tryCatch(fn) {
        tryCatchTarget = fn;
        return tryCatcher;
    }

    /** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
    var UnsubscriptionError = (function (_super) {
        __extends(UnsubscriptionError, _super);
        function UnsubscriptionError(errors) {
            var _this = _super.call(this, errors ?
                errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '') || this;
            _this.errors = errors;
            _this.name = 'UnsubscriptionError';
            Object.setPrototypeOf(_this, UnsubscriptionError.prototype);
            return _this;
        }
        return UnsubscriptionError;
    }(Error));

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parent = null;
            this._parents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var hasErrors = false;
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parent = null;
            this._parents = null;
            this._subscriptions = null;
            var index = -1;
            var len = _parents ? _parents.length : 0;
            while (_parent) {
                _parent.remove(this);
                _parent = ++index < len && _parents[index] || null;
            }
            if (isFunction(_unsubscribe)) {
                var trial = tryCatch(_unsubscribe).call(this);
                if (trial === errorObject) {
                    hasErrors = true;
                    errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                        flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
                }
            }
            if (isArray(_subscriptions)) {
                index = -1;
                len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        var trial = tryCatch(sub.unsubscribe).call(sub);
                        if (trial === errorObject) {
                            hasErrors = true;
                            errors = errors || [];
                            var err = errorObject.e;
                            if (err instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
            }
            if (hasErrors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            if (!teardown || (teardown === Subscription.EMPTY)) {
                return Subscription.EMPTY;
            }
            if (teardown === this) {
                return this;
            }
            var subscription = teardown;
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (typeof subscription._addParent !== 'function') {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default:
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
            var subscriptions = this._subscriptions || (this._subscriptions = []);
            subscriptions.push(subscription);
            subscription._addParent(this);
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.prototype._addParent = function (parent) {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            if (!_parent || _parent === parent) {
                this._parent = parent;
            }
            else if (!_parents) {
                this._parents = [parent];
            }
            else if (_parents.indexOf(parent) === -1) {
                _parents.push(parent);
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
        ? /*@__PURE__*/ Symbol.for('rxSubscriber')
        : '@@rxSubscriber';

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (isTrustedSubscriber(destinationOrNext)) {
                            var trustedSubscriber = destinationOrNext[rxSubscriber]();
                            _this.syncErrorThrowable = trustedSubscriber.syncErrorThrowable;
                            _this.destination = trustedSubscriber;
                            trustedSubscriber.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            this._parent = null;
            this._parents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parent = _parent;
            this._parents = _parents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));
    function isTrustedSubscriber(obj) {
        return obj instanceof Subscriber || ('syncErrorThrowable' in obj && obj[rxSubscriber]);
    }

    /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function noop() { }

    /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
    function pipeFromArray(fns) {
        if (!fns) {
            return noop;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    /** PURE_IMPORTS_START _util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable$$1 = new Observable();
            observable$$1.source = this;
            observable$$1.operator = operator;
            return observable$$1;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                operator.call(sink, this.source);
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                sink.error(err);
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor = config.Promise || Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    /** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
    var ObjectUnsubscribedError = (function (_super) {
        __extends(ObjectUnsubscribedError, _super);
        function ObjectUnsubscribedError() {
            var _this = _super.call(this, 'object unsubscribed') || this;
            _this.name = 'ObjectUnsubscribedError';
            Object.setPrototypeOf(_this, ObjectUnsubscribedError.prototype);
            return _this;
        }
        return ObjectUnsubscribedError;
    }(Error));

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var SubjectSubscription = (function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            var _this = _super.call(this) || this;
            _this.subject = subject;
            _this.subscriber = subscriber;
            _this.closed = false;
            return _this;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
    var SubjectSubscriber = (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.observers = [];
            _this.closed = false;
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function refCount() {
        return function refCountOperatorFunction(source) {
            return source.lift(new RefCountOperator(source));
        };
    }
    var RefCountOperator = (function () {
        function RefCountOperator(connectable) {
            this.connectable = connectable;
        }
        RefCountOperator.prototype.call = function (subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source.subscribe(refCounter);
            if (!refCounter.closed) {
                refCounter.connection = connectable.connect();
            }
            return subscription;
        };
        return RefCountOperator;
    }());
    var RefCountSubscriber = (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
    var ConnectableObservable = (function (_super) {
        __extends(ConnectableObservable, _super);
        function ConnectableObservable(source, subjectFactory) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.subjectFactory = subjectFactory;
            _this._refCount = 0;
            _this._isComplete = false;
            return _this;
        }
        ConnectableObservable.prototype._subscribe = function (subscriber) {
            return this.getSubject().subscribe(subscriber);
        };
        ConnectableObservable.prototype.getSubject = function () {
            var subject = this._subject;
            if (!subject || subject.isStopped) {
                this._subject = this.subjectFactory();
            }
            return this._subject;
        };
        ConnectableObservable.prototype.connect = function () {
            var connection = this._connection;
            if (!connection) {
                this._isComplete = false;
                connection = this._connection = new Subscription();
                connection.add(this.source
                    .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
                if (connection.closed) {
                    this._connection = null;
                    connection = Subscription.EMPTY;
                }
                else {
                    this._connection = connection;
                }
            }
            return connection;
        };
        ConnectableObservable.prototype.refCount = function () {
            return refCount()(this);
        };
        return ConnectableObservable;
    }(Observable));
    var ConnectableSubscriber = (function (_super) {
        __extends(ConnectableSubscriber, _super);
        function ConnectableSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        ConnectableSubscriber.prototype._error = function (err) {
            this._unsubscribe();
            _super.prototype._error.call(this, err);
        };
        ConnectableSubscriber.prototype._complete = function () {
            this.connectable._isComplete = true;
            this._unsubscribe();
            _super.prototype._complete.call(this);
        };
        ConnectableSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (connectable) {
                this.connectable = null;
                var connection = connectable._connection;
                connectable._refCount = 0;
                connectable._subject = null;
                connectable._connection = null;
                if (connection) {
                    connection.unsubscribe();
                }
            }
        };
        return ConnectableSubscriber;
    }(SubjectSubscriber));
    var RefCountSubscriber$1 = (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount$$1 = connectable._refCount;
            if (refCount$$1 <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount$$1 - 1;
            if (refCount$$1 > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
    var GroupBySubscriber = (function (_super) {
        __extends(GroupBySubscriber, _super);
        function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
            var _this = _super.call(this, destination) || this;
            _this.keySelector = keySelector;
            _this.elementSelector = elementSelector;
            _this.durationSelector = durationSelector;
            _this.subjectSelector = subjectSelector;
            _this.groups = null;
            _this.attemptedToUnsubscribe = false;
            _this.count = 0;
            return _this;
        }
        GroupBySubscriber.prototype._next = function (value) {
            var key;
            try {
                key = this.keySelector(value);
            }
            catch (err) {
                this.error(err);
                return;
            }
            this._group(value, key);
        };
        GroupBySubscriber.prototype._group = function (value, key) {
            var groups = this.groups;
            if (!groups) {
                groups = this.groups = new Map();
            }
            var group = groups.get(key);
            var element;
            if (this.elementSelector) {
                try {
                    element = this.elementSelector(value);
                }
                catch (err) {
                    this.error(err);
                }
            }
            else {
                element = value;
            }
            if (!group) {
                group = (this.subjectSelector ? this.subjectSelector() : new Subject());
                groups.set(key, group);
                var groupedObservable = new GroupedObservable(key, group, this);
                this.destination.next(groupedObservable);
                if (this.durationSelector) {
                    var duration = void 0;
                    try {
                        duration = this.durationSelector(new GroupedObservable(key, group));
                    }
                    catch (err) {
                        this.error(err);
                        return;
                    }
                    this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
                }
            }
            if (!group.closed) {
                group.next(element);
            }
        };
        GroupBySubscriber.prototype._error = function (err) {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.error(err);
                });
                groups.clear();
            }
            this.destination.error(err);
        };
        GroupBySubscriber.prototype._complete = function () {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.complete();
                });
                groups.clear();
            }
            this.destination.complete();
        };
        GroupBySubscriber.prototype.removeGroup = function (key) {
            this.groups.delete(key);
        };
        GroupBySubscriber.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.attemptedToUnsubscribe = true;
                if (this.count === 0) {
                    _super.prototype.unsubscribe.call(this);
                }
            }
        };
        return GroupBySubscriber;
    }(Subscriber));
    var GroupDurationSubscriber = (function (_super) {
        __extends(GroupDurationSubscriber, _super);
        function GroupDurationSubscriber(key, group, parent) {
            var _this = _super.call(this, group) || this;
            _this.key = key;
            _this.group = group;
            _this.parent = parent;
            return _this;
        }
        GroupDurationSubscriber.prototype._next = function (value) {
            this.complete();
        };
        GroupDurationSubscriber.prototype._unsubscribe = function () {
            var _a = this, parent = _a.parent, key = _a.key;
            this.key = this.parent = null;
            if (parent) {
                parent.removeGroup(key);
            }
        };
        return GroupDurationSubscriber;
    }(Subscriber));
    var GroupedObservable = (function (_super) {
        __extends(GroupedObservable, _super);
        function GroupedObservable(key, groupSubject, refCountSubscription) {
            var _this = _super.call(this) || this;
            _this.key = key;
            _this.groupSubject = groupSubject;
            _this.refCountSubscription = refCountSubscription;
            return _this;
        }
        GroupedObservable.prototype._subscribe = function (subscriber) {
            var subscription = new Subscription();
            var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
            if (refCountSubscription && !refCountSubscription.closed) {
                subscription.add(new InnerRefCountSubscription(refCountSubscription));
            }
            subscription.add(groupSubject.subscribe(subscriber));
            return subscription;
        };
        return GroupedObservable;
    }(Observable));
    var InnerRefCountSubscription = (function (_super) {
        __extends(InnerRefCountSubscription, _super);
        function InnerRefCountSubscription(parent) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            parent.count++;
            return _this;
        }
        InnerRefCountSubscription.prototype.unsubscribe = function () {
            var parent = this.parent;
            if (!parent.closed && !this.closed) {
                _super.prototype.unsubscribe.call(this);
                parent.count -= 1;
                if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                    parent.unsubscribe();
                }
            }
        };
        return InnerRefCountSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
    var BehaviorSubject = (function (_super) {
        __extends(BehaviorSubject, _super);
        function BehaviorSubject(_value) {
            var _this = _super.call(this) || this;
            _this._value = _value;
            return _this;
        }
        Object.defineProperty(BehaviorSubject.prototype, "value", {
            get: function () {
                return this.getValue();
            },
            enumerable: true,
            configurable: true
        });
        BehaviorSubject.prototype._subscribe = function (subscriber) {
            var subscription = _super.prototype._subscribe.call(this, subscriber);
            if (subscription && !subscription.closed) {
                subscriber.next(this._value);
            }
            return subscription;
        };
        BehaviorSubject.prototype.getValue = function () {
            if (this.hasError) {
                throw this.thrownError;
            }
            else if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return this._value;
            }
        };
        BehaviorSubject.prototype.next = function (value) {
            _super.prototype.next.call(this, this._value = value);
        };
        return BehaviorSubject;
    }(Subject));

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var Action = (function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            return _super.call(this) || this;
        }
        Action.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return this;
        };
        return Action;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
    var AsyncAction = (function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.pending = false;
            return _this;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (this.closed) {
                return this;
            }
            this.state = state;
            var id = this.id;
            var scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && this.delay === delay && this.pending === false) {
                return id;
            }
            return clearInterval(id) && undefined || undefined;
        };
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, delay) {
            var errored = false;
            var errorValue = undefined;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = !!e && e || new Error(e);
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype._unsubscribe = function () {
            var id = this.id;
            var scheduler = this.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            this.work = null;
            this.state = null;
            this.pending = false;
            this.scheduler = null;
            if (index !== -1) {
                actions.splice(index, 1);
            }
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
        };
        return AsyncAction;
    }(Action));

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var QueueAction = (function (_super) {
        __extends(QueueAction, _super);
        function QueueAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        QueueAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay > 0) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            this.scheduler.flush(this);
            return this;
        };
        QueueAction.prototype.execute = function (state, delay) {
            return (delay > 0 || this.closed) ?
                _super.prototype.execute.call(this, state, delay) :
                this._execute(state, delay);
        };
        QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            return scheduler.flush(this);
        };
        return QueueAction;
    }(AsyncAction));

    var Scheduler = (function () {
        function Scheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            this.SchedulerAction = SchedulerAction;
            this.now = now;
        }
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            return new this.SchedulerAction(this, work).schedule(state, delay);
        };
        Scheduler.now = function () { return Date.now(); };
        return Scheduler;
    }());

    /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
    var AsyncScheduler = (function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            var _this = _super.call(this, SchedulerAction, function () {
                if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                    return AsyncScheduler.delegate.now();
                }
                else {
                    return now();
                }
            }) || this;
            _this.actions = [];
            _this.active = false;
            _this.scheduled = undefined;
            return _this;
        }
        AsyncScheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.schedule(work, delay, state);
            }
            else {
                return _super.prototype.schedule.call(this, work, delay, state);
            }
        };
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this.active) {
                actions.push(action);
                return;
            }
            var error;
            this.active = true;
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (action = actions.shift());
            this.active = false;
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var QueueScheduler = (function (_super) {
        __extends(QueueScheduler, _super);
        function QueueScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return QueueScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
    var queue = new QueueScheduler(QueueAction);

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    var EMPTY = new Observable(function (subscriber) { return subscriber.complete(); });
    function empty$1(scheduler) {
        return scheduler ? emptyScheduled(scheduler) : EMPTY;
    }
    function emptyScheduled(scheduler) {
        return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var subscribeToArray = function (array) {
        return function (subscriber) {
            for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            if (!subscriber.closed) {
                subscriber.complete();
            }
        };
    };

    /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
    function fromArray(input, scheduler) {
        if (!scheduler) {
            return new Observable(subscribeToArray(input));
        }
        else {
            return new Observable(function (subscriber) {
                var sub = new Subscription();
                var i = 0;
                sub.add(scheduler.schedule(function () {
                    if (i === input.length) {
                        subscriber.complete();
                        return;
                    }
                    subscriber.next(input[i++]);
                    if (!subscriber.closed) {
                        sub.add(this.schedule());
                    }
                }));
                return sub;
            });
        }
    }

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    function scalar(value) {
        var result = new Observable(function (subscriber) {
            subscriber.next(value);
            subscriber.complete();
        });
        result._isScalar = true;
        result.value = value;
        return result;
    }

    /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
    function of() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var scheduler = args[args.length - 1];
        if (isScheduler(scheduler)) {
            args.pop();
        }
        else {
            scheduler = undefined;
        }
        switch (args.length) {
            case 0:
                return empty$1(scheduler);
            case 1:
                return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
            default:
                return fromArray(args, scheduler);
        }
    }

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    function throwError(error, scheduler) {
        if (!scheduler) {
            return new Observable(function (subscriber) { return subscriber.error(error); });
        }
        else {
            return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
        }
    }
    function dispatch(_a) {
        var error = _a.error, subscriber = _a.subscriber;
        subscriber.error(error);
    }

    /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
    var Notification = (function () {
        function Notification(kind, value, error) {
            this.kind = kind;
            this.value = value;
            this.error = error;
            this.hasValue = kind === 'N';
        }
        Notification.prototype.observe = function (observer) {
            switch (this.kind) {
                case 'N':
                    return observer.next && observer.next(this.value);
                case 'E':
                    return observer.error && observer.error(this.error);
                case 'C':
                    return observer.complete && observer.complete();
            }
        };
        Notification.prototype.do = function (next, error, complete) {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return next && next(this.value);
                case 'E':
                    return error && error(this.error);
                case 'C':
                    return complete && complete();
            }
        };
        Notification.prototype.accept = function (nextOrObserver, error, complete) {
            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
                return this.observe(nextOrObserver);
            }
            else {
                return this.do(nextOrObserver, error, complete);
            }
        };
        Notification.prototype.toObservable = function () {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return of(this.value);
                case 'E':
                    return throwError(this.error);
                case 'C':
                    return empty$1();
            }
            throw new Error('unexpected notification kind value');
        };
        Notification.createNext = function (value) {
            if (typeof value !== 'undefined') {
                return new Notification('N', value);
            }
            return Notification.undefinedValueNotification;
        };
        Notification.createError = function (err) {
            return new Notification('E', undefined, err);
        };
        Notification.createComplete = function () {
            return Notification.completeNotification;
        };
        Notification.completeNotification = new Notification('C');
        Notification.undefinedValueNotification = new Notification('N', undefined);
        return Notification;
    }());

    /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
    var ObserveOnSubscriber = (function (_super) {
        __extends(ObserveOnSubscriber, _super);
        function ObserveOnSubscriber(destination, scheduler, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            var _this = _super.call(this, destination) || this;
            _this.scheduler = scheduler;
            _this.delay = delay;
            return _this;
        }
        ObserveOnSubscriber.dispatch = function (arg) {
            var notification = arg.notification, destination = arg.destination;
            notification.observe(destination);
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
            this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
        };
        ObserveOnSubscriber.prototype._next = function (value) {
            this.scheduleMessage(Notification.createNext(value));
        };
        ObserveOnSubscriber.prototype._error = function (err) {
            this.scheduleMessage(Notification.createError(err));
        };
        ObserveOnSubscriber.prototype._complete = function () {
            this.scheduleMessage(Notification.createComplete());
        };
        return ObserveOnSubscriber;
    }(Subscriber));
    var ObserveOnMessage = (function () {
        function ObserveOnMessage(notification, destination) {
            this.notification = notification;
            this.destination = destination;
        }
        return ObserveOnMessage;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
    var ReplaySubject = (function (_super) {
        __extends(ReplaySubject, _super);
        function ReplaySubject(bufferSize, windowTime, scheduler) {
            if (bufferSize === void 0) {
                bufferSize = Number.POSITIVE_INFINITY;
            }
            if (windowTime === void 0) {
                windowTime = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this) || this;
            _this.scheduler = scheduler;
            _this._events = [];
            _this._infiniteTimeWindow = false;
            _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
            _this._windowTime = windowTime < 1 ? 1 : windowTime;
            if (windowTime === Number.POSITIVE_INFINITY) {
                _this._infiniteTimeWindow = true;
                _this.next = _this.nextInfiniteTimeWindow;
            }
            else {
                _this.next = _this.nextTimeWindow;
            }
            return _this;
        }
        ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
            var _events = this._events;
            _events.push(value);
            if (_events.length > this._bufferSize) {
                _events.shift();
            }
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype.nextTimeWindow = function (value) {
            this._events.push(new ReplayEvent(this._getNow(), value));
            this._trimBufferThenGetEvents();
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype._subscribe = function (subscriber) {
            var _infiniteTimeWindow = this._infiniteTimeWindow;
            var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
            var scheduler = this.scheduler;
            var len = _events.length;
            var subscription;
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.isStopped || this.hasError) {
                subscription = Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                subscription = new SubjectSubscription(this, subscriber);
            }
            if (scheduler) {
                subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
            }
            if (_infiniteTimeWindow) {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i]);
                }
            }
            else {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i].value);
                }
            }
            if (this.hasError) {
                subscriber.error(this.thrownError);
            }
            else if (this.isStopped) {
                subscriber.complete();
            }
            return subscription;
        };
        ReplaySubject.prototype._getNow = function () {
            return (this.scheduler || queue).now();
        };
        ReplaySubject.prototype._trimBufferThenGetEvents = function () {
            var now = this._getNow();
            var _bufferSize = this._bufferSize;
            var _windowTime = this._windowTime;
            var _events = this._events;
            var eventsCount = _events.length;
            var spliceCount = 0;
            while (spliceCount < eventsCount) {
                if ((now - _events[spliceCount].time) < _windowTime) {
                    break;
                }
                spliceCount++;
            }
            if (eventsCount > _bufferSize) {
                spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
            }
            if (spliceCount > 0) {
                _events.splice(0, spliceCount);
            }
            return _events;
        };
        return ReplaySubject;
    }(Subject));
    var ReplayEvent = (function () {
        function ReplayEvent(time, value) {
            this.time = time;
            this.value = value;
        }
        return ReplayEvent;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
    var AsyncSubject = (function (_super) {
        __extends(AsyncSubject, _super);
        function AsyncSubject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.value = null;
            _this.hasNext = false;
            _this.hasCompleted = false;
            return _this;
        }
        AsyncSubject.prototype._subscribe = function (subscriber) {
            if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.hasCompleted && this.hasNext) {
                subscriber.next(this.value);
                subscriber.complete();
                return Subscription.EMPTY;
            }
            return _super.prototype._subscribe.call(this, subscriber);
        };
        AsyncSubject.prototype.next = function (value) {
            if (!this.hasCompleted) {
                this.value = value;
                this.hasNext = true;
            }
        };
        AsyncSubject.prototype.error = function (error) {
            if (!this.hasCompleted) {
                _super.prototype.error.call(this, error);
            }
        };
        AsyncSubject.prototype.complete = function () {
            this.hasCompleted = true;
            if (this.hasNext) {
                _super.prototype.next.call(this, this.value);
            }
            _super.prototype.complete.call(this);
        };
        return AsyncSubject;
    }(Subject));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var nextHandle = 1;
    var tasksByHandle = {};
    function runIfPresent(handle) {
        var cb = tasksByHandle[handle];
        if (cb) {
            cb();
        }
    }
    var Immediate = {
        setImmediate: function (cb) {
            var handle = nextHandle++;
            tasksByHandle[handle] = cb;
            Promise.resolve().then(function () { return runIfPresent(handle); });
            return handle;
        },
        clearImmediate: function (handle) {
            delete tasksByHandle[handle];
        },
    };

    /** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
    var AsapAction = (function (_super) {
        __extends(AsapAction, _super);
        function AsapAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
        };
        AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                Immediate.clearImmediate(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AsapAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var AsapScheduler = (function (_super) {
        __extends(AsapScheduler, _super);
        function AsapScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AsapScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsapScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
    var asap = new AsapScheduler(AsapAction);

    /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var async = new AsyncScheduler(AsyncAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var AnimationFrameAction = (function (_super) {
        __extends(AnimationFrameAction, _super);
        function AnimationFrameAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
        };
        AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                cancelAnimationFrame(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AnimationFrameAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var AnimationFrameScheduler = (function (_super) {
        __extends(AnimationFrameScheduler, _super);
        function AnimationFrameScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationFrameScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AnimationFrameScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
    var animationFrame = new AnimationFrameScheduler(AnimationFrameAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var VirtualTimeScheduler = (function (_super) {
        __extends(VirtualTimeScheduler, _super);
        function VirtualTimeScheduler(SchedulerAction, maxFrames) {
            if (SchedulerAction === void 0) {
                SchedulerAction = VirtualAction;
            }
            if (maxFrames === void 0) {
                maxFrames = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
            _this.maxFrames = maxFrames;
            _this.frame = 0;
            _this.index = -1;
            return _this;
        }
        VirtualTimeScheduler.prototype.flush = function () {
            var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
            var error, action;
            while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            }
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        VirtualTimeScheduler.frameTimeFactor = 10;
        return VirtualTimeScheduler;
    }(AsyncScheduler));
    var VirtualAction = (function (_super) {
        __extends(VirtualAction, _super);
        function VirtualAction(scheduler, work, index) {
            if (index === void 0) {
                index = scheduler.index += 1;
            }
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.index = index;
            _this.active = true;
            _this.index = scheduler.index = index;
            return _this;
        }
        VirtualAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (!this.id) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.active = false;
            var action = new VirtualAction(this.scheduler, this.work);
            this.add(action);
            return action.schedule(state, delay);
        };
        VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            this.delay = scheduler.frame + delay;
            var actions = scheduler.actions;
            actions.push(this);
            actions.sort(VirtualAction.sortActions);
            return true;
        };
        VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return undefined;
        };
        VirtualAction.prototype._execute = function (state, delay) {
            if (this.active === true) {
                return _super.prototype._execute.call(this, state, delay);
            }
        };
        VirtualAction.sortActions = function (a, b) {
            if (a.delay === b.delay) {
                if (a.index === b.index) {
                    return 0;
                }
                else if (a.index > b.index) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            else if (a.delay > b.delay) {
                return 1;
            }
            else {
                return -1;
            }
        };
        return VirtualAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
    var ArgumentOutOfRangeError = (function (_super) {
        __extends(ArgumentOutOfRangeError, _super);
        function ArgumentOutOfRangeError() {
            var _this = _super.call(this, 'argument out of range') || this;
            _this.name = 'ArgumentOutOfRangeError';
            Object.setPrototypeOf(_this, ArgumentOutOfRangeError.prototype);
            return _this;
        }
        return ArgumentOutOfRangeError;
    }(Error));

    /** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
    var EmptyError = (function (_super) {
        __extends(EmptyError, _super);
        function EmptyError() {
            var _this = _super.call(this, 'no elements in sequence') || this;
            _this.name = 'EmptyError';
            Object.setPrototypeOf(_this, EmptyError.prototype);
            return _this;
        }
        return EmptyError;
    }(Error));

    /** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
    var TimeoutError = (function (_super) {
        __extends(TimeoutError, _super);
        function TimeoutError() {
            var _this = _super.call(this, 'Timeout has occurred') || this;
            _this.name = 'TimeoutError';
            Object.setPrototypeOf(_this, TimeoutError.prototype);
            return _this;
        }
        return TimeoutError;
    }(Error));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var MapSubscriber = (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var OuterSubscriber = (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var InnerSubscriber = (function (_super) {
        __extends(InnerSubscriber, _super);
        function InnerSubscriber(parent, outerValue, outerIndex) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.outerValue = outerValue;
            _this.outerIndex = outerIndex;
            _this.index = 0;
            return _this;
        }
        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
    var subscribeToPromise = function (promise) {
        return function (subscriber) {
            promise.then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, hostReportError);
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = getSymbolIterator();

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
    var subscribeToIterable = function (iterable) {
        return function (subscriber) {
            var iterator$$1 = iterable[iterator]();
            do {
                var item = iterator$$1.next();
                if (item.done) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(item.value);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
            if (typeof iterator$$1.return === 'function') {
                subscriber.add(function () {
                    if (iterator$$1.return) {
                        iterator$$1.return();
                    }
                });
            }
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
    var subscribeToObservable = function (obj) {
        return function (subscriber) {
            var obs = obj[observable]();
            if (typeof obs.subscribe !== 'function') {
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
            }
            else {
                return obs.subscribe(subscriber);
            }
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    /** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
    var subscribeTo = function (result) {
        if (result instanceof Observable) {
            return function (subscriber) {
                if (result._isScalar) {
                    subscriber.next(result.value);
                    subscriber.complete();
                    return undefined;
                }
                else {
                    return result.subscribe(subscriber);
                }
            };
        }
        else if (result && typeof result[observable] === 'function') {
            return subscribeToObservable(result);
        }
        else if (isArrayLike(result)) {
            return subscribeToArray(result);
        }
        else if (isPromise(result)) {
            return subscribeToPromise(result);
        }
        else if (result && typeof result[iterator] === 'function') {
            return subscribeToIterable(result);
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            throw new TypeError(msg);
        }
    };

    /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
        var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        return subscribeTo(result)(destination);
    }

    /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
    var NONE = {};
    var CombineLatestSubscriber = (function (_super) {
        __extends(CombineLatestSubscriber, _super);
        function CombineLatestSubscriber(destination, resultSelector) {
            var _this = _super.call(this, destination) || this;
            _this.resultSelector = resultSelector;
            _this.active = 0;
            _this.values = [];
            _this.observables = [];
            return _this;
        }
        CombineLatestSubscriber.prototype._next = function (observable) {
            this.values.push(NONE);
            this.observables.push(observable);
        };
        CombineLatestSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                this.active = len;
                this.toRespond = len;
                for (var i = 0; i < len; i++) {
                    var observable = observables[i];
                    this.add(subscribeToResult(this, observable, observable, i));
                }
            }
        };
        CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
            if ((this.active -= 1) === 0) {
                this.destination.complete();
            }
        };
        CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var values = this.values;
            var oldVal = values[outerIndex];
            var toRespond = !this.toRespond
                ? 0
                : oldVal === NONE ? --this.toRespond : this.toRespond;
            values[outerIndex] = innerValue;
            if (toRespond === 0) {
                if (this.resultSelector) {
                    this._tryResultSelector(values);
                }
                else {
                    this.destination.next(values.slice());
                }
            }
        };
        CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
            var result;
            try {
                result = this.resultSelector.apply(this, values);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return CombineLatestSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_map,_observable_from PURE_IMPORTS_END */
    var MergeMapSubscriber = (function (_super) {
        __extends(MergeMapSubscriber, _super);
        function MergeMapSubscriber(destination, project, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.concurrent = concurrent;
            _this.hasCompleted = false;
            _this.buffer = [];
            _this.active = 0;
            _this.index = 0;
            return _this;
        }
        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result, value, index);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
            this.add(subscribeToResult(this, ish, value, index));
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
        };
        MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Observable,_util_isArray,_empty,_util_subscribeToResult,_OuterSubscriber,_operators_map PURE_IMPORTS_END */
    var ForkJoinSubscriber = (function (_super) {
        __extends(ForkJoinSubscriber, _super);
        function ForkJoinSubscriber(destination, sources) {
            var _this = _super.call(this, destination) || this;
            _this.sources = sources;
            _this.completed = 0;
            _this.haveValues = 0;
            var len = sources.length;
            _this.values = new Array(len);
            for (var i = 0; i < len; i++) {
                var source = sources[i];
                var innerSubscription = subscribeToResult(_this, source, null, i);
                if (innerSubscription) {
                    _this.add(innerSubscription);
                }
            }
            return _this;
        }
        ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.values[outerIndex] = innerValue;
            if (!innerSub._hasValue) {
                innerSub._hasValue = true;
                this.haveValues++;
            }
        };
        ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
            var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
            var len = values.length;
            if (!innerSub._hasValue) {
                destination.complete();
                return;
            }
            this.completed++;
            if (this.completed !== len) {
                return;
            }
            if (haveValues === len) {
                destination.next(values);
            }
            destination.complete();
        };
        return ForkJoinSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
    var RaceSubscriber = (function (_super) {
        __extends(RaceSubscriber, _super);
        function RaceSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.hasFirst = false;
            _this.observables = [];
            _this.subscriptions = [];
            return _this;
        }
        RaceSubscriber.prototype._next = function (observable) {
            this.observables.push(observable);
        };
        RaceSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                for (var i = 0; i < len && !this.hasFirst; i++) {
                    var observable = observables[i];
                    var subscription = subscribeToResult(this, observable, observable, i);
                    if (this.subscriptions) {
                        this.subscriptions.push(subscription);
                    }
                    this.add(subscription);
                }
                this.observables = null;
            }
        };
        RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (!this.hasFirst) {
                this.hasFirst = true;
                for (var i = 0; i < this.subscriptions.length; i++) {
                    if (i !== outerIndex) {
                        var subscription = this.subscriptions[i];
                        subscription.unsubscribe();
                        this.remove(subscription);
                    }
                }
                this.subscriptions = null;
            }
            this.destination.next(innerValue);
        };
        return RaceSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
    var ZipSubscriber = (function (_super) {
        __extends(ZipSubscriber, _super);
        function ZipSubscriber(destination, resultSelector, values) {
            if (values === void 0) {
                values = Object.create(null);
            }
            var _this = _super.call(this, destination) || this;
            _this.iterators = [];
            _this.active = 0;
            _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
            _this.values = values;
            return _this;
        }
        ZipSubscriber.prototype._next = function (value) {
            var iterators = this.iterators;
            if (isArray(value)) {
                iterators.push(new StaticArrayIterator(value));
            }
            else if (typeof value[iterator] === 'function') {
                iterators.push(new StaticIterator(value[iterator]()));
            }
            else {
                iterators.push(new ZipBufferIterator(this.destination, this, value));
            }
        };
        ZipSubscriber.prototype._complete = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            if (len === 0) {
                this.destination.complete();
                return;
            }
            this.active = len;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (iterator$$1.stillUnsubscribed) {
                    this.add(iterator$$1.subscribe(iterator$$1, i));
                }
                else {
                    this.active--;
                }
            }
        };
        ZipSubscriber.prototype.notifyInactive = function () {
            this.active--;
            if (this.active === 0) {
                this.destination.complete();
            }
        };
        ZipSubscriber.prototype.checkIterators = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            var destination = this.destination;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                    return;
                }
            }
            var shouldComplete = false;
            var args = [];
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                var result = iterator$$1.next();
                if (iterator$$1.hasCompleted()) {
                    shouldComplete = true;
                }
                if (result.done) {
                    destination.complete();
                    return;
                }
                args.push(result.value);
            }
            if (this.resultSelector) {
                this._tryresultSelector(args);
            }
            else {
                destination.next(args);
            }
            if (shouldComplete) {
                destination.complete();
            }
        };
        ZipSubscriber.prototype._tryresultSelector = function (args) {
            var result;
            try {
                result = this.resultSelector.apply(this, args);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return ZipSubscriber;
    }(Subscriber));
    var StaticIterator = (function () {
        function StaticIterator(iterator$$1) {
            this.iterator = iterator$$1;
            this.nextResult = iterator$$1.next();
        }
        StaticIterator.prototype.hasValue = function () {
            return true;
        };
        StaticIterator.prototype.next = function () {
            var result = this.nextResult;
            this.nextResult = this.iterator.next();
            return result;
        };
        StaticIterator.prototype.hasCompleted = function () {
            var nextResult = this.nextResult;
            return nextResult && nextResult.done;
        };
        return StaticIterator;
    }());
    var StaticArrayIterator = (function () {
        function StaticArrayIterator(array) {
            this.array = array;
            this.index = 0;
            this.length = 0;
            this.length = array.length;
        }
        StaticArrayIterator.prototype[iterator] = function () {
            return this;
        };
        StaticArrayIterator.prototype.next = function (value) {
            var i = this.index++;
            var array = this.array;
            return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
        };
        StaticArrayIterator.prototype.hasValue = function () {
            return this.array.length > this.index;
        };
        StaticArrayIterator.prototype.hasCompleted = function () {
            return this.array.length === this.index;
        };
        return StaticArrayIterator;
    }());
    var ZipBufferIterator = (function (_super) {
        __extends(ZipBufferIterator, _super);
        function ZipBufferIterator(destination, parent, observable) {
            var _this = _super.call(this, destination) || this;
            _this.parent = parent;
            _this.observable = observable;
            _this.stillUnsubscribed = true;
            _this.buffer = [];
            _this.isComplete = false;
            return _this;
        }
        ZipBufferIterator.prototype[iterator] = function () {
            return this;
        };
        ZipBufferIterator.prototype.next = function () {
            var buffer = this.buffer;
            if (buffer.length === 0 && this.isComplete) {
                return { value: null, done: true };
            }
            else {
                return { value: buffer.shift(), done: false };
            }
        };
        ZipBufferIterator.prototype.hasValue = function () {
            return this.buffer.length > 0;
        };
        ZipBufferIterator.prototype.hasCompleted = function () {
            return this.buffer.length === 0 && this.isComplete;
        };
        ZipBufferIterator.prototype.notifyComplete = function () {
            if (this.buffer.length > 0) {
                this.isComplete = true;
                this.parent.notifyInactive();
            }
            else {
                this.destination.complete();
            }
        };
        ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.buffer.push(innerValue);
            this.parent.checkIterators();
        };
        ZipBufferIterator.prototype.subscribe = function (value, index) {
            return subscribeToResult(this, this.observable, this, index);
        };
        return ZipBufferIterator;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxNotificationsService = (function () {
        function NgxNotificationsService() {
            this.initNotification();
        }
        /**
         * 初始化
         * @return {?}
         */
        NgxNotificationsService.prototype.initNotification = /**
         * 初始化
         * @return {?}
         */
            function () {
                this.topic = new Subject();
                this.observer = this.topic.asObservable();
            };
        /**
         * 获取观察者
         * @return {?}
         */
        NgxNotificationsService.prototype.getNotification = /**
         * 获取观察者
         * @return {?}
         */
            function () {
                return this.observer;
            };
        /**
         * 发布
         * @param {?} data
         * @return {?}
         */
        NgxNotificationsService.prototype.publish = /**
         * 发布
         * @param {?} data
         * @return {?}
         */
            function (data) {
                if (data) {
                    this.topic.next(data);
                }
            };
        NgxNotificationsService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        NgxNotificationsService.ctorParameters = function () { return []; };
        /** @nocollapse */ NgxNotificationsService.ngInjectableDef = i0.defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
        return NgxNotificationsService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxNotificationsComponent = (function () {
        function NgxNotificationsComponent() {
        }
        /**
         * @return {?}
         */
        NgxNotificationsComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        NgxNotificationsComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'lib-ngx-notifications',
                        template: "\n    <p>\n      ngx-notifications works!\n    </p>\n  ",
                        styles: []
                    },] },
        ];
        /** @nocollapse */
        NgxNotificationsComponent.ctorParameters = function () { return []; };
        return NgxNotificationsComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxNotificationsModule = (function () {
        function NgxNotificationsModule() {
        }
        NgxNotificationsModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [],
                        declarations: [NgxNotificationsComponent],
                        exports: [NgxNotificationsComponent]
                    },] },
        ];
        return NgxNotificationsModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgxNotificationsService = NgxNotificationsService;
    exports.NgxNotificationsComponent = NgxNotificationsComponent;
    exports.NgxNotificationsModule = NgxNotificationsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMudW1kLmpzLm1hcCIsInNvdXJjZXMiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHg6IGFueSk6IHggaXMgRnVuY3Rpb24ge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG4iLCJsZXQgX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGdsb2JhbCBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgUnhKUywgdXNlZCB0byBjb25maWd1cmUgdGhpbmdzXG4gKiBsaWtlIHdoYXQgUHJvbWlzZSBjb250cnVjdG9yIHNob3VsZCB1c2VkIHRvIGNyZWF0ZSBQcm9taXNlc1xuICovXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICAvKipcbiAgICogVGhlIHByb21pc2UgY29uc3RydWN0b3IgdXNlZCBieSBkZWZhdWx0IGZvciBtZXRob2RzIHN1Y2ggYXNcbiAgICoge0BsaW5rIHRvUHJvbWlzZX0gYW5kIHtAbGluayBmb3JFYWNofVxuICAgKi9cbiAgUHJvbWlzZTogdW5kZWZpbmVkIGFzIFByb21pc2VDb25zdHJ1Y3Rvckxpa2UsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHR1cm5zIG9uIHN5bmNocm9ub3VzIGVycm9yIHJldGhyb3dpbmcsIHdoaWNoIGlzIGEgZGVwcmVjYXRlZCBiZWhhdmlvclxuICAgKiBpbiB2NiBhbmQgaGlnaGVyLiBUaGlzIGJlaGF2aW9yIGVuYWJsZXMgYmFkIHBhdHRlcm5zIGxpa2Ugd3JhcHBpbmcgYSBzdWJzY3JpYmVcbiAgICogY2FsbCBpbiBhIHRyeS9jYXRjaCBibG9jay4gSXQgYWxzbyBlbmFibGVzIHByb2R1Y2VyIGludGVyZmVyZW5jZSwgYSBuYXN0eSBidWdcbiAgICogd2hlcmUgYSBtdWx0aWNhc3QgY2FuIGJlIGJyb2tlbiBmb3IgYWxsIG9ic2VydmVycyBieSBhIGRvd25zdHJlYW0gY29uc3VtZXIgd2l0aFxuICAgKiBhbiB1bmhhbmRsZWQgZXJyb3IuIERPIE5PVCBVU0UgVEhJUyBGTEFHIFVOTEVTUyBJVCdTIE5FRURFRCBUTyBCWSBUSU1FXG4gICAqIEZPUiBNSUdSQVRJT04gUkVBU09OUy5cbiAgICovXG4gIHNldCB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpO1xuICAgICAgY29uc29sZS53YXJuKCdERVBSRUNBVEVEISBSeEpTIHdhcyBzZXQgdG8gdXNlIGRlcHJlY2F0ZWQgc3luY2hyb25vdXMgZXJyb3IgaGFuZGxpbmcgYmVoYXZpb3IgYnkgY29kZSBhdDogXFxuJyArIGVycm9yLnN0YWNrKTtcbiAgICB9IGVsc2UgaWYgKF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncykge1xuICAgICAgY29uc29sZS5sb2coJ1J4SlM6IEJhY2sgdG8gYSBiZXR0ZXIgZXJyb3IgYmVoYXZpb3IuIFRoYW5rIHlvdS4gPDMnKTtcbiAgICB9XG4gICAgX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzID0gdmFsdWU7XG4gIH0sXG5cbiAgZ2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcoKSB7XG4gICAgcmV0dXJuIF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncztcbiAgfSxcbn07XG4iLCIvKipcbiAqIFRocm93cyBhbiBlcnJvciBvbiBhbm90aGVyIGpvYiBzbyB0aGF0IGl0J3MgcGlja2VkIHVwIGJ5IHRoZSBydW50aW1lJ3NcbiAqIHVuY2F1Z2h0IGVycm9yIGhhbmRsaW5nIG1lY2hhbmlzbS5cbiAqIEBwYXJhbSBlcnIgdGhlIGVycm9yIHRvIHRocm93XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBob3N0UmVwb3J0RXJyb3IoZXJyOiBhbnkpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7IHRocm93IGVycjsgfSk7XG59IiwiaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IGhvc3RSZXBvcnRFcnJvciB9IGZyb20gJy4vdXRpbC9ob3N0UmVwb3J0RXJyb3InO1xuXG5leHBvcnQgY29uc3QgZW1wdHk6IE9ic2VydmVyPGFueT4gPSB7XG4gIGNsb3NlZDogdHJ1ZSxcbiAgbmV4dCh2YWx1ZTogYW55KTogdm9pZCB7IC8qIG5vb3AgKi99LFxuICBlcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBsZXRlKCk6IHZvaWQgeyAvKm5vb3AqLyB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8ICg8VD4oeDogYW55KTogeCBpcyBUW10gPT4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiB4IGlzIE9iamVjdCB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgdHlwZW9mIHggPT09ICdvYmplY3QnO1xufVxuIiwiLy8gdHlwZW9mIGFueSBzbyB0aGF0IGl0IHdlIGRvbid0IGhhdmUgdG8gY2FzdCB3aGVuIGNvbXBhcmluZyBhIHJlc3VsdCB0byB0aGUgZXJyb3Igb2JqZWN0XG5leHBvcnQgY29uc3QgZXJyb3JPYmplY3Q6IGFueSA9IHsgZToge30gfTsiLCJpbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4vZXJyb3JPYmplY3QnO1xuXG5sZXQgdHJ5Q2F0Y2hUYXJnZXQ6IEZ1bmN0aW9uO1xuXG5mdW5jdGlvbiB0cnlDYXRjaGVyKHRoaXM6IGFueSk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHRyeUNhdGNoVGFyZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvck9iamVjdC5lID0gZTtcbiAgICByZXR1cm4gZXJyb3JPYmplY3Q7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeUNhdGNoPFQgZXh0ZW5kcyBGdW5jdGlvbj4oZm46IFQpOiBUIHtcbiAgdHJ5Q2F0Y2hUYXJnZXQgPSBmbjtcbiAgcmV0dXJuIDxhbnk+dHJ5Q2F0Y2hlcjtcbn1cbiIsIi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gb25lIG9yIG1vcmUgZXJyb3JzIGhhdmUgb2NjdXJyZWQgZHVyaW5nIHRoZVxuICogYHVuc3Vic2NyaWJlYCBvZiBhIHtAbGluayBTdWJzY3JpcHRpb259LlxuICovXG5leHBvcnQgY2xhc3MgVW5zdWJzY3JpcHRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdVbnN1YnNjcmlwdGlvbkVycm9yJztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZXJyb3JzOiBhbnlbXSkge1xuICAgIHN1cGVyKGVycm9ycyA/XG4gICAgICBgJHtlcnJvcnMubGVuZ3RofSBlcnJvcnMgb2NjdXJyZWQgZHVyaW5nIHVuc3Vic2NyaXB0aW9uOlxuICAke2Vycm9ycy5tYXAoKGVyciwgaSkgPT4gYCR7aSArIDF9KSAke2Vyci50b1N0cmluZygpfWApLmpvaW4oJ1xcbiAgJyl9YCA6ICcnKTtcbiAgICAoT2JqZWN0IGFzIGFueSkuc2V0UHJvdG90eXBlT2YodGhpcywgVW5zdWJzY3JpcHRpb25FcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL3V0aWwvaXNPYmplY3QnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25MaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGRpc3Bvc2FibGUgcmVzb3VyY2UsIHN1Y2ggYXMgdGhlIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlLiBBXG4gKiBTdWJzY3JpcHRpb24gaGFzIG9uZSBpbXBvcnRhbnQgbWV0aG9kLCBgdW5zdWJzY3JpYmVgLCB0aGF0IHRha2VzIG5vIGFyZ3VtZW50XG4gKiBhbmQganVzdCBkaXNwb3NlcyB0aGUgcmVzb3VyY2UgaGVsZCBieSB0aGUgc3Vic2NyaXB0aW9uLlxuICpcbiAqIEFkZGl0aW9uYWxseSwgc3Vic2NyaXB0aW9ucyBtYXkgYmUgZ3JvdXBlZCB0b2dldGhlciB0aHJvdWdoIHRoZSBgYWRkKClgXG4gKiBtZXRob2QsIHdoaWNoIHdpbGwgYXR0YWNoIGEgY2hpbGQgU3Vic2NyaXB0aW9uIHRvIHRoZSBjdXJyZW50IFN1YnNjcmlwdGlvbi5cbiAqIFdoZW4gYSBTdWJzY3JpcHRpb24gaXMgdW5zdWJzY3JpYmVkLCBhbGwgaXRzIGNoaWxkcmVuIChhbmQgaXRzIGdyYW5kY2hpbGRyZW4pXG4gKiB3aWxsIGJlIHVuc3Vic2NyaWJlZCBhcyB3ZWxsLlxuICpcbiAqIEBjbGFzcyBTdWJzY3JpcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbkxpa2Uge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgcHVibGljIHN0YXRpYyBFTVBUWTogU3Vic2NyaXB0aW9uID0gKGZ1bmN0aW9uKGVtcHR5OiBhbnkpIHtcbiAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgIHJldHVybiBlbXB0eTtcbiAgfShuZXcgU3Vic2NyaXB0aW9uKCkpKTtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgdGhpcyBTdWJzY3JpcHRpb24gaGFzIGFscmVhZHkgYmVlbiB1bnN1YnNjcmliZWQuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgcHVibGljIGNsb3NlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnQ6IFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnRzOiBTdWJzY3JpcHRpb25bXSA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uTGlrZVtdID0gbnVsbDtcblxuICAvKipcbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbdW5zdWJzY3JpYmVdIEEgZnVuY3Rpb24gZGVzY3JpYmluZyBob3cgdG9cbiAgICogcGVyZm9ybSB0aGUgZGlzcG9zYWwgb2YgcmVzb3VyY2VzIHdoZW4gdGhlIGB1bnN1YnNjcmliZWAgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHVuc3Vic2NyaWJlPzogKCkgPT4gdm9pZCkge1xuICAgIGlmICh1bnN1YnNjcmliZSkge1xuICAgICAgKDxhbnk+IHRoaXMpLl91bnN1YnNjcmliZSA9IHVuc3Vic2NyaWJlO1xuXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoZSByZXNvdXJjZXMgaGVsZCBieSB0aGUgc3Vic2NyaXB0aW9uLiBNYXksIGZvciBpbnN0YW5jZSwgY2FuY2VsXG4gICAqIGFuIG9uZ29pbmcgT2JzZXJ2YWJsZSBleGVjdXRpb24gb3IgY2FuY2VsIGFueSBvdGhlciB0eXBlIG9mIHdvcmsgdGhhdFxuICAgKiBzdGFydGVkIHdoZW4gdGhlIFN1YnNjcmlwdGlvbiB3YXMgY3JlYXRlZC5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHVuc3Vic2NyaWJlKCk6IHZvaWQge1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcbiAgICBsZXQgZXJyb3JzOiBhbnlbXTtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB7IF9wYXJlbnQsIF9wYXJlbnRzLCBfdW5zdWJzY3JpYmUsIF9zdWJzY3JpcHRpb25zIH0gPSAoPGFueT4gdGhpcyk7XG5cbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRzID0gbnVsbDtcbiAgICAvLyBudWxsIG91dCBfc3Vic2NyaXB0aW9ucyBmaXJzdCBzbyBhbnkgY2hpbGQgc3Vic2NyaXB0aW9ucyB0aGF0IGF0dGVtcHRcbiAgICAvLyB0byByZW1vdmUgdGhlbXNlbHZlcyBmcm9tIHRoaXMgc3Vic2NyaXB0aW9uIHdpbGwgbm9vcFxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxlbiA9IF9wYXJlbnRzID8gX3BhcmVudHMubGVuZ3RoIDogMDtcblxuICAgIC8vIGlmIHRoaXMuX3BhcmVudCBpcyBudWxsLCB0aGVuIHNvIGlzIHRoaXMuX3BhcmVudHMsIGFuZCB3ZVxuICAgIC8vIGRvbid0IGhhdmUgdG8gcmVtb3ZlIG91cnNlbHZlcyBmcm9tIGFueSBwYXJlbnQgc3Vic2NyaXB0aW9ucy5cbiAgICB3aGlsZSAoX3BhcmVudCkge1xuICAgICAgX3BhcmVudC5yZW1vdmUodGhpcyk7XG4gICAgICAvLyBpZiB0aGlzLl9wYXJlbnRzIGlzIG51bGwgb3IgaW5kZXggPj0gbGVuLFxuICAgICAgLy8gdGhlbiBfcGFyZW50IGlzIHNldCB0byBudWxsLCBhbmQgdGhlIGxvb3AgZXhpdHNcbiAgICAgIF9wYXJlbnQgPSArK2luZGV4IDwgbGVuICYmIF9wYXJlbnRzW2luZGV4XSB8fCBudWxsO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKF91bnN1YnNjcmliZSkpIHtcbiAgICAgIGxldCB0cmlhbCA9IHRyeUNhdGNoKF91bnN1YnNjcmliZSkuY2FsbCh0aGlzKTtcbiAgICAgIGlmICh0cmlhbCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgZXJyb3JzID0gZXJyb3JzIHx8IChcbiAgICAgICAgICBlcnJvck9iamVjdC5lIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvciA/XG4gICAgICAgICAgICBmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyb3JPYmplY3QuZS5lcnJvcnMpIDogW2Vycm9yT2JqZWN0LmVdXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyYXkoX3N1YnNjcmlwdGlvbnMpKSB7XG5cbiAgICAgIGluZGV4ID0gLTE7XG4gICAgICBsZW4gPSBfc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IHN1YiA9IF9zdWJzY3JpcHRpb25zW2luZGV4XTtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHN1YikpIHtcbiAgICAgICAgICBsZXQgdHJpYWwgPSB0cnlDYXRjaChzdWIudW5zdWJzY3JpYmUpLmNhbGwoc3ViKTtcbiAgICAgICAgICBpZiAodHJpYWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzIHx8IFtdO1xuICAgICAgICAgICAgbGV0IGVyciA9IGVycm9yT2JqZWN0LmU7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnIuZXJyb3JzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIHRocm93IG5ldyBVbnN1YnNjcmlwdGlvbkVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0ZWFyIGRvd24gdG8gYmUgY2FsbGVkIGR1cmluZyB0aGUgdW5zdWJzY3JpYmUoKSBvZiB0aGlzXG4gICAqIFN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIHRlYXIgZG93biBiZWluZyBhZGRlZCBpcyBhIHN1YnNjcmlwdGlvbiB0aGF0IGlzIGFscmVhZHlcbiAgICogdW5zdWJzY3JpYmVkLCBpcyB0aGUgc2FtZSByZWZlcmVuY2UgYGFkZGAgaXMgYmVpbmcgY2FsbGVkIG9uLCBvciBpc1xuICAgKiBgU3Vic2NyaXB0aW9uLkVNUFRZYCwgaXQgd2lsbCBub3QgYmUgYWRkZWQuXG4gICAqXG4gICAqIElmIHRoaXMgc3Vic2NyaXB0aW9uIGlzIGFscmVhZHkgaW4gYW4gYGNsb3NlZGAgc3RhdGUsIHRoZSBwYXNzZWRcbiAgICogdGVhciBkb3duIGxvZ2ljIHdpbGwgYmUgZXhlY3V0ZWQgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7VGVhcmRvd25Mb2dpY30gdGVhcmRvd24gVGhlIGFkZGl0aW9uYWwgbG9naWMgdG8gZXhlY3V0ZSBvblxuICAgKiB0ZWFyZG93bi5cbiAgICogQHJldHVybiB7U3Vic2NyaXB0aW9ufSBSZXR1cm5zIHRoZSBTdWJzY3JpcHRpb24gdXNlZCBvciBjcmVhdGVkIHRvIGJlXG4gICAqIGFkZGVkIHRvIHRoZSBpbm5lciBzdWJzY3JpcHRpb25zIGxpc3QuIFRoaXMgU3Vic2NyaXB0aW9uIGNhbiBiZSB1c2VkIHdpdGhcbiAgICogYHJlbW92ZSgpYCB0byByZW1vdmUgdGhlIHBhc3NlZCB0ZWFyZG93biBsb2dpYyBmcm9tIHRoZSBpbm5lciBzdWJzY3JpcHRpb25zXG4gICAqIGxpc3QuXG4gICAqL1xuICBhZGQodGVhcmRvd246IFRlYXJkb3duTG9naWMpOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICghdGVhcmRvd24gfHwgKHRlYXJkb3duID09PSBTdWJzY3JpcHRpb24uRU1QVFkpKSB7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH1cblxuICAgIGlmICh0ZWFyZG93biA9PT0gdGhpcykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9ICg8U3Vic2NyaXB0aW9uPiB0ZWFyZG93bik7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiB0ZWFyZG93bikge1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKDwoKCkgPT4gdm9pZCkgPiB0ZWFyZG93bik7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoc3Vic2NyaXB0aW9uLmNsb3NlZCB8fCB0eXBlb2Ygc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN1YnNjcmlwdGlvbi5fYWRkUGFyZW50ICE9PSAnZnVuY3Rpb24nIC8qIHF1YWNrIHF1YWNrICovKSB7XG4gICAgICAgICAgY29uc3QgdG1wID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICBzdWJzY3JpcHRpb24uX3N1YnNjcmlwdGlvbnMgPSBbdG1wXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHRlYXJkb3duICcgKyB0ZWFyZG93biArICcgYWRkZWQgdG8gU3Vic2NyaXB0aW9uLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zIHx8ICh0aGlzLl9zdWJzY3JpcHRpb25zID0gW10pO1xuXG4gICAgc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgc3Vic2NyaXB0aW9uLl9hZGRQYXJlbnQodGhpcyk7XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBTdWJzY3JpcHRpb24gZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBzdWJzY3JpcHRpb25zIHRoYXQgd2lsbFxuICAgKiB1bnN1YnNjcmliZSBkdXJpbmcgdGhlIHVuc3Vic2NyaWJlIHByb2Nlc3Mgb2YgdGhpcyBTdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7U3Vic2NyaXB0aW9ufSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiB0byByZW1vdmUuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICByZW1vdmUoc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5fc3Vic2NyaXB0aW9ucztcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uSW5kZXggPSBzdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9uKTtcbiAgICAgIGlmIChzdWJzY3JpcHRpb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5zcGxpY2Uoc3Vic2NyaXB0aW9uSW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfYWRkUGFyZW50KHBhcmVudDogU3Vic2NyaXB0aW9uKSB7XG4gICAgbGV0IHsgX3BhcmVudCwgX3BhcmVudHMgfSA9IHRoaXM7XG4gICAgaWYgKCFfcGFyZW50IHx8IF9wYXJlbnQgPT09IHBhcmVudCkge1xuICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHBhcmVudCwgb3IgdGhlIG5ldyBwYXJlbnQgaXMgdGhlIHNhbWUgYXMgdGhlXG4gICAgICAvLyBjdXJyZW50IHBhcmVudCwgdGhlbiBzZXQgdGhpcy5fcGFyZW50IHRvIHRoZSBuZXcgcGFyZW50LlxuICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIH0gZWxzZSBpZiAoIV9wYXJlbnRzKSB7XG4gICAgICAvLyBJZiB0aGVyZSdzIGFscmVhZHkgb25lIHBhcmVudCwgYnV0IG5vdCBtdWx0aXBsZSwgYWxsb2NhdGUgYW4gQXJyYXkgdG9cbiAgICAgIC8vIHN0b3JlIHRoZSByZXN0IG9mIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9ucy5cbiAgICAgIHRoaXMuX3BhcmVudHMgPSBbcGFyZW50XTtcbiAgICB9IGVsc2UgaWYgKF9wYXJlbnRzLmluZGV4T2YocGFyZW50KSA9PT0gLTEpIHtcbiAgICAgIC8vIE9ubHkgYWRkIHRoZSBuZXcgcGFyZW50IHRvIHRoZSBfcGFyZW50cyBsaXN0IGlmIGl0J3Mgbm90IGFscmVhZHkgdGhlcmUuXG4gICAgICBfcGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvcnM6IGFueVtdKSB7XG4gcmV0dXJuIGVycm9ycy5yZWR1Y2UoKGVycnMsIGVycikgPT4gZXJycy5jb25jYXQoKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpID8gZXJyLmVycm9ycyA6IGVyciksIFtdKTtcbn1cbiIsImV4cG9ydCBjb25zdCByeFN1YnNjcmliZXIgPVxuICAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLmZvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICA/IFN5bWJvbC5mb3IoJ3J4U3Vic2NyaWJlcicpXG4gICAgOiAnQEByeFN1YnNjcmliZXInO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSByeFN1YnNjcmliZXIgaW5zdGVhZFxuICovXG5leHBvcnQgY29uc3QgJCRyeFN1YnNjcmliZXIgPSByeFN1YnNjcmliZXI7XG4iLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZW1wdHkgYXMgZW1wdHlPYnNlcnZlciB9IGZyb20gJy4vT2JzZXJ2ZXInO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UgYW5kIGV4dGVuZHMgdGhlXG4gKiB7QGxpbmsgU3Vic2NyaXB0aW9ufSBjbGFzcy4gV2hpbGUgdGhlIHtAbGluayBPYnNlcnZlcn0gaXMgdGhlIHB1YmxpYyBBUEkgZm9yXG4gKiBjb25zdW1pbmcgdGhlIHZhbHVlcyBvZiBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0sIGFsbCBPYnNlcnZlcnMgZ2V0IGNvbnZlcnRlZCB0b1xuICogYSBTdWJzY3JpYmVyLCBpbiBvcmRlciB0byBwcm92aWRlIFN1YnNjcmlwdGlvbi1saWtlIGNhcGFiaWxpdGllcyBzdWNoIGFzXG4gKiBgdW5zdWJzY3JpYmVgLiBTdWJzY3JpYmVyIGlzIGEgY29tbW9uIHR5cGUgaW4gUnhKUywgYW5kIGNydWNpYWwgZm9yXG4gKiBpbXBsZW1lbnRpbmcgb3BlcmF0b3JzLCBidXQgaXQgaXMgcmFyZWx5IHVzZWQgYXMgYSBwdWJsaWMgQVBJLlxuICpcbiAqIEBjbGFzcyBTdWJzY3JpYmVyPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgT2JzZXJ2ZXI8VD4ge1xuXG4gIFtyeFN1YnNjcmliZXJTeW1ib2xdKCkgeyByZXR1cm4gdGhpczsgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBmYWN0b3J5IGZvciBhIFN1YnNjcmliZXIsIGdpdmVuIGEgKHBvdGVudGlhbGx5IHBhcnRpYWwpIGRlZmluaXRpb25cbiAgICogb2YgYW4gT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oeDogP1QpOiB2b2lkfSBbbmV4dF0gVGhlIGBuZXh0YCBjYWxsYmFjayBvZiBhbiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlOiA/YW55KTogdm9pZH0gW2Vycm9yXSBUaGUgYGVycm9yYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIFRoZSBgY29tcGxldGVgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpYmVyPFQ+fSBBIFN1YnNjcmliZXIgd3JhcHBpbmcgdGhlIChwYXJ0aWFsbHkgZGVmaW5lZClcbiAgICogT2JzZXJ2ZXIgcmVwcmVzZW50ZWQgYnkgdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGU8VD4obmV4dD86ICh4PzogVCkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHN1YnNjcmliZXIgPSBuZXcgU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIHN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH1cblxuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclZhbHVlOiBhbnkgPSBudWxsO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93bjogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBpc1N0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8YW55PjsgLy8gdGhpcyBgYW55YCBpcyB0aGUgZXNjYXBlIGhhdGNoIHRvIGVyYXNlIGV4dHJhIHR5cGUgcGFyYW0gKGUuZy4gUilcblxuICAvKipcbiAgICogQHBhcmFtIHtPYnNlcnZlcnxmdW5jdGlvbih2YWx1ZTogVCk6IHZvaWR9IFtkZXN0aW5hdGlvbk9yTmV4dF0gQSBwYXJ0aWFsbHlcbiAgICogZGVmaW5lZCBPYnNlcnZlciBvciBhIGBuZXh0YCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlOiA/YW55KTogdm9pZH0gW2Vycm9yXSBUaGUgYGVycm9yYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIFRoZSBgY29tcGxldGVgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb25Pck5leHQ/OiBQYXJ0aWFsT2JzZXJ2ZXI8YW55PiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBlbXB0eU9ic2VydmVyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvbk9yTmV4dCkge1xuICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBlbXB0eU9ic2VydmVyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25Pck5leHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy8gSEFDSyhiZW5sZXNoKTogRm9yIHNpdHVhdGlvbnMgd2hlcmUgTm9kZSBoYXMgbXVsdGlwbGUgY29waWVzIG9mIHJ4anMgaW5cbiAgICAgICAgICAvLyBub2RlX21vZHVsZXMsIHdlIGNhbm5vdCByZWx5IG9uIGBpbnN0YW5jZW9mYCBjaGVja3NcbiAgICAgICAgICBpZiAoaXNUcnVzdGVkU3Vic2NyaWJlcihkZXN0aW5hdGlvbk9yTmV4dCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRydXN0ZWRTdWJzY3JpYmVyID0gZGVzdGluYXRpb25Pck5leHRbcnhTdWJzY3JpYmVyU3ltYm9sXSgpIGFzIFN1YnNjcmliZXI8YW55PjtcbiAgICAgICAgICAgIHRoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gdHJ1c3RlZFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHRydXN0ZWRTdWJzY3JpYmVyO1xuICAgICAgICAgICAgdHJ1c3RlZFN1YnNjcmliZXIuYWRkKHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyPFQ+KHRoaXMsIDxQYXJ0aWFsT2JzZXJ2ZXI8YW55Pj4gZGVzdGluYXRpb25Pck5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyPFQ+KHRoaXMsIDwoKHZhbHVlOiBUKSA9PiB2b2lkKT4gZGVzdGluYXRpb25Pck5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFjayB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgb2YgdHlwZSBgbmV4dGAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZSwgd2l0aCBhIHZhbHVlLiBUaGUgT2JzZXJ2YWJsZSBtYXkgY2FsbCB0aGlzIG1ldGhvZCAwIG9yIG1vcmVcbiAgICogdGltZXMuXG4gICAqIEBwYXJhbSB7VH0gW3ZhbHVlXSBUaGUgYG5leHRgIHZhbHVlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgbmV4dCh2YWx1ZT86IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYGVycm9yYCBmcm9tXG4gICAqIHRoZSBPYnNlcnZhYmxlLCB3aXRoIGFuIGF0dGFjaGVkIGBFcnJvcmAuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0XG4gICAqIHRoZSBPYnNlcnZhYmxlIGhhcyBleHBlcmllbmNlZCBhbiBlcnJvciBjb25kaXRpb24uXG4gICAqIEBwYXJhbSB7YW55fSBbZXJyXSBUaGUgYGVycm9yYCBleGNlcHRpb24uXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBlcnJvcihlcnI/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLl9lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFjayB0byByZWNlaXZlIGEgdmFsdWVsZXNzIG5vdGlmaWNhdGlvbiBvZiB0eXBlXG4gICAqIGBjb21wbGV0ZWAgZnJvbSB0aGUgT2JzZXJ2YWJsZS4gTm90aWZpZXMgdGhlIE9ic2VydmVyIHRoYXQgdGhlIE9ic2VydmFibGVcbiAgICogaGFzIGZpbmlzaGVkIHNlbmRpbmcgcHVzaC1iYXNlZCBub3RpZmljYXRpb25zLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICB1bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTogU3Vic2NyaWJlcjxUPiB7XG4gICAgY29uc3QgeyBfcGFyZW50LCBfcGFyZW50cyB9ID0gdGhpcztcbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudHMgPSBudWxsO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGFyZW50ID0gX3BhcmVudDtcbiAgICB0aGlzLl9wYXJlbnRzID0gX3BhcmVudHM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNhZmVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcmVudFN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgbmV4dDogKCh2YWx1ZTogVCkgPT4gdm9pZCk7XG4gICAgbGV0IGNvbnRleHQ6IGFueSA9IHRoaXM7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkpIHtcbiAgICAgIG5leHQgPSAoPCgodmFsdWU6IFQpID0+IHZvaWQpPiBvYnNlcnZlck9yTmV4dCk7XG4gICAgfSBlbHNlIGlmIChvYnNlcnZlck9yTmV4dCkge1xuICAgICAgbmV4dCA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkubmV4dDtcbiAgICAgIGVycm9yID0gKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+IG9ic2VydmVyT3JOZXh0KS5lcnJvcjtcbiAgICAgIGNvbXBsZXRlID0gKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+IG9ic2VydmVyT3JOZXh0KS5jb21wbGV0ZTtcbiAgICAgIGlmIChvYnNlcnZlck9yTmV4dCAhPT0gZW1wdHlPYnNlcnZlcikge1xuICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShvYnNlcnZlck9yTmV4dCk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQudW5zdWJzY3JpYmUpKSB7XG4gICAgICAgICAgdGhpcy5hZGQoPCgpID0+IHZvaWQ+IGNvbnRleHQudW5zdWJzY3JpYmUuYmluZChjb250ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC51bnN1YnNjcmliZSA9IHRoaXMudW5zdWJzY3JpYmUuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLl9uZXh0ID0gbmV4dDtcbiAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogVCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQgJiYgdGhpcy5fbmV4dCkge1xuICAgICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9uZXh0LCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX190cnlPclNldEVycm9yKF9wYXJlbnRTdWJzY3JpYmVyLCB0aGlzLl9uZXh0LCB2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycj86IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBjb25zdCB7IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfSA9IGNvbmZpZztcbiAgICAgIGlmICh0aGlzLl9lcnJvcikge1xuICAgICAgICBpZiAoIXVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgIHRoaXMuX190cnlPclVuc3ViKHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgdGhpcy5fZXJyb3IsIGVycik7XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgICAgX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVmFsdWUgPSBlcnI7XG4gICAgICAgICAgX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICAgIGlmICh0aGlzLl9jb21wbGV0ZSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkQ29tcGxldGUgPSAoKSA9PiB0aGlzLl9jb21wbGV0ZS5jYWxsKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgIHRoaXMuX190cnlPclVuc3ViKHdyYXBwZWRDb21wbGV0ZSk7XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX190cnlPclNldEVycm9yKF9wYXJlbnRTdWJzY3JpYmVyLCB3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX190cnlPclVuc3ViKGZuOiBGdW5jdGlvbiwgdmFsdWU/OiBhbnkpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgZm4uY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfX3RyeU9yU2V0RXJyb3IocGFyZW50OiBTdWJzY3JpYmVyPFQ+LCBmbjogRnVuY3Rpb24sIHZhbHVlPzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCFjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgY2FsbCcpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgZm4uY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgcGFyZW50LnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICBwYXJlbnQuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgdGhpcy5fY29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5fcGFyZW50U3Vic2NyaWJlciA9IG51bGw7XG4gICAgX3BhcmVudFN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1RydXN0ZWRTdWJzY3JpYmVyKG9iajogYW55KSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBTdWJzY3JpYmVyIHx8ICgnc3luY0Vycm9yVGhyb3dhYmxlJyBpbiBvYmogJiYgb2JqW3J4U3Vic2NyaWJlclN5bWJvbF0pO1xufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuaW1wb3J0IHsgZW1wdHkgYXMgZW1wdHlPYnNlcnZlciB9IGZyb20gJy4uL09ic2VydmVyJztcbmltcG9ydCB7IFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHRvU3Vic2NyaWJlcjxUPihcbiAgbmV4dE9yT2JzZXJ2ZXI/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZCxcbiAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaWJlcjxUPiB7XG5cbiAgaWYgKG5leHRPck9ic2VydmVyKSB7XG4gICAgaWYgKG5leHRPck9ic2VydmVyIGluc3RhbmNlb2YgU3Vic2NyaWJlcikge1xuICAgICAgcmV0dXJuICg8U3Vic2NyaWJlcjxUPj4gbmV4dE9yT2JzZXJ2ZXIpO1xuICAgIH1cblxuICAgIGlmIChuZXh0T3JPYnNlcnZlcltyeFN1YnNjcmliZXJTeW1ib2xdKSB7XG4gICAgICByZXR1cm4gbmV4dE9yT2JzZXJ2ZXJbcnhTdWJzY3JpYmVyU3ltYm9sXSgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghbmV4dE9yT2JzZXJ2ZXIgJiYgIWVycm9yICYmICFjb21wbGV0ZSkge1xuICAgIHJldHVybiBuZXcgU3Vic2NyaWJlcihlbXB0eU9ic2VydmVyKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3Vic2NyaWJlcihuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKTtcbn1cbiIsImltcG9ydCB7IHJvb3QgfSBmcm9tICcuLi91dGlsL3Jvb3QnO1xuXG4vKiogU3ltYm9sLm9ic2VydmFibGUgYWRkaXRpb24gKi9cbi8qIE5vdGU6IFRoaXMgd2lsbCBhZGQgU3ltYm9sLm9ic2VydmFibGUgZ2xvYmFsbHkgZm9yIGFsbCBUeXBlU2NyaXB0IHVzZXJzLFxuICBob3dldmVyLCB3ZSBhcmUgbm8gbG9uZ2VyIHBvbHlmaWxsaW5nIFN5bWJvbC5vYnNlcnZhYmxlICovXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBTeW1ib2xDb25zdHJ1Y3RvciB7XG4gICAgcmVhZG9ubHkgb2JzZXJ2YWJsZTogc3ltYm9sO1xuICB9XG59XG5cbi8qKiBTeW1ib2wub2JzZXJ2YWJsZSBvciBhIHN0cmluZyBcIkBAb2JzZXJ2YWJsZVwiLiBVc2VkIGZvciBpbnRlcm9wICovXG5leHBvcnQgY29uc3Qgb2JzZXJ2YWJsZSA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUgfHwgJ0BAb2JzZXJ2YWJsZSc7XG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1lbXB0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IH1cbiIsImltcG9ydCB7IG5vb3AgfSBmcm9tICcuL25vb3AnO1xuaW1wb3J0IHsgVW5hcnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gcGlwZTxUPigpOiBVbmFyeUZ1bmN0aW9uPFQsIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQT4ob3AxOiBVbmFyeUZ1bmN0aW9uPFQsIEE+KTogVW5hcnlGdW5jdGlvbjxULCBBPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEI+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+KTogVW5hcnlGdW5jdGlvbjxULCBCPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEM+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4pOiBVbmFyeUZ1bmN0aW9uPFQsIEM+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRD4ob3AxOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBvcDI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIG9wMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgb3A0OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+KTogVW5hcnlGdW5jdGlvbjxULCBEPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEU+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgb3A1OiBVbmFyeUZ1bmN0aW9uPEQsIEU+KTogVW5hcnlGdW5jdGlvbjxULCBFPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEY+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgb3A1OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBvcDY6IFVuYXJ5RnVuY3Rpb248RSwgRj4pOiBVbmFyeUZ1bmN0aW9uPFQsIEY+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRiwgRz4ob3AxOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBvcDI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIG9wMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgb3A0OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBvcDU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIG9wNjogVW5hcnlGdW5jdGlvbjxFLCBGPiwgb3A3OiBVbmFyeUZ1bmN0aW9uPEYsIEc+KTogVW5hcnlGdW5jdGlvbjxULCBHPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEYsIEcsIEg+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgb3A1OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBvcDY6IFVuYXJ5RnVuY3Rpb248RSwgRj4sIG9wNzogVW5hcnlGdW5jdGlvbjxGLCBHPiwgb3A4OiBVbmFyeUZ1bmN0aW9uPEcsIEg+KTogVW5hcnlGdW5jdGlvbjxULCBIPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEYsIEcsIEgsIEk+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgb3A1OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBvcDY6IFVuYXJ5RnVuY3Rpb248RSwgRj4sIG9wNzogVW5hcnlGdW5jdGlvbjxGLCBHPiwgb3A4OiBVbmFyeUZ1bmN0aW9uPEcsIEg+LCBvcDk6IFVuYXJ5RnVuY3Rpb248SCwgST4pOiBVbmFyeUZ1bmN0aW9uPFQsIEk+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgUj4oLi4uZm5zOiBBcnJheTxVbmFyeUZ1bmN0aW9uPFQsIFI+Pik6IFVuYXJ5RnVuY3Rpb248VCwgUj4ge1xuICByZXR1cm4gcGlwZUZyb21BcnJheShmbnMpO1xufVxuXG4vKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBwaXBlRnJvbUFycmF5PFQsIFI+KGZuczogQXJyYXk8VW5hcnlGdW5jdGlvbjxULCBSPj4pOiBVbmFyeUZ1bmN0aW9uPFQsIFI+IHtcbiAgaWYgKCFmbnMpIHtcbiAgICByZXR1cm4gbm9vcCBhcyBVbmFyeUZ1bmN0aW9uPGFueSwgYW55PjtcbiAgfVxuXG4gIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZuc1swXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dDogVCk6IFIge1xuICAgIHJldHVybiBmbnMucmVkdWNlKChwcmV2OiBhbnksIGZuOiBVbmFyeUZ1bmN0aW9uPFQsIFI+KSA9PiBmbihwcmV2KSwgaW5wdXQgYXMgYW55KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMsIE9wZXJhdG9yRnVuY3Rpb24sIFBhcnRpYWxPYnNlcnZlciwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyB0b1N1YnNjcmliZXIgfSBmcm9tICcuL3V0aWwvdG9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlpZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9paWYnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwaXBlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYW55IHNldCBvZiB2YWx1ZXMgb3ZlciBhbnkgYW1vdW50IG9mIHRpbWUuIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgYnVpbGRpbmcgYmxvY2tcbiAqIG9mIFJ4SlMuXG4gKlxuICogQGNsYXNzIE9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpYmFibGU8VD4ge1xuXG4gIC8qKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UgZGlyZWN0bHkuICovXG4gIHB1YmxpYyBfaXNTY2FsYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIHNvdXJjZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgb3BlcmF0b3I6IE9wZXJhdG9yPGFueSwgVD47XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmUgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIE9ic2VydmFibGUgaXNcbiAgICogaW5pdGlhbGx5IHN1YnNjcmliZWQgdG8uIFRoaXMgZnVuY3Rpb24gaXMgZ2l2ZW4gYSBTdWJzY3JpYmVyLCB0byB3aGljaCBuZXcgdmFsdWVzXG4gICAqIGNhbiBiZSBgbmV4dGBlZCwgb3IgYW4gYGVycm9yYCBtZXRob2QgY2FuIGJlIGNhbGxlZCB0byByYWlzZSBhbiBlcnJvciwgb3JcbiAgICogYGNvbXBsZXRlYCBjYW4gYmUgY2FsbGVkIHRvIG5vdGlmeSBvZiBhIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmliZT86ICh0aGlzOiBPYnNlcnZhYmxlPFQ+LCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiBUZWFyZG93bkxvZ2ljKSB7XG4gICAgaWYgKHN1YnNjcmliZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhBQ0s6IFNpbmNlIFR5cGVTY3JpcHQgaW5oZXJpdHMgc3RhdGljIHByb3BlcnRpZXMgdG9vLCB3ZSBoYXZlIHRvXG4gIC8vIGZpZ2h0IGFnYWluc3QgVHlwZVNjcmlwdCBoZXJlIHNvIFN1YmplY3QgY2FuIGhhdmUgYSBkaWZmZXJlbnQgc3RhdGljIGNyZWF0ZSBzaWduYXR1cmVcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29sZCBPYnNlcnZhYmxlIGJ5IGNhbGxpbmcgdGhlIE9ic2VydmFibGUgY29uc3RydWN0b3JcbiAgICogQHN0YXRpYyB0cnVlXG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZT8gdGhlIHN1YnNjcmliZXIgZnVuY3Rpb24gdG8gYmUgcGFzc2VkIHRvIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IGNvbGQgb2JzZXJ2YWJsZVxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oc3Vic2NyaWJlPzogKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IFRlYXJkb3duTG9naWMpID0+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9ic2VydmFibGUsIHdpdGggdGhpcyBPYnNlcnZhYmxlIGFzIHRoZSBzb3VyY2UsIGFuZCB0aGUgcGFzc2VkXG4gICAqIG9wZXJhdG9yIGRlZmluZWQgYXMgdGhlIG5ldyBvYnNlcnZhYmxlJ3Mgb3BlcmF0b3IuXG4gICAqIEBtZXRob2QgbGlmdFxuICAgKiBAcGFyYW0ge09wZXJhdG9yfSBvcGVyYXRvciB0aGUgb3BlcmF0b3IgZGVmaW5pbmcgdGhlIG9wZXJhdGlvbiB0byB0YWtlIG9uIHRoZSBvYnNlcnZhYmxlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IG9ic2VydmFibGUgd2l0aCB0aGUgT3BlcmF0b3IgYXBwbGllZFxuICAgKi9cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8Uj4oKTtcbiAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgb2JzZXJ2YWJsZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgc3Vic2NyaWJlKG9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+KTogU3Vic2NyaXB0aW9uO1xuICBzdWJzY3JpYmUobmV4dD86ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xuICAvKipcbiAgICogSW52b2tlcyBhbiBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZSBhbmQgcmVnaXN0ZXJzIE9ic2VydmVyIGhhbmRsZXJzIGZvciBub3RpZmljYXRpb25zIGl0IHdpbGwgZW1pdC5cbiAgICpcbiAgICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCB3aGVuIHlvdSBoYXZlIGFsbCB0aGVzZSBPYnNlcnZhYmxlcywgYnV0IHN0aWxsIG5vdGhpbmcgaXMgaGFwcGVuaW5nLjwvc3Bhbj5cbiAgICpcbiAgICogYHN1YnNjcmliZWAgaXMgbm90IGEgcmVndWxhciBvcGVyYXRvciwgYnV0IGEgbWV0aG9kIHRoYXQgY2FsbHMgT2JzZXJ2YWJsZSdzIGludGVybmFsIGBzdWJzY3JpYmVgIGZ1bmN0aW9uLiBJdFxuICAgKiBtaWdodCBiZSBmb3IgZXhhbXBsZSBhIGZ1bmN0aW9uIHRoYXQgeW91IHBhc3NlZCB0byBPYnNlcnZhYmxlJ3MgY29uc3RydWN0b3IsIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIGl0IGlzXG4gICAqIGEgbGlicmFyeSBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggZGVmaW5lcyB3aGF0IHdpbGwgYmUgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlLCBhbmQgd2hlbiBpdCBiZSB3aWxsIGVtaXR0ZWQuIFRoaXMgbWVhbnNcbiAgICogdGhhdCBjYWxsaW5nIGBzdWJzY3JpYmVgIGlzIGFjdHVhbGx5IHRoZSBtb21lbnQgd2hlbiBPYnNlcnZhYmxlIHN0YXJ0cyBpdHMgd29yaywgbm90IHdoZW4gaXQgaXMgY3JlYXRlZCwgYXMgaXQgaXMgb2Z0ZW5cbiAgICogdGhlIHRob3VnaHQuXG4gICAqXG4gICAqIEFwYXJ0IGZyb20gc3RhcnRpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlLCB0aGlzIG1ldGhvZCBhbGxvd3MgeW91IHRvIGxpc3RlbiBmb3IgdmFsdWVzXG4gICAqIHRoYXQgYW4gT2JzZXJ2YWJsZSBlbWl0cywgYXMgd2VsbCBhcyBmb3Igd2hlbiBpdCBjb21wbGV0ZXMgb3IgZXJyb3JzLiBZb3UgY2FuIGFjaGlldmUgdGhpcyBpbiB0d29cbiAgICogb2YgdGhlIGZvbGxvd2luZyB3YXlzLlxuICAgKlxuICAgKiBUaGUgZmlyc3Qgd2F5IGlzIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UuIEl0IHNob3VsZCBoYXZlIG1ldGhvZHNcbiAgICogZGVmaW5lZCBieSB0aGF0IGludGVyZmFjZSwgYnV0IG5vdGUgdGhhdCBpdCBzaG91bGQgYmUganVzdCBhIHJlZ3VsYXIgSmF2YVNjcmlwdCBvYmplY3QsIHdoaWNoIHlvdSBjYW4gY3JlYXRlXG4gICAqIHlvdXJzZWxmIGluIGFueSB3YXkgeW91IHdhbnQgKEVTNiBjbGFzcywgY2xhc3NpYyBmdW5jdGlvbiBjb25zdHJ1Y3Rvciwgb2JqZWN0IGxpdGVyYWwgZXRjLikuIEluIHBhcnRpY3VsYXIgZG9cbiAgICogbm90IGF0dGVtcHQgdG8gdXNlIGFueSBSeEpTIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gY3JlYXRlIE9ic2VydmVycyAtIHlvdSBkb24ndCBuZWVkIHRoZW0uIFJlbWVtYmVyIGFsc29cbiAgICogdGhhdCB5b3VyIG9iamVjdCBkb2VzIG5vdCBoYXZlIHRvIGltcGxlbWVudCBhbGwgbWV0aG9kcy4gSWYgeW91IGZpbmQgeW91cnNlbGYgY3JlYXRpbmcgYSBtZXRob2QgdGhhdCBkb2Vzbid0XG4gICAqIGRvIGFueXRoaW5nLCB5b3UgY2FuIHNpbXBseSBvbWl0IGl0LiBOb3RlIGhvd2V2ZXIsIGlmIHRoZSBgZXJyb3JgIG1ldGhvZCBpcyBub3QgcHJvdmlkZWQsIGFsbCBlcnJvcnMgd2lsbFxuICAgKiBiZSBsZWZ0IHVuY2F1Z2h0LlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIHdheSBpcyB0byBnaXZlIHVwIG9uIE9ic2VydmVyIG9iamVjdCBhbHRvZ2V0aGVyIGFuZCBzaW1wbHkgcHJvdmlkZSBjYWxsYmFjayBmdW5jdGlvbnMgaW4gcGxhY2Ugb2YgaXRzIG1ldGhvZHMuXG4gICAqIFRoaXMgbWVhbnMgeW91IGNhbiBwcm92aWRlIHRocmVlIGZ1bmN0aW9ucyBhcyBhcmd1bWVudHMgdG8gYHN1YnNjcmliZWAsIHdoZXJlIHRoZSBmaXJzdCBmdW5jdGlvbiBpcyBlcXVpdmFsZW50XG4gICAqIG9mIGEgYG5leHRgIG1ldGhvZCwgdGhlIHNlY29uZCBvZiBhbiBgZXJyb3JgIG1ldGhvZCBhbmQgdGhlIHRoaXJkIG9mIGEgYGNvbXBsZXRlYCBtZXRob2QuIEp1c3QgYXMgaW4gY2FzZSBvZiBPYnNlcnZlcixcbiAgICogaWYgeW91IGRvIG5vdCBuZWVkIHRvIGxpc3RlbiBmb3Igc29tZXRoaW5nLCB5b3UgY2FuIG9taXQgYSBmdW5jdGlvbiwgcHJlZmVyYWJseSBieSBwYXNzaW5nIGB1bmRlZmluZWRgIG9yIGBudWxsYCxcbiAgICogc2luY2UgYHN1YnNjcmliZWAgcmVjb2duaXplcyB0aGVzZSBmdW5jdGlvbnMgYnkgd2hlcmUgdGhleSB3ZXJlIHBsYWNlZCBpbiBmdW5jdGlvbiBjYWxsLiBXaGVuIGl0IGNvbWVzXG4gICAqIHRvIGBlcnJvcmAgZnVuY3Rpb24sIGp1c3QgYXMgYmVmb3JlLCBpZiBub3QgcHJvdmlkZWQsIGVycm9ycyBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUgd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIFdoaWNoZXZlciBzdHlsZSBvZiBjYWxsaW5nIGBzdWJzY3JpYmVgIHlvdSB1c2UsIGluIGJvdGggY2FzZXMgaXQgcmV0dXJucyBhIFN1YnNjcmlwdGlvbiBvYmplY3QuXG4gICAqIFRoaXMgb2JqZWN0IGFsbG93cyB5b3UgdG8gY2FsbCBgdW5zdWJzY3JpYmVgIG9uIGl0LCB3aGljaCBpbiB0dXJuIHdpbGwgc3RvcCB0aGUgd29yayB0aGF0IGFuIE9ic2VydmFibGUgZG9lcyBhbmQgd2lsbCBjbGVhblxuICAgKiB1cCBhbGwgcmVzb3VyY2VzIHRoYXQgYW4gT2JzZXJ2YWJsZSB1c2VkLiBOb3RlIHRoYXQgY2FuY2VsbGluZyBhIHN1YnNjcmlwdGlvbiB3aWxsIG5vdCBjYWxsIGBjb21wbGV0ZWAgY2FsbGJhY2tcbiAgICogcHJvdmlkZWQgdG8gYHN1YnNjcmliZWAgZnVuY3Rpb24sIHdoaWNoIGlzIHJlc2VydmVkIGZvciBhIHJlZ3VsYXIgY29tcGxldGlvbiBzaWduYWwgdGhhdCBjb21lcyBmcm9tIGFuIE9ic2VydmFibGUuXG4gICAqXG4gICAqIFJlbWVtYmVyIHRoYXQgY2FsbGJhY2tzIHByb3ZpZGVkIHRvIGBzdWJzY3JpYmVgIGFyZSBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWQgYXN5bmNocm9ub3VzbHkuXG4gICAqIEl0IGlzIGFuIE9ic2VydmFibGUgaXRzZWxmIHRoYXQgZGVjaWRlcyB3aGVuIHRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZC4gRm9yIGV4YW1wbGUge0BsaW5rIG9mfVxuICAgKiBieSBkZWZhdWx0IGVtaXRzIGFsbCBpdHMgdmFsdWVzIHN5bmNocm9ub3VzbHkuIEFsd2F5cyBjaGVjayBkb2N1bWVudGF0aW9uIGZvciBob3cgZ2l2ZW4gT2JzZXJ2YWJsZVxuICAgKiB3aWxsIGJlaGF2ZSB3aGVuIHN1YnNjcmliZWQgYW5kIGlmIGl0cyBkZWZhdWx0IGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCB3aXRoIGEgYHNjaGVkdWxlcmAuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGFuIE9ic2VydmVyXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3VtT2JzZXJ2ZXIgPSB7XG4gICAqICAgc3VtOiAwLFxuICAgKiAgIG5leHQodmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICB0aGlzLnN1bSA9IHRoaXMuc3VtICsgdmFsdWU7XG4gICAqICAgfSxcbiAgICogICBlcnJvcigpIHsgLy8gV2UgYWN0dWFsbHkgY291bGQganVzdCByZW1vdmUgdGhpcyBtZXRob2QsXG4gICAqICAgfSwgICAgICAgIC8vIHNpbmNlIHdlIGRvIG5vdCByZWFsbHkgY2FyZSBhYm91dCBlcnJvcnMgcmlnaHQgbm93LlxuICAgKiAgIGNvbXBsZXRlKCkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1N1bSBlcXVhbHM6ICcgKyB0aGlzLnN1bSk7XG4gICAqICAgfVxuICAgKiB9O1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpIC8vIFN5bmNocm9ub3VzbHkgZW1pdHMgMSwgMiwgMyBhbmQgdGhlbiBjb21wbGV0ZXMuXG4gICAqIC5zdWJzY3JpYmUoc3VtT2JzZXJ2ZXIpO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcIkFkZGluZzogMVwiXG4gICAqIC8vIFwiQWRkaW5nOiAyXCJcbiAgICogLy8gXCJBZGRpbmc6IDNcIlxuICAgKiAvLyBcIlN1bSBlcXVhbHM6IDZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGZ1bmN0aW9uc1xuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGxldCBzdW0gPSAwO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpXG4gICAqIC5zdWJzY3JpYmUoXG4gICAqICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICBzdW0gPSBzdW0gKyB2YWx1ZTtcbiAgICogICB9LFxuICAgKiAgIHVuZGVmaW5lZCxcbiAgICogICBmdW5jdGlvbigpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdTdW0gZXF1YWxzOiAnICsgc3VtKTtcbiAgICogICB9XG4gICAqICk7XG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIFwiQWRkaW5nOiAxXCJcbiAgICogLy8gXCJBZGRpbmc6IDJcIlxuICAgKiAvLyBcIkFkZGluZzogM1wiXG4gICAqIC8vIFwiU3VtIGVxdWFsczogNlwiXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgQ2FuY2VsIGEgc3Vic2NyaXB0aW9uXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3Vic2NyaXB0aW9uID0gUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDAwKS5zdWJzY3JpYmUoXG4gICAqICAgbnVtID0+IGNvbnNvbGUubG9nKG51bSksXG4gICAqICAgdW5kZWZpbmVkLFxuICAgKiAgICgpID0+IGNvbnNvbGUubG9nKCdjb21wbGV0ZWQhJykgLy8gV2lsbCBub3QgYmUgY2FsbGVkLCBldmVuXG4gICAqICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGNhbmNlbGxpbmcgc3Vic2NyaXB0aW9uXG4gICAqXG4gICAqXG4gICAqIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgKiAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgKiAgIGNvbnNvbGUubG9nKCd1bnN1YnNjcmliZWQhJyk7XG4gICAqIH0sIDI1MDApO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyAwIGFmdGVyIDFzXG4gICAqIC8vIDEgYWZ0ZXIgMnNcbiAgICogLy8gXCJ1bnN1YnNjcmliZWQhXCIgYWZ0ZXIgMi41c1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtPYnNlcnZlcnxGdW5jdGlvbn0gb2JzZXJ2ZXJPck5leHQgKG9wdGlvbmFsKSBFaXRoZXIgYW4gb2JzZXJ2ZXIgd2l0aCBtZXRob2RzIHRvIGJlIGNhbGxlZCxcbiAgICogIG9yIHRoZSBmaXJzdCBvZiB0aHJlZSBwb3NzaWJsZSBoYW5kbGVycywgd2hpY2ggaXMgdGhlIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBmcm9tIHRoZSBzdWJzY3JpYmVkXG4gICAqICBPYnNlcnZhYmxlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcnJvciAob3B0aW9uYWwpIEEgaGFuZGxlciBmb3IgYSB0ZXJtaW5hbCBldmVudCByZXN1bHRpbmcgZnJvbSBhbiBlcnJvci4gSWYgbm8gZXJyb3IgaGFuZGxlciBpcyBwcm92aWRlZCxcbiAgICogIHRoZSBlcnJvciB3aWxsIGJlIHRocm93biBhcyB1bmhhbmRsZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBsZXRlIChvcHRpb25hbCkgQSBoYW5kbGVyIGZvciBhIHRlcm1pbmFsIGV2ZW50IHJlc3VsdGluZyBmcm9tIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICogQHJldHVybiB7SVN1YnNjcmlwdGlvbn0gYSBzdWJzY3JpcHRpb24gcmVmZXJlbmNlIHRvIHRoZSByZWdpc3RlcmVkIGhhbmRsZXJzXG4gICAqIEBtZXRob2Qgc3Vic2NyaWJlXG4gICAqL1xuICBzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQ/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpcHRpb24ge1xuXG4gICAgY29uc3QgeyBvcGVyYXRvciB9ID0gdGhpcztcbiAgICBjb25zdCBzaW5rID0gdG9TdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuXG4gICAgaWYgKG9wZXJhdG9yKSB7XG4gICAgICBvcGVyYXRvci5jYWxsKHNpbmssIHRoaXMuc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2luay5hZGQoXG4gICAgICAgIHRoaXMuc291cmNlIHx8IChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZyAmJiAhc2luay5zeW5jRXJyb3JUaHJvd2FibGUpID9cbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKHNpbmspIDpcbiAgICAgICAgdGhpcy5fdHJ5U3Vic2NyaWJlKHNpbmspXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgaWYgKHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93bikge1xuICAgICAgICAgIHRocm93IHNpbmsuc3luY0Vycm9yVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2luaztcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3RyeVN1YnNjcmliZShzaW5rOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoc2luayk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgc2luay5zeW5jRXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICBzaW5rLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgfVxuICAgICAgc2luay5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGZvckVhY2hcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dCBhIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcGFyYW0ge1Byb21pc2VDb25zdHJ1Y3Rvcn0gW3Byb21pc2VDdG9yXSBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIFByb21pc2VcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgZWl0aGVyIHJlc29sdmVzIG9uIG9ic2VydmFibGUgY29tcGxldGlvbiBvclxuICAgKiAgcmVqZWN0cyB3aXRoIHRoZSBoYW5kbGVkIGVycm9yXG4gICAqL1xuICBmb3JFYWNoKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcHJvbWlzZUN0b3I/OiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG5cbiAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE11c3QgYmUgZGVjbGFyZWQgaW4gYSBzZXBhcmF0ZSBzdGF0ZW1lbnQgdG8gYXZvaWQgYSBSZWZlcm5jZUVycm9yIHdoZW5cbiAgICAgIC8vIGFjY2Vzc2luZyBzdWJzY3JpcHRpb24gYmVsb3cgaW4gdGhlIGNsb3N1cmUgZHVlIHRvIFRlbXBvcmFsIERlYWQgWm9uZS5cbiAgICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSkgYXMgUHJvbWlzZTx2b2lkPjtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBjb25zdCB7IHNvdXJjZSB9ID0gdGhpcztcbiAgICByZXR1cm4gc291cmNlICYmIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICAvLyBgaWZgIGFuZCBgdGhyb3dgIGFyZSBzcGVjaWFsIHNub3cgZmxha2VzLCB0aGUgY29tcGlsZXIgc2VlcyB0aGVtIGFzIHJlc2VydmVkIHdvcmRzLiBEZXByZWNhdGVkIGluXG4gIC8vIGZhdm9yIG9mIGlpZiBhbmQgdGhyb3dFcnJvciBmdW5jdGlvbnMuXG4gIC8qKlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKiBAZGVwcmVjYXRlZCBJbiBmYXZvciBvZiBpaWYgY3JlYXRpb24gZnVuY3Rpb246IGltcG9ydCB7IGlpZiB9IGZyb20gJ3J4anMnO1xuICAgKi9cbiAgc3RhdGljIGlmOiB0eXBlb2YgaWlmO1xuICAvKipcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgSW4gZmF2b3Igb2YgdGhyb3dFcnJvciBjcmVhdGlvbiBmdW5jdGlvbjogaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuICAgKi9cbiAgc3RhdGljIHRocm93OiB0eXBlb2YgdGhyb3dFcnJvcjtcblxuICAvKipcbiAgICogQW4gaW50ZXJvcCBwb2ludCBkZWZpbmVkIGJ5IHRoZSBlczctb2JzZXJ2YWJsZSBzcGVjIGh0dHBzOi8vZ2l0aHViLmNvbS96ZW5wYXJzaW5nL2VzLW9ic2VydmFibGVcbiAgICogQG1ldGhvZCBTeW1ib2wub2JzZXJ2YWJsZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSB0aGlzIGluc3RhbmNlIG9mIHRoZSBvYnNlcnZhYmxlXG4gICAqL1xuICBbU3ltYm9sX29ic2VydmFibGVdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4gIHBpcGUoKTogT2JzZXJ2YWJsZTxUPjtcbiAgcGlwZTxBPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4pOiBPYnNlcnZhYmxlPEE+O1xuICBwaXBlPEEsIEI+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+KTogT2JzZXJ2YWJsZTxCPjtcbiAgcGlwZTxBLCBCLCBDPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+KTogT2JzZXJ2YWJsZTxDPjtcbiAgcGlwZTxBLCBCLCBDLCBEPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4pOiBPYnNlcnZhYmxlPEQ+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEU+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+KTogT2JzZXJ2YWJsZTxFPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+KTogT2JzZXJ2YWJsZTxGPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4pOiBPYnNlcnZhYmxlPEc+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEUsIEYsIEcsIEg+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+LCBvcDY6IE9wZXJhdG9yRnVuY3Rpb248RSwgRj4sIG9wNzogT3BlcmF0b3JGdW5jdGlvbjxGLCBHPiwgb3A4OiBPcGVyYXRvckZ1bmN0aW9uPEcsIEg+KTogT2JzZXJ2YWJsZTxIPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHLCBILCBJPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4sIG9wODogT3BlcmF0b3JGdW5jdGlvbjxHLCBIPiwgb3A5OiBPcGVyYXRvckZ1bmN0aW9uPEgsIEk+KTogT2JzZXJ2YWJsZTxJPjtcbiAgcGlwZTxSPiguLi5vcGVyYXRpb25zOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgYW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbiAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuICAvKipcbiAgICogVXNlZCB0byBzdGl0Y2ggdG9nZXRoZXIgZnVuY3Rpb25hbCBvcGVyYXRvcnMgaW50byBhIGNoYWluLlxuICAgKiBAbWV0aG9kIHBpcGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhlIE9ic2VydmFibGUgcmVzdWx0IG9mIGFsbCBvZiB0aGUgb3BlcmF0b3JzIGhhdmluZ1xuICAgKiBiZWVuIGNhbGxlZCBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIHBhc3NlZCBpbi5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBpbXBvcnQgeyBtYXAsIGZpbHRlciwgc2NhbiB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDAwKVxuICAgKiAgIC5waXBlKFxuICAgKiAgICAgZmlsdGVyKHggPT4geCAlIDIgPT09IDApLFxuICAgKiAgICAgbWFwKHggPT4geCArIHgpLFxuICAgKiAgICAgc2NhbigoYWNjLCB4KSA9PiBhY2MgKyB4KVxuICAgKiAgIClcbiAgICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpXG4gICAqIGBgYFxuICAgKi9cbiAgcGlwZTxSPiguLi5vcGVyYXRpb25zOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+W10pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBpZiAob3BlcmF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzIGFzIGFueTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGlwZUZyb21BcnJheShvcGVyYXRpb25zKSh0aGlzKTtcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICB0b1Byb21pc2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPik6IFByb21pc2U8VD47XG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+LCBQcm9taXNlQ3RvcjogdHlwZW9mIFByb21pc2UpOiBQcm9taXNlPFQ+O1xuICB0b1Byb21pc2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPiwgUHJvbWlzZUN0b3I6IFByb21pc2VDb25zdHJ1Y3Rvckxpa2UpOiBQcm9taXNlPFQ+O1xuICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4gIHRvUHJvbWlzZShwcm9taXNlQ3Rvcj86IFByb21pc2VDb25zdHJ1Y3Rvckxpa2UpOiBQcm9taXNlPFQ+IHtcbiAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcblxuICAgIHJldHVybiBuZXcgcHJvbWlzZUN0b3IoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBhbnk7XG4gICAgICB0aGlzLnN1YnNjcmliZSgoeDogVCkgPT4gdmFsdWUgPSB4LCAoZXJyOiBhbnkpID0+IHJlamVjdChlcnIpLCAoKSA9PiByZXNvbHZlKHZhbHVlKSk7XG4gICAgfSkgYXMgUHJvbWlzZTxUPjtcbiAgfVxufVxuXG4vKipcbiAqIERlY2lkZXMgYmV0d2VlbiBhIHBhc3NlZCBwcm9taXNlIGNvbnN0cnVjdG9yIGZyb20gY29uc3VtaW5nIGNvZGUsXG4gKiBBIGRlZmF1bHQgY29uZmlndXJlZCBwcm9taXNlIGNvbnN0cnVjdG9yLCBhbmQgdGhlIG5hdGl2ZSBwcm9taXNlXG4gKiBjb25zdHJ1Y3RvciBhbmQgcmV0dXJucyBpdC4gSWYgbm90aGluZyBjYW4gYmUgZm91bmQsIGl0IHdpbGwgdGhyb3dcbiAqIGFuIGVycm9yLlxuICogQHBhcmFtIHByb21pc2VDdG9yIFRoZSBvcHRpb25hbCBwcm9taXNlIGNvbnN0cnVjdG9yIHRvIHBhc3NlZCBieSBjb25zdW1pbmcgY29kZVxuICovXG5mdW5jdGlvbiBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3RvcjogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSB8IHVuZGVmaW5lZCkge1xuICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgcHJvbWlzZUN0b3IgPSBjb25maWcuUHJvbWlzZSB8fCBQcm9taXNlO1xuICB9XG5cbiAgaWYgKCFwcm9taXNlQ3Rvcikge1xuICAgIHRocm93IG5ldyBFcnJvcignbm8gUHJvbWlzZSBpbXBsIGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZUN0b3I7XG59XG4iLCIvKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIGFuIGFjdGlvbiBpcyBpbnZhbGlkIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgYmVlblxuICogdW5zdWJzY3JpYmVkLlxuICpcbiAqIEBzZWUge0BsaW5rIFN1YmplY3R9XG4gKiBAc2VlIHtAbGluayBCZWhhdmlvclN1YmplY3R9XG4gKlxuICogQGNsYXNzIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciBleHRlbmRzIEVycm9yIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdPYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ29iamVjdCB1bnN1YnNjcmliZWQnKTtcbiAgICAoT2JqZWN0IGFzIGFueSkuc2V0UHJvdG90eXBlT2YodGhpcywgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3RTdWJzY3JpcHRpb248VD4gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3ViamVjdDogU3ViamVjdDxUPiwgcHVibGljIHN1YnNjcmliZXI6IE9ic2VydmVyPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnN1YmplY3Q7XG4gICAgY29uc3Qgb2JzZXJ2ZXJzID0gc3ViamVjdC5vYnNlcnZlcnM7XG5cbiAgICB0aGlzLnN1YmplY3QgPSBudWxsO1xuXG4gICAgaWYgKCFvYnNlcnZlcnMgfHwgb2JzZXJ2ZXJzLmxlbmd0aCA9PT0gMCB8fCBzdWJqZWN0LmlzU3RvcHBlZCB8fCBzdWJqZWN0LmNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmliZXJJbmRleCA9IG9ic2VydmVycy5pbmRleE9mKHRoaXMuc3Vic2NyaWJlcik7XG5cbiAgICBpZiAoc3Vic2NyaWJlckluZGV4ICE9PSAtMSkge1xuICAgICAgb2JzZXJ2ZXJzLnNwbGljZShzdWJzY3JpYmVySW5kZXgsIDEpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZlciwgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuaW1wb3J0IHsgU3ViamVjdFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3ViamVjdFN1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyByeFN1YnNjcmliZXIgYXMgcnhTdWJzY3JpYmVyU3ltYm9sIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL3J4U3Vic2NyaWJlcic7XG5cbi8qKlxuICogQGNsYXNzIFN1YmplY3RTdWJzY3JpYmVyPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb246IFN1YmplY3Q8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgU3ViamVjdDxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcblxuICBbcnhTdWJzY3JpYmVyU3ltYm9sXSgpIHtcbiAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpYmVyKHRoaXMpO1xuICB9XG5cbiAgb2JzZXJ2ZXJzOiBPYnNlcnZlcjxUPltdID0gW107XG5cbiAgY2xvc2VkID0gZmFsc2U7XG5cbiAgaXNTdG9wcGVkID0gZmFsc2U7XG5cbiAgaGFzRXJyb3IgPSBmYWxzZTtcblxuICB0aHJvd25FcnJvcjogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oZGVzdGluYXRpb246IE9ic2VydmVyPFQ+LCBzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBBbm9ueW1vdXNTdWJqZWN0PFQ+ID0+IHtcbiAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3Q8VD4oZGVzdGluYXRpb24sIHNvdXJjZSk7XG4gIH1cblxuICBsaWZ0PFI+KG9wZXJhdG9yOiBPcGVyYXRvcjxULCBSPik6IE9ic2VydmFibGU8Uj4ge1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQW5vbnltb3VzU3ViamVjdCh0aGlzLCB0aGlzKTtcbiAgICBzdWJqZWN0Lm9wZXJhdG9yID0gPGFueT5vcGVyYXRvcjtcbiAgICByZXR1cm4gPGFueT5zdWJqZWN0O1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IFQpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvcHlbaV0ubmV4dCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnRocm93bkVycm9yID0gZXJyO1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgIGNvbnN0IGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb3B5W2ldLmVycm9yKGVycik7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICBjb21wbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29weVtpXS5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLm9ic2VydmVycyA9IG51bGw7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFRlYXJkb3duTG9naWMge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5fdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcih0aGlzLnRocm93bkVycm9yKTtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgIHJldHVybiBuZXcgU3ViamVjdFN1YnNjcmlwdGlvbih0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cblxuICBhc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFQ+KCk7XG4gICAgKDxhbnk+b2JzZXJ2YWJsZSkuc291cmNlID0gdGhpcztcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBbm9ueW1vdXNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBbm9ueW1vdXNTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbj86IE9ic2VydmVyPFQ+LCBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5uZXh0KSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmVycm9yKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24uY29tcGxldGUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZkNvdW50PFQ+KCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiByZWZDb3VudE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFJlZkNvdW50T3BlcmF0b3Ioc291cmNlKSk7XG4gIH0gYXMgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xufVxuXG5jbGFzcyBSZWZDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50Kys7XG5cbiAgICBjb25zdCByZWZDb3VudGVyID0gbmV3IFJlZkNvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCBjb25uZWN0YWJsZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShyZWZDb3VudGVyKTtcblxuICAgIGlmICghcmVmQ291bnRlci5jbG9zZWQpIHtcbiAgICAgICg8YW55PiByZWZDb3VudGVyKS5jb25uZWN0aW9uID0gY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgIGlmICghY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgY29uc3QgcmVmQ291bnQgPSAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudDtcbiAgICBpZiAocmVmQ291bnQgPD0gMCkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCA9IHJlZkNvdW50IC0gMTtcbiAgICBpZiAocmVmQ291bnQgPiAxKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vL1xuICAgIC8vIENvbXBhcmUgdGhlIGxvY2FsIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHRvIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIG9uIHRoZSBzaGFyZWQgQ29ubmVjdGFibGVPYnNlcnZhYmxlLiBJbiBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUgc291cmNlIHN5bmNocm9ub3VzbHkgZW1pdHMgdmFsdWVzLCBhbmRcbiAgICAvLyB0aGUgUmVmQ291bnRTdWJzY3JpYmVyJ3MgZG93bnN0cmVhbSBPYnNlcnZlcnMgc3luY2hyb25vdXNseSB1bnN1YnNjcmliZSxcbiAgICAvLyBleGVjdXRpb24gY29udGludWVzIHRvIGhlcmUgYmVmb3JlIHRoZSBSZWZDb3VudE9wZXJhdG9yIGhhcyBhIGNoYW5jZSB0b1xuICAgIC8vIHN1cHBseSB0aGUgUmVmQ291bnRTdWJzY3JpYmVyIHdpdGggdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbi5cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByYW5nZSgwLCAxMCkucGlwZShcbiAgICAvLyAgIHB1Ymxpc2goKSxcbiAgICAvLyAgIHJlZkNvdW50KCksXG4gICAgLy8gICB0YWtlKDUpLFxuICAgIC8vIClcbiAgICAvLyAuc3Vic2NyaWJlKCk7XG4gICAgLy8gYGBgXG4gICAgLy8gSW4gb3JkZXIgdG8gYWNjb3VudCBmb3IgdGhpcyBjYXNlLCBSZWZDb3VudFN1YnNjcmliZXIgc2hvdWxkIG9ubHkgZGlzcG9zZVxuICAgIC8vIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUncyBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gaWYgdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gZXhpc3RzLCAqYW5kKiBlaXRoZXI6XG4gICAgLy8gICBhLiBSZWZDb3VudFN1YnNjcmliZXIgZG9lc24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvblxuICAgIC8vICAgICAgU3Vic2NyaXB0aW9uIHlldCwgb3IsXG4gICAgLy8gICBiLiBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiByZWZlcmVuY2UgaXMgaWRlbnRpY2FsXG4gICAgLy8gICAgICB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uXG4gICAgLy8vXG4gICAgY29uc3QgeyBjb25uZWN0aW9uIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNoYXJlZENvbm5lY3Rpb24gPSAoPGFueT4gY29ubmVjdGFibGUpLl9jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAoc2hhcmVkQ29ubmVjdGlvbiAmJiAoIWNvbm5lY3Rpb24gfHwgc2hhcmVkQ29ubmVjdGlvbiA9PT0gY29ubmVjdGlvbikpIHtcbiAgICAgIHNoYXJlZENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QsIFN1YmplY3RTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgcmVmQ291bnQgYXMgaGlnaGVyT3JkZXJSZWZDb3VudCB9IGZyb20gJy4uL29wZXJhdG9ycy9yZWZDb3VudCc7XG5cbi8qKlxuICogQGNsYXNzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPlxuICovXG5leHBvcnQgY2xhc3MgQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG5cbiAgcHJvdGVjdGVkIF9zdWJqZWN0OiBTdWJqZWN0PFQ+O1xuICBwcm90ZWN0ZWQgX3JlZkNvdW50OiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgX2Nvbm5lY3Rpb246IFN1YnNjcmlwdGlvbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaXNDb21wbGV0ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBzdWJqZWN0RmFjdG9yeTogKCkgPT4gU3ViamVjdDxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIHJldHVybiB0aGlzLmdldFN1YmplY3QoKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0U3ViamVjdCgpOiBTdWJqZWN0PFQ+IHtcbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcbiAgICBpZiAoIXN1YmplY3QgfHwgc3ViamVjdC5pc1N0b3BwZWQpIHtcbiAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLnN1YmplY3RGYWN0b3J5KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zdWJqZWN0O1xuICB9XG5cbiAgY29ubmVjdCgpOiBTdWJzY3JpcHRpb24ge1xuICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbjtcbiAgICBpZiAoIWNvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuX2lzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgIGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgY29ubmVjdGlvbi5hZGQodGhpcy5zb3VyY2VcbiAgICAgICAgLnN1YnNjcmliZShuZXcgQ29ubmVjdGFibGVTdWJzY3JpYmVyKHRoaXMuZ2V0U3ViamVjdCgpLCB0aGlzKSkpO1xuICAgICAgaWYgKGNvbm5lY3Rpb24uY2xvc2VkKSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBjb25uZWN0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25uZWN0aW9uO1xuICB9XG5cbiAgcmVmQ291bnQoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIGhpZ2hlck9yZGVyUmVmQ291bnQoKSh0aGlzKSBhcyBPYnNlcnZhYmxlPFQ+O1xuICB9XG59XG5cbmNvbnN0IGNvbm5lY3RhYmxlUHJvdG8gPSA8YW55PkNvbm5lY3RhYmxlT2JzZXJ2YWJsZS5wcm90b3R5cGU7XG5cbmV4cG9ydCBjb25zdCBjb25uZWN0YWJsZU9ic2VydmFibGVEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3JNYXAgPSB7XG4gIG9wZXJhdG9yOiB7IHZhbHVlOiBudWxsIH0sXG4gIF9yZWZDb3VudDogeyB2YWx1ZTogMCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX3N1YmplY3Q6IHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9jb25uZWN0aW9uOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfc3Vic2NyaWJlOiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLl9zdWJzY3JpYmUgfSxcbiAgX2lzQ29tcGxldGU6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uX2lzQ29tcGxldGUsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIGdldFN1YmplY3Q6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uZ2V0U3ViamVjdCB9LFxuICBjb25uZWN0OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLmNvbm5lY3QgfSxcbiAgcmVmQ291bnQ6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8ucmVmQ291bnQgfVxufTtcblxuY2xhc3MgQ29ubmVjdGFibGVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3ViamVjdFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb25uZWN0YWJsZS5faXNDb21wbGV0ZSA9IHRydWU7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IGNvbm5lY3RhYmxlID0gPGFueT50aGlzLmNvbm5lY3RhYmxlO1xuICAgIGlmIChjb25uZWN0YWJsZSkge1xuICAgICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gY29ubmVjdGFibGUuX2Nvbm5lY3Rpb247XG4gICAgICBjb25uZWN0YWJsZS5fcmVmQ291bnQgPSAwO1xuICAgICAgY29ubmVjdGFibGUuX3N1YmplY3QgPSBudWxsO1xuICAgICAgY29ubmVjdGFibGUuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgaWYgKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBSZWZDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50Kys7XG5cbiAgICBjb25zdCByZWZDb3VudGVyID0gbmV3IFJlZkNvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCBjb25uZWN0YWJsZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShyZWZDb3VudGVyKTtcblxuICAgIGlmICghcmVmQ291bnRlci5jbG9zZWQpIHtcbiAgICAgICg8YW55PiByZWZDb3VudGVyKS5jb25uZWN0aW9uID0gY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgIGlmICghY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgY29uc3QgcmVmQ291bnQgPSAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudDtcbiAgICBpZiAocmVmQ291bnQgPD0gMCkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCA9IHJlZkNvdW50IC0gMTtcbiAgICBpZiAocmVmQ291bnQgPiAxKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vL1xuICAgIC8vIENvbXBhcmUgdGhlIGxvY2FsIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHRvIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIG9uIHRoZSBzaGFyZWQgQ29ubmVjdGFibGVPYnNlcnZhYmxlLiBJbiBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUgc291cmNlIHN5bmNocm9ub3VzbHkgZW1pdHMgdmFsdWVzLCBhbmRcbiAgICAvLyB0aGUgUmVmQ291bnRTdWJzY3JpYmVyJ3MgZG93bnN0cmVhbSBPYnNlcnZlcnMgc3luY2hyb25vdXNseSB1bnN1YnNjcmliZSxcbiAgICAvLyBleGVjdXRpb24gY29udGludWVzIHRvIGhlcmUgYmVmb3JlIHRoZSBSZWZDb3VudE9wZXJhdG9yIGhhcyBhIGNoYW5jZSB0b1xuICAgIC8vIHN1cHBseSB0aGUgUmVmQ291bnRTdWJzY3JpYmVyIHdpdGggdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbi5cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByYW5nZSgwLCAxMCkucGlwZShcbiAgICAvLyAgIHB1Ymxpc2goKSxcbiAgICAvLyAgIHJlZkNvdW50KCksXG4gICAgLy8gICB0YWtlKDUpLFxuICAgIC8vICkuc3Vic2NyaWJlKCk7XG4gICAgLy8gYGBgXG4gICAgLy8gSW4gb3JkZXIgdG8gYWNjb3VudCBmb3IgdGhpcyBjYXNlLCBSZWZDb3VudFN1YnNjcmliZXIgc2hvdWxkIG9ubHkgZGlzcG9zZVxuICAgIC8vIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUncyBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gaWYgdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gZXhpc3RzLCAqYW5kKiBlaXRoZXI6XG4gICAgLy8gICBhLiBSZWZDb3VudFN1YnNjcmliZXIgZG9lc24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvblxuICAgIC8vICAgICAgU3Vic2NyaXB0aW9uIHlldCwgb3IsXG4gICAgLy8gICBiLiBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiByZWZlcmVuY2UgaXMgaWRlbnRpY2FsXG4gICAgLy8gICAgICB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uXG4gICAgLy8vXG4gICAgY29uc3QgeyBjb25uZWN0aW9uIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNoYXJlZENvbm5lY3Rpb24gPSAoPGFueT4gY29ubmVjdGFibGUpLl9jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAoc2hhcmVkQ29ubmVjdGlvbiAmJiAoIWNvbm5lY3Rpb24gfHwgc2hhcmVkQ29ubmVjdGlvbiA9PT0gY29ubmVjdGlvbikpIHtcbiAgICAgIHNoYXJlZENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyk6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yOiB2b2lkLCBkdXJhdGlvblNlbGVjdG9yOiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgVD4pID0+IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yPzogKHZhbHVlOiBUKSA9PiBSLCBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LCBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEdyb3VwcyB0aGUgaXRlbXMgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlIGFjY29yZGluZyB0byBhIHNwZWNpZmllZCBjcml0ZXJpb24sXG4gKiBhbmQgZW1pdHMgdGhlc2UgZ3JvdXBlZCBpdGVtcyBhcyBgR3JvdXBlZE9ic2VydmFibGVzYCwgb25lXG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IHBlciBncm91cC5cbiAqXG4gKiAhW10oZ3JvdXBCeS5wbmcpXG4gKlxuICogIyNFeGFtcGxlc1xuICogR3JvdXAgb2JqZWN0cyBieSBpZCBhbmQgcmV0dXJuIGFzIGFycmF5XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbnRlcmZhY2UgT2JqIHtcbiAqICAgIGlkOiBudW1iZXIsXG4gKiAgICBuYW1lOiBzdHJpbmcsXG4gKiB9XG4gKiBcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2F6ZTEnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnc2YyJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ2RnMid9LFxuICogICB7aWQ6IDEsIG5hbWU6ICdlcmcxJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ2RmMSd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdzZnFmYjInfSxcbiAqICAge2lkOiAzLCBuYW1lOiAncWZzMyd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdxc2dxc2ZnMid9LFxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCksXG4gKiAgIG1lcmdlTWFwKChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtdKSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIFsgeyBpZDogMSwgbmFtZTogJ2F6ZTEnIH0sXG4gKiAvLyAgIHsgaWQ6IDEsIG5hbWU6ICdlcmcxJyB9LFxuICogLy8gICB7IGlkOiAxLCBuYW1lOiAnZGYxJyB9IF1cbiAqIC8vXG4gKiAvLyBbIHsgaWQ6IDIsIG5hbWU6ICdzZjInIH0sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICdkZzInIH0sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICdzZnFmYjInIH0sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICdxc2dxc2ZnMicgfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAzLCBuYW1lOiAncWZzMycgfSBdXG4gKiBgYGBcbiAqXG4gKiBQaXZvdCBkYXRhIG9uIHRoZSBpZCBmaWVsZFxuICogYGBgdHlwZXNjcmlwdFxuICogb2Y8T2JqPihcbiAqICAge2lkOiAxLCBuYW1lOiAnYXplMSd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdzZjInfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnZGcyJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ2VyZzEnfSxcbiAqICAge2lkOiAxLCBuYW1lOiAnZGYxJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3NmcWZiMid9LFxuICogICB7aWQ6IDMsIG5hbWU6ICdxZnMxJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3FzZ3FzZmcyJ30sXG4gKiApLnBpcGUoXG4gKiAgIGdyb3VwQnkocCA9PiBwLmlkLCBwID0+IHAubmFtZSksXG4gKiAgIG1lcmdlTWFwKCAoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXCJcIiArIGdyb3VwJC5rZXldKSkpLFxuICogICBtYXAoYXJyID0+ICh7J2lkJzogcGFyc2VJbnQoYXJyWzBdKSwgJ3ZhbHVlcyc6IGFyci5zbGljZSgxKX0pKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGlkOiAxLCB2YWx1ZXM6IFsgJ2F6ZTEnLCAnZXJnMScsICdkZjEnIF0gfVxuICogLy8geyBpZDogMiwgdmFsdWVzOiBbICdzZjInLCAnZGcyJywgJ3NmcWZiMicsICdxc2dxc2ZnMicgXSB9XG4gKiAvLyB7IGlkOiAzLCB2YWx1ZXM6IFsgJ3FmczEnIF0gfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IEt9IGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGUga2V5XG4gKiBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IFJ9IFtlbGVtZW50U2VsZWN0b3JdIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGVcbiAqIHJldHVybiBlbGVtZW50IGZvciBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssUj4pOiBPYnNlcnZhYmxlPGFueT59IFtkdXJhdGlvblNlbGVjdG9yXVxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0byBkZXRlcm1pbmUgaG93IGxvbmcgZWFjaCBncm91cCBzaG91bGRcbiAqIGV4aXN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxHcm91cGVkT2JzZXJ2YWJsZTxLLFI+Pn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzXG4gKiBHcm91cGVkT2JzZXJ2YWJsZXMsIGVhY2ggb2Ygd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB1bmlxdWUga2V5IHZhbHVlIGFuZCBlYWNoXG4gKiBvZiB3aGljaCBlbWl0cyB0aG9zZSBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IHNoYXJlIHRoYXQga2V5XG4gKiB2YWx1ZS5cbiAqIEBtZXRob2QgZ3JvdXBCeVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PlxuICAgIHNvdXJjZS5saWZ0KG5ldyBHcm91cEJ5T3BlcmF0b3Ioa2V5U2VsZWN0b3IsIGVsZW1lbnRTZWxlY3RvciwgZHVyYXRpb25TZWxlY3Rvciwgc3ViamVjdFNlbGVjdG9yKSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBjb3VudDogbnVtYmVyO1xuICB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbiAgY2xvc2VkOiBib29sZWFuO1xuICBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuO1xufVxuXG5jbGFzcyBHcm91cEJ5T3BlcmF0b3I8VCwgSywgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEdyb3VwQnlTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5rZXlTZWxlY3RvciwgdGhpcy5lbGVtZW50U2VsZWN0b3IsIHRoaXMuZHVyYXRpb25TZWxlY3RvciwgdGhpcy5zdWJqZWN0U2VsZWN0b3JcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgR3JvdXBCeVN1YnNjcmliZXI8VCwgSywgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IGltcGxlbWVudHMgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBwcml2YXRlIGdyb3VwczogTWFwPEssIFN1YmplY3Q8VCB8IFI+PiA9IG51bGw7XG4gIHB1YmxpYyBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQga2V5OiBLO1xuICAgIHRyeSB7XG4gICAgICBrZXkgPSB0aGlzLmtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cCh2YWx1ZSwga2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dyb3VwKHZhbHVlOiBULCBrZXk6IEspIHtcbiAgICBsZXQgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG5cbiAgICBpZiAoIWdyb3Vwcykge1xuICAgICAgZ3JvdXBzID0gdGhpcy5ncm91cHMgPSBuZXcgTWFwPEssIFN1YmplY3Q8VCB8IFI+PigpO1xuICAgIH1cblxuICAgIGxldCBncm91cCA9IGdyb3Vwcy5nZXQoa2V5KTtcblxuICAgIGxldCBlbGVtZW50OiBSO1xuICAgIGlmICh0aGlzLmVsZW1lbnRTZWxlY3Rvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudFNlbGVjdG9yKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSA8YW55PnZhbHVlO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXApIHtcbiAgICAgIGdyb3VwID0gKHRoaXMuc3ViamVjdFNlbGVjdG9yID8gdGhpcy5zdWJqZWN0U2VsZWN0b3IoKSA6IG5ldyBTdWJqZWN0PFI+KCkpIGFzIFN1YmplY3Q8VCB8IFI+O1xuICAgICAgZ3JvdXBzLnNldChrZXksIGdyb3VwKTtcbiAgICAgIGNvbnN0IGdyb3VwZWRPYnNlcnZhYmxlID0gbmV3IEdyb3VwZWRPYnNlcnZhYmxlKGtleSwgZ3JvdXAsIHRoaXMpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGdyb3VwZWRPYnNlcnZhYmxlKTtcbiAgICAgIGlmICh0aGlzLmR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uU2VsZWN0b3IobmV3IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KGtleSwgPFN1YmplY3Q8Uj4+Z3JvdXApKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChkdXJhdGlvbi5zdWJzY3JpYmUobmV3IEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyKGtleSwgZ3JvdXAsIHRoaXMpKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFncm91cC5jbG9zZWQpIHtcbiAgICAgIGdyb3VwLm5leHQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmVycm9yKGVycik7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG4gICAgaWYgKGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLmZvckVhY2goKGdyb3VwLCBrZXkpID0+IHtcbiAgICAgICAgZ3JvdXAuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBncm91cHMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcmVtb3ZlR3JvdXAoa2V5OiBLKTogdm9pZCB7XG4gICAgdGhpcy5ncm91cHMuZGVsZXRlKGtleSk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICB0aGlzLmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyPEssIFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5OiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGdyb3VwOiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcmVudDogR3JvdXBCeVN1YnNjcmliZXI8YW55LCBLLCBUIHwgYW55Pikge1xuICAgIHN1cGVyKGdyb3VwKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50LCBrZXkgfSA9IHRoaXM7XG4gICAgdGhpcy5rZXkgPSB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50LnJlbW92ZUdyb3VwKGtleSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSByZXByZXNlbnRpbmcgdmFsdWVzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBncm91cCByZXByZXNlbnRlZCBieVxuICogYSBjb21tb24ga2V5LiBUaGUgdmFsdWVzIGVtaXR0ZWQgYnkgYSBHcm91cGVkT2JzZXJ2YWJsZSBjb21lIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhlIGNvbW1vbiBrZXkgaXMgYXZhaWxhYmxlIGFzIHRoZSBmaWVsZCBga2V5YCBvbiBhXG4gKiBHcm91cGVkT2JzZXJ2YWJsZSBpbnN0YW5jZS5cbiAqXG4gKiBAY2xhc3MgR3JvdXBlZE9ic2VydmFibGU8SywgVD5cbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIC8qKiBAZGVwcmVjYXRlZCBEbyBub3QgY29uc3RydWN0IHRoaXMgdHlwZS4gSW50ZXJuYWwgdXNlIG9ubHkgKi9cbiAgY29uc3RydWN0b3IocHVibGljIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cFN1YmplY3Q6IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVmQ291bnRTdWJzY3JpcHRpb24/OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCB7IHJlZkNvdW50U3Vic2NyaXB0aW9uLCBncm91cFN1YmplY3QgfSA9IHRoaXM7XG4gICAgaWYgKHJlZkNvdW50U3Vic2NyaXB0aW9uICYmICFyZWZDb3VudFN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IElubmVyUmVmQ291bnRTdWJzY3JpcHRpb24ocmVmQ291bnRTdWJzY3JpcHRpb24pKTtcbiAgICB9XG4gICAgc3Vic2NyaXB0aW9uLmFkZChncm91cFN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IFJlZkNvdW50U3Vic2NyaXB0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICBwYXJlbnQuY291bnQrKztcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGlmICghcGFyZW50LmNsb3NlZCAmJiAhdGhpcy5jbG9zZWQpIHtcbiAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICBwYXJlbnQuY291bnQgLT0gMTtcbiAgICAgIGlmIChwYXJlbnQuY291bnQgPT09IDAgJiYgcGFyZW50LmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgcGFyZW50LnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuXG4vKipcbiAqIEBjbGFzcyBCZWhhdmlvclN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEJlaGF2aW9yU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZhbHVlOiBUKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgaWYgKHN1YnNjcmlwdGlvbiAmJiAhKDxTdWJzY3JpcHRpb25MaWtlPnN1YnNjcmlwdGlvbikuY2xvc2VkKSB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0VmFsdWUoKTogVCB7XG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHRocm93IHRoaXMudGhyb3duRXJyb3I7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgc3VwZXIubmV4dCh0aGlzLl92YWx1ZSA9IHZhbHVlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQSB1bml0IG9mIHdvcmsgdG8gYmUgZXhlY3V0ZWQgaW4gYSBgc2NoZWR1bGVyYC4gQW4gYWN0aW9uIGlzIHR5cGljYWxseVxuICogY3JlYXRlZCBmcm9tIHdpdGhpbiBhIHtAbGluayBTY2hlZHVsZXJMaWtlfSBhbmQgYW4gUnhKUyB1c2VyIGRvZXMgbm90IG5lZWQgdG8gY29uY2VyblxuICogdGhlbXNlbHZlcyBhYm91dCBjcmVhdGluZyBhbmQgbWFuaXB1bGF0aW5nIGFuIEFjdGlvbi5cbiAqXG4gKiBgYGB0c1xuICogY2xhc3MgQWN0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAqICAgbmV3IChzY2hlZHVsZXI6IFNjaGVkdWxlciwgd29yazogKHN0YXRlPzogVCkgPT4gdm9pZCk7XG4gKiAgIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb247XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAY2xhc3MgQWN0aW9uPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBY3Rpb248VD4gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICBjb25zdHJ1Y3RvcihzY2hlZHVsZXI6IFNjaGVkdWxlciwgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICAvKipcbiAgICogU2NoZWR1bGVzIHRoaXMgYWN0aW9uIG9uIGl0cyBwYXJlbnQge0BsaW5rIFNjaGVkdWxlckxpa2V9IGZvciBleGVjdXRpb24uIE1heSBiZSBwYXNzZWRcbiAgICogc29tZSBjb250ZXh0IG9iamVjdCwgYHN0YXRlYC4gTWF5IGhhcHBlbiBhdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUsXG4gICAqIGFjY29yZGluZyB0byB0aGUgYGRlbGF5YCBwYXJhbWV0ZXIsIGlmIHNwZWNpZmllZC5cbiAgICogQHBhcmFtIHtUfSBbc3RhdGVdIFNvbWUgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIGB3b3JrYCBmdW5jdGlvbiB1c2VzIHdoZW5cbiAgICogY2FsbGVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsYXldIFRpbWUgdG8gd2FpdCBiZWZvcmUgZXhlY3V0aW5nIHRoZSB3b3JrLCB3aGVyZSB0aGVcbiAgICogdGltZSB1bml0IGlzIGltcGxpY2l0IGFuZCBkZWZpbmVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFzeW5jQWN0aW9uPFQ+IGV4dGVuZHMgQWN0aW9uPFQ+IHtcblxuICBwdWJsaWMgaWQ6IGFueTtcbiAgcHVibGljIHN0YXRlOiBUO1xuICBwdWJsaWMgZGVsYXk6IG51bWJlcjtcbiAgcHJvdGVjdGVkIHBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEFsd2F5cyByZXBsYWNlIHRoZSBjdXJyZW50IHN0YXRlIHdpdGggdGhlIG5ldyBzdGF0ZS5cbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICAvL1xuICAgIC8vIEltcG9ydGFudCBpbXBsZW1lbnRhdGlvbiBub3RlOlxuICAgIC8vXG4gICAgLy8gQWN0aW9ucyBvbmx5IGV4ZWN1dGUgb25jZSBieSBkZWZhdWx0LCB1bmxlc3MgcmVzY2hlZHVsZWQgZnJvbSB3aXRoaW4gdGhlXG4gICAgLy8gc2NoZWR1bGVkIGNhbGxiYWNrLiBUaGlzIGFsbG93cyB1cyB0byBpbXBsZW1lbnQgc2luZ2xlIGFuZCByZXBlYXRcbiAgICAvLyBhY3Rpb25zIHZpYSB0aGUgc2FtZSBjb2RlIHBhdGgsIHdpdGhvdXQgYWRkaW5nIEFQSSBzdXJmYWNlIGFyZWEsIGFzIHdlbGxcbiAgICAvLyBhcyBtaW1pYyB0cmFkaXRpb25hbCByZWN1cnNpb24gYnV0IGFjcm9zcyBhc3luY2hyb25vdXMgYm91bmRhcmllcy5cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIEpTIHJ1bnRpbWVzIGFuZCB0aW1lcnMgZGlzdGluZ3Vpc2ggYmV0d2VlbiBpbnRlcnZhbHMgYWNoaWV2ZWQgYnlcbiAgICAvLyBzZXJpYWwgYHNldFRpbWVvdXRgIGNhbGxzIHZzLiBhIHNpbmdsZSBgc2V0SW50ZXJ2YWxgIGNhbGwuIEFuIGludGVydmFsIG9mXG4gICAgLy8gc2VyaWFsIGBzZXRUaW1lb3V0YCBjYWxscyBjYW4gYmUgaW5kaXZpZHVhbGx5IGRlbGF5ZWQsIHdoaWNoIGRlbGF5c1xuICAgIC8vIHNjaGVkdWxpbmcgdGhlIG5leHQgYHNldFRpbWVvdXRgLCBhbmQgc28gb24uIGBzZXRJbnRlcnZhbGAgYXR0ZW1wdHMgdG9cbiAgICAvLyBndWFyYW50ZWUgdGhlIGludGVydmFsIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBtb3JlIHByZWNpc2VseSB0byB0aGVcbiAgICAvLyBpbnRlcnZhbCBwZXJpb2QsIHJlZ2FyZGxlc3Mgb2YgbG9hZC5cbiAgICAvL1xuICAgIC8vIFRoZXJlZm9yZSwgd2UgdXNlIGBzZXRJbnRlcnZhbGAgdG8gc2NoZWR1bGUgc2luZ2xlIGFuZCByZXBlYXQgYWN0aW9ucy5cbiAgICAvLyBJZiB0aGUgYWN0aW9uIHJlc2NoZWR1bGVzIGl0c2VsZiB3aXRoIHRoZSBzYW1lIGRlbGF5LCB0aGUgaW50ZXJ2YWwgaXMgbm90XG4gICAgLy8gY2FuY2VsZWQuIElmIHRoZSBhY3Rpb24gZG9lc24ndCByZXNjaGVkdWxlLCBvciByZXNjaGVkdWxlcyB3aXRoIGFcbiAgICAvLyBkaWZmZXJlbnQgZGVsYXksIHRoZSBpbnRlcnZhbCB3aWxsIGJlIGNhbmNlbGVkIGFmdGVyIHNjaGVkdWxlZCBjYWxsYmFja1xuICAgIC8vIGV4ZWN1dGlvbi5cbiAgICAvL1xuICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBwZW5kaW5nIGZsYWcgaW5kaWNhdGluZyB0aGF0IHRoaXMgYWN0aW9uIGhhcyBiZWVuIHNjaGVkdWxlZCwgb3JcbiAgICAvLyBoYXMgcmVjdXJzaXZlbHkgcmVzY2hlZHVsZWQgaXRzZWxmLlxuICAgIHRoaXMucGVuZGluZyA9IHRydWU7XG5cbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgLy8gSWYgdGhpcyBhY3Rpb24gaGFzIGFscmVhZHkgYW4gYXN5bmMgSWQsIGRvbid0IHJlcXVlc3QgYSBuZXcgb25lLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkIHx8IHRoaXMucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCB0aGlzLmlkLCBkZWxheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHJldHVybiBzZXRJbnRlcnZhbChzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIHRoaXMpLCBkZWxheSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlciwgaWQ6IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIHRoaXMgYWN0aW9uIGlzIHJlc2NoZWR1bGVkIHdpdGggdGhlIHNhbWUgZGVsYXkgdGltZSwgZG9uJ3QgY2xlYXIgdGhlIGludGVydmFsIGlkLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiB0aGlzLmRlbGF5ID09PSBkZWxheSAmJiB0aGlzLnBlbmRpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIGFjdGlvbidzIGRlbGF5IHRpbWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGN1cnJlbnQgZGVsYXksXG4gICAgLy8gb3IgdGhlIGFjdGlvbiBoYXMgYmVlbiByZXNjaGVkdWxlZCBiZWZvcmUgaXQncyBleGVjdXRlZCwgY2xlYXIgdGhlIGludGVydmFsIGlkXG4gICAgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaWQpICYmIHVuZGVmaW5lZCB8fCB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgZXhlY3V0ZXMgdGhpcyBhY3Rpb24gYW5kIHRoZSBgd29ya2AgaXQgY29udGFpbnMuXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIHB1YmxpYyBleGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignZXhlY3V0aW5nIGEgY2FuY2VsbGVkIGFjdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGVycm9yID0gdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wZW5kaW5nID09PSBmYWxzZSAmJiB0aGlzLmlkICE9IG51bGwpIHtcbiAgICAgIC8vIERlcXVldWUgaWYgdGhlIGFjdGlvbiBkaWRuJ3QgcmVzY2hlZHVsZSBpdHNlbGYuIERvbid0IGNhbGxcbiAgICAgIC8vIHVuc3Vic2NyaWJlKCksIGJlY2F1c2UgdGhlIGFjdGlvbiBjb3VsZCByZXNjaGVkdWxlIGxhdGVyLlxuICAgICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgICAvLyBgYGBcbiAgICAgIC8vIHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiBkb1dvcmsoY291bnRlcikge1xuICAgICAgLy8gICAvKiAuLi4gSSdtIGEgYnVzeSB3b3JrZXIgYmVlIC4uLiAqL1xuICAgICAgLy8gICB2YXIgb3JpZ2luYWxBY3Rpb24gPSB0aGlzO1xuICAgICAgLy8gICAvKiB3YWl0IDEwMG1zIGJlZm9yZSByZXNjaGVkdWxpbmcgdGhlIGFjdGlvbiAqL1xuICAgICAgLy8gICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vICAgICBvcmlnaW5hbEFjdGlvbi5zY2hlZHVsZShjb3VudGVyICsgMSk7XG4gICAgICAvLyAgIH0sIDEwMCk7XG4gICAgICAvLyB9LCAxMDAwKTtcbiAgICAgIC8vIGBgYFxuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQodGhpcy5zY2hlZHVsZXIsIHRoaXMuaWQsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgbGV0IGVycm9yZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgZXJyb3JWYWx1ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLndvcmsoc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgZXJyb3JWYWx1ZSA9ICEhZSAmJiBlIHx8IG5ldyBFcnJvcihlKTtcbiAgICB9XG4gICAgaWYgKGVycm9yZWQpIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHJldHVybiBlcnJvclZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBzY2hlZHVsZXIuYWN0aW9ucztcbiAgICBjb25zdCBpbmRleCA9IGFjdGlvbnMuaW5kZXhPZih0aGlzKTtcblxuICAgIHRoaXMud29yayAgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbnVsbDtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGFjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgbnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWxheSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgUXVldWVTY2hlZHVsZXIgfSBmcm9tICcuL1F1ZXVlU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBRdWV1ZUFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBRdWV1ZVNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5zY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgcmV0dXJuIChkZWxheSA+IDAgfHwgdGhpcy5jbG9zZWQpID9cbiAgICAgIHN1cGVyLmV4ZWN1dGUoc3RhdGUsIGRlbGF5KSA6XG4gICAgICB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSkgO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogUXVldWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSBmbHVzaCB0aGUgc2NoZWR1bGVyIHN0YXJ0aW5nIHdpdGggdGhpcyBhY3Rpb24uXG4gICAgcmV0dXJuIHNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9zY2hlZHVsZXIvQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UsIFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEFuIGV4ZWN1dGlvbiBjb250ZXh0IGFuZCBhIGRhdGEgc3RydWN0dXJlIHRvIG9yZGVyIHRhc2tzIGFuZCBzY2hlZHVsZSB0aGVpclxuICogZXhlY3V0aW9uLiBQcm92aWRlcyBhIG5vdGlvbiBvZiAocG90ZW50aWFsbHkgdmlydHVhbCkgdGltZSwgdGhyb3VnaCB0aGVcbiAqIGBub3coKWAgZ2V0dGVyIG1ldGhvZC5cbiAqXG4gKiBFYWNoIHVuaXQgb2Ygd29yayBpbiBhIFNjaGVkdWxlciBpcyBjYWxsZWQgYW4gYEFjdGlvbmAuXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIFNjaGVkdWxlciB7XG4gKiAgIG5vdygpOiBudW1iZXI7XG4gKiAgIHNjaGVkdWxlKHdvcmssIGRlbGF5Pywgc3RhdGU/KTogU3Vic2NyaXB0aW9uO1xuICogfVxuICogYGBgXG4gKlxuICogQGNsYXNzIFNjaGVkdWxlclxuICogQGRlcHJlY2F0ZWQgU2NoZWR1bGVyIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBSeEpTLCBhbmRcbiAqIHNob3VsZCBub3QgYmUgdXNlZCBkaXJlY3RseS4gUmF0aGVyLCBjcmVhdGUgeW91ciBvd24gY2xhc3MgYW5kIGltcGxlbWVudFxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9XG4gKi9cbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXIgaW1wbGVtZW50cyBTY2hlZHVsZXJMaWtlIHtcblxuICAvKipcbiAgICogTm90ZTogdGhlIGV4dHJhIGFycm93IGZ1bmN0aW9uIHdyYXBwZXIgaXMgdG8gbWFrZSB0ZXN0aW5nIGJ5IG92ZXJyaWRpbmdcbiAgICogRGF0ZS5ub3cgZWFzaWVyLlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub3c6ICgpID0+IG51bWJlciA9ICgpID0+IERhdGUubm93KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBTY2hlZHVsZXJBY3Rpb246IHR5cGVvZiBBY3Rpb24sXG4gICAgICAgICAgICAgIG5vdzogKCkgPT4gbnVtYmVyID0gU2NoZWR1bGVyLm5vdykge1xuICAgIHRoaXMubm93ID0gbm93O1xuICB9XG5cbiAgLyoqXG4gICAqIEEgZ2V0dGVyIG1ldGhvZCB0aGF0IHJldHVybnMgYSBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHRpbWVcbiAgICogKGF0IHRoZSB0aW1lIHRoaXMgZnVuY3Rpb24gd2FzIGNhbGxlZCkgYWNjb3JkaW5nIHRvIHRoZSBzY2hlZHVsZXIncyBvd25cbiAgICogaW50ZXJuYWwgY2xvY2suXG4gICAqIEByZXR1cm4ge251bWJlcn0gQSBudW1iZXIgdGhhdCByZXByZXNlbnRzIHRoZSBjdXJyZW50IHRpbWUuIE1heSBvciBtYXkgbm90XG4gICAqIGhhdmUgYSByZWxhdGlvbiB0byB3YWxsLWNsb2NrIHRpbWUuIE1heSBvciBtYXkgbm90IHJlZmVyIHRvIGEgdGltZSB1bml0XG4gICAqIChlLmcuIG1pbGxpc2Vjb25kcykuXG4gICAqL1xuICBwdWJsaWMgbm93OiAoKSA9PiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyBhIGZ1bmN0aW9uLCBgd29ya2AsIGZvciBleGVjdXRpb24uIE1heSBoYXBwZW4gYXQgc29tZSBwb2ludCBpblxuICAgKiB0aGUgZnV0dXJlLCBhY2NvcmRpbmcgdG8gdGhlIGBkZWxheWAgcGFyYW1ldGVyLCBpZiBzcGVjaWZpZWQuIE1heSBiZSBwYXNzZWRcbiAgICogc29tZSBjb250ZXh0IG9iamVjdCwgYHN0YXRlYCwgd2hpY2ggd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGB3b3JrYCBmdW5jdGlvbi5cbiAgICpcbiAgICogVGhlIGdpdmVuIGFyZ3VtZW50cyB3aWxsIGJlIHByb2Nlc3NlZCBhbiBzdG9yZWQgYXMgYW4gQWN0aW9uIG9iamVjdCBpbiBhXG4gICAqIHF1ZXVlIG9mIGFjdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RhdGU6ID9UKTogP1N1YnNjcmlwdGlvbn0gd29yayBBIGZ1bmN0aW9uIHJlcHJlc2VudGluZyBhXG4gICAqIHRhc2ssIG9yIHNvbWUgdW5pdCBvZiB3b3JrIHRvIGJlIGV4ZWN1dGVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsYXldIFRpbWUgdG8gd2FpdCBiZWZvcmUgZXhlY3V0aW5nIHRoZSB3b3JrLCB3aGVyZSB0aGVcbiAgICogdGltZSB1bml0IGlzIGltcGxpY2l0IGFuZCBkZWZpbmVkIGJ5IHRoZSBTY2hlZHVsZXIgaXRzZWxmLlxuICAgKiBAcGFyYW0ge1R9IFtzdGF0ZV0gU29tZSBjb250ZXh0dWFsIGRhdGEgdGhhdCB0aGUgYHdvcmtgIGZ1bmN0aW9uIHVzZXMgd2hlblxuICAgKiBjYWxsZWQgYnkgdGhlIFNjaGVkdWxlci5cbiAgICogQHJldHVybiB7U3Vic2NyaXB0aW9ufSBBIHN1YnNjcmlwdGlvbiBpbiBvcmRlciB0byBiZSBhYmxlIHRvIHVuc3Vic2NyaWJlXG4gICAqIHRoZSBzY2hlZHVsZWQgd29yay5cbiAgICovXG4gIHB1YmxpYyBzY2hlZHVsZTxUPih3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQsIGRlbGF5OiBudW1iZXIgPSAwLCBzdGF0ZT86IFQpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiBuZXcgdGhpcy5TY2hlZHVsZXJBY3Rpb248VD4odGhpcywgd29yaykuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG5leHBvcnQgY2xhc3MgQXN5bmNTY2hlZHVsZXIgZXh0ZW5kcyBTY2hlZHVsZXIge1xuICBwdWJsaWMgc3RhdGljIGRlbGVnYXRlPzogU2NoZWR1bGVyO1xuICBwdWJsaWMgYWN0aW9uczogQXJyYXk8QXN5bmNBY3Rpb248YW55Pj4gPSBbXTtcbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBTY2hlZHVsZXIgaXMgY3VycmVudGx5IGV4ZWN1dGluZyBhIGJhdGNoIG9mXG4gICAqIHF1ZXVlZCBhY3Rpb25zLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlcHJlY2F0ZWQgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICovXG4gIHB1YmxpYyBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEFuIGludGVybmFsIElEIHVzZWQgdG8gdHJhY2sgdGhlIGxhdGVzdCBhc3luY2hyb25vdXMgdGFzayBzdWNoIGFzIHRob3NlXG4gICAqIGNvbWluZyBmcm9tIGBzZXRUaW1lb3V0YCwgYHNldEludGVydmFsYCwgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAsIGFuZFxuICAgKiBvdGhlcnMuXG4gICAqIEB0eXBlIHthbnl9XG4gICAqIEBkZXByZWNhdGVkIGludGVybmFsIHVzZSBvbmx5XG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGVkOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQWN0aW9uLFxuICAgICAgICAgICAgICBub3c6ICgpID0+IG51bWJlciA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICBzdXBlcihTY2hlZHVsZXJBY3Rpb24sICgpID0+IHtcbiAgICAgIGlmIChBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAmJiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAhPT0gdGhpcykge1xuICAgICAgICByZXR1cm4gQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUubm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbm93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGU8VD4od29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLCBkZWxheTogbnVtYmVyID0gMCwgc3RhdGU/OiBUKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgJiYgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgIT09IHRoaXMpIHtcbiAgICAgIHJldHVybiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZS5zY2hlZHVsZSh3b3JrLCBkZWxheSwgc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUod29yaywgZGVsYXksIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmx1c2goYWN0aW9uOiBBc3luY0FjdGlvbjxhbnk+KTogdm9pZCB7XG5cbiAgICBjb25zdCB7YWN0aW9uc30gPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZXJyb3I6IGFueTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKTsgLy8gZXhoYXVzdCB0aGUgc2NoZWR1bGVyIHF1ZXVlXG5cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSB7XG4gICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgUXVldWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG59XG4iLCJpbXBvcnQgeyBRdWV1ZUFjdGlvbiB9IGZyb20gJy4vUXVldWVBY3Rpb24nO1xuaW1wb3J0IHsgUXVldWVTY2hlZHVsZXIgfSBmcm9tICcuL1F1ZXVlU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogUXVldWUgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlB1dCBldmVyeSBuZXh0IHRhc2sgb24gYSBxdWV1ZSwgaW5zdGVhZCBvZiBleGVjdXRpbmcgaXQgaW1tZWRpYXRlbHk8L3NwYW4+XG4gKlxuICogYHF1ZXVlYCBzY2hlZHVsZXIsIHdoZW4gdXNlZCB3aXRoIGRlbGF5LCBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBhc3luY1NjaGVkdWxlcn0gc2NoZWR1bGVyLlxuICpcbiAqIFdoZW4gdXNlZCB3aXRob3V0IGRlbGF5LCBpdCBzY2hlZHVsZXMgZ2l2ZW4gdGFzayBzeW5jaHJvbm91c2x5IC0gZXhlY3V0ZXMgaXQgcmlnaHQgd2hlblxuICogaXQgaXMgc2NoZWR1bGVkLiBIb3dldmVyIHdoZW4gY2FsbGVkIHJlY3Vyc2l2ZWx5LCB0aGF0IGlzIHdoZW4gaW5zaWRlIHRoZSBzY2hlZHVsZWQgdGFzayxcbiAqIGFub3RoZXIgdGFzayBpcyBzY2hlZHVsZWQgd2l0aCBxdWV1ZSBzY2hlZHVsZXIsIGluc3RlYWQgb2YgZXhlY3V0aW5nIGltbWVkaWF0ZWx5IGFzIHdlbGwsXG4gKiB0aGF0IHRhc2sgd2lsbCBiZSBwdXQgb24gYSBxdWV1ZSBhbmQgd2FpdCBmb3IgY3VycmVudCBvbmUgdG8gZmluaXNoLlxuICpcbiAqIFRoaXMgbWVhbnMgdGhhdCB3aGVuIHlvdSBleGVjdXRlIHRhc2sgd2l0aCBgcXVldWVgIHNjaGVkdWxlciwgeW91IGFyZSBzdXJlIGl0IHdpbGwgZW5kXG4gKiBiZWZvcmUgYW55IG90aGVyIHRhc2sgc2NoZWR1bGVkIHdpdGggdGhhdCBzY2hlZHVsZXIgd2lsbCBzdGFydC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogU2NoZWR1bGUgcmVjdXJzaXZlbHkgZmlyc3QsIHRoZW4gZG8gc29tZXRoaW5nXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIucXVldWUuc2NoZWR1bGUoKCkgPT4ge1xuICogICBSeC5TY2hlZHVsZXIucXVldWUuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ3NlY29uZCcpKTsgLy8gd2lsbCBub3QgaGFwcGVuIG5vdywgYnV0IHdpbGwgYmUgcHV0IG9uIGEgcXVldWVcbiAqXG4gKiAgIGNvbnNvbGUubG9nKCdmaXJzdCcpO1xuICogfSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiZmlyc3RcIlxuICogLy8gXCJzZWNvbmRcIlxuICogYGBgXG4gKlxuICogUmVzY2hlZHVsZSBpdHNlbGYgcmVjdXJzaXZlbHlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIFJ4LlNjaGVkdWxlci5xdWV1ZS5zY2hlZHVsZShmdW5jdGlvbihzdGF0ZSkge1xuICogICBpZiAoc3RhdGUgIT09IDApIHtcbiAqICAgICBjb25zb2xlLmxvZygnYmVmb3JlJywgc3RhdGUpO1xuICogICAgIHRoaXMuc2NoZWR1bGUoc3RhdGUgLSAxKTsgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlXG4gKiAgICAgY29uc29sZS5sb2coJ2FmdGVyJywgc3RhdGUpO1xuICogICB9XG4gKiB9LCAwLCAzKTtcbiAqXG4gKiAvLyBJbiBzY2hlZHVsZXIgdGhhdCBydW5zIHJlY3Vyc2l2ZWx5LCB5b3Ugd291bGQgZXhwZWN0OlxuICogLy8gXCJiZWZvcmVcIiwgM1xuICogLy8gXCJiZWZvcmVcIiwgMlxuICogLy8gXCJiZWZvcmVcIiwgMVxuICogLy8gXCJhZnRlclwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDJcbiAqIC8vIFwiYWZ0ZXJcIiwgM1xuICpcbiAqIC8vIEJ1dCB3aXRoIHF1ZXVlIGl0IGxvZ3M6XG4gKiAvLyBcImJlZm9yZVwiLCAzXG4gKiAvLyBcImFmdGVyXCIsIDNcbiAqIC8vIFwiYmVmb3JlXCIsIDJcbiAqIC8vIFwiYWZ0ZXJcIiwgMlxuICogLy8gXCJiZWZvcmVcIiwgMVxuICogLy8gXCJhZnRlclwiLCAxXG4gKiBgYGBcbiAqXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHF1ZXVlXG4gKiBAb3duZXIgU2NoZWR1bGVyXG4gKi9cblxuZXhwb3J0IGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlU2NoZWR1bGVyKFF1ZXVlQWN0aW9uKTtcbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogVGhlIHNhbWUgT2JzZXJ2YWJsZSBpbnN0YW5jZSByZXR1cm5lZCBieSBhbnkgY2FsbCB0byB7QGxpbmsgZW1wdHl9IHdpdGhvdXQgYVxuICogYHNjaGVkdWxlcmAuIEl0IGlzIHByZWZlcnJhYmxlIHRvIHVzZSB0aGlzIG92ZXIgYGVtcHR5KClgLlxuICovXG5leHBvcnQgY29uc3QgRU1QVFkgPSBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgaW1tZWRpYXRlbHlcbiAqIGVtaXRzIGEgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5KdXN0IGVtaXRzICdjb21wbGV0ZScsIGFuZCBub3RoaW5nIGVsc2UuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGVtcHR5LnBuZylcbiAqXG4gKiBUaGlzIHN0YXRpYyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBvbmx5XG4gKiBlbWl0cyB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLiBJdCBjYW4gYmUgdXNlZCBmb3IgY29tcG9zaW5nIHdpdGggb3RoZXJcbiAqIE9ic2VydmFibGVzLCBzdWNoIGFzIGluIGEge0BsaW5rIG1lcmdlTWFwfS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIGNvbXBsZXRlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCByZXN1bHQgPSBlbXB0eSgpLnBpcGUoc3RhcnRXaXRoKDcpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgTWFwIGFuZCBmbGF0dGVuIG9ubHkgb2RkIG51bWJlcnMgdG8gdGhlIHNlcXVlbmNlICdhJywgJ2InLCAnYydcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGludGVydmFsJCA9IGludGVydmFsKDEwMDApO1xuICogcmVzdWx0ID0gaW50ZXJ2YWwkLnBpcGUoXG4gKiAgIG1lcmdlTWFwKHggPT4geCAlIDIgPT09IDEgPyBvZignYScsICdiJywgJ2MnKSA6IGVtcHR5KCkpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nIHRvIHRoZSBjb25zb2xlOlxuICogLy8geCBpcyBlcXVhbCB0byB0aGUgY291bnQgb24gdGhlIGludGVydmFsIGVnKDAsMSwyLDMsLi4uKVxuICogLy8geCB3aWxsIG9jY3VyIGV2ZXJ5IDEwMDBtc1xuICogLy8gaWYgeCAlIDIgaXMgZXF1YWwgdG8gMSBwcmludCBhYmNcbiAqIC8vIGlmIHggJSAyIGlzIG5vdCBlcXVhbCB0byAxIG5vdGhpbmcgd2lsbCBiZSBvdXRwdXRcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBuZXZlcn1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICogQHNlZSB7QGxpbmsgdGhyb3dFcnJvcn1cbiAqXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHRoZSBjb21wbGV0ZSBub3RpZmljYXRpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBcImVtcHR5XCIgT2JzZXJ2YWJsZTogZW1pdHMgb25seSB0aGUgY29tcGxldGVcbiAqIG5vdGlmaWNhdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgZW1wdHlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHVzaW5nIEVNUFRZIGNvbnN0YW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gc2NoZWR1bGVyID8gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSA6IEVNUFRZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTY2hlZHVsZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIFNjaGVkdWxlckxpa2Uge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mICg8YW55PnZhbHVlKS5zY2hlZHVsZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBTdWJzY3JpYmVzIHRvIGFuIEFycmF5TGlrZSB3aXRoIGEgc3Vic2NyaWJlclxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSBvciBhcnJheS1saWtlIHRvIHN1YnNjcmliZSB0b1xuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9BcnJheSA9IDxUPihhcnJheTogQXJyYXlMaWtlPFQ+KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgc3Vic2NyaWJlci5uZXh0KGFycmF5W2ldKTtcbiAgfVxuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb0FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21BcnJheTxUPihpbnB1dDogQXJyYXlMaWtlPFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvQXJyYXkoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBsZXQgaSA9IDA7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpID09PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliZXIubmV4dChpbnB1dFtpKytdKTtcbiAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIHN1Yi5hZGQodGhpcy5zY2hlZHVsZSgpKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGFyPFQ+KHZhbHVlOiBUKSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9KTtcbiAgcmVzdWx0Ll9pc1NjYWxhciA9IHRydWU7XG4gIChyZXN1bHQgYXMgYW55KS52YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgc2NhbGFyIH0gZnJvbSAnLi9zY2FsYXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvZjxUPihhOiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMj4oYTogVCwgYjogVDIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzPihhOiBULCBiOiBUMiwgYzogVDMsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNT4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3LCBUOD4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgaDogVDgsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDcgfCBUOD47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNywgVDgsIFQ5PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBoOiBUOCwgaTogVDksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDcgfCBUOCB8IFQ5PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxUPiguLi5hcmdzOiBBcnJheTxUIHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgYXJndW1lbnRzIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVhY2ggYXJndW1lbnQgYmVjb21lcyBhIGBuZXh0YCBub3RpZmljYXRpb24uPC9zcGFuPlxuICpcbiAqICFbXShvZi5wbmcpXG4gKlxuICogVW5saWtlIHtAbGluayBmcm9tfSwgaXQgZG9lcyBub3QgZG8gYW55IGZsYXR0ZW5pbmcgYW5kIGVtaXRzIGVhY2ggYXJndW1lbnQgaW4gd2hvbGVcbiAqIGFzIGEgc2VwYXJhdGUgYG5leHRgIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqIEVtaXQgdGhlIHZhbHVlcyBgMTAsIDIwLCAzMGBcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZigxMCwgMjAsIDMwKVxuICogLnN1YnNjcmliZShcbiAqICAgbmV4dCA9PiBjb25zb2xlLmxvZygnbmV4dDonLCBuZXh0KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICduZXh0OiAxMCdcbiAqIC8vICduZXh0OiAyMCdcbiAqIC8vICduZXh0OiAzMCdcbiAqXG4gKiBgYGBcbiAqXG4gKiBFbWl0IHRoZSBhcnJheSBgWzEsMiwzXWBcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZihbMSwyLDNdKVxuICogLnN1YnNjcmliZShcbiAqICAgbmV4dCA9PiBjb25zb2xlLmxvZygnbmV4dDonLCBuZXh0KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICduZXh0OiBbMSwyLDNdJ1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIHJhbmdlfVxuICpcbiAqIEBwYXJhbSB7Li4uVH0gdmFsdWVzIEEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgYXJndW1lbnRzIHlvdSB3YW50IHRvIGJlIGVtaXR0ZWRcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgYXJndW1lbnRzXG4gKiBkZXNjcmliZWQgYWJvdmUgYW5kIHRoZW4gY29tcGxldGVzLlxuICogQG1ldGhvZCBvZlxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIGxldCBzY2hlZHVsZXIgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gYXMgU2NoZWR1bGVyTGlrZTtcbiAgaWYgKGlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBhcmdzLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlciA9IHVuZGVmaW5lZDtcbiAgfVxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGVtcHR5KHNjaGVkdWxlcik7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHNjaGVkdWxlciA/IGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKSA6IHNjYWxhcihhcmdzWzBdIGFzIFQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZnJvbUFycmF5KGFyZ3MgYXMgVFtdLCBzY2hlZHVsZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgaW1tZWRpYXRlbHlcbiAqIGVtaXRzIGFuIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SnVzdCBlbWl0cyAnZXJyb3InLCBhbmQgbm90aGluZyBlbHNlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXSh0aHJvdy5wbmcpXG4gKlxuICogVGhpcyBzdGF0aWMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBjcmVhdGluZyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgb25seVxuICogZW1pdHMgdGhlIGVycm9yIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcywgc3VjaCBhcyBpbiBhIHtAbGluayBtZXJnZU1hcH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBlbWl0IGFuIGVycm9yXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyB0aHJvd0Vycm9yLCBjb25jYXQsIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3QgcmVzdWx0ID0gY29uY2F0KG9mKDcpLCB0aHJvd0Vycm9yKG5ldyBFcnJvcignb29wcyEnKSkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICogYGBgamF2YXNjcmlwdFxuICpcbiAqICMjIyBNYXAgYW5kIGZsYXR0ZW4gbnVtYmVycyB0byB0aGUgc2VxdWVuY2UgJ2EnLCAnYicsICdjJywgYnV0IHRocm93IGFuIGVycm9yIGZvciAxM1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgdGhyb3dFcnJvciwgaW50ZXJ2YWwsIG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBpbnRlcnZhbCgxMDAwKS5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggPT09IDEzXG4gKiAgICAgPyB0aHJvd0Vycm9yKCdUaGlydGVlbnMgYXJlIGJhZCcpXG4gKiAgICAgOiBvZignYScsICdiJywgJ2MnKVxuICogICApLFxuICogKS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqIEBzZWUge0BsaW5rIGVtcHR5fVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqXG4gKiBAcGFyYW0ge2FueX0gZXJyb3IgVGhlIHBhcnRpY3VsYXIgRXJyb3IgdG8gcGFzcyB0byB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gZXJyb3IgT2JzZXJ2YWJsZTogZW1pdHMgb25seSB0aGUgZXJyb3Igbm90aWZpY2F0aW9uXG4gKiB1c2luZyB0aGUgZ2l2ZW4gZXJyb3IgYXJndW1lbnQuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHRocm93XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvcjogYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxuZXZlcj4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHsgZXJyb3IsIHN1YnNjcmliZXIgfSkpO1xuICB9XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEFyZyB7XG4gIGVycm9yOiBhbnk7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pjtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2goeyBlcnJvciwgc3Vic2NyaWJlciB9OiBEaXNwYXRjaEFyZykge1xuICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbn1cbiIsImltcG9ydCB7IFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwdXNoLWJhc2VkIGV2ZW50IG9yIHZhbHVlIHRoYXQgYW4ge0BsaW5rIE9ic2VydmFibGV9IGNhbiBlbWl0LlxuICogVGhpcyBjbGFzcyBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBvcGVyYXRvcnMgdGhhdCBtYW5hZ2Ugbm90aWZpY2F0aW9ucyxcbiAqIGxpa2Uge0BsaW5rIG1hdGVyaWFsaXplfSwge0BsaW5rIGRlbWF0ZXJpYWxpemV9LCB7QGxpbmsgb2JzZXJ2ZU9ufSwgYW5kXG4gKiBvdGhlcnMuIEJlc2lkZXMgd3JhcHBpbmcgdGhlIGFjdHVhbCBkZWxpdmVyZWQgdmFsdWUsIGl0IGFsc28gYW5ub3RhdGVzIGl0XG4gKiB3aXRoIG1ldGFkYXRhIG9mLCBmb3IgaW5zdGFuY2UsIHdoYXQgdHlwZSBvZiBwdXNoIG1lc3NhZ2UgaXQgaXMgKGBuZXh0YCxcbiAqIGBlcnJvcmAsIG9yIGBjb21wbGV0ZWApLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hdGVyaWFsaXplfVxuICogQHNlZSB7QGxpbmsgZGVtYXRlcmlhbGl6ZX1cbiAqIEBzZWUge0BsaW5rIG9ic2VydmVPbn1cbiAqXG4gKiBAY2xhc3MgTm90aWZpY2F0aW9uPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb248VD4ge1xuICBoYXNWYWx1ZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMga2luZDogc3RyaW5nLCBwdWJsaWMgdmFsdWU/OiBULCBwdWJsaWMgZXJyb3I/OiBhbnkpIHtcbiAgICB0aGlzLmhhc1ZhbHVlID0ga2luZCA9PT0gJ04nO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGl2ZXJzIHRvIHRoZSBnaXZlbiBgb2JzZXJ2ZXJgIHRoZSB2YWx1ZSB3cmFwcGVkIGJ5IHRoaXMgTm90aWZpY2F0aW9uLlxuICAgKiBAcGFyYW0ge09ic2VydmVyfSBvYnNlcnZlclxuICAgKiBAcmV0dXJuXG4gICAqL1xuICBvYnNlcnZlKG9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4pOiBhbnkge1xuICAgIHN3aXRjaCAodGhpcy5raW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLm5leHQgJiYgb2JzZXJ2ZXIubmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuZXJyb3IgJiYgb2JzZXJ2ZXIuZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLmNvbXBsZXRlICYmIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHNvbWUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFja3MsIGRlbGl2ZXIgdGhlIHZhbHVlIHJlcHJlc2VudGVkIGJ5IHRoZVxuICAgKiBjdXJyZW50IE5vdGlmaWNhdGlvbiB0byB0aGUgY29ycmVjdGx5IGNvcnJlc3BvbmRpbmcgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBuZXh0IEFuIE9ic2VydmVyIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGRvKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IGFueSB7XG4gICAgY29uc3Qga2luZCA9IHRoaXMua2luZDtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gbmV4dCAmJiBuZXh0KHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiBlcnJvciAmJiBlcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gY29tcGxldGUgJiYgY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYW4gT2JzZXJ2ZXIgb3IgaXRzIGluZGl2aWR1YWwgY2FsbGJhY2sgZnVuY3Rpb25zLCBhbmQgY2FsbHMgYG9ic2VydmVgXG4gICAqIG9yIGBkb2AgbWV0aG9kcyBhY2NvcmRpbmdseS5cbiAgICogQHBhcmFtIHtPYnNlcnZlcnxmdW5jdGlvbih2YWx1ZTogVCk6IHZvaWR9IG5leHRPck9ic2VydmVyIEFuIE9ic2VydmVyIG9yXG4gICAqIHRoZSBgbmV4dGAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZXJyOiBhbnkpOiB2b2lkfSBbZXJyb3JdIEFuIE9ic2VydmVyIGBlcnJvcmAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBBbiBPYnNlcnZlciBgY29tcGxldGVgIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBhY2NlcHQobmV4dE9yT2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLCBlcnJvcj86IChlcnI6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKG5leHRPck9ic2VydmVyICYmIHR5cGVvZiAoPFBhcnRpYWxPYnNlcnZlcjxUPj5uZXh0T3JPYnNlcnZlcikubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZSg8UGFydGlhbE9ic2VydmVyPFQ+Pm5leHRPck9ic2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZG8oPCh2YWx1ZTogVCkgPT4gdm9pZD5uZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQganVzdCBkZWxpdmVycyB0aGUgbm90aWZpY2F0aW9uIHJlcHJlc2VudGVkXG4gICAqIGJ5IHRoaXMgTm90aWZpY2F0aW9uIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICB0b09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3Qga2luZCA9IHRoaXMua2luZDtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gb2YodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBub3RpZmljYXRpb24ga2luZCB2YWx1ZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY29tcGxldGVOb3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+ID0gbmV3IE5vdGlmaWNhdGlvbignQycpO1xuICBwcml2YXRlIHN0YXRpYyB1bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4gPSBuZXcgTm90aWZpY2F0aW9uKCdOJywgdW5kZWZpbmVkKTtcblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYG5leHRgIGZyb20gYVxuICAgKiBnaXZlbiB2YWx1ZS5cbiAgICogQHBhcmFtIHtUfSB2YWx1ZSBUaGUgYG5leHRgIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248VD59IFRoZSBcIm5leHRcIiBOb3RpZmljYXRpb24gcmVwcmVzZW50aW5nIHRoZVxuICAgKiBhcmd1bWVudC5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVOZXh0PFQ+KHZhbHVlOiBUKTogTm90aWZpY2F0aW9uPFQ+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBOb3RpZmljYXRpb24udW5kZWZpbmVkVmFsdWVOb3RpZmljYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYGVycm9yYCBmcm9tIGFcbiAgICogZ2l2ZW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7YW55fSBbZXJyXSBUaGUgYGVycm9yYCBlcnJvci5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPFQ+fSBUaGUgXCJlcnJvclwiIE5vdGlmaWNhdGlvbiByZXByZXNlbnRpbmcgdGhlXG4gICAqIGFyZ3VtZW50LlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUVycm9yPFQ+KGVycj86IGFueSk6IE5vdGlmaWNhdGlvbjxUPiB7XG4gICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsIGVycik7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYGNvbXBsZXRlYC5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPGFueT59IFRoZSB2YWx1ZWxlc3MgXCJjb21wbGV0ZVwiIE5vdGlmaWNhdGlvbi5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVDb21wbGV0ZSgpOiBOb3RpZmljYXRpb248YW55PiB7XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi5jb21wbGV0ZU5vdGlmaWNhdGlvbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKlxuICogUmUtZW1pdHMgYWxsIG5vdGlmaWNhdGlvbnMgZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIHNwZWNpZmllZCBzY2hlZHVsZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVuc3VyZSBhIHNwZWNpZmljIHNjaGVkdWxlciBpcyB1c2VkLCBmcm9tIG91dHNpZGUgb2YgYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYG9ic2VydmVPbmAgaXMgYW4gb3BlcmF0b3IgdGhhdCBhY2NlcHRzIGEgc2NoZWR1bGVyIGFzIGEgZmlyc3QgcGFyYW1ldGVyLCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gcmVzY2hlZHVsZVxuICogbm90aWZpY2F0aW9ucyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSXQgbWlnaHQgYmUgdXNlZnVsLCBpZiB5b3UgZG8gbm90IGhhdmUgY29udHJvbCBvdmVyXG4gKiBpbnRlcm5hbCBzY2hlZHVsZXIgb2YgYSBnaXZlbiBPYnNlcnZhYmxlLCBidXQgd2FudCB0byBjb250cm9sIHdoZW4gaXRzIHZhbHVlcyBhcmUgZW1pdHRlZCBuZXZlcnRoZWxlc3MuXG4gKlxuICogUmV0dXJuZWQgT2JzZXJ2YWJsZSBlbWl0cyB0aGUgc2FtZSBub3RpZmljYXRpb25zIChuZXh0ZWQgdmFsdWVzLCBjb21wbGV0ZSBhbmQgZXJyb3IgZXZlbnRzKSBhcyB0aGUgc291cmNlIE9ic2VydmFibGUsXG4gKiBidXQgcmVzY2hlZHVsZWQgd2l0aCBwcm92aWRlZCBzY2hlZHVsZXIuIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgbWVhbiB0aGF0IHNvdXJjZSBPYnNlcnZhYmxlcyBpbnRlcm5hbFxuICogc2NoZWR1bGVyIHdpbGwgYmUgcmVwbGFjZWQgaW4gYW55IHdheS4gT3JpZ2luYWwgc2NoZWR1bGVyIHN0aWxsIHdpbGwgYmUgdXNlZCwgYnV0IHdoZW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzXG4gKiBub3RpZmljYXRpb24sIGl0IHdpbGwgYmUgaW1tZWRpYXRlbHkgc2NoZWR1bGVkIGFnYWluIC0gdGhpcyB0aW1lIHdpdGggc2NoZWR1bGVyIHBhc3NlZCB0byBgb2JzZXJ2ZU9uYC5cbiAqIEFuIGFudGktcGF0dGVybiB3b3VsZCBiZSBjYWxsaW5nIGBvYnNlcnZlT25gIG9uIE9ic2VydmFibGUgdGhhdCBlbWl0cyBsb3RzIG9mIHZhbHVlcyBzeW5jaHJvbm91c2x5LCB0byBzcGxpdFxuICogdGhhdCBlbWlzc2lvbnMgaW50byBhc3luY2hyb25vdXMgY2h1bmtzLiBGb3IgdGhpcyB0byBoYXBwZW4sIHNjaGVkdWxlciB3b3VsZCBoYXZlIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgZGlyZWN0bHkgKHVzdWFsbHkgaW50byB0aGUgb3BlcmF0b3IgdGhhdCBjcmVhdGVzIGl0KS4gYG9ic2VydmVPbmAgc2ltcGx5IGRlbGF5cyBub3RpZmljYXRpb25zIGFcbiAqIGxpdHRsZSBiaXQgbW9yZSwgdG8gZW5zdXJlIHRoYXQgdGhleSBhcmUgZW1pdHRlZCBhdCBleHBlY3RlZCBtb21lbnRzLlxuICpcbiAqIEFzIGEgbWF0dGVyIG9mIGZhY3QsIGBvYnNlcnZlT25gIGFjY2VwdHMgc2Vjb25kIHBhcmFtZXRlciwgd2hpY2ggc3BlY2lmaWVzIGluIG1pbGxpc2Vjb25kcyB3aXRoIHdoYXQgZGVsYXkgbm90aWZpY2F0aW9uc1xuICogd2lsbCBiZSBlbWl0dGVkLiBUaGUgbWFpbiBkaWZmZXJlbmNlIGJldHdlZW4ge0BsaW5rIGRlbGF5fSBvcGVyYXRvciBhbmQgYG9ic2VydmVPbmAgaXMgdGhhdCBgb2JzZXJ2ZU9uYFxuICogd2lsbCBkZWxheSBhbGwgbm90aWZpY2F0aW9ucyAtIGluY2x1ZGluZyBlcnJvciBub3RpZmljYXRpb25zIC0gd2hpbGUgYGRlbGF5YCB3aWxsIHBhc3MgdGhyb3VnaCBlcnJvclxuICogZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZSBpbW1lZGlhdGVseSB3aGVuIGl0IGlzIGVtaXR0ZWQuIEluIGdlbmVyYWwgaXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkIHRvIHVzZSBgZGVsYXlgIG9wZXJhdG9yXG4gKiBmb3IgYW55IGtpbmQgb2YgZGVsYXlpbmcgb2YgdmFsdWVzIGluIHRoZSBzdHJlYW0sIHdoaWxlIHVzaW5nIGBvYnNlcnZlT25gIHRvIHNwZWNpZnkgd2hpY2ggc2NoZWR1bGVyIHNob3VsZCBiZSB1c2VkXG4gKiBmb3Igbm90aWZpY2F0aW9uIGVtaXNzaW9ucyBpbiBnZW5lcmFsLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVuc3VyZSB2YWx1ZXMgaW4gc3Vic2NyaWJlIGFyZSBjYWxsZWQganVzdCBiZWZvcmUgYnJvd3NlciByZXBhaW50LlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgaW50ZXJ2YWxzID0gaW50ZXJ2YWwoMTApOyAgICAgICAgICAgICAgICAvLyBJbnRlcnZhbHMgYXJlIHNjaGVkdWxlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIGFzeW5jIHNjaGVkdWxlciBieSBkZWZhdWx0Li4uXG4gKiBpbnRlcnZhbHMucGlwZShcbiAqICAgb2JzZXJ2ZU9uKGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyKSwgICAgICAgICAgLy8gLi4uYnV0IHdlIHdpbGwgb2JzZXJ2ZSBvbiBhbmltYXRpb25GcmFtZVxuICogKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzY2hlZHVsZXIgdG8gZW5zdXJlIHNtb290aCBhbmltYXRpb24uXG4gKiAuc3Vic2NyaWJlKHZhbCA9PiB7XG4gKiAgIHNvbWVEaXYuc3R5bGUuaGVpZ2h0ID0gdmFsICsgJ3B4JztcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBzY2hlZHVsZXIgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlc2NoZWR1bGUgbm90aWZpY2F0aW9ucyBmcm9tIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IHN0YXRlcyB3aXRoIHdoYXQgZGVsYXkgZXZlcnkgbm90aWZpY2F0aW9uIHNob3VsZCBiZSByZXNjaGVkdWxlZC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgc2FtZSBub3RpZmljYXRpb25zIGFzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSxcbiAqIGJ1dCB3aXRoIHByb3ZpZGVkIHNjaGVkdWxlci5cbiAqXG4gKiBAbWV0aG9kIG9ic2VydmVPblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVPbjxUPihzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsIGRlbGF5OiBudW1iZXIgPSAwKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG9ic2VydmVPbk9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBPYnNlcnZlT25PcGVyYXRvcihzY2hlZHVsZXIsIGRlbGF5KSk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNlcnZlT25PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsIHByaXZhdGUgZGVsYXk6IG51bWJlciA9IDApIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgT2JzZXJ2ZU9uU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnNjaGVkdWxlciwgdGhpcy5kZWxheSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZU9uU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxPYnNlcnZlT25NZXNzYWdlPiwgYXJnOiBPYnNlcnZlT25NZXNzYWdlKSB7XG4gICAgY29uc3QgeyBub3RpZmljYXRpb24sIGRlc3RpbmF0aW9uIH0gPSBhcmc7XG4gICAgbm90aWZpY2F0aW9uLm9ic2VydmUoZGVzdGluYXRpb24pO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkZWxheTogbnVtYmVyID0gMCkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVNZXNzYWdlKG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLmFkZCh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShcbiAgICAgIE9ic2VydmVPblN1YnNjcmliZXIuZGlzcGF0Y2gsXG4gICAgICB0aGlzLmRlbGF5LFxuICAgICAgbmV3IE9ic2VydmVPbk1lc3NhZ2Uobm90aWZpY2F0aW9uLCB0aGlzLmRlc3RpbmF0aW9uKVxuICAgICkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5zY2hlZHVsZU1lc3NhZ2UoTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuc2NoZWR1bGVNZXNzYWdlKE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZU9uTWVzc2FnZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+LFxuICAgICAgICAgICAgICBwdWJsaWMgZGVzdGluYXRpb246IFBhcnRpYWxPYnNlcnZlcjxhbnk+KSB7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgcXVldWUgfSBmcm9tICcuL3NjaGVkdWxlci9xdWV1ZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmVPblN1YnNjcmliZXIgfSBmcm9tICcuL29wZXJhdG9ycy9vYnNlcnZlT24nO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuaW1wb3J0IHsgU3ViamVjdFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3ViamVjdFN1YnNjcmlwdGlvbic7XG4vKipcbiAqIEBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG4gIHByaXZhdGUgX2V2ZW50czogKFJlcGxheUV2ZW50PFQ+IHwgVClbXSA9IFtdO1xuICBwcml2YXRlIF9idWZmZXJTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgX3dpbmRvd1RpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaW5maW5pdGVUaW1lV2luZG93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoYnVmZmVyU2l6ZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICB3aW5kb3dUaW1lOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYnVmZmVyU2l6ZSA9IGJ1ZmZlclNpemUgPCAxID8gMSA6IGJ1ZmZlclNpemU7XG4gICAgdGhpcy5fd2luZG93VGltZSA9IHdpbmRvd1RpbWUgPCAxID8gMSA6IHdpbmRvd1RpbWU7XG5cbiAgICBpZiAod2luZG93VGltZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICB0aGlzLl9pbmZpbml0ZVRpbWVXaW5kb3cgPSB0cnVlO1xuICAgICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0SW5maW5pdGVUaW1lV2luZG93O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5leHQgPSB0aGlzLm5leHRUaW1lV2luZG93O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbmV4dEluZmluaXRlVGltZVdpbmRvdyh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IF9ldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgX2V2ZW50cy5wdXNoKHZhbHVlKTtcbiAgICAvLyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBpbnZva2VkIGluIGV2ZXJ5IG5leHQoKSBjYWxsIHRoYW4gdGhlIGJ1ZmZlclxuICAgIC8vIGNhbiBvdmVyZ3JvdyB0aGUgbWF4IHNpemUgb25seSBieSBvbmUgaXRlbVxuICAgIGlmIChfZXZlbnRzLmxlbmd0aCA+IHRoaXMuX2J1ZmZlclNpemUpIHtcbiAgICAgIF9ldmVudHMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dFRpbWVXaW5kb3codmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLl9ldmVudHMucHVzaChuZXcgUmVwbGF5RXZlbnQodGhpcy5fZ2V0Tm93KCksIHZhbHVlKSk7XG4gICAgdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcblxuICAgIHN1cGVyLm5leHQodmFsdWUpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIC8vIFdoZW4gYF9pbmZpbml0ZVRpbWVXaW5kb3cgPT09IHRydWVgIHRoZW4gdGhlIGJ1ZmZlciBpcyBhbHJlYWR5IHRyaW1tZWRcbiAgICBjb25zdCBfaW5maW5pdGVUaW1lV2luZG93ID0gdGhpcy5faW5maW5pdGVUaW1lV2luZG93O1xuICAgIGNvbnN0IF9ldmVudHMgPSBfaW5maW5pdGVUaW1lV2luZG93ID8gdGhpcy5fZXZlbnRzIDogdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcbiAgICBjb25zdCBsZW4gPSBfZXZlbnRzLmxlbmd0aDtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQgfHwgdGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgc3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlciA9IG5ldyBPYnNlcnZlT25TdWJzY3JpYmVyPFQ+KHN1YnNjcmliZXIsIHNjaGVkdWxlcikpO1xuICAgIH1cblxuICAgIGlmIChfaW5maW5pdGVUaW1lV2luZG93KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoPFQ+X2V2ZW50c1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgoPFJlcGxheUV2ZW50PFQ+Pl9ldmVudHNbaV0pLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcih0aGlzLnRocm93bkVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIF9nZXROb3coKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuc2NoZWR1bGVyIHx8IHF1ZXVlKS5ub3coKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk6IFJlcGxheUV2ZW50PFQ+W10ge1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuX2dldE5vdygpO1xuICAgIGNvbnN0IF9idWZmZXJTaXplID0gdGhpcy5fYnVmZmVyU2l6ZTtcbiAgICBjb25zdCBfd2luZG93VGltZSA9IHRoaXMuX3dpbmRvd1RpbWU7XG4gICAgY29uc3QgX2V2ZW50cyA9IDxSZXBsYXlFdmVudDxUPltdPnRoaXMuX2V2ZW50cztcblxuICAgIGNvbnN0IGV2ZW50c0NvdW50ID0gX2V2ZW50cy5sZW5ndGg7XG4gICAgbGV0IHNwbGljZUNvdW50ID0gMDtcblxuICAgIC8vIFRyaW0gZXZlbnRzIHRoYXQgZmFsbCBvdXQgb2YgdGhlIHRpbWUgd2luZG93LlxuICAgIC8vIFN0YXJ0IGF0IHRoZSBmcm9udCBvZiB0aGUgbGlzdC4gQnJlYWsgZWFybHkgb25jZVxuICAgIC8vIHdlIGVuY291bnRlciBhbiBldmVudCB0aGF0IGZhbGxzIHdpdGhpbiB0aGUgd2luZG93LlxuICAgIHdoaWxlIChzcGxpY2VDb3VudCA8IGV2ZW50c0NvdW50KSB7XG4gICAgICBpZiAoKG5vdyAtIF9ldmVudHNbc3BsaWNlQ291bnRdLnRpbWUpIDwgX3dpbmRvd1RpbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzcGxpY2VDb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChldmVudHNDb3VudCA+IF9idWZmZXJTaXplKSB7XG4gICAgICBzcGxpY2VDb3VudCA9IE1hdGgubWF4KHNwbGljZUNvdW50LCBldmVudHNDb3VudCAtIF9idWZmZXJTaXplKTtcbiAgICB9XG5cbiAgICBpZiAoc3BsaWNlQ291bnQgPiAwKSB7XG4gICAgICBfZXZlbnRzLnNwbGljZSgwLCBzcGxpY2VDb3VudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9ldmVudHM7XG4gIH1cblxufVxuXG5jbGFzcyBSZXBsYXlFdmVudDxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lOiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogVCkge1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIEBjbGFzcyBBc3luY1N1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzeW5jU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBwcml2YXRlIHZhbHVlOiBUID0gbnVsbDtcbiAgcHJpdmF0ZSBoYXNOZXh0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgaGFzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pik6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDb21wbGV0ZWQgJiYgdGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLmhhc05leHQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICBzdXBlci5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5oYXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmhhc05leHQpIHtcbiAgICAgIHN1cGVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIHN1cGVyLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiIsImxldCBuZXh0SGFuZGxlID0gMTtcblxuY29uc3QgdGFza3NCeUhhbmRsZTogeyBbaGFuZGxlOiBzdHJpbmddOiAoKSA9PiB2b2lkIH0gPSB7fTtcblxuZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZTogbnVtYmVyKSB7XG4gIGNvbnN0IGNiID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICBpZiAoY2IpIHtcbiAgICBjYigpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBJbW1lZGlhdGUgPSB7XG4gIHNldEltbWVkaWF0ZShjYjogKCkgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgY29uc3QgaGFuZGxlID0gbmV4dEhhbmRsZSsrO1xuICAgIHRhc2tzQnlIYW5kbGVbaGFuZGxlXSA9IGNiO1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gcnVuSWZQcmVzZW50KGhhbmRsZSkpO1xuICAgIHJldHVybiBoYW5kbGU7XG4gIH0sXG5cbiAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICB9LFxufTtcbiIsImltcG9ydCB7IEltbWVkaWF0ZSB9IGZyb20gJy4uL3V0aWwvSW1tZWRpYXRlJztcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc2FwU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQXNhcEFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBc2FwU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFzYXBTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgaXMgZ3JlYXRlciB0aGFuIDAsIHJlcXVlc3QgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIFB1c2ggdGhlIGFjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUuXG4gICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAvLyBJZiBhIG1pY3JvdGFzayBoYXMgYWxyZWFkeSBiZWVuIHNjaGVkdWxlZCwgZG9uJ3Qgc2NoZWR1bGUgYW5vdGhlclxuICAgIC8vIG9uZS4gSWYgYSBtaWNyb3Rhc2sgaGFzbid0IGJlZW4gc2NoZWR1bGVkIHlldCwgc2NoZWR1bGUgb25lIG5vdy4gUmV0dXJuXG4gICAgLy8gdGhlIGN1cnJlbnQgc2NoZWR1bGVkIG1pY3JvdGFzayBpZC5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlZCB8fCAoc2NoZWR1bGVyLnNjaGVkdWxlZCA9IEltbWVkaWF0ZS5zZXRJbW1lZGlhdGUoXG4gICAgICBzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIG51bGwpXG4gICAgKSk7XG4gIH1cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQXNhcFNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBlbXB0eSwgY2FuY2VsIHRoZSByZXF1ZXN0ZWQgbWljcm90YXNrIGFuZFxuICAgIC8vIHNldCB0aGUgc2NoZWR1bGVkIGZsYWcgdG8gdW5kZWZpbmVkIHNvIHRoZSBuZXh0IEFzYXBBY3Rpb24gd2lsbCBzY2hlZHVsZVxuICAgIC8vIGl0cyBvd24uXG4gICAgaWYgKHNjaGVkdWxlci5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgSW1tZWRpYXRlLmNsZWFySW1tZWRpYXRlKGlkKTtcbiAgICAgIHNjaGVkdWxlci5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB1bmRlZmluZWQgc28gdGhlIGFjdGlvbiBrbm93cyB0byByZXF1ZXN0IGEgbmV3IGFzeW5jIGlkIGlmIGl0J3MgcmVzY2hlZHVsZWQuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbmV4cG9ydCBjbGFzcyBBc2FwU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuICBwdWJsaWMgZmx1c2goYWN0aW9uPzogQXN5bmNBY3Rpb248YW55Pik6IHZvaWQge1xuXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qge2FjdGlvbnN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueTtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb3VudDogbnVtYmVyID0gYWN0aW9ucy5sZW5ndGg7XG4gICAgYWN0aW9uID0gYWN0aW9uIHx8IGFjdGlvbnMuc2hpZnQoKTtcblxuICAgIGRvIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXNhcEFjdGlvbiB9IGZyb20gJy4vQXNhcEFjdGlvbic7XG5pbXBvcnQgeyBBc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc2FwU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXNhcCBTY2hlZHVsZXJcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UGVyZm9ybSB0YXNrIGFzIGZhc3QgYXMgaXQgY2FuIGJlIHBlcmZvcm1lZCBhc3luY2hyb25vdXNseTwvc3Bhbj5cbiAqXG4gKiBgYXNhcGAgc2NoZWR1bGVyIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXIgd2hlbiB5b3UgdXNlIGl0IHRvIGRlbGF5IHRhc2tcbiAqIGluIHRpbWUuIElmIGhvd2V2ZXIgeW91IHNldCBkZWxheSB0byBgMGAsIGBhc2FwYCB3aWxsIHdhaXQgZm9yIGN1cnJlbnQgc3luY2hyb25vdXNseSBleGVjdXRpbmdcbiAqIGNvZGUgdG8gZW5kIGFuZCB0aGVuIGl0IHdpbGwgdHJ5IHRvIGV4ZWN1dGUgZ2l2ZW4gdGFzayBhcyBmYXN0IGFzIHBvc3NpYmxlLlxuICpcbiAqIGBhc2FwYCBzY2hlZHVsZXIgd2lsbCBkbyBpdHMgYmVzdCB0byBtaW5pbWl6ZSB0aW1lIGJldHdlZW4gZW5kIG9mIGN1cnJlbnRseSBleGVjdXRpbmcgY29kZVxuICogYW5kIHN0YXJ0IG9mIHNjaGVkdWxlZCB0YXNrLiBUaGlzIG1ha2VzIGl0IGJlc3QgY2FuZGlkYXRlIGZvciBwZXJmb3JtaW5nIHNvIGNhbGxlZCBcImRlZmVycmluZ1wiLlxuICogVHJhZGl0aW9uYWxseSB0aGlzIHdhcyBhY2hpZXZlZCBieSBjYWxsaW5nIGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgLCBidXQgdGhhdCB0ZWNobmlxdWUgaW52b2x2ZXNcbiAqIHNvbWUgKGFsdGhvdWdoIG1pbmltYWwpIHVud2FudGVkIGRlbGF5LlxuICpcbiAqIE5vdGUgdGhhdCB1c2luZyBgYXNhcGAgc2NoZWR1bGVyIGRvZXMgbm90IG5lY2Vzc2FyaWx5IG1lYW4gdGhhdCB5b3VyIHRhc2sgd2lsbCBiZSBmaXJzdCB0byBwcm9jZXNzXG4gKiBhZnRlciBjdXJyZW50bHkgZXhlY3V0aW5nIGNvZGUuIEluIHBhcnRpY3VsYXIsIGlmIHNvbWUgdGFzayB3YXMgYWxzbyBzY2hlZHVsZWQgd2l0aCBgYXNhcGAgYmVmb3JlLFxuICogdGhhdCB0YXNrIHdpbGwgZXhlY3V0ZSBmaXJzdC4gVGhhdCBiZWluZyBzYWlkLCBpZiB5b3UgbmVlZCB0byBzY2hlZHVsZSB0YXNrIGFzeW5jaHJvbm91c2x5LCBidXRcbiAqIGFzIHNvb24gYXMgcG9zc2libGUsIGBhc2FwYCBzY2hlZHVsZXIgaXMgeW91ciBiZXN0IGJldC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb21wYXJlIGFzeW5jIGFuZCBhc2FwIHNjaGVkdWxlcjxcbiAqIGBgYGphdmFzY3JpcHRcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnYXN5bmMnKSk7IC8vIHNjaGVkdWxpbmcgJ2FzeW5jJyBmaXJzdC4uLlxuICogUnguU2NoZWR1bGVyLmFzYXAuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ2FzYXAnKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiYXNhcFwiXG4gKiAvLyBcImFzeW5jXCJcbiAqIC8vIC4uLiBidXQgJ2FzYXAnIGdvZXMgZmlyc3QhXG4gKiBgYGBcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYXNhcFxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhc2FwID0gbmV3IEFzYXBTY2hlZHVsZXIoQXNhcEFjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXN5bmMgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlNjaGVkdWxlIHRhc2sgYXMgaWYgeW91IHVzZWQgc2V0VGltZW91dCh0YXNrLCBkdXJhdGlvbik8L3NwYW4+XG4gKlxuICogYGFzeW5jYCBzY2hlZHVsZXIgc2NoZWR1bGVzIHRhc2tzIGFzeW5jaHJvbm91c2x5LCBieSBwdXR0aW5nIHRoZW0gb24gdGhlIEphdmFTY3JpcHRcbiAqIGV2ZW50IGxvb3AgcXVldWUuIEl0IGlzIGJlc3QgdXNlZCB0byBkZWxheSB0YXNrcyBpbiB0aW1lIG9yIHRvIHNjaGVkdWxlIHRhc2tzIHJlcGVhdGluZ1xuICogaW4gaW50ZXJ2YWxzLlxuICpcbiAqIElmIHlvdSBqdXN0IHdhbnQgdG8gXCJkZWZlclwiIHRhc2ssIHRoYXQgaXMgdG8gcGVyZm9ybSBpdCByaWdodCBhZnRlciBjdXJyZW50bHlcbiAqIGV4ZWN1dGluZyBzeW5jaHJvbm91cyBjb2RlIGVuZHMgKGNvbW1vbmx5IGFjaGlldmVkIGJ5IGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgKSxcbiAqIGJldHRlciBjaG9pY2Ugd2lsbCBiZSB0aGUge0BsaW5rIGFzYXBTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogVXNlIGFzeW5jIHNjaGVkdWxlciB0byBkZWxheSB0YXNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0YXNrID0gKCkgPT4gY29uc29sZS5sb2coJ2l0IHdvcmtzIScpO1xuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAyMDAwKTtcbiAqXG4gKiAvLyBBZnRlciAyIHNlY29uZHMgbG9nczpcbiAqIC8vIFwiaXQgd29ya3MhXCJcbiAqIGBgYFxuICpcbiAqIFVzZSBhc3luYyBzY2hlZHVsZXIgdG8gcmVwZWF0IHRhc2sgaW4gaW50ZXJ2YWxzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiB0YXNrKHN0YXRlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAqICAgdGhpcy5zY2hlZHVsZShzdGF0ZSArIDEsIDEwMDApOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlIGFuZCBkZWxheVxuICogfVxuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAzMDAwLCAwKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMCBhZnRlciAzc1xuICogLy8gMSBhZnRlciA0c1xuICogLy8gMiBhZnRlciA1c1xuICogLy8gMyBhZnRlciA2c1xuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhc3luY1xuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhc3luYyA9IG5ldyBBc3luY1NjaGVkdWxlcihBc3luY0FjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZUFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBpcyBncmVhdGVyIHRoYW4gMCwgcmVxdWVzdCBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gUHVzaCB0aGUgYWN0aW9uIHRvIHRoZSBlbmQgb2YgdGhlIHNjaGVkdWxlciBxdWV1ZS5cbiAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIC8vIElmIGFuIGFuaW1hdGlvbiBmcmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZCwgZG9uJ3QgcmVxdWVzdCBhbm90aGVyXG4gICAgLy8gb25lLiBJZiBhbiBhbmltYXRpb24gZnJhbWUgaGFzbid0IGJlZW4gcmVxdWVzdGVkIHlldCwgcmVxdWVzdCBvbmUuIFJldHVyblxuICAgIC8vIHRoZSBjdXJyZW50IGFuaW1hdGlvbiBmcmFtZSByZXF1ZXN0IGlkLlxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGVkIHx8IChzY2hlZHVsZXIuc2NoZWR1bGVkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKFxuICAgICAgKCkgPT4gc2NoZWR1bGVyLmZsdXNoKG51bGwpKSk7XG4gIH1cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBzY2hlZHVsZXIgcXVldWUgaXMgZW1wdHksIGNhbmNlbCB0aGUgcmVxdWVzdGVkIGFuaW1hdGlvbiBmcmFtZSBhbmRcbiAgICAvLyBzZXQgdGhlIHNjaGVkdWxlZCBmbGFnIHRvIHVuZGVmaW5lZCBzbyB0aGUgbmV4dCBBbmltYXRpb25GcmFtZUFjdGlvbiB3aWxsXG4gICAgLy8gcmVxdWVzdCBpdHMgb3duLlxuICAgIGlmIChzY2hlZHVsZXIuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgICAgIHNjaGVkdWxlci5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB1bmRlZmluZWQgc28gdGhlIGFjdGlvbiBrbm93cyB0byByZXF1ZXN0IGEgbmV3IGFzeW5jIGlkIGlmIGl0J3MgcmVzY2hlZHVsZWQuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgcHVibGljIGZsdXNoKGFjdGlvbj86IEFzeW5jQWN0aW9uPGFueT4pOiB2b2lkIHtcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHthY3Rpb25zfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IGFjdGlvbnMubGVuZ3RoO1xuICAgIGFjdGlvbiA9IGFjdGlvbiB8fCBhY3Rpb25zLnNoaWZ0KCk7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKTtcblxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFuaW1hdGlvbkZyYW1lQWN0aW9uIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZUFjdGlvbic7XG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXInO1xuXG4vKipcbiAqXG4gKiBBbmltYXRpb24gRnJhbWUgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlBlcmZvcm0gdGFzayB3aGVuIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3b3VsZCBmaXJlPC9zcGFuPlxuICpcbiAqIFdoZW4gYGFuaW1hdGlvbkZyYW1lYCBzY2hlZHVsZXIgaXMgdXNlZCB3aXRoIGRlbGF5LCBpdCB3aWxsIGZhbGwgYmFjayB0byB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlclxuICogYmVoYXZpb3VyLlxuICpcbiAqIFdpdGhvdXQgZGVsYXksIGBhbmltYXRpb25GcmFtZWAgc2NoZWR1bGVyIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBzbW9vdGggYnJvd3NlciBhbmltYXRpb25zLlxuICogSXQgbWFrZXMgc3VyZSBzY2hlZHVsZWQgdGFzayB3aWxsIGhhcHBlbiBqdXN0IGJlZm9yZSBuZXh0IGJyb3dzZXIgY29udGVudCByZXBhaW50LFxuICogdGh1cyBwZXJmb3JtaW5nIGFuaW1hdGlvbnMgYXMgZWZmaWNpZW50bHkgYXMgcG9zc2libGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2NoZWR1bGUgZGl2IGhlaWdodCBhbmltYXRpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb21lLWRpdicpO1xuICpcbiAqIFJ4LlNjaGVkdWxlci5hbmltYXRpb25GcmFtZS5zY2hlZHVsZShmdW5jdGlvbihoZWlnaHQpIHtcbiAqICAgZGl2LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAqXG4gKiAgIHRoaXMuc2NoZWR1bGUoaGVpZ2h0ICsgMSk7ICAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdlIHJlc2NoZWR1bGUgd2l0aCBuZXcgc3RhdGVcbiAqIH0sIDAsIDApO1xuICpcbiAqIC8vIFlvdSB3aWxsIHNlZSAuc29tZS1kaXYgZWxlbWVudCBncm93aW5nIGluIGhlaWdodFxuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhbmltYXRpb25GcmFtZVxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhbmltYXRpb25GcmFtZSA9IG5ldyBBbmltYXRpb25GcmFtZVNjaGVkdWxlcihBbmltYXRpb25GcmFtZUFjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGltZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcblxuICBwcm90ZWN0ZWQgc3RhdGljIGZyYW1lVGltZUZhY3RvcjogbnVtYmVyID0gMTA7XG5cbiAgcHVibGljIGZyYW1lOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgaW5kZXg6IG51bWJlciA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFzeW5jQWN0aW9uID0gVmlydHVhbEFjdGlvbiBhcyBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyBtYXhGcmFtZXM6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgIHN1cGVyKFNjaGVkdWxlckFjdGlvbiwgKCkgPT4gdGhpcy5mcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbXB0IHRoZSBTY2hlZHVsZXIgdG8gZXhlY3V0ZSBhbGwgb2YgaXRzIHF1ZXVlZCBhY3Rpb25zLCB0aGVyZWZvcmVcbiAgICogY2xlYXJpbmcgaXRzIHF1ZXVlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcHVibGljIGZsdXNoKCk6IHZvaWQge1xuXG4gICAgY29uc3Qge2FjdGlvbnMsIG1heEZyYW1lc30gPSB0aGlzO1xuICAgIGxldCBlcnJvcjogYW55LCBhY3Rpb246IEFzeW5jQWN0aW9uPGFueT47XG5cbiAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkgJiYgKHRoaXMuZnJhbWUgPSBhY3Rpb24uZGVsYXkpIDw9IG1heEZyYW1lcykge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAbm9kb2NcbiAqL1xuZXhwb3J0IGNsYXNzIFZpcnR1YWxBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgcHJvdGVjdGVkIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gc2NoZWR1bGVyLmluZGV4ICs9IDEpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgIHRoaXMuaW5kZXggPSBzY2hlZHVsZXIuaW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIC8vIElmIGFuIGFjdGlvbiBpcyByZXNjaGVkdWxlZCwgd2Ugc2F2ZSBhbGxvY2F0aW9ucyBieSBtdXRhdGluZyBpdHMgc3RhdGUsXG4gICAgLy8gcHVzaGluZyBpdCB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUsIGFuZCByZWN5Y2xpbmcgdGhlIGFjdGlvbi5cbiAgICAvLyBCdXQgc2luY2UgdGhlIFZpcnR1YWxUaW1lU2NoZWR1bGVyIGlzIHVzZWQgZm9yIHRlc3RpbmcsIFZpcnR1YWxBY3Rpb25zXG4gICAgLy8gbXVzdCBiZSBpbW11dGFibGUgc28gdGhleSBjYW4gYmUgaW5zcGVjdGVkIGxhdGVyLlxuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBWaXJ0dWFsQWN0aW9uKHRoaXMuc2NoZWR1bGVyLCB0aGlzLndvcmspO1xuICAgIHRoaXMuYWRkKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgdGhpcy5kZWxheSA9IHNjaGVkdWxlci5mcmFtZSArIGRlbGF5O1xuICAgIGNvbnN0IHthY3Rpb25zfSA9IHNjaGVkdWxlcjtcbiAgICBhY3Rpb25zLnB1c2godGhpcyk7XG4gICAgKGFjdGlvbnMgYXMgQXJyYXk8VmlydHVhbEFjdGlvbjxUPj4pLnNvcnQoVmlydHVhbEFjdGlvbi5zb3J0QWN0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBWaXJ0dWFsVGltZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9leGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzdXBlci5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc29ydEFjdGlvbnM8VD4oYTogVmlydHVhbEFjdGlvbjxUPiwgYjogVmlydHVhbEFjdGlvbjxUPikge1xuICAgIGlmIChhLmRlbGF5ID09PSBiLmRlbGF5KSB7XG4gICAgICBpZiAoYS5pbmRleCA9PT0gYi5pbmRleCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSBpZiAoYS5pbmRleCA+IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhLmRlbGF5ID4gYi5kZWxheSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eTxUPih4OiBUKTogVCB7XG4gIHJldHVybiB4O1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRlc3RzIHRvIHNlZSBpZiB0aGUgb2JqZWN0IGlzIGFuIFJ4SlMge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAcGFyYW0gb2JqIHRoZSBvYmplY3QgdG8gdGVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYnNlcnZhYmxlPFQ+KG9iajogYW55KTogb2JqIGlzIE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gISFvYmogJiYgKG9iaiBpbnN0YW5jZW9mIE9ic2VydmFibGUgfHwgKHR5cGVvZiBvYmoubGlmdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJykpO1xufVxuIiwiLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhbiBlbGVtZW50IHdhcyBxdWVyaWVkIGF0IGEgY2VydGFpbiBpbmRleCBvZiBhblxuICogT2JzZXJ2YWJsZSwgYnV0IG5vIHN1Y2ggaW5kZXggb3IgcG9zaXRpb24gZXhpc3RzIGluIHRoYXQgc2VxdWVuY2UuXG4gKlxuICogQHNlZSB7QGxpbmsgZWxlbWVudEF0fVxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqIEBzZWUge0BsaW5rIHRha2VMYXN0fVxuICpcbiAqIEBjbGFzcyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvclxuICovXG5leHBvcnQgY2xhc3MgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cbiAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSAnQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdhcmd1bWVudCBvdXQgb2YgcmFuZ2UnKTtcbiAgICAoT2JqZWN0IGFzIGFueSkuc2V0UHJvdG90eXBlT2YodGhpcywgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhbiBPYnNlcnZhYmxlIG9yIGEgc2VxdWVuY2Ugd2FzIHF1ZXJpZWQgYnV0IGhhcyBub1xuICogZWxlbWVudHMuXG4gKlxuICogQHNlZSB7QGxpbmsgZmlyc3R9XG4gKiBAc2VlIHtAbGluayBsYXN0fVxuICogQHNlZSB7QGxpbmsgc2luZ2xlfVxuICpcbiAqIEBjbGFzcyBFbXB0eUVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBFbXB0eUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXG4gIHB1YmxpYyByZWFkb25seSBuYW1lID0gJ0VtcHR5RXJyb3InO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdubyBlbGVtZW50cyBpbiBzZXF1ZW5jZScpO1xuICAgIChPYmplY3QgYXMgYW55KS5zZXRQcm90b3R5cGVPZih0aGlzLCBFbXB0eUVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsIi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gZHVldGltZSBlbGFwc2VzLlxuICpcbiAqIEBzZWUge0BsaW5rIHRpbWVvdXR9XG4gKlxuICogQGNsYXNzIFRpbWVvdXRFcnJvclxuICovXG5leHBvcnQgY2xhc3MgVGltZW91dEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXG4gIHB1YmxpYyByZWFkb25seSBuYW1lID0gJ1RpbWVvdXRFcnJvcic7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoJ1RpbWVvdXQgaGFzIG9jY3VycmVkJyk7XG4gICAgKE9iamVjdCBhcyBhbnkpLnNldFByb3RvdHlwZU9mKHRoaXMsIFRpbWVvdXRFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQXBwbGllcyBhIGdpdmVuIGBwcm9qZWN0YCBmdW5jdGlvbiB0byBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSwgYW5kIGVtaXRzIHRoZSByZXN1bHRpbmcgdmFsdWVzIGFzIGFuIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2UgW0FycmF5LnByb3RvdHlwZS5tYXAoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwKSxcbiAqIGl0IHBhc3NlcyBlYWNoIHNvdXJjZSB2YWx1ZSB0aHJvdWdoIGEgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gdG8gZ2V0XG4gKiBjb3JyZXNwb25kaW5nIG91dHB1dCB2YWx1ZXMuPC9zcGFuPlxuICpcbiAqICFbXShtYXAucG5nKVxuICpcbiAqIFNpbWlsYXIgdG8gdGhlIHdlbGwga25vd24gYEFycmF5LnByb3RvdHlwZS5tYXBgIGZ1bmN0aW9uLCB0aGlzIG9wZXJhdG9yXG4gKiBhcHBsaWVzIGEgcHJvamVjdGlvbiB0byBlYWNoIHZhbHVlIGFuZCBlbWl0cyB0aGF0IHByb2plY3Rpb24gaW4gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBNYXAgZXZlcnkgY2xpY2sgdG8gdGhlIGNsaWVudFggcG9zaXRpb24gb2YgdGhhdCBjbGlja1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHBvc2l0aW9ucyA9IGNsaWNrcy5waXBlKG1hcChldiA9PiBldi5jbGllbnRYKSk7XG4gKiBwb3NpdGlvbnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWFwVG99XG4gKiBAc2VlIHtAbGluayBwbHVja31cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogUn0gcHJvamVjdCBUaGUgZnVuY3Rpb24gdG8gYXBwbHlcbiAqIHRvIGVhY2ggYHZhbHVlYCBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gVGhlIGBpbmRleGAgcGFyYW1ldGVyIGlzXG4gKiB0aGUgbnVtYmVyIGBpYCBmb3IgdGhlIGktdGggZW1pc3Npb24gdGhhdCBoYXMgaGFwcGVuZWQgc2luY2UgdGhlXG4gKiBzdWJzY3JpcHRpb24sIHN0YXJ0aW5nIGZyb20gdGhlIG51bWJlciBgMGAuXG4gKiBAcGFyYW0ge2FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIGFyZ3VtZW50IHRvIGRlZmluZSB3aGF0IGB0aGlzYCBpcyBpbiB0aGVcbiAqIGBwcm9qZWN0YCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8Uj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSB0cmFuc2Zvcm1lZCBieSB0aGUgZ2l2ZW4gYHByb2plY3RgIGZ1bmN0aW9uLlxuICogQG1ldGhvZCBtYXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiBmdW5jdGlvbiBtYXBPcGVyYXRpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgaWYgKHR5cGVvZiBwcm9qZWN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvbi4gQXJlIHlvdSBsb29raW5nIGZvciBgbWFwVG8oKWA/Jyk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgTWFwT3BlcmF0b3IocHJvamVjdCwgdGhpc0FyZykpO1xuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgTWFwT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCBwcml2YXRlIHRoaXNBcmc6IGFueSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE1hcFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcm9qZWN0LCB0aGlzLnRoaXNBcmcpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgTWFwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSB0aGlzQXJnOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLFxuICAgICAgICAgICAgICB0aGlzQXJnOiBhbnkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy50aGlzQXJnID0gdGhpc0FyZyB8fCB0aGlzO1xuICB9XG5cbiAgLy8gTk9URTogVGhpcyBsb29rcyB1bm9wdGltaXplZCwgYnV0IGl0J3MgYWN0dWFsbHkgcHVycG9zZWZ1bGx5IE5PVFxuICAvLyB1c2luZyB0cnkvY2F0Y2ggb3B0aW1pemF0aW9ucy5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByb2plY3QuY2FsbCh0aGlzLnRoaXNBcmcsIHZhbHVlLCB0aGlzLmNvdW50KyspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQocmVzdWx0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgYSBtYXBwaW5nIGZ1bmN0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgocmVzdWx0OiBSKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgoLi4ucmVzdWx0czogUltdKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSW10+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuLy8gdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGhcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbGxiYWNrIEFQSSB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5HaXZlIGl0IGEgZnVuY3Rpb24gYGZgIG9mIHR5cGUgYGYoeCwgY2FsbGJhY2spYCBhbmRcbiAqIGl0IHdpbGwgcmV0dXJuIGEgZnVuY3Rpb24gYGdgIHRoYXQgd2hlbiBjYWxsZWQgYXMgYGcoeClgIHdpbGwgb3V0cHV0IGFuXG4gKiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgYmluZENhbGxiYWNrYCBpcyBub3QgYW4gb3BlcmF0b3IgYmVjYXVzZSBpdHMgaW5wdXQgYW5kIG91dHB1dCBhcmUgbm90XG4gKiBPYnNlcnZhYmxlcy4gVGhlIGlucHV0IGlzIGEgZnVuY3Rpb24gYGZ1bmNgIHdpdGggc29tZSBwYXJhbWV0ZXJzLCB0aGVcbiAqIGxhc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGBmdW5jYCBjYWxscyB3aGVuIGl0IGlzXG4gKiBkb25lLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgYGJpbmRDYWxsYmFja2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzYW1lIHBhcmFtZXRlcnNcbiAqIGFzIGBmdW5jYCwgZXhjZXB0IHRoZSBsYXN0IG9uZSAodGhlIGNhbGxiYWNrKS4gV2hlbiB0aGUgb3V0cHV0IGZ1bmN0aW9uXG4gKiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgaXQgd2lsbCByZXR1cm4gYW4gT2JzZXJ2YWJsZS4gSWYgZnVuY3Rpb24gYGZ1bmNgXG4gKiBjYWxscyBpdHMgY2FsbGJhY2sgd2l0aCBvbmUgYXJndW1lbnQgdGhlIE9ic2VydmFibGUgd2lsbCBlbWl0IHRoYXQgdmFsdWUuXG4gKiBJZiBvbiB0aGUgb3RoZXIgaGFuZCB0aGUgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggbXVsdGlwbGUgdmFsdWVzIHRoZSByZXN1bHRpbmdcbiAqIE9ic2VydmFibGUgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggc2FpZCB2YWx1ZXMgYXMgYXJndW1lbnRzLlxuICpcbiAqIEl0IGlzIHZlcnkgaW1wb3J0YW50IHRvIHJlbWVtYmVyIHRoYXQgaW5wdXQgZnVuY3Rpb24gYGZ1bmNgIGlzIG5vdCBjYWxsZWRcbiAqIHdoZW4gdGhlIG91dHB1dCBmdW5jdGlvbiBpcywgYnV0IHJhdGhlciB3aGVuIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvdXRwdXRcbiAqIGZ1bmN0aW9uIGlzIHN1YnNjcmliZWQuIFRoaXMgbWVhbnMgaWYgYGZ1bmNgIG1ha2VzIGFuIEFKQVggcmVxdWVzdCwgdGhhdCByZXF1ZXN0XG4gKiB3aWxsIGJlIG1hZGUgZXZlcnkgdGltZSBzb21lb25lIHN1YnNjcmliZXMgdG8gdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLCBidXQgbm90IGJlZm9yZS5cbiAqXG4gKiBUaGUgbGFzdCBvcHRpb25hbCBwYXJhbWV0ZXIgLSBgc2NoZWR1bGVyYCAtIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgd2hlbiB0aGUgY2FsbFxuICogdG8gYGZ1bmNgIGhhcHBlbnMgYWZ0ZXIgc29tZW9uZSBzdWJzY3JpYmVzIHRvIE9ic2VydmFibGUsIGFzIHdlbGwgYXMgd2hlbiByZXN1bHRzXG4gKiBwYXNzZWQgdG8gY2FsbGJhY2sgd2lsbCBiZSBlbWl0dGVkLiBCeSBkZWZhdWx0LCB0aGUgc3Vic2NyaXB0aW9uIHRvICBhbiBPYnNlcnZhYmxlIGNhbGxzIGBmdW5jYFxuICogc3luY2hyb25vdXNseSwgYnV0IHVzaW5nIHtAbGluayBhc3luY1NjaGVkdWxlcn0gYXMgdGhlIGxhc3QgcGFyYW1ldGVyIHdpbGwgZGVmZXIgdGhlIGNhbGwgdG8gYGZ1bmNgLFxuICoganVzdCBsaWtlIHdyYXBwaW5nIHRoZSBjYWxsIGluIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAgd291bGQuIElmIHlvdSB1c2UgdGhlIGFzeW5jIFNjaGVkdWxlclxuICogYW5kIGNhbGwgYHN1YnNjcmliZWAgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlIGFsbCBmdW5jdGlvbiBjYWxscyB0aGF0IGFyZSBjdXJyZW50bHkgZXhlY3V0aW5nXG4gKiB3aWxsIGVuZCBiZWZvcmUgYGZ1bmNgIGlzIGludm9rZWQuXG4gKlxuICogQnkgZGVmYXVsdCByZXN1bHRzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgYXJlIGVtaXR0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYGZ1bmNgIGludm9rZXMgdGhlIGNhbGxiYWNrLlxuICogSW4gcGFydGljdWxhciwgaWYgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCBzeW5jaHJvbm91c2x5IHRoZSBzdWJzY3JpcHRpb24gb2YgdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlXG4gKiB3aWxsIGNhbGwgdGhlIGBuZXh0YCBmdW5jdGlvbiBzeW5jaHJvbm91c2x5IGFzIHdlbGwuICBJZiB5b3Ugd2FudCB0byBkZWZlciB0aGF0IGNhbGwsXG4gKiB5b3UgbWF5IHVzZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGp1c3QgYXMgYmVmb3JlLiAgVGhpcyBtZWFucyB0aGF0IGJ5IHVzaW5nIGBTY2hlZHVsZXIuYXN5bmNgIHlvdSBjYW5cbiAqIGVuc3VyZSB0aGF0IGBmdW5jYCBhbHdheXMgY2FsbHMgaXRzIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5LCB0aHVzIGF2b2lkaW5nIHRlcnJpZnlpbmcgWmFsZ28uXG4gKlxuICogTm90ZSB0aGF0IHRoZSBPYnNlcnZhYmxlIGNyZWF0ZWQgYnkgdGhlIG91dHB1dCBmdW5jdGlvbiB3aWxsIGFsd2F5cyBlbWl0IGEgc2luZ2xlIHZhbHVlXG4gKiBhbmQgdGhlbiBjb21wbGV0ZSBpbW1lZGlhdGVseS4gSWYgYGZ1bmNgIGNhbGxzIHRoZSBjYWxsYmFjayBtdWx0aXBsZSB0aW1lcywgdmFsdWVzIGZyb20gc3Vic2VxdWVudFxuICogY2FsbHMgd2lsbCBub3QgYXBwZWFyIGluIHRoZSBzdHJlYW0uIElmIHlvdSBuZWVkIHRvIGxpc3RlbiBmb3IgbXVsdGlwbGUgY2FsbHMsXG4gKiAgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIHtAbGluayBmcm9tRXZlbnR9IG9yIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSBpbnN0ZWFkLlxuICpcbiAqIElmIGBmdW5jYCBkZXBlbmRzIG9uIHNvbWUgY29udGV4dCAoYHRoaXNgIHByb3BlcnR5KSBhbmQgaXMgbm90IGFscmVhZHkgYm91bmQgdGhlIGNvbnRleHQgb2YgYGZ1bmNgXG4gKiB3aWxsIGJlIHRoZSBjb250ZXh0IHRoYXQgdGhlIG91dHB1dCBmdW5jdGlvbiBoYXMgYXQgY2FsbCB0aW1lLiBJbiBwYXJ0aWN1bGFyLCBpZiBgZnVuY2BcbiAqIGlzIGNhbGxlZCBhcyBhIG1ldGhvZCBvZiBzb21lIG9iamVjIGFuZCBpZiBgZnVuY2AgaXMgbm90IGFscmVhZHkgYm91bmQsIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0XG4gKiBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHRoZSBjb250ZXh0IG9mIHRoZSBvdXRwdXQgZnVuY3Rpb24gaXMgc2V0IHRvIHRoYXQgb2JqZWN0IGFzIHdlbGwuXG4gKlxuICogSWYgdGhlIGlucHV0IGZ1bmN0aW9uIGNhbGxzIGl0cyBjYWxsYmFjayBpbiB0aGUgXCJub2RlIHN0eWxlXCIgKGkuZS4gZmlyc3QgYXJndW1lbnQgdG8gY2FsbGJhY2sgaXNcbiAqIG9wdGlvbmFsIGVycm9yIHBhcmFtZXRlciBzaWduYWxpbmcgd2hldGhlciB0aGUgY2FsbCBmYWlsZWQgb3Igbm90KSwge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBwcm92aWRlcyBjb252ZW5pZW50IGVycm9yIGhhbmRsaW5nIGFuZCBwcm9iYWJseSBpcyBhIGJldHRlciBjaG9pY2UuXG4gKiBgYmluZENhbGxiYWNrYCB3aWxsIHRyZWF0IHN1Y2ggZnVuY3Rpb25zIHRoZSBzYW1lIGFzIGFueSBvdGhlciBhbmQgZXJyb3IgcGFyYW1ldGVyc1xuICogKHdoZXRoZXIgcGFzc2VkIG9yIG5vdCkgd2lsbCBhbHdheXMgYmUgaW50ZXJwcmV0ZWQgYXMgcmVndWxhciBjYWxsYmFjayBhcmd1bWVudC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqICMjIyBDb252ZXJ0IGpRdWVyeSdzIGdldEpTT04gdG8gYW4gT2JzZXJ2YWJsZSBBUElcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIFN1cHBvc2Ugd2UgaGF2ZSBqUXVlcnkuZ2V0SlNPTignL215L3VybCcsIGNhbGxiYWNrKVxuICogdmFyIGdldEpTT05Bc09ic2VydmFibGUgPSBiaW5kQ2FsbGJhY2soalF1ZXJ5LmdldEpTT04pO1xuICogdmFyIHJlc3VsdCA9IGdldEpTT05Bc09ic2VydmFibGUoJy9teS91cmwnKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBSZWNlaXZlIGFuIGFycmF5IG9mIGFyZ3VtZW50cyBwYXNzZWQgdG8gYSBjYWxsYmFja1xuICogYGBgamF2YXNjcmlwdFxuICogc29tZUZ1bmN0aW9uKChhLCBiLCBjKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiAgIGNvbnNvbGUubG9nKGIpOyAvLyAnc29tZSBzdHJpbmcnXG4gKiAgIGNvbnNvbGUubG9nKGMpOyAvLyB7c29tZVByb3BlcnR5OiAnc29tZVZhbHVlJ31cbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZENhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpLnN1YnNjcmliZSh2YWx1ZXMgPT4ge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZXMpIC8vIFs1LCAnc29tZSBzdHJpbmcnLCB7c29tZVByb3BlcnR5OiAnc29tZVZhbHVlJ31dXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb21wYXJlIGJlaGF2aW91ciB3aXRoIGFuZCB3aXRob3V0IGFzeW5jIFNjaGVkdWxlclxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseShjYikge1xuICogICBjYigpO1xuICogfVxuICpcbiAqIGNvbnN0IGJvdW5kU3luY0ZuID0gYmluZENhbGxiYWNrKGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHkpO1xuICogY29uc3QgYm91bmRBc3luY0ZuID0gYmluZENhbGxiYWNrKGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHksIG51bGwsIFJ4LlNjaGVkdWxlci5hc3luYyk7XG4gKlxuICogYm91bmRTeW5jRm4oKS5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ0kgd2FzIHN5bmMhJykpO1xuICogYm91bmRBc3luY0ZuKCkuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdJIHdhcyBhc3luYyEnKSk7XG4gKiBjb25zb2xlLmxvZygnVGhpcyBoYXBwZW5lZC4uLicpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBJIHdhcyBzeW5jIVxuICogLy8gVGhpcyBoYXBwZW5lZC4uLlxuICogLy8gSSB3YXMgYXN5bmMhXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGJpbmRDYWxsYmFjayBvbiBhbiBvYmplY3QgbWV0aG9kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBib3VuZE1ldGhvZCA9IGJpbmRDYWxsYmFjayhzb21lT2JqZWN0Lm1ldGhvZFdpdGhDYWxsYmFjayk7XG4gKiBib3VuZE1ldGhvZC5jYWxsKHNvbWVPYmplY3QpIC8vIG1ha2Ugc3VyZSBtZXRob2RXaXRoQ2FsbGJhY2sgaGFzIGFjY2VzcyB0byBzb21lT2JqZWN0XG4gKiAuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyBBIGZ1bmN0aW9uIHdpdGggYSBjYWxsYmFjayBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFRoZSBzY2hlZHVsZXIgb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlXG4gKiBjYWxsYmFja3MuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5wYXJhbXM6ICopOiBPYnNlcnZhYmxlfSBBIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlXG4gKiBPYnNlcnZhYmxlIHRoYXQgZGVsaXZlcnMgdGhlIHNhbWUgdmFsdWVzIHRoZSBjYWxsYmFjayB3b3VsZCBkZWxpdmVyLlxuICogQG5hbWUgYmluZENhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8VD4oXG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sXG4gIHJlc3VsdFNlbGVjdG9yPzogRnVuY3Rpb258U2NoZWR1bGVyTGlrZSxcbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZVxuKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFQ+IHtcbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgaWYgKGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYywgc2NoZWR1bGVyKSguLi5hcmdzKS5waXBlKFxuICAgICAgICBtYXAoKGFyZ3MpID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgbGV0IHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBjb250ZXh0LFxuICAgICAgc3ViamVjdCxcbiAgICAgIGNhbGxiYWNrRnVuYyxcbiAgICAgIHNjaGVkdWxlcixcbiAgICB9O1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGlmICghc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQoaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzKTtcbiAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPiA9IHtcbiAgICAgICAgICBhcmdzLCBzdWJzY3JpYmVyLCBwYXJhbXMsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hTdGF0ZTxUPj4oZGlzcGF0Y2gsIDAsIHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoU3RhdGU8VD4ge1xuICBhcmdzOiBhbnlbXTtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgcGFyYW1zOiBQYXJhbXNDb250ZXh0PFQ+O1xufVxuXG5pbnRlcmZhY2UgUGFyYW1zQ29udGV4dDxUPiB7XG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb247XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZTtcbiAgY29udGV4dDogYW55O1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEaXNwYXRjaFN0YXRlPFQ+Piwgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGNvbnN0IHsgYXJncywgc3Vic2NyaWJlciwgcGFyYW1zIH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBjYWxsYmFja0Z1bmMsIGNvbnRleHQsIHNjaGVkdWxlciB9ID0gcGFyYW1zO1xuICBsZXQgeyBzdWJqZWN0IH0gPSBwYXJhbXM7XG4gIGlmICghc3ViamVjdCkge1xuICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3M7XG4gICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8TmV4dFN0YXRlPFQ+PihkaXNwYXRjaE5leHQsIDAsIHsgdmFsdWUsIHN1YmplY3QgfSkpO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGQoc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xufVxuXG5pbnRlcmZhY2UgTmV4dFN0YXRlPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICB2YWx1ZTogVDtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hOZXh0PFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxOZXh0U3RhdGU8VD4+LCBzdGF0ZTogTmV4dFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgdmFsdWUsIHN1YmplY3QgfSA9IHN0YXRlO1xuICBzdWJqZWN0Lm5leHQodmFsdWUpO1xuICBzdWJqZWN0LmNvbXBsZXRlKCk7XG59XG5cbmludGVyZmFjZSBFcnJvclN0YXRlPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBlcnI6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvcjxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RXJyb3JTdGF0ZTxUPj4sIHN0YXRlOiBFcnJvclN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgZXJyLCBzdWJqZWN0IH0gPSBzdGF0ZTtcbiAgc3ViamVjdC5lcnJvcihlcnIpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBkZXByZWNhdGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTU+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPHZvaWQ+OyAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbi8qKlxuICogQ29udmVydHMgYSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrIEFQSSB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhblxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBqdXN0IGxpa2Uge0BsaW5rIGJpbmRDYWxsYmFja30sIGJ1dCB0aGVcbiAqIGNhbGxiYWNrIGlzIGV4cGVjdGVkIHRvIGJlIG9mIHR5cGUgYGNhbGxiYWNrKGVycm9yLCByZXN1bHQpYC48L3NwYW4+XG4gKlxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGlzIG5vdCBhbiBvcGVyYXRvciBiZWNhdXNlIGl0cyBpbnB1dCBhbmQgb3V0cHV0IGFyZSBub3RcbiAqIE9ic2VydmFibGVzLiBUaGUgaW5wdXQgaXMgYSBmdW5jdGlvbiBgZnVuY2Agd2l0aCBzb21lIHBhcmFtZXRlcnMsIGJ1dCB0aGVcbiAqIGxhc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGBmdW5jYCBjYWxscyB3aGVuIGl0IGlzXG4gKiBkb25lLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gZm9sbG93IE5vZGUuanMgY29udmVudGlvbnMsXG4gKiB3aGVyZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGNhbGxiYWNrIGlzIGFuIGVycm9yIG9iamVjdCwgc2lnbmFsaW5nXG4gKiB3aGV0aGVyIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuIElmIHRoYXQgb2JqZWN0IGlzIHBhc3NlZCB0byBjYWxsYmFjaywgaXQgbWVhbnNcbiAqIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgYGJpbmROb2RlQ2FsbGJhY2tgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZVxuICogcGFyYW1ldGVycyBhcyBgZnVuY2AsIGV4Y2VwdCB0aGUgbGFzdCBvbmUgKHRoZSBjYWxsYmFjaykuIFdoZW4gdGhlIG91dHB1dFxuICogZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzLCBpdCB3aWxsIHJldHVybiBhbiBPYnNlcnZhYmxlLlxuICogSWYgYGZ1bmNgIGNhbGxzIGl0cyBjYWxsYmFjayB3aXRoIGVycm9yIHBhcmFtZXRlciBwcmVzZW50LCBPYnNlcnZhYmxlIHdpbGxcbiAqIGVycm9yIHdpdGggdGhhdCB2YWx1ZSBhcyB3ZWxsLiBJZiBlcnJvciBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgT2JzZXJ2YWJsZSB3aWxsIGVtaXRcbiAqIHNlY29uZCBwYXJhbWV0ZXIuIElmIHRoZXJlIGFyZSBtb3JlIHBhcmFtZXRlcnMgKHRoaXJkIGFuZCBzbyBvbiksXG4gKiBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIGFsbCBhcmd1bWVudHMsIGV4Y2VwdCBmaXJzdCBlcnJvciBhcmd1bWVudC5cbiAqXG4gKiBOb3RlIHRoYXQgYGZ1bmNgIHdpbGwgbm90IGJlIGNhbGxlZCBhdCB0aGUgc2FtZSB0aW1lIG91dHB1dCBmdW5jdGlvbiBpcyxcbiAqIGJ1dCByYXRoZXIgd2hlbmV2ZXIgcmVzdWx0aW5nIE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC4gQnkgZGVmYXVsdCBjYWxsIHRvXG4gKiBgZnVuY2Agd2lsbCBoYXBwZW4gc3luY2hyb25vdXNseSBhZnRlciBzdWJzY3JpcHRpb24sIGJ1dCB0aGF0IGNhbiBiZSBjaGFuZ2VkXG4gKiB3aXRoIHByb3BlciBgc2NoZWR1bGVyYCBwcm92aWRlZCBhcyBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIuIHtAbGluayBTY2hlZHVsZXJMaWtlfVxuICogY2FuIGFsc28gY29udHJvbCB3aGVuIHZhbHVlcyBmcm9tIGNhbGxiYWNrIHdpbGwgYmUgZW1pdHRlZCBieSBPYnNlcnZhYmxlLlxuICogVG8gZmluZCBvdXQgbW9yZSwgY2hlY2sgb3V0IGRvY3VtZW50YXRpb24gZm9yIHtAbGluayBiaW5kQ2FsbGJhY2t9LCB3aGVyZVxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IHdvcmtzIGV4YWN0bHkgdGhlIHNhbWUuXG4gKlxuICogQXMgaW4ge0BsaW5rIGJpbmRDYWxsYmFja30sIGNvbnRleHQgKGB0aGlzYCBwcm9wZXJ0eSkgb2YgaW5wdXQgZnVuY3Rpb24gd2lsbCBiZSBzZXQgdG8gY29udGV4dFxuICogb2YgcmV0dXJuZWQgZnVuY3Rpb24sIHdoZW4gaXQgaXMgY2FsbGVkLlxuICpcbiAqIEFmdGVyIE9ic2VydmFibGUgZW1pdHMgdmFsdWUsIGl0IHdpbGwgY29tcGxldGUgaW1tZWRpYXRlbHkuIFRoaXMgbWVhbnNcbiAqIGV2ZW4gaWYgYGZ1bmNgIGNhbGxzIGNhbGxiYWNrIGFnYWluLCB2YWx1ZXMgZnJvbSBzZWNvbmQgYW5kIGNvbnNlY3V0aXZlXG4gKiBjYWxscyB3aWxsIG5ldmVyIGFwcGVhciBvbiB0aGUgc3RyZWFtLiBJZiB5b3UgbmVlZCB0byBoYW5kbGUgZnVuY3Rpb25zXG4gKiB0aGF0IGNhbGwgY2FsbGJhY2tzIG11bHRpcGxlIHRpbWVzLCBjaGVjayBvdXQge0BsaW5rIGZyb21FdmVudH0gb3JcbiAqIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSBpbnN0ZWFkLlxuICpcbiAqIE5vdGUgdGhhdCBgYmluZE5vZGVDYWxsYmFja2AgY2FuIGJlIHVzZWQgaW4gbm9uLU5vZGUuanMgZW52aXJvbm1lbnRzIGFzIHdlbGwuXG4gKiBcIk5vZGUuanMtc3R5bGVcIiBjYWxsYmFja3MgYXJlIGp1c3QgYSBjb252ZW50aW9uLCBzbyBpZiB5b3Ugd3JpdGUgZm9yXG4gKiBicm93c2VycyBvciBhbnkgb3RoZXIgZW52aXJvbm1lbnQgYW5kIEFQSSB5b3UgdXNlIGltcGxlbWVudHMgdGhhdCBjYWxsYmFjayBzdHlsZSxcbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBjYW4gYmUgc2FmZWx5IHVzZWQgb24gdGhhdCBBUEkgZnVuY3Rpb25zIGFzIHdlbGwuXG4gKlxuICogUmVtZW1iZXIgdGhhdCBFcnJvciBvYmplY3QgcGFzc2VkIHRvIGNhbGxiYWNrIGRvZXMgbm90IGhhdmUgdG8gYmUgYW4gaW5zdGFuY2VcbiAqIG9mIEphdmFTY3JpcHQgYnVpbHQtaW4gYEVycm9yYCBvYmplY3QuIEluIGZhY3QsIGl0IGRvZXMgbm90IGV2ZW4gaGF2ZSB0byBhbiBvYmplY3QuXG4gKiBFcnJvciBwYXJhbWV0ZXIgb2YgY2FsbGJhY2sgZnVuY3Rpb24gaXMgaW50ZXJwcmV0ZWQgYXMgXCJwcmVzZW50XCIsIHdoZW4gdmFsdWVcbiAqIG9mIHRoYXQgcGFyYW1ldGVyIGlzIHRydXRoeS4gSXQgY291bGQgYmUsIGZvciBleGFtcGxlLCBub24temVybyBudW1iZXIsIG5vbi1lbXB0eVxuICogc3RyaW5nIG9yIGJvb2xlYW4gYHRydWVgLiBJbiBhbGwgb2YgdGhlc2UgY2FzZXMgcmVzdWx0aW5nIE9ic2VydmFibGUgd291bGQgZXJyb3JcbiAqIHdpdGggdGhhdCB2YWx1ZS4gVGhpcyBtZWFucyB1c3VhbGx5IHJlZ3VsYXIgc3R5bGUgY2FsbGJhY2tzIHdpbGwgZmFpbCB2ZXJ5IG9mdGVuIHdoZW5cbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyB1c2VkLiBJZiB5b3VyIE9ic2VydmFibGUgZXJyb3JzIG11Y2ggbW9yZSBvZnRlbiB0aGVuIHlvdVxuICogd291bGQgZXhwZWN0LCBjaGVjayBpZiBjYWxsYmFjayByZWFsbHkgaXMgY2FsbGVkIGluIE5vZGUuanMtc3R5bGUgYW5kLCBpZiBub3QsXG4gKiBzd2l0Y2ggdG8ge0BsaW5rIGJpbmRDYWxsYmFja30gaW5zdGVhZC5cbiAqXG4gKiBOb3RlIHRoYXQgZXZlbiBpZiBlcnJvciBwYXJhbWV0ZXIgaXMgdGVjaG5pY2FsbHkgcHJlc2VudCBpbiBjYWxsYmFjaywgYnV0IGl0cyB2YWx1ZVxuICogaXMgZmFsc3ksIGl0IHN0aWxsIHdvbid0IGFwcGVhciBpbiBhcnJheSBlbWl0dGVkIGJ5IE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyAgUmVhZCBhIGZpbGUgZnJvbSB0aGUgZmlsZXN5c3RlbSBhbmQgZ2V0IHRoZSBkYXRhIGFzIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbiAqIGNvbnN0IHJlYWRGaWxlQXNPYnNlcnZhYmxlID0gYmluZE5vZGVDYWxsYmFjayhmcy5yZWFkRmlsZSk7XG4gKiBjb25zdCByZXN1bHQgPSByZWFkRmlsZUFzT2JzZXJ2YWJsZSgnLi9yb2FkTmFtZXMudHh0JywgJ3V0ZjgnKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBVc2Ugb24gZnVuY3Rpb24gY2FsbGluZyBjYWxsYmFjayB3aXRoIG11bHRpcGxlIGFyZ3VtZW50c1xuICogYGBgamF2YXNjcmlwdFxuICogc29tZUZ1bmN0aW9uKChlcnIsIGEsIGIpID0+IHtcbiAqICAgY29uc29sZS5sb2coZXJyKTsgLy8gbnVsbFxuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogICBjb25zb2xlLmxvZyhiKTsgLy8gXCJzb21lIHN0cmluZ1wiXG4gKiB9KTtcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZE5vZGVDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKVxuICogLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTsgLy8gWzUsIFwic29tZSBzdHJpbmdcIl1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFVzZSBvbiBmdW5jdGlvbiBjYWxsaW5nIGNhbGxiYWNrIGluIHJlZ3VsYXIgc3R5bGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbihhID0+IHtcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqIH0pO1xuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kTm9kZUNhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiB7fSAgICAgICAgICAgICAvLyBuZXZlciBnZXRzIGNhbGxlZFxuICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSAvLyA1XG4gKiApO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZENhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIHdpdGggYSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrIGFzIHRoZSBsYXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gVGhlIHNjaGVkdWxlciBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGVcbiAqIGNhbGxiYWNrcy5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLnBhcmFtczogKik6IE9ic2VydmFibGV9IEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGVcbiAqIE9ic2VydmFibGUgdGhhdCBkZWxpdmVycyB0aGUgc2FtZSB2YWx1ZXMgdGhlIE5vZGUuanMgY2FsbGJhY2sgd291bGRcbiAqIGRlbGl2ZXIuXG4gKiBAbmFtZSBiaW5kTm9kZUNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFQ+KFxuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLFxuICByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb258U2NoZWR1bGVyTGlrZSxcbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZVxuKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFQ+IHtcblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYywgc2NoZWR1bGVyKSguLi5hcmdzKS5waXBlKFxuICAgICAgICBtYXAoYXJncyA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBwYXJhbXM6IFBhcmFtc1N0YXRlPFQ+ID0ge1xuICAgICAgc3ViamVjdDogdW5kZWZpbmVkLFxuICAgICAgYXJncyxcbiAgICAgIGNhbGxiYWNrRnVuYyxcbiAgICAgIHNjaGVkdWxlcixcbiAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRleHQgfSA9IHBhcmFtcztcbiAgICAgIGxldCB7IHN1YmplY3QgfSA9IHBhcmFtcztcbiAgICAgIGlmICghc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGlubmVyQXJncy5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQoaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzKTtcbiAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoU3RhdGU8VD4+KGRpc3BhdGNoLCAwLCB7IHBhcmFtcywgc3Vic2NyaWJlciwgY29udGV4dCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoU3RhdGU8VD4ge1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBjb250ZXh0OiBhbnk7XG4gIHBhcmFtczogUGFyYW1zU3RhdGU8VD47XG59XG5cbmludGVyZmFjZSBQYXJhbXNTdGF0ZTxUPiB7XG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb247XG4gIGFyZ3M6IGFueVtdO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgY29udGV4dDogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RGlzcGF0Y2hTdGF0ZTxUPj4sIHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgcGFyYW1zLCBzdWJzY3JpYmVyLCBjb250ZXh0IH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBjYWxsYmFja0Z1bmMsIGFyZ3MsIHNjaGVkdWxlciB9ID0gcGFyYW1zO1xuICBsZXQgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0O1xuXG4gIGlmICghc3ViamVjdCkge1xuICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgZXJyID0gaW5uZXJBcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEVycm9yQXJnPFQ+PihkaXNwYXRjaEVycm9yLCAwLCB7IGVyciwgc3ViamVjdCB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncztcbiAgICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoTmV4dEFyZzxUPj4oZGlzcGF0Y2hOZXh0LCAwLCB7IHZhbHVlLCBzdWJqZWN0IH0pKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoRXJyb3JBcmc8VD4+KGRpc3BhdGNoRXJyb3IsIDAsIHsgZXJyLCBzdWJqZWN0IH0pKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmFkZChzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaE5leHRBcmc8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIHZhbHVlOiBUO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQ8VD4oYXJnOiBEaXNwYXRjaE5leHRBcmc8VD4pIHtcbiAgY29uc3QgeyB2YWx1ZSwgc3ViamVjdCB9ID0gYXJnO1xuICBzdWJqZWN0Lm5leHQodmFsdWUpO1xuICBzdWJqZWN0LmNvbXBsZXRlKCk7XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEVycm9yQXJnPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBlcnI6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvcjxUPihhcmc6IERpc3BhdGNoRXJyb3JBcmc8VD4pIHtcbiAgY29uc3QgeyBlcnIsIHN1YmplY3QgfSA9IGFyZztcbiAgc3ViamVjdC5lcnJvcihlcnIpO1xufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuL0lubmVyU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGlubmVyVmFsdWUpO1xuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSwgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuL091dGVyU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgSW5uZXJTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxSPiB7XG4gIHByaXZhdGUgaW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBPdXRlclN1YnNjcmliZXI8VCwgUj4sIHB1YmxpYyBvdXRlclZhbHVlOiBULCBwdWJsaWMgb3V0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogUik6IHZvaWQge1xuICAgIHRoaXMucGFyZW50Lm5vdGlmeU5leHQodGhpcy5vdXRlclZhbHVlLCB2YWx1ZSwgdGhpcy5vdXRlckluZGV4LCB0aGlzLmluZGV4KyssIHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5RXJyb3IoZXJyb3IsIHRoaXMpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5Q29tcGxldGUodGhpcyk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL2hvc3RSZXBvcnRFcnJvcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUb1Byb21pc2UgPSA8VD4ocHJvbWlzZTogUHJvbWlzZUxpa2U8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIHByb21pc2UudGhlbihcbiAgICAodmFsdWUpID0+IHtcbiAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgKGVycjogYW55KSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycilcbiAgKVxuICAudGhlbihudWxsLCBob3N0UmVwb3J0RXJyb3IpO1xuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sSXRlcmF0b3IoKTogc3ltYm9sIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgIVN5bWJvbC5pdGVyYXRvcikge1xuICAgIHJldHVybiAnQEBpdGVyYXRvcicgYXMgYW55O1xuICB9XG5cbiAgcmV0dXJuIFN5bWJvbC5pdGVyYXRvcjtcbn1cblxuZXhwb3J0IGNvbnN0IGl0ZXJhdG9yID0gZ2V0U3ltYm9sSXRlcmF0b3IoKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rIGl0ZXJhdG9yfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBjb25zdCAkJGl0ZXJhdG9yID0gaXRlcmF0b3I7XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9JdGVyYWJsZSA9IDxUPihpdGVyYWJsZTogSXRlcmFibGU8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmFibGVbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICBkbyB7XG4gICAgY29uc3QgaXRlbSA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICBpZiAoaXRlbS5kb25lKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc3Vic2NyaWJlci5uZXh0KGl0ZW0udmFsdWUpO1xuICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTtcblxuICAvLyBGaW5hbGl6ZSB0aGUgaXRlcmF0b3IgaWYgaXQgaGFwcGVucyB0byBiZSBhIEdlbmVyYXRvclxuICBpZiAodHlwZW9mIGl0ZXJhdG9yLnJldHVybiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuXG4vKipcbiAqIFN1YnNjcmliZXMgdG8gYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBTeW1ib2wub2JzZXJ2YWJsZSB3aXRoIHRoZSBnaXZlblxuICogU3Vic2NyaWJlci5cbiAqIEBwYXJhbSBvYmogQW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBTeW1ib2wub2JzZXJ2YWJsZVxuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9PYnNlcnZhYmxlID0gPFQ+KG9iajogYW55KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBjb25zdCBvYnMgPSBvYmpbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gIGlmICh0eXBlb2Ygb2JzLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFNob3VsZCBiZSBjYXVnaHQgYnkgb2JzZXJ2YWJsZSBzdWJzY3JpYmUgZnVuY3Rpb24gZXJyb3IgaGFuZGxpbmcuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvdmlkZWQgb2JqZWN0IGRvZXMgbm90IGNvcnJlY3RseSBpbXBsZW1lbnQgU3ltYm9sLm9ic2VydmFibGUnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JzLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBpc0FycmF5TGlrZSA9ICg8VD4oeDogYW55KTogeCBpcyBBcnJheUxpa2U8VD4gPT4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInICYmIHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nKTsiLCJleHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBQcm9taXNlTGlrZTxhbnk+IHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiAoPGFueT52YWx1ZSkuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiAodmFsdWUgYXMgYW55KS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9BcnJheSB9IGZyb20gJy4vc3Vic2NyaWJlVG9BcnJheSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Byb21pc2UgfSBmcm9tICcuL3N1YnNjcmliZVRvUHJvbWlzZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0l0ZXJhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb0l0ZXJhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvT2JzZXJ2YWJsZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4vaXNPYmplY3QnO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUbyA9IDxUPihyZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxUPikgPT4ge1xuICBpZiAocmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgIHJldHVybiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICAgICAgICBpZiAocmVzdWx0Ll9pc1NjYWxhcikge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoKHJlc3VsdCBhcyBhbnkpLnZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdFtTeW1ib2xfb2JzZXJ2YWJsZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9PYnNlcnZhYmxlKHJlc3VsdCBhcyBhbnkpO1xuICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9BcnJheShyZXN1bHQpO1xuICB9IGVsc2UgaWYgKGlzUHJvbWlzZShyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUHJvbWlzZShyZXN1bHQgYXMgUHJvbWlzZTxhbnk+KTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdFtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvSXRlcmFibGUocmVzdWx0IGFzIGFueSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmFsdWUgPSBpc09iamVjdChyZXN1bHQpID8gJ2FuIGludmFsaWQgb2JqZWN0JyA6IGAnJHtyZXN1bHR9J2A7XG4gICAgY29uc3QgbXNnID0gYFlvdSBwcm92aWRlZCAke3ZhbHVlfSB3aGVyZSBhIHN0cmVhbSB3YXMgZXhwZWN0ZWQuYFxuICAgICAgKyAnIFlvdSBjYW4gcHJvdmlkZSBhbiBPYnNlcnZhYmxlLCBQcm9taXNlLCBBcnJheSwgb3IgSXRlcmFibGUuJztcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG1zZyk7XG4gIH1cbn07XG4iLCJcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi9zdWJzY3JpYmVUbyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPihvdXRlclN1YnNjcmliZXI6IE91dGVyU3Vic2NyaWJlcjxULCBSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlclZhbHVlPzogVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlckluZGV4PzogbnVtYmVyKTogU3Vic2NyaXB0aW9uO1xuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmliZVRvUmVzdWx0PFQ+KG91dGVyU3Vic2NyaWJlcjogT3V0ZXJTdWJzY3JpYmVyPGFueSwgYW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlclZhbHVlPzogVCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlckluZGV4PzogbnVtYmVyKTogU3Vic2NyaXB0aW9uIHwgdm9pZCB7XG4gIGNvbnN0IGRlc3RpbmF0aW9uID0gbmV3IElubmVyU3Vic2NyaWJlcihvdXRlclN1YnNjcmliZXIsIG91dGVyVmFsdWUsIG91dGVySW5kZXgpO1xuXG4gIHJldHVybiBzdWJzY3JpYmVUbyhyZXN1bHQpKGRlc3RpbmF0aW9uKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyICB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgaXNBcnJheSAgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5cbmNvbnN0IE5PTkUgPSB7fTtcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCkgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMykgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCkgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgVDUsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUsIHY2OiBUNikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxUPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgKCguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSKSB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKSB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29tYmluZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG8gY3JlYXRlIGFuIE9ic2VydmFibGUgd2hvc2UgdmFsdWVzIGFyZVxuICogY2FsY3VsYXRlZCBmcm9tIHRoZSBsYXRlc3QgdmFsdWVzIG9mIGVhY2ggb2YgaXRzIGlucHV0IE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XaGVuZXZlciBhbnkgaW5wdXQgT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlLCBpdFxuICogY29tcHV0ZXMgYSBmb3JtdWxhIHVzaW5nIHRoZSBsYXRlc3QgdmFsdWVzIGZyb20gYWxsIHRoZSBpbnB1dHMsIHRoZW4gZW1pdHNcbiAqIHRoZSBvdXRwdXQgb2YgdGhhdCBmb3JtdWxhLjwvc3Bhbj5cbiAqXG4gKiAhW10oY29tYmluZUxhdGVzdC5wbmcpXG4gKlxuICogYGNvbWJpbmVMYXRlc3RgIGNvbWJpbmVzIHRoZSB2YWx1ZXMgZnJvbSBhbGwgdGhlIE9ic2VydmFibGVzIHBhc3NlZCBhc1xuICogYXJndW1lbnRzLiBUaGlzIGlzIGRvbmUgYnkgc3Vic2NyaWJpbmcgdG8gZWFjaCBPYnNlcnZhYmxlIGluIG9yZGVyIGFuZCxcbiAqIHdoZW5ldmVyIGFueSBPYnNlcnZhYmxlIGVtaXRzLCBjb2xsZWN0aW5nIGFuIGFycmF5IG9mIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWVzIGZyb20gZWFjaCBPYnNlcnZhYmxlLiBTbyBpZiB5b3UgcGFzcyBgbmAgT2JzZXJ2YWJsZXMgdG8gb3BlcmF0b3IsXG4gKiByZXR1cm5lZCBPYnNlcnZhYmxlIHdpbGwgYWx3YXlzIGVtaXQgYW4gYXJyYXkgb2YgYG5gIHZhbHVlcywgaW4gb3JkZXJcbiAqIGNvcnJlc3BvbmRpbmcgdG8gb3JkZXIgb2YgcGFzc2VkIE9ic2VydmFibGVzICh2YWx1ZSBmcm9tIHRoZSBmaXJzdCBPYnNlcnZhYmxlXG4gKiBvbiB0aGUgZmlyc3QgcGxhY2UgYW5kIHNvIG9uKS5cbiAqXG4gKiBTdGF0aWMgdmVyc2lvbiBvZiBgY29tYmluZUxhdGVzdGAgYWNjZXB0cyBlaXRoZXIgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXNcbiAqIG9yIGVhY2ggT2JzZXJ2YWJsZSBjYW4gYmUgcHV0IGRpcmVjdGx5IGFzIGFuIGFyZ3VtZW50LiBOb3RlIHRoYXQgYXJyYXkgb2ZcbiAqIE9ic2VydmFibGVzIGlzIGdvb2QgY2hvaWNlLCBpZiB5b3UgZG9uJ3Qga25vdyBiZWZvcmVoYW5kIGhvdyBtYW55IE9ic2VydmFibGVzXG4gKiB5b3Ugd2lsbCBjb21iaW5lLiBQYXNzaW5nIGVtcHR5IGFycmF5IHdpbGwgcmVzdWx0IGluIE9ic2VydmFibGUgdGhhdFxuICogY29tcGxldGVzIGltbWVkaWF0ZWx5LlxuICpcbiAqIFRvIGVuc3VyZSBvdXRwdXQgYXJyYXkgaGFzIGFsd2F5cyB0aGUgc2FtZSBsZW5ndGgsIGBjb21iaW5lTGF0ZXN0YCB3aWxsXG4gKiBhY3R1YWxseSB3YWl0IGZvciBhbGwgaW5wdXQgT2JzZXJ2YWJsZXMgdG8gZW1pdCBhdCBsZWFzdCBvbmNlLFxuICogYmVmb3JlIGl0IHN0YXJ0cyBlbWl0dGluZyByZXN1bHRzLiBUaGlzIG1lYW5zIGlmIHNvbWUgT2JzZXJ2YWJsZSBlbWl0c1xuICogdmFsdWVzIGJlZm9yZSBvdGhlciBPYnNlcnZhYmxlcyBzdGFydGVkIGVtaXR0aW5nLCBhbGwgdGhhdCB2YWx1ZXMgYnV0IGxhc3RcbiAqIHdpbGwgYmUgbG9zdC4gT24gdGhlIG90aGVyIGhhbmQsIGlmIHNvbWUgT2JzZXJ2YWJsZSBkb2VzIG5vdCBlbWl0IHZhbHVlIGJ1dFxuICogY29tcGxldGVzLCByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIGF0IHRoZSBzYW1lIG1vbWVudCB3aXRob3V0XG4gKiBlbWl0dGluZyBhbnl0aGluZywgc2luY2UgaXQgd2lsbCBiZSBub3cgaW1wb3NzaWJsZSB0byBpbmNsdWRlIHZhbHVlIGZyb21cbiAqIGNvbXBsZXRlZCBPYnNlcnZhYmxlIGluIHJlc3VsdGluZyBhcnJheS4gQWxzbywgaWYgc29tZSBpbnB1dCBPYnNlcnZhYmxlIGRvZXNcbiAqIG5vdCBlbWl0IGFueSB2YWx1ZSBhbmQgbmV2ZXIgY29tcGxldGVzLCBgY29tYmluZUxhdGVzdGAgd2lsbCBhbHNvIG5ldmVyIGVtaXRcbiAqIGFuZCBuZXZlciBjb21wbGV0ZSwgc2luY2UsIGFnYWluLCBpdCB3aWxsIHdhaXQgZm9yIGFsbCBzdHJlYW1zIHRvIGVtaXQgc29tZVxuICogdmFsdWUuXG4gKlxuICogSWYgYXQgbGVhc3Qgb25lIE9ic2VydmFibGUgd2FzIHBhc3NlZCB0byBgY29tYmluZUxhdGVzdGAgYW5kIGFsbCBwYXNzZWQgT2JzZXJ2YWJsZXNcbiAqIGVtaXR0ZWQgc29tZXRoaW5nLCByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIHdoZW4gYWxsIGNvbWJpbmVkXG4gKiBzdHJlYW1zIGNvbXBsZXRlLiBTbyBldmVuIGlmIHNvbWUgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsIHJlc3VsdCBvZlxuICogYGNvbWJpbmVMYXRlc3RgIHdpbGwgc3RpbGwgZW1pdCB2YWx1ZXMgd2hlbiBvdGhlciBPYnNlcnZhYmxlcyBkby4gSW4gY2FzZVxuICogb2YgY29tcGxldGVkIE9ic2VydmFibGUsIGl0cyB2YWx1ZSBmcm9tIG5vdyBvbiB3aWxsIGFsd2F5cyBiZSB0aGUgbGFzdFxuICogZW1pdHRlZCB2YWx1ZS4gT24gdGhlIG90aGVyIGhhbmQsIGlmIGFueSBPYnNlcnZhYmxlIGVycm9ycywgYGNvbWJpbmVMYXRlc3RgXG4gKiB3aWxsIGVycm9yIGltbWVkaWF0ZWx5IGFzIHdlbGwsIGFuZCBhbGwgb3RoZXIgT2JzZXJ2YWJsZXMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXG4gKlxuICogYGNvbWJpbmVMYXRlc3RgIGFjY2VwdHMgYXMgb3B0aW9uYWwgcGFyYW1ldGVyIGBwcm9qZWN0YCBmdW5jdGlvbiwgd2hpY2ggdGFrZXNcbiAqIGFzIGFyZ3VtZW50cyBhbGwgdmFsdWVzIHRoYXQgd291bGQgbm9ybWFsbHkgYmUgZW1pdHRlZCBieSByZXN1bHRpbmcgT2JzZXJ2YWJsZS5cbiAqIGBwcm9qZWN0YCBjYW4gcmV0dXJuIGFueSBraW5kIG9mIHZhbHVlLCB3aGljaCB3aWxsIGJlIHRoZW4gZW1pdHRlZCBieSBPYnNlcnZhYmxlXG4gKiBpbnN0ZWFkIG9mIGRlZmF1bHQgYXJyYXkuIE5vdGUgdGhhdCBgcHJvamVjdGAgZG9lcyBub3QgdGFrZSBhcyBhcmd1bWVudCB0aGF0IGFycmF5XG4gKiBvZiB2YWx1ZXMsIGJ1dCB2YWx1ZXMgdGhlbXNlbHZlcy4gVGhhdCBtZWFucyBkZWZhdWx0IGBwcm9qZWN0YCBjYW4gYmUgaW1hZ2luZWRcbiAqIGFzIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYWxsIGl0cyBhcmd1bWVudHMgYW5kIHB1dHMgdGhlbSBpbnRvIGFuIGFycmF5LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ29tYmluZSB0d28gdGltZXIgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGZpcnN0VGltZXIgPSB0aW1lcigwLCAxMDAwKTsgLy8gZW1pdCAwLCAxLCAyLi4uIGFmdGVyIGV2ZXJ5IHNlY29uZCwgc3RhcnRpbmcgZnJvbSBub3dcbiAqIGNvbnN0IHNlY29uZFRpbWVyID0gdGltZXIoNTAwLCAxMDAwKTsgLy8gZW1pdCAwLCAxLCAyLi4uIGFmdGVyIGV2ZXJ5IHNlY29uZCwgc3RhcnRpbmcgMCw1cyBmcm9tIG5vd1xuICogY29uc3QgY29tYmluZWRUaW1lcnMgPSBjb21iaW5lTGF0ZXN0KGZpcnN0VGltZXIsIHNlY29uZFRpbWVyKTtcbiAqIGNvbWJpbmVkVGltZXJzLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICogLy8gTG9nc1xuICogLy8gWzAsIDBdIGFmdGVyIDAuNXNcbiAqIC8vIFsxLCAwXSBhZnRlciAxc1xuICogLy8gWzEsIDFdIGFmdGVyIDEuNXNcbiAqIC8vIFsyLCAxXSBhZnRlciAyc1xuICogYGBgXG4gKlxuICogIyMjIENvbWJpbmUgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG9ic2VydmFibGVzID0gWzEsIDUsIDEwXS5tYXAoXG4gKiAgIG4gPT4gb2YobikucGlwZShcbiAqICAgICBkZWxheShuICogMTAwMCksICAgLy8gZW1pdCAwIGFuZCB0aGVuIGVtaXQgbiBhZnRlciBuIHNlY29uZHNcbiAqICAgICBzdGFydFdpdGgoMCksXG4gKiAgIClcbiAqICk7XG4gKiBjb25zdCBjb21iaW5lZCA9IGNvbWJpbmVMYXRlc3Qob2JzZXJ2YWJsZXMpO1xuICogY29tYmluZWQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKiAvLyBMb2dzXG4gKiAvLyBbMCwgMCwgMF0gaW1tZWRpYXRlbHlcbiAqIC8vIFsxLCAwLCAwXSBhZnRlciAxc1xuICogLy8gWzEsIDUsIDBdIGFmdGVyIDVzXG4gKiAvLyBbMSwgNSwgMTBdIGFmdGVyIDEwc1xuICogYGBgXG4gKlxuICpcbiAqICMjIyBVc2UgcHJvamVjdCBmdW5jdGlvbiB0byBkeW5hbWljYWxseSBjYWxjdWxhdGUgdGhlIEJvZHktTWFzcyBJbmRleFxuICogYGBgamF2YXNjcmlwdFxuICogKiBjb25zdCB3ZWlnaHQgPSBvZig3MCwgNzIsIDc2LCA3OSwgNzUpO1xuICogY29uc3QgaGVpZ2h0ID0gb2YoMS43NiwgMS43NywgMS43OCk7XG4gKiBjb25zdCBibWkgPSBjb21iaW5lTGF0ZXN0KHdlaWdodCwgaGVpZ2h0KS5waXBlKFxuICogICBtYXAoKFt3LCBoXSkgPT4gdyAvIChoICogaCkpLFxuICogKTtcbiAqIGJtaS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnQk1JIGlzICcgKyB4KSk7XG4gKlxuICogLy8gV2l0aCBvdXRwdXQgdG8gY29uc29sZTpcbiAqIC8vIEJNSSBpcyAyNC4yMTIyOTMzODg0Mjk3NTNcbiAqIC8vIEJNSSBpcyAyMy45Mzk0ODA5OTIwNTIwOVxuICogLy8gQk1JIGlzIDIzLjY3MTI1MzYyOTU5MjIyMlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUFsbH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgd2l0aExhdGVzdEZyb219XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGUxIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29tYmluZSB3aXRoIG90aGVyIE9ic2VydmFibGVzLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGUyIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29tYmluZSB3aXRoIG90aGVyIE9ic2VydmFibGVzLlxuICogTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnRzXG4gKiBvciBhbiBhcnJheSBvZiBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Byb2plY3RdIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIHByb2plY3QgdGhlIHZhbHVlcyBmcm9tXG4gKiB0aGUgY29tYmluZWQgbGF0ZXN0IHZhbHVlcyBpbnRvIGEgbmV3IHZhbHVlIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc3Vic2NyaWJpbmcgdG9cbiAqIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2YgcHJvamVjdGVkIHZhbHVlcyBmcm9tIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWVzIGZyb20gZWFjaCBpbnB1dCBPYnNlcnZhYmxlLCBvciBhbiBhcnJheSBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGZyb21cbiAqIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PGFueSB8IE9ic2VydmFibGVJbnB1dDxhbnk+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj4ge1xuICBsZXQgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIgPSAgbnVsbDtcbiAgbGV0IHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IG51bGw7XG5cbiAgaWYgKGlzU2NoZWR1bGVyKG9ic2VydmFibGVzW29ic2VydmFibGVzLmxlbmd0aCAtIDFdKSkge1xuICAgIHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPm9ic2VydmFibGVzLnBvcCgpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlc3VsdFNlbGVjdG9yID0gPCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFI+b2JzZXJ2YWJsZXMucG9wKCk7XG4gIH1cblxuICAvLyBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgb3RoZXIgYXJndW1lbnQgYmVzaWRlcyB0aGUgcmVzdWx0U2VsZWN0b3IgaXMgYW4gYXJyYXlcbiAgLy8gYXNzdW1lIGl0J3MgYmVlbiBjYWxsZWQgd2l0aCBgY29tYmluZUxhdGVzdChbb2JzMSwgb2JzMiwgb2JzM10sIHJlc3VsdFNlbGVjdG9yKWBcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG9ic2VydmFibGVzWzBdKSkge1xuICAgIG9ic2VydmFibGVzID0gPEFycmF5PE9ic2VydmFibGU8YW55Pj4+b2JzZXJ2YWJsZXNbMF07XG4gIH1cblxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCBzY2hlZHVsZXIpLmxpZnQobmV3IENvbWJpbmVMYXRlc3RPcGVyYXRvcjxULCBSPihyZXN1bHRTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tYmluZUxhdGVzdE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IENvbWJpbmVMYXRlc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVzdWx0U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIENvbWJpbmVMYXRlc3RTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBhY3RpdmU6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIG9ic2VydmFibGVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIHRvUmVzcG9uZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LCBwcml2YXRlIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dChvYnNlcnZhYmxlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlcy5wdXNoKE5PTkUpO1xuICAgIHRoaXMub2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gbGVuO1xuICAgICAgdGhpcy50b1Jlc3BvbmQgPSBsZW47XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSBvYnNlcnZhYmxlc1tpXTtcbiAgICAgICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSwgaSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKHVudXNlZDogU3Vic2NyaWJlcjxSPik6IHZvaWQge1xuICAgIGlmICgodGhpcy5hY3RpdmUgLT0gMSkgPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuICAgIGNvbnN0IG9sZFZhbCA9IHZhbHVlc1tvdXRlckluZGV4XTtcbiAgICBjb25zdCB0b1Jlc3BvbmQgPSAhdGhpcy50b1Jlc3BvbmRcbiAgICAgID8gMFxuICAgICAgOiBvbGRWYWwgPT09IE5PTkUgPyAtLXRoaXMudG9SZXNwb25kIDogdGhpcy50b1Jlc3BvbmQ7XG4gICAgdmFsdWVzW291dGVySW5kZXhdID0gaW5uZXJWYWx1ZTtcblxuICAgIGlmICh0b1Jlc3BvbmQgPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuX3RyeVJlc3VsdFNlbGVjdG9yKHZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWVzLnNsaWNlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3RyeVJlc3VsdFNlbGVjdG9yKHZhbHVlczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0U2VsZWN0b3IuYXBwbHkodGhpcywgdmFsdWVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEludGVyb3BPYnNlcnZhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcblxuLyoqIElkZW50aWZpZXMgYW4gaW5wdXQgYXMgYmVpbmcgT2JzZXJ2YWJsZSAoYnV0IG5vdCBuZWNlc3NhcnkgYW4gUnggT2JzZXJ2YWJsZSkgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0OiBhbnkpOiBpbnB1dCBpcyBJbnRlcm9wT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0gPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuXG4vKiogSWRlbnRpZmllcyBhbiBpbnB1dCBhcyBiZWluZyBhbiBJdGVyYWJsZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUoaW5wdXQ6IGFueSk6IGlucHV0IGlzIEl0ZXJhYmxlPGFueT4ge1xuICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9Qcm9taXNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Qcm9taXNlPFQ+KGlucHV0OiBQcm9taXNlTGlrZTxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb1Byb21pc2UoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBpbnB1dC50aGVuKFxuICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSkpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycikpKTtcbiAgICAgICAgfVxuICAgICAgKSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9JdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9JdGVyYWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tSXRlcmFibGU8VD4oaW5wdXQ6IEl0ZXJhYmxlPFQ+LCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFpbnB1dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSXRlcmFibGUgY2Fubm90IGJlIG51bGwnKTtcbiAgfVxuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb0l0ZXJhYmxlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgbGV0IGl0ZXJhdG9yOiBJdGVyYXRvcjxUPjtcbiAgICAgIHN1Yi5hZGQoKCkgPT4ge1xuICAgICAgICAvLyBGaW5hbGl6ZSBnZW5lcmF0b3JzXG4gICAgICAgIGlmIChpdGVyYXRvciAmJiB0eXBlb2YgaXRlcmF0b3IucmV0dXJuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICBpdGVyYXRvciA9IGlucHV0W1N5bWJvbF9pdGVyYXRvcl0oKTtcbiAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgdmFsdWU6IFQ7XG4gICAgICAgICAgbGV0IGRvbmU6IGJvb2xlYW47XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgZG9uZSA9IHJlc3VsdC5kb25lO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJbnRlcm9wT2JzZXJ2YWJsZSwgU2NoZWR1bGVyTGlrZSwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbU9ic2VydmFibGU8VD4oaW5wdXQ6IEludGVyb3BPYnNlcnZhYmxlPFQ+LCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9PYnNlcnZhYmxlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlOiBTdWJzY3JpYmFibGU8VD4gPSBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgICAgICAgc3ViLmFkZChvYnNlcnZhYmxlLnN1YnNjcmliZSh7XG4gICAgICAgICAgbmV4dCh2YWx1ZSkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLm5leHQodmFsdWUpKSk7IH0sXG4gICAgICAgICAgZXJyb3IoZXJyKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSkpOyB9LFxuICAgICAgICAgIGNvbXBsZXRlKCkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTsgfSxcbiAgICAgICAgfSkpO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBmcm9tUHJvbWlzZSB9IGZyb20gJy4vZnJvbVByb21pc2UnO1xuaW1wb3J0IHsgZnJvbUl0ZXJhYmxlIH0gZnJvbSAnLi9mcm9tSXRlcmFibGUnO1xuaW1wb3J0IHsgZnJvbU9ic2VydmFibGUgfSBmcm9tICcuL2Zyb21PYnNlcnZhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUbyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxPYnNlcnZhYmxlSW5wdXQ8VD4+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUbyhpbnB1dCkpO1xuICB9XG5cbiAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tT2JzZXJ2YWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9ICBlbHNlIGlmIChpc0l0ZXJhYmxlKGlucHV0KSB8fCB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZnJvbUl0ZXJhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoKGlucHV0ICE9PSBudWxsICYmIHR5cGVvZiBpbnB1dCB8fCBpbnB1dCkgKyAnIGlzIG5vdCBvYnNlcnZhYmxlJyk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHVzZSBpbm5lciBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LCByZXN1bHRTZWxlY3RvcjogdW5kZWZpbmVkLCBjb25jdXJyZW50PzogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgaW5uZXIgbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcDxULCBJLCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxJPiwgcmVzdWx0U2VsZWN0b3I6IChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBJLCBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcikgPT4gUiwgY29uY3VycmVudD86IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFByb2plY3RzIGVhY2ggc291cmNlIHZhbHVlIHRvIGFuIE9ic2VydmFibGUgd2hpY2ggaXMgbWVyZ2VkIGluIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPk1hcHMgZWFjaCB2YWx1ZSB0byBhbiBPYnNlcnZhYmxlLCB0aGVuIGZsYXR0ZW5zIGFsbCBvZlxuICogdGhlc2UgaW5uZXIgT2JzZXJ2YWJsZXMgdXNpbmcge0BsaW5rIG1lcmdlQWxsfS48L3NwYW4+XG4gKlxuICogIVtdKG1lcmdlTWFwLnBuZylcbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBiYXNlZCBvbiBhcHBseWluZyBhIGZ1bmN0aW9uIHRoYXQgeW91XG4gKiBzdXBwbHkgdG8gZWFjaCBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB3aGVyZSB0aGF0IGZ1bmN0aW9uXG4gKiByZXR1cm5zIGFuIE9ic2VydmFibGUsIGFuZCB0aGVuIG1lcmdpbmcgdGhvc2UgcmVzdWx0aW5nIE9ic2VydmFibGVzIGFuZFxuICogZW1pdHRpbmcgdGhlIHJlc3VsdHMgb2YgdGhpcyBtZXJnZXIuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGFuZCBmbGF0dGVuIGVhY2ggbGV0dGVyIHRvIGFuIE9ic2VydmFibGUgdGlja2luZyBldmVyeSAxIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbGV0dGVycyA9IG9mKCdhJywgJ2InLCAnYycpO1xuICogY29uc3QgcmVzdWx0ID0gbGV0dGVycy5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IGludGVydmFsKDEwMDApLnBpcGUobWFwKGkgPT4geCtpKSkpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gYTBcbiAqIC8vIGIwXG4gKiAvLyBjMFxuICogLy8gYTFcbiAqIC8vIGIxXG4gKiAvLyBjMVxuICogLy8gY29udGludWVzIHRvIGxpc3QgYSxiLGMgd2l0aCByZXNwZWN0aXZlIGFzY2VuZGluZyBpbnRlZ2Vyc1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdE1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsID9pbmRleDogbnVtYmVyKTogT2JzZXJ2YWJsZUlucHV0fSBwcm9qZWN0IEEgZnVuY3Rpb25cbiAqIHRoYXQsIHdoZW4gYXBwbGllZCB0byBhbiBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCByZXR1cm5zIGFuXG4gKiBPYnNlcnZhYmxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2YgaW5wdXRcbiAqIE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlXG4gKiBwcm9qZWN0aW9uIGZ1bmN0aW9uIChhbmQgdGhlIG9wdGlvbmFsIGByZXN1bHRTZWxlY3RvcmApIHRvIGVhY2ggaXRlbSBlbWl0dGVkXG4gKiBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYW5kIG1lcmdpbmcgdGhlIHJlc3VsdHMgb2YgdGhlIE9ic2VydmFibGVzIG9idGFpbmVkXG4gKiBmcm9tIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gKiBAbWV0aG9kIG1lcmdlTWFwXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXA8VCwgSSwgUj4oXG4gIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PEk+LFxuICByZXN1bHRTZWxlY3Rvcj86ICgob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogSSwgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIpID0+IFIpIHwgbnVtYmVyLFxuICBjb25jdXJyZW50OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFlcbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgSXxSPiB7XG4gIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLnBpcGUoXG4gICAgICBtZXJnZU1hcCgoYSwgaSkgPT4gZnJvbShwcm9qZWN0KGEsIGkpKS5waXBlKFxuICAgICAgICBtYXAoKGIsIGlpKSA9PiByZXN1bHRTZWxlY3RvcihhLCBiLCBpLCBpaSkpLFxuICAgICAgKSwgY29uY3VycmVudClcbiAgICApO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ251bWJlcicpIHtcbiAgICBjb25jdXJyZW50ID0gcmVzdWx0U2VsZWN0b3I7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBNZXJnZU1hcE9wZXJhdG9yKHByb2plY3QsIGNvbmN1cnJlbnQpKTtcbn1cblxuZXhwb3J0IGNsYXNzIE1lcmdlTWFwT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gIH1cblxuICBjYWxsKG9ic2VydmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE1lcmdlTWFwU3Vic2NyaWJlcihcbiAgICAgIG9ic2VydmVyLCB0aGlzLnByb2plY3QsIHRoaXMuY29uY3VycmVudFxuICAgICkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgTWVyZ2VNYXBTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBidWZmZXI6IFRbXSA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZTogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZSA8IHRoaXMuY29uY3VycmVudCkge1xuICAgICAgdGhpcy5fdHJ5TmV4dCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnVmZmVyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJ5TmV4dCh2YWx1ZTogVCkge1xuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxSPjtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcm9qZWN0KHZhbHVlLCBpbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlKys7XG4gICAgdGhpcy5faW5uZXJTdWIocmVzdWx0LCB2YWx1ZSwgaW5kZXgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5uZXJTdWIoaXNoOiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4odGhpcywgaXNoLCB2YWx1ZSwgaW5kZXgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5oYXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCAmJiB0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICB0aGlzLnJlbW92ZShpbm5lclN1Yik7XG4gICAgdGhpcy5hY3RpdmUtLTtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX25leHQoYnVmZmVyLnNoaWZ0KCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmUgPT09IDAgJiYgdGhpcy5oYXNDb21wbGV0ZWQpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiIsIlxuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuL21lcmdlTWFwJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIE9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQWxsPFQ+KGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVD47XG5cbi8qKlxuICogQ29udmVydHMgYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSBpbnRvIGEgZmlyc3Qtb3JkZXIgT2JzZXJ2YWJsZSB3aGljaFxuICogY29uY3VycmVudGx5IGRlbGl2ZXJzIGFsbCB2YWx1ZXMgdGhhdCBhcmUgZW1pdHRlZCBvbiB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMuPC9zcGFuPlxuICpcbiAqICFbXShtZXJnZUFsbC5wbmcpXG4gKlxuICogYG1lcmdlQWxsYCBzdWJzY3JpYmVzIHRvIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBPYnNlcnZhYmxlcywgYWxzbyBrbm93biBhc1xuICogYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZS4gRWFjaCB0aW1lIGl0IG9ic2VydmVzIG9uZSBvZiB0aGVzZSBlbWl0dGVkIGlubmVyXG4gKiBPYnNlcnZhYmxlcywgaXQgc3Vic2NyaWJlcyB0byB0aGF0IGFuZCBkZWxpdmVycyBhbGwgdGhlIHZhbHVlcyBmcm9tIHRoZVxuICogaW5uZXIgT2JzZXJ2YWJsZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvbmx5XG4gKiBjb21wbGV0ZXMgb25jZSBhbGwgaW5uZXIgT2JzZXJ2YWJsZXMgaGF2ZSBjb21wbGV0ZWQuIEFueSBlcnJvciBkZWxpdmVyZWQgYnlcbiAqIGEgaW5uZXIgT2JzZXJ2YWJsZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBTcGF3biBhIG5ldyBpbnRlcnZhbCBPYnNlcnZhYmxlIGZvciBlYWNoIGNsaWNrIGV2ZW50LCBhbmQgYmxlbmQgdGhlaXIgb3V0cHV0cyBhcyBvbmUgT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGhpZ2hlck9yZGVyID0gY2xpY2tzLnBpcGUobWFwKChldikgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIGNvbnN0IGZpcnN0T3JkZXIgPSBoaWdoZXJPcmRlci5waXBlKG1lcmdlQWxsKCkpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBDb3VudCBmcm9tIDAgdG8gOSBldmVyeSBzZWNvbmQgZm9yIGVhY2ggY2xpY2ssIGJ1dCBvbmx5IGFsbG93IDIgY29uY3VycmVudCB0aW1lcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKFxuICogICBtYXAoKGV2KSA9PiBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMTApKSksXG4gKiApO1xuICogY29uc3QgZmlyc3RPcmRlciA9IGhpZ2hlck9yZGVyLnBpcGUobWVyZ2VBbGwoMikpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lQWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0QWxsfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICogQHNlZSB7QGxpbmsgc3dpdGNoQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICogQHNlZSB7QGxpbmsgemlwQWxsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlubmVyXG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB2YWx1ZXMgY29taW5nIGZyb20gYWxsIHRoZVxuICogaW5uZXIgT2JzZXJ2YWJsZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIG1lcmdlQWxsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbGw8VD4oY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIG1lcmdlTWFwPFQsIFQ+KGlkZW50aXR5IGFzICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFQ+LCBjb25jdXJyZW50KTtcbn1cbiIsIlxuaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuL21lcmdlQWxsJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdEFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsPFI+KCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBSPjtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlIGludG8gYSBmaXJzdC1vcmRlciBPYnNlcnZhYmxlIGJ5XG4gKiBjb25jYXRlbmF0aW5nIHRoZSBpbm5lciBPYnNlcnZhYmxlcyBpbiBvcmRlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgYW4gT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcyBieSBwdXR0aW5nIG9uZVxuICogaW5uZXIgT2JzZXJ2YWJsZSBhZnRlciB0aGUgb3RoZXIuPC9zcGFuPlxuICpcbiAqICFbXShjb25jYXRBbGwucG5nKVxuICpcbiAqIEpvaW5zIGV2ZXJ5IE9ic2VydmFibGUgZW1pdHRlZCBieSB0aGUgc291cmNlIChhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlKSwgaW5cbiAqIGEgc2VyaWFsIGZhc2hpb24uIEl0IHN1YnNjcmliZXMgdG8gZWFjaCBpbm5lciBPYnNlcnZhYmxlIG9ubHkgYWZ0ZXIgdGhlXG4gKiBwcmV2aW91cyBpbm5lciBPYnNlcnZhYmxlIGhhcyBjb21wbGV0ZWQsIGFuZCBtZXJnZXMgYWxsIG9mIHRoZWlyIHZhbHVlcyBpbnRvXG4gKiB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZS5cbiAqXG4gKiBfX1dhcm5pbmc6X18gSWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIE9ic2VydmFibGVzIHF1aWNrbHkgYW5kXG4gKiBlbmRsZXNzbHksIGFuZCB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMgaXQgZW1pdHMgZ2VuZXJhbGx5IGNvbXBsZXRlIHNsb3dlciB0aGFuXG4gKiB0aGUgc291cmNlIGVtaXRzLCB5b3UgY2FuIHJ1biBpbnRvIG1lbW9yeSBpc3N1ZXMgYXMgdGhlIGluY29taW5nIE9ic2VydmFibGVzXG4gKiBjb2xsZWN0IGluIGFuIHVuYm91bmRlZCBidWZmZXIuXG4gKlxuICogTm90ZTogYGNvbmNhdEFsbGAgaXMgZXF1aXZhbGVudCB0byBgbWVyZ2VBbGxgIHdpdGggY29uY3VycmVuY3kgcGFyYW1ldGVyIHNldFxuICogdG8gYDFgLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBGb3IgZWFjaCBjbGljayBldmVudCwgdGljayBldmVyeSBzZWNvbmQgZnJvbSAwIHRvIDMsIHdpdGggbm8gY29uY3VycmVuY3lcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKFxuICogICBtYXAoZXYgPT4gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDQpKSksXG4gKiApO1xuICogY29uc3QgZmlyc3RPcmRlciA9IGhpZ2hlck9yZGVyLnBpcGUoY29uY2F0QWxsKCkpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gKHJlc3VsdHMgYXJlIG5vdCBjb25jdXJyZW50KVxuICogLy8gRm9yIGV2ZXJ5IGNsaWNrIG9uIHRoZSBcImRvY3VtZW50XCIgaXQgd2lsbCBlbWl0IHZhbHVlcyAwIHRvIDMgc3BhY2VkXG4gKiAvLyBvbiBhIDEwMDBtcyBpbnRlcnZhbFxuICogLy8gb25lIGNsaWNrID0gMTAwMG1zLT4gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gMiAtMTAwMG1zLT4gM1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUFsbH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcFRvfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICogQHNlZSB7QGxpbmsgemlwQWxsfVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgZW1pdHRpbmcgdmFsdWVzIGZyb20gYWxsIHRoZSBpbm5lclxuICogT2JzZXJ2YWJsZXMgY29uY2F0ZW5hdGVkLlxuICogQG1ldGhvZCBjb25jYXRBbGxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+IHtcbiAgcmV0dXJuIG1lcmdlQWxsPFQ+KDEpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vZic7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGNvbmNhdEFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9jb25jYXRBbGwnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8VD4gfCBTY2hlZHVsZXJMaWtlKVtdKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2UpW10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKlxuICogQ3JlYXRlcyBhbiBvdXRwdXQgT2JzZXJ2YWJsZSB3aGljaCBzZXF1ZW50aWFsbHkgZW1pdHMgYWxsIHZhbHVlcyBmcm9tIGdpdmVuXG4gKiBPYnNlcnZhYmxlIGFuZCB0aGVuIG1vdmVzIG9uIHRvIHRoZSBuZXh0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db25jYXRlbmF0ZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIgYnlcbiAqIHNlcXVlbnRpYWxseSBlbWl0dGluZyB0aGVpciB2YWx1ZXMsIG9uZSBPYnNlcnZhYmxlIGFmdGVyIHRoZSBvdGhlci48L3NwYW4+XG4gKlxuICogIVtdKGNvbmNhdC5wbmcpXG4gKlxuICogYGNvbmNhdGAgam9pbnMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIsIGJ5IHN1YnNjcmliaW5nIHRvIHRoZW0gb25lIGF0IGEgdGltZSBhbmRcbiAqIG1lcmdpbmcgdGhlaXIgcmVzdWx0cyBpbnRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gWW91IGNhbiBwYXNzIGVpdGhlciBhbiBhcnJheSBvZlxuICogT2JzZXJ2YWJsZXMsIG9yIHB1dCB0aGVtIGRpcmVjdGx5IGFzIGFyZ3VtZW50cy4gUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIHJlc3VsdFxuICogaW4gT2JzZXJ2YWJsZSB0aGF0IGNvbXBsZXRlcyBpbW1lZGlhdGVseS5cbiAqXG4gKiBgY29uY2F0YCB3aWxsIHN1YnNjcmliZSB0byBmaXJzdCBpbnB1dCBPYnNlcnZhYmxlIGFuZCBlbWl0IGFsbCBpdHMgdmFsdWVzLCB3aXRob3V0XG4gKiBjaGFuZ2luZyBvciBhZmZlY3RpbmcgdGhlbSBpbiBhbnkgd2F5LiBXaGVuIHRoYXQgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsIGl0IHdpbGxcbiAqIHN1YnNjcmliZSB0byB0aGVuIG5leHQgT2JzZXJ2YWJsZSBwYXNzZWQgYW5kLCBhZ2FpbiwgZW1pdCBpdHMgdmFsdWVzLiBUaGlzIHdpbGwgYmVcbiAqIHJlcGVhdGVkLCB1bnRpbCB0aGUgb3BlcmF0b3IgcnVucyBvdXQgb2YgT2JzZXJ2YWJsZXMuIFdoZW4gbGFzdCBpbnB1dCBPYnNlcnZhYmxlIGNvbXBsZXRlcyxcbiAqIGBjb25jYXRgIHdpbGwgY29tcGxldGUgYXMgd2VsbC4gQXQgYW55IGdpdmVuIG1vbWVudCBvbmx5IG9uZSBPYnNlcnZhYmxlIHBhc3NlZCB0byBvcGVyYXRvclxuICogZW1pdHMgdmFsdWVzLiBJZiB5b3Ugd291bGQgbGlrZSB0byBlbWl0IHZhbHVlcyBmcm9tIHBhc3NlZCBPYnNlcnZhYmxlcyBjb25jdXJyZW50bHksIGNoZWNrIG91dFxuICoge0BsaW5rIG1lcmdlfSBpbnN0ZWFkLCBlc3BlY2lhbGx5IHdpdGggb3B0aW9uYWwgYGNvbmN1cnJlbnRgIHBhcmFtZXRlci4gQXMgYSBtYXR0ZXIgb2YgZmFjdCxcbiAqIGBjb25jYXRgIGlzIGFuIGVxdWl2YWxlbnQgb2YgYG1lcmdlYCBvcGVyYXRvciB3aXRoIGBjb25jdXJyZW50YCBwYXJhbWV0ZXIgc2V0IHRvIGAxYC5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgc29tZSBpbnB1dCBPYnNlcnZhYmxlIG5ldmVyIGNvbXBsZXRlcywgYGNvbmNhdGAgd2lsbCBhbHNvIG5ldmVyIGNvbXBsZXRlXG4gKiBhbmQgT2JzZXJ2YWJsZXMgZm9sbG93aW5nIHRoZSBvbmUgdGhhdCBkaWQgbm90IGNvbXBsZXRlIHdpbGwgbmV2ZXIgYmUgc3Vic2NyaWJlZC4gT24gdGhlIG90aGVyXG4gKiBoYW5kLCBpZiBzb21lIE9ic2VydmFibGUgc2ltcGx5IGNvbXBsZXRlcyBpbW1lZGlhdGVseSBhZnRlciBpdCBpcyBzdWJzY3JpYmVkLCBpdCB3aWxsIGJlXG4gKiBpbnZpc2libGUgZm9yIGBjb25jYXRgLCB3aGljaCB3aWxsIGp1c3QgbW92ZSBvbiB0byB0aGUgbmV4dCBPYnNlcnZhYmxlLlxuICpcbiAqIElmIGFueSBPYnNlcnZhYmxlIGluIGNoYWluIGVycm9ycywgaW5zdGVhZCBvZiBwYXNzaW5nIGNvbnRyb2wgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSxcbiAqIGBjb25jYXRgIHdpbGwgZXJyb3IgaW1tZWRpYXRlbHkgYXMgd2VsbC4gT2JzZXJ2YWJsZXMgdGhhdCB3b3VsZCBiZSBzdWJzY3JpYmVkIGFmdGVyXG4gKiB0aGUgb25lIHRoYXQgZW1pdHRlZCBlcnJvciwgbmV2ZXIgd2lsbC5cbiAqXG4gKiBJZiB5b3UgcGFzcyB0byBgY29uY2F0YCB0aGUgc2FtZSBPYnNlcnZhYmxlIG1hbnkgdGltZXMsIGl0cyBzdHJlYW0gb2YgdmFsdWVzXG4gKiB3aWxsIGJlIFwicmVwbGF5ZWRcIiBvbiBldmVyeSBzdWJzY3JpcHRpb24sIHdoaWNoIG1lYW5zIHlvdSBjYW4gcmVwZWF0IGdpdmVuIE9ic2VydmFibGVcbiAqIGFzIG1hbnkgdGltZXMgYXMgeW91IGxpa2UuIElmIHBhc3NpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byBgY29uY2F0YCAxMDAwIHRpbWVzIGJlY29tZXMgdGVkaW91cyxcbiAqIHlvdSBjYW4gYWx3YXlzIHVzZSB7QGxpbmsgcmVwZWF0fS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbmNhdGVuYXRlIGEgdGltZXIgY291bnRpbmcgZnJvbSAwIHRvIDMgd2l0aCBhIHN5bmNocm9ub3VzIHNlcXVlbmNlIGZyb20gMSB0byAxMFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoNCkpO1xuICogY29uc3Qgc2VxdWVuY2UgPSByYW5nZSgxLCAxMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQodGltZXIsIHNlcXVlbmNlKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gcmVzdWx0cyBpbjpcbiAqIC8vIDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IDIgLTEwMDBtcy0+IDMgLWltbWVkaWF0ZS0+IDEgLi4uIDEwXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgYW4gYXJyYXkgb2YgMyBPYnNlcnZhYmxlc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIxID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCB0aW1lcjIgPSBpbnRlcnZhbCgyMDAwKS5waXBlKHRha2UoNikpO1xuICogY29uc3QgdGltZXIzID0gaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdChbdGltZXIxLCB0aW1lcjIsIHRpbWVyM10pOyAvLyBub3RlIHRoYXQgYXJyYXkgaXMgcGFzc2VkXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIChQcmludHMgdG8gY29uc29sZSBzZXF1ZW50aWFsbHkpXG4gKiAvLyAtMTAwMG1zLT4gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gLi4uIDlcbiAqIC8vIC0yMDAwbXMtPiAwIC0yMDAwbXMtPiAxIC0yMDAwbXMtPiAuLi4gNVxuICogLy8gLTUwMG1zLT4gMCAtNTAwbXMtPiAxIC01MDBtcy0+IC4uLiA5XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byByZXBlYXQgaXRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDIpKTtcbiAqICpcbiAqIGNvbmNhdCh0aW1lciwgdGltZXIpIC8vIGNvbmNhdGVuYXRpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSFcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnLi4uYW5kIGl0IGlzIGRvbmUhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDAgYWZ0ZXIgMXNcbiAqIC8vIDEgYWZ0ZXIgMnNcbiAqIC8vIDAgYWZ0ZXIgM3NcbiAqIC8vIDEgYWZ0ZXIgNHNcbiAqIC8vIFwiLi4uYW5kIGl0IGlzIGRvbmUhXCIgYWxzbyBhZnRlciA0c1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0QWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwVG99XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MSBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MiBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnQuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9bnVsbF0gQW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHNjaGVkdWxlIGVhY2hcbiAqIE9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQWxsIHZhbHVlcyBvZiBlYWNoIHBhc3NlZCBPYnNlcnZhYmxlIG1lcmdlZCBpbnRvIGFcbiAqIHNpbmdsZSBPYnNlcnZhYmxlLCBpbiBvcmRlciwgaW4gc2VyaWFsIGZhc2hpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGNvbmNhdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj4ge1xuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxIHx8IChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDIgJiYgaXNTY2hlZHVsZXIob2JzZXJ2YWJsZXNbMV0pKSkge1xuICAgIHJldHVybiBmcm9tKDxhbnk+b2JzZXJ2YWJsZXNbMF0pO1xuICB9XG4gIHJldHVybiBjb25jYXRBbGw8Uj4oKShvZiguLi5vYnNlcnZhYmxlcykpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7IC8vIGxvbFxuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCwgb24gc3Vic2NyaWJlLCBjYWxscyBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgdG9cbiAqIG1ha2UgYW4gT2JzZXJ2YWJsZSBmb3IgZWFjaCBuZXcgT2JzZXJ2ZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZXMgdGhlIE9ic2VydmFibGUgbGF6aWx5LCB0aGF0IGlzLCBvbmx5IHdoZW4gaXRcbiAqIGlzIHN1YnNjcmliZWQuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGRlZmVyLnBuZylcbiAqXG4gKiBgZGVmZXJgIGFsbG93cyB5b3UgdG8gY3JlYXRlIHRoZSBPYnNlcnZhYmxlIG9ubHkgd2hlbiB0aGUgT2JzZXJ2ZXJcbiAqIHN1YnNjcmliZXMsIGFuZCBjcmVhdGUgYSBmcmVzaCBPYnNlcnZhYmxlIGZvciBlYWNoIE9ic2VydmVyLiBJdCB3YWl0cyB1bnRpbFxuICogYW4gT2JzZXJ2ZXIgc3Vic2NyaWJlcyB0byBpdCwgYW5kIHRoZW4gaXQgZ2VuZXJhdGVzIGFuIE9ic2VydmFibGUsXG4gKiB0eXBpY2FsbHkgd2l0aCBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uIEl0IGRvZXMgdGhpcyBhZnJlc2ggZm9yIGVhY2hcbiAqIHN1YnNjcmliZXIsIHNvIGFsdGhvdWdoIGVhY2ggc3Vic2NyaWJlciBtYXkgdGhpbmsgaXQgaXMgc3Vic2NyaWJpbmcgdG8gdGhlXG4gKiBzYW1lIE9ic2VydmFibGUsIGluIGZhY3QgZWFjaCBzdWJzY3JpYmVyIGdldHMgaXRzIG93biBpbmRpdmlkdWFsXG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBTdWJzY3JpYmUgdG8gZWl0aGVyIGFuIE9ic2VydmFibGUgb2YgY2xpY2tzIG9yIGFuIE9ic2VydmFibGUgb2YgaW50ZXJ2YWwsIGF0IHJhbmRvbVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzT3JJbnRlcnZhbCA9IGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAqICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjVcbiAqICAgICA/IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJylcbiAqICAgICA6IGludGVydmFsKDEwMDApO1xuICogfSk7XG4gKiBjbGlja3NPckludGVydmFsLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3I6XG4gKiAvLyBJZiB0aGUgcmVzdWx0IG9mIE1hdGgucmFuZG9tKCkgaXMgZ3JlYXRlciB0aGFuIDAuNSBpdCB3aWxsIGxpc3RlblxuICogLy8gZm9yIGNsaWNrcyBhbnl3aGVyZSBvbiB0aGUgXCJkb2N1bWVudFwiOyB3aGVuIGRvY3VtZW50IGlzIGNsaWNrZWQgaXRcbiAqIC8vIHdpbGwgbG9nIGEgTW91c2VFdmVudCBvYmplY3QgdG8gdGhlIGNvbnNvbGUuIElmIHRoZSByZXN1bHQgaXMgbGVzc1xuICogLy8gdGhhbiAwLjUgaXQgd2lsbCBlbWl0IGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykuXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBvYnNlcnZhYmxlRmFjdG9yeSBUaGUgT2JzZXJ2YWJsZVxuICogZmFjdG9yeSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggT2JzZXJ2ZXIgdGhhdCBzdWJzY3JpYmVzIHRvIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIE1heSBhbHNvIHJldHVybiBhIFByb21pc2UsIHdoaWNoIHdpbGwgYmUgY29udmVydGVkIG9uIHRoZSBmbHlcbiAqIHRvIGFuIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHdob3NlIE9ic2VydmVycycgc3Vic2NyaXB0aW9ucyB0cmlnZ2VyXG4gKiBhbiBpbnZvY2F0aW9uIG9mIHRoZSBnaXZlbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGRlZmVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmZXI8VD4ob2JzZXJ2YWJsZUZhY3Rvcnk6ICgpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiB8IHZvaWQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbnB1dDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+IHwgdm9pZDtcbiAgICB0cnkge1xuICAgICAgaW5wdXQgPSBvYnNlcnZhYmxlRmFjdG9yeSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlID0gaW5wdXQgPyBmcm9tKGlucHV0KSA6IGVtcHR5KCk7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH0pO1xufSIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8vIGZvcmtKb2luKFthJCwgYiQsIGMkXSk7XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPl0pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDI+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj5dKTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDM+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUND4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDU+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT4sIE9ic2VydmFibGVJbnB1dDxUNj5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik6IE9ic2VydmFibGU8VFtdPjtcblxuLy8gZm9ya0pvaW4oYSQsIGIkLCBjJClcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+KTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPik6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIGRlcHJlY2F0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbiguLi5hcmdzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PnxGdW5jdGlvbj4pOiBPYnNlcnZhYmxlPGFueT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oLi4uc291cmNlczogT2JzZXJ2YWJsZUlucHV0PFQ+W10pOiBPYnNlcnZhYmxlPFRbXT47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEpvaW5zIGxhc3QgdmFsdWVzIGVtaXR0ZWQgYnkgcGFzc2VkIE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XYWl0IGZvciBPYnNlcnZhYmxlcyB0byBjb21wbGV0ZSBhbmQgdGhlbiBjb21iaW5lIGxhc3QgdmFsdWVzIHRoZXkgZW1pdHRlZC48L3NwYW4+XG4gKlxuICogIVtdKGZvcmtKb2luLnBuZylcbiAqXG4gKiBgZm9ya0pvaW5gIGlzIGFuIG9wZXJhdG9yIHRoYXQgdGFrZXMgYW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyB3aGljaCBjYW4gYmUgcGFzc2VkIGVpdGhlciBhcyBhbiBhcnJheVxuICogb3IgZGlyZWN0bHkgYXMgYXJndW1lbnRzLiBJZiBubyBpbnB1dCBPYnNlcnZhYmxlcyBhcmUgcHJvdmlkZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBjb21wbGV0ZVxuICogaW1tZWRpYXRlbHkuXG4gKlxuICogYGZvcmtKb2luYCB3aWxsIHdhaXQgZm9yIGFsbCBwYXNzZWQgT2JzZXJ2YWJsZXMgdG8gY29tcGxldGUgYW5kIHRoZW4gaXQgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggbGFzdFxuICogdmFsdWVzIGZyb20gY29ycmVzcG9uZGluZyBPYnNlcnZhYmxlcy4gU28gaWYgeW91IHBhc3MgYG5gIE9ic2VydmFibGVzIHRvIHRoZSBvcGVyYXRvciwgcmVzdWx0aW5nXG4gKiBhcnJheSB3aWxsIGhhdmUgYG5gIHZhbHVlcywgd2hlcmUgZmlyc3QgdmFsdWUgaXMgdGhlIGxhc3QgdGhpbmcgZW1pdHRlZCBieSB0aGUgZmlyc3QgT2JzZXJ2YWJsZSxcbiAqIHNlY29uZCB2YWx1ZSBpcyB0aGUgbGFzdCB0aGluZyBlbWl0dGVkIGJ5IHRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBhbmQgc28gb24uIFRoYXQgbWVhbnMgYGZvcmtKb2luYCB3aWxsXG4gKiBub3QgZW1pdCBtb3JlIHRoYW4gb25jZSBhbmQgaXQgd2lsbCBjb21wbGV0ZSBhZnRlciB0aGF0LiBJZiB5b3UgbmVlZCB0byBlbWl0IGNvbWJpbmVkIHZhbHVlcyBub3Qgb25seVxuICogYXQgdGhlIGVuZCBvZiBsaWZlY3ljbGUgb2YgcGFzc2VkIE9ic2VydmFibGVzLCBidXQgYWxzbyB0aHJvdWdob3V0IGl0LCB0cnkgb3V0IHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogb3Ige0BsaW5rIHppcH0gaW5zdGVhZC5cbiAqXG4gKiBJbiBvcmRlciBmb3IgcmVzdWx0aW5nIGFycmF5IHRvIGhhdmUgdGhlIHNhbWUgbGVuZ3RoIGFzIHRoZSBudW1iZXIgb2YgaW5wdXQgT2JzZXJ2YWJsZXMsIHdoZW5ldmVyIGFueSBvZlxuICogdGhhdCBPYnNlcnZhYmxlcyBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhbnkgdmFsdWUsIGBmb3JrSm9pbmAgd2lsbCBjb21wbGV0ZSBhdCB0aGF0IG1vbWVudCBhcyB3ZWxsXG4gKiBhbmQgaXQgd2lsbCBub3QgZW1pdCBhbnl0aGluZyBlaXRoZXIsIGV2ZW4gaWYgaXQgYWxyZWFkeSBoYXMgc29tZSBsYXN0IHZhbHVlcyBmcm9tIG90aGVyIE9ic2VydmFibGVzLlxuICogQ29udmVyc2VseSwgaWYgdGhlcmUgaXMgYW4gT2JzZXJ2YWJsZSB0aGF0IG5ldmVyIGNvbXBsZXRlcywgYGZvcmtKb2luYCB3aWxsIG5ldmVyIGNvbXBsZXRlIGFzIHdlbGwsXG4gKiB1bmxlc3MgYXQgYW55IHBvaW50IHNvbWUgb3RoZXIgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyB2YWx1ZSwgd2hpY2ggYnJpbmdzIHVzIGJhY2sgdG9cbiAqIHRoZSBwcmV2aW91cyBjYXNlLiBPdmVyYWxsLCBpbiBvcmRlciBmb3IgYGZvcmtKb2luYCB0byBlbWl0IGEgdmFsdWUsIGFsbCBPYnNlcnZhYmxlcyBwYXNzZWQgYXMgYXJndW1lbnRzXG4gKiBoYXZlIHRvIGVtaXQgc29tZXRoaW5nIGF0IGxlYXN0IG9uY2UgYW5kIGNvbXBsZXRlLlxuICpcbiAqIElmIGFueSBpbnB1dCBPYnNlcnZhYmxlIGVycm9ycyBhdCBzb21lIHBvaW50LCBgZm9ya0pvaW5gIHdpbGwgZXJyb3IgYXMgd2VsbCBhbmQgYWxsIG90aGVyIE9ic2VydmFibGVzXG4gKiB3aWxsIGJlIGltbWVkaWF0ZWx5IHVuc3Vic2NyaWJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IGBmb3JrSm9pbmAgYWNjZXB0cyBwcm9qZWN0IGZ1bmN0aW9uLCB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggdmFsdWVzIHdoaWNoIG5vcm1hbGx5XG4gKiB3b3VsZCBsYW5kIGluIGVtaXR0ZWQgYXJyYXkuIFdoYXRldmVyIGlzIHJldHVybmVkIGJ5IHByb2plY3QgZnVuY3Rpb24sIHdpbGwgYXBwZWFyIGluIG91dHB1dFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkLiBUaGlzIG1lYW5zIHRoYXQgZGVmYXVsdCBwcm9qZWN0IGNhbiBiZSB0aG91Z2h0IG9mIGFzIGEgZnVuY3Rpb24gdGhhdCB0YWtlc1xuICogYWxsIGl0cyBhcmd1bWVudHMgYW5kIHB1dHMgdGhlbSBpbnRvIGFuIGFycmF5LiBOb3RlIHRoYXQgcHJvamVjdCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbmx5XG4gKiB3aGVuIG91dHB1dCBPYnNlcnZhYmxlIGlzIHN1cHBvc2VkIHRvIGVtaXQgYSByZXN1bHQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBvcGVyYXRvciBlbWl0dGluZyBpbW1lZGlhdGVseVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBvZigxLCAyLCAzLCA0KSxcbiAqICAgb2YoNSwgNiwgNywgOCksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFs0LCA4XVxuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggb3BlcmF0b3IgZW1pdHRpbmcgYWZ0ZXIgc29tZSB0aW1lXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMykpLCAvLyBlbWl0IDAsIDEsIDIgZXZlcnkgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogICBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSg0KSksICAvLyBlbWl0IDAsIDEsIDIsIDMgZXZlcnkgaGFsZiBhIHNlY29uZCBhbmQgY29tcGxldGVcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gWzIsIDNdIGFmdGVyIDMgc2Vjb25kc1xuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggcHJvamVjdCBmdW5jdGlvblxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgam9ya0pvaW4sIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDMpKSwgLy8gZW1pdCAwLCAxLCAyIGV2ZXJ5IHNlY29uZCBhbmQgY29tcGxldGVcbiAqICAgaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoNCkpLCAgLy8gZW1pdCAwLCAxLCAyLCAzIGV2ZXJ5IGhhbGYgYSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiApLnBpcGUoXG4gKiAgIG1hcCgoW24sIG1dKSA9PiBuICsgbSksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDUgYWZ0ZXIgMyBzZWNvbmRzXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCIgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayB6aXB9XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IHNvdXJjZXMgQW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyBwcm92aWRlZCBlaXRoZXIgYXMgYW4gYXJyYXkgb3IgYXMgYW4gYXJndW1lbnRzXG4gKiBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIG9wZXJhdG9yLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Byb2plY3RdIEZ1bmN0aW9uIHRoYXQgdGFrZXMgdmFsdWVzIGVtaXR0ZWQgYnkgaW5wdXQgT2JzZXJ2YWJsZXMgYW5kIHJldHVybnMgdmFsdWVcbiAqIHRoYXQgd2lsbCBhcHBlYXIgaW4gcmVzdWx0aW5nIE9ic2VydmFibGUgaW5zdGVhZCBvZiBkZWZhdWx0IGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gT2JzZXJ2YWJsZSBlbWl0dGluZyBlaXRoZXIgYW4gYXJyYXkgb2YgbGFzdCB2YWx1ZXMgZW1pdHRlZCBieSBwYXNzZWQgT2JzZXJ2YWJsZXNcbiAqIG9yIHZhbHVlIGZyb20gcHJvamVjdCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KFxuICAuLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCBPYnNlcnZhYmxlSW5wdXQ8VD5bXSB8IEZ1bmN0aW9uPlxuKTogT2JzZXJ2YWJsZTxUW10+IHtcblxuICBsZXQgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uO1xuICBpZiAodHlwZW9mIHNvdXJjZXNbc291cmNlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJlc3VsdFNlbGVjdG9yID0gc291cmNlcy5wb3AoKSBhcyBGdW5jdGlvbjtcbiAgfVxuXG4gIC8vIGlmIHRoZSBmaXJzdCBhbmQgb25seSBvdGhlciBhcmd1bWVudCBpcyBhbiBhcnJheVxuICAvLyBhc3N1bWUgaXQncyBiZWVuIGNhbGxlZCB3aXRoIGBmb3JrSm9pbihbb2JzMSwgb2JzMiwgb2JzM10pYFxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShzb3VyY2VzWzBdKSkge1xuICAgIHNvdXJjZXMgPSBzb3VyY2VzWzBdIGFzIEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj47XG4gIH1cblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZm9ya0pvaW4oc291cmNlcykucGlwZShcbiAgICAgIG1hcChhcmdzID0+IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgcmV0dXJuIG5ldyBGb3JrSm9pblN1YnNjcmliZXIoc3Vic2NyaWJlciwgc291cmNlcyBhcyBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTtcbiAgfSk7XG59XG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRm9ya0pvaW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSBjb21wbGV0ZWQgPSAwO1xuICBwcml2YXRlIHZhbHVlczogVFtdO1xuICBwcml2YXRlIGhhdmVWYWx1ZXMgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG5cbiAgICBjb25zdCBsZW4gPSBzb3VyY2VzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3Qgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgIGNvbnN0IGlubmVyU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgc291cmNlLCBudWxsLCBpKTtcblxuICAgICAgaWYgKGlubmVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogVCxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNbb3V0ZXJJbmRleF0gPSBpbm5lclZhbHVlO1xuICAgIGlmICghKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlKSB7XG4gICAgICAoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUgPSB0cnVlO1xuICAgICAgdGhpcy5oYXZlVmFsdWVzKys7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24sIGhhdmVWYWx1ZXMsIHZhbHVlcyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSB2YWx1ZXMubGVuZ3RoO1xuXG4gICAgaWYgKCEoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb21wbGV0ZWQrKztcblxuICAgIGlmICh0aGlzLmNvbXBsZXRlZCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGhhdmVWYWx1ZXMgPT09IGxlbikge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZXMpO1xuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcblxuY29uc3QgdG9TdHJpbmc6IEZ1bmN0aW9uID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlU3R5bGVFdmVudEVtaXR0ZXIge1xuICBhZGRMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nIHwgc3ltYm9sLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB0aGlzO1xuICByZW1vdmVMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nIHwgc3ltYm9sLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB0aGlzO1xufVxuXG5leHBvcnQgdHlwZSBOb2RlRXZlbnRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG4vLyBGb3IgQVBJcyB0aGF0IGltcGxlbWVudCBgYWRkTGlzdGVuZXJgIGFuZCBgcmVtb3ZlTGlzdGVuZXJgIG1ldGhvZHMgdGhhdCBtYXlcbi8vIG5vdCB1c2UgdGhlIHNhbWUgYXJndW1lbnRzIG9yIHJldHVybiBFdmVudEVtaXR0ZXIgdmFsdWVzXG4vLyBzdWNoIGFzIFJlYWN0IE5hdGl2ZVxuZXhwb3J0IGludGVyZmFjZSBOb2RlQ29tcGF0aWJsZUV2ZW50RW1pdHRlciB7XG4gIGFkZExpc3RlbmVyOiAoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IHZvaWQgfCB7fTtcbiAgcmVtb3ZlTGlzdGVuZXI6IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlcikgPT4gdm9pZCB8IHt9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpRdWVyeVN0eWxlRXZlbnRFbWl0dGVyIHtcbiAgb246IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pID0+IHZvaWQ7XG4gIG9mZjogKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxFPiB7XG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogKChldnQ6IEUpID0+IHZvaWQpIHwgbnVsbCwgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcj86ICgoZXZ0OiBFKSA9PiB2b2lkKSB8IG51bGwsIG9wdGlvbnM/OiBFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBFdmVudFRhcmdldExpa2U8VD4gPSBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxUPiB8IE5vZGVTdHlsZUV2ZW50RW1pdHRlciB8IE5vZGVDb21wYXRpYmxlRXZlbnRFbWl0dGVyIHwgSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXI7XG5cbmV4cG9ydCB0eXBlIEZyb21FdmVudFRhcmdldDxUPiA9IEV2ZW50VGFyZ2V0TGlrZTxUPiB8IEFycmF5TGlrZTxFdmVudFRhcmdldExpa2U8VD4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TGlzdGVuZXJPcHRpb25zIHtcbiAgY2FwdHVyZT86IGJvb2xlYW47XG4gIHBhc3NpdmU/OiBib29sZWFuO1xuICBvbmNlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyBleHRlbmRzIEV2ZW50TGlzdGVuZXJPcHRpb25zIHtcbiAgb25jZT86IGJvb2xlYW47XG4gIHBhc3NpdmU/OiBib29sZWFuO1xufVxuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZywgcmVzdWx0U2VsZWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZywgb3B0aW9uczogRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nLCBvcHRpb25zOiBFdmVudExpc3RlbmVyT3B0aW9ucywgcmVzdWx0U2VsZWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGV2ZW50cyBvZiBhIHNwZWNpZmljIHR5cGUgY29taW5nIGZyb20gdGhlXG4gKiBnaXZlbiBldmVudCB0YXJnZXQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBmcm9tIERPTSBldmVudHMsIG9yIE5vZGUuanNcbiAqIEV2ZW50RW1pdHRlciBldmVudHMgb3Igb3RoZXJzLjwvc3Bhbj5cbiAqXG4gKiAhW10oZnJvbUV2ZW50LnBuZylcbiAqXG4gKiBgZnJvbUV2ZW50YCBhY2NlcHRzIGFzIGEgZmlyc3QgYXJndW1lbnQgZXZlbnQgdGFyZ2V0LCB3aGljaCBpcyBhbiBvYmplY3Qgd2l0aCBtZXRob2RzXG4gKiBmb3IgcmVnaXN0ZXJpbmcgZXZlbnQgaGFuZGxlciBmdW5jdGlvbnMuIEFzIGEgc2Vjb25kIGFyZ3VtZW50IGl0IHRha2VzIHN0cmluZyB0aGF0IGluZGljYXRlc1xuICogdHlwZSBvZiBldmVudCB3ZSB3YW50IHRvIGxpc3RlbiBmb3IuIGBmcm9tRXZlbnRgIHN1cHBvcnRzIHNlbGVjdGVkIHR5cGVzIG9mIGV2ZW50IHRhcmdldHMsXG4gKiB3aGljaCBhcmUgZGVzY3JpYmVkIGluIGRldGFpbCBiZWxvdy4gSWYgeW91ciBldmVudCB0YXJnZXQgZG9lcyBub3QgbWF0Y2ggYW55IG9mIHRoZSBvbmVzIGxpc3RlZCxcbiAqIHlvdSBzaG91bGQgdXNlIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSwgd2hpY2ggY2FuIGJlIHVzZWQgb24gYXJiaXRyYXJ5IEFQSXMuXG4gKiBXaGVuIGl0IGNvbWVzIHRvIEFQSXMgc3VwcG9ydGVkIGJ5IGBmcm9tRXZlbnRgLCB0aGVpciBtZXRob2RzIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGV2ZW50XG4gKiBoYW5kbGVyIGZ1bmN0aW9ucyBoYXZlIGRpZmZlcmVudCBuYW1lcywgYnV0IHRoZXkgYWxsIGFjY2VwdCBhIHN0cmluZyBkZXNjcmliaW5nIGV2ZW50IHR5cGVcbiAqIGFuZCBmdW5jdGlvbiBpdHNlbGYsIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHNhaWQgZXZlbnQgaGFwcGVucy5cbiAqXG4gKiBFdmVyeSB0aW1lIHJlc3VsdGluZyBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQsIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gd2lsbCBiZSByZWdpc3RlcmVkXG4gKiB0byBldmVudCB0YXJnZXQgb24gZ2l2ZW4gZXZlbnQgdHlwZS4gV2hlbiB0aGF0IGV2ZW50IGZpcmVzLCB2YWx1ZVxuICogcGFzc2VkIGFzIGEgZmlyc3QgYXJndW1lbnQgdG8gcmVnaXN0ZXJlZCBmdW5jdGlvbiB3aWxsIGJlIGVtaXR0ZWQgYnkgb3V0cHV0IE9ic2VydmFibGUuXG4gKiBXaGVuIE9ic2VydmFibGUgaXMgdW5zdWJzY3JpYmVkLCBmdW5jdGlvbiB3aWxsIGJlIHVucmVnaXN0ZXJlZCBmcm9tIGV2ZW50IHRhcmdldC5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgZXZlbnQgdGFyZ2V0IGNhbGxzIHJlZ2lzdGVyZWQgZnVuY3Rpb24gd2l0aCBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBzZWNvbmRcbiAqIGFuZCBmb2xsb3dpbmcgYXJndW1lbnRzIHdpbGwgbm90IGFwcGVhciBpbiByZXN1bHRpbmcgc3RyZWFtLiBJbiBvcmRlciB0byBnZXQgYWNjZXNzIHRvIHRoZW0sXG4gKiB5b3UgY2FuIHBhc3MgdG8gYGZyb21FdmVudGAgb3B0aW9uYWwgcHJvamVjdCBmdW5jdGlvbiwgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBhbGwgYXJndW1lbnRzXG4gKiBwYXNzZWQgdG8gZXZlbnQgaGFuZGxlci4gT3V0cHV0IE9ic2VydmFibGUgd2lsbCB0aGVuIGVtaXQgdmFsdWUgcmV0dXJuZWQgYnkgcHJvamVjdCBmdW5jdGlvbixcbiAqIGluc3RlYWQgb2YgdGhlIHVzdWFsIHZhbHVlLlxuICpcbiAqIFJlbWVtYmVyIHRoYXQgZXZlbnQgdGFyZ2V0cyBsaXN0ZWQgYmVsb3cgYXJlIGNoZWNrZWQgdmlhIGR1Y2sgdHlwaW5nLiBJdCBtZWFucyB0aGF0XG4gKiBubyBtYXR0ZXIgd2hhdCBraW5kIG9mIG9iamVjdCB5b3UgaGF2ZSBhbmQgbm8gbWF0dGVyIHdoYXQgZW52aXJvbm1lbnQgeW91IHdvcmsgaW4sXG4gKiB5b3UgY2FuIHNhZmVseSB1c2UgYGZyb21FdmVudGAgb24gdGhhdCBvYmplY3QgaWYgaXQgZXhwb3NlcyBkZXNjcmliZWQgbWV0aG9kcyAocHJvdmlkZWRcbiAqIG9mIGNvdXJzZSB0aGV5IGJlaGF2ZSBhcyB3YXMgZGVzY3JpYmVkIGFib3ZlKS4gU28gZm9yIGV4YW1wbGUgaWYgTm9kZS5qcyBsaWJyYXJ5IGV4cG9zZXNcbiAqIGV2ZW50IHRhcmdldCB3aGljaCBoYXMgdGhlIHNhbWUgbWV0aG9kIG5hbWVzIGFzIERPTSBFdmVudFRhcmdldCwgYGZyb21FdmVudGAgaXMgc3RpbGxcbiAqIGEgZ29vZCBjaG9pY2UuXG4gKlxuICogSWYgdGhlIEFQSSB5b3UgdXNlIGlzIG1vcmUgY2FsbGJhY2sgdGhlbiBldmVudCBoYW5kbGVyIG9yaWVudGVkIChzdWJzY3JpYmVkXG4gKiBjYWxsYmFjayBmdW5jdGlvbiBmaXJlcyBvbmx5IG9uY2UgYW5kIHRodXMgdGhlcmUgaXMgbm8gbmVlZCB0byBtYW51YWxseVxuICogdW5yZWdpc3RlciBpdCksIHlvdSBzaG91bGQgdXNlIHtAbGluayBiaW5kQ2FsbGJhY2t9IG9yIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogaW5zdGVhZC5cbiAqXG4gKiBgZnJvbUV2ZW50YCBzdXBwb3J0cyBmb2xsb3dpbmcgdHlwZXMgb2YgZXZlbnQgdGFyZ2V0czpcbiAqXG4gKiAqKkRPTSBFdmVudFRhcmdldCoqXG4gKlxuICogVGhpcyBpcyBhbiBvYmplY3Qgd2l0aCBgYWRkRXZlbnRMaXN0ZW5lcmAgYW5kIGByZW1vdmVFdmVudExpc3RlbmVyYCBtZXRob2RzLlxuICpcbiAqIEluIHRoZSBicm93c2VyLCBgYWRkRXZlbnRMaXN0ZW5lcmAgYWNjZXB0cyAtIGFwYXJ0IGZyb20gZXZlbnQgdHlwZSBzdHJpbmcgYW5kIGV2ZW50XG4gKiBoYW5kbGVyIGZ1bmN0aW9uIGFyZ3VtZW50cyAtIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciwgd2hpY2ggaXMgZWl0aGVyIGFuIG9iamVjdCBvciBib29sZWFuLFxuICogYm90aCB1c2VkIGZvciBhZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gaG93IGFuZCB3aGVuIHBhc3NlZCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZC4gV2hlblxuICogYGZyb21FdmVudGAgaXMgdXNlZCB3aXRoIGV2ZW50IHRhcmdldCBvZiB0aGF0IHR5cGUsIHlvdSBjYW4gcHJvdmlkZSB0aGlzIHZhbHVlc1xuICogYXMgdGhpcmQgcGFyYW1ldGVyIGFzIHdlbGwuXG4gKlxuICogKipOb2RlLmpzIEV2ZW50RW1pdHRlcioqXG4gKlxuICogQW4gb2JqZWN0IHdpdGggYGFkZExpc3RlbmVyYCBhbmQgYHJlbW92ZUxpc3RlbmVyYCBtZXRob2RzLlxuICpcbiAqICoqSlF1ZXJ5LXN0eWxlIGV2ZW50IHRhcmdldCoqXG4gKlxuICogQW4gb2JqZWN0IHdpdGggYG9uYCBhbmQgYG9mZmAgbWV0aG9kc1xuICpcbiAqICoqRE9NIE5vZGVMaXN0KipcbiAqXG4gKiBMaXN0IG9mIERPTSBOb2RlcywgcmV0dXJuZWQgZm9yIGV4YW1wbGUgYnkgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIG9yIGBOb2RlLmNoaWxkTm9kZXNgLlxuICpcbiAqIEFsdGhvdWdoIHRoaXMgY29sbGVjdGlvbiBpcyBub3QgZXZlbnQgdGFyZ2V0IGluIGl0c2VsZiwgYGZyb21FdmVudGAgd2lsbCBpdGVyYXRlIG92ZXIgYWxsIE5vZGVzXG4gKiBpdCBjb250YWlucyBhbmQgaW5zdGFsbCBldmVudCBoYW5kbGVyIGZ1bmN0aW9uIGluIGV2ZXJ5IG9mIHRoZW0uIFdoZW4gcmV0dXJuZWQgT2JzZXJ2YWJsZVxuICogaXMgdW5zdWJzY3JpYmVkLCBmdW5jdGlvbiB3aWxsIGJlIHJlbW92ZWQgZnJvbSBhbGwgTm9kZXMuXG4gKlxuICogKipET00gSHRtbENvbGxlY3Rpb24qKlxuICpcbiAqIEp1c3QgYXMgaW4gY2FzZSBvZiBOb2RlTGlzdCBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgRE9NIG5vZGVzLiBIZXJlIGFzIHdlbGwgZXZlbnQgaGFuZGxlciBmdW5jdGlvbiBpc1xuICogaW5zdGFsbGVkIGFuZCByZW1vdmVkIGluIGVhY2ggb2YgZWxlbWVudHMuXG4gKlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdHMgY2xpY2tzIGhhcHBlbmluZyBvbiB0aGUgRE9NIGRvY3VtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gTW91c2VFdmVudCBvYmplY3QgbG9nZ2VkIHRvIGNvbnNvbGUgZXZlcnkgdGltZSBhIGNsaWNrXG4gKiAvLyBvY2N1cnMgb24gdGhlIGRvY3VtZW50LlxuICogYGBgXG4gKlxuICogIyMjIFVzZSBhZGRFdmVudExpc3RlbmVyIHdpdGggY2FwdHVyZSBvcHRpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrc0luRG9jdW1lbnQgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycsIHRydWUpOyAvLyBub3RlIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2lsbCBiZSBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lclxuICogY29uc3QgY2xpY2tzSW5EaXYgPSBmcm9tRXZlbnQoc29tZURpdkluRG9jdW1lbnQsICdjbGljaycpO1xuICpcbiAqIGNsaWNrc0luRG9jdW1lbnQuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdkb2N1bWVudCcpKTtcbiAqIGNsaWNrc0luRGl2LnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnZGl2JykpO1xuICpcbiAqIC8vIEJ5IGRlZmF1bHQgZXZlbnRzIGJ1YmJsZSBVUCBpbiBET00gdHJlZSwgc28gbm9ybWFsbHlcbiAqIC8vIHdoZW4gd2Ugd291bGQgY2xpY2sgb24gZGl2IGluIGRvY3VtZW50XG4gKiAvLyBcImRpdlwiIHdvdWxkIGJlIGxvZ2dlZCBmaXJzdCBhbmQgdGhlbiBcImRvY3VtZW50XCIuXG4gKiAvLyBTaW5jZSB3ZSBzcGVjaWZpZWQgb3B0aW9uYWwgYGNhcHR1cmVgIG9wdGlvbiwgZG9jdW1lbnRcbiAqIC8vIHdpbGwgY2F0Y2ggZXZlbnQgd2hlbiBpdCBnb2VzIERPV04gRE9NIHRyZWUsIHNvIGNvbnNvbGVcbiAqIC8vIHdpbGwgbG9nIFwiZG9jdW1lbnRcIiBhbmQgdGhlbiBcImRpdlwiLlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZENhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb21FdmVudFBhdHRlcm59XG4gKlxuICogQHBhcmFtIHtGcm9tRXZlbnRUYXJnZXQ8VD59IHRhcmdldCBUaGUgRE9NIEV2ZW50VGFyZ2V0LCBOb2RlLmpzXG4gKiBFdmVudEVtaXR0ZXIsIEpRdWVyeS1saWtlIGV2ZW50IHRhcmdldCwgTm9kZUxpc3Qgb3IgSFRNTENvbGxlY3Rpb24gdG8gYXR0YWNoIHRoZSBldmVudCBoYW5kbGVyIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnQgbmFtZSBvZiBpbnRlcmVzdCwgYmVpbmcgZW1pdHRlZCBieSB0aGVcbiAqIGB0YXJnZXRgLlxuICogQHBhcmFtIHtFdmVudExpc3RlbmVyT3B0aW9uc30gW29wdGlvbnNdIE9wdGlvbnMgdG8gcGFzcyB0aHJvdWdoIHRvIGFkZEV2ZW50TGlzdGVuZXJcbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59XG4gKiBAbmFtZSBmcm9tRXZlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPihcbiAgdGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sXG4gIGV2ZW50TmFtZTogc3RyaW5nLFxuICBvcHRpb25zPzogRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCAoKC4uLmFyZ3M6IGFueVtdKSA9PiBUKSxcbiAgcmVzdWx0U2VsZWN0b3I/OiAoKC4uLmFyZ3M6IGFueVtdKSA9PiBUKVxuKTogT2JzZXJ2YWJsZTxUPiB7XG5cbiAgaWYgKGlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZnJvbUV2ZW50PFQ+KHRhcmdldCwgZXZlbnROYW1lLCA8RXZlbnRMaXN0ZW5lck9wdGlvbnMgfCB1bmRlZmluZWQ+b3B0aW9ucykucGlwZShcbiAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgZnVuY3Rpb24gaGFuZGxlcihlOiBUKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZXR1cFN1YnNjcmlwdGlvbih0YXJnZXQsIGV2ZW50TmFtZSwgaGFuZGxlciwgc3Vic2NyaWJlciwgb3B0aW9ucyBhcyBFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cFN1YnNjcmlwdGlvbjxUPihzb3VyY2VPYmo6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogRXZlbnRMaXN0ZW5lck9wdGlvbnMpIHtcbiAgbGV0IHVuc3Vic2NyaWJlOiAoKSA9PiB2b2lkO1xuICBpZiAoaXNFdmVudFRhcmdldChzb3VyY2VPYmopKSB7XG4gICAgY29uc3Qgc291cmNlID0gc291cmNlT2JqO1xuICAgIHNvdXJjZU9iai5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiBzb3VyY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIoc291cmNlT2JqKSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZU9iajtcbiAgICBzb3VyY2VPYmoub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB1bnN1YnNjcmliZSA9ICgpID0+IHNvdXJjZS5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChpc05vZGVTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmopKSB7XG4gICAgY29uc3Qgc291cmNlID0gc291cmNlT2JqO1xuICAgIHNvdXJjZU9iai5hZGRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIgYXMgTm9kZUV2ZW50SGFuZGxlcik7XG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyIGFzIE5vZGVFdmVudEhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKHNvdXJjZU9iaiAmJiAoc291cmNlT2JqIGFzIGFueSkubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IChzb3VyY2VPYmogYXMgYW55KS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2V0dXBTdWJzY3JpcHRpb24oc291cmNlT2JqW2ldLCBldmVudE5hbWUsIGhhbmRsZXIsIHN1YnNjcmliZXIsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHRhcmdldCcpO1xuICB9XG5cbiAgc3Vic2NyaWJlci5hZGQodW5zdWJzY3JpYmUpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBOb2RlU3R5bGVFdmVudEVtaXR0ZXIge1xuICByZXR1cm4gc291cmNlT2JqICYmIHR5cGVvZiBzb3VyY2VPYmouYWRkTGlzdGVuZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNvdXJjZU9iai5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNKUXVlcnlTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBKUXVlcnlTdHlsZUV2ZW50RW1pdHRlciB7XG4gIHJldHVybiBzb3VyY2VPYmogJiYgdHlwZW9mIHNvdXJjZU9iai5vbiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc291cmNlT2JqLm9mZiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNFdmVudFRhcmdldChzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxhbnk+IHtcbiAgcmV0dXJuIHNvdXJjZU9iaiAmJiB0eXBlb2Ygc291cmNlT2JqLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNvdXJjZU9iai5yZW1vdmVFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gJy4vZnJvbUV2ZW50JztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LCByZW1vdmVIYW5kbGVyPzogKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpID0+IHZvaWQpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LCByZW1vdmVIYW5kbGVyPzogKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpID0+IHZvaWQsIHJlc3VsdFNlbGVjdG9yPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIGZyb20gYW4gQVBJIGJhc2VkIG9uIGFkZEhhbmRsZXIvcmVtb3ZlSGFuZGxlclxuICogZnVuY3Rpb25zLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db252ZXJ0cyBhbnkgYWRkSGFuZGxlci9yZW1vdmVIYW5kbGVyIEFQSSB0byBhblxuICogT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKGZyb21FdmVudFBhdHRlcm4ucG5nKVxuICpcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBieSB1c2luZyB0aGUgYGFkZEhhbmRsZXJgIGFuZCBgcmVtb3ZlSGFuZGxlcmBcbiAqIGZ1bmN0aW9ucyB0byBhZGQgYW5kIHJlbW92ZSB0aGUgaGFuZGxlcnMuIFRoZSBgYWRkSGFuZGxlcmAgaXNcbiAqIGNhbGxlZCB3aGVuIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLCBhbmQgYHJlbW92ZUhhbmRsZXJgIGlzXG4gKiBjYWxsZWQgd2hlbiB0aGUgU3Vic2NyaXB0aW9uIGlzIHVuc3Vic2NyaWJlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgRW1pdHMgY2xpY2tzIGhhcHBlbmluZyBvbiB0aGUgRE9NIGRvY3VtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBhZGRDbGlja0hhbmRsZXIoaGFuZGxlcikge1xuICogICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIHJlbW92ZUNsaWNrSGFuZGxlcihoYW5kbGVyKSB7XG4gKiAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gKiB9XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50UGF0dGVybihcbiAqICAgYWRkQ2xpY2tIYW5kbGVyLFxuICogICByZW1vdmVDbGlja0hhbmRsZXIsXG4gKiApO1xuICogY2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnR9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbik6IGFueX0gYWRkSGFuZGxlciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIGEgYGhhbmRsZXJgIGZ1bmN0aW9uIGFzIGFyZ3VtZW50IGFuZCBhdHRhY2hlcyBpdCBzb21laG93IHRvIHRoZSBhY3R1YWxcbiAqIHNvdXJjZSBvZiBldmVudHMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpOiB2b2lkfSBbcmVtb3ZlSGFuZGxlcl0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdGhhdFxuICogdGFrZXMgYSBgaGFuZGxlcmAgZnVuY3Rpb24gYXMgYXJndW1lbnQgYW5kIHJlbW92ZXMgaXQgaW4gY2FzZSBpdCB3YXNcbiAqIHByZXZpb3VzbHkgYXR0YWNoZWQgdXNpbmcgYGFkZEhhbmRsZXJgLiBpZiBhZGRIYW5kbGVyIHJldHVybnMgc2lnbmFsIHRvIHRlYXJkb3duIHdoZW4gcmVtb3ZlLFxuICogcmVtb3ZlSGFuZGxlciBmdW5jdGlvbiB3aWxsIGZvcndhcmQgaXQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fVxuICogQG5hbWUgZnJvbUV2ZW50UGF0dGVyblxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyOiAoaGFuZGxlcjogRnVuY3Rpb24pID0+IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUIHwgVFtdPiB7XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlciwgcmVtb3ZlSGFuZGxlcikucGlwZShcbiAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VCB8IFRbXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5lOiBUW10pID0+IHN1YnNjcmliZXIubmV4dChlLmxlbmd0aCA9PT0gMSA/IGVbMF0gOiBlKTtcblxuICAgIGxldCByZXRWYWx1ZTogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXRWYWx1ZSA9IGFkZEhhbmRsZXIoaGFuZGxlcik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICghaXNGdW5jdGlvbihyZW1vdmVIYW5kbGVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4gcmVtb3ZlSGFuZGxlcihoYW5kbGVyLCByZXRWYWx1ZSkgO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25GdW5jPFM+ID0gKHN0YXRlOiBTKSA9PiBib29sZWFuO1xuZXhwb3J0IHR5cGUgSXRlcmF0ZUZ1bmM8Uz4gPSAoc3RhdGU6IFMpID0+IFM7XG5leHBvcnQgdHlwZSBSZXN1bHRGdW5jPFMsIFQ+ID0gKHN0YXRlOiBTKSA9PiBUO1xuXG5pbnRlcmZhY2UgU2NoZWR1bGVyU3RhdGU8VCwgUz4ge1xuICBuZWVkSXRlcmF0ZT86IGJvb2xlYW47XG4gIHN0YXRlOiBTO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBjb25kaXRpb24/OiBDb25kaXRpb25GdW5jPFM+O1xuICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPjtcbiAgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVCYXNlT3B0aW9uczxTPiB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgaW5pdGlhbFN0YXRlOiBTO1xuICAvKipcbiAgICogQ29uZGl0aW9uIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBib29sZWFuLlxuICAgKiBXaGVuIGl0IHJldHVybnMgZmFsc2UsIHRoZSBnZW5lcmF0b3Igc3RvcHMuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIGEgZ2VuZXJhdG9yIG5ldmVyIHN0b3BzLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPjtcbiAgLyoqXG4gICAqIEl0ZXJhdGUgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHN0YXRlIGFuZCByZXR1cm5zIG5ldyBzdGF0ZS5cbiAgICovXG4gIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+O1xuICAvKipcbiAgICogU2NoZWR1bGVyTGlrZSB0byB1c2UgZm9yIGdlbmVyYXRpb24gcHJvY2Vzcy5cbiAgICogQnkgZGVmYXVsdCwgYSBnZW5lcmF0b3Igc3RhcnRzIGltbWVkaWF0ZWx5LlxuICAgKi9cbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZU9wdGlvbnM8VCwgUz4gZXh0ZW5kcyBHZW5lcmF0ZUJhc2VPcHRpb25zPFM+IHtcbiAgLyoqXG4gICAqIFJlc3VsdCBzZWxlY3Rpb24gZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHN0YXRlIGFuZCByZXR1cm5zIGEgdmFsdWUgdG8gZW1pdC5cbiAgICovXG4gIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoMCwgeCA9PiB4IDwgMTAsIHggPT4geCArIDEsIHggPT4geCk7XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNpbmcgYXNhcCBzY2hlZHVsZXIsIHByb2R1Y2VzIHNlcXVlbmNlIG9mIDIsIDMsIDUsIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKDEsIHggPT4geCA8IDUsIHggPT4gICogMiwgeCA9PiB4ICsgMSwgYXNhcCk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtTfSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogYm9vbGVhbn0gY29uZGl0aW9uIENvbmRpdGlvbiB0byB0ZXJtaW5hdGUgZ2VuZXJhdGlvbiAodXBvbiByZXR1cm5pbmcgZmFsc2UpLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBTfSBpdGVyYXRlIEl0ZXJhdGlvbiBzdGVwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBUfSByZXN1bHRTZWxlY3RvciBTZWxlY3RvciBmdW5jdGlvbiBmb3IgcmVzdWx0cyBwcm9kdWNlZCBpbiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IG9uIHdoaWNoIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3AuIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gZW1pdCBpbW1lZGlhdGVseS5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG4gIGV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxULCBTPihpbml0aWFsU3RhdGU6IFMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IENvbmRpdGlvbkZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wXG4gKiBwcm9kdWNpbmcgdGhlIHNlcXVlbmNlJ3MgZWxlbWVudHMsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyXG4gKiB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAqIFRoZSBvdmVybG9hZCB1c2VzIHN0YXRlIGFzIGFuIGVtaXR0ZWQgdmFsdWUuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoMCwgeCA9PiB4IDwgMTAsIHggPT4geCArIDEpO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzaW5nIGFzYXAgc2NoZWR1bGVyLCBwcm9kdWNlcyBzZXF1ZW5jZSBvZiAxLCAyLCA0LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSgxLCB4ID0+IHggPCA1LCB4ID0+IHggICogMiwgUnguU2NoZWR1bGVyLmFzYXApO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7U30gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogU30gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gb24gd2hpY2ggdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcC4gSWYgbm90IHByb3ZpZGVkLCBkZWZhdWx0cyB0byBlbWl0IGltbWVkaWF0ZWx5LlxuICogQHJldHVybnMge09ic2VydmFibGU8Uz59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxTPihpbml0aWFsU3RhdGU6IFMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFM+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKiBUaGUgb3ZlcmxvYWQgYWNjZXB0cyBvcHRpb25zIG9iamVjdCB0aGF0IG1pZ2h0IGNvbnRhaW4gaW5pdGlhbCBzdGF0ZSwgaXRlcmF0ZSxcbiAqIGNvbmRpdGlvbiBhbmQgc2NoZWR1bGVyLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBjb25kaXRpb246IHggPT4geCA8IDEwLFxuICogICBpdGVyYXRlOiB4ID0+IHggKyAxLFxuICogfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtHZW5lcmF0ZUJhc2VPcHRpb25zPFM+fSBvcHRpb25zIE9iamVjdCB0aGF0IG11c3QgY29udGFpbiBpbml0aWFsU3RhdGUsIGl0ZXJhdGUgYW5kIG1pZ2h0IGNvbnRhaW4gY29uZGl0aW9uIGFuZCBzY2hlZHVsZXIuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxTPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFM+KG9wdGlvbnM6IEdlbmVyYXRlQmFzZU9wdGlvbnM8Uz4pOiBPYnNlcnZhYmxlPFM+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKiBUaGUgb3ZlcmxvYWQgYWNjZXB0cyBvcHRpb25zIG9iamVjdCB0aGF0IG1pZ2h0IGNvbnRhaW4gaW5pdGlhbCBzdGF0ZSwgaXRlcmF0ZSxcbiAqIGNvbmRpdGlvbiwgcmVzdWx0IHNlbGVjdG9yIGFuZCBzY2hlZHVsZXIuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoe1xuICogICBpbml0aWFsU3RhdGU6IDAsXG4gKiAgIGNvbmRpdGlvbjogeCA9PiB4IDwgMTAsXG4gKiAgIGl0ZXJhdGU6IHggPT4geCArIDEsXG4gKiAgIHJlc3VsdFNlbGVjdG9yOiB4ID0+IHgsXG4gKiB9KTtcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge0dlbmVyYXRlT3B0aW9uczxULCBTPn0gb3B0aW9ucyBPYmplY3QgdGhhdCBtdXN0IGNvbnRhaW4gaW5pdGlhbFN0YXRlLCBpdGVyYXRlLCByZXN1bHRTZWxlY3RvciBhbmQgbWlnaHQgY29udGFpbiBjb25kaXRpb24gYW5kIHNjaGVkdWxlci5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8VCwgUz4ob3B0aW9uczogR2VuZXJhdGVPcHRpb25zPFQsIFM+KTogT2JzZXJ2YWJsZTxUPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFQsIFM+KGluaXRpYWxTdGF0ZU9yT3B0aW9uczogUyB8IEdlbmVyYXRlT3B0aW9uczxULCBTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24/OiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGU/OiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZT86IChSZXN1bHRGdW5jPFMsIFQ+KSB8IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD4ge1xuXG4gIGxldCByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPjtcbiAgbGV0IGluaXRpYWxTdGF0ZTogUztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBHZW5lcmF0ZU9wdGlvbnM8VCwgUz47XG4gICAgaW5pdGlhbFN0YXRlID0gb3B0aW9ucy5pbml0aWFsU3RhdGU7XG4gICAgY29uZGl0aW9uID0gb3B0aW9ucy5jb25kaXRpb247XG4gICAgaXRlcmF0ZSA9IG9wdGlvbnMuaXRlcmF0ZTtcbiAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnMucmVzdWx0U2VsZWN0b3IgfHwgaWRlbnRpdHkgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgICBzY2hlZHVsZXIgPSBvcHRpb25zLnNjaGVkdWxlcjtcbiAgfSBlbHNlIGlmIChyZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSA9PT0gdW5kZWZpbmVkIHx8IGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlKSkge1xuICAgIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBTO1xuICAgIHJlc3VsdFNlbGVjdG9yID0gaWRlbnRpdHkgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSBhcyBTY2hlZHVsZXJMaWtlO1xuICB9IGVsc2Uge1xuICAgIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBTO1xuICAgIHJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxTY2hlZHVsZXJTdGF0ZTxULCBTPj4oZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgc3Vic2NyaWJlcixcbiAgICAgICAgaXRlcmF0ZSxcbiAgICAgICAgY29uZGl0aW9uLFxuICAgICAgICByZXN1bHRTZWxlY3RvcixcbiAgICAgICAgc3RhdGVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvIHtcbiAgICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgbGV0IGNvbmRpdGlvblJlc3VsdDogYm9vbGVhbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25kaXRpb25SZXN1bHQgPSBjb25kaXRpb24oc3RhdGUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbmRpdGlvblJlc3VsdCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHZhbHVlOiBUO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSByZXN1bHRTZWxlY3RvcihzdGF0ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXRlID0gaXRlcmF0ZShzdGF0ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRydWUpO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQsIFM+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxTY2hlZHVsZXJTdGF0ZTxULCBTPj4sIHN0YXRlOiBTY2hlZHVsZXJTdGF0ZTxULCBTPikge1xuICBjb25zdCB7IHN1YnNjcmliZXIsIGNvbmRpdGlvbiB9ID0gc3RhdGU7XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHN0YXRlLm5lZWRJdGVyYXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN0YXRlLnN0YXRlID0gc3RhdGUuaXRlcmF0ZShzdGF0ZS5zdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5uZWVkSXRlcmF0ZSA9IHRydWU7XG4gIH1cbiAgaWYgKGNvbmRpdGlvbikge1xuICAgIGxldCBjb25kaXRpb25SZXN1bHQ6IGJvb2xlYW47XG4gICAgdHJ5IHtcbiAgICAgIGNvbmRpdGlvblJlc3VsdCA9IGNvbmRpdGlvbihzdGF0ZS5zdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvblJlc3VsdCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBsZXQgdmFsdWU6IFQ7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBzdGF0ZS5yZXN1bHRTZWxlY3RvcihzdGF0ZS5zdGF0ZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4vZGVmZXInO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IFN1YnNjcmliYWJsZU9yUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBEZWNpZGVzIGF0IHN1YnNjcmlwdGlvbiB0aW1lIHdoaWNoIE9ic2VydmFibGUgd2lsbCBhY3R1YWxseSBiZSBzdWJzY3JpYmVkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5gSWZgIHN0YXRlbWVudCBmb3IgT2JzZXJ2YWJsZXMuPC9zcGFuPlxuICpcbiAqIGBpaWZgIGFjY2VwdHMgYSBjb25kaXRpb24gZnVuY3Rpb24gYW5kIHR3byBPYnNlcnZhYmxlcy4gV2hlblxuICogYW4gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSB0aGUgb3BlcmF0b3IgaXMgc3Vic2NyaWJlZCwgY29uZGl0aW9uIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkLlxuICogQmFzZWQgb24gd2hhdCBib29sZWFuIGl0IHJldHVybnMgYXQgdGhhdCBtb21lbnQsIGNvbnN1bWVyIHdpbGwgc3Vic2NyaWJlIGVpdGhlciB0b1xuICogdGhlIGZpcnN0IE9ic2VydmFibGUgKGlmIGNvbmRpdGlvbiB3YXMgdHJ1ZSkgb3IgdG8gdGhlIHNlY29uZCAoaWYgY29uZGl0aW9uIHdhcyBmYWxzZSkuIENvbmRpdGlvblxuICogZnVuY3Rpb24gbWF5IGFsc28gbm90IHJldHVybiBhbnl0aGluZyAtIGluIHRoYXQgY2FzZSBjb25kaXRpb24gd2lsbCBiZSBldmFsdWF0ZWQgYXMgZmFsc2UgYW5kXG4gKiBzZWNvbmQgT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQuXG4gKlxuICogTm90ZSB0aGF0IE9ic2VydmFibGVzIGZvciBib3RoIGNhc2VzICh0cnVlIGFuZCBmYWxzZSkgYXJlIG9wdGlvbmFsLiBJZiBjb25kaXRpb24gcG9pbnRzIHRvIGFuIE9ic2VydmFibGUgdGhhdFxuICogd2FzIGxlZnQgdW5kZWZpbmVkLCByZXN1bHRpbmcgc3RyZWFtIHdpbGwgc2ltcGx5IGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBUaGF0IGFsbG93cyB5b3UgdG8sIHJhdGhlclxuICogdGhlbiBjb250cm9sbGluZyB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZCwgZGVjaWRlIGF0IHJ1bnRpbWUgaWYgY29uc3VtZXIgc2hvdWxkIGhhdmUgYWNjZXNzXG4gKiB0byBnaXZlbiBPYnNlcnZhYmxlIG9yIG5vdC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBtb3JlIGNvbXBsZXggbG9naWMgdGhhdCByZXF1aXJlcyBkZWNpc2lvbiBiZXR3ZWVuIG1vcmUgdGhhbiB0d28gT2JzZXJ2YWJsZXMsIHtAbGluayBkZWZlcn1cbiAqIHdpbGwgcHJvYmFibHkgYmUgYSBiZXR0ZXIgY2hvaWNlLiBBY3R1YWxseSBgaWlmYCBjYW4gYmUgZWFzaWx5IGltcGxlbWVudGVkIHdpdGgge0BsaW5rIGRlZmVyfVxuICogYW5kIGV4aXN0cyBvbmx5IGZvciBjb252ZW5pZW5jZSBhbmQgcmVhZGFiaWxpdHkgcmVhc29ucy5cbiAqXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDaGFuZ2UgYXQgcnVudGltZSB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZFxuICogYGBgamF2YXNjcmlwdFxuICogbGV0IHN1YnNjcmliZVRvRmlyc3Q7XG4gKiBjb25zdCBmaXJzdE9yU2Vjb25kID0gaWlmKFxuICogICAoKSA9PiBzdWJzY3JpYmVUb0ZpcnN0LFxuICogICBvZignZmlyc3QnKSxcbiAqICAgb2YoJ3NlY29uZCcpLFxuICogKTtcbiAqXG4gKiBzdWJzY3JpYmVUb0ZpcnN0ID0gdHJ1ZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiZmlyc3RcIlxuICpcbiAqIHN1YnNjcmliZVRvRmlyc3QgPSBmYWxzZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwic2Vjb25kXCJcbiAqXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29udHJvbCBhbiBhY2Nlc3MgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogbGV0IGFjY2Vzc0dyYW50ZWQ7XG4gKiBjb25zdCBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzID0gaWlmKFxuICogICAoKSA9PiBhY2Nlc3NHcmFudGVkLFxuICogICBvZignSXQgc2VlbXMgeW91IGhhdmUgYW4gYWNjZXNzLi4uJyksIC8vIE5vdGUgdGhhdCBvbmx5IG9uZSBPYnNlcnZhYmxlIGlzIHBhc3NlZCB0byB0aGUgb3BlcmF0b3IuXG4gKiApO1xuICpcbiAqIGFjY2Vzc0dyYW50ZWQgPSB0cnVlO1xuICogb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2Vzcy5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhlIGVuZCcpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJJdCBzZWVtcyB5b3UgaGF2ZSBhbiBhY2Nlc3MuLi5cIlxuICogLy8gXCJUaGUgZW5kXCJcbiAqXG4gKiBhY2Nlc3NHcmFudGVkID0gZmFsc2U7XG4gKiBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGUgZW5kJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIlRoZSBlbmRcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVmZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHdoaWNoIE9ic2VydmFibGUgc2hvdWxkIGJlIGNob3Nlbi5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW3RydWVPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyB0cnVlLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbZmFsc2VPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyBmYWxzZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEVpdGhlciBmaXJzdCBvciBzZWNvbmQgT2JzZXJ2YWJsZSwgZGVwZW5kaW5nIG9uIGNvbmRpdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaWlmXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWlmPFQsIEY+KFxuICBjb25kaXRpb246ICgpID0+IGJvb2xlYW4sXG4gIHRydWVSZXN1bHQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiA9IEVNUFRZLFxuICBmYWxzZVJlc3VsdDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPEY+ID0gRU1QVFlcbik6IE9ic2VydmFibGU8VHxGPiB7XG4gIHJldHVybiBkZWZlcjxUfEY+KCgpID0+IGNvbmRpdGlvbigpID8gdHJ1ZVJlc3VsdCA6IGZhbHNlUmVzdWx0KTtcbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzQXJyYXknO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljKHZhbDogYW55KTogdmFsIGlzIG51bWJlciB7XG4gIC8vIHBhcnNlRmxvYXQgTmFOcyBudW1lcmljLWNhc3QgZmFsc2UgcG9zaXRpdmVzIChudWxsfHRydWV8ZmFsc2V8XCJcIilcbiAgLy8gLi4uYnV0IG1pc2ludGVycHJldHMgbGVhZGluZy1udW1iZXIgc3RyaW5ncywgcGFydGljdWxhcmx5IGhleCBsaXRlcmFscyAoXCIweC4uLlwiKVxuICAvLyBzdWJ0cmFjdGlvbiBmb3JjZXMgaW5maW5pdGllcyB0byBOYU5cbiAgLy8gYWRkaW5nIDEgY29ycmVjdHMgbG9zcyBvZiBwcmVjaXNpb24gZnJvbSBwYXJzZUZsb2F0ICgjMTUxMDApXG4gIHJldHVybiAhaXNBcnJheSh2YWwpICYmICh2YWwgLSBwYXJzZUZsb2F0KHZhbCkgKyAxKSA+PSAwO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHNlcXVlbnRpYWwgbnVtYmVycyBldmVyeSBzcGVjaWZpZWRcbiAqIGludGVydmFsIG9mIHRpbWUsIG9uIGEgc3BlY2lmaWVkIHtAbGluayBTY2hlZHVsZXJMaWtlfS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgaW5jcmVtZW50YWwgbnVtYmVycyBwZXJpb2RpY2FsbHkgaW4gdGltZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10oaW50ZXJ2YWwucG5nKVxuICpcbiAqIGBpbnRlcnZhbGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2ZcbiAqIGFzY2VuZGluZyBpbnRlZ2Vycywgd2l0aCBhIGNvbnN0YW50IGludGVydmFsIG9mIHRpbWUgb2YgeW91ciBjaG9vc2luZ1xuICogYmV0d2VlbiB0aG9zZSBlbWlzc2lvbnMuIFRoZSBmaXJzdCBlbWlzc2lvbiBpcyBub3Qgc2VudCBpbW1lZGlhdGVseSwgYnV0XG4gKiBvbmx5IGFmdGVyIHRoZSBmaXJzdCBwZXJpb2QgaGFzIHBhc3NlZC4gQnkgZGVmYXVsdCwgdGhpcyBvcGVyYXRvciB1c2VzIHRoZVxuICogYGFzeW5jYCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcHJvdmlkZSBhIG5vdGlvbiBvZiB0aW1lLCBidXQgeW91IG1heSBwYXNzIGFueVxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIGl0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXRzIGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kICgxMDAwbXMpXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHRpbWVyfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtwZXJpb2Q9MF0gVGhlIGludGVydmFsIHNpemUgaW4gbWlsbGlzZWNvbmRzIChieSBkZWZhdWx0KVxuICogb3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGJ5IHRoZSBzY2hlZHVsZXIncyBjbG9jay5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMsIGFuZCBwcm92aWRpbmcgYSBub3Rpb24gb2YgXCJ0aW1lXCIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW50aWFsIG51bWJlciBlYWNoIHRpbWVcbiAqIGludGVydmFsLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBpbnRlcnZhbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVydmFsKHBlcmlvZCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICBpZiAoIWlzTnVtZXJpYyhwZXJpb2QpIHx8IHBlcmlvZCA8IDApIHtcbiAgICBwZXJpb2QgPSAwO1xuICB9XG5cbiAgaWYgKCFzY2hlZHVsZXIgfHwgdHlwZW9mIHNjaGVkdWxlci5zY2hlZHVsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHNjaGVkdWxlciA9IGFzeW5jO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgc3Vic2NyaWJlci5hZGQoXG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIHBlcmlvZCwgeyBzdWJzY3JpYmVyLCBjb3VudGVyOiAwLCBwZXJpb2QgfSlcbiAgICApO1xuICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPEludGVydmFsU3RhdGU+LCBzdGF0ZTogSW50ZXJ2YWxTdGF0ZSkge1xuICBjb25zdCB7IHN1YnNjcmliZXIsIGNvdW50ZXIsIHBlcmlvZCB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubmV4dChjb3VudGVyKTtcbiAgdGhpcy5zY2hlZHVsZSh7IHN1YnNjcmliZXIsIGNvdW50ZXI6IGNvdW50ZXIgKyAxLCBwZXJpb2QgfSwgcGVyaW9kKTtcbn1cblxuaW50ZXJmYWNlIEludGVydmFsU3RhdGUge1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG4gIGNvdW50ZXI6IG51bWJlcjtcbiAgcGVyaW9kOiBudW1iZXI7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9tZXJnZUFsbCc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDM+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2PiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDY+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZSB8IG51bWJlcilbXSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2UgfCBudW1iZXIpW10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKlxuICogQ3JlYXRlcyBhbiBvdXRwdXQgT2JzZXJ2YWJsZSB3aGljaCBjb25jdXJyZW50bHkgZW1pdHMgYWxsIHZhbHVlcyBmcm9tIGV2ZXJ5XG4gKiBnaXZlbiBpbnB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5GbGF0dGVucyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0b2dldGhlciBieSBibGVuZGluZ1xuICogdGhlaXIgdmFsdWVzIGludG8gb25lIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXShtZXJnZS5wbmcpXG4gKlxuICogYG1lcmdlYCBzdWJzY3JpYmVzIHRvIGVhY2ggZ2l2ZW4gaW5wdXQgT2JzZXJ2YWJsZSAoYXMgYXJndW1lbnRzKSwgYW5kIHNpbXBseVxuICogZm9yd2FyZHMgKHdpdGhvdXQgZG9pbmcgYW55IHRyYW5zZm9ybWF0aW9uKSBhbGwgdGhlIHZhbHVlcyBmcm9tIGFsbCB0aGUgaW5wdXRcbiAqIE9ic2VydmFibGVzIHRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlIG9ubHkgY29tcGxldGVzXG4gKiBvbmNlIGFsbCBpbnB1dCBPYnNlcnZhYmxlcyBoYXZlIGNvbXBsZXRlZC4gQW55IGVycm9yIGRlbGl2ZXJlZCBieSBhbiBpbnB1dFxuICogT2JzZXJ2YWJsZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgTWVyZ2UgdG9nZXRoZXIgdHdvIE9ic2VydmFibGVzOiAxcyBpbnRlcnZhbCBhbmQgY2xpY2tzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGNsaWNrc09yVGltZXIgPSBtZXJnZShjbGlja3MsIHRpbWVyKTtcbiAqIGNsaWNrc09yVGltZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIHRpbWVyIHdpbGwgZW1pdCBhc2NlbmRpbmcgdmFsdWVzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykgdG8gY29uc29sZVxuICogLy8gY2xpY2tzIGxvZ3MgTW91c2VFdmVudHMgdG8gY29uc29sZSBldmVyeXRpbWUgdGhlIFwiZG9jdW1lbnRcIiBpcyBjbGlja2VkXG4gKiAvLyBTaW5jZSB0aGUgdHdvIHN0cmVhbXMgYXJlIG1lcmdlZCB5b3Ugc2VlIHRoZXNlIGhhcHBlbmluZ1xuICogLy8gYXMgdGhleSBvY2N1ci5cbiAqIGBgYFxuICpcbiAqICMjIyBNZXJnZSB0b2dldGhlciAzIE9ic2VydmFibGVzLCBidXQgb25seSAyIHJ1biBjb25jdXJyZW50bHlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyMSA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgdGltZXIyID0gaW50ZXJ2YWwoMjAwMCkucGlwZSh0YWtlKDYpKTtcbiAqIGNvbnN0IHRpbWVyMyA9IGludGVydmFsKDUwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCBjb25jdXJyZW50ID0gMjsgLy8gdGhlIGFyZ3VtZW50XG4gKiBjb25zdCBtZXJnZWQgPSBtZXJnZSh0aW1lcjEsIHRpbWVyMiwgdGltZXIzLCBjb25jdXJyZW50KTtcbiAqIG1lcmdlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gLSBGaXJzdCB0aW1lcjEgYW5kIHRpbWVyMiB3aWxsIHJ1biBjb25jdXJyZW50bHlcbiAqIC8vIC0gdGltZXIxIHdpbGwgZW1pdCBhIHZhbHVlIGV2ZXJ5IDEwMDBtcyBmb3IgMTAgaXRlcmF0aW9uc1xuICogLy8gLSB0aW1lcjIgd2lsbCBlbWl0IGEgdmFsdWUgZXZlcnkgMjAwMG1zIGZvciA2IGl0ZXJhdGlvbnNcbiAqIC8vIC0gYWZ0ZXIgdGltZXIxIGhpdHMgaXQncyBtYXggaXRlcmF0aW9uLCB0aW1lcjIgd2lsbFxuICogLy8gICBjb250aW51ZSwgYW5kIHRpbWVyMyB3aWxsIHN0YXJ0IHRvIHJ1biBjb25jdXJyZW50bHkgd2l0aCB0aW1lcjJcbiAqIC8vIC0gd2hlbiB0aW1lcjIgaGl0cyBpdCdzIG1heCBpdGVyYXRpb24gaXQgdGVybWluYXRlcywgYW5kXG4gKiAvLyAgIHRpbWVyMyB3aWxsIGNvbnRpbnVlIHRvIGVtaXQgYSB2YWx1ZSBldmVyeSA1MDBtcyB1bnRpbCBpdCBpcyBjb21wbGV0ZVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWVyZ2VBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwVG99XG4gKiBAc2VlIHtAbGluayBtZXJnZVNjYW59XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGVzIElucHV0IE9ic2VydmFibGVzIHRvIG1lcmdlIHRvZ2V0aGVyLlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2YgaW5wdXRcbiAqIE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPW51bGxdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBtYW5hZ2luZ1xuICogY29uY3VycmVuY3kgb2YgaW5wdXQgT2JzZXJ2YWJsZXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgdGhhdCBhcmUgdGhlIHJlc3VsdCBvZlxuICogZXZlcnkgaW5wdXQgT2JzZXJ2YWJsZS5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgbWVyZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlIHwgbnVtYmVyPik6IE9ic2VydmFibGU8Uj4ge1xuIGxldCBjb25jdXJyZW50ID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuIGxldCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBudWxsO1xuICBsZXQgbGFzdDogYW55ID0gb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV07XG4gIGlmIChpc1NjaGVkdWxlcihsYXN0KSkge1xuICAgIHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPm9ic2VydmFibGVzLnBvcCgpO1xuICAgIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPiAxICYmIHR5cGVvZiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbmN1cnJlbnQgPSA8bnVtYmVyPm9ic2VydmFibGVzLnBvcCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgbGFzdCA9PT0gJ251bWJlcicpIHtcbiAgICBjb25jdXJyZW50ID0gPG51bWJlcj5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuXG4gIGlmIChzY2hlZHVsZXIgPT09IG51bGwgJiYgb2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxICYmIG9ic2VydmFibGVzWzBdIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxSPj5vYnNlcnZhYmxlc1swXTtcbiAgfVxuXG4gIHJldHVybiBtZXJnZUFsbDxSPihjb25jdXJyZW50KShmcm9tQXJyYXk8YW55PihvYnNlcnZhYmxlcywgc2NoZWR1bGVyKSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcblxuLyoqXG4gKiBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBuZXZlciBjb21wbGV0ZXMuXG4gKlxuICogIVtdKG5ldmVyLnBuZylcbiAqXG4gKiBBIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbmVpdGhlciB2YWx1ZXMgbm9yIGVycm9ycyBub3IgdGhlIGNvbXBsZXRpb25cbiAqIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb3IgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcy4gUGxlYXNlIG5vdGUgdGhhdCBieSBuZXZlciBlbWl0dGluZyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbiwgdGhpc1xuICogT2JzZXJ2YWJsZSBrZWVwcyB0aGUgc3Vic2NyaXB0aW9uIGZyb20gYmVpbmcgZGlzcG9zZWQgYXV0b21hdGljYWxseS5cbiAqIFN1YnNjcmlwdGlvbnMgbmVlZCB0byBiZSBtYW51YWxseSBkaXNwb3NlZC5cbiAqXG4gKiAjIyAgRXhhbXBsZVxuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIG5ldmVyIGVtaXQgYW55dGhpbmcgZWxzZSAobm90IGV2ZW4gY29tcGxldGUpXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBpbmZvKCkge1xuICogICBjb25zb2xlLmxvZygnV2lsbCBub3QgYmUgY2FsbGVkJyk7XG4gKiB9XG4gKiBjb25zdCByZXN1bHQgPSBORVZFUi5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGluZm8sIGluZm8pO1xuICpcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBpbmRleC9FTVBUWX1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICogQHNlZSB7QGxpbmsgdGhyb3dFcnJvcn1cbiAqL1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KG5vb3ApO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgdXNpbmcgTkVWRVIgY29uc3RhbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXZlciAoKSB7XG4gIHJldHVybiBORVZFUjtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPih2OiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogV2hlbiBhbnkgb2YgdGhlIHByb3ZpZGVkIE9ic2VydmFibGUgZW1pdHMgYW4gY29tcGxldGUgb3IgZXJyb3Igbm90aWZpY2F0aW9uLCBpdCBpbW1lZGlhdGVseSBzdWJzY3JpYmVzIHRvIHRoZSBuZXh0IG9uZVxuICogdGhhdCB3YXMgcGFzc2VkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FeGVjdXRlIHNlcmllcyBvZiBPYnNlcnZhYmxlcyBubyBtYXR0ZXIgd2hhdCwgZXZlbiBpZiBpdCBtZWFucyBzd2FsbG93aW5nIGVycm9ycy48L3NwYW4+XG4gKlxuICogIVtdKG9uRXJyb3JSZXN1bWVOZXh0LnBuZylcbiAqXG4gKiBgb25FcnJvclJlc3VtZU5leHRgIFdpbGwgc3Vic2NyaWJlIHRvIGVhY2ggb2JzZXJ2YWJsZSBzb3VyY2UgaXQgaXMgcHJvdmlkZWQsIGluIG9yZGVyLlxuICogSWYgdGhlIHNvdXJjZSBpdCdzIHN1YnNjcmliZWQgdG8gZW1pdHMgYW4gZXJyb3Igb3IgY29tcGxldGVzLCBpdCB3aWxsIG1vdmUgdG8gdGhlIG5leHQgc291cmNlXG4gKiB3aXRob3V0IGVycm9yLlxuICpcbiAqIElmIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgcHJvdmlkZWQgbm8gYXJndW1lbnRzLCBvciBhIHNpbmdsZSwgZW1wdHkgYXJyYXksIGl0IHdpbGwgcmV0dXJuIHtAbGluayBpbmRleC9FTVBUWX0uXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBpcyBiYXNpY2FsbHkge0BsaW5rIGNvbmNhdH0sIG9ubHkgaXQgd2lsbCBjb250aW51ZSwgZXZlbiBpZiBvbmUgb2YgaXRzXG4gKiBzb3VyY2VzIGVtaXRzIGFuIGVycm9yLlxuICpcbiAqIE5vdGUgdGhhdCB0aGVyZSBpcyBubyB3YXkgdG8gaGFuZGxlIGFueSBlcnJvcnMgdGhyb3duIGJ5IHNvdXJjZXMgdmlhIHRoZSByZXN1dWx0IG9mXG4gKiBgb25FcnJvclJlc3VtZU5leHRgLiBJZiB5b3Ugd2FudCB0byBoYW5kbGUgZXJyb3JzIHRocm93biBpbiBhbnkgZ2l2ZW4gc291cmNlLCB5b3UgY2FuXG4gKiBhbHdheXMgdXNlIHRoZSB7QGxpbmsgY2F0Y2hFcnJvcn0gb3BlcmF0b3Igb24gdGhlbSBiZWZvcmUgcGFzc2luZyB0aGVtIGludG8gYG9uRXJyb3JSZXN1bWVOZXh0YC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdWJzY3JpYmUgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSBhZnRlciBtYXAgZmFpbHM8L2NhcHRpb24+XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvbkVycm9yUmVzdW1lTmV4dCwgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvbkVycm9yUmVzdW1lTmV4dChcbiAqICBvZigxLCAyLCAzLCAwKS5waXBlKFxuICogICAgbWFwKHggPT4ge1xuICogICAgICBpZiAoeCA9PT0gMCkgdGhyb3cgRXJyb3IoKTtcbiAqICAgICAgcmV0dXJuIDEwIC8geDtcbiAqICAgIH0pXG4gKiAgKSxcbiAqICBvZigxLCAyLCAzKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbCA9PiBjb25zb2xlLmxvZyh2YWwpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgICAgICAgLy8gV2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdkb25lJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAxMFxuICogLy8gNVxuICogLy8gMy4zMzMzMzMzMzMzMzMzMzM1XG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyAzXG4gKiAvLyBcImRvbmVcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0fVxuICogQHNlZSB7QGxpbmsgY2F0Y2hFcnJvcn1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gc291cmNlcyBPYnNlcnZhYmxlcyAob3IgYW55dGhpbmcgdGhhdCAqaXMqIG9ic2VydmFibGUpIHBhc3NlZCBlaXRoZXIgZGlyZWN0bHkgb3IgYXMgYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgY29uY2F0ZW5hdGVzIGFsbCBzb3VyY2VzLCBvbmUgYWZ0ZXIgdGhlIG90aGVyLFxuICogaWdub3JpbmcgYWxsIGVycm9ycywgc3VjaCB0aGF0IGFueSBlcnJvciBjYXVzZXMgaXQgdG8gbW92ZSBvbiB0byB0aGUgbmV4dCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPiguLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+IHtcblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBjb25zdCBbIGZpcnN0LCAuLi5yZW1haW5kZXIgXSA9IHNvdXJjZXM7XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoZmlyc3QpKSB7XG4gICAgcmV0dXJuIG9uRXJyb3JSZXN1bWVOZXh0KC4uLmZpcnN0KTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBzdWJOZXh0ID0gKCkgPT4gc3Vic2NyaWJlci5hZGQoXG4gICAgICBvbkVycm9yUmVzdW1lTmV4dCguLi5yZW1haW5kZXIpLnN1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICk7XG5cbiAgICByZXR1cm4gZnJvbShmaXJzdCkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQodmFsdWUpIHsgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSxcbiAgICAgIGVycm9yOiBzdWJOZXh0LFxuICAgICAgY29tcGxldGU6IHN1Yk5leHQsXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2Ugb2YgW2tleSwgdmFsdWVdIHBhaXJzXG4gKiB1c2luZyBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gZW51bWVyYXRlIHRoZSBvYmplY3QuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29udmVydHMgYSBqYXZhc2NyaXB0IG9iamVjdCB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYmogPSB7XG4gKiAgIGZvbzogNDIsXG4gKiAgIGJhcjogNTYsXG4gKiAgIGJhejogNzgsXG4gKiB9O1xuICpcbiAqIGNvbnN0IHNvdXJjZSA9IHBhaXJzKG9iaik7XG4gKlxuICogY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShcbiAqICAgeCA9PiBjb25zb2xlLmxvZygnTmV4dDogJXMnLCB4KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdFcnJvcjogJXMnLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnQ29tcGxldGVkJyksXG4gKiApO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGluc3BlY3QgYW5kIHR1cm4gaW50byBhblxuICogT2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHJ1biB0aGVcbiAqIGVudW1lcmF0aW9uIG9mIHRoZSBpbnB1dCBzZXF1ZW5jZSBvbi5cbiAqIEByZXR1cm5zIHsoT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4pfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mXG4gKiBba2V5LCB2YWx1ZV0gcGFpcnMgZnJvbSB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFpcnM8VD4ob2JqOiBPYmplY3QsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoW2tleSwgb2JqW2tleV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgIHNjaGVkdWxlci5zY2hlZHVsZTx7IGtleXM6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFtzdHJpbmcsIFRdPiwgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24sIG9iajogT2JqZWN0IH0+XG4gICAgICAgICAgKGRpc3BhdGNoLCAwLCB7IGtleXMsIGluZGV4OiAwLCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9KSk7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogeyBrZXlzOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbc3RyaW5nLCBUXT4sIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uLCBvYmo6IE9iamVjdCB9KSB7XG4gIGNvbnN0IHsga2V5cywgaW5kZXgsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0gPSBzdGF0ZTtcbiAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIGlmIChpbmRleCA8IGtleXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIHN1YnNjcmliZXIubmV4dChba2V5LCBvYmpba2V5XV0pO1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZCh0aGlzLnNjaGVkdWxlKHsga2V5cywgaW5kZXg6IGluZGV4ICsgMSwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgZmlyc3Qgc291cmNlIE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBTdWJzY3JpYmVzIHRvIHRoZSBvYnNlcnZhYmxlIHRoYXQgd2FzIHRoZSBmaXJzdCB0byBzdGFydCBlbWl0dGluZy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYnMxID0gaW50ZXJ2YWwoMTAwMCkucGlwZShtYXBUbygnZmFzdCBvbmUnKSk7XG4gKiBjb25zdCBvYnMyID0gaW50ZXJ2YWwoMzAwMCkucGlwZShtYXBUbygnbWVkaXVtIG9uZScpKTtcbiAqIGNvbnN0IG9iczMgPSBpbnRlcnZhbCg1MDAwKS5waXBlKG1hcFRvKCdzbG93IG9uZScpKTtcbiAqXG4gKiByYWNlKG9iczMsIG9iczEsIG9iczIpXG4gKiAuc3Vic2NyaWJlKFxuICogICB3aW5uZXIgPT4gY29uc29sZS5sb2cod2lubmVyKVxuICogKTtcbiAqXG4gKiAvLyByZXN1bHQ6XG4gKiAvLyBhIHNlcmllcyBvZiAnZmFzdCBvbmUnXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVzfSAuLi5vYnNlcnZhYmxlcyBzb3VyY2VzIHVzZWQgdG8gcmFjZSBmb3Igd2hpY2ggT2JzZXJ2YWJsZSBlbWl0cyBmaXJzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBvdXRwdXQgb2YgdGhlIGZpcnN0IE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSByYWNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPihvYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4ob2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8YW55Pj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4gfCBBcnJheTxPYnNlcnZhYmxlPFQ+Pj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8YW55PiB8IEFycmF5PE9ic2VydmFibGU8YW55Pj4+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIC8vIGlmIHRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIGFycmF5LCBpdCB3YXMgbW9zdCBsaWtlbHkgY2FsbGVkIHdpdGhcbiAgLy8gYHJhY2UoW29iczEsIG9iczIsIC4uLl0pYFxuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKGlzQXJyYXkob2JzZXJ2YWJsZXNbMF0pKSB7XG4gICAgICBvYnNlcnZhYmxlcyA9IDxBcnJheTxPYnNlcnZhYmxlPGFueT4+Pm9ic2VydmFibGVzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPE9ic2VydmFibGU8YW55Pj5vYnNlcnZhYmxlc1swXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCB1bmRlZmluZWQpLmxpZnQobmV3IFJhY2VPcGVyYXRvcjxUPigpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJhY2VPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBSYWNlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBSYWNlU3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgaGFzRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KG9ic2VydmFibGU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXRoaXMuaGFzRmlyc3Q7IGkrKykge1xuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IG9ic2VydmFibGVzW2ldO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSBhcyBhbnksIGkpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNGaXJzdCkge1xuICAgICAgdGhpcy5oYXNGaXJzdCA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpICE9PSBvdXRlckluZGV4KSB7XG4gICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaXB0aW9uc1tpXTtcblxuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbmNlIG9mIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkXG4gKiByYW5nZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIGluIGEgcmFuZ2UuPC9zcGFuPlxuICpcbiAqICFbXShyYW5nZS5wbmcpXG4gKlxuICogYHJhbmdlYCBvcGVyYXRvciBlbWl0cyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdlcnMsIGluIG9yZGVyLCB3aGVyZSB5b3VcbiAqIHNlbGVjdCB0aGUgYHN0YXJ0YCBvZiB0aGUgcmFuZ2UgYW5kIGl0cyBgbGVuZ3RoYC4gQnkgZGVmYXVsdCwgdXNlcyBub1xuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb25zIHN5bmNocm9ub3VzbHksIGJ1dCBtYXkgdXNlXG4gKiBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcmVndWxhdGUgdGhvc2UgZGVsaXZlcmllcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyB0aGUgbnVtYmVycyAxIHRvIDEwPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHJhbmdlKDEsIDEwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnRlZ2VyIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY291bnQ9MF0gVGhlIG51bWJlciBvZiBzZXF1ZW50aWFsIGludGVnZXJzIHRvIGdlbmVyYXRlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbnMgb2YgdGhlIG5vdGlmaWNhdGlvbnMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIG51bWJlcnMgdGhhdCBlbWl0cyBhIGZpbml0ZSByYW5nZSBvZlxuICogc2VxdWVudGlhbCBpbnRlZ2Vycy5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFuZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudCA9IHN0YXJ0O1xuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwge1xuICAgICAgICBpbmRleCwgY291bnQsIHN0YXJ0LCBzdWJzY3JpYmVyXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoaW5kZXgrKyA+PSBjb3VudCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoY3VycmVudCsrKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sIHN0YXRlOiBhbnkpIHtcbiAgY29uc3QgeyBzdGFydCwgaW5kZXgsIGNvdW50LCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcblxuICBpZiAoaW5kZXggPj0gY291bnQpIHtcbiAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3Vic2NyaWJlci5uZXh0KHN0YXJ0KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgc3RhdGUuc3RhcnQgPSBzdGFydCArIDE7XG5cbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IHN0YXJ0cyBlbWl0dGluZyBhZnRlciBhbiBgaW5pdGlhbERlbGF5YCBhbmRcbiAqIGVtaXRzIGV2ZXIgaW5jcmVhc2luZyBudW1iZXJzIGFmdGVyIGVhY2ggYHBlcmlvZGAgb2YgdGltZSB0aGVyZWFmdGVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdHMgbGlrZSB7QGxpbmsgaW5kZXgvaW50ZXJ2YWx9LCBidXQgeW91IGNhbiBzcGVjaWZ5IHdoZW5cbiAqIHNob3VsZCB0aGUgZW1pc3Npb25zIHN0YXJ0Ljwvc3Bhbj5cbiAqXG4gKiAhW10odGltZXIucG5nKVxuICpcbiAqIGB0aW1lcmAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2YgYXNjZW5kaW5nXG4gKiBpbnRlZ2Vycywgd2l0aCBhIGNvbnN0YW50IGludGVydmFsIG9mIHRpbWUsIGBwZXJpb2RgIG9mIHlvdXIgY2hvb3NpbmdcbiAqIGJldHdlZW4gdGhvc2UgZW1pc3Npb25zLiBUaGUgZmlyc3QgZW1pc3Npb24gaGFwcGVucyBhZnRlciB0aGUgc3BlY2lmaWVkXG4gKiBgaW5pdGlhbERlbGF5YC4gVGhlIGluaXRpYWwgZGVsYXkgbWF5IGJlIGEgYERhdGVgLiBCeSBkZWZhdWx0LCB0aGlzXG4gKiBvcGVyYXRvciB1c2VzIHRoZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBwcm92aWRlIGEgbm90aW9uIG9mIHRpbWUsIGJ1dCB5b3VcbiAqIG1heSBwYXNzIGFueSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gaXQuIElmIGBwZXJpb2RgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUgZW1pdHMgb25seSBvbmUgdmFsdWUsIGAwYC4gT3RoZXJ3aXNlLCBpdCBlbWl0cyBhbiBpbmZpbml0ZVxuICogc2VxdWVuY2UuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKSwgc3RhcnRpbmcgYWZ0ZXIgMyBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gdGltZXIoMzAwMCwgMTAwMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBFbWl0cyBvbmUgbnVtYmVyIGFmdGVyIGZpdmUgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDUwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gW2R1ZVRpbWVdIFRoZSBpbml0aWFsIGRlbGF5IHRpbWUgdG8gd2FpdCBiZWZvcmVcbiAqIGVtaXR0aW5nIHRoZSBmaXJzdCB2YWx1ZSBvZiBgMGAuXG4gKiBAcGFyYW0ge251bWJlcnxTY2hlZHVsZXJMaWtlfSBbcGVyaW9kT3JTY2hlZHVsZXJdIFRoZSBwZXJpb2Qgb2YgdGltZSBiZXR3ZWVuIGVtaXNzaW9ucyBvZiB0aGVcbiAqIHN1YnNlcXVlbnQgbnVtYmVycy5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMsIGFuZCBwcm92aWRpbmcgYSBub3Rpb24gb2YgXCJ0aW1lXCIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBgMGAgYWZ0ZXIgdGhlXG4gKiBgaW5pdGlhbERlbGF5YCBhbmQgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lXG4gKiB0aGVyZWFmdGVyLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aW1lclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWU6IG51bWJlciB8IERhdGUgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZE9yU2NoZWR1bGVyPzogbnVtYmVyIHwgU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgbGV0IHBlcmlvZCA9IC0xO1xuICBpZiAoaXNOdW1lcmljKHBlcmlvZE9yU2NoZWR1bGVyKSkge1xuICAgIHBlcmlvZCA9IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcikgPCAxICYmIDEgfHwgTnVtYmVyKHBlcmlvZE9yU2NoZWR1bGVyKTtcbiAgfSBlbHNlIGlmIChpc1NjaGVkdWxlcihwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBwZXJpb2RPclNjaGVkdWxlciBhcyBhbnk7XG4gIH1cblxuICBpZiAoIWlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBkdWUgPSBpc051bWVyaWMoZHVlVGltZSlcbiAgICAgID8gKGR1ZVRpbWUgYXMgbnVtYmVyKVxuICAgICAgOiAoK2R1ZVRpbWUgLSBzY2hlZHVsZXIubm93KCkpO1xuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgZHVlLCB7XG4gICAgICBpbmRleDogMCwgcGVyaW9kLCBzdWJzY3JpYmVyXG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVGltZXJTdGF0ZSB7XG4gIGluZGV4OiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUaW1lclN0YXRlPiwgc3RhdGU6IFRpbWVyU3RhdGUpIHtcbiAgY29uc3QgeyBpbmRleCwgcGVyaW9kLCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcbiAgc3Vic2NyaWJlci5uZXh0KGluZGV4KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAocGVyaW9kID09PSAtMSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgcGVyaW9kKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFVuc3Vic2NyaWJhYmxlLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJzsgLy8gZnJvbSBmcm9tIGZyb20hIExBV0xcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgdXNlcyBhIHJlc291cmNlIHdoaWNoIHdpbGwgYmUgZGlzcG9zZWQgYXQgdGhlIHNhbWUgdGltZSBhcyB0aGUgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VXNlIGl0IHdoZW4geW91IGNhdGNoIHlvdXJzZWxmIGNsZWFuaW5nIHVwIGFmdGVyIGFuIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqIGB1c2luZ2AgaXMgYSBmYWN0b3J5IG9wZXJhdG9yLCB3aGljaCBhY2NlcHRzIHR3byBmdW5jdGlvbnMuIEZpcnN0IGZ1bmN0aW9uIHJldHVybnMgYSBkaXNwb3NhYmxlIHJlc291cmNlLlxuICogSXQgY2FuIGJlIGFuIGFyYml0cmFyeSBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIGB1bnN1YnNjcmliZWAgbWV0aG9kLiBTZWNvbmQgZnVuY3Rpb24gd2lsbCBiZSBpbmplY3RlZCB3aXRoXG4gKiB0aGF0IG9iamVjdCBhbmQgc2hvdWxkIHJldHVybiBhbiBPYnNlcnZhYmxlLiBUaGF0IE9ic2VydmFibGUgY2FuIHVzZSByZXNvdXJjZSBvYmplY3QgZHVyaW5nIGl0cyBleGVjdXRpb24uXG4gKiBCb3RoIGZ1bmN0aW9ucyBwYXNzZWQgdG8gYHVzaW5nYCB3aWxsIGJlIGNhbGxlZCBldmVyeSB0aW1lIHNvbWVvbmUgc3Vic2NyaWJlcyAtIG5laXRoZXIgYW4gT2JzZXJ2YWJsZSBub3JcbiAqIHJlc291cmNlIG9iamVjdCB3aWxsIGJlIHNoYXJlZCBpbiBhbnkgd2F5IGJldHdlZW4gc3Vic2NyaXB0aW9ucy5cbiAqXG4gKiBXaGVuIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgYHVzaW5nYCBpcyBzdWJzY3JpYmVkLCBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gdGhlIHNlY29uZCBmdW5jdGlvbiB3aWxsIGJlIHN1YnNjcmliZWRcbiAqIGFzIHdlbGwuIEFsbCBpdHMgbm90aWZpY2F0aW9ucyAobmV4dGVkIHZhbHVlcywgY29tcGxldGlvbiBhbmQgZXJyb3IgZXZlbnRzKSB3aWxsIGJlIGVtaXR0ZWQgdW5jaGFuZ2VkIGJ5IHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIElmIGhvd2V2ZXIgc29tZW9uZSB1bnN1YnNjcmliZXMgZnJvbSB0aGUgT2JzZXJ2YWJsZSBvciBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgb3IgZXJyb3JzIGJ5IGl0c2VsZixcbiAqIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBvbiByZXNvdXJjZSBvYmplY3Qgd2lsbCBiZSBjYWxsZWQuIFRoaXMgY2FuIGJlIHVzZWQgdG8gZG8gYW55IG5lY2Vzc2FyeSBjbGVhbiB1cCwgd2hpY2hcbiAqIG90aGVyd2lzZSB3b3VsZCBoYXZlIHRvIGJlIGhhbmRsZWQgYnkgaGFuZC4gTm90ZSB0aGF0IGNvbXBsZXRlIG9yIGVycm9yIG5vdGlmaWNhdGlvbnMgYXJlIG5vdCBlbWl0dGVkIHdoZW4gc29tZW9uZVxuICogY2FuY2VscyBzdWJzY3JpcHRpb24gdG8gYW4gT2JzZXJ2YWJsZSB2aWEgYHVuc3Vic2NyaWJlYCwgc28gYHVzaW5nYCBjYW4gYmUgdXNlZCBhcyBhIGhvb2ssIGFsbG93aW5nIHlvdSB0byBtYWtlXG4gKiBzdXJlIHRoYXQgYWxsIHJlc291cmNlcyB3aGljaCBuZWVkIHRvIGV4aXN0IGR1cmluZyBhbiBPYnNlcnZhYmxlIGV4ZWN1dGlvbiB3aWxsIGJlIGRpc3Bvc2VkIGF0IGFwcHJvcHJpYXRlIHRpbWUuXG4gKlxuICogQHNlZSB7QGxpbmsgZGVmZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBJU3Vic2NyaXB0aW9ufSByZXNvdXJjZUZhY3RvcnkgQSBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFueSByZXNvdXJjZSBvYmplY3RcbiAqIHRoYXQgaW1wbGVtZW50cyBgdW5zdWJzY3JpYmVgIG1ldGhvZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24ocmVzb3VyY2U6IElTdWJzY3JpcHRpb24pOiBPYnNlcnZhYmxlPFQ+fSBvYnNlcnZhYmxlRmFjdG9yeSBBIGZ1bmN0aW9uIHdoaWNoXG4gKiBjcmVhdGVzIGFuIE9ic2VydmFibGUsIHRoYXQgY2FuIHVzZSBpbmplY3RlZCByZXNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgYmVoYXZlcyB0aGUgc2FtZSBhcyBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGBvYnNlcnZhYmxlRmFjdG9yeWAsIGJ1dFxuICogd2hpY2ggLSB3aGVuIGNvbXBsZXRlZCwgZXJyb3JlZCBvciB1bnN1YnNjcmliZWQgLSB3aWxsIGFsc28gY2FsbCBgdW5zdWJzY3JpYmVgIG9uIGNyZWF0ZWQgcmVzb3VyY2Ugb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNpbmc8VD4ocmVzb3VyY2VGYWN0b3J5OiAoKSA9PiBVbnN1YnNjcmliYWJsZSB8IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUZhY3Rvcnk6IChyZXNvdXJjZTogVW5zdWJzY3JpYmFibGUgfCB2b2lkKSA9PiBPYnNlcnZhYmxlSW5wdXQ8VD4gfCB2b2lkKTogT2JzZXJ2YWJsZTxUPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgcmVzb3VyY2U6IFVuc3Vic2NyaWJhYmxlIHwgdm9pZDtcblxuICAgIHRyeSB7XG4gICAgICByZXNvdXJjZSA9IHJlc291cmNlRmFjdG9yeSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4gfCB2b2lkO1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBvYnNlcnZhYmxlRmFjdG9yeShyZXNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZSA9IHJlc3VsdCA/IGZyb20ocmVzdWx0KSA6IEVNUFRZO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKHJlc291cmNlKSB7XG4gICAgICAgIHJlc291cmNlLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi8uLi9pbnRlcm5hbC9zeW1ib2wvaXRlcmF0b3InO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSwgdjY6IFQ2KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG5leHBvcnQgZnVuY3Rpb24gemlwPFQ+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSk6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8ICgoLi4udmFsdWVzOiBBcnJheTxUPikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbWJpbmVzIG11bHRpcGxlIE9ic2VydmFibGVzIHRvIGNyZWF0ZSBhbiBPYnNlcnZhYmxlIHdob3NlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB2YWx1ZXMsIGluIG9yZGVyLCBvZiBlYWNoXG4gKiBvZiBpdHMgaW5wdXQgT2JzZXJ2YWJsZXMuXG4gKlxuICogSWYgdGhlIGxhdGVzdCBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiwgdGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNvbXB1dGUgdGhlIGNyZWF0ZWQgdmFsdWUgZnJvbSB0aGUgaW5wdXQgdmFsdWVzLlxuICogT3RoZXJ3aXNlLCBhbiBhcnJheSBvZiB0aGUgaW5wdXQgdmFsdWVzIGlzIHJldHVybmVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbWJpbmUgYWdlIGFuZCBuYW1lIGZyb20gZGlmZmVyZW50IHNvdXJjZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBhZ2UkID0gb2Y8bnVtYmVyPigyNywgMjUsIDI5KTtcbiAqIGxldCBuYW1lJCA9IG9mPHN0cmluZz4oJ0ZvbycsICdCYXInLCAnQmVlcicpO1xuICogbGV0IGlzRGV2JCA9IG9mPGJvb2xlYW4+KHRydWUsIHRydWUsIGZhbHNlKTtcbiAqXG4gKiB6aXAoYWdlJCwgbmFtZSQsIGlzRGV2JCkucGlwZShcbiAqICAgbWFwKChhZ2U6IG51bWJlciwgbmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbikgPT4gKHsgYWdlLCBuYW1lLCBpc0RldiB9KSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIG91dHB1dHNcbiAqIC8vIHsgYWdlOiAyNywgbmFtZTogJ0ZvbycsIGlzRGV2OiB0cnVlIH1cbiAqIC8vIHsgYWdlOiAyNSwgbmFtZTogJ0JhcicsIGlzRGV2OiB0cnVlIH1cbiAqIC8vIHsgYWdlOiAyOSwgbmFtZTogJ0JlZXInLCBpc0RldjogZmFsc2UgfVxuICogYGBgXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZXNcbiAqIEByZXR1cm4ge09ic2VydmFibGU8Uj59XG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHppcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPiB7XG4gIGNvbnN0IHJlc3VsdFNlbGVjdG9yID0gPCgoLi4ueXM6IEFycmF5PGFueT4pID0+IFIpPiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXTtcbiAgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9ic2VydmFibGVzLnBvcCgpO1xuICB9XG4gIHJldHVybiBmcm9tQXJyYXkob2JzZXJ2YWJsZXMsIHVuZGVmaW5lZCkubGlmdChuZXcgWmlwT3BlcmF0b3IocmVzdWx0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFppcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuXG4gIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSO1xuXG4gIGNvbnN0cnVjdG9yKHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSByZXN1bHRTZWxlY3RvcjtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBaaXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVzdWx0U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFppcFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZXM6IGFueTtcbiAgcHJpdmF0ZSByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUjtcbiAgcHJpdmF0ZSBpdGVyYXRvcnM6IExvb2tBaGVhZEl0ZXJhdG9yPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUixcbiAgICAgICAgICAgICAgdmFsdWVzOiBhbnkgPSBPYmplY3QuY3JlYXRlKG51bGwpKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSA/IHJlc3VsdFNlbGVjdG9yIDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgU3RhdGljQXJyYXlJdGVyYXRvcih2YWx1ZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBTdGF0aWNJdGVyYXRvcih2YWx1ZVtTeW1ib2xfaXRlcmF0b3JdKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFppcEJ1ZmZlckl0ZXJhdG9yKHRoaXMuZGVzdGluYXRpb24sIHRoaXMsIHZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSB0aGlzLml0ZXJhdG9ycztcbiAgICBjb25zdCBsZW4gPSBpdGVyYXRvcnMubGVuZ3RoO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlID0gbGVuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvcjogWmlwQnVmZmVySXRlcmF0b3I8YW55LCBhbnk+ID0gPGFueT5pdGVyYXRvcnNbaV07XG4gICAgICBpZiAoaXRlcmF0b3Iuc3RpbGxVbnN1YnNjcmliZWQpIHtcbiAgICAgICAgdGhpcy5hZGQoaXRlcmF0b3Iuc3Vic2NyaWJlKGl0ZXJhdG9yLCBpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFjdGl2ZS0tOyAvLyBub3QgYW4gb2JzZXJ2YWJsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUluYWN0aXZlKCkge1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tJdGVyYXRvcnMoKSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgY29uc3QgbGVuID0gaXRlcmF0b3JzLmxlbmd0aDtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICAvLyBhYm9ydCBpZiBub3QgYWxsIG9mIHRoZW0gaGF2ZSB2YWx1ZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3IgPSBpdGVyYXRvcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGl0ZXJhdG9yLmhhc1ZhbHVlID09PSAnZnVuY3Rpb24nICYmICFpdGVyYXRvci5oYXNWYWx1ZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc2hvdWxkQ29tcGxldGUgPSBmYWxzZTtcbiAgICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvciA9IGl0ZXJhdG9yc1tpXTtcbiAgICAgIGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBpdCdzIGNvbXBsZXRlZCBub3cgdGhhdCB5b3UndmUgZ290dGVuXG4gICAgICAvLyB0aGUgbmV4dCB2YWx1ZS5cbiAgICAgIGlmIChpdGVyYXRvci5oYXNDb21wbGV0ZWQoKSkge1xuICAgICAgICBzaG91bGRDb21wbGV0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFyZ3MucHVzaChyZXN1bHQudmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICB0aGlzLl90cnlyZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdGluYXRpb24ubmV4dChhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkQ29tcGxldGUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF90cnlyZXN1bHRTZWxlY3RvcihhcmdzOiBhbnlbXSkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5yZXN1bHRTZWxlY3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xuICBoYXNWYWx1ZSgpOiBib29sZWFuO1xuICBoYXNDb21wbGV0ZWQoKTogYm9vbGVhbjtcbn1cblxuY2xhc3MgU3RhdGljSXRlcmF0b3I8VD4gaW1wbGVtZW50cyBMb29rQWhlYWRJdGVyYXRvcjxUPiB7XG4gIHByaXZhdGUgbmV4dFJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8VD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpdGVyYXRvcjogSXRlcmF0b3I8VD4pIHtcbiAgICB0aGlzLm5leHRSZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gIH1cblxuICBoYXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubmV4dFJlc3VsdDtcbiAgICB0aGlzLm5leHRSZXN1bHQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIGNvbnN0IG5leHRSZXN1bHQgPSB0aGlzLm5leHRSZXN1bHQ7XG4gICAgcmV0dXJuIG5leHRSZXN1bHQgJiYgbmV4dFJlc3VsdC5kb25lO1xuICB9XG59XG5cbmNsYXNzIFN0YXRpY0FycmF5SXRlcmF0b3I8VD4gaW1wbGVtZW50cyBMb29rQWhlYWRJdGVyYXRvcjxUPiB7XG4gIHByaXZhdGUgaW5kZXggPSAwO1xuICBwcml2YXRlIGxlbmd0aCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcnJheTogVFtdKSB7XG4gICAgdGhpcy5sZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIH1cblxuICBbU3ltYm9sX2l0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgY29uc3QgaSA9IHRoaXMuaW5kZXgrKztcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgcmV0dXJuIGkgPCB0aGlzLmxlbmd0aCA/IHsgdmFsdWU6IGFycmF5W2ldLCBkb25lOiBmYWxzZSB9IDogeyB2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoID4gdGhpcy5pbmRleDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGggPT09IHRoaXMuaW5kZXg7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFppcEJ1ZmZlckl0ZXJhdG9yPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBzdGlsbFVuc3Vic2NyaWJlZCA9IHRydWU7XG4gIGJ1ZmZlcjogVFtdID0gW107XG4gIGlzQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogUGFydGlhbE9ic2VydmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcmVudDogWmlwU3Vic2NyaWJlcjxULCBSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgW1N5bWJvbF9pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBOT1RFOiB0aGVyZSBpcyBhY3R1YWxseSBhIG5hbWUgY29sbGlzaW9uIGhlcmUgd2l0aCBTdWJzY3JpYmVyLm5leHQgYW5kIEl0ZXJhdG9yLm5leHRcbiAgLy8gICAgdGhpcyBpcyBsZWdpdCBiZWNhdXNlIGBuZXh0KClgIHdpbGwgbmV2ZXIgYmUgY2FsbGVkIGJ5IGEgc3Vic2NyaXB0aW9uIGluIHRoaXMgY2FzZS5cbiAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogYnVmZmVyLnNoaWZ0KCksIGRvbmU6IGZhbHNlIH07XG4gICAgfVxuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IDA7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzQ29tcGxldGU7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5idWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMucGFyZW50Lm5vdGlmeUluYWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5idWZmZXIucHVzaChpbm5lclZhbHVlKTtcbiAgICB0aGlzLnBhcmVudC5jaGVja0l0ZXJhdG9ycygpO1xuICB9XG5cbiAgc3Vic2NyaWJlKHZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9SZXN1bHQ8YW55LCBhbnk+KHRoaXMsIHRoaXMub2JzZXJ2YWJsZSwgdGhpcywgaW5kZXgpO1xuICB9XG59XG4iLCIvKiBPYnNlcnZhYmxlICovXG5leHBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9PYnNlcnZhYmxlJztcbmV4cG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUnO1xuZXhwb3J0IHsgR3JvdXBlZE9ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL29wZXJhdG9ycy9ncm91cEJ5JztcbmV4cG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9pbnRlcm5hbC9PcGVyYXRvcic7XG5leHBvcnQgeyBvYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5cbi8qIFN1YmplY3RzICovXG5leHBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9pbnRlcm5hbC9TdWJqZWN0JztcbmV4cG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvQmVoYXZpb3JTdWJqZWN0JztcbmV4cG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICcuL2ludGVybmFsL1JlcGxheVN1YmplY3QnO1xuZXhwb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi9pbnRlcm5hbC9Bc3luY1N1YmplY3QnO1xuXG4vKiBTY2hlZHVsZXJzICovXG5leHBvcnQgeyBhc2FwIGFzIGFzYXBTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9hc2FwJztcbmV4cG9ydCB7IGFzeW5jIGFzIGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvYXN5bmMnO1xuZXhwb3J0IHsgcXVldWUgYXMgcXVldWVTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9xdWV1ZSc7XG5leHBvcnQgeyBhbmltYXRpb25GcmFtZSBhcyBhbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL2FuaW1hdGlvbkZyYW1lJztcbmV4cG9ydCB7IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBWaXJ0dWFsQWN0aW9uIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXInO1xuZXhwb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9TY2hlZHVsZXInO1xuXG4vKiBTdWJzY3JpcHRpb24gKi9cbmV4cG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vaW50ZXJuYWwvU3Vic2NyaXB0aW9uJztcbmV4cG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL2ludGVybmFsL1N1YnNjcmliZXInO1xuXG4vKiBOb3RpZmljYXRpb24gKi9cbmV4cG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4vaW50ZXJuYWwvTm90aWZpY2F0aW9uJztcblxuLyogVXRpbHMgKi9cbmV4cG9ydCB7IHBpcGUgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvcGlwZSc7XG5leHBvcnQgeyBub29wIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL25vb3AnO1xuZXhwb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvaWRlbnRpdHknO1xuZXhwb3J0IHsgaXNPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL2lzT2JzZXJ2YWJsZSc7XG5cbi8qIEVycm9yIHR5cGVzICovXG5leHBvcnQgeyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9Bcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG5leHBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL0VtcHR5RXJyb3InO1xuZXhwb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuZXhwb3J0IHsgVW5zdWJzY3JpcHRpb25FcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9VbnN1YnNjcmlwdGlvbkVycm9yJztcbmV4cG9ydCB7IFRpbWVvdXRFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9UaW1lb3V0RXJyb3InO1xuXG4vKiBTdGF0aWMgb2JzZXJ2YWJsZSBjcmVhdGlvbiBleHBvcnRzICovXG5leHBvcnQgeyBiaW5kQ2FsbGJhY2sgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvYmluZENhbGxiYWNrJztcbmV4cG9ydCB7IGJpbmROb2RlQ2FsbGJhY2sgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvYmluZE5vZGVDYWxsYmFjayc7XG5leHBvcnQgeyBjb21iaW5lTGF0ZXN0IH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2NvbWJpbmVMYXRlc3QnO1xuZXhwb3J0IHsgY29uY2F0IH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2NvbmNhdCc7XG5leHBvcnQgeyBkZWZlciB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9kZWZlcic7XG5leHBvcnQgeyBlbXB0eSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9lbXB0eSc7XG5leHBvcnQgeyBmb3JrSm9pbiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mb3JrSm9pbic7XG5leHBvcnQgeyBmcm9tIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb20nO1xuZXhwb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21FdmVudCc7XG5leHBvcnQgeyBmcm9tRXZlbnRQYXR0ZXJuIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21FdmVudFBhdHRlcm4nO1xuZXhwb3J0IHsgZ2VuZXJhdGUgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZ2VuZXJhdGUnO1xuZXhwb3J0IHsgaWlmIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2lpZic7XG5leHBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9pbnRlcnZhbCc7XG5leHBvcnQgeyBtZXJnZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9tZXJnZSc7XG5leHBvcnQgeyBuZXZlciB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9uZXZlcic7XG5leHBvcnQgeyBvZiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9vZic7XG5leHBvcnQgeyBvbkVycm9yUmVzdW1lTmV4dCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9vbkVycm9yUmVzdW1lTmV4dCc7XG5leHBvcnQgeyBwYWlycyB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9wYWlycyc7XG5leHBvcnQgeyByYWNlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhY2UnO1xuZXhwb3J0IHsgcmFuZ2UgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvcmFuZ2UnO1xuZXhwb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcbmV4cG9ydCB7IHRpbWVyIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyJztcbmV4cG9ydCB7IHVzaW5nIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3VzaW5nJztcbmV4cG9ydCB7IHppcCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS96aXAnO1xuXG4vKiBDb25zdGFudHMgKi9cbmV4cG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2VtcHR5JztcbmV4cG9ydCB7IE5FVkVSIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL25ldmVyJztcblxuLyogVHlwZXMgKi9cbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJuYWwvdHlwZXMnO1xuXG4vKiBDb25maWcgKi9cbmV4cG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vaW50ZXJuYWwvY29uZmlnJztcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNTZXJ2aWNlIHtcblxuICBwdWJsaWMgdG9waWM6IFN1YmplY3Q8YW55PjtcbiAgcHVibGljIG9ic2VydmVyOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pbml0Tm90aWZpY2F0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogw6XCiMKdw6XCp8KLw6XCjMKWXG4gICAqL1xuICBwdWJsaWMgaW5pdE5vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRvcGljID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLm9ic2VydmVyID0gdGhpcy50b3BpYy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDDqMKOwrfDpcKPwpbDqMKnwoLDpcKvwp/DqMKAwoVcbiAgICovXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb24oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiDDpcKPwpHDpcK4woNcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHB1YmxpYyBwdWJsaXNoKGRhdGE6IHtcbiAgICBhY3Q6IHN0cmluZyxcbiAgICBkYXRhPzogYW55XG4gIH0pOiB2b2lkIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy50b3BpYy5uZXh0KGRhdGEpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5neC1ub3RpZmljYXRpb25zJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8cD5cbiAgICAgIG5neC1ub3RpZmljYXRpb25zIHdvcmtzIVxuICAgIDwvcD5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtbm90aWZpY2F0aW9ucy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW05neE5vdGlmaWNhdGlvbnNDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc01vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fZXh0ZW5kcyIsIm9ic2VydmFibGUiLCJSZWZDb3VudFN1YnNjcmliZXIiLCJyZWZDb3VudCIsIml0ZXJhdG9yIiwiU3ltYm9sX2l0ZXJhdG9yIiwiU3ltYm9sX29ic2VydmFibGUiLCJJbmplY3RhYmxlIiwiQ29tcG9uZW50IiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFBOzs7Ozs7Ozs7Ozs7OztJQWNBO0lBRUEsSUFBSSxhQUFhLEdBQUcsVUFBUyxDQUFDLEVBQUUsQ0FBQztRQUM3QixhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7YUFDaEMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUUsVUFBVSxDQUFD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