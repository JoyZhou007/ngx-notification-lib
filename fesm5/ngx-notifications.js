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
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxNotificationsService, NgxNotificationsComponent, NgxNotificationsModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW5vdGlmaWNhdGlvbnMuanMubWFwIiwic291cmNlcyI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLCJuZzovL25neC1ub3RpZmljYXRpb25zL2xpYi9uZ3gtbm90aWZpY2F0aW9ucy5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtbm90aWZpY2F0aW9ucy9saWIvbmd4LW5vdGlmaWNhdGlvbnMubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHg6IGFueSk6IHggaXMgRnVuY3Rpb24ge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG59XG4iLCJsZXQgX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGdsb2JhbCBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgUnhKUywgdXNlZCB0byBjb25maWd1cmUgdGhpbmdzXG4gKiBsaWtlIHdoYXQgUHJvbWlzZSBjb250cnVjdG9yIHNob3VsZCB1c2VkIHRvIGNyZWF0ZSBQcm9taXNlc1xuICovXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICAvKipcbiAgICogVGhlIHByb21pc2UgY29uc3RydWN0b3IgdXNlZCBieSBkZWZhdWx0IGZvciBtZXRob2RzIHN1Y2ggYXNcbiAgICoge0BsaW5rIHRvUHJvbWlzZX0gYW5kIHtAbGluayBmb3JFYWNofVxuICAgKi9cbiAgUHJvbWlzZTogdW5kZWZpbmVkIGFzIFByb21pc2VDb25zdHJ1Y3Rvckxpa2UsXG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHR1cm5zIG9uIHN5bmNocm9ub3VzIGVycm9yIHJldGhyb3dpbmcsIHdoaWNoIGlzIGEgZGVwcmVjYXRlZCBiZWhhdmlvclxuICAgKiBpbiB2NiBhbmQgaGlnaGVyLiBUaGlzIGJlaGF2aW9yIGVuYWJsZXMgYmFkIHBhdHRlcm5zIGxpa2Ugd3JhcHBpbmcgYSBzdWJzY3JpYmVcbiAgICogY2FsbCBpbiBhIHRyeS9jYXRjaCBibG9jay4gSXQgYWxzbyBlbmFibGVzIHByb2R1Y2VyIGludGVyZmVyZW5jZSwgYSBuYXN0eSBidWdcbiAgICogd2hlcmUgYSBtdWx0aWNhc3QgY2FuIGJlIGJyb2tlbiBmb3IgYWxsIG9ic2VydmVycyBieSBhIGRvd25zdHJlYW0gY29uc3VtZXIgd2l0aFxuICAgKiBhbiB1bmhhbmRsZWQgZXJyb3IuIERPIE5PVCBVU0UgVEhJUyBGTEFHIFVOTEVTUyBJVCdTIE5FRURFRCBUTyBCWSBUSU1FXG4gICAqIEZPUiBNSUdSQVRJT04gUkVBU09OUy5cbiAgICovXG4gIHNldCB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcigpO1xuICAgICAgY29uc29sZS53YXJuKCdERVBSRUNBVEVEISBSeEpTIHdhcyBzZXQgdG8gdXNlIGRlcHJlY2F0ZWQgc3luY2hyb25vdXMgZXJyb3IgaGFuZGxpbmcgYmVoYXZpb3IgYnkgY29kZSBhdDogXFxuJyArIGVycm9yLnN0YWNrKTtcbiAgICB9IGVsc2UgaWYgKF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncykge1xuICAgICAgY29uc29sZS5sb2coJ1J4SlM6IEJhY2sgdG8gYSBiZXR0ZXIgZXJyb3IgYmVoYXZpb3IuIFRoYW5rIHlvdS4gPDMnKTtcbiAgICB9XG4gICAgX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzID0gdmFsdWU7XG4gIH0sXG5cbiAgZ2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcoKSB7XG4gICAgcmV0dXJuIF9lbmFibGVfc3VwZXJfZ3Jvc3NfbW9kZV90aGF0X3dpbGxfY2F1c2VfYmFkX3RoaW5ncztcbiAgfSxcbn07XG4iLCIvKipcbiAqIFRocm93cyBhbiBlcnJvciBvbiBhbm90aGVyIGpvYiBzbyB0aGF0IGl0J3MgcGlja2VkIHVwIGJ5IHRoZSBydW50aW1lJ3NcbiAqIHVuY2F1Z2h0IGVycm9yIGhhbmRsaW5nIG1lY2hhbmlzbS5cbiAqIEBwYXJhbSBlcnIgdGhlIGVycm9yIHRvIHRocm93XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBob3N0UmVwb3J0RXJyb3IoZXJyOiBhbnkpIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7IHRocm93IGVycjsgfSk7XG59IiwiaW1wb3J0IHsgT2JzZXJ2ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7IGhvc3RSZXBvcnRFcnJvciB9IGZyb20gJy4vdXRpbC9ob3N0UmVwb3J0RXJyb3InO1xuXG5leHBvcnQgY29uc3QgZW1wdHk6IE9ic2VydmVyPGFueT4gPSB7XG4gIGNsb3NlZDogdHJ1ZSxcbiAgbmV4dCh2YWx1ZTogYW55KTogdm9pZCB7IC8qIG5vb3AgKi99LFxuICBlcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0UmVwb3J0RXJyb3IoZXJyKTtcbiAgICB9XG4gIH0sXG4gIGNvbXBsZXRlKCk6IHZvaWQgeyAvKm5vb3AqLyB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8ICg8VD4oeDogYW55KTogeCBpcyBUW10gPT4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCh4OiBhbnkpOiB4IGlzIE9iamVjdCB7XG4gIHJldHVybiB4ICE9IG51bGwgJiYgdHlwZW9mIHggPT09ICdvYmplY3QnO1xufVxuIiwiLy8gdHlwZW9mIGFueSBzbyB0aGF0IGl0IHdlIGRvbid0IGhhdmUgdG8gY2FzdCB3aGVuIGNvbXBhcmluZyBhIHJlc3VsdCB0byB0aGUgZXJyb3Igb2JqZWN0XG5leHBvcnQgY29uc3QgZXJyb3JPYmplY3Q6IGFueSA9IHsgZToge30gfTsiLCJpbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4vZXJyb3JPYmplY3QnO1xuXG5sZXQgdHJ5Q2F0Y2hUYXJnZXQ6IEZ1bmN0aW9uO1xuXG5mdW5jdGlvbiB0cnlDYXRjaGVyKHRoaXM6IGFueSk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHRyeUNhdGNoVGFyZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvck9iamVjdC5lID0gZTtcbiAgICByZXR1cm4gZXJyb3JPYmplY3Q7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeUNhdGNoPFQgZXh0ZW5kcyBGdW5jdGlvbj4oZm46IFQpOiBUIHtcbiAgdHJ5Q2F0Y2hUYXJnZXQgPSBmbjtcbiAgcmV0dXJuIDxhbnk+dHJ5Q2F0Y2hlcjtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgVW5zdWJzY3JpcHRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcmVhZG9ubHkgZXJyb3JzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVbnN1YnNjcmlwdGlvbkVycm9yQ3RvciB7XG4gIG5ldyhlcnJvcnM6IGFueVtdKTogVW5zdWJzY3JpcHRpb25FcnJvcjtcbn1cblxuZnVuY3Rpb24gVW5zdWJzY3JpcHRpb25FcnJvckltcGwodGhpczogYW55LCBlcnJvcnM6IGFueVtdKSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9IGVycm9ycyA/XG4gIGAke2Vycm9ycy5sZW5ndGh9IGVycm9ycyBvY2N1cnJlZCBkdXJpbmcgdW5zdWJzY3JpcHRpb246XG4ke2Vycm9ycy5tYXAoKGVyciwgaSkgPT4gYCR7aSArIDF9KSAke2Vyci50b1N0cmluZygpfWApLmpvaW4oJ1xcbiAgJyl9YCA6ICcnO1xuICB0aGlzLm5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG4gIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICByZXR1cm4gdGhpcztcbn1cblxuVW5zdWJzY3JpcHRpb25FcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIG9uZSBvciBtb3JlIGVycm9ycyBoYXZlIG9jY3VycmVkIGR1cmluZyB0aGVcbiAqIGB1bnN1YnNjcmliZWAgb2YgYSB7QGxpbmsgU3Vic2NyaXB0aW9ufS5cbiAqL1xuZXhwb3J0IGNvbnN0IFVuc3Vic2NyaXB0aW9uRXJyb3I6IFVuc3Vic2NyaXB0aW9uRXJyb3JDdG9yID0gVW5zdWJzY3JpcHRpb25FcnJvckltcGwgYXMgYW55OyIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4vdXRpbC9pc09iamVjdCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgVW5zdWJzY3JpcHRpb25FcnJvciB9IGZyb20gJy4vdXRpbC9VbnN1YnNjcmlwdGlvbkVycm9yJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgZGlzcG9zYWJsZSByZXNvdXJjZSwgc3VjaCBhcyB0aGUgZXhlY3V0aW9uIG9mIGFuIE9ic2VydmFibGUuIEFcbiAqIFN1YnNjcmlwdGlvbiBoYXMgb25lIGltcG9ydGFudCBtZXRob2QsIGB1bnN1YnNjcmliZWAsIHRoYXQgdGFrZXMgbm8gYXJndW1lbnRcbiAqIGFuZCBqdXN0IGRpc3Bvc2VzIHRoZSByZXNvdXJjZSBoZWxkIGJ5IHRoZSBzdWJzY3JpcHRpb24uXG4gKlxuICogQWRkaXRpb25hbGx5LCBzdWJzY3JpcHRpb25zIG1heSBiZSBncm91cGVkIHRvZ2V0aGVyIHRocm91Z2ggdGhlIGBhZGQoKWBcbiAqIG1ldGhvZCwgd2hpY2ggd2lsbCBhdHRhY2ggYSBjaGlsZCBTdWJzY3JpcHRpb24gdG8gdGhlIGN1cnJlbnQgU3Vic2NyaXB0aW9uLlxuICogV2hlbiBhIFN1YnNjcmlwdGlvbiBpcyB1bnN1YnNjcmliZWQsIGFsbCBpdHMgY2hpbGRyZW4gKGFuZCBpdHMgZ3JhbmRjaGlsZHJlbilcbiAqIHdpbGwgYmUgdW5zdWJzY3JpYmVkIGFzIHdlbGwuXG4gKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvblxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTGlrZSB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBwdWJsaWMgc3RhdGljIEVNUFRZOiBTdWJzY3JpcHRpb24gPSAoZnVuY3Rpb24oZW1wdHk6IGFueSkge1xuICAgIGVtcHR5LmNsb3NlZCA9IHRydWU7XG4gICAgcmV0dXJuIGVtcHR5O1xuICB9KG5ldyBTdWJzY3JpcHRpb24oKSkpO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGlzIFN1YnNjcmlwdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHVuc3Vic2NyaWJlZC5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBwdWJsaWMgY2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcm90ZWN0ZWQgX3BhcmVudDogU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcm90ZWN0ZWQgX3BhcmVudHM6IFN1YnNjcmlwdGlvbltdID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25MaWtlW10gPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFt1bnN1YnNjcmliZV0gQSBmdW5jdGlvbiBkZXNjcmliaW5nIGhvdyB0b1xuICAgKiBwZXJmb3JtIHRoZSBkaXNwb3NhbCBvZiByZXNvdXJjZXMgd2hlbiB0aGUgYHVuc3Vic2NyaWJlYCBtZXRob2QgaXMgY2FsbGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3IodW5zdWJzY3JpYmU/OiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAoPGFueT4gdGhpcykuX3Vuc3Vic2NyaWJlID0gdW5zdWJzY3JpYmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoZSByZXNvdXJjZXMgaGVsZCBieSB0aGUgc3Vic2NyaXB0aW9uLiBNYXksIGZvciBpbnN0YW5jZSwgY2FuY2VsXG4gICAqIGFuIG9uZ29pbmcgT2JzZXJ2YWJsZSBleGVjdXRpb24gb3IgY2FuY2VsIGFueSBvdGhlciB0eXBlIG9mIHdvcmsgdGhhdFxuICAgKiBzdGFydGVkIHdoZW4gdGhlIFN1YnNjcmlwdGlvbiB3YXMgY3JlYXRlZC5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHVuc3Vic2NyaWJlKCk6IHZvaWQge1xuICAgIGxldCBoYXNFcnJvcnMgPSBmYWxzZTtcbiAgICBsZXQgZXJyb3JzOiBhbnlbXTtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB7IF9wYXJlbnQsIF9wYXJlbnRzLCBfdW5zdWJzY3JpYmUsIF9zdWJzY3JpcHRpb25zIH0gPSAoPGFueT4gdGhpcyk7XG5cbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRzID0gbnVsbDtcbiAgICAvLyBudWxsIG91dCBfc3Vic2NyaXB0aW9ucyBmaXJzdCBzbyBhbnkgY2hpbGQgc3Vic2NyaXB0aW9ucyB0aGF0IGF0dGVtcHRcbiAgICAvLyB0byByZW1vdmUgdGhlbXNlbHZlcyBmcm9tIHRoaXMgc3Vic2NyaXB0aW9uIHdpbGwgbm9vcFxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMgPSBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxlbiA9IF9wYXJlbnRzID8gX3BhcmVudHMubGVuZ3RoIDogMDtcblxuICAgIC8vIGlmIHRoaXMuX3BhcmVudCBpcyBudWxsLCB0aGVuIHNvIGlzIHRoaXMuX3BhcmVudHMsIGFuZCB3ZVxuICAgIC8vIGRvbid0IGhhdmUgdG8gcmVtb3ZlIG91cnNlbHZlcyBmcm9tIGFueSBwYXJlbnQgc3Vic2NyaXB0aW9ucy5cbiAgICB3aGlsZSAoX3BhcmVudCkge1xuICAgICAgX3BhcmVudC5yZW1vdmUodGhpcyk7XG4gICAgICAvLyBpZiB0aGlzLl9wYXJlbnRzIGlzIG51bGwgb3IgaW5kZXggPj0gbGVuLFxuICAgICAgLy8gdGhlbiBfcGFyZW50IGlzIHNldCB0byBudWxsLCBhbmQgdGhlIGxvb3AgZXhpdHNcbiAgICAgIF9wYXJlbnQgPSArK2luZGV4IDwgbGVuICYmIF9wYXJlbnRzW2luZGV4XSB8fCBudWxsO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKF91bnN1YnNjcmliZSkpIHtcbiAgICAgIGxldCB0cmlhbCA9IHRyeUNhdGNoKF91bnN1YnNjcmliZSkuY2FsbCh0aGlzKTtcbiAgICAgIGlmICh0cmlhbCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgaGFzRXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgZXJyb3JzID0gZXJyb3JzIHx8IChcbiAgICAgICAgICBlcnJvck9iamVjdC5lIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvciA/XG4gICAgICAgICAgICBmbGF0dGVuVW5zdWJzY3JpcHRpb25FcnJvcnMoZXJyb3JPYmplY3QuZS5lcnJvcnMpIDogW2Vycm9yT2JqZWN0LmVdXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyYXkoX3N1YnNjcmlwdGlvbnMpKSB7XG5cbiAgICAgIGluZGV4ID0gLTE7XG4gICAgICBsZW4gPSBfc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IHN1YiA9IF9zdWJzY3JpcHRpb25zW2luZGV4XTtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHN1YikpIHtcbiAgICAgICAgICBsZXQgdHJpYWwgPSB0cnlDYXRjaChzdWIudW5zdWJzY3JpYmUpLmNhbGwoc3ViKTtcbiAgICAgICAgICBpZiAodHJpYWwgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzIHx8IFtdO1xuICAgICAgICAgICAgbGV0IGVyciA9IGVycm9yT2JqZWN0LmU7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVW5zdWJzY3JpcHRpb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnIuZXJyb3JzKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNFcnJvcnMpIHtcbiAgICAgIHRocm93IG5ldyBVbnN1YnNjcmlwdGlvbkVycm9yKGVycm9ycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB0ZWFyIGRvd24gdG8gYmUgY2FsbGVkIGR1cmluZyB0aGUgdW5zdWJzY3JpYmUoKSBvZiB0aGlzXG4gICAqIFN1YnNjcmlwdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIHRlYXIgZG93biBiZWluZyBhZGRlZCBpcyBhIHN1YnNjcmlwdGlvbiB0aGF0IGlzIGFscmVhZHlcbiAgICogdW5zdWJzY3JpYmVkLCBpcyB0aGUgc2FtZSByZWZlcmVuY2UgYGFkZGAgaXMgYmVpbmcgY2FsbGVkIG9uLCBvciBpc1xuICAgKiBgU3Vic2NyaXB0aW9uLkVNUFRZYCwgaXQgd2lsbCBub3QgYmUgYWRkZWQuXG4gICAqXG4gICAqIElmIHRoaXMgc3Vic2NyaXB0aW9uIGlzIGFscmVhZHkgaW4gYW4gYGNsb3NlZGAgc3RhdGUsIHRoZSBwYXNzZWRcbiAgICogdGVhciBkb3duIGxvZ2ljIHdpbGwgYmUgZXhlY3V0ZWQgaW1tZWRpYXRlbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7VGVhcmRvd25Mb2dpY30gdGVhcmRvd24gVGhlIGFkZGl0aW9uYWwgbG9naWMgdG8gZXhlY3V0ZSBvblxuICAgKiB0ZWFyZG93bi5cbiAgICogQHJldHVybiB7U3Vic2NyaXB0aW9ufSBSZXR1cm5zIHRoZSBTdWJzY3JpcHRpb24gdXNlZCBvciBjcmVhdGVkIHRvIGJlXG4gICAqIGFkZGVkIHRvIHRoZSBpbm5lciBzdWJzY3JpcHRpb25zIGxpc3QuIFRoaXMgU3Vic2NyaXB0aW9uIGNhbiBiZSB1c2VkIHdpdGhcbiAgICogYHJlbW92ZSgpYCB0byByZW1vdmUgdGhlIHBhc3NlZCB0ZWFyZG93biBsb2dpYyBmcm9tIHRoZSBpbm5lciBzdWJzY3JpcHRpb25zXG4gICAqIGxpc3QuXG4gICAqL1xuICBhZGQodGVhcmRvd246IFRlYXJkb3duTG9naWMpOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICghdGVhcmRvd24gfHwgKHRlYXJkb3duID09PSBTdWJzY3JpcHRpb24uRU1QVFkpKSB7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH1cblxuICAgIGlmICh0ZWFyZG93biA9PT0gdGhpcykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9ICg8U3Vic2NyaXB0aW9uPiB0ZWFyZG93bik7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiB0ZWFyZG93bikge1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKDwoKCkgPT4gdm9pZCkgPiB0ZWFyZG93bik7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoc3Vic2NyaXB0aW9uLmNsb3NlZCB8fCB0eXBlb2Ygc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN1YnNjcmlwdGlvbi5fYWRkUGFyZW50ICE9PSAnZnVuY3Rpb24nIC8qIHF1YWNrIHF1YWNrICovKSB7XG4gICAgICAgICAgY29uc3QgdG1wID0gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICBzdWJzY3JpcHRpb24uX3N1YnNjcmlwdGlvbnMgPSBbdG1wXTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWNvZ25pemVkIHRlYXJkb3duICcgKyB0ZWFyZG93biArICcgYWRkZWQgdG8gU3Vic2NyaXB0aW9uLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLl9zdWJzY3JpcHRpb25zIHx8ICh0aGlzLl9zdWJzY3JpcHRpb25zID0gW10pO1xuXG4gICAgc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgc3Vic2NyaXB0aW9uLl9hZGRQYXJlbnQodGhpcyk7XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBTdWJzY3JpcHRpb24gZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBzdWJzY3JpcHRpb25zIHRoYXQgd2lsbFxuICAgKiB1bnN1YnNjcmliZSBkdXJpbmcgdGhlIHVuc3Vic2NyaWJlIHByb2Nlc3Mgb2YgdGhpcyBTdWJzY3JpcHRpb24uXG4gICAqIEBwYXJhbSB7U3Vic2NyaXB0aW9ufSBzdWJzY3JpcHRpb24gVGhlIHN1YnNjcmlwdGlvbiB0byByZW1vdmUuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICByZW1vdmUoc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5fc3Vic2NyaXB0aW9ucztcbiAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uSW5kZXggPSBzdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9uKTtcbiAgICAgIGlmIChzdWJzY3JpcHRpb25JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5zcGxpY2Uoc3Vic2NyaXB0aW9uSW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHJpdmF0ZSBfYWRkUGFyZW50KHBhcmVudDogU3Vic2NyaXB0aW9uKSB7XG4gICAgbGV0IHsgX3BhcmVudCwgX3BhcmVudHMgfSA9IHRoaXM7XG4gICAgaWYgKCFfcGFyZW50IHx8IF9wYXJlbnQgPT09IHBhcmVudCkge1xuICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHBhcmVudCwgb3IgdGhlIG5ldyBwYXJlbnQgaXMgdGhlIHNhbWUgYXMgdGhlXG4gICAgICAvLyBjdXJyZW50IHBhcmVudCwgdGhlbiBzZXQgdGhpcy5fcGFyZW50IHRvIHRoZSBuZXcgcGFyZW50LlxuICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIH0gZWxzZSBpZiAoIV9wYXJlbnRzKSB7XG4gICAgICAvLyBJZiB0aGVyZSdzIGFscmVhZHkgb25lIHBhcmVudCwgYnV0IG5vdCBtdWx0aXBsZSwgYWxsb2NhdGUgYW4gQXJyYXkgdG9cbiAgICAgIC8vIHN0b3JlIHRoZSByZXN0IG9mIHRoZSBwYXJlbnQgU3Vic2NyaXB0aW9ucy5cbiAgICAgIHRoaXMuX3BhcmVudHMgPSBbcGFyZW50XTtcbiAgICB9IGVsc2UgaWYgKF9wYXJlbnRzLmluZGV4T2YocGFyZW50KSA9PT0gLTEpIHtcbiAgICAgIC8vIE9ubHkgYWRkIHRoZSBuZXcgcGFyZW50IHRvIHRoZSBfcGFyZW50cyBsaXN0IGlmIGl0J3Mgbm90IGFscmVhZHkgdGhlcmUuXG4gICAgICBfcGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5VbnN1YnNjcmlwdGlvbkVycm9ycyhlcnJvcnM6IGFueVtdKSB7XG4gcmV0dXJuIGVycm9ycy5yZWR1Y2UoKGVycnMsIGVycikgPT4gZXJycy5jb25jYXQoKGVyciBpbnN0YW5jZW9mIFVuc3Vic2NyaXB0aW9uRXJyb3IpID8gZXJyLmVycm9ycyA6IGVyciksIFtdKTtcbn1cbiIsIi8qKiBAZGVwcmVjYXRlZCBkbyBub3QgdXNlLCB0aGlzIGlzIG5vIGxvbmdlciBjaGVja2VkIGJ5IFJ4SlMgaW50ZXJuYWxzICovXG5leHBvcnQgY29uc3QgcnhTdWJzY3JpYmVyID1cbiAgdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gU3ltYm9sKCdyeFN1YnNjcmliZXInKVxuICAgIDogJ0BAcnhTdWJzY3JpYmVyXycgKyBNYXRoLnJhbmRvbSgpO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSByeFN1YnNjcmliZXIgaW5zdGVhZFxuICovXG5leHBvcnQgY29uc3QgJCRyeFN1YnNjcmliZXIgPSByeFN1YnNjcmliZXI7XG4iLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZW1wdHkgYXMgZW1wdHlPYnNlcnZlciB9IGZyb20gJy4vT2JzZXJ2ZXInO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIFBhcnRpYWxPYnNlcnZlciwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcnhTdWJzY3JpYmVyIGFzIHJ4U3Vic2NyaWJlclN5bWJvbCB9IGZyb20gJy4uL2ludGVybmFsL3N5bWJvbC9yeFN1YnNjcmliZXInO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0aGUge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UgYW5kIGV4dGVuZHMgdGhlXG4gKiB7QGxpbmsgU3Vic2NyaXB0aW9ufSBjbGFzcy4gV2hpbGUgdGhlIHtAbGluayBPYnNlcnZlcn0gaXMgdGhlIHB1YmxpYyBBUEkgZm9yXG4gKiBjb25zdW1pbmcgdGhlIHZhbHVlcyBvZiBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0sIGFsbCBPYnNlcnZlcnMgZ2V0IGNvbnZlcnRlZCB0b1xuICogYSBTdWJzY3JpYmVyLCBpbiBvcmRlciB0byBwcm92aWRlIFN1YnNjcmlwdGlvbi1saWtlIGNhcGFiaWxpdGllcyBzdWNoIGFzXG4gKiBgdW5zdWJzY3JpYmVgLiBTdWJzY3JpYmVyIGlzIGEgY29tbW9uIHR5cGUgaW4gUnhKUywgYW5kIGNydWNpYWwgZm9yXG4gKiBpbXBsZW1lbnRpbmcgb3BlcmF0b3JzLCBidXQgaXQgaXMgcmFyZWx5IHVzZWQgYXMgYSBwdWJsaWMgQVBJLlxuICpcbiAqIEBjbGFzcyBTdWJzY3JpYmVyPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgT2JzZXJ2ZXI8VD4ge1xuXG4gIFtyeFN1YnNjcmliZXJTeW1ib2xdKCkgeyByZXR1cm4gdGhpczsgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBmYWN0b3J5IGZvciBhIFN1YnNjcmliZXIsIGdpdmVuIGEgKHBvdGVudGlhbGx5IHBhcnRpYWwpIGRlZmluaXRpb25cbiAgICogb2YgYW4gT2JzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oeDogP1QpOiB2b2lkfSBbbmV4dF0gVGhlIGBuZXh0YCBjYWxsYmFjayBvZiBhbiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlOiA/YW55KTogdm9pZH0gW2Vycm9yXSBUaGUgYGVycm9yYCBjYWxsYmFjayBvZiBhblxuICAgKiBPYnNlcnZlci5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIFRoZSBgY29tcGxldGVgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpYmVyPFQ+fSBBIFN1YnNjcmliZXIgd3JhcHBpbmcgdGhlIChwYXJ0aWFsbHkgZGVmaW5lZClcbiAgICogT2JzZXJ2ZXIgcmVwcmVzZW50ZWQgYnkgdGhlIGdpdmVuIGFyZ3VtZW50cy5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGU8VD4obmV4dD86ICh4PzogVCkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHN1YnNjcmliZXIgPSBuZXcgU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIHN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH1cblxuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclZhbHVlOiBhbnkgPSBudWxsO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93bjogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiogQGludGVybmFsICovIHN5bmNFcnJvclRocm93YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBpc1N0b3BwZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8YW55PiB8IFN1YnNjcmliZXI8YW55PjsgLy8gdGhpcyBgYW55YCBpcyB0aGUgZXNjYXBlIGhhdGNoIHRvIGVyYXNlIGV4dHJhIHR5cGUgcGFyYW0gKGUuZy4gUilcblxuICBwcml2YXRlIF9wYXJlbnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gW2Rlc3RpbmF0aW9uT3JOZXh0XSBBIHBhcnRpYWxseVxuICAgKiBkZWZpbmVkIE9ic2VydmVyIG9yIGEgYG5leHRgIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGU6ID9hbnkpOiB2b2lkfSBbZXJyb3JdIFRoZSBgZXJyb3JgIGNhbGxiYWNrIG9mIGFuXG4gICAqIE9ic2VydmVyLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gVGhlIGBjb21wbGV0ZWAgY2FsbGJhY2sgb2YgYW5cbiAgICogT2JzZXJ2ZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbk9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxhbnk+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGVtcHR5T2JzZXJ2ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uT3JOZXh0KSB7XG4gICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGVtcHR5T2JzZXJ2ZXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbk9yTmV4dCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBpZiAoZGVzdGluYXRpb25Pck5leHQgaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN5bmNFcnJvclRocm93YWJsZSA9IGRlc3RpbmF0aW9uT3JOZXh0LnN5bmNFcnJvclRocm93YWJsZTtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbk9yTmV4dDtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uT3JOZXh0LmFkZCh0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zeW5jRXJyb3JUaHJvd2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8UGFydGlhbE9ic2VydmVyPGFueT4+IGRlc3RpbmF0aW9uT3JOZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuc3luY0Vycm9yVGhyb3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBTYWZlU3Vic2NyaWJlcjxUPih0aGlzLCA8KCh2YWx1ZTogVCkgPT4gdm9pZCk+IGRlc3RpbmF0aW9uT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYG5leHRgIGZyb21cbiAgICogdGhlIE9ic2VydmFibGUsIHdpdGggYSB2YWx1ZS4gVGhlIE9ic2VydmFibGUgbWF5IGNhbGwgdGhpcyBtZXRob2QgMCBvciBtb3JlXG4gICAqIHRpbWVzLlxuICAgKiBAcGFyYW0ge1R9IFt2YWx1ZV0gVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIG5leHQodmFsdWU/OiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5fbmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgT2JzZXJ2ZXJ9IGNhbGxiYWNrIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvZiB0eXBlIGBlcnJvcmAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZSwgd2l0aCBhbiBhdHRhY2hlZCBgRXJyb3JgLiBOb3RpZmllcyB0aGUgT2JzZXJ2ZXIgdGhhdFxuICAgKiB0aGUgT2JzZXJ2YWJsZSBoYXMgZXhwZXJpZW5jZWQgYW4gZXJyb3IgY29uZGl0aW9uLlxuICAgKiBAcGFyYW0ge2FueX0gW2Vycl0gVGhlIGBlcnJvcmAgZXhjZXB0aW9uLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgZXJyb3IoZXJyPzogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHtAbGluayBPYnNlcnZlcn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBhIHZhbHVlbGVzcyBub3RpZmljYXRpb24gb2YgdHlwZVxuICAgKiBgY29tcGxldGVgIGZyb20gdGhlIE9ic2VydmFibGUuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0IHRoZSBPYnNlcnZhYmxlXG4gICAqIGhhcyBmaW5pc2hlZCBzZW5kaW5nIHB1c2gtYmFzZWQgbm90aWZpY2F0aW9ucy5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHsgX3BhcmVudCwgX3BhcmVudHMgfSA9IHRoaXM7XG4gICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRzID0gbnVsbDtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgdGhpcy5fcGFyZW50cyA9IF9wYXJlbnRzO1xuICAgIHRoaXMuX3BhcmVudFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBTYWZlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgX2NvbnRleHQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJlbnRTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBvYnNlcnZlck9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgbGV0IG5leHQ6ICgodmFsdWU6IFQpID0+IHZvaWQpO1xuICAgIGxldCBjb250ZXh0OiBhbnkgPSB0aGlzO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICBuZXh0ID0gKDwoKHZhbHVlOiBUKSA9PiB2b2lkKT4gb2JzZXJ2ZXJPck5leHQpO1xuICAgIH0gZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgIG5leHQgPSAoPFBhcnRpYWxPYnNlcnZlcjxUPj4gb2JzZXJ2ZXJPck5leHQpLm5leHQ7XG4gICAgICBlcnJvciA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuZXJyb3I7XG4gICAgICBjb21wbGV0ZSA9ICg8UGFydGlhbE9ic2VydmVyPFQ+PiBvYnNlcnZlck9yTmV4dCkuY29tcGxldGU7XG4gICAgICBpZiAob2JzZXJ2ZXJPck5leHQgIT09IGVtcHR5T2JzZXJ2ZXIpIHtcbiAgICAgICAgY29udGV4dCA9IE9iamVjdC5jcmVhdGUob2JzZXJ2ZXJPck5leHQpO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0LnVuc3Vic2NyaWJlKSkge1xuICAgICAgICAgIHRoaXMuYWRkKDwoKSA9PiB2b2lkPiBjb250ZXh0LnVuc3Vic2NyaWJlLmJpbmQoY29udGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQudW5zdWJzY3JpYmUgPSB0aGlzLnVuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5fbmV4dCA9IG5leHQ7XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkICYmIHRoaXMuX25leHQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgdGhpcy5fX3RyeU9yVW5zdWIodGhpcy5fbmV4dCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgdGhpcy5fbmV4dCwgdmFsdWUpKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IF9wYXJlbnRTdWJzY3JpYmVyIH0gPSB0aGlzO1xuICAgICAgY29uc3QgeyB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIH0gPSBjb25maWc7XG4gICAgICBpZiAodGhpcy5fZXJyb3IpIHtcbiAgICAgICAgaWYgKCF1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih0aGlzLl9lcnJvciwgZXJyKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX3RyeU9yU2V0RXJyb3IoX3BhcmVudFN1YnNjcmliZXIsIHRoaXMuX2Vycm9yLCBlcnIpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghX3BhcmVudFN1YnNjcmliZXIuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgaWYgKHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgICAgIF9wYXJlbnRTdWJzY3JpYmVyLnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgX3BhcmVudFN1YnNjcmliZXIgfSA9IHRoaXM7XG4gICAgICBpZiAodGhpcy5fY29tcGxldGUpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZENvbXBsZXRlID0gKCkgPT4gdGhpcy5fY29tcGxldGUuY2FsbCh0aGlzLl9jb250ZXh0KTtcblxuICAgICAgICBpZiAoIWNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nIHx8ICFfcGFyZW50U3Vic2NyaWJlci5zeW5jRXJyb3JUaHJvd2FibGUpIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JVbnN1Yih3cmFwcGVkQ29tcGxldGUpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fdHJ5T3JTZXRFcnJvcihfcGFyZW50U3Vic2NyaWJlciwgd3JhcHBlZENvbXBsZXRlKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9fdHJ5T3JVbnN1YihmbjogRnVuY3Rpb24sIHZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX190cnlPclNldEVycm9yKHBhcmVudDogU3Vic2NyaWJlcjxUPiwgZm46IEZ1bmN0aW9uLCB2YWx1ZT86IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYmFkIGNhbGwnKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGZuLmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHBhcmVudC5zeW5jRXJyb3JWYWx1ZSA9IGVycjtcbiAgICAgICAgcGFyZW50LnN5bmNFcnJvclRocm93biA9IHRydWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKTogdm9pZCB7XG4gICAgY29uc3QgeyBfcGFyZW50U3Vic2NyaWJlciB9ID0gdGhpcztcbiAgICB0aGlzLl9jb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLl9wYXJlbnRTdWJzY3JpYmVyID0gbnVsbDtcbiAgICBfcGFyZW50U3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBFcnJvck9ic2VydmVyIGlzIGNsb3NlZCBvciBzdG9wcGVkIG9yIGhhcyBhXG4gKiBkZXN0aW5hdGlvbiB0aGF0IGlzIGNsb3NlZCBvciBzdG9wcGVkIC0gaW4gd2hpY2ggY2FzZSBlcnJvcnMgd2lsbFxuICogbmVlZCB0byBiZSByZXBvcnRlZCB2aWEgYSBkaWZmZXJlbnQgbWVjaGFuaXNtLlxuICogQHBhcmFtIG9ic2VydmVyIHRoZSBvYnNlcnZlclxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuUmVwb3J0RXJyb3Iob2JzZXJ2ZXI6IFN1YnNjcmliZXI8YW55PiB8IFN1YmplY3Q8YW55Pik6IGJvb2xlYW4ge1xuICB3aGlsZSAob2JzZXJ2ZXIpIHtcbiAgICBjb25zdCB7IGNsb3NlZCwgZGVzdGluYXRpb24sIGlzU3RvcHBlZCB9ID0gb2JzZXJ2ZXIgYXMgYW55O1xuICAgIGlmIChjbG9zZWQgfHwgaXNTdG9wcGVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbiBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHtcbiAgICAgIG9ic2VydmVyID0gZGVzdGluYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ic2VydmVyID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyByeFN1YnNjcmliZXIgYXMgcnhTdWJzY3JpYmVyU3ltYm9sIH0gZnJvbSAnLi4vc3ltYm9sL3J4U3Vic2NyaWJlcic7XG5pbXBvcnQgeyBlbXB0eSBhcyBlbXB0eU9ic2VydmVyIH0gZnJvbSAnLi4vT2JzZXJ2ZXInO1xuaW1wb3J0IHsgUGFydGlhbE9ic2VydmVyIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9TdWJzY3JpYmVyPFQ+KFxuICBuZXh0T3JPYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkLFxuICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpYmVyPFQ+IHtcblxuICBpZiAobmV4dE9yT2JzZXJ2ZXIpIHtcbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB7XG4gICAgICByZXR1cm4gKDxTdWJzY3JpYmVyPFQ+PiBuZXh0T3JPYnNlcnZlcik7XG4gICAgfVxuXG4gICAgaWYgKG5leHRPck9ic2VydmVyW3J4U3Vic2NyaWJlclN5bWJvbF0pIHtcbiAgICAgIHJldHVybiBuZXh0T3JPYnNlcnZlcltyeFN1YnNjcmliZXJTeW1ib2xdKCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFuZXh0T3JPYnNlcnZlciAmJiAhZXJyb3IgJiYgIWNvbXBsZXRlKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpYmVyKGVtcHR5T2JzZXJ2ZXIpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdWJzY3JpYmVyKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpO1xufVxuIiwiaW1wb3J0IHsgcm9vdCB9IGZyb20gJy4uL3V0aWwvcm9vdCc7XG5cbi8qKiBTeW1ib2wub2JzZXJ2YWJsZSBhZGRpdGlvbiAqL1xuLyogTm90ZTogVGhpcyB3aWxsIGFkZCBTeW1ib2wub2JzZXJ2YWJsZSBnbG9iYWxseSBmb3IgYWxsIFR5cGVTY3JpcHQgdXNlcnMsXG4gIGhvd2V2ZXIsIHdlIGFyZSBubyBsb25nZXIgcG9seWZpbGxpbmcgU3ltYm9sLm9ic2VydmFibGUgKi9cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFN5bWJvbENvbnN0cnVjdG9yIHtcbiAgICByZWFkb25seSBvYnNlcnZhYmxlOiBzeW1ib2w7XG4gIH1cbn1cblxuLyoqIFN5bWJvbC5vYnNlcnZhYmxlIG9yIGEgc3RyaW5nIFwiQEBvYnNlcnZhYmxlXCIuIFVzZWQgZm9yIGludGVyb3AgKi9cbmV4cG9ydCBjb25zdCBvYnNlcnZhYmxlID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wub2JzZXJ2YWJsZSB8fCAnQEBvYnNlcnZhYmxlJztcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWVtcHR5ICovXG5leHBvcnQgZnVuY3Rpb24gbm9vcCgpIHsgfVxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vbm9vcCc7XG5pbXBvcnQgeyBVbmFyeUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBwaXBlPFQ+KCk6IFVuYXJ5RnVuY3Rpb248VCwgVD47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4pOiBVbmFyeUZ1bmN0aW9uPFQsIEE+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQj4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4pOiBVbmFyeUZ1bmN0aW9uPFQsIEI+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQz4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPik6IFVuYXJ5RnVuY3Rpb248VCwgQz47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBEPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4pOiBVbmFyeUZ1bmN0aW9uPFQsIEQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRT4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4pOiBVbmFyeUZ1bmN0aW9uPFQsIEU+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRj4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPik6IFVuYXJ5RnVuY3Rpb248VCwgRj47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4pOiBVbmFyeUZ1bmN0aW9uPFQsIEc+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRiwgRywgSD4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPiwgZm43OiBVbmFyeUZ1bmN0aW9uPEYsIEc+LCBmbjg6IFVuYXJ5RnVuY3Rpb248RywgSD4pOiBVbmFyeUZ1bmN0aW9uPFQsIEg+O1xuZXhwb3J0IGZ1bmN0aW9uIHBpcGU8VCwgQSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4oZm4xOiBVbmFyeUZ1bmN0aW9uPFQsIEE+LCBmbjI6IFVuYXJ5RnVuY3Rpb248QSwgQj4sIGZuMzogVW5hcnlGdW5jdGlvbjxCLCBDPiwgZm40OiBVbmFyeUZ1bmN0aW9uPEMsIEQ+LCBmbjU6IFVuYXJ5RnVuY3Rpb248RCwgRT4sIGZuNjogVW5hcnlGdW5jdGlvbjxFLCBGPiwgZm43OiBVbmFyeUZ1bmN0aW9uPEYsIEc+LCBmbjg6IFVuYXJ5RnVuY3Rpb248RywgSD4sIGZuOTogVW5hcnlGdW5jdGlvbjxILCBJPik6IFVuYXJ5RnVuY3Rpb248VCwgST47XG5leHBvcnQgZnVuY3Rpb24gcGlwZTxULCBBLCBCLCBDLCBELCBFLCBGLCBHLCBILCBJPihmbjE6IFVuYXJ5RnVuY3Rpb248VCwgQT4sIGZuMjogVW5hcnlGdW5jdGlvbjxBLCBCPiwgZm4zOiBVbmFyeUZ1bmN0aW9uPEIsIEM+LCBmbjQ6IFVuYXJ5RnVuY3Rpb248QywgRD4sIGZuNTogVW5hcnlGdW5jdGlvbjxELCBFPiwgZm42OiBVbmFyeUZ1bmN0aW9uPEUsIEY+LCBmbjc6IFVuYXJ5RnVuY3Rpb248RiwgRz4sIGZuODogVW5hcnlGdW5jdGlvbjxHLCBIPiwgZm45OiBVbmFyeUZ1bmN0aW9uPEgsIEk+LCAuLi5mbnM6IFVuYXJ5RnVuY3Rpb248YW55LCBhbnk+W10pOiBVbmFyeUZ1bmN0aW9uPFQsIHt9Pjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwaXBlKC4uLmZuczogQXJyYXk8VW5hcnlGdW5jdGlvbjxhbnksIGFueT4+KTogVW5hcnlGdW5jdGlvbjxhbnksIGFueT4ge1xuICByZXR1cm4gcGlwZUZyb21BcnJheShmbnMpO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheTxULCBSPihmbnM6IEFycmF5PFVuYXJ5RnVuY3Rpb248VCwgUj4+KTogVW5hcnlGdW5jdGlvbjxULCBSPiB7XG4gIGlmICghZm5zKSB7XG4gICAgcmV0dXJuIG5vb3AgYXMgVW5hcnlGdW5jdGlvbjxhbnksIGFueT47XG4gIH1cblxuICBpZiAoZm5zLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmbnNbMF07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gcGlwZWQoaW5wdXQ6IFQpOiBSIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldjogYW55LCBmbjogVW5hcnlGdW5jdGlvbjxULCBSPikgPT4gZm4ocHJldiksIGlucHV0IGFzIGFueSk7XG4gIH07XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljLCBPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFN1YnNjcmliYWJsZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgY2FuUmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvY2FuUmVwb3J0RXJyb3InO1xuaW1wb3J0IHsgdG9TdWJzY3JpYmVyIH0gZnJvbSAnLi91dGlsL3RvU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpaWYgfSBmcm9tICcuL29ic2VydmFibGUvaWlmJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgcGlwZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbC9waXBlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGFueSBzZXQgb2YgdmFsdWVzIG92ZXIgYW55IGFtb3VudCBvZiB0aW1lLiBUaGlzIGlzIHRoZSBtb3N0IGJhc2ljIGJ1aWxkaW5nIGJsb2NrXG4gKiBvZiBSeEpTLlxuICpcbiAqIEBjbGFzcyBPYnNlcnZhYmxlPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaWJhYmxlPFQ+IHtcblxuICAvKiogSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlIGRpcmVjdGx5LiAqL1xuICBwdWJsaWMgX2lzU2NhbGFyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBzb3VyY2U6IE9ic2VydmFibGU8YW55PjtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIG9wZXJhdG9yOiBPcGVyYXRvcjxhbnksIFQ+O1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBPYnNlcnZhYmxlIGlzXG4gICAqIGluaXRpYWxseSBzdWJzY3JpYmVkIHRvLiBUaGlzIGZ1bmN0aW9uIGlzIGdpdmVuIGEgU3Vic2NyaWJlciwgdG8gd2hpY2ggbmV3IHZhbHVlc1xuICAgKiBjYW4gYmUgYG5leHRgZWQsIG9yIGFuIGBlcnJvcmAgbWV0aG9kIGNhbiBiZSBjYWxsZWQgdG8gcmFpc2UgYW4gZXJyb3IsIG9yXG4gICAqIGBjb21wbGV0ZWAgY2FuIGJlIGNhbGxlZCB0byBub3RpZnkgb2YgYSBzdWNjZXNzZnVsIGNvbXBsZXRpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdWJzY3JpYmU/OiAodGhpczogT2JzZXJ2YWJsZTxUPiwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4gVGVhcmRvd25Mb2dpYykge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvLyBIQUNLOiBTaW5jZSBUeXBlU2NyaXB0IGluaGVyaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvbywgd2UgaGF2ZSB0b1xuICAvLyBmaWdodCBhZ2FpbnN0IFR5cGVTY3JpcHQgaGVyZSBzbyBTdWJqZWN0IGNhbiBoYXZlIGEgZGlmZmVyZW50IHN0YXRpYyBjcmVhdGUgc2lnbmF0dXJlXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNvbGQgT2JzZXJ2YWJsZSBieSBjYWxsaW5nIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEBzdGF0aWMgdHJ1ZVxuICAgKiBAb3duZXIgT2JzZXJ2YWJsZVxuICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmU/IHRoZSBzdWJzY3JpYmVyIGZ1bmN0aW9uIHRvIGJlIHBhc3NlZCB0byB0aGUgT2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhIG5ldyBjb2xkIG9ic2VydmFibGVcbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGU6IEZ1bmN0aW9uID0gPFQ+KHN1YnNjcmliZT86IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiBUZWFyZG93bkxvZ2ljKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlLCB3aXRoIHRoaXMgT2JzZXJ2YWJsZSBhcyB0aGUgc291cmNlLCBhbmQgdGhlIHBhc3NlZFxuICAgKiBvcGVyYXRvciBkZWZpbmVkIGFzIHRoZSBuZXcgb2JzZXJ2YWJsZSdzIG9wZXJhdG9yLlxuICAgKiBAbWV0aG9kIGxpZnRcbiAgICogQHBhcmFtIHtPcGVyYXRvcn0gb3BlcmF0b3IgdGhlIG9wZXJhdG9yIGRlZmluaW5nIHRoZSBvcGVyYXRpb24gdG8gdGFrZSBvbiB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhIG5ldyBvYnNlcnZhYmxlIHdpdGggdGhlIE9wZXJhdG9yIGFwcGxpZWRcbiAgICovXG4gIGxpZnQ8Uj4ob3BlcmF0b3I6IE9wZXJhdG9yPFQsIFI+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFI+KCk7XG4gICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgIG9ic2VydmFibGUub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHN1YnNjcmliZShvYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPik6IFN1YnNjcmlwdGlvbjtcbiAgc3Vic2NyaWJlKG5leHQ/OiAodmFsdWU6IFQpID0+IHZvaWQsIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbjtcbiAgLyoqXG4gICAqIEludm9rZXMgYW4gZXhlY3V0aW9uIG9mIGFuIE9ic2VydmFibGUgYW5kIHJlZ2lzdGVycyBPYnNlcnZlciBoYW5kbGVycyBmb3Igbm90aWZpY2F0aW9ucyBpdCB3aWxsIGVtaXQuXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Vc2UgaXQgd2hlbiB5b3UgaGF2ZSBhbGwgdGhlc2UgT2JzZXJ2YWJsZXMsIGJ1dCBzdGlsbCBub3RoaW5nIGlzIGhhcHBlbmluZy48L3NwYW4+XG4gICAqXG4gICAqIGBzdWJzY3JpYmVgIGlzIG5vdCBhIHJlZ3VsYXIgb3BlcmF0b3IsIGJ1dCBhIG1ldGhvZCB0aGF0IGNhbGxzIE9ic2VydmFibGUncyBpbnRlcm5hbCBgc3Vic2NyaWJlYCBmdW5jdGlvbi4gSXRcbiAgICogbWlnaHQgYmUgZm9yIGV4YW1wbGUgYSBmdW5jdGlvbiB0aGF0IHlvdSBwYXNzZWQgdG8gT2JzZXJ2YWJsZSdzIGNvbnN0cnVjdG9yLCBidXQgbW9zdCBvZiB0aGUgdGltZSBpdCBpc1xuICAgKiBhIGxpYnJhcnkgaW1wbGVtZW50YXRpb24sIHdoaWNoIGRlZmluZXMgd2hhdCB3aWxsIGJlIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSwgYW5kIHdoZW4gaXQgYmUgd2lsbCBlbWl0dGVkLiBUaGlzIG1lYW5zXG4gICAqIHRoYXQgY2FsbGluZyBgc3Vic2NyaWJlYCBpcyBhY3R1YWxseSB0aGUgbW9tZW50IHdoZW4gT2JzZXJ2YWJsZSBzdGFydHMgaXRzIHdvcmssIG5vdCB3aGVuIGl0IGlzIGNyZWF0ZWQsIGFzIGl0IGlzIG9mdGVuXG4gICAqIHRoZSB0aG91Z2h0LlxuICAgKlxuICAgKiBBcGFydCBmcm9tIHN0YXJ0aW5nIHRoZSBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZSwgdGhpcyBtZXRob2QgYWxsb3dzIHlvdSB0byBsaXN0ZW4gZm9yIHZhbHVlc1xuICAgKiB0aGF0IGFuIE9ic2VydmFibGUgZW1pdHMsIGFzIHdlbGwgYXMgZm9yIHdoZW4gaXQgY29tcGxldGVzIG9yIGVycm9ycy4gWW91IGNhbiBhY2hpZXZlIHRoaXMgaW4gdHdvXG4gICAqIG9mIHRoZSBmb2xsb3dpbmcgd2F5cy5cbiAgICpcbiAgICogVGhlIGZpcnN0IHdheSBpcyBjcmVhdGluZyBhbiBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIHtAbGluayBPYnNlcnZlcn0gaW50ZXJmYWNlLiBJdCBzaG91bGQgaGF2ZSBtZXRob2RzXG4gICAqIGRlZmluZWQgYnkgdGhhdCBpbnRlcmZhY2UsIGJ1dCBub3RlIHRoYXQgaXQgc2hvdWxkIGJlIGp1c3QgYSByZWd1bGFyIEphdmFTY3JpcHQgb2JqZWN0LCB3aGljaCB5b3UgY2FuIGNyZWF0ZVxuICAgKiB5b3Vyc2VsZiBpbiBhbnkgd2F5IHlvdSB3YW50IChFUzYgY2xhc3MsIGNsYXNzaWMgZnVuY3Rpb24gY29uc3RydWN0b3IsIG9iamVjdCBsaXRlcmFsIGV0Yy4pLiBJbiBwYXJ0aWN1bGFyIGRvXG4gICAqIG5vdCBhdHRlbXB0IHRvIHVzZSBhbnkgUnhKUyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIHRvIGNyZWF0ZSBPYnNlcnZlcnMgLSB5b3UgZG9uJ3QgbmVlZCB0aGVtLiBSZW1lbWJlciBhbHNvXG4gICAqIHRoYXQgeW91ciBvYmplY3QgZG9lcyBub3QgaGF2ZSB0byBpbXBsZW1lbnQgYWxsIG1ldGhvZHMuIElmIHlvdSBmaW5kIHlvdXJzZWxmIGNyZWF0aW5nIGEgbWV0aG9kIHRoYXQgZG9lc24ndFxuICAgKiBkbyBhbnl0aGluZywgeW91IGNhbiBzaW1wbHkgb21pdCBpdC4gTm90ZSBob3dldmVyLCBpZiB0aGUgYGVycm9yYCBtZXRob2QgaXMgbm90IHByb3ZpZGVkLCBhbGwgZXJyb3JzIHdpbGxcbiAgICogYmUgbGVmdCB1bmNhdWdodC5cbiAgICpcbiAgICogVGhlIHNlY29uZCB3YXkgaXMgdG8gZ2l2ZSB1cCBvbiBPYnNlcnZlciBvYmplY3QgYWx0b2dldGhlciBhbmQgc2ltcGx5IHByb3ZpZGUgY2FsbGJhY2sgZnVuY3Rpb25zIGluIHBsYWNlIG9mIGl0cyBtZXRob2RzLlxuICAgKiBUaGlzIG1lYW5zIHlvdSBjYW4gcHJvdmlkZSB0aHJlZSBmdW5jdGlvbnMgYXMgYXJndW1lbnRzIHRvIGBzdWJzY3JpYmVgLCB3aGVyZSB0aGUgZmlyc3QgZnVuY3Rpb24gaXMgZXF1aXZhbGVudFxuICAgKiBvZiBhIGBuZXh0YCBtZXRob2QsIHRoZSBzZWNvbmQgb2YgYW4gYGVycm9yYCBtZXRob2QgYW5kIHRoZSB0aGlyZCBvZiBhIGBjb21wbGV0ZWAgbWV0aG9kLiBKdXN0IGFzIGluIGNhc2Ugb2YgT2JzZXJ2ZXIsXG4gICAqIGlmIHlvdSBkbyBub3QgbmVlZCB0byBsaXN0ZW4gZm9yIHNvbWV0aGluZywgeW91IGNhbiBvbWl0IGEgZnVuY3Rpb24sIHByZWZlcmFibHkgYnkgcGFzc2luZyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsXG4gICAqIHNpbmNlIGBzdWJzY3JpYmVgIHJlY29nbml6ZXMgdGhlc2UgZnVuY3Rpb25zIGJ5IHdoZXJlIHRoZXkgd2VyZSBwbGFjZWQgaW4gZnVuY3Rpb24gY2FsbC4gV2hlbiBpdCBjb21lc1xuICAgKiB0byBgZXJyb3JgIGZ1bmN0aW9uLCBqdXN0IGFzIGJlZm9yZSwgaWYgbm90IHByb3ZpZGVkLCBlcnJvcnMgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlIHdpbGwgYmUgdGhyb3duLlxuICAgKlxuICAgKiBXaGljaGV2ZXIgc3R5bGUgb2YgY2FsbGluZyBgc3Vic2NyaWJlYCB5b3UgdXNlLCBpbiBib3RoIGNhc2VzIGl0IHJldHVybnMgYSBTdWJzY3JpcHRpb24gb2JqZWN0LlxuICAgKiBUaGlzIG9iamVjdCBhbGxvd3MgeW91IHRvIGNhbGwgYHVuc3Vic2NyaWJlYCBvbiBpdCwgd2hpY2ggaW4gdHVybiB3aWxsIHN0b3AgdGhlIHdvcmsgdGhhdCBhbiBPYnNlcnZhYmxlIGRvZXMgYW5kIHdpbGwgY2xlYW5cbiAgICogdXAgYWxsIHJlc291cmNlcyB0aGF0IGFuIE9ic2VydmFibGUgdXNlZC4gTm90ZSB0aGF0IGNhbmNlbGxpbmcgYSBzdWJzY3JpcHRpb24gd2lsbCBub3QgY2FsbCBgY29tcGxldGVgIGNhbGxiYWNrXG4gICAqIHByb3ZpZGVkIHRvIGBzdWJzY3JpYmVgIGZ1bmN0aW9uLCB3aGljaCBpcyByZXNlcnZlZCBmb3IgYSByZWd1bGFyIGNvbXBsZXRpb24gc2lnbmFsIHRoYXQgY29tZXMgZnJvbSBhbiBPYnNlcnZhYmxlLlxuICAgKlxuICAgKiBSZW1lbWJlciB0aGF0IGNhbGxiYWNrcyBwcm92aWRlZCB0byBgc3Vic2NyaWJlYCBhcmUgbm90IGd1YXJhbnRlZWQgdG8gYmUgY2FsbGVkIGFzeW5jaHJvbm91c2x5LlxuICAgKiBJdCBpcyBhbiBPYnNlcnZhYmxlIGl0c2VsZiB0aGF0IGRlY2lkZXMgd2hlbiB0aGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWQuIEZvciBleGFtcGxlIHtAbGluayBvZn1cbiAgICogYnkgZGVmYXVsdCBlbWl0cyBhbGwgaXRzIHZhbHVlcyBzeW5jaHJvbm91c2x5LiBBbHdheXMgY2hlY2sgZG9jdW1lbnRhdGlvbiBmb3IgaG93IGdpdmVuIE9ic2VydmFibGVcbiAgICogd2lsbCBiZWhhdmUgd2hlbiBzdWJzY3JpYmVkIGFuZCBpZiBpdHMgZGVmYXVsdCBiZWhhdmlvciBjYW4gYmUgbW9kaWZpZWQgd2l0aCBhIGBzY2hlZHVsZXJgLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqICMjIyBTdWJzY3JpYmUgd2l0aCBhbiBPYnNlcnZlclxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IHN1bU9ic2VydmVyID0ge1xuICAgKiAgIHN1bTogMCxcbiAgICogICBuZXh0KHZhbHVlKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnQWRkaW5nOiAnICsgdmFsdWUpO1xuICAgKiAgICAgdGhpcy5zdW0gPSB0aGlzLnN1bSArIHZhbHVlO1xuICAgKiAgIH0sXG4gICAqICAgZXJyb3IoKSB7IC8vIFdlIGFjdHVhbGx5IGNvdWxkIGp1c3QgcmVtb3ZlIHRoaXMgbWV0aG9kLFxuICAgKiAgIH0sICAgICAgICAvLyBzaW5jZSB3ZSBkbyBub3QgcmVhbGx5IGNhcmUgYWJvdXQgZXJyb3JzIHJpZ2h0IG5vdy5cbiAgICogICBjb21wbGV0ZSgpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdTdW0gZXF1YWxzOiAnICsgdGhpcy5zdW0pO1xuICAgKiAgIH1cbiAgICogfTtcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5vZigxLCAyLCAzKSAvLyBTeW5jaHJvbm91c2x5IGVtaXRzIDEsIDIsIDMgYW5kIHRoZW4gY29tcGxldGVzLlxuICAgKiAuc3Vic2NyaWJlKHN1bU9ic2VydmVyKTtcbiAgICpcbiAgICogLy8gTG9nczpcbiAgICogLy8gXCJBZGRpbmc6IDFcIlxuICAgKiAvLyBcIkFkZGluZzogMlwiXG4gICAqIC8vIFwiQWRkaW5nOiAzXCJcbiAgICogLy8gXCJTdW0gZXF1YWxzOiA2XCJcbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBTdWJzY3JpYmUgd2l0aCBmdW5jdGlvbnNcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBsZXQgc3VtID0gMDtcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5vZigxLCAyLCAzKVxuICAgKiAuc3Vic2NyaWJlKFxuICAgKiAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnQWRkaW5nOiAnICsgdmFsdWUpO1xuICAgKiAgICAgc3VtID0gc3VtICsgdmFsdWU7XG4gICAqICAgfSxcbiAgICogICB1bmRlZmluZWQsXG4gICAqICAgZnVuY3Rpb24oKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnU3VtIGVxdWFsczogJyArIHN1bSk7XG4gICAqICAgfVxuICAgKiApO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcIkFkZGluZzogMVwiXG4gICAqIC8vIFwiQWRkaW5nOiAyXCJcbiAgICogLy8gXCJBZGRpbmc6IDNcIlxuICAgKiAvLyBcIlN1bSBlcXVhbHM6IDZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIENhbmNlbCBhIHN1YnNjcmlwdGlvblxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGNvbnN0IHN1YnNjcmlwdGlvbiA9IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwMCkuc3Vic2NyaWJlKFxuICAgKiAgIG51bSA9PiBjb25zb2xlLmxvZyhudW0pLFxuICAgKiAgIHVuZGVmaW5lZCxcbiAgICogICAoKSA9PiBjb25zb2xlLmxvZygnY29tcGxldGVkIScpIC8vIFdpbGwgbm90IGJlIGNhbGxlZCwgZXZlblxuICAgKiApOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBjYW5jZWxsaW5nIHN1YnNjcmlwdGlvblxuICAgKlxuICAgKlxuICAgKiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICogICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICogICBjb25zb2xlLmxvZygndW5zdWJzY3JpYmVkIScpO1xuICAgKiB9LCAyNTAwKTtcbiAgICpcbiAgICogLy8gTG9nczpcbiAgICogLy8gMCBhZnRlciAxc1xuICAgKiAvLyAxIGFmdGVyIDJzXG4gICAqIC8vIFwidW5zdWJzY3JpYmVkIVwiIGFmdGVyIDIuNXNcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ8RnVuY3Rpb259IG9ic2VydmVyT3JOZXh0IChvcHRpb25hbCkgRWl0aGVyIGFuIG9ic2VydmVyIHdpdGggbWV0aG9kcyB0byBiZSBjYWxsZWQsXG4gICAqICBvciB0aGUgZmlyc3Qgb2YgdGhyZWUgcG9zc2libGUgaGFuZGxlcnMsIHdoaWNoIGlzIHRoZSBoYW5kbGVyIGZvciBlYWNoIHZhbHVlIGVtaXR0ZWQgZnJvbSB0aGUgc3Vic2NyaWJlZFxuICAgKiAgT2JzZXJ2YWJsZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZXJyb3IgKG9wdGlvbmFsKSBBIGhhbmRsZXIgZm9yIGEgdGVybWluYWwgZXZlbnQgcmVzdWx0aW5nIGZyb20gYW4gZXJyb3IuIElmIG5vIGVycm9yIGhhbmRsZXIgaXMgcHJvdmlkZWQsXG4gICAqICB0aGUgZXJyb3Igd2lsbCBiZSB0aHJvd24gYXMgdW5oYW5kbGVkLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wbGV0ZSAob3B0aW9uYWwpIEEgaGFuZGxlciBmb3IgYSB0ZXJtaW5hbCBldmVudCByZXN1bHRpbmcgZnJvbSBzdWNjZXNzZnVsIGNvbXBsZXRpb24uXG4gICAqIEByZXR1cm4ge0lTdWJzY3JpcHRpb259IGEgc3Vic2NyaXB0aW9uIHJlZmVyZW5jZSB0byB0aGUgcmVnaXN0ZXJlZCBoYW5kbGVyc1xuICAgKiBAbWV0aG9kIHN1YnNjcmliZVxuICAgKi9cbiAgc3Vic2NyaWJlKG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uIHtcblxuICAgIGNvbnN0IHsgb3BlcmF0b3IgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2luayA9IHRvU3Vic2NyaWJlcihvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlKTtcblxuICAgIGlmIChvcGVyYXRvcikge1xuICAgICAgb3BlcmF0b3IuY2FsbChzaW5rLCB0aGlzLnNvdXJjZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpbmsuYWRkKFxuICAgICAgICB0aGlzLnNvdXJjZSB8fCAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgJiYgIXNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSA/XG4gICAgICAgIHRoaXMuX3N1YnNjcmliZShzaW5rKSA6XG4gICAgICAgIHRoaXMuX3RyeVN1YnNjcmliZShzaW5rKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93YWJsZSkge1xuICAgICAgICBzaW5rLnN5bmNFcnJvclRocm93YWJsZSA9IGZhbHNlO1xuICAgICAgICBpZiAoc2luay5zeW5jRXJyb3JUaHJvd24pIHtcbiAgICAgICAgICB0aHJvdyBzaW5rLnN5bmNFcnJvclZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpbms7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF90cnlTdWJzY3JpYmUoc2luazogU3Vic2NyaWJlcjxUPik6IFRlYXJkb3duTG9naWMge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKHNpbmspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgc2luay5zeW5jRXJyb3JWYWx1ZSA9IGVycjtcbiAgICAgIH1cbiAgICAgIGlmIChjYW5SZXBvcnRFcnJvcihzaW5rKSkge1xuICAgICAgICBzaW5rLmVycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBmb3JFYWNoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHQgYSBoYW5kbGVyIGZvciBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIG9ic2VydmFibGVcbiAgICogQHBhcmFtIHtQcm9taXNlQ29uc3RydWN0b3J9IFtwcm9taXNlQ3Rvcl0gYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB1c2VkIHRvIGluc3RhbnRpYXRlIHRoZSBQcm9taXNlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IGVpdGhlciByZXNvbHZlcyBvbiBvYnNlcnZhYmxlIGNvbXBsZXRpb24gb3JcbiAgICogIHJlamVjdHMgd2l0aCB0aGUgaGFuZGxlZCBlcnJvclxuICAgKi9cbiAgZm9yRWFjaChuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIHByb21pc2VDdG9yPzogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlQ3Rvcjx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBNdXN0IGJlIGRlY2xhcmVkIGluIGEgc2VwYXJhdGUgc3RhdGVtZW50IHRvIGF2b2lkIGEgUmVmZXJuY2VFcnJvciB3aGVuXG4gICAgICAvLyBhY2Nlc3Npbmcgc3Vic2NyaXB0aW9uIGJlbG93IGluIHRoZSBjbG9zdXJlIGR1ZSB0byBUZW1wb3JhbCBEZWFkIFpvbmUuXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgICBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBuZXh0KHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCByZWplY3QsIHJlc29sdmUpO1xuICAgIH0pIGFzIFByb21pc2U8dm9pZD47XG4gIH1cblxuICAvKiogQGludGVybmFsIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pik6IFRlYXJkb3duTG9naWMge1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzO1xuICAgIHJldHVybiBzb3VyY2UgJiYgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxuXG4gIC8vIGBpZmAgYW5kIGB0aHJvd2AgYXJlIHNwZWNpYWwgc25vdyBmbGFrZXMsIHRoZSBjb21waWxlciBzZWVzIHRoZW0gYXMgcmVzZXJ2ZWQgd29yZHMuIERlcHJlY2F0ZWQgaW5cbiAgLy8gZmF2b3Igb2YgaWlmIGFuZCB0aHJvd0Vycm9yIGZ1bmN0aW9ucy5cbiAgLyoqXG4gICAqIEBub2NvbGxhcHNlXG4gICAqIEBkZXByZWNhdGVkIEluIGZhdm9yIG9mIGlpZiBjcmVhdGlvbiBmdW5jdGlvbjogaW1wb3J0IHsgaWlmIH0gZnJvbSAncnhqcyc7XG4gICAqL1xuICBzdGF0aWMgaWY6IHR5cGVvZiBpaWY7XG4gIC8qKlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKiBAZGVwcmVjYXRlZCBJbiBmYXZvciBvZiB0aHJvd0Vycm9yIGNyZWF0aW9uIGZ1bmN0aW9uOiBpbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG4gICAqL1xuICBzdGF0aWMgdGhyb3c6IHR5cGVvZiB0aHJvd0Vycm9yO1xuXG4gIC8qKlxuICAgKiBBbiBpbnRlcm9wIHBvaW50IGRlZmluZWQgYnkgdGhlIGVzNy1vYnNlcnZhYmxlIHNwZWMgaHR0cHM6Ly9naXRodWIuY29tL3plbnBhcnNpbmcvZXMtb2JzZXJ2YWJsZVxuICAgKiBAbWV0aG9kIFN5bWJvbC5vYnNlcnZhYmxlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IHRoaXMgaW5zdGFuY2Ugb2YgdGhlIG9ic2VydmFibGVcbiAgICovXG4gIFtTeW1ib2xfb2JzZXJ2YWJsZV0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbiAgcGlwZSgpOiBPYnNlcnZhYmxlPFQ+O1xuICBwaXBlPEE+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPik6IE9ic2VydmFibGU8QT47XG4gIHBpcGU8QSwgQj4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4pOiBPYnNlcnZhYmxlPEI+O1xuICBwaXBlPEEsIEIsIEM+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4pOiBPYnNlcnZhYmxlPEM+O1xuICBwaXBlPEEsIEIsIEMsIEQ+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPik6IE9ic2VydmFibGU8RD47XG4gIHBpcGU8QSwgQiwgQywgRCwgRT4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4pOiBPYnNlcnZhYmxlPEU+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEUsIEY+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+LCBvcDY6IE9wZXJhdG9yRnVuY3Rpb248RSwgRj4pOiBPYnNlcnZhYmxlPEY+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEUsIEYsIEc+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+LCBvcDY6IE9wZXJhdG9yRnVuY3Rpb248RSwgRj4sIG9wNzogT3BlcmF0b3JGdW5jdGlvbjxGLCBHPik6IE9ic2VydmFibGU8Rz47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSD4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4pOiBPYnNlcnZhYmxlPEg+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEUsIEYsIEcsIEgsIEk+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+LCBvcDY6IE9wZXJhdG9yRnVuY3Rpb248RSwgRj4sIG9wNzogT3BlcmF0b3JGdW5jdGlvbjxGLCBHPiwgb3A4OiBPcGVyYXRvckZ1bmN0aW9uPEcsIEg+LCBvcDk6IE9wZXJhdG9yRnVuY3Rpb248SCwgST4pOiBPYnNlcnZhYmxlPEk+O1xuICBwaXBlPEEsIEIsIEMsIEQsIEUsIEYsIEcsIEgsIEk+KG9wMTogT3BlcmF0b3JGdW5jdGlvbjxULCBBPiwgb3AyOiBPcGVyYXRvckZ1bmN0aW9uPEEsIEI+LCBvcDM6IE9wZXJhdG9yRnVuY3Rpb248QiwgQz4sIG9wNDogT3BlcmF0b3JGdW5jdGlvbjxDLCBEPiwgb3A1OiBPcGVyYXRvckZ1bmN0aW9uPEQsIEU+LCBvcDY6IE9wZXJhdG9yRnVuY3Rpb248RSwgRj4sIG9wNzogT3BlcmF0b3JGdW5jdGlvbjxGLCBHPiwgb3A4OiBPcGVyYXRvckZ1bmN0aW9uPEcsIEg+LCBvcDk6IE9wZXJhdG9yRnVuY3Rpb248SCwgST4sIC4uLm9wZXJhdGlvbnM6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBhbnk+W10pOiBPYnNlcnZhYmxlPHt9PjtcbiAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuICAvKipcbiAgICogVXNlZCB0byBzdGl0Y2ggdG9nZXRoZXIgZnVuY3Rpb25hbCBvcGVyYXRvcnMgaW50byBhIGNoYWluLlxuICAgKiBAbWV0aG9kIHBpcGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhlIE9ic2VydmFibGUgcmVzdWx0IG9mIGFsbCBvZiB0aGUgb3BlcmF0b3JzIGhhdmluZ1xuICAgKiBiZWVuIGNhbGxlZCBpbiB0aGUgb3JkZXIgdGhleSB3ZXJlIHBhc3NlZCBpbi5cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBpbXBvcnQgeyBtYXAsIGZpbHRlciwgc2NhbiB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAgICpcbiAgICogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDAwKVxuICAgKiAgIC5waXBlKFxuICAgKiAgICAgZmlsdGVyKHggPT4geCAlIDIgPT09IDApLFxuICAgKiAgICAgbWFwKHggPT4geCArIHgpLFxuICAgKiAgICAgc2NhbigoYWNjLCB4KSA9PiBhY2MgKyB4KVxuICAgKiAgIClcbiAgICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpXG4gICAqIGBgYFxuICAgKi9cbiAgcGlwZSguLi5vcGVyYXRpb25zOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgYW55PltdKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAob3BlcmF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzIGFzIGFueTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGlwZUZyb21BcnJheShvcGVyYXRpb25zKSh0aGlzKTtcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICB0b1Byb21pc2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPik6IFByb21pc2U8VD47XG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+LCBQcm9taXNlQ3RvcjogdHlwZW9mIFByb21pc2UpOiBQcm9taXNlPFQ+O1xuICB0b1Byb21pc2U8VD4odGhpczogT2JzZXJ2YWJsZTxUPiwgUHJvbWlzZUN0b3I6IFByb21pc2VDb25zdHJ1Y3Rvckxpa2UpOiBQcm9taXNlPFQ+O1xuICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4gIHRvUHJvbWlzZShwcm9taXNlQ3Rvcj86IFByb21pc2VDb25zdHJ1Y3Rvckxpa2UpOiBQcm9taXNlPFQ+IHtcbiAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcblxuICAgIHJldHVybiBuZXcgcHJvbWlzZUN0b3IoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBhbnk7XG4gICAgICB0aGlzLnN1YnNjcmliZSgoeDogVCkgPT4gdmFsdWUgPSB4LCAoZXJyOiBhbnkpID0+IHJlamVjdChlcnIpLCAoKSA9PiByZXNvbHZlKHZhbHVlKSk7XG4gICAgfSkgYXMgUHJvbWlzZTxUPjtcbiAgfVxufVxuXG4vKipcbiAqIERlY2lkZXMgYmV0d2VlbiBhIHBhc3NlZCBwcm9taXNlIGNvbnN0cnVjdG9yIGZyb20gY29uc3VtaW5nIGNvZGUsXG4gKiBBIGRlZmF1bHQgY29uZmlndXJlZCBwcm9taXNlIGNvbnN0cnVjdG9yLCBhbmQgdGhlIG5hdGl2ZSBwcm9taXNlXG4gKiBjb25zdHJ1Y3RvciBhbmQgcmV0dXJucyBpdC4gSWYgbm90aGluZyBjYW4gYmUgZm91bmQsIGl0IHdpbGwgdGhyb3dcbiAqIGFuIGVycm9yLlxuICogQHBhcmFtIHByb21pc2VDdG9yIFRoZSBvcHRpb25hbCBwcm9taXNlIGNvbnN0cnVjdG9yIHRvIHBhc3NlZCBieSBjb25zdW1pbmcgY29kZVxuICovXG5mdW5jdGlvbiBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3RvcjogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSB8IHVuZGVmaW5lZCkge1xuICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgcHJvbWlzZUN0b3IgPSBjb25maWcuUHJvbWlzZSB8fCBQcm9taXNlO1xuICB9XG5cbiAgaWYgKCFwcm9taXNlQ3Rvcikge1xuICAgIHRocm93IG5ldyBFcnJvcignbm8gUHJvbWlzZSBpbXBsIGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZUN0b3I7XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yQ3RvciB7XG4gIG5ldygpOiBPYmplY3RVbnN1YnNjcmliZWRFcnJvcjtcbn1cblxuZnVuY3Rpb24gT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JJbXBsKHRoaXM6IGFueSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSAnb2JqZWN0IHVuc3Vic2NyaWJlZCc7XG4gIHRoaXMubmFtZSA9ICdPYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG4gIHJldHVybiB0aGlzO1xufVxuXG5PYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIGFuIGFjdGlvbiBpcyBpbnZhbGlkIGJlY2F1c2UgdGhlIG9iamVjdCBoYXMgYmVlblxuICogdW5zdWJzY3JpYmVkLlxuICpcbiAqIEBzZWUge0BsaW5rIFN1YmplY3R9XG4gKiBAc2VlIHtAbGluayBCZWhhdmlvclN1YmplY3R9XG4gKlxuICogQGNsYXNzIE9iamVjdFVuc3Vic2NyaWJlZEVycm9yXG4gKi9cbmV4cG9ydCBjb25zdCBPYmplY3RVbnN1YnNjcmliZWRFcnJvcjogT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JDdG9yID0gT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JJbXBsIGFzIGFueTsiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgU3ViamVjdFN1YnNjcmlwdGlvbjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gIGNsb3NlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdWJqZWN0OiBTdWJqZWN0PFQ+LCBwdWJsaWMgc3Vic2NyaWJlcjogT2JzZXJ2ZXI8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuc3ViamVjdDtcbiAgICBjb25zdCBvYnNlcnZlcnMgPSBzdWJqZWN0Lm9ic2VydmVycztcblxuICAgIHRoaXMuc3ViamVjdCA9IG51bGw7XG5cbiAgICBpZiAoIW9ic2VydmVycyB8fCBvYnNlcnZlcnMubGVuZ3RoID09PSAwIHx8IHN1YmplY3QuaXNTdG9wcGVkIHx8IHN1YmplY3QuY2xvc2VkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3Vic2NyaWJlckluZGV4ID0gb2JzZXJ2ZXJzLmluZGV4T2YodGhpcy5zdWJzY3JpYmVyKTtcblxuICAgIGlmIChzdWJzY3JpYmVySW5kZXggIT09IC0xKSB7XG4gICAgICBvYnNlcnZlcnMuc3BsaWNlKHN1YnNjcmliZXJJbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmVyLCBTdWJzY3JpcHRpb25MaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvcnhTdWJzY3JpYmVyJztcblxuLyoqXG4gKiBAY2xhc3MgU3ViamVjdFN1YnNjcmliZXI8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3ViamVjdDxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgU3ViamVjdCBpcyBhIHNwZWNpYWwgdHlwZSBvZiBPYnNlcnZhYmxlIHRoYXQgYWxsb3dzIHZhbHVlcyB0byBiZVxuICogbXVsdGljYXN0ZWQgdG8gbWFueSBPYnNlcnZhYmxlcy4gU3ViamVjdHMgYXJlIGxpa2UgRXZlbnRFbWl0dGVycy5cbiAqXG4gKiBFdmVyeSBTdWJqZWN0IGlzIGFuIE9ic2VydmFibGUgYW5kIGFuIE9ic2VydmVyLiBZb3UgY2FuIHN1YnNjcmliZSB0byBhXG4gKiBTdWJqZWN0LCBhbmQgeW91IGNhbiBjYWxsIG5leHQgdG8gZmVlZCB2YWx1ZXMgYXMgd2VsbCBhcyBlcnJvciBhbmQgY29tcGxldGUuXG4gKlxuICogQGNsYXNzIFN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3Q8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTGlrZSB7XG5cbiAgW3J4U3Vic2NyaWJlclN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJqZWN0U3Vic2NyaWJlcih0aGlzKTtcbiAgfVxuXG4gIG9ic2VydmVyczogT2JzZXJ2ZXI8VD5bXSA9IFtdO1xuXG4gIGNsb3NlZCA9IGZhbHNlO1xuXG4gIGlzU3RvcHBlZCA9IGZhbHNlO1xuXG4gIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgdGhyb3duRXJyb3I6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKkBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjcmVhdGU6IEZ1bmN0aW9uID0gPFQ+KGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxUPiwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogQW5vbnltb3VzU3ViamVjdDxUPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNTdWJqZWN0PFQ+KGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xuICB9XG5cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBzdWJqZWN0ID0gbmV3IEFub255bW91c1N1YmplY3QodGhpcywgdGhpcyk7XG4gICAgc3ViamVjdC5vcGVyYXRvciA9IDxhbnk+b3BlcmF0b3I7XG4gICAgcmV0dXJuIDxhbnk+c3ViamVjdDtcbiAgfVxuXG4gIG5leHQodmFsdWU/OiBUKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb3B5W2ldLm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5oYXNFcnJvciA9IHRydWU7XG4gICAgdGhpcy50aHJvd25FcnJvciA9IGVycjtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29weVtpXS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIGNvbnN0IHsgb2JzZXJ2ZXJzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvcHlbaV0uY29tcGxldGUoKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgT2JzZXJ2YWJsZSB3aXRoIHRoaXMgU3ViamVjdCBhcyB0aGUgc291cmNlLiBZb3UgY2FuIGRvIHRoaXNcbiAgICogdG8gY3JlYXRlIGN1c3RvbWl6ZSBPYnNlcnZlci1zaWRlIGxvZ2ljIG9mIHRoZSBTdWJqZWN0IGFuZCBjb25jZWFsIGl0IGZyb21cbiAgICogY29kZSB0aGF0IHVzZXMgdGhlIE9ic2VydmFibGUuXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IE9ic2VydmFibGUgdGhhdCB0aGUgU3ViamVjdCBjYXN0cyB0b1xuICAgKi9cbiAgYXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZTxUPigpO1xuICAgICg8YW55Pm9ic2VydmFibGUpLnNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb24/OiBPYnNlcnZlcjxUPiwgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24ubmV4dCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5lcnJvcikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzO1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZDb3VudDxUPigpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gcmVmQ291bnRPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBSZWZDb3VudE9wZXJhdG9yKHNvdXJjZSkpO1xuICB9IGFzIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbn1cblxuY2xhc3MgUmVmQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCsrO1xuXG4gICAgY29uc3QgcmVmQ291bnRlciA9IG5ldyBSZWZDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgY29ubmVjdGFibGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUocmVmQ291bnRlcik7XG5cbiAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAoPGFueT4gcmVmQ291bnRlcikuY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICBpZiAoIWNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQ7XG4gICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQgPSByZWZDb3VudCAtIDE7XG4gICAgaWYgKHJlZkNvdW50ID4gMSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLyBDb21wYXJlIHRoZSBsb2NhbCBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiB0byB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBvbiB0aGUgc2hhcmVkIENvbm5lY3RhYmxlT2JzZXJ2YWJsZS4gSW4gY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHNvdXJjZSBzeW5jaHJvbm91c2x5IGVtaXRzIHZhbHVlcywgYW5kXG4gICAgLy8gdGhlIFJlZkNvdW50U3Vic2NyaWJlcidzIGRvd25zdHJlYW0gT2JzZXJ2ZXJzIHN5bmNocm9ub3VzbHkgdW5zdWJzY3JpYmUsXG4gICAgLy8gZXhlY3V0aW9uIGNvbnRpbnVlcyB0byBoZXJlIGJlZm9yZSB0aGUgUmVmQ291bnRPcGVyYXRvciBoYXMgYSBjaGFuY2UgdG9cbiAgICAvLyBzdXBwbHkgdGhlIFJlZkNvdW50U3Vic2NyaWJlciB3aXRoIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24uXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmFuZ2UoMCwgMTApLnBpcGUoXG4gICAgLy8gICBwdWJsaXNoKCksXG4gICAgLy8gICByZWZDb3VudCgpLFxuICAgIC8vICAgdGFrZSg1KSxcbiAgICAvLyApXG4gICAgLy8gLnN1YnNjcmliZSgpO1xuICAgIC8vIGBgYFxuICAgIC8vIEluIG9yZGVyIHRvIGFjY291bnQgZm9yIHRoaXMgY2FzZSwgUmVmQ291bnRTdWJzY3JpYmVyIHNob3VsZCBvbmx5IGRpc3Bvc2VcbiAgICAvLyB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlJ3Mgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGlmIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGV4aXN0cywgKmFuZCogZWl0aGVyOlxuICAgIC8vICAgYS4gUmVmQ291bnRTdWJzY3JpYmVyIGRvZXNuJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb25cbiAgICAvLyAgICAgIFN1YnNjcmlwdGlvbiB5ZXQsIG9yLFxuICAgIC8vICAgYi4gUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gcmVmZXJlbmNlIGlzIGlkZW50aWNhbFxuICAgIC8vICAgICAgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvblxuICAgIC8vL1xuICAgIGNvbnN0IHsgY29ubmVjdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCBzaGFyZWRDb25uZWN0aW9uID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uZWN0aW9uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm5lY3Rpb24pKSB7XG4gICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0LCBTdWJqZWN0U3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlZkNvdW50IGFzIGhpZ2hlck9yZGVyUmVmQ291bnQgfSBmcm9tICcuLi9vcGVyYXRvcnMvcmVmQ291bnQnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuXG4gIHByb3RlY3RlZCBfc3ViamVjdDogU3ViamVjdDxUPjtcbiAgcHJvdGVjdGVkIF9yZWZDb3VudDogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIF9jb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lzQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgc3ViamVjdEZhY3Rvcnk6ICgpID0+IFN1YmplY3Q8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdWJqZWN0KCkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFN1YmplY3QoKTogU3ViamVjdDxUPiB7XG4gICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgaWYgKCFzdWJqZWN0IHx8IHN1YmplY3QuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5zdWJqZWN0RmFjdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgfVxuXG4gIGNvbm5lY3QoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb247XG4gICAgaWYgKCFjb25uZWN0aW9uKSB7XG4gICAgICB0aGlzLl9pc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGNvbm5lY3Rpb24uYWRkKHRoaXMuc291cmNlXG4gICAgICAgIC5zdWJzY3JpYmUobmV3IENvbm5lY3RhYmxlU3Vic2NyaWJlcih0aGlzLmdldFN1YmplY3QoKSwgdGhpcykpKTtcbiAgICAgIGlmIChjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgY29ubmVjdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIHJlZkNvdW50KCk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBoaWdoZXJPcmRlclJlZkNvdW50KCkodGhpcykgYXMgT2JzZXJ2YWJsZTxUPjtcbiAgfVxufVxuXG5jb25zdCBjb25uZWN0YWJsZVByb3RvID0gPGFueT5Db25uZWN0YWJsZU9ic2VydmFibGUucHJvdG90eXBlO1xuXG5leHBvcnQgY29uc3QgY29ubmVjdGFibGVPYnNlcnZhYmxlRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yTWFwID0ge1xuICBvcGVyYXRvcjogeyB2YWx1ZTogbnVsbCB9LFxuICBfcmVmQ291bnQ6IHsgdmFsdWU6IDAsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9zdWJqZWN0OiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfY29ubmVjdGlvbjogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX3N1YnNjcmliZTogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5fc3Vic2NyaWJlIH0sXG4gIF9pc0NvbXBsZXRlOiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLl9pc0NvbXBsZXRlLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBnZXRTdWJqZWN0OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLmdldFN1YmplY3QgfSxcbiAgY29ubmVjdDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5jb25uZWN0IH0sXG4gIHJlZkNvdW50OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLnJlZkNvdW50IH1cbn07XG5cbmNsYXNzIENvbm5lY3RhYmxlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YmplY3RTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICBzdXBlci5fZXJyb3IoZXJyKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY29ubmVjdGFibGUuX2lzQ29tcGxldGUgPSB0cnVlO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBjb25uZWN0YWJsZSA9IDxhbnk+dGhpcy5jb25uZWN0YWJsZTtcbiAgICBpZiAoY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGFibGUuX3JlZkNvdW50ID0gMDtcbiAgICAgIGNvbm5lY3RhYmxlLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgIGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIGlmIChjb25uZWN0aW9uKSB7XG4gICAgICAgIGNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCsrO1xuXG4gICAgY29uc3QgcmVmQ291bnRlciA9IG5ldyBSZWZDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgY29ubmVjdGFibGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUocmVmQ291bnRlcik7XG5cbiAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAoPGFueT4gcmVmQ291bnRlcikuY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICBpZiAoIWNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQ7XG4gICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQgPSByZWZDb3VudCAtIDE7XG4gICAgaWYgKHJlZkNvdW50ID4gMSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLyBDb21wYXJlIHRoZSBsb2NhbCBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiB0byB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBvbiB0aGUgc2hhcmVkIENvbm5lY3RhYmxlT2JzZXJ2YWJsZS4gSW4gY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHNvdXJjZSBzeW5jaHJvbm91c2x5IGVtaXRzIHZhbHVlcywgYW5kXG4gICAgLy8gdGhlIFJlZkNvdW50U3Vic2NyaWJlcidzIGRvd25zdHJlYW0gT2JzZXJ2ZXJzIHN5bmNocm9ub3VzbHkgdW5zdWJzY3JpYmUsXG4gICAgLy8gZXhlY3V0aW9uIGNvbnRpbnVlcyB0byBoZXJlIGJlZm9yZSB0aGUgUmVmQ291bnRPcGVyYXRvciBoYXMgYSBjaGFuY2UgdG9cbiAgICAvLyBzdXBwbHkgdGhlIFJlZkNvdW50U3Vic2NyaWJlciB3aXRoIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24uXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmFuZ2UoMCwgMTApLnBpcGUoXG4gICAgLy8gICBwdWJsaXNoKCksXG4gICAgLy8gICByZWZDb3VudCgpLFxuICAgIC8vICAgdGFrZSg1KSxcbiAgICAvLyApLnN1YnNjcmliZSgpO1xuICAgIC8vIGBgYFxuICAgIC8vIEluIG9yZGVyIHRvIGFjY291bnQgZm9yIHRoaXMgY2FzZSwgUmVmQ291bnRTdWJzY3JpYmVyIHNob3VsZCBvbmx5IGRpc3Bvc2VcbiAgICAvLyB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlJ3Mgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGlmIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGV4aXN0cywgKmFuZCogZWl0aGVyOlxuICAgIC8vICAgYS4gUmVmQ291bnRTdWJzY3JpYmVyIGRvZXNuJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb25cbiAgICAvLyAgICAgIFN1YnNjcmlwdGlvbiB5ZXQsIG9yLFxuICAgIC8vICAgYi4gUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gcmVmZXJlbmNlIGlzIGlkZW50aWNhbFxuICAgIC8vICAgICAgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvblxuICAgIC8vL1xuICAgIGNvbnN0IHsgY29ubmVjdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCBzaGFyZWRDb25uZWN0aW9uID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uZWN0aW9uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm5lY3Rpb24pKSB7XG4gICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEspOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEs+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcjogdm9pZCwgZHVyYXRpb25TZWxlY3RvcjogKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBncm91cEJ5PFQsIEssIFI+KGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGVsZW1lbnRTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gUiwgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj47XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeTxULCBLLCBSPihrZXlTZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBLLCBlbGVtZW50U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IFIsIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55Piwgc3ViamVjdFNlbGVjdG9yPzogKCkgPT4gU3ViamVjdDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgR3JvdXBlZE9ic2VydmFibGU8SywgUj4+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBHcm91cHMgdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSBhY2NvcmRpbmcgdG8gYSBzcGVjaWZpZWQgY3JpdGVyaW9uLFxuICogYW5kIGVtaXRzIHRoZXNlIGdyb3VwZWQgaXRlbXMgYXMgYEdyb3VwZWRPYnNlcnZhYmxlc2AsIG9uZVxuICoge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBwZXIgZ3JvdXAuXG4gKlxuICogIVtdKGdyb3VwQnkucG5nKVxuICpcbiAqIFdoZW4gdGhlIE9ic2VydmFibGUgZW1pdHMgYW4gaXRlbSwgYSBrZXkgaXMgY29tcHV0ZWQgZm9yIHRoaXMgaXRlbSB3aXRoIHRoZSBrZXlTZWxlY3RvciBmdW5jdGlvbi5cbiAqXG4gKiBJZiBhIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gZm9yIHRoaXMga2V5IGV4aXN0cywgdGhpcyB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGVtaXRzLiBFbHNld2hlcmUsIGEgbmV3XG4gKiB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9IGZvciB0aGlzIGtleSBpcyBjcmVhdGVkIGFuZCBlbWl0cy5cbiAqXG4gKiBBIHtAbGluayBHcm91cGVkT2JzZXJ2YWJsZX0gcmVwcmVzZW50cyB2YWx1ZXMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGdyb3VwIHJlcHJlc2VudGVkIGJ5IGEgY29tbW9uIGtleS4gVGhlIGNvbW1vblxuICoga2V5IGlzIGF2YWlsYWJsZSBhcyB0aGUga2V5IGZpZWxkIG9mIGEge0BsaW5rIEdyb3VwZWRPYnNlcnZhYmxlfSBpbnN0YW5jZS5cbiAqXG4gKiBUaGUgZWxlbWVudHMgZW1pdHRlZCBieSB7QGxpbmsgR3JvdXBlZE9ic2VydmFibGV9cyBhcmUgYnkgZGVmYXVsdCB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZSwgb3IgZWxlbWVudHNcbiAqIHJldHVybmVkIGJ5IHRoZSBlbGVtZW50U2VsZWN0b3IgZnVuY3Rpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBHcm91cCBvYmplY3RzIGJ5IGlkIGFuZCByZXR1cm4gYXMgYXJyYXlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1lcmdlTWFwLCBncm91cEJ5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzL29ic2VydmFibGUvb2YnO1xuICpcbiAqIGludGVyZmFjZSBPYmoge1xuICogICAgaWQ6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZyxcbiAqIH1cbiAqXG4gKiBvZjxPYmo+KFxuICogICB7aWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAgIHtpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICd3ZWJwYWNrJ30sXG4gKiAgIHtpZDogMSwgbmFtZTogJ3R5cGVzY3JpcHQnfSxcbiAqICAge2lkOiAzLCBuYW1lOiAndHNsaW50J31cbiAqICkucGlwZShcbiAqICAgZ3JvdXBCeShwID0+IHAuaWQpLFxuICogICBtZXJnZU1hcCgoZ3JvdXAkKSA9PiBncm91cCQucGlwZShyZWR1Y2UoKGFjYywgY3VyKSA9PiBbLi4uYWNjLCBjdXJdLCBbXSkpKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUocCA9PiBjb25zb2xlLmxvZyhwKSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyBbIHsgaWQ6IDEsIG5hbWU6ICdqYXZhc2NyaXB0J30sXG4gKiAvLyAgIHsgaWQ6IDEsIG5hbWU6ICd0eXBlc2NyaXB0J30gXVxuICogLy9cbiAqIC8vIFsgeyBpZDogMiwgbmFtZTogJ3BhcmNlbCd9LFxuICogLy8gICB7IGlkOiAyLCBuYW1lOiAnd2VicGFjayd9IF1cbiAqIC8vXG4gKiAvLyBbIHsgaWQ6IDMsIG5hbWU6ICd0c2xpbnQnfSBdXG4gKiBgYGBcbiAqXG4gKiAjIyMgUGl2b3QgZGF0YSBvbiB0aGUgaWQgZmllbGRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1lcmdlTWFwLCBncm91cEJ5LCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG4gKlxuICogb2Y8T2JqPihcbiAqICAge2lkOiAxLCBuYW1lOiAnamF2YXNjcmlwdCd9LFxuICogICB7aWQ6IDIsIG5hbWU6ICdwYXJjZWwnfSxcbiAqICAge2lkOiAyLCBuYW1lOiAnd2VicGFjayd9LFxuICogICB7aWQ6IDEsIG5hbWU6ICd0eXBlc2NyaXB0J31cbiAqICAge2lkOiAzLCBuYW1lOiAndHNsaW50J31cbiAqICkucGlwZShcbiAqICAgZ3JvdXBCeShwID0+IHAuaWQsIHAgPT4gcC5uYW1lKSxcbiAqICAgbWVyZ2VNYXAoIChncm91cCQpID0+IGdyb3VwJC5waXBlKHJlZHVjZSgoYWNjLCBjdXIpID0+IFsuLi5hY2MsIGN1cl0sIFtcIlwiICsgZ3JvdXAkLmtleV0pKSksXG4gKiAgIG1hcChhcnIgPT4gKHsnaWQnOiBwYXJzZUludChhcnJbMF0pLCAndmFsdWVzJzogYXJyLnNsaWNlKDEpfSkpLFxuICogKVxuICogLnN1YnNjcmliZShwID0+IGNvbnNvbGUubG9nKHApKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgaWQ6IDEsIHZhbHVlczogWyAnamF2YXNjcmlwdCcsICd0eXBlc2NyaXB0JyBdIH1cbiAqIC8vIHsgaWQ6IDIsIHZhbHVlczogWyAncGFyY2VsJywgJ3dlYnBhY2snIF0gfVxuICogLy8geyBpZDogMywgdmFsdWVzOiBbICd0c2xpbnQnIF0gfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IEt9IGtleVNlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGUga2V5XG4gKiBmb3IgZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IFJ9IFtlbGVtZW50U2VsZWN0b3JdIEEgZnVuY3Rpb24gdGhhdCBleHRyYWN0cyB0aGVcbiAqIHJldHVybiBlbGVtZW50IGZvciBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGdyb3VwZWQ6IEdyb3VwZWRPYnNlcnZhYmxlPEssUj4pOiBPYnNlcnZhYmxlPGFueT59IFtkdXJhdGlvblNlbGVjdG9yXVxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0byBkZXRlcm1pbmUgaG93IGxvbmcgZWFjaCBncm91cCBzaG91bGRcbiAqIGV4aXN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxHcm91cGVkT2JzZXJ2YWJsZTxLLFI+Pn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzXG4gKiBHcm91cGVkT2JzZXJ2YWJsZXMsIGVhY2ggb2Ygd2hpY2ggY29ycmVzcG9uZHMgdG8gYSB1bmlxdWUga2V5IHZhbHVlIGFuZCBlYWNoXG4gKiBvZiB3aGljaCBlbWl0cyB0aG9zZSBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IHNoYXJlIHRoYXQga2V5XG4gKiB2YWx1ZS5cbiAqIEBtZXRob2QgZ3JvdXBCeVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnk8VCwgSywgUj4oa2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRTZWxlY3Rvcj86ICgodmFsdWU6IFQpID0+IFIpIHwgdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+PiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PlxuICAgIHNvdXJjZS5saWZ0KG5ldyBHcm91cEJ5T3BlcmF0b3Ioa2V5U2VsZWN0b3IsIGVsZW1lbnRTZWxlY3RvciwgZHVyYXRpb25TZWxlY3Rvciwgc3ViamVjdFNlbGVjdG9yKSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBjb3VudDogbnVtYmVyO1xuICB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbiAgY2xvc2VkOiBib29sZWFuO1xuICBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuO1xufVxuXG5jbGFzcyBHcm91cEJ5T3BlcmF0b3I8VCwgSywgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFNlbGVjdG9yPzogKCh2YWx1ZTogVCkgPT4gUikgfCB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I/OiAoZ3JvdXBlZDogR3JvdXBlZE9ic2VydmFibGU8SywgUj4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdWJqZWN0U2VsZWN0b3I/OiAoKSA9PiBTdWJqZWN0PFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8R3JvdXBlZE9ic2VydmFibGU8SywgUj4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEdyb3VwQnlTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5rZXlTZWxlY3RvciwgdGhpcy5lbGVtZW50U2VsZWN0b3IsIHRoaXMuZHVyYXRpb25TZWxlY3RvciwgdGhpcy5zdWJqZWN0U2VsZWN0b3JcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgR3JvdXBCeVN1YnNjcmliZXI8VCwgSywgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IGltcGxlbWVudHMgUmVmQ291bnRTdWJzY3JpcHRpb24ge1xuICBwcml2YXRlIGdyb3VwczogTWFwPEssIFN1YmplY3Q8VCB8IFI+PiA9IG51bGw7XG4gIHB1YmxpYyBhdHRlbXB0ZWRUb1Vuc3Vic2NyaWJlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50U2VsZWN0b3I/OiAoKHZhbHVlOiBUKSA9PiBSKSB8IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3Rvcj86IChncm91cGVkOiBHcm91cGVkT2JzZXJ2YWJsZTxLLCBSPikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHN1YmplY3RTZWxlY3Rvcj86ICgpID0+IFN1YmplY3Q8Uj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQga2V5OiBLO1xuICAgIHRyeSB7XG4gICAgICBrZXkgPSB0aGlzLmtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9ncm91cCh2YWx1ZSwga2V5KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dyb3VwKHZhbHVlOiBULCBrZXk6IEspIHtcbiAgICBsZXQgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG5cbiAgICBpZiAoIWdyb3Vwcykge1xuICAgICAgZ3JvdXBzID0gdGhpcy5ncm91cHMgPSBuZXcgTWFwPEssIFN1YmplY3Q8VCB8IFI+PigpO1xuICAgIH1cblxuICAgIGxldCBncm91cCA9IGdyb3Vwcy5nZXQoa2V5KTtcblxuICAgIGxldCBlbGVtZW50OiBSO1xuICAgIGlmICh0aGlzLmVsZW1lbnRTZWxlY3Rvcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudFNlbGVjdG9yKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSA8YW55PnZhbHVlO1xuICAgIH1cblxuICAgIGlmICghZ3JvdXApIHtcbiAgICAgIGdyb3VwID0gKHRoaXMuc3ViamVjdFNlbGVjdG9yID8gdGhpcy5zdWJqZWN0U2VsZWN0b3IoKSA6IG5ldyBTdWJqZWN0PFI+KCkpIGFzIFN1YmplY3Q8VCB8IFI+O1xuICAgICAgZ3JvdXBzLnNldChrZXksIGdyb3VwKTtcbiAgICAgIGNvbnN0IGdyb3VwZWRPYnNlcnZhYmxlID0gbmV3IEdyb3VwZWRPYnNlcnZhYmxlKGtleSwgZ3JvdXAsIHRoaXMpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGdyb3VwZWRPYnNlcnZhYmxlKTtcbiAgICAgIGlmICh0aGlzLmR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICAgICAgbGV0IGR1cmF0aW9uOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uU2VsZWN0b3IobmV3IEdyb3VwZWRPYnNlcnZhYmxlPEssIFI+KGtleSwgPFN1YmplY3Q8Uj4+Z3JvdXApKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChkdXJhdGlvbi5zdWJzY3JpYmUobmV3IEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyKGtleSwgZ3JvdXAsIHRoaXMpKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFncm91cC5jbG9zZWQpIHtcbiAgICAgIGdyb3VwLm5leHQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGdyb3VwcyA9IHRoaXMuZ3JvdXBzO1xuICAgIGlmIChncm91cHMpIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKChncm91cCwga2V5KSA9PiB7XG4gICAgICAgIGdyb3VwLmVycm9yKGVycik7XG4gICAgICB9KTtcblxuICAgICAgZ3JvdXBzLmNsZWFyKCk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXBzID0gdGhpcy5ncm91cHM7XG4gICAgaWYgKGdyb3Vwcykge1xuICAgICAgZ3JvdXBzLmZvckVhY2goKGdyb3VwLCBrZXkpID0+IHtcbiAgICAgICAgZ3JvdXAuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBncm91cHMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcmVtb3ZlR3JvdXAoa2V5OiBLKTogdm9pZCB7XG4gICAgdGhpcy5ncm91cHMuZGVsZXRlKGtleSk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICB0aGlzLmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgaWYgKHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEdyb3VwRHVyYXRpb25TdWJzY3JpYmVyPEssIFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5OiBLLFxuICAgICAgICAgICAgICBwcml2YXRlIGdyb3VwOiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcmVudDogR3JvdXBCeVN1YnNjcmliZXI8YW55LCBLLCBUIHwgYW55Pikge1xuICAgIHN1cGVyKGdyb3VwKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50LCBrZXkgfSA9IHRoaXM7XG4gICAgdGhpcy5rZXkgPSB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50LnJlbW92ZUdyb3VwKGtleSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSByZXByZXNlbnRpbmcgdmFsdWVzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBncm91cCByZXByZXNlbnRlZCBieVxuICogYSBjb21tb24ga2V5LiBUaGUgdmFsdWVzIGVtaXR0ZWQgYnkgYSBHcm91cGVkT2JzZXJ2YWJsZSBjb21lIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhlIGNvbW1vbiBrZXkgaXMgYXZhaWxhYmxlIGFzIHRoZSBmaWVsZCBga2V5YCBvbiBhXG4gKiBHcm91cGVkT2JzZXJ2YWJsZSBpbnN0YW5jZS5cbiAqXG4gKiBAY2xhc3MgR3JvdXBlZE9ic2VydmFibGU8SywgVD5cbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwZWRPYnNlcnZhYmxlPEssIFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIC8qKiBAZGVwcmVjYXRlZCBEbyBub3QgY29uc3RydWN0IHRoaXMgdHlwZS4gSW50ZXJuYWwgdXNlIG9ubHkgKi9cbiAgY29uc3RydWN0b3IocHVibGljIGtleTogSyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBncm91cFN1YmplY3Q6IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVmQ291bnRTdWJzY3JpcHRpb24/OiBSZWZDb3VudFN1YnNjcmlwdGlvbikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCB7IHJlZkNvdW50U3Vic2NyaXB0aW9uLCBncm91cFN1YmplY3QgfSA9IHRoaXM7XG4gICAgaWYgKHJlZkNvdW50U3Vic2NyaXB0aW9uICYmICFyZWZDb3VudFN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IElubmVyUmVmQ291bnRTdWJzY3JpcHRpb24ocmVmQ291bnRTdWJzY3JpcHRpb24pKTtcbiAgICB9XG4gICAgc3Vic2NyaXB0aW9uLmFkZChncm91cFN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBJbm5lclJlZkNvdW50U3Vic2NyaXB0aW9uIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwYXJlbnQ6IFJlZkNvdW50U3Vic2NyaXB0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICBwYXJlbnQuY291bnQrKztcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgIGlmICghcGFyZW50LmNsb3NlZCAmJiAhdGhpcy5jbG9zZWQpIHtcbiAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICBwYXJlbnQuY291bnQgLT0gMTtcbiAgICAgIGlmIChwYXJlbnQuY291bnQgPT09IDAgJiYgcGFyZW50LmF0dGVtcHRlZFRvVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgcGFyZW50LnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgcmVxdWlyZXMgYW4gaW5pdGlhbCB2YWx1ZSBhbmQgZW1pdHMgaXRzIGN1cnJlbnRcbiAqIHZhbHVlIHdoZW5ldmVyIGl0IGlzIHN1YnNjcmliZWQgdG8uXG4gKlxuICogQGNsYXNzIEJlaGF2aW9yU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQmVoYXZpb3JTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmFsdWU6IFQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICBpZiAoc3Vic2NyaXB0aW9uICYmICEoPFN1YnNjcmlwdGlvbkxpa2U+c3Vic2NyaXB0aW9uKS5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLl92YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBUIHtcbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy50aHJvd25FcnJvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBzdXBlci5uZXh0KHRoaXMuX3ZhbHVlID0gdmFsdWUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuLi9TY2hlZHVsZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBBIHVuaXQgb2Ygd29yayB0byBiZSBleGVjdXRlZCBpbiBhIGBzY2hlZHVsZXJgLiBBbiBhY3Rpb24gaXMgdHlwaWNhbGx5XG4gKiBjcmVhdGVkIGZyb20gd2l0aGluIGEge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBhbiBSeEpTIHVzZXIgZG9lcyBub3QgbmVlZCB0byBjb25jZXJuXG4gKiB0aGVtc2VsdmVzIGFib3V0IGNyZWF0aW5nIGFuZCBtYW5pcHVsYXRpbmcgYW4gQWN0aW9uLlxuICpcbiAqIGBgYHRzXG4gKiBjbGFzcyBBY3Rpb248VD4gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICogICBuZXcgKHNjaGVkdWxlcjogU2NoZWR1bGVyLCB3b3JrOiAoc3RhdGU/OiBUKSA9PiB2b2lkKTtcbiAqICAgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBjbGFzcyBBY3Rpb248VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEFjdGlvbjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHNjaGVkdWxlcjogU2NoZWR1bGVyLCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcigpO1xuICB9XG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgdGhpcyBhY3Rpb24gb24gaXRzIHBhcmVudCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gZm9yIGV4ZWN1dGlvbi4gTWF5IGJlIHBhc3NlZFxuICAgKiBzb21lIGNvbnRleHQgb2JqZWN0LCBgc3RhdGVgLiBNYXkgaGFwcGVuIGF0IHNvbWUgcG9pbnQgaW4gdGhlIGZ1dHVyZSxcbiAgICogYWNjb3JkaW5nIHRvIHRoZSBgZGVsYXlgIHBhcmFtZXRlciwgaWYgc3BlY2lmaWVkLlxuICAgKiBAcGFyYW0ge1R9IFtzdGF0ZV0gU29tZSBjb250ZXh0dWFsIGRhdGEgdGhhdCB0aGUgYHdvcmtgIGZ1bmN0aW9uIHVzZXMgd2hlblxuICAgKiBjYWxsZWQgYnkgdGhlIFNjaGVkdWxlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gVGltZSB0byB3YWl0IGJlZm9yZSBleGVjdXRpbmcgdGhlIHdvcmssIHdoZXJlIHRoZVxuICAgKiB0aW1lIHVuaXQgaXMgaW1wbGljaXQgYW5kIGRlZmluZWQgYnkgdGhlIFNjaGVkdWxlci5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9BY3Rpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQXN5bmNBY3Rpb248VD4gZXh0ZW5kcyBBY3Rpb248VD4ge1xuXG4gIHB1YmxpYyBpZDogYW55O1xuICBwdWJsaWMgc3RhdGU6IFQ7XG4gIHB1YmxpYyBkZWxheTogbnVtYmVyO1xuICBwcm90ZWN0ZWQgcGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQWx3YXlzIHJlcGxhY2UgdGhlIGN1cnJlbnQgc3RhdGUgd2l0aCB0aGUgbmV3IHN0YXRlLlxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcblxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcblxuICAgIC8vXG4gICAgLy8gSW1wb3J0YW50IGltcGxlbWVudGF0aW9uIG5vdGU6XG4gICAgLy9cbiAgICAvLyBBY3Rpb25zIG9ubHkgZXhlY3V0ZSBvbmNlIGJ5IGRlZmF1bHQsIHVubGVzcyByZXNjaGVkdWxlZCBmcm9tIHdpdGhpbiB0aGVcbiAgICAvLyBzY2hlZHVsZWQgY2FsbGJhY2suIFRoaXMgYWxsb3dzIHVzIHRvIGltcGxlbWVudCBzaW5nbGUgYW5kIHJlcGVhdFxuICAgIC8vIGFjdGlvbnMgdmlhIHRoZSBzYW1lIGNvZGUgcGF0aCwgd2l0aG91dCBhZGRpbmcgQVBJIHN1cmZhY2UgYXJlYSwgYXMgd2VsbFxuICAgIC8vIGFzIG1pbWljIHRyYWRpdGlvbmFsIHJlY3Vyc2lvbiBidXQgYWNyb3NzIGFzeW5jaHJvbm91cyBib3VuZGFyaWVzLlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgSlMgcnVudGltZXMgYW5kIHRpbWVycyBkaXN0aW5ndWlzaCBiZXR3ZWVuIGludGVydmFscyBhY2hpZXZlZCBieVxuICAgIC8vIHNlcmlhbCBgc2V0VGltZW91dGAgY2FsbHMgdnMuIGEgc2luZ2xlIGBzZXRJbnRlcnZhbGAgY2FsbC4gQW4gaW50ZXJ2YWwgb2ZcbiAgICAvLyBzZXJpYWwgYHNldFRpbWVvdXRgIGNhbGxzIGNhbiBiZSBpbmRpdmlkdWFsbHkgZGVsYXllZCwgd2hpY2ggZGVsYXlzXG4gICAgLy8gc2NoZWR1bGluZyB0aGUgbmV4dCBgc2V0VGltZW91dGAsIGFuZCBzbyBvbi4gYHNldEludGVydmFsYCBhdHRlbXB0cyB0b1xuICAgIC8vIGd1YXJhbnRlZSB0aGUgaW50ZXJ2YWwgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIG1vcmUgcHJlY2lzZWx5IHRvIHRoZVxuICAgIC8vIGludGVydmFsIHBlcmlvZCwgcmVnYXJkbGVzcyBvZiBsb2FkLlxuICAgIC8vXG4gICAgLy8gVGhlcmVmb3JlLCB3ZSB1c2UgYHNldEludGVydmFsYCB0byBzY2hlZHVsZSBzaW5nbGUgYW5kIHJlcGVhdCBhY3Rpb25zLlxuICAgIC8vIElmIHRoZSBhY3Rpb24gcmVzY2hlZHVsZXMgaXRzZWxmIHdpdGggdGhlIHNhbWUgZGVsYXksIHRoZSBpbnRlcnZhbCBpcyBub3RcbiAgICAvLyBjYW5jZWxlZC4gSWYgdGhlIGFjdGlvbiBkb2Vzbid0IHJlc2NoZWR1bGUsIG9yIHJlc2NoZWR1bGVzIHdpdGggYVxuICAgIC8vIGRpZmZlcmVudCBkZWxheSwgdGhlIGludGVydmFsIHdpbGwgYmUgY2FuY2VsZWQgYWZ0ZXIgc2NoZWR1bGVkIGNhbGxiYWNrXG4gICAgLy8gZXhlY3V0aW9uLlxuICAgIC8vXG4gICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHBlbmRpbmcgZmxhZyBpbmRpY2F0aW5nIHRoYXQgdGhpcyBhY3Rpb24gaGFzIGJlZW4gc2NoZWR1bGVkLCBvclxuICAgIC8vIGhhcyByZWN1cnNpdmVseSByZXNjaGVkdWxlZCBpdHNlbGYuXG4gICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAvLyBJZiB0aGlzIGFjdGlvbiBoYXMgYWxyZWFkeSBhbiBhc3luYyBJZCwgZG9uJ3QgcmVxdWVzdCBhIG5ldyBvbmUuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQgfHwgdGhpcy5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIHRoaXMuaWQsIGRlbGF5KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgcmV0dXJuIHNldEludGVydmFsKHNjaGVkdWxlci5mbHVzaC5iaW5kKHNjaGVkdWxlciwgdGhpcyksIGRlbGF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLCBpZDogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgdGhpcyBhY3Rpb24gaXMgcmVzY2hlZHVsZWQgd2l0aCB0aGUgc2FtZSBkZWxheSB0aW1lLCBkb24ndCBjbGVhciB0aGUgaW50ZXJ2YWwgaWQuXG4gICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIHRoaXMuZGVsYXkgPT09IGRlbGF5ICYmIHRoaXMucGVuZGluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgYWN0aW9uJ3MgZGVsYXkgdGltZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBkZWxheSxcbiAgICAvLyBvciB0aGUgYWN0aW9uIGhhcyBiZWVuIHJlc2NoZWR1bGVkIGJlZm9yZSBpdCdzIGV4ZWN1dGVkLCBjbGVhciB0aGUgaW50ZXJ2YWwgaWRcbiAgICBjbGVhckludGVydmFsKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBleGVjdXRlcyB0aGlzIGFjdGlvbiBhbmQgdGhlIGB3b3JrYCBpdCBjb250YWlucy5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgcHVibGljIGV4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdleGVjdXRpbmcgYSBjYW5jZWxsZWQgYWN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgY29uc3QgZXJyb3IgPSB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBlbmRpbmcgPT09IGZhbHNlICYmIHRoaXMuaWQgIT0gbnVsbCkge1xuICAgICAgLy8gRGVxdWV1ZSBpZiB0aGUgYWN0aW9uIGRpZG4ndCByZXNjaGVkdWxlIGl0c2VsZi4gRG9uJ3QgY2FsbFxuICAgICAgLy8gdW5zdWJzY3JpYmUoKSwgYmVjYXVzZSB0aGUgYWN0aW9uIGNvdWxkIHJlc2NoZWR1bGUgbGF0ZXIuXG4gICAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAgIC8vIGBgYFxuICAgICAgLy8gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uIGRvV29yayhjb3VudGVyKSB7XG4gICAgICAvLyAgIC8qIC4uLiBJJ20gYSBidXN5IHdvcmtlciBiZWUgLi4uICovXG4gICAgICAvLyAgIHZhciBvcmlnaW5hbEFjdGlvbiA9IHRoaXM7XG4gICAgICAvLyAgIC8qIHdhaXQgMTAwbXMgYmVmb3JlIHJlc2NoZWR1bGluZyB0aGUgYWN0aW9uICovXG4gICAgICAvLyAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAgIG9yaWdpbmFsQWN0aW9uLnNjaGVkdWxlKGNvdW50ZXIgKyAxKTtcbiAgICAgIC8vICAgfSwgMTAwKTtcbiAgICAgIC8vIH0sIDEwMDApO1xuICAgICAgLy8gYGBgXG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZCh0aGlzLnNjaGVkdWxlciwgdGhpcy5pZCwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9leGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICBsZXQgZXJyb3JlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBlcnJvclZhbHVlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMud29yayhzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICBlcnJvclZhbHVlID0gISFlICYmIGUgfHwgbmV3IEVycm9yKGUpO1xuICAgIH1cbiAgICBpZiAoZXJyb3JlZCkge1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgcmV0dXJuIGVycm9yVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgY29uc3QgYWN0aW9ucyA9IHNjaGVkdWxlci5hY3Rpb25zO1xuICAgIGNvbnN0IGluZGV4ID0gYWN0aW9ucy5pbmRleE9mKHRoaXMpO1xuXG4gICAgdGhpcy53b3JrICA9IG51bGw7XG4gICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBudWxsO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgYWN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlbGF5ID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBRdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vUXVldWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXVlQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IFF1ZXVlU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLnNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBleGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICByZXR1cm4gKGRlbGF5ID4gMCB8fCB0aGlzLmNsb3NlZCkgP1xuICAgICAgc3VwZXIuZXhlY3V0ZShzdGF0ZSwgZGVsYXkpIDpcbiAgICAgIHRoaXMuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KSA7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBRdWV1ZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIGZsdXNoIHRoZSBzY2hlZHVsZXIgc3RhcnRpbmcgd2l0aCB0aGlzIGFjdGlvbi5cbiAgICByZXR1cm4gc2NoZWR1bGVyLmZsdXNoKHRoaXMpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL3NjaGVkdWxlci9BY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQW4gZXhlY3V0aW9uIGNvbnRleHQgYW5kIGEgZGF0YSBzdHJ1Y3R1cmUgdG8gb3JkZXIgdGFza3MgYW5kIHNjaGVkdWxlIHRoZWlyXG4gKiBleGVjdXRpb24uIFByb3ZpZGVzIGEgbm90aW9uIG9mIChwb3RlbnRpYWxseSB2aXJ0dWFsKSB0aW1lLCB0aHJvdWdoIHRoZVxuICogYG5vdygpYCBnZXR0ZXIgbWV0aG9kLlxuICpcbiAqIEVhY2ggdW5pdCBvZiB3b3JrIGluIGEgU2NoZWR1bGVyIGlzIGNhbGxlZCBhbiBgQWN0aW9uYC5cbiAqXG4gKiBgYGB0c1xuICogY2xhc3MgU2NoZWR1bGVyIHtcbiAqICAgbm93KCk6IG51bWJlcjtcbiAqICAgc2NoZWR1bGUod29yaywgZGVsYXk/LCBzdGF0ZT8pOiBTdWJzY3JpcHRpb247XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAY2xhc3MgU2NoZWR1bGVyXG4gKiBAZGVwcmVjYXRlZCBTY2hlZHVsZXIgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIFJ4SlMsIGFuZFxuICogc2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5LiBSYXRoZXIsIGNyZWF0ZSB5b3VyIG93biBjbGFzcyBhbmQgaW1wbGVtZW50XG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX1cbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVkdWxlciBpbXBsZW1lbnRzIFNjaGVkdWxlckxpa2Uge1xuXG4gIC8qKlxuICAgKiBOb3RlOiB0aGUgZXh0cmEgYXJyb3cgZnVuY3Rpb24gd3JhcHBlciBpcyB0byBtYWtlIHRlc3RpbmcgYnkgb3ZlcnJpZGluZ1xuICAgKiBEYXRlLm5vdyBlYXNpZXIuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdzogKCkgPT4gbnVtYmVyID0gKCkgPT4gRGF0ZS5ub3coKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFjdGlvbixcbiAgICAgICAgICAgICAgbm93OiAoKSA9PiBudW1iZXIgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgdGhpcy5ub3cgPSBub3c7XG4gIH1cblxuICAvKipcbiAgICogQSBnZXR0ZXIgbWV0aG9kIHRoYXQgcmV0dXJucyBhIG51bWJlciByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgdGltZVxuICAgKiAoYXQgdGhlIHRpbWUgdGhpcyBmdW5jdGlvbiB3YXMgY2FsbGVkKSBhY2NvcmRpbmcgdG8gdGhlIHNjaGVkdWxlcidzIG93blxuICAgKiBpbnRlcm5hbCBjbG9jay5cbiAgICogQHJldHVybiB7bnVtYmVyfSBBIG51bWJlciB0aGF0IHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgdGltZS4gTWF5IG9yIG1heSBub3RcbiAgICogaGF2ZSBhIHJlbGF0aW9uIHRvIHdhbGwtY2xvY2sgdGltZS4gTWF5IG9yIG1heSBub3QgcmVmZXIgdG8gYSB0aW1lIHVuaXRcbiAgICogKGUuZy4gbWlsbGlzZWNvbmRzKS5cbiAgICovXG4gIHB1YmxpYyBub3c6ICgpID0+IG51bWJlcjtcblxuICAvKipcbiAgICogU2NoZWR1bGVzIGEgZnVuY3Rpb24sIGB3b3JrYCwgZm9yIGV4ZWN1dGlvbi4gTWF5IGhhcHBlbiBhdCBzb21lIHBvaW50IGluXG4gICAqIHRoZSBmdXR1cmUsIGFjY29yZGluZyB0byB0aGUgYGRlbGF5YCBwYXJhbWV0ZXIsIGlmIHNwZWNpZmllZC4gTWF5IGJlIHBhc3NlZFxuICAgKiBzb21lIGNvbnRleHQgb2JqZWN0LCBgc3RhdGVgLCB3aGljaCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgYHdvcmtgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBUaGUgZ2l2ZW4gYXJndW1lbnRzIHdpbGwgYmUgcHJvY2Vzc2VkIGFuIHN0b3JlZCBhcyBhbiBBY3Rpb24gb2JqZWN0IGluIGFcbiAgICogcXVldWUgb2YgYWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdGF0ZTogP1QpOiA/U3Vic2NyaXB0aW9ufSB3b3JrIEEgZnVuY3Rpb24gcmVwcmVzZW50aW5nIGFcbiAgICogdGFzaywgb3Igc29tZSB1bml0IG9mIHdvcmsgdG8gYmUgZXhlY3V0ZWQgYnkgdGhlIFNjaGVkdWxlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gVGltZSB0byB3YWl0IGJlZm9yZSBleGVjdXRpbmcgdGhlIHdvcmssIHdoZXJlIHRoZVxuICAgKiB0aW1lIHVuaXQgaXMgaW1wbGljaXQgYW5kIGRlZmluZWQgYnkgdGhlIFNjaGVkdWxlciBpdHNlbGYuXG4gICAqIEBwYXJhbSB7VH0gW3N0YXRlXSBTb21lIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBgd29ya2AgZnVuY3Rpb24gdXNlcyB3aGVuXG4gICAqIGNhbGxlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpcHRpb259IEEgc3Vic2NyaXB0aW9uIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gdW5zdWJzY3JpYmVcbiAgICogdGhlIHNjaGVkdWxlZCB3b3JrLlxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlPFQ+KHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCwgZGVsYXk6IG51bWJlciA9IDAsIHN0YXRlPzogVCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLlNjaGVkdWxlckFjdGlvbjxUPih0aGlzLCB3b3JrKS5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuLi9TY2hlZHVsZXInO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9BY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBBc3luY1NjaGVkdWxlciBleHRlbmRzIFNjaGVkdWxlciB7XG4gIHB1YmxpYyBzdGF0aWMgZGVsZWdhdGU/OiBTY2hlZHVsZXI7XG4gIHB1YmxpYyBhY3Rpb25zOiBBcnJheTxBc3luY0FjdGlvbjxhbnk+PiA9IFtdO1xuICAvKipcbiAgICogQSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgdGhlIFNjaGVkdWxlciBpcyBjdXJyZW50bHkgZXhlY3V0aW5nIGEgYmF0Y2ggb2ZcbiAgICogcXVldWVkIGFjdGlvbnMuXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAZGVwcmVjYXRlZCBpbnRlcm5hbCB1c2Ugb25seVxuICAgKi9cbiAgcHVibGljIGFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogQW4gaW50ZXJuYWwgSUQgdXNlZCB0byB0cmFjayB0aGUgbGF0ZXN0IGFzeW5jaHJvbm91cyB0YXNrIHN1Y2ggYXMgdGhvc2VcbiAgICogY29taW5nIGZyb20gYHNldFRpbWVvdXRgLCBgc2V0SW50ZXJ2YWxgLCBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCwgYW5kXG4gICAqIG90aGVycy5cbiAgICogQHR5cGUge2FueX1cbiAgICogQGRlcHJlY2F0ZWQgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICovXG4gIHB1YmxpYyBzY2hlZHVsZWQ6IGFueSA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihTY2hlZHVsZXJBY3Rpb246IHR5cGVvZiBBY3Rpb24sXG4gICAgICAgICAgICAgIG5vdzogKCkgPT4gbnVtYmVyID0gU2NoZWR1bGVyLm5vdykge1xuICAgIHN1cGVyKFNjaGVkdWxlckFjdGlvbiwgKCkgPT4ge1xuICAgICAgaWYgKEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICYmIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlICE9PSB0aGlzKSB7XG4gICAgICAgIHJldHVybiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZS5ub3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBub3coKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZTxUPih3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQsIGRlbGF5OiBudW1iZXIgPSAwLCBzdGF0ZT86IFQpOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmIChBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAmJiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAhPT0gdGhpcykge1xuICAgICAgcmV0dXJuIEFzeW5jU2NoZWR1bGVyLmRlbGVnYXRlLnNjaGVkdWxlKHdvcmssIGRlbGF5LCBzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZSh3b3JrLCBkZWxheSwgc3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmbHVzaChhY3Rpb246IEFzeW5jQWN0aW9uPGFueT4pOiB2b2lkIHtcblxuICAgIGNvbnN0IHthY3Rpb25zfSA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBlcnJvcjogYW55O1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcblxuICAgIGRvIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IHdoaWxlIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpOyAvLyBleGhhdXN0IHRoZSBzY2hlZHVsZXIgcXVldWVcblxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbmV4cG9ydCBjbGFzcyBRdWV1ZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbn1cbiIsImltcG9ydCB7IFF1ZXVlQWN0aW9uIH0gZnJvbSAnLi9RdWV1ZUFjdGlvbic7XG5pbXBvcnQgeyBRdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vUXVldWVTY2hlZHVsZXInO1xuXG4vKipcbiAqXG4gKiBRdWV1ZSBTY2hlZHVsZXJcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UHV0IGV2ZXJ5IG5leHQgdGFzayBvbiBhIHF1ZXVlLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpdCBpbW1lZGlhdGVseTwvc3Bhbj5cbiAqXG4gKiBgcXVldWVgIHNjaGVkdWxlciwgd2hlbiB1c2VkIHdpdGggZGVsYXksIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXIuXG4gKlxuICogV2hlbiB1c2VkIHdpdGhvdXQgZGVsYXksIGl0IHNjaGVkdWxlcyBnaXZlbiB0YXNrIHN5bmNocm9ub3VzbHkgLSBleGVjdXRlcyBpdCByaWdodCB3aGVuXG4gKiBpdCBpcyBzY2hlZHVsZWQuIEhvd2V2ZXIgd2hlbiBjYWxsZWQgcmVjdXJzaXZlbHksIHRoYXQgaXMgd2hlbiBpbnNpZGUgdGhlIHNjaGVkdWxlZCB0YXNrLFxuICogYW5vdGhlciB0YXNrIGlzIHNjaGVkdWxlZCB3aXRoIHF1ZXVlIHNjaGVkdWxlciwgaW5zdGVhZCBvZiBleGVjdXRpbmcgaW1tZWRpYXRlbHkgYXMgd2VsbCxcbiAqIHRoYXQgdGFzayB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlIGFuZCB3YWl0IGZvciBjdXJyZW50IG9uZSB0byBmaW5pc2guXG4gKlxuICogVGhpcyBtZWFucyB0aGF0IHdoZW4geW91IGV4ZWN1dGUgdGFzayB3aXRoIGBxdWV1ZWAgc2NoZWR1bGVyLCB5b3UgYXJlIHN1cmUgaXQgd2lsbCBlbmRcbiAqIGJlZm9yZSBhbnkgb3RoZXIgdGFzayBzY2hlZHVsZWQgd2l0aCB0aGF0IHNjaGVkdWxlciB3aWxsIHN0YXJ0LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBTY2hlZHVsZSByZWN1cnNpdmVseSBmaXJzdCwgdGhlbiBkbyBzb21ldGhpbmdcbiAqIGBgYGphdmFzY3JpcHRcbiAqIFJ4LlNjaGVkdWxlci5xdWV1ZS5zY2hlZHVsZSgoKSA9PiB7XG4gKiAgIFJ4LlNjaGVkdWxlci5xdWV1ZS5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnc2Vjb25kJykpOyAvLyB3aWxsIG5vdCBoYXBwZW4gbm93LCBidXQgd2lsbCBiZSBwdXQgb24gYSBxdWV1ZVxuICpcbiAqICAgY29uc29sZS5sb2coJ2ZpcnN0Jyk7XG4gKiB9KTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJmaXJzdFwiXG4gKiAvLyBcInNlY29uZFwiXG4gKiBgYGBcbiAqXG4gKiBSZXNjaGVkdWxlIGl0c2VsZiByZWN1cnNpdmVseVxuICogYGBgamF2YXNjcmlwdFxuICogUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKGZ1bmN0aW9uKHN0YXRlKSB7XG4gKiAgIGlmIChzdGF0ZSAhPT0gMCkge1xuICogICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBzdGF0ZSk7XG4gKiAgICAgdGhpcy5zY2hlZHVsZShzdGF0ZSAtIDEpOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdlIHJlc2NoZWR1bGUgd2l0aCBuZXcgc3RhdGVcbiAqICAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCBzdGF0ZSk7XG4gKiAgIH1cbiAqIH0sIDAsIDMpO1xuICpcbiAqIC8vIEluIHNjaGVkdWxlciB0aGF0IHJ1bnMgcmVjdXJzaXZlbHksIHlvdSB3b3VsZCBleHBlY3Q6XG4gKiAvLyBcImJlZm9yZVwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMlxuICogLy8gXCJhZnRlclwiLCAzXG4gKlxuICogLy8gQnV0IHdpdGggcXVldWUgaXQgbG9nczpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYWZ0ZXJcIiwgM1xuICogLy8gXCJiZWZvcmVcIiwgMlxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcXVldWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgcXVldWUgPSBuZXcgUXVldWVTY2hlZHVsZXIoUXVldWVBY3Rpb24pO1xuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgc2FtZSBPYnNlcnZhYmxlIGluc3RhbmNlIHJldHVybmVkIGJ5IGFueSBjYWxsIHRvIHtAbGluayBlbXB0eX0gd2l0aG91dCBhXG4gKiBgc2NoZWR1bGVyYC4gSXQgaXMgcHJlZmVycmFibGUgdG8gdXNlIHRoaXMgb3ZlciBgZW1wdHkoKWAuXG4gKi9cbmV4cG9ydCBjb25zdCBFTVBUWSA9IG5ldyBPYnNlcnZhYmxlPG5ldmVyPihzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBpbW1lZGlhdGVseVxuICogZW1pdHMgYSBjb21wbGV0ZSBub3RpZmljYXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkp1c3QgZW1pdHMgJ2NvbXBsZXRlJywgYW5kIG5vdGhpbmcgZWxzZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10oZW1wdHkucG5nKVxuICpcbiAqIFRoaXMgc3RhdGljIG9wZXJhdG9yIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmcgYSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IG9ubHlcbiAqIGVtaXRzIHRoZSBjb21wbGV0ZSBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMsIHN1Y2ggYXMgaW4gYSB7QGxpbmsgbWVyZ2VNYXB9LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdCB0aGUgbnVtYmVyIDcsIHRoZW4gY29tcGxldGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHJlc3VsdCA9IGVtcHR5KCkucGlwZShzdGFydFdpdGgoNykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBNYXAgYW5kIGZsYXR0ZW4gb25seSBvZGQgbnVtYmVycyB0byB0aGUgc2VxdWVuY2UgJ2EnLCAnYicsICdjJ1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgaW50ZXJ2YWwkID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiByZXN1bHQgPSBpbnRlcnZhbCQucGlwZShcbiAqICAgbWVyZ2VNYXAoeCA9PiB4ICUgMiA9PT0gMSA/IG9mKCdhJywgJ2InLCAnYycpIDogZW1wdHkoKSksXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmcgdG8gdGhlIGNvbnNvbGU6XG4gKiAvLyB4IGlzIGVxdWFsIHRvIHRoZSBjb3VudCBvbiB0aGUgaW50ZXJ2YWwgZWcoMCwxLDIsMywuLi4pXG4gKiAvLyB4IHdpbGwgb2NjdXIgZXZlcnkgMTAwMG1zXG4gKiAvLyBpZiB4ICUgMiBpcyBlcXVhbCB0byAxIHByaW50IGFiY1xuICogLy8gaWYgeCAlIDIgaXMgbm90IGVxdWFsIHRvIDEgbm90aGluZyB3aWxsIGJlIG91dHB1dFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqIEBzZWUge0BsaW5rIG5ldmVyfVxuICogQHNlZSB7QGxpbmsgb2Z9XG4gKiBAc2VlIHtAbGluayB0aHJvd0Vycm9yfVxuICpcbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdGhlIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIFwiZW1wdHlcIiBPYnNlcnZhYmxlOiBlbWl0cyBvbmx5IHRoZSBjb21wbGV0ZVxuICogbm90aWZpY2F0aW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBlbXB0eVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgdXNpbmcge0BsaW5rIGluZGV4L0VNUFRZfSBjb25zdGFudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5KHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgcmV0dXJuIHNjaGVkdWxlciA/IGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcikgOiBFTVBUWTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5U2NoZWR1bGVkKHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8bmV2ZXI+KHN1YnNjcmliZXIgPT4gc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSkpO1xufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBTY2hlZHVsZXJMaWtlIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiAoPGFueT52YWx1ZSkuc2NoZWR1bGUgPT09ICdmdW5jdGlvbic7XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogU3Vic2NyaWJlcyB0byBhbiBBcnJheUxpa2Ugd2l0aCBhIHN1YnNjcmliZXJcbiAqIEBwYXJhbSBhcnJheSBUaGUgYXJyYXkgb3IgYXJyYXktbGlrZSB0byBzdWJzY3JpYmUgdG9cbiAqL1xuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvQXJyYXkgPSA8VD4oYXJyYXk6IEFycmF5TGlrZTxUPikgPT4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgIHN1YnNjcmliZXIubmV4dChhcnJheVtpXSk7XG4gIH1cbiAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9BcnJheSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9BcnJheSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQXJyYXk8VD4oaW5wdXQ6IEFycmF5TGlrZTxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb0FycmF5KGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA9PT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5wdXRbaSsrXSk7XG4gICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICBzdWIuYWRkKHRoaXMuc2NoZWR1bGUoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxhcjxUPih2YWx1ZTogVCkge1xuICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgfSk7XG4gIHJlc3VsdC5faXNTY2FsYXIgPSB0cnVlO1xuICAocmVzdWx0IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHNjYWxhciB9IGZyb20gJy4vc2NhbGFyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oYTogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDI+KGE6IFQsIGI6IFQyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMz4oYTogVCwgYjogVDIsIGM6IFQzLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUND4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDU+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNz4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNywgVDg+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIGg6IFQ4LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDg+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDcsIFQ4LCBUOT4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgaDogVDgsIGk6IFQ5LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDggfCBUOT47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29udmVydHMgdGhlIGFyZ3VtZW50cyB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FYWNoIGFyZ3VtZW50IGJlY29tZXMgYSBgbmV4dGAgbm90aWZpY2F0aW9uLjwvc3Bhbj5cbiAqXG4gKiAhW10ob2YucG5nKVxuICpcbiAqIFVubGlrZSB7QGxpbmsgZnJvbX0sIGl0IGRvZXMgbm90IGRvIGFueSBmbGF0dGVuaW5nIGFuZCBlbWl0cyBlYWNoIGFyZ3VtZW50IGluIHdob2xlXG4gKiBhcyBhIHNlcGFyYXRlIGBuZXh0YCBub3RpZmljYXRpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBFbWl0IHRoZSB2YWx1ZXMgYDEwLCAyMCwgMzBgXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoMTAsIDIwLCAzMClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogMTAnXG4gKiAvLyAnbmV4dDogMjAnXG4gKiAvLyAnbmV4dDogMzAnXG4gKlxuICogYGBgXG4gKlxuICogRW1pdCB0aGUgYXJyYXkgYFsxLDIsM11gXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoWzEsMiwzXSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogWzEsMiwzXSdcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayByYW5nZX1cbiAqXG4gKiBAcGFyYW0gey4uLlR9IHZhbHVlcyBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGFyZ3VtZW50cyB5b3Ugd2FudCB0byBiZSBlbWl0dGVkXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGFyZ3VtZW50c1xuICogZGVzY3JpYmVkIGFib3ZlIGFuZCB0aGVuIGNvbXBsZXRlcy5cbiAqIEBtZXRob2Qgb2ZcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KC4uLmFyZ3M6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VD4ge1xuICBsZXQgc2NoZWR1bGVyID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIGFzIFNjaGVkdWxlckxpa2U7XG4gIGlmIChpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgYXJncy5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZXIgPSB1bmRlZmluZWQ7XG4gIH1cbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBlbXB0eShzY2hlZHVsZXIpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBzY2hlZHVsZXIgPyBmcm9tQXJyYXkoYXJncyBhcyBUW10sIHNjaGVkdWxlcikgOiBzY2FsYXIoYXJnc1swXSBhcyBUKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBubyBpdGVtcyB0byB0aGUgT2JzZXJ2ZXIgYW5kIGltbWVkaWF0ZWx5XG4gKiBlbWl0cyBhbiBlcnJvciBub3RpZmljYXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkp1c3QgZW1pdHMgJ2Vycm9yJywgYW5kIG5vdGhpbmcgZWxzZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10odGhyb3cucG5nKVxuICpcbiAqIFRoaXMgc3RhdGljIG9wZXJhdG9yIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmcgYSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IG9ubHlcbiAqIGVtaXRzIHRoZSBlcnJvciBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMsIHN1Y2ggYXMgaW4gYSB7QGxpbmsgbWVyZ2VNYXB9LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdCB0aGUgbnVtYmVyIDcsIHRoZW4gZW1pdCBhbiBlcnJvclxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgdGhyb3dFcnJvciwgY29uY2F0LCBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdChvZig3KSwgdGhyb3dFcnJvcihuZXcgRXJyb3IoJ29vcHMhJykpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gN1xuICogLy8gRXJyb3I6IG9vcHMhXG4gKiBgYGBcbiAqXG4gKiAtLS1cbiAqXG4gKiAjIyMgTWFwIGFuZCBmbGF0dGVuIG51bWJlcnMgdG8gdGhlIHNlcXVlbmNlICdhJywgJ2InLCAnYycsIGJ1dCB0aHJvdyBhbiBlcnJvciBmb3IgMTNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRocm93RXJyb3IsIGludGVydmFsLCBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJ2YWwoMTAwMCkucGlwZShcbiAqICAgbWVyZ2VNYXAoeCA9PiB4ID09PSAyXG4gKiAgICAgPyB0aHJvd0Vycm9yKCdUd29zIGFyZSBiYWQnKVxuICogICAgIDogb2YoJ2EnLCAnYicsICdjJylcbiAqICAgKSxcbiAqICkuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIGFcbiAqIC8vIGJcbiAqIC8vIGNcbiAqIC8vIGFcbiAqIC8vIGJcbiAqIC8vIGNcbiAqIC8vIFR3b3MgYXJlIGJhZFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqIEBzZWUge0BsaW5rIGVtcHR5fVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqXG4gKiBAcGFyYW0ge2FueX0gZXJyb3IgVGhlIHBhcnRpY3VsYXIgRXJyb3IgdG8gcGFzcyB0byB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gZXJyb3IgT2JzZXJ2YWJsZTogZW1pdHMgb25seSB0aGUgZXJyb3Igbm90aWZpY2F0aW9uXG4gKiB1c2luZyB0aGUgZ2l2ZW4gZXJyb3IgYXJndW1lbnQuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHRocm93RXJyb3JcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd0Vycm9yKGVycm9yOiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPG5ldmVyPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5lcnJvcihlcnJvcikpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwgeyBlcnJvciwgc3Vic2NyaWJlciB9KSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoQXJnIHtcbiAgZXJyb3I6IGFueTtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaCh7IGVycm9yLCBzdWJzY3JpYmVyIH06IERpc3BhdGNoQXJnKSB7XG4gIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xufVxuIiwiaW1wb3J0IHsgUGFydGlhbE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHB1c2gtYmFzZWQgZXZlbnQgb3IgdmFsdWUgdGhhdCBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0gY2FuIGVtaXQuXG4gKiBUaGlzIGNsYXNzIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIG9wZXJhdG9ycyB0aGF0IG1hbmFnZSBub3RpZmljYXRpb25zLFxuICogbGlrZSB7QGxpbmsgbWF0ZXJpYWxpemV9LCB7QGxpbmsgZGVtYXRlcmlhbGl6ZX0sIHtAbGluayBvYnNlcnZlT259LCBhbmRcbiAqIG90aGVycy4gQmVzaWRlcyB3cmFwcGluZyB0aGUgYWN0dWFsIGRlbGl2ZXJlZCB2YWx1ZSwgaXQgYWxzbyBhbm5vdGF0ZXMgaXRcbiAqIHdpdGggbWV0YWRhdGEgb2YsIGZvciBpbnN0YW5jZSwgd2hhdCB0eXBlIG9mIHB1c2ggbWVzc2FnZSBpdCBpcyAoYG5leHRgLFxuICogYGVycm9yYCwgb3IgYGNvbXBsZXRlYCkuXG4gKlxuICogQHNlZSB7QGxpbmsgbWF0ZXJpYWxpemV9XG4gKiBAc2VlIHtAbGluayBkZW1hdGVyaWFsaXplfVxuICogQHNlZSB7QGxpbmsgb2JzZXJ2ZU9ufVxuICpcbiAqIEBjbGFzcyBOb3RpZmljYXRpb248VD5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbjxUPiB7XG4gIGhhc1ZhbHVlOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBraW5kOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZT86IFQsIHB1YmxpYyBlcnJvcj86IGFueSkge1xuICAgIHRoaXMuaGFzVmFsdWUgPSBraW5kID09PSAnTic7XG4gIH1cblxuICAvKipcbiAgICogRGVsaXZlcnMgdG8gdGhlIGdpdmVuIGBvYnNlcnZlcmAgdGhlIHZhbHVlIHdyYXBwZWQgYnkgdGhpcyBOb3RpZmljYXRpb24uXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ9IG9ic2VydmVyXG4gICAqIEByZXR1cm5cbiAgICovXG4gIG9ic2VydmUob2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPik6IGFueSB7XG4gICAgc3dpdGNoICh0aGlzLmtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dCAmJiBvYnNlcnZlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5lcnJvciAmJiBvYnNlcnZlci5lcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuY29tcGxldGUgJiYgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gc29tZSB7QGxpbmsgT2JzZXJ2ZXJ9IGNhbGxiYWNrcywgZGVsaXZlciB0aGUgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlXG4gICAqIGN1cnJlbnQgTm90aWZpY2F0aW9uIHRvIHRoZSBjb3JyZWN0bHkgY29ycmVzcG9uZGluZyBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IHZvaWR9IG5leHQgQW4gT2JzZXJ2ZXIgYG5leHRgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGVycjogYW55KTogdm9pZH0gW2Vycm9yXSBBbiBPYnNlcnZlciBgZXJyb3JgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gQW4gT2JzZXJ2ZXIgYGNvbXBsZXRlYCBjYWxsYmFjay5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZG8obmV4dDogKHZhbHVlOiBUKSA9PiB2b2lkLCBlcnJvcj86IChlcnI6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogYW55IHtcbiAgICBjb25zdCBraW5kID0gdGhpcy5raW5kO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBuZXh0ICYmIG5leHQodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIGVycm9yICYmIGVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBjb21wbGV0ZSAmJiBjb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhbiBPYnNlcnZlciBvciBpdHMgaW5kaXZpZHVhbCBjYWxsYmFjayBmdW5jdGlvbnMsIGFuZCBjYWxscyBgb2JzZXJ2ZWBcbiAgICogb3IgYGRvYCBtZXRob2RzIGFjY29yZGluZ2x5LlxuICAgKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gbmV4dE9yT2JzZXJ2ZXIgQW4gT2JzZXJ2ZXIgb3JcbiAgICogdGhlIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGFjY2VwdChuZXh0T3JPYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksIGVycm9yPzogKGVycjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgJiYgdHlwZW9mICg8UGFydGlhbE9ic2VydmVyPFQ+Pm5leHRPck9ic2VydmVyKS5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+bmV4dE9yT2JzZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kbyg8KHZhbHVlOiBUKSA9PiB2b2lkPm5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb24gcmVwcmVzZW50ZWRcbiAgICogYnkgdGhpcyBOb3RpZmljYXRpb24gaW5zdGFuY2UuXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIHRvT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBraW5kID0gdGhpcy5raW5kO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBvZih0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIG5vdGlmaWNhdGlvbiBraW5kIHZhbHVlJyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjb21wbGV0ZU5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4gPSBuZXcgTm90aWZpY2F0aW9uKCdDJyk7XG4gIHByaXZhdGUgc3RhdGljIHVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oJ04nLCB1bmRlZmluZWQpO1xuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgbmV4dGAgZnJvbSBhXG4gICAqIGdpdmVuIHZhbHVlLlxuICAgKiBAcGFyYW0ge1R9IHZhbHVlIFRoZSBgbmV4dGAgdmFsdWUuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxUPn0gVGhlIFwibmV4dFwiIE5vdGlmaWNhdGlvbiByZXByZXNlbnRpbmcgdGhlXG4gICAqIGFyZ3VtZW50LlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZU5leHQ8VD4odmFsdWU6IFQpOiBOb3RpZmljYXRpb248VD4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignTicsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi51bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgZXJyb3JgIGZyb20gYVxuICAgKiBnaXZlbiBlcnJvci5cbiAgICogQHBhcmFtIHthbnl9IFtlcnJdIFRoZSBgZXJyb3JgIGVycm9yLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248VD59IFRoZSBcImVycm9yXCIgTm90aWZpY2F0aW9uIHJlcHJlc2VudGluZyB0aGVcbiAgICogYXJndW1lbnQuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlRXJyb3I8VD4oZXJyPzogYW55KTogTm90aWZpY2F0aW9uPFQ+IHtcbiAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCwgZXJyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgY29tcGxldGVgLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248YW55Pn0gVGhlIHZhbHVlbGVzcyBcImNvbXBsZXRlXCIgTm90aWZpY2F0aW9uLlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUNvbXBsZXRlKCk6IE5vdGlmaWNhdGlvbjxhbnk+IHtcbiAgICByZXR1cm4gTm90aWZpY2F0aW9uLmNvbXBsZXRlTm90aWZpY2F0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKlxuICogUmUtZW1pdHMgYWxsIG5vdGlmaWNhdGlvbnMgZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIHNwZWNpZmllZCBzY2hlZHVsZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVuc3VyZSBhIHNwZWNpZmljIHNjaGVkdWxlciBpcyB1c2VkLCBmcm9tIG91dHNpZGUgb2YgYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYG9ic2VydmVPbmAgaXMgYW4gb3BlcmF0b3IgdGhhdCBhY2NlcHRzIGEgc2NoZWR1bGVyIGFzIGEgZmlyc3QgcGFyYW1ldGVyLCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gcmVzY2hlZHVsZVxuICogbm90aWZpY2F0aW9ucyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSXQgbWlnaHQgYmUgdXNlZnVsLCBpZiB5b3UgZG8gbm90IGhhdmUgY29udHJvbCBvdmVyXG4gKiBpbnRlcm5hbCBzY2hlZHVsZXIgb2YgYSBnaXZlbiBPYnNlcnZhYmxlLCBidXQgd2FudCB0byBjb250cm9sIHdoZW4gaXRzIHZhbHVlcyBhcmUgZW1pdHRlZCBuZXZlcnRoZWxlc3MuXG4gKlxuICogUmV0dXJuZWQgT2JzZXJ2YWJsZSBlbWl0cyB0aGUgc2FtZSBub3RpZmljYXRpb25zIChuZXh0ZWQgdmFsdWVzLCBjb21wbGV0ZSBhbmQgZXJyb3IgZXZlbnRzKSBhcyB0aGUgc291cmNlIE9ic2VydmFibGUsXG4gKiBidXQgcmVzY2hlZHVsZWQgd2l0aCBwcm92aWRlZCBzY2hlZHVsZXIuIE5vdGUgdGhhdCB0aGlzIGRvZXNuJ3QgbWVhbiB0aGF0IHNvdXJjZSBPYnNlcnZhYmxlcyBpbnRlcm5hbFxuICogc2NoZWR1bGVyIHdpbGwgYmUgcmVwbGFjZWQgaW4gYW55IHdheS4gT3JpZ2luYWwgc2NoZWR1bGVyIHN0aWxsIHdpbGwgYmUgdXNlZCwgYnV0IHdoZW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzXG4gKiBub3RpZmljYXRpb24sIGl0IHdpbGwgYmUgaW1tZWRpYXRlbHkgc2NoZWR1bGVkIGFnYWluIC0gdGhpcyB0aW1lIHdpdGggc2NoZWR1bGVyIHBhc3NlZCB0byBgb2JzZXJ2ZU9uYC5cbiAqIEFuIGFudGktcGF0dGVybiB3b3VsZCBiZSBjYWxsaW5nIGBvYnNlcnZlT25gIG9uIE9ic2VydmFibGUgdGhhdCBlbWl0cyBsb3RzIG9mIHZhbHVlcyBzeW5jaHJvbm91c2x5LCB0byBzcGxpdFxuICogdGhhdCBlbWlzc2lvbnMgaW50byBhc3luY2hyb25vdXMgY2h1bmtzLiBGb3IgdGhpcyB0byBoYXBwZW4sIHNjaGVkdWxlciB3b3VsZCBoYXZlIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgZGlyZWN0bHkgKHVzdWFsbHkgaW50byB0aGUgb3BlcmF0b3IgdGhhdCBjcmVhdGVzIGl0KS4gYG9ic2VydmVPbmAgc2ltcGx5IGRlbGF5cyBub3RpZmljYXRpb25zIGFcbiAqIGxpdHRsZSBiaXQgbW9yZSwgdG8gZW5zdXJlIHRoYXQgdGhleSBhcmUgZW1pdHRlZCBhdCBleHBlY3RlZCBtb21lbnRzLlxuICpcbiAqIEFzIGEgbWF0dGVyIG9mIGZhY3QsIGBvYnNlcnZlT25gIGFjY2VwdHMgc2Vjb25kIHBhcmFtZXRlciwgd2hpY2ggc3BlY2lmaWVzIGluIG1pbGxpc2Vjb25kcyB3aXRoIHdoYXQgZGVsYXkgbm90aWZpY2F0aW9uc1xuICogd2lsbCBiZSBlbWl0dGVkLiBUaGUgbWFpbiBkaWZmZXJlbmNlIGJldHdlZW4ge0BsaW5rIGRlbGF5fSBvcGVyYXRvciBhbmQgYG9ic2VydmVPbmAgaXMgdGhhdCBgb2JzZXJ2ZU9uYFxuICogd2lsbCBkZWxheSBhbGwgbm90aWZpY2F0aW9ucyAtIGluY2x1ZGluZyBlcnJvciBub3RpZmljYXRpb25zIC0gd2hpbGUgYGRlbGF5YCB3aWxsIHBhc3MgdGhyb3VnaCBlcnJvclxuICogZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZSBpbW1lZGlhdGVseSB3aGVuIGl0IGlzIGVtaXR0ZWQuIEluIGdlbmVyYWwgaXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkIHRvIHVzZSBgZGVsYXlgIG9wZXJhdG9yXG4gKiBmb3IgYW55IGtpbmQgb2YgZGVsYXlpbmcgb2YgdmFsdWVzIGluIHRoZSBzdHJlYW0sIHdoaWxlIHVzaW5nIGBvYnNlcnZlT25gIHRvIHNwZWNpZnkgd2hpY2ggc2NoZWR1bGVyIHNob3VsZCBiZSB1c2VkXG4gKiBmb3Igbm90aWZpY2F0aW9uIGVtaXNzaW9ucyBpbiBnZW5lcmFsLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVuc3VyZSB2YWx1ZXMgaW4gc3Vic2NyaWJlIGFyZSBjYWxsZWQganVzdCBiZWZvcmUgYnJvd3NlciByZXBhaW50LlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgaW50ZXJ2YWxzID0gaW50ZXJ2YWwoMTApOyAgICAgICAgICAgICAgICAvLyBJbnRlcnZhbHMgYXJlIHNjaGVkdWxlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIGFzeW5jIHNjaGVkdWxlciBieSBkZWZhdWx0Li4uXG4gKiBpbnRlcnZhbHMucGlwZShcbiAqICAgb2JzZXJ2ZU9uKGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyKSwgICAgICAgICAgLy8gLi4uYnV0IHdlIHdpbGwgb2JzZXJ2ZSBvbiBhbmltYXRpb25GcmFtZVxuICogKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzY2hlZHVsZXIgdG8gZW5zdXJlIHNtb290aCBhbmltYXRpb24uXG4gKiAuc3Vic2NyaWJlKHZhbCA9PiB7XG4gKiAgIHNvbWVEaXYuc3R5bGUuaGVpZ2h0ID0gdmFsICsgJ3B4JztcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBzY2hlZHVsZXIgU2NoZWR1bGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlc2NoZWR1bGUgbm90aWZpY2F0aW9ucyBmcm9tIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IHN0YXRlcyB3aXRoIHdoYXQgZGVsYXkgZXZlcnkgbm90aWZpY2F0aW9uIHNob3VsZCBiZSByZXNjaGVkdWxlZC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgc2FtZSBub3RpZmljYXRpb25zIGFzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSxcbiAqIGJ1dCB3aXRoIHByb3ZpZGVkIHNjaGVkdWxlci5cbiAqXG4gKiBAbWV0aG9kIG9ic2VydmVPblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVPbjxUPihzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsIGRlbGF5OiBudW1iZXIgPSAwKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG9ic2VydmVPbk9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBPYnNlcnZlT25PcGVyYXRvcihzY2hlZHVsZXIsIGRlbGF5KSk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNlcnZlT25PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsIHByaXZhdGUgZGVsYXk6IG51bWJlciA9IDApIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgT2JzZXJ2ZU9uU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnNjaGVkdWxlciwgdGhpcy5kZWxheSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZU9uU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxPYnNlcnZlT25NZXNzYWdlPiwgYXJnOiBPYnNlcnZlT25NZXNzYWdlKSB7XG4gICAgY29uc3QgeyBub3RpZmljYXRpb24sIGRlc3RpbmF0aW9uIH0gPSBhcmc7XG4gICAgbm90aWZpY2F0aW9uLm9ic2VydmUoZGVzdGluYXRpb24pO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkZWxheTogbnVtYmVyID0gMCkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVNZXNzYWdlKG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZCh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShcbiAgICAgIE9ic2VydmVPblN1YnNjcmliZXIuZGlzcGF0Y2gsXG4gICAgICB0aGlzLmRlbGF5LFxuICAgICAgbmV3IE9ic2VydmVPbk1lc3NhZ2Uobm90aWZpY2F0aW9uLCB0aGlzLmRlc3RpbmF0aW9uKVxuICAgICkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5zY2hlZHVsZU1lc3NhZ2UoTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlTWVzc2FnZShOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNlcnZlT25NZXNzYWdlIHtcbiAgY29uc3RydWN0b3IocHVibGljIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4sXG4gICAgICAgICAgICAgIHB1YmxpYyBkZXN0aW5hdGlvbjogUGFydGlhbE9ic2VydmVyPGFueT4pIHtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBxdWV1ZSB9IGZyb20gJy4vc2NoZWR1bGVyL3F1ZXVlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2ZU9uU3Vic2NyaWJlciB9IGZyb20gJy4vb3BlcmF0b3JzL29ic2VydmVPbic7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbi8qKlxuICogQSB2YXJpYW50IG9mIFN1YmplY3QgdGhhdCBcInJlcGxheXNcIiBvciBlbWl0cyBvbGQgdmFsdWVzIHRvIG5ldyBzdWJzY3JpYmVycy5cbiAqIEl0IGJ1ZmZlcnMgYSBzZXQgbnVtYmVyIG9mIHZhbHVlcyBhbmQgd2lsbCBlbWl0IHRob3NlIHZhbHVlcyBpbW1lZGlhdGVseSB0b1xuICogYW55IG5ldyBzdWJzY3JpYmVycyBpbiBhZGRpdGlvbiB0byBlbWl0dGluZyBuZXcgdmFsdWVzIHRvIGV4aXN0aW5nIHN1YnNjcmliZXJzLlxuICpcbiAqIEBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXBsYXlTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG4gIHByaXZhdGUgX2V2ZW50czogKFJlcGxheUV2ZW50PFQ+IHwgVClbXSA9IFtdO1xuICBwcml2YXRlIF9idWZmZXJTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgX3dpbmRvd1RpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaW5maW5pdGVUaW1lV2luZG93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoYnVmZmVyU2l6ZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICB3aW5kb3dUaW1lOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fYnVmZmVyU2l6ZSA9IGJ1ZmZlclNpemUgPCAxID8gMSA6IGJ1ZmZlclNpemU7XG4gICAgdGhpcy5fd2luZG93VGltZSA9IHdpbmRvd1RpbWUgPCAxID8gMSA6IHdpbmRvd1RpbWU7XG5cbiAgICBpZiAod2luZG93VGltZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICB0aGlzLl9pbmZpbml0ZVRpbWVXaW5kb3cgPSB0cnVlO1xuICAgICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0SW5maW5pdGVUaW1lV2luZG93O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5leHQgPSB0aGlzLm5leHRUaW1lV2luZG93O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbmV4dEluZmluaXRlVGltZVdpbmRvdyh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IF9ldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgX2V2ZW50cy5wdXNoKHZhbHVlKTtcbiAgICAvLyBTaW5jZSB0aGlzIG1ldGhvZCBpcyBpbnZva2VkIGluIGV2ZXJ5IG5leHQoKSBjYWxsIHRoYW4gdGhlIGJ1ZmZlclxuICAgIC8vIGNhbiBvdmVyZ3JvdyB0aGUgbWF4IHNpemUgb25seSBieSBvbmUgaXRlbVxuICAgIGlmIChfZXZlbnRzLmxlbmd0aCA+IHRoaXMuX2J1ZmZlclNpemUpIHtcbiAgICAgIF9ldmVudHMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dFRpbWVXaW5kb3codmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLl9ldmVudHMucHVzaChuZXcgUmVwbGF5RXZlbnQodGhpcy5fZ2V0Tm93KCksIHZhbHVlKSk7XG4gICAgdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcblxuICAgIHN1cGVyLm5leHQodmFsdWUpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIC8vIFdoZW4gYF9pbmZpbml0ZVRpbWVXaW5kb3cgPT09IHRydWVgIHRoZW4gdGhlIGJ1ZmZlciBpcyBhbHJlYWR5IHRyaW1tZWRcbiAgICBjb25zdCBfaW5maW5pdGVUaW1lV2luZG93ID0gdGhpcy5faW5maW5pdGVUaW1lV2luZG93O1xuICAgIGNvbnN0IF9ldmVudHMgPSBfaW5maW5pdGVUaW1lV2luZG93ID8gdGhpcy5fZXZlbnRzIDogdGhpcy5fdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcbiAgICBjb25zdCBsZW4gPSBfZXZlbnRzLmxlbmd0aDtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQgfHwgdGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgc3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlciA9IG5ldyBPYnNlcnZlT25TdWJzY3JpYmVyPFQ+KHN1YnNjcmliZXIsIHNjaGVkdWxlcikpO1xuICAgIH1cblxuICAgIGlmIChfaW5maW5pdGVUaW1lV2luZG93KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoPFQ+X2V2ZW50c1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgoPFJlcGxheUV2ZW50PFQ+Pl9ldmVudHNbaV0pLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcih0aGlzLnRocm93bkVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIF9nZXROb3coKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuc2NoZWR1bGVyIHx8IHF1ZXVlKS5ub3coKTtcbiAgfVxuXG4gIHByaXZhdGUgX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk6IFJlcGxheUV2ZW50PFQ+W10ge1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuX2dldE5vdygpO1xuICAgIGNvbnN0IF9idWZmZXJTaXplID0gdGhpcy5fYnVmZmVyU2l6ZTtcbiAgICBjb25zdCBfd2luZG93VGltZSA9IHRoaXMuX3dpbmRvd1RpbWU7XG4gICAgY29uc3QgX2V2ZW50cyA9IDxSZXBsYXlFdmVudDxUPltdPnRoaXMuX2V2ZW50cztcblxuICAgIGNvbnN0IGV2ZW50c0NvdW50ID0gX2V2ZW50cy5sZW5ndGg7XG4gICAgbGV0IHNwbGljZUNvdW50ID0gMDtcblxuICAgIC8vIFRyaW0gZXZlbnRzIHRoYXQgZmFsbCBvdXQgb2YgdGhlIHRpbWUgd2luZG93LlxuICAgIC8vIFN0YXJ0IGF0IHRoZSBmcm9udCBvZiB0aGUgbGlzdC4gQnJlYWsgZWFybHkgb25jZVxuICAgIC8vIHdlIGVuY291bnRlciBhbiBldmVudCB0aGF0IGZhbGxzIHdpdGhpbiB0aGUgd2luZG93LlxuICAgIHdoaWxlIChzcGxpY2VDb3VudCA8IGV2ZW50c0NvdW50KSB7XG4gICAgICBpZiAoKG5vdyAtIF9ldmVudHNbc3BsaWNlQ291bnRdLnRpbWUpIDwgX3dpbmRvd1RpbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzcGxpY2VDb3VudCsrO1xuICAgIH1cblxuICAgIGlmIChldmVudHNDb3VudCA+IF9idWZmZXJTaXplKSB7XG4gICAgICBzcGxpY2VDb3VudCA9IE1hdGgubWF4KHNwbGljZUNvdW50LCBldmVudHNDb3VudCAtIF9idWZmZXJTaXplKTtcbiAgICB9XG5cbiAgICBpZiAoc3BsaWNlQ291bnQgPiAwKSB7XG4gICAgICBfZXZlbnRzLnNwbGljZSgwLCBzcGxpY2VDb3VudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9ldmVudHM7XG4gIH1cblxufVxuXG5jbGFzcyBSZXBsYXlFdmVudDxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0aW1lOiBudW1iZXIsIHB1YmxpYyB2YWx1ZTogVCkge1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgb25seSBlbWl0cyBhIHZhbHVlIHdoZW4gaXQgY29tcGxldGVzLiBJdCB3aWxsIGVtaXRcbiAqIGl0cyBsYXRlc3QgdmFsdWUgdG8gYWxsIGl0cyBvYnNlcnZlcnMgb24gY29tcGxldGlvbi5cbiAqXG4gKiBAY2xhc3MgQXN5bmNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY1N1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZTogVCA9IG51bGw7XG4gIHByaXZhdGUgaGFzTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuaGFzTmV4dCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5oYXNOZXh0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgc3VwZXIuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdXBlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBzdXBlci5jb21wbGV0ZSgpO1xuICB9XG59XG4iLCJsZXQgbmV4dEhhbmRsZSA9IDE7XG5cbmNvbnN0IHRhc2tzQnlIYW5kbGU6IHsgW2hhbmRsZTogc3RyaW5nXTogKCkgPT4gdm9pZCB9ID0ge307XG5cbmZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGU6IG51bWJlcikge1xuICBjb25zdCBjYiA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgaWYgKGNiKSB7XG4gICAgY2IoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgSW1tZWRpYXRlID0ge1xuICBzZXRJbW1lZGlhdGUoY2I6ICgpID0+IHZvaWQpOiBudW1iZXIge1xuICAgIGNvbnN0IGhhbmRsZSA9IG5leHRIYW5kbGUrKztcbiAgICB0YXNrc0J5SGFuZGxlW2hhbmRsZV0gPSBjYjtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHJ1bklmUHJlc2VudChoYW5kbGUpKTtcbiAgICByZXR1cm4gaGFuZGxlO1xuICB9LFxuXG4gIGNsZWFySW1tZWRpYXRlKGhhbmRsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBJbW1lZGlhdGUgfSBmcm9tICcuLi91dGlsL0ltbWVkaWF0ZSc7XG5pbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFzYXBBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQXNhcFNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBBc2FwU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGlzIGdyZWF0ZXIgdGhhbiAwLCByZXF1ZXN0IGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBQdXNoIHRoZSBhY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLlxuICAgIHNjaGVkdWxlci5hY3Rpb25zLnB1c2godGhpcyk7XG4gICAgLy8gSWYgYSBtaWNyb3Rhc2sgaGFzIGFscmVhZHkgYmVlbiBzY2hlZHVsZWQsIGRvbid0IHNjaGVkdWxlIGFub3RoZXJcbiAgICAvLyBvbmUuIElmIGEgbWljcm90YXNrIGhhc24ndCBiZWVuIHNjaGVkdWxlZCB5ZXQsIHNjaGVkdWxlIG9uZSBub3cuIFJldHVyblxuICAgIC8vIHRoZSBjdXJyZW50IHNjaGVkdWxlZCBtaWNyb3Rhc2sgaWQuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5zY2hlZHVsZWQgPSBJbW1lZGlhdGUuc2V0SW1tZWRpYXRlKFxuICAgICAgc2NoZWR1bGVyLmZsdXNoLmJpbmQoc2NoZWR1bGVyLCBudWxsKVxuICAgICkpO1xuICB9XG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFzYXBTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIElmIHRoZSBzY2hlZHVsZXIgcXVldWUgaXMgZW1wdHksIGNhbmNlbCB0aGUgcmVxdWVzdGVkIG1pY3JvdGFzayBhbmRcbiAgICAvLyBzZXQgdGhlIHNjaGVkdWxlZCBmbGFnIHRvIHVuZGVmaW5lZCBzbyB0aGUgbmV4dCBBc2FwQWN0aW9uIHdpbGwgc2NoZWR1bGVcbiAgICAvLyBpdHMgb3duLlxuICAgIGlmIChzY2hlZHVsZXIuYWN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIEltbWVkaWF0ZS5jbGVhckltbWVkaWF0ZShpZCk7XG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdW5kZWZpbmVkIHNvIHRoZSBhY3Rpb24ga25vd3MgdG8gcmVxdWVzdCBhIG5ldyBhc3luYyBpZCBpZiBpdCdzIHJlc2NoZWR1bGVkLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgQXNhcFNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgcHVibGljIGZsdXNoKGFjdGlvbj86IEFzeW5jQWN0aW9uPGFueT4pOiB2b2lkIHtcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHthY3Rpb25zfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnk7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcbiAgICBsZXQgY291bnQ6IG51bWJlciA9IGFjdGlvbnMubGVuZ3RoO1xuICAgIGFjdGlvbiA9IGFjdGlvbiB8fCBhY3Rpb25zLnNoaWZ0KCk7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKTtcblxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzYXBBY3Rpb24gfSBmcm9tICcuL0FzYXBBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFzYXAgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlBlcmZvcm0gdGFzayBhcyBmYXN0IGFzIGl0IGNhbiBiZSBwZXJmb3JtZWQgYXN5bmNocm9ub3VzbHk8L3NwYW4+XG4gKlxuICogYGFzYXBgIHNjaGVkdWxlciBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBhc3luY1NjaGVkdWxlcn0gc2NoZWR1bGVyIHdoZW4geW91IHVzZSBpdCB0byBkZWxheSB0YXNrXG4gKiBpbiB0aW1lLiBJZiBob3dldmVyIHlvdSBzZXQgZGVsYXkgdG8gYDBgLCBgYXNhcGAgd2lsbCB3YWl0IGZvciBjdXJyZW50IHN5bmNocm9ub3VzbHkgZXhlY3V0aW5nXG4gKiBjb2RlIHRvIGVuZCBhbmQgdGhlbiBpdCB3aWxsIHRyeSB0byBleGVjdXRlIGdpdmVuIHRhc2sgYXMgZmFzdCBhcyBwb3NzaWJsZS5cbiAqXG4gKiBgYXNhcGAgc2NoZWR1bGVyIHdpbGwgZG8gaXRzIGJlc3QgdG8gbWluaW1pemUgdGltZSBiZXR3ZWVuIGVuZCBvZiBjdXJyZW50bHkgZXhlY3V0aW5nIGNvZGVcbiAqIGFuZCBzdGFydCBvZiBzY2hlZHVsZWQgdGFzay4gVGhpcyBtYWtlcyBpdCBiZXN0IGNhbmRpZGF0ZSBmb3IgcGVyZm9ybWluZyBzbyBjYWxsZWQgXCJkZWZlcnJpbmdcIi5cbiAqIFRyYWRpdGlvbmFsbHkgdGhpcyB3YXMgYWNoaWV2ZWQgYnkgY2FsbGluZyBgc2V0VGltZW91dChkZWZlcnJlZFRhc2ssIDApYCwgYnV0IHRoYXQgdGVjaG5pcXVlIGludm9sdmVzXG4gKiBzb21lIChhbHRob3VnaCBtaW5pbWFsKSB1bndhbnRlZCBkZWxheS5cbiAqXG4gKiBOb3RlIHRoYXQgdXNpbmcgYGFzYXBgIHNjaGVkdWxlciBkb2VzIG5vdCBuZWNlc3NhcmlseSBtZWFuIHRoYXQgeW91ciB0YXNrIHdpbGwgYmUgZmlyc3QgdG8gcHJvY2Vzc1xuICogYWZ0ZXIgY3VycmVudGx5IGV4ZWN1dGluZyBjb2RlLiBJbiBwYXJ0aWN1bGFyLCBpZiBzb21lIHRhc2sgd2FzIGFsc28gc2NoZWR1bGVkIHdpdGggYGFzYXBgIGJlZm9yZSxcbiAqIHRoYXQgdGFzayB3aWxsIGV4ZWN1dGUgZmlyc3QuIFRoYXQgYmVpbmcgc2FpZCwgaWYgeW91IG5lZWQgdG8gc2NoZWR1bGUgdGFzayBhc3luY2hyb25vdXNseSwgYnV0XG4gKiBhcyBzb29uIGFzIHBvc3NpYmxlLCBgYXNhcGAgc2NoZWR1bGVyIGlzIHlvdXIgYmVzdCBiZXQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29tcGFyZSBhc3luYyBhbmQgYXNhcCBzY2hlZHVsZXI8XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ2FzeW5jJykpOyAvLyBzY2hlZHVsaW5nICdhc3luYycgZmlyc3QuLi5cbiAqIFJ4LlNjaGVkdWxlci5hc2FwLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdhc2FwJykpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImFzYXBcIlxuICogLy8gXCJhc3luY1wiXG4gKiAvLyAuLi4gYnV0ICdhc2FwJyBnb2VzIGZpcnN0IVxuICogYGBgXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGFzYXBcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYXNhcCA9IG5ldyBBc2FwU2NoZWR1bGVyKEFzYXBBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFzeW5jIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5TY2hlZHVsZSB0YXNrIGFzIGlmIHlvdSB1c2VkIHNldFRpbWVvdXQodGFzaywgZHVyYXRpb24pPC9zcGFuPlxuICpcbiAqIGBhc3luY2Agc2NoZWR1bGVyIHNjaGVkdWxlcyB0YXNrcyBhc3luY2hyb25vdXNseSwgYnkgcHV0dGluZyB0aGVtIG9uIHRoZSBKYXZhU2NyaXB0XG4gKiBldmVudCBsb29wIHF1ZXVlLiBJdCBpcyBiZXN0IHVzZWQgdG8gZGVsYXkgdGFza3MgaW4gdGltZSBvciB0byBzY2hlZHVsZSB0YXNrcyByZXBlYXRpbmdcbiAqIGluIGludGVydmFscy5cbiAqXG4gKiBJZiB5b3UganVzdCB3YW50IHRvIFwiZGVmZXJcIiB0YXNrLCB0aGF0IGlzIHRvIHBlcmZvcm0gaXQgcmlnaHQgYWZ0ZXIgY3VycmVudGx5XG4gKiBleGVjdXRpbmcgc3luY2hyb25vdXMgY29kZSBlbmRzIChjb21tb25seSBhY2hpZXZlZCBieSBgc2V0VGltZW91dChkZWZlcnJlZFRhc2ssIDApYCksXG4gKiBiZXR0ZXIgY2hvaWNlIHdpbGwgYmUgdGhlIHtAbGluayBhc2FwU2NoZWR1bGVyfSBzY2hlZHVsZXIuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFVzZSBhc3luYyBzY2hlZHVsZXIgdG8gZGVsYXkgdGFza1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGFzayA9ICgpID0+IGNvbnNvbGUubG9nKCdpdCB3b3JrcyEnKTtcbiAqXG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUodGFzaywgMjAwMCk7XG4gKlxuICogLy8gQWZ0ZXIgMiBzZWNvbmRzIGxvZ3M6XG4gKiAvLyBcIml0IHdvcmtzIVwiXG4gKiBgYGBcbiAqXG4gKiBVc2UgYXN5bmMgc2NoZWR1bGVyIHRvIHJlcGVhdCB0YXNrIGluIGludGVydmFsc1xuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gdGFzayhzdGF0ZSkge1xuICogICBjb25zb2xlLmxvZyhzdGF0ZSk7XG4gKiAgIHRoaXMuc2NoZWR1bGUoc3RhdGUgKyAxLCAxMDAwKTsgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZSBhbmQgZGVsYXlcbiAqIH1cbiAqXG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUodGFzaywgMzAwMCwgMCk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDAgYWZ0ZXIgM3NcbiAqIC8vIDEgYWZ0ZXIgNHNcbiAqIC8vIDIgYWZ0ZXIgNXNcbiAqIC8vIDMgYWZ0ZXIgNnNcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYXN5bmNcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYXN5bmMgPSBuZXcgQXN5bmNTY2hlZHVsZXIoQXN5bmNBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZVNjaGVkdWxlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRnJhbWVBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgaXMgZ3JlYXRlciB0aGFuIDAsIHJlcXVlc3QgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIFB1c2ggdGhlIGFjdGlvbiB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUuXG4gICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAvLyBJZiBhbiBhbmltYXRpb24gZnJhbWUgaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWQsIGRvbid0IHJlcXVlc3QgYW5vdGhlclxuICAgIC8vIG9uZS4gSWYgYW4gYW5pbWF0aW9uIGZyYW1lIGhhc24ndCBiZWVuIHJlcXVlc3RlZCB5ZXQsIHJlcXVlc3Qgb25lLiBSZXR1cm5cbiAgICAvLyB0aGUgY3VycmVudCBhbmltYXRpb24gZnJhbWUgcmVxdWVzdCBpZC5cbiAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlZCB8fCAoc2NoZWR1bGVyLnNjaGVkdWxlZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShcbiAgICAgICgpID0+IHNjaGVkdWxlci5mbHVzaChudWxsKSkpO1xuICB9XG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGV4aXN0cyBhbmQgaXMgZ3JlYXRlciB0aGFuIDAsIG9yIGlmIHRoZSBkZWxheSBpcyBudWxsICh0aGVcbiAgICAvLyBhY3Rpb24gd2Fzbid0IHJlc2NoZWR1bGVkKSBidXQgd2FzIG9yaWdpbmFsbHkgc2NoZWR1bGVkIGFzIGFuIGFzeW5jXG4gICAgLy8gYWN0aW9uLCB0aGVuIHJlY3ljbGUgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmICgoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgc2NoZWR1bGVyIHF1ZXVlIGlzIGVtcHR5LCBjYW5jZWwgdGhlIHJlcXVlc3RlZCBhbmltYXRpb24gZnJhbWUgYW5kXG4gICAgLy8gc2V0IHRoZSBzY2hlZHVsZWQgZmxhZyB0byB1bmRlZmluZWQgc28gdGhlIG5leHQgQW5pbWF0aW9uRnJhbWVBY3Rpb24gd2lsbFxuICAgIC8vIHJlcXVlc3QgaXRzIG93bi5cbiAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdW5kZWZpbmVkIHNvIHRoZSBhY3Rpb24ga25vd3MgdG8gcmVxdWVzdCBhIG5ldyBhc3luYyBpZCBpZiBpdCdzIHJlc2NoZWR1bGVkLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG4gIHB1YmxpYyBmbHVzaChhY3Rpb24/OiBBc3luY0FjdGlvbjxhbnk+KTogdm9pZCB7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCB7YWN0aW9uc30gPSB0aGlzO1xuICAgIGxldCBlcnJvcjogYW55O1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgbGV0IGNvdW50OiBudW1iZXIgPSBhY3Rpb25zLmxlbmd0aDtcbiAgICBhY3Rpb24gPSBhY3Rpb24gfHwgYWN0aW9ucy5zaGlmdCgpO1xuXG4gICAgZG8ge1xuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSk7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKSB7XG4gICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBBbmltYXRpb25GcmFtZUFjdGlvbiB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVBY3Rpb24nO1xuaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQW5pbWF0aW9uIEZyYW1lIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QZXJmb3JtIHRhc2sgd2hlbiBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgd291bGQgZmlyZTwvc3Bhbj5cbiAqXG4gKiBXaGVuIGBhbmltYXRpb25GcmFtZWAgc2NoZWR1bGVyIGlzIHVzZWQgd2l0aCBkZWxheSwgaXQgd2lsbCBmYWxsIGJhY2sgdG8ge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXJcbiAqIGJlaGF2aW91ci5cbiAqXG4gKiBXaXRob3V0IGRlbGF5LCBgYW5pbWF0aW9uRnJhbWVgIHNjaGVkdWxlciBjYW4gYmUgdXNlZCB0byBjcmVhdGUgc21vb3RoIGJyb3dzZXIgYW5pbWF0aW9ucy5cbiAqIEl0IG1ha2VzIHN1cmUgc2NoZWR1bGVkIHRhc2sgd2lsbCBoYXBwZW4ganVzdCBiZWZvcmUgbmV4dCBicm93c2VyIGNvbnRlbnQgcmVwYWludCxcbiAqIHRodXMgcGVyZm9ybWluZyBhbmltYXRpb25zIGFzIGVmZmljaWVudGx5IGFzIHBvc3NpYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNjaGVkdWxlIGRpdiBoZWlnaHQgYW5pbWF0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29tZS1kaXYnKTtcbiAqXG4gKiBSeC5TY2hlZHVsZXIuYW5pbWF0aW9uRnJhbWUuc2NoZWR1bGUoZnVuY3Rpb24oaGVpZ2h0KSB7XG4gKiAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG4gKlxuICogICB0aGlzLnNjaGVkdWxlKGhlaWdodCArIDEpOyAgLy8gYHRoaXNgIHJlZmVyZW5jZXMgY3VycmVudGx5IGV4ZWN1dGluZyBBY3Rpb24sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlXG4gKiB9LCAwLCAwKTtcbiAqXG4gKiAvLyBZb3Ugd2lsbCBzZWUgLnNvbWUtZGl2IGVsZW1lbnQgZ3Jvd2luZyBpbiBoZWlnaHRcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgYW5pbWF0aW9uRnJhbWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWUgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgVmlydHVhbFRpbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBmcmFtZVRpbWVGYWN0b3I6IG51bWJlciA9IDEwO1xuXG4gIHB1YmxpYyBmcmFtZTogbnVtYmVyID0gMDtcbiAgcHVibGljIGluZGV4OiBudW1iZXIgPSAtMTtcblxuICBjb25zdHJ1Y3RvcihTY2hlZHVsZXJBY3Rpb246IHR5cGVvZiBBc3luY0FjdGlvbiA9IFZpcnR1YWxBY3Rpb24gYXMgYW55LFxuICAgICAgICAgICAgICBwdWJsaWMgbWF4RnJhbWVzOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICBzdXBlcihTY2hlZHVsZXJBY3Rpb24sICgpID0+IHRoaXMuZnJhbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb21wdCB0aGUgU2NoZWR1bGVyIHRvIGV4ZWN1dGUgYWxsIG9mIGl0cyBxdWV1ZWQgYWN0aW9ucywgdGhlcmVmb3JlXG4gICAqIGNsZWFyaW5nIGl0cyBxdWV1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHB1YmxpYyBmbHVzaCgpOiB2b2lkIHtcblxuICAgIGNvbnN0IHthY3Rpb25zLCBtYXhGcmFtZXN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueSwgYWN0aW9uOiBBc3luY0FjdGlvbjxhbnk+O1xuXG4gICAgd2hpbGUgKChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpICYmICh0aGlzLmZyYW1lID0gYWN0aW9uLmRlbGF5KSA8PSBtYXhGcmFtZXMpIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQG5vZG9jXG4gKi9cbmV4cG9ydCBjbGFzcyBWaXJ0dWFsQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIHByb3RlY3RlZCBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaW5kZXg6IG51bWJlciA9IHNjaGVkdWxlci5pbmRleCArPSAxKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgICB0aGlzLmluZGV4ID0gc2NoZWR1bGVyLmluZGV4ID0gaW5kZXg7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAvLyBJZiBhbiBhY3Rpb24gaXMgcmVzY2hlZHVsZWQsIHdlIHNhdmUgYWxsb2NhdGlvbnMgYnkgbXV0YXRpbmcgaXRzIHN0YXRlLFxuICAgIC8vIHB1c2hpbmcgaXQgdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLCBhbmQgcmVjeWNsaW5nIHRoZSBhY3Rpb24uXG4gICAgLy8gQnV0IHNpbmNlIHRoZSBWaXJ0dWFsVGltZVNjaGVkdWxlciBpcyB1c2VkIGZvciB0ZXN0aW5nLCBWaXJ0dWFsQWN0aW9uc1xuICAgIC8vIG11c3QgYmUgaW1tdXRhYmxlIHNvIHRoZXkgY2FuIGJlIGluc3BlY3RlZCBsYXRlci5cbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgVmlydHVhbEFjdGlvbih0aGlzLnNjaGVkdWxlciwgdGhpcy53b3JrKTtcbiAgICB0aGlzLmFkZChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb24uc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHRoaXMuZGVsYXkgPSBzY2hlZHVsZXIuZnJhbWUgKyBkZWxheTtcbiAgICBjb25zdCB7YWN0aW9uc30gPSBzY2hlZHVsZXI7XG4gICAgYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIChhY3Rpb25zIGFzIEFycmF5PFZpcnR1YWxBY3Rpb248VD4+KS5zb3J0KFZpcnR1YWxBY3Rpb24uc29ydEFjdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNvcnRBY3Rpb25zPFQ+KGE6IFZpcnR1YWxBY3Rpb248VD4sIGI6IFZpcnR1YWxBY3Rpb248VD4pIHtcbiAgICBpZiAoYS5kZWxheSA9PT0gYi5kZWxheSkge1xuICAgICAgaWYgKGEuaW5kZXggPT09IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2UgaWYgKGEuaW5kZXggPiBiLmluZGV4KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYS5kZWxheSA+IGIuZGVsYXkpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHk8VD4oeDogVCk6IFQge1xuICByZXR1cm4geDtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUZXN0cyB0byBzZWUgaWYgdGhlIG9iamVjdCBpcyBhbiBSeEpTIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHBhcmFtIG9iaiB0aGUgb2JqZWN0IHRvIHRlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JzZXJ2YWJsZTxUPihvYmo6IGFueSk6IG9iaiBpcyBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuICEhb2JqICYmIChvYmogaW5zdGFuY2VvZiBPYnNlcnZhYmxlIHx8ICh0eXBlb2Ygb2JqLmxpZnQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbicpKTtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JDdG9yIHtcbiAgbmV3KCk6IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yO1xufVxuXG5mdW5jdGlvbiBBcmd1bWVudE91dE9mUmFuZ2VFcnJvckltcGwodGhpczogYW55KSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9ICdhcmd1bWVudCBvdXQgb2YgcmFuZ2UnO1xuICB0aGlzLm5hbWUgPSAnQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuICByZXR1cm4gdGhpcztcbn1cblxuQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JJbXBsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbiBlcnJvciB0aHJvd24gd2hlbiBhbiBlbGVtZW50IHdhcyBxdWVyaWVkIGF0IGEgY2VydGFpbiBpbmRleCBvZiBhblxuICogT2JzZXJ2YWJsZSwgYnV0IG5vIHN1Y2ggaW5kZXggb3IgcG9zaXRpb24gZXhpc3RzIGluIHRoYXQgc2VxdWVuY2UuXG4gKlxuICogQHNlZSB7QGxpbmsgZWxlbWVudEF0fVxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqIEBzZWUge0BsaW5rIHRha2VMYXN0fVxuICpcbiAqIEBjbGFzcyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvclxuICovXG5leHBvcnQgY29uc3QgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3I6IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yQ3RvciA9IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9ySW1wbCBhcyBhbnk7IiwiZXhwb3J0IGludGVyZmFjZSBFbXB0eUVycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVtcHR5RXJyb3JDdG9yIHtcbiAgbmV3KCk6IEVtcHR5RXJyb3I7XG59XG5cbmZ1bmN0aW9uIEVtcHR5RXJyb3JJbXBsKHRoaXM6IGFueSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSAnbm8gZWxlbWVudHMgaW4gc2VxdWVuY2UnO1xuICB0aGlzLm5hbWUgPSAnRW1wdHlFcnJvcic7XG4gIHJldHVybiB0aGlzO1xufVxuXG5FbXB0eUVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gYW4gT2JzZXJ2YWJsZSBvciBhIHNlcXVlbmNlIHdhcyBxdWVyaWVkIGJ1dCBoYXMgbm9cbiAqIGVsZW1lbnRzLlxuICpcbiAqIEBzZWUge0BsaW5rIGZpcnN0fVxuICogQHNlZSB7QGxpbmsgbGFzdH1cbiAqIEBzZWUge0BsaW5rIHNpbmdsZX1cbiAqXG4gKiBAY2xhc3MgRW1wdHlFcnJvclxuICovXG5leHBvcnQgY29uc3QgRW1wdHlFcnJvcjogRW1wdHlFcnJvckN0b3IgPSBFbXB0eUVycm9ySW1wbCBhcyBhbnk7IiwiZXhwb3J0IGludGVyZmFjZSBUaW1lb3V0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGltZW91dEVycm9yQ3RvciB7XHJcbiAgbmV3KCk6IFRpbWVvdXRFcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gVGltZW91dEVycm9ySW1wbCh0aGlzOiBhbnkpIHtcclxuICBFcnJvci5jYWxsKHRoaXMpO1xyXG4gIHRoaXMubWVzc2FnZSA9ICdUaW1lb3V0IGhhcyBvY2N1cnJlZCc7XHJcbiAgdGhpcy5uYW1lID0gJ1RpbWVvdXRFcnJvcic7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcblRpbWVvdXRFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG5cclxuLyoqXHJcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIGR1ZXRpbWUgZWxhcHNlcy5cclxuICpcclxuICogQHNlZSB7QGxpbmsgdGltZW91dH1cclxuICpcclxuICogQGNsYXNzIFRpbWVvdXRFcnJvclxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFRpbWVvdXRFcnJvcjogVGltZW91dEVycm9yQ3RvciA9IFRpbWVvdXRFcnJvckltcGwgYXMgYW55O1xyXG4iLCJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQXBwbGllcyBhIGdpdmVuIGBwcm9qZWN0YCBmdW5jdGlvbiB0byBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSwgYW5kIGVtaXRzIHRoZSByZXN1bHRpbmcgdmFsdWVzIGFzIGFuIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2UgW0FycmF5LnByb3RvdHlwZS5tYXAoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwKSxcbiAqIGl0IHBhc3NlcyBlYWNoIHNvdXJjZSB2YWx1ZSB0aHJvdWdoIGEgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gdG8gZ2V0XG4gKiBjb3JyZXNwb25kaW5nIG91dHB1dCB2YWx1ZXMuPC9zcGFuPlxuICpcbiAqICFbXShtYXAucG5nKVxuICpcbiAqIFNpbWlsYXIgdG8gdGhlIHdlbGwga25vd24gYEFycmF5LnByb3RvdHlwZS5tYXBgIGZ1bmN0aW9uLCB0aGlzIG9wZXJhdG9yXG4gKiBhcHBsaWVzIGEgcHJvamVjdGlvbiB0byBlYWNoIHZhbHVlIGFuZCBlbWl0cyB0aGF0IHByb2plY3Rpb24gaW4gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBNYXAgZXZlcnkgY2xpY2sgdG8gdGhlIGNsaWVudFggcG9zaXRpb24gb2YgdGhhdCBjbGlja1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHBvc2l0aW9ucyA9IGNsaWNrcy5waXBlKG1hcChldiA9PiBldi5jbGllbnRYKSk7XG4gKiBwb3NpdGlvbnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWFwVG99XG4gKiBAc2VlIHtAbGluayBwbHVja31cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogUn0gcHJvamVjdCBUaGUgZnVuY3Rpb24gdG8gYXBwbHlcbiAqIHRvIGVhY2ggYHZhbHVlYCBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gVGhlIGBpbmRleGAgcGFyYW1ldGVyIGlzXG4gKiB0aGUgbnVtYmVyIGBpYCBmb3IgdGhlIGktdGggZW1pc3Npb24gdGhhdCBoYXMgaGFwcGVuZWQgc2luY2UgdGhlXG4gKiBzdWJzY3JpcHRpb24sIHN0YXJ0aW5nIGZyb20gdGhlIG51bWJlciBgMGAuXG4gKiBAcGFyYW0ge2FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIGFyZ3VtZW50IHRvIGRlZmluZSB3aGF0IGB0aGlzYCBpcyBpbiB0aGVcbiAqIGBwcm9qZWN0YCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8Uj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSB0cmFuc2Zvcm1lZCBieSB0aGUgZ2l2ZW4gYHByb2plY3RgIGZ1bmN0aW9uLlxuICogQG1ldGhvZCBtYXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiBmdW5jdGlvbiBtYXBPcGVyYXRpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgaWYgKHR5cGVvZiBwcm9qZWN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcmd1bWVudCBpcyBub3QgYSBmdW5jdGlvbi4gQXJlIHlvdSBsb29raW5nIGZvciBgbWFwVG8oKWA/Jyk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgTWFwT3BlcmF0b3IocHJvamVjdCwgdGhpc0FyZykpO1xuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgTWFwT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCBwcml2YXRlIHRoaXNBcmc6IGFueSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE1hcFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcm9qZWN0LCB0aGlzLnRoaXNBcmcpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgTWFwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSB0aGlzQXJnOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLFxuICAgICAgICAgICAgICB0aGlzQXJnOiBhbnkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy50aGlzQXJnID0gdGhpc0FyZyB8fCB0aGlzO1xuICB9XG5cbiAgLy8gTk9URTogVGhpcyBsb29rcyB1bm9wdGltaXplZCwgYnV0IGl0J3MgYWN0dWFsbHkgcHVycG9zZWZ1bGx5IE5PVFxuICAvLyB1c2luZyB0cnkvY2F0Y2ggb3B0aW1pemF0aW9ucy5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByb2plY3QuY2FsbCh0aGlzLnRoaXNBcmcsIHZhbHVlLCB0aGlzLmNvdW50KyspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQocmVzdWx0KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgY2FuUmVwb3J0RXJyb3IgfSBmcm9tICcuLi91dGlsL2NhblJlcG9ydEVycm9yJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGEgbWFwcGluZyBmdW5jdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8UjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMT4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6ICgpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKHJlc3VsdDogUikgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKC4uLnJlc3VsdHM6IFJbXSkgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8UltdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbi8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbi8qKlxuICogQ29udmVydHMgYSBjYWxsYmFjayBBUEkgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+R2l2ZSBpdCBhIGZ1bmN0aW9uIGBmYCBvZiB0eXBlIGBmKHgsIGNhbGxiYWNrKWAgYW5kXG4gKiBpdCB3aWxsIHJldHVybiBhIGZ1bmN0aW9uIGBnYCB0aGF0IHdoZW4gY2FsbGVkIGFzIGBnKHgpYCB3aWxsIG91dHB1dCBhblxuICogT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYGJpbmRDYWxsYmFja2AgaXMgbm90IGFuIG9wZXJhdG9yIGJlY2F1c2UgaXRzIGlucHV0IGFuZCBvdXRwdXQgYXJlIG5vdFxuICogT2JzZXJ2YWJsZXMuIFRoZSBpbnB1dCBpcyBhIGZ1bmN0aW9uIGBmdW5jYCB3aXRoIHNvbWUgcGFyYW1ldGVycy4gVGhlXG4gKiBsYXN0IHBhcmFtZXRlciBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBgZnVuY2AgY2FsbHMgd2hlbiBpdCBpc1xuICogZG9uZS5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIGBiaW5kQ2FsbGJhY2tgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZSBwYXJhbWV0ZXJzXG4gKiBhcyBgZnVuY2AsIGV4Y2VwdCB0aGUgbGFzdCBvbmUgKHRoZSBjYWxsYmFjaykuIFdoZW4gdGhlIG91dHB1dCBmdW5jdGlvblxuICogaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIGl0IHdpbGwgcmV0dXJuIGFuIE9ic2VydmFibGUuIElmIGZ1bmN0aW9uIGBmdW5jYFxuICogY2FsbHMgaXRzIGNhbGxiYWNrIHdpdGggb25lIGFyZ3VtZW50LCB0aGUgT2JzZXJ2YWJsZSB3aWxsIGVtaXQgdGhhdCB2YWx1ZS5cbiAqIElmIG9uIHRoZSBvdGhlciBoYW5kIHRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCBtdWx0aXBsZSB2YWx1ZXMgdGhlIHJlc3VsdGluZ1xuICogT2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBzYWlkIHZhbHVlcyBhcyBhcmd1bWVudHMuXG4gKlxuICogSXQgaXMgKip2ZXJ5IGltcG9ydGFudCoqIHRvIHJlbWVtYmVyIHRoYXQgaW5wdXQgZnVuY3Rpb24gYGZ1bmNgIGlzIG5vdCBjYWxsZWRcbiAqIHdoZW4gdGhlIG91dHB1dCBmdW5jdGlvbiBpcywgYnV0IHJhdGhlciB3aGVuIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvdXRwdXRcbiAqIGZ1bmN0aW9uIGlzIHN1YnNjcmliZWQuIFRoaXMgbWVhbnMgaWYgYGZ1bmNgIG1ha2VzIGFuIEFKQVggcmVxdWVzdCwgdGhhdCByZXF1ZXN0XG4gKiB3aWxsIGJlIG1hZGUgZXZlcnkgdGltZSBzb21lb25lIHN1YnNjcmliZXMgdG8gdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLCBidXQgbm90IGJlZm9yZS5cbiAqXG4gKiBUaGUgbGFzdCBvcHRpb25hbCBwYXJhbWV0ZXIgLSBgc2NoZWR1bGVyYCAtIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgd2hlbiB0aGUgY2FsbFxuICogdG8gYGZ1bmNgIGhhcHBlbnMgYWZ0ZXIgc29tZW9uZSBzdWJzY3JpYmVzIHRvIE9ic2VydmFibGUsIGFzIHdlbGwgYXMgd2hlbiByZXN1bHRzXG4gKiBwYXNzZWQgdG8gY2FsbGJhY2sgd2lsbCBiZSBlbWl0dGVkLiBCeSBkZWZhdWx0LCB0aGUgc3Vic2NyaXB0aW9uIHRvIGFuIE9ic2VydmFibGUgY2FsbHMgYGZ1bmNgXG4gKiBzeW5jaHJvbm91c2x5LCBidXQgdXNpbmcge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIgd2lsbCBkZWZlciB0aGUgY2FsbCB0byBgZnVuY2AsXG4gKiBqdXN0IGxpa2Ugd3JhcHBpbmcgdGhlIGNhbGwgaW4gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYCB3b3VsZC4gSWYgeW91IHdlcmUgdG8gdXNlIHRoZSBhc3luYyBTY2hlZHVsZXJcbiAqIGFuZCBjYWxsIGBzdWJzY3JpYmVgIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYWxsIGZ1bmN0aW9uIGNhbGxzIHRoYXQgYXJlIGN1cnJlbnRseSBleGVjdXRpbmdcbiAqIHdpbGwgZW5kIGJlZm9yZSBgZnVuY2AgaXMgaW52b2tlZC5cbiAqXG4gKiBCeSBkZWZhdWx0LCByZXN1bHRzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgYXJlIGVtaXR0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYGZ1bmNgIGludm9rZXMgdGhlIGNhbGxiYWNrLlxuICogSW4gcGFydGljdWxhciwgaWYgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCBzeW5jaHJvbm91c2x5LCB0aGVuIHRoZSBzdWJzY3JpcHRpb24gb2YgdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlXG4gKiB3aWxsIGNhbGwgdGhlIGBuZXh0YCBmdW5jdGlvbiBzeW5jaHJvbm91c2x5IGFzIHdlbGwuICBJZiB5b3Ugd2FudCB0byBkZWZlciB0aGF0IGNhbGwsXG4gKiB5b3UgbWF5IHVzZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGp1c3QgYXMgYmVmb3JlLiAgVGhpcyBtZWFucyB0aGF0IGJ5IHVzaW5nIGBTY2hlZHVsZXIuYXN5bmNgIHlvdSBjYW5cbiAqIGVuc3VyZSB0aGF0IGBmdW5jYCBhbHdheXMgY2FsbHMgaXRzIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5LCB0aHVzIGF2b2lkaW5nIHRlcnJpZnlpbmcgWmFsZ28uXG4gKlxuICogTm90ZSB0aGF0IHRoZSBPYnNlcnZhYmxlIGNyZWF0ZWQgYnkgdGhlIG91dHB1dCBmdW5jdGlvbiB3aWxsIGFsd2F5cyBlbWl0IGEgc2luZ2xlIHZhbHVlXG4gKiBhbmQgdGhlbiBjb21wbGV0ZSBpbW1lZGlhdGVseS4gSWYgYGZ1bmNgIGNhbGxzIHRoZSBjYWxsYmFjayBtdWx0aXBsZSB0aW1lcywgdmFsdWVzIGZyb20gc3Vic2VxdWVudFxuICogY2FsbHMgd2lsbCBub3QgYXBwZWFyIGluIHRoZSBzdHJlYW0uIElmIHlvdSBuZWVkIHRvIGxpc3RlbiBmb3IgbXVsdGlwbGUgY2FsbHMsXG4gKiAgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIHtAbGluayBmcm9tRXZlbnR9IG9yIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSBpbnN0ZWFkLlxuICpcbiAqIElmIGBmdW5jYCBkZXBlbmRzIG9uIHNvbWUgY29udGV4dCAoYHRoaXNgIHByb3BlcnR5KSBhbmQgaXMgbm90IGFscmVhZHkgYm91bmQsIHRoZSBjb250ZXh0IG9mIGBmdW5jYFxuICogd2lsbCBiZSB0aGUgY29udGV4dCB0aGF0IHRoZSBvdXRwdXQgZnVuY3Rpb24gaGFzIGF0IGNhbGwgdGltZS4gSW4gcGFydGljdWxhciwgaWYgYGZ1bmNgXG4gKiBpcyBjYWxsZWQgYXMgYSBtZXRob2Qgb2Ygc29tZSBvYmplYyBhbmQgaWYgYGZ1bmNgIGlzIG5vdCBhbHJlYWR5IGJvdW5kLCBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dFxuICogaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB0aGUgY29udGV4dCBvZiB0aGUgb3V0cHV0IGZ1bmN0aW9uIGlzIHNldCB0byB0aGF0IG9iamVjdCBhcyB3ZWxsLlxuICpcbiAqIElmIHRoZSBpbnB1dCBmdW5jdGlvbiBjYWxscyBpdHMgY2FsbGJhY2sgaW4gdGhlIFwibm9kZSBzdHlsZVwiIChpLmUuIGZpcnN0IGFyZ3VtZW50IHRvIGNhbGxiYWNrIGlzXG4gKiBvcHRpb25hbCBlcnJvciBwYXJhbWV0ZXIgc2lnbmFsaW5nIHdoZXRoZXIgdGhlIGNhbGwgZmFpbGVkIG9yIG5vdCksIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogcHJvdmlkZXMgY29udmVuaWVudCBlcnJvciBoYW5kbGluZyBhbmQgcHJvYmFibHkgaXMgYSBiZXR0ZXIgY2hvaWNlLlxuICogYGJpbmRDYWxsYmFja2Agd2lsbCB0cmVhdCBzdWNoIGZ1bmN0aW9ucyB0aGUgc2FtZSBhcyBhbnkgb3RoZXIgYW5kIGVycm9yIHBhcmFtZXRlcnNcbiAqICh3aGV0aGVyIHBhc3NlZCBvciBub3QpIHdpbGwgYWx3YXlzIGJlIGludGVycHJldGVkIGFzIHJlZ3VsYXIgY2FsbGJhY2sgYXJndW1lbnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiAjIyMgQ29udmVydCBqUXVlcnkncyBnZXRKU09OIHRvIGFuIE9ic2VydmFibGUgQVBJXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBTdXBwb3NlIHdlIGhhdmUgalF1ZXJ5LmdldEpTT04oJy9teS91cmwnLCBjYWxsYmFjaylcbiAqIGNvbnN0IGdldEpTT05Bc09ic2VydmFibGUgPSBiaW5kQ2FsbGJhY2soalF1ZXJ5LmdldEpTT04pO1xuICogY29uc3QgcmVzdWx0ID0gZ2V0SlNPTkFzT2JzZXJ2YWJsZSgnL215L3VybCcpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICogYGBgXG4gKlxuICogIyMjIFJlY2VpdmUgYW4gYXJyYXkgb2YgYXJndW1lbnRzIHBhc3NlZCB0byBhIGNhbGxiYWNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oKGEsIGIsIGMpID0+IHtcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqICAgY29uc29sZS5sb2coYik7IC8vICdzb21lIHN0cmluZydcbiAqICAgY29uc29sZS5sb2coYyk7IC8vIHtzb21lUHJvcGVydHk6ICdzb21lVmFsdWUnfVxuICogfSk7XG4gKlxuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKCkuc3Vic2NyaWJlKHZhbHVlcyA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlcykgLy8gWzUsICdzb21lIHN0cmluZycsIHtzb21lUHJvcGVydHk6ICdzb21lVmFsdWUnfV1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbXBhcmUgYmVoYXZpb3VyIHdpdGggYW5kIHdpdGhvdXQgYXN5bmMgU2NoZWR1bGVyXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5KGNiKSB7XG4gKiAgIGNiKCk7XG4gKiB9XG4gKlxuICogY29uc3QgYm91bmRTeW5jRm4gPSBiaW5kQ2FsbGJhY2soaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseSk7XG4gKiBjb25zdCBib3VuZEFzeW5jRm4gPSBiaW5kQ2FsbGJhY2soaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseSwgbnVsbCwgUnguU2NoZWR1bGVyLmFzeW5jKTtcbiAqXG4gKiBib3VuZFN5bmNGbigpLnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnSSB3YXMgc3luYyEnKSk7XG4gKiBib3VuZEFzeW5jRm4oKS5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ0kgd2FzIGFzeW5jIScpKTtcbiAqIGNvbnNvbGUubG9nKCdUaGlzIGhhcHBlbmVkLi4uJyk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIEkgd2FzIHN5bmMhXG4gKiAvLyBUaGlzIGhhcHBlbmVkLi4uXG4gKiAvLyBJIHdhcyBhc3luYyFcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgYmluZENhbGxiYWNrIG9uIGFuIG9iamVjdCBtZXRob2RcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGJvdW5kTWV0aG9kID0gYmluZENhbGxiYWNrKHNvbWVPYmplY3QubWV0aG9kV2l0aENhbGxiYWNrKTtcbiAqIGJvdW5kTWV0aG9kLmNhbGwoc29tZU9iamVjdCkgLy8gbWFrZSBzdXJlIG1ldGhvZFdpdGhDYWxsYmFjayBoYXMgYWNjZXNzIHRvIHNvbWVPYmplY3RcbiAqIC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIEEgZnVuY3Rpb24gd2l0aCBhIGNhbGxiYWNrIGFzIHRoZSBsYXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gVGhlIHNjaGVkdWxlciBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGVcbiAqIGNhbGxiYWNrcy5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLnBhcmFtczogKik6IE9ic2VydmFibGV9IEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGVcbiAqIE9ic2VydmFibGUgdGhhdCBkZWxpdmVycyB0aGUgc2FtZSB2YWx1ZXMgdGhlIGNhbGxiYWNrIHdvdWxkIGRlbGl2ZXIuXG4gKiBAbmFtZSBiaW5kQ2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxUPihcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbixcbiAgcmVzdWx0U2VsZWN0b3I/OiBGdW5jdGlvbnxTY2hlZHVsZXJMaWtlLFxuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlXG4pOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8VD4ge1xuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCBzY2hlZHVsZXIpKC4uLmFyZ3MpLnBpcGUoXG4gICAgICAgIG1hcCgoYXJncykgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICBsZXQgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGNvbnRleHQsXG4gICAgICBzdWJqZWN0LFxuICAgICAgY2FsbGJhY2tGdW5jLFxuICAgICAgc2NoZWR1bGVyLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHN1YmplY3QubmV4dChpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2FuUmVwb3J0RXJyb3Ioc3ViamVjdCkpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+ID0ge1xuICAgICAgICAgIGFyZ3MsIHN1YnNjcmliZXIsIHBhcmFtcyxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaFN0YXRlPFQ+PihkaXNwYXRjaCwgMCwgc3RhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hTdGF0ZTxUPiB7XG4gIGFyZ3M6IGFueVtdO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBwYXJhbXM6IFBhcmFtc0NvbnRleHQ8VD47XG59XG5cbmludGVyZmFjZSBQYXJhbXNDb250ZXh0PFQ+IHtcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbjtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlO1xuICBjb250ZXh0OiBhbnk7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoU3RhdGU8VD4+LCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPikge1xuICBjb25zdCBzZWxmID0gdGhpcztcbiAgY29uc3QgeyBhcmdzLCBzdWJzY3JpYmVyLCBwYXJhbXMgfSA9IHN0YXRlO1xuICBjb25zdCB7IGNhbGxiYWNrRnVuYywgY29udGV4dCwgc2NoZWR1bGVyIH0gPSBwYXJhbXM7XG4gIGxldCB7IHN1YmplY3QgfSA9IHBhcmFtcztcbiAgaWYgKCFzdWJqZWN0KSB7XG4gICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncztcbiAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxOZXh0U3RhdGU8VD4+KGRpc3BhdGNoTmV4dCwgMCwgeyB2YWx1ZSwgc3ViamVjdCB9KSk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmFkZChzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG59XG5cbmludGVyZmFjZSBOZXh0U3RhdGU8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIHZhbHVlOiBUO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQ8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPE5leHRTdGF0ZTxUPj4sIHN0YXRlOiBOZXh0U3RhdGU8VD4pIHtcbiAgY29uc3QgeyB2YWx1ZSwgc3ViamVjdCB9ID0gc3RhdGU7XG4gIHN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIHN1YmplY3QuY29tcGxldGUoKTtcbn1cblxuaW50ZXJmYWNlIEVycm9yU3RhdGU8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGVycjogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxFcnJvclN0YXRlPFQ+Piwgc3RhdGU6IEVycm9yU3RhdGU8VD4pIHtcbiAgY29uc3QgeyBlcnIsIHN1YmplY3QgfSA9IHN0YXRlO1xuICBzdWJqZWN0LmVycm9yKGVycik7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuLi9Bc3luY1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBjYW5SZXBvcnRFcnJvciB9IGZyb20gJy4uL3V0aWwvY2FuUmVwb3J0RXJyb3InO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBkZXByZWNhdGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTU+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPHZvaWQ+OyAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbi8qKlxuICogQ29udmVydHMgYSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrIEFQSSB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhblxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBqdXN0IGxpa2Uge0BsaW5rIGJpbmRDYWxsYmFja30sIGJ1dCB0aGVcbiAqIGNhbGxiYWNrIGlzIGV4cGVjdGVkIHRvIGJlIG9mIHR5cGUgYGNhbGxiYWNrKGVycm9yLCByZXN1bHQpYC48L3NwYW4+XG4gKlxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGlzIG5vdCBhbiBvcGVyYXRvciBiZWNhdXNlIGl0cyBpbnB1dCBhbmQgb3V0cHV0IGFyZSBub3RcbiAqIE9ic2VydmFibGVzLiBUaGUgaW5wdXQgaXMgYSBmdW5jdGlvbiBgZnVuY2Agd2l0aCBzb21lIHBhcmFtZXRlcnMsIGJ1dCB0aGVcbiAqIGxhc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGBmdW5jYCBjYWxscyB3aGVuIGl0IGlzXG4gKiBkb25lLiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gZm9sbG93IE5vZGUuanMgY29udmVudGlvbnMsXG4gKiB3aGVyZSB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGNhbGxiYWNrIGlzIGFuIGVycm9yIG9iamVjdCwgc2lnbmFsaW5nXG4gKiB3aGV0aGVyIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuIElmIHRoYXQgb2JqZWN0IGlzIHBhc3NlZCB0byBjYWxsYmFjaywgaXQgbWVhbnNcbiAqIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgYGJpbmROb2RlQ2FsbGJhY2tgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZVxuICogcGFyYW1ldGVycyBhcyBgZnVuY2AsIGV4Y2VwdCB0aGUgbGFzdCBvbmUgKHRoZSBjYWxsYmFjaykuIFdoZW4gdGhlIG91dHB1dFxuICogZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzLCBpdCB3aWxsIHJldHVybiBhbiBPYnNlcnZhYmxlLlxuICogSWYgYGZ1bmNgIGNhbGxzIGl0cyBjYWxsYmFjayB3aXRoIGVycm9yIHBhcmFtZXRlciBwcmVzZW50LCBPYnNlcnZhYmxlIHdpbGxcbiAqIGVycm9yIHdpdGggdGhhdCB2YWx1ZSBhcyB3ZWxsLiBJZiBlcnJvciBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgT2JzZXJ2YWJsZSB3aWxsIGVtaXRcbiAqIHNlY29uZCBwYXJhbWV0ZXIuIElmIHRoZXJlIGFyZSBtb3JlIHBhcmFtZXRlcnMgKHRoaXJkIGFuZCBzbyBvbiksXG4gKiBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIGFsbCBhcmd1bWVudHMsIGV4Y2VwdCBmaXJzdCBlcnJvciBhcmd1bWVudC5cbiAqXG4gKiBOb3RlIHRoYXQgYGZ1bmNgIHdpbGwgbm90IGJlIGNhbGxlZCBhdCB0aGUgc2FtZSB0aW1lIG91dHB1dCBmdW5jdGlvbiBpcyxcbiAqIGJ1dCByYXRoZXIgd2hlbmV2ZXIgcmVzdWx0aW5nIE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC4gQnkgZGVmYXVsdCBjYWxsIHRvXG4gKiBgZnVuY2Agd2lsbCBoYXBwZW4gc3luY2hyb25vdXNseSBhZnRlciBzdWJzY3JpcHRpb24sIGJ1dCB0aGF0IGNhbiBiZSBjaGFuZ2VkXG4gKiB3aXRoIHByb3BlciBgc2NoZWR1bGVyYCBwcm92aWRlZCBhcyBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIuIHtAbGluayBTY2hlZHVsZXJMaWtlfVxuICogY2FuIGFsc28gY29udHJvbCB3aGVuIHZhbHVlcyBmcm9tIGNhbGxiYWNrIHdpbGwgYmUgZW1pdHRlZCBieSBPYnNlcnZhYmxlLlxuICogVG8gZmluZCBvdXQgbW9yZSwgY2hlY2sgb3V0IGRvY3VtZW50YXRpb24gZm9yIHtAbGluayBiaW5kQ2FsbGJhY2t9LCB3aGVyZVxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IHdvcmtzIGV4YWN0bHkgdGhlIHNhbWUuXG4gKlxuICogQXMgaW4ge0BsaW5rIGJpbmRDYWxsYmFja30sIGNvbnRleHQgKGB0aGlzYCBwcm9wZXJ0eSkgb2YgaW5wdXQgZnVuY3Rpb24gd2lsbCBiZSBzZXQgdG8gY29udGV4dFxuICogb2YgcmV0dXJuZWQgZnVuY3Rpb24sIHdoZW4gaXQgaXMgY2FsbGVkLlxuICpcbiAqIEFmdGVyIE9ic2VydmFibGUgZW1pdHMgdmFsdWUsIGl0IHdpbGwgY29tcGxldGUgaW1tZWRpYXRlbHkuIFRoaXMgbWVhbnNcbiAqIGV2ZW4gaWYgYGZ1bmNgIGNhbGxzIGNhbGxiYWNrIGFnYWluLCB2YWx1ZXMgZnJvbSBzZWNvbmQgYW5kIGNvbnNlY3V0aXZlXG4gKiBjYWxscyB3aWxsIG5ldmVyIGFwcGVhciBvbiB0aGUgc3RyZWFtLiBJZiB5b3UgbmVlZCB0byBoYW5kbGUgZnVuY3Rpb25zXG4gKiB0aGF0IGNhbGwgY2FsbGJhY2tzIG11bHRpcGxlIHRpbWVzLCBjaGVjayBvdXQge0BsaW5rIGZyb21FdmVudH0gb3JcbiAqIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSBpbnN0ZWFkLlxuICpcbiAqIE5vdGUgdGhhdCBgYmluZE5vZGVDYWxsYmFja2AgY2FuIGJlIHVzZWQgaW4gbm9uLU5vZGUuanMgZW52aXJvbm1lbnRzIGFzIHdlbGwuXG4gKiBcIk5vZGUuanMtc3R5bGVcIiBjYWxsYmFja3MgYXJlIGp1c3QgYSBjb252ZW50aW9uLCBzbyBpZiB5b3Ugd3JpdGUgZm9yXG4gKiBicm93c2VycyBvciBhbnkgb3RoZXIgZW52aXJvbm1lbnQgYW5kIEFQSSB5b3UgdXNlIGltcGxlbWVudHMgdGhhdCBjYWxsYmFjayBzdHlsZSxcbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBjYW4gYmUgc2FmZWx5IHVzZWQgb24gdGhhdCBBUEkgZnVuY3Rpb25zIGFzIHdlbGwuXG4gKlxuICogUmVtZW1iZXIgdGhhdCBFcnJvciBvYmplY3QgcGFzc2VkIHRvIGNhbGxiYWNrIGRvZXMgbm90IGhhdmUgdG8gYmUgYW4gaW5zdGFuY2VcbiAqIG9mIEphdmFTY3JpcHQgYnVpbHQtaW4gYEVycm9yYCBvYmplY3QuIEluIGZhY3QsIGl0IGRvZXMgbm90IGV2ZW4gaGF2ZSB0byBhbiBvYmplY3QuXG4gKiBFcnJvciBwYXJhbWV0ZXIgb2YgY2FsbGJhY2sgZnVuY3Rpb24gaXMgaW50ZXJwcmV0ZWQgYXMgXCJwcmVzZW50XCIsIHdoZW4gdmFsdWVcbiAqIG9mIHRoYXQgcGFyYW1ldGVyIGlzIHRydXRoeS4gSXQgY291bGQgYmUsIGZvciBleGFtcGxlLCBub24temVybyBudW1iZXIsIG5vbi1lbXB0eVxuICogc3RyaW5nIG9yIGJvb2xlYW4gYHRydWVgLiBJbiBhbGwgb2YgdGhlc2UgY2FzZXMgcmVzdWx0aW5nIE9ic2VydmFibGUgd291bGQgZXJyb3JcbiAqIHdpdGggdGhhdCB2YWx1ZS4gVGhpcyBtZWFucyB1c3VhbGx5IHJlZ3VsYXIgc3R5bGUgY2FsbGJhY2tzIHdpbGwgZmFpbCB2ZXJ5IG9mdGVuIHdoZW5cbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyB1c2VkLiBJZiB5b3VyIE9ic2VydmFibGUgZXJyb3JzIG11Y2ggbW9yZSBvZnRlbiB0aGVuIHlvdVxuICogd291bGQgZXhwZWN0LCBjaGVjayBpZiBjYWxsYmFjayByZWFsbHkgaXMgY2FsbGVkIGluIE5vZGUuanMtc3R5bGUgYW5kLCBpZiBub3QsXG4gKiBzd2l0Y2ggdG8ge0BsaW5rIGJpbmRDYWxsYmFja30gaW5zdGVhZC5cbiAqXG4gKiBOb3RlIHRoYXQgZXZlbiBpZiBlcnJvciBwYXJhbWV0ZXIgaXMgdGVjaG5pY2FsbHkgcHJlc2VudCBpbiBjYWxsYmFjaywgYnV0IGl0cyB2YWx1ZVxuICogaXMgZmFsc3ksIGl0IHN0aWxsIHdvbid0IGFwcGVhciBpbiBhcnJheSBlbWl0dGVkIGJ5IE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyAgUmVhZCBhIGZpbGUgZnJvbSB0aGUgZmlsZXN5c3RlbSBhbmQgZ2V0IHRoZSBkYXRhIGFzIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbiAqIGNvbnN0IHJlYWRGaWxlQXNPYnNlcnZhYmxlID0gYmluZE5vZGVDYWxsYmFjayhmcy5yZWFkRmlsZSk7XG4gKiBjb25zdCByZXN1bHQgPSByZWFkRmlsZUFzT2JzZXJ2YWJsZSgnLi9yb2FkTmFtZXMudHh0JywgJ3V0ZjgnKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBVc2Ugb24gZnVuY3Rpb24gY2FsbGluZyBjYWxsYmFjayB3aXRoIG11bHRpcGxlIGFyZ3VtZW50c1xuICogYGBgamF2YXNjcmlwdFxuICogc29tZUZ1bmN0aW9uKChlcnIsIGEsIGIpID0+IHtcbiAqICAgY29uc29sZS5sb2coZXJyKTsgLy8gbnVsbFxuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogICBjb25zb2xlLmxvZyhiKTsgLy8gXCJzb21lIHN0cmluZ1wiXG4gKiB9KTtcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZE5vZGVDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKVxuICogLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTsgLy8gWzUsIFwic29tZSBzdHJpbmdcIl1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFVzZSBvbiBmdW5jdGlvbiBjYWxsaW5nIGNhbGxiYWNrIGluIHJlZ3VsYXIgc3R5bGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbihhID0+IHtcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqIH0pO1xuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kTm9kZUNhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiB7fSAgICAgICAgICAgICAvLyBuZXZlciBnZXRzIGNhbGxlZFxuICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSAvLyA1XG4gKiApO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZENhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIEZ1bmN0aW9uIHdpdGggYSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrIGFzIHRoZSBsYXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gVGhlIHNjaGVkdWxlciBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGVcbiAqIGNhbGxiYWNrcy5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLnBhcmFtczogKik6IE9ic2VydmFibGV9IEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGVcbiAqIE9ic2VydmFibGUgdGhhdCBkZWxpdmVycyB0aGUgc2FtZSB2YWx1ZXMgdGhlIE5vZGUuanMgY2FsbGJhY2sgd291bGRcbiAqIGRlbGl2ZXIuXG4gKiBAbmFtZSBiaW5kTm9kZUNhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFQ+KFxuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLFxuICByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb258U2NoZWR1bGVyTGlrZSxcbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZVxuKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFQ+IHtcblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYywgc2NoZWR1bGVyKSguLi5hcmdzKS5waXBlKFxuICAgICAgICBtYXAoYXJncyA9PiBpc0FycmF5KGFyZ3MpID8gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykgOiByZXN1bHRTZWxlY3RvcihhcmdzKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBwYXJhbXM6IFBhcmFtc1N0YXRlPFQ+ID0ge1xuICAgICAgc3ViamVjdDogdW5kZWZpbmVkLFxuICAgICAgYXJncyxcbiAgICAgIGNhbGxiYWNrRnVuYyxcbiAgICAgIHNjaGVkdWxlcixcbiAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgfTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRleHQgfSA9IHBhcmFtcztcbiAgICAgIGxldCB7IHN1YmplY3QgfSA9IHBhcmFtcztcbiAgICAgIGlmICghc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IGlubmVyQXJncy5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQoaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzKTtcbiAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHN1YmplY3QpKSB7XG4gICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoU3RhdGU8VD4+KGRpc3BhdGNoLCAwLCB7IHBhcmFtcywgc3Vic2NyaWJlciwgY29udGV4dCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoU3RhdGU8VD4ge1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBjb250ZXh0OiBhbnk7XG4gIHBhcmFtczogUGFyYW1zU3RhdGU8VD47XG59XG5cbmludGVyZmFjZSBQYXJhbXNTdGF0ZTxUPiB7XG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb247XG4gIGFyZ3M6IGFueVtdO1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgY29udGV4dDogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RGlzcGF0Y2hTdGF0ZTxUPj4sIHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgcGFyYW1zLCBzdWJzY3JpYmVyLCBjb250ZXh0IH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBjYWxsYmFja0Z1bmMsIGFyZ3MsIHNjaGVkdWxlciB9ID0gcGFyYW1zO1xuICBsZXQgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0O1xuXG4gIGlmICghc3ViamVjdCkge1xuICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgZXJyID0gaW5uZXJBcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEVycm9yQXJnPFQ+PihkaXNwYXRjaEVycm9yLCAwLCB7IGVyciwgc3ViamVjdCB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncztcbiAgICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoTmV4dEFyZzxUPj4oZGlzcGF0Y2hOZXh0LCAwLCB7IHZhbHVlLCBzdWJqZWN0IH0pKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoRXJyb3JBcmc8VD4+KGRpc3BhdGNoRXJyb3IsIDAsIHsgZXJyLCBzdWJqZWN0IH0pKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmFkZChzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaE5leHRBcmc8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIHZhbHVlOiBUO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQ8VD4oYXJnOiBEaXNwYXRjaE5leHRBcmc8VD4pIHtcbiAgY29uc3QgeyB2YWx1ZSwgc3ViamVjdCB9ID0gYXJnO1xuICBzdWJqZWN0Lm5leHQodmFsdWUpO1xuICBzdWJqZWN0LmNvbXBsZXRlKCk7XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEVycm9yQXJnPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBlcnI6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvcjxUPihhcmc6IERpc3BhdGNoRXJyb3JBcmc8VD4pIHtcbiAgY29uc3QgeyBlcnIsIHN1YmplY3QgfSA9IGFyZztcbiAgc3ViamVjdC5lcnJvcihlcnIpO1xufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuL0lubmVyU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGlubmVyVmFsdWUpO1xuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSwgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuL091dGVyU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgSW5uZXJTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxSPiB7XG4gIHByaXZhdGUgaW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBPdXRlclN1YnNjcmliZXI8VCwgUj4sIHB1YmxpYyBvdXRlclZhbHVlOiBULCBwdWJsaWMgb3V0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogUik6IHZvaWQge1xuICAgIHRoaXMucGFyZW50Lm5vdGlmeU5leHQodGhpcy5vdXRlclZhbHVlLCB2YWx1ZSwgdGhpcy5vdXRlckluZGV4LCB0aGlzLmluZGV4KyssIHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5RXJyb3IoZXJyb3IsIHRoaXMpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5Q29tcGxldGUodGhpcyk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL2hvc3RSZXBvcnRFcnJvcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUb1Byb21pc2UgPSA8VD4ocHJvbWlzZTogUHJvbWlzZUxpa2U8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIHByb21pc2UudGhlbihcbiAgICAodmFsdWUpID0+IHtcbiAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgKGVycjogYW55KSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycilcbiAgKVxuICAudGhlbihudWxsLCBob3N0UmVwb3J0RXJyb3IpO1xuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sSXRlcmF0b3IoKTogc3ltYm9sIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgIVN5bWJvbC5pdGVyYXRvcikge1xuICAgIHJldHVybiAnQEBpdGVyYXRvcicgYXMgYW55O1xuICB9XG5cbiAgcmV0dXJuIFN5bWJvbC5pdGVyYXRvcjtcbn1cblxuZXhwb3J0IGNvbnN0IGl0ZXJhdG9yID0gZ2V0U3ltYm9sSXRlcmF0b3IoKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rIGl0ZXJhdG9yfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBjb25zdCAkJGl0ZXJhdG9yID0gaXRlcmF0b3I7XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9JdGVyYWJsZSA9IDxUPihpdGVyYWJsZTogSXRlcmFibGU8VD4pID0+IChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmFibGVbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICBkbyB7XG4gICAgY29uc3QgaXRlbSA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICBpZiAoaXRlbS5kb25lKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc3Vic2NyaWJlci5uZXh0KGl0ZW0udmFsdWUpO1xuICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9IHdoaWxlICh0cnVlKTtcblxuICAvLyBGaW5hbGl6ZSB0aGUgaXRlcmF0b3IgaWYgaXQgaGFwcGVucyB0byBiZSBhIEdlbmVyYXRvclxuICBpZiAodHlwZW9mIGl0ZXJhdG9yLnJldHVybiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvci5yZXR1cm4pIHtcbiAgICAgICAgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gc3Vic2NyaWJlcjtcbn07XG4iLCJpbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuXG4vKipcbiAqIFN1YnNjcmliZXMgdG8gYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBTeW1ib2wub2JzZXJ2YWJsZSB3aXRoIHRoZSBnaXZlblxuICogU3Vic2NyaWJlci5cbiAqIEBwYXJhbSBvYmogQW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBTeW1ib2wub2JzZXJ2YWJsZVxuICovXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG9PYnNlcnZhYmxlID0gPFQ+KG9iajogYW55KSA9PiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICBjb25zdCBvYnMgPSBvYmpbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gIGlmICh0eXBlb2Ygb2JzLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFNob3VsZCBiZSBjYXVnaHQgYnkgb2JzZXJ2YWJsZSBzdWJzY3JpYmUgZnVuY3Rpb24gZXJyb3IgaGFuZGxpbmcuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvdmlkZWQgb2JqZWN0IGRvZXMgbm90IGNvcnJlY3RseSBpbXBsZW1lbnQgU3ltYm9sLm9ic2VydmFibGUnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2JzLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBpc0FycmF5TGlrZSA9ICg8VD4oeDogYW55KTogeCBpcyBBcnJheUxpa2U8VD4gPT4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInICYmIHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nKTsiLCJleHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBQcm9taXNlTGlrZTxhbnk+IHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiAoPGFueT52YWx1ZSkuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiAodmFsdWUgYXMgYW55KS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9BcnJheSB9IGZyb20gJy4vc3Vic2NyaWJlVG9BcnJheSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Byb21pc2UgfSBmcm9tICcuL3N1YnNjcmliZVRvUHJvbWlzZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0l0ZXJhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb0l0ZXJhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvT2JzZXJ2YWJsZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4vaXNPYmplY3QnO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbmV4cG9ydCBjb25zdCBzdWJzY3JpYmVUbyA9IDxUPihyZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxUPikgPT4ge1xuICBpZiAocmVzdWx0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgIHJldHVybiAoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4ge1xuICAgICAgICBpZiAocmVzdWx0Ll9pc1NjYWxhcikge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoKHJlc3VsdCBhcyBhbnkpLnZhbHVlKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdFtTeW1ib2xfb2JzZXJ2YWJsZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9PYnNlcnZhYmxlKHJlc3VsdCBhcyBhbnkpO1xuICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9BcnJheShyZXN1bHQpO1xuICB9IGVsc2UgaWYgKGlzUHJvbWlzZShyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUHJvbWlzZShyZXN1bHQgYXMgUHJvbWlzZTxhbnk+KTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdFtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvSXRlcmFibGUocmVzdWx0IGFzIGFueSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmFsdWUgPSBpc09iamVjdChyZXN1bHQpID8gJ2FuIGludmFsaWQgb2JqZWN0JyA6IGAnJHtyZXN1bHR9J2A7XG4gICAgY29uc3QgbXNnID0gYFlvdSBwcm92aWRlZCAke3ZhbHVlfSB3aGVyZSBhIHN0cmVhbSB3YXMgZXhwZWN0ZWQuYFxuICAgICAgKyAnIFlvdSBjYW4gcHJvdmlkZSBhbiBPYnNlcnZhYmxlLCBQcm9taXNlLCBBcnJheSwgb3IgSXRlcmFibGUuJztcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG1zZyk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUbyB9IGZyb20gJy4vc3Vic2NyaWJlVG8nO1xuXG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4oXG4gIG91dGVyU3Vic2NyaWJlcjogT3V0ZXJTdWJzY3JpYmVyPFQsIFI+LFxuICByZXN1bHQ6IGFueSxcbiAgb3V0ZXJWYWx1ZT86IFQsXG4gIG91dGVySW5kZXg/OiBudW1iZXIsXG4gIGRlc3RpbmF0aW9uPzogU3Vic2NyaWJlcjxhbnk+XG4pOiBTdWJzY3JpcHRpb247XG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4oXG4gIG91dGVyU3Vic2NyaWJlcjogT3V0ZXJTdWJzY3JpYmVyPFQsIFI+LFxuICByZXN1bHQ6IGFueSxcbiAgb3V0ZXJWYWx1ZT86IFQsXG4gIG91dGVySW5kZXg/OiBudW1iZXIsXG4gIGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPGFueT4gPSBuZXcgSW5uZXJTdWJzY3JpYmVyKG91dGVyU3Vic2NyaWJlciwgb3V0ZXJWYWx1ZSwgb3V0ZXJJbmRleClcbik6IFN1YnNjcmlwdGlvbiB8IHZvaWQge1xuICBpZiAoZGVzdGluYXRpb24uY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJldHVybiBzdWJzY3JpYmVUbyhyZXN1bHQpKGRlc3RpbmF0aW9uKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyICB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgaXNBcnJheSAgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5cbmNvbnN0IE5PTkUgPSB7fTtcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCkgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMykgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCkgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUNCwgVDUsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUpID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUsIHY2OiBUNikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxUPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3Q8VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgKCguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSKSB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKSB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29tYmluZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG8gY3JlYXRlIGFuIE9ic2VydmFibGUgd2hvc2UgdmFsdWVzIGFyZVxuICogY2FsY3VsYXRlZCBmcm9tIHRoZSBsYXRlc3QgdmFsdWVzIG9mIGVhY2ggb2YgaXRzIGlucHV0IE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XaGVuZXZlciBhbnkgaW5wdXQgT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlLCBpdFxuICogY29tcHV0ZXMgYSBmb3JtdWxhIHVzaW5nIHRoZSBsYXRlc3QgdmFsdWVzIGZyb20gYWxsIHRoZSBpbnB1dHMsIHRoZW4gZW1pdHNcbiAqIHRoZSBvdXRwdXQgb2YgdGhhdCBmb3JtdWxhLjwvc3Bhbj5cbiAqXG4gKiAhW10oY29tYmluZUxhdGVzdC5wbmcpXG4gKlxuICogYGNvbWJpbmVMYXRlc3RgIGNvbWJpbmVzIHRoZSB2YWx1ZXMgZnJvbSBhbGwgdGhlIE9ic2VydmFibGVzIHBhc3NlZCBhc1xuICogYXJndW1lbnRzLiBUaGlzIGlzIGRvbmUgYnkgc3Vic2NyaWJpbmcgdG8gZWFjaCBPYnNlcnZhYmxlIGluIG9yZGVyIGFuZCxcbiAqIHdoZW5ldmVyIGFueSBPYnNlcnZhYmxlIGVtaXRzLCBjb2xsZWN0aW5nIGFuIGFycmF5IG9mIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWVzIGZyb20gZWFjaCBPYnNlcnZhYmxlLiBTbyBpZiB5b3UgcGFzcyBgbmAgT2JzZXJ2YWJsZXMgdG8gb3BlcmF0b3IsXG4gKiByZXR1cm5lZCBPYnNlcnZhYmxlIHdpbGwgYWx3YXlzIGVtaXQgYW4gYXJyYXkgb2YgYG5gIHZhbHVlcywgaW4gb3JkZXJcbiAqIGNvcnJlc3BvbmRpbmcgdG8gb3JkZXIgb2YgcGFzc2VkIE9ic2VydmFibGVzICh2YWx1ZSBmcm9tIHRoZSBmaXJzdCBPYnNlcnZhYmxlXG4gKiBvbiB0aGUgZmlyc3QgcGxhY2UgYW5kIHNvIG9uKS5cbiAqXG4gKiBTdGF0aWMgdmVyc2lvbiBvZiBgY29tYmluZUxhdGVzdGAgYWNjZXB0cyBlaXRoZXIgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXNcbiAqIG9yIGVhY2ggT2JzZXJ2YWJsZSBjYW4gYmUgcHV0IGRpcmVjdGx5IGFzIGFuIGFyZ3VtZW50LiBOb3RlIHRoYXQgYXJyYXkgb2ZcbiAqIE9ic2VydmFibGVzIGlzIGdvb2QgY2hvaWNlLCBpZiB5b3UgZG9uJ3Qga25vdyBiZWZvcmVoYW5kIGhvdyBtYW55IE9ic2VydmFibGVzXG4gKiB5b3Ugd2lsbCBjb21iaW5lLiBQYXNzaW5nIGVtcHR5IGFycmF5IHdpbGwgcmVzdWx0IGluIE9ic2VydmFibGUgdGhhdFxuICogY29tcGxldGVzIGltbWVkaWF0ZWx5LlxuICpcbiAqIFRvIGVuc3VyZSBvdXRwdXQgYXJyYXkgaGFzIGFsd2F5cyB0aGUgc2FtZSBsZW5ndGgsIGBjb21iaW5lTGF0ZXN0YCB3aWxsXG4gKiBhY3R1YWxseSB3YWl0IGZvciBhbGwgaW5wdXQgT2JzZXJ2YWJsZXMgdG8gZW1pdCBhdCBsZWFzdCBvbmNlLFxuICogYmVmb3JlIGl0IHN0YXJ0cyBlbWl0dGluZyByZXN1bHRzLiBUaGlzIG1lYW5zIGlmIHNvbWUgT2JzZXJ2YWJsZSBlbWl0c1xuICogdmFsdWVzIGJlZm9yZSBvdGhlciBPYnNlcnZhYmxlcyBzdGFydGVkIGVtaXR0aW5nLCBhbGwgdGhlc2UgdmFsdWVzIGJ1dCB0aGUgbGFzdFxuICogd2lsbCBiZSBsb3N0LiBPbiB0aGUgb3RoZXIgaGFuZCwgaWYgc29tZSBPYnNlcnZhYmxlIGRvZXMgbm90IGVtaXQgYSB2YWx1ZSBidXRcbiAqIGNvbXBsZXRlcywgcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSBhdCB0aGUgc2FtZSBtb21lbnQgd2l0aG91dFxuICogZW1pdHRpbmcgYW55dGhpbmcsIHNpbmNlIGl0IHdpbGwgYmUgbm93IGltcG9zc2libGUgdG8gaW5jbHVkZSB2YWx1ZSBmcm9tXG4gKiBjb21wbGV0ZWQgT2JzZXJ2YWJsZSBpbiByZXN1bHRpbmcgYXJyYXkuIEFsc28sIGlmIHNvbWUgaW5wdXQgT2JzZXJ2YWJsZSBkb2VzXG4gKiBub3QgZW1pdCBhbnkgdmFsdWUgYW5kIG5ldmVyIGNvbXBsZXRlcywgYGNvbWJpbmVMYXRlc3RgIHdpbGwgYWxzbyBuZXZlciBlbWl0XG4gKiBhbmQgbmV2ZXIgY29tcGxldGUsIHNpbmNlLCBhZ2FpbiwgaXQgd2lsbCB3YWl0IGZvciBhbGwgc3RyZWFtcyB0byBlbWl0IHNvbWVcbiAqIHZhbHVlLlxuICpcbiAqIElmIGF0IGxlYXN0IG9uZSBPYnNlcnZhYmxlIHdhcyBwYXNzZWQgdG8gYGNvbWJpbmVMYXRlc3RgIGFuZCBhbGwgcGFzc2VkIE9ic2VydmFibGVzXG4gKiBlbWl0dGVkIHNvbWV0aGluZywgcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBjb21wbGV0ZSB3aGVuIGFsbCBjb21iaW5lZFxuICogc3RyZWFtcyBjb21wbGV0ZS4gU28gZXZlbiBpZiBzb21lIE9ic2VydmFibGUgY29tcGxldGVzLCByZXN1bHQgb2ZcbiAqIGBjb21iaW5lTGF0ZXN0YCB3aWxsIHN0aWxsIGVtaXQgdmFsdWVzIHdoZW4gb3RoZXIgT2JzZXJ2YWJsZXMgZG8uIEluIGNhc2VcbiAqIG9mIGNvbXBsZXRlZCBPYnNlcnZhYmxlLCBpdHMgdmFsdWUgZnJvbSBub3cgb24gd2lsbCBhbHdheXMgYmUgdGhlIGxhc3RcbiAqIGVtaXR0ZWQgdmFsdWUuIE9uIHRoZSBvdGhlciBoYW5kLCBpZiBhbnkgT2JzZXJ2YWJsZSBlcnJvcnMsIGBjb21iaW5lTGF0ZXN0YFxuICogd2lsbCBlcnJvciBpbW1lZGlhdGVseSBhcyB3ZWxsLCBhbmQgYWxsIG90aGVyIE9ic2VydmFibGVzIHdpbGwgYmUgdW5zdWJzY3JpYmVkLlxuICpcbiAqIGBjb21iaW5lTGF0ZXN0YCBhY2NlcHRzIGFzIG9wdGlvbmFsIHBhcmFtZXRlciBgcHJvamVjdGAgZnVuY3Rpb24sIHdoaWNoIHRha2VzXG4gKiBhcyBhcmd1bWVudHMgYWxsIHZhbHVlcyB0aGF0IHdvdWxkIG5vcm1hbGx5IGJlIGVtaXR0ZWQgYnkgcmVzdWx0aW5nIE9ic2VydmFibGUuXG4gKiBgcHJvamVjdGAgY2FuIHJldHVybiBhbnkga2luZCBvZiB2YWx1ZSwgd2hpY2ggd2lsbCBiZSB0aGVuIGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZVxuICogaW5zdGVhZCBvZiBkZWZhdWx0IGFycmF5LiBOb3RlIHRoYXQgYHByb2plY3RgIGRvZXMgbm90IHRha2UgYXMgYXJndW1lbnQgdGhhdCBhcnJheVxuICogb2YgdmFsdWVzLCBidXQgdmFsdWVzIHRoZW1zZWx2ZXMuIFRoYXQgbWVhbnMgZGVmYXVsdCBgcHJvamVjdGAgY2FuIGJlIGltYWdpbmVkXG4gKiBhcyBmdW5jdGlvbiB0aGF0IHRha2VzIGFsbCBpdHMgYXJndW1lbnRzIGFuZCBwdXRzIHRoZW0gaW50byBhbiBhcnJheS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbWJpbmUgdHdvIHRpbWVyIE9ic2VydmFibGVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBmaXJzdFRpbWVyID0gdGltZXIoMCwgMTAwMCk7IC8vIGVtaXQgMCwgMSwgMi4uLiBhZnRlciBldmVyeSBzZWNvbmQsIHN0YXJ0aW5nIGZyb20gbm93XG4gKiBjb25zdCBzZWNvbmRUaW1lciA9IHRpbWVyKDUwMCwgMTAwMCk7IC8vIGVtaXQgMCwgMSwgMi4uLiBhZnRlciBldmVyeSBzZWNvbmQsIHN0YXJ0aW5nIDAsNXMgZnJvbSBub3dcbiAqIGNvbnN0IGNvbWJpbmVkVGltZXJzID0gY29tYmluZUxhdGVzdChmaXJzdFRpbWVyLCBzZWNvbmRUaW1lcik7XG4gKiBjb21iaW5lZFRpbWVycy5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqIC8vIExvZ3NcbiAqIC8vIFswLCAwXSBhZnRlciAwLjVzXG4gKiAvLyBbMSwgMF0gYWZ0ZXIgMXNcbiAqIC8vIFsxLCAxXSBhZnRlciAxLjVzXG4gKiAvLyBbMiwgMV0gYWZ0ZXIgMnNcbiAqIGBgYFxuICpcbiAqICMjIyBDb21iaW5lIGFuIGFycmF5IG9mIE9ic2VydmFibGVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYnNlcnZhYmxlcyA9IFsxLCA1LCAxMF0ubWFwKFxuICogICBuID0+IG9mKG4pLnBpcGUoXG4gKiAgICAgZGVsYXkobiAqIDEwMDApLCAgIC8vIGVtaXQgMCBhbmQgdGhlbiBlbWl0IG4gYWZ0ZXIgbiBzZWNvbmRzXG4gKiAgICAgc3RhcnRXaXRoKDApLFxuICogICApXG4gKiApO1xuICogY29uc3QgY29tYmluZWQgPSBjb21iaW5lTGF0ZXN0KG9ic2VydmFibGVzKTtcbiAqIGNvbWJpbmVkLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICogLy8gTG9nc1xuICogLy8gWzAsIDAsIDBdIGltbWVkaWF0ZWx5XG4gKiAvLyBbMSwgMCwgMF0gYWZ0ZXIgMXNcbiAqIC8vIFsxLCA1LCAwXSBhZnRlciA1c1xuICogLy8gWzEsIDUsIDEwXSBhZnRlciAxMHNcbiAqIGBgYFxuICpcbiAqXG4gKiAjIyMgVXNlIHByb2plY3QgZnVuY3Rpb24gdG8gZHluYW1pY2FsbHkgY2FsY3VsYXRlIHRoZSBCb2R5LU1hc3MgSW5kZXhcbiAqIGBgYGphdmFzY3JpcHRcbiAqICogY29uc3Qgd2VpZ2h0ID0gb2YoNzAsIDcyLCA3NiwgNzksIDc1KTtcbiAqIGNvbnN0IGhlaWdodCA9IG9mKDEuNzYsIDEuNzcsIDEuNzgpO1xuICogY29uc3QgYm1pID0gY29tYmluZUxhdGVzdCh3ZWlnaHQsIGhlaWdodCkucGlwZShcbiAqICAgbWFwKChbdywgaF0pID0+IHcgLyAoaCAqIGgpKSxcbiAqICk7XG4gKiBibWkuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ0JNSSBpcyAnICsgeCkpO1xuICpcbiAqIC8vIFdpdGggb3V0cHV0IHRvIGNvbnNvbGU6XG4gKiAvLyBCTUkgaXMgMjQuMjEyMjkzMzg4NDI5NzUzXG4gKiAvLyBCTUkgaXMgMjMuOTM5NDgwOTkyMDUyMDlcbiAqIC8vIEJNSSBpcyAyMy42NzEyNTM2Mjk1OTIyMjJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZX1cbiAqIEBzZWUge0BsaW5rIHdpdGhMYXRlc3RGcm9tfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlMSBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbWJpbmUgd2l0aCBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlMiBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbWJpbmUgd2l0aCBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIE1vcmUgdGhhbiBvbmUgaW5wdXQgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIGFyZ3VtZW50c1xuICogb3IgYW4gYXJyYXkgb2YgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtwcm9qZWN0XSBBbiBvcHRpb25hbCBmdW5jdGlvbiB0byBwcm9qZWN0IHRoZSB2YWx1ZXMgZnJvbVxuICogdGhlIGNvbWJpbmVkIGxhdGVzdCB2YWx1ZXMgaW50byBhIG5ldyB2YWx1ZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9bnVsbF0gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHN1YnNjcmliaW5nIHRvXG4gKiBlYWNoIGlucHV0IE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIHByb2plY3RlZCB2YWx1ZXMgZnJvbSB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlcyBmcm9tIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZSwgb3IgYW4gYXJyYXkgb2YgdGhlIG1vc3QgcmVjZW50IHZhbHVlcyBmcm9tXG4gKiBlYWNoIGlucHV0IE9ic2VydmFibGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0PFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxhbnkgfCBPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgbGV0IHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSID0gIG51bGw7XG4gIGxldCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBudWxsO1xuXG4gIGlmIChpc1NjaGVkdWxlcihvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXSkpIHtcbiAgICBzY2hlZHVsZXIgPSA8U2NoZWR1bGVyTGlrZT5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXN1bHRTZWxlY3RvciA9IDwoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSPm9ic2VydmFibGVzLnBvcCgpO1xuICB9XG5cbiAgLy8gaWYgdGhlIGZpcnN0IGFuZCBvbmx5IG90aGVyIGFyZ3VtZW50IGJlc2lkZXMgdGhlIHJlc3VsdFNlbGVjdG9yIGlzIGFuIGFycmF5XG4gIC8vIGFzc3VtZSBpdCdzIGJlZW4gY2FsbGVkIHdpdGggYGNvbWJpbmVMYXRlc3QoW29iczEsIG9iczIsIG9iczNdLCByZXN1bHRTZWxlY3RvcilgXG4gIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShvYnNlcnZhYmxlc1swXSkpIHtcbiAgICBvYnNlcnZhYmxlcyA9IDxBcnJheTxPYnNlcnZhYmxlPGFueT4+Pm9ic2VydmFibGVzWzBdO1xuICB9XG5cbiAgcmV0dXJuIGZyb21BcnJheShvYnNlcnZhYmxlcywgc2NoZWR1bGVyKS5saWZ0KG5ldyBDb21iaW5lTGF0ZXN0T3BlcmF0b3I8VCwgUj4ocmVzdWx0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIENvbWJpbmVMYXRlc3RPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBDb21iaW5lTGF0ZXN0U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlc3VsdFNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBDb21iaW5lTGF0ZXN0U3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgYWN0aXZlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHZhbHVlczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSB0b1Jlc3BvbmQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPiwgcHJpdmF0ZSByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQob2JzZXJ2YWJsZTogYW55KSB7XG4gICAgdGhpcy52YWx1ZXMucHVzaChOT05FKTtcbiAgICB0aGlzLm9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZhYmxlcy5sZW5ndGg7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGxlbjtcbiAgICAgIHRoaXMudG9SZXNwb25kID0gbGVuO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gb2JzZXJ2YWJsZXNbaV07XG4gICAgICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG9ic2VydmFibGUsIG9ic2VydmFibGUsIGkpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSh1bnVzZWQ6IFN1YnNjcmliZXI8Uj4pOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMuYWN0aXZlIC09IDEpID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcbiAgICBjb25zdCBvbGRWYWwgPSB2YWx1ZXNbb3V0ZXJJbmRleF07XG4gICAgY29uc3QgdG9SZXNwb25kID0gIXRoaXMudG9SZXNwb25kXG4gICAgICA/IDBcbiAgICAgIDogb2xkVmFsID09PSBOT05FID8gLS10aGlzLnRvUmVzcG9uZCA6IHRoaXMudG9SZXNwb25kO1xuICAgIHZhbHVlc1tvdXRlckluZGV4XSA9IGlubmVyVmFsdWU7XG5cbiAgICBpZiAodG9SZXNwb25kID09PSAwKSB7XG4gICAgICBpZiAodGhpcy5yZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICB0aGlzLl90cnlSZXN1bHRTZWxlY3Rvcih2YWx1ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlcy5zbGljZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF90cnlSZXN1bHRTZWxlY3Rvcih2YWx1ZXM6IGFueVtdKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnJlc3VsdFNlbGVjdG9yLmFwcGx5KHRoaXMsIHZhbHVlcyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5cbi8qKiBJZGVudGlmaWVzIGFuIGlucHV0IGFzIGJlaW5nIE9ic2VydmFibGUgKGJ1dCBub3QgbmVjZXNzYXJ5IGFuIFJ4IE9ic2VydmFibGUpICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dDogYW55KTogaW5wdXQgaXMgSW50ZXJvcE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBpbnB1dCAmJiB0eXBlb2YgaW5wdXRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcblxuLyoqIElkZW50aWZpZXMgYW4gaW5wdXQgYXMgYmVpbmcgYW4gSXRlcmFibGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKGlucHV0OiBhbnkpOiBpbnB1dCBpcyBJdGVyYWJsZTxhbnk+IHtcbiAgcmV0dXJuIGlucHV0ICYmIHR5cGVvZiBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Byb21pc2UgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUHJvbWlzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUHJvbWlzZTxUPihpbnB1dDogUHJvbWlzZUxpa2U8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9Qcm9taXNlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gaW5wdXQudGhlbihcbiAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKSk7XG4gICAgICAgIH1cbiAgICAgICkpKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUl0ZXJhYmxlPFQ+KGlucHV0OiBJdGVyYWJsZTxUPiwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghaW5wdXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0l0ZXJhYmxlIGNhbm5vdCBiZSBudWxsJyk7XG4gIH1cbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9JdGVyYWJsZShpbnB1dCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGxldCBpdGVyYXRvcjogSXRlcmF0b3I8VD47XG4gICAgICBzdWIuYWRkKCgpID0+IHtcbiAgICAgICAgLy8gRmluYWxpemUgZ2VuZXJhdG9yc1xuICAgICAgICBpZiAoaXRlcmF0b3IgJiYgdHlwZW9mIGl0ZXJhdG9yLnJldHVybiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGl0ZXJhdG9yLnJldHVybigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdKCk7XG4gICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IHZhbHVlOiBUO1xuICAgICAgICAgIGxldCBkb25lOiBib29sZWFuO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgIGRvbmUgPSByZXN1bHQuZG9uZTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgSW50ZXJvcE9ic2VydmFibGUsIFNjaGVkdWxlckxpa2UsIFN1YnNjcmliYWJsZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21PYnNlcnZhYmxlPFQ+KGlucHV0OiBJbnRlcm9wT2JzZXJ2YWJsZTxUPiwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvT2JzZXJ2YWJsZShpbnB1dCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZTogU3Vic2NyaWJhYmxlPFQ+ID0gaW5wdXRbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgIHN1Yi5hZGQob2JzZXJ2YWJsZS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQodmFsdWUpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKSkpOyB9LFxuICAgICAgICAgIGVycm9yKGVycikgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycikpKTsgfSxcbiAgICAgICAgICBjb21wbGV0ZSgpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7IH0sXG4gICAgICAgIH0pKTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvaXNQcm9taXNlJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc0ludGVyb3BPYnNlcnZhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0ludGVyb3BPYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzSXRlcmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgZnJvbVByb21pc2UgfSBmcm9tICcuL2Zyb21Qcm9taXNlJztcbmltcG9ydCB7IGZyb21JdGVyYWJsZSB9IGZyb20gJy4vZnJvbUl0ZXJhYmxlJztcbmltcG9ydCB7IGZyb21PYnNlcnZhYmxlIH0gZnJvbSAnLi9mcm9tT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUbyB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG8nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbTxUPihpbnB1dDogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8T2JzZXJ2YWJsZUlucHV0PFQ+Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8T2JzZXJ2YWJsZTxUPj47XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIGZyb20gYW4gQXJyYXksIGFuIGFycmF5LWxpa2Ugb2JqZWN0LCBhIFByb21pc2UsIGFuIGl0ZXJhYmxlIG9iamVjdCwgb3IgYW4gT2JzZXJ2YWJsZS1saWtlIG9iamVjdC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29udmVydHMgYWxtb3N0IGFueXRoaW5nIHRvIGFuIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXShmcm9tLnBuZylcbiAqXG4gKiBgZnJvbWAgY29udmVydHMgdmFyaW91cyBvdGhlciBvYmplY3RzIGFuZCBkYXRhIHR5cGVzIGludG8gT2JzZXJ2YWJsZXMuIEl0IGFsc28gY29udmVydHMgYSBQcm9taXNlLCBhbiBhcnJheS1saWtlLCBvciBhblxuICogPGEgaHJlZj1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0l0ZXJhdGlvbl9wcm90b2NvbHMjaXRlcmFibGVcIiB0YXJnZXQ9XCJfYmxhbmtcIj5pdGVyYWJsZTwvYT5cbiAqIG9iamVjdCBpbnRvIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbXMgaW4gdGhhdCBwcm9taXNlLCBhcnJheSwgb3IgaXRlcmFibGUuIEEgU3RyaW5nLCBpbiB0aGlzIGNvbnRleHQsIGlzIHRyZWF0ZWRcbiAqIGFzIGFuIGFycmF5IG9mIGNoYXJhY3RlcnMuIE9ic2VydmFibGUtbGlrZSBvYmplY3RzIChjb250YWlucyBhIGZ1bmN0aW9uIG5hbWVkIHdpdGggdGhlIEVTMjAxNSBTeW1ib2wgZm9yIE9ic2VydmFibGUpIGNhbiBhbHNvIGJlXG4gKiBjb252ZXJ0ZWQgdGhyb3VnaCB0aGlzIG9wZXJhdG9yLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgQ29udmVydHMgYW4gYXJyYXkgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tJztcbiAqXG4gKiBjb25zdCBhcnJheSA9IFsxMCwgMjAsIDMwXTtcbiAqIGNvbnN0IHJlc3VsdCA9IGZyb20oYXJyYXkpO1xuICpcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDEwIDIwIDMwXG4gKiBgYGBcbiAqXG4gKiAtLS1cbiAqXG4gKiAjIyMgQ29udmVydCBhbiBpbmZpbml0ZSBpdGVyYWJsZSAoZnJvbSBhIGdlbmVyYXRvcikgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqIGltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzL29ic2VydmFibGUvZnJvbSc7XG4gKlxuICogZnVuY3Rpb24qIGdlbmVyYXRlRG91YmxlcyhzZWVkKSB7XG4gKiAgICBsZXQgaSA9IHNlZWQ7XG4gKiAgICB3aGlsZSAodHJ1ZSkge1xuICogICAgICB5aWVsZCBpO1xuICogICAgICBpID0gMiAqIGk7IC8vIGRvdWJsZSBpdFxuICogICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGl0ZXJhdG9yID0gZ2VuZXJhdGVEb3VibGVzKDMpO1xuICogY29uc3QgcmVzdWx0ID0gZnJvbShpdGVyYXRvcikucGlwZSh0YWtlKDEwKSk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMyA2IDEyIDI0IDQ4IDk2IDE5MiAzODQgNzY4IDE1MzZcbiAqIGBgYFxuICpcbiAqIC0tLVxuICpcbiAqICMjIyB3aXRoIGFzeW5jIHNjaGVkdWxlclxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tJztcbiAqIGltcG9ydCB7IGFzeW5jIH0gZnJvbSAncnhqcy9zY2hlZHVsZXIvYXN5bmMnO1xuICpcbiAqIGNvbnNvbGUubG9nKCdzdGFydCcpO1xuICpcbiAqIGNvbnN0IGFycmF5ID0gWzEwLCAyMCwgMzBdO1xuICogY29uc3QgcmVzdWx0ID0gZnJvbShhcnJheSwgYXN5bmMpO1xuICpcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogY29uc29sZS5sb2coJ2VuZCcpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBzdGFydCBlbmQgMTAgMjAgMzBcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb21FdmVudH1cbiAqIEBzZWUge0BsaW5rIGZyb21FdmVudFBhdHRlcm59XG4gKiBAc2VlIHtAbGluayBmcm9tUHJvbWlzZX1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGVJbnB1dDxUPn0gQSBzdWJzY3JpcHRpb24gb2JqZWN0LCBhIFByb21pc2UsIGFuIE9ic2VydmFibGUtbGlrZSxcbiAqIGFuIEFycmF5LCBhbiBpdGVyYWJsZSwgb3IgYW4gYXJyYXktbGlrZSBvYmplY3QgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBBbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlIGVtaXNzaW9uIG9mIHZhbHVlcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59XG4gKiBAbmFtZSBmcm9tXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUbyhpbnB1dCkpO1xuICB9XG5cbiAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tT2JzZXJ2YWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJvbWlzZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21BcnJheShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9ICBlbHNlIGlmIChpc0l0ZXJhYmxlKGlucHV0KSB8fCB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZnJvbUl0ZXJhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoKGlucHV0ICE9PSBudWxsICYmIHR5cGVvZiBpbnB1dCB8fCBpbnB1dCkgKyAnIGlzIG5vdCBvYnNlcnZhYmxlJyk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHVzZSBpbm5lciBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwPFQsIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LCByZXN1bHRTZWxlY3RvcjogdW5kZWZpbmVkLCBjb25jdXJyZW50PzogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgaW5uZXIgbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcDxULCBJLCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxJPiwgcmVzdWx0U2VsZWN0b3I6IChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBJLCBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcikgPT4gUiwgY29uY3VycmVudD86IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFByb2plY3RzIGVhY2ggc291cmNlIHZhbHVlIHRvIGFuIE9ic2VydmFibGUgd2hpY2ggaXMgbWVyZ2VkIGluIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPk1hcHMgZWFjaCB2YWx1ZSB0byBhbiBPYnNlcnZhYmxlLCB0aGVuIGZsYXR0ZW5zIGFsbCBvZlxuICogdGhlc2UgaW5uZXIgT2JzZXJ2YWJsZXMgdXNpbmcge0BsaW5rIG1lcmdlQWxsfS48L3NwYW4+XG4gKlxuICogIVtdKG1lcmdlTWFwLnBuZylcbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBiYXNlZCBvbiBhcHBseWluZyBhIGZ1bmN0aW9uIHRoYXQgeW91XG4gKiBzdXBwbHkgdG8gZWFjaCBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB3aGVyZSB0aGF0IGZ1bmN0aW9uXG4gKiByZXR1cm5zIGFuIE9ic2VydmFibGUsIGFuZCB0aGVuIG1lcmdpbmcgdGhvc2UgcmVzdWx0aW5nIE9ic2VydmFibGVzIGFuZFxuICogZW1pdHRpbmcgdGhlIHJlc3VsdHMgb2YgdGhpcyBtZXJnZXIuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGFuZCBmbGF0dGVuIGVhY2ggbGV0dGVyIHRvIGFuIE9ic2VydmFibGUgdGlja2luZyBldmVyeSAxIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbGV0dGVycyA9IG9mKCdhJywgJ2InLCAnYycpO1xuICogY29uc3QgcmVzdWx0ID0gbGV0dGVycy5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IGludGVydmFsKDEwMDApLnBpcGUobWFwKGkgPT4geCtpKSkpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gYTBcbiAqIC8vIGIwXG4gKiAvLyBjMFxuICogLy8gYTFcbiAqIC8vIGIxXG4gKiAvLyBjMVxuICogLy8gY29udGludWVzIHRvIGxpc3QgYSxiLGMgd2l0aCByZXNwZWN0aXZlIGFzY2VuZGluZyBpbnRlZ2Vyc1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdE1hcH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VBbGx9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsID9pbmRleDogbnVtYmVyKTogT2JzZXJ2YWJsZUlucHV0fSBwcm9qZWN0IEEgZnVuY3Rpb25cbiAqIHRoYXQsIHdoZW4gYXBwbGllZCB0byBhbiBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCByZXR1cm5zIGFuXG4gKiBPYnNlcnZhYmxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2YgaW5wdXRcbiAqIE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlXG4gKiBwcm9qZWN0aW9uIGZ1bmN0aW9uIChhbmQgdGhlIG9wdGlvbmFsIGRlcHJlY2F0ZWQgYHJlc3VsdFNlbGVjdG9yYCkgdG8gZWFjaCBpdGVtXG4gKiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhbmQgbWVyZ2luZyB0aGUgcmVzdWx0cyBvZiB0aGUgT2JzZXJ2YWJsZXNcbiAqIG9idGFpbmVkIGZyb20gdGhpcyB0cmFuc2Zvcm1hdGlvbi5cbiAqIEBtZXRob2QgbWVyZ2VNYXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcDxULCBJLCBSPihcbiAgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8ST4sXG4gIHJlc3VsdFNlbGVjdG9yPzogKChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBJLCBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcikgPT4gUikgfCBudW1iZXIsXG4gIGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWVxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBJfFI+IHtcbiAgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UucGlwZShcbiAgICAgIG1lcmdlTWFwKChhLCBpKSA9PiBmcm9tKHByb2plY3QoYSwgaSkpLnBpcGUoXG4gICAgICAgIG1hcCgoYiwgaWkpID0+IHJlc3VsdFNlbGVjdG9yKGEsIGIsIGksIGlpKSksXG4gICAgICApLCBjb25jdXJyZW50KVxuICAgICk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnbnVtYmVyJykge1xuICAgIGNvbmN1cnJlbnQgPSByZXN1bHRTZWxlY3RvcjtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IE1lcmdlTWFwT3BlcmF0b3IocHJvamVjdCwgY29uY3VycmVudCkpO1xufVxuXG5leHBvcnQgY2xhc3MgTWVyZ2VNYXBPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25jdXJyZW50OiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgfVxuXG4gIGNhbGwob2JzZXJ2ZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgTWVyZ2VNYXBTdWJzY3JpYmVyKFxuICAgICAgb2JzZXJ2ZXIsIHRoaXMucHJvamVjdCwgdGhpcy5jb25jdXJyZW50XG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBNZXJnZU1hcFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGJ1ZmZlcjogVFtdID0gW107XG4gIHByaXZhdGUgYWN0aXZlOiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlIDwgdGhpcy5jb25jdXJyZW50KSB7XG4gICAgICB0aGlzLl90cnlOZXh0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF90cnlOZXh0KHZhbHVlOiBUKSB7XG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFI+O1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByb2plY3QodmFsdWUsIGluZGV4KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUrKztcbiAgICB0aGlzLl9pbm5lclN1YihyZXN1bHQsIHZhbHVlLCBpbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9pbm5lclN1Yihpc2g6IE9ic2VydmFibGVJbnB1dDxSPiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmliZVRvUmVzdWx0PFQsIFI+KHRoaXMsIGlzaCwgdmFsdWUsIGluZGV4LCBpbm5lclN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSAwICYmIHRoaXMuYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICB0aGlzLnJlbW92ZShpbm5lclN1Yik7XG4gICAgdGhpcy5hY3RpdmUtLTtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX25leHQoYnVmZmVyLnNoaWZ0KCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmUgPT09IDAgJiYgdGhpcy5oYXNDb21wbGV0ZWQpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiIsIlxuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuL21lcmdlTWFwJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIE9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQWxsPFQ+KGNvbmN1cnJlbnQ/OiBudW1iZXIpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVD47XG5cbi8qKlxuICogQ29udmVydHMgYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSBpbnRvIGEgZmlyc3Qtb3JkZXIgT2JzZXJ2YWJsZSB3aGljaFxuICogY29uY3VycmVudGx5IGRlbGl2ZXJzIGFsbCB2YWx1ZXMgdGhhdCBhcmUgZW1pdHRlZCBvbiB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMuPC9zcGFuPlxuICpcbiAqICFbXShtZXJnZUFsbC5wbmcpXG4gKlxuICogYG1lcmdlQWxsYCBzdWJzY3JpYmVzIHRvIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBPYnNlcnZhYmxlcywgYWxzbyBrbm93biBhc1xuICogYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZS4gRWFjaCB0aW1lIGl0IG9ic2VydmVzIG9uZSBvZiB0aGVzZSBlbWl0dGVkIGlubmVyXG4gKiBPYnNlcnZhYmxlcywgaXQgc3Vic2NyaWJlcyB0byB0aGF0IGFuZCBkZWxpdmVycyBhbGwgdGhlIHZhbHVlcyBmcm9tIHRoZVxuICogaW5uZXIgT2JzZXJ2YWJsZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvbmx5XG4gKiBjb21wbGV0ZXMgb25jZSBhbGwgaW5uZXIgT2JzZXJ2YWJsZXMgaGF2ZSBjb21wbGV0ZWQuIEFueSBlcnJvciBkZWxpdmVyZWQgYnlcbiAqIGEgaW5uZXIgT2JzZXJ2YWJsZSB3aWxsIGJlIGltbWVkaWF0ZWx5IGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBTcGF3biBhIG5ldyBpbnRlcnZhbCBPYnNlcnZhYmxlIGZvciBlYWNoIGNsaWNrIGV2ZW50LCBhbmQgYmxlbmQgdGhlaXIgb3V0cHV0cyBhcyBvbmUgT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGhpZ2hlck9yZGVyID0gY2xpY2tzLnBpcGUobWFwKChldikgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIGNvbnN0IGZpcnN0T3JkZXIgPSBoaWdoZXJPcmRlci5waXBlKG1lcmdlQWxsKCkpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBDb3VudCBmcm9tIDAgdG8gOSBldmVyeSBzZWNvbmQgZm9yIGVhY2ggY2xpY2ssIGJ1dCBvbmx5IGFsbG93IDIgY29uY3VycmVudCB0aW1lcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKFxuICogICBtYXAoKGV2KSA9PiBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMTApKSksXG4gKiApO1xuICogY29uc3QgZmlyc3RPcmRlciA9IGhpZ2hlck9yZGVyLnBpcGUobWVyZ2VBbGwoMikpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lQWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0QWxsfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICogQHNlZSB7QGxpbmsgc3dpdGNoQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICogQHNlZSB7QGxpbmsgemlwQWxsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlubmVyXG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB2YWx1ZXMgY29taW5nIGZyb20gYWxsIHRoZVxuICogaW5uZXIgT2JzZXJ2YWJsZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIG1lcmdlQWxsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbGw8VD4oY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIG1lcmdlTWFwPFQsIFQ+KGlkZW50aXR5IGFzICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFQ+LCBjb25jdXJyZW50KTtcbn1cbiIsIlxuaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuL21lcmdlQWxsJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdEFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsPFI+KCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBSPjtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlIGludG8gYSBmaXJzdC1vcmRlciBPYnNlcnZhYmxlIGJ5XG4gKiBjb25jYXRlbmF0aW5nIHRoZSBpbm5lciBPYnNlcnZhYmxlcyBpbiBvcmRlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgYW4gT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcyBieSBwdXR0aW5nIG9uZVxuICogaW5uZXIgT2JzZXJ2YWJsZSBhZnRlciB0aGUgb3RoZXIuPC9zcGFuPlxuICpcbiAqICFbXShjb25jYXRBbGwucG5nKVxuICpcbiAqIEpvaW5zIGV2ZXJ5IE9ic2VydmFibGUgZW1pdHRlZCBieSB0aGUgc291cmNlIChhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlKSwgaW5cbiAqIGEgc2VyaWFsIGZhc2hpb24uIEl0IHN1YnNjcmliZXMgdG8gZWFjaCBpbm5lciBPYnNlcnZhYmxlIG9ubHkgYWZ0ZXIgdGhlXG4gKiBwcmV2aW91cyBpbm5lciBPYnNlcnZhYmxlIGhhcyBjb21wbGV0ZWQsIGFuZCBtZXJnZXMgYWxsIG9mIHRoZWlyIHZhbHVlcyBpbnRvXG4gKiB0aGUgcmV0dXJuZWQgb2JzZXJ2YWJsZS5cbiAqXG4gKiBfX1dhcm5pbmc6X18gSWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIE9ic2VydmFibGVzIHF1aWNrbHkgYW5kXG4gKiBlbmRsZXNzbHksIGFuZCB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMgaXQgZW1pdHMgZ2VuZXJhbGx5IGNvbXBsZXRlIHNsb3dlciB0aGFuXG4gKiB0aGUgc291cmNlIGVtaXRzLCB5b3UgY2FuIHJ1biBpbnRvIG1lbW9yeSBpc3N1ZXMgYXMgdGhlIGluY29taW5nIE9ic2VydmFibGVzXG4gKiBjb2xsZWN0IGluIGFuIHVuYm91bmRlZCBidWZmZXIuXG4gKlxuICogTm90ZTogYGNvbmNhdEFsbGAgaXMgZXF1aXZhbGVudCB0byBgbWVyZ2VBbGxgIHdpdGggY29uY3VycmVuY3kgcGFyYW1ldGVyIHNldFxuICogdG8gYDFgLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBGb3IgZWFjaCBjbGljayBldmVudCwgdGljayBldmVyeSBzZWNvbmQgZnJvbSAwIHRvIDMsIHdpdGggbm8gY29uY3VycmVuY3lcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKFxuICogICBtYXAoZXYgPT4gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDQpKSksXG4gKiApO1xuICogY29uc3QgZmlyc3RPcmRlciA9IGhpZ2hlck9yZGVyLnBpcGUoY29uY2F0QWxsKCkpO1xuICogZmlyc3RPcmRlci5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gKHJlc3VsdHMgYXJlIG5vdCBjb25jdXJyZW50KVxuICogLy8gRm9yIGV2ZXJ5IGNsaWNrIG9uIHRoZSBcImRvY3VtZW50XCIgaXQgd2lsbCBlbWl0IHZhbHVlcyAwIHRvIDMgc3BhY2VkXG4gKiAvLyBvbiBhIDEwMDBtcyBpbnRlcnZhbFxuICogLy8gb25lIGNsaWNrID0gMTAwMG1zLT4gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gMiAtMTAwMG1zLT4gM1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUFsbH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcFRvfVxuICogQHNlZSB7QGxpbmsgZXhoYXVzdH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoQWxsfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICogQHNlZSB7QGxpbmsgemlwQWxsfVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgZW1pdHRpbmcgdmFsdWVzIGZyb20gYWxsIHRoZSBpbm5lclxuICogT2JzZXJ2YWJsZXMgY29uY2F0ZW5hdGVkLlxuICogQG1ldGhvZCBjb25jYXRBbGxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+IHtcbiAgcmV0dXJuIG1lcmdlQWxsPFQ+KDEpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vZic7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGNvbmNhdEFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9jb25jYXRBbGwnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8VD4gfCBTY2hlZHVsZXJMaWtlKVtdKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2UpW10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKlxuICogQ3JlYXRlcyBhbiBvdXRwdXQgT2JzZXJ2YWJsZSB3aGljaCBzZXF1ZW50aWFsbHkgZW1pdHMgYWxsIHZhbHVlcyBmcm9tIGdpdmVuXG4gKiBPYnNlcnZhYmxlIGFuZCB0aGVuIG1vdmVzIG9uIHRvIHRoZSBuZXh0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db25jYXRlbmF0ZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIgYnlcbiAqIHNlcXVlbnRpYWxseSBlbWl0dGluZyB0aGVpciB2YWx1ZXMsIG9uZSBPYnNlcnZhYmxlIGFmdGVyIHRoZSBvdGhlci48L3NwYW4+XG4gKlxuICogIVtdKGNvbmNhdC5wbmcpXG4gKlxuICogYGNvbmNhdGAgam9pbnMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIsIGJ5IHN1YnNjcmliaW5nIHRvIHRoZW0gb25lIGF0IGEgdGltZSBhbmRcbiAqIG1lcmdpbmcgdGhlaXIgcmVzdWx0cyBpbnRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gWW91IGNhbiBwYXNzIGVpdGhlciBhbiBhcnJheSBvZlxuICogT2JzZXJ2YWJsZXMsIG9yIHB1dCB0aGVtIGRpcmVjdGx5IGFzIGFyZ3VtZW50cy4gUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIHJlc3VsdFxuICogaW4gT2JzZXJ2YWJsZSB0aGF0IGNvbXBsZXRlcyBpbW1lZGlhdGVseS5cbiAqXG4gKiBgY29uY2F0YCB3aWxsIHN1YnNjcmliZSB0byBmaXJzdCBpbnB1dCBPYnNlcnZhYmxlIGFuZCBlbWl0IGFsbCBpdHMgdmFsdWVzLCB3aXRob3V0XG4gKiBjaGFuZ2luZyBvciBhZmZlY3RpbmcgdGhlbSBpbiBhbnkgd2F5LiBXaGVuIHRoYXQgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsIGl0IHdpbGxcbiAqIHN1YnNjcmliZSB0byB0aGVuIG5leHQgT2JzZXJ2YWJsZSBwYXNzZWQgYW5kLCBhZ2FpbiwgZW1pdCBpdHMgdmFsdWVzLiBUaGlzIHdpbGwgYmVcbiAqIHJlcGVhdGVkLCB1bnRpbCB0aGUgb3BlcmF0b3IgcnVucyBvdXQgb2YgT2JzZXJ2YWJsZXMuIFdoZW4gbGFzdCBpbnB1dCBPYnNlcnZhYmxlIGNvbXBsZXRlcyxcbiAqIGBjb25jYXRgIHdpbGwgY29tcGxldGUgYXMgd2VsbC4gQXQgYW55IGdpdmVuIG1vbWVudCBvbmx5IG9uZSBPYnNlcnZhYmxlIHBhc3NlZCB0byBvcGVyYXRvclxuICogZW1pdHMgdmFsdWVzLiBJZiB5b3Ugd291bGQgbGlrZSB0byBlbWl0IHZhbHVlcyBmcm9tIHBhc3NlZCBPYnNlcnZhYmxlcyBjb25jdXJyZW50bHksIGNoZWNrIG91dFxuICoge0BsaW5rIG1lcmdlfSBpbnN0ZWFkLCBlc3BlY2lhbGx5IHdpdGggb3B0aW9uYWwgYGNvbmN1cnJlbnRgIHBhcmFtZXRlci4gQXMgYSBtYXR0ZXIgb2YgZmFjdCxcbiAqIGBjb25jYXRgIGlzIGFuIGVxdWl2YWxlbnQgb2YgYG1lcmdlYCBvcGVyYXRvciB3aXRoIGBjb25jdXJyZW50YCBwYXJhbWV0ZXIgc2V0IHRvIGAxYC5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgc29tZSBpbnB1dCBPYnNlcnZhYmxlIG5ldmVyIGNvbXBsZXRlcywgYGNvbmNhdGAgd2lsbCBhbHNvIG5ldmVyIGNvbXBsZXRlXG4gKiBhbmQgT2JzZXJ2YWJsZXMgZm9sbG93aW5nIHRoZSBvbmUgdGhhdCBkaWQgbm90IGNvbXBsZXRlIHdpbGwgbmV2ZXIgYmUgc3Vic2NyaWJlZC4gT24gdGhlIG90aGVyXG4gKiBoYW5kLCBpZiBzb21lIE9ic2VydmFibGUgc2ltcGx5IGNvbXBsZXRlcyBpbW1lZGlhdGVseSBhZnRlciBpdCBpcyBzdWJzY3JpYmVkLCBpdCB3aWxsIGJlXG4gKiBpbnZpc2libGUgZm9yIGBjb25jYXRgLCB3aGljaCB3aWxsIGp1c3QgbW92ZSBvbiB0byB0aGUgbmV4dCBPYnNlcnZhYmxlLlxuICpcbiAqIElmIGFueSBPYnNlcnZhYmxlIGluIGNoYWluIGVycm9ycywgaW5zdGVhZCBvZiBwYXNzaW5nIGNvbnRyb2wgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSxcbiAqIGBjb25jYXRgIHdpbGwgZXJyb3IgaW1tZWRpYXRlbHkgYXMgd2VsbC4gT2JzZXJ2YWJsZXMgdGhhdCB3b3VsZCBiZSBzdWJzY3JpYmVkIGFmdGVyXG4gKiB0aGUgb25lIHRoYXQgZW1pdHRlZCBlcnJvciwgbmV2ZXIgd2lsbC5cbiAqXG4gKiBJZiB5b3UgcGFzcyB0byBgY29uY2F0YCB0aGUgc2FtZSBPYnNlcnZhYmxlIG1hbnkgdGltZXMsIGl0cyBzdHJlYW0gb2YgdmFsdWVzXG4gKiB3aWxsIGJlIFwicmVwbGF5ZWRcIiBvbiBldmVyeSBzdWJzY3JpcHRpb24sIHdoaWNoIG1lYW5zIHlvdSBjYW4gcmVwZWF0IGdpdmVuIE9ic2VydmFibGVcbiAqIGFzIG1hbnkgdGltZXMgYXMgeW91IGxpa2UuIElmIHBhc3NpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byBgY29uY2F0YCAxMDAwIHRpbWVzIGJlY29tZXMgdGVkaW91cyxcbiAqIHlvdSBjYW4gYWx3YXlzIHVzZSB7QGxpbmsgcmVwZWF0fS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbmNhdGVuYXRlIGEgdGltZXIgY291bnRpbmcgZnJvbSAwIHRvIDMgd2l0aCBhIHN5bmNocm9ub3VzIHNlcXVlbmNlIGZyb20gMSB0byAxMFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoNCkpO1xuICogY29uc3Qgc2VxdWVuY2UgPSByYW5nZSgxLCAxMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQodGltZXIsIHNlcXVlbmNlKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gcmVzdWx0cyBpbjpcbiAqIC8vIDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IDIgLTEwMDBtcy0+IDMgLWltbWVkaWF0ZS0+IDEgLi4uIDEwXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgYW4gYXJyYXkgb2YgMyBPYnNlcnZhYmxlc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIxID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCB0aW1lcjIgPSBpbnRlcnZhbCgyMDAwKS5waXBlKHRha2UoNikpO1xuICogY29uc3QgdGltZXIzID0gaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdChbdGltZXIxLCB0aW1lcjIsIHRpbWVyM10pOyAvLyBub3RlIHRoYXQgYXJyYXkgaXMgcGFzc2VkXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIChQcmludHMgdG8gY29uc29sZSBzZXF1ZW50aWFsbHkpXG4gKiAvLyAtMTAwMG1zLT4gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gLi4uIDlcbiAqIC8vIC0yMDAwbXMtPiAwIC0yMDAwbXMtPiAxIC0yMDAwbXMtPiAuLi4gNVxuICogLy8gLTUwMG1zLT4gMCAtNTAwbXMtPiAxIC01MDBtcy0+IC4uLiA5XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byByZXBlYXQgaXRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDIpKTtcbiAqICpcbiAqIGNvbmNhdCh0aW1lciwgdGltZXIpIC8vIGNvbmNhdGVuYXRpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSFcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnLi4uYW5kIGl0IGlzIGRvbmUhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDAgYWZ0ZXIgMXNcbiAqIC8vIDEgYWZ0ZXIgMnNcbiAqIC8vIDAgYWZ0ZXIgM3NcbiAqIC8vIDEgYWZ0ZXIgNHNcbiAqIC8vIFwiLi4uYW5kIGl0IGlzIGRvbmUhXCIgYWxzbyBhZnRlciA0c1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0QWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwVG99XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MSBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MiBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnQuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9bnVsbF0gQW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHNjaGVkdWxlIGVhY2hcbiAqIE9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQWxsIHZhbHVlcyBvZiBlYWNoIHBhc3NlZCBPYnNlcnZhYmxlIG1lcmdlZCBpbnRvIGFcbiAqIHNpbmdsZSBPYnNlcnZhYmxlLCBpbiBvcmRlciwgaW4gc2VyaWFsIGZhc2hpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGNvbmNhdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj4ge1xuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxIHx8IChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDIgJiYgaXNTY2hlZHVsZXIob2JzZXJ2YWJsZXNbMV0pKSkge1xuICAgIHJldHVybiBmcm9tKDxhbnk+b2JzZXJ2YWJsZXNbMF0pO1xuICB9XG4gIHJldHVybiBjb25jYXRBbGw8Uj4oKShvZiguLi5vYnNlcnZhYmxlcykpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7IC8vIGxvbFxuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCwgb24gc3Vic2NyaWJlLCBjYWxscyBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgdG9cbiAqIG1ha2UgYW4gT2JzZXJ2YWJsZSBmb3IgZWFjaCBuZXcgT2JzZXJ2ZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZXMgdGhlIE9ic2VydmFibGUgbGF6aWx5LCB0aGF0IGlzLCBvbmx5IHdoZW4gaXRcbiAqIGlzIHN1YnNjcmliZWQuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGRlZmVyLnBuZylcbiAqXG4gKiBgZGVmZXJgIGFsbG93cyB5b3UgdG8gY3JlYXRlIHRoZSBPYnNlcnZhYmxlIG9ubHkgd2hlbiB0aGUgT2JzZXJ2ZXJcbiAqIHN1YnNjcmliZXMsIGFuZCBjcmVhdGUgYSBmcmVzaCBPYnNlcnZhYmxlIGZvciBlYWNoIE9ic2VydmVyLiBJdCB3YWl0cyB1bnRpbFxuICogYW4gT2JzZXJ2ZXIgc3Vic2NyaWJlcyB0byBpdCwgYW5kIHRoZW4gaXQgZ2VuZXJhdGVzIGFuIE9ic2VydmFibGUsXG4gKiB0eXBpY2FsbHkgd2l0aCBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uIEl0IGRvZXMgdGhpcyBhZnJlc2ggZm9yIGVhY2hcbiAqIHN1YnNjcmliZXIsIHNvIGFsdGhvdWdoIGVhY2ggc3Vic2NyaWJlciBtYXkgdGhpbmsgaXQgaXMgc3Vic2NyaWJpbmcgdG8gdGhlXG4gKiBzYW1lIE9ic2VydmFibGUsIGluIGZhY3QgZWFjaCBzdWJzY3JpYmVyIGdldHMgaXRzIG93biBpbmRpdmlkdWFsXG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBTdWJzY3JpYmUgdG8gZWl0aGVyIGFuIE9ic2VydmFibGUgb2YgY2xpY2tzIG9yIGFuIE9ic2VydmFibGUgb2YgaW50ZXJ2YWwsIGF0IHJhbmRvbVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzT3JJbnRlcnZhbCA9IGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAqICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjVcbiAqICAgICA/IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJylcbiAqICAgICA6IGludGVydmFsKDEwMDApO1xuICogfSk7XG4gKiBjbGlja3NPckludGVydmFsLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3I6XG4gKiAvLyBJZiB0aGUgcmVzdWx0IG9mIE1hdGgucmFuZG9tKCkgaXMgZ3JlYXRlciB0aGFuIDAuNSBpdCB3aWxsIGxpc3RlblxuICogLy8gZm9yIGNsaWNrcyBhbnl3aGVyZSBvbiB0aGUgXCJkb2N1bWVudFwiOyB3aGVuIGRvY3VtZW50IGlzIGNsaWNrZWQgaXRcbiAqIC8vIHdpbGwgbG9nIGEgTW91c2VFdmVudCBvYmplY3QgdG8gdGhlIGNvbnNvbGUuIElmIHRoZSByZXN1bHQgaXMgbGVzc1xuICogLy8gdGhhbiAwLjUgaXQgd2lsbCBlbWl0IGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykuXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBvYnNlcnZhYmxlRmFjdG9yeSBUaGUgT2JzZXJ2YWJsZVxuICogZmFjdG9yeSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggT2JzZXJ2ZXIgdGhhdCBzdWJzY3JpYmVzIHRvIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIE1heSBhbHNvIHJldHVybiBhIFByb21pc2UsIHdoaWNoIHdpbGwgYmUgY29udmVydGVkIG9uIHRoZSBmbHlcbiAqIHRvIGFuIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHdob3NlIE9ic2VydmVycycgc3Vic2NyaXB0aW9ucyB0cmlnZ2VyXG4gKiBhbiBpbnZvY2F0aW9uIG9mIHRoZSBnaXZlbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGRlZmVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmZXI8VD4ob2JzZXJ2YWJsZUZhY3Rvcnk6ICgpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiB8IHZvaWQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbnB1dDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+IHwgdm9pZDtcbiAgICB0cnkge1xuICAgICAgaW5wdXQgPSBvYnNlcnZhYmxlRmFjdG9yeSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlID0gaW5wdXQgPyBmcm9tKGlucHV0KSA6IGVtcHR5KCk7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH0pO1xufSIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8vIGZvcmtKb2luKFthJCwgYiQsIGMkXSk7XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPl0pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDI+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj5dKTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDM+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUND4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDU+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT4sIE9ic2VydmFibGVJbnB1dDxUNj5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik6IE9ic2VydmFibGU8VFtdPjtcblxuLy8gZm9ya0pvaW4oYSQsIGIkLCBjJClcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+KTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPik6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIGRlcHJlY2F0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbiguLi5hcmdzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PnxGdW5jdGlvbj4pOiBPYnNlcnZhYmxlPGFueT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oLi4uc291cmNlczogT2JzZXJ2YWJsZUlucHV0PFQ+W10pOiBPYnNlcnZhYmxlPFRbXT47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEpvaW5zIGxhc3QgdmFsdWVzIGVtaXR0ZWQgYnkgcGFzc2VkIE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XYWl0IGZvciBPYnNlcnZhYmxlcyB0byBjb21wbGV0ZSBhbmQgdGhlbiBjb21iaW5lIGxhc3QgdmFsdWVzIHRoZXkgZW1pdHRlZC48L3NwYW4+XG4gKlxuICogIVtdKGZvcmtKb2luLnBuZylcbiAqXG4gKiBgZm9ya0pvaW5gIGlzIGFuIG9wZXJhdG9yIHRoYXQgdGFrZXMgYW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyB3aGljaCBjYW4gYmUgcGFzc2VkIGVpdGhlciBhcyBhbiBhcnJheVxuICogb3IgZGlyZWN0bHkgYXMgYXJndW1lbnRzLiBJZiBubyBpbnB1dCBPYnNlcnZhYmxlcyBhcmUgcHJvdmlkZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBjb21wbGV0ZVxuICogaW1tZWRpYXRlbHkuXG4gKlxuICogYGZvcmtKb2luYCB3aWxsIHdhaXQgZm9yIGFsbCBwYXNzZWQgT2JzZXJ2YWJsZXMgdG8gY29tcGxldGUgYW5kIHRoZW4gaXQgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggbGFzdFxuICogdmFsdWVzIGZyb20gY29ycmVzcG9uZGluZyBPYnNlcnZhYmxlcy4gU28gaWYgeW91IHBhc3MgYG5gIE9ic2VydmFibGVzIHRvIHRoZSBvcGVyYXRvciwgcmVzdWx0aW5nXG4gKiBhcnJheSB3aWxsIGhhdmUgYG5gIHZhbHVlcywgd2hlcmUgZmlyc3QgdmFsdWUgaXMgdGhlIGxhc3QgdGhpbmcgZW1pdHRlZCBieSB0aGUgZmlyc3QgT2JzZXJ2YWJsZSxcbiAqIHNlY29uZCB2YWx1ZSBpcyB0aGUgbGFzdCB0aGluZyBlbWl0dGVkIGJ5IHRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBhbmQgc28gb24uIFRoYXQgbWVhbnMgYGZvcmtKb2luYCB3aWxsXG4gKiBub3QgZW1pdCBtb3JlIHRoYW4gb25jZSBhbmQgaXQgd2lsbCBjb21wbGV0ZSBhZnRlciB0aGF0LiBJZiB5b3UgbmVlZCB0byBlbWl0IGNvbWJpbmVkIHZhbHVlcyBub3Qgb25seVxuICogYXQgdGhlIGVuZCBvZiBsaWZlY3ljbGUgb2YgcGFzc2VkIE9ic2VydmFibGVzLCBidXQgYWxzbyB0aHJvdWdob3V0IGl0LCB0cnkgb3V0IHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogb3Ige0BsaW5rIHppcH0gaW5zdGVhZC5cbiAqXG4gKiBJbiBvcmRlciBmb3IgcmVzdWx0aW5nIGFycmF5IHRvIGhhdmUgdGhlIHNhbWUgbGVuZ3RoIGFzIHRoZSBudW1iZXIgb2YgaW5wdXQgT2JzZXJ2YWJsZXMsIHdoZW5ldmVyIGFueSBvZlxuICogdGhhdCBPYnNlcnZhYmxlcyBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhbnkgdmFsdWUsIGBmb3JrSm9pbmAgd2lsbCBjb21wbGV0ZSBhdCB0aGF0IG1vbWVudCBhcyB3ZWxsXG4gKiBhbmQgaXQgd2lsbCBub3QgZW1pdCBhbnl0aGluZyBlaXRoZXIsIGV2ZW4gaWYgaXQgYWxyZWFkeSBoYXMgc29tZSBsYXN0IHZhbHVlcyBmcm9tIG90aGVyIE9ic2VydmFibGVzLlxuICogQ29udmVyc2VseSwgaWYgdGhlcmUgaXMgYW4gT2JzZXJ2YWJsZSB0aGF0IG5ldmVyIGNvbXBsZXRlcywgYGZvcmtKb2luYCB3aWxsIG5ldmVyIGNvbXBsZXRlIGFzIHdlbGwsXG4gKiB1bmxlc3MgYXQgYW55IHBvaW50IHNvbWUgb3RoZXIgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyB2YWx1ZSwgd2hpY2ggYnJpbmdzIHVzIGJhY2sgdG9cbiAqIHRoZSBwcmV2aW91cyBjYXNlLiBPdmVyYWxsLCBpbiBvcmRlciBmb3IgYGZvcmtKb2luYCB0byBlbWl0IGEgdmFsdWUsIGFsbCBPYnNlcnZhYmxlcyBwYXNzZWQgYXMgYXJndW1lbnRzXG4gKiBoYXZlIHRvIGVtaXQgc29tZXRoaW5nIGF0IGxlYXN0IG9uY2UgYW5kIGNvbXBsZXRlLlxuICpcbiAqIElmIGFueSBpbnB1dCBPYnNlcnZhYmxlIGVycm9ycyBhdCBzb21lIHBvaW50LCBgZm9ya0pvaW5gIHdpbGwgZXJyb3IgYXMgd2VsbCBhbmQgYWxsIG90aGVyIE9ic2VydmFibGVzXG4gKiB3aWxsIGJlIGltbWVkaWF0ZWx5IHVuc3Vic2NyaWJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IGBmb3JrSm9pbmAgYWNjZXB0cyBwcm9qZWN0IGZ1bmN0aW9uLCB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggdmFsdWVzIHdoaWNoIG5vcm1hbGx5XG4gKiB3b3VsZCBsYW5kIGluIGVtaXR0ZWQgYXJyYXkuIFdoYXRldmVyIGlzIHJldHVybmVkIGJ5IHByb2plY3QgZnVuY3Rpb24sIHdpbGwgYXBwZWFyIGluIG91dHB1dFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkLiBUaGlzIG1lYW5zIHRoYXQgZGVmYXVsdCBwcm9qZWN0IGNhbiBiZSB0aG91Z2h0IG9mIGFzIGEgZnVuY3Rpb24gdGhhdCB0YWtlc1xuICogYWxsIGl0cyBhcmd1bWVudHMgYW5kIHB1dHMgdGhlbSBpbnRvIGFuIGFycmF5LiBOb3RlIHRoYXQgcHJvamVjdCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbmx5XG4gKiB3aGVuIG91dHB1dCBPYnNlcnZhYmxlIGlzIHN1cHBvc2VkIHRvIGVtaXQgYSByZXN1bHQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBvcGVyYXRvciBlbWl0dGluZyBpbW1lZGlhdGVseVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBvZigxLCAyLCAzLCA0KSxcbiAqICAgb2YoNSwgNiwgNywgOCksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFs0LCA4XVxuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggb3BlcmF0b3IgZW1pdHRpbmcgYWZ0ZXIgc29tZSB0aW1lXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMykpLCAvLyBlbWl0IDAsIDEsIDIgZXZlcnkgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogICBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSg0KSksICAvLyBlbWl0IDAsIDEsIDIsIDMgZXZlcnkgaGFsZiBhIHNlY29uZCBhbmQgY29tcGxldGVcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gWzIsIDNdIGFmdGVyIDMgc2Vjb25kc1xuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggcHJvamVjdCBmdW5jdGlvblxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDMpKSwgLy8gZW1pdCAwLCAxLCAyIGV2ZXJ5IHNlY29uZCBhbmQgY29tcGxldGVcbiAqICAgaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoNCkpLCAgLy8gZW1pdCAwLCAxLCAyLCAzIGV2ZXJ5IGhhbGYgYSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiApLnBpcGUoXG4gKiAgIG1hcCgoW24sIG1dKSA9PiBuICsgbSksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDUgYWZ0ZXIgMyBzZWNvbmRzXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCIgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayB6aXB9XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IHNvdXJjZXMgQW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyBwcm92aWRlZCBlaXRoZXIgYXMgYW4gYXJyYXkgb3IgYXMgYW4gYXJndW1lbnRzXG4gKiBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIG9wZXJhdG9yLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Byb2plY3RdIEZ1bmN0aW9uIHRoYXQgdGFrZXMgdmFsdWVzIGVtaXR0ZWQgYnkgaW5wdXQgT2JzZXJ2YWJsZXMgYW5kIHJldHVybnMgdmFsdWVcbiAqIHRoYXQgd2lsbCBhcHBlYXIgaW4gcmVzdWx0aW5nIE9ic2VydmFibGUgaW5zdGVhZCBvZiBkZWZhdWx0IGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gT2JzZXJ2YWJsZSBlbWl0dGluZyBlaXRoZXIgYW4gYXJyYXkgb2YgbGFzdCB2YWx1ZXMgZW1pdHRlZCBieSBwYXNzZWQgT2JzZXJ2YWJsZXNcbiAqIG9yIHZhbHVlIGZyb20gcHJvamVjdCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KFxuICAuLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCBPYnNlcnZhYmxlSW5wdXQ8VD5bXSB8IEZ1bmN0aW9uPlxuKTogT2JzZXJ2YWJsZTxUW10+IHtcblxuICBsZXQgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uO1xuICBpZiAodHlwZW9mIHNvdXJjZXNbc291cmNlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJlc3VsdFNlbGVjdG9yID0gc291cmNlcy5wb3AoKSBhcyBGdW5jdGlvbjtcbiAgfVxuXG4gIC8vIGlmIHRoZSBmaXJzdCBhbmQgb25seSBvdGhlciBhcmd1bWVudCBpcyBhbiBhcnJheVxuICAvLyBhc3N1bWUgaXQncyBiZWVuIGNhbGxlZCB3aXRoIGBmb3JrSm9pbihbb2JzMSwgb2JzMiwgb2JzM10pYFxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShzb3VyY2VzWzBdKSkge1xuICAgIHNvdXJjZXMgPSBzb3VyY2VzWzBdIGFzIEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj47XG4gIH1cblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZm9ya0pvaW4oc291cmNlcykucGlwZShcbiAgICAgIG1hcChhcmdzID0+IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgcmV0dXJuIG5ldyBGb3JrSm9pblN1YnNjcmliZXIoc3Vic2NyaWJlciwgc291cmNlcyBhcyBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTtcbiAgfSk7XG59XG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRm9ya0pvaW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSBjb21wbGV0ZWQgPSAwO1xuICBwcml2YXRlIHZhbHVlczogVFtdO1xuICBwcml2YXRlIGhhdmVWYWx1ZXMgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG5cbiAgICBjb25zdCBsZW4gPSBzb3VyY2VzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3Qgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgIGNvbnN0IGlubmVyU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgc291cmNlLCBudWxsLCBpKTtcblxuICAgICAgaWYgKGlubmVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogVCxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNbb3V0ZXJJbmRleF0gPSBpbm5lclZhbHVlO1xuICAgIGlmICghKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlKSB7XG4gICAgICAoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUgPSB0cnVlO1xuICAgICAgdGhpcy5oYXZlVmFsdWVzKys7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24sIGhhdmVWYWx1ZXMsIHZhbHVlcyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSB2YWx1ZXMubGVuZ3RoO1xuXG4gICAgaWYgKCEoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb21wbGV0ZWQrKztcblxuICAgIGlmICh0aGlzLmNvbXBsZXRlZCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGhhdmVWYWx1ZXMgPT09IGxlbikge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZXMpO1xuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcblxuY29uc3QgdG9TdHJpbmc6IEZ1bmN0aW9uID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlU3R5bGVFdmVudEVtaXR0ZXIge1xuICBhZGRMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nIHwgc3ltYm9sLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB0aGlzO1xuICByZW1vdmVMaXN0ZW5lcjogKGV2ZW50TmFtZTogc3RyaW5nIHwgc3ltYm9sLCBoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiB0aGlzO1xufVxuXG5leHBvcnQgdHlwZSBOb2RlRXZlbnRIYW5kbGVyID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG4vLyBGb3IgQVBJcyB0aGF0IGltcGxlbWVudCBgYWRkTGlzdGVuZXJgIGFuZCBgcmVtb3ZlTGlzdGVuZXJgIG1ldGhvZHMgdGhhdCBtYXlcbi8vIG5vdCB1c2UgdGhlIHNhbWUgYXJndW1lbnRzIG9yIHJldHVybiBFdmVudEVtaXR0ZXIgdmFsdWVzXG4vLyBzdWNoIGFzIFJlYWN0IE5hdGl2ZVxuZXhwb3J0IGludGVyZmFjZSBOb2RlQ29tcGF0aWJsZUV2ZW50RW1pdHRlciB7XG4gIGFkZExpc3RlbmVyOiAoZXZlbnROYW1lOiBzdHJpbmcsIGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IHZvaWQgfCB7fTtcbiAgcmVtb3ZlTGlzdGVuZXI6IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlcikgPT4gdm9pZCB8IHt9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEpRdWVyeVN0eWxlRXZlbnRFbWl0dGVyIHtcbiAgb246IChldmVudE5hbWU6IHN0cmluZywgaGFuZGxlcjogRnVuY3Rpb24pID0+IHZvaWQ7XG4gIG9mZjogKGV2ZW50TmFtZTogc3RyaW5nLCBoYW5kbGVyOiBGdW5jdGlvbikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxFPiB7XG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogKChldnQ6IEUpID0+IHZvaWQpIHwgbnVsbCwgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcj86ICgoZXZ0OiBFKSA9PiB2b2lkKSB8IG51bGwsIG9wdGlvbnM/OiBFdmVudExpc3RlbmVyT3B0aW9ucyB8IGJvb2xlYW4pOiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBFdmVudFRhcmdldExpa2U8VD4gPSBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxUPiB8IE5vZGVTdHlsZUV2ZW50RW1pdHRlciB8IE5vZGVDb21wYXRpYmxlRXZlbnRFbWl0dGVyIHwgSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXI7XG5cbmV4cG9ydCB0eXBlIEZyb21FdmVudFRhcmdldDxUPiA9IEV2ZW50VGFyZ2V0TGlrZTxUPiB8IEFycmF5TGlrZTxFdmVudFRhcmdldExpa2U8VD4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TGlzdGVuZXJPcHRpb25zIHtcbiAgY2FwdHVyZT86IGJvb2xlYW47XG4gIHBhc3NpdmU/OiBib29sZWFuO1xuICBvbmNlPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyBleHRlbmRzIEV2ZW50TGlzdGVuZXJPcHRpb25zIHtcbiAgb25jZT86IGJvb2xlYW47XG4gIHBhc3NpdmU/OiBib29sZWFuO1xufVxuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZywgcmVzdWx0U2VsZWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50PFQ+KHRhcmdldDogRnJvbUV2ZW50VGFyZ2V0PFQ+LCBldmVudE5hbWU6IHN0cmluZywgb3B0aW9uczogRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnQ8VD4odGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sIGV2ZW50TmFtZTogc3RyaW5nLCBvcHRpb25zOiBFdmVudExpc3RlbmVyT3B0aW9ucywgcmVzdWx0U2VsZWN0b3I6ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGV2ZW50cyBvZiBhIHNwZWNpZmljIHR5cGUgY29taW5nIGZyb20gdGhlXG4gKiBnaXZlbiBldmVudCB0YXJnZXQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBmcm9tIERPTSBldmVudHMsIG9yIE5vZGUuanNcbiAqIEV2ZW50RW1pdHRlciBldmVudHMgb3Igb3RoZXJzLjwvc3Bhbj5cbiAqXG4gKiAhW10oZnJvbUV2ZW50LnBuZylcbiAqXG4gKiBgZnJvbUV2ZW50YCBhY2NlcHRzIGFzIGEgZmlyc3QgYXJndW1lbnQgZXZlbnQgdGFyZ2V0LCB3aGljaCBpcyBhbiBvYmplY3Qgd2l0aCBtZXRob2RzXG4gKiBmb3IgcmVnaXN0ZXJpbmcgZXZlbnQgaGFuZGxlciBmdW5jdGlvbnMuIEFzIGEgc2Vjb25kIGFyZ3VtZW50IGl0IHRha2VzIHN0cmluZyB0aGF0IGluZGljYXRlc1xuICogdHlwZSBvZiBldmVudCB3ZSB3YW50IHRvIGxpc3RlbiBmb3IuIGBmcm9tRXZlbnRgIHN1cHBvcnRzIHNlbGVjdGVkIHR5cGVzIG9mIGV2ZW50IHRhcmdldHMsXG4gKiB3aGljaCBhcmUgZGVzY3JpYmVkIGluIGRldGFpbCBiZWxvdy4gSWYgeW91ciBldmVudCB0YXJnZXQgZG9lcyBub3QgbWF0Y2ggYW55IG9mIHRoZSBvbmVzIGxpc3RlZCxcbiAqIHlvdSBzaG91bGQgdXNlIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSwgd2hpY2ggY2FuIGJlIHVzZWQgb24gYXJiaXRyYXJ5IEFQSXMuXG4gKiBXaGVuIGl0IGNvbWVzIHRvIEFQSXMgc3VwcG9ydGVkIGJ5IGBmcm9tRXZlbnRgLCB0aGVpciBtZXRob2RzIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGV2ZW50XG4gKiBoYW5kbGVyIGZ1bmN0aW9ucyBoYXZlIGRpZmZlcmVudCBuYW1lcywgYnV0IHRoZXkgYWxsIGFjY2VwdCBhIHN0cmluZyBkZXNjcmliaW5nIGV2ZW50IHR5cGVcbiAqIGFuZCBmdW5jdGlvbiBpdHNlbGYsIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIHNhaWQgZXZlbnQgaGFwcGVucy5cbiAqXG4gKiBFdmVyeSB0aW1lIHJlc3VsdGluZyBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQsIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gd2lsbCBiZSByZWdpc3RlcmVkXG4gKiB0byBldmVudCB0YXJnZXQgb24gZ2l2ZW4gZXZlbnQgdHlwZS4gV2hlbiB0aGF0IGV2ZW50IGZpcmVzLCB2YWx1ZVxuICogcGFzc2VkIGFzIGEgZmlyc3QgYXJndW1lbnQgdG8gcmVnaXN0ZXJlZCBmdW5jdGlvbiB3aWxsIGJlIGVtaXR0ZWQgYnkgb3V0cHV0IE9ic2VydmFibGUuXG4gKiBXaGVuIE9ic2VydmFibGUgaXMgdW5zdWJzY3JpYmVkLCBmdW5jdGlvbiB3aWxsIGJlIHVucmVnaXN0ZXJlZCBmcm9tIGV2ZW50IHRhcmdldC5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgZXZlbnQgdGFyZ2V0IGNhbGxzIHJlZ2lzdGVyZWQgZnVuY3Rpb24gd2l0aCBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBzZWNvbmRcbiAqIGFuZCBmb2xsb3dpbmcgYXJndW1lbnRzIHdpbGwgbm90IGFwcGVhciBpbiByZXN1bHRpbmcgc3RyZWFtLiBJbiBvcmRlciB0byBnZXQgYWNjZXNzIHRvIHRoZW0sXG4gKiB5b3UgY2FuIHBhc3MgdG8gYGZyb21FdmVudGAgb3B0aW9uYWwgcHJvamVjdCBmdW5jdGlvbiwgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBhbGwgYXJndW1lbnRzXG4gKiBwYXNzZWQgdG8gZXZlbnQgaGFuZGxlci4gT3V0cHV0IE9ic2VydmFibGUgd2lsbCB0aGVuIGVtaXQgdmFsdWUgcmV0dXJuZWQgYnkgcHJvamVjdCBmdW5jdGlvbixcbiAqIGluc3RlYWQgb2YgdGhlIHVzdWFsIHZhbHVlLlxuICpcbiAqIFJlbWVtYmVyIHRoYXQgZXZlbnQgdGFyZ2V0cyBsaXN0ZWQgYmVsb3cgYXJlIGNoZWNrZWQgdmlhIGR1Y2sgdHlwaW5nLiBJdCBtZWFucyB0aGF0XG4gKiBubyBtYXR0ZXIgd2hhdCBraW5kIG9mIG9iamVjdCB5b3UgaGF2ZSBhbmQgbm8gbWF0dGVyIHdoYXQgZW52aXJvbm1lbnQgeW91IHdvcmsgaW4sXG4gKiB5b3UgY2FuIHNhZmVseSB1c2UgYGZyb21FdmVudGAgb24gdGhhdCBvYmplY3QgaWYgaXQgZXhwb3NlcyBkZXNjcmliZWQgbWV0aG9kcyAocHJvdmlkZWRcbiAqIG9mIGNvdXJzZSB0aGV5IGJlaGF2ZSBhcyB3YXMgZGVzY3JpYmVkIGFib3ZlKS4gU28gZm9yIGV4YW1wbGUgaWYgTm9kZS5qcyBsaWJyYXJ5IGV4cG9zZXNcbiAqIGV2ZW50IHRhcmdldCB3aGljaCBoYXMgdGhlIHNhbWUgbWV0aG9kIG5hbWVzIGFzIERPTSBFdmVudFRhcmdldCwgYGZyb21FdmVudGAgaXMgc3RpbGxcbiAqIGEgZ29vZCBjaG9pY2UuXG4gKlxuICogSWYgdGhlIEFQSSB5b3UgdXNlIGlzIG1vcmUgY2FsbGJhY2sgdGhlbiBldmVudCBoYW5kbGVyIG9yaWVudGVkIChzdWJzY3JpYmVkXG4gKiBjYWxsYmFjayBmdW5jdGlvbiBmaXJlcyBvbmx5IG9uY2UgYW5kIHRodXMgdGhlcmUgaXMgbm8gbmVlZCB0byBtYW51YWxseVxuICogdW5yZWdpc3RlciBpdCksIHlvdSBzaG91bGQgdXNlIHtAbGluayBiaW5kQ2FsbGJhY2t9IG9yIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogaW5zdGVhZC5cbiAqXG4gKiBgZnJvbUV2ZW50YCBzdXBwb3J0cyBmb2xsb3dpbmcgdHlwZXMgb2YgZXZlbnQgdGFyZ2V0czpcbiAqXG4gKiAqKkRPTSBFdmVudFRhcmdldCoqXG4gKlxuICogVGhpcyBpcyBhbiBvYmplY3Qgd2l0aCBgYWRkRXZlbnRMaXN0ZW5lcmAgYW5kIGByZW1vdmVFdmVudExpc3RlbmVyYCBtZXRob2RzLlxuICpcbiAqIEluIHRoZSBicm93c2VyLCBgYWRkRXZlbnRMaXN0ZW5lcmAgYWNjZXB0cyAtIGFwYXJ0IGZyb20gZXZlbnQgdHlwZSBzdHJpbmcgYW5kIGV2ZW50XG4gKiBoYW5kbGVyIGZ1bmN0aW9uIGFyZ3VtZW50cyAtIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciwgd2hpY2ggaXMgZWl0aGVyIGFuIG9iamVjdCBvciBib29sZWFuLFxuICogYm90aCB1c2VkIGZvciBhZGRpdGlvbmFsIGNvbmZpZ3VyYXRpb24gaG93IGFuZCB3aGVuIHBhc3NlZCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZC4gV2hlblxuICogYGZyb21FdmVudGAgaXMgdXNlZCB3aXRoIGV2ZW50IHRhcmdldCBvZiB0aGF0IHR5cGUsIHlvdSBjYW4gcHJvdmlkZSB0aGlzIHZhbHVlc1xuICogYXMgdGhpcmQgcGFyYW1ldGVyIGFzIHdlbGwuXG4gKlxuICogKipOb2RlLmpzIEV2ZW50RW1pdHRlcioqXG4gKlxuICogQW4gb2JqZWN0IHdpdGggYGFkZExpc3RlbmVyYCBhbmQgYHJlbW92ZUxpc3RlbmVyYCBtZXRob2RzLlxuICpcbiAqICoqSlF1ZXJ5LXN0eWxlIGV2ZW50IHRhcmdldCoqXG4gKlxuICogQW4gb2JqZWN0IHdpdGggYG9uYCBhbmQgYG9mZmAgbWV0aG9kc1xuICpcbiAqICoqRE9NIE5vZGVMaXN0KipcbiAqXG4gKiBMaXN0IG9mIERPTSBOb2RlcywgcmV0dXJuZWQgZm9yIGV4YW1wbGUgYnkgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIG9yIGBOb2RlLmNoaWxkTm9kZXNgLlxuICpcbiAqIEFsdGhvdWdoIHRoaXMgY29sbGVjdGlvbiBpcyBub3QgZXZlbnQgdGFyZ2V0IGluIGl0c2VsZiwgYGZyb21FdmVudGAgd2lsbCBpdGVyYXRlIG92ZXIgYWxsIE5vZGVzXG4gKiBpdCBjb250YWlucyBhbmQgaW5zdGFsbCBldmVudCBoYW5kbGVyIGZ1bmN0aW9uIGluIGV2ZXJ5IG9mIHRoZW0uIFdoZW4gcmV0dXJuZWQgT2JzZXJ2YWJsZVxuICogaXMgdW5zdWJzY3JpYmVkLCBmdW5jdGlvbiB3aWxsIGJlIHJlbW92ZWQgZnJvbSBhbGwgTm9kZXMuXG4gKlxuICogKipET00gSHRtbENvbGxlY3Rpb24qKlxuICpcbiAqIEp1c3QgYXMgaW4gY2FzZSBvZiBOb2RlTGlzdCBpdCBpcyBhIGNvbGxlY3Rpb24gb2YgRE9NIG5vZGVzLiBIZXJlIGFzIHdlbGwgZXZlbnQgaGFuZGxlciBmdW5jdGlvbiBpc1xuICogaW5zdGFsbGVkIGFuZCByZW1vdmVkIGluIGVhY2ggb2YgZWxlbWVudHMuXG4gKlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgRW1pdHMgY2xpY2tzIGhhcHBlbmluZyBvbiB0aGUgRE9NIGRvY3VtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gTW91c2VFdmVudCBvYmplY3QgbG9nZ2VkIHRvIGNvbnNvbGUgZXZlcnkgdGltZSBhIGNsaWNrXG4gKiAvLyBvY2N1cnMgb24gdGhlIGRvY3VtZW50LlxuICogYGBgXG4gKlxuICogIyMjIFVzZSBhZGRFdmVudExpc3RlbmVyIHdpdGggY2FwdHVyZSBvcHRpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrc0luRG9jdW1lbnQgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycsIHRydWUpOyAvLyBub3RlIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2lsbCBiZSBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lclxuICogY29uc3QgY2xpY2tzSW5EaXYgPSBmcm9tRXZlbnQoc29tZURpdkluRG9jdW1lbnQsICdjbGljaycpO1xuICpcbiAqIGNsaWNrc0luRG9jdW1lbnQuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdkb2N1bWVudCcpKTtcbiAqIGNsaWNrc0luRGl2LnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnZGl2JykpO1xuICpcbiAqIC8vIEJ5IGRlZmF1bHQgZXZlbnRzIGJ1YmJsZSBVUCBpbiBET00gdHJlZSwgc28gbm9ybWFsbHlcbiAqIC8vIHdoZW4gd2Ugd291bGQgY2xpY2sgb24gZGl2IGluIGRvY3VtZW50XG4gKiAvLyBcImRpdlwiIHdvdWxkIGJlIGxvZ2dlZCBmaXJzdCBhbmQgdGhlbiBcImRvY3VtZW50XCIuXG4gKiAvLyBTaW5jZSB3ZSBzcGVjaWZpZWQgb3B0aW9uYWwgYGNhcHR1cmVgIG9wdGlvbiwgZG9jdW1lbnRcbiAqIC8vIHdpbGwgY2F0Y2ggZXZlbnQgd2hlbiBpdCBnb2VzIERPV04gRE9NIHRyZWUsIHNvIGNvbnNvbGVcbiAqIC8vIHdpbGwgbG9nIFwiZG9jdW1lbnRcIiBhbmQgdGhlbiBcImRpdlwiLlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZENhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb21FdmVudFBhdHRlcm59XG4gKlxuICogQHBhcmFtIHtGcm9tRXZlbnRUYXJnZXQ8VD59IHRhcmdldCBUaGUgRE9NIEV2ZW50VGFyZ2V0LCBOb2RlLmpzXG4gKiBFdmVudEVtaXR0ZXIsIEpRdWVyeS1saWtlIGV2ZW50IHRhcmdldCwgTm9kZUxpc3Qgb3IgSFRNTENvbGxlY3Rpb24gdG8gYXR0YWNoIHRoZSBldmVudCBoYW5kbGVyIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnQgbmFtZSBvZiBpbnRlcmVzdCwgYmVpbmcgZW1pdHRlZCBieSB0aGVcbiAqIGB0YXJnZXRgLlxuICogQHBhcmFtIHtFdmVudExpc3RlbmVyT3B0aW9uc30gW29wdGlvbnNdIE9wdGlvbnMgdG8gcGFzcyB0aHJvdWdoIHRvIGFkZEV2ZW50TGlzdGVuZXJcbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59XG4gKiBAbmFtZSBmcm9tRXZlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudDxUPihcbiAgdGFyZ2V0OiBGcm9tRXZlbnRUYXJnZXQ8VD4sXG4gIGV2ZW50TmFtZTogc3RyaW5nLFxuICBvcHRpb25zPzogRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCAoKC4uLmFyZ3M6IGFueVtdKSA9PiBUKSxcbiAgcmVzdWx0U2VsZWN0b3I/OiAoKC4uLmFyZ3M6IGFueVtdKSA9PiBUKVxuKTogT2JzZXJ2YWJsZTxUPiB7XG5cbiAgaWYgKGlzRnVuY3Rpb24ob3B0aW9ucykpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZnJvbUV2ZW50PFQ+KHRhcmdldCwgZXZlbnROYW1lLCA8RXZlbnRMaXN0ZW5lck9wdGlvbnMgfCB1bmRlZmluZWQ+b3B0aW9ucykucGlwZShcbiAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgZnVuY3Rpb24gaGFuZGxlcihlOiBUKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZXR1cFN1YnNjcmlwdGlvbih0YXJnZXQsIGV2ZW50TmFtZSwgaGFuZGxlciwgc3Vic2NyaWJlciwgb3B0aW9ucyBhcyBFdmVudExpc3RlbmVyT3B0aW9ucyk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXR1cFN1YnNjcmlwdGlvbjxUPihzb3VyY2VPYmo6IEZyb21FdmVudFRhcmdldDxUPiwgZXZlbnROYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zPzogRXZlbnRMaXN0ZW5lck9wdGlvbnMpIHtcbiAgbGV0IHVuc3Vic2NyaWJlOiAoKSA9PiB2b2lkO1xuICBpZiAoaXNFdmVudFRhcmdldChzb3VyY2VPYmopKSB7XG4gICAgY29uc3Qgc291cmNlID0gc291cmNlT2JqO1xuICAgIHNvdXJjZU9iai5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiBzb3VyY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIoc291cmNlT2JqKSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZU9iajtcbiAgICBzb3VyY2VPYmoub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB1bnN1YnNjcmliZSA9ICgpID0+IHNvdXJjZS5vZmYoZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgfSBlbHNlIGlmIChpc05vZGVTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmopKSB7XG4gICAgY29uc3Qgc291cmNlID0gc291cmNlT2JqO1xuICAgIHNvdXJjZU9iai5hZGRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIgYXMgTm9kZUV2ZW50SGFuZGxlcik7XG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyIGFzIE5vZGVFdmVudEhhbmRsZXIpO1xuICB9IGVsc2UgaWYgKHNvdXJjZU9iaiAmJiAoc291cmNlT2JqIGFzIGFueSkubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IChzb3VyY2VPYmogYXMgYW55KS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2V0dXBTdWJzY3JpcHRpb24oc291cmNlT2JqW2ldLCBldmVudE5hbWUsIGhhbmRsZXIsIHN1YnNjcmliZXIsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHRhcmdldCcpO1xuICB9XG5cbiAgc3Vic2NyaWJlci5hZGQodW5zdWJzY3JpYmUpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBOb2RlU3R5bGVFdmVudEVtaXR0ZXIge1xuICByZXR1cm4gc291cmNlT2JqICYmIHR5cGVvZiBzb3VyY2VPYmouYWRkTGlzdGVuZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNvdXJjZU9iai5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNKUXVlcnlTdHlsZUV2ZW50RW1pdHRlcihzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBKUXVlcnlTdHlsZUV2ZW50RW1pdHRlciB7XG4gIHJldHVybiBzb3VyY2VPYmogJiYgdHlwZW9mIHNvdXJjZU9iai5vbiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc291cmNlT2JqLm9mZiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNFdmVudFRhcmdldChzb3VyY2VPYmo6IGFueSk6IHNvdXJjZU9iaiBpcyBIYXNFdmVudFRhcmdldEFkZFJlbW92ZTxhbnk+IHtcbiAgcmV0dXJuIHNvdXJjZU9iaiAmJiB0eXBlb2Ygc291cmNlT2JqLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHNvdXJjZU9iai5yZW1vdmVFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gJy4vZnJvbUV2ZW50JztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LCByZW1vdmVIYW5kbGVyPzogKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpID0+IHZvaWQpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LCByZW1vdmVIYW5kbGVyPzogKGhhbmRsZXI6IEZ1bmN0aW9uLCBzaWduYWw/OiBhbnkpID0+IHZvaWQsIHJlc3VsdFNlbGVjdG9yPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIGZyb20gYW4gYXJiaXRyYXJ5IEFQSSBmb3IgcmVnaXN0ZXJpbmcgZXZlbnQgaGFuZGxlcnMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldoZW4gdGhhdCBtZXRob2QgZm9yIGFkZGluZyBldmVudCBoYW5kbGVyIHdhcyBzb21ldGhpbmcge0BsaW5rIGZyb21FdmVudH1cbiAqIHdhcyBub3QgcHJlcGFyZWQgZm9yLjwvc3Bhbj5cbiAqXG4gKiAhW10oZnJvbUV2ZW50UGF0dGVybi5wbmcpXG4gKlxuICogYGZyb21FdmVudFBhdHRlcm5gIGFsbG93cyB5b3UgdG8gY29udmVydCBpbnRvIGFuIE9ic2VydmFibGUgYW55IEFQSSB0aGF0IHN1cHBvcnRzIHJlZ2lzdGVyaW5nIGhhbmRsZXIgZnVuY3Rpb25zXG4gKiBmb3IgZXZlbnRzLiBJdCBpcyBzaW1pbGFyIHRvIHtAbGluayBmcm9tRXZlbnR9LCBidXQgZmFyXG4gKiBtb3JlIGZsZXhpYmxlLiBJbiBmYWN0LCBhbGwgdXNlIGNhc2VzIG9mIHtAbGluayBmcm9tRXZlbnR9IGNvdWxkIGJlIGVhc2lseSBoYW5kbGVkIGJ5XG4gKiBgZnJvbUV2ZW50UGF0dGVybmAgKGFsdGhvdWdoIGluIHNsaWdodGx5IG1vcmUgdmVyYm9zZSB3YXkpLlxuICpcbiAqIFRoaXMgb3BlcmF0b3IgYWNjZXB0cyBhcyBhIGZpcnN0IGFyZ3VtZW50IGFuIGBhZGRIYW5kbGVyYCBmdW5jdGlvbiwgd2hpY2ggd2lsbCBiZSBpbmplY3RlZCB3aXRoXG4gKiBoYW5kbGVyIHBhcmFtZXRlci4gVGhhdCBoYW5kbGVyIGlzIGFjdHVhbGx5IGFuIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gdGhhdCB5b3Ugbm93IGNhbiBwYXNzXG4gKiB0byBBUEkgZXhwZWN0aW5nIGl0LiBgYWRkSGFuZGxlcmAgd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgT2JzZXJ2YWJsZVxuICogcmV0dXJuZWQgYnkgdGhlIG9wZXJhdG9yIGlzIHN1YnNjcmliZWQsIHNvIHJlZ2lzdGVyaW5nIGhhbmRsZXIgaW4gQVBJIHdpbGwgbm90XG4gKiBuZWNlc3NhcmlseSBoYXBwZW4gd2hlbiBgZnJvbUV2ZW50UGF0dGVybmAgaXMgY2FsbGVkLlxuICpcbiAqIEFmdGVyIHJlZ2lzdHJhdGlvbiwgZXZlcnkgdGltZSBhbiBldmVudCB0aGF0IHdlIGxpc3RlbiB0byBoYXBwZW5zLFxuICogT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgZnJvbUV2ZW50UGF0dGVybmAgd2lsbCBlbWl0IHZhbHVlIHRoYXQgZXZlbnQgaGFuZGxlclxuICogZnVuY3Rpb24gd2FzIGNhbGxlZCB3aXRoLiBOb3RlIHRoYXQgaWYgZXZlbnQgaGFuZGxlciB3YXMgY2FsbGVkIHdpdGggbW9yZVxuICogdGhlbiBvbmUgYXJndW1lbnQsIHNlY29uZCBhbmQgZm9sbG93aW5nIGFyZ3VtZW50cyB3aWxsIG5vdCBhcHBlYXIgaW4gdGhlIE9ic2VydmFibGUuXG4gKlxuICogSWYgQVBJIHlvdSBhcmUgdXNpbmcgYWxsb3dzIHRvIHVucmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnMgYXMgd2VsbCwgeW91IGNhbiBwYXNzIHRvIGBmcm9tRXZlbnRQYXR0ZXJuYFxuICogYW5vdGhlciBmdW5jdGlvbiAtIGByZW1vdmVIYW5kbGVyYCAtIGFzIGEgc2Vjb25kIHBhcmFtZXRlci4gSXQgd2lsbCBiZSBpbmplY3RlZFxuICogd2l0aCB0aGUgc2FtZSBoYW5kbGVyIGZ1bmN0aW9uIGFzIGJlZm9yZSwgd2hpY2ggbm93IHlvdSBjYW4gdXNlIHRvIHVucmVnaXN0ZXJcbiAqIGl0IGZyb20gdGhlIEFQSS4gYHJlbW92ZUhhbmRsZXJgIHdpbGwgYmUgY2FsbGVkIHdoZW4gY29uc3VtZXIgb2YgcmVzdWx0aW5nIE9ic2VydmFibGVcbiAqIHVuc3Vic2NyaWJlcyBmcm9tIGl0LlxuICpcbiAqIEluIHNvbWUgQVBJcyB1bnJlZ2lzdGVyaW5nIGlzIGFjdHVhbGx5IGhhbmRsZWQgZGlmZmVyZW50bHkuIE1ldGhvZCByZWdpc3RlcmluZyBhbiBldmVudCBoYW5kbGVyXG4gKiByZXR1cm5zIHNvbWUga2luZCBvZiB0b2tlbiwgd2hpY2ggaXMgbGF0ZXIgdXNlZCB0byBpZGVudGlmeSB3aGljaCBmdW5jdGlvbiBzaG91bGRcbiAqIGJlIHVucmVnaXN0ZXJlZCBvciBpdCBpdHNlbGYgaGFzIG1ldGhvZCB0aGF0IHVucmVnaXN0ZXJzIGV2ZW50IGhhbmRsZXIuXG4gKiBJZiB0aGF0IGlzIHRoZSBjYXNlIHdpdGggeW91ciBBUEksIG1ha2Ugc3VyZSB0b2tlbiByZXR1cm5lZFxuICogYnkgcmVnaXN0ZXJpbmcgbWV0aG9kIGlzIHJldHVybmVkIGJ5IGBhZGRIYW5kbGVyYC4gVGhlbiBpdCB3aWxsIGJlIHBhc3NlZFxuICogYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gYHJlbW92ZUhhbmRsZXJgLCB3aGVyZSB5b3Ugd2lsbCBiZSBhYmxlIHRvIHVzZSBpdC5cbiAqXG4gKiBJZiB5b3UgbmVlZCBhY2Nlc3MgdG8gYWxsIGV2ZW50IGhhbmRsZXIgcGFyYW1ldGVycyAobm90IG9ubHkgdGhlIGZpcnN0IG9uZSksXG4gKiBvciB5b3UgbmVlZCB0byB0cmFuc2Zvcm0gdGhlbSBpbiBhbnkgd2F5LCB5b3UgY2FuIGNhbGwgYGZyb21FdmVudFBhdHRlcm5gIHdpdGggb3B0aW9uYWxcbiAqIHRoaXJkIHBhcmFtZXRlciAtIHByb2plY3QgZnVuY3Rpb24gd2hpY2ggd2lsbCBhY2NlcHQgYWxsIGFyZ3VtZW50cyBwYXNzZWQgdG9cbiAqIGV2ZW50IGhhbmRsZXIgd2hlbiBpdCBpcyBjYWxsZWQuIFdoYXRldmVyIGlzIHJldHVybmVkIGZyb20gcHJvamVjdCBmdW5jdGlvbiB3aWxsIGFwcGVhciBvblxuICogcmVzdWx0aW5nIHN0cmVhbSBpbnN0ZWFkIG9mIHVzdWFsIGV2ZW50IGhhbmRsZXJzIGZpcnN0IGFyZ3VtZW50LiBUaGlzIG1lYW5zXG4gKiB0aGF0IGRlZmF1bHQgcHJvamVjdCBjYW4gYmUgdGhvdWdodCBvZiBhcyBmdW5jdGlvbiB0aGF0IHRha2VzIGl0cyBmaXJzdCBwYXJhbWV0ZXJcbiAqIGFuZCBpZ25vcmVzIHRoZSByZXN0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBFbWl0cyBjbGlja3MgaGFwcGVuaW5nIG9uIHRoZSBET00gZG9jdW1lbnRcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBhZGRDbGlja0hhbmRsZXIoaGFuZGxlcikge1xuICogICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZXIpO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIHJlbW92ZUNsaWNrSGFuZGxlcihoYW5kbGVyKSB7XG4gKiAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gKiB9XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50UGF0dGVybihcbiAqICAgYWRkQ2xpY2tIYW5kbGVyLFxuICogICByZW1vdmVDbGlja0hhbmRsZXJcbiAqICk7XG4gKiBjbGlja3Muc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFdoZW5ldmVyIHlvdSBjbGljayBhbnl3aGVyZSBpbiB0aGUgYnJvd3NlciwgRE9NIE1vdXNlRXZlbnRcbiAqIC8vIG9iamVjdCB3aWxsIGJlIGxvZ2dlZC5cbiAqIGBgYFxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBVc2Ugd2l0aCBBUEkgdGhhdCByZXR1cm5zIGNhbmNlbGxhdGlvbiB0b2tlblxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRva2VuID0gc29tZUFQSS5yZWdpc3RlckV2ZW50SGFuZGxlcihmdW5jdGlvbigpIHt9KTtcbiAqIHNvbWVBUEkudW5yZWdpc3RlckV2ZW50SGFuZGxlcih0b2tlbik7IC8vIHRoaXMgQVBJcyBjYW5jZWxsYXRpb24gbWV0aG9kIGFjY2VwdHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBoYW5kbGVyIGl0c2VsZiwgYnV0IHNwZWNpYWwgdG9rZW4uXG4gKlxuICogY29uc3Qgc29tZUFQSU9ic2VydmFibGUgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBmdW5jdGlvbihoYW5kbGVyKSB7IHJldHVybiBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGhhbmRsZXIpOyB9LCAvLyBOb3RlIHRoYXQgd2UgcmV0dXJuIHRoZSB0b2tlbiBoZXJlLi4uXG4gKiAgIGZ1bmN0aW9uKGhhbmRsZXIsIHRva2VuKSB7IHNvbWVBUEkudW5yZWdpc3RlckV2ZW50SGFuZGxlcih0b2tlbik7IH0gIC8vIC4uLnRvIHRoZW4gdXNlIGl0IGhlcmUuXG4gKiApO1xuICogYGBgXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFVzZSB3aXRoIHByb2plY3QgZnVuY3Rpb25cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKChldmVudFR5cGUsIGV2ZW50TWVzc2FnZSkgPT4ge1xuICogICBjb25zb2xlLmxvZyhldmVudFR5cGUsIGV2ZW50TWVzc2FnZSk7IC8vIExvZ3MgXCJFVkVOVF9UWVBFXCIgXCJFVkVOVF9NRVNTQUdFXCIgdG8gY29uc29sZS5cbiAqIH0pO1xuICpcbiAqIGNvbnN0IHNvbWVBUElPYnNlcnZhYmxlID0gZnJvbUV2ZW50UGF0dGVybihcbiAqICAgaGFuZGxlciA9PiBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGhhbmRsZXIpLFxuICogICBoYW5kbGVyID0+IHNvbWVBUEkudW5yZWdpc3RlckV2ZW50SGFuZGxlcihoYW5kbGVyKVxuICogICAoZXZlbnRUeXBlLCBldmVudE1lc3NhZ2UpID0+IGV2ZW50VHlwZSArIFwiIC0tLSBcIiArIGV2ZW50TWVzc2FnZSAvLyB3aXRob3V0IHRoYXQgZnVuY3Rpb24gb25seSBcIkVWRU5UX1RZUEVcIlxuICogKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd291bGQgYmUgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZVxuICpcbiAqIHNvbWVBUElPYnNlcnZhYmxlLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIkVWRU5UX1RZUEUgLS0tIEVWRU5UX01FU1NBR0VcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50fVxuICogQHNlZSB7QGxpbmsgYmluZENhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGhhbmRsZXI6IEZ1bmN0aW9uKTogYW55fSBhZGRIYW5kbGVyIEEgZnVuY3Rpb24gdGhhdCB0YWtlc1xuICogYSBgaGFuZGxlcmAgZnVuY3Rpb24gYXMgYXJndW1lbnQgYW5kIGF0dGFjaGVzIGl0IHNvbWVob3cgdG8gdGhlIGFjdHVhbFxuICogc291cmNlIG9mIGV2ZW50cy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oaGFuZGxlcjogRnVuY3Rpb24sIHRva2VuPzogYW55KTogdm9pZH0gW3JlbW92ZUhhbmRsZXJdIEEgZnVuY3Rpb24gdGhhdFxuICogdGFrZXMgYSBgaGFuZGxlcmAgZnVuY3Rpb24gYXMgYW4gYXJndW1lbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgZXZlbnQgc291cmNlLiBJZiBgYWRkSGFuZGxlcmBcbiAqIHJldHVybnMgc29tZSBraW5kIG9mIHRva2VuLCBgcmVtb3ZlSGFuZGxlcmAgZnVuY3Rpb24gd2lsbCBoYXZlIGl0IGFzIGEgc2Vjb25kIHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oLi4uYXJnczogYW55KTogVH0gW3Byb2plY3RdIEEgZnVuY3Rpb24gdG9cbiAqIHRyYW5zZm9ybSByZXN1bHRzLiBJdCB0YWtlcyB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGV2ZW50IGhhbmRsZXIgYW5kXG4gKiBzaG91bGQgcmV0dXJuIGEgc2luZ2xlIHZhbHVlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gT2JzZXJ2YWJsZSB3aGljaCwgd2hlbiBhbiBldmVudCBoYXBwZW5zLCBlbWl0cyBmaXJzdCBwYXJhbWV0ZXJcbiAqIHBhc3NlZCB0byByZWdpc3RlcmVkIGV2ZW50IGhhbmRsZXIuIEFsdGVybmF0aXZlbHkgaXQgZW1pdHMgd2hhdGV2ZXIgcHJvamVjdCBmdW5jdGlvbiByZXR1cm5zXG4gKiBhdCB0aGF0IG1vbWVudC5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgZnJvbUV2ZW50UGF0dGVyblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyOiAoaGFuZGxlcjogRnVuY3Rpb24pID0+IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBUKTogT2JzZXJ2YWJsZTxUIHwgVFtdPiB7XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlciwgcmVtb3ZlSGFuZGxlcikucGlwZShcbiAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VCB8IFRbXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5lOiBUW10pID0+IHN1YnNjcmliZXIubmV4dChlLmxlbmd0aCA9PT0gMSA/IGVbMF0gOiBlKTtcblxuICAgIGxldCByZXRWYWx1ZTogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXRWYWx1ZSA9IGFkZEhhbmRsZXIoaGFuZGxlcik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICghaXNGdW5jdGlvbihyZW1vdmVIYW5kbGVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4gcmVtb3ZlSGFuZGxlcihoYW5kbGVyLCByZXRWYWx1ZSkgO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuXG5leHBvcnQgdHlwZSBDb25kaXRpb25GdW5jPFM+ID0gKHN0YXRlOiBTKSA9PiBib29sZWFuO1xuZXhwb3J0IHR5cGUgSXRlcmF0ZUZ1bmM8Uz4gPSAoc3RhdGU6IFMpID0+IFM7XG5leHBvcnQgdHlwZSBSZXN1bHRGdW5jPFMsIFQ+ID0gKHN0YXRlOiBTKSA9PiBUO1xuXG5pbnRlcmZhY2UgU2NoZWR1bGVyU3RhdGU8VCwgUz4ge1xuICBuZWVkSXRlcmF0ZT86IGJvb2xlYW47XG4gIHN0YXRlOiBTO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBjb25kaXRpb24/OiBDb25kaXRpb25GdW5jPFM+O1xuICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPjtcbiAgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVCYXNlT3B0aW9uczxTPiB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHN0YXRlLlxuICAgKi9cbiAgaW5pdGlhbFN0YXRlOiBTO1xuICAvKipcbiAgICogQ29uZGl0aW9uIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBib29sZWFuLlxuICAgKiBXaGVuIGl0IHJldHVybnMgZmFsc2UsIHRoZSBnZW5lcmF0b3Igc3RvcHMuXG4gICAqIElmIG5vdCBzcGVjaWZpZWQsIGEgZ2VuZXJhdG9yIG5ldmVyIHN0b3BzLlxuICAgKi9cbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPjtcbiAgLyoqXG4gICAqIEl0ZXJhdGUgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHN0YXRlIGFuZCByZXR1cm5zIG5ldyBzdGF0ZS5cbiAgICovXG4gIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+O1xuICAvKipcbiAgICogU2NoZWR1bGVyTGlrZSB0byB1c2UgZm9yIGdlbmVyYXRpb24gcHJvY2Vzcy5cbiAgICogQnkgZGVmYXVsdCwgYSBnZW5lcmF0b3Igc3RhcnRzIGltbWVkaWF0ZWx5LlxuICAgKi9cbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZW5lcmF0ZU9wdGlvbnM8VCwgUz4gZXh0ZW5kcyBHZW5lcmF0ZUJhc2VPcHRpb25zPFM+IHtcbiAgLyoqXG4gICAqIFJlc3VsdCBzZWxlY3Rpb24gZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHN0YXRlIGFuZCByZXR1cm5zIGEgdmFsdWUgdG8gZW1pdC5cbiAgICovXG4gIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoMCwgeCA9PiB4IDwgMTAsIHggPT4geCArIDEsIHggPT4geCk7XG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNpbmcgYXNhcCBzY2hlZHVsZXIsIHByb2R1Y2VzIHNlcXVlbmNlIG9mIDIsIDMsIDUsIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKDEsIHggPT4geCA8IDUsIHggPT4gICogMiwgeCA9PiB4ICsgMSwgYXNhcCk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtTfSBpbml0aWFsU3RhdGUgSW5pdGlhbCBzdGF0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogYm9vbGVhbn0gY29uZGl0aW9uIENvbmRpdGlvbiB0byB0ZXJtaW5hdGUgZ2VuZXJhdGlvbiAodXBvbiByZXR1cm5pbmcgZmFsc2UpLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBTfSBpdGVyYXRlIEl0ZXJhdGlvbiBzdGVwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBUfSByZXN1bHRTZWxlY3RvciBTZWxlY3RvciBmdW5jdGlvbiBmb3IgcmVzdWx0cyBwcm9kdWNlZCBpbiB0aGUgc2VxdWVuY2UuIChkZXByZWNhdGVkKVxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSBvbiB3aGljaCB0byBydW4gdGhlIGdlbmVyYXRvciBsb29wLiBJZiBub3QgcHJvdmlkZWQsIGRlZmF1bHRzIHRvIGVtaXQgaW1tZWRpYXRlbHkuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxUPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuICBleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8VCwgUz4oaW5pdGlhbFN0YXRlOiBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBPYnNlcnZhYmxlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogdGhhdCBlbWl0cyBhbiBlbGVtZW50IG9uIGVhY2ggaXRlcmF0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Vc2UgaXQgaW5zdGVhZCBvZiBuZXh0aW5nIHZhbHVlcyBpbiBhIGZvciBsb29wLjwvc3Bhbj5cbiAqXG4gKiA8aW1nIHNyYz1cIi4vaW1nL2dlbmVyYXRlLnBuZ1wiIHdpZHRoPVwiMTAwJVwiPlxuICpcbiAqIGBnZW5lcmF0ZWAgYWxsb3dzIHlvdSB0byBjcmVhdGUgc3RyZWFtIG9mIHZhbHVlcyBnZW5lcmF0ZWQgd2l0aCBhIGxvb3AgdmVyeSBzaW1pbGFyIHRvXG4gKiB0cmFkaXRpb25hbCBmb3IgbG9vcC4gRmlyc3QgYXJndW1lbnQgb2YgYGdlbmVyYXRlYCBpcyBhIGJlZ2lubmluZyB2YWx1ZS4gU2Vjb25kIGFyZ3VtZW50XG4gKiBpcyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB0aGlzIHZhbHVlIGFuZCB0ZXN0cyBpZiBzb21lIGNvbmRpdGlvbiBzdGlsbCBob2xkcy4gSWYgaXQgZG9lcyxcbiAqIGxvb3AgY29udGludWVzLCBpZiBub3QsIGl0IHN0b3BzLiBUaGlyZCB2YWx1ZSBpcyBhIGZ1bmN0aW9uIHdoaWNoIHRha2VzIHByZXZpb3VzbHkgZGVmaW5lZFxuICogdmFsdWUgYW5kIG1vZGlmaWVzIGl0IGluIHNvbWUgd2F5IG9uIGVhY2ggaXRlcmF0aW9uLiBOb3RlIGhvdyB0aGVzZSB0aHJlZSBwYXJhbWV0ZXJzXG4gKiBhcmUgZGlyZWN0IGVxdWl2YWxlbnRzIG9mIHRocmVlIGV4cHJlc3Npb25zIGluIHJlZ3VsYXIgZm9yIGxvb3A6IGZpcnN0IGV4cHJlc3Npb25cbiAqIGluaXRpYWxpemVzIHNvbWUgc3RhdGUgKGZvciBleGFtcGxlIG51bWVyaWMgaW5kZXgpLCBzZWNvbmQgdGVzdHMgaWYgbG9vcCBjYW4gbWFrZSBuZXh0XG4gKiBpdGVyYXRpb24gKGZvciBleGFtcGxlIGlmIGluZGV4IGlzIGxvd2VyIHRoYW4gMTApIGFuZCB0aGlyZCBzdGF0ZXMgaG93IGRlZmluZWQgdmFsdWVcbiAqIHdpbGwgYmUgbW9kaWZpZWQgb24gZXZlcnkgc3RlcCAoaW5kZXggd2lsbCBiZSBpbmNyZW1lbnRlZCBieSBvbmUpLlxuICpcbiAqIFJldHVybiB2YWx1ZSBvZiBhIGBnZW5lcmF0ZWAgb3BlcmF0b3IgaXMgYW4gT2JzZXJ2YWJsZSB0aGF0IG9uIGVhY2ggbG9vcCBpdGVyYXRpb25cbiAqIGVtaXRzIGEgdmFsdWUuIEZpcnN0LCBjb25kaXRpb24gZnVuY3Rpb24gaXMgcmFuLiBJZiBpdCByZXR1cm5lZCB0cnVlLCBPYnNlcnZhYmxlXG4gKiBlbWl0cyBjdXJyZW50bHkgc3RvcmVkIHZhbHVlIChpbml0aWFsIHZhbHVlIGF0IHRoZSBmaXJzdCBpdGVyYXRpb24pIGFuZCB0aGVuIHVwZGF0ZXNcbiAqIHRoYXQgdmFsdWUgd2l0aCBpdGVyYXRlIGZ1bmN0aW9uLiBJZiBhdCBzb21lIHBvaW50IGNvbmRpdGlvbiByZXR1cm5lZCBmYWxzZSwgT2JzZXJ2YWJsZVxuICogY29tcGxldGVzIGF0IHRoYXQgbW9tZW50LlxuICpcbiAqIE9wdGlvbmFsbHkgeW91IGNhbiBwYXNzIGZvdXJ0aCBwYXJhbWV0ZXIgdG8gYGdlbmVyYXRlYCAtIGEgcmVzdWx0IHNlbGVjdG9yIGZ1bmN0aW9uIHdoaWNoIGFsbG93cyB5b3VcbiAqIHRvIGltbWVkaWF0ZWx5IG1hcCB2YWx1ZSB0aGF0IHdvdWxkIG5vcm1hbGx5IGJlIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiB5b3UgZmluZCB0aHJlZSBhbm9ueW1vdXMgZnVuY3Rpb25zIGluIGBnZW5lcmF0ZWAgY2FsbCBoYXJkIHRvIHJlYWQsIHlvdSBjYW4gcHJvdmlkZVxuICogc2luZ2xlIG9iamVjdCB0byB0aGUgb3BlcmF0b3IgaW5zdGVhZC4gVGhhdCBvYmplY3QgaGFzIHByb3BlcnRpZXM6IGBpbml0aWFsU3RhdGVgLFxuICogYGNvbmRpdGlvbmAsIGBpdGVyYXRlYCBhbmQgYHJlc3VsdFNlbGVjdG9yYCwgd2hpY2ggc2hvdWxkIGhhdmUgcmVzcGVjdGl2ZSB2YWx1ZXMgdGhhdCB5b3VcbiAqIHdvdWxkIG5vcm1hbGx5IHBhc3MgdG8gYGdlbmVyYXRlYC4gYHJlc3VsdFNlbGVjdG9yYCBpcyBzdGlsbCBvcHRpb25hbCwgYnV0IHRoYXQgZm9ybVxuICogb2YgY2FsbGluZyBgZ2VuZXJhdGVgIGFsbG93cyB5b3UgdG8gb21pdCBgY29uZGl0aW9uYCBhcyB3ZWxsLiBJZiB5b3Ugb21pdCBpdCwgdGhhdCBtZWFuc1xuICogY29uZGl0aW9uIGFsd2F5cyBob2xkcywgc28gb3V0cHV0IE9ic2VydmFibGUgd2lsbCBuZXZlciBjb21wbGV0ZS5cbiAqXG4gKiBCb3RoIGZvcm1zIG9mIGBnZW5lcmF0ZWAgY2FuIG9wdGlvbmFsbHkgYWNjZXB0IGEgc2NoZWR1bGVyLiBJbiBjYXNlIG9mIG11bHRpLXBhcmFtZXRlciBjYWxsLFxuICogc2NoZWR1bGVyIHNpbXBseSBjb21lcyBhcyBhIGxhc3QgYXJndW1lbnQgKG5vIG1hdHRlciBpZiB0aGVyZSBpcyByZXN1bHRTZWxlY3RvclxuICogZnVuY3Rpb24gb3Igbm90KS4gSW4gY2FzZSBvZiBzaW5nbGUtcGFyYW1ldGVyIGNhbGwsIHlvdSBjYW4gcHJvdmlkZSBpdCBhcyBhXG4gKiBgc2NoZWR1bGVyYCBwcm9wZXJ0eSBvbiBvYmplY3QgcGFzc2VkIHRvIHRoZSBvcGVyYXRvci4gSW4gYm90aCBjYXNlcyBzY2hlZHVsZXIgZGVjaWRlcyB3aGVuXG4gKiBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgbG9vcCB3aWxsIGhhcHBlbiBhbmQgdGhlcmVmb3JlIHdoZW4gbmV4dCB2YWx1ZSB3aWxsIGJlIGVtaXR0ZWRcbiAqIGJ5IHRoZSBPYnNlcnZhYmxlLiBGb3IgZXhhbXBsZSB0byBlbnN1cmUgdGhhdCBlYWNoIHZhbHVlIGlzIHB1c2hlZCB0byB0aGUgb2JzZXJ2ZXJcbiAqIG9uIHNlcGFyYXRlIHRhc2sgaW4gZXZlbnQgbG9vcCwgeW91IGNvdWxkIHVzZSBgYXN5bmNgIHNjaGVkdWxlci4gTm90ZSB0aGF0XG4gKiBieSBkZWZhdWx0ICh3aGVuIG5vIHNjaGVkdWxlciBpcyBwYXNzZWQpIHZhbHVlcyBhcmUgc2ltcGx5IGVtaXR0ZWQgc3luY2hyb25vdXNseS5cbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIHdpdGggY29uZGl0aW9uIGFuZCBpdGVyYXRlIGZ1bmN0aW9ucy48L2NhcHRpb24+XG4gKiBjb25zdCBnZW5lcmF0ZWQgPSBnZW5lcmF0ZSgwLCB4ID0+IHggPCAzLCB4ID0+IHggKyAxKTtcbiAqXG4gKiBnZW5lcmF0ZWQuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1lvIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwXG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyBcIllvIVwiXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSB3aXRoIGNvbmRpdGlvbiwgaXRlcmF0ZSBhbmQgcmVzdWx0U2VsZWN0b3IgZnVuY3Rpb25zLjwvY2FwdGlvbj5cbiAqIGNvbnN0IGdlbmVyYXRlZCA9IGdlbmVyYXRlKDAsIHggPT4geCA8IDMsIHggPT4geCArIDEsIHggPT4geCAqIDEwMDApO1xuICpcbiAqIGdlbmVyYXRlZC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnWW8hJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDBcbiAqIC8vIDEwMDBcbiAqIC8vIDIwMDBcbiAqIC8vIFwiWW8hXCJcbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIHdpdGggb3B0aW9ucyBvYmplY3QuPC9jYXB0aW9uPlxuICogY29uc3QgZ2VuZXJhdGVkID0gZ2VuZXJhdGUoe1xuICogICBpbml0aWFsU3RhdGU6IDAsXG4gKiAgIGNvbmRpdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgPCAzOyB9LFxuICogICBpdGVyYXRlKHZhbHVlKSB7IHJldHVybiB2YWx1ZSArIDE7IH0sXG4gKiAgIHJlc3VsdFNlbGVjdG9yKHZhbHVlKSB7IHJldHVybiB2YWx1ZSAqIDEwMDA7IH1cbiAqIH0pO1xuICpcbiAqIGdlbmVyYXRlZC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnWW8hJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDBcbiAqIC8vIDEwMDBcbiAqIC8vIDIwMDBcbiAqIC8vIFwiWW8hXCJcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2Ugb3B0aW9ucyBvYmplY3Qgd2l0aG91dCBjb25kaXRpb24gZnVuY3Rpb24uPC9jYXB0aW9uPlxuICogY29uc3QgZ2VuZXJhdGVkID0gZ2VuZXJhdGUoe1xuICogICBpbml0aWFsU3RhdGU6IDAsXG4gKiAgIGl0ZXJhdGUodmFsdWUpIHsgcmV0dXJuIHZhbHVlICsgMTsgfSxcbiAqICAgcmVzdWx0U2VsZWN0b3IodmFsdWUpIHsgcmV0dXJuIHZhbHVlICogMTAwMDsgfVxuICogfSk7XG4gKlxuICogZ2VuZXJhdGVkLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdZbyEnKSAvLyBUaGlzIHdpbGwgbmV2ZXIgcnVuLlxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMFxuICogLy8gMTAwMFxuICogLy8gMjAwMFxuICogLy8gMzAwMFxuICogLy8gLi4uYW5kIG5ldmVyIHN0b3BzLlxuICpcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgY3JlYXRlfVxuICpcbiAqIEBwYXJhbSB7U30gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogU30gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogVH0gW3Jlc3VsdFNlbGVjdG9yXSBTZWxlY3RvciBmdW5jdGlvbiBmb3IgcmVzdWx0cyBwcm9kdWNlZCBpbiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyfSBvbiB3aGljaCB0byBydW4gdGhlIGdlbmVyYXRvciBsb29wLiBJZiBub3QgcHJvdmlkZWQsIGRlZmF1bHRzIHRvIGVtaXR0aW5nIGltbWVkaWF0ZWx5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFM+KGluaXRpYWxTdGF0ZTogUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IENvbmRpdGlvbkZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8Uz47XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wXG4gKiBwcm9kdWNpbmcgdGhlIHNlcXVlbmNlJ3MgZWxlbWVudHMsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyXG4gKiB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAqIFRoZSBvdmVybG9hZCBhY2NlcHRzIG9wdGlvbnMgb2JqZWN0IHRoYXQgbWlnaHQgY29udGFpbiBpbml0aWFsIHN0YXRlLCBpdGVyYXRlLFxuICogY29uZGl0aW9uIGFuZCBzY2hlZHVsZXIuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoe1xuICogICBpbml0aWFsU3RhdGU6IDAsXG4gKiAgIGNvbmRpdGlvbjogeCA9PiB4IDwgMTAsXG4gKiAgIGl0ZXJhdGU6IHggPT4geCArIDEsXG4gKiB9KTtcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge0dlbmVyYXRlQmFzZU9wdGlvbnM8Uz59IG9wdGlvbnMgT2JqZWN0IHRoYXQgbXVzdCBjb250YWluIGluaXRpYWxTdGF0ZSwgaXRlcmF0ZSBhbmQgbWlnaHQgY29udGFpbiBjb25kaXRpb24gYW5kIHNjaGVkdWxlci5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFM+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8Uz4ob3B0aW9uczogR2VuZXJhdGVCYXNlT3B0aW9uczxTPik6IE9ic2VydmFibGU8Uz47XG5cbi8qKlxuICogR2VuZXJhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgcnVubmluZyBhIHN0YXRlLWRyaXZlbiBsb29wXG4gKiBwcm9kdWNpbmcgdGhlIHNlcXVlbmNlJ3MgZWxlbWVudHMsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyXG4gKiB0byBzZW5kIG91dCBvYnNlcnZlciBtZXNzYWdlcy5cbiAqIFRoZSBvdmVybG9hZCBhY2NlcHRzIG9wdGlvbnMgb2JqZWN0IHRoYXQgbWlnaHQgY29udGFpbiBpbml0aWFsIHN0YXRlLCBpdGVyYXRlLFxuICogY29uZGl0aW9uLCByZXN1bHQgc2VsZWN0b3IgYW5kIHNjaGVkdWxlci5cbiAqXG4gKiAhW10oZ2VuZXJhdGUucG5nKVxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlByb2R1Y2VzIHNlcXVlbmNlIG9mIDAsIDEsIDIsIC4uLiA5LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSh7XG4gKiAgIGluaXRpYWxTdGF0ZTogMCxcbiAqICAgY29uZGl0aW9uOiB4ID0+IHggPCAxMCxcbiAqICAgaXRlcmF0ZTogeCA9PiB4ICsgMSxcbiAqICAgcmVzdWx0U2VsZWN0b3I6IHggPT4geCxcbiAqIH0pO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7R2VuZXJhdGVPcHRpb25zPFQsIFM+fSBvcHRpb25zIE9iamVjdCB0aGF0IG11c3QgY29udGFpbiBpbml0aWFsU3RhdGUsIGl0ZXJhdGUsIHJlc3VsdFNlbGVjdG9yIGFuZCBtaWdodCBjb250YWluIGNvbmRpdGlvbiBhbmQgc2NoZWR1bGVyLlxuICogQHJldHVybnMge09ic2VydmFibGU8VD59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxULCBTPihvcHRpb25zOiBHZW5lcmF0ZU9wdGlvbnM8VCwgUz4pOiBPYnNlcnZhYmxlPFQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8VCwgUz4oaW5pdGlhbFN0YXRlT3JPcHRpb25zOiBTIHwgR2VuZXJhdGVPcHRpb25zPFQsIFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbj86IENvbmRpdGlvbkZ1bmM8Uz4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZT86IEl0ZXJhdGVGdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlPzogKFJlc3VsdEZ1bmM8UywgVD4pIHwgU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPiB7XG5cbiAgbGV0IHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+O1xuICBsZXQgaW5pdGlhbFN0YXRlOiBTO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5pdGlhbFN0YXRlT3JPcHRpb25zIGFzIEdlbmVyYXRlT3B0aW9uczxULCBTPjtcbiAgICBpbml0aWFsU3RhdGUgPSBvcHRpb25zLmluaXRpYWxTdGF0ZTtcbiAgICBjb25kaXRpb24gPSBvcHRpb25zLmNvbmRpdGlvbjtcbiAgICBpdGVyYXRlID0gb3B0aW9ucy5pdGVyYXRlO1xuICAgIHJlc3VsdFNlbGVjdG9yID0gb3B0aW9ucy5yZXN1bHRTZWxlY3RvciB8fCBpZGVudGl0eSBhcyBSZXN1bHRGdW5jPFMsIFQ+O1xuICAgIHNjaGVkdWxlciA9IG9wdGlvbnMuc2NoZWR1bGVyO1xuICB9IGVsc2UgaWYgKHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlID09PSB1bmRlZmluZWQgfHwgaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUpKSB7XG4gICAgaW5pdGlhbFN0YXRlID0gaW5pdGlhbFN0YXRlT3JPcHRpb25zIGFzIFM7XG4gICAgcmVzdWx0U2VsZWN0b3IgPSBpZGVudGl0eSBhcyBSZXN1bHRGdW5jPFMsIFQ+O1xuICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlIGFzIFNjaGVkdWxlckxpa2U7XG4gIH0gZWxzZSB7XG4gICAgaW5pdGlhbFN0YXRlID0gaW5pdGlhbFN0YXRlT3JPcHRpb25zIGFzIFM7XG4gICAgcmVzdWx0U2VsZWN0b3IgPSByZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSBhcyBSZXN1bHRGdW5jPFMsIFQ+O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlPFNjaGVkdWxlclN0YXRlPFQsIFM+PihkaXNwYXRjaCwgMCwge1xuICAgICAgICBzdWJzY3JpYmVyLFxuICAgICAgICBpdGVyYXRlLFxuICAgICAgICBjb25kaXRpb24sXG4gICAgICAgIHJlc3VsdFNlbGVjdG9yLFxuICAgICAgICBzdGF0ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgICBsZXQgY29uZGl0aW9uUmVzdWx0OiBib29sZWFuO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbmRpdGlvblJlc3VsdCA9IGNvbmRpdGlvbihzdGF0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY29uZGl0aW9uUmVzdWx0KSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgdmFsdWU6IFQ7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHJlc3VsdFNlbGVjdG9yKHN0YXRlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdGUgPSBpdGVyYXRlKHN0YXRlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSB3aGlsZSAodHJ1ZSk7XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2g8VCwgUz4odGhpczogU2NoZWR1bGVyQWN0aW9uPFNjaGVkdWxlclN0YXRlPFQsIFM+Piwgc3RhdGU6IFNjaGVkdWxlclN0YXRlPFQsIFM+KSB7XG4gIGNvbnN0IHsgc3Vic2NyaWJlciwgY29uZGl0aW9uIH0gPSBzdGF0ZTtcbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoc3RhdGUubmVlZEl0ZXJhdGUpIHtcbiAgICB0cnkge1xuICAgICAgc3RhdGUuc3RhdGUgPSBzdGF0ZS5pdGVyYXRlKHN0YXRlLnN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHN0YXRlLm5lZWRJdGVyYXRlID0gdHJ1ZTtcbiAgfVxuICBpZiAoY29uZGl0aW9uKSB7XG4gICAgbGV0IGNvbmRpdGlvblJlc3VsdDogYm9vbGVhbjtcbiAgICB0cnkge1xuICAgICAgY29uZGl0aW9uUmVzdWx0ID0gY29uZGl0aW9uKHN0YXRlLnN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICghY29uZGl0aW9uUmVzdWx0KSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIGxldCB2YWx1ZTogVDtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IHN0YXRlLnJlc3VsdFNlbGVjdG9yKHN0YXRlLnN0YXRlKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiB0aGlzLnNjaGVkdWxlKHN0YXRlKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi9kZWZlcic7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIERlY2lkZXMgYXQgc3Vic2NyaXB0aW9uIHRpbWUgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGFjdHVhbGx5IGJlIHN1YnNjcmliZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPmBJZmAgc3RhdGVtZW50IGZvciBPYnNlcnZhYmxlcy48L3NwYW4+XG4gKlxuICogYGlpZmAgYWNjZXB0cyBhIGNvbmRpdGlvbiBmdW5jdGlvbiBhbmQgdHdvIE9ic2VydmFibGVzLiBXaGVuXG4gKiBhbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvcGVyYXRvciBpcyBzdWJzY3JpYmVkLCBjb25kaXRpb24gZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQuXG4gKiBCYXNlZCBvbiB3aGF0IGJvb2xlYW4gaXQgcmV0dXJucyBhdCB0aGF0IG1vbWVudCwgY29uc3VtZXIgd2lsbCBzdWJzY3JpYmUgZWl0aGVyIHRvXG4gKiB0aGUgZmlyc3QgT2JzZXJ2YWJsZSAoaWYgY29uZGl0aW9uIHdhcyB0cnVlKSBvciB0byB0aGUgc2Vjb25kIChpZiBjb25kaXRpb24gd2FzIGZhbHNlKS4gQ29uZGl0aW9uXG4gKiBmdW5jdGlvbiBtYXkgYWxzbyBub3QgcmV0dXJuIGFueXRoaW5nIC0gaW4gdGhhdCBjYXNlIGNvbmRpdGlvbiB3aWxsIGJlIGV2YWx1YXRlZCBhcyBmYWxzZSBhbmRcbiAqIHNlY29uZCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZC5cbiAqXG4gKiBOb3RlIHRoYXQgT2JzZXJ2YWJsZXMgZm9yIGJvdGggY2FzZXMgKHRydWUgYW5kIGZhbHNlKSBhcmUgb3B0aW9uYWwuIElmIGNvbmRpdGlvbiBwb2ludHMgdG8gYW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiB3YXMgbGVmdCB1bmRlZmluZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBzaW1wbHkgY29tcGxldGUgaW1tZWRpYXRlbHkuIFRoYXQgYWxsb3dzIHlvdSB0bywgcmF0aGVyXG4gKiB0aGVuIGNvbnRyb2xsaW5nIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLCBkZWNpZGUgYXQgcnVudGltZSBpZiBjb25zdW1lciBzaG91bGQgaGF2ZSBhY2Nlc3NcbiAqIHRvIGdpdmVuIE9ic2VydmFibGUgb3Igbm90LlxuICpcbiAqIElmIHlvdSBoYXZlIG1vcmUgY29tcGxleCBsb2dpYyB0aGF0IHJlcXVpcmVzIGRlY2lzaW9uIGJldHdlZW4gbW9yZSB0aGFuIHR3byBPYnNlcnZhYmxlcywge0BsaW5rIGRlZmVyfVxuICogd2lsbCBwcm9iYWJseSBiZSBhIGJldHRlciBjaG9pY2UuIEFjdHVhbGx5IGBpaWZgIGNhbiBiZSBlYXNpbHkgaW1wbGVtZW50ZWQgd2l0aCB7QGxpbmsgZGVmZXJ9XG4gKiBhbmQgZXhpc3RzIG9ubHkgZm9yIGNvbnZlbmllbmNlIGFuZCByZWFkYWJpbGl0eSByZWFzb25zLlxuICpcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENoYW5nZSBhdCBydW50aW1lIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgc3Vic2NyaWJlVG9GaXJzdDtcbiAqIGNvbnN0IGZpcnN0T3JTZWNvbmQgPSBpaWYoXG4gKiAgICgpID0+IHN1YnNjcmliZVRvRmlyc3QsXG4gKiAgIG9mKCdmaXJzdCcpLFxuICogICBvZignc2Vjb25kJyksXG4gKiApO1xuICpcbiAqIHN1YnNjcmliZVRvRmlyc3QgPSB0cnVlO1xuICogZmlyc3RPclNlY29uZC5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJmaXJzdFwiXG4gKlxuICogc3Vic2NyaWJlVG9GaXJzdCA9IGZhbHNlO1xuICogZmlyc3RPclNlY29uZC5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJzZWNvbmRcIlxuICpcbiAqIGBgYFxuICpcbiAqICMjIyBDb250cm9sIGFuIGFjY2VzcyB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgYWNjZXNzR3JhbnRlZDtcbiAqIGNvbnN0IG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3MgPSBpaWYoXG4gKiAgICgpID0+IGFjY2Vzc0dyYW50ZWQsXG4gKiAgIG9mKCdJdCBzZWVtcyB5b3UgaGF2ZSBhbiBhY2Nlc3MuLi4nKSwgLy8gTm90ZSB0aGF0IG9ubHkgb25lIE9ic2VydmFibGUgaXMgcGFzc2VkIHRvIHRoZSBvcGVyYXRvci5cbiAqICk7XG4gKlxuICogYWNjZXNzR3JhbnRlZCA9IHRydWU7XG4gKiBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGUgZW5kJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIkl0IHNlZW1zIHlvdSBoYXZlIGFuIGFjY2Vzcy4uLlwiXG4gKiAvLyBcIlRoZSBlbmRcIlxuICpcbiAqIGFjY2Vzc0dyYW50ZWQgPSBmYWxzZTtcbiAqIG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3Muc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoZSBlbmQnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiVGhlIGVuZFwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkZWZlcn1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gd2hpY2ggT2JzZXJ2YWJsZSBzaG91bGQgYmUgY2hvc2VuLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbdHJ1ZU9ic2VydmFibGVdIEFuIE9ic2VydmFibGUgdGhhdCB3aWxsIGJlIHN1YnNjcmliZWQgaWYgY29uZGl0aW9uIGlzIHRydWUuXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IFtmYWxzZU9ic2VydmFibGVdIEFuIE9ic2VydmFibGUgdGhhdCB3aWxsIGJlIHN1YnNjcmliZWQgaWYgY29uZGl0aW9uIGlzIGZhbHNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gRWl0aGVyIGZpcnN0IG9yIHNlY29uZCBPYnNlcnZhYmxlLCBkZXBlbmRpbmcgb24gY29uZGl0aW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBpaWZcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpaWY8VCwgRj4oXG4gIGNvbmRpdGlvbjogKCkgPT4gYm9vbGVhbixcbiAgdHJ1ZVJlc3VsdDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+ID0gRU1QVFksXG4gIGZhbHNlUmVzdWx0OiBTdWJzY3JpYmFibGVPclByb21pc2U8Rj4gPSBFTVBUWVxuKTogT2JzZXJ2YWJsZTxUfEY+IHtcbiAgcmV0dXJuIGRlZmVyPFR8Rj4oKCkgPT4gY29uZGl0aW9uKCkgPyB0cnVlUmVzdWx0IDogZmFsc2VSZXN1bHQpO1xufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXNBcnJheSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWModmFsOiBhbnkpOiB2YWwgaXMgbnVtYmVyIHwgc3RyaW5nIHtcbiAgLy8gcGFyc2VGbG9hdCBOYU5zIG51bWVyaWMtY2FzdCBmYWxzZSBwb3NpdGl2ZXMgKG51bGx8dHJ1ZXxmYWxzZXxcIlwiKVxuICAvLyAuLi5idXQgbWlzaW50ZXJwcmV0cyBsZWFkaW5nLW51bWJlciBzdHJpbmdzLCBwYXJ0aWN1bGFybHkgaGV4IGxpdGVyYWxzIChcIjB4Li4uXCIpXG4gIC8vIHN1YnRyYWN0aW9uIGZvcmNlcyBpbmZpbml0aWVzIHRvIE5hTlxuICAvLyBhZGRpbmcgMSBjb3JyZWN0cyBsb3NzIG9mIHByZWNpc2lvbiBmcm9tIHBhcnNlRmxvYXQgKCMxNTEwMClcbiAgcmV0dXJuICFpc0FycmF5KHZhbCkgJiYgKHZhbCAtIHBhcnNlRmxvYXQodmFsKSArIDEpID49IDA7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgc2VxdWVudGlhbCBudW1iZXJzIGV2ZXJ5IHNwZWNpZmllZFxuICogaW50ZXJ2YWwgb2YgdGltZSwgb24gYSBzcGVjaWZpZWQge0BsaW5rIFNjaGVkdWxlckxpa2V9LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FbWl0cyBpbmNyZW1lbnRhbCBudW1iZXJzIHBlcmlvZGljYWxseSBpbiB0aW1lLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShpbnRlcnZhbC5wbmcpXG4gKlxuICogYGludGVydmFsYCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBpbmZpbml0ZSBzZXF1ZW5jZSBvZlxuICogYXNjZW5kaW5nIGludGVnZXJzLCB3aXRoIGEgY29uc3RhbnQgaW50ZXJ2YWwgb2YgdGltZSBvZiB5b3VyIGNob29zaW5nXG4gKiBiZXR3ZWVuIHRob3NlIGVtaXNzaW9ucy4gVGhlIGZpcnN0IGVtaXNzaW9uIGlzIG5vdCBzZW50IGltbWVkaWF0ZWx5LCBidXRcbiAqIG9ubHkgYWZ0ZXIgdGhlIGZpcnN0IHBlcmlvZCBoYXMgcGFzc2VkLiBCeSBkZWZhdWx0LCB0aGlzIG9wZXJhdG9yIHVzZXMgdGhlXG4gKiBgYXN5bmNgIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBwcm92aWRlIGEgbm90aW9uIG9mIHRpbWUsIGJ1dCB5b3UgbWF5IHBhc3MgYW55XG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gaXQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdHMgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQgKDEwMDBtcykgdXAgdG8gdGhlIG51bWJlciAzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBudW1iZXJzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKlxuICogY29uc3QgdGFrZUZvdXJOdW1iZXJzID0gbnVtYmVycy5waXBlKHRha2UoNCkpO1xuICpcbiAqIHRha2VGb3VyTnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnTmV4dDogJywgeCkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBOZXh0OiAwXG4gKiAvLyBOZXh0OiAxXG4gKiAvLyBOZXh0OiAyXG4gKiAvLyBOZXh0OiAzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyaW9kPTBdIFRoZSBpbnRlcnZhbCBzaXplIGluIG1pbGxpc2Vjb25kcyAoYnkgZGVmYXVsdClcbiAqIG9yIHRoZSB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBieSB0aGUgc2NoZWR1bGVyJ3MgY2xvY2suXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLCBhbmQgcHJvdmlkaW5nIGEgbm90aW9uIG9mIFwidGltZVwiLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgc2VxdWVudGlhbCBudW1iZXIgZWFjaCB0aW1lXG4gKiBpbnRlcnZhbC5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaW50ZXJ2YWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbChwZXJpb2QgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgaWYgKCFpc051bWVyaWMocGVyaW9kKSB8fCBwZXJpb2QgPCAwKSB7XG4gICAgcGVyaW9kID0gMDtcbiAgfVxuXG4gIGlmICghc2NoZWR1bGVyIHx8IHR5cGVvZiBzY2hlZHVsZXIuc2NoZWR1bGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIHN1YnNjcmliZXIuYWRkKFxuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCBwZXJpb2QsIHsgc3Vic2NyaWJlciwgY291bnRlcjogMCwgcGVyaW9kIH0pXG4gICAgKTtcbiAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxJbnRlcnZhbFN0YXRlPiwgc3RhdGU6IEludGVydmFsU3RhdGUpIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb3VudGVyLCBwZXJpb2QgfSA9IHN0YXRlO1xuICBzdWJzY3JpYmVyLm5leHQoY291bnRlcik7XG4gIHRoaXMuc2NoZWR1bGUoeyBzdWJzY3JpYmVyLCBjb3VudGVyOiBjb3VudGVyICsgMSwgcGVyaW9kIH0sIHBlcmlvZCk7XG59XG5cbmludGVyZmFjZSBJbnRlcnZhbFN0YXRlIHtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+O1xuICBjb3VudGVyOiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWVyZ2VBbGwnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBjb25jdXJyZW50PzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZTxUPiguLi5vYnNlcnZhYmxlczogKE9ic2VydmFibGVJbnB1dDxUPiB8IFNjaGVkdWxlckxpa2UgfCBudW1iZXIpW10pOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlPFQsIFI+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlIHwgbnVtYmVyKVtdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKipcbiAqIENyZWF0ZXMgYW4gb3V0cHV0IE9ic2VydmFibGUgd2hpY2ggY29uY3VycmVudGx5IGVtaXRzIGFsbCB2YWx1ZXMgZnJvbSBldmVyeVxuICogZ2l2ZW4gaW5wdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIgYnkgYmxlbmRpbmdcbiAqIHRoZWlyIHZhbHVlcyBpbnRvIG9uZSBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10obWVyZ2UucG5nKVxuICpcbiAqIGBtZXJnZWAgc3Vic2NyaWJlcyB0byBlYWNoIGdpdmVuIGlucHV0IE9ic2VydmFibGUgKGFzIGFyZ3VtZW50cyksIGFuZCBzaW1wbHlcbiAqIGZvcndhcmRzICh3aXRob3V0IGRvaW5nIGFueSB0cmFuc2Zvcm1hdGlvbikgYWxsIHRoZSB2YWx1ZXMgZnJvbSBhbGwgdGhlIGlucHV0XG4gKiBPYnNlcnZhYmxlcyB0byB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvbmx5IGNvbXBsZXRlc1xuICogb25jZSBhbGwgaW5wdXQgT2JzZXJ2YWJsZXMgaGF2ZSBjb21wbGV0ZWQuIEFueSBlcnJvciBkZWxpdmVyZWQgYnkgYW4gaW5wdXRcbiAqIE9ic2VydmFibGUgd2lsbCBiZSBpbW1lZGlhdGVseSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIE1lcmdlIHRvZ2V0aGVyIHR3byBPYnNlcnZhYmxlczogMXMgaW50ZXJ2YWwgYW5kIGNsaWNrc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBjbGlja3NPclRpbWVyID0gbWVyZ2UoY2xpY2tzLCB0aW1lcik7XG4gKiBjbGlja3NPclRpbWVyLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyB0aW1lciB3aWxsIGVtaXQgYXNjZW5kaW5nIHZhbHVlcywgb25lIGV2ZXJ5IHNlY29uZCgxMDAwbXMpIHRvIGNvbnNvbGVcbiAqIC8vIGNsaWNrcyBsb2dzIE1vdXNlRXZlbnRzIHRvIGNvbnNvbGUgZXZlcnl0aW1lIHRoZSBcImRvY3VtZW50XCIgaXMgY2xpY2tlZFxuICogLy8gU2luY2UgdGhlIHR3byBzdHJlYW1zIGFyZSBtZXJnZWQgeW91IHNlZSB0aGVzZSBoYXBwZW5pbmdcbiAqIC8vIGFzIHRoZXkgb2NjdXIuXG4gKiBgYGBcbiAqXG4gKiAjIyMgTWVyZ2UgdG9nZXRoZXIgMyBPYnNlcnZhYmxlcywgYnV0IG9ubHkgMiBydW4gY29uY3VycmVudGx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lcjEgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHRpbWVyMiA9IGludGVydmFsKDIwMDApLnBpcGUodGFrZSg2KSk7XG4gKiBjb25zdCB0aW1lcjMgPSBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgY29uY3VycmVudCA9IDI7IC8vIHRoZSBhcmd1bWVudFxuICogY29uc3QgbWVyZ2VkID0gbWVyZ2UodGltZXIxLCB0aW1lcjIsIHRpbWVyMywgY29uY3VycmVudCk7XG4gKiBtZXJnZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIC0gRmlyc3QgdGltZXIxIGFuZCB0aW1lcjIgd2lsbCBydW4gY29uY3VycmVudGx5XG4gKiAvLyAtIHRpbWVyMSB3aWxsIGVtaXQgYSB2YWx1ZSBldmVyeSAxMDAwbXMgZm9yIDEwIGl0ZXJhdGlvbnNcbiAqIC8vIC0gdGltZXIyIHdpbGwgZW1pdCBhIHZhbHVlIGV2ZXJ5IDIwMDBtcyBmb3IgNiBpdGVyYXRpb25zXG4gKiAvLyAtIGFmdGVyIHRpbWVyMSBoaXRzIGl0J3MgbWF4IGl0ZXJhdGlvbiwgdGltZXIyIHdpbGxcbiAqIC8vICAgY29udGludWUsIGFuZCB0aW1lcjMgd2lsbCBzdGFydCB0byBydW4gY29uY3VycmVudGx5IHdpdGggdGltZXIyXG4gKiAvLyAtIHdoZW4gdGltZXIyIGhpdHMgaXQncyBtYXggaXRlcmF0aW9uIGl0IHRlcm1pbmF0ZXMsIGFuZFxuICogLy8gICB0aW1lcjMgd2lsbCBjb250aW51ZSB0byBlbWl0IGEgdmFsdWUgZXZlcnkgNTAwbXMgdW50aWwgaXQgaXMgY29tcGxldGVcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZU1hcFRvfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlcyBJbnB1dCBPYnNlcnZhYmxlcyB0byBtZXJnZSB0b2dldGhlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlucHV0XG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3IgbWFuYWdpbmdcbiAqIGNvbmN1cnJlbmN5IG9mIGlucHV0IE9ic2VydmFibGVzLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIHRoYXQgYXJlIHRoZSByZXN1bHQgb2ZcbiAqIGV2ZXJ5IGlucHV0IE9ic2VydmFibGUuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIG1lcmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2U8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgU2NoZWR1bGVyTGlrZSB8IG51bWJlcj4pOiBPYnNlcnZhYmxlPFI+IHtcbiBsZXQgY29uY3VycmVudCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiBsZXQgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gbnVsbDtcbiAgbGV0IGxhc3Q6IGFueSA9IG9ic2VydmFibGVzW29ic2VydmFibGVzLmxlbmd0aCAtIDFdO1xuICBpZiAoaXNTY2hlZHVsZXIobGFzdCkpIHtcbiAgICBzY2hlZHVsZXIgPSA8U2NoZWR1bGVyTGlrZT5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID4gMSAmJiB0eXBlb2Ygb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV0gPT09ICdudW1iZXInKSB7XG4gICAgICBjb25jdXJyZW50ID0gPG51bWJlcj5vYnNlcnZhYmxlcy5wb3AoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGxhc3QgPT09ICdudW1iZXInKSB7XG4gICAgY29uY3VycmVudCA9IDxudW1iZXI+b2JzZXJ2YWJsZXMucG9wKCk7XG4gIH1cblxuICBpZiAoc2NoZWR1bGVyID09PSBudWxsICYmIG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSAmJiBvYnNlcnZhYmxlc1swXSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8Uj4+b2JzZXJ2YWJsZXNbMF07XG4gIH1cblxuICByZXR1cm4gbWVyZ2VBbGw8Uj4oY29uY3VycmVudCkoZnJvbUFycmF5PGFueT4ob2JzZXJ2YWJsZXMsIHNjaGVkdWxlcikpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgbmV2ZXIgY29tcGxldGVzLlxuICpcbiAqICFbXShuZXZlci5wbmcpXG4gKlxuICogQSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5laXRoZXIgdmFsdWVzIG5vciBlcnJvcnMgbm9yIHRoZSBjb21wbGV0aW9uXG4gKiBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9yIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMuIFBsZWFzZSBub3RlIHRoYXQgYnkgbmV2ZXIgZW1pdHRpbmcgYSBjb21wbGV0ZSBub3RpZmljYXRpb24sIHRoaXNcbiAqIE9ic2VydmFibGUga2VlcHMgdGhlIHN1YnNjcmlwdGlvbiBmcm9tIGJlaW5nIGRpc3Bvc2VkIGF1dG9tYXRpY2FsbHkuXG4gKiBTdWJzY3JpcHRpb25zIG5lZWQgdG8gYmUgbWFudWFsbHkgZGlzcG9zZWQuXG4gKlxuICogIyMgIEV4YW1wbGVcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBuZXZlciBlbWl0IGFueXRoaW5nIGVsc2UgKG5vdCBldmVuIGNvbXBsZXRlKVxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gaW5mbygpIHtcbiAqICAgY29uc29sZS5sb2coJ1dpbGwgbm90IGJlIGNhbGxlZCcpO1xuICogfVxuICogY29uc3QgcmVzdWx0ID0gTkVWRVIucGlwZShzdGFydFdpdGgoNykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBpbmZvLCBpbmZvKTtcbiAqXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgaW5kZXgvRU1QVFl9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKi9cbmV4cG9ydCBjb25zdCBORVZFUiA9IG5ldyBPYnNlcnZhYmxlPG5ldmVyPihub29wKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHVzaW5nIHtAbGluayBORVZFUn0gY29uc3RhbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXZlciAoKSB7XG4gIHJldHVybiBORVZFUjtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPih2OiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogV2hlbiBhbnkgb2YgdGhlIHByb3ZpZGVkIE9ic2VydmFibGUgZW1pdHMgYW4gY29tcGxldGUgb3IgZXJyb3Igbm90aWZpY2F0aW9uLCBpdCBpbW1lZGlhdGVseSBzdWJzY3JpYmVzIHRvIHRoZSBuZXh0IG9uZVxuICogdGhhdCB3YXMgcGFzc2VkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FeGVjdXRlIHNlcmllcyBvZiBPYnNlcnZhYmxlcyBubyBtYXR0ZXIgd2hhdCwgZXZlbiBpZiBpdCBtZWFucyBzd2FsbG93aW5nIGVycm9ycy48L3NwYW4+XG4gKlxuICogIVtdKG9uRXJyb3JSZXN1bWVOZXh0LnBuZylcbiAqXG4gKiBgb25FcnJvclJlc3VtZU5leHRgIFdpbGwgc3Vic2NyaWJlIHRvIGVhY2ggb2JzZXJ2YWJsZSBzb3VyY2UgaXQgaXMgcHJvdmlkZWQsIGluIG9yZGVyLlxuICogSWYgdGhlIHNvdXJjZSBpdCdzIHN1YnNjcmliZWQgdG8gZW1pdHMgYW4gZXJyb3Igb3IgY29tcGxldGVzLCBpdCB3aWxsIG1vdmUgdG8gdGhlIG5leHQgc291cmNlXG4gKiB3aXRob3V0IGVycm9yLlxuICpcbiAqIElmIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgcHJvdmlkZWQgbm8gYXJndW1lbnRzLCBvciBhIHNpbmdsZSwgZW1wdHkgYXJyYXksIGl0IHdpbGwgcmV0dXJuIHtAbGluayBpbmRleC9FTVBUWX0uXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBpcyBiYXNpY2FsbHkge0BsaW5rIGNvbmNhdH0sIG9ubHkgaXQgd2lsbCBjb250aW51ZSwgZXZlbiBpZiBvbmUgb2YgaXRzXG4gKiBzb3VyY2VzIGVtaXRzIGFuIGVycm9yLlxuICpcbiAqIE5vdGUgdGhhdCB0aGVyZSBpcyBubyB3YXkgdG8gaGFuZGxlIGFueSBlcnJvcnMgdGhyb3duIGJ5IHNvdXJjZXMgdmlhIHRoZSByZXN1dWx0IG9mXG4gKiBgb25FcnJvclJlc3VtZU5leHRgLiBJZiB5b3Ugd2FudCB0byBoYW5kbGUgZXJyb3JzIHRocm93biBpbiBhbnkgZ2l2ZW4gc291cmNlLCB5b3UgY2FuXG4gKiBhbHdheXMgdXNlIHRoZSB7QGxpbmsgY2F0Y2hFcnJvcn0gb3BlcmF0b3Igb24gdGhlbSBiZWZvcmUgcGFzc2luZyB0aGVtIGludG8gYG9uRXJyb3JSZXN1bWVOZXh0YC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdWJzY3JpYmUgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSBhZnRlciBtYXAgZmFpbHM8L2NhcHRpb24+XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvbkVycm9yUmVzdW1lTmV4dCwgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvbkVycm9yUmVzdW1lTmV4dChcbiAqICBvZigxLCAyLCAzLCAwKS5waXBlKFxuICogICAgbWFwKHggPT4ge1xuICogICAgICBpZiAoeCA9PT0gMCkgdGhyb3cgRXJyb3IoKTtcbiAqICAgICAgcmV0dXJuIDEwIC8geDtcbiAqICAgIH0pXG4gKiAgKSxcbiAqICBvZigxLCAyLCAzKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbCA9PiBjb25zb2xlLmxvZyh2YWwpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgICAgICAgLy8gV2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdkb25lJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAxMFxuICogLy8gNVxuICogLy8gMy4zMzMzMzMzMzMzMzMzMzM1XG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyAzXG4gKiAvLyBcImRvbmVcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0fVxuICogQHNlZSB7QGxpbmsgY2F0Y2hFcnJvcn1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gc291cmNlcyBPYnNlcnZhYmxlcyAob3IgYW55dGhpbmcgdGhhdCAqaXMqIG9ic2VydmFibGUpIHBhc3NlZCBlaXRoZXIgZGlyZWN0bHkgb3IgYXMgYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgY29uY2F0ZW5hdGVzIGFsbCBzb3VyY2VzLCBvbmUgYWZ0ZXIgdGhlIG90aGVyLFxuICogaWdub3JpbmcgYWxsIGVycm9ycywgc3VjaCB0aGF0IGFueSBlcnJvciBjYXVzZXMgaXQgdG8gbW92ZSBvbiB0byB0aGUgbmV4dCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPiguLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+IHtcblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBjb25zdCBbIGZpcnN0LCAuLi5yZW1haW5kZXIgXSA9IHNvdXJjZXM7XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoZmlyc3QpKSB7XG4gICAgcmV0dXJuIG9uRXJyb3JSZXN1bWVOZXh0KC4uLmZpcnN0KTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBzdWJOZXh0ID0gKCkgPT4gc3Vic2NyaWJlci5hZGQoXG4gICAgICBvbkVycm9yUmVzdW1lTmV4dCguLi5yZW1haW5kZXIpLnN1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICk7XG5cbiAgICByZXR1cm4gZnJvbShmaXJzdCkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQodmFsdWUpIHsgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSxcbiAgICAgIGVycm9yOiBzdWJOZXh0LFxuICAgICAgY29tcGxldGU6IHN1Yk5leHQsXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGFuIE9ic2VydmFibGUgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlR1cm4gZW50cmllcyBvZiBhbiBvYmplY3QgaW50byBhIHN0cmVhbS48L3NwYW4+XG4gKlxuICogPGltZyBzcmM9XCIuL2ltZy9wYWlycy5wbmdcIiB3aWR0aD1cIjEwMCVcIj5cbiAqXG4gKiBgcGFpcnNgIHRha2VzIGFuIGFyYml0cmFyeSBvYmplY3QgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFycmF5cy4gRWFjaFxuICogZW1pdHRlZCBhcnJheSBoYXMgZXhhY3RseSB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgaXMgYSBrZXkgZnJvbSB0aGUgb2JqZWN0XG4gKiBhbmQgdGhlIHNlY29uZCBpcyBhIHZhbHVlIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBrZXkuIEtleXMgYXJlIGV4dHJhY3RlZCBmcm9tXG4gKiBhbiBvYmplY3QgdmlhIGBPYmplY3Qua2V5c2AgZnVuY3Rpb24sIHdoaWNoIG1lYW5zIHRoYXQgdGhleSB3aWxsIGJlIG9ubHlcbiAqIGVudW1lcmFibGUga2V5cyB0aGF0IGFyZSBwcmVzZW50IG9uIGFuIG9iamVjdCBkaXJlY3RseSAtIG5vdCBvbmVzIGluaGVyaXRlZFxuICogdmlhIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBCeSBkZWZhdWx0IHRoZXNlIGFycmF5cyBhcmUgZW1pdHRlZCBzeW5jaHJvbm91c2x5LiBUbyBjaGFuZ2UgdGhhdCB5b3UgY2FuXG4gKiBwYXNzIGEge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFzIGEgc2Vjb25kIGFyZ3VtZW50IHRvIGBwYWlyc2AuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+Q29udmVydHMgYSBqYXZhc2NyaXB0IG9iamVjdCB0byBhbiBPYnNlcnZhYmxlPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JqID0ge1xuICogICBmb286IDQyLFxuICogICBiYXI6IDU2LFxuICogICBiYXo6IDc4XG4gKiB9O1xuICpcbiAqIHBhaXJzKG9iailcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gW1wiZm9vXCI6IDQyXSxcbiAqIC8vIFtcImJhclwiOiA1Nl0sXG4gKiAvLyBbXCJiYXpcIjogNzhdLFxuICogLy8gXCJ0aGUgZW5kIVwiXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gaW5zcGVjdCBhbmQgdHVybiBpbnRvIGFuXG4gKiBPYnNlcnZhYmxlIHNlcXVlbmNlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIEFuIG9wdGlvbmFsIElTY2hlZHVsZXIgdG8gc2NoZWR1bGVcbiAqIHdoZW4gcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBlbWl0IHZhbHVlcy5cbiAqIEByZXR1cm5zIHsoT2JzZXJ2YWJsZTxBcnJheTxzdHJpbmd8VD4+KX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZlxuICogW2tleSwgdmFsdWVdIHBhaXJzIGZyb20gdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJzPFQ+KG9iajogT2JqZWN0LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGggJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KFtrZXksIG9ialtrZXldXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8W3N0cmluZywgVF0+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICBzY2hlZHVsZXIuc2NoZWR1bGU8eyBrZXlzOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbc3RyaW5nLCBUXT4sIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uLCBvYmo6IE9iamVjdCB9PlxuICAgICAgICAgIChkaXNwYXRjaCwgMCwgeyBrZXlzLCBpbmRleDogMCwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSkpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9KTtcbiAgfVxufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsga2V5czogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W3N0cmluZywgVF0+LCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiwgb2JqOiBPYmplY3QgfSkge1xuICBjb25zdCB7IGtleXMsIGluZGV4LCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9ID0gc3RhdGU7XG4gIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBzdWJzY3JpYmVyLm5leHQoW2tleSwgb2JqW2tleV1dKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQodGhpcy5zY2hlZHVsZSh7IGtleXMsIGluZGV4OiBpbmRleCArIDEsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIGZpcnN0IHNvdXJjZSBPYnNlcnZhYmxlIHRvIGVtaXQgYW4gaXRlbS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgU3Vic2NyaWJlcyB0byB0aGUgb2JzZXJ2YWJsZSB0aGF0IHdhcyB0aGUgZmlyc3QgdG8gc3RhcnQgZW1pdHRpbmcuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JzMSA9IGludGVydmFsKDEwMDApLnBpcGUobWFwVG8oJ2Zhc3Qgb25lJykpO1xuICogY29uc3Qgb2JzMiA9IGludGVydmFsKDMwMDApLnBpcGUobWFwVG8oJ21lZGl1bSBvbmUnKSk7XG4gKiBjb25zdCBvYnMzID0gaW50ZXJ2YWwoNTAwMCkucGlwZShtYXBUbygnc2xvdyBvbmUnKSk7XG4gKlxuICogcmFjZShvYnMzLCBvYnMxLCBvYnMyKVxuICogLnN1YnNjcmliZShcbiAqICAgd2lubmVyID0+IGNvbnNvbGUubG9nKHdpbm5lcilcbiAqICk7XG4gKlxuICogLy8gcmVzdWx0OlxuICogLy8gYSBzZXJpZXMgb2YgJ2Zhc3Qgb25lJ1xuICogYGBgXG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlc30gLi4ub2JzZXJ2YWJsZXMgc291cmNlcyB1c2VkIHRvIHJhY2UgZm9yIHdoaWNoIE9ic2VydmFibGUgZW1pdHMgZmlyc3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgb3V0cHV0IG9mIHRoZSBmaXJzdCBPYnNlcnZhYmxlIHRvIGVtaXQgYW4gaXRlbS5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFjZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4ob2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGU8VD4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KG9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPGFueT4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPFQ+IHwgQXJyYXk8T2JzZXJ2YWJsZTxUPj4+KTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPGFueT4gfCBBcnJheTxPYnNlcnZhYmxlPGFueT4+Pik6IE9ic2VydmFibGU8VD4ge1xuICAvLyBpZiB0aGUgb25seSBhcmd1bWVudCBpcyBhbiBhcnJheSwgaXQgd2FzIG1vc3QgbGlrZWx5IGNhbGxlZCB3aXRoXG4gIC8vIGByYWNlKFtvYnMxLCBvYnMyLCAuLi5dKWBcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChpc0FycmF5KG9ic2VydmFibGVzWzBdKSkge1xuICAgICAgb2JzZXJ2YWJsZXMgPSA8QXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pj5vYnNlcnZhYmxlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxPYnNlcnZhYmxlPGFueT4+b2JzZXJ2YWJsZXNbMF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZyb21BcnJheShvYnNlcnZhYmxlcywgdW5kZWZpbmVkKS5saWZ0KG5ldyBSYWNlT3BlcmF0b3I8VD4oKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBSYWNlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmFjZVN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgUmFjZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgVD4ge1xuICBwcml2YXRlIGhhc0ZpcnN0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dChvYnNlcnZhYmxlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9ic2VydmFibGVzLnB1c2gob2JzZXJ2YWJsZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IG9ic2VydmFibGVzID0gdGhpcy5vYnNlcnZhYmxlcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZhYmxlcy5sZW5ndGg7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICF0aGlzLmhhc0ZpcnN0OyBpKyspIHtcbiAgICAgICAgbGV0IG9ic2VydmFibGUgPSBvYnNlcnZhYmxlc1tpXTtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG9ic2VydmFibGUsIG9ic2VydmFibGUgYXMgYW55LCBpKTtcblxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZChzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgICAgdGhpcy5vYnNlcnZhYmxlcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBULFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzRmlyc3QpIHtcbiAgICAgIHRoaXMuaGFzRmlyc3QgPSB0cnVlO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSAhPT0gb3V0ZXJJbmRleCkge1xuICAgICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSB0aGlzLnN1YnNjcmlwdGlvbnNbaV07XG5cbiAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZShzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGlubmVyVmFsdWUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIHdpdGhpbiBhIHNwZWNpZmllZFxuICogcmFuZ2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGEgc2VxdWVuY2Ugb2YgbnVtYmVycyBpbiBhIHJhbmdlLjwvc3Bhbj5cbiAqXG4gKiAhW10ocmFuZ2UucG5nKVxuICpcbiAqIGByYW5nZWAgb3BlcmF0b3IgZW1pdHMgYSByYW5nZSBvZiBzZXF1ZW50aWFsIGludGVnZXJzLCBpbiBvcmRlciwgd2hlcmUgeW91XG4gKiBzZWxlY3QgdGhlIGBzdGFydGAgb2YgdGhlIHJhbmdlIGFuZCBpdHMgYGxlbmd0aGAuIEJ5IGRlZmF1bHQsIHVzZXMgbm9cbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSBhbmQganVzdCBkZWxpdmVycyB0aGUgbm90aWZpY2F0aW9ucyBzeW5jaHJvbm91c2x5LCBidXQgbWF5IHVzZVxuICogYW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHJlZ3VsYXRlIHRob3NlIGRlbGl2ZXJpZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdHMgdGhlIG51bWJlcnMgMSB0byAxMDwvY2FwdGlvbj5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSByYW5nZSgxLCAxMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgdGltZXJ9XG4gKiBAc2VlIHtAbGluayBpbmRleC9pbnRlcnZhbH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgaW50ZWdlciBpbiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvdW50PTBdIFRoZSBudW1iZXIgb2Ygc2VxdWVudGlhbCBpbnRlZ2VycyB0byBnZW5lcmF0ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBub3RpZmljYXRpb25zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBudW1iZXJzIHRoYXQgZW1pdHMgYSBmaW5pdGUgcmFuZ2Ugb2ZcbiAqIHNlcXVlbnRpYWwgaW50ZWdlcnMuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHJhbmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnQgPSBzdGFydDtcblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgaW5kZXgsIGNvdW50LCBzdGFydCwgc3Vic2NyaWJlclxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGluZGV4KysgPj0gY291bnQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGN1cnJlbnQrKyk7XG4gICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGNvbnN0IHsgc3RhcnQsIGluZGV4LCBjb3VudCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG5cbiAgaWYgKGluZGV4ID49IGNvdW50KSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN1YnNjcmliZXIubmV4dChzdGFydCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHN0YXRlLnN0YXJ0ID0gc3RhcnQgKyAxO1xuXG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBzdGFydHMgZW1pdHRpbmcgYWZ0ZXIgYW4gYGR1ZVRpbWVgIGFuZFxuICogZW1pdHMgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lIHRoZXJlYWZ0ZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0cyBsaWtlIHtAbGluayBpbmRleC9pbnRlcnZhbH0sIGJ1dCB5b3UgY2FuIHNwZWNpZnkgd2hlblxuICogc2hvdWxkIHRoZSBlbWlzc2lvbnMgc3RhcnQuPC9zcGFuPlxuICpcbiAqICFbXSh0aW1lci5wbmcpXG4gKlxuICogYHRpbWVyYCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBpbmZpbml0ZSBzZXF1ZW5jZSBvZiBhc2NlbmRpbmdcbiAqIGludGVnZXJzLCB3aXRoIGEgY29uc3RhbnQgaW50ZXJ2YWwgb2YgdGltZSwgYHBlcmlvZGAgb2YgeW91ciBjaG9vc2luZ1xuICogYmV0d2VlbiB0aG9zZSBlbWlzc2lvbnMuIFRoZSBmaXJzdCBlbWlzc2lvbiBoYXBwZW5zIGFmdGVyIHRoZSBzcGVjaWZpZWRcbiAqIGBkdWVUaW1lYC4gVGhlIGluaXRpYWwgZGVsYXkgbWF5IGJlIGEgYERhdGVgLiBCeSBkZWZhdWx0LCB0aGlzXG4gKiBvcGVyYXRvciB1c2VzIHRoZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBwcm92aWRlIGEgbm90aW9uIG9mIHRpbWUsIGJ1dCB5b3VcbiAqIG1heSBwYXNzIGFueSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gaXQuIElmIGBwZXJpb2RgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUgZW1pdHMgb25seSBvbmUgdmFsdWUsIGAwYC4gT3RoZXJ3aXNlLCBpdCBlbWl0cyBhbiBpbmZpbml0ZVxuICogc2VxdWVuY2UuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKSwgc3RhcnRpbmcgYWZ0ZXIgMyBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gdGltZXIoMzAwMCwgMTAwMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBFbWl0cyBvbmUgbnVtYmVyIGFmdGVyIGZpdmUgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDUwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gW2R1ZVRpbWVdIFRoZSBpbml0aWFsIGRlbGF5IHRpbWUgc3BlY2lmaWVkIGFzIGEgRGF0ZSBvYmplY3Qgb3IgYXMgYW4gaW50ZWdlciBkZW5vdGluZ1xuICogbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGVtaXR0aW5nIHRoZSBmaXJzdCB2YWx1ZSBvZiAwYC5cbiAqIEBwYXJhbSB7bnVtYmVyfFNjaGVkdWxlckxpa2V9IFtwZXJpb2RPclNjaGVkdWxlcl0gVGhlIHBlcmlvZCBvZiB0aW1lIGJldHdlZW4gZW1pc3Npb25zIG9mIHRoZVxuICogc3Vic2VxdWVudCBudW1iZXJzLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHZhbHVlcywgYW5kIHByb3ZpZGluZyBhIG5vdGlvbiBvZiBcInRpbWVcIi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIGAwYCBhZnRlciB0aGVcbiAqIGBkdWVUaW1lYCBhbmQgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lXG4gKiB0aGVyZWFmdGVyLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aW1lclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWU6IG51bWJlciB8IERhdGUgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZE9yU2NoZWR1bGVyPzogbnVtYmVyIHwgU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgbGV0IHBlcmlvZCA9IC0xO1xuICBpZiAoaXNOdW1lcmljKHBlcmlvZE9yU2NoZWR1bGVyKSkge1xuICAgIHBlcmlvZCA9IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcikgPCAxICYmIDEgfHwgTnVtYmVyKHBlcmlvZE9yU2NoZWR1bGVyKTtcbiAgfSBlbHNlIGlmIChpc1NjaGVkdWxlcihwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBwZXJpb2RPclNjaGVkdWxlciBhcyBhbnk7XG4gIH1cblxuICBpZiAoIWlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBkdWUgPSBpc051bWVyaWMoZHVlVGltZSlcbiAgICAgID8gKGR1ZVRpbWUgYXMgbnVtYmVyKVxuICAgICAgOiAoK2R1ZVRpbWUgLSBzY2hlZHVsZXIubm93KCkpO1xuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgZHVlLCB7XG4gICAgICBpbmRleDogMCwgcGVyaW9kLCBzdWJzY3JpYmVyXG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVGltZXJTdGF0ZSB7XG4gIGluZGV4OiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUaW1lclN0YXRlPiwgc3RhdGU6IFRpbWVyU3RhdGUpIHtcbiAgY29uc3QgeyBpbmRleCwgcGVyaW9kLCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcbiAgc3Vic2NyaWJlci5uZXh0KGluZGV4KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAocGVyaW9kID09PSAtMSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgcGVyaW9kKTtcbn1cbiIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFVuc3Vic2NyaWJhYmxlLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJzsgLy8gZnJvbSBmcm9tIGZyb20hIExBV0xcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgdXNlcyBhIHJlc291cmNlIHdoaWNoIHdpbGwgYmUgZGlzcG9zZWQgYXQgdGhlIHNhbWUgdGltZSBhcyB0aGUgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VXNlIGl0IHdoZW4geW91IGNhdGNoIHlvdXJzZWxmIGNsZWFuaW5nIHVwIGFmdGVyIGFuIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqIGB1c2luZ2AgaXMgYSBmYWN0b3J5IG9wZXJhdG9yLCB3aGljaCBhY2NlcHRzIHR3byBmdW5jdGlvbnMuIEZpcnN0IGZ1bmN0aW9uIHJldHVybnMgYSBkaXNwb3NhYmxlIHJlc291cmNlLlxuICogSXQgY2FuIGJlIGFuIGFyYml0cmFyeSBvYmplY3QgdGhhdCBpbXBsZW1lbnRzIGB1bnN1YnNjcmliZWAgbWV0aG9kLiBTZWNvbmQgZnVuY3Rpb24gd2lsbCBiZSBpbmplY3RlZCB3aXRoXG4gKiB0aGF0IG9iamVjdCBhbmQgc2hvdWxkIHJldHVybiBhbiBPYnNlcnZhYmxlLiBUaGF0IE9ic2VydmFibGUgY2FuIHVzZSByZXNvdXJjZSBvYmplY3QgZHVyaW5nIGl0cyBleGVjdXRpb24uXG4gKiBCb3RoIGZ1bmN0aW9ucyBwYXNzZWQgdG8gYHVzaW5nYCB3aWxsIGJlIGNhbGxlZCBldmVyeSB0aW1lIHNvbWVvbmUgc3Vic2NyaWJlcyAtIG5laXRoZXIgYW4gT2JzZXJ2YWJsZSBub3JcbiAqIHJlc291cmNlIG9iamVjdCB3aWxsIGJlIHNoYXJlZCBpbiBhbnkgd2F5IGJldHdlZW4gc3Vic2NyaXB0aW9ucy5cbiAqXG4gKiBXaGVuIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgYHVzaW5nYCBpcyBzdWJzY3JpYmVkLCBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gdGhlIHNlY29uZCBmdW5jdGlvbiB3aWxsIGJlIHN1YnNjcmliZWRcbiAqIGFzIHdlbGwuIEFsbCBpdHMgbm90aWZpY2F0aW9ucyAobmV4dGVkIHZhbHVlcywgY29tcGxldGlvbiBhbmQgZXJyb3IgZXZlbnRzKSB3aWxsIGJlIGVtaXR0ZWQgdW5jaGFuZ2VkIGJ5IHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIElmIGhvd2V2ZXIgc29tZW9uZSB1bnN1YnNjcmliZXMgZnJvbSB0aGUgT2JzZXJ2YWJsZSBvciBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgb3IgZXJyb3JzIGJ5IGl0c2VsZixcbiAqIHRoZSBgdW5zdWJzY3JpYmVgIG1ldGhvZCBvbiByZXNvdXJjZSBvYmplY3Qgd2lsbCBiZSBjYWxsZWQuIFRoaXMgY2FuIGJlIHVzZWQgdG8gZG8gYW55IG5lY2Vzc2FyeSBjbGVhbiB1cCwgd2hpY2hcbiAqIG90aGVyd2lzZSB3b3VsZCBoYXZlIHRvIGJlIGhhbmRsZWQgYnkgaGFuZC4gTm90ZSB0aGF0IGNvbXBsZXRlIG9yIGVycm9yIG5vdGlmaWNhdGlvbnMgYXJlIG5vdCBlbWl0dGVkIHdoZW4gc29tZW9uZVxuICogY2FuY2VscyBzdWJzY3JpcHRpb24gdG8gYW4gT2JzZXJ2YWJsZSB2aWEgYHVuc3Vic2NyaWJlYCwgc28gYHVzaW5nYCBjYW4gYmUgdXNlZCBhcyBhIGhvb2ssIGFsbG93aW5nIHlvdSB0byBtYWtlXG4gKiBzdXJlIHRoYXQgYWxsIHJlc291cmNlcyB3aGljaCBuZWVkIHRvIGV4aXN0IGR1cmluZyBhbiBPYnNlcnZhYmxlIGV4ZWN1dGlvbiB3aWxsIGJlIGRpc3Bvc2VkIGF0IGFwcHJvcHJpYXRlIHRpbWUuXG4gKlxuICogQHNlZSB7QGxpbmsgZGVmZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBJU3Vic2NyaXB0aW9ufSByZXNvdXJjZUZhY3RvcnkgQSBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFueSByZXNvdXJjZSBvYmplY3RcbiAqIHRoYXQgaW1wbGVtZW50cyBgdW5zdWJzY3JpYmVgIG1ldGhvZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24ocmVzb3VyY2U6IElTdWJzY3JpcHRpb24pOiBPYnNlcnZhYmxlPFQ+fSBvYnNlcnZhYmxlRmFjdG9yeSBBIGZ1bmN0aW9uIHdoaWNoXG4gKiBjcmVhdGVzIGFuIE9ic2VydmFibGUsIHRoYXQgY2FuIHVzZSBpbmplY3RlZCByZXNvdXJjZSBvYmplY3QuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgYmVoYXZlcyB0aGUgc2FtZSBhcyBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGBvYnNlcnZhYmxlRmFjdG9yeWAsIGJ1dFxuICogd2hpY2ggLSB3aGVuIGNvbXBsZXRlZCwgZXJyb3JlZCBvciB1bnN1YnNjcmliZWQgLSB3aWxsIGFsc28gY2FsbCBgdW5zdWJzY3JpYmVgIG9uIGNyZWF0ZWQgcmVzb3VyY2Ugb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNpbmc8VD4ocmVzb3VyY2VGYWN0b3J5OiAoKSA9PiBVbnN1YnNjcmliYWJsZSB8IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUZhY3Rvcnk6IChyZXNvdXJjZTogVW5zdWJzY3JpYmFibGUgfCB2b2lkKSA9PiBPYnNlcnZhYmxlSW5wdXQ8VD4gfCB2b2lkKTogT2JzZXJ2YWJsZTxUPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgcmVzb3VyY2U6IFVuc3Vic2NyaWJhYmxlIHwgdm9pZDtcblxuICAgIHRyeSB7XG4gICAgICByZXNvdXJjZSA9IHJlc291cmNlRmFjdG9yeSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4gfCB2b2lkO1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBvYnNlcnZhYmxlRmFjdG9yeShyZXNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZSA9IHJlc3VsdCA/IGZyb20ocmVzdWx0KSA6IEVNUFRZO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKHJlc291cmNlKSB7XG4gICAgICAgIHJlc291cmNlLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBQYXJ0aWFsT2JzZXJ2ZXIgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJuYWwvc3ltYm9sL2l0ZXJhdG9yJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBUKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyKSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMykgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1LCBSPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCByZXN1bHRTZWxlY3RvcjogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUsIHY2OiBUNikgPT4gUik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+KTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxUPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSwgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VD4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCAoKC4uLnZhbHVlczogQXJyYXk8VD4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb21iaW5lcyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0byBjcmVhdGUgYW4gT2JzZXJ2YWJsZSB3aG9zZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgdmFsdWVzLCBpbiBvcmRlciwgb2YgZWFjaFxuICogb2YgaXRzIGlucHV0IE9ic2VydmFibGVzLlxuICpcbiAqIElmIHRoZSBsYXRlc3QgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb24sIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjb21wdXRlIHRoZSBjcmVhdGVkIHZhbHVlIGZyb20gdGhlIGlucHV0IHZhbHVlcy5cbiAqIE90aGVyd2lzZSwgYW4gYXJyYXkgb2YgdGhlIGlucHV0IHZhbHVlcyBpcyByZXR1cm5lZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb21iaW5lIGFnZSBhbmQgbmFtZSBmcm9tIGRpZmZlcmVudCBzb3VyY2VzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgYWdlJCA9IG9mPG51bWJlcj4oMjcsIDI1LCAyOSk7XG4gKiBsZXQgbmFtZSQgPSBvZjxzdHJpbmc+KCdGb28nLCAnQmFyJywgJ0JlZXInKTtcbiAqIGxldCBpc0RldiQgPSBvZjxib29sZWFuPih0cnVlLCB0cnVlLCBmYWxzZSk7XG4gKlxuICogemlwKGFnZSQsIG5hbWUkLCBpc0RldiQpLnBpcGUoXG4gKiAgIG1hcCgoYWdlOiBudW1iZXIsIG5hbWU6IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pID0+ICh7IGFnZSwgbmFtZSwgaXNEZXYgfSkpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBvdXRwdXRzXG4gKiAvLyB7IGFnZTogMjcsIG5hbWU6ICdGb28nLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjUsIG5hbWU6ICdCYXInLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjksIG5hbWU6ICdCZWVyJywgaXNEZXY6IGZhbHNlIH1cbiAqIGBgYFxuICogQHBhcmFtIG9ic2VydmFibGVzXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fVxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB6aXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj4ge1xuICBjb25zdCByZXN1bHRTZWxlY3RvciA9IDwoKC4uLnlzOiBBcnJheTxhbnk+KSA9PiBSKT4gb2JzZXJ2YWJsZXNbb2JzZXJ2YWJsZXMubGVuZ3RoIC0gMV07XG4gIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvYnNlcnZhYmxlcy5wb3AoKTtcbiAgfVxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCB1bmRlZmluZWQpLmxpZnQobmV3IFppcE9wZXJhdG9yKHJlc3VsdFNlbGVjdG9yKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBaaXBPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcblxuICByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUjtcblxuICBjb25zdHJ1Y3RvcihyZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpIHtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3I7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgWmlwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnJlc3VsdFNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBaaXBTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgdmFsdWVzOiBhbnk7XG4gIHByaXZhdGUgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFI7XG4gIHByaXZhdGUgaXRlcmF0b3JzOiBMb29rQWhlYWRJdGVyYXRvcjxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBhY3RpdmUgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICByZXN1bHRTZWxlY3Rvcj86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIsXG4gICAgICAgICAgICAgIHZhbHVlczogYW55ID0gT2JqZWN0LmNyZWF0ZShudWxsKSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnJlc3VsdFNlbGVjdG9yID0gKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykgPyByZXN1bHRTZWxlY3RvciA6IG51bGw7XG4gICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFN0YXRpY0FycmF5SXRlcmF0b3IodmFsdWUpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZVtTeW1ib2xfaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgU3RhdGljSXRlcmF0b3IodmFsdWVbU3ltYm9sX2l0ZXJhdG9yXSgpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBaaXBCdWZmZXJJdGVyYXRvcih0aGlzLmRlc3RpbmF0aW9uLCB0aGlzLCB2YWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgY29uc3QgbGVuID0gaXRlcmF0b3JzLmxlbmd0aDtcblxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2ZSA9IGxlbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3I6IFppcEJ1ZmZlckl0ZXJhdG9yPGFueSwgYW55PiA9IDxhbnk+aXRlcmF0b3JzW2ldO1xuICAgICAgaWYgKGl0ZXJhdG9yLnN0aWxsVW5zdWJzY3JpYmVkKSB7XG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgICAgIGRlc3RpbmF0aW9uLmFkZChpdGVyYXRvci5zdWJzY3JpYmUoaXRlcmF0b3IsIGkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWN0aXZlLS07IC8vIG5vdCBhbiBvYnNlcnZhYmxlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5SW5hY3RpdmUoKSB7XG4gICAgdGhpcy5hY3RpdmUtLTtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0l0ZXJhdG9ycygpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSB0aGlzLml0ZXJhdG9ycztcbiAgICBjb25zdCBsZW4gPSBpdGVyYXRvcnMubGVuZ3RoO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgIC8vIGFib3J0IGlmIG5vdCBhbGwgb2YgdGhlbSBoYXZlIHZhbHVlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvciA9IGl0ZXJhdG9yc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgaXRlcmF0b3IuaGFzVmFsdWUgPT09ICdmdW5jdGlvbicgJiYgIWl0ZXJhdG9yLmhhc1ZhbHVlKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzaG91bGRDb21wbGV0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGFyZ3M6IGFueVtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGl0ZXJhdG9yID0gaXRlcmF0b3JzW2ldO1xuICAgICAgbGV0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcblxuICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIGl0J3MgY29tcGxldGVkIG5vdyB0aGF0IHlvdSd2ZSBnb3R0ZW5cbiAgICAgIC8vIHRoZSBuZXh0IHZhbHVlLlxuICAgICAgaWYgKGl0ZXJhdG9yLmhhc0NvbXBsZXRlZCgpKSB7XG4gICAgICAgIHNob3VsZENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXJncy5wdXNoKHJlc3VsdC52YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVzdWx0U2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuX3RyeXJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KGFyZ3MpO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRDb21wbGV0ZSkge1xuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RyeXJlc3VsdFNlbGVjdG9yKGFyZ3M6IGFueVtdKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnJlc3VsdFNlbGVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQocmVzdWx0KTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgTG9va0FoZWFkSXRlcmF0b3I8VD4gZXh0ZW5kcyBJdGVyYXRvcjxUPiB7XG4gIGhhc1ZhbHVlKCk6IGJvb2xlYW47XG4gIGhhc0NvbXBsZXRlZCgpOiBib29sZWFuO1xufVxuXG5jbGFzcyBTdGF0aWNJdGVyYXRvcjxUPiBpbXBsZW1lbnRzIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IHtcbiAgcHJpdmF0ZSBuZXh0UmVzdWx0OiBJdGVyYXRvclJlc3VsdDxUPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGl0ZXJhdG9yOiBJdGVyYXRvcjxUPikge1xuICAgIHRoaXMubmV4dFJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5uZXh0UmVzdWx0O1xuICAgIHRoaXMubmV4dFJlc3VsdCA9IHRoaXMuaXRlcmF0b3IubmV4dCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgY29uc3QgbmV4dFJlc3VsdCA9IHRoaXMubmV4dFJlc3VsdDtcbiAgICByZXR1cm4gbmV4dFJlc3VsdCAmJiBuZXh0UmVzdWx0LmRvbmU7XG4gIH1cbn1cblxuY2xhc3MgU3RhdGljQXJyYXlJdGVyYXRvcjxUPiBpbXBsZW1lbnRzIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IHtcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XG4gIHByaXZhdGUgbGVuZ3RoID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFycmF5OiBUW10pIHtcbiAgICB0aGlzLmxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIFtTeW1ib2xfaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbmV4dCh2YWx1ZT86IGFueSk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCBpID0gdGhpcy5pbmRleCsrO1xuICAgIGNvbnN0IGFycmF5ID0gdGhpcy5hcnJheTtcbiAgICByZXR1cm4gaSA8IHRoaXMubGVuZ3RoID8geyB2YWx1ZTogYXJyYXlbaV0sIGRvbmU6IGZhbHNlIH0gOiB7IHZhbHVlOiBudWxsLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBoYXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGggPiB0aGlzLmluZGV4O1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gdGhpcy5pbmRleDtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgWmlwQnVmZmVySXRlcmF0b3I8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4gaW1wbGVtZW50cyBMb29rQWhlYWRJdGVyYXRvcjxUPiB7XG4gIHN0aWxsVW5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgYnVmZmVyOiBUW10gPSBbXTtcbiAgaXNDb21wbGV0ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcGFyZW50OiBaaXBTdWJzY3JpYmVyPFQsIFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIG9ic2VydmFibGU6IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBbU3ltYm9sX2l0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIE5PVEU6IHRoZXJlIGlzIGFjdHVhbGx5IGEgbmFtZSBjb2xsaXNpb24gaGVyZSB3aXRoIFN1YnNjcmliZXIubmV4dCBhbmQgSXRlcmF0b3IubmV4dFxuICAvLyAgICB0aGlzIGlzIGxlZ2l0IGJlY2F1c2UgYG5leHQoKWAgd2lsbCBuZXZlciBiZSBjYWxsZWQgYnkgYSBzdWJzY3JpcHRpb24gaW4gdGhpcyBjYXNlLlxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzQ29tcGxldGUpIHtcbiAgICAgIHJldHVybiB7IHZhbHVlOiBudWxsLCBkb25lOiB0cnVlIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7IHZhbHVlOiBidWZmZXIuc2hpZnQoKSwgZG9uZTogZmFsc2UgfTtcbiAgICB9XG4gIH1cblxuICBoYXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIubGVuZ3RoID09PSAwICYmIHRoaXMuaXNDb21wbGV0ZTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCkge1xuICAgIGlmICh0aGlzLmJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgdGhpcy5wYXJlbnQubm90aWZ5SW5hY3RpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmJ1ZmZlci5wdXNoKGlubmVyVmFsdWUpO1xuICAgIHRoaXMucGFyZW50LmNoZWNrSXRlcmF0b3JzKCk7XG4gIH1cblxuICBzdWJzY3JpYmUodmFsdWU6IGFueSwgaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb1Jlc3VsdDxhbnksIGFueT4odGhpcywgdGhpcy5vYnNlcnZhYmxlLCB0aGlzLCBpbmRleCk7XG4gIH1cbn1cbiIsIi8qIE9ic2VydmFibGUgKi9cbmV4cG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL09ic2VydmFibGUnO1xuZXhwb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5leHBvcnQgeyBHcm91cGVkT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvb3BlcmF0b3JzL2dyb3VwQnknO1xuZXhwb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuL2ludGVybmFsL09wZXJhdG9yJztcbmV4cG9ydCB7IG9ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL3N5bWJvbC9vYnNlcnZhYmxlJztcblxuLyogU3ViamVjdHMgKi9cbmV4cG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL2ludGVybmFsL1N1YmplY3QnO1xuZXhwb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAnLi9pbnRlcm5hbC9CZWhhdmlvclN1YmplY3QnO1xuZXhwb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJy4vaW50ZXJuYWwvUmVwbGF5U3ViamVjdCc7XG5leHBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuL2ludGVybmFsL0FzeW5jU3ViamVjdCc7XG5cbi8qIFNjaGVkdWxlcnMgKi9cbmV4cG9ydCB7IGFzYXAgYXMgYXNhcFNjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL2FzYXAnO1xuZXhwb3J0IHsgYXN5bmMgYXMgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9hc3luYyc7XG5leHBvcnQgeyBxdWV1ZSBhcyBxdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vaW50ZXJuYWwvc2NoZWR1bGVyL3F1ZXVlJztcbmV4cG9ydCB7IGFuaW1hdGlvbkZyYW1lIGFzIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9pbnRlcm5hbC9zY2hlZHVsZXIvYW5pbWF0aW9uRnJhbWUnO1xuZXhwb3J0IHsgVmlydHVhbFRpbWVTY2hlZHVsZXIsIFZpcnR1YWxBY3Rpb24gfSBmcm9tICcuL2ludGVybmFsL3NjaGVkdWxlci9WaXJ0dWFsVGltZVNjaGVkdWxlcic7XG5leHBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuL2ludGVybmFsL1NjaGVkdWxlcic7XG5cbi8qIFN1YnNjcmlwdGlvbiAqL1xuZXhwb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9pbnRlcm5hbC9TdWJzY3JpcHRpb24nO1xuZXhwb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vaW50ZXJuYWwvU3Vic2NyaWJlcic7XG5cbi8qIE5vdGlmaWNhdGlvbiAqL1xuZXhwb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi9pbnRlcm5hbC9Ob3RpZmljYXRpb24nO1xuXG4vKiBVdGlscyAqL1xuZXhwb3J0IHsgcGlwZSB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9waXBlJztcbmV4cG9ydCB7IG5vb3AgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvbm9vcCc7XG5leHBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9pZGVudGl0eSc7XG5leHBvcnQgeyBpc09ic2VydmFibGUgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvaXNPYnNlcnZhYmxlJztcblxuLyogRXJyb3IgdHlwZXMgKi9cbmV4cG9ydCB7IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yJztcbmV4cG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuL2ludGVybmFsL3V0aWwvRW1wdHlFcnJvcic7XG5leHBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vaW50ZXJuYWwvdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5leHBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuZXhwb3J0IHsgVGltZW91dEVycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlsL1RpbWVvdXRFcnJvcic7XG5cbi8qIFN0YXRpYyBvYnNlcnZhYmxlIGNyZWF0aW9uIGV4cG9ydHMgKi9cbmV4cG9ydCB7IGJpbmRDYWxsYmFjayB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kQ2FsbGJhY2snO1xuZXhwb3J0IHsgYmluZE5vZGVDYWxsYmFjayB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kTm9kZUNhbGxiYWNrJztcbmV4cG9ydCB7IGNvbWJpbmVMYXRlc3QgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvY29tYmluZUxhdGVzdCc7XG5leHBvcnQgeyBjb25jYXQgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvY29uY2F0JztcbmV4cG9ydCB7IGRlZmVyIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2RlZmVyJztcbmV4cG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2VtcHR5JztcbmV4cG9ydCB7IGZvcmtKb2luIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2ZvcmtKb2luJztcbmV4cG9ydCB7IGZyb20gfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZnJvbSc7XG5leHBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZnJvbUV2ZW50JztcbmV4cG9ydCB7IGZyb21FdmVudFBhdHRlcm4gfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZnJvbUV2ZW50UGF0dGVybic7XG5leHBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9nZW5lcmF0ZSc7XG5leHBvcnQgeyBpaWYgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvaWlmJztcbmV4cG9ydCB7IGludGVydmFsIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2ludGVydmFsJztcbmV4cG9ydCB7IG1lcmdlIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL21lcmdlJztcbmV4cG9ydCB7IG5ldmVyIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL25ldmVyJztcbmV4cG9ydCB7IG9mIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL29mJztcbmV4cG9ydCB7IG9uRXJyb3JSZXN1bWVOZXh0IH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL29uRXJyb3JSZXN1bWVOZXh0JztcbmV4cG9ydCB7IHBhaXJzIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzJztcbmV4cG9ydCB7IHJhY2UgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvcmFjZSc7XG5leHBvcnQgeyByYW5nZSB9IGZyb20gJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9yYW5nZSc7XG5leHBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuZXhwb3J0IHsgdGltZXIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvdGltZXInO1xuZXhwb3J0IHsgdXNpbmcgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvdXNpbmcnO1xuZXhwb3J0IHsgemlwIH0gZnJvbSAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL3ppcCc7XG5cbi8qIENvbnN0YW50cyAqL1xuZXhwb3J0IHsgRU1QVFkgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvZW1wdHknO1xuZXhwb3J0IHsgTkVWRVIgfSBmcm9tICcuL2ludGVybmFsL29ic2VydmFibGUvbmV2ZXInO1xuXG4vKiBUeXBlcyAqL1xuZXhwb3J0ICogZnJvbSAnLi9pbnRlcm5hbC90eXBlcyc7XG5cbi8qIENvbmZpZyAqL1xuZXhwb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9pbnRlcm5hbC9jb25maWcnO1xuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmd4Tm90aWZpY2F0aW9uc1NlcnZpY2Uge1xuXG4gIHB1YmxpYyB0b3BpYzogU3ViamVjdDxhbnk+O1xuICBwdWJsaWMgb2JzZXJ2ZXI6IE9ic2VydmFibGU8YW55PjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluaXROb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDDpcKIwp3DpcKnwovDpcKMwpZcbiAgICovXG4gIHB1YmxpYyBpbml0Tm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMudG9waWMgPSBuZXcgU3ViamVjdCgpO1xuICAgIHRoaXMub2JzZXJ2ZXIgPSB0aGlzLnRvcGljLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIMOowo7Ct8Olwo/ClsOowqfCgsOlwq/Cn8OowoDChVxuICAgKi9cbiAgcHVibGljIGdldE5vdGlmaWNhdGlvbigpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm9ic2VydmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIMOlwo/CkcOlwrjCg1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgcHVibGljIHB1Ymxpc2goZGF0YToge1xuICAgIGFjdDogYW55LFxuICAgIGRhdGE/OiBhbnlcbiAgfSk6IHZvaWQge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLnRvcGljLm5leHQoZGF0YSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmd4LW5vdGlmaWNhdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxwPlxuICAgICAgbmd4LW5vdGlmaWNhdGlvbnMgd29ya3MhXG4gICAgPC9wPlxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIE5neE5vdGlmaWNhdGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neE5vdGlmaWNhdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL25neC1ub3RpZmljYXRpb25zLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbTmd4Tm90aWZpY2F0aW9uc0NvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ3hOb3RpZmljYXRpb25zQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hOb3RpZmljYXRpb25zTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbInRzbGliXzEuX19leHRlbmRzIiwib2JzZXJ2YWJsZSIsIlJlZkNvdW50U3Vic2NyaWJlciIsInJlZkNvdW50IiwiaXRlcmF0b3IiLCJTeW1ib2xfaXRlcmF0b3IiLCJTeW1ib2xfb2JzZXJ2YWJsZSJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7O0FDQUE7QUFNQTtJQUtTO0lBVVA7UUFDRTtZQUNFO1lBQ0E7Ozs7Ozs7O1FBUUY7Ozs7O0FDM0JKOzRCQUMyQjs7OztBQ0wzQjtBQUNBLFNBR2M7SUFDWixNQUFBO0lBQ0E7O1lBRUksTUFBTTs7Ozs7Ozs7OztBQ1RaOzs7QUNBQTtTQUNjLFFBQVE7Ozs7QUNBdEI7OztBQ0RBO0FBRUEsQUFFQSxtQkFBbUI7O1FBRWY7Ozs7UUFHQSxrQkFBa0I7Ozs7aUJBS0E7SUFDcEIsaUJBQXNCOzs7O0FDUHhCO1NBQ087SUFDTCxLQUFLLFVBQVU7UUFDWjtRQUVDO0lBQ0osSUFBSSxDQUFDO0lBQ0wsV0FBVzs7O0FBU2IsaUNBQTRELHVCQUE4QixDQUFDOzs7QUN4QjNGO0FBQ0EsSUEyQ0U7O1FBVlUsbUJBQTRCLENBQUM7UUFFN0Isb0JBQStCO1FBRWpDO1FBT04sSUFBSTtZQUNLOzs7OztRQVlULElBQUk7UUFFSixJQUFJO1lBQ0Y7OztRQUtGLElBQUk7UUFDSixJQUFJLENBQUMsY0FBYztRQUNuQixJQUFJLENBQUMsZUFBZTtRQUdwQixJQUFJLENBQUM7UUFFTCxJQUFJO1FBQ0osSUFBSTtRQUlKLE9BQU87O1lBSUwsT0FBTyxhQUFhOzs7WUFJcEI7WUFDQSxJQUFJLEtBQUs7Z0JBQ1A7Z0JBQ0EsU0FBUzsrQ0FFc0IsQ0FBQyxhQUFhOzs7O1lBTy9DLFFBQVE7WUFDUjtZQUVBLG9CQUFvQjswQkFDTjtnQkFDWixJQUFJO29CQUNGLFNBQVMsR0FBRztvQkFDWixJQUFJLEtBQUssZ0JBQWdCO3dCQUN2Qjt3QkFDQSxTQUFTO3dCQUNULHFCQUFxQixDQUFDO3dCQUN0QixJQUFJLEdBQUc7NEJBQ0wsZUFBZTs7Ozs7Ozs7OztZQVV2Qjs7OzswQkF1QmdCLHlCQUF5QjtZQUN6Qzs7O1lBSUE7OztRQUtGOzs7OztvQkFLTSxtQkFBbUI7Ozs7b0JBR25COzs7O29CQUdBO29CQUNBLFlBQVksbUJBQW1CLEdBQUc7Ozs7Ozs7UUFTeEM7UUFDQSxhQUFhO1FBRWI7OztpQ0FVMkI7UUFDM0IsSUFBSSxhQUFhO1lBQ2Y7WUFDQSxJQUFJLGlCQUFpQjtnQkFDbkI7Ozs7OztRQVFKLElBQUksd0JBQXdCO1lBRzFCLFlBQVk7OztpQkFJUCxXQUFXOzs7eUJBR0gsQ0FBQyxPQUFPLENBQUM7Ozs7O1FBekx4QixZQUFZOzs7OztBQThMaEI7Ozs7QUNyTkE7OzBCQUcwQjtNQUtwQixrQ0FBb0M7OztBQ1QxQyxJQWtCbUMsc0NBQVk7SUF5QzdDQSw2QkFBMkU7O1FBakIxRCx1QkFBc0IsS0FBSztRQUMzQjtRQUNBLHdCQUFrQjtRQUV6Qix3QkFBMkI7UUFHN0I7UUFlTjs7O2dCQUdJLE1BQU07OztvQkFHSixvQkFBbUI7b0JBQ25CLE1BQU07OztvQkFHTjt3QkFDRTt3QkFDQSxLQUFJLENBQUM7d0JBQ0wsaUJBQWlCOzs7O3dCQUdqQixLQUFJLENBQUMsa0JBQWtCOzs7Ozs7Z0JBTTNCLEtBQUksQ0FBQyxrQkFBa0I7Z0JBQ3ZCLE1BQU07Ozs7O0lBckRMLG9CQUFQLGlCQUVpQjt3Q0FDbUI7UUFDbEMsZ0NBQWdDLE1BQU07UUFDdEM7Ozs2QkE0RHFCO1lBQ25CLEtBQUssWUFBWTs7Ozs7WUFhakIsS0FBSyxZQUFZO1lBQ2pCLElBQUksQ0FBQyxZQUFZOzs7OztZQVlqQixLQUFLLFlBQVk7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRzs7Ozt5QkFLRjtZQUNmOzs7UUFHRixpQkFBTTs7O3dCQUlVLENBQUMsS0FBSzs7O3dCQUlOLENBQUMsTUFBTSxHQUFHO1FBQzFCLElBQUksQ0FBQyxXQUFXOzs7d0JBSUEsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVzs7OztRQU1oQixJQUFJLFdBQVc7UUFDZixJQUFJLENBQUMsZUFBZTtRQUNwQixJQUFJLENBQUMsV0FBVztRQUNoQixJQUFJLENBQUMsY0FBYztRQUNuQixJQUFJLENBQUMsU0FBUztRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUN2QixJQUFJLENBQUM7UUFDTCxJQUFJLENBQUMsbUJBQW1CO1FBQ3hCOzs7OztBQVNKLElBQXVDLDBDQUFhO0lBSWxEQSxpQ0FBb0Q7O1FBQWhDLHVCQUFpQjtRQU1uQztRQUNBLElBQUk7UUFFSixJQUFJLFVBQVU7WUFDWjs7O2lDQUU0QztZQUM1QyxzQkFBNkM7WUFDN0MsUUFBUTtZQUNSO2dCQUNFO2dCQUNBLHVCQUF1QjtvQkFDckIsVUFBc0IsUUFBUSxZQUFZOzs7Ozs7UUFPaEQsS0FBSSxDQUFDLFFBQVE7UUFDYixLQUFJLENBQUM7UUFDTCxLQUFJLENBQUMsU0FBUzs7OztrQkFJSixrQkFBa0I7WUFDbEI7WUFDUixJQUFJO2dCQUNGOzs7cUJBRUs7Ozs7O2tCQU1DLFdBQVc7WUFDWDtZQUNBLElBQUE7WUFDUixJQUFJO2dCQUNGLElBQUksQ0FBQztvQkFDSDtvQkFDQSxJQUFJLENBQUMsYUFBYTs7OztvQkFHbEIsSUFBSSxDQUFDOzs7O3FCQUdGO2dCQUNMLElBQUk7b0JBQ0Y7Ozs7OztvQkFLQSx1Q0FBdUM7b0JBQ3ZDLGlCQUFpQixDQUFDOzs7Ozs7Ozs7OztRQVV4QixJQUFJLEtBQUs7WUFDQztZQUNSLElBQUk7Z0JBQ0YsSUFBTTtnQkFFTixJQUFJLDZDQUE2QztvQkFDL0M7b0JBQ0EsSUFBSSxDQUFDLGFBQWE7Ozs7b0JBR2xCLElBQUksQ0FBQzs7Ozs7Ozs7OztZQVVUOzs7O1lBR0EsSUFBSTtnQkFDRixNQUFNOzs7Ozs7OzttQkFRQyxzQ0FBc0M7WUFDL0M7OztZQUdBOzs7O2dCQUdFLE1BQU0sQ0FBQztnQkFDUCxNQUFNLENBQUM7Z0JBQ1AsT0FBTzs7OztnQkFHUDs7Ozs7OztRQVNKLElBQUksaUJBQWlCO1FBQ3JCLElBQUksQ0FBQztRQUNMLDZCQUE2Qjs7Ozs7O0FDaFRqQztBQVNBOztRQUdJLElBQUksdUJBQXFCO1lBQ3ZCLFlBQVk7Ozs7Ozs7Ozs7Ozs7QUNibEI7QUFDQTtRQVVJO1lBQ0U7OztZQUlBOzs7O1FBS0Y7Ozs7OztBQ1RKOzs7QUNYQTs7O0FDREE7QUFpQkE7UUFPSTs7O1FBSUEsVUFBVTs7O3lCQUlPLENBQUM7Ozs7O0FDNUJ0QjtBQUNBLElBK0JFOztRQUNFLElBQUk7WUFDRjs7Ozt5QkEyQmlCLElBQUksYUFBZ0I7UUFDdkMsb0JBQWlCO1FBQ2pCQyxhQUFVLENBQUM7UUFDWEE7OztxQ0ErSDBCO1FBQzFCLElBQU07UUFFTixJQUFJO1lBQ0YsUUFBUTs7OztnQkFJTixJQUFJLENBQUMsV0FBVyxLQUFLO2dCQUNyQixJQUFJLENBQUM7OztZQUtQO2dCQUNFLElBQUksQ0FBQyxrQkFBa0I7Z0JBQ3ZCLElBQUksc0JBQXNCO29CQUN4Qjs7Ozs7Ozs7WUFXSjs7OztnQkFHRTtnQkFDQSxJQUFJLENBQUM7OztnQkFHTCxjQUFjLENBQUM7Ozs7Ozs7O3lCQWdDcEI7UUFqQkM7UUFFQSxXQUFXLDZCQUEwQixFQUFFOztZQUlyQzs7b0JBRUk7OzswQkFFTTtvQkFDTjt3QkFDRSxZQUFZOzs7Ozs7OztRQVVwQixhQUFhLElBQUksT0FBTzs7O2VBc0JqQjs7Ozt5QkFvQ0o7Ozs7WUFFRCxXQUFrQjs7Ozs7eUJBbUJyQjtRQU5DO1FBRUEsV0FBVyw2QkFBb0IsRUFBRTs7WUFFL0I7Ozs7ZUFsU0s7Ozs7O0FBOFNYLFNBQ087UUFDSCxjQUFjOzs7UUFJZDs7Ozs7O0FDbldKO1NBQ087SUFDTCxLQUFLLFVBQVU7SUFDZixJQUFJLENBQUMsT0FBTyx5QkFBeUI7SUFDckMsWUFBWTs7O0FBY2QscUNBQW9FOzs7O0FDdkJwRSxJQU80QywrQ0FBWTtJQUd0REQ7O1FBQW1CLHVCQUFPLENBQVk7UUFBUyxnQkFBVTtRQUZ6RDs7Ozt1QkFPaUI7WUFDYjs7O1FBS0YsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQU07UUFFTixJQUFJO1FBRUosSUFBSSxDQUFDO1lBQ0g7OztRQUtGLElBQUksZUFBZTtZQUNqQjs7Ozs7Ozs7QUNsQ04sSUFXMEMsNkNBQWE7SUFDckRBOztRQUFzQjs7Ozs7O0FBY3hCLElBQWdDLG1DQUFhO0lBZ0IzQ0E7b0JBQ0U7UUFYRixrQkFBMkI7UUFFM0IsZUFBUyxLQUFLLENBQUM7UUFFZixlQUFTO1FBRVQsdUJBQWlCO1FBRWpCLGlCQUFXOzs7O21DQVh3Qjs7O1lBdUIzQixVQUFVLElBQUkscUJBQXFCLEVBQUU7UUFDM0M7UUFDQSxPQUFZOzs7WUFJUjtZQUNGOzs7WUFHUTtZQUNSLElBQU0sZ0JBQWdCO1lBQ3RCLElBQU0sZ0JBQWdCLE1BQU07WUFDNUIsb0JBQW9CLE1BQU0sRUFBRTtxQkFDckIsQ0FBQyxNQUFNLENBQUMsTUFBTTs7Ozs7WUFNbkI7WUFDRjs7O1FBR0YsSUFBSSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQjtRQUNkLElBQUE7UUFDUixJQUFNLGdCQUFnQjtRQUN0QixJQUFNLGdCQUFnQixNQUFNO1FBQzVCLG9CQUFvQixNQUFNLEVBQUU7aUJBQ3JCLENBQUMsT0FBTyxNQUFNOzs7OztZQU1qQjtZQUNGOzs7UUFHTSxJQUFBO1FBQ1IsSUFBTSxnQkFBZ0I7UUFDdEIsSUFBTSxnQkFBZ0IsTUFBTTtRQUM1QixvQkFBb0IsTUFBTSxFQUFFO2lCQUNyQixDQUFDLFVBQVUsR0FBRzs7Ozs7WUFNakIsVUFBVTtRQUNkLElBQUksQ0FBQyxTQUFTO1FBQ2QsSUFBSSxDQUFDLFNBQVM7OztZQUtWO1lBQ0Y7Ozs7Ozs7WUFRRTtZQUNGOzs7c0JBRVU7WUFDVjs7O3NCQUVVLFNBQVMsRUFBRTtZQUNyQixtQkFBbUI7Ozs7WUFHbkIsOEJBQThCLENBQUM7Ozs7WUFXM0IsVUFBVTtRQUNWLGlCQUFrQjtRQUN4QixpQkFBaUI7Ozs7Ozs7O0FBT3JCLElBQXlDLDRDQUFVO0lBQ2pEQTs7UUFBc0I7UUFFcEIsS0FBSSxDQUFDOzs7OztRQUtMLElBQUksV0FBVyxvQkFBb0I7WUFDakMsV0FBVzs7Ozs7UUFNYixJQUFJLFdBQVc7WUFDYiwwQkFBMEIsQ0FBQzs7OzswQ0FLVjtRQUNuQixJQUFJLFdBQVc7WUFDYiwyQkFBMkI7Ozs7O1FBTzdCLElBQUksTUFBTTtZQUNSOzs7Ozs7Ozs7OztBQ25MTjs7Ozs7SUFhRTs7Ozs7UUFLUyx1QkFBd0I7UUFFL0IscUJBQXVCO1FBQ3ZCLElBQU07UUFFTixJQUFJLFlBQVk7WUFDUCxXQUFZOzs7Ozs7O0lBT1csOENBQWE7SUFJL0NBOztRQUNvQjs7Ozs7UUFPbEIsSUFBSSxjQUFjO1lBQ2hCO1lBQ0E7OztRQUlGLElBQU07UUFDTixJQUFJLFFBQVE7WUFDVixlQUFlO1lBQ2Y7OztRQUlGLFlBQVk7WUFDVjtZQUNBOzs7UUE0QkYsSUFBTTtRQUNOLElBQUksbUJBQW1CO1FBRXZCLElBQUk7WUFDRixnQkFBZ0I7Ozs7Ozs7O0FDM0Z0QixJQVc4QyxpREFBYTtJQVF6REEsK0JBQ3NCOztRQURILFlBQU07UUFDSDtRQU5aLG9CQUFzQjtRQUdoQyxvQkFBYzs7Ozs7OzswQkFhUSxTQUFTLENBQUM7UUFDOUIsSUFBSTtZQUNGLG9CQUFvQjs7Ozs7eUJBTUw7UUFDakIsSUFBSSxhQUFhO1lBQ2Y7WUFDQTtZQUNBLFVBQVU7MEJBQ0UsQ0FBQyxJQUFJOzBCQUNILENBQUM7Z0JBQ2IsbUJBQW1CO2dCQUNuQjs7Ozs7Ozs7O29DQVN3Qjs7Ozs7QUFJaEMsSUFjdUMsaURBQW9CO0lBQ3pEQTsyREFHQztRQUZtQjs7Ozt5QkFJRDtRQUNqQixpQkFBTTs7O3lCQUdXLFdBQVc7UUFDNUIsSUFBSSxDQUFDLFlBQVk7UUFDakIsaUJBQU07OzswQkFHbUI7UUFDekIsSUFBSSxXQUFXO1lBQ2I7WUFDQSxJQUFNO1lBQ047WUFDQSxXQUFXLENBQUM7WUFDWixXQUFXLENBQUMsV0FBVztZQUN2QjtnQkFDRSxVQUFVOzs7Ozs7O0lBeUJrQkUsZ0RBQWE7SUFJL0NGOztRQUNvQjs7Ozs7UUFPbEIsSUFBSSxjQUFjO1lBQ2hCO1lBQ0E7OztRQUlGLElBQU07UUFDTixJQUFJRyxXQUFRO1lBQ1ZBLGtCQUFlO1lBQ2Y7OztRQUlGLFlBQVk7WUFDVkE7WUFDQTs7O1FBMkJGLElBQU07UUFDTixJQUFJLG1CQUFtQjtRQUV2QixJQUFJO1lBQ0YsZ0JBQWdCOzs7Ozs7OztBQ25MdEIsSUF5SXlDLDZDQUFhO0lBS3BESDs7UUFDb0I7UUFDQTtRQUNBO1FBQ0E7UUFSWjtRQUNEO1FBQ0E7Ozs7O1FBWUwsSUFBSTtZQUNGOzs7O1lBR0E7Ozs7O3FCQU9XLFdBQVc7UUFFeEIsSUFBSSxTQUFTO1lBQ1gsU0FBUzs7O1FBS1gsSUFBSSxRQUFXO1FBQ2YsSUFBSTtZQUNGLElBQUk7Z0JBQ0Y7Ozs7Ozs7Ozs7WUFTRixRQUFRO1lBQ1IsY0FBYztZQUNkLHFCQUF1QjtZQUN2QixJQUFJLGlCQUFpQjtZQUNyQixJQUFJO2dCQUNGLElBQUksaUJBQWE7Z0JBQ2pCLElBQUk7b0JBQ0Y7Ozs7b0JBR0E7Ozs7OztZQU9KLE1BQU07Ozs7cUJBS08sV0FBVztRQUMxQixJQUFJLE1BQU07WUFDUixNQUFNOzJCQUNPOzs7Ozs7O3FCQVNBLFdBQVc7UUFDMUIsSUFBSSxNQUFNO1lBQ1IsTUFBTTs7Ozs7Ozs7K0JBVWUsQ0FBQzs7OztZQUt0QixLQUFLO1lBQ0wsSUFBSTtnQkFDRjs7Ozs7OztJQVdvQyxtREFBYTtJQUN2REEsbUNBQ3FDLFFBQ3lCOztRQUYxQyxTQUFHLEdBQUg7UUFDQTtRQUNBOzs7Ozs7OztRQVdsQixJQUFJLFdBQVc7UUFDZixJQUFJO1lBQ0YsTUFBTTs7Ozs7O0lBYWlDLDZDQUFhO0lBRXhEQSxvQ0FDNEM7O1FBRHpCLFNBQUcsR0FBSDtRQUNDO1FBQ0E7Ozs7K0JBTU8sY0FBYztRQUNqQyxJQUFBO1FBQ04sSUFBSTtZQUNGLDhDQUE4Qzs7O1FBR2hEOzs7OztBQVNKLElBQXdDLHFEQUFZO0lBQ2xEQTs7UUFBb0IsWUFBTTtRQUV4QixNQUFNLE1BQU0sR0FBRzs7Ozs7UUFLZixJQUFJLGNBQWM7WUFDaEI7WUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ2pCLGdCQUFnQjtnQkFDZCxNQUFNLENBQUMsV0FBVzs7Ozs7Ozs7O0FDelQxQixJQVl3QywyQ0FBVTtJQUVoREE7cUNBQ1M7UUFEVyxZQUFNOzs7Ozs7Ozs7Ozs7UUFXeEIsSUFBSSxZQUFZO1lBQ2QsZ0JBQWdCLGFBQWE7Ozs7OztZQU83Qjs7O3NCQUVVOzs7Ozs7OzZCQU9GLHVCQUFZOzs7Ozs7O0FDekMxQixJQWlCK0Isa0NBQVk7SUFDekNBOzs7O2dDQWEyQjtRQUN6Qjs7Ozs7Ozs7O0FDakNKLElBVW9DLHVDQUFTO0lBTzNDQTs7UUFBc0Isa0JBQUEsVUFBeUI7UUFDekIsa0JBQW1EO1FBSC9ELGFBQU87Ozs7O1FBU2YsSUFBSSxLQUFLO1lBQ1A7U0FDRDtRQUdELElBQUk7WUFFRSxZQUFZOztRQXdCbEIsSUFBSSxNQUFNO1lBQ1IsS0FBSyxLQUFLOztRQUtaLElBQUk7WUFFQSxjQUFjLENBQUM7O1FBSW5CLFlBQVk7O2dFQUdzQztRQUFVOztJQUU5RDs7Ozs7O3lCQVNtQixDQUFDOzs7O1lBVWhCLCtDQUErQzs7O1FBSWpELGdCQUFrQixDQUFDOzt5QkFFSjs7NkJBQ1EsK0JBQStCOzs7OztZQW1CbEQsT0FBTzs7O1lBR1QsSUFBSSxDQUFDLEtBQUssS0FBSztTQUNoQjs7MEJBQ2U7WUFDZCxVQUFVLEtBQUssQ0FBQzs7UUFFbEIsSUFBSTtZQUNGLElBQUksQ0FBQyxXQUFXOzs7O3lDQU1wQjs7UUFHRSxJQUFNLFNBQVM7WUFDVCxtQkFBbUI7WUFDbkI7Ozs7UUFLTixJQUFJLFVBQVUsR0FBRztRQUVqQixJQUFJLFlBQVk7WUFDZCxPQUFPLGFBQWE7O1FBR3RCLElBQUksWUFBWTtZQUNkLGNBQWM7O1FBR2hCLElBQUksQ0FBQyxZQUFZOzs7Ozs7Ozs7Ozs7O0FDeEpyQixJQVVvQyx1Q0FBYztJQUVoREE7O1FBQXNCLGtCQUFBLFVBQXlCO1FBQ3pCLGtCQUFtRDs7Ozs7UUFLdkUsSUFBSSxLQUFLO1lBQ1A7U0FDRDtRQUNELElBQUksU0FBUztZQUNULGNBQWM7O1FBRWxCOztpQ0FHWTtRQUNaLE9BQU87O2dCQUVELFNBQVMsQ0FBQyxPQUFPOztxREFHQTs7OzhEQUtPLFdBQVcsRUFBRTs7Ozs7Ozs7Ozs7O0FDZi9DO0lBU0UsbUJBQW9CLGVBQThCLEVBQ3RDLEdBQWlDO1FBQWpDLG9CQUFBOzRCQUR1QixHQUFmOzs7Ozt1QkFpQ0gsQ0FBQywyQkFBOEI7O2lCQW5DL0IsR0FBaUI7Ozs7Ozs7OztBQzlCcEMsSUFNb0MsMENBQVM7SUFtQjNDQSxpQ0FDWTs0QkFBQSxpQkFBNkI7UUFEekMsWUFFRTtZQUNFLG1CQUFtQjs7OztnQkFHakIsT0FBTzthQUNSOzswQkF4QnVDOzs7Ozs7UUE0QjRCOzttQkFFN0QscUNBQXFDLE9BQU8sT0FBTzs7Ozs7Ozs7WUFVeEQsYUFBYTs7OztRQUtqQixJQUFJO1FBQ0osSUFBSTs7WUFHRjs7OzBCQUdnQjtRQUVsQjtZQUVJOzs7O1lBSUY7Ozs7Ozs7Ozs7OztBQ3BFTixJQUVvQywwQ0FBYztJQUFsREE7Ozs7Ozs7QUNGQTtBQUNBOztBQ0RBO0FBT0EsU0FtRGdCO2dCQUNHLENBQUM7Ozs7Ozs7QUN6RHBCO1NBQ2MsV0FBaUIsTUFBTzs7OztBQ0d0QztpQ0FDc0MsT0FBTzsrQkFDbEIsRUFBRTs7NEJBRUg7Ozs7Ozs7O0FDVjFCO0FBRUE7UUFLSTs7OzttQkFHVyxxQkFBcUI7WUFDOUIsSUFBSSxNQUFNO1lBQ1YsSUFBSSxJQUFJO2dCQUNOLElBQUksa0JBQWtCO29CQUNwQixXQUFXO29CQUNYOzs7Z0JBR0YsZUFBZSxDQUFDLE1BQU07b0JBQ3BCLFlBQVk7Ozs7Ozs7OztBQ25CdEI7QUFFQTtRQUVJLHVCQUF1QjtRQUN2QixVQUFVLENBQUMsVUFBVSxDQUFDOzs7SUFHdkIsTUFBYyxDQUFDO0lBQ2hCLE9BQU87Ozs7QUNSVDtBQUNBLFdBd0V1RDs7Ozs7SUFFckQsSUFBSSxZQUFZLFNBQVMsQ0FBQztRQUN4QixXQUFXOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0VmO0FBb0VBO1FBRUk7Ozs7Ozs7O0lBWUYsc0JBQXNCOzs7O0FDaEZ4QjtBQUNBLElBb0JFO3lCQUErQjtRQUFTO1FBQWtCLFVBQUssR0FBTCxLQUFLLENBQU07UUFDbkUsSUFBSSxDQUFDLFFBQVE7OztnQkFTTCxXQUFXO29CQUNUOzs7Ozs7Ozs7Z0JBa0JBLGFBQWE7UUFDdkIsUUFBUTtvQkFDRTs7Ozs7Ozs7OzBCQW1CUTtZQUNoQjs7Ozs7OztnQkFZUTtRQUNWLFFBQVE7b0JBQ0U7Ozs7Ozs7Ozs7d0NBc0JzQjtZQUM5QixPQUFPOzs7OzsrQkFjYyxlQUFlOzs7Ozs7SUExQnpCLDBEQUFnRTtJQXFDakY7Ozs7O0FDdElBLHVCQW1GK0I7Y0FDVDs7Ozs7UUFObEIsWUFBWTtRQUNaLEtBQUssYUFBYTs7Ozt1QkFXSCxDQUFDLHdCQUNkOzswQ0FNSjtRQUNFLElBQUksQ0FBQztLQUNOO0lBRVM7UUFDUixJQUFJLDhCQUE4QjtRQUNsQyxnQkFBZ0I7S0FDakI7SUFFUztRQUNSLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0lBRXREOztZQW5Db0Q7OzswQ0F1Q0Y7UUFBL0I7O0lBRW5COztBQUNGOzs7Ozs7Ozs7QUN0SEEsSUFlc0MseUNBQVU7SUFNOUNBLHlCQUF5RDtxQ0FBN0M7UUFDQSwyQkFBQTs7O1FBTkosbUJBQXFDOzs7UUFVM0MsaUNBQWdDLElBQUksQ0FBQztRQUVyQzs7OzthQUdPO1lBQ0wsVUFBUzs7Ozs7WUFLTCxVQUFVOztRQUloQixZQUFZOzs7UUFJWjs7NkNBR0Y7WUFDTSxRQUFRLEtBQUs7O1FBR2pCLGlCQUFNLElBQUksWUFBQyxLQUFLLENBQUMsQ0FBQztLQUNuQjtJQUdEO1FBRUUsSUFBTSw4Q0FBOEM7UUFDcEQsSUFBTTtRQUNOLGdCQUFrQixLQUFLLFVBQVU7OztRQUlqQyxJQUFJO1lBQ0YsVUFBVSwwQkFBMEI7OztZQUVwQyxZQUFZOzs7OytCQUdPLG1CQUFtQjs7Ozs7WUFPcEMsbUJBQW1COzs7O1NBSXRCOztZQUNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFrQixPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUM7YUFDOUM7U0FDRjs7WUFHQyxVQUFVLE1BQU0sQ0FBQzs7YUFDWjs7OzRCQUlhOzs7a0NBSU07Ozs7O1FBTTFCLHNCQUF3Qjs7O1FBSXhCLElBQUksV0FBVztRQUtmLGtCQUFrQixnQkFBZ0I7WUFDaEMsV0FBVyxPQUFPLENBQUMsV0FBVyxDQUFDO3NCQUN2Qjs7WUFFUixXQUFXLEdBQUc7O1lBR1osV0FBVzs7O1lBSVgsV0FBVyxHQUFHOzs7dUJBSUg7OztZQUdsQjs7Ozt3QkFHd0IsQ0FBUTs7SUFFakM7Ozs7Ozs7OztBQ3ZJQSxJQVVxQyx3Q0FBVTtJQUEvQ0E7O1FBQ1Usa0JBQWU7UUFDZjtRQUNBLHFCQUF3Qjs7OztnQkFJdEIsQ0FBQyxVQUFVO1lBQ2pCO1lBQ0E7OztzQkFFVSxnQkFBZ0I7WUFDMUIsVUFBVSxDQUFDLFVBQVU7WUFDckIsbUJBQW1COzs7OztpQkFNWjtZQUNQLEtBQUssYUFBYTtZQUNsQixJQUFJLENBQUMsY0FBYzs7OztpQkFLWixlQUFlO1lBQ3RCOzs7OztRQU1GLElBQUk7WUFDRjs7Ozs7Ozs7QUM1Q047QUFFQSxJQUFNLGFBQWE7QUFFbkIsc0JBQXNCOztJQUVwQixJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUU7Ozs7O2tCQU1RO1FBQ1osYUFBYSxhQUFhO1FBQzFCO1FBQ0EsT0FBTzs7O29DQUlxQjs7Ozs7O0FDcEJoQyxJQVNtQyxzQ0FBYztJQUUvQ0E7O1FBQXNCLGtCQUFBLFVBQXdCO1FBQ3hCLGtCQUFtRDs7Ozs7UUFNdkUsSUFBSSxLQUFLLEtBQUssUUFBUTtZQUNwQjtTQUNEO1FBRUQsU0FBUyxTQUFTLElBQUksS0FBSzt5QkFJViw4Q0FBOEMsWUFBWSxDQUN6RTs7O1FBR3lEOzs7O1lBVXZELFNBQVMsQ0FBQzs7WUFFWixtQkFBbUI7Ozs7cUJBS3hCOzs7Ozs7Ozs7QUM5Q0QsSUFFbUMseUNBQWM7SUFBakRBOzs7OzJCQUd1QjtRQUNuQixJQUFJLENBQUMsU0FBUztRQUVQLElBQUEsc0JBQU8sQ0FBUztRQUN2QixJQUFJO1FBQ0osSUFBSSxLQUFLO1FBQ1QsSUFBSSxLQUFLLEdBQVc7UUFDcEIsU0FBUyxVQUFVLE9BQU8sQ0FBQztRQUUzQjs7Z0JBRUk7OzttQkFJTyxRQUFRO1FBRW5CLElBQUksT0FBTztZQUNULE9BQU87a0NBQ2E7Ozs7Ozs7OztBQ3pCMUI7QUFDQTs7QUNEQTtBQUNBOzs7QUNEQSxJQVM2QyxnREFBYztJQUV6REE7aURBRW1CO1FBRkcsa0JBQUEsVUFBa0M7UUFDbEMsa0JBQW1EOzs7OztRQU12RSxJQUFJLEtBQUssS0FBSyxRQUFRO1lBQ3BCO1NBQ0Q7UUFFRCxTQUFTLFNBQVMsSUFBSSxLQUFLO3lCQUlWLHlEQUF5RCxDQUN4RTs7O1FBRW1FOzs4REFLdkMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUU7O1lBS2hELFNBQVMsQ0FBQzs7WUFFWixtQkFBbUI7Ozs7Ozs7Ozs7Ozs7QUN4Q3pCLElBRTZDLG1EQUFjO0lBQTNEQTs7OzsyQkFHdUI7UUFDbkIsSUFBSSxDQUFDLFNBQVM7UUFFUCxJQUFBLHNCQUFPLENBQVM7UUFDdkIsSUFBSTtRQUNKLElBQUksS0FBSztRQUNULElBQUksS0FBSyxHQUFXO1FBQ3BCLFNBQVMsVUFBVSxPQUFPLENBQUM7UUFFM0I7O2dCQUVJOzs7bUJBSU8sUUFBUTtRQUVuQixJQUFJLE9BQU87WUFDVCxPQUFPO2tDQUNhOzs7Ozs7Ozs7QUN6QjFCO0FBQ0E7OztBQ0RBLElBSzBDLGdEQUFjO0lBT3REQSx1Q0FDbUI7NERBRCtCO1FBQy9COzs7UUFKWjt3QkFDa0I7Ozs7UUFjakIsZUFBQztRQUNQLFdBQWdCLE1BQXdCO1FBRXhDLE9BQU87Ozs7O1FBTVA7WUFDRSxpQ0FBaUM7Z0JBQy9CLE1BQU07YUFDUDs7Ozs7OztTQS9CTTs7SUF5Q3lCLHlDQUFjO0lBSWxEOzttQ0FBK0I7YUFDVDsyQkFDSztRQUpqQixtQkFBc0IsQ0FBQzt3Q0FNQTs7O29DQUdsQjtRQUFZO1FBQ3pCLEtBQUssU0FBUzs7O1FBR2Q7O2lCQU1TO1FBQ1QsY0FBYyxRQUFROzs7UUFHNEM7WUFDOUQsd0JBQXdCLFFBQVEsQ0FBQzs7UUFFckMsbUJBQW1CO1FBQ2xCLGFBQXlDO1FBQzFDOzs7O1FBSUE7OztRQUlBLElBQUk7WUFDRixPQUFPOzs7OztpQkFNRixDQUFDLFVBQVU7Ozs7d0JBR04sQ0FBQzs7aUJBQ0o7Z0JBQ0wsT0FBTzs7U0FFVjs7Ozs7Ozs7d0JBTUo7YUExRGdEOzs7Ozs7Ozs7Ozs7Ozs7QUM5Q2pEOztBQ0FBOztBQ09BOztBQ0FBOztBQ0FBOzs7QUNOQSxJQStEa0MseUNBQWE7SUFJN0NBO3NDQUdRLFdBQVc7UUFGQyx1QkFBTyxDQUFnQztRQUozRCxnQkFBa0I7UUFPaEIsS0FBSSxDQUFDLFVBQVU7Ozs7a0JBTUE7UUFDZixJQUFJO1lBQ0Y7Ozs7WUFHQTs7Ozs7Ozs7QUNsRk47O0FDREE7OztBQ0FBLElBUTJDLDJDQUFhO0lBQXhEQTs7Ozs2QkFJeUIsQ0FBQyxVQUFVOzs7OEJBSVY7Ozs7Ozs7Ozs7QUNoQjFCLElBUTJDLDJDQUFhO0lBR3REQSx5QkFBMEQsVUFBYTtxQ0FDOUQ7UUFEVyxZQUFNO1FBQWdDO1FBQXNCLGdCQUFVLEdBQVYsVUFBVSxDQUFRO1FBRjFGLGdCQUFVOzs7O21CQU9MLENBQUMsVUFBVSxLQUFLLGFBQWEsS0FBSyxFQUFFOzs7bUJBSXBDLENBQUMsbUJBQW1CO1FBQy9CLElBQUksQ0FBQzs7O21CQUlNLENBQUMsbUJBQW1CO1FBQy9CLElBQUksQ0FBQzs7Ozs7O0FDekJUO0FBRUEsSUFDUyxxQkFDQzs7O1lBR0Ysc0JBQXNCOzs7YUFLdkI7V0FDRSxVQUFVOzs7Ozs7QUNkbkI7NkJBQ2tDO1FBQzlCLE9BQU87Ozs7O0FBV1gsQUFBTyxJQUFNOztBQ1piO0FBRUEsb0NBQzJDO0lBQ3pDO1FBQ0UsSUFBTUksdUJBQW9CQztRQUMxQjtZQUNFLFdBQVdELFdBQVE7WUFDbkI7Ozs7WUFJQTs7Ozt1QkFNYTtZQUNiOzs7Ozs7Ozs7OztBQ25CTjtBQU9BLElBQ1csd0JBQXdCO0lBQ2pDLDZCQUE2QjtRQUUzQixVQUFVOzs7Ozs7Ozs7O0FDWmQ7OztBQ0FBO1NBQ2MsaUJBQXdCOzs7O0FDRHRDO0FBRUE7UUFhSTs7Z0JBRUksZ0JBQWlCO2dCQUNqQixVQUFVLENBQUMsV0FBVztnQkFDdEI7Ozs7Ozs7O29DQU13QixDQUFDRTs7OytCQUVOLENBQUM7Ozs7Ozs7Ozs7UUFPeEIsSUFBTSx3QkFBc0I7O2NBRXRCOzs7OztBQ2xDVjtBQUdBLDJCQWNFLGlEQUFrRTtJQUVsRSxJQUFJLFdBQVc7UUFDYjtLQUNEO0lBQ0Q7Ozs7Ozs7QUN0QkYsQUE0SkE7SUFzQ21ELG1EQUFxQjtJQU10RU47a0RBQ29CO1FBRDRCLHVCQUFBO1FBTHhDO1FBQ0EsWUFBTSxHQUFVLEVBQUU7UUFDbEIsaUJBQVc7Ozs7O1FBU2pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDOzs7O1FBS3RCLElBQU0sa0JBQWtCO1FBQ3hCLElBQUksR0FBRztZQUNMOzs7O1lBR0EsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNqQixLQUFLLFNBQVMsR0FBRyxHQUFHOztnQkFFbEIsSUFBSSwyQkFBMkI7Ozs7OzRCQU1mLFVBQVU7WUFDNUIsS0FBSyxXQUFXLENBQUM7Ozs7O1FBUW5CLElBQU0sTUFBTSxHQUFHO1FBQ2YsSUFBTSxTQUFTLGtCQUFrQjtZQUMvQjtjQUNFO2NBQ0UsV0FBVyxJQUFJLFVBQVU7UUFFL0Isa0JBQWtCLEdBQUc7WUFDbkIsU0FBUztnQkFDUCxJQUFJLENBQUM7Ozs7Ozs7OztRQVNULElBQUk7WUFDRjs7OztZQUdBOzs7Ozs7OztBQ2hRTjs7QUNEQTs7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTs7O0FDSUE7OztRQXlHVTt5QkFDbUI7Ozs7c0NBU1o7UUFDYixrQkFBa0I7eUJBQ0gsQ0FBQzs7YUFDVDs7O0lBR1Q7eUNBRWtCO1lBQ1o7OztZQUdGLHNCQUFzQjtTQUN2Qjs7O1lBRUMsT0FBTzs7UUFFVCxJQUFJO1lBQ0E7OztZQUlFLHNCQUFzQjtZQUN0Qjs7UUFFTjs7O2dDQUl3QixDQUFDO1FBQ3pCLElBQUksNENBQTRDO1lBQzlDOztRQUVGLGtCQUFrQjtLQUNuQjtJQUVEO1FBR0UsSUFBSSxDQUFDLFlBQVk7Ozs7UUFLakIsSUFBSSxDQUFDOzs7WUFHSCxpQkFBaUIsQ0FBQzs7c0JBQ0osV0FBVztZQUN6Qjs7OzZCQUdMO2lCQWhFNEQ7Ozs7Ozs7OztBQzFHN0Q7O0FDQUE7O0FDQ0E7O0FDRkE7OztBQ0FBLElBaUx1Qyw4Q0FBcUI7SUFLMURBOztRQUNvQix1QkFBTyxDQUEyQjtRQUw5QztRQUVBLG1CQUFhLENBQUM7UUFNcEI7UUFDQSx3QkFBdUIsQ0FBQztRQUV4QixLQUFLLG9CQUFvQixHQUFHLEVBQUU7c0JBQ2hCLEdBQUcsUUFBUSxDQUFDLEVBQUU7WUFDMUIsSUFBTSxpQkFBaUIsR0FBRztZQUUxQixJQUFJLGlCQUFpQjtnQkFDbkI7Ozs7Ozs7UUFTSixJQUFJLENBQUUsa0JBQTBCO1lBQzdCLFNBQWlCLFlBQVk7WUFDOUIsa0JBQWtCOzs7O3VCQUtaO1FBQ1IsSUFBTTtRQUVOLElBQUksbUJBQTRCO1lBQzlCO1lBQ0E7OztRQUtGLElBQUk7WUFDRjs7O1lBSUE7Ozs7Ozs7O0FDak9OOztBQ0FBOztBQ0FBOztBQ0NBOztBQ0RBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOzs7QUNDQSxJQWdFdUMsMENBQXFCO0lBSzFEQTs7UUFKUSx1QkFBMEI7UUFDMUIsaUJBQVcsS0FBd0IsQ0FBQztRQUNwQyxzQkFBZ0M7Ozs7NkJBT2pCOzs7O1FBS3JCLElBQU0sa0JBQWtCO1FBRXhCLElBQUksR0FBRztZQUNMOzs7OzRDQUc4QixDQUFDO2dCQUM3QixJQUFJO2dCQUVKLElBQUk7b0JBQ0YsSUFBSSxDQUFDLGFBQWE7Ozs7Ozs7O2tCQVdkLFVBQVU7WUFDbEIsS0FBSyxXQUFXO1lBRWhCLEtBQUssUUFBUSxHQUFHLElBQUk7cUJBQ2IsS0FBSyxVQUFVO29CQUNsQixnQkFBZ0I7b0JBRWhCLHdCQUF3QjtvQkFDeEIsWUFBWSxZQUFZLEVBQUU7Ozs7Ozs7Ozs7O0FDNUdwQzs7QUNEQTs7QUNBQTs7O0FDQ0EsSUFtR3lDLHlDQUFhO0lBTXBEQTt3REFFd0M7UUFGeEM7NEJBSGdEOztRQU85Qyx1QkFBc0IsQ0FBQywwQkFBMEI7UUFDakQsS0FBSSxDQUFDLFNBQVMsTUFBTTs7OztRQUlwQixhQUFlOzsyQkFFRSx3QkFBd0I7OztZQUV2QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CO1NBQ3hDO2FBQU07WUFDTCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksNkJBQW9DLElBQUksRUFBRTtTQUM5RDs7Ozs7MkJBT2tCO1FBRW5CLElBQUksU0FBUztZQUNYLGdCQUFnQjtZQUNoQjs7WUFHRTs7O1lBR0YsYUFBYTsrQkFDTSxHQUFHLElBQUk7Z0JBQ3hCSSxjQUFXLGFBQWE7OztnQkFFeEIsV0FBVzthQUNaOzs7Ozs7aUJBT0ksV0FBVzs7Ozs7OzBDQU9rQjtRQUdwQyxhQUFhLEdBQUcsSUFBSSxVQUFVO1lBQzVCLGVBQWU7WUFDZixXQUFXLFFBQVE7Ozs7Ozs7WUFRbkI7WUFDQSxJQUFJLE1BQU07d0JBSUUsQ0FBQztnQkFDWEEsd0JBQXFCLENBQUM7O1lBR3hCLElBQUlBO2dCQUNGLHNCQUFzQjs7O2dCQUlwQixZQUFZLFFBQVE7OztZQUl4QixJQUFJLENBQUMsa0JBQWtCLENBQUM7U0FDekI7O1lBQ0MsdUJBQXVCO1NBQ3hCOztZQUdDLFdBQVcsQ0FBQyxVQUFVLENBQUM7U0FDeEI7Ozs7O2tCQU1PLDRCQUE0QixhQUFhOztRQUMvQztZQUNBLDRCQUE0Qjs7O1lBRzFCLGlCQUFpQixTQUFTOzs7WUEzR2lCOzs7OztJQXlIakQ7O1FBR0U7S0FDRDtJQUVEO1FBQ0U7Ozs7NENBS0Y7UUFDRSxjQUFnQjs7SUFFbEI7eUJBQ0Q7OztJQU1DOzt1QkFIa0I7O1FBSWhCLElBQUksQ0FBQyxjQUFjOzs7UUFJbkIsV0FBVztLQUNaO0lBRUQ7UUFDRSxZQUFjOzt1QkFFQyxDQUFDLFNBQVMsdUJBQXVCLEVBQUU7OztRQUlsRCxPQUFPLElBQUksZ0JBQWdCLEtBQUs7S0FDakM7SUFFRDtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO0tBQ3pCO0lBQ0g7OztJQU9zQztJQUtwQztpREFHbUI7OztRQVBuQix1QkFBaUIsT0FBTztRQUN4QixZQUFNLEdBQVE7UUFDZCxnQkFBVSxHQUFHOzs7Z0NBUVo7UUFDQyxPQUFPLEtBQUs7S0FDYjtJQUlEO1FBQ0U7O3FCQUVXLFdBQVc7OztZQUVwQixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxJQUFJO1NBQ2pDOzt3Q0FHSzs7S0FFUDtJQUVEO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSztLQUMvQjtJQUVEO1FBQ0UseUJBQXlCOzs7OztZQUl2QixJQUFJLENBQUMsdUJBQXVCO1NBQzdCOzs7OztJQVFIOztRQUdFLDZCQUF1QztLQUN4QztJQUNIOzs7Ozs7QUNuVUE7Ozs7OztBQ0RBO0lBV0U7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7SUFLTSxrREFBZ0I7Ozs7SUFBdkI7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzNDOzs7Ozs7OztJQUtNLGlEQUFlOzs7O0lBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCOzs7Ozs7Ozs7O0lBTU0seUNBQU87Ozs7O0lBQWQsVUFBZSxJQUdkO1FBQ0MsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtLQUNGOztnQkF0Q0YsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7Ozs7a0NBTEQ7Q0EwQ0M7Ozs7OztBQzFDRDtJQWFFO0tBQWlCOzs7O0lBRWpCLDRDQUFROzs7SUFBUjtLQUNDOztnQkFkRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsUUFBUSxFQUFFLHlEQUlUO29CQUNELE1BQU0sRUFBRSxFQUFFO2lCQUNYOzs7O0lBUUQsZ0NBQUM7Q0FBQTs7Ozs7O0FDbEJEO0lBR0E7S0FNdUM7O2dCQU50QyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLEVBQ1I7b0JBQ0QsWUFBWSxFQUFFLENBQUMseUJBQXlCLENBQUM7b0JBQ3pDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO2lCQUNyQzs7SUFDcUMsNkJBQUM7Q0FBQTs7Ozs7Ozs7Ozs7Ozs7In0=