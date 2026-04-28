(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))u(c);new MutationObserver(c=>{for(const d of c)if(d.type==="childList")for(const h of d.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&u(h)}).observe(document,{childList:!0,subtree:!0});function o(c){const d={};return c.integrity&&(d.integrity=c.integrity),c.referrerPolicy&&(d.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?d.credentials="include":c.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function u(c){if(c.ep)return;c.ep=!0;const d=o(c);fetch(c.href,d)}})();var io={exports:{}},Jl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ih;function Gy(){if(Ih)return Jl;Ih=1;var l=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function o(u,c,d){var h=null;if(d!==void 0&&(h=""+d),c.key!==void 0&&(h=""+c.key),"key"in c){d={};for(var v in c)v!=="key"&&(d[v]=c[v])}else d=c;return c=d.ref,{$$typeof:l,type:u,key:h,ref:c!==void 0?c:null,props:d}}return Jl.Fragment=s,Jl.jsx=o,Jl.jsxs=o,Jl}var Ph;function Xy(){return Ph||(Ph=1,io.exports=Gy()),io.exports}var g=Xy(),ro={exports:{}},ee={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var em;function Qy(){if(em)return ee;em=1;var l=Symbol.for("react.transitional.element"),s=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),u=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),d=Symbol.for("react.consumer"),h=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),w=Symbol.for("react.lazy"),x=Symbol.for("react.activity"),z=Symbol.iterator;function Y(S){return S===null||typeof S!="object"?null:(S=z&&S[z]||S["@@iterator"],typeof S=="function"?S:null)}var U={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},H=Object.assign,X={};function G(S,D,Q){this.props=S,this.context=D,this.refs=X,this.updater=Q||U}G.prototype.isReactComponent={},G.prototype.setState=function(S,D){if(typeof S!="object"&&typeof S!="function"&&S!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,S,D,"setState")},G.prototype.forceUpdate=function(S){this.updater.enqueueForceUpdate(this,S,"forceUpdate")};function P(){}P.prototype=G.prototype;function J(S,D,Q){this.props=S,this.context=D,this.refs=X,this.updater=Q||U}var he=J.prototype=new P;he.constructor=J,H(he,G.prototype),he.isPureReactComponent=!0;var ce=Array.isArray;function L(){}var B={H:null,A:null,T:null,S:null},W=Object.prototype.hasOwnProperty;function fe(S,D,Q){var V=Q.ref;return{$$typeof:l,type:S,key:D,ref:V!==void 0?V:null,props:Q}}function Je(S,D){return fe(S.type,D,S.props)}function Le(S){return typeof S=="object"&&S!==null&&S.$$typeof===l}function de(S){var D={"=":"=0",":":"=2"};return"$"+S.replace(/[=:]/g,function(Q){return D[Q]})}var Fe=/\/+/g;function Ke(S,D){return typeof S=="object"&&S!==null&&S.key!=null?de(""+S.key):D.toString(36)}function je(S){switch(S.status){case"fulfilled":return S.value;case"rejected":throw S.reason;default:switch(typeof S.status=="string"?S.then(L,L):(S.status="pending",S.then(function(D){S.status==="pending"&&(S.status="fulfilled",S.value=D)},function(D){S.status==="pending"&&(S.status="rejected",S.reason=D)})),S.status){case"fulfilled":return S.value;case"rejected":throw S.reason}}throw S}function C(S,D,Q,V,te){var le=typeof S;(le==="undefined"||le==="boolean")&&(S=null);var ve=!1;if(S===null)ve=!0;else switch(le){case"bigint":case"string":case"number":ve=!0;break;case"object":switch(S.$$typeof){case l:case s:ve=!0;break;case w:return ve=S._init,C(ve(S._payload),D,Q,V,te)}}if(ve)return te=te(S),ve=V===""?"."+Ke(S,0):V,ce(te)?(Q="",ve!=null&&(Q=ve.replace(Fe,"$&/")+"/"),C(te,D,Q,"",function(tl){return tl})):te!=null&&(Le(te)&&(te=Je(te,Q+(te.key==null||S&&S.key===te.key?"":(""+te.key).replace(Fe,"$&/")+"/")+ve)),D.push(te)),1;ve=0;var st=V===""?".":V+":";if(ce(S))for(var qe=0;qe<S.length;qe++)V=S[qe],le=st+Ke(V,qe),ve+=C(V,D,Q,le,te);else if(qe=Y(S),typeof qe=="function")for(S=qe.call(S),qe=0;!(V=S.next()).done;)V=V.value,le=st+Ke(V,qe++),ve+=C(V,D,Q,le,te);else if(le==="object"){if(typeof S.then=="function")return C(je(S),D,Q,V,te);throw D=String(S),Error("Objects are not valid as a React child (found: "+(D==="[object Object]"?"object with keys {"+Object.keys(S).join(", ")+"}":D)+"). If you meant to render a collection of children, use an array instead.")}return ve}function q(S,D,Q){if(S==null)return S;var V=[],te=0;return C(S,V,"","",function(le){return D.call(Q,le,te++)}),V}function I(S){if(S._status===-1){var D=S._result;D=D(),D.then(function(Q){(S._status===0||S._status===-1)&&(S._status=1,S._result=Q)},function(Q){(S._status===0||S._status===-1)&&(S._status=2,S._result=Q)}),S._status===-1&&(S._status=0,S._result=D)}if(S._status===1)return S._result.default;throw S._result}var ye=typeof reportError=="function"?reportError:function(S){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var D=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof S=="object"&&S!==null&&typeof S.message=="string"?String(S.message):String(S),error:S});if(!window.dispatchEvent(D))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",S);return}console.error(S)},be={map:q,forEach:function(S,D,Q){q(S,function(){D.apply(this,arguments)},Q)},count:function(S){var D=0;return q(S,function(){D++}),D},toArray:function(S){return q(S,function(D){return D})||[]},only:function(S){if(!Le(S))throw Error("React.Children.only expected to receive a single React element child.");return S}};return ee.Activity=x,ee.Children=be,ee.Component=G,ee.Fragment=o,ee.Profiler=c,ee.PureComponent=J,ee.StrictMode=u,ee.Suspense=y,ee.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=B,ee.__COMPILER_RUNTIME={__proto__:null,c:function(S){return B.H.useMemoCache(S)}},ee.cache=function(S){return function(){return S.apply(null,arguments)}},ee.cacheSignal=function(){return null},ee.cloneElement=function(S,D,Q){if(S==null)throw Error("The argument must be a React element, but you passed "+S+".");var V=H({},S.props),te=S.key;if(D!=null)for(le in D.key!==void 0&&(te=""+D.key),D)!W.call(D,le)||le==="key"||le==="__self"||le==="__source"||le==="ref"&&D.ref===void 0||(V[le]=D[le]);var le=arguments.length-2;if(le===1)V.children=Q;else if(1<le){for(var ve=Array(le),st=0;st<le;st++)ve[st]=arguments[st+2];V.children=ve}return fe(S.type,te,V)},ee.createContext=function(S){return S={$$typeof:h,_currentValue:S,_currentValue2:S,_threadCount:0,Provider:null,Consumer:null},S.Provider=S,S.Consumer={$$typeof:d,_context:S},S},ee.createElement=function(S,D,Q){var V,te={},le=null;if(D!=null)for(V in D.key!==void 0&&(le=""+D.key),D)W.call(D,V)&&V!=="key"&&V!=="__self"&&V!=="__source"&&(te[V]=D[V]);var ve=arguments.length-2;if(ve===1)te.children=Q;else if(1<ve){for(var st=Array(ve),qe=0;qe<ve;qe++)st[qe]=arguments[qe+2];te.children=st}if(S&&S.defaultProps)for(V in ve=S.defaultProps,ve)te[V]===void 0&&(te[V]=ve[V]);return fe(S,le,te)},ee.createRef=function(){return{current:null}},ee.forwardRef=function(S){return{$$typeof:v,render:S}},ee.isValidElement=Le,ee.lazy=function(S){return{$$typeof:w,_payload:{_status:-1,_result:S},_init:I}},ee.memo=function(S,D){return{$$typeof:p,type:S,compare:D===void 0?null:D}},ee.startTransition=function(S){var D=B.T,Q={};B.T=Q;try{var V=S(),te=B.S;te!==null&&te(Q,V),typeof V=="object"&&V!==null&&typeof V.then=="function"&&V.then(L,ye)}catch(le){ye(le)}finally{D!==null&&Q.types!==null&&(D.types=Q.types),B.T=D}},ee.unstable_useCacheRefresh=function(){return B.H.useCacheRefresh()},ee.use=function(S){return B.H.use(S)},ee.useActionState=function(S,D,Q){return B.H.useActionState(S,D,Q)},ee.useCallback=function(S,D){return B.H.useCallback(S,D)},ee.useContext=function(S){return B.H.useContext(S)},ee.useDebugValue=function(){},ee.useDeferredValue=function(S,D){return B.H.useDeferredValue(S,D)},ee.useEffect=function(S,D){return B.H.useEffect(S,D)},ee.useEffectEvent=function(S){return B.H.useEffectEvent(S)},ee.useId=function(){return B.H.useId()},ee.useImperativeHandle=function(S,D,Q){return B.H.useImperativeHandle(S,D,Q)},ee.useInsertionEffect=function(S,D){return B.H.useInsertionEffect(S,D)},ee.useLayoutEffect=function(S,D){return B.H.useLayoutEffect(S,D)},ee.useMemo=function(S,D){return B.H.useMemo(S,D)},ee.useOptimistic=function(S,D){return B.H.useOptimistic(S,D)},ee.useReducer=function(S,D,Q){return B.H.useReducer(S,D,Q)},ee.useRef=function(S){return B.H.useRef(S)},ee.useState=function(S){return B.H.useState(S)},ee.useSyncExternalStore=function(S,D,Q){return B.H.useSyncExternalStore(S,D,Q)},ee.useTransition=function(){return B.H.useTransition()},ee.version="19.2.5",ee}var tm;function _o(){return tm||(tm=1,ro.exports=Qy()),ro.exports}var T=_o(),so={exports:{}},Kl={},uo={exports:{}},oo={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var nm;function $y(){return nm||(nm=1,(function(l){function s(C,q){var I=C.length;C.push(q);e:for(;0<I;){var ye=I-1>>>1,be=C[ye];if(0<c(be,q))C[ye]=q,C[I]=be,I=ye;else break e}}function o(C){return C.length===0?null:C[0]}function u(C){if(C.length===0)return null;var q=C[0],I=C.pop();if(I!==q){C[0]=I;e:for(var ye=0,be=C.length,S=be>>>1;ye<S;){var D=2*(ye+1)-1,Q=C[D],V=D+1,te=C[V];if(0>c(Q,I))V<be&&0>c(te,Q)?(C[ye]=te,C[V]=I,ye=V):(C[ye]=Q,C[D]=I,ye=D);else if(V<be&&0>c(te,I))C[ye]=te,C[V]=I,ye=V;else break e}}return q}function c(C,q){var I=C.sortIndex-q.sortIndex;return I!==0?I:C.id-q.id}if(l.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var d=performance;l.unstable_now=function(){return d.now()}}else{var h=Date,v=h.now();l.unstable_now=function(){return h.now()-v}}var y=[],p=[],w=1,x=null,z=3,Y=!1,U=!1,H=!1,X=!1,G=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,J=typeof setImmediate<"u"?setImmediate:null;function he(C){for(var q=o(p);q!==null;){if(q.callback===null)u(p);else if(q.startTime<=C)u(p),q.sortIndex=q.expirationTime,s(y,q);else break;q=o(p)}}function ce(C){if(H=!1,he(C),!U)if(o(y)!==null)U=!0,L||(L=!0,de());else{var q=o(p);q!==null&&je(ce,q.startTime-C)}}var L=!1,B=-1,W=5,fe=-1;function Je(){return X?!0:!(l.unstable_now()-fe<W)}function Le(){if(X=!1,L){var C=l.unstable_now();fe=C;var q=!0;try{e:{U=!1,H&&(H=!1,P(B),B=-1),Y=!0;var I=z;try{t:{for(he(C),x=o(y);x!==null&&!(x.expirationTime>C&&Je());){var ye=x.callback;if(typeof ye=="function"){x.callback=null,z=x.priorityLevel;var be=ye(x.expirationTime<=C);if(C=l.unstable_now(),typeof be=="function"){x.callback=be,he(C),q=!0;break t}x===o(y)&&u(y),he(C)}else u(y);x=o(y)}if(x!==null)q=!0;else{var S=o(p);S!==null&&je(ce,S.startTime-C),q=!1}}break e}finally{x=null,z=I,Y=!1}q=void 0}}finally{q?de():L=!1}}}var de;if(typeof J=="function")de=function(){J(Le)};else if(typeof MessageChannel<"u"){var Fe=new MessageChannel,Ke=Fe.port2;Fe.port1.onmessage=Le,de=function(){Ke.postMessage(null)}}else de=function(){G(Le,0)};function je(C,q){B=G(function(){C(l.unstable_now())},q)}l.unstable_IdlePriority=5,l.unstable_ImmediatePriority=1,l.unstable_LowPriority=4,l.unstable_NormalPriority=3,l.unstable_Profiling=null,l.unstable_UserBlockingPriority=2,l.unstable_cancelCallback=function(C){C.callback=null},l.unstable_forceFrameRate=function(C){0>C||125<C?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):W=0<C?Math.floor(1e3/C):5},l.unstable_getCurrentPriorityLevel=function(){return z},l.unstable_next=function(C){switch(z){case 1:case 2:case 3:var q=3;break;default:q=z}var I=z;z=q;try{return C()}finally{z=I}},l.unstable_requestPaint=function(){X=!0},l.unstable_runWithPriority=function(C,q){switch(C){case 1:case 2:case 3:case 4:case 5:break;default:C=3}var I=z;z=C;try{return q()}finally{z=I}},l.unstable_scheduleCallback=function(C,q,I){var ye=l.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?ye+I:ye):I=ye,C){case 1:var be=-1;break;case 2:be=250;break;case 5:be=1073741823;break;case 4:be=1e4;break;default:be=5e3}return be=I+be,C={id:w++,callback:q,priorityLevel:C,startTime:I,expirationTime:be,sortIndex:-1},I>ye?(C.sortIndex=I,s(p,C),o(y)===null&&C===o(p)&&(H?(P(B),B=-1):H=!0,je(ce,I-ye))):(C.sortIndex=be,s(y,C),U||Y||(U=!0,L||(L=!0,de()))),C},l.unstable_shouldYield=Je,l.unstable_wrapCallback=function(C){var q=z;return function(){var I=z;z=q;try{return C.apply(this,arguments)}finally{z=I}}}})(oo)),oo}var am;function Vy(){return am||(am=1,uo.exports=$y()),uo.exports}var co={exports:{}},it={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lm;function Zy(){if(lm)return it;lm=1;var l=_o();function s(y){var p="https://react.dev/errors/"+y;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var w=2;w<arguments.length;w++)p+="&args[]="+encodeURIComponent(arguments[w])}return"Minified React error #"+y+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var u={d:{f:o,r:function(){throw Error(s(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},c=Symbol.for("react.portal");function d(y,p,w){var x=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:c,key:x==null?null:""+x,children:y,containerInfo:p,implementation:w}}var h=l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function v(y,p){if(y==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return it.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=u,it.createPortal=function(y,p){var w=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(s(299));return d(y,p,null,w)},it.flushSync=function(y){var p=h.T,w=u.p;try{if(h.T=null,u.p=2,y)return y()}finally{h.T=p,u.p=w,u.d.f()}},it.preconnect=function(y,p){typeof y=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,u.d.C(y,p))},it.prefetchDNS=function(y){typeof y=="string"&&u.d.D(y)},it.preinit=function(y,p){if(typeof y=="string"&&p&&typeof p.as=="string"){var w=p.as,x=v(w,p.crossOrigin),z=typeof p.integrity=="string"?p.integrity:void 0,Y=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;w==="style"?u.d.S(y,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:x,integrity:z,fetchPriority:Y}):w==="script"&&u.d.X(y,{crossOrigin:x,integrity:z,fetchPriority:Y,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},it.preinitModule=function(y,p){if(typeof y=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var w=v(p.as,p.crossOrigin);u.d.M(y,{crossOrigin:w,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&u.d.M(y)},it.preload=function(y,p){if(typeof y=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var w=p.as,x=v(w,p.crossOrigin);u.d.L(y,w,{crossOrigin:x,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},it.preloadModule=function(y,p){if(typeof y=="string")if(p){var w=v(p.as,p.crossOrigin);u.d.m(y,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:w,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else u.d.m(y)},it.requestFormReset=function(y){u.d.r(y)},it.unstable_batchedUpdates=function(y,p){return y(p)},it.useFormState=function(y,p,w){return h.H.useFormState(y,p,w)},it.useFormStatus=function(){return h.H.useHostTransitionStatus()},it.version="19.2.5",it}var im;function Rm(){if(im)return co.exports;im=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(s){console.error(s)}}return l(),co.exports=Zy(),co.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rm;function Jy(){if(rm)return Kl;rm=1;var l=Vy(),s=_o(),o=Rm();function u(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function d(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function h(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function v(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function y(e){if(d(e)!==e)throw Error(u(188))}function p(e){var t=e.alternate;if(!t){if(t=d(e),t===null)throw Error(u(188));return t!==e?null:e}for(var n=e,a=t;;){var i=n.return;if(i===null)break;var r=i.alternate;if(r===null){if(a=i.return,a!==null){n=a;continue}break}if(i.child===r.child){for(r=i.child;r;){if(r===n)return y(i),e;if(r===a)return y(i),t;r=r.sibling}throw Error(u(188))}if(n.return!==a.return)n=i,a=r;else{for(var f=!1,m=i.child;m;){if(m===n){f=!0,n=i,a=r;break}if(m===a){f=!0,a=i,n=r;break}m=m.sibling}if(!f){for(m=r.child;m;){if(m===n){f=!0,n=r,a=i;break}if(m===a){f=!0,a=r,n=i;break}m=m.sibling}if(!f)throw Error(u(189))}}if(n.alternate!==a)throw Error(u(190))}if(n.tag!==3)throw Error(u(188));return n.stateNode.current===n?e:t}function w(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=w(e),t!==null)return t;e=e.sibling}return null}var x=Object.assign,z=Symbol.for("react.element"),Y=Symbol.for("react.transitional.element"),U=Symbol.for("react.portal"),H=Symbol.for("react.fragment"),X=Symbol.for("react.strict_mode"),G=Symbol.for("react.profiler"),P=Symbol.for("react.consumer"),J=Symbol.for("react.context"),he=Symbol.for("react.forward_ref"),ce=Symbol.for("react.suspense"),L=Symbol.for("react.suspense_list"),B=Symbol.for("react.memo"),W=Symbol.for("react.lazy"),fe=Symbol.for("react.activity"),Je=Symbol.for("react.memo_cache_sentinel"),Le=Symbol.iterator;function de(e){return e===null||typeof e!="object"?null:(e=Le&&e[Le]||e["@@iterator"],typeof e=="function"?e:null)}var Fe=Symbol.for("react.client.reference");function Ke(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Fe?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case H:return"Fragment";case G:return"Profiler";case X:return"StrictMode";case ce:return"Suspense";case L:return"SuspenseList";case fe:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case U:return"Portal";case J:return e.displayName||"Context";case P:return(e._context.displayName||"Context")+".Consumer";case he:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case B:return t=e.displayName||null,t!==null?t:Ke(e.type)||"Memo";case W:t=e._payload,e=e._init;try{return Ke(e(t))}catch{}}return null}var je=Array.isArray,C=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,I={pending:!1,data:null,method:null,action:null},ye=[],be=-1;function S(e){return{current:e}}function D(e){0>be||(e.current=ye[be],ye[be]=null,be--)}function Q(e,t){be++,ye[be]=e.current,e.current=t}var V=S(null),te=S(null),le=S(null),ve=S(null);function st(e,t){switch(Q(le,t),Q(te,e),Q(V,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?kh(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=kh(t),e=Sh(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}D(V),Q(V,e)}function qe(){D(V),D(te),D(le)}function tl(e){e.memoizedState!==null&&Q(ve,e);var t=V.current,n=Sh(t,e.type);t!==n&&(Q(te,e),Q(V,n))}function ui(e){te.current===e&&(D(V),D(te)),ve.current===e&&(D(ve),Ql._currentValue=I)}var Yr,Wo;function $n(e){if(Yr===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Yr=t&&t[1]||"",Wo=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Yr+e+Wo}var Gr=!1;function Xr(e,t){if(!e||Gr)return"";Gr=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(t){var N=function(){throw Error()};if(Object.defineProperty(N.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(N,[])}catch(R){var j=R}Reflect.construct(e,[],N)}else{try{N.call()}catch(R){j=R}e.call(N.prototype)}}else{try{throw Error()}catch(R){j=R}(N=e())&&typeof N.catch=="function"&&N.catch(function(){})}}catch(R){if(R&&j&&typeof R.stack=="string")return[R.stack,j.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var r=a.DetermineComponentFrameRoot(),f=r[0],m=r[1];if(f&&m){var b=f.split(`
`),A=m.split(`
`);for(i=a=0;a<b.length&&!b[a].includes("DetermineComponentFrameRoot");)a++;for(;i<A.length&&!A[i].includes("DetermineComponentFrameRoot");)i++;if(a===b.length||i===A.length)for(a=b.length-1,i=A.length-1;1<=a&&0<=i&&b[a]!==A[i];)i--;for(;1<=a&&0<=i;a--,i--)if(b[a]!==A[i]){if(a!==1||i!==1)do if(a--,i--,0>i||b[a]!==A[i]){var M=`
`+b[a].replace(" at new "," at ");return e.displayName&&M.includes("<anonymous>")&&(M=M.replace("<anonymous>",e.displayName)),M}while(1<=a&&0<=i);break}}}finally{Gr=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?$n(n):""}function bp(e,t){switch(e.tag){case 26:case 27:case 5:return $n(e.type);case 16:return $n("Lazy");case 13:return e.child!==t&&t!==null?$n("Suspense Fallback"):$n("Suspense");case 19:return $n("SuspenseList");case 0:case 15:return Xr(e.type,!1);case 11:return Xr(e.type.render,!1);case 1:return Xr(e.type,!0);case 31:return $n("Activity");default:return""}}function Fo(e){try{var t="",n=null;do t+=bp(e,n),n=e,e=e.return;while(e);return t}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var Qr=Object.prototype.hasOwnProperty,$r=l.unstable_scheduleCallback,Vr=l.unstable_cancelCallback,xp=l.unstable_shouldYield,kp=l.unstable_requestPaint,gt=l.unstable_now,Sp=l.unstable_getCurrentPriorityLevel,Io=l.unstable_ImmediatePriority,Po=l.unstable_UserBlockingPriority,oi=l.unstable_NormalPriority,wp=l.unstable_LowPriority,ec=l.unstable_IdlePriority,Ep=l.log,Tp=l.unstable_setDisableYieldValue,nl=null,yt=null;function vn(e){if(typeof Ep=="function"&&Tp(e),yt&&typeof yt.setStrictMode=="function")try{yt.setStrictMode(nl,e)}catch{}}var vt=Math.clz32?Math.clz32:jp,_p=Math.log,Ap=Math.LN2;function jp(e){return e>>>=0,e===0?32:31-(_p(e)/Ap|0)|0}var ci=256,fi=262144,di=4194304;function Vn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function hi(e,t,n){var a=e.pendingLanes;if(a===0)return 0;var i=0,r=e.suspendedLanes,f=e.pingedLanes;e=e.warmLanes;var m=a&134217727;return m!==0?(a=m&~r,a!==0?i=Vn(a):(f&=m,f!==0?i=Vn(f):n||(n=m&~e,n!==0&&(i=Vn(n))))):(m=a&~r,m!==0?i=Vn(m):f!==0?i=Vn(f):n||(n=a&~e,n!==0&&(i=Vn(n)))),i===0?0:t!==0&&t!==i&&(t&r)===0&&(r=i&-i,n=t&-t,r>=n||r===32&&(n&4194048)!==0)?t:i}function al(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Rp(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function tc(){var e=di;return di<<=1,(di&62914560)===0&&(di=4194304),e}function Zr(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ll(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function zp(e,t,n,a,i,r){var f=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var m=e.entanglements,b=e.expirationTimes,A=e.hiddenUpdates;for(n=f&~n;0<n;){var M=31-vt(n),N=1<<M;m[M]=0,b[M]=-1;var j=A[M];if(j!==null)for(A[M]=null,M=0;M<j.length;M++){var R=j[M];R!==null&&(R.lane&=-536870913)}n&=~N}a!==0&&nc(e,a,0),r!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=r&~(f&~t))}function nc(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var a=31-vt(t);e.entangledLanes|=t,e.entanglements[a]=e.entanglements[a]|1073741824|n&261930}function ac(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var a=31-vt(n),i=1<<a;i&t|e[a]&t&&(e[a]|=t),n&=~i}}function lc(e,t){var n=t&-t;return n=(n&42)!==0?1:Jr(n),(n&(e.suspendedLanes|t))!==0?0:n}function Jr(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Kr(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ic(){var e=q.p;return e!==0?e:(e=window.event,e===void 0?32:$h(e.type))}function rc(e,t){var n=q.p;try{return q.p=e,t()}finally{q.p=n}}var bn=Math.random().toString(36).slice(2),et="__reactFiber$"+bn,ot="__reactProps$"+bn,fa="__reactContainer$"+bn,Wr="__reactEvents$"+bn,Mp="__reactListeners$"+bn,Cp="__reactHandles$"+bn,sc="__reactResources$"+bn,il="__reactMarker$"+bn;function Fr(e){delete e[et],delete e[ot],delete e[Wr],delete e[Mp],delete e[Cp]}function da(e){var t=e[et];if(t)return t;for(var n=e.parentNode;n;){if(t=n[fa]||n[et]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Rh(e);e!==null;){if(n=e[et])return n;e=Rh(e)}return t}e=n,n=e.parentNode}return null}function ha(e){if(e=e[et]||e[fa]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function rl(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(u(33))}function ma(e){var t=e[sc];return t||(t=e[sc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Ie(e){e[il]=!0}var uc=new Set,oc={};function Zn(e,t){pa(e,t),pa(e+"Capture",t)}function pa(e,t){for(oc[e]=t,e=0;e<t.length;e++)uc.add(t[e])}var Op=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),cc={},fc={};function Np(e){return Qr.call(fc,e)?!0:Qr.call(cc,e)?!1:Op.test(e)?fc[e]=!0:(cc[e]=!0,!1)}function mi(e,t,n){if(Np(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var a=t.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function pi(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function Wt(e,t,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+a)}}function jt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function dc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Dp(e,t,n){var a=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var i=a.get,r=a.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(f){n=""+f,r.call(this,f)}}),Object.defineProperty(e,t,{enumerable:a.enumerable}),{getValue:function(){return n},setValue:function(f){n=""+f},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ir(e){if(!e._valueTracker){var t=dc(e)?"checked":"value";e._valueTracker=Dp(e,t,""+e[t])}}function hc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),a="";return e&&(a=dc(e)?e.checked?"true":"false":e.value),e=a,e!==n?(t.setValue(e),!0):!1}function gi(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Lp=/[\n"\\]/g;function Rt(e){return e.replace(Lp,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Pr(e,t,n,a,i,r,f,m){e.name="",f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"?e.type=f:e.removeAttribute("type"),t!=null?f==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+jt(t)):e.value!==""+jt(t)&&(e.value=""+jt(t)):f!=="submit"&&f!=="reset"||e.removeAttribute("value"),t!=null?es(e,f,jt(t)):n!=null?es(e,f,jt(n)):a!=null&&e.removeAttribute("value"),i==null&&r!=null&&(e.defaultChecked=!!r),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"?e.name=""+jt(m):e.removeAttribute("name")}function mc(e,t,n,a,i,r,f,m){if(r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.type=r),t!=null||n!=null){if(!(r!=="submit"&&r!=="reset"||t!=null)){Ir(e);return}n=n!=null?""+jt(n):"",t=t!=null?""+jt(t):n,m||t===e.value||(e.value=t),e.defaultValue=t}a=a??i,a=typeof a!="function"&&typeof a!="symbol"&&!!a,e.checked=m?e.checked:!!a,e.defaultChecked=!!a,f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.name=f),Ir(e)}function es(e,t,n){t==="number"&&gi(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function ga(e,t,n,a){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&a&&(e[n].defaultSelected=!0)}else{for(n=""+jt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,a&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function pc(e,t,n){if(t!=null&&(t=""+jt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+jt(n):""}function gc(e,t,n,a){if(t==null){if(a!=null){if(n!=null)throw Error(u(92));if(je(a)){if(1<a.length)throw Error(u(93));a=a[0]}n=a}n==null&&(n=""),t=n}n=jt(t),e.defaultValue=n,a=e.textContent,a===n&&a!==""&&a!==null&&(e.value=a),Ir(e)}function ya(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Up=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function yc(e,t,n){var a=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?a?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":a?e.setProperty(t,n):typeof n!="number"||n===0||Up.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function vc(e,t,n){if(t!=null&&typeof t!="object")throw Error(u(62));if(e=e.style,n!=null){for(var a in n)!n.hasOwnProperty(a)||t!=null&&t.hasOwnProperty(a)||(a.indexOf("--")===0?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="");for(var i in t)a=t[i],t.hasOwnProperty(i)&&n[i]!==a&&yc(e,i,a)}else for(var r in t)t.hasOwnProperty(r)&&yc(e,r,t[r])}function ts(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Hp=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Bp=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function yi(e){return Bp.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ft(){}var ns=null;function as(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var va=null,ba=null;function bc(e){var t=ha(e);if(t&&(e=t.stateNode)){var n=e[ot]||null;e:switch(e=t.stateNode,t.type){case"input":if(Pr(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Rt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var a=n[t];if(a!==e&&a.form===e.form){var i=a[ot]||null;if(!i)throw Error(u(90));Pr(a,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)a=n[t],a.form===e.form&&hc(a)}break e;case"textarea":pc(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ga(e,!!n.multiple,t,!1)}}}var ls=!1;function xc(e,t,n){if(ls)return e(t,n);ls=!0;try{var a=e(t);return a}finally{if(ls=!1,(va!==null||ba!==null)&&(lr(),va&&(t=va,e=ba,ba=va=null,bc(t),e)))for(t=0;t<e.length;t++)bc(e[t])}}function sl(e,t){var n=e.stateNode;if(n===null)return null;var a=n[ot]||null;if(a===null)return null;n=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(u(231,t,typeof n));return n}var It=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),is=!1;if(It)try{var ul={};Object.defineProperty(ul,"passive",{get:function(){is=!0}}),window.addEventListener("test",ul,ul),window.removeEventListener("test",ul,ul)}catch{is=!1}var xn=null,rs=null,vi=null;function kc(){if(vi)return vi;var e,t=rs,n=t.length,a,i="value"in xn?xn.value:xn.textContent,r=i.length;for(e=0;e<n&&t[e]===i[e];e++);var f=n-e;for(a=1;a<=f&&t[n-a]===i[r-a];a++);return vi=i.slice(e,1<a?1-a:void 0)}function bi(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function xi(){return!0}function Sc(){return!1}function ct(e){function t(n,a,i,r,f){this._reactName=n,this._targetInst=i,this.type=a,this.nativeEvent=r,this.target=f,this.currentTarget=null;for(var m in e)e.hasOwnProperty(m)&&(n=e[m],this[m]=n?n(r):r[m]);return this.isDefaultPrevented=(r.defaultPrevented!=null?r.defaultPrevented:r.returnValue===!1)?xi:Sc,this.isPropagationStopped=Sc,this}return x(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=xi)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=xi)},persist:function(){},isPersistent:xi}),t}var Jn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ki=ct(Jn),ol=x({},Jn,{view:0,detail:0}),qp=ct(ol),ss,us,cl,Si=x({},ol,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:cs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==cl&&(cl&&e.type==="mousemove"?(ss=e.screenX-cl.screenX,us=e.screenY-cl.screenY):us=ss=0,cl=e),ss)},movementY:function(e){return"movementY"in e?e.movementY:us}}),wc=ct(Si),Yp=x({},Si,{dataTransfer:0}),Gp=ct(Yp),Xp=x({},ol,{relatedTarget:0}),os=ct(Xp),Qp=x({},Jn,{animationName:0,elapsedTime:0,pseudoElement:0}),$p=ct(Qp),Vp=x({},Jn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Zp=ct(Vp),Jp=x({},Jn,{data:0}),Ec=ct(Jp),Kp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Wp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ip(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Fp[e])?!!t[e]:!1}function cs(){return Ip}var Pp=x({},ol,{key:function(e){if(e.key){var t=Kp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=bi(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Wp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:cs,charCode:function(e){return e.type==="keypress"?bi(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?bi(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),eg=ct(Pp),tg=x({},Si,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Tc=ct(tg),ng=x({},ol,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:cs}),ag=ct(ng),lg=x({},Jn,{propertyName:0,elapsedTime:0,pseudoElement:0}),ig=ct(lg),rg=x({},Si,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sg=ct(rg),ug=x({},Jn,{newState:0,oldState:0}),og=ct(ug),cg=[9,13,27,32],fs=It&&"CompositionEvent"in window,fl=null;It&&"documentMode"in document&&(fl=document.documentMode);var fg=It&&"TextEvent"in window&&!fl,_c=It&&(!fs||fl&&8<fl&&11>=fl),Ac=" ",jc=!1;function Rc(e,t){switch(e){case"keyup":return cg.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function zc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var xa=!1;function dg(e,t){switch(e){case"compositionend":return zc(t);case"keypress":return t.which!==32?null:(jc=!0,Ac);case"textInput":return e=t.data,e===Ac&&jc?null:e;default:return null}}function hg(e,t){if(xa)return e==="compositionend"||!fs&&Rc(e,t)?(e=kc(),vi=rs=xn=null,xa=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return _c&&t.locale!=="ko"?null:t.data;default:return null}}var mg={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Mc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!mg[e.type]:t==="textarea"}function Cc(e,t,n,a){va?ba?ba.push(a):ba=[a]:va=a,t=fr(t,"onChange"),0<t.length&&(n=new ki("onChange","change",null,n,a),e.push({event:n,listeners:t}))}var dl=null,hl=null;function pg(e){ph(e,0)}function wi(e){var t=rl(e);if(hc(t))return e}function Oc(e,t){if(e==="change")return t}var Nc=!1;if(It){var ds;if(It){var hs="oninput"in document;if(!hs){var Dc=document.createElement("div");Dc.setAttribute("oninput","return;"),hs=typeof Dc.oninput=="function"}ds=hs}else ds=!1;Nc=ds&&(!document.documentMode||9<document.documentMode)}function Lc(){dl&&(dl.detachEvent("onpropertychange",Uc),hl=dl=null)}function Uc(e){if(e.propertyName==="value"&&wi(hl)){var t=[];Cc(t,hl,e,as(e)),xc(pg,t)}}function gg(e,t,n){e==="focusin"?(Lc(),dl=t,hl=n,dl.attachEvent("onpropertychange",Uc)):e==="focusout"&&Lc()}function yg(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return wi(hl)}function vg(e,t){if(e==="click")return wi(t)}function bg(e,t){if(e==="input"||e==="change")return wi(t)}function xg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bt=typeof Object.is=="function"?Object.is:xg;function ml(e,t){if(bt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),a=Object.keys(t);if(n.length!==a.length)return!1;for(a=0;a<n.length;a++){var i=n[a];if(!Qr.call(t,i)||!bt(e[i],t[i]))return!1}return!0}function Hc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Bc(e,t){var n=Hc(e);e=0;for(var a;n;){if(n.nodeType===3){if(a=e+n.textContent.length,e<=t&&a>=t)return{node:n,offset:t-e};e=a}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Hc(n)}}function qc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?qc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Yc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=gi(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=gi(e.document)}return t}function ms(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var kg=It&&"documentMode"in document&&11>=document.documentMode,ka=null,ps=null,pl=null,gs=!1;function Gc(e,t,n){var a=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gs||ka==null||ka!==gi(a)||(a=ka,"selectionStart"in a&&ms(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),pl&&ml(pl,a)||(pl=a,a=fr(ps,"onSelect"),0<a.length&&(t=new ki("onSelect","select",null,t,n),e.push({event:t,listeners:a}),t.target=ka)))}function Kn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Sa={animationend:Kn("Animation","AnimationEnd"),animationiteration:Kn("Animation","AnimationIteration"),animationstart:Kn("Animation","AnimationStart"),transitionrun:Kn("Transition","TransitionRun"),transitionstart:Kn("Transition","TransitionStart"),transitioncancel:Kn("Transition","TransitionCancel"),transitionend:Kn("Transition","TransitionEnd")},ys={},Xc={};It&&(Xc=document.createElement("div").style,"AnimationEvent"in window||(delete Sa.animationend.animation,delete Sa.animationiteration.animation,delete Sa.animationstart.animation),"TransitionEvent"in window||delete Sa.transitionend.transition);function Wn(e){if(ys[e])return ys[e];if(!Sa[e])return e;var t=Sa[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Xc)return ys[e]=t[n];return e}var Qc=Wn("animationend"),$c=Wn("animationiteration"),Vc=Wn("animationstart"),Sg=Wn("transitionrun"),wg=Wn("transitionstart"),Eg=Wn("transitioncancel"),Zc=Wn("transitionend"),Jc=new Map,vs="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");vs.push("scrollEnd");function Ht(e,t){Jc.set(e,t),Zn(t,[e])}var Ei=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},zt=[],wa=0,bs=0;function Ti(){for(var e=wa,t=bs=wa=0;t<e;){var n=zt[t];zt[t++]=null;var a=zt[t];zt[t++]=null;var i=zt[t];zt[t++]=null;var r=zt[t];if(zt[t++]=null,a!==null&&i!==null){var f=a.pending;f===null?i.next=i:(i.next=f.next,f.next=i),a.pending=i}r!==0&&Kc(n,i,r)}}function _i(e,t,n,a){zt[wa++]=e,zt[wa++]=t,zt[wa++]=n,zt[wa++]=a,bs|=a,e.lanes|=a,e=e.alternate,e!==null&&(e.lanes|=a)}function xs(e,t,n,a){return _i(e,t,n,a),Ai(e)}function Fn(e,t){return _i(e,null,null,t),Ai(e)}function Kc(e,t,n){e.lanes|=n;var a=e.alternate;a!==null&&(a.lanes|=n);for(var i=!1,r=e.return;r!==null;)r.childLanes|=n,a=r.alternate,a!==null&&(a.childLanes|=n),r.tag===22&&(e=r.stateNode,e===null||e._visibility&1||(i=!0)),e=r,r=r.return;return e.tag===3?(r=e.stateNode,i&&t!==null&&(i=31-vt(n),e=r.hiddenUpdates,a=e[i],a===null?e[i]=[t]:a.push(t),t.lane=n|536870912),r):null}function Ai(e){if(50<Ul)throw Ul=0,Ru=null,Error(u(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ea={};function Tg(e,t,n,a){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function xt(e,t,n,a){return new Tg(e,t,n,a)}function ks(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Pt(e,t){var n=e.alternate;return n===null?(n=xt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Wc(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function ji(e,t,n,a,i,r){var f=0;if(a=e,typeof e=="function")ks(e)&&(f=1);else if(typeof e=="string")f=zy(e,n,V.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case fe:return e=xt(31,n,t,i),e.elementType=fe,e.lanes=r,e;case H:return In(n.children,i,r,t);case X:f=8,i|=24;break;case G:return e=xt(12,n,t,i|2),e.elementType=G,e.lanes=r,e;case ce:return e=xt(13,n,t,i),e.elementType=ce,e.lanes=r,e;case L:return e=xt(19,n,t,i),e.elementType=L,e.lanes=r,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case J:f=10;break e;case P:f=9;break e;case he:f=11;break e;case B:f=14;break e;case W:f=16,a=null;break e}f=29,n=Error(u(130,e===null?"null":typeof e,"")),a=null}return t=xt(f,n,t,i),t.elementType=e,t.type=a,t.lanes=r,t}function In(e,t,n,a){return e=xt(7,e,a,t),e.lanes=n,e}function Ss(e,t,n){return e=xt(6,e,null,t),e.lanes=n,e}function Fc(e){var t=xt(18,null,null,0);return t.stateNode=e,t}function ws(e,t,n){return t=xt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ic=new WeakMap;function Mt(e,t){if(typeof e=="object"&&e!==null){var n=Ic.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Fo(t)},Ic.set(e,t),t)}return{value:e,source:t,stack:Fo(t)}}var Ta=[],_a=0,Ri=null,gl=0,Ct=[],Ot=0,kn=null,Vt=1,Zt="";function en(e,t){Ta[_a++]=gl,Ta[_a++]=Ri,Ri=e,gl=t}function Pc(e,t,n){Ct[Ot++]=Vt,Ct[Ot++]=Zt,Ct[Ot++]=kn,kn=e;var a=Vt;e=Zt;var i=32-vt(a)-1;a&=~(1<<i),n+=1;var r=32-vt(t)+i;if(30<r){var f=i-i%5;r=(a&(1<<f)-1).toString(32),a>>=f,i-=f,Vt=1<<32-vt(t)+i|n<<i|a,Zt=r+e}else Vt=1<<r|n<<i|a,Zt=e}function Es(e){e.return!==null&&(en(e,1),Pc(e,1,0))}function Ts(e){for(;e===Ri;)Ri=Ta[--_a],Ta[_a]=null,gl=Ta[--_a],Ta[_a]=null;for(;e===kn;)kn=Ct[--Ot],Ct[Ot]=null,Zt=Ct[--Ot],Ct[Ot]=null,Vt=Ct[--Ot],Ct[Ot]=null}function ef(e,t){Ct[Ot++]=Vt,Ct[Ot++]=Zt,Ct[Ot++]=kn,Vt=t.id,Zt=t.overflow,kn=e}var tt=null,Re=null,oe=!1,Sn=null,Nt=!1,_s=Error(u(519));function wn(e){var t=Error(u(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw yl(Mt(t,e)),_s}function tf(e){var t=e.stateNode,n=e.type,a=e.memoizedProps;switch(t[et]=e,t[ot]=a,n){case"dialog":re("cancel",t),re("close",t);break;case"iframe":case"object":case"embed":re("load",t);break;case"video":case"audio":for(n=0;n<Bl.length;n++)re(Bl[n],t);break;case"source":re("error",t);break;case"img":case"image":case"link":re("error",t),re("load",t);break;case"details":re("toggle",t);break;case"input":re("invalid",t),mc(t,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":re("invalid",t);break;case"textarea":re("invalid",t),gc(t,a.value,a.defaultValue,a.children)}n=a.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||a.suppressHydrationWarning===!0||bh(t.textContent,n)?(a.popover!=null&&(re("beforetoggle",t),re("toggle",t)),a.onScroll!=null&&re("scroll",t),a.onScrollEnd!=null&&re("scrollend",t),a.onClick!=null&&(t.onclick=Ft),t=!0):t=!1,t||wn(e,!0)}function nf(e){for(tt=e.return;tt;)switch(tt.tag){case 5:case 31:case 13:Nt=!1;return;case 27:case 3:Nt=!0;return;default:tt=tt.return}}function Aa(e){if(e!==tt)return!1;if(!oe)return nf(e),oe=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Qu(e.type,e.memoizedProps)),n=!n),n&&Re&&wn(e),nf(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));Re=jh(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(317));Re=jh(e)}else t===27?(t=Re,Un(e.type)?(e=Ku,Ku=null,Re=e):Re=t):Re=tt?Lt(e.stateNode.nextSibling):null;return!0}function Pn(){Re=tt=null,oe=!1}function As(){var e=Sn;return e!==null&&(mt===null?mt=e:mt.push.apply(mt,e),Sn=null),e}function yl(e){Sn===null?Sn=[e]:Sn.push(e)}var js=S(null),ea=null,tn=null;function En(e,t,n){Q(js,t._currentValue),t._currentValue=n}function nn(e){e._currentValue=js.current,D(js)}function Rs(e,t,n){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===n)break;e=e.return}}function zs(e,t,n,a){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var r=i.dependencies;if(r!==null){var f=i.child;r=r.firstContext;e:for(;r!==null;){var m=r;r=i;for(var b=0;b<t.length;b++)if(m.context===t[b]){r.lanes|=n,m=r.alternate,m!==null&&(m.lanes|=n),Rs(r.return,n,e),a||(f=null);break e}r=m.next}}else if(i.tag===18){if(f=i.return,f===null)throw Error(u(341));f.lanes|=n,r=f.alternate,r!==null&&(r.lanes|=n),Rs(f,n,e),f=null}else f=i.child;if(f!==null)f.return=i;else for(f=i;f!==null;){if(f===e){f=null;break}if(i=f.sibling,i!==null){i.return=f.return,f=i;break}f=f.return}i=f}}function ja(e,t,n,a){e=null;for(var i=t,r=!1;i!==null;){if(!r){if((i.flags&524288)!==0)r=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var f=i.alternate;if(f===null)throw Error(u(387));if(f=f.memoizedProps,f!==null){var m=i.type;bt(i.pendingProps.value,f.value)||(e!==null?e.push(m):e=[m])}}else if(i===ve.current){if(f=i.alternate,f===null)throw Error(u(387));f.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(Ql):e=[Ql])}i=i.return}e!==null&&zs(t,e,n,a),t.flags|=262144}function zi(e){for(e=e.firstContext;e!==null;){if(!bt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ta(e){ea=e,tn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function nt(e){return af(ea,e)}function Mi(e,t){return ea===null&&ta(e),af(e,t)}function af(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},tn===null){if(e===null)throw Error(u(308));tn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else tn=tn.next=t;return n}var _g=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,a){e.push(a)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},Ag=l.unstable_scheduleCallback,jg=l.unstable_NormalPriority,Xe={$$typeof:J,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ms(){return{controller:new _g,data:new Map,refCount:0}}function vl(e){e.refCount--,e.refCount===0&&Ag(jg,function(){e.controller.abort()})}var bl=null,Cs=0,Ra=0,za=null;function Rg(e,t){if(bl===null){var n=bl=[];Cs=0,Ra=Du(),za={status:"pending",value:void 0,then:function(a){n.push(a)}}}return Cs++,t.then(lf,lf),t}function lf(){if(--Cs===0&&bl!==null){za!==null&&(za.status="fulfilled");var e=bl;bl=null,Ra=0,za=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function zg(e,t){var n=[],a={status:"pending",value:null,reason:null,then:function(i){n.push(i)}};return e.then(function(){a.status="fulfilled",a.value=t;for(var i=0;i<n.length;i++)(0,n[i])(t)},function(i){for(a.status="rejected",a.reason=i,i=0;i<n.length;i++)(0,n[i])(void 0)}),a}var rf=C.S;C.S=function(e,t){Xd=gt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Rg(e,t),rf!==null&&rf(e,t)};var na=S(null);function Os(){var e=na.current;return e!==null?e:_e.pooledCache}function Ci(e,t){t===null?Q(na,na.current):Q(na,t.pool)}function sf(){var e=Os();return e===null?null:{parent:Xe._currentValue,pool:e}}var Ma=Error(u(460)),Ns=Error(u(474)),Oi=Error(u(542)),Ni={then:function(){}};function uf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function of(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(Ft,Ft),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ff(e),e;default:if(typeof t.status=="string")t.then(Ft,Ft);else{if(e=_e,e!==null&&100<e.shellSuspendCounter)throw Error(u(482));e=t,e.status="pending",e.then(function(a){if(t.status==="pending"){var i=t;i.status="fulfilled",i.value=a}},function(a){if(t.status==="pending"){var i=t;i.status="rejected",i.reason=a}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,ff(e),e}throw la=t,Ma}}function aa(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(la=n,Ma):n}}var la=null;function cf(){if(la===null)throw Error(u(459));var e=la;return la=null,e}function ff(e){if(e===Ma||e===Oi)throw Error(u(483))}var Ca=null,xl=0;function Di(e){var t=xl;return xl+=1,Ca===null&&(Ca=[]),of(Ca,e,t)}function kl(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Li(e,t){throw t.$$typeof===z?Error(u(525)):(e=Object.prototype.toString.call(t),Error(u(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function df(e){function t(E,k){if(e){var _=E.deletions;_===null?(E.deletions=[k],E.flags|=16):_.push(k)}}function n(E,k){if(!e)return null;for(;k!==null;)t(E,k),k=k.sibling;return null}function a(E){for(var k=new Map;E!==null;)E.key!==null?k.set(E.key,E):k.set(E.index,E),E=E.sibling;return k}function i(E,k){return E=Pt(E,k),E.index=0,E.sibling=null,E}function r(E,k,_){return E.index=_,e?(_=E.alternate,_!==null?(_=_.index,_<k?(E.flags|=67108866,k):_):(E.flags|=67108866,k)):(E.flags|=1048576,k)}function f(E){return e&&E.alternate===null&&(E.flags|=67108866),E}function m(E,k,_,O){return k===null||k.tag!==6?(k=Ss(_,E.mode,O),k.return=E,k):(k=i(k,_),k.return=E,k)}function b(E,k,_,O){var K=_.type;return K===H?M(E,k,_.props.children,O,_.key):k!==null&&(k.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===W&&aa(K)===k.type)?(k=i(k,_.props),kl(k,_),k.return=E,k):(k=ji(_.type,_.key,_.props,null,E.mode,O),kl(k,_),k.return=E,k)}function A(E,k,_,O){return k===null||k.tag!==4||k.stateNode.containerInfo!==_.containerInfo||k.stateNode.implementation!==_.implementation?(k=ws(_,E.mode,O),k.return=E,k):(k=i(k,_.children||[]),k.return=E,k)}function M(E,k,_,O,K){return k===null||k.tag!==7?(k=In(_,E.mode,O,K),k.return=E,k):(k=i(k,_),k.return=E,k)}function N(E,k,_){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return k=Ss(""+k,E.mode,_),k.return=E,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Y:return _=ji(k.type,k.key,k.props,null,E.mode,_),kl(_,k),_.return=E,_;case U:return k=ws(k,E.mode,_),k.return=E,k;case W:return k=aa(k),N(E,k,_)}if(je(k)||de(k))return k=In(k,E.mode,_,null),k.return=E,k;if(typeof k.then=="function")return N(E,Di(k),_);if(k.$$typeof===J)return N(E,Mi(E,k),_);Li(E,k)}return null}function j(E,k,_,O){var K=k!==null?k.key:null;if(typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint")return K!==null?null:m(E,k,""+_,O);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Y:return _.key===K?b(E,k,_,O):null;case U:return _.key===K?A(E,k,_,O):null;case W:return _=aa(_),j(E,k,_,O)}if(je(_)||de(_))return K!==null?null:M(E,k,_,O,null);if(typeof _.then=="function")return j(E,k,Di(_),O);if(_.$$typeof===J)return j(E,k,Mi(E,_),O);Li(E,_)}return null}function R(E,k,_,O,K){if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return E=E.get(_)||null,m(k,E,""+O,K);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case Y:return E=E.get(O.key===null?_:O.key)||null,b(k,E,O,K);case U:return E=E.get(O.key===null?_:O.key)||null,A(k,E,O,K);case W:return O=aa(O),R(E,k,_,O,K)}if(je(O)||de(O))return E=E.get(_)||null,M(k,E,O,K,null);if(typeof O.then=="function")return R(E,k,_,Di(O),K);if(O.$$typeof===J)return R(E,k,_,Mi(k,O),K);Li(k,O)}return null}function $(E,k,_,O){for(var K=null,me=null,Z=k,ae=k=0,ue=null;Z!==null&&ae<_.length;ae++){Z.index>ae?(ue=Z,Z=null):ue=Z.sibling;var pe=j(E,Z,_[ae],O);if(pe===null){Z===null&&(Z=ue);break}e&&Z&&pe.alternate===null&&t(E,Z),k=r(pe,k,ae),me===null?K=pe:me.sibling=pe,me=pe,Z=ue}if(ae===_.length)return n(E,Z),oe&&en(E,ae),K;if(Z===null){for(;ae<_.length;ae++)Z=N(E,_[ae],O),Z!==null&&(k=r(Z,k,ae),me===null?K=Z:me.sibling=Z,me=Z);return oe&&en(E,ae),K}for(Z=a(Z);ae<_.length;ae++)ue=R(Z,E,ae,_[ae],O),ue!==null&&(e&&ue.alternate!==null&&Z.delete(ue.key===null?ae:ue.key),k=r(ue,k,ae),me===null?K=ue:me.sibling=ue,me=ue);return e&&Z.forEach(function(Gn){return t(E,Gn)}),oe&&en(E,ae),K}function F(E,k,_,O){if(_==null)throw Error(u(151));for(var K=null,me=null,Z=k,ae=k=0,ue=null,pe=_.next();Z!==null&&!pe.done;ae++,pe=_.next()){Z.index>ae?(ue=Z,Z=null):ue=Z.sibling;var Gn=j(E,Z,pe.value,O);if(Gn===null){Z===null&&(Z=ue);break}e&&Z&&Gn.alternate===null&&t(E,Z),k=r(Gn,k,ae),me===null?K=Gn:me.sibling=Gn,me=Gn,Z=ue}if(pe.done)return n(E,Z),oe&&en(E,ae),K;if(Z===null){for(;!pe.done;ae++,pe=_.next())pe=N(E,pe.value,O),pe!==null&&(k=r(pe,k,ae),me===null?K=pe:me.sibling=pe,me=pe);return oe&&en(E,ae),K}for(Z=a(Z);!pe.done;ae++,pe=_.next())pe=R(Z,E,ae,pe.value,O),pe!==null&&(e&&pe.alternate!==null&&Z.delete(pe.key===null?ae:pe.key),k=r(pe,k,ae),me===null?K=pe:me.sibling=pe,me=pe);return e&&Z.forEach(function(Yy){return t(E,Yy)}),oe&&en(E,ae),K}function Te(E,k,_,O){if(typeof _=="object"&&_!==null&&_.type===H&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Y:e:{for(var K=_.key;k!==null;){if(k.key===K){if(K=_.type,K===H){if(k.tag===7){n(E,k.sibling),O=i(k,_.props.children),O.return=E,E=O;break e}}else if(k.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===W&&aa(K)===k.type){n(E,k.sibling),O=i(k,_.props),kl(O,_),O.return=E,E=O;break e}n(E,k);break}else t(E,k);k=k.sibling}_.type===H?(O=In(_.props.children,E.mode,O,_.key),O.return=E,E=O):(O=ji(_.type,_.key,_.props,null,E.mode,O),kl(O,_),O.return=E,E=O)}return f(E);case U:e:{for(K=_.key;k!==null;){if(k.key===K)if(k.tag===4&&k.stateNode.containerInfo===_.containerInfo&&k.stateNode.implementation===_.implementation){n(E,k.sibling),O=i(k,_.children||[]),O.return=E,E=O;break e}else{n(E,k);break}else t(E,k);k=k.sibling}O=ws(_,E.mode,O),O.return=E,E=O}return f(E);case W:return _=aa(_),Te(E,k,_,O)}if(je(_))return $(E,k,_,O);if(de(_)){if(K=de(_),typeof K!="function")throw Error(u(150));return _=K.call(_),F(E,k,_,O)}if(typeof _.then=="function")return Te(E,k,Di(_),O);if(_.$$typeof===J)return Te(E,k,Mi(E,_),O);Li(E,_)}return typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint"?(_=""+_,k!==null&&k.tag===6?(n(E,k.sibling),O=i(k,_),O.return=E,E=O):(n(E,k),O=Ss(_,E.mode,O),O.return=E,E=O),f(E)):n(E,k)}return function(E,k,_,O){try{xl=0;var K=Te(E,k,_,O);return Ca=null,K}catch(Z){if(Z===Ma||Z===Oi)throw Z;var me=xt(29,Z,null,E.mode);return me.lanes=O,me.return=E,me}finally{}}}var ia=df(!0),hf=df(!1),Tn=!1;function Ds(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ls(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function _n(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function An(e,t,n){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,(ge&2)!==0){var i=a.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),a.pending=t,t=Ai(e),Kc(e,null,n),t}return _i(e,a,t,n),Ai(e)}function Sl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,ac(e,n)}}function Us(e,t){var n=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,n===a)){var i=null,r=null;if(n=n.firstBaseUpdate,n!==null){do{var f={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};r===null?i=r=f:r=r.next=f,n=n.next}while(n!==null);r===null?i=r=t:r=r.next=t}else i=r=t;n={baseState:a.baseState,firstBaseUpdate:i,lastBaseUpdate:r,shared:a.shared,callbacks:a.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Hs=!1;function wl(){if(Hs){var e=za;if(e!==null)throw e}}function El(e,t,n,a){Hs=!1;var i=e.updateQueue;Tn=!1;var r=i.firstBaseUpdate,f=i.lastBaseUpdate,m=i.shared.pending;if(m!==null){i.shared.pending=null;var b=m,A=b.next;b.next=null,f===null?r=A:f.next=A,f=b;var M=e.alternate;M!==null&&(M=M.updateQueue,m=M.lastBaseUpdate,m!==f&&(m===null?M.firstBaseUpdate=A:m.next=A,M.lastBaseUpdate=b))}if(r!==null){var N=i.baseState;f=0,M=A=b=null,m=r;do{var j=m.lane&-536870913,R=j!==m.lane;if(R?(se&j)===j:(a&j)===j){j!==0&&j===Ra&&(Hs=!0),M!==null&&(M=M.next={lane:0,tag:m.tag,payload:m.payload,callback:null,next:null});e:{var $=e,F=m;j=t;var Te=n;switch(F.tag){case 1:if($=F.payload,typeof $=="function"){N=$.call(Te,N,j);break e}N=$;break e;case 3:$.flags=$.flags&-65537|128;case 0:if($=F.payload,j=typeof $=="function"?$.call(Te,N,j):$,j==null)break e;N=x({},N,j);break e;case 2:Tn=!0}}j=m.callback,j!==null&&(e.flags|=64,R&&(e.flags|=8192),R=i.callbacks,R===null?i.callbacks=[j]:R.push(j))}else R={lane:j,tag:m.tag,payload:m.payload,callback:m.callback,next:null},M===null?(A=M=R,b=N):M=M.next=R,f|=j;if(m=m.next,m===null){if(m=i.shared.pending,m===null)break;R=m,m=R.next,R.next=null,i.lastBaseUpdate=R,i.shared.pending=null}}while(!0);M===null&&(b=N),i.baseState=b,i.firstBaseUpdate=A,i.lastBaseUpdate=M,r===null&&(i.shared.lanes=0),Cn|=f,e.lanes=f,e.memoizedState=N}}function mf(e,t){if(typeof e!="function")throw Error(u(191,e));e.call(t)}function pf(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)mf(n[e],t)}var Oa=S(null),Ui=S(0);function gf(e,t){e=dn,Q(Ui,e),Q(Oa,t),dn=e|t.baseLanes}function Bs(){Q(Ui,dn),Q(Oa,Oa.current)}function qs(){dn=Ui.current,D(Oa),D(Ui)}var kt=S(null),Dt=null;function jn(e){var t=e.alternate;Q(Ye,Ye.current&1),Q(kt,e),Dt===null&&(t===null||Oa.current!==null||t.memoizedState!==null)&&(Dt=e)}function Ys(e){Q(Ye,Ye.current),Q(kt,e),Dt===null&&(Dt=e)}function yf(e){e.tag===22?(Q(Ye,Ye.current),Q(kt,e),Dt===null&&(Dt=e)):Rn()}function Rn(){Q(Ye,Ye.current),Q(kt,kt.current)}function St(e){D(kt),Dt===e&&(Dt=null),D(Ye)}var Ye=S(0);function Hi(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Zu(n)||Ju(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var an=0,ne=null,we=null,Qe=null,Bi=!1,Na=!1,ra=!1,qi=0,Tl=0,Da=null,Mg=0;function Ue(){throw Error(u(321))}function Gs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bt(e[n],t[n]))return!1;return!0}function Xs(e,t,n,a,i,r){return an=r,ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,C.H=e===null||e.memoizedState===null?ed:lu,ra=!1,r=n(a,i),ra=!1,Na&&(r=bf(t,n,a,i)),vf(e),r}function vf(e){C.H=jl;var t=we!==null&&we.next!==null;if(an=0,Qe=we=ne=null,Bi=!1,Tl=0,Da=null,t)throw Error(u(300));e===null||$e||(e=e.dependencies,e!==null&&zi(e)&&($e=!0))}function bf(e,t,n,a){ne=e;var i=0;do{if(Na&&(Da=null),Tl=0,Na=!1,25<=i)throw Error(u(301));if(i+=1,Qe=we=null,e.updateQueue!=null){var r=e.updateQueue;r.lastEffect=null,r.events=null,r.stores=null,r.memoCache!=null&&(r.memoCache.index=0)}C.H=td,r=t(n,a)}while(Na);return r}function Cg(){var e=C.H,t=e.useState()[0];return t=typeof t.then=="function"?_l(t):t,e=e.useState()[0],(we!==null?we.memoizedState:null)!==e&&(ne.flags|=1024),t}function Qs(){var e=qi!==0;return qi=0,e}function $s(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Vs(e){if(Bi){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Bi=!1}an=0,Qe=we=ne=null,Na=!1,Tl=qi=0,Da=null}function ut(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qe===null?ne.memoizedState=Qe=e:Qe=Qe.next=e,Qe}function Ge(){if(we===null){var e=ne.alternate;e=e!==null?e.memoizedState:null}else e=we.next;var t=Qe===null?ne.memoizedState:Qe.next;if(t!==null)Qe=t,we=e;else{if(e===null)throw ne.alternate===null?Error(u(467)):Error(u(310));we=e,e={memoizedState:we.memoizedState,baseState:we.baseState,baseQueue:we.baseQueue,queue:we.queue,next:null},Qe===null?ne.memoizedState=Qe=e:Qe=Qe.next=e}return Qe}function Yi(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function _l(e){var t=Tl;return Tl+=1,Da===null&&(Da=[]),e=of(Da,e,t),t=ne,(Qe===null?t.memoizedState:Qe.next)===null&&(t=t.alternate,C.H=t===null||t.memoizedState===null?ed:lu),e}function Gi(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return _l(e);if(e.$$typeof===J)return nt(e)}throw Error(u(438,String(e)))}function Zs(e){var t=null,n=ne.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var a=ne.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(t={data:a.data.map(function(i){return i.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=Yi(),ne.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),a=0;a<e;a++)n[a]=Je;return t.index++,n}function ln(e,t){return typeof t=="function"?t(e):t}function Xi(e){var t=Ge();return Js(t,we,e)}function Js(e,t,n){var a=e.queue;if(a===null)throw Error(u(311));a.lastRenderedReducer=n;var i=e.baseQueue,r=a.pending;if(r!==null){if(i!==null){var f=i.next;i.next=r.next,r.next=f}t.baseQueue=i=r,a.pending=null}if(r=e.baseState,i===null)e.memoizedState=r;else{t=i.next;var m=f=null,b=null,A=t,M=!1;do{var N=A.lane&-536870913;if(N!==A.lane?(se&N)===N:(an&N)===N){var j=A.revertLane;if(j===0)b!==null&&(b=b.next={lane:0,revertLane:0,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null}),N===Ra&&(M=!0);else if((an&j)===j){A=A.next,j===Ra&&(M=!0);continue}else N={lane:0,revertLane:A.revertLane,gesture:null,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},b===null?(m=b=N,f=r):b=b.next=N,ne.lanes|=j,Cn|=j;N=A.action,ra&&n(r,N),r=A.hasEagerState?A.eagerState:n(r,N)}else j={lane:N,revertLane:A.revertLane,gesture:A.gesture,action:A.action,hasEagerState:A.hasEagerState,eagerState:A.eagerState,next:null},b===null?(m=b=j,f=r):b=b.next=j,ne.lanes|=N,Cn|=N;A=A.next}while(A!==null&&A!==t);if(b===null?f=r:b.next=m,!bt(r,e.memoizedState)&&($e=!0,M&&(n=za,n!==null)))throw n;e.memoizedState=r,e.baseState=f,e.baseQueue=b,a.lastRenderedState=r}return i===null&&(a.lanes=0),[e.memoizedState,a.dispatch]}function Ks(e){var t=Ge(),n=t.queue;if(n===null)throw Error(u(311));n.lastRenderedReducer=e;var a=n.dispatch,i=n.pending,r=t.memoizedState;if(i!==null){n.pending=null;var f=i=i.next;do r=e(r,f.action),f=f.next;while(f!==i);bt(r,t.memoizedState)||($e=!0),t.memoizedState=r,t.baseQueue===null&&(t.baseState=r),n.lastRenderedState=r}return[r,a]}function xf(e,t,n){var a=ne,i=Ge(),r=oe;if(r){if(n===void 0)throw Error(u(407));n=n()}else n=t();var f=!bt((we||i).memoizedState,n);if(f&&(i.memoizedState=n,$e=!0),i=i.queue,Is(wf.bind(null,a,i,e),[e]),i.getSnapshot!==t||f||Qe!==null&&Qe.memoizedState.tag&1){if(a.flags|=2048,La(9,{destroy:void 0},Sf.bind(null,a,i,n,t),null),_e===null)throw Error(u(349));r||(an&127)!==0||kf(a,t,n)}return n}function kf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ne.updateQueue,t===null?(t=Yi(),ne.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sf(e,t,n,a){t.value=n,t.getSnapshot=a,Ef(t)&&Tf(e)}function wf(e,t,n){return n(function(){Ef(t)&&Tf(e)})}function Ef(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bt(e,n)}catch{return!0}}function Tf(e){var t=Fn(e,2);t!==null&&pt(t,e,2)}function Ws(e){var t=ut();if(typeof e=="function"){var n=e;if(e=n(),ra){vn(!0);try{n()}finally{vn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ln,lastRenderedState:e},t}function _f(e,t,n,a){return e.baseState=n,Js(e,we,typeof a=="function"?a:ln)}function Og(e,t,n,a,i){if(Vi(e))throw Error(u(485));if(e=t.action,e!==null){var r={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(f){r.listeners.push(f)}};C.T!==null?n(!0):r.isTransition=!1,a(r),n=t.pending,n===null?(r.next=t.pending=r,Af(t,r)):(r.next=n.next,t.pending=n.next=r)}}function Af(e,t){var n=t.action,a=t.payload,i=e.state;if(t.isTransition){var r=C.T,f={};C.T=f;try{var m=n(i,a),b=C.S;b!==null&&b(f,m),jf(e,t,m)}catch(A){Fs(e,t,A)}finally{r!==null&&f.types!==null&&(r.types=f.types),C.T=r}}else try{r=n(i,a),jf(e,t,r)}catch(A){Fs(e,t,A)}}function jf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(a){Rf(e,t,a)},function(a){return Fs(e,t,a)}):Rf(e,t,n)}function Rf(e,t,n){t.status="fulfilled",t.value=n,zf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Af(e,n)))}function Fs(e,t,n){var a=e.pending;if(e.pending=null,a!==null){a=a.next;do t.status="rejected",t.reason=n,zf(t),t=t.next;while(t!==a)}e.action=null}function zf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Mf(e,t){return t}function Cf(e,t){if(oe){var n=_e.formState;if(n!==null){e:{var a=ne;if(oe){if(Re){t:{for(var i=Re,r=Nt;i.nodeType!==8;){if(!r){i=null;break t}if(i=Lt(i.nextSibling),i===null){i=null;break t}}r=i.data,i=r==="F!"||r==="F"?i:null}if(i){Re=Lt(i.nextSibling),a=i.data==="F!";break e}}wn(a)}a=!1}a&&(t=n[0])}}return n=ut(),n.memoizedState=n.baseState=t,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mf,lastRenderedState:t},n.queue=a,n=Ff.bind(null,ne,a),a.dispatch=n,a=Ws(!1),r=au.bind(null,ne,!1,a.queue),a=ut(),i={state:t,dispatch:null,action:e,pending:null},a.queue=i,n=Og.bind(null,ne,i,r,n),i.dispatch=n,a.memoizedState=e,[t,n,!1]}function Of(e){var t=Ge();return Nf(t,we,e)}function Nf(e,t,n){if(t=Js(e,t,Mf)[0],e=Xi(ln)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var a=_l(t)}catch(f){throw f===Ma?Oi:f}else a=t;t=Ge();var i=t.queue,r=i.dispatch;return n!==t.memoizedState&&(ne.flags|=2048,La(9,{destroy:void 0},Ng.bind(null,i,n),null)),[a,r,e]}function Ng(e,t){e.action=t}function Df(e){var t=Ge(),n=we;if(n!==null)return Nf(t,n,e);Ge(),t=t.memoizedState,n=Ge();var a=n.queue.dispatch;return n.memoizedState=e,[t,a,!1]}function La(e,t,n,a){return e={tag:e,create:n,deps:a,inst:t,next:null},t=ne.updateQueue,t===null&&(t=Yi(),ne.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(a=n.next,n.next=e,e.next=a,t.lastEffect=e),e}function Lf(){return Ge().memoizedState}function Qi(e,t,n,a){var i=ut();ne.flags|=e,i.memoizedState=La(1|t,{destroy:void 0},n,a===void 0?null:a)}function $i(e,t,n,a){var i=Ge();a=a===void 0?null:a;var r=i.memoizedState.inst;we!==null&&a!==null&&Gs(a,we.memoizedState.deps)?i.memoizedState=La(t,r,n,a):(ne.flags|=e,i.memoizedState=La(1|t,r,n,a))}function Uf(e,t){Qi(8390656,8,e,t)}function Is(e,t){$i(2048,8,e,t)}function Dg(e){ne.flags|=4;var t=ne.updateQueue;if(t===null)t=Yi(),ne.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Hf(e){var t=Ge().memoizedState;return Dg({ref:t,nextImpl:e}),function(){if((ge&2)!==0)throw Error(u(440));return t.impl.apply(void 0,arguments)}}function Bf(e,t){return $i(4,2,e,t)}function qf(e,t){return $i(4,4,e,t)}function Yf(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Gf(e,t,n){n=n!=null?n.concat([e]):null,$i(4,4,Yf.bind(null,t,e),n)}function Ps(){}function Xf(e,t){var n=Ge();t=t===void 0?null:t;var a=n.memoizedState;return t!==null&&Gs(t,a[1])?a[0]:(n.memoizedState=[e,t],e)}function Qf(e,t){var n=Ge();t=t===void 0?null:t;var a=n.memoizedState;if(t!==null&&Gs(t,a[1]))return a[0];if(a=e(),ra){vn(!0);try{e()}finally{vn(!1)}}return n.memoizedState=[a,t],a}function eu(e,t,n){return n===void 0||(an&1073741824)!==0&&(se&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=$d(),ne.lanes|=e,Cn|=e,n)}function $f(e,t,n,a){return bt(n,t)?n:Oa.current!==null?(e=eu(e,n,a),bt(e,t)||($e=!0),e):(an&42)===0||(an&1073741824)!==0&&(se&261930)===0?($e=!0,e.memoizedState=n):(e=$d(),ne.lanes|=e,Cn|=e,t)}function Vf(e,t,n,a,i){var r=q.p;q.p=r!==0&&8>r?r:8;var f=C.T,m={};C.T=m,au(e,!1,t,n);try{var b=i(),A=C.S;if(A!==null&&A(m,b),b!==null&&typeof b=="object"&&typeof b.then=="function"){var M=zg(b,a);Al(e,t,M,Tt(e))}else Al(e,t,a,Tt(e))}catch(N){Al(e,t,{then:function(){},status:"rejected",reason:N},Tt())}finally{q.p=r,f!==null&&m.types!==null&&(f.types=m.types),C.T=f}}function Lg(){}function tu(e,t,n,a){if(e.tag!==5)throw Error(u(476));var i=Zf(e).queue;Vf(e,i,t,I,n===null?Lg:function(){return Jf(e),n(a)})}function Zf(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:I,baseState:I,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ln,lastRenderedState:I},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ln,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Jf(e){var t=Zf(e);t.next===null&&(t=e.alternate.memoizedState),Al(e,t.next.queue,{},Tt())}function nu(){return nt(Ql)}function Kf(){return Ge().memoizedState}function Wf(){return Ge().memoizedState}function Ug(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Tt();e=_n(n);var a=An(t,e,n);a!==null&&(pt(a,t,n),Sl(a,t,n)),t={cache:Ms()},e.payload=t;return}t=t.return}}function Hg(e,t,n){var a=Tt();n={lane:a,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Vi(e)?If(t,n):(n=xs(e,t,n,a),n!==null&&(pt(n,e,a),Pf(n,t,a)))}function Ff(e,t,n){var a=Tt();Al(e,t,n,a)}function Al(e,t,n,a){var i={lane:a,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Vi(e))If(t,i);else{var r=e.alternate;if(e.lanes===0&&(r===null||r.lanes===0)&&(r=t.lastRenderedReducer,r!==null))try{var f=t.lastRenderedState,m=r(f,n);if(i.hasEagerState=!0,i.eagerState=m,bt(m,f))return _i(e,t,i,0),_e===null&&Ti(),!1}catch{}finally{}if(n=xs(e,t,i,a),n!==null)return pt(n,e,a),Pf(n,t,a),!0}return!1}function au(e,t,n,a){if(a={lane:2,revertLane:Du(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Vi(e)){if(t)throw Error(u(479))}else t=xs(e,n,a,2),t!==null&&pt(t,e,2)}function Vi(e){var t=e.alternate;return e===ne||t!==null&&t===ne}function If(e,t){Na=Bi=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Pf(e,t,n){if((n&4194048)!==0){var a=t.lanes;a&=e.pendingLanes,n|=a,t.lanes=n,ac(e,n)}}var jl={readContext:nt,use:Gi,useCallback:Ue,useContext:Ue,useEffect:Ue,useImperativeHandle:Ue,useLayoutEffect:Ue,useInsertionEffect:Ue,useMemo:Ue,useReducer:Ue,useRef:Ue,useState:Ue,useDebugValue:Ue,useDeferredValue:Ue,useTransition:Ue,useSyncExternalStore:Ue,useId:Ue,useHostTransitionStatus:Ue,useFormState:Ue,useActionState:Ue,useOptimistic:Ue,useMemoCache:Ue,useCacheRefresh:Ue};jl.useEffectEvent=Ue;var ed={readContext:nt,use:Gi,useCallback:function(e,t){return ut().memoizedState=[e,t===void 0?null:t],e},useContext:nt,useEffect:Uf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Qi(4194308,4,Yf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Qi(4194308,4,e,t)},useInsertionEffect:function(e,t){Qi(4,2,e,t)},useMemo:function(e,t){var n=ut();t=t===void 0?null:t;var a=e();if(ra){vn(!0);try{e()}finally{vn(!1)}}return n.memoizedState=[a,t],a},useReducer:function(e,t,n){var a=ut();if(n!==void 0){var i=n(t);if(ra){vn(!0);try{n(t)}finally{vn(!1)}}}else i=t;return a.memoizedState=a.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},a.queue=e,e=e.dispatch=Hg.bind(null,ne,e),[a.memoizedState,e]},useRef:function(e){var t=ut();return e={current:e},t.memoizedState=e},useState:function(e){e=Ws(e);var t=e.queue,n=Ff.bind(null,ne,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ps,useDeferredValue:function(e,t){var n=ut();return eu(n,e,t)},useTransition:function(){var e=Ws(!1);return e=Vf.bind(null,ne,e.queue,!0,!1),ut().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var a=ne,i=ut();if(oe){if(n===void 0)throw Error(u(407));n=n()}else{if(n=t(),_e===null)throw Error(u(349));(se&127)!==0||kf(a,t,n)}i.memoizedState=n;var r={value:n,getSnapshot:t};return i.queue=r,Uf(wf.bind(null,a,r,e),[e]),a.flags|=2048,La(9,{destroy:void 0},Sf.bind(null,a,r,n,t),null),n},useId:function(){var e=ut(),t=_e.identifierPrefix;if(oe){var n=Zt,a=Vt;n=(a&~(1<<32-vt(a)-1)).toString(32)+n,t="_"+t+"R_"+n,n=qi++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Mg++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:nu,useFormState:Cf,useActionState:Cf,useOptimistic:function(e){var t=ut();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=au.bind(null,ne,!0,n),n.dispatch=t,[e,t]},useMemoCache:Zs,useCacheRefresh:function(){return ut().memoizedState=Ug.bind(null,ne)},useEffectEvent:function(e){var t=ut(),n={impl:e};return t.memoizedState=n,function(){if((ge&2)!==0)throw Error(u(440));return n.impl.apply(void 0,arguments)}}},lu={readContext:nt,use:Gi,useCallback:Xf,useContext:nt,useEffect:Is,useImperativeHandle:Gf,useInsertionEffect:Bf,useLayoutEffect:qf,useMemo:Qf,useReducer:Xi,useRef:Lf,useState:function(){return Xi(ln)},useDebugValue:Ps,useDeferredValue:function(e,t){var n=Ge();return $f(n,we.memoizedState,e,t)},useTransition:function(){var e=Xi(ln)[0],t=Ge().memoizedState;return[typeof e=="boolean"?e:_l(e),t]},useSyncExternalStore:xf,useId:Kf,useHostTransitionStatus:nu,useFormState:Of,useActionState:Of,useOptimistic:function(e,t){var n=Ge();return _f(n,we,e,t)},useMemoCache:Zs,useCacheRefresh:Wf};lu.useEffectEvent=Hf;var td={readContext:nt,use:Gi,useCallback:Xf,useContext:nt,useEffect:Is,useImperativeHandle:Gf,useInsertionEffect:Bf,useLayoutEffect:qf,useMemo:Qf,useReducer:Ks,useRef:Lf,useState:function(){return Ks(ln)},useDebugValue:Ps,useDeferredValue:function(e,t){var n=Ge();return we===null?eu(n,e,t):$f(n,we.memoizedState,e,t)},useTransition:function(){var e=Ks(ln)[0],t=Ge().memoizedState;return[typeof e=="boolean"?e:_l(e),t]},useSyncExternalStore:xf,useId:Kf,useHostTransitionStatus:nu,useFormState:Df,useActionState:Df,useOptimistic:function(e,t){var n=Ge();return we!==null?_f(n,we,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Zs,useCacheRefresh:Wf};td.useEffectEvent=Hf;function iu(e,t,n,a){t=e.memoizedState,n=n(a,t),n=n==null?t:x({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ru={enqueueSetState:function(e,t,n){e=e._reactInternals;var a=Tt(),i=_n(a);i.payload=t,n!=null&&(i.callback=n),t=An(e,i,a),t!==null&&(pt(t,e,a),Sl(t,e,a))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var a=Tt(),i=_n(a);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=An(e,i,a),t!==null&&(pt(t,e,a),Sl(t,e,a))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Tt(),a=_n(n);a.tag=2,t!=null&&(a.callback=t),t=An(e,a,n),t!==null&&(pt(t,e,n),Sl(t,e,n))}};function nd(e,t,n,a,i,r,f){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,r,f):t.prototype&&t.prototype.isPureReactComponent?!ml(n,a)||!ml(i,r):!0}function ad(e,t,n,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,a),t.state!==e&&ru.enqueueReplaceState(t,t.state,null)}function sa(e,t){var n=t;if("ref"in t){n={};for(var a in t)a!=="ref"&&(n[a]=t[a])}if(e=e.defaultProps){n===t&&(n=x({},n));for(var i in e)n[i]===void 0&&(n[i]=e[i])}return n}function ld(e){Ei(e)}function id(e){console.error(e)}function rd(e){Ei(e)}function Zi(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(a){setTimeout(function(){throw a})}}function sd(e,t,n){try{var a=e.onCaughtError;a(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function su(e,t,n){return n=_n(n),n.tag=3,n.payload={element:null},n.callback=function(){Zi(e,t)},n}function ud(e){return e=_n(e),e.tag=3,e}function od(e,t,n,a){var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=a.value;e.payload=function(){return i(r)},e.callback=function(){sd(t,n,a)}}var f=n.stateNode;f!==null&&typeof f.componentDidCatch=="function"&&(e.callback=function(){sd(t,n,a),typeof i!="function"&&(On===null?On=new Set([this]):On.add(this));var m=a.stack;this.componentDidCatch(a.value,{componentStack:m!==null?m:""})})}function Bg(e,t,n,a,i){if(n.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(t=n.alternate,t!==null&&ja(t,n,i,!0),n=kt.current,n!==null){switch(n.tag){case 31:case 13:return Dt===null?ir():n.alternate===null&&He===0&&(He=3),n.flags&=-257,n.flags|=65536,n.lanes=i,a===Ni?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([a]):t.add(a),Cu(e,a,i)),!1;case 22:return n.flags|=65536,a===Ni?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([a])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([a]):n.add(a)),Cu(e,a,i)),!1}throw Error(u(435,n.tag))}return Cu(e,a,i),ir(),!1}if(oe)return t=kt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=i,a!==_s&&(e=Error(u(422),{cause:a}),yl(Mt(e,n)))):(a!==_s&&(t=Error(u(423),{cause:a}),yl(Mt(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,a=Mt(a,n),i=su(e.stateNode,a,i),Us(e,i),He!==4&&(He=2)),!1;var r=Error(u(520),{cause:a});if(r=Mt(r,n),Ll===null?Ll=[r]:Ll.push(r),He!==4&&(He=2),t===null)return!0;a=Mt(a,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=su(n.stateNode,a,e),Us(n,e),!1;case 1:if(t=n.type,r=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||r!==null&&typeof r.componentDidCatch=="function"&&(On===null||!On.has(r))))return n.flags|=65536,i&=-i,n.lanes|=i,i=ud(i),od(i,e,n,a),Us(n,i),!1}n=n.return}while(n!==null);return!1}var uu=Error(u(461)),$e=!1;function at(e,t,n,a){t.child=e===null?hf(t,null,n,a):ia(t,e.child,n,a)}function cd(e,t,n,a,i){n=n.render;var r=t.ref;if("ref"in a){var f={};for(var m in a)m!=="ref"&&(f[m]=a[m])}else f=a;return ta(t),a=Xs(e,t,n,f,r,i),m=Qs(),e!==null&&!$e?($s(e,t,i),rn(e,t,i)):(oe&&m&&Es(t),t.flags|=1,at(e,t,a,i),t.child)}function fd(e,t,n,a,i){if(e===null){var r=n.type;return typeof r=="function"&&!ks(r)&&r.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=r,dd(e,t,r,a,i)):(e=ji(n.type,null,a,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(r=e.child,!gu(e,i)){var f=r.memoizedProps;if(n=n.compare,n=n!==null?n:ml,n(f,a)&&e.ref===t.ref)return rn(e,t,i)}return t.flags|=1,e=Pt(r,a),e.ref=t.ref,e.return=t,t.child=e}function dd(e,t,n,a,i){if(e!==null){var r=e.memoizedProps;if(ml(r,a)&&e.ref===t.ref)if($e=!1,t.pendingProps=a=r,gu(e,i))(e.flags&131072)!==0&&($e=!0);else return t.lanes=e.lanes,rn(e,t,i)}return ou(e,t,n,a,i)}function hd(e,t,n,a){var i=a.children,r=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((t.flags&128)!==0){if(r=r!==null?r.baseLanes|n:n,e!==null){for(a=t.child=e.child,i=0;a!==null;)i=i|a.lanes|a.childLanes,a=a.sibling;a=i&~r}else a=0,t.child=null;return md(e,t,r,n,a)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ci(t,r!==null?r.cachePool:null),r!==null?gf(t,r):Bs(),yf(t);else return a=t.lanes=536870912,md(e,t,r!==null?r.baseLanes|n:n,n,a)}else r!==null?(Ci(t,r.cachePool),gf(t,r),Rn(),t.memoizedState=null):(e!==null&&Ci(t,null),Bs(),Rn());return at(e,t,i,n),t.child}function Rl(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function md(e,t,n,a,i){var r=Os();return r=r===null?null:{parent:Xe._currentValue,pool:r},t.memoizedState={baseLanes:n,cachePool:r},e!==null&&Ci(t,null),Bs(),yf(t),e!==null&&ja(e,t,a,!0),t.childLanes=i,null}function Ji(e,t){return t=Wi({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function pd(e,t,n){return ia(t,e.child,null,n),e=Ji(t,t.pendingProps),e.flags|=2,St(t),t.memoizedState=null,e}function qg(e,t,n){var a=t.pendingProps,i=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(oe){if(a.mode==="hidden")return e=Ji(t,a),t.lanes=536870912,Rl(null,e);if(Ys(t),(e=Re)?(e=Ah(e,Nt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:Vt,overflow:Zt}:null,retryLane:536870912,hydrationErrors:null},n=Fc(e),n.return=t,t.child=n,tt=t,Re=null)):e=null,e===null)throw wn(t);return t.lanes=536870912,null}return Ji(t,a)}var r=e.memoizedState;if(r!==null){var f=r.dehydrated;if(Ys(t),i)if(t.flags&256)t.flags&=-257,t=pd(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(u(558));else if($e||ja(e,t,n,!1),i=(n&e.childLanes)!==0,$e||i){if(a=_e,a!==null&&(f=lc(a,n),f!==0&&f!==r.retryLane))throw r.retryLane=f,Fn(e,f),pt(a,e,f),uu;ir(),t=pd(e,t,n)}else e=r.treeContext,Re=Lt(f.nextSibling),tt=t,oe=!0,Sn=null,Nt=!1,e!==null&&ef(t,e),t=Ji(t,a),t.flags|=4096;return t}return e=Pt(e.child,{mode:a.mode,children:a.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Ki(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(u(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function ou(e,t,n,a,i){return ta(t),n=Xs(e,t,n,a,void 0,i),a=Qs(),e!==null&&!$e?($s(e,t,i),rn(e,t,i)):(oe&&a&&Es(t),t.flags|=1,at(e,t,n,i),t.child)}function gd(e,t,n,a,i,r){return ta(t),t.updateQueue=null,n=bf(t,a,n,i),vf(e),a=Qs(),e!==null&&!$e?($s(e,t,r),rn(e,t,r)):(oe&&a&&Es(t),t.flags|=1,at(e,t,n,r),t.child)}function yd(e,t,n,a,i){if(ta(t),t.stateNode===null){var r=Ea,f=n.contextType;typeof f=="object"&&f!==null&&(r=nt(f)),r=new n(a,r),t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=ru,t.stateNode=r,r._reactInternals=t,r=t.stateNode,r.props=a,r.state=t.memoizedState,r.refs={},Ds(t),f=n.contextType,r.context=typeof f=="object"&&f!==null?nt(f):Ea,r.state=t.memoizedState,f=n.getDerivedStateFromProps,typeof f=="function"&&(iu(t,n,f,a),r.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(f=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),f!==r.state&&ru.enqueueReplaceState(r,r.state,null),El(t,a,r,i),wl(),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308),a=!0}else if(e===null){r=t.stateNode;var m=t.memoizedProps,b=sa(n,m);r.props=b;var A=r.context,M=n.contextType;f=Ea,typeof M=="object"&&M!==null&&(f=nt(M));var N=n.getDerivedStateFromProps;M=typeof N=="function"||typeof r.getSnapshotBeforeUpdate=="function",m=t.pendingProps!==m,M||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(m||A!==f)&&ad(t,r,a,f),Tn=!1;var j=t.memoizedState;r.state=j,El(t,a,r,i),wl(),A=t.memoizedState,m||j!==A||Tn?(typeof N=="function"&&(iu(t,n,N,a),A=t.memoizedState),(b=Tn||nd(t,n,b,a,j,A,f))?(M||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount()),typeof r.componentDidMount=="function"&&(t.flags|=4194308)):(typeof r.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=A),r.props=a,r.state=A,r.context=f,a=b):(typeof r.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{r=t.stateNode,Ls(e,t),f=t.memoizedProps,M=sa(n,f),r.props=M,N=t.pendingProps,j=r.context,A=n.contextType,b=Ea,typeof A=="object"&&A!==null&&(b=nt(A)),m=n.getDerivedStateFromProps,(A=typeof m=="function"||typeof r.getSnapshotBeforeUpdate=="function")||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(f!==N||j!==b)&&ad(t,r,a,b),Tn=!1,j=t.memoizedState,r.state=j,El(t,a,r,i),wl();var R=t.memoizedState;f!==N||j!==R||Tn||e!==null&&e.dependencies!==null&&zi(e.dependencies)?(typeof m=="function"&&(iu(t,n,m,a),R=t.memoizedState),(M=Tn||nd(t,n,M,a,j,R,b)||e!==null&&e.dependencies!==null&&zi(e.dependencies))?(A||typeof r.UNSAFE_componentWillUpdate!="function"&&typeof r.componentWillUpdate!="function"||(typeof r.componentWillUpdate=="function"&&r.componentWillUpdate(a,R,b),typeof r.UNSAFE_componentWillUpdate=="function"&&r.UNSAFE_componentWillUpdate(a,R,b)),typeof r.componentDidUpdate=="function"&&(t.flags|=4),typeof r.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof r.componentDidUpdate!="function"||f===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=R),r.props=a,r.state=R,r.context=b,a=M):(typeof r.componentDidUpdate!="function"||f===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),a=!1)}return r=a,Ki(e,t),a=(t.flags&128)!==0,r||a?(r=t.stateNode,n=a&&typeof n.getDerivedStateFromError!="function"?null:r.render(),t.flags|=1,e!==null&&a?(t.child=ia(t,e.child,null,i),t.child=ia(t,null,n,i)):at(e,t,n,i),t.memoizedState=r.state,e=t.child):e=rn(e,t,i),e}function vd(e,t,n,a){return Pn(),t.flags|=256,at(e,t,n,a),t.child}var cu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function fu(e){return{baseLanes:e,cachePool:sf()}}function du(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Et),e}function bd(e,t,n){var a=t.pendingProps,i=!1,r=(t.flags&128)!==0,f;if((f=r)||(f=e!==null&&e.memoizedState===null?!1:(Ye.current&2)!==0),f&&(i=!0,t.flags&=-129),f=(t.flags&32)!==0,t.flags&=-33,e===null){if(oe){if(i?jn(t):Rn(),(e=Re)?(e=Ah(e,Nt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:Vt,overflow:Zt}:null,retryLane:536870912,hydrationErrors:null},n=Fc(e),n.return=t,t.child=n,tt=t,Re=null)):e=null,e===null)throw wn(t);return Ju(e)?t.lanes=32:t.lanes=536870912,null}var m=a.children;return a=a.fallback,i?(Rn(),i=t.mode,m=Wi({mode:"hidden",children:m},i),a=In(a,i,n,null),m.return=t,a.return=t,m.sibling=a,t.child=m,a=t.child,a.memoizedState=fu(n),a.childLanes=du(e,f,n),t.memoizedState=cu,Rl(null,a)):(jn(t),hu(t,m))}var b=e.memoizedState;if(b!==null&&(m=b.dehydrated,m!==null)){if(r)t.flags&256?(jn(t),t.flags&=-257,t=mu(e,t,n)):t.memoizedState!==null?(Rn(),t.child=e.child,t.flags|=128,t=null):(Rn(),m=a.fallback,i=t.mode,a=Wi({mode:"visible",children:a.children},i),m=In(m,i,n,null),m.flags|=2,a.return=t,m.return=t,a.sibling=m,t.child=a,ia(t,e.child,null,n),a=t.child,a.memoizedState=fu(n),a.childLanes=du(e,f,n),t.memoizedState=cu,t=Rl(null,a));else if(jn(t),Ju(m)){if(f=m.nextSibling&&m.nextSibling.dataset,f)var A=f.dgst;f=A,a=Error(u(419)),a.stack="",a.digest=f,yl({value:a,source:null,stack:null}),t=mu(e,t,n)}else if($e||ja(e,t,n,!1),f=(n&e.childLanes)!==0,$e||f){if(f=_e,f!==null&&(a=lc(f,n),a!==0&&a!==b.retryLane))throw b.retryLane=a,Fn(e,a),pt(f,e,a),uu;Zu(m)||ir(),t=mu(e,t,n)}else Zu(m)?(t.flags|=192,t.child=e.child,t=null):(e=b.treeContext,Re=Lt(m.nextSibling),tt=t,oe=!0,Sn=null,Nt=!1,e!==null&&ef(t,e),t=hu(t,a.children),t.flags|=4096);return t}return i?(Rn(),m=a.fallback,i=t.mode,b=e.child,A=b.sibling,a=Pt(b,{mode:"hidden",children:a.children}),a.subtreeFlags=b.subtreeFlags&65011712,A!==null?m=Pt(A,m):(m=In(m,i,n,null),m.flags|=2),m.return=t,a.return=t,a.sibling=m,t.child=a,Rl(null,a),a=t.child,m=e.child.memoizedState,m===null?m=fu(n):(i=m.cachePool,i!==null?(b=Xe._currentValue,i=i.parent!==b?{parent:b,pool:b}:i):i=sf(),m={baseLanes:m.baseLanes|n,cachePool:i}),a.memoizedState=m,a.childLanes=du(e,f,n),t.memoizedState=cu,Rl(e.child,a)):(jn(t),n=e.child,e=n.sibling,n=Pt(n,{mode:"visible",children:a.children}),n.return=t,n.sibling=null,e!==null&&(f=t.deletions,f===null?(t.deletions=[e],t.flags|=16):f.push(e)),t.child=n,t.memoizedState=null,n)}function hu(e,t){return t=Wi({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Wi(e,t){return e=xt(22,e,null,t),e.lanes=0,e}function mu(e,t,n){return ia(t,e.child,null,n),e=hu(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function xd(e,t,n){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),Rs(e.return,t,n)}function pu(e,t,n,a,i,r){var f=e.memoizedState;f===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:n,tailMode:i,treeForkCount:r}:(f.isBackwards=t,f.rendering=null,f.renderingStartTime=0,f.last=a,f.tail=n,f.tailMode=i,f.treeForkCount=r)}function kd(e,t,n){var a=t.pendingProps,i=a.revealOrder,r=a.tail;a=a.children;var f=Ye.current,m=(f&2)!==0;if(m?(f=f&1|2,t.flags|=128):f&=1,Q(Ye,f),at(e,t,a,n),a=oe?gl:0,!m&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xd(e,n,t);else if(e.tag===19)xd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&Hi(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),pu(t,!1,i,n,r,a);break;case"backwards":case"unstable_legacy-backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Hi(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}pu(t,!0,n,null,r,a);break;case"together":pu(t,!1,null,null,void 0,a);break;default:t.memoizedState=null}return t.child}function rn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Cn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(ja(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(u(153));if(t.child!==null){for(e=t.child,n=Pt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Pt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function gu(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&zi(e)))}function Yg(e,t,n){switch(t.tag){case 3:st(t,t.stateNode.containerInfo),En(t,Xe,e.memoizedState.cache),Pn();break;case 27:case 5:tl(t);break;case 4:st(t,t.stateNode.containerInfo);break;case 10:En(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Ys(t),null;break;case 13:var a=t.memoizedState;if(a!==null)return a.dehydrated!==null?(jn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?bd(e,t,n):(jn(t),e=rn(e,t,n),e!==null?e.sibling:null);jn(t);break;case 19:var i=(e.flags&128)!==0;if(a=(n&t.childLanes)!==0,a||(ja(e,t,n,!1),a=(n&t.childLanes)!==0),i){if(a)return kd(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Q(Ye,Ye.current),a)break;return null;case 22:return t.lanes=0,hd(e,t,n,t.pendingProps);case 24:En(t,Xe,e.memoizedState.cache)}return rn(e,t,n)}function Sd(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)$e=!0;else{if(!gu(e,n)&&(t.flags&128)===0)return $e=!1,Yg(e,t,n);$e=(e.flags&131072)!==0}else $e=!1,oe&&(t.flags&1048576)!==0&&Pc(t,gl,t.index);switch(t.lanes=0,t.tag){case 16:e:{var a=t.pendingProps;if(e=aa(t.elementType),t.type=e,typeof e=="function")ks(e)?(a=sa(e,a),t.tag=1,t=yd(null,t,e,a,n)):(t.tag=0,t=ou(null,t,e,a,n));else{if(e!=null){var i=e.$$typeof;if(i===he){t.tag=11,t=cd(null,t,e,a,n);break e}else if(i===B){t.tag=14,t=fd(null,t,e,a,n);break e}}throw t=Ke(e)||e,Error(u(306,t,""))}}return t;case 0:return ou(e,t,t.type,t.pendingProps,n);case 1:return a=t.type,i=sa(a,t.pendingProps),yd(e,t,a,i,n);case 3:e:{if(st(t,t.stateNode.containerInfo),e===null)throw Error(u(387));a=t.pendingProps;var r=t.memoizedState;i=r.element,Ls(e,t),El(t,a,null,n);var f=t.memoizedState;if(a=f.cache,En(t,Xe,a),a!==r.cache&&zs(t,[Xe],n,!0),wl(),a=f.element,r.isDehydrated)if(r={element:a,isDehydrated:!1,cache:f.cache},t.updateQueue.baseState=r,t.memoizedState=r,t.flags&256){t=vd(e,t,a,n);break e}else if(a!==i){i=Mt(Error(u(424)),t),yl(i),t=vd(e,t,a,n);break e}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Re=Lt(e.firstChild),tt=t,oe=!0,Sn=null,Nt=!0,n=hf(t,null,a,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Pn(),a===i){t=rn(e,t,n);break e}at(e,t,a,n)}t=t.child}return t;case 26:return Ki(e,t),e===null?(n=Oh(t.type,null,t.pendingProps,null))?t.memoizedState=n:oe||(n=t.type,e=t.pendingProps,a=dr(le.current).createElement(n),a[et]=t,a[ot]=e,lt(a,n,e),Ie(a),t.stateNode=a):t.memoizedState=Oh(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return tl(t),e===null&&oe&&(a=t.stateNode=zh(t.type,t.pendingProps,le.current),tt=t,Nt=!0,i=Re,Un(t.type)?(Ku=i,Re=Lt(a.firstChild)):Re=i),at(e,t,t.pendingProps.children,n),Ki(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&oe&&((i=a=Re)&&(a=yy(a,t.type,t.pendingProps,Nt),a!==null?(t.stateNode=a,tt=t,Re=Lt(a.firstChild),Nt=!1,i=!0):i=!1),i||wn(t)),tl(t),i=t.type,r=t.pendingProps,f=e!==null?e.memoizedProps:null,a=r.children,Qu(i,r)?a=null:f!==null&&Qu(i,f)&&(t.flags|=32),t.memoizedState!==null&&(i=Xs(e,t,Cg,null,null,n),Ql._currentValue=i),Ki(e,t),at(e,t,a,n),t.child;case 6:return e===null&&oe&&((e=n=Re)&&(n=vy(n,t.pendingProps,Nt),n!==null?(t.stateNode=n,tt=t,Re=null,e=!0):e=!1),e||wn(t)),null;case 13:return bd(e,t,n);case 4:return st(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=ia(t,null,a,n):at(e,t,a,n),t.child;case 11:return cd(e,t,t.type,t.pendingProps,n);case 7:return at(e,t,t.pendingProps,n),t.child;case 8:return at(e,t,t.pendingProps.children,n),t.child;case 12:return at(e,t,t.pendingProps.children,n),t.child;case 10:return a=t.pendingProps,En(t,t.type,a.value),at(e,t,a.children,n),t.child;case 9:return i=t.type._context,a=t.pendingProps.children,ta(t),i=nt(i),a=a(i),t.flags|=1,at(e,t,a,n),t.child;case 14:return fd(e,t,t.type,t.pendingProps,n);case 15:return dd(e,t,t.type,t.pendingProps,n);case 19:return kd(e,t,n);case 31:return qg(e,t,n);case 22:return hd(e,t,n,t.pendingProps);case 24:return ta(t),a=nt(Xe),e===null?(i=Os(),i===null&&(i=_e,r=Ms(),i.pooledCache=r,r.refCount++,r!==null&&(i.pooledCacheLanes|=n),i=r),t.memoizedState={parent:a,cache:i},Ds(t),En(t,Xe,i)):((e.lanes&n)!==0&&(Ls(e,t),El(t,null,null,n),wl()),i=e.memoizedState,r=t.memoizedState,i.parent!==a?(i={parent:a,cache:a},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),En(t,Xe,a)):(a=r.cache,En(t,Xe,a),a!==i.cache&&zs(t,[Xe],n,!0))),at(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(u(156,t.tag))}function sn(e){e.flags|=4}function yu(e,t,n,a,i){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Kd())e.flags|=8192;else throw la=Ni,Ns}else e.flags&=-16777217}function wd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Hh(t))if(Kd())e.flags|=8192;else throw la=Ni,Ns}function Fi(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?tc():536870912,e.lanes|=t,qa|=t)}function zl(e,t){if(!oe)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,a=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,a|=i.subtreeFlags&65011712,a|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,a|=i.subtreeFlags,a|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=a,e.childLanes=n,t}function Gg(e,t,n){var a=t.pendingProps;switch(Ts(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ze(t),null;case 1:return ze(t),null;case 3:return n=t.stateNode,a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),nn(Xe),qe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Aa(t)?sn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,As())),ze(t),null;case 26:var i=t.type,r=t.memoizedState;return e===null?(sn(t),r!==null?(ze(t),wd(t,r)):(ze(t),yu(t,i,null,a,n))):r?r!==e.memoizedState?(sn(t),ze(t),wd(t,r)):(ze(t),t.flags&=-16777217):(e=e.memoizedProps,e!==a&&sn(t),ze(t),yu(t,i,e,a,n)),null;case 27:if(ui(t),n=le.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==a&&sn(t);else{if(!a){if(t.stateNode===null)throw Error(u(166));return ze(t),null}e=V.current,Aa(t)?tf(t):(e=zh(i,a,n),t.stateNode=e,sn(t))}return ze(t),null;case 5:if(ui(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==a&&sn(t);else{if(!a){if(t.stateNode===null)throw Error(u(166));return ze(t),null}if(r=V.current,Aa(t))tf(t);else{var f=dr(le.current);switch(r){case 1:r=f.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:r=f.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":r=f.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":r=f.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":r=f.createElement("div"),r.innerHTML="<script><\/script>",r=r.removeChild(r.firstChild);break;case"select":r=typeof a.is=="string"?f.createElement("select",{is:a.is}):f.createElement("select"),a.multiple?r.multiple=!0:a.size&&(r.size=a.size);break;default:r=typeof a.is=="string"?f.createElement(i,{is:a.is}):f.createElement(i)}}r[et]=t,r[ot]=a;e:for(f=t.child;f!==null;){if(f.tag===5||f.tag===6)r.appendChild(f.stateNode);else if(f.tag!==4&&f.tag!==27&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;f=f.return}f.sibling.return=f.return,f=f.sibling}t.stateNode=r;e:switch(lt(r,i,a),i){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}a&&sn(t)}}return ze(t),yu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==a&&sn(t);else{if(typeof a!="string"&&t.stateNode===null)throw Error(u(166));if(e=le.current,Aa(t)){if(e=t.stateNode,n=t.memoizedProps,a=null,i=tt,i!==null)switch(i.tag){case 27:case 5:a=i.memoizedProps}e[et]=t,e=!!(e.nodeValue===n||a!==null&&a.suppressHydrationWarning===!0||bh(e.nodeValue,n)),e||wn(t,!0)}else e=dr(e).createTextNode(a),e[et]=t,t.stateNode=e}return ze(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(a=Aa(t),n!==null){if(e===null){if(!a)throw Error(u(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(u(557));e[et]=t}else Pn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ze(t),e=!1}else n=As(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(St(t),t):(St(t),null);if((t.flags&128)!==0)throw Error(u(558))}return ze(t),null;case 13:if(a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Aa(t),a!==null&&a.dehydrated!==null){if(e===null){if(!i)throw Error(u(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(u(317));i[et]=t}else Pn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ze(t),i=!1}else i=As(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(St(t),t):(St(t),null)}return St(t),(t.flags&128)!==0?(t.lanes=n,t):(n=a!==null,e=e!==null&&e.memoizedState!==null,n&&(a=t.child,i=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(i=a.alternate.memoizedState.cachePool.pool),r=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(r=a.memoizedState.cachePool.pool),r!==i&&(a.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Fi(t,t.updateQueue),ze(t),null);case 4:return qe(),e===null&&Bu(t.stateNode.containerInfo),ze(t),null;case 10:return nn(t.type),ze(t),null;case 19:if(D(Ye),a=t.memoizedState,a===null)return ze(t),null;if(i=(t.flags&128)!==0,r=a.rendering,r===null)if(i)zl(a,!1);else{if(He!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(r=Hi(e),r!==null){for(t.flags|=128,zl(a,!1),e=r.updateQueue,t.updateQueue=e,Fi(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Wc(n,e),n=n.sibling;return Q(Ye,Ye.current&1|2),oe&&en(t,a.treeForkCount),t.child}e=e.sibling}a.tail!==null&&gt()>nr&&(t.flags|=128,i=!0,zl(a,!1),t.lanes=4194304)}else{if(!i)if(e=Hi(r),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,Fi(t,e),zl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!r.alternate&&!oe)return ze(t),null}else 2*gt()-a.renderingStartTime>nr&&n!==536870912&&(t.flags|=128,i=!0,zl(a,!1),t.lanes=4194304);a.isBackwards?(r.sibling=t.child,t.child=r):(e=a.last,e!==null?e.sibling=r:t.child=r,a.last=r)}return a.tail!==null?(e=a.tail,a.rendering=e,a.tail=e.sibling,a.renderingStartTime=gt(),e.sibling=null,n=Ye.current,Q(Ye,i?n&1|2:n&1),oe&&en(t,a.treeForkCount),e):(ze(t),null);case 22:case 23:return St(t),qs(),a=t.memoizedState!==null,e!==null?e.memoizedState!==null!==a&&(t.flags|=8192):a&&(t.flags|=8192),a?(n&536870912)!==0&&(t.flags&128)===0&&(ze(t),t.subtreeFlags&6&&(t.flags|=8192)):ze(t),n=t.updateQueue,n!==null&&Fi(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),a=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),a!==n&&(t.flags|=2048),e!==null&&D(na),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),nn(Xe),ze(t),null;case 25:return null;case 30:return null}throw Error(u(156,t.tag))}function Xg(e,t){switch(Ts(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return nn(Xe),qe(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return ui(t),null;case 31:if(t.memoizedState!==null){if(St(t),t.alternate===null)throw Error(u(340));Pn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(St(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(u(340));Pn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return D(Ye),null;case 4:return qe(),null;case 10:return nn(t.type),null;case 22:case 23:return St(t),qs(),e!==null&&D(na),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return nn(Xe),null;case 25:return null;default:return null}}function Ed(e,t){switch(Ts(t),t.tag){case 3:nn(Xe),qe();break;case 26:case 27:case 5:ui(t);break;case 4:qe();break;case 31:t.memoizedState!==null&&St(t);break;case 13:St(t);break;case 19:D(Ye);break;case 10:nn(t.type);break;case 22:case 23:St(t),qs(),e!==null&&D(na);break;case 24:nn(Xe)}}function Ml(e,t){try{var n=t.updateQueue,a=n!==null?n.lastEffect:null;if(a!==null){var i=a.next;n=i;do{if((n.tag&e)===e){a=void 0;var r=n.create,f=n.inst;a=r(),f.destroy=a}n=n.next}while(n!==i)}}catch(m){ke(t,t.return,m)}}function zn(e,t,n){try{var a=t.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var r=i.next;a=r;do{if((a.tag&e)===e){var f=a.inst,m=f.destroy;if(m!==void 0){f.destroy=void 0,i=t;var b=n,A=m;try{A()}catch(M){ke(i,b,M)}}}a=a.next}while(a!==r)}}catch(M){ke(t,t.return,M)}}function Td(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{pf(t,n)}catch(a){ke(e,e.return,a)}}}function _d(e,t,n){n.props=sa(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(a){ke(e,t,a)}}function Cl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var a=e.stateNode;break;case 30:a=e.stateNode;break;default:a=e.stateNode}typeof n=="function"?e.refCleanup=n(a):n.current=a}}catch(i){ke(e,t,i)}}function Jt(e,t){var n=e.ref,a=e.refCleanup;if(n!==null)if(typeof a=="function")try{a()}catch(i){ke(e,t,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(i){ke(e,t,i)}else n.current=null}function Ad(e){var t=e.type,n=e.memoizedProps,a=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&a.focus();break e;case"img":n.src?a.src=n.src:n.srcSet&&(a.srcset=n.srcSet)}}catch(i){ke(e,e.return,i)}}function vu(e,t,n){try{var a=e.stateNode;fy(a,e.type,n,t),a[ot]=t}catch(i){ke(e,e.return,i)}}function jd(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Un(e.type)||e.tag===4}function bu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||jd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Un(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function xu(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ft));else if(a!==4&&(a===27&&Un(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(xu(e,t,n),e=e.sibling;e!==null;)xu(e,t,n),e=e.sibling}function Ii(e,t,n){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(a!==4&&(a===27&&Un(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Ii(e,t,n),e=e.sibling;e!==null;)Ii(e,t,n),e=e.sibling}function Rd(e){var t=e.stateNode,n=e.memoizedProps;try{for(var a=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);lt(t,a,n),t[et]=e,t[ot]=n}catch(r){ke(e,e.return,r)}}var un=!1,Ve=!1,ku=!1,zd=typeof WeakSet=="function"?WeakSet:Set,Pe=null;function Qg(e,t){if(e=e.containerInfo,Gu=br,e=Yc(e),ms(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var a=n.getSelection&&n.getSelection();if(a&&a.rangeCount!==0){n=a.anchorNode;var i=a.anchorOffset,r=a.focusNode;a=a.focusOffset;try{n.nodeType,r.nodeType}catch{n=null;break e}var f=0,m=-1,b=-1,A=0,M=0,N=e,j=null;t:for(;;){for(var R;N!==n||i!==0&&N.nodeType!==3||(m=f+i),N!==r||a!==0&&N.nodeType!==3||(b=f+a),N.nodeType===3&&(f+=N.nodeValue.length),(R=N.firstChild)!==null;)j=N,N=R;for(;;){if(N===e)break t;if(j===n&&++A===i&&(m=f),j===r&&++M===a&&(b=f),(R=N.nextSibling)!==null)break;N=j,j=N.parentNode}N=R}n=m===-1||b===-1?null:{start:m,end:b}}else n=null}n=n||{start:0,end:0}}else n=null;for(Xu={focusedElem:e,selectionRange:n},br=!1,Pe=t;Pe!==null;)if(t=Pe,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Pe=e;else for(;Pe!==null;){switch(t=Pe,r=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)i=e[n],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&r!==null){e=void 0,n=t,i=r.memoizedProps,r=r.memoizedState,a=n.stateNode;try{var $=sa(n.type,i);e=a.getSnapshotBeforeUpdate($,r),a.__reactInternalSnapshotBeforeUpdate=e}catch(F){ke(n,n.return,F)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Vu(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Vu(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(u(163))}if(e=t.sibling,e!==null){e.return=t.return,Pe=e;break}Pe=t.return}}function Md(e,t,n){var a=n.flags;switch(n.tag){case 0:case 11:case 15:cn(e,n),a&4&&Ml(5,n);break;case 1:if(cn(e,n),a&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(f){ke(n,n.return,f)}else{var i=sa(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(f){ke(n,n.return,f)}}a&64&&Td(n),a&512&&Cl(n,n.return);break;case 3:if(cn(e,n),a&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{pf(e,t)}catch(f){ke(n,n.return,f)}}break;case 27:t===null&&a&4&&Rd(n);case 26:case 5:cn(e,n),t===null&&a&4&&Ad(n),a&512&&Cl(n,n.return);break;case 12:cn(e,n);break;case 31:cn(e,n),a&4&&Nd(e,n);break;case 13:cn(e,n),a&4&&Dd(e,n),a&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Pg.bind(null,n),by(e,n))));break;case 22:if(a=n.memoizedState!==null||un,!a){t=t!==null&&t.memoizedState!==null||Ve,i=un;var r=Ve;un=a,(Ve=t)&&!r?fn(e,n,(n.subtreeFlags&8772)!==0):cn(e,n),un=i,Ve=r}break;case 30:break;default:cn(e,n)}}function Cd(e){var t=e.alternate;t!==null&&(e.alternate=null,Cd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Fr(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Me=null,ft=!1;function on(e,t,n){for(n=n.child;n!==null;)Od(e,t,n),n=n.sibling}function Od(e,t,n){if(yt&&typeof yt.onCommitFiberUnmount=="function")try{yt.onCommitFiberUnmount(nl,n)}catch{}switch(n.tag){case 26:Ve||Jt(n,t),on(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Ve||Jt(n,t);var a=Me,i=ft;Un(n.type)&&(Me=n.stateNode,ft=!1),on(e,t,n),Yl(n.stateNode),Me=a,ft=i;break;case 5:Ve||Jt(n,t);case 6:if(a=Me,i=ft,Me=null,on(e,t,n),Me=a,ft=i,Me!==null)if(ft)try{(Me.nodeType===9?Me.body:Me.nodeName==="HTML"?Me.ownerDocument.body:Me).removeChild(n.stateNode)}catch(r){ke(n,t,r)}else try{Me.removeChild(n.stateNode)}catch(r){ke(n,t,r)}break;case 18:Me!==null&&(ft?(e=Me,Th(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Ja(e)):Th(Me,n.stateNode));break;case 4:a=Me,i=ft,Me=n.stateNode.containerInfo,ft=!0,on(e,t,n),Me=a,ft=i;break;case 0:case 11:case 14:case 15:zn(2,n,t),Ve||zn(4,n,t),on(e,t,n);break;case 1:Ve||(Jt(n,t),a=n.stateNode,typeof a.componentWillUnmount=="function"&&_d(n,t,a)),on(e,t,n);break;case 21:on(e,t,n);break;case 22:Ve=(a=Ve)||n.memoizedState!==null,on(e,t,n),Ve=a;break;default:on(e,t,n)}}function Nd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ja(e)}catch(n){ke(t,t.return,n)}}}function Dd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ja(e)}catch(n){ke(t,t.return,n)}}function $g(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new zd),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new zd),t;default:throw Error(u(435,e.tag))}}function Pi(e,t){var n=$g(e);t.forEach(function(a){if(!n.has(a)){n.add(a);var i=ey.bind(null,e,a);a.then(i,i)}})}function dt(e,t){var n=t.deletions;if(n!==null)for(var a=0;a<n.length;a++){var i=n[a],r=e,f=t,m=f;e:for(;m!==null;){switch(m.tag){case 27:if(Un(m.type)){Me=m.stateNode,ft=!1;break e}break;case 5:Me=m.stateNode,ft=!1;break e;case 3:case 4:Me=m.stateNode.containerInfo,ft=!0;break e}m=m.return}if(Me===null)throw Error(u(160));Od(r,f,i),Me=null,ft=!1,r=i.alternate,r!==null&&(r.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Ld(t,e),t=t.sibling}var Bt=null;function Ld(e,t){var n=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:dt(t,e),ht(e),a&4&&(zn(3,e,e.return),Ml(3,e),zn(5,e,e.return));break;case 1:dt(t,e),ht(e),a&512&&(Ve||n===null||Jt(n,n.return)),a&64&&un&&(e=e.updateQueue,e!==null&&(a=e.callbacks,a!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?a:n.concat(a))));break;case 26:var i=Bt;if(dt(t,e),ht(e),a&512&&(Ve||n===null||Jt(n,n.return)),a&4){var r=n!==null?n.memoizedState:null;if(a=e.memoizedState,n===null)if(a===null)if(e.stateNode===null){e:{a=e.type,n=e.memoizedProps,i=i.ownerDocument||i;t:switch(a){case"title":r=i.getElementsByTagName("title")[0],(!r||r[il]||r[et]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=i.createElement(a),i.head.insertBefore(r,i.querySelector("head > title"))),lt(r,a,n),r[et]=e,Ie(r),a=r;break e;case"link":var f=Lh("link","href",i).get(a+(n.href||""));if(f){for(var m=0;m<f.length;m++)if(r=f[m],r.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&r.getAttribute("rel")===(n.rel==null?null:n.rel)&&r.getAttribute("title")===(n.title==null?null:n.title)&&r.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){f.splice(m,1);break t}}r=i.createElement(a),lt(r,a,n),i.head.appendChild(r);break;case"meta":if(f=Lh("meta","content",i).get(a+(n.content||""))){for(m=0;m<f.length;m++)if(r=f[m],r.getAttribute("content")===(n.content==null?null:""+n.content)&&r.getAttribute("name")===(n.name==null?null:n.name)&&r.getAttribute("property")===(n.property==null?null:n.property)&&r.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute("charset")===(n.charSet==null?null:n.charSet)){f.splice(m,1);break t}}r=i.createElement(a),lt(r,a,n),i.head.appendChild(r);break;default:throw Error(u(468,a))}r[et]=e,Ie(r),a=r}e.stateNode=a}else Uh(i,e.type,e.stateNode);else e.stateNode=Dh(i,a,e.memoizedProps);else r!==a?(r===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):r.count--,a===null?Uh(i,e.type,e.stateNode):Dh(i,a,e.memoizedProps)):a===null&&e.stateNode!==null&&vu(e,e.memoizedProps,n.memoizedProps)}break;case 27:dt(t,e),ht(e),a&512&&(Ve||n===null||Jt(n,n.return)),n!==null&&a&4&&vu(e,e.memoizedProps,n.memoizedProps);break;case 5:if(dt(t,e),ht(e),a&512&&(Ve||n===null||Jt(n,n.return)),e.flags&32){i=e.stateNode;try{ya(i,"")}catch($){ke(e,e.return,$)}}a&4&&e.stateNode!=null&&(i=e.memoizedProps,vu(e,i,n!==null?n.memoizedProps:i)),a&1024&&(ku=!0);break;case 6:if(dt(t,e),ht(e),a&4){if(e.stateNode===null)throw Error(u(162));a=e.memoizedProps,n=e.stateNode;try{n.nodeValue=a}catch($){ke(e,e.return,$)}}break;case 3:if(pr=null,i=Bt,Bt=hr(t.containerInfo),dt(t,e),Bt=i,ht(e),a&4&&n!==null&&n.memoizedState.isDehydrated)try{Ja(t.containerInfo)}catch($){ke(e,e.return,$)}ku&&(ku=!1,Ud(e));break;case 4:a=Bt,Bt=hr(e.stateNode.containerInfo),dt(t,e),ht(e),Bt=a;break;case 12:dt(t,e),ht(e);break;case 31:dt(t,e),ht(e),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,Pi(e,a)));break;case 13:dt(t,e),ht(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(tr=gt()),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,Pi(e,a)));break;case 22:i=e.memoizedState!==null;var b=n!==null&&n.memoizedState!==null,A=un,M=Ve;if(un=A||i,Ve=M||b,dt(t,e),Ve=M,un=A,ht(e),a&8192)e:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(n===null||b||un||Ve||ua(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){b=n=t;try{if(r=b.stateNode,i)f=r.style,typeof f.setProperty=="function"?f.setProperty("display","none","important"):f.display="none";else{m=b.stateNode;var N=b.memoizedProps.style,j=N!=null&&N.hasOwnProperty("display")?N.display:null;m.style.display=j==null||typeof j=="boolean"?"":(""+j).trim()}}catch($){ke(b,b.return,$)}}}else if(t.tag===6){if(n===null){b=t;try{b.stateNode.nodeValue=i?"":b.memoizedProps}catch($){ke(b,b.return,$)}}}else if(t.tag===18){if(n===null){b=t;try{var R=b.stateNode;i?_h(R,!0):_h(b.stateNode,!1)}catch($){ke(b,b.return,$)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}a&4&&(a=e.updateQueue,a!==null&&(n=a.retryQueue,n!==null&&(a.retryQueue=null,Pi(e,n))));break;case 19:dt(t,e),ht(e),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,Pi(e,a)));break;case 30:break;case 21:break;default:dt(t,e),ht(e)}}function ht(e){var t=e.flags;if(t&2){try{for(var n,a=e.return;a!==null;){if(jd(a)){n=a;break}a=a.return}if(n==null)throw Error(u(160));switch(n.tag){case 27:var i=n.stateNode,r=bu(e);Ii(e,r,i);break;case 5:var f=n.stateNode;n.flags&32&&(ya(f,""),n.flags&=-33);var m=bu(e);Ii(e,m,f);break;case 3:case 4:var b=n.stateNode.containerInfo,A=bu(e);xu(e,A,b);break;default:throw Error(u(161))}}catch(M){ke(e,e.return,M)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ud(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Ud(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function cn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Md(e,t.alternate,t),t=t.sibling}function ua(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:zn(4,t,t.return),ua(t);break;case 1:Jt(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&_d(t,t.return,n),ua(t);break;case 27:Yl(t.stateNode);case 26:case 5:Jt(t,t.return),ua(t);break;case 22:t.memoizedState===null&&ua(t);break;case 30:ua(t);break;default:ua(t)}e=e.sibling}}function fn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var a=t.alternate,i=e,r=t,f=r.flags;switch(r.tag){case 0:case 11:case 15:fn(i,r,n),Ml(4,r);break;case 1:if(fn(i,r,n),a=r,i=a.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(A){ke(a,a.return,A)}if(a=r,i=a.updateQueue,i!==null){var m=a.stateNode;try{var b=i.shared.hiddenCallbacks;if(b!==null)for(i.shared.hiddenCallbacks=null,i=0;i<b.length;i++)mf(b[i],m)}catch(A){ke(a,a.return,A)}}n&&f&64&&Td(r),Cl(r,r.return);break;case 27:Rd(r);case 26:case 5:fn(i,r,n),n&&a===null&&f&4&&Ad(r),Cl(r,r.return);break;case 12:fn(i,r,n);break;case 31:fn(i,r,n),n&&f&4&&Nd(i,r);break;case 13:fn(i,r,n),n&&f&4&&Dd(i,r);break;case 22:r.memoizedState===null&&fn(i,r,n),Cl(r,r.return);break;case 30:break;default:fn(i,r,n)}t=t.sibling}}function Su(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&vl(n))}function wu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&vl(e))}function qt(e,t,n,a){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Hd(e,t,n,a),t=t.sibling}function Hd(e,t,n,a){var i=t.flags;switch(t.tag){case 0:case 11:case 15:qt(e,t,n,a),i&2048&&Ml(9,t);break;case 1:qt(e,t,n,a);break;case 3:qt(e,t,n,a),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&vl(e)));break;case 12:if(i&2048){qt(e,t,n,a),e=t.stateNode;try{var r=t.memoizedProps,f=r.id,m=r.onPostCommit;typeof m=="function"&&m(f,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(b){ke(t,t.return,b)}}else qt(e,t,n,a);break;case 31:qt(e,t,n,a);break;case 13:qt(e,t,n,a);break;case 23:break;case 22:r=t.stateNode,f=t.alternate,t.memoizedState!==null?r._visibility&2?qt(e,t,n,a):Ol(e,t):r._visibility&2?qt(e,t,n,a):(r._visibility|=2,Ua(e,t,n,a,(t.subtreeFlags&10256)!==0||!1)),i&2048&&Su(f,t);break;case 24:qt(e,t,n,a),i&2048&&wu(t.alternate,t);break;default:qt(e,t,n,a)}}function Ua(e,t,n,a,i){for(i=i&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var r=e,f=t,m=n,b=a,A=f.flags;switch(f.tag){case 0:case 11:case 15:Ua(r,f,m,b,i),Ml(8,f);break;case 23:break;case 22:var M=f.stateNode;f.memoizedState!==null?M._visibility&2?Ua(r,f,m,b,i):Ol(r,f):(M._visibility|=2,Ua(r,f,m,b,i)),i&&A&2048&&Su(f.alternate,f);break;case 24:Ua(r,f,m,b,i),i&&A&2048&&wu(f.alternate,f);break;default:Ua(r,f,m,b,i)}t=t.sibling}}function Ol(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,a=t,i=a.flags;switch(a.tag){case 22:Ol(n,a),i&2048&&Su(a.alternate,a);break;case 24:Ol(n,a),i&2048&&wu(a.alternate,a);break;default:Ol(n,a)}t=t.sibling}}var Nl=8192;function Ha(e,t,n){if(e.subtreeFlags&Nl)for(e=e.child;e!==null;)Bd(e,t,n),e=e.sibling}function Bd(e,t,n){switch(e.tag){case 26:Ha(e,t,n),e.flags&Nl&&e.memoizedState!==null&&My(n,Bt,e.memoizedState,e.memoizedProps);break;case 5:Ha(e,t,n);break;case 3:case 4:var a=Bt;Bt=hr(e.stateNode.containerInfo),Ha(e,t,n),Bt=a;break;case 22:e.memoizedState===null&&(a=e.alternate,a!==null&&a.memoizedState!==null?(a=Nl,Nl=16777216,Ha(e,t,n),Nl=a):Ha(e,t,n));break;default:Ha(e,t,n)}}function qd(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Dl(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var a=t[n];Pe=a,Gd(a,e)}qd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yd(e),e=e.sibling}function Yd(e){switch(e.tag){case 0:case 11:case 15:Dl(e),e.flags&2048&&zn(9,e,e.return);break;case 3:Dl(e);break;case 12:Dl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,er(e)):Dl(e);break;default:Dl(e)}}function er(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var a=t[n];Pe=a,Gd(a,e)}qd(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:zn(8,t,t.return),er(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,er(t));break;default:er(t)}e=e.sibling}}function Gd(e,t){for(;Pe!==null;){var n=Pe;switch(n.tag){case 0:case 11:case 15:zn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var a=n.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:vl(n.memoizedState.cache)}if(a=n.child,a!==null)a.return=n,Pe=a;else e:for(n=e;Pe!==null;){a=Pe;var i=a.sibling,r=a.return;if(Cd(a),a===n){Pe=null;break e}if(i!==null){i.return=r,Pe=i;break e}Pe=r}}}var Vg={getCacheForType:function(e){var t=nt(Xe),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return nt(Xe).controller.signal}},Zg=typeof WeakMap=="function"?WeakMap:Map,ge=0,_e=null,ie=null,se=0,xe=0,wt=null,Mn=!1,Ba=!1,Eu=!1,dn=0,He=0,Cn=0,oa=0,Tu=0,Et=0,qa=0,Ll=null,mt=null,_u=!1,tr=0,Xd=0,nr=1/0,ar=null,On=null,We=0,Nn=null,Ya=null,hn=0,Au=0,ju=null,Qd=null,Ul=0,Ru=null;function Tt(){return(ge&2)!==0&&se!==0?se&-se:C.T!==null?Du():ic()}function $d(){if(Et===0)if((se&536870912)===0||oe){var e=fi;fi<<=1,(fi&3932160)===0&&(fi=262144),Et=e}else Et=536870912;return e=kt.current,e!==null&&(e.flags|=32),Et}function pt(e,t,n){(e===_e&&(xe===2||xe===9)||e.cancelPendingCommit!==null)&&(Ga(e,0),Dn(e,se,Et,!1)),ll(e,n),((ge&2)===0||e!==_e)&&(e===_e&&((ge&2)===0&&(oa|=n),He===4&&Dn(e,se,Et,!1)),Kt(e))}function Vd(e,t,n){if((ge&6)!==0)throw Error(u(327));var a=!n&&(t&127)===0&&(t&e.expiredLanes)===0||al(e,t),i=a?Wg(e,t):Mu(e,t,!0),r=a;do{if(i===0){Ba&&!a&&Dn(e,t,0,!1);break}else{if(n=e.current.alternate,r&&!Jg(n)){i=Mu(e,t,!1),r=!1;continue}if(i===2){if(r=t,e.errorRecoveryDisabledLanes&r)var f=0;else f=e.pendingLanes&-536870913,f=f!==0?f:f&536870912?536870912:0;if(f!==0){t=f;e:{var m=e;i=Ll;var b=m.current.memoizedState.isDehydrated;if(b&&(Ga(m,f).flags|=256),f=Mu(m,f,!1),f!==2){if(Eu&&!b){m.errorRecoveryDisabledLanes|=r,oa|=r,i=4;break e}r=mt,mt=i,r!==null&&(mt===null?mt=r:mt.push.apply(mt,r))}i=f}if(r=!1,i!==2)continue}}if(i===1){Ga(e,0),Dn(e,t,0,!0);break}e:{switch(a=e,r=i,r){case 0:case 1:throw Error(u(345));case 4:if((t&4194048)!==t)break;case 6:Dn(a,t,Et,!Mn);break e;case 2:mt=null;break;case 3:case 5:break;default:throw Error(u(329))}if((t&62914560)===t&&(i=tr+300-gt(),10<i)){if(Dn(a,t,Et,!Mn),hi(a,0,!0)!==0)break e;hn=t,a.timeoutHandle=wh(Zd.bind(null,a,n,mt,ar,_u,t,Et,oa,qa,Mn,r,"Throttled",-0,0),i);break e}Zd(a,n,mt,ar,_u,t,Et,oa,qa,Mn,r,null,-0,0)}}break}while(!0);Kt(e)}function Zd(e,t,n,a,i,r,f,m,b,A,M,N,j,R){if(e.timeoutHandle=-1,N=t.subtreeFlags,N&8192||(N&16785408)===16785408){N={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ft},Bd(t,r,N);var $=(r&62914560)===r?tr-gt():(r&4194048)===r?Xd-gt():0;if($=Cy(N,$),$!==null){hn=r,e.cancelPendingCommit=$(th.bind(null,e,t,r,n,a,i,f,m,b,M,N,null,j,R)),Dn(e,r,f,!A);return}}th(e,t,r,n,a,i,f,m,b)}function Jg(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var a=0;a<n.length;a++){var i=n[a],r=i.getSnapshot;i=i.value;try{if(!bt(r(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Dn(e,t,n,a){t&=~Tu,t&=~oa,e.suspendedLanes|=t,e.pingedLanes&=~t,a&&(e.warmLanes|=t),a=e.expirationTimes;for(var i=t;0<i;){var r=31-vt(i),f=1<<r;a[r]=-1,i&=~f}n!==0&&nc(e,n,t)}function lr(){return(ge&6)===0?(Hl(0),!1):!0}function zu(){if(ie!==null){if(xe===0)var e=ie.return;else e=ie,tn=ea=null,Vs(e),Ca=null,xl=0,e=ie;for(;e!==null;)Ed(e.alternate,e),e=e.return;ie=null}}function Ga(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,my(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),hn=0,zu(),_e=e,ie=n=Pt(e.current,null),se=t,xe=0,wt=null,Mn=!1,Ba=al(e,t),Eu=!1,qa=Et=Tu=oa=Cn=He=0,mt=Ll=null,_u=!1,(t&8)!==0&&(t|=t&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=t;0<a;){var i=31-vt(a),r=1<<i;t|=e[i],a&=~r}return dn=t,Ti(),n}function Jd(e,t){ne=null,C.H=jl,t===Ma||t===Oi?(t=cf(),xe=3):t===Ns?(t=cf(),xe=4):xe=t===uu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,wt=t,ie===null&&(He=1,Zi(e,Mt(t,e.current)))}function Kd(){var e=kt.current;return e===null?!0:(se&4194048)===se?Dt===null:(se&62914560)===se||(se&536870912)!==0?e===Dt:!1}function Wd(){var e=C.H;return C.H=jl,e===null?jl:e}function Fd(){var e=C.A;return C.A=Vg,e}function ir(){He=4,Mn||(se&4194048)!==se&&kt.current!==null||(Ba=!0),(Cn&134217727)===0&&(oa&134217727)===0||_e===null||Dn(_e,se,Et,!1)}function Mu(e,t,n){var a=ge;ge|=2;var i=Wd(),r=Fd();(_e!==e||se!==t)&&(ar=null,Ga(e,t)),t=!1;var f=He;e:do try{if(xe!==0&&ie!==null){var m=ie,b=wt;switch(xe){case 8:zu(),f=6;break e;case 3:case 2:case 9:case 6:kt.current===null&&(t=!0);var A=xe;if(xe=0,wt=null,Xa(e,m,b,A),n&&Ba){f=0;break e}break;default:A=xe,xe=0,wt=null,Xa(e,m,b,A)}}Kg(),f=He;break}catch(M){Jd(e,M)}while(!0);return t&&e.shellSuspendCounter++,tn=ea=null,ge=a,C.H=i,C.A=r,ie===null&&(_e=null,se=0,Ti()),f}function Kg(){for(;ie!==null;)Id(ie)}function Wg(e,t){var n=ge;ge|=2;var a=Wd(),i=Fd();_e!==e||se!==t?(ar=null,nr=gt()+500,Ga(e,t)):Ba=al(e,t);e:do try{if(xe!==0&&ie!==null){t=ie;var r=wt;t:switch(xe){case 1:xe=0,wt=null,Xa(e,t,r,1);break;case 2:case 9:if(uf(r)){xe=0,wt=null,Pd(t);break}t=function(){xe!==2&&xe!==9||_e!==e||(xe=7),Kt(e)},r.then(t,t);break e;case 3:xe=7;break e;case 4:xe=5;break e;case 7:uf(r)?(xe=0,wt=null,Pd(t)):(xe=0,wt=null,Xa(e,t,r,7));break;case 5:var f=null;switch(ie.tag){case 26:f=ie.memoizedState;case 5:case 27:var m=ie;if(f?Hh(f):m.stateNode.complete){xe=0,wt=null;var b=m.sibling;if(b!==null)ie=b;else{var A=m.return;A!==null?(ie=A,rr(A)):ie=null}break t}}xe=0,wt=null,Xa(e,t,r,5);break;case 6:xe=0,wt=null,Xa(e,t,r,6);break;case 8:zu(),He=6;break e;default:throw Error(u(462))}}Fg();break}catch(M){Jd(e,M)}while(!0);return tn=ea=null,C.H=a,C.A=i,ge=n,ie!==null?0:(_e=null,se=0,Ti(),He)}function Fg(){for(;ie!==null&&!xp();)Id(ie)}function Id(e){var t=Sd(e.alternate,e,dn);e.memoizedProps=e.pendingProps,t===null?rr(e):ie=t}function Pd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=gd(n,t,t.pendingProps,t.type,void 0,se);break;case 11:t=gd(n,t,t.pendingProps,t.type.render,t.ref,se);break;case 5:Vs(t);default:Ed(n,t),t=ie=Wc(t,dn),t=Sd(n,t,dn)}e.memoizedProps=e.pendingProps,t===null?rr(e):ie=t}function Xa(e,t,n,a){tn=ea=null,Vs(t),Ca=null,xl=0;var i=t.return;try{if(Bg(e,i,t,n,se)){He=1,Zi(e,Mt(n,e.current)),ie=null;return}}catch(r){if(i!==null)throw ie=i,r;He=1,Zi(e,Mt(n,e.current)),ie=null;return}t.flags&32768?(oe||a===1?e=!0:Ba||(se&536870912)!==0?e=!1:(Mn=e=!0,(a===2||a===9||a===3||a===6)&&(a=kt.current,a!==null&&a.tag===13&&(a.flags|=16384))),eh(t,e)):rr(t)}function rr(e){var t=e;do{if((t.flags&32768)!==0){eh(t,Mn);return}e=t.return;var n=Gg(t.alternate,t,dn);if(n!==null){ie=n;return}if(t=t.sibling,t!==null){ie=t;return}ie=t=e}while(t!==null);He===0&&(He=5)}function eh(e,t){do{var n=Xg(e.alternate,e);if(n!==null){n.flags&=32767,ie=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){ie=e;return}ie=e=n}while(e!==null);He=6,ie=null}function th(e,t,n,a,i,r,f,m,b){e.cancelPendingCommit=null;do sr();while(We!==0);if((ge&6)!==0)throw Error(u(327));if(t!==null){if(t===e.current)throw Error(u(177));if(r=t.lanes|t.childLanes,r|=bs,zp(e,n,r,f,m,b),e===_e&&(ie=_e=null,se=0),Ya=t,Nn=e,hn=n,Au=r,ju=i,Qd=a,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,ty(oi,function(){return rh(),null})):(e.callbackNode=null,e.callbackPriority=0),a=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||a){a=C.T,C.T=null,i=q.p,q.p=2,f=ge,ge|=4;try{Qg(e,t,n)}finally{ge=f,q.p=i,C.T=a}}We=1,nh(),ah(),lh()}}function nh(){if(We===1){We=0;var e=Nn,t=Ya,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=C.T,C.T=null;var a=q.p;q.p=2;var i=ge;ge|=4;try{Ld(t,e);var r=Xu,f=Yc(e.containerInfo),m=r.focusedElem,b=r.selectionRange;if(f!==m&&m&&m.ownerDocument&&qc(m.ownerDocument.documentElement,m)){if(b!==null&&ms(m)){var A=b.start,M=b.end;if(M===void 0&&(M=A),"selectionStart"in m)m.selectionStart=A,m.selectionEnd=Math.min(M,m.value.length);else{var N=m.ownerDocument||document,j=N&&N.defaultView||window;if(j.getSelection){var R=j.getSelection(),$=m.textContent.length,F=Math.min(b.start,$),Te=b.end===void 0?F:Math.min(b.end,$);!R.extend&&F>Te&&(f=Te,Te=F,F=f);var E=Bc(m,F),k=Bc(m,Te);if(E&&k&&(R.rangeCount!==1||R.anchorNode!==E.node||R.anchorOffset!==E.offset||R.focusNode!==k.node||R.focusOffset!==k.offset)){var _=N.createRange();_.setStart(E.node,E.offset),R.removeAllRanges(),F>Te?(R.addRange(_),R.extend(k.node,k.offset)):(_.setEnd(k.node,k.offset),R.addRange(_))}}}}for(N=[],R=m;R=R.parentNode;)R.nodeType===1&&N.push({element:R,left:R.scrollLeft,top:R.scrollTop});for(typeof m.focus=="function"&&m.focus(),m=0;m<N.length;m++){var O=N[m];O.element.scrollLeft=O.left,O.element.scrollTop=O.top}}br=!!Gu,Xu=Gu=null}finally{ge=i,q.p=a,C.T=n}}e.current=t,We=2}}function ah(){if(We===2){We=0;var e=Nn,t=Ya,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=C.T,C.T=null;var a=q.p;q.p=2;var i=ge;ge|=4;try{Md(e,t.alternate,t)}finally{ge=i,q.p=a,C.T=n}}We=3}}function lh(){if(We===4||We===3){We=0,kp();var e=Nn,t=Ya,n=hn,a=Qd;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?We=5:(We=0,Ya=Nn=null,ih(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(On=null),Kr(n),t=t.stateNode,yt&&typeof yt.onCommitFiberRoot=="function")try{yt.onCommitFiberRoot(nl,t,void 0,(t.current.flags&128)===128)}catch{}if(a!==null){t=C.T,i=q.p,q.p=2,C.T=null;try{for(var r=e.onRecoverableError,f=0;f<a.length;f++){var m=a[f];r(m.value,{componentStack:m.stack})}}finally{C.T=t,q.p=i}}(hn&3)!==0&&sr(),Kt(e),i=e.pendingLanes,(n&261930)!==0&&(i&42)!==0?e===Ru?Ul++:(Ul=0,Ru=e):Ul=0,Hl(0)}}function ih(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,vl(t)))}function sr(){return nh(),ah(),lh(),rh()}function rh(){if(We!==5)return!1;var e=Nn,t=Au;Au=0;var n=Kr(hn),a=C.T,i=q.p;try{q.p=32>n?32:n,C.T=null,n=ju,ju=null;var r=Nn,f=hn;if(We=0,Ya=Nn=null,hn=0,(ge&6)!==0)throw Error(u(331));var m=ge;if(ge|=4,Yd(r.current),Hd(r,r.current,f,n),ge=m,Hl(0,!1),yt&&typeof yt.onPostCommitFiberRoot=="function")try{yt.onPostCommitFiberRoot(nl,r)}catch{}return!0}finally{q.p=i,C.T=a,ih(e,t)}}function sh(e,t,n){t=Mt(n,t),t=su(e.stateNode,t,2),e=An(e,t,2),e!==null&&(ll(e,2),Kt(e))}function ke(e,t,n){if(e.tag===3)sh(e,e,n);else for(;t!==null;){if(t.tag===3){sh(t,e,n);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(On===null||!On.has(a))){e=Mt(n,e),n=ud(2),a=An(t,n,2),a!==null&&(od(n,a,t,e),ll(a,2),Kt(a));break}}t=t.return}}function Cu(e,t,n){var a=e.pingCache;if(a===null){a=e.pingCache=new Zg;var i=new Set;a.set(t,i)}else i=a.get(t),i===void 0&&(i=new Set,a.set(t,i));i.has(n)||(Eu=!0,i.add(n),e=Ig.bind(null,e,t,n),t.then(e,e))}function Ig(e,t,n){var a=e.pingCache;a!==null&&a.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,_e===e&&(se&n)===n&&(He===4||He===3&&(se&62914560)===se&&300>gt()-tr?(ge&2)===0&&Ga(e,0):Tu|=n,qa===se&&(qa=0)),Kt(e)}function uh(e,t){t===0&&(t=tc()),e=Fn(e,t),e!==null&&(ll(e,t),Kt(e))}function Pg(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),uh(e,n)}function ey(e,t){var n=0;switch(e.tag){case 31:case 13:var a=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:a=e.stateNode;break;case 22:a=e.stateNode._retryCache;break;default:throw Error(u(314))}a!==null&&a.delete(t),uh(e,n)}function ty(e,t){return $r(e,t)}var ur=null,Qa=null,Ou=!1,or=!1,Nu=!1,Ln=0;function Kt(e){e!==Qa&&e.next===null&&(Qa===null?ur=Qa=e:Qa=Qa.next=e),or=!0,Ou||(Ou=!0,ay())}function Hl(e,t){if(!Nu&&or){Nu=!0;do for(var n=!1,a=ur;a!==null;){if(e!==0){var i=a.pendingLanes;if(i===0)var r=0;else{var f=a.suspendedLanes,m=a.pingedLanes;r=(1<<31-vt(42|e)+1)-1,r&=i&~(f&~m),r=r&201326741?r&201326741|1:r?r|2:0}r!==0&&(n=!0,dh(a,r))}else r=se,r=hi(a,a===_e?r:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(r&3)===0||al(a,r)||(n=!0,dh(a,r));a=a.next}while(n);Nu=!1}}function ny(){oh()}function oh(){or=Ou=!1;var e=0;Ln!==0&&hy()&&(e=Ln);for(var t=gt(),n=null,a=ur;a!==null;){var i=a.next,r=ch(a,t);r===0?(a.next=null,n===null?ur=i:n.next=i,i===null&&(Qa=n)):(n=a,(e!==0||(r&3)!==0)&&(or=!0)),a=i}We!==0&&We!==5||Hl(e),Ln!==0&&(Ln=0)}function ch(e,t){for(var n=e.suspendedLanes,a=e.pingedLanes,i=e.expirationTimes,r=e.pendingLanes&-62914561;0<r;){var f=31-vt(r),m=1<<f,b=i[f];b===-1?((m&n)===0||(m&a)!==0)&&(i[f]=Rp(m,t)):b<=t&&(e.expiredLanes|=m),r&=~m}if(t=_e,n=se,n=hi(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a=e.callbackNode,n===0||e===t&&(xe===2||xe===9)||e.cancelPendingCommit!==null)return a!==null&&a!==null&&Vr(a),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||al(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(a!==null&&Vr(a),Kr(n)){case 2:case 8:n=Po;break;case 32:n=oi;break;case 268435456:n=ec;break;default:n=oi}return a=fh.bind(null,e),n=$r(n,a),e.callbackPriority=t,e.callbackNode=n,t}return a!==null&&a!==null&&Vr(a),e.callbackPriority=2,e.callbackNode=null,2}function fh(e,t){if(We!==0&&We!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(sr()&&e.callbackNode!==n)return null;var a=se;return a=hi(e,e===_e?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a===0?null:(Vd(e,a,t),ch(e,gt()),e.callbackNode!=null&&e.callbackNode===n?fh.bind(null,e):null)}function dh(e,t){if(sr())return null;Vd(e,t,!0)}function ay(){py(function(){(ge&6)!==0?$r(Io,ny):oh()})}function Du(){if(Ln===0){var e=Ra;e===0&&(e=ci,ci<<=1,(ci&261888)===0&&(ci=256)),Ln=e}return Ln}function hh(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:yi(""+e)}function mh(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function ly(e,t,n,a,i){if(t==="submit"&&n&&n.stateNode===i){var r=hh((i[ot]||null).action),f=a.submitter;f&&(t=(t=f[ot]||null)?hh(t.formAction):f.getAttribute("formAction"),t!==null&&(r=t,f=null));var m=new ki("action","action",null,a,i);e.push({event:m,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(Ln!==0){var b=f?mh(i,f):new FormData(i);tu(n,{pending:!0,data:b,method:i.method,action:r},null,b)}}else typeof r=="function"&&(m.preventDefault(),b=f?mh(i,f):new FormData(i),tu(n,{pending:!0,data:b,method:i.method,action:r},r,b))},currentTarget:i}]})}}for(var Lu=0;Lu<vs.length;Lu++){var Uu=vs[Lu],iy=Uu.toLowerCase(),ry=Uu[0].toUpperCase()+Uu.slice(1);Ht(iy,"on"+ry)}Ht(Qc,"onAnimationEnd"),Ht($c,"onAnimationIteration"),Ht(Vc,"onAnimationStart"),Ht("dblclick","onDoubleClick"),Ht("focusin","onFocus"),Ht("focusout","onBlur"),Ht(Sg,"onTransitionRun"),Ht(wg,"onTransitionStart"),Ht(Eg,"onTransitionCancel"),Ht(Zc,"onTransitionEnd"),pa("onMouseEnter",["mouseout","mouseover"]),pa("onMouseLeave",["mouseout","mouseover"]),pa("onPointerEnter",["pointerout","pointerover"]),pa("onPointerLeave",["pointerout","pointerover"]),Zn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Zn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Zn("onBeforeInput",["compositionend","keypress","textInput","paste"]),Zn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Zn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Zn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),sy=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bl));function ph(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var a=e[n],i=a.event;a=a.listeners;e:{var r=void 0;if(t)for(var f=a.length-1;0<=f;f--){var m=a[f],b=m.instance,A=m.currentTarget;if(m=m.listener,b!==r&&i.isPropagationStopped())break e;r=m,i.currentTarget=A;try{r(i)}catch(M){Ei(M)}i.currentTarget=null,r=b}else for(f=0;f<a.length;f++){if(m=a[f],b=m.instance,A=m.currentTarget,m=m.listener,b!==r&&i.isPropagationStopped())break e;r=m,i.currentTarget=A;try{r(i)}catch(M){Ei(M)}i.currentTarget=null,r=b}}}}function re(e,t){var n=t[Wr];n===void 0&&(n=t[Wr]=new Set);var a=e+"__bubble";n.has(a)||(gh(t,e,2,!1),n.add(a))}function Hu(e,t,n){var a=0;t&&(a|=4),gh(n,e,a,t)}var cr="_reactListening"+Math.random().toString(36).slice(2);function Bu(e){if(!e[cr]){e[cr]=!0,uc.forEach(function(n){n!=="selectionchange"&&(sy.has(n)||Hu(n,!1,e),Hu(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[cr]||(t[cr]=!0,Hu("selectionchange",!1,t))}}function gh(e,t,n,a){switch($h(t)){case 2:var i=Dy;break;case 8:i=Ly;break;default:i=eo}n=i.bind(null,t,n,e),i=void 0,!is||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),a?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function qu(e,t,n,a,i){var r=a;if((t&1)===0&&(t&2)===0&&a!==null)e:for(;;){if(a===null)return;var f=a.tag;if(f===3||f===4){var m=a.stateNode.containerInfo;if(m===i)break;if(f===4)for(f=a.return;f!==null;){var b=f.tag;if((b===3||b===4)&&f.stateNode.containerInfo===i)return;f=f.return}for(;m!==null;){if(f=da(m),f===null)return;if(b=f.tag,b===5||b===6||b===26||b===27){a=r=f;continue e}m=m.parentNode}}a=a.return}xc(function(){var A=r,M=as(n),N=[];e:{var j=Jc.get(e);if(j!==void 0){var R=ki,$=e;switch(e){case"keypress":if(bi(n)===0)break e;case"keydown":case"keyup":R=eg;break;case"focusin":$="focus",R=os;break;case"focusout":$="blur",R=os;break;case"beforeblur":case"afterblur":R=os;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":R=wc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":R=Gp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":R=ag;break;case Qc:case $c:case Vc:R=$p;break;case Zc:R=ig;break;case"scroll":case"scrollend":R=qp;break;case"wheel":R=sg;break;case"copy":case"cut":case"paste":R=Zp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":R=Tc;break;case"toggle":case"beforetoggle":R=og}var F=(t&4)!==0,Te=!F&&(e==="scroll"||e==="scrollend"),E=F?j!==null?j+"Capture":null:j;F=[];for(var k=A,_;k!==null;){var O=k;if(_=O.stateNode,O=O.tag,O!==5&&O!==26&&O!==27||_===null||E===null||(O=sl(k,E),O!=null&&F.push(ql(k,O,_))),Te)break;k=k.return}0<F.length&&(j=new R(j,$,null,n,M),N.push({event:j,listeners:F}))}}if((t&7)===0){e:{if(j=e==="mouseover"||e==="pointerover",R=e==="mouseout"||e==="pointerout",j&&n!==ns&&($=n.relatedTarget||n.fromElement)&&(da($)||$[fa]))break e;if((R||j)&&(j=M.window===M?M:(j=M.ownerDocument)?j.defaultView||j.parentWindow:window,R?($=n.relatedTarget||n.toElement,R=A,$=$?da($):null,$!==null&&(Te=d($),F=$.tag,$!==Te||F!==5&&F!==27&&F!==6)&&($=null)):(R=null,$=A),R!==$)){if(F=wc,O="onMouseLeave",E="onMouseEnter",k="mouse",(e==="pointerout"||e==="pointerover")&&(F=Tc,O="onPointerLeave",E="onPointerEnter",k="pointer"),Te=R==null?j:rl(R),_=$==null?j:rl($),j=new F(O,k+"leave",R,n,M),j.target=Te,j.relatedTarget=_,O=null,da(M)===A&&(F=new F(E,k+"enter",$,n,M),F.target=_,F.relatedTarget=Te,O=F),Te=O,R&&$)t:{for(F=uy,E=R,k=$,_=0,O=E;O;O=F(O))_++;O=0;for(var K=k;K;K=F(K))O++;for(;0<_-O;)E=F(E),_--;for(;0<O-_;)k=F(k),O--;for(;_--;){if(E===k||k!==null&&E===k.alternate){F=E;break t}E=F(E),k=F(k)}F=null}else F=null;R!==null&&yh(N,j,R,F,!1),$!==null&&Te!==null&&yh(N,Te,$,F,!0)}}e:{if(j=A?rl(A):window,R=j.nodeName&&j.nodeName.toLowerCase(),R==="select"||R==="input"&&j.type==="file")var me=Oc;else if(Mc(j))if(Nc)me=bg;else{me=yg;var Z=gg}else R=j.nodeName,!R||R.toLowerCase()!=="input"||j.type!=="checkbox"&&j.type!=="radio"?A&&ts(A.elementType)&&(me=Oc):me=vg;if(me&&(me=me(e,A))){Cc(N,me,n,M);break e}Z&&Z(e,j,A),e==="focusout"&&A&&j.type==="number"&&A.memoizedProps.value!=null&&es(j,"number",j.value)}switch(Z=A?rl(A):window,e){case"focusin":(Mc(Z)||Z.contentEditable==="true")&&(ka=Z,ps=A,pl=null);break;case"focusout":pl=ps=ka=null;break;case"mousedown":gs=!0;break;case"contextmenu":case"mouseup":case"dragend":gs=!1,Gc(N,n,M);break;case"selectionchange":if(kg)break;case"keydown":case"keyup":Gc(N,n,M)}var ae;if(fs)e:{switch(e){case"compositionstart":var ue="onCompositionStart";break e;case"compositionend":ue="onCompositionEnd";break e;case"compositionupdate":ue="onCompositionUpdate";break e}ue=void 0}else xa?Rc(e,n)&&(ue="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(ue="onCompositionStart");ue&&(_c&&n.locale!=="ko"&&(xa||ue!=="onCompositionStart"?ue==="onCompositionEnd"&&xa&&(ae=kc()):(xn=M,rs="value"in xn?xn.value:xn.textContent,xa=!0)),Z=fr(A,ue),0<Z.length&&(ue=new Ec(ue,e,null,n,M),N.push({event:ue,listeners:Z}),ae?ue.data=ae:(ae=zc(n),ae!==null&&(ue.data=ae)))),(ae=fg?dg(e,n):hg(e,n))&&(ue=fr(A,"onBeforeInput"),0<ue.length&&(Z=new Ec("onBeforeInput","beforeinput",null,n,M),N.push({event:Z,listeners:ue}),Z.data=ae)),ly(N,e,A,n,M)}ph(N,t)})}function ql(e,t,n){return{instance:e,listener:t,currentTarget:n}}function fr(e,t){for(var n=t+"Capture",a=[];e!==null;){var i=e,r=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||r===null||(i=sl(e,n),i!=null&&a.unshift(ql(e,i,r)),i=sl(e,t),i!=null&&a.push(ql(e,i,r))),e.tag===3)return a;e=e.return}return[]}function uy(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function yh(e,t,n,a,i){for(var r=t._reactName,f=[];n!==null&&n!==a;){var m=n,b=m.alternate,A=m.stateNode;if(m=m.tag,b!==null&&b===a)break;m!==5&&m!==26&&m!==27||A===null||(b=A,i?(A=sl(n,r),A!=null&&f.unshift(ql(n,A,b))):i||(A=sl(n,r),A!=null&&f.push(ql(n,A,b)))),n=n.return}f.length!==0&&e.push({event:t,listeners:f})}var oy=/\r\n?/g,cy=/\u0000|\uFFFD/g;function vh(e){return(typeof e=="string"?e:""+e).replace(oy,`
`).replace(cy,"")}function bh(e,t){return t=vh(t),vh(e)===t}function Ee(e,t,n,a,i,r){switch(n){case"children":typeof a=="string"?t==="body"||t==="textarea"&&a===""||ya(e,a):(typeof a=="number"||typeof a=="bigint")&&t!=="body"&&ya(e,""+a);break;case"className":pi(e,"class",a);break;case"tabIndex":pi(e,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":pi(e,n,a);break;case"style":vc(e,a,r);break;case"data":if(t!=="object"){pi(e,"data",a);break}case"src":case"href":if(a===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(n);break}a=yi(""+a),e.setAttribute(n,a);break;case"action":case"formAction":if(typeof a=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof r=="function"&&(n==="formAction"?(t!=="input"&&Ee(e,t,"name",i.name,i,null),Ee(e,t,"formEncType",i.formEncType,i,null),Ee(e,t,"formMethod",i.formMethod,i,null),Ee(e,t,"formTarget",i.formTarget,i,null)):(Ee(e,t,"encType",i.encType,i,null),Ee(e,t,"method",i.method,i,null),Ee(e,t,"target",i.target,i,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(n);break}a=yi(""+a),e.setAttribute(n,a);break;case"onClick":a!=null&&(e.onclick=Ft);break;case"onScroll":a!=null&&re("scroll",e);break;case"onScrollEnd":a!=null&&re("scrollend",e);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(u(61));if(n=a.__html,n!=null){if(i.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"multiple":e.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":e.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){e.removeAttribute("xlink:href");break}n=yi(""+a),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(n,""+a):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":a===!0?e.setAttribute(n,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(n,a):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?e.setAttribute(n,a):e.removeAttribute(n);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?e.removeAttribute(n):e.setAttribute(n,a);break;case"popover":re("beforetoggle",e),re("toggle",e),mi(e,"popover",a);break;case"xlinkActuate":Wt(e,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":Wt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":Wt(e,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":Wt(e,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":Wt(e,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":Wt(e,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":Wt(e,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":mi(e,"is",a);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Hp.get(n)||n,mi(e,n,a))}}function Yu(e,t,n,a,i,r){switch(n){case"style":vc(e,a,r);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(u(61));if(n=a.__html,n!=null){if(i.children!=null)throw Error(u(60));e.innerHTML=n}}break;case"children":typeof a=="string"?ya(e,a):(typeof a=="number"||typeof a=="bigint")&&ya(e,""+a);break;case"onScroll":a!=null&&re("scroll",e);break;case"onScrollEnd":a!=null&&re("scrollend",e);break;case"onClick":a!=null&&(e.onclick=Ft);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!oc.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(i=n.endsWith("Capture"),t=n.slice(2,i?n.length-7:void 0),r=e[ot]||null,r=r!=null?r[n]:null,typeof r=="function"&&e.removeEventListener(t,r,i),typeof a=="function")){typeof r!="function"&&r!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,a,i);break e}n in e?e[n]=a:a===!0?e.setAttribute(n,""):mi(e,n,a)}}}function lt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":re("error",e),re("load",e);var a=!1,i=!1,r;for(r in n)if(n.hasOwnProperty(r)){var f=n[r];if(f!=null)switch(r){case"src":a=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:Ee(e,t,r,f,n,null)}}i&&Ee(e,t,"srcSet",n.srcSet,n,null),a&&Ee(e,t,"src",n.src,n,null);return;case"input":re("invalid",e);var m=r=f=i=null,b=null,A=null;for(a in n)if(n.hasOwnProperty(a)){var M=n[a];if(M!=null)switch(a){case"name":i=M;break;case"type":f=M;break;case"checked":b=M;break;case"defaultChecked":A=M;break;case"value":r=M;break;case"defaultValue":m=M;break;case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(u(137,t));break;default:Ee(e,t,a,M,n,null)}}mc(e,r,m,b,A,f,i,!1);return;case"select":re("invalid",e),a=f=r=null;for(i in n)if(n.hasOwnProperty(i)&&(m=n[i],m!=null))switch(i){case"value":r=m;break;case"defaultValue":f=m;break;case"multiple":a=m;default:Ee(e,t,i,m,n,null)}t=r,n=f,e.multiple=!!a,t!=null?ga(e,!!a,t,!1):n!=null&&ga(e,!!a,n,!0);return;case"textarea":re("invalid",e),r=i=a=null;for(f in n)if(n.hasOwnProperty(f)&&(m=n[f],m!=null))switch(f){case"value":a=m;break;case"defaultValue":i=m;break;case"children":r=m;break;case"dangerouslySetInnerHTML":if(m!=null)throw Error(u(91));break;default:Ee(e,t,f,m,n,null)}gc(e,a,i,r);return;case"option":for(b in n)if(n.hasOwnProperty(b)&&(a=n[b],a!=null))switch(b){case"selected":e.selected=a&&typeof a!="function"&&typeof a!="symbol";break;default:Ee(e,t,b,a,n,null)}return;case"dialog":re("beforetoggle",e),re("toggle",e),re("cancel",e),re("close",e);break;case"iframe":case"object":re("load",e);break;case"video":case"audio":for(a=0;a<Bl.length;a++)re(Bl[a],e);break;case"image":re("error",e),re("load",e);break;case"details":re("toggle",e);break;case"embed":case"source":case"link":re("error",e),re("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(A in n)if(n.hasOwnProperty(A)&&(a=n[A],a!=null))switch(A){case"children":case"dangerouslySetInnerHTML":throw Error(u(137,t));default:Ee(e,t,A,a,n,null)}return;default:if(ts(t)){for(M in n)n.hasOwnProperty(M)&&(a=n[M],a!==void 0&&Yu(e,t,M,a,n,void 0));return}}for(m in n)n.hasOwnProperty(m)&&(a=n[m],a!=null&&Ee(e,t,m,a,n,null))}function fy(e,t,n,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,r=null,f=null,m=null,b=null,A=null,M=null;for(R in n){var N=n[R];if(n.hasOwnProperty(R)&&N!=null)switch(R){case"checked":break;case"value":break;case"defaultValue":b=N;default:a.hasOwnProperty(R)||Ee(e,t,R,null,a,N)}}for(var j in a){var R=a[j];if(N=n[j],a.hasOwnProperty(j)&&(R!=null||N!=null))switch(j){case"type":r=R;break;case"name":i=R;break;case"checked":A=R;break;case"defaultChecked":M=R;break;case"value":f=R;break;case"defaultValue":m=R;break;case"children":case"dangerouslySetInnerHTML":if(R!=null)throw Error(u(137,t));break;default:R!==N&&Ee(e,t,j,R,a,N)}}Pr(e,f,m,b,A,M,r,i);return;case"select":R=f=m=j=null;for(r in n)if(b=n[r],n.hasOwnProperty(r)&&b!=null)switch(r){case"value":break;case"multiple":R=b;default:a.hasOwnProperty(r)||Ee(e,t,r,null,a,b)}for(i in a)if(r=a[i],b=n[i],a.hasOwnProperty(i)&&(r!=null||b!=null))switch(i){case"value":j=r;break;case"defaultValue":m=r;break;case"multiple":f=r;default:r!==b&&Ee(e,t,i,r,a,b)}t=m,n=f,a=R,j!=null?ga(e,!!n,j,!1):!!a!=!!n&&(t!=null?ga(e,!!n,t,!0):ga(e,!!n,n?[]:"",!1));return;case"textarea":R=j=null;for(m in n)if(i=n[m],n.hasOwnProperty(m)&&i!=null&&!a.hasOwnProperty(m))switch(m){case"value":break;case"children":break;default:Ee(e,t,m,null,a,i)}for(f in a)if(i=a[f],r=n[f],a.hasOwnProperty(f)&&(i!=null||r!=null))switch(f){case"value":j=i;break;case"defaultValue":R=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(u(91));break;default:i!==r&&Ee(e,t,f,i,a,r)}pc(e,j,R);return;case"option":for(var $ in n)if(j=n[$],n.hasOwnProperty($)&&j!=null&&!a.hasOwnProperty($))switch($){case"selected":e.selected=!1;break;default:Ee(e,t,$,null,a,j)}for(b in a)if(j=a[b],R=n[b],a.hasOwnProperty(b)&&j!==R&&(j!=null||R!=null))switch(b){case"selected":e.selected=j&&typeof j!="function"&&typeof j!="symbol";break;default:Ee(e,t,b,j,a,R)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var F in n)j=n[F],n.hasOwnProperty(F)&&j!=null&&!a.hasOwnProperty(F)&&Ee(e,t,F,null,a,j);for(A in a)if(j=a[A],R=n[A],a.hasOwnProperty(A)&&j!==R&&(j!=null||R!=null))switch(A){case"children":case"dangerouslySetInnerHTML":if(j!=null)throw Error(u(137,t));break;default:Ee(e,t,A,j,a,R)}return;default:if(ts(t)){for(var Te in n)j=n[Te],n.hasOwnProperty(Te)&&j!==void 0&&!a.hasOwnProperty(Te)&&Yu(e,t,Te,void 0,a,j);for(M in a)j=a[M],R=n[M],!a.hasOwnProperty(M)||j===R||j===void 0&&R===void 0||Yu(e,t,M,j,a,R);return}}for(var E in n)j=n[E],n.hasOwnProperty(E)&&j!=null&&!a.hasOwnProperty(E)&&Ee(e,t,E,null,a,j);for(N in a)j=a[N],R=n[N],!a.hasOwnProperty(N)||j===R||j==null&&R==null||Ee(e,t,N,j,a,R)}function xh(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function dy(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),a=0;a<n.length;a++){var i=n[a],r=i.transferSize,f=i.initiatorType,m=i.duration;if(r&&m&&xh(f)){for(f=0,m=i.responseEnd,a+=1;a<n.length;a++){var b=n[a],A=b.startTime;if(A>m)break;var M=b.transferSize,N=b.initiatorType;M&&xh(N)&&(b=b.responseEnd,f+=M*(b<m?1:(m-A)/(b-A)))}if(--a,t+=8*(r+f)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Gu=null,Xu=null;function dr(e){return e.nodeType===9?e:e.ownerDocument}function kh(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Sh(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Qu(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var $u=null;function hy(){var e=window.event;return e&&e.type==="popstate"?e===$u?!1:($u=e,!0):($u=null,!1)}var wh=typeof setTimeout=="function"?setTimeout:void 0,my=typeof clearTimeout=="function"?clearTimeout:void 0,Eh=typeof Promise=="function"?Promise:void 0,py=typeof queueMicrotask=="function"?queueMicrotask:typeof Eh<"u"?function(e){return Eh.resolve(null).then(e).catch(gy)}:wh;function gy(e){setTimeout(function(){throw e})}function Un(e){return e==="head"}function Th(e,t){var n=t,a=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"||n==="/&"){if(a===0){e.removeChild(i),Ja(t);return}a--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")a++;else if(n==="html")Yl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Yl(n);for(var r=n.firstChild;r;){var f=r.nextSibling,m=r.nodeName;r[il]||m==="SCRIPT"||m==="STYLE"||m==="LINK"&&r.rel.toLowerCase()==="stylesheet"||n.removeChild(r),r=f}}else n==="body"&&Yl(e.ownerDocument.body);n=i}while(n);Ja(t)}function _h(e,t){var n=e;e=0;do{var a=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),a&&a.nodeType===8)if(n=a.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=a}while(n)}function Vu(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Vu(n),Fr(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function yy(e,t,n,a){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!a&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(a){if(!e[il])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(r=e.getAttribute("rel"),r==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(r!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(r=e.getAttribute("src"),(r!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&r&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var r=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===r)return e}else return e;if(e=Lt(e.nextSibling),e===null)break}return null}function vy(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Lt(e.nextSibling),e===null))return null;return e}function Ah(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Lt(e.nextSibling),e===null))return null;return e}function Zu(e){return e.data==="$?"||e.data==="$~"}function Ju(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function by(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var a=function(){t(),n.removeEventListener("DOMContentLoaded",a)};n.addEventListener("DOMContentLoaded",a),e._reactRetry=a}}function Lt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Ku=null;function jh(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Lt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Rh(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function zh(e,t,n){switch(t=dr(n),e){case"html":if(e=t.documentElement,!e)throw Error(u(452));return e;case"head":if(e=t.head,!e)throw Error(u(453));return e;case"body":if(e=t.body,!e)throw Error(u(454));return e;default:throw Error(u(451))}}function Yl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Fr(e)}var Ut=new Map,Mh=new Set;function hr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var mn=q.d;q.d={f:xy,r:ky,D:Sy,C:wy,L:Ey,m:Ty,X:Ay,S:_y,M:jy};function xy(){var e=mn.f(),t=lr();return e||t}function ky(e){var t=ha(e);t!==null&&t.tag===5&&t.type==="form"?Jf(t):mn.r(e)}var $a=typeof document>"u"?null:document;function Ch(e,t,n){var a=$a;if(a&&typeof t=="string"&&t){var i=Rt(t);i='link[rel="'+e+'"][href="'+i+'"]',typeof n=="string"&&(i+='[crossorigin="'+n+'"]'),Mh.has(i)||(Mh.add(i),e={rel:e,crossOrigin:n,href:t},a.querySelector(i)===null&&(t=a.createElement("link"),lt(t,"link",e),Ie(t),a.head.appendChild(t)))}}function Sy(e){mn.D(e),Ch("dns-prefetch",e,null)}function wy(e,t){mn.C(e,t),Ch("preconnect",e,t)}function Ey(e,t,n){mn.L(e,t,n);var a=$a;if(a&&e&&t){var i='link[rel="preload"][as="'+Rt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(i+='[imagesrcset="'+Rt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(i+='[imagesizes="'+Rt(n.imageSizes)+'"]')):i+='[href="'+Rt(e)+'"]';var r=i;switch(t){case"style":r=Va(e);break;case"script":r=Za(e)}Ut.has(r)||(e=x({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Ut.set(r,e),a.querySelector(i)!==null||t==="style"&&a.querySelector(Gl(r))||t==="script"&&a.querySelector(Xl(r))||(t=a.createElement("link"),lt(t,"link",e),Ie(t),a.head.appendChild(t)))}}function Ty(e,t){mn.m(e,t);var n=$a;if(n&&e){var a=t&&typeof t.as=="string"?t.as:"script",i='link[rel="modulepreload"][as="'+Rt(a)+'"][href="'+Rt(e)+'"]',r=i;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":r=Za(e)}if(!Ut.has(r)&&(e=x({rel:"modulepreload",href:e},t),Ut.set(r,e),n.querySelector(i)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Xl(r)))return}a=n.createElement("link"),lt(a,"link",e),Ie(a),n.head.appendChild(a)}}}function _y(e,t,n){mn.S(e,t,n);var a=$a;if(a&&e){var i=ma(a).hoistableStyles,r=Va(e);t=t||"default";var f=i.get(r);if(!f){var m={loading:0,preload:null};if(f=a.querySelector(Gl(r)))m.loading=5;else{e=x({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Ut.get(r))&&Wu(e,n);var b=f=a.createElement("link");Ie(b),lt(b,"link",e),b._p=new Promise(function(A,M){b.onload=A,b.onerror=M}),b.addEventListener("load",function(){m.loading|=1}),b.addEventListener("error",function(){m.loading|=2}),m.loading|=4,mr(f,t,a)}f={type:"stylesheet",instance:f,count:1,state:m},i.set(r,f)}}}function Ay(e,t){mn.X(e,t);var n=$a;if(n&&e){var a=ma(n).hoistableScripts,i=Za(e),r=a.get(i);r||(r=n.querySelector(Xl(i)),r||(e=x({src:e,async:!0},t),(t=Ut.get(i))&&Fu(e,t),r=n.createElement("script"),Ie(r),lt(r,"link",e),n.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},a.set(i,r))}}function jy(e,t){mn.M(e,t);var n=$a;if(n&&e){var a=ma(n).hoistableScripts,i=Za(e),r=a.get(i);r||(r=n.querySelector(Xl(i)),r||(e=x({src:e,async:!0,type:"module"},t),(t=Ut.get(i))&&Fu(e,t),r=n.createElement("script"),Ie(r),lt(r,"link",e),n.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},a.set(i,r))}}function Oh(e,t,n,a){var i=(i=le.current)?hr(i):null;if(!i)throw Error(u(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Va(n.href),n=ma(i).hoistableStyles,a=n.get(t),a||(a={type:"style",instance:null,count:0,state:null},n.set(t,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Va(n.href);var r=ma(i).hoistableStyles,f=r.get(e);if(f||(i=i.ownerDocument||i,f={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},r.set(e,f),(r=i.querySelector(Gl(e)))&&!r._p&&(f.instance=r,f.state.loading=5),Ut.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Ut.set(e,n),r||Ry(i,e,n,f.state))),t&&a===null)throw Error(u(528,""));return f}if(t&&a!==null)throw Error(u(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Za(n),n=ma(i).hoistableScripts,a=n.get(t),a||(a={type:"script",instance:null,count:0,state:null},n.set(t,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(u(444,e))}}function Va(e){return'href="'+Rt(e)+'"'}function Gl(e){return'link[rel="stylesheet"]['+e+"]"}function Nh(e){return x({},e,{"data-precedence":e.precedence,precedence:null})}function Ry(e,t,n,a){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?a.loading=1:(t=e.createElement("link"),a.preload=t,t.addEventListener("load",function(){return a.loading|=1}),t.addEventListener("error",function(){return a.loading|=2}),lt(t,"link",n),Ie(t),e.head.appendChild(t))}function Za(e){return'[src="'+Rt(e)+'"]'}function Xl(e){return"script[async]"+e}function Dh(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var a=e.querySelector('style[data-href~="'+Rt(n.href)+'"]');if(a)return t.instance=a,Ie(a),a;var i=x({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return a=(e.ownerDocument||e).createElement("style"),Ie(a),lt(a,"style",i),mr(a,n.precedence,e),t.instance=a;case"stylesheet":i=Va(n.href);var r=e.querySelector(Gl(i));if(r)return t.state.loading|=4,t.instance=r,Ie(r),r;a=Nh(n),(i=Ut.get(i))&&Wu(a,i),r=(e.ownerDocument||e).createElement("link"),Ie(r);var f=r;return f._p=new Promise(function(m,b){f.onload=m,f.onerror=b}),lt(r,"link",a),t.state.loading|=4,mr(r,n.precedence,e),t.instance=r;case"script":return r=Za(n.src),(i=e.querySelector(Xl(r)))?(t.instance=i,Ie(i),i):(a=n,(i=Ut.get(r))&&(a=x({},n),Fu(a,i)),e=e.ownerDocument||e,i=e.createElement("script"),Ie(i),lt(i,"link",a),e.head.appendChild(i),t.instance=i);case"void":return null;default:throw Error(u(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(a=t.instance,t.state.loading|=4,mr(a,n.precedence,e));return t.instance}function mr(e,t,n){for(var a=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=a.length?a[a.length-1]:null,r=i,f=0;f<a.length;f++){var m=a[f];if(m.dataset.precedence===t)r=m;else if(r!==i)break}r?r.parentNode.insertBefore(e,r.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Wu(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Fu(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var pr=null;function Lh(e,t,n){if(pr===null){var a=new Map,i=pr=new Map;i.set(n,a)}else i=pr,a=i.get(n),a||(a=new Map,i.set(n,a));if(a.has(e))return a;for(a.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var r=n[i];if(!(r[il]||r[et]||e==="link"&&r.getAttribute("rel")==="stylesheet")&&r.namespaceURI!=="http://www.w3.org/2000/svg"){var f=r.getAttribute(t)||"";f=e+f;var m=a.get(f);m?m.push(r):a.set(f,[r])}}return a}function Uh(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function zy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Hh(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function My(e,t,n,a){if(n.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var i=Va(a.href),r=t.querySelector(Gl(i));if(r){t=r._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=gr.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=r,Ie(r);return}r=t.ownerDocument||t,a=Nh(a),(i=Ut.get(i))&&Wu(a,i),r=r.createElement("link"),Ie(r);var f=r;f._p=new Promise(function(m,b){f.onload=m,f.onerror=b}),lt(r,"link",a),n.instance=r}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=gr.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Iu=0;function Cy(e,t){return e.stylesheets&&e.count===0&&vr(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var a=setTimeout(function(){if(e.stylesheets&&vr(e,e.stylesheets),e.unsuspend){var r=e.unsuspend;e.unsuspend=null,r()}},6e4+t);0<e.imgBytes&&Iu===0&&(Iu=62500*dy());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&vr(e,e.stylesheets),e.unsuspend)){var r=e.unsuspend;e.unsuspend=null,r()}},(e.imgBytes>Iu?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(a),clearTimeout(i)}}:null}function gr(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)vr(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var yr=null;function vr(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,yr=new Map,t.forEach(Oy,e),yr=null,gr.call(e))}function Oy(e,t){if(!(t.state.loading&4)){var n=yr.get(e);if(n)var a=n.get(null);else{n=new Map,yr.set(e,n);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),r=0;r<i.length;r++){var f=i[r];(f.nodeName==="LINK"||f.getAttribute("media")!=="not all")&&(n.set(f.dataset.precedence,f),a=f)}a&&n.set(null,a)}i=t.instance,f=i.getAttribute("data-precedence"),r=n.get(f)||a,r===a&&n.set(null,i),n.set(f,i),this.count++,a=gr.bind(this),i.addEventListener("load",a),i.addEventListener("error",a),r?r.parentNode.insertBefore(i,r.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Ql={$$typeof:J,Provider:null,Consumer:null,_currentValue:I,_currentValue2:I,_threadCount:0};function Ny(e,t,n,a,i,r,f,m,b){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Zr(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Zr(0),this.hiddenUpdates=Zr(null),this.identifierPrefix=a,this.onUncaughtError=i,this.onCaughtError=r,this.onRecoverableError=f,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=b,this.incompleteTransitions=new Map}function Bh(e,t,n,a,i,r,f,m,b,A,M,N){return e=new Ny(e,t,n,f,b,A,M,N,m),t=1,r===!0&&(t|=24),r=xt(3,null,null,t),e.current=r,r.stateNode=e,t=Ms(),t.refCount++,e.pooledCache=t,t.refCount++,r.memoizedState={element:a,isDehydrated:n,cache:t},Ds(r),e}function qh(e){return e?(e=Ea,e):Ea}function Yh(e,t,n,a,i,r){i=qh(i),a.context===null?a.context=i:a.pendingContext=i,a=_n(t),a.payload={element:n},r=r===void 0?null:r,r!==null&&(a.callback=r),n=An(e,a,t),n!==null&&(pt(n,e,t),Sl(n,e,t))}function Gh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Pu(e,t){Gh(e,t),(e=e.alternate)&&Gh(e,t)}function Xh(e){if(e.tag===13||e.tag===31){var t=Fn(e,67108864);t!==null&&pt(t,e,67108864),Pu(e,67108864)}}function Qh(e){if(e.tag===13||e.tag===31){var t=Tt();t=Jr(t);var n=Fn(e,t);n!==null&&pt(n,e,t),Pu(e,t)}}var br=!0;function Dy(e,t,n,a){var i=C.T;C.T=null;var r=q.p;try{q.p=2,eo(e,t,n,a)}finally{q.p=r,C.T=i}}function Ly(e,t,n,a){var i=C.T;C.T=null;var r=q.p;try{q.p=8,eo(e,t,n,a)}finally{q.p=r,C.T=i}}function eo(e,t,n,a){if(br){var i=to(a);if(i===null)qu(e,t,a,xr,n),Vh(e,a);else if(Hy(i,e,t,n,a))a.stopPropagation();else if(Vh(e,a),t&4&&-1<Uy.indexOf(e)){for(;i!==null;){var r=ha(i);if(r!==null)switch(r.tag){case 3:if(r=r.stateNode,r.current.memoizedState.isDehydrated){var f=Vn(r.pendingLanes);if(f!==0){var m=r;for(m.pendingLanes|=2,m.entangledLanes|=2;f;){var b=1<<31-vt(f);m.entanglements[1]|=b,f&=~b}Kt(r),(ge&6)===0&&(nr=gt()+500,Hl(0))}}break;case 31:case 13:m=Fn(r,2),m!==null&&pt(m,r,2),lr(),Pu(r,2)}if(r=to(a),r===null&&qu(e,t,a,xr,n),r===i)break;i=r}i!==null&&a.stopPropagation()}else qu(e,t,a,null,n)}}function to(e){return e=as(e),no(e)}var xr=null;function no(e){if(xr=null,e=da(e),e!==null){var t=d(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=h(t),e!==null)return e;e=null}else if(n===31){if(e=v(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xr=e,null}function $h(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Sp()){case Io:return 2;case Po:return 8;case oi:case wp:return 32;case ec:return 268435456;default:return 32}default:return 32}}var ao=!1,Hn=null,Bn=null,qn=null,$l=new Map,Vl=new Map,Yn=[],Uy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Vh(e,t){switch(e){case"focusin":case"focusout":Hn=null;break;case"dragenter":case"dragleave":Bn=null;break;case"mouseover":case"mouseout":qn=null;break;case"pointerover":case"pointerout":$l.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vl.delete(t.pointerId)}}function Zl(e,t,n,a,i,r){return e===null||e.nativeEvent!==r?(e={blockedOn:t,domEventName:n,eventSystemFlags:a,nativeEvent:r,targetContainers:[i]},t!==null&&(t=ha(t),t!==null&&Xh(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Hy(e,t,n,a,i){switch(t){case"focusin":return Hn=Zl(Hn,e,t,n,a,i),!0;case"dragenter":return Bn=Zl(Bn,e,t,n,a,i),!0;case"mouseover":return qn=Zl(qn,e,t,n,a,i),!0;case"pointerover":var r=i.pointerId;return $l.set(r,Zl($l.get(r)||null,e,t,n,a,i)),!0;case"gotpointercapture":return r=i.pointerId,Vl.set(r,Zl(Vl.get(r)||null,e,t,n,a,i)),!0}return!1}function Zh(e){var t=da(e.target);if(t!==null){var n=d(t);if(n!==null){if(t=n.tag,t===13){if(t=h(n),t!==null){e.blockedOn=t,rc(e.priority,function(){Qh(n)});return}}else if(t===31){if(t=v(n),t!==null){e.blockedOn=t,rc(e.priority,function(){Qh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function kr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=to(e.nativeEvent);if(n===null){n=e.nativeEvent;var a=new n.constructor(n.type,n);ns=a,n.target.dispatchEvent(a),ns=null}else return t=ha(n),t!==null&&Xh(t),e.blockedOn=n,!1;t.shift()}return!0}function Jh(e,t,n){kr(e)&&n.delete(t)}function By(){ao=!1,Hn!==null&&kr(Hn)&&(Hn=null),Bn!==null&&kr(Bn)&&(Bn=null),qn!==null&&kr(qn)&&(qn=null),$l.forEach(Jh),Vl.forEach(Jh)}function Sr(e,t){e.blockedOn===t&&(e.blockedOn=null,ao||(ao=!0,l.unstable_scheduleCallback(l.unstable_NormalPriority,By)))}var wr=null;function Kh(e){wr!==e&&(wr=e,l.unstable_scheduleCallback(l.unstable_NormalPriority,function(){wr===e&&(wr=null);for(var t=0;t<e.length;t+=3){var n=e[t],a=e[t+1],i=e[t+2];if(typeof a!="function"){if(no(a||n)===null)continue;break}var r=ha(n);r!==null&&(e.splice(t,3),t-=3,tu(r,{pending:!0,data:i,method:n.method,action:a},a,i))}}))}function Ja(e){function t(b){return Sr(b,e)}Hn!==null&&Sr(Hn,e),Bn!==null&&Sr(Bn,e),qn!==null&&Sr(qn,e),$l.forEach(t),Vl.forEach(t);for(var n=0;n<Yn.length;n++){var a=Yn[n];a.blockedOn===e&&(a.blockedOn=null)}for(;0<Yn.length&&(n=Yn[0],n.blockedOn===null);)Zh(n),n.blockedOn===null&&Yn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(a=0;a<n.length;a+=3){var i=n[a],r=n[a+1],f=i[ot]||null;if(typeof r=="function")f||Kh(n);else if(f){var m=null;if(r&&r.hasAttribute("formAction")){if(i=r,f=r[ot]||null)m=f.formAction;else if(no(i)!==null)continue}else m=f.action;typeof m=="function"?n[a+1]=m:(n.splice(a,3),a-=3),Kh(n)}}}function Wh(){function e(r){r.canIntercept&&r.info==="react-transition"&&r.intercept({handler:function(){return new Promise(function(f){return i=f})},focusReset:"manual",scroll:"manual"})}function t(){i!==null&&(i(),i=null),a||setTimeout(n,20)}function n(){if(!a&&!navigation.transition){var r=navigation.currentEntry;r&&r.url!=null&&navigation.navigate(r.url,{state:r.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){a=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),i!==null&&(i(),i=null)}}}function lo(e){this._internalRoot=e}Er.prototype.render=lo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(u(409));var n=t.current,a=Tt();Yh(n,a,e,t,null,null)},Er.prototype.unmount=lo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Yh(e.current,2,null,e,null,null),lr(),t[fa]=null}};function Er(e){this._internalRoot=e}Er.prototype.unstable_scheduleHydration=function(e){if(e){var t=ic();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Yn.length&&t!==0&&t<Yn[n].priority;n++);Yn.splice(n,0,e),n===0&&Zh(e)}};var Fh=s.version;if(Fh!=="19.2.5")throw Error(u(527,Fh,"19.2.5"));q.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(u(188)):(e=Object.keys(e).join(","),Error(u(268,e)));return e=p(t),e=e!==null?w(e):null,e=e===null?null:e.stateNode,e};var qy={bundleType:0,version:"19.2.5",rendererPackageName:"react-dom",currentDispatcherRef:C,reconcilerVersion:"19.2.5"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Tr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Tr.isDisabled&&Tr.supportsFiber)try{nl=Tr.inject(qy),yt=Tr}catch{}}return Kl.createRoot=function(e,t){if(!c(e))throw Error(u(299));var n=!1,a="",i=ld,r=id,f=rd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(r=t.onCaughtError),t.onRecoverableError!==void 0&&(f=t.onRecoverableError)),t=Bh(e,1,!1,null,null,n,a,null,i,r,f,Wh),e[fa]=t.current,Bu(e),new lo(t)},Kl.hydrateRoot=function(e,t,n){if(!c(e))throw Error(u(299));var a=!1,i="",r=ld,f=id,m=rd,b=null;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onUncaughtError!==void 0&&(r=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(m=n.onRecoverableError),n.formState!==void 0&&(b=n.formState)),t=Bh(e,1,!0,t,n??null,a,i,b,r,f,m,Wh),t.context=qh(null),n=t.current,a=Tt(),a=Jr(a),i=_n(a),i.callback=null,An(n,i,a),n=a,t.current.lanes=n,ll(t,n),Kt(t),e[fa]=t.current,Bu(e),new Er(t)},Kl.version="19.2.5",Kl}var sm;function Ky(){if(sm)return so.exports;sm=1;function l(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l)}catch(s){console.error(s)}}return l(),so.exports=Jy(),so.exports}var Wy=Ky();/**
 * react-router v7.14.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var um="popstate";function om(l){return typeof l=="object"&&l!=null&&"pathname"in l&&"search"in l&&"hash"in l&&"state"in l&&"key"in l}function Fy(l={}){function s(u,c){var p;let d=(p=c.state)==null?void 0:p.masked,{pathname:h,search:v,hash:y}=d||u.location;return vo("",{pathname:h,search:v,hash:y},c.state&&c.state.usr||null,c.state&&c.state.key||"default",d?{pathname:u.location.pathname,search:u.location.search,hash:u.location.hash}:void 0)}function o(u,c){return typeof c=="string"?c:ei(c)}return Py(s,o,null,l)}function Ce(l,s){if(l===!1||l===null||typeof l>"u")throw new Error(s)}function Xt(l,s){if(!l){typeof console<"u"&&console.warn(s);try{throw new Error(s)}catch{}}}function Iy(){return Math.random().toString(36).substring(2,10)}function cm(l,s){return{usr:l.state,key:l.key,idx:s,masked:l.unstable_mask?{pathname:l.pathname,search:l.search,hash:l.hash}:void 0}}function vo(l,s,o=null,u,c){return{pathname:typeof l=="string"?l:l.pathname,search:"",hash:"",...typeof s=="string"?Fa(s):s,state:o,key:s&&s.key||u||Iy(),unstable_mask:c}}function ei({pathname:l="/",search:s="",hash:o=""}){return s&&s!=="?"&&(l+=s.charAt(0)==="?"?s:"?"+s),o&&o!=="#"&&(l+=o.charAt(0)==="#"?o:"#"+o),l}function Fa(l){let s={};if(l){let o=l.indexOf("#");o>=0&&(s.hash=l.substring(o),l=l.substring(0,o));let u=l.indexOf("?");u>=0&&(s.search=l.substring(u),l=l.substring(0,u)),l&&(s.pathname=l)}return s}function Py(l,s,o,u={}){let{window:c=document.defaultView,v5Compat:d=!1}=u,h=c.history,v="POP",y=null,p=w();p==null&&(p=0,h.replaceState({...h.state,idx:p},""));function w(){return(h.state||{idx:null}).idx}function x(){v="POP";let X=w(),G=X==null?null:X-p;p=X,y&&y({action:v,location:H.location,delta:G})}function z(X,G){v="PUSH";let P=om(X)?X:vo(H.location,X,G);p=w()+1;let J=cm(P,p),he=H.createHref(P.unstable_mask||P);try{h.pushState(J,"",he)}catch(ce){if(ce instanceof DOMException&&ce.name==="DataCloneError")throw ce;c.location.assign(he)}d&&y&&y({action:v,location:H.location,delta:1})}function Y(X,G){v="REPLACE";let P=om(X)?X:vo(H.location,X,G);p=w();let J=cm(P,p),he=H.createHref(P.unstable_mask||P);h.replaceState(J,"",he),d&&y&&y({action:v,location:H.location,delta:0})}function U(X){return ev(X)}let H={get action(){return v},get location(){return l(c,h)},listen(X){if(y)throw new Error("A history only accepts one active listener");return c.addEventListener(um,x),y=X,()=>{c.removeEventListener(um,x),y=null}},createHref(X){return s(c,X)},createURL:U,encodeLocation(X){let G=U(X);return{pathname:G.pathname,search:G.search,hash:G.hash}},push:z,replace:Y,go(X){return h.go(X)}};return H}function ev(l,s=!1){let o="http://localhost";typeof window<"u"&&(o=window.location.origin!=="null"?window.location.origin:window.location.href),Ce(o,"No window.location.(origin|href) available to create URL");let u=typeof l=="string"?l:ei(l);return u=u.replace(/ $/,"%20"),!s&&u.startsWith("//")&&(u=o+u),new URL(u,o)}function zm(l,s,o="/"){return tv(l,s,o,!1)}function tv(l,s,o,u){let c=typeof s=="string"?Fa(s):s,d=gn(c.pathname||"/",o);if(d==null)return null;let h=Mm(l);nv(h);let v=null;for(let y=0;v==null&&y<h.length;++y){let p=hv(d);v=fv(h[y],p,u)}return v}function Mm(l,s=[],o=[],u="",c=!1){let d=(h,v,y=c,p)=>{let w={relativePath:p===void 0?h.path||"":p,caseSensitive:h.caseSensitive===!0,childrenIndex:v,route:h};if(w.relativePath.startsWith("/")){if(!w.relativePath.startsWith(u)&&y)return;Ce(w.relativePath.startsWith(u),`Absolute route path "${w.relativePath}" nested under path "${u}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),w.relativePath=w.relativePath.slice(u.length)}let x=Gt([u,w.relativePath]),z=o.concat(w);h.children&&h.children.length>0&&(Ce(h.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${x}".`),Mm(h.children,s,z,x,y)),!(h.path==null&&!h.index)&&s.push({path:x,score:ov(x,h.index),routesMeta:z})};return l.forEach((h,v)=>{var y;if(h.path===""||!((y=h.path)!=null&&y.includes("?")))d(h,v);else for(let p of Cm(h.path))d(h,v,!0,p)}),s}function Cm(l){let s=l.split("/");if(s.length===0)return[];let[o,...u]=s,c=o.endsWith("?"),d=o.replace(/\?$/,"");if(u.length===0)return c?[d,""]:[d];let h=Cm(u.join("/")),v=[];return v.push(...h.map(y=>y===""?d:[d,y].join("/"))),c&&v.push(...h),v.map(y=>l.startsWith("/")&&y===""?"/":y)}function nv(l){l.sort((s,o)=>s.score!==o.score?o.score-s.score:cv(s.routesMeta.map(u=>u.childrenIndex),o.routesMeta.map(u=>u.childrenIndex)))}var av=/^:[\w-]+$/,lv=3,iv=2,rv=1,sv=10,uv=-2,fm=l=>l==="*";function ov(l,s){let o=l.split("/"),u=o.length;return o.some(fm)&&(u+=uv),s&&(u+=iv),o.filter(c=>!fm(c)).reduce((c,d)=>c+(av.test(d)?lv:d===""?rv:sv),u)}function cv(l,s){return l.length===s.length&&l.slice(0,-1).every((u,c)=>u===s[c])?l[l.length-1]-s[s.length-1]:0}function fv(l,s,o=!1){let{routesMeta:u}=l,c={},d="/",h=[];for(let v=0;v<u.length;++v){let y=u[v],p=v===u.length-1,w=d==="/"?s:s.slice(d.length)||"/",x=zr({path:y.relativePath,caseSensitive:y.caseSensitive,end:p},w),z=y.route;if(!x&&p&&o&&!u[u.length-1].route.index&&(x=zr({path:y.relativePath,caseSensitive:y.caseSensitive,end:!1},w)),!x)return null;Object.assign(c,x.params),h.push({params:c,pathname:Gt([d,x.pathname]),pathnameBase:yv(Gt([d,x.pathnameBase])),route:z}),x.pathnameBase!=="/"&&(d=Gt([d,x.pathnameBase]))}return h}function zr(l,s){typeof l=="string"&&(l={path:l,caseSensitive:!1,end:!0});let[o,u]=dv(l.path,l.caseSensitive,l.end),c=s.match(o);if(!c)return null;let d=c[0],h=d.replace(/(.)\/+$/,"$1"),v=c.slice(1);return{params:u.reduce((p,{paramName:w,isOptional:x},z)=>{if(w==="*"){let U=v[z]||"";h=d.slice(0,d.length-U.length).replace(/(.)\/+$/,"$1")}const Y=v[z];return x&&!Y?p[w]=void 0:p[w]=(Y||"").replace(/%2F/g,"/"),p},{}),pathname:d,pathnameBase:h,pattern:l}}function dv(l,s=!1,o=!0){Xt(l==="*"||!l.endsWith("*")||l.endsWith("/*"),`Route path "${l}" will be treated as if it were "${l.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${l.replace(/\*$/,"/*")}".`);let u=[],c="^"+l.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(h,v,y,p,w)=>{if(u.push({paramName:v,isOptional:y!=null}),y){let x=w.charAt(p+h.length);return x&&x!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return l.endsWith("*")?(u.push({paramName:"*"}),c+=l==="*"||l==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):o?c+="\\/*$":l!==""&&l!=="/"&&(c+="(?:(?=\\/|$))"),[new RegExp(c,s?void 0:"i"),u]}function hv(l){try{return l.split("/").map(s=>decodeURIComponent(s).replace(/\//g,"%2F")).join("/")}catch(s){return Xt(!1,`The URL path "${l}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${s}).`),l}}function gn(l,s){if(s==="/")return l;if(!l.toLowerCase().startsWith(s.toLowerCase()))return null;let o=s.endsWith("/")?s.length-1:s.length,u=l.charAt(o);return u&&u!=="/"?null:l.slice(o)||"/"}var mv=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;function pv(l,s="/"){let{pathname:o,search:u="",hash:c=""}=typeof l=="string"?Fa(l):l,d;return o?(o=Om(o),o.startsWith("/")?d=dm(o.substring(1),"/"):d=dm(o,s)):d=s,{pathname:d,search:vv(u),hash:bv(c)}}function dm(l,s){let o=Mr(s).split("/");return l.split("/").forEach(c=>{c===".."?o.length>1&&o.pop():c!=="."&&o.push(c)}),o.length>1?o.join("/"):"/"}function fo(l,s,o,u){return`Cannot include a '${l}' character in a manually specified \`to.${s}\` field [${JSON.stringify(u)}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function gv(l){return l.filter((s,o)=>o===0||s.route.path&&s.route.path.length>0)}function Ao(l){let s=gv(l);return s.map((o,u)=>u===s.length-1?o.pathname:o.pathnameBase)}function Lr(l,s,o,u=!1){let c;typeof l=="string"?c=Fa(l):(c={...l},Ce(!c.pathname||!c.pathname.includes("?"),fo("?","pathname","search",c)),Ce(!c.pathname||!c.pathname.includes("#"),fo("#","pathname","hash",c)),Ce(!c.search||!c.search.includes("#"),fo("#","search","hash",c)));let d=l===""||c.pathname==="",h=d?"/":c.pathname,v;if(h==null)v=o;else{let x=s.length-1;if(!u&&h.startsWith("..")){let z=h.split("/");for(;z[0]==="..";)z.shift(),x-=1;c.pathname=z.join("/")}v=x>=0?s[x]:"/"}let y=pv(c,v),p=h&&h!=="/"&&h.endsWith("/"),w=(d||h===".")&&o.endsWith("/");return!y.pathname.endsWith("/")&&(p||w)&&(y.pathname+="/"),y}var Om=l=>l.replace(/\/\/+/g,"/"),Gt=l=>Om(l.join("/")),Mr=l=>l.replace(/\/+$/,""),yv=l=>Mr(l).replace(/^\/*/,"/"),vv=l=>!l||l==="?"?"":l.startsWith("?")?l:"?"+l,bv=l=>!l||l==="#"?"":l.startsWith("#")?l:"#"+l,xv=class{constructor(l,s,o,u=!1){this.status=l,this.statusText=s||"",this.internal=u,o instanceof Error?(this.data=o.toString(),this.error=o):this.data=o}};function kv(l){return l!=null&&typeof l.status=="number"&&typeof l.statusText=="string"&&typeof l.internal=="boolean"&&"data"in l}function Sv(l){let s=l.map(o=>o.route.path).filter(Boolean);return Gt(s)||"/"}var Nm=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function Dm(l,s){let o=l;if(typeof o!="string"||!mv.test(o))return{absoluteURL:void 0,isExternal:!1,to:o};let u=o,c=!1;if(Nm)try{let d=new URL(window.location.href),h=o.startsWith("//")?new URL(d.protocol+o):new URL(o),v=gn(h.pathname,s);h.origin===d.origin&&v!=null?o=v+h.search+h.hash:c=!0}catch{Xt(!1,`<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:u,isExternal:c,to:o}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var Lm=["POST","PUT","PATCH","DELETE"];new Set(Lm);var wv=["GET",...Lm];new Set(wv);var Ia=T.createContext(null);Ia.displayName="DataRouter";var Ur=T.createContext(null);Ur.displayName="DataRouterState";var Um=T.createContext(!1);function Ev(){return T.useContext(Um)}var Hm=T.createContext({isTransitioning:!1});Hm.displayName="ViewTransition";var Tv=T.createContext(new Map);Tv.displayName="Fetchers";var _v=T.createContext(null);_v.displayName="Await";var At=T.createContext(null);At.displayName="Navigation";var ii=T.createContext(null);ii.displayName="Location";var Qt=T.createContext({outlet:null,matches:[],isDataRoute:!1});Qt.displayName="Route";var jo=T.createContext(null);jo.displayName="RouteError";var Bm="REACT_ROUTER_ERROR",Av="REDIRECT",jv="ROUTE_ERROR_RESPONSE";function Rv(l){if(l.startsWith(`${Bm}:${Av}:{`))try{let s=JSON.parse(l.slice(28));if(typeof s=="object"&&s&&typeof s.status=="number"&&typeof s.statusText=="string"&&typeof s.location=="string"&&typeof s.reloadDocument=="boolean"&&typeof s.replace=="boolean")return s}catch{}}function zv(l){if(l.startsWith(`${Bm}:${jv}:{`))try{let s=JSON.parse(l.slice(40));if(typeof s=="object"&&s&&typeof s.status=="number"&&typeof s.statusText=="string")return new xv(s.status,s.statusText,s.data)}catch{}}function Mv(l,{relative:s}={}){Ce(Pa(),"useHref() may be used only in the context of a <Router> component.");let{basename:o,navigator:u}=T.useContext(At),{hash:c,pathname:d,search:h}=ri(l,{relative:s}),v=d;return o!=="/"&&(v=d==="/"?o:Gt([o,d])),u.createHref({pathname:v,search:h,hash:c})}function Pa(){return T.useContext(ii)!=null}function $t(){return Ce(Pa(),"useLocation() may be used only in the context of a <Router> component."),T.useContext(ii).location}var qm="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Ym(l){T.useContext(At).static||T.useLayoutEffect(l)}function Gm(){let{isDataRoute:l}=T.useContext(Qt);return l?Qv():Cv()}function Cv(){Ce(Pa(),"useNavigate() may be used only in the context of a <Router> component.");let l=T.useContext(Ia),{basename:s,navigator:o}=T.useContext(At),{matches:u}=T.useContext(Qt),{pathname:c}=$t(),d=JSON.stringify(Ao(u)),h=T.useRef(!1);return Ym(()=>{h.current=!0}),T.useCallback((y,p={})=>{if(Xt(h.current,qm),!h.current)return;if(typeof y=="number"){o.go(y);return}let w=Lr(y,JSON.parse(d),c,p.relative==="path");l==null&&s!=="/"&&(w.pathname=w.pathname==="/"?s:Gt([s,w.pathname])),(p.replace?o.replace:o.push)(w,p.state,p)},[s,o,d,c,l])}T.createContext(null);function Xm(){let{matches:l}=T.useContext(Qt),s=l[l.length-1];return(s==null?void 0:s.params)??{}}function ri(l,{relative:s}={}){let{matches:o}=T.useContext(Qt),{pathname:u}=$t(),c=JSON.stringify(Ao(o));return T.useMemo(()=>Lr(l,JSON.parse(c),u,s==="path"),[l,c,u,s])}function Ov(l,s){return Qm(l,s)}function Qm(l,s,o){var X;Ce(Pa(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:u}=T.useContext(At),{matches:c}=T.useContext(Qt),d=c[c.length-1],h=d?d.params:{},v=d?d.pathname:"/",y=d?d.pathnameBase:"/",p=d&&d.route;{let G=p&&p.path||"";Vm(v,!p||G.endsWith("*")||G.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${v}" (under <Route path="${G}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${G}"> to <Route path="${G==="/"?"*":`${G}/*`}">.`)}let w=$t(),x;if(s){let G=typeof s=="string"?Fa(s):s;Ce(y==="/"||((X=G.pathname)==null?void 0:X.startsWith(y)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${G.pathname}" was given in the \`location\` prop.`),x=G}else x=w;let z=x.pathname||"/",Y=z;if(y!=="/"){let G=y.replace(/^\//,"").split("/");Y="/"+z.replace(/^\//,"").split("/").slice(G.length).join("/")}let U=zm(l,{pathname:Y});Xt(p||U!=null,`No routes matched location "${x.pathname}${x.search}${x.hash}" `),Xt(U==null||U[U.length-1].route.element!==void 0||U[U.length-1].route.Component!==void 0||U[U.length-1].route.lazy!==void 0,`Matched leaf route at location "${x.pathname}${x.search}${x.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let H=Hv(U&&U.map(G=>Object.assign({},G,{params:Object.assign({},h,G.params),pathname:Gt([y,u.encodeLocation?u.encodeLocation(G.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:G.pathname]),pathnameBase:G.pathnameBase==="/"?y:Gt([y,u.encodeLocation?u.encodeLocation(G.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:G.pathnameBase])})),c,o);return s&&H?T.createElement(ii.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",unstable_mask:void 0,...x},navigationType:"POP"}},H):H}function Nv(){let l=Xv(),s=kv(l)?`${l.status} ${l.statusText}`:l instanceof Error?l.message:JSON.stringify(l),o=l instanceof Error?l.stack:null,u="rgba(200,200,200, 0.5)",c={padding:"0.5rem",backgroundColor:u},d={padding:"2px 4px",backgroundColor:u},h=null;return console.error("Error handled by React Router default ErrorBoundary:",l),h=T.createElement(T.Fragment,null,T.createElement("p",null,"💿 Hey developer 👋"),T.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",T.createElement("code",{style:d},"ErrorBoundary")," or"," ",T.createElement("code",{style:d},"errorElement")," prop on your route.")),T.createElement(T.Fragment,null,T.createElement("h2",null,"Unexpected Application Error!"),T.createElement("h3",{style:{fontStyle:"italic"}},s),o?T.createElement("pre",{style:c},o):null,h)}var Dv=T.createElement(Nv,null),$m=class extends T.Component{constructor(l){super(l),this.state={location:l.location,revalidation:l.revalidation,error:l.error}}static getDerivedStateFromError(l){return{error:l}}static getDerivedStateFromProps(l,s){return s.location!==l.location||s.revalidation!=="idle"&&l.revalidation==="idle"?{error:l.error,location:l.location,revalidation:l.revalidation}:{error:l.error!==void 0?l.error:s.error,location:s.location,revalidation:l.revalidation||s.revalidation}}componentDidCatch(l,s){this.props.onError?this.props.onError(l,s):console.error("React Router caught the following error during render",l)}render(){let l=this.state.error;if(this.context&&typeof l=="object"&&l&&"digest"in l&&typeof l.digest=="string"){const o=zv(l.digest);o&&(l=o)}let s=l!==void 0?T.createElement(Qt.Provider,{value:this.props.routeContext},T.createElement(jo.Provider,{value:l,children:this.props.component})):this.props.children;return this.context?T.createElement(Lv,{error:l},s):s}};$m.contextType=Um;var ho=new WeakMap;function Lv({children:l,error:s}){let{basename:o}=T.useContext(At);if(typeof s=="object"&&s&&"digest"in s&&typeof s.digest=="string"){let u=Rv(s.digest);if(u){let c=ho.get(s);if(c)throw c;let d=Dm(u.location,o);if(Nm&&!ho.get(s))if(d.isExternal||u.reloadDocument)window.location.href=d.absoluteURL||d.to;else{const h=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(d.to,{replace:u.replace}));throw ho.set(s,h),h}return T.createElement("meta",{httpEquiv:"refresh",content:`0;url=${d.absoluteURL||d.to}`})}}return l}function Uv({routeContext:l,match:s,children:o}){let u=T.useContext(Ia);return u&&u.static&&u.staticContext&&(s.route.errorElement||s.route.ErrorBoundary)&&(u.staticContext._deepestRenderedBoundaryId=s.route.id),T.createElement(Qt.Provider,{value:l},o)}function Hv(l,s=[],o){let u=o==null?void 0:o.state;if(l==null){if(!u)return null;if(u.errors)l=u.matches;else if(s.length===0&&!u.initialized&&u.matches.length>0)l=u.matches;else return null}let c=l,d=u==null?void 0:u.errors;if(d!=null){let w=c.findIndex(x=>x.route.id&&(d==null?void 0:d[x.route.id])!==void 0);Ce(w>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(d).join(",")}`),c=c.slice(0,Math.min(c.length,w+1))}let h=!1,v=-1;if(o&&u){h=u.renderFallback;for(let w=0;w<c.length;w++){let x=c[w];if((x.route.HydrateFallback||x.route.hydrateFallbackElement)&&(v=w),x.route.id){let{loaderData:z,errors:Y}=u,U=x.route.loader&&!z.hasOwnProperty(x.route.id)&&(!Y||Y[x.route.id]===void 0);if(x.route.lazy||U){o.isStatic&&(h=!0),v>=0?c=c.slice(0,v+1):c=[c[0]];break}}}}let y=o==null?void 0:o.onError,p=u&&y?(w,x)=>{var z,Y;y(w,{location:u.location,params:((Y=(z=u.matches)==null?void 0:z[0])==null?void 0:Y.params)??{},unstable_pattern:Sv(u.matches),errorInfo:x})}:void 0;return c.reduceRight((w,x,z)=>{let Y,U=!1,H=null,X=null;u&&(Y=d&&x.route.id?d[x.route.id]:void 0,H=x.route.errorElement||Dv,h&&(v<0&&z===0?(Vm("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),U=!0,X=null):v===z&&(U=!0,X=x.route.hydrateFallbackElement||null)));let G=s.concat(c.slice(0,z+1)),P=()=>{let J;return Y?J=H:U?J=X:x.route.Component?J=T.createElement(x.route.Component,null):x.route.element?J=x.route.element:J=w,T.createElement(Uv,{match:x,routeContext:{outlet:w,matches:G,isDataRoute:u!=null},children:J})};return u&&(x.route.ErrorBoundary||x.route.errorElement||z===0)?T.createElement($m,{location:u.location,revalidation:u.revalidation,component:H,error:Y,children:P(),routeContext:{outlet:null,matches:G,isDataRoute:!0},onError:p}):P()},null)}function Ro(l){return`${l} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Bv(l){let s=T.useContext(Ia);return Ce(s,Ro(l)),s}function qv(l){let s=T.useContext(Ur);return Ce(s,Ro(l)),s}function Yv(l){let s=T.useContext(Qt);return Ce(s,Ro(l)),s}function zo(l){let s=Yv(l),o=s.matches[s.matches.length-1];return Ce(o.route.id,`${l} can only be used on routes that contain a unique "id"`),o.route.id}function Gv(){return zo("useRouteId")}function Xv(){var u;let l=T.useContext(jo),s=qv("useRouteError"),o=zo("useRouteError");return l!==void 0?l:(u=s.errors)==null?void 0:u[o]}function Qv(){let{router:l}=Bv("useNavigate"),s=zo("useNavigate"),o=T.useRef(!1);return Ym(()=>{o.current=!0}),T.useCallback(async(c,d={})=>{Xt(o.current,qm),o.current&&(typeof c=="number"?await l.navigate(c):await l.navigate(c,{fromRouteId:s,...d}))},[l,s])}var hm={};function Vm(l,s,o){!s&&!hm[l]&&(hm[l]=!0,Xt(!1,o))}T.memo($v);function $v({routes:l,future:s,state:o,isStatic:u,onError:c}){return Qm(l,void 0,{state:o,isStatic:u,onError:c})}function Wa({to:l,replace:s,state:o,relative:u}){Ce(Pa(),"<Navigate> may be used only in the context of a <Router> component.");let{static:c}=T.useContext(At);Xt(!c,"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");let{matches:d}=T.useContext(Qt),{pathname:h}=$t(),v=Gm(),y=Lr(l,Ao(d),h,u==="path"),p=JSON.stringify(y);return T.useEffect(()=>{v(JSON.parse(p),{replace:s,state:o,relative:u})},[v,p,u,s,o]),null}function Xn(l){Ce(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function Vv({basename:l="/",children:s=null,location:o,navigationType:u="POP",navigator:c,static:d=!1,unstable_useTransitions:h}){Ce(!Pa(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let v=l.replace(/^\/*/,"/"),y=T.useMemo(()=>({basename:v,navigator:c,static:d,unstable_useTransitions:h,future:{}}),[v,c,d,h]);typeof o=="string"&&(o=Fa(o));let{pathname:p="/",search:w="",hash:x="",state:z=null,key:Y="default",unstable_mask:U}=o,H=T.useMemo(()=>{let X=gn(p,v);return X==null?null:{location:{pathname:X,search:w,hash:x,state:z,key:Y,unstable_mask:U},navigationType:u}},[v,p,w,x,z,Y,u,U]);return Xt(H!=null,`<Router basename="${v}"> is not able to match the URL "${p}${w}${x}" because it does not start with the basename, so the <Router> won't render anything.`),H==null?null:T.createElement(At.Provider,{value:y},T.createElement(ii.Provider,{children:s,value:H}))}function Zv({children:l,location:s}){return Ov(bo(l),s)}function bo(l,s=[]){let o=[];return T.Children.forEach(l,(u,c)=>{if(!T.isValidElement(u))return;let d=[...s,c];if(u.type===T.Fragment){o.push.apply(o,bo(u.props.children,d));return}Ce(u.type===Xn,`[${typeof u.type=="string"?u.type:u.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),Ce(!u.props.index||!u.props.children,"An index route cannot have child routes.");let h={id:u.props.id||d.join("-"),caseSensitive:u.props.caseSensitive,element:u.props.element,Component:u.props.Component,index:u.props.index,path:u.props.path,middleware:u.props.middleware,loader:u.props.loader,action:u.props.action,hydrateFallbackElement:u.props.hydrateFallbackElement,HydrateFallback:u.props.HydrateFallback,errorElement:u.props.errorElement,ErrorBoundary:u.props.ErrorBoundary,hasErrorBoundary:u.props.hasErrorBoundary===!0||u.props.ErrorBoundary!=null||u.props.errorElement!=null,shouldRevalidate:u.props.shouldRevalidate,handle:u.props.handle,lazy:u.props.lazy};u.props.children&&(h.children=bo(u.props.children,d)),o.push(h)}),o}var jr="get",Rr="application/x-www-form-urlencoded";function Hr(l){return typeof HTMLElement<"u"&&l instanceof HTMLElement}function Jv(l){return Hr(l)&&l.tagName.toLowerCase()==="button"}function Kv(l){return Hr(l)&&l.tagName.toLowerCase()==="form"}function Wv(l){return Hr(l)&&l.tagName.toLowerCase()==="input"}function Fv(l){return!!(l.metaKey||l.altKey||l.ctrlKey||l.shiftKey)}function Iv(l,s){return l.button===0&&(!s||s==="_self")&&!Fv(l)}var _r=null;function Pv(){if(_r===null)try{new FormData(document.createElement("form"),0),_r=!1}catch{_r=!0}return _r}var eb=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function mo(l){return l!=null&&!eb.has(l)?(Xt(!1,`"${l}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Rr}"`),null):l}function tb(l,s){let o,u,c,d,h;if(Kv(l)){let v=l.getAttribute("action");u=v?gn(v,s):null,o=l.getAttribute("method")||jr,c=mo(l.getAttribute("enctype"))||Rr,d=new FormData(l)}else if(Jv(l)||Wv(l)&&(l.type==="submit"||l.type==="image")){let v=l.form;if(v==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let y=l.getAttribute("formaction")||v.getAttribute("action");if(u=y?gn(y,s):null,o=l.getAttribute("formmethod")||v.getAttribute("method")||jr,c=mo(l.getAttribute("formenctype"))||mo(v.getAttribute("enctype"))||Rr,d=new FormData(v,l),!Pv()){let{name:p,type:w,value:x}=l;if(w==="image"){let z=p?`${p}.`:"";d.append(`${z}x`,"0"),d.append(`${z}y`,"0")}else p&&d.append(p,x)}}else{if(Hr(l))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');o=jr,u=null,c=Rr,h=l}return d&&c==="text/plain"&&(h=d,d=void 0),{action:u,method:o.toLowerCase(),encType:c,formData:d,body:h}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Mo(l,s){if(l===!1||l===null||typeof l>"u")throw new Error(s)}function Zm(l,s,o,u){let c=typeof l=="string"?new URL(l,typeof window>"u"?"server://singlefetch/":window.location.origin):l;return o?c.pathname.endsWith("/")?c.pathname=`${c.pathname}_.${u}`:c.pathname=`${c.pathname}.${u}`:c.pathname==="/"?c.pathname=`_root.${u}`:s&&gn(c.pathname,s)==="/"?c.pathname=`${Mr(s)}/_root.${u}`:c.pathname=`${Mr(c.pathname)}.${u}`,c}async function nb(l,s){if(l.id in s)return s[l.id];try{let o=await import(l.module);return s[l.id]=o,o}catch(o){return console.error(`Error loading route module \`${l.module}\`, reloading page...`),console.error(o),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function ab(l){return l==null?!1:l.href==null?l.rel==="preload"&&typeof l.imageSrcSet=="string"&&typeof l.imageSizes=="string":typeof l.rel=="string"&&typeof l.href=="string"}async function lb(l,s,o){let u=await Promise.all(l.map(async c=>{let d=s.routes[c.route.id];if(d){let h=await nb(d,o);return h.links?h.links():[]}return[]}));return ub(u.flat(1).filter(ab).filter(c=>c.rel==="stylesheet"||c.rel==="preload").map(c=>c.rel==="stylesheet"?{...c,rel:"prefetch",as:"style"}:{...c,rel:"prefetch"}))}function mm(l,s,o,u,c,d){let h=(y,p)=>o[p]?y.route.id!==o[p].route.id:!0,v=(y,p)=>{var w;return o[p].pathname!==y.pathname||((w=o[p].route.path)==null?void 0:w.endsWith("*"))&&o[p].params["*"]!==y.params["*"]};return d==="assets"?s.filter((y,p)=>h(y,p)||v(y,p)):d==="data"?s.filter((y,p)=>{var x;let w=u.routes[y.route.id];if(!w||!w.hasLoader)return!1;if(h(y,p)||v(y,p))return!0;if(y.route.shouldRevalidate){let z=y.route.shouldRevalidate({currentUrl:new URL(c.pathname+c.search+c.hash,window.origin),currentParams:((x=o[0])==null?void 0:x.params)||{},nextUrl:new URL(l,window.origin),nextParams:y.params,defaultShouldRevalidate:!0});if(typeof z=="boolean")return z}return!0}):[]}function ib(l,s,{includeHydrateFallback:o}={}){return rb(l.map(u=>{let c=s.routes[u.route.id];if(!c)return[];let d=[c.module];return c.clientActionModule&&(d=d.concat(c.clientActionModule)),c.clientLoaderModule&&(d=d.concat(c.clientLoaderModule)),o&&c.hydrateFallbackModule&&(d=d.concat(c.hydrateFallbackModule)),c.imports&&(d=d.concat(c.imports)),d}).flat(1))}function rb(l){return[...new Set(l)]}function sb(l){let s={},o=Object.keys(l).sort();for(let u of o)s[u]=l[u];return s}function ub(l,s){let o=new Set;return new Set(s),l.reduce((u,c)=>{let d=JSON.stringify(sb(c));return o.has(d)||(o.add(d),u.push({key:d,link:c})),u},[])}function Co(){let l=T.useContext(Ia);return Mo(l,"You must render this element inside a <DataRouterContext.Provider> element"),l}function ob(){let l=T.useContext(Ur);return Mo(l,"You must render this element inside a <DataRouterStateContext.Provider> element"),l}var Oo=T.createContext(void 0);Oo.displayName="FrameworkContext";function No(){let l=T.useContext(Oo);return Mo(l,"You must render this element inside a <HydratedRouter> element"),l}function cb(l,s){let o=T.useContext(Oo),[u,c]=T.useState(!1),[d,h]=T.useState(!1),{onFocus:v,onBlur:y,onMouseEnter:p,onMouseLeave:w,onTouchStart:x}=s,z=T.useRef(null);T.useEffect(()=>{if(l==="render"&&h(!0),l==="viewport"){let H=G=>{G.forEach(P=>{h(P.isIntersecting)})},X=new IntersectionObserver(H,{threshold:.5});return z.current&&X.observe(z.current),()=>{X.disconnect()}}},[l]),T.useEffect(()=>{if(u){let H=setTimeout(()=>{h(!0)},100);return()=>{clearTimeout(H)}}},[u]);let Y=()=>{c(!0)},U=()=>{c(!1),h(!1)};return o?l!=="intent"?[d,z,{}]:[d,z,{onFocus:Wl(v,Y),onBlur:Wl(y,U),onMouseEnter:Wl(p,Y),onMouseLeave:Wl(w,U),onTouchStart:Wl(x,Y)}]:[!1,z,{}]}function Wl(l,s){return o=>{l&&l(o),o.defaultPrevented||s(o)}}function fb({page:l,...s}){let o=Ev(),{router:u}=Co(),c=T.useMemo(()=>zm(u.routes,l,u.basename),[u.routes,l,u.basename]);return c?o?T.createElement(hb,{page:l,matches:c,...s}):T.createElement(mb,{page:l,matches:c,...s}):null}function db(l){let{manifest:s,routeModules:o}=No(),[u,c]=T.useState([]);return T.useEffect(()=>{let d=!1;return lb(l,s,o).then(h=>{d||c(h)}),()=>{d=!0}},[l,s,o]),u}function hb({page:l,matches:s,...o}){let u=$t(),{future:c}=No(),{basename:d}=Co(),h=T.useMemo(()=>{if(l===u.pathname+u.search+u.hash)return[];let v=Zm(l,d,c.unstable_trailingSlashAwareDataRequests,"rsc"),y=!1,p=[];for(let w of s)typeof w.route.shouldRevalidate=="function"?y=!0:p.push(w.route.id);return y&&p.length>0&&v.searchParams.set("_routes",p.join(",")),[v.pathname+v.search]},[d,c.unstable_trailingSlashAwareDataRequests,l,u,s]);return T.createElement(T.Fragment,null,h.map(v=>T.createElement("link",{key:v,rel:"prefetch",as:"fetch",href:v,...o})))}function mb({page:l,matches:s,...o}){let u=$t(),{future:c,manifest:d,routeModules:h}=No(),{basename:v}=Co(),{loaderData:y,matches:p}=ob(),w=T.useMemo(()=>mm(l,s,p,d,u,"data"),[l,s,p,d,u]),x=T.useMemo(()=>mm(l,s,p,d,u,"assets"),[l,s,p,d,u]),z=T.useMemo(()=>{if(l===u.pathname+u.search+u.hash)return[];let H=new Set,X=!1;if(s.forEach(P=>{var he;let J=d.routes[P.route.id];!J||!J.hasLoader||(!w.some(ce=>ce.route.id===P.route.id)&&P.route.id in y&&((he=h[P.route.id])!=null&&he.shouldRevalidate)||J.hasClientLoader?X=!0:H.add(P.route.id))}),H.size===0)return[];let G=Zm(l,v,c.unstable_trailingSlashAwareDataRequests,"data");return X&&H.size>0&&G.searchParams.set("_routes",s.filter(P=>H.has(P.route.id)).map(P=>P.route.id).join(",")),[G.pathname+G.search]},[v,c.unstable_trailingSlashAwareDataRequests,y,u,d,w,s,l,h]),Y=T.useMemo(()=>ib(x,d),[x,d]),U=db(x);return T.createElement(T.Fragment,null,z.map(H=>T.createElement("link",{key:H,rel:"prefetch",as:"fetch",href:H,...o})),Y.map(H=>T.createElement("link",{key:H,rel:"modulepreload",href:H,...o})),U.map(({key:H,link:X})=>T.createElement("link",{key:H,nonce:o.nonce,...X,crossOrigin:X.crossOrigin??o.crossOrigin})))}function pb(...l){return s=>{l.forEach(o=>{typeof o=="function"?o(s):o!=null&&(o.current=s)})}}var gb=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{gb&&(window.__reactRouterVersion="7.14.2")}catch{}function yb({basename:l,children:s,unstable_useTransitions:o,window:u}){let c=T.useRef();c.current==null&&(c.current=Fy({window:u,v5Compat:!0}));let d=c.current,[h,v]=T.useState({action:d.action,location:d.location}),y=T.useCallback(p=>{o===!1?v(p):T.startTransition(()=>v(p))},[o]);return T.useLayoutEffect(()=>d.listen(y),[d,y]),T.createElement(Vv,{basename:l,children:s,location:h.location,navigationType:h.action,navigator:d,unstable_useTransitions:o})}var Jm=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,_t=T.forwardRef(function({onClick:s,discover:o="render",prefetch:u="none",relative:c,reloadDocument:d,replace:h,unstable_mask:v,state:y,target:p,to:w,preventScrollReset:x,viewTransition:z,unstable_defaultShouldRevalidate:Y,...U},H){let{basename:X,navigator:G,unstable_useTransitions:P}=T.useContext(At),J=typeof w=="string"&&Jm.test(w),he=Dm(w,X);w=he.to;let ce=Mv(w,{relative:c}),L=$t(),B=null;if(v){let je=Lr(v,[],L.unstable_mask?L.unstable_mask.pathname:"/",!0);X!=="/"&&(je.pathname=je.pathname==="/"?X:Gt([X,je.pathname])),B=G.createHref(je)}let[W,fe,Je]=cb(u,U),Le=xb(w,{replace:h,unstable_mask:v,state:y,target:p,preventScrollReset:x,relative:c,viewTransition:z,unstable_defaultShouldRevalidate:Y,unstable_useTransitions:P});function de(je){s&&s(je),je.defaultPrevented||Le(je)}let Fe=!(he.isExternal||d),Ke=T.createElement("a",{...U,...Je,href:(Fe?B:void 0)||he.absoluteURL||ce,onClick:Fe?de:s,ref:pb(H,fe),target:p,"data-discover":!J&&o==="render"?"true":void 0});return W&&!J?T.createElement(T.Fragment,null,Ke,T.createElement(fb,{page:ce})):Ke});_t.displayName="Link";var Do=T.forwardRef(function({"aria-current":s="page",caseSensitive:o=!1,className:u="",end:c=!1,style:d,to:h,viewTransition:v,children:y,...p},w){let x=ri(h,{relative:p.relative}),z=$t(),Y=T.useContext(Ur),{navigator:U,basename:H}=T.useContext(At),X=Y!=null&&Tb(x)&&v===!0,G=U.encodeLocation?U.encodeLocation(x).pathname:x.pathname,P=z.pathname,J=Y&&Y.navigation&&Y.navigation.location?Y.navigation.location.pathname:null;o||(P=P.toLowerCase(),J=J?J.toLowerCase():null,G=G.toLowerCase()),J&&H&&(J=gn(J,H)||J);const he=G!=="/"&&G.endsWith("/")?G.length-1:G.length;let ce=P===G||!c&&P.startsWith(G)&&P.charAt(he)==="/",L=J!=null&&(J===G||!c&&J.startsWith(G)&&J.charAt(G.length)==="/"),B={isActive:ce,isPending:L,isTransitioning:X},W=ce?s:void 0,fe;typeof u=="function"?fe=u(B):fe=[u,ce?"active":null,L?"pending":null,X?"transitioning":null].filter(Boolean).join(" ");let Je=typeof d=="function"?d(B):d;return T.createElement(_t,{...p,"aria-current":W,className:fe,ref:w,style:Je,to:h,viewTransition:v},typeof y=="function"?y(B):y)});Do.displayName="NavLink";var vb=T.forwardRef(({discover:l="render",fetcherKey:s,navigate:o,reloadDocument:u,replace:c,state:d,method:h=jr,action:v,onSubmit:y,relative:p,preventScrollReset:w,viewTransition:x,unstable_defaultShouldRevalidate:z,...Y},U)=>{let{unstable_useTransitions:H}=T.useContext(At),X=wb(),G=Eb(v,{relative:p}),P=h.toLowerCase()==="get"?"get":"post",J=typeof v=="string"&&Jm.test(v),he=ce=>{if(y&&y(ce),ce.defaultPrevented)return;ce.preventDefault();let L=ce.nativeEvent.submitter,B=(L==null?void 0:L.getAttribute("formmethod"))||h,W=()=>X(L||ce.currentTarget,{fetcherKey:s,method:B,navigate:o,replace:c,state:d,relative:p,preventScrollReset:w,viewTransition:x,unstable_defaultShouldRevalidate:z});H&&o!==!1?T.startTransition(()=>W()):W()};return T.createElement("form",{ref:U,method:P,action:G,onSubmit:u?y:he,...Y,"data-discover":!J&&l==="render"?"true":void 0})});vb.displayName="Form";function bb(l){return`${l} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Km(l){let s=T.useContext(Ia);return Ce(s,bb(l)),s}function xb(l,{target:s,replace:o,unstable_mask:u,state:c,preventScrollReset:d,relative:h,viewTransition:v,unstable_defaultShouldRevalidate:y,unstable_useTransitions:p}={}){let w=Gm(),x=$t(),z=ri(l,{relative:h});return T.useCallback(Y=>{if(Iv(Y,s)){Y.preventDefault();let U=o!==void 0?o:ei(x)===ei(z),H=()=>w(l,{replace:U,unstable_mask:u,state:c,preventScrollReset:d,relative:h,viewTransition:v,unstable_defaultShouldRevalidate:y});p?T.startTransition(()=>H()):H()}},[x,w,z,o,u,c,s,l,d,h,v,y,p])}var kb=0,Sb=()=>`__${String(++kb)}__`;function wb(){let{router:l}=Km("useSubmit"),{basename:s}=T.useContext(At),o=Gv(),u=l.fetch,c=l.navigate;return T.useCallback(async(d,h={})=>{let{action:v,method:y,encType:p,formData:w,body:x}=tb(d,s);if(h.navigate===!1){let z=h.fetcherKey||Sb();await u(z,o,h.action||v,{unstable_defaultShouldRevalidate:h.unstable_defaultShouldRevalidate,preventScrollReset:h.preventScrollReset,formData:w,body:x,formMethod:h.method||y,formEncType:h.encType||p,flushSync:h.flushSync})}else await c(h.action||v,{unstable_defaultShouldRevalidate:h.unstable_defaultShouldRevalidate,preventScrollReset:h.preventScrollReset,formData:w,body:x,formMethod:h.method||y,formEncType:h.encType||p,replace:h.replace,state:h.state,fromRouteId:o,flushSync:h.flushSync,viewTransition:h.viewTransition})},[u,c,s,o])}function Eb(l,{relative:s}={}){let{basename:o}=T.useContext(At),u=T.useContext(Qt);Ce(u,"useFormAction must be used inside a RouteContext");let[c]=u.matches.slice(-1),d={...ri(l||".",{relative:s})},h=$t();if(l==null){d.search=h.search;let v=new URLSearchParams(d.search),y=v.getAll("index");if(y.some(w=>w==="")){v.delete("index"),y.filter(x=>x).forEach(x=>v.append("index",x));let w=v.toString();d.search=w?`?${w}`:""}}return(!l||l===".")&&c.route.index&&(d.search=d.search?d.search.replace(/^\?/,"?index&"):"?index"),o!=="/"&&(d.pathname=d.pathname==="/"?o:Gt([o,d.pathname])),ei(d)}function Tb(l,{relative:s}={}){let o=T.useContext(Hm);Ce(o!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:u}=Km("useViewTransitionState"),c=ri(l,{relative:s});if(!o.isTransitioning)return!1;let d=gn(o.currentLocation.pathname,u)||o.currentLocation.pathname,h=gn(o.nextLocation.pathname,u)||o.nextLocation.pathname;return zr(c.pathname,h)!=null||zr(c.pathname,d)!=null}var _b=Rm();const Ab=["summary","page","nav","paragraph","decision","constraint","task","file","code","example","quote","callout","list","table","image","math","diagram","separator","toc","footnote","definition","reference","api","link","metadata","risk","depends-on"],jb=new Set(Ab),Rb=new Set(["todo","doing","done","blocked"]),zb=new Set(["low","medium","high","critical"]),Mb=new Set(["unordered","ordered"]),Cb=new Set(["note","tip","warning","caution"]),Ob=new Set(["tex","asciimath"]),Nb=new Set(["mermaid","graphviz","plantuml"]),Wm={summary:{allowed:new Set,required:new Set},page:{allowed:new Set(["title","output"]),required:new Set},nav:{allowed:new Set(["label","href","slot"]),required:new Set(["label","href"])},paragraph:{allowed:new Set,required:new Set},decision:{allowed:new Set(["id"]),required:new Set(["id"])},constraint:{allowed:new Set,required:new Set},task:{allowed:new Set(["status"]),required:new Set(["status"])},file:{allowed:new Set(["path"]),required:new Set(["path"])},code:{allowed:new Set(["lang"]),required:new Set},example:{allowed:new Set,required:new Set},quote:{allowed:new Set(["cite"]),required:new Set},callout:{allowed:new Set(["kind","title"]),required:new Set(["kind"])},list:{allowed:new Set(["kind"]),required:new Set(["kind"])},table:{allowed:new Set(["columns"]),required:new Set(["columns"])},image:{allowed:new Set(["src","alt","caption"]),required:new Set(["src","alt"])},math:{allowed:new Set(["notation"]),required:new Set(["notation"])},diagram:{allowed:new Set(["kind"]),required:new Set(["kind"])},separator:{allowed:new Set,required:new Set},toc:{allowed:new Set,required:new Set},footnote:{allowed:new Set(["id"]),required:new Set(["id"])},definition:{allowed:new Set(["term"]),required:new Set(["term"])},reference:{allowed:new Set(["target","label"]),required:new Set(["target"])},api:{allowed:new Set(["name"]),required:new Set(["name"])},link:{allowed:new Set(["href"]),required:new Set(["href"])},metadata:{allowed:new Set(["key"]),required:new Set(["key"])},risk:{allowed:new Set(["level"]),required:new Set(["level"])},"depends-on":{allowed:new Set(["target"]),required:new Set(["target"])}},Fm=/<\/?[A-Za-z][A-Za-z0-9:-]*(?:\s[^>]*)?>/,Db=/^[A-Za-z_][A-Za-z0-9_.-]*$/,Lb=/^[A-Za-z0-9_.+-]+$/,Im=/[\r\n\t]/,Ub=/^\s{0,3}\[[^\]\n]+\]:\s+\S/,Hb=/^(?:(?: {0,3})(?:[-*_]\s*){3,}|(?: {0,3})=+\s*)$/,Bb=/^\s{0,3}>\s?/,pn=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,qb=/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/,pm=/^(?=.*\S)[^\r\n\t<>]+$/,Yb=new Set(["primary","footer"]);function Br(l){return l.length>0&&!l.startsWith("/")&&!l.startsWith("\\")&&!/^[A-Za-z]:[\\/]/.test(l)&&!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(l)&&!l.split(/[\\/]+/).includes("..")}function ti(l){const s=/^([A-Za-z][A-Za-z0-9+.-]*):/.exec(l);return s?["http","https","mailto"].includes(s[1].toLowerCase()):l.startsWith("//")?!1:l.startsWith("/")?!l.split(/[\\/]+/).includes(".."):Br(l)}function Pm(l){const s=/^([A-Za-z][A-Za-z0-9+.-]*):/.exec(l);return s?["http","https"].includes(s[1].toLowerCase()):Br(l)}function Gb(l){return Object.hasOwn(Wm,l)}function ep(l,s){const o=Wm[l];if(!o)return[`Unknown typed block "${l}"`];const u=[];for(const d of Object.keys(s))o.allowed.has(d)||u.push(`@${l} does not allow attribute "${d}"`);for(const d of o.required)(!Object.hasOwn(s,d)||s[d]==="")&&u.push(`@${l} requires ${d}`);const c=Qb(l,s);return c&&u.push(c),u}function tp(l){const s=l.attrs??{};if(["image","nav","page","separator","toc"].includes(l.name)&&l.text.trim()!=="")return[`@${l.name} must not have a body`];if(l.name==="list")return Kb(l.text);if(l.name==="table")return Wb(s.columns??"",l.text);if(!["code","example","math","diagram"].includes(l.name)){const o=Xb(l.text);if(o)return[o]}return[]}function Lo(l){return Ub.test(l)?"Markdown reference definitions are not supported; use @reference or {{ref:label|target}}":Hb.test(l)?"Markdown thematic breaks and setext underlines are not supported; use @separator or # headings":Bb.test(l)?"Markdown blockquote markers are not supported in Lessmark source; use @quote or @callout":null}function Xb(l){for(const s of String(l).split(`
`)){const o=Lo(s);if(o)return o}return null}function Qb(l,s){return l==="task"&&typeof s.status=="string"&&s.status&&!Rb.has(s.status)?"@task status must be one of: todo, doing, done, blocked":l==="decision"&&typeof s.id=="string"&&s.id&&!pn.test(s.id)?"@decision id must be a lowercase slug":l==="file"&&typeof s.path=="string"&&s.path&&!Br(s.path)?"@file path must be a relative project path":l==="api"&&typeof s.name=="string"&&s.name&&!Db.test(s.name)?"@api name must be an identifier":l==="link"&&typeof s.href=="string"&&s.href&&!ti(s.href)?"@link href must be http, https, mailto, or a safe relative path":l==="code"&&typeof s.lang=="string"&&s.lang&&!Lb.test(s.lang)?"@code lang must be a compact language identifier":l==="metadata"&&typeof s.key=="string"&&s.key&&!qb.test(s.key)?"@metadata key must be a lowercase dotted key":l==="risk"&&typeof s.level=="string"&&s.level&&!zb.has(s.level)?"@risk level must be one of: low, medium, high, critical":l==="callout"&&typeof s.kind=="string"&&s.kind&&!Cb.has(s.kind)?"@callout kind must be one of: note, tip, warning, caution":l==="list"&&typeof s.kind=="string"&&s.kind&&!Mb.has(s.kind)?"@list kind must be one of: unordered, ordered":l==="table"&&typeof s.columns=="string"&&s.columns&&!Jb(s.columns)?"@table columns must be pipe-separated non-empty labels":l==="image"&&typeof s.src=="string"&&s.src&&!Pm(s.src)?"@image src must be a safe relative, http, or https URL":l==="math"&&typeof s.notation=="string"&&s.notation&&!Ob.has(s.notation)?"@math notation must be one of: tex, asciimath":l==="diagram"&&typeof s.kind=="string"&&s.kind&&!Nb.has(s.kind)?"@diagram kind must be one of: mermaid, graphviz, plantuml":l==="nav"&&typeof s.label=="string"&&s.label&&!pm.test(s.label)?"@nav label must be plain single-line text":l==="nav"&&typeof s.href=="string"&&s.href&&!ti(s.href)?"@nav href must be http, https, mailto, or a safe relative path":l==="nav"&&Object.hasOwn(s,"slot")&&typeof s.slot=="string"&&!Yb.has(s.slot)?"@nav slot must be primary or footer":l==="footnote"&&typeof s.id=="string"&&s.id&&!pn.test(s.id)?"@footnote id must be a lowercase slug":l==="definition"&&typeof s.term=="string"&&s.term&&!pm.test(s.term)?"@definition term must be plain single-line text":l==="reference"&&typeof s.target=="string"&&s.target&&!pn.test(s.target)?"@reference target must be a lowercase slug":l==="page"&&typeof s.output=="string"&&s.output&&!$b(s.output)?"@page output must be a safe relative .html path":l==="depends-on"&&typeof s.target=="string"&&s.target&&!pn.test(s.target)?"@depends-on target must be a lowercase slug":null}function $b(l){return Br(l)&&l.endsWith(".html")}function np(l){var d,h,v;const s=[],o=new Set,u=new Map,c=new Set;for(const y of l){if(y===null||typeof y!="object")continue;let p=[];if(y.type==="heading"){const w=Fb(y.text),x=(u.get(w)||0)+1;u.set(w,x),p=[x===1?w:`${w}-${x}`]}else if(y.type==="block"&&y.name==="decision")p=[((d=y.attrs)==null?void 0:d.id)||""];else if(y.type==="block"&&y.name==="footnote"){const w=((h=y.attrs)==null?void 0:h.id)||"";p=[w,w?`fn-${w}`:""]}for(const w of p)w&&(o.has(w)?s.push(`Duplicate local anchor slug "${w}"`):(o.add(w),c.add(w)))}for(const y of l){if((y==null?void 0:y.type)!=="block"||y.name!=="reference")continue;const p=((v=y.attrs)==null?void 0:v.target)||"",w=p?`fn-${p}`:"";p&&!c.has(p)&&!c.has(w)&&s.push(`Unknown local reference target "${p}"`)}for(const y of Vb(l)){const p=y?`fn-${y}`:"";y&&pn.test(y)&&!c.has(y)&&!c.has(p)&&s.push(`Unknown inline local target "${y}"`)}return s}function Vb(l){var o;const s=[];for(const u of l)if((u==null?void 0:u.type)==="heading")s.push(...Il(u.text));else if((u==null?void 0:u.type)==="block"&&!["code","example","math","diagram"].includes(u.name)){s.push(...Il(u.text));for(const c of["label","cite","title","caption","term"])typeof((o=u.attrs)==null?void 0:o[c])=="string"&&s.push(...Il(u.attrs[c]))}return s}function Il(l){const s=String(l),o=[];let u=0;for(;u<s.length;){const c=s.indexOf("{{",u);if(c===-1)break;const d=Zb(s,c);if(d===-1)break;const h=s.slice(c+2,d),v=h.indexOf(":");if(v>0){const y=h.slice(0,v).trim(),p=h.slice(v+1);if(y==="ref"){const w=p.indexOf("|");w!==-1&&o.push(p.slice(w+1).trim()),o.push(...Il(p.slice(0,Math.max(0,w))))}else y==="footnote"?o.push(p.trim()):["strong","em","del","mark","link"].includes(y)&&o.push(...Il(y==="link"?p.split("|",1)[0]:p))}u=d+2}return o}function Zb(l,s){let o=1,u=s+2;for(;u<l.length;){if(l.startsWith("{{",u)){o+=1,u+=2;continue}if(l.startsWith("}}",u)){if(o-=1,o===0)return u;u+=2;continue}u+=1}return-1}function Jb(l){const s=ni(l);return s.length>=1&&s.every(Boolean)}function Kb(l){const s=String(l).split(`
`).filter(c=>c.trim()!=="");let o=0,u=!1;for(const c of s){const d=/^( *)- (.*)$/.exec(c);if(!d)return["@list items must use one explicit '- ' item marker per line"];if(d[1].length%2!==0)return["@list nesting must use two spaces per level"];if(d[2].trim()==="")return["@list items cannot be empty"];const h=d[1].length/2;if(!u&&h!==0)return["@list must start at the top level"];if(h>o+1)return["@list nesting cannot skip levels"];if(/\t/.test(c))return["@list items must use one explicit '- ' item marker per line"];o=h,u=!0}return[]}function Wb(l,s){const o=ni(l).length;for(const u of String(s).split(`
`).filter(c=>c.trim()!==""))if(ni(u).length!==o)return["@table row cell count must match columns"];return[]}function ni(l){const s=[];let o="",u=!1;for(const c of String(l)){if(u){c!=="|"&&c!=="\\"&&(o+="\\"),o+=c,u=!1;continue}if(c==="\\"){u=!0;continue}if(c==="|"){s.push(o.trim()),o="";continue}o+=c}return u&&(o+="\\"),s.push(o.trim()),s}function Fb(l){return String(l).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"section"}const Ib={p:{name:"paragraph",attrs:{}},note:{name:"callout",attrs:{kind:"note"}},warning:{name:"callout",attrs:{kind:"warning"}},ul:{name:"list",attrs:{kind:"unordered"}},ol:{name:"list",attrs:{kind:"ordered"}}},Pb={api:"name",callout:"kind",code:"lang",diagram:"kind",decision:"id",definition:"term","depends-on":"target",file:"path",footnote:"id",link:"href",math:"notation",metadata:"key",reference:"target",risk:"level",table:"columns",task:"status"};class Ae extends Error{constructor(s,o=1,u=1){super(`${s} at ${o}:${u}`),this.name="LessmarkError",this.message=s,this.line=o,this.column=u}}function yn(l,s={}){const u=t0(l).split(`
`),c=[];let d=0;const h=s.sourcePositions===!0;for(;d<u.length;){const y=u[d];if(y.trim()===""){d+=1;continue}if(y.startsWith("#")){c.push(n0(y,d+1,h)),d+=1;continue}if(y.startsWith("@")){const w=a0(u,d,h);c.push(w.node),d=w.nextIndex;continue}const p=e0(u,d,h);c.push(p.node),d=p.nextIndex}const[v]=np(c);if(v)throw new Ae(v,1,1);return{type:"document",children:c}}function e0(l,s,o){const u=[];let c=s,d=s+1,h=1;for(;c<l.length;){const y=l[c];if(y.trim()===""||xo(y))break;const p=ap(y);qr(p,"paragraph",c+1,1);const w=Lo(p);if(w)throw new Ae(w,c+1,1);u.push(p.trimEnd()),d=c+1,h=y.length+1,c+=1}const v={type:"block",name:"paragraph",attrs:{},text:lp(u.join(`
`),s+1)};return ko(v,s+1),o&&(v.position=Cr(s+1,1,d,h)),{node:v,nextIndex:c}}function t0(l){return String(l).replace(/^\uFEFF/,"").replace(/\r\n?/g,`
`)}function n0(l,s,o){const u=/^(#{1,6}) ([^\s].*)$/.exec(l);if(!u)throw new Ae("Invalid heading syntax",s,1);if(/\s#+\s*$/.test(u[2]))throw new Ae("Closing heading markers are not supported",s,l.length);qr(u[2],"heading",s,l.indexOf(u[2])+1);const c={type:"heading",level:u[1].length,text:u[2].trimEnd()};return o&&(c.position=Cr(s,1,s,l.length+1)),c}function a0(l,s,o){const u=l[s],c=/^@([a-z][a-z0-9_-]*)(.*)$/.exec(u);if(!c)throw new Ae("Invalid typed block header",s+1,1);const d=l0(c[1],c[2],s+1),h=d.name;if(!jb.has(h))throw new Ae(`Unknown typed block "${h}"`,s+1,2);const v={...d.attrs,...s0(d.rest,s+1,1+h.length+1)};o0(h,v,s+1);const y=[];let p=s+1,w=s+1,x=u.length+1;if(r0(h)){const U={type:"block",name:h,attrs:v,text:""};return ko(U,s+1),o&&(U.position=Cr(s+1,1,w,x)),{node:U,nextIndex:p}}for(;p<l.length;){const U=l[p];if(y.length===0&&U.trim()===""&&!Fl(h)){p+=1;continue}if(i0(l,p,h))break;const H=Fl(h)?U:ap(U);if(qr(H,`@${h}`,p+1,1),!Fl(h)){const X=Lo(H);if(X)throw new Ae(X,p+1,1)}y.push(H.trimEnd()),w=p+1,x=U.length+1,p+=1}const z=y.join(`
`),Y={type:"block",name:h,attrs:v,text:Fl(h)?z:lp(z,s+1)};return ko(Y,s+1),o&&(Y.position=Cr(s+1,1,w,x)),{node:Y,nextIndex:p}}function l0(l,s,o){const u=Ib[l];if(u&&s.trim()!=="")throw new Ae(`@${l} does not accept attributes`,o,1);const c=(u==null?void 0:u.name)||l,d={...(u==null?void 0:u.attrs)||{}};let h=s;const v=Pb[c],y=s.trim();return v&&y&&!/[=\s]/.test(y)&&(d[v]=y,h=""),{name:c,attrs:d,rest:h}}function i0(l,s,o){const u=l[s];if(xo(u))return!0;if(u.trim()!=="")return!1;if(!Fl(o))return!0;let c=s+1;for(;c<l.length&&l[c].trim()==="";)c+=1;return c>=l.length||xo(l[c])}function Fl(l){return l==="code"||l==="example"||l==="math"||l==="diagram"}function r0(l){return l==="image"||l==="nav"||l==="page"||l==="separator"||l==="toc"}function xo(l){return l.startsWith("#")||l.startsWith("@")}function ap(l){return l.startsWith("\\@")||l.startsWith("\\#")?l.slice(1):l}function Cr(l,s,o,u){return{start:{line:l,column:s},end:{line:o,column:u}}}function s0(l,s,o){const u={};let c=0;for(;c<l.length;){if(/\s/.test(l[c])){c+=1;continue}const d=/^[a-z][a-z0-9_-]*/.exec(l.slice(c));if(!d)throw new Ae("Invalid attribute name",s,o+c);const h=d[0];if(c+=h.length,l[c]!=="=")throw new Ae("Expected = after attribute name",s,o+c);if(c+=1,l[c]!=='"')throw new Ae("Attribute values must be double-quoted",s,o+c);const v=u0(l,c,s,o);if(Object.hasOwn(u,h))throw new Ae(`Duplicate attribute "${h}"`,s,o+c);c0(h,v.value,s,o+c),u[h]=v.value,c=v.nextIndex}return u}function u0(l,s,o,u){let c="",d=s+1;for(;d<l.length;){const h=l[d];if(h==='"')return{value:c,nextIndex:d+1};if(h==="\\"){const v=l[d+1];if(v===void 0)throw new Ae("Unterminated escape sequence",o,u+d);if(v==='"'||v==="\\")c+=v;else if(v==="|")c+="\\|";else throw new Ae(`Unsupported escape \\${v}`,o,u+d);d+=2;continue}c+=h,d+=1}throw new Ae("Unterminated quoted attribute",o,u+s)}function o0(l,s,o){const[u]=ep(l,s);if(u)throw new Ae(u,o,1)}function ko(l,s){const[o]=tp(l);if(o)throw new Ae(o,s,1)}function qr(l,s,o,u){if(Fm.test(l))throw new Ae(`${s} contains raw HTML/JSX-like syntax`,o,u)}function c0(l,s,o,u){if(Im.test(s))throw new Ae(`Attribute "${l}" cannot contain control whitespace`,o,u);qr(s,`attribute "${l}"`,o,u)}function lp(l,s){const o=String(l);let u="",c=0;for(;c<o.length;){const d=o.indexOf("{{",c);if(d===-1){u+=gm(o.slice(c),s);break}u+=gm(o.slice(c,d),s);const h=f0(o,d);if(h===-1){u+=o.slice(d);break}u+=o.slice(d,h+2),c=h+2}return u}function gm(l,s){const o=String(l);let u="",c=0;const d=[{regex:/^`([^`\n]+)`/,render:h=>`{{code:${h[1]}}}`},{regex:/^\[([^\]\n]+)\]\(([^)\s]+)\)/,render:h=>{if(/^#[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h[2]))return`{{ref:${h[1]}|${h[2].slice(1)}}}`;if(h[2].startsWith("#")&&!pn.test(h[2].slice(1)))throw new Ae("Inline ref target must be a lowercase slug",s,1);if(!ti(h[2]))throw new Ae("Inline link href must not use an executable URL scheme",s,1);return`{{link:${h[1]}|${h[2]}}}`}},{regex:/^\[\^([a-z0-9]+(?:-[a-z0-9]+)*)\]/,render:h=>`{{footnote:${h[1]}}}`},{regex:/^\*\*([^*\n]+)\*\*/,render:h=>`{{strong:${h[1]}}}`},{regex:/^\*([^*\n]+)\*/,render:h=>`{{em:${h[1]}}}`},{regex:/^~~([^~\n]+)~~/,render:h=>`{{del:${h[1]}}}`},{regex:/^==([^=\n]+)==/,render:h=>`{{mark:${h[1]}}}`}];for(;c<o.length;){const h=o.slice(c);if(/^\*{3,}/.test(h))throw new Ae("Combined shortcut emphasis is not supported; use explicit nested inline functions",s,1);const v=d.map(y=>[y,y.regex.exec(h)]).find(([,y])=>y);if(v){const[y,p]=v;u+=y.render(p),c+=p[0].length;continue}if(/^\*\*\S/.test(h)||/^\*\S/.test(h))throw new Ae("Ambiguous shortcut emphasis is not supported; use explicit nested inline functions",s,1);u+=o[c],c+=1}return u}function f0(l,s){let o=1,u=s+2;for(;u<l.length;){if(l.startsWith("{{",u)){o+=1,u+=2;continue}if(l.startsWith("}}",u)){if(o-=1,o===0)return u;u+=2;continue}u+=1}return-1}function d0(l){const s=[];if(!ai(l)||l.type!=="document"||!Array.isArray(l.children))return[Ne("AST root must be a document with children")];po(l,["type","children"],s,"document");for(const o of l.children){if(!ai(o)){s.push(Ne("AST child must be an object"));continue}if(o.type==="heading"){if(po(o,["type","level","text"],s,"heading",["position"]),vm(o.position,s,"heading"),(!Number.isInteger(o.level)||o.level<1||o.level>6)&&s.push(Ne("heading level must be an integer from 1 to 6")),typeof o.text!="string"||o.text.length===0){s.push(Ne("heading text must be a non-empty string"));continue}So(o.text,s,"heading"),Ka(o.text,s,"heading");continue}if(o.type!=="block"){s.push(Ne(`Unknown AST node type: ${o.type}`));continue}if(po(o,["type","name","attrs","text"],s,`@${o.name}`,["position"]),vm(o.position,s,`@${o.name}`),typeof o.text!="string"){s.push(Ne(`@${o.name} text must be a string`));continue}So(o.text,s,`@${o.name}`),h0(o.name)||Ka(o.text,s,`@${o.name}`),m0(o,s),y0(o,s)}for(const o of np(l.children))s.push(Ne(o));return s}function h0(l){return l==="code"||l==="example"||l==="math"||l==="diagram"}function m0(l,s){for(const o of tp(l))s.push(Ne(o))}function So(l,s,o){Fm.test(l)&&s.push(Ne(`${o} contains raw HTML/JSX-like syntax`))}function Ka(l,s,o){const u=String(l);let c=0;for(;c<u.length;){const d=u.indexOf("{{",c);if(d===-1)return;const h=p0(u,d);if(h===-1){s.push(Ne(`${o} has an unclosed inline function`));return}g0(u.slice(d+2,h),s,o),c=h+2}}function p0(l,s){let o=1,u=s+2;for(;u<l.length;){if(l.startsWith("{{",u)){o+=1,u+=2;continue}if(l.startsWith("}}",u)){if(o-=1,o===0)return u;u+=2;continue}u+=1}return-1}function g0(l,s,o){const u=l.indexOf(":");if(u<=0){s.push(Ne(`${o} inline functions must use {{name:value}}`));return}const c=l.slice(0,u).trim(),d=l.slice(u+1);if(["strong","em","del","mark"].includes(c)){Ka(d,s,o);return}if(!["code","kbd","sup","sub"].includes(c)){if(c==="ref"){const[h,v]=ym(d,"|");Ka(h,s,o),pn.test(v)||s.push(Ne("Inline ref target must be a lowercase slug"));return}if(c==="footnote"){pn.test(d)||s.push(Ne("Inline footnote target must be a lowercase slug"));return}if(c==="link"){const[h,v]=ym(d,"|");Ka(h,s,o),ti(v)||s.push(Ne("Inline link href must not use an executable URL scheme"));return}s.push(Ne(`Unknown inline function "${c}"`))}}function ym(l,s){const o=String(l).indexOf(s);return o===-1?[String(l),""]:[String(l).slice(0,o).trim(),String(l).slice(o+s.length).trim()]}function y0(l,s){if(!Gb(l.name)){s.push(Ne(`Unknown typed block "${l.name}"`));return}const o=l.attrs??{};if(!ai(o)){s.push(Ne(`@${l.name} attrs must be an object`));return}for(const u of Object.keys(o)){if(typeof o[u]!="string"){s.push(Ne(`Attribute "${u}" must be a string`));continue}So(String(o[u]),s,`attribute "${u}"`),["label","cite","title","caption","term"].includes(u)&&Ka(String(o[u]),s,`attribute "${u}"`),Im.test(String(o[u]))&&s.push(Ne(`Attribute "${u}" cannot contain control whitespace`))}for(const u of ep(l.name,o))s.push(Ne(u))}function ai(l){return l!==null&&typeof l=="object"&&!Array.isArray(l)}function vm(l,s,o){l!==void 0&&(!ai(l)||!bm(l.start)||!bm(l.end))&&s.push(Ne(`${o} position must have start/end line and column numbers`))}function bm(l){return ai(l)&&Number.isInteger(l.line)&&l.line>0&&Number.isInteger(l.column)&&l.column>0}function po(l,s,o,u,c=[]){const d=new Set([...s,...c]);for(const h of Object.keys(l))d.has(h)||o.push(Ne(`${u} has unknown property "${h}"`));for(const h of s)Object.hasOwn(l,h)||o.push(Ne(`${u} is missing property "${h}"`))}function Ne(l){return{code:v0(l),message:l}}function v0(l){return/Unknown typed block/.test(l)?"unknown_block":/does not allow attribute/.test(l)?"unknown_attribute":/requires /.test(l)?"missing_required_attribute":/Duplicate attribute/.test(l)?"duplicate_attribute":/raw HTML\/JSX-like/.test(l)?"raw_html":/Markdown reference definitions|Markdown thematic breaks|Markdown blockquote markers/.test(l)?"markdown_legacy_syntax":/Loose text/.test(l)?"loose_text":/Invalid heading/.test(l)?"invalid_heading":/Closing heading markers/.test(l)?"closing_heading_marker":/Invalid typed block header/.test(l)?"invalid_block_header":/Invalid attribute name/.test(l)?"invalid_attribute_name":/Expected =/.test(l)?"expected_attribute_equals":/double-quoted/.test(l)?"unquoted_attribute":/Unsupported escape/.test(l)?"unsupported_escape":/Unterminated/.test(l)||/unclosed inline function/.test(l)?"unterminated_syntax":/Unknown inline function/.test(l)?"unknown_inline_function":/inline functions must use/.test(l)?"invalid_inline_function":/control whitespace/.test(l)?"control_whitespace":/safe relative|safe relative, http|safe relative \.html|executable URL/.test(l)?"unsafe_link_or_path":/lowercase slug/.test(l)?"invalid_slug":/Unknown local reference target/.test(l)?"unknown_reference_target":/Unknown inline local target/.test(l)?"unknown_inline_target":/Duplicate local anchor/.test(l)?"duplicate_local_anchor":/@list/.test(l)?"invalid_list_body":/@table/.test(l)?"invalid_table_body":/position/.test(l)?"invalid_position":/AST root/.test(l)?"invalid_ast_root":/unknown property|missing property/.test(l)?"invalid_ast_shape":/must be a string/.test(l)?"invalid_ast_value":"validation_error"}function b0(l){return x0(yn(l))}function x0(l){const s=d0(l);if(s.length>0)throw new Error(`Cannot format invalid AST: ${s.map(u=>u.message).join("; ")}`);return`${l.children.map(k0).join(`

`)}
`}function k0(l){if(l.type==="heading")return`${"#".repeat(l.level)} ${l.text.trim()}`;if(l.type==="block"){if(l.name==="paragraph"&&Object.keys(l.attrs).length===0)return go(String(l.text??""));const s=Object.keys(l.attrs).sort().map(c=>`${c}="${S0(l.attrs[c])}"`).join(" "),o=s?`@${l.name} ${s}`:`@${l.name}`,u=go(String(l.text??""));return u?`${o}
${go(u)}`:o}throw new Error(`Cannot format unknown AST node type: ${l.type}`)}function go(l){return l.replace(/\r\n?/g,`
`).split(`
`).map(s=>s.trimEnd()).join(`
`)}function S0(l){return String(l).replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\t/g,"\\t")}const w0={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},E0=new Set(["async","await","break","case","catch","class","const","continue","default","do","else","export","extends","finally","for","from","function","if","import","in","instanceof","let","new","of","return","static","switch","throw","try","typeof","var","void","while","yield","true","false","null","undefined"]);function T0(l){const s=String(l).split(`
`),o=[];let u=0;for(;u<s.length;){const c=s[u],d=/^@([a-z][a-z0-9_-]*)(.*)$/.exec(c);if(d){if(o.push(Or(c,!1)),D0(d[1])){const h=[];let v=u+1;for(;v<s.length&&!L0(s,v);)h.push(s[v]),v+=1;const y=d[1]==="code"?N0(d[2],"lang")??"":"";h.length>0&&o.push(...ip(h.join(`
`),y).split(`
`)),u=v;continue}u+=1;continue}o.push(Or(c,!1)),u+=1}return o.join(`
`)}function ip(l,s=""){const o=String(s).toLowerCase();return o==="lmk"||o==="lessmark"?String(l).split(`
`).map(u=>Or(u,!0)).join(`
`):["js","jsx","ts","tsx","javascript","typescript"].includes(o)?z0(l):["json","jsonc"].includes(o)?M0(l):["sh","shell","bash","zsh","powershell","ps1"].includes(o)?C0(l):Oe(l)}function Or(l,s){if(l==="")return"";if(s){const o=/^(\s+)([@#].*)$/.exec(l);if(o)return`${Oe(o[1])}${Or(o[2],!1)}`}if(/^#{1,6}\s/.test(l)){const o=/^(#{1,6})(\s)(.*)$/.exec(l);return`<span class="tok-key">${Oe(o[1])}</span>${Oe(o[2])}<span class="tok-heading">${Oe(o[3])}</span>`}if(l.startsWith("@")){const o=/^@([a-z][a-z0-9_-]*)(.*)$/.exec(l);if(o)return`<span class="tok-key">@${Oe(o[1])}</span>${_0(o[2])}`}return A0(l)}function _0(l){const s=[];let o=0;for(;o<l.length;){const u=l[o];if(/\s/.test(u)){s.push(Oe(u)),o+=1;continue}const c=/^([a-z][a-z0-9_-]*)/.exec(l.slice(o));if(c){if(s.push(`<span class="tok-attr">${Oe(c[1])}</span>`),o+=c[1].length,l[o]==="="&&(s.push('<span class="tok-punct">=</span>'),o+=1,l[o]==='"')){let d=o+1;for(;d<l.length&&l[d]!=='"';)d+=1;s.push(`<span class="tok-string">${Oe(l.slice(o,d+1))}</span>`),o=d+1;continue}continue}s.push(Oe(u)),o+=1}return s.join("")}function A0(l){const s=/^(\s*)(- )(.*)$/.exec(l);return s?`${Oe(s[1])}<span class="tok-punct">${Oe(s[2])}</span>${li(s[3])}`:l.includes("|")?j0(l):li(l)}function j0(l){const s=[];let o="",u=!1;for(const c of l){if(u){o+=c,u=!1;continue}if(c==="\\"){o+=c,u=!0;continue}if(c==="|"){s.push(li(o)),s.push('<span class="tok-punct">|</span>'),o="";continue}o+=c}return s.push(li(o)),s.join("")}function li(l){const s=[/\{\{[a-z][a-z0-9_-]*:[\s\S]*?\}\}/y,/`[^`\n]+`/y,/\*\*[^*\n][\s\S]*?[^*\n]\*\*/y,/\*[^*\n][^*\n]*\*/y,/~~[^~\n]+~~/y,/==[^=\n]+==/y,/\[[^\]\n]+\]\((?:https?:\/\/|\.{0,2}\/|#)[^)]+\)/y,/\[[^\]\n]+\]\[[-a-z0-9_]+\]/iy,/\[\^[-a-z0-9_]+\]/iy];let o=0,u="";for(;o<l.length;){let c=!1;for(const d of s){d.lastIndex=o;const h=d.exec(l);if(h){u+=R0(h[0]),o+=h[0].length,c=!0;break}}c||(u+=`<span class="tok-text">${Oe(l[o])}</span>`,o+=1)}return u}function R0(l){const s=/^\{\{([a-z][a-z0-9_-]*)(:)([\s\S]*)(\}\})$/.exec(l);return s?`<span class="tok-brace">{{</span><span class="tok-inline">${Oe(s[1])}</span><span class="tok-punct">${Oe(s[2])}</span>${li(s[3])}<span class="tok-brace">}}</span>`:l.startsWith("`")?`<span class="tok-code">${Oe(l)}</span>`:l.startsWith("[")||l.startsWith("[^")?`<span class="tok-link">${Oe(l)}</span>`:l.startsWith("**")||l.startsWith("*")?`<span class="tok-emph">${Oe(l)}</span>`:l.startsWith("~~")?`<span class="tok-del">${Oe(l)}</span>`:l.startsWith("==")?`<span class="tok-mark">${Oe(l)}</span>`:`<span class="tok-text">${Oe(l)}</span>`}function z0(l){return Uo(l,(s,o)=>{var h,v;const u=Ho(s,o,["'",'"',"`"]);if(u)return["string",u];if(s.startsWith("//",o))return["comment",rp(s,o)];if(s.startsWith("/*",o))return["comment",O0(s,o)];const c=(h=/^[A-Za-z_$][A-Za-z0-9_$]*/.exec(s.slice(o)))==null?void 0:h[0];if(c&&E0.has(c))return["key",c];const d=(v=/^(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)/.exec(s.slice(o)))==null?void 0:v[0];return d?["number",d]:null})}function M0(l){return Uo(l,(s,o)=>{var h,v;const u=Ho(s,o,['"']);if(u)return["string",u];const c=(h=/^(?:true|false|null)\b/.exec(s.slice(o)))==null?void 0:h[0];if(c)return["key",c];const d=(v=/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i.exec(s.slice(o)))==null?void 0:v[0];return d?["number",d]:null})}function C0(l){return Uo(l,(s,o)=>{var d;const u=Ho(s,o,["'",'"']);if(u)return["string",u];if(s[o]==="#")return["comment",rp(s,o)];const c=(d=/^--?[A-Za-z0-9][A-Za-z0-9-]*/.exec(s.slice(o)))==null?void 0:d[0];return c?["key",c]:null})}function Uo(l,s){const o=String(l);let u=0,c="";for(;u<o.length;){const d=s(o,u);if(d){const[h,v]=d;c+=`<span class="tok-${h}">${Oe(v)}</span>`,u+=v.length;continue}c+=Oe(o[u]),u+=1}return c}function Ho(l,s,o){const u=l[s];if(!o.includes(u))return null;let c=s+1,d=!1;for(;c<l.length;){const h=l[c];if(c+=1,d){d=!1;continue}if(h==="\\"){d=!0;continue}if(h===u)break}return l.slice(s,c)}function rp(l,s){const o=l.indexOf(`
`,s);return o===-1?l.slice(s):l.slice(s,o)}function O0(l,s){const o=l.indexOf("*/",s+2);return o===-1?l.slice(s):l.slice(s,o+2)}function N0(l,s){const o=new RegExp(`\\b${s}="((?:\\\\["\\\\]|[^"])*)"`).exec(l);return o?o[1].toLowerCase():null}function D0(l){return l==="code"||l==="example"||l==="math"||l==="diagram"}function L0(l,s){const o=l[s];if(o.startsWith("#")||o.startsWith("@"))return!0;if(o.trim()!=="")return!1;let u=s+1;for(;u<l.length&&l[u].trim()==="";)u+=1;return u>=l.length||l[u].startsWith("#")||l[u].startsWith("@")}function Oe(l){return String(l).replace(/[&<>"']/g,s=>w0[s])}const U0=new Set(["metadata","page","nav"]);function sp(l,s={}){const o=typeof l=="string"?yn(l):l,u={headingIds:G0(o),footnoteIds:q0(o),nav:B0(o)},c=[xm(u.nav.primary,"Primary"),...o.children.map(d=>H0(d,o,u)).filter(Boolean),xm(u.nav.footer,"Footer")].filter(Boolean).join(`
`);if(s.document===!0){const d=s.title??n1(o);return a1(d,c)}return c?`${c}
`:""}function H0(l,s,o){if(l.type==="heading"){const u=Math.min(Math.max(l.level,1),6);return`<h${u} id="${Be(o.headingIds.get(l)||Yo(l.text))}">${Se(l.text)}</h${u}>`}if(l.type!=="block"||U0.has(l.name))return"";switch(l.name){case"summary":case"paragraph":return`<p>${Se(l.text)}</p>`;case"constraint":return`<aside class="lessmark-constraint">${Se(l.text)}</aside>`;case"decision":return`<section class="lessmark-decision" id="${Be(l.attrs.id)}" data-id="${Be(l.attrs.id)}"><p>${Se(l.text)}</p></section>`;case"task":return`<p class="lessmark-task" data-status="${Be(l.attrs.status)}">${l.attrs.status==="done"?"[x]":"[ ]"} ${Se(l.text)}</p>`;case"file":return`<p class="lessmark-file"><code>${rt(l.attrs.path)}</code> ${Se(l.text)}</p>`;case"api":return`<p class="lessmark-api"><code>${rt(l.attrs.name)}</code> ${Se(l.text)}</p>`;case"link":return qo(l.attrs.href),`<p><a href="${Be(l.attrs.href)}">${Se(l.text||l.attrs.href)}</a></p>`;case"code":return`<pre><code${l.attrs.lang?` class="language-${Be(l.attrs.lang)}"`:""}>${ip(l.text,l.attrs.lang)}</code></pre>`;case"example":return`<figure class="lessmark-example"><pre>${rt(l.text)}</pre></figure>`;case"risk":return`<aside class="lessmark-risk" data-level="${Be(l.attrs.level)}">${Se(l.text)}</aside>`;case"depends-on":return`<p class="lessmark-depends-on">Depends on <code>${rt(l.attrs.target)}</code>: ${Se(l.text)}</p>`;case"quote":return X0(l);case"callout":return Q0(l);case"list":return $0(l);case"table":return Z0(l);case"image":return J0(l);case"math":return`<figure class="lessmark-math" data-notation="${Be(l.attrs.notation)}"><pre><code class="language-math-${Be(l.attrs.notation)}">${rt(l.text)}</code></pre></figure>`;case"diagram":return`<figure class="lessmark-diagram" data-kind="${Be(l.attrs.kind)}"><pre><code class="language-${Be(l.attrs.kind)}">${rt(l.text)}</code></pre></figure>`;case"separator":return'<hr class="lessmark-separator">';case"toc":return Y0(s,o);case"footnote":return K0(l);case"definition":return W0(l);case"reference":return F0(l,o);default:return`<p>${Se(l.text)}</p>`}}function B0(l){const s={primary:[],footer:[]};for(const o of l.children)o.type!=="block"||o.name!=="nav"||(qo(o.attrs.href),s[o.attrs.slot==="footer"?"footer":"primary"].push(o));return s}function q0(l){return new Set(l.children.filter(s=>s.type==="block"&&s.name==="footnote").map(s=>s.attrs.id))}function xm(l,s){if(l.length===0)return"";const o=l.map(u=>`<a href="${Be(u.attrs.href)}">${Se(u.attrs.label)}</a>`).join("");return`<nav class="lessmark-nav" aria-label="${Be(s)}">${o}</nav>`}function Y0(l,s){const o=l.children.filter(c=>c.type==="heading");return o.length===0?"":`<nav class="lessmark-toc"><ol>${o.map(c=>`<li class="level-${c.level}"><a href="#${Be(s.headingIds.get(c)||Yo(c.text))}">${Se(c.text)}</a></li>`).join("")}</ol></nav>`}function G0(l){const s=new Map,o=new WeakMap;for(const u of l.children.filter(c=>c.type==="heading")){const c=Yo(u.text),d=(s.get(c)||0)+1;s.set(c,d),o.set(u,d===1?c:`${c}-${d}`)}return o}function X0(l){const s=l.attrs.cite?`<cite>${Se(l.attrs.cite)}</cite>`:"";return`<blockquote>${Bo(l.text)}${s}</blockquote>`}function Q0(l){const s=l.attrs.title?`<strong>${Se(l.attrs.title)}</strong>`:"";return`<aside class="lessmark-callout" data-kind="${Be(l.attrs.kind)}">${s}${Bo(l.text)}</aside>`}function $0(l){const s=l.attrs.kind==="ordered"?"ol":"ul",o=V0(l.text);return o.length===0?`<${s}></${s}>`:up(o,s,0,{index:0})}function V0(l){return String(l).split(`
`).filter(Boolean).map(s=>{const o=/^( *)- (.*)$/.exec(s);if(!o||o[1].length%2!==0||o[2].trim()==="")throw new Error("@list items must use one explicit '- ' item marker per line");return{level:o[1].length/2,text:o[2].trim()}})}function up(l,s,o,u){const c=[];for(;u.index<l.length;){const d=l[u.index];if(d.level<o)break;if(d.level>o)throw new Error("@list nesting cannot skip levels");u.index+=1;let h="";u.index<l.length&&l[u.index].level>o&&(h=up(l,s,o+1,u)),c.push(`<li>${Se(d.text)}${h}</li>`)}return`<${s}>${c.join("")}</${s}>`}function Z0(l){const s=ni(l.attrs.columns),o=l.text.split(`
`).map(d=>d.trim()).filter(Boolean).map(ni);if(s.some(d=>d==="")||o.some(d=>d.some(h=>h==="")))throw new Error("@table cells cannot be empty");for(const d of o)if(d.length!==s.length)throw new Error("@table row cell count must match columns");const u=`<thead><tr>${s.map(d=>`<th>${Se(d)}</th>`).join("")}</tr></thead>`,c=`<tbody>${o.map(d=>`<tr>${d.map(h=>`<td>${Se(h)}</td>`).join("")}</tr>`).join("")}</tbody>`;return`<table>${u}${c}</table>`}function J0(l){if(!Pm(l.attrs.src))throw new Error("@image src must be a safe relative, http, or https URL");const s=l.attrs.caption||l.text;return`<figure><img src="${Be(l.attrs.src)}" alt="${Be(l.attrs.alt)}">${s?`<figcaption>${Se(s)}</figcaption>`:""}</figure>`}function K0(l){const s=l.attrs.id;return`<aside class="lessmark-footnote" id="fn-${Be(s)}"><sup>${rt(l.attrs.id)}</sup> ${Se(l.text)}</aside>`}function W0(l){return`<dl class="lessmark-definition"><dt>${Se(l.attrs.term)}</dt><dd>${Bo(l.text)}</dd></dl>`}function F0(l,s){const u=`#${s.footnoteIds.has(l.attrs.target)?`fn-${l.attrs.target}`:l.attrs.target}`,c=l.attrs.label||l.text||l.attrs.target;return`<p class="lessmark-reference"><a href="${Be(u)}">${Se(c)}</a></p>`}function Bo(l){return l.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean).map(s=>`<p>${Se(s.replace(/\n/g," "))}</p>`).join("")}function Se(l){const s=String(l);let o="",u=0;for(;u<s.length;){const c=s.indexOf("{{",u);if(c===-1){o+=rt(s.slice(u));break}o+=rt(s.slice(u,c));const d=I0(s,c);if(d===-1)throw new Error("Unclosed inline function");o+=P0(s.slice(c+2,d)),u=d+2}return o}function I0(l,s){let o=1,u=s+2;for(;u<l.length;){if(l.startsWith("{{",u)){o+=1,u+=2;continue}if(l.startsWith("}}",u)){if(o-=1,o===0)return u;u+=2;continue}u+=1}return-1}function P0(l){const s=l.indexOf(":");if(s<=0)throw new Error("Inline functions must use {{name:value}}");const o=l.slice(0,s).trim(),u=l.slice(s+1);if(o==="strong")return`<strong>${Se(u)}</strong>`;if(o==="em")return`<em>${Se(u)}</em>`;if(o==="code")return`<code>${rt(u)}</code>`;if(o==="kbd")return`<kbd>${rt(u)}</kbd>`;if(o==="del")return`<del>${Se(u)}</del>`;if(o==="mark")return`<mark>${Se(u)}</mark>`;if(o==="sup")return`<sup>${rt(u)}</sup>`;if(o==="sub")return`<sub>${rt(u)}</sub>`;if(o==="ref"){const[c,d]=e1(u);return km(d,"Inline ref target"),`<a href="#${Be(d)}">${Se(c)}</a>`}if(o==="footnote")return km(u,"Inline footnote target"),`<sup><a href="#fn-${Be(u)}">${rt(u)}</a></sup>`;if(o==="link"){const[c,d]=t1(u,"|");return qo(d),`<a href="${Be(d)}">${Se(c)}</a>`}throw new Error(`Unknown inline function "${o}"`)}function e1(l){const s=l.indexOf("|");if(s===-1)throw new Error('Expected "|" in inline ref function');return[l.slice(0,s),l.slice(s+1)]}function t1(l,s){const o=l.indexOf(s);if(o===-1)throw new Error(`Expected "${s}" in inline function`);return[l.slice(0,o).trim(),l.slice(o+s.length).trim()]}function km(l,s){if(!pn.test(l))throw new Error(`${s} must be a lowercase slug`)}function qo(l){if(!ti(l))throw new Error("Inline link href must not use an executable URL scheme")}function n1(l){var o,u;const s=l.children.find(c=>c.type==="block"&&c.name==="page");return((o=s==null?void 0:s.attrs)==null?void 0:o.title)||((u=l.children.find(c=>c.type==="heading"))==null?void 0:u.text)||"Lessmark Document"}function a1(l,s){return`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${rt(l)}</title>
</head>
<body>
${s}
</body>
</html>
`}function rt(l){return String(l).replace(/[&<>"']/g,s=>s==="&"?"&amp;":s==="<"?"&lt;":s===">"?"&gt;":s==='"'?"&quot;":"&#39;")}function Be(l){return rt(l).replace(/`/g,"&#96;")}function Yo(l){return String(l).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"section"}function op({className:l}){return g.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:l,"aria-hidden":"true",children:g.jsx("path",{d:"M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.52-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.15v3.18c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"})})}function Nr({className:l}){return g.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",className:l,"aria-hidden":"true",children:[g.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),g.jsx("polyline",{points:"12 5 19 12 12 19"})]})}function l1({className:l}){return g.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",className:l,"aria-hidden":"true",children:g.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})}function i1({className:l}){return g.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",className:l,"aria-hidden":"true",children:[g.jsx("circle",{cx:"12",cy:"12",r:"4"}),g.jsx("line",{x1:"12",y1:"2",x2:"12",y2:"4"}),g.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"22"}),g.jsx("line",{x1:"4.93",y1:"4.93",x2:"6.34",y2:"6.34"}),g.jsx("line",{x1:"17.66",y1:"17.66",x2:"19.07",y2:"19.07"}),g.jsx("line",{x1:"2",y1:"12",x2:"4",y2:"12"}),g.jsx("line",{x1:"20",y1:"12",x2:"22",y2:"12"}),g.jsx("line",{x1:"4.93",y1:"19.07",x2:"6.34",y2:"17.66"}),g.jsx("line",{x1:"17.66",y1:"6.34",x2:"19.07",y2:"4.93"})]})}function r1({className:l}){return g.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:l,"aria-hidden":"true",children:g.jsx("path",{d:"M18.244 2H21.5l-7.51 8.59L23 22h-6.937l-5.43-7.103L4.4 22H1.142l8.034-9.19L1 2h7.094l4.913 6.49L18.244 2zm-2.43 18h1.92L7.32 4H5.27l10.544 16z"})})}function s1({className:l}){return g.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:l,"aria-hidden":"true",children:g.jsx("path",{d:"M17.86 2.16a1.5 1.5 0 0 0-1.6.18L3.43 12.05 2.4 11.06a.9.9 0 0 0-1.23.04l-.92.92a.9.9 0 0 0 0 1.27l1.86 1.71-1.86 1.71a.9.9 0 0 0 0 1.27l.92.92a.9.9 0 0 0 1.23.04l1.03-.99 12.83 9.71a1.5 1.5 0 0 0 1.6.18l3.4-1.64a1.4 1.4 0 0 0 .79-1.26V5.06a1.4 1.4 0 0 0-.79-1.26zM17.4 17.97 8.2 12 17.4 6.03z"})})}function u1({className:l}){return g.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",className:l,"aria-hidden":"true",children:[g.jsx("rect",{x:"3",y:"5",width:"18",height:"14",rx:"2"}),g.jsx("path",{d:"M3 7l9 6 9-6"})]})}const o1=`# API reference

@summary
Every export from the lessmark packages, with signatures and a short
note. Three runtimes ship today: JavaScript, Python, and Rust. Each
package implements the same parse and validate pipeline against the
shared language contract.

## JavaScript

The {{link:lessmark|https://www.npmjs.com/package/lessmark}} package on
npm. Pure ESM, zero runtime dependencies.

@code lang="sh"
npm install lessmark

@api name="parseLessmark"
{{code:parseLessmark(source: string): Document}}. Parse a string into
the AST. Throws {{code:LessmarkError}} on the first violation.

@api name="renderHtml"
{{code:renderHtml(ast: Document): string}}. Walk the AST and emit
semantic HTML. Returns a single string.

@api name="renderInline"
{{code:renderInline(text: string): string}}. Expand inline functions
in a string of paragraph or heading text.

@api name="validateAst"
{{code:validateAst(ast: Document): ValidationError[]}}. Run cross-cut
checks on a parsed tree. Returns an empty array if the tree is valid.

@api name="validateSource"
{{code:validateSource(source: string): ValidationError[]}}. Parse and
validate in one call. Returns errors from either phase.

@api name="formatLessmark"
{{code:formatLessmark(source: string): string}}. Normalize whitespace,
attribute order, and block spacing. Idempotent.

@api name="formatAst"
{{code:formatAst(ast: Document): string}}. Re-emit a parsed tree as
canonical lessmark source.

@api name="fromMarkdown"
{{code:fromMarkdown(markdown: string): string}}. Convert a CommonMark
document to lessmark source on a best-effort basis.

@api name="toMarkdown"
{{code:toMarkdown(source: string): string}}. Convert a lessmark
document to CommonMark. Some typed blocks have no Markdown equivalent
and emit a comment.

@api name="highlightLessmark"
{{code:highlightLessmark(source: string): string}}. Return HTML with
class-tagged spans for editor-style highlighting.

@api name="highlightCode"
{{code:highlightCode(source: string, lang: string): string}}.
Highlight code in a fenced block. Used by the renderer for
{{code:@code}} blocks.

@api name="LessmarkError"
{{code:class LessmarkError extends Error}}. Carries
{{code:line}}, {{code:column}}, and {{code:code}} fields. Thrown by
parse and surfaced by validation.

@api name="CORE_BLOCKS"
A {{code:Set}} of strings. The names of every typed block in the language
contract. Useful for completion and tooling.

@api name="getCapabilities"
{{code:getCapabilities(): Capabilities}}. Returns the package version,
the contract version, and the feature flags this build supports.

## Python

The {{link:lessmark|https://pypi.org/project/lessmark/}} package on PyPI.
Mirrors the JavaScript surface where it makes sense; render and highlight
are not yet shipped.

@code lang="sh"
pip install lessmark

@api name="parse_lessmark"
{{code:parse_lessmark(source: str) -> dict}}. Parse a string into the
AST. Raises {{code:LessmarkError}} on the first violation.

@api name="validate_ast"
{{code:validate_ast(ast: dict) -> list[dict]}}. Run cross-cut checks.

@api name="validate_source"
{{code:validate_source(source: str) -> list[dict]}}. Parse and
validate in one call.

@api name="format_lessmark"
{{code:format_lessmark(source: str) -> str}}. Canonical formatter.

@api name="format_ast"
{{code:format_ast(ast: dict) -> str}}. Re-emit a tree as source.

@api name="from_markdown"
{{code:from_markdown(markdown: str) -> str}}. CommonMark to lessmark.

@api name="to_markdown"
{{code:to_markdown(source: str) -> str}}. Lessmark to CommonMark.

@api name="get_capabilities"
{{code:get_capabilities() -> dict}}. Build and contract version.

@api name="LessmarkError"
{{code:class LessmarkError(Exception)}}. Carries {{code:line}},
{{code:column}}, and {{code:code}}.

@api name="CORE_BLOCKS"
{{code:frozenset[str]}}. Names of every typed block.

## Rust

The {{link:lessmark|https://crates.io/crates/lessmark}} crate. Parser and
validator only; render is delegated to a downstream consumer.

@code lang="sh"
cargo add lessmark

@api name="parse_lessmark"
{{code:parse_lessmark(source: &str) -> Result<Document, LessmarkError>}}.
Parse a string into the AST.

@api name="parse_lessmark_with_positions"
{{code:parse_lessmark_with_positions(source) -> Result of (Document, Vec of PositionRange) plus LessmarkError}}.
Parse and return per-node source positions.

@api name="validate_document"
{{code:validate_document(doc: &Document) -> Vec of ValidationError}}.
Run cross-cut checks on a parsed document.

@api name="validate_source"
{{code:validate_source(source: &str) -> Vec of ValidationError}}. Parse
and validate in one call.

@api name="format_lessmark"
{{code:format_lessmark(source: &str) -> Result<String, LessmarkError>}}.
Canonical formatter.

@api name="format_document"
{{code:format_document(doc: &Document) -> String}}. Re-emit a tree as
source.

@api name="from_markdown"
{{code:from_markdown(markdown: &str) -> String}}. CommonMark to
lessmark.

@api name="to_markdown"
{{code:to_markdown(source: &str) -> Result<String, LessmarkError>}}.
Lessmark to CommonMark.

## CLI

The {{code:lessmark}} binary. Documented in full on the
{{link:CLI page|docs/cli}}.

@list kind="unordered"
- {{code:lessmark parse FILE}}: print the AST as JSON.
- {{code:lessmark check FILE}}: parse and validate. Exits non-zero on failure.
- {{code:lessmark format FILE}}: print the canonical formatted source.
- {{code:lessmark info --json}}: package and contract version.
`,c1=`# The AST

@summary
Every lessmark parser produces the same JSON tree from the same source.
This page documents the shape of that tree and shows how to walk and
transform it.

## The top of the tree

The parser returns a {{code:document}} node. It has one property,
{{code:children}}, which is an ordered list of every block and heading
in the source.

@diagram kind="mermaid"
graph TD
  Doc["document"] --> H1["heading level 1"]
  Doc --> P1["paragraph"]
  Doc --> B1["block decision"]
  Doc --> B2["block list"]
  Doc --> P2["paragraph"]
  B2 --> I1["list-item"]
  B2 --> I2["list-item"]

@code lang="js"
{
  type: "document",
  children: [ /* heading and block nodes */ ]
}

## Headings

A heading node carries its level (1, 2, or 3) and the raw text. Inline
functions inside a heading are left as plain strings.

@code lang="js"
{
  type: "heading",
  level: 1,
  text: "What is lessmark?"
}

## Typed blocks

Every typed block uses the same shape.

@code lang="js"
{
  type: "block",
  name: "decision",
  attrs: { id: "block-list-fixed" },
  text: "The set of blocks is fixed in the language contract."
}

@list kind="unordered"
- {{code:name}} is the block name without the leading {{code:@}}.
- {{code:attrs}} is an object of declared attributes.
- {{code:text}} is the body of the block, after dedent. May be empty.
- Some blocks (like {{code:list}} and {{code:table}}) have a {{code:children}} or {{code:rows}} field instead. The {{link:Blocks reference|docs/blocks}} lists the shape per block.

## Paragraphs

Paragraphs carry their inline functions as raw text. The renderer
expands {{code:{{strong:bold}}}} and friends at render time.

@code lang="js"
{
  type: "paragraph",
  text: "Inline {{code:functions}} stay as raw strings here."
}

## Walking the tree

The tree is plain JSON. A walk is a recursive function over
{{code:children}}.

@code lang="js"
import { parseLessmark } from "lessmark";

function visit(node, fn) {
  fn(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) visit(child, fn);
  }
}

const ast = parseLessmark(source);
visit(ast, (n) => {
  if (n.type === "block" && n.name === "decision") {
    console.log("decision:", n.attrs.id, n.text);
  }
});

## Extracting just one block type

Pull every {{code:@task}} out of a document for a status report.

@code lang="js"
import { parseLessmark } from "lessmark";

function tasks(source) {
  const ast = parseLessmark(source);
  return ast.children
    .filter((n) => n.type === "block" && n.name === "task")
    .map((n) => ({ status: n.attrs.status, body: n.text }));
}

## Transforming the tree

A transform is a walk that returns a new node instead of side
effects. Lessmark trees are JSON-serializable, so a deep clone is a
{{code:JSON.parse(JSON.stringify(ast))}}.

@code lang="js"
function rewriteDecisions(ast, fn) {
  const clone = JSON.parse(JSON.stringify(ast));
  for (const node of clone.children) {
    if (node.type === "block" && node.name === "decision") {
      Object.assign(node, fn(node));
    }
  }
  return clone;
}

@callout kind="warning"
The shipped {{code:renderHtml}} expects valid trees. If you mutate
attributes, run the new tree through {{link:validateAst|docs/phases}}
before rendering.

## The contract

The complete AST shape is pinned in
{{code:schemas/language-v0.contract.json}}. Every package validates
its output against that file in CI. If you write a tool that consumes
lessmark trees, validate against the contract too.
`,f1=`# Blocks

@summary
Lessmark ships with a fixed set of typed blocks. Each one has a clear job.
The list is small on purpose.

## Prose

The most common block. Plain top-level prose becomes a paragraph node and
supports the full inline syntax.

@code lang="lessmark"
  Lessmark is a {{strong:strict}} markdown alternative built for tooling.

## Agent context

These blocks carry intent that an agent can act on without scraping prose.

@list kind="unordered"
- summary, the one-paragraph "what is this document".
- decision id, a binding choice with a stable slug for citation.
- constraint, a rule that must hold.
- task status, one of todo, doing, done, blocked.
- file path, ties prose to a path on disk.
- api name, ties prose to an exported symbol.
- metadata key, an arbitrary keyed value.
- risk level, one of low, medium, high, critical.
- depends-on target, links one block to another by id.

## Documentation surfaces

@list kind="unordered"
- quote cite, for blockquotes with attribution.
- callout kind, for boxed notes (note, tip, warning, caution).
- list kind, for flat lists with one item per line.
- table columns, for pipe-separated rows.
- image src and alt, for figures.
- code lang, for fenced code with a language tag.
- example, for verbatim sample blocks.
- callout kind, as the canonical aside surface.

## Cross references

@list kind="unordered"
- toc, renders a table of contents for the page's headings.
- definition term, for glossary entries.
- reference target, for explicit backlinks.
- footnote id, for citation-style notes.
- link href, for standalone link blocks.

## Page structure

Two blocks describe how the document fits into a larger site.

@list kind="unordered"
- page, document metadata such as title and output path.
- nav, navigation links a renderer can group into a slot.

@code lang="lessmark"
  @page title="Getting started" output="getting-started.html"

## Anchors

Every heading and every decision block gets a slug-style anchor. Inline
ref functions point at those anchors and validation rejects broken refs.
`,d1=`# CLI

@summary
The {{code:lessmark}} command ships in the
{{link:npm|https://www.npmjs.com/package/lessmark}} and
{{link:PyPI|https://pypi.org/project/lessmark/}} packages with the same
surface. The {{link:Rust crate|https://crates.io/crates/lessmark}}
exposes the same commands via {{code:cargo run -p lessmark}}.

## Commands

@code lang="sh"
lessmark parse file.lmk
lessmark check file.lmk
lessmark check --json file.lmk
lessmark format file.lmk
lessmark format --check file.lmk
lessmark fix --write file.lmk
lessmark from-markdown README.md
lessmark to-markdown file.lmk
lessmark render --document docs/index.lmk
lessmark build --strict docs public
lessmark info --json

## What each does

@list kind="unordered"
- parse prints the JSON tree.
- check validates source. With --json it returns stable error codes.
- format prints canonical lessmark to stdout.
- format --check returns a failure when the file is not canonical.
- fix --write rewrites the file in place when format diverges.
- from-markdown converts safe common markdown shapes into typed lessmark blocks.
- to-markdown converts lessmark into safe markdown.
- render --document produces a complete HTML document.
- build --strict walks a directory and writes a static site.
- build copies only public assets under assets/, public/, or static/.
- info --json reports the supported blocks, inline functions, and CLI features.

## Exit codes

@table columns="Code|Meaning"
0|Success
1|Validation or parse error
2|I/O error
`,h1=`# FAQ

@summary
Common questions about why lessmark exists and where it fits.

## Why not just markdown?

Markdown has no fixed grammar. Two parsers can disagree on the same input,
and raw HTML or flavor extensions can change behavior. Lessmark keeps
plain paragraphs ergonomic while still producing a stable schema: every
paragraph, typed block, heading, and attribute has a fixed tree shape.

## Why not MDX?

MDX mixes Markdown with JSX. That makes documents executable, tightly
coupled to a JavaScript runtime, and dependent on whichever components the
host project happens to import. Lessmark documents are pure data. They
never execute, never import, and never depend on the renderer.

## Why not AsciiDoc or RST?

AsciiDoc and reStructuredText already have schemas, but the schemas are
huge. Hundreds of directives, two distinct heading styles, a macro layer
on top. Lessmark fits in a single grammar file and a single page of docs.

## Where does it fit?

Anywhere. Lessmark works for anything you would write in Markdown, and
shines when the document is also data.

@list kind="unordered"
- Personal blogs, websites, and zines.
- Notes, journals, recipes, and game design docs.
- Resumes, READMEs, and changelogs.
- Specs, RFCs, decision records, and runbooks.
- Agent context files an LLM reads to understand a project.
- API docs that need to be machine-checked.
- ...basically anything you want to write.

If your document needs a renderer and a parser to agree on its meaning,
lessmark fits.

## Can I use it for blogs and articles?

Yes. The shorthand layer accepts the Markdown forms ({{code:**bold**}},
{{code:[link](url)}}, fenced {{code:\`\`\`}} blocks) so writing prose is no
slower than writing Markdown. Run {{code:lessmark format}} to canonicalize.
See the {{link:Blog Post Maker|examples/blog-maker}} example for a
template you can copy.

## Does it have a renderer?

Every package ships {{code:renderHtml}}. Output is plain semantic HTML you
style with CSS. There is no React-component layer, no theme system, no
plugin chain.

## Will the language keep growing?

Yes, lessmark is still growing. New blocks are added when the language
genuinely needs them, and every package picks up the change at the same
time. Issues, ideas, and pull requests are welcome on
{{link:GitHub|https://github.com/jasperdevs/lessmark}}.

`,m1=`# Getting started

@summary
Install lessmark, write a first document, parse it, and run a check.
You will be productive in five minutes.

## Install

### JavaScript

Available on {{link:npm|https://www.npmjs.com/package/lessmark}}.

@code lang="sh"
npm install lessmark

### Python

Available on {{link:PyPI|https://pypi.org/project/lessmark/}}.

@code lang="sh"
pip install lessmark

### Rust

Available on {{link:crates.io|https://crates.io/crates/lessmark}}.

@code lang="sh"
cargo add lessmark

## Editor support

Install the
{{link:Lessmark extension for VS Code|https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode}}
for syntax highlighting on {{code:.lmk}} and {{code:.lessmark}} files,
plus commands to check and preview the current document.

@code lang="sh"
code --install-extension JasperDevs.lessmark-vscode

## Write your first document

Lessmark documents can mix plain prose, headings, and typed blocks.
Use at-sign blocks when you need explicit data. Save this as notes.lmk:

@code lang="lessmark"
  # Project context

  @summary
  A small CLI for tracking time across projects.

  Plain paragraphs work without a tag.

  @decision id="storage-backend"
  Store entries in a single SQLite file, not per-project.

  @constraint
  Do not block the UI while syncing.

## Parse it

@code lang="sh"
lessmark parse notes.lmk

You get a stable JSON tree describing every block. The same call works
in JavaScript, Python, and Rust and returns the same output.

## Validate it

@callout kind="tip" title="Use check before committing"
The check command catches missing required attributes, unknown block
names, broken cross-references, and unsafe URLs. Add it to your
pre-commit hook.

@code lang="sh"
lessmark check notes.lmk

## Where to go next

@list kind="unordered"
- Read the syntax reference for headings, blocks, and inline functions.
- Read the block reference for every block in the language.
- Browse examples to see real documents (resumes, RFCs, postmortems).
- Open the playground to edit live in the browser.

`,p1=`# Hacks

@summary
Every authoring shortcut in lessmark. The parser canonicalizes shortcuts
on the way in, so agents always see the same tree. You can type the
short form and run {{code:lessmark format}} to normalize it on disk.

## Block aliases

The documented block aliases are intentionally small. Aliases never
carry attributes; add attributes by writing the full name. Paragraphs
also have the plain prose form, which is what {{code:lessmark format}}
writes by default.

@table columns="Short|Long|Notes"
plain prose|\`@paragraph\` / \`@p\`|prose with full inline syntax
\`@ul\`|\`@list kind="unordered"\`|bulleted list
\`@ol\`|\`@list kind="ordered"\`|numbered list

@code lang="lessmark"
  Plain prose. Same paragraph rules.

  @ul
  - first
  - second

  @ol
  - first step
  - second step

## Shorthand attributes

Fifteen blocks accept a single bare value on the header line. The parser
rewrites it to the canonical attribute. The shorthand is the only
accepted second spelling for that exact meaning.

@table columns="Short|Long"
\`@task todo\`|\`@task status="todo"\`
\`@decision storage-backend\`|\`@decision id="storage-backend"\`
\`@callout note\`|\`@callout kind="note"\`
\`@code js\`|\`@code lang="js"\`
\`@risk medium\`|\`@risk level="medium"\`
\`@file src/main.rs\`|\`@file path="src/main.rs"\`
\`@api captureWindow\`|\`@api name="captureWindow"\`
\`@math tex\`|\`@math notation="tex"\`
\`@diagram mermaid\`|\`@diagram kind="mermaid"\`
\`@reference storage-backend\`|\`@reference target="storage-backend"\`
\`@depends-on storage-backend\`|\`@depends-on target="storage-backend"\`
\`@footnote knuth-1974\`|\`@footnote id="knuth-1974"\`
\`@definition agent-context\`|\`@definition term="agent-context"\`
\`@link https://example.com\`|\`@link href="https://example.com"\`
\`@metadata project.stage\`|\`@metadata key="project.stage"\`

Shorthand only fires when the value has no whitespace and no equals
sign. If you need spaces or a second attribute, write the full
{{code:attr="value"}} form.

## Inline shortcuts

Any prose body accepts these. The parser rewrites each into the
canonical {{code:{{name:value}}}} form.

@list kind="unordered"
- Backticks wrap inline code.
- Double asterisks wrap strong text.
- Single asterisks wrap emphasis.
- Double tildes wrap strikethrough.
- Double equals wrap highlights.
- Square brackets followed by parentheses make a link, like the markdown link syntax.
- A square-paren link with a \`#anchor\` target becomes an in-document reference.
- Square brackets with a caret prefix make a footnote pointer.

@code lang="lessmark"
  Press \`Ctrl+S\` to save. The **bold** survives diffs and so does the
  ==highlight==. Visit [our docs](https://example.com/docs). This claim is
  well-established[^knuth-1974].

  @footnote knuth-1974
  Example citation.

## Things that do not have shortcuts

Use the explicit inline function form for anything below.

@list kind="unordered"
- {{code:{{kbd:Ctrl+K}}}} for keyboard keys.
- Nested formatting like bold inside a link.
- Any inline function without a punctuation shortcut. Lessmark keeps the shortcut surface small on purpose.

## Format on save

{{code:lessmark format}} expands inline shortcuts and block aliases, then
rewrites the file in place. Run it from a pre-commit hook or your editor's
format-on-save and stop thinking about which form you typed.

@code lang="sh"
lessmark format notes.lmk
lessmark fix --write notes.lmk
`,g1=`# Phases of rendering

@summary
A lessmark document moves through three phases on its way from text to
output. Knowing where you are in the pipeline tells you which errors
mean what and where to plug in your own code.

## The pipeline

@diagram kind="mermaid"
flowchart LR
  A["Source .lmk"] --> B["Parse"]
  B --> C["AST"]
  C --> D["Validate"]
  D --> E["Render"]
  E --> F["HTML, JSX, PDF"]

Every package ships the same three phases. They are pure functions of
their input, so you can stop after any of them.

## Phase 1: parse

@decision id="parse-strict"
The parser fails on the first violation. Lessmark does not try to
recover from a bad document. A failure here means the source itself is
invalid.

The parser turns the string into the AST documented on the
{{link:AST page|docs/ast}}. Errors are thrown as {{code:LessmarkError}}
with a line and column.

@code lang="js"
import { parseLessmark, LessmarkError } from "lessmark";

try {
  const ast = parseLessmark(source);
} catch (e) {
  if (e instanceof LessmarkError) {
    console.error(\`line \${e.line}, column \${e.column}: \${e.message}\`);
  }
  throw e;
}

## Phase 2: validate

Validation catches things the grammar cannot. Cross-references that
point at undefined ids. Block attributes that are valid syntax but not
allowed for that block. Inline links that resolve to an unsafe URL
scheme.

@code lang="js"
import { parseLessmark, validateAst } from "lessmark";

const ast = parseLessmark(source);
const errors = validateAst(ast);
if (errors.length > 0) {
  for (const err of errors) console.error(err.message);
}

@callout kind="tip"
Use {{code:validateSource}} to combine parse and validate in one
call. Use {{code:validateAst}} when you already have a parsed tree.

## Phase 3: render

The renderer is a walker over the AST. The shipped
{{code:renderHtml}} produces semantic HTML. The
{{link:Render page|docs/render}} covers React, Next.js, and custom
walkers.

@constraint
The renderer never inspects raw source. It only sees the AST. Every
guarantee about the output comes from the parse and validate phases.

## Why three phases

@list kind="unordered"
- Each phase is a pure function with one input and one output. Nothing is implicit.
- A tool that only needs the AST does not have to render. A linter parses, validates, and stops.
- The same AST renders identically in every language package.
`,y1=`# Render

@summary
How to take a parsed lessmark document and turn it into HTML, React,
or any other output your project needs. The grammar stops where the
AST starts. The render side is just code.

## The shortest path

Parse a string, walk the tree, emit HTML. The JavaScript package ships
both calls.

@code lang="js"
import { parseLessmark, renderHtml } from "lessmark";

const ast = parseLessmark(source);
const html = renderHtml(ast);

The same shape works in Python.

@code lang="py"
from lessmark import parse_lessmark
# render_html is not yet shipped in the Python package; walk the AST or
# render in your own template engine.

ast = parse_lessmark(source)

## Render in React

The renderer returns a plain HTML string. The simplest path is to drop
it into an article element with {{code:dangerouslySetInnerHTML}}. The
example below uses {{code:React.createElement}} so this page can ship
through the lessmark parser without escaping.

In a real project, write the same component in JSX. The
{{code:dangerouslySetInnerHTML}} prop expects an object with a
{{code:__html}} string.

@code lang="js"
import { createElement, useMemo } from "react";
import { parseLessmark, renderHtml } from "lessmark";

export function Article({ source }) {
  const html = useMemo(() => renderHtml(parseLessmark(source)), [source]);
  return createElement("article", {
    className: "lessmark-output",
    dangerouslySetInnerHTML: { __html: html },
  });
}

@callout kind="tip"
Wrap the call in {{code:useMemo}} keyed on the source. Re-parsing on
every keystroke is fast, but pointless.

## Render in Next.js

Read the {{code:.lmk}} file at build time, parse it, and render the HTML
in a server component.

@code lang="js"
import fs from "node:fs/promises";
import { createElement } from "react";
import { parseLessmark, renderHtml } from "lessmark";

export default async function Page() {
  const source = await fs.readFile("content/post.lmk", "utf8");
  const html = renderHtml(parseLessmark(source));
  return createElement("article", {
    dangerouslySetInnerHTML: { __html: html },
  });
}

@callout kind="note" title="Static export"
This pattern works with {{code:next export}} and the App Router. The
parser runs at build time, so the runtime payload is plain HTML.

## Custom render

The shipped {{code:renderHtml}} is one walker over the AST. If your
project needs different markup, JSX, or PDF, walk the tree yourself.

@diagram kind="mermaid"
flowchart LR
  AST["AST root"] --> W["walk node"]
  W --> Q{"node type"}
  Q -->|document| D["concat children"]
  Q -->|heading| H["h1, h2, h3"]
  Q -->|paragraph| P["p"]
  Q -->|block| B{"block name"}
  B -->|decision| Dc["aside decision"]
  B -->|callout| Cl["aside callout"]
  B -->|code| Co["pre code"]
  B -->|other| Etc["other tags"]

The {{link:AST guide|docs/ast}} covers the shape of every node. The
{{link:phases page|docs/phases}} covers where rendering sits in the
pipeline.

@code lang="js"
import { parseLessmark } from "lessmark";

function tag(name, attrs, text) {
  const a = Object.entries(attrs)
    .map(([k, v]) => \` \${k}="\${v}"\`)
    .join("");
  return \`<\${name}\${a}>\${text}</\${name}>\`;
}

function walk(node) {
  if (node.type === "document") return node.children.map(walk).join("");
  if (node.type === "heading") return tag("h" + node.level, {}, node.text);
  if (node.type === "block" && node.name === "decision") {
    return tag("aside", { class: "decision", id: node.attrs.id }, node.text);
  }
  return "";
}

const html = walk(parseLessmark(source));

## What the renderer does not do

@list kind="unordered"
- It does not sanitize HTML. The grammar already rejects raw HTML and unsafe URL schemes at parse time, so the renderer has nothing to strip.
- It does not load fonts, themes, or CSS. The output is class-tagged HTML. Style it however your project styles content.
- It does not run any code in your document. Lessmark is pure data.
`,v1=`# Switching

@summary
Coming from another format? Pick a tab below for a side-by-side mapping
into lessmark.

`,b1=`# Syntax

@summary
Complete reference for lessmark. Every block, every inline function, with
examples you can copy.

## Document shape

Plain prose is allowed at the top level and becomes a paragraph block in
the AST. Named blocks still start with an at-sign, headings start with a
hash, and raw HTML or JSX is forbidden everywhere.

## Headings

ATX-style only, levels one through six, single space after the hash.
Always leave a blank line after a heading.

@code lang="lessmark"
  # Document title
  ## Section
  ### Subsection
  #### Sub-subsection

## Paragraphs

Plain text is the normal paragraph syntax. Separate paragraphs with a
blank line. The parser records each one as a {{code:paragraph}} block.
The explicit forms {{code:@p}} and {{code:@paragraph}} still work when
you want to force prose meaning, but {{code:lessmark format}} writes
ordinary plain paragraphs.

@code lang="lessmark"
  Plain prose. Use {{strong:bold}}, {{em:italic}}, and {{code:inline code}}
  inside any prose body.

## Inline syntax

Inside any prose body, double curly braces invoke an inline function.
The general shape is {{code:{{name:value}}}} or
{{code:{{name:value|extra}}}}.

@list kind="unordered"
- strong, for bold.
- em, for italic.
- code, for inline code.
- kbd, for keyboard keys.
- mark, for highlights.
- del, for strikethrough.
- sup, for superscript.
- sub, for subscript.
- link, with a label and a safe href.
- ref, with a label and an in-document target.
- footnote, with a footnote id.

@code lang="lessmark"
  Press {{kbd:Ctrl+S}} to save. The {{mark:highlight}} survives diffs.
  Visit {{link:our docs|https://example.com/docs}} for the full list.

## Authoring shortcuts

Lessmark accepts a typing layer that formats back to the canonical form.
Agents always see the canonical tree; humans do not have to type the
longest form every time.

After {{code:lessmark format}}, the document below becomes plain
paragraph text, {{code:{{strong:bold}}}}, {{code:{{em:emphasis}}}},
{{code:{{code:code}}}}, {{code:{{del:strikethrough}}}},
{{code:{{mark:highlight}}}}, {{code:{{link:Docs|https://example.com}}}},
{{code:{{footnote:knuth-1974}}}}, {{code:@task status="todo"}}, and
{{code:@decision id="storage-backend"}}. For a full list of authoring
shortcuts, see the Hacks page.

@code lang="lessmark"
  Use **bold**, *emphasis*, \`code\`, ~~strikethrough~~, ==highlight==,
  [Docs](https://example.com), and footnote pointers like [^knuth-1974].

  @footnote knuth-1974
  Example citation.

  @task todo
  Add export settings.

  @decision storage-backend
  Use SQLite.

## Code blocks

Use {{code:@code}} with an optional language attribute. Indent two
spaces if the body itself contains lines that start with an at-sign or
hash, since either would otherwise terminate the block.

@code lang="lessmark"
  @code lang="js"
  function add(a, b) {
    return a + b;
  }

## Lists

One item per line, prefixed with {{code:- }}. Nested items use exactly
two spaces per level and cannot skip levels.

@code lang="lessmark"
  @list kind="unordered"
  - First item
  - Second item
  - Third item

  @list kind="ordered"
  - First step
    - First sub-step
  - Second step
  - Third step

## Tables

Pipe-separated rows. The first row is the header.

@code lang="lessmark"
  @table columns="Code|Meaning"
  0|Success
  1|Validation error
  2|I/O error

## Quotes

@code lang="lessmark"
  @quote cite="Donald Knuth"
  Premature optimization is the root of all evil.

## Callouts

Boxed notes with a kind and an optional title.

@code lang="lessmark"
  @callout kind="note" title="One-time setup"
  Run {{code:lessmark info --json}} to see what your installed version
  supports.

  @callout kind="tip"
  Add {{code:lessmark check}} to your pre-commit hook.

  @callout kind="warning"
  This rewrites the file in place.

  @callout kind="caution"
  Removing a decision id breaks every {{code:{{ref:...}}}} that points at it.

## Images

The image block is body-less. Use the {{code:caption}} attribute for the
figure label.

@code lang="lessmark"
  @image src="diagrams/flow.png" alt="Capture pipeline overview" caption="Capture pipeline. Each stage runs in its own task."

## Math

Notation is one of {{code:tex}} or {{code:asciimath}}. The body is
preserved verbatim and rendered by your math toolchain downstream.

@code lang="lessmark"
  @math notation="tex"
  E = mc^2

## Diagrams

Kind is one of {{code:mermaid}}, {{code:graphviz}}, or {{code:plantuml}}.
The body is preserved verbatim.

@code lang="lessmark"
  @diagram kind="mermaid"
  graph TD
    A --> B
    B --> C

## Separators

A horizontal rule between sections. Body-less.

@code lang="lessmark"
  @separator

## Agent context blocks

Blocks that carry intent an agent can act on without scraping prose.

### summary

@code lang="lessmark"
  @summary
  A small CLI for tracking time across projects.

### decision

A binding choice with a stable id. Other blocks can point at the id.

@code lang="lessmark"
  @decision id="storage-backend"
  Store entries in a single SQLite file, not per-project.

### constraint

@code lang="lessmark"
  @constraint
  Do not block the UI while syncing.

### task

Status is one of {{code:todo}}, {{code:doing}}, {{code:done}},
{{code:blocked}}.

@code lang="lessmark"
  @task status="doing"
  Migrate hotkey registration off the deprecated win32 path.

### file

@code lang="lessmark"
  @file path="src/Capture/Service.cs"
  Owns stitching and capture state.

### api

@code lang="lessmark"
  @api name="captureWindow"
  Captures a single window by handle. Returns a PNG buffer.

### metadata

@code lang="lessmark"
  @metadata key="project.stage"
  beta

### risk

Level is one of {{code:low}}, {{code:medium}}, {{code:high}},
{{code:critical}}.

@code lang="lessmark"
  @risk level="medium"
  Changing capture flow can break workflows users have built around the
  current shortcut behavior.

### depends-on

@code lang="lessmark"
  @depends-on target="storage-backend"
  Implements the SQLite write path described in the decision.

## Cross-reference blocks

### toc

Renders a table of contents for the page's headings.

@code lang="lessmark"
  @toc

### definition

@code lang="lessmark"
  @definition term="agent context"
  A document an LLM reads to understand a project.

### reference

@code lang="lessmark"
  @decision id="storage-backend"
  Store entries in SQLite.

  @reference target="storage-backend"
  See the storage decision for the SQLite rationale.

### footnote

Inline pointers use {{code:{{footnote:id}}}}. The matching definition
block must appear in the same document.

@code lang="lessmark"
  This claim is well-established{{footnote:knuth-1974}}.

  @footnote id="knuth-1974"
  Donald Knuth, "Structured Programming with go to Statements", 1974.

### link

A standalone link block. Inline links use {{code:{{link:label|url}}}}
inside any prose body.

@code lang="lessmark"
  @link href="https://example.com/spec"
  Read the full specification

## Page structure

### page

@code lang="lessmark"
  @page title="Getting started" output="getting-started.html"

### nav

One nav block per link. Slot is optional and defaults to {{code:primary}}.

@code lang="lessmark"
  @nav slot="primary" label="Home" href="/"
  @nav slot="primary" label="Docs" href="/docs"
  @nav slot="primary" label="Examples" href="/examples"

## Anchors

Every heading and every {{code:@decision}} block gets a slug-style anchor.
Inline {{code:{{ref:label|target-id}}}} points at those anchors and
validation rejects broken references.

## Safety

@constraint
Lessmark refuses raw HTML, JSX, and unsafe URL schemes. Anything that
looks executable raises a parse error before it ever reaches a renderer.

@callout kind="warning"
Embedding a script tag in any block body is a parse error, not a warning.
The parser stops at the first violation.
`,x1=`# Validation

@summary
Lessmark separates parsing from validation. Parsing fails on anything outside
the grammar. Validation enforces deeper rules: required attributes, safe URLs,
unique anchors, and language-rule conformance.

@diagram kind="mermaid"
flowchart LR
  Src["Source .lmk"] --> Parse["Parse"]
  Parse -->|grammar error| FailP["Reject with line and column"]
  Parse -->|ok| AST["AST"]
  AST --> Val["Validate"]
  Val -->|rule error| FailV["Reject with code and location"]
  Val -->|ok| Out["Use the AST"]

## Same checks in every package

Lessmark ships JavaScript, Python, and Rust packages. They share the same
test fixtures and produce the same JSON tree for the same source.

## Errors are typed

@callout kind="tip" title="Use --json for tooling"
The {{code:check}} command emits stable error codes when called with
{{code:--json}}. Editor extensions and CI scripts depend on those codes
remaining stable across versions.

@code lang="sh"
lessmark check --json notes.lmk

## What validation checks

@list kind="unordered"
- Required attributes are present and non-empty.
- Attributes are limited to those each block defines.
- Decision ids are lowercase slugs.
- Task statuses are one of todo, doing, done, blocked.
- Risk levels are one of low, medium, high, critical.
- Inline references point at existing anchors.
- URLs use safe schemes only.
- No raw HTML, JSX, or expression syntax appears anywhere.

## When checks fail

@callout kind="warning"
A failed check exits non-zero. CI should treat this as a build failure.
The CLI prints a line:column pointer for each error.
`,k1=`# Blog Post Maker

@summary
A starter template for a blog post. Replace this summary with your dek,
swap the heading above, and fill in the sections below. Every block is
optional. Keep what you need.

## Intro

Write a short intro paragraph here. Use {{em:emphasis}} where it adds
meaning, and {{code:inline code}} for literal names.

## A section heading

Body copy goes here. Add as many sections as you need.

@callout kind="tip"
Use callouts for tips, warnings, or asides.

## Code

Drop a snippet to show readers what you mean.

@code lang="js"
// your code here

## A pull quote

@quote cite="Author"
A line from your subject, when it lands the point better than your
prose can.

## Closing

Wrap up with a short paragraph and a link to a related post or the
project on
{{link:GitHub|https://github.com/jasperdevs/lessmark}}.
`,S1=`# Changelog

@summary
Notable changes to the project, newest first. Versioning follows semver.

## 0.4.0

@list kind="unordered"
- Added build --strict preflight checks for unsafe URLs and duplicate outputs.
- Renderer emits stable anchor ids for headings and decisions.
- Inline footnote requires a matching @footnote block in the same document.

## 0.3.2

@list kind="unordered"
- Fix: tables with a single column no longer reject rows.
- Fix: heading slugs collapse repeated separators correctly.

## 0.3.1

@list kind="unordered"
- Fix: validate that @page output paths are repository-relative.

## 0.3.0

@list kind="unordered"
- Added callout, quote, list, table, and image blocks.
- Added toc, definition, reference, and footnote cross-reference blocks.
- Added inline strong, em, code, link, ref, footnote, kbd, mark, del.

## 0.2.0

@list kind="unordered"
- First Python package.
- Shared test fixtures across packages.

## 0.1.0

@list kind="unordered"
- Initial release. Ten core blocks, JSON tree output, JavaScript package, CLI.

`,w1=`# Jane Carter

Senior software engineer focused on developer tools, infrastructure, and
authoring formats. {{link:jane@example.com|mailto:jane@example.com}} ·
{{link:github.com/janecarter|https://github.com/janecarter}}

## Summary

@summary
Ten years building tooling that makes large codebases tractable. Recent work:
language servers, static analyzers, and authoring formats for technical docs.

## Experience

### Staff engineer, Acme

2022 to present. Owned the documentation pipeline used by 800 engineers.
Migrated a brittle markdown stack to a typed authoring format with stable
anchors and machine-checkable validation.

@list kind="unordered"
- Cut docs CI from 14 minutes to 90 seconds.
- Shipped an editor extension consumed across the org.
- Drafted the internal RFC for a typed-blocks document spec.

### Senior engineer, Globex

2018 to 2022. Built and operated the build system used to ship the desktop
client. Reduced cold build time from 6 minutes to 40 seconds.

## Skills

@table columns="Area|Tools"
Languages|TypeScript, Rust, Python
Infra|Bazel, Nix, GitHub Actions
Editing|Tree-sitter, language servers, AST refactors

## Education

B.S. Computer Science, University of Somewhere, 2014.

`,E1=`# Skill: capture window

@summary
A reusable skill an agent can invoke to capture a single application
window. The agent reads this file, follows the constraints, and produces a
PNG plus a JSON sidecar.

@metadata key="skill.id"
capture-window

@metadata key="skill.owner"
capture-team

@metadata key="skill.version"
1.2.0

## Inputs

@list kind="unordered"
- {{code:windowHandle}}: opaque handle returned by the host runtime.
- {{code:outputPath}}: relative path the PNG will be written to.
- {{code:metadata}}: optional JSON object merged into the sidecar.

## Outputs

@list kind="unordered"
- A PNG at {{code:outputPath}}.
- A JSON sidecar at {{code:outputPath + ".json"}} carrying capture metadata.

## Decisions

@decision id="storage-backend"
Save captures as PNG plus a sidecar JSON for metadata. No proprietary
container format.

@decision id="handle-lifetime"
Treat the window handle as valid only for the duration of a single skill
invocation. Re-resolve it on every call.

## Constraints

@constraint
Never upload a capture to a remote service without an opt-in dialog.

@constraint
Do not require admin privileges. The skill must work for a standard user.

@constraint
Refuse to capture windows whose process name appears on the
{{code:capture.deny}} list in the host config.

## Steps

@list kind="ordered"
- Resolve the window handle. Fail fast if the handle is no longer valid.
- Check the deny list against the resolved process name.
- Capture the window pixels into a PNG buffer.
- Write the PNG to {{code:outputPath}}.
- Write the JSON sidecar with timestamp, process name, and any caller metadata.

## Failure modes

@risk level="medium"
Window minimized or off-screen. Capture returns an empty buffer. Detect
and surface a clear error rather than writing a blank PNG.

@risk level="high"
Process name changed after the deny check. The skill must re-check before
writing.

@risk level="critical"
Path traversal in {{code:outputPath}}. Reject anything that does not pass
the safe-relative-path check.

## API

@api name="captureWindow"
Captures a single window by handle. Returns a PNG buffer and a sidecar
metadata object.

@depends-on target="storage-backend"
Implements the PNG-plus-sidecar storage decided above.

`,T1=`# Syntax tour

@summary
A short tour of every typed block and inline function in lessmark. Copy
any block into your own document and adjust the body or attributes.

## Inline functions

This paragraph uses {{strong:bold}}, {{em:italic}}, {{code:inline code}},
{{kbd:Ctrl+S}}, {{mark:highlight}}, and {{del:strikethrough}}. Visit
{{link:GitHub|https://github.com/jasperdevs/lessmark}} for an external
link. See {{ref:the block-list decision|block-list-fixed}} for an
internal cross reference.

## Decisions and constraints

@decision id="block-list-fixed"
The set of blocks is fixed in the language contract. New blocks are
added only when an existing combination of blocks cannot express what a
real document needs.

@constraint
Every block has a stable JSON shape across packages. A document parsed
by JavaScript, Python, and Rust produces the same tree.

## Tasks

@task status="todo"
A task that has not been started.

@task status="doing"
A task currently in progress.

@task status="done"
A task that has been completed.

@task status="blocked"
A task waiting on something else.

## Callouts

@callout kind="note" title="Heads up"
A short note. Callouts can carry an optional {{code:title}} attribute.

@callout kind="tip"
A tip surfaces a recommended pattern.

@callout kind="warning"
A warning flags risk a reader should consider before acting.

@callout kind="caution"
A caution is stronger than a warning. Treat it as a hard rule.

## Quick asides

@callout kind="note"
Generated files live in {{code:dist/}} and are gitignored.

@callout kind="warning"
Embedding a script tag in any block body is a parse error.

## Lists

@list kind="unordered"
- One package per runtime.
- One CLI.
- One contract.

@list kind="ordered"
- Write the document.
- Parse it with any package.
- Render the tree, or hand it to the agent that needs it.

## Tables

@table columns="Code|Meaning|Exit"
0|Success|exits 0
1|Validation or parse error|exits 1
2|I/O error|exits 2

## Code blocks

@code lang="js"
import { parseLessmark, renderHtml } from "lessmark";

const tree = parseLessmark(source);
const html = renderHtml(tree);

@code lang="py"
from lessmark import parse, render_html

tree = parse(source)
html = render_html(tree)

@code lang="sh"
lessmark parse notes.lmk
lessmark check --json notes.lmk

## Quotes

@quote cite="Donald Knuth"
Premature optimization is the root of all evil.

## Files and APIs

@file path="schemas/language-v0.contract.json"
The canonical contract. Every package validates against this file.

@api name="parseLessmark"
Parses a string and returns the AST.

@api name="renderHtml"
Walks an AST and emits semantic HTML.

## Risks

@risk level="low"
Adding a new optional attribute to an existing block.

@risk level="medium"
Adding a new block that overlaps with an existing one.

@risk level="high"
Changing how an existing block parses. Old documents stop parsing.

## Cross references

@definition term="lessmark"
A strict markdown alternative with typed blocks and a stable JSON tree.

@reference target="block-list-fixed"
See the decision above for why the block set is closed.

@depends-on target="block-list-fixed"
Every renderer assumes the block set is closed under the contract.

@link href="https://github.com/jasperdevs/lessmark"
The project on GitHub.
`,_1=`# The markdown alternative that agents (and humans) love.

## What is lessmark?

Lessmark is a strict alternative to Markdown. Every document is a sequence of
typed blocks. Every package parses the same source into the same JSON tree.

@callout kind="note"
Lessmark is open-source. The grammar, the parsers, and this site live on
{{link:GitHub|https://github.com/jasperdevs/lessmark}}.

## How is lessmark different?

Markdown is a presentation format. Lessmark is a structure format. A
{{code:@decision}} block is a decision, a {{code:@constraint}} block is a
constraint, and an LLM reading the file does not have to guess.

There is no raw HTML, no JSX, and no template engine. The parser stops at the
first violation, so a broken document never reaches a renderer.

## features

### Open source

MIT licensed packages for JavaScript, Python, and Rust. One grammar, one tree
shape, one CLI. Same parser output across every runtime.

### Built for agents and humans

Typed blocks like {{code:@decision}} and {{code:@task}} carry intent an
agent can act on. The source still reads cleanly to a human reviewer.

### Adopt anywhere

Drop a {{code:.lmk}} file into any project, parse it with any package, and
get the same tree. Swap the runtime, keep the documents.

## Where does it fit?

Anywhere. Lessmark works for anything you would write in Markdown, and
shines when the document is also data.

@list kind="unordered"
- Personal blogs, websites, and zines.
- Notes, journals, recipes, and game design docs.
- Resumes, READMEs, and changelogs.
- Specs, RFCs, decision records, and runbooks.
- Agent context files an LLM reads to understand a project.
- API docs that need to be machine-checked.
- ...basically anything you want to write.

If your document needs a renderer and a parser to agree on its meaning,
lessmark fits.

## Get started

Install one of the packages, then save the document below as
{{code:project.lmk}}.

@code lang="sh"
npm install lessmark

@code lang="sh"
pip install lessmark

@code lang="lessmark"
  # Project context

  @summary
  Local Windows screenshot app.

  @decision id="storage-backend"
  Save captures as PNG plus a JSON sidecar.

  @constraint
  Do not upload a capture without an opt-in dialog.

  @task status="todo"
  Add export settings.

Parse it, validate it, ship the tree.

@code lang="sh"
lessmark parse project.lmk
lessmark check project.lmk

`,A1=`# From AsciiDoc

@summary
Most AsciiDoc constructs map cleanly to lessmark. Block-level elements use
{{code:@name}} prefixes instead of square-bracket roles, and inline
formatting uses double-curly-brace functions.

## Headings

AsciiDoc {{code:=}} headings become {{code:#}} headings. Levels still go
one through six, and a blank line is required after every heading.

@code lang="asciidoc"
= Document title
== Section
=== Subsection

@code lang="lessmark"
  # Document title
  ## Section
  ### Subsection

## Inline formatting

@table columns="AsciiDoc|Lessmark"
*bold*|\`{{strong:bold}}\` or \`**bold**\`
_emphasis_|\`{{em:emphasis}}\` or \`*emphasis*\`
\`monospace\`|\`{{code:monospace}}\` or backticks
[mark]#highlighted#|\`{{mark:highlighted}}\` or \`==highlighted==\`
~strikethrough~|\`{{del:strikethrough}}\` or \`~~strikethrough~~\`
+++raw+++|not allowed; raw HTML and pass-through macros are rejected

## Lists

AsciiDoc nests with extra asterisks. Lessmark uses two-space indentation
and a single dash per item.

@code lang="asciidoc"
* one
* two
** nested

@code lang="lessmark"
  @list kind="unordered"
  - one
  - two
    - nested

## Admonitions

AsciiDoc admonitions ({{code:NOTE:}}, {{code:WARNING:}},
{{code:CAUTION:}}) become {{code:@callout}} blocks with a
{{code:kind}}.

@code lang="asciidoc"
NOTE: Generated files live in dist/.

WARNING: Hotkey changes break old workflows.

@code lang="lessmark"
  @callout kind="note"
  Generated files live in {{code:dist/}}.

  @callout kind="warning"
  Hotkey changes break old workflows.

## Source blocks

AsciiDoc source blocks delimit code with a fenced line. Lessmark uses
{{code:@code}} with an optional {{code:lang}} attribute.

@code lang="asciidoc"
[source,js]
----
console.log("hello");
----

@code lang="lessmark"
  @code lang="js"
  console.log("hello");

## Cross references

AsciiDoc {{code:‹‹section-id››}} cross references become inline
{{code:{{ref:#section-id}}}} functions. Targets must already exist in the
same document, either as a heading slug or a {{code:@decision}} id.

## Includes

AsciiDoc {{code:include::}} directives have no equivalent. Lessmark does
not include other files at parse time. Compose the final document
upstream and ship it as one source.
`,j1=`# From Markdown

@summary
Lessmark is stricter than Markdown. The grammar is fixed, every block has a
name, and raw HTML is forbidden. Most Markdown idioms have a direct
lessmark equivalent.

## Paragraphs

Plain paragraphs work in both Markdown and Lessmark. Lessmark still turns
them into explicit {{code:paragraph}} nodes in the AST.

@code lang="md"
In Markdown, this paragraph just sits in the document.

@code lang="lessmark"
In Lessmark, this paragraph can also sit in the document.

## Headings

Only ATX-style headings ({{code:#}} through {{code:######}}) are accepted.
Setext-style underlined headings are not. A blank line after every heading
is required.

## Emphasis and inline code

Both the Markdown forms and the typed forms parse identically. Whichever
you write, {{code:lessmark format}} canonicalizes inline punctuation to
the typed inline form.

@code lang="md"
**bold**, *emphasis*, \`inline code\`

@code lang="lessmark"
{{strong:bold}}, {{em:emphasis}}, {{code:inline code}}

## Links

Lessmark does not support link titles. URLs must use a safe scheme (https,
http, mailto) or be an in-document anchor like {{code:#section-id}}.

@code lang="md"
[Go to docs](https://example.com/docs "Optional title")

@code lang="lessmark"
{{link:Go to docs|https://example.com/docs}}

## Lists

Use {{code:@list kind="unordered"}} or {{code:@list kind="ordered"}}. Items
go on separate lines starting with {{code:- }}. Nested items use exactly
two spaces per level.

@code lang="md"
- one
  - nested
- two

@code lang="lessmark"
  @list kind="unordered"
  - one
    - nested
  - two

## Block quotes

@code lang="md"
> This is a quote.

@code lang="lessmark"
  @quote cite="Donald Knuth"
  Premature optimization is the root of all evil.

## Code blocks

Lessmark has no indented code blocks. Use {{code:@code}} with an optional
{{code:lang}} attribute.

@code lang="md"
\`\`\`js
console.log("hello");
\`\`\`

@code lang="lessmark"
  @code lang="js"
  console.log("hello");

## Tables

@code lang="md"
| Code | Meaning |
| ---- | ------- |
| 0    | Success |
| 1    | Error   |

@code lang="lessmark"
  @table columns="Code|Meaning"
  0|Success
  1|Error

## Hard line breaks

Lessmark joins consecutive lines inside a block. There is no trailing-
whitespace or backslash hard break. Start a new block instead.

## Raw HTML

Not allowed. The parser rejects {{code:<}} as the first non-space character
of any block body, and inline HTML is a parse error.

`,R1=`# From MDX

@summary
MDX mixes Markdown with JSX. Lessmark documents are pure data: no imports,
no expressions, no React. The renderer is a function from tree to HTML,
not a tree of components.

## Replace JSX components with typed blocks

A custom MDX callout component becomes a built-in {{code:@callout}} block.
The {{code:kind}} attribute carries what was previously a prop.

@code lang="mdx"
import { Callout } from "@/components/Callout";

‹Callout type="warning"›
  Hotkey changes break old workflows.
‹/Callout›

@code lang="lessmark"
  @callout kind="warning"
  Hotkey changes break old workflows.

## Drop imports

Lessmark documents do not import. Every block name and every inline
function is fixed in the grammar, so two documents in different repos
parse to the same tree.

## Drop runtime expressions

There are no JSX expressions, no template substitution, no curly-brace
escapes into JavaScript. If you need a dynamic value, write the document
with the value already inserted, or compose at parse time.

## Match interactive components to typed blocks

@table columns="MDX pattern|Lessmark equivalent"
\`‹Tabs /›\`|consecutive \`@code\` blocks with \`lang="..."\` attributes
\`‹CodeGroup /›\`|consecutive \`@code\` blocks with \`lang="..."\` attributes
\`‹Note /›\`|\`@callout kind="note"\`
\`‹Warning /›\`|\`@callout kind="warning"\`
\`‹Callout type="info" /›\`|\`@callout kind="tip"\`
custom React component|model the data with a typed block; the renderer wraps it

## Frontmatter

MDX usually relies on a YAML frontmatter block. Lessmark uses a typed
{{code:@metadata}} block at the top of the document with named keys.

@code lang="mdx"
---
title: Switching from MDX
date: 2026-04-28
---

@code lang="lessmark"
  @metadata key="title"
  Switching from MDX

  @metadata key="date"
  2026-04-28
`,z1=`# From reStructuredText

@summary
reStructuredText uses underline-style headings and indented directive
blocks. Lessmark uses ATX headings ({{code:#}}) and named typed blocks.

## Headings

RST underline-style headings become ATX-style {{code:#}} headings. There
is no separate document title syntax; the first {{code:#}} heading is the
title.

@code lang="rst"
Document title
==============

Section
-------

@code lang="lessmark"
  # Document title
  ## Section

## Inline formatting

Drop the underline-and-double-backtick conventions. Lessmark accepts the
Markdown shorthands and the typed form on equal footing.

@code lang="rst"
**bold** *emphasis* \`\`inline code\`\`
\`text ‹url›\`_

@code lang="lessmark"
{{strong:bold}} {{em:emphasis}} {{code:inline code}}
{{link:text|url}}

## Directives

RST directives become typed blocks. The directive name maps to the block
name; directive options become block attributes.

@code lang="rst"
.. note:: Generated files live in dist/.

.. code-block:: js

   console.log("hello");

@code lang="lessmark"
  @callout kind="note"
  Generated files live in {{code:dist/}}.

  @code lang="js"
  console.log("hello");

## Lists

RST lists allow asterisks, hyphens, or plus signs. Lessmark uses one
form: a dash and a space, with two-space indentation per nesting level.

@code lang="rst"
* one
* two

  * nested

@code lang="lessmark"
  @list kind="unordered"
  - one
  - two
    - nested

## Cross references

RST {{code::ref:}} roles become explicit {{code:{{ref:#anchor}}}} inline
functions. Targets must already exist in the same document, either as a
heading slug or as a {{code:@decision}} id.

## Substitutions

RST substitutions and the {{code:|name|}} pipe syntax have no
equivalent. Lessmark documents do not interpolate. Bake values into the
document or compose upstream.

## Tables

RST grid tables become {{code:@table}} blocks with a single
{{code:columns}} attribute and pipe-delimited rows.

@code lang="rst"
+------+---------+
| Code | Meaning |
+======+=========+
| 0    | Success |
+------+---------+
| 1    | Error   |
+------+---------+

@code lang="lessmark"
  @table columns="Code|Meaning"
  0|Success
  1|Error
`,M1=`# Footer

@metadata key="brand"
lessmark

@nav label="MIT" href="https://github.com/jasperdevs/lessmark/blob/main/LICENSE"

@nav label="github" href="https://github.com/jasperdevs/lessmark"

@nav label="vscode" href="https://marketplace.visualstudio.com/items?itemName=JasperDevs.lessmark-vscode"

@nav label="@jasperdevs" href="https://x.com/jasperdevs"

@nav label="contact" href="mailto:jasper.mceligott@gmail.com"

@metadata key="dark-label"
dark mode

@metadata key="light-label"
light mode

@metadata key="source-button"
this site was built with lessmark →

`,C1=`# Header

@metadata key="brand"
lessmark

@nav label="docs" href="/docs" slot="primary"

@nav label="examples" href="/examples" slot="primary"

@nav label="playground" href="/playground" slot="primary"

@nav label="github" href="https://github.com/jasperdevs/lessmark" slot="primary"

`,O1=`# UI

@metadata key="header.brand"
lessmark

@metadata key="home.docs-link"
getting started

@metadata key="home.playground-link"
playground

@metadata key="home.open-playground"
open full playground

@metadata key="home.next-heading"
Next

@metadata key="home.next-link"
Read the getting-started guide

@metadata key="home.next-summary"
install a package, write your first document

@metadata key="docs.sidebar-label"
Docs

@metadata key="docs.previous"
previous

@metadata key="docs.next"
next

@metadata key="examples.index-heading"
Examples

@metadata key="examples.back"
all examples

@metadata key="source.panel-label"
Edit page source

@metadata key="source.close-label"
Close source panel

@metadata key="source.reset"
reset

@metadata key="source.close"
close

@metadata key="source.live-note"
edits update the page live

@metadata key="source.modified"
modified

@metadata key="playground.reset"
reset

@metadata key="playground.format"
format

@metadata key="playground.resize-title"
drag to resize

@metadata key="playground.preview-label"
preview view

@metadata key="playground.view-html"
html

@metadata key="playground.view-tree"
tree

@metadata key="playground.view-ast"
ast

@metadata key="playground.error-line"
line

@metadata key="playground.error-column"
column

@metadata key="switching.source-format-label"
source format

@metadata key="switching.markdown"
Markdown

@metadata key="switching.mdx"
MDX

@metadata key="switching.asciidoc"
AsciiDoc

@metadata key="switching.rst"
reStructuredText
`,N1=`# What is lessmark?

Lessmark is a strict, agent-readable alternative to Markdown. Every
document is a sequence of typed blocks, and every parser produces the
same JSON tree.

Lessmark is open source. Check out the
{{link:source on GitHub|https://github.com/jasperdevs/lessmark}} to see
how it works.

## How is lessmark different?

Markdown is a presentation format. Lessmark is a structure format. A
{{code:@decision}} block is a decision, a {{code:@constraint}} block is
a constraint, and a tool reading the file does not have to guess.
{{link:Read more|docs/syntax}}.

## Next steps

@list kind="unordered"
- {{link:Install lessmark|docs/getting-started}}
- {{link:Explore the syntax|docs/syntax}}
`;function D1(l){var s;if(!l)return{};try{const o=yn(l),u={};for(const c of o.children)c.type==="block"&&c.name==="metadata"&&((s=c.attrs)!=null&&s.key)&&(u[c.attrs.key]=(c.text??"").trim());return u}catch{return{}}}function cp(l){return Object.entries(l).map(([s,o])=>{const u=s.split("/").pop().replace(/\.lmk$/,""),c=yn(o),d=c.children.find(v=>v.type==="heading"),h=c.children.find(v=>v.type==="block"&&v.name==="summary");return{slug:u,source:o,title:(d==null?void 0:d.type)==="heading"?d.text??u:u,summary:(h==null?void 0:h.type)==="block"?h.text??"":""}}).sort((s,o)=>s.slug.localeCompare(o.slug))}const L1=Object.assign({"../content/docs/api.lmk":o1,"../content/docs/ast.lmk":c1,"../content/docs/blocks.lmk":f1,"../content/docs/cli.lmk":d1,"../content/docs/faq.lmk":h1,"../content/docs/getting-started.lmk":m1,"../content/docs/hacks.lmk":p1,"../content/docs/phases.lmk":g1,"../content/docs/render.lmk":y1,"../content/docs/switching.lmk":v1,"../content/docs/syntax.lmk":b1,"../content/docs/validation.lmk":x1}),U1=Object.assign({"../content/examples/blog-maker.lmk":k1,"../content/examples/changelog.lmk":S1,"../content/examples/resume.lmk":w1,"../content/examples/skill.lmk":E1,"../content/examples/syntax-tour.lmk":T1}),H1=Object.assign({"../content/home/home.lmk":_1}),B1=Object.assign({"../content/switching/asciidoc.lmk":A1,"../content/switching/markdown.lmk":j1,"../content/switching/mdx.lmk":R1,"../content/switching/rst.lmk":z1}),Go=Object.assign({"../content/chrome/footer.lmk":M1,"../content/chrome/header.lmk":C1,"../content/chrome/ui.lmk":O1}),q1=Object.assign({"../content/playground/default.lmk":N1});function el(l,s){for(const[o,u]of Object.entries(l))if(o.endsWith(`/${s}.lmk`))return u;return""}const Y1=["getting-started","switching","syntax","blocks","validation","render","phases","ast","api","cli","hacks","faq"],G1=["syntax-tour","blog-maker","skill","resume","changelog"];function fp(l,s){const o=u=>{const c=s.indexOf(u);return c===-1?s.length:c};return[...l].sort((u,c)=>o(u.slug)-o(c.slug))}const Yt=fp(cp(L1),Y1),Qn=fp(cp(U1),G1),X1=el(H1,"home"),Q1=el(Go,"footer"),$1=el(Go,"header"),dp=el(Go,"ui"),De=D1(dp),wo=el(q1,"default"),V1=["markdown","mdx","asciidoc","rst"],Pl=V1.map(l=>({slug:l,label:De[`switching.${l}`]??l,source:el(B1,l)})).filter(l=>l.source),Ze={home:()=>"home",doc:l=>`docs/${l}`,example:l=>`examples/${l}`,switching:l=>`switching/${l}`,chrome:l=>`chrome/${l}`},Z1={[Ze.home()]:X1,[Ze.chrome("footer")]:Q1,[Ze.chrome("header")]:$1,[Ze.chrome("ui")]:dp,...Object.fromEntries(Yt.map(l=>[Ze.doc(l.slug),l.source])),...Object.fromEntries(Qn.map(l=>[Ze.example(l.slug),l.source])),...Object.fromEntries(Pl.map(l=>[Ze.switching(l.slug),l.source]))};function J1(l){return Yt.find(s=>s.slug===l)}function K1(l){return Qn.find(s=>s.slug===l)}const Xo=T.createContext(null);function W1({defaults:l,children:s}){const[o,u]=T.useState({}),c={get:d=>o[d]??l[d]??"",set:(d,h)=>u(v=>({...v,[d]:h})),reset:d=>u(h=>{if(!d)return{};const v={...h};return delete v[d],v}),isOverridden:d=>Object.prototype.hasOwnProperty.call(o,d)};return g.jsx(Xo.Provider,{value:c,children:s})}function si(l){const s=T.useContext(Xo);if(!s)throw new Error("LiveSourceProvider missing");return s.get(l)}function hp(){const l=T.useContext(Xo);if(!l)throw new Error("LiveSourceProvider missing");return l}const Sm=["var(--nav-red)","var(--nav-yellow)","var(--nav-green)","var(--nav-blue)"];function wm(l){return{"--nav-color":Sm[l%Sm.length]}}function F1(l){var d,h,v;const s={brand:"lessmark",links:[{label:"docs",href:"/docs"},{label:"examples",href:"/examples"},{label:"playground",href:"/playground"},{label:"github",href:"https://github.com/jasperdevs/lessmark"}]};if(!l)return s;let o;try{o=yn(l)}catch{return s}const u={},c=[];for(const y of o.children)y.type==="block"&&y.name==="metadata"&&((d=y.attrs)!=null&&d.key)?u[y.attrs.key]=(y.text??"").trim():y.type==="block"&&y.name==="nav"&&((h=y.attrs)!=null&&h.label)&&((v=y.attrs)!=null&&v.href)&&c.push({label:y.attrs.label,href:y.attrs.href});return{brand:u.brand||s.brand,links:c.length?c:s.links}}const I1="nav-link text-fg hover:text-fg transition-colors";function P1(){const l=si(Ze.chrome("header")),s=T.useMemo(()=>F1(l),[l]);return g.jsx("header",{className:"sticky top-0 z-40 py-4 bg-bg",style:{paddingTop:"calc(1rem + env(safe-area-inset-top, 0px))"},children:g.jsxs("div",{className:"mx-auto max-w-[1080px] px-4 sm:px-6 flex items-center justify-between gap-4",children:[g.jsxs(_t,{to:"/","aria-label":`${s.brand} home`,className:"inline-flex items-center gap-2 text-[15px] font-bold shrink-0",children:[g.jsx("img",{src:"/lessmarklogowhitebackground.svg",alt:"",className:"size-6"}),g.jsx("span",{className:"max-[380px]:hidden",children:s.brand})]}),g.jsx("nav",{className:"flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[13px] sm:gap-x-6 sm:text-[14px]",children:s.links.map((o,u)=>{const c=/^https?:/.test(o.href),d=`${I1}${o.label==="github"?" inline-flex items-center gap-1.5":""}`,h=g.jsxs(g.Fragment,{children:[o.label==="github"?g.jsx(op,{className:"size-4"}):null,g.jsx("span",{className:o.label==="github"?"max-[520px]:sr-only":"",children:o.label})]});return c?g.jsx("a",{href:o.href,rel:"noopener",style:wm(u),className:d,children:h},o.href):g.jsx(Do,{to:o.href,style:wm(u),className:d,children:h},o.href)})})]})})}const Qo=new Map([["summary","Document summary. Body is plain inline text."],["paragraph","Paragraph body. Plain top-level prose is also parsed as a paragraph. Use inline functions like {{strong:text}}, {{ref:Label|target}}, and {{link:Label|https://example.com}}."],["decision",'Decision block. Required: id="lowercase-slug". The id becomes a local reference target.'],["constraint","Constraint body. Use for rules the document must preserve."],["task",'Task block. Required: status="todo|doing|done|blocked".'],["risk",'Risk block. Required: level="low|medium|high|critical".'],["depends-on",'Dependency block. Required: target="decision-id".'],["code",'Literal code block. Optional: lang="js". Inline syntax is not parsed inside the body.'],["example","Literal example block. Inline syntax is not parsed inside the body."],["list",`List block. Required: kind="unordered|ordered". Body uses one '- ' marker per item; nest with two spaces.`],["table",'Table block. Required: columns="Name|Value". Body rows must match the column count.'],["image","Image block. Required: src and alt. Optional: caption."],["math",'Math block. Required: notation="tex|asciimath". Body is literal.'],["diagram",'Diagram block. Required: kind="mermaid|graphviz|plantuml". Body is literal.'],["footnote",'Footnote block. Required: id="lowercase-slug". Can be referenced with {{footnote:id}}.'],["reference",'Reference block. Required: target="local-anchor". Target must resolve.'],["link","Standalone link block. Required: href. Body is the label."],["callout",'Callout block. Required: kind="note|tip|warning|caution". Optional: title.'],["quote","Quote block. Optional: cite."],["definition","Definition block. Required: term."],["metadata","Metadata block. Required: key."],["page","Page metadata. Optional: title, output. Body is not allowed."],["nav","Navigation block. Required: label, href. Body is not allowed."],["api","API block. Required: name."],["separator","Separator block. No attributes or body."],["toc","Table of contents marker. No body."]]),$o=new Map([["strong","{{strong:text}} makes text strong."],["em","{{em:text}} emphasizes text."],["code","{{code:text}} marks inline code."],["kbd","{{kbd:key}} marks keyboard input."],["del","{{del:text}} marks deleted text."],["mark","{{mark:text}} highlights text."],["sup","{{sup:text}} marks superscript text."],["sub","{{sub:text}} marks subscript text."],["ref","{{ref:Label|target}} links to a local heading, @decision id, or @footnote id."],["footnote","{{footnote:id}} links to a matching @footnote id."],["link","{{link:Label|href}} creates a safe external or project-relative link."]]),ex=new Map([["api",["name"]],["callout",["kind","title"]],["code",["lang"]],["decision",["id"]],["definition",["term"]],["depends-on",["target"]],["diagram",["kind"]],["file",["path"]],["footnote",["id"]],["image",["src","alt","caption"]],["link",["href"]],["list",["kind"]],["math",["notation"]],["metadata",["key"]],["nav",["label","href","slot"]],["page",["title","output"]],["reference",["target","label"]],["risk",["level"]],["table",["columns"]],["task",["status"]]]),tx=new Map([["api",`@api name=""
`],["callout",`@callout kind="note"
`],["code",`@code lang=""
`],["decision",`@decision id=""
`],["definition",`@definition term=""
`],["depends-on",`@depends-on target=""
`],["diagram",`@diagram kind="mermaid"
`],["file",`@file path=""
`],["footnote",`@footnote id=""
`],["image",`@image src="" alt=""
`],["link",`@link href=""
`],["list",`@list kind="unordered"
- `],["math",`@math notation="tex"
`],["metadata",`@metadata key=""
`],["nav",`@nav label="" href=""
`],["page",`@page title="" output=""
`],["reference",`@reference target=""
`],["risk",`@risk level="medium"
`],["table",`@table columns="Name|Value"
`],["task",`@task status="todo"
`]]),nx=[...Qo.keys()],ax=[...$o.keys()];function lx(l,s){const o=/^@([a-z][a-z0-9-]*)\b/.exec(l);if(o&&s>=0&&s<=o[0].length)return Qo.get(o[1])??null;const u=rx(l,s);return u?$o.get(u)??null:null}function ix(l,s){const o=l.lastIndexOf(`
`,s-1)+1,u=l.indexOf(`
`,s),c=l.slice(o,u===-1?l.length:u),d=l.slice(o,s),h=d.lastIndexOf("{{");if(h!==-1){const w=d.slice(h+2);if(!w.includes("}")&&!w.includes(":")){const x=w.trim();return{from:o+h,items:ax.filter(z=>z.startsWith(x)).map(z=>({label:z,detail:$o.get(z)??"",insert:`{{${z}:}}`,cursorOffset:z.length+3}))}}}const v=/^@([a-z][a-z0-9_-]*)?$/.exec(d);if(v){const w=v[1]??"";return{from:o,items:nx.filter(x=>x.startsWith(w)).map(x=>{const z=tx.get(x)??`@${x}
`;return{label:`@${x}`,detail:Qo.get(x)??"",insert:z,cursorOffset:sx(z)??z.length}})}}const y=/^@([a-z][a-z0-9_-]*)\b/.exec(c),p=/(?:^|\s)([a-z][a-z0-9_-]*)?$/.exec(d);if(y&&p&&d.trimEnd()===d){const w=ex.get(y[1])??[],x=p[1]??"",z=new Set([...c.matchAll(/\b([a-z][a-z0-9_-]*)=/g)].map(U=>U[1])),Y=w.filter(U=>!z.has(U)&&U.startsWith(x)).map(U=>({label:U,detail:`${y[1]} attribute`,insert:`${U}=""`,cursorOffset:U.length+2}));if(Y.length>0)return{from:s-x.length,items:Y}}return null}function rx(l,s){let o=0;for(;o<l.length;){const u=l.indexOf("{{",o);if(u===-1)return null;const c=u+2,d=l.indexOf(":",c);if(d===-1)return null;const h=l.slice(c,d).trim();if(s>=c&&s<=d)return h;o=d+1}return null}function sx(l){const s=l.indexOf('""');return s===-1?null:s+1}const Eo=20.8,mp=7.85;function pp({value:l,onChange:s,className:o="",autoFocus:u}){const c=T.useRef(null),d=T.useRef(null),h=T.useRef(null),v=T.useRef(null),y=T.useRef([]),p=T.useMemo(()=>T0(l),[l]),w=T.useMemo(()=>l.split(`
`).length,[l]),[x,z]=T.useState(null),[Y,U]=T.useState(null),H=typeof document>"u"?null:document.body;T.useEffect(()=>{var L;u&&((L=c.current)==null||L.focus())},[u]),T.useEffect(()=>{var L;x&&((L=y.current[x.active])==null||L.scrollIntoView({block:"nearest"}))},[x]),T.useEffect(()=>{if(!x&&!Y)return;const L=W=>{const fe=W.target;fe instanceof Element&&fe.closest(".lessmark-completion, .lessmark-hover")||(z(null),U(null))},B=()=>{z(null),U(null)};return window.addEventListener("scroll",L,!0),window.addEventListener("resize",B),()=>{window.removeEventListener("scroll",L,!0),window.removeEventListener("resize",B)}},[x,Y]);const X=()=>{const L=c.current,B=d.current,W=h.current;!L||!B||!W||(B.scrollTop=L.scrollTop,B.scrollLeft=L.scrollLeft,W.scrollTop=L.scrollTop)},G=()=>{const L=c.current,B=v.current;if(!L||!B)return;const W=L.value,fe=ix(W,L.selectionStart);if(!fe||fe.items.length===0){z(null);return}const Je=B.getBoundingClientRect(),Le=ux(W,L.selectionStart,L.scrollLeft,L.scrollTop,Je);z({...fe,...Le,active:0})},P=(L,B)=>{const W=c.current;if(!W)return;const fe=W.selectionStart,Je=B+(L.cursorOffset??L.insert.length);if(W.focus(),W.setSelectionRange(B,fe),!document.execCommand("insertText",!1,L.insert)){const de=l.slice(0,B)+L.insert+l.slice(fe);s(de)}z(null),requestAnimationFrame(()=>{W.focus(),W.selectionStart=W.selectionEnd=Je,X()})},J=L=>{if(x&&(L.key==="ArrowDown"||L.key==="ArrowUp")){L.preventDefault();const B=L.key==="ArrowDown"?1:-1;z({...x,active:(x.active+B+x.items.length)%x.items.length});return}if(x&&(L.key==="Enter"||L.key==="Tab")){L.preventDefault(),P(x.items[x.active],x.from);return}if(x&&L.key==="Escape"){L.preventDefault(),z(null);return}if(L.key==="Tab"){L.preventDefault();const B=L.currentTarget,W=B.selectionStart,fe=B.selectionEnd;if(!document.execCommand("insertText",!1,"  ")){const Le=l.slice(0,W)+"  "+l.slice(fe);s(Le),requestAnimationFrame(()=>{B.selectionStart=B.selectionEnd=W+2})}}},he=L=>{const B=c.current,W=v.current;if(!B||!W)return;const fe=W.getBoundingClientRect(),Je=L.clientX-fe.left-12+B.scrollLeft,Le=L.clientY-fe.top-12+B.scrollTop,de=Math.max(0,Math.floor(Le/Eo)),Fe=Math.max(0,Math.floor(Je/mp)),Ke=l.split(`
`)[de]??"",je=lx(Ke,Fe);U(je?{text:je,x:Dr(L.clientX+12,8,window.innerWidth-360),y:Dr(L.clientY+12,8,window.innerHeight-120)}:null)},ce=H&&g.jsxs(g.Fragment,{children:[x&&g.jsx("div",{className:"lessmark-completion",style:{left:x.x,top:x.y+Eo},role:"listbox",children:x.items.map((L,B)=>g.jsxs("button",{type:"button",ref:W=>{y.current[B]=W},className:B===x.active?"active":"",role:"option","aria-selected":B===x.active,onMouseDown:W=>{W.preventDefault(),P(L,x.from)},children:[g.jsx("span",{children:L.label}),g.jsx("small",{children:L.detail})]},L.label))}),Y&&g.jsx("div",{className:"lessmark-hover",style:{left:Y.x,top:Y.y},children:Y.text})]});return g.jsxs("div",{className:`lessmark-editor relative grid grid-cols-[40px_minmax(0,1fr)] min-h-0 min-w-0 ${o}`,children:[g.jsx("div",{ref:h,"aria-hidden":!0,className:"overflow-hidden border-r border-code-line py-3 text-right pr-2 text-code-faint font-[var(--font-code)] text-[13px] leading-[1.6] select-none",children:Array.from({length:w},(L,B)=>g.jsx("div",{children:B+1},B))}),g.jsxs("div",{ref:v,className:"relative isolate min-w-0",onMouseMove:he,onMouseLeave:()=>U(null),children:[g.jsx("pre",{ref:d,"aria-hidden":!0,className:"lessmark-editor-code lessmark-scrollbar absolute inset-0 z-0 m-0 p-3 overflow-auto whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-code-fg pointer-events-none",dangerouslySetInnerHTML:{__html:p+`
`}}),g.jsx("textarea",{ref:c,value:l,onChange:L=>{s(L.target.value),requestAnimationFrame(G)},onClick:()=>{requestAnimationFrame(G)},onKeyDown:J,onKeyUp:L=>{L.key==="ArrowDown"||L.key==="ArrowUp"||L.key==="Enter"||L.key==="Tab"||L.key==="Escape"||requestAnimationFrame(G)},onScroll:X,spellCheck:!1,className:"lessmark-editor-code lessmark-scrollbar absolute inset-0 z-10 m-0 p-3 w-full h-full resize-none bg-transparent border-0 outline-none whitespace-pre font-[var(--font-code)] text-[13px] leading-[1.6] text-transparent caret-code-fg selection:bg-code-line"})]}),ce?_b.createPortal(ce,H):null]})}function ux(l,s,o,u,c){const h=l.slice(0,s).split(`
`),v=h.length-1,y=h[h.length-1].length;return{x:Dr(c.left+12+y*mp-o,8,window.innerWidth-380),y:Dr(c.top+12+v*Eo-u,8,window.innerHeight-260)}}function Dr(l,s,o){return Math.min(o,Math.max(s,l))}function ox({open:l,files:s,onClose:o}){var y;const u=hp(),[c,d]=T.useState(((y=s[0])==null?void 0:y.id)??"");T.useEffect(()=>{if(s.length===0)return;s.some(w=>w.id===c)||d(s[0].id)},[s,c]),T.useEffect(()=>{if(!l)return;const p=w=>{w.key==="Escape"&&o()};return document.addEventListener("keydown",p),()=>document.removeEventListener("keydown",p)},[l,o]);const h=u.get(c),v=u.isOverridden(c);return g.jsxs("aside",{role:"dialog","aria-label":De["source.panel-label"]||"Edit page source","aria-hidden":!l,className:`fixed inset-y-0 right-0 z-50 w-[min(560px,100vw)] bg-code-bg text-code-fg border-l border-code-line flex flex-col transition-transform duration-200 ease-out ${l?"translate-x-0":"translate-x-full"}`,style:{paddingTop:"env(safe-area-inset-top, 0px)"},children:[g.jsxs("div",{className:"flex items-center justify-between gap-2 px-3 h-12 border-b border-code-line text-[12px] font-mono",children:[g.jsx("div",{className:"flex items-center gap-1 overflow-x-auto",children:s.map(p=>g.jsx("button",{type:"button",onClick:()=>d(p.id),className:`px-2 h-8 rounded-md whitespace-nowrap transition-colors ${p.id===c?"bg-code-line/80 text-code-fg":"text-code-faint hover:text-code-fg hover:bg-code-line/40"}`,children:p.name},p.id))}),g.jsxs("div",{className:"flex items-center gap-1",children:[v&&g.jsx("button",{type:"button",onClick:()=>u.reset(c),className:"px-2 h-8 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/40 transition-colors",children:De["source.reset"]||"reset"}),g.jsx("button",{type:"button",onClick:o,className:"px-2 h-8 rounded-md text-code-faint hover:text-code-fg hover:bg-code-line/40 transition-colors","aria-label":De["source.close-label"]||"Close source panel",children:De["source.close"]||"close"})]})]}),g.jsxs("div",{className:"px-3 py-1.5 border-b border-code-line text-[11px] font-mono text-code-faint flex items-center justify-between",children:[g.jsx("span",{children:De["source.live-note"]||"edits update the page live"}),v&&g.jsx("span",{className:"text-[var(--code-key)]",children:De["source.modified"]||"modified"})]}),g.jsx(pp,{value:h,onChange:p=>u.set(c,p),className:"flex-1 overflow-hidden"})]})}const gp="lessmark-theme";function cx(){if(typeof window>"u")return"light";const l=localStorage.getItem(gp);return l==="light"||l==="dark"?l:"light"}function fx(l){document.documentElement.setAttribute("data-theme",l)}function dx(){const[l,s]=T.useState(()=>typeof window>"u"?"light":cx());return T.useEffect(()=>{fx(l),localStorage.setItem(gp,l)},[l]),[l,()=>s(o=>o==="dark"?"light":"dark")]}function hx(l){const s=l.replace(/^\n|\n$/g,"").split(`
`),o=[];return s.forEach((u,c)=>{[...u].forEach((d,h)=>{d==="#"&&o.push({x:h,y:c})})}),o}function Vo({grid:l,className:s,label:o}){const u=hx(l);if(u.length===0)return g.jsx("svg",{viewBox:"0 0 1 1",className:s,role:"img","aria-label":o});const c=u.map(H=>H.x),d=u.map(H=>H.y),h=Math.min(...c),v=Math.max(...c),y=Math.min(...d),p=Math.max(...d),w=v-h+1,x=p-y+1,z=Math.max(w,x),Y=(z-w)/2-h,U=(z-x)/2-y;return g.jsx("svg",{viewBox:`0 0 ${z} ${z}`,className:s,role:"img","aria-label":o,shapeRendering:"crispEdges",children:u.map((H,X)=>g.jsx("rect",{x:H.x+Y,y:H.y+U,width:"1",height:"1",fill:"currentColor"},X))})}const mx=`
........................
....################....
....################....
....##............##....
....##..##..##....##....
....##............##....
....##..######....##....
....##............##....
....##..##..##..####....
....##............##....
....##..######....##....
....##............##....
....################....
....################....
..........####..........
..........####..........
........########........
.......##########.......
........................
.....##..........##.....
......##........##......
.......##########.......
........................
........................
`,px=`
........................
..####################..
..####################..
..##................##..
..##..##............##..
..##...##...........##..
..##..##............##..
..##.......######...##..
..##......########..##..
..##......##..##....##..
..##......########..##..
..##........####....##..
..##................##..
..####################..
..####################..
.......##......##.......
.......##......##.......
......####....####......
........................
.........######.........
........########........
........................
........................
........................
`,gx=`
........................
........................
..........####..........
.........######.........
........########........
.......###....###.......
......###......###......
.....###........###.....
.....###........###.....
.....####......####.....
......#####..#####......
........########........
..........####..........
..........####..........
....######....######....
...########..########...
...##....##..##....##...
...##....##..##....##...
...########..########...
....######....######....
..........####..........
.........######.........
........########........
........................
`;function yx({className:l}){return g.jsx(Vo,{grid:mx,className:l,label:"Source"})}function vx({className:l}){return g.jsx(Vo,{grid:px,className:l,label:"Terminal"})}function bx({className:l}){return g.jsx(Vo,{grid:gx,className:l,label:"tree"})}function xx({className:l,animated:s}){const o=[[58,15],[83,24],[112,12],[246,14],[276,24],[306,13]],u=[28,36,45,55,66,78,91,104,118,133,149,164,180,196,211,227,242,257,272,286,300,314,327];return g.jsxs("svg",{viewBox:"0 0 360 92",className:l,"data-animated":s?"true":"false",role:"img","aria-label":"Lessmark logo character standing in a pixel night scene",shapeRendering:"crispEdges",children:[g.jsxs("g",{className:"pixel-moon",fill:"currentColor",opacity:"0.42",children:[g.jsx("rect",{x:"42",y:"12",width:"3",height:"3"}),g.jsx("rect",{x:"45",y:"15",width:"3",height:"3"}),g.jsx("rect",{x:"42",y:"18",width:"3",height:"3"})]}),g.jsx("g",{className:"pixel-stars",fill:"currentColor",opacity:"0.28",children:o.map(([c,d],h)=>g.jsxs("g",{children:[g.jsx("rect",{x:c+2,y:d,width:"2",height:"6"}),g.jsx("rect",{x:c,y:d+2,width:"6",height:"2"})]},`star-${h}`))}),g.jsxs("g",{className:"pixel-clouds",fill:"currentColor",opacity:"0.22",children:[g.jsx("rect",{x:"22",y:"31",width:"50",height:"2"}),g.jsx("rect",{x:"288",y:"31",width:"50",height:"2"}),g.jsx("rect",{x:"72",y:"43",width:"32",height:"2"}),g.jsx("rect",{x:"256",y:"43",width:"32",height:"2"})]}),g.jsxs("g",{className:"pixel-hill",fill:"currentColor",opacity:"0.32",children:[g.jsx("rect",{x:"96",y:"76",width:"168",height:"4"}),g.jsx("rect",{x:"116",y:"72",width:"128",height:"4"})]}),g.jsxs("g",{className:"pixel-character",children:[g.jsxs("g",{fill:"currentColor",children:[g.jsx("rect",{x:"120",y:"28",width:"120",height:"8"}),g.jsx("rect",{x:"112",y:"36",width:"8",height:"36"}),g.jsx("rect",{x:"240",y:"36",width:"8",height:"36"}),g.jsx("rect",{x:"120",y:"72",width:"120",height:"8"})]}),g.jsx("g",{fill:"var(--surface)",children:g.jsx("rect",{x:"124",y:"36",width:"112",height:"36"})}),g.jsxs("g",{className:"pixel-arm-left",fill:"currentColor",children:[g.jsx("rect",{x:"96",y:"52",width:"16",height:"5"}),g.jsx("rect",{x:"88",y:"57",width:"8",height:"5"})]}),g.jsxs("g",{className:"pixel-arm-right",fill:"currentColor",children:[g.jsx("rect",{x:"248",y:"52",width:"16",height:"5"}),g.jsx("rect",{x:"264",y:"47",width:"8",height:"5"})]}),g.jsxs("g",{fill:"currentColor",children:[g.jsx("rect",{x:"143",y:"50",width:"9",height:"5"}),g.jsx("rect",{x:"152",y:"45",width:"9",height:"5"}),g.jsx("rect",{x:"161",y:"40",width:"9",height:"5"}),g.jsx("rect",{x:"152",y:"55",width:"9",height:"5"}),g.jsx("rect",{x:"161",y:"60",width:"9",height:"5"}),g.jsx("rect",{x:"180",y:"41",width:"9",height:"24"}),g.jsx("rect",{x:"189",y:"46",width:"5",height:"9"}),g.jsx("rect",{x:"194",y:"52",width:"5",height:"8"}),g.jsx("rect",{x:"199",y:"46",width:"5",height:"9"}),g.jsx("rect",{x:"204",y:"41",width:"9",height:"24"}),g.jsx("rect",{x:"213",y:"41",width:"9",height:"24"})]}),g.jsxs("g",{className:"pixel-feet",fill:"currentColor",children:[g.jsx("rect",{x:"152",y:"80",width:"6",height:"7"}),g.jsx("rect",{x:"144",y:"87",width:"16",height:"3"}),g.jsx("rect",{x:"202",y:"80",width:"6",height:"7"}),g.jsx("rect",{x:"202",y:"87",width:"16",height:"3"})]})]}),g.jsxs("g",{fill:"currentColor",opacity:"0.32",children:[g.jsx("rect",{x:"0",y:"84",width:"360",height:"3"}),g.jsx("rect",{x:"0",y:"88",width:"360",height:"1"})]}),g.jsx("g",{className:"pixel-grass",fill:"currentColor",children:u.map((c,d)=>g.jsxs("g",{opacity:d%2===0?.58:.36,children:[g.jsx("rect",{x:c,y:"80",width:"1",height:"4"}),g.jsx("rect",{x:c+1,y:"78",width:"1",height:"6"}),g.jsx("rect",{x:c+2,y:"81",width:"1",height:"3"})]},`grass-${d}`))})]})}function kx(l){if(l.startsWith("mailto:"))return u1;try{const s=new URL(l).hostname.replace(/^www\./,"");if(s==="github.com")return op;if(s==="x.com"||s==="twitter.com")return r1;if(s==="marketplace.visualstudio.com"||s==="open-vsx.org")return s1}catch{}return null}function Sx(l){var d,h,v;const s={brand:"lessmark",links:[],darkLabel:"dark mode",lightLabel:"light mode",sourceButton:"this site was built with lessmark →"};if(!l)return s;let o;try{o=yn(l)}catch{return s}const u={},c=[];for(const y of o.children)y.type==="block"&&y.name==="metadata"&&((d=y.attrs)!=null&&d.key)?u[y.attrs.key]=(y.text??"").trim():y.type==="block"&&y.name==="nav"&&((h=y.attrs)!=null&&h.label)&&((v=y.attrs)!=null&&v.href)&&c.push({label:y.attrs.label,href:y.attrs.href});return{brand:u.brand||s.brand,links:c.length?c:s.links,darkLabel:u["dark-label"]||s.darkLabel,lightLabel:u["light-label"]||s.lightLabel,sourceButton:u["source-button"]||s.sourceButton}}function wx(){const l=[{id:Ze.home(),name:"home.lmk"},{id:Ze.chrome("header"),name:"chrome/header.lmk"},{id:Ze.chrome("footer"),name:"chrome/footer.lmk"},{id:Ze.chrome("ui"),name:"chrome/ui.lmk"}];for(const s of Yt)l.push({id:Ze.doc(s.slug),name:`docs/${s.slug}.lmk`});for(const s of Qn)l.push({id:Ze.example(s.slug),name:`examples/${s.slug}.lmk`});for(const s of Pl)l.push({id:Ze.switching(s.slug),name:`switching/${s.slug}.lmk`});return l}function Ex(){const[l,s]=T.useState(!1),[o,u]=T.useState(!1),c=T.useRef(null),[d,h]=dx(),v=T.useMemo(()=>wx(),[]),y=d==="dark",p=si(Ze.chrome("footer")),w=T.useMemo(()=>Sx(p),[p]);return T.useEffect(()=>{const x=c.current;if(!x)return;if(!("IntersectionObserver"in window)){u(!0);return}const z=new IntersectionObserver(([Y])=>{u(Y.isIntersecting)},{rootMargin:"160px 0px",threshold:.2});return z.observe(x),()=>z.disconnect()},[]),g.jsxs(g.Fragment,{children:[g.jsxs("footer",{className:"mt-auto",children:[g.jsx("div",{ref:c,className:"mx-auto max-w-[1080px] px-3 sm:px-6 pt-8",children:g.jsx(xx,{className:"footer-pixel-art w-full h-auto text-fg-faint",animated:o})}),g.jsxs("div",{className:"mx-auto max-w-[1080px] px-4 sm:px-6 pt-4 pb-10 flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between text-[13px] text-fg-muted",children:[g.jsx("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-2",children:w.links.map(x=>{const z=kx(x.href);return g.jsxs("a",{href:x.href,rel:"noopener",className:"inline-flex items-center gap-1.5 hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:[z?g.jsx(z,{className:"size-3.5"}):null,x.label]},x.href)})}),g.jsxs("div",{className:"flex flex-wrap items-center gap-x-4 gap-y-2",children:[g.jsxs("button",{type:"button",onClick:h,"aria-label":y?w.lightLabel:w.darkLabel,className:"inline-flex items-center gap-1.5 hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:[y?g.jsx(i1,{className:"size-3.5"}):g.jsx(l1,{className:"size-3.5"}),g.jsx("span",{children:y?w.lightLabel:w.darkLabel})]}),g.jsx("button",{type:"button",onClick:()=>s(!0),className:"hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:w.sourceButton})]})]})]}),g.jsx(ox,{open:l,files:v,onClose:()=>s(!1)})]})}const Em='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',Tx='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';async function _x(l){var s;try{if((s=navigator.clipboard)!=null&&s.writeText)return await navigator.clipboard.writeText(l),!0}catch{}try{const o=document.createElement("textarea");o.value=l,o.setAttribute("readonly",""),o.style.position="fixed",o.style.left="-9999px",o.style.top="0",document.body.appendChild(o),o.select();const u=document.execCommand("copy");return document.body.removeChild(o),u}catch{return!1}}function Zo(l,s){T.useEffect(()=>{const o=l.current;if(!o)return;const u=[];return o.querySelectorAll("pre").forEach(c=>{if(c.querySelector(":scope > .code-copy-btn"))return;const d=document.createElement("button");d.type="button",d.className="code-copy-btn",d.setAttribute("aria-label","Copy code"),d.innerHTML=Em;let h;const v=async y=>{y.preventDefault(),y.stopPropagation();const p=c.querySelector("code"),w=((p==null?void 0:p.textContent)??c.textContent??"").replace(/\n+$/,"");await _x(w)&&(d.classList.add("code-copy-btn--copied"),d.innerHTML=Tx,h&&window.clearTimeout(h),h=window.setTimeout(()=>{d.classList.remove("code-copy-btn--copied"),d.innerHTML=Em},1400))};d.addEventListener("click",v),u.push(()=>{d.removeEventListener("click",v),h&&window.clearTimeout(h),d.remove()}),c.appendChild(d)}),()=>{for(const c of u)c()}},[l,s])}const Ax="modulepreload",jx=function(l){return"/"+l},Tm={},Rx=function(s,o,u){let c=Promise.resolve();if(o&&o.length>0){let h=function(p){return Promise.all(p.map(w=>Promise.resolve(w).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))};document.getElementsByTagName("link");const v=document.querySelector("meta[property=csp-nonce]"),y=(v==null?void 0:v.nonce)||(v==null?void 0:v.getAttribute("nonce"));c=h(o.map(p=>{if(p=jx(p),p in Tm)return;Tm[p]=!0;const w=p.endsWith(".css"),x=w?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${x}`))return;const z=document.createElement("link");if(z.rel=w?"stylesheet":Ax,w||(z.as="script"),z.crossOrigin="",z.href=p,y&&z.setAttribute("nonce",y),document.head.appendChild(z),w)return new Promise((Y,U)=>{z.addEventListener("load",Y),z.addEventListener("error",()=>U(new Error(`Unable to preload CSS for ${p}`)))})}))}function d(h){const v=new Event("vite:preloadError",{cancelable:!0});if(v.payload=h,window.dispatchEvent(v),!v.defaultPrevented)throw h}return c.then(h=>{for(const v of h||[])v.status==="rejected"&&d(v.reason);return s().catch(d)})};let yo=null;function zx(){return yo||(yo=Rx(()=>import("./mermaid.core-DJSUpsYI.js").then(l=>l.bF),[]).then(l=>{const s=l.default;return s.initialize({startOnLoad:!1,securityLevel:"strict",fontFamily:"Inter, system-ui, sans-serif",themeVariables:{background:"transparent",primaryColor:"#FFFFFF",primaryBorderColor:"#111111",primaryTextColor:"#111111",lineColor:"#3A3A3A",textColor:"#111111",secondaryColor:"#F4F4F5",tertiaryColor:"#FFFFFF"}}),s})),yo}let Mx=0;function yp(l,s){T.useEffect(()=>{const o=l.current;if(!o)return;const u=o.querySelectorAll('figure.lessmark-diagram[data-kind="mermaid"]:not([data-mermaid-rendered])');if(u.length===0)return;let c=!1;return zx().then(async d=>{for(const h of Array.from(u)){if(c)return;const v=h.querySelector("code"),y=((v==null?void 0:v.textContent)??"").trim();if(!y)continue;const p=`mermaid-${++Mx}`;try{await d.parse(y);const{svg:w}=await d.render(p,y);if(c)return;h.innerHTML=w,h.setAttribute("data-mermaid-rendered","true")}catch(w){h.setAttribute("data-mermaid-error","true"),console.warn("mermaid render failed",w)}}document.querySelectorAll("body > [id^='dmermaid-'], body > [id^='mermaid-']").forEach(h=>h.parentElement===document.body&&h.remove())}),()=>{c=!0}},[l,s])}function Jo({source:l,className:s}){const o=T.useRef(null),u=T.useMemo(()=>{try{const c=yn(l);return{ok:!0,html:sp(c)}}catch(c){const d=c instanceof Ae?c:new Ae(String((c==null?void 0:c.message)??c));return{ok:!1,message:d.message,line:d.line,column:d.column}}},[l]);return Zo(o,u.ok?u.html:null),yp(o,u.ok?u.html:null),u.ok?g.jsx("div",{ref:o,className:`lessmark-output ${s??""}`,dangerouslySetInnerHTML:{__html:u.html}}):g.jsxs("div",{className:"font-mono text-[13px] leading-[1.6] text-destructive",children:[g.jsx("div",{children:u.message}),g.jsxs("div",{className:"text-fg-faint mt-1",children:["line ",u.line,", column ",u.column]})]})}function Ko({initial:l="",sample:s,fullHeight:o,value:u,onChange:c,previewToolbar:d}){const h=typeof u=="string"&&typeof c=="function",[v,y]=T.useState(l),p=h?u:v,w=de=>{h?c(de):y(de)},x=T.useRef(null),[z,Y]=T.useState(50),[U,H]=T.useState(!0),[X,G]=T.useState("html"),P=T.useRef(null),J=T.useRef(null);T.useEffect(()=>{const de=window.matchMedia("(min-width: 768px)");H(de.matches);const Fe=Ke=>H(Ke.matches);return de.addEventListener("change",Fe),()=>de.removeEventListener("change",Fe)},[]),T.useEffect(()=>()=>{var de;(de=J.current)==null||de.call(J)},[]);const he=de=>{var C;if(!x.current)return;(C=J.current)==null||C.call(J),de.preventDefault(),P.current={startX:de.clientX,startPct:z},document.body.style.cursor="col-resize",document.body.style.userSelect="none";const Fe=q=>{var S;const I=((S=x.current)==null?void 0:S.clientWidth)??1,ye=q.clientX-P.current.startX,be=Math.min(85,Math.max(15,P.current.startPct+ye/I*100));Y(be)},Ke=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",Fe),window.removeEventListener("mouseup",je),J.current=null},je=()=>{Ke()};J.current=Ke,window.addEventListener("mousemove",Fe),window.addEventListener("mouseup",je)},ce=o?"h-full":"h-[620px] md:h-[520px]",L=s??l,B=typeof L=="string"&&L!==p,W=T.useMemo(()=>{try{return b0(p)}catch{return null}},[p]),fe=U?{width:`${z}%`}:{width:"100%",flex:"1 1 0%"},Je=U?{width:`${100-z}%`}:{width:"100%",flex:"1 1 0%"},Le=!d;return g.jsx("div",{className:`flex flex-col overflow-hidden rounded-lg border border-border-soft bg-bg shadow-[0_1px_3px_rgba(17,17,17,0.04),0_1px_2px_rgba(17,17,17,0.04)] ${ce}`,children:g.jsxs("div",{ref:x,className:"flex flex-col md:flex-row flex-1 min-h-0 bg-code-bg",children:[g.jsxs("div",{className:"flex flex-col text-code-fg min-h-[180px] md:min-h-0 min-w-0",style:fe,children:[g.jsxs("div",{className:"flex items-center justify-start gap-3 h-9 px-4 text-[12px] text-code-faint shrink-0",children:[B&&g.jsx("button",{type:"button",onClick:()=>w(L),className:"text-code-faint hover:text-code-fg transition-colors rounded",children:De["playground.reset"]||"reset"}),g.jsx("button",{type:"button",onClick:()=>W!==null&&w(W),disabled:W===null,className:"text-code-faint hover:text-code-fg transition-colors rounded disabled:opacity-40 disabled:hover:text-code-faint",children:De["playground.format"]||"format"})]}),g.jsx("div",{className:"flex-1 min-h-0 flex flex-col overflow-hidden rounded-tl-xl bg-bg",children:g.jsx(pp,{value:p,onChange:w,className:"flex-1 min-h-0"})})]}),g.jsx("div",{role:"separator","aria-orientation":"vertical",onMouseDown:he,className:"hidden md:block relative w-px shrink-0 bg-border-soft hover:bg-fg-muted/40 transition-colors cursor-col-resize",title:De["playground.resize-title"]||"drag to resize",children:g.jsx("span",{className:"absolute inset-y-0 -left-1.5 -right-1.5"})}),g.jsxs("div",{className:"flex flex-col min-h-[180px] md:min-h-0 min-w-0",style:Je,children:[g.jsx("div",{className:"flex items-center justify-end gap-3 h-9 px-4 text-[12px] text-fg-faint shrink-0",children:Le?g.jsx(Cx,{value:X,onChange:G}):d}),g.jsx("div",{className:"flex-1 min-h-0 overflow-hidden rounded-tr-xl bg-bg",children:g.jsx(Ox,{source:p,view:Le?X:"html"})})]})]})})}function Cx({value:l,onChange:s}){const o=[{key:"html",label:De["playground.view-html"]||"html"},{key:"tree",label:De["playground.view-tree"]||"tree"},{key:"ast",label:De["playground.view-ast"]||"ast"}];return g.jsx("div",{role:"tablist","aria-label":De["playground.preview-label"]||"preview view",className:"flex items-center gap-3",children:o.map(u=>{const c=u.key===l;return g.jsx("button",{type:"button",role:"tab","aria-selected":c,onClick:()=>s(u.key),className:c?"text-fg transition-colors":"text-fg-faint hover:text-fg transition-colors",children:u.label},u.key)})})}function Ox({source:l,view:s}){if(s==="html")return g.jsx("div",{className:"lessmark-scrollbar h-full overflow-auto",children:g.jsx("div",{className:"px-4 py-4 sm:px-6 sm:py-5",children:g.jsx(Jo,{source:l})})});let o;try{const u=yn(l);s==="ast"?o={ok:!0,text:JSON.stringify(u,null,2)}:o={ok:!0,text:Nx(u)}}catch(u){const c=u instanceof Ae?u:new Ae(String((u==null?void 0:u.message)??u));o={ok:!1,message:c.message,line:c.line,column:c.column}}return o.ok?g.jsx("div",{className:"lessmark-scrollbar h-full overflow-auto",children:g.jsx("pre",{className:"m-0 px-4 py-4 sm:px-6 sm:py-5 font-[var(--font-code)] text-[12px] sm:text-[13px] leading-[1.6] text-code-fg whitespace-pre",children:o.text})}):g.jsx("div",{className:"lessmark-scrollbar h-full overflow-auto px-4 py-4 sm:px-6 sm:py-5",children:g.jsxs("div",{className:"font-mono text-[13px] leading-[1.6] text-destructive",children:[g.jsx("div",{children:o.message}),g.jsxs("div",{className:"text-fg-faint mt-1",children:[De["playground.error-line"]||"line"," ",o.line,", ",De["playground.error-column"]||"column"," ",o.column]})]})})}function Nx(l){const s=["document"];for(const o of l.children)To(o,1,s);return s.join(`
`)}function To(l,s,o){const u="  ".repeat(s);let c=l.type;l.type==="heading"&&typeof l.level=="number"&&(c+=` h${l.level}`),l.name&&(c+=` ${l.name}`),l.text&&(c+=`  "${_m(l.text)}"`);const d=l.attrs?Object.keys(l.attrs):[];if(d.length>0&&(c+=` {${d.map(h=>`${h}=${JSON.stringify(l.attrs[h])}`).join(", ")}}`),o.push(u+c),Array.isArray(l.children))for(const h of l.children)To(h,s+1,o);if(Array.isArray(l.items)){for(const h of l.items)if(o.push("  ".repeat(s+1)+`item  "${_m(h.text??"")}"`),Array.isArray(h.children))for(const v of h.children)To(v,s+2,o)}}function _m(l){const s=l.replace(/\s+/g," ").trim();return s.length>80?s.slice(0,77)+"...":s}const Am=wo,ca=(l,s)=>De[l]||s;function Dx(l){const s=yn(l),o=s.children.findIndex(p=>p.type==="heading"),u=o>=0?s.children[o]:null,c=(u==null?void 0:u.type)==="heading"?u.text??"":"",d=o>=0?s.children.slice(o+1):s.children,h=[];let v=null,y=null;for(const p of d)if(p.type==="heading"&&p.level===2){v&&h.push(v);const w=p.text??"";v={slug:w.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),heading:w,intro:[],subsections:[]},y=null}else p.type==="heading"&&p.level===3&&v?(y={heading:p.text??"",nodes:[]},v.subsections.push(y)):v&&(y?y.nodes.push(p):v.intro.push(p));return v&&h.push(v),{heroTitle:c,sections:h}}function vp(l){return sp({type:"document",children:l})}function Lx(l){return vp([{type:"heading",level:2,text:l.heading},...l.intro,...l.subsections.flatMap(s=>[{type:"heading",level:3,text:s.heading},...s.nodes])])}function Ux(){const l=si(Ze.home()),{heroTitle:s,sections:o}=T.useMemo(()=>Dx(l),[l]),[u,c]=T.useState(Am);return g.jsxs("main",{className:"mx-auto max-w-[880px] px-4 sm:px-6 pb-16",children:[g.jsxs("section",{"data-hero":!0,className:"pt-10 sm:pt-16 pb-10 sm:pb-12 grid justify-items-center gap-6 sm:gap-7 text-center",children:[g.jsxs("div",{className:"flex flex-col items-center gap-1",children:[g.jsx("img",{src:"/lessmarklogowhitebackground.svg",alt:"",className:"size-[116px] sm:size-[140px] md:size-[180px]"}),g.jsx("span",{className:"font-sans font-bold text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.02em] text-fg",children:ca("header.brand","lessmark")})]}),g.jsx("h1",{className:"font-sans font-bold text-[clamp(28px,4vw,42px)] leading-[1.15] tracking-[-0.02em] max-w-[24ch] text-fg",children:g.jsx(Yx,{text:s})}),g.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] text-fg-muted",children:[g.jsx(_t,{to:"/docs/getting-started",className:"hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:ca("home.docs-link","getting started")}),g.jsx(_t,{to:"/playground",className:"hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:ca("home.playground-link","playground")})]})]}),g.jsx(Ar,{}),g.jsx("section",{className:"py-8",children:g.jsx("div",{className:"h-[620px] md:h-[460px]",children:g.jsx(Ko,{value:u,onChange:c,sample:Am,fullHeight:!0,previewToolbar:g.jsxs(_t,{to:"/playground",className:"text-fg-faint hover:text-fg transition-colors inline-flex items-center gap-1.5",children:[ca("home.open-playground","open full playground"),g.jsx(Nr,{className:"size-3"})]})})})}),o.map(d=>d.slug==="features"?g.jsxs("div",{children:[g.jsx(Ar,{}),g.jsx(Bx,{section:d})]},d.slug):g.jsxs("div",{children:[g.jsx(Ar,{}),g.jsx(Hx,{section:d})]},d.slug)),g.jsx(Ar,{}),g.jsxs("section",{className:"py-10",children:[g.jsx("h2",{className:"font-sans font-bold text-[20px] tracking-[-0.01em] text-fg mb-3",children:ca("home.next-heading","Next")}),g.jsxs(_t,{to:"/docs/getting-started",className:"group flex items-baseline gap-2 text-fg hover:text-fg",children:[g.jsx("span",{className:"text-[15px] underline underline-offset-4 decoration-fg-faint group-hover:decoration-fg",children:ca("home.next-link","Read the getting-started guide")}),g.jsx(Nr,{className:"size-3.5 text-fg-muted group-hover:text-fg transition-colors"})]}),g.jsx("p",{className:"text-[14px] text-fg-faint mt-1",children:ca("home.next-summary","install a package, write your first document")})]})]})}function Hx({section:l}){const s=T.useMemo(()=>Lx(l),[l]),o=T.useRef(null);return Zo(o,s),yp(o,s),g.jsx("article",{ref:o,className:"lessmark-output py-8",dangerouslySetInnerHTML:{__html:s}})}const jm=[yx,vx,bx];function Bx({section:l}){const s=T.useMemo(()=>l.subsections.map(o=>({heading:o.heading,html:vp(o.nodes)})),[l]);return g.jsx("section",{className:"py-10",children:g.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8",children:s.map((o,u)=>{const c=jm[u%jm.length];return g.jsx(qx,{icon:g.jsx(c,{className:"size-8 text-fg"}),heading:o.heading,html:o.html},o.heading)})})})}function qx({icon:l,heading:s,html:o}){const u=T.useRef(null);return Zo(u,o),g.jsxs("div",{className:"flex flex-col gap-2",children:[g.jsx("div",{className:"size-8 mb-1 flex items-center justify-start",children:l}),g.jsx("h3",{className:"font-sans font-bold text-[16px] tracking-[-0.01em] text-fg",children:s}),g.jsx("div",{ref:u,className:"lessmark-output text-[14px] [&>*]:!mt-0 [&_p]:!leading-[1.6]",dangerouslySetInnerHTML:{__html:o}})]})}function Yx({text:l}){const s="(and humans)",o=l.indexOf(s);return o<0?g.jsx(g.Fragment,{children:l}):g.jsxs(g.Fragment,{children:[l.slice(0,o),g.jsx("span",{className:"hero-accent",children:s}),l.slice(o+s.length)]})}function Ar(){return g.jsx("div",{"aria-hidden":!0,className:"my-2 h-px w-full bg-border-soft"})}function Gx(){return g.jsx("main",{className:"px-2 sm:px-3 pb-3 h-[calc(100svh-72px)] min-h-[620px] overflow-hidden",children:g.jsx(Ko,{initial:wo,sample:wo,fullHeight:!0})})}function Xx({children:l}){return g.jsxs("div",{className:"mx-auto max-w-[1080px] px-4 sm:px-6 py-8 sm:py-10 grid gap-8 md:gap-10 md:grid-cols-[220px_1fr]",children:[g.jsxs("aside",{className:"md:sticky md:top-20 md:self-start",children:[g.jsx("div",{className:"text-[12px] text-fg-faint mb-3",children:De["docs.sidebar-label"]||"Docs"}),g.jsx("nav",{className:"flex flex-wrap gap-x-4 gap-y-1 text-[14px] md:flex-col",children:Yt.map(s=>g.jsx(Do,{to:`/docs/${s.slug}`,className:({isActive:o})=>`py-1 transition-colors ${o?"text-fg font-semibold underline underline-offset-4 decoration-fg":"text-fg-muted hover:text-fg hover:underline underline-offset-4 decoration-fg-faint hover:decoration-fg"}`,children:s.title},s.slug))})]}),g.jsx("div",{className:"min-w-0",children:l})]})}function Qx(){var o;const[l,s]=T.useState(((o=Pl[0])==null?void 0:o.slug)??"markdown");return g.jsxs("section",{className:"mt-8",children:[g.jsx("div",{role:"tablist","aria-label":De["switching.source-format-label"]||"source format",className:"flex flex-wrap gap-1 border-b border-border-soft",children:Pl.map(u=>{const c=u.slug===l;return g.jsx("button",{role:"tab","aria-selected":c,onClick:()=>s(u.slug),className:`-mb-px px-4 py-2 text-[13px] font-mono border-b-2 transition-colors ${c?"border-fg text-fg":"border-transparent text-fg-muted hover:text-fg"}`,children:u.label},u.slug)})}),g.jsx("div",{className:"pt-6",children:Pl.map(u=>u.slug===l?g.jsx($x,{slug:u.slug},u.slug):null)})]})}function $x({slug:l}){const s=si(Ze.switching(l));return g.jsx(Jo,{source:s})}function Vx(){const{slug:l}=Xm();T.useEffect(()=>{window.scrollTo({top:0,behavior:"auto"})},[l]);const s=si(l?Ze.doc(l):"");if(!l)return g.jsx(Wa,{to:`/docs/${Yt[0].slug}`,replace:!0});if(!J1(l))return g.jsx(Wa,{to:`/docs/${Yt[0].slug}`,replace:!0});const u=Yt.findIndex(h=>h.slug===l),c=u>0?Yt[u-1]:null,d=u<Yt.length-1?Yt[u+1]:null;return g.jsxs(Xx,{children:[g.jsxs("article",{className:"max-w-[720px]",children:[g.jsx(Jo,{source:s}),l==="switching"?g.jsx(Qx,{}):null]}),g.jsxs("div",{className:"max-w-[720px] mt-12 pt-6 border-t border-border-soft flex flex-wrap justify-between gap-4 text-[14px]",children:[c?g.jsxs(_t,{to:`/docs/${c.slug}`,className:"text-fg-muted hover:text-fg transition-colors",children:[g.jsx("span",{className:"block text-[12px] text-fg-faint mb-1",children:De["docs.previous"]||"previous"}),c.title]}):g.jsx("span",{}),d?g.jsxs(_t,{to:`/docs/${d.slug}`,className:"text-fg-muted hover:text-fg transition-colors text-right inline-flex flex-col",children:[g.jsx("span",{className:"text-[12px] text-fg-faint mb-1",children:De["docs.next"]||"next"}),g.jsxs("span",{className:"inline-flex items-center gap-1",children:[d.title,g.jsx(Nr,{className:"size-3.5"})]})]}):g.jsx("span",{})]})]})}function Zx(){return g.jsxs("main",{className:"mx-auto max-w-[880px] px-4 sm:px-6 py-10 sm:py-12",children:[g.jsx("div",{className:"mb-10",children:g.jsx("h1",{className:"font-bold text-[clamp(32px,4.5vw,44px)] leading-[1.1] tracking-[-0.02em] text-fg",children:De["examples.index-heading"]||"Examples"})}),g.jsx("ul",{className:"flex flex-col",children:Qn.map(l=>g.jsx("li",{className:"border-t border-border-soft py-5",children:g.jsxs(_t,{to:`/examples/${l.slug}`,className:"group block",children:[g.jsx("h2",{className:"font-bold text-[18px] tracking-[-0.01em] text-fg group-hover:underline underline-offset-4 decoration-fg-faint group-hover:decoration-fg",children:l.title}),l.summary&&g.jsx("p",{className:"mt-1 text-[14px] leading-[1.55] text-fg-muted",children:l.summary}),g.jsxs("div",{className:"mt-1.5 text-[12px] text-fg-faint italic",children:[l.slug,".lmk"]})]})},l.slug))})]})}function Jx(){const{slug:l}=Xm();T.useEffect(()=>{window.scrollTo({top:0,behavior:"auto"})},[l]);const s=hp();if(!l)return g.jsx(Wa,{to:"/examples",replace:!0});const o=K1(l);if(!o)return g.jsx(Wa,{to:"/examples",replace:!0});const u=Ze.example(l),c=s.get(u),d=Qn.findIndex(y=>y.slug===l),h=d>0?Qn[d-1]:null,v=d<Qn.length-1?Qn[d+1]:null;return g.jsxs("main",{className:"px-2 sm:px-3 pb-3 h-[calc(100svh-72px)] min-h-[620px] overflow-hidden flex flex-col gap-2",children:[g.jsxs("div",{className:"flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[13px] shrink-0 px-1",children:[g.jsxs("div",{className:"flex flex-wrap items-baseline gap-x-3 gap-y-1",children:[g.jsxs(_t,{to:"/examples",className:"text-fg-muted hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:["← ",De["examples.back"]||"all examples"]}),g.jsxs("span",{className:"text-fg-faint italic",children:[o.slug,".lmk"]})]}),g.jsxs("div",{className:"flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1",children:[h?g.jsxs(_t,{to:`/examples/${h.slug}`,className:"text-fg-muted hover:text-fg transition-colors underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:["← ",h.slug]}):g.jsx("span",{}),v?g.jsxs(_t,{to:`/examples/${v.slug}`,className:"text-fg-muted hover:text-fg transition-colors inline-flex items-baseline gap-1 underline underline-offset-4 decoration-fg-faint hover:decoration-fg",children:[v.slug,g.jsx(Nr,{className:"size-3 self-center"})]}):g.jsx("span",{})]})]}),g.jsx("div",{className:"flex-1 min-h-0",children:g.jsx(Ko,{value:c,onChange:y=>s.set(u,y),sample:o.source,fullHeight:!0})})]})}function Kx(){const{pathname:l}=$t();return T.useEffect(()=>{window.scrollTo(0,0)},[l]),null}function Wx(){return g.jsxs(W1,{defaults:Z1,children:[g.jsx(Kx,{}),g.jsxs("div",{className:"min-h-screen flex flex-col",children:[g.jsx(P1,{}),g.jsx("div",{className:"flex-1",children:g.jsxs(Zv,{children:[g.jsx(Xn,{path:"/",element:g.jsx(Ux,{})}),g.jsx(Xn,{path:"/playground",element:g.jsx(Gx,{})}),g.jsx(Xn,{path:"/docs",element:g.jsx(Wa,{to:`/docs/${Yt[0].slug}`,replace:!0})}),g.jsx(Xn,{path:"/docs/:slug",element:g.jsx(Vx,{})}),g.jsx(Xn,{path:"/examples",element:g.jsx(Zx,{})}),g.jsx(Xn,{path:"/examples/:slug",element:g.jsx(Jx,{})}),g.jsx(Xn,{path:"*",element:g.jsx(Wa,{to:"/",replace:!0})})]})}),g.jsx(Ex,{})]})]})}Wy.createRoot(document.getElementById("root")).render(g.jsx(T.StrictMode,{children:g.jsx(yb,{children:g.jsx(Wx,{})})}));export{Rx as _};
