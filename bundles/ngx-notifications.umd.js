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
                var error = /*@__PURE__*/ new Error();
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

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = /*@__PURE__*/ (function () {
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
    var rxSubscriber = typeof Symbol === 'function'
        ? /*@__PURE__*/ Symbol('rxSubscriber')
        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            _this._parentSubscription = null;
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
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
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
            this._parentSubscription = null;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
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

    /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
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

    /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = /*@__PURE__*/ (function () {
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
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
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

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var SubjectSubscription = /*@__PURE__*/ (function (_super) {
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
    var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = /*@__PURE__*/ (function (_super) {
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
    var AnonymousSubject = /*@__PURE__*/ (function (_super) {
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
    var RefCountOperator = /*@__PURE__*/ (function () {
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
    var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
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
    var ConnectableObservable = /*@__PURE__*/ (function (_super) {
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
    var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
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
    var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
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
    var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
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
    var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
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
    var GroupedObservable = /*@__PURE__*/ (function (_super) {
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
    var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
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
    var BehaviorSubject = /*@__PURE__*/ (function (_super) {
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
    var Action = /*@__PURE__*/ (function (_super) {
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
    var AsyncAction = /*@__PURE__*/ (function (_super) {
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
            clearInterval(id);
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
    var QueueAction = /*@__PURE__*/ (function (_super) {
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

    var Scheduler = /*@__PURE__*/ (function () {
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
    var AsyncScheduler = /*@__PURE__*/ (function (_super) {
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
    var QueueScheduler = /*@__PURE__*/ (function (_super) {
        __extends(QueueScheduler, _super);
        function QueueScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return QueueScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
    var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
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
    var Notification = /*@__PURE__*/ (function () {
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
    var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
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
            var destination = this.destination;
            destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
        };
        ObserveOnSubscriber.prototype._next = function (value) {
            this.scheduleMessage(Notification.createNext(value));
        };
        ObserveOnSubscriber.prototype._error = function (err) {
            this.scheduleMessage(Notification.createError(err));
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype._complete = function () {
            this.scheduleMessage(Notification.createComplete());
            this.unsubscribe();
        };
        return ObserveOnSubscriber;
    }(Subscriber));
    var ObserveOnMessage = /*@__PURE__*/ (function () {
        function ObserveOnMessage(notification, destination) {
            this.notification = notification;
            this.destination = destination;
        }
        return ObserveOnMessage;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
    var ReplaySubject = /*@__PURE__*/ (function (_super) {
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
    var ReplayEvent = /*@__PURE__*/ (function () {
        function ReplayEvent(time, value) {
            this.time = time;
            this.value = value;
        }
        return ReplayEvent;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
    var AsyncSubject = /*@__PURE__*/ (function (_super) {
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
    var AsapAction = /*@__PURE__*/ (function (_super) {
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
    var AsapScheduler = /*@__PURE__*/ (function (_super) {
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
    var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);

    /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
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
    var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
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
    var animationFrame = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
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
    var VirtualAction = /*@__PURE__*/ (function (_super) {
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

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var MapSubscriber = /*@__PURE__*/ (function (_super) {
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

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var OuterSubscriber = /*@__PURE__*/ (function (_super) {
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
    var InnerSubscriber = /*@__PURE__*/ (function (_super) {
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
    var iterator = /*@__PURE__*/ getSymbolIterator();

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
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
        if (destination === void 0) {
            destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        }
        if (destination.closed) {
            return;
        }
        return subscribeTo(result)(destination);
    }

    /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
    var NONE = {};
    var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
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

    /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
    var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
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
            var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
            var destination = this.destination;
            destination.add(innerSubscriber);
            subscribeToResult(this, ish, value, index, innerSubscriber);
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
            this.unsubscribe();
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
    var ForkJoinSubscriber = /*@__PURE__*/ (function (_super) {
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
    var RaceSubscriber = /*@__PURE__*/ (function (_super) {
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
    var ZipSubscriber = /*@__PURE__*/ (function (_super) {
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
            this.unsubscribe();
            if (len === 0) {
                this.destination.complete();
                return;
            }
            this.active = len;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (iterator$$1.stillUnsubscribed) {
                    var destination = this.destination;
                    destination.add(iterator$$1.subscribe(iterator$$1, i));
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
    var StaticIterator = /*@__PURE__*/ (function () {
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
    var StaticArrayIterator = /*@__PURE__*/ (function () {
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
    var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxNotificationsService = /** @class */ (function () {
        function NgxNotificationsService() {
            this.initNotification();
        }
        /**
         * 初始化
         */
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
         */
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
         * @param data
         */
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxNotificationsComponent = /** @class */ (function () {
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxNotificationsModule = /** @class */ (function () {
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
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.NgxNotificationsService = NgxNotificationsService;
    exports.NgxNotificationsComponent = NgxNotificationsComponent;
    exports.NgxNotificationsModule = NgxNotificationsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMudW1kLmpzLm1hcCIsInNvdXJjZXMiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLCJuZzovL25neC1ub3RpZmljYXRpb25zL2xpYi9uZ3gtbm90aWZpY2F0aW9ucy5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oeDogYW55KTogeCBpcyBGdW5jdGlvbiB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImxldCBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3MgPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBSeEpTLCB1c2VkIHRvIGNvbmZpZ3VyZSB0aGluZ3NcbiAqIGxpa2Ugd2hhdCBQcm9taXNlIGNvbnRydWN0b3Igc2hvdWxkIHVzZWQgdG8gY3JlYXRlIFByb21pc2VzXG4gKi9cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIC8qKlxuICAgKiBUaGUgcHJvbWlzZSBjb25zdHJ1Y3RvciB1c2VkIGJ5IGRlZmF1bHQgZm9yIG1ldGhvZHMgc3VjaCBhc1xuICAgKiB7QGxpbmsgdG9Qcm9taXNlfSBhbmQge0BsaW5rIGZvckVhY2h9XG4gICAqL1xuICBQcm9taXNlOiB1bmRlZmluZWQgYXMgUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgdHVybnMgb24gc3luY2hyb25vdXMgZXJyb3IgcmV0aHJvd2luZywgd2hpY2ggaXMgYSBkZXByZWNhdGVkIGJlaGF2aW9yXG4gICAqIGluIHY2IGFuZCBoaWdoZXIuIFRoaXMgYmVoYXZpb3IgZW5hYmxlcyBiYWQgcGF0dGVybnMgbGlrZSB3cmFwcGluZyBhIHN1YnNjcmliZVxuICAgKiBjYWxsIGluIGEgdHJ5L2NhdGNoIGJsb2NrLiBJdCBhbHNvIGVuYWJsZXMgcHJvZHVjZXIgaW50ZXJmZXJlbmNlLCBhIG5hc3R5IGJ1Z1xuICAgKiB3aGVyZSBhIG11bHRpY2FzdCBjYW4gYmUgYnJva2VuIGZvciBhbGwgb2JzZXJ2ZXJzIGJ5IGEgZG93bnN0cmVhbSBjb25zdW1lciB3aXRoXG4gICAqIGFuIHVuaGFuZGxlZCBlcnJvci4gRE8gTk9UIFVTRSBUSElTIEZMQUcgVU5MRVNTIElUJ1MgTkVFREVEIFRPIEJZIFRJTUVcbiAgICogRk9SIE1JR1JBVElPTiBSRUFTT05TLlxuICAgKi9cbiAgc2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ0RFUFJFQ0FURUQhIFJ4SlMgd2FzIHNldCB0byB1c2UgZGVwcmVjYXRlZCBzeW5jaHJvbm91cyBlcnJvciBoYW5kbGluZyBiZWhhdmlvciBieSBjb2RlIGF0OiBcXG4nICsgZXJyb3Iuc3RhY2spO1xuICAgIH0gZWxzZSBpZiAoX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzKSB7XG4gICAgICBjb25zb2xlLmxvZygnUnhKUzogQmFjayB0byBhIGJldHRlciBlcnJvciBiZWhhdmlvci4gVGhhbmsgeW91LiA8MycpO1xuICAgIH1cbiAgICBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3MgPSB2YWx1ZTtcbiAgfSxcblxuICBnZXQgdXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZygpIHtcbiAgICByZXR1cm4gX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzO1xuICB9LFxufTtcbiIsIi8qKlxuICogVGhyb3dzIGFuIGVycm9yIG9uIGFub3RoZXIgam9iIHNvIHRoYXQgaXQncyBwaWNrZWQgdXAgYnkgdGhlIHJ1bnRpbWUnc1xuICogdW5jYXVnaHQgZXJyb3IgaGFuZGxpbmcgbWVjaGFuaXNtLlxuICogQHBhcmFtIGVyciB0aGUgZXJyb3IgdG8gdGhyb3dcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhvc3RSZXBvcnRFcnJvcihlcnI6IGFueSkge1xuICBzZXRUaW1lb3V0KCgpID0+IHsgdGhyb3cgZXJyOyB9KTtcbn0iLCJpbXBvcnQgeyBPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG5cbmV4cG9ydCBjb25zdCBlbXB0eTogT2JzZXJ2ZXI8YW55PiA9IHtcbiAgY2xvc2VkOiB0cnVlLFxuICBuZXh0KHZhbHVlOiBhbnkpOiB2b2lkIHsgLyogbm9vcCAqL30sXG4gIGVycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbiAgY29tcGxldGUoKTogdm9pZCB7IC8qbm9vcCovIH1cbn07XG4iLCJleHBvcnQgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgKDxUPih4OiBhbnkpOiB4IGlzIFRbXSA9PiB4ICYmIHR5cGVvZiB4Lmxlbmd0aCA9PT0gJ251bWJlcicpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KHg6IGFueSk6IHggaXMgT2JqZWN0IHtcbiAgcmV0dXJuIHggIT0gbnVsbCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCc7XG59XG4iLCIvLyB0eXBlb2YgYW55IHNvIHRoYXQgaXQgd2UgZG9uJ3QgaGF2ZSB0byBjYXN0IHdoZW4gY29tcGFyaW5nIGEgcmVzdWx0IHRvIHRoZSBlcnJvciBvYmplY3RcbmV4cG9ydCBjb25zdCBlcnJvck9iamVjdDogYW55ID0geyBlOiB7fSB9OyIsImltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi9lcnJvck9iamVjdCc7XG5cbmxldCB0cnlDYXRjaFRhcmdldDogRnVuY3Rpb247XG5cbmZ1bmN0aW9uIHRyeUNhdGNoZXIodGhpczogYW55KTogYW55IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdHJ5Q2F0Y2hUYXJnZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yT2JqZWN0LmUgPSBlO1xuICAgIHJldHVybiBlcnJvck9iamVjdDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJ5Q2F0Y2g8VCBleHRlbmRzIEZ1bmN0aW9uPihmbjogVCk6IFQge1xuICB0cnlDYXRjaFRhcmdldCA9IGZuO1xuICByZXR1cm4gPGFueT50cnlDYXRjaGVyO1xufVxuIiwiZXhwb3J0IGludGVyZmFjZSBVbnN1YnNjcmlwdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICByZWFkb25seSBlcnJvcnM6IGFueVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVuc3Vic2NyaXB0aW9uRXJyb3JDdG9yIHtcbiAgbmV3KGVycm9yczogYW55W10pOiBVbnN1YnNjcmlwdGlvbkVycm9yO1xufVxuXG5mdW5jdGlvbiBVbnN1YnNjcmlwdGlvbkVycm9ySW1wbCh0aGlzOiBhbnksIGVycm9yczogYW55W10pIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcbiAgdGhpcy5tZXNzYWdlID0gZXJyb3JzID9cbiAgYCR7ZXJyb3JzLmxlbmd0aH0gZXJyb3JzIG9jY3VycmVkIGR1cmluZyB1bnN1YnNjcmlwdGlvbjpcbiR7ZXJyb3JzLm1hcCgoZXJyLCBpKSA9PiBgJHtpICsgMX0pICR7ZXJyLnRvU3RyaW5nKCl9YCkuam9pbignXFxuICAnKX1gIDogJyc7XG4gIHRoaXMubmFtZSA9ICdVbnN1YnNjcmlwdGlvbkVycm9yJztcbiAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gIHJldHVybiB0aGlzO1xufVxuXG5VbnN1YnNjcmlwdGlvbkVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gb25lIG9yIG1vcmUgZXJyb3JzIGhhdmUgb2NjdXJyZWQgZHVyaW5nIHRoZVxuICogYHVuc3Vic2NyaWJlYCBvZiBhIHtAbGluayBTdWJzY3JpcHRpb259LlxuICovXG5leHBvcnQgY29uc3QgVW5zdWJzY3JpcHRpb25FcnJvcjogVW5zdWJzY3JpcHRpb25FcnJvckN0b3IgPSBVbnN1YnNjcmlwdGlvbkVycm9ySW1wbCBhcyBhbnk7IiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi91dGlsL2lzT2JqZWN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHJlc291cmNlLCBzdWNoIGFzIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZS4gQVxuICogU3Vic2NyaXB0aW9uIGhhcyBvbmUgaW1wb3J0YW50IG1ldGhvZCwgYHVuc3Vic2NyaWJlYCwgdGhhdCB0YWtlcyBubyBhcmd1bWVudFxuICogYW5kIGp1c3QgZGlzcG9zZXMgdGhlIHJlc291cmNlIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHN1YnNjcmlwdGlvbnMgbWF5IGJlIGdyb3VwZWQgdG9nZXRoZXIgdGhyb3VnaCB0aGUgYGFkZCgpYFxuICogbWV0aG9kLCB3aGljaCB3aWxsIGF0dGFjaCBhIGNoaWxkIFN1YnNjcmlwdGlvbiB0byB0aGUgY3VycmVudCBTdWJzY3JpcHRpb24uXG4gKiBXaGVuIGEgU3Vic2NyaXB0aW9uIGlzIHVuc3Vic2NyaWJlZCwgYWxsIGl0cyBjaGlsZHJlbiAoYW5kIGl0cyBncmFuZGNoaWxkcmVuKVxuICogd2lsbCBiZSB1bnN1YnNjcmliZWQgYXMgd2VsbC5cbiAqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb24gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHB1YmxpYyBzdGF0aWMgRU1QVFk6IFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbihlbXB0eTogYW55KSB7XG4gICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gZW1wdHk7XG4gIH0obmV3IFN1YnNjcmlwdGlvbigpKSk7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoaXMgU3Vic2NyaXB0aW9uIGhhcyBhbHJlYWR5IGJlZW4gdW5zdWJzY3JpYmVkLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50OiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50czogU3Vic2NyaXB0aW9uW10gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbkxpa2VbXSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW3Vuc3Vic2NyaWJlXSBBIGZ1bmN0aW9uIGRlc2NyaWJpbmcgaG93IHRvXG4gICAqIHBlcmZvcm0gdGhlIGRpc3Bvc2FsIG9mIHJlc291cmNlcyB3aGVuIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1bnN1YnNjcmliZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICg8YW55PiB0aGlzKS5fdW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhlIHJlc291cmNlcyBoZWxkIGJ5IHRoZSBzdWJzY3JpcHRpb24uIE1heSwgZm9yIGluc3RhbmNlLCBjYW5jZWxcbiAgICogYW4gb25nb2luZyBPYnNlcnZhYmxlIGV4ZWN1dGlvbiBvciBjYW5jZWwgYW55IG90aGVyIHR5cGUgb2Ygd29yayB0aGF0XG4gICAqIHN0YXJ0ZWQgd2hlbiB0aGUgU3Vic2NyaXB0aW9uIHdhcyBjcmVhdGVkLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgbGV0IGhhc0Vycm9ycyA9IGZhbHNlO1xuICAgIGxldCBlcnJvcnM6IGFueVtdO1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHsgX3BhcmVudCwgX3BhcmVudHMsIF91bnN1YnNjcmliZSwgX3N1YnNjcmlwdGlvbnMgfSA9ICg8YW55PiB0aGlzKTtcblxuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudHMgPSBudWxsO1xuICAgIC8vIG51bGwgb3V0IF9zdWJzY3JpcHRpb25zIGZpcnN0IHNvIGFueSBjaGlsZCBzdWJzY3JpcHRpb25zIHRoYXQgYXR0ZW1wdFxuICAgIC8vIHRvIHJlbW92ZSB0aGVtc2VsdmVzIGZyb20gdGhpcyBzdWJzY3JpcHRpb24gd2lsbCBub29wXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGVuID0gX3BhcmVudHMgPyBfcGFyZW50cy5sZW5ndGggOiAwO1xuXG4gICAgLy8gaWYgdGhpcy5fcGFyZW50IGlzIG51bGwsIHRoZW4gc28gaXMgdGhpcy5fcGFyZW50cywgYW5kIHdlXG4gICAgLy8gZG9uJ3QgaGF2ZSB0byByZW1vdmUgb3Vyc2VsdmVzIGZyb20gYW55IHBhcmVudCBzdWJzY3JpcHRpb25zLlxuICAgIHdoaWxlIChfcGFyZW50KSB7XG4gICAgICBfcGFyZW50LnJlbW92ZSh0aGlzKTtcbiAgICAgIC8vIGlmIHRoaXMuX3BhcmVudHMgaXMgbnVsbCBvciBpbmRleCA+PSBsZW4sXG4gICAgICAvLyB0aGVuIF9wYXJlbnQgaXMgc2V0IHRvIG51bGwsIGFuZCB0aGUgbG9vcCBleGl0c1xuICAgICAgX3BhcmVudCA9ICsraW5kZXggPCBsZW4gJiYgX3BhcmVudHNbaW5kZXhdIHx8IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oX3Vuc3Vic2NyaWJlKSkge1xuICAgICAgbGV0IHRyaWFsID0gdHJ5Q2F0Y2goX3Vuc3Vic2NyaWJlKS5jYWxsKHRoaXMpO1xuICAgICAgaWYgKHRyaWFsID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICBlcnJvcnMgPSBlcnJvcnMgfHwgKFxuICAgICAgICAgIGVycm9yT2JqZWN0LmUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID9cbiAgICAgICAgICAgIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvck9iamVjdC5lLmVycm9ycykgOiBbZXJyb3JPYmplY3QuZV1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheShfc3Vic2NyaXB0aW9ucykpIHtcblxuICAgICAgaW5kZXggPSAtMTtcbiAgICAgIGxlbiA9IF9zdWJzY3JpcHRpb25zLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW4pIHtcbiAgICAgICAgY29uc3Qgc3ViID0gX3N1YnNjcmlwdGlvbnNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNPYmplY3Qoc3ViKSkge1xuICAgICAgICAgIGxldCB0cmlhbCA9IHRyeUNhdGNoKHN1Yi51bnN1YnNjcmliZSkuY2FsbChzdWIpO1xuICAgICAgICAgIGlmICh0cmlhbCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgfHwgW107XG4gICAgICAgICAgICBsZXQgZXJyID0gZXJyb3JPYmplY3QuZTtcbiAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycy5jb25jYXQoZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVyci5lcnJvcnMpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0Vycm9ycykge1xuICAgICAgdGhyb3cgbmV3IFVuc3Vic2NyaXB0aW9uRXJyb3IoZXJyb3JzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHRlYXIgZG93biB0byBiZSBjYWxsZWQgZHVyaW5nIHRoZSB1bnN1YnNjcmliZSgpIG9mIHRoaXNcbiAgICogU3Vic2NyaXB0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgdGVhciBkb3duIGJlaW5nIGFkZGVkIGlzIGEgc3Vic2NyaXB0aW9uIHRoYXQgaXMgYWxyZWFkeVxuICAgKiB1bnN1YnNjcmliZWQsIGlzIHRoZSBzYW1lIHJlZmVyZW5jZSBgYWRkYCBpcyBiZWluZyBjYWxsZWQgb24sIG9yIGlzXG4gICAqIGBTdWJzY3JpcHRpb24uRU1QVFlgLCBpdCB3aWxsIG5vdCBiZSBhZGRlZC5cbiAgICpcbiAgICogSWYgdGhpcyBzdWJzY3JpcHRpb24gaXMgYWxyZWFkeSBpbiBhbiBgY2xvc2VkYCBzdGF0ZSwgdGhlIHBhc3NlZFxuICAgKiB0ZWFyIGRvd24gbG9naWMgd2lsbCBiZSBleGVjdXRlZCBpbW1lZGlhdGVseS5cbiAgICpcbiAgICogQHBhcmFtIHtUZWFyZG93bkxvZ2ljfSB0ZWFyZG93biBUaGUgYWRkaXRpb25hbCBsb2dpYyB0byBleGVjdXRlIG9uXG4gICAqIHRlYXJkb3duLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpcHRpb259IFJldHVybnMgdGhlIFN1YnNjcmlwdGlvbiB1c2VkIG9yIGNyZWF0ZWQgdG8gYmVcbiAgICogYWRkZWQgdG8gdGhlIGlubmVyIHN1YnNjcmlwdGlvbnMgbGlzdC4gVGhpcyBTdWJzY3JpcHRpb24gY2FuIGJlIHVzZWQgd2l0aFxuICAgKiBgcmVtb3ZlKClgIHRvIHJlbW92ZSB0aGUgcGFzc2VkIHRlYXJkb3duIGxvZ2ljIGZyb20gdGhlIGlubmVyIHN1YnNjcmlwdGlvbnNcbiAgICogbGlzdC5cbiAgICovXG4gIGFkZCh0ZWFyZG93bjogVGVhcmRvd25Mb2dpYyk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKCF0ZWFyZG93biB8fCAodGVhcmRvd24gPT09IFN1YnNjcmlwdGlvbi5FTVBUWSkpIHtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfVxuXG4gICAgaWYgKHRlYXJkb3duID09PSB0aGlzKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gKDxTdWJzY3JpcHRpb24+IHRlYXJkb3duKTtcblxuICAgIHN3aXRjaCAodHlwZW9mIHRlYXJkb3duKSB7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oPCgoKSA9PiB2b2lkKSA+IHRlYXJkb3duKTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChzdWJzY3JpcHRpb24uY2xvc2VkIHx8IHR5cGVvZiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3Vic2NyaXB0aW9uLl9hZGRQYXJlbnQgIT09ICdmdW5jdGlvbicgLyogcXVhY2sgcXVhY2sgKi8pIHtcbiAgICAgICAgICBjb25zdCB0bXAgPSBzdWJzY3JpcHRpb247XG4gICAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi5fc3Vic2NyaXB0aW9ucyA9IFt0bXBdO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnJlY29nbml6ZWQgdGVhcmRvd24gJyArIHRlYXJkb3duICsgJyBhZGRlZCB0byBTdWJzY3JpcHRpb24uJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmlwdGlvbnMgfHwgKHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBbXSk7XG5cbiAgICBzdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICBzdWJzY3JpcHRpb24uX2FkZFBhcmVudCh0aGlzKTtcblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIFN1YnNjcmlwdGlvbiBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIHN1YnNjcmlwdGlvbnMgdGhhdCB3aWxsXG4gICAqIHVuc3Vic2NyaWJlIGR1cmluZyB0aGUgdW5zdWJzY3JpYmUgcHJvY2VzcyBvZiB0aGlzIFN1YnNjcmlwdGlvbi5cbiAgICogQHBhcmFtIHtTdWJzY3JpcHRpb259IHN1YnNjcmlwdGlvbiBUaGUgc3Vic2NyaXB0aW9uIHRvIHJlbW92ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHJlbW92ZShzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zO1xuICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25JbmRleCA9IHN1YnNjcmlwdGlvbnMuaW5kZXhPZihzdWJzY3JpcHRpb24pO1xuICAgICAgaWYgKHN1YnNjcmlwdGlvbkluZGV4ICE9PSAtMSkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLnNwbGljZShzdWJzY3JpcHRpb25JbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9hZGRQYXJlbnQocGFyZW50OiBTdWJzY3JpcHRpb24pIHtcbiAgICBsZXQgeyBfcGFyZW50LCBfcGFyZW50cyB9ID0gdGhpcztcbiAgICBpZiAoIV9wYXJlbnQgfHwgX3BhcmVudCA9PT0gcGFyZW50KSB7XG4gICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgcGFyZW50LCBvciB0aGUgbmV3IHBhcmVudCBpcyB0aGUgc2FtZSBhcyB0aGVcbiAgICAgIC8vIGN1cnJlbnQgcGFyZW50LCB0aGVuIHNldCB0aGlzLl9wYXJlbnQgdG8gdGhlIG5ldyBwYXJlbnQuXG4gICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfSBlbHNlIGlmICghX3BhcmVudHMpIHtcbiAgICAgIC8vIElmIHRoZXJlJ3MgYWxyZWFkeSBvbmUgcGFyZW50LCBidXQgbm90IG11bHRpcGxlLCBhbGxvY2F0ZSBhbiBBcnJheSB0b1xuICAgICAgLy8gc3RvcmUgdGhlIHJlc3Qgb2YgdGhlIHBhcmVudCBTdWJzY3JpcHRpb25zLlxuICAgICAgdGhpcy5fcGFyZW50cyA9IFtwYXJlbnRdO1xuICAgIH0gZWxzZSBpZiAoX3BhcmVudHMuaW5kZXhPZihwYXJlbnQpID09PSAtMSkge1xuICAgICAgLy8gT25seSBhZGQgdGhlIG5ldyBwYXJlbnQgdG8gdGhlIF9wYXJlbnRzIGxpc3QgaWYgaXQncyBub3QgYWxyZWFkeSB0aGVyZS5cbiAgICAgIF9wYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVycm9yczogYW55W10pIHtcbiByZXR1cm4gZXJyb3JzLnJlZHVjZSgoZXJycywgZXJyKSA9PiBlcnJzLmNvbmNhdCgoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikgPyBlcnIuZXJyb3JzIDogZXJyKSwgW10pO1xufVxuIiwiLyoqIEBkZXByZWNhdGVkIGRvIG5vdCB1c2UsIHRoaXMgaXMgbm8gbG9uZ2VyIGNoZWNrZWQgYnkgUnhKUyBpbnRlcm5hbHMgKi9cbmV4cG9ydCBjb25zdCByeFN1YnNjcmliZXIgPVxuICB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nXG4gICAgPyBTeW1ib2woJ3J4U3Vic2NyaWJlcicpXG4gICAgOiAnQEByeFN1YnNjcmliZXJfJyArIE1hdGgucmFuZG9tKCk7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIHJ4U3Vic2NyaWJlciBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBjb25zdCAkJHJ4U3Vic2NyaWJlciA9IHJ4U3Vic2NyaWJlcjtcbiIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBlbXB0eSBhcyBlbXB0eU9ic2VydmVyIH0gZnJvbSAnLi9PYnNlcnZlcic7XG5pbXBvcnQgeyBPYnNlcnZlciwgUGFydGlhbE9ic2VydmVyLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyByeFN1YnNjcmliZXIgYXMgcnhTdWJzY3JpYmVyU3ltYm9sIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL3J4U3Vic2NyaWJlcic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvaG9zdFJlcG9ydEVycm9yJztcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSB7QGxpbmsgT2JzZXJ2ZXJ9IGludGVyZmFjZSBhbmQgZXh0ZW5kcyB0aGVcbiAqIHtAbGluayBTdWJzY3JpcHRpb259IGNsYXNzLiBXaGlsZSB0aGUge0BsaW5rIE9ic2VydmVyfSBpcyB0aGUgcHVibGljIEFQSSBmb3JcbiAqIGNvbnN1bWluZyB0aGUgdmFsdWVzIG9mIGFuIHtAbGluayBPYnNlcnZhYmxlfSwgYWxsIE9ic2VydmVycyBnZXQgY29udmVydGVkIHRvXG4gKiBhIFN1YnNjcmliZXIsIGluIG9yZGVyIHRvIHByb3ZpZGUgU3Vic2NyaXB0aW9uLWxpa2UgY2FwYWJpbGl0aWVzIHN1Y2ggYXNcbiAqIGB1bnN1YnNjcmliZWAuIFN1YnNjcmliZXIgaXMgYSBjb21tb24gdHlwZSBpbiBSeEpTLCBhbmQgY3J1Y2lhbCBmb3JcbiAqIGltcGxlbWVudGluZyBvcGVyYXRvcnMsIGJ1dCBpdCBpcyByYXJlbHkgdXNlZCBhcyBhIHB1YmxpYyBBUEkuXG4gKlxuICogQGNsYXNzIFN1YnNjcmliZXI8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpcHRpb24gaW1wbGVtZW50cyBPYnNlcnZlcjxUPiB7XG5cbiAgW3J4U3Vic2NyaWJlclN5bWJvbF0oKSB7IHJldHVybiB0aGlzOyB9XG5cbiAgLyoqXG4gICAqIEEgc3RhdGljIGZhY3RvcnkgZm9yIGEgU3Vic2NyaWJlciwgZ2l2ZW4gYSAocG90ZW50aWFsbHkgcGFydGlhbCkgZGVmaW5pdGlvblxuICAgKiBvZiBhbiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbih4OiA/VCk6IHZvaWR9IFtuZXh0XSBUaGUgYG5leHRgIGNhbGxiYWNrIG9mIGFuIE9ic2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGU6ID9hbnkpOiB2b2lkfSBbZXJyb3JdIFRoZSBgZXJyb3JgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gVGhlIGBjb21wbGV0ZWAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqIEByZXR1cm4ge1N1YnNjcmliZXI8VD59IEEgU3Vic2NyaWJlciB3cmFwcGluZyB0aGUgKHBhcnRpYWxseSBkZWZpbmVkKVxuICAgKiBPYnNlcnZlciByZXByZXNlbnRlZCBieSB0aGUgZ2l2ZW4gYXJndW1lbnRzLlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTxUPihuZXh0PzogKHg/OiBUKSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaWJlcjxUPiB7XG4gICAgY29uc3Qgc3Vic2NyaWJlciA9IG5ldyBTdWJzY3JpYmVyKG5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgc3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUgPSBmYWxzZTtcbiAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi8gc3luY0Vycm9yVmFsdWU6IGFueSA9IG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi8gc3luY0Vycm9yVGhyb3duOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKiBAaW50ZXJuYWwgKi8gc3luY0Vycm9yVGhyb3dhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGlzU3RvcHBlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgZGVzdGluYXRpb246IFBhcnRpYWxPYnNlcnZlcjxhbnk+IHwgU3Vic2NyaWJlcjxhbnk+OyAvLyB0aGlzIGBhbnlgIGlzIHRoZSBlc2NhcGUgaGF0Y2ggdG8gZXJhc2UgZXh0cmEgdHlwZSBwYXJhbSAoZS5nLiBSKVxuXG4gIHByaXZhdGUgX3BhcmVudFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBbZGVzdGluYXRpb25Pck5leHRdIEEgcGFydGlhbGx5XG4gICAqIGRlZmluZWQgT2JzZXJ2ZXIgb3IgYSBgbmV4dGAgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZTogP2FueSk6IHZvaWR9IFtlcnJvcl0gVGhlIGBlcnJvcmAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBUaGUgYGNvbXBsZXRlYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPGFueT4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgICAgZXJyb3I/OiAoZT86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGlmICghZGVzdGluYXRpb25Pck5leHQpIHtcbiAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRlc3RpbmF0aW9uT3JOZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChkZXN0aW5hdGlvbk9yTmV4dCBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gZGVzdGluYXRpb25Pck5leHQuc3luY0Vycm9yVGhyb3dhYmxlO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uT3JOZXh0O1xuICAgICAgICAgICAgZGVzdGluYXRpb25Pck5leHQuYWRkKHRoaXMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyPFQ+KHRoaXMsIDxQYXJ0aWFsT2JzZXJ2ZXI8YW55Pj4gZGVzdGluYXRpb25Pck5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyPFQ+KHRoaXMsIDwoKHZhbHVlOiBUKSA9PiB2b2lkKT4gZGVzdGluYXRpb25Pck5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFjayB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgb2YgdHlwZSBgbmV4dGAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZSwgd2l0aCBhIHZhbHVlLiBUaGUgT2JzZXJ2YWJsZSBtYXkgY2FsbCB0aGlzIG1ldGhvZCAwIG9yIG1vcmVcbiAgICogdGltZXMuXG4gICAqIEBwYXJhbSB7VH0gW3ZhbHVlXSBUaGUgYG5leHRgIHZhbHVlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgbmV4dCh2YWx1ZT86IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYGVycm9yYCBmcm9tXG4gICAqIHRoZSBPYnNlcnZhYmxlLCB3aXRoIGFuIGF0dGFjaGVkIGBFcnJvcmAuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0XG4gICAqIHRoZSBPYnNlcnZhYmxlIGhhcyBleHBlcmllbmNlZCBhbiBlcnJvciBjb25kaXRpb24uXG4gICAqIEBwYXJhbSB7YW55fSBbZXJyXSBUaGUgYGVycm9yYCBleGNlcHRpb24uXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBlcnJvcihlcnI/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLl9lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFjayB0byByZWNlaXZlIGEgdmFsdWVsZXNzIG5vdGlmaWNhdGlvbiBvZiB0eXBlXG4gICAqIGBjb21wbGV0ZWAgZnJvbSB0aGUgT2JzZXJ2YWJsZS4gTm90aWZpZXMgdGhlIE9ic2VydmVyIHRoYXQgdGhlIE9ic2VydmFibGVcbiAgICogaGFzIGZpbmlzaGVkIHNlbmRpbmcgcHVzaC1iYXNlZCBub3RpZmljYXRpb25zLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICB1bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTogU3Vic2NyaWJlcjxUPiB7XG4gICAgY29uc3QgeyBfcGFyZW50LCBfcGFyZW50cyB9ID0gdGhpcztcbiAgICB0aGlzLl9wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudHMgPSBudWxsO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGFyZW50ID0gX3BhcmVudDtcbiAgICB0aGlzLl9wYXJlbnRzID0gX3BhcmVudHM7XG4gICAgdGhpcy5fcGFyZW50U3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFNhZmVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcmVudFN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgbmV4dDogKCh2YWx1ZTogVCkgPT4gdm9pZCk7XG4gICAgbGV0IGNvbnRleHQ6IGFueSA9IHRoaXM7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkpIHtcbiAgICAgIG5leHQgPSAoPCgodmFsdWU6IFQpID0+IHZvaWQpPiBvYnNlcnZlck9yTmV4dCk7XG4gICAgfSBlbHNlIGlmIChvYnNlcnZlck9yTmV4dCkge1xuICAgICAgbmV4dCA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkubmV4dDtcbiAgICAgIGVycm9yID0gKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+IG9ic2VydmVyT3JOZXh0KS5lcnJvcjtcbiAgICAgIGNvbXBsZXRlID0gKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+IG9ic2VydmVyT3JOZXh0KS5jb21wbGV0ZTtcbiAgICAgIGlmIChvYnNlcnZlck9yTmV4dCAhPT0gZW1wdHlPYnNlcnZlcikge1xuICAgICAgICBjb250ZXh0ID0gT2JqZWN0LmNyZWF0ZShvYnNlcnZlck9yTmV4dCk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQudW5zdWJzY3JpYmUpKSB7XG4gICAgICAgICAgdGhpcy5hZGQoPCgpID0+IHZvaWQ+IGNvbnRleHQudW5zdWJzY3JpYmUuYmluZChjb250ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC51bnN1YnNjcmliZSA9IHRoaXMudW5zdWJzY3JpYmUuYmluZCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLl9uZXh0ID0gbmV4dDtcbiAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogVCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQgJiYgdGhpcy5fbmV4dCkge1xuICAgICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9uZXh0LCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX190cnlPclNldEVycm9yKF9wYXJlbnRTdWJzY3JpYmVyLCB0aGlzLl9uZXh0LCB2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycj86IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBjb25zdCB7IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfSA9IGNvbmZpZztcbiAgICAgIGlmICh0aGlzLl9lcnJvcikge1xuICAgICAgICBpZiAoIXVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgIHRoaXMuX190cnlPclVuc3ViKHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgdGhpcy5fZXJyb3IsIGVycik7XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgICAgX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVmFsdWUgPSBlcnI7XG4gICAgICAgICAgX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICAgIGlmICh0aGlzLl9jb21wbGV0ZSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkQ29tcGxldGUgPSAoKSA9PiB0aGlzLl9jb21wbGV0ZS5jYWxsKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgfHwgIV9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICAgIHRoaXMuX190cnlPclVuc3ViKHdyYXBwZWRDb21wbGV0ZSk7XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX190cnlPclNldEVycm9yKF9wYXJlbnRTdWJzY3JpYmVyLCB3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX190cnlPclVuc3ViKGZuOiBGdW5jdGlvbiwgdmFsdWU/OiBhbnkpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgZm4uY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfX3RyeU9yU2V0RXJyb3IocGFyZW50OiBTdWJzY3JpYmVyPFQ+LCBmbjogRnVuY3Rpb24sIHZhbHVlPzogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCFjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgY2FsbCcpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgZm4uY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgcGFyZW50LnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICBwYXJlbnQuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IF9wYXJlbnRTdWJzY3JpYmVyIH0gPSB0aGlzO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudFN1YnNjcmliZXIgPSBudWxsO1xuICAgIF9wYXJlbnRTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIEVycm9yT2JzZXJ2ZXIgaXMgY2xvc2VkIG9yIHN0b3BwZWQgb3IgaGFzIGFcbiAqIGRlc3RpbmF0aW9uIHRoYXQgaXMgY2xvc2VkIG9yIHN0b3BwZWQgLSBpbiB3aGljaCBjYXNlIGVycm9ycyB3aWxsXG4gKiBuZWVkIHRvIGJlIHJlcG9ydGVkIHZpYSBhIGRpZmZlcmVudCBtZWNoYW5pc20uXG4gKiBAcGFyYW0gb2JzZXJ2ZXIgdGhlIG9ic2VydmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXBvcnRFcnJvcihvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+IHwgU3ViamVjdDxhbnk+KTogYm9vbGVhbiB7XG4gIHdoaWxlIChvYnNlcnZlcikge1xuICAgIGNvbnN0IHsgY2xvc2VkLCBkZXN0aW5hdGlvbiwgaXNTdG9wcGVkIH0gPSBvYnNlcnZlciBhcyBhbnk7XG4gICAgaWYgKGNsb3NlZCB8fCBpc1N0b3BwZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uIGluc3RhbmNlb2YgU3Vic2NyaWJlcikge1xuICAgICAgb2JzZXJ2ZXIgPSBkZXN0aW5hdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9zeW1ib2wvcnhTdWJzY3JpYmVyJztcbmltcG9ydCB7IGVtcHR5IGFzIGVtcHR5T2JzZXJ2ZXIgfSBmcm9tICcuLi9PYnNlcnZlcic7XG5pbXBvcnQgeyBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1N1YnNjcmliZXI8VD4oXG4gIG5leHRPck9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsXG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmliZXI8VD4ge1xuXG4gIGlmIChuZXh0T3JPYnNlcnZlcikge1xuICAgIGlmIChuZXh0T3JPYnNlcnZlciBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgIHJldHVybiAoPFN1YnNjcmliZXI8VD4+IG5leHRPck9ic2VydmVyKTtcbiAgICB9XG5cbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXJbcnhTdWJzY3JpYmVyU3ltYm9sXSkge1xuICAgICAgcmV0dXJuIG5leHRPck9ic2VydmVyW3J4U3Vic2NyaWJlclN5bWJvbF0oKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIW5leHRPck9ic2VydmVyICYmICFlcnJvciAmJiAhY29tcGxldGUpIHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmliZXIoZW1wdHlPYnNlcnZlcik7XG4gIH1cblxuICByZXR1cm4gbmV3IFN1YnNjcmliZXIobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG59XG4iLCJpbXBvcnQgeyByb290IH0gZnJvbSAnLi4vdXRpbC9yb290JztcblxuLyoqIFN5bWJvbC5vYnNlcnZhYmxlIGFkZGl0aW9uICovXG4vKiBOb3RlOiBUaGlzIHdpbGwgYWRkIFN5bWJvbC5vYnNlcnZhYmxlIGdsb2JhbGx5IGZvciBhbGwgVHlwZVNjcmlwdCB1c2VycyxcbiAgaG93ZXZlciwgd2UgYXJlIG5vIGxvbmdlciBwb2x5ZmlsbGluZyBTeW1ib2wub2JzZXJ2YWJsZSAqL1xuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgU3ltYm9sQ29uc3RydWN0b3Ige1xuICAgIHJlYWRvbmx5IG9ic2VydmFibGU6IHN5bWJvbDtcbiAgfVxufVxuXG4vKiogU3ltYm9sLm9ic2VydmFibGUgb3IgYSBzdHJpbmcgXCJAQG9ic2VydmFibGVcIi4gVXNlZCBmb3IgaW50ZXJvcCAqL1xuZXhwb3J0IGNvbnN0IG9ic2VydmFibGUgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xuIiwiLyogdHNsaW50OmRpc2FibGU6bm8tZW1wdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyB9XG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi9ub29wJztcbmltcG9ydCB7IFVuYXJ5RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VD4oKTogVW5hcnlGdW5jdGlvbjxULCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEE+KGZuMTogVW5hcnlGdW5jdGlvbjxULCBBPik6IFVuYXJ5RnVuY3Rpb248VCwgQT47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPik6IFVuYXJ5RnVuY3Rpb248VCwgQj47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+KTogVW5hcnlGdW5jdGlvbjxULCBDPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQ+KGZuMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgZm4yOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBmbjM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIGZuNDogVW5hcnlGdW5jdGlvbjxDLCBEPik6IFVuYXJ5RnVuY3Rpb248VCwgRD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPik6IFVuYXJ5RnVuY3Rpb248VCwgRT47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+KTogVW5hcnlGdW5jdGlvbjxULCBGPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEYsIEc+KGZuMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgZm4yOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBmbjM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIGZuNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgZm41OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBmbjY6IFVuYXJ5RnVuY3Rpb248RSwgRj4sIGZuNzogVW5hcnlGdW5jdGlvbjxGLCBHPik6IFVuYXJ5RnVuY3Rpb248VCwgRz47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIGZuODogVW5hcnlGdW5jdGlvbjxHLCBIPik6IFVuYXJ5RnVuY3Rpb248VCwgSD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBILCBJPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIGZuODogVW5hcnlGdW5jdGlvbjxHLCBIPiwgZm45OiBVbmFyeUZ1bmN0aW9uPEgsIEk+KTogVW5hcnlGdW5jdGlvbjxULCBJPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEYsIEcsIEgsIEk+KGZuMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgZm4yOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBmbjM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIGZuNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgZm41OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBmbjY6IFVuYXJ5RnVuY3Rpb248RSwgRj4sIGZuNzogVW5hcnlGdW5jdGlvbjxGLCBHPiwgZm44OiBVbmFyeUZ1bmN0aW9uPEcsIEg+LCBmbjk6IFVuYXJ5RnVuY3Rpb248SCwgST4sIC4uLmZuczogVW5hcnlGdW5jdGlvbjxhbnksIGFueT5bXSk6IFVuYXJ5RnVuY3Rpb248VCwge30+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBpcGUoLi4uZm5zOiBBcnJheTxVbmFyeUZ1bmN0aW9uPGFueSwgYW55Pj4pOiBVbmFyeUZ1bmN0aW9uPGFueSwgYW55PiB7XG4gIHJldHVybiBwaXBlRnJvbUFycmF5KGZucyk7XG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBwaXBlRnJvbUFycmF5PFQsIFI+KGZuczogQXJyYXk8VW5hcnlGdW5jdGlvbjxULCBSPj4pOiBVbmFyeUZ1bmN0aW9uPFQsIFI+IHtcbiAgaWYgKCFmbnMpIHtcbiAgICByZXR1cm4gbm9vcCBhcyBVbmFyeUZ1bmN0aW9uPGFueSwgYW55PjtcbiAgfVxuXG4gIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGZuc1swXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dDogVCk6IFIge1xuICAgIHJldHVybiBmbnMucmVkdWNlKChwcmV2OiBhbnksIGZuOiBVbmFyeUZ1bmN0aW9uPFQsIFI+KSA9PiBmbihwcmV2KSwgaW5wdXQgYXMgYW55KTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMsIE9wZXJhdG9yRnVuY3Rpb24sIFBhcnRpYWxPYnNlcnZlciwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBjYW5SZXBvcnRFcnJvciB9IGZyb20gJy4vdXRpbC9jYW5SZXBvcnRFcnJvcic7XG5pbXBvcnQgeyB0b1N1YnNjcmliZXIgfSBmcm9tICcuL3V0aWwvdG9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlpZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9paWYnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwaXBlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYW55IHNldCBvZiB2YWx1ZXMgb3ZlciBhbnkgYW1vdW50IG9mIHRpbWUuIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgYnVpbGRpbmcgYmxvY2tcbiAqIG9mIFJ4SlMuXG4gKlxuICogQGNsYXNzIE9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpYmFibGU8VD4ge1xuXG4gIC8qKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UgZGlyZWN0bHkuICovXG4gIHB1YmxpYyBfaXNTY2FsYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIHNvdXJjZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgb3BlcmF0b3I6IE9wZXJhdG9yPGFueSwgVD47XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmUgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIE9ic2VydmFibGUgaXNcbiAgICogaW5pdGlhbGx5IHN1YnNjcmliZWQgdG8uIFRoaXMgZnVuY3Rpb24gaXMgZ2l2ZW4gYSBTdWJzY3JpYmVyLCB0byB3aGljaCBuZXcgdmFsdWVzXG4gICAqIGNhbiBiZSBgbmV4dGBlZCwgb3IgYW4gYGVycm9yYCBtZXRob2QgY2FuIGJlIGNhbGxlZCB0byByYWlzZSBhbiBlcnJvciwgb3JcbiAgICogYGNvbXBsZXRlYCBjYW4gYmUgY2FsbGVkIHRvIG5vdGlmeSBvZiBhIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmliZT86ICh0aGlzOiBPYnNlcnZhYmxlPFQ+LCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiBUZWFyZG93bkxvZ2ljKSB7XG4gICAgaWYgKHN1YnNjcmliZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhBQ0s6IFNpbmNlIFR5cGVTY3JpcHQgaW5oZXJpdHMgc3RhdGljIHByb3BlcnRpZXMgdG9vLCB3ZSBoYXZlIHRvXG4gIC8vIGZpZ2h0IGFnYWluc3QgVHlwZVNjcmlwdCBoZXJlIHNvIFN1YmplY3QgY2FuIGhhdmUgYSBkaWZmZXJlbnQgc3RhdGljIGNyZWF0ZSBzaWduYXR1cmVcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29sZCBPYnNlcnZhYmxlIGJ5IGNhbGxpbmcgdGhlIE9ic2VydmFibGUgY29uc3RydWN0b3JcbiAgICogQHN0YXRpYyB0cnVlXG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZT8gdGhlIHN1YnNjcmliZXIgZnVuY3Rpb24gdG8gYmUgcGFzc2VkIHRvIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IGNvbGQgb2JzZXJ2YWJsZVxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oc3Vic2NyaWJlPzogKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IFRlYXJkb3duTG9naWMpID0+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9ic2VydmFibGUsIHdpdGggdGhpcyBPYnNlcnZhYmxlIGFzIHRoZSBzb3VyY2UsIGFuZCB0aGUgcGFzc2VkXG4gICAqIG9wZXJhdG9yIGRlZmluZWQgYXMgdGhlIG5ldyBvYnNlcnZhYmxlJ3Mgb3BlcmF0b3IuXG4gICAqIEBtZXRob2QgbGlmdFxuICAgKiBAcGFyYW0ge09wZXJhdG9yfSBvcGVyYXRvciB0aGUgb3BlcmF0b3IgZGVmaW5pbmcgdGhlIG9wZXJhdGlvbiB0byB0YWtlIG9uIHRoZSBvYnNlcnZhYmxlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IG9ic2VydmFibGUgd2l0aCB0aGUgT3BlcmF0b3IgYXBwbGllZFxuICAgKi9cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8Uj4oKTtcbiAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgb2JzZXJ2YWJsZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgc3Vic2NyaWJlKG9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+KTogU3Vic2NyaXB0aW9uO1xuICBzdWJzY3JpYmUobmV4dD86ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xuICAvKipcbiAgICogSW52b2tlcyBhbiBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZSBhbmQgcmVnaXN0ZXJzIE9ic2VydmVyIGhhbmRsZXJzIGZvciBub3RpZmljYXRpb25zIGl0IHdpbGwgZW1pdC5cbiAgICpcbiAgICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCB3aGVuIHlvdSBoYXZlIGFsbCB0aGVzZSBPYnNlcnZhYmxlcywgYnV0IHN0aWxsIG5vdGhpbmcgaXMgaGFwcGVuaW5nLjwvc3Bhbj5cbiAgICpcbiAgICogYHN1YnNjcmliZWAgaXMgbm90IGEgcmVndWxhciBvcGVyYXRvciwgYnV0IGEgbWV0aG9kIHRoYXQgY2FsbHMgT2JzZXJ2YWJsZSdzIGludGVybmFsIGBzdWJzY3JpYmVgIGZ1bmN0aW9uLiBJdFxuICAgKiBtaWdodCBiZSBmb3IgZXhhbXBsZSBhIGZ1bmN0aW9uIHRoYXQgeW91IHBhc3NlZCB0byBPYnNlcnZhYmxlJ3MgY29uc3RydWN0b3IsIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIGl0IGlzXG4gICAqIGEgbGlicmFyeSBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggZGVmaW5lcyB3aGF0IHdpbGwgYmUgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlLCBhbmQgd2hlbiBpdCBiZSB3aWxsIGVtaXR0ZWQuIFRoaXMgbWVhbnNcbiAgICogdGhhdCBjYWxsaW5nIGBzdWJzY3JpYmVgIGlzIGFjdHVhbGx5IHRoZSBtb21lbnQgd2hlbiBPYnNlcnZhYmxlIHN0YXJ0cyBpdHMgd29yaywgbm90IHdoZW4gaXQgaXMgY3JlYXRlZCwgYXMgaXQgaXMgb2Z0ZW5cbiAgICogdGhlIHRob3VnaHQuXG4gICAqXG4gICAqIEFwYXJ0IGZyb20gc3RhcnRpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlLCB0aGlzIG1ldGhvZCBhbGxvd3MgeW91IHRvIGxpc3RlbiBmb3IgdmFsdWVzXG4gICAqIHRoYXQgYW4gT2JzZXJ2YWJsZSBlbWl0cywgYXMgd2VsbCBhcyBmb3Igd2hlbiBpdCBjb21wbGV0ZXMgb3IgZXJyb3JzLiBZb3UgY2FuIGFjaGlldmUgdGhpcyBpbiB0d29cbiAgICogb2YgdGhlIGZvbGxvd2luZyB3YXlzLlxuICAgKlxuICAgKiBUaGUgZmlyc3Qgd2F5IGlzIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UuIEl0IHNob3VsZCBoYXZlIG1ldGhvZHNcbiAgICogZGVmaW5lZCBieSB0aGF0IGludGVyZmFjZSwgYnV0IG5vdGUgdGhhdCBpdCBzaG91bGQgYmUganVzdCBhIHJlZ3VsYXIgSmF2YVNjcmlwdCBvYmplY3QsIHdoaWNoIHlvdSBjYW4gY3JlYXRlXG4gICAqIHlvdXJzZWxmIGluIGFueSB3YXkgeW91IHdhbnQgKEVTNiBjbGFzcywgY2xhc3NpYyBmdW5jdGlvbiBjb25zdHJ1Y3Rvciwgb2JqZWN0IGxpdGVyYWwgZXRjLikuIEluIHBhcnRpY3VsYXIgZG9cbiAgICogbm90IGF0dGVtcHQgdG8gdXNlIGFueSBSeEpTIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gY3JlYXRlIE9ic2VydmVycyAtIHlvdSBkb24ndCBuZWVkIHRoZW0uIFJlbWVtYmVyIGFsc29cbiAgICogdGhhdCB5b3VyIG9iamVjdCBkb2VzIG5vdCBoYXZlIHRvIGltcGxlbWVudCBhbGwgbWV0aG9kcy4gSWYgeW91IGZpbmQgeW91cnNlbGYgY3JlYXRpbmcgYSBtZXRob2QgdGhhdCBkb2Vzbid0XG4gICAqIGRvIGFueXRoaW5nLCB5b3UgY2FuIHNpbXBseSBvbWl0IGl0LiBOb3RlIGhvd2V2ZXIsIGlmIHRoZSBgZXJyb3JgIG1ldGhvZCBpcyBub3QgcHJvdmlkZWQsIGFsbCBlcnJvcnMgd2lsbFxuICAgKiBiZSBsZWZ0IHVuY2F1Z2h0LlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIHdheSBpcyB0byBnaXZlIHVwIG9uIE9ic2VydmVyIG9iamVjdCBhbHRvZ2V0aGVyIGFuZCBzaW1wbHkgcHJvdmlkZSBjYWxsYmFjayBmdW5jdGlvbnMgaW4gcGxhY2Ugb2YgaXRzIG1ldGhvZHMuXG4gICAqIFRoaXMgbWVhbnMgeW91IGNhbiBwcm92aWRlIHRocmVlIGZ1bmN0aW9ucyBhcyBhcmd1bWVudHMgdG8gYHN1YnNjcmliZWAsIHdoZXJlIHRoZSBmaXJzdCBmdW5jdGlvbiBpcyBlcXVpdmFsZW50XG4gICAqIG9mIGEgYG5leHRgIG1ldGhvZCwgdGhlIHNlY29uZCBvZiBhbiBgZXJyb3JgIG1ldGhvZCBhbmQgdGhlIHRoaXJkIG9mIGEgYGNvbXBsZXRlYCBtZXRob2QuIEp1c3QgYXMgaW4gY2FzZSBvZiBPYnNlcnZlcixcbiAgICogaWYgeW91IGRvIG5vdCBuZWVkIHRvIGxpc3RlbiBmb3Igc29tZXRoaW5nLCB5b3UgY2FuIG9taXQgYSBmdW5jdGlvbiwgcHJlZmVyYWJseSBieSBwYXNzaW5nIGB1bmRlZmluZWRgIG9yIGBudWxsYCxcbiAgICogc2luY2UgYHN1YnNjcmliZWAgcmVjb2duaXplcyB0aGVzZSBmdW5jdGlvbnMgYnkgd2hlcmUgdGhleSB3ZXJlIHBsYWNlZCBpbiBmdW5jdGlvbiBjYWxsLiBXaGVuIGl0IGNvbWVzXG4gICAqIHRvIGBlcnJvcmAgZnVuY3Rpb24sIGp1c3QgYXMgYmVmb3JlLCBpZiBub3QgcHJvdmlkZWQsIGVycm9ycyBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUgd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIFdoaWNoZXZlciBzdHlsZSBvZiBjYWxsaW5nIGBzdWJzY3JpYmVgIHlvdSB1c2UsIGluIGJvdGggY2FzZXMgaXQgcmV0dXJucyBhIFN1YnNjcmlwdGlvbiBvYmplY3QuXG4gICAqIFRoaXMgb2JqZWN0IGFsbG93cyB5b3UgdG8gY2FsbCBgdW5zdWJzY3JpYmVgIG9uIGl0LCB3aGljaCBpbiB0dXJuIHdpbGwgc3RvcCB0aGUgd29yayB0aGF0IGFuIE9ic2VydmFibGUgZG9lcyBhbmQgd2lsbCBjbGVhblxuICAgKiB1cCBhbGwgcmVzb3VyY2VzIHRoYXQgYW4gT2JzZXJ2YWJsZSB1c2VkLiBOb3RlIHRoYXQgY2FuY2VsbGluZyBhIHN1YnNjcmlwdGlvbiB3aWxsIG5vdCBjYWxsIGBjb21wbGV0ZWAgY2FsbGJhY2tcbiAgICogcHJvdmlkZWQgdG8gYHN1YnNjcmliZWAgZnVuY3Rpb24sIHdoaWNoIGlzIHJlc2VydmVkIGZvciBhIHJlZ3VsYXIgY29tcGxldGlvbiBzaWduYWwgdGhhdCBjb21lcyBmcm9tIGFuIE9ic2VydmFibGUuXG4gICAqXG4gICAqIFJlbWVtYmVyIHRoYXQgY2FsbGJhY2tzIHByb3ZpZGVkIHRvIGBzdWJzY3JpYmVgIGFyZSBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWQgYXN5bmNocm9ub3VzbHkuXG4gICAqIEl0IGlzIGFuIE9ic2VydmFibGUgaXRzZWxmIHRoYXQgZGVjaWRlcyB3aGVuIHRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZC4gRm9yIGV4YW1wbGUge0BsaW5rIG9mfVxuICAgKiBieSBkZWZhdWx0IGVtaXRzIGFsbCBpdHMgdmFsdWVzIHN5bmNocm9ub3VzbHkuIEFsd2F5cyBjaGVjayBkb2N1bWVudGF0aW9uIGZvciBob3cgZ2l2ZW4gT2JzZXJ2YWJsZVxuICAgKiB3aWxsIGJlaGF2ZSB3aGVuIHN1YnNjcmliZWQgYW5kIGlmIGl0cyBkZWZhdWx0IGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCB3aXRoIGEgYHNjaGVkdWxlcmAuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGFuIE9ic2VydmVyXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3VtT2JzZXJ2ZXIgPSB7XG4gICAqICAgc3VtOiAwLFxuICAgKiAgIG5leHQodmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICB0aGlzLnN1bSA9IHRoaXMuc3VtICsgdmFsdWU7XG4gICAqICAgfSxcbiAgICogICBlcnJvcigpIHsgLy8gV2UgYWN0dWFsbHkgY291bGQganVzdCByZW1vdmUgdGhpcyBtZXRob2QsXG4gICAqICAgfSwgICAgICAgIC8vIHNpbmNlIHdlIGRvIG5vdCByZWFsbHkgY2FyZSBhYm91dCBlcnJvcnMgcmlnaHQgbm93LlxuICAgKiAgIGNvbXBsZXRlKCkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1N1bSBlcXVhbHM6ICcgKyB0aGlzLnN1bSk7XG4gICAqICAgfVxuICAgKiB9O1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpIC8vIFN5bmNocm9ub3VzbHkgZW1pdHMgMSwgMiwgMyBhbmQgdGhlbiBjb21wbGV0ZXMuXG4gICAqIC5zdWJzY3JpYmUoc3VtT2JzZXJ2ZXIpO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcIkFkZGluZzogMVwiXG4gICAqIC8vIFwiQWRkaW5nOiAyXCJcbiAgICogLy8gXCJBZGRpbmc6IDNcIlxuICAgKiAvLyBcIlN1bSBlcXVhbHM6IDZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGZ1bmN0aW9uc1xuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGxldCBzdW0gPSAwO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpXG4gICAqIC5zdWJzY3JpYmUoXG4gICAqICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICBzdW0gPSBzdW0gKyB2YWx1ZTtcbiAgICogICB9LFxuICAgKiAgIHVuZGVmaW5lZCxcbiAgICogICBmdW5jdGlvbigpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdTdW0gZXF1YWxzOiAnICsgc3VtKTtcbiAgICogICB9XG4gICAqICk7XG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIFwiQWRkaW5nOiAxXCJcbiAgICogLy8gXCJBZGRpbmc6IDJcIlxuICAgKiAvLyBcIkFkZGluZzogM1wiXG4gICAqIC8vIFwiU3VtIGVxdWFsczogNlwiXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgQ2FuY2VsIGEgc3Vic2NyaXB0aW9uXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3Vic2NyaXB0aW9uID0gUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDAwKS5zdWJzY3JpYmUoXG4gICAqICAgbnVtID0+IGNvbnNvbGUubG9nKG51bSksXG4gICAqICAgdW5kZWZpbmVkLFxuICAgKiAgICgpID0+IGNvbnNvbGUubG9nKCdjb21wbGV0ZWQhJykgLy8gV2lsbCBub3QgYmUgY2FsbGVkLCBldmVuXG4gICAqICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGNhbmNlbGxpbmcgc3Vic2NyaXB0aW9uXG4gICAqXG4gICAqXG4gICAqIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgKiAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgKiAgIGNvbnNvbGUubG9nKCd1bnN1YnNjcmliZWQhJyk7XG4gICAqIH0sIDI1MDApO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyAwIGFmdGVyIDFzXG4gICAqIC8vIDEgYWZ0ZXIgMnNcbiAgICogLy8gXCJ1bnN1YnNjcmliZWQhXCIgYWZ0ZXIgMi41c1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtPYnNlcnZlcnxGdW5jdGlvbn0gb2JzZXJ2ZXJPck5leHQgKG9wdGlvbmFsKSBFaXRoZXIgYW4gb2JzZXJ2ZXIgd2l0aCBtZXRob2RzIHRvIGJlIGNhbGxlZCxcbiAgICogIG9yIHRoZSBmaXJzdCBvZiB0aHJlZSBwb3NzaWJsZSBoYW5kbGVycywgd2hpY2ggaXMgdGhlIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBmcm9tIHRoZSBzdWJzY3JpYmVkXG4gICAqICBPYnNlcnZhYmxlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcnJvciAob3B0aW9uYWwpIEEgaGFuZGxlciBmb3IgYSB0ZXJtaW5hbCBldmVudCByZXN1bHRpbmcgZnJvbSBhbiBlcnJvci4gSWYgbm8gZXJyb3IgaGFuZGxlciBpcyBwcm92aWRlZCxcbiAgICogIHRoZSBlcnJvciB3aWxsIGJlIHRocm93biBhcyB1bmhhbmRsZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBsZXRlIChvcHRpb25hbCkgQSBoYW5kbGVyIGZvciBhIHRlcm1pbmFsIGV2ZW50IHJlc3VsdGluZyBmcm9tIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICogQHJldHVybiB7SVN1YnNjcmlwdGlvbn0gYSBzdWJzY3JpcHRpb24gcmVmZXJlbmNlIHRvIHRoZSByZWdpc3RlcmVkIGhhbmRsZXJzXG4gICAqIEBtZXRob2Qgc3Vic2NyaWJlXG4gICAqL1xuICBzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQ/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpcHRpb24ge1xuXG4gICAgY29uc3QgeyBvcGVyYXRvciB9ID0gdGhpcztcbiAgICBjb25zdCBzaW5rID0gdG9TdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuXG4gICAgaWYgKG9wZXJhdG9yKSB7XG4gICAgICBvcGVyYXRvci5jYWxsKHNpbmssIHRoaXMuc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2luay5hZGQoXG4gICAgICAgIHRoaXMuc291cmNlIHx8IChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZyAmJiAhc2luay5zeW5jRXJyb3JUaHJvd2FibGUpID9cbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKHNpbmspIDpcbiAgICAgICAgdGhpcy5fdHJ5U3Vic2NyaWJlKHNpbmspXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgaWYgKHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93bikge1xuICAgICAgICAgIHRocm93IHNpbmsuc3luY0Vycm9yVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2luaztcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3RyeVN1YnNjcmliZShzaW5rOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoc2luayk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgc2luay5zeW5jRXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICBzaW5rLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgfVxuICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHNpbmspKSB7XG4gICAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGZvckVhY2hcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dCBhIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcGFyYW0ge1Byb21pc2VDb25zdHJ1Y3Rvcn0gW3Byb21pc2VDdG9yXSBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIFByb21pc2VcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgZWl0aGVyIHJlc29sdmVzIG9uIG9ic2VydmFibGUgY29tcGxldGlvbiBvclxuICAgKiAgcmVqZWN0cyB3aXRoIHRoZSBoYW5kbGVkIGVycm9yXG4gICAqL1xuICBmb3JFYWNoKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcHJvbWlzZUN0b3I/OiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG5cbiAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE11c3QgYmUgZGVjbGFyZWQgaW4gYSBzZXBhcmF0ZSBzdGF0ZW1lbnQgdG8gYXZvaWQgYSBSZWZlcm5jZUVycm9yIHdoZW5cbiAgICAgIC8vIGFjY2Vzc2luZyBzdWJzY3JpcHRpb24gYmVsb3cgaW4gdGhlIGNsb3N1cmUgZHVlIHRvIFRlbXBvcmFsIERlYWQgWm9uZS5cbiAgICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSkgYXMgUHJvbWlzZTx2b2lkPjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgcmV0dXJuIHNvdXJjZSAmJiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgLy8gYGlmYCBhbmQgYHRocm93YCBhcmUgc3BlY2lhbCBzbm93IGZsYWtlcywgdGhlIGNvbXBpbGVyIHNlZXMgdGhlbSBhcyByZXNlcnZlZCB3b3Jkcy4gRGVwcmVjYXRlZCBpblxuICAvLyBmYXZvciBvZiBpaWYgYW5kIHRocm93RXJyb3IgZnVuY3Rpb25zLlxuICAvKipcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgSW4gZmF2b3Igb2YgaWlmIGNyZWF0aW9uIGZ1bmN0aW9uOiBpbXBvcnQgeyBpaWYgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyBpZjogdHlwZW9mIGlpZjtcbiAgLyoqXG4gICAqIEBub2NvbGxhcHNlXG4gICAqIEBkZXByZWNhdGVkIEluIGZhdm9yIG9mIHRocm93RXJyb3IgY3JlYXRpb24gZnVuY3Rpb246IGltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyB0aHJvdzogdHlwZW9mIHRocm93RXJyb3I7XG5cbiAgLyoqXG4gICAqIEFuIGludGVyb3AgcG9pbnQgZGVmaW5lZCBieSB0aGUgZXM3LW9ic2VydmFibGUgc3BlYyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1vYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgU3ltYm9sLm9ic2VydmFibGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhpcyBpbnN0YW5jZSBvZiB0aGUgb2JzZXJ2YWJsZVxuICAgKi9cbiAgW1N5bWJvbF9vYnNlcnZhYmxlXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICBwaXBlKCk6IE9ic2VydmFibGU8VD47XG4gIHBpcGU8QT4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+KTogT2JzZXJ2YWJsZTxBPjtcbiAgcGlwZTxBLCBCPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPik6IE9ic2VydmFibGU8Qj47XG4gIHBpcGU8QSwgQiwgQz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPik6IE9ic2VydmFibGU8Qz47XG4gIHBpcGU8QSwgQiwgQywgRD4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+KTogT2JzZXJ2YWJsZTxEPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPik6IE9ic2VydmFibGU8RT47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRj4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPik6IE9ic2VydmFibGU8Rj47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+KTogT2JzZXJ2YWJsZTxHPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4sIG9wODogT3BlcmF0b3JGdW5jdGlvbjxHLCBIPik6IE9ic2VydmFibGU8SD47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPik6IE9ic2VydmFibGU8ST47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPiwgLi4ub3BlcmF0aW9uczogT3BlcmF0b3JGdW5jdGlvbjxhbnksIGFueT5bXSk6IE9ic2VydmFibGU8e30+O1xuICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN0aXRjaCB0b2dldGhlciBmdW5jdGlvbmFsIG9wZXJhdG9ycyBpbnRvIGEgY2hhaW4uXG4gICAqIEBtZXRob2QgcGlwZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSB0aGUgT2JzZXJ2YWJsZSByZXN1bHQgb2YgYWxsIG9mIHRoZSBvcGVyYXRvcnMgaGF2aW5nXG4gICAqIGJlZW4gY2FsbGVkIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgcGFzc2VkIGluLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGltcG9ydCB7IG1hcCwgZmlsdGVyLCBzY2FuIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMDApXG4gICAqICAgLnBpcGUoXG4gICAqICAgICBmaWx0ZXIoeCA9PiB4ICUgMiA9PT0gMCksXG4gICAqICAgICBtYXAoeCA9PiB4ICsgeCksXG4gICAqICAgICBzY2FuKChhY2MsIHgpID0+IGFjYyArIHgpXG4gICAqICAgKVxuICAgKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSlcbiAgICogYGBgXG4gICAqL1xuICBwaXBlKC4uLm9wZXJhdGlvbnM6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBhbnk+W10pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMgYXMgYW55O1xuICAgIH1cblxuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KG9wZXJhdGlvbnMpKHRoaXMpO1xuICB9XG5cbiAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+KTogUHJvbWlzZTxUPjtcbiAgdG9Qcm9taXNlPFQ+KHRoaXM6IE9ic2VydmFibGU8VD4sIFByb21pc2VDdG9yOiB0eXBlb2YgUHJvbWlzZSk6IFByb21pc2U8VD47XG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+LCBQcm9taXNlQ3RvcjogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD47XG4gIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbiAgdG9Qcm9taXNlKHByb21pc2VDdG9yPzogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD4ge1xuICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IGFueTtcbiAgICAgIHRoaXMuc3Vic2NyaWJlKCh4OiBUKSA9PiB2YWx1ZSA9IHgsIChlcnI6IGFueSkgPT4gcmVqZWN0KGVyciksICgpID0+IHJlc29sdmUodmFsdWUpKTtcbiAgICB9KSBhcyBQcm9taXNlPFQ+O1xuICB9XG59XG5cbi8qKlxuICogRGVjaWRlcyBiZXR3ZWVuIGEgcGFzc2VkIHByb21pc2UgY29uc3RydWN0b3IgZnJvbSBjb25zdW1pbmcgY29kZSxcbiAqIEEgZGVmYXVsdCBjb25maWd1cmVkIHByb21pc2UgY29uc3RydWN0b3IsIGFuZCB0aGUgbmF0aXZlIHByb21pc2VcbiAqIGNvbnN0cnVjdG9yIGFuZCByZXR1cm5zIGl0LiBJZiBub3RoaW5nIGNhbiBiZSBmb3VuZCwgaXQgd2lsbCB0aHJvd1xuICogYW4gZXJyb3IuXG4gKiBAcGFyYW0gcHJvbWlzZUN0b3IgVGhlIG9wdGlvbmFsIHByb21pc2UgY29uc3RydWN0b3IgdG8gcGFzc2VkIGJ5IGNvbnN1bWluZyBjb2RlXG4gKi9cbmZ1bmN0aW9uIGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yOiBQcm9taXNlQ29uc3RydWN0b3JMaWtlIHwgdW5kZWZpbmVkKSB7XG4gIGlmICghcHJvbWlzZUN0b3IpIHtcbiAgICBwcm9taXNlQ3RvciA9IGNvbmZpZy5Qcm9taXNlIHx8IFByb21pc2U7XG4gIH1cblxuICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBQcm9taXNlIGltcGwgZm91bmQnKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlQ3Rvcjtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JDdG9yIHtcbiAgbmV3KCk6IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yO1xufVxuXG5mdW5jdGlvbiBPYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGwodGhpczogYW55KSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9ICdvYmplY3QgdW5zdWJzY3JpYmVkJztcbiAgdGhpcy5uYW1lID0gJ09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbiAgcmV0dXJuIHRoaXM7XG59XG5cbk9iamVjdFVuc3Vic2NyaWJlZEVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gYW4gYWN0aW9uIGlzIGludmFsaWQgYmVjYXVzZSB0aGUgb2JqZWN0IGhhcyBiZWVuXG4gKiB1bnN1YnNjcmliZWQuXG4gKlxuICogQHNlZSB7QGxpbmsgU3ViamVjdH1cbiAqIEBzZWUge0BsaW5rIEJlaGF2aW9yU3ViamVjdH1cbiAqXG4gKiBAY2xhc3MgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JcbiAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yOiBPYmplY3RVbnN1YnNjcmliZWRFcnJvckN0b3IgPSBPYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGwgYXMgYW55OyIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaXB0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN1YmplY3Q6IFN1YmplY3Q8VD4sIHB1YmxpYyBzdWJzY3JpYmVyOiBPYnNlcnZlcjxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5zdWJqZWN0O1xuICAgIGNvbnN0IG9ic2VydmVycyA9IHN1YmplY3Qub2JzZXJ2ZXJzO1xuXG4gICAgdGhpcy5zdWJqZWN0ID0gbnVsbDtcblxuICAgIGlmICghb2JzZXJ2ZXJzIHx8IG9ic2VydmVycy5sZW5ndGggPT09IDAgfHwgc3ViamVjdC5pc1N0b3BwZWQgfHwgc3ViamVjdC5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmVySW5kZXggPSBvYnNlcnZlcnMuaW5kZXhPZih0aGlzLnN1YnNjcmliZXIpO1xuXG4gICAgaWYgKHN1YnNjcmliZXJJbmRleCAhPT0gLTEpIHtcbiAgICAgIG9ic2VydmVycy5zcGxpY2Uoc3Vic2NyaWJlckluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIFN1YnNjcmlwdGlvbkxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YmplY3RTdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuXG4vKipcbiAqIEBjbGFzcyBTdWJqZWN0U3Vic2NyaWJlcjxUPlxuICovXG5leHBvcnQgY2xhc3MgU3ViamVjdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBTdWJqZWN0PFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG59XG5cbi8qKlxuICogQSBTdWJqZWN0IGlzIGEgc3BlY2lhbCB0eXBlIG9mIE9ic2VydmFibGUgdGhhdCBhbGxvd3MgdmFsdWVzIHRvIGJlXG4gKiBtdWx0aWNhc3RlZCB0byBtYW55IE9ic2VydmFibGVzLiBTdWJqZWN0cyBhcmUgbGlrZSBFdmVudEVtaXR0ZXJzLlxuICpcbiAqIEV2ZXJ5IFN1YmplY3QgaXMgYW4gT2JzZXJ2YWJsZSBhbmQgYW4gT2JzZXJ2ZXIuIFlvdSBjYW4gc3Vic2NyaWJlIHRvIGFcbiAqIFN1YmplY3QsIGFuZCB5b3UgY2FuIGNhbGwgbmV4dCB0byBmZWVkIHZhbHVlcyBhcyB3ZWxsIGFzIGVycm9yIGFuZCBjb21wbGV0ZS5cbiAqXG4gKiBAY2xhc3MgU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgU3ViamVjdDxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcblxuICBbcnhTdWJzY3JpYmVyU3ltYm9sXSgpIHtcbiAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpYmVyKHRoaXMpO1xuICB9XG5cbiAgb2JzZXJ2ZXJzOiBPYnNlcnZlcjxUPltdID0gW107XG5cbiAgY2xvc2VkID0gZmFsc2U7XG5cbiAgaXNTdG9wcGVkID0gZmFsc2U7XG5cbiAgaGFzRXJyb3IgPSBmYWxzZTtcblxuICB0aHJvd25FcnJvcjogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oZGVzdGluYXRpb246IE9ic2VydmVyPFQ+LCBzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBBbm9ueW1vdXNTdWJqZWN0PFQ+ID0+IHtcbiAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3Q8VD4oZGVzdGluYXRpb24sIHNvdXJjZSk7XG4gIH1cblxuICBsaWZ0PFI+KG9wZXJhdG9yOiBPcGVyYXRvcjxULCBSPik6IE9ic2VydmFibGU8Uj4ge1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQW5vbnltb3VzU3ViamVjdCh0aGlzLCB0aGlzKTtcbiAgICBzdWJqZWN0Lm9wZXJhdG9yID0gPGFueT5vcGVyYXRvcjtcbiAgICByZXR1cm4gPGFueT5zdWJqZWN0O1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IFQpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvcHlbaV0ubmV4dCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnRocm93bkVycm9yID0gZXJyO1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgIGNvbnN0IGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb3B5W2ldLmVycm9yKGVycik7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICBjb21wbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH1cbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29weVtpXS5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLm9ic2VydmVycyA9IG51bGw7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFRlYXJkb3duTG9naWMge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5fdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcih0aGlzLnRocm93bkVycm9yKTtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgIHJldHVybiBuZXcgU3ViamVjdFN1YnNjcmlwdGlvbih0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlIHdpdGggdGhpcyBTdWJqZWN0IGFzIHRoZSBzb3VyY2UuIFlvdSBjYW4gZG8gdGhpc1xuICAgKiB0byBjcmVhdGUgY3VzdG9taXplIE9ic2VydmVyLXNpZGUgbG9naWMgb2YgdGhlIFN1YmplY3QgYW5kIGNvbmNlYWwgaXQgZnJvbVxuICAgKiBjb2RlIHRoYXQgdXNlcyB0aGUgT2JzZXJ2YWJsZS5cbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gT2JzZXJ2YWJsZSB0aGF0IHRoZSBTdWJqZWN0IGNhc3RzIHRvXG4gICAqL1xuICBhc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFQ+KCk7XG4gICAgKDxhbnk+b2JzZXJ2YWJsZSkuc291cmNlID0gdGhpcztcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBbm9ueW1vdXNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBbm9ueW1vdXNTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbj86IE9ic2VydmVyPFQ+LCBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5uZXh0KSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmVycm9yKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24uY29tcGxldGUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZkNvdW50PFQ+KCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiByZWZDb3VudE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFJlZkNvdW50T3BlcmF0b3Ioc291cmNlKSk7XG4gIH0gYXMgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xufVxuXG5jbGFzcyBSZWZDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50Kys7XG5cbiAgICBjb25zdCByZWZDb3VudGVyID0gbmV3IFJlZkNvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCBjb25uZWN0YWJsZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShyZWZDb3VudGVyKTtcblxuICAgIGlmICghcmVmQ291bnRlci5jbG9zZWQpIHtcbiAgICAgICg8YW55PiByZWZDb3VudGVyKS5jb25uZWN0aW9uID0gY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgIGlmICghY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgY29uc3QgcmVmQ291bnQgPSAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudDtcbiAgICBpZiAocmVmQ291bnQgPD0gMCkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCA9IHJlZkNvdW50IC0gMTtcbiAgICBpZiAocmVmQ291bnQgPiAxKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vL1xuICAgIC8vIENvbXBhcmUgdGhlIGxvY2FsIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHRvIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIG9uIHRoZSBzaGFyZWQgQ29ubmVjdGFibGVPYnNlcnZhYmxlLiBJbiBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUgc291cmNlIHN5bmNocm9ub3VzbHkgZW1pdHMgdmFsdWVzLCBhbmRcbiAgICAvLyB0aGUgUmVmQ291bnRTdWJzY3JpYmVyJ3MgZG93bnN0cmVhbSBPYnNlcnZlcnMgc3luY2hyb25vdXNseSB1bnN1YnNjcmliZSxcbiAgICAvLyBleGVjdXRpb24gY29udGludWVzIHRvIGhlcmUgYmVmb3JlIHRoZSBSZWZDb3VudE9wZXJhdG9yIGhhcyBhIGNoYW5jZSB0b1xuICAgIC8vIHN1cHBseSB0aGUgUmVmQ291bnRTdWJzY3JpYmVyIHdpdGggdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbi5cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByYW5nZSgwLCAxMCkucGlwZShcbiAgICAvLyAgIHB1Ymxpc2goKSxcbiAgICAvLyAgIHJlZkNvdW50KCksXG4gICAgLy8gICB0YWtlKDUpLFxuICAgIC8vIClcbiAgICAvLyAuc3Vic2NyaWJlKCk7XG4gICAgLy8gYGBgXG4gICAgLy8gSW4gb3JkZXIgdG8gYWNjb3VudCBmb3IgdGhpcyBjYXNlLCBSZWZDb3VudFN1YnNjcmliZXIgc2hvdWxkIG9ubHkgZGlzcG9zZVxuICAgIC8vIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUncyBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gaWYgdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gZXhpc3RzLCAqYW5kKiBlaXRoZXI6XG4gICAgLy8gICBhLiBSZWZDb3VudFN1YnNjcmliZXIgZG9lc24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvblxuICAgIC8vICAgICAgU3Vic2NyaXB0aW9uIHlldCwgb3IsXG4gICAgLy8gICBiLiBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiByZWZlcmVuY2UgaXMgaWRlbnRpY2FsXG4gICAgLy8gICAgICB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uXG4gICAgLy8vXG4gICAgY29uc3QgeyBjb25uZWN0aW9uIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNoYXJlZENvbm5lY3Rpb24gPSAoPGFueT4gY29ubmVjdGFibGUpLl9jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAoc2hhcmVkQ29ubmVjdGlvbiAmJiAoIWNvbm5lY3Rpb24gfHwgc2hhcmVkQ29ubmVjdGlvbiA9PT0gY29ubmVjdGlvbikpIHtcbiAgICAgIHNoYXJlZENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QsIFN1YmplY3RTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgcmVmQ291bnQgYXMgaGlnaGVyT3JkZXJSZWZDb3VudCB9IGZyb20gJy4uL29wZXJhdG9ycy9yZWZDb3VudCc7XG5cbi8qKlxuICogQGNsYXNzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPlxuICovXG5leHBvcnQgY2xhc3MgQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG5cbiAgcHJvdGVjdGVkIF9zdWJqZWN0OiBTdWJqZWN0PFQ+O1xuICBwcm90ZWN0ZWQgX3JlZkNvdW50OiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgX2Nvbm5lY3Rpb246IFN1YnNjcmlwdGlvbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaXNDb21wbGV0ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBzdWJqZWN0RmFjdG9yeTogKCkgPT4gU3ViamVjdDxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIHJldHVybiB0aGlzLmdldFN1YmplY3QoKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0U3ViamVjdCgpOiBTdWJqZWN0PFQ+IHtcbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5fc3ViamVjdDtcbiAgICBpZiAoIXN1YmplY3QgfHwgc3ViamVjdC5pc1N0b3BwZWQpIHtcbiAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLnN1YmplY3RGYWN0b3J5KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zdWJqZWN0O1xuICB9XG5cbiAgY29ubmVjdCgpOiBTdWJzY3JpcHRpb24ge1xuICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbjtcbiAgICBpZiAoIWNvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuX2lzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgIGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgY29ubmVjdGlvbi5hZGQodGhpcy5zb3VyY2VcbiAgICAgICAgLnN1YnNjcmliZShuZXcgQ29ubmVjdGFibGVTdWJzY3JpYmVyKHRoaXMuZ2V0U3ViamVjdCgpLCB0aGlzKSkpO1xuICAgICAgaWYgKGNvbm5lY3Rpb24uY2xvc2VkKSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBjb25uZWN0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25uZWN0aW9uO1xuICB9XG5cbiAgcmVmQ291bnQoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIGhpZ2hlck9yZGVyUmVmQ291bnQoKSh0aGlzKSBhcyBPYnNlcnZhYmxlPFQ+O1xuICB9XG59XG5cbmNvbnN0IGNvbm5lY3RhYmxlUHJvdG8gPSA8YW55PkNvbm5lY3RhYmxlT2JzZXJ2YWJsZS5wcm90b3R5cGU7XG5cbmV4cG9ydCBjb25zdCBjb25uZWN0YWJsZU9ic2VydmFibGVEZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3JNYXAgPSB7XG4gIG9wZXJhdG9yOiB7IHZhbHVlOiBudWxsIH0sXG4gIF9yZWZDb3VudDogeyB2YWx1ZTogMCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX3N1YmplY3Q6IHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9jb25uZWN0aW9uOiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfc3Vic2NyaWJlOiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLl9zdWJzY3JpYmUgfSxcbiAgX2lzQ29tcGxldGU6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uX2lzQ29tcGxldGUsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIGdldFN1YmplY3Q6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uZ2V0U3ViamVjdCB9LFxuICBjb25uZWN0OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLmNvbm5lY3QgfSxcbiAgcmVmQ291bnQ6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8ucmVmQ291bnQgfVxufTtcblxuY2xhc3MgQ29ubmVjdGFibGVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3ViamVjdFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb25uZWN0YWJsZS5faXNDb21wbGV0ZSA9IHRydWU7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IGNvbm5lY3RhYmxlID0gPGFueT50aGlzLmNvbm5lY3RhYmxlO1xuICAgIGlmIChjb25uZWN0YWJsZSkge1xuICAgICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgICBjb25zdCBjb25uZWN0aW9uID0gY29ubmVjdGFibGUuX2Nvbm5lY3Rpb247XG4gICAgICBjb25uZWN0YWJsZS5fcmVmQ291bnQgPSAwO1xuICAgICAgY29ubmVjdGFibGUuX3N1YmplY3QgPSBudWxsO1xuICAgICAgY29ubmVjdGFibGUuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgaWYgKGNvbm5lY3Rpb24pIHtcbiAgICAgICAgY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBSZWZDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50Kys7XG5cbiAgICBjb25zdCByZWZDb3VudGVyID0gbmV3IFJlZkNvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCBjb25uZWN0YWJsZSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShyZWZDb3VudGVyKTtcblxuICAgIGlmICghcmVmQ291bnRlci5jbG9zZWQpIHtcbiAgICAgICg8YW55PiByZWZDb3VudGVyKS5jb25uZWN0aW9uID0gY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCB7IGNvbm5lY3RhYmxlIH0gPSB0aGlzO1xuICAgIGlmICghY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0YWJsZSA9IG51bGw7XG4gICAgY29uc3QgcmVmQ291bnQgPSAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudDtcbiAgICBpZiAocmVmQ291bnQgPD0gMCkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCA9IHJlZkNvdW50IC0gMTtcbiAgICBpZiAocmVmQ291bnQgPiAxKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vL1xuICAgIC8vIENvbXBhcmUgdGhlIGxvY2FsIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHRvIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIG9uIHRoZSBzaGFyZWQgQ29ubmVjdGFibGVPYnNlcnZhYmxlLiBJbiBjYXNlc1xuICAgIC8vIHdoZXJlIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUgc291cmNlIHN5bmNocm9ub3VzbHkgZW1pdHMgdmFsdWVzLCBhbmRcbiAgICAvLyB0aGUgUmVmQ291bnRTdWJzY3JpYmVyJ3MgZG93bnN0cmVhbSBPYnNlcnZlcnMgc3luY2hyb25vdXNseSB1bnN1YnNjcmliZSxcbiAgICAvLyBleGVjdXRpb24gY29udGludWVzIHRvIGhlcmUgYmVmb3JlIHRoZSBSZWZDb3VudE9wZXJhdG9yIGhhcyBhIGNoYW5jZSB0b1xuICAgIC8vIHN1cHBseSB0aGUgUmVmQ291bnRTdWJzY3JpYmVyIHdpdGggdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbi5cbiAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAvLyBgYGBcbiAgICAvLyByYW5nZSgwLCAxMCkucGlwZShcbiAgICAvLyAgIHB1Ymxpc2goKSxcbiAgICAvLyAgIHJlZkNvdW50KCksXG4gICAgLy8gICB0YWtlKDUpLFxuICAgIC8vICkuc3Vic2NyaWJlKCk7XG4gICAgLy8gYGBgXG4gICAgLy8gSW4gb3JkZXIgdG8gYWNjb3VudCBmb3IgdGhpcyBjYXNlLCBSZWZDb3VudFN1YnNjcmliZXIgc2hvdWxkIG9ubHkgZGlzcG9zZVxuICAgIC8vIHRoZSBDb25uZWN0YWJsZU9ic2VydmFibGUncyBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gaWYgdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gZXhpc3RzLCAqYW5kKiBlaXRoZXI6XG4gICAgLy8gICBhLiBSZWZDb3VudFN1YnNjcmliZXIgZG9lc24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvblxuICAgIC8vICAgICAgU3Vic2NyaXB0aW9uIHlldCwgb3IsXG4gICAgLy8gICBiLiBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiByZWZlcmVuY2UgaXMgaWRlbnRpY2FsXG4gICAgLy8gICAgICB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uXG4gICAgLy8vXG4gICAgY29uc3QgeyBjb25uZWN0aW9uIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNoYXJlZENvbm5lY3Rpb24gPSAoPGFueT4gY29ubmVjdGFibGUpLl9jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG5cbiAgICBpZiAoc2hhcmVkQ29ubmVjdGlvbiAmJiAoIWNvbm5lY3Rpb24gfHwgc2hhcmVkQ29ubmVjdGlvbiA9PT0gY29ubmVjdGlvbikpIHtcbiAgICAgIHNoYXJlZENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyk6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSz4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yOiB2b2lkLCBkdXJhdGlvblNlbGVjdG9yOiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgVD4pID0+IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgVD4+O1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZWxlbWVudFNlbGVjdG9yPzogKHZhbHVlOiBUKSA9PiBSLCBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LCBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEdyb3VwcyB0aGUgaXRlbXMgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlIGFjY29yZGluZyB0byBhIHNwZWNpZmllZCBjcml0ZXJpb24sXG4gKiBhbmQgZW1pdHMgdGhlc2UgZ3JvdXBlZCBpdGVtcyBhcyBgR3JvdXBlZE9ic2VydmFibGVzYCwgb25lXG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IHBlciBncm91cC5cbiAqXG4gKiAhW10oZ3JvdXBCeS5wbmcpXG4gKlxuICogV2hlbiB0aGUgT2JzZXJ2YWJsZSBlbWl0cyBhbiBpdGVtLCBhIGtleSBpcyBjb21wdXRlZCBmb3IgdGhpcyBpdGVtIHdpdGggdGhlIGtleVNlbGVjdG9yIGZ1bmN0aW9uLlxuICpcbiAqIElmIGEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBmb3IgdGhpcyBrZXkgZXhpc3RzLCB0aGlzIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZW1pdHMuIEVsc2V3aGVyZSwgYSBuZXdcbiAqIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZm9yIHRoaXMga2V5IGlzIGNyZWF0ZWQgYW5kIGVtaXRzLlxuICpcbiAqIEEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSByZXByZXNlbnRzIHZhbHVlcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgcmVwcmVzZW50ZWQgYnkgYSBjb21tb24ga2V5LiBUaGUgY29tbW9uXG4gKiBrZXkgaXMgYXZhaWxhYmxlIGFzIHRoZSBrZXkgZmllbGQgb2YgYSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGluc3RhbmNlLlxuICpcbiAqIFRoZSBlbGVtZW50cyBlbWl0dGVkIGJ5IHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX1zIGFyZSBieSBkZWZhdWx0IHRoZSBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBPYnNlcnZhYmxlLCBvciBlbGVtZW50c1xuICogcmV0dXJuZWQgYnkgdGhlIGVsZW1lbnRTZWxlY3RvciBmdW5jdGlvbi5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEdyb3VwIG9iamVjdHMgYnkgaWQgYW5kIHJldHVybiBhcyBhcnJheVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgbWVyZ2VNYXAsIGdyb3VwQnkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG4gKlxuICogaW50ZXJmYWNlIE9iaiB7XG4gKiAgICBpZDogbnVtYmVyLFxuICogICAgbmFtZTogc3RyaW5nLFxuICogfVxuICpcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3dlYnBhY2snfSxcbiAqICAge2lkOiAxLCBuYW1lOiAndHlwZXNjcmlwdCd9LFxuICogICB7aWQ6IDMsIG5hbWU6ICd0c2xpbnQnfVxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCksXG4gKiAgIG1lcmdlTWFwKChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtdKSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIFsgeyBpZDogMSwgbmFtZTogJ2phdmFzY3JpcHQnfSxcbiAqIC8vICAgeyBpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAyLCBuYW1lOiAncGFyY2VsJ30sXG4gKiAvLyAgIHsgaWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMywgbmFtZTogJ3RzbGludCd9IF1cbiAqIGBgYFxuICpcbiAqICMjIyBQaXZvdCBkYXRhIG9uIHRoZSBpZCBmaWVsZFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgbWVyZ2VNYXAsIGdyb3VwQnksIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcbiAqXG4gKiBvZjxPYmo+KFxuICogICB7aWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfVxuICogICB7aWQ6IDMsIG5hbWU6ICd0c2xpbnQnfVxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCwgcCA9PiBwLm5hbWUpLFxuICogICBtZXJnZU1hcCggKGdyb3VwJCkgPT4gZ3JvdXAkLnBpcGUocmVkdWNlKChhY2MsIGN1cikgPT4gWy4uLmFjYywgY3VyXSwgW1wiXCIgKyBncm91cCQua2V5XSkpKSxcbiAqICAgbWFwKGFyciA9PiAoeydpZCc6IHBhcnNlSW50KGFyclswXSksICd2YWx1ZXMnOiBhcnIuc2xpY2UoMSl9KSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHAgPT4gY29uc29sZS5sb2cocCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBpZDogMSwgdmFsdWVzOiBbICdqYXZhc2NyaXB0JywgJ3R5cGVzY3JpcHQnIF0gfVxuICogLy8geyBpZDogMiwgdmFsdWVzOiBbICdwYXJjZWwnLCAnd2VicGFjaycgXSB9XG4gKiAvLyB7IGlkOiAzLCB2YWx1ZXM6IFsgJ3RzbGludCcgXSB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogS30ga2V5U2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZSBrZXlcbiAqIGZvciBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogUn0gW2VsZW1lbnRTZWxlY3Rvcl0gQSBmdW5jdGlvbiB0aGF0IGV4dHJhY3RzIHRoZVxuICogcmV0dXJuIGVsZW1lbnQgZm9yIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SyxSPik6IE9ic2VydmFibGU8YW55Pn0gW2R1cmF0aW9uU2VsZWN0b3JdXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRvIGRldGVybWluZSBob3cgbG9uZyBlYWNoIGdyb3VwIHNob3VsZFxuICogZXhpc3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPEdyb3VwZWRPYnNlcnZhYmxlPEssUj4+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHNcbiAqIEdyb3VwZWRPYnNlcnZhYmxlcywgZWFjaCBvZiB3aGljaCBjb3JyZXNwb25kcyB0byBhIHVuaXF1ZSBrZXkgdmFsdWUgYW5kIGVhY2hcbiAqIG9mIHdoaWNoIGVtaXRzIHRob3NlIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgc2hhcmUgdGhhdCBrZXlcbiAqIHZhbHVlLlxuICogQG1ldGhvZCBncm91cEJ5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+XG4gICAgc291cmNlLmxpZnQobmV3IEdyb3VwQnlPcGVyYXRvcihrZXlTZWxlY3RvciwgZWxlbWVudFNlbGVjdG9yLCBkdXJhdGlvblNlbGVjdG9yLCBzdWJqZWN0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWZDb3VudFN1YnNjcmlwdGlvbiB7XG4gIGNvdW50OiBudW1iZXI7XG4gIHVuc3Vic2NyaWJlOiAoKSA9PiB2b2lkO1xuICBjbG9zZWQ6IGJvb2xlYW47XG4gIGF0dGVtcHRlZFRvVW5zdWJzY3JpYmU6IGJvb2xlYW47XG59XG5cbmNsYXNzIEdyb3VwQnlPcGVyYXRvcjxULCBLLCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgR3JvdXBCeVN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLmtleVNlbGVjdG9yLCB0aGlzLmVsZW1lbnRTZWxlY3RvciwgdGhpcy5kdXJhdGlvblNlbGVjdG9yLCB0aGlzLnN1YmplY3RTZWxlY3RvclxuICAgICkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBHcm91cEJ5U3Vic2NyaWJlcjxULCBLLCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4gaW1wbGVtZW50cyBSZWZDb3VudFN1YnNjcmlwdGlvbiB7XG4gIHByaXZhdGUgZ3JvdXBzOiBNYXA8SywgU3ViamVjdDxUIHwgUj4+ID0gbnVsbDtcbiAgcHVibGljIGF0dGVtcHRlZFRvVW5zdWJzY3JpYmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGxldCBrZXk6IEs7XG4gICAgdHJ5IHtcbiAgICAgIGtleSA9IHRoaXMua2V5U2VsZWN0b3IodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2dyb3VwKHZhbHVlLCBrZXkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ3JvdXAodmFsdWU6IFQsIGtleTogSykge1xuICAgIGxldCBncm91cHMgPSB0aGlzLmdyb3VwcztcblxuICAgIGlmICghZ3JvdXBzKSB7XG4gICAgICBncm91cHMgPSB0aGlzLmdyb3VwcyA9IG5ldyBNYXA8SywgU3ViamVjdDxUIHwgUj4+KCk7XG4gICAgfVxuXG4gICAgbGV0IGdyb3VwID0gZ3JvdXBzLmdldChrZXkpO1xuXG4gICAgbGV0IGVsZW1lbnQ6IFI7XG4gICAgaWYgKHRoaXMuZWxlbWVudFNlbGVjdG9yKSB7XG4gICAgICB0cnkge1xuICAgICAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50U2VsZWN0b3IodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudCA9IDxhbnk+dmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKCFncm91cCkge1xuICAgICAgZ3JvdXAgPSAodGhpcy5zdWJqZWN0U2VsZWN0b3IgPyB0aGlzLnN1YmplY3RTZWxlY3RvcigpIDogbmV3IFN1YmplY3Q8Uj4oKSkgYXMgU3ViamVjdDxUIHwgUj47XG4gICAgICBncm91cHMuc2V0KGtleSwgZ3JvdXApO1xuICAgICAgY29uc3QgZ3JvdXBlZE9ic2VydmFibGUgPSBuZXcgR3JvdXBlZE9ic2VydmFibGUoa2V5LCBncm91cCwgdGhpcyk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoZ3JvdXBlZE9ic2VydmFibGUpO1xuICAgICAgaWYgKHRoaXMuZHVyYXRpb25TZWxlY3Rvcikge1xuICAgICAgICBsZXQgZHVyYXRpb246IGFueTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb25TZWxlY3RvcihuZXcgR3JvdXBlZE9ic2VydmFibGU8SywgUj4oa2V5LCA8U3ViamVjdDxSPj5ncm91cCkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKGR1cmF0aW9uLnN1YnNjcmliZShuZXcgR3JvdXBEdXJhdGlvblN1YnNjcmliZXIoa2V5LCBncm91cCwgdGhpcykpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwLmNsb3NlZCkge1xuICAgICAgZ3JvdXAubmV4dChlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG4gICAgaWYgKGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLmZvckVhY2goKGdyb3VwLCBrZXkpID0+IHtcbiAgICAgICAgZ3JvdXAuZXJyb3IoZXJyKTtcbiAgICAgIH0pO1xuXG4gICAgICBncm91cHMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdyb3VwcztcbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBncm91cHMuZm9yRWFjaCgoZ3JvdXAsIGtleSkgPT4ge1xuICAgICAgICBncm91cC5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGdyb3Vwcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICByZW1vdmVHcm91cChrZXk6IEspOiB2b2lkIHtcbiAgICB0aGlzLmdyb3Vwcy5kZWxldGUoa2V5KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGlmICghdGhpcy5jbG9zZWQpIHtcbiAgICAgIHRoaXMuYXR0ZW1wdGVkVG9VbnN1YnNjcmliZSA9IHRydWU7XG4gICAgICBpZiAodGhpcy5jb3VudCA9PT0gMCkge1xuICAgICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgR3JvdXBEdXJhdGlvblN1YnNjcmliZXI8SywgVD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXk6IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZ3JvdXA6IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcGFyZW50OiBHcm91cEJ5U3Vic2NyaWJlcjxhbnksIEssIFQgfCBhbnk+KSB7XG4gICAgc3VwZXIoZ3JvdXApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQsIGtleSB9ID0gdGhpcztcbiAgICB0aGlzLmtleSA9IHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlR3JvdXAoa2V5KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBPYnNlcnZhYmxlIHJlcHJlc2VudGluZyB2YWx1ZXMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGdyb3VwIHJlcHJlc2VudGVkIGJ5XG4gKiBhIGNvbW1vbiBrZXkuIFRoZSB2YWx1ZXMgZW1pdHRlZCBieSBhIEdyb3VwZWRPYnNlcnZhYmxlIGNvbWUgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGUgY29tbW9uIGtleSBpcyBhdmFpbGFibGUgYXMgdGhlIGZpZWxkIGBrZXlgIG9uIGFcbiAqIEdyb3VwZWRPYnNlcnZhYmxlIGluc3RhbmNlLlxuICpcbiAqIEBjbGFzcyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPlxuICovXG5leHBvcnQgY2xhc3MgR3JvdXBlZE9ic2VydmFibGU8SywgVD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgLyoqIEBkZXByZWNhdGVkIERvIG5vdCBjb25zdHJ1Y3QgdGhpcyB0eXBlLiBJbnRlcm5hbCB1c2Ugb25seSAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMga2V5OiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGdyb3VwU3ViamVjdDogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZWZDb3VudFN1YnNjcmlwdGlvbj86IFJlZkNvdW50U3Vic2NyaXB0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIGNvbnN0IHsgcmVmQ291bnRTdWJzY3JpcHRpb24sIGdyb3VwU3ViamVjdCB9ID0gdGhpcztcbiAgICBpZiAocmVmQ291bnRTdWJzY3JpcHRpb24gJiYgIXJlZkNvdW50U3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgSW5uZXJSZWZDb3VudFN1YnNjcmlwdGlvbihyZWZDb3VudFN1YnNjcmlwdGlvbikpO1xuICAgIH1cbiAgICBzdWJzY3JpcHRpb24uYWRkKGdyb3VwU3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIElubmVyUmVmQ291bnRTdWJzY3JpcHRpb24gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmVudDogUmVmQ291bnRTdWJzY3JpcHRpb24pIHtcbiAgICBzdXBlcigpO1xuICAgIHBhcmVudC5jb3VudCsrO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgaWYgKCFwYXJlbnQuY2xvc2VkICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIHBhcmVudC5jb3VudCAtPSAxO1xuICAgICAgaWYgKHBhcmVudC5jb3VudCA9PT0gMCAmJiBwYXJlbnQuYXR0ZW1wdGVkVG9VbnN1YnNjcmliZSkge1xuICAgICAgICBwYXJlbnQudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25MaWtlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5cbi8qKlxuICogQSB2YXJpYW50IG9mIFN1YmplY3QgdGhhdCByZXF1aXJlcyBhbiBpbml0aWFsIHZhbHVlIGFuZCBlbWl0cyBpdHMgY3VycmVudFxuICogdmFsdWUgd2hlbmV2ZXIgaXQgaXMgc3Vic2NyaWJlZCB0by5cbiAqXG4gKiBAY2xhc3MgQmVoYXZpb3JTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBCZWhhdmlvclN1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92YWx1ZTogVCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzdXBlci5fc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIGlmIChzdWJzY3JpcHRpb24gJiYgISg8U3Vic2NyaXB0aW9uTGlrZT5zdWJzY3JpcHRpb24pLmNsb3NlZCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIGdldFZhbHVlKCk6IFQge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICB0aHJvdyB0aGlzLnRocm93bkVycm9yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHN1cGVyLm5leHQodGhpcy5fdmFsdWUgPSB2YWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEEgdW5pdCBvZiB3b3JrIHRvIGJlIGV4ZWN1dGVkIGluIGEgYHNjaGVkdWxlcmAuIEFuIGFjdGlvbiBpcyB0eXBpY2FsbHlcbiAqIGNyZWF0ZWQgZnJvbSB3aXRoaW4gYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gYW5kIGFuIFJ4SlMgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGNvbmNlcm5cbiAqIHRoZW1zZWx2ZXMgYWJvdXQgY3JlYXRpbmcgYW5kIG1hbmlwdWxhdGluZyBhbiBBY3Rpb24uXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIEFjdGlvbjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gKiAgIG5ldyAoc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6IChzdGF0ZT86IFQpID0+IHZvaWQpO1xuICogICBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uO1xuICogfVxuICogYGBgXG4gKlxuICogQGNsYXNzIEFjdGlvbjxUPlxuICovXG5leHBvcnQgY2xhc3MgQWN0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3Ioc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyB0aGlzIGFjdGlvbiBvbiBpdHMgcGFyZW50IHtAbGluayBTY2hlZHVsZXJMaWtlfSBmb3IgZXhlY3V0aW9uLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAuIE1heSBoYXBwZW4gYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLFxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIGBkZWxheWAgcGFyYW1ldGVyLCBpZiBzcGVjaWZpZWQuXG4gICAqIEBwYXJhbSB7VH0gW3N0YXRlXSBTb21lIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBgd29ya2AgZnVuY3Rpb24gdXNlcyB3aGVuXG4gICAqIGNhbGxlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL0FjdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY0FjdGlvbjxUPiBleHRlbmRzIEFjdGlvbjxUPiB7XG5cbiAgcHVibGljIGlkOiBhbnk7XG4gIHB1YmxpYyBzdGF0ZTogVDtcbiAgcHVibGljIGRlbGF5OiBudW1iZXI7XG4gIHByb3RlY3RlZCBwZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBBbHdheXMgcmVwbGFjZSB0aGUgY3VycmVudCBzdGF0ZSB3aXRoIHRoZSBuZXcgc3RhdGUuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuXG4gICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuXG4gICAgLy9cbiAgICAvLyBJbXBvcnRhbnQgaW1wbGVtZW50YXRpb24gbm90ZTpcbiAgICAvL1xuICAgIC8vIEFjdGlvbnMgb25seSBleGVjdXRlIG9uY2UgYnkgZGVmYXVsdCwgdW5sZXNzIHJlc2NoZWR1bGVkIGZyb20gd2l0aGluIHRoZVxuICAgIC8vIHNjaGVkdWxlZCBjYWxsYmFjay4gVGhpcyBhbGxvd3MgdXMgdG8gaW1wbGVtZW50IHNpbmdsZSBhbmQgcmVwZWF0XG4gICAgLy8gYWN0aW9ucyB2aWEgdGhlIHNhbWUgY29kZSBwYXRoLCB3aXRob3V0IGFkZGluZyBBUEkgc3VyZmFjZSBhcmVhLCBhcyB3ZWxsXG4gICAgLy8gYXMgbWltaWMgdHJhZGl0aW9uYWwgcmVjdXJzaW9uIGJ1dCBhY3Jvc3MgYXN5bmNocm9ub3VzIGJvdW5kYXJpZXMuXG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCBKUyBydW50aW1lcyBhbmQgdGltZXJzIGRpc3Rpbmd1aXNoIGJldHdlZW4gaW50ZXJ2YWxzIGFjaGlldmVkIGJ5XG4gICAgLy8gc2VyaWFsIGBzZXRUaW1lb3V0YCBjYWxscyB2cy4gYSBzaW5nbGUgYHNldEludGVydmFsYCBjYWxsLiBBbiBpbnRlcnZhbCBvZlxuICAgIC8vIHNlcmlhbCBgc2V0VGltZW91dGAgY2FsbHMgY2FuIGJlIGluZGl2aWR1YWxseSBkZWxheWVkLCB3aGljaCBkZWxheXNcbiAgICAvLyBzY2hlZHVsaW5nIHRoZSBuZXh0IGBzZXRUaW1lb3V0YCwgYW5kIHNvIG9uLiBgc2V0SW50ZXJ2YWxgIGF0dGVtcHRzIHRvXG4gICAgLy8gZ3VhcmFudGVlIHRoZSBpbnRlcnZhbCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgbW9yZSBwcmVjaXNlbHkgdG8gdGhlXG4gICAgLy8gaW50ZXJ2YWwgcGVyaW9kLCByZWdhcmRsZXNzIG9mIGxvYWQuXG4gICAgLy9cbiAgICAvLyBUaGVyZWZvcmUsIHdlIHVzZSBgc2V0SW50ZXJ2YWxgIHRvIHNjaGVkdWxlIHNpbmdsZSBhbmQgcmVwZWF0IGFjdGlvbnMuXG4gICAgLy8gSWYgdGhlIGFjdGlvbiByZXNjaGVkdWxlcyBpdHNlbGYgd2l0aCB0aGUgc2FtZSBkZWxheSwgdGhlIGludGVydmFsIGlzIG5vdFxuICAgIC8vIGNhbmNlbGVkLiBJZiB0aGUgYWN0aW9uIGRvZXNuJ3QgcmVzY2hlZHVsZSwgb3IgcmVzY2hlZHVsZXMgd2l0aCBhXG4gICAgLy8gZGlmZmVyZW50IGRlbGF5LCB0aGUgaW50ZXJ2YWwgd2lsbCBiZSBjYW5jZWxlZCBhZnRlciBzY2hlZHVsZWQgY2FsbGJhY2tcbiAgICAvLyBleGVjdXRpb24uXG4gICAgLy9cbiAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgcGVuZGluZyBmbGFnIGluZGljYXRpbmcgdGhhdCB0aGlzIGFjdGlvbiBoYXMgYmVlbiBzY2hlZHVsZWQsIG9yXG4gICAgLy8gaGFzIHJlY3Vyc2l2ZWx5IHJlc2NoZWR1bGVkIGl0c2VsZi5cbiAgICB0aGlzLnBlbmRpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIElmIHRoaXMgYWN0aW9uIGhhcyBhbHJlYWR5IGFuIGFzeW5jIElkLCBkb24ndCByZXF1ZXN0IGEgbmV3IG9uZS5cbiAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCB0aGlzLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgdGhpcy5pZCwgZGVsYXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICByZXR1cm4gc2V0SW50ZXJ2YWwoc2NoZWR1bGVyLmZsdXNoLmJpbmQoc2NoZWR1bGVyLCB0aGlzKSwgZGVsYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsIGlkOiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiB0aGlzIGFjdGlvbiBpcyByZXNjaGVkdWxlZCB3aXRoIHRoZSBzYW1lIGRlbGF5IHRpbWUsIGRvbid0IGNsZWFyIHRoZSBpbnRlcnZhbCBpZC5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgdGhpcy5kZWxheSA9PT0gZGVsYXkgJiYgdGhpcy5wZW5kaW5nID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSBhY3Rpb24ncyBkZWxheSB0aW1lIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IGRlbGF5LFxuICAgIC8vIG9yIHRoZSBhY3Rpb24gaGFzIGJlZW4gcmVzY2hlZHVsZWQgYmVmb3JlIGl0J3MgZXhlY3V0ZWQsIGNsZWFyIHRoZSBpbnRlcnZhbCBpZFxuICAgIGNsZWFySW50ZXJ2YWwoaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltbWVkaWF0ZWx5IGV4ZWN1dGVzIHRoaXMgYWN0aW9uIGFuZCB0aGUgYHdvcmtgIGl0IGNvbnRhaW5zLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBwdWJsaWMgZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2V4ZWN1dGluZyBhIGNhbmNlbGxlZCBhY3Rpb24nKTtcbiAgICB9XG5cbiAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvciA9IHRoaXMuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGVuZGluZyA9PT0gZmFsc2UgJiYgdGhpcy5pZCAhPSBudWxsKSB7XG4gICAgICAvLyBEZXF1ZXVlIGlmIHRoZSBhY3Rpb24gZGlkbid0IHJlc2NoZWR1bGUgaXRzZWxmLiBEb24ndCBjYWxsXG4gICAgICAvLyB1bnN1YnNjcmliZSgpLCBiZWNhdXNlIHRoZSBhY3Rpb24gY291bGQgcmVzY2hlZHVsZSBsYXRlci5cbiAgICAgIC8vIEZvciBleGFtcGxlOlxuICAgICAgLy8gYGBgXG4gICAgICAvLyBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gZG9Xb3JrKGNvdW50ZXIpIHtcbiAgICAgIC8vICAgLyogLi4uIEknbSBhIGJ1c3kgd29ya2VyIGJlZSAuLi4gKi9cbiAgICAgIC8vICAgdmFyIG9yaWdpbmFsQWN0aW9uID0gdGhpcztcbiAgICAgIC8vICAgLyogd2FpdCAxMDBtcyBiZWZvcmUgcmVzY2hlZHVsaW5nIHRoZSBhY3Rpb24gKi9cbiAgICAgIC8vICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgICAgb3JpZ2luYWxBY3Rpb24uc2NoZWR1bGUoY291bnRlciArIDEpO1xuICAgICAgLy8gICB9LCAxMDApO1xuICAgICAgLy8gfSwgMTAwMCk7XG4gICAgICAvLyBgYGBcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHRoaXMuc2NoZWR1bGVyLCB0aGlzLmlkLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2V4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuICAgIGxldCBlcnJvcmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgbGV0IGVycm9yVmFsdWU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgdGhpcy53b3JrKHN0YXRlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgIGVycm9yVmFsdWUgPSAhIWUgJiYgZSB8fCBuZXcgRXJyb3IoZSk7XG4gICAgfVxuICAgIGlmIChlcnJvcmVkKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICByZXR1cm4gZXJyb3JWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcblxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcbiAgICBjb25zdCBhY3Rpb25zID0gc2NoZWR1bGVyLmFjdGlvbnM7XG4gICAgY29uc3QgaW5kZXggPSBhY3Rpb25zLmluZGV4T2YodGhpcyk7XG5cbiAgICB0aGlzLndvcmsgID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBhY3Rpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuZGVsYXkgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgUXVldWVBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogUXVldWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuc2NoZWR1bGVyLmZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGV4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuICAgIHJldHVybiAoZGVsYXkgPiAwIHx8IHRoaXMuY2xvc2VkKSA/XG4gICAgICBzdXBlci5leGVjdXRlKHN0YXRlLCBkZWxheSkgOlxuICAgICAgdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpIDtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IFF1ZXVlU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGV4aXN0cyBhbmQgaXMgZ3JlYXRlciB0aGFuIDAsIG9yIGlmIHRoZSBkZWxheSBpcyBudWxsICh0aGVcbiAgICAvLyBhY3Rpb24gd2Fzbid0IHJlc2NoZWR1bGVkKSBidXQgd2FzIG9yaWdpbmFsbHkgc2NoZWR1bGVkIGFzIGFuIGFzeW5jXG4gICAgLy8gYWN0aW9uLCB0aGVuIHJlY3ljbGUgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmICgoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UgZmx1c2ggdGhlIHNjaGVkdWxlciBzdGFydGluZyB3aXRoIHRoaXMgYWN0aW9uLlxuICAgIHJldHVybiBzY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vc2NoZWR1bGVyL0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBBbiBleGVjdXRpb24gY29udGV4dCBhbmQgYSBkYXRhIHN0cnVjdHVyZSB0byBvcmRlciB0YXNrcyBhbmQgc2NoZWR1bGUgdGhlaXJcbiAqIGV4ZWN1dGlvbi4gUHJvdmlkZXMgYSBub3Rpb24gb2YgKHBvdGVudGlhbGx5IHZpcnR1YWwpIHRpbWUsIHRocm91Z2ggdGhlXG4gKiBgbm93KClgIGdldHRlciBtZXRob2QuXG4gKlxuICogRWFjaCB1bml0IG9mIHdvcmsgaW4gYSBTY2hlZHVsZXIgaXMgY2FsbGVkIGFuIGBBY3Rpb25gLlxuICpcbiAqIGBgYHRzXG4gKiBjbGFzcyBTY2hlZHVsZXIge1xuICogICBub3coKTogbnVtYmVyO1xuICogICBzY2hlZHVsZSh3b3JrLCBkZWxheT8sIHN0YXRlPyk6IFN1YnNjcmlwdGlvbjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBjbGFzcyBTY2hlZHVsZXJcbiAqIEBkZXByZWNhdGVkIFNjaGVkdWxlciBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgUnhKUywgYW5kXG4gKiBzaG91bGQgbm90IGJlIHVzZWQgZGlyZWN0bHkuIFJhdGhlciwgY3JlYXRlIHlvdXIgb3duIGNsYXNzIGFuZCBpbXBsZW1lbnRcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfVxuICovXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIGltcGxlbWVudHMgU2NoZWR1bGVyTGlrZSB7XG5cbiAgLyoqXG4gICAqIE5vdGU6IHRoZSBleHRyYSBhcnJvdyBmdW5jdGlvbiB3cmFwcGVyIGlzIHRvIG1ha2UgdGVzdGluZyBieSBvdmVycmlkaW5nXG4gICAqIERhdGUubm93IGVhc2llci5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm93OiAoKSA9PiBudW1iZXIgPSAoKSA9PiBEYXRlLm5vdygpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQWN0aW9uLFxuICAgICAgICAgICAgICBub3c6ICgpID0+IG51bWJlciA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICB0aGlzLm5vdyA9IG5vdztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGdldHRlciBtZXRob2QgdGhhdCByZXR1cm5zIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCB0aW1lXG4gICAqIChhdCB0aGUgdGltZSB0aGlzIGZ1bmN0aW9uIHdhcyBjYWxsZWQpIGFjY29yZGluZyB0byB0aGUgc2NoZWR1bGVyJ3Mgb3duXG4gICAqIGludGVybmFsIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IEEgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyB0aGUgY3VycmVudCB0aW1lLiBNYXkgb3IgbWF5IG5vdFxuICAgKiBoYXZlIGEgcmVsYXRpb24gdG8gd2FsbC1jbG9jayB0aW1lLiBNYXkgb3IgbWF5IG5vdCByZWZlciB0byBhIHRpbWUgdW5pdFxuICAgKiAoZS5nLiBtaWxsaXNlY29uZHMpLlxuICAgKi9cbiAgcHVibGljIG5vdzogKCkgPT4gbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSBmdW5jdGlvbiwgYHdvcmtgLCBmb3IgZXhlY3V0aW9uLiBNYXkgaGFwcGVuIGF0IHNvbWUgcG9pbnQgaW5cbiAgICogdGhlIGZ1dHVyZSwgYWNjb3JkaW5nIHRvIHRoZSBgZGVsYXlgIHBhcmFtZXRlciwgaWYgc3BlY2lmaWVkLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAsIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBgd29ya2AgZnVuY3Rpb24uXG4gICAqXG4gICAqIFRoZSBnaXZlbiBhcmd1bWVudHMgd2lsbCBiZSBwcm9jZXNzZWQgYW4gc3RvcmVkIGFzIGFuIEFjdGlvbiBvYmplY3QgaW4gYVxuICAgKiBxdWV1ZSBvZiBhY3Rpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0YXRlOiA/VCk6ID9TdWJzY3JpcHRpb259IHdvcmsgQSBmdW5jdGlvbiByZXByZXNlbnRpbmcgYVxuICAgKiB0YXNrLCBvciBzb21lIHVuaXQgb2Ygd29yayB0byBiZSBleGVjdXRlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyIGl0c2VsZi5cbiAgICogQHBhcmFtIHtUfSBbc3RhdGVdIFNvbWUgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIGB3b3JrYCBmdW5jdGlvbiB1c2VzIHdoZW5cbiAgICogY2FsbGVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gQSBzdWJzY3JpcHRpb24gaW4gb3JkZXIgdG8gYmUgYWJsZSB0byB1bnN1YnNjcmliZVxuICAgKiB0aGUgc2NoZWR1bGVkIHdvcmsuXG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGU8VD4od29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLCBkZWxheTogbnVtYmVyID0gMCwgc3RhdGU/OiBUKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuU2NoZWR1bGVyQWN0aW9uPFQ+KHRoaXMsIHdvcmspLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuZXhwb3J0IGNsYXNzIEFzeW5jU2NoZWR1bGVyIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgcHVibGljIHN0YXRpYyBkZWxlZ2F0ZT86IFNjaGVkdWxlcjtcbiAgcHVibGljIGFjdGlvbnM6IEFycmF5PEFzeW5jQWN0aW9uPGFueT4+ID0gW107XG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGUgU2NoZWR1bGVyIGlzIGN1cnJlbnRseSBleGVjdXRpbmcgYSBiYXRjaCBvZlxuICAgKiBxdWV1ZWQgYWN0aW9ucy5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZXByZWNhdGVkIGludGVybmFsIHVzZSBvbmx5XG4gICAqL1xuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBBbiBpbnRlcm5hbCBJRCB1c2VkIHRvIHRyYWNrIHRoZSBsYXRlc3QgYXN5bmNocm9ub3VzIHRhc2sgc3VjaCBhcyB0aG9zZVxuICAgKiBjb21pbmcgZnJvbSBgc2V0VGltZW91dGAsIGBzZXRJbnRlcnZhbGAsIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLCBhbmRcbiAgICogb3RoZXJzLlxuICAgKiBAdHlwZSB7YW55fVxuICAgKiBAZGVwcmVjYXRlZCBpbnRlcm5hbCB1c2Ugb25seVxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlZDogYW55ID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFjdGlvbixcbiAgICAgICAgICAgICAgbm93OiAoKSA9PiBudW1iZXIgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgc3VwZXIoU2NoZWR1bGVyQWN0aW9uLCAoKSA9PiB7XG4gICAgICBpZiAoQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgJiYgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgIT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlLm5vdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5vdygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlPFQ+KHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCwgZGVsYXk6IG51bWJlciA9IDAsIHN0YXRlPzogVCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICYmIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm4gQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUuc2NoZWR1bGUod29yaywgZGVsYXksIHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHdvcmssIGRlbGF5LCBzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZsdXNoKGFjdGlvbjogQXN5bmNBY3Rpb248YW55Pik6IHZvaWQge1xuXG4gICAgY29uc3Qge2FjdGlvbnN9ID0gdGhpcztcblxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSk7IC8vIGV4aGF1c3QgdGhlIHNjaGVkdWxlciBxdWV1ZVxuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuZXhwb3J0IGNsYXNzIFF1ZXVlU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xufVxuIiwiaW1wb3J0IHsgUXVldWVBY3Rpb24gfSBmcm9tICcuL1F1ZXVlQWN0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIFF1ZXVlIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QdXQgZXZlcnkgbmV4dCB0YXNrIG9uIGEgcXVldWUsIGluc3RlYWQgb2YgZXhlY3V0aW5nIGl0IGltbWVkaWF0ZWx5PC9zcGFuPlxuICpcbiAqIGBxdWV1ZWAgc2NoZWR1bGVyLCB3aGVuIHVzZWQgd2l0aCBkZWxheSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiBXaGVuIHVzZWQgd2l0aG91dCBkZWxheSwgaXQgc2NoZWR1bGVzIGdpdmVuIHRhc2sgc3luY2hyb25vdXNseSAtIGV4ZWN1dGVzIGl0IHJpZ2h0IHdoZW5cbiAqIGl0IGlzIHNjaGVkdWxlZC4gSG93ZXZlciB3aGVuIGNhbGxlZCByZWN1cnNpdmVseSwgdGhhdCBpcyB3aGVuIGluc2lkZSB0aGUgc2NoZWR1bGVkIHRhc2ssXG4gKiBhbm90aGVyIHRhc2sgaXMgc2NoZWR1bGVkIHdpdGggcXVldWUgc2NoZWR1bGVyLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpbW1lZGlhdGVseSBhcyB3ZWxsLFxuICogdGhhdCB0YXNrIHdpbGwgYmUgcHV0IG9uIGEgcXVldWUgYW5kIHdhaXQgZm9yIGN1cnJlbnQgb25lIHRvIGZpbmlzaC5cbiAqXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2hlbiB5b3UgZXhlY3V0ZSB0YXNrIHdpdGggYHF1ZXVlYCBzY2hlZHVsZXIsIHlvdSBhcmUgc3VyZSBpdCB3aWxsIGVuZFxuICogYmVmb3JlIGFueSBvdGhlciB0YXNrIHNjaGVkdWxlZCB3aXRoIHRoYXQgc2NoZWR1bGVyIHdpbGwgc3RhcnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNjaGVkdWxlIHJlY3Vyc2l2ZWx5IGZpcnN0LCB0aGVuIGRvIHNvbWV0aGluZ1xuICogYGBgamF2YXNjcmlwdFxuICogUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IHtcbiAqICAgUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdzZWNvbmQnKSk7IC8vIHdpbGwgbm90IGhhcHBlbiBub3csIGJ1dCB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlXG4gKlxuICogICBjb25zb2xlLmxvZygnZmlyc3QnKTtcbiAqIH0pO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqIC8vIFwic2Vjb25kXCJcbiAqIGBgYFxuICpcbiAqIFJlc2NoZWR1bGUgaXRzZWxmIHJlY3Vyc2l2ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIucXVldWUuc2NoZWR1bGUoZnVuY3Rpb24oc3RhdGUpIHtcbiAqICAgaWYgKHN0YXRlICE9PSAwKSB7XG4gKiAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHN0YXRlKTtcbiAqICAgICB0aGlzLnNjaGVkdWxlKHN0YXRlIC0gMSk7IC8vIGB0aGlzYCByZWZlcmVuY2VzIGN1cnJlbnRseSBleGVjdXRpbmcgQWN0aW9uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZVxuICogICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIHN0YXRlKTtcbiAqICAgfVxuICogfSwgMCwgMyk7XG4gKlxuICogLy8gSW4gc2NoZWR1bGVyIHRoYXQgcnVucyByZWN1cnNpdmVseSwgeW91IHdvdWxkIGV4cGVjdDpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYmVmb3JlXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDNcbiAqXG4gKiAvLyBCdXQgd2l0aCBxdWV1ZSBpdCBsb2dzOlxuICogLy8gXCJiZWZvcmVcIiwgM1xuICogLy8gXCJhZnRlclwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBxdWV1ZVxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZVNjaGVkdWxlcihRdWV1ZUFjdGlvbik7XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBzYW1lIE9ic2VydmFibGUgaW5zdGFuY2UgcmV0dXJuZWQgYnkgYW55IGNhbGwgdG8ge0BsaW5rIGVtcHR5fSB3aXRob3V0IGFcbiAqIGBzY2hlZHVsZXJgLiBJdCBpcyBwcmVmZXJyYWJsZSB0byB1c2UgdGhpcyBvdmVyIGBlbXB0eSgpYC5cbiAqL1xuZXhwb3J0IGNvbnN0IEVNUFRZID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBubyBpdGVtcyB0byB0aGUgT2JzZXJ2ZXIgYW5kIGltbWVkaWF0ZWx5XG4gKiBlbWl0cyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SnVzdCBlbWl0cyAnY29tcGxldGUnLCBhbmQgbm90aGluZyBlbHNlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShlbXB0eS5wbmcpXG4gKlxuICogVGhpcyBzdGF0aWMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBjcmVhdGluZyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgb25seVxuICogZW1pdHMgdGhlIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcywgc3VjaCBhcyBpbiBhIHtAbGluayBtZXJnZU1hcH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBjb21wbGV0ZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgcmVzdWx0ID0gZW1wdHkoKS5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogIyMjIE1hcCBhbmQgZmxhdHRlbiBvbmx5IG9kZCBudW1iZXJzIHRvIHRoZSBzZXF1ZW5jZSAnYScsICdiJywgJ2MnXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBpbnRlcnZhbCQgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIHJlc3VsdCA9IGludGVydmFsJC5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggJSAyID09PSAxID8gb2YoJ2EnLCAnYicsICdjJykgOiBlbXB0eSgpKSxcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyB0byB0aGUgY29uc29sZTpcbiAqIC8vIHggaXMgZXF1YWwgdG8gdGhlIGNvdW50IG9uIHRoZSBpbnRlcnZhbCBlZygwLDEsMiwzLC4uLilcbiAqIC8vIHggd2lsbCBvY2N1ciBldmVyeSAxMDAwbXNcbiAqIC8vIGlmIHggJSAyIGlzIGVxdWFsIHRvIDEgcHJpbnQgYWJjXG4gKiAvLyBpZiB4ICUgMiBpcyBub3QgZXF1YWwgdG8gMSBub3RoaW5nIHdpbGwgYmUgb3V0cHV0XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gXCJlbXB0eVwiIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGNvbXBsZXRlXG4gKiBub3RpZmljYXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGVtcHR5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiB1c2luZyB7QGxpbmsgaW5kZXgvRU1QVFl9IGNvbnN0YW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gc2NoZWR1bGVyID8gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSA6IEVNUFRZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTY2hlZHVsZXIodmFsdWU6IGFueSk6IHZhbHVlIGlzIFNjaGVkdWxlckxpa2Uge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mICg8YW55PnZhbHVlKS5zY2hlZHVsZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBTdWJzY3JpYmVzIHRvIGFuIEFycmF5TGlrZSB3aXRoIGEgc3Vic2NyaWJlclxuICogQHBhcmFtIGFycmF5IFRoZSBhcnJheSBvciBhcnJheS1saWtlIHRvIHN1YnNjcmliZSB0b1xuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9BcnJheSA9IDxUPihhcnJheTogQXJyYXlMaWtlPFQ+KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgc3Vic2NyaWJlci5uZXh0KGFycmF5W2ldKTtcbiAgfVxuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb0FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21BcnJheTxUPihpbnB1dDogQXJyYXlMaWtlPFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvQXJyYXkoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBsZXQgaSA9IDA7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpID09PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliZXIubmV4dChpbnB1dFtpKytdKTtcbiAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIHN1Yi5hZGQodGhpcy5zY2hlZHVsZSgpKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGFyPFQ+KHZhbHVlOiBUKSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9KTtcbiAgcmVzdWx0Ll9pc1NjYWxhciA9IHRydWU7XG4gIChyZXN1bHQgYXMgYW55KS52YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgc2NhbGFyIH0gZnJvbSAnLi9zY2FsYXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvZjxUPihhOiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMj4oYTogVCwgYjogVDIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzPihhOiBULCBiOiBUMiwgYzogVDMsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNT4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3LCBUOD4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgaDogVDgsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDcgfCBUOD47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNywgVDgsIFQ5PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBoOiBUOCwgaTogVDksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDcgfCBUOCB8IFQ5PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxUPiguLi5hcmdzOiBBcnJheTxUIHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgYXJndW1lbnRzIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVhY2ggYXJndW1lbnQgYmVjb21lcyBhIGBuZXh0YCBub3RpZmljYXRpb24uPC9zcGFuPlxuICpcbiAqICFbXShvZi5wbmcpXG4gKlxuICogVW5saWtlIHtAbGluayBmcm9tfSwgaXQgZG9lcyBub3QgZG8gYW55IGZsYXR0ZW5pbmcgYW5kIGVtaXRzIGVhY2ggYXJndW1lbnQgaW4gd2hvbGVcbiAqIGFzIGEgc2VwYXJhdGUgYG5leHRgIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqIEVtaXQgdGhlIHZhbHVlcyBgMTAsIDIwLCAzMGBcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZigxMCwgMjAsIDMwKVxuICogLnN1YnNjcmliZShcbiAqICAgbmV4dCA9PiBjb25zb2xlLmxvZygnbmV4dDonLCBuZXh0KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICduZXh0OiAxMCdcbiAqIC8vICduZXh0OiAyMCdcbiAqIC8vICduZXh0OiAzMCdcbiAqXG4gKiBgYGBcbiAqXG4gKiBFbWl0IHRoZSBhcnJheSBgWzEsMiwzXWBcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZihbMSwyLDNdKVxuICogLnN1YnNjcmliZShcbiAqICAgbmV4dCA9PiBjb25zb2xlLmxvZygnbmV4dDonLCBuZXh0KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICduZXh0OiBbMSwyLDNdJ1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIHJhbmdlfVxuICpcbiAqIEBwYXJhbSB7Li4uVH0gdmFsdWVzIEEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgYXJndW1lbnRzIHlvdSB3YW50IHRvIGJlIGVtaXR0ZWRcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgYXJndW1lbnRzXG4gKiBkZXNjcmliZWQgYWJvdmUgYW5kIHRoZW4gY29tcGxldGVzLlxuICogQG1ldGhvZCBvZlxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIGxldCBzY2hlZHVsZXIgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gYXMgU2NoZWR1bGVyTGlrZTtcbiAgaWYgKGlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBhcmdzLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlciA9IHVuZGVmaW5lZDtcbiAgfVxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGVtcHR5KHNjaGVkdWxlcik7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHNjaGVkdWxlciA/IGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKSA6IHNjYWxhcihhcmdzWzBdIGFzIFQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZnJvbUFycmF5KGFyZ3MgYXMgVFtdLCBzY2hlZHVsZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgaW1tZWRpYXRlbHlcbiAqIGVtaXRzIGFuIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SnVzdCBlbWl0cyAnZXJyb3InLCBhbmQgbm90aGluZyBlbHNlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXSh0aHJvdy5wbmcpXG4gKlxuICogVGhpcyBzdGF0aWMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBjcmVhdGluZyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgb25seVxuICogZW1pdHMgdGhlIGVycm9yIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcywgc3VjaCBhcyBpbiBhIHtAbGluayBtZXJnZU1hcH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBlbWl0IGFuIGVycm9yXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyB0aHJvd0Vycm9yLCBjb25jYXQsIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3QgcmVzdWx0ID0gY29uY2F0KG9mKDcpLCB0aHJvd0Vycm9yKG5ldyBFcnJvcignb29wcyEnKSkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyA3XG4gKiAvLyBFcnJvcjogb29wcyFcbiAqIGBgYFxuICpcbiAqIC0tLVxuICpcbiAqICMjIyBNYXAgYW5kIGZsYXR0ZW4gbnVtYmVycyB0byB0aGUgc2VxdWVuY2UgJ2EnLCAnYicsICdjJywgYnV0IHRocm93IGFuIGVycm9yIGZvciAxM1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgdGhyb3dFcnJvciwgaW50ZXJ2YWwsIG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBpbnRlcnZhbCgxMDAwKS5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggPT09IDJcbiAqICAgICA/IHRocm93RXJyb3IoJ1R3b3MgYXJlIGJhZCcpXG4gKiAgICAgOiBvZignYScsICdiJywgJ2MnKVxuICogICApLFxuICogKS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gYVxuICogLy8gYlxuICogLy8gY1xuICogLy8gYVxuICogLy8gYlxuICogLy8gY1xuICogLy8gVHdvcyBhcmUgYmFkXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgZW1wdHl9XG4gKiBAc2VlIHtAbGluayBuZXZlcn1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICpcbiAqIEBwYXJhbSB7YW55fSBlcnJvciBUaGUgcGFydGljdWxhciBFcnJvciB0byBwYXNzIHRvIHRoZSBlcnJvciBub3RpZmljYXRpb24uXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHRoZSBlcnJvciBub3RpZmljYXRpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBlcnJvciBPYnNlcnZhYmxlOiBlbWl0cyBvbmx5IHRoZSBlcnJvciBub3RpZmljYXRpb25cbiAqIHVzaW5nIHRoZSBnaXZlbiBlcnJvciBhcmd1bWVudC5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgdGhyb3dFcnJvclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3I6IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bmV2ZXI+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLmVycm9yKGVycm9yKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4gc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCAwLCB7IGVycm9yLCBzdWJzY3JpYmVyIH0pKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hBcmcge1xuICBlcnJvcjogYW55O1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHsgZXJyb3IsIHN1YnNjcmliZXIgfTogRGlzcGF0Y2hBcmcpIHtcbiAgc3Vic2NyaWJlci5lcnJvcihlcnJvcik7XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgb2YgfSBmcm9tICcuL29ic2VydmFibGUvb2YnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcHVzaC1iYXNlZCBldmVudCBvciB2YWx1ZSB0aGF0IGFuIHtAbGluayBPYnNlcnZhYmxlfSBjYW4gZW1pdC5cbiAqIFRoaXMgY2xhc3MgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igb3BlcmF0b3JzIHRoYXQgbWFuYWdlIG5vdGlmaWNhdGlvbnMsXG4gKiBsaWtlIHtAbGluayBtYXRlcmlhbGl6ZX0sIHtAbGluayBkZW1hdGVyaWFsaXplfSwge0BsaW5rIG9ic2VydmVPbn0sIGFuZFxuICogb3RoZXJzLiBCZXNpZGVzIHdyYXBwaW5nIHRoZSBhY3R1YWwgZGVsaXZlcmVkIHZhbHVlLCBpdCBhbHNvIGFubm90YXRlcyBpdFxuICogd2l0aCBtZXRhZGF0YSBvZiwgZm9yIGluc3RhbmNlLCB3aGF0IHR5cGUgb2YgcHVzaCBtZXNzYWdlIGl0IGlzIChgbmV4dGAsXG4gKiBgZXJyb3JgLCBvciBgY29tcGxldGVgKS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXRlcmlhbGl6ZX1cbiAqIEBzZWUge0BsaW5rIGRlbWF0ZXJpYWxpemV9XG4gKiBAc2VlIHtAbGluayBvYnNlcnZlT259XG4gKlxuICogQGNsYXNzIE5vdGlmaWNhdGlvbjxUPlxuICovXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uPFQ+IHtcbiAgaGFzVmFsdWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGtpbmQ6IHN0cmluZywgcHVibGljIHZhbHVlPzogVCwgcHVibGljIGVycm9yPzogYW55KSB7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IGtpbmQgPT09ICdOJztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxpdmVycyB0byB0aGUgZ2l2ZW4gYG9ic2VydmVyYCB0aGUgdmFsdWUgd3JhcHBlZCBieSB0aGlzIE5vdGlmaWNhdGlvbi5cbiAgICogQHBhcmFtIHtPYnNlcnZlcn0gb2JzZXJ2ZXJcbiAgICogQHJldHVyblxuICAgKi9cbiAgb2JzZXJ2ZShvYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+KTogYW55IHtcbiAgICBzd2l0Y2ggKHRoaXMua2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLmVycm9yICYmIG9ic2VydmVyLmVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5jb21wbGV0ZSAmJiBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBzb21lIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2tzLCBkZWxpdmVyIHRoZSB2YWx1ZSByZXByZXNlbnRlZCBieSB0aGVcbiAgICogY3VycmVudCBOb3RpZmljYXRpb24gdG8gdGhlIGNvcnJlY3RseSBjb3JyZXNwb25kaW5nIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gbmV4dCBBbiBPYnNlcnZlciBgbmV4dGAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZXJyOiBhbnkpOiB2b2lkfSBbZXJyb3JdIEFuIE9ic2VydmVyIGBlcnJvcmAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBBbiBPYnNlcnZlciBgY29tcGxldGVgIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBkbyhuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIGVycm9yPzogKGVycjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBhbnkge1xuICAgIGNvbnN0IGtpbmQgPSB0aGlzLmtpbmQ7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG5leHQgJiYgbmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gZXJyb3IgJiYgZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlICYmIGNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIE9ic2VydmVyIG9yIGl0cyBpbmRpdmlkdWFsIGNhbGxiYWNrIGZ1bmN0aW9ucywgYW5kIGNhbGxzIGBvYnNlcnZlYFxuICAgKiBvciBgZG9gIG1ldGhvZHMgYWNjb3JkaW5nbHkuXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBuZXh0T3JPYnNlcnZlciBBbiBPYnNlcnZlciBvclxuICAgKiB0aGUgYG5leHRgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGVycjogYW55KTogdm9pZH0gW2Vycm9yXSBBbiBPYnNlcnZlciBgZXJyb3JgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gQW4gT2JzZXJ2ZXIgYGNvbXBsZXRlYCBjYWxsYmFjay5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgYWNjZXB0KG5leHRPck9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSwgZXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIGlmIChuZXh0T3JPYnNlcnZlciAmJiB0eXBlb2YgKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+bmV4dE9yT2JzZXJ2ZXIpLm5leHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLm9ic2VydmUoPFBhcnRpYWxPYnNlcnZlcjxUPj5uZXh0T3JPYnNlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRvKDwodmFsdWU6IFQpID0+IHZvaWQ+bmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IGp1c3QgZGVsaXZlcnMgdGhlIG5vdGlmaWNhdGlvbiByZXByZXNlbnRlZFxuICAgKiBieSB0aGlzIE5vdGlmaWNhdGlvbiBpbnN0YW5jZS5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgdG9PYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGtpbmQgPSB0aGlzLmtpbmQ7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG9mKHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgbm90aWZpY2F0aW9uIGtpbmQgdmFsdWUnKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNvbXBsZXRlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oJ0MnKTtcbiAgcHJpdmF0ZSBzdGF0aWMgdW5kZWZpbmVkVmFsdWVOb3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+ID0gbmV3IE5vdGlmaWNhdGlvbignTicsIHVuZGVmaW5lZCk7XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBuZXh0YCBmcm9tIGFcbiAgICogZ2l2ZW4gdmFsdWUuXG4gICAqIEBwYXJhbSB7VH0gdmFsdWUgVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPFQ+fSBUaGUgXCJuZXh0XCIgTm90aWZpY2F0aW9uIHJlcHJlc2VudGluZyB0aGVcbiAgICogYXJndW1lbnQuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlTmV4dDxUPih2YWx1ZTogVCk6IE5vdGlmaWNhdGlvbjxUPiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKCdOJywgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gTm90aWZpY2F0aW9uLnVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBlcnJvcmAgZnJvbSBhXG4gICAqIGdpdmVuIGVycm9yLlxuICAgKiBAcGFyYW0ge2FueX0gW2Vycl0gVGhlIGBlcnJvcmAgZXJyb3IuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxUPn0gVGhlIFwiZXJyb3JcIiBOb3RpZmljYXRpb24gcmVwcmVzZW50aW5nIHRoZVxuICAgKiBhcmd1bWVudC5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVFcnJvcjxUPihlcnI/OiBhbnkpOiBOb3RpZmljYXRpb248VD4ge1xuICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLCBlcnIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBjb21wbGV0ZWAuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxhbnk+fSBUaGUgdmFsdWVsZXNzIFwiY29tcGxldGVcIiBOb3RpZmljYXRpb24uXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlQ29tcGxldGUoKTogTm90aWZpY2F0aW9uPGFueT4ge1xuICAgIHJldHVybiBOb3RpZmljYXRpb24uY29tcGxldGVOb3RpZmljYXRpb247XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFBhcnRpYWxPYnNlcnZlciwgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqXG4gKiBSZS1lbWl0cyBhbGwgbm90aWZpY2F0aW9ucyBmcm9tIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggc3BlY2lmaWVkIHNjaGVkdWxlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW5zdXJlIGEgc3BlY2lmaWMgc2NoZWR1bGVyIGlzIHVzZWQsIGZyb20gb3V0c2lkZSBvZiBhbiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgb2JzZXJ2ZU9uYCBpcyBhbiBvcGVyYXRvciB0aGF0IGFjY2VwdHMgYSBzY2hlZHVsZXIgYXMgYSBmaXJzdCBwYXJhbWV0ZXIsIHdoaWNoIHdpbGwgYmUgdXNlZCB0byByZXNjaGVkdWxlXG4gKiBub3RpZmljYXRpb25zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJdCBtaWdodCBiZSB1c2VmdWwsIGlmIHlvdSBkbyBub3QgaGF2ZSBjb250cm9sIG92ZXJcbiAqIGludGVybmFsIHNjaGVkdWxlciBvZiBhIGdpdmVuIE9ic2VydmFibGUsIGJ1dCB3YW50IHRvIGNvbnRyb2wgd2hlbiBpdHMgdmFsdWVzIGFyZSBlbWl0dGVkIG5ldmVydGhlbGVzcy5cbiAqXG4gKiBSZXR1cm5lZCBPYnNlcnZhYmxlIGVtaXRzIHRoZSBzYW1lIG5vdGlmaWNhdGlvbnMgKG5leHRlZCB2YWx1ZXMsIGNvbXBsZXRlIGFuZCBlcnJvciBldmVudHMpIGFzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSxcbiAqIGJ1dCByZXNjaGVkdWxlZCB3aXRoIHByb3ZpZGVkIHNjaGVkdWxlci4gTm90ZSB0aGF0IHRoaXMgZG9lc24ndCBtZWFuIHRoYXQgc291cmNlIE9ic2VydmFibGVzIGludGVybmFsXG4gKiBzY2hlZHVsZXIgd2lsbCBiZSByZXBsYWNlZCBpbiBhbnkgd2F5LiBPcmlnaW5hbCBzY2hlZHVsZXIgc3RpbGwgd2lsbCBiZSB1c2VkLCBidXQgd2hlbiB0aGUgc291cmNlIE9ic2VydmFibGUgZW1pdHNcbiAqIG5vdGlmaWNhdGlvbiwgaXQgd2lsbCBiZSBpbW1lZGlhdGVseSBzY2hlZHVsZWQgYWdhaW4gLSB0aGlzIHRpbWUgd2l0aCBzY2hlZHVsZXIgcGFzc2VkIHRvIGBvYnNlcnZlT25gLlxuICogQW4gYW50aS1wYXR0ZXJuIHdvdWxkIGJlIGNhbGxpbmcgYG9ic2VydmVPbmAgb24gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGxvdHMgb2YgdmFsdWVzIHN5bmNocm9ub3VzbHksIHRvIHNwbGl0XG4gKiB0aGF0IGVtaXNzaW9ucyBpbnRvIGFzeW5jaHJvbm91cyBjaHVua3MuIEZvciB0aGlzIHRvIGhhcHBlbiwgc2NoZWR1bGVyIHdvdWxkIGhhdmUgdG8gYmUgcGFzc2VkIGludG8gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBkaXJlY3RseSAodXN1YWxseSBpbnRvIHRoZSBvcGVyYXRvciB0aGF0IGNyZWF0ZXMgaXQpLiBgb2JzZXJ2ZU9uYCBzaW1wbHkgZGVsYXlzIG5vdGlmaWNhdGlvbnMgYVxuICogbGl0dGxlIGJpdCBtb3JlLCB0byBlbnN1cmUgdGhhdCB0aGV5IGFyZSBlbWl0dGVkIGF0IGV4cGVjdGVkIG1vbWVudHMuXG4gKlxuICogQXMgYSBtYXR0ZXIgb2YgZmFjdCwgYG9ic2VydmVPbmAgYWNjZXB0cyBzZWNvbmQgcGFyYW1ldGVyLCB3aGljaCBzcGVjaWZpZXMgaW4gbWlsbGlzZWNvbmRzIHdpdGggd2hhdCBkZWxheSBub3RpZmljYXRpb25zXG4gKiB3aWxsIGJlIGVtaXR0ZWQuIFRoZSBtYWluIGRpZmZlcmVuY2UgYmV0d2VlbiB7QGxpbmsgZGVsYXl9IG9wZXJhdG9yIGFuZCBgb2JzZXJ2ZU9uYCBpcyB0aGF0IGBvYnNlcnZlT25gXG4gKiB3aWxsIGRlbGF5IGFsbCBub3RpZmljYXRpb25zIC0gaW5jbHVkaW5nIGVycm9yIG5vdGlmaWNhdGlvbnMgLSB3aGlsZSBgZGVsYXlgIHdpbGwgcGFzcyB0aHJvdWdoIGVycm9yXG4gKiBmcm9tIHNvdXJjZSBPYnNlcnZhYmxlIGltbWVkaWF0ZWx5IHdoZW4gaXQgaXMgZW1pdHRlZC4gSW4gZ2VuZXJhbCBpdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdG8gdXNlIGBkZWxheWAgb3BlcmF0b3JcbiAqIGZvciBhbnkga2luZCBvZiBkZWxheWluZyBvZiB2YWx1ZXMgaW4gdGhlIHN0cmVhbSwgd2hpbGUgdXNpbmcgYG9ic2VydmVPbmAgdG8gc3BlY2lmeSB3aGljaCBzY2hlZHVsZXIgc2hvdWxkIGJlIHVzZWRcbiAqIGZvciBub3RpZmljYXRpb24gZW1pc3Npb25zIGluIGdlbmVyYWwuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW5zdXJlIHZhbHVlcyBpbiBzdWJzY3JpYmUgYXJlIGNhbGxlZCBqdXN0IGJlZm9yZSBicm93c2VyIHJlcGFpbnQuXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBpbnRlcnZhbHMgPSBpbnRlcnZhbCgxMCk7ICAgICAgICAgICAgICAgIC8vIEludGVydmFscyBhcmUgc2NoZWR1bGVkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpdGggYXN5bmMgc2NoZWR1bGVyIGJ5IGRlZmF1bHQuLi5cbiAqIGludGVydmFscy5waXBlKFxuICogICBvYnNlcnZlT24oYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpLCAgICAgICAgICAvLyAuLi5idXQgd2Ugd2lsbCBvYnNlcnZlIG9uIGFuaW1hdGlvbkZyYW1lXG4gKiApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNjaGVkdWxlciB0byBlbnN1cmUgc21vb3RoIGFuaW1hdGlvbi5cbiAqIC5zdWJzY3JpYmUodmFsID0+IHtcbiAqICAgc29tZURpdi5zdHlsZS5oZWlnaHQgPSB2YWwgKyAncHgnO1xuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IHNjaGVkdWxlciBTY2hlZHVsZXIgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVzY2hlZHVsZSBub3RpZmljYXRpb25zIGZyb20gc291cmNlIE9ic2VydmFibGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgc3RhdGVzIHdpdGggd2hhdCBkZWxheSBldmVyeSBub3RpZmljYXRpb24gc2hvdWxkIGJlIHJlc2NoZWR1bGVkLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBzYW1lIG5vdGlmaWNhdGlvbnMgYXMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLFxuICogYnV0IHdpdGggcHJvdmlkZWQgc2NoZWR1bGVyLlxuICpcbiAqIEBtZXRob2Qgb2JzZXJ2ZU9uXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZU9uPFQ+KHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSwgZGVsYXk6IG51bWJlciA9IDApOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gb2JzZXJ2ZU9uT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IE9ic2VydmVPbk9wZXJhdG9yKHNjaGVkdWxlciwgZGVsYXkpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIE9ic2VydmVPbk9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSwgcHJpdmF0ZSBkZWxheTogbnVtYmVyID0gMCkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPYnNlcnZlT25TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuc2NoZWR1bGVyLCB0aGlzLmRlbGF5KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZlT25TdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPE9ic2VydmVPbk1lc3NhZ2U+LCBhcmc6IE9ic2VydmVPbk1lc3NhZ2UpIHtcbiAgICBjb25zdCB7IG5vdGlmaWNhdGlvbiwgZGVzdGluYXRpb24gfSA9IGFyZztcbiAgICBub3RpZmljYXRpb24ub2JzZXJ2ZShkZXN0aW5hdGlvbik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICBwcml2YXRlIGRlbGF5OiBudW1iZXIgPSAwKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZU1lc3NhZ2Uobm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgZGVzdGluYXRpb24uYWRkKHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKFxuICAgICAgT2JzZXJ2ZU9uU3Vic2NyaWJlci5kaXNwYXRjaCxcbiAgICAgIHRoaXMuZGVsYXksXG4gICAgICBuZXcgT2JzZXJ2ZU9uTWVzc2FnZShub3RpZmljYXRpb24sIHRoaXMuZGVzdGluYXRpb24pXG4gICAgKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlTmV4dCh2YWx1ZSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2NoZWR1bGVNZXNzYWdlKE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuc2NoZWR1bGVNZXNzYWdlKE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9ic2VydmVPbk1lc3NhZ2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PixcbiAgICAgICAgICAgICAgcHVibGljIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8YW55Pikge1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHF1ZXVlIH0gZnJvbSAnLi9zY2hlZHVsZXIvcXVldWUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZlT25TdWJzY3JpYmVyIH0gZnJvbSAnLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YmplY3RTdWJzY3JpcHRpb24nO1xuLyoqXG4gKiBBIHZhcmlhbnQgb2YgU3ViamVjdCB0aGF0IFwicmVwbGF5c1wiIG9yIGVtaXRzIG9sZCB2YWx1ZXMgdG8gbmV3IHN1YnNjcmliZXJzLlxuICogSXQgYnVmZmVycyBhIHNldCBudW1iZXIgb2YgdmFsdWVzIGFuZCB3aWxsIGVtaXQgdGhvc2UgdmFsdWVzIGltbWVkaWF0ZWx5IHRvXG4gKiBhbnkgbmV3IHN1YnNjcmliZXJzIGluIGFkZGl0aW9uIHRvIGVtaXR0aW5nIG5ldyB2YWx1ZXMgdG8gZXhpc3Rpbmcgc3Vic2NyaWJlcnMuXG4gKlxuICogQGNsYXNzIFJlcGxheVN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlcGxheVN1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSBfZXZlbnRzOiAoUmVwbGF5RXZlbnQ8VD4gfCBUKVtdID0gW107XG4gIHByaXZhdGUgX2J1ZmZlclNpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfd2luZG93VGltZTogbnVtYmVyO1xuICBwcml2YXRlIF9pbmZpbml0ZVRpbWVXaW5kb3c6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihidWZmZXJTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgIHdpbmRvd1RpbWU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9idWZmZXJTaXplID0gYnVmZmVyU2l6ZSA8IDEgPyAxIDogYnVmZmVyU2l6ZTtcbiAgICB0aGlzLl93aW5kb3dUaW1lID0gd2luZG93VGltZSA8IDEgPyAxIDogd2luZG93VGltZTtcblxuICAgIGlmICh3aW5kb3dUaW1lID09PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuX2luZmluaXRlVGltZVdpbmRvdyA9IHRydWU7XG4gICAgICB0aGlzLm5leHQgPSB0aGlzLm5leHRJbmZpbml0ZVRpbWVXaW5kb3c7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmV4dCA9IHRoaXMubmV4dFRpbWVXaW5kb3c7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBuZXh0SW5maW5pdGVUaW1lV2luZG93KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgX2V2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICBfZXZlbnRzLnB1c2godmFsdWUpO1xuICAgIC8vIFNpbmNlIHRoaXMgbWV0aG9kIGlzIGludm9rZWQgaW4gZXZlcnkgbmV4dCgpIGNhbGwgdGhhbiB0aGUgYnVmZmVyXG4gICAgLy8gY2FuIG92ZXJncm93IHRoZSBtYXggc2l6ZSBvbmx5IGJ5IG9uZSBpdGVtXG4gICAgaWYgKF9ldmVudHMubGVuZ3RoID4gdGhpcy5fYnVmZmVyU2l6ZSkge1xuICAgICAgX2V2ZW50cy5zaGlmdCgpO1xuICAgIH1cblxuICAgIHN1cGVyLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXh0VGltZVdpbmRvdyh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuX2V2ZW50cy5wdXNoKG5ldyBSZXBsYXlFdmVudCh0aGlzLl9nZXROb3coKSwgdmFsdWUpKTtcbiAgICB0aGlzLl90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpO1xuXG4gICAgc3VwZXIubmV4dCh2YWx1ZSk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgLy8gV2hlbiBgX2luZmluaXRlVGltZVdpbmRvdyA9PT0gdHJ1ZWAgdGhlbiB0aGUgYnVmZmVyIGlzIGFscmVhZHkgdHJpbW1lZFxuICAgIGNvbnN0IF9pbmZpbml0ZVRpbWVXaW5kb3cgPSB0aGlzLl9pbmZpbml0ZVRpbWVXaW5kb3c7XG4gICAgY29uc3QgX2V2ZW50cyA9IF9pbmZpbml0ZVRpbWVXaW5kb3cgPyB0aGlzLl9ldmVudHMgOiB0aGlzLl90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgIGNvbnN0IGxlbiA9IF9ldmVudHMubGVuZ3RoO1xuICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCB8fCB0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3ViamVjdFN1YnNjcmlwdGlvbih0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICB9XG5cbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICBzdWJzY3JpYmVyLmFkZChzdWJzY3JpYmVyID0gbmV3IE9ic2VydmVPblN1YnNjcmliZXI8VD4oc3Vic2NyaWJlciwgc2NoZWR1bGVyKSk7XG4gICAgfVxuXG4gICAgaWYgKF9pbmZpbml0ZVRpbWVXaW5kb3cpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCg8VD5fZXZlbnRzW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KCg8UmVwbGF5RXZlbnQ8VD4+X2V2ZW50c1tpXSkudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgX2dldE5vdygpOiBudW1iZXIge1xuICAgIHJldHVybiAodGhpcy5zY2hlZHVsZXIgfHwgcXVldWUpLm5vdygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTogUmVwbGF5RXZlbnQ8VD5bXSB7XG4gICAgY29uc3Qgbm93ID0gdGhpcy5fZ2V0Tm93KCk7XG4gICAgY29uc3QgX2J1ZmZlclNpemUgPSB0aGlzLl9idWZmZXJTaXplO1xuICAgIGNvbnN0IF93aW5kb3dUaW1lID0gdGhpcy5fd2luZG93VGltZTtcbiAgICBjb25zdCBfZXZlbnRzID0gPFJlcGxheUV2ZW50PFQ+W10+dGhpcy5fZXZlbnRzO1xuXG4gICAgY29uc3QgZXZlbnRzQ291bnQgPSBfZXZlbnRzLmxlbmd0aDtcbiAgICBsZXQgc3BsaWNlQ291bnQgPSAwO1xuXG4gICAgLy8gVHJpbSBldmVudHMgdGhhdCBmYWxsIG91dCBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICAgLy8gU3RhcnQgYXQgdGhlIGZyb250IG9mIHRoZSBsaXN0LiBCcmVhayBlYXJseSBvbmNlXG4gICAgLy8gd2UgZW5jb3VudGVyIGFuIGV2ZW50IHRoYXQgZmFsbHMgd2l0aGluIHRoZSB3aW5kb3cuXG4gICAgd2hpbGUgKHNwbGljZUNvdW50IDwgZXZlbnRzQ291bnQpIHtcbiAgICAgIGlmICgobm93IC0gX2V2ZW50c1tzcGxpY2VDb3VudF0udGltZSkgPCBfd2luZG93VGltZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHNwbGljZUNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50c0NvdW50ID4gX2J1ZmZlclNpemUpIHtcbiAgICAgIHNwbGljZUNvdW50ID0gTWF0aC5tYXgoc3BsaWNlQ291bnQsIGV2ZW50c0NvdW50IC0gX2J1ZmZlclNpemUpO1xuICAgIH1cblxuICAgIGlmIChzcGxpY2VDb3VudCA+IDApIHtcbiAgICAgIF9ldmVudHMuc3BsaWNlKDAsIHNwbGljZUNvdW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2V2ZW50cztcbiAgfVxuXG59XG5cbmNsYXNzIFJlcGxheUV2ZW50PFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRpbWU6IG51bWJlciwgcHVibGljIHZhbHVlOiBUKSB7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogQSB2YXJpYW50IG9mIFN1YmplY3QgdGhhdCBvbmx5IGVtaXRzIGEgdmFsdWUgd2hlbiBpdCBjb21wbGV0ZXMuIEl0IHdpbGwgZW1pdFxuICogaXRzIGxhdGVzdCB2YWx1ZSB0byBhbGwgaXRzIG9ic2VydmVycyBvbiBjb21wbGV0aW9uLlxuICpcbiAqIEBjbGFzcyBBc3luY1N1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzeW5jU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBwcml2YXRlIHZhbHVlOiBUID0gbnVsbDtcbiAgcHJpdmF0ZSBoYXNOZXh0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgaGFzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pik6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDb21wbGV0ZWQgJiYgdGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLmhhc05leHQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICBzdXBlci5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5oYXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmhhc05leHQpIHtcbiAgICAgIHN1cGVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIHN1cGVyLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiIsImxldCBuZXh0SGFuZGxlID0gMTtcblxuY29uc3QgdGFza3NCeUhhbmRsZTogeyBbaGFuZGxlOiBzdHJpbmddOiAoKSA9PiB2b2lkIH0gPSB7fTtcblxuZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZTogbnVtYmVyKSB7XG4gIGNvbnN0IGNiID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICBpZiAoY2IpIHtcbiAgICBjYigpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBJbW1lZGlhdGUgPSB7XG4gIHNldEltbWVkaWF0ZShjYjogKCkgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgY29uc3QgaGFuZGxlID0gbmV4dEhhbmRsZSsrO1xuICAgIHRhc2tzQnlIYW5kbGVbaGFuZGxlXSA9IGNiO1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gcnVuSWZQcmVzZW50KGhhbmRsZSkpO1xuICAgIHJldHVybiBoYW5kbGU7XG4gIH0sXG5cbiAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICB9LFxufTtcbiIsImltcG9ydCB7IEltbWVkaWF0ZSB9IGZyb20gJy4uL3V0aWwvSW1tZWRpYXRlJztcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc2FwU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQXNhcEFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBc2FwU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFzYXBTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgaXMgZ3JlYXRlciB0aGFuIDAsIHJlcXVlc3QgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIFB1c2ggdGhlIGFjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUuXG4gICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAvLyBJZiBhIG1pY3JvdGFzayBoYXMgYWxyZWFkeSBiZWVuIHNjaGVkdWxlZCwgZG9uJ3Qgc2NoZWR1bGUgYW5vdGhlclxuICAgIC8vIG9uZS4gSWYgYSBtaWNyb3Rhc2sgaGFzbid0IGJlZW4gc2NoZWR1bGVkIHlldCwgc2NoZWR1bGUgb25lIG5vdy4gUmV0dXJuXG4gICAgLy8gdGhlIGN1cnJlbnQgc2NoZWR1bGVkIG1pY3JvdGFzayBpZC5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlZCB8fCAoc2NoZWR1bGVyLnNjaGVkdWxlZCA9IEltbWVkaWF0ZS5zZXRJbW1lZGlhdGUoXG4gICAgICBzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIG51bGwpXG4gICAgKSk7XG4gIH1cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQXNhcFNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBlbXB0eSwgY2FuY2VsIHRoZSByZXF1ZXN0ZWQgbWljcm90YXNrIGFuZFxuICAgIC8vIHNldCB0aGUgc2NoZWR1bGVkIGZsYWcgdG8gdW5kZWZpbmVkIHNvIHRoZSBuZXh0IEFzYXBBY3Rpb24gd2lsbCBzY2hlZHVsZVxuICAgIC8vIGl0cyBvd24uXG4gICAgaWYgKHNjaGVkdWxlci5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgSW1tZWRpYXRlLmNsZWFySW1tZWRpYXRlKGlkKTtcbiAgICAgIHNjaGVkdWxlci5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB1bmRlZmluZWQgc28gdGhlIGFjdGlvbiBrbm93cyB0byByZXF1ZXN0IGEgbmV3IGFzeW5jIGlkIGlmIGl0J3MgcmVzY2hlZHVsZWQuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbmV4cG9ydCBjbGFzcyBBc2FwU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuICBwdWJsaWMgZmx1c2goYWN0aW9uPzogQXN5bmNBY3Rpb248YW55Pik6IHZvaWQge1xuXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qge2FjdGlvbnN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueTtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgIGxldCBjb3VudDogbnVtYmVyID0gYWN0aW9ucy5sZW5ndGg7XG4gICAgYWN0aW9uID0gYWN0aW9uIHx8IGFjdGlvbnMuc2hpZnQoKTtcblxuICAgIGRvIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXNhcEFjdGlvbiB9IGZyb20gJy4vQXNhcEFjdGlvbic7XG5pbXBvcnQgeyBBc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc2FwU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXNhcCBTY2hlZHVsZXJcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UGVyZm9ybSB0YXNrIGFzIGZhc3QgYXMgaXQgY2FuIGJlIHBlcmZvcm1lZCBhc3luY2hyb25vdXNseTwvc3Bhbj5cbiAqXG4gKiBgYXNhcGAgc2NoZWR1bGVyIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXIgd2hlbiB5b3UgdXNlIGl0IHRvIGRlbGF5IHRhc2tcbiAqIGluIHRpbWUuIElmIGhvd2V2ZXIgeW91IHNldCBkZWxheSB0byBgMGAsIGBhc2FwYCB3aWxsIHdhaXQgZm9yIGN1cnJlbnQgc3luY2hyb25vdXNseSBleGVjdXRpbmdcbiAqIGNvZGUgdG8gZW5kIGFuZCB0aGVuIGl0IHdpbGwgdHJ5IHRvIGV4ZWN1dGUgZ2l2ZW4gdGFzayBhcyBmYXN0IGFzIHBvc3NpYmxlLlxuICpcbiAqIGBhc2FwYCBzY2hlZHVsZXIgd2lsbCBkbyBpdHMgYmVzdCB0byBtaW5pbWl6ZSB0aW1lIGJldHdlZW4gZW5kIG9mIGN1cnJlbnRseSBleGVjdXRpbmcgY29kZVxuICogYW5kIHN0YXJ0IG9mIHNjaGVkdWxlZCB0YXNrLiBUaGlzIG1ha2VzIGl0IGJlc3QgY2FuZGlkYXRlIGZvciBwZXJmb3JtaW5nIHNvIGNhbGxlZCBcImRlZmVycmluZ1wiLlxuICogVHJhZGl0aW9uYWxseSB0aGlzIHdhcyBhY2hpZXZlZCBieSBjYWxsaW5nIGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgLCBidXQgdGhhdCB0ZWNobmlxdWUgaW52b2x2ZXNcbiAqIHNvbWUgKGFsdGhvdWdoIG1pbmltYWwpIHVud2FudGVkIGRlbGF5LlxuICpcbiAqIE5vdGUgdGhhdCB1c2luZyBgYXNhcGAgc2NoZWR1bGVyIGRvZXMgbm90IG5lY2Vzc2FyaWx5IG1lYW4gdGhhdCB5b3VyIHRhc2sgd2lsbCBiZSBmaXJzdCB0byBwcm9jZXNzXG4gKiBhZnRlciBjdXJyZW50bHkgZXhlY3V0aW5nIGNvZGUuIEluIHBhcnRpY3VsYXIsIGlmIHNvbWUgdGFzayB3YXMgYWxzbyBzY2hlZHVsZWQgd2l0aCBgYXNhcGAgYmVmb3JlLFxuICogdGhhdCB0YXNrIHdpbGwgZXhlY3V0ZSBmaXJzdC4gVGhhdCBiZWluZyBzYWlkLCBpZiB5b3UgbmVlZCB0byBzY2hlZHVsZSB0YXNrIGFzeW5jaHJvbm91c2x5LCBidXRcbiAqIGFzIHNvb24gYXMgcG9zc2libGUsIGBhc2FwYCBzY2hlZHVsZXIgaXMgeW91ciBiZXN0IGJldC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb21wYXJlIGFzeW5jIGFuZCBhc2FwIHNjaGVkdWxlcjxcbiAqIGBgYGphdmFzY3JpcHRcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnYXN5bmMnKSk7IC8vIHNjaGVkdWxpbmcgJ2FzeW5jJyBmaXJzdC4uLlxuICogUnguU2NoZWR1bGVyLmFzYXAuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ2FzYXAnKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiYXNhcFwiXG4gKiAvLyBcImFzeW5jXCJcbiAqIC8vIC4uLiBidXQgJ2FzYXAnIGdvZXMgZmlyc3QhXG4gKiBgYGBcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYXNhcFxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhc2FwID0gbmV3IEFzYXBTY2hlZHVsZXIoQXNhcEFjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXN5bmMgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlNjaGVkdWxlIHRhc2sgYXMgaWYgeW91IHVzZWQgc2V0VGltZW91dCh0YXNrLCBkdXJhdGlvbik8L3NwYW4+XG4gKlxuICogYGFzeW5jYCBzY2hlZHVsZXIgc2NoZWR1bGVzIHRhc2tzIGFzeW5jaHJvbm91c2x5LCBieSBwdXR0aW5nIHRoZW0gb24gdGhlIEphdmFTY3JpcHRcbiAqIGV2ZW50IGxvb3AgcXVldWUuIEl0IGlzIGJlc3QgdXNlZCB0byBkZWxheSB0YXNrcyBpbiB0aW1lIG9yIHRvIHNjaGVkdWxlIHRhc2tzIHJlcGVhdGluZ1xuICogaW4gaW50ZXJ2YWxzLlxuICpcbiAqIElmIHlvdSBqdXN0IHdhbnQgdG8gXCJkZWZlclwiIHRhc2ssIHRoYXQgaXMgdG8gcGVyZm9ybSBpdCByaWdodCBhZnRlciBjdXJyZW50bHlcbiAqIGV4ZWN1dGluZyBzeW5jaHJvbm91cyBjb2RlIGVuZHMgKGNvbW1vbmx5IGFjaGlldmVkIGJ5IGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgKSxcbiAqIGJldHRlciBjaG9pY2Ugd2lsbCBiZSB0aGUge0BsaW5rIGFzYXBTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogVXNlIGFzeW5jIHNjaGVkdWxlciB0byBkZWxheSB0YXNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0YXNrID0gKCkgPT4gY29uc29sZS5sb2coJ2l0IHdvcmtzIScpO1xuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAyMDAwKTtcbiAqXG4gKiAvLyBBZnRlciAyIHNlY29uZHMgbG9nczpcbiAqIC8vIFwiaXQgd29ya3MhXCJcbiAqIGBgYFxuICpcbiAqIFVzZSBhc3luYyBzY2hlZHVsZXIgdG8gcmVwZWF0IHRhc2sgaW4gaW50ZXJ2YWxzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiB0YXNrKHN0YXRlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAqICAgdGhpcy5zY2hlZHVsZShzdGF0ZSArIDEsIDEwMDApOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlIGFuZCBkZWxheVxuICogfVxuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAzMDAwLCAwKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMCBhZnRlciAzc1xuICogLy8gMSBhZnRlciA0c1xuICogLy8gMiBhZnRlciA1c1xuICogLy8gMyBhZnRlciA2c1xuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhc3luY1xuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhc3luYyA9IG5ldyBBc3luY1NjaGVkdWxlcihBc3luY0FjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZUFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBpcyBncmVhdGVyIHRoYW4gMCwgcmVxdWVzdCBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gUHVzaCB0aGUgYWN0aW9uIHRvIHRoZSBlbmQgb2YgdGhlIHNjaGVkdWxlciBxdWV1ZS5cbiAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIC8vIElmIGFuIGFuaW1hdGlvbiBmcmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZCwgZG9uJ3QgcmVxdWVzdCBhbm90aGVyXG4gICAgLy8gb25lLiBJZiBhbiBhbmltYXRpb24gZnJhbWUgaGFzbid0IGJlZW4gcmVxdWVzdGVkIHlldCwgcmVxdWVzdCBvbmUuIFJldHVyblxuICAgIC8vIHRoZSBjdXJyZW50IGFuaW1hdGlvbiBmcmFtZSByZXF1ZXN0IGlkLlxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGVkIHx8IChzY2hlZHVsZXIuc2NoZWR1bGVkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKFxuICAgICAgKCkgPT4gc2NoZWR1bGVyLmZsdXNoKG51bGwpKSk7XG4gIH1cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBzY2hlZHVsZXIgcXVldWUgaXMgZW1wdHksIGNhbmNlbCB0aGUgcmVxdWVzdGVkIGFuaW1hdGlvbiBmcmFtZSBhbmRcbiAgICAvLyBzZXQgdGhlIHNjaGVkdWxlZCBmbGFnIHRvIHVuZGVmaW5lZCBzbyB0aGUgbmV4dCBBbmltYXRpb25GcmFtZUFjdGlvbiB3aWxsXG4gICAgLy8gcmVxdWVzdCBpdHMgb3duLlxuICAgIGlmIChzY2hlZHVsZXIuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgICAgIHNjaGVkdWxlci5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB1bmRlZmluZWQgc28gdGhlIGFjdGlvbiBrbm93cyB0byByZXF1ZXN0IGEgbmV3IGFzeW5jIGlkIGlmIGl0J3MgcmVzY2hlZHVsZWQuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgcHVibGljIGZsdXNoKGFjdGlvbj86IEFzeW5jQWN0aW9uPGFueT4pOiB2b2lkIHtcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHthY3Rpb25zfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IGFjdGlvbnMubGVuZ3RoO1xuICAgIGFjdGlvbiA9IGFjdGlvbiB8fCBhY3Rpb25zLnNoaWZ0KCk7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKTtcblxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFuaW1hdGlvbkZyYW1lQWN0aW9uIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZUFjdGlvbic7XG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXInO1xuXG4vKipcbiAqXG4gKiBBbmltYXRpb24gRnJhbWUgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlBlcmZvcm0gdGFzayB3aGVuIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB3b3VsZCBmaXJlPC9zcGFuPlxuICpcbiAqIFdoZW4gYGFuaW1hdGlvbkZyYW1lYCBzY2hlZHVsZXIgaXMgdXNlZCB3aXRoIGRlbGF5LCBpdCB3aWxsIGZhbGwgYmFjayB0byB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlclxuICogYmVoYXZpb3VyLlxuICpcbiAqIFdpdGhvdXQgZGVsYXksIGBhbmltYXRpb25GcmFtZWAgc2NoZWR1bGVyIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBzbW9vdGggYnJvd3NlciBhbmltYXRpb25zLlxuICogSXQgbWFrZXMgc3VyZSBzY2hlZHVsZWQgdGFzayB3aWxsIGhhcHBlbiBqdXN0IGJlZm9yZSBuZXh0IGJyb3dzZXIgY29udGVudCByZXBhaW50LFxuICogdGh1cyBwZXJmb3JtaW5nIGFuaW1hdGlvbnMgYXMgZWZmaWNpZW50bHkgYXMgcG9zc2libGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2NoZWR1bGUgZGl2IGhlaWdodCBhbmltYXRpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb21lLWRpdicpO1xuICpcbiAqIFJ4LlNjaGVkdWxlci5hbmltYXRpb25GcmFtZS5zY2hlZHVsZShmdW5jdGlvbihoZWlnaHQpIHtcbiAqICAgZGl2LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAqXG4gKiAgIHRoaXMuc2NoZWR1bGUoaGVpZ2h0ICsgMSk7ICAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdlIHJlc2NoZWR1bGUgd2l0aCBuZXcgc3RhdGVcbiAqIH0sIDAsIDApO1xuICpcbiAqIC8vIFlvdSB3aWxsIHNlZSAuc29tZS1kaXYgZWxlbWVudCBncm93aW5nIGluIGhlaWdodFxuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhbmltYXRpb25GcmFtZVxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhbmltYXRpb25GcmFtZSA9IG5ldyBBbmltYXRpb25GcmFtZVNjaGVkdWxlcihBbmltYXRpb25GcmFtZUFjdGlvbik7XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBWaXJ0dWFsVGltZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcblxuICBwcm90ZWN0ZWQgc3RhdGljIGZyYW1lVGltZUZhY3RvcjogbnVtYmVyID0gMTA7XG5cbiAgcHVibGljIGZyYW1lOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgaW5kZXg6IG51bWJlciA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFzeW5jQWN0aW9uID0gVmlydHVhbEFjdGlvbiBhcyBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyBtYXhGcmFtZXM6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgIHN1cGVyKFNjaGVkdWxlckFjdGlvbiwgKCkgPT4gdGhpcy5mcmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJvbXB0IHRoZSBTY2hlZHVsZXIgdG8gZXhlY3V0ZSBhbGwgb2YgaXRzIHF1ZXVlZCBhY3Rpb25zLCB0aGVyZWZvcmVcbiAgICogY2xlYXJpbmcgaXRzIHF1ZXVlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcHVibGljIGZsdXNoKCk6IHZvaWQge1xuXG4gICAgY29uc3Qge2FjdGlvbnMsIG1heEZyYW1lc30gPSB0aGlzO1xuICAgIGxldCBlcnJvcjogYW55LCBhY3Rpb246IEFzeW5jQWN0aW9uPGFueT47XG5cbiAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkgJiYgKHRoaXMuZnJhbWUgPSBhY3Rpb24uZGVsYXkpIDw9IG1heEZyYW1lcykge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAbm9kb2NcbiAqL1xuZXhwb3J0IGNsYXNzIFZpcnR1YWxBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgcHJvdGVjdGVkIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gc2NoZWR1bGVyLmluZGV4ICs9IDEpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgIHRoaXMuaW5kZXggPSBzY2hlZHVsZXIuaW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIC8vIElmIGFuIGFjdGlvbiBpcyByZXNjaGVkdWxlZCwgd2Ugc2F2ZSBhbGxvY2F0aW9ucyBieSBtdXRhdGluZyBpdHMgc3RhdGUsXG4gICAgLy8gcHVzaGluZyBpdCB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUsIGFuZCByZWN5Y2xpbmcgdGhlIGFjdGlvbi5cbiAgICAvLyBCdXQgc2luY2UgdGhlIFZpcnR1YWxUaW1lU2NoZWR1bGVyIGlzIHVzZWQgZm9yIHRlc3RpbmcsIFZpcnR1YWxBY3Rpb25zXG4gICAgLy8gbXVzdCBiZSBpbW11dGFibGUgc28gdGhleSBjYW4gYmUgaW5zcGVjdGVkIGxhdGVyLlxuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBWaXJ0dWFsQWN0aW9uKHRoaXMuc2NoZWR1bGVyLCB0aGlzLndvcmspO1xuICAgIHRoaXMuYWRkKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgdGhpcy5kZWxheSA9IHNjaGVkdWxlci5mcmFtZSArIGRlbGF5O1xuICAgIGNvbnN0IHthY3Rpb25zfSA9IHNjaGVkdWxlcjtcbiAgICBhY3Rpb25zLnB1c2godGhpcyk7XG4gICAgKGFjdGlvbnMgYXMgQXJyYXk8VmlydHVhbEFjdGlvbjxUPj4pLnNvcnQoVmlydHVhbEFjdGlvbi5zb3J0QWN0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBWaXJ0dWFsVGltZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9leGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzdXBlci5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc29ydEFjdGlvbnM8VD4oYTogVmlydHVhbEFjdGlvbjxUPiwgYjogVmlydHVhbEFjdGlvbjxUPikge1xuICAgIGlmIChhLmRlbGF5ID09PSBiLmRlbGF5KSB7XG4gICAgICBpZiAoYS5pbmRleCA9PT0gYi5pbmRleCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSBpZiAoYS5pbmRleCA+IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhLmRlbGF5ID4gYi5kZWxheSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eTxUPih4OiBUKTogVCB7XG4gIHJldHVybiB4O1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRlc3RzIHRvIHNlZSBpZiB0aGUgb2JqZWN0IGlzIGFuIFJ4SlMge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAcGFyYW0gb2JqIHRoZSBvYmplY3QgdG8gdGVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYnNlcnZhYmxlPFQ+KG9iajogYW55KTogb2JqIGlzIE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gISFvYmogJiYgKG9iaiBpbnN0YW5jZW9mIE9ic2VydmFibGUgfHwgKHR5cGVvZiBvYmoubGlmdCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnN1YnNjcmliZSA9PT0gJ2Z1bmN0aW9uJykpO1xufVxuIiwiZXhwb3J0IGludGVyZmFjZSBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcmd1bWVudE91dE9mUmFuZ2VFcnJvckN0b3Ige1xuICBuZXcoKTogQXJndW1lbnRPdXRPZlJhbmdlRXJyb3I7XG59XG5cbmZ1bmN0aW9uIEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9ySW1wbCh0aGlzOiBhbnkpIHtcbiAgRXJyb3IuY2FsbCh0aGlzKTtcbiAgdGhpcy5tZXNzYWdlID0gJ2FyZ3VtZW50IG91dCBvZiByYW5nZSc7XG4gIHRoaXMubmFtZSA9ICdBcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG4gIHJldHVybiB0aGlzO1xufVxuXG5Bcmd1bWVudE91dE9mUmFuZ2VFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIGFuIGVsZW1lbnQgd2FzIHF1ZXJpZWQgYXQgYSBjZXJ0YWluIGluZGV4IG9mIGFuXG4gKiBPYnNlcnZhYmxlLCBidXQgbm8gc3VjaCBpbmRleCBvciBwb3NpdGlvbiBleGlzdHMgaW4gdGhhdCBzZXF1ZW5jZS5cbiAqXG4gKiBAc2VlIHtAbGluayBlbGVtZW50QXR9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZUxhc3R9XG4gKlxuICogQGNsYXNzIEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yXG4gKi9cbmV4cG9ydCBjb25zdCBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcjogQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JDdG9yID0gQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JJbXBsIGFzIGFueTsiLCJleHBvcnQgaW50ZXJmYWNlIEVtcHR5RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW1wdHlFcnJvckN0b3Ige1xuICBuZXcoKTogRW1wdHlFcnJvcjtcbn1cblxuZnVuY3Rpb24gRW1wdHlFcnJvckltcGwodGhpczogYW55KSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9ICdubyBlbGVtZW50cyBpbiBzZXF1ZW5jZSc7XG4gIHRoaXMubmFtZSA9ICdFbXB0eUVycm9yJztcbiAgcmV0dXJuIHRoaXM7XG59XG5cbkVtcHR5RXJyb3JJbXBsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhbiBPYnNlcnZhYmxlIG9yIGEgc2VxdWVuY2Ugd2FzIHF1ZXJpZWQgYnV0IGhhcyBub1xuICogZWxlbWVudHMuXG4gKlxuICogQHNlZSB7QGxpbmsgZmlyc3R9XG4gKiBAc2VlIHtAbGluayBsYXN0fVxuICogQHNlZSB7QGxpbmsgc2luZ2xlfVxuICpcbiAqIEBjbGFzcyBFbXB0eUVycm9yXG4gKi9cbmV4cG9ydCBjb25zdCBFbXB0eUVycm9yOiBFbXB0eUVycm9yQ3RvciA9IEVtcHR5RXJyb3JJbXBsIGFzIGFueTsiLCJleHBvcnQgaW50ZXJmYWNlIFRpbWVvdXRFcnJvciBleHRlbmRzIEVycm9yIHtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUaW1lb3V0RXJyb3JDdG9yIHtcclxuICBuZXcoKTogVGltZW91dEVycm9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBUaW1lb3V0RXJyb3JJbXBsKHRoaXM6IGFueSkge1xyXG4gIEVycm9yLmNhbGwodGhpcyk7XHJcbiAgdGhpcy5tZXNzYWdlID0gJ1RpbWVvdXQgaGFzIG9jY3VycmVkJztcclxuICB0aGlzLm5hbWUgPSAnVGltZW91dEVycm9yJztcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuVGltZW91dEVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XHJcblxyXG4vKipcclxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gZHVldGltZSBlbGFwc2VzLlxyXG4gKlxyXG4gKiBAc2VlIHtAbGluayB0aW1lb3V0fVxyXG4gKlxyXG4gKiBAY2xhc3MgVGltZW91dEVycm9yXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVGltZW91dEVycm9yOiBUaW1lb3V0RXJyb3JDdG9yID0gVGltZW91dEVycm9ySW1wbCBhcyBhbnk7XHJcbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBBcHBsaWVzIGEgZ2l2ZW4gYHByb2plY3RgIGZ1bmN0aW9uIHRvIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLCBhbmQgZW1pdHMgdGhlIHJlc3VsdGluZyB2YWx1ZXMgYXMgYW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TGlrZSBbQXJyYXkucHJvdG90eXBlLm1hcCgpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXApLFxuICogaXQgcGFzc2VzIGVhY2ggc291cmNlIHZhbHVlIHRocm91Z2ggYSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbiB0byBnZXRcbiAqIGNvcnJlc3BvbmRpbmcgb3V0cHV0IHZhbHVlcy48L3NwYW4+XG4gKlxuICogIVtdKG1hcC5wbmcpXG4gKlxuICogU2ltaWxhciB0byB0aGUgd2VsbCBrbm93biBgQXJyYXkucHJvdG90eXBlLm1hcGAgZnVuY3Rpb24sIHRoaXMgb3BlcmF0b3JcbiAqIGFwcGxpZXMgYSBwcm9qZWN0aW9uIHRvIGVhY2ggdmFsdWUgYW5kIGVtaXRzIHRoYXQgcHJvamVjdGlvbiBpbiB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE1hcCBldmVyeSBjbGljayB0byB0aGUgY2xpZW50WCBwb3NpdGlvbiBvZiB0aGF0IGNsaWNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcG9zaXRpb25zID0gY2xpY2tzLnBpcGUobWFwKGV2ID0+IGV2LmNsaWVudFgpKTtcbiAqIHBvc2l0aW9ucy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXBUb31cbiAqIEBzZWUge0BsaW5rIHBsdWNrfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBSfSBwcm9qZWN0IFRoZSBmdW5jdGlvbiB0byBhcHBseVxuICogdG8gZWFjaCBgdmFsdWVgIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBUaGUgYGluZGV4YCBwYXJhbWV0ZXIgaXNcbiAqIHRoZSBudW1iZXIgYGlgIGZvciB0aGUgaS10aCBlbWlzc2lvbiB0aGF0IGhhcyBoYXBwZW5lZCBzaW5jZSB0aGVcbiAqIHN1YnNjcmlwdGlvbiwgc3RhcnRpbmcgZnJvbSB0aGUgbnVtYmVyIGAwYC5cbiAqIEBwYXJhbSB7YW55fSBbdGhpc0FyZ10gQW4gb3B0aW9uYWwgYXJndW1lbnQgdG8gZGVmaW5lIHdoYXQgYHRoaXNgIGlzIGluIHRoZVxuICogYHByb2plY3RgIGZ1bmN0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxSPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIHRyYW5zZm9ybWVkIGJ5IHRoZSBnaXZlbiBgcHJvamVjdGAgZnVuY3Rpb24uXG4gKiBAbWV0aG9kIG1hcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsIHRoaXNBcmc/OiBhbnkpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1hcE9wZXJhdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBpZiAodHlwZW9mIHByb2plY3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IGlzIG5vdCBhIGZ1bmN0aW9uLiBBcmUgeW91IGxvb2tpbmcgZm9yIGBtYXBUbygpYD8nKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBNYXBPcGVyYXRvcihwcm9qZWN0LCB0aGlzQXJnKSk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBNYXBPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsIHByaXZhdGUgdGhpc0FyZzogYW55KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgTWFwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnByb2plY3QsIHRoaXMudGhpc0FyZykpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBNYXBTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHRoaXNBcmc6IGFueTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsXG4gICAgICAgICAgICAgIHRoaXNBcmc6IGFueSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnRoaXNBcmcgPSB0aGlzQXJnIHx8IHRoaXM7XG4gIH1cblxuICAvLyBOT1RFOiBUaGlzIGxvb2tzIHVub3B0aW1pemVkLCBidXQgaXQncyBhY3R1YWxseSBwdXJwb3NlZnVsbHkgTk9UXG4gIC8vIHVzaW5nIHRyeS9jYXRjaCBvcHRpbWl6YXRpb25zLlxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJvamVjdC5jYWxsKHRoaXMudGhpc0FyZywgdmFsdWUsIHRoaXMuY291bnQrKyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuLi9Bc3luY1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBjYW5SZXBvcnRFcnJvciB9IGZyb20gJy4uL3V0aWwvY2FuUmVwb3J0RXJyb3InO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgYSBtYXBwaW5nIGZ1bmN0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgocmVzdWx0OiBSKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgoLi4ucmVzdWx0czogUltdKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSW10+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuLy8gdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGhcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbGxiYWNrIEFQSSB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5HaXZlIGl0IGEgZnVuY3Rpb24gYGZgIG9mIHR5cGUgYGYoeCwgY2FsbGJhY2spYCBhbmRcbiAqIGl0IHdpbGwgcmV0dXJuIGEgZnVuY3Rpb24gYGdgIHRoYXQgd2hlbiBjYWxsZWQgYXMgYGcoeClgIHdpbGwgb3V0cHV0IGFuXG4gKiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgYmluZENhbGxiYWNrYCBpcyBub3QgYW4gb3BlcmF0b3IgYmVjYXVzZSBpdHMgaW5wdXQgYW5kIG91dHB1dCBhcmUgbm90XG4gKiBPYnNlcnZhYmxlcy4gVGhlIGlucHV0IGlzIGEgZnVuY3Rpb24gYGZ1bmNgIHdpdGggc29tZSBwYXJhbWV0ZXJzLiBUaGVcbiAqIGxhc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGBmdW5jYCBjYWxscyB3aGVuIGl0IGlzXG4gKiBkb25lLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgYGJpbmRDYWxsYmFja2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzYW1lIHBhcmFtZXRlcnNcbiAqIGFzIGBmdW5jYCwgZXhjZXB0IHRoZSBsYXN0IG9uZSAodGhlIGNhbGxiYWNrKS4gV2hlbiB0aGUgb3V0cHV0IGZ1bmN0aW9uXG4gKiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgaXQgd2lsbCByZXR1cm4gYW4gT2JzZXJ2YWJsZS4gSWYgZnVuY3Rpb24gYGZ1bmNgXG4gKiBjYWxscyBpdHMgY2FsbGJhY2sgd2l0aCBvbmUgYXJndW1lbnQsIHRoZSBPYnNlcnZhYmxlIHdpbGwgZW1pdCB0aGF0IHZhbHVlLlxuICogSWYgb24gdGhlIG90aGVyIGhhbmQgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIG11bHRpcGxlIHZhbHVlcyB0aGUgcmVzdWx0aW5nXG4gKiBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIHNhaWQgdmFsdWVzIGFzIGFyZ3VtZW50cy5cbiAqXG4gKiBJdCBpcyAqKnZlcnkgaW1wb3J0YW50KiogdG8gcmVtZW1iZXIgdGhhdCBpbnB1dCBmdW5jdGlvbiBgZnVuY2AgaXMgbm90IGNhbGxlZFxuICogd2hlbiB0aGUgb3V0cHV0IGZ1bmN0aW9uIGlzLCBidXQgcmF0aGVyIHdoZW4gdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgdGhlIG91dHB1dFxuICogZnVuY3Rpb24gaXMgc3Vic2NyaWJlZC4gVGhpcyBtZWFucyBpZiBgZnVuY2AgbWFrZXMgYW4gQUpBWCByZXF1ZXN0LCB0aGF0IHJlcXVlc3RcbiAqIHdpbGwgYmUgbWFkZSBldmVyeSB0aW1lIHNvbWVvbmUgc3Vic2NyaWJlcyB0byB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGUsIGJ1dCBub3QgYmVmb3JlLlxuICpcbiAqIFRoZSBsYXN0IG9wdGlvbmFsIHBhcmFtZXRlciAtIGBzY2hlZHVsZXJgIC0gY2FuIGJlIHVzZWQgdG8gY29udHJvbCB3aGVuIHRoZSBjYWxsXG4gKiB0byBgZnVuY2AgaGFwcGVucyBhZnRlciBzb21lb25lIHN1YnNjcmliZXMgdG8gT2JzZXJ2YWJsZSwgYXMgd2VsbCBhcyB3aGVuIHJlc3VsdHNcbiAqIHBhc3NlZCB0byBjYWxsYmFjayB3aWxsIGJlIGVtaXR0ZWQuIEJ5IGRlZmF1bHQsIHRoZSBzdWJzY3JpcHRpb24gdG8gYW4gT2JzZXJ2YWJsZSBjYWxscyBgZnVuY2BcbiAqIHN5bmNocm9ub3VzbHksIGJ1dCB1c2luZyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGFzIHRoZSBsYXN0IHBhcmFtZXRlciB3aWxsIGRlZmVyIHRoZSBjYWxsIHRvIGBmdW5jYCxcbiAqIGp1c3QgbGlrZSB3cmFwcGluZyB0aGUgY2FsbCBpbiBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgIHdvdWxkLiBJZiB5b3Ugd2VyZSB0byB1c2UgdGhlIGFzeW5jIFNjaGVkdWxlclxuICogYW5kIGNhbGwgYHN1YnNjcmliZWAgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLCBhbGwgZnVuY3Rpb24gY2FsbHMgdGhhdCBhcmUgY3VycmVudGx5IGV4ZWN1dGluZ1xuICogd2lsbCBlbmQgYmVmb3JlIGBmdW5jYCBpcyBpbnZva2VkLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHJlc3VsdHMgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBhcmUgZW1pdHRlZCBpbW1lZGlhdGVseSBhZnRlciBgZnVuY2AgaW52b2tlcyB0aGUgY2FsbGJhY2suXG4gKiBJbiBwYXJ0aWN1bGFyLCBpZiB0aGUgY2FsbGJhY2sgaXMgY2FsbGVkIHN5bmNocm9ub3VzbHksIHRoZW4gdGhlIHN1YnNjcmlwdGlvbiBvZiB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGVcbiAqIHdpbGwgY2FsbCB0aGUgYG5leHRgIGZ1bmN0aW9uIHN5bmNocm9ub3VzbHkgYXMgd2VsbC4gIElmIHlvdSB3YW50IHRvIGRlZmVyIHRoYXQgY2FsbCxcbiAqIHlvdSBtYXkgdXNlIHtAbGluayBhc3luY1NjaGVkdWxlcn0ganVzdCBhcyBiZWZvcmUuICBUaGlzIG1lYW5zIHRoYXQgYnkgdXNpbmcgYFNjaGVkdWxlci5hc3luY2AgeW91IGNhblxuICogZW5zdXJlIHRoYXQgYGZ1bmNgIGFsd2F5cyBjYWxscyBpdHMgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHksIHRodXMgYXZvaWRpbmcgdGVycmlmeWluZyBaYWxnby5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIE9ic2VydmFibGUgY3JlYXRlZCBieSB0aGUgb3V0cHV0IGZ1bmN0aW9uIHdpbGwgYWx3YXlzIGVtaXQgYSBzaW5nbGUgdmFsdWVcbiAqIGFuZCB0aGVuIGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBJZiBgZnVuY2AgY2FsbHMgdGhlIGNhbGxiYWNrIG11bHRpcGxlIHRpbWVzLCB2YWx1ZXMgZnJvbSBzdWJzZXF1ZW50XG4gKiBjYWxscyB3aWxsIG5vdCBhcHBlYXIgaW4gdGhlIHN0cmVhbS4gSWYgeW91IG5lZWQgdG8gbGlzdGVuIGZvciBtdWx0aXBsZSBjYWxscyxcbiAqICB5b3UgcHJvYmFibHkgd2FudCB0byB1c2Uge0BsaW5rIGZyb21FdmVudH0gb3Ige0BsaW5rIGZyb21FdmVudFBhdHRlcm59IGluc3RlYWQuXG4gKlxuICogSWYgYGZ1bmNgIGRlcGVuZHMgb24gc29tZSBjb250ZXh0IChgdGhpc2AgcHJvcGVydHkpIGFuZCBpcyBub3QgYWxyZWFkeSBib3VuZCwgdGhlIGNvbnRleHQgb2YgYGZ1bmNgXG4gKiB3aWxsIGJlIHRoZSBjb250ZXh0IHRoYXQgdGhlIG91dHB1dCBmdW5jdGlvbiBoYXMgYXQgY2FsbCB0aW1lLiBJbiBwYXJ0aWN1bGFyLCBpZiBgZnVuY2BcbiAqIGlzIGNhbGxlZCBhcyBhIG1ldGhvZCBvZiBzb21lIG9iamVjIGFuZCBpZiBgZnVuY2AgaXMgbm90IGFscmVhZHkgYm91bmQsIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0XG4gKiBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHRoZSBjb250ZXh0IG9mIHRoZSBvdXRwdXQgZnVuY3Rpb24gaXMgc2V0IHRvIHRoYXQgb2JqZWN0IGFzIHdlbGwuXG4gKlxuICogSWYgdGhlIGlucHV0IGZ1bmN0aW9uIGNhbGxzIGl0cyBjYWxsYmFjayBpbiB0aGUgXCJub2RlIHN0eWxlXCIgKGkuZS4gZmlyc3QgYXJndW1lbnQgdG8gY2FsbGJhY2sgaXNcbiAqIG9wdGlvbmFsIGVycm9yIHBhcmFtZXRlciBzaWduYWxpbmcgd2hldGhlciB0aGUgY2FsbCBmYWlsZWQgb3Igbm90KSwge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBwcm92aWRlcyBjb252ZW5pZW50IGVycm9yIGhhbmRsaW5nIGFuZCBwcm9iYWJseSBpcyBhIGJldHRlciBjaG9pY2UuXG4gKiBgYmluZENhbGxiYWNrYCB3aWxsIHRyZWF0IHN1Y2ggZnVuY3Rpb25zIHRoZSBzYW1lIGFzIGFueSBvdGhlciBhbmQgZXJyb3IgcGFyYW1ldGVyc1xuICogKHdoZXRoZXIgcGFzc2VkIG9yIG5vdCkgd2lsbCBhbHdheXMgYmUgaW50ZXJwcmV0ZWQgYXMgcmVndWxhciBjYWxsYmFjayBhcmd1bWVudC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqICMjIyBDb252ZXJ0IGpRdWVyeSdzIGdldEpTT04gdG8gYW4gT2JzZXJ2YWJsZSBBUElcbiAqIGBgYGphdmFzY3JpcHRcbiAqIC8vIFN1cHBvc2Ugd2UgaGF2ZSBqUXVlcnkuZ2V0SlNPTignL215L3VybCcsIGNhbGxiYWNrKVxuICogY29uc3QgZ2V0SlNPTkFzT2JzZXJ2YWJsZSA9IGJpbmRDYWxsYmFjayhqUXVlcnkuZ2V0SlNPTik7XG4gKiBjb25zdCByZXN1bHQgPSBnZXRKU09OQXNPYnNlcnZhYmxlKCcvbXkvdXJsJyk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVjZWl2ZSBhbiBhcnJheSBvZiBhcmd1bWVudHMgcGFzc2VkIHRvIGEgY2FsbGJhY2tcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbigoYSwgYiwgYykgPT4ge1xuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogICBjb25zb2xlLmxvZyhiKTsgLy8gJ3NvbWUgc3RyaW5nJ1xuICogICBjb25zb2xlLmxvZyhjKTsgLy8ge3NvbWVQcm9wZXJ0eTogJ3NvbWVWYWx1ZSd9XG4gKiB9KTtcbiAqXG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmRDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKS5zdWJzY3JpYmUodmFsdWVzID0+IHtcbiAqICAgY29uc29sZS5sb2codmFsdWVzKSAvLyBbNSwgJ3NvbWUgc3RyaW5nJywge3NvbWVQcm9wZXJ0eTogJ3NvbWVWYWx1ZSd9XVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29tcGFyZSBiZWhhdmlvdXIgd2l0aCBhbmQgd2l0aG91dCBhc3luYyBTY2hlZHVsZXJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uIGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHkoY2IpIHtcbiAqICAgY2IoKTtcbiAqIH1cbiAqXG4gKiBjb25zdCBib3VuZFN5bmNGbiA9IGJpbmRDYWxsYmFjayhpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5KTtcbiAqIGNvbnN0IGJvdW5kQXN5bmNGbiA9IGJpbmRDYWxsYmFjayhpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5LCBudWxsLCBSeC5TY2hlZHVsZXIuYXN5bmMpO1xuICpcbiAqIGJvdW5kU3luY0ZuKCkuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdJIHdhcyBzeW5jIScpKTtcbiAqIGJvdW5kQXN5bmNGbigpLnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnSSB3YXMgYXN5bmMhJykpO1xuICogY29uc29sZS5sb2coJ1RoaXMgaGFwcGVuZWQuLi4nKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gSSB3YXMgc3luYyFcbiAqIC8vIFRoaXMgaGFwcGVuZWQuLi5cbiAqIC8vIEkgd2FzIGFzeW5jIVxuICogYGBgXG4gKlxuICogIyMjIFVzZSBiaW5kQ2FsbGJhY2sgb24gYW4gb2JqZWN0IG1ldGhvZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgYm91bmRNZXRob2QgPSBiaW5kQ2FsbGJhY2soc29tZU9iamVjdC5tZXRob2RXaXRoQ2FsbGJhY2spO1xuICogYm91bmRNZXRob2QuY2FsbChzb21lT2JqZWN0KSAvLyBtYWtlIHN1cmUgbWV0aG9kV2l0aENhbGxiYWNrIGhhcyBhY2Nlc3MgdG8gc29tZU9iamVjdFxuICogLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgQSBmdW5jdGlvbiB3aXRoIGEgY2FsbGJhY2sgYXMgdGhlIGxhc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBUaGUgc2NoZWR1bGVyIG9uIHdoaWNoIHRvIHNjaGVkdWxlIHRoZVxuICogY2FsbGJhY2tzLlxuICogQHJldHVybiB7ZnVuY3Rpb24oLi4ucGFyYW1zOiAqKTogT2JzZXJ2YWJsZX0gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIHRoZVxuICogT2JzZXJ2YWJsZSB0aGF0IGRlbGl2ZXJzIHRoZSBzYW1lIHZhbHVlcyB0aGUgY2FsbGJhY2sgd291bGQgZGVsaXZlci5cbiAqIEBuYW1lIGJpbmRDYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFQ+KFxuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLFxuICByZXN1bHRTZWxlY3Rvcj86IEZ1bmN0aW9ufFNjaGVkdWxlckxpa2UsXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2Vcbik6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxUPiB7XG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmMsIHNjaGVkdWxlcikoLi4uYXJncykucGlwZShcbiAgICAgICAgbWFwKChhcmdzKSA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgIGxldCBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgY29udGV4dCxcbiAgICAgIHN1YmplY3QsXG4gICAgICBjYWxsYmFja0Z1bmMsXG4gICAgICBzY2hlZHVsZXIsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICBpZiAoIXN1YmplY3QpIHtcbiAgICAgICAgICBzdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgc3ViamVjdC5uZXh0KGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncyk7XG4gICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjYW5SZXBvcnRFcnJvcihzdWJqZWN0KSkge1xuICAgICAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4gPSB7XG4gICAgICAgICAgYXJncywgc3Vic2NyaWJlciwgcGFyYW1zLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoU3RhdGU8VD4+KGRpc3BhdGNoLCAwLCBzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaFN0YXRlPFQ+IHtcbiAgYXJnczogYW55W107XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG4gIHBhcmFtczogUGFyYW1zQ29udGV4dDxUPjtcbn1cblxuaW50ZXJmYWNlIFBhcmFtc0NvbnRleHQ8VD4ge1xuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG4gIGNvbnRleHQ6IGFueTtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RGlzcGF0Y2hTdGF0ZTxUPj4sIHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBjb25zdCB7IGFyZ3MsIHN1YnNjcmliZXIsIHBhcmFtcyB9ID0gc3RhdGU7XG4gIGNvbnN0IHsgY2FsbGJhY2tGdW5jLCBjb250ZXh0LCBzY2hlZHVsZXIgfSA9IHBhcmFtcztcbiAgbGV0IHsgc3ViamVjdCB9ID0gcGFyYW1zO1xuICBpZiAoIXN1YmplY3QpIHtcbiAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzO1xuICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPE5leHRTdGF0ZTxUPj4oZGlzcGF0Y2hOZXh0LCAwLCB7IHZhbHVlLCBzdWJqZWN0IH0pKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuYWRkKHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbn1cblxuaW50ZXJmYWNlIE5leHRTdGF0ZTxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgdmFsdWU6IFQ7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248TmV4dFN0YXRlPFQ+Piwgc3RhdGU6IE5leHRTdGF0ZTxUPikge1xuICBjb25zdCB7IHZhbHVlLCBzdWJqZWN0IH0gPSBzdGF0ZTtcbiAgc3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgc3ViamVjdC5jb21wbGV0ZSgpO1xufVxuXG5pbnRlcmZhY2UgRXJyb3JTdGF0ZTxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgZXJyOiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXJyb3I8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPEVycm9yU3RhdGU8VD4+LCBzdGF0ZTogRXJyb3JTdGF0ZTxUPikge1xuICBjb25zdCB7IGVyciwgc3ViamVjdCB9ID0gc3RhdGU7XG4gIHN1YmplY3QuZXJyb3IoZXJyKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IGNhblJlcG9ydEVycm9yIH0gZnJvbSAnLi4vdXRpbC9jYW5SZXBvcnRFcnJvcic7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIGRlcHJlY2F0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjE+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8dm9pZD47IC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuLyoqXG4gKiBDb252ZXJ0cyBhIE5vZGUuanMtc3R5bGUgY2FsbGJhY2sgQVBJIHRvIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuXG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGp1c3QgbGlrZSB7QGxpbmsgYmluZENhbGxiYWNrfSwgYnV0IHRoZVxuICogY2FsbGJhY2sgaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdHlwZSBgY2FsbGJhY2soZXJyb3IsIHJlc3VsdClgLjwvc3Bhbj5cbiAqXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgaXMgbm90IGFuIG9wZXJhdG9yIGJlY2F1c2UgaXRzIGlucHV0IGFuZCBvdXRwdXQgYXJlIG5vdFxuICogT2JzZXJ2YWJsZXMuIFRoZSBpbnB1dCBpcyBhIGZ1bmN0aW9uIGBmdW5jYCB3aXRoIHNvbWUgcGFyYW1ldGVycywgYnV0IHRoZVxuICogbGFzdCBwYXJhbWV0ZXIgbXVzdCBiZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgYGZ1bmNgIGNhbGxzIHdoZW4gaXQgaXNcbiAqIGRvbmUuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byBmb2xsb3cgTm9kZS5qcyBjb252ZW50aW9ucyxcbiAqIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgY2FsbGJhY2sgaXMgYW4gZXJyb3Igb2JqZWN0LCBzaWduYWxpbmdcbiAqIHdoZXRoZXIgY2FsbCB3YXMgc3VjY2Vzc2Z1bC4gSWYgdGhhdCBvYmplY3QgaXMgcGFzc2VkIHRvIGNhbGxiYWNrLCBpdCBtZWFuc1xuICogc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gKlxuICogVGhlIG91dHB1dCBvZiBgYmluZE5vZGVDYWxsYmFja2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzYW1lXG4gKiBwYXJhbWV0ZXJzIGFzIGBmdW5jYCwgZXhjZXB0IHRoZSBsYXN0IG9uZSAodGhlIGNhbGxiYWNrKS4gV2hlbiB0aGUgb3V0cHV0XG4gKiBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMsIGl0IHdpbGwgcmV0dXJuIGFuIE9ic2VydmFibGUuXG4gKiBJZiBgZnVuY2AgY2FsbHMgaXRzIGNhbGxiYWNrIHdpdGggZXJyb3IgcGFyYW1ldGVyIHByZXNlbnQsIE9ic2VydmFibGUgd2lsbFxuICogZXJyb3Igd2l0aCB0aGF0IHZhbHVlIGFzIHdlbGwuIElmIGVycm9yIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCBPYnNlcnZhYmxlIHdpbGwgZW1pdFxuICogc2Vjb25kIHBhcmFtZXRlci4gSWYgdGhlcmUgYXJlIG1vcmUgcGFyYW1ldGVycyAodGhpcmQgYW5kIHNvIG9uKSxcbiAqIE9ic2VydmFibGUgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggYWxsIGFyZ3VtZW50cywgZXhjZXB0IGZpcnN0IGVycm9yIGFyZ3VtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBgZnVuY2Agd2lsbCBub3QgYmUgY2FsbGVkIGF0IHRoZSBzYW1lIHRpbWUgb3V0cHV0IGZ1bmN0aW9uIGlzLFxuICogYnV0IHJhdGhlciB3aGVuZXZlciByZXN1bHRpbmcgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLiBCeSBkZWZhdWx0IGNhbGwgdG9cbiAqIGBmdW5jYCB3aWxsIGhhcHBlbiBzeW5jaHJvbm91c2x5IGFmdGVyIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgY2FuIGJlIGNoYW5nZWRcbiAqIHdpdGggcHJvcGVyIGBzY2hlZHVsZXJgIHByb3ZpZGVkIGFzIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlci4ge0BsaW5rIFNjaGVkdWxlckxpa2V9XG4gKiBjYW4gYWxzbyBjb250cm9sIHdoZW4gdmFsdWVzIGZyb20gY2FsbGJhY2sgd2lsbCBiZSBlbWl0dGVkIGJ5IE9ic2VydmFibGUuXG4gKiBUbyBmaW5kIG91dCBtb3JlLCBjaGVjayBvdXQgZG9jdW1lbnRhdGlvbiBmb3Ige0BsaW5rIGJpbmRDYWxsYmFja30sIHdoZXJlXG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gd29ya3MgZXhhY3RseSB0aGUgc2FtZS5cbiAqXG4gKiBBcyBpbiB7QGxpbmsgYmluZENhbGxiYWNrfSwgY29udGV4dCAoYHRoaXNgIHByb3BlcnR5KSBvZiBpbnB1dCBmdW5jdGlvbiB3aWxsIGJlIHNldCB0byBjb250ZXh0XG4gKiBvZiByZXR1cm5lZCBmdW5jdGlvbiwgd2hlbiBpdCBpcyBjYWxsZWQuXG4gKlxuICogQWZ0ZXIgT2JzZXJ2YWJsZSBlbWl0cyB2YWx1ZSwgaXQgd2lsbCBjb21wbGV0ZSBpbW1lZGlhdGVseS4gVGhpcyBtZWFuc1xuICogZXZlbiBpZiBgZnVuY2AgY2FsbHMgY2FsbGJhY2sgYWdhaW4sIHZhbHVlcyBmcm9tIHNlY29uZCBhbmQgY29uc2VjdXRpdmVcbiAqIGNhbGxzIHdpbGwgbmV2ZXIgYXBwZWFyIG9uIHRoZSBzdHJlYW0uIElmIHlvdSBuZWVkIHRvIGhhbmRsZSBmdW5jdGlvbnNcbiAqIHRoYXQgY2FsbCBjYWxsYmFja3MgbXVsdGlwbGUgdGltZXMsIGNoZWNrIG91dCB7QGxpbmsgZnJvbUV2ZW50fSBvclxuICoge0BsaW5rIGZyb21FdmVudFBhdHRlcm59IGluc3RlYWQuXG4gKlxuICogTm90ZSB0aGF0IGBiaW5kTm9kZUNhbGxiYWNrYCBjYW4gYmUgdXNlZCBpbiBub24tTm9kZS5qcyBlbnZpcm9ubWVudHMgYXMgd2VsbC5cbiAqIFwiTm9kZS5qcy1zdHlsZVwiIGNhbGxiYWNrcyBhcmUganVzdCBhIGNvbnZlbnRpb24sIHNvIGlmIHlvdSB3cml0ZSBmb3JcbiAqIGJyb3dzZXJzIG9yIGFueSBvdGhlciBlbnZpcm9ubWVudCBhbmQgQVBJIHlvdSB1c2UgaW1wbGVtZW50cyB0aGF0IGNhbGxiYWNrIHN0eWxlLFxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGNhbiBiZSBzYWZlbHkgdXNlZCBvbiB0aGF0IEFQSSBmdW5jdGlvbnMgYXMgd2VsbC5cbiAqXG4gKiBSZW1lbWJlciB0aGF0IEVycm9yIG9iamVjdCBwYXNzZWQgdG8gY2FsbGJhY2sgZG9lcyBub3QgaGF2ZSB0byBiZSBhbiBpbnN0YW5jZVxuICogb2YgSmF2YVNjcmlwdCBidWlsdC1pbiBgRXJyb3JgIG9iamVjdC4gSW4gZmFjdCwgaXQgZG9lcyBub3QgZXZlbiBoYXZlIHRvIGFuIG9iamVjdC5cbiAqIEVycm9yIHBhcmFtZXRlciBvZiBjYWxsYmFjayBmdW5jdGlvbiBpcyBpbnRlcnByZXRlZCBhcyBcInByZXNlbnRcIiwgd2hlbiB2YWx1ZVxuICogb2YgdGhhdCBwYXJhbWV0ZXIgaXMgdHJ1dGh5LiBJdCBjb3VsZCBiZSwgZm9yIGV4YW1wbGUsIG5vbi16ZXJvIG51bWJlciwgbm9uLWVtcHR5XG4gKiBzdHJpbmcgb3IgYm9vbGVhbiBgdHJ1ZWAuIEluIGFsbCBvZiB0aGVzZSBjYXNlcyByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3b3VsZCBlcnJvclxuICogd2l0aCB0aGF0IHZhbHVlLiBUaGlzIG1lYW5zIHVzdWFsbHkgcmVndWxhciBzdHlsZSBjYWxsYmFja3Mgd2lsbCBmYWlsIHZlcnkgb2Z0ZW4gd2hlblxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGlzIHVzZWQuIElmIHlvdXIgT2JzZXJ2YWJsZSBlcnJvcnMgbXVjaCBtb3JlIG9mdGVuIHRoZW4geW91XG4gKiB3b3VsZCBleHBlY3QsIGNoZWNrIGlmIGNhbGxiYWNrIHJlYWxseSBpcyBjYWxsZWQgaW4gTm9kZS5qcy1zdHlsZSBhbmQsIGlmIG5vdCxcbiAqIHN3aXRjaCB0byB7QGxpbmsgYmluZENhbGxiYWNrfSBpbnN0ZWFkLlxuICpcbiAqIE5vdGUgdGhhdCBldmVuIGlmIGVycm9yIHBhcmFtZXRlciBpcyB0ZWNobmljYWxseSBwcmVzZW50IGluIGNhbGxiYWNrLCBidXQgaXRzIHZhbHVlXG4gKiBpcyBmYWxzeSwgaXQgc3RpbGwgd29uJ3QgYXBwZWFyIGluIGFycmF5IGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjICBSZWFkIGEgZmlsZSBmcm9tIHRoZSBmaWxlc3lzdGVtIGFuZCBnZXQgdGhlIGRhdGEgYXMgYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuICogY29uc3QgcmVhZEZpbGVBc09ic2VydmFibGUgPSBiaW5kTm9kZUNhbGxiYWNrKGZzLnJlYWRGaWxlKTtcbiAqIGNvbnN0IHJlc3VsdCA9IHJlYWRGaWxlQXNPYnNlcnZhYmxlKCcuL3JvYWROYW1lcy50eHQnLCAndXRmOCcpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICogYGBgXG4gKlxuICogIyMjIFVzZSBvbiBmdW5jdGlvbiBjYWxsaW5nIGNhbGxiYWNrIHdpdGggbXVsdGlwbGUgYXJndW1lbnRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oKGVyciwgYSwgYikgPT4ge1xuICogICBjb25zb2xlLmxvZyhlcnIpOyAvLyBudWxsXG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiAgIGNvbnNvbGUubG9nKGIpOyAvLyBcInNvbWUgc3RyaW5nXCJcbiAqIH0pO1xuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kTm9kZUNhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpXG4gKiAuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpOyAvLyBbNSwgXCJzb21lIHN0cmluZ1wiXVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIG9uIGZ1bmN0aW9uIGNhbGxpbmcgY2FsbGJhY2sgaW4gcmVndWxhciBzdHlsZVxuICogYGBgamF2YXNjcmlwdFxuICogc29tZUZ1bmN0aW9uKGEgPT4ge1xuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogfSk7XG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmROb2RlQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IHt9ICAgICAgICAgICAgIC8vIG5ldmVyIGdldHMgY2FsbGVkXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpIC8vIDVcbiAqICk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBiaW5kQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgRnVuY3Rpb24gd2l0aCBhIE5vZGUuanMtc3R5bGUgY2FsbGJhY2sgYXMgdGhlIGxhc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBUaGUgc2NoZWR1bGVyIG9uIHdoaWNoIHRvIHNjaGVkdWxlIHRoZVxuICogY2FsbGJhY2tzLlxuICogQHJldHVybiB7ZnVuY3Rpb24oLi4ucGFyYW1zOiAqKTogT2JzZXJ2YWJsZX0gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIHRoZVxuICogT2JzZXJ2YWJsZSB0aGF0IGRlbGl2ZXJzIHRoZSBzYW1lIHZhbHVlcyB0aGUgTm9kZS5qcyBjYWxsYmFjayB3b3VsZFxuICogZGVsaXZlci5cbiAqIEBuYW1lIGJpbmROb2RlQ2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8VD4oXG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sXG4gIHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbnxTY2hlZHVsZXJMaWtlLFxuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlXG4pOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8VD4ge1xuXG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCBzY2hlZHVsZXIpKC4uLmFyZ3MpLnBpcGUoXG4gICAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24odGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IHBhcmFtczogUGFyYW1zU3RhdGU8VD4gPSB7XG4gICAgICBzdWJqZWN0OiB1bmRlZmluZWQsXG4gICAgICBhcmdzLFxuICAgICAgY2FsbGJhY2tGdW5jLFxuICAgICAgc2NoZWR1bGVyLFxuICAgICAgY29udGV4dDogdGhpcyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGV4dCB9ID0gcGFyYW1zO1xuICAgICAgbGV0IHsgc3ViamVjdCB9ID0gcGFyYW1zO1xuICAgICAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gaW5uZXJBcmdzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1YmplY3QubmV4dChpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2FuUmVwb3J0RXJyb3Ioc3ViamVjdCkpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hTdGF0ZTxUPj4oZGlzcGF0Y2gsIDAsIHsgcGFyYW1zLCBzdWJzY3JpYmVyLCBjb250ZXh0IH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hTdGF0ZTxUPiB7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG4gIGNvbnRleHQ6IGFueTtcbiAgcGFyYW1zOiBQYXJhbXNTdGF0ZTxUPjtcbn1cblxuaW50ZXJmYWNlIFBhcmFtc1N0YXRlPFQ+IHtcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbjtcbiAgYXJnczogYW55W107XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZTtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBjb250ZXh0OiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEaXNwYXRjaFN0YXRlPFQ+Piwgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4pIHtcbiAgY29uc3QgeyBwYXJhbXMsIHN1YnNjcmliZXIsIGNvbnRleHQgfSA9IHN0YXRlO1xuICBjb25zdCB7IGNhbGxiYWNrRnVuYywgYXJncywgc2NoZWR1bGVyIH0gPSBwYXJhbXM7XG4gIGxldCBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3Q7XG5cbiAgaWYgKCFzdWJqZWN0KSB7XG4gICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBlcnIgPSBpbm5lckFyZ3Muc2hpZnQoKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoRXJyb3JBcmc8VD4+KGRpc3BhdGNoRXJyb3IsIDAsIHsgZXJyLCBzdWJqZWN0IH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzO1xuICAgICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hOZXh0QXJnPFQ+PihkaXNwYXRjaE5leHQsIDAsIHsgdmFsdWUsIHN1YmplY3QgfSkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hFcnJvckFyZzxUPj4oZGlzcGF0Y2hFcnJvciwgMCwgeyBlcnIsIHN1YmplY3QgfSkpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuYWRkKHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoTmV4dEFyZzxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgdmFsdWU6IFQ7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dDxUPihhcmc6IERpc3BhdGNoTmV4dEFyZzxUPikge1xuICBjb25zdCB7IHZhbHVlLCBzdWJqZWN0IH0gPSBhcmc7XG4gIHN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIHN1YmplY3QuY29tcGxldGUoKTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoRXJyb3JBcmc8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGVycjogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yPFQ+KGFyZzogRGlzcGF0Y2hFcnJvckFyZzxUPikge1xuICBjb25zdCB7IGVyciwgc3ViamVjdCB9ID0gYXJnO1xuICBzdWJqZWN0LmVycm9yKGVycik7XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4vSW5uZXJTdWJzY3JpYmVyJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBPdXRlclN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnJvcik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4vT3V0ZXJTdWJzY3JpYmVyJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBJbm5lclN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFI+IHtcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IE91dGVyU3Vic2NyaWJlcjxULCBSPiwgcHVibGljIG91dGVyVmFsdWU6IFQsIHB1YmxpYyBvdXRlckluZGV4OiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBSKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5TmV4dCh0aGlzLm91dGVyVmFsdWUsIHZhbHVlLCB0aGlzLm91dGVySW5kZXgsIHRoaXMuaW5kZXgrKywgdGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5ub3RpZnlFcnJvcihlcnJvciwgdGhpcyk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5ub3RpZnlDb21wbGV0ZSh0aGlzKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGhvc3RSZXBvcnRFcnJvciB9IGZyb20gJy4vaG9zdFJlcG9ydEVycm9yJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvUHJvbWlzZSA9IDxUPihwcm9taXNlOiBQcm9taXNlTGlrZTxUPikgPT4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgcHJvbWlzZS50aGVuKFxuICAgICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAoZXJyOiBhbnkpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKVxuICApXG4gIC50aGVuKG51bGwsIGhvc3RSZXBvcnRFcnJvcik7XG4gIHJldHVybiBzdWJzY3JpYmVyO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRTeW1ib2xJdGVyYXRvcigpOiBzeW1ib2wge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ2Z1bmN0aW9uJyB8fCAhU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgcmV0dXJuICdAQGl0ZXJhdG9yJyBhcyBhbnk7XG4gIH1cblxuICByZXR1cm4gU3ltYm9sLml0ZXJhdG9yO1xufVxuXG5leHBvcnQgY29uc3QgaXRlcmF0b3IgPSBnZXRTeW1ib2xJdGVyYXRvcigpO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmsgaXRlcmF0b3J9IGluc3RlYWRcbiAqL1xuZXhwb3J0IGNvbnN0ICQkaXRlcmF0b3IgPSBpdGVyYXRvcjtcbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUb0l0ZXJhYmxlID0gPFQ+KGl0ZXJhYmxlOiBJdGVyYWJsZTxUPikgPT4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgY29uc3QgaXRlcmF0b3IgPSBpdGVyYWJsZVtTeW1ib2xfaXRlcmF0b3JdKCk7XG4gIGRvIHtcbiAgICBjb25zdCBpdGVtID0gaXRlcmF0b3IubmV4dCgpO1xuICAgIGlmIChpdGVtLmRvbmUpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBzdWJzY3JpYmVyLm5leHQoaXRlbS52YWx1ZSk7XG4gICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0gd2hpbGUgKHRydWUpO1xuXG4gIC8vIEZpbmFsaXplIHRoZSBpdGVyYXRvciBpZiBpdCBoYXBwZW5zIHRvIGJlIGEgR2VuZXJhdG9yXG4gIGlmICh0eXBlb2YgaXRlcmF0b3IucmV0dXJuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc3Vic2NyaWJlci5hZGQoKCkgPT4ge1xuICAgICAgaWYgKGl0ZXJhdG9yLnJldHVybikge1xuICAgICAgICBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBzdWJzY3JpYmVyO1xufTtcbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5cbi8qKlxuICogU3Vic2NyaWJlcyB0byBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIFN5bWJvbC5vYnNlcnZhYmxlIHdpdGggdGhlIGdpdmVuXG4gKiBTdWJzY3JpYmVyLlxuICogQHBhcmFtIG9iaiBBbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIFN5bWJvbC5vYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUb09ic2VydmFibGUgPSA8VD4ob2JqOiBhbnkpID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIGNvbnN0IG9icyA9IG9ialtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgaWYgKHR5cGVvZiBvYnMuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gU2hvdWxkIGJlIGNhdWdodCBieSBvYnNlcnZhYmxlIHN1YnNjcmliZSBmdW5jdGlvbiBlcnJvciBoYW5kbGluZy5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm92aWRlZCBvYmplY3QgZG9lcyBub3QgY29ycmVjdGx5IGltcGxlbWVudCBTeW1ib2wub2JzZXJ2YWJsZScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYnMuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGlzQXJyYXlMaWtlID0gKDxUPih4OiBhbnkpOiB4IGlzIEFycmF5TGlrZTxUPiA9PiB4ICYmIHR5cGVvZiB4Lmxlbmd0aCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHggIT09ICdmdW5jdGlvbicpOyIsImV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2UodmFsdWU6IGFueSk6IHZhbHVlIGlzIFByb21pc2VMaWtlPGFueT4ge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mICg8YW55PnZhbHVlKS5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mICh2YWx1ZSBhcyBhbnkpLnRoZW4gPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi9zdWJzY3JpYmVUb0FycmF5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9Qcm9taXNlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4vaXNQcm9taXNlJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi9pc09iamVjdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvID0gPFQ+KHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFQ+KSA9PiB7XG4gIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgcmV0dXJuIChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuX2lzU2NhbGFyKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgocmVzdWx0IGFzIGFueSkudmFsdWUpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9vYnNlcnZhYmxlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb09ic2VydmFibGUocmVzdWx0IGFzIGFueSk7XG4gIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocmVzdWx0KSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb0FycmF5KHJlc3VsdCk7XG4gIH0gZWxzZSBpZiAoaXNQcm9taXNlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9Qcm9taXNlKHJlc3VsdCBhcyBQcm9taXNlPGFueT4pO1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9JdGVyYWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2YWx1ZSA9IGlzT2JqZWN0KHJlc3VsdCkgPyAnYW4gaW52YWxpZCBvYmplY3QnIDogYCcke3Jlc3VsdH0nYDtcbiAgICBjb25zdCBtc2cgPSBgWW91IHByb3ZpZGVkICR7dmFsdWV9IHdoZXJlIGEgc3RyZWFtIHdhcyBleHBlY3RlZC5gXG4gICAgICArICcgWW91IGNhbiBwcm92aWRlIGFuIE9ic2VydmFibGUsIFByb21pc2UsIEFycmF5LCBvciBJdGVyYWJsZS4nO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi9zdWJzY3JpYmVUbyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPihcbiAgb3V0ZXJTdWJzY3JpYmVyOiBPdXRlclN1YnNjcmliZXI8VCwgUj4sXG4gIHJlc3VsdDogYW55LFxuICBvdXRlclZhbHVlPzogVCxcbiAgb3V0ZXJJbmRleD86IG51bWJlcixcbiAgZGVzdGluYXRpb24/OiBTdWJzY3JpYmVyPGFueT5cbik6IFN1YnNjcmlwdGlvbjtcbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPihcbiAgb3V0ZXJTdWJzY3JpYmVyOiBPdXRlclN1YnNjcmliZXI8VCwgUj4sXG4gIHJlc3VsdDogYW55LFxuICBvdXRlclZhbHVlPzogVCxcbiAgb3V0ZXJJbmRleD86IG51bWJlcixcbiAgZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PiA9IG5ldyBJbm5lclN1YnNjcmliZXIob3V0ZXJTdWJzY3JpYmVyLCBvdXRlclZhbHVlLCBvdXRlckluZGV4KVxuKTogU3Vic2NyaXB0aW9uIHwgdm9pZCB7XG4gIGlmIChkZXN0aW5hdGlvbi5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIHN1YnNjcmliZVRvKHJlc3VsdCkoZGVzdGluYXRpb24pO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBpc0FycmF5ICB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcblxuY29uc3QgTk9ORSA9IHt9O1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBUKSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzKSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0KSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBUNSwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSkgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSwgdjY6IFQ2KSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQ+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxUPikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCAoKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIpIHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8Uj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb21iaW5lcyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0byBjcmVhdGUgYW4gT2JzZXJ2YWJsZSB3aG9zZSB2YWx1ZXMgYXJlXG4gKiBjYWxjdWxhdGVkIGZyb20gdGhlIGxhdGVzdCB2YWx1ZXMgb2YgZWFjaCBvZiBpdHMgaW5wdXQgT2JzZXJ2YWJsZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldoZW5ldmVyIGFueSBpbnB1dCBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIGl0XG4gKiBjb21wdXRlcyBhIGZvcm11bGEgdXNpbmcgdGhlIGxhdGVzdCB2YWx1ZXMgZnJvbSBhbGwgdGhlIGlucHV0cywgdGhlbiBlbWl0c1xuICogdGhlIG91dHB1dCBvZiB0aGF0IGZvcm11bGEuPC9zcGFuPlxuICpcbiAqICFbXShjb21iaW5lTGF0ZXN0LnBuZylcbiAqXG4gKiBgY29tYmluZUxhdGVzdGAgY29tYmluZXMgdGhlIHZhbHVlcyBmcm9tIGFsbCB0aGUgT2JzZXJ2YWJsZXMgcGFzc2VkIGFzXG4gKiBhcmd1bWVudHMuIFRoaXMgaXMgZG9uZSBieSBzdWJzY3JpYmluZyB0byBlYWNoIE9ic2VydmFibGUgaW4gb3JkZXIgYW5kLFxuICogd2hlbmV2ZXIgYW55IE9ic2VydmFibGUgZW1pdHMsIGNvbGxlY3RpbmcgYW4gYXJyYXkgb2YgdGhlIG1vc3QgcmVjZW50XG4gKiB2YWx1ZXMgZnJvbSBlYWNoIE9ic2VydmFibGUuIFNvIGlmIHlvdSBwYXNzIGBuYCBPYnNlcnZhYmxlcyB0byBvcGVyYXRvcixcbiAqIHJldHVybmVkIE9ic2VydmFibGUgd2lsbCBhbHdheXMgZW1pdCBhbiBhcnJheSBvZiBgbmAgdmFsdWVzLCBpbiBvcmRlclxuICogY29ycmVzcG9uZGluZyB0byBvcmRlciBvZiBwYXNzZWQgT2JzZXJ2YWJsZXMgKHZhbHVlIGZyb20gdGhlIGZpcnN0IE9ic2VydmFibGVcbiAqIG9uIHRoZSBmaXJzdCBwbGFjZSBhbmQgc28gb24pLlxuICpcbiAqIFN0YXRpYyB2ZXJzaW9uIG9mIGBjb21iaW5lTGF0ZXN0YCBhY2NlcHRzIGVpdGhlciBhbiBhcnJheSBvZiBPYnNlcnZhYmxlc1xuICogb3IgZWFjaCBPYnNlcnZhYmxlIGNhbiBiZSBwdXQgZGlyZWN0bHkgYXMgYW4gYXJndW1lbnQuIE5vdGUgdGhhdCBhcnJheSBvZlxuICogT2JzZXJ2YWJsZXMgaXMgZ29vZCBjaG9pY2UsIGlmIHlvdSBkb24ndCBrbm93IGJlZm9yZWhhbmQgaG93IG1hbnkgT2JzZXJ2YWJsZXNcbiAqIHlvdSB3aWxsIGNvbWJpbmUuIFBhc3NpbmcgZW1wdHkgYXJyYXkgd2lsbCByZXN1bHQgaW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiBjb21wbGV0ZXMgaW1tZWRpYXRlbHkuXG4gKlxuICogVG8gZW5zdXJlIG91dHB1dCBhcnJheSBoYXMgYWx3YXlzIHRoZSBzYW1lIGxlbmd0aCwgYGNvbWJpbmVMYXRlc3RgIHdpbGxcbiAqIGFjdHVhbGx5IHdhaXQgZm9yIGFsbCBpbnB1dCBPYnNlcnZhYmxlcyB0byBlbWl0IGF0IGxlYXN0IG9uY2UsXG4gKiBiZWZvcmUgaXQgc3RhcnRzIGVtaXR0aW5nIHJlc3VsdHMuIFRoaXMgbWVhbnMgaWYgc29tZSBPYnNlcnZhYmxlIGVtaXRzXG4gKiB2YWx1ZXMgYmVmb3JlIG90aGVyIE9ic2VydmFibGVzIHN0YXJ0ZWQgZW1pdHRpbmcsIGFsbCB0aGVzZSB2YWx1ZXMgYnV0IHRoZSBsYXN0XG4gKiB3aWxsIGJlIGxvc3QuIE9uIHRoZSBvdGhlciBoYW5kLCBpZiBzb21lIE9ic2VydmFibGUgZG9lcyBub3QgZW1pdCBhIHZhbHVlIGJ1dFxuICogY29tcGxldGVzLCByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIGF0IHRoZSBzYW1lIG1vbWVudCB3aXRob3V0XG4gKiBlbWl0dGluZyBhbnl0aGluZywgc2luY2UgaXQgd2lsbCBiZSBub3cgaW1wb3NzaWJsZSB0byBpbmNsdWRlIHZhbHVlIGZyb21cbiAqIGNvbXBsZXRlZCBPYnNlcnZhYmxlIGluIHJlc3VsdGluZyBhcnJheS4gQWxzbywgaWYgc29tZSBpbnB1dCBPYnNlcnZhYmxlIGRvZXNcbiAqIG5vdCBlbWl0IGFueSB2YWx1ZSBhbmQgbmV2ZXIgY29tcGxldGVzLCBgY29tYmluZUxhdGVzdGAgd2lsbCBhbHNvIG5ldmVyIGVtaXRcbiAqIGFuZCBuZXZlciBjb21wbGV0ZSwgc2luY2UsIGFnYWluLCBpdCB3aWxsIHdhaXQgZm9yIGFsbCBzdHJlYW1zIHRvIGVtaXQgc29tZVxuICogdmFsdWUuXG4gKlxuICogSWYgYXQgbGVhc3Qgb25lIE9ic2VydmFibGUgd2FzIHBhc3NlZCB0byBgY29tYmluZUxhdGVzdGAgYW5kIGFsbCBwYXNzZWQgT2JzZXJ2YWJsZXNcbiAqIGVtaXR0ZWQgc29tZXRoaW5nLCByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3aWxsIGNvbXBsZXRlIHdoZW4gYWxsIGNvbWJpbmVkXG4gKiBzdHJlYW1zIGNvbXBsZXRlLiBTbyBldmVuIGlmIHNvbWUgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsIHJlc3VsdCBvZlxuICogYGNvbWJpbmVMYXRlc3RgIHdpbGwgc3RpbGwgZW1pdCB2YWx1ZXMgd2hlbiBvdGhlciBPYnNlcnZhYmxlcyBkby4gSW4gY2FzZVxuICogb2YgY29tcGxldGVkIE9ic2VydmFibGUsIGl0cyB2YWx1ZSBmcm9tIG5vdyBvbiB3aWxsIGFsd2F5cyBiZSB0aGUgbGFzdFxuICogZW1pdHRlZCB2YWx1ZS4gT24gdGhlIG90aGVyIGhhbmQsIGlmIGFueSBPYnNlcnZhYmxlIGVycm9ycywgYGNvbWJpbmVMYXRlc3RgXG4gKiB3aWxsIGVycm9yIGltbWVkaWF0ZWx5IGFzIHdlbGwsIGFuZCBhbGwgb3RoZXIgT2JzZXJ2YWJsZXMgd2lsbCBiZSB1bnN1YnNjcmliZWQuXG4gKlxuICogYGNvbWJpbmVMYXRlc3RgIGFjY2VwdHMgYXMgb3B0aW9uYWwgcGFyYW1ldGVyIGBwcm9qZWN0YCBmdW5jdGlvbiwgd2hpY2ggdGFrZXNcbiAqIGFzIGFyZ3VtZW50cyBhbGwgdmFsdWVzIHRoYXQgd291bGQgbm9ybWFsbHkgYmUgZW1pdHRlZCBieSByZXN1bHRpbmcgT2JzZXJ2YWJsZS5cbiAqIGBwcm9qZWN0YCBjYW4gcmV0dXJuIGFueSBraW5kIG9mIHZhbHVlLCB3aGljaCB3aWxsIGJlIHRoZW4gZW1pdHRlZCBieSBPYnNlcnZhYmxlXG4gKiBpbnN0ZWFkIG9mIGRlZmF1bHQgYXJyYXkuIE5vdGUgdGhhdCBgcHJvamVjdGAgZG9lcyBub3QgdGFrZSBhcyBhcmd1bWVudCB0aGF0IGFycmF5XG4gKiBvZiB2YWx1ZXMsIGJ1dCB2YWx1ZXMgdGhlbXNlbHZlcy4gVGhhdCBtZWFucyBkZWZhdWx0IGBwcm9qZWN0YCBjYW4gYmUgaW1hZ2luZWRcbiAqIGFzIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYWxsIGl0cyBhcmd1bWVudHMgYW5kIHB1dHMgdGhlbSBpbnRvIGFuIGFycmF5LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ29tYmluZSB0d28gdGltZXIgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGZpcnN0VGltZXIgPSB0aW1lcigwLCAxMDAwKTsgLy8gZW1pdCAwLCAxLCAyLi4uIGFmdGVyIGV2ZXJ5IHNlY29uZCwgc3RhcnRpbmcgZnJvbSBub3dcbiAqIGNvbnN0IHNlY29uZFRpbWVyID0gdGltZXIoNTAwLCAxMDAwKTsgLy8gZW1pdCAwLCAxLCAyLi4uIGFmdGVyIGV2ZXJ5IHNlY29uZCwgc3RhcnRpbmcgMCw1cyBmcm9tIG5vd1xuICogY29uc3QgY29tYmluZWRUaW1lcnMgPSBjb21iaW5lTGF0ZXN0KGZpcnN0VGltZXIsIHNlY29uZFRpbWVyKTtcbiAqIGNvbWJpbmVkVGltZXJzLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICogLy8gTG9nc1xuICogLy8gWzAsIDBdIGFmdGVyIDAuNXNcbiAqIC8vIFsxLCAwXSBhZnRlciAxc1xuICogLy8gWzEsIDFdIGFmdGVyIDEuNXNcbiAqIC8vIFsyLCAxXSBhZnRlciAyc1xuICogYGBgXG4gKlxuICogIyMjIENvbWJpbmUgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG9ic2VydmFibGVzID0gWzEsIDUsIDEwXS5tYXAoXG4gKiAgIG4gPT4gb2YobikucGlwZShcbiAqICAgICBkZWxheShuICogMTAwMCksICAgLy8gZW1pdCAwIGFuZCB0aGVuIGVtaXQgbiBhZnRlciBuIHNlY29uZHNcbiAqICAgICBzdGFydFdpdGgoMCksXG4gKiAgIClcbiAqICk7XG4gKiBjb25zdCBjb21iaW5lZCA9IGNvbWJpbmVMYXRlc3Qob2JzZXJ2YWJsZXMpO1xuICogY29tYmluZWQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKiAvLyBMb2dzXG4gKiAvLyBbMCwgMCwgMF0gaW1tZWRpYXRlbHlcbiAqIC8vIFsxLCAwLCAwXSBhZnRlciAxc1xuICogLy8gWzEsIDUsIDBdIGFmdGVyIDVzXG4gKiAvLyBbMSwgNSwgMTBdIGFmdGVyIDEwc1xuICogYGBgXG4gKlxuICpcbiAqICMjIyBVc2UgcHJvamVjdCBmdW5jdGlvbiB0byBkeW5hbWljYWxseSBjYWxjdWxhdGUgdGhlIEJvZHktTWFzcyBJbmRleFxuICogYGBgamF2YXNjcmlwdFxuICogKiBjb25zdCB3ZWlnaHQgPSBvZig3MCwgNzIsIDc2LCA3OSwgNzUpO1xuICogY29uc3QgaGVpZ2h0ID0gb2YoMS43NiwgMS43NywgMS43OCk7XG4gKiBjb25zdCBibWkgPSBjb21iaW5lTGF0ZXN0KHdlaWdodCwgaGVpZ2h0KS5waXBlKFxuICogICBtYXAoKFt3LCBoXSkgPT4gdyAvIChoICogaCkpLFxuICogKTtcbiAqIGJtaS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnQk1JIGlzICcgKyB4KSk7XG4gKlxuICogLy8gV2l0aCBvdXRwdXQgdG8gY29uc29sZTpcbiAqIC8vIEJNSSBpcyAyNC4yMTIyOTMzODg0Mjk3NTNcbiAqIC8vIEJNSSBpcyAyMy45Mzk0ODA5OTIwNTIwOVxuICogLy8gQk1JIGlzIDIzLjY3MTI1MzYyOTU5MjIyMlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUFsbH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgd2l0aExhdGVzdEZyb219XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGUxIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29tYmluZSB3aXRoIG90aGVyIE9ic2VydmFibGVzLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGUyIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29tYmluZSB3aXRoIG90aGVyIE9ic2VydmFibGVzLlxuICogTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnRzXG4gKiBvciBhbiBhcnJheSBvZiBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Byb2plY3RdIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIHByb2plY3QgdGhlIHZhbHVlcyBmcm9tXG4gKiB0aGUgY29tYmluZWQgbGF0ZXN0IHZhbHVlcyBpbnRvIGEgbmV3IHZhbHVlIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc3Vic2NyaWJpbmcgdG9cbiAqIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2YgcHJvamVjdGVkIHZhbHVlcyBmcm9tIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWVzIGZyb20gZWFjaCBpbnB1dCBPYnNlcnZhYmxlLCBvciBhbiBhcnJheSBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGZyb21cbiAqIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PGFueSB8IE9ic2VydmFibGVJbnB1dDxhbnk+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj4ge1xuICBsZXQgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIgPSAgbnVsbDtcbiAgbGV0IHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IG51bGw7XG5cbiAgaWYgKGlzU2NoZWR1bGVyKG9ic2VydmFibGVzW29ic2VydmFibGVzLmxlbmd0aCAtIDFdKSkge1xuICAgIHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPm9ic2VydmFibGVzLnBvcCgpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlc3VsdFNlbGVjdG9yID0gPCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFI+b2JzZXJ2YWJsZXMucG9wKCk7XG4gIH1cblxuICAvLyBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgb3RoZXIgYXJndW1lbnQgYmVzaWRlcyB0aGUgcmVzdWx0U2VsZWN0b3IgaXMgYW4gYXJyYXlcbiAgLy8gYXNzdW1lIGl0J3MgYmVlbiBjYWxsZWQgd2l0aCBgY29tYmluZUxhdGVzdChbb2JzMSwgb2JzMiwgb2JzM10sIHJlc3VsdFNlbGVjdG9yKWBcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG9ic2VydmFibGVzWzBdKSkge1xuICAgIG9ic2VydmFibGVzID0gPEFycmF5PE9ic2VydmFibGU8YW55Pj4+b2JzZXJ2YWJsZXNbMF07XG4gIH1cblxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCBzY2hlZHVsZXIpLmxpZnQobmV3IENvbWJpbmVMYXRlc3RPcGVyYXRvcjxULCBSPihyZXN1bHRTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29tYmluZUxhdGVzdE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IENvbWJpbmVMYXRlc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVzdWx0U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIENvbWJpbmVMYXRlc3RTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBhY3RpdmU6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgdmFsdWVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIG9ic2VydmFibGVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIHRvUmVzcG9uZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LCBwcml2YXRlIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dChvYnNlcnZhYmxlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlcy5wdXNoKE5PTkUpO1xuICAgIHRoaXMub2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gbGVuO1xuICAgICAgdGhpcy50b1Jlc3BvbmQgPSBsZW47XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSBvYnNlcnZhYmxlc1tpXTtcbiAgICAgICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSwgaSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKHVudXNlZDogU3Vic2NyaWJlcjxSPik6IHZvaWQge1xuICAgIGlmICgodGhpcy5hY3RpdmUgLT0gMSkgPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuICAgIGNvbnN0IG9sZFZhbCA9IHZhbHVlc1tvdXRlckluZGV4XTtcbiAgICBjb25zdCB0b1Jlc3BvbmQgPSAhdGhpcy50b1Jlc3BvbmRcbiAgICAgID8gMFxuICAgICAgOiBvbGRWYWwgPT09IE5PTkUgPyAtLXRoaXMudG9SZXNwb25kIDogdGhpcy50b1Jlc3BvbmQ7XG4gICAgdmFsdWVzW291dGVySW5kZXhdID0gaW5uZXJWYWx1ZTtcblxuICAgIGlmICh0b1Jlc3BvbmQgPT09IDApIHtcbiAgICAgIGlmICh0aGlzLnJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuX3RyeVJlc3VsdFNlbGVjdG9yKHZhbHVlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWVzLnNsaWNlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3RyeVJlc3VsdFNlbGVjdG9yKHZhbHVlczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0U2VsZWN0b3IuYXBwbHkodGhpcywgdmFsdWVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEludGVyb3BPYnNlcnZhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcblxuLyoqIElkZW50aWZpZXMgYW4gaW5wdXQgYXMgYmVpbmcgT2JzZXJ2YWJsZSAoYnV0IG5vdCBuZWNlc3NhcnkgYW4gUnggT2JzZXJ2YWJsZSkgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0OiBhbnkpOiBpbnB1dCBpcyBJbnRlcm9wT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0gPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuXG4vKiogSWRlbnRpZmllcyBhbiBpbnB1dCBhcyBiZWluZyBhbiBJdGVyYWJsZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSXRlcmFibGUoaW5wdXQ6IGFueSk6IGlucHV0IGlzIEl0ZXJhYmxlPGFueT4ge1xuICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9Qcm9taXNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Qcm9taXNlPFQ+KGlucHV0OiBQcm9taXNlTGlrZTxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb1Byb21pc2UoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBpbnB1dC50aGVuKFxuICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSkpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycikpKTtcbiAgICAgICAgfVxuICAgICAgKSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9JdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9JdGVyYWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tSXRlcmFibGU8VD4oaW5wdXQ6IEl0ZXJhYmxlPFQ+LCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFpbnB1dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSXRlcmFibGUgY2Fubm90IGJlIG51bGwnKTtcbiAgfVxuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb0l0ZXJhYmxlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgbGV0IGl0ZXJhdG9yOiBJdGVyYXRvcjxUPjtcbiAgICAgIHN1Yi5hZGQoKCkgPT4ge1xuICAgICAgICAvLyBGaW5hbGl6ZSBnZW5lcmF0b3JzXG4gICAgICAgIGlmIChpdGVyYXRvciAmJiB0eXBlb2YgaXRlcmF0b3IucmV0dXJuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICBpdGVyYXRvciA9IGlucHV0W1N5bWJvbF9pdGVyYXRvcl0oKTtcbiAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgdmFsdWU6IFQ7XG4gICAgICAgICAgbGV0IGRvbmU6IGJvb2xlYW47XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgZG9uZSA9IHJlc3VsdC5kb25lO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJbnRlcm9wT2JzZXJ2YWJsZSwgU2NoZWR1bGVyTGlrZSwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbU9ic2VydmFibGU8VD4oaW5wdXQ6IEludGVyb3BPYnNlcnZhYmxlPFQ+LCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9PYnNlcnZhYmxlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlOiBTdWJzY3JpYmFibGU8VD4gPSBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgICAgICAgc3ViLmFkZChvYnNlcnZhYmxlLnN1YnNjcmliZSh7XG4gICAgICAgICAgbmV4dCh2YWx1ZSkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLm5leHQodmFsdWUpKSk7IH0sXG4gICAgICAgICAgZXJyb3IoZXJyKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSkpOyB9LFxuICAgICAgICAgIGNvbXBsZXRlKCkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTsgfSxcbiAgICAgICAgfSkpO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBmcm9tUHJvbWlzZSB9IGZyb20gJy4vZnJvbVByb21pc2UnO1xuaW1wb3J0IHsgZnJvbUl0ZXJhYmxlIH0gZnJvbSAnLi9mcm9tSXRlcmFibGUnO1xuaW1wb3J0IHsgZnJvbU9ic2VydmFibGUgfSBmcm9tICcuL2Zyb21PYnNlcnZhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUbyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxPYnNlcnZhYmxlSW5wdXQ8VD4+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+PjtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgZnJvbSBhbiBBcnJheSwgYW4gYXJyYXktbGlrZSBvYmplY3QsIGEgUHJvbWlzZSwgYW4gaXRlcmFibGUgb2JqZWN0LCBvciBhbiBPYnNlcnZhYmxlLWxpa2Ugb2JqZWN0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db252ZXJ0cyBhbG1vc3QgYW55dGhpbmcgdG8gYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKGZyb20ucG5nKVxuICpcbiAqIGBmcm9tYCBjb252ZXJ0cyB2YXJpb3VzIG90aGVyIG9iamVjdHMgYW5kIGRhdGEgdHlwZXMgaW50byBPYnNlcnZhYmxlcy4gSXQgYWxzbyBjb252ZXJ0cyBhIFByb21pc2UsIGFuIGFycmF5LWxpa2UsIG9yIGFuXG4gKiA8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvSXRlcmF0aW9uX3Byb3RvY29scyNpdGVyYWJsZVwiIHRhcmdldD1cIl9ibGFua1wiPml0ZXJhYmxlPC9hPlxuICogb2JqZWN0IGludG8gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtcyBpbiB0aGF0IHByb21pc2UsIGFycmF5LCBvciBpdGVyYWJsZS4gQSBTdHJpbmcsIGluIHRoaXMgY29udGV4dCwgaXMgdHJlYXRlZFxuICogYXMgYW4gYXJyYXkgb2YgY2hhcmFjdGVycy4gT2JzZXJ2YWJsZS1saWtlIG9iamVjdHMgKGNvbnRhaW5zIGEgZnVuY3Rpb24gbmFtZWQgd2l0aCB0aGUgRVMyMDE1IFN5bWJvbCBmb3IgT2JzZXJ2YWJsZSkgY2FuIGFsc28gYmVcbiAqIGNvbnZlcnRlZCB0aHJvdWdoIHRoaXMgb3BlcmF0b3IuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuICpcbiAqIGNvbnN0IGFycmF5ID0gWzEwLCAyMCwgMzBdO1xuICogY29uc3QgcmVzdWx0ID0gZnJvbShhcnJheSk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMTAgMjAgMzBcbiAqIGBgYFxuICpcbiAqIC0tLVxuICpcbiAqICMjIyBDb252ZXJ0IGFuIGluZmluaXRlIGl0ZXJhYmxlIChmcm9tIGEgZ2VuZXJhdG9yKSB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tJztcbiAqXG4gKiBmdW5jdGlvbiogZ2VuZXJhdGVEb3VibGVzKHNlZWQpIHtcbiAqICAgIGxldCBpID0gc2VlZDtcbiAqICAgIHdoaWxlICh0cnVlKSB7XG4gKiAgICAgIHlpZWxkIGk7XG4gKiAgICAgIGkgPSAyICogaTsgLy8gZG91YmxlIGl0XG4gKiAgICB9XG4gKiB9XG4gKlxuICogY29uc3QgaXRlcmF0b3IgPSBnZW5lcmF0ZURvdWJsZXMoMyk7XG4gKiBjb25zdCByZXN1bHQgPSBmcm9tKGl0ZXJhdG9yKS5waXBlKHRha2UoMTApKTtcbiAqXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAzIDYgMTIgMjQgNDggOTYgMTkyIDM4NCA3NjggMTUzNlxuICogYGBgXG4gKlxuICogLS0tXG4gKlxuICogIyMjIHdpdGggYXN5bmMgc2NoZWR1bGVyXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuICogaW1wb3J0IHsgYXN5bmMgfSBmcm9tICdyeGpzL3NjaGVkdWxlci9hc3luYyc7XG4gKlxuICogY29uc29sZS5sb2coJ3N0YXJ0Jyk7XG4gKlxuICogY29uc3QgYXJyYXkgPSBbMTAsIDIwLCAzMF07XG4gKiBjb25zdCByZXN1bHQgPSBmcm9tKGFycmF5LCBhc3luYyk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiBjb25zb2xlLmxvZygnZW5kJyk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIHN0YXJ0IGVuZCAxMCAyMCAzMFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50fVxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn1cbiAqIEBzZWUge0BsaW5rIGZyb21Qcm9taXNlfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0PFQ+fSBBIHN1YnNjcmlwdGlvbiBvYmplY3QsIGEgUHJvbWlzZSwgYW4gT2JzZXJ2YWJsZS1saWtlLFxuICogYW4gQXJyYXksIGFuIGl0ZXJhYmxlLCBvciBhbiBhcnJheS1saWtlIG9iamVjdCB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IEFuIG9wdGlvbmFsIHtAbGluayBTY2hlZHVsZXJMaWtlfSBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn1cbiAqIEBuYW1lIGZyb21cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvKGlucHV0KSk7XG4gIH1cblxuICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgIGlmIChpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21PYnNlcnZhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21Qcm9taXNlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5KGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gIGVsc2UgaWYgKGlzSXRlcmFibGUoaW5wdXQpIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmcm9tSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0IHx8IGlucHV0KSArICcgaXMgbm90IG9ic2VydmFibGUnKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPiwgY29uY3VycmVudD86IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGlubmVyIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIHJlc3VsdFNlbGVjdG9yOiB1bmRlZmluZWQsIGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHVzZSBpbm5lciBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIEksIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PEk+LCByZXN1bHRTZWxlY3RvcjogKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSLCBjb25jdXJyZW50PzogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUHJvamVjdHMgZWFjaCBzb3VyY2UgdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSB3aGljaCBpcyBtZXJnZWQgaW4gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TWFwcyBlYWNoIHZhbHVlIHRvIGFuIE9ic2VydmFibGUsIHRoZW4gZmxhdHRlbnMgYWxsIG9mXG4gKiB0aGVzZSBpbm5lciBPYnNlcnZhYmxlcyB1c2luZyB7QGxpbmsgbWVyZ2VBbGx9Ljwvc3Bhbj5cbiAqXG4gKiAhW10obWVyZ2VNYXAucG5nKVxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGJhc2VkIG9uIGFwcGx5aW5nIGEgZnVuY3Rpb24gdGhhdCB5b3VcbiAqIHN1cHBseSB0byBlYWNoIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIHdoZXJlIHRoYXQgZnVuY3Rpb25cbiAqIHJldHVybnMgYW4gT2JzZXJ2YWJsZSwgYW5kIHRoZW4gbWVyZ2luZyB0aG9zZSByZXN1bHRpbmcgT2JzZXJ2YWJsZXMgYW5kXG4gKiBlbWl0dGluZyB0aGUgcmVzdWx0cyBvZiB0aGlzIG1lcmdlci5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBNYXAgYW5kIGZsYXR0ZW4gZWFjaCBsZXR0ZXIgdG8gYW4gT2JzZXJ2YWJsZSB0aWNraW5nIGV2ZXJ5IDEgc2Vjb25kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBsZXR0ZXJzID0gb2YoJ2EnLCAnYicsICdjJyk7XG4gKiBjb25zdCByZXN1bHQgPSBsZXR0ZXJzLnBpcGUoXG4gKiAgIG1lcmdlTWFwKHggPT4gaW50ZXJ2YWwoMTAwMCkucGlwZShtYXAoaSA9PiB4K2kpKSksXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyBhMFxuICogLy8gYjBcbiAqIC8vIGMwXG4gKiAvLyBhMVxuICogLy8gYjFcbiAqIC8vIGMxXG4gKiAvLyBjb250aW51ZXMgdG8gbGlzdCBhLGIsYyB3aXRoIHJlc3BlY3RpdmUgYXNjZW5kaW5nIGludGVnZXJzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBleGhhdXN0TWFwfVxuICogQHNlZSB7QGxpbmsgbWVyZ2V9XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwVG99XG4gKiBAc2VlIHtAbGluayBtZXJnZVNjYW59XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXB9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgP2luZGV4OiBudW1iZXIpOiBPYnNlcnZhYmxlSW5wdXR9IHByb2plY3QgQSBmdW5jdGlvblxuICogdGhhdCwgd2hlbiBhcHBsaWVkIHRvIGFuIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIHJldHVybnMgYW5cbiAqIE9ic2VydmFibGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvbmN1cnJlbnQ9TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXSBNYXhpbXVtIG51bWJlciBvZiBpbnB1dFxuICogT2JzZXJ2YWJsZXMgYmVpbmcgc3Vic2NyaWJlZCB0byBjb25jdXJyZW50bHkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGVcbiAqIHByb2plY3Rpb24gZnVuY3Rpb24gKGFuZCB0aGUgb3B0aW9uYWwgZGVwcmVjYXRlZCBgcmVzdWx0U2VsZWN0b3JgKSB0byBlYWNoIGl0ZW1cbiAqIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBtZXJnaW5nIHRoZSByZXN1bHRzIG9mIHRoZSBPYnNlcnZhYmxlc1xuICogb2J0YWluZWQgZnJvbSB0aGlzIHRyYW5zZm9ybWF0aW9uLlxuICogQG1ldGhvZCBtZXJnZU1hcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIEksIFI+KFxuICBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxJPixcbiAgcmVzdWx0U2VsZWN0b3I/OiAoKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSKSB8IG51bWJlcixcbiAgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXG4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEl8Uj4ge1xuICBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKGEsIGkpID0+IGZyb20ocHJvamVjdChhLCBpKSkucGlwZShcbiAgICAgICAgbWFwKChiLCBpaSkgPT4gcmVzdWx0U2VsZWN0b3IoYSwgYiwgaSwgaWkpKSxcbiAgICAgICksIGNvbmN1cnJlbnQpXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdudW1iZXInKSB7XG4gICAgY29uY3VycmVudCA9IHJlc3VsdFNlbGVjdG9yO1xuICB9XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgTWVyZ2VNYXBPcGVyYXRvcihwcm9qZWN0LCBjb25jdXJyZW50KSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXJnZU1hcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICB9XG5cbiAgY2FsbChvYnNlcnZlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNZXJnZU1hcFN1YnNjcmliZXIoXG4gICAgICBvYnNlcnZlciwgdGhpcy5wcm9qZWN0LCB0aGlzLmNvbmN1cnJlbnRcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlTWFwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgaGFzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYnVmZmVyOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBhY3RpdmU6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25jdXJyZW50OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPCB0aGlzLmNvbmN1cnJlbnQpIHtcbiAgICAgIHRoaXMuX3RyeU5leHQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RyeU5leHQodmFsdWU6IFQpIHtcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8Uj47XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4Kys7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJvamVjdCh2YWx1ZSwgaW5kZXgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSsrO1xuICAgIHRoaXMuX2lubmVyU3ViKHJlc3VsdCwgdmFsdWUsIGluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgX2lubmVyU3ViKGlzaDogT2JzZXJ2YWJsZUlucHV0PFI+LCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGlubmVyU3Vic2NyaWJlciA9IG5ldyBJbm5lclN1YnNjcmliZXIodGhpcywgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgZGVzdGluYXRpb24uYWRkKGlubmVyU3Vic2NyaWJlcik7XG4gICAgc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4odGhpcywgaXNoLCB2YWx1ZSwgaW5kZXgsIGlubmVyU3Vic2NyaWJlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IDAgJiYgdGhpcy5idWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGlubmVyVmFsdWUpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIHRoaXMucmVtb3ZlKGlubmVyU3ViKTtcbiAgICB0aGlzLmFjdGl2ZS0tO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fbmV4dChidWZmZXIuc2hpZnQoKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCAmJiB0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiXG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbGw8VD4oY29uY3VycmVudD86IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPjtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlIGludG8gYSBmaXJzdC1vcmRlciBPYnNlcnZhYmxlIHdoaWNoXG4gKiBjb25jdXJyZW50bHkgZGVsaXZlcnMgYWxsIHZhbHVlcyB0aGF0IGFyZSBlbWl0dGVkIG9uIHRoZSBpbm5lciBPYnNlcnZhYmxlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgYW4gT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcy48L3NwYW4+XG4gKlxuICogIVtdKG1lcmdlQWxsLnBuZylcbiAqXG4gKiBgbWVyZ2VBbGxgIHN1YnNjcmliZXMgdG8gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIE9ic2VydmFibGVzLCBhbHNvIGtub3duIGFzXG4gKiBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlLiBFYWNoIHRpbWUgaXQgb2JzZXJ2ZXMgb25lIG9mIHRoZXNlIGVtaXR0ZWQgaW5uZXJcbiAqIE9ic2VydmFibGVzLCBpdCBzdWJzY3JpYmVzIHRvIHRoYXQgYW5kIGRlbGl2ZXJzIGFsbCB0aGUgdmFsdWVzIGZyb20gdGhlXG4gKiBpbm5lciBPYnNlcnZhYmxlIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlIG9ubHlcbiAqIGNvbXBsZXRlcyBvbmNlIGFsbCBpbm5lciBPYnNlcnZhYmxlcyBoYXZlIGNvbXBsZXRlZC4gQW55IGVycm9yIGRlbGl2ZXJlZCBieVxuICogYSBpbm5lciBPYnNlcnZhYmxlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNwYXduIGEgbmV3IGludGVydmFsIE9ic2VydmFibGUgZm9yIGVhY2ggY2xpY2sgZXZlbnQsIGFuZCBibGVuZCB0aGVpciBvdXRwdXRzIGFzIG9uZSBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShtYXAoKGV2KSA9PiBpbnRlcnZhbCgxMDAwKSkpO1xuICogY29uc3QgZmlyc3RPcmRlciA9IGhpZ2hlck9yZGVyLnBpcGUobWVyZ2VBbGwoKSk7XG4gKiBmaXJzdE9yZGVyLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIENvdW50IGZyb20gMCB0byA5IGV2ZXJ5IHNlY29uZCBmb3IgZWFjaCBjbGljaywgYnV0IG9ubHkgYWxsb3cgMiBjb25jdXJyZW50IHRpbWVyc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGhpZ2hlck9yZGVyID0gY2xpY2tzLnBpcGUoXG4gKiAgIG1hcCgoZXYpID0+IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgxMCkpKSxcbiAqICk7XG4gKiBjb25zdCBmaXJzdE9yZGVyID0gaGlnaGVyT3JkZXIucGlwZShtZXJnZUFsbCgyKSk7XG4gKiBmaXJzdE9yZGVyLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXRBbGx9XG4gKiBAc2VlIHtAbGluayBleGhhdXN0fVxuICogQHNlZSB7QGxpbmsgbWVyZ2V9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwVG99XG4gKiBAc2VlIHtAbGluayBtZXJnZVNjYW59XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXB9XG4gKiBAc2VlIHtAbGluayB6aXBBbGx9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2YgaW5uZXJcbiAqIE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHZhbHVlcyBjb21pbmcgZnJvbSBhbGwgdGhlXG4gKiBpbm5lciBPYnNlcnZhYmxlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgbWVyZ2VBbGxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUFsbDxUPihjb25jdXJyZW50OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gbWVyZ2VNYXA8VCwgVD4oaWRlbnRpdHkgYXMgKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8VD4sIGNvbmN1cnJlbnQpO1xufVxuIiwiXG5pbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4vbWVyZ2VBbGwnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGw8Uj4oKTogT3BlcmF0b3JGdW5jdGlvbjxhbnksIFI+O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgaGlnaGVyLW9yZGVyIE9ic2VydmFibGUgaW50byBhIGZpcnN0LW9yZGVyIE9ic2VydmFibGUgYnlcbiAqIGNvbmNhdGVuYXRpbmcgdGhlIGlubmVyIE9ic2VydmFibGVzIGluIG9yZGVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5GbGF0dGVucyBhbiBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzIGJ5IHB1dHRpbmcgb25lXG4gKiBpbm5lciBPYnNlcnZhYmxlIGFmdGVyIHRoZSBvdGhlci48L3NwYW4+XG4gKlxuICogIVtdKGNvbmNhdEFsbC5wbmcpXG4gKlxuICogSm9pbnMgZXZlcnkgT2JzZXJ2YWJsZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgKGEgaGlnaGVyLW9yZGVyIE9ic2VydmFibGUpLCBpblxuICogYSBzZXJpYWwgZmFzaGlvbi4gSXQgc3Vic2NyaWJlcyB0byBlYWNoIGlubmVyIE9ic2VydmFibGUgb25seSBhZnRlciB0aGVcbiAqIHByZXZpb3VzIGlubmVyIE9ic2VydmFibGUgaGFzIGNvbXBsZXRlZCwgYW5kIG1lcmdlcyBhbGwgb2YgdGhlaXIgdmFsdWVzIGludG9cbiAqIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlLlxuICpcbiAqIF9fV2FybmluZzpfXyBJZiB0aGUgc291cmNlIE9ic2VydmFibGUgZW1pdHMgT2JzZXJ2YWJsZXMgcXVpY2tseSBhbmRcbiAqIGVuZGxlc3NseSwgYW5kIHRoZSBpbm5lciBPYnNlcnZhYmxlcyBpdCBlbWl0cyBnZW5lcmFsbHkgY29tcGxldGUgc2xvd2VyIHRoYW5cbiAqIHRoZSBzb3VyY2UgZW1pdHMsIHlvdSBjYW4gcnVuIGludG8gbWVtb3J5IGlzc3VlcyBhcyB0aGUgaW5jb21pbmcgT2JzZXJ2YWJsZXNcbiAqIGNvbGxlY3QgaW4gYW4gdW5ib3VuZGVkIGJ1ZmZlci5cbiAqXG4gKiBOb3RlOiBgY29uY2F0QWxsYCBpcyBlcXVpdmFsZW50IHRvIGBtZXJnZUFsbGAgd2l0aCBjb25jdXJyZW5jeSBwYXJhbWV0ZXIgc2V0XG4gKiB0byBgMWAuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIEZvciBlYWNoIGNsaWNrIGV2ZW50LCB0aWNrIGV2ZXJ5IHNlY29uZCBmcm9tIDAgdG8gMywgd2l0aCBubyBjb25jdXJyZW5jeVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGhpZ2hlck9yZGVyID0gY2xpY2tzLnBpcGUoXG4gKiAgIG1hcChldiA9PiBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoNCkpKSxcbiAqICk7XG4gKiBjb25zdCBmaXJzdE9yZGVyID0gaGlnaGVyT3JkZXIucGlwZShjb25jYXRBbGwoKSk7XG4gKiBmaXJzdE9yZGVyLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyAocmVzdWx0cyBhcmUgbm90IGNvbmN1cnJlbnQpXG4gKiAvLyBGb3IgZXZlcnkgY2xpY2sgb24gdGhlIFwiZG9jdW1lbnRcIiBpdCB3aWxsIGVtaXQgdmFsdWVzIDAgdG8gMyBzcGFjZWRcbiAqIC8vIG9uIGEgMTAwMG1zIGludGVydmFsXG4gKiAvLyBvbmUgY2xpY2sgPSAxMDAwbXMtPiAwIC0xMDAwbXMtPiAxIC0xMDAwbXMtPiAyIC0xMDAwbXMtPiAzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lQWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0fVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwVG99XG4gKiBAc2VlIHtAbGluayBleGhhdXN0fVxuICogQHNlZSB7QGxpbmsgbWVyZ2VBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXB9XG4gKiBAc2VlIHtAbGluayB6aXBBbGx9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBlbWl0dGluZyB2YWx1ZXMgZnJvbSBhbGwgdGhlIGlubmVyXG4gKiBPYnNlcnZhYmxlcyBjb25jYXRlbmF0ZWQuXG4gKiBAbWV0aG9kIGNvbmNhdEFsbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdEFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVD4ge1xuICByZXR1cm4gbWVyZ2VBbGw8VD4oMSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgb2YgfSBmcm9tICcuL29mJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuaW1wb3J0IHsgY29uY2F0QWxsIH0gZnJvbSAnLi4vb3BlcmF0b3JzL2NvbmNhdEFsbCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDM+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDY+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxUPiguLi5vYnNlcnZhYmxlczogKE9ic2VydmFibGVJbnB1dDxUPiB8IFNjaGVkdWxlckxpa2UpW10pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBSPiguLi5vYnNlcnZhYmxlczogKE9ic2VydmFibGVJbnB1dDxhbnk+IHwgU2NoZWR1bGVyTGlrZSlbXSk6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqXG4gKiBDcmVhdGVzIGFuIG91dHB1dCBPYnNlcnZhYmxlIHdoaWNoIHNlcXVlbnRpYWxseSBlbWl0cyBhbGwgdmFsdWVzIGZyb20gZ2l2ZW5cbiAqIE9ic2VydmFibGUgYW5kIHRoZW4gbW92ZXMgb24gdG8gdGhlIG5leHQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbmNhdGVuYXRlcyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0b2dldGhlciBieVxuICogc2VxdWVudGlhbGx5IGVtaXR0aW5nIHRoZWlyIHZhbHVlcywgb25lIE9ic2VydmFibGUgYWZ0ZXIgdGhlIG90aGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oY29uY2F0LnBuZylcbiAqXG4gKiBgY29uY2F0YCBqb2lucyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0b2dldGhlciwgYnkgc3Vic2NyaWJpbmcgdG8gdGhlbSBvbmUgYXQgYSB0aW1lIGFuZFxuICogbWVyZ2luZyB0aGVpciByZXN1bHRzIGludG8gdGhlIG91dHB1dCBPYnNlcnZhYmxlLiBZb3UgY2FuIHBhc3MgZWl0aGVyIGFuIGFycmF5IG9mXG4gKiBPYnNlcnZhYmxlcywgb3IgcHV0IHRoZW0gZGlyZWN0bHkgYXMgYXJndW1lbnRzLiBQYXNzaW5nIGFuIGVtcHR5IGFycmF5IHdpbGwgcmVzdWx0XG4gKiBpbiBPYnNlcnZhYmxlIHRoYXQgY29tcGxldGVzIGltbWVkaWF0ZWx5LlxuICpcbiAqIGBjb25jYXRgIHdpbGwgc3Vic2NyaWJlIHRvIGZpcnN0IGlucHV0IE9ic2VydmFibGUgYW5kIGVtaXQgYWxsIGl0cyB2YWx1ZXMsIHdpdGhvdXRcbiAqIGNoYW5naW5nIG9yIGFmZmVjdGluZyB0aGVtIGluIGFueSB3YXkuIFdoZW4gdGhhdCBPYnNlcnZhYmxlIGNvbXBsZXRlcywgaXQgd2lsbFxuICogc3Vic2NyaWJlIHRvIHRoZW4gbmV4dCBPYnNlcnZhYmxlIHBhc3NlZCBhbmQsIGFnYWluLCBlbWl0IGl0cyB2YWx1ZXMuIFRoaXMgd2lsbCBiZVxuICogcmVwZWF0ZWQsIHVudGlsIHRoZSBvcGVyYXRvciBydW5zIG91dCBvZiBPYnNlcnZhYmxlcy4gV2hlbiBsYXN0IGlucHV0IE9ic2VydmFibGUgY29tcGxldGVzLFxuICogYGNvbmNhdGAgd2lsbCBjb21wbGV0ZSBhcyB3ZWxsLiBBdCBhbnkgZ2l2ZW4gbW9tZW50IG9ubHkgb25lIE9ic2VydmFibGUgcGFzc2VkIHRvIG9wZXJhdG9yXG4gKiBlbWl0cyB2YWx1ZXMuIElmIHlvdSB3b3VsZCBsaWtlIHRvIGVtaXQgdmFsdWVzIGZyb20gcGFzc2VkIE9ic2VydmFibGVzIGNvbmN1cnJlbnRseSwgY2hlY2sgb3V0XG4gKiB7QGxpbmsgbWVyZ2V9IGluc3RlYWQsIGVzcGVjaWFsbHkgd2l0aCBvcHRpb25hbCBgY29uY3VycmVudGAgcGFyYW1ldGVyLiBBcyBhIG1hdHRlciBvZiBmYWN0LFxuICogYGNvbmNhdGAgaXMgYW4gZXF1aXZhbGVudCBvZiBgbWVyZ2VgIG9wZXJhdG9yIHdpdGggYGNvbmN1cnJlbnRgIHBhcmFtZXRlciBzZXQgdG8gYDFgLlxuICpcbiAqIE5vdGUgdGhhdCBpZiBzb21lIGlucHV0IE9ic2VydmFibGUgbmV2ZXIgY29tcGxldGVzLCBgY29uY2F0YCB3aWxsIGFsc28gbmV2ZXIgY29tcGxldGVcbiAqIGFuZCBPYnNlcnZhYmxlcyBmb2xsb3dpbmcgdGhlIG9uZSB0aGF0IGRpZCBub3QgY29tcGxldGUgd2lsbCBuZXZlciBiZSBzdWJzY3JpYmVkLiBPbiB0aGUgb3RoZXJcbiAqIGhhbmQsIGlmIHNvbWUgT2JzZXJ2YWJsZSBzaW1wbHkgY29tcGxldGVzIGltbWVkaWF0ZWx5IGFmdGVyIGl0IGlzIHN1YnNjcmliZWQsIGl0IHdpbGwgYmVcbiAqIGludmlzaWJsZSBmb3IgYGNvbmNhdGAsIHdoaWNoIHdpbGwganVzdCBtb3ZlIG9uIHRvIHRoZSBuZXh0IE9ic2VydmFibGUuXG4gKlxuICogSWYgYW55IE9ic2VydmFibGUgaW4gY2hhaW4gZXJyb3JzLCBpbnN0ZWFkIG9mIHBhc3NpbmcgY29udHJvbCB0byB0aGUgbmV4dCBPYnNlcnZhYmxlLFxuICogYGNvbmNhdGAgd2lsbCBlcnJvciBpbW1lZGlhdGVseSBhcyB3ZWxsLiBPYnNlcnZhYmxlcyB0aGF0IHdvdWxkIGJlIHN1YnNjcmliZWQgYWZ0ZXJcbiAqIHRoZSBvbmUgdGhhdCBlbWl0dGVkIGVycm9yLCBuZXZlciB3aWxsLlxuICpcbiAqIElmIHlvdSBwYXNzIHRvIGBjb25jYXRgIHRoZSBzYW1lIE9ic2VydmFibGUgbWFueSB0aW1lcywgaXRzIHN0cmVhbSBvZiB2YWx1ZXNcbiAqIHdpbGwgYmUgXCJyZXBsYXllZFwiIG9uIGV2ZXJ5IHN1YnNjcmlwdGlvbiwgd2hpY2ggbWVhbnMgeW91IGNhbiByZXBlYXQgZ2l2ZW4gT2JzZXJ2YWJsZVxuICogYXMgbWFueSB0aW1lcyBhcyB5b3UgbGlrZS4gSWYgcGFzc2luZyB0aGUgc2FtZSBPYnNlcnZhYmxlIHRvIGBjb25jYXRgIDEwMDAgdGltZXMgYmVjb21lcyB0ZWRpb3VzLFxuICogeW91IGNhbiBhbHdheXMgdXNlIHtAbGluayByZXBlYXR9LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ29uY2F0ZW5hdGUgYSB0aW1lciBjb3VudGluZyBmcm9tIDAgdG8gMyB3aXRoIGEgc3luY2hyb25vdXMgc2VxdWVuY2UgZnJvbSAxIHRvIDEwXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lciA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSg0KSk7XG4gKiBjb25zdCBzZXF1ZW5jZSA9IHJhbmdlKDEsIDEwKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdCh0aW1lciwgc2VxdWVuY2UpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyByZXN1bHRzIGluOlxuICogLy8gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gMiAtMTAwMG1zLT4gMyAtaW1tZWRpYXRlLT4gMSAuLi4gMTBcbiAqIGBgYFxuICpcbiAqICMjIyBDb25jYXRlbmF0ZSBhbiBhcnJheSBvZiAzIE9ic2VydmFibGVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lcjEgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHRpbWVyMiA9IGludGVydmFsKDIwMDApLnBpcGUodGFrZSg2KSk7XG4gKiBjb25zdCB0aW1lcjMgPSBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgcmVzdWx0ID0gY29uY2F0KFt0aW1lcjEsIHRpbWVyMiwgdGltZXIzXSk7IC8vIG5vdGUgdGhhdCBhcnJheSBpcyBwYXNzZWRcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gcmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gKFByaW50cyB0byBjb25zb2xlIHNlcXVlbnRpYWxseSlcbiAqIC8vIC0xMDAwbXMtPiAwIC0xMDAwbXMtPiAxIC0xMDAwbXMtPiAuLi4gOVxuICogLy8gLTIwMDBtcy0+IDAgLTIwMDBtcy0+IDEgLTIwMDBtcy0+IC4uLiA1XG4gKiAvLyAtNTAwbXMtPiAwIC01MDBtcy0+IDEgLTUwMG1zLT4gLi4uIDlcbiAqIGBgYFxuICpcbiAqICMjIyBDb25jYXRlbmF0ZSB0aGUgc2FtZSBPYnNlcnZhYmxlIHRvIHJlcGVhdCBpdFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMikpO1xuICogKlxuICogY29uY2F0KHRpbWVyLCB0aW1lcikgLy8gY29uY2F0ZW5hdGluZyB0aGUgc2FtZSBPYnNlcnZhYmxlIVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCcuLi5hbmQgaXQgaXMgZG9uZSEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMCBhZnRlciAxc1xuICogLy8gMSBhZnRlciAyc1xuICogLy8gMCBhZnRlciAzc1xuICogLy8gMSBhZnRlciA0c1xuICogLy8gXCIuLi5hbmQgaXQgaXMgZG9uZSFcIiBhbHNvIGFmdGVyIDRzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXRBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXBUb31cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGVJbnB1dH0gaW5wdXQxIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29uY2F0ZW5hdGUgd2l0aCBvdGhlcnMuXG4gKiBAcGFyYW0ge09ic2VydmFibGVJbnB1dH0gaW5wdXQyIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29uY2F0ZW5hdGUgd2l0aCBvdGhlcnMuXG4gKiBNb3JlIHRoYW4gb25lIGlucHV0IE9ic2VydmFibGVzIG1heSBiZSBnaXZlbiBhcyBhcmd1bWVudC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBBbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gc2NoZWR1bGUgZWFjaFxuICogT2JzZXJ2YWJsZSBzdWJzY3JpcHRpb24gb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbGwgdmFsdWVzIG9mIGVhY2ggcGFzc2VkIE9ic2VydmFibGUgbWVyZ2VkIGludG8gYVxuICogc2luZ2xlIE9ic2VydmFibGUsIGluIG9yZGVyLCBpbiBzZXJpYWwgZmFzaGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgY29uY2F0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxSPiB7XG4gIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDEgfHwgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMiAmJiBpc1NjaGVkdWxlcihvYnNlcnZhYmxlc1sxXSkpKSB7XG4gICAgcmV0dXJuIGZyb20oPGFueT5vYnNlcnZhYmxlc1swXSk7XG4gIH1cbiAgcmV0dXJuIGNvbmNhdEFsbDxSPigpKG9mKC4uLm9ic2VydmFibGVzKSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJzsgLy8gbG9sXG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0LCBvbiBzdWJzY3JpYmUsIGNhbGxzIGFuIE9ic2VydmFibGUgZmFjdG9yeSB0b1xuICogbWFrZSBhbiBPYnNlcnZhYmxlIGZvciBlYWNoIG5ldyBPYnNlcnZlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q3JlYXRlcyB0aGUgT2JzZXJ2YWJsZSBsYXppbHksIHRoYXQgaXMsIG9ubHkgd2hlbiBpdFxuICogaXMgc3Vic2NyaWJlZC5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10oZGVmZXIucG5nKVxuICpcbiAqIGBkZWZlcmAgYWxsb3dzIHlvdSB0byBjcmVhdGUgdGhlIE9ic2VydmFibGUgb25seSB3aGVuIHRoZSBPYnNlcnZlclxuICogc3Vic2NyaWJlcywgYW5kIGNyZWF0ZSBhIGZyZXNoIE9ic2VydmFibGUgZm9yIGVhY2ggT2JzZXJ2ZXIuIEl0IHdhaXRzIHVudGlsXG4gKiBhbiBPYnNlcnZlciBzdWJzY3JpYmVzIHRvIGl0LCBhbmQgdGhlbiBpdCBnZW5lcmF0ZXMgYW4gT2JzZXJ2YWJsZSxcbiAqIHR5cGljYWxseSB3aXRoIGFuIE9ic2VydmFibGUgZmFjdG9yeSBmdW5jdGlvbi4gSXQgZG9lcyB0aGlzIGFmcmVzaCBmb3IgZWFjaFxuICogc3Vic2NyaWJlciwgc28gYWx0aG91Z2ggZWFjaCBzdWJzY3JpYmVyIG1heSB0aGluayBpdCBpcyBzdWJzY3JpYmluZyB0byB0aGVcbiAqIHNhbWUgT2JzZXJ2YWJsZSwgaW4gZmFjdCBlYWNoIHN1YnNjcmliZXIgZ2V0cyBpdHMgb3duIGluZGl2aWR1YWxcbiAqIE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFN1YnNjcmliZSB0byBlaXRoZXIgYW4gT2JzZXJ2YWJsZSBvZiBjbGlja3Mgb3IgYW4gT2JzZXJ2YWJsZSBvZiBpbnRlcnZhbCwgYXQgcmFuZG9tXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3NPckludGVydmFsID0gZGVmZXIoZnVuY3Rpb24gKCkge1xuICogICByZXR1cm4gTWF0aC5yYW5kb20oKSA+IDAuNVxuICogICAgID8gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKVxuICogICAgIDogaW50ZXJ2YWwoMTAwMCk7XG4gKiB9KTtcbiAqIGNsaWNrc09ySW50ZXJ2YWwuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyBiZWhhdmlvcjpcbiAqIC8vIElmIHRoZSByZXN1bHQgb2YgTWF0aC5yYW5kb20oKSBpcyBncmVhdGVyIHRoYW4gMC41IGl0IHdpbGwgbGlzdGVuXG4gKiAvLyBmb3IgY2xpY2tzIGFueXdoZXJlIG9uIHRoZSBcImRvY3VtZW50XCI7IHdoZW4gZG9jdW1lbnQgaXMgY2xpY2tlZCBpdFxuICogLy8gd2lsbCBsb2cgYSBNb3VzZUV2ZW50IG9iamVjdCB0byB0aGUgY29uc29sZS4gSWYgdGhlIHJlc3VsdCBpcyBsZXNzXG4gKiAvLyB0aGFuIDAuNSBpdCB3aWxsIGVtaXQgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQoMTAwMG1zKS5cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBTdWJzY3JpYmFibGVPclByb21pc2V9IG9ic2VydmFibGVGYWN0b3J5IFRoZSBPYnNlcnZhYmxlXG4gKiBmYWN0b3J5IGZ1bmN0aW9uIHRvIGludm9rZSBmb3IgZWFjaCBPYnNlcnZlciB0aGF0IHN1YnNjcmliZXMgdG8gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS4gTWF5IGFsc28gcmV0dXJuIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBiZSBjb252ZXJ0ZWQgb24gdGhlIGZseVxuICogdG8gYW4gT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgd2hvc2UgT2JzZXJ2ZXJzJyBzdWJzY3JpcHRpb25zIHRyaWdnZXJcbiAqIGFuIGludm9jYXRpb24gb2YgdGhlIGdpdmVuIE9ic2VydmFibGUgZmFjdG9yeSBmdW5jdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgZGVmZXJcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZlcjxUPihvYnNlcnZhYmxlRmFjdG9yeTogKCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+IHwgdm9pZCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGlucHV0OiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gfCB2b2lkO1xuICAgIHRyeSB7XG4gICAgICBpbnB1dCA9IG9ic2VydmFibGVGYWN0b3J5KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2UgPSBpbnB1dCA/IGZyb20oaW5wdXQpIDogZW1wdHkoKTtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfSk7XG59IiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLy8gZm9ya0pvaW4oW2EkLCBiJCwgYyRdKTtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+XSk6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMj4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPl0pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMz4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNT4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0PiwgT2JzZXJ2YWJsZUlucHV0PFQ1Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0PiwgT2JzZXJ2YWJsZUlucHV0PFQ1PiwgT2JzZXJ2YWJsZUlucHV0PFQ2Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihzb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTogT2JzZXJ2YWJsZTxUW10+O1xuXG4vLyBmb3JrSm9pbihhJCwgYiQsIGMkKVxuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+KTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgZGVwcmVjYXRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luKC4uLmFyZ3M6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+fEZ1bmN0aW9uPik6IE9ic2VydmFibGU8YW55PjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPiguLi5zb3VyY2VzOiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSk6IE9ic2VydmFibGU8VFtdPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogSm9pbnMgbGFzdCB2YWx1ZXMgZW1pdHRlZCBieSBwYXNzZWQgT2JzZXJ2YWJsZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldhaXQgZm9yIE9ic2VydmFibGVzIHRvIGNvbXBsZXRlIGFuZCB0aGVuIGNvbWJpbmUgbGFzdCB2YWx1ZXMgdGhleSBlbWl0dGVkLjwvc3Bhbj5cbiAqXG4gKiAhW10oZm9ya0pvaW4ucG5nKVxuICpcbiAqIGBmb3JrSm9pbmAgaXMgYW4gb3BlcmF0b3IgdGhhdCB0YWtlcyBhbnkgbnVtYmVyIG9mIE9ic2VydmFibGVzIHdoaWNoIGNhbiBiZSBwYXNzZWQgZWl0aGVyIGFzIGFuIGFycmF5XG4gKiBvciBkaXJlY3RseSBhcyBhcmd1bWVudHMuIElmIG5vIGlucHV0IE9ic2VydmFibGVzIGFyZSBwcm92aWRlZCwgcmVzdWx0aW5nIHN0cmVhbSB3aWxsIGNvbXBsZXRlXG4gKiBpbW1lZGlhdGVseS5cbiAqXG4gKiBgZm9ya0pvaW5gIHdpbGwgd2FpdCBmb3IgYWxsIHBhc3NlZCBPYnNlcnZhYmxlcyB0byBjb21wbGV0ZSBhbmQgdGhlbiBpdCB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBsYXN0XG4gKiB2YWx1ZXMgZnJvbSBjb3JyZXNwb25kaW5nIE9ic2VydmFibGVzLiBTbyBpZiB5b3UgcGFzcyBgbmAgT2JzZXJ2YWJsZXMgdG8gdGhlIG9wZXJhdG9yLCByZXN1bHRpbmdcbiAqIGFycmF5IHdpbGwgaGF2ZSBgbmAgdmFsdWVzLCB3aGVyZSBmaXJzdCB2YWx1ZSBpcyB0aGUgbGFzdCB0aGluZyBlbWl0dGVkIGJ5IHRoZSBmaXJzdCBPYnNlcnZhYmxlLFxuICogc2Vjb25kIHZhbHVlIGlzIHRoZSBsYXN0IHRoaW5nIGVtaXR0ZWQgYnkgdGhlIHNlY29uZCBPYnNlcnZhYmxlIGFuZCBzbyBvbi4gVGhhdCBtZWFucyBgZm9ya0pvaW5gIHdpbGxcbiAqIG5vdCBlbWl0IG1vcmUgdGhhbiBvbmNlIGFuZCBpdCB3aWxsIGNvbXBsZXRlIGFmdGVyIHRoYXQuIElmIHlvdSBuZWVkIHRvIGVtaXQgY29tYmluZWQgdmFsdWVzIG5vdCBvbmx5XG4gKiBhdCB0aGUgZW5kIG9mIGxpZmVjeWNsZSBvZiBwYXNzZWQgT2JzZXJ2YWJsZXMsIGJ1dCBhbHNvIHRocm91Z2hvdXQgaXQsIHRyeSBvdXQge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBvciB7QGxpbmsgemlwfSBpbnN0ZWFkLlxuICpcbiAqIEluIG9yZGVyIGZvciByZXN1bHRpbmcgYXJyYXkgdG8gaGF2ZSB0aGUgc2FtZSBsZW5ndGggYXMgdGhlIG51bWJlciBvZiBpbnB1dCBPYnNlcnZhYmxlcywgd2hlbmV2ZXIgYW55IG9mXG4gKiB0aGF0IE9ic2VydmFibGVzIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIGFueSB2YWx1ZSwgYGZvcmtKb2luYCB3aWxsIGNvbXBsZXRlIGF0IHRoYXQgbW9tZW50IGFzIHdlbGxcbiAqIGFuZCBpdCB3aWxsIG5vdCBlbWl0IGFueXRoaW5nIGVpdGhlciwgZXZlbiBpZiBpdCBhbHJlYWR5IGhhcyBzb21lIGxhc3QgdmFsdWVzIGZyb20gb3RoZXIgT2JzZXJ2YWJsZXMuXG4gKiBDb252ZXJzZWx5LCBpZiB0aGVyZSBpcyBhbiBPYnNlcnZhYmxlIHRoYXQgbmV2ZXIgY29tcGxldGVzLCBgZm9ya0pvaW5gIHdpbGwgbmV2ZXIgY29tcGxldGUgYXMgd2VsbCxcbiAqIHVubGVzcyBhdCBhbnkgcG9pbnQgc29tZSBvdGhlciBPYnNlcnZhYmxlIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIHZhbHVlLCB3aGljaCBicmluZ3MgdXMgYmFjayB0b1xuICogdGhlIHByZXZpb3VzIGNhc2UuIE92ZXJhbGwsIGluIG9yZGVyIGZvciBgZm9ya0pvaW5gIHRvIGVtaXQgYSB2YWx1ZSwgYWxsIE9ic2VydmFibGVzIHBhc3NlZCBhcyBhcmd1bWVudHNcbiAqIGhhdmUgdG8gZW1pdCBzb21ldGhpbmcgYXQgbGVhc3Qgb25jZSBhbmQgY29tcGxldGUuXG4gKlxuICogSWYgYW55IGlucHV0IE9ic2VydmFibGUgZXJyb3JzIGF0IHNvbWUgcG9pbnQsIGBmb3JrSm9pbmAgd2lsbCBlcnJvciBhcyB3ZWxsIGFuZCBhbGwgb3RoZXIgT2JzZXJ2YWJsZXNcbiAqIHdpbGwgYmUgaW1tZWRpYXRlbHkgdW5zdWJzY3JpYmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgYGZvcmtKb2luYCBhY2NlcHRzIHByb2plY3QgZnVuY3Rpb24sIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB2YWx1ZXMgd2hpY2ggbm9ybWFsbHlcbiAqIHdvdWxkIGxhbmQgaW4gZW1pdHRlZCBhcnJheS4gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgYnkgcHJvamVjdCBmdW5jdGlvbiwgd2lsbCBhcHBlYXIgaW4gb3V0cHV0XG4gKiBPYnNlcnZhYmxlIGluc3RlYWQuIFRoaXMgbWVhbnMgdGhhdCBkZWZhdWx0IHByb2plY3QgY2FuIGJlIHRob3VnaHQgb2YgYXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiBhbGwgaXRzIGFyZ3VtZW50cyBhbmQgcHV0cyB0aGVtIGludG8gYW4gYXJyYXkuIE5vdGUgdGhhdCBwcm9qZWN0IGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIG9ubHlcbiAqIHdoZW4gb3V0cHV0IE9ic2VydmFibGUgaXMgc3VwcG9zZWQgdG8gZW1pdCBhIHJlc3VsdC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIG9wZXJhdG9yIGVtaXR0aW5nIGltbWVkaWF0ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIG9mKDEsIDIsIDMsIDQpLFxuICogICBvZig1LCA2LCA3LCA4KSxcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gWzQsIDhdXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCJcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBvcGVyYXRvciBlbWl0dGluZyBhZnRlciBzb21lIHRpbWVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZvcmtKb2luLCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIGludGVydmFsKDEwMDApLnBpcGUodGFrZSgzKSksIC8vIGVtaXQgMCwgMSwgMiBldmVyeSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiAgIGludGVydmFsKDUwMCkucGlwZSh0YWtlKDQpKSwgIC8vIGVtaXQgMCwgMSwgMiwgMyBldmVyeSBoYWxmIGEgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBbMiwgM10gYWZ0ZXIgMyBzZWNvbmRzXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCIgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBwcm9qZWN0IGZ1bmN0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMykpLCAvLyBlbWl0IDAsIDEsIDIgZXZlcnkgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogICBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSg0KSksICAvLyBlbWl0IDAsIDEsIDIsIDMgZXZlcnkgaGFsZiBhIHNlY29uZCBhbmQgY29tcGxldGVcbiAqICkucGlwZShcbiAqICAgbWFwKChbbiwgbV0pID0+IG4gKyBtKSxcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gNSBhZnRlciAzIHNlY29uZHNcbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIiBpbW1lZGlhdGVseSBhZnRlclxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqIEBzZWUge0BsaW5rIHppcH1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gc291cmNlcyBBbnkgbnVtYmVyIG9mIE9ic2VydmFibGVzIHByb3ZpZGVkIGVpdGhlciBhcyBhbiBhcnJheSBvciBhcyBhbiBhcmd1bWVudHNcbiAqIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgb3BlcmF0b3IuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbcHJvamVjdF0gRnVuY3Rpb24gdGhhdCB0YWtlcyB2YWx1ZXMgZW1pdHRlZCBieSBpbnB1dCBPYnNlcnZhYmxlcyBhbmQgcmV0dXJucyB2YWx1ZVxuICogdGhhdCB3aWxsIGFwcGVhciBpbiByZXN1bHRpbmcgT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGRlZmF1bHQgYXJyYXkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBPYnNlcnZhYmxlIGVtaXR0aW5nIGVpdGhlciBhbiBhcnJheSBvZiBsYXN0IHZhbHVlcyBlbWl0dGVkIGJ5IHBhc3NlZCBPYnNlcnZhYmxlc1xuICogb3IgdmFsdWUgZnJvbSBwcm9qZWN0IGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oXG4gIC4uLnNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8IE9ic2VydmFibGVJbnB1dDxUPltdIHwgRnVuY3Rpb24+XG4pOiBPYnNlcnZhYmxlPFRbXT4ge1xuXG4gIGxldCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb247XG4gIGlmICh0eXBlb2Ygc291cmNlc1tzb3VyY2VzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmVzdWx0U2VsZWN0b3IgPSBzb3VyY2VzLnBvcCgpIGFzIEZ1bmN0aW9uO1xuICB9XG5cbiAgLy8gaWYgdGhlIGZpcnN0IGFuZCBvbmx5IG90aGVyIGFyZ3VtZW50IGlzIGFuIGFycmF5XG4gIC8vIGFzc3VtZSBpdCdzIGJlZW4gY2FsbGVkIHdpdGggYGZvcmtKb2luKFtvYnMxLCBvYnMyLCBvYnMzXSlgXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KHNvdXJjZXNbMF0pKSB7XG4gICAgc291cmNlcyA9IHNvdXJjZXNbMF0gYXMgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+PjtcbiAgfVxuXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBFTVBUWTtcbiAgfVxuXG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJldHVybiBmb3JrSm9pbihzb3VyY2VzKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICByZXR1cm4gbmV3IEZvcmtKb2luU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBzb3VyY2VzIGFzIEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pO1xuICB9KTtcbn1cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBGb3JrSm9pblN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgVD4ge1xuICBwcml2YXRlIGNvbXBsZXRlZCA9IDA7XG4gIHByaXZhdGUgdmFsdWVzOiBUW107XG4gIHByaXZhdGUgaGF2ZVZhbHVlcyA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcblxuICAgIGNvbnN0IGxlbiA9IHNvdXJjZXMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBzb3VyY2UsIG51bGwsIGkpO1xuXG4gICAgICBpZiAoaW5uZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5hZGQoaW5uZXJTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogYW55LCBpbm5lclZhbHVlOiBULFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1tvdXRlckluZGV4XSA9IGlubmVyVmFsdWU7XG4gICAgaWYgKCEoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUpIHtcbiAgICAgIChpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSA9IHRydWU7XG4gICAgICB0aGlzLmhhdmVWYWx1ZXMrKztcbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiwgaGF2ZVZhbHVlcywgdmFsdWVzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgICBpZiAoIShpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSkge1xuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbXBsZXRlZCsrO1xuXG4gICAgaWYgKHRoaXMuY29tcGxldGVkICE9PSBsZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGF2ZVZhbHVlcyA9PT0gbGVuKSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlcyk7XG4gICAgfVxuXG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG5jb25zdCB0b1N0cmluZzogRnVuY3Rpb24gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVTdHlsZUV2ZW50RW1pdHRlciB7XG4gIGFkZExpc3RlbmVyOiAoZXZlbnROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IHRoaXM7XG4gIHJlbW92ZUxpc3RlbmVyOiAoZXZlbnROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IHRoaXM7XG59XG5cbmV4cG9ydCB0eXBlIE5vZGVFdmVudEhhbmRsZXIgPSAoLi4uYXJnczogYW55W10pID0+IHZvaWQ7XG5cbi8vIEZvciBBUElzIHRoYXQgaW1wbGVtZW50IGBhZGRMaXN0ZW5lcmAgYW5kIGByZW1vdmVMaXN0ZW5lcmAgbWV0aG9kcyB0aGF0IG1heVxuLy8gbm90IHVzZSB0aGUgc2FtZSBhcmd1bWVudHMgb3IgcmV0dXJuIEV2ZW50RW1pdHRlciB2YWx1ZXNcbi8vIHN1Y2ggYXMgUmVhY3QgTmF0aXZlXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVDb21wYXRpYmxlRXZlbnRFbWl0dGVyIHtcbiAgYWRkTGlzdGVuZXI6IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlcikgPT4gdm9pZCB8IHt9O1xuICByZW1vdmVMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB2b2lkIHwge307XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIge1xuICBvbjogKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikgPT4gdm9pZDtcbiAgb2ZmOiAoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhhc0V2ZW50VGFyZ2V0QWRkUmVtb3ZlPEU+IHtcbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiAoKGV2dDogRSkgPT4gdm9pZCkgfCBudWxsLCBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyPzogKChldnQ6IEUpID0+IHZvaWQpIHwgbnVsbCwgb3B0aW9ucz86IEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgYm9vbGVhbik6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIEV2ZW50VGFyZ2V0TGlrZTxUPiA9IEhhc0V2ZW50VGFyZ2V0QWRkUmVtb3ZlPFQ+IHwgTm9kZVN0eWxlRXZlbnRFbWl0dGVyIHwgTm9kZUNvbXBhdGlibGVFdmVudEVtaXR0ZXIgfCBKUXVlcnlTdHlsZUV2ZW50RW1pdHRlcjtcblxuZXhwb3J0IHR5cGUgRnJvbUV2ZW50VGFyZ2V0PFQ+ID0gRXZlbnRUYXJnZXRMaWtlPFQ+IHwgQXJyYXlMaWtlPEV2ZW50VGFyZ2V0TGlrZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRMaXN0ZW5lck9wdGlvbnMge1xuICBjYXB0dXJlPzogYm9vbGVhbjtcbiAgcGFzc2l2ZT86IGJvb2xlYW47XG4gIG9uY2U/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIGV4dGVuZHMgRXZlbnRMaXN0ZW5lck9wdGlvbnMge1xuICBvbmNlPzogYm9vbGVhbjtcbiAgcGFzc2l2ZT86IGJvb2xlYW47XG59XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPih0YXJnZXQ6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nLCByZXN1bHRTZWxlY3RvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nLCBvcHRpb25zOiBFdmVudExpc3RlbmVyT3B0aW9ucyk6IE9ic2VydmFibGU8VD47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPih0YXJnZXQ6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEV2ZW50TGlzdGVuZXJPcHRpb25zLCByZXN1bHRTZWxlY3RvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgZXZlbnRzIG9mIGEgc3BlY2lmaWMgdHlwZSBjb21pbmcgZnJvbSB0aGVcbiAqIGdpdmVuIGV2ZW50IHRhcmdldC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q3JlYXRlcyBhbiBPYnNlcnZhYmxlIGZyb20gRE9NIGV2ZW50cywgb3IgTm9kZS5qc1xuICogRXZlbnRFbWl0dGVyIGV2ZW50cyBvciBvdGhlcnMuPC9zcGFuPlxuICpcbiAqICFbXShmcm9tRXZlbnQucG5nKVxuICpcbiAqIGBmcm9tRXZlbnRgIGFjY2VwdHMgYXMgYSBmaXJzdCBhcmd1bWVudCBldmVudCB0YXJnZXQsIHdoaWNoIGlzIGFuIG9iamVjdCB3aXRoIG1ldGhvZHNcbiAqIGZvciByZWdpc3RlcmluZyBldmVudCBoYW5kbGVyIGZ1bmN0aW9ucy4gQXMgYSBzZWNvbmQgYXJndW1lbnQgaXQgdGFrZXMgc3RyaW5nIHRoYXQgaW5kaWNhdGVzXG4gKiB0eXBlIG9mIGV2ZW50IHdlIHdhbnQgdG8gbGlzdGVuIGZvci4gYGZyb21FdmVudGAgc3VwcG9ydHMgc2VsZWN0ZWQgdHlwZXMgb2YgZXZlbnQgdGFyZ2V0cyxcbiAqIHdoaWNoIGFyZSBkZXNjcmliZWQgaW4gZGV0YWlsIGJlbG93LiBJZiB5b3VyIGV2ZW50IHRhcmdldCBkb2VzIG5vdCBtYXRjaCBhbnkgb2YgdGhlIG9uZXMgbGlzdGVkLFxuICogeW91IHNob3VsZCB1c2Uge0BsaW5rIGZyb21FdmVudFBhdHRlcm59LCB3aGljaCBjYW4gYmUgdXNlZCBvbiBhcmJpdHJhcnkgQVBJcy5cbiAqIFdoZW4gaXQgY29tZXMgdG8gQVBJcyBzdXBwb3J0ZWQgYnkgYGZyb21FdmVudGAsIHRoZWlyIG1ldGhvZHMgZm9yIGFkZGluZyBhbmQgcmVtb3ZpbmcgZXZlbnRcbiAqIGhhbmRsZXIgZnVuY3Rpb25zIGhhdmUgZGlmZmVyZW50IG5hbWVzLCBidXQgdGhleSBhbGwgYWNjZXB0IGEgc3RyaW5nIGRlc2NyaWJpbmcgZXZlbnQgdHlwZVxuICogYW5kIGZ1bmN0aW9uIGl0c2VsZiwgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgc2FpZCBldmVudCBoYXBwZW5zLlxuICpcbiAqIEV2ZXJ5IHRpbWUgcmVzdWx0aW5nIE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZCwgZXZlbnQgaGFuZGxlciBmdW5jdGlvbiB3aWxsIGJlIHJlZ2lzdGVyZWRcbiAqIHRvIGV2ZW50IHRhcmdldCBvbiBnaXZlbiBldmVudCB0eXBlLiBXaGVuIHRoYXQgZXZlbnQgZmlyZXMsIHZhbHVlXG4gKiBwYXNzZWQgYXMgYSBmaXJzdCBhcmd1bWVudCB0byByZWdpc3RlcmVkIGZ1bmN0aW9uIHdpbGwgYmUgZW1pdHRlZCBieSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIFdoZW4gT2JzZXJ2YWJsZSBpcyB1bnN1YnNjcmliZWQsIGZ1bmN0aW9uIHdpbGwgYmUgdW5yZWdpc3RlcmVkIGZyb20gZXZlbnQgdGFyZ2V0LlxuICpcbiAqIE5vdGUgdGhhdCBpZiBldmVudCB0YXJnZXQgY2FsbHMgcmVnaXN0ZXJlZCBmdW5jdGlvbiB3aXRoIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQsIHNlY29uZFxuICogYW5kIGZvbGxvd2luZyBhcmd1bWVudHMgd2lsbCBub3QgYXBwZWFyIGluIHJlc3VsdGluZyBzdHJlYW0uIEluIG9yZGVyIHRvIGdldCBhY2Nlc3MgdG8gdGhlbSxcbiAqIHlvdSBjYW4gcGFzcyB0byBgZnJvbUV2ZW50YCBvcHRpb25hbCBwcm9qZWN0IGZ1bmN0aW9uLCB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aXRoIGFsbCBhcmd1bWVudHNcbiAqIHBhc3NlZCB0byBldmVudCBoYW5kbGVyLiBPdXRwdXQgT2JzZXJ2YWJsZSB3aWxsIHRoZW4gZW1pdCB2YWx1ZSByZXR1cm5lZCBieSBwcm9qZWN0IGZ1bmN0aW9uLFxuICogaW5zdGVhZCBvZiB0aGUgdXN1YWwgdmFsdWUuXG4gKlxuICogUmVtZW1iZXIgdGhhdCBldmVudCB0YXJnZXRzIGxpc3RlZCBiZWxvdyBhcmUgY2hlY2tlZCB2aWEgZHVjayB0eXBpbmcuIEl0IG1lYW5zIHRoYXRcbiAqIG5vIG1hdHRlciB3aGF0IGtpbmQgb2Ygb2JqZWN0IHlvdSBoYXZlIGFuZCBubyBtYXR0ZXIgd2hhdCBlbnZpcm9ubWVudCB5b3Ugd29yayBpbixcbiAqIHlvdSBjYW4gc2FmZWx5IHVzZSBgZnJvbUV2ZW50YCBvbiB0aGF0IG9iamVjdCBpZiBpdCBleHBvc2VzIGRlc2NyaWJlZCBtZXRob2RzIChwcm92aWRlZFxuICogb2YgY291cnNlIHRoZXkgYmVoYXZlIGFzIHdhcyBkZXNjcmliZWQgYWJvdmUpLiBTbyBmb3IgZXhhbXBsZSBpZiBOb2RlLmpzIGxpYnJhcnkgZXhwb3Nlc1xuICogZXZlbnQgdGFyZ2V0IHdoaWNoIGhhcyB0aGUgc2FtZSBtZXRob2QgbmFtZXMgYXMgRE9NIEV2ZW50VGFyZ2V0LCBgZnJvbUV2ZW50YCBpcyBzdGlsbFxuICogYSBnb29kIGNob2ljZS5cbiAqXG4gKiBJZiB0aGUgQVBJIHlvdSB1c2UgaXMgbW9yZSBjYWxsYmFjayB0aGVuIGV2ZW50IGhhbmRsZXIgb3JpZW50ZWQgKHN1YnNjcmliZWRcbiAqIGNhbGxiYWNrIGZ1bmN0aW9uIGZpcmVzIG9ubHkgb25jZSBhbmQgdGh1cyB0aGVyZSBpcyBubyBuZWVkIHRvIG1hbnVhbGx5XG4gKiB1bnJlZ2lzdGVyIGl0KSwgeW91IHNob3VsZCB1c2Uge0BsaW5rIGJpbmRDYWxsYmFja30gb3Ige0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBpbnN0ZWFkLlxuICpcbiAqIGBmcm9tRXZlbnRgIHN1cHBvcnRzIGZvbGxvd2luZyB0eXBlcyBvZiBldmVudCB0YXJnZXRzOlxuICpcbiAqICoqRE9NIEV2ZW50VGFyZ2V0KipcbiAqXG4gKiBUaGlzIGlzIGFuIG9iamVjdCB3aXRoIGBhZGRFdmVudExpc3RlbmVyYCBhbmQgYHJlbW92ZUV2ZW50TGlzdGVuZXJgIG1ldGhvZHMuXG4gKlxuICogSW4gdGhlIGJyb3dzZXIsIGBhZGRFdmVudExpc3RlbmVyYCBhY2NlcHRzIC0gYXBhcnQgZnJvbSBldmVudCB0eXBlIHN0cmluZyBhbmQgZXZlbnRcbiAqIGhhbmRsZXIgZnVuY3Rpb24gYXJndW1lbnRzIC0gb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyLCB3aGljaCBpcyBlaXRoZXIgYW4gb2JqZWN0IG9yIGJvb2xlYW4sXG4gKiBib3RoIHVzZWQgZm9yIGFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBob3cgYW5kIHdoZW4gcGFzc2VkIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkLiBXaGVuXG4gKiBgZnJvbUV2ZW50YCBpcyB1c2VkIHdpdGggZXZlbnQgdGFyZ2V0IG9mIHRoYXQgdHlwZSwgeW91IGNhbiBwcm92aWRlIHRoaXMgdmFsdWVzXG4gKiBhcyB0aGlyZCBwYXJhbWV0ZXIgYXMgd2VsbC5cbiAqXG4gKiAqKk5vZGUuanMgRXZlbnRFbWl0dGVyKipcbiAqXG4gKiBBbiBvYmplY3Qgd2l0aCBgYWRkTGlzdGVuZXJgIGFuZCBgcmVtb3ZlTGlzdGVuZXJgIG1ldGhvZHMuXG4gKlxuICogKipKUXVlcnktc3R5bGUgZXZlbnQgdGFyZ2V0KipcbiAqXG4gKiBBbiBvYmplY3Qgd2l0aCBgb25gIGFuZCBgb2ZmYCBtZXRob2RzXG4gKlxuICogKipET00gTm9kZUxpc3QqKlxuICpcbiAqIExpc3Qgb2YgRE9NIE5vZGVzLCByZXR1cm5lZCBmb3IgZXhhbXBsZSBieSBgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbGAgb3IgYE5vZGUuY2hpbGROb2Rlc2AuXG4gKlxuICogQWx0aG91Z2ggdGhpcyBjb2xsZWN0aW9uIGlzIG5vdCBldmVudCB0YXJnZXQgaW4gaXRzZWxmLCBgZnJvbUV2ZW50YCB3aWxsIGl0ZXJhdGUgb3ZlciBhbGwgTm9kZXNcbiAqIGl0IGNvbnRhaW5zIGFuZCBpbnN0YWxsIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gaW4gZXZlcnkgb2YgdGhlbS4gV2hlbiByZXR1cm5lZCBPYnNlcnZhYmxlXG4gKiBpcyB1bnN1YnNjcmliZWQsIGZ1bmN0aW9uIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIGFsbCBOb2Rlcy5cbiAqXG4gKiAqKkRPTSBIdG1sQ29sbGVjdGlvbioqXG4gKlxuICogSnVzdCBhcyBpbiBjYXNlIG9mIE5vZGVMaXN0IGl0IGlzIGEgY29sbGVjdGlvbiBvZiBET00gbm9kZXMuIEhlcmUgYXMgd2VsbCBldmVudCBoYW5kbGVyIGZ1bmN0aW9uIGlzXG4gKiBpbnN0YWxsZWQgYW5kIHJlbW92ZWQgaW4gZWFjaCBvZiBlbGVtZW50cy5cbiAqXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0cyBjbGlja3MgaGFwcGVuaW5nIG9uIHRoZSBET00gZG9jdW1lbnRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjbGlja3Muc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW46XG4gKiAvLyBNb3VzZUV2ZW50IG9iamVjdCBsb2dnZWQgdG8gY29uc29sZSBldmVyeSB0aW1lIGEgY2xpY2tcbiAqIC8vIG9jY3VycyBvbiB0aGUgZG9jdW1lbnQuXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBjYXB0dXJlIG9wdGlvblxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzSW5Eb2N1bWVudCA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJywgdHJ1ZSk7IC8vIG5vdGUgb3B0aW9uYWwgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3aWxsIGJlIHBhc3NlZCB0byBhZGRFdmVudExpc3RlbmVyXG4gKiBjb25zdCBjbGlja3NJbkRpdiA9IGZyb21FdmVudChzb21lRGl2SW5Eb2N1bWVudCwgJ2NsaWNrJyk7XG4gKlxuICogY2xpY2tzSW5Eb2N1bWVudC5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ2RvY3VtZW50JykpO1xuICogY2xpY2tzSW5EaXYuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdkaXYnKSk7XG4gKlxuICogLy8gQnkgZGVmYXVsdCBldmVudHMgYnViYmxlIFVQIGluIERPTSB0cmVlLCBzbyBub3JtYWxseVxuICogLy8gd2hlbiB3ZSB3b3VsZCBjbGljayBvbiBkaXYgaW4gZG9jdW1lbnRcbiAqIC8vIFwiZGl2XCIgd291bGQgYmUgbG9nZ2VkIGZpcnN0IGFuZCB0aGVuIFwiZG9jdW1lbnRcIi5cbiAqIC8vIFNpbmNlIHdlIHNwZWNpZmllZCBvcHRpb25hbCBgY2FwdHVyZWAgb3B0aW9uLCBkb2N1bWVudFxuICogLy8gd2lsbCBjYXRjaCBldmVudCB3aGVuIGl0IGdvZXMgRE9XTiBET00gdHJlZSwgc28gY29uc29sZVxuICogLy8gd2lsbCBsb2cgXCJkb2N1bWVudFwiIGFuZCB0aGVuIFwiZGl2XCIuXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBiaW5kQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn1cbiAqXG4gKiBAcGFyYW0ge0Zyb21FdmVudFRhcmdldDxUPn0gdGFyZ2V0IFRoZSBET00gRXZlbnRUYXJnZXQsIE5vZGUuanNcbiAqIEV2ZW50RW1pdHRlciwgSlF1ZXJ5LWxpa2UgZXZlbnQgdGFyZ2V0LCBOb2RlTGlzdCBvciBIVE1MQ29sbGVjdGlvbiB0byBhdHRhY2ggdGhlIGV2ZW50IGhhbmRsZXIgdG8uXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBldmVudCBuYW1lIG9mIGludGVyZXN0LCBiZWluZyBlbWl0dGVkIGJ5IHRoZVxuICogYHRhcmdldGAuXG4gKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJPcHRpb25zfSBbb3B0aW9uc10gT3B0aW9ucyB0byBwYXNzIHRocm91Z2ggdG8gYWRkRXZlbnRMaXN0ZW5lclxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn1cbiAqIEBuYW1lIGZyb21FdmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KFxuICB0YXJnZXQ6IEZyb21FdmVudFRhcmdldDxUPixcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIG9wdGlvbnM/OiBFdmVudExpc3RlbmVyT3B0aW9ucyB8ICgoLi4uYXJnczogYW55W10pID0+IFQpLFxuICByZXN1bHRTZWxlY3Rvcj86ICgoLi4uYXJnczogYW55W10pID0+IFQpXG4pOiBPYnNlcnZhYmxlPFQ+IHtcblxuICBpZiAoaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJlc3VsdFNlbGVjdG9yID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJldHVybiBmcm9tRXZlbnQ8VD4odGFyZ2V0LCBldmVudE5hbWUsIDxFdmVudExpc3RlbmVyT3B0aW9ucyB8IHVuZGVmaW5lZD5vcHRpb25zKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBmdW5jdGlvbiBoYW5kbGVyKGU6IFQpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNldHVwU3Vic2NyaXB0aW9uKHRhcmdldCwgZXZlbnROYW1lLCBoYW5kbGVyLCBzdWJzY3JpYmVyLCBvcHRpb25zIGFzIEV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwU3Vic2NyaXB0aW9uPFQ+KHNvdXJjZU9iajogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM/OiBFdmVudExpc3RlbmVyT3B0aW9ucykge1xuICBsZXQgdW5zdWJzY3JpYmU6ICgpID0+IHZvaWQ7XG4gIGlmIChpc0V2ZW50VGFyZ2V0KHNvdXJjZU9iaikpIHtcbiAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VPYmo7XG4gICAgc291cmNlT2JqLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICB1bnN1YnNjcmliZSA9ICgpID0+IHNvdXJjZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoaXNKUXVlcnlTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmopKSB7XG4gICAgY29uc3Qgc291cmNlID0gc291cmNlT2JqO1xuICAgIHNvdXJjZU9iai5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgIHVuc3Vic2NyaWJlID0gKCkgPT4gc291cmNlLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKGlzTm9kZVN0eWxlRXZlbnRFbWl0dGVyKHNvdXJjZU9iaikpIHtcbiAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VPYmo7XG4gICAgc291cmNlT2JqLmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciBhcyBOb2RlRXZlbnRIYW5kbGVyKTtcbiAgICB1bnN1YnNjcmliZSA9ICgpID0+IHNvdXJjZS5yZW1vdmVMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIgYXMgTm9kZUV2ZW50SGFuZGxlcik7XG4gIH0gZWxzZSBpZiAoc291cmNlT2JqICYmIChzb3VyY2VPYmogYXMgYW55KS5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gKHNvdXJjZU9iaiBhcyBhbnkpLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBzZXR1cFN1YnNjcmlwdGlvbihzb3VyY2VPYmpbaV0sIGV2ZW50TmFtZSwgaGFuZGxlciwgc3Vic2NyaWJlciwgb3B0aW9ucyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgZXZlbnQgdGFyZ2V0Jyk7XG4gIH1cblxuICBzdWJzY3JpYmVyLmFkZCh1bnN1YnNjcmliZSk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZVN0eWxlRXZlbnRFbWl0dGVyKHNvdXJjZU9iajogYW55KTogc291cmNlT2JqIGlzIE5vZGVTdHlsZUV2ZW50RW1pdHRlciB7XG4gIHJldHVybiBzb3VyY2VPYmogJiYgdHlwZW9mIHNvdXJjZU9iai5hZGRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc291cmNlT2JqLnJlbW92ZUxpc3RlbmVyID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc0pRdWVyeVN0eWxlRXZlbnRFbWl0dGVyKHNvdXJjZU9iajogYW55KTogc291cmNlT2JqIGlzIEpRdWVyeVN0eWxlRXZlbnRFbWl0dGVyIHtcbiAgcmV0dXJuIHNvdXJjZU9iaiAmJiB0eXBlb2Ygc291cmNlT2JqLm9uID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBzb3VyY2VPYmoub2ZmID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc0V2ZW50VGFyZ2V0KHNvdXJjZU9iajogYW55KTogc291cmNlT2JqIGlzIEhhc0V2ZW50VGFyZ2V0QWRkUmVtb3ZlPGFueT4ge1xuICByZXR1cm4gc291cmNlT2JqICYmIHR5cGVvZiBzb3VyY2VPYmouYWRkRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc291cmNlT2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAnLi9mcm9tRXZlbnQnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiBhbnksIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCk6IE9ic2VydmFibGU8VD47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiBhbnksIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCwgcmVzdWx0U2VsZWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgZnJvbSBhbiBhcmJpdHJhcnkgQVBJIGZvciByZWdpc3RlcmluZyBldmVudCBoYW5kbGVycy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2hlbiB0aGF0IG1ldGhvZCBmb3IgYWRkaW5nIGV2ZW50IGhhbmRsZXIgd2FzIHNvbWV0aGluZyB7QGxpbmsgZnJvbUV2ZW50fVxuICogd2FzIG5vdCBwcmVwYXJlZCBmb3IuPC9zcGFuPlxuICpcbiAqICFbXShmcm9tRXZlbnRQYXR0ZXJuLnBuZylcbiAqXG4gKiBgZnJvbUV2ZW50UGF0dGVybmAgYWxsb3dzIHlvdSB0byBjb252ZXJ0IGludG8gYW4gT2JzZXJ2YWJsZSBhbnkgQVBJIHRoYXQgc3VwcG9ydHMgcmVnaXN0ZXJpbmcgaGFuZGxlciBmdW5jdGlvbnNcbiAqIGZvciBldmVudHMuIEl0IGlzIHNpbWlsYXIgdG8ge0BsaW5rIGZyb21FdmVudH0sIGJ1dCBmYXJcbiAqIG1vcmUgZmxleGlibGUuIEluIGZhY3QsIGFsbCB1c2UgY2FzZXMgb2Yge0BsaW5rIGZyb21FdmVudH0gY291bGQgYmUgZWFzaWx5IGhhbmRsZWQgYnlcbiAqIGBmcm9tRXZlbnRQYXR0ZXJuYCAoYWx0aG91Z2ggaW4gc2xpZ2h0bHkgbW9yZSB2ZXJib3NlIHdheSkuXG4gKlxuICogVGhpcyBvcGVyYXRvciBhY2NlcHRzIGFzIGEgZmlyc3QgYXJndW1lbnQgYW4gYGFkZEhhbmRsZXJgIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGJlIGluamVjdGVkIHdpdGhcbiAqIGhhbmRsZXIgcGFyYW1ldGVyLiBUaGF0IGhhbmRsZXIgaXMgYWN0dWFsbHkgYW4gZXZlbnQgaGFuZGxlciBmdW5jdGlvbiB0aGF0IHlvdSBub3cgY2FuIHBhc3NcbiAqIHRvIEFQSSBleHBlY3RpbmcgaXQuIGBhZGRIYW5kbGVyYCB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBPYnNlcnZhYmxlXG4gKiByZXR1cm5lZCBieSB0aGUgb3BlcmF0b3IgaXMgc3Vic2NyaWJlZCwgc28gcmVnaXN0ZXJpbmcgaGFuZGxlciBpbiBBUEkgd2lsbCBub3RcbiAqIG5lY2Vzc2FyaWx5IGhhcHBlbiB3aGVuIGBmcm9tRXZlbnRQYXR0ZXJuYCBpcyBjYWxsZWQuXG4gKlxuICogQWZ0ZXIgcmVnaXN0cmF0aW9uLCBldmVyeSB0aW1lIGFuIGV2ZW50IHRoYXQgd2UgbGlzdGVuIHRvIGhhcHBlbnMsXG4gKiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGBmcm9tRXZlbnRQYXR0ZXJuYCB3aWxsIGVtaXQgdmFsdWUgdGhhdCBldmVudCBoYW5kbGVyXG4gKiBmdW5jdGlvbiB3YXMgY2FsbGVkIHdpdGguIE5vdGUgdGhhdCBpZiBldmVudCBoYW5kbGVyIHdhcyBjYWxsZWQgd2l0aCBtb3JlXG4gKiB0aGVuIG9uZSBhcmd1bWVudCwgc2Vjb25kIGFuZCBmb2xsb3dpbmcgYXJndW1lbnRzIHdpbGwgbm90IGFwcGVhciBpbiB0aGUgT2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiBBUEkgeW91IGFyZSB1c2luZyBhbGxvd3MgdG8gdW5yZWdpc3RlciBldmVudCBoYW5kbGVycyBhcyB3ZWxsLCB5b3UgY2FuIHBhc3MgdG8gYGZyb21FdmVudFBhdHRlcm5gXG4gKiBhbm90aGVyIGZ1bmN0aW9uIC0gYHJlbW92ZUhhbmRsZXJgIC0gYXMgYSBzZWNvbmQgcGFyYW1ldGVyLiBJdCB3aWxsIGJlIGluamVjdGVkXG4gKiB3aXRoIHRoZSBzYW1lIGhhbmRsZXIgZnVuY3Rpb24gYXMgYmVmb3JlLCB3aGljaCBub3cgeW91IGNhbiB1c2UgdG8gdW5yZWdpc3RlclxuICogaXQgZnJvbSB0aGUgQVBJLiBgcmVtb3ZlSGFuZGxlcmAgd2lsbCBiZSBjYWxsZWQgd2hlbiBjb25zdW1lciBvZiByZXN1bHRpbmcgT2JzZXJ2YWJsZVxuICogdW5zdWJzY3JpYmVzIGZyb20gaXQuXG4gKlxuICogSW4gc29tZSBBUElzIHVucmVnaXN0ZXJpbmcgaXMgYWN0dWFsbHkgaGFuZGxlZCBkaWZmZXJlbnRseS4gTWV0aG9kIHJlZ2lzdGVyaW5nIGFuIGV2ZW50IGhhbmRsZXJcbiAqIHJldHVybnMgc29tZSBraW5kIG9mIHRva2VuLCB3aGljaCBpcyBsYXRlciB1c2VkIHRvIGlkZW50aWZ5IHdoaWNoIGZ1bmN0aW9uIHNob3VsZFxuICogYmUgdW5yZWdpc3RlcmVkIG9yIGl0IGl0c2VsZiBoYXMgbWV0aG9kIHRoYXQgdW5yZWdpc3RlcnMgZXZlbnQgaGFuZGxlci5cbiAqIElmIHRoYXQgaXMgdGhlIGNhc2Ugd2l0aCB5b3VyIEFQSSwgbWFrZSBzdXJlIHRva2VuIHJldHVybmVkXG4gKiBieSByZWdpc3RlcmluZyBtZXRob2QgaXMgcmV0dXJuZWQgYnkgYGFkZEhhbmRsZXJgLiBUaGVuIGl0IHdpbGwgYmUgcGFzc2VkXG4gKiBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgcmVtb3ZlSGFuZGxlcmAsIHdoZXJlIHlvdSB3aWxsIGJlIGFibGUgdG8gdXNlIGl0LlxuICpcbiAqIElmIHlvdSBuZWVkIGFjY2VzcyB0byBhbGwgZXZlbnQgaGFuZGxlciBwYXJhbWV0ZXJzIChub3Qgb25seSB0aGUgZmlyc3Qgb25lKSxcbiAqIG9yIHlvdSBuZWVkIHRvIHRyYW5zZm9ybSB0aGVtIGluIGFueSB3YXksIHlvdSBjYW4gY2FsbCBgZnJvbUV2ZW50UGF0dGVybmAgd2l0aCBvcHRpb25hbFxuICogdGhpcmQgcGFyYW1ldGVyIC0gcHJvamVjdCBmdW5jdGlvbiB3aGljaCB3aWxsIGFjY2VwdCBhbGwgYXJndW1lbnRzIHBhc3NlZCB0b1xuICogZXZlbnQgaGFuZGxlciB3aGVuIGl0IGlzIGNhbGxlZC4gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgZnJvbSBwcm9qZWN0IGZ1bmN0aW9uIHdpbGwgYXBwZWFyIG9uXG4gKiByZXN1bHRpbmcgc3RyZWFtIGluc3RlYWQgb2YgdXN1YWwgZXZlbnQgaGFuZGxlcnMgZmlyc3QgYXJndW1lbnQuIFRoaXMgbWVhbnNcbiAqIHRoYXQgZGVmYXVsdCBwcm9qZWN0IGNhbiBiZSB0aG91Z2h0IG9mIGFzIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaXRzIGZpcnN0IHBhcmFtZXRlclxuICogYW5kIGlnbm9yZXMgdGhlIHJlc3QuXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIEVtaXRzIGNsaWNrcyBoYXBwZW5pbmcgb24gdGhlIERPTSBkb2N1bWVudFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uIGFkZENsaWNrSGFuZGxlcihoYW5kbGVyKSB7XG4gKiAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gcmVtb3ZlQ2xpY2tIYW5kbGVyKGhhbmRsZXIpIHtcbiAqICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAqIH1cbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBhZGRDbGlja0hhbmRsZXIsXG4gKiAgIHJlbW92ZUNsaWNrSGFuZGxlclxuICogKTtcbiAqIGNsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gV2hlbmV2ZXIgeW91IGNsaWNrIGFueXdoZXJlIGluIHRoZSBicm93c2VyLCBET00gTW91c2VFdmVudFxuICogLy8gb2JqZWN0IHdpbGwgYmUgbG9nZ2VkLlxuICogYGBgXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFVzZSB3aXRoIEFQSSB0aGF0IHJldHVybnMgY2FuY2VsbGF0aW9uIHRva2VuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdG9rZW4gPSBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGZ1bmN0aW9uKCkge30pO1xuICogc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKHRva2VuKTsgLy8gdGhpcyBBUElzIGNhbmNlbGxhdGlvbiBtZXRob2QgYWNjZXB0c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IGhhbmRsZXIgaXRzZWxmLCBidXQgc3BlY2lhbCB0b2tlbi5cbiAqXG4gKiBjb25zdCBzb21lQVBJT2JzZXJ2YWJsZSA9IGZyb21FdmVudFBhdHRlcm4oXG4gKiAgIGZ1bmN0aW9uKGhhbmRsZXIpIHsgcmV0dXJuIHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlcik7IH0sIC8vIE5vdGUgdGhhdCB3ZSByZXR1cm4gdGhlIHRva2VuIGhlcmUuLi5cbiAqICAgZnVuY3Rpb24oaGFuZGxlciwgdG9rZW4pIHsgc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKHRva2VuKTsgfSAgLy8gLi4udG8gdGhlbiB1c2UgaXQgaGVyZS5cbiAqICk7XG4gKiBgYGBcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgVXNlIHdpdGggcHJvamVjdCBmdW5jdGlvblxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoKGV2ZW50VHlwZSwgZXZlbnRNZXNzYWdlKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGV2ZW50VHlwZSwgZXZlbnRNZXNzYWdlKTsgLy8gTG9ncyBcIkVWRU5UX1RZUEVcIiBcIkVWRU5UX01FU1NBR0VcIiB0byBjb25zb2xlLlxuICogfSk7XG4gKlxuICogY29uc3Qgc29tZUFQSU9ic2VydmFibGUgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBoYW5kbGVyID0+IHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlciksXG4gKiAgIGhhbmRsZXIgPT4gc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGhhbmRsZXIpXG4gKiAgIChldmVudFR5cGUsIGV2ZW50TWVzc2FnZSkgPT4gZXZlbnRUeXBlICsgXCIgLS0tIFwiICsgZXZlbnRNZXNzYWdlIC8vIHdpdGhvdXQgdGhhdCBmdW5jdGlvbiBvbmx5IFwiRVZFTlRfVFlQRVwiXG4gKiApOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3b3VsZCBiZSBlbWl0dGVkIGJ5IHRoZSBPYnNlcnZhYmxlXG4gKlxuICogc29tZUFQSU9ic2VydmFibGUuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiRVZFTlRfVFlQRSAtLS0gRVZFTlRfTUVTU0FHRVwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnR9XG4gKiBAc2VlIHtAbGluayBiaW5kQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oaGFuZGxlcjogRnVuY3Rpb24pOiBhbnl9IGFkZEhhbmRsZXIgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiBhIGBoYW5kbGVyYCBmdW5jdGlvbiBhcyBhcmd1bWVudCBhbmQgYXR0YWNoZXMgaXQgc29tZWhvdyB0byB0aGUgYWN0dWFsXG4gKiBzb3VyY2Ugb2YgZXZlbnRzLlxuICogQHBhcmFtIHtmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbiwgdG9rZW4/OiBhbnkpOiB2b2lkfSBbcmVtb3ZlSGFuZGxlcl0gQSBmdW5jdGlvbiB0aGF0XG4gKiB0YWtlcyBhIGBoYW5kbGVyYCBmdW5jdGlvbiBhcyBhbiBhcmd1bWVudCBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBldmVudCBzb3VyY2UuIElmIGBhZGRIYW5kbGVyYFxuICogcmV0dXJucyBzb21lIGtpbmQgb2YgdG9rZW4sIGByZW1vdmVIYW5kbGVyYCBmdW5jdGlvbiB3aWxsIGhhdmUgaXQgYXMgYSBzZWNvbmQgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtmdW5jdGlvbiguLi5hcmdzOiBhbnkpOiBUfSBbcHJvamVjdF0gQSBmdW5jdGlvbiB0b1xuICogdHJhbnNmb3JtIHJlc3VsdHMuIEl0IHRha2VzIHRoZSBhcmd1bWVudHMgZnJvbSB0aGUgZXZlbnQgaGFuZGxlciBhbmRcbiAqIHNob3VsZCByZXR1cm4gYSBzaW5nbGUgdmFsdWUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBPYnNlcnZhYmxlIHdoaWNoLCB3aGVuIGFuIGV2ZW50IGhhcHBlbnMsIGVtaXRzIGZpcnN0IHBhcmFtZXRlclxuICogcGFzc2VkIHRvIHJlZ2lzdGVyZWQgZXZlbnQgaGFuZGxlci4gQWx0ZXJuYXRpdmVseSBpdCBlbWl0cyB3aGF0ZXZlciBwcm9qZWN0IGZ1bmN0aW9uIHJldHVybnNcbiAqIGF0IHRoYXQgbW9tZW50LlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBmcm9tRXZlbnRQYXR0ZXJuXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlSGFuZGxlcj86IChoYW5kbGVyOiBGdW5jdGlvbiwgc2lnbmFsPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQgfCBUW10+IHtcblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyLCByZW1vdmVIYW5kbGVyKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUIHwgVFtdPihzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmU6IFRbXSkgPT4gc3Vic2NyaWJlci5uZXh0KGUubGVuZ3RoID09PSAxID8gZVswXSA6IGUpO1xuXG4gICAgbGV0IHJldFZhbHVlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJldFZhbHVlID0gYWRkSGFuZGxlcihoYW5kbGVyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHJlbW92ZUhhbmRsZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiByZW1vdmVIYW5kbGVyKGhhbmRsZXIsIHJldFZhbHVlKSA7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5cbmV4cG9ydCB0eXBlIENvbmRpdGlvbkZ1bmM8Uz4gPSAoc3RhdGU6IFMpID0+IGJvb2xlYW47XG5leHBvcnQgdHlwZSBJdGVyYXRlRnVuYzxTPiA9IChzdGF0ZTogUykgPT4gUztcbmV4cG9ydCB0eXBlIFJlc3VsdEZ1bmM8UywgVD4gPSAoc3RhdGU6IFMpID0+IFQ7XG5cbmludGVyZmFjZSBTY2hlZHVsZXJTdGF0ZTxULCBTPiB7XG4gIG5lZWRJdGVyYXRlPzogYm9vbGVhbjtcbiAgc3RhdGU6IFM7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbkZ1bmM8Uz47XG4gIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+O1xuICByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZUJhc2VPcHRpb25zPFM+IHtcbiAgLyoqXG4gICAqIEluaXRpYWwgc3RhdGUuXG4gICAqL1xuICBpbml0aWFsU3RhdGU6IFM7XG4gIC8qKlxuICAgKiBDb25kaXRpb24gZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHN0YXRlIGFuZCByZXR1cm5zIGJvb2xlYW4uXG4gICAqIFdoZW4gaXQgcmV0dXJucyBmYWxzZSwgdGhlIGdlbmVyYXRvciBzdG9wcy5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgYSBnZW5lcmF0b3IgbmV2ZXIgc3RvcHMuXG4gICAqL1xuICBjb25kaXRpb24/OiBDb25kaXRpb25GdW5jPFM+O1xuICAvKipcbiAgICogSXRlcmF0ZSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgc3RhdGUgYW5kIHJldHVybnMgbmV3IHN0YXRlLlxuICAgKi9cbiAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz47XG4gIC8qKlxuICAgKiBTY2hlZHVsZXJMaWtlIHRvIHVzZSBmb3IgZ2VuZXJhdGlvbiBwcm9jZXNzLlxuICAgKiBCeSBkZWZhdWx0LCBhIGdlbmVyYXRvciBzdGFydHMgaW1tZWRpYXRlbHkuXG4gICAqL1xuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlT3B0aW9uczxULCBTPiBleHRlbmRzIEdlbmVyYXRlQmFzZU9wdGlvbnM8Uz4ge1xuICAvKipcbiAgICogUmVzdWx0IHNlbGVjdGlvbiBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgc3RhdGUgYW5kIHJldHVybnMgYSB2YWx1ZSB0byBlbWl0LlxuICAgKi9cbiAgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD47XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wXG4gKiBwcm9kdWNpbmcgdGhlIHNlcXVlbmNlJ3MgZWxlbWVudHMsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyXG4gKiB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAqXG4gKiAhW10oZ2VuZXJhdGUucG5nKVxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlByb2R1Y2VzIHNlcXVlbmNlIG9mIDAsIDEsIDIsIC4uLiA5LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSgwLCB4ID0+IHggPCAxMCwgeCA9PiB4ICsgMSwgeCA9PiB4KTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2luZyBhc2FwIHNjaGVkdWxlciwgcHJvZHVjZXMgc2VxdWVuY2Ugb2YgMiwgMywgNSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoMSwgeCA9PiB4IDwgNSwgeCA9PiAgKiAyLCB4ID0+IHggKyAxLCBhc2FwKTtcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge1N9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHRvIHRlcm1pbmF0ZSBnZW5lcmF0aW9uICh1cG9uIHJldHVybmluZyBmYWxzZSkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IFN9IGl0ZXJhdGUgSXRlcmF0aW9uIHN0ZXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IFR9IHJlc3VsdFNlbGVjdG9yIFNlbGVjdG9yIGZ1bmN0aW9uIGZvciByZXN1bHRzIHByb2R1Y2VkIGluIHRoZSBzZXF1ZW5jZS4gKGRlcHJlY2F0ZWQpXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IG9uIHdoaWNoIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3AuIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gZW1pdCBpbW1lZGlhdGVseS5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG4gIGV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxULCBTPihpbml0aWFsU3RhdGU6IFMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IENvbmRpdGlvbkZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIE9ic2VydmFibGUgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wXG4gKiB0aGF0IGVtaXRzIGFuIGVsZW1lbnQgb24gZWFjaCBpdGVyYXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCBpbnN0ZWFkIG9mIG5leHRpbmcgdmFsdWVzIGluIGEgZm9yIGxvb3AuPC9zcGFuPlxuICpcbiAqIDxpbWcgc3JjPVwiLi9pbWcvZ2VuZXJhdGUucG5nXCIgd2lkdGg9XCIxMDAlXCI+XG4gKlxuICogYGdlbmVyYXRlYCBhbGxvd3MgeW91IHRvIGNyZWF0ZSBzdHJlYW0gb2YgdmFsdWVzIGdlbmVyYXRlZCB3aXRoIGEgbG9vcCB2ZXJ5IHNpbWlsYXIgdG9cbiAqIHRyYWRpdGlvbmFsIGZvciBsb29wLiBGaXJzdCBhcmd1bWVudCBvZiBgZ2VuZXJhdGVgIGlzIGEgYmVnaW5uaW5nIHZhbHVlLiBTZWNvbmQgYXJndW1lbnRcbiAqIGlzIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHRoaXMgdmFsdWUgYW5kIHRlc3RzIGlmIHNvbWUgY29uZGl0aW9uIHN0aWxsIGhvbGRzLiBJZiBpdCBkb2VzLFxuICogbG9vcCBjb250aW51ZXMsIGlmIG5vdCwgaXQgc3RvcHMuIFRoaXJkIHZhbHVlIGlzIGEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgcHJldmlvdXNseSBkZWZpbmVkXG4gKiB2YWx1ZSBhbmQgbW9kaWZpZXMgaXQgaW4gc29tZSB3YXkgb24gZWFjaCBpdGVyYXRpb24uIE5vdGUgaG93IHRoZXNlIHRocmVlIHBhcmFtZXRlcnNcbiAqIGFyZSBkaXJlY3QgZXF1aXZhbGVudHMgb2YgdGhyZWUgZXhwcmVzc2lvbnMgaW4gcmVndWxhciBmb3IgbG9vcDogZmlyc3QgZXhwcmVzc2lvblxuICogaW5pdGlhbGl6ZXMgc29tZSBzdGF0ZSAoZm9yIGV4YW1wbGUgbnVtZXJpYyBpbmRleCksIHNlY29uZCB0ZXN0cyBpZiBsb29wIGNhbiBtYWtlIG5leHRcbiAqIGl0ZXJhdGlvbiAoZm9yIGV4YW1wbGUgaWYgaW5kZXggaXMgbG93ZXIgdGhhbiAxMCkgYW5kIHRoaXJkIHN0YXRlcyBob3cgZGVmaW5lZCB2YWx1ZVxuICogd2lsbCBiZSBtb2RpZmllZCBvbiBldmVyeSBzdGVwIChpbmRleCB3aWxsIGJlIGluY3JlbWVudGVkIGJ5IG9uZSkuXG4gKlxuICogUmV0dXJuIHZhbHVlIG9mIGEgYGdlbmVyYXRlYCBvcGVyYXRvciBpcyBhbiBPYnNlcnZhYmxlIHRoYXQgb24gZWFjaCBsb29wIGl0ZXJhdGlvblxuICogZW1pdHMgYSB2YWx1ZS4gRmlyc3QsIGNvbmRpdGlvbiBmdW5jdGlvbiBpcyByYW4uIElmIGl0IHJldHVybmVkIHRydWUsIE9ic2VydmFibGVcbiAqIGVtaXRzIGN1cnJlbnRseSBzdG9yZWQgdmFsdWUgKGluaXRpYWwgdmFsdWUgYXQgdGhlIGZpcnN0IGl0ZXJhdGlvbikgYW5kIHRoZW4gdXBkYXRlc1xuICogdGhhdCB2YWx1ZSB3aXRoIGl0ZXJhdGUgZnVuY3Rpb24uIElmIGF0IHNvbWUgcG9pbnQgY29uZGl0aW9uIHJldHVybmVkIGZhbHNlLCBPYnNlcnZhYmxlXG4gKiBjb21wbGV0ZXMgYXQgdGhhdCBtb21lbnQuXG4gKlxuICogT3B0aW9uYWxseSB5b3UgY2FuIHBhc3MgZm91cnRoIHBhcmFtZXRlciB0byBgZ2VuZXJhdGVgIC0gYSByZXN1bHQgc2VsZWN0b3IgZnVuY3Rpb24gd2hpY2ggYWxsb3dzIHlvdVxuICogdG8gaW1tZWRpYXRlbHkgbWFwIHZhbHVlIHRoYXQgd291bGQgbm9ybWFsbHkgYmUgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlLlxuICpcbiAqIElmIHlvdSBmaW5kIHRocmVlIGFub255bW91cyBmdW5jdGlvbnMgaW4gYGdlbmVyYXRlYCBjYWxsIGhhcmQgdG8gcmVhZCwgeW91IGNhbiBwcm92aWRlXG4gKiBzaW5nbGUgb2JqZWN0IHRvIHRoZSBvcGVyYXRvciBpbnN0ZWFkLiBUaGF0IG9iamVjdCBoYXMgcHJvcGVydGllczogYGluaXRpYWxTdGF0ZWAsXG4gKiBgY29uZGl0aW9uYCwgYGl0ZXJhdGVgIGFuZCBgcmVzdWx0U2VsZWN0b3JgLCB3aGljaCBzaG91bGQgaGF2ZSByZXNwZWN0aXZlIHZhbHVlcyB0aGF0IHlvdVxuICogd291bGQgbm9ybWFsbHkgcGFzcyB0byBgZ2VuZXJhdGVgLiBgcmVzdWx0U2VsZWN0b3JgIGlzIHN0aWxsIG9wdGlvbmFsLCBidXQgdGhhdCBmb3JtXG4gKiBvZiBjYWxsaW5nIGBnZW5lcmF0ZWAgYWxsb3dzIHlvdSB0byBvbWl0IGBjb25kaXRpb25gIGFzIHdlbGwuIElmIHlvdSBvbWl0IGl0LCB0aGF0IG1lYW5zXG4gKiBjb25kaXRpb24gYWx3YXlzIGhvbGRzLCBzbyBvdXRwdXQgT2JzZXJ2YWJsZSB3aWxsIG5ldmVyIGNvbXBsZXRlLlxuICpcbiAqIEJvdGggZm9ybXMgb2YgYGdlbmVyYXRlYCBjYW4gb3B0aW9uYWxseSBhY2NlcHQgYSBzY2hlZHVsZXIuIEluIGNhc2Ugb2YgbXVsdGktcGFyYW1ldGVyIGNhbGwsXG4gKiBzY2hlZHVsZXIgc2ltcGx5IGNvbWVzIGFzIGEgbGFzdCBhcmd1bWVudCAobm8gbWF0dGVyIGlmIHRoZXJlIGlzIHJlc3VsdFNlbGVjdG9yXG4gKiBmdW5jdGlvbiBvciBub3QpLiBJbiBjYXNlIG9mIHNpbmdsZS1wYXJhbWV0ZXIgY2FsbCwgeW91IGNhbiBwcm92aWRlIGl0IGFzIGFcbiAqIGBzY2hlZHVsZXJgIHByb3BlcnR5IG9uIG9iamVjdCBwYXNzZWQgdG8gdGhlIG9wZXJhdG9yLiBJbiBib3RoIGNhc2VzIHNjaGVkdWxlciBkZWNpZGVzIHdoZW5cbiAqIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wIHdpbGwgaGFwcGVuIGFuZCB0aGVyZWZvcmUgd2hlbiBuZXh0IHZhbHVlIHdpbGwgYmUgZW1pdHRlZFxuICogYnkgdGhlIE9ic2VydmFibGUuIEZvciBleGFtcGxlIHRvIGVuc3VyZSB0aGF0IGVhY2ggdmFsdWUgaXMgcHVzaGVkIHRvIHRoZSBvYnNlcnZlclxuICogb24gc2VwYXJhdGUgdGFzayBpbiBldmVudCBsb29wLCB5b3UgY291bGQgdXNlIGBhc3luY2Agc2NoZWR1bGVyLiBOb3RlIHRoYXRcbiAqIGJ5IGRlZmF1bHQgKHdoZW4gbm8gc2NoZWR1bGVyIGlzIHBhc3NlZCkgdmFsdWVzIGFyZSBzaW1wbHkgZW1pdHRlZCBzeW5jaHJvbm91c2x5LlxuICpcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2Ugd2l0aCBjb25kaXRpb24gYW5kIGl0ZXJhdGUgZnVuY3Rpb25zLjwvY2FwdGlvbj5cbiAqIGNvbnN0IGdlbmVyYXRlZCA9IGdlbmVyYXRlKDAsIHggPT4geCA8IDMsIHggPT4geCArIDEpO1xuICpcbiAqIGdlbmVyYXRlZC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnWW8hJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDBcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIFwiWW8hXCJcbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIHdpdGggY29uZGl0aW9uLCBpdGVyYXRlIGFuZCByZXN1bHRTZWxlY3RvciBmdW5jdGlvbnMuPC9jYXB0aW9uPlxuICogY29uc3QgZ2VuZXJhdGVkID0gZ2VuZXJhdGUoMCwgeCA9PiB4IDwgMywgeCA9PiB4ICsgMSwgeCA9PiB4ICogMTAwMCk7XG4gKlxuICogZ2VuZXJhdGVkLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdZbyEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMFxuICogLy8gMTAwMFxuICogLy8gMjAwMFxuICogLy8gXCJZbyFcIlxuICpcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2Ugd2l0aCBvcHRpb25zIG9iamVjdC48L2NhcHRpb24+XG4gKiBjb25zdCBnZW5lcmF0ZWQgPSBnZW5lcmF0ZSh7XG4gKiAgIGluaXRpYWxTdGF0ZTogMCxcbiAqICAgY29uZGl0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IDM7IH0sXG4gKiAgIGl0ZXJhdGUodmFsdWUpIHsgcmV0dXJuIHZhbHVlICsgMTsgfSxcbiAqICAgcmVzdWx0U2VsZWN0b3IodmFsdWUpIHsgcmV0dXJuIHZhbHVlICogMTAwMDsgfVxuICogfSk7XG4gKlxuICogZ2VuZXJhdGVkLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdZbyEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMFxuICogLy8gMTAwMFxuICogLy8gMjAwMFxuICogLy8gXCJZbyFcIlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSBvcHRpb25zIG9iamVjdCB3aXRob3V0IGNvbmRpdGlvbiBmdW5jdGlvbi48L2NhcHRpb24+XG4gKiBjb25zdCBnZW5lcmF0ZWQgPSBnZW5lcmF0ZSh7XG4gKiAgIGluaXRpYWxTdGF0ZTogMCxcbiAqICAgaXRlcmF0ZSh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKyAxOyB9LFxuICogICByZXN1bHRTZWxlY3Rvcih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKiAxMDAwOyB9XG4gKiB9KTtcbiAqXG4gKiBnZW5lcmF0ZWQuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1lvIScpIC8vIFRoaXMgd2lsbCBuZXZlciBydW4uXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwXG4gKiAvLyAxMDAwXG4gKiAvLyAyMDAwXG4gKiAvLyAzMDAwXG4gKiAvLyAuLi5hbmQgbmV2ZXIgc3RvcHMuXG4gKlxuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBjcmVhdGV9XG4gKlxuICogQHBhcmFtIHtTfSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogYm9vbGVhbn0gY29uZGl0aW9uIENvbmRpdGlvbiB0byB0ZXJtaW5hdGUgZ2VuZXJhdGlvbiAodXBvbiByZXR1cm5pbmcgZmFsc2UpLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBTfSBpdGVyYXRlIEl0ZXJhdGlvbiBzdGVwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBUfSBbcmVzdWx0U2VsZWN0b3JdIFNlbGVjdG9yIGZ1bmN0aW9uIGZvciByZXN1bHRzIHByb2R1Y2VkIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJ9IG9uIHdoaWNoIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3AuIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gZW1pdHRpbmcgaW1tZWRpYXRlbHkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8Uz4oaW5pdGlhbFN0YXRlOiBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogQ29uZGl0aW9uRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxTPjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICogVGhlIG92ZXJsb2FkIGFjY2VwdHMgb3B0aW9ucyBvYmplY3QgdGhhdCBtaWdodCBjb250YWluIGluaXRpYWwgc3RhdGUsIGl0ZXJhdGUsXG4gKiBjb25kaXRpb24gYW5kIHNjaGVkdWxlci5cbiAqXG4gKiAhW10oZ2VuZXJhdGUucG5nKVxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlByb2R1Y2VzIHNlcXVlbmNlIG9mIDAsIDEsIDIsIC4uLiA5LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSh7XG4gKiAgIGluaXRpYWxTdGF0ZTogMCxcbiAqICAgY29uZGl0aW9uOiB4ID0+IHggPCAxMCxcbiAqICAgaXRlcmF0ZTogeCA9PiB4ICsgMSxcbiAqIH0pO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7R2VuZXJhdGVCYXNlT3B0aW9uczxTPn0gb3B0aW9ucyBPYmplY3QgdGhhdCBtdXN0IGNvbnRhaW4gaW5pdGlhbFN0YXRlLCBpdGVyYXRlIGFuZCBtaWdodCBjb250YWluIGNvbmRpdGlvbiBhbmQgc2NoZWR1bGVyLlxuICogQHJldHVybnMge09ic2VydmFibGU8Uz59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxTPihvcHRpb25zOiBHZW5lcmF0ZUJhc2VPcHRpb25zPFM+KTogT2JzZXJ2YWJsZTxTPjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICogVGhlIG92ZXJsb2FkIGFjY2VwdHMgb3B0aW9ucyBvYmplY3QgdGhhdCBtaWdodCBjb250YWluIGluaXRpYWwgc3RhdGUsIGl0ZXJhdGUsXG4gKiBjb25kaXRpb24sIHJlc3VsdCBzZWxlY3RvciBhbmQgc2NoZWR1bGVyLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBjb25kaXRpb246IHggPT4geCA8IDEwLFxuICogICBpdGVyYXRlOiB4ID0+IHggKyAxLFxuICogICByZXN1bHRTZWxlY3RvcjogeCA9PiB4LFxuICogfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtHZW5lcmF0ZU9wdGlvbnM8VCwgUz59IG9wdGlvbnMgT2JqZWN0IHRoYXQgbXVzdCBjb250YWluIGluaXRpYWxTdGF0ZSwgaXRlcmF0ZSwgcmVzdWx0U2VsZWN0b3IgYW5kIG1pZ2h0IGNvbnRhaW4gY29uZGl0aW9uIGFuZCBzY2hlZHVsZXIuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFQsIFM+KG9wdGlvbnM6IEdlbmVyYXRlT3B0aW9uczxULCBTPik6IE9ic2VydmFibGU8VD47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxULCBTPihpbml0aWFsU3RhdGVPck9wdGlvbnM6IFMgfCBHZW5lcmF0ZU9wdGlvbnM8VCwgUz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlPzogSXRlcmF0ZUZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGU/OiAoUmVzdWx0RnVuYzxTLCBUPikgfCBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+IHtcblxuICBsZXQgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD47XG4gIGxldCBpbml0aWFsU3RhdGU6IFM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgR2VuZXJhdGVPcHRpb25zPFQsIFM+O1xuICAgIGluaXRpYWxTdGF0ZSA9IG9wdGlvbnMuaW5pdGlhbFN0YXRlO1xuICAgIGNvbmRpdGlvbiA9IG9wdGlvbnMuY29uZGl0aW9uO1xuICAgIGl0ZXJhdGUgPSBvcHRpb25zLml0ZXJhdGU7XG4gICAgcmVzdWx0U2VsZWN0b3IgPSBvcHRpb25zLnJlc3VsdFNlbGVjdG9yIHx8IGlkZW50aXR5IGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gICAgc2NoZWR1bGVyID0gb3B0aW9ucy5zY2hlZHVsZXI7XG4gIH0gZWxzZSBpZiAocmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgPT09IHVuZGVmaW5lZCB8fCBpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSkpIHtcbiAgICBpbml0aWFsU3RhdGUgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgUztcbiAgICByZXN1bHRTZWxlY3RvciA9IGlkZW50aXR5IGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgYXMgU2NoZWR1bGVyTGlrZTtcbiAgfSBlbHNlIHtcbiAgICBpbml0aWFsU3RhdGUgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgUztcbiAgICByZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlIGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IHN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8U2NoZWR1bGVyU3RhdGU8VCwgUz4+KGRpc3BhdGNoLCAwLCB7XG4gICAgICAgIHN1YnNjcmliZXIsXG4gICAgICAgIGl0ZXJhdGUsXG4gICAgICAgIGNvbmRpdGlvbixcbiAgICAgICAgcmVzdWx0U2VsZWN0b3IsXG4gICAgICAgIHN0YXRlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIGxldCBjb25kaXRpb25SZXN1bHQ6IGJvb2xlYW47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uZGl0aW9uUmVzdWx0ID0gY29uZGl0aW9uKHN0YXRlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb25kaXRpb25SZXN1bHQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCB2YWx1ZTogVDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gcmVzdWx0U2VsZWN0b3Ioc3RhdGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IGl0ZXJhdGUoc3RhdGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0cnVlKTtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxULCBTPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248U2NoZWR1bGVyU3RhdGU8VCwgUz4+LCBzdGF0ZTogU2NoZWR1bGVyU3RhdGU8VCwgUz4pIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb25kaXRpb24gfSA9IHN0YXRlO1xuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChzdGF0ZS5uZWVkSXRlcmF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBzdGF0ZS5zdGF0ZSA9IHN0YXRlLml0ZXJhdGUoc3RhdGUuc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUubmVlZEl0ZXJhdGUgPSB0cnVlO1xuICB9XG4gIGlmIChjb25kaXRpb24pIHtcbiAgICBsZXQgY29uZGl0aW9uUmVzdWx0OiBib29sZWFuO1xuICAgIHRyeSB7XG4gICAgICBjb25kaXRpb25SZXN1bHQgPSBjb25kaXRpb24oc3RhdGUuc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCFjb25kaXRpb25SZXN1bHQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgbGV0IHZhbHVlOiBUO1xuICB0cnkge1xuICAgIHZhbHVlID0gc3RhdGUucmVzdWx0U2VsZWN0b3Ioc3RhdGUuc3RhdGUpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuL2RlZmVyJztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRGVjaWRlcyBhdCBzdWJzY3JpcHRpb24gdGltZSB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYWN0dWFsbHkgYmUgc3Vic2NyaWJlZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+YElmYCBzdGF0ZW1lbnQgZm9yIE9ic2VydmFibGVzLjwvc3Bhbj5cbiAqXG4gKiBgaWlmYCBhY2NlcHRzIGEgY29uZGl0aW9uIGZ1bmN0aW9uIGFuZCB0d28gT2JzZXJ2YWJsZXMuIFdoZW5cbiAqIGFuIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgdGhlIG9wZXJhdG9yIGlzIHN1YnNjcmliZWQsIGNvbmRpdGlvbiBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZC5cbiAqIEJhc2VkIG9uIHdoYXQgYm9vbGVhbiBpdCByZXR1cm5zIGF0IHRoYXQgbW9tZW50LCBjb25zdW1lciB3aWxsIHN1YnNjcmliZSBlaXRoZXIgdG9cbiAqIHRoZSBmaXJzdCBPYnNlcnZhYmxlIChpZiBjb25kaXRpb24gd2FzIHRydWUpIG9yIHRvIHRoZSBzZWNvbmQgKGlmIGNvbmRpdGlvbiB3YXMgZmFsc2UpLiBDb25kaXRpb25cbiAqIGZ1bmN0aW9uIG1heSBhbHNvIG5vdCByZXR1cm4gYW55dGhpbmcgLSBpbiB0aGF0IGNhc2UgY29uZGl0aW9uIHdpbGwgYmUgZXZhbHVhdGVkIGFzIGZhbHNlIGFuZFxuICogc2Vjb25kIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLlxuICpcbiAqIE5vdGUgdGhhdCBPYnNlcnZhYmxlcyBmb3IgYm90aCBjYXNlcyAodHJ1ZSBhbmQgZmFsc2UpIGFyZSBvcHRpb25hbC4gSWYgY29uZGl0aW9uIHBvaW50cyB0byBhbiBPYnNlcnZhYmxlIHRoYXRcbiAqIHdhcyBsZWZ0IHVuZGVmaW5lZCwgcmVzdWx0aW5nIHN0cmVhbSB3aWxsIHNpbXBseSBjb21wbGV0ZSBpbW1lZGlhdGVseS4gVGhhdCBhbGxvd3MgeW91IHRvLCByYXRoZXJcbiAqIHRoZW4gY29udHJvbGxpbmcgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQsIGRlY2lkZSBhdCBydW50aW1lIGlmIGNvbnN1bWVyIHNob3VsZCBoYXZlIGFjY2Vzc1xuICogdG8gZ2l2ZW4gT2JzZXJ2YWJsZSBvciBub3QuXG4gKlxuICogSWYgeW91IGhhdmUgbW9yZSBjb21wbGV4IGxvZ2ljIHRoYXQgcmVxdWlyZXMgZGVjaXNpb24gYmV0d2VlbiBtb3JlIHRoYW4gdHdvIE9ic2VydmFibGVzLCB7QGxpbmsgZGVmZXJ9XG4gKiB3aWxsIHByb2JhYmx5IGJlIGEgYmV0dGVyIGNob2ljZS4gQWN0dWFsbHkgYGlpZmAgY2FuIGJlIGVhc2lseSBpbXBsZW1lbnRlZCB3aXRoIHtAbGluayBkZWZlcn1cbiAqIGFuZCBleGlzdHMgb25seSBmb3IgY29udmVuaWVuY2UgYW5kIHJlYWRhYmlsaXR5IHJlYXNvbnMuXG4gKlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ2hhbmdlIGF0IHJ1bnRpbWUgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBzdWJzY3JpYmVUb0ZpcnN0O1xuICogY29uc3QgZmlyc3RPclNlY29uZCA9IGlpZihcbiAqICAgKCkgPT4gc3Vic2NyaWJlVG9GaXJzdCxcbiAqICAgb2YoJ2ZpcnN0JyksXG4gKiAgIG9mKCdzZWNvbmQnKSxcbiAqICk7XG4gKlxuICogc3Vic2NyaWJlVG9GaXJzdCA9IHRydWU7XG4gKiBmaXJzdE9yU2Vjb25kLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqXG4gKiBzdWJzY3JpYmVUb0ZpcnN0ID0gZmFsc2U7XG4gKiBmaXJzdE9yU2Vjb25kLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcInNlY29uZFwiXG4gKlxuICogYGBgXG4gKlxuICogIyMjIENvbnRyb2wgYW4gYWNjZXNzIHRvIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBhY2Nlc3NHcmFudGVkO1xuICogY29uc3Qgb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2VzcyA9IGlpZihcbiAqICAgKCkgPT4gYWNjZXNzR3JhbnRlZCxcbiAqICAgb2YoJ0l0IHNlZW1zIHlvdSBoYXZlIGFuIGFjY2Vzcy4uLicpLCAvLyBOb3RlIHRoYXQgb25seSBvbmUgT2JzZXJ2YWJsZSBpcyBwYXNzZWQgdG8gdGhlIG9wZXJhdG9yLlxuICogKTtcbiAqXG4gKiBhY2Nlc3NHcmFudGVkID0gdHJ1ZTtcbiAqIG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3Muc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoZSBlbmQnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiSXQgc2VlbXMgeW91IGhhdmUgYW4gYWNjZXNzLi4uXCJcbiAqIC8vIFwiVGhlIGVuZFwiXG4gKlxuICogYWNjZXNzR3JhbnRlZCA9IGZhbHNlO1xuICogb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2Vzcy5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhlIGVuZCcpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJUaGUgZW5kXCJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRlZmVyfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogYm9vbGVhbn0gY29uZGl0aW9uIENvbmRpdGlvbiB3aGljaCBPYnNlcnZhYmxlIHNob3VsZCBiZSBjaG9zZW4uXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IFt0cnVlT2JzZXJ2YWJsZV0gQW4gT2JzZXJ2YWJsZSB0aGF0IHdpbGwgYmUgc3Vic2NyaWJlZCBpZiBjb25kaXRpb24gaXMgdHJ1ZS5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW2ZhbHNlT2JzZXJ2YWJsZV0gQW4gT2JzZXJ2YWJsZSB0aGF0IHdpbGwgYmUgc3Vic2NyaWJlZCBpZiBjb25kaXRpb24gaXMgZmFsc2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBFaXRoZXIgZmlyc3Qgb3Igc2Vjb25kIE9ic2VydmFibGUsIGRlcGVuZGluZyBvbiBjb25kaXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGlpZlxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlpZjxULCBGPihcbiAgY29uZGl0aW9uOiAoKSA9PiBib29sZWFuLFxuICB0cnVlUmVzdWx0OiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gPSBFTVBUWSxcbiAgZmFsc2VSZXN1bHQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxGPiA9IEVNUFRZXG4pOiBPYnNlcnZhYmxlPFR8Rj4ge1xuICByZXR1cm4gZGVmZXI8VHxGPigoKSA9PiBjb25kaXRpb24oKSA/IHRydWVSZXN1bHQgOiBmYWxzZVJlc3VsdCk7XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pc0FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWw6IGFueSk6IHZhbCBpcyBudW1iZXIgfCBzdHJpbmcge1xuICAvLyBwYXJzZUZsb2F0IE5hTnMgbnVtZXJpYy1jYXN0IGZhbHNlIHBvc2l0aXZlcyAobnVsbHx0cnVlfGZhbHNlfFwiXCIpXG4gIC8vIC4uLmJ1dCBtaXNpbnRlcnByZXRzIGxlYWRpbmctbnVtYmVyIHN0cmluZ3MsIHBhcnRpY3VsYXJseSBoZXggbGl0ZXJhbHMgKFwiMHguLi5cIilcbiAgLy8gc3VidHJhY3Rpb24gZm9yY2VzIGluZmluaXRpZXMgdG8gTmFOXG4gIC8vIGFkZGluZyAxIGNvcnJlY3RzIGxvc3Mgb2YgcHJlY2lzaW9uIGZyb20gcGFyc2VGbG9hdCAoIzE1MTAwKVxuICByZXR1cm4gIWlzQXJyYXkodmFsKSAmJiAodmFsIC0gcGFyc2VGbG9hdCh2YWwpICsgMSkgPj0gMDtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4uL3V0aWwvaXNOdW1lcmljJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBzZXF1ZW50aWFsIG51bWJlcnMgZXZlcnkgc3BlY2lmaWVkXG4gKiBpbnRlcnZhbCBvZiB0aW1lLCBvbiBhIHNwZWNpZmllZCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGluY3JlbWVudGFsIG51bWJlcnMgcGVyaW9kaWNhbGx5IGluIHRpbWUuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGludGVydmFsLnBuZylcbiAqXG4gKiBgaW50ZXJ2YWxgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mXG4gKiBhc2NlbmRpbmcgaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lIG9mIHlvdXIgY2hvb3NpbmdcbiAqIGJldHdlZW4gdGhvc2UgZW1pc3Npb25zLiBUaGUgZmlyc3QgZW1pc3Npb24gaXMgbm90IHNlbnQgaW1tZWRpYXRlbHksIGJ1dFxuICogb25seSBhZnRlciB0aGUgZmlyc3QgcGVyaW9kIGhhcyBwYXNzZWQuIEJ5IGRlZmF1bHQsIHRoaXMgb3BlcmF0b3IgdXNlcyB0aGVcbiAqIGBhc3luY2Age0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHByb3ZpZGUgYSBub3Rpb24gb2YgdGltZSwgYnV0IHlvdSBtYXkgcGFzcyBhbnlcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBpdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKSB1cCB0byB0aGUgbnVtYmVyIDNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG51bWJlcnMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqXG4gKiBjb25zdCB0YWtlRm91ck51bWJlcnMgPSBudW1iZXJzLnBpcGUodGFrZSg0KSk7XG4gKlxuICogdGFrZUZvdXJOdW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdOZXh0OiAnLCB4KSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIE5leHQ6IDBcbiAqIC8vIE5leHQ6IDFcbiAqIC8vIE5leHQ6IDJcbiAqIC8vIE5leHQ6IDNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHRpbWVyfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtwZXJpb2Q9MF0gVGhlIGludGVydmFsIHNpemUgaW4gbWlsbGlzZWNvbmRzIChieSBkZWZhdWx0KVxuICogb3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGJ5IHRoZSBzY2hlZHVsZXIncyBjbG9jay5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMsIGFuZCBwcm92aWRpbmcgYSBub3Rpb24gb2YgXCJ0aW1lXCIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW50aWFsIG51bWJlciBlYWNoIHRpbWVcbiAqIGludGVydmFsLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBpbnRlcnZhbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVydmFsKHBlcmlvZCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICBpZiAoIWlzTnVtZXJpYyhwZXJpb2QpIHx8IHBlcmlvZCA8IDApIHtcbiAgICBwZXJpb2QgPSAwO1xuICB9XG5cbiAgaWYgKCFzY2hlZHVsZXIgfHwgdHlwZW9mIHNjaGVkdWxlci5zY2hlZHVsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHNjaGVkdWxlciA9IGFzeW5jO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgc3Vic2NyaWJlci5hZGQoXG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIHBlcmlvZCwgeyBzdWJzY3JpYmVyLCBjb3VudGVyOiAwLCBwZXJpb2QgfSlcbiAgICApO1xuICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPEludGVydmFsU3RhdGU+LCBzdGF0ZTogSW50ZXJ2YWxTdGF0ZSkge1xuICBjb25zdCB7IHN1YnNjcmliZXIsIGNvdW50ZXIsIHBlcmlvZCB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubmV4dChjb3VudGVyKTtcbiAgdGhpcy5zY2hlZHVsZSh7IHN1YnNjcmliZXIsIGNvdW50ZXI6IGNvdW50ZXIgKyAxLCBwZXJpb2QgfSwgcGVyaW9kKTtcbn1cblxuaW50ZXJmYWNlIEludGVydmFsU3RhdGUge1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG4gIGNvdW50ZXI6IG51bWJlcjtcbiAgcGVyaW9kOiBudW1iZXI7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9tZXJnZUFsbCc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDM+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2PiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDY+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQ+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZSB8IG51bWJlcilbXSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2UgfCBudW1iZXIpW10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKlxuICogQ3JlYXRlcyBhbiBvdXRwdXQgT2JzZXJ2YWJsZSB3aGljaCBjb25jdXJyZW50bHkgZW1pdHMgYWxsIHZhbHVlcyBmcm9tIGV2ZXJ5XG4gKiBnaXZlbiBpbnB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5GbGF0dGVucyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0b2dldGhlciBieSBibGVuZGluZ1xuICogdGhlaXIgdmFsdWVzIGludG8gb25lIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXShtZXJnZS5wbmcpXG4gKlxuICogYG1lcmdlYCBzdWJzY3JpYmVzIHRvIGVhY2ggZ2l2ZW4gaW5wdXQgT2JzZXJ2YWJsZSAoYXMgYXJndW1lbnRzKSwgYW5kIHNpbXBseVxuICogZm9yd2FyZHMgKHdpdGhvdXQgZG9pbmcgYW55IHRyYW5zZm9ybWF0aW9uKSBhbGwgdGhlIHZhbHVlcyBmcm9tIGFsbCB0aGUgaW5wdXRcbiAqIE9ic2VydmFibGVzIHRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlIG9ubHkgY29tcGxldGVzXG4gKiBvbmNlIGFsbCBpbnB1dCBPYnNlcnZhYmxlcyBoYXZlIGNvbXBsZXRlZC4gQW55IGVycm9yIGRlbGl2ZXJlZCBieSBhbiBpbnB1dFxuICogT2JzZXJ2YWJsZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgTWVyZ2UgdG9nZXRoZXIgdHdvIE9ic2VydmFibGVzOiAxcyBpbnRlcnZhbCBhbmQgY2xpY2tzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGNsaWNrc09yVGltZXIgPSBtZXJnZShjbGlja3MsIHRpbWVyKTtcbiAqIGNsaWNrc09yVGltZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIHRpbWVyIHdpbGwgZW1pdCBhc2NlbmRpbmcgdmFsdWVzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykgdG8gY29uc29sZVxuICogLy8gY2xpY2tzIGxvZ3MgTW91c2VFdmVudHMgdG8gY29uc29sZSBldmVyeXRpbWUgdGhlIFwiZG9jdW1lbnRcIiBpcyBjbGlja2VkXG4gKiAvLyBTaW5jZSB0aGUgdHdvIHN0cmVhbXMgYXJlIG1lcmdlZCB5b3Ugc2VlIHRoZXNlIGhhcHBlbmluZ1xuICogLy8gYXMgdGhleSBvY2N1ci5cbiAqIGBgYFxuICpcbiAqICMjIyBNZXJnZSB0b2dldGhlciAzIE9ic2VydmFibGVzLCBidXQgb25seSAyIHJ1biBjb25jdXJyZW50bHlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyMSA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgdGltZXIyID0gaW50ZXJ2YWwoMjAwMCkucGlwZSh0YWtlKDYpKTtcbiAqIGNvbnN0IHRpbWVyMyA9IGludGVydmFsKDUwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCBjb25jdXJyZW50ID0gMjsgLy8gdGhlIGFyZ3VtZW50XG4gKiBjb25zdCBtZXJnZWQgPSBtZXJnZSh0aW1lcjEsIHRpbWVyMiwgdGltZXIzLCBjb25jdXJyZW50KTtcbiAqIG1lcmdlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gLSBGaXJzdCB0aW1lcjEgYW5kIHRpbWVyMiB3aWxsIHJ1biBjb25jdXJyZW50bHlcbiAqIC8vIC0gdGltZXIxIHdpbGwgZW1pdCBhIHZhbHVlIGV2ZXJ5IDEwMDBtcyBmb3IgMTAgaXRlcmF0aW9uc1xuICogLy8gLSB0aW1lcjIgd2lsbCBlbWl0IGEgdmFsdWUgZXZlcnkgMjAwMG1zIGZvciA2IGl0ZXJhdGlvbnNcbiAqIC8vIC0gYWZ0ZXIgdGltZXIxIGhpdHMgaXQncyBtYXggaXRlcmF0aW9uLCB0aW1lcjIgd2lsbFxuICogLy8gICBjb250aW51ZSwgYW5kIHRpbWVyMyB3aWxsIHN0YXJ0IHRvIHJ1biBjb25jdXJyZW50bHkgd2l0aCB0aW1lcjJcbiAqIC8vIC0gd2hlbiB0aW1lcjIgaGl0cyBpdCdzIG1heCBpdGVyYXRpb24gaXQgdGVybWluYXRlcywgYW5kXG4gKiAvLyAgIHRpbWVyMyB3aWxsIGNvbnRpbnVlIHRvIGVtaXQgYSB2YWx1ZSBldmVyeSA1MDBtcyB1bnRpbCBpdCBpcyBjb21wbGV0ZVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWVyZ2VBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwVG99XG4gKiBAc2VlIHtAbGluayBtZXJnZVNjYW59XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IG9ic2VydmFibGVzIElucHV0IE9ic2VydmFibGVzIHRvIG1lcmdlIHRvZ2V0aGVyLlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2YgaW5wdXRcbiAqIE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPW51bGxdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBtYW5hZ2luZ1xuICogY29uY3VycmVuY3kgb2YgaW5wdXQgT2JzZXJ2YWJsZXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgdGhhdCBhcmUgdGhlIHJlc3VsdCBvZlxuICogZXZlcnkgaW5wdXQgT2JzZXJ2YWJsZS5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgbWVyZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlIHwgbnVtYmVyPik6IE9ic2VydmFibGU8Uj4ge1xuIGxldCBjb25jdXJyZW50ID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuIGxldCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBudWxsO1xuICBsZXQgbGFzdDogYW55ID0gb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV07XG4gIGlmIChpc1NjaGVkdWxlcihsYXN0KSkge1xuICAgIHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPm9ic2VydmFibGVzLnBvcCgpO1xuICAgIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPiAxICYmIHR5cGVvZiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbmN1cnJlbnQgPSA8bnVtYmVyPm9ic2VydmFibGVzLnBvcCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgbGFzdCA9PT0gJ251bWJlcicpIHtcbiAgICBjb25jdXJyZW50ID0gPG51bWJlcj5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuXG4gIGlmIChzY2hlZHVsZXIgPT09IG51bGwgJiYgb2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxICYmIG9ic2VydmFibGVzWzBdIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxSPj5vYnNlcnZhYmxlc1swXTtcbiAgfVxuXG4gIHJldHVybiBtZXJnZUFsbDxSPihjb25jdXJyZW50KShmcm9tQXJyYXk8YW55PihvYnNlcnZhYmxlcywgc2NoZWR1bGVyKSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcblxuLyoqXG4gKiBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBuZXZlciBjb21wbGV0ZXMuXG4gKlxuICogIVtdKG5ldmVyLnBuZylcbiAqXG4gKiBBIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbmVpdGhlciB2YWx1ZXMgbm9yIGVycm9ycyBub3IgdGhlIGNvbXBsZXRpb25cbiAqIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb3IgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcy4gUGxlYXNlIG5vdGUgdGhhdCBieSBuZXZlciBlbWl0dGluZyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbiwgdGhpc1xuICogT2JzZXJ2YWJsZSBrZWVwcyB0aGUgc3Vic2NyaXB0aW9uIGZyb20gYmVpbmcgZGlzcG9zZWQgYXV0b21hdGljYWxseS5cbiAqIFN1YnNjcmlwdGlvbnMgbmVlZCB0byBiZSBtYW51YWxseSBkaXNwb3NlZC5cbiAqXG4gKiAjIyAgRXhhbXBsZVxuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIG5ldmVyIGVtaXQgYW55dGhpbmcgZWxzZSAobm90IGV2ZW4gY29tcGxldGUpXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBpbmZvKCkge1xuICogICBjb25zb2xlLmxvZygnV2lsbCBub3QgYmUgY2FsbGVkJyk7XG4gKiB9XG4gKiBjb25zdCByZXN1bHQgPSBORVZFUi5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGluZm8sIGluZm8pO1xuICpcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBpbmRleC9FTVBUWX1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICogQHNlZSB7QGxpbmsgdGhyb3dFcnJvcn1cbiAqL1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KG5vb3ApO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgdXNpbmcge0BsaW5rIE5FVkVSfSBjb25zdGFudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ldmVyICgpIHtcbiAgcmV0dXJuIE5FVkVSO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KHY6IE9ic2VydmFibGVJbnB1dDxSPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgVDQsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgVDQsIFQ1LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8Uj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBXaGVuIGFueSBvZiB0aGUgcHJvdmlkZWQgT2JzZXJ2YWJsZSBlbWl0cyBhbiBjb21wbGV0ZSBvciBlcnJvciBub3RpZmljYXRpb24sIGl0IGltbWVkaWF0ZWx5IHN1YnNjcmliZXMgdG8gdGhlIG5leHQgb25lXG4gKiB0aGF0IHdhcyBwYXNzZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkV4ZWN1dGUgc2VyaWVzIG9mIE9ic2VydmFibGVzIG5vIG1hdHRlciB3aGF0LCBldmVuIGlmIGl0IG1lYW5zIHN3YWxsb3dpbmcgZXJyb3JzLjwvc3Bhbj5cbiAqXG4gKiAhW10ob25FcnJvclJlc3VtZU5leHQucG5nKVxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgV2lsbCBzdWJzY3JpYmUgdG8gZWFjaCBvYnNlcnZhYmxlIHNvdXJjZSBpdCBpcyBwcm92aWRlZCwgaW4gb3JkZXIuXG4gKiBJZiB0aGUgc291cmNlIGl0J3Mgc3Vic2NyaWJlZCB0byBlbWl0cyBhbiBlcnJvciBvciBjb21wbGV0ZXMsIGl0IHdpbGwgbW92ZSB0byB0aGUgbmV4dCBzb3VyY2VcbiAqIHdpdGhvdXQgZXJyb3IuXG4gKlxuICogSWYgYG9uRXJyb3JSZXN1bWVOZXh0YCBpcyBwcm92aWRlZCBubyBhcmd1bWVudHMsIG9yIGEgc2luZ2xlLCBlbXB0eSBhcnJheSwgaXQgd2lsbCByZXR1cm4ge0BsaW5rIGluZGV4L0VNUFRZfS5cbiAqXG4gKiBgb25FcnJvclJlc3VtZU5leHRgIGlzIGJhc2ljYWxseSB7QGxpbmsgY29uY2F0fSwgb25seSBpdCB3aWxsIGNvbnRpbnVlLCBldmVuIGlmIG9uZSBvZiBpdHNcbiAqIHNvdXJjZXMgZW1pdHMgYW4gZXJyb3IuXG4gKlxuICogTm90ZSB0aGF0IHRoZXJlIGlzIG5vIHdheSB0byBoYW5kbGUgYW55IGVycm9ycyB0aHJvd24gYnkgc291cmNlcyB2aWEgdGhlIHJlc3V1bHQgb2ZcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAuIElmIHlvdSB3YW50IHRvIGhhbmRsZSBlcnJvcnMgdGhyb3duIGluIGFueSBnaXZlbiBzb3VyY2UsIHlvdSBjYW5cbiAqIGFsd2F5cyB1c2UgdGhlIHtAbGluayBjYXRjaEVycm9yfSBvcGVyYXRvciBvbiB0aGVtIGJlZm9yZSBwYXNzaW5nIHRoZW0gaW50byBgb25FcnJvclJlc3VtZU5leHRgLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFN1YnNjcmliZSB0byB0aGUgbmV4dCBPYnNlcnZhYmxlIGFmdGVyIG1hcCBmYWlsczwvY2FwdGlvbj5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG9uRXJyb3JSZXN1bWVOZXh0LCBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIG9uRXJyb3JSZXN1bWVOZXh0KFxuICogIG9mKDEsIDIsIDMsIDApLnBpcGUoXG4gKiAgICBtYXAoeCA9PiB7XG4gKiAgICAgIGlmICh4ID09PSAwKSB0aHJvdyBFcnJvcigpO1xuICogICAgICByZXR1cm4gMTAgLyB4O1xuICogICAgfSlcbiAqICApLFxuICogIG9mKDEsIDIsIDMpLFxuICogKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsID0+IGNvbnNvbGUubG9nKHZhbCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpLCAgICAgICAgICAvLyBXaWxsIG5ldmVyIGJlIGNhbGxlZC5cbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ2RvbmUnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDEwXG4gKiAvLyA1XG4gKiAvLyAzLjMzMzMzMzMzMzMzMzMzMzVcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIDNcbiAqIC8vIFwiZG9uZVwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXR9XG4gKiBAc2VlIHtAbGluayBjYXRjaEVycm9yfVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBzb3VyY2VzIE9ic2VydmFibGVzIChvciBhbnl0aGluZyB0aGF0ICppcyogb2JzZXJ2YWJsZSkgcGFzc2VkIGVpdGhlciBkaXJlY3RseSBvciBhcyBhbiBhcnJheS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBjb25jYXRlbmF0ZXMgYWxsIHNvdXJjZXMsIG9uZSBhZnRlciB0aGUgb3RoZXIsXG4gKiBpZ25vcmluZyBhbGwgZXJyb3JzLCBzdWNoIHRoYXQgYW55IGVycm9yIGNhdXNlcyBpdCB0byBtb3ZlIG9uIHRvIHRoZSBuZXh0IHNvdXJjZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFI+KC4uLnNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj4ge1xuXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBFTVBUWTtcbiAgfVxuXG4gIGNvbnN0IFsgZmlyc3QsIC4uLnJlbWFpbmRlciBdID0gc291cmNlcztcblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShmaXJzdCkpIHtcbiAgICByZXR1cm4gb25FcnJvclJlc3VtZU5leHQoLi4uZmlyc3QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIGNvbnN0IHN1Yk5leHQgPSAoKSA9PiBzdWJzY3JpYmVyLmFkZChcbiAgICAgIG9uRXJyb3JSZXN1bWVOZXh0KC4uLnJlbWFpbmRlcikuc3Vic2NyaWJlKHN1YnNjcmliZXIpXG4gICAgKTtcblxuICAgIHJldHVybiBmcm9tKGZpcnN0KS5zdWJzY3JpYmUoe1xuICAgICAgbmV4dCh2YWx1ZSkgeyBzdWJzY3JpYmVyLm5leHQodmFsdWUpOyB9LFxuICAgICAgZXJyb3I6IHN1Yk5leHQsXG4gICAgICBjb21wbGV0ZTogc3ViTmV4dCxcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYW4gT2JzZXJ2YWJsZSBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VHVybiBlbnRyaWVzIG9mIGFuIG9iamVjdCBpbnRvIGEgc3RyZWFtLjwvc3Bhbj5cbiAqXG4gKiA8aW1nIHNyYz1cIi4vaW1nL3BhaXJzLnBuZ1wiIHdpZHRoPVwiMTAwJVwiPlxuICpcbiAqIGBwYWlyc2AgdGFrZXMgYW4gYXJiaXRyYXJ5IG9iamVjdCBhbmQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYXJyYXlzLiBFYWNoXG4gKiBlbWl0dGVkIGFycmF5IGhhcyBleGFjdGx5IHR3byBlbGVtZW50cyAtIHRoZSBmaXJzdCBpcyBhIGtleSBmcm9tIHRoZSBvYmplY3RcbiAqIGFuZCB0aGUgc2Vjb25kIGlzIGEgdmFsdWUgY29ycmVzcG9uZGluZyB0byB0aGF0IGtleS4gS2V5cyBhcmUgZXh0cmFjdGVkIGZyb21cbiAqIGFuIG9iamVjdCB2aWEgYE9iamVjdC5rZXlzYCBmdW5jdGlvbiwgd2hpY2ggbWVhbnMgdGhhdCB0aGV5IHdpbGwgYmUgb25seVxuICogZW51bWVyYWJsZSBrZXlzIHRoYXQgYXJlIHByZXNlbnQgb24gYW4gb2JqZWN0IGRpcmVjdGx5IC0gbm90IG9uZXMgaW5oZXJpdGVkXG4gKiB2aWEgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEJ5IGRlZmF1bHQgdGhlc2UgYXJyYXlzIGFyZSBlbWl0dGVkIHN5bmNocm9ub3VzbHkuIFRvIGNoYW5nZSB0aGF0IHlvdSBjYW5cbiAqIHBhc3MgYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gYHBhaXJzYC5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Db252ZXJ0cyBhIGphdmFzY3JpcHQgb2JqZWN0IHRvIGFuIE9ic2VydmFibGU8L2NhcHRpb24+XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYmogPSB7XG4gKiAgIGZvbzogNDIsXG4gKiAgIGJhcjogNTYsXG4gKiAgIGJhejogNzhcbiAqIH07XG4gKlxuICogcGFpcnMob2JqKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd0aGUgZW5kIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBbXCJmb29cIjogNDJdLFxuICogLy8gW1wiYmFyXCI6IDU2XSxcbiAqIC8vIFtcImJhelwiOiA3OF0sXG4gKiAvLyBcInRoZSBlbmQhXCJcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBpbnNwZWN0IGFuZCB0dXJuIGludG8gYW5cbiAqIE9ic2VydmFibGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gQW4gb3B0aW9uYWwgSVNjaGVkdWxlciB0byBzY2hlZHVsZVxuICogd2hlbiByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3aWxsIGVtaXQgdmFsdWVzLlxuICogQHJldHVybnMgeyhPYnNlcnZhYmxlPEFycmF5PHN0cmluZ3xUPj4pfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mXG4gKiBba2V5LCB2YWx1ZV0gcGFpcnMgZnJvbSB0aGUgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFpcnM8VD4ob2JqOiBPYmplY3QsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoW2tleSwgb2JqW2tleV1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICAgIHNjaGVkdWxlci5zY2hlZHVsZTx7IGtleXM6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFtzdHJpbmcsIFRdPiwgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24sIG9iajogT2JqZWN0IH0+XG4gICAgICAgICAgKGRpc3BhdGNoLCAwLCB7IGtleXMsIGluZGV4OiAwLCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9KSk7XG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZTogeyBrZXlzOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbc3RyaW5nLCBUXT4sIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uLCBvYmo6IE9iamVjdCB9KSB7XG4gIGNvbnN0IHsga2V5cywgaW5kZXgsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0gPSBzdGF0ZTtcbiAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIGlmIChpbmRleCA8IGtleXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIHN1YnNjcmliZXIubmV4dChba2V5LCBvYmpba2V5XV0pO1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZCh0aGlzLnNjaGVkdWxlKHsga2V5cywgaW5kZXg6IGluZGV4ICsgMSwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgZmlyc3Qgc291cmNlIE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBTdWJzY3JpYmVzIHRvIHRoZSBvYnNlcnZhYmxlIHRoYXQgd2FzIHRoZSBmaXJzdCB0byBzdGFydCBlbWl0dGluZy5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYnMxID0gaW50ZXJ2YWwoMTAwMCkucGlwZShtYXBUbygnZmFzdCBvbmUnKSk7XG4gKiBjb25zdCBvYnMyID0gaW50ZXJ2YWwoMzAwMCkucGlwZShtYXBUbygnbWVkaXVtIG9uZScpKTtcbiAqIGNvbnN0IG9iczMgPSBpbnRlcnZhbCg1MDAwKS5waXBlKG1hcFRvKCdzbG93IG9uZScpKTtcbiAqXG4gKiByYWNlKG9iczMsIG9iczEsIG9iczIpXG4gKiAuc3Vic2NyaWJlKFxuICogICB3aW5uZXIgPT4gY29uc29sZS5sb2cod2lubmVyKVxuICogKTtcbiAqXG4gKiAvLyByZXN1bHQ6XG4gKiAvLyBhIHNlcmllcyBvZiAnZmFzdCBvbmUnXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVzfSAuLi5vYnNlcnZhYmxlcyBzb3VyY2VzIHVzZWQgdG8gcmFjZSBmb3Igd2hpY2ggT2JzZXJ2YWJsZSBlbWl0cyBmaXJzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBvdXRwdXQgb2YgdGhlIGZpcnN0IE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSByYWNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPihvYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4ob2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8YW55Pj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4gfCBBcnJheTxPYnNlcnZhYmxlPFQ+Pj4pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8YW55PiB8IEFycmF5PE9ic2VydmFibGU8YW55Pj4+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIC8vIGlmIHRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIGFycmF5LCBpdCB3YXMgbW9zdCBsaWtlbHkgY2FsbGVkIHdpdGhcbiAgLy8gYHJhY2UoW29iczEsIG9iczIsIC4uLl0pYFxuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKGlzQXJyYXkob2JzZXJ2YWJsZXNbMF0pKSB7XG4gICAgICBvYnNlcnZhYmxlcyA9IDxBcnJheTxPYnNlcnZhYmxlPGFueT4+Pm9ic2VydmFibGVzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPE9ic2VydmFibGU8YW55Pj5vYnNlcnZhYmxlc1swXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCB1bmRlZmluZWQpLmxpZnQobmV3IFJhY2VPcGVyYXRvcjxUPigpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJhY2VPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBSYWNlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBSYWNlU3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgaGFzRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KG9ic2VydmFibGU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXRoaXMuaGFzRmlyc3Q7IGkrKykge1xuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IG9ic2VydmFibGVzW2ldO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSBhcyBhbnksIGkpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNGaXJzdCkge1xuICAgICAgdGhpcy5oYXNGaXJzdCA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpICE9PSBvdXRlckluZGV4KSB7XG4gICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaXB0aW9uc1tpXTtcblxuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbmNlIG9mIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkXG4gKiByYW5nZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIGluIGEgcmFuZ2UuPC9zcGFuPlxuICpcbiAqICFbXShyYW5nZS5wbmcpXG4gKlxuICogYHJhbmdlYCBvcGVyYXRvciBlbWl0cyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdlcnMsIGluIG9yZGVyLCB3aGVyZSB5b3VcbiAqIHNlbGVjdCB0aGUgYHN0YXJ0YCBvZiB0aGUgcmFuZ2UgYW5kIGl0cyBgbGVuZ3RoYC4gQnkgZGVmYXVsdCwgdXNlcyBub1xuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb25zIHN5bmNocm9ub3VzbHksIGJ1dCBtYXkgdXNlXG4gKiBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcmVndWxhdGUgdGhvc2UgZGVsaXZlcmllcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyB0aGUgbnVtYmVycyAxIHRvIDEwPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHJhbmdlKDEsIDEwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnRlZ2VyIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY291bnQ9MF0gVGhlIG51bWJlciBvZiBzZXF1ZW50aWFsIGludGVnZXJzIHRvIGdlbmVyYXRlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbnMgb2YgdGhlIG5vdGlmaWNhdGlvbnMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIG51bWJlcnMgdGhhdCBlbWl0cyBhIGZpbml0ZSByYW5nZSBvZlxuICogc2VxdWVudGlhbCBpbnRlZ2Vycy5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFuZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudCA9IHN0YXJ0O1xuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwge1xuICAgICAgICBpbmRleCwgY291bnQsIHN0YXJ0LCBzdWJzY3JpYmVyXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoaW5kZXgrKyA+PSBjb3VudCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoY3VycmVudCsrKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sIHN0YXRlOiBhbnkpIHtcbiAgY29uc3QgeyBzdGFydCwgaW5kZXgsIGNvdW50LCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcblxuICBpZiAoaW5kZXggPj0gY291bnQpIHtcbiAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3Vic2NyaWJlci5uZXh0KHN0YXJ0KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgc3RhdGUuc3RhcnQgPSBzdGFydCArIDE7XG5cbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IHN0YXJ0cyBlbWl0dGluZyBhZnRlciBhbiBgZHVlVGltZWAgYW5kXG4gKiBlbWl0cyBldmVyIGluY3JlYXNpbmcgbnVtYmVycyBhZnRlciBlYWNoIGBwZXJpb2RgIG9mIHRpbWUgdGhlcmVhZnRlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXRzIGxpa2Uge0BsaW5rIGluZGV4L2ludGVydmFsfSwgYnV0IHlvdSBjYW4gc3BlY2lmeSB3aGVuXG4gKiBzaG91bGQgdGhlIGVtaXNzaW9ucyBzdGFydC48L3NwYW4+XG4gKlxuICogIVtdKHRpbWVyLnBuZylcbiAqXG4gKiBgdGltZXJgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mIGFzY2VuZGluZ1xuICogaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lLCBgcGVyaW9kYCBvZiB5b3VyIGNob29zaW5nXG4gKiBiZXR3ZWVuIHRob3NlIGVtaXNzaW9ucy4gVGhlIGZpcnN0IGVtaXNzaW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHNwZWNpZmllZFxuICogYGR1ZVRpbWVgLiBUaGUgaW5pdGlhbCBkZWxheSBtYXkgYmUgYSBgRGF0ZWAuIEJ5IGRlZmF1bHQsIHRoaXNcbiAqIG9wZXJhdG9yIHVzZXMgdGhlIHtAbGluayBhc3luY1NjaGVkdWxlcn0ge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHByb3ZpZGUgYSBub3Rpb24gb2YgdGltZSwgYnV0IHlvdVxuICogbWF5IHBhc3MgYW55IHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBpdC4gSWYgYHBlcmlvZGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBlbWl0cyBvbmx5IG9uZSB2YWx1ZSwgYDBgLiBPdGhlcndpc2UsIGl0IGVtaXRzIGFuIGluZmluaXRlXG4gKiBzZXF1ZW5jZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXRzIGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kICgxMDAwbXMpLCBzdGFydGluZyBhZnRlciAzIHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSB0aW1lcigzMDAwLCAxMDAwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogIyMjIEVtaXRzIG9uZSBudW1iZXIgYWZ0ZXIgZml2ZSBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gdGltZXIoNTAwMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgaW5kZXgvaW50ZXJ2YWx9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcnxEYXRlfSBbZHVlVGltZV0gVGhlIGluaXRpYWwgZGVsYXkgdGltZSBzcGVjaWZpZWQgYXMgYSBEYXRlIG9iamVjdCBvciBhcyBhbiBpbnRlZ2VyIGRlbm90aW5nXG4gKiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgZW1pdHRpbmcgdGhlIGZpcnN0IHZhbHVlIG9mIDBgLlxuICogQHBhcmFtIHtudW1iZXJ8U2NoZWR1bGVyTGlrZX0gW3BlcmlvZE9yU2NoZWR1bGVyXSBUaGUgcGVyaW9kIG9mIHRpbWUgYmV0d2VlbiBlbWlzc2lvbnMgb2YgdGhlXG4gKiBzdWJzZXF1ZW50IG51bWJlcnMuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLCBhbmQgcHJvdmlkaW5nIGEgbm90aW9uIG9mIFwidGltZVwiLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgYDBgIGFmdGVyIHRoZVxuICogYGR1ZVRpbWVgIGFuZCBldmVyIGluY3JlYXNpbmcgbnVtYmVycyBhZnRlciBlYWNoIGBwZXJpb2RgIG9mIHRpbWVcbiAqIHRoZXJlYWZ0ZXIuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHRpbWVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZXIoZHVlVGltZTogbnVtYmVyIHwgRGF0ZSA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgcGVyaW9kT3JTY2hlZHVsZXI/OiBudW1iZXIgfCBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICBsZXQgcGVyaW9kID0gLTE7XG4gIGlmIChpc051bWVyaWMocGVyaW9kT3JTY2hlZHVsZXIpKSB7XG4gICAgcGVyaW9kID0gTnVtYmVyKHBlcmlvZE9yU2NoZWR1bGVyKSA8IDEgJiYgMSB8fCBOdW1iZXIocGVyaW9kT3JTY2hlZHVsZXIpO1xuICB9IGVsc2UgaWYgKGlzU2NoZWR1bGVyKHBlcmlvZE9yU2NoZWR1bGVyKSkge1xuICAgIHNjaGVkdWxlciA9IHBlcmlvZE9yU2NoZWR1bGVyIGFzIGFueTtcbiAgfVxuXG4gIGlmICghaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSkge1xuICAgIHNjaGVkdWxlciA9IGFzeW5jO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIGNvbnN0IGR1ZSA9IGlzTnVtZXJpYyhkdWVUaW1lKVxuICAgICAgPyAoZHVlVGltZSBhcyBudW1iZXIpXG4gICAgICA6ICgrZHVlVGltZSAtIHNjaGVkdWxlci5ub3coKSk7XG5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCBkdWUsIHtcbiAgICAgIGluZGV4OiAwLCBwZXJpb2QsIHN1YnNjcmliZXJcbiAgICB9KTtcbiAgfSk7XG59XG5cbmludGVyZmFjZSBUaW1lclN0YXRlIHtcbiAgaW5kZXg6IG51bWJlcjtcbiAgcGVyaW9kOiBudW1iZXI7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8bnVtYmVyPjtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPFRpbWVyU3RhdGU+LCBzdGF0ZTogVGltZXJTdGF0ZSkge1xuICBjb25zdCB7IGluZGV4LCBwZXJpb2QsIHN1YnNjcmliZXIgfSA9IHN0YXRlO1xuICBzdWJzY3JpYmVyLm5leHQoaW5kZXgpO1xuXG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmIChwZXJpb2QgPT09IC0xKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgfVxuXG4gIHN0YXRlLmluZGV4ID0gaW5kZXggKyAxO1xuICB0aGlzLnNjaGVkdWxlKHN0YXRlLCBwZXJpb2QpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVW5zdWJzY3JpYmFibGUsIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nOyAvLyBmcm9tIGZyb20gZnJvbSEgTEFXTFxuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCB1c2VzIGEgcmVzb3VyY2Ugd2hpY2ggd2lsbCBiZSBkaXNwb3NlZCBhdCB0aGUgc2FtZSB0aW1lIGFzIHRoZSBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Vc2UgaXQgd2hlbiB5b3UgY2F0Y2ggeW91cnNlbGYgY2xlYW5pbmcgdXAgYWZ0ZXIgYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYHVzaW5nYCBpcyBhIGZhY3Rvcnkgb3BlcmF0b3IsIHdoaWNoIGFjY2VwdHMgdHdvIGZ1bmN0aW9ucy4gRmlyc3QgZnVuY3Rpb24gcmV0dXJucyBhIGRpc3Bvc2FibGUgcmVzb3VyY2UuXG4gKiBJdCBjYW4gYmUgYW4gYXJiaXRyYXJ5IG9iamVjdCB0aGF0IGltcGxlbWVudHMgYHVuc3Vic2NyaWJlYCBtZXRob2QuIFNlY29uZCBmdW5jdGlvbiB3aWxsIGJlIGluamVjdGVkIHdpdGhcbiAqIHRoYXQgb2JqZWN0IGFuZCBzaG91bGQgcmV0dXJuIGFuIE9ic2VydmFibGUuIFRoYXQgT2JzZXJ2YWJsZSBjYW4gdXNlIHJlc291cmNlIG9iamVjdCBkdXJpbmcgaXRzIGV4ZWN1dGlvbi5cbiAqIEJvdGggZnVuY3Rpb25zIHBhc3NlZCB0byBgdXNpbmdgIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5IHRpbWUgc29tZW9uZSBzdWJzY3JpYmVzIC0gbmVpdGhlciBhbiBPYnNlcnZhYmxlIG5vclxuICogcmVzb3VyY2Ugb2JqZWN0IHdpbGwgYmUgc2hhcmVkIGluIGFueSB3YXkgYmV0d2VlbiBzdWJzY3JpcHRpb25zLlxuICpcbiAqIFdoZW4gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgdXNpbmdgIGlzIHN1YnNjcmliZWQsIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSB0aGUgc2Vjb25kIGZ1bmN0aW9uIHdpbGwgYmUgc3Vic2NyaWJlZFxuICogYXMgd2VsbC4gQWxsIGl0cyBub3RpZmljYXRpb25zIChuZXh0ZWQgdmFsdWVzLCBjb21wbGV0aW9uIGFuZCBlcnJvciBldmVudHMpIHdpbGwgYmUgZW1pdHRlZCB1bmNoYW5nZWQgYnkgdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS4gSWYgaG93ZXZlciBzb21lb25lIHVuc3Vic2NyaWJlcyBmcm9tIHRoZSBPYnNlcnZhYmxlIG9yIHNvdXJjZSBPYnNlcnZhYmxlIGNvbXBsZXRlcyBvciBlcnJvcnMgYnkgaXRzZWxmLFxuICogdGhlIGB1bnN1YnNjcmliZWAgbWV0aG9kIG9uIHJlc291cmNlIG9iamVjdCB3aWxsIGJlIGNhbGxlZC4gVGhpcyBjYW4gYmUgdXNlZCB0byBkbyBhbnkgbmVjZXNzYXJ5IGNsZWFuIHVwLCB3aGljaFxuICogb3RoZXJ3aXNlIHdvdWxkIGhhdmUgdG8gYmUgaGFuZGxlZCBieSBoYW5kLiBOb3RlIHRoYXQgY29tcGxldGUgb3IgZXJyb3Igbm90aWZpY2F0aW9ucyBhcmUgbm90IGVtaXR0ZWQgd2hlbiBzb21lb25lXG4gKiBjYW5jZWxzIHN1YnNjcmlwdGlvbiB0byBhbiBPYnNlcnZhYmxlIHZpYSBgdW5zdWJzY3JpYmVgLCBzbyBgdXNpbmdgIGNhbiBiZSB1c2VkIGFzIGEgaG9vaywgYWxsb3dpbmcgeW91IHRvIG1ha2VcbiAqIHN1cmUgdGhhdCBhbGwgcmVzb3VyY2VzIHdoaWNoIG5lZWQgdG8gZXhpc3QgZHVyaW5nIGFuIE9ic2VydmFibGUgZXhlY3V0aW9uIHdpbGwgYmUgZGlzcG9zZWQgYXQgYXBwcm9wcmlhdGUgdGltZS5cbiAqXG4gKiBAc2VlIHtAbGluayBkZWZlcn1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IElTdWJzY3JpcHRpb259IHJlc291cmNlRmFjdG9yeSBBIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW55IHJlc291cmNlIG9iamVjdFxuICogdGhhdCBpbXBsZW1lbnRzIGB1bnN1YnNjcmliZWAgbWV0aG9kLlxuICogQHBhcmFtIHtmdW5jdGlvbihyZXNvdXJjZTogSVN1YnNjcmlwdGlvbik6IE9ic2VydmFibGU8VD59IG9ic2VydmFibGVGYWN0b3J5IEEgZnVuY3Rpb24gd2hpY2hcbiAqIGNyZWF0ZXMgYW4gT2JzZXJ2YWJsZSwgdGhhdCBjYW4gdXNlIGluamVjdGVkIHJlc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBiZWhhdmVzIHRoZSBzYW1lIGFzIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgYG9ic2VydmFibGVGYWN0b3J5YCwgYnV0XG4gKiB3aGljaCAtIHdoZW4gY29tcGxldGVkLCBlcnJvcmVkIG9yIHVuc3Vic2NyaWJlZCAtIHdpbGwgYWxzbyBjYWxsIGB1bnN1YnNjcmliZWAgb24gY3JlYXRlZCByZXNvdXJjZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2luZzxUPihyZXNvdXJjZUZhY3Rvcnk6ICgpID0+IFVuc3Vic2NyaWJhYmxlIHwgdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlRmFjdG9yeTogKHJlc291cmNlOiBVbnN1YnNjcmliYWJsZSB8IHZvaWQpID0+IE9ic2VydmFibGVJbnB1dDxUPiB8IHZvaWQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCByZXNvdXJjZTogVW5zdWJzY3JpYmFibGUgfCB2b2lkO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlc291cmNlID0gcmVzb3VyY2VGYWN0b3J5KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxUPiB8IHZvaWQ7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IG9ic2VydmFibGVGYWN0b3J5KHJlc291cmNlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlID0gcmVzdWx0ID8gZnJvbShyZXN1bHQpIDogRU1QVFk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgcmVzb3VyY2UudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi8uLi9pbnRlcm5hbC9zeW1ib2wvaXRlcmF0b3InO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSwgdjY6IFQ2KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG5leHBvcnQgZnVuY3Rpb24gemlwPFQ+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSk6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8ICgoLi4udmFsdWVzOiBBcnJheTxUPikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbWJpbmVzIG11bHRpcGxlIE9ic2VydmFibGVzIHRvIGNyZWF0ZSBhbiBPYnNlcnZhYmxlIHdob3NlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB2YWx1ZXMsIGluIG9yZGVyLCBvZiBlYWNoXG4gKiBvZiBpdHMgaW5wdXQgT2JzZXJ2YWJsZXMuXG4gKlxuICogSWYgdGhlIGxhdGVzdCBwYXJhbWV0ZXIgaXMgYSBmdW5jdGlvbiwgdGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNvbXB1dGUgdGhlIGNyZWF0ZWQgdmFsdWUgZnJvbSB0aGUgaW5wdXQgdmFsdWVzLlxuICogT3RoZXJ3aXNlLCBhbiBhcnJheSBvZiB0aGUgaW5wdXQgdmFsdWVzIGlzIHJldHVybmVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbWJpbmUgYWdlIGFuZCBuYW1lIGZyb20gZGlmZmVyZW50IHNvdXJjZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBhZ2UkID0gb2Y8bnVtYmVyPigyNywgMjUsIDI5KTtcbiAqIGxldCBuYW1lJCA9IG9mPHN0cmluZz4oJ0ZvbycsICdCYXInLCAnQmVlcicpO1xuICogbGV0IGlzRGV2JCA9IG9mPGJvb2xlYW4+KHRydWUsIHRydWUsIGZhbHNlKTtcbiAqXG4gKiB6aXAoYWdlJCwgbmFtZSQsIGlzRGV2JCkucGlwZShcbiAqICAgbWFwKChhZ2U6IG51bWJlciwgbmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbikgPT4gKHsgYWdlLCBuYW1lLCBpc0RldiB9KSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIG91dHB1dHNcbiAqIC8vIHsgYWdlOiAyNywgbmFtZTogJ0ZvbycsIGlzRGV2OiB0cnVlIH1cbiAqIC8vIHsgYWdlOiAyNSwgbmFtZTogJ0JhcicsIGlzRGV2OiB0cnVlIH1cbiAqIC8vIHsgYWdlOiAyOSwgbmFtZTogJ0JlZXInLCBpc0RldjogZmFsc2UgfVxuICogYGBgXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZXNcbiAqIEByZXR1cm4ge09ic2VydmFibGU8Uj59XG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHppcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPiB7XG4gIGNvbnN0IHJlc3VsdFNlbGVjdG9yID0gPCgoLi4ueXM6IEFycmF5PGFueT4pID0+IFIpPiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXTtcbiAgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9ic2VydmFibGVzLnBvcCgpO1xuICB9XG4gIHJldHVybiBmcm9tQXJyYXkob2JzZXJ2YWJsZXMsIHVuZGVmaW5lZCkubGlmdChuZXcgWmlwT3BlcmF0b3IocmVzdWx0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFppcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuXG4gIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSO1xuXG4gIGNvbnN0cnVjdG9yKHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSByZXN1bHRTZWxlY3RvcjtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBaaXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVzdWx0U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFppcFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZXM6IGFueTtcbiAgcHJpdmF0ZSByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUjtcbiAgcHJpdmF0ZSBpdGVyYXRvcnM6IExvb2tBaGVhZEl0ZXJhdG9yPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUixcbiAgICAgICAgICAgICAgdmFsdWVzOiBhbnkgPSBPYmplY3QuY3JlYXRlKG51bGwpKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSA/IHJlc3VsdFNlbGVjdG9yIDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgU3RhdGljQXJyYXlJdGVyYXRvcih2YWx1ZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBTdGF0aWNJdGVyYXRvcih2YWx1ZVtTeW1ib2xfaXRlcmF0b3JdKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFppcEJ1ZmZlckl0ZXJhdG9yKHRoaXMuZGVzdGluYXRpb24sIHRoaXMsIHZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSB0aGlzLml0ZXJhdG9ycztcbiAgICBjb25zdCBsZW4gPSBpdGVyYXRvcnMubGVuZ3RoO1xuXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlID0gbGVuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvcjogWmlwQnVmZmVySXRlcmF0b3I8YW55LCBhbnk+ID0gPGFueT5pdGVyYXRvcnNbaV07XG4gICAgICBpZiAoaXRlcmF0b3Iuc3RpbGxVbnN1YnNjcmliZWQpIHtcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICAgICAgZGVzdGluYXRpb24uYWRkKGl0ZXJhdG9yLnN1YnNjcmliZShpdGVyYXRvciwgaSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmUtLTsgLy8gbm90IGFuIG9ic2VydmFibGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlJbmFjdGl2ZSgpIHtcbiAgICB0aGlzLmFjdGl2ZS0tO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSXRlcmF0b3JzKCkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGNvbnN0IGxlbiA9IGl0ZXJhdG9ycy5sZW5ndGg7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgLy8gYWJvcnQgaWYgbm90IGFsbCBvZiB0aGVtIGhhdmUgdmFsdWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGl0ZXJhdG9yID0gaXRlcmF0b3JzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvci5oYXNWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiAhaXRlcmF0b3IuaGFzVmFsdWUoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHNob3VsZENvbXBsZXRlID0gZmFsc2U7XG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3IgPSBpdGVyYXRvcnNbaV07XG4gICAgICBsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyBjb21wbGV0ZWQgbm93IHRoYXQgeW91J3ZlIGdvdHRlblxuICAgICAgLy8gdGhlIG5leHQgdmFsdWUuXG4gICAgICBpZiAoaXRlcmF0b3IuaGFzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgc2hvdWxkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcmdzLnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXN1bHRTZWxlY3Rvcikge1xuICAgICAgdGhpcy5fdHJ5cmVzdWx0U2VsZWN0b3IoYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQoYXJncyk7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZENvbXBsZXRlKSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJ5cmVzdWx0U2VsZWN0b3IoYXJnczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0U2VsZWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG5cbmludGVyZmFjZSBMb29rQWhlYWRJdGVyYXRvcjxUPiBleHRlbmRzIEl0ZXJhdG9yPFQ+IHtcbiAgaGFzVmFsdWUoKTogYm9vbGVhbjtcbiAgaGFzQ29tcGxldGVkKCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIFN0YXRpY0l0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIG5leHRSZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KSB7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLm5leHRSZXN1bHQ7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICBjb25zdCBuZXh0UmVzdWx0ID0gdGhpcy5uZXh0UmVzdWx0O1xuICAgIHJldHVybiBuZXh0UmVzdWx0ICYmIG5leHRSZXN1bHQuZG9uZTtcbiAgfVxufVxuXG5jbGFzcyBTdGF0aWNBcnJheUl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIGluZGV4ID0gMDtcbiAgcHJpdmF0ZSBsZW5ndGggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXJyYXk6IFRbXSkge1xuICAgIHRoaXMubGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgW1N5bWJvbF9pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGkgPSB0aGlzLmluZGV4Kys7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIHJldHVybiBpIDwgdGhpcy5sZW5ndGggPyB7IHZhbHVlOiBhcnJheVtpXSwgZG9uZTogZmFsc2UgfSA6IHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aCA+IHRoaXMuaW5kZXg7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoID09PSB0aGlzLmluZGV4O1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBaaXBCdWZmZXJJdGVyYXRvcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiBpbXBsZW1lbnRzIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IHtcbiAgc3RpbGxVbnN1YnNjcmliZWQgPSB0cnVlO1xuICBidWZmZXI6IFRbXSA9IFtdO1xuICBpc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFBhcnRpYWxPYnNlcnZlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IFppcFN1YnNjcmliZXI8VCwgUj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIFtTeW1ib2xfaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gTk9URTogdGhlcmUgaXMgYWN0dWFsbHkgYSBuYW1lIGNvbGxpc2lvbiBoZXJlIHdpdGggU3Vic2NyaWJlci5uZXh0IGFuZCBJdGVyYXRvci5uZXh0XG4gIC8vICAgIHRoaXMgaXMgbGVnaXQgYmVjYXVzZSBgbmV4dCgpYCB3aWxsIG5ldmVyIGJlIGNhbGxlZCBieSBhIHN1YnNjcmlwdGlvbiBpbiB0aGlzIGNhc2UuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwICYmIHRoaXMuaXNDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IGJ1ZmZlci5zaGlmdCgpLCBkb25lOiBmYWxzZSB9O1xuICAgIH1cbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPiAwO1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0NvbXBsZXRlO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICB0aGlzLnBhcmVudC5ub3RpZnlJbmFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuYnVmZmVyLnB1c2goaW5uZXJWYWx1ZSk7XG4gICAgdGhpcy5wYXJlbnQuY2hlY2tJdGVyYXRvcnMoKTtcbiAgfVxuXG4gIHN1YnNjcmliZSh2YWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUmVzdWx0PGFueSwgYW55Pih0aGlzLCB0aGlzLm9ic2VydmFibGUsIHRoaXMsIGluZGV4KTtcbiAgfVxufVxuIiwiLyogT2JzZXJ2YWJsZSAqL1xuZXhwb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XG5leHBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmV4cG9ydCB7IEdyb3VwZWRPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9vcGVyYXRvcnMvZ3JvdXBCeSc7XG5leHBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vaW50ZXJuYWwvT3BlcmF0b3InO1xuZXhwb3J0IHsgb2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvc3ltYm9sL29ic2VydmFibGUnO1xuXG4vKiBTdWJqZWN0cyAqL1xuZXhwb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvU3ViamVjdCc7XG5leHBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICcuL2ludGVybmFsL0JlaGF2aW9yU3ViamVjdCc7XG5leHBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi9pbnRlcm5hbC9SZXBsYXlTdWJqZWN0JztcbmV4cG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvQXN5bmNTdWJqZWN0JztcblxuLyogU2NoZWR1bGVycyAqL1xuZXhwb3J0IHsgYXNhcCBhcyBhc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvYXNhcCc7XG5leHBvcnQgeyBhc3luYyBhcyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL2FzeW5jJztcbmV4cG9ydCB7IHF1ZXVlIGFzIHF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvcXVldWUnO1xuZXhwb3J0IHsgYW5pbWF0aW9uRnJhbWUgYXMgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZSc7XG5leHBvcnQgeyBWaXJ0dWFsVGltZVNjaGVkdWxlciwgVmlydHVhbEFjdGlvbiB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL1ZpcnR1YWxUaW1lU2NoZWR1bGVyJztcbmV4cG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvU2NoZWR1bGVyJztcblxuLyogU3Vic2NyaXB0aW9uICovXG5leHBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL2ludGVybmFsL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9pbnRlcm5hbC9TdWJzY3JpYmVyJztcblxuLyogTm90aWZpY2F0aW9uICovXG5leHBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuL2ludGVybmFsL05vdGlmaWNhdGlvbic7XG5cbi8qIFV0aWxzICovXG5leHBvcnQgeyBwaXBlIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL3BpcGUnO1xuZXhwb3J0IHsgbm9vcCB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9ub29wJztcbmV4cG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL2lkZW50aXR5JztcbmV4cG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9pc09ic2VydmFibGUnO1xuXG4vKiBFcnJvciB0eXBlcyAqL1xuZXhwb3J0IHsgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuZXhwb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9FbXB0eUVycm9yJztcbmV4cG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmV4cG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5leHBvcnQgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvVGltZW91dEVycm9yJztcblxuLyogU3RhdGljIG9ic2VydmFibGUgY3JlYXRpb24gZXhwb3J0cyAqL1xuZXhwb3J0IHsgYmluZENhbGxiYWNrIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmRDYWxsYmFjayc7XG5leHBvcnQgeyBiaW5kTm9kZUNhbGxiYWNrIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmROb2RlQ2FsbGJhY2snO1xuZXhwb3J0IHsgY29tYmluZUxhdGVzdCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0JztcbmV4cG9ydCB7IGNvbmNhdCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb25jYXQnO1xuZXhwb3J0IHsgZGVmZXIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZGVmZXInO1xuZXhwb3J0IHsgZW1wdHkgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZW1wdHknO1xuZXhwb3J0IHsgZm9ya0pvaW4gfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZm9ya0pvaW4nO1xuZXhwb3J0IHsgZnJvbSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tJztcbmV4cG9ydCB7IGZyb21FdmVudCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnQnO1xuZXhwb3J0IHsgZnJvbUV2ZW50UGF0dGVybiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnRQYXR0ZXJuJztcbmV4cG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2dlbmVyYXRlJztcbmV4cG9ydCB7IGlpZiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYnO1xuZXhwb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvaW50ZXJ2YWwnO1xuZXhwb3J0IHsgbWVyZ2UgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvbWVyZ2UnO1xuZXhwb3J0IHsgbmV2ZXIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvbmV2ZXInO1xuZXhwb3J0IHsgb2YgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvb2YnO1xuZXhwb3J0IHsgb25FcnJvclJlc3VtZU5leHQgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvb25FcnJvclJlc3VtZU5leHQnO1xuZXhwb3J0IHsgcGFpcnMgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvcGFpcnMnO1xuZXhwb3J0IHsgcmFjZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9yYWNlJztcbmV4cG9ydCB7IHJhbmdlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlJztcbmV4cG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5leHBvcnQgeyB0aW1lciB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS90aW1lcic7XG5leHBvcnQgeyB1c2luZyB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS91c2luZyc7XG5leHBvcnQgeyB6aXAgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvemlwJztcblxuLyogQ29uc3RhbnRzICovXG5leHBvcnQgeyBFTVBUWSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9lbXB0eSc7XG5leHBvcnQgeyBORVZFUiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9uZXZlcic7XG5cbi8qIFR5cGVzICovXG5leHBvcnQgKiBmcm9tICcuL2ludGVybmFsL3R5cGVzJztcblxuLyogQ29uZmlnICovXG5leHBvcnQgeyBjb25maWcgfSBmcm9tICcuL2ludGVybmFsL2NvbmZpZyc7XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zU2VydmljZSB7XG5cbiAgcHVibGljIHRvcGljOiBTdWJqZWN0PGFueT47XG4gIHB1YmxpYyBvYnNlcnZlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5pdE5vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIMOlwojCncOlwqfCi8OlwozCllxuICAgKi9cbiAgcHVibGljIGluaXROb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy50b3BpYyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IHRoaXMudG9waWMuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogw6jCjsK3w6XCj8KWw6jCp8KCw6XCr8Kfw6jCgMKFXG4gICAqL1xuICBwdWJsaWMgZ2V0Tm90aWZpY2F0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cblxuICAvKipcbiAgICogw6XCj8KRw6XCuMKDXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChkYXRhOiB7XG4gICAgYWN0OiBhbnksXG4gICAgZGF0YT86IGFueVxuICB9KTogdm9pZCB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9waWMubmV4dChkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZ3gtbm90aWZpY2F0aW9ucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHA+XG4gICAgICBuZ3gtbm90aWZpY2F0aW9ucyB3b3JrcyFcbiAgICA8L3A+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX2V4dGVuZHMiLCJvYnNlcnZhYmxlIiwiUmVmQ291bnRTdWJzY3JpYmVyIiwicmVmQ291bnQiLCJpdGVyYXRvciIsIlN5bWJvbF9pdGVyYXRvciIsIlN5bWJvbF9vYnNlcnZhYmxlIiwiSW5qZWN0YWJsZSIsIkNvbXBvbmVudCIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsYUFBZ0IsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsU0FBUyxFQUFFLEtBQUssSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN2QyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7O0lDM0JEOzs7OztJQ0FBO0lBTUE7UUFLUztRQVVQO1lBQ0U7Z0JBQ0U7Z0JBQ0E7Ozs7Ozs7O1lBUUY7Ozs7O0lDM0JKO2dDQUMyQjs7OztJQ0wzQjtBQUNBLGFBR2M7UUFDWixNQUFBO1FBQ0E7O2dCQUVJLE1BQU07Ozs7Ozs7Ozs7SUNUWjs7O0lDQUE7YUFDYyxRQUFROzs7O0lDQXRCOzs7SUNEQTtBQUVBLElBRUEsbUJBQW1COztZQUVmOzs7O1lBR0Esa0JBQWtCOzs7SUFJdEI7cUJBQ3NCO1FBQ3BCLGlCQUFzQjs7OztJQ1B4QjthQUNPO1FBQ0wsS0FBSyxVQUFVO1lBQ1o7WUFFQztRQUNKLElBQUksQ0FBQztRQUNMLFdBQVc7O0lBR2I7SUFNQSxpQ0FBNEQsdUJBQThCLENBQUM7OztJQ3hCM0Y7QUFDQSxRQTJDRTs7WUFWVSxtQkFBNEIsQ0FBQztZQUU3QixvQkFBK0I7WUFFakM7WUFPTixJQUFJO2dCQUNLOzs7OztZQVlULElBQUk7WUFFSixJQUFJO2dCQUNGOzs7WUFLRixJQUFJO1lBQ0osSUFBSSxDQUFDLGNBQWM7WUFDbkIsSUFBSSxDQUFDLGVBQWU7WUFHcEIsSUFBSSxDQUFDO1lBRUwsSUFBSTtZQUNKLElBQUk7WUFJSixPQUFPOztnQkFJTCxPQUFPLGFBQWE7OztnQkFJcEI7Z0JBQ0EsSUFBSSxLQUFLO29CQUNQO29CQUNBLFNBQVM7bURBRXNCLENBQUMsYUFBYTs7OztnQkFPL0MsUUFBUTtnQkFDUjtnQkFFQSxvQkFBb0I7OEJBQ047b0JBQ1osSUFBSTt3QkFDRixTQUFTLEdBQUc7d0JBQ1osSUFBSSxLQUFLLGdCQUFnQjs0QkFDdkI7NEJBQ0EsU0FBUzs0QkFDVCxxQkFBcUIsQ0FBQzs0QkFDdEIsSUFBSSxHQUFHO2dDQUNMLGVBQWU7Ozs7Ozs7Ozs7Z0JBVXZCOzs7OzhCQXVCZ0IseUJBQXlCO2dCQUN6Qzs7O2dCQUlBOzs7WUFLRjs7Ozs7d0JBS00sbUJBQW1COzs7O3dCQUduQjs7Ozt3QkFHQTt3QkFDQSxZQUFZLG1CQUFtQixHQUFHOzs7Ozs7O1lBU3hDO1lBQ0EsYUFBYTtZQUViOzs7cUNBVTJCO1lBQzNCLElBQUksYUFBYTtnQkFDZjtnQkFDQSxJQUFJLGlCQUFpQjtvQkFDbkI7Ozs7OztZQVFKLElBQUksd0JBQXdCO2dCQUcxQixZQUFZOzs7cUJBSVAsV0FBVzs7OzZCQUdILENBQUMsT0FBTyxDQUFDOzs7OztZQXpMeEIsWUFBWTs7Ozs7QUE4TGhCOzs7O0lDck5BOzs4QkFHMEI7VUFLcEIsa0NBQW9DOzs7QUNUMUMsUUFrQm1DLHNDQUFZO1FBeUM3Q0EsNkJBQTJFOztZQWpCMUQsdUJBQXNCLEtBQUs7WUFDM0I7WUFDQSx3QkFBa0I7WUFFekIsd0JBQTJCO1lBRzdCO1lBZU47OztvQkFHSSxNQUFNOzs7d0JBR0osb0JBQW1CO3dCQUNuQixNQUFNOzs7d0JBR047NEJBQ0U7NEJBQ0EsS0FBSSxDQUFDOzRCQUNMLGlCQUFpQjs7Ozs0QkFHakIsS0FBSSxDQUFDLGtCQUFrQjs7Ozs7O29CQU0zQixLQUFJLENBQUMsa0JBQWtCO29CQUN2QixNQUFNOzs7OztRQXJETCxvQkFBUCxpQkFFaUI7NENBQ21CO1lBQ2xDLGdDQUFnQyxNQUFNO1lBQ3RDOzs7aUNBNERxQjtnQkFDbkIsS0FBSyxZQUFZOzs7OztnQkFhakIsS0FBSyxZQUFZO2dCQUNqQixJQUFJLENBQUMsWUFBWTs7Ozs7Z0JBWWpCLEtBQUssWUFBWTtnQkFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRzs7Ozs2QkFLRjtnQkFDZjs7O1lBR0YsaUJBQU07Ozs0QkFJVSxDQUFDLEtBQUs7Ozs0QkFJTixDQUFDLE1BQU0sR0FBRztZQUMxQixJQUFJLENBQUMsV0FBVzs7OzRCQUlBLENBQUM7WUFDakIsSUFBSSxDQUFDLFdBQVc7Ozs7WUFNaEIsSUFBSSxXQUFXO1lBQ2YsSUFBSSxDQUFDLGVBQWU7WUFDcEIsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSSxDQUFDLGNBQWM7WUFDbkIsSUFBSSxDQUFDLFNBQVM7WUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDdkIsSUFBSSxDQUFDO1lBQ0wsSUFBSSxDQUFDLG1CQUFtQjtZQUN4Qjs7Ozs7QUFTSixRQUF1QywwQ0FBYTtRQUlsREEsaUNBQW9EOztZQUFoQyx1QkFBaUI7WUFNbkM7WUFDQSxJQUFJO1lBRUosSUFBSSxVQUFVO2dCQUNaOzs7cUNBRTRDO2dCQUM1QyxzQkFBNkM7Z0JBQzdDLFFBQVE7Z0JBQ1I7b0JBQ0U7b0JBQ0EsdUJBQXVCO3dCQUNyQixVQUFzQixRQUFRLFlBQVk7Ozs7OztZQU9oRCxLQUFJLENBQUMsUUFBUTtZQUNiLEtBQUksQ0FBQztZQUNMLEtBQUksQ0FBQyxTQUFTOzs7O3NCQUlKLGtCQUFrQjtnQkFDbEI7Z0JBQ1IsSUFBSTtvQkFDRjs7O3lCQUVLOzs7OztzQkFNQyxXQUFXO2dCQUNYO2dCQUNBLElBQUE7Z0JBQ1IsSUFBSTtvQkFDRixJQUFJLENBQUM7d0JBQ0g7d0JBQ0EsSUFBSSxDQUFDLGFBQWE7Ozs7d0JBR2xCLElBQUksQ0FBQzs7Ozt5QkFHRjtvQkFDTCxJQUFJO3dCQUNGOzs7Ozs7d0JBS0EsdUNBQXVDO3dCQUN2QyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7WUFVeEIsSUFBSSxLQUFLO2dCQUNDO2dCQUNSLElBQUk7b0JBQ0YsSUFBTTtvQkFFTixJQUFJLDZDQUE2Qzt3QkFDL0M7d0JBQ0EsSUFBSSxDQUFDLGFBQWE7Ozs7d0JBR2xCLElBQUksQ0FBQzs7Ozs7Ozs7OztnQkFVVDs7OztnQkFHQSxJQUFJO29CQUNGLE1BQU07Ozs7Ozs7O3VCQVFDLHNDQUFzQztnQkFDL0M7OztnQkFHQTs7OztvQkFHRSxNQUFNLENBQUM7b0JBQ1AsTUFBTSxDQUFDO29CQUNQLE9BQU87Ozs7b0JBR1A7Ozs7Ozs7WUFTSixJQUFJLGlCQUFpQjtZQUNyQixJQUFJLENBQUM7WUFDTCw2QkFBNkI7Ozs7OztJQ2hUakM7QUFTQTs7WUFHSSxJQUFJLHVCQUFxQjtnQkFDdkIsWUFBWTs7Ozs7Ozs7Ozs7OztJQ2JsQjtBQUNBO1lBVUk7Z0JBQ0U7OztnQkFJQTs7OztZQUtGOzs7Ozs7SUNUSjs7O0lDWEE7OztJQ0RBO0FBaUJBO1lBT0k7OztZQUlBLFVBQVU7Ozs2QkFJTyxDQUFDOzs7OztJQzVCdEI7QUFDQSxRQStCRTs7WUFDRSxJQUFJO2dCQUNGOzs7OzZCQTJCaUIsSUFBSSxhQUFnQjtZQUN2QyxvQkFBaUI7WUFDakJDLGFBQVUsQ0FBQztZQUNYQTs7O3lDQStIMEI7WUFDMUIsSUFBTTtZQUVOLElBQUk7Z0JBQ0YsUUFBUTs7OztvQkFJTixJQUFJLENBQUMsV0FBVyxLQUFLO29CQUNyQixJQUFJLENBQUM7OztnQkFLUDtvQkFDRSxJQUFJLENBQUMsa0JBQWtCO29CQUN2QixJQUFJLHNCQUFzQjt3QkFDeEI7Ozs7Ozs7O2dCQVdKOzs7O29CQUdFO29CQUNBLElBQUksQ0FBQzs7O29CQUdMLGNBQWMsQ0FBQzs7Ozs7Ozs7NkJBZ0NwQjtZQWpCQztZQUVBLFdBQVcsNkJBQTBCLEVBQUU7O2dCQUlyQzs7d0JBRUk7Ozs4QkFFTTt3QkFDTjs0QkFDRSxZQUFZOzs7Ozs7OztZQVVwQixhQUFhLElBQUksT0FBTzs7O21CQXNCakI7Ozs7NkJBb0NKOzs7O2dCQUVELFdBQWtCOzs7Ozs2QkFtQnJCO1lBTkM7WUFFQSxXQUFXLDZCQUFvQixFQUFFOztnQkFFL0I7Ozs7bUJBbFNLOzs7OztBQThTWCxhQUNPO1lBQ0gsY0FBYzs7O1lBSWQ7Ozs7OztJQ25XSjthQUNPO1FBQ0wsS0FBSyxVQUFVO1FBQ2YsSUFBSSxDQUFDLE9BQU8seUJBQXlCO1FBQ3JDLFlBQVk7O0lBR2Q7SUFXQSxxQ0FBb0U7Ozs7QUN2QnBFLFFBTzRDLCtDQUFZO1FBR3RERDs7WUFBbUIsdUJBQU8sQ0FBWTtZQUFTLGdCQUFVO1lBRnpEOzs7OzJCQU9pQjtnQkFDYjs7O1lBS0YsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQU07WUFFTixJQUFJO1lBRUosSUFBSSxDQUFDO2dCQUNIOzs7WUFLRixJQUFJLGVBQWU7Z0JBQ2pCOzs7Ozs7OztBQ2xDTixRQVcwQyw2Q0FBYTtRQUNyREE7O1lBQXNCOzs7Ozs7QUFjeEIsUUFBZ0MsbUNBQWE7UUFnQjNDQTt3QkFDRTtZQVhGLGtCQUEyQjtZQUUzQixlQUFTLEtBQUssQ0FBQztZQUVmLGVBQVM7WUFFVCx1QkFBaUI7WUFFakIsaUJBQVc7Ozs7dUNBWHdCOzs7Z0JBdUIzQixVQUFVLElBQUkscUJBQXFCO1lBQ3pDO1lBQ0EsT0FBWTs7O2dCQUlSO2dCQUNGOzs7Z0JBR1E7Z0JBQ1IsSUFBTSxnQkFBZ0I7Z0JBQ3RCLElBQU0sZ0JBQWdCLE1BQU07Z0JBQzVCLG9CQUFvQixNQUFNLEVBQUU7eUJBQ3JCLENBQUMsTUFBTSxDQUFDLE1BQU07Ozs7O2dCQU1uQjtnQkFDRjs7O1lBR0YsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSSxDQUFDLGlCQUFpQjtZQUNkLElBQUE7WUFDUixJQUFNLGdCQUFnQjtZQUN0QixJQUFNLGdCQUFnQixNQUFNO1lBQzVCLG9CQUFvQixNQUFNLEVBQUU7cUJBQ3JCLENBQUMsT0FBTyxNQUFNOzs7OztnQkFNakI7Z0JBQ0Y7OztZQUdNLElBQUE7WUFDUixJQUFNLGdCQUFnQjtZQUN0QixJQUFNLGdCQUFnQixNQUFNO1lBQzVCLG9CQUFvQixNQUFNLEVBQUU7cUJBQ3JCLENBQUMsVUFBVSxHQUFHOzs7OztnQkFNakIsVUFBVTtZQUNkLElBQUksQ0FBQyxTQUFTO1lBQ2QsSUFBSSxDQUFDLFNBQVM7OztnQkFLVjtnQkFDRjs7Ozs7OztnQkFRRTtnQkFDRjs7OzBCQUVVO2dCQUNWOzs7MEJBRVUsU0FBUyxFQUFFO2dCQUNyQixtQkFBbUI7Ozs7Z0JBR25CLDhCQUE4QixDQUFDOzs7O2dCQVczQixVQUFVO1lBQ1YsaUJBQWtCO1lBQ3hCLGlCQUFpQjs7Ozs7Ozs7QUFPckIsUUFBeUMsNENBQVU7UUFDakRBOztZQUFzQjtZQUVwQixLQUFJLENBQUM7Ozs7O1lBS0wsSUFBSSxXQUFXLG9CQUFvQjtnQkFDakMsV0FBVzs7Ozs7WUFNYixJQUFJLFdBQVc7Z0JBQ2IsMEJBQTBCLENBQUM7Ozs7OENBS1Y7WUFDbkIsSUFBSSxXQUFXO2dCQUNiLDJCQUEyQjs7Ozs7WUFPN0IsSUFBSSxNQUFNO2dCQUNSOzs7Ozs7Ozs7OztBQ25MTjs7OztJQVlBO1FBQ0U7Ozs7O1lBS1MsdUJBQXdCO1lBRS9CLHFCQUF1QjtZQUN2QixJQUFNO1lBRU4sSUFBSSxZQUFZO2dCQUNQLFdBQVk7Ozs7OztJQU96QjtRQUFvQyw4Q0FBYTtRQUkvQ0E7O1lBQ29COzs7OztZQU9sQixJQUFJLGNBQWM7Z0JBQ2hCO2dCQUNBOzs7WUFJRixJQUFNO1lBQ04sSUFBSSxRQUFRO2dCQUNWLGVBQWU7Z0JBQ2Y7OztZQUlGLFlBQVk7Z0JBQ1Y7Z0JBQ0E7OztZQTRCRixJQUFNO1lBQ04sSUFBSSxtQkFBbUI7WUFFdkIsSUFBSTtnQkFDRixnQkFBZ0I7Ozs7Ozs7O0FDM0Z0QixRQVc4QyxpREFBYTtRQVF6REEsK0JBQ3NCOztZQURILFlBQU07WUFDSDtZQU5aLG9CQUFzQjtZQUdoQyxvQkFBYzs7Ozs7Ozs4QkFhUSxTQUFTLENBQUM7WUFDOUIsSUFBSTtnQkFDRixvQkFBb0I7Ozs7OzZCQU1MO1lBQ2pCLElBQUksYUFBYTtnQkFDZjtnQkFDQTtnQkFDQSxVQUFVOzhCQUNFLENBQUMsSUFBSTs4QkFDSCxDQUFDO29CQUNiLG1CQUFtQjtvQkFDbkI7Ozs7Ozs7Ozt3Q0FTd0I7Ozs7O0FBSWhDLFFBY3VDLGlEQUFvQjtRQUN6REE7K0RBR0M7WUFGbUI7Ozs7NkJBSUQ7WUFDakIsaUJBQU07Ozs2QkFHVyxXQUFXO1lBQzVCLElBQUksQ0FBQyxZQUFZO1lBQ2pCLGlCQUFNOzs7OEJBR21CO1lBQ3pCLElBQUksV0FBVztnQkFDYjtnQkFDQSxJQUFNO2dCQUNOO2dCQUNBLFdBQVcsQ0FBQztnQkFDWixXQUFXLENBQUMsV0FBVztnQkFDdkI7b0JBQ0UsVUFBVTs7Ozs7O0lBTWxCO1FBbUJvQ0UsZ0RBQWE7UUFJL0NGOztZQUNvQjs7Ozs7WUFPbEIsSUFBSSxjQUFjO2dCQUNoQjtnQkFDQTs7O1lBSUYsSUFBTTtZQUNOLElBQUlHLFdBQVE7Z0JBQ1ZBLGtCQUFlO2dCQUNmOzs7WUFJRixZQUFZO2dCQUNWQTtnQkFDQTs7O1lBMkJGLElBQU07WUFDTixJQUFJLG1CQUFtQjtZQUV2QixJQUFJO2dCQUNGLGdCQUFnQjs7Ozs7Ozs7QUNuTHRCLFFBeUl5Qyw2Q0FBYTtRQUtwREg7O1lBQ29CO1lBQ0E7WUFDQTtZQUNBO1lBUlo7WUFDRDtZQUNBOzs7OztZQVlMLElBQUk7Z0JBQ0Y7Ozs7Z0JBR0E7Ozs7O3lCQU9XLFdBQVc7WUFFeEIsSUFBSSxTQUFTO2dCQUNYLFNBQVM7OztZQUtYLElBQUksUUFBVztZQUNmLElBQUk7Z0JBQ0YsSUFBSTtvQkFDRjs7Ozs7Ozs7OztnQkFTRixRQUFRO2dCQUNSLGNBQWM7Z0JBQ2QscUJBQXVCO2dCQUN2QixJQUFJLGlCQUFpQjtnQkFDckIsSUFBSTtvQkFDRixJQUFJLGlCQUFhO29CQUNqQixJQUFJO3dCQUNGOzs7O3dCQUdBOzs7Ozs7Z0JBT0osTUFBTTs7Ozt5QkFLTyxXQUFXO1lBQzFCLElBQUksTUFBTTtnQkFDUixNQUFNOytCQUNPOzs7Ozs7O3lCQVNBLFdBQVc7WUFDMUIsSUFBSSxNQUFNO2dCQUNSLE1BQU07Ozs7Ozs7O21DQVVlLENBQUM7Ozs7Z0JBS3RCLEtBQUs7Z0JBQ0wsSUFBSTtvQkFDRjs7Ozs7O0lBV1I7UUFBNEMsbURBQWE7UUFDdkRBLG1DQUNxQyxRQUN5Qjs7WUFGMUMsU0FBRyxHQUFIO1lBQ0E7WUFDQTs7Ozs7Ozs7WUFXbEIsSUFBSSxXQUFXO1lBQ2YsSUFBSTtnQkFDRixNQUFNOzs7OztJQWFaO1FBQTZDLDZDQUFhO1FBRXhEQSxvQ0FDNEM7O1lBRHpCLFNBQUcsR0FBSDtZQUNDO1lBQ0E7Ozs7bUNBTU8sY0FBYztZQUNqQyxJQUFBO1lBQ04sSUFBSTtnQkFDRiw4Q0FBOEM7OztZQUdoRDs7Ozs7QUFTSixRQUF3QyxxREFBWTtRQUNsREE7O1lBQW9CLFlBQU07WUFFeEIsTUFBTSxNQUFNLEdBQUc7Ozs7O1lBS2YsSUFBSSxjQUFjO2dCQUNoQjtnQkFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUNqQixnQkFBZ0I7b0JBQ2QsTUFBTSxDQUFDLFdBQVc7Ozs7Ozs7OztBQ3pUMUIsUUFZd0MsMkNBQVU7UUFFaERBOztZQUFvQixZQUFNOzs7Ozs7Ozs7Ozs7WUFXeEIsSUFBSSxZQUFZO2dCQUNkLGdCQUFnQixhQUFhOzs7Ozs7Z0JBTzdCOzs7MEJBRVU7Ozs7Ozs7aUNBT0YsdUJBQVk7Ozs7Ozs7QUN6QzFCLFFBaUIrQixrQ0FBWTtRQUN6Q0E7Ozs7b0NBYTJCO1lBQ3pCOzs7Ozs7Ozs7QUNqQ0osUUFVb0MsdUNBQVM7UUFPM0NBOztZQUFzQixrQkFBQSxVQUF5QjtZQUN6QixrQkFBbUQ7WUFIL0QsYUFBTzs7Ozs7WUFTZixJQUFJLEtBQUs7Z0JBQ1A7YUFDRDtZQUdELElBQUk7Z0JBRUUsWUFBWTs7WUF3QmxCLElBQUksTUFBTTtnQkFDUixLQUFLLEtBQUs7O1lBS1osSUFBSTtnQkFFQSxjQUFjLENBQUM7O1lBSW5CLFlBQVk7O29FQUdzQztZQUFVOztRQUU5RDs7Ozs7OzZCQVNtQixDQUFDOzs7O2dCQVVoQiwrQ0FBK0M7OztZQUlqRCxnQkFBa0IsQ0FBQzs7NkJBRUo7O2lDQUNRLCtCQUErQjs7Ozs7Z0JBbUJsRCxPQUFPOzs7Z0JBR1QsSUFBSSxDQUFDLEtBQUssS0FBSzthQUNoQjs7OEJBQ2U7Z0JBQ2QsVUFBVSxLQUFLLENBQUM7O1lBRWxCLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFdBQVc7Ozs7NkNBTXBCOztZQUdFLElBQU0sU0FBUztnQkFDVCxtQkFBbUI7Z0JBQ25COzs7O1lBS04sSUFBSSxVQUFVLEdBQUc7WUFFakIsSUFBSSxZQUFZO2dCQUNkLE9BQU8sYUFBYTs7WUFHdEIsSUFBSSxZQUFZO2dCQUNkLGNBQWM7O1lBR2hCLElBQUksQ0FBQyxZQUFZOzs7Ozs7Ozs7Ozs7O0FDeEpyQixRQVVvQyx1Q0FBYztRQUVoREE7O1lBQXNCLGtCQUFBLFVBQXlCO1lBQ3pCLGtCQUFtRDs7Ozs7WUFLdkUsSUFBSSxLQUFLO2dCQUNQO2FBQ0Q7WUFDRCxJQUFJLFNBQVM7Z0JBQ1QsY0FBYzs7WUFFbEI7O3FDQUdZO1lBQ1osT0FBTzs7b0JBRUQsU0FBUyxDQUFDLE9BQU87O3lEQUdBOzs7a0VBS08sV0FBVzs7Ozs7Ozs7Ozs7O0lDZjdDO1FBU0UsbUJBQW9CLGVBQThCLEVBQ3RDLEdBQWlDO1lBQWpDLG9CQUFBO2dDQUR1QixHQUFmOzs7OzsyQkFpQ0gsQ0FBQywyQkFBOEI7O3FCQW5DL0IsR0FBaUI7Ozs7Ozs7OztBQzlCcEMsUUFNb0MsMENBQVM7UUFtQjNDQSxpQ0FDWTtnQ0FBQSxpQkFBNkI7WUFEekMsWUFFRTtnQkFDRSxtQkFBbUI7Ozs7b0JBR2pCLE9BQU87aUJBQ1I7OzhCQXhCdUM7Ozs7OztZQTRCNEI7O3VCQUU3RCxxQ0FBcUMsT0FBTzs7Ozs7Ozs7Z0JBVWpELGFBQWE7Ozs7WUFLakIsSUFBSTtZQUNKLElBQUk7O2dCQUdGOzs7OEJBR2dCO1lBRWxCO2dCQUVJOzs7O2dCQUlGOzs7Ozs7Ozs7Ozs7QUNwRU4sUUFFb0MsMENBQWM7UUFBbERBOzs7Ozs7O0lDRkE7QUFDQTs7SUNEQTtBQU9BLGFBbURnQjtvQkFDRyxDQUFDOztJQUdwQjs7Ozs7SUM1REE7YUFDYyxXQUFpQixNQUFPOzs7O0lDR3RDO3FDQUNzQzttQ0FDWDs7Z0NBRUQ7Ozs7Ozs7O0lDVjFCO0FBRUE7WUFLSTs7Ozt1QkFHVyxxQkFBcUI7Z0JBQzlCLElBQUksTUFBTTtnQkFDVixJQUFJLElBQUk7b0JBQ04sSUFBSSxrQkFBa0I7d0JBQ3BCLFdBQVc7d0JBQ1g7OztvQkFHRixlQUFlLENBQUMsTUFBTTt3QkFDcEIsWUFBWTs7Ozs7Ozs7O0lDbkJ0QjtBQUVBO1lBRUksdUJBQXVCO1lBQ3ZCLFVBQVUsQ0FBQyxVQUFVLENBQUM7OztRQUd2QixNQUFjLENBQUM7UUFDaEIsT0FBTzs7OztJQ1JUO0FBQ0EsZUF3RXVEOzs7OztRQUVyRCxJQUFJLFlBQVksU0FBUyxDQUFDO1lBQ3hCLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7SUM3RWY7QUFvRUE7WUFFSTs7Ozs7O0lBV0o7O1FBQ0Usc0JBQXNCOzs7O0lDaEZ4QjtBQUNBLFFBb0JFOzZCQUErQjtZQUFTO1lBQWtCLFVBQUssR0FBTCxLQUFLLENBQU07WUFDbkUsSUFBSSxDQUFDLFFBQVE7OztvQkFTTCxXQUFXO3dCQUNUOzs7Ozs7Ozs7b0JBa0JBLGFBQWE7WUFDdkIsUUFBUTt3QkFDRTs7Ozs7Ozs7OzhCQW1CUTtnQkFDaEI7Ozs7Ozs7b0JBWVE7WUFDVixRQUFRO3dCQUNFOzs7Ozs7Ozs7OzRDQXNCc0I7Z0JBQzlCLE9BQU87Ozs7O21DQWNjOzs7Ozs7UUExQlYsMERBQWdFO1FBcUNqRjs7Ozs7QUN0SUEsMkJBbUYrQjtrQkFDVDs7Ozs7WUFObEIsWUFBWTtZQUNaLEtBQUssYUFBYTs7OzsyQkFXSCxDQUFDLHdCQUNkOzs4Q0FNSjtZQUNFLElBQUksQ0FBQztTQUNOO1FBRVM7WUFDUixJQUFJLDhCQUE4QjtZQUNsQyxnQkFBZ0I7U0FDakI7UUFFUztZQUNSLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O1FBRXREOztnQkFuQ29EOzs7OENBdUNGO1lBQS9COztRQUVuQjs7QUFDRjs7Ozs7Ozs7O0FDdEhBLFFBZXNDLHlDQUFVO1FBTTlDQSx5QkFBeUQ7eUNBQTdDO1lBQ0EsMkJBQUE7OztZQU5KLG1CQUFxQzs7O1lBVTNDLGlDQUFnQyxJQUFJLENBQUM7WUFFckM7Ozs7aUJBR087Z0JBQ0wsVUFBUzs7Ozs7Z0JBS0wsVUFBVTs7WUFJaEIsWUFBWTs7O1lBSVo7O2lEQUdGO2dCQUNNLFFBQVEsS0FBSzs7WUFHakIsaUJBQU0sSUFBSSxZQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25CO1FBR0Q7WUFFRSxJQUFNLDhDQUE4QztZQUNwRCxJQUFNO1lBQ04sZ0JBQWtCLEtBQUssVUFBVTs7O1lBSWpDLElBQUk7Z0JBQ0YsVUFBVSwwQkFBMEI7OztnQkFFcEMsWUFBWTs7OzttQ0FHTyxtQkFBbUI7Ozs7O2dCQU9wQyxtQkFBbUI7Ozs7YUFJdEI7O2dCQUNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFrQixPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7aUJBQzlDO2FBQ0Y7O2dCQUdDLFVBQVUsTUFBTSxDQUFDOztpQkFDWjs7O2dDQUlhOzs7c0NBSU07Ozs7O1lBTTFCLHNCQUF3Qjs7O1lBSXhCLElBQUksV0FBVztZQUtmLGtCQUFrQixnQkFBZ0I7Z0JBQ2hDLFdBQVcsT0FBTyxDQUFDLFdBQVcsQ0FBQzswQkFDdkI7O2dCQUVSLFdBQVcsR0FBRzs7Z0JBR1osV0FBVzs7O2dCQUlYLFdBQVcsR0FBRzs7OzJCQUlIOzs7Z0JBR2xCOzs7OzRCQUd3QixDQUFROztRQUVqQzs7Ozs7Ozs7O0FDdklBLFFBVXFDLHdDQUFVO1FBQS9DQTs7WUFDVSxrQkFBZTtZQUNmO1lBQ0EscUJBQXdCOzs7O29CQUl0QixDQUFDLFVBQVU7Z0JBQ2pCO2dCQUNBOzs7MEJBRVUsZ0JBQWdCO2dCQUMxQixVQUFVLENBQUMsVUFBVTtnQkFDckIsbUJBQW1COzs7OztxQkFNWjtnQkFDUCxLQUFLLGFBQWE7Z0JBQ2xCLElBQUksQ0FBQyxjQUFjOzs7O3FCQUtaLGVBQWU7Z0JBQ3RCOzs7OztZQU1GLElBQUk7Z0JBQ0Y7Ozs7Ozs7O0lDNUNOO0lBRUEsSUFBTSxhQUFhO0lBRW5CLHNCQUFzQjs7UUFFcEIsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFOzs7SUFJUjs7c0JBRWdCO1lBQ1osYUFBYSxhQUFhO1lBQzFCO1lBQ0EsT0FBTzs7O3dDQUlxQjs7Ozs7O0FDcEJoQyxRQVNtQyxzQ0FBYztRQUUvQ0E7O1lBQXNCLGtCQUFBLFVBQXdCO1lBQ3hCLGtCQUFtRDs7Ozs7WUFNdkUsSUFBSSxLQUFLLEtBQUssUUFBUTtnQkFDcEI7YUFDRDtZQUVELFNBQVMsU0FBUyxJQUFJLEtBQUs7NkJBSVYsOENBQThDLFlBQVksQ0FDekU7OztZQUd5RDs7OztnQkFVdkQsU0FBUyxDQUFDOztnQkFFWixtQkFBbUI7Ozs7eUJBS3hCOzs7Ozs7Ozs7QUM5Q0QsUUFFbUMseUNBQWM7UUFBakRBOzs7OytCQUd1QjtZQUNuQixJQUFJLENBQUMsU0FBUztZQUVQLElBQUEsc0JBQU8sQ0FBUztZQUN2QixJQUFJO1lBQ0osSUFBSSxLQUFLO1lBQ1QsSUFBSSxLQUFLLEdBQVc7WUFDcEIsU0FBUyxVQUFVLE9BQU8sQ0FBQztZQUUzQjs7b0JBRUk7Ozt1QkFJTyxRQUFRO1lBRW5CLElBQUksT0FBTztnQkFDVCxPQUFPO3NDQUNhOzs7Ozs7Ozs7SUN6QjFCO0FBQ0E7O0lDREE7QUFDQTs7O0FDREEsUUFTNkMsZ0RBQWM7UUFFekRBO3FEQUVtQjtZQUZHLGtCQUFBLFVBQWtDO1lBQ2xDLGtCQUFtRDs7Ozs7WUFNdkUsSUFBSSxLQUFLLEtBQUssUUFBUTtnQkFDcEI7YUFDRDtZQUVELFNBQVMsU0FBUyxJQUFJLEtBQUs7NkJBSVYseURBQXlELENBQ3hFOzs7WUFFbUU7O2tFQUt2QyxTQUFTLEVBQUUsRUFBRSxFQUFFLEtBQUs7O2dCQUs5QyxTQUFTLENBQUM7O2dCQUVaLG1CQUFtQjs7Ozs7Ozs7Ozs7OztBQ3hDekIsUUFFNkMsbURBQWM7UUFBM0RBOzs7OytCQUd1QjtZQUNuQixJQUFJLENBQUMsU0FBUztZQUVQLElBQUEsc0JBQU8sQ0FBUztZQUN2QixJQUFJO1lBQ0osSUFBSSxLQUFLO1lBQ1QsSUFBSSxLQUFLLEdBQVc7WUFDcEIsU0FBUyxVQUFVLE9BQU8sQ0FBQztZQUUzQjs7b0JBRUk7Ozt1QkFJTyxRQUFRO1lBRW5CLElBQUksT0FBTztnQkFDVCxPQUFPO3NDQUNhOzs7Ozs7Ozs7SUN6QjFCO0FBQ0E7OztBQ0RBLFFBSzBDLGdEQUFjO1FBT3REQSx1Q0FDbUI7Z0VBRCtCO1lBQy9COzs7WUFKWjs0QkFDa0I7Ozs7WUFjakIsZUFBQztZQUNQLFdBQWdCLE1BQXdCO1lBRXhDLE9BQU87Ozs7O1lBTVA7Z0JBQ0UsaUNBQWlDO29CQUMvQixNQUFNO2lCQUNQOzs7Ozs7O2FBL0JNOztRQXlDeUIseUNBQWM7UUFJbEQ7O3VDQUErQjtpQkFDVDsrQkFDSztZQUpqQixtQkFBc0IsQ0FBQzs0Q0FNQTs7O3dDQUdsQjtZQUFZO1lBQ3pCLEtBQUssU0FBUzs7O1lBR2Q7O3FCQU1TO1lBQ1QsY0FBYyxRQUFROzs7WUFHNEM7Z0JBQzlELHdCQUF3QixRQUFRLENBQUM7O1lBRXJDLG1CQUFtQjtZQUNsQixhQUF5QztZQUMxQzs7OztZQUlBOzs7WUFJQSxJQUFJO2dCQUNGLE9BQU87Ozs7O3FCQU1GLENBQUMsVUFBVTs7Ozs0QkFHTixDQUFDOztxQkFDSjtvQkFDTCxPQUFPOzthQUVWOzs7Ozs7Ozs0QkFNSjtpQkExRGdEOzs7Ozs7Ozs7Ozs7Ozs7SUM5Q2pEOztJQ0FBOztJQ09BOztJQ0FBOztJQ0FBOzs7QUNOQSxRQStEa0MseUNBQWE7UUFJN0NBOzBDQUdRLFdBQVc7WUFGQyx1QkFBTyxDQUFnQztZQUozRCxnQkFBa0I7WUFPaEIsS0FBSSxDQUFDLFVBQVU7Ozs7c0JBTUE7WUFDZixJQUFJO2dCQUNGOzs7O2dCQUdBOzs7Ozs7OztJQ2xGTjs7SUNEQTs7O0FDQUEsUUFRMkMsMkNBQWE7UUFBeERBOzs7O2lDQUl5QixDQUFDLFVBQVU7OztrQ0FJVjs7Ozs7Ozs7OztBQ2hCMUIsUUFRMkMsMkNBQWE7UUFHdERBLHlCQUEwRCxVQUFhO3lDQUM5RDtZQURXLFlBQU07WUFBZ0M7WUFBc0IsZ0JBQVUsR0FBVixVQUFVLENBQVE7WUFGMUYsZ0JBQVU7Ozs7dUJBT0wsQ0FBQyxVQUFVLEtBQUssYUFBYSxLQUFLOzs7dUJBSWxDLENBQUMsbUJBQW1CO1lBQy9CLElBQUksQ0FBQzs7O3VCQUlNLENBQUMsbUJBQW1CO1lBQy9CLElBQUksQ0FBQzs7Ozs7O0lDekJUO0FBRUEsUUFDUyxxQkFDQzs7O2dCQUdGLHNCQUFzQjs7O2lCQUt2QjtlQUNFLFVBQVU7Ozs7OztJQ2RuQjs7WUFFSSxPQUFPOzs7O0lBTVg7QUFLQSxJQUFPLElBQU07O0lDWmI7QUFFQSx3Q0FDMkM7UUFDekM7WUFDRSxJQUFNSSx1QkFBb0JDO1lBQzFCO2dCQUNFLFdBQVdELFdBQVE7Z0JBQ25COzs7O2dCQUlBOzs7OzJCQU1hO2dCQUNiOzs7Ozs7Ozs7OztJQ25CTjtBQU9BLFFBQ1csd0JBQXdCO1FBQ2pDO1lBRUUsVUFBVTs7Ozs7Ozs7OztJQ1pkOzs7SUNBQTthQUNjOzs7O0lDRGQ7QUFFQTtZQWFJOztvQkFFSSxnQkFBaUI7b0JBQ2pCLFVBQVUsQ0FBQyxXQUFXO29CQUN0Qjs7Ozs7Ozs7d0NBTXdCLENBQUNFOzs7bUNBRU4sQ0FBQzs7Ozs7Ozs7OztZQU94QixJQUFNLHdCQUFzQjs7a0JBRXRCOzs7OztJQ2xDVjtBQUdBLCtCQWNFLGlEQUFrRTtRQUVsRSxJQUFJLFdBQVc7WUFDYjtTQUNEO1FBQ0Q7Ozs7Ozs7QUN0QkYsSUE0SkE7UUFzQ21ELG1EQUFxQjtRQU10RU47c0RBQ29CO1lBRDRCLHVCQUFBO1lBTHhDO1lBQ0EsWUFBTSxHQUFVLEVBQUU7WUFDbEIsaUJBQVc7Ozs7O1lBU2pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDOzs7O1lBS3RCLElBQU0sa0JBQWtCO1lBQ3hCLElBQUksR0FBRztnQkFDTDs7OztnQkFHQSxJQUFJLENBQUMsU0FBUyxHQUFHO2dCQUNqQixLQUFLLFNBQVMsR0FBRyxHQUFHOztvQkFFbEIsSUFBSSwyQkFBMkI7Ozs7O2dDQU1mLFVBQVU7Z0JBQzVCLEtBQUssV0FBVyxDQUFDOzs7OztZQVFuQixJQUFNLE1BQU0sR0FBRztZQUNmLElBQU0sU0FBUyxrQkFBa0I7Z0JBQy9CO2tCQUNFO2tCQUNFLFdBQVcsSUFBSSxVQUFVO1lBRS9CLGtCQUFrQixHQUFHO2dCQUNuQixTQUFTO29CQUNQLElBQUksQ0FBQzs7Ozs7Ozs7O1lBU1QsSUFBSTtnQkFDRjs7OztnQkFHQTs7Ozs7Ozs7SUNoUU47O0lDREE7O0lDQUE7O0lDQUE7O0lDQUE7O0lDQUE7OztBQ0lBOzs7WUF5R1U7NkJBQ21COzs7OzBDQVNaO1lBQ2Isa0JBQWtCOzZCQUNILENBQUM7O2lCQUNUOzs7UUFHVDs2Q0FFa0I7Z0JBQ1o7OztnQkFHRixzQkFBc0I7YUFDdkI7OztnQkFFQyxPQUFPOztZQUVULElBQUk7Z0JBQ0E7OztnQkFJRSxzQkFBc0I7Z0JBQ3RCOztZQUVOOzs7b0NBSXdCLENBQUM7WUFDekIsSUFBSSw0Q0FBNEM7Z0JBQzlDOztZQUVGLGtCQUFrQjtTQUNuQjtRQUVEO1lBR0UsSUFBSSxDQUFDLFlBQVk7Ozs7WUFLakIsSUFBSSxDQUFDOzs7Z0JBR0gsaUJBQWlCLENBQUM7OzBCQUNKLFdBQVc7Z0JBQ3pCOzs7aUNBR0w7cUJBaEU0RDs7Ozs7Ozs7O0lDMUc3RDs7SUNBQTs7SUNDQTs7SUNGQTs7O0FDQUEsUUFpTHVDLDhDQUFxQjtRQUsxREE7O1lBQ29CLHVCQUFPLENBQTJCO1lBTDlDO1lBRUEsbUJBQWEsQ0FBQztZQU1wQjtZQUNBLHdCQUF1QixDQUFDO1lBRXhCLEtBQUssb0JBQW9CLEdBQUcsRUFBRTswQkFDaEIsR0FBRyxRQUFRLENBQUMsRUFBRTtnQkFDMUIsSUFBTSxpQkFBaUIsR0FBRztnQkFFMUIsSUFBSSxpQkFBaUI7b0JBQ25COzs7Ozs7O1lBU0osSUFBSSxDQUFFLGtCQUEwQjtnQkFDN0IsU0FBaUIsWUFBWTtnQkFDOUIsa0JBQWtCOzs7OzJCQUtaO1lBQ1IsSUFBTTtZQUVOLElBQUksbUJBQTRCO2dCQUM5QjtnQkFDQTs7O1lBS0YsSUFBSTtnQkFDRjs7O2dCQUlBOzs7Ozs7OztJQ2pPTjs7SUNBQTs7SUNBQTs7SUNDQTs7SUNEQTs7SUNBQTs7SUNBQTs7SUNBQTs7SUNBQTs7SUNBQTs7O0FDQ0EsUUFnRXVDLDBDQUFxQjtRQUsxREE7O1lBSlEsdUJBQTBCO1lBQzFCLGlCQUFXLEtBQXdCLENBQUM7WUFDcEMsc0JBQWdDOzs7O2lDQU9qQjs7OztZQUtyQixJQUFNLGtCQUFrQjtZQUV4QixJQUFJLEdBQUc7Z0JBQ0w7Ozs7Z0RBRzhCLENBQUM7b0JBQzdCLElBQUk7b0JBRUosSUFBSTt3QkFDRixJQUFJLENBQUMsYUFBYTs7Ozs7Ozs7c0JBV2QsVUFBVTtnQkFDbEIsS0FBSyxXQUFXO2dCQUVoQixLQUFLLFFBQVEsR0FBRyxJQUFJO3lCQUNiLEtBQUssVUFBVTt3QkFDbEIsZ0JBQWdCO3dCQUVoQix3QkFBd0I7d0JBQ3hCLFlBQVksWUFBWSxFQUFFOzs7Ozs7Ozs7OztJQzVHcEM7O0lDREE7O0lDQUE7OztBQ0NBLFFBbUd5Qyx5Q0FBYTtRQU1wREE7NERBRXdDO1lBRnhDO2dDQUhnRDs7WUFPOUMsdUJBQXNCLENBQUMsMEJBQTBCO1lBQ2pELEtBQUksQ0FBQyxTQUFTLE1BQU07Ozs7WUFJcEIsYUFBZTs7K0JBRUUsd0JBQXdCOzs7Z0JBRXZDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0I7YUFDeEM7aUJBQU07Z0JBQ0wsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLDZCQUFvQyxJQUFJLEVBQUU7YUFDOUQ7Ozs7OytCQU9rQjtZQUVuQixJQUFJLFNBQVM7Z0JBQ1gsZ0JBQWdCO2dCQUNoQjs7Z0JBR0U7OztnQkFHRixhQUFhO21DQUNNLEdBQUcsSUFBSTtvQkFDeEJJLGNBQVcsYUFBYTs7O29CQUV4QixXQUFXO2lCQUNaOzs7Ozs7cUJBT0ksV0FBVzs7Ozs7OzhDQU9rQjtZQUdwQyxhQUFhLEdBQUcsSUFBSSxVQUFVO2dCQUM1QixlQUFlO2dCQUNmLFdBQVcsUUFBUTs7Ozs7OztnQkFRbkI7Z0JBQ0EsSUFBSSxNQUFNOzRCQUlFLENBQUM7b0JBQ1hBLHdCQUFxQixDQUFDOztnQkFHeEIsSUFBSUE7b0JBQ0Ysc0JBQXNCOzs7b0JBSXBCLFlBQVksUUFBUTs7O2dCQUl4QixJQUFJLENBQUMsa0JBQWtCLENBQUM7YUFDekI7O2dCQUNDLHVCQUF1QjthQUN4Qjs7Z0JBR0MsV0FBVyxDQUFDLFVBQVUsQ0FBQzthQUN4Qjs7Ozs7c0JBTU8sNEJBQTRCLGFBQWE7O1lBQy9DO2dCQUNBLDRCQUE0Qjs7O2dCQUcxQixpQkFBaUIsU0FBUzs7O2dCQTNHaUI7Ozs7O1FBeUhqRDs7WUFHRTtTQUNEO1FBRUQ7WUFDRTs7OztnREFLRjtZQUNFLGNBQWdCOztRQUVsQjs2QkFDRDs7O1FBTUM7OzJCQUhrQjs7WUFJaEIsSUFBSSxDQUFDLGNBQWM7OztZQUluQixXQUFXO1NBQ1o7UUFFRDtZQUNFLFlBQWM7OzJCQUVDLENBQUMsU0FBUyx1QkFBdUI7OztZQUloRCxPQUFPLElBQUksZ0JBQWdCLEtBQUs7U0FDakM7UUFFRDtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1NBQ3pCO1FBQ0g7OztRQU9zQztRQUtwQztxREFHbUI7OztZQVBuQix1QkFBaUIsT0FBTztZQUN4QixZQUFNLEdBQVE7WUFDZCxnQkFBVSxHQUFHOzs7b0NBUVo7WUFDQyxPQUFPLEtBQUs7U0FDYjtRQUlEO1lBQ0U7O3lCQUVXLFdBQVc7OztnQkFFcEIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sSUFBSTthQUNqQzs7NENBR0s7O1NBRVA7UUFFRDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUs7U0FDL0I7UUFFRDtZQUNFLHlCQUF5Qjs7Ozs7Z0JBSXZCLElBQUksQ0FBQyx1QkFBdUI7YUFDN0I7Ozs7O1FBUUg7O1lBR0UsNkJBQXVDO1NBQ3hDO1FBQ0g7Ozs7OztJQ25VQTs7Ozs7O0FDREE7UUFXRTtZQUNFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCOzs7Ozs7OztRQUtNLGtEQUFnQjs7OztZQUF2QjtnQkFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUMzQzs7Ozs7Ozs7UUFLTSxpREFBZTs7OztZQUF0QjtnQkFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDdEI7Ozs7Ozs7Ozs7UUFNTSx5Q0FBTzs7Ozs7WUFBZCxVQUFlLElBR2Q7Z0JBQ0MsSUFBSSxJQUFJLEVBQUU7b0JBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3ZCO2FBQ0Y7O29CQXRDRkcsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozs7c0NBTEQ7S0EwQ0M7Ozs7OztBQzFDRDtRQWFFO1NBQWlCOzs7O1FBRWpCLDRDQUFROzs7WUFBUjthQUNDOztvQkFkRkMsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSx1QkFBdUI7d0JBQ2pDLFFBQVEsRUFBRSx5REFJVDt3QkFDRCxNQUFNLEVBQUUsRUFBRTtxQkFDWDs7OztRQVFELGdDQUFDO0tBQUE7Ozs7OztBQ2xCRDtRQUdBO1NBTXVDOztvQkFOdENDLFdBQVEsU0FBQzt3QkFDUixPQUFPLEVBQUUsRUFDUjt3QkFDRCxZQUFZLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzt3QkFDekMsT0FBTyxFQUFFLENBQUMseUJBQXlCLENBQUM7cUJBQ3JDOztRQUNxQyw2QkFBQztLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=