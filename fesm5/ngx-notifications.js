import { __extends } from 'tslib';
import { Injectable, Component, NgModule, defineInjectable } from '@angular/core';

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

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var UnsubscriptionError = /*@__PURE__*/ (function (_super) {
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
var rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function')
    ? /*@__PURE__*/ Symbol.for('rxSubscriber')
    : '@@rxSubscriber';

/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
var Subscriber = /*@__PURE__*/ (function (_super) {
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
var ObjectUnsubscribedError = /*@__PURE__*/ (function (_super) {
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

/** PURE_IMPORTS_START tslib PURE_IMPORTS_END */
var ArgumentOutOfRangeError = /*@__PURE__*/ (function (_super) {
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
var EmptyError = /*@__PURE__*/ (function (_super) {
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
var TimeoutError = /*@__PURE__*/ (function (_super) {
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

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

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
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
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

/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_map,_observable_from PURE_IMPORTS_END */
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
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgxNotificationsService = /** @class */ (function () {
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    NgxNotificationsService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgxNotificationsService.ngInjectableDef = defineInjectable({ factory: function NgxNotificationsService_Factory() { return new NgxNotificationsService(); }, token: NgxNotificationsService, providedIn: "root" });
    return NgxNotificationsService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
        { type: Component, args: [{
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
var NgxNotificationsModule = /** @class */ (function () {
    function NgxNotificationsModule() {
    }
    NgxNotificationsModule.decorators = [
        { type: NgModule, args: [{
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

export { NgxNotificationsService, NgxNotificationsComponent, NgxNotificationsModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuanMubWFwIiwic291cmNlcyI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuc2VydmljZS50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LW5vdGlmaWNhdGlvbnMvbGliL25neC1ub3RpZmljYXRpb25zLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbih4OiBhbnkpOiB4IGlzIEZ1bmN0aW9uIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuIiwibGV0IF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncyA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBnbG9iYWwgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIFJ4SlMsIHVzZWQgdG8gY29uZmlndXJlIHRoaW5nc1xuICogbGlrZSB3aGF0IFByb21pc2UgY29udHJ1Y3RvciBzaG91bGQgdXNlZCB0byBjcmVhdGUgUHJvbWlzZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgLyoqXG4gICAqIFRoZSBwcm9taXNlIGNvbnN0cnVjdG9yIHVzZWQgYnkgZGVmYXVsdCBmb3IgbWV0aG9kcyBzdWNoIGFzXG4gICAqIHtAbGluayB0b1Byb21pc2V9IGFuZCB7QGxpbmsgZm9yRWFjaH1cbiAgICovXG4gIFByb21pc2U6IHVuZGVmaW5lZCBhcyBQcm9taXNlQ29uc3RydWN0b3JMaWtlLFxuXG4gIC8qKlxuICAgKiBJZiB0cnVlLCB0dXJucyBvbiBzeW5jaHJvbm91cyBlcnJvciByZXRocm93aW5nLCB3aGljaCBpcyBhIGRlcHJlY2F0ZWQgYmVoYXZpb3JcbiAgICogaW4gdjYgYW5kIGhpZ2hlci4gVGhpcyBiZWhhdmlvciBlbmFibGVzIGJhZCBwYXR0ZXJucyBsaWtlIHdyYXBwaW5nIGEgc3Vic2NyaWJlXG4gICAqIGNhbGwgaW4gYSB0cnkvY2F0Y2ggYmxvY2suIEl0IGFsc28gZW5hYmxlcyBwcm9kdWNlciBpbnRlcmZlcmVuY2UsIGEgbmFzdHkgYnVnXG4gICAqIHdoZXJlIGEgbXVsdGljYXN0IGNhbiBiZSBicm9rZW4gZm9yIGFsbCBvYnNlcnZlcnMgYnkgYSBkb3duc3RyZWFtIGNvbnN1bWVyIHdpdGhcbiAgICogYW4gdW5oYW5kbGVkIGVycm9yLiBETyBOT1QgVVNFIFRISVMgRkxBRyBVTkxFU1MgSVQnUyBORUVERUQgVE8gQlkgVElNRVxuICAgKiBGT1IgTUlHUkFUSU9OIFJFQVNPTlMuXG4gICAqL1xuICBzZXQgdXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcbiAgICAgIGNvbnNvbGUud2FybignREVQUkVDQVRFRCEgUnhKUyB3YXMgc2V0IHRvIHVzZSBkZXByZWNhdGVkIHN5bmNocm9ub3VzIGVycm9yIGhhbmRsaW5nIGJlaGF2aW9yIGJ5IGNvZGUgYXQ6IFxcbicgKyBlcnJvci5zdGFjayk7XG4gICAgfSBlbHNlIGlmIChfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSeEpTOiBCYWNrIHRvIGEgYmV0dGVyIGVycm9yIGJlaGF2aW9yLiBUaGFuayB5b3UuIDwzJyk7XG4gICAgfVxuICAgIF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncyA9IHZhbHVlO1xuICB9LFxuXG4gIGdldCB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKCkge1xuICAgIHJldHVybiBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3M7XG4gIH0sXG59O1xuIiwiLyoqXG4gKiBUaHJvd3MgYW4gZXJyb3Igb24gYW5vdGhlciBqb2Igc28gdGhhdCBpdCdzIHBpY2tlZCB1cCBieSB0aGUgcnVudGltZSdzXG4gKiB1bmNhdWdodCBlcnJvciBoYW5kbGluZyBtZWNoYW5pc20uXG4gKiBAcGFyYW0gZXJyIHRoZSBlcnJvciB0byB0aHJvd1xuICovXG5leHBvcnQgZnVuY3Rpb24gaG9zdFJlcG9ydEVycm9yKGVycjogYW55KSB7XG4gIHNldFRpbWVvdXQoKCkgPT4geyB0aHJvdyBlcnI7IH0pO1xufSIsImltcG9ydCB7IE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvaG9zdFJlcG9ydEVycm9yJztcblxuZXhwb3J0IGNvbnN0IGVtcHR5OiBPYnNlcnZlcjxhbnk+ID0ge1xuICBjbG9zZWQ6IHRydWUsXG4gIG5leHQodmFsdWU6IGFueSk6IHZvaWQgeyAvKiBub29wICovfSxcbiAgZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgfVxuICB9LFxuICBjb21wbGV0ZSgpOiB2b2lkIHsgLypub29wKi8gfVxufTtcbiIsImV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCAoPFQ+KHg6IGFueSk6IHggaXMgVFtdID0+IHggJiYgdHlwZW9mIHgubGVuZ3RoID09PSAnbnVtYmVyJyk7XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNPYmplY3QoeDogYW55KTogeCBpcyBPYmplY3Qge1xuICByZXR1cm4geCAhPSBudWxsICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jztcbn1cbiIsIi8vIHR5cGVvZiBhbnkgc28gdGhhdCBpdCB3ZSBkb24ndCBoYXZlIHRvIGNhc3Qgd2hlbiBjb21wYXJpbmcgYSByZXN1bHQgdG8gdGhlIGVycm9yIG9iamVjdFxuZXhwb3J0IGNvbnN0IGVycm9yT2JqZWN0OiBhbnkgPSB7IGU6IHt9IH07IiwiaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuL2Vycm9yT2JqZWN0JztcblxubGV0IHRyeUNhdGNoVGFyZ2V0OiBGdW5jdGlvbjtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2hlcih0aGlzOiBhbnkpOiBhbnkge1xuICB0cnkge1xuICAgIHJldHVybiB0cnlDYXRjaFRhcmdldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3JPYmplY3QuZSA9IGU7XG4gICAgcmV0dXJuIGVycm9yT2JqZWN0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cnlDYXRjaDxUIGV4dGVuZHMgRnVuY3Rpb24+KGZuOiBUKTogVCB7XG4gIHRyeUNhdGNoVGFyZ2V0ID0gZm47XG4gIHJldHVybiA8YW55PnRyeUNhdGNoZXI7XG59XG4iLCIvKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIG9uZSBvciBtb3JlIGVycm9ycyBoYXZlIG9jY3VycmVkIGR1cmluZyB0aGVcbiAqIGB1bnN1YnNjcmliZWAgb2YgYSB7QGxpbmsgU3Vic2NyaXB0aW9ufS5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuc3Vic2NyaXB0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cbiAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVycm9yczogYW55W10pIHtcbiAgICBzdXBlcihlcnJvcnMgP1xuICAgICAgYCR7ZXJyb3JzLmxlbmd0aH0gZXJyb3JzIG9jY3VycmVkIGR1cmluZyB1bnN1YnNjcmlwdGlvbjpcbiAgJHtlcnJvcnMubWFwKChlcnIsIGkpID0+IGAke2kgKyAxfSkgJHtlcnIudG9TdHJpbmcoKX1gKS5qb2luKCdcXG4gICcpfWAgOiAnJyk7XG4gICAgKE9iamVjdCBhcyBhbnkpLnNldFByb3RvdHlwZU9mKHRoaXMsIFVuc3Vic2NyaXB0aW9uRXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi91dGlsL2lzT2JqZWN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHJlc291cmNlLCBzdWNoIGFzIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZS4gQVxuICogU3Vic2NyaXB0aW9uIGhhcyBvbmUgaW1wb3J0YW50IG1ldGhvZCwgYHVuc3Vic2NyaWJlYCwgdGhhdCB0YWtlcyBubyBhcmd1bWVudFxuICogYW5kIGp1c3QgZGlzcG9zZXMgdGhlIHJlc291cmNlIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBBZGRpdGlvbmFsbHksIHN1YnNjcmlwdGlvbnMgbWF5IGJlIGdyb3VwZWQgdG9nZXRoZXIgdGhyb3VnaCB0aGUgYGFkZCgpYFxuICogbWV0aG9kLCB3aGljaCB3aWxsIGF0dGFjaCBhIGNoaWxkIFN1YnNjcmlwdGlvbiB0byB0aGUgY3VycmVudCBTdWJzY3JpcHRpb24uXG4gKiBXaGVuIGEgU3Vic2NyaXB0aW9uIGlzIHVuc3Vic2NyaWJlZCwgYWxsIGl0cyBjaGlsZHJlbiAoYW5kIGl0cyBncmFuZGNoaWxkcmVuKVxuICogd2lsbCBiZSB1bnN1YnNjcmliZWQgYXMgd2VsbC5cbiAqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb24gaW1wbGVtZW50cyBTdWJzY3JpcHRpb25MaWtlIHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHB1YmxpYyBzdGF0aWMgRU1QVFk6IFN1YnNjcmlwdGlvbiA9IChmdW5jdGlvbihlbXB0eTogYW55KSB7XG4gICAgZW1wdHkuY2xvc2VkID0gdHJ1ZTtcbiAgICByZXR1cm4gZW1wdHk7XG4gIH0obmV3IFN1YnNjcmlwdGlvbigpKSk7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoaXMgU3Vic2NyaXB0aW9uIGhhcyBhbHJlYWR5IGJlZW4gdW5zdWJzY3JpYmVkLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHB1YmxpYyBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50OiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByb3RlY3RlZCBfcGFyZW50czogU3Vic2NyaXB0aW9uW10gPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbkxpa2VbXSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW3Vuc3Vic2NyaWJlXSBBIGZ1bmN0aW9uIGRlc2NyaWJpbmcgaG93IHRvXG4gICAqIHBlcmZvcm0gdGhlIGRpc3Bvc2FsIG9mIHJlc291cmNlcyB3aGVuIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1bnN1YnNjcmliZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICg8YW55PiB0aGlzKS5fdW5zdWJzY3JpYmUgPSB1bnN1YnNjcmliZTtcblxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyB0aGUgcmVzb3VyY2VzIGhlbGQgYnkgdGhlIHN1YnNjcmlwdGlvbi4gTWF5LCBmb3IgaW5zdGFuY2UsIGNhbmNlbFxuICAgKiBhbiBvbmdvaW5nIE9ic2VydmFibGUgZXhlY3V0aW9uIG9yIGNhbmNlbCBhbnkgb3RoZXIgdHlwZSBvZiB3b3JrIHRoYXRcbiAgICogc3RhcnRlZCB3aGVuIHRoZSBTdWJzY3JpcHRpb24gd2FzIGNyZWF0ZWQuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICB1bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBsZXQgaGFzRXJyb3JzID0gZmFsc2U7XG4gICAgbGV0IGVycm9yczogYW55W107XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgeyBfcGFyZW50LCBfcGFyZW50cywgX3Vuc3Vic2NyaWJlLCBfc3Vic2NyaXB0aW9ucyB9ID0gKDxhbnk+IHRoaXMpO1xuXG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgIHRoaXMuX3BhcmVudCA9IG51bGw7XG4gICAgdGhpcy5fcGFyZW50cyA9IG51bGw7XG4gICAgLy8gbnVsbCBvdXQgX3N1YnNjcmlwdGlvbnMgZmlyc3Qgc28gYW55IGNoaWxkIHN1YnNjcmlwdGlvbnMgdGhhdCBhdHRlbXB0XG4gICAgLy8gdG8gcmVtb3ZlIHRoZW1zZWx2ZXMgZnJvbSB0aGlzIHN1YnNjcmlwdGlvbiB3aWxsIG5vb3BcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zID0gbnVsbDtcblxuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsZW4gPSBfcGFyZW50cyA/IF9wYXJlbnRzLmxlbmd0aCA6IDA7XG5cbiAgICAvLyBpZiB0aGlzLl9wYXJlbnQgaXMgbnVsbCwgdGhlbiBzbyBpcyB0aGlzLl9wYXJlbnRzLCBhbmQgd2VcbiAgICAvLyBkb24ndCBoYXZlIHRvIHJlbW92ZSBvdXJzZWx2ZXMgZnJvbSBhbnkgcGFyZW50IHN1YnNjcmlwdGlvbnMuXG4gICAgd2hpbGUgKF9wYXJlbnQpIHtcbiAgICAgIF9wYXJlbnQucmVtb3ZlKHRoaXMpO1xuICAgICAgLy8gaWYgdGhpcy5fcGFyZW50cyBpcyBudWxsIG9yIGluZGV4ID49IGxlbixcbiAgICAgIC8vIHRoZW4gX3BhcmVudCBpcyBzZXQgdG8gbnVsbCwgYW5kIHRoZSBsb29wIGV4aXRzXG4gICAgICBfcGFyZW50ID0gKytpbmRleCA8IGxlbiAmJiBfcGFyZW50c1tpbmRleF0gfHwgbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihfdW5zdWJzY3JpYmUpKSB7XG4gICAgICBsZXQgdHJpYWwgPSB0cnlDYXRjaChfdW5zdWJzY3JpYmUpLmNhbGwodGhpcyk7XG4gICAgICBpZiAodHJpYWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XG4gICAgICAgIGVycm9ycyA9IGVycm9ycyB8fCAoXG4gICAgICAgICAgZXJyb3JPYmplY3QuZSBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IgP1xuICAgICAgICAgICAgZmxhdHRlblVuc3Vic2NyaXB0aW9uRXJyb3JzKGVycm9yT2JqZWN0LmUuZXJyb3JzKSA6IFtlcnJvck9iamVjdC5lXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0FycmF5KF9zdWJzY3JpcHRpb25zKSkge1xuXG4gICAgICBpbmRleCA9IC0xO1xuICAgICAgbGVuID0gX3N1YnNjcmlwdGlvbnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBzdWIgPSBfc3Vic2NyaXB0aW9uc1tpbmRleF07XG4gICAgICAgIGlmIChpc09iamVjdChzdWIpKSB7XG4gICAgICAgICAgbGV0IHRyaWFsID0gdHJ5Q2F0Y2goc3ViLnVuc3Vic2NyaWJlKS5jYWxsKHN1Yik7XG4gICAgICAgICAgaWYgKHRyaWFsID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGVycm9ycyA9IGVycm9ycyB8fCBbXTtcbiAgICAgICAgICAgIGxldCBlcnIgPSBlcnJvck9iamVjdC5lO1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzLmNvbmNhdChmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyLmVycm9ycykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzRXJyb3JzKSB7XG4gICAgICB0aHJvdyBuZXcgVW5zdWJzY3JpcHRpb25FcnJvcihlcnJvcnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdGVhciBkb3duIHRvIGJlIGNhbGxlZCBkdXJpbmcgdGhlIHVuc3Vic2NyaWJlKCkgb2YgdGhpc1xuICAgKiBTdWJzY3JpcHRpb24uXG4gICAqXG4gICAqIElmIHRoZSB0ZWFyIGRvd24gYmVpbmcgYWRkZWQgaXMgYSBzdWJzY3JpcHRpb24gdGhhdCBpcyBhbHJlYWR5XG4gICAqIHVuc3Vic2NyaWJlZCwgaXMgdGhlIHNhbWUgcmVmZXJlbmNlIGBhZGRgIGlzIGJlaW5nIGNhbGxlZCBvbiwgb3IgaXNcbiAgICogYFN1YnNjcmlwdGlvbi5FTVBUWWAsIGl0IHdpbGwgbm90IGJlIGFkZGVkLlxuICAgKlxuICAgKiBJZiB0aGlzIHN1YnNjcmlwdGlvbiBpcyBhbHJlYWR5IGluIGFuIGBjbG9zZWRgIHN0YXRlLCB0aGUgcGFzc2VkXG4gICAqIHRlYXIgZG93biBsb2dpYyB3aWxsIGJlIGV4ZWN1dGVkIGltbWVkaWF0ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0ge1RlYXJkb3duTG9naWN9IHRlYXJkb3duIFRoZSBhZGRpdGlvbmFsIGxvZ2ljIHRvIGV4ZWN1dGUgb25cbiAgICogdGVhcmRvd24uXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gUmV0dXJucyB0aGUgU3Vic2NyaXB0aW9uIHVzZWQgb3IgY3JlYXRlZCB0byBiZVxuICAgKiBhZGRlZCB0byB0aGUgaW5uZXIgc3Vic2NyaXB0aW9ucyBsaXN0LiBUaGlzIFN1YnNjcmlwdGlvbiBjYW4gYmUgdXNlZCB3aXRoXG4gICAqIGByZW1vdmUoKWAgdG8gcmVtb3ZlIHRoZSBwYXNzZWQgdGVhcmRvd24gbG9naWMgZnJvbSB0aGUgaW5uZXIgc3Vic2NyaXB0aW9uc1xuICAgKiBsaXN0LlxuICAgKi9cbiAgYWRkKHRlYXJkb3duOiBUZWFyZG93bkxvZ2ljKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoIXRlYXJkb3duIHx8ICh0ZWFyZG93biA9PT0gU3Vic2NyaXB0aW9uLkVNUFRZKSkge1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG5cbiAgICBpZiAodGVhcmRvd24gPT09IHRoaXMpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzdWJzY3JpcHRpb24gPSAoPFN1YnNjcmlwdGlvbj4gdGVhcmRvd24pO1xuXG4gICAgc3dpdGNoICh0eXBlb2YgdGVhcmRvd24pIHtcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbig8KCgpID0+IHZvaWQpID4gdGVhcmRvd24pO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKHN1YnNjcmlwdGlvbi5jbG9zZWQgfHwgdHlwZW9mIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzdWJzY3JpcHRpb24uX2FkZFBhcmVudCAhPT0gJ2Z1bmN0aW9uJyAvKiBxdWFjayBxdWFjayAqLykge1xuICAgICAgICAgIGNvbnN0IHRtcCA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLl9zdWJzY3JpcHRpb25zID0gW3RtcF07XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VucmVjb2duaXplZCB0ZWFyZG93biAnICsgdGVhcmRvd24gKyAnIGFkZGVkIHRvIFN1YnNjcmlwdGlvbi4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5fc3Vic2NyaXB0aW9ucyB8fCAodGhpcy5fc3Vic2NyaXB0aW9ucyA9IFtdKTtcblxuICAgIHN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgIHN1YnNjcmlwdGlvbi5fYWRkUGFyZW50KHRoaXMpO1xuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgU3Vic2NyaXB0aW9uIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2Ygc3Vic2NyaXB0aW9ucyB0aGF0IHdpbGxcbiAgICogdW5zdWJzY3JpYmUgZHVyaW5nIHRoZSB1bnN1YnNjcmliZSBwcm9jZXNzIG9mIHRoaXMgU3Vic2NyaXB0aW9uLlxuICAgKiBAcGFyYW0ge1N1YnNjcmlwdGlvbn0gc3Vic2NyaXB0aW9uIFRoZSBzdWJzY3JpcHRpb24gdG8gcmVtb3ZlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcmVtb3ZlKHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuX3N1YnNjcmlwdGlvbnM7XG4gICAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbkluZGV4ID0gc3Vic2NyaXB0aW9ucy5pbmRleE9mKHN1YnNjcmlwdGlvbik7XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbnMuc3BsaWNlKHN1YnNjcmlwdGlvbkluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2FkZFBhcmVudChwYXJlbnQ6IFN1YnNjcmlwdGlvbikge1xuICAgIGxldCB7IF9wYXJlbnQsIF9wYXJlbnRzIH0gPSB0aGlzO1xuICAgIGlmICghX3BhcmVudCB8fCBfcGFyZW50ID09PSBwYXJlbnQpIHtcbiAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBwYXJlbnQsIG9yIHRoZSBuZXcgcGFyZW50IGlzIHRoZSBzYW1lIGFzIHRoZVxuICAgICAgLy8gY3VycmVudCBwYXJlbnQsIHRoZW4gc2V0IHRoaXMuX3BhcmVudCB0byB0aGUgbmV3IHBhcmVudC5cbiAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB9IGVsc2UgaWYgKCFfcGFyZW50cykge1xuICAgICAgLy8gSWYgdGhlcmUncyBhbHJlYWR5IG9uZSBwYXJlbnQsIGJ1dCBub3QgbXVsdGlwbGUsIGFsbG9jYXRlIGFuIEFycmF5IHRvXG4gICAgICAvLyBzdG9yZSB0aGUgcmVzdCBvZiB0aGUgcGFyZW50IFN1YnNjcmlwdGlvbnMuXG4gICAgICB0aGlzLl9wYXJlbnRzID0gW3BhcmVudF07XG4gICAgfSBlbHNlIGlmIChfcGFyZW50cy5pbmRleE9mKHBhcmVudCkgPT09IC0xKSB7XG4gICAgICAvLyBPbmx5IGFkZCB0aGUgbmV3IHBhcmVudCB0byB0aGUgX3BhcmVudHMgbGlzdCBpZiBpdCdzIG5vdCBhbHJlYWR5IHRoZXJlLlxuICAgICAgX3BhcmVudHMucHVzaChwYXJlbnQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyb3JzOiBhbnlbXSkge1xuIHJldHVybiBlcnJvcnMucmVkdWNlKChlcnJzLCBlcnIpID0+IGVycnMuY29uY2F0KChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSA/IGVyci5lcnJvcnMgOiBlcnIpLCBbXSk7XG59XG4iLCJleHBvcnQgY29uc3QgcnhTdWJzY3JpYmVyID1cbiAgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC5mb3IgPT09ICdmdW5jdGlvbicpXG4gICAgPyBTeW1ib2wuZm9yKCdyeFN1YnNjcmliZXInKVxuICAgIDogJ0BAcnhTdWJzY3JpYmVyJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgcnhTdWJzY3JpYmVyIGluc3RlYWRcbiAqL1xuZXhwb3J0IGNvbnN0ICQkcnhTdWJzY3JpYmVyID0gcnhTdWJzY3JpYmVyO1xuIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGVtcHR5IGFzIGVtcHR5T2JzZXJ2ZXIgfSBmcm9tICcuL09ic2VydmVyJztcbmltcG9ydCB7IE9ic2VydmVyLCBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvcnhTdWJzY3JpYmVyJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IGhvc3RSZXBvcnRFcnJvciB9IGZyb20gJy4vdXRpbC9ob3N0UmVwb3J0RXJyb3InO1xuXG4vKipcbiAqIEltcGxlbWVudHMgdGhlIHtAbGluayBPYnNlcnZlcn0gaW50ZXJmYWNlIGFuZCBleHRlbmRzIHRoZVxuICoge0BsaW5rIFN1YnNjcmlwdGlvbn0gY2xhc3MuIFdoaWxlIHRoZSB7QGxpbmsgT2JzZXJ2ZXJ9IGlzIHRoZSBwdWJsaWMgQVBJIGZvclxuICogY29uc3VtaW5nIHRoZSB2YWx1ZXMgb2YgYW4ge0BsaW5rIE9ic2VydmFibGV9LCBhbGwgT2JzZXJ2ZXJzIGdldCBjb252ZXJ0ZWQgdG9cbiAqIGEgU3Vic2NyaWJlciwgaW4gb3JkZXIgdG8gcHJvdmlkZSBTdWJzY3JpcHRpb24tbGlrZSBjYXBhYmlsaXRpZXMgc3VjaCBhc1xuICogYHVuc3Vic2NyaWJlYC4gU3Vic2NyaWJlciBpcyBhIGNvbW1vbiB0eXBlIGluIFJ4SlMsIGFuZCBjcnVjaWFsIGZvclxuICogaW1wbGVtZW50aW5nIG9wZXJhdG9ycywgYnV0IGl0IGlzIHJhcmVseSB1c2VkIGFzIGEgcHVibGljIEFQSS5cbiAqXG4gKiBAY2xhc3MgU3Vic2NyaWJlcjxUPlxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIE9ic2VydmVyPFQ+IHtcblxuICBbcnhTdWJzY3JpYmVyU3ltYm9sXSgpIHsgcmV0dXJuIHRoaXM7IH1cblxuICAvKipcbiAgICogQSBzdGF0aWMgZmFjdG9yeSBmb3IgYSBTdWJzY3JpYmVyLCBnaXZlbiBhIChwb3RlbnRpYWxseSBwYXJ0aWFsKSBkZWZpbml0aW9uXG4gICAqIG9mIGFuIE9ic2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHg6ID9UKTogdm9pZH0gW25leHRdIFRoZSBgbmV4dGAgY2FsbGJhY2sgb2YgYW4gT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZTogP2FueSk6IHZvaWR9IFtlcnJvcl0gVGhlIGBlcnJvcmAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBUaGUgYGNvbXBsZXRlYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICogQHJldHVybiB7U3Vic2NyaWJlcjxUPn0gQSBTdWJzY3JpYmVyIHdyYXBwaW5nIHRoZSAocGFydGlhbGx5IGRlZmluZWQpXG4gICAqIE9ic2VydmVyIHJlcHJlc2VudGVkIGJ5IHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlPFQ+KG5leHQ/OiAoeD86IFQpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgZXJyb3I/OiAoZT86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpYmVyPFQ+IHtcbiAgICBjb25zdCBzdWJzY3JpYmVyID0gbmV3IFN1YnNjcmliZXIobmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICBzdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZSA9IGZhbHNlO1xuICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqLyBzeW5jRXJyb3JWYWx1ZTogYW55ID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqLyBzeW5jRXJyb3JUaHJvd246IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqIEBpbnRlcm5hbCAqLyBzeW5jRXJyb3JUaHJvd2FibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgaXNTdG9wcGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBkZXN0aW5hdGlvbjogUGFydGlhbE9ic2VydmVyPGFueT47IC8vIHRoaXMgYGFueWAgaXMgdGhlIGVzY2FwZSBoYXRjaCB0byBlcmFzZSBleHRyYSB0eXBlIHBhcmFtIChlLmcuIFIpXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBbZGVzdGluYXRpb25Pck5leHRdIEEgcGFydGlhbGx5XG4gICAqIGRlZmluZWQgT2JzZXJ2ZXIgb3IgYSBgbmV4dGAgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZTogP2FueSk6IHZvaWR9IFtlcnJvcl0gVGhlIGBlcnJvcmAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBUaGUgYGNvbXBsZXRlYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPGFueT4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgICAgZXJyb3I/OiAoZT86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGlmICghZGVzdGluYXRpb25Pck5leHQpIHtcbiAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZW1wdHlPYnNlcnZlcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRlc3RpbmF0aW9uT3JOZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIC8vIEhBQ0soYmVubGVzaCk6IEZvciBzaXR1YXRpb25zIHdoZXJlIE5vZGUgaGFzIG11bHRpcGxlIGNvcGllcyBvZiByeGpzIGluXG4gICAgICAgICAgLy8gbm9kZV9tb2R1bGVzLCB3ZSBjYW5ub3QgcmVseSBvbiBgaW5zdGFuY2VvZmAgY2hlY2tzXG4gICAgICAgICAgaWYgKGlzVHJ1c3RlZFN1YnNjcmliZXIoZGVzdGluYXRpb25Pck5leHQpKSB7XG4gICAgICAgICAgICBjb25zdCB0cnVzdGVkU3Vic2NyaWJlciA9IGRlc3RpbmF0aW9uT3JOZXh0W3J4U3Vic2NyaWJlclN5bWJvbF0oKSBhcyBTdWJzY3JpYmVyPGFueT47XG4gICAgICAgICAgICB0aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IHRydXN0ZWRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93YWJsZTtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSB0cnVzdGVkU3Vic2NyaWJlcjtcbiAgICAgICAgICAgIHRydXN0ZWRTdWJzY3JpYmVyLmFkZCh0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8UGFydGlhbE9ic2VydmVyPGFueT4+IGRlc3RpbmF0aW9uT3JOZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8KCh2YWx1ZTogVCkgPT4gdm9pZCk+IGRlc3RpbmF0aW9uT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYG5leHRgIGZyb21cbiAgICogdGhlIE9ic2VydmFibGUsIHdpdGggYSB2YWx1ZS4gVGhlIE9ic2VydmFibGUgbWF5IGNhbGwgdGhpcyBtZXRob2QgMCBvciBtb3JlXG4gICAqIHRpbWVzLlxuICAgKiBAcGFyYW0ge1R9IFt2YWx1ZV0gVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIG5leHQodmFsdWU/OiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5fbmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgT2JzZXJ2ZXJ9IGNhbGxiYWNrIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvZiB0eXBlIGBlcnJvcmAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZSwgd2l0aCBhbiBhdHRhY2hlZCBgRXJyb3JgLiBOb3RpZmllcyB0aGUgT2JzZXJ2ZXIgdGhhdFxuICAgKiB0aGUgT2JzZXJ2YWJsZSBoYXMgZXhwZXJpZW5jZWQgYW4gZXJyb3IgY29uZGl0aW9uLlxuICAgKiBAcGFyYW0ge2FueX0gW2Vycl0gVGhlIGBlcnJvcmAgZXhjZXB0aW9uLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgZXJyb3IoZXJyPzogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBhIHZhbHVlbGVzcyBub3RpZmljYXRpb24gb2YgdHlwZVxuICAgKiBgY29tcGxldGVgIGZyb20gdGhlIE9ic2VydmFibGUuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0IHRoZSBPYnNlcnZhYmxlXG4gICAqIGhhcyBmaW5pc2hlZCBzZW5kaW5nIHB1c2gtYmFzZWQgbm90aWZpY2F0aW9ucy5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHsgX3BhcmVudCwgX3BhcmVudHMgfSA9IHRoaXM7XG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRzID0gbnVsbDtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgdGhpcy5fcGFyZW50cyA9IF9wYXJlbnRzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTYWZlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgX2NvbnRleHQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJlbnRTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBvYnNlcnZlck9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgbGV0IG5leHQ6ICgodmFsdWU6IFQpID0+IHZvaWQpO1xuICAgIGxldCBjb250ZXh0OiBhbnkgPSB0aGlzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICBuZXh0ID0gKDwoKHZhbHVlOiBUKSA9PiB2b2lkKT4gb2JzZXJ2ZXJPck5leHQpO1xuICAgIH0gZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgIG5leHQgPSAoPFBhcnRpYWxPYnNlcnZlcjxUPj4gb2JzZXJ2ZXJPck5leHQpLm5leHQ7XG4gICAgICBlcnJvciA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuZXJyb3I7XG4gICAgICBjb21wbGV0ZSA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuY29tcGxldGU7XG4gICAgICBpZiAob2JzZXJ2ZXJPck5leHQgIT09IGVtcHR5T2JzZXJ2ZXIpIHtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0LnVuc3Vic2NyaWJlKSkge1xuICAgICAgICAgIHRoaXMuYWRkKDwoKSA9PiB2b2lkPiBjb250ZXh0LnVuc3Vic2NyaWJlLmJpbmQoY29udGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQudW5zdWJzY3JpYmUgPSB0aGlzLnVuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5fbmV4dCA9IG5leHQ7XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkICYmIHRoaXMuX25leHQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgdGhpcy5fX3RyeU9yVW5zdWIodGhpcy5fbmV4dCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgdGhpcy5fbmV4dCwgdmFsdWUpKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IF9wYXJlbnRTdWJzY3JpYmVyIH0gPSB0aGlzO1xuICAgICAgY29uc3QgeyB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIH0gPSBjb25maWc7XG4gICAgICBpZiAodGhpcy5fZXJyb3IpIHtcbiAgICAgICAgaWYgKCF1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9lcnJvciwgZXJyKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX3RyeU9yU2V0RXJyb3IoX3BhcmVudFN1YnNjcmliZXIsIHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgaWYgKHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAodGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZENvbXBsZXRlID0gKCkgPT4gdGhpcy5fY29tcGxldGUuY2FsbCh0aGlzLl9jb250ZXh0KTtcblxuICAgICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgd3JhcHBlZENvbXBsZXRlKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9fdHJ5T3JVbnN1YihmbjogRnVuY3Rpb24sIHZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX190cnlPclNldEVycm9yKHBhcmVudDogU3Vic2NyaWJlcjxUPiwgZm46IEZ1bmN0aW9uLCB2YWx1ZT86IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYmFkIGNhbGwnKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHBhcmVudC5zeW5jRXJyb3JWYWx1ZSA9IGVycjtcbiAgICAgICAgcGFyZW50LnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IF9wYXJlbnRTdWJzY3JpYmVyIH0gPSB0aGlzO1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICAgIHRoaXMuX3BhcmVudFN1YnNjcmliZXIgPSBudWxsO1xuICAgIF9wYXJlbnRTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNUcnVzdGVkU3Vic2NyaWJlcihvYmo6IGFueSkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgU3Vic2NyaWJlciB8fCAoJ3N5bmNFcnJvclRocm93YWJsZScgaW4gb2JqICYmIG9ialtyeFN1YnNjcmliZXJTeW1ib2xdKTtcbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9zeW1ib2wvcnhTdWJzY3JpYmVyJztcbmltcG9ydCB7IGVtcHR5IGFzIGVtcHR5T2JzZXJ2ZXIgfSBmcm9tICcuLi9PYnNlcnZlcic7XG5pbXBvcnQgeyBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1N1YnNjcmliZXI8VD4oXG4gIG5leHRPck9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsXG4gIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmliZXI8VD4ge1xuXG4gIGlmIChuZXh0T3JPYnNlcnZlcikge1xuICAgIGlmIChuZXh0T3JPYnNlcnZlciBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgIHJldHVybiAoPFN1YnNjcmliZXI8VD4+IG5leHRPck9ic2VydmVyKTtcbiAgICB9XG5cbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXJbcnhTdWJzY3JpYmVyU3ltYm9sXSkge1xuICAgICAgcmV0dXJuIG5leHRPck9ic2VydmVyW3J4U3Vic2NyaWJlclN5bWJvbF0oKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIW5leHRPck9ic2VydmVyICYmICFlcnJvciAmJiAhY29tcGxldGUpIHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmliZXIoZW1wdHlPYnNlcnZlcik7XG4gIH1cblxuICByZXR1cm4gbmV3IFN1YnNjcmliZXIobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG59XG4iLCJpbXBvcnQgeyByb290IH0gZnJvbSAnLi4vdXRpbC9yb290JztcblxuLyoqIFN5bWJvbC5vYnNlcnZhYmxlIGFkZGl0aW9uICovXG4vKiBOb3RlOiBUaGlzIHdpbGwgYWRkIFN5bWJvbC5vYnNlcnZhYmxlIGdsb2JhbGx5IGZvciBhbGwgVHlwZVNjcmlwdCB1c2VycyxcbiAgaG93ZXZlciwgd2UgYXJlIG5vIGxvbmdlciBwb2x5ZmlsbGluZyBTeW1ib2wub2JzZXJ2YWJsZSAqL1xuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgU3ltYm9sQ29uc3RydWN0b3Ige1xuICAgIHJlYWRvbmx5IG9ic2VydmFibGU6IHN5bWJvbDtcbiAgfVxufVxuXG4vKiogU3ltYm9sLm9ic2VydmFibGUgb3IgYSBzdHJpbmcgXCJAQG9ic2VydmFibGVcIi4gVXNlZCBmb3IgaW50ZXJvcCAqL1xuZXhwb3J0IGNvbnN0IG9ic2VydmFibGUgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xuIiwiLyogdHNsaW50OmRpc2FibGU6bm8tZW1wdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgeyB9XG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi9ub29wJztcbmltcG9ydCB7IFVuYXJ5RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VD4oKTogVW5hcnlGdW5jdGlvbjxULCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEE+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPik6IFVuYXJ5RnVuY3Rpb248VCwgQT47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPik6IFVuYXJ5RnVuY3Rpb248VCwgQj47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgb3AzOiBVbmFyeUZ1bmN0aW9uPEIsIEM+KTogVW5hcnlGdW5jdGlvbjxULCBDPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQ+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPik6IFVuYXJ5RnVuY3Rpb248VCwgRD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgb3AzOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBvcDQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIG9wNTogVW5hcnlGdW5jdGlvbjxELCBFPik6IFVuYXJ5RnVuY3Rpb248VCwgRT47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgb3AzOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBvcDQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIG9wNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgb3A2OiBVbmFyeUZ1bmN0aW9uPEUsIEY+KTogVW5hcnlGdW5jdGlvbjxULCBGPjtcbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIEEsIEIsIEMsIEQsIEUsIEYsIEc+KG9wMTogVW5hcnlGdW5jdGlvbjxULCBBPiwgb3AyOiBVbmFyeUZ1bmN0aW9uPEEsIEI+LCBvcDM6IFVuYXJ5RnVuY3Rpb248QiwgQz4sIG9wNDogVW5hcnlGdW5jdGlvbjxDLCBEPiwgb3A1OiBVbmFyeUZ1bmN0aW9uPEQsIEU+LCBvcDY6IFVuYXJ5RnVuY3Rpb248RSwgRj4sIG9wNzogVW5hcnlGdW5jdGlvbjxGLCBHPik6IFVuYXJ5RnVuY3Rpb248VCwgRz47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgb3AzOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBvcDQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIG9wNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgb3A2OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBvcDc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIG9wODogVW5hcnlGdW5jdGlvbjxHLCBIPik6IFVuYXJ5RnVuY3Rpb248VCwgSD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBILCBJPihvcDE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIG9wMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgb3AzOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBvcDQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIG9wNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgb3A2OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBvcDc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIG9wODogVW5hcnlGdW5jdGlvbjxHLCBIPiwgb3A5OiBVbmFyeUZ1bmN0aW9uPEgsIEk+KTogVW5hcnlGdW5jdGlvbjxULCBJPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQsIFI+KC4uLmZuczogQXJyYXk8VW5hcnlGdW5jdGlvbjxULCBSPj4pOiBVbmFyeUZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIHBpcGVGcm9tQXJyYXkoZm5zKTtcbn1cblxuLyogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheTxULCBSPihmbnM6IEFycmF5PFVuYXJ5RnVuY3Rpb248VCwgUj4+KTogVW5hcnlGdW5jdGlvbjxULCBSPiB7XG4gIGlmICghZm5zKSB7XG4gICAgcmV0dXJuIG5vb3AgYXMgVW5hcnlGdW5jdGlvbjxhbnksIGFueT47XG4gIH1cblxuICBpZiAoZm5zLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmbnNbMF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gcGlwZWQoaW5wdXQ6IFQpOiBSIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldjogYW55LCBmbjogVW5hcnlGdW5jdGlvbjxULCBSPikgPT4gZm4ocHJldiksIGlucHV0IGFzIGFueSk7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljLCBPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFN1YnNjcmliYWJsZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgdG9TdWJzY3JpYmVyIH0gZnJvbSAnLi91dGlsL3RvU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpaWYgfSBmcm9tICcuL29ic2VydmFibGUvaWlmJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgcGlwZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbC9waXBlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGFueSBzZXQgb2YgdmFsdWVzIG92ZXIgYW55IGFtb3VudCBvZiB0aW1lLiBUaGlzIGlzIHRoZSBtb3N0IGJhc2ljIGJ1aWxkaW5nIGJsb2NrXG4gKiBvZiBSeEpTLlxuICpcbiAqIEBjbGFzcyBPYnNlcnZhYmxlPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaWJhYmxlPFQ+IHtcblxuICAvKiogSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlIGRpcmVjdGx5LiAqL1xuICBwdWJsaWMgX2lzU2NhbGFyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBzb3VyY2U6IE9ic2VydmFibGU8YW55PjtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIG9wZXJhdG9yOiBPcGVyYXRvcjxhbnksIFQ+O1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBPYnNlcnZhYmxlIGlzXG4gICAqIGluaXRpYWxseSBzdWJzY3JpYmVkIHRvLiBUaGlzIGZ1bmN0aW9uIGlzIGdpdmVuIGEgU3Vic2NyaWJlciwgdG8gd2hpY2ggbmV3IHZhbHVlc1xuICAgKiBjYW4gYmUgYG5leHRgZWQsIG9yIGFuIGBlcnJvcmAgbWV0aG9kIGNhbiBiZSBjYWxsZWQgdG8gcmFpc2UgYW4gZXJyb3IsIG9yXG4gICAqIGBjb21wbGV0ZWAgY2FuIGJlIGNhbGxlZCB0byBub3RpZnkgb2YgYSBzdWNjZXNzZnVsIGNvbXBsZXRpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdWJzY3JpYmU/OiAodGhpczogT2JzZXJ2YWJsZTxUPiwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4gVGVhcmRvd25Mb2dpYykge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvLyBIQUNLOiBTaW5jZSBUeXBlU2NyaXB0IGluaGVyaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvbywgd2UgaGF2ZSB0b1xuICAvLyBmaWdodCBhZ2FpbnN0IFR5cGVTY3JpcHQgaGVyZSBzbyBTdWJqZWN0IGNhbiBoYXZlIGEgZGlmZmVyZW50IHN0YXRpYyBjcmVhdGUgc2lnbmF0dXJlXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNvbGQgT2JzZXJ2YWJsZSBieSBjYWxsaW5nIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEBzdGF0aWMgdHJ1ZVxuICAgKiBAb3duZXIgT2JzZXJ2YWJsZVxuICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmU/IHRoZSBzdWJzY3JpYmVyIGZ1bmN0aW9uIHRvIGJlIHBhc3NlZCB0byB0aGUgT2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhIG5ldyBjb2xkIG9ic2VydmFibGVcbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGU6IEZ1bmN0aW9uID0gPFQ+KHN1YnNjcmliZT86IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiBUZWFyZG93bkxvZ2ljKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlLCB3aXRoIHRoaXMgT2JzZXJ2YWJsZSBhcyB0aGUgc291cmNlLCBhbmQgdGhlIHBhc3NlZFxuICAgKiBvcGVyYXRvciBkZWZpbmVkIGFzIHRoZSBuZXcgb2JzZXJ2YWJsZSdzIG9wZXJhdG9yLlxuICAgKiBAbWV0aG9kIGxpZnRcbiAgICogQHBhcmFtIHtPcGVyYXRvcn0gb3BlcmF0b3IgdGhlIG9wZXJhdG9yIGRlZmluaW5nIHRoZSBvcGVyYXRpb24gdG8gdGFrZSBvbiB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhIG5ldyBvYnNlcnZhYmxlIHdpdGggdGhlIE9wZXJhdG9yIGFwcGxpZWRcbiAgICovXG4gIGxpZnQ8Uj4ob3BlcmF0b3I6IE9wZXJhdG9yPFQsIFI+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFI+KCk7XG4gICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgIG9ic2VydmFibGUub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHN1YnNjcmliZShvYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPik6IFN1YnNjcmlwdGlvbjtcbiAgc3Vic2NyaWJlKG5leHQ/OiAodmFsdWU6IFQpID0+IHZvaWQsIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbjtcbiAgLyoqXG4gICAqIEludm9rZXMgYW4gZXhlY3V0aW9uIG9mIGFuIE9ic2VydmFibGUgYW5kIHJlZ2lzdGVycyBPYnNlcnZlciBoYW5kbGVycyBmb3Igbm90aWZpY2F0aW9ucyBpdCB3aWxsIGVtaXQuXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Vc2UgaXQgd2hlbiB5b3UgaGF2ZSBhbGwgdGhlc2UgT2JzZXJ2YWJsZXMsIGJ1dCBzdGlsbCBub3RoaW5nIGlzIGhhcHBlbmluZy48L3NwYW4+XG4gICAqXG4gICAqIGBzdWJzY3JpYmVgIGlzIG5vdCBhIHJlZ3VsYXIgb3BlcmF0b3IsIGJ1dCBhIG1ldGhvZCB0aGF0IGNhbGxzIE9ic2VydmFibGUncyBpbnRlcm5hbCBgc3Vic2NyaWJlYCBmdW5jdGlvbi4gSXRcbiAgICogbWlnaHQgYmUgZm9yIGV4YW1wbGUgYSBmdW5jdGlvbiB0aGF0IHlvdSBwYXNzZWQgdG8gT2JzZXJ2YWJsZSdzIGNvbnN0cnVjdG9yLCBidXQgbW9zdCBvZiB0aGUgdGltZSBpdCBpc1xuICAgKiBhIGxpYnJhcnkgaW1wbGVtZW50YXRpb24sIHdoaWNoIGRlZmluZXMgd2hhdCB3aWxsIGJlIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSwgYW5kIHdoZW4gaXQgYmUgd2lsbCBlbWl0dGVkLiBUaGlzIG1lYW5zXG4gICAqIHRoYXQgY2FsbGluZyBgc3Vic2NyaWJlYCBpcyBhY3R1YWxseSB0aGUgbW9tZW50IHdoZW4gT2JzZXJ2YWJsZSBzdGFydHMgaXRzIHdvcmssIG5vdCB3aGVuIGl0IGlzIGNyZWF0ZWQsIGFzIGl0IGlzIG9mdGVuXG4gICAqIHRoZSB0aG91Z2h0LlxuICAgKlxuICAgKiBBcGFydCBmcm9tIHN0YXJ0aW5nIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZSwgdGhpcyBtZXRob2QgYWxsb3dzIHlvdSB0byBsaXN0ZW4gZm9yIHZhbHVlc1xuICAgKiB0aGF0IGFuIE9ic2VydmFibGUgZW1pdHMsIGFzIHdlbGwgYXMgZm9yIHdoZW4gaXQgY29tcGxldGVzIG9yIGVycm9ycy4gWW91IGNhbiBhY2hpZXZlIHRoaXMgaW4gdHdvXG4gICAqIG9mIHRoZSBmb2xsb3dpbmcgd2F5cy5cbiAgICpcbiAgICogVGhlIGZpcnN0IHdheSBpcyBjcmVhdGluZyBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHtAbGluayBPYnNlcnZlcn0gaW50ZXJmYWNlLiBJdCBzaG91bGQgaGF2ZSBtZXRob2RzXG4gICAqIGRlZmluZWQgYnkgdGhhdCBpbnRlcmZhY2UsIGJ1dCBub3RlIHRoYXQgaXQgc2hvdWxkIGJlIGp1c3QgYSByZWd1bGFyIEphdmFTY3JpcHQgb2JqZWN0LCB3aGljaCB5b3UgY2FuIGNyZWF0ZVxuICAgKiB5b3Vyc2VsZiBpbiBhbnkgd2F5IHlvdSB3YW50IChFUzYgY2xhc3MsIGNsYXNzaWMgZnVuY3Rpb24gY29uc3RydWN0b3IsIG9iamVjdCBsaXRlcmFsIGV0Yy4pLiBJbiBwYXJ0aWN1bGFyIGRvXG4gICAqIG5vdCBhdHRlbXB0IHRvIHVzZSBhbnkgUnhKUyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIHRvIGNyZWF0ZSBPYnNlcnZlcnMgLSB5b3UgZG9uJ3QgbmVlZCB0aGVtLiBSZW1lbWJlciBhbHNvXG4gICAqIHRoYXQgeW91ciBvYmplY3QgZG9lcyBub3QgaGF2ZSB0byBpbXBsZW1lbnQgYWxsIG1ldGhvZHMuIElmIHlvdSBmaW5kIHlvdXJzZWxmIGNyZWF0aW5nIGEgbWV0aG9kIHRoYXQgZG9lc24ndFxuICAgKiBkbyBhbnl0aGluZywgeW91IGNhbiBzaW1wbHkgb21pdCBpdC4gTm90ZSBob3dldmVyLCBpZiB0aGUgYGVycm9yYCBtZXRob2QgaXMgbm90IHByb3ZpZGVkLCBhbGwgZXJyb3JzIHdpbGxcbiAgICogYmUgbGVmdCB1bmNhdWdodC5cbiAgICpcbiAgICogVGhlIHNlY29uZCB3YXkgaXMgdG8gZ2l2ZSB1cCBvbiBPYnNlcnZlciBvYmplY3QgYWx0b2dldGhlciBhbmQgc2ltcGx5IHByb3ZpZGUgY2FsbGJhY2sgZnVuY3Rpb25zIGluIHBsYWNlIG9mIGl0cyBtZXRob2RzLlxuICAgKiBUaGlzIG1lYW5zIHlvdSBjYW4gcHJvdmlkZSB0aHJlZSBmdW5jdGlvbnMgYXMgYXJndW1lbnRzIHRvIGBzdWJzY3JpYmVgLCB3aGVyZSB0aGUgZmlyc3QgZnVuY3Rpb24gaXMgZXF1aXZhbGVudFxuICAgKiBvZiBhIGBuZXh0YCBtZXRob2QsIHRoZSBzZWNvbmQgb2YgYW4gYGVycm9yYCBtZXRob2QgYW5kIHRoZSB0aGlyZCBvZiBhIGBjb21wbGV0ZWAgbWV0aG9kLiBKdXN0IGFzIGluIGNhc2Ugb2YgT2JzZXJ2ZXIsXG4gICAqIGlmIHlvdSBkbyBub3QgbmVlZCB0byBsaXN0ZW4gZm9yIHNvbWV0aGluZywgeW91IGNhbiBvbWl0IGEgZnVuY3Rpb24sIHByZWZlcmFibHkgYnkgcGFzc2luZyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsXG4gICAqIHNpbmNlIGBzdWJzY3JpYmVgIHJlY29nbml6ZXMgdGhlc2UgZnVuY3Rpb25zIGJ5IHdoZXJlIHRoZXkgd2VyZSBwbGFjZWQgaW4gZnVuY3Rpb24gY2FsbC4gV2hlbiBpdCBjb21lc1xuICAgKiB0byBgZXJyb3JgIGZ1bmN0aW9uLCBqdXN0IGFzIGJlZm9yZSwgaWYgbm90IHByb3ZpZGVkLCBlcnJvcnMgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlIHdpbGwgYmUgdGhyb3duLlxuICAgKlxuICAgKiBXaGljaGV2ZXIgc3R5bGUgb2YgY2FsbGluZyBgc3Vic2NyaWJlYCB5b3UgdXNlLCBpbiBib3RoIGNhc2VzIGl0IHJldHVybnMgYSBTdWJzY3JpcHRpb24gb2JqZWN0LlxuICAgKiBUaGlzIG9iamVjdCBhbGxvd3MgeW91IHRvIGNhbGwgYHVuc3Vic2NyaWJlYCBvbiBpdCwgd2hpY2ggaW4gdHVybiB3aWxsIHN0b3AgdGhlIHdvcmsgdGhhdCBhbiBPYnNlcnZhYmxlIGRvZXMgYW5kIHdpbGwgY2xlYW5cbiAgICogdXAgYWxsIHJlc291cmNlcyB0aGF0IGFuIE9ic2VydmFibGUgdXNlZC4gTm90ZSB0aGF0IGNhbmNlbGxpbmcgYSBzdWJzY3JpcHRpb24gd2lsbCBub3QgY2FsbCBgY29tcGxldGVgIGNhbGxiYWNrXG4gICAqIHByb3ZpZGVkIHRvIGBzdWJzY3JpYmVgIGZ1bmN0aW9uLCB3aGljaCBpcyByZXNlcnZlZCBmb3IgYSByZWd1bGFyIGNvbXBsZXRpb24gc2lnbmFsIHRoYXQgY29tZXMgZnJvbSBhbiBPYnNlcnZhYmxlLlxuICAgKlxuICAgKiBSZW1lbWJlciB0aGF0IGNhbGxiYWNrcyBwcm92aWRlZCB0byBgc3Vic2NyaWJlYCBhcmUgbm90IGd1YXJhbnRlZWQgdG8gYmUgY2FsbGVkIGFzeW5jaHJvbm91c2x5LlxuICAgKiBJdCBpcyBhbiBPYnNlcnZhYmxlIGl0c2VsZiB0aGF0IGRlY2lkZXMgd2hlbiB0aGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWQuIEZvciBleGFtcGxlIHtAbGluayBvZn1cbiAgICogYnkgZGVmYXVsdCBlbWl0cyBhbGwgaXRzIHZhbHVlcyBzeW5jaHJvbm91c2x5LiBBbHdheXMgY2hlY2sgZG9jdW1lbnRhdGlvbiBmb3IgaG93IGdpdmVuIE9ic2VydmFibGVcbiAgICogd2lsbCBiZWhhdmUgd2hlbiBzdWJzY3JpYmVkIGFuZCBpZiBpdHMgZGVmYXVsdCBiZWhhdmlvciBjYW4gYmUgbW9kaWZpZWQgd2l0aCBhIGBzY2hlZHVsZXJgLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqICMjIyBTdWJzY3JpYmUgd2l0aCBhbiBPYnNlcnZlclxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IHN1bU9ic2VydmVyID0ge1xuICAgKiAgIHN1bTogMCxcbiAgICogICBuZXh0KHZhbHVlKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnQWRkaW5nOiAnICsgdmFsdWUpO1xuICAgKiAgICAgdGhpcy5zdW0gPSB0aGlzLnN1bSArIHZhbHVlO1xuICAgKiAgIH0sXG4gICAqICAgZXJyb3IoKSB7IC8vIFdlIGFjdHVhbGx5IGNvdWxkIGp1c3QgcmVtb3ZlIHRoaXMgbWV0aG9kLFxuICAgKiAgIH0sICAgICAgICAvLyBzaW5jZSB3ZSBkbyBub3QgcmVhbGx5IGNhcmUgYWJvdXQgZXJyb3JzIHJpZ2h0IG5vdy5cbiAgICogICBjb21wbGV0ZSgpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdTdW0gZXF1YWxzOiAnICsgdGhpcy5zdW0pO1xuICAgKiAgIH1cbiAgICogfTtcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5vZigxLCAyLCAzKSAvLyBTeW5jaHJvbm91c2x5IGVtaXRzIDEsIDIsIDMgYW5kIHRoZW4gY29tcGxldGVzLlxuICAgKiAuc3Vic2NyaWJlKHN1bU9ic2VydmVyKTtcbiAgICpcbiAgICogLy8gTG9nczpcbiAgICogLy8gXCJBZGRpbmc6IDFcIlxuICAgKiAvLyBcIkFkZGluZzogMlwiXG4gICAqIC8vIFwiQWRkaW5nOiAzXCJcbiAgICogLy8gXCJTdW0gZXF1YWxzOiA2XCJcbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBTdWJzY3JpYmUgd2l0aCBmdW5jdGlvbnNcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBsZXQgc3VtID0gMDtcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5vZigxLCAyLCAzKVxuICAgKiAuc3Vic2NyaWJlKFxuICAgKiAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnQWRkaW5nOiAnICsgdmFsdWUpO1xuICAgKiAgICAgc3VtID0gc3VtICsgdmFsdWU7XG4gICAqICAgfSxcbiAgICogICB1bmRlZmluZWQsXG4gICAqICAgZnVuY3Rpb24oKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnU3VtIGVxdWFsczogJyArIHN1bSk7XG4gICAqICAgfVxuICAgKiApO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcIkFkZGluZzogMVwiXG4gICAqIC8vIFwiQWRkaW5nOiAyXCJcbiAgICogLy8gXCJBZGRpbmc6IDNcIlxuICAgKiAvLyBcIlN1bSBlcXVhbHM6IDZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIENhbmNlbCBhIHN1YnNjcmlwdGlvblxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IHN1YnNjcmlwdGlvbiA9IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwMCkuc3Vic2NyaWJlKFxuICAgKiAgIG51bSA9PiBjb25zb2xlLmxvZyhudW0pLFxuICAgKiAgIHVuZGVmaW5lZCxcbiAgICogICAoKSA9PiBjb25zb2xlLmxvZygnY29tcGxldGVkIScpIC8vIFdpbGwgbm90IGJlIGNhbGxlZCwgZXZlblxuICAgKiApOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBjYW5jZWxsaW5nIHN1YnNjcmlwdGlvblxuICAgKlxuICAgKlxuICAgKiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICogICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICogICBjb25zb2xlLmxvZygndW5zdWJzY3JpYmVkIScpO1xuICAgKiB9LCAyNTAwKTtcbiAgICpcbiAgICogLy8gTG9nczpcbiAgICogLy8gMCBhZnRlciAxc1xuICAgKiAvLyAxIGFmdGVyIDJzXG4gICAqIC8vIFwidW5zdWJzY3JpYmVkIVwiIGFmdGVyIDIuNXNcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8RnVuY3Rpb259IG9ic2VydmVyT3JOZXh0IChvcHRpb25hbCkgRWl0aGVyIGFuIG9ic2VydmVyIHdpdGggbWV0aG9kcyB0byBiZSBjYWxsZWQsXG4gICAqICBvciB0aGUgZmlyc3Qgb2YgdGhyZWUgcG9zc2libGUgaGFuZGxlcnMsIHdoaWNoIGlzIHRoZSBoYW5kbGVyIGZvciBlYWNoIHZhbHVlIGVtaXR0ZWQgZnJvbSB0aGUgc3Vic2NyaWJlZFxuICAgKiAgT2JzZXJ2YWJsZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXJyb3IgKG9wdGlvbmFsKSBBIGhhbmRsZXIgZm9yIGEgdGVybWluYWwgZXZlbnQgcmVzdWx0aW5nIGZyb20gYW4gZXJyb3IuIElmIG5vIGVycm9yIGhhbmRsZXIgaXMgcHJvdmlkZWQsXG4gICAqICB0aGUgZXJyb3Igd2lsbCBiZSB0aHJvd24gYXMgdW5oYW5kbGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wbGV0ZSAob3B0aW9uYWwpIEEgaGFuZGxlciBmb3IgYSB0ZXJtaW5hbCBldmVudCByZXN1bHRpbmcgZnJvbSBzdWNjZXNzZnVsIGNvbXBsZXRpb24uXG4gICAqIEByZXR1cm4ge0lTdWJzY3JpcHRpb259IGEgc3Vic2NyaXB0aW9uIHJlZmVyZW5jZSB0byB0aGUgcmVnaXN0ZXJlZCBoYW5kbGVyc1xuICAgKiBAbWV0aG9kIHN1YnNjcmliZVxuICAgKi9cbiAgc3Vic2NyaWJlKG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uIHtcblxuICAgIGNvbnN0IHsgb3BlcmF0b3IgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2luayA9IHRvU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcblxuICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgb3BlcmF0b3IuY2FsbChzaW5rLCB0aGlzLnNvdXJjZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpbmsuYWRkKFxuICAgICAgICB0aGlzLnNvdXJjZSB8fCAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgJiYgIXNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSA/XG4gICAgICAgIHRoaXMuX3N1YnNjcmliZShzaW5rKSA6XG4gICAgICAgIHRoaXMuX3RyeVN1YnNjcmliZShzaW5rKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICBzaW5rLnN5bmNFcnJvclRocm93YWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAoc2luay5zeW5jRXJyb3JUaHJvd24pIHtcbiAgICAgICAgICB0aHJvdyBzaW5rLnN5bmNFcnJvclZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpbms7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF90cnlTdWJzY3JpYmUoc2luazogU3Vic2NyaWJlcjxUPik6IFRlYXJkb3duTG9naWMge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHNpbmspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgc2luay5zeW5jRXJyb3JWYWx1ZSA9IGVycjtcbiAgICAgIH1cbiAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBmb3JFYWNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHQgYSBoYW5kbGVyIGZvciBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIG9ic2VydmFibGVcbiAgICogQHBhcmFtIHtQcm9taXNlQ29uc3RydWN0b3J9IFtwcm9taXNlQ3Rvcl0gYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB1c2VkIHRvIGluc3RhbnRpYXRlIHRoZSBQcm9taXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IGVpdGhlciByZXNvbHZlcyBvbiBvYnNlcnZhYmxlIGNvbXBsZXRpb24gb3JcbiAgICogIHJlamVjdHMgd2l0aCB0aGUgaGFuZGxlZCBlcnJvclxuICAgKi9cbiAgZm9yRWFjaChuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIHByb21pc2VDdG9yPzogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlQ3Rvcjx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBNdXN0IGJlIGRlY2xhcmVkIGluIGEgc2VwYXJhdGUgc3RhdGVtZW50IHRvIGF2b2lkIGEgUmVmZXJuY2VFcnJvciB3aGVuXG4gICAgICAvLyBhY2Nlc3Npbmcgc3Vic2NyaXB0aW9uIGJlbG93IGluIHRoZSBjbG9zdXJlIGR1ZSB0byBUZW1wb3JhbCBEZWFkIFpvbmUuXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgICBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXh0KHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCByZWplY3QsIHJlc29sdmUpO1xuICAgIH0pIGFzIFByb21pc2U8dm9pZD47XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgcmV0dXJuIHNvdXJjZSAmJiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgLy8gYGlmYCBhbmQgYHRocm93YCBhcmUgc3BlY2lhbCBzbm93IGZsYWtlcywgdGhlIGNvbXBpbGVyIHNlZXMgdGhlbSBhcyByZXNlcnZlZCB3b3Jkcy4gRGVwcmVjYXRlZCBpblxuICAvLyBmYXZvciBvZiBpaWYgYW5kIHRocm93RXJyb3IgZnVuY3Rpb25zLlxuICAvKipcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgSW4gZmF2b3Igb2YgaWlmIGNyZWF0aW9uIGZ1bmN0aW9uOiBpbXBvcnQgeyBpaWYgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyBpZjogdHlwZW9mIGlpZjtcbiAgLyoqXG4gICAqIEBub2NvbGxhcHNlXG4gICAqIEBkZXByZWNhdGVkIEluIGZhdm9yIG9mIHRocm93RXJyb3IgY3JlYXRpb24gZnVuY3Rpb246IGltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyB0aHJvdzogdHlwZW9mIHRocm93RXJyb3I7XG5cbiAgLyoqXG4gICAqIEFuIGludGVyb3AgcG9pbnQgZGVmaW5lZCBieSB0aGUgZXM3LW9ic2VydmFibGUgc3BlYyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1vYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgU3ltYm9sLm9ic2VydmFibGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhpcyBpbnN0YW5jZSBvZiB0aGUgb2JzZXJ2YWJsZVxuICAgKi9cbiAgW1N5bWJvbF9vYnNlcnZhYmxlXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICBwaXBlKCk6IE9ic2VydmFibGU8VD47XG4gIHBpcGU8QT4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+KTogT2JzZXJ2YWJsZTxBPjtcbiAgcGlwZTxBLCBCPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPik6IE9ic2VydmFibGU8Qj47XG4gIHBpcGU8QSwgQiwgQz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPik6IE9ic2VydmFibGU8Qz47XG4gIHBpcGU8QSwgQiwgQywgRD4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+KTogT2JzZXJ2YWJsZTxEPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPik6IE9ic2VydmFibGU8RT47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRj4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPik6IE9ic2VydmFibGU8Rj47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+KTogT2JzZXJ2YWJsZTxHPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4sIG9wODogT3BlcmF0b3JGdW5jdGlvbjxHLCBIPik6IE9ic2VydmFibGU8SD47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPik6IE9ic2VydmFibGU8ST47XG4gIHBpcGU8Uj4oLi4ub3BlcmF0aW9uczogT3BlcmF0b3JGdW5jdGlvbjxhbnksIGFueT5bXSk6IE9ic2VydmFibGU8Uj47XG4gIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gc3RpdGNoIHRvZ2V0aGVyIGZ1bmN0aW9uYWwgb3BlcmF0b3JzIGludG8gYSBjaGFpbi5cbiAgICogQG1ldGhvZCBwaXBlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IHRoZSBPYnNlcnZhYmxlIHJlc3VsdCBvZiBhbGwgb2YgdGhlIG9wZXJhdG9ycyBoYXZpbmdcbiAgICogYmVlbiBjYWxsZWQgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBwYXNzZWQgaW4uXG4gICAqXG4gICAqICMjIyBFeGFtcGxlXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogaW1wb3J0IHsgbWFwLCBmaWx0ZXIsIHNjYW4gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gICAqXG4gICAqIFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwMClcbiAgICogICAucGlwZShcbiAgICogICAgIGZpbHRlcih4ID0+IHggJSAyID09PSAwKSxcbiAgICogICAgIG1hcCh4ID0+IHggKyB4KSxcbiAgICogICAgIHNjYW4oKGFjYywgeCkgPT4gYWNjICsgeClcbiAgICogICApXG4gICAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKVxuICAgKiBgYGBcbiAgICovXG4gIHBpcGU8Uj4oLi4ub3BlcmF0aW9uczogT3BlcmF0b3JGdW5jdGlvbjxULCBSPltdKTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgaWYgKG9wZXJhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcyBhcyBhbnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBpcGVGcm9tQXJyYXkob3BlcmF0aW9ucykodGhpcyk7XG4gIH1cblxuICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbiAgdG9Qcm9taXNlPFQ+KHRoaXM6IE9ic2VydmFibGU8VD4pOiBQcm9taXNlPFQ+O1xuICB0b1Byb21pc2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPiwgUHJvbWlzZUN0b3I6IHR5cGVvZiBQcm9taXNlKTogUHJvbWlzZTxUPjtcbiAgdG9Qcm9taXNlPFQ+KHRoaXM6IE9ic2VydmFibGU8VD4sIFByb21pc2VDdG9yOiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTxUPjtcbiAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuICB0b1Byb21pc2UocHJvbWlzZUN0b3I/OiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTxUPiB7XG4gICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG5cbiAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCB2YWx1ZTogYW55O1xuICAgICAgdGhpcy5zdWJzY3JpYmUoKHg6IFQpID0+IHZhbHVlID0geCwgKGVycjogYW55KSA9PiByZWplY3QoZXJyKSwgKCkgPT4gcmVzb2x2ZSh2YWx1ZSkpO1xuICAgIH0pIGFzIFByb21pc2U8VD47XG4gIH1cbn1cblxuLyoqXG4gKiBEZWNpZGVzIGJldHdlZW4gYSBwYXNzZWQgcHJvbWlzZSBjb25zdHJ1Y3RvciBmcm9tIGNvbnN1bWluZyBjb2RlLFxuICogQSBkZWZhdWx0IGNvbmZpZ3VyZWQgcHJvbWlzZSBjb25zdHJ1Y3RvciwgYW5kIHRoZSBuYXRpdmUgcHJvbWlzZVxuICogY29uc3RydWN0b3IgYW5kIHJldHVybnMgaXQuIElmIG5vdGhpbmcgY2FuIGJlIGZvdW5kLCBpdCB3aWxsIHRocm93XG4gKiBhbiBlcnJvci5cbiAqIEBwYXJhbSBwcm9taXNlQ3RvciBUaGUgb3B0aW9uYWwgcHJvbWlzZSBjb25zdHJ1Y3RvciB0byBwYXNzZWQgYnkgY29uc3VtaW5nIGNvZGVcbiAqL1xuZnVuY3Rpb24gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3I6IFByb21pc2VDb25zdHJ1Y3Rvckxpa2UgfCB1bmRlZmluZWQpIHtcbiAgaWYgKCFwcm9taXNlQ3Rvcikge1xuICAgIHByb21pc2VDdG9yID0gY29uZmlnLlByb21pc2UgfHwgUHJvbWlzZTtcbiAgfVxuXG4gIGlmICghcHJvbWlzZUN0b3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIFByb21pc2UgaW1wbCBmb3VuZCcpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2VDdG9yO1xufVxuIiwiLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhbiBhY3Rpb24gaXMgaW52YWxpZCBiZWNhdXNlIHRoZSBvYmplY3QgaGFzIGJlZW5cbiAqIHVuc3Vic2NyaWJlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBTdWJqZWN0fVxuICogQHNlZSB7QGxpbmsgQmVoYXZpb3JTdWJqZWN0fVxuICpcbiAqIEBjbGFzcyBPYmplY3RVbnN1YnNjcmliZWRFcnJvclxuICovXG5leHBvcnQgY2xhc3MgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cbiAgcHVibGljIHJlYWRvbmx5IG5hbWUgPSAnT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdvYmplY3QgdW5zdWJzY3JpYmVkJyk7XG4gICAgKE9iamVjdCBhcyBhbnkpLnNldFByb3RvdHlwZU9mKHRoaXMsIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaXB0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHN1YmplY3Q6IFN1YmplY3Q8VD4sIHB1YmxpYyBzdWJzY3JpYmVyOiBPYnNlcnZlcjxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5zdWJqZWN0O1xuICAgIGNvbnN0IG9ic2VydmVycyA9IHN1YmplY3Qub2JzZXJ2ZXJzO1xuXG4gICAgdGhpcy5zdWJqZWN0ID0gbnVsbDtcblxuICAgIGlmICghb2JzZXJ2ZXJzIHx8IG9ic2VydmVycy5sZW5ndGggPT09IDAgfHwgc3ViamVjdC5pc1N0b3BwZWQgfHwgc3ViamVjdC5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpYmVySW5kZXggPSBvYnNlcnZlcnMuaW5kZXhPZih0aGlzLnN1YnNjcmliZXIpO1xuXG4gICAgaWYgKHN1YnNjcmliZXJJbmRleCAhPT0gLTEpIHtcbiAgICAgIG9ic2VydmVycy5zcGxpY2Uoc3Vic2NyaWJlckluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIFN1YnNjcmlwdGlvbkxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YmplY3RTdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuXG4vKipcbiAqIEBjbGFzcyBTdWJqZWN0U3Vic2NyaWJlcjxUPlxuICovXG5leHBvcnQgY2xhc3MgU3ViamVjdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBTdWJqZWN0PFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3Q8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTGlrZSB7XG5cbiAgW3J4U3Vic2NyaWJlclN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJqZWN0U3Vic2NyaWJlcih0aGlzKTtcbiAgfVxuXG4gIG9ic2VydmVyczogT2JzZXJ2ZXI8VD5bXSA9IFtdO1xuXG4gIGNsb3NlZCA9IGZhbHNlO1xuXG4gIGlzU3RvcHBlZCA9IGZhbHNlO1xuXG4gIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgdGhyb3duRXJyb3I6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKkBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjcmVhdGU6IEZ1bmN0aW9uID0gPFQ+KGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxUPiwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogQW5vbnltb3VzU3ViamVjdDxUPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNTdWJqZWN0PFQ+KGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xuICB9XG5cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBzdWJqZWN0ID0gbmV3IEFub255bW91c1N1YmplY3QodGhpcywgdGhpcyk7XG4gICAgc3ViamVjdC5vcGVyYXRvciA9IDxhbnk+b3BlcmF0b3I7XG4gICAgcmV0dXJuIDxhbnk+c3ViamVjdDtcbiAgfVxuXG4gIG5leHQodmFsdWU/OiBUKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb3B5W2ldLm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5oYXNFcnJvciA9IHRydWU7XG4gICAgdGhpcy50aHJvd25FcnJvciA9IGVycjtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29weVtpXS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIGNvbnN0IHsgb2JzZXJ2ZXJzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvcHlbaV0uY29tcGxldGUoKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuICB9XG5cbiAgYXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZTxUPigpO1xuICAgICg8YW55Pm9ic2VydmFibGUpLnNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb24/OiBPYnNlcnZlcjxUPiwgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24ubmV4dCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5lcnJvcikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzO1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZDb3VudDxUPigpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gcmVmQ291bnRPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBSZWZDb3VudE9wZXJhdG9yKHNvdXJjZSkpO1xuICB9IGFzIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbn1cblxuY2xhc3MgUmVmQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCsrO1xuXG4gICAgY29uc3QgcmVmQ291bnRlciA9IG5ldyBSZWZDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgY29ubmVjdGFibGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUocmVmQ291bnRlcik7XG5cbiAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAoPGFueT4gcmVmQ291bnRlcikuY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICBpZiAoIWNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQ7XG4gICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQgPSByZWZDb3VudCAtIDE7XG4gICAgaWYgKHJlZkNvdW50ID4gMSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLyBDb21wYXJlIHRoZSBsb2NhbCBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiB0byB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBvbiB0aGUgc2hhcmVkIENvbm5lY3RhYmxlT2JzZXJ2YWJsZS4gSW4gY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHNvdXJjZSBzeW5jaHJvbm91c2x5IGVtaXRzIHZhbHVlcywgYW5kXG4gICAgLy8gdGhlIFJlZkNvdW50U3Vic2NyaWJlcidzIGRvd25zdHJlYW0gT2JzZXJ2ZXJzIHN5bmNocm9ub3VzbHkgdW5zdWJzY3JpYmUsXG4gICAgLy8gZXhlY3V0aW9uIGNvbnRpbnVlcyB0byBoZXJlIGJlZm9yZSB0aGUgUmVmQ291bnRPcGVyYXRvciBoYXMgYSBjaGFuY2UgdG9cbiAgICAvLyBzdXBwbHkgdGhlIFJlZkNvdW50U3Vic2NyaWJlciB3aXRoIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24uXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmFuZ2UoMCwgMTApLnBpcGUoXG4gICAgLy8gICBwdWJsaXNoKCksXG4gICAgLy8gICByZWZDb3VudCgpLFxuICAgIC8vICAgdGFrZSg1KSxcbiAgICAvLyApXG4gICAgLy8gLnN1YnNjcmliZSgpO1xuICAgIC8vIGBgYFxuICAgIC8vIEluIG9yZGVyIHRvIGFjY291bnQgZm9yIHRoaXMgY2FzZSwgUmVmQ291bnRTdWJzY3JpYmVyIHNob3VsZCBvbmx5IGRpc3Bvc2VcbiAgICAvLyB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlJ3Mgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGlmIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGV4aXN0cywgKmFuZCogZWl0aGVyOlxuICAgIC8vICAgYS4gUmVmQ291bnRTdWJzY3JpYmVyIGRvZXNuJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb25cbiAgICAvLyAgICAgIFN1YnNjcmlwdGlvbiB5ZXQsIG9yLFxuICAgIC8vICAgYi4gUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gcmVmZXJlbmNlIGlzIGlkZW50aWNhbFxuICAgIC8vICAgICAgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvblxuICAgIC8vL1xuICAgIGNvbnN0IHsgY29ubmVjdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCBzaGFyZWRDb25uZWN0aW9uID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uZWN0aW9uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm5lY3Rpb24pKSB7XG4gICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0LCBTdWJqZWN0U3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlZkNvdW50IGFzIGhpZ2hlck9yZGVyUmVmQ291bnQgfSBmcm9tICcuLi9vcGVyYXRvcnMvcmVmQ291bnQnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuXG4gIHByb3RlY3RlZCBfc3ViamVjdDogU3ViamVjdDxUPjtcbiAgcHJvdGVjdGVkIF9yZWZDb3VudDogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIF9jb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lzQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgc3ViamVjdEZhY3Rvcnk6ICgpID0+IFN1YmplY3Q8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdWJqZWN0KCkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFN1YmplY3QoKTogU3ViamVjdDxUPiB7XG4gICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgaWYgKCFzdWJqZWN0IHx8IHN1YmplY3QuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5zdWJqZWN0RmFjdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgfVxuXG4gIGNvbm5lY3QoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb247XG4gICAgaWYgKCFjb25uZWN0aW9uKSB7XG4gICAgICB0aGlzLl9pc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGNvbm5lY3Rpb24uYWRkKHRoaXMuc291cmNlXG4gICAgICAgIC5zdWJzY3JpYmUobmV3IENvbm5lY3RhYmxlU3Vic2NyaWJlcih0aGlzLmdldFN1YmplY3QoKSwgdGhpcykpKTtcbiAgICAgIGlmIChjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgY29ubmVjdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIHJlZkNvdW50KCk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBoaWdoZXJPcmRlclJlZkNvdW50KCkodGhpcykgYXMgT2JzZXJ2YWJsZTxUPjtcbiAgfVxufVxuXG5jb25zdCBjb25uZWN0YWJsZVByb3RvID0gPGFueT5Db25uZWN0YWJsZU9ic2VydmFibGUucHJvdG90eXBlO1xuXG5leHBvcnQgY29uc3QgY29ubmVjdGFibGVPYnNlcnZhYmxlRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yTWFwID0ge1xuICBvcGVyYXRvcjogeyB2YWx1ZTogbnVsbCB9LFxuICBfcmVmQ291bnQ6IHsgdmFsdWU6IDAsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9zdWJqZWN0OiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfY29ubmVjdGlvbjogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX3N1YnNjcmliZTogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5fc3Vic2NyaWJlIH0sXG4gIF9pc0NvbXBsZXRlOiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLl9pc0NvbXBsZXRlLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBnZXRTdWJqZWN0OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLmdldFN1YmplY3QgfSxcbiAgY29ubmVjdDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5jb25uZWN0IH0sXG4gIHJlZkNvdW50OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLnJlZkNvdW50IH1cbn07XG5cbmNsYXNzIENvbm5lY3RhYmxlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YmplY3RTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICBzdXBlci5fZXJyb3IoZXJyKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY29ubmVjdGFibGUuX2lzQ29tcGxldGUgPSB0cnVlO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBjb25uZWN0YWJsZSA9IDxhbnk+dGhpcy5jb25uZWN0YWJsZTtcbiAgICBpZiAoY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGFibGUuX3JlZkNvdW50ID0gMDtcbiAgICAgIGNvbm5lY3RhYmxlLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgIGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIGlmIChjb25uZWN0aW9uKSB7XG4gICAgICAgIGNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCsrO1xuXG4gICAgY29uc3QgcmVmQ291bnRlciA9IG5ldyBSZWZDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgY29ubmVjdGFibGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUocmVmQ291bnRlcik7XG5cbiAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAoPGFueT4gcmVmQ291bnRlcikuY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICBpZiAoIWNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQ7XG4gICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQgPSByZWZDb3VudCAtIDE7XG4gICAgaWYgKHJlZkNvdW50ID4gMSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLyBDb21wYXJlIHRoZSBsb2NhbCBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiB0byB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBvbiB0aGUgc2hhcmVkIENvbm5lY3RhYmxlT2JzZXJ2YWJsZS4gSW4gY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHNvdXJjZSBzeW5jaHJvbm91c2x5IGVtaXRzIHZhbHVlcywgYW5kXG4gICAgLy8gdGhlIFJlZkNvdW50U3Vic2NyaWJlcidzIGRvd25zdHJlYW0gT2JzZXJ2ZXJzIHN5bmNocm9ub3VzbHkgdW5zdWJzY3JpYmUsXG4gICAgLy8gZXhlY3V0aW9uIGNvbnRpbnVlcyB0byBoZXJlIGJlZm9yZSB0aGUgUmVmQ291bnRPcGVyYXRvciBoYXMgYSBjaGFuY2UgdG9cbiAgICAvLyBzdXBwbHkgdGhlIFJlZkNvdW50U3Vic2NyaWJlciB3aXRoIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24uXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmFuZ2UoMCwgMTApLnBpcGUoXG4gICAgLy8gICBwdWJsaXNoKCksXG4gICAgLy8gICByZWZDb3VudCgpLFxuICAgIC8vICAgdGFrZSg1KSxcbiAgICAvLyApLnN1YnNjcmliZSgpO1xuICAgIC8vIGBgYFxuICAgIC8vIEluIG9yZGVyIHRvIGFjY291bnQgZm9yIHRoaXMgY2FzZSwgUmVmQ291bnRTdWJzY3JpYmVyIHNob3VsZCBvbmx5IGRpc3Bvc2VcbiAgICAvLyB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlJ3Mgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGlmIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGV4aXN0cywgKmFuZCogZWl0aGVyOlxuICAgIC8vICAgYS4gUmVmQ291bnRTdWJzY3JpYmVyIGRvZXNuJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb25cbiAgICAvLyAgICAgIFN1YnNjcmlwdGlvbiB5ZXQsIG9yLFxuICAgIC8vICAgYi4gUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gcmVmZXJlbmNlIGlzIGlkZW50aWNhbFxuICAgIC8vICAgICAgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvblxuICAgIC8vL1xuICAgIGNvbnN0IHsgY29ubmVjdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCBzaGFyZWRDb25uZWN0aW9uID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uZWN0aW9uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm5lY3Rpb24pKSB7XG4gICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEspOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcjogdm9pZCwgZHVyYXRpb25TZWxlY3RvcjogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IFIsIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55Piwgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBHcm91cHMgdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQgY3JpdGVyaW9uLFxuICogYW5kIGVtaXRzIHRoZXNlIGdyb3VwZWQgaXRlbXMgYXMgYEdyb3VwZWRPYnNlcnZhYmxlc2AsIG9uZVxuICoge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBwZXIgZ3JvdXAuXG4gKlxuICogIVtdKGdyb3VwQnkucG5nKVxuICpcbiAqICMjRXhhbXBsZXNcbiAqIEdyb3VwIG9iamVjdHMgYnkgaWQgYW5kIHJldHVybiBhcyBhcnJheVxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIE9iaiB7XG4gKiAgICBpZDogbnVtYmVyLFxuICogICAgbmFtZTogc3RyaW5nLFxuICogfVxuICogXG4gKiBvZjxPYmo+KFxuICogICB7aWQ6IDEsIG5hbWU6ICdhemUxJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3NmMid9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdkZzInfSxcbiAqICAge2lkOiAxLCBuYW1lOiAnZXJnMSd9LFxuICogICB7aWQ6IDEsIG5hbWU6ICdkZjEnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnc2ZxZmIyJ30sXG4gKiAgIHtpZDogMywgbmFtZTogJ3FmczMnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAncXNncXNmZzInfSxcbiAqICkucGlwZShcbiAqICAgZ3JvdXBCeShwID0+IHAuaWQpLFxuICogICBtZXJnZU1hcCgoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXSkpKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyBbIHsgaWQ6IDEsIG5hbWU6ICdhemUxJyB9LFxuICogLy8gICB7IGlkOiAxLCBuYW1lOiAnZXJnMScgfSxcbiAqIC8vICAgeyBpZDogMSwgbmFtZTogJ2RmMScgfSBdXG4gKiAvL1xuICogLy8gWyB7IGlkOiAyLCBuYW1lOiAnc2YyJyB9LFxuICogLy8gICB7IGlkOiAyLCBuYW1lOiAnZGcyJyB9LFxuICogLy8gICB7IGlkOiAyLCBuYW1lOiAnc2ZxZmIyJyB9LFxuICogLy8gICB7IGlkOiAyLCBuYW1lOiAncXNncXNmZzInIH0gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMywgbmFtZTogJ3FmczMnIH0gXVxuICogYGBgXG4gKlxuICogUGl2b3QgZGF0YSBvbiB0aGUgaWQgZmllbGRcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIG9mPE9iaj4oXG4gKiAgIHtpZDogMSwgbmFtZTogJ2F6ZTEnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnc2YyJ30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ2RnMid9LFxuICogICB7aWQ6IDEsIG5hbWU6ICdlcmcxJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ2RmMSd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdzZnFmYjInfSxcbiAqICAge2lkOiAzLCBuYW1lOiAncWZzMSd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdxc2dxc2ZnMid9LFxuICogKS5waXBlKFxuICogICBncm91cEJ5KHAgPT4gcC5pZCwgcCA9PiBwLm5hbWUpLFxuICogICBtZXJnZU1hcCggKGdyb3VwJCkgPT4gZ3JvdXAkLnBpcGUocmVkdWNlKChhY2MsIGN1cikgPT4gWy4uLmFjYywgY3VyXSwgW1wiXCIgKyBncm91cCQua2V5XSkpKSxcbiAqICAgbWFwKGFyciA9PiAoeydpZCc6IHBhcnNlSW50KGFyclswXSksICd2YWx1ZXMnOiBhcnIuc2xpY2UoMSl9KSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHAgPT4gY29uc29sZS5sb2cocCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBpZDogMSwgdmFsdWVzOiBbICdhemUxJywgJ2VyZzEnLCAnZGYxJyBdIH1cbiAqIC8vIHsgaWQ6IDIsIHZhbHVlczogWyAnc2YyJywgJ2RnMicsICdzZnFmYjInLCAncXNncXNmZzInIF0gfVxuICogLy8geyBpZDogMywgdmFsdWVzOiBbICdxZnMxJyBdIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBLfSBrZXlTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlIGtleVxuICogZm9yIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBSfSBbZWxlbWVudFNlbGVjdG9yXSBBIGZ1bmN0aW9uIHRoYXQgZXh0cmFjdHMgdGhlXG4gKiByZXR1cm4gZWxlbWVudCBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbihncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLFI+KTogT2JzZXJ2YWJsZTxhbnk+fSBbZHVyYXRpb25TZWxlY3Rvcl1cbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIE9ic2VydmFibGUgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGVhY2ggZ3JvdXAgc2hvdWxkXG4gKiBleGlzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8R3JvdXBlZE9ic2VydmFibGU8SyxSPj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0c1xuICogR3JvdXBlZE9ic2VydmFibGVzLCBlYWNoIG9mIHdoaWNoIGNvcnJlc3BvbmRzIHRvIGEgdW5pcXVlIGtleSB2YWx1ZSBhbmQgZWFjaFxuICogb2Ygd2hpY2ggZW1pdHMgdGhvc2UgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBzaGFyZSB0aGF0IGtleVxuICogdmFsdWUuXG4gKiBAbWV0aG9kIGdyb3VwQnlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICBzb3VyY2UubGlmdChuZXcgR3JvdXBCeU9wZXJhdG9yKGtleVNlbGVjdG9yLCBlbGVtZW50U2VsZWN0b3IsIGR1cmF0aW9uU2VsZWN0b3IsIHN1YmplY3RTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgY291bnQ6IG51bWJlcjtcbiAgdW5zdWJzY3JpYmU6ICgpID0+IHZvaWQ7XG4gIGNsb3NlZDogYm9vbGVhbjtcbiAgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgR3JvdXBCeU9wZXJhdG9yPFQsIEssIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yPzogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBHcm91cEJ5U3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMua2V5U2VsZWN0b3IsIHRoaXMuZWxlbWVudFNlbGVjdG9yLCB0aGlzLmR1cmF0aW9uU2VsZWN0b3IsIHRoaXMuc3ViamVjdFNlbGVjdG9yXG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwQnlTdWJzY3JpYmVyPFQsIEssIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiBpbXBsZW1lbnRzIFJlZkNvdW50U3Vic2NyaXB0aW9uIHtcbiAgcHJpdmF0ZSBncm91cHM6IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4gPSBudWxsO1xuICBwdWJsaWMgYXR0ZW1wdGVkVG9VbnN1YnNjcmliZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgbGV0IGtleTogSztcbiAgICB0cnkge1xuICAgICAga2V5ID0gdGhpcy5rZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZ3JvdXAodmFsdWUsIGtleSk7XG4gIH1cblxuICBwcml2YXRlIF9ncm91cCh2YWx1ZTogVCwga2V5OiBLKSB7XG4gICAgbGV0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuXG4gICAgaWYgKCFncm91cHMpIHtcbiAgICAgIGdyb3VwcyA9IHRoaXMuZ3JvdXBzID0gbmV3IE1hcDxLLCBTdWJqZWN0PFQgfCBSPj4oKTtcbiAgICB9XG5cbiAgICBsZXQgZ3JvdXAgPSBncm91cHMuZ2V0KGtleSk7XG5cbiAgICBsZXQgZWxlbWVudDogUjtcbiAgICBpZiAodGhpcy5lbGVtZW50U2VsZWN0b3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRTZWxlY3Rvcih2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50ID0gPGFueT52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWdyb3VwKSB7XG4gICAgICBncm91cCA9ICh0aGlzLnN1YmplY3RTZWxlY3RvciA/IHRoaXMuc3ViamVjdFNlbGVjdG9yKCkgOiBuZXcgU3ViamVjdDxSPigpKSBhcyBTdWJqZWN0PFQgfCBSPjtcbiAgICAgIGdyb3Vwcy5zZXQoa2V5LCBncm91cCk7XG4gICAgICBjb25zdCBncm91cGVkT2JzZXJ2YWJsZSA9IG5ldyBHcm91cGVkT2JzZXJ2YWJsZShrZXksIGdyb3VwLCB0aGlzKTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChncm91cGVkT2JzZXJ2YWJsZSk7XG4gICAgICBpZiAodGhpcy5kdXJhdGlvblNlbGVjdG9yKSB7XG4gICAgICAgIGxldCBkdXJhdGlvbjogYW55O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvblNlbGVjdG9yKG5ldyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPihrZXksIDxTdWJqZWN0PFI+Pmdyb3VwKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoZHVyYXRpb24uc3Vic2NyaWJlKG5ldyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcihrZXksIGdyb3VwLCB0aGlzKSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ3JvdXAuY2xvc2VkKSB7XG4gICAgICBncm91cC5uZXh0KGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdyb3VwcztcbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBncm91cHMuZm9yRWFjaCgoZ3JvdXAsIGtleSkgPT4ge1xuICAgICAgICBncm91cC5lcnJvcihlcnIpO1xuICAgICAgfSk7XG5cbiAgICAgIGdyb3Vwcy5jbGVhcigpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmNvbXBsZXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlbW92ZUdyb3VwKGtleTogSyk6IHZvaWQge1xuICAgIHRoaXMuZ3JvdXBzLmRlbGV0ZShrZXkpO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKCF0aGlzLmNsb3NlZCkge1xuICAgICAgdGhpcy5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBHcm91cER1cmF0aW9uU3Vic2NyaWJlcjxLLCBUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cDogU3ViamVjdDxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IEdyb3VwQnlTdWJzY3JpYmVyPGFueSwgSywgVCB8IGFueT4pIHtcbiAgICBzdXBlcihncm91cCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IHBhcmVudCwga2V5IH0gPSB0aGlzO1xuICAgIHRoaXMua2V5ID0gdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVHcm91cChrZXkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFuIE9ic2VydmFibGUgcmVwcmVzZW50aW5nIHZhbHVlcyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgZ3JvdXAgcmVwcmVzZW50ZWQgYnlcbiAqIGEgY29tbW9uIGtleS4gVGhlIHZhbHVlcyBlbWl0dGVkIGJ5IGEgR3JvdXBlZE9ic2VydmFibGUgY29tZSBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBjb21tb24ga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUgZmllbGQgYGtleWAgb24gYVxuICogR3JvdXBlZE9ic2VydmFibGUgaW5zdGFuY2UuXG4gKlxuICogQGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBHcm91cGVkT2JzZXJ2YWJsZTxLLCBUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICAvKiogQGRlcHJlY2F0ZWQgRG8gbm90IGNvbnN0cnVjdCB0aGlzIHR5cGUuIEludGVybmFsIHVzZSBvbmx5ICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBrZXk6IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZ3JvdXBTdWJqZWN0OiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlZkNvdW50U3Vic2NyaXB0aW9uPzogUmVmQ291bnRTdWJzY3JpcHRpb24pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgY29uc3QgeyByZWZDb3VudFN1YnNjcmlwdGlvbiwgZ3JvdXBTdWJqZWN0IH0gPSB0aGlzO1xuICAgIGlmIChyZWZDb3VudFN1YnNjcmlwdGlvbiAmJiAhcmVmQ291bnRTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKG5ldyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uKHJlZkNvdW50U3Vic2NyaXB0aW9uKSk7XG4gICAgfVxuICAgIHN1YnNjcmlwdGlvbi5hZGQoZ3JvdXBTdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgSW5uZXJSZWZDb3VudFN1YnNjcmlwdGlvbiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gICAgcGFyZW50LmNvdW50Kys7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICBpZiAoIXBhcmVudC5jbG9zZWQgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgcGFyZW50LmNvdW50IC09IDE7XG4gICAgICBpZiAocGFyZW50LmNvdW50ID09PSAwICYmIHBhcmVudC5hdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlKSB7XG4gICAgICAgIHBhcmVudC51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxpa2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcblxuLyoqXG4gKiBAY2xhc3MgQmVoYXZpb3JTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBCZWhhdmlvclN1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92YWx1ZTogVCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzdXBlci5fc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIGlmIChzdWJzY3JpcHRpb24gJiYgISg8U3Vic2NyaXB0aW9uTGlrZT5zdWJzY3JpcHRpb24pLmNsb3NlZCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuX3ZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIGdldFZhbHVlKCk6IFQge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICB0aHJvdyB0aGlzLnRocm93bkVycm9yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHN1cGVyLm5leHQodGhpcy5fdmFsdWUgPSB2YWx1ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEEgdW5pdCBvZiB3b3JrIHRvIGJlIGV4ZWN1dGVkIGluIGEgYHNjaGVkdWxlcmAuIEFuIGFjdGlvbiBpcyB0eXBpY2FsbHlcbiAqIGNyZWF0ZWQgZnJvbSB3aXRoaW4gYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gYW5kIGFuIFJ4SlMgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGNvbmNlcm5cbiAqIHRoZW1zZWx2ZXMgYWJvdXQgY3JlYXRpbmcgYW5kIG1hbmlwdWxhdGluZyBhbiBBY3Rpb24uXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIEFjdGlvbjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gKiAgIG5ldyAoc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6IChzdGF0ZT86IFQpID0+IHZvaWQpO1xuICogICBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uO1xuICogfVxuICogYGBgXG4gKlxuICogQGNsYXNzIEFjdGlvbjxUPlxuICovXG5leHBvcnQgY2xhc3MgQWN0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3Ioc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyB0aGlzIGFjdGlvbiBvbiBpdHMgcGFyZW50IHtAbGluayBTY2hlZHVsZXJMaWtlfSBmb3IgZXhlY3V0aW9uLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAuIE1heSBoYXBwZW4gYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLFxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIGBkZWxheWAgcGFyYW1ldGVyLCBpZiBzcGVjaWZpZWQuXG4gICAqIEBwYXJhbSB7VH0gW3N0YXRlXSBTb21lIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBgd29ya2AgZnVuY3Rpb24gdXNlcyB3aGVuXG4gICAqIGNhbGxlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL0FjdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY0FjdGlvbjxUPiBleHRlbmRzIEFjdGlvbjxUPiB7XG5cbiAgcHVibGljIGlkOiBhbnk7XG4gIHB1YmxpYyBzdGF0ZTogVDtcbiAgcHVibGljIGRlbGF5OiBudW1iZXI7XG4gIHByb3RlY3RlZCBwZW5kaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBBbHdheXMgcmVwbGFjZSB0aGUgY3VycmVudCBzdGF0ZSB3aXRoIHRoZSBuZXcgc3RhdGUuXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuXG4gICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuXG4gICAgLy9cbiAgICAvLyBJbXBvcnRhbnQgaW1wbGVtZW50YXRpb24gbm90ZTpcbiAgICAvL1xuICAgIC8vIEFjdGlvbnMgb25seSBleGVjdXRlIG9uY2UgYnkgZGVmYXVsdCwgdW5sZXNzIHJlc2NoZWR1bGVkIGZyb20gd2l0aGluIHRoZVxuICAgIC8vIHNjaGVkdWxlZCBjYWxsYmFjay4gVGhpcyBhbGxvd3MgdXMgdG8gaW1wbGVtZW50IHNpbmdsZSBhbmQgcmVwZWF0XG4gICAgLy8gYWN0aW9ucyB2aWEgdGhlIHNhbWUgY29kZSBwYXRoLCB3aXRob3V0IGFkZGluZyBBUEkgc3VyZmFjZSBhcmVhLCBhcyB3ZWxsXG4gICAgLy8gYXMgbWltaWMgdHJhZGl0aW9uYWwgcmVjdXJzaW9uIGJ1dCBhY3Jvc3MgYXN5bmNocm9ub3VzIGJvdW5kYXJpZXMuXG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCBKUyBydW50aW1lcyBhbmQgdGltZXJzIGRpc3Rpbmd1aXNoIGJldHdlZW4gaW50ZXJ2YWxzIGFjaGlldmVkIGJ5XG4gICAgLy8gc2VyaWFsIGBzZXRUaW1lb3V0YCBjYWxscyB2cy4gYSBzaW5nbGUgYHNldEludGVydmFsYCBjYWxsLiBBbiBpbnRlcnZhbCBvZlxuICAgIC8vIHNlcmlhbCBgc2V0VGltZW91dGAgY2FsbHMgY2FuIGJlIGluZGl2aWR1YWxseSBkZWxheWVkLCB3aGljaCBkZWxheXNcbiAgICAvLyBzY2hlZHVsaW5nIHRoZSBuZXh0IGBzZXRUaW1lb3V0YCwgYW5kIHNvIG9uLiBgc2V0SW50ZXJ2YWxgIGF0dGVtcHRzIHRvXG4gICAgLy8gZ3VhcmFudGVlIHRoZSBpbnRlcnZhbCBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgbW9yZSBwcmVjaXNlbHkgdG8gdGhlXG4gICAgLy8gaW50ZXJ2YWwgcGVyaW9kLCByZWdhcmRsZXNzIG9mIGxvYWQuXG4gICAgLy9cbiAgICAvLyBUaGVyZWZvcmUsIHdlIHVzZSBgc2V0SW50ZXJ2YWxgIHRvIHNjaGVkdWxlIHNpbmdsZSBhbmQgcmVwZWF0IGFjdGlvbnMuXG4gICAgLy8gSWYgdGhlIGFjdGlvbiByZXNjaGVkdWxlcyBpdHNlbGYgd2l0aCB0aGUgc2FtZSBkZWxheSwgdGhlIGludGVydmFsIGlzIG5vdFxuICAgIC8vIGNhbmNlbGVkLiBJZiB0aGUgYWN0aW9uIGRvZXNuJ3QgcmVzY2hlZHVsZSwgb3IgcmVzY2hlZHVsZXMgd2l0aCBhXG4gICAgLy8gZGlmZmVyZW50IGRlbGF5LCB0aGUgaW50ZXJ2YWwgd2lsbCBiZSBjYW5jZWxlZCBhZnRlciBzY2hlZHVsZWQgY2FsbGJhY2tcbiAgICAvLyBleGVjdXRpb24uXG4gICAgLy9cbiAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgcGVuZGluZyBmbGFnIGluZGljYXRpbmcgdGhhdCB0aGlzIGFjdGlvbiBoYXMgYmVlbiBzY2hlZHVsZWQsIG9yXG4gICAgLy8gaGFzIHJlY3Vyc2l2ZWx5IHJlc2NoZWR1bGVkIGl0c2VsZi5cbiAgICB0aGlzLnBlbmRpbmcgPSB0cnVlO1xuXG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIElmIHRoaXMgYWN0aW9uIGhhcyBhbHJlYWR5IGFuIGFzeW5jIElkLCBkb24ndCByZXF1ZXN0IGEgbmV3IG9uZS5cbiAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCB0aGlzLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgdGhpcy5pZCwgZGVsYXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICByZXR1cm4gc2V0SW50ZXJ2YWwoc2NoZWR1bGVyLmZsdXNoLmJpbmQoc2NoZWR1bGVyLCB0aGlzKSwgZGVsYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsIGlkOiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiB0aGlzIGFjdGlvbiBpcyByZXNjaGVkdWxlZCB3aXRoIHRoZSBzYW1lIGRlbGF5IHRpbWUsIGRvbid0IGNsZWFyIHRoZSBpbnRlcnZhbCBpZC5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgdGhpcy5kZWxheSA9PT0gZGVsYXkgJiYgdGhpcy5wZW5kaW5nID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSBhY3Rpb24ncyBkZWxheSB0aW1lIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IGRlbGF5LFxuICAgIC8vIG9yIHRoZSBhY3Rpb24gaGFzIGJlZW4gcmVzY2hlZHVsZWQgYmVmb3JlIGl0J3MgZXhlY3V0ZWQsIGNsZWFyIHRoZSBpbnRlcnZhbCBpZFxuICAgIHJldHVybiBjbGVhckludGVydmFsKGlkKSAmJiB1bmRlZmluZWQgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEltbWVkaWF0ZWx5IGV4ZWN1dGVzIHRoaXMgYWN0aW9uIGFuZCB0aGUgYHdvcmtgIGl0IGNvbnRhaW5zLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBwdWJsaWMgZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2V4ZWN1dGluZyBhIGNhbmNlbGxlZCBhY3Rpb24nKTtcbiAgICB9XG5cbiAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvciA9IHRoaXMuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMucGVuZGluZyA9PT0gZmFsc2UgJiYgdGhpcy5pZCAhPSBudWxsKSB7XG4gICAgICAvLyBEZXF1ZXVlIGlmIHRoZSBhY3Rpb24gZGlkbid0IHJlc2NoZWR1bGUgaXRzZWxmLiBEb24ndCBjYWxsXG4gICAgICAvLyB1bnN1YnNjcmliZSgpLCBiZWNhdXNlIHRoZSBhY3Rpb24gY291bGQgcmVzY2hlZHVsZSBsYXRlci5cbiAgICAgIC8vIEZvciBleGFtcGxlOlxuICAgICAgLy8gYGBgXG4gICAgICAvLyBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gZG9Xb3JrKGNvdW50ZXIpIHtcbiAgICAgIC8vICAgLyogLi4uIEknbSBhIGJ1c3kgd29ya2VyIGJlZSAuLi4gKi9cbiAgICAgIC8vICAgdmFyIG9yaWdpbmFsQWN0aW9uID0gdGhpcztcbiAgICAgIC8vICAgLyogd2FpdCAxMDBtcyBiZWZvcmUgcmVzY2hlZHVsaW5nIHRoZSBhY3Rpb24gKi9cbiAgICAgIC8vICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyAgICAgb3JpZ2luYWxBY3Rpb24uc2NoZWR1bGUoY291bnRlciArIDEpO1xuICAgICAgLy8gICB9LCAxMDApO1xuICAgICAgLy8gfSwgMTAwMCk7XG4gICAgICAvLyBgYGBcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHRoaXMuc2NoZWR1bGVyLCB0aGlzLmlkLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2V4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuICAgIGxldCBlcnJvcmVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgbGV0IGVycm9yVmFsdWU6IGFueSA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgdGhpcy53b3JrKHN0YXRlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgIGVycm9yVmFsdWUgPSAhIWUgJiYgZSB8fCBuZXcgRXJyb3IoZSk7XG4gICAgfVxuICAgIGlmIChlcnJvcmVkKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICByZXR1cm4gZXJyb3JWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcblxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcbiAgICBjb25zdCBhY3Rpb25zID0gc2NoZWR1bGVyLmFjdGlvbnM7XG4gICAgY29uc3QgaW5kZXggPSBhY3Rpb25zLmluZGV4T2YodGhpcyk7XG5cbiAgICB0aGlzLndvcmsgID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBhY3Rpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuZGVsYXkgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgUXVldWVBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogUXVldWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuc2NoZWR1bGVyLmZsdXNoKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHVibGljIGV4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuICAgIHJldHVybiAoZGVsYXkgPiAwIHx8IHRoaXMuY2xvc2VkKSA/XG4gICAgICBzdXBlci5leGVjdXRlKHN0YXRlLCBkZWxheSkgOlxuICAgICAgdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpIDtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IFF1ZXVlU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGV4aXN0cyBhbmQgaXMgZ3JlYXRlciB0aGFuIDAsIG9yIGlmIHRoZSBkZWxheSBpcyBudWxsICh0aGVcbiAgICAvLyBhY3Rpb24gd2Fzbid0IHJlc2NoZWR1bGVkKSBidXQgd2FzIG9yaWdpbmFsbHkgc2NoZWR1bGVkIGFzIGFuIGFzeW5jXG4gICAgLy8gYWN0aW9uLCB0aGVuIHJlY3ljbGUgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmICgoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UgZmx1c2ggdGhlIHNjaGVkdWxlciBzdGFydGluZyB3aXRoIHRoaXMgYWN0aW9uLlxuICAgIHJldHVybiBzY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vc2NoZWR1bGVyL0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBBbiBleGVjdXRpb24gY29udGV4dCBhbmQgYSBkYXRhIHN0cnVjdHVyZSB0byBvcmRlciB0YXNrcyBhbmQgc2NoZWR1bGUgdGhlaXJcbiAqIGV4ZWN1dGlvbi4gUHJvdmlkZXMgYSBub3Rpb24gb2YgKHBvdGVudGlhbGx5IHZpcnR1YWwpIHRpbWUsIHRocm91Z2ggdGhlXG4gKiBgbm93KClgIGdldHRlciBtZXRob2QuXG4gKlxuICogRWFjaCB1bml0IG9mIHdvcmsgaW4gYSBTY2hlZHVsZXIgaXMgY2FsbGVkIGFuIGBBY3Rpb25gLlxuICpcbiAqIGBgYHRzXG4gKiBjbGFzcyBTY2hlZHVsZXIge1xuICogICBub3coKTogbnVtYmVyO1xuICogICBzY2hlZHVsZSh3b3JrLCBkZWxheT8sIHN0YXRlPyk6IFN1YnNjcmlwdGlvbjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBjbGFzcyBTY2hlZHVsZXJcbiAqIEBkZXByZWNhdGVkIFNjaGVkdWxlciBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgUnhKUywgYW5kXG4gKiBzaG91bGQgbm90IGJlIHVzZWQgZGlyZWN0bHkuIFJhdGhlciwgY3JlYXRlIHlvdXIgb3duIGNsYXNzIGFuZCBpbXBsZW1lbnRcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfVxuICovXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIGltcGxlbWVudHMgU2NoZWR1bGVyTGlrZSB7XG5cbiAgLyoqXG4gICAqIE5vdGU6IHRoZSBleHRyYSBhcnJvdyBmdW5jdGlvbiB3cmFwcGVyIGlzIHRvIG1ha2UgdGVzdGluZyBieSBvdmVycmlkaW5nXG4gICAqIERhdGUubm93IGVhc2llci5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm93OiAoKSA9PiBudW1iZXIgPSAoKSA9PiBEYXRlLm5vdygpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQWN0aW9uLFxuICAgICAgICAgICAgICBub3c6ICgpID0+IG51bWJlciA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICB0aGlzLm5vdyA9IG5vdztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGdldHRlciBtZXRob2QgdGhhdCByZXR1cm5zIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCB0aW1lXG4gICAqIChhdCB0aGUgdGltZSB0aGlzIGZ1bmN0aW9uIHdhcyBjYWxsZWQpIGFjY29yZGluZyB0byB0aGUgc2NoZWR1bGVyJ3Mgb3duXG4gICAqIGludGVybmFsIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IEEgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyB0aGUgY3VycmVudCB0aW1lLiBNYXkgb3IgbWF5IG5vdFxuICAgKiBoYXZlIGEgcmVsYXRpb24gdG8gd2FsbC1jbG9jayB0aW1lLiBNYXkgb3IgbWF5IG5vdCByZWZlciB0byBhIHRpbWUgdW5pdFxuICAgKiAoZS5nLiBtaWxsaXNlY29uZHMpLlxuICAgKi9cbiAgcHVibGljIG5vdzogKCkgPT4gbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSBmdW5jdGlvbiwgYHdvcmtgLCBmb3IgZXhlY3V0aW9uLiBNYXkgaGFwcGVuIGF0IHNvbWUgcG9pbnQgaW5cbiAgICogdGhlIGZ1dHVyZSwgYWNjb3JkaW5nIHRvIHRoZSBgZGVsYXlgIHBhcmFtZXRlciwgaWYgc3BlY2lmaWVkLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAsIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBgd29ya2AgZnVuY3Rpb24uXG4gICAqXG4gICAqIFRoZSBnaXZlbiBhcmd1bWVudHMgd2lsbCBiZSBwcm9jZXNzZWQgYW4gc3RvcmVkIGFzIGFuIEFjdGlvbiBvYmplY3QgaW4gYVxuICAgKiBxdWV1ZSBvZiBhY3Rpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0YXRlOiA/VCk6ID9TdWJzY3JpcHRpb259IHdvcmsgQSBmdW5jdGlvbiByZXByZXNlbnRpbmcgYVxuICAgKiB0YXNrLCBvciBzb21lIHVuaXQgb2Ygd29yayB0byBiZSBleGVjdXRlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyIGl0c2VsZi5cbiAgICogQHBhcmFtIHtUfSBbc3RhdGVdIFNvbWUgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIGB3b3JrYCBmdW5jdGlvbiB1c2VzIHdoZW5cbiAgICogY2FsbGVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gQSBzdWJzY3JpcHRpb24gaW4gb3JkZXIgdG8gYmUgYWJsZSB0byB1bnN1YnNjcmliZVxuICAgKiB0aGUgc2NoZWR1bGVkIHdvcmsuXG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGU8VD4od29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLCBkZWxheTogbnVtYmVyID0gMCwgc3RhdGU/OiBUKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuU2NoZWR1bGVyQWN0aW9uPFQ+KHRoaXMsIHdvcmspLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuZXhwb3J0IGNsYXNzIEFzeW5jU2NoZWR1bGVyIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgcHVibGljIHN0YXRpYyBkZWxlZ2F0ZT86IFNjaGVkdWxlcjtcbiAgcHVibGljIGFjdGlvbnM6IEFycmF5PEFzeW5jQWN0aW9uPGFueT4+ID0gW107XG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGUgU2NoZWR1bGVyIGlzIGN1cnJlbnRseSBleGVjdXRpbmcgYSBiYXRjaCBvZlxuICAgKiBxdWV1ZWQgYWN0aW9ucy5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBkZXByZWNhdGVkIGludGVybmFsIHVzZSBvbmx5XG4gICAqL1xuICBwdWJsaWMgYWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIC8qKlxuICAgKiBBbiBpbnRlcm5hbCBJRCB1c2VkIHRvIHRyYWNrIHRoZSBsYXRlc3QgYXN5bmNocm9ub3VzIHRhc2sgc3VjaCBhcyB0aG9zZVxuICAgKiBjb21pbmcgZnJvbSBgc2V0VGltZW91dGAsIGBzZXRJbnRlcnZhbGAsIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLCBhbmRcbiAgICogb3RoZXJzLlxuICAgKiBAdHlwZSB7YW55fVxuICAgKiBAZGVwcmVjYXRlZCBpbnRlcm5hbCB1c2Ugb25seVxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlZDogYW55ID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFjdGlvbixcbiAgICAgICAgICAgICAgbm93OiAoKSA9PiBudW1iZXIgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgc3VwZXIoU2NoZWR1bGVyQWN0aW9uLCAoKSA9PiB7XG4gICAgICBpZiAoQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgJiYgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgIT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlLm5vdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5vdygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlPFQ+KHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCwgZGVsYXk6IG51bWJlciA9IDAsIHN0YXRlPzogVCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICYmIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICE9PSB0aGlzKSB7XG4gICAgICByZXR1cm4gQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUuc2NoZWR1bGUod29yaywgZGVsYXksIHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHdvcmssIGRlbGF5LCBzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZsdXNoKGFjdGlvbjogQXN5bmNBY3Rpb248YW55Pik6IHZvaWQge1xuXG4gICAgY29uc3Qge2FjdGlvbnN9ID0gdGhpcztcblxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSk7IC8vIGV4aGF1c3QgdGhlIHNjaGVkdWxlciBxdWV1ZVxuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuZXhwb3J0IGNsYXNzIFF1ZXVlU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xufVxuIiwiaW1wb3J0IHsgUXVldWVBY3Rpb24gfSBmcm9tICcuL1F1ZXVlQWN0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIFF1ZXVlIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QdXQgZXZlcnkgbmV4dCB0YXNrIG9uIGEgcXVldWUsIGluc3RlYWQgb2YgZXhlY3V0aW5nIGl0IGltbWVkaWF0ZWx5PC9zcGFuPlxuICpcbiAqIGBxdWV1ZWAgc2NoZWR1bGVyLCB3aGVuIHVzZWQgd2l0aCBkZWxheSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiBXaGVuIHVzZWQgd2l0aG91dCBkZWxheSwgaXQgc2NoZWR1bGVzIGdpdmVuIHRhc2sgc3luY2hyb25vdXNseSAtIGV4ZWN1dGVzIGl0IHJpZ2h0IHdoZW5cbiAqIGl0IGlzIHNjaGVkdWxlZC4gSG93ZXZlciB3aGVuIGNhbGxlZCByZWN1cnNpdmVseSwgdGhhdCBpcyB3aGVuIGluc2lkZSB0aGUgc2NoZWR1bGVkIHRhc2ssXG4gKiBhbm90aGVyIHRhc2sgaXMgc2NoZWR1bGVkIHdpdGggcXVldWUgc2NoZWR1bGVyLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpbW1lZGlhdGVseSBhcyB3ZWxsLFxuICogdGhhdCB0YXNrIHdpbGwgYmUgcHV0IG9uIGEgcXVldWUgYW5kIHdhaXQgZm9yIGN1cnJlbnQgb25lIHRvIGZpbmlzaC5cbiAqXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2hlbiB5b3UgZXhlY3V0ZSB0YXNrIHdpdGggYHF1ZXVlYCBzY2hlZHVsZXIsIHlvdSBhcmUgc3VyZSBpdCB3aWxsIGVuZFxuICogYmVmb3JlIGFueSBvdGhlciB0YXNrIHNjaGVkdWxlZCB3aXRoIHRoYXQgc2NoZWR1bGVyIHdpbGwgc3RhcnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNjaGVkdWxlIHJlY3Vyc2l2ZWx5IGZpcnN0LCB0aGVuIGRvIHNvbWV0aGluZ1xuICogYGBgamF2YXNjcmlwdFxuICogUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IHtcbiAqICAgUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdzZWNvbmQnKSk7IC8vIHdpbGwgbm90IGhhcHBlbiBub3csIGJ1dCB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlXG4gKlxuICogICBjb25zb2xlLmxvZygnZmlyc3QnKTtcbiAqIH0pO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqIC8vIFwic2Vjb25kXCJcbiAqIGBgYFxuICpcbiAqIFJlc2NoZWR1bGUgaXRzZWxmIHJlY3Vyc2l2ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIucXVldWUuc2NoZWR1bGUoZnVuY3Rpb24oc3RhdGUpIHtcbiAqICAgaWYgKHN0YXRlICE9PSAwKSB7XG4gKiAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHN0YXRlKTtcbiAqICAgICB0aGlzLnNjaGVkdWxlKHN0YXRlIC0gMSk7IC8vIGB0aGlzYCByZWZlcmVuY2VzIGN1cnJlbnRseSBleGVjdXRpbmcgQWN0aW9uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZVxuICogICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIHN0YXRlKTtcbiAqICAgfVxuICogfSwgMCwgMyk7XG4gKlxuICogLy8gSW4gc2NoZWR1bGVyIHRoYXQgcnVucyByZWN1cnNpdmVseSwgeW91IHdvdWxkIGV4cGVjdDpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYmVmb3JlXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDNcbiAqXG4gKiAvLyBCdXQgd2l0aCBxdWV1ZSBpdCBsb2dzOlxuICogLy8gXCJiZWZvcmVcIiwgM1xuICogLy8gXCJhZnRlclwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBxdWV1ZVxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZVNjaGVkdWxlcihRdWV1ZUFjdGlvbik7XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBzYW1lIE9ic2VydmFibGUgaW5zdGFuY2UgcmV0dXJuZWQgYnkgYW55IGNhbGwgdG8ge0BsaW5rIGVtcHR5fSB3aXRob3V0IGFcbiAqIGBzY2hlZHVsZXJgLiBJdCBpcyBwcmVmZXJyYWJsZSB0byB1c2UgdGhpcyBvdmVyIGBlbXB0eSgpYC5cbiAqL1xuZXhwb3J0IGNvbnN0IEVNUFRZID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBubyBpdGVtcyB0byB0aGUgT2JzZXJ2ZXIgYW5kIGltbWVkaWF0ZWx5XG4gKiBlbWl0cyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SnVzdCBlbWl0cyAnY29tcGxldGUnLCBhbmQgbm90aGluZyBlbHNlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShlbXB0eS5wbmcpXG4gKlxuICogVGhpcyBzdGF0aWMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBjcmVhdGluZyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgb25seVxuICogZW1pdHMgdGhlIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcywgc3VjaCBhcyBpbiBhIHtAbGluayBtZXJnZU1hcH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBjb21wbGV0ZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgcmVzdWx0ID0gZW1wdHkoKS5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogIyMjIE1hcCBhbmQgZmxhdHRlbiBvbmx5IG9kZCBudW1iZXJzIHRvIHRoZSBzZXF1ZW5jZSAnYScsICdiJywgJ2MnXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBpbnRlcnZhbCQgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIHJlc3VsdCA9IGludGVydmFsJC5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggJSAyID09PSAxID8gb2YoJ2EnLCAnYicsICdjJykgOiBlbXB0eSgpKSxcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyB0byB0aGUgY29uc29sZTpcbiAqIC8vIHggaXMgZXF1YWwgdG8gdGhlIGNvdW50IG9uIHRoZSBpbnRlcnZhbCBlZygwLDEsMiwzLC4uLilcbiAqIC8vIHggd2lsbCBvY2N1ciBldmVyeSAxMDAwbXNcbiAqIC8vIGlmIHggJSAyIGlzIGVxdWFsIHRvIDEgcHJpbnQgYWJjXG4gKiAvLyBpZiB4ICUgMiBpcyBub3QgZXF1YWwgdG8gMSBub3RoaW5nIHdpbGwgYmUgb3V0cHV0XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gXCJlbXB0eVwiIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGNvbXBsZXRlXG4gKiBub3RpZmljYXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGVtcHR5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiB1c2luZyBFTVBUWSBjb25zdGFudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5KHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgcmV0dXJuIHNjaGVkdWxlciA/IGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcikgOiBFTVBUWTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8bmV2ZXI+KHN1YnNjcmliZXIgPT4gc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSkpO1xufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBTY2hlZHVsZXJMaWtlIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiAoPGFueT52YWx1ZSkuc2NoZWR1bGUgPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogU3Vic2NyaWJlcyB0byBhbiBBcnJheUxpa2Ugd2l0aCBhIHN1YnNjcmliZXJcbiAqIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgb3IgYXJyYXktbGlrZSB0byBzdWJzY3JpYmUgdG9cbiAqL1xuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvQXJyYXkgPSA8VD4oYXJyYXk6IEFycmF5TGlrZTxUPikgPT4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgIHN1YnNjcmliZXIubmV4dChhcnJheVtpXSk7XG4gIH1cbiAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9BcnJheSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9BcnJheSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQXJyYXk8VD4oaW5wdXQ6IEFycmF5TGlrZTxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb0FycmF5KGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA9PT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5wdXRbaSsrXSk7XG4gICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICBzdWIuYWRkKHRoaXMuc2NoZWR1bGUoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxhcjxUPih2YWx1ZTogVCkge1xuICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgfSk7XG4gIHJlc3VsdC5faXNTY2FsYXIgPSB0cnVlO1xuICAocmVzdWx0IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHNjYWxhciB9IGZyb20gJy4vc2NhbGFyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oYTogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDI+KGE6IFQsIGI6IFQyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMz4oYTogVCwgYjogVDIsIGM6IFQzLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUND4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDU+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNz4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNywgVDg+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIGg6IFQ4LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDg+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDcsIFQ4LCBUOT4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgaDogVDgsIGk6IFQ5LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDggfCBUOT47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29udmVydHMgdGhlIGFyZ3VtZW50cyB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FYWNoIGFyZ3VtZW50IGJlY29tZXMgYSBgbmV4dGAgbm90aWZpY2F0aW9uLjwvc3Bhbj5cbiAqXG4gKiAhW10ob2YucG5nKVxuICpcbiAqIFVubGlrZSB7QGxpbmsgZnJvbX0sIGl0IGRvZXMgbm90IGRvIGFueSBmbGF0dGVuaW5nIGFuZCBlbWl0cyBlYWNoIGFyZ3VtZW50IGluIHdob2xlXG4gKiBhcyBhIHNlcGFyYXRlIGBuZXh0YCBub3RpZmljYXRpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBFbWl0IHRoZSB2YWx1ZXMgYDEwLCAyMCwgMzBgXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoMTAsIDIwLCAzMClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogMTAnXG4gKiAvLyAnbmV4dDogMjAnXG4gKiAvLyAnbmV4dDogMzAnXG4gKlxuICogYGBgXG4gKlxuICogRW1pdCB0aGUgYXJyYXkgYFsxLDIsM11gXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoWzEsMiwzXSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogWzEsMiwzXSdcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayByYW5nZX1cbiAqXG4gKiBAcGFyYW0gey4uLlR9IHZhbHVlcyBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGFyZ3VtZW50cyB5b3Ugd2FudCB0byBiZSBlbWl0dGVkXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGFyZ3VtZW50c1xuICogZGVzY3JpYmVkIGFib3ZlIGFuZCB0aGVuIGNvbXBsZXRlcy5cbiAqIEBtZXRob2Qgb2ZcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KC4uLmFyZ3M6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VD4ge1xuICBsZXQgc2NoZWR1bGVyID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIGFzIFNjaGVkdWxlckxpa2U7XG4gIGlmIChpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgYXJncy5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZXIgPSB1bmRlZmluZWQ7XG4gIH1cbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBlbXB0eShzY2hlZHVsZXIpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBzY2hlZHVsZXIgPyBmcm9tQXJyYXkoYXJncyBhcyBUW10sIHNjaGVkdWxlcikgOiBzY2FsYXIoYXJnc1swXSBhcyBUKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBubyBpdGVtcyB0byB0aGUgT2JzZXJ2ZXIgYW5kIGltbWVkaWF0ZWx5XG4gKiBlbWl0cyBhbiBlcnJvciBub3RpZmljYXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkp1c3QgZW1pdHMgJ2Vycm9yJywgYW5kIG5vdGhpbmcgZWxzZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10odGhyb3cucG5nKVxuICpcbiAqIFRoaXMgc3RhdGljIG9wZXJhdG9yIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmcgYSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IG9ubHlcbiAqIGVtaXRzIHRoZSBlcnJvciBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMsIHN1Y2ggYXMgaW4gYSB7QGxpbmsgbWVyZ2VNYXB9LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdCB0aGUgbnVtYmVyIDcsIHRoZW4gZW1pdCBhbiBlcnJvclxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgdGhyb3dFcnJvciwgY29uY2F0LCBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdChvZig3KSwgdGhyb3dFcnJvcihuZXcgRXJyb3IoJ29vcHMhJykpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYGphdmFzY3JpcHRcbiAqXG4gKiAjIyMgTWFwIGFuZCBmbGF0dGVuIG51bWJlcnMgdG8gdGhlIHNlcXVlbmNlICdhJywgJ2InLCAnYycsIGJ1dCB0aHJvdyBhbiBlcnJvciBmb3IgMTNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRocm93RXJyb3IsIGludGVydmFsLCBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJ2YWwoMTAwMCkucGlwZShcbiAqICAgbWVyZ2VNYXAoeCA9PiB4ID09PSAxM1xuICogICAgID8gdGhyb3dFcnJvcignVGhpcnRlZW5zIGFyZSBiYWQnKVxuICogICAgIDogb2YoJ2EnLCAnYicsICdjJylcbiAqICAgKSxcbiAqICkuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBlbXB0eX1cbiAqIEBzZWUge0BsaW5rIG5ldmVyfVxuICogQHNlZSB7QGxpbmsgb2Z9XG4gKlxuICogQHBhcmFtIHthbnl9IGVycm9yIFRoZSBwYXJ0aWN1bGFyIEVycm9yIHRvIHBhc3MgdG8gdGhlIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdGhlIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIGVycm9yIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGVycm9yIG5vdGlmaWNhdGlvblxuICogdXNpbmcgdGhlIGdpdmVuIGVycm9yIGFyZ3VtZW50LlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aHJvd1xuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3I6IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bmV2ZXI+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLmVycm9yKGVycm9yKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4gc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCAwLCB7IGVycm9yLCBzdWJzY3JpYmVyIH0pKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hBcmcge1xuICBlcnJvcjogYW55O1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHsgZXJyb3IsIHN1YnNjcmliZXIgfTogRGlzcGF0Y2hBcmcpIHtcbiAgc3Vic2NyaWJlci5lcnJvcihlcnJvcik7XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgb2YgfSBmcm9tICcuL29ic2VydmFibGUvb2YnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcHVzaC1iYXNlZCBldmVudCBvciB2YWx1ZSB0aGF0IGFuIHtAbGluayBPYnNlcnZhYmxlfSBjYW4gZW1pdC5cbiAqIFRoaXMgY2xhc3MgaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3Igb3BlcmF0b3JzIHRoYXQgbWFuYWdlIG5vdGlmaWNhdGlvbnMsXG4gKiBsaWtlIHtAbGluayBtYXRlcmlhbGl6ZX0sIHtAbGluayBkZW1hdGVyaWFsaXplfSwge0BsaW5rIG9ic2VydmVPbn0sIGFuZFxuICogb3RoZXJzLiBCZXNpZGVzIHdyYXBwaW5nIHRoZSBhY3R1YWwgZGVsaXZlcmVkIHZhbHVlLCBpdCBhbHNvIGFubm90YXRlcyBpdFxuICogd2l0aCBtZXRhZGF0YSBvZiwgZm9yIGluc3RhbmNlLCB3aGF0IHR5cGUgb2YgcHVzaCBtZXNzYWdlIGl0IGlzIChgbmV4dGAsXG4gKiBgZXJyb3JgLCBvciBgY29tcGxldGVgKS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXRlcmlhbGl6ZX1cbiAqIEBzZWUge0BsaW5rIGRlbWF0ZXJpYWxpemV9XG4gKiBAc2VlIHtAbGluayBvYnNlcnZlT259XG4gKlxuICogQGNsYXNzIE5vdGlmaWNhdGlvbjxUPlxuICovXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uPFQ+IHtcbiAgaGFzVmFsdWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGtpbmQ6IHN0cmluZywgcHVibGljIHZhbHVlPzogVCwgcHVibGljIGVycm9yPzogYW55KSB7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IGtpbmQgPT09ICdOJztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxpdmVycyB0byB0aGUgZ2l2ZW4gYG9ic2VydmVyYCB0aGUgdmFsdWUgd3JhcHBlZCBieSB0aGlzIE5vdGlmaWNhdGlvbi5cbiAgICogQHBhcmFtIHtPYnNlcnZlcn0gb2JzZXJ2ZXJcbiAgICogQHJldHVyblxuICAgKi9cbiAgb2JzZXJ2ZShvYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+KTogYW55IHtcbiAgICBzd2l0Y2ggKHRoaXMua2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLmVycm9yICYmIG9ic2VydmVyLmVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5jb21wbGV0ZSAmJiBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBzb21lIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2tzLCBkZWxpdmVyIHRoZSB2YWx1ZSByZXByZXNlbnRlZCBieSB0aGVcbiAgICogY3VycmVudCBOb3RpZmljYXRpb24gdG8gdGhlIGNvcnJlY3RseSBjb3JyZXNwb25kaW5nIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gbmV4dCBBbiBPYnNlcnZlciBgbmV4dGAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZXJyOiBhbnkpOiB2b2lkfSBbZXJyb3JdIEFuIE9ic2VydmVyIGBlcnJvcmAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBBbiBPYnNlcnZlciBgY29tcGxldGVgIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBkbyhuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIGVycm9yPzogKGVycjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBhbnkge1xuICAgIGNvbnN0IGtpbmQgPSB0aGlzLmtpbmQ7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG5leHQgJiYgbmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gZXJyb3IgJiYgZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlICYmIGNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIE9ic2VydmVyIG9yIGl0cyBpbmRpdmlkdWFsIGNhbGxiYWNrIGZ1bmN0aW9ucywgYW5kIGNhbGxzIGBvYnNlcnZlYFxuICAgKiBvciBgZG9gIG1ldGhvZHMgYWNjb3JkaW5nbHkuXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBuZXh0T3JPYnNlcnZlciBBbiBPYnNlcnZlciBvclxuICAgKiB0aGUgYG5leHRgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGVycjogYW55KTogdm9pZH0gW2Vycm9yXSBBbiBPYnNlcnZlciBgZXJyb3JgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gQW4gT2JzZXJ2ZXIgYGNvbXBsZXRlYCBjYWxsYmFjay5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgYWNjZXB0KG5leHRPck9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSwgZXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIGlmIChuZXh0T3JPYnNlcnZlciAmJiB0eXBlb2YgKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+bmV4dE9yT2JzZXJ2ZXIpLm5leHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLm9ic2VydmUoPFBhcnRpYWxPYnNlcnZlcjxUPj5uZXh0T3JPYnNlcnZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRvKDwodmFsdWU6IFQpID0+IHZvaWQ+bmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IGp1c3QgZGVsaXZlcnMgdGhlIG5vdGlmaWNhdGlvbiByZXByZXNlbnRlZFxuICAgKiBieSB0aGlzIE5vdGlmaWNhdGlvbiBpbnN0YW5jZS5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgdG9PYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGtpbmQgPSB0aGlzLmtpbmQ7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG9mKHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgbm90aWZpY2F0aW9uIGtpbmQgdmFsdWUnKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNvbXBsZXRlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oJ0MnKTtcbiAgcHJpdmF0ZSBzdGF0aWMgdW5kZWZpbmVkVmFsdWVOb3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+ID0gbmV3IE5vdGlmaWNhdGlvbignTicsIHVuZGVmaW5lZCk7XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBuZXh0YCBmcm9tIGFcbiAgICogZ2l2ZW4gdmFsdWUuXG4gICAqIEBwYXJhbSB7VH0gdmFsdWUgVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPFQ+fSBUaGUgXCJuZXh0XCIgTm90aWZpY2F0aW9uIHJlcHJlc2VudGluZyB0aGVcbiAgICogYXJndW1lbnQuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlTmV4dDxUPih2YWx1ZTogVCk6IE5vdGlmaWNhdGlvbjxUPiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKCdOJywgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gTm90aWZpY2F0aW9uLnVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBlcnJvcmAgZnJvbSBhXG4gICAqIGdpdmVuIGVycm9yLlxuICAgKiBAcGFyYW0ge2FueX0gW2Vycl0gVGhlIGBlcnJvcmAgZXJyb3IuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxUPn0gVGhlIFwiZXJyb3JcIiBOb3RpZmljYXRpb24gcmVwcmVzZW50aW5nIHRoZVxuICAgKiBhcmd1bWVudC5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVFcnJvcjxUPihlcnI/OiBhbnkpOiBOb3RpZmljYXRpb248VD4ge1xuICAgIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLCBlcnIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc2hvcnRjdXQgdG8gY3JlYXRlIGEgTm90aWZpY2F0aW9uIGluc3RhbmNlIG9mIHRoZSB0eXBlIGBjb21wbGV0ZWAuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxhbnk+fSBUaGUgdmFsdWVsZXNzIFwiY29tcGxldGVcIiBOb3RpZmljYXRpb24uXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlQ29tcGxldGUoKTogTm90aWZpY2F0aW9uPGFueT4ge1xuICAgIHJldHVybiBOb3RpZmljYXRpb24uY29tcGxldGVOb3RpZmljYXRpb247XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgUGFydGlhbE9ic2VydmVyLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICpcbiAqIFJlLWVtaXRzIGFsbCBub3RpZmljYXRpb25zIGZyb20gc291cmNlIE9ic2VydmFibGUgd2l0aCBzcGVjaWZpZWQgc2NoZWR1bGVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FbnN1cmUgYSBzcGVjaWZpYyBzY2hlZHVsZXIgaXMgdXNlZCwgZnJvbSBvdXRzaWRlIG9mIGFuIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqIGBvYnNlcnZlT25gIGlzIGFuIG9wZXJhdG9yIHRoYXQgYWNjZXB0cyBhIHNjaGVkdWxlciBhcyBhIGZpcnN0IHBhcmFtZXRlciwgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHJlc2NoZWR1bGVcbiAqIG5vdGlmaWNhdGlvbnMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuIEl0IG1pZ2h0IGJlIHVzZWZ1bCwgaWYgeW91IGRvIG5vdCBoYXZlIGNvbnRyb2wgb3ZlclxuICogaW50ZXJuYWwgc2NoZWR1bGVyIG9mIGEgZ2l2ZW4gT2JzZXJ2YWJsZSwgYnV0IHdhbnQgdG8gY29udHJvbCB3aGVuIGl0cyB2YWx1ZXMgYXJlIGVtaXR0ZWQgbmV2ZXJ0aGVsZXNzLlxuICpcbiAqIFJldHVybmVkIE9ic2VydmFibGUgZW1pdHMgdGhlIHNhbWUgbm90aWZpY2F0aW9ucyAobmV4dGVkIHZhbHVlcywgY29tcGxldGUgYW5kIGVycm9yIGV2ZW50cykgYXMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLFxuICogYnV0IHJlc2NoZWR1bGVkIHdpdGggcHJvdmlkZWQgc2NoZWR1bGVyLiBOb3RlIHRoYXQgdGhpcyBkb2Vzbid0IG1lYW4gdGhhdCBzb3VyY2UgT2JzZXJ2YWJsZXMgaW50ZXJuYWxcbiAqIHNjaGVkdWxlciB3aWxsIGJlIHJlcGxhY2VkIGluIGFueSB3YXkuIE9yaWdpbmFsIHNjaGVkdWxlciBzdGlsbCB3aWxsIGJlIHVzZWQsIGJ1dCB3aGVuIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0c1xuICogbm90aWZpY2F0aW9uLCBpdCB3aWxsIGJlIGltbWVkaWF0ZWx5IHNjaGVkdWxlZCBhZ2FpbiAtIHRoaXMgdGltZSB3aXRoIHNjaGVkdWxlciBwYXNzZWQgdG8gYG9ic2VydmVPbmAuXG4gKiBBbiBhbnRpLXBhdHRlcm4gd291bGQgYmUgY2FsbGluZyBgb2JzZXJ2ZU9uYCBvbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbG90cyBvZiB2YWx1ZXMgc3luY2hyb25vdXNseSwgdG8gc3BsaXRcbiAqIHRoYXQgZW1pc3Npb25zIGludG8gYXN5bmNocm9ub3VzIGNodW5rcy4gRm9yIHRoaXMgdG8gaGFwcGVuLCBzY2hlZHVsZXIgd291bGQgaGF2ZSB0byBiZSBwYXNzZWQgaW50byB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGRpcmVjdGx5ICh1c3VhbGx5IGludG8gdGhlIG9wZXJhdG9yIHRoYXQgY3JlYXRlcyBpdCkuIGBvYnNlcnZlT25gIHNpbXBseSBkZWxheXMgbm90aWZpY2F0aW9ucyBhXG4gKiBsaXR0bGUgYml0IG1vcmUsIHRvIGVuc3VyZSB0aGF0IHRoZXkgYXJlIGVtaXR0ZWQgYXQgZXhwZWN0ZWQgbW9tZW50cy5cbiAqXG4gKiBBcyBhIG1hdHRlciBvZiBmYWN0LCBgb2JzZXJ2ZU9uYCBhY2NlcHRzIHNlY29uZCBwYXJhbWV0ZXIsIHdoaWNoIHNwZWNpZmllcyBpbiBtaWxsaXNlY29uZHMgd2l0aCB3aGF0IGRlbGF5IG5vdGlmaWNhdGlvbnNcbiAqIHdpbGwgYmUgZW1pdHRlZC4gVGhlIG1haW4gZGlmZmVyZW5jZSBiZXR3ZWVuIHtAbGluayBkZWxheX0gb3BlcmF0b3IgYW5kIGBvYnNlcnZlT25gIGlzIHRoYXQgYG9ic2VydmVPbmBcbiAqIHdpbGwgZGVsYXkgYWxsIG5vdGlmaWNhdGlvbnMgLSBpbmNsdWRpbmcgZXJyb3Igbm90aWZpY2F0aW9ucyAtIHdoaWxlIGBkZWxheWAgd2lsbCBwYXNzIHRocm91Z2ggZXJyb3JcbiAqIGZyb20gc291cmNlIE9ic2VydmFibGUgaW1tZWRpYXRlbHkgd2hlbiBpdCBpcyBlbWl0dGVkLiBJbiBnZW5lcmFsIGl0IGlzIGhpZ2hseSByZWNvbW1lbmRlZCB0byB1c2UgYGRlbGF5YCBvcGVyYXRvclxuICogZm9yIGFueSBraW5kIG9mIGRlbGF5aW5nIG9mIHZhbHVlcyBpbiB0aGUgc3RyZWFtLCB3aGlsZSB1c2luZyBgb2JzZXJ2ZU9uYCB0byBzcGVjaWZ5IHdoaWNoIHNjaGVkdWxlciBzaG91bGQgYmUgdXNlZFxuICogZm9yIG5vdGlmaWNhdGlvbiBlbWlzc2lvbnMgaW4gZ2VuZXJhbC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbnN1cmUgdmFsdWVzIGluIHN1YnNjcmliZSBhcmUgY2FsbGVkIGp1c3QgYmVmb3JlIGJyb3dzZXIgcmVwYWludC5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGludGVydmFscyA9IGludGVydmFsKDEwKTsgICAgICAgICAgICAgICAgLy8gSW50ZXJ2YWxzIGFyZSBzY2hlZHVsZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCBhc3luYyBzY2hlZHVsZXIgYnkgZGVmYXVsdC4uLlxuICogaW50ZXJ2YWxzLnBpcGUoXG4gKiAgIG9ic2VydmVPbihhbmltYXRpb25GcmFtZVNjaGVkdWxlciksICAgICAgICAgIC8vIC4uLmJ1dCB3ZSB3aWxsIG9ic2VydmUgb24gYW5pbWF0aW9uRnJhbWVcbiAqICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2NoZWR1bGVyIHRvIGVuc3VyZSBzbW9vdGggYW5pbWF0aW9uLlxuICogLnN1YnNjcmliZSh2YWwgPT4ge1xuICogICBzb21lRGl2LnN0eWxlLmhlaWdodCA9IHZhbCArICdweCc7XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gc2NoZWR1bGVyIFNjaGVkdWxlciB0aGF0IHdpbGwgYmUgdXNlZCB0byByZXNjaGVkdWxlIG5vdGlmaWNhdGlvbnMgZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsYXldIE51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBzdGF0ZXMgd2l0aCB3aGF0IGRlbGF5IGV2ZXJ5IG5vdGlmaWNhdGlvbiBzaG91bGQgYmUgcmVzY2hlZHVsZWQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHNhbWUgbm90aWZpY2F0aW9ucyBhcyB0aGUgc291cmNlIE9ic2VydmFibGUsXG4gKiBidXQgd2l0aCBwcm92aWRlZCBzY2hlZHVsZXIuXG4gKlxuICogQG1ldGhvZCBvYnNlcnZlT25cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlT248VD4oc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlLCBkZWxheTogbnVtYmVyID0gMCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiBvYnNlcnZlT25PcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgT2JzZXJ2ZU9uT3BlcmF0b3Ioc2NoZWR1bGVyLCBkZWxheSkpO1xuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZU9uT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlLCBwcml2YXRlIGRlbGF5OiBudW1iZXIgPSAwKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9ic2VydmVPblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5zY2hlZHVsZXIsIHRoaXMuZGVsYXkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmVPblN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBkaXNwYXRjaCh0aGlzOiBTY2hlZHVsZXJBY3Rpb248T2JzZXJ2ZU9uTWVzc2FnZT4sIGFyZzogT2JzZXJ2ZU9uTWVzc2FnZSkge1xuICAgIGNvbnN0IHsgbm90aWZpY2F0aW9uLCBkZXN0aW5hdGlvbiB9ID0gYXJnO1xuICAgIG5vdGlmaWNhdGlvbi5vYnNlcnZlKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgZGVsYXk6IG51bWJlciA9IDApIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlTWVzc2FnZShub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5hZGQodGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoXG4gICAgICBPYnNlcnZlT25TdWJzY3JpYmVyLmRpc3BhdGNoLFxuICAgICAgdGhpcy5kZWxheSxcbiAgICAgIG5ldyBPYnNlcnZlT25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgdGhpcy5kZXN0aW5hdGlvbilcbiAgICApKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuc2NoZWR1bGVNZXNzYWdlKE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zY2hlZHVsZU1lc3NhZ2UoTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9ic2VydmVPbk1lc3NhZ2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PixcbiAgICAgICAgICAgICAgcHVibGljIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8YW55Pikge1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHF1ZXVlIH0gZnJvbSAnLi9zY2hlZHVsZXIvcXVldWUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZlT25TdWJzY3JpYmVyIH0gZnJvbSAnLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YmplY3RTdWJzY3JpcHRpb24nO1xuLyoqXG4gKiBAY2xhc3MgUmVwbGF5U3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgUmVwbGF5U3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBwcml2YXRlIF9ldmVudHM6IChSZXBsYXlFdmVudDxUPiB8IFQpW10gPSBbXTtcbiAgcHJpdmF0ZSBfYnVmZmVyU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIF93aW5kb3dUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgX2luZmluaXRlVGltZVdpbmRvdzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlclNpemU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgd2luZG93VGltZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2J1ZmZlclNpemUgPSBidWZmZXJTaXplIDwgMSA/IDEgOiBidWZmZXJTaXplO1xuICAgIHRoaXMuX3dpbmRvd1RpbWUgPSB3aW5kb3dUaW1lIDwgMSA/IDEgOiB3aW5kb3dUaW1lO1xuXG4gICAgaWYgKHdpbmRvd1RpbWUgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgICAgdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gdHJ1ZTtcbiAgICAgIHRoaXMubmV4dCA9IHRoaXMubmV4dEluZmluaXRlVGltZVdpbmRvdztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0VGltZVdpbmRvdztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG5leHRJbmZpbml0ZVRpbWVXaW5kb3codmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBfZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgIF9ldmVudHMucHVzaCh2YWx1ZSk7XG4gICAgLy8gU2luY2UgdGhpcyBtZXRob2QgaXMgaW52b2tlZCBpbiBldmVyeSBuZXh0KCkgY2FsbCB0aGFuIHRoZSBidWZmZXJcbiAgICAvLyBjYW4gb3Zlcmdyb3cgdGhlIG1heCBzaXplIG9ubHkgYnkgb25lIGl0ZW1cbiAgICBpZiAoX2V2ZW50cy5sZW5ndGggPiB0aGlzLl9idWZmZXJTaXplKSB7XG4gICAgICBfZXZlbnRzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgc3VwZXIubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG5leHRUaW1lV2luZG93KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5fZXZlbnRzLnB1c2gobmV3IFJlcGxheUV2ZW50KHRoaXMuX2dldE5vdygpLCB2YWx1ZSkpO1xuICAgIHRoaXMuX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk7XG5cbiAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICAvLyBXaGVuIGBfaW5maW5pdGVUaW1lV2luZG93ID09PSB0cnVlYCB0aGVuIHRoZSBidWZmZXIgaXMgYWxyZWFkeSB0cmltbWVkXG4gICAgY29uc3QgX2luZmluaXRlVGltZVdpbmRvdyA9IHRoaXMuX2luZmluaXRlVGltZVdpbmRvdztcbiAgICBjb25zdCBfZXZlbnRzID0gX2luZmluaXRlVGltZVdpbmRvdyA/IHRoaXMuX2V2ZW50cyA6IHRoaXMuX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgY29uc3QgbGVuID0gX2V2ZW50cy5sZW5ndGg7XG4gICAgbGV0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkIHx8IHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJqZWN0U3Vic2NyaXB0aW9uKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgIH1cblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHN1YnNjcmliZXIuYWRkKHN1YnNjcmliZXIgPSBuZXcgT2JzZXJ2ZU9uU3Vic2NyaWJlcjxUPihzdWJzY3JpYmVyLCBzY2hlZHVsZXIpKTtcbiAgICB9XG5cbiAgICBpZiAoX2luZmluaXRlVGltZVdpbmRvdykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KDxUPl9ldmVudHNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoKDxSZXBsYXlFdmVudDxUPj5fZXZlbnRzW2ldKS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBfZ2V0Tm93KCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLnNjaGVkdWxlciB8fCBxdWV1ZSkubm93KCk7XG4gIH1cblxuICBwcml2YXRlIF90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpOiBSZXBsYXlFdmVudDxUPltdIHtcbiAgICBjb25zdCBub3cgPSB0aGlzLl9nZXROb3coKTtcbiAgICBjb25zdCBfYnVmZmVyU2l6ZSA9IHRoaXMuX2J1ZmZlclNpemU7XG4gICAgY29uc3QgX3dpbmRvd1RpbWUgPSB0aGlzLl93aW5kb3dUaW1lO1xuICAgIGNvbnN0IF9ldmVudHMgPSA8UmVwbGF5RXZlbnQ8VD5bXT50aGlzLl9ldmVudHM7XG5cbiAgICBjb25zdCBldmVudHNDb3VudCA9IF9ldmVudHMubGVuZ3RoO1xuICAgIGxldCBzcGxpY2VDb3VudCA9IDA7XG5cbiAgICAvLyBUcmltIGV2ZW50cyB0aGF0IGZhbGwgb3V0IG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgICAvLyBTdGFydCBhdCB0aGUgZnJvbnQgb2YgdGhlIGxpc3QuIEJyZWFrIGVhcmx5IG9uY2VcbiAgICAvLyB3ZSBlbmNvdW50ZXIgYW4gZXZlbnQgdGhhdCBmYWxscyB3aXRoaW4gdGhlIHdpbmRvdy5cbiAgICB3aGlsZSAoc3BsaWNlQ291bnQgPCBldmVudHNDb3VudCkge1xuICAgICAgaWYgKChub3cgLSBfZXZlbnRzW3NwbGljZUNvdW50XS50aW1lKSA8IF93aW5kb3dUaW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc3BsaWNlQ291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoZXZlbnRzQ291bnQgPiBfYnVmZmVyU2l6ZSkge1xuICAgICAgc3BsaWNlQ291bnQgPSBNYXRoLm1heChzcGxpY2VDb3VudCwgZXZlbnRzQ291bnQgLSBfYnVmZmVyU2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKHNwbGljZUNvdW50ID4gMCkge1xuICAgICAgX2V2ZW50cy5zcGxpY2UoMCwgc3BsaWNlQ291bnQpO1xuICAgIH1cblxuICAgIHJldHVybiBfZXZlbnRzO1xuICB9XG5cbn1cblxuY2xhc3MgUmVwbGF5RXZlbnQ8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZTogbnVtYmVyLCBwdWJsaWMgdmFsdWU6IFQpIHtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBAY2xhc3MgQXN5bmNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY1N1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZTogVCA9IG51bGw7XG4gIHByaXZhdGUgaGFzTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuaGFzTmV4dCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5oYXNOZXh0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgc3VwZXIuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdXBlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBzdXBlci5jb21wbGV0ZSgpO1xuICB9XG59XG4iLCJsZXQgbmV4dEhhbmRsZSA9IDE7XG5cbmNvbnN0IHRhc2tzQnlIYW5kbGU6IHsgW2hhbmRsZTogc3RyaW5nXTogKCkgPT4gdm9pZCB9ID0ge307XG5cbmZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGU6IG51bWJlcikge1xuICBjb25zdCBjYiA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgaWYgKGNiKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgSW1tZWRpYXRlID0ge1xuICBzZXRJbW1lZGlhdGUoY2I6ICgpID0+IHZvaWQpOiBudW1iZXIge1xuICAgIGNvbnN0IGhhbmRsZSA9IG5leHRIYW5kbGUrKztcbiAgICB0YXNrc0J5SGFuZGxlW2hhbmRsZV0gPSBjYjtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHJ1bklmUHJlc2VudChoYW5kbGUpKTtcbiAgICByZXR1cm4gaGFuZGxlO1xuICB9LFxuXG4gIGNsZWFySW1tZWRpYXRlKGhhbmRsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBJbW1lZGlhdGUgfSBmcm9tICcuLi91dGlsL0ltbWVkaWF0ZSc7XG5pbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFzYXBBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQXNhcFNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBc2FwU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGlzIGdyZWF0ZXIgdGhhbiAwLCByZXF1ZXN0IGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBQdXNoIHRoZSBhY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLlxuICAgIHNjaGVkdWxlci5hY3Rpb25zLnB1c2godGhpcyk7XG4gICAgLy8gSWYgYSBtaWNyb3Rhc2sgaGFzIGFscmVhZHkgYmVlbiBzY2hlZHVsZWQsIGRvbid0IHNjaGVkdWxlIGFub3RoZXJcbiAgICAvLyBvbmUuIElmIGEgbWljcm90YXNrIGhhc24ndCBiZWVuIHNjaGVkdWxlZCB5ZXQsIHNjaGVkdWxlIG9uZSBub3cuIFJldHVyblxuICAgIC8vIHRoZSBjdXJyZW50IHNjaGVkdWxlZCBtaWNyb3Rhc2sgaWQuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5zY2hlZHVsZWQgPSBJbW1lZGlhdGUuc2V0SW1tZWRpYXRlKFxuICAgICAgc2NoZWR1bGVyLmZsdXNoLmJpbmQoc2NoZWR1bGVyLCBudWxsKVxuICAgICkpO1xuICB9XG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFzYXBTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBzY2hlZHVsZXIgcXVldWUgaXMgZW1wdHksIGNhbmNlbCB0aGUgcmVxdWVzdGVkIG1pY3JvdGFzayBhbmRcbiAgICAvLyBzZXQgdGhlIHNjaGVkdWxlZCBmbGFnIHRvIHVuZGVmaW5lZCBzbyB0aGUgbmV4dCBBc2FwQWN0aW9uIHdpbGwgc2NoZWR1bGVcbiAgICAvLyBpdHMgb3duLlxuICAgIGlmIChzY2hlZHVsZXIuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIEltbWVkaWF0ZS5jbGVhckltbWVkaWF0ZShpZCk7XG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdW5kZWZpbmVkIHNvIHRoZSBhY3Rpb24ga25vd3MgdG8gcmVxdWVzdCBhIG5ldyBhc3luYyBpZCBpZiBpdCdzIHJlc2NoZWR1bGVkLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgQXNhcFNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgcHVibGljIGZsdXNoKGFjdGlvbj86IEFzeW5jQWN0aW9uPGFueT4pOiB2b2lkIHtcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHthY3Rpb25zfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IGFjdGlvbnMubGVuZ3RoO1xuICAgIGFjdGlvbiA9IGFjdGlvbiB8fCBhY3Rpb25zLnNoaWZ0KCk7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKTtcblxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzYXBBY3Rpb24gfSBmcm9tICcuL0FzYXBBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFzYXAgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlBlcmZvcm0gdGFzayBhcyBmYXN0IGFzIGl0IGNhbiBiZSBwZXJmb3JtZWQgYXN5bmNocm9ub3VzbHk8L3NwYW4+XG4gKlxuICogYGFzYXBgIHNjaGVkdWxlciBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBhc3luY1NjaGVkdWxlcn0gc2NoZWR1bGVyIHdoZW4geW91IHVzZSBpdCB0byBkZWxheSB0YXNrXG4gKiBpbiB0aW1lLiBJZiBob3dldmVyIHlvdSBzZXQgZGVsYXkgdG8gYDBgLCBgYXNhcGAgd2lsbCB3YWl0IGZvciBjdXJyZW50IHN5bmNocm9ub3VzbHkgZXhlY3V0aW5nXG4gKiBjb2RlIHRvIGVuZCBhbmQgdGhlbiBpdCB3aWxsIHRyeSB0byBleGVjdXRlIGdpdmVuIHRhc2sgYXMgZmFzdCBhcyBwb3NzaWJsZS5cbiAqXG4gKiBgYXNhcGAgc2NoZWR1bGVyIHdpbGwgZG8gaXRzIGJlc3QgdG8gbWluaW1pemUgdGltZSBiZXR3ZWVuIGVuZCBvZiBjdXJyZW50bHkgZXhlY3V0aW5nIGNvZGVcbiAqIGFuZCBzdGFydCBvZiBzY2hlZHVsZWQgdGFzay4gVGhpcyBtYWtlcyBpdCBiZXN0IGNhbmRpZGF0ZSBmb3IgcGVyZm9ybWluZyBzbyBjYWxsZWQgXCJkZWZlcnJpbmdcIi5cbiAqIFRyYWRpdGlvbmFsbHkgdGhpcyB3YXMgYWNoaWV2ZWQgYnkgY2FsbGluZyBgc2V0VGltZW91dChkZWZlcnJlZFRhc2ssIDApYCwgYnV0IHRoYXQgdGVjaG5pcXVlIGludm9sdmVzXG4gKiBzb21lIChhbHRob3VnaCBtaW5pbWFsKSB1bndhbnRlZCBkZWxheS5cbiAqXG4gKiBOb3RlIHRoYXQgdXNpbmcgYGFzYXBgIHNjaGVkdWxlciBkb2VzIG5vdCBuZWNlc3NhcmlseSBtZWFuIHRoYXQgeW91ciB0YXNrIHdpbGwgYmUgZmlyc3QgdG8gcHJvY2Vzc1xuICogYWZ0ZXIgY3VycmVudGx5IGV4ZWN1dGluZyBjb2RlLiBJbiBwYXJ0aWN1bGFyLCBpZiBzb21lIHRhc2sgd2FzIGFsc28gc2NoZWR1bGVkIHdpdGggYGFzYXBgIGJlZm9yZSxcbiAqIHRoYXQgdGFzayB3aWxsIGV4ZWN1dGUgZmlyc3QuIFRoYXQgYmVpbmcgc2FpZCwgaWYgeW91IG5lZWQgdG8gc2NoZWR1bGUgdGFzayBhc3luY2hyb25vdXNseSwgYnV0XG4gKiBhcyBzb29uIGFzIHBvc3NpYmxlLCBgYXNhcGAgc2NoZWR1bGVyIGlzIHlvdXIgYmVzdCBiZXQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29tcGFyZSBhc3luYyBhbmQgYXNhcCBzY2hlZHVsZXI8XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ2FzeW5jJykpOyAvLyBzY2hlZHVsaW5nICdhc3luYycgZmlyc3QuLi5cbiAqIFJ4LlNjaGVkdWxlci5hc2FwLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdhc2FwJykpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImFzYXBcIlxuICogLy8gXCJhc3luY1wiXG4gKiAvLyAuLi4gYnV0ICdhc2FwJyBnb2VzIGZpcnN0IVxuICogYGBgXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGFzYXBcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYXNhcCA9IG5ldyBBc2FwU2NoZWR1bGVyKEFzYXBBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFzeW5jIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5TY2hlZHVsZSB0YXNrIGFzIGlmIHlvdSB1c2VkIHNldFRpbWVvdXQodGFzaywgZHVyYXRpb24pPC9zcGFuPlxuICpcbiAqIGBhc3luY2Agc2NoZWR1bGVyIHNjaGVkdWxlcyB0YXNrcyBhc3luY2hyb25vdXNseSwgYnkgcHV0dGluZyB0aGVtIG9uIHRoZSBKYXZhU2NyaXB0XG4gKiBldmVudCBsb29wIHF1ZXVlLiBJdCBpcyBiZXN0IHVzZWQgdG8gZGVsYXkgdGFza3MgaW4gdGltZSBvciB0byBzY2hlZHVsZSB0YXNrcyByZXBlYXRpbmdcbiAqIGluIGludGVydmFscy5cbiAqXG4gKiBJZiB5b3UganVzdCB3YW50IHRvIFwiZGVmZXJcIiB0YXNrLCB0aGF0IGlzIHRvIHBlcmZvcm0gaXQgcmlnaHQgYWZ0ZXIgY3VycmVudGx5XG4gKiBleGVjdXRpbmcgc3luY2hyb25vdXMgY29kZSBlbmRzIChjb21tb25seSBhY2hpZXZlZCBieSBgc2V0VGltZW91dChkZWZlcnJlZFRhc2ssIDApYCksXG4gKiBiZXR0ZXIgY2hvaWNlIHdpbGwgYmUgdGhlIHtAbGluayBhc2FwU2NoZWR1bGVyfSBzY2hlZHVsZXIuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFVzZSBhc3luYyBzY2hlZHVsZXIgdG8gZGVsYXkgdGFza1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGFzayA9ICgpID0+IGNvbnNvbGUubG9nKCdpdCB3b3JrcyEnKTtcbiAqXG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUodGFzaywgMjAwMCk7XG4gKlxuICogLy8gQWZ0ZXIgMiBzZWNvbmRzIGxvZ3M6XG4gKiAvLyBcIml0IHdvcmtzIVwiXG4gKiBgYGBcbiAqXG4gKiBVc2UgYXN5bmMgc2NoZWR1bGVyIHRvIHJlcGVhdCB0YXNrIGluIGludGVydmFsc1xuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gdGFzayhzdGF0ZSkge1xuICogICBjb25zb2xlLmxvZyhzdGF0ZSk7XG4gKiAgIHRoaXMuc2NoZWR1bGUoc3RhdGUgKyAxLCAxMDAwKTsgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZSBhbmQgZGVsYXlcbiAqIH1cbiAqXG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUodGFzaywgMzAwMCwgMCk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDAgYWZ0ZXIgM3NcbiAqIC8vIDEgYWZ0ZXIgNHNcbiAqIC8vIDIgYWZ0ZXIgNXNcbiAqIC8vIDMgYWZ0ZXIgNnNcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYXN5bmNcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYXN5bmMgPSBuZXcgQXN5bmNTY2hlZHVsZXIoQXN5bmNBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZVNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRnJhbWVBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgaXMgZ3JlYXRlciB0aGFuIDAsIHJlcXVlc3QgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIFB1c2ggdGhlIGFjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUuXG4gICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAvLyBJZiBhbiBhbmltYXRpb24gZnJhbWUgaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWQsIGRvbid0IHJlcXVlc3QgYW5vdGhlclxuICAgIC8vIG9uZS4gSWYgYW4gYW5pbWF0aW9uIGZyYW1lIGhhc24ndCBiZWVuIHJlcXVlc3RlZCB5ZXQsIHJlcXVlc3Qgb25lLiBSZXR1cm5cbiAgICAvLyB0aGUgY3VycmVudCBhbmltYXRpb24gZnJhbWUgcmVxdWVzdCBpZC5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlZCB8fCAoc2NoZWR1bGVyLnNjaGVkdWxlZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShcbiAgICAgICgpID0+IHNjaGVkdWxlci5mbHVzaChudWxsKSkpO1xuICB9XG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGV4aXN0cyBhbmQgaXMgZ3JlYXRlciB0aGFuIDAsIG9yIGlmIHRoZSBkZWxheSBpcyBudWxsICh0aGVcbiAgICAvLyBhY3Rpb24gd2Fzbid0IHJlc2NoZWR1bGVkKSBidXQgd2FzIG9yaWdpbmFsbHkgc2NoZWR1bGVkIGFzIGFuIGFzeW5jXG4gICAgLy8gYWN0aW9uLCB0aGVuIHJlY3ljbGUgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmICgoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgc2NoZWR1bGVyIHF1ZXVlIGlzIGVtcHR5LCBjYW5jZWwgdGhlIHJlcXVlc3RlZCBhbmltYXRpb24gZnJhbWUgYW5kXG4gICAgLy8gc2V0IHRoZSBzY2hlZHVsZWQgZmxhZyB0byB1bmRlZmluZWQgc28gdGhlIG5leHQgQW5pbWF0aW9uRnJhbWVBY3Rpb24gd2lsbFxuICAgIC8vIHJlcXVlc3QgaXRzIG93bi5cbiAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdW5kZWZpbmVkIHNvIHRoZSBhY3Rpb24ga25vd3MgdG8gcmVxdWVzdCBhIG5ldyBhc3luYyBpZCBpZiBpdCdzIHJlc2NoZWR1bGVkLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG4gIHB1YmxpYyBmbHVzaChhY3Rpb24/OiBBc3luY0FjdGlvbjxhbnk+KTogdm9pZCB7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCB7YWN0aW9uc30gPSB0aGlzO1xuICAgIGxldCBlcnJvcjogYW55O1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSBhY3Rpb25zLmxlbmd0aDtcbiAgICBhY3Rpb24gPSBhY3Rpb24gfHwgYWN0aW9ucy5zaGlmdCgpO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSk7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKSB7XG4gICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBBbmltYXRpb25GcmFtZUFjdGlvbiB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVBY3Rpb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQW5pbWF0aW9uIEZyYW1lIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QZXJmb3JtIHRhc2sgd2hlbiBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgd291bGQgZmlyZTwvc3Bhbj5cbiAqXG4gKiBXaGVuIGBhbmltYXRpb25GcmFtZWAgc2NoZWR1bGVyIGlzIHVzZWQgd2l0aCBkZWxheSwgaXQgd2lsbCBmYWxsIGJhY2sgdG8ge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXJcbiAqIGJlaGF2aW91ci5cbiAqXG4gKiBXaXRob3V0IGRlbGF5LCBgYW5pbWF0aW9uRnJhbWVgIHNjaGVkdWxlciBjYW4gYmUgdXNlZCB0byBjcmVhdGUgc21vb3RoIGJyb3dzZXIgYW5pbWF0aW9ucy5cbiAqIEl0IG1ha2VzIHN1cmUgc2NoZWR1bGVkIHRhc2sgd2lsbCBoYXBwZW4ganVzdCBiZWZvcmUgbmV4dCBicm93c2VyIGNvbnRlbnQgcmVwYWludCxcbiAqIHRodXMgcGVyZm9ybWluZyBhbmltYXRpb25zIGFzIGVmZmljaWVudGx5IGFzIHBvc3NpYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNjaGVkdWxlIGRpdiBoZWlnaHQgYW5pbWF0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29tZS1kaXYnKTtcbiAqXG4gKiBSeC5TY2hlZHVsZXIuYW5pbWF0aW9uRnJhbWUuc2NoZWR1bGUoZnVuY3Rpb24oaGVpZ2h0KSB7XG4gKiAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gKlxuICogICB0aGlzLnNjaGVkdWxlKGhlaWdodCArIDEpOyAgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlXG4gKiB9LCAwLCAwKTtcbiAqXG4gKiAvLyBZb3Ugd2lsbCBzZWUgLnNvbWUtZGl2IGVsZW1lbnQgZ3Jvd2luZyBpbiBoZWlnaHRcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYW5pbWF0aW9uRnJhbWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWUgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgVmlydHVhbFRpbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBmcmFtZVRpbWVGYWN0b3I6IG51bWJlciA9IDEwO1xuXG4gIHB1YmxpYyBmcmFtZTogbnVtYmVyID0gMDtcbiAgcHVibGljIGluZGV4OiBudW1iZXIgPSAtMTtcblxuICBjb25zdHJ1Y3RvcihTY2hlZHVsZXJBY3Rpb246IHR5cGVvZiBBc3luY0FjdGlvbiA9IFZpcnR1YWxBY3Rpb24gYXMgYW55LFxuICAgICAgICAgICAgICBwdWJsaWMgbWF4RnJhbWVzOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICBzdXBlcihTY2hlZHVsZXJBY3Rpb24sICgpID0+IHRoaXMuZnJhbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb21wdCB0aGUgU2NoZWR1bGVyIHRvIGV4ZWN1dGUgYWxsIG9mIGl0cyBxdWV1ZWQgYWN0aW9ucywgdGhlcmVmb3JlXG4gICAqIGNsZWFyaW5nIGl0cyBxdWV1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHB1YmxpYyBmbHVzaCgpOiB2b2lkIHtcblxuICAgIGNvbnN0IHthY3Rpb25zLCBtYXhGcmFtZXN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueSwgYWN0aW9uOiBBc3luY0FjdGlvbjxhbnk+O1xuXG4gICAgd2hpbGUgKChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpICYmICh0aGlzLmZyYW1lID0gYWN0aW9uLmRlbGF5KSA8PSBtYXhGcmFtZXMpIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQG5vZG9jXG4gKi9cbmV4cG9ydCBjbGFzcyBWaXJ0dWFsQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIHByb3RlY3RlZCBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaW5kZXg6IG51bWJlciA9IHNjaGVkdWxlci5pbmRleCArPSAxKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgICB0aGlzLmluZGV4ID0gc2NoZWR1bGVyLmluZGV4ID0gaW5kZXg7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAvLyBJZiBhbiBhY3Rpb24gaXMgcmVzY2hlZHVsZWQsIHdlIHNhdmUgYWxsb2NhdGlvbnMgYnkgbXV0YXRpbmcgaXRzIHN0YXRlLFxuICAgIC8vIHB1c2hpbmcgaXQgdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLCBhbmQgcmVjeWNsaW5nIHRoZSBhY3Rpb24uXG4gICAgLy8gQnV0IHNpbmNlIHRoZSBWaXJ0dWFsVGltZVNjaGVkdWxlciBpcyB1c2VkIGZvciB0ZXN0aW5nLCBWaXJ0dWFsQWN0aW9uc1xuICAgIC8vIG11c3QgYmUgaW1tdXRhYmxlIHNvIHRoZXkgY2FuIGJlIGluc3BlY3RlZCBsYXRlci5cbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgVmlydHVhbEFjdGlvbih0aGlzLnNjaGVkdWxlciwgdGhpcy53b3JrKTtcbiAgICB0aGlzLmFkZChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb24uc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHRoaXMuZGVsYXkgPSBzY2hlZHVsZXIuZnJhbWUgKyBkZWxheTtcbiAgICBjb25zdCB7YWN0aW9uc30gPSBzY2hlZHVsZXI7XG4gICAgYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIChhY3Rpb25zIGFzIEFycmF5PFZpcnR1YWxBY3Rpb248VD4+KS5zb3J0KFZpcnR1YWxBY3Rpb24uc29ydEFjdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNvcnRBY3Rpb25zPFQ+KGE6IFZpcnR1YWxBY3Rpb248VD4sIGI6IFZpcnR1YWxBY3Rpb248VD4pIHtcbiAgICBpZiAoYS5kZWxheSA9PT0gYi5kZWxheSkge1xuICAgICAgaWYgKGEuaW5kZXggPT09IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2UgaWYgKGEuaW5kZXggPiBiLmluZGV4KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYS5kZWxheSA+IGIuZGVsYXkpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHk8VD4oeDogVCk6IFQge1xuICByZXR1cm4geDtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUZXN0cyB0byBzZWUgaWYgdGhlIG9iamVjdCBpcyBhbiBSeEpTIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHBhcmFtIG9iaiB0aGUgb2JqZWN0IHRvIHRlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JzZXJ2YWJsZTxUPihvYmo6IGFueSk6IG9iaiBpcyBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuICEhb2JqICYmIChvYmogaW5zdGFuY2VvZiBPYnNlcnZhYmxlIHx8ICh0eXBlb2Ygb2JqLmxpZnQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpKTtcbn1cbiIsIi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gYW4gZWxlbWVudCB3YXMgcXVlcmllZCBhdCBhIGNlcnRhaW4gaW5kZXggb2YgYW5cbiAqIE9ic2VydmFibGUsIGJ1dCBubyBzdWNoIGluZGV4IG9yIHBvc2l0aW9uIGV4aXN0cyBpbiB0aGF0IHNlcXVlbmNlLlxuICpcbiAqIEBzZWUge0BsaW5rIGVsZW1lbnRBdH1cbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKiBAc2VlIHtAbGluayB0YWtlTGFzdH1cbiAqXG4gKiBAY2xhc3MgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXG4gIHB1YmxpYyByZWFkb25seSBuYW1lID0gJ0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignYXJndW1lbnQgb3V0IG9mIHJhbmdlJyk7XG4gICAgKE9iamVjdCBhcyBhbnkpLnNldFByb3RvdHlwZU9mKHRoaXMsIEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cbiIsIi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gYW4gT2JzZXJ2YWJsZSBvciBhIHNlcXVlbmNlIHdhcyBxdWVyaWVkIGJ1dCBoYXMgbm9cbiAqIGVsZW1lbnRzLlxuICpcbiAqIEBzZWUge0BsaW5rIGZpcnN0fVxuICogQHNlZSB7QGxpbmsgbGFzdH1cbiAqIEBzZWUge0BsaW5rIHNpbmdsZX1cbiAqXG4gKiBAY2xhc3MgRW1wdHlFcnJvclxuICovXG5leHBvcnQgY2xhc3MgRW1wdHlFcnJvciBleHRlbmRzIEVycm9yIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdFbXB0eUVycm9yJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcignbm8gZWxlbWVudHMgaW4gc2VxdWVuY2UnKTtcbiAgICAoT2JqZWN0IGFzIGFueSkuc2V0UHJvdG90eXBlT2YodGhpcywgRW1wdHlFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG4iLCIvKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIGR1ZXRpbWUgZWxhcHNlcy5cbiAqXG4gKiBAc2VlIHtAbGluayB0aW1lb3V0fVxuICpcbiAqIEBjbGFzcyBUaW1lb3V0RXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVvdXRFcnJvciBleHRlbmRzIEVycm9yIHtcblxuICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9ICdUaW1lb3V0RXJyb3InO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCdUaW1lb3V0IGhhcyBvY2N1cnJlZCcpO1xuICAgIChPYmplY3QgYXMgYW55KS5zZXRQcm90b3R5cGVPZih0aGlzLCBUaW1lb3V0RXJyb3IucHJvdG90eXBlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEFwcGxpZXMgYSBnaXZlbiBgcHJvamVjdGAgZnVuY3Rpb24gdG8gZWFjaCB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUsIGFuZCBlbWl0cyB0aGUgcmVzdWx0aW5nIHZhbHVlcyBhcyBhbiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5MaWtlIFtBcnJheS5wcm90b3R5cGUubWFwKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L21hcCksXG4gKiBpdCBwYXNzZXMgZWFjaCBzb3VyY2UgdmFsdWUgdGhyb3VnaCBhIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIHRvIGdldFxuICogY29ycmVzcG9uZGluZyBvdXRwdXQgdmFsdWVzLjwvc3Bhbj5cbiAqXG4gKiAhW10obWFwLnBuZylcbiAqXG4gKiBTaW1pbGFyIHRvIHRoZSB3ZWxsIGtub3duIGBBcnJheS5wcm90b3R5cGUubWFwYCBmdW5jdGlvbiwgdGhpcyBvcGVyYXRvclxuICogYXBwbGllcyBhIHByb2plY3Rpb24gdG8gZWFjaCB2YWx1ZSBhbmQgZW1pdHMgdGhhdCBwcm9qZWN0aW9uIGluIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSBjbGllbnRYIHBvc2l0aW9uIG9mIHRoYXQgY2xpY2tcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBwb3NpdGlvbnMgPSBjbGlja3MucGlwZShtYXAoZXYgPT4gZXYuY2xpZW50WCkpO1xuICogcG9zaXRpb25zLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1hcFRvfVxuICogQHNlZSB7QGxpbmsgcGx1Y2t9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IFJ9IHByb2plY3QgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5XG4gKiB0byBlYWNoIGB2YWx1ZWAgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuIFRoZSBgaW5kZXhgIHBhcmFtZXRlciBpc1xuICogdGhlIG51bWJlciBgaWAgZm9yIHRoZSBpLXRoIGVtaXNzaW9uIHRoYXQgaGFzIGhhcHBlbmVkIHNpbmNlIHRoZVxuICogc3Vic2NyaXB0aW9uLCBzdGFydGluZyBmcm9tIHRoZSBudW1iZXIgYDBgLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBBbiBvcHRpb25hbCBhcmd1bWVudCB0byBkZWZpbmUgd2hhdCBgdGhpc2AgaXMgaW4gdGhlXG4gKiBgcHJvamVjdGAgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgdHJhbnNmb3JtZWQgYnkgdGhlIGdpdmVuIGBwcm9qZWN0YCBmdW5jdGlvbi5cbiAqIEBtZXRob2QgbWFwXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwPFQsIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUiwgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICByZXR1cm4gZnVuY3Rpb24gbWFwT3BlcmF0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8Uj4ge1xuICAgIGlmICh0eXBlb2YgcHJvamVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgaXMgbm90IGEgZnVuY3Rpb24uIEFyZSB5b3UgbG9va2luZyBmb3IgYG1hcFRvKClgPycpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IE1hcE9wZXJhdG9yKHByb2plY3QsIHRoaXNBcmcpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIE1hcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUiwgcHJpdmF0ZSB0aGlzQXJnOiBhbnkpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNYXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJvamVjdCwgdGhpcy50aGlzQXJnKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIE1hcFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgdGhpc0FyZzogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUixcbiAgICAgICAgICAgICAgdGhpc0FyZzogYW55KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMudGhpc0FyZyA9IHRoaXNBcmcgfHwgdGhpcztcbiAgfVxuXG4gIC8vIE5PVEU6IFRoaXMgbG9va3MgdW5vcHRpbWl6ZWQsIGJ1dCBpdCdzIGFjdHVhbGx5IHB1cnBvc2VmdWxseSBOT1RcbiAgLy8gdXNpbmcgdHJ5L2NhdGNoIG9wdGltaXphdGlvbnMuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcm9qZWN0LmNhbGwodGhpcy50aGlzQXJnLCB2YWx1ZSwgdGhpcy5jb3VudCsrKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlckxpa2UsIFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGEgbWFwcGluZyBmdW5jdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8UjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMT4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6ICgpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKHJlc3VsdDogUikgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKC4uLnJlc3VsdHM6IFJbXSkgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8UltdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbi8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbi8qKlxuICogQ29udmVydHMgYSBjYWxsYmFjayBBUEkgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+R2l2ZSBpdCBhIGZ1bmN0aW9uIGBmYCBvZiB0eXBlIGBmKHgsIGNhbGxiYWNrKWAgYW5kXG4gKiBpdCB3aWxsIHJldHVybiBhIGZ1bmN0aW9uIGBnYCB0aGF0IHdoZW4gY2FsbGVkIGFzIGBnKHgpYCB3aWxsIG91dHB1dCBhblxuICogT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYGJpbmRDYWxsYmFja2AgaXMgbm90IGFuIG9wZXJhdG9yIGJlY2F1c2UgaXRzIGlucHV0IGFuZCBvdXRwdXQgYXJlIG5vdFxuICogT2JzZXJ2YWJsZXMuIFRoZSBpbnB1dCBpcyBhIGZ1bmN0aW9uIGBmdW5jYCB3aXRoIHNvbWUgcGFyYW1ldGVycywgdGhlXG4gKiBsYXN0IHBhcmFtZXRlciBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBgZnVuY2AgY2FsbHMgd2hlbiBpdCBpc1xuICogZG9uZS5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIGBiaW5kQ2FsbGJhY2tgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZSBwYXJhbWV0ZXJzXG4gKiBhcyBgZnVuY2AsIGV4Y2VwdCB0aGUgbGFzdCBvbmUgKHRoZSBjYWxsYmFjaykuIFdoZW4gdGhlIG91dHB1dCBmdW5jdGlvblxuICogaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIGl0IHdpbGwgcmV0dXJuIGFuIE9ic2VydmFibGUuIElmIGZ1bmN0aW9uIGBmdW5jYFxuICogY2FsbHMgaXRzIGNhbGxiYWNrIHdpdGggb25lIGFyZ3VtZW50IHRoZSBPYnNlcnZhYmxlIHdpbGwgZW1pdCB0aGF0IHZhbHVlLlxuICogSWYgb24gdGhlIG90aGVyIGhhbmQgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIG11bHRpcGxlIHZhbHVlcyB0aGUgcmVzdWx0aW5nXG4gKiBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIHNhaWQgdmFsdWVzIGFzIGFyZ3VtZW50cy5cbiAqXG4gKiBJdCBpcyB2ZXJ5IGltcG9ydGFudCB0byByZW1lbWJlciB0aGF0IGlucHV0IGZ1bmN0aW9uIGBmdW5jYCBpcyBub3QgY2FsbGVkXG4gKiB3aGVuIHRoZSBvdXRwdXQgZnVuY3Rpb24gaXMsIGJ1dCByYXRoZXIgd2hlbiB0aGUgT2JzZXJ2YWJsZSByZXR1cm5lZCBieSB0aGUgb3V0cHV0XG4gKiBmdW5jdGlvbiBpcyBzdWJzY3JpYmVkLiBUaGlzIG1lYW5zIGlmIGBmdW5jYCBtYWtlcyBhbiBBSkFYIHJlcXVlc3QsIHRoYXQgcmVxdWVzdFxuICogd2lsbCBiZSBtYWRlIGV2ZXJ5IHRpbWUgc29tZW9uZSBzdWJzY3JpYmVzIHRvIHRoZSByZXN1bHRpbmcgT2JzZXJ2YWJsZSwgYnV0IG5vdCBiZWZvcmUuXG4gKlxuICogVGhlIGxhc3Qgb3B0aW9uYWwgcGFyYW1ldGVyIC0gYHNjaGVkdWxlcmAgLSBjYW4gYmUgdXNlZCB0byBjb250cm9sIHdoZW4gdGhlIGNhbGxcbiAqIHRvIGBmdW5jYCBoYXBwZW5zIGFmdGVyIHNvbWVvbmUgc3Vic2NyaWJlcyB0byBPYnNlcnZhYmxlLCBhcyB3ZWxsIGFzIHdoZW4gcmVzdWx0c1xuICogcGFzc2VkIHRvIGNhbGxiYWNrIHdpbGwgYmUgZW1pdHRlZC4gQnkgZGVmYXVsdCwgdGhlIHN1YnNjcmlwdGlvbiB0byAgYW4gT2JzZXJ2YWJsZSBjYWxscyBgZnVuY2BcbiAqIHN5bmNocm9ub3VzbHksIGJ1dCB1c2luZyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGFzIHRoZSBsYXN0IHBhcmFtZXRlciB3aWxsIGRlZmVyIHRoZSBjYWxsIHRvIGBmdW5jYCxcbiAqIGp1c3QgbGlrZSB3cmFwcGluZyB0aGUgY2FsbCBpbiBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgIHdvdWxkLiBJZiB5b3UgdXNlIHRoZSBhc3luYyBTY2hlZHVsZXJcbiAqIGFuZCBjYWxsIGBzdWJzY3JpYmVgIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBhbGwgZnVuY3Rpb24gY2FsbHMgdGhhdCBhcmUgY3VycmVudGx5IGV4ZWN1dGluZ1xuICogd2lsbCBlbmQgYmVmb3JlIGBmdW5jYCBpcyBpbnZva2VkLlxuICpcbiAqIEJ5IGRlZmF1bHQgcmVzdWx0cyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGFyZSBlbWl0dGVkIGltbWVkaWF0ZWx5IGFmdGVyIGBmdW5jYCBpbnZva2VzIHRoZSBjYWxsYmFjay5cbiAqIEluIHBhcnRpY3VsYXIsIGlmIHRoZSBjYWxsYmFjayBpcyBjYWxsZWQgc3luY2hyb25vdXNseSB0aGUgc3Vic2NyaXB0aW9uIG9mIHRoZSByZXN1bHRpbmcgT2JzZXJ2YWJsZVxuICogd2lsbCBjYWxsIHRoZSBgbmV4dGAgZnVuY3Rpb24gc3luY2hyb25vdXNseSBhcyB3ZWxsLiAgSWYgeW91IHdhbnQgdG8gZGVmZXIgdGhhdCBjYWxsLFxuICogeW91IG1heSB1c2Uge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBqdXN0IGFzIGJlZm9yZS4gIFRoaXMgbWVhbnMgdGhhdCBieSB1c2luZyBgU2NoZWR1bGVyLmFzeW5jYCB5b3UgY2FuXG4gKiBlbnN1cmUgdGhhdCBgZnVuY2AgYWx3YXlzIGNhbGxzIGl0cyBjYWxsYmFjayBhc3luY2hyb25vdXNseSwgdGh1cyBhdm9pZGluZyB0ZXJyaWZ5aW5nIFphbGdvLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgT2JzZXJ2YWJsZSBjcmVhdGVkIGJ5IHRoZSBvdXRwdXQgZnVuY3Rpb24gd2lsbCBhbHdheXMgZW1pdCBhIHNpbmdsZSB2YWx1ZVxuICogYW5kIHRoZW4gY29tcGxldGUgaW1tZWRpYXRlbHkuIElmIGBmdW5jYCBjYWxscyB0aGUgY2FsbGJhY2sgbXVsdGlwbGUgdGltZXMsIHZhbHVlcyBmcm9tIHN1YnNlcXVlbnRcbiAqIGNhbGxzIHdpbGwgbm90IGFwcGVhciBpbiB0aGUgc3RyZWFtLiBJZiB5b3UgbmVlZCB0byBsaXN0ZW4gZm9yIG11bHRpcGxlIGNhbGxzLFxuICogIHlvdSBwcm9iYWJseSB3YW50IHRvIHVzZSB7QGxpbmsgZnJvbUV2ZW50fSBvciB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn0gaW5zdGVhZC5cbiAqXG4gKiBJZiBgZnVuY2AgZGVwZW5kcyBvbiBzb21lIGNvbnRleHQgKGB0aGlzYCBwcm9wZXJ0eSkgYW5kIGlzIG5vdCBhbHJlYWR5IGJvdW5kIHRoZSBjb250ZXh0IG9mIGBmdW5jYFxuICogd2lsbCBiZSB0aGUgY29udGV4dCB0aGF0IHRoZSBvdXRwdXQgZnVuY3Rpb24gaGFzIGF0IGNhbGwgdGltZS4gSW4gcGFydGljdWxhciwgaWYgYGZ1bmNgXG4gKiBpcyBjYWxsZWQgYXMgYSBtZXRob2Qgb2Ygc29tZSBvYmplYyBhbmQgaWYgYGZ1bmNgIGlzIG5vdCBhbHJlYWR5IGJvdW5kLCBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dFxuICogaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB0aGUgY29udGV4dCBvZiB0aGUgb3V0cHV0IGZ1bmN0aW9uIGlzIHNldCB0byB0aGF0IG9iamVjdCBhcyB3ZWxsLlxuICpcbiAqIElmIHRoZSBpbnB1dCBmdW5jdGlvbiBjYWxscyBpdHMgY2FsbGJhY2sgaW4gdGhlIFwibm9kZSBzdHlsZVwiIChpLmUuIGZpcnN0IGFyZ3VtZW50IHRvIGNhbGxiYWNrIGlzXG4gKiBvcHRpb25hbCBlcnJvciBwYXJhbWV0ZXIgc2lnbmFsaW5nIHdoZXRoZXIgdGhlIGNhbGwgZmFpbGVkIG9yIG5vdCksIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogcHJvdmlkZXMgY29udmVuaWVudCBlcnJvciBoYW5kbGluZyBhbmQgcHJvYmFibHkgaXMgYSBiZXR0ZXIgY2hvaWNlLlxuICogYGJpbmRDYWxsYmFja2Agd2lsbCB0cmVhdCBzdWNoIGZ1bmN0aW9ucyB0aGUgc2FtZSBhcyBhbnkgb3RoZXIgYW5kIGVycm9yIHBhcmFtZXRlcnNcbiAqICh3aGV0aGVyIHBhc3NlZCBvciBub3QpIHdpbGwgYWx3YXlzIGJlIGludGVycHJldGVkIGFzIHJlZ3VsYXIgY2FsbGJhY2sgYXJndW1lbnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiAjIyMgQ29udmVydCBqUXVlcnkncyBnZXRKU09OIHRvIGFuIE9ic2VydmFibGUgQVBJXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBTdXBwb3NlIHdlIGhhdmUgalF1ZXJ5LmdldEpTT04oJy9teS91cmwnLCBjYWxsYmFjaylcbiAqIHZhciBnZXRKU09OQXNPYnNlcnZhYmxlID0gYmluZENhbGxiYWNrKGpRdWVyeS5nZXRKU09OKTtcbiAqIHZhciByZXN1bHQgPSBnZXRKU09OQXNPYnNlcnZhYmxlKCcvbXkvdXJsJyk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVjZWl2ZSBhbiBhcnJheSBvZiBhcmd1bWVudHMgcGFzc2VkIHRvIGEgY2FsbGJhY2tcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbigoYSwgYiwgYykgPT4ge1xuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogICBjb25zb2xlLmxvZyhiKTsgLy8gJ3NvbWUgc3RyaW5nJ1xuICogICBjb25zb2xlLmxvZyhjKTsgLy8ge3NvbWVQcm9wZXJ0eTogJ3NvbWVWYWx1ZSd9XG4gKiB9KTtcbiAqXG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmRDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKS5zdWJzY3JpYmUodmFsdWVzID0+IHtcbiAqICAgY29uc29sZS5sb2codmFsdWVzKSAvLyBbNSwgJ3NvbWUgc3RyaW5nJywge3NvbWVQcm9wZXJ0eTogJ3NvbWVWYWx1ZSd9XVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29tcGFyZSBiZWhhdmlvdXIgd2l0aCBhbmQgd2l0aG91dCBhc3luYyBTY2hlZHVsZXJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uIGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHkoY2IpIHtcbiAqICAgY2IoKTtcbiAqIH1cbiAqXG4gKiBjb25zdCBib3VuZFN5bmNGbiA9IGJpbmRDYWxsYmFjayhpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5KTtcbiAqIGNvbnN0IGJvdW5kQXN5bmNGbiA9IGJpbmRDYWxsYmFjayhpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5LCBudWxsLCBSeC5TY2hlZHVsZXIuYXN5bmMpO1xuICpcbiAqIGJvdW5kU3luY0ZuKCkuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdJIHdhcyBzeW5jIScpKTtcbiAqIGJvdW5kQXN5bmNGbigpLnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnSSB3YXMgYXN5bmMhJykpO1xuICogY29uc29sZS5sb2coJ1RoaXMgaGFwcGVuZWQuLi4nKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gSSB3YXMgc3luYyFcbiAqIC8vIFRoaXMgaGFwcGVuZWQuLi5cbiAqIC8vIEkgd2FzIGFzeW5jIVxuICogYGBgXG4gKlxuICogIyMjIFVzZSBiaW5kQ2FsbGJhY2sgb24gYW4gb2JqZWN0IG1ldGhvZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgYm91bmRNZXRob2QgPSBiaW5kQ2FsbGJhY2soc29tZU9iamVjdC5tZXRob2RXaXRoQ2FsbGJhY2spO1xuICogYm91bmRNZXRob2QuY2FsbChzb21lT2JqZWN0KSAvLyBtYWtlIHN1cmUgbWV0aG9kV2l0aENhbGxiYWNrIGhhcyBhY2Nlc3MgdG8gc29tZU9iamVjdFxuICogLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgQSBmdW5jdGlvbiB3aXRoIGEgY2FsbGJhY2sgYXMgdGhlIGxhc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBUaGUgc2NoZWR1bGVyIG9uIHdoaWNoIHRvIHNjaGVkdWxlIHRoZVxuICogY2FsbGJhY2tzLlxuICogQHJldHVybiB7ZnVuY3Rpb24oLi4ucGFyYW1zOiAqKTogT2JzZXJ2YWJsZX0gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIHRoZVxuICogT2JzZXJ2YWJsZSB0aGF0IGRlbGl2ZXJzIHRoZSBzYW1lIHZhbHVlcyB0aGUgY2FsbGJhY2sgd291bGQgZGVsaXZlci5cbiAqIEBuYW1lIGJpbmRDYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFQ+KFxuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLFxuICByZXN1bHRTZWxlY3Rvcj86IEZ1bmN0aW9ufFNjaGVkdWxlckxpa2UsXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2Vcbik6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxUPiB7XG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmMsIHNjaGVkdWxlcikoLi4uYXJncykucGlwZShcbiAgICAgICAgbWFwKChhcmdzKSA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgIGxldCBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgY29udGV4dCxcbiAgICAgIHN1YmplY3QsXG4gICAgICBjYWxsYmFja0Z1bmMsXG4gICAgICBzY2hlZHVsZXIsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICBpZiAoIXN1YmplY3QpIHtcbiAgICAgICAgICBzdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgc3ViamVjdC5uZXh0KGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncyk7XG4gICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4gPSB7XG4gICAgICAgICAgYXJncywgc3Vic2NyaWJlciwgcGFyYW1zLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoU3RhdGU8VD4+KGRpc3BhdGNoLCAwLCBzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaFN0YXRlPFQ+IHtcbiAgYXJnczogYW55W107XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG4gIHBhcmFtczogUGFyYW1zQ29udGV4dDxUPjtcbn1cblxuaW50ZXJmYWNlIFBhcmFtc0NvbnRleHQ8VD4ge1xuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG4gIGNvbnRleHQ6IGFueTtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RGlzcGF0Y2hTdGF0ZTxUPj4sIHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBjb25zdCB7IGFyZ3MsIHN1YnNjcmliZXIsIHBhcmFtcyB9ID0gc3RhdGU7XG4gIGNvbnN0IHsgY2FsbGJhY2tGdW5jLCBjb250ZXh0LCBzY2hlZHVsZXIgfSA9IHBhcmFtcztcbiAgbGV0IHsgc3ViamVjdCB9ID0gcGFyYW1zO1xuICBpZiAoIXN1YmplY3QpIHtcbiAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzO1xuICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPE5leHRTdGF0ZTxUPj4oZGlzcGF0Y2hOZXh0LCAwLCB7IHZhbHVlLCBzdWJqZWN0IH0pKTtcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuYWRkKHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbn1cblxuaW50ZXJmYWNlIE5leHRTdGF0ZTxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgdmFsdWU6IFQ7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248TmV4dFN0YXRlPFQ+Piwgc3RhdGU6IE5leHRTdGF0ZTxUPikge1xuICBjb25zdCB7IHZhbHVlLCBzdWJqZWN0IH0gPSBzdGF0ZTtcbiAgc3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgc3ViamVjdC5jb21wbGV0ZSgpO1xufVxuXG5pbnRlcmZhY2UgRXJyb3JTdGF0ZTxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgZXJyOiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXJyb3I8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPEVycm9yU3RhdGU8VD4+LCBzdGF0ZTogRXJyb3JTdGF0ZTxUPikge1xuICBjb25zdCB7IGVyciwgc3ViamVjdCB9ID0gc3RhdGU7XG4gIHN1YmplY3QuZXJyb3IoZXJyKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgZGVwcmVjYXRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMT4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjsgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG4vKipcbiAqIENvbnZlcnRzIGEgTm9kZS5qcy1zdHlsZSBjYWxsYmFjayBBUEkgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW5cbiAqIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MganVzdCBsaWtlIHtAbGluayBiaW5kQ2FsbGJhY2t9LCBidXQgdGhlXG4gKiBjYWxsYmFjayBpcyBleHBlY3RlZCB0byBiZSBvZiB0eXBlIGBjYWxsYmFjayhlcnJvciwgcmVzdWx0KWAuPC9zcGFuPlxuICpcbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyBub3QgYW4gb3BlcmF0b3IgYmVjYXVzZSBpdHMgaW5wdXQgYW5kIG91dHB1dCBhcmUgbm90XG4gKiBPYnNlcnZhYmxlcy4gVGhlIGlucHV0IGlzIGEgZnVuY3Rpb24gYGZ1bmNgIHdpdGggc29tZSBwYXJhbWV0ZXJzLCBidXQgdGhlXG4gKiBsYXN0IHBhcmFtZXRlciBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBgZnVuY2AgY2FsbHMgd2hlbiBpdCBpc1xuICogZG9uZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGZvbGxvdyBOb2RlLmpzIGNvbnZlbnRpb25zLFxuICogd2hlcmUgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjayBpcyBhbiBlcnJvciBvYmplY3QsIHNpZ25hbGluZ1xuICogd2hldGhlciBjYWxsIHdhcyBzdWNjZXNzZnVsLiBJZiB0aGF0IG9iamVjdCBpcyBwYXNzZWQgdG8gY2FsbGJhY2ssIGl0IG1lYW5zXG4gKiBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIHNhbWVcbiAqIHBhcmFtZXRlcnMgYXMgYGZ1bmNgLCBleGNlcHQgdGhlIGxhc3Qgb25lICh0aGUgY2FsbGJhY2spLiBXaGVuIHRoZSBvdXRwdXRcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50cywgaXQgd2lsbCByZXR1cm4gYW4gT2JzZXJ2YWJsZS5cbiAqIElmIGBmdW5jYCBjYWxscyBpdHMgY2FsbGJhY2sgd2l0aCBlcnJvciBwYXJhbWV0ZXIgcHJlc2VudCwgT2JzZXJ2YWJsZSB3aWxsXG4gKiBlcnJvciB3aXRoIHRoYXQgdmFsdWUgYXMgd2VsbC4gSWYgZXJyb3IgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIE9ic2VydmFibGUgd2lsbCBlbWl0XG4gKiBzZWNvbmQgcGFyYW1ldGVyLiBJZiB0aGVyZSBhcmUgbW9yZSBwYXJhbWV0ZXJzICh0aGlyZCBhbmQgc28gb24pLFxuICogT2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBhbGwgYXJndW1lbnRzLCBleGNlcHQgZmlyc3QgZXJyb3IgYXJndW1lbnQuXG4gKlxuICogTm90ZSB0aGF0IGBmdW5jYCB3aWxsIG5vdCBiZSBjYWxsZWQgYXQgdGhlIHNhbWUgdGltZSBvdXRwdXQgZnVuY3Rpb24gaXMsXG4gKiBidXQgcmF0aGVyIHdoZW5ldmVyIHJlc3VsdGluZyBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQuIEJ5IGRlZmF1bHQgY2FsbCB0b1xuICogYGZ1bmNgIHdpbGwgaGFwcGVuIHN5bmNocm9ub3VzbHkgYWZ0ZXIgc3Vic2NyaXB0aW9uLCBidXQgdGhhdCBjYW4gYmUgY2hhbmdlZFxuICogd2l0aCBwcm9wZXIgYHNjaGVkdWxlcmAgcHJvdmlkZWQgYXMgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyLiB7QGxpbmsgU2NoZWR1bGVyTGlrZX1cbiAqIGNhbiBhbHNvIGNvbnRyb2wgd2hlbiB2YWx1ZXMgZnJvbSBjYWxsYmFjayB3aWxsIGJlIGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZS5cbiAqIFRvIGZpbmQgb3V0IG1vcmUsIGNoZWNrIG91dCBkb2N1bWVudGF0aW9uIGZvciB7QGxpbmsgYmluZENhbGxiYWNrfSwgd2hlcmVcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSB3b3JrcyBleGFjdGx5IHRoZSBzYW1lLlxuICpcbiAqIEFzIGluIHtAbGluayBiaW5kQ2FsbGJhY2t9LCBjb250ZXh0IChgdGhpc2AgcHJvcGVydHkpIG9mIGlucHV0IGZ1bmN0aW9uIHdpbGwgYmUgc2V0IHRvIGNvbnRleHRcbiAqIG9mIHJldHVybmVkIGZ1bmN0aW9uLCB3aGVuIGl0IGlzIGNhbGxlZC5cbiAqXG4gKiBBZnRlciBPYnNlcnZhYmxlIGVtaXRzIHZhbHVlLCBpdCB3aWxsIGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBUaGlzIG1lYW5zXG4gKiBldmVuIGlmIGBmdW5jYCBjYWxscyBjYWxsYmFjayBhZ2FpbiwgdmFsdWVzIGZyb20gc2Vjb25kIGFuZCBjb25zZWN1dGl2ZVxuICogY2FsbHMgd2lsbCBuZXZlciBhcHBlYXIgb24gdGhlIHN0cmVhbS4gSWYgeW91IG5lZWQgdG8gaGFuZGxlIGZ1bmN0aW9uc1xuICogdGhhdCBjYWxsIGNhbGxiYWNrcyBtdWx0aXBsZSB0aW1lcywgY2hlY2sgb3V0IHtAbGluayBmcm9tRXZlbnR9IG9yXG4gKiB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn0gaW5zdGVhZC5cbiAqXG4gKiBOb3RlIHRoYXQgYGJpbmROb2RlQ2FsbGJhY2tgIGNhbiBiZSB1c2VkIGluIG5vbi1Ob2RlLmpzIGVudmlyb25tZW50cyBhcyB3ZWxsLlxuICogXCJOb2RlLmpzLXN0eWxlXCIgY2FsbGJhY2tzIGFyZSBqdXN0IGEgY29udmVudGlvbiwgc28gaWYgeW91IHdyaXRlIGZvclxuICogYnJvd3NlcnMgb3IgYW55IG90aGVyIGVudmlyb25tZW50IGFuZCBBUEkgeW91IHVzZSBpbXBsZW1lbnRzIHRoYXQgY2FsbGJhY2sgc3R5bGUsXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgY2FuIGJlIHNhZmVseSB1c2VkIG9uIHRoYXQgQVBJIGZ1bmN0aW9ucyBhcyB3ZWxsLlxuICpcbiAqIFJlbWVtYmVyIHRoYXQgRXJyb3Igb2JqZWN0IHBhc3NlZCB0byBjYWxsYmFjayBkb2VzIG5vdCBoYXZlIHRvIGJlIGFuIGluc3RhbmNlXG4gKiBvZiBKYXZhU2NyaXB0IGJ1aWx0LWluIGBFcnJvcmAgb2JqZWN0LiBJbiBmYWN0LCBpdCBkb2VzIG5vdCBldmVuIGhhdmUgdG8gYW4gb2JqZWN0LlxuICogRXJyb3IgcGFyYW1ldGVyIG9mIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGludGVycHJldGVkIGFzIFwicHJlc2VudFwiLCB3aGVuIHZhbHVlXG4gKiBvZiB0aGF0IHBhcmFtZXRlciBpcyB0cnV0aHkuIEl0IGNvdWxkIGJlLCBmb3IgZXhhbXBsZSwgbm9uLXplcm8gbnVtYmVyLCBub24tZW1wdHlcbiAqIHN0cmluZyBvciBib29sZWFuIGB0cnVlYC4gSW4gYWxsIG9mIHRoZXNlIGNhc2VzIHJlc3VsdGluZyBPYnNlcnZhYmxlIHdvdWxkIGVycm9yXG4gKiB3aXRoIHRoYXQgdmFsdWUuIFRoaXMgbWVhbnMgdXN1YWxseSByZWd1bGFyIHN0eWxlIGNhbGxiYWNrcyB3aWxsIGZhaWwgdmVyeSBvZnRlbiB3aGVuXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgaXMgdXNlZC4gSWYgeW91ciBPYnNlcnZhYmxlIGVycm9ycyBtdWNoIG1vcmUgb2Z0ZW4gdGhlbiB5b3VcbiAqIHdvdWxkIGV4cGVjdCwgY2hlY2sgaWYgY2FsbGJhY2sgcmVhbGx5IGlzIGNhbGxlZCBpbiBOb2RlLmpzLXN0eWxlIGFuZCwgaWYgbm90LFxuICogc3dpdGNoIHRvIHtAbGluayBiaW5kQ2FsbGJhY2t9IGluc3RlYWQuXG4gKlxuICogTm90ZSB0aGF0IGV2ZW4gaWYgZXJyb3IgcGFyYW1ldGVyIGlzIHRlY2huaWNhbGx5IHByZXNlbnQgaW4gY2FsbGJhY2ssIGJ1dCBpdHMgdmFsdWVcbiAqIGlzIGZhbHN5LCBpdCBzdGlsbCB3b24ndCBhcHBlYXIgaW4gYXJyYXkgZW1pdHRlZCBieSBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgIFJlYWQgYSBmaWxlIGZyb20gdGhlIGZpbGVzeXN0ZW0gYW5kIGdldCB0aGUgZGF0YSBhcyBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG4gKiBjb25zdCByZWFkRmlsZUFzT2JzZXJ2YWJsZSA9IGJpbmROb2RlQ2FsbGJhY2soZnMucmVhZEZpbGUpO1xuICogY29uc3QgcmVzdWx0ID0gcmVhZEZpbGVBc09ic2VydmFibGUoJy4vcm9hZE5hbWVzLnR4dCcsICd1dGY4Jyk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIG9uIGZ1bmN0aW9uIGNhbGxpbmcgY2FsbGJhY2sgd2l0aCBtdWx0aXBsZSBhcmd1bWVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbigoZXJyLCBhLCBiKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGVycik7IC8vIG51bGxcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqICAgY29uc29sZS5sb2coYik7IC8vIFwic29tZSBzdHJpbmdcIlxuICogfSk7XG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmROb2RlQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKClcbiAqIC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7IC8vIFs1LCBcInNvbWUgc3RyaW5nXCJdXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBVc2Ugb24gZnVuY3Rpb24gY2FsbGluZyBjYWxsYmFjayBpbiByZWd1bGFyIHN0eWxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oYSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiB9KTtcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZE5vZGVDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4ge30gICAgICAgICAgICAgLy8gbmV2ZXIgZ2V0cyBjYWxsZWRcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVycikgLy8gNVxuICogKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJpbmRDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyBGdW5jdGlvbiB3aXRoIGEgTm9kZS5qcy1zdHlsZSBjYWxsYmFjayBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFRoZSBzY2hlZHVsZXIgb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlXG4gKiBjYWxsYmFja3MuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5wYXJhbXM6ICopOiBPYnNlcnZhYmxlfSBBIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlXG4gKiBPYnNlcnZhYmxlIHRoYXQgZGVsaXZlcnMgdGhlIHNhbWUgdmFsdWVzIHRoZSBOb2RlLmpzIGNhbGxiYWNrIHdvdWxkXG4gKiBkZWxpdmVyLlxuICogQG5hbWUgYmluZE5vZGVDYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxUPihcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbixcbiAgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9ufFNjaGVkdWxlckxpa2UsXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2Vcbik6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxUPiB7XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgaWYgKGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmMsIHNjaGVkdWxlcikoLi4uYXJncykucGlwZShcbiAgICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgcGFyYW1zOiBQYXJhbXNTdGF0ZTxUPiA9IHtcbiAgICAgIHN1YmplY3Q6IHVuZGVmaW5lZCxcbiAgICAgIGFyZ3MsXG4gICAgICBjYWxsYmFja0Z1bmMsXG4gICAgICBzY2hlZHVsZXIsXG4gICAgICBjb250ZXh0OiB0aGlzLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3QgeyBjb250ZXh0IH0gPSBwYXJhbXM7XG4gICAgICBsZXQgeyBzdWJqZWN0IH0gPSBwYXJhbXM7XG4gICAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICBpZiAoIXN1YmplY3QpIHtcbiAgICAgICAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSBpbm5lckFyZ3Muc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3ViamVjdC5uZXh0KGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncyk7XG4gICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaFN0YXRlPFQ+PihkaXNwYXRjaCwgMCwgeyBwYXJhbXMsIHN1YnNjcmliZXIsIGNvbnRleHQgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaFN0YXRlPFQ+IHtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgY29udGV4dDogYW55O1xuICBwYXJhbXM6IFBhcmFtc1N0YXRlPFQ+O1xufVxuXG5pbnRlcmZhY2UgUGFyYW1zU3RhdGU8VD4ge1xuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uO1xuICBhcmdzOiBhbnlbXTtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlO1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGNvbnRleHQ6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoU3RhdGU8VD4+LCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPikge1xuICBjb25zdCB7IHBhcmFtcywgc3Vic2NyaWJlciwgY29udGV4dCB9ID0gc3RhdGU7XG4gIGNvbnN0IHsgY2FsbGJhY2tGdW5jLCBhcmdzLCBzY2hlZHVsZXIgfSA9IHBhcmFtcztcbiAgbGV0IHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdDtcblxuICBpZiAoIXN1YmplY3QpIHtcbiAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IGVyciA9IGlubmVyQXJncy5zaGlmdCgpO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hFcnJvckFyZzxUPj4oZGlzcGF0Y2hFcnJvciwgMCwgeyBlcnIsIHN1YmplY3QgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3M7XG4gICAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaE5leHRBcmc8VD4+KGRpc3BhdGNoTmV4dCwgMCwgeyB2YWx1ZSwgc3ViamVjdCB9KSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEVycm9yQXJnPFQ+PihkaXNwYXRjaEVycm9yLCAwLCB7IGVyciwgc3ViamVjdCB9KSk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGQoc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hOZXh0QXJnPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICB2YWx1ZTogVDtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hOZXh0PFQ+KGFyZzogRGlzcGF0Y2hOZXh0QXJnPFQ+KSB7XG4gIGNvbnN0IHsgdmFsdWUsIHN1YmplY3QgfSA9IGFyZztcbiAgc3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgc3ViamVjdC5jb21wbGV0ZSgpO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hFcnJvckFyZzxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgZXJyOiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXJyb3I8VD4oYXJnOiBEaXNwYXRjaEVycm9yQXJnPFQ+KSB7XG4gIGNvbnN0IHsgZXJyLCBzdWJqZWN0IH0gPSBhcmc7XG4gIHN1YmplY3QuZXJyb3IoZXJyKTtcbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi9Jbm5lclN1YnNjcmliZXInO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIE91dGVyU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycm9yOiBhbnksIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycm9yKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi9PdXRlclN1YnNjcmliZXInO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIElubmVyU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8Uj4ge1xuICBwcml2YXRlIGluZGV4ID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmVudDogT3V0ZXJTdWJzY3JpYmVyPFQsIFI+LCBwdWJsaWMgb3V0ZXJWYWx1ZTogVCwgcHVibGljIG91dGVySW5kZXg6IG51bWJlcikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFIpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5ub3RpZnlOZXh0KHRoaXMub3V0ZXJWYWx1ZSwgdmFsdWUsIHRoaXMub3V0ZXJJbmRleCwgdGhpcy5pbmRleCsrLCB0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyb3I6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50Lm5vdGlmeUVycm9yKGVycm9yLCB0aGlzKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50Lm5vdGlmeUNvbXBsZXRlKHRoaXMpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi9ob3N0UmVwb3J0RXJyb3InO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9Qcm9taXNlID0gPFQ+KHByb21pc2U6IFByb21pc2VMaWtlPFQ+KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBwcm9taXNlLnRoZW4oXG4gICAgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIChlcnI6IGFueSkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpXG4gIClcbiAgLnRoZW4obnVsbCwgaG9zdFJlcG9ydEVycm9yKTtcbiAgcmV0dXJuIHN1YnNjcmliZXI7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFN5bWJvbEl0ZXJhdG9yKCk6IHN5bWJvbCB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nIHx8ICFTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICByZXR1cm4gJ0BAaXRlcmF0b3InIGFzIGFueTtcbiAgfVxuXG4gIHJldHVybiBTeW1ib2wuaXRlcmF0b3I7XG59XG5cbmV4cG9ydCBjb25zdCBpdGVyYXRvciA9IGdldFN5bWJvbEl0ZXJhdG9yKCk7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGluayBpdGVyYXRvcn0gaW5zdGVhZFxuICovXG5leHBvcnQgY29uc3QgJCRpdGVyYXRvciA9IGl0ZXJhdG9yO1xuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvSXRlcmFibGUgPSA8VD4oaXRlcmFibGU6IEl0ZXJhYmxlPFQ+KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBjb25zdCBpdGVyYXRvciA9IGl0ZXJhYmxlW1N5bWJvbF9pdGVyYXRvcl0oKTtcbiAgZG8ge1xuICAgIGNvbnN0IGl0ZW0gPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgaWYgKGl0ZW0uZG9uZSkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHN1YnNjcmliZXIubmV4dChpdGVtLnZhbHVlKTtcbiAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgLy8gRmluYWxpemUgdGhlIGl0ZXJhdG9yIGlmIGl0IGhhcHBlbnMgdG8gYmUgYSBHZW5lcmF0b3JcbiAgaWYgKHR5cGVvZiBpdGVyYXRvci5yZXR1cm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICBzdWJzY3JpYmVyLmFkZCgoKSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgIGl0ZXJhdG9yLnJldHVybigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHN1YnNjcmliZXI7XG59O1xuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcblxuLyoqXG4gKiBTdWJzY3JpYmVzIHRvIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgU3ltYm9sLm9ic2VydmFibGUgd2l0aCB0aGUgZ2l2ZW5cbiAqIFN1YnNjcmliZXIuXG4gKiBAcGFyYW0gb2JqIEFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMgU3ltYm9sLm9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvT2JzZXJ2YWJsZSA9IDxUPihvYmo6IGFueSkgPT4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgY29uc3Qgb2JzID0gb2JqW1N5bWJvbF9vYnNlcnZhYmxlXSgpO1xuICBpZiAodHlwZW9mIG9icy5zdWJzY3JpYmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBTaG91bGQgYmUgY2F1Z2h0IGJ5IG9ic2VydmFibGUgc3Vic2NyaWJlIGZ1bmN0aW9uIGVycm9yIGhhbmRsaW5nLlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3ZpZGVkIG9iamVjdCBkb2VzIG5vdCBjb3JyZWN0bHkgaW1wbGVtZW50IFN5bWJvbC5vYnNlcnZhYmxlJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9icy5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3QgaXNBcnJheUxpa2UgPSAoPFQ+KHg6IGFueSk6IHggaXMgQXJyYXlMaWtlPFQ+ID0+IHggJiYgdHlwZW9mIHgubGVuZ3RoID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgeCAhPT0gJ2Z1bmN0aW9uJyk7IiwiZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZSh2YWx1ZTogYW55KTogdmFsdWUgaXMgUHJvbWlzZUxpa2U8YW55PiB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgKDxhbnk+dmFsdWUpLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgKHZhbHVlIGFzIGFueSkudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHN1YnNjcmliZVRvQXJyYXkgfSBmcm9tICcuL3N1YnNjcmliZVRvQXJyYXknO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9Qcm9taXNlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb1Byb21pc2UnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9JdGVyYWJsZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9JdGVyYWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4vaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL2lzT2JqZWN0JztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG8gPSA8VD4ocmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4pID0+IHtcbiAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICByZXR1cm4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5faXNTY2FsYXIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KChyZXN1bHQgYXMgYW55KS52YWx1ZSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvT2JzZXJ2YWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvQXJyYXkocmVzdWx0KTtcbiAgfSBlbHNlIGlmIChpc1Byb21pc2UocmVzdWx0KSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb1Byb21pc2UocmVzdWx0IGFzIFByb21pc2U8YW55Pik7XG4gIH0gZWxzZSBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX2l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb0l0ZXJhYmxlKHJlc3VsdCBhcyBhbnkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZhbHVlID0gaXNPYmplY3QocmVzdWx0KSA/ICdhbiBpbnZhbGlkIG9iamVjdCcgOiBgJyR7cmVzdWx0fSdgO1xuICAgIGNvbnN0IG1zZyA9IGBZb3UgcHJvdmlkZWQgJHt2YWx1ZX0gd2hlcmUgYSBzdHJlYW0gd2FzIGV4cGVjdGVkLmBcbiAgICAgICsgJyBZb3UgY2FuIHByb3ZpZGUgYW4gT2JzZXJ2YWJsZSwgUHJvbWlzZSwgQXJyYXksIG9yIEl0ZXJhYmxlLic7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpO1xuICB9XG59O1xuIiwiXG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUbyB9IGZyb20gJy4vc3Vic2NyaWJlVG8nO1xuXG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4ob3V0ZXJTdWJzY3JpYmVyOiBPdXRlclN1YnNjcmliZXI8VCwgUj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJWYWx1ZT86IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJJbmRleD86IG51bWJlcik6IFN1YnNjcmlwdGlvbjtcbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVUb1Jlc3VsdDxUPihvdXRlclN1YnNjcmliZXI6IE91dGVyU3Vic2NyaWJlcjxhbnksIGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJWYWx1ZT86IFQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJJbmRleD86IG51bWJlcik6IFN1YnNjcmlwdGlvbiB8IHZvaWQge1xuICBjb25zdCBkZXN0aW5hdGlvbiA9IG5ldyBJbm5lclN1YnNjcmliZXIob3V0ZXJTdWJzY3JpYmVyLCBvdXRlclZhbHVlLCBvdXRlckluZGV4KTtcblxuICByZXR1cm4gc3Vic2NyaWJlVG8ocmVzdWx0KShkZXN0aW5hdGlvbik7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciAgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGlzQXJyYXkgIH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuXG5jb25zdCBOT05FID0ge307XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyKSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1KSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1LCB2NjogVDYpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VD4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSwgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSwgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8ICgoLi4udmFsdWVzOiBBcnJheTxUPikgPT4gUikgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbWJpbmVzIG11bHRpcGxlIE9ic2VydmFibGVzIHRvIGNyZWF0ZSBhbiBPYnNlcnZhYmxlIHdob3NlIHZhbHVlcyBhcmVcbiAqIGNhbGN1bGF0ZWQgZnJvbSB0aGUgbGF0ZXN0IHZhbHVlcyBvZiBlYWNoIG9mIGl0cyBpbnB1dCBPYnNlcnZhYmxlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2hlbmV2ZXIgYW55IGlucHV0IE9ic2VydmFibGUgZW1pdHMgYSB2YWx1ZSwgaXRcbiAqIGNvbXB1dGVzIGEgZm9ybXVsYSB1c2luZyB0aGUgbGF0ZXN0IHZhbHVlcyBmcm9tIGFsbCB0aGUgaW5wdXRzLCB0aGVuIGVtaXRzXG4gKiB0aGUgb3V0cHV0IG9mIHRoYXQgZm9ybXVsYS48L3NwYW4+XG4gKlxuICogIVtdKGNvbWJpbmVMYXRlc3QucG5nKVxuICpcbiAqIGBjb21iaW5lTGF0ZXN0YCBjb21iaW5lcyB0aGUgdmFsdWVzIGZyb20gYWxsIHRoZSBPYnNlcnZhYmxlcyBwYXNzZWQgYXNcbiAqIGFyZ3VtZW50cy4gVGhpcyBpcyBkb25lIGJ5IHN1YnNjcmliaW5nIHRvIGVhY2ggT2JzZXJ2YWJsZSBpbiBvcmRlciBhbmQsXG4gKiB3aGVuZXZlciBhbnkgT2JzZXJ2YWJsZSBlbWl0cywgY29sbGVjdGluZyBhbiBhcnJheSBvZiB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlcyBmcm9tIGVhY2ggT2JzZXJ2YWJsZS4gU28gaWYgeW91IHBhc3MgYG5gIE9ic2VydmFibGVzIHRvIG9wZXJhdG9yLFxuICogcmV0dXJuZWQgT2JzZXJ2YWJsZSB3aWxsIGFsd2F5cyBlbWl0IGFuIGFycmF5IG9mIGBuYCB2YWx1ZXMsIGluIG9yZGVyXG4gKiBjb3JyZXNwb25kaW5nIHRvIG9yZGVyIG9mIHBhc3NlZCBPYnNlcnZhYmxlcyAodmFsdWUgZnJvbSB0aGUgZmlyc3QgT2JzZXJ2YWJsZVxuICogb24gdGhlIGZpcnN0IHBsYWNlIGFuZCBzbyBvbikuXG4gKlxuICogU3RhdGljIHZlcnNpb24gb2YgYGNvbWJpbmVMYXRlc3RgIGFjY2VwdHMgZWl0aGVyIGFuIGFycmF5IG9mIE9ic2VydmFibGVzXG4gKiBvciBlYWNoIE9ic2VydmFibGUgY2FuIGJlIHB1dCBkaXJlY3RseSBhcyBhbiBhcmd1bWVudC4gTm90ZSB0aGF0IGFycmF5IG9mXG4gKiBPYnNlcnZhYmxlcyBpcyBnb29kIGNob2ljZSwgaWYgeW91IGRvbid0IGtub3cgYmVmb3JlaGFuZCBob3cgbWFueSBPYnNlcnZhYmxlc1xuICogeW91IHdpbGwgY29tYmluZS4gUGFzc2luZyBlbXB0eSBhcnJheSB3aWxsIHJlc3VsdCBpbiBPYnNlcnZhYmxlIHRoYXRcbiAqIGNvbXBsZXRlcyBpbW1lZGlhdGVseS5cbiAqXG4gKiBUbyBlbnN1cmUgb3V0cHV0IGFycmF5IGhhcyBhbHdheXMgdGhlIHNhbWUgbGVuZ3RoLCBgY29tYmluZUxhdGVzdGAgd2lsbFxuICogYWN0dWFsbHkgd2FpdCBmb3IgYWxsIGlucHV0IE9ic2VydmFibGVzIHRvIGVtaXQgYXQgbGVhc3Qgb25jZSxcbiAqIGJlZm9yZSBpdCBzdGFydHMgZW1pdHRpbmcgcmVzdWx0cy4gVGhpcyBtZWFucyBpZiBzb21lIE9ic2VydmFibGUgZW1pdHNcbiAqIHZhbHVlcyBiZWZvcmUgb3RoZXIgT2JzZXJ2YWJsZXMgc3RhcnRlZCBlbWl0dGluZywgYWxsIHRoYXQgdmFsdWVzIGJ1dCBsYXN0XG4gKiB3aWxsIGJlIGxvc3QuIE9uIHRoZSBvdGhlciBoYW5kLCBpZiBzb21lIE9ic2VydmFibGUgZG9lcyBub3QgZW1pdCB2YWx1ZSBidXRcbiAqIGNvbXBsZXRlcywgcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSBhdCB0aGUgc2FtZSBtb21lbnQgd2l0aG91dFxuICogZW1pdHRpbmcgYW55dGhpbmcsIHNpbmNlIGl0IHdpbGwgYmUgbm93IGltcG9zc2libGUgdG8gaW5jbHVkZSB2YWx1ZSBmcm9tXG4gKiBjb21wbGV0ZWQgT2JzZXJ2YWJsZSBpbiByZXN1bHRpbmcgYXJyYXkuIEFsc28sIGlmIHNvbWUgaW5wdXQgT2JzZXJ2YWJsZSBkb2VzXG4gKiBub3QgZW1pdCBhbnkgdmFsdWUgYW5kIG5ldmVyIGNvbXBsZXRlcywgYGNvbWJpbmVMYXRlc3RgIHdpbGwgYWxzbyBuZXZlciBlbWl0XG4gKiBhbmQgbmV2ZXIgY29tcGxldGUsIHNpbmNlLCBhZ2FpbiwgaXQgd2lsbCB3YWl0IGZvciBhbGwgc3RyZWFtcyB0byBlbWl0IHNvbWVcbiAqIHZhbHVlLlxuICpcbiAqIElmIGF0IGxlYXN0IG9uZSBPYnNlcnZhYmxlIHdhcyBwYXNzZWQgdG8gYGNvbWJpbmVMYXRlc3RgIGFuZCBhbGwgcGFzc2VkIE9ic2VydmFibGVzXG4gKiBlbWl0dGVkIHNvbWV0aGluZywgcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSB3aGVuIGFsbCBjb21iaW5lZFxuICogc3RyZWFtcyBjb21wbGV0ZS4gU28gZXZlbiBpZiBzb21lIE9ic2VydmFibGUgY29tcGxldGVzLCByZXN1bHQgb2ZcbiAqIGBjb21iaW5lTGF0ZXN0YCB3aWxsIHN0aWxsIGVtaXQgdmFsdWVzIHdoZW4gb3RoZXIgT2JzZXJ2YWJsZXMgZG8uIEluIGNhc2VcbiAqIG9mIGNvbXBsZXRlZCBPYnNlcnZhYmxlLCBpdHMgdmFsdWUgZnJvbSBub3cgb24gd2lsbCBhbHdheXMgYmUgdGhlIGxhc3RcbiAqIGVtaXR0ZWQgdmFsdWUuIE9uIHRoZSBvdGhlciBoYW5kLCBpZiBhbnkgT2JzZXJ2YWJsZSBlcnJvcnMsIGBjb21iaW5lTGF0ZXN0YFxuICogd2lsbCBlcnJvciBpbW1lZGlhdGVseSBhcyB3ZWxsLCBhbmQgYWxsIG90aGVyIE9ic2VydmFibGVzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxuICpcbiAqIGBjb21iaW5lTGF0ZXN0YCBhY2NlcHRzIGFzIG9wdGlvbmFsIHBhcmFtZXRlciBgcHJvamVjdGAgZnVuY3Rpb24sIHdoaWNoIHRha2VzXG4gKiBhcyBhcmd1bWVudHMgYWxsIHZhbHVlcyB0aGF0IHdvdWxkIG5vcm1hbGx5IGJlIGVtaXR0ZWQgYnkgcmVzdWx0aW5nIE9ic2VydmFibGUuXG4gKiBgcHJvamVjdGAgY2FuIHJldHVybiBhbnkga2luZCBvZiB2YWx1ZSwgd2hpY2ggd2lsbCBiZSB0aGVuIGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZVxuICogaW5zdGVhZCBvZiBkZWZhdWx0IGFycmF5LiBOb3RlIHRoYXQgYHByb2plY3RgIGRvZXMgbm90IHRha2UgYXMgYXJndW1lbnQgdGhhdCBhcnJheVxuICogb2YgdmFsdWVzLCBidXQgdmFsdWVzIHRoZW1zZWx2ZXMuIFRoYXQgbWVhbnMgZGVmYXVsdCBgcHJvamVjdGAgY2FuIGJlIGltYWdpbmVkXG4gKiBhcyBmdW5jdGlvbiB0aGF0IHRha2VzIGFsbCBpdHMgYXJndW1lbnRzIGFuZCBwdXRzIHRoZW0gaW50byBhbiBhcnJheS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbWJpbmUgdHdvIHRpbWVyIE9ic2VydmFibGVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBmaXJzdFRpbWVyID0gdGltZXIoMCwgMTAwMCk7IC8vIGVtaXQgMCwgMSwgMi4uLiBhZnRlciBldmVyeSBzZWNvbmQsIHN0YXJ0aW5nIGZyb20gbm93XG4gKiBjb25zdCBzZWNvbmRUaW1lciA9IHRpbWVyKDUwMCwgMTAwMCk7IC8vIGVtaXQgMCwgMSwgMi4uLiBhZnRlciBldmVyeSBzZWNvbmQsIHN0YXJ0aW5nIDAsNXMgZnJvbSBub3dcbiAqIGNvbnN0IGNvbWJpbmVkVGltZXJzID0gY29tYmluZUxhdGVzdChmaXJzdFRpbWVyLCBzZWNvbmRUaW1lcik7XG4gKiBjb21iaW5lZFRpbWVycy5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqIC8vIExvZ3NcbiAqIC8vIFswLCAwXSBhZnRlciAwLjVzXG4gKiAvLyBbMSwgMF0gYWZ0ZXIgMXNcbiAqIC8vIFsxLCAxXSBhZnRlciAxLjVzXG4gKiAvLyBbMiwgMV0gYWZ0ZXIgMnNcbiAqIGBgYFxuICpcbiAqICMjIyBDb21iaW5lIGFuIGFycmF5IG9mIE9ic2VydmFibGVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYnNlcnZhYmxlcyA9IFsxLCA1LCAxMF0ubWFwKFxuICogICBuID0+IG9mKG4pLnBpcGUoXG4gKiAgICAgZGVsYXkobiAqIDEwMDApLCAgIC8vIGVtaXQgMCBhbmQgdGhlbiBlbWl0IG4gYWZ0ZXIgbiBzZWNvbmRzXG4gKiAgICAgc3RhcnRXaXRoKDApLFxuICogICApXG4gKiApO1xuICogY29uc3QgY29tYmluZWQgPSBjb21iaW5lTGF0ZXN0KG9ic2VydmFibGVzKTtcbiAqIGNvbWJpbmVkLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICogLy8gTG9nc1xuICogLy8gWzAsIDAsIDBdIGltbWVkaWF0ZWx5XG4gKiAvLyBbMSwgMCwgMF0gYWZ0ZXIgMXNcbiAqIC8vIFsxLCA1LCAwXSBhZnRlciA1c1xuICogLy8gWzEsIDUsIDEwXSBhZnRlciAxMHNcbiAqIGBgYFxuICpcbiAqXG4gKiAjIyMgVXNlIHByb2plY3QgZnVuY3Rpb24gdG8gZHluYW1pY2FsbHkgY2FsY3VsYXRlIHRoZSBCb2R5LU1hc3MgSW5kZXhcbiAqIGBgYGphdmFzY3JpcHRcbiAqICogY29uc3Qgd2VpZ2h0ID0gb2YoNzAsIDcyLCA3NiwgNzksIDc1KTtcbiAqIGNvbnN0IGhlaWdodCA9IG9mKDEuNzYsIDEuNzcsIDEuNzgpO1xuICogY29uc3QgYm1pID0gY29tYmluZUxhdGVzdCh3ZWlnaHQsIGhlaWdodCkucGlwZShcbiAqICAgbWFwKChbdywgaF0pID0+IHcgLyAoaCAqIGgpKSxcbiAqICk7XG4gKiBibWkuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ0JNSSBpcyAnICsgeCkpO1xuICpcbiAqIC8vIFdpdGggb3V0cHV0IHRvIGNvbnNvbGU6XG4gKiAvLyBCTUkgaXMgMjQuMjEyMjkzMzg4NDI5NzUzXG4gKiAvLyBCTUkgaXMgMjMuOTM5NDgwOTkyMDUyMDlcbiAqIC8vIEJNSSBpcyAyMy42NzEyNTM2Mjk1OTIyMjJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZX1cbiAqIEBzZWUge0BsaW5rIHdpdGhMYXRlc3RGcm9tfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlMSBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbWJpbmUgd2l0aCBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlMiBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbWJpbmUgd2l0aCBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIE1vcmUgdGhhbiBvbmUgaW5wdXQgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIGFyZ3VtZW50c1xuICogb3IgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtwcm9qZWN0XSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0byBwcm9qZWN0IHRoZSB2YWx1ZXMgZnJvbVxuICogdGhlIGNvbWJpbmVkIGxhdGVzdCB2YWx1ZXMgaW50byBhIG5ldyB2YWx1ZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9bnVsbF0gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHN1YnNjcmliaW5nIHRvXG4gKiBlYWNoIGlucHV0IE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIHByb2plY3RlZCB2YWx1ZXMgZnJvbSB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlcyBmcm9tIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZSwgb3IgYW4gYXJyYXkgb2YgdGhlIG1vc3QgcmVjZW50IHZhbHVlcyBmcm9tXG4gKiBlYWNoIGlucHV0IE9ic2VydmFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxhbnkgfCBPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgbGV0IHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSID0gIG51bGw7XG4gIGxldCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBudWxsO1xuXG4gIGlmIChpc1NjaGVkdWxlcihvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSkpIHtcbiAgICBzY2hlZHVsZXIgPSA8U2NoZWR1bGVyTGlrZT5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXN1bHRTZWxlY3RvciA9IDwoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSPm9ic2VydmFibGVzLnBvcCgpO1xuICB9XG5cbiAgLy8gaWYgdGhlIGZpcnN0IGFuZCBvbmx5IG90aGVyIGFyZ3VtZW50IGJlc2lkZXMgdGhlIHJlc3VsdFNlbGVjdG9yIGlzIGFuIGFycmF5XG4gIC8vIGFzc3VtZSBpdCdzIGJlZW4gY2FsbGVkIHdpdGggYGNvbWJpbmVMYXRlc3QoW29iczEsIG9iczIsIG9iczNdLCByZXN1bHRTZWxlY3RvcilgXG4gIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShvYnNlcnZhYmxlc1swXSkpIHtcbiAgICBvYnNlcnZhYmxlcyA9IDxBcnJheTxPYnNlcnZhYmxlPGFueT4+Pm9ic2VydmFibGVzWzBdO1xuICB9XG5cbiAgcmV0dXJuIGZyb21BcnJheShvYnNlcnZhYmxlcywgc2NoZWR1bGVyKS5saWZ0KG5ldyBDb21iaW5lTGF0ZXN0T3BlcmF0b3I8VCwgUj4ocmVzdWx0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbWJpbmVMYXRlc3RPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBDb21iaW5lTGF0ZXN0U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlc3VsdFNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBDb21iaW5lTGF0ZXN0U3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgYWN0aXZlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHZhbHVlczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSB0b1Jlc3BvbmQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPiwgcHJpdmF0ZSByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQob2JzZXJ2YWJsZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXMucHVzaChOT05FKTtcbiAgICB0aGlzLm9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZhYmxlcy5sZW5ndGg7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGxlbjtcbiAgICAgIHRoaXMudG9SZXNwb25kID0gbGVuO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gb2JzZXJ2YWJsZXNbaV07XG4gICAgICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG9ic2VydmFibGUsIG9ic2VydmFibGUsIGkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSh1bnVzZWQ6IFN1YnNjcmliZXI8Uj4pOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMuYWN0aXZlIC09IDEpID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcbiAgICBjb25zdCBvbGRWYWwgPSB2YWx1ZXNbb3V0ZXJJbmRleF07XG4gICAgY29uc3QgdG9SZXNwb25kID0gIXRoaXMudG9SZXNwb25kXG4gICAgICA/IDBcbiAgICAgIDogb2xkVmFsID09PSBOT05FID8gLS10aGlzLnRvUmVzcG9uZCA6IHRoaXMudG9SZXNwb25kO1xuICAgIHZhbHVlc1tvdXRlckluZGV4XSA9IGlubmVyVmFsdWU7XG5cbiAgICBpZiAodG9SZXNwb25kID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5yZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICB0aGlzLl90cnlSZXN1bHRTZWxlY3Rvcih2YWx1ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlcy5zbGljZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF90cnlSZXN1bHRTZWxlY3Rvcih2YWx1ZXM6IGFueVtdKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnJlc3VsdFNlbGVjdG9yLmFwcGx5KHRoaXMsIHZhbHVlcyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5cbi8qKiBJZGVudGlmaWVzIGFuIGlucHV0IGFzIGJlaW5nIE9ic2VydmFibGUgKGJ1dCBub3QgbmVjZXNzYXJ5IGFuIFJ4IE9ic2VydmFibGUpICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dDogYW55KTogaW5wdXQgaXMgSW50ZXJvcE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcblxuLyoqIElkZW50aWZpZXMgYW4gaW5wdXQgYXMgYmVpbmcgYW4gSXRlcmFibGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKGlucHV0OiBhbnkpOiBpbnB1dCBpcyBJdGVyYWJsZTxhbnk+IHtcbiAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Byb21pc2UgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUHJvbWlzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUHJvbWlzZTxUPihpbnB1dDogUHJvbWlzZUxpa2U8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9Qcm9taXNlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gaW5wdXQudGhlbihcbiAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKSk7XG4gICAgICAgIH1cbiAgICAgICkpKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUl0ZXJhYmxlPFQ+KGlucHV0OiBJdGVyYWJsZTxUPiwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghaW5wdXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0ZXJhYmxlIGNhbm5vdCBiZSBudWxsJyk7XG4gIH1cbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9JdGVyYWJsZShpbnB1dCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGxldCBpdGVyYXRvcjogSXRlcmF0b3I8VD47XG4gICAgICBzdWIuYWRkKCgpID0+IHtcbiAgICAgICAgLy8gRmluYWxpemUgZ2VuZXJhdG9yc1xuICAgICAgICBpZiAoaXRlcmF0b3IgJiYgdHlwZW9mIGl0ZXJhdG9yLnJldHVybiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGl0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdKCk7XG4gICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHZhbHVlOiBUO1xuICAgICAgICAgIGxldCBkb25lOiBib29sZWFuO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgIGRvbmUgPSByZXN1bHQuZG9uZTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgSW50ZXJvcE9ic2VydmFibGUsIFNjaGVkdWxlckxpa2UsIFN1YnNjcmliYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21PYnNlcnZhYmxlPFQ+KGlucHV0OiBJbnRlcm9wT2JzZXJ2YWJsZTxUPiwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvT2JzZXJ2YWJsZShpbnB1dCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZTogU3Vic2NyaWJhYmxlPFQ+ID0gaW5wdXRbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgIHN1Yi5hZGQob2JzZXJ2YWJsZS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQodmFsdWUpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKSkpOyB9LFxuICAgICAgICAgIGVycm9yKGVycikgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycikpKTsgfSxcbiAgICAgICAgICBjb21wbGV0ZSgpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7IH0sXG4gICAgICAgIH0pKTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvaXNQcm9taXNlJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc0ludGVyb3BPYnNlcnZhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0ludGVyb3BPYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzSXRlcmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgZnJvbVByb21pc2UgfSBmcm9tICcuL2Zyb21Qcm9taXNlJztcbmltcG9ydCB7IGZyb21JdGVyYWJsZSB9IGZyb20gJy4vZnJvbUl0ZXJhYmxlJztcbmltcG9ydCB7IGZyb21PYnNlcnZhYmxlIH0gZnJvbSAnLi9mcm9tT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUbyB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG8nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbTxUPihpbnB1dDogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8T2JzZXJ2YWJsZUlucHV0PFQ+Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8T2JzZXJ2YWJsZTxUPj47XG5leHBvcnQgZnVuY3Rpb24gZnJvbTxUPihpbnB1dDogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG8oaW5wdXQpKTtcbiAgfVxuXG4gIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgaWYgKGlzSW50ZXJvcE9ic2VydmFibGUoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSBlbHNlIGlmIChpc1Byb21pc2UoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbVByb21pc2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXkoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSAgZWxzZSBpZiAoaXNJdGVyYWJsZShpbnB1dCkgfHwgdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZyb21JdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKChpbnB1dCAhPT0gbnVsbCAmJiB0eXBlb2YgaW5wdXQgfHwgaW5wdXQpICsgJyBpcyBub3Qgb2JzZXJ2YWJsZScpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LCBjb25jdXJyZW50PzogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgaW5uZXIgbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPiwgcmVzdWx0U2VsZWN0b3I6IHVuZGVmaW5lZCwgY29uY3VycmVudD86IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGlubmVyIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXA8VCwgSSwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8ST4sIHJlc3VsdFNlbGVjdG9yOiAob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogSSwgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIpID0+IFIsIGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBQcm9qZWN0cyBlYWNoIHNvdXJjZSB2YWx1ZSB0byBhbiBPYnNlcnZhYmxlIHdoaWNoIGlzIG1lcmdlZCBpbiB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5NYXBzIGVhY2ggdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSwgdGhlbiBmbGF0dGVucyBhbGwgb2ZcbiAqIHRoZXNlIGlubmVyIE9ic2VydmFibGVzIHVzaW5nIHtAbGluayBtZXJnZUFsbH0uPC9zcGFuPlxuICpcbiAqICFbXShtZXJnZU1hcC5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgYmFzZWQgb24gYXBwbHlpbmcgYSBmdW5jdGlvbiB0aGF0IHlvdVxuICogc3VwcGx5IHRvIGVhY2ggaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgd2hlcmUgdGhhdCBmdW5jdGlvblxuICogcmV0dXJucyBhbiBPYnNlcnZhYmxlLCBhbmQgdGhlbiBtZXJnaW5nIHRob3NlIHJlc3VsdGluZyBPYnNlcnZhYmxlcyBhbmRcbiAqIGVtaXR0aW5nIHRoZSByZXN1bHRzIG9mIHRoaXMgbWVyZ2VyLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE1hcCBhbmQgZmxhdHRlbiBlYWNoIGxldHRlciB0byBhbiBPYnNlcnZhYmxlIHRpY2tpbmcgZXZlcnkgMSBzZWNvbmRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGxldHRlcnMgPSBvZignYScsICdiJywgJ2MnKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGxldHRlcnMucGlwZShcbiAqICAgbWVyZ2VNYXAoeCA9PiBpbnRlcnZhbCgxMDAwKS5waXBlKG1hcChpID0+IHgraSkpKSxcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIGEwXG4gKiAvLyBiMFxuICogLy8gYzBcbiAqIC8vIGExXG4gKiAvLyBiMVxuICogLy8gYzFcbiAqIC8vIGNvbnRpbnVlcyB0byBsaXN0IGEsYixjIHdpdGggcmVzcGVjdGl2ZSBhc2NlbmRpbmcgaW50ZWdlcnNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcH1cbiAqIEBzZWUge0BsaW5rIGV4aGF1c3RNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZX1cbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXBUb31cbiAqIEBzZWUge0BsaW5rIG1lcmdlU2Nhbn1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaE1hcH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCA/aW5kZXg6IG51bWJlcik6IE9ic2VydmFibGVJbnB1dH0gcHJvamVjdCBBIGZ1bmN0aW9uXG4gKiB0aGF0LCB3aGVuIGFwcGxpZWQgdG8gYW4gaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgcmV0dXJucyBhblxuICogT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlucHV0XG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZVxuICogcHJvamVjdGlvbiBmdW5jdGlvbiAoYW5kIHRoZSBvcHRpb25hbCBgcmVzdWx0U2VsZWN0b3JgKSB0byBlYWNoIGl0ZW0gZW1pdHRlZFxuICogYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBtZXJnaW5nIHRoZSByZXN1bHRzIG9mIHRoZSBPYnNlcnZhYmxlcyBvYnRhaW5lZFxuICogZnJvbSB0aGlzIHRyYW5zZm9ybWF0aW9uLlxuICogQG1ldGhvZCBtZXJnZU1hcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIEksIFI+KFxuICBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxJPixcbiAgcmVzdWx0U2VsZWN0b3I/OiAoKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSKSB8IG51bWJlcixcbiAgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXG4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEl8Uj4ge1xuICBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5waXBlKFxuICAgICAgbWVyZ2VNYXAoKGEsIGkpID0+IGZyb20ocHJvamVjdChhLCBpKSkucGlwZShcbiAgICAgICAgbWFwKChiLCBpaSkgPT4gcmVzdWx0U2VsZWN0b3IoYSwgYiwgaSwgaWkpKSxcbiAgICAgICksIGNvbmN1cnJlbnQpXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdudW1iZXInKSB7XG4gICAgY29uY3VycmVudCA9IHJlc3VsdFNlbGVjdG9yO1xuICB9XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgTWVyZ2VNYXBPcGVyYXRvcihwcm9qZWN0LCBjb25jdXJyZW50KSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXJnZU1hcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICB9XG5cbiAgY2FsbChvYnNlcnZlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNZXJnZU1hcFN1YnNjcmliZXIoXG4gICAgICBvYnNlcnZlciwgdGhpcy5wcm9qZWN0LCB0aGlzLmNvbmN1cnJlbnRcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIE1lcmdlTWFwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgaGFzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYnVmZmVyOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBhY3RpdmU6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25jdXJyZW50OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPCB0aGlzLmNvbmN1cnJlbnQpIHtcbiAgICAgIHRoaXMuX3RyeU5leHQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RyeU5leHQodmFsdWU6IFQpIHtcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8Uj47XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4Kys7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJvamVjdCh2YWx1ZSwgaW5kZXgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSsrO1xuICAgIHRoaXMuX2lubmVyU3ViKHJlc3VsdCwgdmFsdWUsIGluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgX2lubmVyU3ViKGlzaDogT2JzZXJ2YWJsZUlucHV0PFI+LCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0PFQsIFI+KHRoaXMsIGlzaCwgdmFsdWUsIGluZGV4KSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IDAgJiYgdGhpcy5idWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgdGhpcy5yZW1vdmUoaW5uZXJTdWIpO1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9uZXh0KGJ1ZmZlci5zaGlmdCgpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZlID09PSAwICYmIHRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iLCJcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUFsbDxUPihjb25jdXJyZW50PzogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgaGlnaGVyLW9yZGVyIE9ic2VydmFibGUgaW50byBhIGZpcnN0LW9yZGVyIE9ic2VydmFibGUgd2hpY2hcbiAqIGNvbmN1cnJlbnRseSBkZWxpdmVycyBhbGwgdmFsdWVzIHRoYXQgYXJlIGVtaXR0ZWQgb24gdGhlIGlubmVyIE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5GbGF0dGVucyBhbiBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10obWVyZ2VBbGwucG5nKVxuICpcbiAqIGBtZXJnZUFsbGAgc3Vic2NyaWJlcyB0byBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgT2JzZXJ2YWJsZXMsIGFsc28ga25vd24gYXNcbiAqIGEgaGlnaGVyLW9yZGVyIE9ic2VydmFibGUuIEVhY2ggdGltZSBpdCBvYnNlcnZlcyBvbmUgb2YgdGhlc2UgZW1pdHRlZCBpbm5lclxuICogT2JzZXJ2YWJsZXMsIGl0IHN1YnNjcmliZXMgdG8gdGhhdCBhbmQgZGVsaXZlcnMgYWxsIHRoZSB2YWx1ZXMgZnJvbSB0aGVcbiAqIGlubmVyIE9ic2VydmFibGUgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLiBUaGUgb3V0cHV0IE9ic2VydmFibGUgb25seVxuICogY29tcGxldGVzIG9uY2UgYWxsIGlubmVyIE9ic2VydmFibGVzIGhhdmUgY29tcGxldGVkLiBBbnkgZXJyb3IgZGVsaXZlcmVkIGJ5XG4gKiBhIGlubmVyIE9ic2VydmFibGUgd2lsbCBiZSBpbW1lZGlhdGVseSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogU3Bhd24gYSBuZXcgaW50ZXJ2YWwgT2JzZXJ2YWJsZSBmb3IgZWFjaCBjbGljayBldmVudCwgYW5kIGJsZW5kIHRoZWlyIG91dHB1dHMgYXMgb25lIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKG1hcCgoZXYpID0+IGludGVydmFsKDEwMDApKSk7XG4gKiBjb25zdCBmaXJzdE9yZGVyID0gaGlnaGVyT3JkZXIucGlwZShtZXJnZUFsbCgpKTtcbiAqIGZpcnN0T3JkZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQ291bnQgZnJvbSAwIHRvIDkgZXZlcnkgc2Vjb25kIGZvciBlYWNoIGNsaWNrLCBidXQgb25seSBhbGxvdyAyIGNvbmN1cnJlbnQgdGltZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShcbiAqICAgbWFwKChldikgPT4gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDEwKSkpLFxuICogKTtcbiAqIGNvbnN0IGZpcnN0T3JkZXIgPSBoaWdoZXJPcmRlci5waXBlKG1lcmdlQWxsKDIpKTtcbiAqIGZpcnN0T3JkZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUFsbH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdEFsbH1cbiAqIEBzZWUge0BsaW5rIGV4aGF1c3R9XG4gKiBAc2VlIHtAbGluayBtZXJnZX1cbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXBUb31cbiAqIEBzZWUge0BsaW5rIG1lcmdlU2Nhbn1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaEFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaE1hcH1cbiAqIEBzZWUge0BsaW5rIHppcEFsbH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvbmN1cnJlbnQ9TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXSBNYXhpbXVtIG51bWJlciBvZiBpbm5lclxuICogT2JzZXJ2YWJsZXMgYmVpbmcgc3Vic2NyaWJlZCB0byBjb25jdXJyZW50bHkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdmFsdWVzIGNvbWluZyBmcm9tIGFsbCB0aGVcbiAqIGlubmVyIE9ic2VydmFibGVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBtZXJnZUFsbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQWxsPFQ+KGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBtZXJnZU1hcDxULCBUPihpZGVudGl0eSBhcyAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxUPiwgY29uY3VycmVudCk7XG59XG4iLCJcbmltcG9ydCB7IG1lcmdlQWxsIH0gZnJvbSAnLi9tZXJnZUFsbCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdEFsbDxSPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG5cbi8qKlxuICogQ29udmVydHMgYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSBpbnRvIGEgZmlyc3Qtb3JkZXIgT2JzZXJ2YWJsZSBieVxuICogY29uY2F0ZW5hdGluZyB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMgaW4gb3JkZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMgYnkgcHV0dGluZyBvbmVcbiAqIGlubmVyIE9ic2VydmFibGUgYWZ0ZXIgdGhlIG90aGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oY29uY2F0QWxsLnBuZylcbiAqXG4gKiBKb2lucyBldmVyeSBPYnNlcnZhYmxlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSAoYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSksIGluXG4gKiBhIHNlcmlhbCBmYXNoaW9uLiBJdCBzdWJzY3JpYmVzIHRvIGVhY2ggaW5uZXIgT2JzZXJ2YWJsZSBvbmx5IGFmdGVyIHRoZVxuICogcHJldmlvdXMgaW5uZXIgT2JzZXJ2YWJsZSBoYXMgY29tcGxldGVkLCBhbmQgbWVyZ2VzIGFsbCBvZiB0aGVpciB2YWx1ZXMgaW50b1xuICogdGhlIHJldHVybmVkIG9ic2VydmFibGUuXG4gKlxuICogX19XYXJuaW5nOl9fIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBPYnNlcnZhYmxlcyBxdWlja2x5IGFuZFxuICogZW5kbGVzc2x5LCBhbmQgdGhlIGlubmVyIE9ic2VydmFibGVzIGl0IGVtaXRzIGdlbmVyYWxseSBjb21wbGV0ZSBzbG93ZXIgdGhhblxuICogdGhlIHNvdXJjZSBlbWl0cywgeW91IGNhbiBydW4gaW50byBtZW1vcnkgaXNzdWVzIGFzIHRoZSBpbmNvbWluZyBPYnNlcnZhYmxlc1xuICogY29sbGVjdCBpbiBhbiB1bmJvdW5kZWQgYnVmZmVyLlxuICpcbiAqIE5vdGU6IGBjb25jYXRBbGxgIGlzIGVxdWl2YWxlbnQgdG8gYG1lcmdlQWxsYCB3aXRoIGNvbmN1cnJlbmN5IHBhcmFtZXRlciBzZXRcbiAqIHRvIGAxYC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogRm9yIGVhY2ggY2xpY2sgZXZlbnQsIHRpY2sgZXZlcnkgc2Vjb25kIGZyb20gMCB0byAzLCB3aXRoIG5vIGNvbmN1cnJlbmN5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShcbiAqICAgbWFwKGV2ID0+IGludGVydmFsKDEwMDApLnBpcGUodGFrZSg0KSkpLFxuICogKTtcbiAqIGNvbnN0IGZpcnN0T3JkZXIgPSBoaWdoZXJPcmRlci5waXBlKGNvbmNhdEFsbCgpKTtcbiAqIGZpcnN0T3JkZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIChyZXN1bHRzIGFyZSBub3QgY29uY3VycmVudClcbiAqIC8vIEZvciBldmVyeSBjbGljayBvbiB0aGUgXCJkb2N1bWVudFwiIGl0IHdpbGwgZW1pdCB2YWx1ZXMgMCB0byAzIHNwYWNlZFxuICogLy8gb24gYSAxMDAwbXMgaW50ZXJ2YWxcbiAqIC8vIG9uZSBjbGljayA9IDEwMDBtcy0+IDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IDIgLTEwMDBtcy0+IDNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXR9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXBUb31cbiAqIEBzZWUge0BsaW5rIGV4aGF1c3R9XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaEFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaE1hcH1cbiAqIEBzZWUge0BsaW5rIHppcEFsbH1cbiAqXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIGVtaXR0aW5nIHZhbHVlcyBmcm9tIGFsbCB0aGUgaW5uZXJcbiAqIE9ic2VydmFibGVzIGNvbmNhdGVuYXRlZC5cbiAqIEBtZXRob2QgY29uY2F0QWxsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPiB7XG4gIHJldHVybiBtZXJnZUFsbDxUPigxKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2YnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5pbXBvcnQgeyBjb25jYXRBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvY29uY2F0QWxsJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQ+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZSlbXSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFI+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlKVtdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKipcbiAqIENyZWF0ZXMgYW4gb3V0cHV0IE9ic2VydmFibGUgd2hpY2ggc2VxdWVudGlhbGx5IGVtaXRzIGFsbCB2YWx1ZXMgZnJvbSBnaXZlblxuICogT2JzZXJ2YWJsZSBhbmQgdGhlbiBtb3ZlcyBvbiB0byB0aGUgbmV4dC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29uY2F0ZW5hdGVzIG11bHRpcGxlIE9ic2VydmFibGVzIHRvZ2V0aGVyIGJ5XG4gKiBzZXF1ZW50aWFsbHkgZW1pdHRpbmcgdGhlaXIgdmFsdWVzLCBvbmUgT2JzZXJ2YWJsZSBhZnRlciB0aGUgb3RoZXIuPC9zcGFuPlxuICpcbiAqICFbXShjb25jYXQucG5nKVxuICpcbiAqIGBjb25jYXRgIGpvaW5zIG11bHRpcGxlIE9ic2VydmFibGVzIHRvZ2V0aGVyLCBieSBzdWJzY3JpYmluZyB0byB0aGVtIG9uZSBhdCBhIHRpbWUgYW5kXG4gKiBtZXJnaW5nIHRoZWlyIHJlc3VsdHMgaW50byB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFlvdSBjYW4gcGFzcyBlaXRoZXIgYW4gYXJyYXkgb2ZcbiAqIE9ic2VydmFibGVzLCBvciBwdXQgdGhlbSBkaXJlY3RseSBhcyBhcmd1bWVudHMuIFBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgd2lsbCByZXN1bHRcbiAqIGluIE9ic2VydmFibGUgdGhhdCBjb21wbGV0ZXMgaW1tZWRpYXRlbHkuXG4gKlxuICogYGNvbmNhdGAgd2lsbCBzdWJzY3JpYmUgdG8gZmlyc3QgaW5wdXQgT2JzZXJ2YWJsZSBhbmQgZW1pdCBhbGwgaXRzIHZhbHVlcywgd2l0aG91dFxuICogY2hhbmdpbmcgb3IgYWZmZWN0aW5nIHRoZW0gaW4gYW55IHdheS4gV2hlbiB0aGF0IE9ic2VydmFibGUgY29tcGxldGVzLCBpdCB3aWxsXG4gKiBzdWJzY3JpYmUgdG8gdGhlbiBuZXh0IE9ic2VydmFibGUgcGFzc2VkIGFuZCwgYWdhaW4sIGVtaXQgaXRzIHZhbHVlcy4gVGhpcyB3aWxsIGJlXG4gKiByZXBlYXRlZCwgdW50aWwgdGhlIG9wZXJhdG9yIHJ1bnMgb3V0IG9mIE9ic2VydmFibGVzLiBXaGVuIGxhc3QgaW5wdXQgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsXG4gKiBgY29uY2F0YCB3aWxsIGNvbXBsZXRlIGFzIHdlbGwuIEF0IGFueSBnaXZlbiBtb21lbnQgb25seSBvbmUgT2JzZXJ2YWJsZSBwYXNzZWQgdG8gb3BlcmF0b3JcbiAqIGVtaXRzIHZhbHVlcy4gSWYgeW91IHdvdWxkIGxpa2UgdG8gZW1pdCB2YWx1ZXMgZnJvbSBwYXNzZWQgT2JzZXJ2YWJsZXMgY29uY3VycmVudGx5LCBjaGVjayBvdXRcbiAqIHtAbGluayBtZXJnZX0gaW5zdGVhZCwgZXNwZWNpYWxseSB3aXRoIG9wdGlvbmFsIGBjb25jdXJyZW50YCBwYXJhbWV0ZXIuIEFzIGEgbWF0dGVyIG9mIGZhY3QsXG4gKiBgY29uY2F0YCBpcyBhbiBlcXVpdmFsZW50IG9mIGBtZXJnZWAgb3BlcmF0b3Igd2l0aCBgY29uY3VycmVudGAgcGFyYW1ldGVyIHNldCB0byBgMWAuXG4gKlxuICogTm90ZSB0aGF0IGlmIHNvbWUgaW5wdXQgT2JzZXJ2YWJsZSBuZXZlciBjb21wbGV0ZXMsIGBjb25jYXRgIHdpbGwgYWxzbyBuZXZlciBjb21wbGV0ZVxuICogYW5kIE9ic2VydmFibGVzIGZvbGxvd2luZyB0aGUgb25lIHRoYXQgZGlkIG5vdCBjb21wbGV0ZSB3aWxsIG5ldmVyIGJlIHN1YnNjcmliZWQuIE9uIHRoZSBvdGhlclxuICogaGFuZCwgaWYgc29tZSBPYnNlcnZhYmxlIHNpbXBseSBjb21wbGV0ZXMgaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaXMgc3Vic2NyaWJlZCwgaXQgd2lsbCBiZVxuICogaW52aXNpYmxlIGZvciBgY29uY2F0YCwgd2hpY2ggd2lsbCBqdXN0IG1vdmUgb24gdG8gdGhlIG5leHQgT2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiBhbnkgT2JzZXJ2YWJsZSBpbiBjaGFpbiBlcnJvcnMsIGluc3RlYWQgb2YgcGFzc2luZyBjb250cm9sIHRvIHRoZSBuZXh0IE9ic2VydmFibGUsXG4gKiBgY29uY2F0YCB3aWxsIGVycm9yIGltbWVkaWF0ZWx5IGFzIHdlbGwuIE9ic2VydmFibGVzIHRoYXQgd291bGQgYmUgc3Vic2NyaWJlZCBhZnRlclxuICogdGhlIG9uZSB0aGF0IGVtaXR0ZWQgZXJyb3IsIG5ldmVyIHdpbGwuXG4gKlxuICogSWYgeW91IHBhc3MgdG8gYGNvbmNhdGAgdGhlIHNhbWUgT2JzZXJ2YWJsZSBtYW55IHRpbWVzLCBpdHMgc3RyZWFtIG9mIHZhbHVlc1xuICogd2lsbCBiZSBcInJlcGxheWVkXCIgb24gZXZlcnkgc3Vic2NyaXB0aW9uLCB3aGljaCBtZWFucyB5b3UgY2FuIHJlcGVhdCBnaXZlbiBPYnNlcnZhYmxlXG4gKiBhcyBtYW55IHRpbWVzIGFzIHlvdSBsaWtlLiBJZiBwYXNzaW5nIHRoZSBzYW1lIE9ic2VydmFibGUgdG8gYGNvbmNhdGAgMTAwMCB0aW1lcyBiZWNvbWVzIHRlZGlvdXMsXG4gKiB5b3UgY2FuIGFsd2F5cyB1c2Uge0BsaW5rIHJlcGVhdH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDb25jYXRlbmF0ZSBhIHRpbWVyIGNvdW50aW5nIGZyb20gMCB0byAzIHdpdGggYSBzeW5jaHJvbm91cyBzZXF1ZW5jZSBmcm9tIDEgdG8gMTBcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDQpKTtcbiAqIGNvbnN0IHNlcXVlbmNlID0gcmFuZ2UoMSwgMTApO1xuICogY29uc3QgcmVzdWx0ID0gY29uY2F0KHRpbWVyLCBzZXF1ZW5jZSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHMgaW46XG4gKiAvLyAwIC0xMDAwbXMtPiAxIC0xMDAwbXMtPiAyIC0xMDAwbXMtPiAzIC1pbW1lZGlhdGUtPiAxIC4uLiAxMFxuICogYGBgXG4gKlxuICogIyMjIENvbmNhdGVuYXRlIGFuIGFycmF5IG9mIDMgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyMSA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgdGltZXIyID0gaW50ZXJ2YWwoMjAwMCkucGlwZSh0YWtlKDYpKTtcbiAqIGNvbnN0IHRpbWVyMyA9IGludGVydmFsKDUwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQoW3RpbWVyMSwgdGltZXIyLCB0aW1lcjNdKTsgLy8gbm90ZSB0aGF0IGFycmF5IGlzIHBhc3NlZFxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyByZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyAoUHJpbnRzIHRvIGNvbnNvbGUgc2VxdWVudGlhbGx5KVxuICogLy8gLTEwMDBtcy0+IDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IC4uLiA5XG4gKiAvLyAtMjAwMG1zLT4gMCAtMjAwMG1zLT4gMSAtMjAwMG1zLT4gLi4uIDVcbiAqIC8vIC01MDBtcy0+IDAgLTUwMG1zLT4gMSAtNTAwbXMtPiAuLi4gOVxuICogYGBgXG4gKlxuICogIyMjIENvbmNhdGVuYXRlIHRoZSBzYW1lIE9ic2VydmFibGUgdG8gcmVwZWF0IGl0XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lciA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgyKSk7XG4gKiAqXG4gKiBjb25jYXQodGltZXIsIHRpbWVyKSAvLyBjb25jYXRlbmF0aW5nIHRoZSBzYW1lIE9ic2VydmFibGUhXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJy4uLmFuZCBpdCBpcyBkb25lIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwIGFmdGVyIDFzXG4gKiAvLyAxIGFmdGVyIDJzXG4gKiAvLyAwIGFmdGVyIDNzXG4gKiAvLyAxIGFmdGVyIDRzXG4gKiAvLyBcIi4uLmFuZCBpdCBpcyBkb25lIVwiIGFsc28gYWZ0ZXIgNHNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbmNhdEFsbH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcFRvfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBpbnB1dDEgQW4gaW5wdXQgT2JzZXJ2YWJsZSB0byBjb25jYXRlbmF0ZSB3aXRoIG90aGVycy5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBpbnB1dDIgQW4gaW5wdXQgT2JzZXJ2YWJsZSB0byBjb25jYXRlbmF0ZSB3aXRoIG90aGVycy5cbiAqIE1vcmUgdGhhbiBvbmUgaW5wdXQgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIGFyZ3VtZW50LlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPW51bGxdIEFuIG9wdGlvbmFsIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBzY2hlZHVsZSBlYWNoXG4gKiBPYnNlcnZhYmxlIHN1YnNjcmlwdGlvbiBvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFsbCB2YWx1ZXMgb2YgZWFjaCBwYXNzZWQgT2JzZXJ2YWJsZSBtZXJnZWQgaW50byBhXG4gKiBzaW5nbGUgT2JzZXJ2YWJsZSwgaW4gb3JkZXIsIGluIHNlcmlhbCBmYXNoaW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBjb25jYXRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSB8fCAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAyICYmIGlzU2NoZWR1bGVyKG9ic2VydmFibGVzWzFdKSkpIHtcbiAgICByZXR1cm4gZnJvbSg8YW55Pm9ic2VydmFibGVzWzBdKTtcbiAgfVxuICByZXR1cm4gY29uY2F0QWxsPFI+KCkob2YoLi4ub2JzZXJ2YWJsZXMpKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliYWJsZU9yUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nOyAvLyBsb2xcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQsIG9uIHN1YnNjcmliZSwgY2FsbHMgYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IHRvXG4gKiBtYWtlIGFuIE9ic2VydmFibGUgZm9yIGVhY2ggbmV3IE9ic2VydmVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5DcmVhdGVzIHRoZSBPYnNlcnZhYmxlIGxhemlseSwgdGhhdCBpcywgb25seSB3aGVuIGl0XG4gKiBpcyBzdWJzY3JpYmVkLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShkZWZlci5wbmcpXG4gKlxuICogYGRlZmVyYCBhbGxvd3MgeW91IHRvIGNyZWF0ZSB0aGUgT2JzZXJ2YWJsZSBvbmx5IHdoZW4gdGhlIE9ic2VydmVyXG4gKiBzdWJzY3JpYmVzLCBhbmQgY3JlYXRlIGEgZnJlc2ggT2JzZXJ2YWJsZSBmb3IgZWFjaCBPYnNlcnZlci4gSXQgd2FpdHMgdW50aWxcbiAqIGFuIE9ic2VydmVyIHN1YnNjcmliZXMgdG8gaXQsIGFuZCB0aGVuIGl0IGdlbmVyYXRlcyBhbiBPYnNlcnZhYmxlLFxuICogdHlwaWNhbGx5IHdpdGggYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLiBJdCBkb2VzIHRoaXMgYWZyZXNoIGZvciBlYWNoXG4gKiBzdWJzY3JpYmVyLCBzbyBhbHRob3VnaCBlYWNoIHN1YnNjcmliZXIgbWF5IHRoaW5rIGl0IGlzIHN1YnNjcmliaW5nIHRvIHRoZVxuICogc2FtZSBPYnNlcnZhYmxlLCBpbiBmYWN0IGVhY2ggc3Vic2NyaWJlciBnZXRzIGl0cyBvd24gaW5kaXZpZHVhbFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgU3Vic2NyaWJlIHRvIGVpdGhlciBhbiBPYnNlcnZhYmxlIG9mIGNsaWNrcyBvciBhbiBPYnNlcnZhYmxlIG9mIGludGVydmFsLCBhdCByYW5kb21cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrc09ySW50ZXJ2YWwgPSBkZWZlcihmdW5jdGlvbiAoKSB7XG4gKiAgIHJldHVybiBNYXRoLnJhbmRvbSgpID4gMC41XG4gKiAgICAgPyBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpXG4gKiAgICAgOiBpbnRlcnZhbCgxMDAwKTtcbiAqIH0pO1xuICogY2xpY2tzT3JJbnRlcnZhbC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nIGJlaGF2aW9yOlxuICogLy8gSWYgdGhlIHJlc3VsdCBvZiBNYXRoLnJhbmRvbSgpIGlzIGdyZWF0ZXIgdGhhbiAwLjUgaXQgd2lsbCBsaXN0ZW5cbiAqIC8vIGZvciBjbGlja3MgYW55d2hlcmUgb24gdGhlIFwiZG9jdW1lbnRcIjsgd2hlbiBkb2N1bWVudCBpcyBjbGlja2VkIGl0XG4gKiAvLyB3aWxsIGxvZyBhIE1vdXNlRXZlbnQgb2JqZWN0IHRvIHRoZSBjb25zb2xlLiBJZiB0aGUgcmVzdWx0IGlzIGxlc3NcbiAqIC8vIHRoYW4gMC41IGl0IHdpbGwgZW1pdCBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCgxMDAwbXMpLlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZX0gb2JzZXJ2YWJsZUZhY3RvcnkgVGhlIE9ic2VydmFibGVcbiAqIGZhY3RvcnkgZnVuY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIE9ic2VydmVyIHRoYXQgc3Vic2NyaWJlcyB0byB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLiBNYXkgYWxzbyByZXR1cm4gYSBQcm9taXNlLCB3aGljaCB3aWxsIGJlIGNvbnZlcnRlZCBvbiB0aGUgZmx5XG4gKiB0byBhbiBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB3aG9zZSBPYnNlcnZlcnMnIHN1YnNjcmlwdGlvbnMgdHJpZ2dlclxuICogYW4gaW52b2NhdGlvbiBvZiB0aGUgZ2l2ZW4gT2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBkZWZlclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmVyPFQ+KG9ic2VydmFibGVGYWN0b3J5OiAoKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gfCB2b2lkKTogT2JzZXJ2YWJsZTxUPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgaW5wdXQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiB8IHZvaWQ7XG4gICAgdHJ5IHtcbiAgICAgIGlucHV0ID0gb2JzZXJ2YWJsZUZhY3RvcnkoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZSA9IGlucHV0ID8gZnJvbShpbnB1dCkgOiBlbXB0eSgpO1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vLyBmb3JrSm9pbihbYSQsIGIkLCBjJF0pO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD5dKTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+XSk6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQ+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDU+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBPYnNlcnZhYmxlSW5wdXQ8VDY+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pOiBPYnNlcnZhYmxlPFRbXT47XG5cbi8vIGZvcmtKb2luKGEkLCBiJCwgYyQpXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4odjE6IE9ic2VydmFibGVJbnB1dDxUPik6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBkZXByZWNhdGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW4oLi4uYXJnczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT58RnVuY3Rpb24+KTogT2JzZXJ2YWJsZTxhbnk+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KC4uLnNvdXJjZXM6IE9ic2VydmFibGVJbnB1dDxUPltdKTogT2JzZXJ2YWJsZTxUW10+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBKb2lucyBsYXN0IHZhbHVlcyBlbWl0dGVkIGJ5IHBhc3NlZCBPYnNlcnZhYmxlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2FpdCBmb3IgT2JzZXJ2YWJsZXMgdG8gY29tcGxldGUgYW5kIHRoZW4gY29tYmluZSBsYXN0IHZhbHVlcyB0aGV5IGVtaXR0ZWQuPC9zcGFuPlxuICpcbiAqICFbXShmb3JrSm9pbi5wbmcpXG4gKlxuICogYGZvcmtKb2luYCBpcyBhbiBvcGVyYXRvciB0aGF0IHRha2VzIGFueSBudW1iZXIgb2YgT2JzZXJ2YWJsZXMgd2hpY2ggY2FuIGJlIHBhc3NlZCBlaXRoZXIgYXMgYW4gYXJyYXlcbiAqIG9yIGRpcmVjdGx5IGFzIGFyZ3VtZW50cy4gSWYgbm8gaW5wdXQgT2JzZXJ2YWJsZXMgYXJlIHByb3ZpZGVkLCByZXN1bHRpbmcgc3RyZWFtIHdpbGwgY29tcGxldGVcbiAqIGltbWVkaWF0ZWx5LlxuICpcbiAqIGBmb3JrSm9pbmAgd2lsbCB3YWl0IGZvciBhbGwgcGFzc2VkIE9ic2VydmFibGVzIHRvIGNvbXBsZXRlIGFuZCB0aGVuIGl0IHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIGxhc3RcbiAqIHZhbHVlcyBmcm9tIGNvcnJlc3BvbmRpbmcgT2JzZXJ2YWJsZXMuIFNvIGlmIHlvdSBwYXNzIGBuYCBPYnNlcnZhYmxlcyB0byB0aGUgb3BlcmF0b3IsIHJlc3VsdGluZ1xuICogYXJyYXkgd2lsbCBoYXZlIGBuYCB2YWx1ZXMsIHdoZXJlIGZpcnN0IHZhbHVlIGlzIHRoZSBsYXN0IHRoaW5nIGVtaXR0ZWQgYnkgdGhlIGZpcnN0IE9ic2VydmFibGUsXG4gKiBzZWNvbmQgdmFsdWUgaXMgdGhlIGxhc3QgdGhpbmcgZW1pdHRlZCBieSB0aGUgc2Vjb25kIE9ic2VydmFibGUgYW5kIHNvIG9uLiBUaGF0IG1lYW5zIGBmb3JrSm9pbmAgd2lsbFxuICogbm90IGVtaXQgbW9yZSB0aGFuIG9uY2UgYW5kIGl0IHdpbGwgY29tcGxldGUgYWZ0ZXIgdGhhdC4gSWYgeW91IG5lZWQgdG8gZW1pdCBjb21iaW5lZCB2YWx1ZXMgbm90IG9ubHlcbiAqIGF0IHRoZSBlbmQgb2YgbGlmZWN5Y2xlIG9mIHBhc3NlZCBPYnNlcnZhYmxlcywgYnV0IGFsc28gdGhyb3VnaG91dCBpdCwgdHJ5IG91dCB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqIG9yIHtAbGluayB6aXB9IGluc3RlYWQuXG4gKlxuICogSW4gb3JkZXIgZm9yIHJlc3VsdGluZyBhcnJheSB0byBoYXZlIHRoZSBzYW1lIGxlbmd0aCBhcyB0aGUgbnVtYmVyIG9mIGlucHV0IE9ic2VydmFibGVzLCB3aGVuZXZlciBhbnkgb2ZcbiAqIHRoYXQgT2JzZXJ2YWJsZXMgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgYW55IHZhbHVlLCBgZm9ya0pvaW5gIHdpbGwgY29tcGxldGUgYXQgdGhhdCBtb21lbnQgYXMgd2VsbFxuICogYW5kIGl0IHdpbGwgbm90IGVtaXQgYW55dGhpbmcgZWl0aGVyLCBldmVuIGlmIGl0IGFscmVhZHkgaGFzIHNvbWUgbGFzdCB2YWx1ZXMgZnJvbSBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIENvbnZlcnNlbHksIGlmIHRoZXJlIGlzIGFuIE9ic2VydmFibGUgdGhhdCBuZXZlciBjb21wbGV0ZXMsIGBmb3JrSm9pbmAgd2lsbCBuZXZlciBjb21wbGV0ZSBhcyB3ZWxsLFxuICogdW5sZXNzIGF0IGFueSBwb2ludCBzb21lIG90aGVyIE9ic2VydmFibGUgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgdmFsdWUsIHdoaWNoIGJyaW5ncyB1cyBiYWNrIHRvXG4gKiB0aGUgcHJldmlvdXMgY2FzZS4gT3ZlcmFsbCwgaW4gb3JkZXIgZm9yIGBmb3JrSm9pbmAgdG8gZW1pdCBhIHZhbHVlLCBhbGwgT2JzZXJ2YWJsZXMgcGFzc2VkIGFzIGFyZ3VtZW50c1xuICogaGF2ZSB0byBlbWl0IHNvbWV0aGluZyBhdCBsZWFzdCBvbmNlIGFuZCBjb21wbGV0ZS5cbiAqXG4gKiBJZiBhbnkgaW5wdXQgT2JzZXJ2YWJsZSBlcnJvcnMgYXQgc29tZSBwb2ludCwgYGZvcmtKb2luYCB3aWxsIGVycm9yIGFzIHdlbGwgYW5kIGFsbCBvdGhlciBPYnNlcnZhYmxlc1xuICogd2lsbCBiZSBpbW1lZGlhdGVseSB1bnN1YnNjcmliZWQuXG4gKlxuICogT3B0aW9uYWxseSBgZm9ya0pvaW5gIGFjY2VwdHMgcHJvamVjdCBmdW5jdGlvbiwgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHZhbHVlcyB3aGljaCBub3JtYWxseVxuICogd291bGQgbGFuZCBpbiBlbWl0dGVkIGFycmF5LiBXaGF0ZXZlciBpcyByZXR1cm5lZCBieSBwcm9qZWN0IGZ1bmN0aW9uLCB3aWxsIGFwcGVhciBpbiBvdXRwdXRcbiAqIE9ic2VydmFibGUgaW5zdGVhZC4gVGhpcyBtZWFucyB0aGF0IGRlZmF1bHQgcHJvamVjdCBjYW4gYmUgdGhvdWdodCBvZiBhcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIGFsbCBpdHMgYXJndW1lbnRzIGFuZCBwdXRzIHRoZW0gaW50byBhbiBhcnJheS4gTm90ZSB0aGF0IHByb2plY3QgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb25seVxuICogd2hlbiBvdXRwdXQgT2JzZXJ2YWJsZSBpcyBzdXBwb3NlZCB0byBlbWl0IGEgcmVzdWx0LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggb3BlcmF0b3IgZW1pdHRpbmcgaW1tZWRpYXRlbHlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZvcmtKb2luLCBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgb2YoMSwgMiwgMywgNCksXG4gKiAgIG9mKDUsIDYsIDcsIDgpLFxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBbNCwgOF1cbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIlxuICogYGBgXG4gKlxuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIG9wZXJhdG9yIGVtaXR0aW5nIGFmdGVyIHNvbWUgdGltZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDMpKSwgLy8gZW1pdCAwLCAxLCAyIGV2ZXJ5IHNlY29uZCBhbmQgY29tcGxldGVcbiAqICAgaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoNCkpLCAgLy8gZW1pdCAwLCAxLCAyLCAzIGV2ZXJ5IGhhbGYgYSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFsyLCAzXSBhZnRlciAzIHNlY29uZHNcbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIiBpbW1lZGlhdGVseSBhZnRlclxuICogYGBgXG4gKlxuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIHByb2plY3QgZnVuY3Rpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGpvcmtKb2luLCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIGludGVydmFsKDEwMDApLnBpcGUodGFrZSgzKSksIC8vIGVtaXQgMCwgMSwgMiBldmVyeSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiAgIGludGVydmFsKDUwMCkucGlwZSh0YWtlKDQpKSwgIC8vIGVtaXQgMCwgMSwgMiwgMyBldmVyeSBoYWxmIGEgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogKS5waXBlKFxuICogICBtYXAoKFtuLCBtXSkgPT4gbiArIG0pLFxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyA1IGFmdGVyIDMgc2Vjb25kc1xuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogQHNlZSB7QGxpbmsgemlwfVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBzb3VyY2VzIEFueSBudW1iZXIgb2YgT2JzZXJ2YWJsZXMgcHJvdmlkZWQgZWl0aGVyIGFzIGFuIGFycmF5IG9yIGFzIGFuIGFyZ3VtZW50c1xuICogcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBvcGVyYXRvci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtwcm9qZWN0XSBGdW5jdGlvbiB0aGF0IHRha2VzIHZhbHVlcyBlbWl0dGVkIGJ5IGlucHV0IE9ic2VydmFibGVzIGFuZCByZXR1cm5zIHZhbHVlXG4gKiB0aGF0IHdpbGwgYXBwZWFyIGluIHJlc3VsdGluZyBPYnNlcnZhYmxlIGluc3RlYWQgb2YgZGVmYXVsdCBhcnJheS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IE9ic2VydmFibGUgZW1pdHRpbmcgZWl0aGVyIGFuIGFycmF5IG9mIGxhc3QgdmFsdWVzIGVtaXR0ZWQgYnkgcGFzc2VkIE9ic2VydmFibGVzXG4gKiBvciB2YWx1ZSBmcm9tIHByb2plY3QgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihcbiAgLi4uc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgT2JzZXJ2YWJsZUlucHV0PFQ+W10gfCBGdW5jdGlvbj5cbik6IE9ic2VydmFibGU8VFtdPiB7XG5cbiAgbGV0IHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbjtcbiAgaWYgKHR5cGVvZiBzb3VyY2VzW3NvdXJjZXMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXN1bHRTZWxlY3RvciA9IHNvdXJjZXMucG9wKCkgYXMgRnVuY3Rpb247XG4gIH1cblxuICAvLyBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgb3RoZXIgYXJndW1lbnQgaXMgYW4gYXJyYXlcbiAgLy8gYXNzdW1lIGl0J3MgYmVlbiBjYWxsZWQgd2l0aCBgZm9ya0pvaW4oW29iczEsIG9iczIsIG9iczNdKWBcbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoc291cmNlc1swXSkpIHtcbiAgICBzb3VyY2VzID0gc291cmNlc1swXSBhcyBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+O1xuICB9XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIGZvcmtKb2luKHNvdXJjZXMpLnBpcGUoXG4gICAgICBtYXAoYXJncyA9PiByZXN1bHRTZWxlY3RvciguLi5hcmdzKSlcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIHJldHVybiBuZXcgRm9ya0pvaW5TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHNvdXJjZXMgYXMgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik7XG4gIH0pO1xufVxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEZvcmtKb2luU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgY29tcGxldGVkID0gMDtcbiAgcHJpdmF0ZSB2YWx1ZXM6IFRbXTtcbiAgcHJpdmF0ZSBoYXZlVmFsdWVzID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuXG4gICAgY29uc3QgbGVuID0gc291cmNlcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZXMgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIHNvdXJjZSwgbnVsbCwgaSk7XG5cbiAgICAgIGlmIChpbm5lclN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBhbnksIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW291dGVySW5kZXhdID0gaW5uZXJWYWx1ZTtcbiAgICBpZiAoIShpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSkge1xuICAgICAgKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgIHRoaXMuaGF2ZVZhbHVlcysrO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uLCBoYXZlVmFsdWVzLCB2YWx1ZXMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gdmFsdWVzLmxlbmd0aDtcblxuICAgIGlmICghKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlKSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29tcGxldGVkKys7XG5cbiAgICBpZiAodGhpcy5jb21wbGV0ZWQgIT09IGxlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYXZlVmFsdWVzID09PSBsZW4pIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWVzKTtcbiAgICB9XG5cbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbmNvbnN0IHRvU3RyaW5nOiBGdW5jdGlvbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZVN0eWxlRXZlbnRFbWl0dGVyIHtcbiAgYWRkTGlzdGVuZXI6IChldmVudE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlcikgPT4gdGhpcztcbiAgcmVtb3ZlTGlzdGVuZXI6IChldmVudE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlcikgPT4gdGhpcztcbn1cblxuZXhwb3J0IHR5cGUgTm9kZUV2ZW50SGFuZGxlciA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuLy8gRm9yIEFQSXMgdGhhdCBpbXBsZW1lbnQgYGFkZExpc3RlbmVyYCBhbmQgYHJlbW92ZUxpc3RlbmVyYCBtZXRob2RzIHRoYXQgbWF5XG4vLyBub3QgdXNlIHRoZSBzYW1lIGFyZ3VtZW50cyBvciByZXR1cm4gRXZlbnRFbWl0dGVyIHZhbHVlc1xuLy8gc3VjaCBhcyBSZWFjdCBOYXRpdmVcbmV4cG9ydCBpbnRlcmZhY2UgTm9kZUNvbXBhdGlibGVFdmVudEVtaXR0ZXIge1xuICBhZGRMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB2b2lkIHwge307XG4gIHJlbW92ZUxpc3RlbmVyOiAoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IHZvaWQgfCB7fTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBKUXVlcnlTdHlsZUV2ZW50RW1pdHRlciB7XG4gIG9uOiAoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiB2b2lkO1xuICBvZmY6IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGFzRXZlbnRUYXJnZXRBZGRSZW1vdmU8RT4ge1xuICBhZGRFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6ICgoZXZ0OiBFKSA9PiB2b2lkKSB8IG51bGwsIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI/OiAoKGV2dDogRSkgPT4gdm9pZCkgfCBudWxsLCBvcHRpb25zPzogRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuKTogdm9pZDtcbn1cblxuZXhwb3J0IHR5cGUgRXZlbnRUYXJnZXRMaWtlPFQ+ID0gSGFzRXZlbnRUYXJnZXRBZGRSZW1vdmU8VD4gfCBOb2RlU3R5bGVFdmVudEVtaXR0ZXIgfCBOb2RlQ29tcGF0aWJsZUV2ZW50RW1pdHRlciB8IEpRdWVyeVN0eWxlRXZlbnRFbWl0dGVyO1xuXG5leHBvcnQgdHlwZSBGcm9tRXZlbnRUYXJnZXQ8VD4gPSBFdmVudFRhcmdldExpa2U8VD4gfCBBcnJheUxpa2U8RXZlbnRUYXJnZXRMaWtlPFQ+PjtcblxuZXhwb3J0IGludGVyZmFjZSBFdmVudExpc3RlbmVyT3B0aW9ucyB7XG4gIGNhcHR1cmU/OiBib29sZWFuO1xuICBwYXNzaXZlPzogYm9vbGVhbjtcbiAgb25jZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgZXh0ZW5kcyBFdmVudExpc3RlbmVyT3B0aW9ucyB7XG4gIG9uY2U/OiBib29sZWFuO1xuICBwYXNzaXZlPzogYm9vbGVhbjtcbn1cblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8VD47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPih0YXJnZXQ6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcsIHJlc3VsdFNlbGVjdG9yOiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPih0YXJnZXQ6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEV2ZW50TGlzdGVuZXJPcHRpb25zKTogT2JzZXJ2YWJsZTxUPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZywgb3B0aW9uczogRXZlbnRMaXN0ZW5lck9wdGlvbnMsIHJlc3VsdFNlbGVjdG9yOiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBldmVudHMgb2YgYSBzcGVjaWZpYyB0eXBlIGNvbWluZyBmcm9tIHRoZVxuICogZ2l2ZW4gZXZlbnQgdGFyZ2V0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5DcmVhdGVzIGFuIE9ic2VydmFibGUgZnJvbSBET00gZXZlbnRzLCBvciBOb2RlLmpzXG4gKiBFdmVudEVtaXR0ZXIgZXZlbnRzIG9yIG90aGVycy48L3NwYW4+XG4gKlxuICogIVtdKGZyb21FdmVudC5wbmcpXG4gKlxuICogYGZyb21FdmVudGAgYWNjZXB0cyBhcyBhIGZpcnN0IGFyZ3VtZW50IGV2ZW50IHRhcmdldCwgd2hpY2ggaXMgYW4gb2JqZWN0IHdpdGggbWV0aG9kc1xuICogZm9yIHJlZ2lzdGVyaW5nIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zLiBBcyBhIHNlY29uZCBhcmd1bWVudCBpdCB0YWtlcyBzdHJpbmcgdGhhdCBpbmRpY2F0ZXNcbiAqIHR5cGUgb2YgZXZlbnQgd2Ugd2FudCB0byBsaXN0ZW4gZm9yLiBgZnJvbUV2ZW50YCBzdXBwb3J0cyBzZWxlY3RlZCB0eXBlcyBvZiBldmVudCB0YXJnZXRzLFxuICogd2hpY2ggYXJlIGRlc2NyaWJlZCBpbiBkZXRhaWwgYmVsb3cuIElmIHlvdXIgZXZlbnQgdGFyZ2V0IGRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgb25lcyBsaXN0ZWQsXG4gKiB5b3Ugc2hvdWxkIHVzZSB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn0sIHdoaWNoIGNhbiBiZSB1c2VkIG9uIGFyYml0cmFyeSBBUElzLlxuICogV2hlbiBpdCBjb21lcyB0byBBUElzIHN1cHBvcnRlZCBieSBgZnJvbUV2ZW50YCwgdGhlaXIgbWV0aG9kcyBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBldmVudFxuICogaGFuZGxlciBmdW5jdGlvbnMgaGF2ZSBkaWZmZXJlbnQgbmFtZXMsIGJ1dCB0aGV5IGFsbCBhY2NlcHQgYSBzdHJpbmcgZGVzY3JpYmluZyBldmVudCB0eXBlXG4gKiBhbmQgZnVuY3Rpb24gaXRzZWxmLCB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBzYWlkIGV2ZW50IGhhcHBlbnMuXG4gKlxuICogRXZlcnkgdGltZSByZXN1bHRpbmcgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLCBldmVudCBoYW5kbGVyIGZ1bmN0aW9uIHdpbGwgYmUgcmVnaXN0ZXJlZFxuICogdG8gZXZlbnQgdGFyZ2V0IG9uIGdpdmVuIGV2ZW50IHR5cGUuIFdoZW4gdGhhdCBldmVudCBmaXJlcywgdmFsdWVcbiAqIHBhc3NlZCBhcyBhIGZpcnN0IGFyZ3VtZW50IHRvIHJlZ2lzdGVyZWQgZnVuY3Rpb24gd2lsbCBiZSBlbWl0dGVkIGJ5IG91dHB1dCBPYnNlcnZhYmxlLlxuICogV2hlbiBPYnNlcnZhYmxlIGlzIHVuc3Vic2NyaWJlZCwgZnVuY3Rpb24gd2lsbCBiZSB1bnJlZ2lzdGVyZWQgZnJvbSBldmVudCB0YXJnZXQuXG4gKlxuICogTm90ZSB0aGF0IGlmIGV2ZW50IHRhcmdldCBjYWxscyByZWdpc3RlcmVkIGZ1bmN0aW9uIHdpdGggbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgc2Vjb25kXG4gKiBhbmQgZm9sbG93aW5nIGFyZ3VtZW50cyB3aWxsIG5vdCBhcHBlYXIgaW4gcmVzdWx0aW5nIHN0cmVhbS4gSW4gb3JkZXIgdG8gZ2V0IGFjY2VzcyB0byB0aGVtLFxuICogeW91IGNhbiBwYXNzIHRvIGBmcm9tRXZlbnRgIG9wdGlvbmFsIHByb2plY3QgZnVuY3Rpb24sIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggYWxsIGFyZ3VtZW50c1xuICogcGFzc2VkIHRvIGV2ZW50IGhhbmRsZXIuIE91dHB1dCBPYnNlcnZhYmxlIHdpbGwgdGhlbiBlbWl0IHZhbHVlIHJldHVybmVkIGJ5IHByb2plY3QgZnVuY3Rpb24sXG4gKiBpbnN0ZWFkIG9mIHRoZSB1c3VhbCB2YWx1ZS5cbiAqXG4gKiBSZW1lbWJlciB0aGF0IGV2ZW50IHRhcmdldHMgbGlzdGVkIGJlbG93IGFyZSBjaGVja2VkIHZpYSBkdWNrIHR5cGluZy4gSXQgbWVhbnMgdGhhdFxuICogbm8gbWF0dGVyIHdoYXQga2luZCBvZiBvYmplY3QgeW91IGhhdmUgYW5kIG5vIG1hdHRlciB3aGF0IGVudmlyb25tZW50IHlvdSB3b3JrIGluLFxuICogeW91IGNhbiBzYWZlbHkgdXNlIGBmcm9tRXZlbnRgIG9uIHRoYXQgb2JqZWN0IGlmIGl0IGV4cG9zZXMgZGVzY3JpYmVkIG1ldGhvZHMgKHByb3ZpZGVkXG4gKiBvZiBjb3Vyc2UgdGhleSBiZWhhdmUgYXMgd2FzIGRlc2NyaWJlZCBhYm92ZSkuIFNvIGZvciBleGFtcGxlIGlmIE5vZGUuanMgbGlicmFyeSBleHBvc2VzXG4gKiBldmVudCB0YXJnZXQgd2hpY2ggaGFzIHRoZSBzYW1lIG1ldGhvZCBuYW1lcyBhcyBET00gRXZlbnRUYXJnZXQsIGBmcm9tRXZlbnRgIGlzIHN0aWxsXG4gKiBhIGdvb2QgY2hvaWNlLlxuICpcbiAqIElmIHRoZSBBUEkgeW91IHVzZSBpcyBtb3JlIGNhbGxiYWNrIHRoZW4gZXZlbnQgaGFuZGxlciBvcmllbnRlZCAoc3Vic2NyaWJlZFxuICogY2FsbGJhY2sgZnVuY3Rpb24gZmlyZXMgb25seSBvbmNlIGFuZCB0aHVzIHRoZXJlIGlzIG5vIG5lZWQgdG8gbWFudWFsbHlcbiAqIHVucmVnaXN0ZXIgaXQpLCB5b3Ugc2hvdWxkIHVzZSB7QGxpbmsgYmluZENhbGxiYWNrfSBvciB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqIGluc3RlYWQuXG4gKlxuICogYGZyb21FdmVudGAgc3VwcG9ydHMgZm9sbG93aW5nIHR5cGVzIG9mIGV2ZW50IHRhcmdldHM6XG4gKlxuICogKipET00gRXZlbnRUYXJnZXQqKlxuICpcbiAqIFRoaXMgaXMgYW4gb2JqZWN0IHdpdGggYGFkZEV2ZW50TGlzdGVuZXJgIGFuZCBgcmVtb3ZlRXZlbnRMaXN0ZW5lcmAgbWV0aG9kcy5cbiAqXG4gKiBJbiB0aGUgYnJvd3NlciwgYGFkZEV2ZW50TGlzdGVuZXJgIGFjY2VwdHMgLSBhcGFydCBmcm9tIGV2ZW50IHR5cGUgc3RyaW5nIGFuZCBldmVudFxuICogaGFuZGxlciBmdW5jdGlvbiBhcmd1bWVudHMgLSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIsIHdoaWNoIGlzIGVpdGhlciBhbiBvYmplY3Qgb3IgYm9vbGVhbixcbiAqIGJvdGggdXNlZCBmb3IgYWRkaXRpb25hbCBjb25maWd1cmF0aW9uIGhvdyBhbmQgd2hlbiBwYXNzZWQgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQuIFdoZW5cbiAqIGBmcm9tRXZlbnRgIGlzIHVzZWQgd2l0aCBldmVudCB0YXJnZXQgb2YgdGhhdCB0eXBlLCB5b3UgY2FuIHByb3ZpZGUgdGhpcyB2YWx1ZXNcbiAqIGFzIHRoaXJkIHBhcmFtZXRlciBhcyB3ZWxsLlxuICpcbiAqICoqTm9kZS5qcyBFdmVudEVtaXR0ZXIqKlxuICpcbiAqIEFuIG9iamVjdCB3aXRoIGBhZGRMaXN0ZW5lcmAgYW5kIGByZW1vdmVMaXN0ZW5lcmAgbWV0aG9kcy5cbiAqXG4gKiAqKkpRdWVyeS1zdHlsZSBldmVudCB0YXJnZXQqKlxuICpcbiAqIEFuIG9iamVjdCB3aXRoIGBvbmAgYW5kIGBvZmZgIG1ldGhvZHNcbiAqXG4gKiAqKkRPTSBOb2RlTGlzdCoqXG4gKlxuICogTGlzdCBvZiBET00gTm9kZXMsIHJldHVybmVkIGZvciBleGFtcGxlIGJ5IGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsYCBvciBgTm9kZS5jaGlsZE5vZGVzYC5cbiAqXG4gKiBBbHRob3VnaCB0aGlzIGNvbGxlY3Rpb24gaXMgbm90IGV2ZW50IHRhcmdldCBpbiBpdHNlbGYsIGBmcm9tRXZlbnRgIHdpbGwgaXRlcmF0ZSBvdmVyIGFsbCBOb2Rlc1xuICogaXQgY29udGFpbnMgYW5kIGluc3RhbGwgZXZlbnQgaGFuZGxlciBmdW5jdGlvbiBpbiBldmVyeSBvZiB0aGVtLiBXaGVuIHJldHVybmVkIE9ic2VydmFibGVcbiAqIGlzIHVuc3Vic2NyaWJlZCwgZnVuY3Rpb24gd2lsbCBiZSByZW1vdmVkIGZyb20gYWxsIE5vZGVzLlxuICpcbiAqICoqRE9NIEh0bWxDb2xsZWN0aW9uKipcbiAqXG4gKiBKdXN0IGFzIGluIGNhc2Ugb2YgTm9kZUxpc3QgaXQgaXMgYSBjb2xsZWN0aW9uIG9mIERPTSBub2Rlcy4gSGVyZSBhcyB3ZWxsIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gaXNcbiAqIGluc3RhbGxlZCBhbmQgcmVtb3ZlZCBpbiBlYWNoIG9mIGVsZW1lbnRzLlxuICpcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXRzIGNsaWNrcyBoYXBwZW5pbmcgb24gdGhlIERPTSBkb2N1bWVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIE1vdXNlRXZlbnQgb2JqZWN0IGxvZ2dlZCB0byBjb25zb2xlIGV2ZXJ5IHRpbWUgYSBjbGlja1xuICogLy8gb2NjdXJzIG9uIHRoZSBkb2N1bWVudC5cbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgYWRkRXZlbnRMaXN0ZW5lciB3aXRoIGNhcHR1cmUgb3B0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3NJbkRvY3VtZW50ID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snLCB0cnVlKTsgLy8gbm90ZSBvcHRpb25hbCBjb25maWd1cmF0aW9uIHBhcmFtZXRlclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRvIGFkZEV2ZW50TGlzdGVuZXJcbiAqIGNvbnN0IGNsaWNrc0luRGl2ID0gZnJvbUV2ZW50KHNvbWVEaXZJbkRvY3VtZW50LCAnY2xpY2snKTtcbiAqXG4gKiBjbGlja3NJbkRvY3VtZW50LnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnZG9jdW1lbnQnKSk7XG4gKiBjbGlja3NJbkRpdi5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ2RpdicpKTtcbiAqXG4gKiAvLyBCeSBkZWZhdWx0IGV2ZW50cyBidWJibGUgVVAgaW4gRE9NIHRyZWUsIHNvIG5vcm1hbGx5XG4gKiAvLyB3aGVuIHdlIHdvdWxkIGNsaWNrIG9uIGRpdiBpbiBkb2N1bWVudFxuICogLy8gXCJkaXZcIiB3b3VsZCBiZSBsb2dnZWQgZmlyc3QgYW5kIHRoZW4gXCJkb2N1bWVudFwiLlxuICogLy8gU2luY2Ugd2Ugc3BlY2lmaWVkIG9wdGlvbmFsIGBjYXB0dXJlYCBvcHRpb24sIGRvY3VtZW50XG4gKiAvLyB3aWxsIGNhdGNoIGV2ZW50IHdoZW4gaXQgZ29lcyBET1dOIERPTSB0cmVlLCBzbyBjb25zb2xlXG4gKiAvLyB3aWxsIGxvZyBcImRvY3VtZW50XCIgYW5kIHRoZW4gXCJkaXZcIi5cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJpbmRDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufVxuICpcbiAqIEBwYXJhbSB7RnJvbUV2ZW50VGFyZ2V0PFQ+fSB0YXJnZXQgVGhlIERPTSBFdmVudFRhcmdldCwgTm9kZS5qc1xuICogRXZlbnRFbWl0dGVyLCBKUXVlcnktbGlrZSBldmVudCB0YXJnZXQsIE5vZGVMaXN0IG9yIEhUTUxDb2xsZWN0aW9uIHRvIGF0dGFjaCB0aGUgZXZlbnQgaGFuZGxlciB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIGV2ZW50IG5hbWUgb2YgaW50ZXJlc3QsIGJlaW5nIGVtaXR0ZWQgYnkgdGhlXG4gKiBgdGFyZ2V0YC5cbiAqIEBwYXJhbSB7RXZlbnRMaXN0ZW5lck9wdGlvbnN9IFtvcHRpb25zXSBPcHRpb25zIHRvIHBhc3MgdGhyb3VnaCB0byBhZGRFdmVudExpc3RlbmVyXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fVxuICogQG5hbWUgZnJvbUV2ZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4oXG4gIHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LFxuICBldmVudE5hbWU6IHN0cmluZyxcbiAgb3B0aW9ucz86IEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gVCksXG4gIHJlc3VsdFNlbGVjdG9yPzogKCguLi5hcmdzOiBhbnlbXSkgPT4gVClcbik6IE9ic2VydmFibGU8VD4ge1xuXG4gIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmVzdWx0U2VsZWN0b3IgPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIGZyb21FdmVudDxUPih0YXJnZXQsIGV2ZW50TmFtZSwgPEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgdW5kZWZpbmVkPm9wdGlvbnMpLnBpcGUoXG4gICAgICBtYXAoYXJncyA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSlcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIGZ1bmN0aW9uIGhhbmRsZXIoZTogVCkge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dChlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2V0dXBTdWJzY3JpcHRpb24odGFyZ2V0LCBldmVudE5hbWUsIGhhbmRsZXIsIHN1YnNjcmliZXIsIG9wdGlvbnMgYXMgRXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0dXBTdWJzY3JpcHRpb248VD4oc291cmNlT2JqOiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlcjogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz86IEV2ZW50TGlzdGVuZXJPcHRpb25zKSB7XG4gIGxldCB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbiAgaWYgKGlzRXZlbnRUYXJnZXQoc291cmNlT2JqKSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZU9iajtcbiAgICBzb3VyY2VPYmouYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIHVuc3Vic2NyaWJlID0gKCkgPT4gc291cmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgfSBlbHNlIGlmIChpc0pRdWVyeVN0eWxlRXZlbnRFbWl0dGVyKHNvdXJjZU9iaikpIHtcbiAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VPYmo7XG4gICAgc291cmNlT2JqLm9uKGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiBzb3VyY2Uub2ZmKGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gIH0gZWxzZSBpZiAoaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIoc291cmNlT2JqKSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZU9iajtcbiAgICBzb3VyY2VPYmouYWRkTGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyIGFzIE5vZGVFdmVudEhhbmRsZXIpO1xuICAgIHVuc3Vic2NyaWJlID0gKCkgPT4gc291cmNlLnJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciBhcyBOb2RlRXZlbnRIYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChzb3VyY2VPYmogJiYgKHNvdXJjZU9iaiBhcyBhbnkpLmxlbmd0aCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSAoc291cmNlT2JqIGFzIGFueSkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNldHVwU3Vic2NyaXB0aW9uKHNvdXJjZU9ialtpXSwgZXZlbnROYW1lLCBoYW5kbGVyLCBzdWJzY3JpYmVyLCBvcHRpb25zKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBldmVudCB0YXJnZXQnKTtcbiAgfVxuXG4gIHN1YnNjcmliZXIuYWRkKHVuc3Vic2NyaWJlKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIoc291cmNlT2JqOiBhbnkpOiBzb3VyY2VPYmogaXMgTm9kZVN0eWxlRXZlbnRFbWl0dGVyIHtcbiAgcmV0dXJuIHNvdXJjZU9iaiAmJiB0eXBlb2Ygc291cmNlT2JqLmFkZExpc3RlbmVyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBzb3VyY2VPYmoucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIoc291cmNlT2JqOiBhbnkpOiBzb3VyY2VPYmogaXMgSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIge1xuICByZXR1cm4gc291cmNlT2JqICYmIHR5cGVvZiBzb3VyY2VPYmoub24gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNvdXJjZU9iai5vZmYgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzRXZlbnRUYXJnZXQoc291cmNlT2JqOiBhbnkpOiBzb3VyY2VPYmogaXMgSGFzRXZlbnRUYXJnZXRBZGRSZW1vdmU8YW55PiB7XG4gIHJldHVybiBzb3VyY2VPYmogJiYgdHlwZW9mIHNvdXJjZU9iai5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBzb3VyY2VPYmoucmVtb3ZlRXZlbnRMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICcuL2Zyb21FdmVudCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyOiAoaGFuZGxlcjogRnVuY3Rpb24pID0+IGFueSwgcmVtb3ZlSGFuZGxlcj86IChoYW5kbGVyOiBGdW5jdGlvbiwgc2lnbmFsPzogYW55KSA9PiB2b2lkKTogT2JzZXJ2YWJsZTxUPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyOiAoaGFuZGxlcjogRnVuY3Rpb24pID0+IGFueSwgcmVtb3ZlSGFuZGxlcj86IChoYW5kbGVyOiBGdW5jdGlvbiwgc2lnbmFsPzogYW55KSA9PiB2b2lkLCByZXN1bHRTZWxlY3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBmcm9tIGFuIEFQSSBiYXNlZCBvbiBhZGRIYW5kbGVyL3JlbW92ZUhhbmRsZXJcbiAqIGZ1bmN0aW9ucy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29udmVydHMgYW55IGFkZEhhbmRsZXIvcmVtb3ZlSGFuZGxlciBBUEkgdG8gYW5cbiAqIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXShmcm9tRXZlbnRQYXR0ZXJuLnBuZylcbiAqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgYnkgdXNpbmcgdGhlIGBhZGRIYW5kbGVyYCBhbmQgYHJlbW92ZUhhbmRsZXJgXG4gKiBmdW5jdGlvbnMgdG8gYWRkIGFuZCByZW1vdmUgdGhlIGhhbmRsZXJzLiBUaGUgYGFkZEhhbmRsZXJgIGlzXG4gKiBjYWxsZWQgd2hlbiB0aGUgb3V0cHV0IE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZCwgYW5kIGByZW1vdmVIYW5kbGVyYCBpc1xuICogY2FsbGVkIHdoZW4gdGhlIFN1YnNjcmlwdGlvbiBpcyB1bnN1YnNjcmliZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIEVtaXRzIGNsaWNrcyBoYXBwZW5pbmcgb24gdGhlIERPTSBkb2N1bWVudFxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gYWRkQ2xpY2tIYW5kbGVyKGhhbmRsZXIpIHtcbiAqICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiByZW1vdmVDbGlja0hhbmRsZXIoaGFuZGxlcikge1xuICogICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICogfVxuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudFBhdHRlcm4oXG4gKiAgIGFkZENsaWNrSGFuZGxlcixcbiAqICAgcmVtb3ZlQ2xpY2tIYW5kbGVyLFxuICogKTtcbiAqIGNsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50fVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oaGFuZGxlcjogRnVuY3Rpb24pOiBhbnl9IGFkZEhhbmRsZXIgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiBhIGBoYW5kbGVyYCBmdW5jdGlvbiBhcyBhcmd1bWVudCBhbmQgYXR0YWNoZXMgaXQgc29tZWhvdyB0byB0aGUgYWN0dWFsXG4gKiBzb3VyY2Ugb2YgZXZlbnRzLlxuICogQHBhcmFtIHtmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbiwgc2lnbmFsPzogYW55KTogdm9pZH0gW3JlbW92ZUhhbmRsZXJdIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXRcbiAqIHRha2VzIGEgYGhhbmRsZXJgIGZ1bmN0aW9uIGFzIGFyZ3VtZW50IGFuZCByZW1vdmVzIGl0IGluIGNhc2UgaXQgd2FzXG4gKiBwcmV2aW91c2x5IGF0dGFjaGVkIHVzaW5nIGBhZGRIYW5kbGVyYC4gaWYgYWRkSGFuZGxlciByZXR1cm5zIHNpZ25hbCB0byB0ZWFyZG93biB3aGVuIHJlbW92ZSxcbiAqIHJlbW92ZUhhbmRsZXIgZnVuY3Rpb24gd2lsbCBmb3J3YXJkIGl0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn1cbiAqIEBuYW1lIGZyb21FdmVudFBhdHRlcm5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVIYW5kbGVyPzogKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRTZWxlY3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VCB8IFRbXT4ge1xuXG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJldHVybiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXIsIHJlbW92ZUhhbmRsZXIpLnBpcGUoXG4gICAgICBtYXAoYXJncyA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSlcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQgfCBUW10+KHN1YnNjcmliZXIgPT4ge1xuICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uZTogVFtdKSA9PiBzdWJzY3JpYmVyLm5leHQoZS5sZW5ndGggPT09IDEgPyBlWzBdIDogZSk7XG5cbiAgICBsZXQgcmV0VmFsdWU6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmV0VmFsdWUgPSBhZGRIYW5kbGVyKGhhbmRsZXIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24ocmVtb3ZlSGFuZGxlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHJlbW92ZUhhbmRsZXIoaGFuZGxlciwgcmV0VmFsdWUpIDtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uRnVuYzxTPiA9IChzdGF0ZTogUykgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEl0ZXJhdGVGdW5jPFM+ID0gKHN0YXRlOiBTKSA9PiBTO1xuZXhwb3J0IHR5cGUgUmVzdWx0RnVuYzxTLCBUPiA9IChzdGF0ZTogUykgPT4gVDtcblxuaW50ZXJmYWNlIFNjaGVkdWxlclN0YXRlPFQsIFM+IHtcbiAgbmVlZEl0ZXJhdGU/OiBib29sZWFuO1xuICBzdGF0ZTogUztcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPjtcbiAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz47XG4gIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlQmFzZU9wdGlvbnM8Uz4ge1xuICAvKipcbiAgICogSW5pdGlhbCBzdGF0ZS5cbiAgICovXG4gIGluaXRpYWxTdGF0ZTogUztcbiAgLyoqXG4gICAqIENvbmRpdGlvbiBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgc3RhdGUgYW5kIHJldHVybnMgYm9vbGVhbi5cbiAgICogV2hlbiBpdCByZXR1cm5zIGZhbHNlLCB0aGUgZ2VuZXJhdG9yIHN0b3BzLlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCBhIGdlbmVyYXRvciBuZXZlciBzdG9wcy5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbkZ1bmM8Uz47XG4gIC8qKlxuICAgKiBJdGVyYXRlIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBuZXcgc3RhdGUuXG4gICAqL1xuICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPjtcbiAgLyoqXG4gICAqIFNjaGVkdWxlckxpa2UgdG8gdXNlIGZvciBnZW5lcmF0aW9uIHByb2Nlc3MuXG4gICAqIEJ5IGRlZmF1bHQsIGEgZ2VuZXJhdG9yIHN0YXJ0cyBpbW1lZGlhdGVseS5cbiAgICovXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVPcHRpb25zPFQsIFM+IGV4dGVuZHMgR2VuZXJhdGVCYXNlT3B0aW9uczxTPiB7XG4gIC8qKlxuICAgKiBSZXN1bHQgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBhIHZhbHVlIHRvIGVtaXQuXG4gICAqL1xuICByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPjtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKDAsIHggPT4geCA8IDEwLCB4ID0+IHggKyAxLCB4ID0+IHgpO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzaW5nIGFzYXAgc2NoZWR1bGVyLCBwcm9kdWNlcyBzZXF1ZW5jZSBvZiAyLCAzLCA1LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSgxLCB4ID0+IHggPCA1LCB4ID0+ICAqIDIsIHggPT4geCArIDEsIGFzYXApO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7U30gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogU30gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogVH0gcmVzdWx0U2VsZWN0b3IgU2VsZWN0b3IgZnVuY3Rpb24gZm9yIHJlc3VsdHMgcHJvZHVjZWQgaW4gdGhlIHNlcXVlbmNlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSBvbiB3aGljaCB0byBydW4gdGhlIGdlbmVyYXRvciBsb29wLiBJZiBub3QgcHJvdmlkZWQsIGRlZmF1bHRzIHRvIGVtaXQgaW1tZWRpYXRlbHkuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuICBleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8VCwgUz4oaW5pdGlhbFN0YXRlOiBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKiBUaGUgb3ZlcmxvYWQgdXNlcyBzdGF0ZSBhcyBhbiBlbWl0dGVkIHZhbHVlLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKDAsIHggPT4geCA8IDEwLCB4ID0+IHggKyAxKTtcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2luZyBhc2FwIHNjaGVkdWxlciwgcHJvZHVjZXMgc2VxdWVuY2Ugb2YgMSwgMiwgNCwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoMSwgeCA9PiB4IDwgNSwgeCA9PiB4ICAqIDIsIFJ4LlNjaGVkdWxlci5hc2FwKTtcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge1N9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHRvIHRlcm1pbmF0ZSBnZW5lcmF0aW9uICh1cG9uIHJldHVybmluZyBmYWxzZSkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IFN9IGl0ZXJhdGUgSXRlcmF0aW9uIHN0ZXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IG9uIHdoaWNoIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3AuIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gZW1pdCBpbW1lZGlhdGVseS5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFM+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8Uz4oaW5pdGlhbFN0YXRlOiBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogQ29uZGl0aW9uRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxTPjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICogVGhlIG92ZXJsb2FkIGFjY2VwdHMgb3B0aW9ucyBvYmplY3QgdGhhdCBtaWdodCBjb250YWluIGluaXRpYWwgc3RhdGUsIGl0ZXJhdGUsXG4gKiBjb25kaXRpb24gYW5kIHNjaGVkdWxlci5cbiAqXG4gKiAhW10oZ2VuZXJhdGUucG5nKVxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlByb2R1Y2VzIHNlcXVlbmNlIG9mIDAsIDEsIDIsIC4uLiA5LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSh7XG4gKiAgIGluaXRpYWxTdGF0ZTogMCxcbiAqICAgY29uZGl0aW9uOiB4ID0+IHggPCAxMCxcbiAqICAgaXRlcmF0ZTogeCA9PiB4ICsgMSxcbiAqIH0pO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7R2VuZXJhdGVCYXNlT3B0aW9uczxTPn0gb3B0aW9ucyBPYmplY3QgdGhhdCBtdXN0IGNvbnRhaW4gaW5pdGlhbFN0YXRlLCBpdGVyYXRlIGFuZCBtaWdodCBjb250YWluIGNvbmRpdGlvbiBhbmQgc2NoZWR1bGVyLlxuICogQHJldHVybnMge09ic2VydmFibGU8Uz59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxTPihvcHRpb25zOiBHZW5lcmF0ZUJhc2VPcHRpb25zPFM+KTogT2JzZXJ2YWJsZTxTPjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICogVGhlIG92ZXJsb2FkIGFjY2VwdHMgb3B0aW9ucyBvYmplY3QgdGhhdCBtaWdodCBjb250YWluIGluaXRpYWwgc3RhdGUsIGl0ZXJhdGUsXG4gKiBjb25kaXRpb24sIHJlc3VsdCBzZWxlY3RvciBhbmQgc2NoZWR1bGVyLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBjb25kaXRpb246IHggPT4geCA8IDEwLFxuICogICBpdGVyYXRlOiB4ID0+IHggKyAxLFxuICogICByZXN1bHRTZWxlY3RvcjogeCA9PiB4LFxuICogfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtHZW5lcmF0ZU9wdGlvbnM8VCwgUz59IG9wdGlvbnMgT2JqZWN0IHRoYXQgbXVzdCBjb250YWluIGluaXRpYWxTdGF0ZSwgaXRlcmF0ZSwgcmVzdWx0U2VsZWN0b3IgYW5kIG1pZ2h0IGNvbnRhaW4gY29uZGl0aW9uIGFuZCBzY2hlZHVsZXIuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFQsIFM+KG9wdGlvbnM6IEdlbmVyYXRlT3B0aW9uczxULCBTPik6IE9ic2VydmFibGU8VD47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxULCBTPihpbml0aWFsU3RhdGVPck9wdGlvbnM6IFMgfCBHZW5lcmF0ZU9wdGlvbnM8VCwgUz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlPzogSXRlcmF0ZUZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGU/OiAoUmVzdWx0RnVuYzxTLCBUPikgfCBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+IHtcblxuICBsZXQgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD47XG4gIGxldCBpbml0aWFsU3RhdGU6IFM7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgR2VuZXJhdGVPcHRpb25zPFQsIFM+O1xuICAgIGluaXRpYWxTdGF0ZSA9IG9wdGlvbnMuaW5pdGlhbFN0YXRlO1xuICAgIGNvbmRpdGlvbiA9IG9wdGlvbnMuY29uZGl0aW9uO1xuICAgIGl0ZXJhdGUgPSBvcHRpb25zLml0ZXJhdGU7XG4gICAgcmVzdWx0U2VsZWN0b3IgPSBvcHRpb25zLnJlc3VsdFNlbGVjdG9yIHx8IGlkZW50aXR5IGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gICAgc2NoZWR1bGVyID0gb3B0aW9ucy5zY2hlZHVsZXI7XG4gIH0gZWxzZSBpZiAocmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgPT09IHVuZGVmaW5lZCB8fCBpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSkpIHtcbiAgICBpbml0aWFsU3RhdGUgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgUztcbiAgICByZXN1bHRTZWxlY3RvciA9IGlkZW50aXR5IGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgYXMgU2NoZWR1bGVyTGlrZTtcbiAgfSBlbHNlIHtcbiAgICBpbml0aWFsU3RhdGUgPSBpbml0aWFsU3RhdGVPck9wdGlvbnMgYXMgUztcbiAgICByZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlIGFzIFJlc3VsdEZ1bmM8UywgVD47XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IHN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8U2NoZWR1bGVyU3RhdGU8VCwgUz4+KGRpc3BhdGNoLCAwLCB7XG4gICAgICAgIHN1YnNjcmliZXIsXG4gICAgICAgIGl0ZXJhdGUsXG4gICAgICAgIGNvbmRpdGlvbixcbiAgICAgICAgcmVzdWx0U2VsZWN0b3IsXG4gICAgICAgIHN0YXRlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICAgIGxldCBjb25kaXRpb25SZXN1bHQ6IGJvb2xlYW47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uZGl0aW9uUmVzdWx0ID0gY29uZGl0aW9uKHN0YXRlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb25kaXRpb25SZXN1bHQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCB2YWx1ZTogVDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gcmVzdWx0U2VsZWN0b3Ioc3RhdGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IGl0ZXJhdGUoc3RhdGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0cnVlKTtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxULCBTPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248U2NoZWR1bGVyU3RhdGU8VCwgUz4+LCBzdGF0ZTogU2NoZWR1bGVyU3RhdGU8VCwgUz4pIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb25kaXRpb24gfSA9IHN0YXRlO1xuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChzdGF0ZS5uZWVkSXRlcmF0ZSkge1xuICAgIHRyeSB7XG4gICAgICBzdGF0ZS5zdGF0ZSA9IHN0YXRlLml0ZXJhdGUoc3RhdGUuc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUubmVlZEl0ZXJhdGUgPSB0cnVlO1xuICB9XG4gIGlmIChjb25kaXRpb24pIHtcbiAgICBsZXQgY29uZGl0aW9uUmVzdWx0OiBib29sZWFuO1xuICAgIHRyeSB7XG4gICAgICBjb25kaXRpb25SZXN1bHQgPSBjb25kaXRpb24oc3RhdGUuc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCFjb25kaXRpb25SZXN1bHQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgbGV0IHZhbHVlOiBUO1xuICB0cnkge1xuICAgIHZhbHVlID0gc3RhdGUucmVzdWx0U2VsZWN0b3Ioc3RhdGUuc3RhdGUpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuL2RlZmVyJztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRGVjaWRlcyBhdCBzdWJzY3JpcHRpb24gdGltZSB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYWN0dWFsbHkgYmUgc3Vic2NyaWJlZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+YElmYCBzdGF0ZW1lbnQgZm9yIE9ic2VydmFibGVzLjwvc3Bhbj5cbiAqXG4gKiBgaWlmYCBhY2NlcHRzIGEgY29uZGl0aW9uIGZ1bmN0aW9uIGFuZCB0d28gT2JzZXJ2YWJsZXMuIFdoZW5cbiAqIGFuIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgdGhlIG9wZXJhdG9yIGlzIHN1YnNjcmliZWQsIGNvbmRpdGlvbiBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZC5cbiAqIEJhc2VkIG9uIHdoYXQgYm9vbGVhbiBpdCByZXR1cm5zIGF0IHRoYXQgbW9tZW50LCBjb25zdW1lciB3aWxsIHN1YnNjcmliZSBlaXRoZXIgdG9cbiAqIHRoZSBmaXJzdCBPYnNlcnZhYmxlIChpZiBjb25kaXRpb24gd2FzIHRydWUpIG9yIHRvIHRoZSBzZWNvbmQgKGlmIGNvbmRpdGlvbiB3YXMgZmFsc2UpLiBDb25kaXRpb25cbiAqIGZ1bmN0aW9uIG1heSBhbHNvIG5vdCByZXR1cm4gYW55dGhpbmcgLSBpbiB0aGF0IGNhc2UgY29uZGl0aW9uIHdpbGwgYmUgZXZhbHVhdGVkIGFzIGZhbHNlIGFuZFxuICogc2Vjb25kIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLlxuICpcbiAqIE5vdGUgdGhhdCBPYnNlcnZhYmxlcyBmb3IgYm90aCBjYXNlcyAodHJ1ZSBhbmQgZmFsc2UpIGFyZSBvcHRpb25hbC4gSWYgY29uZGl0aW9uIHBvaW50cyB0byBhbiBPYnNlcnZhYmxlIHRoYXRcbiAqIHdhcyBsZWZ0IHVuZGVmaW5lZCwgcmVzdWx0aW5nIHN0cmVhbSB3aWxsIHNpbXBseSBjb21wbGV0ZSBpbW1lZGlhdGVseS4gVGhhdCBhbGxvd3MgeW91IHRvLCByYXRoZXJcbiAqIHRoZW4gY29udHJvbGxpbmcgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQsIGRlY2lkZSBhdCBydW50aW1lIGlmIGNvbnN1bWVyIHNob3VsZCBoYXZlIGFjY2Vzc1xuICogdG8gZ2l2ZW4gT2JzZXJ2YWJsZSBvciBub3QuXG4gKlxuICogSWYgeW91IGhhdmUgbW9yZSBjb21wbGV4IGxvZ2ljIHRoYXQgcmVxdWlyZXMgZGVjaXNpb24gYmV0d2VlbiBtb3JlIHRoYW4gdHdvIE9ic2VydmFibGVzLCB7QGxpbmsgZGVmZXJ9XG4gKiB3aWxsIHByb2JhYmx5IGJlIGEgYmV0dGVyIGNob2ljZS4gQWN0dWFsbHkgYGlpZmAgY2FuIGJlIGVhc2lseSBpbXBsZW1lbnRlZCB3aXRoIHtAbGluayBkZWZlcn1cbiAqIGFuZCBleGlzdHMgb25seSBmb3IgY29udmVuaWVuY2UgYW5kIHJlYWRhYmlsaXR5IHJlYXNvbnMuXG4gKlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ2hhbmdlIGF0IHJ1bnRpbWUgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBzdWJzY3JpYmVUb0ZpcnN0O1xuICogY29uc3QgZmlyc3RPclNlY29uZCA9IGlpZihcbiAqICAgKCkgPT4gc3Vic2NyaWJlVG9GaXJzdCxcbiAqICAgb2YoJ2ZpcnN0JyksXG4gKiAgIG9mKCdzZWNvbmQnKSxcbiAqICk7XG4gKlxuICogc3Vic2NyaWJlVG9GaXJzdCA9IHRydWU7XG4gKiBmaXJzdE9yU2Vjb25kLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqXG4gKiBzdWJzY3JpYmVUb0ZpcnN0ID0gZmFsc2U7XG4gKiBmaXJzdE9yU2Vjb25kLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcInNlY29uZFwiXG4gKlxuICogYGBgXG4gKlxuICogIyMjIENvbnRyb2wgYW4gYWNjZXNzIHRvIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGxldCBhY2Nlc3NHcmFudGVkO1xuICogY29uc3Qgb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2VzcyA9IGlpZihcbiAqICAgKCkgPT4gYWNjZXNzR3JhbnRlZCxcbiAqICAgb2YoJ0l0IHNlZW1zIHlvdSBoYXZlIGFuIGFjY2Vzcy4uLicpLCAvLyBOb3RlIHRoYXQgb25seSBvbmUgT2JzZXJ2YWJsZSBpcyBwYXNzZWQgdG8gdGhlIG9wZXJhdG9yLlxuICogKTtcbiAqXG4gKiBhY2Nlc3NHcmFudGVkID0gdHJ1ZTtcbiAqIG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3Muc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoZSBlbmQnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiSXQgc2VlbXMgeW91IGhhdmUgYW4gYWNjZXNzLi4uXCJcbiAqIC8vIFwiVGhlIGVuZFwiXG4gKlxuICogYWNjZXNzR3JhbnRlZCA9IGZhbHNlO1xuICogb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2Vzcy5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhlIGVuZCcpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJUaGUgZW5kXCJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRlZmVyfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogYm9vbGVhbn0gY29uZGl0aW9uIENvbmRpdGlvbiB3aGljaCBPYnNlcnZhYmxlIHNob3VsZCBiZSBjaG9zZW4uXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IFt0cnVlT2JzZXJ2YWJsZV0gQW4gT2JzZXJ2YWJsZSB0aGF0IHdpbGwgYmUgc3Vic2NyaWJlZCBpZiBjb25kaXRpb24gaXMgdHJ1ZS5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW2ZhbHNlT2JzZXJ2YWJsZV0gQW4gT2JzZXJ2YWJsZSB0aGF0IHdpbGwgYmUgc3Vic2NyaWJlZCBpZiBjb25kaXRpb24gaXMgZmFsc2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBFaXRoZXIgZmlyc3Qgb3Igc2Vjb25kIE9ic2VydmFibGUsIGRlcGVuZGluZyBvbiBjb25kaXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGlpZlxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlpZjxULCBGPihcbiAgY29uZGl0aW9uOiAoKSA9PiBib29sZWFuLFxuICB0cnVlUmVzdWx0OiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gPSBFTVBUWSxcbiAgZmFsc2VSZXN1bHQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxGPiA9IEVNUFRZXG4pOiBPYnNlcnZhYmxlPFR8Rj4ge1xuICByZXR1cm4gZGVmZXI8VHxGPigoKSA9PiBjb25kaXRpb24oKSA/IHRydWVSZXN1bHQgOiBmYWxzZVJlc3VsdCk7XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pc0FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWw6IGFueSk6IHZhbCBpcyBudW1iZXIge1xuICAvLyBwYXJzZUZsb2F0IE5hTnMgbnVtZXJpYy1jYXN0IGZhbHNlIHBvc2l0aXZlcyAobnVsbHx0cnVlfGZhbHNlfFwiXCIpXG4gIC8vIC4uLmJ1dCBtaXNpbnRlcnByZXRzIGxlYWRpbmctbnVtYmVyIHN0cmluZ3MsIHBhcnRpY3VsYXJseSBoZXggbGl0ZXJhbHMgKFwiMHguLi5cIilcbiAgLy8gc3VidHJhY3Rpb24gZm9yY2VzIGluZmluaXRpZXMgdG8gTmFOXG4gIC8vIGFkZGluZyAxIGNvcnJlY3RzIGxvc3Mgb2YgcHJlY2lzaW9uIGZyb20gcGFyc2VGbG9hdCAoIzE1MTAwKVxuICByZXR1cm4gIWlzQXJyYXkodmFsKSAmJiAodmFsIC0gcGFyc2VGbG9hdCh2YWwpICsgMSkgPj0gMDtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4uL3V0aWwvaXNOdW1lcmljJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBzZXF1ZW50aWFsIG51bWJlcnMgZXZlcnkgc3BlY2lmaWVkXG4gKiBpbnRlcnZhbCBvZiB0aW1lLCBvbiBhIHNwZWNpZmllZCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGluY3JlbWVudGFsIG51bWJlcnMgcGVyaW9kaWNhbGx5IGluIHRpbWUuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGludGVydmFsLnBuZylcbiAqXG4gKiBgaW50ZXJ2YWxgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mXG4gKiBhc2NlbmRpbmcgaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lIG9mIHlvdXIgY2hvb3NpbmdcbiAqIGJldHdlZW4gdGhvc2UgZW1pc3Npb25zLiBUaGUgZmlyc3QgZW1pc3Npb24gaXMgbm90IHNlbnQgaW1tZWRpYXRlbHksIGJ1dFxuICogb25seSBhZnRlciB0aGUgZmlyc3QgcGVyaW9kIGhhcyBwYXNzZWQuIEJ5IGRlZmF1bHQsIHRoaXMgb3BlcmF0b3IgdXNlcyB0aGVcbiAqIGBhc3luY2Age0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHByb3ZpZGUgYSBub3Rpb24gb2YgdGltZSwgYnV0IHlvdSBtYXkgcGFzcyBhbnlcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBpdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IGludGVydmFsKDEwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyaW9kPTBdIFRoZSBpbnRlcnZhbCBzaXplIGluIG1pbGxpc2Vjb25kcyAoYnkgZGVmYXVsdClcbiAqIG9yIHRoZSB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBieSB0aGUgc2NoZWR1bGVyJ3MgY2xvY2suXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLCBhbmQgcHJvdmlkaW5nIGEgbm90aW9uIG9mIFwidGltZVwiLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgc2VxdWVudGlhbCBudW1iZXIgZWFjaCB0aW1lXG4gKiBpbnRlcnZhbC5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaW50ZXJ2YWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbChwZXJpb2QgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgaWYgKCFpc051bWVyaWMocGVyaW9kKSB8fCBwZXJpb2QgPCAwKSB7XG4gICAgcGVyaW9kID0gMDtcbiAgfVxuXG4gIGlmICghc2NoZWR1bGVyIHx8IHR5cGVvZiBzY2hlZHVsZXIuc2NoZWR1bGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIHN1YnNjcmliZXIuYWRkKFxuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCBwZXJpb2QsIHsgc3Vic2NyaWJlciwgY291bnRlcjogMCwgcGVyaW9kIH0pXG4gICAgKTtcbiAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxJbnRlcnZhbFN0YXRlPiwgc3RhdGU6IEludGVydmFsU3RhdGUpIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb3VudGVyLCBwZXJpb2QgfSA9IHN0YXRlO1xuICBzdWJzY3JpYmVyLm5leHQoY291bnRlcik7XG4gIHRoaXMuc2NoZWR1bGUoeyBzdWJzY3JpYmVyLCBjb3VudGVyOiBjb3VudGVyICsgMSwgcGVyaW9kIH0sIHBlcmlvZCk7XG59XG5cbmludGVyZmFjZSBJbnRlcnZhbFN0YXRlIHtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+O1xuICBjb3VudGVyOiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWVyZ2VBbGwnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPiguLi5vYnNlcnZhYmxlczogKE9ic2VydmFibGVJbnB1dDxUPiB8IFNjaGVkdWxlckxpa2UgfCBudW1iZXIpW10pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFI+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlIHwgbnVtYmVyKVtdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKipcbiAqIENyZWF0ZXMgYW4gb3V0cHV0IE9ic2VydmFibGUgd2hpY2ggY29uY3VycmVudGx5IGVtaXRzIGFsbCB2YWx1ZXMgZnJvbSBldmVyeVxuICogZ2l2ZW4gaW5wdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIgYnkgYmxlbmRpbmdcbiAqIHRoZWlyIHZhbHVlcyBpbnRvIG9uZSBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10obWVyZ2UucG5nKVxuICpcbiAqIGBtZXJnZWAgc3Vic2NyaWJlcyB0byBlYWNoIGdpdmVuIGlucHV0IE9ic2VydmFibGUgKGFzIGFyZ3VtZW50cyksIGFuZCBzaW1wbHlcbiAqIGZvcndhcmRzICh3aXRob3V0IGRvaW5nIGFueSB0cmFuc2Zvcm1hdGlvbikgYWxsIHRoZSB2YWx1ZXMgZnJvbSBhbGwgdGhlIGlucHV0XG4gKiBPYnNlcnZhYmxlcyB0byB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvbmx5IGNvbXBsZXRlc1xuICogb25jZSBhbGwgaW5wdXQgT2JzZXJ2YWJsZXMgaGF2ZSBjb21wbGV0ZWQuIEFueSBlcnJvciBkZWxpdmVyZWQgYnkgYW4gaW5wdXRcbiAqIE9ic2VydmFibGUgd2lsbCBiZSBpbW1lZGlhdGVseSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIE1lcmdlIHRvZ2V0aGVyIHR3byBPYnNlcnZhYmxlczogMXMgaW50ZXJ2YWwgYW5kIGNsaWNrc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBjbGlja3NPclRpbWVyID0gbWVyZ2UoY2xpY2tzLCB0aW1lcik7XG4gKiBjbGlja3NPclRpbWVyLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyB0aW1lciB3aWxsIGVtaXQgYXNjZW5kaW5nIHZhbHVlcywgb25lIGV2ZXJ5IHNlY29uZCgxMDAwbXMpIHRvIGNvbnNvbGVcbiAqIC8vIGNsaWNrcyBsb2dzIE1vdXNlRXZlbnRzIHRvIGNvbnNvbGUgZXZlcnl0aW1lIHRoZSBcImRvY3VtZW50XCIgaXMgY2xpY2tlZFxuICogLy8gU2luY2UgdGhlIHR3byBzdHJlYW1zIGFyZSBtZXJnZWQgeW91IHNlZSB0aGVzZSBoYXBwZW5pbmdcbiAqIC8vIGFzIHRoZXkgb2NjdXIuXG4gKiBgYGBcbiAqXG4gKiAjIyMgTWVyZ2UgdG9nZXRoZXIgMyBPYnNlcnZhYmxlcywgYnV0IG9ubHkgMiBydW4gY29uY3VycmVudGx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lcjEgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHRpbWVyMiA9IGludGVydmFsKDIwMDApLnBpcGUodGFrZSg2KSk7XG4gKiBjb25zdCB0aW1lcjMgPSBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgY29uY3VycmVudCA9IDI7IC8vIHRoZSBhcmd1bWVudFxuICogY29uc3QgbWVyZ2VkID0gbWVyZ2UodGltZXIxLCB0aW1lcjIsIHRpbWVyMywgY29uY3VycmVudCk7XG4gKiBtZXJnZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIC0gRmlyc3QgdGltZXIxIGFuZCB0aW1lcjIgd2lsbCBydW4gY29uY3VycmVudGx5XG4gKiAvLyAtIHRpbWVyMSB3aWxsIGVtaXQgYSB2YWx1ZSBldmVyeSAxMDAwbXMgZm9yIDEwIGl0ZXJhdGlvbnNcbiAqIC8vIC0gdGltZXIyIHdpbGwgZW1pdCBhIHZhbHVlIGV2ZXJ5IDIwMDBtcyBmb3IgNiBpdGVyYXRpb25zXG4gKiAvLyAtIGFmdGVyIHRpbWVyMSBoaXRzIGl0J3MgbWF4IGl0ZXJhdGlvbiwgdGltZXIyIHdpbGxcbiAqIC8vICAgY29udGludWUsIGFuZCB0aW1lcjMgd2lsbCBzdGFydCB0byBydW4gY29uY3VycmVudGx5IHdpdGggdGltZXIyXG4gKiAvLyAtIHdoZW4gdGltZXIyIGhpdHMgaXQncyBtYXggaXRlcmF0aW9uIGl0IHRlcm1pbmF0ZXMsIGFuZFxuICogLy8gICB0aW1lcjMgd2lsbCBjb250aW51ZSB0byBlbWl0IGEgdmFsdWUgZXZlcnkgNTAwbXMgdW50aWwgaXQgaXMgY29tcGxldGVcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlcyBJbnB1dCBPYnNlcnZhYmxlcyB0byBtZXJnZSB0b2dldGhlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlucHV0XG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3IgbWFuYWdpbmdcbiAqIGNvbmN1cnJlbmN5IG9mIGlucHV0IE9ic2VydmFibGVzLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIHRoYXQgYXJlIHRoZSByZXN1bHQgb2ZcbiAqIGV2ZXJ5IGlucHV0IE9ic2VydmFibGUuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIG1lcmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgU2NoZWR1bGVyTGlrZSB8IG51bWJlcj4pOiBPYnNlcnZhYmxlPFI+IHtcbiBsZXQgY29uY3VycmVudCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiBsZXQgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gbnVsbDtcbiAgbGV0IGxhc3Q6IGFueSA9IG9ic2VydmFibGVzW29ic2VydmFibGVzLmxlbmd0aCAtIDFdO1xuICBpZiAoaXNTY2hlZHVsZXIobGFzdCkpIHtcbiAgICBzY2hlZHVsZXIgPSA8U2NoZWR1bGVyTGlrZT5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID4gMSAmJiB0eXBlb2Ygb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV0gPT09ICdudW1iZXInKSB7XG4gICAgICBjb25jdXJyZW50ID0gPG51bWJlcj5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGxhc3QgPT09ICdudW1iZXInKSB7XG4gICAgY29uY3VycmVudCA9IDxudW1iZXI+b2JzZXJ2YWJsZXMucG9wKCk7XG4gIH1cblxuICBpZiAoc2NoZWR1bGVyID09PSBudWxsICYmIG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSAmJiBvYnNlcnZhYmxlc1swXSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8Uj4+b2JzZXJ2YWJsZXNbMF07XG4gIH1cblxuICByZXR1cm4gbWVyZ2VBbGw8Uj4oY29uY3VycmVudCkoZnJvbUFycmF5PGFueT4ob2JzZXJ2YWJsZXMsIHNjaGVkdWxlcikpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgbmV2ZXIgY29tcGxldGVzLlxuICpcbiAqICFbXShuZXZlci5wbmcpXG4gKlxuICogQSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5laXRoZXIgdmFsdWVzIG5vciBlcnJvcnMgbm9yIHRoZSBjb21wbGV0aW9uXG4gKiBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9yIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMuIFBsZWFzZSBub3RlIHRoYXQgYnkgbmV2ZXIgZW1pdHRpbmcgYSBjb21wbGV0ZSBub3RpZmljYXRpb24sIHRoaXNcbiAqIE9ic2VydmFibGUga2VlcHMgdGhlIHN1YnNjcmlwdGlvbiBmcm9tIGJlaW5nIGRpc3Bvc2VkIGF1dG9tYXRpY2FsbHkuXG4gKiBTdWJzY3JpcHRpb25zIG5lZWQgdG8gYmUgbWFudWFsbHkgZGlzcG9zZWQuXG4gKlxuICogIyMgIEV4YW1wbGVcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBuZXZlciBlbWl0IGFueXRoaW5nIGVsc2UgKG5vdCBldmVuIGNvbXBsZXRlKVxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gaW5mbygpIHtcbiAqICAgY29uc29sZS5sb2coJ1dpbGwgbm90IGJlIGNhbGxlZCcpO1xuICogfVxuICogY29uc3QgcmVzdWx0ID0gTkVWRVIucGlwZShzdGFydFdpdGgoNykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBpbmZvLCBpbmZvKTtcbiAqXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgaW5kZXgvRU1QVFl9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKi9cbmV4cG9ydCBjb25zdCBORVZFUiA9IG5ldyBPYnNlcnZhYmxlPG5ldmVyPihub29wKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHVzaW5nIE5FVkVSIGNvbnN0YW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV2ZXIgKCkge1xuICByZXR1cm4gTkVWRVI7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8Uj4odjogT2JzZXJ2YWJsZUlucHV0PFI+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBUNCwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBUNCwgVDUsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBUNSwgVDYsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSk6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFdoZW4gYW55IG9mIHRoZSBwcm92aWRlZCBPYnNlcnZhYmxlIGVtaXRzIGFuIGNvbXBsZXRlIG9yIGVycm9yIG5vdGlmaWNhdGlvbiwgaXQgaW1tZWRpYXRlbHkgc3Vic2NyaWJlcyB0byB0aGUgbmV4dCBvbmVcbiAqIHRoYXQgd2FzIHBhc3NlZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RXhlY3V0ZSBzZXJpZXMgb2YgT2JzZXJ2YWJsZXMgbm8gbWF0dGVyIHdoYXQsIGV2ZW4gaWYgaXQgbWVhbnMgc3dhbGxvd2luZyBlcnJvcnMuPC9zcGFuPlxuICpcbiAqICFbXShvbkVycm9yUmVzdW1lTmV4dC5wbmcpXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBXaWxsIHN1YnNjcmliZSB0byBlYWNoIG9ic2VydmFibGUgc291cmNlIGl0IGlzIHByb3ZpZGVkLCBpbiBvcmRlci5cbiAqIElmIHRoZSBzb3VyY2UgaXQncyBzdWJzY3JpYmVkIHRvIGVtaXRzIGFuIGVycm9yIG9yIGNvbXBsZXRlcywgaXQgd2lsbCBtb3ZlIHRvIHRoZSBuZXh0IHNvdXJjZVxuICogd2l0aG91dCBlcnJvci5cbiAqXG4gKiBJZiBgb25FcnJvclJlc3VtZU5leHRgIGlzIHByb3ZpZGVkIG5vIGFyZ3VtZW50cywgb3IgYSBzaW5nbGUsIGVtcHR5IGFycmF5LCBpdCB3aWxsIHJldHVybiB7QGxpbmsgaW5kZXgvRU1QVFl9LlxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgYmFzaWNhbGx5IHtAbGluayBjb25jYXR9LCBvbmx5IGl0IHdpbGwgY29udGludWUsIGV2ZW4gaWYgb25lIG9mIGl0c1xuICogc291cmNlcyBlbWl0cyBhbiBlcnJvci5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlcmUgaXMgbm8gd2F5IHRvIGhhbmRsZSBhbnkgZXJyb3JzIHRocm93biBieSBzb3VyY2VzIHZpYSB0aGUgcmVzdXVsdCBvZlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YC4gSWYgeW91IHdhbnQgdG8gaGFuZGxlIGVycm9ycyB0aHJvd24gaW4gYW55IGdpdmVuIHNvdXJjZSwgeW91IGNhblxuICogYWx3YXlzIHVzZSB0aGUge0BsaW5rIGNhdGNoRXJyb3J9IG9wZXJhdG9yIG9uIHRoZW0gYmVmb3JlIHBhc3NpbmcgdGhlbSBpbnRvIGBvbkVycm9yUmVzdW1lTmV4dGAuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU3Vic2NyaWJlIHRvIHRoZSBuZXh0IE9ic2VydmFibGUgYWZ0ZXIgbWFwIGZhaWxzPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgb25FcnJvclJlc3VtZU5leHQsIG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogb25FcnJvclJlc3VtZU5leHQoXG4gKiAgb2YoMSwgMiwgMywgMCkucGlwZShcbiAqICAgIG1hcCh4ID0+IHtcbiAqICAgICAgaWYgKHggPT09IDApIHRocm93IEVycm9yKCk7XG4gKiAgICAgIHJldHVybiAxMCAvIHg7XG4gKiAgICB9KVxuICogICksXG4gKiAgb2YoMSwgMiwgMyksXG4gKiApXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWwgPT4gY29uc29sZS5sb2codmFsKSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksICAgICAgICAgIC8vIFdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICAoKSA9PiBjb25zb2xlLmxvZygnZG9uZScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMTBcbiAqIC8vIDVcbiAqIC8vIDMuMzMzMzMzMzMzMzMzMzMzNVxuICogLy8gMVxuICogLy8gMlxuICogLy8gM1xuICogLy8gXCJkb25lXCJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbmNhdH1cbiAqIEBzZWUge0BsaW5rIGNhdGNoRXJyb3J9XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IHNvdXJjZXMgT2JzZXJ2YWJsZXMgKG9yIGFueXRoaW5nIHRoYXQgKmlzKiBvYnNlcnZhYmxlKSBwYXNzZWQgZWl0aGVyIGRpcmVjdGx5IG9yIGFzIGFuIGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGNvbmNhdGVuYXRlcyBhbGwgc291cmNlcywgb25lIGFmdGVyIHRoZSBvdGhlcixcbiAqIGlnbm9yaW5nIGFsbCBlcnJvcnMsIHN1Y2ggdGhhdCBhbnkgZXJyb3IgY2F1c2VzIGl0IHRvIG1vdmUgb24gdG8gdGhlIG5leHQgc291cmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgUj4oLi4uc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPiB7XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgY29uc3QgWyBmaXJzdCwgLi4ucmVtYWluZGVyIF0gPSBzb3VyY2VzO1xuXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGZpcnN0KSkge1xuICAgIHJldHVybiBvbkVycm9yUmVzdW1lTmV4dCguLi5maXJzdCk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3Qgc3ViTmV4dCA9ICgpID0+IHN1YnNjcmliZXIuYWRkKFxuICAgICAgb25FcnJvclJlc3VtZU5leHQoLi4ucmVtYWluZGVyKS5zdWJzY3JpYmUoc3Vic2NyaWJlcilcbiAgICApO1xuXG4gICAgcmV0dXJuIGZyb20oZmlyc3QpLnN1YnNjcmliZSh7XG4gICAgICBuZXh0KHZhbHVlKSB7IHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7IH0sXG4gICAgICBlcnJvcjogc3ViTmV4dCxcbiAgICAgIGNvbXBsZXRlOiBzdWJOZXh0LFxuICAgIH0pO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogQ29udmVydCBhbiBvYmplY3QgaW50byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIFtrZXksIHZhbHVlXSBwYWlyc1xuICogdXNpbmcgYW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIGVudW1lcmF0ZSB0aGUgb2JqZWN0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbnZlcnRzIGEgamF2YXNjcmlwdCBvYmplY3QgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JqID0ge1xuICogICBmb286IDQyLFxuICogICBiYXI6IDU2LFxuICogICBiYXo6IDc4LFxuICogfTtcbiAqXG4gKiBjb25zdCBzb3VyY2UgPSBwYWlycyhvYmopO1xuICpcbiAqIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoXG4gKiAgIHggPT4gY29uc29sZS5sb2coJ05leHQ6ICVzJywgeCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnRXJyb3I6ICVzJywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ0NvbXBsZXRlZCcpLFxuICogKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBpbnNwZWN0IGFuZCB0dXJuIGludG8gYW5cbiAqIE9ic2VydmFibGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEFuIG9wdGlvbmFsIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBydW4gdGhlXG4gKiBlbnVtZXJhdGlvbiBvZiB0aGUgaW5wdXQgc2VxdWVuY2Ugb24uXG4gKiBAcmV0dXJucyB7KE9ic2VydmFibGU8W3N0cmluZywgVF0+KX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZlxuICogW2tleSwgdmFsdWVdIHBhaXJzIGZyb20gdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJzPFQ+KG9iajogT2JqZWN0LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGggJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KFtrZXksIG9ialtrZXldXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8W3N0cmluZywgVF0+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICBzY2hlZHVsZXIuc2NoZWR1bGU8eyBrZXlzOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbc3RyaW5nLCBUXT4sIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uLCBvYmo6IE9iamVjdCB9PlxuICAgICAgICAgIChkaXNwYXRjaCwgMCwgeyBrZXlzLCBpbmRleDogMCwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSkpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9KTtcbiAgfVxufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsga2V5czogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W3N0cmluZywgVF0+LCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiwgb2JqOiBPYmplY3QgfSkge1xuICBjb25zdCB7IGtleXMsIGluZGV4LCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9ID0gc3RhdGU7XG4gIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBzdWJzY3JpYmVyLm5leHQoW2tleSwgb2JqW2tleV1dKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQodGhpcy5zY2hlZHVsZSh7IGtleXMsIGluZGV4OiBpbmRleCArIDEsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIGZpcnN0IHNvdXJjZSBPYnNlcnZhYmxlIHRvIGVtaXQgYW4gaXRlbS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgU3Vic2NyaWJlcyB0byB0aGUgb2JzZXJ2YWJsZSB0aGF0IHdhcyB0aGUgZmlyc3QgdG8gc3RhcnQgZW1pdHRpbmcuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JzMSA9IGludGVydmFsKDEwMDApLnBpcGUobWFwVG8oJ2Zhc3Qgb25lJykpO1xuICogY29uc3Qgb2JzMiA9IGludGVydmFsKDMwMDApLnBpcGUobWFwVG8oJ21lZGl1bSBvbmUnKSk7XG4gKiBjb25zdCBvYnMzID0gaW50ZXJ2YWwoNTAwMCkucGlwZShtYXBUbygnc2xvdyBvbmUnKSk7XG4gKlxuICogcmFjZShvYnMzLCBvYnMxLCBvYnMyKVxuICogLnN1YnNjcmliZShcbiAqICAgd2lubmVyID0+IGNvbnNvbGUubG9nKHdpbm5lcilcbiAqICk7XG4gKlxuICogLy8gcmVzdWx0OlxuICogLy8gYSBzZXJpZXMgb2YgJ2Zhc3Qgb25lJ1xuICogYGBgXG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlc30gLi4ub2JzZXJ2YWJsZXMgc291cmNlcyB1c2VkIHRvIHJhY2UgZm9yIHdoaWNoIE9ic2VydmFibGUgZW1pdHMgZmlyc3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgb3V0cHV0IG9mIHRoZSBmaXJzdCBPYnNlcnZhYmxlIHRvIGVtaXQgYW4gaXRlbS5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFjZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4ob2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KG9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPGFueT4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPFQ+IHwgQXJyYXk8T2JzZXJ2YWJsZTxUPj4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPGFueT4gfCBBcnJheTxPYnNlcnZhYmxlPGFueT4+Pik6IE9ic2VydmFibGU8VD4ge1xuICAvLyBpZiB0aGUgb25seSBhcmd1bWVudCBpcyBhbiBhcnJheSwgaXQgd2FzIG1vc3QgbGlrZWx5IGNhbGxlZCB3aXRoXG4gIC8vIGByYWNlKFtvYnMxLCBvYnMyLCAuLi5dKWBcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChpc0FycmF5KG9ic2VydmFibGVzWzBdKSkge1xuICAgICAgb2JzZXJ2YWJsZXMgPSA8QXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pj5vYnNlcnZhYmxlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxPYnNlcnZhYmxlPGFueT4+b2JzZXJ2YWJsZXNbMF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZyb21BcnJheShvYnNlcnZhYmxlcywgdW5kZWZpbmVkKS5saWZ0KG5ldyBSYWNlT3BlcmF0b3I8VD4oKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBSYWNlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmFjZVN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgUmFjZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgVD4ge1xuICBwcml2YXRlIGhhc0ZpcnN0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dChvYnNlcnZhYmxlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZhYmxlcy5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICF0aGlzLmhhc0ZpcnN0OyBpKyspIHtcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBvYnNlcnZhYmxlc1tpXTtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG9ic2VydmFibGUsIG9ic2VydmFibGUgYXMgYW55LCBpKTtcblxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBULFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzRmlyc3QpIHtcbiAgICAgIHRoaXMuaGFzRmlyc3QgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSAhPT0gb3V0ZXJJbmRleCkge1xuICAgICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmlwdGlvbnNbaV07XG5cbiAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZShzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGlubmVyVmFsdWUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIHdpdGhpbiBhIHNwZWNpZmllZFxuICogcmFuZ2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGEgc2VxdWVuY2Ugb2YgbnVtYmVycyBpbiBhIHJhbmdlLjwvc3Bhbj5cbiAqXG4gKiAhW10ocmFuZ2UucG5nKVxuICpcbiAqIGByYW5nZWAgb3BlcmF0b3IgZW1pdHMgYSByYW5nZSBvZiBzZXF1ZW50aWFsIGludGVnZXJzLCBpbiBvcmRlciwgd2hlcmUgeW91XG4gKiBzZWxlY3QgdGhlIGBzdGFydGAgb2YgdGhlIHJhbmdlIGFuZCBpdHMgYGxlbmd0aGAuIEJ5IGRlZmF1bHQsIHVzZXMgbm9cbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSBhbmQganVzdCBkZWxpdmVycyB0aGUgbm90aWZpY2F0aW9ucyBzeW5jaHJvbm91c2x5LCBidXQgbWF5IHVzZVxuICogYW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHJlZ3VsYXRlIHRob3NlIGRlbGl2ZXJpZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdHMgdGhlIG51bWJlcnMgMSB0byAxMDwvY2FwdGlvbj5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSByYW5nZSgxLCAxMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgdGltZXJ9XG4gKiBAc2VlIHtAbGluayBpbmRleC9pbnRlcnZhbH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgaW50ZWdlciBpbiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvdW50PTBdIFRoZSBudW1iZXIgb2Ygc2VxdWVudGlhbCBpbnRlZ2VycyB0byBnZW5lcmF0ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBub3RpZmljYXRpb25zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBudW1iZXJzIHRoYXQgZW1pdHMgYSBmaW5pdGUgcmFuZ2Ugb2ZcbiAqIHNlcXVlbnRpYWwgaW50ZWdlcnMuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHJhbmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnQgPSBzdGFydDtcblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgaW5kZXgsIGNvdW50LCBzdGFydCwgc3Vic2NyaWJlclxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGluZGV4KysgPj0gY291bnQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGN1cnJlbnQrKyk7XG4gICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGNvbnN0IHsgc3RhcnQsIGluZGV4LCBjb3VudCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG5cbiAgaWYgKGluZGV4ID49IGNvdW50KSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN1YnNjcmliZXIubmV4dChzdGFydCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHN0YXRlLnN0YXJ0ID0gc3RhcnQgKyAxO1xuXG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBzdGFydHMgZW1pdHRpbmcgYWZ0ZXIgYW4gYGluaXRpYWxEZWxheWAgYW5kXG4gKiBlbWl0cyBldmVyIGluY3JlYXNpbmcgbnVtYmVycyBhZnRlciBlYWNoIGBwZXJpb2RgIG9mIHRpbWUgdGhlcmVhZnRlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXRzIGxpa2Uge0BsaW5rIGluZGV4L2ludGVydmFsfSwgYnV0IHlvdSBjYW4gc3BlY2lmeSB3aGVuXG4gKiBzaG91bGQgdGhlIGVtaXNzaW9ucyBzdGFydC48L3NwYW4+XG4gKlxuICogIVtdKHRpbWVyLnBuZylcbiAqXG4gKiBgdGltZXJgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mIGFzY2VuZGluZ1xuICogaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lLCBgcGVyaW9kYCBvZiB5b3VyIGNob29zaW5nXG4gKiBiZXR3ZWVuIHRob3NlIGVtaXNzaW9ucy4gVGhlIGZpcnN0IGVtaXNzaW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHNwZWNpZmllZFxuICogYGluaXRpYWxEZWxheWAuIFRoZSBpbml0aWFsIGRlbGF5IG1heSBiZSBhIGBEYXRlYC4gQnkgZGVmYXVsdCwgdGhpc1xuICogb3BlcmF0b3IgdXNlcyB0aGUge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcHJvdmlkZSBhIG5vdGlvbiBvZiB0aW1lLCBidXQgeW91XG4gKiBtYXkgcGFzcyBhbnkge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIGl0LiBJZiBgcGVyaW9kYCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlIGVtaXRzIG9ubHkgb25lIHZhbHVlLCBgMGAuIE90aGVyd2lzZSwgaXQgZW1pdHMgYW4gaW5maW5pdGVcbiAqIHNlcXVlbmNlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdHMgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQgKDEwMDBtcyksIHN0YXJ0aW5nIGFmdGVyIDMgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDMwMDAsIDEwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgRW1pdHMgb25lIG51bWJlciBhZnRlciBmaXZlIHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSB0aW1lcig1MDAwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayBpbmRleC9pbnRlcnZhbH1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfERhdGV9IFtkdWVUaW1lXSBUaGUgaW5pdGlhbCBkZWxheSB0aW1lIHRvIHdhaXQgYmVmb3JlXG4gKiBlbWl0dGluZyB0aGUgZmlyc3QgdmFsdWUgb2YgYDBgLlxuICogQHBhcmFtIHtudW1iZXJ8U2NoZWR1bGVyTGlrZX0gW3BlcmlvZE9yU2NoZWR1bGVyXSBUaGUgcGVyaW9kIG9mIHRpbWUgYmV0d2VlbiBlbWlzc2lvbnMgb2YgdGhlXG4gKiBzdWJzZXF1ZW50IG51bWJlcnMuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLCBhbmQgcHJvdmlkaW5nIGEgbm90aW9uIG9mIFwidGltZVwiLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgYDBgIGFmdGVyIHRoZVxuICogYGluaXRpYWxEZWxheWAgYW5kIGV2ZXIgaW5jcmVhc2luZyBudW1iZXJzIGFmdGVyIGVhY2ggYHBlcmlvZGAgb2YgdGltZVxuICogdGhlcmVhZnRlci5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgdGltZXJcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lcihkdWVUaW1lOiBudW1iZXIgfCBEYXRlID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBwZXJpb2RPclNjaGVkdWxlcj86IG51bWJlciB8IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIGxldCBwZXJpb2QgPSAtMTtcbiAgaWYgKGlzTnVtZXJpYyhwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBwZXJpb2QgPSBOdW1iZXIocGVyaW9kT3JTY2hlZHVsZXIpIDwgMSAmJiAxIHx8IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcik7XG4gIH0gZWxzZSBpZiAoaXNTY2hlZHVsZXIocGVyaW9kT3JTY2hlZHVsZXIpKSB7XG4gICAgc2NoZWR1bGVyID0gcGVyaW9kT3JTY2hlZHVsZXIgYXMgYW55O1xuICB9XG5cbiAgaWYgKCFpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgc2NoZWR1bGVyID0gYXN5bmM7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3QgZHVlID0gaXNOdW1lcmljKGR1ZVRpbWUpXG4gICAgICA/IChkdWVUaW1lIGFzIG51bWJlcilcbiAgICAgIDogKCtkdWVUaW1lIC0gc2NoZWR1bGVyLm5vdygpKTtcblxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIGR1ZSwge1xuICAgICAgaW5kZXg6IDAsIHBlcmlvZCwgc3Vic2NyaWJlclxuICAgIH0pO1xuICB9KTtcbn1cblxuaW50ZXJmYWNlIFRpbWVyU3RhdGUge1xuICBpbmRleDogbnVtYmVyO1xuICBwZXJpb2Q6IG51bWJlcjtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaCh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VGltZXJTdGF0ZT4sIHN0YXRlOiBUaW1lclN0YXRlKSB7XG4gIGNvbnN0IHsgaW5kZXgsIHBlcmlvZCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubmV4dChpbmRleCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9IGVsc2UgaWYgKHBlcmlvZCA9PT0gLTEpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUsIHBlcmlvZCk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBVbnN1YnNjcmliYWJsZSwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7IC8vIGZyb20gZnJvbSBmcm9tISBMQVdMXG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IHVzZXMgYSByZXNvdXJjZSB3aGljaCB3aWxsIGJlIGRpc3Bvc2VkIGF0IHRoZSBzYW1lIHRpbWUgYXMgdGhlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCB3aGVuIHlvdSBjYXRjaCB5b3Vyc2VsZiBjbGVhbmluZyB1cCBhZnRlciBhbiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgdXNpbmdgIGlzIGEgZmFjdG9yeSBvcGVyYXRvciwgd2hpY2ggYWNjZXB0cyB0d28gZnVuY3Rpb25zLiBGaXJzdCBmdW5jdGlvbiByZXR1cm5zIGEgZGlzcG9zYWJsZSByZXNvdXJjZS5cbiAqIEl0IGNhbiBiZSBhbiBhcmJpdHJhcnkgb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBgdW5zdWJzY3JpYmVgIG1ldGhvZC4gU2Vjb25kIGZ1bmN0aW9uIHdpbGwgYmUgaW5qZWN0ZWQgd2l0aFxuICogdGhhdCBvYmplY3QgYW5kIHNob3VsZCByZXR1cm4gYW4gT2JzZXJ2YWJsZS4gVGhhdCBPYnNlcnZhYmxlIGNhbiB1c2UgcmVzb3VyY2Ugb2JqZWN0IGR1cmluZyBpdHMgZXhlY3V0aW9uLlxuICogQm90aCBmdW5jdGlvbnMgcGFzc2VkIHRvIGB1c2luZ2Agd2lsbCBiZSBjYWxsZWQgZXZlcnkgdGltZSBzb21lb25lIHN1YnNjcmliZXMgLSBuZWl0aGVyIGFuIE9ic2VydmFibGUgbm9yXG4gKiByZXNvdXJjZSBvYmplY3Qgd2lsbCBiZSBzaGFyZWQgaW4gYW55IHdheSBiZXR3ZWVuIHN1YnNjcmlwdGlvbnMuXG4gKlxuICogV2hlbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGB1c2luZ2AgaXMgc3Vic2NyaWJlZCwgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tIHRoZSBzZWNvbmQgZnVuY3Rpb24gd2lsbCBiZSBzdWJzY3JpYmVkXG4gKiBhcyB3ZWxsLiBBbGwgaXRzIG5vdGlmaWNhdGlvbnMgKG5leHRlZCB2YWx1ZXMsIGNvbXBsZXRpb24gYW5kIGVycm9yIGV2ZW50cykgd2lsbCBiZSBlbWl0dGVkIHVuY2hhbmdlZCBieSB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLiBJZiBob3dldmVyIHNvbWVvbmUgdW5zdWJzY3JpYmVzIGZyb20gdGhlIE9ic2VydmFibGUgb3Igc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIG9yIGVycm9ycyBieSBpdHNlbGYsXG4gKiB0aGUgYHVuc3Vic2NyaWJlYCBtZXRob2Qgb24gcmVzb3VyY2Ugb2JqZWN0IHdpbGwgYmUgY2FsbGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGRvIGFueSBuZWNlc3NhcnkgY2xlYW4gdXAsIHdoaWNoXG4gKiBvdGhlcndpc2Ugd291bGQgaGF2ZSB0byBiZSBoYW5kbGVkIGJ5IGhhbmQuIE5vdGUgdGhhdCBjb21wbGV0ZSBvciBlcnJvciBub3RpZmljYXRpb25zIGFyZSBub3QgZW1pdHRlZCB3aGVuIHNvbWVvbmVcbiAqIGNhbmNlbHMgc3Vic2NyaXB0aW9uIHRvIGFuIE9ic2VydmFibGUgdmlhIGB1bnN1YnNjcmliZWAsIHNvIGB1c2luZ2AgY2FuIGJlIHVzZWQgYXMgYSBob29rLCBhbGxvd2luZyB5b3UgdG8gbWFrZVxuICogc3VyZSB0aGF0IGFsbCByZXNvdXJjZXMgd2hpY2ggbmVlZCB0byBleGlzdCBkdXJpbmcgYW4gT2JzZXJ2YWJsZSBleGVjdXRpb24gd2lsbCBiZSBkaXNwb3NlZCBhdCBhcHByb3ByaWF0ZSB0aW1lLlxuICpcbiAqIEBzZWUge0BsaW5rIGRlZmVyfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogSVN1YnNjcmlwdGlvbn0gcmVzb3VyY2VGYWN0b3J5IEEgZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhbnkgcmVzb3VyY2Ugb2JqZWN0XG4gKiB0aGF0IGltcGxlbWVudHMgYHVuc3Vic2NyaWJlYCBtZXRob2QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHJlc291cmNlOiBJU3Vic2NyaXB0aW9uKTogT2JzZXJ2YWJsZTxUPn0gb2JzZXJ2YWJsZUZhY3RvcnkgQSBmdW5jdGlvbiB3aGljaFxuICogY3JlYXRlcyBhbiBPYnNlcnZhYmxlLCB0aGF0IGNhbiB1c2UgaW5qZWN0ZWQgcmVzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGJlaGF2ZXMgdGhlIHNhbWUgYXMgT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgb2JzZXJ2YWJsZUZhY3RvcnlgLCBidXRcbiAqIHdoaWNoIC0gd2hlbiBjb21wbGV0ZWQsIGVycm9yZWQgb3IgdW5zdWJzY3JpYmVkIC0gd2lsbCBhbHNvIGNhbGwgYHVuc3Vic2NyaWJlYCBvbiBjcmVhdGVkIHJlc291cmNlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nPFQ+KHJlc291cmNlRmFjdG9yeTogKCkgPT4gVW5zdWJzY3JpYmFibGUgfCB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmFibGVGYWN0b3J5OiAocmVzb3VyY2U6IFVuc3Vic2NyaWJhYmxlIHwgdm9pZCkgPT4gT2JzZXJ2YWJsZUlucHV0PFQ+IHwgdm9pZCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IHJlc291cmNlOiBVbnN1YnNjcmliYWJsZSB8IHZvaWQ7XG5cbiAgICB0cnkge1xuICAgICAgcmVzb3VyY2UgPSByZXNvdXJjZUZhY3RvcnkoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFQ+IHwgdm9pZDtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gb2JzZXJ2YWJsZUZhY3RvcnkocmVzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSByZXN1bHQgPyBmcm9tKHJlc3VsdCkgOiBFTVBUWTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgICByZXNvdXJjZS51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgUGFydGlhbE9ic2VydmVyIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJuYWwvc3ltYm9sL2l0ZXJhdG9yJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBUKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMykgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUsIHY2OiBUNikgPT4gUik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+KTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxUPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSwgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCAoKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb21iaW5lcyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0byBjcmVhdGUgYW4gT2JzZXJ2YWJsZSB3aG9zZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgdmFsdWVzLCBpbiBvcmRlciwgb2YgZWFjaFxuICogb2YgaXRzIGlucHV0IE9ic2VydmFibGVzLlxuICpcbiAqIElmIHRoZSBsYXRlc3QgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb24sIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjb21wdXRlIHRoZSBjcmVhdGVkIHZhbHVlIGZyb20gdGhlIGlucHV0IHZhbHVlcy5cbiAqIE90aGVyd2lzZSwgYW4gYXJyYXkgb2YgdGhlIGlucHV0IHZhbHVlcyBpcyByZXR1cm5lZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb21iaW5lIGFnZSBhbmQgbmFtZSBmcm9tIGRpZmZlcmVudCBzb3VyY2VzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgYWdlJCA9IG9mPG51bWJlcj4oMjcsIDI1LCAyOSk7XG4gKiBsZXQgbmFtZSQgPSBvZjxzdHJpbmc+KCdGb28nLCAnQmFyJywgJ0JlZXInKTtcbiAqIGxldCBpc0RldiQgPSBvZjxib29sZWFuPih0cnVlLCB0cnVlLCBmYWxzZSk7XG4gKlxuICogemlwKGFnZSQsIG5hbWUkLCBpc0RldiQpLnBpcGUoXG4gKiAgIG1hcCgoYWdlOiBudW1iZXIsIG5hbWU6IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pID0+ICh7IGFnZSwgbmFtZSwgaXNEZXYgfSkpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBvdXRwdXRzXG4gKiAvLyB7IGFnZTogMjcsIG5hbWU6ICdGb28nLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjUsIG5hbWU6ICdCYXInLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjksIG5hbWU6ICdCZWVyJywgaXNEZXY6IGZhbHNlIH1cbiAqIGBgYFxuICogQHBhcmFtIG9ic2VydmFibGVzXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fVxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB6aXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj4ge1xuICBjb25zdCByZXN1bHRTZWxlY3RvciA9IDwoKC4uLnlzOiBBcnJheTxhbnk+KSA9PiBSKT4gb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV07XG4gIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCB1bmRlZmluZWQpLmxpZnQobmV3IFppcE9wZXJhdG9yKHJlc3VsdFNlbGVjdG9yKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBaaXBPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcblxuICByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUjtcblxuICBjb25zdHJ1Y3RvcihyZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3I7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgWmlwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlc3VsdFNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBaaXBTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgdmFsdWVzOiBhbnk7XG4gIHByaXZhdGUgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFI7XG4gIHByaXZhdGUgaXRlcmF0b3JzOiBMb29rQWhlYWRJdGVyYXRvcjxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBhY3RpdmUgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIsXG4gICAgICAgICAgICAgIHZhbHVlczogYW55ID0gT2JqZWN0LmNyZWF0ZShudWxsKSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdG9yID0gKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykgPyByZXN1bHRTZWxlY3RvciA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFN0YXRpY0FycmF5SXRlcmF0b3IodmFsdWUpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgU3RhdGljSXRlcmF0b3IodmFsdWVbU3ltYm9sX2l0ZXJhdG9yXSgpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBaaXBCdWZmZXJJdGVyYXRvcih0aGlzLmRlc3RpbmF0aW9uLCB0aGlzLCB2YWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgY29uc3QgbGVuID0gaXRlcmF0b3JzLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2ZSA9IGxlbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3I6IFppcEJ1ZmZlckl0ZXJhdG9yPGFueSwgYW55PiA9IDxhbnk+aXRlcmF0b3JzW2ldO1xuICAgICAgaWYgKGl0ZXJhdG9yLnN0aWxsVW5zdWJzY3JpYmVkKSB7XG4gICAgICAgIHRoaXMuYWRkKGl0ZXJhdG9yLnN1YnNjcmliZShpdGVyYXRvciwgaSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmUtLTsgLy8gbm90IGFuIG9ic2VydmFibGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlJbmFjdGl2ZSgpIHtcbiAgICB0aGlzLmFjdGl2ZS0tO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSXRlcmF0b3JzKCkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGNvbnN0IGxlbiA9IGl0ZXJhdG9ycy5sZW5ndGg7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgLy8gYWJvcnQgaWYgbm90IGFsbCBvZiB0aGVtIGhhdmUgdmFsdWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGl0ZXJhdG9yID0gaXRlcmF0b3JzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvci5oYXNWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiAhaXRlcmF0b3IuaGFzVmFsdWUoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHNob3VsZENvbXBsZXRlID0gZmFsc2U7XG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3IgPSBpdGVyYXRvcnNbaV07XG4gICAgICBsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyBjb21wbGV0ZWQgbm93IHRoYXQgeW91J3ZlIGdvdHRlblxuICAgICAgLy8gdGhlIG5leHQgdmFsdWUuXG4gICAgICBpZiAoaXRlcmF0b3IuaGFzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgc2hvdWxkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcmdzLnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXN1bHRTZWxlY3Rvcikge1xuICAgICAgdGhpcy5fdHJ5cmVzdWx0U2VsZWN0b3IoYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQoYXJncyk7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZENvbXBsZXRlKSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJ5cmVzdWx0U2VsZWN0b3IoYXJnczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0U2VsZWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG5cbmludGVyZmFjZSBMb29rQWhlYWRJdGVyYXRvcjxUPiBleHRlbmRzIEl0ZXJhdG9yPFQ+IHtcbiAgaGFzVmFsdWUoKTogYm9vbGVhbjtcbiAgaGFzQ29tcGxldGVkKCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIFN0YXRpY0l0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIG5leHRSZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KSB7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLm5leHRSZXN1bHQ7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICBjb25zdCBuZXh0UmVzdWx0ID0gdGhpcy5uZXh0UmVzdWx0O1xuICAgIHJldHVybiBuZXh0UmVzdWx0ICYmIG5leHRSZXN1bHQuZG9uZTtcbiAgfVxufVxuXG5jbGFzcyBTdGF0aWNBcnJheUl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIGluZGV4ID0gMDtcbiAgcHJpdmF0ZSBsZW5ndGggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXJyYXk6IFRbXSkge1xuICAgIHRoaXMubGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgW1N5bWJvbF9pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGkgPSB0aGlzLmluZGV4Kys7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIHJldHVybiBpIDwgdGhpcy5sZW5ndGggPyB7IHZhbHVlOiBhcnJheVtpXSwgZG9uZTogZmFsc2UgfSA6IHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aCA+IHRoaXMuaW5kZXg7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoID09PSB0aGlzLmluZGV4O1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBaaXBCdWZmZXJJdGVyYXRvcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiBpbXBsZW1lbnRzIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IHtcbiAgc3RpbGxVbnN1YnNjcmliZWQgPSB0cnVlO1xuICBidWZmZXI6IFRbXSA9IFtdO1xuICBpc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFBhcnRpYWxPYnNlcnZlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IFppcFN1YnNjcmliZXI8VCwgUj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIFtTeW1ib2xfaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gTk9URTogdGhlcmUgaXMgYWN0dWFsbHkgYSBuYW1lIGNvbGxpc2lvbiBoZXJlIHdpdGggU3Vic2NyaWJlci5uZXh0IGFuZCBJdGVyYXRvci5uZXh0XG4gIC8vICAgIHRoaXMgaXMgbGVnaXQgYmVjYXVzZSBgbmV4dCgpYCB3aWxsIG5ldmVyIGJlIGNhbGxlZCBieSBhIHN1YnNjcmlwdGlvbiBpbiB0aGlzIGNhc2UuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwICYmIHRoaXMuaXNDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IGJ1ZmZlci5zaGlmdCgpLCBkb25lOiBmYWxzZSB9O1xuICAgIH1cbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPiAwO1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0NvbXBsZXRlO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICB0aGlzLnBhcmVudC5ub3RpZnlJbmFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuYnVmZmVyLnB1c2goaW5uZXJWYWx1ZSk7XG4gICAgdGhpcy5wYXJlbnQuY2hlY2tJdGVyYXRvcnMoKTtcbiAgfVxuXG4gIHN1YnNjcmliZSh2YWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUmVzdWx0PGFueSwgYW55Pih0aGlzLCB0aGlzLm9ic2VydmFibGUsIHRoaXMsIGluZGV4KTtcbiAgfVxufVxuIiwiLyogT2JzZXJ2YWJsZSAqL1xuZXhwb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XG5leHBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmV4cG9ydCB7IEdyb3VwZWRPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9vcGVyYXRvcnMvZ3JvdXBCeSc7XG5leHBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vaW50ZXJuYWwvT3BlcmF0b3InO1xuZXhwb3J0IHsgb2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvc3ltYm9sL29ic2VydmFibGUnO1xuXG4vKiBTdWJqZWN0cyAqL1xuZXhwb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvU3ViamVjdCc7XG5leHBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICcuL2ludGVybmFsL0JlaGF2aW9yU3ViamVjdCc7XG5leHBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi9pbnRlcm5hbC9SZXBsYXlTdWJqZWN0JztcbmV4cG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvQXN5bmNTdWJqZWN0JztcblxuLyogU2NoZWR1bGVycyAqL1xuZXhwb3J0IHsgYXNhcCBhcyBhc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvYXNhcCc7XG5leHBvcnQgeyBhc3luYyBhcyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL2FzeW5jJztcbmV4cG9ydCB7IHF1ZXVlIGFzIHF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvcXVldWUnO1xuZXhwb3J0IHsgYW5pbWF0aW9uRnJhbWUgYXMgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZSc7XG5leHBvcnQgeyBWaXJ0dWFsVGltZVNjaGVkdWxlciwgVmlydHVhbEFjdGlvbiB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL1ZpcnR1YWxUaW1lU2NoZWR1bGVyJztcbmV4cG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvU2NoZWR1bGVyJztcblxuLyogU3Vic2NyaXB0aW9uICovXG5leHBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL2ludGVybmFsL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9pbnRlcm5hbC9TdWJzY3JpYmVyJztcblxuLyogTm90aWZpY2F0aW9uICovXG5leHBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuL2ludGVybmFsL05vdGlmaWNhdGlvbic7XG5cbi8qIFV0aWxzICovXG5leHBvcnQgeyBwaXBlIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL3BpcGUnO1xuZXhwb3J0IHsgbm9vcCB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9ub29wJztcbmV4cG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL2lkZW50aXR5JztcbmV4cG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9pc09ic2VydmFibGUnO1xuXG4vKiBFcnJvciB0eXBlcyAqL1xuZXhwb3J0IHsgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuZXhwb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9FbXB0eUVycm9yJztcbmV4cG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmV4cG9ydCB7IFVuc3Vic2NyaXB0aW9uRXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvcic7XG5leHBvcnQgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvVGltZW91dEVycm9yJztcblxuLyogU3RhdGljIG9ic2VydmFibGUgY3JlYXRpb24gZXhwb3J0cyAqL1xuZXhwb3J0IHsgYmluZENhbGxiYWNrIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmRDYWxsYmFjayc7XG5leHBvcnQgeyBiaW5kTm9kZUNhbGxiYWNrIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmROb2RlQ2FsbGJhY2snO1xuZXhwb3J0IHsgY29tYmluZUxhdGVzdCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0JztcbmV4cG9ydCB7IGNvbmNhdCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb25jYXQnO1xuZXhwb3J0IHsgZGVmZXIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZGVmZXInO1xuZXhwb3J0IHsgZW1wdHkgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZW1wdHknO1xuZXhwb3J0IHsgZm9ya0pvaW4gfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZm9ya0pvaW4nO1xuZXhwb3J0IHsgZnJvbSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tJztcbmV4cG9ydCB7IGZyb21FdmVudCB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnQnO1xuZXhwb3J0IHsgZnJvbUV2ZW50UGF0dGVybiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnRQYXR0ZXJuJztcbmV4cG9ydCB7IGdlbmVyYXRlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2dlbmVyYXRlJztcbmV4cG9ydCB7IGlpZiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYnO1xuZXhwb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvaW50ZXJ2YWwnO1xuZXhwb3J0IHsgbWVyZ2UgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvbWVyZ2UnO1xuZXhwb3J0IHsgbmV2ZXIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvbmV2ZXInO1xuZXhwb3J0IHsgb2YgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvb2YnO1xuZXhwb3J0IHsgb25FcnJvclJlc3VtZU5leHQgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvb25FcnJvclJlc3VtZU5leHQnO1xuZXhwb3J0IHsgcGFpcnMgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvcGFpcnMnO1xuZXhwb3J0IHsgcmFjZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9yYWNlJztcbmV4cG9ydCB7IHJhbmdlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlJztcbmV4cG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5leHBvcnQgeyB0aW1lciB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS90aW1lcic7XG5leHBvcnQgeyB1c2luZyB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS91c2luZyc7XG5leHBvcnQgeyB6aXAgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvemlwJztcblxuLyogQ29uc3RhbnRzICovXG5leHBvcnQgeyBFTVBUWSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9lbXB0eSc7XG5leHBvcnQgeyBORVZFUiB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9uZXZlcic7XG5cbi8qIFR5cGVzICovXG5leHBvcnQgKiBmcm9tICcuL2ludGVybmFsL3R5cGVzJztcblxuLyogQ29uZmlnICovXG5leHBvcnQgeyBjb25maWcgfSBmcm9tICcuL2ludGVybmFsL2NvbmZpZyc7XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zU2VydmljZSB7XG5cbiAgcHVibGljIHRvcGljOiBTdWJqZWN0PGFueT47XG4gIHB1YmxpYyBvYnNlcnZlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5pdE5vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIMOlwojCncOlwqfCi8OlwozCllxuICAgKi9cbiAgcHVibGljIGluaXROb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy50b3BpYyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IHRoaXMudG9waWMuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogw6jCjsK3w6XCj8KWw6jCp8KCw6XCr8Kfw6jCgMKFXG4gICAqL1xuICBwdWJsaWMgZ2V0Tm90aWZpY2F0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXI7XG4gIH1cblxuICAvKipcbiAgICogw6XCj8KRw6XCuMKDXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwdWJsaWMgcHVibGlzaChkYXRhOiB7XG4gICAgYWN0OiBzdHJpbmcsXG4gICAgZGF0YT86IGFueVxuICB9KTogdm9pZCB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMudG9waWMubmV4dChkYXRhKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZ3gtbm90aWZpY2F0aW9ucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHA+XG4gICAgICBuZ3gtbm90aWZpY2F0aW9ucyB3b3JrcyFcbiAgICA8L3A+XG4gIGAsXG4gIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW05neE5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsidHNsaWJfMS5fX2V4dGVuZHMiLCJvYnNlcnZhYmxlIiwiUmVmQ291bnRTdWJzY3JpYmVyIiwicmVmQ291bnQiLCJpdGVyYXRvciIsIlN5bWJvbF9pdGVyYXRvciIsIlN5bWJvbF9vYnNlcnZhYmxlIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7QUNBQTtBQU1BO0lBS1M7SUFVUDtRQUNFO1lBQ0U7WUFDQTs7Ozs7Ozs7UUFRRjs7Ozs7QUMzQko7NEJBQzJCOzs7O0FDTDNCO0FBQ0EsU0FHYztJQUNaLE1BQUE7SUFDQTs7WUFFSSxNQUFNOzs7Ozs7Ozs7O0FDVFo7OztBQ0FBO1NBQ2MsUUFBUTs7OztBQ0F0Qjs7O0FDREE7QUFFQSxBQUVBOztRQUVJOzs7O1FBR0Esa0JBQWtCOzs7O2lCQUtBO0lBQ3BCLGlCQUFzQjs7Ozs7QUNYeEIsSUFBeUMsK0NBQUs7SUFJNUNBOztZQUVPOztRQUpTO1FBTWIsTUFBYzs7Ozs7OztBQ1puQjtBQUNBLElBMkNFOztRQVZVLG1CQUE0QixDQUFDO1FBRTdCLG9CQUErQjtRQUVqQztRQU9OLElBQUk7WUFDSzs7Ozs7UUFhVCxJQUFJO1FBRUosSUFBSTtZQUNGOzs7UUFLRixJQUFJO1FBQ0osSUFBSSxDQUFDLGNBQWM7UUFDbkIsSUFBSSxDQUFDLGVBQWU7UUFHcEIsSUFBSSxDQUFDO1FBRUwsSUFBSTtRQUNKLElBQUk7UUFJSixPQUFPOztZQUlMLE9BQU8sYUFBYTs7O1lBSXBCO1lBQ0EsSUFBSSxLQUFLO2dCQUNQO2dCQUNBLFNBQVM7K0NBRXNCLENBQUMsYUFBYTs7OztZQU8vQyxRQUFRO1lBQ1I7WUFFQSxvQkFBb0I7MEJBQ047Z0JBQ1osSUFBSTtvQkFDRixTQUFTLEdBQUc7b0JBQ1osSUFBSSxLQUFLLGdCQUFnQjt3QkFDdkI7d0JBQ0EsU0FBUzt3QkFDVCxxQkFBcUIsQ0FBQzt3QkFDdEIsSUFBSSxHQUFHOzRCQUNMLGVBQWU7Ozs7Ozs7Ozs7WUFVdkI7Ozs7MEJBdUJnQix5QkFBeUI7WUFDekM7OztZQUlBOzs7UUFLRjs7Ozs7b0JBS00sbUJBQW1COzs7O29CQUduQjs7OztvQkFHQTtvQkFDQSxZQUFZLG1CQUFtQixHQUFHOzs7Ozs7O1FBU3hDO1FBQ0EsYUFBYTtRQUViOzs7aUNBVTJCO1FBQzNCLElBQUksYUFBYTtZQUNmO1lBQ0EsSUFBSSxpQkFBaUI7Z0JBQ25COzs7Ozs7UUFRSixJQUFJLHdCQUF3QjtZQUcxQixZQUFZOzs7aUJBSVAsV0FBVzs7O3lCQUdILENBQUMsT0FBTyxDQUFDOzs7OztRQTFMeEIsWUFBWTs7Ozs7QUErTGhCOzs7O0FDdk5BOzs7TUFRTTs7O0FDUk4sSUFrQm1DLHNDQUFZO0lBdUM3Q0EsNkJBQTJFOztRQWYxRCx1QkFBc0IsS0FBSztRQUMzQjtRQUNBLHdCQUFrQjtRQUV6Qix3QkFBMkI7UUFnQm5DLGtCQUFrQixNQUFNOzs7Z0JBR3BCLE1BQU07OztvQkFHSixvQkFBbUI7b0JBQ25CLE1BQU07OztvQkFLTix3QkFBd0I7d0JBQ3RCO3dCQUNBLHdCQUF1QixpQ0FBdUMsQ0FBQzt3QkFDL0QsS0FBSSxDQUFDO3dCQUNMLGlCQUFpQjs7Ozt3QkFHakIsS0FBSSxDQUFDLGtCQUFrQjs7Ozs7O2dCQU0zQixLQUFJLENBQUMsa0JBQWtCO2dCQUN2QixNQUFNOzs7OztJQXRETCxvQkFBUCxpQkFFaUI7d0NBQ21CO1FBQ2xDLGdDQUFnQyxNQUFNO1FBQ3RDOzs7NkJBNkRxQjtZQUNuQixLQUFLLFlBQVk7Ozs7O1lBYWpCLEtBQUssWUFBWTtZQUNqQixJQUFJLENBQUMsWUFBWTs7Ozs7WUFZakIsS0FBSyxZQUFZO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUc7Ozs7eUJBS0Y7WUFDZjs7O1FBR0YsaUJBQU07Ozt3QkFJVSxDQUFDLEtBQUs7Ozt3QkFJTixDQUFDLE1BQU0sR0FBRztRQUMxQixJQUFJLENBQUMsV0FBVzs7O3dCQUlBLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVc7Ozs7UUFNaEIsSUFBSSxXQUFXO1FBQ2YsSUFBSSxDQUFDLGVBQWU7UUFDcEIsSUFBSSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLGNBQWM7UUFDbkIsSUFBSSxDQUFDLFNBQVM7UUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDdkIsSUFBSSxDQUFDO1FBQ0w7Ozs7O0FBU0osSUFBZ0MsMENBQWE7SUFJM0NBLGlDQUFvRDs7UUFBaEMsdUJBQWlCO1FBTW5DO1FBQ0EsSUFBSTtRQUVKLElBQUksVUFBVTtZQUNaOzs7aUNBRTRDO1lBQzVDLHNCQUE2QztZQUM3QyxRQUFRO1lBQ1I7Z0JBQ0U7Z0JBQ0EsdUJBQXVCO29CQUNyQixVQUFzQixRQUFRLFlBQVk7Ozs7OztRQU9oRCxLQUFJLENBQUMsUUFBUTtRQUNiLEtBQUksQ0FBQztRQUNMLEtBQUksQ0FBQyxTQUFTOzs7O2tCQUlKLGtCQUFrQjtZQUNsQjtZQUNSLElBQUk7Z0JBQ0Y7OztxQkFFSzs7Ozs7a0JBTUMsV0FBVztZQUNYO1lBQ0EsSUFBQTtZQUNSLElBQUk7Z0JBQ0YsSUFBSSxDQUFDO29CQUNIO29CQUNBLElBQUksQ0FBQyxhQUFhOzs7O29CQUdsQixJQUFJLENBQUM7Ozs7cUJBR0Y7Z0JBQ0wsSUFBSTtvQkFDRjs7Ozs7O29CQUtBLHVDQUF1QztvQkFDdkMsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7O1FBVXhCLElBQUksS0FBSztZQUNDO1lBQ1IsSUFBSTtnQkFDRixJQUFNO2dCQUVOLElBQUksNkNBQTZDO29CQUMvQztvQkFDQSxJQUFJLENBQUMsYUFBYTs7OztvQkFHbEIsSUFBSSxDQUFDOzs7Ozs7Ozs7O1lBVVQ7Ozs7WUFHQSxJQUFJO2dCQUNGLE1BQU07Ozs7Ozs7O21CQVFDLHNDQUFzQztZQUMvQzs7O1lBR0E7Ozs7Z0JBR0UsTUFBTSxDQUFDO2dCQUNQLE1BQU0sQ0FBQztnQkFDUCxPQUFPOzs7O2dCQUdQOzs7Ozs7O1FBU0osSUFBSSxpQkFBaUI7UUFDckIsSUFBSSxDQUFDO1FBQ0wsNkJBQTZCOzs7Ozs7Ozs7QUNoVGpDO0FBQ0E7UUFVSTtZQUNFOzs7WUFJQTs7OztRQUtGOzs7Ozs7QUNUSjs7O0FDWEE7OztBQ0RBO0FBZ0JBO1FBT0k7OztRQUlBLFVBQVU7Ozt5QkFJTyxDQUFDOzs7OztBQzNCdEI7QUFHQSxJQTRCRTs7UUFDRSxJQUFJO1lBQ0Y7Ozs7eUJBMkJpQixJQUFJLGFBQWdCO1FBQ3ZDLG9CQUFpQjtRQUNqQkMsYUFBVSxDQUFDO1FBQ1hBOzs7cUNBK0gwQjtRQUMxQixJQUFNO1FBRU4sSUFBSTtZQUNGLFFBQVE7Ozs7Z0JBSU4sSUFBSSxDQUFDLFdBQVcsS0FBSztnQkFDckIsSUFBSSxDQUFDOzs7WUFLUDtnQkFDRSxJQUFJLENBQUMsa0JBQWtCO2dCQUN2QixJQUFJLHNCQUFzQjtvQkFDeEI7Ozs7Ozs7O1lBV0o7Ozs7Z0JBR0U7Z0JBQ0EsSUFBSSxDQUFDOzs7Ozs7eUJBK0JWO1FBakJDO1FBRUEsV0FBVyw2QkFBMEIsRUFBRTs7WUFJckM7O29CQUVJOzs7MEJBRU07b0JBQ047d0JBQ0UsWUFBWTs7Ozs7Ozs7UUFVcEIsYUFBYSxJQUFJLE9BQU87OztlQXNCakI7Ozs7eUJBb0NEOzs7O1lBRUosV0FBa0I7Ozs7O3lCQW1CckI7UUFOQztRQUVBLFdBQVcsNkJBQW9CLEVBQUU7O1lBRS9COzs7O2VBOVJLOzs7OztBQTBTWCxTQUNPO1FBQ0gsY0FBYzs7O1FBSWQ7Ozs7Ozs7QUM1VkosSUFBNkMsbURBQUs7SUFJaEREOztRQUZnQjtRQUliLE1BQWM7Ozs7Ozs7O0FDYm5CLElBTzRDLCtDQUFZO0lBR3REQTs7UUFBbUIsdUJBQU8sQ0FBWTtRQUFTLGdCQUFVO1FBRnpEOzs7O3VCQU9pQjtZQUNiOzs7UUFLRixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBTTtRQUVOLElBQUk7UUFFSixJQUFJLENBQUM7WUFDSDs7O1FBS0YsSUFBSSxlQUFlO1lBQ2pCOzs7Ozs7OztBQ2xDTixJQVcwQyw2Q0FBYTtJQUNyREE7O1FBQXNCOzs7Ozs7QUFReEIsSUFBZ0MsbUNBQWE7SUFnQjNDQTtvQkFDRTtRQVhGLGtCQUEyQjtRQUUzQixlQUFTLEtBQUssQ0FBQztRQUVmLGVBQVM7UUFFVCx1QkFBaUI7UUFFakIsaUJBQVc7Ozs7bUNBWHdCOzs7WUF1QjNCLFVBQVUsSUFBSSxxQkFBcUIsRUFBRTtRQUMzQztRQUNBLE9BQVk7OztZQUlSO1lBQ0Y7OztZQUdRO1lBQ1IsSUFBTSxnQkFBZ0I7WUFDdEIsSUFBTSxnQkFBZ0IsTUFBTTtZQUM1QixvQkFBb0IsTUFBTSxFQUFFO3FCQUNyQixDQUFDLE1BQU0sQ0FBQyxNQUFNOzs7OztZQU1uQjtZQUNGOzs7UUFHRixJQUFJLENBQUMsV0FBVztRQUNoQixJQUFJLENBQUMsaUJBQWlCO1FBQ2QsSUFBQTtRQUNSLElBQU0sZ0JBQWdCO1FBQ3RCLElBQU0sZ0JBQWdCLE1BQU07UUFDNUIsb0JBQW9CLE1BQU0sRUFBRTtpQkFDckIsQ0FBQyxPQUFPLE1BQU07Ozs7O1lBTWpCO1lBQ0Y7OztRQUdNLElBQUE7UUFDUixJQUFNLGdCQUFnQjtRQUN0QixJQUFNLGdCQUFnQixNQUFNO1FBQzVCLG9CQUFvQixNQUFNLEVBQUU7aUJBQ3JCLENBQUMsVUFBVSxHQUFHOzs7OztZQU1qQixVQUFVO1FBQ2QsSUFBSSxDQUFDLFNBQVM7UUFDZCxJQUFJLENBQUMsU0FBUzs7O1lBS1Y7WUFDRjs7Ozs7OztZQVFFO1lBQ0Y7OztzQkFFVTtZQUNWOzs7c0JBRVUsU0FBUyxFQUFFO1lBQ3JCLG1CQUFtQjs7OztZQUduQiw4QkFBOEIsQ0FBQzs7OztZQUszQixVQUFVO1FBQ1YsaUJBQWtCO1FBQ3hCLGlCQUFpQjs7Ozs7Ozs7QUFPckIsSUFBeUMsNENBQVU7SUFDakRBOztRQUFzQjtRQUVwQixLQUFJLENBQUM7Ozs7O1FBS0wsSUFBSSxXQUFXLG9CQUFvQjtZQUNqQyxXQUFXOzs7OztRQU1iLElBQUksV0FBVztZQUNiLDBCQUEwQixDQUFDOzs7OzBDQUtWO1FBQ25CLElBQUksV0FBVztZQUNiLDJCQUEyQjs7Ozs7UUFPN0IsSUFBSSxNQUFNO1lBQ1I7Ozs7Ozs7Ozs7O0FDdktOOzs7OztJQWFFOzs7OztRQUtTLHVCQUF3QjtRQUUvQixxQkFBdUI7UUFDdkIsSUFBTTtRQUVOLElBQUksWUFBWTtZQUNQLFdBQVk7Ozs7Ozs7SUFPVyw4Q0FBYTtJQUkvQ0E7O1FBQ29COzs7OztRQU9sQixJQUFJLGNBQWM7WUFDaEI7WUFDQTs7O1FBSUYsSUFBTTtRQUNOLElBQUksUUFBUTtZQUNWLGVBQWU7WUFDZjs7O1FBSUYsWUFBWTtZQUNWO1lBQ0E7OztRQTRCRixJQUFNO1FBQ04sSUFBSSxtQkFBbUI7UUFFdkIsSUFBSTtZQUNGLGdCQUFnQjs7Ozs7Ozs7QUMzRnRCLElBVzhDLGlEQUFhO0lBUXpEQSwrQkFDc0I7O1FBREgsWUFBTTtRQUNIO1FBTlosb0JBQXNCO1FBR2hDLG9CQUFjOzs7Ozs7OzBCQWFRLFNBQVMsQ0FBQztRQUM5QixJQUFJO1lBQ0Ysb0JBQW9COzs7Ozt5QkFNTDtRQUNqQixJQUFJLGFBQWE7WUFDZjtZQUNBO1lBQ0EsVUFBVTswQkFDRSxDQUFDLElBQUk7MEJBQ0gsQ0FBQztnQkFDYixtQkFBbUI7Z0JBQ25COzs7Ozs7Ozs7b0NBU3dCOzs7OztBQUloQyxJQWN1QyxpREFBb0I7SUFDekRBOzJEQUdDO1FBRm1COzs7O3lCQUlEO1FBQ2pCLGlCQUFNOzs7eUJBR1csV0FBVztRQUM1QixJQUFJLENBQUMsWUFBWTtRQUNqQixpQkFBTTs7OzBCQUdtQjtRQUN6QixJQUFJLFdBQVc7WUFDYjtZQUNBLElBQU07WUFDTjtZQUNBLFdBQVcsQ0FBQztZQUNaLFdBQVcsQ0FBQyxXQUFXO1lBQ3ZCO2dCQUNFLFVBQVU7Ozs7Ozs7SUF5QmtCRSxnREFBYTtJQUkvQ0Y7O1FBQ29COzs7OztRQU9sQixJQUFJLGNBQWM7WUFDaEI7WUFDQTs7O1FBSUYsSUFBTTtRQUNOLElBQUlHLFdBQVE7WUFDVkEsa0JBQWU7WUFDZjs7O1FBSUYsWUFBWTtZQUNWQTtZQUNBOzs7UUEyQkYsSUFBTTtRQUNOLElBQUksbUJBQW1CO1FBRXZCLElBQUk7WUFDRixnQkFBZ0I7Ozs7Ozs7O0FDbkx0QixJQWlJeUMsNkNBQWE7SUFLcERIOztRQUNvQjtRQUNBO1FBQ0E7UUFDQTtRQVJaO1FBQ0Q7UUFDQTs7Ozs7UUFZTCxJQUFJO1lBQ0Y7Ozs7WUFHQTs7Ozs7cUJBT1csV0FBVztRQUV4QixJQUFJLFNBQVM7WUFDWCxTQUFTOzs7UUFLWCxJQUFJLFFBQVc7UUFDZixJQUFJO1lBQ0YsSUFBSTtnQkFDRjs7Ozs7Ozs7OztZQVNGLFFBQVE7WUFDUixjQUFjO1lBQ2QscUJBQXVCO1lBQ3ZCLElBQUksaUJBQWlCO1lBQ3JCLElBQUk7Z0JBQ0YsSUFBSSxpQkFBYTtnQkFDakIsSUFBSTtvQkFDRjs7OztvQkFHQTs7Ozs7O1lBT0osTUFBTTs7OztxQkFLTyxXQUFXO1FBQzFCLElBQUksTUFBTTtZQUNSLE1BQU07MkJBQ087Ozs7Ozs7cUJBU0EsV0FBVztRQUMxQixJQUFJLE1BQU07WUFDUixNQUFNOzs7Ozs7OzsrQkFVZSxDQUFDOzs7O1lBS3RCLEtBQUs7WUFDTCxJQUFJO2dCQUNGOzs7Ozs7O0lBV29DLG1EQUFhO0lBQ3ZEQSxtQ0FDcUMsUUFDeUI7O1FBRjFDLFNBQUcsR0FBSDtRQUNBO1FBQ0E7Ozs7Ozs7O1FBV2xCLElBQUksV0FBVztRQUNmLElBQUk7WUFDRixNQUFNOzs7Ozs7SUFhaUMsNkNBQWE7SUFFeERBLG9DQUM0Qzs7UUFEekIsU0FBRyxHQUFIO1FBQ0M7UUFDQTs7OzsrQkFNTyxjQUFjO1FBQ2pDLElBQUE7UUFDTixJQUFJO1lBQ0YsOENBQThDOzs7UUFHaEQ7Ozs7O0FBU0osSUFBd0MscURBQVk7SUFDbERBOztRQUFvQixZQUFNO1FBRXhCLE1BQU0sTUFBTSxHQUFHOzs7OztRQUtmLElBQUksY0FBYztZQUNoQjtZQUNBLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDakIsZ0JBQWdCO2dCQUNkLE1BQU0sQ0FBQyxXQUFXOzs7Ozs7Ozs7QUNqVDFCLElBU3dDLDJDQUFVO0lBRWhEQTtxQ0FDUztRQURXLFlBQU07Ozs7Ozs7Ozs7OztRQVd4QixJQUFJLFlBQVk7WUFDZCxnQkFBZ0IsYUFBYTs7Ozs7O1lBTzdCOzs7c0JBRVU7Ozs7Ozs7NkJBT0YsdUJBQVk7Ozs7Ozs7QUN0QzFCLElBaUIrQixrQ0FBWTtJQUN6Q0E7Ozs7Z0NBYTJCO1FBQ3pCOzs7Ozs7Ozs7QUNqQ0osSUFVb0MsdUNBQVM7SUFPM0NBOztRQUFzQixrQkFBQSxVQUF5QjtRQUN6QixrQkFBbUQ7UUFIL0QsYUFBTzs7Ozs7UUFTZixJQUFJLEtBQUs7WUFDUDtTQUNEO1FBR0QsSUFBSTtZQUVFLFlBQVk7O1FBd0JsQixJQUFJLE1BQU07WUFDUixLQUFLLEtBQUs7O1FBS1osSUFBSTtZQUVBLGNBQWMsQ0FBQzs7UUFJbkIsWUFBWTs7Z0VBR3NDO1FBQVU7O0lBRTlEOzs7Ozs7ZUFTUzs7OztZQVVMLCtDQUErQzs7O1FBSWpEOzt5QkFFZTs7NkJBQ1EsK0JBQStCOzs7OztZQW1CbEQsT0FBTzs7O1lBR1QsSUFBSSxDQUFDLEtBQUssS0FBSztTQUNoQjs7MEJBQ2U7WUFDZCxVQUFVLEtBQUssQ0FBQzs7UUFFbEIsSUFBSTtZQUNGLElBQUksQ0FBQyxXQUFXOzs7O3lDQU1wQjs7UUFHRSxJQUFNLFNBQVM7WUFDVCxtQkFBbUI7WUFDbkI7Ozs7UUFLTixJQUFJLFVBQVUsR0FBRztRQUVqQixJQUFJLFlBQVk7WUFDZCxPQUFPLGFBQWE7O1FBR3RCLElBQUksWUFBWTtZQUNkLGNBQWM7O1FBR2hCLElBQUksQ0FBQyxZQUFZOzs7Ozs7Ozs7Ozs7O0FDeEpyQixJQVVvQyx1Q0FBYztJQUVoREE7O1FBQXNCLGtCQUFBLFVBQXlCO1FBQ3pCLGtCQUFtRDs7Ozs7UUFLdkUsSUFBSSxLQUFLO1lBQ1A7U0FDRDtRQUNELElBQUksU0FBUztZQUNULGNBQWM7O1FBRWxCOztpQ0FHWTtRQUNaLE9BQU87O2dCQUVELFNBQVMsQ0FBQyxPQUFPOztxREFHQTs7OzhEQUtPLFdBQVcsRUFBRTs7Ozs7Ozs7Ozs7O0FDZi9DO0lBU0UsbUJBQW9CLGVBQThCLEVBQ3RDLEdBQWlDO1FBQWpDLG9CQUFBOzRCQUR1QixHQUFmOzs7Ozt1QkFpQ0gsQ0FBQywyQkFBOEI7O2lCQW5DL0IsR0FBaUI7Ozs7Ozs7OztBQzlCcEMsSUFNb0MsMENBQVM7SUFtQjNDQSxpQ0FDWTs0QkFBQSxpQkFBNkI7UUFEekMsWUFFRTtZQUNFLG1CQUFtQjs7OztnQkFHakIsT0FBTzthQUNSOzswQkF4QnVDOzs7Ozs7UUE0QjRCOzttQkFFN0QscUNBQXFDLE9BQU8sT0FBTzs7Ozs7Ozs7WUFVeEQsYUFBYTs7OztRQUtqQixJQUFJO1FBQ0osSUFBSTs7WUFHRjs7OzBCQUdnQjtRQUVsQjtZQUVJOzs7O1lBSUY7Ozs7Ozs7Ozs7OztBQ3BFTixJQUVvQywwQ0FBYztJQUFsREE7Ozs7Ozs7QUNGQTtBQUNBOztBQ0RBO0FBT0E7Z0JBb0RtQixDQUFDOzs7Ozs7O0FDekRwQjtTQUNjLFdBQWlCLE1BQU87Ozs7QUNHdEM7aUNBQ3NDLE9BQU87K0JBQ2xCLEVBQUU7OzRCQUVIOzs7Ozs7OztBQ1YxQjtBQUVBO1FBS0k7Ozs7bUJBR1cscUJBQXFCO1lBQzlCLElBQUksTUFBTTtZQUNWLElBQUksSUFBSTtnQkFDTixJQUFJLGtCQUFrQjtvQkFDcEIsV0FBVztvQkFDWDs7O2dCQUdGLGVBQWUsQ0FBQyxNQUFNO29CQUNwQixZQUFZOzs7Ozs7Ozs7QUNuQnRCO0FBRUE7UUFFSSx1QkFBdUI7UUFDdkIsVUFBVSxDQUFDLFVBQVUsQ0FBQzs7O0lBR3ZCLE1BQWMsQ0FBQztJQUNoQixPQUFPOzs7O0FDUlQ7QUFDQSxXQXdFdUQ7Ozs7O0lBRXJELElBQUksWUFBWSxTQUFTLENBQUM7UUFDeEIsV0FBVzs7Ozs7Ozs7Ozs7Ozs7OztBQzdFZjtBQW9EQTtRQUVJOzs7Ozs7OztJQVlGLHNCQUFzQjs7OztBQ2hFeEI7QUFDQSxJQW9CRTt5QkFBK0I7UUFBUztRQUFrQixVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQ25FLElBQUksQ0FBQyxRQUFROzs7Z0JBU0wsV0FBVztvQkFDVDs7Ozs7Ozs7O2dCQWtCQSxhQUFhO1FBQ3ZCLFFBQVE7b0JBQ0U7Ozs7Ozs7OzswQkFtQlE7WUFDaEI7Ozs7Ozs7Z0JBWVE7UUFDVixRQUFRO29CQUNFOzs7Ozs7Ozs7O3dDQXNCc0I7WUFDOUIsT0FBTzs7Ozs7K0JBY2MsZUFBZTs7Ozs7O0lBMUJ6QiwwREFBZ0U7SUFxQ2pGOzs7OztBQ3RJQSx1QkFrRitCO2NBQ1Q7Ozs7O1FBTmxCLFlBQVk7UUFDWixLQUFLLGFBQWE7Ozs7SUFlcEI7O1FBR0Usb0JBQW9CLENBQUMsWUFBWSxDQUFDOzs7Ozs7MENBUUEsaUJBQWlCOzs7Ozs7SUFLckQ7UUFBbUIsb0JBQUEsYUFBK0I7O0lBRWxEOztBQUNGOzs7Ozs7Ozs7QUNsSEEsSUFXc0MseUNBQVU7SUFNOUNBLHlCQUF5RDtxQ0FBN0M7UUFDQSwyQkFBQTs7O1FBTkosbUJBQXFDOzs7UUFVM0MsaUNBQWdDLElBQUksQ0FBQztRQUVyQzs7OzthQUdPO1lBQ0wsVUFBUzs7Ozs7WUFLTCxVQUFVOztRQUloQixZQUFZOzs7UUFJWjs7NkNBR0Y7WUFDTSxRQUFRLEtBQUs7O1FBR2pCLGlCQUFNLElBQUksWUFBQyxLQUFLLENBQUMsQ0FBQztLQUNuQjtJQUdEO1FBRUUsSUFBTSw4Q0FBOEM7UUFDcEQsSUFBTTtRQUNOLGdCQUFrQixLQUFLLFVBQVU7OztRQUlqQyxJQUFJO1lBQ0YsVUFBVSwwQkFBMEI7OztZQUVwQyxZQUFZOzs7OytCQUdPLG1CQUFtQjs7Ozs7WUFPcEMsbUJBQW1COzs7O1NBSXRCOztZQUNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFrQixPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7YUFDOUM7U0FDRjs7WUFHQyxVQUFVLE1BQU0sQ0FBQzs7YUFDWjs7OzRCQUlhOzs7a0NBSU07Ozs7O1FBTTFCLHNCQUF3Qjs7O1FBSXhCLElBQUksV0FBVztRQUtmLGtCQUFrQixnQkFBZ0I7WUFDaEMsV0FBVyxPQUFPLENBQUMsV0FBVyxDQUFDO3NCQUN2Qjs7WUFFUixXQUFXLEdBQUc7O1lBR1osV0FBVzs7O1lBSVgsV0FBVyxHQUFHOzs7dUJBSUg7OztZQUdsQjs7Ozt3QkFHd0IsQ0FBUTs7SUFFakM7Ozs7Ozs7OztBQ25JQSxJQU9xQyx3Q0FBVTtJQUEvQ0E7O1FBQ1Usa0JBQWU7UUFDZjtRQUNBLHFCQUF3Qjs7OztnQkFJdEIsQ0FBQyxVQUFVO1lBQ2pCO1lBQ0E7OztzQkFFVSxnQkFBZ0I7WUFDMUIsVUFBVSxDQUFDLFVBQVU7WUFDckIsbUJBQW1COzs7OztpQkFNWjtZQUNQLEtBQUssYUFBYTtZQUNsQixJQUFJLENBQUMsY0FBYzs7OztpQkFLWixlQUFlO1lBQ3RCOzs7OztRQU1GLElBQUk7WUFDRjs7Ozs7Ozs7QUN6Q047QUFFQSxJQUFNLGFBQWE7QUFFbkIsc0JBQXNCOztJQUVwQixJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUU7Ozs7O2tCQU1RO1FBQ1osYUFBYSxhQUFhO1FBQzFCO1FBQ0EsT0FBTzs7O29DQUlxQjs7Ozs7O0FDcEJoQyxJQVNtQyxzQ0FBYztJQUUvQ0E7O1FBQXNCLGtCQUFBLFVBQXdCO1FBQ3hCLGtCQUFtRDs7Ozs7UUFNdkUsSUFBSSxLQUFLLEtBQUssUUFBUTtZQUNwQjtTQUNEO1FBRUQsU0FBUyxTQUFTLElBQUksS0FBSzt5QkFJViw4Q0FBOEMsWUFBWSxDQUN6RTs7O1FBR3lEOzs7O1lBVXZELFNBQVMsQ0FBQzs7WUFFWixtQkFBbUI7Ozs7cUJBS3hCOzs7Ozs7Ozs7QUM5Q0QsSUFFbUMseUNBQWM7SUFBakRBOzs7OzJCQUd1QjtRQUNuQixJQUFJLENBQUMsU0FBUztRQUVQLElBQUEsc0JBQU8sQ0FBUztRQUN2QixJQUFJO1FBQ0osSUFBSSxLQUFLO1FBQ1QsSUFBSSxLQUFLLEdBQVc7UUFDcEIsU0FBUyxVQUFVLE9BQU8sQ0FBQztRQUUzQjs7Z0JBRUk7OzttQkFJTyxRQUFRO1FBRW5CLElBQUksT0FBTztZQUNULE9BQU87a0NBQ2E7Ozs7Ozs7OztBQ3pCMUI7QUFDQTs7QUNEQTtBQUNBOzs7QUNEQSxJQVM2QyxnREFBYztJQUV6REE7aURBRW1CO1FBRkcsa0JBQUEsVUFBa0M7UUFDbEMsa0JBQW1EOzs7OztRQU12RSxJQUFJLEtBQUssS0FBSyxRQUFRO1lBQ3BCO1NBQ0Q7UUFFRCxTQUFTLFNBQVMsSUFBSSxLQUFLO3lCQUlWLHlEQUF5RCxDQUN4RTs7O1FBRW1FOzs4REFLdkMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7O1lBS2hELFNBQVMsQ0FBQzs7WUFFWixtQkFBbUI7Ozs7Ozs7Ozs7Ozs7QUN4Q3pCLElBRTZDLG1EQUFjO0lBQTNEQTs7OzsyQkFHdUI7UUFDbkIsSUFBSSxDQUFDLFNBQVM7UUFFUCxJQUFBLHNCQUFPLENBQVM7UUFDdkIsSUFBSTtRQUNKLElBQUksS0FBSztRQUNULElBQUksS0FBSyxHQUFXO1FBQ3BCLFNBQVMsVUFBVSxPQUFPLENBQUM7UUFFM0I7O2dCQUVJOzs7bUJBSU8sUUFBUTtRQUVuQixJQUFJLE9BQU87WUFDVCxPQUFPO2tDQUNhOzs7Ozs7Ozs7QUN6QjFCO0FBQ0E7OztBQ0RBLElBSzBDLGdEQUFjO0lBT3REQSx1Q0FDbUI7NERBRCtCO1FBQy9COzs7UUFKWjt3QkFDa0I7Ozs7UUFjakIsZUFBQztRQUNQLFdBQWdCLE1BQXdCO1FBRXhDLE9BQU87Ozs7O1FBTVA7WUFDRSxpQ0FBaUM7Z0JBQy9CLE1BQU07YUFDUDs7Ozs7OztTQS9CTTs7SUF5Q3lCLHlDQUFjO0lBSWxEOzttQ0FBK0I7YUFDVDsyQkFDSztRQUpqQixtQkFBc0IsQ0FBQzt3Q0FNQTs7O29DQUdsQjtRQUFZO1FBQ3pCLEtBQUssU0FBUzs7O1FBR2Q7O2lCQU1TO1FBQ1QsY0FBYyxRQUFROzs7UUFHNEM7WUFDOUQsd0JBQXdCLFFBQVEsQ0FBQzs7UUFFckMsbUJBQW1CO1FBQ2xCLGFBQXlDO1FBQzFDOzs7O1FBSUE7OztRQUlBLElBQUk7WUFDRixPQUFPOzs7OztpQkFNRixDQUFDLFVBQVU7Ozs7d0JBR04sQ0FBQzs7aUJBQ0o7Z0JBQ0wsT0FBTzs7U0FFVjs7Ozs7Ozs7d0JBTUo7YUExRGdEOzs7Ozs7Ozs7Ozs7Ozs7QUM5Q2pEOztBQ0FBOzs7QUNVQSxJQUE2QyxtREFBSztJQUloREE7O1FBRmdCO1FBSWIsTUFBYzs7Ozs7Ozs7QUNObkIsSUFBZ0Msc0NBQUs7SUFJbkNBOztRQUZnQjtRQUliLE1BQWM7Ozs7Ozs7O0FDVG5CLElBQWtDLHdDQUFLO0lBSXJDQTs7UUFGZ0IsNEJBQXNCO1FBSW5DLE1BQWMscUJBQW9COzs7Ozs7OztBQ1p2QyxJQStEa0MseUNBQWE7SUFJN0NBO3NDQUdRLFdBQVc7UUFGQyx1QkFBTyxDQUFnQztRQUozRCxnQkFBa0I7UUFPaEIsS0FBSSxDQUFDLFVBQVU7Ozs7a0JBTUE7UUFDZixJQUFJO1lBQ0Y7Ozs7WUFHQTs7Ozs7Ozs7QUNsRk47O0FDREE7OztBQ0FBLElBUTJDLDJDQUFhO0lBQXhEQTs7Ozs2QkFJeUIsQ0FBQyxVQUFVOzs7OEJBSVY7Ozs7Ozs7Ozs7QUNoQjFCLElBUTJDLDJDQUFhO0lBR3REQSx5QkFBMEQsVUFBYTtxQ0FDOUQ7UUFEVyxZQUFNO1FBQWdDO1FBQXNCLGdCQUFVLEdBQVYsVUFBVSxDQUFRO1FBRjFGLGdCQUFVOzs7O21CQU9MLENBQUMsVUFBVSxLQUFLLGFBQWEsS0FBSyxFQUFFOzs7bUJBSXBDLENBQUMsbUJBQW1CO1FBQy9CLElBQUksQ0FBQzs7O21CQUlNLENBQUMsbUJBQW1CO1FBQy9CLElBQUksQ0FBQzs7Ozs7O0FDekJUO0FBRUEsSUFDUyxxQkFDQzs7O1lBR0Ysc0JBQXNCOzs7YUFLdkI7V0FDRSxVQUFVOzs7Ozs7QUNkbkI7NkJBQ2tDO1FBQzlCLE9BQU87Ozs7O0FBV1gsQUFBTyxJQUFNOztBQ1piO0FBRUEsb0NBQzJDO0lBQ3pDO1FBQ0UsSUFBTUksdUJBQW9CQztRQUMxQjtZQUNFLFdBQVdELFdBQVE7WUFDbkI7Ozs7WUFJQTs7Ozt1QkFNYTtZQUNiOzs7Ozs7Ozs7OztBQ25CTjtBQU9BLElBQ1csd0JBQXdCO0lBQ2pDLDZCQUE2QjtRQUUzQixVQUFVOzs7Ozs7Ozs7O0FDWmQ7OztBQ0FBO1NBQ2MsaUJBQXdCOzs7O0FDRHRDO0FBRUE7UUFhSTs7Z0JBRUksZ0JBQWlCO2dCQUNqQixVQUFVLENBQUMsV0FBVztnQkFDdEI7Ozs7Ozs7O29DQU13QixDQUFDRTs7OytCQUVOLENBQUM7Ozs7Ozs7Ozs7UUFPeEIsSUFBTSx3QkFBc0I7O2NBRXRCOzs7OztBQ2pDVjtBQUVBLGtEQVV5RCxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUU7SUFFakYsa0JBQWtCLG9CQUFvQjs7Ozs7QUNmeEMsQUE0SkE7SUFzQ21ELG1EQUFxQjtJQU10RU47a0RBQ29CO1FBRDRCLHVCQUFBO1FBTHhDO1FBQ0EsWUFBTSxHQUFVLEVBQUU7UUFDbEIsaUJBQVc7Ozs7O1FBU2pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDOzs7O1FBS3RCLElBQU0sa0JBQWtCO1FBQ3hCLElBQUksR0FBRztZQUNMOzs7O1lBR0EsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNqQixLQUFLLFNBQVMsR0FBRyxHQUFHOztnQkFFbEIsSUFBSSwyQkFBMkI7Ozs7OzRCQU1mLFVBQVU7WUFDNUIsS0FBSyxXQUFXLENBQUM7Ozs7O1FBUW5CLElBQU0sTUFBTSxHQUFHO1FBQ2YsSUFBTSxTQUFTLGtCQUFrQjtZQUMvQjtjQUNFO2NBQ0UsV0FBVyxJQUFJLFVBQVU7UUFFL0Isa0JBQWtCLEdBQUc7WUFDbkIsU0FBUztnQkFDUCxJQUFJLENBQUM7Ozs7Ozs7OztRQVNULElBQUk7WUFDRjs7OztZQUdBOzs7Ozs7OztBQ2hRTjs7QUNEQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7O0FDSUE7OztRQXlHVTt5QkFDbUI7Ozs7c0NBU1o7UUFDYixrQkFBa0I7eUJBQ0gsQ0FBQzs7YUFDVDs7O0lBR1Q7eUNBRWtCO1lBQ1o7OztZQUdGLHNCQUFzQjtTQUN2Qjs7O1lBRUMsT0FBTzs7UUFFVCxJQUFJO1lBQ0E7OztZQUlBLElBQUksQ0FBQyxpQkFBaUIsQ0FBTyxJQUFJOzs7UUFJckMsSUFBSSxDQUFDO1FBQ0wsSUFBSSxXQUFXLE1BQU0sU0FBUyxNQUFNLENBQUM7Ozs7OzBDQVFIOzs7WUFJNUI7Ozs7WUFJSixpQkFBaUIsQ0FBQzs7c0JBQ0osV0FBVztZQUN6Qjs7OzZCQUdMO2lCQTVENEQ7Ozs7Ozs7OztBQzFHN0Q7O0FDQUE7O0FDQ0E7O0FDRkE7OztBQ0FBLElBaUx1Qyw4Q0FBcUI7SUFLMURBOztRQUNvQix1QkFBTyxDQUEyQjtRQUw5QztRQUVBLG1CQUFhLENBQUM7UUFNcEI7UUFDQSx3QkFBdUIsQ0FBQztRQUV4QixLQUFLLG9CQUFvQixHQUFHLEVBQUU7c0JBQ2hCLEdBQUcsUUFBUSxDQUFDLEVBQUU7WUFDMUIsSUFBTSxpQkFBaUIsR0FBRztZQUUxQixJQUFJLGlCQUFpQjtnQkFDbkI7Ozs7Ozs7UUFTSixJQUFJLENBQUUsa0JBQTBCO1lBQzdCLFNBQWlCLFlBQVk7WUFDOUIsa0JBQWtCOzs7O3VCQUtaO1FBQ1IsSUFBTTtRQUVOLElBQUksbUJBQTRCO1lBQzlCO1lBQ0E7OztRQUtGLElBQUk7WUFDRjs7O1lBSUE7Ozs7Ozs7O0FDak9OOztBQ0FBOztBQ0FBOztBQ0NBOztBQ0RBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOzs7QUNDQSxJQWdFdUMsMENBQXFCO0lBSzFEQTs7UUFKUSx1QkFBMEI7UUFDMUIsaUJBQVcsS0FBd0IsQ0FBQztRQUNwQyxzQkFBZ0M7Ozs7NkJBT2pCOzs7O1FBS3JCLElBQU0sa0JBQWtCO1FBRXhCLElBQUksR0FBRztZQUNMOzs7OzRDQUc4QixDQUFDO2dCQUM3QixJQUFJO2dCQUVKLElBQUk7b0JBQ0YsSUFBSSxDQUFDLGFBQWE7Ozs7Ozs7O2tCQVdkLFVBQVU7WUFDbEIsS0FBSyxXQUFXO1lBRWhCLEtBQUssUUFBUSxHQUFHLElBQUk7cUJBQ2IsS0FBSyxVQUFVO29CQUNsQixnQkFBZ0I7b0JBRWhCLHdCQUF3QjtvQkFDeEIsWUFBWSxZQUFZLEVBQUU7Ozs7Ozs7Ozs7O0FDNUdwQzs7QUNEQTs7QUNBQTs7O0FDQ0EsSUFrR3lDLHlDQUFhO0lBTXBEQTt3REFFd0M7UUFGeEM7NEJBSGdEOztRQU85Qyx1QkFBc0IsQ0FBQywwQkFBMEI7UUFDakQsS0FBSSxDQUFDLFNBQVMsTUFBTTs7OztRQUlwQixhQUFlOzsyQkFFRSx3QkFBd0I7OztZQUV2QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CO1NBQ3hDO2FBQU07WUFDTCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQW9DLElBQUksRUFBRTtTQUM5RDs7Ozs7O1lBUUMsZ0JBQWdCLENBQUMsVUFBVTtZQUMzQjs7WUFHRTs7O1lBR0YsYUFBYTtxQkFDTixHQUFHLENBQUMsUUFBUSxDQUFDOzs7Z0JBRWxCLElBQUksQ0FBQzthQUNOOzs7Ozs7aUJBT0ksV0FBVzs7Ozs7OzBDQU9rQjtRQUdwQyxhQUFhLEdBQUcsSUFBSSxVQUFVO1lBQzVCLGVBQWU7WUFDZixXQUFXLFFBQVE7Ozs7Ozs7WUFRbkI7WUFDQSxJQUFJLE1BQU07d0JBSUUsQ0FBQztnQkFDWEksd0JBQXFCLENBQUM7O1lBR3hCLElBQUlBO2dCQUNGLHNCQUFzQjs7O2dCQUlwQixZQUFZLFFBQVE7OztZQUl4QixJQUFJLENBQUMsa0JBQWtCLENBQUM7U0FDekI7O1lBQ0MsdUJBQXVCO1NBQ3hCOztZQUdDLFdBQVcsQ0FBQyxVQUFVLENBQUM7U0FDeEI7Ozs7O2tCQU1PLDRCQUE0QixhQUFhOztRQUMvQztZQUNBLDRCQUE0Qjs7O1lBRzFCLGlCQUFpQixTQUFTOzs7WUF4R2lCOzs7OztJQXNIakQ7O1FBR0U7S0FDRDtJQUVEO1FBQ0U7Ozs7NENBS0Y7UUFDRSxjQUFnQjs7SUFFbEI7eUJBQ0Q7OztJQU1DOzt1QkFIa0I7O1FBSWhCLElBQUksQ0FBQyxjQUFjOzs7UUFJbkIsV0FBVztLQUNaO0lBRUQ7UUFDRSxZQUFjOzt1QkFFQyxDQUFDLFNBQVMsdUJBQXVCLEVBQUU7OztRQUlsRCxPQUFPLElBQUksZ0JBQWdCLEtBQUs7S0FDakM7SUFFRDtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO0tBQ3pCO0lBQ0g7OztJQU9zQztJQUtwQztpREFHbUI7OztRQVBuQix1QkFBaUIsT0FBTztRQUN4QixZQUFNLEdBQVE7UUFDZCxnQkFBVSxHQUFHOzs7Z0NBUVo7UUFDQyxPQUFPLEtBQUs7S0FDYjtJQUlEO1FBQ0U7O3FCQUVXLFdBQVc7OztZQUVwQixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxJQUFJO1NBQ2pDOzt3Q0FHSzs7S0FFUDtJQUVEO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSztLQUMvQjtJQUVEO1FBQ0UseUJBQXlCOzs7OztZQUl2QixJQUFJLENBQUMsdUJBQXVCO1NBQzdCOzs7OztJQVFIOztRQUdFLDZCQUF1QztLQUN4QztJQUNIOzs7Ozs7QUMvVEE7Ozs7OztBQ0RBO0lBV0U7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7SUFLTSxrREFBZ0I7Ozs7O1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7Ozs7OztJQU1yQyxpREFBZTs7Ozs7UUFDcEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDOzs7Ozs7O0lBT2hCLHlDQUFPOzs7OztjQUFDLElBR2Q7UUFDQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCOzs7Z0JBckNKLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7O2tDQUxEOzs7Ozs7O0FDQUE7SUFhRTtLQUFpQjs7OztJQUVqQiw0Q0FBUTs7O0lBQVI7S0FDQzs7Z0JBZEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFFBQVEsRUFBRSx5REFJVDtvQkFDRCxNQUFNLEVBQUUsRUFBRTtpQkFDWDs7OztvQ0FWRDs7Ozs7OztBQ0FBOzs7O2dCQUdDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsRUFDUjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztvQkFDekMsT0FBTyxFQUFFLENBQUMseUJBQXlCLENBQUM7aUJBQ3JDOztpQ0FSRDs7Ozs7Ozs7Ozs7Ozs7OyJ9