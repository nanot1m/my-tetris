var N=Object.defineProperty;var X=(e,t,n)=>t in e?N(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var O=(e,t,n)=>(X(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const v=class v{constructor(t){O(this,"seed");this.seed=t}next(){return this.seed=(v.A*this.seed+v.C)%v.MOD,this.seed/v.MOD}nextInt(t,n){return Math.floor(this.next()*(n-t+1))+t}};O(v,"A",1664525),O(v,"C",1013904223),O(v,"MOD",2**32);let I=v;var A=(e=>(e[e.I=0]="I",e[e.J=1]="J",e[e.L=2]="L",e[e.O=3]="O",e[e.S=4]="S",e[e.T=5]="T",e[e.Z=6]="Z",e))(A||{});const z=[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[1,0,0],[1,1,1],[0,0,0]],[[0,0,1],[1,1,1],[0,0,0]],[[1,1],[1,1]],[[0,1,1],[1,1,0],[0,0,0]],[[1,1,1],[0,1,0],[0,0,0]],[[1,1,0],[0,1,1],[0,0,0]]],M=e=>z[e];function J(e){const t=e.length,n=new Array(t).fill(0).map(()=>new Array(t).fill(0));for(let r=0;r<t;r++)for(let o=0;o<t;o++)n[r][o]=e[t-o-1][r];return n}const R=[0,1,2,3,4,5];function*K(e){let t=[...R];for(;;){t.length===0&&(t=[...R]);const n=e.nextInt(0,t.length-1);yield t.splice(n,1)[0]}}const L=-1;function P(e,t){return Array.from({length:t},()=>Array.from({length:e},()=>L))}function D(e,t,n){for(let r=0;r<t.length;r++)for(let o=0;o<t[r].length;o++)if(t[r][o]!==0){const s=n.y+r,a=n.x+o;if(s>=e.length||a>=e[0].length)return!0;const f=e[s];if(f&&f[a]!==L)return!0}return!1}function U(e,t,n,r){var s;let o=0;for(let a=0;a<n.length;a++){const f=r.y+a;for(let d=0;d<n[a].length;d++){const C=r.x+d;n[a][d]!==0&&(e[f][C]=t)}(s=e[f])!=null&&s.every(d=>d!==L)&&(e.splice(f,1),e.unshift(Array.from({length:e[0].length},()=>L)),o++)}return o}function Y(e,t,n,r){const o={x:r.x,y:r.y+1};return D(e,n,o)?r.y===0?{type:"gameover"}:{type:"placed",burnedRows:U(e,t,n,r)}:{type:"falling",nextPosition:o}}function Z(e){if(e.nextTetrominoesCount<1)throw new Error("nextTetrominoesCount must be at least 1");if(e.speed<=0)throw new Error("speed must be greater than 0");if(e.width<4)throw new Error("width must be at least 4");if(e.height<4)throw new Error("height must be at least 4");for(let t=1;t<=4;t++)if(!e.scoring[t])throw new Error(`scoring must contain a value for ${t} burned rows`)}function q(e,t,n){Z(e);const r=P(e.width,e.height),o=Math.floor(e.width/2);let s=0;const a=new I(e.seed),f=K(a);let d=f.next().value,C=[];for(let l=0;l<e.nextTetrominoesCount;l++)C.push(f.next().value);let g="playing",h={x:o,y:0},i=M(d),c=e.speed,p=0;const x=()=>g==="gameover",y=()=>({field:r,score:s,currentTetrominoe:d,tetrominoePosition:h,tetrominoeShape:i,nextTetrominoes:C,state:g,speed:c,totalBurnedRows:p}),m=l=>b=>{g==="playing"&&(l(b),n(y()))},u=[t.on("move",m(l=>{const b={...h};l.direction==="left"&&b.x--,l.direction==="right"&&b.x++,l.direction==="down"&&b.y++,D(r,i,b)||(h=b)})),t.on("rotate",m(()=>{const l=J(i);D(r,l,h)||(i=l)})),t.on("drop",m(()=>{for(;!D(r,i,{...h,y:h.y+1});)h.y++})),t.on("pause",m(()=>{g=g==="paused"?"playing":"paused"}))];function w(){if(g!=="playing")return;const l=Y(r,d,i,h);if(l.type==="gameover"){g="gameover",u.forEach(b=>b.unsubscribe());return}l.type==="placed"&&(p+=l.burnedRows,s+=e.scoring[l.burnedRows],d=C.shift(),C.push(f.next().value),h={x:o,y:0},i=M(d)),l.type==="falling"&&(h=l.nextPosition),n(y())}function F(){w(),x()||setTimeout(F,2e3/c)}return{start(){F()},stop(){g="gameover",w()}}}const k={[L]:"#000000",[A.I]:"#00FFFF",[A.J]:"#0000FF",[A.L]:"#FFA500",[A.O]:"#FFFF00",[A.S]:"#00FF00",[A.T]:"#800080",[A.Z]:"#FF0000"},E=20;function G(e,t){const n=document.createElement("canvas");n.width=t.width*E,n.height=t.height*E;const r=document.createElement("div");r.style.fontSize="24px",r.style.fontWeight="bold",r.style.fontFamily="monospace",r.style.width="80px",r.style.textAlign="right";const o=document.createElement("canvas");o.width=4*E,o.height=t.nextTetrominoesCount*4*E,e.appendChild(r),e.appendChild(n),e.appendChild(o);function s(i,c,p,x){x.fillStyle=p,x.fillRect(i*E+1,c*E+1,E-1,E-1)}function a(i){r.textContent=`${i.score}`}function f(i,c,p,x){for(let y=0;y<i.length;y++){const m=p.y+y;for(let u=0;u<i[y].length;u++){const w=p.x+u;if(i[y][u]){const F=k[c];s(w,m,F,x)}}}}function d(i,c){c.clearRect(0,0,c.canvas.width,c.canvas.height);const{field:p,tetrominoePosition:x,tetrominoeShape:y,currentTetrominoe:m}=i;for(let u=0;u<p.length;u++)for(let w=0;w<p[u].length;w++){const F=k[p[u][w]];s(w,u,F,c)}f(y,m,x,c)}function C(i,c){c.clearRect(0,0,c.canvas.width,c.canvas.height);const{nextTetrominoes:p}=i;p.forEach((x,y)=>{for(let u=0;u<4;u++)for(let w=0;w<4;w++){const F=k[L];s(w,u+y*4,F,c)}const m=M(x);f(m,x,{x:0,y:y*4},c)})}const g=n.getContext("2d");if(!g)throw new Error("Canvas 2d context not supported");const h=o.getContext("2d");if(!h)throw new Error("Canvas 2d context not supported");return{onNextLevelState:i=>{a(i),d(i,g),C(i,h)}}}function W(){const e=new Map;return{on(t,n){const r=e.get(t)??new Set;return r.add(n),e.set(t,r),{unsubscribe(){r.delete(n)}}},dispatch(t){const n=e.get(t.type);if(n)for(const r of n)r(t)}}}function $(e){const t=W(),n=r=>{switch(r.key){case"ArrowLeft":{r.preventDefault(),t.dispatch({type:"move",direction:"left"});break}case"ArrowRight":{r.preventDefault(),t.dispatch({type:"move",direction:"right"});break}case"ArrowDown":{r.preventDefault(),t.dispatch({type:"move",direction:"down"});break}case"ArrowUp":{r.preventDefault(),t.dispatch({type:"rotate",direction:"clockwise"});break}case" ":{r.preventDefault(),t.dispatch({type:"drop"});break}case"Escape":case"Enter":{r.preventDefault(),t.dispatch({type:"pause"});break}}};return e.addEventListener("keydown",n),{bus:t,destroy(){e.removeEventListener("keydown",n)}}}const j=document.querySelector("#app"),S={width:10,height:20,nextTetrominoesCount:3,scoring:{0:0,1:40,2:100,3:300,4:1200},seed:Date.now(),speed:2},H=$(document.body),B=G(j,S),Q=q(S,H.bus,e=>B.onNextLevelState(e));Q.start();
