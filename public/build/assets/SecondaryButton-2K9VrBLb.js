import{c as z,j as M}from"./app-BqfSY66W.js";var S={exports:{}},g={};/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var j;function _(){if(j)return g;j=1;var r=z();function d(t,u){return t===u&&(t!==0||1/t===1/u)||t!==t&&u!==u}var c=typeof Object.is=="function"?Object.is:d,v=r.useSyncExternalStore,m=r.useRef,E=r.useEffect,W=r.useMemo,V=r.useDebugValue;return g.useSyncExternalStoreWithSelector=function(t,u,b,y,a){var o=m(null);if(o.current===null){var i={hasValue:!1,value:null};o.current=i}else i=o.current;o=W(function(){function p(e){if(!x){if(x=!0,s=e,e=y(e),a!==void 0&&i.hasValue){var n=i.value;if(a(n,e))return l=n}return l=e}if(n=l,c(s,e))return n;var R=y(e);return a!==void 0&&a(n,R)?(s=e,n):(s=e,l=R)}var x=!1,s,l,h=b===void 0?null:b;return[function(){return p(u())},h===null?void 0:function(){return p(h())}]},[u,b,y,a]);var f=v(t,o[0],o[1]);return E(function(){i.hasValue=!0,i.value=f},[f]),V(f),f},g}var w;function D(){return w||(w=1,S.exports=_()),S.exports}var U=D();function k({type:r="button",className:d="",disabled:c,children:v,...m}){return M.jsx("button",{...m,type:r,className:`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 ${c&&"opacity-25"} `+d,disabled:c,children:v})}export{k as S,U as w};
