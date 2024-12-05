(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();var ee,zt;class be extends Error{}be.prototype.name="InvalidTokenError";function ri(s){return decodeURIComponent(atob(s).replace(/(.)/g,(e,t)=>{let r=t.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function ii(s){let e=s.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ri(e)}catch{return atob(e)}}function gr(s,e){if(typeof s!="string")throw new be("Invalid token specified: must be a string");e||(e={});const t=e.header===!0?0:1,r=s.split(".")[t];if(typeof r!="string")throw new be(`Invalid token specified: missing part #${t+1}`);let i;try{i=ii(r)}catch(o){throw new be(`Invalid token specified: invalid base64 for part #${t+1} (${o.message})`)}try{return JSON.parse(i)}catch(o){throw new be(`Invalid token specified: invalid json for part #${t+1} (${o.message})`)}}const si="mu:context",pt=`${si}:change`;class oi{constructor(e,t){this._proxy=ni(e,t)}get value(){return this._proxy}set value(e){Object.assign(this._proxy,e)}apply(e){this.value=e(this.value)}}class bt extends HTMLElement{constructor(e){super(),console.log("Constructing context provider",this),this.context=new oi(e,this),this.style.display="contents"}attach(e){return this.addEventListener(pt,e),e}detach(e){this.removeEventListener(pt,e)}}function ni(s,e){return new Proxy(s,{get:(r,i,o)=>{if(i==="then")return;const n=Reflect.get(r,i,o);return console.log(`Context['${i}'] => `,n),n},set:(r,i,o,n)=>{const c=s[i];console.log(`Context['${i.toString()}'] <= `,o);const a=Reflect.set(r,i,o,n);if(a){let h=new CustomEvent(pt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(h,{property:i,oldValue:c,value:o}),e.dispatchEvent(h)}else console.log(`Context['${i}] was not set to ${o}`);return a}})}function ai(s,e){const t=fr(e,s);return new Promise((r,i)=>{if(t){const o=t.localName;customElements.whenDefined(o).then(()=>r(t))}else i({context:e,reason:`No provider for this context "${e}:`})})}function fr(s,e){const t=`[provides="${s}"]`;if(!e||e===document.getRootNode())return;const r=e.closest(t);if(r)return r;const i=e.getRootNode();if(i instanceof ShadowRoot)return fr(s,i.host)}class ci extends CustomEvent{constructor(e,t="mu:message"){super(t,{bubbles:!0,composed:!0,detail:e})}}function mr(s="mu:message"){return(e,...t)=>e.dispatchEvent(new ci(t,s))}class yt{constructor(e,t,r="service:message",i=!0){this._pending=[],this._context=t,this._update=e,this._eventType=r,this._running=i}attach(e){e.addEventListener(this._eventType,t=>{t.stopPropagation();const r=t.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(e=>this.process(e)))}apply(e){this._context.apply(e)}consume(e){this._running?this.process(e):(console.log(`Queueing ${this._eventType} message`,e),this._pending.push(e))}process(e){console.log(`Processing ${this._eventType} message`,e);const t=this._update(e,this.apply.bind(this));t&&t(this._context.value)}}function li(s){return e=>({...e,...s})}const gt="mu:auth:jwt",vr=class br extends yt{constructor(e,t){super((r,i)=>this.update(r,i),e,br.EVENT_TYPE),this._redirectForLogin=t}update(e,t){switch(e[0]){case"auth/signin":const{token:r,redirect:i}=e[1];return t(di(r)),at(i);case"auth/signout":return t(ui()),at(this._redirectForLogin);case"auth/redirect":return at(this._redirectForLogin,{next:window.location.href});default:const o=e[0];throw new Error(`Unhandled Auth message "${o}"`)}}};vr.EVENT_TYPE="auth:message";let yr=vr;const wr=mr(yr.EVENT_TYPE);function at(s,e={}){if(!s)return;const t=window.location.href,r=new URL(s,t);return Object.entries(e).forEach(([i,o])=>r.searchParams.set(i,o)),()=>{console.log("Redirecting to ",s),window.location.assign(r)}}class hi extends bt{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const e=ae.authenticateFromLocalStorage();super({user:e,token:e.authenticated?e.token:void 0})}connectedCallback(){new yr(this.context,this.redirect).attach(this)}}class ne{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(e){return e.authenticated=!1,e.username="anonymous",localStorage.removeItem(gt),e}}class ae extends ne{constructor(e){super();const t=gr(e);console.log("Token payload",t),this.token=e,this.authenticated=!0,this.username=t.username}static authenticate(e){const t=new ae(e);return localStorage.setItem(gt,e),t}static authenticateFromLocalStorage(){const e=localStorage.getItem(gt);return e?ae.authenticate(e):new ne}}function di(s){return li({user:ae.authenticate(s),token:s})}function ui(){return s=>{const e=s.user;return{user:e&&e.authenticated?ne.deauthenticate(e):e,token:""}}}function pi(s){return s.authenticated?{Authorization:`Bearer ${s.token||"NO_TOKEN"}`}:{}}function gi(s){return s.authenticated?gr(s.token||""):{}}const Y=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ae,Provider:hi,User:ne,dispatch:wr,headers:pi,payload:gi},Symbol.toStringTag,{value:"Module"}));function ft(s,e,t){const r=s.target,i=new CustomEvent(e,{bubbles:!0,composed:!0,detail:t});console.log(`Relaying event from ${s.type}:`,i),r.dispatchEvent(i),s.stopPropagation()}function It(s,e="*"){return s.composedPath().find(r=>{const i=r;return i.tagName&&i.matches(e)})}function Qe(s,...e){const t=s.map((i,o)=>o?[e[o-1],i]:[i]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(t),r}const fi=new DOMParser;function N(s,...e){const t=e.map(c),r=s.map((a,h)=>{if(h===0)return[a];const p=t[h-1];return p instanceof Node?[`<ins id="mu-html-${h-1}"></ins>`,a]:[p,a]}).flat().join(""),i=fi.parseFromString(r,"text/html"),o=i.head.childElementCount?i.head.children:i.body.children,n=new DocumentFragment;return n.replaceChildren(...o),t.forEach((a,h)=>{if(a instanceof Node){const p=n.querySelector(`ins#mu-html-${h}`);if(p){const d=p.parentNode;d==null||d.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${h}`)}}),n;function c(a,h){if(a===null)return"";switch(typeof a){case"string":return Ft(a);case"bigint":case"boolean":case"number":case"symbol":return Ft(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const p=new DocumentFragment,d=a.map(c);return p.replaceChildren(...d),p}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ft(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Pe(s,e={mode:"open"}){const t=s.attachShadow(e),r={template:i,styles:o};return r;function i(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&t.appendChild(a.content.cloneNode(!0)),r}function o(...n){t.adoptedStyleSheets=n}}ee=class extends HTMLElement{constructor(){super(),this._state={},Pe(this).template(ee.template).styles(ee.styles),this.addEventListener("change",s=>{const e=s.target;if(e){const t=e.name,r=e.value;t&&(this._state[t]=r)}}),this.form&&this.form.addEventListener("submit",s=>{s.preventDefault(),ft(s,"mu-form:submit",this._state)})}set init(s){this._state=s||{},mi(this._state,this)}get form(){var s;return(s=this.shadowRoot)==null?void 0:s.querySelector("form")}},ee.template=N`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,ee.styles=Qe`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function mi(s,e){const t=Object.entries(s);for(const[r,i]of t){const o=e.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!i;break;case"date":n.value=i.toISOString().substr(0,10);break;default:n.value=i;break}}}return s}const $r=class _r extends yt{constructor(e){super((t,r)=>this.update(t,r),e,_r.EVENT_TYPE)}update(e,t){switch(e[0]){case"history/navigate":{const{href:r,state:i}=e[1];t(bi(r,i));break}case"history/redirect":{const{href:r,state:i}=e[1];t(yi(r,i));break}}}};$r.EVENT_TYPE="history:message";let wt=$r;class Dt extends bt{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",e=>{const t=vi(e);if(t){const r=new URL(t.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",e),e.preventDefault(),$t(t,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",e=>{console.log("Popstate",e.state),this.context.value={location:document.location,state:e.state}})}connectedCallback(){new wt(this.context).attach(this)}}function vi(s){const e=s.currentTarget,t=r=>r.tagName=="A"&&r.href;if(s.button===0)if(s.composed){const i=s.composedPath().find(t);return i||void 0}else{for(let r=s.target;r;r===e?null:r.parentElement)if(t(r))return r;return}}function bi(s,e={}){return history.pushState(e,"",s),()=>({location:document.location,state:history.state})}function yi(s,e={}){return history.replaceState(e,"",s),()=>({location:document.location,state:history.state})}const $t=mr(wt.EVENT_TYPE),wi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Dt,Provider:Dt,Service:wt,dispatch:$t},Symbol.toStringTag,{value:"Module"}));class J{constructor(e,t){this._effects=[],this._target=e,this._contextLabel=t}observe(e=void 0){return new Promise((t,r)=>{if(this._provider){const i=new Ht(this._provider,e);this._effects.push(i),t(i)}else ai(this._target,this._contextLabel).then(i=>{const o=new Ht(i,e);this._provider=i,this._effects.push(o),i.attach(n=>this._handleChange(n)),t(o)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(e){console.log("Received change event for observers",e,this._effects),e.stopPropagation(),this._effects.forEach(t=>t.runEffect())}}class Ht{constructor(e,t){this._provider=e,t&&this.setEffect(t)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(e){this._effectFn=e,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const xr=class Ar extends HTMLElement{constructor(){super(),this._state={},this._user=new ne,this._authObserver=new J(this,"blazing:auth"),Pe(this).template(Ar.template),this.form&&this.form.addEventListener("submit",e=>{if(e.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const t=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$i(i,this._state,t,this.authorization).then(o=>ge(o,this)).then(o=>{const n=`mu-rest-form:${r}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:t,[r]:o,url:i}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:t,error:o,url:i,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",e=>{const t=e.target;if(t){const r=t.name,i=t.value;r&&(this._state[r]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(e){this._state=e||{},ge(this._state,this)}get form(){var e;return(e=this.shadowRoot)==null?void 0:e.querySelector("form")}get authorization(){var e;return(e=this._user)!=null&&e.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:e})=>{e&&(this._user=e,this.src&&!this.isNew&&qt(this.src,this.authorization).then(t=>{this._state=t,ge(t,this)}))})}attributeChangedCallback(e,t,r){switch(e){case"src":this.src&&r&&r!==t&&!this.isNew&&qt(this.src,this.authorization).then(i=>{this._state=i,ge(i,this)});break;case"new":r&&(this._state={},ge({},this));break}}};xr.observedAttributes=["src","new","action"];xr.template=N`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function qt(s,e){return fetch(s,{headers:e}).then(t=>{if(t.status!==200)throw`Status: ${t.status}`;return t.json()}).catch(t=>console.log(`Failed to load form from ${s}:`,t))}function ge(s,e){const t=Object.entries(s);for(const[r,i]of t){const o=e.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!i;break;default:n.value=i;break}}}return s}function $i(s,e,t="PUT",r={}){return fetch(s,{method:t,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(e)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const kr=class Er extends yt{constructor(e,t){super(t,e,Er.EVENT_TYPE,!1)}};kr.EVENT_TYPE="mu:message";let Sr=kr;class _i extends bt{constructor(e,t,r){super(t),this._user=new ne,this._updateFn=e,this._authObserver=new J(this,r)}connectedCallback(){const e=new Sr(this.context,(t,r)=>this._updateFn(t,r,this._user));e.attach(this),this._authObserver.observe(({user:t})=>{console.log("Store got auth",t),t&&(this._user=t),e.start()})}}const xi=Object.freeze(Object.defineProperty({__proto__:null,Provider:_i,Service:Sr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=globalThis,_t=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xt=Symbol(),Bt=new WeakMap;let Pr=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(_t&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=Bt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Bt.set(t,e))}return e}toString(){return this.cssText}};const Ai=s=>new Pr(typeof s=="string"?s:s+"",void 0,xt),ki=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new Pr(t,s,xt)},Ei=(s,e)=>{if(_t)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),i=Ue.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}},Vt=_t?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return Ai(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Si,defineProperty:Pi,getOwnPropertyDescriptor:Ci,getOwnPropertyNames:Ri,getOwnPropertySymbols:Oi,getPrototypeOf:Mi}=Object,ce=globalThis,Wt=ce.trustedTypes,Ti=Wt?Wt.emptyScript:"",Yt=ce.reactiveElementPolyfillSupport,ye=(s,e)=>s,ze={toAttribute(s,e){switch(e){case Boolean:s=s?Ti:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},At=(s,e)=>!Si(s,e),Jt={attribute:!0,type:String,converter:ze,reflect:!1,hasChanged:At};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ce.litPropertyMetadata??(ce.litPropertyMetadata=new WeakMap);let re=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Jt){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Pi(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=Ci(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const c=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Jt}static _$Ei(){if(this.hasOwnProperty(ye("elementProperties")))return;const e=Mi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ye("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ye("properties"))){const t=this.properties,r=[...Ri(t),...Oi(t)];for(const i of r)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(Vt(i))}else e!==void 0&&t.push(Vt(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ei(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EC(e,t){var r;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){const n=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:ze).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){var r;const i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){const n=i.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:ze;this._$Em=o,this[o]=c.fromAttribute(t,n.type),this._$Em=null}}requestUpdate(e,t,r){if(e!==void 0){if(r??(r=this.constructor.getPropertyOptions(e)),!(r.hasChanged??At)(this[e],t))return;this.P(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,r){this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$EO)==null||e.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(r)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}};re.elementStyles=[],re.shadowRootOptions={mode:"open"},re[ye("elementProperties")]=new Map,re[ye("finalized")]=new Map,Yt==null||Yt({ReactiveElement:re}),(ce.reactiveElementVersions??(ce.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie=globalThis,Fe=Ie.trustedTypes,Kt=Fe?Fe.createPolicy("lit-html",{createHTML:s=>s}):void 0,Cr="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Rr="?"+M,Ni=`<${Rr}>`,K=document,_e=()=>K.createComment(""),xe=s=>s===null||typeof s!="object"&&typeof s!="function",kt=Array.isArray,Li=s=>kt(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ct=`[ 	
\f\r]`,fe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qt=/-->/g,Gt=/>/g,q=RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Zt=/'/g,Xt=/"/g,Or=/^(?:script|style|textarea|title)$/i,Ui=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),me=Ui(1),le=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),er=new WeakMap,V=K.createTreeWalker(K,129);function Mr(s,e){if(!kt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Kt!==void 0?Kt.createHTML(e):e}const ji=(s,e)=>{const t=s.length-1,r=[];let i,o=e===2?"<svg>":e===3?"<math>":"",n=fe;for(let c=0;c<t;c++){const a=s[c];let h,p,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===fe?p[1]==="!--"?n=Qt:p[1]!==void 0?n=Gt:p[2]!==void 0?(Or.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=q):p[3]!==void 0&&(n=q):n===q?p[0]===">"?(n=i??fe,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?q:p[3]==='"'?Xt:Zt):n===Xt||n===Zt?n=q:n===Qt||n===Gt?n=fe:(n=q,i=void 0);const u=n===q&&s[c+1].startsWith("/>")?" ":"";o+=n===fe?a+Ni:d>=0?(r.push(h),a.slice(0,d)+Cr+a.slice(d)+M+u):a+M+(d===-2?c:u)}return[Mr(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};let mt=class Tr{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,n=0;const c=e.length-1,a=this.parts,[h,p]=ji(e,t);if(this.el=Tr.createElement(h,r),V.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=V.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Cr)){const l=p[n++],u=i.getAttribute(d).split(M),g=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:g[2],strings:u,ctor:g[1]==="."?Ii:g[1]==="?"?Fi:g[1]==="@"?Di:Ge}),i.removeAttribute(d)}else d.startsWith(M)&&(a.push({type:6,index:o}),i.removeAttribute(d));if(Or.test(i.tagName)){const d=i.textContent.split(M),l=d.length-1;if(l>0){i.textContent=Fe?Fe.emptyScript:"";for(let u=0;u<l;u++)i.append(d[u],_e()),V.nextNode(),a.push({type:2,index:++o});i.append(d[l],_e())}}}else if(i.nodeType===8)if(i.data===Rr)a.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(M,d+1))!==-1;)a.push({type:7,index:o}),d+=M.length-1}o++}}static createElement(e,t){const r=K.createElement("template");return r.innerHTML=e,r}};function he(s,e,t=s,r){var i,o;if(e===le)return e;let n=r!==void 0?(i=t.o)==null?void 0:i[r]:t.l;const c=xe(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(s),n._$AT(s,t,r)),r!==void 0?(t.o??(t.o=[]))[r]=n:t.l=n),n!==void 0&&(e=he(s,n._$AS(s,e.values),n,r)),e}class zi{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=((e==null?void 0:e.creationScope)??K).importNode(t,!0);V.currentNode=i;let o=V.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new Ce(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new Hi(o,this,e)),this._$AV.push(h),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=V.nextNode(),n++)}return V.currentNode=K,i}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Ce{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this.v}constructor(e,t,r,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=he(this,e,t),xe(e)?e===$||e==null||e===""?(this._$AH!==$&&this._$AR(),this._$AH=$):e!==this._$AH&&e!==le&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Li(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==$&&xe(this._$AH)?this._$AA.nextSibling.data=e:this.T(K.createTextNode(e)),this._$AH=e}$(e){var t;const{values:r,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=mt.createElement(Mr(i.h,i.h[0]),this.options)),i);if(((t=this._$AH)==null?void 0:t._$AD)===o)this._$AH.p(r);else{const n=new zi(o,this),c=n.u(this.options);n.p(r),this.T(c),this._$AH=n}}_$AC(e){let t=er.get(e.strings);return t===void 0&&er.set(e.strings,t=new mt(e)),t}k(e){kt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const o of e)i===t.length?t.push(r=new Ce(this.O(_e()),this.O(_e()),this,this.options)):r=t[i],r._$AI(o),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this.v=e,(t=this._$AP)==null||t.call(this,e))}}class Ge{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(e,t=this,r,i){const o=this.strings;let n=!1;if(o===void 0)e=he(this,e,t,0),n=!xe(e)||e!==this._$AH&&e!==le,n&&(this._$AH=e);else{const c=e;let a,h;for(e=o[0],a=0;a<o.length-1;a++)h=he(this,c[r+a],t,a),h===le&&(h=this._$AH[a]),n||(n=!xe(h)||h!==this._$AH[a]),h===$?e=$:e!==$&&(e+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!i&&this.j(e)}j(e){e===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ii extends Ge{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===$?void 0:e}}class Fi extends Ge{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==$)}}class Di extends Ge{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=he(this,e,t,0)??$)===le)return;const r=this._$AH,i=e===$&&r!==$||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==$&&(r===$||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Hi{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){he(this,e)}}const tr=Ie.litHtmlPolyfillSupport;tr==null||tr(mt,Ce),(Ie.litHtmlVersions??(Ie.litHtmlVersions=[])).push("3.2.0");const qi=(s,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let i=r._$litPart$;if(i===void 0){const o=(t==null?void 0:t.renderBefore)??null;r._$litPart$=i=new Ce(e.insertBefore(_e(),o),o,void 0,t??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let oe=class extends re{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=qi(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this.o)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.o)==null||e.setConnected(!1)}render(){return le}};oe._$litElement$=!0,oe.finalized=!0,(zt=globalThis.litElementHydrateSupport)==null||zt.call(globalThis,{LitElement:oe});const rr=globalThis.litElementPolyfillSupport;rr==null||rr({LitElement:oe});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bi={attribute:!0,type:String,converter:ze,reflect:!1,hasChanged:At},Vi=(s=Bi,e,t)=>{const{kind:r,metadata:i}=t;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),o.set(t.name,s),r==="accessor"){const{name:n}=t;return{set(c){const a=e.get.call(this);e.set.call(this,c),this.requestUpdate(n,a,s)},init(c){return c!==void 0&&this.P(n,void 0,s),c}}}if(r==="setter"){const{name:n}=t;return function(c){const a=this[n];e.call(this,c),this.requestUpdate(n,a,s)}}throw Error("Unsupported decorator location: "+r)};function Nr(s){return(e,t)=>typeof t=="object"?Vi(s,e,t):((r,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(i,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lr(s){return Nr({...s,state:!0,attribute:!1})}function Wi(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function Yi(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ur={};(function(s){var e=function(){var t=function(d,l,u,g){for(u=u||{},g=d.length;g--;u[d[g]]=l);return u},r=[1,9],i=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,u,g,m,f,y,rt){var A=y.length-1;switch(f){case 1:return new m.Root({},[y[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new m.Literal({value:y[A]});break;case 7:this.$=new m.Splat({name:y[A]});break;case 8:this.$=new m.Param({name:y[A]});break;case 9:this.$=new m.Optional({},[y[A-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},{1:[2,2]},t(c,[2,4]),t(c,[2,5]),t(c,[2,6]),t(c,[2,7]),t(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:i,14:o,15:n},t(c,[2,10]),t(c,[2,11]),t(c,[2,12]),{1:[2,1]},t(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:i,14:o,15:n},t(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,u){if(u.recoverable)this.trace(l);else{let g=function(m,f){this.message=m,this.hash=f};throw g.prototype=Error,new g(l,u)}},parse:function(l){var u=this,g=[0],m=[null],f=[],y=this.table,rt="",A=0,Lt=0,Zr=2,Ut=1,Xr=f.slice.call(arguments,1),w=Object.create(this.lexer),D={yy:{}};for(var it in this.yy)Object.prototype.hasOwnProperty.call(this.yy,it)&&(D.yy[it]=this.yy[it]);w.setInput(l,D.yy),D.yy.lexer=w,D.yy.parser=this,typeof w.yylloc>"u"&&(w.yylloc={});var st=w.yylloc;f.push(st);var ei=w.options&&w.options.ranges;typeof D.yy.parseError=="function"?this.parseError=D.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ti=function(){var X;return X=w.lex()||Ut,typeof X!="number"&&(X=u.symbols_[X]||X),X},x,H,k,ot,Z={},Ne,P,jt,Le;;){if(H=g[g.length-1],this.defaultActions[H]?k=this.defaultActions[H]:((x===null||typeof x>"u")&&(x=ti()),k=y[H]&&y[H][x]),typeof k>"u"||!k.length||!k[0]){var nt="";Le=[];for(Ne in y[H])this.terminals_[Ne]&&Ne>Zr&&Le.push("'"+this.terminals_[Ne]+"'");w.showPosition?nt="Parse error on line "+(A+1)+`:
`+w.showPosition()+`
Expecting `+Le.join(", ")+", got '"+(this.terminals_[x]||x)+"'":nt="Parse error on line "+(A+1)+": Unexpected "+(x==Ut?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(nt,{text:w.match,token:this.terminals_[x]||x,line:w.yylineno,loc:st,expected:Le})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+H+", token: "+x);switch(k[0]){case 1:g.push(x),m.push(w.yytext),f.push(w.yylloc),g.push(k[1]),x=null,Lt=w.yyleng,rt=w.yytext,A=w.yylineno,st=w.yylloc;break;case 2:if(P=this.productions_[k[1]][1],Z.$=m[m.length-P],Z._$={first_line:f[f.length-(P||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(P||1)].first_column,last_column:f[f.length-1].last_column},ei&&(Z._$.range=[f[f.length-(P||1)].range[0],f[f.length-1].range[1]]),ot=this.performAction.apply(Z,[rt,Lt,A,D.yy,k[1],m,f].concat(Xr)),typeof ot<"u")return ot;P&&(g=g.slice(0,-1*P*2),m=m.slice(0,-1*P),f=f.slice(0,-1*P)),g.push(this.productions_[k[1]][0]),m.push(Z.$),f.push(Z._$),jt=y[g[g.length-2]][g[g.length-1]],g.push(jt);break;case 3:return!0}}return!0}},h=function(){var d={EOF:1,parseError:function(u,g){if(this.yy.parser)this.yy.parser.parseError(u,g);else throw new Error(u)},setInput:function(l,u){return this.yy=u||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var u=l.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var u=l.length,g=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===m.length?this.yylloc.first_column:0)+m[m.length-g.length].length-g[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),u=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+u+"^"},test_match:function(l,u){var g,m,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),m=l[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],g=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var y in f)this[y]=f[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,u,g,m;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),y=0;y<f.length;y++)if(g=this._input.match(this.rules[f[y]]),g&&(!u||g[0].length>u[0].length)){if(u=g,m=y,this.options.backtrack_lexer){if(l=this.test_match(g,f[y]),l!==!1)return l;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(l=this.test_match(u,f[m]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(u,g,m,f){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=h;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p}();typeof Yi<"u"&&(s.parser=e,s.Parser=e.Parser,s.parse=function(){return e.parse.apply(e,arguments)})})(Ur);function te(s){return function(e,t){return{displayName:s,props:e,children:t||[]}}}var jr={Root:te("Root"),Concat:te("Concat"),Literal:te("Literal"),Splat:te("Splat"),Param:te("Param"),Optional:te("Optional")},zr=Ur.parser;zr.yy=jr;var Ji=zr,Ki=Object.keys(jr);function Qi(s){return Ki.forEach(function(e){if(typeof s[e]>"u")throw new Error("No handler defined for "+e.displayName)}),{visit:function(e,t){return this.handlers[e.displayName].call(this,e,t)},handlers:s}}var Ir=Qi,Gi=Ir,Zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Fr(s){this.captures=s.captures,this.re=s.re}Fr.prototype.match=function(s){var e=this.re.exec(s),t={};if(e)return this.captures.forEach(function(r,i){typeof e[i+1]>"u"?t[r]=void 0:t[r]=decodeURIComponent(e[i+1])}),t};var Xi=Gi({Concat:function(s){return s.children.reduce((function(e,t){var r=this.visit(t);return{re:e.re+r.re,captures:e.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(s){return{re:s.props.value.replace(Zi,"\\$&"),captures:[]}},Splat:function(s){return{re:"([^?]*?)",captures:[s.props.name]}},Param:function(s){return{re:"([^\\/\\?]+)",captures:[s.props.name]}},Optional:function(s){var e=this.visit(s.children[0]);return{re:"(?:"+e.re+")?",captures:e.captures}},Root:function(s){var e=this.visit(s.children[0]);return new Fr({re:new RegExp("^"+e.re+"(?=\\?|$)"),captures:e.captures})}}),es=Xi,ts=Ir,rs=ts({Concat:function(s,e){var t=s.children.map((function(r){return this.visit(r,e)}).bind(this));return t.some(function(r){return r===!1})?!1:t.join("")},Literal:function(s){return decodeURI(s.props.value)},Splat:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Param:function(s,e){return e[s.props.name]?e[s.props.name]:!1},Optional:function(s,e){var t=this.visit(s.children[0],e);return t||""},Root:function(s,e){e=e||{};var t=this.visit(s.children[0],e);return t?encodeURI(t):!1}}),is=rs,ss=Ji,os=es,ns=is;Re.prototype=Object.create(null);Re.prototype.match=function(s){var e=os.visit(this.ast),t=e.match(s);return t||!1};Re.prototype.reverse=function(s){return ns.visit(this.ast,s)};function Re(s){var e;if(this?e=this:e=Object.create(Re.prototype),typeof s>"u")throw new Error("A route spec is required");return e.spec=s,e.ast=ss.parse(s),e}var as=Re,cs=as,ls=cs;const hs=Wi(ls);var ds=Object.defineProperty,Dr=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&ds(e,t,i),i};const Hr=class extends oe{constructor(e,t,r=""){super(),this._cases=[],this._fallback=()=>me` <h1>Not Found</h1> `,this._cases=e.map(i=>({...i,route:new hs(i.path)})),this._historyObserver=new J(this,t),this._authObserver=new J(this,r)}connectedCallback(){this._historyObserver.observe(({location:e})=>{console.log("New location",e),e&&(this._match=this.matchRoute(e))}),this._authObserver.observe(({user:e})=>{this._user=e}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),me` <main>${(()=>{const t=this._match;if(t){if("view"in t)return this._user?t.auth&&t.auth!=="public"&&this._user&&!this._user.authenticated?(wr(this,"auth/redirect"),me` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",t.params,t.query),t.view(t.params||{},t.query)):me` <h1>Authenticating</h1> `;if("redirect"in t){const r=t.redirect;if(typeof r=="string")return this.redirect(r),me` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(e){e.has("_match")&&this.requestUpdate()}matchRoute(e){const{search:t,pathname:r}=e,i=new URLSearchParams(t),o=r+t;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:r,params:c,query:i}}}redirect(e){$t(this,"history/redirect",{href:e})}};Hr.styles=ki`
    :host,
    main {
      display: contents;
    }
  `;let De=Hr;Dr([Lr()],De.prototype,"_user");Dr([Lr()],De.prototype,"_match");const us=Object.freeze(Object.defineProperty({__proto__:null,Element:De,Switch:De},Symbol.toStringTag,{value:"Module"})),qr=class Br extends HTMLElement{constructor(){if(super(),Pe(this).template(Br.template),this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name='actuator']");e&&e.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};qr.template=N`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let ps=qr;const gs=Object.freeze(Object.defineProperty({__proto__:null,Element:ps},Symbol.toStringTag,{value:"Module"})),Vr=class vt extends HTMLElement{constructor(){super(),this._array=[],Pe(this).template(vt.template).styles(vt.styles),this.addEventListener("input-array:add",e=>{e.stopPropagation(),this.append(Wr("",this._array.length))}),this.addEventListener("input-array:remove",e=>{e.stopPropagation(),this.removeClosestItem(e.target)}),this.addEventListener("change",e=>{e.stopPropagation();const t=e.target;if(t&&t!==this){const r=new Event("change",{bubbles:!0}),i=t.value,o=t.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=i,this.dispatchEvent(r)}}}),this.addEventListener("click",e=>{It(e,"button.add")?ft(e,"input-array:add"):It(e,"button.remove")&&ft(e,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(e){this._array=Array.isArray(e)?e:[e],fs(this._array,this)}removeClosestItem(e){const t=e.closest("label");if(console.log("Removing closest item:",t,e),t){const r=Array.from(this.children).indexOf(t);this._array.splice(r,1),t.remove()}}};Vr.template=N`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Vr.styles=Qe`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function fs(s,e){e.replaceChildren(),s.forEach((t,r)=>e.append(Wr(t)))}function Wr(s,e){const t=s===void 0?N`<input />`:N`<input value="${s}" />`;return N`
    <label>
      ${t}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function S(s){return Object.entries(s).map(([e,t])=>{customElements.get(e)||customElements.define(e,t)}),customElements}var ms=Object.defineProperty,vs=Object.getOwnPropertyDescriptor,bs=(s,e,t,r)=>{for(var i=vs(e,t),o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&ms(e,t,i),i};class Oe extends oe{constructor(e){super(),this._pending=[],this._observer=new J(this,e)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var e;super.connectedCallback(),(e=this._observer)==null||e.observe().then(t=>{console.log("View effect (initial)",this,t),this._context=t.context,this._pending.length&&this._pending.forEach(([r,i])=>{console.log("Dispatching queued event",i,r),r.dispatchEvent(i)}),t.setEffect(()=>{var r;if(console.log("View effect",this,t,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(e,t=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:e});this._context?(console.log("Dispatching message event",r),t.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([t,r]))}ref(e){return this.model?this.model[e]:void 0}}bs([Nr()],Oe.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const je=globalThis,Et=je.ShadowRoot&&(je.ShadyCSS===void 0||je.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,St=Symbol(),ir=new WeakMap;let Yr=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==St)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Et&&e===void 0){const r=t!==void 0&&t.length===1;r&&(e=ir.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ir.set(t,e))}return e}toString(){return this.cssText}};const ys=s=>new Yr(typeof s=="string"?s:s+"",void 0,St),O=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new Yr(t,s,St)},ws=(s,e)=>{if(Et)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const r=document.createElement("style"),i=je.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,s.appendChild(r)}},sr=Et?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return ys(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$s,defineProperty:_s,getOwnPropertyDescriptor:xs,getOwnPropertyNames:As,getOwnPropertySymbols:ks,getPrototypeOf:Es}=Object,L=globalThis,or=L.trustedTypes,Ss=or?or.emptyScript:"",lt=L.reactiveElementPolyfillSupport,we=(s,e)=>s,He={toAttribute(s,e){switch(e){case Boolean:s=s?Ss:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},Pt=(s,e)=>!$s(s,e),nr={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:Pt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),L.litPropertyMetadata??(L.litPropertyMetadata=new WeakMap);class ie extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=nr){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&_s(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=xs(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const c=i==null?void 0:i.call(this);o.call(this,n),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??nr}static _$Ei(){if(this.hasOwnProperty(we("elementProperties")))return;const e=Es(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(we("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(we("properties"))){const t=this.properties,r=[...As(t),...ks(t)];for(const i of r)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const i of r)t.unshift(sr(i))}else e!==void 0&&t.push(sr(e));return t}static _$Eu(e,t){const r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ws(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostConnected)==null?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EC(e,t){var o;const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:He).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){var o;const r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:He;this._$Em=i,this[i]=c.fromAttribute(t,n.type),this._$Em=null}}requestUpdate(e,t,r){if(e!==void 0){if(r??(r=this.constructor.getPropertyOptions(e)),!(r.hasChanged??Pt)(this[e],t))return;this.P(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(e,t,r){this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$Em!==e&&(this._$Ej??(this._$Ej=new Set)).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[o,n]of i)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(i=>{var o;return(o=i.hostUpdate)==null?void 0:o.call(i)}),this.update(t)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&(this._$Ej=this._$Ej.forEach(t=>this._$EC(t,this[t]))),this._$EU()}updated(e){}firstUpdated(e){}}ie.elementStyles=[],ie.shadowRootOptions={mode:"open"},ie[we("elementProperties")]=new Map,ie[we("finalized")]=new Map,lt==null||lt({ReactiveElement:ie}),(L.reactiveElementVersions??(L.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $e=globalThis,qe=$e.trustedTypes,ar=qe?qe.createPolicy("lit-html",{createHTML:s=>s}):void 0,Jr="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Kr="?"+T,Ps=`<${Kr}>`,Q=document,Ae=()=>Q.createComment(""),ke=s=>s===null||typeof s!="object"&&typeof s!="function",Ct=Array.isArray,Cs=s=>Ct(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ht=`[ 	
\f\r]`,ve=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,cr=/-->/g,lr=/>/g,B=RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),hr=/'/g,dr=/"/g,Qr=/^(?:script|style|textarea|title)$/i,Rs=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),v=Rs(1),de=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ur=new WeakMap,W=Q.createTreeWalker(Q,129);function Gr(s,e){if(!Ct(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ar!==void 0?ar.createHTML(e):e}const Os=(s,e)=>{const t=s.length-1,r=[];let i,o=e===2?"<svg>":e===3?"<math>":"",n=ve;for(let c=0;c<t;c++){const a=s[c];let h,p,d=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===ve?p[1]==="!--"?n=cr:p[1]!==void 0?n=lr:p[2]!==void 0?(Qr.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=B):p[3]!==void 0&&(n=B):n===B?p[0]===">"?(n=i??ve,d=-1):p[1]===void 0?d=-2:(d=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?B:p[3]==='"'?dr:hr):n===dr||n===hr?n=B:n===cr||n===lr?n=ve:(n=B,i=void 0);const u=n===B&&s[c+1].startsWith("/>")?" ":"";o+=n===ve?a+Ps:d>=0?(r.push(h),a.slice(0,d)+Jr+a.slice(d)+T+u):a+T+(d===-2?c:u)}return[Gr(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]};class Ee{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,n=0;const c=e.length-1,a=this.parts,[h,p]=Os(e,t);if(this.el=Ee.createElement(h,r),W.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=W.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Jr)){const l=p[n++],u=i.getAttribute(d).split(T),g=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:g[2],strings:u,ctor:g[1]==="."?Ts:g[1]==="?"?Ns:g[1]==="@"?Ls:Ze}),i.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:o}),i.removeAttribute(d));if(Qr.test(i.tagName)){const d=i.textContent.split(T),l=d.length-1;if(l>0){i.textContent=qe?qe.emptyScript:"";for(let u=0;u<l;u++)i.append(d[u],Ae()),W.nextNode(),a.push({type:2,index:++o});i.append(d[l],Ae())}}}else if(i.nodeType===8)if(i.data===Kr)a.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:o}),d+=T.length-1}o++}}static createElement(e,t){const r=Q.createElement("template");return r.innerHTML=e,r}}function ue(s,e,t=s,r){var n,c;if(e===de)return e;let i=r!==void 0?(n=t._$Co)==null?void 0:n[r]:t._$Cl;const o=ke(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=i:t._$Cl=i),i!==void 0&&(e=ue(s,i._$AS(s,e.values),i,r)),e}class Ms{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=((e==null?void 0:e.creationScope)??Q).importNode(t,!0);W.currentNode=i;let o=W.nextNode(),n=0,c=0,a=r[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new Me(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new Us(o,this,e)),this._$AV.push(h),a=r[++c]}n!==(a==null?void 0:a.index)&&(o=W.nextNode(),n++)}return W.currentNode=Q,i}p(e){let t=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Me{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ue(this,e,t),ke(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==de&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Cs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&ke(this._$AH)?this._$AA.nextSibling.data=e:this.T(Q.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=Ee.createElement(Gr(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(t);else{const n=new Ms(i,this),c=n.u(this.options);n.p(t),this.T(c),this._$AH=n}}_$AC(e){let t=ur.get(e.strings);return t===void 0&&ur.set(e.strings,t=new Ee(e)),t}k(e){Ct(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const o of e)i===t.length?t.push(r=new Me(this.O(Ae()),this.O(Ae()),this,this.options)):r=t[i],r._$AI(o),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(e,t=this,r,i){const o=this.strings;let n=!1;if(o===void 0)e=ue(this,e,t,0),n=!ke(e)||e!==this._$AH&&e!==de,n&&(this._$AH=e);else{const c=e;let a,h;for(e=o[0],a=0;a<o.length-1;a++)h=ue(this,c[r+a],t,a),h===de&&(h=this._$AH[a]),n||(n=!ke(h)||h!==this._$AH[a]),h===_?e=_:e!==_&&(e+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ts extends Ze{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}}class Ns extends Ze{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}}class Ls extends Ze{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=ue(this,e,t,0)??_)===de)return;const r=this._$AH,i=e===_&&r!==_||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==_&&(r===_||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Us{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){ue(this,e)}}const dt=$e.litHtmlPolyfillSupport;dt==null||dt(Ee,Me),($e.litHtmlVersions??($e.litHtmlVersions=[])).push("3.2.1");const js=(s,e,t)=>{const r=(t==null?void 0:t.renderBefore)??e;let i=r._$litPart$;if(i===void 0){const o=(t==null?void 0:t.renderBefore)??null;r._$litPart$=i=new Me(e.insertBefore(Ae(),o),o,void 0,t??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let C=class extends ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=js(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return de}};var pr;C._$litElement$=!0,C.finalized=!0,(pr=globalThis.litElementHydrateSupport)==null||pr.call(globalThis,{LitElement:C});const ut=globalThis.litElementPolyfillSupport;ut==null||ut({LitElement:C});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const zs=O`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
  }
  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
`,Is={styles:zs},Fs=Qe`
:root {
  --primary-color: #007bff;
  --background-color: white;
  --secondary-color: #f8f9fa;
  --experience-box-color: white;
  --text-color: #333;
  --accent-color: #ffc107;
  --font-primary: 'Roboto', serif;
  --font-secondary: 'Roboto', sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  --font-family-primary: 'Roboto', sans-serif;
  --font-family-secondary: 'Poppins', serif;
  --base-font-size: 16px;
  --space-sm: 10px;
  --space-md: 20px;
  --space-lg: 40px;

  --input-background-light: #ffffff;
  --input-border-light: #ccc;
  --input-text-light: #333;

  --input-background-dark: #1e1e1e;
  --input-border-dark: #555;
  --input-text-dark: #f0f0f0;
}

body.dark-mode {
  --background-color: #333;
  --secondary-color: #1e1e1e;
  --experience-box-color: #242424;
  --text-color: #e0e0e0;
  --primary-color: #90caf9;
  --accent-color: #ffd54f;

  --input-background-light: #1e1e1e;
  --input-border-light: #555;
  --input-text-light: #f0f0f0;
}
`,Ds={styles:Fs};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hs={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:Pt},qs=(s=Hs,e,t)=>{const{kind:r,metadata:i}=t;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),o.set(t.name,s),r==="accessor"){const{name:n}=t;return{set(c){const a=e.get.call(this);e.set.call(this,c),this.requestUpdate(n,a,s)},init(c){return c!==void 0&&this.P(n,void 0,s),c}}}if(r==="setter"){const{name:n}=t;return function(c){const a=this[n];e.call(this,c),this.requestUpdate(n,a,s)}}throw Error("Unsupported decorator location: "+r)};function Rt(s){return(e,t)=>typeof t=="object"?qs(s,e,t):((r,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(i,o):void 0})(s,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(s){return Rt({...s,state:!0,attribute:!1})}const se=class se extends HTMLElement{constructor(){super(),Pe(this).template(se.template).styles(se.styles)}static get observedAttributes(){return["value"]}attributeChangedCallback(e,t,r){e==="value"&&this.renderStars(parseFloat(r||"0"))}connectedCallback(){this.renderStars(parseFloat(this.getAttribute("value")||"0"))}renderStars(e){var n;const t=(n=this.shadowRoot)==null?void 0:n.querySelector(".stars");if(!t)return;t.innerHTML="";const r=Math.floor(e),i=e%1!==0,o=5-Math.ceil(e);for(let c=0;c<r;c++)t.innerHTML+=`
          <svg class="icon">
            <use href="/assets/icons/sprite.svg#starfill"></use>
          </svg>
        `;i&&(t.innerHTML+=`
          <svg class="icon gold half-star">
            <use href="/assets/icons/sprite.svg#starfill"></use>
          </svg>
        `);for(let c=0;c<o;c++)t.innerHTML+=`
          <svg class="icon">
            <use href="/assets/icons/sprite.svg#star"></use>
          </svg>
        `}};se.template=N`
    <template>
      <div class="stars"></div>
    </template>
  `,se.styles=Qe`
    .stars {
      display: inline-flex;
      align-items: center;
      gap: 0.2em;
    }

    .icon {
      height: 1.5em;
      width: 1.5em;
      fill: var(--star-color, gold);
    }

    .half-star {
        fill: var(--star-color);
        clip-path: inset(0 50% 0 0);
    }
  `;let pe=se;S({"star-rating":pe});var Bs=Object.defineProperty,Vs=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&Bs(e,t,i),i};const Be=class Be extends C{handleCardClick(e){window.history.pushState({},"",`/app/experience/${e}`),window.dispatchEvent(new Event("popstate"))}render(){if(!this.experience)return v`<div class="skeleton-card"></div>`;const{id:e,title:t,location:r,category:i,rating:o,description:n,image:c}=this.experience,a={Adventure:"#FF4500",Cultural:"#8A2BE2","Nature and Wildlife":"#228B22","Family-Friendly":"#FFD700",Luxury:"#DAA520","Budget-Friendly":"#4682B4"};return v`
      <div
        class="experience-card"
        role="button"
        tabindex="0"
        @click=${()=>this.handleCardClick(e)}
      >
        <img
          src="${`../assets/experiences/${e}.jpg`}"
          onerror="this.src='../assets/experiences/default.jpg'"
          alt="Image of ${t}"
          class="experience-image"
          loading="lazy"
        />
        <div class="details">
          <h3>${t}</h3>
          <div class="rating">
            <span class="rating-value">${Number(o).toFixed(1)}</span>
            <star-rating value="${Number(o).toFixed(1)}"></star-rating>
          </div>
          <div
            class="category-badge"
            style="background-color: ${a[i]||"#CCC"}"
          >
            ${i}
          </div>
          <p><strong>Location:</strong> ${r}</p>
          <p class="description">
            <strong>Description:</strong> ${n}
          </p>
        </div>
      </div>
    `}};Be.uses=[pe],Be.styles=O`
    :host {
      color: var(--text-color);
      display: block;
      font-family: "Roboto", sans-serif;
    }

    .experience-card {
      display: flex;
      flex-direction: column;
      background-color: var(--experience-box-color);
      border: 1px solid var(--secondary-color);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      width: 350px;
      height: 450px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .experience-card:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .experience-card:focus {
      outline: 2px solid var(--focus-color);
      outline-offset: 2px;
    }

    .experience-card:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .experience-image {
      width: 100%;
      height: 50%;
      object-fit: cover;
    }

    .details {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }

    .details h3 {
      margin: 0 0 0;
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .details p {
      margin: 0 0 var(--space-xs);
      font-size: 0.9rem;
      color: var(--text-color);
    }

    .details .description {
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Limit to 2 lines */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .category-badge {
      display: inline-block;
      background-color: var(--accent-color);
      color: var(--background-color);
      padding: 0.2rem 0.4rem;
      border-radius: var(--border-radius-sm);
      font-size: 0.85rem;
      width: fit-content;
      text-transform: uppercase;
      text-color: var(--background-color);
      font-weight: bold;
    }

    .rating {
      display: flex;
      align-items: center; /* Ensures stars and number are vertically aligned */
      gap: var(--space-sm); /* Add space between number and stars */
      font-size: 1rem; /* Ensure consistent font size */
      color: var(--text-color);
    }

    .rating-value {
      font-weight: bold; /* Emphasize the numeric rating */
      color: var(--primary-color);
      line-height: 1; /* Ensure the number doesn't affect alignment */
    }

    star-rating {
      display: inline-flex;
      align-items: center;
      line-height: 1;
    }

  `;let Se=Be;Vs([Rt({type:Object})],Se.prototype,"experience");S({"experience-card":Se});var Ws=Object.defineProperty,Te=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&Ws(e,t,i),i};const Ve=class Ve extends C{constructor(){super(...arguments),this._authObserver=new J(this,"blazing:auth"),this._user=new Y.User,this.authenticated=!1,this.experiences=[],this.filteredExperiences=[],this.searchQuery="",this.rankOptions="rating"}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:e})=>{e?(this._user=e,this.authenticated=!0):this.authenticated=!1}),this.fetchExperiences()}fetchExperiences(){fetch("/api/experiences",{headers:Y.headers(this._user)}).then(e=>{if(e.ok)return e.json();throw new Error(`Failed to fetch experiences: ${e.status}`)}).then(e=>{this.experiences=e||[],this.filteredExperiences=[...this.experiences],this.updateFilters()}).catch(e=>console.error("Error fetching experiences:",e))}updateFilters(){const e=this.searchQuery.toLowerCase();let t=this.experiences.filter(r=>r.title.toLowerCase().includes(e)||r.location.toLowerCase().includes(e));t.sort((r,i)=>this.rankOptions==="rating"?i.rating-r.rating:this.rankOptions==="title"?r.title.localeCompare(i.title):0),this.filteredExperiences=t}handleSearchInput(e){const t=e.target;this.searchQuery=t.value,this.updateFilters()}handleRankChange(e){const t=e.target;this.rankOptions=t.value,this.updateFilters()}addExperience(e){window.history.pushState({},"","/app/add-experience"),window.dispatchEvent(new Event("popstate"))}renderExperienceCards(){return v`
      <div class="experience-cards">
        ${this.filteredExperiences.map(e=>v`<experience-card .experience=${e}></experience-card>`)}
      </div>
    `}render(){return v`
      <main class="home-container">
        <section class="hero">
          <div class="hero-content">
            <div class="hero-left">
              <h1>
                Discover Your <span class="highlight"> Next Adventure</span>
              </h1>
              <p>
                Explore unforgettable travel experiences, share your adventures, and
                inspire others to uncover the beauty of the world.
              </p>
              <div class="search-bar">
                <input
                  type="text"
                  placeholder="Search by experience or location..."
                  .value=${this.searchQuery}
                  @input=${this.handleSearchInput}
                  aria-label="Search"
                />
                <button>
                  <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
                      <path
                        d="M10 2a8 8 0 105.27 14.32l4.6 4.6a1 1 0 001.41-1.41l-4.6-4.6A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <div class="filter-bar">
                <label for="sort">Sort By:</label>
                <select id="sort" class="sort-dropdown" @change=${this.handleRankChange}>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
          <div class="image-grid">
            <img src="../assets/hero/adventure.jpg" alt="Adventure Destination" />
            <img src="../assets/hero/luxury2.jpg" alt="Beach Getaway"  />
            <img src="../assets/hero/temple2.jpg" alt="Culinary Experience" />
            <img src="../assets/hero/food.jpg" alt="Waterfall Adventure" />
            <img src="../assets/hero/nature.jpg" alt="Culinary Delights" />
          </div>
        </section>
        <div>
          <button class="add-experience-button" @click=${this.addExperience}>+</button>
          <div class="tooltip">Add an Experience</div>
        </div>
        <section class="experience-list">
          <p>Explore the most highly rated experiences from around the world</p>
          <div class="experience-cards">
            ${this.renderExperienceCards()}
          </div>
        </section>
      </main>
    `}};Ve.uses=[Se],Ve.styles=[Is.styles,Ds.styles,O`
      :host {
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: "Poppins", "Roboto", sans-serif;
      }

      main {
        padding: var(--space-lg) 20px;
        max-width: 1200px;
        margin: 0 auto;
        display:
      }

      /* Hero Section */
      .hero {
        display: grid;
        grid-template-columns: calc(50% - .75rem) calc(50% - .75rem);
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        margin-bottom: 2rem;
      }

      .hero-content {
        flex: 1;
        max-width: none;
      }

      .hero-left {
        padding-top: 2rem;
      }
      .hero-content h1 {
        font-family: "Poppins", sans-serif;
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--primary-color);
        line-height: 1.2;
        margin-bottom: 1rem;
      }

      .hero-content h1 .highlight {
        color: #28a99e;
      }

      .hero-content p {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 1rem 0rem;
        color: var(--text-secondary-color);
        line-height: 1.8;
        margin-bottom: 2rem;
      }

      .sort-dropdown {
        border: 1px solid var(--text-color);
        border-radius: var(--border-radius);
        font-size: 0.9rem;
        background: var(--secondary-color);
        color: var(--text-color);
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
        border-radius: 1rem;
        background-color: var(--secondary-color);
      }

      .search-bar input {
        flex-grow: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        color: var(--text-color);
        background-color: var(--secondary-color);
      }

      .search-bar button {
        background-color: var(--primary-color);
        color: white;
        cursor: pointer;
        border-color: var(--primary-color);
        margin-color: var(--primary-color);
        border-radius: 1.75rem;
      }

      .filter-bar {
        margin-top: var(--space-md);
        display: flex;
        gap: var(--space-sm);
      }

      .filter-bar label {
        font-size: 1rem;
        color: var(--text-secondary-color);
      }

      .image-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 columns for the images */
        grid-template-rows: auto;
        grid-template-areas:
          "nothing empty four"
          "nothing two four"
          "one two four"
          "one three five"
          "one three five"
          "controls three five";
        gap: 1rem;
      }

      .image-grid img:nth-child(1) {
        grid-area: one; /* Top-left */
      }

      .image-grid img:nth-child(2) {
        grid-area: two; /* Top-center */
      }

      .image-grid img:nth-child(3) {
        grid-area: three; /* Top-right */
      }

      .image-grid img:nth-child(4) {
        grid-area: four; /* Bottom-left */
      }

      .image-grid img:nth-child(5) {
        grid-area: five; /* Bottom-center */
      }

      .image-grid img {
        width: 100%;
        height: stretch;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .experience-list {
        text-align: center;
      }

      .experience-list p {
        font-family: "Poppins", sans-serif;
        font-size: 1.2rem;
        color: var(--text-secondary-color);
        margin-bottom: var(--space-sm);
      }

      .experience-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .add-experience-button {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }

      .add-experience-button:hover {
        background-color: #28a99e; /* Primary color on hover */
      }

      .tooltip {
        position: absolute;
        bottom: 4.5rem; /* Adjust this to position above the button */
        right: 0; /* Align with the button */
        background-color: rgba(0, 0, 0, 0.8); /* Dark background for the tooltip */
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem; /* Smaller font for tooltip */
        white-space: nowrap;
        opacity: 0; /* Hidden by default */
        visibility: hidden; /* Prevent interaction when hidden */
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .add-experience-button:hover + .tooltip {
        opacity: 1; /* Show the tooltip on hover */
        visibility: visible; /* Make it interactive */
      }

      .experience-cards {
        display: grid;
        text-align: left;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
        margin: 0;
        padding: 0;
        border: none;
        widdth: 100%;
        box-sizing: border-box;
      }
    `];let U=Ve;Te([b()],U.prototype,"authenticated");Te([b()],U.prototype,"experiences");Te([b()],U.prototype,"filteredExperiences");Te([b()],U.prototype,"searchQuery");Te([b()],U.prototype,"rankOptions");var Ys=Object.defineProperty,Js=Object.getOwnPropertyDescriptor,Xe=(s,e,t,r)=>{for(var i=r>1?void 0:r?Js(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&Ys(e,t,i),i};const We=class We extends Oe{constructor(){super("blazing:model"),this.reviews=[],this.sortOption="rating"}get experience(){return this.model.experience}connectedCallback(){super.connectedCallback(),this.fetchReviews(this.experienceId)}attributeChangedCallback(e,t,r){super.attributeChangedCallback(e,t,r),e==="experience-id"&&t!==r&&r&&(this.dispatchMessage(["experience/select",{experienceId:r}]),this.fetchReviews(r))}async fetchReviews(e){try{const t=await fetch(`/api/reviews/${e}`);t.ok?(this.reviews=await t.json(),this.sortReviews()):this.reviews=[]}catch(t){console.error("Error fetching reviews:",t),this.reviews=[]}}calculateAverageRating(e){if(!this.reviews.length)return 0;const t=this.reviews.reduce((r,i)=>r+(i[e]||0),0);return Number((t/this.reviews.length).toFixed(1))}handleSaveExperience(){var e;console.log("Save functionality triggered for",(e=this.experience)==null?void 0:e.id)}navigateBack(){window.history.pushState({},"","/app"),window.dispatchEvent(new Event("popstate"))}sortReviews(){this.sortOption==="rating"?this.reviews=[...this.reviews].sort((e,t)=>t.overallRating-e.overallRating):this.sortOption==="recent"&&(this.reviews=[...this.reviews].sort((e,t)=>new Date(t.updatedAt).getTime()-new Date(e.updatedAt).getTime()))}handleSortChange(e){const t=e.target;this.sortOption=t.value,this.sortReviews()}render(){if(!this.experience)return v`<p>Loading experience details...</p>`;const e={Adventure:"#FF4500",Cultural:"#8A2BE2","Nature and Wildlife":"#228B22","Family-Friendly":"#FFD700",Luxury:"#DAA520","Budget-Friendly":"#4682B4"},{id:t,title:r,category:i,location:o,rating:n=0,description:c}=this.experience,a=this.calculateAverageRating("valueForMoney"),h=this.calculateAverageRating("accessibility"),p=this.calculateAverageRating("uniqueness");return v`
      <main class="experience-page">
        <!-- Navigation Buttons -->
        <div class="navigation">
          <button
            class="back-button"
            @click=${()=>this.navigateBack()}
          >
            ⬅ Back
          </button>
        </div>

        <section class="experience-header">
          <div class="header-content">
            <div class="header-text">
              <h1>${r}</h1>
              <div class="rating">
                <span class="rating-value">${Number(n).toFixed(1)}</span>
                <star-rating value="${Number(n).toFixed(1)}"></star-rating>
              </div>
              <div class="header-sub">
                <div
                  class="category-badge"
                  style="background-color: ${e[i]||"#CCC"}"
                >
                  ${i}
                </div>
                <span class="location">${o}</span>
              </div>
              <div class="description">${c}</div>
              <div class="ratings-breakdown">
                <div class="rating-item">
                  <strong>Value for Money:</strong>
                  <star-rating value="${a}"></star-rating>
                </div>
                <div class="rating-item">
                  <strong>Accessibility:</strong>
                  <star-rating value="${h}"></star-rating>
                </div>
                <div class="rating-item">
                  <strong>Uniqueness:</strong>
                  <star-rating value="${p}"></star-rating>
                </div>
              </div>
            </div>
          </div>
          <div class="header-image">
            <img
              src="/assets/experiences/${t}.jpg"
              alt="${r}"
              onerror="this.src='/assets/default.jpg'"
            />
            <button class="image-icon" @click=${this.handleSaveExperience}>
              <svg class="icon">
                <use href="/assets/icons/sprite.svg#heart"></use>
              </svg>
            </button>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews">
          <h2>Reviews</h2>
          <div class="reviews-header">
            <button class="feedback-button">Leave Feedback</button>
            <select
              class="sort-dropdown"
              @change=${d=>this.handleSortChange(d)}
            >
              <option value="rating">Sort by: Highest Rating</option>
              <option value="recent">Sort by: Most Recent</option>
            </select>
          </div>
          <div class="review-grid">
            ${this.renderReviews()}
          </div>
        </section>
      </main>
    `}renderReviews(){return this.reviews.length?this.reviews.map(e=>v`
        <div class="review-card">
          <div class="review-header">
            <p class="review-user"><strong>${e.user}</strong></p>
            <p class="review-date">${new Date(e.updatedAt).toLocaleDateString()}</p>
          </div>
          <star-rating value="${e.overallRating||0}"></star-rating>
          <p class="review-comment">${e.comment||"No comment provided."}</p>
          <div class="review-ratings">
            <div class="rating-item">
              <span>💰 Value:</span>
              <star-rating value="${e.valueForMoney||0}"></star-rating>
            </div>
            <div class="rating-item">
              <span>♿ Accessibility:</span>
              <star-rating value="${e.accessibility||0}"></star-rating>
            </div>
            <div class="rating-item">
              <span>🌟 Uniqueness:</span>
              <star-rating value="${e.uniqueness||0}"></star-rating>
            </div>
          </div>
        </div>
      `):v`<p>No reviews available for this experience.</p>`}};We.uses=[pe],We.styles=O`
    :host {
      font-family: var(--font-family-primary);
      background-color: var(--background-color);
    }

    .experience-page {
      background: var(--background-color);
      background-color: var(--background-color);
      color: var(--text-color);
      padding: var(--space-lg);
      font-family: var(--font-family-primary);
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Navigation Buttons */
    .navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .back-button,
    .save-button {
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .back-button:hover,
    .save-button:hover {
      background-color: var(--accent-color);
      transform: translateY(-2px);
    }

    .experience-header {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      gap: var(--space-lg);
      align-items: center; /* Align items to the top */
      margin-bottom: var(--space-lg);
    }

    .header-image {
      position: relative;
      grid-column: 2; /* Image stays in the right column */
      grid-row: 1; /* Align it with the first row */
      max-height: 100%; /* Prevents it from exceeding the container height */
      display: flex; /* Ensures content inside aligns properly */
      align-items: center;
      justify-content: center;
      overflow: hidden; /* Ensures no overflow */
    }

    .header-image img {
      width: 100%; /* Makes the image span the container's width */
      max-height: 100%; /* Constrains the image's height to its container */
      object-fit: cover; /* Maintains aspect ratio and crops excess */
      border-radius: var(--border-radius);
    }

    .header-content {
      grid-column: 1; /* Ensure it stays in the left column */
      grid-row: 1; /* Position it at the top of the grid */
      display: flex;
      flex-direction: column;
      gap: var(--space-md); /* Add spacing between header elements */
    }

    .header-text h1 {
      font-size: 2.5rem;
      margin-bottom: 0;
      color: var(--primary-color);
    }

    .header-sub {
      display: flex;
      gap: var(--space-sm);
      font-size: 0.9rem;
      color: var(--text-color);
      margin-bottom: var(--space-md);
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-color);
      margin-bottom: var(--space-md);
    }


    .image-icon {
      position: absolute; /* Positions the button relative to the parent container */
      top: 10px; /* Distance from the top of the image */
      right: 10px; /* Distance from the right of the image */
      background-color: var(--background-color); /* Adds a semi-transparent background */
      color: white; /* Icon color */
      border: none; /* Removes default button border */
      border-radius: 50%; /* Makes it circular */
      cursor: pointer; /* Pointer cursor for interaction */
      block-size: 2rem;
      inline-size: 2rem;
      padding: 7px;
      display: flex; /* Flexbox to center content */
      align-items: center; /* Centers vertically */
      justify-content: center; /* Centers horizontally */
      transition: background-color 0.3s ease; /* Adds hover effect */
    }

    .image-icon:hover {
      background-color: rgba(0, 0, 0, 0.8); /* Darkens background on hover */
    }

    .icon {
      height: 24px;
      width: 24px;
      fill: #e61e43;
      font-weight: bold;
    }

    .category {
      background: var(--primary-color);
      color: var(--background-color);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
    }

    .location {
      color: var(--text-color);
      font-weight: bold;
      font-size: 1rem;
      padding: 0.2rem 0.4rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 1.2rem;
      margin-top: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .rating-categories {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 0.9rem;
    }

    .rating-value {
      font-weight: bold;
      color: var(--primary-color);
      line-height: 1.2; /* Ensures alignment with the star-rating */
    }

    star-rating {
      display: inline-flex;
      align-items: center;
      line-height: 1.2;
    }

    /* Ratings Breakdown */
    .ratings-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-md);
    }

    .ratings-breakdown div {
      flex: 1;
      min-width: 200px;
      text-align: left;
    }

    /* Reviews Section */
    .reviews h2 {
      font-size: 1.8rem;
      margin-bottom: var(--space-md);
      color: var(--primary-color);
    }

    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .feedback-button {
      background: var(--primary-color);
      color: var(--background-color);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--border-radius);
      border: none;
      font-size: 1rem;
      cursor: pointer;
    }

    .feedback-button:hover {
      background: var(--accent-color);
    }

    .sort-dropdown {
      padding: var(--space-sm);
      border: 1px solid var(--text-color);
      border-radius: var(--border-radius);
      font-size: 0.9rem;
      background: var(--background-color);
      color: var(--text-color);
    }

    .category-badge {
      display: inline-block;
      background-color: var(--accent-color);
      color: var(--background-color);
      padding: 0.2rem 0.4rem;
      border-radius: var(--border-radius-sm);
      font-size: 0.85rem;
      width: fit-content;
      text-transform: uppercase;
      font-weight: bold;
    }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-md);
    }

    .review-card {
      background: var(--secondary-color);
      padding: var(--space-md);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
    }

    .review-card:hover {
      transform: scale(1.023);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-user {
      font-weight: bold;
    }

    .review-date {
      font-size: 0.8rem;
      color: #777;
      margin-left: auto; /* Aligns date to the right */
    }

    .review-comment {
      margin: var(--space-sm) 0;
      margin-bottom: var(--space-md);
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-color);
    }

    .review-ratings {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .rating-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
  `;let j=We;Xe([Rt({type:String,attribute:"experience-id"})],j.prototype,"experienceId",2);Xe([b()],j.prototype,"reviews",2);Xe([b()],j.prototype,"sortOption",2);Xe([b()],j.prototype,"experience",1);S({"experience-view":j});var Ks=Object.defineProperty,Ot=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&Ks(e,t,i),i};const Tt=class Tt extends C{constructor(){super(...arguments),this.username="",this.password="",this.errorMessage=""}handleLogin(e){e.preventDefault(),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)window.location.href="/app";else throw new Error("Invalid credentials")}).catch(t=>{this.errorMessage=t.message})}render(){return v`
      <main class="login-page">
        <form @submit=${this.handleLogin}>
          <h1>Login</h1>
          ${this.errorMessage?v`<p class="error-message">${this.errorMessage}</p>`:""}
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            .value=${this.username}
            @input=${e=>this.username=e.target.value}
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            .value=${this.password}
            @input=${e=>this.password=e.target.value}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account?
            <a href="/register" @click=${this.navigateToRegister}>Register</a>
          </p>
        </form>
      </main>
    `}navigateToRegister(e){e.preventDefault(),window.history.pushState({},"","/register"),window.dispatchEvent(new Event("popstate"))}};Tt.styles=O`
    /* Add your CSS styles here */
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--background-color);
    }
    form {
      background-color: var(--secondary-color);
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      text-align: center;
      width: 100%;
      max-width: 400px;
    }
    input {
      width: 100%;
      padding: 0.8rem;
      margin: 0.5rem 0;
      border: 1px solid var(--input-border);
      border-radius: var(--border-radius);
    }
    button {
      width: 100%;
      padding: 0.8rem;
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: var(--accent-color);
    }
    .error-message {
      color: var(--error-color);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `;let z=Tt;Ot([b()],z.prototype,"username");Ot([b()],z.prototype,"password");Ot([b()],z.prototype,"errorMessage");S({"login-page":z});var Qs=Object.defineProperty,et=(s,e,t,r)=>{for(var i=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=n(e,t,i)||i);return i&&Qs(e,t,i),i};const Nt=class Nt extends C{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage=""}handleRegister(e){if(e.preventDefault(),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)window.location.href="/login";else throw new Error("Failed to register")}).catch(t=>{this.errorMessage=t.message})}render(){return v`
      <main class="register-page">
        <form @submit=${this.handleRegister}>
          <h1>Register</h1>
          ${this.errorMessage?v`<p class="error-message">${this.errorMessage}</p>`:""}
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            .value=${this.username}
            @input=${e=>this.username=e.target.value}
            required
          />
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            .value=${this.password}
            @input=${e=>this.password=e.target.value}
            required
          />
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            .value=${this.confirmPassword}
            @input=${e=>this.confirmPassword=e.target.value}
            required
          />
          <button type="submit">Register</button>
          <p>
            Already have an account?
            <a href="/login" @click=${this.navigateToLogin}>Login</a>
          </p>
        </form>
      </main>
    `}navigateToLogin(e){e.preventDefault(),window.history.pushState({},"","/login"),window.dispatchEvent(new Event("popstate"))}};Nt.styles=O`
    /* Add your CSS styles here */
    .register-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--background-color);
    }
    form {
      background-color: var(--secondary-color);
      padding: 2rem;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      text-align: center;
      width: 100%;
      max-width: 400px;
    }
    input {
      width: 100%;
      padding: 0.8rem;
      margin: 0.5rem 0;
      border: 1px solid var(--input-border);
      border-radius: var(--border-radius);
    }
    button {
      width: 100%;
      padding: 0.8rem;
      background-color: var(--primary-color);
      color: var(--background-color);
      border: none;
      border-radius: var(--border-radius);
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: var(--accent-color);
    }
    .error-message {
      color: var(--error-color);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `;let R=Nt;et([b()],R.prototype,"username");et([b()],R.prototype,"password");et([b()],R.prototype,"confirmPassword");et([b()],R.prototype,"errorMessage");S({"register-page":R});var Gs=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,F=(s,e,t,r)=>{for(var i=r>1?void 0:r?Zs(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&Gs(e,t,i),i};const Ye=class Ye extends Oe{constructor(){super("blazing:model"),this.isLogin=!1,this.name="",this.username="",this.password="",this.confirmPassword="",this.errorMessage=""}get isAuthenticated(){return this.model.isAuthenticated}get user(){return this.model.user}handleAuth(e){if(e.preventDefault(),this.isLogin){const t={username:this.username,password:this.password};this.dispatchMessage(["auth/login",t])}else if(this.password===this.confirmPassword){const t={username:this.username,name:this.name,password:this.password};this.dispatchMessage(["auth/register",t])}else this.errorMessage="Passwords do not match!"}handleLogout(){this.dispatchMessage(["auth/logout",{}])}toggleView(){this.isLogin=!this.isLogin,this.clearForm()}clearForm(){this.username="",this.name="",this.password="",this.confirmPassword="",this.errorMessage=""}render(){var e;return this.isAuthenticated?v`
        <main class="page">
            <div class="auth-container">
                <p>Welcome, ${(e=this.user)==null?void 0:e.username}! You are already logged in.</p>
                <button @click=${this.handleLogout}>Logout</button>
            </div>
        </main>`:v`
      <main class="page">
        <div class="auth-container">
          ${this.isLogin?this.renderLoginView():this.renderRegisterView()}
        </div>
      </main>
    `}renderLoginView(){return v`
      <div class="login_form_container">
        <div class="left">
          <div class="form_container">
            <h1>Sign in and explore!</h1>
            <form @submit=${this.handleAuth}>
              ${this.errorMessage?v`<p class="error-message">${this.errorMessage}</p>`:""}
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                .value=${this.username}
                @input=${e=>this.username=e.target.value}
                required
              />
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                .value=${this.password}
                @input=${e=>this.password=e.target.value}
                required
              />
              <div class="button-wrapper">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
        <div class="right">
          <h1>New Here?</h1>
          <p>Create an account to start exploring trips!</p>
          <button @click=${this.toggleView} class="change-button">Register Now</button>
        </div>
      </div>
    `}renderRegisterView(){return v`
      <div class="login_form_container">
        <div class="right2">
          <h1>Already a Member?</h1>
          <p>Sign in to continue exploring trips!</p>
          <button @click=${this.toggleView} class="change-button">Sign In Now</button>
        </div>
        <div class="left2">
          <div class="form_container">
            <h1>Create Your Account</h1>
            <form @submit=${this.handleAuth}>
              ${this.errorMessage?v`<p class="error-message">${this.errorMessage}</p>`:""}
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                .value=${this.username}
                @input=${e=>this.username=e.target.value}
                required
              />
              <label for="username">Name</label>
              <input
                type="text"
                id="username"
                .value=${this.name}
                @input=${e=>this.name=e.target.value}
                required
              />
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                .value=${this.password}
                @input=${e=>this.password=e.target.value}
                required
              />
              <label for="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                .value=${this.confirmPassword}
                @input=${e=>this.confirmPassword=e.target.value}
                required
              />
              <div class="button-wrapper">
                <button type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `}};Ye.uses=[z,R],Ye.styles=O`
    :host {
        overflow: hidden;
    }

    .page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 3.5rem - 1px);
      overflow: hidden;
      background-color: var(--background-color);
    }

    .login_form_container {
      height: 520px;
      width: 920px;
      display: flex;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      background-color: var(--experience-box-color);
    }

    .left,
    .right {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .left {
      flex: 2;
      background-color: var(--secondary-color);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      align-items: left;
    }

    .right {
      font-family: 'Merriweather', serif;
      background-color: var(--primary-color);
      color: var(--background-color);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      padding: var(--space-md);
    }

    .left h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-md);
        font-family: 'Merriweather', serif;;
        font-weight: bold;
    }

    .left p {
        font-size: var(--base-font-size);
        text-align: center;
    }

    .left a {
        margin-top: var(--space-md);
        color: var(--background-color);
        text-decoration: none;
        font-weight: bold;
        border: 2px solid var(--background-color);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
    }

    .left a:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
    }

    .left2,
    .right2 {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .left2 {
      width: 60%;
      background-color: var(--secondary-color);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      align-items: left;
    }

    .right2 {
      width: 40%;
      flex: 0 0 auto;;
      font-family: 'Merriweather', serif;
      background-color: var(--primary-color);
      color: var(--background-color);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      padding: var(--space-md);
    }

    .left2 h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-md);
        font-family: 'Merriweather', serif;;
        font-weight: bold;
    }

    .left2 p {
        font-size: var(--base-font-size);
        text-align: center;
    }

    .left2 a {
        margin-top: var(--space-md);
        color: var(--background-color);
        text-decoration: none;
        font-weight: bold;
        border: 2px solid var(--background-color);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
    }

    .left2 a:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
    }

    .form_container form {
      margin-top: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: left;
      width: 100%;
    }

    input {
      padding: var(--space-sm);
      margin: var(--space-sm) 0px;
      border-radius: var(--border-radius);
      border: 1px solid var(--input-border);
      background-color: var(--experience-box-color);
      color: var(--text-color);
    }

    .button-wrapper {
        margin: 0px 20px;
    }

    button {
      margin-top: var(--space-md);
      padding: var(--space-sm) var(--space-sm);
      border-radius: var(--border-radius);
      background-color: var(--primary-color);
      color: var(--background-color);
      font-weight: bold;
      border: none;
      cursor: pointer;
      width: 100%;
    }

    button:hover {
      background-color: var(--accent-color);
    }

    .change-button {
      color: var(--background-color);
      text-decoration: none;
      border: 2px solid var(--background-color);
      padding: var(--space-sm) var(--space-md);
      margin-top: var(--space-md);
      border-radius: var(--border-radius);
      width: fit-content;
    }

    .change-button:hover {
        background-color: var(--accent-color);
    }

    .error-message {
      color: var(--error-color);
      margin-bottom: var(--space-sm);
    }
  `;let E=Ye;F([b()],E.prototype,"isLogin",2);F([b()],E.prototype,"name",2);F([b()],E.prototype,"username",2);F([b()],E.prototype,"password",2);F([b()],E.prototype,"confirmPassword",2);F([b()],E.prototype,"errorMessage",2);F([b()],E.prototype,"isAuthenticated",1);F([b()],E.prototype,"user",1);S({"auth-view":E});var Xs=Object.defineProperty,eo=Object.getOwnPropertyDescriptor,Mt=(s,e,t,r)=>{for(var i=r>1?void 0:r?eo(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&Xs(e,t,i),i};const Je=class Je extends Oe{constructor(){super("blazing:model"),this._authObserver=new J(this,"blazing:auth"),this.darkMode=!1}get isAuthenticated(){return this.model.isAuthenticated}get username(){var e;return((e=this.model.user)==null?void 0:e.username)||"Traveler"}connectedCallback(){super.connectedCallback();const e=localStorage.getItem("darkMode")==="true";console.log("Saved dark mode state:",e),e!==this.model.darkMode&&(console.log("Initializing dark mode:",e),this.darkMode=e,this.applyDarkMode(e),this.dispatchMessage(["dark-mode/toggle",{enabled:e}]))}applyDarkMode(e){var t,r;e?(document.body.classList.add("dark-mode"),(t=this.shadowRoot.querySelector(".menu-icon"))==null||t.classList.add("dark-mode")):(document.body.classList.remove("dark-mode"),(r=this.shadowRoot.querySelector(".menu-icon"))==null||r.classList.remove("dark-mode"))}toggleDarkMode(e){var r,i;let t=this.darkMode;e&&(t=e.target.checked),this.darkMode=t,console.log("Toggling dark mode:",this.darkMode),this.darkMode?(document.body.classList.add("dark-mode"),(r=this.shadowRoot.querySelector(".menu-icon"))==null||r.classList.add("dark-mode")):(document.body.classList.remove("dark-mode"),(i=this.shadowRoot.querySelector(".menu-icon"))==null||i.classList.remove("dark-mode")),this.dispatchMessage(["dark-mode/toggle",{enabled:this.darkMode}]),localStorage.setItem("darkMode",String(this.darkMode))}handleSignOut(){this.dispatchMessage(["auth/logout",{}]),window.history.pushState({},"","/"),window.dispatchEvent(new Event("popstate"))}handleNavigation(e){e.preventDefault();const t=e.currentTarget.getAttribute("href");t&&window.dispatchEvent(new CustomEvent("blazing:history",{detail:{path:t}}))}render(){return v`
      <header>
        <div class="title">
          <h1>
            <a href="/app" @click=${this.handleNavigation}>Trip Tally</a>
          </h1>
        </div>
        <nav>
          <a href="/app/map" @click=${this.handleNavigation} class="map-link">
            Map View
          </a>
          <drop-down>
            <button slot="actuator" class="menu-icon" aria-label="Menu">
              <img src="/assets/menu.svg" alt="Menu Icon" class="menu-icon-svg" />
            </button>
            <div class="dropdown-content">
              <label class="dark-mode-switch">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  @change=${this.toggleDarkMode}
                  .checked=${this.darkMode}
                />
                Dark Mode
              </label>
              <a href="/app/profile" @click=${this.handleNavigation}>
                Profile
              </a>
              ${this.isAuthenticated?v`
                    <a @click=${this.handleSignOut}>Sign Out</a>
                  `:v`
                    <a href="/app/auth" @click=${this.handleNavigation}>
                      Sign In
                    </a>
                  `}
            </div>
          </drop-down>
        </nav>
      </header>
    `}};Je.uses=S({"drop-down":gs.Element}),Je.styles=O`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: var(--background-color);
      box-shadow: var(--box-shadow);
      height: 3.0rem; /* Reduced height */
      padding: 20px 40px;
    }

    .title h1 {
      margin: 0;
      font-size: 1.75rem;
      font-family: var(--font-primary);
    }

    h1 a {
      text-decoration: none;
      color: var(--background-color);
    }

    nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .map-link {
      text-decoration: none;
      color: var(--background-color);
      font-size: 1.25rem;
    }

    .map-link:hover {
      text-decoration: underline;
    }

    .dropdown-toggle {
      cursor: pointer;
      color: var(--background-color);
      font-size: 1.25rem;
    }

    .dropdown-content {
      position: absolute;
      right: 0;
      background-color: var(--background-color);
      color: var(--primary-color);
      box-shadow: var(--box-shadow);
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 150px;
      z-index: 100; /* Ensure it's above other elements */
    }

    .dropdown-content label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .dropdown-content a {
      text-decoration: none;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    .dropdown-content a:hover {
      text-decoration: underline;
    }

    label.dark-mode-switch {
      font-size: 1.1rem;
    }

    .menu-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px; /* Adjust as needed */
      height: 40px; /* Adjust as needed */
      background: none;
      border: none; /* Ensures no border */
      border-radius: 5px; /* Rounded edges for the box */
      padding: 4px; /* Space around the icon */
      filter: invert(1); /* Inverts the icon color */
    }

    .menu-icon.dark-mode {
      filter: invert(0);
    }

    .menu-icon-svg {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .menu-icon:hover .menu-icon-svg {
      filter: brightness(1.2); /* Adds a subtle hover effect */
    }
  `;let G=Je;Mt([b()],G.prototype,"darkMode",2);Mt([b()],G.prototype,"isAuthenticated",1);Mt([b()],G.prototype,"username",1);S({"trip-header":G});var to=Object.defineProperty,ro=Object.getOwnPropertyDescriptor,tt=(s,e,t,r)=>{for(var i=r>1?void 0:r?ro(e,t):e,o=s.length-1,n;o>=0;o--)(n=s[o])&&(i=(r?n(e,t,i):n(i))||i);return r&&i&&to(e,t,i),i};const Ke=class Ke extends Oe{constructor(){super("blazing:model"),this.experience={title:"",category:"",location:"",description:"",comment:"",overallRating:0,ratings:{valueForMoney:0,accessibility:0,uniqueness:0}},this.categories=["Adventure","Cultural","Nature and Wildlife","Family-Friendly","Luxury","Budget-Friendly"]}get isAuthenticated(){return this.model.isAuthenticated}get user(){return this.model.user}connectedCallback(){super.connectedCallback()}handleInput(e){const t=e.target,r=t.name;this.experience={...this.experience,[r]:t.value}}handleCategoryChange(e){const t=e.target;this.experience={...this.experience,category:t.value}}handleRatingInput(e,t){const r=t.target;let i=parseFloat(r.value);i=Math.min(Math.max(i,0),5),i=parseFloat(i.toFixed(1)),e==="overallRating"?this.experience={...this.experience,overallRating:i}:(this.experience.ratings[e]=i,this.experience={...this.experience})}renderStarRating(e,t){return v`
            <star-rating
                data-type="${e}"
                value="${t.toFixed(1)}"
            ></star-rating>
        `}navigateLogin(){window.history.pushState({},"","/app/auth"),window.dispatchEvent(new Event("popstate"))}async handleSubmit(){const{title:e,category:t,location:r,description:i,overallRating:o,ratings:n,comment:c}=this.experience||{},a=this.model.user;if(!(a!=null&&a.username)||!(a!=null&&a.id)||!(a!=null&&a.name)){alert("User details are missing. Please log in.");return}if(!(e!=null&&e.trim())||!(t!=null&&t.trim())||!(r!=null&&r.trim())||!(i!=null&&i.trim())){alert("All fields (title, category, location, description) are required.");return}if(o<=0||n.valueForMoney<=0||n.accessibility<=0||n.uniqueness<=0){alert("All ratings must be greater than 0.");return}const h=crypto.randomUUID(),p=crypto.randomUUID();this.dispatchMessage(["experience/create",{id:h,userID:a.id,user:a.name,title:e,category:t,location:r,description:i,rating:o}]),this.dispatchMessage(["review/create",{id:p,experienceId:h,userID:a.id,user:a.username,overallRating:o,valueForMoney:n.valueForMoney,accessibility:n.accessibility,uniqueness:n.uniqueness,comment:c}]),alert(`Experience "${e}" and initial review created successfully!`),window.history.pushState({},"","/"),window.dispatchEvent(new Event("popstate"))}render(){return this.isAuthenticated?v`
            <main class="create-experience-page">
                <div class="navigation">
                    <button
                        class="back-button"
                        @click=${()=>{window.history.back()}}
                    >
                        ⬅ Back
                    </button>
                </div>

                <section class="form-container">
                    <h1>Create New Experience</h1>
                    <form @submit=${e=>e.preventDefault()}>
                        <div class="form-row">
                            <div class="form-group half-width">
                                <label for="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    .value=${this.experience.title}
                                    @input=${this.handleInput}
                                    placeholder="Enter experience title"
                                    required
                                />
                            </div>
                            <div class="form-group half-width">
                                <label for="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    @change=${this.handleCategoryChange}
                                    required
                                >
                                    <option value="" disabled selected>Select a category</option>
                                    ${this.categories.map(e=>v`<option value="${e}">${e}</option>`)}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group half-width">
                                <label for="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    .value=${this.experience.location}
                                    @input=${this.handleInput}
                                    placeholder="Enter location"
                                    required
                                />
                            </div>
                            <div class="form-group full-width">
                                <label for="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    .value=${this.experience.description}
                                    @input=${this.handleInput}
                                    placeholder="Describe the experience"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div class="form-group full-width">
                                <label for="comment">Review</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    .value=${this.experience.comment}
                                    @input=${this.handleInput}
                                    placeholder="Add a review"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div class="ratings-section">
                            <div class="rating-item">
                                <label for="overallRating">Overall Rating</label>
                                ${this.renderStarRating("overallRating",this.experience.overallRating)}
                                <input
                                    type="number"
                                    id="overallRating"
                                    name="overallRating"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    .value=${this.experience.overallRating.toFixed(1)}
                                    @input=${e=>this.handleRatingInput("overallRating",e)}
                                />
                            </div>

                            <div class="rating-item">
                                <label for="valueForMoney">Value for Money</label>
                                ${this.renderStarRating("valueForMoney",this.experience.ratings.valueForMoney)}
                                <input
                                    type="number"
                                    id="valueForMoney"
                                    name="valueForMoney"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    .value=${this.experience.ratings.valueForMoney.toFixed(1)}
                                    @input=${e=>this.handleRatingInput("valueForMoney",e)}
                                />
                            </div>

                            <div class="rating-item">
                                <label for="accessibility">Accessibility</label>
                                ${this.renderStarRating("accessibility",this.experience.ratings.accessibility)}
                                <input
                                    type="number"
                                    id="accessibility"
                                    name="accessibility"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    .value=${this.experience.ratings.accessibility.toFixed(1)}
                                    @input=${e=>this.handleRatingInput("accessibility",e)}
                                />
                            </div>

                            <div class="rating-item">
                                <label for="uniqueness">Uniqueness</label>
                                ${this.renderStarRating("uniqueness",this.experience.ratings.uniqueness)}
                                <input
                                    type="number"
                                    id="uniqueness"
                                    name="uniqueness"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    .value=${this.experience.ratings.uniqueness.toFixed(1)}
                                    @input=${e=>this.handleRatingInput("uniqueness",e)}
                                />
                            </div>
                        </div>

                        <div class="form-actions">
                            <button
                                type="button"
                                class="submit-button"
                                @click=${this.handleSubmit}
                            >
                                Create Experience
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        `:(console.log("Not authenticated"),console.log(this.isAuthenticated),v`
                <main class="create-experience-page">
                    <section class="login-container">
                        <h1>You must be logged in to create an experience.</h1>
                        <div class="form-actions">
                            <button
                                class="submit-button"
                                @click=${()=>this.navigateLogin()}
                            >
                                Go to Login
                            </button>
                        </div>
                    </section>
                </main>
            `)}};Ke.uses=[pe],Ke.styles=O`
        :host {
            font-family: var(--font-family-primary, Arial, sans-serif);
        }

        .create-experience-page {
            background: var(--background-color, #f9f9f9);
            color: var(--text-color, #333);
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
        }

        .form-container {
            background: var(--background-color, #fff);
            padding: 2rem;
            border-radius: 10px;
        }

        .login-container {
            background: var(--background-color, #fff);
            padding: 2rem;
            border-radius: 10px;
            vertical-align: center;
            justify-content: center;
        }

        h1 {
            font-size: 2rem;
            color: var(--primary-color, #007bff);
            margin-bottom: 2rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
        }

        label {
            font-size: 1rem;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }

        input,
        textarea,
        select {
            padding: 0.75rem;
            font-size: 1rem;
            border-radius: 6px;
            border: 0px;
            background: var(--secondary-color, #fefefe);
            color: var(--text-color);
        }

        input {
            flex-grow: 1;
            border: none;
            outline: none;
            font-size: 1rem;
            color: var(--text-color);
        }

        textarea {
            resize: none;
            height: 100px;
        }

        .form-group.half-width {
            width: calc(50% - 0.5rem);
            flex-grow: 1;
        }

        .form-group.full-width {
            width: 100%;
            margin-top: -1.5rem;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: flex-start;
        }

        .ratings-section {
            margin-top: 2rem;
        }

        .rating-item {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .rating-item label {
            flex: 1;
            font-weight: bold;
        }

        .rating-item input[type="number"] {
            max-width: 6rem;
            text-align: center;
        }

        .form-actions {
            text-align: center;
            margin-top: 2rem;
        }

        .back-button {
            background-color: var(--primary-color);
            color: var(--background-color);
            border: none;
            padding: var(--space-sm) var(--space-md);
            border-radius: var(--border-radius);
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .submit-button {
            background: var(--primary-color, #007bff);
            color: var(--background-color, #fff);
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            border: none;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .submit-button:hover {
            background: var(--accent-color, #0056b3);
        }
    `;let I=Ke;tt([b()],I.prototype,"experience",2);tt([b()],I.prototype,"isAuthenticated",1);tt([b()],I.prototype,"user",1);tt([b()],I.prototype,"categories",2);S({"experience-create":I});const io={isAuthenticated:!1,user:void 0,darkMode:localStorage.getItem("darkMode")==="true"};function so(s,e,t){switch(s[0]){case"dark-mode/toggle":e(a=>{const h={...a,darkMode:s[1].enabled};return console.log("Saving darkMode to localStorage:",h.darkMode),localStorage.setItem("darkMode",String(h.darkMode)),h});break;case"experience/select":oo(s[1],t).then(a=>{a&&e(h=>({...h,experience:a}))}).catch(a=>{console.error("Error fetching experience:",a)});break;case"experience/create":const r=s[1];fetch("/api/experiences",{method:"POST",headers:{"Content-Type":"application/json",...Y.headers(t)},body:JSON.stringify(r)}).then(a=>{if(!a.ok)throw new Error("Failed to create experience.");return a.json()}).then(a=>{console.log("Experience created:",a),e(h=>({...h,experiences:[...h.experiences||[],a]}))}).catch(a=>{console.error("Error creating experience:",a)});break;case"review/create":const i=s[1];fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json",...Y.headers(t)},body:JSON.stringify(i)}).then(a=>{if(!a.ok)throw new Error("Failed to create review.");return a.json()}).then(a=>{console.log("Review created:",a),e(h=>{var p,d;return((p=h.experience)==null?void 0:p.id)===a.experienceId?{...h,experience:{...h.experience,reviews:[...((d=h.experience)==null?void 0:d.reviews)||[],a]}}:h})}).catch(a=>{console.error("Error creating review:",a)});break;case"reviews/fetch":no(s[1],t).then(a=>{a&&e(h=>({...h,experience:{...h.experience,reviews:a}}))}).catch(a=>{console.error("Error fetching reviews:",a)});break;case"auth/login":{console.log(s[1]);const{username:a,password:h}=s[1];fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:a,password:h})}).then(p=>{if(!p.ok)throw new Error("Invalid login credentials");return p.json()}).then(p=>{console.log("Login successful. User data:",p),e(d=>({...d,isAuthenticated:!0,user:{id:p.id,name:p.name,username:p.username}})),window.history.pushState({},"","/"),window.dispatchEvent(new Event("popstate"))}).catch(p=>{console.error("Login failed:",p),alert("Login failed. Please check your credentials.")});break}case"auth/logout":e(a=>({...a,isAuthenticated:!1,user:void 0}));break;case"auth/register":const{username:o,name:n,password:c}=s[1];console.log("Registering user:",o,n,c),fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:o,name:n,password:c})}).then(a=>{if(!a.ok)throw new Error("Registration failed. Please try again.");return a.json()}).then(a=>{console.log("Login successful. User data:",a),e(h=>({...h,isAuthenticated:!0,user:{id:a.id,name:a.name,username:a.username}})),window.history.pushState({},"","/"),window.dispatchEvent(new Event("popstate"))}).catch(a=>{console.error("Registration failed:",a),alert("Registration failed. Please try again.")});break;default:console.error(`Unhandled message: ${s[0]}`)}}function oo(s,e){return fetch(`/api/experiences/${s.experienceId}`,{headers:Y.headers(e)}).then(t=>{if(t.ok)return t.json();throw new Error(`Failed to fetch experience: ${t.status}`)}).catch(t=>(console.error("Error fetching experience:",t),null))}function no(s,e){return fetch(`/api/reviews/${s.experienceId}`,{headers:Y.headers(e)}).then(t=>{if(t.ok)return t.json();throw new Error(`Failed to fetch reviews: ${t.status}`)}).catch(t=>(console.error("Error fetching reviews:",t),[]))}const ao=[{path:"/app",view:()=>v`<home-view></home-view>`},{path:"/app/experience/:id",view:s=>v`<experience-view experience-id=${s.id}></experience-view>`},{path:"/app/add-experience",view:()=>v`<experience-create></experience-create>`},{path:"/app/auth",view:()=>v`<auth-view></auth-view>`},{path:"/",redirect:"/app"}];class co extends C{render(){return v`<mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}}S({"mu-auth":Y.Provider,"mu-history":wi.Provider,"mu-switch":class extends us.Element{constructor(){super(ao,"blazing:history","blazing:auth")}},"home-view":U,"experience-view":j,"trip-header":G,"login-page":z,"auth-view":E,"register-page":R,"experience-create":I,"trip-app":co,"mu-store":class extends xi.Provider{constructor(){super(so,io,"blazing:auth")}}});
