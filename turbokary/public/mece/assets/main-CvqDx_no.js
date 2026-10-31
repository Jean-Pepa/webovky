const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GLTFLoader-BOM0ZSSn.js","assets/bundler-w54P5r4L.js","assets/bundler-DDGetWc7.css"])))=>i.map(i=>d[i]);
var tf=Object.defineProperty;var ef=(s,t,e)=>t in s?tf(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var E=(s,t,e)=>ef(s,typeof t!="symbol"?t+"":t,e);import{i as nf,C as Wn,c as sf,h as bc,$ as rf,a as af,p as of,m as lf,M as cf,g as hf,l as uf,b as Mi,d as df,e as ku,D as Yr,R as ff,f as sr,j as pf,P as mf}from"./bundler-w54P5r4L.js";const Ul="187",gf=0,wc=1,_f=2,Bs=1,vf=2,Ns=3,Si=0,Ve=1,yn=2,ji=0,ts=1,rs=2,Ec=3,Tc=4,xf=5,Qi=100,Mf=101,yf=102,Sf=103,bf=104,wf=200,Ef=201,Tf=202,Af=203,zu=204,Vu=205,Rf=206,Cf=207,Pf=208,Lf=209,If=210,Df=211,Nf=212,Uf=213,Ff=214,Bo=0,ko=1,zo=2,Gs=3,Vo=4,Ho=5,Go=6,Wo=7,Fl=0,Of=1,Bf=2,Hn=0,Hu=1,Gu=2,Wu=3,Ol=4,Xu=5,qu=6,Yu=7,Ac="attached",kf="detached",$u=300,as=301,Ws=302,Ta=303,Aa=304,Xo=1e3,kn=1001,qo=1002,Ne=1003,zf=1004,rr=1005,qe=1006,Ra=1007,li=1008,Qe=1009,Ku=1010,Zu=1011,Xs=1012,Bl=1013,bn=1014,an=1015,wn=1016,kl=1017,zl=1018,os=1020,Ju=35902,Qu=35899,ju=1021,td=1022,un=1023,hi=1026,ci=1027,Vl=1028,Hl=1029,bi=1030,Gl=1031,Wl=1033,$r=33776,Kr=33777,Zr=33778,Jr=33779,Yo=35840,$o=35841,Ko=35842,Zo=35843,Jo=36196,Qo=37492,jo=37496,tl=37488,el=37489,na=37490,nl=37491,il=37808,sl=37809,rl=37810,al=37811,ol=37812,ll=37813,cl=37814,hl=37815,ul=37816,dl=37817,fl=37818,pl=37819,ml=37820,gl=37821,_l=36492,vl=36494,xl=36495,Ml=36283,yl=36284,ia=36285,Sl=36286,sa=2300,bl=2301,Ca=2302,Rc=2303,Cc=2400,Pc=2401,Lc=2402,Vf=2500,jM=0,ty=1,ey=2,Hf=3200,ra=0,Gf=1,oi="",ze="srgb",aa="srgb-linear",oa="linear",ne="srgb",Pa=7680,Wf=519,Xf=512,qf=513,Yf=514,ed=515,$f=516,Kf=517,nd=518,id=519,sd=35044,ks=35048,Ic="300 es",dn=2e3,qs=2001;function Zf(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Jf(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Ys(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Qf(){const s=Ys("canvas");return s.style.display="block",s}const Dc={};function la(...s){const t="THREE."+s.shift();console.log(t,...s)}function rd(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ct(...s){s=rd(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Ot(...s){s=rd(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function es(...s){const t=s.join(" ");t in Dc||(Dc[t]=!0,Ct(...s))}function jf(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const tp={[Bo]:Bo,[zo]:Go,[Vo]:Vo,[Gs]:Ho,[ko]:ko,[Go]:zo,[Wo]:Wo,[Ho]:Gs};class Ti{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nc=1234567;const zs=Math.PI/180,ls=180/Math.PI;function An(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Be[s&255]+Be[s>>8&255]+Be[s>>16&255]+Be[s>>24&255]+"-"+Be[t&255]+Be[t>>8&255]+"-"+Be[t>>16&15|64]+Be[t>>24&255]+"-"+Be[e&63|128]+Be[e>>8&255]+"-"+Be[e>>16&255]+Be[e>>24&255]+Be[n&255]+Be[n>>8&255]+Be[n>>16&255]+Be[n>>24&255]).toLowerCase()}function Xt(s,t,e){return Math.max(t,Math.min(e,s))}function Xl(s,t){return(s%t+t)%t}function ep(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function np(s,t,e){return s!==t?(e-s)/(t-s):0}function Vs(s,t,e){return(1-e)*s+e*t}function ip(s,t,e,n){return Vs(s,t,1-Math.exp(-e*n))}function sp(s,t=1){return t-Math.abs(Xl(s,t*2)-t)}function rp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function ap(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function op(s,t){return s+Math.floor(Math.random()*(t-s+1))}function lp(s,t){return s+Math.random()*(t-s)}function cp(s){return s*(.5-Math.random())}function hp(s){s!==void 0&&(Nc=s);let t=Nc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function up(s){return s*zs}function dp(s){return s*ls}function fp(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function pp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function ad(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function mp(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*h,l*d,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*d,o*c);break;case"ZXZ":s.set(l*d,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*f,o*h,o*c);break;default:Ct("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function va(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function ql(s,t){if(t.constructor===Float32Array)return s;const e=va(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function Yl(s,t){if(t.constructor===Float32Array)return s;const e=va(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}const ny={DEG2RAD:zs,RAD2DEG:ls,generateUUID:An,clamp:Xt,euclideanModulo:Xl,mapLinear:ep,inverseLerp:np,lerp:Vs,damp:ip,pingpong:sp,smoothstep:rp,smootherstep:ap,randInt:op,randFloat:lp,randFloatSpread:cp,seededRandom:hp,degToRad:up,radToDeg:dp,isPowerOfTwo:fp,ceilPowerOfTwo:pp,floorPowerOfTwo:ad,setQuaternionFromProperEuler:mp,normalize:Yl,denormalize:ql},lc=class lc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};lc.prototype.isVector2=!0;let It=lc;class Kt{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(d!==v||l!==u||c!==f||h!==g){let m=l*u+c*f+h*g+d*v;m<0&&(u=-u,f=-f,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const x=Math.acos(m),T=Math.sin(x);p=Math.sin(p*x)/T,o=Math.sin(o*x)/T,l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+v*o}else{l=l*p+u*o,c=c*p+f*o,h=h*p+g*o,d=d*p+v*o;const x=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=x,c*=x,h*=x,d*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*d+l*f-c*u,t[e+1]=l*g+h*u+c*d-o*f,t[e+2]=c*g+h*f+o*u-l*d,t[e+3]=h*g-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(r/2),u=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d+u*f*g;break;case"YZX":this._x=u*h*d+c*f*g,this._y=c*f*d+u*h*g,this._z=c*h*g-u*f*d,this._w=c*h*d-u*f*g;break;case"XZY":this._x=u*h*d-c*f*g,this._y=c*f*d-u*h*g,this._z=c*h*g+u*f*d,this._w=c*h*d+u*f*g;break;default:Ct("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Xt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const cc=class cc{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Uc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Uc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=i+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return La.copy(this).projectOnVector(t),this.sub(La)}reflect(t){return this.sub(La.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Xt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};cc.prototype.isVector3=!0;let A=cc;const La=new A,Uc=new Kt,hc=class hc{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],v=i[0],m=i[3],p=i[6],x=i[1],T=i[4],b=i[7],C=i[2],w=i[5],_=i[8];return r[0]=a*v+o*x+l*C,r[3]=a*m+o*T+l*w,r[6]=a*p+o*b+l*_,r[1]=c*v+h*x+d*C,r[4]=c*m+h*T+d*w,r[7]=c*p+h*b+d*_,r[2]=u*v+f*x+g*C,r[5]=u*m+f*T+g*w,r[8]=u*p+f*b+g*_,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,g=e*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=d*v,t[1]=(i*c-h*n)*v,t[2]=(o*n-i*a)*v,t[3]=u*v,t[4]=(h*e-i*l)*v,t[5]=(i*r-o*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return es("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ia.makeScale(t,e)),this}rotate(t){return es("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ia.makeRotation(-t)),this}translate(t,e){return es("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ia.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};hc.prototype.isMatrix3=!0;let kt=hc;const Ia=new kt,Fc=new kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oc=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gp(){const s={enabled:!0,workingColorSpace:aa,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ne&&(i.r=Gn(i.r),i.g=Gn(i.g),i.b=Gn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ne&&(i.r=ns(i.r),i.g=ns(i.g),i.b=ns(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===oi?oa:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[aa]:{primaries:t,whitePoint:n,transfer:oa,toXYZ:Fc,fromXYZ:Oc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ze},outputColorSpaceConfig:{drawingBufferColorSpace:ze}},[ze]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:Fc,fromXYZ:Oc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ze}}}),s}const Zt=gp();function Gn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ns(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ci;class _p{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ci===void 0&&(Ci=Ys("canvas")),Ci.width=t.width,Ci.height=t.height;const i=Ci.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ci}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ys("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Gn(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Gn(e[n]/255)*255):e[n]=Gn(e[n]);return{data:e,width:t.width,height:t.height}}else return Ct("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let vp=0;class $l{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=An(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Da(i[a].image)):r.push(Da(i[a]))}else r=Da(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Da(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?_p.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ct("Texture: Unable to serialize Texture."),{})}let xp=0;const Na=new A;class Ue extends Ti{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=kn,i=kn,r=qe,a=li,o=un,l=Qe,c=Ue.DEFAULT_ANISOTROPY,h=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=An(),this.name="",this.source=new $l(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new It(0,0),this.repeat=new It(1,1),this.center=new It(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Na).x}get height(){return this.source.getSize(Na).y}get depth(){return this.source.getSize(Na).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Ct(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ct(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$u)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xo:t.x=t.x-Math.floor(t.x);break;case kn:t.x=t.x<0?0:1;break;case qo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xo:t.y=t.y-Math.floor(t.y);break;case kn:t.y=t.y<0?0:1;break;case qo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=$u;Ue.DEFAULT_ANISOTROPY=1;const uc=class uc{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(c+1)/2,b=(f+1)/2,C=(p+1)/2,w=(h+u)/4,_=(d+v)/4,S=(g+m)/4;return T>b&&T>C?T<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(T),i=w/n,r=_/n):b>C?b<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(b),n=w/i,r=S/i):C<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(C),n=_/r,i=S/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(d-v)/x,this.z=(u-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Xt(this.x,t.x,e.x),this.y=Xt(this.y,t.y,e.y),this.z=Xt(this.z,t.z,e.z),this.w=Xt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Xt(this.x,t,e),this.y=Xt(this.y,t,e),this.z=Xt(this.z,t,e),this.w=Xt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Xt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};uc.prototype.isVector4=!0;let ae=uc;class Mp extends Ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ae(0,0,t,e),this.scissorTest=!1,this.viewport=new ae(0,0,t,e),this.textures=[];const i=n.count;for(let r=0;r<i;r++)this.textures[r]=new Ue({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new $l(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends Mp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class od extends Ue{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class yp extends Ue{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const _a=class _a{constructor(t,e,n,i,r,a,o,l,c,h,d,u,f,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,d,u,f,g,v,m)}set(t,e,n,i,r,a,o,l,c,h,d,u,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _a().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/Pi.setFromMatrixColumn(t,0).length(),r=1/Pi.setFromMatrixColumn(t,1).length(),a=1/Pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,g=o*h,v=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=u-v*c,e[9]=-o*l,e[2]=v-u*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u+v*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=v+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,g=c*h,v=c*d;e[0]=u-v*o,e[4]=-a*d,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=v-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,g=o*h,v=o*d;e[0]=l*h,e[4]=g*c-f,e[8]=u*c+v,e[1]=l*d,e[5]=v*c+u,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=v-u*d,e[8]=g*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+g,e[10]=u-v*d}else if(t.order==="XZY"){const u=a*l,f=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+v,e[5]=a*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=o*h,e[10]=v*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sp,t,bp)}lookAt(t,e,n){const i=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Jn.crossVectors(n,$e),Jn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Jn.crossVectors(n,$e)),Jn.normalize(),ar.crossVectors($e,Jn),i[0]=Jn.x,i[4]=ar.x,i[8]=$e.x,i[1]=Jn.y,i[5]=ar.y,i[9]=$e.y,i[2]=Jn.z,i[6]=ar.z,i[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],T=n[7],b=n[11],C=n[15],w=i[0],_=i[4],S=i[8],I=i[12],P=i[1],D=i[5],U=i[9],O=i[13],L=i[2],H=i[6],q=i[10],W=i[14],et=i[3],X=i[7],j=i[11],tt=i[15];return r[0]=a*w+o*P+l*L+c*et,r[4]=a*_+o*D+l*H+c*X,r[8]=a*S+o*U+l*q+c*j,r[12]=a*I+o*O+l*W+c*tt,r[1]=h*w+d*P+u*L+f*et,r[5]=h*_+d*D+u*H+f*X,r[9]=h*S+d*U+u*q+f*j,r[13]=h*I+d*O+u*W+f*tt,r[2]=g*w+v*P+m*L+p*et,r[6]=g*_+v*D+m*H+p*X,r[10]=g*S+v*U+m*q+p*j,r[14]=g*I+v*O+m*W+p*tt,r[3]=x*w+T*P+b*L+C*et,r[7]=x*_+T*D+b*H+C*X,r[11]=x*S+T*U+b*q+C*j,r[15]=x*I+T*O+b*W+C*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15],x=l*f-c*u,T=o*f-c*d,b=o*u-l*d,C=a*f-c*h,w=a*u-l*h,_=a*d-o*h;return e*(v*x-m*T+p*b)-n*(g*x-m*C+p*w)+i*(g*T-v*C+p*_)-r*(g*b-v*w+m*_)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=e*o-n*a,T=e*l-i*a,b=e*c-r*a,C=n*l-i*o,w=n*c-r*o,_=i*c-r*l,S=h*v-d*g,I=h*m-u*g,P=h*p-f*g,D=d*m-u*v,U=d*p-f*v,O=u*p-f*m,L=x*O-T*U+b*D+C*P-w*I+_*S;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/L;return t[0]=(o*O-l*U+c*D)*H,t[1]=(i*U-n*O-r*D)*H,t[2]=(v*_-m*w+p*C)*H,t[3]=(u*w-d*_-f*C)*H,t[4]=(l*P-a*O-c*I)*H,t[5]=(e*O-i*P+r*I)*H,t[6]=(m*b-g*_-p*T)*H,t[7]=(h*_-u*b+f*T)*H,t[8]=(a*U-o*P+c*S)*H,t[9]=(n*P-e*U-r*S)*H,t[10]=(g*w-v*b+p*x)*H,t[11]=(d*b-h*w-f*x)*H,t[12]=(o*I-a*D-l*S)*H,t[13]=(e*D-n*I+i*S)*H,t[14]=(v*T-g*C-m*x)*H,t[15]=(h*C-d*T+u*x)*H,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,g=r*d,v=a*h,m=a*d,p=o*d,x=l*c,T=l*h,b=l*d,C=n.x,w=n.y,_=n.z;return i[0]=(1-(v+p))*C,i[1]=(f+b)*C,i[2]=(g-T)*C,i[3]=0,i[4]=(f-b)*w,i[5]=(1-(u+p))*w,i[6]=(m+x)*w,i[7]=0,i[8]=(g+T)*_,i[9]=(m-x)*_,i[10]=(1-(u+v))*_,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Pi.set(i[0],i[1],i[2]).length();const o=Pi.set(i[4],i[5],i[6]).length(),l=Pi.set(i[8],i[9],i[10]).length();r<0&&(a=-a),ln.copy(this);const c=1/a,h=1/o,d=1/l;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=d,ln.elements[9]*=d,ln.elements[10]*=d,e.setFromRotationMatrix(ln),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=dn,l=!1){const c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===dn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===qs)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=dn,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===dn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===qs)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};_a.prototype.isMatrix4=!0;let Wt=_a;const Pi=new A,ln=new Wt,Sp=new A(0,0,0),bp=new A(1,1,1),Jn=new A,ar=new A,$e=new A,Bc=new Wt,kc=new Kt;class En{constructor(t=0,e=0,n=0,i=En.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ct("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Bc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Bc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kc.setFromEuler(this),this.setFromQuaternion(kc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";class ld{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let wp=0;const zc=new A,Li=new Kt,Cn=new Wt,or=new A,gs=new A,Ep=new A,Tp=new Kt,Vc=new A(1,0,0),Hc=new A(0,1,0),Gc=new A(0,0,1),Wc={type:"added"},Ap={type:"removed"},Ii={type:"childadded",child:null},Ua={type:"childremoved",child:null};class _e extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wp++}),this.uuid=An(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_e.DEFAULT_UP.clone();const t=new A,e=new En,n=new Kt,i=new A(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Wt},normalMatrix:{value:new kt}}),this.matrix=new Wt,this.matrixWorld=new Wt,this.matrixAutoUpdate=_e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ld,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Li.setFromAxisAngle(t,e),this.quaternion.multiply(Li),this}rotateOnWorldAxis(t,e){return Li.setFromAxisAngle(t,e),this.quaternion.premultiply(Li),this}rotateX(t){return this.rotateOnAxis(Vc,t)}rotateY(t){return this.rotateOnAxis(Hc,t)}rotateZ(t){return this.rotateOnAxis(Gc,t)}translateOnAxis(t,e){return zc.copy(t).applyQuaternion(this.quaternion),this.position.add(zc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vc,t)}translateY(t){return this.translateOnAxis(Hc,t)}translateZ(t){return this.translateOnAxis(Gc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?or.copy(t):or.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(gs,or,this.up):Cn.lookAt(or,gs,this.up),this.quaternion.setFromRotationMatrix(Cn),i&&(Cn.extractRotation(i.matrixWorld),Li.setFromRotationMatrix(Cn),this.quaternion.premultiply(Li.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ot("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wc),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null):Ot("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ap),Ua.child=t,this.dispatchEvent(Ua),Ua.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wc),Ii.child=t,this.dispatchEvent(Ii),Ii.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,t,Ep),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,Tp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}_e.DEFAULT_UP=new A(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ge extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rp={type:"move"};class Fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&u>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Rp)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ge;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const cd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},lr={h:0,s:0,l:0};function Oa(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Lt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Zt.workingColorSpace){if(t=Xl(t,1),e=Xt(e,0,1),n=Xt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Oa(a,r,t+1/3),this.g=Oa(a,r,t),this.b=Oa(a,r,t-1/3)}return Zt.colorSpaceToWorking(this,i),this}setStyle(t,e=ze){function n(r){r!==void 0&&parseFloat(r)<1&&Ct("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ct("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Ct("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ze){const n=cd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ct("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=ns(t.r),this.g=ns(t.g),this.b=ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ze){return Zt.workingToColorSpace(ke.copy(this),t),Math.round(Xt(ke.r*255,0,255))*65536+Math.round(Xt(ke.g*255,0,255))*256+Math.round(Xt(ke.b*255,0,255))}getHexString(t=ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.workingToColorSpace(ke.copy(this),e);const n=ke.r,i=ke.g,r=ke.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Zt.workingColorSpace){return Zt.workingToColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=ze){Zt.workingToColorSpace(ke.copy(this),t);const e=ke.r,n=ke.g,i=ke.b;return t!==ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Qn),this.setHSL(Qn.h+t,Qn.s+e,Qn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Qn),t.getHSL(lr);const n=Vs(Qn.h,lr.h,e),i=Vs(Qn.s,lr.s,e),r=Vs(Qn.l,lr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ke=new Lt;Lt.NAMES=cd;class Kl{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Lt(t),this.near=e,this.far=n}clone(){return new Kl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Cp extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const cn=new A,Pn=new A,Ba=new A,Ln=new A,Di=new A,Ni=new A,Xc=new A,ka=new A,za=new A,Va=new A,Ha=new ae,Ga=new ae,Wa=new ae;class rn{constructor(t=new A,e=new A,n=new A){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),cn.subVectors(t,e),i.cross(cn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){cn.subVectors(i,e),Pn.subVectors(n,e),Ba.subVectors(t,e);const a=cn.dot(cn),o=cn.dot(Pn),l=cn.dot(Ba),c=Pn.dot(Pn),h=Pn.dot(Ba),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return Ha.setScalar(0),Ga.setScalar(0),Wa.setScalar(0),Ha.fromBufferAttribute(t,e),Ga.fromBufferAttribute(t,n),Wa.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(Ha,r.x),a.addScaledVector(Ga,r.y),a.addScaledVector(Wa,r.z),a}static isFrontFacing(t,e,n,i){return cn.subVectors(n,e),Pn.subVectors(t,e),cn.cross(Pn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),cn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return rn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;Di.subVectors(i,n),Ni.subVectors(r,n),ka.subVectors(t,n);const l=Di.dot(ka),c=Ni.dot(ka);if(l<=0&&c<=0)return e.copy(n);za.subVectors(t,i);const h=Di.dot(za),d=Ni.dot(za);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),e.copy(n).addScaledVector(Di,a);Va.subVectors(t,r);const f=Di.dot(Va),g=Ni.dot(Va);if(g>=0&&f<=g)return e.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Ni,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return Xc.subVectors(r,i),o=(d-h)/(d-h+(f-g)),e.copy(i).addScaledVector(Xc,o);const p=1/(m+v+u);return a=v*p,o=u*p,e.copy(n).addScaledVector(Di,a).addScaledVector(Ni,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class qn{constructor(t=new A(1/0,1/0,1/0),e=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,hn):hn.fromBufferAttribute(r,a),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),cr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cr.copy(n.boundingBox)),cr.applyMatrix4(t.matrixWorld),this.union(cr)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(_s),hr.subVectors(this.max,_s),Ui.subVectors(t.a,_s),Fi.subVectors(t.b,_s),Oi.subVectors(t.c,_s),jn.subVectors(Fi,Ui),ti.subVectors(Oi,Fi),mi.subVectors(Ui,Oi);let e=[0,-jn.z,jn.y,0,-ti.z,ti.y,0,-mi.z,mi.y,jn.z,0,-jn.x,ti.z,0,-ti.x,mi.z,0,-mi.x,-jn.y,jn.x,0,-ti.y,ti.x,0,-mi.y,mi.x,0];return!Xa(e,Ui,Fi,Oi,hr)||(e=[1,0,0,0,1,0,0,0,1],!Xa(e,Ui,Fi,Oi,hr))?!1:(ur.crossVectors(jn,ti),e=[ur.x,ur.y,ur.z],Xa(e,Ui,Fi,Oi,hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const In=[new A,new A,new A,new A,new A,new A,new A,new A],hn=new A,cr=new qn,Ui=new A,Fi=new A,Oi=new A,jn=new A,ti=new A,mi=new A,_s=new A,hr=new A,ur=new A,gi=new A;function Xa(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){gi.fromArray(s,r);const o=i.x*Math.abs(gi.x)+i.y*Math.abs(gi.y)+i.z*Math.abs(gi.z),l=t.dot(gi),c=e.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Me=new A,dr=new It;let Pp=0;class Ye extends Ti{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=sd,this.updateRanges=[],this.gpuType=an,this.version=0,this._normalizationScale=t!==void 0?va(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)dr.fromBufferAttribute(this,e),dr.applyMatrix3(t),this.setXY(e,dr.x,dr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):ql(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Yl(t,this.array)}}class hd extends Ye{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ud extends Ye{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends Ye{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Lp=new qn,vs=new A,qa=new A;class Yn{constructor(t=new A,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Lp.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vs.subVectors(t,this.center);const e=vs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(vs,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(qa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vs.copy(t.center).add(qa)),this.expandByPoint(vs.copy(t.center).sub(qa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Ip=0;const sn=new Wt,Ya=new _e,Bi=new A,Ke=new qn,xs=new qn,Re=new A;class Pe extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ip++}),this.uuid=An(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zf(t)?ud:hd)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Ya.lookAt(t),Ya.updateMatrix(),this.applyMatrix4(Ya.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ie(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Ct("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];xs.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(Ke.min,xs.min),Ke.expandByPoint(Re),Re.addVectors(Ke.max,xs.max),Ke.expandByPoint(Re)):(Ke.expandByPoint(xs.min),Ke.expandByPoint(xs.max))}Ke.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Re.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Re));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Re.fromBufferAttribute(o,c),l&&(Bi.fromBufferAttribute(t,c),Re.add(Bi)),i=Math.max(i,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Ye(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let I=0;I<n.count;I++)o[I]=new A,l[I]=new A;const h=new A,d=new A,u=new A,f=new It,g=new It,v=new It,m=new A,p=new A;function x(I,P,D){c[I]=c[P]=c[D]=1,h.fromBufferAttribute(n,I),d.fromBufferAttribute(n,P),u.fromBufferAttribute(n,D),f.fromBufferAttribute(r,I),g.fromBufferAttribute(r,P),v.fromBufferAttribute(r,D),d.sub(h),u.sub(h),g.sub(f),v.sub(f);const U=1/(g.x*v.y-v.x*g.y);isFinite(U)&&(m.copy(d).multiplyScalar(v.y).addScaledVector(u,-g.y).multiplyScalar(U),p.copy(u).multiplyScalar(g.x).addScaledVector(d,-v.x).multiplyScalar(U),o[I].add(m),o[P].add(m),o[D].add(m),l[I].add(p),l[P].add(p),l[D].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let I=0,P=T.length;I<P;++I){const D=T[I],U=D.start,O=D.count;for(let L=U,H=U+O;L<H;L+=3)x(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const b=new A,C=new A,w=new A,_=new A;function S(I){w.fromBufferAttribute(i,I),_.copy(w);const P=o[I];b.copy(P),b.sub(w.multiplyScalar(w.dot(P))).normalize(),C.crossVectors(_,P);const U=C.dot(l[I])<0?-1:1;a.setXYZW(I,b.x,b.y,b.z,U)}for(let I=0,P=n.count;I<P;++I)c[I]&&S(I);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new A,r=new A,a=new A,o=new A,l=new A,c=new A,h=new A,d=new A;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),v=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*h;for(let p=0;p<h;p++)u[g++]=c[f++]}return new Ye(u,h,d)}if(this.index===null)return Ct("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Pe,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dp{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=sd,this.updateRanges=[],this.version=0,this.uuid=An()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=qc(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);const n=new this.array.constructor(t.arrayBuffers[e]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});const e=qc(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const n={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}}function qc(s){return s.buffer._uuid===void 0&&(s.buffer._uuid=An()),s.byteOffset===0&&s.byteLength===s.buffer.byteLength?s.buffer._uuid:s.buffer._uuid+":"+s.byteOffset+":"+s.byteLength}const Ge=new A;class ca{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i,this._normalizationScale=t!==void 0?va(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix4(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyNormalMatrix(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.transformDirection(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){la("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ye(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ca(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){la("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):ql(t,this.data.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Yl(t,this.data.array)}}const $a=new A,Np=new A,Up=new kt;class ri{constructor(t=new A(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=$a.subVectors(n,e).cross(Np.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta($a),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Up.getNormalMatrix(t),i=this.coplanarPoint($a).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Fp=0;class $n extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=An(),this.name="",this.type="Material",this.blending=ts,this.side=Si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zu,this.blendDst=Vu,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pa,this.stencilZFail=Pa,this.stencilZPass=Pa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Ct(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Ct(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Lt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new ri().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new It().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new It().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ha extends $n{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ki;const Ms=new A,zi=new A,Vi=new A,Hi=new It,ys=new It,dd=new Wt,fr=new A,Ss=new A,pr=new A,Yc=new It,Ka=new It,$c=new It;class wl extends _e{constructor(t=new ha){if(super(),this.isSprite=!0,this.type="Sprite",ki===void 0){ki=new Pe;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Dp(e,5);ki.setIndex([0,1,2,0,2,3]),ki.setAttribute("position",new ca(n,3,0,!1)),ki.setAttribute("uv",new ca(n,2,3,!1))}this.geometry=ki,this.material=t,this.center=new It(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ot('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),zi.setFromMatrixScale(this.matrixWorld),dd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Vi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&zi.multiplyScalar(-Vi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;mr(fr.set(-.5,-.5,0),Vi,a,zi,i,r),mr(Ss.set(.5,-.5,0),Vi,a,zi,i,r),mr(pr.set(.5,.5,0),Vi,a,zi,i,r),Yc.set(0,0),Ka.set(1,0),$c.set(1,1);let o=t.ray.intersectTriangle(fr,Ss,pr,!1,Ms);if(o===null&&(mr(Ss.set(-.5,.5,0),Vi,a,zi,i,r),Ka.set(0,1),o=t.ray.intersectTriangle(fr,pr,Ss,!1,Ms),o===null))return;const l=t.ray.origin.distanceTo(Ms);l<t.near||l>t.far||e.push({distance:l,point:Ms.clone(),uv:rn.getInterpolation(Ms,fr,Ss,pr,Yc,Ka,$c,new It),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}toJSON(t){const e=super.toJSON(t);return e.object.center=this.center.toArray(),e}}function mr(s,t,e,n,i,r){Hi.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(ys.x=r*Hi.x-i*Hi.y,ys.y=i*Hi.x+r*Hi.y):ys.copy(Hi),s.copy(t),s.x+=ys.x,s.y+=ys.y,s.applyMatrix4(dd)}const Dn=new A,Za=new A,gr=new A,_r=new A;class xa{constructor(t=new A,e=new A(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Za.copy(t).add(e).multiplyScalar(.5),gr.copy(e).sub(t).normalize(),_r.copy(this.origin).sub(Za);const r=t.distanceTo(e)*.5,a=-this.direction.dot(gr),o=_r.dot(this.direction),l=-_r.dot(gr),c=_r.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){const v=1/h;d*=v,u*=v,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Za).addScaledVector(gr,u),f}intersectSphere(t,e){if(t.radius<0)return null;Dn.subVectors(t.center,this.origin);const n=Dn.dot(this.direction),i=Dn.dot(Dn)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,g=e.x-a.x,v=e.y-a.y,m=e.z-a.z,p=n.x-a.x,x=n.y-a.y,T=n.z-a.z,b=Math.abs(l),C=Math.abs(c),w=Math.abs(h);let _,S,I,P,D,U,O,L,H,q,W,et;if(b>=C&&b>=w?(I=l,U=d,H=g,et=p,l>=0?(_=c,S=h,P=u,D=f,O=v,L=m,q=x,W=T):(_=h,S=c,P=f,D=u,O=m,L=v,q=T,W=x)):C>=w?(I=c,U=u,H=v,et=x,c>=0?(_=h,S=l,P=f,D=d,O=m,L=g,q=T,W=p):(_=l,S=h,P=d,D=f,O=g,L=m,q=p,W=T)):(I=h,U=f,H=m,et=T,h>=0?(_=l,S=c,P=d,D=u,O=g,L=v,q=p,W=x):(_=c,S=l,P=u,D=d,O=v,L=g,q=x,W=p)),I===0)return null;const X=_/I,j=S/I,tt=1/I,yt=P-X*U,Ft=D-j*U,K=O-X*H,pt=L-j*H,xt=q-X*et,Et=W-j*et,lt=xt*pt-Et*K,Nt=yt*Et-Ft*xt,he=K*Ft-pt*yt;if(i){if(lt<0||Nt<0||he<0)return null}else if((lt<0||Nt<0||he<0)&&(lt>0||Nt>0||he>0))return null;const Ut=lt+Nt+he;if(Ut===0)return null;const te=tt*(lt*U+Nt*H+he*et);return(Ut>0?te<0:te>0)?null:this.at(te/Ut,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $s extends $n{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Fl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Kc=new Wt,_i=new xa,vr=new Yn,Zc=new A,xr=new A,Mr=new A,yr=new A,Ja=new A,Sr=new A,Jc=new A,br=new A;class wt extends _e{constructor(t=new Pe,e=new $s){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(Ja.fromBufferAttribute(d,t),a?Sr.addScaledVector(Ja,h):Sr.addScaledVector(Ja.sub(e),h))}e.add(Sr)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vr.copy(n.boundingSphere),vr.applyMatrix4(r),_i.copy(t.ray).recast(t.near),!(vr.containsPoint(_i.origin)===!1&&(_i.intersectSphere(vr,Zc)===null||_i.origin.distanceToSquared(Zc)>(t.far-t.near)**2))&&(Kc.copy(r).invert(),_i.copy(t.ray).applyMatrix4(Kc),!(n.boundingBox!==null&&_i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_i)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=a[m.materialIndex],x=Math.max(m.start,f.start),T=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,C=T;b<C;b+=3){const w=o.getX(b),_=o.getX(b+1),S=o.getX(b+2);i=wr(this,p,t,n,c,h,d,w,_,S),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=o.getX(m),T=o.getX(m+1),b=o.getX(m+2);i=wr(this,a,t,n,c,h,d,x,T,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=a[m.materialIndex],x=Math.max(m.start,f.start),T=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let b=x,C=T;b<C;b+=3){const w=b,_=b+1,S=b+2;i=wr(this,p,t,n,c,h,d,w,_,S),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,T=m+1,b=m+2;i=wr(this,a,t,n,c,h,d,x,T,b),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Op(s,t,e,n,i,r,a,o){let l;if(t.side===Ve?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Si,o),l===null)return null;br.copy(o),br.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(br);return c<e.near||c>e.far?null:{distance:c,point:br.clone(),object:s}}function wr(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,xr),s.getVertexPosition(l,Mr),s.getVertexPosition(c,yr);const h=Op(s,t,e,n,xr,Mr,yr,Jc);if(h){const d=new A;rn.getBarycoord(Jc,xr,Mr,yr,d),i&&(h.uv=rn.getInterpolatedAttribute(i,o,l,c,d,new It)),r&&(h.uv1=rn.getInterpolatedAttribute(r,o,l,c,d,new It)),a&&(h.normal=rn.getInterpolatedAttribute(a,o,l,c,d,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new A,materialIndex:0};rn.getNormal(xr,Mr,yr,u.normal),h.face=u,h.barycoord=d}return h}const bs=new ae,Qc=new ae,jc=new ae,Bp=new ae,th=new Wt,Er=new A,Qa=new Yn,eh=new Wt,ja=new xa;class iy extends wt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ac,this.bindMatrix=new Wt,this.bindMatrixInverse=new Wt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new qn),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Er),this.boundingBox.expandByPoint(Er)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Yn),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Er),this.boundingSphere.expandByPoint(Er)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}raycast(t,e){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qa.copy(this.boundingSphere),Qa.applyMatrix4(i),t.ray.intersectsSphere(Qa)!==!1&&(eh.copy(i).invert(),ja.copy(t.ray).applyMatrix4(eh),!(this.boundingBox!==null&&ja.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,ja)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new ae,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ac?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===kf?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ct("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,i=this.geometry;Qc.fromBufferAttribute(i.attributes.skinIndex,t),jc.fromBufferAttribute(i.attributes.skinWeight,t),e.isVector4?(bs.copy(e),e.set(0,0,0,0)):(bs.set(e.x,e.y,e.z,1),e.set(0,0,0)),bs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=jc.getComponent(r);if(a!==0){const o=Qc.getComponent(r);th.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Bp.copy(bs).applyMatrix4(th),a)}}return e.isVector4&&(e.w=bs.w),e.applyMatrix4(this.bindMatrixInverse)}}class kp extends _e{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Zl extends Ue{constructor(t=null,e=1,n=1,i,r,a,o,l,c=Ne,h=Ne,d,u){super(null,a,o,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const nh=new Wt,zp=new Wt;class fd{constructor(t=[],e=[]){this.uuid=An(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){Ct("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Wt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new Wt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:zp;nh.multiplyMatrices(o,e[r]),nh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new fd(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new Zl(e,t,t,un,an);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){const r=t.bones[n];let a=e[r];a===void 0&&(Ct("Skeleton: No bone found with UUID:",r),a=new kp),this.bones.push(a),this.boneInverses.push(new Wt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){const a=e[i];t.bones.push(a.uuid);const o=n[i];t.boneInverses.push(o.toArray())}return t}}class ih extends Ye{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Gi=new Wt,sh=new Wt,Tr=[],rh=new qn,Vp=new Wt,ws=new wt,Es=new Yn;class sy extends wt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ih(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Vp)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new qn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Gi),rh.copy(t.boundingBox).applyMatrix4(Gi),this.boundingBox.union(rh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Yn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Gi),Es.copy(t.boundingSphere).applyMatrix4(Gi),this.boundingSphere.union(Es)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(ws.geometry=this.geometry,ws.material=this.material,ws.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Es.copy(this.boundingSphere),Es.applyMatrix4(n),t.ray.intersectsSphere(Es)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Gi),sh.multiplyMatrices(n,Gi),ws.matrixWorld=sh,ws.raycast(t,Tr);for(let a=0,o=Tr.length;a<o;a++){const l=Tr[a];l.instanceId=r,l.object=this,e.push(l)}Tr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ih(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zl(new Float32Array(i*this.count),i,this.count,Vl,an));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const vi=new Yn,Hp=new It(.5,.5),Ar=new A;class Ks{constructor(t=new ri,e=new ri,n=new ri,i=new ri,r=new ri,a=new ri){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn,n=!1){const i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],x=r[12],T=r[13],b=r[14],C=r[15];if(i[0].setComponents(c-a,f-h,p-g,C-x).normalize(),i[1].setComponents(c+a,f+h,p+g,C+x).normalize(),i[2].setComponents(c+o,f+d,p+v,C+T).normalize(),i[3].setComponents(c-o,f-d,p-v,C-T).normalize(),n)i[4].setComponents(l,u,m,b).normalize(),i[5].setComponents(c-l,f-u,p-m,C-b).normalize();else if(i[4].setComponents(c-l,f-u,p-m,C-b).normalize(),e===dn)i[5].setComponents(c+l,f+u,p+m,C+b).normalize();else if(e===qs)i[5].setComponents(l,u,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vi)}intersectsSprite(t){vi.center.set(0,0,0);const e=Hp.distanceTo(t.center);return vi.radius=.7071067811865476+e,vi.applyMatrix4(t.matrixWorld),this.intersectsSphere(vi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Ar.x=i.normal.x>0?t.max.x:t.min.x,Ar.y=i.normal.y>0?t.max.y:t.min.y,Ar.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ar)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const ah=new Wt;class Jl{constructor(){this.coordinateSystem=dn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){const r=e[i];ah.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new Ks),n[i].setFromProjectionMatrix(ah,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new Ks),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new Jl().copy(this)}}class Gp extends $n{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Lt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ua=new A,da=new A,oh=new Wt,Ts=new xa,Rr=new Yn,to=new A,lh=new A;class pd extends _e{constructor(t=new Pe,e=new Gp){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)ua.fromBufferAttribute(e,i-1),da.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=ua.distanceTo(da);t.setAttribute("lineDistance",new ie(n,1))}else Ct("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(i),Rr.radius+=r,t.ray.intersectsSphere(Rr)===!1)return;oh.copy(i).invert(),Ts.copy(t.ray).applyMatrix4(oh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=h.getX(v),x=h.getX(v+1),T=Cr(this,t,Ts,l,p,x,v);T&&e.push(T)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=Cr(this,t,Ts,l,v,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let v=f,m=g-1;v<m;v+=c){const p=Cr(this,t,Ts,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=Cr(this,t,Ts,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Cr(s,t,e,n,i,r,a){const o=s.geometry.attributes.position;if(ua.fromBufferAttribute(o,i),da.fromBufferAttribute(o,r),e.distanceSqToSegment(ua,da,to,lh)>n)return;to.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(to);if(!(c<t.near||c>t.far))return{distance:c,point:lh.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const ch=new A,hh=new A;class ry extends pd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)ch.fromBufferAttribute(e,i),hh.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ch.distanceTo(hh);t.setAttribute("lineDistance",new ie(n,1))}else Ct("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ay extends pd{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Wp extends $n{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const uh=new Wt,El=new xa,Pr=new Yn,Lr=new A;class Xp extends _e{constructor(t=new Pe,e=new Wp){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(i),Pr.radius+=r,t.ray.intersectsSphere(Pr)===!1)return;uh.copy(i).invert(),El.copy(t.ray).applyMatrix4(uh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=u,v=f;g<v;g++){const m=c.getX(g);Lr.fromBufferAttribute(d,m),dh(Lr,m,l,i,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,v=f;g<v;g++)Lr.fromBufferAttribute(d,g),dh(Lr,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function dh(s,t,e,n,i,r,a){const o=El.distanceSqToPoint(s);if(o<e){const l=new A;El.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class md extends Ue{constructor(t=[],e=as,n,i,r,a,o,l,c,h){super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ql extends Ue{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cs extends Ue{constructor(t,e,n=bn,i,r,a,o=Ne,l=Ne,c,h=hi,d=1){if(h!==hi&&h!==ci)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new $l(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class gd extends cs{constructor(t,e=bn,n=as,i,r,a=Ne,o=Ne,l,c=hi){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class _d extends Ue{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ze extends Pe{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(d,2));function g(v,m,p,x,T,b,C,w,_,S,I){const P=b/_,D=C/S,U=b/2,O=C/2,L=w/2,H=_+1,q=S+1;let W=0,et=0;const X=new A;for(let j=0;j<q;j++){const tt=j*D-O;for(let yt=0;yt<H;yt++){const Ft=yt*P-U;X[v]=Ft*x,X[m]=tt*T,X[p]=L,c.push(X.x,X.y,X.z),X[v]=0,X[m]=0,X[p]=w>0?1:-1,h.push(X.x,X.y,X.z),d.push(yt/_),d.push(1-j/S),W+=1}}for(let j=0;j<S;j++)for(let tt=0;tt<_;tt++){const yt=u+tt+H*j,Ft=u+tt+H*(j+1),K=u+(tt+1)+H*(j+1),pt=u+(tt+1)+H*j;l.push(yt,Ft,pt),l.push(Ft,K,pt),et+=6}o.addGroup(f,et,I),f+=et,u+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ze(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class wi extends Pe{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,g=n*2+r,v=i+1,m=new A,p=new A;for(let x=0;x<=g;x++){let T=0,b=0,C=0,w=0;if(x<=n){const I=x/n,P=I*Math.PI/2;b=-h-t*Math.cos(P),C=t*Math.sin(P),w=-t*Math.cos(P),T=I*d}else if(x<=n+r){const I=(x-n)/r;b=-h+I*e,C=t,w=0,T=d+I*u}else{const I=(x-n-r)/n,P=I*Math.PI/2;b=h+t*Math.sin(P),C=t*Math.cos(P),w=t*Math.sin(P),T=d+u+I*d}const _=Math.max(0,Math.min(1,T/f));let S=0;x===0?S=.5/i:x===g&&(S=-.5/i);for(let I=0;I<=i;I++){const P=I/i,D=P*Math.PI*2,U=Math.sin(D),O=Math.cos(D);p.x=-C*O,p.y=b,p.z=C*U,o.push(p.x,p.y,p.z),m.set(-C*O,w,C*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(P+S,_)}if(x>0){const I=(x-1)*v;for(let P=0;P<i;P++){const D=I+P,U=I+P+1,O=x*v+P,L=x*v+P+1;a.push(D,U,O),a.push(U,L,O)}}}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wi(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class is extends Pe{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new A,h=new It;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=n+d/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(o,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new is(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ve extends Pe{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const v=[],m=n/2;let p=0;x(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ie(d,3)),this.setAttribute("normal",new ie(u,3)),this.setAttribute("uv",new ie(f,2));function x(){const b=new A,C=new A;let w=0;const _=(e-t)/n;for(let S=0;S<=r;S++){const I=[],P=S/r,D=P*(e-t)+t;for(let U=0;U<=i;U++){const O=U/i,L=O*l+o,H=Math.sin(L),q=Math.cos(L);C.x=D*H,C.y=-P*n+m,C.z=D*q,d.push(C.x,C.y,C.z),b.set(H,_,q).normalize(),u.push(b.x,b.y,b.z),f.push(O,1-P),I.push(g++)}v.push(I)}for(let S=0;S<i;S++)for(let I=0;I<r;I++){const P=v[I][S],D=v[I+1][S],U=v[I+1][S+1],O=v[I][S+1];(t>0||I!==0)&&(h.push(P,D,O),w+=3),(e>0||I!==r-1)&&(h.push(D,U,O),w+=3)}c.addGroup(p,w,0),p+=w}function T(b){const C=g,w=new It,_=new A;let S=0;const I=b===!0?t:e,P=b===!0?1:-1;for(let U=1;U<=i;U++)d.push(0,m*P,0),u.push(0,P,0),f.push(.5,.5),g++;const D=g;for(let U=0;U<=i;U++){const L=U/i*l+o,H=Math.cos(L),q=Math.sin(L);_.x=I*q,_.y=m*P,_.z=I*H,d.push(_.x,_.y,_.z),u.push(0,P,0),w.x=H*.5+.5,w.y=q*.5*P+.5,f.push(w.x,w.y),g++}for(let U=0;U<i;U++){const O=C+U,L=D+U;b===!0?h.push(L,L+1,O):h.push(L+1,L,O),S+=3}c.addGroup(p,S,b===!0?1:2),p+=S}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ve(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Bn extends ve{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Bn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qs extends Pe{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=t/o,u=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*u-a;for(let T=0;T<c;T++){const b=T*d-r;g.push(b,-x,0),v.push(0,0,1),m.push(T/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<o;x++){const T=x+c*p,b=x+c*(p+1),C=x+1+c*(p+1),w=x+1+c*p;f.push(T,b,w),f.push(b,C,w)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qs(t.width,t.height,t.widthSegments,t.heightSegments)}}class Zs extends Pe{constructor(t=.5,e=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let d=t;const u=(e-t)/i,f=new A,g=new It;for(let v=0;v<=i;v++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let v=0;v<i;v++){const m=v*(n+1);for(let p=0;p<n;p++){const x=p+m,T=x,b=x+n+1,C=x+n+2,w=x+1;o.push(T,b,w),o.push(b,C,w)}}this.setIndex(o),this.setAttribute("position",new ie(l,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ce extends Pe{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new A,u=new A,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],T=p/n,b=a+T*o,C=t*Math.cos(b),w=Math.sqrt(t*t-C*C);let _=0;p===0&&a===0?_=.5/e:p===n&&l===Math.PI&&(_=-.5/e);for(let S=0;S<=e;S++){const I=S/e,P=i+I*r;d.x=-w*Math.cos(P),d.y=C,d.z=w*Math.sin(P),g.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),m.push(I+_,1-T),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const T=h[p][x+1],b=h[p][x],C=h[p+1][x],w=h[p+1][x+1];(p!==0||a>0)&&f.push(T,b,w),(p!==n-1||l<Math.PI)&&f.push(b,C,w)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ui extends Pe{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],d=[],u=new A,f=new A,g=new A;for(let v=0;v<=n;v++){const m=a+v/n*o;for(let p=0;p<=i;p++){const x=p/i*r;f.x=(t+e*Math.cos(m))*Math.cos(x),f.y=(t+e*Math.cos(m))*Math.sin(x),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(p/i),d.push(v/n)}}for(let v=1;v<=n;v++)for(let m=1;m<=i;m++){const p=(i+1)*v+m-1,x=(i+1)*(v-1)+m-1,T=(i+1)*(v-1)+m,b=(i+1)*v+m;l.push(p,x,b),l.push(x,T,b)}this.setIndex(l),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ui(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}function hs(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(fh(i))i.isRenderTargetTexture?(Ct("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(fh(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function We(s){const t={};for(let e=0;e<s.length;e++){const n=hs(s[e]);for(const i in n)t[i]=n[i]}return t}function fh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function qp(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function vd(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const Yp={clone:hs,merge:We};var $p=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Tn extends $n{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$p,this.fragmentShader=Kp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=hs(t.uniforms),this.uniformsGroups=qp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Lt().setHex(i.value);break;case"v2":this.uniforms[n].value=new It().fromArray(i.value);break;case"v3":this.uniforms[n].value=new A().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ae().fromArray(i.value);break;case"m3":this.uniforms[n].value=new kt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Wt().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Zp extends Tn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Jp extends $n{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ra,this.normalScale=new It(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class oy extends Jp{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new It(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Xt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Lt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Lt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Lt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return es('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){es('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Qp extends $n{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ra,this.normalScale=new It(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Fl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class jp extends $n{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class tm extends $n{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}function ai(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Us(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function em(s){function t(i,r){return s[i]-s[r]}const e=s.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function ph(s,t,e){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let l=0;l!==t;++l)i[a++]=s[o+l]}return i}function nm(s,t,e,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=s[i++];while(r!==void 0)}class js{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break t}a=e.length;break e}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class im extends js{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cc,endingEnd:Cc}}intervalChanged_(t,e,n){const i=this.parameterPositions;let r=t-2,a=t+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Pc:r=t,o=2*e-n;break;case Lc:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Pc:a=t,l=2*n-e;break;case Lc:a=1,l=n+i[1]-i[0];break;default:a=t-1,l=e}const c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),v=g*g,m=v*g,p=-u*m+2*u*v-u*g,x=(1+u)*m+(-1.5-2*u)*v+(-.5+u)*g+1,T=(-1-f)*m+(1.5+f)*v+.5*g,b=f*m-f*v;for(let C=0;C!==o;++C)r[C]=p*a[h+C]+x*a[c+C]+T*a[l+C]+b*a[d+C];return r}}class sm extends js{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}}class rm extends js{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}}class am extends js{interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const g=(n-e)/(i-e),v=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*v+a[l+m]*g;return r}const u=o*2,f=t-1;for(let g=0;g!==o;++g){const v=a[c+g],m=a[l+g],p=f*u+g*2,x=d[p],T=d[p+1],b=t*u+g*2,C=h[b],w=h[b+1],_=lm(n,e,x,C,i);r[g]=xd(_,v,T,w,m)}return r}}function xd(s,t,e,n,i){const r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function om(s,t,e,n,i){const r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function lm(s,t,e,n,i){let r=(s-t)/(i-t);for(let a=0;a<8;a++){const o=xd(r,t,e,n,i)-s;if(Math.abs(o)<1e-10)break;const l=om(r,t,e,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class pn{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ai(e,this.TimeBufferType),this.values=ai(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ai(t.times,Array),values:ai(t.values,Array)};const i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),Us(t.settings)&&(n.settings={inTangents:ai(t.settings.inTangents,Array),outTangents:ai(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new rm(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new sm(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new im(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new am(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case sa:e=this.InterpolantFactoryMethodDiscrete;break;case bl:e=this.InterpolantFactoryMethodLinear;break;case Ca:e=this.InterpolantFactoryMethodSmooth;break;case Rc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ct("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return sa;case this.InterpolantFactoryMethodLinear:return bl;case this.InterpolantFactoryMethodSmooth:return Ca;case this.InterpolantFactoryMethodBezier:return Rc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t;Us(this.settings)&&(mh(this.settings.inTangents,t),mh(this.settings.outTangents,t))}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;Us(this.settings)&&(gh(this.settings.inTangents,t),gh(this.settings.outTangents,t))}return this}trim(t,e){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Ot("KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Ot("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ot("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ot("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(i!==void 0&&Jf(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ot("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ca,r=t.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(i)l=!0;else{const d=o*n,u=d-n,f=d+n;for(let g=0;g!==n;++g){const v=e[d+g];if(v!==e[u+g]||v!==e[f+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];const d=o*n,u=a*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,Us(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function mh(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]+=t}function gh(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}pn.prototype.ValueTypeName="";pn.prototype.TimeBufferType=Float32Array;pn.prototype.ValueBufferType=Float32Array;pn.prototype.DefaultInterpolation=bl;class ds extends pn{constructor(t,e,n){super(t,e,n)}}ds.prototype.ValueTypeName="bool";ds.prototype.ValueBufferType=Array;ds.prototype.DefaultInterpolation=sa;ds.prototype.InterpolantFactoryMethodLinear=void 0;ds.prototype.InterpolantFactoryMethodSmooth=void 0;class Md extends pn{constructor(t,e,n,i){super(t,e,n,i)}}Md.prototype.ValueTypeName="color";class jl extends pn{constructor(t,e,n,i){super(t,e,n,i)}}jl.prototype.ValueTypeName="number";class cm extends js{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(i-e);let c=t*o;for(let h=c+o;c!==h;c+=4)Kt.slerpFlat(r,0,a,c-o,a,c,l);return r}}class tc extends pn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new cm(this.times,this.values,this.getValueSize(),t)}}tc.prototype.ValueTypeName="quaternion";tc.prototype.InterpolantFactoryMethodSmooth=void 0;class fs extends pn{constructor(t,e,n){super(t,e,n)}}fs.prototype.ValueTypeName="string";fs.prototype.ValueBufferType=Array;fs.prototype.DefaultInterpolation=sa;fs.prototype.InterpolantFactoryMethodLinear=void 0;fs.prototype.InterpolantFactoryMethodSmooth=void 0;class yd extends pn{constructor(t,e,n,i){super(t,e,n,i)}}yd.prototype.ValueTypeName="vector";class ly{constructor(t="",e=-1,n=[],i=Vf){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=An(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,i=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(um(n[a]).scale(i));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){const e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,a=n.length;r!==a;++r)e.push(pn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(t,e,n,i){const r=e.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=em(l);l=ph(l,1,h),c=ph(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new jl(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){const c=t[o],h=c.name.match(r);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],e,n));return a}resetDuration(){const t=this.tracks;let e=0;for(let n=0,i=t.length;n!==i;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function hm(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return jl;case"vector":case"vector2":case"vector3":case"vector4":return yd;case"color":return Md;case"quaternion":return tc;case"bool":case"boolean":return ds;case"string":return fs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function um(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=hm(s.type);if(s.times===void 0){const n=[],i=[];nm(s.keys,n,i,"value"),s.times=n,s.values=i}let e;return t.parse!==void 0?e=t.parse(s):e=new t(s.name,s.times,s.values,s.interpolation),Us(s.settings)&&(e.settings={inTangents:ai(s.settings.inTangents,Float32Array),outTangents:ai(s.settings.outTangents,Float32Array)}),e}const zn={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(_h(s)||(this.files[s]=t))},get:function(s){if(this.enabled!==!1&&!_h(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function _h(s){try{const t=s.slice(s.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class dm{constructor(t,e,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const fm=new dm;class tr{constructor(t){this.manager=t!==void 0?t:fm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}}tr.DEFAULT_MATERIAL_NAME="__DEFAULT";const Nn={};class pm extends Error{constructor(t,e){super(t),this.response=e}}class cy extends tr{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=zn.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(Nn[t]!==void 0){Nn[t].push({onLoad:e,onProgress:n,onError:i});return}Nn[t]=[],Nn[t].push({onLoad:e,onProgress:n,onError:i});const a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ct("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Nn[t],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=u?parseInt(u):0,g=f!==0;let v=0;const m=new ReadableStream({start(p){x();function x(){d.read().then(({done:T,value:b})=>{if(T)p.close();else{v+=b.byteLength;const C=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:f});for(let w=0,_=h.length;w<_;w++){const S=h[w];S.onProgress&&S.onProgress(C)}p.enqueue(b),x()}},T=>{p.error(T)})}}});return new Response(m)}else throw new pm(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{zn.add(`file:${t}`,c);const h=Nn[t];delete Nn[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=Nn[t];if(h===void 0)throw this.manager.itemError(t),c;delete Nn[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Wi=new WeakMap;class mm extends tr{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=zn.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let d=Wi.get(a);d===void 0&&(d=[],Wi.set(a,d)),d.push({onLoad:e,onError:i})}return a}const o=Ys("img");function l(){h(),e&&e(this);const d=Wi.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}Wi.delete(this),r.manager.itemEnd(t)}function c(d){h(),i&&i(d),zn.remove(`image:${t}`);const u=Wi.get(this)||[];for(let f=0;f<u.length;f++){const g=u[f];g.onError&&g.onError(d)}Wi.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),zn.add(`image:${t}`,o),r.manager.itemStart(t),o.fetchPriority=this.priority,o.src=t,o}}class gm extends tr{constructor(t){super(t)}load(t,e,n,i){const r=new Ue,a=new mm(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}}class Ma extends _e{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Lt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class _m extends Ma{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Lt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const eo=new Wt,vh=new A,xh=new A;class ec{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new It(512,512),this.mapType=Qe,this.map=null,this.mapPass=null,this.matrix=new Wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ks,this._frameExtents=new It(1,1),this._viewportCount=1,this._viewports=[new ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;vh.setFromMatrixPosition(t.matrixWorld),e.position.copy(vh),xh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(xh),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){eo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(eo,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===qs||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(eo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ir=new A,Dr=new Kt,gn=new A;class Sd extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Wt,this.projectionMatrix=new Wt,this.projectionMatrixInverse=new Wt,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ir,Dr,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ir,Dr,gn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Ir,Dr,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ir,Dr,gn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ei=new A,Mh=new It,yh=new It;class Je extends Sd{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ls*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(zs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ls*2*Math.atan(Math.tan(zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ei.x,ei.y).multiplyScalar(-t/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ei.x,ei.y).multiplyScalar(-t/ei.z)}getViewSize(t,e){return this.getViewBounds(t,Mh,yh),e.subVectors(yh,Mh)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(zs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class vm extends ec{constructor(){super(new Je(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,n=ls*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||i!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=i,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}}class hy extends Ma{constructor(t,e,n=0,i=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new vm}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class xm extends ec{constructor(){super(new Je(90,1,.5,500)),this.isPointLightShadow=!0}}class uy extends Ma{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new xm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class bd extends Sd{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Mm extends ec{constructor(){super(new bd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ym extends Ma{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new Mm}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class dy{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}const no=new WeakMap;class fy extends tr{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ct("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ct("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,a=zn.get(`image-bitmap:${t}`);if(a!==void 0){if(r.manager.itemStart(t),a.then){a.then(c=>{no.has(a)===!0?(i&&i(no.get(a)),r.manager.itemError(t),r.manager.itemEnd(t)):(e&&e(c),r.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(t,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return zn.add(`image-bitmap:${t}`,c),e&&e(c),r.manager.itemEnd(t),c}).catch(function(c){i&&i(c),no.set(l,c),zn.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});zn.add(`image-bitmap:${t}`,l),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Xi=-90,qi=1;class Tl extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Je(Xi,qi,t,e);i.layers=this.layers,this.add(i);const r=new Je(Xi,qi,t,e);r.layers=this.layers,this.add(r);const a=new Je(Xi,qi,t,e);a.layers=this.layers,this.add(a);const o=new Je(Xi,qi,t,e);o.layers=this.layers,this.add(o);const l=new Je(Xi,qi,t,e);l.layers=this.layers,this.add(l);const c=new Je(Xi,qi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===qs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=v,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Sm extends Je{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}const nc="\\[\\]\\.:\\/",bm=new RegExp("["+nc+"]","g"),ic="[^"+nc+"]",wm="[^"+nc.replace("\\.","")+"]",Em=/((?:WC+[\/:])*)/.source.replace("WC",ic),Tm=/(WCOD+)?/.source.replace("WCOD",wm),Am=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ic),Rm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ic),Cm=new RegExp("^"+Em+Tm+Am+Rm+"$"),Pm=["material","materials","bones","map"];class Lm{constructor(t,e,n){const i=n||re.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class re{constructor(t,e,n){this.path=e,this.parsedPath=n||re.parseTrackName(e),this.node=re.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new re.Composite(t,e,n):new re(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(bm,"")}static parseTrackName(t){const e=Cm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Pm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const l=n(o.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,i=e.propertyName;let r=e.propertyIndex;if(t||(t=re.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ct("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ot("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ot("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ot("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ot("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ot("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const a=t[i];if(a===void 0){const c=e.nodeName;Ot("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}re.Composite=Lm;re.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};re.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};re.prototype.GetterByBindingType=[re.prototype._getValue_direct,re.prototype._getValue_array,re.prototype._getValue_arrayElement,re.prototype._getValue_toArray];re.prototype.SetterByBindingTypeAndVersioning=[[re.prototype._setValue_direct,re.prototype._setValue_direct_setNeedsUpdate,re.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[re.prototype._setValue_array,re.prototype._setValue_array_setNeedsUpdate,re.prototype._setValue_array_setMatrixWorldNeedsUpdate],[re.prototype._setValue_arrayElement,re.prototype._setValue_arrayElement_setNeedsUpdate,re.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[re.prototype._setValue_fromArray,re.prototype._setValue_fromArray_setNeedsUpdate,re.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function Sh(s,t,e,n){const i=Im(n);switch(e){case ju:return s*t;case Vl:return s*t/i.components*i.byteLength;case Hl:return s*t/i.components*i.byteLength;case bi:return s*t*2/i.components*i.byteLength;case Gl:return s*t*2/i.components*i.byteLength;case td:return s*t*3/i.components*i.byteLength;case un:return s*t*4/i.components*i.byteLength;case Wl:return s*t*4/i.components*i.byteLength;case $r:case Kr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Zr:case Jr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case $o:case Zo:return Math.max(s,16)*Math.max(t,8)/4;case Yo:case Ko:return Math.max(s,8)*Math.max(t,8)/2;case Jo:case Qo:case tl:case el:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case jo:case na:case nl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case il:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case sl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case rl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case al:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ol:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ll:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case cl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case hl:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ul:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case dl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case fl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case pl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case ml:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case gl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case _l:case vl:case xl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Ml:case yl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case ia:case Sl:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Im(s){switch(s){case Qe:case Ku:return{byteLength:1,components:1};case Xs:case Zu:case wn:return{byteLength:2,components:1};case kl:case zl:return{byteLength:2,components:4};case bn:case Bl:case an:return{byteLength:4,components:1};case Ju:case Qu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ul}}));typeof window<"u"&&(window.__THREE__?Ct("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ul);function wd(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Dm(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,d[u]=v)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const v=d[f];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Nm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Um=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Fm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Om=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,km=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Vm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Gm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ym=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,$m=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Km=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,t0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,e0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,n0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,i0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,s0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,r0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,a0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,l0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,c0="gl_FragColor = linearToOutputTexel( gl_FragColor );",h0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,u0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,d0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,p0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,m0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,g0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,v0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,x0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,M0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,y0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,S0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,E0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,T0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,A0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,R0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,C0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,P0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,L0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,I0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,D0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,N0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,U0=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,F0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,O0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,B0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,k0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,z0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,V0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,H0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,G0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,W0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,X0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,q0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Y0=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,K0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Z0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,J0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Q0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,j0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,eg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ng=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ig=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ag=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,og=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,lg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ug=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,pg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,mg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,gg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,_g=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,vg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,xg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Mg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,yg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,bg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Eg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ag=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Rg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ng=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fg=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,zg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Vg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Hg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Wg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,$g=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Qg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,t_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,e_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,s_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,l_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,c_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,u_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,d_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gt={alphahash_fragment:Nm,alphahash_pars_fragment:Um,alphamap_fragment:Fm,alphamap_pars_fragment:Om,alphatest_fragment:Bm,alphatest_pars_fragment:km,aomap_fragment:zm,aomap_pars_fragment:Vm,batching_pars_vertex:Hm,batching_vertex:Gm,begin_vertex:Wm,beginnormal_vertex:Xm,bsdfs:qm,iridescence_fragment:Ym,bumpmap_pars_fragment:$m,clipping_planes_fragment:Km,clipping_planes_pars_fragment:Zm,clipping_planes_pars_vertex:Jm,clipping_planes_vertex:Qm,color_fragment:jm,color_pars_fragment:t0,color_pars_vertex:e0,color_vertex:n0,common:i0,defaultnormal_vertex:s0,displacementmap_pars_vertex:r0,displacementmap_vertex:a0,emissivemap_fragment:o0,emissivemap_pars_fragment:l0,colorspace_fragment:c0,colorspace_pars_fragment:h0,envmap_fragment:u0,envmap_common_pars_fragment:d0,envmap_pars_fragment:f0,envmap_pars_vertex:p0,envmap_physical_pars_fragment:E0,envmap_vertex:m0,fog_vertex:g0,fog_pars_vertex:_0,fog_fragment:v0,fog_pars_fragment:x0,gradientmap_pars_fragment:M0,lightmap_pars_fragment:y0,lights_lambert_fragment:S0,lights_lambert_pars_fragment:b0,lights_pars_begin:w0,lights_toon_fragment:T0,lights_toon_pars_fragment:A0,lights_phong_fragment:R0,lights_phong_pars_fragment:C0,lights_physical_fragment:P0,lights_physical_pars_fragment:L0,lights_fragment_begin:I0,lights_fragment_maps:D0,lights_fragment_end:N0,lightprobes_pars_fragment:U0,logdepthbuf_fragment:F0,logdepthbuf_pars_fragment:O0,logdepthbuf_pars_vertex:B0,logdepthbuf_vertex:k0,map_fragment:z0,map_pars_fragment:V0,map_particle_fragment:H0,map_particle_pars_fragment:G0,metalnessmap_fragment:W0,metalnessmap_pars_fragment:X0,morphinstance_vertex:q0,morphcolor_vertex:Y0,morphnormal_vertex:$0,morphtarget_pars_vertex:K0,morphtarget_vertex:Z0,normal_fragment_begin:J0,normal_fragment_maps:Q0,normal_pars_fragment:j0,normal_pars_vertex:tg,normal_vertex:eg,normalmap_pars_fragment:ng,clearcoat_normal_fragment_begin:ig,clearcoat_normal_fragment_maps:sg,clearcoat_pars_fragment:rg,iridescence_pars_fragment:ag,opaque_fragment:og,packing:lg,premultiplied_alpha_fragment:cg,project_vertex:hg,dithering_fragment:ug,dithering_pars_fragment:dg,roughnessmap_fragment:fg,roughnessmap_pars_fragment:pg,shadowmap_pars_fragment:mg,shadowmap_pars_vertex:gg,shadowmap_vertex:_g,shadowmask_pars_fragment:vg,skinbase_vertex:xg,skinning_pars_vertex:Mg,skinning_vertex:yg,skinnormal_vertex:Sg,specularmap_fragment:bg,specularmap_pars_fragment:wg,tonemapping_fragment:Eg,tonemapping_pars_fragment:Tg,transmission_fragment:Ag,transmission_pars_fragment:Rg,uv_pars_fragment:Cg,uv_pars_vertex:Pg,uv_vertex:Lg,worldpos_vertex:Ig,background_vert:Dg,background_frag:Ng,backgroundCube_vert:Ug,backgroundCube_frag:Fg,cube_vert:Og,cube_frag:Bg,depth_vert:kg,depth_frag:zg,distance_vert:Vg,distance_frag:Hg,equirect_vert:Gg,equirect_frag:Wg,linedashed_vert:Xg,linedashed_frag:qg,meshbasic_vert:Yg,meshbasic_frag:$g,meshlambert_vert:Kg,meshlambert_frag:Zg,meshmatcap_vert:Jg,meshmatcap_frag:Qg,meshnormal_vert:jg,meshnormal_frag:t_,meshphong_vert:e_,meshphong_frag:n_,meshphysical_vert:i_,meshphysical_frag:s_,meshtoon_vert:r_,meshtoon_frag:a_,points_vert:o_,points_frag:l_,shadow_vert:c_,shadow_frag:h_,sprite_vert:u_,sprite_frag:d_},_t={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new It(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new It(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},Mn={basic:{uniforms:We([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:We([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Lt(0)},envMapIntensity:{value:1}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:We([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:We([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:We([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:We([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:We([_t.points,_t.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:We([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:We([_t.common,_t.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:We([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:We([_t.sprite,_t.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distance:{uniforms:We([_t.common,_t.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distance_vert,fragmentShader:Gt.distance_frag},shadow:{uniforms:We([_t.lights,_t.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};Mn.physical={uniforms:We([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new It(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new kt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new It},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new It},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const Nr={r:0,b:0,g:0},f_=new Wt,Ed=new kt;Ed.set(-1,0,0,0,1,0,0,0,1);function p_(s,t,e,n,i,r){const a=new Lt(0);let o=i===!0?0:1,l,c,h=null,d=0,u=null;function f(x){let T=x.isScene===!0?x.background:null;if(T&&T.isTexture){const b=x.backgroundBlurriness>0;T=t.get(T,b)}return T}function g(x){let T=!1;const b=f(x);b===null?m(a,o):b&&b.isColor&&(m(b,1),T=!0);const C=s.xr.getEnvironmentBlendMode();C==="additive"?e.buffers.color.setClear(0,0,0,1,r):C==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(x,T){const b=f(T);b&&b.isCubeTexture?(c===void 0&&(c=new wt(new Ze(1,1,1),new Tn({name:"BackgroundCubeMaterial",uniforms:hs(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(C,w,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(f_.makeRotationFromEuler(T.backgroundRotation)).transpose(),b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ed),c.material.toneMapped=Zt.getTransfer(b.colorSpace)!==ne,(h!==b||d!==b.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=b,d=b.version,u=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new wt(new Qs(2,2),new Tn({name:"BackgroundMaterial",uniforms:hs(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Zt.getTransfer(b.colorSpace)!==ne,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||d!==b.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=b,d=b.version,u=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,T){x.getRGB(Nr,vd(s)),e.buffers.color.setClear(Nr.r,Nr.g,Nr.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,T=1){a.set(x),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,m(a,o)},render:g,addToRenderList:v,dispose:p}}function m_(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,a=!1;function o(D,U,O,L,H){let q=!1;const W=d(D,L,O,U);r!==W&&(r=W,c(r.object)),q=f(D,L,O,H),q&&g(D,L,O,H),H!==null&&t.update(H,s.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,b(D,U,O,L),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function d(D,U,O,L){const H=L.wireframe===!0;let q=n[U.id];q===void 0&&(q={},n[U.id]=q);const W=D.isInstancedMesh===!0?D.id:0;let et=q[W];et===void 0&&(et={},q[W]=et);let X=et[O.id];X===void 0&&(X={},et[O.id]=X);let j=X[H];return j===void 0&&(j=u(l()),X[H]=j),j}function u(D){const U=[],O=[],L=[];for(let H=0;H<e;H++)U[H]=0,O[H]=0,L[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:O,attributeDivisors:L,object:D,attributes:{},index:null}}function f(D,U,O,L){const H=r.attributes,q=U.attributes;let W=0;const et=O.getAttributes();for(const X in et)if(et[X].location>=0){const tt=H[X];let yt=q[X];if(yt===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(yt=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(yt=D.instanceColor)),tt===void 0||tt.attribute!==yt||yt&&tt.data!==yt.data)return!0;W++}return r.attributesNum!==W||r.index!==L}function g(D,U,O,L){const H={},q=U.attributes;let W=0;const et=O.getAttributes();for(const X in et)if(et[X].location>=0){let tt=q[X];tt===void 0&&(X==="instanceMatrix"&&D.instanceMatrix&&(tt=D.instanceMatrix),X==="instanceColor"&&D.instanceColor&&(tt=D.instanceColor));const yt={};yt.attribute=tt,tt&&tt.data&&(yt.data=tt.data),H[X]=yt,W++}r.attributes=H,r.attributesNum=W,r.index=L}function v(){const D=r.newAttributes;for(let U=0,O=D.length;U<O;U++)D[U]=0}function m(D){p(D,0)}function p(D,U){const O=r.newAttributes,L=r.enabledAttributes,H=r.attributeDivisors;O[D]=1,L[D]===0&&(s.enableVertexAttribArray(D),L[D]=1),H[D]!==U&&(s.vertexAttribDivisor(D,U),H[D]=U)}function x(){const D=r.newAttributes,U=r.enabledAttributes;for(let O=0,L=U.length;O<L;O++)U[O]!==D[O]&&(s.disableVertexAttribArray(O),U[O]=0)}function T(D,U,O,L,H,q,W){W===!0?s.vertexAttribIPointer(D,U,O,H,q):s.vertexAttribPointer(D,U,O,L,H,q)}function b(D,U,O,L){v();const H=L.attributes,q=O.getAttributes(),W=U.defaultAttributeValues;for(const et in q){const X=q[et];if(X.location>=0){let j=H[et];if(j===void 0&&(et==="instanceMatrix"&&D.instanceMatrix&&(j=D.instanceMatrix),et==="instanceColor"&&D.instanceColor&&(j=D.instanceColor)),j!==void 0){const tt=j.normalized,yt=j.itemSize,Ft=t.get(j);if(Ft===void 0)continue;const K=Ft.buffer,pt=Ft.type,xt=Ft.bytesPerElement,Et=pt===s.INT||pt===s.UNSIGNED_INT||j.gpuType===Bl;if(j.isInterleavedBufferAttribute){const lt=j.data,Nt=lt.isInterleavedBuffer===!0?lt.stride:lt.itemSize,he=j.offset;if(lt.isInstancedInterleavedBuffer||lt.isInstancedBufferAttribute){for(let Ut=0;Ut<X.locationSize;Ut++)p(X.location+Ut,lt.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let Ut=0;Ut<X.locationSize;Ut++)m(X.location+Ut);s.bindBuffer(s.ARRAY_BUFFER,K);for(let Ut=0;Ut<X.locationSize;Ut++)T(X.location+Ut,yt/X.locationSize,pt,tt,Nt*xt,(he+yt/X.locationSize*Ut)*xt,Et)}else{if(j.isInstancedBufferAttribute){for(let lt=0;lt<X.locationSize;lt++)p(X.location+lt,j.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let lt=0;lt<X.locationSize;lt++)m(X.location+lt);s.bindBuffer(s.ARRAY_BUFFER,K);for(let lt=0;lt<X.locationSize;lt++)T(X.location+lt,yt/X.locationSize,pt,tt,yt*xt,yt/X.locationSize*lt*xt,Et)}}else if(W!==void 0){const tt=W[et];if(tt!==void 0)switch(tt.length){case 2:s.vertexAttrib2fv(X.location,tt);break;case 3:s.vertexAttrib3fv(X.location,tt);break;case 4:s.vertexAttrib4fv(X.location,tt);break;default:s.vertexAttrib1fv(X.location,tt)}}}}x()}function C(){I();for(const D in n){const U=n[D];for(const O in U){const L=U[O];for(const H in L){const q=L[H];for(const W in q)h(q[W].object),delete q[W];delete L[H]}}delete n[D]}}function w(D){if(n[D.id]===void 0)return;const U=n[D.id];for(const O in U){const L=U[O];for(const H in L){const q=L[H];for(const W in q)h(q[W].object),delete q[W];delete L[H]}}delete n[D.id]}function _(D){for(const U in n){const O=n[U];for(const L in O){const H=O[L];if(H[D.id]===void 0)continue;const q=H[D.id];for(const W in q)h(q[W].object),delete q[W];delete H[D.id]}}}function S(D){for(const U in n){const O=n[U],L=D.isInstancedMesh===!0?D.id:0,H=O[L];if(H!==void 0){for(const q in H){const W=H[q];for(const et in W)h(W[et].object),delete W[et];delete H[q]}delete O[L],Object.keys(O).length===0&&delete n[U]}}}function I(){P(),a=!0,r!==i&&(r=i,c(r.object))}function P(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:I,resetDefaultState:P,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfObject:S,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:m,disableUnusedAttributes:x}}function g_(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function __(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const _=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(_){return!(_!==un&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const S=_===wn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==Qe&&_!==an&&!S&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Ct("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=e.logarithmicDepthBuffer===!0&&d===!1;e.reversedDepthBuffer===!0&&d===!1&&Ct("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&d===!0&&Ct("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),C=s.getParameter(s.MAX_SAMPLES),w=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:T,maxFragmentUniforms:b,maxSamples:C,samples:w}}function v_(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new ri,o=new kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=s.get(d);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,T=x*4;let b=p.clippingState||null;l.value=b,b=h(g,u,T,f);for(let C=0;C!==T;++C)b[C]=e[C];p.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,g){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,b=f;T!==v;++T,b+=4)a.copy(d[T]).applyMatrix4(x,o),a.normal.toArray(m,b),m[b+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}class sc extends Sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new md(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ze(5,5,5),r=new Tn({name:"CubemapFromEquirect",uniforms:hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ve,blending:ji});r.uniforms.tEquirect.value=e;const a=new wt(i,r),o=e.minFilter;return e.minFilter===li&&(e.minFilter=qe),new Tl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const bh=256,x_=3,M_=20,Td=256,Ad=16,y_=3,S_=new A,b_=new Lt;class fa{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Tl(1,10,null),this._boxMesh=new wt(new Ze(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:a=256,position:o=S_}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);const d=l.autoClear,u=l.autoClearColor,f=l.autoClearDepth,g=l.autoClearStencil,v=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(t.background=l.getClearColor(b_));const m=new Tl(n,i,h);return m.position.copy(o),m.update(l,t),l.autoClear=d,l.autoClearColor=u,l.autoClearDepth=f,l.autoClearStencil=g,t.background=v,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Th(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(bh,ad(t))}_fromTexture(t,e){t.mapping===as||t.mapping===Ws?this._setSize(t.image.length===0?bh:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){const t=this._cubeSize,e=wh(t,!1,!1),n=Math.log2(t)-x_;for(let i=0;i<=n;i++)e.texture.mipmaps.push({width:t>>i,height:t>>i});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=wh(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){const i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,i),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===as||t.mapping===Ws?(this._cubemapMaterial===null&&(this._cubemapMaterial=Th()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Eh()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=w_(),this._integrationMaterial=E_());const e=this._cubeSize,n=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Ad);for(let a=0;a<=n;a++){const o=fa.lodToRoughness(a,n);if(a>n-y_)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const l=o>0?Math.log2(e)+.5*Math.log2(6/(Td*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=T_());const n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(t,0,n),i.envMap.value=t.texture,this._renderCube(r,0,n)}}function wh(s,t,e){return new sc(s,{minFilter:li,generateMipmaps:t,type:wn,colorSpace:aa,depthBuffer:e})}function er(s,t,e){return new Tn({name:s,uniforms:t,vertexShader:Gt.cube_vert,fragmentShader:e,side:Ve,blending:ji,depthTest:!1,depthWrite:!1})}function w_(){return er("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Td}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function E_(){return er("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ad}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function T_(){return er("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${M_}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Eh(){return er("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Th(){return er("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function A_(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Ta||f===Aa)if(t.has(u)){const g=t.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const v=new sc(g.height);return v.fromEquirectangularTexture(s,u),t.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){const f=u.mapping,g=f===Ta||f===Aa,v=f===as||f===Ws;if(g||v){let m=e.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new fa(s)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const x=u.image;return g&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new fa(s)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===Ta?u.mapping=as:f===Aa&&(u.mapping=Ws),u}function l(u){let f=0;const g=6;for(let v=0;v<g;v++)u[v]!==void 0&&f++;return f===g}function c(u){const f=u.target;f.removeEventListener("dispose",c);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function R_(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&es("WebGLRenderer: "+n+" extension not supported."),i}}}function C_(s,t,e,n){const i={},r=new WeakMap,a=new FinalizationRegistry(g=>delete i[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(const m in g.attributes)t.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete i[g.id],a.unregister(g);const v=r.get(g);v&&(t.remove(v),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,v){return i[v.id]!==void 0||(v.addEventListener("dispose",o),i[v.id]=new WeakRef(v),a.register(v,v.id,v),e.memory.geometries++),v}function h(g){const v=g.attributes;for(const m in v)t.update(v[m],s.ARRAY_BUFFER)}function d(g){const v=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const x=v!==null?v.array.length:m.array.length/3-1,T=m.count>=65535?ud:hd,b=new T(Math.ceil(x/3)*6,1),C=b.array;if(v!==null){const _=v.array;p=v.version;for(let S=0,I=0;S<x;S+=3){const P=_[S+0],D=_[S+1],U=_[S+2];C[I++]=P,C[I++]=D,C[I++]=D,C[I++]=U,C[I++]=U,C[I++]=P}}else{p=m.version;for(let _=0,S=0;_<x;_+=3){const I=_+0,P=_+1,D=_+2;C[S++]=I,C[S++]=P,C[S++]=P,C[S++]=D,C[S++]=D,C[S++]=I}}b.version=p;const w=r.get(g);w&&t.remove(w),r.set(g,b)}function u(g){const v=r.get(g);if(v){const m=g.index;m!==null&&v.version<m.version&&d(g)}else d(g);return r.get(g)}function f(){for(const g in i){const v=i[g].deref();v!==void 0&&l(v)}}return{get:c,update:h,getWireframeAttribute:u,dispose:f}}function P_(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*a),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let v=0;for(let m=0;m<f;m++)v+=u[m];e.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function L_(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:Ot("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function I_(s,t,e){const n=new WeakMap,i=new ae;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let I=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",I)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let T=0;f===!0&&(T=1),g===!0&&(T=2),v===!0&&(T=3);let b=o.attributes.position.count*T,C=1;b>t.maxTextureSize&&(C=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const w=new Float32Array(b*C*4*d),_=new od(w,b,C,d);_.type=an,_.needsUpdate=!0;const S=T*4;for(let P=0;P<d;P++){const D=m[P],U=p[P],O=x[P],L=b*C*4*P;for(let H=0;H<D.count;H++){const q=H*S;f===!0&&(i.fromBufferAttribute(D,H),w[L+q+0]=i.x,w[L+q+1]=i.y,w[L+q+2]=i.z,w[L+q+3]=0),g===!0&&(i.fromBufferAttribute(U,H),w[L+q+4]=i.x,w[L+q+5]=i.y,w[L+q+6]=i.z,w[L+q+7]=0),v===!0&&(i.fromBufferAttribute(O,H),w[L+q+8]=i.x,w[L+q+9]=i.y,w[L+q+10]=i.z,w[L+q+11]=O.itemSize===4?i.w:1)}}u={count:d,texture:_,size:new It(b,C)},n.set(o,u),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function D_(s,t,e,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const N_={[Hu]:"LINEAR_TONE_MAPPING",[Gu]:"REINHARD_TONE_MAPPING",[Wu]:"CINEON_TONE_MAPPING",[Ol]:"ACES_FILMIC_TONE_MAPPING",[qu]:"AGX_TONE_MAPPING",[Yu]:"NEUTRAL_TONE_MAPPING",[Xu]:"CUSTOM_TONE_MAPPING"};function U_(s,t,e,n,i,r){const a=new Sn(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Pe;h.setAttribute("position",new ie([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new ie([0,2,0,0,2,0],2));const d=new Zp({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new wt(h,d),f=new bd(-1,1,1,-1,0,1);let g=null,v=null,m=!1,p,x=null,T=[],b=!1;this.setSize=function(C,w){a.setSize(C,w),o!==null&&o.setSize(C,w),l!==null&&l.setSize(C,w);for(let _=0;_<T.length;_++){const S=T[_];S.setSize&&S.setSize(C,w)}},this.setEffects=function(C){T=C,b=T.length>0&&T[0].isRenderPass===!0;const w=a.width,_=a.height;T.length>0&&o===null&&(o=new Sn(w,_,{type:wn,depthBuffer:!1,stencilBuffer:!1}),l=new Sn(w,_,{type:wn,depthBuffer:!1,stencilBuffer:!1}));const S=i===!0&&T.some(I=>I.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&c===null&&(c=new cs(w,_),r===!0&&(c.format=ci,c.type=os)),a.dispose(),a.depthTexture=S?c:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let I=0;I<T.length;I++){const P=T[I];P.setSize&&P.setSize(w,_),S&&P.needsDepthTexture===!0&&P.setDepthTexture&&P.setDepthTexture(c)}},this.begin=function(C,w){if(m||C.toneMapping===Hn&&T.length===0)return!1;if(x=w,w!==null){const _=w.width,S=w.height;(a.width!==_||a.height!==S)&&this.setSize(_,S)}return b===!1&&C.setRenderTarget(a),p=C.toneMapping,C.toneMapping=Hn,!0},this.hasRenderPass=function(){return b},this.end=function(C,w){C.toneMapping=p,m=!0;let _=a,S=o;for(let I=0;I<T.length;I++){const P=T[I];P.enabled!==!1&&(P.render(C,S,_,w),P.needsSwap!==!1&&(_=S,S=S===o?l:o))}if(g!==C.outputColorSpace||v!==C.toneMapping){g=C.outputColorSpace,v=C.toneMapping,d.defines={},Zt.getTransfer(g)===ne&&(d.defines.SRGB_TRANSFER="");const I=N_[v];I&&(d.defines[I]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=_.texture,C.setRenderTarget(x),C.render(u,f),x=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),d.dispose()}}const Rd=new Ue,Cd=new cs(1,1),Pd=new gd(1),Ld=new od,Id=new yp,Dd=new md,Ah=[],Rh=[],Ch=new Float32Array(16),Ph=new Float32Array(9),Lh=new Float32Array(4);function ps(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Ah[i];if(r===void 0&&(r=new Float32Array(i),Ah[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function be(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function we(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function ya(s,t){let e=Rh[t];e===void 0&&(e=new Int32Array(t),Rh[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function F_(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function O_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;s.uniform2fv(this.addr,t),we(e,t)}}function B_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;s.uniform3fv(this.addr,t),we(e,t)}}function k_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;s.uniform4fv(this.addr,t),we(e,t)}}function z_(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(be(e,n))return;Lh.set(n),s.uniformMatrix2fv(this.addr,!1,Lh),we(e,n)}}function V_(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(be(e,n))return;Ph.set(n),s.uniformMatrix3fv(this.addr,!1,Ph),we(e,n)}}function H_(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(be(e,n))return;Ch.set(n),s.uniformMatrix4fv(this.addr,!1,Ch),we(e,n)}}function G_(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function W_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;s.uniform2iv(this.addr,t),we(e,t)}}function X_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;s.uniform3iv(this.addr,t),we(e,t)}}function q_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;s.uniform4iv(this.addr,t),we(e,t)}}function Y_(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function $_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;s.uniform2uiv(this.addr,t),we(e,t)}}function K_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;s.uniform3uiv(this.addr,t),we(e,t)}}function Z_(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;s.uniform4uiv(this.addr,t),we(e,t)}}function Sa(s){return s.version===0&&(s.compareFunction=id,s.needsUpdate=!0),s}function J_(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=Sa(Cd):r=Rd,e.setTexture2D(t||r,i)}function Q_(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Id,i)}function j_(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=Sa(Pd):r=Dd,e.setTextureCube(t||r,i)}function tv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Ld,i)}function ev(s){switch(s){case 5126:return F_;case 35664:return O_;case 35665:return B_;case 35666:return k_;case 35674:return z_;case 35675:return V_;case 35676:return H_;case 5124:case 35670:return G_;case 35667:case 35671:return W_;case 35668:case 35672:return X_;case 35669:case 35673:return q_;case 5125:return Y_;case 36294:return $_;case 36295:return K_;case 36296:return Z_;case 35678:case 36198:case 36298:case 36306:case 35682:return J_;case 35679:case 36299:case 36307:return Q_;case 35680:case 36300:case 36308:case 36293:return j_;case 36289:case 36303:case 36311:case 36292:return tv}}function nv(s,t){s.uniform1fv(this.addr,t)}function iv(s,t){const e=ps(t,this.size,2);s.uniform2fv(this.addr,e)}function sv(s,t){const e=ps(t,this.size,3);s.uniform3fv(this.addr,e)}function rv(s,t){const e=ps(t,this.size,4);s.uniform4fv(this.addr,e)}function av(s,t){const e=ps(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function ov(s,t){const e=ps(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function lv(s,t){const e=ps(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function cv(s,t){s.uniform1iv(this.addr,t)}function hv(s,t){s.uniform2iv(this.addr,t)}function uv(s,t){s.uniform3iv(this.addr,t)}function dv(s,t){s.uniform4iv(this.addr,t)}function fv(s,t){s.uniform1uiv(this.addr,t)}function pv(s,t){s.uniform2uiv(this.addr,t)}function mv(s,t){s.uniform3uiv(this.addr,t)}function gv(s,t){s.uniform4uiv(this.addr,t)}function _v(s,t,e){const n=this.cache,i=t.length,r=ya(e,i);be(n,r)||(s.uniform1iv(this.addr,r),we(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Sa(Cd):a=Rd;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function vv(s,t,e){const n=this.cache,i=t.length,r=ya(e,i);be(n,r)||(s.uniform1iv(this.addr,r),we(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Id,r[a])}function xv(s,t,e){const n=this.cache,i=t.length,r=ya(e,i);be(n,r)||(s.uniform1iv(this.addr,r),we(n,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=Sa(Pd):a=Dd;for(let o=0;o!==i;++o)e.setTextureCube(t[o]||a,r[o])}function Mv(s,t,e){const n=this.cache,i=t.length,r=ya(e,i);be(n,r)||(s.uniform1iv(this.addr,r),we(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Ld,r[a])}function yv(s){switch(s){case 5126:return nv;case 35664:return iv;case 35665:return sv;case 35666:return rv;case 35674:return av;case 35675:return ov;case 35676:return lv;case 5124:case 35670:return cv;case 35667:case 35671:return hv;case 35668:case 35672:return uv;case 35669:case 35673:return dv;case 5125:return fv;case 36294:return pv;case 36295:return mv;case 36296:return gv;case 35678:case 36198:case 36298:case 36306:case 35682:return _v;case 35679:case 36299:case 36307:return vv;case 35680:case 36300:case 36308:case 36293:return xv;case 36289:case 36303:case 36311:case 36292:return Mv}}class Sv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ev(e.type)}}class bv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=yv(e.type)}}class wv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const io=/(\w+)(\])?(\[|\.)?/g;function Ih(s,t){s.seq.push(t),s.map[t.id]=t}function Ev(s,t,e){const n=s.name,i=n.length;for(io.lastIndex=0;;){const r=io.exec(n),a=io.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Ih(e,c===void 0?new Sv(o,s,t):new bv(o,s,t));break}else{let d=e.map[o];d===void 0&&(d=new wv(o),Ih(e,d)),e=d}}}class Qr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Ev(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Dh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Tv=37297;let Av=0;function Rv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Nh=new kt;function Cv(s){Zt._getMatrix(Nh,Zt.workingColorSpace,s);const t=`mat3( ${Nh.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(s)){case oa:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return Ct("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Uh(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Rv(s.getShaderSource(t),o)}else return r}function Pv(s,t){const e=Cv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const Lv={[Hu]:"Linear",[Gu]:"Reinhard",[Wu]:"Cineon",[Ol]:"ACESFilmic",[qu]:"AgX",[Yu]:"Neutral",[Xu]:"Custom"};function Iv(s,t){const e=Lv[t];return e===void 0?(Ct("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ur=new A;function Dv(){Zt.getLuminanceCoefficients(Ur);const s=Ur.x.toFixed(4),t=Ur.y.toFixed(4),e=Ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function Uv(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Fv(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Fs(s){return s!==""}function Fh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Oh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ov=/^[ \t]*#include +<([\w\d./]+)>/gm;function Al(s){return s.replace(Ov,Bv)}function Bv(s,t){const e=Gt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Al(e)}const kv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bh(s){return s.replace(kv,zv)}function zv(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function kh(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const Vv={[Bs]:"SHADOWMAP_TYPE_PCF",[Ns]:"SHADOWMAP_TYPE_VSM"};function Hv(s){return Vv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Gv={[Ws]:"ENVMAP_MODE_REFRACTION"};function Wv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Gv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Xv={[Fl]:"ENVMAP_BLENDING_MULTIPLY",[Of]:"ENVMAP_BLENDING_MIX",[Bf]:"ENVMAP_BLENDING_ADD"};function qv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Xv[s.combine]||"ENVMAP_BLENDING_NONE"}function Yv(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Hv(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=Wv(e),d=qv(e),u=Nv(e),f=Uv(r),g=i.createProgram();let v,m,p=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Fs).join(`
`),v.length>0&&(v+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Fs).join(`
`),m.length>0&&(m+=`
`)):(v=[kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),m=[kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Hn?"#define TONE_MAPPING":"",e.toneMapping!==Hn?Gt.tonemapping_pars_fragment:"",e.toneMapping!==Hn?Iv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Pv("linearToOutputTexel",e.outputColorSpace),Dv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fs).join(`
`)),a=Al(a),a=Fh(a,e),a=Oh(a,e),o=Al(o),o=Fh(o,e),o=Oh(o,e),a=Bh(a),o=Bh(o),e.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,v=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,m=["#define varying in",e.glslVersion===Ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=p+v+a,T=p+m+o,b=Dh(i,i.VERTEX_SHADER,x),C=Dh(i,i.FRAGMENT_SHADER,T);i.attachShader(g,b),i.attachShader(g,C),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function w(P){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(g)||"",U=i.getShaderInfoLog(b)||"",O=i.getShaderInfoLog(C)||"",L=D.trim(),H=U.trim(),q=O.trim();let W=!0,et=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,b,C);else{const X=Uh(i,b,"vertex"),j=Uh(i,C,"fragment");Ot("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+L+`
`+X+`
`+j)}else L!==""?Ct("WebGLProgram: Program Info Log:",L):(H===""||q==="")&&(et=!1);et&&(P.diagnostics={runnable:W,programLog:L,vertexShader:{log:H,prefix:v},fragmentShader:{log:q,prefix:m}})}i.deleteShader(b),i.deleteShader(C),_=new Qr(i,g),S=Fv(i,g)}let _;this.getUniforms=function(){return _===void 0&&w(this),_};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=i.getProgramParameter(g,Tv)),I},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Av++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=b,this.fragmentShader=C,this}let $v=0;class Kv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Zv(t),e.set(t,n)),n}}class Zv{constructor(t){this.id=$v++,this.code=t,this.usedTimes=0}}function Jv(s){return s===bi||s===na||s===ia}function Qv(s,t,e,n,i,r){const a=new ld,o=new Kv,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,S,I,P,D,U){const O=P.fog,L=D.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,q=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,W=t.get(_.envMap||H,q),et=u[_.type];let X=n.precision;_.precision!==null&&(X=n.getMaxPrecision(_.precision),X!==_.precision&&Ct("WebGLProgram.getParameters:",_.precision,"not supported, using",X,"instead."));const j=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,tt=j!==void 0?j.length:0;let yt=0;L.morphAttributes.position!==void 0&&(yt=1),L.morphAttributes.normal!==void 0&&(yt=2),L.morphAttributes.color!==void 0&&(yt=3);let Ft,K,pt,xt;if(et){const gt=Mn[et];Ft=gt.vertexShader,K=gt.fragmentShader}else{Ft=_.vertexShader,K=_.fragmentShader;const gt=o.getVertexShaderStage(_),ee=o.getFragmentShaderStage(_);o.update(_,gt,ee),pt=gt.id,xt=ee.id}const Et=s.getRenderTarget(),lt=s.state.buffers.depth.getReversed(),Nt=D.isInstancedMesh===!0,he=D.isBatchedMesh===!0,Ut=!!_.map,te=!!_.matcap,oe=!!W,qt=oe&&W.isPMREMTexture===!0,Le=!!_.aoMap,ye=!!_.lightMap,Xe=!!_.bumpMap&&_.wireframe===!1,pe=!!_.normalMap,mn=!!_.displacementMap,Ee=!!_.emissiveMap,je=!!_.metalnessMap,tn=!!_.roughnessMap,en=_.anisotropy>0,B=_.clearcoat>0,nn=_.diffuseRoughness>0,ue=_.dispersion>0,de=_.retroreflectivity>0,mt=_.iridescence>0,Se=_.sheen>0,Dt=_.transmission>0,Bt=en&&!!_.anisotropyMap,R=B&&!!_.clearcoatMap,M=B&&!!_.clearcoatNormalMap,z=B&&!!_.clearcoatRoughnessMap,nt=nn&&!!_.diffuseRoughnessMap,Q=mt&&!!_.iridescenceMap,at=mt&&!!_.iridescenceThicknessMap,dt=Se&&!!_.sheenColorMap,$=Se&&!!_.sheenRoughnessMap,Z=!!_.specularMap,ct=!!_.specularColorMap,N=!!_.specularIntensityMap,J=Dt&&!!_.transmissionMap,Y=Dt&&!!_.thicknessMap,ht=!!_.gradientMap,st=!!_.alphaMap,ot=_.alphaTest>0,At=!!_.alphaHash,Ht=!!_.extensions;let it=Hn;_.toneMapped&&(Et===null||Et.isXRRenderTarget===!0)&&(it=s.toneMapping);const Pt=qt?W.isCompressedCubeTexture?W.image[0].mipmaps:W.mipmaps:null,Vt={shaderID:et,shaderType:_.type,shaderName:_.name,vertexShader:Ft,fragmentShader:K,defines:_.defines,customVertexShaderID:pt,customFragmentShaderID:xt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:X,batching:he,batchingColor:he&&D._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&D.instanceColor!==null,instancingMorph:Nt&&D.morphTexture!==null,outputColorSpace:Et===null?s.outputColorSpace:Et.isXRRenderTarget===!0?Et.texture.colorSpace:Zt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ut,matcap:te,envMap:oe,envMapMode:oe&&W.mapping,envMapPMREM:qt,envMapMaxLod:qt?Pt.length-1:null,envMapSize:qt?Pt[0].width:null,aoMap:Le,lightMap:ye,bumpMap:Xe,normalMap:pe,displacementMap:mn,emissiveMap:Ee,normalMapObjectSpace:pe&&_.normalMapType===Gf,normalMapTangentSpace:pe&&_.normalMapType===ra,packedNormalMap:pe&&_.normalMapType===ra&&Jv(_.normalMap.format),metalnessMap:je,roughnessMap:tn,anisotropy:en,anisotropyMap:Bt,clearcoat:B,clearcoatMap:R,clearcoatNormalMap:M,clearcoatRoughnessMap:z,diffuseRoughness:nn,diffuseRoughnessMap:nt,dispersion:ue,retroreflection:de,iridescence:mt,iridescenceMap:Q,iridescenceThicknessMap:at,sheen:Se,sheenColorMap:dt,sheenRoughnessMap:$,specularMap:Z,specularColorMap:ct,specularIntensityMap:N,transmission:Dt,transmissionMap:J,thicknessMap:Y,gradientMap:ht,opaque:_.transparent===!1&&_.blending===ts&&_.alphaToCoverage===!1,alphaMap:st,alphaTest:ot,alphaHash:At,combine:_.combine,mapUv:Ut&&f(_.map.channel),aoMapUv:Le&&f(_.aoMap.channel),lightMapUv:ye&&f(_.lightMap.channel),bumpMapUv:Xe&&f(_.bumpMap.channel),normalMapUv:pe&&f(_.normalMap.channel),displacementMapUv:mn&&f(_.displacementMap.channel),emissiveMapUv:Ee&&f(_.emissiveMap.channel),metalnessMapUv:je&&f(_.metalnessMap.channel),roughnessMapUv:tn&&f(_.roughnessMap.channel),anisotropyMapUv:Bt&&f(_.anisotropyMap.channel),clearcoatMapUv:R&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:M&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:z&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:nt&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:Q&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:at&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:dt&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:$&&f(_.sheenRoughnessMap.channel),specularMapUv:Z&&f(_.specularMap.channel),specularColorMapUv:ct&&f(_.specularColorMap.channel),specularIntensityMapUv:N&&f(_.specularIntensityMap.channel),transmissionMapUv:J&&f(_.transmissionMap.channel),thicknessMapUv:Y&&f(_.thicknessMap.channel),alphaMapUv:st&&f(_.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(pe||en),vertexNormals:!!L.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!L.attributes.uv&&(Ut||st),fog:!!O,useFog:_.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||L.attributes.normal===void 0&&pe===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:lt,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:yt,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:U.filter(gt=>gt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:it,decodeVideoTexture:Ut&&_.map.isVideoTexture===!0&&Zt.getTransfer(_.map.colorSpace)===ne,decodeVideoTextureEmissive:Ee&&_.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(_.emissiveMap.colorSpace)===ne,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===yn,flipSided:_.side===Ve,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ht&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&_.extensions.multiDraw===!0||he)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Vt.vertexUv1s=l.has(1),Vt.vertexUv2s=l.has(2),Vt.vertexUv3s=l.has(3),l.clear(),Vt}function v(_){const S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(const I in _.defines)S.push(I),S.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(m(S,_),p(S,_),S.push(s.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function m(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapPMREM),_.push(S.envMapMaxLod),_.push(S.envMapSize),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.diffuseRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.numSunLights),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numSunLightShadows),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.numLightProbeGrids),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function p(_,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function x(_){const S=u[_.type];let I;if(S){const P=Mn[S];I=Yp.clone(P.uniforms)}else I=_.uniforms;return I}function T(_,S){let I=h.get(S);return I!==void 0?++I.usedTimes:(I=new Yv(s,S,_,i),c.push(I),h.set(S,I)),I}function b(_){if(--_.usedTimes===0){const S=c.indexOf(_);c[S]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function C(_){o.remove(_)}function w(){o.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:T,releaseProgram:b,releaseShaderCache:C,programs:c,dispose:w}}function jv(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function tx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function zh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Vh(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,v,m,p){let x=s[t];return x===void 0?(x={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:m,group:p},s[t]=x):(x.id=u.id,x.object=u,x.geometry=f,x.material=g,x.materialVariant=a(u),x.groupOrder=v,x.renderOrder=u.renderOrder,x.z=m,x.group=p),t++,x}function l(u,f,g,v,m,p,x){x.reversedDepth===!0&&(m=-m);const T=o(u,f,g,v,m,p);g.transmission>0?n.push(T):g.transparent===!0?i.push(T):e.push(T)}function c(u,f,g,v,m,p){const x=o(u,f,g,v,m,p);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):e.unshift(x)}function h(u,f){e.length>1&&e.sort(u||tx),n.length>1&&n.sort(f||zh),i.length>1&&i.sort(f||zh)}function d(){for(let u=t,f=s.length;u<f;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function ex(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Vh,s.set(n,[a])):i>=r.length?(a=new Vh,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function nx(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new A,color:new Lt};break;case"SpotLight":e={position:new A,direction:new A,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new A,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new A,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":e={color:new Lt,position:new A,halfWidth:new A,halfHeight:new A};break}return s[t.id]=e,e}}}function ix(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let sx=0;function rx(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ax(s){const t=new nx,e=ix(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);const i=new A,r=new Wt,a=new Wt;function o(c){let h=0,d=0,u=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,x=0,T=0,b=0,C=0,w=0,_=0,S=0,I=0,P=0;c.sort(rx);for(let U=0,O=c.length;U<O;U++){const L=c[U],H=L.color,q=L.intensity,W=L.distance;let et=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===bi?et=L.shadow.map.texture:et=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=H.r*q,d+=H.g*q,u+=H.b*q;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],q);P++}else if(L.isSunLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const j=L.shadow,tt=e.get(L);tt.shadowIntensity=j.intensity,tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=tt,n.sunShadowMap[g]=et;const yt=j.getViewportCount();for(let Ft=0;Ft<yt;Ft++)n.sunShadowMatrix[v+Ft]=j.getMatrix(Ft),n.sunShadowCascade[v+Ft]=j._cascadeData[Ft];v+=yt,g++}n.sun[f]=X,f++}else if(L.isDirectionalLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const j=L.shadow,tt=e.get(L);tt.shadowIntensity=j.intensity,tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,n.directionalShadow[m]=tt,n.directionalShadowMap[m]=et,n.directionalShadowMatrix[m]=L.shadow.matrix,C++}n.directional[m]=X,m++}else if(L.isSpotLight){const X=t.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(H).multiplyScalar(q),X.distance=W,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[x]=X;const j=L.shadow;if(L.map&&(n.spotLightMap[S]=L.map,S++,j.updateMatrices(L),L.castShadow&&I++),n.spotLightMatrix[x]=j.matrix,L.castShadow){const tt=e.get(L);tt.shadowIntensity=j.intensity,tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,n.spotShadow[x]=tt,n.spotShadowMap[x]=et,_++}x++}else if(L.isRectAreaLight){const X=t.get(L);X.color.copy(H).multiplyScalar(q),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[T]=X,T++}else if(L.isPointLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const j=L.shadow,tt=e.get(L);tt.shadowIntensity=j.intensity,tt.shadowBias=j.bias,tt.shadowNormalBias=j.normalBias,tt.shadowRadius=j.radius,tt.shadowMapSize=j.mapSize,tt.shadowCameraNear=j.camera.near,tt.shadowCameraFar=j.camera.far,n.pointShadow[p]=tt,n.pointShadowMap[p]=et,n.pointShadowMatrix[p]=L.shadow.matrix,w++}n.point[p]=X,p++}else if(L.isHemisphereLight){const X=t.get(L);X.skyColor.copy(L.color).multiplyScalar(q),X.groundColor.copy(L.groundColor).multiplyScalar(q),n.hemi[b]=X,b++}}T>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_t.LTC_FLOAT_1,n.rectAreaLTC2=_t.LTC_FLOAT_2):(n.rectAreaLTC1=_t.LTC_HALF_1,n.rectAreaLTC2=_t.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const D=n.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==x||D.rectAreaLength!==T||D.hemiLength!==b||D.numSunShadows!==g||D.numDirectionalShadows!==C||D.numPointShadows!==w||D.numSpotShadows!==_||D.numSpotMaps!==S||D.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=m,n.spot.length=x,n.rectArea.length=T,n.point.length=p,n.hemi.length=b,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=C,n.directionalShadowMap.length=C,n.directionalShadowMatrix.length=C,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+S-I,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=I,n.numLightProbes=P,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=x,D.rectAreaLength=T,D.hemiLength=b,D.numSunShadows=g,D.numDirectionalShadows=C,D.numPointShadows=w,D.numSpotShadows=_,D.numSpotMaps=S,D.numLightProbes=P,n.version=sx++)}function l(c,h){let d=0,u=0,f=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let x=0,T=c.length;x<T;x++){const b=c[x];if(b.isSunLight){const C=n.sun[d];C.direction.setFromMatrixPosition(b.matrixWorld),C.direction.transformDirection(p),d++}else if(b.isDirectionalLight){const C=n.directional[u];C.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),C.direction.sub(i),C.direction.transformDirection(p),u++}else if(b.isSpotLight){const C=n.spot[g];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),C.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),C.direction.sub(i),C.direction.transformDirection(p),g++}else if(b.isRectAreaLight){const C=n.rectArea[v];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),a.identity(),r.copy(b.matrixWorld),r.premultiply(p),a.extractRotation(r),C.halfWidth.set(b.width*.5,0,0),C.halfHeight.set(0,b.height*.5,0),C.halfWidth.applyMatrix4(a),C.halfHeight.applyMatrix4(a),v++}else if(b.isPointLight){const C=n.point[f];C.position.setFromMatrixPosition(b.matrixWorld),C.position.applyMatrix4(p),f++}else if(b.isHemisphereLight){const C=n.hemi[m];C.direction.setFromMatrixPosition(b.matrixWorld),C.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:n}}function Hh(s){const t=new ax(s),e=[],n=[],i=[];function r(d){h.camera=d,e.length=0,n.length=0,i.length=0}function a(d){d.isLightProbeGrid?i.push(d):e.push(d)}function o(d){n.push(d)}function l(){t.setup(e),i.sort((d,u)=>d.priority-u.priority||d.id-u.id)}function c(d){t.setupView(e,d)}const h={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function ox(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new Hh(s),t.set(i,[o])):r>=a.length?(o=new Hh(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,hx=[new A(1,0,0),new A(-1,0,0),new A(0,1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1)],ux=[new A(0,-1,0),new A(0,-1,0),new A(0,0,1),new A(0,0,-1),new A(0,-1,0),new A(0,-1,0)],Gh=new Wt,As=new A,so=new A;function dx(s,t,e){let n=new Ks;const i=new It,r=new It,a=new ae,o=new jp,l=new tm,c={},h=e.maxTextureSize,d={[Si]:Ve,[Ve]:Si,[yn]:yn},u=new Tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new It},radius:{value:4}},vertexShader:lx,fragmentShader:cx}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Pe;g.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new wt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bs;let p=this.type;this.render=function(w,_,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===vf&&(Ct("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Bs);const I=s.getRenderTarget(),P=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),U=s.state;U.setBlending(ji),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const O=p!==this.type;O&&_.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(H=>H.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,H=w.length;L<H;L++){const q=w[L],W=q.shadow;if(W===void 0){Ct("WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);const et=W.getFrameExtents();i.multiply(et),r.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/et.x),i.x=r.x*et.x,W.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/et.y),i.y=r.y*et.y,W.mapSize.y=r.y));const X=s.state.buffers.depth.getReversed();if(W.camera._reversedDepth=X,W.map===null||O===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===Ns){if(q.isPointLight){Ct("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new Sn(i.x,i.y,{format:bi,type:wn,minFilter:qe,magFilter:qe,generateMipmaps:!1}),W.map.texture.name=q.name+".shadowMap",W.map.depthTexture=new cs(i.x,i.y,an),W.map.depthTexture.name=q.name+".shadowMapDepth",W.map.depthTexture.format=hi,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Ne,W.map.depthTexture.magFilter=Ne}else q.isPointLight?(W.map=new sc(i.x),W.map.depthTexture=new gd(i.x,bn)):(W.map=new Sn(i.x,i.y),W.map.depthTexture=new cs(i.x,i.y,bn)),W.map.depthTexture.name=q.name+".shadowMap",W.map.depthTexture.format=hi,this.type===Bs?(W.map.depthTexture.compareFunction=X?nd:ed,W.map.depthTexture.minFilter=qe,W.map.depthTexture.magFilter=qe):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=Ne,W.map.depthTexture.magFilter=Ne);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==i.x||W.map.height!==i.y)&&W.map.setSize(i.x,i.y);const j=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();q.isPointLight!==!0&&W.updateMatrices(q,S);const tt=(W.camera.layers.mask&4294967294)!==0?W.camera.layers:S.layers;for(let yt=0;yt<j;yt++){const Ft=W.getCamera(yt);if(q.isPointLight){const K=W.camera,pt=W.matrix,xt=q.distance||K.far;xt!==K.far&&(K.far=xt,K.updateProjectionMatrix()),As.setFromMatrixPosition(q.matrixWorld),K.position.copy(As),so.copy(K.position),so.add(hx[yt]),K.up.copy(ux[yt]),K.lookAt(so),K.updateMatrixWorld(),pt.makeTranslation(-As.x,-As.y,-As.z),Gh.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),W._frustum.setFromProjectionMatrix(Gh,K.coordinateSystem,K.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)s.setRenderTarget(W.map,yt),s.clear();else{yt===0&&(s.setRenderTarget(W.map),s.clear());const K=W.getViewport(yt);a.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),U.viewport(a)}n=W.getFrustum(yt),b(_,S,Ft,q,tt,this.type)}W.isPointLightShadow!==!0&&this.type===Ns&&x(W,S),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(I,P,D)};function x(w,_){const S=t.update(v);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Sn(i.x,i.y,{format:bi,type:wn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value.set(w.map.width,w.map.height),u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(_,null,S,u,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(_,null,S,f,v,null)}function T(w,_,S,I){let P=null;const D=S.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)P=D;else if(P=S.isPointLight===!0?l:o,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const U=P.uuid,O=_.uuid;let L=c[U];L===void 0&&(L={},c[U]=L);let H=L[O];H===void 0&&(H=P.clone(),L[O]=H,_.addEventListener("dispose",C)),P=H}if(P.visible=_.visible,P.wireframe=_.wireframe,I===Ns?P.side=_.shadowSide!==null?_.shadowSide:_.side:P.side=_.shadowSide!==null?_.shadowSide:d[_.side],P.alphaMap=_.alphaMap,P.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,P.map=_.map,P.clipShadows=_.clipShadows,P.clippingPlanes=_.clippingPlanes,P.clipIntersection=_.clipIntersection,P.displacementMap=_.displacementMap,P.displacementScale=_.displacementScale,P.displacementBias=_.displacementBias,P.wireframeLinewidth=_.wireframeLinewidth,P.linewidth=_.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const U=s.properties.get(P);U.light=S}return P}function b(w,_,S,I,P,D){if(w.visible===!1)return;if(w.layers.test(P)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&D===Ns)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,w.matrixWorld);const L=t.update(w),H=w.material;if(Array.isArray(H)){const q=L.groups;for(let W=0,et=q.length;W<et;W++){const X=q[W],j=H[X.materialIndex];if(j&&j.visible){const tt=T(w,j,I,D);w.onBeforeShadow(s,w,_,S,L,tt,X),s.renderBufferDirect(S,null,L,tt,w,X),w.onAfterShadow(s,w,_,S,L,tt,X)}}}else if(H.visible){const q=T(w,H,I,D);w.onBeforeShadow(s,w,_,S,L,q,null),s.renderBufferDirect(S,null,L,q,w,null),w.onAfterShadow(s,w,_,S,L,q,null)}}const O=w.children;for(let L=0,H=O.length;L<H;L++)b(O[L],_,S,I,P,D)}function C(w){w.target.removeEventListener("dispose",C);for(const S in c){const I=c[S],P=w.target.uuid;P in I&&(I[P].dispose(),delete I[P])}}}function fx(s,t){function e(){let N=!1;const J=new ae;let Y=null;const ht=new ae(0,0,0,0);return{setMask:function(st){Y!==st&&!N&&(s.colorMask(st,st,st,st),Y=st)},setLocked:function(st){N=st},setClear:function(st,ot,At,Ht,it){it===!0&&(st*=Ht,ot*=Ht,At*=Ht),J.set(st,ot,At,Ht),ht.equals(J)===!1&&(s.clearColor(st,ot,At,Ht),ht.copy(J))},reset:function(){N=!1,Y=null,ht.set(-1,0,0,0)}}}function n(){let N=!1,J=!1,Y=null,ht=null,st=null;return{setReversed:function(ot){if(J!==ot){const At=t.get("EXT_clip_control");ot?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),J=ot;const Ht=st;st=null,this.setClear(Ht)}},getReversed:function(){return J},setTest:function(ot){ot?lt(s.DEPTH_TEST):Nt(s.DEPTH_TEST)},setMask:function(ot){Y!==ot&&!N&&(s.depthMask(ot),Y=ot)},setFunc:function(ot){if(J&&(ot=tp[ot]),ht!==ot){switch(ot){case Bo:s.depthFunc(s.NEVER);break;case ko:s.depthFunc(s.ALWAYS);break;case zo:s.depthFunc(s.LESS);break;case Gs:s.depthFunc(s.LEQUAL);break;case Vo:s.depthFunc(s.EQUAL);break;case Ho:s.depthFunc(s.GEQUAL);break;case Go:s.depthFunc(s.GREATER);break;case Wo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ht=ot}},setLocked:function(ot){N=ot},setClear:function(ot){st!==ot&&(st=ot,J&&(ot=1-ot),s.clearDepth(ot))},reset:function(){N=!1,Y=null,ht=null,st=null,J=!1}}}function i(){let N=!1,J=null,Y=null,ht=null,st=null,ot=null,At=null,Ht=null,it=null;return{setTest:function(Pt){N||(Pt?lt(s.STENCIL_TEST):Nt(s.STENCIL_TEST))},setMask:function(Pt){J!==Pt&&!N&&(s.stencilMask(Pt),J=Pt)},setFunc:function(Pt,Vt,gt){(Y!==Pt||ht!==Vt||st!==gt)&&(s.stencilFunc(Pt,Vt,gt),Y=Pt,ht=Vt,st=gt)},setOp:function(Pt,Vt,gt){(ot!==Pt||At!==Vt||Ht!==gt)&&(s.stencilOp(Pt,Vt,gt),ot=Pt,At=Vt,Ht=gt)},setLocked:function(Pt){N=Pt},setClear:function(Pt){it!==Pt&&(s.clearStencil(Pt),it=Pt)},reset:function(){N=!1,J=null,Y=null,ht=null,st=null,ot=null,At=null,Ht=null,it=null}}}const r=new e,a=new n,o=new i;let l={};const c=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],v=null,m=!1,p=null,x=null,T=null,b=null,C=null,w=null,_=null,S=new Lt(0,0,0),I=0,P=!1,D=null,U=null,O=null,L=null,H=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,et=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(X)[1]),W=et>=1):X.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),W=et>=2);let j=null,tt={};const yt=s.getParameter(s.SCISSOR_BOX),Ft=s.getParameter(s.VIEWPORT),K=new ae().fromArray(yt),pt=new ae().fromArray(Ft);function xt(N,J,Y,ht){const st=new Uint8Array(4),ot=s.createTexture();s.bindTexture(N,ot),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<Y;At++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(J,0,s.RGBA,1,1,ht,0,s.RGBA,s.UNSIGNED_BYTE,st):s.texImage2D(J+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,st);return ot}const Et={};Et[s.TEXTURE_2D]=xt(s.TEXTURE_2D,s.TEXTURE_2D,1),Et[s.TEXTURE_CUBE_MAP]=xt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Et[s.TEXTURE_2D_ARRAY]=xt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Et[s.TEXTURE_3D]=xt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),lt(s.DEPTH_TEST),a.setFunc(Gs),Xe(!1),pe(wc),lt(s.CULL_FACE),Le(ji);function lt(N){h[N]!==!0&&(s.enable(N),h[N]=!0)}function Nt(N){h[N]!==!1&&(s.disable(N),h[N]=!1)}function he(N,J){return u[N]!==J?(s.bindFramebuffer(N,J),u[N]=J,N===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=J),N===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=J),!0):!1}function Ut(N,J){let Y=g,ht=!1;if(N){Y=f.get(J),Y===void 0&&(Y=[],f.set(J,Y));const st=N.textures;if(Y.length!==st.length||Y[0]!==s.COLOR_ATTACHMENT0){for(let ot=0,At=st.length;ot<At;ot++)Y[ot]=s.COLOR_ATTACHMENT0+ot;Y.length=st.length,ht=!0}}else Y[0]!==s.BACK&&(Y[0]=s.BACK,ht=!0);ht&&s.drawBuffers(Y)}function te(N){return v!==N?(s.useProgram(N),v=N,!0):!1}const oe={[Qi]:s.FUNC_ADD,[Mf]:s.FUNC_SUBTRACT,[yf]:s.FUNC_REVERSE_SUBTRACT};oe[Sf]=s.MIN,oe[bf]=s.MAX;const qt={[wf]:s.ZERO,[Ef]:s.ONE,[Tf]:s.SRC_COLOR,[zu]:s.SRC_ALPHA,[If]:s.SRC_ALPHA_SATURATE,[Pf]:s.DST_COLOR,[Rf]:s.DST_ALPHA,[Af]:s.ONE_MINUS_SRC_COLOR,[Vu]:s.ONE_MINUS_SRC_ALPHA,[Lf]:s.ONE_MINUS_DST_COLOR,[Cf]:s.ONE_MINUS_DST_ALPHA,[Df]:s.CONSTANT_COLOR,[Nf]:s.ONE_MINUS_CONSTANT_COLOR,[Uf]:s.CONSTANT_ALPHA,[Ff]:s.ONE_MINUS_CONSTANT_ALPHA};function Le(N,J,Y,ht,st,ot,At,Ht,it,Pt){if(N===ji){m===!0&&(Nt(s.BLEND),m=!1);return}if(m===!1&&(lt(s.BLEND),m=!0),N!==xf){if(N!==p||Pt!==P){if((x!==Qi||C!==Qi)&&(s.blendEquation(s.FUNC_ADD),x=Qi,C=Qi),Pt)switch(N){case ts:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rs:s.blendFunc(s.ONE,s.ONE);break;case Ec:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Tc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ot("WebGLState: Invalid blending: ",N);break}else switch(N){case ts:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case rs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Ec:Ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tc:Ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ot("WebGLState: Invalid blending: ",N);break}T=null,b=null,w=null,_=null,S.set(0,0,0),I=0,p=N,P=Pt}return}st=st||J,ot=ot||Y,At=At||ht,(J!==x||st!==C)&&(s.blendEquationSeparate(oe[J],oe[st]),x=J,C=st),(Y!==T||ht!==b||ot!==w||At!==_)&&(s.blendFuncSeparate(qt[Y],qt[ht],qt[ot],qt[At]),T=Y,b=ht,w=ot,_=At),(Ht.equals(S)===!1||it!==I)&&(s.blendColor(Ht.r,Ht.g,Ht.b,it),S.copy(Ht),I=it),p=N,P=!1}function ye(N,J){N.side===yn?Nt(s.CULL_FACE):lt(s.CULL_FACE);let Y=N.side===Ve;J&&(Y=!Y),Xe(Y),N.blending===ts&&N.transparent===!1?Le(ji):Le(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ht=N.stencilWrite;o.setTest(ht),ht&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ee(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?lt(s.SAMPLE_ALPHA_TO_COVERAGE):Nt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(N){D!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),D=N)}function pe(N){N!==gf?(lt(s.CULL_FACE),N!==U&&(N===wc?s.cullFace(s.BACK):N===_f?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Nt(s.CULL_FACE),U=N}function mn(N){N!==O&&(W&&s.lineWidth(N),O=N)}function Ee(N,J,Y){N?(lt(s.POLYGON_OFFSET_FILL),(L!==J||H!==Y)&&(L=J,H=Y,a.getReversed()&&(J=-J,Y=-Y),s.polygonOffset(J,Y))):Nt(s.POLYGON_OFFSET_FILL)}function je(N){N?lt(s.SCISSOR_TEST):Nt(s.SCISSOR_TEST)}function tn(N){N===void 0&&(N=s.TEXTURE0+q-1),j!==N&&(s.activeTexture(N),j=N)}function en(N,J,Y){Y===void 0&&(j===null?Y=s.TEXTURE0+q-1:Y=j);let ht=tt[Y];ht===void 0&&(ht={type:void 0,texture:void 0},tt[Y]=ht),(ht.type!==N||ht.texture!==J)&&(j!==Y&&(s.activeTexture(Y),j=Y),s.bindTexture(N,J||Et[N]),ht.type=N,ht.texture=J)}function B(){const N=tt[j];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function nn(){try{s.compressedTexImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function ue(){try{s.compressedTexImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function de(){try{s.texSubImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function mt(){try{s.texSubImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function Se(){try{s.compressedTexSubImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function Dt(){try{s.compressedTexSubImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function Bt(){try{s.texStorage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function R(){try{s.texStorage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function M(){try{s.texImage2D(...arguments)}catch(N){Ot("WebGLState:",N)}}function z(){try{s.texImage3D(...arguments)}catch(N){Ot("WebGLState:",N)}}function nt(N){return d[N]!==void 0?d[N]:s.getParameter(N)}function Q(N,J){d[N]!==J&&(s.pixelStorei(N,J),d[N]=J)}function at(N){K.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),K.copy(N))}function dt(N){pt.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),pt.copy(N))}function $(N,J){let Y=c.get(J);Y===void 0&&(Y=new WeakMap,c.set(J,Y));let ht=Y.get(N);ht===void 0&&(ht=s.getUniformBlockIndex(J,N.name),s.uniformBlockBinding(J,ht,ht),Y.set(N,ht))}function Z(N,J,Y){const st=c.get(J).get(N);l[st]!==Y&&(s.bindBufferBase(s.UNIFORM_BUFFER,st,Y),l[st]=Y)}function ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},j=null,tt={},u={},l={},f=new WeakMap,g=[],v=null,m=!1,p=null,x=null,T=null,b=null,C=null,w=null,_=null,S=new Lt(0,0,0),I=0,P=!1,D=null,U=null,O=null,L=null,H=null,K.set(0,0,s.canvas.width,s.canvas.height),pt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:lt,disable:Nt,bindFramebuffer:he,drawBuffers:Ut,useProgram:te,setBlending:Le,setMaterial:ye,setFlipSided:Xe,setCullFace:pe,setLineWidth:mn,setPolygonOffset:Ee,setScissorTest:je,activeTexture:tn,bindTexture:en,unbindTexture:B,compressedTexImage2D:nn,compressedTexImage3D:ue,texImage2D:M,texImage3D:z,pixelStorei:Q,getParameter:nt,updateUBOMapping:$,uniformBlockBinding:Z,texStorage2D:Bt,texStorage3D:R,texSubImage2D:de,texSubImage3D:mt,compressedTexSubImage2D:Se,compressedTexSubImage3D:Dt,scissor:at,viewport:dt,reset:ct}}function px(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new It,h=new WeakMap,d=new Set;let u;const f=new WeakMap,g=new Set,v=new FinalizationRegistry(R=>g.delete(R));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,M){return m?new OffscreenCanvas(R,M):Ys("canvas")}function x(R,M,z){let nt=1;const Q=Bt(R);if((Q.width>z||Q.height>z)&&(nt=z/Math.max(Q.width,Q.height)),nt<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const at=Math.floor(nt*Q.width),dt=Math.floor(nt*Q.height);u===void 0&&(u=p(at,dt));const $=M?p(at,dt):u;return $.width=at,$.height=dt,$.getContext("2d").drawImage(R,0,0,at,dt),Ct("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+at+"x"+dt+")."),$}else return"data"in R&&Ct("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),R;return R}function T(R){return R.generateMipmaps}function b(R){s.generateMipmap(R)}function C(R){return R.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?s.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(R,M,z,nt,Q,at=!1){if(R!==null){if(s[R]!==void 0)return s[R];Ct("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let dt;nt&&(dt=t.get("EXT_texture_norm16"),dt||Ct("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=M;if(M===s.RED&&(z===s.FLOAT&&($=s.R32F),z===s.HALF_FLOAT&&($=s.R16F),z===s.UNSIGNED_BYTE&&($=s.R8),z===s.UNSIGNED_SHORT&&dt&&($=dt.R16_EXT),z===s.SHORT&&dt&&($=dt.R16_SNORM_EXT)),M===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&($=s.R8UI),z===s.UNSIGNED_SHORT&&($=s.R16UI),z===s.UNSIGNED_INT&&($=s.R32UI),z===s.BYTE&&($=s.R8I),z===s.SHORT&&($=s.R16I),z===s.INT&&($=s.R32I)),M===s.RG&&(z===s.FLOAT&&($=s.RG32F),z===s.HALF_FLOAT&&($=s.RG16F),z===s.UNSIGNED_BYTE&&($=s.RG8),z===s.UNSIGNED_SHORT&&dt&&($=dt.RG16_EXT),z===s.SHORT&&dt&&($=dt.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&($=s.RG8UI),z===s.UNSIGNED_SHORT&&($=s.RG16UI),z===s.UNSIGNED_INT&&($=s.RG32UI),z===s.BYTE&&($=s.RG8I),z===s.SHORT&&($=s.RG16I),z===s.INT&&($=s.RG32I)),M===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&($=s.RGB8UI),z===s.UNSIGNED_SHORT&&($=s.RGB16UI),z===s.UNSIGNED_INT&&($=s.RGB32UI),z===s.BYTE&&($=s.RGB8I),z===s.SHORT&&($=s.RGB16I),z===s.INT&&($=s.RGB32I)),M===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&($=s.RGBA8UI),z===s.UNSIGNED_SHORT&&($=s.RGBA16UI),z===s.UNSIGNED_INT&&($=s.RGBA32UI),z===s.BYTE&&($=s.RGBA8I),z===s.SHORT&&($=s.RGBA16I),z===s.INT&&($=s.RGBA32I)),M===s.RGB&&(z===s.UNSIGNED_SHORT&&dt&&($=dt.RGB16_EXT),z===s.SHORT&&dt&&($=dt.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&($=s.R11F_G11F_B10F)),M===s.RGBA){const Z=at?oa:Zt.getTransfer(Q);z===s.FLOAT&&($=s.RGBA32F),z===s.HALF_FLOAT&&($=s.RGBA16F),z===s.UNSIGNED_BYTE&&($=Z===ne?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&dt&&($=dt.RGBA16_EXT),z===s.SHORT&&dt&&($=dt.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function _(R,M){let z;return R?M===null||M===bn||M===os?z=s.DEPTH24_STENCIL8:M===an?z=s.DEPTH32F_STENCIL8:M===Xs&&(z=s.DEPTH24_STENCIL8,Ct("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===bn||M===os?z=s.DEPTH_COMPONENT24:M===an?z=s.DEPTH_COMPONENT32F:M===Xs&&(z=s.DEPTH_COMPONENT16),z}function S(R,M){return T(R)===!0||R.isFramebufferTexture&&R.minFilter!==Ne&&R.minFilter!==qe?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function I(R){const M=new WeakRef(R);n.get(R).__ref=M,g.add(M),v.register(R,M,M)}function P(R){const M=n.get(R).__ref;M!==void 0&&(g.delete(M),v.unregister(M))}function D(R){O(R.target)}function U(R){L(R.target)}function O(R){R.removeEventListener("dispose",D),P(R),q(R),R.isVideoTexture&&h.delete(R),R.isHTMLTexture&&d.delete(R)}function L(R){R.removeEventListener("dispose",U),P(R),et(R)}function H(){for(const R of g){const M=R.deref();M!==void 0&&(M.isRenderTarget===!0?L(M):O(M))}g.clear(),d.clear()}function q(R){const M=n.get(R);if(M.__webglInit===void 0)return;const z=R.source,nt=f.get(z);if(nt){const Q=nt[M.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&W(R),Object.keys(nt).length===0&&f.delete(z)}n.remove(R)}function W(R){const M=n.get(R);s.deleteTexture(M.__webglTexture);const z=R.source,nt=f.get(z);delete nt[M.__cacheKey],a.memory.textures--}function et(R){const M=n.get(R);M.__depthDisposeCallback&&M.__depthDisposeCallback();const z=R.depthTexture;if(z&&z.renderTarget===R&&O(z),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let at=0;at<M.__webglFramebuffer[Q].length;at++)s.deleteFramebuffer(M.__webglFramebuffer[Q][at]);else s.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)s.deleteFramebuffer(M.__webglFramebuffer[Q]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const nt=R.textures;for(let Q=0,at=nt.length;Q<at;Q++){const dt=n.get(nt[Q]);dt.__webglTexture&&(s.deleteTexture(dt.__webglTexture),a.memory.textures--),n.remove(nt[Q])}n.remove(R)}let X=0;function j(){X=0}function tt(){return X}function yt(R){X=R}function Ft(){const R=X;return R>=i.maxTextures&&Ct("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+i.maxTextures),X+=1,R}function K(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.mipmapsAutoUpdate),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function pt(R,M){const z=n.get(R);if(R.isVideoTexture&&Se(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const nt=R.image;if(nt===null)Ct("WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)Ct("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(z,R,M);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+M)}function xt(R,M){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ye(z,R,M);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+M)}function Et(R,M){const z=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ye(z,R,M);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+M)}function lt(R,M){const z=n.get(R);if(R.version>0&&z.__version!==R.version){Xe(z,R,M);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+M)}const Nt={[Xo]:s.REPEAT,[kn]:s.CLAMP_TO_EDGE,[qo]:s.MIRRORED_REPEAT},he={[Ne]:s.NEAREST,[zf]:s.NEAREST_MIPMAP_NEAREST,[rr]:s.NEAREST_MIPMAP_LINEAR,[qe]:s.LINEAR,[Ra]:s.LINEAR_MIPMAP_NEAREST,[li]:s.LINEAR_MIPMAP_LINEAR},Ut={[Xf]:s.NEVER,[id]:s.ALWAYS,[qf]:s.LESS,[ed]:s.LEQUAL,[Yf]:s.EQUAL,[nd]:s.GEQUAL,[$f]:s.GREATER,[Kf]:s.NOTEQUAL};function te(R,M){if(M.type===an&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===qe||M.magFilter===Ra||M.magFilter===rr||M.magFilter===li||M.minFilter===qe||M.minFilter===Ra||M.minFilter===rr||M.minFilter===li)&&Ct("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(R,s.TEXTURE_WRAP_S,Nt[M.wrapS]),s.texParameteri(R,s.TEXTURE_WRAP_T,Nt[M.wrapT]),(R===s.TEXTURE_3D||R===s.TEXTURE_2D_ARRAY)&&s.texParameteri(R,s.TEXTURE_WRAP_R,Nt[M.wrapR]),s.texParameteri(R,s.TEXTURE_MAG_FILTER,he[M.magFilter]),s.texParameteri(R,s.TEXTURE_MIN_FILTER,he[M.minFilter]),M.compareFunction&&(s.texParameteri(R,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(R,s.TEXTURE_COMPARE_FUNC,Ut[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ne||M.minFilter!==rr&&M.minFilter!==li||M.type===an&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function oe(R,M){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",D),I(M));const nt=M.source;let Q=f.get(nt);Q===void 0&&(Q={},f.set(nt,Q));const at=K(M);if(at!==R.__cacheKey){Q[at]===void 0&&(Q[at]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),Q[at].usedTimes++;const dt=Q[R.__cacheKey];dt!==void 0&&(Q[R.__cacheKey].usedTimes--,dt.usedTimes===0&&W(M)),R.__cacheKey=at,R.__webglTexture=Q[at].texture}return z}function qt(R,M,z){return Math.floor(Math.floor(R/z)/M)}function Le(R,M,z,nt){const at=R.updateRanges;if(at.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,z,nt,M.data);else{at.sort((N,J)=>N.start-J.start);let dt=0;for(let N=1;N<at.length;N++){const J=at[dt],Y=at[N],ht=J.start+J.count,st=qt(Y.start,M.width,4),ot=qt(J.start,M.width,4);Y.start<=ht+1&&st===ot&&qt(Y.start+Y.count-1,M.width,4)===st?J.count=Math.max(J.count,Y.start+Y.count-J.start):(++dt,at[dt]=Y)}at.length=dt+1;const $=e.getParameter(s.UNPACK_ROW_LENGTH),Z=e.getParameter(s.UNPACK_SKIP_PIXELS),ct=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let N=0,J=at.length;N<J;N++){const Y=at[N],ht=Math.floor(Y.start/4),st=Math.ceil(Y.count/4),ot=ht%M.width,At=Math.floor(ht/M.width),Ht=st,it=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,ot),e.pixelStorei(s.UNPACK_SKIP_ROWS,At),e.texSubImage2D(s.TEXTURE_2D,0,ot,At,Ht,it,z,nt,M.data)}R.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,$),e.pixelStorei(s.UNPACK_SKIP_PIXELS,Z),e.pixelStorei(s.UNPACK_SKIP_ROWS,ct)}}function ye(R,M,z){let nt=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(nt=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(nt=s.TEXTURE_3D);const Q=oe(R,M),at=M.source;e.bindTexture(nt,R.__webglTexture,s.TEXTURE0+z);const dt=n.get(at);if(at.version!==dt.__version||Q===!0){if(e.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const it=Zt.getPrimaries(Zt.workingColorSpace),Pt=M.colorSpace===oi?null:Zt.getPrimaries(M.colorSpace),Vt=M.colorSpace===oi||it===Pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt)}e.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let Z=x(M.image,!1,i.maxTextureSize);Z=Dt(M,Z);const ct=r.convert(M.format,M.colorSpace),N=r.convert(M.type);let J=w(M.internalFormat,ct,N,M.normalized,M.colorSpace,M.isVideoTexture);te(nt,M);let Y;const ht=M.mipmaps,st=M.isVideoTexture!==!0,ot=dt.__version===void 0||Q===!0,At=at.dataReady,Ht=S(M,Z);if(M.isDepthTexture)J=_(M.format===ci,M.type),ot&&(st?e.texStorage2D(s.TEXTURE_2D,1,J,Z.width,Z.height):e.texImage2D(s.TEXTURE_2D,0,J,Z.width,Z.height,0,ct,N,null));else if(M.isDataTexture)if(ht.length>0){st&&ot&&e.texStorage2D(s.TEXTURE_2D,Ht,J,ht[0].width,ht[0].height);for(let it=0,Pt=ht.length;it<Pt;it++)Y=ht[it],st?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,Y.width,Y.height,ct,N,Y.data):e.texImage2D(s.TEXTURE_2D,it,J,Y.width,Y.height,0,ct,N,Y.data);M.generateMipmaps=!1}else st?(ot&&e.texStorage2D(s.TEXTURE_2D,Ht,J,Z.width,Z.height),At&&Le(M,Z,ct,N)):e.texImage2D(s.TEXTURE_2D,0,J,Z.width,Z.height,0,ct,N,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){st&&ot&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,J,ht[0].width,ht[0].height,Z.depth);for(let it=0,Pt=ht.length;it<Pt;it++)if(Y=ht[it],M.format!==un)if(ct!==null)if(st){if(At)if(M.layerUpdates.size>0){const Vt=Sh(Y.width,Y.height,M.format,M.type);for(const gt of M.layerUpdates){const ee=Y.data.subarray(gt*Vt/Y.data.BYTES_PER_ELEMENT,(gt+1)*Vt/Y.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,gt,Y.width,Y.height,1,ct,ee)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,Y.width,Y.height,Z.depth,ct,Y.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,it,J,Y.width,Y.height,Z.depth,0,Y.data,0,0);else Ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else st?At&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,it,0,0,0,Y.width,Y.height,Z.depth,ct,N,Y.data):e.texImage3D(s.TEXTURE_2D_ARRAY,it,J,Y.width,Y.height,Z.depth,0,ct,N,Y.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{st&&ot&&e.texStorage2D(s.TEXTURE_2D,Ht,J,ht[0].width,ht[0].height);for(let it=0,Pt=ht.length;it<Pt;it++)Y=ht[it],M.format!==un?ct!==null?st?At&&e.compressedTexSubImage2D(s.TEXTURE_2D,it,0,0,Y.width,Y.height,ct,Y.data):e.compressedTexImage2D(s.TEXTURE_2D,it,J,Y.width,Y.height,0,Y.data):Ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,Y.width,Y.height,ct,N,Y.data):e.texImage2D(s.TEXTURE_2D,it,J,Y.width,Y.height,0,ct,N,Y.data)}else if(M.isDataArrayTexture)if(st){if(ot&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Ht,J,Z.width,Z.height,Z.depth),At)if(M.layerUpdates.size>0){const it=Sh(Z.width,Z.height,M.format,M.type);for(const Pt of M.layerUpdates){const Vt=Z.data.subarray(Pt*it/Z.data.BYTES_PER_ELEMENT,(Pt+1)*it/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Pt,Z.width,Z.height,1,ct,N,Vt)}M.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,ct,N,Z.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,J,Z.width,Z.height,Z.depth,0,ct,N,Z.data);else if(M.isData3DTexture)st?(ot&&e.texStorage3D(s.TEXTURE_3D,Ht,J,Z.width,Z.height,Z.depth),At&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,ct,N,Z.data)):e.texImage3D(s.TEXTURE_3D,0,J,Z.width,Z.height,Z.depth,0,ct,N,Z.data);else if(M.isFramebufferTexture){if(ot)if(st)e.texStorage2D(s.TEXTURE_2D,Ht,J,Z.width,Z.height);else{let it=Z.width,Pt=Z.height;for(let Vt=0;Vt<Ht;Vt++)e.texImage2D(s.TEXTURE_2D,Vt,J,it,Pt,0,ct,N,null),it>>=1,Pt>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const it=s.canvas;if(it.hasAttribute("layoutsubtree")||it.setAttribute("layoutsubtree","true"),Z.parentNode!==it){it.appendChild(Z),d.add(M),it.onpaint=Pt=>{const Vt=Pt.changedElements;for(const gt of d)Vt.includes(gt.image)&&(gt.needsUpdate=!0)},it.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Z);else{const Vt=s.RGBA,gt=s.RGBA,ee=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Vt,gt,ee,Z)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ht.length>0){if(st&&ot){const it=Bt(ht[0]);e.texStorage2D(s.TEXTURE_2D,Ht,J,it.width,it.height)}for(let it=0,Pt=ht.length;it<Pt;it++)Y=ht[it],st?At&&e.texSubImage2D(s.TEXTURE_2D,it,0,0,ct,N,Y):e.texImage2D(s.TEXTURE_2D,it,J,ct,N,Y);M.generateMipmaps=!1}else if(st){if(ot){const it=Bt(Z);e.texStorage2D(s.TEXTURE_2D,Ht,J,it.width,it.height)}At&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ct,N,Z)}else e.texImage2D(s.TEXTURE_2D,0,J,ct,N,Z);T(M)&&M.mipmapsAutoUpdate===!0&&b(nt),dt.__version=at.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Xe(R,M,z){if(M.image.length!==6)return;const nt=oe(R,M),Q=M.source;e.bindTexture(s.TEXTURE_CUBE_MAP,R.__webglTexture,s.TEXTURE0+z);const at=n.get(Q);if(Q.version!==at.__version||nt===!0){e.activeTexture(s.TEXTURE0+z);const dt=Zt.getPrimaries(Zt.workingColorSpace),$=M.colorSpace===oi?null:Zt.getPrimaries(M.colorSpace),Z=M.colorSpace===oi||dt===$?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const ct=M.isCompressedTexture||M.image[0].isCompressedTexture,N=M.image[0]&&M.image[0].isDataTexture,J=[];for(let gt=0;gt<6;gt++)!ct&&!N?J[gt]=x(M.image[gt],!0,i.maxCubemapSize):J[gt]=N?M.image[gt].image:M.image[gt],J[gt]=Dt(M,J[gt]);const Y=J[0],ht=r.convert(M.format,M.colorSpace),st=r.convert(M.type);let ot=w(M.internalFormat,ht,st,M.normalized,M.colorSpace);const At=M.isVideoTexture!==!0,Ht=at.__version===void 0||nt===!0,it=Q.dataReady;let Pt=S(M,Y);te(s.TEXTURE_CUBE_MAP,M);let Vt;if(M.isDepthTexture){if(ot=_(M.format===ci,M.type),Ht)if(At)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,ot,Y.width,Y.height);else for(let gt=0;gt<6;gt++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ot,Y.width,Y.height,0,ht,st,null)}else if(ct){At&&Ht&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Pt,ot,Y.width,Y.height);for(let gt=0;gt<6;gt++){Vt=J[gt].mipmaps;for(let ee=0;ee<Vt.length;ee++){const Te=Vt[ee];M.format!==un?ht!==null?At?it&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee,0,0,Te.width,Te.height,ht,Te.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee,ot,Te.width,Te.height,0,Te.data):Ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee,0,0,Te.width,Te.height,ht,st,Te.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee,ot,Te.width,Te.height,0,ht,st,Te.data)}}}else{if(Vt=M.mipmaps,At&&Ht){Vt.length>0&&Pt++;const gt=Bt(J[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Pt,ot,gt.width,gt.height)}for(let gt=0;gt<6;gt++)if(N){At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,J[gt].width,J[gt].height,ht,st,J[gt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ot,J[gt].width,J[gt].height,0,ht,st,J[gt].data);for(let ee=0;ee<Vt.length;ee++){const Kn=Vt[ee].image[gt].image;At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee+1,0,0,Kn.width,Kn.height,ht,st,Kn.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee+1,ot,Kn.width,Kn.height,0,ht,st,Kn.data)}}else{At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,ht,st,J[gt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,ot,ht,st,J[gt]);for(let ee=0;ee<Vt.length;ee++){const Te=Vt[ee];At?it&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee+1,0,0,ht,st,Te.image[gt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ee+1,ot,ht,st,Te.image[gt])}}}T(M)&&M.mipmapsAutoUpdate===!0&&b(s.TEXTURE_CUBE_MAP),at.__version=Q.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function pe(R,M,z,nt,Q,at){const dt=r.convert(z.format,z.colorSpace),$=r.convert(z.type),Z=w(z.internalFormat,dt,$,z.normalized,z.colorSpace),ct=n.get(M),N=n.get(z);if(N.__renderTarget=M,!ct.__hasExternalTextures){const J=Math.max(1,M.width>>at),Y=Math.max(1,M.height>>at);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,at,Z,J,Y,M.depth,0,dt,$,null):e.texImage2D(Q,at,Z,J,Y,0,dt,$,null)}e.bindFramebuffer(s.FRAMEBUFFER,R),mt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,nt,Q,N.__webglTexture,0,de(M)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,nt,Q,N.__webglTexture,at),e.bindFramebuffer(s.FRAMEBUFFER,null)}function mn(R,M,z){if(s.bindRenderbuffer(s.RENDERBUFFER,R),M.depthBuffer){const nt=M.depthTexture,Q=nt&&nt.isDepthTexture?nt.type:null,at=_(M.stencilBuffer,Q),dt=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;mt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,de(M),at,M.width,M.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,de(M),at,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,at,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,dt,s.RENDERBUFFER,R)}else{const nt=M.textures;for(let Q=0;Q<nt.length;Q++){const at=nt[Q],dt=r.convert(at.format,at.colorSpace),$=r.convert(at.type),Z=w(at.internalFormat,dt,$,at.normalized,at.colorSpace);mt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,de(M),Z,M.width,M.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,de(M),Z,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Z,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ee(R,M,z){const nt=M.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Q=n.get(M.depthTexture);Q.__renderTarget=M;const at=nt?M.depthTexture.image[0]:M.depthTexture.image;(!Q.__webglTexture||at.width!==M.width||at.height!==M.height)&&(at.width=M.width,at.height=M.height,M.depthTexture.needsUpdate=!0),nt?lt(M.depthTexture,0):pt(M.depthTexture,0);const dt=Q.__webglTexture,$=de(M),Z=nt?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,ct=M.depthTexture.format===ci?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===hi)mt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ct,Z,dt,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,ct,Z,dt,0);else if(M.depthTexture.format===ci)mt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ct,Z,dt,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,ct,Z,dt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function je(R){const M=n.get(R),z=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const nt=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),nt){const Q=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,nt.removeEventListener("dispose",Q)};nt.addEventListener("dispose",Q),M.__depthDisposeCallback=Q}M.__boundDepthTexture=nt}if(R.depthTexture&&!M.__autoAllocateDepthBuffer)if(z)for(let nt=0;nt<6;nt++)Ee(M.__webglFramebuffer[nt],R,nt);else R.texture.mipmaps.length>0?Ee(M.__webglFramebuffer[0],R,0):Ee(M.__webglFramebuffer,R,0);else if(z){M.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[nt]),M.__webglDepthbuffer[nt]===void 0)M.__webglDepthbuffer[nt]=s.createRenderbuffer(),mn(M.__webglDepthbuffer[nt],R,!1);else{const Q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,at=M.__webglDepthbuffer[nt];s.bindRenderbuffer(s.RENDERBUFFER,at),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,at)}}else if(R.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),mn(M.__webglDepthbuffer,R,!1);else{const Q=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,at=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,at),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,at)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function tn(R,M,z){const nt=n.get(R);M!==void 0&&pe(nt.__webglFramebuffer,R,R.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&je(R)}function en(R){const M=R.texture,z=n.get(R),nt=n.get(M);R.addEventListener("dispose",U),I(R);const Q=R.textures,at=R.isWebGLCubeRenderTarget===!0,dt=Q.length>1;if(dt||(nt.__webglTexture===void 0&&(nt.__webglTexture=s.createTexture()),nt.__version=M.version,a.memory.textures++),at){z.__webglFramebuffer=[];for(let $=0;$<6;$++)if(M.mipmaps.length>0){z.__webglFramebuffer[$]=[];for(let Z=0;Z<M.mipmaps.length;Z++)z.__webglFramebuffer[$][Z]=s.createFramebuffer()}else z.__webglFramebuffer[$]=s.createFramebuffer()}else{if(M.mipmaps.length>0){z.__webglFramebuffer=[];for(let $=0;$<M.mipmaps.length;$++)z.__webglFramebuffer[$]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(dt)for(let $=0,Z=Q.length;$<Z;$++){const ct=n.get(Q[$]);ct.__webglTexture===void 0&&(ct.__webglTexture=s.createTexture(),a.memory.textures++)}if(R.samples>0&&mt(R)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let $=0;$<Q.length;$++){const Z=Q[$];z.__webglColorRenderbuffer[$]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[$]);const ct=r.convert(Z.format,Z.colorSpace),N=r.convert(Z.type),J=w(Z.internalFormat,ct,N,Z.normalized,Z.colorSpace,R.isXRRenderTarget===!0),Y=de(R);s.renderbufferStorageMultisample(s.RENDERBUFFER,Y,J,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+$,s.RENDERBUFFER,z.__webglColorRenderbuffer[$])}s.bindRenderbuffer(s.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),mn(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(at){e.bindTexture(s.TEXTURE_CUBE_MAP,nt.__webglTexture),te(s.TEXTURE_CUBE_MAP,M);for(let $=0;$<6;$++)if(M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)pe(z.__webglFramebuffer[$][Z],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,Z);else pe(z.__webglFramebuffer[$],R,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);T(M)?b(s.TEXTURE_CUBE_MAP):M.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),e.unbindTexture()}else if(dt){for(let $=0,Z=Q.length;$<Z;$++){const ct=Q[$],N=n.get(ct);let J=s.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,N.__webglTexture),te(J,ct),pe(z.__webglFramebuffer,R,ct,s.COLOR_ATTACHMENT0+$,J,0),T(ct)&&b(J)}e.unbindTexture()}else{let $=s.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&($=R.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture($,nt.__webglTexture),te($,M),M.mipmaps.length>0)for(let Z=0;Z<M.mipmaps.length;Z++)pe(z.__webglFramebuffer[Z],R,M,s.COLOR_ATTACHMENT0,$,Z);else pe(z.__webglFramebuffer,R,M,s.COLOR_ATTACHMENT0,$,0);T(M)?b($):M.mipmaps.length>0&&s.texParameteri($,s.TEXTURE_MAX_LEVEL,M.mipmaps.length-1),e.unbindTexture()}R.depthBuffer&&je(R)}function B(R){const M=R.textures;for(let z=0,nt=M.length;z<nt;z++){const Q=M[z];if(T(Q)&&Q.mipmapsAutoUpdate===!0){const at=C(R),dt=n.get(Q).__webglTexture;e.bindTexture(at,dt),b(at),e.unbindTexture()}}}const nn=[];function ue(R){if(R.samples>0){if(mt(R)===!1){const M=R.textures,z=R.width,nt=R.height;let Q=s.COLOR_BUFFER_BIT;const at=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,dt=n.get(R),$=M.length>1;if($)for(let ct=0;ct<M.length;ct++)e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),R.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let ct=0;ct<M.length;ct++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),$){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,dt.__webglColorRenderbuffer[ct]);const N=n.get(M[ct]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,N,0)}s.blitFramebuffer(0,0,z,nt,0,0,z,nt,Q,s.NEAREST),l===!0&&(nn.length=0,nn.push(s.COLOR_ATTACHMENT0+ct),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&nn.push(at),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,nn))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),$)for(let ct=0;ct<M.length;ct++){e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,dt.__webglColorRenderbuffer[ct]);const N=n.get(M[ct]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,N,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){const M=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function de(R){return Math.min(i.maxSamples,R.samples)}function mt(R){const M=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Se(R){const M=a.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function Dt(R,M){const z=R.colorSpace,nt=R.format,Q=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==aa&&z!==oi&&(Zt.getTransfer(z)===ne?(nt!==un||Q!==Qe)&&Ct("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ot("WebGLTextures: Unsupported texture color space:",z)),M}function Bt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=Ft,this.resetTextureUnits=j,this.getTextureUnits=tt,this.setTextureUnits=yt,this.setTexture2D=pt,this.setTexture2DArray=xt,this.setTexture3D=Et,this.setTextureCube=lt,this.rebindTextures=tn,this.setupRenderTarget=en,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=je,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=mt,this.dispose=H}function mx(s,t){function e(n,i=oi){let r;const a=Zt.getTransfer(i);if(n===Qe)return s.UNSIGNED_BYTE;if(n===kl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===zl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ju)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Qu)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ku)return s.BYTE;if(n===Zu)return s.SHORT;if(n===Xs)return s.UNSIGNED_SHORT;if(n===Bl)return s.INT;if(n===bn)return s.UNSIGNED_INT;if(n===an)return s.FLOAT;if(n===wn)return s.HALF_FLOAT;if(n===ju)return s.ALPHA;if(n===td)return s.RGB;if(n===un)return s.RGBA;if(n===hi)return s.DEPTH_COMPONENT;if(n===ci)return s.DEPTH_STENCIL;if(n===Vl)return s.RED;if(n===Hl)return s.RED_INTEGER;if(n===bi)return s.RG;if(n===Gl)return s.RG_INTEGER;if(n===Wl)return s.RGBA_INTEGER;if(n===$r||n===Kr||n===Zr||n===Jr)if(a===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Jr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Yo||n===$o||n===Ko||n===Zo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Yo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$o)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ko)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Zo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Jo||n===Qo||n===jo||n===tl||n===el||n===na||n===nl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Jo||n===Qo)return a===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===jo)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===tl)return r.COMPRESSED_R11_EAC;if(n===el)return r.COMPRESSED_SIGNED_R11_EAC;if(n===na)return r.COMPRESSED_RG11_EAC;if(n===nl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===il||n===sl||n===rl||n===al||n===ol||n===ll||n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===il)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===sl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===rl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===al)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ol)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ll)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===cl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===hl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ul)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===dl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===pl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ml)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===gl)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_l||n===vl||n===xl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===_l)return a===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ml||n===yl||n===ia||n===Sl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ml)return r.COMPRESSED_RED_RGTC1_EXT;if(n===yl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Sl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===os?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_x=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new _d(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Tn({vertexShader:gx,fragmentShader:_x,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new wt(new Qs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xx extends Ti{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new vx,p={},x=e.getContextAttributes();let T=null,b=null;const C=[],w=[],_=new It;let S=null,I=null;const P=new Je;P.viewport=new ae;const D=new Je;D.viewport=new ae;const U=[P,D],O=new Sm;let L=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let pt=C[K];return pt===void 0&&(pt=new Fa,C[K]=pt),pt.getTargetRaySpace()},this.getControllerGrip=function(K){let pt=C[K];return pt===void 0&&(pt=new Fa,C[K]=pt),pt.getGripSpace()},this.getHand=function(K){let pt=C[K];return pt===void 0&&(pt=new Fa,C[K]=pt),pt.getHandSpace()};function q(K){const pt=w.indexOf(K.inputSource);if(pt===-1)return;const xt=C[pt];xt!==void 0&&(xt.update(K.inputSource,K.frame,c||a),xt.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){i.removeEventListener("select",q),i.removeEventListener("selectstart",q),i.removeEventListener("selectend",q),i.removeEventListener("squeeze",q),i.removeEventListener("squeezestart",q),i.removeEventListener("squeezeend",q),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",et);for(let K=0;K<C.length;K++){const pt=w[K];pt!==null&&(w[K]=null,C[K].disconnect(pt))}L=null,H=null,m.reset();for(const K in p)delete p[K];if(t.setRenderTarget(T),f=null,u=null,d=null,i=null,b=null,Ft.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(_.width,_.height,!1),I!==null){const K=I.camera;K.fov=I.fov,K.zoom=I.zoom,K.updateProjectionMatrix(),I=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Ct("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Ct("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(T=t.getRenderTarget(),i.addEventListener("select",q),i.addEventListener("selectstart",q),i.addEventListener("selectend",q),i.addEventListener("squeeze",q),i.addEventListener("squeezestart",q),i.addEventListener("squeezeend",q),i.addEventListener("end",W),i.addEventListener("inputsourceschange",et),x.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let xt=null,Et=null,lt=null;x.depth&&(lt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,xt=x.stencil?ci:hi,Et=x.stencil?os:bn);const Nt={colorFormat:e.RGBA8,depthFormat:lt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Nt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),b=new Sn(u.textureWidth,u.textureHeight,{format:un,type:Qe,depthTexture:new cs(u.textureWidth,u.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,xt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const xt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,xt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new Sn(f.framebufferWidth,f.framebufferHeight,{format:un,type:Qe,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Ft.setContext(i),Ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(K){for(let pt=0;pt<K.removed.length;pt++){const xt=K.removed[pt],Et=w.indexOf(xt);Et>=0&&(w[Et]=null,C[Et].disconnect(xt))}for(let pt=0;pt<K.added.length;pt++){const xt=K.added[pt];let Et=w.indexOf(xt);if(Et===-1){for(let Nt=0;Nt<C.length;Nt++)if(Nt>=w.length){w.push(xt),Et=Nt;break}else if(w[Nt]===null){w[Nt]=xt,Et=Nt;break}if(Et===-1)break}const lt=C[Et];lt&&lt.connect(xt)}}function X(K,pt){pt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(pt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let pt=K.near,xt=K.far;m.texture!==null&&(m.depthNear>0&&(pt=m.depthNear),m.depthFar>0&&(xt=m.depthFar)),O.near=D.near=P.near=pt,O.far=D.far=P.far=xt,(L!==O.near||H!==O.far)&&(i.updateRenderState({depthNear:O.near,depthFar:O.far}),L=O.near,H=O.far),O.layers.mask=K.layers.mask|6,P.layers.mask=O.layers.mask&-5,D.layers.mask=O.layers.mask&-3;const Et=K.parent,lt=O.cameras;X(O,Et);for(let Nt=0;Nt<lt.length;Nt++)X(lt[Nt],Et);O.projectionMatrix.copy(P.projectionMatrix),O.projectionMatrixInverse.copy(P.projectionMatrixInverse),I===null&&K.isPerspectiveCamera&&(I={camera:K,fov:K.fov,zoom:K.zoom}),j(K,O,Et)};function j(K,pt,xt){xt===null?K.matrix.copy(pt.matrixWorld):(K.matrix.copy(xt.matrixWorld),K.matrix.invert(),K.matrix.multiply(pt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(pt.projectionMatrix),K.projectionMatrixInverse.copy(pt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=ls*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(K){return p[K]};let tt=null;function yt(K,pt){if(h=pt.getViewerPose(c||a),g=pt,h!==null){const xt=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let Et=!1;xt.length!==O.cameras.length&&(O.cameras.length=0,Et=!0);for(let Ut=0;Ut<xt.length;Ut++){const te=xt[Ut];let oe=null;if(f!==null)oe=f.getViewport(te);else{const Le=d.getViewSubImage(u,te);oe=Le.viewport,Ut===0&&(t.setRenderTargetTextures(b,Le.colorTexture,Le.depthStencilTexture),t.setRenderTarget(b))}let qt=U[Ut];qt===void 0&&(qt=new Je,qt.layers.enable(Ut),qt.viewport=new ae,U[Ut]=qt),qt.matrix.fromArray(te.transform.matrix),qt.matrix.decompose(qt.position,qt.quaternion,qt.scale),qt.projectionMatrix.fromArray(te.projectionMatrix),qt.projectionMatrixInverse.copy(qt.projectionMatrix).invert(),qt.viewport.set(oe.x,oe.y,oe.width,oe.height),Ut===0&&(O.matrix.copy(qt.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Et===!0&&O.cameras.push(qt)}const lt=i.enabledFeatures;if(lt&&lt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){d=n.getBinding();const Ut=d.getDepthInformation(xt[0]);Ut&&Ut.isValid&&Ut.texture&&m.init(Ut,i.renderState)}if(lt&&lt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let Ut=0;Ut<xt.length;Ut++){const te=xt[Ut].camera;if(te){let oe=p[te];oe||(oe=new _d,p[te]=oe);const qt=d.getCameraImage(te);oe.sourceTexture=qt}}}}for(let xt=0;xt<C.length;xt++){const Et=w[xt],lt=C[xt];Et!==null&&lt!==void 0&&lt.update(Et,pt,c||a)}tt&&tt(K,pt),pt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:pt}),g=null}const Ft=new wd;Ft.setAnimationLoop(yt),this.setAnimationLoop=function(K){tt=K},this.dispose=function(){}}}const Mx=new Wt,Nd=new kt;Nd.set(-1,0,0,0,1,0,0,0,1);function yx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,vd(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,x,T,b){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,b)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,x,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ve&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ve&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),T=x.envMap,b=x.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Mx.makeRotationFromEuler(b)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Nd),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=T*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,e(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ve&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Sx(s,t,e,n){let i={},r={};function a(x,T){const b=T.program;n.uniformBlockBinding(x,b,i[x.id])}function o(x,T){let b=i[x.id];b===void 0&&(g(x),b=l(x),i[x.id]=b,x.addEventListener("dispose",m));const C=T.program;n.updateUBOMapping(x,C);const w=t.render.frame;r[x.id]!==w&&(c(x),r[x.id]=w)}function l(x){const T=s.createBuffer(),b=x.__size,C=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,b,C),s.bindBuffer(s.UNIFORM_BUFFER,null),T}function c(x){const T=i[x.id],b=x.uniforms,C=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let w=0,_=b.length;w<_;w++){const S=b[w];if(Array.isArray(S))for(let I=0,P=S.length;I<P;I++)h(S[I],w,I,C);else h(S,w,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(x,T,b,C){if(u(x,T,b,C)===!0){const w=x.__offset,_=x.value;if(Array.isArray(_)){let S=0;for(let I=0;I<_.length;I++){const P=_[I],D=v(P,!0);d(P,x.__data,S),S+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else d(_,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,w,x.__data)}}function d(x,T,b){typeof x=="number"||typeof x=="boolean"?T[b]=x:x.isMatrix3?(T[b]=x.elements[0],T[b+1]=x.elements[1],T[b+2]=x.elements[2],T[b+3]=0,T[b+4]=x.elements[3],T[b+5]=x.elements[4],T[b+6]=x.elements[5],T[b+7]=0,T[b+8]=x.elements[6],T[b+9]=x.elements[7],T[b+10]=x.elements[8],T[b+11]=0):ArrayBuffer.isView(x)?T.set(x.subarray(0,T.length-b),b):x.toArray(T,b)}function u(x,T,b,C){const w=x.value,_=T+"_"+b;if(Array.isArray(w)){C[_]===void 0&&(C[_]=[]);const S=C[_];let I=!1;for(let P=0;P<w.length;P++)f(w[P],S,P)===!0&&(I=!0);return I}return f(w,C,_)}function f(x,T,b){if(T[b]===void 0)return typeof x=="number"||typeof x=="boolean"?T[b]=x:ArrayBuffer.isView(x)?T[b]=x.slice():T[b]=x.clone(),!0;{const C=T[b];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return T[b]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function g(x){const T=x.uniforms;let b=0;const C=16;for(let _=0,S=T.length;_<S;_++){const I=Array.isArray(T[_])?T[_]:[T[_]];for(let P=0,D=I.length;P<D;P++){const U=I[P],O=Array.isArray(U.value)?U.value:[U.value],L=Array.isArray(T[_])||Array.isArray(U.value);let H=b;for(let W=0,et=O.length;W<et;W++){const X=O[W],j=v(X,L),tt=b%C,yt=tt%j.boundary,Ft=tt+yt;b+=yt,Ft!==0&&C-Ft<j.storage&&(b+=C-Ft),W===0&&(H=b),b+=j.storage}const q=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new q((b-H)/Float32Array.BYTES_PER_ELEMENT),U.__offset=H}}const w=b%C;return w>0&&(b+=C-w),x.__size=b,x.__cache={},this}function v(x,T){const b={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(b.boundary=4,b.storage=4):x.isVector2?(b.boundary=8,b.storage=8):x.isVector3||x.isColor?(b.boundary=16,b.storage=12):x.isVector4?(b.boundary=16,b.storage=16):x.isMatrix3?(b.boundary=16,b.storage=48):x.isMatrix4?(b.boundary=16,b.storage=64):x.isTexture?Ct("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(b.boundary=16,b.storage=x.byteLength):Ct("WebGLRenderer: Unsupported uniform value type.",x),T===!0&&(b.boundary=16,b.storage=Math.ceil(b.storage/16)*16),b}function m(x){const T=x.target;T.removeEventListener("dispose",m),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function p(){for(const x in i)s.deleteBuffer(i[x]);i={},r={}}return{bind:a,update:o,dispose:p}}const bx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let _n=null;function wx(){return _n===null&&(_n=new Zl(bx,16,16,bi,wn),_n.name="DFG_LUT",_n.minFilter=qe,_n.magFilter=qe,_n.wrapS=kn,_n.wrapT=kn,_n.generateMipmaps=!1,_n.needsUpdate=!0),_n}class Ex{constructor(t={}){const{canvas:e=Qf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Qe}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=f,m=new Set([Wl,Gl,Hl]),p=new Set([Qe,bn,Xs,os,kl,zl]),x=new Uint32Array(4),T=new Int32Array(4),b={textures:[],min:[],max:[],resolution:[]};let C=null,w=null;const _=[],S=[];let I=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let D=!1,U=null,O=null,L=null,H=null;this._outputColorSpace=ze;let q=0,W=0,et=null,X=-1,j=null;const tt=new ae,yt=new ae;let Ft=null;const K=new Lt(0);let pt=0,xt=e.width,Et=e.height,lt=1,Nt=null,he=null;const Ut=new ae(0,0,xt,Et),te=new ae(0,0,xt,Et);let oe=!1;const qt=new Ks,Le=new Jl;let ye=!1,Xe=!1;const pe=new Wt,mn=new A,Ee=new ae,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let tn=!1;function en(){return et===null?lt:1}let B=n;function nn(y,F){return e.getContext(y,F)}let ue,de,mt,Se,Dt,Bt,R,M,z,nt,Q,at,dt,$,Z,ct,N,J,Y,ht,st,ot,At;try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ul}`),e.addEventListener("webglcontextlost",Pt,!1),e.addEventListener("webglcontextrestored",Vt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),B===null){const F="webgl2";if(B=nn(F,y),B===null)throw nn(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ht()}catch(y){throw e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",Vt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Ot("WebGLRenderer: "+y.message),y}function Ht(){ue=new R_(B),ue.init(),st=new mx(B,ue),de=new __(B,ue,t,st),mt=new fx(B,ue),de.reversedDepthBuffer&&u&&mt.buffers.depth.setReversed(!0),O=B.createFramebuffer(),L=B.createFramebuffer(),H=B.createFramebuffer(),Se=new L_(B),Dt=new jv,Bt=new px(B,ue,mt,Dt,de,st,Se),R=new A_(P),M=new Dm(B),ot=new m_(B,M),z=new C_(B,M,Se,ot),nt=new D_(B,z,M,ot,Se),J=new I_(B,de,Bt),Z=new v_(Dt),Q=new Qv(P,R,ue,de,ot,Z),at=new yx(P,Dt),dt=new ex,$=new ox(ue),N=new p_(P,R,mt,nt,g,l),ct=new dx(P,nt,de),At=new Sx(B,Se,de,mt),Y=new g_(B,ue,Se),ht=new P_(B,ue,Se),Se.programs=Q.programs,P.capabilities=de,P.extensions=ue,P.properties=Dt,P.renderLists=dt,P.shadowMap=ct,P.state=mt,P.info=Se}v!==Qe&&(I=new U_(v,e.width,e.height,o,i,r));const it=new xx(P,B);this.xr=it,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const y=ue.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ue.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return lt},this.setPixelRatio=function(y){y!==void 0&&(lt=y,this.setSize(xt,Et,!1))},this.getSize=function(y){return y.set(xt,Et)},this.setSize=function(y,F,G=!0){if(it.isPresenting){Ct("WebGLRenderer: Can't change size while VR device is presenting.");return}xt=y,Et=F,e.width=Math.floor(y*lt),e.height=Math.floor(F*lt),G===!0&&(e.style.width=y+"px",e.style.height=F+"px"),I!==null&&I.setSize(e.width,e.height),this.setViewport(0,0,y,F)},this.getDrawingBufferSize=function(y){return y.set(xt*lt,Et*lt).floor()},this.setDrawingBufferSize=function(y,F,G){xt=y,Et=F,lt=G,e.width=Math.floor(y*G),e.height=Math.floor(F*G),this.setViewport(0,0,y,F)},this.setEffects=function(y){if(v===Qe){Ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let F=0;F<y.length;F++)if(y[F].isOutputPass===!0){Ct("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(tt)},this.getViewport=function(y){return y.copy(Ut)},this.setViewport=function(y,F,G,k){y.isVector4?Ut.set(y.x,y.y,y.z,y.w):Ut.set(y,F,G,k),mt.viewport(tt.copy(Ut).multiplyScalar(en()).round())},this.getScissor=function(y){return y.copy(te)},this.setScissor=function(y,F,G,k){y.isVector4?te.set(y.x,y.y,y.z,y.w):te.set(y,F,G,k),mt.scissor(yt.copy(te).multiplyScalar(en()).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(y){mt.setScissorTest(oe=y)},this.setOpaqueSort=function(y){Nt=y},this.setTransparentSort=function(y){he=y},this.getClearColor=function(y){return y.copy(N.getClearColor())},this.setClearColor=function(){N.setClearColor(...arguments)},this.getClearAlpha=function(){return N.getClearAlpha()},this.setClearAlpha=function(){N.setClearAlpha(...arguments)},this.clear=function(y=!0,F=!0,G=!0){let k=0;if(y){let V=!1;if(et!==null){const ft=et.texture.format;V=m.has(ft)}if(V){const ft=et.texture.type,Mt=p.has(ft),ut=N.getClearColor(),vt=N.getClearAlpha(),Tt=ut.r,zt=ut.g,Yt=ut.b;Mt?(x[0]=Tt,x[1]=zt,x[2]=Yt,x[3]=vt,B.clearBufferuiv(B.COLOR,0,x)):(T[0]=Tt,T[1]=zt,T[2]=Yt,T[3]=vt,B.clearBufferiv(B.COLOR,0,T))}else k|=B.COLOR_BUFFER_BIT}F&&(k|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(k|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&B.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),U=y},this.dispose=function(){e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",Vt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),N.dispose(),dt.dispose(),$.dispose(),Bt.dispose(),Dt.dispose(),R.dispose(),nt.dispose(),z.dispose(),ot.dispose(),At.dispose(),Q.dispose(),it.dispose(),it.removeEventListener("sessionstart",fc),it.removeEventListener("sessionend",pc),di.stop()};function Pt(y){y.preventDefault(),la("WebGLRenderer: Context Lost."),D=!0}function Vt(){la("WebGLRenderer: Context Restored."),D=!1;const y=Se.autoReset,F=ct.enabled,G=ct.autoUpdate,k=ct.needsUpdate,V=ct.type;Ht(),Se.autoReset=y,ct.enabled=F,ct.autoUpdate=G,ct.needsUpdate=k,ct.type=V}function gt(y){Ot("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ee(y){const F=y.target;F.removeEventListener("dispose",ee),Te(F)}function Te(y){Kn(y),Dt.remove(y)}function Kn(y){const F=Dt.get(y).programs;F!==void 0&&(F.forEach(function(G){Q.releaseProgram(G)}),y.isShaderMaterial&&Q.releaseShaderCache(y))}this.renderBufferDirect=function(y,F,G,k,V,ft){F===null&&(F=je);const Mt=V.isMesh&&V.matrixWorld.determinantAffine()<0,ut=Jd(y,F,G,k,V);mt.setMaterial(k,Mt);let vt=G.index,Tt=1;if(k.wireframe===!0){if(vt=z.getWireframeAttribute(G),vt===void 0)return;Tt=2}const zt=G.drawRange,Yt=G.attributes.position;let St=zt.start*Tt,$t=(zt.start+zt.count)*Tt;ft!==null&&(St=Math.max(St,ft.start*Tt),$t=Math.min($t,(ft.start+ft.count)*Tt)),vt!==null?(St=Math.max(St,0),$t=Math.min($t,vt.count)):Yt!=null&&(St=Math.max(St,0),$t=Math.min($t,Yt.count));const xe=$t-St;if(xe<0||xe===1/0)return;ot.setup(V,k,ut,G,vt);let ce,le=Y;if(vt!==null&&(ce=M.get(vt),le=ht,le.setIndex(ce)),V.isMesh)k.wireframe===!0?(mt.setLineWidth(k.wireframeLinewidth*en()),le.setMode(B.LINES)):le.setMode(B.TRIANGLES);else if(V.isLine){let Fe=k.linewidth;Fe===void 0&&(Fe=1),mt.setLineWidth(Fe*en()),V.isLineSegments?le.setMode(B.LINES):V.isLineLoop?le.setMode(B.LINE_LOOP):le.setMode(B.LINE_STRIP)}else V.isPoints?le.setMode(B.POINTS):V.isSprite&&le.setMode(B.TRIANGLES);if(V.isBatchedMesh)if(ue.get("WEBGL_multi_draw"))le.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Fe=V._multiDrawStarts,bt=V._multiDrawCounts,He=V._multiDrawCount,Qt=vt?M.get(vt).bytesPerElement:1,fi=Dt.get(k).currentProgram.getUniforms();for(let Oe=0;Oe<He;Oe++)fi.setValue(B,"_gl_DrawID",Oe),le.render(Fe[Oe]/Qt,bt[Oe])}else if(V.isInstancedMesh)le.renderInstances(St,xe,V.count);else if(G.isInstancedBufferGeometry){const Fe=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,bt=Math.min(G.instanceCount,Fe);le.renderInstances(St,xe,bt)}else le.render(St,xe)};function dc(y,F,G,k){U!==null&&y.isNodeMaterial&&U.setObject(k,y),ye===!0&&Z.setState(y,G,!1),y.transparent===!0&&y.side===yn&&y.forceSinglePass===!1?(y.side=Ve,y.needsUpdate=!0,ms(y,F,k),y.side=Si,y.needsUpdate=!0,ms(y,F,k),y.side=yn):ms(y,F,k)}this.compile=function(y,F,G=null){G===null&&(G=y),U!==null&&U.renderStart(y,F,G),w=$.get(G),w.init(F),S.push(w),G.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V))}),y!==G&&y.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V))}),w.setupLights(),U!==null&&U.updateLights(w.state.lightsArray),Xe=this.localClippingEnabled,ye=Z.init(this.clippingPlanes,Xe),ye===!0&&Z.setGlobalState(this.clippingPlanes,F),U!==null&&ct.render(w.state.shadowsArray,G,F);const k=new Set;return y.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ft=V.material;if(ft)if(Array.isArray(ft))for(let Mt=0;Mt<ft.length;Mt++){const ut=ft[Mt];dc(ut,G,F,V),k.add(ut)}else dc(ft,G,F,V),k.add(ft)}),w=S.pop(),U!==null&&U.renderEnd(),k},this.compileAsync=function(y,F,G=null){const k=this.compile(y,F,G);return new Promise(V=>{function ft(){if(k.forEach(function(Mt){const vt=Dt.get(Mt).currentProgram;(vt===void 0||vt.isReady())&&k.delete(Mt)}),k.size===0){V(y);return}setTimeout(ft,10)}ue.get("KHR_parallel_shader_compile")!==null?ft():setTimeout(ft,10)})};let wa=null;function Kd(y){wa&&wa(y)}function fc(){di.stop()}function pc(){di.start()}const di=new wd;di.setAnimationLoop(Kd),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(y){wa=y,it.setAnimationLoop(y),y===null?di.stop():di.start()},it.addEventListener("sessionstart",fc),it.addEventListener("sessionend",pc),this.render=function(y,F){if(F!==void 0&&F.isCamera!==!0){Ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(y,F);const G=it.enabled===!0&&it.isPresenting===!0,k=I!==null&&(et===null||G)&&I.begin(P,et);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(it.cameraAutoUpdate===!0&&it.updateCamera(F),F=it.getCamera()),y.isScene===!0&&y.onBeforeRender(P,y,F,et),w=$.get(y,S.length),w.init(F),w.state.textureUnits=Bt.getTextureUnits(),S.push(w),pe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),F.isArrayCamera?Le.setFromArrayCamera(F):qt.setFromProjectionMatrix(pe,dn,F.reversedDepth),Xe=this.localClippingEnabled,ye=Z.init(this.clippingPlanes,Xe),C=dt.get(y,_.length),C.init(),_.push(C),this.info.render.frame++,it.enabled===!0&&it.isPresenting===!0){const Mt=P.xr.getDepthSensingMesh();Mt!==null&&Ea(Mt,F,-1/0,P.sortObjects)}Ea(y,F,0,P.sortObjects),C.finish(),U!==null&&U.updateLights(w.state.lightsArray),P.sortObjects===!0&&C.sort(Nt,he),tn=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,tn&&N.addToRenderList(C,y),this.info.autoReset===!0&&this.info.reset(),ye===!0&&Z.beginShadows();const V=w.state.shadowsArray;if(ct.render(V,y,F),ye===!0&&Z.endShadows(),(k&&I.hasRenderPass())===!1){const Mt=C.opaque,ut=C.transmissive;if(w.setupLights(),F.isArrayCamera){const vt=F.cameras;if(ut.length>0)for(let Tt=0,zt=vt.length;Tt<zt;Tt++){const Yt=vt[Tt];gc(Mt,ut,y,Yt)}tn&&N.render(y);for(let Tt=0,zt=vt.length;Tt<zt;Tt++){const Yt=vt[Tt];mc(C,y,Yt,Yt.viewport)}}else ut.length>0&&gc(Mt,ut,y,F),tn&&N.render(y),mc(C,y,F)}et!==null&&W===0&&(Bt.updateMultisampleRenderTarget(et),Bt.updateRenderTargetMipmap(et)),k&&I.end(P),y.isScene===!0&&y.onAfterRender(P,y,F),ot.resetDefaultState(),X=-1,j=null,S.pop(),S.length>0?(w=S[S.length-1],Bt.setTextureUnits(w.state.textureUnits),ye===!0&&Z.setGlobalState(P.clippingPlanes,w.state.camera)):w=null,_.pop(),_.length>0?C=_[_.length-1]:C=null,U!==null&&U.renderEnd()};function Ea(y,F,G,k){if(y.visible===!1)return;if(y.layers.test(F.layers)){if(y.isGroup)G=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(F);else if(y.isLight)w.pushLight(y),y.castShadow&&w.pushShadow(y);else if(y.isSprite){const Mt=F.isArrayCamera?Le:qt;if(!y.frustumCulled||y.intersectsFrustum(Mt)){k&&Ee.setFromMatrixPosition(y.matrixWorld).applyMatrix4(pe);const ut=nt.update(y),vt=y.material;vt.visible&&C.push(y,ut,vt,G,Ee.z,null,F)}}else if(y.isMesh||y.isLine||y.isPoints){const Mt=F.isArrayCamera?Le:qt;if(!y.frustumCulled||y.intersectsFrustum(Mt)){const ut=nt.update(y),vt=y.material;if(k&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ee.copy(y.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),Ee.copy(ut.boundingSphere.center)),Ee.applyMatrix4(y.matrixWorld).applyMatrix4(pe)),Array.isArray(vt)){const Tt=ut.groups;for(let zt=0,Yt=Tt.length;zt<Yt;zt++){const St=Tt[zt],$t=vt[St.materialIndex];$t&&$t.visible&&C.push(y,ut,$t,G,Ee.z,St,F)}}else vt.visible&&C.push(y,ut,vt,G,Ee.z,null,F)}}}const ft=y.children;for(let Mt=0,ut=ft.length;Mt<ut;Mt++)Ea(ft[Mt],F,G,k)}function mc(y,F,G,k){const{opaque:V,transmissive:ft,transparent:Mt}=y;w.setupLightsView(G),ye===!0&&Z.setGlobalState(P.clippingPlanes,G),k&&mt.viewport(tt.copy(k)),V.length>0&&nr(V,F,G),ft.length>0&&nr(ft,F,G),Mt.length>0&&nr(Mt,F,G),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function gc(y,F,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[k.id]===void 0){const St=ue.has("EXT_color_buffer_half_float")||ue.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[k.id]=new Sn(1,1,{generateMipmaps:!0,type:St?wn:Qe,minFilter:li,samples:Math.max(4,de.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Zt.workingColorSpace})}const ft=w.state.transmissionRenderTarget[k.id],Mt=k.viewport||tt;ft.setSize(Mt.z*P.transmissionResolutionScale,Mt.w*P.transmissionResolutionScale);const ut=P.getRenderTarget(),vt=P.getActiveCubeFace(),Tt=P.getActiveMipmapLevel();P.setRenderTarget(ft),P.getClearColor(K),pt=P.getClearAlpha(),pt<1&&P.setClearColor(16777215,.5),P.clear(),tn&&N.render(G);const zt=P.toneMapping;P.toneMapping=Hn;const Yt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),w.setupLightsView(k),ye===!0&&Z.setGlobalState(P.clippingPlanes,k),nr(y,G,k),Bt.updateMultisampleRenderTarget(ft),Bt.updateRenderTargetMipmap(ft),ue.has("WEBGL_multisampled_render_to_texture")===!1){let St=!1;for(let $t=0,xe=F.length;$t<xe;$t++){const ce=F[$t],{object:le,geometry:Fe,material:bt,group:He}=ce;if(bt.side===yn&&le.layers.test(k.layers)){const Qt=bt.side;bt.side=Ve,bt.needsUpdate=!0,_c(le,G,k,Fe,bt,He),bt.side=Qt,bt.needsUpdate=!0,St=!0}}St===!0&&(Bt.updateMultisampleRenderTarget(ft),Bt.updateRenderTargetMipmap(ft))}P.setRenderTarget(ut,vt,Tt),P.setClearColor(K,pt),Yt!==void 0&&(k.viewport=Yt),P.toneMapping=zt}function nr(y,F,G){const k=F.isScene===!0?F.overrideMaterial:null;for(let V=0,ft=y.length;V<ft;V++){const Mt=y[V],{object:ut,geometry:vt,group:Tt}=Mt;let zt=Mt.material;zt.allowOverride===!0&&k!==null&&(zt=k),ut.layers.test(G.layers)&&_c(ut,F,G,vt,zt,Tt)}}function _c(y,F,G,k,V,ft){U!==null&&V.isNodeMaterial&&U.setObject(y,V),y.onBeforeRender(P,F,G,k,V,ft),y.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),V.onBeforeRender(P,F,G,k,y,ft),V.transparent===!0&&V.side===yn&&V.forceSinglePass===!1?(V.side=Ve,V.needsUpdate=!0,P.renderBufferDirect(G,F,k,V,y,ft),V.side=Si,V.needsUpdate=!0,P.renderBufferDirect(G,F,k,V,y,ft),V.side=yn):P.renderBufferDirect(G,F,k,V,y,ft),y.onAfterRender(P,F,G,k,V,ft)}function vc(y){let F=0;for(const G of y)G.texture!==null&&F++;return F}function ms(y,F,G){F.isScene!==!0&&(F=je);const k=Dt.get(y),V=w.state.lights,ft=w.state.shadowsArray,Mt=V.state.version,ut=Q.getParameters(y,V.state,ft,F,G,w.state.lightProbeGridArray),vt=Q.getProgramCacheKey(ut);let Tt=k.programs;k.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const zt=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;k.envMap=R.get(y.envMap||k.environment,zt),k.envMapRotation=k.environment!==null&&y.envMap===null?F.environmentRotation:y.envMapRotation,Tt===void 0&&(y.addEventListener("dispose",ee),Tt=new Map,k.programs=Tt,k.programVariants=new Map);let Yt=Tt.get(vt);if(Yt!==void 0){if(k.currentProgram===Yt&&k.lightsStateVersion===Mt)return Mc(y,ut),Yt}else ut.uniforms=Q.getUniforms(y),U!==null&&y.isNodeMaterial&&U.build(y,G,ut),y.onBeforeCompile(ut,P),Yt=Q.acquireProgram(ut,vt),Tt.set(vt,Yt),k.uniforms=ut.uniforms;const St=k.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(St.clippingPlanes=Z.uniform),Mc(y,ut),k.needsLights=jd(y),k.lightsStateVersion=Mt,k.needsLights&&(St.ambientLightColor.value=V.state.ambient,St.lightProbe.value=V.state.probe,St.sunLights.value=V.state.sun,St.sunLightShadows.value=V.state.sunShadow,St.directionalLights.value=V.state.directional,St.directionalLightShadows.value=V.state.directionalShadow,St.spotLights.value=V.state.spot,St.spotLightShadows.value=V.state.spotShadow,St.rectAreaLights.value=V.state.rectArea,St.ltc_1.value=V.state.rectAreaLTC1,St.ltc_2.value=V.state.rectAreaLTC2,St.pointLights.value=V.state.point,St.pointLightShadows.value=V.state.pointShadow,St.hemisphereLights.value=V.state.hemi,St.sunShadowMatrix.value=V.state.sunShadowMatrix,St.sunShadowCascade.value=V.state.sunShadowCascade,St.directionalShadowMatrix.value=V.state.directionalShadowMatrix,St.spotLightMatrix.value=V.state.spotLightMatrix,St.spotLightMap.value=V.state.spotLightMap,St.pointShadowMatrix.value=V.state.pointShadowMatrix),k.numLightProbeGrids=vc(w.state.lightProbeGridArray),k.currentProgram=Yt,k.uniformsList=null,Yt}function Zd(y,F,G,k,V){const ft=Dt.get(y),Mt=ft.currentProgram.id+","+k+","+V;let ut=ft.programVariants.get(Mt);return ut===void 0?(ut=ms(y,F,G),ft.programVariants.set(Mt,ut)):(ft.currentProgram=ut,ft.uniformsList=null,ft.outputColorSpace=k,ft.toneMapping=V),ut}function xc(y){if(y.uniformsList===null){const F=y.currentProgram.getUniforms();y.uniformsList=Qr.seqWithValue(F.seq,y.uniforms)}return y.uniformsList}function Mc(y,F){const G=Dt.get(y);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function Jd(y,F,G,k,V){F.isScene!==!0&&(F=je),Bt.resetTextureUnits();const ft=F.fog,Mt=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,ut=et===null?P.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Zt.workingColorSpace,vt=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Tt=R.get(k.envMap||Mt,vt),zt=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Yt=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),St=!!G.morphAttributes.position,$t=!!G.morphAttributes.normal,xe=!!G.morphAttributes.color;let ce=Hn;k.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(ce=P.toneMapping);const le=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Fe=le!==void 0?le.length:0,bt=Dt.get(k),He=w.state.lights;if(ye===!0&&(Xe===!0||y!==j)){const me=y===j&&k.id===X;Z.setState(k,y,me)}let Qt=!1,fi=!1;k.version===bt.__version?bt.needsLights&&bt.lightsStateVersion!==He.state.version||V.isBatchedMesh&&bt.batching===!1||!V.isBatchedMesh&&bt.batching===!0||V.isBatchedMesh&&bt.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&bt.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&bt.instancing===!1||!V.isInstancedMesh&&bt.instancing===!0||V.isSkinnedMesh&&bt.skinning===!1||!V.isSkinnedMesh&&bt.skinning===!0||V.isInstancedMesh&&bt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&bt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&bt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&bt.instancingMorph===!1&&V.morphTexture!==null||bt.envMap!==Tt||k.fog===!0&&bt.fog!==ft||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==Z.numPlanes||bt.numIntersection!==Z.numIntersection)||bt.vertexAlphas!==zt||bt.vertexTangents!==Yt||bt.morphTargets!==St||bt.morphNormals!==$t||bt.morphColors!==xe||bt.morphTargetsCount!==Fe||bt.numLightProbeGrids!==vc(w.state.lightProbeGridArray)?Qt=!0:(bt.outputColorSpace!==ut||bt.toneMapping!==ce)&&(fi=!0):(Qt=!0,bt.__version=k.version);let Oe=bt.currentProgram;(Qt===!0||fi===!0)&&(Oe=fi===!0?Zd(k,F,V,ut,ce):ms(k,F,V),U&&k.isNodeMaterial&&U.onUpdateProgram(k,Oe,bt));let ir=!1,Zn=!1,pi=!1;const Jt=Oe.getUniforms(),Ie=bt.uniforms;if(mt.useProgram(Oe.program)&&(ir=!0,Zn=!0,pi=!0),k.id!==X&&(X=k.id,Zn=!0),ir||j!==y){mt.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Jt.setValue(B,"projectionMatrix",y.projectionMatrix),Jt.setValue(B,"viewMatrix",y.matrixWorldInverse);const Ae=Jt.map.cameraPosition;Ae!==void 0&&Ae.setValue(B,mn.setFromMatrixPosition(y.matrixWorld)),de.logarithmicDepthBuffer&&Jt.setValue(B,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Jt.setValue(B,"isOrthographic",y.isOrthographicCamera===!0),j!==y&&(j=y,Zn=!0,pi=!0)}if(bt.needsLights&&(He.state.sunShadowMap.length>0&&Jt.setValue(B,"sunShadowMap",He.state.sunShadowMap,Bt),He.state.directionalShadowMap.length>0&&Jt.setValue(B,"directionalShadowMap",He.state.directionalShadowMap,Bt),He.state.spotShadowMap.length>0&&Jt.setValue(B,"spotShadowMap",He.state.spotShadowMap,Bt),He.state.pointShadowMap.length>0&&Jt.setValue(B,"pointShadowMap",He.state.pointShadowMap,Bt)),V.isSkinnedMesh){Jt.setOptional(B,V,"bindMatrix"),Jt.setOptional(B,V,"bindMatrixInverse");const me=V.skeleton;me&&(me.boneTexture===null&&me.computeBoneTexture(),Jt.setValue(B,"boneTexture",me.boneTexture,Bt))}V.isBatchedMesh&&(Jt.setOptional(B,V,"batchingTexture"),Jt.setValue(B,"batchingTexture",V._matricesTexture,Bt),Jt.setOptional(B,V,"batchingIdTexture"),Jt.setValue(B,"batchingIdTexture",V._indirectTexture,Bt),Jt.setOptional(B,V,"batchingColorTexture"),V._colorsTexture!==null&&Jt.setValue(B,"batchingColorTexture",V._colorsTexture,Bt));const on=G.morphAttributes;if((on.position!==void 0||on.normal!==void 0||on.color!==void 0)&&J.update(V,G,Oe),(Zn||bt.receiveShadow!==V.receiveShadow)&&(bt.receiveShadow=V.receiveShadow,Jt.setValue(B,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(Ie.envMapIntensity.value=F.environmentIntensity),Ie.dfgLUT!==void 0&&(Ie.dfgLUT.value=wx()),Zn){if(Jt.setValue(B,"toneMappingExposure",P.toneMappingExposure),bt.needsLights&&Qd(Ie,pi),ft&&k.fog===!0&&at.refreshFogUniforms(Ie,ft),at.refreshMaterialUniforms(Ie,k,lt,Et,w.state.transmissionRenderTarget[y.id]),bt.needsLights&&bt.numLightProbeGrids>0){const me=b;let Ae=0;for(const Rn of w.state.lightProbeGridArray)Rn.texture!==null&&(me.textures[Ae]=Rn.texture,me.min[Ae]=Rn.boundingBox.min,me.max[Ae]=Rn.boundingBox.max,me.resolution[Ae]=Rn.resolution,Ae++);for(const Rn in me)me[Rn].length=Ae;Ie.probesSH.value=me.textures,Ie.probesMin.value=me.min,Ie.probesMax.value=me.max,Ie.probesResolution.value=me.resolution}Qr.upload(B,xc(bt),Ie,Bt)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Qr.upload(B,xc(bt),Ie,Bt),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Jt.setValue(B,"center",V.center),Jt.setValue(B,"modelViewMatrix",V.modelViewMatrix),Jt.setValue(B,"normalMatrix",V.normalMatrix),Jt.setValue(B,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){const me=k.uniformsGroups;for(let Ae=0,Rn=me.length;Ae<Rn;Ae++){const Sc=me[Ae];At.update(Sc,Oe),At.bind(Sc,Oe)}}return Oe}function Qd(y,F){y.ambientLightColor.needsUpdate=F,y.lightProbe.needsUpdate=F,y.sunLights.needsUpdate=F,y.sunLightShadows.needsUpdate=F,y.directionalLights.needsUpdate=F,y.directionalLightShadows.needsUpdate=F,y.pointLights.needsUpdate=F,y.pointLightShadows.needsUpdate=F,y.spotLights.needsUpdate=F,y.spotLightShadows.needsUpdate=F,y.rectAreaLights.needsUpdate=F,y.hemisphereLights.needsUpdate=F}function jd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(y,F,G){const k=Dt.get(y);k.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),Dt.get(y.texture).__webglTexture=F,Dt.get(y.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:G,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,F){const G=Dt.get(y);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(y,F=0,G=0){et=y,q=F,W=G;let k=null,V=!1,ft=!1;if(y){const ut=Dt.get(y);if(ut.__useDefaultFramebuffer!==void 0){mt.bindFramebuffer(B.FRAMEBUFFER,ut.__webglFramebuffer),tt.copy(y.viewport),yt.copy(y.scissor),Ft=y.scissorTest,mt.viewport(tt),mt.scissor(yt),mt.setScissorTest(Ft),X=-1;return}else if(ut.__webglFramebuffer===void 0)Bt.setupRenderTarget(y);else if(ut.__hasExternalTextures)Bt.rebindTextures(y,Dt.get(y.texture).__webglTexture,Dt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const zt=y.depthTexture;if(ut.__boundDepthTexture!==zt){if(zt!==null&&Dt.has(zt)&&(y.width!==zt.image.width||y.height!==zt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Bt.setupDepthRenderbuffer(y)}}const vt=y.texture;(vt.isData3DTexture||vt.isDataArrayTexture||vt.isCompressedArrayTexture)&&(ft=!0);const Tt=Dt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Tt[F])?k=Tt[F][G]:k=Tt[F],V=!0):y.samples>0&&Bt.useMultisampledRTT(y)===!1?k=Dt.get(y).__webglMultisampledFramebuffer:Array.isArray(Tt)?k=Tt[G]:k=Tt,tt.copy(y.viewport),yt.copy(y.scissor),Ft=y.scissorTest}else tt.copy(Ut).multiplyScalar(lt).floor(),yt.copy(te).multiplyScalar(lt).floor(),Ft=oe;if(G!==0&&(k=O),mt.bindFramebuffer(B.FRAMEBUFFER,k)&&mt.drawBuffers(y,k),mt.viewport(tt),mt.scissor(yt),mt.setScissorTest(Ft),V){const ut=Dt.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+F,ut.__webglTexture,G)}else if(ft){const ut=F;for(let vt=0;vt<y.textures.length;vt++){const Tt=Dt.get(y.textures[vt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+vt,Tt.__webglTexture,G,ut)}}else if(y!==null&&G!==0){const ut=Dt.get(y.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ut.__webglTexture,G)}X=-1};function yc(y){const F=Dt.get(y);return(F.__readFormat!==y.format||F.__readType!==y.type)&&(F.__readFormat=y.format,F.__readType=y.type,F.__formatReadable=de.textureFormatReadable(y.format),F.__typeReadable=de.textureTypeReadable(y.type)),F}this.readRenderTargetPixels=function(y,F,G,k,V,ft,Mt,ut=0){if(!(y&&y.isWebGLRenderTarget)){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=Dt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Mt!==void 0&&(vt=vt[Mt],Array.isArray(vt)&&(vt=vt[0])),vt){mt.bindFramebuffer(B.FRAMEBUFFER,vt);try{const Tt=y.textures[ut],zt=Tt.format,Yt=Tt.type;y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ut);const St=yc(Tt);if(St.__formatReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(St.__typeReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=y.width-k&&G>=0&&G<=y.height-V&&B.readPixels(F,G,k,V,st.convert(zt),st.convert(Yt),ft)}finally{const Tt=et!==null?Dt.get(et).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(y,F,G,k,V,ft,Mt,ut=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=Dt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Mt!==void 0&&(vt=vt[Mt],Array.isArray(vt)&&(vt=vt[0])),vt)if(F>=0&&F<=y.width-k&&G>=0&&G<=y.height-V){mt.bindFramebuffer(B.FRAMEBUFFER,vt);const Tt=y.textures[ut],zt=Tt.format,Yt=Tt.type;y.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+ut);const St=yc(Tt);if(St.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(St.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $t=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,$t),B.bufferData(B.PIXEL_PACK_BUFFER,ft.byteLength,B.STREAM_READ),B.readPixels(F,G,k,V,st.convert(zt),st.convert(Yt),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);const xe=et!==null?Dt.get(et).__webglFramebuffer:null;mt.bindFramebuffer(B.FRAMEBUFFER,xe);const ce=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await jf(B,ce,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,$t),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ft),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer($t),B.deleteSync(ce),ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,F=null,G=0){const k=Math.pow(2,-G),V=Math.floor(y.image.width*k),ft=Math.floor(y.image.height*k),Mt=F!==null?F.x:0,ut=F!==null?F.y:0;Bt.setTexture2D(y,0),B.copyTexSubImage2D(B.TEXTURE_2D,G,0,0,Mt,ut,V,ft),mt.unbindTexture()},this.copyTextureToTexture=function(y,F,G=null,k=null,V=0,ft=0){let Mt,ut,vt,Tt,zt,Yt,St,$t,xe;const ce=y.isCompressedTexture?y.mipmaps[ft]:y.image;if(G!==null)Mt=G.max.x-G.min.x,ut=G.max.y-G.min.y,vt=G.isBox3?G.max.z-G.min.z:1,Tt=G.min.x,zt=G.min.y,Yt=G.isBox3?G.min.z:0;else{const Jt=Math.pow(2,-V);Mt=Math.floor(ce.width*Jt),ut=Math.floor(ce.height*Jt),y.isDataArrayTexture?vt=ce.depth:y.isData3DTexture?vt=Math.floor(ce.depth*Jt):vt=1,Tt=0,zt=0,Yt=0}k!==null?(St=k.x,$t=k.y,xe=k.z):(St=0,$t=0,xe=0);const le=st.convert(F.format),Fe=st.convert(F.type);let bt;F.isData3DTexture?(Bt.setTexture3D(F,0),bt=B.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Bt.setTexture2DArray(F,0),bt=B.TEXTURE_2D_ARRAY):(Bt.setTexture2D(F,0),bt=B.TEXTURE_2D),mt.activeTexture(B.TEXTURE0),mt.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,F.flipY),mt.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),mt.pixelStorei(B.UNPACK_ALIGNMENT,F.unpackAlignment);const He=mt.getParameter(B.UNPACK_ROW_LENGTH),Qt=mt.getParameter(B.UNPACK_IMAGE_HEIGHT),fi=mt.getParameter(B.UNPACK_SKIP_PIXELS),Oe=mt.getParameter(B.UNPACK_SKIP_ROWS),ir=mt.getParameter(B.UNPACK_SKIP_IMAGES);mt.pixelStorei(B.UNPACK_ROW_LENGTH,ce.width),mt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ce.height),mt.pixelStorei(B.UNPACK_SKIP_PIXELS,Tt),mt.pixelStorei(B.UNPACK_SKIP_ROWS,zt),mt.pixelStorei(B.UNPACK_SKIP_IMAGES,Yt);const Zn=y.isDataArrayTexture||y.isData3DTexture,pi=F.isDataArrayTexture||F.isData3DTexture;if(y.isDepthTexture){const Jt=Dt.get(y),Ie=Dt.get(F),on=Dt.get(Jt.__renderTarget),me=Dt.get(Ie.__renderTarget);mt.bindFramebuffer(B.READ_FRAMEBUFFER,on.__webglFramebuffer),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let Ae=0;Ae<vt;Ae++)Zn&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Dt.get(y).__webglTexture,V,Yt+Ae),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Dt.get(F).__webglTexture,ft,xe+Ae)),B.blitFramebuffer(Tt,zt,Tt+Mt,zt+ut,St,$t,St+Mt,$t+ut,B.DEPTH_BUFFER_BIT,B.NEAREST);mt.bindFramebuffer(B.READ_FRAMEBUFFER,null),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(V!==0||y.isRenderTargetTexture||Dt.has(y)){const Jt=Dt.get(y),Ie=Dt.get(F);mt.bindFramebuffer(B.READ_FRAMEBUFFER,L),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,H);for(let on=0;on<vt;on++)Zn?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Jt.__webglTexture,V,Yt+on):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Jt.__webglTexture,V),pi?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ie.__webglTexture,ft,xe+on):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Ie.__webglTexture,ft),V!==0?B.blitFramebuffer(Tt,zt,Tt+Mt,zt+ut,St,$t,St+Mt,$t+ut,B.COLOR_BUFFER_BIT,B.NEAREST):pi?B.copyTexSubImage3D(bt,ft,St,$t,xe+on,Tt,zt,Mt,ut):B.copyTexSubImage2D(bt,ft,St,$t,Tt,zt,Mt,ut);mt.bindFramebuffer(B.READ_FRAMEBUFFER,null),mt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else pi?y.isDataTexture||y.isData3DTexture?B.texSubImage3D(bt,ft,St,$t,xe,Mt,ut,vt,le,Fe,ce.data):F.isCompressedArrayTexture?B.compressedTexSubImage3D(bt,ft,St,$t,xe,Mt,ut,vt,le,ce.data):B.texSubImage3D(bt,ft,St,$t,xe,Mt,ut,vt,le,Fe,ce):y.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,ft,St,$t,Mt,ut,le,Fe,ce.data):y.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,ft,St,$t,ce.width,ce.height,le,ce.data):B.texSubImage2D(B.TEXTURE_2D,ft,St,$t,Mt,ut,le,Fe,ce);mt.pixelStorei(B.UNPACK_ROW_LENGTH,He),mt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Qt),mt.pixelStorei(B.UNPACK_SKIP_PIXELS,fi),mt.pixelStorei(B.UNPACK_SKIP_ROWS,Oe),mt.pixelStorei(B.UNPACK_SKIP_IMAGES,ir),ft===0&&F.generateMipmaps===!0&&F.mipmapsAutoUpdate===!0&&B.generateMipmap(bt),mt.unbindTexture()},this.initRenderTarget=function(y){Dt.get(y).__webglFramebuffer===void 0&&Bt.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Bt.setTextureCube(y,0):y.isData3DTexture?Bt.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Bt.setTexture2DArray(y,0):Bt.setTexture2D(y,0),mt.unbindTexture()},this.resetState=function(){q=0,W=0,et=null,mt.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}const Tx="modulepreload",Ax=function(s){return"/mece/"+s},Wh={},Rx=function(t,e,n){let i=Promise.resolve();if(e&&e.length>0){let l=function(c){return Promise.all(c.map(h=>Promise.resolve(h).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");i=l(e.map(c=>{if(c=Ax(c),c in Wh)return;Wh[c]=!0;const h=c.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":Tx,h||(u.as="script"),u.crossOrigin="",u.href=c,o&&u.setAttribute("nonce",o),document.head.appendChild(u),h)return new Promise((f,g)=>{u.addEventListener("load",f),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return i.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},Xh=[],Cx="/mece/",Xn={fighters:new Map,sword:null,swords:new Map,arenas:new Map,slice:new Map};async function Px(){if(!Xh.length)return!1;const{GLTFLoader:s}=await Rx(async()=>{const{GLTFLoader:n}=await import("./GLTFLoader-BOM0ZSSn.js");return{GLTFLoader:n}},__vite__mapDeps([0,1,2])),t=new s;let e=!1;return await Promise.all(Xh.map(async n=>{const i=/^(?:(fighters|swords|arenas|slice)\/([\w-]+)|(sword))\.(?:glb|gltf)$/i.exec(n);if(i)try{const a=(await t.loadAsync(`${Cx}models/${n}`)).scene;if(a.traverse(o=>{const l=o;l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),i[3])Xn.sword=a;else{const o=i[1].toLowerCase();Xn[o].set(i[2].toLowerCase(),a)}e=!0}catch(r){console.warn("3D model se nenačetl:",n,r)}})),e}function Ei(s,t){let e=null;const n=t.toLowerCase();return s.traverse(i=>{!e&&i.name.toLowerCase()===n&&(e=i)}),e}const fe=(s,t,e)=>s<t?t:s>e?e:s,Os=(s,t,e)=>s+(t-s)*e,Vn=(s,t)=>1-Math.exp(-s*t),Rt=(s=0,t=1)=>s+Math.random()*(t-s),us=s=>s[Math.floor(Math.random()*s.length)],Lx=(s,t,e)=>{const n=fe((e-s)/(t-s),0,1);return n*n*(3-2*n)};function Ix(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Ud(s){const t=Math.max(0,Math.ceil(s));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}function jr(s,t){try{const e=localStorage.getItem(s);return e===null?t:JSON.parse(e)}catch{return t}}function ta(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}const fn=s=>s.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),pa=new Map;function rt(s){const t="l"+s;let e=pa.get(t);return e||pa.set(t,e=new Qp({color:s})),e}function qh(s){const t="g"+s;let e=pa.get(t);return e||pa.set(t,e=new $s({color:s})),e}const Hs=1776415,Rl=10134445,ro=2829634;function De(s,t,e=0,n=0,i=0){const r=new wt(s,t);return r.position.set(e,n,i),r.castShadow=!0,r}const se=(s,t,e=0,n=0,i=0,r=14)=>De(new Ce(s,r,Math.max(6,r-4)),t,e,n,i),Fn=(s,t,e,n,i=0,r=0,a=0)=>De(new Ze(s,t,e),n,i,r,a),si=(s,t,e,n=8)=>De(new Bn(s,t,n),e);function Fr(s,t,e){const n=De(new wi(s,Math.max(.01,t-2*s),4,8),e);return n.position.y=-t/2,n}function xi(s,t,e,n,i=.075){for(const r of[-1,1])s.add(se(i,rt(16777215),r*n,t,e,10)),s.add(se(i*.55,rt(Hs),r*n,t,e+i*.75,8))}function Dx(s){const t=new ge,e=rt(s.fur),n=rt(s.fur2);switch(s.style){case"fox":{t.add(se(.34,e));const r=si(.17,.38,n);r.rotation.x=Math.PI/2,r.position.set(0,-.08,.38),t.add(r),t.add(se(.06,rt(Hs),0,-.07,.57,8));for(const a of[-1,1]){const o=si(.13,.32,e,4);o.position.set(a*.19,.34,-.02),o.rotation.z=-a*.25,t.add(o);const l=si(.06,.12,rt(Hs),4);l.position.set(a*.225,.47,-.02),l.rotation.z=-a*.25,t.add(l),t.add(se(.12,n,a*.17,-.13,.2,10))}xi(t,.07,.27,.13);break}case"frog":{const r=se(.34,e);r.scale.set(1.25,.8,1.05),t.add(r);const a=se(.3,n,0,-.12,.1);a.scale.set(1.15,.5,.95),t.add(a);for(const l of[-1,1])t.add(se(.15,e,l*.18,.24,.12,12));xi(t,.27,.22,.18,.09);const o=De(new ui(.17,.02,4,14,Math.PI),rt(8003371),0,-.04,.31);o.rotation.set(.3,0,Math.PI),t.add(o);break}case"penguin":{t.add(se(.35,e));const r=se(.3,n,0,-.03,.16);r.scale.set(.85,.8,.6),t.add(r);const a=si(.08,.24,rt(16753434),6);a.rotation.x=Math.PI/2,a.position.set(0,-.07,.42),t.add(a),xi(t,.07,.3,.11,.065);break}case"bunny":{t.add(se(.34,e));for(const r of[-1,1]){const a=De(new wi(.085,.42,4,8),e,r*.13,.55,-.04);a.rotation.z=-r*.18,t.add(a);const o=De(new wi(.045,.34,4,6),n,r*.135,.55,.03);o.rotation.z=-r*.18,t.add(o),t.add(se(.1,rt(16766688),r*.17,-.12,.22,10))}t.add(se(.055,rt(16743074),0,-.03,.34,8)),t.add(Fn(.1,.07,.03,rt(16777215),0,-.14,.31)),xi(t,.08,.27,.13);break}case"cat":{t.add(se(.34,e));for(const a of[-1,1]){const o=si(.13,.24,e,4);o.position.set(a*.2,.3,0),o.rotation.z=-a*.3,t.add(o);const l=si(.07,.14,rt(16757705),4);l.position.set(a*.2,.3,.05),l.rotation.z=-a*.3,t.add(l);for(const c of[0,-.05]){const h=Fn(.26,.012,.012,rt(2236962),a*.3,-.1+c,.26);h.rotation.z=a*(c?-.15:.12),t.add(h)}}const r=se(.18,n,0,-.12,.24);r.scale.set(1.2,.7,.8),t.add(r),t.add(se(.045,rt(16743074),0,-.06,.37,8)),xi(t,.07,.27,.13);break}case"bear":{t.add(se(.35,e));for(const a of[-1,1])t.add(se(.12,e,a*.25,.27,-.02,10)),t.add(se(.065,n,a*.25,.27,.05,8));const r=se(.17,n,0,-.11,.26);r.scale.set(1.15,.8,.85),t.add(r),t.add(se(.07,rt(Hs),0,-.04,.41,8)),xi(t,.08,.28,.13,.065);break}case"robot":{t.add(Fn(.56,.5,.52,rt(s.fur))),t.add(Fn(.48,.2,.05,rt(1316122),0,.03,.27));for(const r of[-1,1]){t.add(Fn(.12,.06,.02,qh(s.fur2),r*.11,.04,.3));const a=De(new ve(.07,.07,.08,10),rt(Rl),r*.31,0,0);a.rotation.z=Math.PI/2,t.add(a)}t.add(De(new ve(.02,.02,.26,6),rt(Rl),0,.38,0)),t.add(se(.06,qh(16724821),0,.53,0,8)),t.add(Fn(.26,.04,.02,rt(1316122),0,-.14,.27));break}case"pig":{t.add(se(.35,e));const r=De(new ve(.13,.14,.12,14),n,0,-.07,.35);r.rotation.x=Math.PI/2,t.add(r);for(const a of[-1,1]){t.add(se(.03,rt(9058893),a*.05,-.07,.415,6));const o=si(.11,.2,e,4);o.position.set(a*.21,.29,.04),o.rotation.set(.55,0,-a*.4),t.add(o)}xi(t,.09,.28,.13,.065);break}}const i=De(new ui(.335,.045,6,22),rt(s.main),0,.12,0);return i.rotation.x=Math.PI/2-.12,s.style!=="robot"&&t.add(i),t}const Yh=["hips","torso","head","upperarm_r","forearm_r","hand_r","grip_r","upperarm_l","forearm_l","hand_l","grip_l","thigh_r","shin_r","thigh_l","shin_l"];function Nx(s){const t=new ge,e=s?s.main:13214826,n=s?s.shirt:11569746,i=s?s.style==="robot"?Rl:s.fur:14203e3,r=(c,h,d,u,f)=>{const g=new ge;return g.name=c,g.position.set(d,u,f),h.add(g),g},a=r("hips",t,0,.74,0);a.add(Fn(.42,.2,.26,rt(s?ro:11569746),0,-.02,0));const o=r("torso",a,0,.06,0);if(s){const c=De(new wi(.25,.26,4,12),rt(n),0,.24,0);c.scale.set(1,1,.82),o.add(c);const h=De(new ve(.27,.29,.36,12,1,!0),rt(e),0,.2,0);h.scale.set(1,1,.84),o.add(h);const d=De(new ui(.255,.035,5,16),rt(s.accent),0,.03,0);d.rotation.x=Math.PI/2,d.scale.set(1,.84,1),o.add(d)}else{const c=De(new ve(.24,.3,.6,10),rt(13214826),0,.24,0);o.add(c);for(const h of[.05,.42]){const d=De(new ui(h<.2?.29:.25,.025,4,14),rt(9067051),0,h,0);d.rotation.x=Math.PI/2,o.add(d)}}const l=r("head",o,0,.5,0);if(s){const c=Dx(s);c.scale.setScalar(.92),c.position.y=.27,l.add(c)}else{const c=se(.27,rt(14205066),0,.24,0);l.add(c);for(const u of[-1,1])l.add(se(.045,rt(Hs),u*.1,.28,.24,8));const h=Fn(.14,.02,.02,rt(5913114),0,.16,.26);l.add(h);const d=si(.3,.3,rt(9067051),10);d.position.y=.58,l.add(d)}for(const c of["r","l"]){const h=c==="r"?-1:1,d=r(`upperarm_${c}`,o,h*.29,.43,0);d.add(Fr(.07,.27,rt(s?n:13214826)));const u=se(.09,rt(s?e:13214826));d.add(u);const f=r(`forearm_${c}`,d,0,-.27,0);f.add(Fr(.06,.25,rt(s?n:13214826)));const g=r(`hand_${c}`,f,0,-.25,0);g.add(se(.075,rt(i),0,-.06,.01,10)),r(`grip_${c}`,g,0,-.07,.02).quaternion.setFromAxisAngle(new A(1,0,0),Math.PI/2);const m=r(`thigh_${c}`,a,h*.12,-.06,0);m.add(Fr(.095,.36,rt(s?ro:13214826)));const p=r(`shin_${c}`,m,0,-.36,0);p.add(Fr(.08,.32,rt(s?ro:9067051)));const x=Fn(.16,.1,.26,rt(s?s.accent:7031338),0,-.3,.05);p.add(x)}return s||(t.getObjectByName("thigh_r").visible=!1,t.getObjectByName("thigh_l").visible=!1,a.add(De(new ve(.06,.07,.8,8),rt(7031338),0,-.38,0))),t}const $h=new A,Kh=new A,Ux=new A,ao=new Kt,Zh=new Kt,Jh=new Kt,Or=new En,Fx=new A(1,0,0);class Fd{constructor(t){E(this,"root",new ge);E(this,"model");E(this,"j",new Map);E(this,"rest",new Map);E(this,"arms");E(this,"hipsY");E(this,"gripActual",new A);E(this,"materials",[]);E(this,"fromTemplate",!1);const e=Xn.fighters.get(t?String(t.id):"dummy");let n=null;e&&(n=e.clone(!0),Yh.slice(0,6).every(i=>Ei(n,i))||(console.warn("Model šermíře nemá potřebné uzly, používám náhradu:",t?.id??"dummy"),n=null)),this.fromTemplate=!!n,this.model=n??Nx(t),this.model.rotation.y=Math.PI,this.root.add(this.model);for(const i of Yh){let r=Ei(this.model,i);if(!r)if(r=new ge,r.name=i,i.startsWith("grip")){const a=this.j.get(i==="grip_r"?"hand_r":"hand_l");r.position.set(0,-.07,.02),r.quaternion.setFromAxisAngle(Fx,Math.PI/2),a.add(r)}else this.model.add(r);this.j.set(i,r),this.rest.set(r,{p:r.position.clone(),q:r.quaternion.clone()})}this.model.traverse(i=>{const r=i;r.isMesh&&(r.castShadow=!0)}),this.ownMaterials(),this.hipsY=this.j.get("hips").position.y,this.root.updateMatrixWorld(!0),this.arms={R:this.chain("r"),L:this.chain("l")}}get(t){return this.j.get(t)}chain(t){const e=this.get(`upperarm_${t}`),n=this.get(`forearm_${t}`),i=this.get(`hand_${t}`),r=this.get(`grip_${t}`),a=Math.max(.12,n.position.length()),o=Math.max(.12,i.position.length());return{upper:e,fore:n,hand:i,grip:r,upperDir:n.position.lengthSq()>1e-6?n.position.clone().normalize():new A(0,-1,0),foreDir:i.position.lengthSq()>1e-6?i.position.clone().normalize():new A(0,-1,0),a,b:o,gripPos:r.position.clone(),gripQuat:r.quaternion.clone()}}rot(t,e,n,i){const r=this.get(t);Or.set(e,n,i,"YXZ"),r.quaternion.copy(this.rest.get(r).q).multiply(ao.setFromEuler(Or))}shoulderWorld(t,e){return this.arms[t].upper.getWorldPosition(e)}reach(t){const e=this.arms[t];return e.a+e.b+e.gripPos.length()*.6}pose(t){const e=t.t,n=Math.sin(e*2.1)*.012,i=this.get("hips"),r=this.rest.get(i),a=fe(t.crouch,0,1),o=Math.abs(Math.sin(t.walk))*.03*t.walkAmt;i.position.copy(r.p),i.position.y=this.hipsY-a*.12+n+o-t.teeter*.04;const l=-t.hit*.45,c=t.teeter*Math.sin(e*9)*.35,h=t.flail;this.rot("hips",t.lean*.4+l*.4+c*.6+h*Math.sin(e*7)*.3,t.twist*.35,Math.sin(e*1.3)*.02),this.rot("torso",t.lean*.6+l*.6+c*.4-t.cheer*.15,t.twist*.65,c*.3);const d=.13+a*.06,u=Math.sin(t.walk)*.45*t.walkAmt,f=h*Math.sin(e*13)*.9,g=t.hand==="R"?"r":"l";for(const p of["r","l"]){const x=p==="r"?-1:1,T=p===g,b=T?-.28:.22,C=.2+a*.55+(T?.15:.05),w=(p==="r"?u:-u)+(p==="r"?f:-f);this.rot(`thigh_${p}`,b*(1-h)+w-a*.35*(T?1:.4),0,x*d*-1+c*.2),this.rot(`shin_${p}`,C+Math.max(0,-w)*.6,0,0)}const v=t.gripPos?[t.hand==="R"?"l":"r"]:["r","l"];for(const p of v){const x=p==="r"?-1:1,T=p==="r"?0:1.7,b=Math.sin(e*11+T)*(.6*h+.9*t.teeter+.35*t.cheer),C=t.cheer*2.6+h*1.8+t.teeter*1.2;this.rot(`upperarm_${p}`,.35-a*.2-C*.2,0,x*(.35+C*.55+b)),this.rot(`forearm_${p}`,-.9-t.cheer*.4+b*.5,0,0),this.rot(`hand_${p}`,0,0,0)}const m=this.get("head");if(m.quaternion.copy(this.rest.get(m).q),this.root.updateMatrixWorld(!0),t.look){const p=m.getWorldPosition($h),x=m.parent.getWorldQuaternion(Zh),b=Kh.subVectors(t.look,p).normalize().applyQuaternion(Jh.copy(x).invert()),C=fe(Math.atan2(b.x,b.z),-.7,.7),w=fe(-Math.asin(fe(b.y,-1,1)),-.5,.5);Or.set(w+t.hit*-.5+Math.sin(e*17)*t.hit*.25,C,Math.sin(e*9)*t.teeter*.3,"YXZ"),m.quaternion.multiply(ao.setFromEuler(Or))}t.gripPos&&t.gripQuat&&t.pole?this.solveArm(this.arms[t.hand],t.gripPos,t.gripQuat,t.pole):this.root.updateMatrixWorld(!0)}solveArm(t,e,n,i){const r=ao.copy(n).multiply(Zh.copy(t.gripQuat).invert()),a=$h.copy(t.gripPos).applyQuaternion(r).negate().add(e),o=t.upper.getWorldPosition(Kh),l=Ux.subVectors(a,o);let c=l.length();const h=t.a,d=t.b;c=fe(c,Math.abs(h-d)+.02,h+d-.005);const u=l.normalize(),f=new A().copy(i).addScaledVector(u,-i.dot(u));f.lengthSq()<1e-6&&f.set(0,-1,0).addScaledVector(u,u.y),f.normalize();const g=fe((h*h+c*c-d*d)/(2*h*c),-1,1),v=Math.sqrt(1-g*g),m=new A().copy(u).multiplyScalar(g).addScaledVector(f,v),p=new A().copy(o).addScaledVector(m,h),x=new A().copy(o).addScaledVector(u,c);this.aim(t.upper,t.upperDir,m),t.upper.updateMatrixWorld(!0);const T=new A().subVectors(x,p).normalize();this.aim(t.fore,t.foreDir,T),t.fore.updateMatrixWorld(!0);const b=t.fore.getWorldQuaternion(Jh);t.hand.quaternion.copy(b.invert().multiply(r)),t.hand.updateMatrixWorld(!0),t.grip.getWorldPosition(this.gripActual)}aim(t,e,n){const i=t.parent.getWorldQuaternion(new Kt),r=i.clone().multiply(this.rest.get(t).q),a=e.clone().applyQuaternion(r),l=new Kt().setFromUnitVectors(a,n).multiply(r);t.quaternion.copy(i.invert().multiply(l))}setOpacity(t){const e=t<.99;for(const n of this.materials)n.transparent!==e&&(n.transparent=e,n.depthWrite=!e,n.needsUpdate=!0),n.opacity=t}dispose(){this.root.removeFromParent(),this.fromTemplate||this.model.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()});for(const t of this.materials)t.dispose()}ownMaterials(){const t=new Map,e=n=>{let i=t.get(n);return i||(i=n.clone(),t.set(n,i)),i};this.model.traverse(n=>{const i=n;i.isMesh&&(i.material=Array.isArray(i.material)?i.material.map(e):e(i.material))}),this.materials.length=0,this.materials.push(...t.values())}}const jt={id:"molo",halfLen:3.6,halfWidth:1.15,waterY:-1.5,friction:6,fog:15981760,skyTop:5083112,skyHorizon:16769725,water:4169648,waterDeep:1726064};function Ox(s,t){return new Tn({side:Ve,depthWrite:!1,fog:!1,uniforms:{top:{value:new Lt(s)},horizon:{value:new Lt(t)}},vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = clamp(vP.y, 0.0, 1.0); vec3 c = mix(horizon, top, pow(h, 0.5)); gl_FragColor = vec4(c, 1.0); }`})}function Bx(){return new Tn({uniforms:{time:{value:0},shallow:{value:new Lt(jt.water)},deep:{value:new Lt(jt.waterDeep)},fogColor:{value:new Lt(jt.fog)}},vertexShader:`uniform float time; varying float vDist; varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0);
        w.y += sin(w.x*0.9 + time*1.3)*0.025 + cos(w.z*1.1 + time*1.1)*0.025;
        vW = w.xyz; vec4 mv = viewMatrix * w; vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float time; uniform vec3 shallow; uniform vec3 deep; uniform vec3 fogColor;
      varying float vDist; varying vec3 vW;
      void main(){
        float waves = sin(vW.x*2.3 + time*1.7)*0.5 + sin(vW.z*2.9 - time*1.3)*0.5 + sin((vW.x+vW.z)*4.1 + time*2.2)*0.3;
        float r = length(vW.xz);
        vec3 c = mix(deep, shallow, 0.5 + waves*0.12 + smoothstep(14.0, 24.0, r)*0.3);
        float spark = smoothstep(0.93, 1.0, sin(vW.x*7.0 + time*2.0) * sin(vW.z*6.0 - time*1.6));
        c += spark * vec3(0.45, 0.4, 0.3);
        float f = smoothstep(20.0, 90.0, vDist);
        gl_FragColor = vec4(mix(c, fogColor, f), 1.0);
      }`})}const Qh=[{x:-4.4,z:-4.6,color:3107839},{x:4.4,z:4.6,color:16731501},{x:4.6,z:-4.4,color:3985230},{x:-4.6,z:4.4,color:16758531}];class kx{constructor(t){E(this,"group",new ge);E(this,"sun");E(this,"spectatorSpots",[]);E(this,"waterMat");E(this,"ripples",[]);E(this,"ducks",[]);E(this,"t",0);t.fog=new Kl(jt.fog,35,140),t.background=new Lt(jt.skyHorizon),this.group.add(new wt(new Ce(450,32,16),Ox(jt.skyTop,jt.skyHorizon)));const e=nf("sky-molo");if(e){const a=new gm().load(e);a.colorSpace=ze;const o=new wt(new ve(320,320,160,64,1,!0),new $s({map:a,side:Ve,fog:!1,depthWrite:!1}));o.position.y=58,this.group.add(o)}this.group.add(new _m(13625087,6978106,1.2)),this.sun=new ym(16770756,2.6),this.sun.position.set(-9,11,5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048);const n=this.sun.shadow.camera;n.left=-7,n.right=7,n.top=7,n.bottom=-7,n.near=1,n.far=40,this.sun.shadow.bias=-5e-4,this.group.add(this.sun,this.sun.target),this.waterMat=Bx();const i=new wt(new Qs(260,260,60,60),this.waterMat);i.rotation.x=-Math.PI/2,i.position.y=jt.waterY,i.receiveShadow=!1,this.group.add(i);const r=Xn.arenas.get(jt.id);if(r){const a=r.clone(!0);a.traverse(o=>{o.name.toLowerCase()==="water"&&(o.visible=!1)}),this.group.add(a);for(let o=1;o<=12;o++){const l=Ei(a,`spectator_${o}`);if(!l)continue;l.updateWorldMatrix(!0,!1);const c=new A().setFromMatrixPosition(l.matrixWorld),h=new Kt;l.getWorldQuaternion(h);const d=new A(0,0,1).applyQuaternion(h);this.spectatorSpots.push({pos:c,yaw:Math.atan2(d.x,d.z)+Math.PI})}}else this.buildFallback();this.spectatorSpots.length||this.defaultSpots(),t.add(this.group)}add(t,e,n,i,r=!0){return t.position.set(e,n,i),t.traverse(a=>{const o=a;o.isMesh&&(o.castShadow=r,o.receiveShadow=!0)}),this.group.add(t),t}defaultSpots(){for(const n of Qh)for(const i of[-.55,.55]){const r=new A(n.x,jt.waterY+.32,n.z+i);this.spectatorSpots.push({pos:r,yaw:Math.atan2(r.x,r.z)})}const e=[0,2,4,6,1,3,5,7].map(n=>this.spectatorSpots[n]).filter(Boolean);this.spectatorSpots.splice(0,this.spectatorSpots.length,...e)}buildFallback(){const t=jt.halfLen,e=jt.halfWidth,n=jt.waterY,i=[12618324,11434049,13605474];for(let u=-t+.135,f=0;u<t;u+=.27,f++){const g=new wt(new Ze(e*2,.12,.25),rt(i[f%3]));g.rotation.y=(f%2?1:-1)*.004,this.add(g,0,-.06,u)}for(const u of[-1,1]){const f=new wt(new Ze(.16,.2,2*t),rt(8017200));this.add(f,u*(e-.2),-.2,0);for(let g=-t+.15;g<=t;g+=1.2){const v=new wt(new ve(.1,.11,2.4,8),rt(7031338));if(this.add(v,u*(e-.05),-1.1,g),Math.abs(g)<t-.3){const m=new wt(new ve(.06,.065,1,7),rt(8017200));this.add(m,u*(e-.05),.5,g);const p=new wt(new Ce(.075,8,6),rt(9068600));this.add(p,u*(e-.05),1.02,g)}}for(const g of[.95,.55]){const v=new wt(new ve(.028,.028,2*t-.7,6),rt(15391666));v.rotation.x=Math.PI/2,this.add(v,u*(e-.05),g,0)}}for(const u of Qh){const f=new ge,g=new wt(new Ze(1.15,.45,2.6),rt(u.color)),v=new wt(new Ze(.9,.4,2.3),rt(12618324));v.position.y=.08;const m=new wt(new Bn(.58,.9,4),rt(u.color));m.rotation.set(Math.PI/2,Math.PI/4,0),m.position.z=1.72,m.scale.set(1,1,.55),f.add(g,v,m),f.rotation.y=u.z>0?Math.PI:0,this.add(f,u.x,jt.waterY+.1,u.z,!1)}const r=new wt(new ve(34,36,2.4,64,1,!0),rt(8038474));this.add(r,0,n+.6,0,!1);const a=new wt(new Zs(34,140,64),rt(8828242));a.rotation.x=-Math.PI/2,this.add(a,0,n+1.8,0,!1);for(let u=0;u<160;u++){const f=Rt(0,Math.PI*2),g=Rt(27,33.5),v=Rt(1.2,2.4),m=new wt(new ve(.025,.045,v,5),rt(u%3?7313978:8890437));if(m.rotation.set(Rt(-.15,.15),0,Rt(-.15,.15)),this.add(m,Math.cos(f)*g,n+v/2-.1,Math.sin(f)*g,!1),u%4===0){const p=new wt(new wi(.06,.22,3,6),rt(7029286));this.add(p,Math.cos(f)*g,n+v-.05,Math.sin(f)*g,!1)}}for(let u=0;u<40;u++){const f=Rt(0,Math.PI*2),g=Rt(4,22),v=Math.cos(f)*g,m=Math.sin(f)*g;if(Math.abs(v)<2.2&&Math.abs(m)<t+3)continue;const p=new wt(new is(Rt(.3,.55),12,.3,Math.PI*2-.3),rt(5216831));if(p.rotation.x=-Math.PI/2,this.add(p,v,n+.03,m,!1),u%5===0){const x=new wt(new Ce(.1,8,6),rt(16762845));this.add(x,v+.1,n+.1,m,!1)}}for(let u=0;u<70;u++){const f=Rt(0,Math.PI*2),g=Rt(44,95),v=new ge,m=new wt(new ve(.3,.4,2.6,6),rt(7031338));m.position.y=1.3;const p=Rt(.9,1.5),x=new wt(new Bn(2.2*p,6.5*p,7),rt(u%3===0?4885050:u%3===1?3107636:4028986));x.position.y=2.4+3.2*p,v.add(m,x),this.add(v,Math.cos(f)*g,n+1.8,Math.sin(f)*g,!1)}for(let u=0;u<9;u++){const f=u/9*Math.PI*2+.3,g=new wt(new Ce(Rt(28,42),16,8,0,Math.PI*2,0,Math.PI/2),rt(u%2?8367704:7315020));g.scale.y=Rt(.25,.4),this.add(g,Math.cos(f)*150,n,Math.sin(f)*150,!1)}const o=new ge,l=new wt(new Ze(5,4,8),rt(15985368));l.position.y=2;const c=new wt(new Bn(4.6,2.6,4),rt(11879727));c.position.y=5.3,c.rotation.y=Math.PI/4,c.scale.z=1.6;const h=new wt(new Ze(2.4,9,2.4),rt(15985368));h.position.set(0,4.5,5);const d=new wt(new Bn(1.8,4.5,8),rt(4025162));d.position.set(0,11.2,5),o.add(l,c,h,d),this.add(o,-38,n+1.8,-62,!1),o.rotation.y=.5;for(let u=0;u<5;u++){const f=new ge,g=new wt(new Ce(.22,10,8),rt(u===0?16777215:9071162));g.scale.set(1,.7,1.4);const v=new wt(new Ce(.12,8,6),rt(u===0?16777215:3111498));v.position.set(0,.2,.22);const m=new wt(new Bn(.04,.12,6),rt(16753434));m.rotation.x=Math.PI/2,m.position.set(0,.18,.36),f.add(g,v,m),this.add(f,0,n+.08,0,!1),this.ducks.push({o:f,a:Rt(0,Math.PI*2),r:Rt(8,18),speed:Rt(.03,.07)*(u%2?1:-1)})}}splash(t){for(let e=0;e<2;e++){const n=new wt(new Zs(.5,.75,40),new $s({color:16777215,transparent:!0,opacity:.85,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.set(t.x,jt.waterY+.04,t.z),this.group.add(n),this.ripples.push({t:-e*.35,mesh:n})}}update(t){this.t+=t,this.waterMat.uniforms.time.value=this.t;for(const e of this.ripples){e.t+=t;const n=1+Math.max(0,e.t)*3.2;e.mesh.scale.set(n,n,n),e.mesh.material.opacity=e.t<0?0:Math.max(0,.85-e.t*.5)}this.ripples=this.ripples.filter(e=>e.t<1.9?!0:(e.mesh.removeFromParent(),e.mesh.geometry.dispose(),!1));for(const e of this.ducks)e.a+=e.speed*t,e.o.position.x=Math.cos(e.a)*e.r,e.o.position.z=Math.sin(e.a)*e.r,e.o.position.y=jt.waterY+.08+Math.sin(this.t*2+e.r)*.02,e.o.rotation.y=e.speed>0?-e.a:Math.PI-e.a}}class zx{constructor(t,e,n){E(this,"src");E(this,"f");E(this,"g");E(this,"p");E(this,"ctx");this.ctx=t,this.src=t.createBufferSource(),this.src.buffer=n,this.src.loop=!0,this.f=t.createBiquadFilter(),this.f.type="bandpass",this.f.Q.value=2.2,this.f.frequency.value=500,this.g=t.createGain(),this.g.gain.value=0,this.p=t.createStereoPanner?t.createStereoPanner():null,this.src.connect(this.f).connect(this.g),this.p?this.g.connect(this.p).connect(e):this.g.connect(e),this.src.start()}set(t,e,n=1){const i=this.ctx.currentTime,r=Math.max(0,Math.min(1,(t-2.5)/14));this.f.frequency.setTargetAtTime(380+r*r*2600,i,.02),this.g.gain.setTargetAtTime(n*r*r*.55,i,r>.05?.015:.05),this.p&&this.p.pan.setTargetAtTime(Math.max(-1,Math.min(1,e)),i,.05)}stop(){const t=this.ctx.currentTime;this.g.gain.setTargetAtTime(0,t,.03),this.src.stop(t+.3)}}class Vx{constructor(){E(this,"ctx",null);E(this,"master",null);E(this,"sfxBus",null);E(this,"musicBus",null);E(this,"noise",null);E(this,"muted",!1)}unlock(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:.85;const e=this.ctx.createDynamicsCompressor();this.master.connect(e).connect(this.ctx.destination),this.sfxBus=this.ctx.createGain(),this.sfxBus.connect(this.master),this.musicBus=this.ctx.createGain(),this.musicBus.gain.value=.16,this.musicBus.connect(this.master);const n=this.ctx.sampleRate*2;this.noise=this.ctx.createBuffer(1,n,this.ctx.sampleRate);const i=this.noise.getChannelData(0);for(let r=0;r<n;r++)i[r]=Math.random()*2-1}this.ctx.state==="suspended"&&this.ctx.resume()}get ready(){return!!this.ctx&&this.ctx.state==="running"}setMuted(t){this.muted=t,this.master&&this.ctx&&this.master.gain.setTargetAtTime(t?0:.85,this.ctx.currentTime,.05)}swing(){return!this.ctx||!this.sfxBus||!this.noise?null:new zx(this.ctx,this.sfxBus,this.noise)}note(t,e,n,i,r,a,o,l=.006){const c=this.ctx,h=c.createOscillator(),d=c.createGain();h.type=r,h.frequency.setValueAtTime(e,n),o&&h.frequency.exponentialRampToValueAtTime(o,n+i),d.gain.setValueAtTime(1e-4,n),d.gain.exponentialRampToValueAtTime(a,n+l),d.gain.exponentialRampToValueAtTime(1e-4,n+i),h.connect(d).connect(t),h.start(n),h.stop(n+i+.05)}noiseHit(t,e,n,i,r,a,o,l=1){const c=this.ctx,h=c.createBufferSource();h.buffer=this.noise;const d=c.createBiquadFilter();d.type=a,d.frequency.setValueAtTime(r,e),o&&d.frequency.exponentialRampToValueAtTime(o,e+n),d.Q.value=l;const u=c.createGain();u.gain.setValueAtTime(i,e),u.gain.exponentialRampToValueAtTime(1e-4,e+n),h.connect(d).connect(u).connect(t),h.start(e,Math.random()*1.5),h.stop(e+n+.05)}play(t,e=1){if(!this.ctx||!this.sfxBus||this.muted)return;const n=this.ctx.currentTime+.005,i=this.sfxBus;switch(t){case"hit":this.noiseHit(i,n,.12,.7*e,1400,"bandpass",500,.9),this.note(i,150,n,.18,"sine",.6*e,60);break;case"hitStrong":this.noiseHit(i,n,.2,.9*e,2200,"bandpass",400,.8),this.note(i,120,n,.32,"sine",.8*e,45),this.note(i,520,n,.08,"triangle",.25*e,300),this.noiseHit(i,n+.03,.4,.25*e,5e3,"highpass");break;case"block":this.note(i,680,n,.09,"triangle",.5*e,520),this.note(i,1030,n,.06,"sine",.25*e),this.noiseHit(i,n,.05,.4*e,3e3,"bandpass",void 0,2);break;case"clash":this.note(i,760,n,.12,"triangle",.5*e,600),this.note(i,590,n+.04,.12,"triangle",.4*e,480),this.noiseHit(i,n,.12,.5*e,4200,"bandpass",2e3,1.5);break;case"splash":this.noiseHit(i,n,.9,.9*e,2600,"lowpass",260),this.noiseHit(i,n,.25,.5*e,900,"bandpass",300,1.2);for(let r=0;r<6;r++)this.note(i,400+Math.random()*500,n+.25+r*.09,.07,"sine",.12*e,900);break;case"count":this.note(i,660,n,.12,"square",.12*e);break;case"go":case"gong":this.note(i,196,n,1.1,"sine",.45*e,190),this.note(i,294,n,.9,"sine",.25*e),this.note(i,392,n,.7,"triangle",.12*e);break;case"join":this.note(i,523,n,.1,"triangle",.3*e),this.note(i,784,n+.08,.16,"triangle",.3*e);break;case"click":this.note(i,900,n,.04,"square",.08*e);break;case"ready":this.note(i,660,n,.08,"triangle",.3*e),this.note(i,990,n+.07,.14,"triangle",.3*e);break;case"tick":this.note(i,1200,n,.03,"square",.05*e);break;case"teeter":this.note(i,420,n,.5,"sine",.2*e,300),this.note(i,300,n+.25,.45,"sine",.18*e,420);break;case"cheer":{for(let r=0;r<4;r++)this.noiseHit(i,n+r*.1,1.4,.18*e,1200+r*300,"bandpass",900,.6);break}case"slice":this.noiseHit(i,n,.14,.7*e,6e3,"highpass"),this.note(i,240,n+.02,.12,"sine",.4*e,120);break;case"bonk":this.note(i,330,n,.18,"sine",.5*e,520),this.note(i,220,n,.12,"square",.12*e);break;case"squeak":this.note(i,1200,n,.18,"sine",.3*e,1800),this.note(i,1500,n+.15,.2,"sine",.25*e,900);break;case"combo":this.note(i,880,n,.08,"triangle",.25*e),this.note(i,1320,n+.06,.1,"triangle",.25*e);break;case"miss":this.note(i,300,n,.25,"triangle",.2*e,160);break;case"point":[523,659,784].forEach((r,a)=>this.note(i,r,n+a*.09,.22,"triangle",.3*e));break;case"win":[523,659,784,1047,784,1047].forEach((r,a)=>this.note(i,r,n+a*.13,a===5?.7:.2,"triangle",.32*e)),[262,330,392].forEach(r=>this.note(i,r,n+.65,.9,"sine",.18*e));break}}}class Hx{constructor(t){E(this,"s");E(this,"timer",0);E(this,"step",0);E(this,"nextT",0);E(this,"theme","");E(this,"on",!1);this.s=t}play(t){this.on&&this.theme===t||(this.stop(),this.theme=t,this.on=!0,this.step=0,this.nextT=0,this.timer=window.setInterval(()=>this.tick(),50))}stop(){this.on=!1,clearInterval(this.timer)}tick(){const t=this.s;if(!t.ctx||!t.musicBus||t.muted)return;const e=t.ctx,i=60/(this.theme==="hrad"?104:this.theme==="kra"?92:118)/2;for(this.nextT<e.currentTime&&(this.nextT=e.currentTime+.05);this.nextT<e.currentTime+.25;)this.playStep(this.step,this.nextT,i),this.step=(this.step+1)%64,this.nextT+=i}playStep(t,e,n){const i=this.s,r=this.s.musicBus,a=u=>220*Math.pow(2,u/12),o=[0,2,3,5,7,9,10,12,14,15,17],l={molo:[7,-1,5,4,3,-1,4,2,0,-1,2,4,5,4,3,2,4,-1,5,7,8,7,5,4,3,4,2,-1,0,-1,-1,-1],hrad:[0,-1,0,2,3,-1,2,0,4,-1,4,3,2,-1,0,-1,5,-1,4,3,2,3,4,-1,2,1,0,-1,0,-1,-1,-1],kra:[7,-1,-1,9,8,-1,7,-1,4,-1,-1,5,4,-1,2,-1,3,-1,-1,4,5,-1,7,-1,4,-1,2,-1,0,-1,-1,-1]},h=(l[this.theme]??l.molo)[t%32],d=this.theme==="kra"?5:0;if(h>=0){const u=a(o[h%o.length]+d+5);i.note(r,u,e,n*(this.theme==="kra"?3:1.6),this.theme==="kra"?"sine":"triangle",this.theme==="kra"?.35:.5),this.theme==="kra"&&i.note(r,u*2,e,n*2,"sine",.08)}if(t%4===0){const u=[0,0,5,7][Math.floor(t/16)%4];i.note(r,a(u+d-12),e,n*3.5,this.theme==="hrad"?"sawtooth":"triangle",this.theme==="hrad"?.18:.42)}this.theme!=="kra"?(t%4===0&&i.noiseHit(r,e,.12,.35,180,"lowpass"),t%4===2&&i.noiseHit(r,e,.06,.18,4500,"highpass"),this.theme==="molo"&&t%8===7&&i.noiseHit(r,e,.05,.12,6e3,"highpass")):t%8===0&&i.noiseHit(r,e,.6,.06,7e3,"highpass")}}class jh{constructor(t,e){E(this,"points");E(this,"max");E(this,"pos");E(this,"vel");E(this,"col");E(this,"size");E(this,"life");E(this,"maxLife");E(this,"grav");E(this,"baseSize");E(this,"next",0);E(this,"geo");this.max=t,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.col=new Float32Array(t*4),this.size=new Float32Array(t),this.baseSize=new Float32Array(t),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.grav=new Float32Array(t),this.geo=new Pe,this.geo.setAttribute("position",new Ye(this.pos,3).setUsage(ks)),this.geo.setAttribute("color",new Ye(this.col,4).setUsage(ks)),this.geo.setAttribute("size",new Ye(this.size,1).setUsage(ks));const n=new Tn({transparent:!0,depthWrite:!1,blending:e?rs:ts,uniforms:{scale:{value:600}},vertexShader:`attribute float size; attribute vec4 color; varying vec4 vC; uniform float scale;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * scale / max(0.1, -mv.z); gl_Position = projectionMatrix * mv; }`,fragmentShader:`varying vec4 vC; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
        float a = smoothstep(0.5, 0.15, r); gl_FragColor = vec4(vC.rgb, vC.a * a); }`});this.points=new Xp(this.geo,n),this.points.frustumCulled=!1,this.points.renderOrder=6}setScale(t){this.points.material.uniforms.scale.value=t*.9}emit(t,e,n,i,r,a){const o=this.next;this.next=(this.next+1)%this.max,this.pos.set([t.x,t.y,t.z],o*3),this.vel.set([e.x,e.y,e.z],o*3),this.col.set([n.r,n.g,n.b,1],o*4),this.size[o]=this.baseSize[o]=i,this.life[o]=this.maxLife[o]=r,this.grav[o]=a}update(t){for(let e=0;e<this.max;e++){if(this.life[e]<=0){this.size[e]=0;continue}this.life[e]-=t;const n=Math.max(0,this.life[e]/this.maxLife[e]);this.vel[e*3+1]-=this.grav[e]*t;const i=1-Math.min(1,t*1.5);for(let r=0;r<3;r++)this.vel[e*3+r]*=i,this.pos[e*3+r]+=this.vel[e*3+r]*t;this.col[e*4+3]=Math.min(1,n*1.6),this.size[e]=this.baseSize[e]*(.4+.6*n)}this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0,this.geo.attributes.size.needsUpdate=!0}}const Yi=new A,vn=new Lt;class Gx{constructor(){E(this,"glow",new jh(700,!0));E(this,"drops",new jh(900,!1));E(this,"group",new ge);this.group.add(this.glow.points,this.drops.points)}setViewportHeight(t){this.glow.setScale(t),this.drops.setScale(t)}hit(t,e,n){const i=14+Math.round(n*22);for(let r=0;r<i;r++)Yi.set(Rt(-1,1),Rt(-.6,1.2),Rt(-1,1)).normalize().multiplyScalar(Rt(2,5+n*4)),vn.set(r%3===0?16777215:r%3===1?16765471:e),this.glow.emit(t,Yi,vn,Rt(.05,.12)*(1+n*.5),Rt(.25,.55),6)}clash(t,e){for(let n=0;n<26;n++)Yi.set(Rt(-1,1),Rt(-.4,1.4),Rt(-1,1)).normalize().multiplyScalar(Rt(2.5,7)),vn.set(e?n%2?10479871:16777215:n%2?16765471:16777215),this.glow.emit(t,Yi,vn,Rt(.03,.07),Rt(.2,.45),9)}splash(t,e=1){for(let n=0;n<140*e;n++){const i=Rt(0,Math.PI*2),r=Rt(0,.8),a=Yi.set(t.x+Math.cos(i)*r,t.y,t.z+Math.sin(i)*r).clone(),o=new A(Math.cos(i)*Rt(.5,2.5),Rt(3,8)*e,Math.sin(i)*Rt(.5,2.5));vn.set(n%4===0?16777215:13496319),this.drops.emit(a,o,vn,Rt(.06,.16),Rt(.6,1.2),14)}}juice(t,e,n){for(let i=0;i<34;i++){const r=new A(Rt(-1,1),Rt(-.2,1),Rt(-1,1)).normalize().multiplyScalar(Rt(1,4)).addScaledVector(n,2);vn.set(e),this.drops.emit(t,r,vn,Rt(.04,.1),Rt(.4,.9),9)}}confetti(t){const e=[16765471,16731501,5231103,3985230,16777215,16742938];for(let n=0;n<120;n++){const i=new A(Rt(-2,2),Rt(4,9),Rt(-2,2));vn.set(e[n%e.length]),this.drops.emit(Yi.copy(t),i,vn,Rt(.07,.12),Rt(1.5,2.6),5)}}update(t){this.glow.update(t),this.drops.update(t)}}function ma(s,t="av"){const e=Wn[s];if(!e)return`<span class="${t}" style="--c:#c9a46a"><span>🎯</span></span>`;const n=sf(s);return n?`<span class="${t}" style="--c:${bc(e.main)}"><img src="${n}" alt="${e.name}"></span>`:`<span class="${t}" style="--c:${bc(e.main)}"><span>${e.emoji}</span></span>`}function Wx(s,t){let e="";for(let n=0;n<t;n++)e+=`<i class="${n<s?"on":""}"></i>`;return`<span class="pips">${e}</span>`}class Xx{constructor(t){E(this,"el");E(this,"top");E(this,"left");E(this,"right");E(this,"mid");E(this,"bigEl");E(this,"prompts");E(this,"pops");E(this,"bigTimer",0);E(this,"keys",{});this.el=t,t.innerHTML=`
      <div class="h-top"><div class="h-pl h-left"></div><div class="h-mid"></div><div class="h-pl h-right"></div></div>
      <div class="h-big"></div>
      <div class="h-prompt"></div><div class="h-prompt"></div>
      <div class="h-pops"></div>
      <div class="h-split"></div>`,this.top=t.querySelector(".h-top"),this.left=t.querySelector(".h-left"),this.right=t.querySelector(".h-right"),this.mid=t.querySelector(".h-mid"),this.bigEl=t.querySelector(".h-big"),this.prompts=[...t.querySelectorAll(".h-prompt")],this.pops=t.querySelector(".h-pops")}show(t){this.el.classList.toggle("off",!t)}split(t){this.el.classList.toggle("is-split",t)}setHtml(t,e,n){this.keys[e]!==n&&(this.keys[e]=n,t.innerHTML=n)}setTop(t,e,n){const i=r=>r?`${ma(r.char)}<div class="h-name"><b>${fn(r.name)}</b>${r.sub?`<small>${r.sub}</small>`:""}</div><div class="h-score">${r.score}</div>`:"";this.setHtml(this.left,"l",i(t)),this.setHtml(this.right,"r",i(e)),this.setHtml(this.mid,"m",n),this.top.hidden=!t&&!e&&!n}big(t,e="",n=1400,i=""){this.bigEl.className=`h-big show ${i}`,this.bigEl.innerHTML=`<b>${fn(t)}</b>${e?`<small>${fn(e)}</small>`:""}`,this.bigEl.offsetWidth,this.bigEl.classList.add("anim"),clearTimeout(this.bigTimer),n>0&&(this.bigTimer=window.setTimeout(()=>this.bigEl.classList.remove("show"),n))}hideBig(){clearTimeout(this.bigTimer),this.bigEl.classList.remove("show")}prompt(t,e,n){const i=this.prompts[t];if(i){if(!e){i.hidden=!0,this.keys["p"+t]="";return}i.hidden=!1,this.setHtml(i,"p"+t,e),n&&(i.style.left=`${n.x+n.w/2}px`,i.style.maxWidth=`${Math.max(240,n.w-40)}px`)}}pop(t,e,n,i=""){const r=document.createElement("div");for(r.className=`pop ${i}`,r.textContent=t,r.style.left=`${e}px`,r.style.top=`${n}px`,this.pops.append(r),setTimeout(()=>r.remove(),1100);this.pops.childElementCount>12;)this.pops.firstElementChild?.remove()}flash(t="rgba(255,255,255,0.5)"){const e=document.createElement("div");e.className="flash",e.style.background=t,this.el.append(e),setTimeout(()=>e.remove(),400)}}class qx{constructor(t){E(this,"down",new Set);E(this,"onKey",null);E(this,"mx",0);E(this,"my",.15);E(this,"mouseDown",!1);addEventListener("keydown",e=>{e.target?.tagName!=="INPUT"&&(e.code==="Space"&&e.preventDefault(),!e.repeat&&(this.down.add(e.code),this.onKey?.(e.code,e)))}),addEventListener("keyup",e=>this.down.delete(e.code)),addEventListener("blur",()=>{this.down.clear(),this.mouseDown=!1}),addEventListener("pointermove",e=>{this.mx=e.clientX/innerWidth*2-1,this.my=-(e.clientY/innerHeight*2-1)}),t.addEventListener("pointerdown",e=>{e.button===0&&(this.mouseDown=!0)}),addEventListener("pointerup",e=>{e.button===0&&(this.mouseDown=!1)}),t.addEventListener("contextmenu",e=>e.preventDefault())}key(t){return this.down.has(t)}get guard(){return this.mouseDown||this.down.has("Space")}}class Yx{constructor(t){E(this,"code","");E(this,"peer",null);E(this,"retries",0);E(this,"restartTimer",0);E(this,"ev");this.ev=t}get ready(){return!!this.peer&&this.peer.open}start(t=lf()){clearTimeout(this.restartTimer),this.code=t,this.ev.status("connecting");const e=new rf(af(t),of());this.peer=e,e.on("open",()=>{this.retries=0,this.ev.room(t),this.ev.status("ready")}),e.on("connection",n=>this.wire(n)),e.on("disconnected",()=>{setTimeout(()=>{!e.destroyed&&e.disconnected&&e.reconnect()},1500)}),e.on("error",n=>{const i=n.type??"";if(i==="unavailable-id"){e.destroy(),this.start();return}if(i!=="peer-unavailable"){if(i==="browser-incompatible"){this.ev.status("error","Tenhle prohlížeč neumí WebRTC. Použij Chrome, Edge nebo Firefox.");return}if(["network","server-error","socket-error","socket-closed","disconnected"].includes(i)){this.ev.status("error","Nedaří se spojit se signalizačním serverem, zkouším znovu…"),this.scheduleRestart();return}console.warn("PeerJS:",i,n)}})}scheduleRestart(){clearTimeout(this.restartTimer),this.retries++,this.restartTimer=window.setTimeout(()=>{if(!this.peer?.open){if(this.peer&&!this.peer.destroyed&&this.peer.disconnected){this.peer.reconnect(),this.scheduleRestart();return}this.peer?.destroy(),this.start(this.code)}},Math.min(1e4,1500*this.retries))}wire(t){let e=!1;const n=()=>{e||(e=!0,this.ev.closed(t))};if(t.label===cf){const r=String(t.metadata?.cid??"");t.open?this.ev.motion(t,r):t.on("open",()=>this.ev.motion(t,r))}t.on("data",r=>{const a=r;a&&typeof a=="object"&&typeof a.t=="string"&&this.ev.message(t,a)}),t.on("close",n),t.on("error",n)}send(t,e){if(!(!t||!t.open))try{t.send(e)}catch{}}}var $i={},oo,tu;function $x(){return tu||(tu=1,oo=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),oo}var lo={},ni={},eu;function Ai(){if(eu)return ni;eu=1;let s;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return ni.getSymbolSize=function(n){if(!n)throw new Error('"version" cannot be null or undefined');if(n<1||n>40)throw new Error('"version" should be in range from 1 to 40');return n*4+17},ni.getSymbolTotalCodewords=function(n){return t[n]},ni.getBCHDigit=function(e){let n=0;for(;e!==0;)n++,e>>>=1;return n},ni.setToSJISFunction=function(n){if(typeof n!="function")throw new Error('"toSJISFunc" is not a valid function.');s=n},ni.isKanjiModeEnabled=function(){return typeof s<"u"},ni.toSJIS=function(n){return s(n)},ni}var co={},nu;function rc(){return nu||(nu=1,(function(s){s.L={bit:1},s.M={bit:0},s.Q={bit:3},s.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return s.L;case"m":case"medium":return s.M;case"q":case"quartile":return s.Q;case"h":case"high":return s.H;default:throw new Error("Unknown EC Level: "+e)}}s.isValid=function(n){return n&&typeof n.bit<"u"&&n.bit>=0&&n.bit<4},s.from=function(n,i){if(s.isValid(n))return n;try{return t(n)}catch{return i}}})(co)),co}var ho,iu;function Kx(){if(iu)return ho;iu=1;function s(){this.buffer=[],this.length=0}return s.prototype={get:function(t){const e=Math.floor(t/8);return(this.buffer[e]>>>7-t%8&1)===1},put:function(t,e){for(let n=0;n<e;n++)this.putBit((t>>>e-n-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}},ho=s,ho}var uo,su;function Zx(){if(su)return uo;su=1;function s(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return s.prototype.set=function(t,e,n,i){const r=t*this.size+e;this.data[r]=n,i&&(this.reservedBit[r]=!0)},s.prototype.get=function(t,e){return this.data[t*this.size+e]},s.prototype.xor=function(t,e,n){this.data[t*this.size+e]^=n},s.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]},uo=s,uo}var fo={},ru;function Jx(){return ru||(ru=1,(function(s){const t=Ai().getSymbolSize;s.getRowColCoords=function(n){if(n===1)return[];const i=Math.floor(n/7)+2,r=t(n),a=r===145?26:Math.ceil((r-13)/(2*i-2))*2,o=[r-7];for(let l=1;l<i-1;l++)o[l]=o[l-1]-a;return o.push(6),o.reverse()},s.getPositions=function(n){const i=[],r=s.getRowColCoords(n),a=r.length;for(let o=0;o<a;o++)for(let l=0;l<a;l++)o===0&&l===0||o===0&&l===a-1||o===a-1&&l===0||i.push([r[o],r[l]]);return i}})(fo)),fo}var po={},au;function Qx(){if(au)return po;au=1;const s=Ai().getSymbolSize,t=7;return po.getPositions=function(n){const i=s(n);return[[0,0],[i-t,0],[0,i-t]]},po}var mo={},ou;function jx(){return ou||(ou=1,(function(s){s.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};s.isValid=function(i){return i!=null&&i!==""&&!isNaN(i)&&i>=0&&i<=7},s.from=function(i){return s.isValid(i)?parseInt(i,10):void 0},s.getPenaltyN1=function(i){const r=i.size;let a=0,o=0,l=0,c=null,h=null;for(let d=0;d<r;d++){o=l=0,c=h=null;for(let u=0;u<r;u++){let f=i.get(d,u);f===c?o++:(o>=5&&(a+=t.N1+(o-5)),c=f,o=1),f=i.get(u,d),f===h?l++:(l>=5&&(a+=t.N1+(l-5)),h=f,l=1)}o>=5&&(a+=t.N1+(o-5)),l>=5&&(a+=t.N1+(l-5))}return a},s.getPenaltyN2=function(i){const r=i.size;let a=0;for(let o=0;o<r-1;o++)for(let l=0;l<r-1;l++){const c=i.get(o,l)+i.get(o,l+1)+i.get(o+1,l)+i.get(o+1,l+1);(c===4||c===0)&&a++}return a*t.N2},s.getPenaltyN3=function(i){const r=i.size;let a=0,o=0,l=0;for(let c=0;c<r;c++){o=l=0;for(let h=0;h<r;h++)o=o<<1&2047|i.get(c,h),h>=10&&(o===1488||o===93)&&a++,l=l<<1&2047|i.get(h,c),h>=10&&(l===1488||l===93)&&a++}return a*t.N3},s.getPenaltyN4=function(i){let r=0;const a=i.data.length;for(let l=0;l<a;l++)r+=i.data[l];return Math.abs(Math.ceil(r*100/a/5)-10)*t.N4};function e(n,i,r){switch(n){case s.Patterns.PATTERN000:return(i+r)%2===0;case s.Patterns.PATTERN001:return i%2===0;case s.Patterns.PATTERN010:return r%3===0;case s.Patterns.PATTERN011:return(i+r)%3===0;case s.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(r/3))%2===0;case s.Patterns.PATTERN101:return i*r%2+i*r%3===0;case s.Patterns.PATTERN110:return(i*r%2+i*r%3)%2===0;case s.Patterns.PATTERN111:return(i*r%3+(i+r)%2)%2===0;default:throw new Error("bad maskPattern:"+n)}}s.applyMask=function(i,r){const a=r.size;for(let o=0;o<a;o++)for(let l=0;l<a;l++)r.isReserved(l,o)||r.xor(l,o,e(i,l,o))},s.getBestMask=function(i,r){const a=Object.keys(s.Patterns).length;let o=0,l=1/0;for(let c=0;c<a;c++){r(c),s.applyMask(c,i);const h=s.getPenaltyN1(i)+s.getPenaltyN2(i)+s.getPenaltyN3(i)+s.getPenaltyN4(i);s.applyMask(c,i),h<l&&(l=h,o=c)}return o}})(mo)),mo}var Br={},lu;function Od(){if(lu)return Br;lu=1;const s=rc(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],e=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return Br.getBlocksCount=function(i,r){switch(r){case s.L:return t[(i-1)*4+0];case s.M:return t[(i-1)*4+1];case s.Q:return t[(i-1)*4+2];case s.H:return t[(i-1)*4+3];default:return}},Br.getTotalCodewordsCount=function(i,r){switch(r){case s.L:return e[(i-1)*4+0];case s.M:return e[(i-1)*4+1];case s.Q:return e[(i-1)*4+2];case s.H:return e[(i-1)*4+3];default:return}},Br}var go={},Rs={},cu;function tM(){if(cu)return Rs;cu=1;const s=new Uint8Array(512),t=new Uint8Array(256);return(function(){let n=1;for(let i=0;i<255;i++)s[i]=n,t[n]=i,n<<=1,n&256&&(n^=285);for(let i=255;i<512;i++)s[i]=s[i-255]})(),Rs.log=function(n){if(n<1)throw new Error("log("+n+")");return t[n]},Rs.exp=function(n){return s[n]},Rs.mul=function(n,i){return n===0||i===0?0:s[t[n]+t[i]]},Rs}var hu;function eM(){return hu||(hu=1,(function(s){const t=tM();s.mul=function(n,i){const r=new Uint8Array(n.length+i.length-1);for(let a=0;a<n.length;a++)for(let o=0;o<i.length;o++)r[a+o]^=t.mul(n[a],i[o]);return r},s.mod=function(n,i){let r=new Uint8Array(n);for(;r.length-i.length>=0;){const a=r[0];for(let l=0;l<i.length;l++)r[l]^=t.mul(i[l],a);let o=0;for(;o<r.length&&r[o]===0;)o++;r=r.slice(o)}return r},s.generateECPolynomial=function(n){let i=new Uint8Array([1]);for(let r=0;r<n;r++)i=s.mul(i,new Uint8Array([1,t.exp(r)]));return i}})(go)),go}var _o,uu;function nM(){if(uu)return _o;uu=1;const s=eM();function t(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(n){this.degree=n,this.genPoly=s.generateECPolynomial(this.degree)},t.prototype.encode=function(n){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(n.length+this.degree);i.set(n);const r=s.mod(i,this.genPoly),a=this.degree-r.length;if(a>0){const o=new Uint8Array(this.degree);return o.set(r,a),o}return r},_o=t,_o}var vo={},xo={},Mo={},du;function Bd(){return du||(du=1,Mo.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Mo}var xn={},fu;function kd(){if(fu)return xn;fu=1;const s="[0-9]+",t="[A-Z $%*+\\-./:]+";let e="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";e=e.replace(/u/g,"\\u");const n="(?:(?![A-Z0-9 $%*+\\-./:]|"+e+`)(?:.|[\r
]))+`;xn.KANJI=new RegExp(e,"g"),xn.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),xn.BYTE=new RegExp(n,"g"),xn.NUMERIC=new RegExp(s,"g"),xn.ALPHANUMERIC=new RegExp(t,"g");const i=new RegExp("^"+e+"$"),r=new RegExp("^"+s+"$"),a=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return xn.testKanji=function(l){return i.test(l)},xn.testNumeric=function(l){return r.test(l)},xn.testAlphanumeric=function(l){return a.test(l)},xn}var pu;function Ri(){return pu||(pu=1,(function(s){const t=Bd(),e=kd();s.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},s.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},s.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},s.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},s.MIXED={bit:-1},s.getCharCountIndicator=function(r,a){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(a))throw new Error("Invalid version: "+a);return a>=1&&a<10?r.ccBits[0]:a<27?r.ccBits[1]:r.ccBits[2]},s.getBestModeForData=function(r){return e.testNumeric(r)?s.NUMERIC:e.testAlphanumeric(r)?s.ALPHANUMERIC:e.testKanji(r)?s.KANJI:s.BYTE},s.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},s.isValid=function(r){return r&&r.bit&&r.ccBits};function n(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"numeric":return s.NUMERIC;case"alphanumeric":return s.ALPHANUMERIC;case"kanji":return s.KANJI;case"byte":return s.BYTE;default:throw new Error("Unknown mode: "+i)}}s.from=function(r,a){if(s.isValid(r))return r;try{return n(r)}catch{return a}}})(xo)),xo}var mu;function iM(){return mu||(mu=1,(function(s){const t=Ai(),e=Od(),n=rc(),i=Ri(),r=Bd(),a=7973,o=t.getBCHDigit(a);function l(u,f,g){for(let v=1;v<=40;v++)if(f<=s.getCapacity(v,g,u))return v}function c(u,f){return i.getCharCountIndicator(u,f)+4}function h(u,f){let g=0;return u.forEach(function(v){const m=c(v.mode,f);g+=m+v.getBitsLength()}),g}function d(u,f){for(let g=1;g<=40;g++)if(h(u,g)<=s.getCapacity(g,f,i.MIXED))return g}s.from=function(f,g){return r.isValid(f)?parseInt(f,10):g},s.getCapacity=function(f,g,v){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof v>"u"&&(v=i.BYTE);const m=t.getSymbolTotalCodewords(f),p=e.getTotalCodewordsCount(f,g),x=(m-p)*8;if(v===i.MIXED)return x;const T=x-c(v,f);switch(v){case i.NUMERIC:return Math.floor(T/10*3);case i.ALPHANUMERIC:return Math.floor(T/11*2);case i.KANJI:return Math.floor(T/13);case i.BYTE:default:return Math.floor(T/8)}},s.getBestVersionForData=function(f,g){let v;const m=n.from(g,n.M);if(Array.isArray(f)){if(f.length>1)return d(f,m);if(f.length===0)return 1;v=f[0]}else v=f;return l(v.mode,v.getLength(),m)},s.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let g=f<<12;for(;t.getBCHDigit(g)-o>=0;)g^=a<<t.getBCHDigit(g)-o;return f<<12|g}})(vo)),vo}var yo={},gu;function sM(){if(gu)return yo;gu=1;const s=Ai(),t=1335,e=21522,n=s.getBCHDigit(t);return yo.getEncodedBits=function(r,a){const o=r.bit<<3|a;let l=o<<10;for(;s.getBCHDigit(l)-n>=0;)l^=t<<s.getBCHDigit(l)-n;return(o<<10|l)^e},yo}var So={},bo,_u;function rM(){if(_u)return bo;_u=1;const s=Ri();function t(e){this.mode=s.NUMERIC,this.data=e.toString()}return t.getBitsLength=function(n){return 10*Math.floor(n/3)+(n%3?n%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(n){let i,r,a;for(i=0;i+3<=this.data.length;i+=3)r=this.data.substr(i,3),a=parseInt(r,10),n.put(a,10);const o=this.data.length-i;o>0&&(r=this.data.substr(i),a=parseInt(r,10),n.put(a,o*3+1))},bo=t,bo}var wo,vu;function aM(){if(vu)return wo;vu=1;const s=Ri(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function e(n){this.mode=s.ALPHANUMERIC,this.data=n}return e.getBitsLength=function(i){return 11*Math.floor(i/2)+6*(i%2)},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(i){let r;for(r=0;r+2<=this.data.length;r+=2){let a=t.indexOf(this.data[r])*45;a+=t.indexOf(this.data[r+1]),i.put(a,11)}this.data.length%2&&i.put(t.indexOf(this.data[r]),6)},wo=e,wo}var Eo,xu;function oM(){if(xu)return Eo;xu=1;const s=Ri();function t(e){this.mode=s.BYTE,typeof e=="string"?this.data=new TextEncoder().encode(e):this.data=new Uint8Array(e)}return t.getBitsLength=function(n){return n*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(e){for(let n=0,i=this.data.length;n<i;n++)e.put(this.data[n],8)},Eo=t,Eo}var To,Mu;function lM(){if(Mu)return To;Mu=1;const s=Ri(),t=Ai();function e(n){this.mode=s.KANJI,this.data=n}return e.getBitsLength=function(i){return i*13},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(n){let i;for(i=0;i<this.data.length;i++){let r=t.toSJIS(this.data[i]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[i]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),n.put(r,13)}},To=e,To}var Ao={exports:{}},yu;function cM(){return yu||(yu=1,(function(s){var t={single_source_shortest_paths:function(e,n,i){var r={},a={};a[n]=0;var o=t.PriorityQueue.make();o.push(n,0);for(var l,c,h,d,u,f,g,v,m;!o.empty();){l=o.pop(),c=l.value,d=l.cost,u=e[c]||{};for(h in u)u.hasOwnProperty(h)&&(f=u[h],g=d+f,v=a[h],m=typeof a[h]>"u",(m||v>g)&&(a[h]=g,o.push(h,g),r[h]=c))}if(typeof i<"u"&&typeof a[i]>"u"){var p=["Could not find a path from ",n," to ",i,"."].join("");throw new Error(p)}return r},extract_shortest_path_from_predecessor_list:function(e,n){for(var i=[],r=n;r;)i.push(r),e[r],r=e[r];return i.reverse(),i},find_path:function(e,n,i){var r=t.single_source_shortest_paths(e,n,i);return t.extract_shortest_path_from_predecessor_list(r,i)},PriorityQueue:{make:function(e){var n=t.PriorityQueue,i={},r;e=e||{};for(r in n)n.hasOwnProperty(r)&&(i[r]=n[r]);return i.queue=[],i.sorter=e.sorter||n.default_sorter,i},default_sorter:function(e,n){return e.cost-n.cost},push:function(e,n){var i={value:e,cost:n};this.queue.push(i),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};s.exports=t})(Ao)),Ao.exports}var Su;function hM(){return Su||(Su=1,(function(s){const t=Ri(),e=rM(),n=aM(),i=oM(),r=lM(),a=kd(),o=Ai(),l=cM();function c(p){return unescape(encodeURIComponent(p)).length}function h(p,x,T){const b=[];let C;for(;(C=p.exec(T))!==null;)b.push({data:C[0],index:C.index,mode:x,length:C[0].length});return b}function d(p){const x=h(a.NUMERIC,t.NUMERIC,p),T=h(a.ALPHANUMERIC,t.ALPHANUMERIC,p);let b,C;return o.isKanjiModeEnabled()?(b=h(a.BYTE,t.BYTE,p),C=h(a.KANJI,t.KANJI,p)):(b=h(a.BYTE_KANJI,t.BYTE,p),C=[]),x.concat(T,b,C).sort(function(_,S){return _.index-S.index}).map(function(_){return{data:_.data,mode:_.mode,length:_.length}})}function u(p,x){switch(x){case t.NUMERIC:return e.getBitsLength(p);case t.ALPHANUMERIC:return n.getBitsLength(p);case t.KANJI:return r.getBitsLength(p);case t.BYTE:return i.getBitsLength(p)}}function f(p){return p.reduce(function(x,T){const b=x.length-1>=0?x[x.length-1]:null;return b&&b.mode===T.mode?(x[x.length-1].data+=T.data,x):(x.push(T),x)},[])}function g(p){const x=[];for(let T=0;T<p.length;T++){const b=p[T];switch(b.mode){case t.NUMERIC:x.push([b,{data:b.data,mode:t.ALPHANUMERIC,length:b.length},{data:b.data,mode:t.BYTE,length:b.length}]);break;case t.ALPHANUMERIC:x.push([b,{data:b.data,mode:t.BYTE,length:b.length}]);break;case t.KANJI:x.push([b,{data:b.data,mode:t.BYTE,length:c(b.data)}]);break;case t.BYTE:x.push([{data:b.data,mode:t.BYTE,length:c(b.data)}])}}return x}function v(p,x){const T={},b={start:{}};let C=["start"];for(let w=0;w<p.length;w++){const _=p[w],S=[];for(let I=0;I<_.length;I++){const P=_[I],D=""+w+I;S.push(D),T[D]={node:P,lastCount:0},b[D]={};for(let U=0;U<C.length;U++){const O=C[U];T[O]&&T[O].node.mode===P.mode?(b[O][D]=u(T[O].lastCount+P.length,P.mode)-u(T[O].lastCount,P.mode),T[O].lastCount+=P.length):(T[O]&&(T[O].lastCount=P.length),b[O][D]=u(P.length,P.mode)+4+t.getCharCountIndicator(P.mode,x))}}C=S}for(let w=0;w<C.length;w++)b[C[w]].end=0;return{map:b,table:T}}function m(p,x){let T;const b=t.getBestModeForData(p);if(T=t.from(x,b),T!==t.BYTE&&T.bit<b.bit)throw new Error('"'+p+'" cannot be encoded with mode '+t.toString(T)+`.
 Suggested mode is: `+t.toString(b));switch(T===t.KANJI&&!o.isKanjiModeEnabled()&&(T=t.BYTE),T){case t.NUMERIC:return new e(p);case t.ALPHANUMERIC:return new n(p);case t.KANJI:return new r(p);case t.BYTE:return new i(p)}}s.fromArray=function(x){return x.reduce(function(T,b){return typeof b=="string"?T.push(m(b,null)):b.data&&T.push(m(b.data,b.mode)),T},[])},s.fromString=function(x,T){const b=d(x,o.isKanjiModeEnabled()),C=g(b),w=v(C,T),_=l.find_path(w.map,"start","end"),S=[];for(let I=1;I<_.length-1;I++)S.push(w.table[_[I]].node);return s.fromArray(f(S))},s.rawSplit=function(x){return s.fromArray(d(x,o.isKanjiModeEnabled()))}})(So)),So}var bu;function uM(){if(bu)return lo;bu=1;const s=Ai(),t=rc(),e=Kx(),n=Zx(),i=Jx(),r=Qx(),a=jx(),o=Od(),l=nM(),c=iM(),h=sM(),d=Ri(),u=hM();function f(w,_){const S=w.size,I=r.getPositions(_);for(let P=0;P<I.length;P++){const D=I[P][0],U=I[P][1];for(let O=-1;O<=7;O++)if(!(D+O<=-1||S<=D+O))for(let L=-1;L<=7;L++)U+L<=-1||S<=U+L||(O>=0&&O<=6&&(L===0||L===6)||L>=0&&L<=6&&(O===0||O===6)||O>=2&&O<=4&&L>=2&&L<=4?w.set(D+O,U+L,!0,!0):w.set(D+O,U+L,!1,!0))}}function g(w){const _=w.size;for(let S=8;S<_-8;S++){const I=S%2===0;w.set(S,6,I,!0),w.set(6,S,I,!0)}}function v(w,_){const S=i.getPositions(_);for(let I=0;I<S.length;I++){const P=S[I][0],D=S[I][1];for(let U=-2;U<=2;U++)for(let O=-2;O<=2;O++)U===-2||U===2||O===-2||O===2||U===0&&O===0?w.set(P+U,D+O,!0,!0):w.set(P+U,D+O,!1,!0)}}function m(w,_){const S=w.size,I=c.getEncodedBits(_);let P,D,U;for(let O=0;O<18;O++)P=Math.floor(O/3),D=O%3+S-8-3,U=(I>>O&1)===1,w.set(P,D,U,!0),w.set(D,P,U,!0)}function p(w,_,S){const I=w.size,P=h.getEncodedBits(_,S);let D,U;for(D=0;D<15;D++)U=(P>>D&1)===1,D<6?w.set(D,8,U,!0):D<8?w.set(D+1,8,U,!0):w.set(I-15+D,8,U,!0),D<8?w.set(8,I-D-1,U,!0):D<9?w.set(8,15-D-1+1,U,!0):w.set(8,15-D-1,U,!0);w.set(I-8,8,1,!0)}function x(w,_){const S=w.size;let I=-1,P=S-1,D=7,U=0;for(let O=S-1;O>0;O-=2)for(O===6&&O--;;){for(let L=0;L<2;L++)if(!w.isReserved(P,O-L)){let H=!1;U<_.length&&(H=(_[U]>>>D&1)===1),w.set(P,O-L,H),D--,D===-1&&(U++,D=7)}if(P+=I,P<0||S<=P){P-=I,I=-I;break}}}function T(w,_,S){const I=new e;S.forEach(function(L){I.put(L.mode.bit,4),I.put(L.getLength(),d.getCharCountIndicator(L.mode,w)),L.write(I)});const P=s.getSymbolTotalCodewords(w),D=o.getTotalCodewordsCount(w,_),U=(P-D)*8;for(I.getLengthInBits()+4<=U&&I.put(0,4);I.getLengthInBits()%8!==0;)I.putBit(0);const O=(U-I.getLengthInBits())/8;for(let L=0;L<O;L++)I.put(L%2?17:236,8);return b(I,w,_)}function b(w,_,S){const I=s.getSymbolTotalCodewords(_),P=o.getTotalCodewordsCount(_,S),D=I-P,U=o.getBlocksCount(_,S),O=I%U,L=U-O,H=Math.floor(I/U),q=Math.floor(D/U),W=q+1,et=H-q,X=new l(et);let j=0;const tt=new Array(U),yt=new Array(U);let Ft=0;const K=new Uint8Array(w.buffer);for(let Nt=0;Nt<U;Nt++){const he=Nt<L?q:W;tt[Nt]=K.slice(j,j+he),yt[Nt]=X.encode(tt[Nt]),j+=he,Ft=Math.max(Ft,he)}const pt=new Uint8Array(I);let xt=0,Et,lt;for(Et=0;Et<Ft;Et++)for(lt=0;lt<U;lt++)Et<tt[lt].length&&(pt[xt++]=tt[lt][Et]);for(Et=0;Et<et;Et++)for(lt=0;lt<U;lt++)pt[xt++]=yt[lt][Et];return pt}function C(w,_,S,I){let P;if(Array.isArray(w))P=u.fromArray(w);else if(typeof w=="string"){let H=_;if(!H){const q=u.rawSplit(w);H=c.getBestVersionForData(q,S)}P=u.fromString(w,H||40)}else throw new Error("Invalid data");const D=c.getBestVersionForData(P,S);if(!D)throw new Error("The amount of data is too big to be stored in a QR Code");if(!_)_=D;else if(_<D)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+D+`.
`);const U=T(_,S,P),O=s.getSymbolSize(_),L=new n(O);return f(L,_),g(L),v(L,_),p(L,S,0),_>=7&&m(L,_),x(L,U),isNaN(I)&&(I=a.getBestMask(L,p.bind(null,L,S))),a.applyMask(I,L),p(L,S,I),{modules:L,version:_,errorCorrectionLevel:S,maskPattern:I,segments:P}}return lo.create=function(_,S){if(typeof _>"u"||_==="")throw new Error("No input text");let I=t.M,P,D;return typeof S<"u"&&(I=t.from(S.errorCorrectionLevel,t.M),P=c.from(S.version),D=a.from(S.maskPattern),S.toSJISFunc&&s.setToSJISFunction(S.toSJISFunc)),C(_,P,I,D)},lo}var Ro={},Co={},wu;function zd(){return wu||(wu=1,(function(s){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let n=e.slice().replace("#","").split("");if(n.length<3||n.length===5||n.length>8)throw new Error("Invalid hex color: "+e);(n.length===3||n.length===4)&&(n=Array.prototype.concat.apply([],n.map(function(r){return[r,r]}))),n.length===6&&n.push("F","F");const i=parseInt(n.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:i&255,hex:"#"+n.slice(0,6).join("")}}s.getOptions=function(n){n||(n={}),n.color||(n.color={});const i=typeof n.margin>"u"||n.margin===null||n.margin<0?4:n.margin,r=n.width&&n.width>=21?n.width:void 0,a=n.scale||4;return{width:r,scale:r?4:a,margin:i,color:{dark:t(n.color.dark||"#000000ff"),light:t(n.color.light||"#ffffffff")},type:n.type,rendererOpts:n.rendererOpts||{}}},s.getScale=function(n,i){return i.width&&i.width>=n+i.margin*2?i.width/(n+i.margin*2):i.scale},s.getImageWidth=function(n,i){const r=s.getScale(n,i);return Math.floor((n+i.margin*2)*r)},s.qrToImageData=function(n,i,r){const a=i.modules.size,o=i.modules.data,l=s.getScale(a,r),c=Math.floor((a+r.margin*2)*l),h=r.margin*l,d=[r.color.light,r.color.dark];for(let u=0;u<c;u++)for(let f=0;f<c;f++){let g=(u*c+f)*4,v=r.color.light;if(u>=h&&f>=h&&u<c-h&&f<c-h){const m=Math.floor((u-h)/l),p=Math.floor((f-h)/l);v=d[o[m*a+p]?1:0]}n[g++]=v.r,n[g++]=v.g,n[g++]=v.b,n[g]=v.a}}})(Co)),Co}var Eu;function dM(){return Eu||(Eu=1,(function(s){const t=zd();function e(i,r,a){i.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=a,r.width=a,r.style.height=a+"px",r.style.width=a+"px"}function n(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}s.render=function(r,a,o){let l=o,c=a;typeof l>"u"&&(!a||!a.getContext)&&(l=a,a=void 0),a||(c=n()),l=t.getOptions(l);const h=t.getImageWidth(r.modules.size,l),d=c.getContext("2d"),u=d.createImageData(h,h);return t.qrToImageData(u.data,r,l),e(d,c,h),d.putImageData(u,0,0),c},s.renderToDataURL=function(r,a,o){let l=o;typeof l>"u"&&(!a||!a.getContext)&&(l=a,a=void 0),l||(l={});const c=s.render(r,a,l),h=l.type||"image/png",d=l.rendererOpts||{};return c.toDataURL(h,d.quality)}})(Ro)),Ro}var Po={},Tu;function fM(){if(Tu)return Po;Tu=1;const s=zd();function t(i,r){const a=i.a/255,o=r+'="'+i.hex+'"';return a<1?o+" "+r+'-opacity="'+a.toFixed(2).slice(1)+'"':o}function e(i,r,a){let o=i+r;return typeof a<"u"&&(o+=" "+a),o}function n(i,r,a){let o="",l=0,c=!1,h=0;for(let d=0;d<i.length;d++){const u=Math.floor(d%r),f=Math.floor(d/r);!u&&!c&&(c=!0),i[d]?(h++,d>0&&u>0&&i[d-1]||(o+=c?e("M",u+a,.5+f+a):e("m",l,0),l=0,c=!1),u+1<r&&i[d+1]||(o+=e("h",h),h=0)):l++}return o}return Po.render=function(r,a,o){const l=s.getOptions(a),c=r.modules.size,h=r.modules.data,d=c+l.margin*2,u=l.color.light.a?"<path "+t(l.color.light,"fill")+' d="M0 0h'+d+"v"+d+'H0z"/>':"",f="<path "+t(l.color.dark,"stroke")+' d="'+n(h,c,l.margin)+'"/>',g='viewBox="0 0 '+d+" "+d+'"',m='<svg xmlns="http://www.w3.org/2000/svg" '+(l.width?'width="'+l.width+'" height="'+l.width+'" ':"")+g+' shape-rendering="crispEdges">'+u+f+`</svg>
`;return typeof o=="function"&&o(null,m),m},Po}var Au;function pM(){if(Au)return $i;Au=1;const s=$x(),t=uM(),e=dM(),n=fM();function i(r,a,o,l,c){const h=[].slice.call(arguments,1),d=h.length,u=typeof h[d-1]=="function";if(!u&&!s())throw new Error("Callback required as last argument");if(u){if(d<2)throw new Error("Too few arguments provided");d===2?(c=o,o=a,a=l=void 0):d===3&&(a.getContext&&typeof c>"u"?(c=l,l=void 0):(c=l,l=o,o=a,a=void 0))}else{if(d<1)throw new Error("Too few arguments provided");return d===1?(o=a,a=l=void 0):d===2&&!a.getContext&&(l=o,o=a,a=void 0),new Promise(function(f,g){try{const v=t.create(o,l);f(r(v,a,l))}catch(v){g(v)}})}try{const f=t.create(o,l);c(null,r(f,a,l))}catch(f){c(f)}}return $i.create=t.create,$i.toCanvas=i.bind(null,e.render),$i.toDataURL=i.bind(null,e.renderToDataURL),$i.toString=i.bind(null,function(r,a,o){return n.render(r,o)}),$i}var mM=pM();const gM=hf(mM),_M={rel:"✓ gyroskop",ori:"✓ senzor natočení",touch:"⚠ míří prstem",none:"⚠ bez senzoru"};class vM{constructor(t,e){E(this,"el");E(this,"qr");this.el=document.createElement("div"),this.el.className="lobby";const n=uf();this.el.innerHTML=`
      <div class="lb-card">
        <header class="lb-head">
          ${n?`<img class="lb-logo" src="${n}" alt="Mečovačka">`:'<h1 class="logo-text">Mečo<span>vačka</span></h1>'}
          <p>Souboje s pěnovými meči na molu. <b>Mečem je tvůj telefon</b> — co uděláš rukou, udělá meč.</p>
        </header>
        <section class="lb-join">
          <div class="qr-card"><canvas class="qr" width="220" height="220"></canvas><div class="code">kód <b>····</b></div></div>
          <div class="lb-steps">
            <ol>
              <li><b>Naskenuj QR kód</b> telefonem<br><small class="url"></small></li>
              <li><b>Vyber si šermíře.</b> Druhý hráč se připojí stejně, jinak bojuješ s počítačem.</li>
              <li>Drž telefon <b>jako rukojeť meče</b>, palec na displeji. Hráč 1 dá <b>START</b>.</li>
            </ol>
            <p class="net"><span class="dot"></span><span class="net-text">Připojuji se k serveru…</span></p>
            <p class="lan-warn" hidden></p>
          </div>
        </section>
        <section class="lb-players"></section>
        <section class="lb-modes">${Mi.map((i,r)=>{const a=df(i.id);return`<button class="mode" data-a="mode" data-i="${r}"><span class="m-emoji">${a?`<img src="${a}" alt="">`:i.emoji}</span><b>${i.name}</b><small>${fn(i.desc)}</small></button>`}).join("")}</section>
        <section class="lb-setup">
          <div class="opt opt-diff"><small>Počítač</small><div class="stepper"><button data-a="diff-">−</button><b class="diffn"></b><button data-a="diff+">+</button></div></div>
          <div class="opt opt-rounds"><small>Zápas</small><div class="stepper"><button data-a="rounds-">−</button><b class="roundsn"></b><button data-a="rounds+">+</button></div></div>
          <div class="opt opt-best"><small>Rekord</small><b class="bestn">—</b></div>
          <button class="start-btn" data-a="start">START ⚔️</button>
        </section>
        <footer class="lb-foot">
          <span>Bez telefonu: <kbd>M</kbd> přidá hráče s myší (pohyb myši = meč, levé tlačítko / <kbd>mezerník</kbd> = KRYT). <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> hra, <kbd>Enter</kbd> start, <kbd>Esc</kbd> pauza.</span>
          <span class="foot-btns"><a class="hub-link" href="/">🎮 Jiná hra</a><button data-a="mouse">🖱️ Hráč s myší</button><button data-a="sound" class="snd">🔊 Zvuk</button><button data-a="fs">⛶ Celá obrazovka</button></span>
        </footer>
      </div>`,t.append(this.el),this.qr=this.el.querySelector(".qr"),this.el.addEventListener("click",i=>{const r=i.target.closest("[data-a]");if(!r)return;const a=r.dataset.a;a==="start"?e.start():a==="mode"?e.mode(Number(r.dataset.i)):a==="diff-"?e.diff(-1):a==="diff+"?e.diff(1):a==="rounds-"?e.rounds(-1):a==="rounds+"?e.rounds(1):a==="mouse"?e.addMouse():a==="sound"?e.toggleSound():a==="fs"?e.fullscreen():a==="kick"&&e.removePlayer(Number(r.dataset.slot))})}setRoom(t,e,n){this.el.querySelector(".code b").textContent=t,this.el.querySelector(".url").innerHTML=`nebo otevři <b>${fn(n)}</b> a zadej kód <b>${t}</b>`,gM.toCanvas(this.qr,e,{width:220,margin:1,color:{dark:"#14123a",light:"#ffffff"}}),this.qr.dataset.url=e}setStatus(t,e){const n=this.el.querySelector(".net");n.dataset.kind=t,n.querySelector(".net-text").textContent=e}setLanWarning(t){const e=this.el.querySelector(".lan-warn");e.hidden=!t,e.textContent=t??""}render(t){const e=[];for(let a=0;a<ku;a++){const o=t.players.find(c=>c.slot===a);if(!o){e.push(a===1?`<div class="pl empty cpu"><span class="pl-n">2</span>${ma(-1)}<div class="pl-info"><b>Počítač</b><small>nebo se připoj druhým telefonem</small></div></div>`:`<div class="pl empty"><span class="pl-n">${a+1}</span>čeká na hráče…</div>`);continue}const l=Wn[o.char];e.push(`<div class="pl ${o.online?"":"off"}" style="--c:#${l.main.toString(16).padStart(6,"0")}">
        <span class="pl-n">${o.host?"👑":a+1}</span>${ma(o.char)}
        <div class="pl-info"><b>${fn(o.name)}</b><small>${fn(l.name)} · ${l.cls}${o.kind==="mouse"?" · 🖱️ myš":` · ${_M[o.sensor]??""}`}${o.online?"":" · offline"}</small></div>
        <button class="kick" data-a="kick" data-slot="${o.slot}" title="Odebrat">✕</button></div>`)}this.el.querySelector(".lb-players").innerHTML=e.join(""),this.el.querySelectorAll(".mode").forEach(a=>a.classList.toggle("on",Number(a.dataset.i)===t.mode));const n=Mi[t.mode],i=t.players.length<2;this.el.querySelector(".opt-diff").hidden=!i||n.id==="train"||n.id==="slice",this.el.querySelector(".opt-rounds").hidden=n.id!=="duel",this.el.querySelector(".opt-best").hidden=n.id!=="slice",this.el.querySelector(".diffn").textContent=Yr[t.diff],this.el.querySelector(".roundsn").textContent=ff[t.rounds],this.el.querySelector(".bestn").textContent=t.best;const r=this.el.querySelector(".start-btn");r.disabled=!t.canStart,this.el.querySelector(".snd").textContent=t.muted?"🔇 Zvuk":"🔊 Zvuk"}show(t){this.el.classList.toggle("hidden",!t)}}class xM{constructor(t,e,n){E(this,"el");this.el=document.createElement("div"),this.el.className="results hidden",t.append(this.el),this.el.addEventListener("click",i=>{const r=i.target.closest("[data-a]")?.dataset.a;r==="again"?e():r==="menu"&&n()})}show(t,e){this.el.innerHTML=`<div class="rs-card"><h2>${fn(t)}</h2>
      <div class="rs-rows">${e.map(n=>`<div class="rs-row ${n.win?"win":""}">${ma(n.char)}<div class="rs-info"><b>${fn(n.name)}${n.win?" 🏆":""}</b><small>${fn(n.sub)}</small></div><span class="rs-main">${fn(n.main)}</span></div>`).join("")}</div>
      <div class="rs-btns"><button data-a="again">↻ Odveta <kbd>Enter</kbd></button><button data-a="menu">Menu <kbd>Esc</kbd></button></div></div>`,this.el.classList.remove("hidden")}hide(){this.el.classList.add("hidden")}get visible(){return!this.el.classList.contains("hidden")}}class MM{constructor(t,e){E(this,"el");this.el=document.createElement("div"),this.el.className="pause hidden",this.el.innerHTML=`<div class="ps-card"><h2>Pauza</h2>
      <button data-a="resume">▶ Pokračovat</button><button data-a="restart">↻ Začít znovu</button><button data-a="menu">⏏ Do menu</button>
      <p><kbd>Esc</kbd> pokračovat · <kbd>R</kbd> znovu · <kbd>Q</kbd> do menu</p></div>`,this.el.addEventListener("click",n=>{const i=n.target.closest("[data-a]")?.dataset.a;i==="resume"?e.resume():i==="restart"?e.restart():i==="menu"&&e.menu()}),t.append(this.el)}show(t){this.el.classList.toggle("hidden",!t)}}const Vd=new A(0,1,0),yM=new Kt().setFromAxisAngle(new A(1,0,0),-Math.PI/2),ss=new Kt().setFromAxisAngle(new A(1,0,0),-Math.PI/2),ac=new Kt,Hd=new Kt,Cl=new A;function oc(s,t,e,n){const i=Hd.copy(t).multiply(ac.copy(s).invert());i.w<0&&i.set(-i.x,-i.y,-i.z,-i.w);const r=Math.sqrt(Math.max(0,1-i.w*i.w)),a=2*Math.acos(fe(i.w,-1,1));return r<1e-6||e<=0?n.set(0,0,0):n.set(i.x/r,i.y/r,i.z/r).multiplyScalar(a/e)}function SM(s,t,e,n){const i=t.length()*e;return i<1e-6?n.copy(s):(Cl.copy(t).normalize(),n.setFromAxisAngle(Cl,i).multiply(s))}class Gd{constructor(){E(this,"q",new Kt().copy(ss));E(this,"omega",new A);E(this,"guard",!1);E(this,"calibrated",!1);E(this,"kind","none");E(this,"raw",new Kt);E(this,"rawPrev",new Kt);E(this,"tsLast",-1);E(this,"arrived",-1/0);E(this,"yaw",new Kt);E(this,"wWorld",new A);E(this,"have",!1);E(this,"lead",.012)}get live(){return performance.now()-this.arrived<1500}sample(t,e,n,i){if(this.guard=e,this.kind=i,!Array.isArray(t)||t.length<4||t.some(o=>typeof o!="number"||!isFinite(o))||n<=this.tsLast&&this.tsLast-n<5e3)return;const r=ac.set(t[0],t[1],t[2],t[3]);if(r.lengthSq()<.5)return;r.normalize();const a=new Kt().multiplyQuaternions(yM,r);if(this.have){const o=(n-this.tsLast)/1e3;if(o>.004&&o<.12){const l=oc(this.raw,a,o,new A);l.length()<60&&this.wWorld.lerp(l,.6)}else o>=.12&&this.wWorld.set(0,0,0)}this.rawPrev.copy(this.raw),this.raw.copy(a),this.tsLast=n,this.arrived=performance.now(),this.have=!0}calibrate(){if(!this.have)return;const t=Cl.set(0,1,0).applyQuaternion(this.raw);let e=t.x,n=t.z;if(Math.hypot(e,n)<.35){const r=new A(0,0,-1).applyQuaternion(this.raw);e=r.x,n=r.z}if(Math.hypot(e,n)<.001)return;const i=Math.PI-Math.atan2(e,n);this.yaw.setFromAxisAngle(Vd,i),this.calibrated=!0}update(t,e){if(!this.have)return;const n=Math.max(0,(e-this.arrived)/1e3);n>1.5&&(this.guard=!1);const i=fe(n+this.lead,0,.045),r=SM(this.raw,this.wWorld,n>.2?0:i,Hd),a=new Kt().multiplyQuaternions(this.yaw,r);this.q.slerp(a,Vn(55,t)),this.omega.copy(this.wWorld).applyQuaternion(this.yaw),n>.2&&this.wWorld.multiplyScalar(1-Vn(8,t))}}class ba{constructor(){E(this,"q",new Kt().copy(ss));E(this,"omega",new A);E(this,"guard",!1);E(this,"calibrated",!0);E(this,"live",!0);E(this,"nx",0);E(this,"ny",.15);E(this,"prev",new Kt().copy(ss))}setPointer(t,e){this.nx=fe(t,-1,1),this.ny=fe(e,-1,1)}update(t){const e=-this.nx*1.45,n=this.ny*1.5,i=new Kt().setFromAxisAngle(Vd,e).multiply(ac.setFromAxisAngle(new A(1,0,0),n)).multiply(ss);this.prev.copy(this.q),this.q.slerp(i,Vn(30,t)),t>0&&oc(this.prev,this.q,t,this.omega)}calibrate(){}}class Wd{constructor(){E(this,"q",new Kt().copy(ss));E(this,"omega",new A);E(this,"target",new Kt().copy(ss));E(this,"guard",!1);E(this,"calibrated",!0);E(this,"live",!0);E(this,"rate",6);E(this,"prev",new Kt)}update(t){this.prev.copy(this.q),this.q.rotateTowards(this.target,this.rate*t),t>0&&oc(this.prev,this.q,t,this.omega)}calibrate(){}}function bM(s,t=new A(0,0,1),e=new Kt){const n=s.clone().normalize();let i=new A().crossVectors(n,t);i.lengthSq()<1e-4&&(i=new A().crossVectors(n,new A(1,0,0))),i.normalize();const r=new A().crossVectors(i,n).normalize(),a=new Wt().makeBasis(i,n,r);return e.setFromRotationMatrix(a)}const wM=4e3;class EM{constructor(){E(this,"players",[]);E(this,"seq",0)}bySlot(t){return this.players.find(e=>e.slot===t)??null}byCid(t){return this.players.find(e=>e.cid===t)??null}byConn(t){return this.players.find(e=>e.conn===t||e.motion===t)??null}online(t,e=performance.now()){return t.kind==="mouse"?!0:!!t.conn&&t.conn.open&&e-t.lastSeen<wM}get full(){return this.players.length>=ku}freeChar(t=-1,e=-1){const n=new Set(this.players.filter(i=>i.slot!==e).map(i=>i.char));return t>=0&&t<Wn.length&&!n.has(t)?t:Wn.find(i=>!n.has(i.id))?.id??0}add(t,e,n,i,r,a){if(this.full)return null;let o=0;for(;this.bySlot(o);)o++;const l={slot:o,cid:e,name:Pl(n)||`Hráč ${o+1}`,char:this.freeChar(i),hand:r==="L"?"L":"R",kind:t,conn:a,motion:null,lastSeen:performance.now(),joinedAt:++this.seq,ping:0,sword:t==="mouse"?new ba:new Gd,sensor:t==="mouse"?"touch":"none",hudKey:"",hudAt:0};return this.players.push(l),this.players.sort((c,h)=>c.slot-h.slot),l}remove(t){this.players=this.players.filter(e=>e.slot!==t)}hostSlot(t=performance.now()){const e=this.players.filter(n=>n.kind==="pad"&&this.online(n,t));return e.sort((n,i)=>n.joinedAt-i.joinedAt),e.length?e[0].slot:-1}lobbyPlayers(t=performance.now()){const e=this.hostSlot(t);return this.players.map(n=>({slot:n.slot,name:n.name,char:n.char,host:n.slot===e,online:this.online(n,t),kind:n.kind,sensor:n.sensor}))}}function Pl(s){return typeof s!="string"?"":s.replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,14)}class TM{constructor(t,e){E(this,"fans",[]);E(this,"scene");E(this,"arena");E(this,"look",new A(0,1.2,0));this.scene=t,this.arena=e}setup(t){const e=Wn.filter(r=>!t.includes(r.id)).map(r=>r.id),n=this.fans.filter(r=>e.includes(r.char));for(const r of this.fans)n.includes(r)||r.group.removeFromParent();this.fans=n;for(const r of e){if(this.fans.some(l=>l.char===r))continue;const a=new ge,o=new Fd(Wn[r]);a.add(o.root),this.scene.add(a),this.fans.push({p:o,group:a,char:r,cheer:0,t:Rt(0,10),jump:0})}const i=this.arena.spectatorSpots;this.fans.forEach((r,a)=>{const o=i[a%i.length];r.group.position.copy(o.pos),r.group.position.x+=Math.floor(a/i.length)*.9,r.group.rotation.y=o.yaw,r.group.scale.setScalar(.92)})}cheer(t){for(const e of this.fans)e.cheer=Math.min(1,Math.max(e.cheer,t*Rt(.6,1.1))),t>.6&&Math.random()<.7&&(e.jump=1)}setLook(t){this.look.copy(t)}update(t){for(const e of this.fans){e.t+=t,e.cheer=Math.max(0,e.cheer-t*.45),e.jump=Math.max(0,e.jump-t*1.6);const n=Math.abs(Math.sin(e.t*9))*.22*e.jump;e.p.root.position.y=n,e.group.updateMatrixWorld(!0),e.p.pose({t:e.t,crouch:.1,lean:0,twist:0,hit:0,teeter:0,flail:0,cheer:e.cheer,walk:0,walkAmt:0,look:this.look,hand:"R",gripPos:null,gripQuat:null,pole:null})}}dispose(){for(const t of this.fans)t.group.removeFromParent();this.fans=[]}}class Ru{constructor(){E(this,"cam",new Je(50,1,.08,900));E(this,"pos",new A(0,3,8));E(this,"look",new A(0,1,0));E(this,"wantPos",new A);E(this,"wantLook",new A);E(this,"fov",50);E(this,"snap",!0)}set(t,e,n=6,i=0){if(this.wantPos.copy(t),this.wantLook.copy(e),this.snap||i===0)this.pos.copy(t),this.look.copy(e),this.snap=!1;else{const r=Vn(n,i);this.pos.lerp(this.wantPos,r),this.look.lerp(this.wantLook,r)}}apply(t,e,n){this.cam.aspect=t,this.cam.fov=t<1.2?Os(this.fov+12,this.fov,(t-.7)/.5):this.fov,this.cam.position.copy(this.pos),e>0&&this.cam.position.add(new A(Math.sin(n*73)*e,Math.sin(n*91)*e,Math.cos(n*67)*e)),this.cam.lookAt(this.look),this.cam.updateProjectionMatrix()}}const yi=new A,Ll=new A,AM=2.85;function Il(s,t,e,n,i=5){Xd(s,t,e.state==="stand"?e.z:e.group.position.z,n,i)}function Xd(s,t,e,n,i=5){const r=t.hand==="R"?1:-1,a=t.state==="stand"?t.z:t.group.position.z,o=(a+e)/2,l=t.forward(Ll),c=new A(-l.z,0,l.x);yi.set(t.x,0,a).addScaledVector(l,-2.9).addScaledVector(c,-.8*r),yi.y=AM;const h=new A(t.x,1,o).addScaledVector(l,.55).addScaledVector(c,.05*r);s.set(yi,h,i,n)}function Lo(s,t,e,n,i=new A(0,.9,0)){yi.set(i.x+Math.sin(t)*e,n,i.z+Math.cos(t)*e),s.set(yi,i)}function RM(s,t,e){const n=t.group.position;yi.set(n.x+6.2,1.6,n.z*.75),Ll.set(n.x,Math.max(-1,n.y+.6),n.z*.92),s.set(yi,Ll,3.2,e)}class CM{constructor(t){E(this,"renderer");E(this,"scene",new Cp);E(this,"w",1);E(this,"h",1);E(this,"shake",0);E(this,"t",0);this.renderer=new Ex({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(2,devicePixelRatio)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Bs,this.renderer.outputColorSpace=ze,this.renderer.toneMapping=Ol,this.renderer.toneMappingExposure=1.05,this.renderer.setScissorTest(!0),addEventListener("resize",()=>this.resize()),this.resize()}resize(){this.w=innerWidth,this.h=innerHeight,this.renderer.setSize(this.w,this.h,!1)}layout(t,e){if(t.length===1)return[{cam:t[0].cam,x:0,y:0,w:this.w,h:this.h,owner:e[0]??null}];const n=Math.floor(this.w/2);return[{cam:t[0].cam,x:0,y:0,w:n-2,h:this.h,owner:e[0]??null},{cam:t[1].cam,x:n+2,y:0,w:this.w-n-2,h:this.h,owner:e[1]??null}]}render(t,e,n,i,r){this.t+=i,this.shake=Math.max(0,this.shake-i*.25);const a=this.renderer;a.setScissor(0,0,this.w,this.h),a.setViewport(0,0,this.w,this.h),a.setClearColor(854822),a.clear(),t.forEach((o,l)=>{e[l].apply(o.w/Math.max(1,o.h),this.shake,this.t);for(const h of n)h.puppet.setOpacity(h===o.owner&&h.state==="stand"?.5:1);r?.(o);const c=this.h-o.y-o.h;a.setViewport(o.x,c,o.w,o.h),a.setScissor(o.x,c,o.w,o.h),a.render(this.scene,o.cam)})}project(t,e){const n=t.clone().project(e.cam);return{x:e.x+(n.x+1)/2*e.w,y:e.y+(1-n.y)/2*e.h,behind:n.z>1}}}const Cu=[{react:.45,block:.32,gap:[1.6,2.8],windup:.6,swing:6.2,guardRate:7,aim:.3,counter:.2,feint:0,attacks:!0},{react:.3,block:.58,gap:[1,2],windup:.45,swing:7.6,guardRate:10,aim:.18,counter:.5,feint:.1,attacks:!0},{react:.19,block:.8,gap:[.65,1.4],windup:.32,swing:9,guardRate:14,aim:.1,counter:.8,feint:.22,attacks:!0}],PM={react:9,block:0,gap:[99,99],windup:1,swing:5.2,guardRate:6,aim:.05,counter:0,feint:0,attacks:!1},Pu=[-90,-135,-45,180,0,-160,-20].map(s=>{const t=s*Math.PI/180;return new It(Math.cos(t),Math.sin(t))}),Io=new A,LM=new Kt;class qd{constructor(t,e){E(this,"ctl");E(this,"p");E(this,"state","idle");E(this,"t",0);E(this,"next",Rt(1.2,2));E(this,"u",new It(0,-1));E(this,"start",new A);E(this,"mid",new A);E(this,"end",new A);E(this,"stage",0);E(this,"threatT",-1);E(this,"threatBlock",!1);E(this,"blockDir",new A);E(this,"blockT",0);E(this,"wasFast",!1);E(this,"sway",Rt(0,10));E(this,"glint",0);E(this,"requested",null);E(this,"busy",!1);this.ctl=t,this.p=e}set(t,e,n){bM(t,n??new A(0,0,1),this.ctl.target),this.ctl.rate=e}onBlocked(){Math.random()<this.p.counter&&(this.next=Math.min(this.next,Rt(.05,.18)))}attack(t){this.requested=t.clone()}update(t,e,n,i){this.t+=t,this.sway+=t,this.glint=Math.max(0,this.glint-t*3);const r=this.ctl;if(!i||e.state!=="stand"){r.guard=!1,this.state="idle",this.idlePose(.5);return}if(e.stun>0||e.stagger>0){this.state="stunned",r.guard=!1,r.rate=3;return}this.state==="stunned"&&(this.state="recover",this.t=0);const a=n.canAct&&!n.spent&&n.speedSm>4.2;switch(a&&!this.wasFast&&(this.threatT=0,this.threatBlock=Math.random()<this.p.block),this.wasFast=a,this.threatT>=0&&(this.threatT+=t,this.threatT>=this.p.react&&this.threatBlock&&this.state!=="swing"?(this.startBlock(e,n),this.threatT=-1):this.threatT>this.p.react+.3&&(this.threatT=-1)),this.state){case"idle":r.guard=!1,this.idlePose(this.p.guardRate*.6),this.next-=t*(n.teeter>.3?1.8:1),this.requested?(this.beginAttack(this.requested,e,n),this.requested=null):this.p.attacks&&this.next<=0&&this.beginAttack(us(Pu),e,n);break;case"windup":r.guard=!1,this.busy=!0,this.set(this.start,5.5),this.t>this.p.windup*.55&&(this.glint=1),this.t>this.p.windup&&(this.p.feint>0&&this.stage===0&&Math.random()<this.p.feint?(this.stage=1,this.plan(us(Pu),e,n),this.t=this.p.windup*.4):(this.state="swing",this.stage=0,this.t=0));break;case"swing":{r.guard=!1;const o=this.stage===0?this.mid:this.end;this.set(o,this.p.swing,Io.set(-this.u.y,this.u.x,0).cross(o).normalize()),r.q.angleTo(r.target)<.12&&(this.stage===0?this.stage=1:this.toRecover()),this.t>1.2&&this.toRecover();break}case"recover":r.guard=!1,this.idlePose(4),this.t>.35&&(this.state="idle",this.busy=!1,this.next=Rt(this.p.gap[0],this.p.gap[1]));break;case"block":r.guard=!0,this.set(this.blockDir,this.p.guardRate),this.blockT-=t,n.speedSm>3.5&&n.canAct&&(this.blockT=Math.max(this.blockT,.2)),this.blockT<=0&&(r.guard=!1,this.state="idle",this.next=Math.min(this.next,Rt(.3,.8)));break}}toRecover(){this.state="recover",this.t=0}idlePose(t){const e=this.sway;this.set(Io.set(-.08+Math.sin(e*1.3)*.08,.32+Math.sin(e*.9)*.06,-1).normalize(),t)}plan(t,e,n){this.u.copy(t);const i=this.p.aim;this.start.set(-t.x*.9,-t.y*.9+.3,.3).normalize();const r=(Math.random()<.5?n.body.head:n.body.torsoB).clone(),a=e.group.worldToLocal(r),o=new A(.17,1,-.33);this.mid.subVectors(a,o).normalize(),this.mid.x+=Rt(-i,i),this.mid.y+=Rt(-i,i),this.mid.normalize(),this.end.set(t.x*.95,t.y*.95-.1,-.4).normalize()}beginAttack(t,e,n){this.plan(t,e,n),this.state="windup",this.stage=0,this.t=0,this.busy=!0}startBlock(t,e){const n=LM.copy(t.group.quaternion).invert(),i=Io.copy(e.tipVel).applyQuaternion(n);let r=-i.y,a=i.x;Math.hypot(r,a)<.5&&(r=0,a=1),a<0&&(r=-r,a=-a);const o=Math.hypot(r,a)||1;this.blockDir.set(r/o,a/o,-.3).normalize(),this.blockDir.x+=Rt(-this.p.aim,this.p.aim)*.6,this.blockDir.y=fe(this.blockDir.y+Rt(-this.p.aim,this.p.aim)*.6,-.2,1),this.blockDir.normalize(),this.state="block",this.blockT=.45,this.busy=!1}}const On=new A,Ki=new A,ea=new A,Lu=new A,Iu=new A;function Du(s,t,e,n,i){On.subVectors(t,s),Ki.subVectors(n,e),ea.subVectors(s,e);const r=On.dot(On),a=Ki.dot(Ki),o=Ki.dot(ea);let l=0,c=0;const h=1e-9;if(r<=h&&a<=h)l=c=0;else if(r<=h)l=0,c=Math.min(1,Math.max(0,o/a));else{const d=On.dot(ea);if(a<=h)c=0,l=Math.min(1,Math.max(0,-d/r));else{const u=On.dot(Ki),f=r*a-u*u;l=f!==0?Math.min(1,Math.max(0,(u*o-d*a)/f)):0,c=(u*l+o)/a,c<0?(c=0,l=Math.min(1,Math.max(0,-d/r))):c>1&&(c=1,l=Math.min(1,Math.max(0,(u-d)/r)))}}return Lu.copy(s).addScaledVector(On,l),Iu.copy(e).addScaledVector(Ki,c),i.d2=Lu.distanceToSquared(Iu),i.s=l,i.t=c,i}function IM(s,t,e){On.subVectors(t,s);const n=On.lengthSq();return n<1e-9?0:Math.min(1,Math.max(0,ea.subVectors(e,s).dot(On)/n))}const Zi=3.2,Do=3,Nu=10.5,Cs=1.72,Un={d2:0,s:0,t:0},kr=new A,zr=new A,Vr=new A,Hr=new A,Gr=new A,No=new A,DM=new Kt;class Yd{constructor(t,e,n,i){E(this,"f");E(this,"cfg");E(this,"ev");E(this,"phase","intro");E(this,"phaseT",0);E(this,"round",1);E(this,"score",[0,0]);E(this,"timeLeft");E(this,"ready",[!1,!1]);E(this,"hold",[0,0]);E(this,"timeScale",1);E(this,"slowT",0);E(this,"presser",null);E(this,"lastClash",-10);E(this,"teeterSaid",[!1,!1]);E(this,"roundWinner",null);E(this,"matchWinner",null);E(this,"time",0);E(this,"splashed",!1);this.f=[t,e],t.side=0,e.side=1,this.cfg=n,this.ev=i,this.timeLeft=n.roundTime,this.placeFighters(),n.skipIntro?this.setPhase("ready"):this.setPhase("intro")}placeFighters(){const[t,e]=this.f;t.place(Cs/2,0),e.place(-Cs/2,Math.PI)}setPhase(t){this.phase=t,this.phaseT=0,t==="ready"&&(this.ready[0]=this.ready[1]=!1,this.hold[0]=this.hold[1]=0),this.ev.phase(t)}skip(){this.phase==="intro"&&this.setPhase("ready")}nextRound(){this.round++,this.timeLeft=this.cfg.roundTime,this.presser=null,this.teeterSaid=[!1,!1],this.splashed=!1,this.roundWinner=null,this.placeFighters(),this.setPhase("ready")}updateReady(t){for(let e=0;e<2;e++){const n=this.f[e];if(!this.ready[e]){if(n.slot<0){this.ready[e]=!0;continue}n.ctl.guard&&n.ctl.live?this.hold[e]+=t:this.hold[e]=Math.max(0,this.hold[e]-t*2),this.hold[e]>=.5&&(n.ctl.calibrate(),this.ready[e]=!0,this.ev.ready(n))}}this.ready[0]&&this.ready[1]&&this.setPhase("go")}step(t,e){this.time+=t,this.phaseT+=t,this.slowT>0&&(this.slowT-=t/Math.max(.05,this.timeScale),this.slowT<=0&&(this.timeScale=1));const[n,i]=this.f;switch(n.update(t,e,i,jt.waterY),i.update(t,e,n,jt.waterY),this.phase){case"intro":this.phaseT>3.2&&this.setPhase("ready");break;case"ready":this.updateReady(t);break;case"go":this.phaseT>1.1&&this.setPhase("fight");break;case"fight":this.combat(e),this.move(t),this.cfg.training||(this.timeLeft-=t,this.timeLeft<=0&&this.timeUp());break;case"point":this.move(t),this.watchSplash(),this.phaseT>3.4&&(this.matchWinner?this.setPhase("over"):this.nextRound());break;case"over":this.watchSplash();break}}watchSplash(){for(const t of this.f)t.state==="water"&&!this.splashed&&(this.splashed=!0,this.ev.splash(t,t.group.position.clone().setY(jt.waterY)))}edgeRoom(t){return t.side===0?jt.halfLen-t.z:t.z+jt.halfLen}move(t){const[e,n]=this.f;for(const r of this.f){if(r.state!=="stand")continue;const a=jt.friction*t;Math.abs(r.vz)<=a?r.vz=0:r.vz-=Math.sign(r.vz)*a}const i=e.z-n.z;for(const r of this.f){if(r.state!=="stand"||this.phase!=="fight"||r.anchored){r.walkAmt=Math.max(0,r.walkAmt-t*4);continue}const a=r===e?n:e,o=r.side===0?-1:1;let l=0;i>Cs+.06&&Math.abs(a.vz)<1.2&&(this.presser===r||!this.presser&&i>Cs+.4)?l=1.7:i<Cs-.35&&(l=-.9),(r.stun>0||r.stagger>0)&&(l=Math.min(l,0)),l!==0&&Math.abs(r.vz)<1.8?(r.z+=o*l*t,r.walkPhase+=t*9*Math.sign(l),r.walkAmt=Math.min(1,r.walkAmt+t*5)):r.walkAmt=Math.max(0,r.walkAmt-t*4)}for(const r of this.f){if(r.state!=="stand")continue;if(r.anchored){r.vz=0;continue}r.z+=r.vz*t;const a=this.edgeRoom(r),o=r.side;a<-.05&&!this.cfg.training?(r.fall(r.side===0?1:-1),this.ev.fall(r),this.phase==="fight"&&this.roundOver(r===e?n:e,"out")):a<.45?(r.teeter=fe(1-a/.45,0,1)*(Math.abs(r.vz)<.8?1:.4),!this.teeterSaid[o]&&a<.3&&Math.abs(r.vz)<.4&&(this.teeterSaid[o]=!0,this.ev.teeter(r))):(r.teeter=Math.max(0,r.teeter-t*3),a>.8&&(this.teeterSaid[o]=!1)),this.cfg.training&&(r.z=fe(r.z,-3.6+.3,jt.halfLen-.3))}if(e.state==="stand"&&n.state==="stand"&&e.z-n.z<.9){const r=(e.z+n.z)/2;e.z=r+.45,n.z=r-.45}}timeUp(){const[t,e]=this.f,n=this.edgeRoom(t),i=this.edgeRoom(e),r=Math.abs(n-i)<.25?null:n>i?t:e;this.roundOver(r,"time")}roundOver(t,e){this.phase==="fight"&&(this.roundWinner=t,t&&(this.score[t.side]++,t.cheer=1,this.score[t.side]>=this.cfg.roundsToWin&&(this.matchWinner=t)),e==="out"&&(this.timeScale=.3,this.slowT=.9),this.setPhase("point"),this.ev.round(t,e),this.matchWinner&&this.ev.over(this.matchWinner))}combat(t){const[e,n]=this.f;if(e.state!=="stand"||n.state!=="stand")return;const i=6;let r=t-this.lastClash<.22,a=!1,o=!1;for(let l=1;l<=i;l++){const c=l/i;if(kr.lerpVectors(e.prevHilt,e.hilt,c).addScaledVector(Gr.lerpVectors(e.prevDir,e.dir,c).normalize(),e.sword.bladeStart),zr.lerpVectors(e.prevHilt,e.hilt,c).addScaledVector(Gr,e.sword.length),Vr.lerpVectors(n.prevHilt,n.hilt,c).addScaledVector(No.lerpVectors(n.prevDir,n.dir,c).normalize(),n.sword.bladeStart),Hr.lerpVectors(n.prevHilt,n.hilt,c).addScaledVector(No,n.sword.length),!r){Du(kr,zr,Vr,Hr,Un);const h=e.bladeRadius()+n.bladeRadius();if(Un.d2<h*h){const d=new A().lerpVectors(kr,zr,Un.s).lerp(new A().lerpVectors(Vr,Hr,Un.t),.5);if(this.blades(e,n,Un.s,Un.t,d,t)){r=!0;break}r=!0}}if(!a&&this.tryHit(e,n,kr,zr)&&(a=!0),!o&&this.tryHit(n,e,Vr,Hr)&&(o=!0),a||o)break}}blades(t,e,n,i,r,a){const o=t.speedAt(n),l=e.speedAt(i),c=t.guarding,h=e.guarding;if(this.lastClash=a,h&&o>Zi&&!c&&t.canAct)return this.block(t,e,r),!0;if(c&&l>Zi&&!h&&e.canAct)return this.block(e,t,r),!0;if(o>Zi&&l>Zi){const d=fe((o+l)/24,.3,1);return this.bounce(t,.9*d,.28),this.bounce(e,.9*d,.28),t.vz+=this.back(t)*.9*d,e.vz+=this.back(e)*.9*d,t.spent=e.spent=!0,this.ev.clash(t,e,r,d),!0}if(o>Zi||l>Zi){const[d,u]=o>l?[t,e]:[e,t];return this.bounce(d,.55,0),this.bounce(u,.7,0,d),d.spent=!0,this.ev.clash(d,u,r,.45),!0}return this.lastClash=a-.15,!1}back(t){return t.side===0?1:-1}bounce(t,e,n,i=null){const r=DM.copy(t.group.quaternion).invert(),a=Gr.copy((i??t).tipVel).applyQuaternion(r);i||a.negate();const o=No.copy(t.dir).applyQuaternion(r),l=new A().crossVectors(o,a);l.lengthSq()<1e-6&&l.set(1,0,0),t.knockSword(l,e),n>0&&(t.stagger=Math.max(t.stagger,n))}block(t,e,n){this.bounce(t,1.25,.72),this.bounce(e,.25,0,t),t.spent=!0,t.vz+=this.back(t)*.8,e.vz+=this.back(e)*.55,e.stats.blocks++,this.ev.block(t,e,n)}tryHit(t,e,n,i){if(!t.canAct||t.spent||e.invuln>0||e.state!=="stand")return!1;const r=e.body;let a=null;const o=.05;{const h=IM(n,i,r.head),d=Gr.lerpVectors(n,i,h).distanceTo(r.head);d<r.headR+o&&(a={part:"head",s:h,d})}for(const[h,d,u,f]of[["torso",r.torsoA,r.torsoB,r.torsoR],["legs",r.legsA,r.legsB,r.legsR]]){Du(n,i,d,u,Un);const g=Math.sqrt(Un.d2);g<f+o&&(!a||g<a.d)&&(a={part:h,s:Un.s,d:g})}if(!a)return!1;const l=t.speedAt(a.s);if(l<Do)return!1;const c=new A().lerpVectors(n,i,a.s);return this.hit(t,e,c,l,a.part),!0}hit(t,e,n,i,r){const a=fe((i-Do)/(Nu-Do),0,1),o=i>=Nu,l=e.stagger>0,c=t.char?.stats.power??1,h=e.char?.stats.weight??1.15;let d=(1.5+2.3*a)*(c/h)*(l?1.35:1)*(r==="head"?1.1:r==="legs"?.85:1);d=Math.min(d,4.4),this.cfg.training&&(e.wobbleKick(d*.9),d=0),e.vz+=this.back(e)*d,e.stun=.42,e.stagger=0,e.invuln=.32,e.hitAnim=1,this.bounce(e,.35,0,t),t.spent=!0,t.stats.hits++,t.stats.best=Math.max(t.stats.best,i),o&&t.stats.strong++,l&&t.stats.counters++,this.presser=t,this.ev.hit(t,e,{p:n,speed:i,strength:a,strong:o,counter:l,part:r})}static swingLevel(t){return fe((t.speedSm-2.5)/12,0,1)}static ease(t,e,n,i){return t+(e-t)*Vn(n,i)}}const Dl=1.16,Nl=.15,NM=.05;function UM(s,t){const e=new ge,n=new wt(new ve(.03,.034,.22,10),rt(2761272));e.add(n);const i=new wt(new Ce(.048,10,8),rt(t));i.position.y=-.13,e.add(i);const r=new wt(new Ze(.28,.05,.08),rt(t));r.position.y=.13,e.add(r);const a=Dl-Nl-.05,o=new wt(new ve(.047,.052,a,12),rt(s));o.position.y=Nl+a/2,o.name="blade",e.add(o);const l=new wt(new Ce(.048,12,8),rt(16777215));l.position.y=Dl-.05,e.add(l);for(const c of[.35,.6,.85]){const h=new wt(new ui(.05,.008,4,14),rt(16777215));h.rotation.x=Math.PI/2,h.position.y=c,e.add(h)}return e.traverse(c=>c.castShadow=!0),e}class FM{constructor(t){E(this,"root",new ge);E(this,"length",Dl);E(this,"bladeStart",Nl);E(this,"glint");E(this,"procedural",!1);const e=t?t.main:11569746,n=t?t.accent:7031338,i=t&&Xn.swords.get(String(t.id))||Xn.sword;if(i){const r=i.clone(!0);r.traverse(l=>{const c=l;if(!c.isMesh)return;const h=d=>{const u=d.name.toLowerCase();if(u==="foam"||u==="accent"){const f=d.clone();return f.color?.setHex(u==="foam"?e:n),f}return d};c.material=Array.isArray(c.material)?c.material.map(h):h(c.material),c.castShadow=!0}),this.root.add(r);const a=Ei(r,"tip");if(a)this.length=a.position.length();else{const l=new qn().setFromObject(r);this.length=Math.max(.6,l.max.y)}const o=Ei(r,"guard");o&&(this.bladeStart=Math.max(.05,o.position.y))}else this.root.add(UM(e,n)),this.procedural=!0;this.glint=new wl(new ha({map:OM(),color:16777215,transparent:!0,depthWrite:!1,blending:rs})),this.glint.position.y=this.length-.02,t&&(this.root.scale.setScalar(t.stats.reach),this.length*=t.stats.reach,this.bladeStart*=t.stats.reach),this.glint.scale.setScalar(.001),this.root.add(this.glint)}dispose(){this.root.removeFromParent(),this.glint.material.dispose(),this.procedural&&this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}setGlint(t){const e=t*.55;this.glint.scale.setScalar(Math.max(.001,e)),this.glint.material.opacity=Math.min(1,t),this.glint.material.rotation+=.15}}let Wr=null;function OM(){if(Wr)return Wr;const s=document.createElement("canvas");s.width=s.height=64;const t=s.getContext("2d"),e=t.createRadialGradient(32,32,0,32,32,32);return e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.25,"rgba(255,240,180,0.8)"),e.addColorStop(1,"rgba(255,240,180,0)"),t.fillStyle=e,t.fillRect(0,0,64,64),t.fillStyle="rgba(255,255,255,0.9)",t.fillRect(30,0,4,64),t.fillRect(0,30,64,4),Wr=new Ql(s),Wr}class BM{constructor(t,e=18){E(this,"mesh");E(this,"n");E(this,"base");E(this,"tip");E(this,"alpha");E(this,"pos");E(this,"col");E(this,"color");E(this,"head",0);E(this,"filled",0);this.n=e,this.color=new Lt(t).lerp(new Lt(16777215),.35),this.base=new Float32Array(e*3),this.tip=new Float32Array(e*3),this.alpha=new Float32Array(e);const n=new Pe;this.pos=new Ye(new Float32Array(e*2*3),3),this.pos.setUsage(ks),this.col=new Ye(new Float32Array(e*2*4),4),this.col.setUsage(ks),n.setAttribute("position",this.pos),n.setAttribute("color",this.col);const i=[];for(let r=0;r<e-1;r++){const a=r*2,o=r*2+1,l=(r+1)*2,c=(r+1)*2+1;i.push(a,o,l,o,c,l)}n.setIndex(i),this.mesh=new wt(n,new $s({vertexColors:!0,transparent:!0,depthWrite:!1,side:yn,blending:rs})),this.mesh.frustumCulled=!1,this.mesh.renderOrder=5}push(t,e,n){this.head=(this.head+1)%this.n;const i=this.head;t.toArray(this.base,i*3),e.toArray(this.tip,i*3),this.alpha[i]=n,this.filled=Math.min(this.n,this.filled+1);const r=this.pos.array,a=this.col.array;for(let o=0;o<this.n;o++){const l=(this.head-o+this.n)%this.n,c=o<this.filled,h=1-o/(this.n-1),d=c?this.alpha[l]*h*h:0;for(let f=0;f<3;f++)r[o*6+f]=this.base[l*3+f],r[o*6+3+f]=this.tip[l*3+f];const u=o*8;a[u]=this.color.r*.5,a[u+1]=this.color.g*.5,a[u+2]=this.color.b*.5,a[u+3]=d*.15,a[u+4]=this.color.r,a[u+5]=this.color.g,a[u+6]=this.color.b,a[u+7]=d*.85}this.pos.needsUpdate=!0,this.col.needsUpdate=!0}clear(){this.filled=0,this.alpha.fill(0)}dispose(){this.mesh.removeFromParent(),this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Xr=new A(0,1,0),qr=new A,Uo=new A,Fo=new Kt;class kM{constructor(t,e,n,i,r){E(this,"group",new ge);E(this,"puppet");E(this,"sword");E(this,"trail");E(this,"char");E(this,"name");E(this,"ctl");E(this,"slot");E(this,"side");E(this,"hand","R");E(this,"anchored",!1);E(this,"x",0);E(this,"z",0);E(this,"vz",0);E(this,"vx",0);E(this,"facing",0);E(this,"state","stand");E(this,"fallVel",new A);E(this,"fallSpin",0);E(this,"fallT",0);E(this,"waterT",0);E(this,"stun",0);E(this,"stagger",0);E(this,"invuln",0);E(this,"hitAnim",0);E(this,"cheer",0);E(this,"spent",!1);E(this,"walkPhase",0);E(this,"walkAmt",0);E(this,"teeter",0);E(this,"guardBlend",0);E(this,"defAxis",new A(1,0,0));E(this,"defAng",0);E(this,"wobble",0);E(this,"wobbleV",0);E(this,"qL",new Kt);E(this,"dirL",new A);E(this,"qW",new Kt);E(this,"hilt",new A);E(this,"dir",new A(0,0,-1));E(this,"base",new A);E(this,"tip",new A);E(this,"prevHilt",new A);E(this,"prevDir",new A(0,0,-1));E(this,"prevTip",new A);E(this,"tipVel",new A);E(this,"speed",0);E(this,"speedSm",0);E(this,"hasPrev",!1);E(this,"lastDt",0);E(this,"body",{head:new A,headR:.3,torsoA:new A,torsoB:new A,torsoR:.27,legsA:new A,legsB:new A,legsR:.2});E(this,"stats",{hits:0,blocks:0,counters:0,strong:0,best:0});E(this,"lookAt",null);E(this,"shoulderL",new A(.29,1.23,0));E(this,"reachLen",.58);E(this,"t",Math.random()*10);this.char=t,this.name=e,this.ctl=n,this.slot=i,this.side=r,this.puppet=new Fd(t),this.group.add(this.puppet.root),this.sword=new FM(t),this.trail=new BM(t?t.main:16771496),this.measure()}measure(){this.group.position.set(0,0,0),this.group.quaternion.identity(),this.group.updateMatrixWorld(!0),this.puppet.shoulderWorld("R",this.shoulderL),this.reachLen=this.puppet.reach("R")*.97}place(t,e){this.z=t,this.x=0,this.vz=this.vx=0,this.facing=e,this.state="stand",this.stun=this.stagger=this.invuln=this.hitAnim=this.cheer=0,this.spent=!1,this.walkAmt=0,this.teeter=0,this.defAng=0,this.fallT=0,this.waterT=0,this.wobble=this.wobbleV=0,this.group.rotation.set(0,e,0),this.group.position.set(this.x,0,this.z),this.hasPrev=!1,this.trail.clear()}forward(t=new A){return t.set(-Math.sin(this.facing),0,-Math.cos(this.facing))}get canAct(){return this.state==="stand"&&this.stun<=0&&this.stagger<=0}get guarding(){return this.ctl.guard&&this.state==="stand"&&this.stun<=0&&this.stagger<=0}knockSword(t,e){t.lengthSq()<1e-6||(this.defAxis.copy(t).normalize(),this.defAng=e)}wobbleKick(t){this.wobbleV+=t}gripTarget(t,e,n,i){const r=this.hand==="R"?1:-1,a=n*.12,o=r*.17+.2*t.x,l=1+.27*t.y-a,c=-.33+.15*t.z,h=1-Math.abs(t.y),d=.1*t.x+r*.05,u=1.22+.32*h-a,f=-.46,g=d-t.x*.48,v=u-t.y*.48,m=f-t.z*.48;i.set(Os(o,g,e),Os(l,v,e),Math.min(-.16,Os(c,m,e)));const p=Uo.set(r*Math.abs(this.shoulderL.x),this.shoulderL.y-a,this.shoulderL.z),x=i.sub(p),T=x.length();return T>this.reachLen&&x.multiplyScalar(this.reachLen/T),x.add(p)}update(t,e,n,i){if(this.t+=t,this.lastDt=t,this.ctl.update(t,e),this.stun=Math.max(0,this.stun-t),this.stagger=Math.max(0,this.stagger-t),this.invuln=Math.max(0,this.invuln-t),this.hitAnim=Math.max(0,this.hitAnim-t*2.2),this.defAng*=1-Vn(this.stagger>0?3.5:7,t),this.guardBlend+=((this.guarding?1:0)-this.guardBlend)*Vn(16,t),this.speedSm<2.2&&(this.spent=!1),this.wobbleV+=(-this.wobble*60-this.wobbleV*5)*t,this.wobble+=this.wobbleV*t,this.state==="fall")this.fallT+=t,this.fallVel.y-=16*t,this.group.position.addScaledVector(this.fallVel,t),this.fallSpin+=t*2.6,this.group.rotation.set(Math.min(1.9,this.fallSpin),this.facing,0,"YXZ"),this.group.position.y<i-.2&&(this.state="water",this.waterT=0);else if(this.state==="water"){this.waterT+=t;const d=Math.min(1,this.waterT*1.6);this.group.position.y=Os(this.group.position.y,i-1.15+Math.sin(this.waterT*2.4)*.06,Vn(4*d+1,t)),this.group.position.addScaledVector(this.fallVel.setY(0),t*Math.max(0,1-this.waterT)),this.group.rotation.set(Math.sin(this.waterT*1.7)*.12,this.facing+Math.sin(this.waterT*.8)*.3,Math.sin(this.waterT*2.1)*.1,"YXZ")}else this.group.position.set(this.x,0,this.z),this.group.rotation.set(this.anchored?this.wobble*.5:0,this.facing,this.anchored?this.wobble*.3:0,"YXZ");this.group.updateMatrixWorld(!0),this.qL.copy(this.ctl.q),this.defAng>.002&&this.qL.premultiply(Fo.setFromAxisAngle(this.defAxis,this.defAng)),this.state!=="stand"&&this.qL.premultiply(Fo.setFromAxisAngle(qr.set(1,0,0),Math.sin(this.t*9)*.8)),this.dirL.set(0,1,0).applyQuaternion(this.qL);const r=this.state==="stand"?.22+this.guardBlend*.55-this.hitAnim*.2:0,a=this.gripTarget(this.dirL,this.guardBlend,r,qr),o=this.group.localToWorld(a.clone());this.qW.copy(this.group.quaternion).multiply(this.qL);const l=this.hand==="R"?1:-1,c=new A(l*.75,-1,.45).normalize().applyQuaternion(this.group.quaternion);this.puppet.pose({t:this.t,crouch:r,lean:this.guardBlend*.12-this.hitAnim*.3+(this.state==="stand"?.04:0),twist:fe(-this.dirL.x*.65,-.6,.6)*(this.state==="stand"?1:0),hit:this.hitAnim,teeter:this.teeter,flail:this.state==="fall"?1:this.state==="water"?.4:0,cheer:this.cheer,walk:this.walkPhase,walkAmt:this.walkAmt,look:this.lookAt??(n?n.body.head:null),hand:this.hand,gripPos:o,gripQuat:this.qW,pole:c}),this.sword.root.position.copy(this.puppet.gripActual),this.sword.root.quaternion.copy(this.qW),this.prevHilt.copy(this.hilt),this.prevDir.copy(this.dir),this.prevTip.copy(this.tip),this.hilt.copy(this.puppet.gripActual),this.dir.set(0,1,0).applyQuaternion(this.qW),this.base.copy(this.hilt).addScaledVector(this.dir,this.sword.bladeStart),this.tip.copy(this.hilt).addScaledVector(this.dir,this.sword.length),!this.hasPrev||t<=0?(this.prevHilt.copy(this.hilt),this.prevDir.copy(this.dir),this.prevTip.copy(this.tip),this.hasPrev=!0,this.tipVel.set(0,0,0)):this.tipVel.subVectors(this.tip,this.prevTip).divideScalar(t),this.speed=this.tipVel.length(),this.speedSm+=(this.speed-this.speedSm)*Vn(this.speed>this.speedSm?30:9,t);const h=Uo.copy(this.hilt).addScaledVector(this.dir,this.sword.length*.45);this.trail.push(h,this.tip,Lx(3.5,11,this.speedSm)),this.updateBody()}updateBody(){const t=this.body,e=this.puppet.get("hips"),n=this.puppet.get("head");e.getWorldPosition(t.torsoA),n.getWorldPosition(t.torsoB);const i=qr.set(0,1,0).applyQuaternion(n.getWorldQuaternion(Fo));t.head.copy(t.torsoB).addScaledVector(i,.26),t.torsoA.addScaledVector(Xr,.12),t.torsoB.addScaledVector(Xr,-.05),t.legsA.copy(this.group.position).addScaledVector(Xr,.12),t.legsB.copy(t.torsoA).addScaledVector(Xr,-.1),this.state!=="stand"&&t.legsA.copy(t.legsB)}fall(t){this.state!=="stand"||this.anchored||(this.state="fall",this.fallT=0,this.fallSpin=0,this.fallVel.set(this.vx*.5,2.6,t*Math.max(1.6,Math.abs(this.vz))),this.walkAmt=0)}bladePoint(t,e){return e.copy(this.base).lerp(this.tip,t)}speedAt(t){if(this.lastDt<=0)return 0;const e=qr.copy(this.base).lerp(this.tip,t),n=Uo.copy(this.prevHilt).addScaledVector(this.prevDir,this.sword.bladeStart+(this.sword.length-this.sword.bladeStart)*t);return e.distanceTo(n)/this.lastDt}bladeRadius(){return NM+(this.guarding?.11:.015)}dispose(){this.group.removeFromParent(),this.puppet.dispose(),this.sword.dispose(),this.trail.dispose()}}const ga=s=>Math.round(s*3.6);function Js(s,t,e,n,i,r,a){const o=new kM(t,e,n,i,r);return o.hand=a,s.scene.add(o.group,o.sword.root,o.trail.mesh),o}const zM=["BUM!","PLÁC!","BAC!","PUF!"];class Oo{constructor(t,e,n){E(this,"kind","duel");E(this,"fighters");E(this,"duel");E(this,"ais",[]);E(this,"viewers");E(this,"ctx");E(this,"opts");E(this,"faller",null);E(this,"overT",-1);E(this,"fightT",0);E(this,"orbitA",Math.random()*6);E(this,"finished",!1);this.ctx=t,this.opts=n;const i=new Set(e.map(a=>a.char.id)),r=[];for(e.slice(0,2).forEach((a,o)=>r.push(Js(t,a.char,a.name,a.ctl,a.slot,o,a.hand)));r.length<2;){const a=Wn.filter(h=>!i.has(h.id)),o=us(a.length?a:Wn);i.add(o.id);const l=new Wd,c=Js(t,o,o.short,l,-1,r.length,"R");r.push(c)}this.fighters=r,this.ais=r.map(a=>a.slot<0?new qd(a.ctl,Cu[n.demo?1:n.diff]??Cu[1]):null),this.viewers=r.filter(a=>a.slot>=0),this.duel=new Yd(r[0],r[1],{roundsToWin:n.demo?99:n.roundsToWin,roundTime:n.demo?9999:60,training:!1,skipIntro:!!n.demo},this.events())}get timeScale(){return this.duel.timeScale}quiet(){return this.opts.demo?.25:1}events(){const t=this.ctx;return{hit:(e,n,i)=>{const r=e.char?.main??16777215;if(t.fx.hit(i.p,r,i.strength),t.sound.play(i.strong||i.counter?"hitStrong":"hit",(.6+i.strength*.4)*this.quiet()),this.opts.demo)return;const a=i.counter?"PROTIÚTOK!":i.strong?"PRÁSK!":i.part==="head"?"DO HLAVY!":us(zM);t.pop(a,i.p,i.counter?"counter":i.strong?"strong":"hit"),t.pop(`${ga(i.speed)} km/h`,i.p.clone().add(new A(0,-.35,0)),"speed"),t.shake(i.strong?.07:.03),(i.strong||i.counter)&&t.hud.flash("rgba(255,255,255,0.28)"),t.buzz(n.slot,i.strong?150:70),t.buzz(e.slot,25),t.cheer(i.strong||i.counter?.8:.35)},block:(e,n,i)=>{t.fx.clash(i,!0),t.sound.play("block",this.quiet()),this.ais[n.side]?.onBlocked(),!this.opts.demo&&(t.pop("KRYT!",i,"block"),t.buzz(n.slot,35),t.buzz(e.slot,[70,40,70]),t.cheer(.25))},clash:(e,n,i,r)=>{t.fx.clash(i,!1),t.sound.play("clash",(.5+r*.5)*this.quiet()),!this.opts.demo&&(r>.5&&t.pop("ŤUK!",i,"clash"),t.buzz(e.slot,30),t.buzz(n.slot,30))},teeter:e=>{this.opts.demo||(t.pop("Pozor!",e.body.head.clone().add(new A(0,.55,0)),"teeter"),t.sound.play("teeter",.8),t.buzz(e.slot,[30,30,30,30,30]))},fall:e=>{this.faller=e,t.sound.play("teeter",.9*this.quiet()),t.buzz(e.slot,300)},splash:(e,n)=>{t.fx.splash(n,1.2),t.arena.splash(n),t.sound.play("splash",this.quiet()),!this.opts.demo&&(t.shake(.05),t.cheer(1),t.hud.big("ŽBLUŇK!",this.duel.roundWinner?`Kolo pro ${this.duel.roundWinner.name}`:"",2e3,"splash"))},ready:e=>{t.sound.play("ready"),t.buzz(e.slot,40)},phase:e=>this.onPhase(e),round:(e,n)=>{this.opts.demo||(t.sound.play("point"),n==="time"&&t.hud.big("Čas!",e?`Kolo pro ${e.name} — měl víc místa za zády`:"Nerozhodně",2400),e&&t.buzz(e.slot,[40,60,40]))},over:e=>{this.opts.demo||setTimeout(()=>{t.sound.play("win"),e&&t.fx.confetti(e.body.head.clone().add(new A(0,1,0))),t.cheer(1),t.hud.big(e?`Vítězí ${e.name}!`:"Remíza!","",2600,"win")},1300)}}}onPhase(t){const e=this.ctx;this.opts.demo||(t==="intro"?e.hud.big("Mečovačka","Molo na rybníce",2600,"title"):t==="ready"?(this.faller=null,e.hud.big(`Kolo ${this.duel.round}`,"",1600)):t==="go"?(e.hud.big("Připravit…","",700),e.sound.play("count"),setTimeout(()=>{e.hud.big("TEĎ!","",700,"go"),e.sound.play("gong")},600)):t==="fight"?this.fightT=0:t==="over"&&(this.overT=0))}step(t,e){const n=this.duel,i=n.phase==="fight";this.fighters.forEach((r,a)=>{const o=this.ais[a];o&&(o.update(t,r,this.fighters[1-a],i),r.sword.setGlint(o.glint))}),n.step(t,e),this.fightT+=t,this.overT>=0&&(this.overT+=t,this.overT>4.2&&(this.finished=!0))}cameras(t,e){const n=this.duel,[i,r]=this.fighters;if(this.opts.demo||!this.viewers.length)return this.orbitA+=e*.08,Lo(t[0],this.orbitA,8.5,3.4,new A(0,.9,(i.z+r.z)/2)),{owners:[null]};const a=this.viewers.slice(0,2);return a.forEach((o,l)=>{const c=t[l],h=o===i?r:i;if(n.phase==="intro"){const d=n.phaseT/3.2;Lo(c,this.orbitA+l*Math.PI+d*2.2,7.5-d*2,3.6-d,new A(0,.9,0)),d>.85&&(c.snap=!1,Il(c,o,h,e,3))}else if(n.phase==="point"&&this.faller&&n.phaseT<2.7)RM(c,this.faller,e);else if(n.phase==="over"&&n.matchWinner){this.orbitA+=e*.25;const d=n.matchWinner;Lo(c,this.orbitA+l*Math.PI,4.2,2.3,d.group.position.clone().setY(1.1))}else Il(c,o,h,e,n.phase==="point"?2.5:6)}),{owners:a}}hud(t){const e=this.ctx.hud;if(this.opts.demo){e.show(!1);return}e.show(!0);const n=this.duel,[i,r]=this.fighters,a=o=>({name:o.name,char:o.char?.id??0,score:Wx(n.score[o.side],n.cfg.roundsToWin),sub:o.slot<0?"počítač":void 0});e.setTop(a(i),a(r),`<small>Kolo ${n.round}</small><b>${n.phase==="fight"||n.phase==="point"?Ud(n.timeLeft):"1:00"}</b>`),this.viewers.slice(0,2).forEach((o,l)=>{const c=t[l],h=o.ctl instanceof ba;if(n.phase==="ready"){const d=o.side;if(n.ready[d])e.prompt(l,'<b class="ok">✓ Připraven</b> — čeká se na soupeře',c);else{const u=Math.round(Math.min(1,n.hold[d]/.5)*100);e.prompt(l,`${o.ctl.live?"":'<b class="bad">📵 Telefon nepřipojen</b><br>'}${h?"Podrž <b>levé tlačítko myši</b>":"Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b>"}<span class="bar"><i style="width:${u}%"></i></span>`,c)}}else n.phase==="fight"&&this.fightT<5&&n.round===1?e.prompt(l,h?"Švihni myší! Kryt = levé tlačítko.":"Švihni mečem! <b>KRYT</b> podržíš palcem — nastav meč proti úderu.",c):n.phase==="fight"&&!o.ctl.live?e.prompt(l,'<b class="bad">📵 Telefon neposílá pohyb</b>',c):e.prompt(l,null)});for(let o=this.viewers.length;o<2;o++)e.prompt(o,null)}pad(t){const e=this.duel,n=this.fighters.find(o=>o.slot===t),i=n?n.side:0,r=[e.score[i],e.score[1-i]],a={round:e.round,score:r};switch(e.phase){case"intro":return{...a,phase:"point",msg:"Za chvíli to začne…",ready:!1};case"ready":return e.ready[i]?{...a,phase:"ready",msg:"Připraven ✓ — čeká se na soupeře",ready:!0}:{...a,phase:"ready",msg:"Namiř telefon na obrazovku a podrž KRYT",ready:!1};case"go":case"fight":return{...a,phase:"fight",msg:n&&n.teeter>.5?"Pozor, jsi na okraji!":"",ready:!0};case"point":return{...a,phase:"point",msg:e.roundWinner?e.roundWinner===n?"Kolo je tvoje! 🎉":`Kolo pro ${e.roundWinner.name}`:"Nerozhodně",ready:!0};case"over":return{...a,phase:"point",msg:e.matchWinner===n?"Vyhráváš! 🏆":"Konec zápasu",ready:!0}}}results(){const t=this.duel,e=t.matchWinner,n=this.fighters.map(i=>({slot:i.slot,name:i.name,char:i.char?.id??0,human:i.slot>=0,win:i===e,main:String(t.score[i.side]),sub:`zásahy ${i.stats.hits} · kryty ${i.stats.blocks}${i.stats.counters?` · protiútoky ${i.stats.counters}`:""} · nejrychlejší ${ga(i.stats.best)} km/h`}));return n.sort((i,r)=>Number(r.win)-Number(i.win)),{title:e?`Vítězí ${e.name}!`:"Remíza",rows:n}}skip(){this.duel.skip()}dispose(){for(const t of this.fighters)t.dispose()}}const Ps=60,VM=3.4,Uu=[{id:"meloun",name:"Meloun",shape:"sphere",r:.25,color:3116858,flesh:16731482,pts:1},{id:"dyne",name:"Dýně",shape:"pumpkin",r:.26,color:16747039,flesh:16761418,pts:1},{id:"jablko",name:"Jablko",shape:"sphere",r:.15,color:15216682,flesh:16773828,pts:1},{id:"okurka",name:"Okurka",shape:"roll",r:.075,len:.5,color:3836458,flesh:13627040,pts:1},{id:"knedlik",name:"Knedlík",shape:"roll",r:.13,len:.42,color:15985362,flesh:16446434,pts:2},{id:"poleno",name:"Poleno",shape:"roll",r:.13,len:.5,color:9067051,flesh:14727288,pts:2},{id:"syr",name:"Sýr",shape:"wheel",r:.22,len:.16,color:16765503,flesh:16770954,pts:1}],Ls={id:"zlate",name:"Zlaté jablko",shape:"sphere",r:.16,color:16765471,flesh:16775106,pts:5},Ji={id:"jezek",name:"Ježek",shape:"hedgehog",r:.22,color:8018490,flesh:8018490,pts:-3},HM=Array.from({length:8},(s,t)=>{const e=t*Math.PI/4;return new It(Math.cos(e),Math.sin(e))});let Is=null;function GM(){if(Is)return Is;const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");return t.translate(64,64),t.lineJoin="round",t.beginPath(),t.moveTo(54,0),t.lineTo(10,-36),t.lineTo(10,-15),t.lineTo(-50,-15),t.lineTo(-50,15),t.lineTo(10,15),t.lineTo(10,36),t.closePath(),t.fillStyle="#ffd21f",t.strokeStyle="#1b1430",t.lineWidth=9,t.stroke(),t.fill(),Is=new Ql(s),Is.colorSpace=ze,Is}let Ds=null;function WM(){if(Ds)return Ds;const s=document.createElement("canvas");s.width=s.height=128;const t=s.getContext("2d");return t.lineWidth=14,t.strokeStyle="#ff4d6d",t.fillStyle="rgba(255,255,255,0.85)",t.beginPath(),t.arc(64,64,50,0,Math.PI*2),t.fill(),t.stroke(),t.beginPath(),t.moveTo(30,30),t.lineTo(98,98),t.stroke(),Ds=new Ql(s),Ds.colorSpace=ze,Ds}function XM(s){const t=Xn.slice.get(s.id);if(t){const r=t.clone(!0),a=Ei(r,"half_a"),o=Ei(r,"half_b");return a&&o?[a,o]:[r]}const e=rt(s.color),n=rt(s.flesh),i=[];for(const r of[1,-1]){const a=new ge;if(s.shape==="sphere"||s.shape==="pumpkin"){const o=new Ce(s.r,18,12,r>0?Math.PI/2:-Math.PI/2,Math.PI),l=new wt(o,e);s.shape==="pumpkin"&&l.scale.set(1,.82,1),a.add(l);const c=new wt(new is(s.r*.97,20),n);if(c.rotation.y=r>0?-Math.PI/2:Math.PI/2,s.shape==="pumpkin"&&c.scale.set(1,.82,1),a.add(c),s.id==="meloun"){for(let h=0;h<4;h++){const d=new wt(new ui(s.r*1.002,.012,4,24,Math.PI),rt(1924906));d.rotation.set(0,(r>0?0:Math.PI)+(h-1.5)*.4,Math.PI/2),a.add(d)}for(let h=0;h<6;h++){const d=new wt(new Ce(.014,5,4),rt(1774640)),u=h/6*Math.PI*2;d.position.set(r*.003,Math.cos(u)*s.r*.55,Math.sin(u)*s.r*.55),a.add(d)}}if((s.id==="jablko"||s.id==="zlate")&&r>0){const h=new wt(new ve(.012,.012,.08,5),rt(5913114));h.position.set(.01,s.r+.02,0),a.add(h);const d=new wt(new Ce(.04,6,4),rt(3985230));d.scale.set(1,.3,.6),d.position.set(.04,s.r+.04,0),a.add(d)}if(s.shape==="pumpkin"&&r>0){const h=new wt(new ve(.025,.035,.1,6),rt(4876842));h.position.set(.02,s.r*.82+.03,0),a.add(h)}}else{const o=s.len??.4,l=new wt(new ve(s.r,s.r,o/2,16),e);l.rotation.z=Math.PI/2,l.position.x=r*o/4,a.add(l);const c=new wt(new is(s.r*.96,18),n);if(c.rotation.y=r>0?-Math.PI/2:Math.PI/2,c.position.x=r*.002,a.add(c),s.id==="poleno")for(const h of[.5,.8]){const d=new wt(new Zs(s.r*h-.008,s.r*h,18),rt(11041352));d.rotation.y=c.rotation.y,d.position.x=r*.004,a.add(d)}if(s.id==="syr")for(let h=0;h<3;h++){const d=new wt(new is(.025,8),rt(15251498));d.rotation.y=c.rotation.y,d.position.set(r*.004,Math.cos(h*2)*.1,Math.sin(h*2)*.1),a.add(d)}}a.traverse(o=>o.castShadow=!0),i.push(a)}return i}function qM(){const s=Xn.slice.get("jezek");if(s)return s.clone(!0);const t=new ge,e=new wt(new Ce(.2,14,10),rt(7031338));t.add(e);for(let r=0;r<46;r++){const a=new wt(new Bn(.035,.16,4),rt(r%2?3811866:5913122)),o=new A().randomDirection();o.z>.55&&(o.z=-o.z),a.position.copy(o).multiplyScalar(.2),a.quaternion.setFromUnitVectors(new A(0,1,0),o),t.add(a)}const n=new wt(new Ce(.12,10,8),rt(14266506));n.position.set(0,-.02,.15),t.add(n);const i=new wt(new Ce(.03,6,5),rt(1774640));i.position.set(0,-.02,.27),t.add(i);for(const r of[-1,1]){const a=new wt(new Ce(.022,6,5),rt(1774640));a.position.set(r*.05,.04,.24),t.add(a)}return t}const $d=()=>jr("mc_slice_best",null),YM=new A,Fu=new Kt;class Ou{constructor(t,e){E(this,"kind","slice");E(this,"fighters");E(this,"timeScale",1);E(this,"finished",!1);E(this,"ctx");E(this,"lanes",[]);E(this,"things",[]);E(this,"rng");E(this,"t",-1);E(this,"phase","ready");E(this,"phaseT",0);E(this,"spawnT",1);E(this,"hold",[]);E(this,"ready",[]);E(this,"record",$d());E(this,"newRecord",!1);this.ctx=t,this.rng=Ix(Math.random()*1e9|0);const n=e.length>1;this.fighters=e.slice(0,2).map((i,r)=>{const a=Js(t,i.char,i.name,i.ctl,i.slot,r,i.hand),o=n?r===0?-2.75:2.75:-2.75;return a.place(o,r===0?0:Math.PI),a.side=r,a});for(const i of this.fighters){const r=i.forward(new A),a=new A(-r.z,0,r.x),o=new A(i.x,jt.waterY,i.z).addScaledVector(r,1.45);this.lanes.push({f:i,score:0,combo:0,bestCombo:0,cuts:0,wrong:0,missed:0,spot:o,fw:r,right:a}),this.hold.push(0),this.ready.push(!1)}t.hud.big("Krájení","Vodník hází z rybníka — sekej ve směru šipky!",2600,"title")}get playing(){return this.phase==="play"}step(t,e){this.phaseT+=t;for(const n of this.fighters)n.update(t,e,null,jt.waterY),n.lookAt=this.lanes[n.side].spot.clone().setY(1.3);if(this.phase==="ready"){let n=!0;this.fighters.forEach((i,r)=>{this.ready[r]||(i.ctl.guard&&i.ctl.live?this.hold[r]+=t:this.hold[r]=Math.max(0,this.hold[r]-t*2),this.hold[r]>=.5&&(i.ctl.calibrate(),this.ready[r]=!0,this.ctx.sound.play("ready"),this.ctx.buzz(i.slot,40)),this.ready[r]||(n=!1))}),n&&(this.phase="go",this.phaseT=0,this.ctx.hud.big("Připravit…","",700),this.ctx.sound.play("count"))}else this.phase==="go"?this.phaseT>.9&&(this.phase="play",this.phaseT=0,this.t=0,this.ctx.hud.big("SEKEJ!","",700,"go"),this.ctx.sound.play("gong")):this.phase==="play"?(this.t+=t,this.spawnT-=t,this.spawnT<=0&&this.t<Ps-1.2&&this.spawn(),this.t>=Ps&&this.end()):this.phase==="end"&&this.phaseT>3.2&&(this.finished=!0);this.updateThings(t)}spawn(){const t=fe(this.t/Ps,0,1);this.spawnT=1.45-t*.7+this.rng()*.25;const n=this.t>18&&this.rng()<.18+t*.2?2:1,i=[];for(let r=0;r<n;r++){const a=this.rng(),o=this.t>8&&a<.09?Ji:a>.95?Ls:Uu[Math.floor(this.rng()*Uu.length)],l=o===Ji||o===Ls?null:HM[Math.floor(this.rng()*8)],c=n===1?(this.rng()-.5)*.9:(r===0?-.42:.42)+(this.rng()-.5)*.15,h=1.05+this.rng()*.75;i.push({def:o,dir:l,x:c,h})}for(const r of this.lanes)for(const a of i)this.launch(r,a.def,a.dir,a.x,a.h,t);this.ctx.sound.play("splash",.25)}launch(t,e,n,i,r,a){const o=new ge,l=e===Ji?[qM()]:XM(e),c=new ge;for(const w of l)c.add(w);o.add(c);const h=t.fw,d=t.right,u=new A(0,1,0),f=n??new It(0,1),g=new A().addScaledVector(d,-f.y).addScaledVector(u,f.x).normalize(),v=h.clone().negate(),m=new A().crossVectors(v,g).normalize();c.quaternion.setFromRotationMatrix(new Wt().makeBasis(g,m,v));let p=null;if(n||e===Ji){const w=new ha({map:n?GM():WM(),depthTest:!1,transparent:!0}),_=new wl(w);_.scale.setScalar(n?.55:.4),n&&(w.rotation=Math.atan2(n.y,n.x)),_.renderOrder=8,_.position.copy(v).multiplyScalar(e.r+.08),o.add(_),p=_}if(e===Ls){const w=new wl(new ha({color:16773536,transparent:!0,opacity:.45,depthWrite:!1,blending:rs}));w.scale.setScalar(.7),o.add(w)}const x=t.spot.clone().addScaledVector(d,i);x.y=jt.waterY-.2;const T=7+a*3,b=r-x.y,C=Math.sqrt(2*T*b);o.position.copy(x),this.ctx.scene.add(o),this.things.push({def:e,lane:t.f.side,group:o,halves:l,arrow:p,p:x,v:new A(0,C,0),dir:n,state:"fly",t:0,spin:(this.rng()-.5)*4,splitN:g,halfV:[],splashed:!1}),o.userData.gravity=T,this.ctx.fx.splash(x.clone().setY(jt.waterY),.15)}updateThings(t){for(const e of this.things){e.t+=t;const n=e.group.userData.gravity??8;e.state==="fly"||e.state==="bounce"?(e.v.y-=n*t,e.p.addScaledVector(e.v,t),e.group.position.copy(e.p),e.group.children[0].quaternion.premultiply(Fu.setFromAxisAngle(e.splitN,e.spin*t*(e.state==="bounce"?4:1))),e.state==="fly"&&this.playing&&this.checkCut(e),e.p.y<jt.waterY-.3&&e.v.y<0&&(e.state==="fly"&&e.def!==Ji&&this.phase==="play"&&this.miss(e),this.drop(e))):e.state==="cut"&&(e.halves.forEach((r,a)=>{const o=e.halfV[a];o.y-=n*t,r.position.addScaledVector(o,t),r.rotation.x+=t*(a?-3:3)}),e.arrow&&(e.arrow.visible=!1),e.group.position.y+Math.min(...e.halves.map(r=>r.position.y))<jt.waterY-.3&&this.drop(e))}this.things=this.things.filter(e=>e.state!=="gone"?!0:(this.free(e),!1))}free(t){t.group.removeFromParent();const e=Xn.slice.has(t.def.id);t.group.traverse(n=>{const i=n;i.isSprite?i.material.dispose():i.isMesh&&!e&&i.geometry.dispose()})}drop(t){t.splashed||(t.splashed=!0,this.ctx.fx.splash(t.group.position.clone().setY(jt.waterY),.25)),t.state="gone"}miss(t){const e=this.lanes[t.lane];e.missed++,e.combo>=3&&this.ctx.pop("Kombo pryč",t.p.clone().setY(.6),"miss"),e.combo=0,this.ctx.sound.play("miss",.5)}checkCut(t){const e=this.lanes[t.lane],n=e.f,i=t.def.r+.06;for(let r=1;r<=4;r++){const a=r/4,o=YM.lerpVectors(n.prevDir,n.dir,a).normalize(),l=new A().lerpVectors(n.prevHilt,n.hilt,a),c=l.clone().addScaledVector(o,n.sword.bladeStart),d=l.clone().addScaledVector(o,n.sword.length).clone().sub(c),u=fe(t.p.clone().sub(c).dot(d)/d.lengthSq(),0,1);if(c.addScaledVector(d,u).distanceTo(t.p)>i)continue;const g=n.speedAt(u);if(g<VM)return;const v=Fu.copy(n.group.quaternion).invert(),m=n.tipVel.clone().applyQuaternion(v),p=new It(m.x,m.y);if(p.lengthSq()<1e-4)return;p.normalize(),this.resolve(t,e,p,g);return}}resolve(t,e,n,i){const r=this.ctx,a=e.f;if(t.def===Ji){e.score=Math.max(0,e.score-3),e.combo=0,e.wrong++,t.state="bounce",t.v.set(n.x*2,3,0).addScaledVector(e.fw,3),r.sound.play("squeak"),r.pop("AU! −3",t.p.clone(),"bad"),r.buzz(a.slot,[80,50,80]);return}if(!(!t.dir||t.dir.dot(n)>Math.cos(50*Math.PI/180))){e.combo=0,e.wrong++,t.state="bounce";const f=new A().addScaledVector(e.right,n.x).add(new A(0,n.y,0)).multiplyScalar(3);t.v.copy(f).addScaledVector(e.fw,1.5).setY(Math.max(1.5,f.y)),t.spin*=3,r.sound.play("bonk"),r.pop("Špatný směr!",t.p.clone(),"bad"),r.buzz(a.slot,60);return}e.combo++,e.bestCombo=Math.max(e.bestCombo,e.combo),e.cuts++;const l=Math.min(4,1+Math.floor(e.combo/4)),c=t.def.pts*l;if(e.score+=c,t.state="cut",!t.dir){const f=new A().addScaledVector(e.right,-n.y).add(new A(0,n.x,0)).normalize();t.splitN.copy(f)}const h=t.splitN,u=t.group.children[0].quaternion.clone().invert();t.halfV=t.halves.map((f,g)=>{const v=g===0?1:-1;return h.clone().multiplyScalar(v*(1.6+i*.05)).add(new A(0,1.2,0)).addScaledVector(e.fw,.6).applyQuaternion(u)}),t.v.set(0,0,0),r.fx.juice(t.p,t.def.flesh,e.fw),r.sound.play("slice",.9),r.pop(`+${c}`,t.p.clone().add(new A(0,.3,0)),t.def===Ls?"gold":"plus"),l>1&&e.combo%4===0&&(r.pop(`Kombo ×${l}!`,t.p.clone().add(new A(0,.65,0)),"combo"),r.sound.play("combo")),r.buzz(a.slot,25),r.cheer(t.def===Ls?.8:.2)}end(){this.phase="end",this.phaseT=0;const t=this.ctx;t.sound.play("win"),t.cheer(1);const e=[...this.lanes].sort((n,i)=>i.score-n.score)[0];if(this.lanes.length>1){const n=this.lanes[0].score===this.lanes[1].score;t.hud.big(n?"Remíza!":`Vítězí ${e.f.name}!`,`${this.lanes[0].score} : ${this.lanes[1].score}`,3e3,"win")}else t.hud.big("Konec!",`${e.score} bodů`,3e3,"win");(!this.record||e.score>this.record.score)&&(this.record={score:e.score,name:e.f.name},ta("mc_slice_best",this.record),this.newRecord=e.score>0,this.newRecord&&setTimeout(()=>t.hud.big("Nový rekord!",`${e.score} bodů`,2200,"win"),1600));for(const n of this.things)n.state==="fly"&&(n.state="bounce")}cameras(t,e){const n=this.fighters.slice(0,2);return n.forEach((i,r)=>{const a=this.lanes[r];Xd(t[r],i,a.spot.z+a.fw.z*.4,e,6)}),{owners:n}}hud(t){const e=this.ctx.hud,n=o=>({name:o.f.name,char:o.f.char?.id??0,score:`<b class="num">${o.score}</b>`,sub:o.combo>=2?`kombo ${o.combo}`:""}),i=this.lanes[0],r=this.lanes[1]??null,a=`<small>${this.record?`rekord ${this.record.score}`:"Krájení"}</small><b>${Ud(this.phase==="play"?Ps-this.t:this.phase==="end"?0:Ps)}</b>`;e.setTop(n(i),r?n(r):null,a),this.fighters.forEach((o,l)=>{if(this.phase==="ready")if(this.ready[l])e.prompt(l,`<b class="ok">✓ Připraven</b>${this.fighters.length>1?" — čeká se na druhého":""}`,t[l]);else{const c=Math.round(Math.min(1,this.hold[l]/.5)*100);e.prompt(l,`Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b><span class="bar"><i style="width:${c}%"></i></span>`,t[l])}else this.phase==="play"&&this.t<6?e.prompt(l,"Sekni věc <b>ve směru šipky</b>. Ježka nech být!",t[l]):e.prompt(l,null)}),this.fighters.length<2&&e.prompt(1,null)}pad(t){const e=this.fighters.findIndex(a=>a.slot===t),n=this.lanes[e],i=this.lanes[1-e],r=[n?.score??0,i?i.score:-1];return this.phase==="ready"?this.ready[e]?{phase:"ready",msg:"Připraven ✓",ready:!0,round:1,score:r}:{phase:"ready",msg:"Namiř telefon na obrazovku a podrž KRYT",ready:!1,round:1,score:r}:this.phase==="end"?{phase:"point",msg:"Konec krájení!",ready:!0,round:1,score:r}:{phase:"fight",msg:n&&n.combo>=4?`Kombo ${n.combo}!`:"",ready:!0,round:1,score:r}}results(){const t=this.lanes.map(i=>({slot:i.f.slot,name:i.f.name,char:i.f.char?.id??0,human:!0,win:this.lanes.length>1?i.score>Math.min(...this.lanes.map(r=>r.score)):!0,main:`${i.score} b.`,sub:`rozseknuto ${i.cuts} · špatně ${i.wrong} · minuto ${i.missed} · nejdelší kombo ${i.bestCombo}`}));t.sort((i,r)=>Number(r.win)-Number(i.win));const e=[...this.lanes].sort((i,r)=>r.score-i.score)[0];return{title:this.lanes.length>1?this.lanes[0].score===this.lanes[1].score?"Remíza!":`Vítězí ${e.f.name}!`:this.newRecord?`Nový rekord: ${e.score} bodů!`:`${e.score} bodů`,rows:t}}skip(){}debug(){return{phase:this.phase,t:Math.round(this.t*10)/10,things:this.things.length,lanes:this.lanes.map(t=>({score:t.score,cuts:t.cuts,wrong:t.wrong,missed:t.missed,combo:t.combo})),ready:this.ready}}dispose(){for(const t of this.fighters)t.dispose();for(const t of this.things)this.free(t);this.things=[]}}const ii=[{id:"swing",text:"Zamávej mečem — meč na obrazovce kopíruje tvou ruku. Udělej <b>3 rychlé švihy</b>.",short:"Zamávej mečem",need:3},{id:"hit",text:"Švihni do panáka: <b>3 zásahy</b>. Rána se počítá, jen když švihneš (ne když se meče jen dotkneš).",short:"Zasáhni panáka",need:3},{id:"strong",text:"<b>Silná rána:</b> švihni co nejrychleji — aspoň 38 km/h. Silná rána odhodí soupeře dál.",short:"Silná rána",need:1},{id:"block",text:"Panák útočí! Až mrkne špička jeho meče, <b>podrž KRYT</b> a dej meč do cesty jeho úderu: svisle proti ráně z boku, vodorovně proti ráně shora. <b>3 kryty</b>.",short:"Vykryj úder",need:3},{id:"counter",text:"Po vykrytí je panák chvíli odražený — hned pusť KRYT a udeř: <b>PROTIÚTOK</b> (2×). Odhodí nejvíc.",short:"Protiútok",need:2},{id:"free",text:"Hotovo! Trénuj dál, nebo dej pauzu (<b>Esc</b> / ⏸ v telefonu) a zkus Souboj.",short:"Volný trénink",need:0}],$M=[180,0,-90,-135].map(s=>new It(Math.cos(s*Math.PI/180),Math.sin(s*Math.PI/180)));class Bu{constructor(t,e){E(this,"kind","train");E(this,"fighters");E(this,"duel");E(this,"ai");E(this,"ctx");E(this,"me");E(this,"dummy");E(this,"stepIdx",0);E(this,"count",0);E(this,"fastPrev",!1);E(this,"attackT",2.5);E(this,"stepT",0);E(this,"finished",!1);this.ctx=t,this.me=Js(t,e.char,e.name,e.ctl,e.slot,0,e.hand);const n=new Wd;this.dummy=Js(t,null,"Panák",n,-1,1,"R"),this.dummy.anchored=!0,this.ai=new qd(n,PM),this.fighters=[this.me,this.dummy],this.duel=new Yd(this.me,this.dummy,{roundsToWin:99,roundTime:9999,training:!0,skipIntro:!0},this.events()),t.hud.big("Trénink","Slaměný panák to vydrží",2200,"title")}get timeScale(){return 1}get cur(){return ii[this.stepIdx]}progress(t){this.cur.id===t&&(this.count++,this.ctx.sound.play("combo"),this.count>=this.cur.need&&this.next())}next(){this.stepIdx=Math.min(ii.length-1,this.stepIdx+1),this.count=0,this.stepT=0,this.attackT=1.6,this.ctx.sound.play("point"),this.ctx.cheer(.6),this.ctx.buzz(this.me.slot,[40,60,40]),this.ctx.hud.big(this.stepIdx===ii.length-1?"Hotovo! 🎉":"Výborně!",this.cur.short,1500,"win")}events(){const t=this.ctx;return{hit:(e,n,i)=>{t.fx.hit(i.p,e.char?.main??16771496,i.strength),t.sound.play(i.strong||i.counter?"hitStrong":"hit",.6+i.strength*.4),t.pop(`${ga(i.speed)} km/h`,i.p.clone().add(new A(0,-.3,0)),"speed"),e===this.me?(t.pop(i.counter?"PROTIÚTOK!":i.strong?"PRÁSK!":us(["BUM!","PLÁC!","BAC!"]),i.p,i.counter?"counter":i.strong?"strong":"hit"),t.buzz(e.slot,25),this.progress("hit"),i.strong&&this.progress("strong"),i.counter&&this.progress("counter")):(t.pop("Au!",i.p,"bad"),t.buzz(n.slot,80))},block:(e,n,i)=>{t.fx.clash(i,!0),t.sound.play("block"),n===this.me&&(t.pop("KRYT!",i,"block"),t.buzz(n.slot,35),this.progress("block"))},clash:(e,n,i,r)=>{t.fx.clash(i,!1),t.sound.play("clash",.5+r*.5)},teeter:()=>{},fall:()=>{},splash:()=>{},ready:e=>{t.sound.play("ready"),t.buzz(e.slot,40)},phase:e=>{e==="go"&&t.hud.big("Jdeme na to!","",900,"go")},round:()=>{},over:()=>{}}}step(t,e){const n=this.duel,i=n.phase==="fight";this.stepT+=t,i&&["block","counter","free"].includes(this.cur.id)&&!this.ai.busy&&this.dummy.canAct&&(this.attackT-=t,this.attackT<=0&&(this.ai.attack(us($M)),this.attackT=this.cur.id==="free"?3.4:2.6)),this.ai.update(t,this.dummy,this.me,i),this.dummy.sword.setGlint(this.ai.glint),n.step(t,e);const r=this.me.speedSm>6;i&&r&&!this.fastPrev&&this.progress("swing"),this.fastPrev=r}cameras(t,e){return Il(t[0],this.me,this.dummy,e,6),{owners:[this.me]}}hud(t){const e=this.ctx.hud,n=this.duel,i=this.cur;if(e.setTop({name:this.me.name,char:this.me.char?.id??0,score:i.need?`<b class="num">${this.count}/${i.need}</b>`:'<b class="num">✓</b>',sub:i.short},null,`<small>Trénink</small><b>${Math.min(this.stepIdx+1,ii.length-1)}/${ii.length-1}</b>`),n.phase==="ready"){const r=this.me.ctl instanceof ba,a=Math.round(Math.min(1,n.hold[0]/.5)*100);e.prompt(0,`${r?"Podrž <b>levé tlačítko myši</b>":"Namiř telefon <b>na obrazovku</b> a podrž <b>KRYT</b> — tím se meč vyrovná."}<span class="bar"><i style="width:${a}%"></i></span>`,t[0])}else e.prompt(0,i.text+(i.need?` <span class="cnt">${this.count}/${i.need}</span>`:""),t[0]);e.prompt(1,null)}pad(t){const e=this.duel;return e.phase==="ready"?e.ready[0]?{phase:"ready",msg:"Připraven ✓",ready:!0,round:1,score:[this.count,-1]}:{phase:"ready",msg:"Namiř telefon na obrazovku a podrž KRYT",ready:!1,round:1,score:[this.count,-1]}:{phase:"fight",msg:this.cur.short+(this.cur.need?` ${this.count}/${this.cur.need}`:""),ready:!0,round:1,score:[this.stepIdx,-1]}}results(){const t=this.me.stats;return{title:"Trénink",rows:[{slot:this.me.slot,name:this.me.name,char:this.me.char?.id??0,human:!0,win:this.stepIdx>=ii.length-1,main:`${Math.min(this.stepIdx,ii.length-1)}/${ii.length-1}`,sub:`zásahy ${t.hits} · kryty ${t.blocks} · protiútoky ${t.counters} · nejrychlejší ${ga(t.best)} km/h`}]}}skip(){this.duel.skip()}debug(){return{step:this.cur.id,count:this.count,phase:this.duel.phase,ready:this.duel.ready,waterY:jt.waterY}}dispose(){for(const t of this.fighters)t.dispose()}}const KM=new URLSearchParams(location.search);class ZM{constructor(){E(this,"view",new CM(document.getElementById("scene")));E(this,"sound",new Vx);E(this,"music",new Hx(this.sound));E(this,"fx",new Gx);E(this,"hud",new Xx(document.getElementById("hud")));E(this,"ui",document.getElementById("ui"));E(this,"input",new qx(document.getElementById("scene")));E(this,"session",new EM);E(this,"net");E(this,"lobby");E(this,"results");E(this,"pause");E(this,"arena");E(this,"spectators");E(this,"rigs",[new Ru,new Ru]);E(this,"vps",[]);E(this,"mode",fe(jr("mc_mode",0),0,Mi.length-1));E(this,"diff",fe(jr("mc_diff",1),0,Yr.length-1));E(this,"rounds",fe(jr("mc_rounds",1),0,sr.length-1));E(this,"top","lobby");E(this,"act",null);E(this,"demo",null);E(this,"voices",new Map);E(this,"paused",!1);E(this,"last",performance.now());E(this,"tick",0);E(this,"padAt",0);E(this,"onlineKey","");E(this,"lastResults",null);E(this,"ctx");this.view.scene.add(this.fx.group),this.ctx={scene:this.view.scene,arena:null,fx:this.fx,sound:this.sound,hud:this.hud,view:this.view,buzz:(t,e)=>{const n=this.session.bySlot(t);n?.conn&&this.net.send(n.conn,{t:"buzz",ms:e})},pop:(t,e,n)=>this.pop(t,e,n),cheer:t=>this.spectators.cheer(t),shake:t=>this.view.shake=Math.max(this.view.shake,t)},this.lobby=new vM(this.ui,{start:()=>this.start(),mode:t=>this.setMode(t),diff:t=>this.setDiff(this.diff+t),rounds:t=>this.setRounds(this.rounds+t),addMouse:()=>this.addMouse(),removePlayer:t=>this.removePlayer(t),toggleSound:()=>this.toggleSound(),fullscreen:()=>{document.documentElement.requestFullscreen?.().catch(()=>{})}}),this.results=new xM(this.ui,()=>this.again(),()=>this.toLobby()),this.pause=new MM(this.ui,{resume:()=>this.setPaused(!1),restart:()=>this.again(),menu:()=>this.toLobby()}),this.hud.show(!1),this.input.onKey=(t,e)=>this.onKey(t,e),addEventListener("pointerdown",()=>this.sound.unlock()),addEventListener("keydown",()=>this.sound.unlock()),this.net=new Yx({status:(t,e)=>this.netStatus(t,e),room:t=>this.lobby.setRoom(t,this.padUrl(t),this.shortUrl()),message:(t,e)=>this.onMessage(t,e),motion:(t,e)=>{const n=this.session.byCid(e);n&&(n.motion=t)},closed:t=>this.onClosed(t)}),this.lanCheck(),Px().finally(()=>this.boot())}boot(){this.arena=new kx(this.view.scene),this.ctx.arena=this.arena,this.spectators=new TM(this.view.scene,this.arena),this.renderLobby(),this.startDemo(),this.net.start(),KM.has("mouse")&&this.addMouse(),this.debugHooks(),requestAnimationFrame(t=>this.frame(t))}startDemo(){this.demo?.dispose(),this.demo=new Oo(this.ctx,[],{diff:1,roundsToWin:99,demo:!0}),this.spectators.setup(this.demo.fighters.map(t=>t.char?.id??-1));for(const t of this.rigs)t.snap=!0}setMode(t){this.top==="lobby"&&(this.mode=fe(t,0,Mi.length-1),ta("mc_mode",this.mode),this.sound.play("click"),this.renderLobby(),this.broadcastLobby())}setDiff(t){this.top==="lobby"&&(this.diff=(t+Yr.length)%Yr.length,ta("mc_diff",this.diff),this.renderLobby(),this.broadcastLobby())}setRounds(t){this.top==="lobby"&&(this.rounds=(t+sr.length)%sr.length,ta("mc_rounds",this.rounds),this.renderLobby(),this.broadcastLobby())}renderLobby(){const t=$d();this.lobby.render({players:this.session.lobbyPlayers(),mode:this.mode,diff:this.diff,rounds:this.rounds,canStart:this.session.players.some(e=>this.session.online(e)),muted:this.sound.muted,best:t?`${t.score} b. (${t.name})`:"—"})}lobbyMsg(t){const e=this.session.hostSlot();return{t:"lobby",players:this.session.lobbyPlayers(),you:t.slot,host:e===t.slot,mode:this.mode,diff:this.diff,rounds:this.rounds,playing:this.top!=="lobby"}}broadcastLobby(){for(const t of this.session.players)t.conn&&this.net.send(t.conn,this.lobbyMsg(t))}addMouse(){this.top!=="lobby"||this.session.players.some(e=>e.kind==="mouse")||!this.session.add("mouse","mouse","Myš",-1,"R",null)||(this.sound.play("join"),this.renderLobby(),this.broadcastLobby())}removePlayer(t){const e=this.session.bySlot(t);if(!(!e||this.top!=="lobby")){if(e.conn){this.net.send(e.conn,{t:"full"});const n=e.conn;setTimeout(()=>n.close(),300)}this.session.remove(t),this.renderLobby(),this.broadcastLobby()}}toggleSound(){this.sound.unlock(),this.sound.setMuted(!this.sound.muted),this.sound.muted||this.music.play("molo"),this.renderLobby()}netStatus(t,e){const n=t==="ready"?"Připraveno — čekám na telefony":t==="connecting"?"Připojuji se k serveru…":e??"Chyba spojení";this.lobby.setStatus(t,n)}padUrl(t){const e=new URL("/mece/pad",location.origin);e.search="",e.hash="",e.searchParams.set("r",t);const n=pf();return n&&e.searchParams.set("peer",n),e.toString()}shortUrl(){return`${location.host}/mece/pad`}lanCheck(){const t=location.hostname;t==="localhost"||t==="127.0.0.1"||t==="[::1]"?this.lobby.setLanWarning("Hra běží jako „localhost“ — telefon se k ní nedostane. Otevři ji na PC přes síťovou adresu (např. https://192.168.…:5173), kterou vypíše npm run dev:https."):location.protocol!=="https:"&&this.lobby.setLanWarning("Hra běží přes http — telefony pak neposílají natočení (jen záložní míření prstem). Použij https: Vercel nebo npm run dev:https.")}onMessage(t,e){if(e.t==="hello")return this.onHello(t,e);const n=this.session.byConn(t);if(n)switch(n.lastSeen=performance.now(),e.t){case"m":n.sword instanceof Gd&&n.sword.sample(e.q,!!e.g,Number(e.ts)||0,e.k),n.sensor=e.k;break;case"cal":n.sword.calibrate();break;case"me":typeof e.name=="string"&&(n.name=Pl(e.name)||n.name),(e.hand==="L"||e.hand==="R")&&(n.hand=e.hand),typeof e.char=="number"&&this.top==="lobby"&&(n.char=this.session.freeChar(e.char,n.slot)===e.char?e.char:n.char),this.renderLobby(),this.broadcastLobby();break;case"cmd":this.onCmd(n,e);break;case"ping":this.net.send(t,{t:"pong",ts:e.ts});break}}onHello(t,e){const n=String(e.cid||"").slice(0,64)||Math.random().toString(36).slice(2);let i=this.session.byCid(n);if(i){if(i.conn&&i.conn!==t){const r=i.conn;setTimeout(()=>r.close(),100)}i.conn=t,i.lastSeen=performance.now()}else{if(this.session.full||this.top!=="lobby"){this.net.send(t,{t:"full"}),setTimeout(()=>t.close(),600);return}i=this.session.add("pad",n,Pl(e.name),Number(e.char),e.hand,t),this.sound.play("join")}this.net.send(t,{t:"welcome",slot:i.slot,v:mf}),this.net.send(t,this.lobbyMsg(i)),i.hudKey="",this.top==="results"&&this.lastResults&&this.net.send(t,{t:"results",...this.lastResults,you:i.slot}),this.renderLobby(),this.broadcastLobby()}onClosed(t){const e=this.session.byConn(t);e&&(e.conn===t&&(e.conn=null),e.motion===t&&(e.motion=null),this.renderLobby(),this.broadcastLobby())}onCmd(t,e){const n=this.session.hostSlot();if(!(n>=0&&n!==t.slot))switch(e.c){case"start":this.start();break;case"mode":this.setMode(Number(e.v)||0);break;case"diff":this.setDiff(Number(e.v)||0);break;case"rounds":this.setRounds(Number(e.v)||0);break;case"next":this.top==="results"&&this.again();break;case"lobby":this.top==="results"&&this.toLobby();break;case"pause":this.top==="play"&&this.setPaused(!this.paused);break;case"restart":this.paused&&this.again();break;case"quit":(this.paused||this.top==="results")&&this.toLobby();break}}entrants(){return this.session.players.filter(t=>this.session.online(t)).map(t=>({slot:t.slot,name:t.name,char:Wn[t.char],hand:t.hand,ctl:t.sword}))}start(){if(this.top!=="lobby")return;const t=this.entrants();if(!t.length){this.hud.show(!0),this.hud.big("Nikdo nehraje","Připoj telefon (QR kód) nebo přidej hráče s myší klávesou M",2600);return}this.sound.unlock(),this.demo?.dispose(),this.demo=null,this.voicesOff();const e=Mi[this.mode].id;e==="duel"?this.act=new Oo(this.ctx,t,{diff:this.diff,roundsToWin:sr[this.rounds]}):e==="slice"?this.act=new Ou(this.ctx,t):this.act=new Bu(this.ctx,t[0]),this.spectators.setup(this.act.fighters.map(n=>n.char?.id??-1));for(const n of this.rigs)n.snap=!0;this.top="play",this.paused=!1,this.lobby.show(!1),this.results.hide(),this.hud.show(!0),this.hud.split(this.act.fighters.filter(n=>n.slot>=0).length>1&&e!=="train"),this.sound.muted||this.music.play("molo"),this.broadcastLobby();for(const n of this.session.players)n.hudKey=""}again(){this.top!=="lobby"&&(this.act?.dispose(),this.act=null,this.top="lobby",this.pause.show(!1),this.start())}toLobby(){this.act?.dispose(),this.act=null,this.voicesOff(),this.top="lobby",this.paused=!1,this.pause.show(!1),this.results.hide(),this.hud.show(!1),this.hud.hideBig(),this.lobby.show(!0),this.startDemo(),this.renderLobby(),this.broadcastLobby();for(const t of this.session.players)t.hudKey=""}setPaused(t){this.top==="play"&&(this.paused=t,this.pause.show(t))}showResults(){if(!this.act)return;const t=this.act.results();this.lastResults=t,this.top="results",this.results.show(t.title,t.rows),this.hud.prompt(0,null),this.hud.prompt(1,null);for(const e of this.session.players)e.conn&&this.net.send(e.conn,{t:"results",...t,you:e.slot});for(const e of this.session.players)e.hudKey=""}pop(t,e,n=""){for(const i of this.vps){const r=this.view.project(e,i);!r.behind&&r.x>i.x&&r.x<i.x+i.w&&this.hud.pop(t,r.x,r.y,n)}}onKey(t,e){if(this.paused){t==="Escape"?this.setPaused(!1):t==="KeyR"?this.again():t==="KeyQ"&&this.toLobby();return}this.top==="lobby"?t==="KeyM"?this.addMouse():t==="Digit1"||t==="Digit2"||t==="Digit3"?this.setMode(Number(t.slice(5))-1):t==="Enter"?this.start():t==="KeyF"&&document.documentElement.requestFullscreen?.().catch(()=>{}):this.top==="play"?t==="Escape"?this.setPaused(!0):t==="Enter"&&this.act?.skip():this.top==="results"&&(t==="Enter"?this.again():t==="Escape"&&this.toLobby())}updateMouse(){for(const t of this.session.players)t.sword instanceof ba&&(t.sword.setPointer(this.input.mx,this.input.my),t.sword.guard=this.input.guard)}voicesOff(){for(const t of this.voices.values())t.stop();this.voices.clear()}updateVoices(t,e){if(this.sound.ready)for(const n of t){let i=this.voices.get(n);if(!i){const o=this.sound.swing();if(!o)continue;i=o,this.voices.set(n,i)}const a=e.length>1?e.indexOf(n)===0?-.5:e.indexOf(n)===1?.5:0:0;i.set(n.speedSm,a,this.demo?.25:1)}}frame(t){requestAnimationFrame(o=>this.frame(o));const e=Math.min(.05,Math.max(0,(t-this.last)/1e3));this.last=t;const n=performance.now();this.updateMouse();const i=this.act??this.demo;let r=[null];if(i){this.paused||i.step(e*i.timeScale,n),r=i.cameras(this.rigs,e).owners;const o=i.fighters[0]?.body.head;o&&this.spectators.setLook(o),this.updateVoices(i.fighters,r)}this.spectators.update(e),this.arena.update(e),this.fx.update(this.paused?0:e*(i?.timeScale??1));const a=this.rigs.slice(0,Math.max(1,r.length));this.vps=this.view.layout(a,r),this.fx.setViewportHeight(this.vps[0].h),this.view.render(this.vps,a,i?.fighters??[],e),this.act&&(this.act.hud(this.vps),this.act.finished&&this.top==="play"&&this.showResults()),t-this.padAt>160&&(this.padAt=t,this.pushPads()),t-this.tick>1e3&&(this.tick=t,this.refreshOnline())}pushPads(){const t=this.session.hostSlot();for(const e of this.session.players){if(!e.conn)continue;let n;const i={mode:Mi[this.mode].id,pause:this.paused,host:e.slot===t};this.top==="lobby"?n={...i,phase:"lobby",msg:"",ready:!1,round:0,score:[0,0]}:this.top==="results"?n={...i,phase:"results",msg:"",ready:!0,round:0,score:[0,0]}:this.act&&this.act.fighters.some(a=>a.slot===e.slot)?n={...i,...this.act.pad(e.slot)}:n={...i,phase:"point",msg:"Hraje se na PC — sleduj obrazovku",ready:!1,round:0,score:[0,0]};const r=JSON.stringify(n);r===e.hudKey&&performance.now()-e.hudAt<2e3||(e.hudKey=r,e.hudAt=performance.now(),this.net.send(e.conn,{t:"hud",...n}))}}refreshOnline(){const t=performance.now();if(this.top==="lobby")for(const n of[...this.session.players])n.kind==="pad"&&!this.session.online(n,t)&&t-n.lastSeen>9e4&&this.session.remove(n.slot);const e=this.session.players.map(n=>`${n.slot}:${this.session.online(n,t)}:${n.sensor}`).join(",");e!==this.onlineKey&&(this.onlineKey=e,this.top==="lobby"&&this.renderLobby(),this.broadcastLobby())}debugHooks(){window.__mc={state:()=>({top:this.top,code:this.net.code,ready:this.net.ready,padUrl:this.net.code?this.padUrl(this.net.code):null,players:this.session.lobbyPlayers(),mode:Mi[this.mode].id,paused:this.paused,act:this.act&&{kind:this.act.kind,finished:this.act.finished,pad:this.session.players.map(t=>this.act.pad(t.slot)),fighters:this.act.fighters.map(t=>({name:t.name,slot:t.slot,z:Math.round(t.z*100)/100,state:t.state,speed:Math.round(t.speedSm*10)/10,guard:t.guarding,hits:t.stats.hits,blocks:t.stats.blocks,calibrated:t.ctl.calibrated,dir:t.dirL.toArray().map(e=>Math.round(e*100)/100)})),duel:this.act instanceof Oo&&{phase:this.act.duel.phase,round:this.act.duel.round,score:this.act.duel.score,ready:this.act.duel.ready},slice:this.act instanceof Ou&&this.act.debug(),train:this.act instanceof Bu&&this.act.debug()}}),start:()=>this.start(),mode:t=>this.setMode(t),skip:()=>this.act?.skip(),lobby:()=>this.toLobby(),knock:(t,e)=>{const n=this.act?.fighters[t];n&&(n.vz+=(n.side===0?1:-1)*e)}}}}new ZM;export{ly as $,re as A,Pe as B,Lt as C,ym as D,iy as E,cy as F,wt as G,ry as H,sy as I,pd as J,ay as K,tr as L,oy as M,rr as N,_e as O,uy as P,Kt as Q,Xo as R,ze as S,jM as T,Xp as U,It as V,ge as W,Je as X,ny as Y,bd as Z,fd as _,ey as a,kp as a0,sa as a1,bl as a2,Ue as a3,yd as a4,jl as a5,tc as a6,Zt as a7,Si as a8,js as a9,qn as aa,Yn as ab,ty as b,dy as c,aa as d,hy as e,Wt as f,A as g,ih as h,gm as i,fy as j,Ye as k,Dp as l,ca as m,li as n,Ra as o,zf as p,qe as q,Ne as r,qo as s,kn as t,Wp as u,$n as v,Gp as w,Jp as x,yn as y,$s as z};
