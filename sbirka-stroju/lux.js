(()=>{var $a="160",gi={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},xi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},nu=0,Mc=1,iu=2;var Jl=1,Ja=2,Tn=3,qn=0,Ie=1,$e=2;var Wn=0,Wi=1,Rr=2,bc=3,Sc=4,su=5,ai=100,ru=101,ou=102,Ec=103,wc=104,au=200,cu=201,lu=202,hu=203,aa=204,ca=205,uu=206,fu=207,du=208,pu=209,mu=210,gu=211,xu=212,_u=213,yu=214,vu=0,Mu=1,bu=2,Cr=3,Su=4,Eu=5,wu=6,Tu=7,Kl=0,Au=1,Ru=2,Xn=0,Cu=1,Pu=2,Iu=3,Ka=4,Lu=5,Du=6;var jl=300,qi=301,Zi=302,la=303,ha=304,co=306,Zn=1e3,on=1001,ua=1002,Be=1003,Tc=1004;var Ao=1005;var Ze=1006,Uu=1007;var As=1008;var Yn=1009,Nu=1010,Ou=1011,ja=1012,Ql=1013,Vn=1014,Gn=1015,Rs=1016,th=1017,eh=1018,li=1020,Fu=1021,an=1023,Bu=1024,zu=1025,hi=1026,$i=1027,ku=1028,nh=1029,Hu=1030,ih=1031,sh=1033,Ro=33776,Co=33777,Po=33778,Io=33779,Ac=35840,Rc=35841,Cc=35842,Pc=35843,rh=36196,Ic=37492,Lc=37496,Dc=37808,Uc=37809,Nc=37810,Oc=37811,Fc=37812,Bc=37813,zc=37814,kc=37815,Hc=37816,Vc=37817,Gc=37818,Wc=37819,Xc=37820,Yc=37821,Lo=36492,qc=36494,Zc=36495,Vu=36283,$c=36284,Jc=36285,Kc=36286;var Pr=2300,Ir=2301,Do=2302,jc=2400,Qc=2401,tl=2402;var oh=3e3,ui=3001,Gu=3200,Wu=3201,ah=0,Xu=1,ke="",ce="srgb",Rn="srgb-linear",Qa="display-p3",lo="display-p3-linear",Lr="linear",ae="srgb",Dr="rec709",Ur="p3";var Si=7680;var el=519,Yu=512,qu=513,Zu=514,ch=515,$u=516,Ju=517,Ku=518,ju=519,nl=35044;var il="300 es",fa=1035,An=2e3,Nr=2001,_n=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sl=1234567,vs=Math.PI/180,Ji=180/Math.PI;function _i(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]).toLowerCase()}function _e(n,t,e){return Math.max(t,Math.min(e,n))}function tc(n,t){return(n%t+t)%t}function Qu(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function tf(n,t,e){return n!==t?(e-n)/(t-n):0}function Ms(n,t,e){return(1-e)*n+e*t}function ef(n,t,e,i){return Ms(n,t,1-Math.exp(-e*i))}function nf(n,t=1){return t-Math.abs(tc(n,t*2)-t)}function sf(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function rf(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function of(n,t){return n+Math.floor(Math.random()*(t-n+1))}function af(n,t){return n+Math.random()*(t-n)}function cf(n){return n*(.5-Math.random())}function lf(n){n!==void 0&&(sl=n);let t=sl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hf(n){return n*vs}function uf(n){return n*Ji}function da(n){return(n&n-1)===0&&n!==0}function ff(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Or(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function df(n,t,e,i,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),d=a((t-i)/2),f=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*h,c*u,c*d,o*l);break;case"YZY":n.set(c*d,o*h,c*u,o*l);break;case"ZXZ":n.set(c*u,c*d,o*h,o*l);break;case"XZX":n.set(o*h,c*g,c*f,o*l);break;case"YXY":n.set(c*f,o*h,c*g,o*l);break;case"ZYZ":n.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function zi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Oe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var lh={DEG2RAD:vs,RAD2DEG:Ji,generateUUID:_i,clamp:_e,euclideanModulo:tc,mapLinear:Qu,inverseLerp:tf,lerp:Ms,damp:ef,pingpong:nf,smoothstep:sf,smootherstep:rf,randInt:of,randFloat:af,randFloatSpread:cf,seededRandom:lf,degToRad:hf,radToDeg:uf,isPowerOfTwo:da,ceilPowerOfTwo:ff,floorPowerOfTwo:Or,setQuaternionFromProperEuler:df,normalize:Oe,denormalize:zi},j=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(_e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Zt=class n{constructor(t,e,i,s,r,a,o,c,l){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l)}set(t,e,i,s,r,a,o,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],x=s[0],p=s[3],m=s[6],M=s[1],_=s[4],y=s[7],P=s[2],T=s[5],A=s[8];return r[0]=a*x+o*M+c*P,r[3]=a*p+o*_+c*T,r[6]=a*m+o*y+c*A,r[1]=l*x+h*M+u*P,r[4]=l*p+h*_+u*T,r[7]=l*m+h*y+u*A,r[2]=d*x+f*M+g*P,r[5]=d*p+f*_+g*T,r[8]=d*m+f*y+g*A,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=e*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=u*x,t[1]=(s*l-h*i)*x,t[2]=(o*i-s*a)*x,t[3]=d*x,t[4]=(h*e-s*c)*x,t[5]=(s*r-o*e)*x,t[6]=f*x,t[7]=(i*c-l*e)*x,t[8]=(a*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Uo.makeScale(t,e)),this}rotate(t){return this.premultiply(Uo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Uo=new Zt;function hh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Fr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function pf(){let n=Fr("canvas");return n.style.display="block",n}var rl={};function bs(n){n in rl||(rl[n]=!0,console.warn(n))}var ol=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),al=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),nr={[Rn]:{transfer:Lr,primaries:Dr,toReference:n=>n,fromReference:n=>n},[ce]:{transfer:ae,primaries:Dr,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[lo]:{transfer:Lr,primaries:Ur,toReference:n=>n.applyMatrix3(al),fromReference:n=>n.applyMatrix3(ol)},[Qa]:{transfer:ae,primaries:Ur,toReference:n=>n.convertSRGBToLinear().applyMatrix3(al),fromReference:n=>n.applyMatrix3(ol).convertLinearToSRGB()}},mf=new Set([Rn,lo]),ie={enabled:!0,_workingColorSpace:Rn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!mf.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;let i=nr[t].toReference,s=nr[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return nr[n].primaries},getTransfer:function(n){return n===ke?Lr:nr[n].transfer}};function Xi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function No(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Ei,Br=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ei===void 0&&(Ei=Fr("canvas")),Ei.width=t.width,Ei.height=t.height;let i=Ei.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ei}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Fr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xi(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Xi(e[i]/255)*255):e[i]=Xi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},gf=0,zr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=_i(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Oo(s[a].image)):r.push(Oo(s[a]))}else r=Oo(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function Oo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Br.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var xf=0,Je=class n extends _n{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=on,s=on,r=Ze,a=As,o=an,c=Yn,l=n.DEFAULT_ANISOTROPY,h=ke){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=_i(),this.name="",this.source=new zr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new j(0,0),this.repeat=new j(1,1),this.center=new j(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(bs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ui?ce:ke),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==jl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zn:t.x=t.x-Math.floor(t.x);break;case on:t.x=t.x<0?0:1;break;case ua:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zn:t.y=t.y-Math.floor(t.y);break;case on:t.y=t.y<0?0:1;break;case ua:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return bs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ce?ui:oh}set encoding(t){bs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ui?ce:ke}};Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=jl;Je.DEFAULT_ANISOTROPY=1;var ue=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(l+1)/2,y=(f+1)/2,P=(m+1)/2,T=(h+d)/4,A=(u+x)/4,F=(g+p)/4;return _>y&&_>P?_<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(_),s=T/i,r=A/i):y>P?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=F/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=A/r,s=F/r),this.set(i,s,r,e),this}let M=Math.sqrt((p-g)*(p-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(u-x)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},pa=class extends _n{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);let s={width:t,height:e,depth:1};i.encoding!==void 0&&(bs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===ui?ce:ke),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ze,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Je(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new zr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cn=class extends pa{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},kr=class extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ma=class extends Je{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Be,this.minFilter=Be,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var cn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],g=r[a+2],x=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=x;return}if(u!==x||c!==d||l!==f||h!==g){let p=1-o,m=c*d+l*f+h*g+u*x,M=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){let P=Math.sqrt(_),T=Math.atan2(P,m*M);p=Math.sin(p*T)/P,o=Math.sin(o*T)/P}let y=o*M;if(c=c*p+d*y,l=l*p+f*y,h=h*p+g*y,u=u*p+x*y,p===1-o){let P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){let o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){let f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){let f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(cl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(cl.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Fo.copy(this).projectOnVector(t),this.sub(Fo)}reflect(t){return this.sub(Fo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(_e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Fo=new R,cl=new cn,Pn=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(en.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(en.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=en.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,en):en.fromBufferAttribute(r,a),en.applyMatrix4(t.matrixWorld),this.expandByPoint(en);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ir.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ir.copy(i.boundingBox)),ir.applyMatrix4(t.matrixWorld),this.union(ir)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,en),en.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ms),sr.subVectors(this.max,ms),wi.subVectors(t.a,ms),Ti.subVectors(t.b,ms),Ai.subVectors(t.c,ms),Fn.subVectors(Ti,wi),Bn.subVectors(Ai,Ti),ni.subVectors(wi,Ai);let e=[0,-Fn.z,Fn.y,0,-Bn.z,Bn.y,0,-ni.z,ni.y,Fn.z,0,-Fn.x,Bn.z,0,-Bn.x,ni.z,0,-ni.x,-Fn.y,Fn.x,0,-Bn.y,Bn.x,0,-ni.y,ni.x,0];return!Bo(e,wi,Ti,Ai,sr)||(e=[1,0,0,0,1,0,0,0,1],!Bo(e,wi,Ti,Ai,sr))?!1:(rr.crossVectors(Fn,Bn),e=[rr.x,rr.y,rr.z],Bo(e,wi,Ti,Ai,sr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,en).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(en).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Mn=[new R,new R,new R,new R,new R,new R,new R,new R],en=new R,ir=new Pn,wi=new R,Ti=new R,Ai=new R,Fn=new R,Bn=new R,ni=new R,ms=new R,sr=new R,rr=new R,ii=new R;function Bo(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ii.fromArray(n,r);let o=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),c=t.dot(ii),l=e.dot(ii),h=i.dot(ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var _f=new Pn,gs=new R,zo=new R,Cs=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):_f.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);let e=gs.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(gs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(zo)),this.expandByPoint(gs.copy(t.center).sub(zo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},bn=new R,ko=new R,or=new R,zn=new R,Ho=new R,ar=new R,Vo=new R,Ki=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ko.copy(t).add(e).multiplyScalar(.5),or.copy(e).sub(t).normalize(),zn.copy(this.origin).sub(ko);let r=t.distanceTo(e)*.5,a=-this.direction.dot(or),o=zn.dot(this.direction),c=-zn.dot(or),l=zn.lengthSq(),h=Math.abs(1-a*a),u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ko).addScaledVector(or,d),f}intersectSphere(t,e){bn.subVectors(t.center,this.origin);let i=bn.dot(this.direction),s=bn.dot(bn)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,i,s,r){Ho.subVectors(e,t),ar.subVectors(i,t),Vo.crossVectors(Ho,ar);let a=this.direction.dot(Vo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zn.subVectors(this.origin,t);let c=o*this.direction.dot(ar.crossVectors(zn,ar));if(c<0)return null;let l=o*this.direction.dot(Ho.cross(zn));if(l<0||c+l>a)return null;let h=-o*zn.dot(Vo);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},pe=class n{constructor(t,e,i,s,r,a,o,c,l,h,u,d,f,g,x,p){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,c,l,h,u,d,f,g,x,p)}set(t,e,i,s,r,a,o,c,l,h,u,d,f,g,x,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),a=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,f=a*u,g=o*h,x=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-x*l,e[9]=-o*c,e[2]=x-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){let d=c*h,f=c*u,g=l*h,x=l*u;e[0]=d+x*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=x+d*o,e[10]=a*c}else if(t.order==="ZXY"){let d=c*h,f=c*u,g=l*h,x=l*u;e[0]=d-x*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=x-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let d=a*h,f=a*u,g=o*h,x=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+x,e[1]=c*u,e[5]=x*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let d=a*c,f=a*l,g=o*c,x=o*l;e[0]=c*h,e[4]=x-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-x*u}else if(t.order==="XZY"){let d=a*c,f=a*l,g=o*c,x=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+x,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(yf,t,vf)}lookAt(t,e,i){let s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),kn.crossVectors(i,We),kn.lengthSq()===0&&(Math.abs(i.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),kn.crossVectors(i,We)),kn.normalize(),cr.crossVectors(We,kn),s[0]=kn.x,s[4]=cr.x,s[8]=We.x,s[1]=kn.y,s[5]=cr.y,s[9]=We.y,s[2]=kn.z,s[6]=cr.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],x=i[6],p=i[10],m=i[14],M=i[3],_=i[7],y=i[11],P=i[15],T=s[0],A=s[4],F=s[8],b=s[12],w=s[1],N=s[5],X=s[9],Q=s[13],L=s[2],O=s[6],V=s[10],K=s[14],q=s[3],Y=s[7],nt=s[11],tt=s[15];return r[0]=a*T+o*w+c*L+l*q,r[4]=a*A+o*N+c*O+l*Y,r[8]=a*F+o*X+c*V+l*nt,r[12]=a*b+o*Q+c*K+l*tt,r[1]=h*T+u*w+d*L+f*q,r[5]=h*A+u*N+d*O+f*Y,r[9]=h*F+u*X+d*V+f*nt,r[13]=h*b+u*Q+d*K+f*tt,r[2]=g*T+x*w+p*L+m*q,r[6]=g*A+x*N+p*O+m*Y,r[10]=g*F+x*X+p*V+m*nt,r[14]=g*b+x*Q+p*K+m*tt,r[3]=M*T+_*w+y*L+P*q,r[7]=M*A+_*N+y*O+P*Y,r[11]=M*F+_*X+y*V+P*nt,r[15]=M*b+_*Q+y*K+P*tt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],x=t[7],p=t[11],m=t[15];return g*(+r*c*u-s*l*u-r*o*d+i*l*d+s*o*f-i*c*f)+x*(+e*c*f-e*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+p*(+e*l*u-e*o*f-r*a*u+i*a*f+r*o*h-i*l*h)+m*(-s*o*h-e*c*u+e*o*d+s*a*u-i*a*d+i*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],x=t[13],p=t[14],m=t[15],M=u*p*l-x*d*l+x*c*f-o*p*f-u*c*m+o*d*m,_=g*d*l-h*p*l-g*c*f+a*p*f+h*c*m-a*d*m,y=h*x*l-g*u*l+g*o*f-a*x*f-h*o*m+a*u*m,P=g*u*c-h*x*c-g*o*d+a*x*d+h*o*p-a*u*p,T=e*M+i*_+s*y+r*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/T;return t[0]=M*A,t[1]=(x*d*r-u*p*r-x*s*f+i*p*f+u*s*m-i*d*m)*A,t[2]=(o*p*r-x*c*r+x*s*l-i*p*l-o*s*m+i*c*m)*A,t[3]=(u*c*r-o*d*r-u*s*l+i*d*l+o*s*f-i*c*f)*A,t[4]=_*A,t[5]=(h*p*r-g*d*r+g*s*f-e*p*f-h*s*m+e*d*m)*A,t[6]=(g*c*r-a*p*r-g*s*l+e*p*l+a*s*m-e*c*m)*A,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*f+e*c*f)*A,t[8]=y*A,t[9]=(g*u*r-h*x*r-g*i*f+e*x*f+h*i*m-e*u*m)*A,t[10]=(a*x*r-g*o*r+g*i*l-e*x*l-a*i*m+e*o*m)*A,t[11]=(h*o*r-a*u*r-h*i*l+e*u*l+a*i*f-e*o*f)*A,t[12]=P*A,t[13]=(h*x*s-g*u*s+g*i*d-e*x*d-h*i*p+e*u*p)*A,t[14]=(g*o*s-a*x*s-g*i*c+e*x*c+a*i*p-e*o*p)*A,t[15]=(a*u*s-h*o*s+h*i*c-e*u*c-a*i*d+e*o*d)*A,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,x=a*h,p=a*u,m=o*u,M=c*l,_=c*h,y=c*u,P=i.x,T=i.y,A=i.z;return s[0]=(1-(x+m))*P,s[1]=(f+y)*P,s[2]=(g-_)*P,s[3]=0,s[4]=(f-y)*T,s[5]=(1-(d+m))*T,s[6]=(p+M)*T,s[7]=0,s[8]=(g+_)*A,s[9]=(p-M)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=Ri.set(s[0],s[1],s[2]).length(),a=Ri.set(s[4],s[5],s[6]).length(),o=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],nn.copy(this);let l=1/r,h=1/a,u=1/o;return nn.elements[0]*=l,nn.elements[1]*=l,nn.elements[2]*=l,nn.elements[4]*=h,nn.elements[5]*=h,nn.elements[6]*=h,nn.elements[8]*=u,nn.elements[9]*=u,nn.elements[10]*=u,e.setFromRotationMatrix(nn),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=An){let c=this.elements,l=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s),f,g;if(o===An)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Nr)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=An){let c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(a-r),d=(e+t)*l,f=(i+s)*h,g,x;if(o===An)g=(a+r)*u,x=-2*u;else if(o===Nr)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Ri=new R,nn=new pe,yf=new R(0,0,0),vf=new R(1,1,1),kn=new R,cr=new R,We=new R,ll=new pe,hl=new cn,Hr=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(_e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-_e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(_e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ll.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ll,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hl.setFromEuler(this),this.setFromQuaternion(hl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Hr.DEFAULT_ORDER="XYZ";var Ps=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Mf=0,ul=new R,Ci=new cn,Sn=new pe,lr=new R,xs=new R,bf=new R,Sf=new cn,fl=new R(1,0,0),dl=new R(0,1,0),pl=new R(0,0,1),Ef={type:"added"},wf={type:"removed"},Te=class n extends _n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mf++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new R,e=new Hr,i=new cn,s=new R(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pe},normalMatrix:{value:new Zt}}),this.matrix=new pe,this.matrixWorld=new pe,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ps,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(fl,t)}rotateY(t){return this.rotateOnAxis(dl,t)}rotateZ(t){return this.rotateOnAxis(pl,t)}translateOnAxis(t,e){return ul.copy(t).applyQuaternion(this.quaternion),this.position.add(ul.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fl,t)}translateY(t){return this.translateOnAxis(dl,t)}translateZ(t){return this.translateOnAxis(pl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?lr.copy(t):lr.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(xs,lr,this.up):Sn.lookAt(lr,xs,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(Sn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Ef)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(wf)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,t,bf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,Sf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++){let r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Te.DEFAULT_UP=new R(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var sn=new R,En=new R,Go=new R,wn=new R,Pi=new R,Ii=new R,ml=new R,Wo=new R,Xo=new R,Yo=new R,hr=!1,ki=class n{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),sn.subVectors(t,e),s.cross(sn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){sn.subVectors(s,e),En.subVectors(i,e),Go.subVectors(t,e);let a=sn.dot(sn),o=sn.dot(En),c=sn.dot(Go),l=En.dot(En),h=En.dot(Go),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getUV(t,e,i,s,r,a,o,c){return hr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),hr=!0),this.getInterpolation(t,e,i,s,r,a,o,c)}static getInterpolation(t,e,i,s,r,a,o,c){return this.getBarycoord(t,e,i,s,wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,wn.x),c.addScaledVector(a,wn.y),c.addScaledVector(o,wn.z),c)}static isFrontFacing(t,e,i,s){return sn.subVectors(i,e),En.subVectors(t,e),sn.cross(En).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return sn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),sn.cross(En).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return hr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),hr=!0),n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,a,o;Pi.subVectors(s,i),Ii.subVectors(r,i),Wo.subVectors(t,i);let c=Pi.dot(Wo),l=Ii.dot(Wo);if(c<=0&&l<=0)return e.copy(i);Xo.subVectors(t,s);let h=Pi.dot(Xo),u=Ii.dot(Xo);if(h>=0&&u<=h)return e.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Pi,a);Yo.subVectors(t,r);let f=Pi.dot(Yo),g=Ii.dot(Yo);if(g>=0&&f<=g)return e.copy(r);let x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(i).addScaledVector(Ii,o);let p=h*g-f*u;if(p<=0&&u-h>=0&&f-g>=0)return ml.subVectors(r,s),o=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(ml,o);let m=1/(p+x+d);return a=x*m,o=d*m,e.copy(i).addScaledVector(Pi,a).addScaledVector(Ii,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},ur={h:0,s:0,l:0};function qo(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var $t=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=i,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ie.workingColorSpace){if(t=tc(t,1),e=_e(e,0,1),i=_e(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=qo(a,r,t+1/3),this.g=qo(a,r,t),this.b=qo(a,r,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=ce){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ce){let i=uh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Xi(t.r),this.g=Xi(t.g),this.b=Xi(t.b),this}copyLinearToSRGB(t){return this.r=No(t.r),this.g=No(t.g),this.b=No(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ce){return ie.fromWorkingColorSpace(Pe.copy(this),t),Math.round(_e(Pe.r*255,0,255))*65536+Math.round(_e(Pe.g*255,0,255))*256+Math.round(_e(Pe.b*255,0,255))}getHexString(t=ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(Pe.copy(this),e);let i=Pe.r,s=Pe.g,r=Pe.b,a=Math.max(i,s,r),o=Math.min(i,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=ce){ie.fromWorkingColorSpace(Pe.copy(this),t);let e=Pe.r,i=Pe.g,s=Pe.b;return t!==ce?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Hn),this.setHSL(Hn.h+t,Hn.s+e,Hn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Hn),t.getHSL(ur);let i=Ms(Hn.h,ur.h,e),s=Ms(Hn.s,ur.s,e),r=Ms(Hn.l,ur.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pe=new $t;$t.NAMES=uh;var Tf=0,fi=class extends _n{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=_i(),this.name="",this.type="Material",this.blending=Wi,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=aa,this.blendDst=ca,this.blendEquation=ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $t(0,0,0),this.blendAlpha=0,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Si,this.stencilZFail=Si,this.stencilZPass=Si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(i.blending=this.blending),this.side!==qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==aa&&(i.blendSrc=this.blendSrc),this.blendDst!==ca&&(i.blendDst=this.blendDst),this.blendEquation!==ai&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Cr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Si&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Si&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Si&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},In=class extends fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Kl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var xe=new R,fr=new j,Le=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=nl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fr.fromBufferAttribute(this,e),fr.applyMatrix3(t),this.setXY(e,fr.x,fr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Oe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),i=Oe(i,this.array),s=Oe(s,this.array),r=Oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nl&&(t.usage=this.usage),t}};var Vr=class extends Le{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Gr=class extends Le{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var ne=class extends Le{constructor(t,e,i){super(new Float32Array(t),e,i)}};var Af=0,qe=new pe,Zo=new Te,Li=new R,Xe=new Pn,_s=new Pn,Se=new R,De=class n extends _n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(hh(t)?Gr:Vr)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Zt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qe.makeRotationFromQuaternion(t),this.applyMatrix4(qe),this}rotateX(t){return qe.makeRotationX(t),this.applyMatrix4(qe),this}rotateY(t){return qe.makeRotationY(t),this.applyMatrix4(qe),this}rotateZ(t){return qe.makeRotationZ(t),this.applyMatrix4(qe),this}translate(t,e,i){return qe.makeTranslation(t,e,i),this.applyMatrix4(qe),this}scale(t,e,i){return qe.makeScale(t,e,i),this.applyMatrix4(qe),this}lookAt(t){return Zo.lookAt(t),Zo.updateMatrix(),this.applyMatrix4(Zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Li).negate(),this.translate(Li.x,Li.y,Li.z),this}setFromPoints(t){let e=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ne(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];Xe.setFromBufferAttribute(r),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cs);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(t){let i=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];_s.setFromBufferAttribute(o),this.morphTargetsRelative?(Se.addVectors(Xe.min,_s.min),Xe.expandByPoint(Se),Se.addVectors(Xe.max,_s.max),Xe.expandByPoint(Se)):(Xe.expandByPoint(_s.min),Xe.expandByPoint(_s.max))}Xe.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Se.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Se));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Se.fromBufferAttribute(o,l),c&&(Li.fromBufferAttribute(t,l),Se.add(Li)),s=Math.max(s,i.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Le(new Float32Array(4*o),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let w=0;w<o;w++)l[w]=new R,h[w]=new R;let u=new R,d=new R,f=new R,g=new j,x=new j,p=new j,m=new R,M=new R;function _(w,N,X){u.fromArray(s,w*3),d.fromArray(s,N*3),f.fromArray(s,X*3),g.fromArray(a,w*2),x.fromArray(a,N*2),p.fromArray(a,X*2),d.sub(u),f.sub(u),x.sub(g),p.sub(g);let Q=1/(x.x*p.y-p.x*x.y);isFinite(Q)&&(m.copy(d).multiplyScalar(p.y).addScaledVector(f,-x.y).multiplyScalar(Q),M.copy(f).multiplyScalar(x.x).addScaledVector(d,-p.x).multiplyScalar(Q),l[w].add(m),l[N].add(m),l[X].add(m),h[w].add(M),h[N].add(M),h[X].add(M))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let w=0,N=y.length;w<N;++w){let X=y[w],Q=X.start,L=X.count;for(let O=Q,V=Q+L;O<V;O+=3)_(i[O+0],i[O+1],i[O+2])}let P=new R,T=new R,A=new R,F=new R;function b(w){A.fromArray(r,w*3),F.copy(A);let N=l[w];P.copy(N),P.sub(A.multiplyScalar(A.dot(N))).normalize(),T.crossVectors(F,N);let Q=T.dot(h[w])<0?-1:1;c[w*4]=P.x,c[w*4+1]=P.y,c[w*4+2]=P.z,c[w*4+3]=Q}for(let w=0,N=y.length;w<N;++w){let X=y[w],Q=X.start,L=X.count;for(let O=Q,V=Q+L;O<V;O+=3)b(i[O+0]),b(i[O+1]),b(i[O+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Le(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new R,r=new R,a=new R,o=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),x=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,p),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),f=0,g=0;for(let x=0,p=c.length;x<p;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let m=0;m<h;m++)d[g++]=l[f++]}return new Le(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,i);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let c in i){let l=i[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gl=new pe,si=new Ki,dr=new Cs,xl=new R,Di=new R,Ui=new R,Ni=new R,$o=new R,pr=new R,mr=new j,gr=new j,xr=new j,_l=new R,yl=new R,vl=new R,_r=new R,yr=new R,Jt=class extends Te{constructor(t=new De,e=new In){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){pr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&($o.fromBufferAttribute(u,t),a?pr.addScaledVector($o,h):pr.addScaledVector($o.sub(e),h))}e.add(pr)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),dr.copy(i.boundingSphere),dr.applyMatrix4(r),si.copy(t.ray).recast(t.near),!(dr.containsPoint(si.origin)===!1&&(si.intersectSphere(dr,xl)===null||si.origin.distanceToSquared(xl)>(t.far-t.near)**2))&&(gl.copy(r).invert(),si.copy(t.ray).applyMatrix4(gl),!(i.boundingBox!==null&&si.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,si)))}_computeIntersections(t,e,i){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let p=d[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),_=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,P=_;y<P;y+=3){let T=o.getX(y),A=o.getX(y+1),F=o.getX(y+2);s=vr(this,m,t,i,l,h,u,T,A,F),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){let M=o.getX(p),_=o.getX(p+1),y=o.getX(p+2);s=vr(this,a,t,i,l,h,u,M,_,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let p=d[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),_=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let y=M,P=_;y<P;y+=3){let T=y,A=y+1,F=y+2;s=vr(this,m,t,i,l,h,u,T,A,F),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){let M=p,_=p+1,y=p+2;s=vr(this,a,t,i,l,h,u,M,_,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Rf(n,t,e,i,s,r,a,o){let c;if(t.side===Ie?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,t.side===qn,o),c===null)return null;yr.copy(o),yr.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(yr);return l<e.near||l>e.far?null:{distance:l,point:yr.clone(),object:n}}function vr(n,t,e,i,s,r,a,o,c,l){n.getVertexPosition(o,Di),n.getVertexPosition(c,Ui),n.getVertexPosition(l,Ni);let h=Rf(n,t,e,i,Di,Ui,Ni,_r);if(h){s&&(mr.fromBufferAttribute(s,o),gr.fromBufferAttribute(s,c),xr.fromBufferAttribute(s,l),h.uv=ki.getInterpolation(_r,Di,Ui,Ni,mr,gr,xr,new j)),r&&(mr.fromBufferAttribute(r,o),gr.fromBufferAttribute(r,c),xr.fromBufferAttribute(r,l),h.uv1=ki.getInterpolation(_r,Di,Ui,Ni,mr,gr,xr,new j),h.uv2=h.uv1),a&&(_l.fromBufferAttribute(a,o),yl.fromBufferAttribute(a,c),vl.fromBufferAttribute(a,l),h.normal=ki.getInterpolation(_r,Di,Ui,Ni,_l,yl,vl,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new R,materialIndex:0};ki.getNormal(Di,Ui,Ni,u.normal),h.face=u}return h}var ze=class n extends De{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ne(l,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(u,2));function g(x,p,m,M,_,y,P,T,A,F,b){let w=y/A,N=P/F,X=y/2,Q=P/2,L=T/2,O=A+1,V=F+1,K=0,q=0,Y=new R;for(let nt=0;nt<V;nt++){let tt=nt*N-Q;for(let _t=0;_t<O;_t++){let W=_t*w-X;Y[x]=W*M,Y[p]=tt*_,Y[m]=L,l.push(Y.x,Y.y,Y.z),Y[x]=0,Y[p]=0,Y[m]=T>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(_t/A),u.push(1-nt/F),K+=1}}for(let nt=0;nt<F;nt++)for(let tt=0;tt<A;tt++){let _t=d+tt+O*nt,W=d+tt+O*(nt+1),ot=d+(tt+1)+O*(nt+1),vt=d+(tt+1)+O*nt;c.push(_t,W,vt),c.push(W,ot,vt),q+=6}o.addGroup(f,q,b),f+=q,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function ji(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Fe(n){let t={};for(let e=0;e<n.length;e++){let i=ji(n[e]);for(let s in i)t[s]=i[s]}return t}function Cf(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function fh(n){return n.getRenderTarget()===null?n.outputColorSpace:ie.workingColorSpace}var Pf={clone:ji,merge:Fe},If=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ln=class extends fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=If,this.fragmentShader=Lf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ji(t.uniforms),this.uniformsGroups=Cf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Wr=class extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pe,this.projectionMatrix=new pe,this.projectionMatrixInverse=new pe,this.coordinateSystem=An}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},we=class extends Wr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Ji*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(vs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ji*2*Math.atan(Math.tan(vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(vs*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Oi=-90,Fi=1,ga=class extends Te{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new we(Oi,Fi,t,e);s.layers=this.layers,this.add(s);let r=new we(Oi,Fi,t,e);r.layers=this.layers,this.add(r);let a=new we(Oi,Fi,t,e);a.layers=this.layers,this.add(a);let o=new we(Oi,Fi,t,e);o.layers=this.layers,this.add(o);let c=new we(Oi,Fi,t,e);c.layers=this.layers,this.add(c);let l=new we(Oi,Fi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===An)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Nr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Xr=class extends Je{constructor(t,e,i,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:qi,super(t,e,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},xa=class extends Cn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(bs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ui?ce:ke),this.texture=new Xr(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ze}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ze(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ie,blending:Wn});r.uniforms.tEquirect.value=e;let a=new Jt(s,r),o=e.minFilter;return e.minFilter===As&&(e.minFilter=Ze),new ga(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}},Jo=new R,Df=new R,Uf=new Zt,rn=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Jo.subVectors(i,e).cross(Df.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(Jo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Uf.getNormalMatrix(t),s=this.coplanarPoint(Jo).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ri=new Cs,Mr=new R,Is=class{constructor(t=new rn,e=new rn,i=new rn,s=new rn,r=new rn,a=new rn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=An){let i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],x=s[10],p=s[11],m=s[12],M=s[13],_=s[14],y=s[15];if(i[0].setComponents(c-r,d-l,p-f,y-m).normalize(),i[1].setComponents(c+r,d+l,p+f,y+m).normalize(),i[2].setComponents(c+a,d+h,p+g,y+M).normalize(),i[3].setComponents(c-a,d-h,p-g,y-M).normalize(),i[4].setComponents(c-o,d-u,p-x,y-_).normalize(),e===An)i[5].setComponents(c+o,d+u,p+x,y+_).normalize();else if(e===Nr)i[5].setComponents(o,u,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(t){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(t.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(Mr.x=s.normal.x>0?t.max.x:t.min.x,Mr.y=s.normal.y>0?t.max.y:t.min.y,Mr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Mr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function dh(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Nf(n,t){let e=t.isWebGL2,i=new WeakMap;function s(l,h){let u=l.array,d=l.usage,f=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,d),l.onUploadCallback();let x;if(u instanceof Float32Array)x=n.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=n.SHORT;else if(u instanceof Uint32Array)x=n.UNSIGNED_INT;else if(u instanceof Int32Array)x=n.INT;else if(u instanceof Int8Array)x=n.BYTE;else if(u instanceof Uint8Array)x=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,h,u){let d=h.array,f=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,l),f.count===-1&&g.length===0&&n.bufferSubData(u,0,d),g.length!==0){for(let x=0,p=g.length;x<p;x++){let m=g[x];e?n.bufferSubData(u,m.start*d.BYTES_PER_ELEMENT,d,m.start,m.count):n.bufferSubData(u,m.start*d.BYTES_PER_ELEMENT,d.subarray(m.start,m.start+m.count))}h.clearUpdateRanges()}f.count!==-1&&(e?n.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):n.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=i.get(l);h&&(n.deleteBuffer(h.buffer),i.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let d=i.get(l);(!d||d.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let u=i.get(l);if(u===void 0)i.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}var ln=class n extends De{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],x=[],p=[];for(let m=0;m<h;m++){let M=m*d-a;for(let _=0;_<l;_++){let y=_*u-r;g.push(y,-M,0),x.push(0,0,1),p.push(_/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let M=0;M<o;M++){let _=M+l*m,y=M+l*(m+1),P=M+1+l*(m+1),T=M+1+l*m;f.push(_,y,T),f.push(y,P,T)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(x,3)),this.setAttribute("uv",new ne(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Of=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ff=`#ifdef USE_ALPHAHASH
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
#endif`,Bf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Hf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vf=`#ifdef USE_AOMAP
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
#endif`,Gf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wf=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
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
#endif`,Xf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Yf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$f=`#ifdef USE_IRIDESCENCE
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
#endif`,Jf=`#ifdef USE_BUMPMAP
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
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
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
#endif`,jf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,td=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ed=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,id=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,sd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,rd=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,od=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ad=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ld=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ud=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fd="gl_FragColor = linearToOutputTexel( gl_FragColor );",dd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,pd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,md=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gd=`#ifdef USE_ENVMAP
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
#endif`,xd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_d=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Md=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sd=`#ifdef USE_GRADIENTMAP
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
}`,Ed=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,wd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rd=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
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
#endif`,Cd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Id=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ld=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ud=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,Nd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
		float roughness = material.clearcoatRoughness;
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
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
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
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Od=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Fd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Vd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Gd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Yd=`#if defined( USE_POINTS_UV )
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
#endif`,qd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$d=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Jd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Kd=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,jd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Qd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ep=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ip=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sp=`#ifdef USE_NORMALMAP
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
#endif`,rp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,op=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ap=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,hp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,up=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,mp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,xp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,_p=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
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
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,vp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Mp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bp=`#ifdef USE_SKINNING
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
#endif`,Sp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ep=`#ifdef USE_SKINNING
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
#endif`,wp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Tp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ap=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Rp=`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Cp=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Pp=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Up=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Np=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Op=`uniform sampler2D t2D;
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
}`,Fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`#include <common>
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
}`,Vp=`#if DEPTH_PACKING == 3200
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Gp=`#define DISTANCE
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
}`,Wp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qp=`uniform float scale;
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
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zp=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$p=`#include <common>
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
}`,Jp=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Kp=`#define LAMBERT
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
}`,jp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Qp=`#define MATCAP
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
}`,t0=`#define MATCAP
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,e0=`#define NORMAL
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
}`,n0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,i0=`#define PHONG
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
}`,s0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,r0=`#define STANDARD
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
}`,o0=`#define STANDARD
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
#include <packing>
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
#include <cube_uv_reflection_fragment>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,a0=`#define TOON
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
}`,c0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,l0=`uniform float size;
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
}`,h0=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,u0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
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
}`,f0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,d0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,p0=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Vt={alphahash_fragment:Of,alphahash_pars_fragment:Ff,alphamap_fragment:Bf,alphamap_pars_fragment:zf,alphatest_fragment:kf,alphatest_pars_fragment:Hf,aomap_fragment:Vf,aomap_pars_fragment:Gf,batching_pars_vertex:Wf,batching_vertex:Xf,begin_vertex:Yf,beginnormal_vertex:qf,bsdfs:Zf,iridescence_fragment:$f,bumpmap_pars_fragment:Jf,clipping_planes_fragment:Kf,clipping_planes_pars_fragment:jf,clipping_planes_pars_vertex:Qf,clipping_planes_vertex:td,color_fragment:ed,color_pars_fragment:nd,color_pars_vertex:id,color_vertex:sd,common:rd,cube_uv_reflection_fragment:od,defaultnormal_vertex:ad,displacementmap_pars_vertex:cd,displacementmap_vertex:ld,emissivemap_fragment:hd,emissivemap_pars_fragment:ud,colorspace_fragment:fd,colorspace_pars_fragment:dd,envmap_fragment:pd,envmap_common_pars_fragment:md,envmap_pars_fragment:gd,envmap_pars_vertex:xd,envmap_physical_pars_fragment:Cd,envmap_vertex:_d,fog_vertex:yd,fog_pars_vertex:vd,fog_fragment:Md,fog_pars_fragment:bd,gradientmap_pars_fragment:Sd,lightmap_fragment:Ed,lightmap_pars_fragment:wd,lights_lambert_fragment:Td,lights_lambert_pars_fragment:Ad,lights_pars_begin:Rd,lights_toon_fragment:Pd,lights_toon_pars_fragment:Id,lights_phong_fragment:Ld,lights_phong_pars_fragment:Dd,lights_physical_fragment:Ud,lights_physical_pars_fragment:Nd,lights_fragment_begin:Od,lights_fragment_maps:Fd,lights_fragment_end:Bd,logdepthbuf_fragment:zd,logdepthbuf_pars_fragment:kd,logdepthbuf_pars_vertex:Hd,logdepthbuf_vertex:Vd,map_fragment:Gd,map_pars_fragment:Wd,map_particle_fragment:Xd,map_particle_pars_fragment:Yd,metalnessmap_fragment:qd,metalnessmap_pars_fragment:Zd,morphcolor_vertex:$d,morphnormal_vertex:Jd,morphtarget_pars_vertex:Kd,morphtarget_vertex:jd,normal_fragment_begin:Qd,normal_fragment_maps:tp,normal_pars_fragment:ep,normal_pars_vertex:np,normal_vertex:ip,normalmap_pars_fragment:sp,clearcoat_normal_fragment_begin:rp,clearcoat_normal_fragment_maps:op,clearcoat_pars_fragment:ap,iridescence_pars_fragment:cp,opaque_fragment:lp,packing:hp,premultiplied_alpha_fragment:up,project_vertex:fp,dithering_fragment:dp,dithering_pars_fragment:pp,roughnessmap_fragment:mp,roughnessmap_pars_fragment:gp,shadowmap_pars_fragment:xp,shadowmap_pars_vertex:_p,shadowmap_vertex:yp,shadowmask_pars_fragment:vp,skinbase_vertex:Mp,skinning_pars_vertex:bp,skinning_vertex:Sp,skinnormal_vertex:Ep,specularmap_fragment:wp,specularmap_pars_fragment:Tp,tonemapping_fragment:Ap,tonemapping_pars_fragment:Rp,transmission_fragment:Cp,transmission_pars_fragment:Pp,uv_pars_fragment:Ip,uv_pars_vertex:Lp,uv_vertex:Dp,worldpos_vertex:Up,background_vert:Np,background_frag:Op,backgroundCube_vert:Fp,backgroundCube_frag:Bp,cube_vert:zp,cube_frag:kp,depth_vert:Hp,depth_frag:Vp,distanceRGBA_vert:Gp,distanceRGBA_frag:Wp,equirect_vert:Xp,equirect_frag:Yp,linedashed_vert:qp,linedashed_frag:Zp,meshbasic_vert:$p,meshbasic_frag:Jp,meshlambert_vert:Kp,meshlambert_frag:jp,meshmatcap_vert:Qp,meshmatcap_frag:t0,meshnormal_vert:e0,meshnormal_frag:n0,meshphong_vert:i0,meshphong_frag:s0,meshphysical_vert:r0,meshphysical_frag:o0,meshtoon_vert:a0,meshtoon_frag:c0,points_vert:l0,points_frag:h0,shadow_vert:u0,shadow_frag:f0,sprite_vert:d0,sprite_frag:p0},xt={common:{diffuse:{value:new $t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new j(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new $t(16777215)},opacity:{value:1},center:{value:new j(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},xn={basic:{uniforms:Fe([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Fe([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Fe([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new $t(0)},specular:{value:new $t(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Fe([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new $t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Fe([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new $t(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Fe([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Fe([xt.points,xt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Fe([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Fe([xt.common,xt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Fe([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Fe([xt.sprite,xt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:Fe([xt.common,xt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:Fe([xt.lights,xt.fog,{color:{value:new $t(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};xn.physical={uniforms:Fe([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new j(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new $t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new j},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new $t(0)},specularColor:{value:new $t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new j},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};var br={r:0,b:0,g:0};function m0(n,t,e,i,s,r,a){let o=new $t(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(p,m){let M=!1,_=m.isScene===!0?m.background:null;_&&_.isTexture&&(_=(m.backgroundBlurriness>0?e:t).get(_)),_===null?x(o,c):_&&_.isColor&&(x(_,1),M=!0);let y=n.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||M)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),_&&(_.isCubeTexture||_.mapping===co)?(h===void 0&&(h=new Jt(new ze(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:ji(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=ie.getTransfer(_.colorSpace)!==ae,(u!==_||d!==_.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=n.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Jt(new ln(2,2),new Ln({name:"BackgroundMaterial",uniforms:ji(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=ie.getTransfer(_.colorSpace)!==ae,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,f=n.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function x(p,m){p.getRGB(br,fh(n)),i.buffers.color.setClear(br.r,br.g,br.b,m,a)}return{getClearColor:function(){return o},setClearColor:function(p,m=1){o.set(p),c=m,x(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,x(o,c)},render:g}}function g0(n,t,e,i){let s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},c=p(null),l=c,h=!1;function u(L,O,V,K,q){let Y=!1;if(a){let nt=x(K,V,O);l!==nt&&(l=nt,f(l.object)),Y=m(L,K,V,q),Y&&M(L,K,V,q)}else{let nt=O.wireframe===!0;(l.geometry!==K.id||l.program!==V.id||l.wireframe!==nt)&&(l.geometry=K.id,l.program=V.id,l.wireframe=nt,Y=!0)}q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,F(L,O,V,K),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function d(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function f(L){return i.isWebGL2?n.bindVertexArray(L):r.bindVertexArrayOES(L)}function g(L){return i.isWebGL2?n.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function x(L,O,V){let K=V.wireframe===!0,q=o[L.id];q===void 0&&(q={},o[L.id]=q);let Y=q[O.id];Y===void 0&&(Y={},q[O.id]=Y);let nt=Y[K];return nt===void 0&&(nt=p(d()),Y[K]=nt),nt}function p(L){let O=[],V=[],K=[];for(let q=0;q<s;q++)O[q]=0,V[q]=0,K[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:V,attributeDivisors:K,object:L,attributes:{},index:null}}function m(L,O,V,K){let q=l.attributes,Y=O.attributes,nt=0,tt=V.getAttributes();for(let _t in tt)if(tt[_t].location>=0){let ot=q[_t],vt=Y[_t];if(vt===void 0&&(_t==="instanceMatrix"&&L.instanceMatrix&&(vt=L.instanceMatrix),_t==="instanceColor"&&L.instanceColor&&(vt=L.instanceColor)),ot===void 0||ot.attribute!==vt||vt&&ot.data!==vt.data)return!0;nt++}return l.attributesNum!==nt||l.index!==K}function M(L,O,V,K){let q={},Y=O.attributes,nt=0,tt=V.getAttributes();for(let _t in tt)if(tt[_t].location>=0){let ot=Y[_t];ot===void 0&&(_t==="instanceMatrix"&&L.instanceMatrix&&(ot=L.instanceMatrix),_t==="instanceColor"&&L.instanceColor&&(ot=L.instanceColor));let vt={};vt.attribute=ot,ot&&ot.data&&(vt.data=ot.data),q[_t]=vt,nt++}l.attributes=q,l.attributesNum=nt,l.index=K}function _(){let L=l.newAttributes;for(let O=0,V=L.length;O<V;O++)L[O]=0}function y(L){P(L,0)}function P(L,O){let V=l.newAttributes,K=l.enabledAttributes,q=l.attributeDivisors;V[L]=1,K[L]===0&&(n.enableVertexAttribArray(L),K[L]=1),q[L]!==O&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,O),q[L]=O)}function T(){let L=l.newAttributes,O=l.enabledAttributes;for(let V=0,K=O.length;V<K;V++)O[V]!==L[V]&&(n.disableVertexAttribArray(V),O[V]=0)}function A(L,O,V,K,q,Y,nt){nt===!0?n.vertexAttribIPointer(L,O,V,q,Y):n.vertexAttribPointer(L,O,V,K,q,Y)}function F(L,O,V,K){if(i.isWebGL2===!1&&(L.isInstancedMesh||K.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let q=K.attributes,Y=V.getAttributes(),nt=O.defaultAttributeValues;for(let tt in Y){let _t=Y[tt];if(_t.location>=0){let W=q[tt];if(W===void 0&&(tt==="instanceMatrix"&&L.instanceMatrix&&(W=L.instanceMatrix),tt==="instanceColor"&&L.instanceColor&&(W=L.instanceColor)),W!==void 0){let ot=W.normalized,vt=W.itemSize,At=e.get(W);if(At===void 0)continue;let Et=At.buffer,Ut=At.type,Ot=At.bytesPerElement,Tt=i.isWebGL2===!0&&(Ut===n.INT||Ut===n.UNSIGNED_INT||W.gpuType===Ql);if(W.isInterleavedBufferAttribute){let Ft=W.data,I=Ft.stride,ft=W.offset;if(Ft.isInstancedInterleavedBuffer){for(let Z=0;Z<_t.locationSize;Z++)P(_t.location+Z,Ft.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=Ft.meshPerAttribute*Ft.count)}else for(let Z=0;Z<_t.locationSize;Z++)y(_t.location+Z);n.bindBuffer(n.ARRAY_BUFFER,Et);for(let Z=0;Z<_t.locationSize;Z++)A(_t.location+Z,vt/_t.locationSize,Ut,ot,I*Ot,(ft+vt/_t.locationSize*Z)*Ot,Tt)}else{if(W.isInstancedBufferAttribute){for(let Ft=0;Ft<_t.locationSize;Ft++)P(_t.location+Ft,W.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let Ft=0;Ft<_t.locationSize;Ft++)y(_t.location+Ft);n.bindBuffer(n.ARRAY_BUFFER,Et);for(let Ft=0;Ft<_t.locationSize;Ft++)A(_t.location+Ft,vt/_t.locationSize,Ut,ot,vt*Ot,vt/_t.locationSize*Ft*Ot,Tt)}}else if(nt!==void 0){let ot=nt[tt];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(_t.location,ot);break;case 3:n.vertexAttrib3fv(_t.location,ot);break;case 4:n.vertexAttrib4fv(_t.location,ot);break;default:n.vertexAttrib1fv(_t.location,ot)}}}}T()}function b(){X();for(let L in o){let O=o[L];for(let V in O){let K=O[V];for(let q in K)g(K[q].object),delete K[q];delete O[V]}delete o[L]}}function w(L){if(o[L.id]===void 0)return;let O=o[L.id];for(let V in O){let K=O[V];for(let q in K)g(K[q].object),delete K[q];delete O[V]}delete o[L.id]}function N(L){for(let O in o){let V=o[O];if(V[L.id]===void 0)continue;let K=V[L.id];for(let q in K)g(K[q].object),delete K[q];delete V[L.id]}}function X(){Q(),h=!0,l!==c&&(l=c,f(l.object))}function Q(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:X,resetDefaultState:Q,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfProgram:N,initAttributes:_,enableAttribute:y,disableUnusedAttributes:T}}function x0(n,t,e,i){let s=i.isWebGL2,r;function a(h){r=h}function o(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let f,g;if(s)f=n,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let x=0;x<d;x++)g+=u[x];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function _0(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);let l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),x=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),m=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),_=d>0,y=a||t.has("OES_texture_float"),P=_&&y,T=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:p,maxVaryings:m,maxFragmentUniforms:M,vertexTextures:_,floatFragmentTextures:y,floatVertexTextures:P,maxSamples:T}}function y0(n){let t=this,e=null,i=0,s=!1,r=!1,a=new rn,o=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,m=n.get(u);if(!s||g===null||g.length===0||r&&!p)r?h(null):l();else{let M=r?0:i,_=M*4,y=m.clippingState||null;c.value=y,y=h(g,d,_,f);for(let P=0;P!==_;++P)y[P]=e[P];m.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){let x=u!==null?u.length:0,p=null;if(x!==0){if(p=c.value,g!==!0||p===null){let m=f+x*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let _=0,y=f;_!==x;++_,y+=4)a.copy(u[_]).applyMatrix4(M,o),a.normal.toArray(p,y),p[y+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function v0(n){let t=new WeakMap;function e(a,o){return o===la?a.mapping=qi:o===ha&&(a.mapping=Zi),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===la||o===ha)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new xa(c.height/2);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var Yr=class extends Wr{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Hi=4,Ml=[.125,.215,.35,.446,.526,.582],ci=20,Ko=new Yr,bl=new $t,jo=null,Qo=0,ta=0,oi=(1+Math.sqrt(5))/2,Bi=1/oi,Sl=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,oi,Bi),new R(0,oi,-Bi),new R(Bi,0,oi),new R(-Bi,0,oi),new R(oi,Bi,0),new R(-oi,Bi,0)],Qi=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){jo=this._renderer.getRenderTarget(),Qo=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(jo,Qo,ta),t.scissorTest=!1,Sr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===qi||t.mapping===Zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),jo=this._renderer.getRenderTarget(),Qo=this._renderer.getActiveCubeFace(),ta=this._renderer.getActiveMipmapLevel();let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ze,minFilter:Ze,generateMipmaps:!1,type:Rs,format:an,colorSpace:Rn,depthBuffer:!1},s=El(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=El(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=M0(r)),this._blurMaterial=b0(r,t,e)}return s}_compileMaterial(t){let e=new Jt(this._lodPlanes[0],t);this._renderer.compile(e,Ko)}_sceneToCubeUV(t,e,i,s){let o=new we(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(bl),h.toneMapping=Xn,h.autoClear=!1;let f=new In({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),g=new Jt(new ze,f),x=!1,p=t.background;p?p.isColor&&(f.color.copy(p),t.background=null,x=!0):(f.color.copy(bl),x=!0);for(let m=0;m<6;m++){let M=m%3;M===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):M===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));let _=this._cubeSize;Sr(s,M*_,m>2?_:0,_,_),h.setRenderTarget(s),x&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===qi||t.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wl());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Jt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;Sr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Ko)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Sl[(s-1)%Sl.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Jt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ci-1),x=r/g,p=isFinite(r)?1+Math.floor(h*x):ci;p>ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ci}`);let m=[],M=0;for(let A=0;A<ci;++A){let F=A/x,b=Math.exp(-F*F/2);m.push(b),A===0?M+=b:A<p&&(M+=2*b)}for(let A=0;A<m.length;A++)m[A]=m[A]/M;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;let y=this._sizeLods[s],P=3*y*(s>_-Hi?s-_+Hi:0),T=4*(this._cubeSize-y);Sr(e,P,T,3*y,2*y),c.setRenderTarget(e),c.render(u,Ko)}};function M0(n){let t=[],e=[],i=[],s=n,r=n-Hi+1+Ml.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>n-Hi?c=Ml[a-n+Hi-1]:a===0&&(c=0),i.push(c);let l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,p=2,m=1,M=new Float32Array(x*g*f),_=new Float32Array(p*g*f),y=new Float32Array(m*g*f);for(let T=0;T<f;T++){let A=T%3*2/3-1,F=T>2?0:-1,b=[A,F,0,A+2/3,F,0,A+2/3,F+1,0,A,F,0,A+2/3,F+1,0,A,F+1,0];M.set(b,x*g*T),_.set(d,p*g*T);let w=[T,T,T,T,T,T];y.set(w,m*g*T)}let P=new De;P.setAttribute("position",new Le(M,x)),P.setAttribute("uv",new Le(_,p)),P.setAttribute("faceIndex",new Le(y,m)),t.push(P),s>Hi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function El(n,t,e){let i=new Cn(n,t,e);return i.texture.mapping=co,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Sr(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function b0(n,t,e){let i=new Float32Array(ci),s=new R(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function wl(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Tl(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function ec(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function S0(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){let c=o.mapping,l=c===la||c===ha,h=c===qi||c===Zi;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new Qi(n)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{let u=o.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Qi(n));let d=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function E0(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){let s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function w0(n,t,e,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let x=d.morphAttributes[g];for(let p=0,m=x.length;p<m;p++)t.remove(x[p])}d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)t.update(d[g],n.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let x=f[g];for(let p=0,m=x.length;p<m;p++)t.update(x[p],n.ARRAY_BUFFER)}}function l(u){let d=[],f=u.index,g=u.attributes.position,x=0;if(f!==null){let M=f.array;x=f.version;for(let _=0,y=M.length;_<y;_+=3){let P=M[_+0],T=M[_+1],A=M[_+2];d.push(P,T,T,A,A,P)}}else if(g!==void 0){let M=g.array;x=g.version;for(let _=0,y=M.length/3-1;_<y;_+=3){let P=_+0,T=_+1,A=_+2;d.push(P,T,T,A,A,P)}}else return;let p=new(hh(d)?Gr:Vr)(d,1);p.version=x;let m=r.get(u);m&&t.remove(m),r.set(u,p)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function T0(n,t,e,i){let s=i.isWebGL2,r;function a(f){r=f}let o,c;function l(f){o=f.type,c=f.bytesPerElement}function h(f,g){n.drawElements(r,g,o,f*c),e.update(g,r,1)}function u(f,g,x){if(x===0)return;let p,m;if(s)p=n,m="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](r,g,o,f*c,x),e.update(g,r,x)}function d(f,g,x){if(x===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<x;m++)this.render(f[m]/c,g[m]);else{p.multiDrawElementsWEBGL(r,g,0,o,f,0,x);let m=0;for(let M=0;M<x;M++)m+=g[M];e.update(m,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function A0(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function R0(n,t){return n[0]-t[0]}function C0(n,t){return Math.abs(t[1])-Math.abs(n[1])}function P0(n,t,e){let i={},s=new Float32Array(8),r=new WeakMap,a=new ue,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){let d=l.morphTargetInfluences;if(t.isWebGL2===!0){let f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0,x=r.get(h);if(x===void 0||x.count!==g){let L=function(){X.dispose(),r.delete(h),h.removeEventListener("dispose",L)};x!==void 0&&x.texture.dispose();let M=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],A=h.morphAttributes.color||[],F=0;M===!0&&(F=1),_===!0&&(F=2),y===!0&&(F=3);let b=h.attributes.position.count*F,w=1;b>t.maxTextureSize&&(w=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);let N=new Float32Array(b*w*4*g),X=new kr(N,b,w,g);X.type=Gn,X.needsUpdate=!0;let Q=F*4;for(let O=0;O<g;O++){let V=P[O],K=T[O],q=A[O],Y=b*w*4*O;for(let nt=0;nt<V.count;nt++){let tt=nt*Q;M===!0&&(a.fromBufferAttribute(V,nt),N[Y+tt+0]=a.x,N[Y+tt+1]=a.y,N[Y+tt+2]=a.z,N[Y+tt+3]=0),_===!0&&(a.fromBufferAttribute(K,nt),N[Y+tt+4]=a.x,N[Y+tt+5]=a.y,N[Y+tt+6]=a.z,N[Y+tt+7]=0),y===!0&&(a.fromBufferAttribute(q,nt),N[Y+tt+8]=a.x,N[Y+tt+9]=a.y,N[Y+tt+10]=a.z,N[Y+tt+11]=q.itemSize===4?a.w:1)}}x={count:g,texture:X,size:new j(b,w)},r.set(h,x),h.addEventListener("dispose",L)}let p=0;for(let M=0;M<d.length;M++)p+=d[M];let m=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(n,"morphTargetBaseInfluence",m),u.getUniforms().setValue(n,"morphTargetInfluences",d),u.getUniforms().setValue(n,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",x.size)}else{let f=d===void 0?0:d.length,g=i[h.id];if(g===void 0||g.length!==f){g=[];for(let _=0;_<f;_++)g[_]=[_,0];i[h.id]=g}for(let _=0;_<f;_++){let y=g[_];y[0]=_,y[1]=d[_]}g.sort(C0);for(let _=0;_<8;_++)_<f&&g[_][1]?(o[_][0]=g[_][0],o[_][1]=g[_][1]):(o[_][0]=Number.MAX_SAFE_INTEGER,o[_][1]=0);o.sort(R0);let x=h.morphAttributes.position,p=h.morphAttributes.normal,m=0;for(let _=0;_<8;_++){let y=o[_],P=y[0],T=y[1];P!==Number.MAX_SAFE_INTEGER&&T?(x&&h.getAttribute("morphTarget"+_)!==x[P]&&h.setAttribute("morphTarget"+_,x[P]),p&&h.getAttribute("morphNormal"+_)!==p[P]&&h.setAttribute("morphNormal"+_,p[P]),s[_]=T,m+=T):(x&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let M=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",M),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:c}}function I0(n,t,e,i){let s=new WeakMap;function r(c){let l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var qr=class extends Je{constructor(t,e,i,s,r,a,o,c,l,h){if(h=h!==void 0?h:hi,h!==hi&&h!==$i)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===hi&&(i=Vn),i===void 0&&h===$i&&(i=li),super(null,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Be,this.minFilter=c!==void 0?c:Be,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},ph=new Je,mh=new qr(1,1);mh.compareFunction=ch;var gh=new kr,xh=new ma,_h=new Xr,Al=[],Rl=[],Cl=new Float32Array(16),Pl=new Float32Array(9),Il=new Float32Array(4);function rs(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Al[s];if(r===void 0&&(r=new Float32Array(s),Al[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function ye(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ve(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ho(n,t){let e=Rl[t];e===void 0&&(e=new Int32Array(t),Rl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function L0(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function D0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2fv(this.addr,t),ve(e,t)}}function U0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;n.uniform3fv(this.addr,t),ve(e,t)}}function N0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4fv(this.addr,t),ve(e,t)}}function O0(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ve(e,t)}else{if(ye(e,i))return;Il.set(i),n.uniformMatrix2fv(this.addr,!1,Il),ve(e,i)}}function F0(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ve(e,t)}else{if(ye(e,i))return;Pl.set(i),n.uniformMatrix3fv(this.addr,!1,Pl),ve(e,i)}}function B0(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(ye(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ve(e,t)}else{if(ye(e,i))return;Cl.set(i),n.uniformMatrix4fv(this.addr,!1,Cl),ve(e,i)}}function z0(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function k0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2iv(this.addr,t),ve(e,t)}}function H0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;n.uniform3iv(this.addr,t),ve(e,t)}}function V0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4iv(this.addr,t),ve(e,t)}}function G0(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function W0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;n.uniform2uiv(this.addr,t),ve(e,t)}}function X0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;n.uniform3uiv(this.addr,t),ve(e,t)}}function Y0(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;n.uniform4uiv(this.addr,t),ve(e,t)}}function q0(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r=this.type===n.SAMPLER_2D_SHADOW?mh:ph;e.setTexture2D(t||r,s)}function Z0(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||xh,s)}function $0(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||_h,s)}function J0(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||gh,s)}function K0(n){switch(n){case 5126:return L0;case 35664:return D0;case 35665:return U0;case 35666:return N0;case 35674:return O0;case 35675:return F0;case 35676:return B0;case 5124:case 35670:return z0;case 35667:case 35671:return k0;case 35668:case 35672:return H0;case 35669:case 35673:return V0;case 5125:return G0;case 36294:return W0;case 36295:return X0;case 36296:return Y0;case 35678:case 36198:case 36298:case 36306:case 35682:return q0;case 35679:case 36299:case 36307:return Z0;case 35680:case 36300:case 36308:case 36293:return $0;case 36289:case 36303:case 36311:case 36292:return J0}}function j0(n,t){n.uniform1fv(this.addr,t)}function Q0(n,t){let e=rs(t,this.size,2);n.uniform2fv(this.addr,e)}function tm(n,t){let e=rs(t,this.size,3);n.uniform3fv(this.addr,e)}function em(n,t){let e=rs(t,this.size,4);n.uniform4fv(this.addr,e)}function nm(n,t){let e=rs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function im(n,t){let e=rs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function sm(n,t){let e=rs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function rm(n,t){n.uniform1iv(this.addr,t)}function om(n,t){n.uniform2iv(this.addr,t)}function am(n,t){n.uniform3iv(this.addr,t)}function cm(n,t){n.uniform4iv(this.addr,t)}function lm(n,t){n.uniform1uiv(this.addr,t)}function hm(n,t){n.uniform2uiv(this.addr,t)}function um(n,t){n.uniform3uiv(this.addr,t)}function fm(n,t){n.uniform4uiv(this.addr,t)}function dm(n,t,e){let i=this.cache,s=t.length,r=ho(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),ve(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||ph,r[a])}function pm(n,t,e){let i=this.cache,s=t.length,r=ho(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),ve(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||xh,r[a])}function mm(n,t,e){let i=this.cache,s=t.length,r=ho(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),ve(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||_h,r[a])}function gm(n,t,e){let i=this.cache,s=t.length,r=ho(e,s);ye(i,r)||(n.uniform1iv(this.addr,r),ve(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||gh,r[a])}function xm(n){switch(n){case 5126:return j0;case 35664:return Q0;case 35665:return tm;case 35666:return em;case 35674:return nm;case 35675:return im;case 35676:return sm;case 5124:case 35670:return rm;case 35667:case 35671:return om;case 35668:case 35672:return am;case 35669:case 35673:return cm;case 5125:return lm;case 36294:return hm;case 36295:return um;case 36296:return fm;case 35678:case 36198:case 36298:case 36306:case 35682:return dm;case 35679:case 36299:case 36307:return pm;case 35680:case 36300:case 36308:case 36293:return mm;case 36289:case 36303:case 36311:case 36292:return gm}}var _a=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=K0(e.type)}},ya=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xm(e.type)}},va=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],i)}}},ea=/(\w+)(\])?(\[|\.)?/g;function Ll(n,t){n.seq.push(t),n.map[t.id]=t}function _m(n,t,e){let i=n.name,s=i.length;for(ea.lastIndex=0;;){let r=ea.exec(i),a=ea.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Ll(e,l===void 0?new _a(o,n,t):new ya(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new va(o),Ll(e,u)),e=u}}}var Yi=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);_m(r,a,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&i.push(a)}return i}};function Dl(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var ym=37297,vm=0;function Mm(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function bm(n){let t=ie.getPrimaries(ie.workingColorSpace),e=ie.getPrimaries(n),i;switch(t===e?i="":t===Ur&&e===Dr?i="LinearDisplayP3ToLinearSRGB":t===Dr&&e===Ur&&(i="LinearSRGBToLinearDisplayP3"),n){case Rn:case lo:return[i,"LinearTransferOETF"];case ce:case Qa:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Ul(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Mm(n.getShaderSource(t),a)}else return s}function Sm(n,t){let e=bm(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Em(n,t){let e;switch(t){case Cu:e="Linear";break;case Pu:e="Reinhard";break;case Iu:e="OptimizedCineon";break;case Ka:e="ACESFilmic";break;case Du:e="AgX";break;case Lu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function wm(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Vi).join(`
`)}function Tm(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Vi).join(`
`)}function Am(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Rm(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Vi(n){return n!==""}function Nl(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ol(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Cm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ma(n){return n.replace(Cm,Im)}var Pm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Im(n,t){let e=Vt[t];if(e===void 0){let i=Pm.get(t);if(i!==void 0)e=Vt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Ma(e)}var Lm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fl(n){return n.replace(Lm,Dm)}function Dm(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bl(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Um(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Jl?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ja?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Tn&&(t="SHADOWMAP_TYPE_VSM"),t}function Nm(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qi:case Zi:t="ENVMAP_TYPE_CUBE";break;case co:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Om(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Zi:t="ENVMAP_MODE_REFRACTION";break}return t}function Fm(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Kl:t="ENVMAP_BLENDING_MULTIPLY";break;case Au:t="ENVMAP_BLENDING_MIX";break;case Ru:t="ENVMAP_BLENDING_ADD";break}return t}function Bm(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function zm(n,t,e,i){let s=n.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=Um(e),l=Nm(e),h=Om(e),u=Fm(e),d=Bm(e),f=e.isWebGL2?"":wm(e),g=Tm(e),x=Am(r),p=s.createProgram(),m,M,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Vi).join(`
`),m.length>0&&(m+=`
`),M=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Vi).join(`
`),M.length>0&&(M+=`
`)):(m=[Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vi).join(`
`),M=[f,Bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Xn?"#define TONE_MAPPING":"",e.toneMapping!==Xn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Xn?Em("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Sm("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Vi).join(`
`)),a=Ma(a),a=Nl(a,e),a=Ol(a,e),o=Ma(o),o=Nl(o,e),o=Ol(o,e),a=Fl(a),o=Fl(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===il?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===il?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);let y=_+m+a,P=_+M+o,T=Dl(s,s.VERTEX_SHADER,y),A=Dl(s,s.FRAGMENT_SHADER,P);s.attachShader(p,T),s.attachShader(p,A),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function F(X){if(n.debug.checkShaderErrors){let Q=s.getProgramInfoLog(p).trim(),L=s.getShaderInfoLog(T).trim(),O=s.getShaderInfoLog(A).trim(),V=!0,K=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,T,A);else{let q=Ul(s,T,"vertex"),Y=Ul(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+Q+`
`+q+`
`+Y)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(L===""||O==="")&&(K=!1);K&&(X.diagnostics={runnable:V,programLog:Q,vertexShader:{log:L,prefix:m},fragmentShader:{log:O,prefix:M}})}s.deleteShader(T),s.deleteShader(A),b=new Yi(s,p),w=Rm(s,p)}let b;this.getUniforms=function(){return b===void 0&&F(this),b};let w;this.getAttributes=function(){return w===void 0&&F(this),w};let N=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(p,ym)),N},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vm++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=A,this}var km=0,ba=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Sa(t),e.set(t,i)),i}},Sa=class{constructor(t){this.id=km++,this.code=t,this.usedTimes=0}};function Hm(n,t,e,i,s,r,a){let o=new Ps,c=new ba,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(b){return b===0?"uv":`uv${b}`}function p(b,w,N,X,Q){let L=X.fog,O=Q.geometry,V=b.isMeshStandardMaterial?X.environment:null,K=(b.isMeshStandardMaterial?e:t).get(b.envMap||V),q=K&&K.mapping===co?K.image.height:null,Y=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let nt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,tt=nt!==void 0?nt.length:0,_t=0;O.morphAttributes.position!==void 0&&(_t=1),O.morphAttributes.normal!==void 0&&(_t=2),O.morphAttributes.color!==void 0&&(_t=3);let W,ot,vt,At;if(Y){let Ue=xn[Y];W=Ue.vertexShader,ot=Ue.fragmentShader}else W=b.vertexShader,ot=b.fragmentShader,c.update(b),vt=c.getVertexShaderID(b),At=c.getFragmentShaderID(b);let Et=n.getRenderTarget(),Ut=Q.isInstancedMesh===!0,Ot=Q.isBatchedMesh===!0,Tt=!!b.map,Ft=!!b.matcap,I=!!K,ft=!!b.aoMap,Z=!!b.lightMap,ct=!!b.bumpMap,$=!!b.normalMap,Rt=!!b.displacementMap,Mt=!!b.emissiveMap,S=!!b.metalnessMap,v=!!b.roughnessMap,z=b.anisotropy>0,at=b.clearcoat>0,it=b.iridescence>0,et=b.sheen>0,wt=b.transmission>0,yt=z&&!!b.anisotropyMap,bt=at&&!!b.clearcoatMap,Lt=at&&!!b.clearcoatNormalMap,zt=at&&!!b.clearcoatRoughnessMap,st=it&&!!b.iridescenceMap,Xt=it&&!!b.iridescenceThicknessMap,C=et&&!!b.sheenColorMap,rt=et&&!!b.sheenRoughnessMap,gt=!!b.specularMap,ht=!!b.specularColorMap,Ct=!!b.specularIntensityMap,Yt=wt&&!!b.transmissionMap,Kt=wt&&!!b.thicknessMap,Gt=!!b.gradientMap,mt=!!b.alphaMap,D=b.alphaTest>0,dt=!!b.alphaHash,pt=!!b.extensions,Dt=!!O.attributes.uv1,Pt=!!O.attributes.uv2,jt=!!O.attributes.uv3,ee=Xn;return b.toneMapped&&(Et===null||Et.isXRRenderTarget===!0)&&(ee=n.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:b.type,shaderName:b.name,vertexShader:W,fragmentShader:ot,defines:b.defines,customVertexShaderID:vt,customFragmentShaderID:At,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Ot,instancing:Ut,instancingColor:Ut&&Q.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Et===null?n.outputColorSpace:Et.isXRRenderTarget===!0?Et.texture.colorSpace:Rn,map:Tt,matcap:Ft,envMap:I,envMapMode:I&&K.mapping,envMapCubeUVHeight:q,aoMap:ft,lightMap:Z,bumpMap:ct,normalMap:$,displacementMap:d&&Rt,emissiveMap:Mt,normalMapObjectSpace:$&&b.normalMapType===Xu,normalMapTangentSpace:$&&b.normalMapType===ah,metalnessMap:S,roughnessMap:v,anisotropy:z,anisotropyMap:yt,clearcoat:at,clearcoatMap:bt,clearcoatNormalMap:Lt,clearcoatRoughnessMap:zt,iridescence:it,iridescenceMap:st,iridescenceThicknessMap:Xt,sheen:et,sheenColorMap:C,sheenRoughnessMap:rt,specularMap:gt,specularColorMap:ht,specularIntensityMap:Ct,transmission:wt,transmissionMap:Yt,thicknessMap:Kt,gradientMap:Gt,opaque:b.transparent===!1&&b.blending===Wi,alphaMap:mt,alphaTest:D,alphaHash:dt,combine:b.combine,mapUv:Tt&&x(b.map.channel),aoMapUv:ft&&x(b.aoMap.channel),lightMapUv:Z&&x(b.lightMap.channel),bumpMapUv:ct&&x(b.bumpMap.channel),normalMapUv:$&&x(b.normalMap.channel),displacementMapUv:Rt&&x(b.displacementMap.channel),emissiveMapUv:Mt&&x(b.emissiveMap.channel),metalnessMapUv:S&&x(b.metalnessMap.channel),roughnessMapUv:v&&x(b.roughnessMap.channel),anisotropyMapUv:yt&&x(b.anisotropyMap.channel),clearcoatMapUv:bt&&x(b.clearcoatMap.channel),clearcoatNormalMapUv:Lt&&x(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&x(b.clearcoatRoughnessMap.channel),iridescenceMapUv:st&&x(b.iridescenceMap.channel),iridescenceThicknessMapUv:Xt&&x(b.iridescenceThicknessMap.channel),sheenColorMapUv:C&&x(b.sheenColorMap.channel),sheenRoughnessMapUv:rt&&x(b.sheenRoughnessMap.channel),specularMapUv:gt&&x(b.specularMap.channel),specularColorMapUv:ht&&x(b.specularColorMap.channel),specularIntensityMapUv:Ct&&x(b.specularIntensityMap.channel),transmissionMapUv:Yt&&x(b.transmissionMap.channel),thicknessMapUv:Kt&&x(b.thicknessMap.channel),alphaMapUv:mt&&x(b.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&($||z),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Pt,vertexUv3s:jt,pointsUvs:Q.isPoints===!0&&!!O.attributes.uv&&(Tt||mt),fog:!!L,useFog:b.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Q.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:_t,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Tt&&b.map.isVideoTexture===!0&&ie.getTransfer(b.map.colorSpace)===ae,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===$e,flipSided:b.side===Ie,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:pt&&b.extensions.derivatives===!0,extensionFragDepth:pt&&b.extensions.fragDepth===!0,extensionDrawBuffers:pt&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:pt&&b.extensions.shaderTextureLOD===!0,extensionClipCullDistance:pt&&b.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()}}function m(b){let w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(let N in b.defines)w.push(N),w.push(b.defines[N]);return b.isRawShaderMaterial===!1&&(M(w,b),_(w,b),w.push(n.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function M(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function _(b,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),b.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),b.push(o.mask)}function y(b){let w=g[b.type],N;if(w){let X=xn[w];N=Pf.clone(X.uniforms)}else N=b.uniforms;return N}function P(b,w){let N;for(let X=0,Q=l.length;X<Q;X++){let L=l[X];if(L.cacheKey===w){N=L,++N.usedTimes;break}}return N===void 0&&(N=new zm(n,w,b,r),l.push(N)),N}function T(b){if(--b.usedTimes===0){let w=l.indexOf(b);l[w]=l[l.length-1],l.pop(),b.destroy()}}function A(b){c.remove(b)}function F(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:y,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:l,dispose:F}}function Vm(){let n=new WeakMap;function t(r){let a=n.get(r);return a===void 0&&(a={},n.set(r,a)),a}function e(r){n.delete(r)}function i(r,a,o){n.get(r)[a]=o}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function Gm(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function zl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function kl(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,f,g,x,p){let m=n[t];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:x,group:p},n[t]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=x,m.group=p),t++,m}function o(u,d,f,g,x,p){let m=a(u,d,f,g,x,p);f.transmission>0?i.push(m):f.transparent===!0?s.push(m):e.push(m)}function c(u,d,f,g,x,p){let m=a(u,d,f,g,x,p);f.transmission>0?i.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function l(u,d){e.length>1&&e.sort(u||Gm),i.length>1&&i.sort(d||zl),s.length>1&&s.sort(d||zl)}function h(){for(let u=t,d=n.length;u<d;u++){let f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Wm(){let n=new WeakMap;function t(i,s){let r=n.get(i),a;return r===void 0?(a=new kl,n.set(i,[a])):s>=r.length?(a=new kl,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Xm(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new $t};break;case"SpotLight":e={position:new R,direction:new R,color:new $t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new $t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new $t,groundColor:new $t};break;case"RectAreaLight":e={color:new $t,position:new R,halfWidth:new R,halfHeight:new R};break}return n[t.id]=e,e}}}function Ym(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new j,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var qm=0;function Zm(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function $m(n,t){let e=new Xm,i=Ym(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new R);let r=new R,a=new pe,o=new pe;function c(h,u){let d=0,f=0,g=0;for(let X=0;X<9;X++)s.probe[X].set(0,0,0);let x=0,p=0,m=0,M=0,_=0,y=0,P=0,T=0,A=0,F=0,b=0;h.sort(Zm);let w=u===!0?Math.PI:1;for(let X=0,Q=h.length;X<Q;X++){let L=h[X],O=L.color,V=L.intensity,K=L.distance,q=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=O.r*V*w,f+=O.g*V*w,g+=O.b*V*w;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(L.sh.coefficients[Y],V);b++}else if(L.isDirectionalLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*w),L.castShadow){let nt=L.shadow,tt=i.get(L);tt.shadowBias=nt.bias,tt.shadowNormalBias=nt.normalBias,tt.shadowRadius=nt.radius,tt.shadowMapSize=nt.mapSize,s.directionalShadow[x]=tt,s.directionalShadowMap[x]=q,s.directionalShadowMatrix[x]=L.shadow.matrix,y++}s.directional[x]=Y,x++}else if(L.isSpotLight){let Y=e.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(O).multiplyScalar(V*w),Y.distance=K,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,s.spot[m]=Y;let nt=L.shadow;if(L.map&&(s.spotLightMap[A]=L.map,A++,nt.updateMatrices(L),L.castShadow&&F++),s.spotLightMatrix[m]=nt.matrix,L.castShadow){let tt=i.get(L);tt.shadowBias=nt.bias,tt.shadowNormalBias=nt.normalBias,tt.shadowRadius=nt.radius,tt.shadowMapSize=nt.mapSize,s.spotShadow[m]=tt,s.spotShadowMap[m]=q,T++}m++}else if(L.isRectAreaLight){let Y=e.get(L);Y.color.copy(O).multiplyScalar(V),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),s.rectArea[M]=Y,M++}else if(L.isPointLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity*w),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){let nt=L.shadow,tt=i.get(L);tt.shadowBias=nt.bias,tt.shadowNormalBias=nt.normalBias,tt.shadowRadius=nt.radius,tt.shadowMapSize=nt.mapSize,tt.shadowCameraNear=nt.camera.near,tt.shadowCameraFar=nt.camera.far,s.pointShadow[p]=tt,s.pointShadowMap[p]=q,s.pointShadowMatrix[p]=L.shadow.matrix,P++}s.point[p]=Y,p++}else if(L.isHemisphereLight){let Y=e.get(L);Y.skyColor.copy(L.color).multiplyScalar(V*w),Y.groundColor.copy(L.groundColor).multiplyScalar(V*w),s.hemi[_]=Y,_++}}M>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_FLOAT_1,s.rectAreaLTC2=xt.LTC_FLOAT_2):(s.rectAreaLTC1=xt.LTC_HALF_1,s.rectAreaLTC2=xt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_FLOAT_1,s.rectAreaLTC2=xt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_HALF_1,s.rectAreaLTC2=xt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;let N=s.hash;(N.directionalLength!==x||N.pointLength!==p||N.spotLength!==m||N.rectAreaLength!==M||N.hemiLength!==_||N.numDirectionalShadows!==y||N.numPointShadows!==P||N.numSpotShadows!==T||N.numSpotMaps!==A||N.numLightProbes!==b)&&(s.directional.length=x,s.spot.length=m,s.rectArea.length=M,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=y,s.directionalShadowMap.length=y,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=y,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=T+A-F,s.spotLightMap.length=A,s.numSpotLightShadowsWithMaps=F,s.numLightProbes=b,N.directionalLength=x,N.pointLength=p,N.spotLength=m,N.rectAreaLength=M,N.hemiLength=_,N.numDirectionalShadows=y,N.numPointShadows=P,N.numSpotShadows=T,N.numSpotMaps=A,N.numLightProbes=b,s.version=qm++)}function l(h,u){let d=0,f=0,g=0,x=0,p=0,m=u.matrixWorldInverse;for(let M=0,_=h.length;M<_;M++){let y=h[M];if(y.isDirectionalLight){let P=s.directional[d];P.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(m),d++}else if(y.isSpotLight){let P=s.spot[g];P.position.setFromMatrixPosition(y.matrixWorld),P.position.applyMatrix4(m),P.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(m),g++}else if(y.isRectAreaLight){let P=s.rectArea[x];P.position.setFromMatrixPosition(y.matrixWorld),P.position.applyMatrix4(m),o.identity(),a.copy(y.matrixWorld),a.premultiply(m),o.extractRotation(a),P.halfWidth.set(y.width*.5,0,0),P.halfHeight.set(0,y.height*.5,0),P.halfWidth.applyMatrix4(o),P.halfHeight.applyMatrix4(o),x++}else if(y.isPointLight){let P=s.point[f];P.position.setFromMatrixPosition(y.matrixWorld),P.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let P=s.hemi[p];P.direction.setFromMatrixPosition(y.matrixWorld),P.direction.transformDirection(m),p++}}}return{setup:c,setupView:l,state:s}}function Hl(n,t){let e=new $m(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function a(u){i.push(u)}function o(u){s.push(u)}function c(u){e.setup(i,u)}function l(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function Jm(n,t){let e=new WeakMap;function i(r,a=0){let o=e.get(r),c;return o===void 0?(c=new Hl(n,t),e.set(r,[c])):a>=o.length?(c=new Hl(n,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:i,dispose:s}}var Ea=class extends fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},wa=class extends fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Km=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Qm(n,t,e){let i=new Is,s=new j,r=new j,a=new ue,o=new Ea({depthPacking:Wu}),c=new wa,l={},h=e.maxTextureSize,u={[qn]:Ie,[Ie]:qn,[$e]:$e},d=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new j},radius:{value:4}},vertexShader:Km,fragmentShader:jm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new De;g.setAttribute("position",new Le(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Jt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Jl;let m=this.type;this.render=function(T,A,F){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;let b=n.getRenderTarget(),w=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),X=n.state;X.setBlending(Wn),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);let Q=m!==Tn&&this.type===Tn,L=m===Tn&&this.type!==Tn;for(let O=0,V=T.length;O<V;O++){let K=T[O],q=K.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let Y=q.getFrameExtents();if(s.multiply(Y),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,q.mapSize.y=r.y)),q.map===null||Q===!0||L===!0){let tt=this.type!==Tn?{minFilter:Be,magFilter:Be}:{};q.map!==null&&q.map.dispose(),q.map=new Cn(s.x,s.y,tt),q.map.texture.name=K.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let nt=q.getViewportCount();for(let tt=0;tt<nt;tt++){let _t=q.getViewport(tt);a.set(r.x*_t.x,r.y*_t.y,r.x*_t.z,r.y*_t.w),X.viewport(a),q.updateMatrices(K,tt),i=q.getFrustum(),y(A,F,q.camera,K,this.type)}q.isPointLightShadow!==!0&&this.type===Tn&&M(q,F),q.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(b,w,N)};function M(T,A){let F=t.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Cn(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,F,d,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,F,f,x,null)}function _(T,A,F,b){let w=null,N=F.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(N!==void 0)w=N;else if(w=F.isPointLight===!0?c:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let X=w.uuid,Q=A.uuid,L=l[X];L===void 0&&(L={},l[X]=L);let O=L[Q];O===void 0&&(O=w.clone(),L[Q]=O,A.addEventListener("dispose",P)),w=O}if(w.visible=A.visible,w.wireframe=A.wireframe,b===Tn?w.side=A.shadowSide!==null?A.shadowSide:A.side:w.side=A.shadowSide!==null?A.shadowSide:u[A.side],w.alphaMap=A.alphaMap,w.alphaTest=A.alphaTest,w.map=A.map,w.clipShadows=A.clipShadows,w.clippingPlanes=A.clippingPlanes,w.clipIntersection=A.clipIntersection,w.displacementMap=A.displacementMap,w.displacementScale=A.displacementScale,w.displacementBias=A.displacementBias,w.wireframeLinewidth=A.wireframeLinewidth,w.linewidth=A.linewidth,F.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let X=n.properties.get(w);X.light=F}return w}function y(T,A,F,b,w){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===Tn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,T.matrixWorld);let Q=t.update(T),L=T.material;if(Array.isArray(L)){let O=Q.groups;for(let V=0,K=O.length;V<K;V++){let q=O[V],Y=L[q.materialIndex];if(Y&&Y.visible){let nt=_(T,Y,b,w);T.onBeforeShadow(n,T,A,F,Q,nt,q),n.renderBufferDirect(F,null,Q,nt,T,q),T.onAfterShadow(n,T,A,F,Q,nt,q)}}}else if(L.visible){let O=_(T,L,b,w);T.onBeforeShadow(n,T,A,F,Q,O,null),n.renderBufferDirect(F,null,Q,O,T,null),T.onAfterShadow(n,T,A,F,Q,O,null)}}let X=T.children;for(let Q=0,L=X.length;Q<L;Q++)y(X[Q],A,F,b,w)}function P(T){T.target.removeEventListener("dispose",P);for(let F in l){let b=l[F],w=T.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}function tg(n,t,e){let i=e.isWebGL2;function s(){let D=!1,dt=new ue,pt=null,Dt=new ue(0,0,0,0);return{setMask:function(Pt){pt!==Pt&&!D&&(n.colorMask(Pt,Pt,Pt,Pt),pt=Pt)},setLocked:function(Pt){D=Pt},setClear:function(Pt,jt,ee,Me,Ue){Ue===!0&&(Pt*=Me,jt*=Me,ee*=Me),dt.set(Pt,jt,ee,Me),Dt.equals(dt)===!1&&(n.clearColor(Pt,jt,ee,Me),Dt.copy(dt))},reset:function(){D=!1,pt=null,Dt.set(-1,0,0,0)}}}function r(){let D=!1,dt=null,pt=null,Dt=null;return{setTest:function(Pt){Pt?Ot(n.DEPTH_TEST):Tt(n.DEPTH_TEST)},setMask:function(Pt){dt!==Pt&&!D&&(n.depthMask(Pt),dt=Pt)},setFunc:function(Pt){if(pt!==Pt){switch(Pt){case vu:n.depthFunc(n.NEVER);break;case Mu:n.depthFunc(n.ALWAYS);break;case bu:n.depthFunc(n.LESS);break;case Cr:n.depthFunc(n.LEQUAL);break;case Su:n.depthFunc(n.EQUAL);break;case Eu:n.depthFunc(n.GEQUAL);break;case wu:n.depthFunc(n.GREATER);break;case Tu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pt=Pt}},setLocked:function(Pt){D=Pt},setClear:function(Pt){Dt!==Pt&&(n.clearDepth(Pt),Dt=Pt)},reset:function(){D=!1,dt=null,pt=null,Dt=null}}}function a(){let D=!1,dt=null,pt=null,Dt=null,Pt=null,jt=null,ee=null,Me=null,Ue=null;return{setTest:function(se){D||(se?Ot(n.STENCIL_TEST):Tt(n.STENCIL_TEST))},setMask:function(se){dt!==se&&!D&&(n.stencilMask(se),dt=se)},setFunc:function(se,Ne,gn){(pt!==se||Dt!==Ne||Pt!==gn)&&(n.stencilFunc(se,Ne,gn),pt=se,Dt=Ne,Pt=gn)},setOp:function(se,Ne,gn){(jt!==se||ee!==Ne||Me!==gn)&&(n.stencilOp(se,Ne,gn),jt=se,ee=Ne,Me=gn)},setLocked:function(se){D=se},setClear:function(se){Ue!==se&&(n.clearStencil(se),Ue=se)},reset:function(){D=!1,dt=null,pt=null,Dt=null,Pt=null,jt=null,ee=null,Me=null,Ue=null}}}let o=new s,c=new r,l=new a,h=new WeakMap,u=new WeakMap,d={},f={},g=new WeakMap,x=[],p=null,m=!1,M=null,_=null,y=null,P=null,T=null,A=null,F=null,b=new $t(0,0,0),w=0,N=!1,X=null,Q=null,L=null,O=null,V=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,Y=0,nt=n.getParameter(n.VERSION);nt.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(nt)[1]),q=Y>=1):nt.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),q=Y>=2);let tt=null,_t={},W=n.getParameter(n.SCISSOR_BOX),ot=n.getParameter(n.VIEWPORT),vt=new ue().fromArray(W),At=new ue().fromArray(ot);function Et(D,dt,pt,Dt){let Pt=new Uint8Array(4),jt=n.createTexture();n.bindTexture(D,jt),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ee=0;ee<pt;ee++)i&&(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)?n.texImage3D(dt,0,n.RGBA,1,1,Dt,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(dt+ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return jt}let Ut={};Ut[n.TEXTURE_2D]=Et(n.TEXTURE_2D,n.TEXTURE_2D,1),Ut[n.TEXTURE_CUBE_MAP]=Et(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ut[n.TEXTURE_2D_ARRAY]=Et(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ut[n.TEXTURE_3D]=Et(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ot(n.DEPTH_TEST),c.setFunc(Cr),Mt(!1),S(Mc),Ot(n.CULL_FACE),$(Wn);function Ot(D){d[D]!==!0&&(n.enable(D),d[D]=!0)}function Tt(D){d[D]!==!1&&(n.disable(D),d[D]=!1)}function Ft(D,dt){return f[D]!==dt?(n.bindFramebuffer(D,dt),f[D]=dt,i&&(D===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=dt),D===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=dt)),!0):!1}function I(D,dt){let pt=x,Dt=!1;if(D)if(pt=g.get(dt),pt===void 0&&(pt=[],g.set(dt,pt)),D.isWebGLMultipleRenderTargets){let Pt=D.texture;if(pt.length!==Pt.length||pt[0]!==n.COLOR_ATTACHMENT0){for(let jt=0,ee=Pt.length;jt<ee;jt++)pt[jt]=n.COLOR_ATTACHMENT0+jt;pt.length=Pt.length,Dt=!0}}else pt[0]!==n.COLOR_ATTACHMENT0&&(pt[0]=n.COLOR_ATTACHMENT0,Dt=!0);else pt[0]!==n.BACK&&(pt[0]=n.BACK,Dt=!0);Dt&&(e.isWebGL2?n.drawBuffers(pt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(pt))}function ft(D){return p!==D?(n.useProgram(D),p=D,!0):!1}let Z={[ai]:n.FUNC_ADD,[ru]:n.FUNC_SUBTRACT,[ou]:n.FUNC_REVERSE_SUBTRACT};if(i)Z[Ec]=n.MIN,Z[wc]=n.MAX;else{let D=t.get("EXT_blend_minmax");D!==null&&(Z[Ec]=D.MIN_EXT,Z[wc]=D.MAX_EXT)}let ct={[au]:n.ZERO,[cu]:n.ONE,[lu]:n.SRC_COLOR,[aa]:n.SRC_ALPHA,[mu]:n.SRC_ALPHA_SATURATE,[du]:n.DST_COLOR,[uu]:n.DST_ALPHA,[hu]:n.ONE_MINUS_SRC_COLOR,[ca]:n.ONE_MINUS_SRC_ALPHA,[pu]:n.ONE_MINUS_DST_COLOR,[fu]:n.ONE_MINUS_DST_ALPHA,[gu]:n.CONSTANT_COLOR,[xu]:n.ONE_MINUS_CONSTANT_COLOR,[_u]:n.CONSTANT_ALPHA,[yu]:n.ONE_MINUS_CONSTANT_ALPHA};function $(D,dt,pt,Dt,Pt,jt,ee,Me,Ue,se){if(D===Wn){m===!0&&(Tt(n.BLEND),m=!1);return}if(m===!1&&(Ot(n.BLEND),m=!0),D!==su){if(D!==M||se!==N){if((_!==ai||T!==ai)&&(n.blendEquation(n.FUNC_ADD),_=ai,T=ai),se)switch(D){case Wi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Rr:n.blendFunc(n.ONE,n.ONE);break;case bc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Wi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Rr:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case bc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}y=null,P=null,A=null,F=null,b.set(0,0,0),w=0,M=D,N=se}return}Pt=Pt||dt,jt=jt||pt,ee=ee||Dt,(dt!==_||Pt!==T)&&(n.blendEquationSeparate(Z[dt],Z[Pt]),_=dt,T=Pt),(pt!==y||Dt!==P||jt!==A||ee!==F)&&(n.blendFuncSeparate(ct[pt],ct[Dt],ct[jt],ct[ee]),y=pt,P=Dt,A=jt,F=ee),(Me.equals(b)===!1||Ue!==w)&&(n.blendColor(Me.r,Me.g,Me.b,Ue),b.copy(Me),w=Ue),M=D,N=!1}function Rt(D,dt){D.side===$e?Tt(n.CULL_FACE):Ot(n.CULL_FACE);let pt=D.side===Ie;dt&&(pt=!pt),Mt(pt),D.blending===Wi&&D.transparent===!1?$(Wn):$(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),c.setFunc(D.depthFunc),c.setTest(D.depthTest),c.setMask(D.depthWrite),o.setMask(D.colorWrite);let Dt=D.stencilWrite;l.setTest(Dt),Dt&&(l.setMask(D.stencilWriteMask),l.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),l.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),z(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Ot(n.SAMPLE_ALPHA_TO_COVERAGE):Tt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(D){X!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),X=D)}function S(D){D!==nu?(Ot(n.CULL_FACE),D!==Q&&(D===Mc?n.cullFace(n.BACK):D===iu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Tt(n.CULL_FACE),Q=D}function v(D){D!==L&&(q&&n.lineWidth(D),L=D)}function z(D,dt,pt){D?(Ot(n.POLYGON_OFFSET_FILL),(O!==dt||V!==pt)&&(n.polygonOffset(dt,pt),O=dt,V=pt)):Tt(n.POLYGON_OFFSET_FILL)}function at(D){D?Ot(n.SCISSOR_TEST):Tt(n.SCISSOR_TEST)}function it(D){D===void 0&&(D=n.TEXTURE0+K-1),tt!==D&&(n.activeTexture(D),tt=D)}function et(D,dt,pt){pt===void 0&&(tt===null?pt=n.TEXTURE0+K-1:pt=tt);let Dt=_t[pt];Dt===void 0&&(Dt={type:void 0,texture:void 0},_t[pt]=Dt),(Dt.type!==D||Dt.texture!==dt)&&(tt!==pt&&(n.activeTexture(pt),tt=pt),n.bindTexture(D,dt||Ut[D]),Dt.type=D,Dt.texture=dt)}function wt(){let D=_t[tt];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function yt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function bt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Lt(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function st(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function C(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function rt(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ht(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ct(D){vt.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),vt.copy(D))}function Yt(D){At.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),At.copy(D))}function Kt(D,dt){let pt=u.get(dt);pt===void 0&&(pt=new WeakMap,u.set(dt,pt));let Dt=pt.get(D);Dt===void 0&&(Dt=n.getUniformBlockIndex(dt,D.name),pt.set(D,Dt))}function Gt(D,dt){let Dt=u.get(dt).get(D);h.get(dt)!==Dt&&(n.uniformBlockBinding(dt,Dt,D.__bindingPointIndex),h.set(dt,Dt))}function mt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},tt=null,_t={},f={},g=new WeakMap,x=[],p=null,m=!1,M=null,_=null,y=null,P=null,T=null,A=null,F=null,b=new $t(0,0,0),w=0,N=!1,X=null,Q=null,L=null,O=null,V=null,vt.set(0,0,n.canvas.width,n.canvas.height),At.set(0,0,n.canvas.width,n.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:Ot,disable:Tt,bindFramebuffer:Ft,drawBuffers:I,useProgram:ft,setBlending:$,setMaterial:Rt,setFlipSided:Mt,setCullFace:S,setLineWidth:v,setPolygonOffset:z,setScissorTest:at,activeTexture:it,bindTexture:et,unbindTexture:wt,compressedTexImage2D:yt,compressedTexImage3D:bt,texImage2D:gt,texImage3D:ht,updateUBOMapping:Kt,uniformBlockBinding:Gt,texStorage2D:C,texStorage3D:rt,texSubImage2D:Lt,texSubImage3D:zt,compressedTexSubImage2D:st,compressedTexSubImage3D:Xt,scissor:Ct,viewport:Yt,reset:mt}}function eg(n,t,e,i,s,r,a){let o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,v){return f?new OffscreenCanvas(S,v):Fr("canvas")}function x(S,v,z,at){let it=1;if((S.width>at||S.height>at)&&(it=at/Math.max(S.width,S.height)),it<1||v===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){let et=v?Or:Math.floor,wt=et(it*S.width),yt=et(it*S.height);u===void 0&&(u=g(wt,yt));let bt=z?g(wt,yt):u;return bt.width=wt,bt.height=yt,bt.getContext("2d").drawImage(S,0,0,wt,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+wt+"x"+yt+")."),bt}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function p(S){return da(S.width)&&da(S.height)}function m(S){return o?!1:S.wrapS!==on||S.wrapT!==on||S.minFilter!==Be&&S.minFilter!==Ze}function M(S,v){return S.generateMipmaps&&v&&S.minFilter!==Be&&S.minFilter!==Ze}function _(S){n.generateMipmap(S)}function y(S,v,z,at,it=!1){if(o===!1)return v;if(S!==null){if(n[S]!==void 0)return n[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let et=v;if(v===n.RED&&(z===n.FLOAT&&(et=n.R32F),z===n.HALF_FLOAT&&(et=n.R16F),z===n.UNSIGNED_BYTE&&(et=n.R8)),v===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(et=n.R8UI),z===n.UNSIGNED_SHORT&&(et=n.R16UI),z===n.UNSIGNED_INT&&(et=n.R32UI),z===n.BYTE&&(et=n.R8I),z===n.SHORT&&(et=n.R16I),z===n.INT&&(et=n.R32I)),v===n.RG&&(z===n.FLOAT&&(et=n.RG32F),z===n.HALF_FLOAT&&(et=n.RG16F),z===n.UNSIGNED_BYTE&&(et=n.RG8)),v===n.RGBA){let wt=it?Lr:ie.getTransfer(at);z===n.FLOAT&&(et=n.RGBA32F),z===n.HALF_FLOAT&&(et=n.RGBA16F),z===n.UNSIGNED_BYTE&&(et=wt===ae?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(et=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(et=n.RGB5_A1)}return(et===n.R16F||et===n.R32F||et===n.RG16F||et===n.RG32F||et===n.RGBA16F||et===n.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function P(S,v,z){return M(S,z)===!0||S.isFramebufferTexture&&S.minFilter!==Be&&S.minFilter!==Ze?Math.log2(Math.max(v.width,v.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?v.mipmaps.length:1}function T(S){return S===Be||S===Tc||S===Ao?n.NEAREST:n.LINEAR}function A(S){let v=S.target;v.removeEventListener("dispose",A),b(v),v.isVideoTexture&&h.delete(v)}function F(S){let v=S.target;v.removeEventListener("dispose",F),N(v)}function b(S){let v=i.get(S);if(v.__webglInit===void 0)return;let z=S.source,at=d.get(z);if(at){let it=at[v.__cacheKey];it.usedTimes--,it.usedTimes===0&&w(S),Object.keys(at).length===0&&d.delete(z)}i.remove(S)}function w(S){let v=i.get(S);n.deleteTexture(v.__webglTexture);let z=S.source,at=d.get(z);delete at[v.__cacheKey],a.memory.textures--}function N(S){let v=S.texture,z=i.get(S),at=i.get(v);if(at.__webglTexture!==void 0&&(n.deleteTexture(at.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(z.__webglFramebuffer[it]))for(let et=0;et<z.__webglFramebuffer[it].length;et++)n.deleteFramebuffer(z.__webglFramebuffer[it][et]);else n.deleteFramebuffer(z.__webglFramebuffer[it]);z.__webglDepthbuffer&&n.deleteRenderbuffer(z.__webglDepthbuffer[it])}else{if(Array.isArray(z.__webglFramebuffer))for(let it=0;it<z.__webglFramebuffer.length;it++)n.deleteFramebuffer(z.__webglFramebuffer[it]);else n.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&n.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&n.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let it=0;it<z.__webglColorRenderbuffer.length;it++)z.__webglColorRenderbuffer[it]&&n.deleteRenderbuffer(z.__webglColorRenderbuffer[it]);z.__webglDepthRenderbuffer&&n.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let it=0,et=v.length;it<et;it++){let wt=i.get(v[it]);wt.__webglTexture&&(n.deleteTexture(wt.__webglTexture),a.memory.textures--),i.remove(v[it])}i.remove(v),i.remove(S)}let X=0;function Q(){X=0}function L(){let S=X;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),X+=1,S}function O(S){let v=[];return v.push(S.wrapS),v.push(S.wrapT),v.push(S.wrapR||0),v.push(S.magFilter),v.push(S.minFilter),v.push(S.anisotropy),v.push(S.internalFormat),v.push(S.format),v.push(S.type),v.push(S.generateMipmaps),v.push(S.premultiplyAlpha),v.push(S.flipY),v.push(S.unpackAlignment),v.push(S.colorSpace),v.join()}function V(S,v){let z=i.get(S);if(S.isVideoTexture&&Rt(S),S.isRenderTargetTexture===!1&&S.version>0&&z.__version!==S.version){let at=S.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{vt(z,S,v);return}}e.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+v)}function K(S,v){let z=i.get(S);if(S.version>0&&z.__version!==S.version){vt(z,S,v);return}e.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+v)}function q(S,v){let z=i.get(S);if(S.version>0&&z.__version!==S.version){vt(z,S,v);return}e.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+v)}function Y(S,v){let z=i.get(S);if(S.version>0&&z.__version!==S.version){At(z,S,v);return}e.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+v)}let nt={[Zn]:n.REPEAT,[on]:n.CLAMP_TO_EDGE,[ua]:n.MIRRORED_REPEAT},tt={[Be]:n.NEAREST,[Tc]:n.NEAREST_MIPMAP_NEAREST,[Ao]:n.NEAREST_MIPMAP_LINEAR,[Ze]:n.LINEAR,[Uu]:n.LINEAR_MIPMAP_NEAREST,[As]:n.LINEAR_MIPMAP_LINEAR},_t={[Yu]:n.NEVER,[ju]:n.ALWAYS,[qu]:n.LESS,[ch]:n.LEQUAL,[Zu]:n.EQUAL,[Ku]:n.GEQUAL,[$u]:n.GREATER,[Ju]:n.NOTEQUAL};function W(S,v,z){if(z?(n.texParameteri(S,n.TEXTURE_WRAP_S,nt[v.wrapS]),n.texParameteri(S,n.TEXTURE_WRAP_T,nt[v.wrapT]),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,nt[v.wrapR]),n.texParameteri(S,n.TEXTURE_MAG_FILTER,tt[v.magFilter]),n.texParameteri(S,n.TEXTURE_MIN_FILTER,tt[v.minFilter])):(n.texParameteri(S,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(S,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(v.wrapS!==on||v.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(S,n.TEXTURE_MAG_FILTER,T(v.magFilter)),n.texParameteri(S,n.TEXTURE_MIN_FILTER,T(v.minFilter)),v.minFilter!==Be&&v.minFilter!==Ze&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(n.texParameteri(S,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(S,n.TEXTURE_COMPARE_FUNC,_t[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let at=t.get("EXT_texture_filter_anisotropic");if(v.magFilter===Be||v.minFilter!==Ao&&v.minFilter!==As||v.type===Gn&&t.has("OES_texture_float_linear")===!1||o===!1&&v.type===Rs&&t.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||i.get(v).__currentAnisotropy)&&(n.texParameterf(S,at.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy)}}function ot(S,v){let z=!1;S.__webglInit===void 0&&(S.__webglInit=!0,v.addEventListener("dispose",A));let at=v.source,it=d.get(at);it===void 0&&(it={},d.set(at,it));let et=O(v);if(et!==S.__cacheKey){it[et]===void 0&&(it[et]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),it[et].usedTimes++;let wt=it[S.__cacheKey];wt!==void 0&&(it[S.__cacheKey].usedTimes--,wt.usedTimes===0&&w(v)),S.__cacheKey=et,S.__webglTexture=it[et].texture}return z}function vt(S,v,z){let at=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(at=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(at=n.TEXTURE_3D);let it=ot(S,v),et=v.source;e.bindTexture(at,S.__webglTexture,n.TEXTURE0+z);let wt=i.get(et);if(et.version!==wt.__version||it===!0){e.activeTexture(n.TEXTURE0+z);let yt=ie.getPrimaries(ie.workingColorSpace),bt=v.colorSpace===ke?null:ie.getPrimaries(v.colorSpace),Lt=v.colorSpace===ke||yt===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let zt=m(v)&&p(v.image)===!1,st=x(v.image,zt,!1,s.maxTextureSize);st=Mt(v,st);let Xt=p(st)||o,C=r.convert(v.format,v.colorSpace),rt=r.convert(v.type),gt=y(v.internalFormat,C,rt,v.colorSpace,v.isVideoTexture);W(at,v,Xt);let ht,Ct=v.mipmaps,Yt=o&&v.isVideoTexture!==!0&&gt!==rh,Kt=wt.__version===void 0||it===!0,Gt=P(v,st,Xt);if(v.isDepthTexture)gt=n.DEPTH_COMPONENT,o?v.type===Gn?gt=n.DEPTH_COMPONENT32F:v.type===Vn?gt=n.DEPTH_COMPONENT24:v.type===li?gt=n.DEPTH24_STENCIL8:gt=n.DEPTH_COMPONENT16:v.type===Gn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===hi&&gt===n.DEPTH_COMPONENT&&v.type!==ja&&v.type!==Vn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=Vn,rt=r.convert(v.type)),v.format===$i&&gt===n.DEPTH_COMPONENT&&(gt=n.DEPTH_STENCIL,v.type!==li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=li,rt=r.convert(v.type))),Kt&&(Yt?e.texStorage2D(n.TEXTURE_2D,1,gt,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,gt,st.width,st.height,0,C,rt,null));else if(v.isDataTexture)if(Ct.length>0&&Xt){Yt&&Kt&&e.texStorage2D(n.TEXTURE_2D,Gt,gt,Ct[0].width,Ct[0].height);for(let mt=0,D=Ct.length;mt<D;mt++)ht=Ct[mt],Yt?e.texSubImage2D(n.TEXTURE_2D,mt,0,0,ht.width,ht.height,C,rt,ht.data):e.texImage2D(n.TEXTURE_2D,mt,gt,ht.width,ht.height,0,C,rt,ht.data);v.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(n.TEXTURE_2D,Gt,gt,st.width,st.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,st.width,st.height,C,rt,st.data)):e.texImage2D(n.TEXTURE_2D,0,gt,st.width,st.height,0,C,rt,st.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Yt&&Kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Gt,gt,Ct[0].width,Ct[0].height,st.depth);for(let mt=0,D=Ct.length;mt<D;mt++)ht=Ct[mt],v.format!==an?C!==null?Yt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,mt,0,0,0,ht.width,ht.height,st.depth,C,ht.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,mt,gt,ht.width,ht.height,st.depth,0,ht.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,mt,0,0,0,ht.width,ht.height,st.depth,C,rt,ht.data):e.texImage3D(n.TEXTURE_2D_ARRAY,mt,gt,ht.width,ht.height,st.depth,0,C,rt,ht.data)}else{Yt&&Kt&&e.texStorage2D(n.TEXTURE_2D,Gt,gt,Ct[0].width,Ct[0].height);for(let mt=0,D=Ct.length;mt<D;mt++)ht=Ct[mt],v.format!==an?C!==null?Yt?e.compressedTexSubImage2D(n.TEXTURE_2D,mt,0,0,ht.width,ht.height,C,ht.data):e.compressedTexImage2D(n.TEXTURE_2D,mt,gt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage2D(n.TEXTURE_2D,mt,0,0,ht.width,ht.height,C,rt,ht.data):e.texImage2D(n.TEXTURE_2D,mt,gt,ht.width,ht.height,0,C,rt,ht.data)}else if(v.isDataArrayTexture)Yt?(Kt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Gt,gt,st.width,st.height,st.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,C,rt,st.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,gt,st.width,st.height,st.depth,0,C,rt,st.data);else if(v.isData3DTexture)Yt?(Kt&&e.texStorage3D(n.TEXTURE_3D,Gt,gt,st.width,st.height,st.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,C,rt,st.data)):e.texImage3D(n.TEXTURE_3D,0,gt,st.width,st.height,st.depth,0,C,rt,st.data);else if(v.isFramebufferTexture){if(Kt)if(Yt)e.texStorage2D(n.TEXTURE_2D,Gt,gt,st.width,st.height);else{let mt=st.width,D=st.height;for(let dt=0;dt<Gt;dt++)e.texImage2D(n.TEXTURE_2D,dt,gt,mt,D,0,C,rt,null),mt>>=1,D>>=1}}else if(Ct.length>0&&Xt){Yt&&Kt&&e.texStorage2D(n.TEXTURE_2D,Gt,gt,Ct[0].width,Ct[0].height);for(let mt=0,D=Ct.length;mt<D;mt++)ht=Ct[mt],Yt?e.texSubImage2D(n.TEXTURE_2D,mt,0,0,C,rt,ht):e.texImage2D(n.TEXTURE_2D,mt,gt,C,rt,ht);v.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(n.TEXTURE_2D,Gt,gt,st.width,st.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,C,rt,st)):e.texImage2D(n.TEXTURE_2D,0,gt,C,rt,st);M(v,Xt)&&_(at),wt.__version=et.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function At(S,v,z){if(v.image.length!==6)return;let at=ot(S,v),it=v.source;e.bindTexture(n.TEXTURE_CUBE_MAP,S.__webglTexture,n.TEXTURE0+z);let et=i.get(it);if(it.version!==et.__version||at===!0){e.activeTexture(n.TEXTURE0+z);let wt=ie.getPrimaries(ie.workingColorSpace),yt=v.colorSpace===ke?null:ie.getPrimaries(v.colorSpace),bt=v.colorSpace===ke||wt===yt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);let Lt=v.isCompressedTexture||v.image[0].isCompressedTexture,zt=v.image[0]&&v.image[0].isDataTexture,st=[];for(let mt=0;mt<6;mt++)!Lt&&!zt?st[mt]=x(v.image[mt],!1,!0,s.maxCubemapSize):st[mt]=zt?v.image[mt].image:v.image[mt],st[mt]=Mt(v,st[mt]);let Xt=st[0],C=p(Xt)||o,rt=r.convert(v.format,v.colorSpace),gt=r.convert(v.type),ht=y(v.internalFormat,rt,gt,v.colorSpace),Ct=o&&v.isVideoTexture!==!0,Yt=et.__version===void 0||at===!0,Kt=P(v,Xt,C);W(n.TEXTURE_CUBE_MAP,v,C);let Gt;if(Lt){Ct&&Yt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Kt,ht,Xt.width,Xt.height);for(let mt=0;mt<6;mt++){Gt=st[mt].mipmaps;for(let D=0;D<Gt.length;D++){let dt=Gt[D];v.format!==an?rt!==null?Ct?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D,0,0,dt.width,dt.height,rt,dt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D,ht,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ct?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D,0,0,dt.width,dt.height,rt,gt,dt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D,ht,dt.width,dt.height,0,rt,gt,dt.data)}}}else{Gt=v.mipmaps,Ct&&Yt&&(Gt.length>0&&Kt++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Kt,ht,st[0].width,st[0].height));for(let mt=0;mt<6;mt++)if(zt){Ct?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,st[mt].width,st[mt].height,rt,gt,st[mt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ht,st[mt].width,st[mt].height,0,rt,gt,st[mt].data);for(let D=0;D<Gt.length;D++){let pt=Gt[D].image[mt].image;Ct?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D+1,0,0,pt.width,pt.height,rt,gt,pt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D+1,ht,pt.width,pt.height,0,rt,gt,pt.data)}}else{Ct?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,rt,gt,st[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ht,rt,gt,st[mt]);for(let D=0;D<Gt.length;D++){let dt=Gt[D];Ct?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D+1,0,0,rt,gt,dt.image[mt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D+1,ht,rt,gt,dt.image[mt])}}}M(v,C)&&_(n.TEXTURE_CUBE_MAP),et.__version=it.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function Et(S,v,z,at,it,et){let wt=r.convert(z.format,z.colorSpace),yt=r.convert(z.type),bt=y(z.internalFormat,wt,yt,z.colorSpace);if(!i.get(v).__hasExternalTextures){let zt=Math.max(1,v.width>>et),st=Math.max(1,v.height>>et);it===n.TEXTURE_3D||it===n.TEXTURE_2D_ARRAY?e.texImage3D(it,et,bt,zt,st,v.depth,0,wt,yt,null):e.texImage2D(it,et,bt,zt,st,0,wt,yt,null)}e.bindFramebuffer(n.FRAMEBUFFER,S),$(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,at,it,i.get(z).__webglTexture,0,ct(v)):(it===n.TEXTURE_2D||it>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,at,it,i.get(z).__webglTexture,et),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(S,v,z){if(n.bindRenderbuffer(n.RENDERBUFFER,S),v.depthBuffer&&!v.stencilBuffer){let at=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(z||$(v)){let it=v.depthTexture;it&&it.isDepthTexture&&(it.type===Gn?at=n.DEPTH_COMPONENT32F:it.type===Vn&&(at=n.DEPTH_COMPONENT24));let et=ct(v);$(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,at,v.width,v.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,et,at,v.width,v.height)}else n.renderbufferStorage(n.RENDERBUFFER,at,v.width,v.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,S)}else if(v.depthBuffer&&v.stencilBuffer){let at=ct(v);z&&$(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,at,n.DEPTH24_STENCIL8,v.width,v.height):$(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,at,n.DEPTH24_STENCIL8,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,S)}else{let at=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let it=0;it<at.length;it++){let et=at[it],wt=r.convert(et.format,et.colorSpace),yt=r.convert(et.type),bt=y(et.internalFormat,wt,yt,et.colorSpace),Lt=ct(v);z&&$(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Lt,bt,v.width,v.height):$(v)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Lt,bt,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,bt,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ot(S,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,S),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),V(v.depthTexture,0);let at=i.get(v.depthTexture).__webglTexture,it=ct(v);if(v.depthTexture.format===hi)$(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,at,0);else if(v.depthTexture.format===$i)$(v)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function Tt(S){let v=i.get(S),z=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Ot(v.__webglFramebuffer,S)}else if(z){v.__webglDepthbuffer=[];for(let at=0;at<6;at++)e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[at]),v.__webglDepthbuffer[at]=n.createRenderbuffer(),Ut(v.__webglDepthbuffer[at],S,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),Ut(v.__webglDepthbuffer,S,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ft(S,v,z){let at=i.get(S);v!==void 0&&Et(at.__webglFramebuffer,S,S.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Tt(S)}function I(S){let v=S.texture,z=i.get(S),at=i.get(v);S.addEventListener("dispose",F),S.isWebGLMultipleRenderTargets!==!0&&(at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture()),at.__version=v.version,a.memory.textures++);let it=S.isWebGLCubeRenderTarget===!0,et=S.isWebGLMultipleRenderTargets===!0,wt=p(S)||o;if(it){z.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(o&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[yt]=[];for(let bt=0;bt<v.mipmaps.length;bt++)z.__webglFramebuffer[yt][bt]=n.createFramebuffer()}else z.__webglFramebuffer[yt]=n.createFramebuffer()}else{if(o&&v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let yt=0;yt<v.mipmaps.length;yt++)z.__webglFramebuffer[yt]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(et)if(s.drawBuffers){let yt=S.texture;for(let bt=0,Lt=yt.length;bt<Lt;bt++){let zt=i.get(yt[bt]);zt.__webglTexture===void 0&&(zt.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&S.samples>0&&$(S)===!1){let yt=et?v:[v];z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let bt=0;bt<yt.length;bt++){let Lt=yt[bt];z.__webglColorRenderbuffer[bt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[bt]);let zt=r.convert(Lt.format,Lt.colorSpace),st=r.convert(Lt.type),Xt=y(Lt.internalFormat,zt,st,Lt.colorSpace,S.isXRRenderTarget===!0),C=ct(S);n.renderbufferStorageMultisample(n.RENDERBUFFER,C,Xt,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,z.__webglColorRenderbuffer[bt])}n.bindRenderbuffer(n.RENDERBUFFER,null),S.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),Ut(z.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,at.__webglTexture),W(n.TEXTURE_CUBE_MAP,v,wt);for(let yt=0;yt<6;yt++)if(o&&v.mipmaps&&v.mipmaps.length>0)for(let bt=0;bt<v.mipmaps.length;bt++)Et(z.__webglFramebuffer[yt][bt],S,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,bt);else Et(z.__webglFramebuffer[yt],S,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);M(v,wt)&&_(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){let yt=S.texture;for(let bt=0,Lt=yt.length;bt<Lt;bt++){let zt=yt[bt],st=i.get(zt);e.bindTexture(n.TEXTURE_2D,st.__webglTexture),W(n.TEXTURE_2D,zt,wt),Et(z.__webglFramebuffer,S,zt,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,0),M(zt,wt)&&_(n.TEXTURE_2D)}e.unbindTexture()}else{let yt=n.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(o?yt=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(yt,at.__webglTexture),W(yt,v,wt),o&&v.mipmaps&&v.mipmaps.length>0)for(let bt=0;bt<v.mipmaps.length;bt++)Et(z.__webglFramebuffer[bt],S,v,n.COLOR_ATTACHMENT0,yt,bt);else Et(z.__webglFramebuffer,S,v,n.COLOR_ATTACHMENT0,yt,0);M(v,wt)&&_(yt),e.unbindTexture()}S.depthBuffer&&Tt(S)}function ft(S){let v=p(S)||o,z=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let at=0,it=z.length;at<it;at++){let et=z[at];if(M(et,v)){let wt=S.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,yt=i.get(et).__webglTexture;e.bindTexture(wt,yt),_(wt),e.unbindTexture()}}}function Z(S){if(o&&S.samples>0&&$(S)===!1){let v=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],z=S.width,at=S.height,it=n.COLOR_BUFFER_BIT,et=[],wt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,yt=i.get(S),bt=S.isWebGLMultipleRenderTargets===!0;if(bt)for(let Lt=0;Lt<v.length;Lt++)e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Lt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Lt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Lt=0;Lt<v.length;Lt++){et.push(n.COLOR_ATTACHMENT0+Lt),S.depthBuffer&&et.push(wt);let zt=yt.__ignoreDepthValues!==void 0?yt.__ignoreDepthValues:!1;if(zt===!1&&(S.depthBuffer&&(it|=n.DEPTH_BUFFER_BIT),S.stencilBuffer&&(it|=n.STENCIL_BUFFER_BIT)),bt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,yt.__webglColorRenderbuffer[Lt]),zt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[wt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[wt])),bt){let st=i.get(v[Lt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,st,0)}n.blitFramebuffer(0,0,z,at,0,0,z,at,it,n.NEAREST),l&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),bt)for(let Lt=0;Lt<v.length;Lt++){e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Lt,n.RENDERBUFFER,yt.__webglColorRenderbuffer[Lt]);let zt=i.get(v[Lt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Lt,n.TEXTURE_2D,zt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}}function ct(S){return Math.min(s.maxSamples,S.samples)}function $(S){let v=i.get(S);return o&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Rt(S){let v=a.render.frame;h.get(S)!==v&&(h.set(S,v),S.update())}function Mt(S,v){let z=S.colorSpace,at=S.format,it=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===fa||z!==Rn&&z!==ke&&(ie.getTransfer(z)===ae?o===!1?t.has("EXT_sRGB")===!0&&at===an?(S.format=fa,S.minFilter=Ze,S.generateMipmaps=!1):v=Br.sRGBToLinear(v):(at!==an||it!==Yn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}this.allocateTextureUnit=L,this.resetTextureUnits=Q,this.setTexture2D=V,this.setTexture2DArray=K,this.setTexture3D=q,this.setTextureCube=Y,this.rebindTextures=Ft,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Tt,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=$}function ng(n,t,e){let i=e.isWebGL2;function s(r,a=ke){let o,c=ie.getTransfer(a);if(r===Yn)return n.UNSIGNED_BYTE;if(r===th)return n.UNSIGNED_SHORT_4_4_4_4;if(r===eh)return n.UNSIGNED_SHORT_5_5_5_1;if(r===Nu)return n.BYTE;if(r===Ou)return n.SHORT;if(r===ja)return n.UNSIGNED_SHORT;if(r===Ql)return n.INT;if(r===Vn)return n.UNSIGNED_INT;if(r===Gn)return n.FLOAT;if(r===Rs)return i?n.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Fu)return n.ALPHA;if(r===an)return n.RGBA;if(r===Bu)return n.LUMINANCE;if(r===zu)return n.LUMINANCE_ALPHA;if(r===hi)return n.DEPTH_COMPONENT;if(r===$i)return n.DEPTH_STENCIL;if(r===fa)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===ku)return n.RED;if(r===nh)return n.RED_INTEGER;if(r===Hu)return n.RG;if(r===ih)return n.RG_INTEGER;if(r===sh)return n.RGBA_INTEGER;if(r===Ro||r===Co||r===Po||r===Io)if(c===ae)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Ro)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Co)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Po)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Io)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Ro)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Co)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Po)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Io)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ac||r===Rc||r===Cc||r===Pc)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Ac)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Rc)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Cc)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Pc)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===rh)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ic||r===Lc)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Ic)return c===ae?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Lc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Dc||r===Uc||r===Nc||r===Oc||r===Fc||r===Bc||r===zc||r===kc||r===Hc||r===Vc||r===Gc||r===Wc||r===Xc||r===Yc)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Dc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Uc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Nc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Bc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===zc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===kc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Hc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Vc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Gc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Wc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Xc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Yc)return c===ae?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Lo||r===qc||r===Zc)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Lo)return c===ae?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===qc)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Zc)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Vu||r===$c||r===Jc||r===Kc)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Lo)return o.COMPRESSED_RED_RGTC1_EXT;if(r===$c)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Jc)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Kc)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===li?i?n.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}var Ta=class extends we{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},le=class extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}},ig={type:"move"},Ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let x of t.hand.values()){let p=e.getJointPose(x,i),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ig)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new le;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Aa=class extends _n{constructor(t,e){super();let i=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null,x=e.getContextAttributes(),p=null,m=null,M=[],_=[],y=new j,P=null,T=new we;T.layers.enable(1),T.viewport=new ue;let A=new we;A.layers.enable(2),A.viewport=new ue;let F=[T,A],b=new Ta;b.layers.enable(1),b.layers.enable(2);let w=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let ot=M[W];return ot===void 0&&(ot=new Ss,M[W]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(W){let ot=M[W];return ot===void 0&&(ot=new Ss,M[W]=ot),ot.getGripSpace()},this.getHand=function(W){let ot=M[W];return ot===void 0&&(ot=new Ss,M[W]=ot),ot.getHandSpace()};function X(W){let ot=_.indexOf(W.inputSource);if(ot===-1)return;let vt=M[ot];vt!==void 0&&(vt.update(W.inputSource,W.frame,l||a),vt.dispatchEvent({type:W.type,data:W.inputSource}))}function Q(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",Q),s.removeEventListener("inputsourceschange",L);for(let W=0;W<M.length;W++){let ot=_[W];ot!==null&&(_[W]=null,M[W].disconnect(ot))}w=null,N=null,t.setRenderTarget(p),f=null,d=null,u=null,s=null,m=null,_t.stop(),i.isPresenting=!1,t.setPixelRatio(P),t.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",Q),s.addEventListener("inputsourceschange",L),x.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(y),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let ot={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,ot),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),m=new Cn(f.framebufferWidth,f.framebufferHeight,{format:an,type:Yn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let ot=null,vt=null,At=null;x.depth&&(At=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=x.stencil?$i:hi,vt=x.stencil?li:Vn);let Et={colorFormat:e.RGBA8,depthFormat:At,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Et),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),m=new Cn(d.textureWidth,d.textureHeight,{format:an,type:Yn,depthTexture:new qr(d.textureWidth,d.textureHeight,vt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});let Ut=t.properties.get(m);Ut.__ignoreDepthValues=d.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),_t.setContext(s),_t.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function L(W){for(let ot=0;ot<W.removed.length;ot++){let vt=W.removed[ot],At=_.indexOf(vt);At>=0&&(_[At]=null,M[At].disconnect(vt))}for(let ot=0;ot<W.added.length;ot++){let vt=W.added[ot],At=_.indexOf(vt);if(At===-1){for(let Ut=0;Ut<M.length;Ut++)if(Ut>=_.length){_.push(vt),At=Ut;break}else if(_[Ut]===null){_[Ut]=vt,At=Ut;break}if(At===-1)break}let Et=M[At];Et&&Et.connect(vt)}}let O=new R,V=new R;function K(W,ot,vt){O.setFromMatrixPosition(ot.matrixWorld),V.setFromMatrixPosition(vt.matrixWorld);let At=O.distanceTo(V),Et=ot.projectionMatrix.elements,Ut=vt.projectionMatrix.elements,Ot=Et[14]/(Et[10]-1),Tt=Et[14]/(Et[10]+1),Ft=(Et[9]+1)/Et[5],I=(Et[9]-1)/Et[5],ft=(Et[8]-1)/Et[0],Z=(Ut[8]+1)/Ut[0],ct=Ot*ft,$=Ot*Z,Rt=At/(-ft+Z),Mt=Rt*-ft;ot.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Mt),W.translateZ(Rt),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert();let S=Ot+Rt,v=Tt+Rt,z=ct-Mt,at=$+(At-Mt),it=Ft*Tt/v*S,et=I*Tt/v*S;W.projectionMatrix.makePerspective(z,at,it,et,S,v),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}function q(W,ot){ot===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(ot.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;b.near=A.near=T.near=W.near,b.far=A.far=T.far=W.far,(w!==b.near||N!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),w=b.near,N=b.far);let ot=W.parent,vt=b.cameras;q(b,ot);for(let At=0;At<vt.length;At++)q(vt[At],ot);vt.length===2?K(b,T,A):b.projectionMatrix.copy(T.projectionMatrix),Y(W,b,ot)};function Y(W,ot,vt){vt===null?W.matrix.copy(ot.matrixWorld):(W.matrix.copy(vt.matrixWorld),W.matrix.invert(),W.matrix.multiply(ot.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(ot.projectionMatrix),W.projectionMatrixInverse.copy(ot.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Ji*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(W){c=W,d!==null&&(d.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)};let nt=null;function tt(W,ot){if(h=ot.getViewerPose(l||a),g=ot,h!==null){let vt=h.views;f!==null&&(t.setRenderTargetFramebuffer(m,f.framebuffer),t.setRenderTarget(m));let At=!1;vt.length!==b.cameras.length&&(b.cameras.length=0,At=!0);for(let Et=0;Et<vt.length;Et++){let Ut=vt[Et],Ot=null;if(f!==null)Ot=f.getViewport(Ut);else{let Ft=u.getViewSubImage(d,Ut);Ot=Ft.viewport,Et===0&&(t.setRenderTargetTextures(m,Ft.colorTexture,d.ignoreDepthValues?void 0:Ft.depthStencilTexture),t.setRenderTarget(m))}let Tt=F[Et];Tt===void 0&&(Tt=new we,Tt.layers.enable(Et),Tt.viewport=new ue,F[Et]=Tt),Tt.matrix.fromArray(Ut.transform.matrix),Tt.matrix.decompose(Tt.position,Tt.quaternion,Tt.scale),Tt.projectionMatrix.fromArray(Ut.projectionMatrix),Tt.projectionMatrixInverse.copy(Tt.projectionMatrix).invert(),Tt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),Et===0&&(b.matrix.copy(Tt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),At===!0&&b.cameras.push(Tt)}}for(let vt=0;vt<M.length;vt++){let At=_[vt],Et=M[vt];At!==null&&Et!==void 0&&Et.update(At,ot,l||a)}nt&&nt(W,ot),ot.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ot}),g=null}let _t=new dh;_t.setAnimationLoop(tt),this.setAnimationLoop=function(W){nt=W},this.dispose=function(){}}};function sg(n,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,fh(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,M,_,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),x(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,M,_):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ie&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ie&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let M=t.get(m).envMap;if(M&&(p.envMap.value=M,p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap){p.lightMap.value=m.lightMap;let _=n._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=m.lightMapIntensity*_,e(m.lightMap,p.lightMapTransform)}m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,M,_){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=_*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),t.get(m).envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ie&&p.clearcoatNormalScale.value.negate())),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let M=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function rg(n,t,e,i){let s={},r={},a=[],o=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(M,_){let y=_.program;i.uniformBlockBinding(M,y)}function l(M,_){let y=s[M.id];y===void 0&&(g(M),y=h(M),s[M.id]=y,M.addEventListener("dispose",p));let P=_.program;i.updateUBOMapping(M,P);let T=t.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function h(M){let _=u();M.__bindingPointIndex=_;let y=n.createBuffer(),P=M.__size,T=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,y),y}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let _=s[M.id],y=M.uniforms,P=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let T=0,A=y.length;T<A;T++){let F=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,w=F.length;b<w;b++){let N=F[b];if(f(N,T,b,P)===!0){let X=N.__offset,Q=Array.isArray(N.value)?N.value:[N.value],L=0;for(let O=0;O<Q.length;O++){let V=Q[O],K=x(V);typeof V=="number"||typeof V=="boolean"?(N.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,X+L,N.__data)):V.isMatrix3?(N.__data[0]=V.elements[0],N.__data[1]=V.elements[1],N.__data[2]=V.elements[2],N.__data[3]=0,N.__data[4]=V.elements[3],N.__data[5]=V.elements[4],N.__data[6]=V.elements[5],N.__data[7]=0,N.__data[8]=V.elements[6],N.__data[9]=V.elements[7],N.__data[10]=V.elements[8],N.__data[11]=0):(V.toArray(N.__data,L),L+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,X,N.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,_,y,P){let T=M.value,A=_+"_"+y;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{let F=P[A];if(typeof T=="number"||typeof T=="boolean"){if(F!==T)return P[A]=T,!0}else if(F.equals(T)===!1)return F.copy(T),!0}return!1}function g(M){let _=M.uniforms,y=0,P=16;for(let A=0,F=_.length;A<F;A++){let b=Array.isArray(_[A])?_[A]:[_[A]];for(let w=0,N=b.length;w<N;w++){let X=b[w],Q=Array.isArray(X.value)?X.value:[X.value];for(let L=0,O=Q.length;L<O;L++){let V=Q[L],K=x(V),q=y%P;q!==0&&P-q<K.boundary&&(y+=P-q),X.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=y,y+=K.storage}}}let T=y%P;return T>0&&(y+=P-T),M.__size=y,M.__cache={},this}function x(M){let _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),_}function p(M){let _=M.target;_.removeEventListener("dispose",p);let y=a.indexOf(_.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function m(){for(let M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}var Ls=class{constructor(t={}){let{canvas:e=pf(),context:i=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=a;let f=new Uint32Array(4),g=new Int32Array(4),x=null,p=null,m=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ce,this._useLegacyLights=!1,this.toneMapping=Xn,this.toneMappingExposure=1;let _=this,y=!1,P=0,T=0,A=null,F=-1,b=null,w=new ue,N=new ue,X=null,Q=new $t(0),L=0,O=e.width,V=e.height,K=1,q=null,Y=null,nt=new ue(0,0,O,V),tt=new ue(0,0,O,V),_t=!1,W=new Is,ot=!1,vt=!1,At=null,Et=new pe,Ut=new j,Ot=new R,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ft(){return A===null?K:1}let I=i;function ft(E,B){for(let H=0;H<E.length;H++){let G=E[H],k=e.getContext(G,B);if(k!==null)return k}return null}try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$a}`),e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",dt,!1),I===null){let B=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&B.shift(),I=ft(B,E),I===null)throw ft(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&I instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),I.getShaderPrecisionFormat===void 0&&(I.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Z,ct,$,Rt,Mt,S,v,z,at,it,et,wt,yt,bt,Lt,zt,st,Xt,C,rt,gt,ht,Ct,Yt;function Kt(){Z=new E0(I),ct=new _0(I,Z,t),Z.init(ct),ht=new ng(I,Z,ct),$=new tg(I,Z,ct),Rt=new A0(I),Mt=new Vm,S=new eg(I,Z,$,Mt,ct,ht,Rt),v=new v0(_),z=new S0(_),at=new Nf(I,ct),Ct=new g0(I,Z,at,ct),it=new w0(I,at,Rt,Ct),et=new I0(I,it,at,Rt),C=new P0(I,ct,S),zt=new y0(Mt),wt=new Hm(_,v,z,Z,ct,Ct,zt),yt=new sg(_,Mt),bt=new Wm,Lt=new Jm(Z,ct),Xt=new m0(_,v,z,$,et,d,c),st=new Qm(_,et,ct),Yt=new rg(I,Rt,ct,$),rt=new x0(I,Z,Rt,ct),gt=new T0(I,Z,Rt,ct),Rt.programs=wt.programs,_.capabilities=ct,_.extensions=Z,_.properties=Mt,_.renderLists=bt,_.shadowMap=st,_.state=$,_.info=Rt}Kt();let Gt=new Aa(_,I);this.xr=Gt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let E=Z.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Z.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(E){E!==void 0&&(K=E,this.setSize(O,V,!1))},this.getSize=function(E){return E.set(O,V)},this.setSize=function(E,B,H=!0){if(Gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=E,V=B,e.width=Math.floor(E*K),e.height=Math.floor(B*K),H===!0&&(e.style.width=E+"px",e.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(O*K,V*K).floor()},this.setDrawingBufferSize=function(E,B,H){O=E,V=B,K=H,e.width=Math.floor(E*H),e.height=Math.floor(B*H),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(w)},this.getViewport=function(E){return E.copy(nt)},this.setViewport=function(E,B,H,G){E.isVector4?nt.set(E.x,E.y,E.z,E.w):nt.set(E,B,H,G),$.viewport(w.copy(nt).multiplyScalar(K).floor())},this.getScissor=function(E){return E.copy(tt)},this.setScissor=function(E,B,H,G){E.isVector4?tt.set(E.x,E.y,E.z,E.w):tt.set(E,B,H,G),$.scissor(N.copy(tt).multiplyScalar(K).floor())},this.getScissorTest=function(){return _t},this.setScissorTest=function(E){$.setScissorTest(_t=E)},this.setOpaqueSort=function(E){q=E},this.setTransparentSort=function(E){Y=E},this.getClearColor=function(E){return E.copy(Xt.getClearColor())},this.setClearColor=function(){Xt.setClearColor.apply(Xt,arguments)},this.getClearAlpha=function(){return Xt.getClearAlpha()},this.setClearAlpha=function(){Xt.setClearAlpha.apply(Xt,arguments)},this.clear=function(E=!0,B=!0,H=!0){let G=0;if(E){let k=!1;if(A!==null){let St=A.texture.format;k=St===sh||St===ih||St===nh}if(k){let St=A.texture.type,It=St===Yn||St===Vn||St===ja||St===li||St===th||St===eh,Nt=Xt.getClearColor(),Bt=Xt.getClearAlpha(),Wt=Nt.r,kt=Nt.g,Ht=Nt.b;It?(f[0]=Wt,f[1]=kt,f[2]=Ht,f[3]=Bt,I.clearBufferuiv(I.COLOR,0,f)):(g[0]=Wt,g[1]=kt,g[2]=Ht,g[3]=Bt,I.clearBufferiv(I.COLOR,0,g))}else G|=I.COLOR_BUFFER_BIT}B&&(G|=I.DEPTH_BUFFER_BIT),H&&(G|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),bt.dispose(),Lt.dispose(),Mt.dispose(),v.dispose(),z.dispose(),et.dispose(),Ct.dispose(),Yt.dispose(),wt.dispose(),Gt.dispose(),Gt.removeEventListener("sessionstart",Ue),Gt.removeEventListener("sessionend",se),At&&(At.dispose(),At=null),Ne.stop()};function mt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;let E=Rt.autoReset,B=st.enabled,H=st.autoUpdate,G=st.needsUpdate,k=st.type;Kt(),Rt.autoReset=E,st.enabled=B,st.autoUpdate=H,st.needsUpdate=G,st.type=k}function dt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function pt(E){let B=E.target;B.removeEventListener("dispose",pt),Dt(B)}function Dt(E){Pt(E),Mt.remove(E)}function Pt(E){let B=Mt.get(E).programs;B!==void 0&&(B.forEach(function(H){wt.releaseProgram(H)}),E.isShaderMaterial&&wt.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,H,G,k,St){B===null&&(B=Tt);let It=k.isMesh&&k.matrixWorld.determinant()<0,Nt=jh(E,B,H,G,k);$.setMaterial(G,It);let Bt=H.index,Wt=1;if(G.wireframe===!0){if(Bt=it.getWireframeAttribute(H),Bt===void 0)return;Wt=2}let kt=H.drawRange,Ht=H.attributes.position,ge=kt.start*Wt,Ge=(kt.start+kt.count)*Wt;St!==null&&(ge=Math.max(ge,St.start*Wt),Ge=Math.min(Ge,(St.start+St.count)*Wt)),Bt!==null?(ge=Math.max(ge,0),Ge=Math.min(Ge,Bt.count)):Ht!=null&&(ge=Math.max(ge,0),Ge=Math.min(Ge,Ht.count));let be=Ge-ge;if(be<0||be===1/0)return;Ct.setup(k,G,Nt,H,Bt);let vn,fe=rt;if(Bt!==null&&(vn=at.get(Bt),fe=gt,fe.setIndex(vn)),k.isMesh)G.wireframe===!0?($.setLineWidth(G.wireframeLinewidth*Ft()),fe.setMode(I.LINES)):fe.setMode(I.TRIANGLES);else if(k.isLine){let qt=G.linewidth;qt===void 0&&(qt=1),$.setLineWidth(qt*Ft()),k.isLineSegments?fe.setMode(I.LINES):k.isLineLoop?fe.setMode(I.LINE_LOOP):fe.setMode(I.LINE_STRIP)}else k.isPoints?fe.setMode(I.POINTS):k.isSprite&&fe.setMode(I.TRIANGLES);if(k.isBatchedMesh)fe.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else if(k.isInstancedMesh)fe.renderInstances(ge,be,k.count);else if(H.isInstancedBufferGeometry){let qt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,So=Math.min(H.instanceCount,qt);fe.renderInstances(ge,be,So)}else fe.render(ge,be)};function jt(E,B,H){E.transparent===!0&&E.side===$e&&E.forceSinglePass===!1?(E.side=Ie,E.needsUpdate=!0,er(E,B,H),E.side=qn,E.needsUpdate=!0,er(E,B,H),E.side=$e):er(E,B,H)}this.compile=function(E,B,H=null){H===null&&(H=E),p=Lt.get(H),p.init(),M.push(p),H.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),E!==H&&E.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights(_._useLegacyLights);let G=new Set;return E.traverse(function(k){let St=k.material;if(St)if(Array.isArray(St))for(let It=0;It<St.length;It++){let Nt=St[It];jt(Nt,H,k),G.add(Nt)}else jt(St,H,k),G.add(St)}),M.pop(),p=null,G},this.compileAsync=function(E,B,H=null){let G=this.compile(E,B,H);return new Promise(k=>{function St(){if(G.forEach(function(It){Mt.get(It).currentProgram.isReady()&&G.delete(It)}),G.size===0){k(E);return}setTimeout(St,10)}Z.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let ee=null;function Me(E){ee&&ee(E)}function Ue(){Ne.stop()}function se(){Ne.start()}let Ne=new dh;Ne.setAnimationLoop(Me),typeof self<"u"&&Ne.setContext(self),this.setAnimationLoop=function(E){ee=E,Gt.setAnimationLoop(E),E===null?Ne.stop():Ne.start()},Gt.addEventListener("sessionstart",Ue),Gt.addEventListener("sessionend",se),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Gt.enabled===!0&&Gt.isPresenting===!0&&(Gt.cameraAutoUpdate===!0&&Gt.updateCamera(B),B=Gt.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,B,A),p=Lt.get(E,M.length),p.init(),M.push(p),Et.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),W.setFromProjectionMatrix(Et),vt=this.localClippingEnabled,ot=zt.init(this.clippingPlanes,vt),x=bt.get(E,m.length),x.init(),m.push(x),gn(E,B,0,_.sortObjects),x.finish(),_.sortObjects===!0&&x.sort(q,Y),this.info.render.frame++,ot===!0&&zt.beginShadows();let H=p.state.shadowsArray;if(st.render(H,E,B),ot===!0&&zt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Xt.render(x,E),p.setupLights(_._useLegacyLights),B.isArrayCamera){let G=B.cameras;for(let k=0,St=G.length;k<St;k++){let It=G[k];mc(x,E,It,It.viewport)}}else mc(x,E,B);A!==null&&(S.updateMultisampleRenderTarget(A),S.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(_,E,B),Ct.resetDefaultState(),F=-1,b=null,M.pop(),M.length>0?p=M[M.length-1]:p=null,m.pop(),m.length>0?x=m[m.length-1]:x=null};function gn(E,B,H,G){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||W.intersectsSprite(E)){G&&Ot.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Et);let It=et.update(E),Nt=E.material;Nt.visible&&x.push(E,It,Nt,H,Ot.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||W.intersectsObject(E))){let It=et.update(E),Nt=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ot.copy(E.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),Ot.copy(It.boundingSphere.center)),Ot.applyMatrix4(E.matrixWorld).applyMatrix4(Et)),Array.isArray(Nt)){let Bt=It.groups;for(let Wt=0,kt=Bt.length;Wt<kt;Wt++){let Ht=Bt[Wt],ge=Nt[Ht.materialIndex];ge&&ge.visible&&x.push(E,It,ge,H,Ot.z,Ht)}}else Nt.visible&&x.push(E,It,Nt,H,Ot.z,null)}}let St=E.children;for(let It=0,Nt=St.length;It<Nt;It++)gn(St[It],B,H,G)}function mc(E,B,H,G){let k=E.opaque,St=E.transmissive,It=E.transparent;p.setupLightsView(H),ot===!0&&zt.setGlobalState(_.clippingPlanes,H),St.length>0&&Kh(k,St,B,H),G&&$.viewport(w.copy(G)),k.length>0&&tr(k,B,H),St.length>0&&tr(St,B,H),It.length>0&&tr(It,B,H),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function Kh(E,B,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;let St=ct.isWebGL2;At===null&&(At=new Cn(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")?Rs:Yn,minFilter:As,samples:St?4:0})),_.getDrawingBufferSize(Ut),St?At.setSize(Ut.x,Ut.y):At.setSize(Or(Ut.x),Or(Ut.y));let It=_.getRenderTarget();_.setRenderTarget(At),_.getClearColor(Q),L=_.getClearAlpha(),L<1&&_.setClearColor(16777215,.5),_.clear();let Nt=_.toneMapping;_.toneMapping=Xn,tr(E,H,G),S.updateMultisampleRenderTarget(At),S.updateRenderTargetMipmap(At);let Bt=!1;for(let Wt=0,kt=B.length;Wt<kt;Wt++){let Ht=B[Wt],ge=Ht.object,Ge=Ht.geometry,be=Ht.material,vn=Ht.group;if(be.side===$e&&ge.layers.test(G.layers)){let fe=be.side;be.side=Ie,be.needsUpdate=!0,gc(ge,H,G,Ge,be,vn),be.side=fe,be.needsUpdate=!0,Bt=!0}}Bt===!0&&(S.updateMultisampleRenderTarget(At),S.updateRenderTargetMipmap(At)),_.setRenderTarget(It),_.setClearColor(Q,L),_.toneMapping=Nt}function tr(E,B,H){let G=B.isScene===!0?B.overrideMaterial:null;for(let k=0,St=E.length;k<St;k++){let It=E[k],Nt=It.object,Bt=It.geometry,Wt=G===null?It.material:G,kt=It.group;Nt.layers.test(H.layers)&&gc(Nt,B,H,Bt,Wt,kt)}}function gc(E,B,H,G,k,St){E.onBeforeRender(_,B,H,G,k,St),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(_,B,H,G,E,St),k.transparent===!0&&k.side===$e&&k.forceSinglePass===!1?(k.side=Ie,k.needsUpdate=!0,_.renderBufferDirect(H,B,G,k,E,St),k.side=qn,k.needsUpdate=!0,_.renderBufferDirect(H,B,G,k,E,St),k.side=$e):_.renderBufferDirect(H,B,G,k,E,St),E.onAfterRender(_,B,H,G,k,St)}function er(E,B,H){B.isScene!==!0&&(B=Tt);let G=Mt.get(E),k=p.state.lights,St=p.state.shadowsArray,It=k.state.version,Nt=wt.getParameters(E,k.state,St,B,H),Bt=wt.getProgramCacheKey(Nt),Wt=G.programs;G.environment=E.isMeshStandardMaterial?B.environment:null,G.fog=B.fog,G.envMap=(E.isMeshStandardMaterial?z:v).get(E.envMap||G.environment),Wt===void 0&&(E.addEventListener("dispose",pt),Wt=new Map,G.programs=Wt);let kt=Wt.get(Bt);if(kt!==void 0){if(G.currentProgram===kt&&G.lightsStateVersion===It)return _c(E,Nt),kt}else Nt.uniforms=wt.getUniforms(E),E.onBuild(H,Nt,_),E.onBeforeCompile(Nt,_),kt=wt.acquireProgram(Nt,Bt),Wt.set(Bt,kt),G.uniforms=Nt.uniforms;let Ht=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ht.clippingPlanes=zt.uniform),_c(E,Nt),G.needsLights=tu(E),G.lightsStateVersion=It,G.needsLights&&(Ht.ambientLightColor.value=k.state.ambient,Ht.lightProbe.value=k.state.probe,Ht.directionalLights.value=k.state.directional,Ht.directionalLightShadows.value=k.state.directionalShadow,Ht.spotLights.value=k.state.spot,Ht.spotLightShadows.value=k.state.spotShadow,Ht.rectAreaLights.value=k.state.rectArea,Ht.ltc_1.value=k.state.rectAreaLTC1,Ht.ltc_2.value=k.state.rectAreaLTC2,Ht.pointLights.value=k.state.point,Ht.pointLightShadows.value=k.state.pointShadow,Ht.hemisphereLights.value=k.state.hemi,Ht.directionalShadowMap.value=k.state.directionalShadowMap,Ht.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ht.spotShadowMap.value=k.state.spotShadowMap,Ht.spotLightMatrix.value=k.state.spotLightMatrix,Ht.spotLightMap.value=k.state.spotLightMap,Ht.pointShadowMap.value=k.state.pointShadowMap,Ht.pointShadowMatrix.value=k.state.pointShadowMatrix),G.currentProgram=kt,G.uniformsList=null,kt}function xc(E){if(E.uniformsList===null){let B=E.currentProgram.getUniforms();E.uniformsList=Yi.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function _c(E,B){let H=Mt.get(E);H.outputColorSpace=B.outputColorSpace,H.batching=B.batching,H.instancing=B.instancing,H.instancingColor=B.instancingColor,H.skinning=B.skinning,H.morphTargets=B.morphTargets,H.morphNormals=B.morphNormals,H.morphColors=B.morphColors,H.morphTargetsCount=B.morphTargetsCount,H.numClippingPlanes=B.numClippingPlanes,H.numIntersection=B.numClipIntersection,H.vertexAlphas=B.vertexAlphas,H.vertexTangents=B.vertexTangents,H.toneMapping=B.toneMapping}function jh(E,B,H,G,k){B.isScene!==!0&&(B=Tt),S.resetTextureUnits();let St=B.fog,It=G.isMeshStandardMaterial?B.environment:null,Nt=A===null?_.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Rn,Bt=(G.isMeshStandardMaterial?z:v).get(G.envMap||It),Wt=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,kt=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ht=!!H.morphAttributes.position,ge=!!H.morphAttributes.normal,Ge=!!H.morphAttributes.color,be=Xn;G.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(be=_.toneMapping);let vn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,fe=vn!==void 0?vn.length:0,qt=Mt.get(G),So=p.state.lights;if(ot===!0&&(vt===!0||E!==b)){let Ye=E===b&&G.id===F;zt.setState(G,E,Ye)}let me=!1;G.version===qt.__version?(qt.needsLights&&qt.lightsStateVersion!==So.state.version||qt.outputColorSpace!==Nt||k.isBatchedMesh&&qt.batching===!1||!k.isBatchedMesh&&qt.batching===!0||k.isInstancedMesh&&qt.instancing===!1||!k.isInstancedMesh&&qt.instancing===!0||k.isSkinnedMesh&&qt.skinning===!1||!k.isSkinnedMesh&&qt.skinning===!0||k.isInstancedMesh&&qt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&qt.instancingColor===!1&&k.instanceColor!==null||qt.envMap!==Bt||G.fog===!0&&qt.fog!==St||qt.numClippingPlanes!==void 0&&(qt.numClippingPlanes!==zt.numPlanes||qt.numIntersection!==zt.numIntersection)||qt.vertexAlphas!==Wt||qt.vertexTangents!==kt||qt.morphTargets!==Ht||qt.morphNormals!==ge||qt.morphColors!==Ge||qt.toneMapping!==be||ct.isWebGL2===!0&&qt.morphTargetsCount!==fe)&&(me=!0):(me=!0,qt.__version=G.version);let ti=qt.currentProgram;me===!0&&(ti=er(G,B,k));let yc=!1,ps=!1,Eo=!1,Re=ti.getUniforms(),ei=qt.uniforms;if($.useProgram(ti.program)&&(yc=!0,ps=!0,Eo=!0),G.id!==F&&(F=G.id,ps=!0),yc||b!==E){Re.setValue(I,"projectionMatrix",E.projectionMatrix),Re.setValue(I,"viewMatrix",E.matrixWorldInverse);let Ye=Re.map.cameraPosition;Ye!==void 0&&Ye.setValue(I,Ot.setFromMatrixPosition(E.matrixWorld)),ct.logarithmicDepthBuffer&&Re.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Re.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,ps=!0,Eo=!0)}if(k.isSkinnedMesh){Re.setOptional(I,k,"bindMatrix"),Re.setOptional(I,k,"bindMatrixInverse");let Ye=k.skeleton;Ye&&(ct.floatVertexTextures?(Ye.boneTexture===null&&Ye.computeBoneTexture(),Re.setValue(I,"boneTexture",Ye.boneTexture,S)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}k.isBatchedMesh&&(Re.setOptional(I,k,"batchingTexture"),Re.setValue(I,"batchingTexture",k._matricesTexture,S));let wo=H.morphAttributes;if((wo.position!==void 0||wo.normal!==void 0||wo.color!==void 0&&ct.isWebGL2===!0)&&C.update(k,H,ti),(ps||qt.receiveShadow!==k.receiveShadow)&&(qt.receiveShadow=k.receiveShadow,Re.setValue(I,"receiveShadow",k.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(ei.envMap.value=Bt,ei.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),ps&&(Re.setValue(I,"toneMappingExposure",_.toneMappingExposure),qt.needsLights&&Qh(ei,Eo),St&&G.fog===!0&&yt.refreshFogUniforms(ei,St),yt.refreshMaterialUniforms(ei,G,K,V,At),Yi.upload(I,xc(qt),ei,S)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Yi.upload(I,xc(qt),ei,S),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Re.setValue(I,"center",k.center),Re.setValue(I,"modelViewMatrix",k.modelViewMatrix),Re.setValue(I,"normalMatrix",k.normalMatrix),Re.setValue(I,"modelMatrix",k.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){let Ye=G.uniformsGroups;for(let To=0,eu=Ye.length;To<eu;To++)if(ct.isWebGL2){let vc=Ye[To];Yt.update(vc,ti),Yt.bind(vc,ti)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ti}function Qh(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function tu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,B,H){Mt.get(E.texture).__webglTexture=B,Mt.get(E.depthTexture).__webglTexture=H;let G=Mt.get(E);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||Z.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,B){let H=Mt.get(E);H.__webglFramebuffer=B,H.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,H=0){A=E,P=B,T=H;let G=!0,k=null,St=!1,It=!1;if(E){let Bt=Mt.get(E);Bt.__useDefaultFramebuffer!==void 0?($.bindFramebuffer(I.FRAMEBUFFER,null),G=!1):Bt.__webglFramebuffer===void 0?S.setupRenderTarget(E):Bt.__hasExternalTextures&&S.rebindTextures(E,Mt.get(E.texture).__webglTexture,Mt.get(E.depthTexture).__webglTexture);let Wt=E.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(It=!0);let kt=Mt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(kt[B])?k=kt[B][H]:k=kt[B],St=!0):ct.isWebGL2&&E.samples>0&&S.useMultisampledRTT(E)===!1?k=Mt.get(E).__webglMultisampledFramebuffer:Array.isArray(kt)?k=kt[H]:k=kt,w.copy(E.viewport),N.copy(E.scissor),X=E.scissorTest}else w.copy(nt).multiplyScalar(K).floor(),N.copy(tt).multiplyScalar(K).floor(),X=_t;if($.bindFramebuffer(I.FRAMEBUFFER,k)&&ct.drawBuffers&&G&&$.drawBuffers(E,k),$.viewport(w),$.scissor(N),$.setScissorTest(X),St){let Bt=Mt.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,Bt.__webglTexture,H)}else if(It){let Bt=Mt.get(E.texture),Wt=B||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Bt.__webglTexture,H||0,Wt)}F=-1},this.readRenderTargetPixels=function(E,B,H,G,k,St,It){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=Mt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&It!==void 0&&(Nt=Nt[It]),Nt){$.bindFramebuffer(I.FRAMEBUFFER,Nt);try{let Bt=E.texture,Wt=Bt.format,kt=Bt.type;if(Wt!==an&&ht.convert(Wt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Ht=kt===Rs&&(Z.has("EXT_color_buffer_half_float")||ct.isWebGL2&&Z.has("EXT_color_buffer_float"));if(kt!==Yn&&ht.convert(kt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_TYPE)&&!(kt===Gn&&(ct.isWebGL2||Z.has("OES_texture_float")||Z.has("WEBGL_color_buffer_float")))&&!Ht){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-G&&H>=0&&H<=E.height-k&&I.readPixels(B,H,G,k,ht.convert(Wt),ht.convert(kt),St)}finally{let Bt=A!==null?Mt.get(A).__webglFramebuffer:null;$.bindFramebuffer(I.FRAMEBUFFER,Bt)}}},this.copyFramebufferToTexture=function(E,B,H=0){let G=Math.pow(2,-H),k=Math.floor(B.image.width*G),St=Math.floor(B.image.height*G);S.setTexture2D(B,0),I.copyTexSubImage2D(I.TEXTURE_2D,H,0,0,E.x,E.y,k,St),$.unbindTexture()},this.copyTextureToTexture=function(E,B,H,G=0){let k=B.image.width,St=B.image.height,It=ht.convert(H.format),Nt=ht.convert(H.type);S.setTexture2D(H,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,H.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,H.unpackAlignment),B.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,G,E.x,E.y,k,St,It,Nt,B.image.data):B.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,G,E.x,E.y,B.mipmaps[0].width,B.mipmaps[0].height,It,B.mipmaps[0].data):I.texSubImage2D(I.TEXTURE_2D,G,E.x,E.y,It,Nt,B.image),G===0&&H.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),$.unbindTexture()},this.copyTextureToTexture3D=function(E,B,H,G,k=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let St=E.max.x-E.min.x+1,It=E.max.y-E.min.y+1,Nt=E.max.z-E.min.z+1,Bt=ht.convert(G.format),Wt=ht.convert(G.type),kt;if(G.isData3DTexture)S.setTexture3D(G,0),kt=I.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)S.setTexture2DArray(G,0),kt=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,G.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,G.unpackAlignment);let Ht=I.getParameter(I.UNPACK_ROW_LENGTH),ge=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ge=I.getParameter(I.UNPACK_SKIP_PIXELS),be=I.getParameter(I.UNPACK_SKIP_ROWS),vn=I.getParameter(I.UNPACK_SKIP_IMAGES),fe=H.isCompressedTexture?H.mipmaps[k]:H.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,fe.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,fe.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,E.min.x),I.pixelStorei(I.UNPACK_SKIP_ROWS,E.min.y),I.pixelStorei(I.UNPACK_SKIP_IMAGES,E.min.z),H.isDataTexture||H.isData3DTexture?I.texSubImage3D(kt,k,B.x,B.y,B.z,St,It,Nt,Bt,Wt,fe.data):H.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),I.compressedTexSubImage3D(kt,k,B.x,B.y,B.z,St,It,Nt,Bt,fe.data)):I.texSubImage3D(kt,k,B.x,B.y,B.z,St,It,Nt,Bt,Wt,fe),I.pixelStorei(I.UNPACK_ROW_LENGTH,Ht),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ge),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ge),I.pixelStorei(I.UNPACK_SKIP_ROWS,be),I.pixelStorei(I.UNPACK_SKIP_IMAGES,vn),k===0&&G.generateMipmaps&&I.generateMipmap(kt),$.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?S.setTextureCube(E,0):E.isData3DTexture?S.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?S.setTexture2DArray(E,0):S.setTexture2D(E,0),$.unbindTexture()},this.resetState=function(){P=0,T=0,A=null,$.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Qa?"display-p3":"srgb",e.unpackColorSpace=ie.workingColorSpace===lo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ce?ui:oh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ui?ce:Rn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Ra=class extends Ls{};Ra.prototype.isWebGL1Renderer=!0;var Zr=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new $t(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ts=class extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var $n=class extends Je{constructor(t,e,i,s,r,a,o,c,l){super(t,e,i,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ke=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let i=this.getLengths(),s=0,r=i.length,a;e?a=e:a=t*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=i[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(r-1);let h=i[s],d=i[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new j:new R);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){let i=new R,s=[],r=[],a=[],o=new R,c=new pe;for(let f=0;f<=t;f++){let g=f/t;s[f]=this.getTangentAt(g,new R)}r[0]=new R,a[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(_e(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(_e(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Ds=class extends Ke{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){let i=e||new j,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ca=class extends Ds{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function nc(){let n=0,t=0,e=0,i=0;function s(r,a,o,c){n=r,t=o,e=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return n+t*r+e*a+i*o}}}var Er=new R,na=new nc,ia=new nc,sa=new nc,Us=class extends Ke{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new R){let i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(Er.subVectors(s[0],s[1]).add(s[0]),l=Er);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Er.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Er),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),na.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,x,p),ia.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,x,p),sa.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,x,p)}else this.curveType==="catmullrom"&&(na.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ia.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),sa.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(na.calc(c),ia.calc(c),sa.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new R().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Vl(n,t,e,i,s){let r=(i-t)*.5,a=(s-e)*.5,o=n*n,c=n*o;return(2*e-2*i+r+a)*c+(-3*e+3*i-2*r-a)*o+r*n+e}function og(n,t){let e=1-n;return e*e*t}function ag(n,t){return 2*(1-n)*n*t}function cg(n,t){return n*n*t}function Es(n,t,e,i){return og(n,t)+ag(n,e)+cg(n,i)}function lg(n,t){let e=1-n;return e*e*e*t}function hg(n,t){let e=1-n;return 3*e*e*n*t}function ug(n,t){return 3*(1-n)*n*n*t}function fg(n,t){return n*n*n*t}function ws(n,t,e,i,s){return lg(n,t)+hg(n,e)+ug(n,i)+fg(n,s)}var $r=class extends Ke{constructor(t=new j,e=new j,i=new j,s=new j){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new j){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ws(t,s.x,r.x,a.x,o.x),ws(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Pa=class extends Ke{constructor(t=new R,e=new R,i=new R,s=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new R){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ws(t,s.x,r.x,a.x,o.x),ws(t,s.y,r.y,a.y,o.y),ws(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Jr=class extends Ke{constructor(t=new j,e=new j){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new j){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new j){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ia=class extends Ke{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Kr=class extends Ke{constructor(t=new j,e=new j,i=new j){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new j){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Es(t,s.x,r.x,a.x),Es(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},jr=class extends Ke{constructor(t=new R,e=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new R){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Es(t,s.x,r.x,a.x),Es(t,s.y,r.y,a.y),Es(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Qr=class extends Ke{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new j){let i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Vl(o,c.x,l.x,h.x,u.x),Vl(o,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new j().fromArray(s))}return this}},to=Object.freeze({__proto__:null,ArcCurve:Ca,CatmullRomCurve3:Us,CubicBezierCurve:$r,CubicBezierCurve3:Pa,EllipseCurve:Ds,LineCurve:Jr,LineCurve3:Ia,QuadraticBezierCurve:Kr,QuadraticBezierCurve3:jr,SplineCurve:Qr}),La=class extends Ke{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new to[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let a=s[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(new to[s.type]().fromJSON(s))}return this}},es=class extends La{constructor(t){super(),this.type="Path",this.currentPoint=new j,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new Jr(this.currentPoint.clone(),new j(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){let r=new Kr(this.currentPoint.clone(),new j(t,e),new j(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){let o=new $r(this.currentPoint.clone(),new j(t,e),new j(i,s),new j(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new Qr(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,r,a,o,c),this}absellipse(t,e,i,s,r,a,o,c){let l=new Ds(t,e,i,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ns=class n extends De{constructor(t=[new j(0,-.5),new j(.5,0),new j(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=_e(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],l=[],h=1/e,u=new R,d=new j,f=new R,g=new R,x=new R,p=0,m=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:p=t[M+1].x-t[M].x,m=t[M+1].y-t[M].y,f.x=m*1,f.y=-p,f.z=m*0,x.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:p=t[M+1].x-t[M].x,m=t[M+1].y-t[M].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),c.push(f.x,f.y,f.z),x.copy(g)}for(let M=0;M<=e;M++){let _=i+M*h*s,y=Math.sin(_),P=Math.cos(_);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*y,u.y=t[T].y,u.z=t[T].x*P,a.push(u.x,u.y,u.z),d.x=M/e,d.y=T/(t.length-1),o.push(d.x,d.y);let A=c[3*T+0]*y,F=c[3*T+1],b=c[3*T+0]*P;l.push(A,F,b)}}for(let M=0;M<e;M++)for(let _=0;_<t.length-1;_++){let y=_+M*t.length,P=y,T=y+t.length,A=y+t.length+1,F=y+1;r.push(P,T,F),r.push(A,F,T)}this.setIndex(r),this.setAttribute("position",new ne(a,3)),this.setAttribute("uv",new ne(o,2)),this.setAttribute("normal",new ne(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.points,t.segments,t.phiStart,t.phiLength)}};var hn=class n extends De{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,x=[],p=i/2,m=0;M(),a===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new ne(u,3)),this.setAttribute("normal",new ne(d,3)),this.setAttribute("uv",new ne(f,2));function M(){let y=new R,P=new R,T=0,A=(e-t)/i;for(let F=0;F<=r;F++){let b=[],w=F/r,N=w*(e-t)+t;for(let X=0;X<=s;X++){let Q=X/s,L=Q*c+o,O=Math.sin(L),V=Math.cos(L);P.x=N*O,P.y=-w*i+p,P.z=N*V,u.push(P.x,P.y,P.z),y.set(O,A,V).normalize(),d.push(y.x,y.y,y.z),f.push(Q,1-w),b.push(g++)}x.push(b)}for(let F=0;F<s;F++)for(let b=0;b<r;b++){let w=x[b][F],N=x[b+1][F],X=x[b+1][F+1],Q=x[b][F+1];h.push(w,N,Q),h.push(N,X,Q),T+=6}l.addGroup(m,T,0),m+=T}function _(y){let P=g,T=new j,A=new R,F=0,b=y===!0?t:e,w=y===!0?1:-1;for(let X=1;X<=s;X++)u.push(0,p*w,0),d.push(0,w,0),f.push(.5,.5),g++;let N=g;for(let X=0;X<=s;X++){let L=X/s*c+o,O=Math.cos(L),V=Math.sin(L);A.x=b*V,A.y=p*w,A.z=b*O,u.push(A.x,A.y,A.z),d.push(0,w,0),T.x=O*.5+.5,T.y=V*.5*w+.5,f.push(T.x,T.y),g++}for(let X=0;X<s;X++){let Q=P+X,L=N+X;y===!0?h.push(L,L+1,Q):h.push(L+1,L,Q),F+=3}l.addGroup(m,F,y===!0?1:2),m+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ns=class extends es{constructor(t){super(t),this.uuid=_i(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(new es().fromJSON(s))}return this}},dg={triangulate:function(n,t,e=2){let i=t&&t.length,s=i?t[0]*e:n.length,r=yh(n,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,d,f;if(i&&(r=_g(n,t,r,e)),n.length>80*e){o=l=n[0],c=h=n[1];for(let g=e;g<s;g+=e)u=n[g],d=n[g+1],u<o&&(o=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-o,h-c),f=f!==0?32767/f:0}return Os(r,a,e,o,c,f,0),a}};function yh(n,t,e,i,s){let r,a;if(s===Cg(n,t,e,i)>0)for(r=t;r<e;r+=i)a=Gl(r,n[r],n[r+1],a);else for(r=e-i;r>=t;r-=i)a=Gl(r,n[r],n[r+1],a);return a&&uo(a,a.next)&&(Bs(a),a=a.next),a}function di(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(uo(e,e.next)||de(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Os(n,t,e,i,s,r,a){if(!n)return;!a&&r&&Sg(n,i,s,r);let o=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,r?mg(n,i,s,r):pg(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Bs(n),n=l.next,o=l.next;continue}if(n=l,n===o){a?a===1?(n=gg(di(n),t,e),Os(n,t,e,i,s,r,2)):a===2&&xg(n,t,e,i,s,r):Os(di(n),t,e,i,s,r,1);break}}}function pg(n){let t=n.prev,e=n,i=n.next;if(de(t,e,i)>=0)return!1;let s=t.x,r=e.x,a=i.x,o=t.y,c=e.y,l=i.y,h=s<r?s<a?s:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,d=s>r?s>a?s:a:r>a?r:a,f=o>c?o>l?o:l:c>l?c:l,g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Gi(s,o,r,c,a,l,g.x,g.y)&&de(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function mg(n,t,e,i){let s=n.prev,r=n,a=n.next;if(de(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=o<c?o<l?o:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,x=o>c?o>l?o:l:c>l?c:l,p=h>u?h>d?h:d:u>d?u:d,m=Da(f,g,t,e,i),M=Da(x,p,t,e,i),_=n.prevZ,y=n.nextZ;for(;_&&_.z>=m&&y&&y.z<=M;){if(_.x>=f&&_.x<=x&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&Gi(o,h,c,u,l,d,_.x,_.y)&&de(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=f&&y.x<=x&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Gi(o,h,c,u,l,d,y.x,y.y)&&de(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=m;){if(_.x>=f&&_.x<=x&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&Gi(o,h,c,u,l,d,_.x,_.y)&&de(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=M;){if(y.x>=f&&y.x<=x&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&Gi(o,h,c,u,l,d,y.x,y.y)&&de(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function gg(n,t,e){let i=n;do{let s=i.prev,r=i.next.next;!uo(s,r)&&vh(s,i,i.next,r)&&Fs(s,r)&&Fs(r,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(r.i/e|0),Bs(i),Bs(i.next),i=n=r),i=i.next}while(i!==n);return di(i)}function xg(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Tg(a,o)){let c=Mh(a,o);a=di(a,a.next),c=di(c,c.next),Os(a,t,e,i,s,r,0),Os(c,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function _g(n,t,e,i){let s=[],r,a,o,c,l;for(r=0,a=t.length;r<a;r++)o=t[r]*i,c=r<a-1?t[r+1]*i:n.length,l=yh(n,o,c,i,!1),l===l.next&&(l.steiner=!0),s.push(wg(l));for(s.sort(yg),r=0;r<s.length;r++)e=vg(s[r],e);return e}function yg(n,t){return n.x-t.x}function vg(n,t){let e=Mg(n,t);if(!e)return t;let i=Mh(e,n);return di(i,i.next),di(e,e.next)}function Mg(n,t){let e=t,i=-1/0,s,r=n.x,a=n.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let d=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,c=s.x,l=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Gi(a<l?r:i,a,c,l,a<l?i:r,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(r-e.x),Fs(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&bg(s,e)))&&(s=e,h=u)),e=e.next;while(e!==o);return s}function bg(n,t){return de(n.prev,n,t.prev)<0&&de(t.next,n,n.next)<0}function Sg(n,t,e,i){let s=n;do s.z===0&&(s.z=Da(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Eg(s)}function Eg(n){let t,e,i,s,r,a,o,c,l=1;do{for(e=n,n=null,r=null,a=0;e;){for(a++,i=e,o=0,t=0;t<l&&(o++,i=i.nextZ,!!i);t++);for(c=l;o>0||c>0&&i;)o!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,o--):(s=i,i=i.nextZ,c--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;e=i}r.nextZ=null,l*=2}while(a>1);return n}function Da(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function wg(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Gi(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function Tg(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!Ag(n,t)&&(Fs(n,t)&&Fs(t,n)&&Rg(n,t)&&(de(n.prev,n,t.prev)||de(n,t.prev,t))||uo(n,t)&&de(n.prev,n,n.next)>0&&de(t.prev,t,t.next)>0)}function de(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function uo(n,t){return n.x===t.x&&n.y===t.y}function vh(n,t,e,i){let s=Tr(de(n,t,e)),r=Tr(de(n,t,i)),a=Tr(de(e,i,n)),o=Tr(de(e,i,t));return!!(s!==r&&a!==o||s===0&&wr(n,e,t)||r===0&&wr(n,i,t)||a===0&&wr(e,n,i)||o===0&&wr(e,t,i))}function wr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Tr(n){return n>0?1:n<0?-1:0}function Ag(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&vh(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Fs(n,t){return de(n.prev,n,n.next)<0?de(n,t,n.next)>=0&&de(n,n.prev,t)>=0:de(n,t,n.prev)<0||de(n,n.next,t)<0}function Rg(n,t){let e=n,i=!1,s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Mh(n,t){let e=new Ua(n.i,n.x,n.y),i=new Ua(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Gl(n,t,e,i){let s=new Ua(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Bs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ua(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Cg(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}var Ts=class n{static area(t){let e=t.length,i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return n.area(t)<0}static triangulateShape(t,e){let i=[],s=[],r=[];Wl(t),Xl(i,t);let a=t.length;e.forEach(Wl);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Xl(i,e[c]);let o=dg.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Wl(n){let t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Xl(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}var eo=class n extends De{constructor(t=new Ns([new j(.5,.5),new j(-.5,.5),new j(-.5,-.5),new j(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let i=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){let l=t[o];a(l)}this.setAttribute("position",new ne(s,3)),this.setAttribute("uv",new ne(r,2)),this.computeVertexNormals();function a(o){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Pg,_,y=!1,P,T,A,F;m&&(_=m.getSpacedPoints(h),y=!0,d=!1,P=m.computeFrenetFrames(h,!1),T=new R,A=new R,F=new R),d||(p=0,f=0,g=0,x=0);let b=o.extractPoints(l),w=b.shape,N=b.holes;if(!Ts.isClockWise(w)){w=w.reverse();for(let I=0,ft=N.length;I<ft;I++){let Z=N[I];Ts.isClockWise(Z)&&(N[I]=Z.reverse())}}let Q=Ts.triangulateShape(w,N),L=w;for(let I=0,ft=N.length;I<ft;I++){let Z=N[I];w=w.concat(Z)}function O(I,ft,Z){return ft||console.error("THREE.ExtrudeGeometry: vec does not exist"),I.clone().addScaledVector(ft,Z)}let V=w.length,K=Q.length;function q(I,ft,Z){let ct,$,Rt,Mt=I.x-ft.x,S=I.y-ft.y,v=Z.x-I.x,z=Z.y-I.y,at=Mt*Mt+S*S,it=Mt*z-S*v;if(Math.abs(it)>Number.EPSILON){let et=Math.sqrt(at),wt=Math.sqrt(v*v+z*z),yt=ft.x-S/et,bt=ft.y+Mt/et,Lt=Z.x-z/wt,zt=Z.y+v/wt,st=((Lt-yt)*z-(zt-bt)*v)/(Mt*z-S*v);ct=yt+Mt*st-I.x,$=bt+S*st-I.y;let Xt=ct*ct+$*$;if(Xt<=2)return new j(ct,$);Rt=Math.sqrt(Xt/2)}else{let et=!1;Mt>Number.EPSILON?v>Number.EPSILON&&(et=!0):Mt<-Number.EPSILON?v<-Number.EPSILON&&(et=!0):Math.sign(S)===Math.sign(z)&&(et=!0),et?(ct=-S,$=Mt,Rt=Math.sqrt(at)):(ct=Mt,$=S,Rt=Math.sqrt(at/2))}return new j(ct/Rt,$/Rt)}let Y=[];for(let I=0,ft=L.length,Z=ft-1,ct=I+1;I<ft;I++,Z++,ct++)Z===ft&&(Z=0),ct===ft&&(ct=0),Y[I]=q(L[I],L[Z],L[ct]);let nt=[],tt,_t=Y.concat();for(let I=0,ft=N.length;I<ft;I++){let Z=N[I];tt=[];for(let ct=0,$=Z.length,Rt=$-1,Mt=ct+1;ct<$;ct++,Rt++,Mt++)Rt===$&&(Rt=0),Mt===$&&(Mt=0),tt[ct]=q(Z[ct],Z[Rt],Z[Mt]);nt.push(tt),_t=_t.concat(tt)}for(let I=0;I<p;I++){let ft=I/p,Z=f*Math.cos(ft*Math.PI/2),ct=g*Math.sin(ft*Math.PI/2)+x;for(let $=0,Rt=L.length;$<Rt;$++){let Mt=O(L[$],Y[$],ct);Et(Mt.x,Mt.y,-Z)}for(let $=0,Rt=N.length;$<Rt;$++){let Mt=N[$];tt=nt[$];for(let S=0,v=Mt.length;S<v;S++){let z=O(Mt[S],tt[S],ct);Et(z.x,z.y,-Z)}}}let W=g+x;for(let I=0;I<V;I++){let ft=d?O(w[I],_t[I],W):w[I];y?(A.copy(P.normals[0]).multiplyScalar(ft.x),T.copy(P.binormals[0]).multiplyScalar(ft.y),F.copy(_[0]).add(A).add(T),Et(F.x,F.y,F.z)):Et(ft.x,ft.y,0)}for(let I=1;I<=h;I++)for(let ft=0;ft<V;ft++){let Z=d?O(w[ft],_t[ft],W):w[ft];y?(A.copy(P.normals[I]).multiplyScalar(Z.x),T.copy(P.binormals[I]).multiplyScalar(Z.y),F.copy(_[I]).add(A).add(T),Et(F.x,F.y,F.z)):Et(Z.x,Z.y,u/h*I)}for(let I=p-1;I>=0;I--){let ft=I/p,Z=f*Math.cos(ft*Math.PI/2),ct=g*Math.sin(ft*Math.PI/2)+x;for(let $=0,Rt=L.length;$<Rt;$++){let Mt=O(L[$],Y[$],ct);Et(Mt.x,Mt.y,u+Z)}for(let $=0,Rt=N.length;$<Rt;$++){let Mt=N[$];tt=nt[$];for(let S=0,v=Mt.length;S<v;S++){let z=O(Mt[S],tt[S],ct);y?Et(z.x,z.y+_[h-1].y,_[h-1].x+Z):Et(z.x,z.y,u+Z)}}}ot(),vt();function ot(){let I=s.length/3;if(d){let ft=0,Z=V*ft;for(let ct=0;ct<K;ct++){let $=Q[ct];Ut($[2]+Z,$[1]+Z,$[0]+Z)}ft=h+p*2,Z=V*ft;for(let ct=0;ct<K;ct++){let $=Q[ct];Ut($[0]+Z,$[1]+Z,$[2]+Z)}}else{for(let ft=0;ft<K;ft++){let Z=Q[ft];Ut(Z[2],Z[1],Z[0])}for(let ft=0;ft<K;ft++){let Z=Q[ft];Ut(Z[0]+V*h,Z[1]+V*h,Z[2]+V*h)}}i.addGroup(I,s.length/3-I,0)}function vt(){let I=s.length/3,ft=0;At(L,ft),ft+=L.length;for(let Z=0,ct=N.length;Z<ct;Z++){let $=N[Z];At($,ft),ft+=$.length}i.addGroup(I,s.length/3-I,1)}function At(I,ft){let Z=I.length;for(;--Z>=0;){let ct=Z,$=Z-1;$<0&&($=I.length-1);for(let Rt=0,Mt=h+p*2;Rt<Mt;Rt++){let S=V*Rt,v=V*(Rt+1),z=ft+ct+S,at=ft+$+S,it=ft+$+v,et=ft+ct+v;Ot(z,at,it,et)}}}function Et(I,ft,Z){c.push(I),c.push(ft),c.push(Z)}function Ut(I,ft,Z){Tt(I),Tt(ft),Tt(Z);let ct=s.length/3,$=M.generateTopUV(i,s,ct-3,ct-2,ct-1);Ft($[0]),Ft($[1]),Ft($[2])}function Ot(I,ft,Z,ct){Tt(I),Tt(ft),Tt(ct),Tt(ft),Tt(Z),Tt(ct);let $=s.length/3,Rt=M.generateSideWallUV(i,s,$-6,$-3,$-2,$-1);Ft(Rt[0]),Ft(Rt[1]),Ft(Rt[3]),Ft(Rt[1]),Ft(Rt[2]),Ft(Rt[3])}function Tt(I){s.push(c[I*3+0]),s.push(c[I*3+1]),s.push(c[I*3+2])}function Ft(I){r.push(I.x),r.push(I.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Ig(e,i,t)}static fromJSON(t,e){let i=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];i.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new to[s.type]().fromJSON(s)),new n(i,t.options)}},Pg={generateTopUV:function(n,t,e,i,s){let r=t[e*3],a=t[e*3+1],o=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new j(r,a),new j(o,c),new j(l,h)]},generateSideWallUV:function(n,t,e,i,s,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],x=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new j(a,1-c),new j(l,1-u),new j(d,1-g),new j(x,1-m)]:[new j(o,1-c),new j(h,1-u),new j(f,1-g),new j(p,1-m)]}};function Ig(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var zs=class n extends De{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=t,d=(e-t)/s,f=new R,g=new j;for(let x=0;x<=s;x++){for(let p=0;p<=i;p++){let m=r+p/i*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let x=0;x<s;x++){let p=x*(i+1);for(let m=0;m<i;m++){let M=m+p,_=M,y=M+i+1,P=M+i+2,T=M+1;o.push(_,y,T),o.push(y,P,T)}}this.setIndex(o),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(l,3)),this.setAttribute("uv",new ne(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Dn=class n extends De{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new R,d=new R,f=[],g=[],x=[],p=[];for(let m=0;m<=i;m++){let M=[],_=m/i,y=0;m===0&&a===0?y=.5/e:m===i&&c===Math.PI&&(y=-.5/e);for(let P=0;P<=e;P++){let T=P/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+_*o),u.y=t*Math.cos(a+_*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+_*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),p.push(T+y,1-_),M.push(l++)}h.push(M)}for(let m=0;m<i;m++)for(let M=0;M<e;M++){let _=h[m][M+1],y=h[m][M],P=h[m+1][M],T=h[m+1][M+1];(m!==0||a>0)&&f.push(_,y,T),(m!==i-1||c<Math.PI)&&f.push(y,P,T)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(x,3)),this.setAttribute("uv",new ne(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var un=class n extends De{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new R,u=new R,d=new R;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){let x=g/s*r,p=f/i*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(x),u.y=(t+e*Math.cos(p))*Math.sin(x),u.z=e*Math.sin(p),o.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){let x=(s+1)*f+g-1,p=(s+1)*(f-1)+g-1,m=(s+1)*(f-1)+g,M=(s+1)*f+g;a.push(x,p,M),a.push(p,m,M)}this.setIndex(a),this.setAttribute("position",new ne(o,3)),this.setAttribute("normal",new ne(c,3)),this.setAttribute("uv",new ne(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var no=class n extends De{constructor(t=new jr(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new R,c=new R,l=new j,h=new R,u=[],d=[],f=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new ne(u,3)),this.setAttribute("normal",new ne(d,3)),this.setAttribute("uv",new ne(f,2));function x(){for(let _=0;_<e;_++)p(_);p(r===!1?e:0),M(),m()}function p(_){h=t.getPointAt(_/e,h);let y=a.normals[_],P=a.binormals[_];for(let T=0;T<=s;T++){let A=T/s*Math.PI*2,F=Math.sin(A),b=-Math.cos(A);c.x=b*y.x+F*P.x,c.y=b*y.y+F*P.y,c.z=b*y.z+F*P.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+i*c.x,o.y=h.y+i*c.y,o.z=h.z+i*c.z,u.push(o.x,o.y,o.z)}}function m(){for(let _=1;_<=e;_++)for(let y=1;y<=s;y++){let P=(s+1)*(_-1)+(y-1),T=(s+1)*_+(y-1),A=(s+1)*_+y,F=(s+1)*(_-1)+y;g.push(P,T,F),g.push(T,A,F)}}function M(){for(let _=0;_<=e;_++)for(let y=0;y<=s;y++)l.x=_/e,l.y=y/s,f.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new n(new to[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var He=class extends fi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new $t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ah,this.normalScale=new j(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Ar(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Lg(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var is=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=e[++i],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break n}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Na=class extends is{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:jc,endingEnd:jc}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Qc:r=t,o=2*e-i;break;case tl:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Qc:a=t,c=2*i-e;break;case tl:a=1,c=i+s[1]-s[0];break;default:a=t-1,c=e}let l=(i-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(i-e)/(s-e),x=g*g,p=x*g,m=-d*p+2*d*x-d*g,M=(1+d)*p+(-1.5-2*d)*x+(-.5+d)*g+1,_=(-1-f)*p+(1.5+f)*x+.5*g,y=f*p-f*x;for(let P=0;P!==o;++P)r[P]=m*a[h+P]+M*a[l+P]+_*a[c+P]+y*a[u+P];return r}},Oa=class extends is{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},Fa=class extends is{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},fn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ar(e,this.TimeBufferType),this.values=Ar(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Ar(t.times,Array),values:Ar(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Fa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Oa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Na(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Pr:e=this.InterpolantFactoryMethodDiscrete;break;case Ir:e=this.InterpolantFactoryMethodLinear;break;case Do:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pr;case this.InterpolantFactoryMethodLinear:return Ir;case this.InterpolantFactoryMethodSmooth:return Do}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&Lg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Do,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(s)c=!0;else{let u=o*i,d=u-i,f=u+i;for(let g=0;g!==i;++g){let x=e[u+g];if(x!==e[d+g]||x!==e[f+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let u=o*i,d=a*i;for(let f=0;f!==i;++f)e[d+f]=e[u+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,c=a*i,l=0;l!==i;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=Ir;var pi=class extends fn{};pi.prototype.ValueTypeName="bool";pi.prototype.ValueBufferType=Array;pi.prototype.DefaultInterpolation=Pr;pi.prototype.InterpolantFactoryMethodLinear=void 0;pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends fn{};Ba.prototype.ValueTypeName="color";var za=class extends fn{};za.prototype.ValueTypeName="number";var ka=class extends is{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(i-e)/(s-e),l=t*o;for(let h=l+o;l!==h;l+=4)cn.slerpFlat(r,0,a,l-o,a,l,c);return r}},ks=class extends fn{InterpolantFactoryMethodLinear(t){return new ka(this.times,this.values,this.getValueSize(),t)}};ks.prototype.ValueTypeName="quaternion";ks.prototype.DefaultInterpolation=Ir;ks.prototype.InterpolantFactoryMethodSmooth=void 0;var mi=class extends fn{};mi.prototype.ValueTypeName="string";mi.prototype.ValueBufferType=Array;mi.prototype.DefaultInterpolation=Pr;mi.prototype.InterpolantFactoryMethodLinear=void 0;mi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ha=class extends fn{};Ha.prototype.ValueTypeName="vector";var Va=class{constructor(t,e,i){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},Dg=new Va,Ga=class{constructor(t){this.manager=t!==void 0?t:Dg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Ga.DEFAULT_MATERIAL_NAME="__DEFAULT";var ss=class extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new $t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},io=class extends ss{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},ra=new pe,Yl=new R,ql=new R,Hs=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new j(512,512),this.map=null,this.mapPass=null,this.matrix=new pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Is,this._frameExtents=new j(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;Yl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yl),ql.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ql),e.updateMatrixWorld(),ra.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ra),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ra)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Wa=class extends Hs{constructor(){super(new we(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,i=Ji*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(i!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=i,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},so=class extends ss{constructor(t,e,i=0,s=Math.PI/3,r=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Wa}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Zl=new pe,ys=new R,oa=new R,Xa=class extends Hs{constructor(){super(new we(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new j(4,2),this._viewportCount=6,this._viewports=[new ue(2,1,1,1),new ue(0,1,1,1),new ue(3,1,1,1),new ue(1,1,1,1),new ue(3,0,1,1),new ue(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),ys.setFromMatrixPosition(t.matrixWorld),i.position.copy(ys),oa.copy(i.position),oa.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(oa),i.updateMatrixWorld(),s.makeTranslation(-ys.x,-ys.y,-ys.z),Zl.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zl)}},ro=class extends ss{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Xa}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Ya=class extends Hs{constructor(){super(new Yr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},oo=class extends ss{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new Ya}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ic="\\[\\]\\.:\\/",Ug=new RegExp("["+ic+"]","g"),sc="[^"+ic+"]",Ng="[^"+ic.replace("\\.","")+"]",Og=/((?:WC+[\/:])*)/.source.replace("WC",sc),Fg=/(WCOD+)?/.source.replace("WCOD",Ng),Bg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sc),zg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sc),kg=new RegExp("^"+Og+Fg+Bg+zg+"$"),Hg=["material","materials","bones","map"],qa=class{constructor(t,e,i){let s=i||he.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},he=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Ug,"")}static parseTrackName(t){let e=kg.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Hg.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=i(o.children);if(c)return c}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};he.Composite=qa;he.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};he.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};he.prototype.GetterByBindingType=[he.prototype._getValue_direct,he.prototype._getValue_array,he.prototype._getValue_arrayElement,he.prototype._getValue_toArray];he.prototype.SetterByBindingTypeAndVersioning=[[he.prototype._setValue_direct,he.prototype._setValue_direct_setNeedsUpdate,he.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[he.prototype._setValue_array,he.prototype._setValue_array_setNeedsUpdate,he.prototype._setValue_array_setMatrixWorldNeedsUpdate],[he.prototype._setValue_arrayElement,he.prototype._setValue_arrayElement_setNeedsUpdate,he.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[he.prototype._setValue_fromArray,he.prototype._setValue_fromArray_setNeedsUpdate,he.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var gx=new Float32Array(1);var ao=class{constructor(t,e,i=0,s=1/0){this.ray=new Ki(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Ps,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return Za(t,this,i,e),i.sort($l),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)Za(t[s],this,i,e);return i.sort($l),i}};function $l(n,t){return n.distance-t.distance}function Za(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){let s=n.children;for(let r=0,a=s.length;r<a;r++)Za(s[r],t,e,!0)}}var Vs=class{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(_e(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$a}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$a);var bh={type:"change"},rc={type:"start"},Sh={type:"end"},fo=new Ki,Eh=new rn,Vg=Math.cos(70*lh.DEG2RAD),po=class extends _n{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:gi.ROTATE,MIDDLE:gi.DOLLY,RIGHT:gi.PAN},this.touches={ONE:xi.ROTATE,TWO:xi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",et),this._domElementKeyEvents=C},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",et),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(bh),i.update(),r=s.NONE},this.update=function(){let C=new R,rt=new cn().setFromUnitVectors(t.up,new R(0,1,0)),gt=rt.clone().invert(),ht=new R,Ct=new cn,Yt=new R,Kt=2*Math.PI;return function(mt=null){let D=i.object.position;C.copy(D).sub(i.target),C.applyQuaternion(rt),o.setFromVector3(C),i.autoRotate&&r===s.NONE&&N(b(mt)),i.enableDamping?(o.theta+=c.theta*i.dampingFactor,o.phi+=c.phi*i.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let dt=i.minAzimuthAngle,pt=i.maxAzimuthAngle;isFinite(dt)&&isFinite(pt)&&(dt<-Math.PI?dt+=Kt:dt>Math.PI&&(dt-=Kt),pt<-Math.PI?pt+=Kt:pt>Math.PI&&(pt-=Kt),dt<=pt?o.theta=Math.max(dt,Math.min(pt,o.theta)):o.theta=o.theta>(dt+pt)/2?Math.max(dt,o.theta):Math.min(pt,o.theta)),o.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,o.phi)),o.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&T||i.object.isOrthographicCamera?o.radius=Y(o.radius):o.radius=Y(o.radius*l),C.setFromSpherical(o),C.applyQuaternion(gt),D.copy(i.target).add(C),i.object.lookAt(i.target),i.enableDamping===!0?(c.theta*=1-i.dampingFactor,c.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Dt=!1;if(i.zoomToCursor&&T){let Pt=null;if(i.object.isPerspectiveCamera){let jt=C.length();Pt=Y(jt*l);let ee=jt-Pt;i.object.position.addScaledVector(y,ee),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){let jt=new R(P.x,P.y,0);jt.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Dt=!0;let ee=new R(P.x,P.y,0);ee.unproject(i.object),i.object.position.sub(ee).add(jt),i.object.updateMatrixWorld(),Pt=C.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;Pt!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(Pt).add(i.object.position):(fo.origin.copy(i.object.position),fo.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(fo.direction))<Vg?t.lookAt(i.target):(Eh.setFromNormalAndCoplanarPoint(i.object.up,i.target),fo.intersectPlane(Eh,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Dt=!0);return l=1,T=!1,Dt||ht.distanceToSquared(i.object.position)>a||8*(1-Ct.dot(i.object.quaternion))>a||Yt.distanceToSquared(i.target)>0?(i.dispatchEvent(bh),ht.copy(i.object.position),Ct.copy(i.object.quaternion),Yt.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",bt),i.domElement.removeEventListener("pointerdown",Mt),i.domElement.removeEventListener("pointercancel",v),i.domElement.removeEventListener("wheel",it),i.domElement.removeEventListener("pointermove",S),i.domElement.removeEventListener("pointerup",v),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",et),i._domElementKeyEvents=null)};let i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Vs,c=new Vs,l=1,h=new R,u=new j,d=new j,f=new j,g=new j,x=new j,p=new j,m=new j,M=new j,_=new j,y=new R,P=new j,T=!1,A=[],F={};function b(C){return C!==null?2*Math.PI/60*i.autoRotateSpeed*C:2*Math.PI/60/60*i.autoRotateSpeed}function w(C){let rt=Math.abs(C)/(100*(window.devicePixelRatio|0));return Math.pow(.95,i.zoomSpeed*rt)}function N(C){c.theta-=C}function X(C){c.phi-=C}let Q=function(){let C=new R;return function(gt,ht){C.setFromMatrixColumn(ht,0),C.multiplyScalar(-gt),h.add(C)}}(),L=function(){let C=new R;return function(gt,ht){i.screenSpacePanning===!0?C.setFromMatrixColumn(ht,1):(C.setFromMatrixColumn(ht,0),C.crossVectors(i.object.up,C)),C.multiplyScalar(gt),h.add(C)}}(),O=function(){let C=new R;return function(gt,ht){let Ct=i.domElement;if(i.object.isPerspectiveCamera){let Yt=i.object.position;C.copy(Yt).sub(i.target);let Kt=C.length();Kt*=Math.tan(i.object.fov/2*Math.PI/180),Q(2*gt*Kt/Ct.clientHeight,i.object.matrix),L(2*ht*Kt/Ct.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(Q(gt*(i.object.right-i.object.left)/i.object.zoom/Ct.clientWidth,i.object.matrix),L(ht*(i.object.top-i.object.bottom)/i.object.zoom/Ct.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function V(C){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l/=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function K(C){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l*=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function q(C,rt){if(!i.zoomToCursor)return;T=!0;let gt=i.domElement.getBoundingClientRect(),ht=C-gt.left,Ct=rt-gt.top,Yt=gt.width,Kt=gt.height;P.x=ht/Yt*2-1,P.y=-(Ct/Kt)*2+1,y.set(P.x,P.y,1).unproject(i.object).sub(i.object.position).normalize()}function Y(C){return Math.max(i.minDistance,Math.min(i.maxDistance,C))}function nt(C){u.set(C.clientX,C.clientY)}function tt(C){q(C.clientX,C.clientX),m.set(C.clientX,C.clientY)}function _t(C){g.set(C.clientX,C.clientY)}function W(C){d.set(C.clientX,C.clientY),f.subVectors(d,u).multiplyScalar(i.rotateSpeed);let rt=i.domElement;N(2*Math.PI*f.x/rt.clientHeight),X(2*Math.PI*f.y/rt.clientHeight),u.copy(d),i.update()}function ot(C){M.set(C.clientX,C.clientY),_.subVectors(M,m),_.y>0?V(w(_.y)):_.y<0&&K(w(_.y)),m.copy(M),i.update()}function vt(C){x.set(C.clientX,C.clientY),p.subVectors(x,g).multiplyScalar(i.panSpeed),O(p.x,p.y),g.copy(x),i.update()}function At(C){q(C.clientX,C.clientY),C.deltaY<0?K(w(C.deltaY)):C.deltaY>0&&V(w(C.deltaY)),i.update()}function Et(C){let rt=!1;switch(C.code){case i.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?X(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):O(0,i.keyPanSpeed),rt=!0;break;case i.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?X(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):O(0,-i.keyPanSpeed),rt=!0;break;case i.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?N(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):O(i.keyPanSpeed,0),rt=!0;break;case i.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?N(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):O(-i.keyPanSpeed,0),rt=!0;break}rt&&(C.preventDefault(),i.update())}function Ut(C){if(A.length===1)u.set(C.pageX,C.pageY);else{let rt=Xt(C),gt=.5*(C.pageX+rt.x),ht=.5*(C.pageY+rt.y);u.set(gt,ht)}}function Ot(C){if(A.length===1)g.set(C.pageX,C.pageY);else{let rt=Xt(C),gt=.5*(C.pageX+rt.x),ht=.5*(C.pageY+rt.y);g.set(gt,ht)}}function Tt(C){let rt=Xt(C),gt=C.pageX-rt.x,ht=C.pageY-rt.y,Ct=Math.sqrt(gt*gt+ht*ht);m.set(0,Ct)}function Ft(C){i.enableZoom&&Tt(C),i.enablePan&&Ot(C)}function I(C){i.enableZoom&&Tt(C),i.enableRotate&&Ut(C)}function ft(C){if(A.length==1)d.set(C.pageX,C.pageY);else{let gt=Xt(C),ht=.5*(C.pageX+gt.x),Ct=.5*(C.pageY+gt.y);d.set(ht,Ct)}f.subVectors(d,u).multiplyScalar(i.rotateSpeed);let rt=i.domElement;N(2*Math.PI*f.x/rt.clientHeight),X(2*Math.PI*f.y/rt.clientHeight),u.copy(d)}function Z(C){if(A.length===1)x.set(C.pageX,C.pageY);else{let rt=Xt(C),gt=.5*(C.pageX+rt.x),ht=.5*(C.pageY+rt.y);x.set(gt,ht)}p.subVectors(x,g).multiplyScalar(i.panSpeed),O(p.x,p.y),g.copy(x)}function ct(C){let rt=Xt(C),gt=C.pageX-rt.x,ht=C.pageY-rt.y,Ct=Math.sqrt(gt*gt+ht*ht);M.set(0,Ct),_.set(0,Math.pow(M.y/m.y,i.zoomSpeed)),V(_.y),m.copy(M);let Yt=(C.pageX+rt.x)*.5,Kt=(C.pageY+rt.y)*.5;q(Yt,Kt)}function $(C){i.enableZoom&&ct(C),i.enablePan&&Z(C)}function Rt(C){i.enableZoom&&ct(C),i.enableRotate&&ft(C)}function Mt(C){i.enabled!==!1&&(A.length===0&&(i.domElement.setPointerCapture(C.pointerId),i.domElement.addEventListener("pointermove",S),i.domElement.addEventListener("pointerup",v)),Lt(C),C.pointerType==="touch"?wt(C):z(C))}function S(C){i.enabled!==!1&&(C.pointerType==="touch"?yt(C):at(C))}function v(C){zt(C),A.length===0&&(i.domElement.releasePointerCapture(C.pointerId),i.domElement.removeEventListener("pointermove",S),i.domElement.removeEventListener("pointerup",v)),i.dispatchEvent(Sh),r=s.NONE}function z(C){let rt;switch(C.button){case 0:rt=i.mouseButtons.LEFT;break;case 1:rt=i.mouseButtons.MIDDLE;break;case 2:rt=i.mouseButtons.RIGHT;break;default:rt=-1}switch(rt){case gi.DOLLY:if(i.enableZoom===!1)return;tt(C),r=s.DOLLY;break;case gi.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(i.enablePan===!1)return;_t(C),r=s.PAN}else{if(i.enableRotate===!1)return;nt(C),r=s.ROTATE}break;case gi.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(i.enableRotate===!1)return;nt(C),r=s.ROTATE}else{if(i.enablePan===!1)return;_t(C),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(rc)}function at(C){switch(r){case s.ROTATE:if(i.enableRotate===!1)return;W(C);break;case s.DOLLY:if(i.enableZoom===!1)return;ot(C);break;case s.PAN:if(i.enablePan===!1)return;vt(C);break}}function it(C){i.enabled===!1||i.enableZoom===!1||r!==s.NONE||(C.preventDefault(),i.dispatchEvent(rc),At(C),i.dispatchEvent(Sh))}function et(C){i.enabled===!1||i.enablePan===!1||Et(C)}function wt(C){switch(st(C),A.length){case 1:switch(i.touches.ONE){case xi.ROTATE:if(i.enableRotate===!1)return;Ut(C),r=s.TOUCH_ROTATE;break;case xi.PAN:if(i.enablePan===!1)return;Ot(C),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(i.touches.TWO){case xi.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Ft(C),r=s.TOUCH_DOLLY_PAN;break;case xi.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;I(C),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(rc)}function yt(C){switch(st(C),r){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;ft(C),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;Z(C),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;$(C),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;Rt(C),i.update();break;default:r=s.NONE}}function bt(C){i.enabled!==!1&&C.preventDefault()}function Lt(C){A.push(C.pointerId)}function zt(C){delete F[C.pointerId];for(let rt=0;rt<A.length;rt++)if(A[rt]==C.pointerId){A.splice(rt,1);return}}function st(C){let rt=F[C.pointerId];rt===void 0&&(rt=new j,F[C.pointerId]=rt),rt.set(C.pageX,C.pageY)}function Xt(C){let rt=C.pointerId===A[0]?A[1]:A[0];return F[rt]}i.domElement.addEventListener("contextmenu",bt),i.domElement.addEventListener("pointerdown",Mt),i.domElement.addEventListener("pointercancel",v),i.domElement.addEventListener("wheel",it,{passive:!1}),this.update()}};function Th(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,c=new De,l=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=n[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=wh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);let g=wh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function wh(n){let t,e,i,s=-1,r=0;for(let l=0;l<n.length;++l){let h=n[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}let a=new t(r),o=0;for(let l=0;l<n.length;++l)a.set(n[l].array,o),o+=n[l].array.length;let c=new Le(a,e,i);return s!==void 0&&(c.gpuType=s),c}var mo=class extends ts{constructor(t=null){super();let e=new ze;e.deleteAttribute("uv");let i=new He({side:Ie}),s=new He,r=5;t!==null&&t._useLegacyLights===!1&&(r=900);let a=new ro(16777215,r,28,2);a.position.set(.418,16.199,.3),this.add(a);let o=new Jt(e,i);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let c=new Jt(e,s);c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),this.add(c);let l=new Jt(e,s);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);let h=new Jt(e,s);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);let u=new Jt(e,s);u.position.set(-2.017,.018,6.124),u.rotation.set(0,.333,0),u.scale.set(2.002,4.566,2.064),this.add(u);let d=new Jt(e,s);d.position.set(2.291,-.756,-2.621),d.rotation.set(0,-.286,0),d.scale.set(1.546,1.552,1.496),this.add(d);let f=new Jt(e,s);f.position.set(-2.193,-.369,-5.547),f.rotation.set(0,.516,0),f.scale.set(3.875,3.487,2.986),this.add(f);let g=new Jt(e,os(50));g.position.set(-16.116,14.37,8.208),g.scale.set(.1,2.428,2.739),this.add(g);let x=new Jt(e,os(50));x.position.set(-16.109,18.021,-8.207),x.scale.set(.1,2.425,2.751),this.add(x);let p=new Jt(e,os(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let m=new Jt(e,os(43));m.position.set(-.462,8.89,14.52),m.scale.set(4.38,5.441,.088),this.add(m);let M=new Jt(e,os(20));M.position.set(3.235,11.486,-12.541),M.scale.set(2.5,2,.1),this.add(M);let _=new Jt(e,os(100));_.position.set(0,20,0),_.scale.set(1,.1,1),this.add(_)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function os(n){let t=new In;return t.color.setScalar(n),t}var Ws=new R;function je(n,t,e,i,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ws.copy(t),Ws[i]=0,Ws.normalize();let l=.5*a/(a+o),h=1-Ws.angleTo(n)/c;return Math.sign(Ws[e])===1?h*l:o/(a+o)+l+l*(1-h)}var Xs=class extends ze{constructor(t=1,e=1,i=1,s=2,r=.1){if(s=s*2+1,r=Math.min(t/2,e/2,i/2,r),super(1,1,1,s,s,s),s===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let o=new R,c=new R,l=new R(t,e,i).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,g=new R,x=.5/s;for(let p=0,m=0;p<h.length;p+=3,m+=2)switch(o.fromArray(h,p),c.copy(o),c.x-=Math.sign(c.x)*x,c.y-=Math.sign(c.y)*x,c.z-=Math.sign(c.z)*x,c.normalize(),h[p+0]=l.x*Math.sign(o.x)+c.x*r,h[p+1]=l.y*Math.sign(o.y)+c.y*r,h[p+2]=l.z*Math.sign(o.z)+c.z*r,u[p+0]=c.x,u[p+1]=c.y,u[p+2]=c.z,Math.floor(p/f)){case 0:g.set(1,0,0),d[m+0]=je(g,c,"z","y",r,i),d[m+1]=1-je(g,c,"y","z",r,e);break;case 1:g.set(-1,0,0),d[m+0]=1-je(g,c,"z","y",r,i),d[m+1]=1-je(g,c,"y","z",r,e);break;case 2:g.set(0,1,0),d[m+0]=1-je(g,c,"x","z",r,t),d[m+1]=je(g,c,"z","x",r,i);break;case 3:g.set(0,-1,0),d[m+0]=1-je(g,c,"x","z",r,t),d[m+1]=1-je(g,c,"z","x",r,i);break;case 4:g.set(0,0,1),d[m+0]=1-je(g,c,"x","y",r,t),d[m+1]=1-je(g,c,"y","x",r,e);break;case 5:g.set(0,0,-1),d[m+0]=je(g,c,"x","y",r,t),d[m+1]=1-je(g,c,"y","x",r,e);break}}};var oc=new Map,Gg=typeof document<"u";function Wg(n){return function(){n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function yi(n,t,e,i,s=.5){let r=Wg(i),a=256,o=new Float32Array(a*a);for(let x=0;x<o.length;x++)o[x]=r();let c=new Float32Array(n*n),l=x=>x*x*(3-2*x),h=1,u=t,d=0;for(let x=0;x<e;x++){let p=u;for(let m=0;m<n;m++){let M=m/n*p,_=Math.floor(M),y=l(M-_),P=_%p*a,T=(_+1)%p*a;for(let A=0;A<n;A++){let F=A/n*p,b=Math.floor(F),w=l(F-b),N=b%p,X=(b+1)%p,Q=o[P+N],L=o[P+X],O=o[T+N],V=o[T+X];c[m*n+A]+=h*(Q+(L-Q)*w+(O+(V-O)*w-(Q+(L-Q)*w))*y)}}d+=h,h*=s,u*=2}let f=1/0,g=-1/0;for(let x=0;x<c.length;x++)c[x]/=d,f=Math.min(f,c[x]),g=Math.max(g,c[x]);for(let x=0;x<c.length;x++)c[x]=(c[x]-f)/(g-f+1e-9);return c}function as(n,t,e,i=[1,1]){let s=document.createElement("canvas");s.width=s.height=n;let r=s.getContext("2d"),a=r.createImageData(n,n);for(let c=0;c<n*n;c++){let[l,h,u,d]=t(c);a.data[c*4]=l,a.data[c*4+1]=h,a.data[c*4+2]=u,a.data[c*4+3]=d??255}r.putImageData(a,0,0);let o=new $n(s);return o.wrapS=o.wrapT=Zn,o.repeat.set(i[0],i[1]),o.colorSpace=e?ce:ke,o.anisotropy=4,o}function cs(n,t){return Gg?(oc.has(n)||oc.set(n,t()),oc.get(n)):null}var Ah=()=>cs("paintRough",()=>{let t=yi(256,8,5,11),e=yi(256,32,3,12);return as(256,i=>{let s=200+40*t[i]+15*e[i];return[s,s,s]},!1,[2,2])}),Rh=()=>cs("rustColor",()=>{let t=yi(512,6,6,21),e=yi(512,24,4,22),i=yi(512,64,2,23);return as(512,s=>{let r=t[s]*.7+e[s]*.3,a=95+70*r,o=72+38*r,c=58+18*r;return i[s]>.72&&(a*=.62,o*=.6,c*=.6),e[s]>.78&&(a=126+30*i[s],o=122+26*i[s],c=116+24*i[s]),[a,o,c]},!0,[6,1])}),Ch=()=>cs("rustRough",()=>{let t=yi(256,12,4,31);return as(256,e=>{let i=170+85*t[e];return[i,i,i]},!1,[6,1])});var Ph=()=>cs("checker",()=>as(128,t=>{let e=t%128,i=Math.floor(t/128),s=(e+i)%32-16,r=(e-i+1024)%32-16,a=Math.abs(s)<3&&Math.abs(r)<9||Math.abs(r)<3&&Math.abs(s)<9?255:60;return[a,a,a]},!1,[10,10]));var Ih=()=>cs("rubberRough",()=>{let t=yi(128,16,3,51);return as(128,e=>{let i=215+40*t[e];return[i,i,i]},!1,[4,1])}),Lh=()=>cs("meshColor",()=>as(128,t=>{let e=t%128,i=Math.floor(t/128),r=(e%16-8)**2+(i%16-8)**2<22?18:92;return[r,r,r+4]},!0,[8,4]));var ac=new Map;function J(n,t=.55,e=.12,i={}){let s=`${n}|${t}|${e}|${JSON.stringify(i)}`;if(!ac.has(s)){let{kind:r=i.transparent||i.emissive?"plain":"paint",...a}=i,o={color:n,roughness:t,metalness:e,...a};if(r==="paint"){let c=Ah();c&&(o.roughnessMap=c,o.bumpMap=c,o.bumpScale=.35)}else if(r==="rust"){let c=Rh(),l=Ch();c&&(o.map=c,o.color=16777215,o.roughnessMap=l,o.roughness=1,o.bumpMap=l,o.bumpScale=1.2)}else if(r==="rubber"){let c=Ih();c&&(o.roughnessMap=c,o.bumpMap=c,o.bumpScale=.8)}else if(r==="mesh"){let c=Lh();c&&(o.map=c,o.color=16777215,o.bumpMap=c,o.bumpScale=1.5)}else if(r==="checker"){let c=Ph();c&&(o.bumpMap=c,o.bumpScale=2.5)}ac.set(s,new He(o))}return ac.get(s)}var ut={steel:()=>J(7297865,.82,.35,{kind:"rust"}),steelGrey:()=>J(8225416,.5,.6),dark:()=>J(2500909,.62,.35),black:()=>J(1316119,.6,.15),rubber:()=>J(1776670,.93,0,{side:$e,kind:"rubber"}),chrome:()=>J(13949148,.2,.95,{kind:"plain"}),alu:()=>J(12041409,.36,.75,{kind:"plain"}),brass:()=>J(11831868,.3,.85,{kind:"plain"}),copper:()=>J(11559994,.33,.8,{kind:"plain"}),engine:()=>J(4935766,.55,.5),seat:()=>J(2894894,.9,0),white:()=>J(15658730,.5,.05),glass:()=>J(10469583,.04,.2,{transparent:!0,opacity:.3,depthWrite:!1}),lamp:()=>J(16774358,.2,0,{emissive:3814436}),red:()=>J(12854044,.5,.1),orangeRefl:()=>J(15759898,.4,.1,{kind:"plain"}),floor:()=>J(3816768,.7,.4,{kind:"checker"})};function re(n,t,e,i=0,s=0,r=0,a=0,o=0,c=0){let l=new Jt(t,e);return l.position.set(i,s,r),l.rotation.set(a,o,c),l.castShadow=!0,l.receiveShadow=!0,n.add(l),l}function Ae(n,t=0,e=0,i=0,s=0,r=0,a=0){let o=new le;return o.position.set(t,e,i),o.rotation.set(s,r,a),n&&n.add(o),o}function U(n,t,e,i,s,r=0,a=0,o=0,c=0,l=[0,0,0]){let h;if(c>0){let u=Math.max(.001,Math.min(c,t/2-.001,e/2-.001,i/2-.001));h=new Xs(t,e,i,3,u)}else h=new ze(t,e,i);return re(n,h,s,r,a,o,l[0],l[1],l[2])}function Ee(n,t,e,i,s,r,a=0){let o=new R(...t),c=new R(...e),l=c.clone().sub(o),h=l.length(),u=a>0?new Xs(h,s,i,2,Math.min(a,s/2-.001,i/2-.001)):new ze(h,s,i),d=re(n,u,r);return d.position.copy(o.clone().add(c).multiplyScalar(.5)),d.quaternion.setFromUnitVectors(new R(1,0,0),l.normalize()),d}function lt(n,t,e,i,s,r=0,a=0,o=0,c="y",l=32,h=!1){let u=new hn(t,e,i,l,1,h),d=re(n,u,s,r,a,o);return c==="x"&&(d.rotation.z=Math.PI/2),c==="z"&&(d.rotation.x=Math.PI/2),d}function Qt(n,t,e,i,s,r=12){let a=new R(...t),o=new R(...e),c=o.clone().sub(a),l=re(n,new hn(i,i,c.length(),r),s);return l.position.copy(a.clone().add(o).multiplyScalar(.5)),l.quaternion.setFromUnitVectors(new R(0,1,0),c.normalize()),l}function dn(n,t,e,i,s=32,r=10){let a=new Us(t.map(o=>new R(...o)));return re(n,new no(a,s,e,r,!1),i)}function Ve(n,t,e,i,s=0,r=0,a=0,o={}){let c=new Ns(t.map(u=>new j(u[0],u[1])));if(o.holes)for(let u of o.holes)c.holes.push(new es(u.map(d=>new j(d[0],d[1]))));let l=o.bevel||0,h=new eo(c,{depth:Math.max(.001,e-2*l),bevelEnabled:l>0,bevelThickness:l,bevelSize:l,bevelSegments:3,curveSegments:o.curveSegments||16});return h.translate(0,0,-(e-2*l)/2),re(n,h,i,s,r,a,o.rx||0,o.ry||0,o.rz||0)}function Ys(n,t,e,i,s,r=6){let a=Array.isArray(s)?s:[s,s,s,s],o=[],c=(l,h,u,d)=>{if(u<=0){o.push([l,h]);return}for(let f=0;f<=r;f++){let g=d+f/r*Math.PI/2;o.push([l+u*Math.cos(g),h+u*Math.sin(g)])}};return c(n+a[0],t+a[0],a[0],Math.PI),a[0]<=0&&(o[o.length-1]=[n,t]),c(e-a[1],t+a[1],a[1],1.5*Math.PI),a[1]<=0&&(o[o.length-1]=[e,t]),c(e-a[2],i-a[2],a[2],0),a[2]<=0&&(o[o.length-1]=[e,i]),c(n+a[3],i-a[3],a[3],.5*Math.PI),a[3]<=0&&(o[o.length-1]=[n,i]),o}function ls(n,t,e,i,s,r,a,o={}){let c=Ae(n,i,s,r),l=o.tread||ut.steel(),h=o.inset??.015,u=o.split?[[-e/4-.006,e/2-.012],[e/4+.006,e/2-.012]]:[[0,e]];for(let[d,f]of u){lt(c,t,t,f,l,0,0,d,"z",56,!0),o.rim&&(lt(c,t*.995,t*.995,f,o.rim,0,0,d,"z",56,!0).material=o.rim);for(let g of[-1,1]){let x=d+g*(f/2-h);if(o.rim&&h>.02&&re(c,new zs(t*.86,t,48),o.rim,0,0,d+g*(f/2-.001),0,g>0?0:Math.PI,0),lt(c,t*.985,t*.985,.02,a,0,0,x,"z",56),o.spoked){let p=o.spokes||6;for(let m=0;m<p;m++){let M=m/p*Math.PI*2,_=t*.52;U(c,t*.8,.07,.05,a,Math.cos(M)*_,Math.sin(M)*_,x+g*.03,0,[0,0,M])}}if(o.holes){let p=o.holes;for(let m=0;m<p;m++){let M=m/p*Math.PI*2+.3;lt(c,t*.1,t*.1,.012,ut.dark(),Math.cos(M)*t*.6,Math.sin(M)*t*.6,x+g*.012,"z",18)}}lt(c,t*.24,t*.26,.07,o.hubMat||a,0,0,d+g*(f/2+.02),"z",24),lt(c,t*.09,t*.09,.14,ut.dark(),0,0,d+g*(f/2+.05),"z",16)}}return c}function Un(n,t,e,i,s,r,a,o,c=16,l={}){let h=Ae(n,i,s,r),u=l.tread||ut.steel(),d=l.rimT??.07;lt(h,t,t,e,u,0,0,0,"z",64,!0);let f=new Jt(new hn(t-d,t-d,e,64,1,!0),a.clone());f.material.side=$e,f.rotation.x=Math.PI/2,h.add(f);for(let m of[-1,1])re(h,new zs(t-d,t,64),a,0,0,m*e/2,0,m>0?0:Math.PI,0);let g=l.hubR??t*.16,x=t-d-g+.02;return(l.double?[-e*.22,e*.22]:[0]).forEach((m,M)=>{for(let _=0;_<c;_++){let y=_/c*Math.PI*2+(M?Math.PI/c:0),P=g+x/2-.01;U(h,x,l.spokeT??.06,l.spokeW??Math.min(.12,e*.3),o,Math.cos(y)*P,Math.sin(y)*P,m,0,[0,0,y])}}),lt(h,g,g,e*.85,o,0,0,0,"z",28),lt(h,g*.55,g*.55,e*1.05,ut.dark(),0,0,0,"z",16),h}function yn(n,t,e,i,s,r,a,o={}){let c=Ae(n,i,s,r),l=o.rimR??t*.6,h=Math.min(e*.32,(t-l)*.45),u=[],d=6;u.push(new j(l,-e/2+.02));for(let g=0;g<=d;g++){let x=-Math.PI/2+g/d*Math.PI/2;u.push(new j(t-h+h*Math.cos(x),-e/2+h+h*Math.sin(x)))}for(let g=0;g<=d;g++){let x=g/d*Math.PI/2;u.push(new j(t-h+h*Math.cos(x),e/2-h+h*Math.sin(x)))}u.push(new j(l,e/2-.02)),re(c,new ns(u,56),ut.rubber(),0,0,0,Math.PI/2,0,0);let f=o.lugs??0;if(f)for(let g=0;g<f;g++){let x=g/f*Math.PI*2,p=(g%2?1:-1)*e*(o.chevron?.18:.2);U(c,.05,.035,e*(o.chevron?.5:.42),ut.rubber(),Math.cos(x)*(t+.008),Math.sin(x)*(t+.008),p,0,[0,o.chevron?g%2?.45:-.45:0,x])}lt(c,l,l,e*.8,a,0,0,0,"z",40);for(let g of[-1,1])if(lt(c,l*.45,l*.5,.06,o.hubMat||a,0,0,g*(e*.4+.02),"z",24),o.nuts)for(let x=0;x<6;x++){let p=x/6*Math.PI*2;lt(c,.018,.018,.03,ut.dark(),Math.cos(p)*l*.36,Math.sin(p)*l*.36,g*(e*.4+.06),"z",8)}return c}function Jn(n,t,e,i,s,r,a="x",o=4,c=.022){let l=Ae(n,e,i,s);re(l,new un(t,c,10,40),r);for(let h=0;h<o;h++){let u=h/o*Math.PI*2;U(l,t,c*1.2,c*1.2,r,Math.cos(u)*t/2,Math.sin(u)*t/2,0,0,[0,0,u])}return lt(l,c*2.4,c*2.4,c*4,r,0,0,0,"z",14),a==="x"&&(l.rotation.y=Math.PI/2),a==="y"&&(l.rotation.x=Math.PI/2),l}function vi(n,t,e,i,s,r,a=.5,o=.6,c=null){let l=Ae(n,t,e,i),h=Jn(l,s,0,0,0,r,"y",3,.018);h.rotation.set(Math.PI/2,0,0);let u=Ae(l);u.add(h),u.rotation.z=-a;let d=Qt(l,[0,0,0],[Math.sin(a)*o,-Math.cos(a)*o,0],.025,c||ut.dark());return l}function Mi(n,t,e,i,s,r={}){let a=Ae(n,t,e,i,0,r.ry||0,0);return U(a,.42,.08,.44,s,0,0,0,.03),U(a,.08,.38,.42,s,-.22,.2,0,.03,[0,0,.12]),r.post!==!1&&lt(a,.03,.03,r.postH??.3,ut.dark(),0,-(r.postH??.3)/2-.04,0,"y",10),a}function Qe(n,t,e,i,s=.09,r=null){let a=Ae(n,t,e,i);return lt(a,s,s*.85,s*1.2,r||ut.chrome(),0,0,0,"x",20),lt(a,s*.86,s*.86,.01,ut.lamp(),s*.6+.004,0,0,"x",20),a}function hs(n,t,e,i,s,r=.05,a=null,o=!0){lt(n,r,r,i-e,a||ut.chrome(),t,(e+i)/2,s,"y",16),o&&lt(n,r*1.25,r*1.25,.03,a||ut.chrome(),t,i+.015,s,"y",16)}function Kn(n,t){let e=t.x1-t.x0,i=(t.x0+t.x1)/2,s=t.z||0,r=t.material,a=t.postMat||t.material,o=t.thick??.05;if(t.type==="arch"){let l=t.w,h=t.rise??.12,u=16,d=[];for(let f=0;f<=u;f++){let g=f/u,x=-l/2+l*g;d.push([x,h*(1-Math.pow(2*g-1,2))])}for(let f=u;f>=0;f--){let g=f/u,x=-l/2+l*g;d.push([x,h*(1-Math.pow(2*g-1,2))-o])}if(Ve(n,d,e,r,i,t.y,s,{ry:Math.PI/2}),t.valance)for(let f of[-1,1])U(n,e,t.valance.h,.015,t.valance.material,i,t.y-o-t.valance.h/2+.01,s+f*(l/2-.005))}else if(t.type==="corr"){U(n,e,.02,t.w,r,i,t.y-.01,s);let l=.075;for(let h=-t.w/2+l/2;h<t.w/2;h+=l)re(n,new hn(.028,.028,e,8,1,!0,0,Math.PI),r,i,t.y,s+h,0,0,Math.PI/2).material=r}else U(n,e,o,t.w,r,i,t.y-o/2,s,Math.min(.02,o/2.2)),t.lip&&U(n,e+.02,t.lip,t.w+.02,r,i,t.y-o-t.lip/2+.005,s,.005);let c=t.posts||[[t.x0+.06,s-t.w/2+.06,t.base],[t.x0+.06,s+t.w/2-.06,t.base],[t.x1-.06,s-t.w/2+.06,t.base],[t.x1-.06,s+t.w/2-.06,t.base]];for(let l of c)l.length===3?Qt(n,[l[0],l[2],l[1]],[l[0],t.y-o,l[1]],t.postR||.028,a):Qt(n,[l[0],l[2],l[1]],[l[3],t.y-o,l[4]],t.postR||.028,a)}function cc(n,t){let e=t.x1-t.x0,i=(t.x0+t.x1)/2,s=t.z||0,r=t.w,a=t.pillar??.06,o=t.material;U(n,e,t.ySill-t.y0,r,o,i,(t.y0+t.ySill)/2,s,t.r??.03);let c=t.y1-t.ySill,l=(t.ySill+t.y1)/2,h=t.pillarsX||[t.x0+a/2,t.x1-a/2];for(let d of h)for(let f of[-1,1])U(n,a,c,a,o,d,l,s+f*(r/2-a/2));U(n,e+.04,t.roofT??.09,r+.04,t.roofMat||o,i,t.y1+(t.roofT??.09)/2,s,t.roofR??.04);let u=ut.glass();U(n,.012,c,r-2*a,u,t.x1-a/2,l,s),U(n,.012,c,r-2*a,u,t.x0+a/2,l,s);for(let d of[-1,1])U(n,e-2*a,c,.012,u,i,l,s+d*(r/2-a/2));for(let d of[-1,1])U(n,e,.04,.03,o,i,t.ySill+.02,s+d*(r/2-.015))}function go(n,t,e,i,s,r,a,o={}){let c=o.t??.03,l=o.a??.75,h=e/(2*Math.sin(l)),u=h*Math.cos(l),d=e/2,f=[],g=14;for(let p=0;p<=g;p++){let m=-l+2*l*p/g;f.push([u-(h+c)*Math.cos(m),d+(h+c)*Math.sin(m)])}for(let p=g;p>=0;p--){let m=-l+2*l*p/g;f.push([u-h*Math.cos(m),d+h*Math.sin(m)])}let x=Ae(n,s,r,a,0,o.ry||0,0);if(Ve(x,f,t,i,0,0,0),o.edge!==!1&&U(x,.05,.06,t,o.edgeMat||ut.steelGrey(),u-h*Math.cos(l)+.015,.03,0),o.endPlates)for(let p of[-1,1])U(x,h*(1-Math.cos(l))+.12,e,.025,i,u-h+(h*(1-Math.cos(l))+.12)/2-.02,e/2,p*(t/2+.012));return x}function lc(n,t){let e=Ae(n,0,0,t.z),i=t.t??.06,s=[[t.xs,t.ys,t.rs],[t.xi,t.yi,t.ri]];for(let f of t.wheels)s.push([f,t.rw+i,t.rw]);let r=f=>{let g=[];for(let[M,_,y]of s)for(let P=0;P<48;P++){let T=P/48*Math.PI*2;g.push([M+(y+f)*Math.cos(T),_+(y+f)*Math.sin(T)])}g.sort((M,_)=>M[0]-_[0]||M[1]-_[1]);let x=(M,_,y)=>(_[0]-M[0])*(y[1]-M[1])-(_[1]-M[1])*(y[0]-M[0]),p=[],m=[];for(let M of g){for(;p.length>=2&&x(p[p.length-2],p[p.length-1],M)<=0;)p.pop();p.push(M)}for(let M=g.length-1;M>=0;M--){let _=g[M];for(;m.length>=2&&x(m[m.length-2],m[m.length-1],_)<=0;)m.pop();m.push(_)}return m.pop(),p.pop(),p.concat(m)},a=r(i),o=r(.004);Ve(e,a,t.w,t.trackMat||ut.dark(),0,0,0,{holes:[o.slice().reverse()]});let c=0;for(let f=0;f<a.length;f++){let g=a[f],x=a[(f+1)%a.length];c+=Math.hypot(x[0]-g[0],x[1]-g[1])}let l=t.pitch??.17,h=0,u=0;for(let f=0;f<a.length;f++){let g=a[f],x=a[(f+1)%a.length],p=Math.hypot(x[0]-g[0],x[1]-g[1]);for(;u<=h+p;){let m=(u-h)/p,M=g[0]+(x[0]-g[0])*m,_=g[1]+(x[1]-g[1])*m,y=Math.atan2(x[1]-g[1],x[0]-g[0]),P=Math.sin(y),T=-Math.cos(y);U(e,.045,.035,t.w*1.02,t.trackMat||ut.dark(),M+P*.012,_+T*.012,0,0,[0,0,y]),u+=l}h+=p}let d=t.wheelMat||ut.dark();for(let f of t.wheels)t.spokedWheels?Un(e,t.rw,t.w*.7,f,t.rw+i,0,d,d,6,{tread:d,rimT:.04,hubR:.06,spokeT:.04}):(lt(e,t.rw,t.rw,t.w*.75,d,f,t.rw+i,0,"z",28),lt(e,t.rw*.45,t.rw*.45,t.w*.95,ut.dark(),f,t.rw+i,0,"z",16));lt(e,t.rs*.92,t.rs*.92,t.w*.5,t.material,t.xs,t.ys,0,"z",32);for(let f=0;f<14;f++){let g=f/14*Math.PI*2;U(e,.06,.05,t.w*.4,t.material,t.xs+Math.cos(g)*t.rs*.95,t.ys+Math.sin(g)*t.rs*.95,0,0,[0,0,g])}if(lt(e,t.rs*.35,t.rs*.35,t.w*.9,ut.dark(),t.xs,t.ys,0,"z",16),lt(e,t.ri*.95,t.ri*.95,t.w*.6,t.material,t.xi,t.yi,0,"z",28),lt(e,t.ri*.35,t.ri*.35,t.w*.9,ut.dark(),t.xi,t.yi,0,"z",16),U(e,Math.abs(t.xi-t.xs)*.78,.16,t.w*.45,t.material,(t.xi+t.xs)/2,t.rw+i+.12,0,.02),t.carriers)for(let f of t.carriers)lt(e,.07,.07,t.w*.5,ut.dark(),f,Math.max(t.ys,t.yi)+Math.min(t.rs,t.ri)-.07,0,"z",14);return e}function us(n,t,e,i,s={}){if(typeof document>"u")return null;let r=document.createElement("canvas"),a=256/i;r.width=Math.max(64,Math.round(e*a)),r.height=256;let o=r.getContext("2d");s.bg&&(o.fillStyle=s.bg,o.fillRect(0,0,r.width,r.height)),s.border&&(o.strokeStyle=s.border,o.lineWidth=14,o.strokeRect(7,7,r.width-14,r.height-14)),o.fillStyle=s.color||"#000",o.font=`${s.italic?"italic ":""}${s.weight||800} ${s.size||170}px ${s.font||"Arial, Helvetica, sans-serif"}`,o.textAlign="center",o.textBaseline="middle",o.fillText(t,r.width/2,r.height/2+6,r.width*.94);let c=new $n(r);c.colorSpace=ce,c.anisotropy=4;let l=new He({map:c,transparent:!s.bg,roughness:.5,metalness:.05}),h=re(n,new ln(e,i),l,s.x||0,s.y||0,s.z||0,s.rx||0,s.ry||0,s.rz||0);return h.castShadow=!1,h}function tn(n,t,e,i,s,r,a,o,c=!1){if(c)for(let l=0;l<a;l++)U(n,e-t,.018,.02,o,(t+e)/2,i+(l+.5)*(s-i)/a,r);else for(let l=0;l<a;l++)U(n,.02,s-i,.02,o,t+(l+.5)*(e-t)/a,(i+s)/2,r)}function Dh(n,t,e,i=0){let s=Ae(n,t,0,e,0,i,0),r=J(12173511,.75,0);for(let a of[-1,1])lt(s,.065,.055,.86,r,0,.43,a*.1,"y",12);U(s,.24,.62,.42,r,0,1.18,0,.09);for(let a of[-1,1])lt(s,.045,.04,.66,r,0,1.12,a*.26,"y",10);return lt(s,.05,.05,.08,r,0,1.53,0,"y",10),re(s,new Dn(.11,18,14),r,0,1.68,0),s.userData.isHuman=!0,s}function _o(n,t,e,i,s,r,a,o={}){let c=o.rFront??.18,l=o.rBack??.08,h=o.bevel??.035,u=Ys(t,i,e,s,[0,0,c,l],8);return Ve(n,u,r,a,0,0,o.z||0,{bevel:h})}function Zs(n,t,e,i,s,r,a,o=.15,c=Math.PI-.15,l=.035){let h=[];for(let d=0;d<=18;d++){let f=o+(c-o)*d/18;h.push([t+(i+l)*Math.cos(f),e+(i+l)*Math.sin(f)])}for(let d=18;d>=0;d--){let f=o+(c-o)*d/18;h.push([t+i*Math.cos(f),e+i*Math.sin(f)])}return Ve(n,h,s,a,0,0,r)}function xo(n,t,e,i,s,r){U(n,.05,.06,s,r,t,e,i,.01)}function hc(n,t,e,i,s,r,a,o=.012){for(let c=0;c<r;c++)lt(n,o,o,.012,a,t+(e-t)*c/(r-1),i,s,"z",8)}function pn(n){let t=new le,e=J(n.color,.5,.12),i=J(n.wheelColor??n.color,.5,.12),s=J(n.frontColor??n.wheelColor??n.color,.5,.12),r=ut.dark(),a=n.rearD/2,o=n.frontD/2,c=-n.wb/2-(n.shift??0),l=n.wb/2-(n.shift??0),h=n.rearTrack/2,u=n.rearTrack-n.rearW;for(let y of[-1,1])n.spoked?Un(t,a,n.rearW,c,a,y*h,i,i,n.spokes??6,{rimT:.08,hubR:.17,spokeT:.09,spokeW:.11}):ls(t,a,n.rearW,c,a,y*h,i,{inset:n.rearInset??.015,rim:n.rimColor?J(n.rimColor,.5,.15):null,holes:n.rearHoles||0});lt(t,.09,.09,n.rearTrack+n.rearW*.4,r,c,a,0,"z",16),ls(t,o,n.frontW,l,o,0,s,{split:n.split!==!1,spoked:n.frontSpoked,spokes:6,holes:n.frontHoles||0});let d=2*o+.07,f=n.forkColor?J(n.forkColor,.5,.15):e;U(t,.26,.12,n.frontW+.16,f,l,d,0,.03);for(let y of[-1,1])U(t,.2,d-o+.05,.06,f,l,(d+o)/2,y*(n.frontW/2+.06),.02);xo(t,l+o+.04,o*.65,0,n.frontW*.95,n.scraperColor?J(n.scraperColor):f),U(t,.05,.05,n.frontW+.16,f,l+o*.6,o*1.55,0);for(let y of[-1,1])Ee(t,[l,d-.05,y*(n.frontW/2+.06)],[l+o+.04,o*.65,y*(n.frontW/2+.03)],.04,.05,f);for(let y of[-1,1])xo(t,c-a-.04,a*.6,y*h,n.rearW*.9,n.scraperColor?J(n.scraperColor):e);let g=n.frameTop??.95,x=Math.min(n.bodyW??u-.06,u-.04);U(t,.95,(n.platformY??a*1.35)-.3,x,e,c-.05,.3+((n.platformY??a*1.35)-.3)/2,0,.03),U(t,Math.abs(l-c)-.15,g-.42,x*.75,e,(c+l)/2-.05,(g+.42)/2,0,.03);let p=n.hood;if(n.swan){let y=p.x1-.05;for(let P of[-1,1])dn(t,[[y-.3,g-.1,P*.18],[y,g+.25,P*.2],[l-.1,d+.45,P*.14],[l,d+.38,P*.08]],.075,e,24,10);lt(t,.13,.15,.36,e,l,d+.2,0,"y",20)}else lt(t,.12,.12,Math.max(.12,(p.y0??g)-d+.06),r,l,(d+(p.y0??g))/2,0,"y",16);if(p){let y=p.y0??g;_o(t,p.x0,p.x1,y,p.y1,p.w,e,{rFront:p.rFront??.2,rBack:p.rBack??.06,bevel:p.bevel??.04});let P=(p.x0+p.x1)/2;if(p.grille!==!1){let T=p.w*.62,A=(p.y1-y)*.5;U(t,.03,A,T,r,p.x1+.003,y+(p.y1-y)*.42,0,.01),tn(t,p.x1+.02,p.x1+.03,y+(p.y1-y)*.2,y+(p.y1-y)*.64,0,1,e);for(let F=0;F<6;F++)U(t,.012,.018,T*.95,e,p.x1+.022,y+(p.y1-y)*(.22+F*.08),0)}if(p.louvers){let T=p.louvers;for(let A of[-1,1])for(let[F,b]of T.groups||[[.25,.55]]){let w=p.x0+(p.x1-p.x0)*F,N=p.x0+(p.x1-p.x0)*b;tn(t,w,N,y+(p.y1-y)*(T.y0??.35),y+(p.y1-y)*(T.y1??.75),A*(p.w/2+.012),T.n??8,r,T.horizontal)}}if(p.mesh)for(let T of[-1,1])for(let[A,F,b,w]of p.mesh){let N=(p.x1-p.x0)*(F-A),X=(p.y1-y)*(w-b),Q=p.x0+(p.x1-p.x0)*(A+F)/2,L=y+(p.y1-y)*(b+w)/2;U(t,N+.04,X+.04,.012,e,Q,L,T*(p.w/2+.01),.01),U(t,N,X,.012,J(16777215,.7,.5,{kind:"mesh"}),Q,L,T*(p.w/2+.016))}if(p.topSlots)for(let T=0;T<p.topSlots;T++){let A=p.x0+(p.x1-p.x0)*(.2+.6*T/Math.max(1,p.topSlots-1));for(let F=-1;F<=1;F++)U(t,.14,.012,.025,r,A,p.y1+.003,F*.09)}if(p.holes)for(let T of[-1,1])for(let A=0;A<p.holes;A++)lt(t,.035,.035,.012,r,p.x0+(p.x1-p.x0)*(.12+.76*A/(p.holes-1)),p.y1-.12,T*(p.w/2+.01),"z",14);if(p.stripe)for(let T of[-1,1])U(t,p.x1-p.x0-.1,.03,.01,J(p.stripe,.45,.1),P,p.y1-.12,T*(p.w/2+.012));p.plate&&U(t,.32,.12,.01,p.plate==="brass"?ut.brass():ut.alu(),p.x0+(p.x1-p.x0)*.65,y+(p.y1-y)*.55,-(p.w/2+.014),.004)}let m=n.platformY??a*1.35,M=c-a*.75,_=(p?p.x0:c+.4)+.02;if(U(t,_-M,.05,u-.02,r,(M+_)/2,m,0),n.fenders!==!1)for(let y of[-1,1])Zs(t,c,a,a+.05,n.rearW+.06,y*h,e,.25,Math.PI-.25,.03);n.vertWheel?(Qt(t,[_-.05,m,-.25],[_-.12,m+.75,-.25],.03,r),Jn(t,.24,_-.16,m+.82,-.25,J(n.steerColor??2236962),"x",4,.02)):vi(t,_-.15,m+(n.steerH??.95),n.steerZ??-.25,.22,J(n.steerColor??2039583,.5,.1),n.steerTilt??.55,.85),n.seat!==!1&&Mi(t,c-.05,m+.45,n.seatZ??.1,J(n.seatColor??2960687,.85,0),{postH:.38}),n.canopy&&Kn(t,{base:m,...n.canopy,material:J(n.canopy.color??n.color,.55,.12),postMat:J(n.canopy.postColor??n.canopy.color??n.color,.5,.2)}),n.cab&&cc(t,{y0:m,...n.cab,material:e,roofMat:n.cab.roofColor?J(n.cab.roofColor):e});for(let y of n.exhausts||[])hs(t,y.x,y.y0??g,y.y1,y.z??0,y.r??.055,y.color?J(y.color,.3,.8):null,y.cap!==!1);for(let y of n.lights||[])Qe(t,y.x,y.y,y.z,y.r??.085);return n.extras&&n.extras(t,{C:e,WH:i,FF:s,DK:r,xr:c,xf:l,rearR:a,frontR:o,platY:m,frameTop:g,gap:u,zr:h}),t}function Yg(){let n=new le,t=J(1908514,.55,.25),e=J(13121055,.5,.12),i=ut.dark(),s=-1.2,r=2.15,a=.825,o=.6;for(let u of[-1,1])Un(n,a,.5,s,a,u*.9,e,e,16,{rimT:.09,hubR:.15,spokeT:.05,spokeW:.09});lt(n,.08,.08,2.3,i,s,a,0,"z",16),ls(n,o,1.2,r,o,0,e,{split:!0,spoked:!0,spokes:8});let c=1.29;U(n,.3,.12,1.38,t,r,c,0,.03);for(let u of[-1,1])U(n,.24,.72,.07,t,r,(c+o)/2,u*.67,.02);lt(n,.17,.2,.12,t,r,c+.11,0,"y",24);let l=1.8,h=.43;lt(n,h,h,1.95,t,.75,l,0,"x",40);for(let u=0;u<4;u++)lt(n,h+.012,h+.012,.04,ut.dark(),-.1+u*.55,l,0,"x",40);lt(n,.47,.47,.62,t,2.05,l,0,"x",40),lt(n,.44,.44,.04,i,2.37,l,0,"x",40),re(n,new Dn(.06,12,10),ut.brass(),2.4,l,0),lt(n,.11,.12,1,t,2.12,l+.4+.5,0,"y",24),re(n,new ns([new j(.11,0),new j(.13,.04),new j(.16,.1),new j(.16,.14)],24),t,2.12,l+1.39,0),U(n,.9,1.45,.98,t,-.6,1.45,0,.04),U(n,1.45,.38,.62,t,.85,l+h+.16,0,.05),lt(n,.05,.05,.22,ut.brass(),-.45,2.3,-.18,"y",14),lt(n,.05,.05,.22,ut.brass(),-.45,2.3,.18,"y",14),lt(n,.075,.06,.05,ut.brass(),-.45,2.42,-.18,"y",14),lt(n,.075,.06,.05,ut.brass(),-.45,2.42,.18,"y",14),Un(n,.44,.1,0,2.32,.72,t,t,6,{tread:t,rimT:.06,hubR:.07,spokeT:.04,spokeW:.05}),lt(n,.05,.05,.5,i,0,2.32,.48,"z",12),dn(n,[[-.2,2.15,.47],[.6,2.05,.47],[1.6,2,.47],[1.85,1.95,.4]],.025,ut.copper(),24,8),dn(n,[[-1,1.8,-.5],[-.3,1.6,-.47],[.4,1.55,-.45]],.02,ut.brass(),24,8),U(n,.7,1.32,1.24,t,-2.12,1.2,0,.04),U(n,.85,.05,1.24,i,-1.42,.72,0),U(n,.75,.07,1.5,i,-2.85,.42,0);for(let u of[-1,1])U(n,1.6,.14,.08,t,-2.4,.42,u*.68);for(let u of[-1,1])Zs(n,s,a,a+.06,.56,u*.9,t,.35,Math.PI-.35,.03);Qt(n,[-1.55,1.05,-.62],[2,1.05,-.62],.025,i);for(let u=0;u<18;u++)U(n,.05,.02,.03,i,r-.2+u*.012,1.08+u%2*.015,-.62);return Jn(n,.27,-1.7,1.62,-.42,e,"x",5,.022),Qt(n,[-1.7,1.62,-.42],[-1.55,1.05,-.62],.025,i),Kn(n,{type:"corr",x0:-2.95,x1:2,y:3.15,w:2.05,material:J(3422268,.6,.35),postMat:t,posts:[[-2.88,-.95,.45],[-2.88,.95,.45],[1.55,-.38,l+.3],[1.55,.38,l+.3]]}),Qt(n,[-2.88,1.3,-.95],[-2.88,2.6,.95],.018,t),Qt(n,[-2.88,1.3,.95],[-2.88,2.6,-.95],.018,t),re(n,new un(.16,.018,8,28),t,-2.88,1.95,0,0,Math.PI/2,0),Qt(n,[2.12,2.75,0],[1.55,3.1,0],.022,t),n}function qg(){let n=new le,t=J(15259214,.5,.1),e=ut.dark(),i=ut.white(),s=.45,r=1;ls(n,s,r,1.05,s,0,t,{}),ls(n,s,r,-.95,s,0,t,{}),_o(n,-1.7,.55,.78,1.5,1.2,t,{rFront:.1,rBack:.06,bevel:.03});for(let a of[-1,1])U(n,.5,.35,.04,t,-.95,.62,a*.58,.02);U(n,.9,.3,1.12,t,.95,1.05,0,.04);for(let a of[-1,1])U(n,.2,.6,.06,t,1.05,.72,a*.56,.02);lt(n,.1,.1,.2,e,.6,1.15,0,"y",14),xo(n,1.55,.3,0,.95,t),xo(n,-1.45,.3,0,.95,t),tn(n,1.12,1.38,1,1.18,.565,6,e),tn(n,1.12,1.38,1,1.18,-.565,6,e),Qe(n,1.42,1.1,.42,.07),Qe(n,1.42,1.1,-.42,.07),U(n,.02,.22,.6,e,-1.72,.75,0);for(let a of[-1,1])U(n,.9,.5,.012,J(14272581,.55,.1),-.55,1.05,a*.606,.004),lt(n,.18,.18,.015,J(13811775),.1,.95,a*.607,"z",24),hc(n,-1.6,.4,.62,a*.607,12,e);return U(n,.45,.04,1,e,-1.95,.6,0),U(n,.25,.45,.7,t,-1.62,1.72,0,.03,[0,0,-.35]),vi(n,-1.78,1.95,0,.18,J(1907997),.9,.3),Kn(n,{type:"arch",rise:.12,x0:-1.85,x1:-.15,y:2.4,w:1.25,thick:.05,material:t,postMat:i,posts:[[-1.78,-.55,.62],[-1.78,.55,.62],[.35,-.55,1.5,-.25,-.55],[.35,.55,1.5,-.25,.55]]}),n}function Zg(){let n=new le,t=J(3119692,.5,.12),e=ut.dark(),i=15975956;U(n,1.4,.05,1.3,t,1.95,.45,0),U(n,.05,.42,1.3,t,2.64,.65,0);for(let s of[-1,1]){let o=Ae(n,1.95,.45+Math.cos(.22)*.72/2,s*(.66+Math.sin(.22)*.72/2),s*.22,0,0);U(o,1.4,.72,.04,t,0,0,0),U(o,1.42,.05,.07,t,0,.72/2,0),us(o,"Barber-Greene",1.2,.24,{color:"#f3c614",font:"Georgia, serif",weight:700,x:-.02,y:.08,z:s*.023,ry:s>0?0:Math.PI,size:150})}for(let s of[-1,1])Un(n,.27,.14,2,.27,s*.78,t,t,8,{tread:ut.rubber(),rimT:.05,hubR:.05,spokeT:.03,spokeW:.04});U(n,2,.75,1.3,t,.35,.85,0,.04),U(n,1,.55,.62,J(2784576,.55,.3),.15,1.5,0,.04),U(n,.3,.3,.3,ut.engine(),.55,1.45,.33);for(let[s,r]of[[-.4,-.6],[-.4,.6],[.75,-.6],[.75,.6]])Qt(n,[s,1.22,r],[s,1.95,r],.03,t);U(n,1.25,.05,1.3,t,.17,1.97,0,.01),lt(n,.13,.13,.42,J(13482382,.6,.1),.45,2.2,-.2,"y",20),lt(n,.03,.03,.35,e,.45,2.55,-.2,"y",10);for(let s of[-1,1])yn(n,.62,.36,-.2,.62,s*.97,t,{lugs:26,rimR:.36,nuts:!0});U(n,.65,.05,1.2,e,-.98,1.22,0),U(n,.2,.35,.3,t,-.75,1.42,-.1,.02),vi(n,-.8,1.85,-.1,.22,J(2236962),.25,.35),Mi(n,-1.15,1.6,-.1,J(9409687,.7,.1),{postH:.35}),dn(n,[[-1.28,1.22,-.55],[-1.32,1.65,-.55],[-1.32,1.65,.45],[-1.28,1.22,.45]],.022,t,20,8),lt(n,.12,.12,.06,t,-.75,1.3,.3,"y",20),Qe(n,-.55,1.35,.5,.05),U(n,.45,.32,2.6,t,-2.15,.25,0,.03);for(let s of[-1,1])U(n,.6,.62,.04,t,-2.1,.4,s*1.32,.02),Ee(n,[.55,.5,s*.72],[-1.95,.38,s*1.22],.08,.11,t,.02),Qt(n,[-1.3,.9,s*1.05],[-1.9,.62,s*1.22],.02,e);return n}function $g(){let n=new le,t=J(15906565,.5,.12),e=J(1513498,.6,.2),i=J(13049640,.75,0),s=ut.dark();for(let r of[-1,1])lc(n,{z:r*.92,xs:-1.05,ys:.33,rs:.27,xi:1.35,yi:.33,ri:.27,wheels:[-.62,-.22,.18,.58,.98],rw:.11,t:.06,w:.34,material:t,trackMat:s,wheelMat:t,pitch:.16});U(n,1.15,.06,1.5,e,1.95,.62,0),U(n,.06,.42,1.5,e,2.52,.82,0,.01);for(let r of[-1,1]){let c=Ae(n,1.95,.62+Math.cos(.38)*.82/2,r*(.75+Math.sin(.38)*.82/2),r*.38,0,0);U(c,1.15,.82,.05,e,0,0,0),U(c,1.17,.07,.09,e,0,.82/2,0)}U(n,2.4,.85,1.55,t,.15,1.05,0,.04),U(n,1.5,.55,1.25,t,0,1.75,0,.05),tn(n,-.5,.5,1.6,1.9,.63,10,s),tn(n,-.5,.5,1.6,1.9,-.63,10,s),hs(n,.55,2,3.05,.35,.065),lt(n,.1,.1,.4,ut.chrome(),.55,2.35,.35,"y",16),U(n,.9,.05,2.3,s,-1.05,1.5,0);for(let r of[-1,1])Mi(n,-1.15,1.95,r*.85,J(2829099),{postH:.4}),vi(n,-.75,2.3,r*.85,.18,J(1907997),.6,.6),dn(n,[[-1.5,1.5,r*1.12],[-1.5,2.15,r*1.12],[-.6,2.15,r*1.12],[-.6,1.5,r*1.12]],.02,t,20,8);U(n,.35,.4,.5,t,-.65,1.95,0,.03),Kn(n,{type:"flat",x0:-1.45,x1:.55,y:3.28,w:2.05,thick:.08,lip:.12,material:i,postMat:t,posts:[[-1.4,-.98,1.5],[-1.4,.98,1.5],[.5,-.98,1.5],[.5,.98,1.5]]}),U(n,.5,.4,2.5,e,-1.6,.3,0,.03);for(let r of[-1,1])U(n,.55,.55,.04,e,-1.58,.42,r*1.27,.02),Ee(n,[.45,.62,r*1.14],[-1.4,.48,r*1.14],.08,.12,t,.02);return n}function Jg(){let n=new le,t=J(2270043,.5,.12),e=J(8225415,.55,.3),i=J(16106496,.5,.1),s=ut.black(),r=ut.dark();U(n,1.3,.06,1.45,t,1.95,.55,0);for(let a of[-1,1]){let l=Ae(n,1.95,.55+Math.cos(.3)*.72/2,a*(.72+Math.sin(.3)*.72/2),a*.3,0,0);U(l,1.3,.72,.05,t,0,0,0),U(l,1.32,.06,.08,t,0,.72/2,0)}U(n,.08,.35,1.5,t,2.62,.75,0);for(let a of[-1,1])U(n,.14,.18,.35,s,2.72,.48,a*.55,.02);for(let a of[-1,1])lt(n,.27,.27,.22,J(2829616,.8,.1),1.85,.27,a*.62,"z",28),lt(n,.14,.14,.24,t,1.85,.27,a*.62,"z",20);for(let a of[-1,1])yn(n,.65,.42,-.35,.65,a*.98,t,{lugs:26,rimR:.38,nuts:!0});U(n,2.1,.7,1.4,t,.25,.9,0,.04),U(n,1.55,1.15,1.25,t,.45,1.8,0,.05),tn(n,0,.9,1.55,2,.63,9,r),Qe(n,1.24,2.15,.45,.07),Qe(n,1.24,2.15,-.45,.07);for(let a of[-1,1])U(n,.04,.05,.08,ut.orangeRefl(),1.24,2.32,a*.58);hs(n,.75,2.35,3.15,.3,.06),us(n,"V\xD6GELE",.55,.22,{color:"#111",bg:"#f5c400",weight:800,x:.35,y:1.6,z:-.637,ry:Math.PI,size:160}),us(n,"V\xD6GELE",.55,.22,{color:"#111",bg:"#f5c400",weight:800,x:.35,y:1.6,z:.637,size:160}),U(n,1,.05,1.5,r,-1.05,1.28,0),Mi(n,-1.15,1.75,-.45,J(3815994),{postH:.4}),vi(n,-.7,2.05,-.45,.2,J(1907997),.55,.6),U(n,.3,.55,.4,t,-.45,1.6,-.45,.03),Kn(n,{type:"flat",x0:-1.6,x1:-.35,y:3.25,w:1.5,z:-.35,thick:.07,material:i,postMat:J(9080724,.5,.5),posts:[[-1.55,-1,1.28],[-.4,-1,1.28],[-1.55,.3,1.28],[-.4,.3,1.28]]}),U(n,.55,.45,2.5,e,-1.95,.32,0,.03),U(n,.45,.04,2.5,e,-2.42,.45,0);for(let a of[-1,1])U(n,.6,.65,.04,e,-1.95,.45,a*1.27,.02),Ee(n,[.4,.62,a*1.12],[-1.75,.45,a*1.15],.09,.13,e,.02),Qt(n,[-2.62,.45,a*1.2],[-2.62,1.05,a*1.2],.02,e);return Qt(n,[-2.62,1.05,-1.2],[-2.62,1.05,1.2],.02,e),n}function qs(n){let t=new le,e=J(n.color,.5,.12),i=J(n.rimColor??n.color,.5,.12),s=J(n.bladeColor??2764081,.55,.3),r=ut.dark(),a=2.5,o=-2.6;for(let x of[-1,1])yn(t,.5,.26,a,.5,x*.9,i,{lugs:22,rimR:.27,nuts:!0});for(let x of[-1,1])yn(t,.55,.3,o,.55,x*1,i,{lugs:24,rimR:.3,nuts:!0});if(U(t,.18,.16,1.8,e,a,.55,0,.02),U(t,.2,.18,2,e,o,.6,0,.02),n.drawbar==="pole")Ee(t,[a,.62,0],[3.85,.5,0],.12,.14,e,.02),lt(t,.07,.07,.14,e,3.9,.5,0,"y",14),dn(t,[[3.6,.5,.08],[3.3,.45,.12],[3,.5,.1]],.012,r,12,6);else{for(let x of[-1,1])Ee(t,[a+.05,.55,x*.72],[3.75,.5,x*.05],.08,.09,e,.02);for(let x of[.35,.7])Ee(t,[a+.05+(3.75-a-.05)*x,.53,-.72*(1-x)-.05*x],[a+.05+(3.75-a-.05)*x,.53,.72*(1-x)+.05*x],.04,.05,e);lt(t,.08,.08,.12,e,3.85,.5,0,"y",16),n.standLeg&&Qt(t,[3.5,.5,0],[3.5,0,0],.03,e)}let c=n.frame==="straight",l=c?[[a,.7,0],[a-.3,1.38,0],[0,1.45,0],[o+.2,1.3,0],[o-.55,1.15,0]]:[[a+.05,.72,0],[a-.3,1.62,0],[1.4,1.98,0],[-.4,1.82,0],[o+.3,1.36,0],[o-.55,1.18,0]],h=c?[0]:[-.28,.28];for(let x of h)for(let p=0;p<l.length-1;p++){let m=l[p],M=l[p+1],_=c?0:Math.max(0,1-p*.5),y=c?0:Math.max(0,1-(p+1)*.5);Ee(t,[m[0],m[1],x*(1-_*.7)],[M[0],M[1],x*(1-y*.7)],c?.32:.16,c?.34:.3,e,.025)}if(!c)for(let[x,p]of[[1.9,1.85],[.6,1.9],[-.9,1.68],[-1.9,1.45]])U(t,.1,.22,.56,e,x,p,0,.02);for(let x of[-1,1])Ee(t,[a-.2,.62,x*.08],[.4,.62,x*.62],.08,.1,e,.02);re(t,new un(.8,.06,10,48),e,0,.72,0,Math.PI/2,0,0);for(let x=0;x<28;x++){let p=x/28*Math.PI*2;U(t,.05,.06,.09,r,Math.cos(p)*.75,.72,Math.sin(p)*.75,0,[0,-p,0])}for(let x of[-1,1])Ee(t,[x*.45,.72,.62*x],[.05-Math.sin(n.bladeAngle??.55)*.9*x,.38,Math.cos(n.bladeAngle??.55)*.9*x],.07,.08,e);let u=n.bladeAngle??.55,d=go(t,3.65,.55,s,.05,.1,0,{ry:u,a:.7,t:.04,endPlates:!1,edgeMat:r});if(n.stripes)for(let x of[-1,1])for(let p=0;p<4;p++)us(d,"",.14,.45,{bg:p%2?"#ffffff":"#d42020",x:.02,y:.26,z:x*(1.72-p*.14),ry:-Math.PI/2});for(let x of[-1,1]){let p=x*1,m=-Math.sin(u)*p*0+.05;Ee(t,[x*.3,.62,x*.5],[Math.sin(u)*1.1*x*-1+.05,.4,Math.cos(u)*1.1*x],.06,.06,e)}for(let x of[-1,1]){let p=.05+Math.sin(u)*-1.2*x,m=Math.cos(u)*1.2*x;Qt(t,[x*.5,c?1.4:1.75,x*.32],[p,.66,m],.045,r),U(t,.3,.3,.3,e,x*.5,c?1.55:1.9,x*.32,.03)}let f=o-.35;U(t,.38,1.05,.7,e,f,1.55,0,.03);let g=J(n.handwheelColor??n.color,.5,.2);for(let x of[-1,1])Jn(t,.4,f-.36,1.82,x*.42,g,"x",5,.032),lt(t,.13,.13,.24,e,f-.19,1.82,x*.42,"x",18),Qt(t,[f,1.82,x*.32],[x*.5,c?1.55:1.9,x*.32],.028,r);if(n.topWheel&&Jn(t,.22,f-.28,2.3,0,g,"x",4,.022),U(t,.8,.05,1.4,r,o-.8,.95,0),Mi(t,o-.95,1.42,n.seatZ??.45,J(2039583),{postH:.42}),n.rails&&dn(t,[[o-1.18,.95,-.7],[o-1.2,1.55,-.7],[o-1.2,1.55,.7],[o-1.18,.95,.7]],.022,e,20,8),n.towHitch&&U(t,.25,.08,.12,r,o-1.2,.6,0),n.canopy&&(Kn(t,{type:"flat",x0:o-1.2,x1:o-.1,y:2.7,w:1.35,thick:.06,material:e,postMat:e,posts:[[o-.25,-.62,.97,o-.75,-.62],[o-.25,.62,.97,o-.75,.62]]}),Qe(t,o-.06,2.56,.35,.08,ut.black()),Qe(t,o-.06,2.56,-.35,.08,ut.black())),n.hydraulic){for(let x of[-1,1])dn(t,[[3.7,.55,x*.08],[3.2,.62,x*.4],[2.6,.9,x*.15],[2.3,1.2,x*.1]],.02,ut.black(),24,8);U(t,.3,.25,.4,e,2.2,1.3,0,.03);for(let x of[-1,1])lt(t,.05,.05,.7,ut.chrome(),x*.5,1,x*.45,"y",12)}if(n.stripes)for(let x=0;x<6;x++)U(t,.06,.12,.2,J(x%2?16777215:13901856),o-1.15,.62,-.5+x*.2);return t}function Kg(){let n=new le,t=J(15909402,.5,.12),e=J(13116204,.5,.12),i=J(9278361,.5,.35),s=ut.dark(),r=-.55,a=1.65;for(let u of[-1,1])yn(n,.76,.38,r,.76,u*.82,t,{lugs:22,chevron:!0,rimR:.46,nuts:!0});for(let u of[-1,1])yn(n,.44,.17,a,.44,u*.66,t,{lugs:18,rimR:.25,nuts:!0});U(n,.14,.14,1.25,s,a,.5,0),U(n,1.1,.75,.7,t,r+.1,.82,0,.05),U(n,1.1,.5,.48,e,.75,.95,0,.04),U(n,.25,.22,.3,ut.engine(),.9,1.05,.3),_o(n,.15,2.05,1.2,1.45,.62,t,{rFront:.08,rBack:.03,bevel:.03}),U(n,.08,.62,.62,t,2.02,.95,0,.03);for(let u=0;u<7;u++)U(n,.02,.025,.46,s,2.065,.72+u*.07,0);for(let u of[-1,1])Qe(n,1.98,1.25,u*.38,.08);U(n,.8,.12,.25,s,1.4,.55,0);for(let u of[-1,1])Zs(n,r,.76,.84,.44,u*.82,t,.35,Math.PI-.2,.03);U(n,.75,.05,1.2,s,r-.15,1.12,0),Mi(n,r-.25,1.48,0,J(2763306),{postH:.32}),vi(n,r+.35,1.85,0,.21,J(1907997),.55,.7),hs(n,1.15,1.45,2.35,.2,.045,ut.dark()),lt(n,.07,.07,.35,e,1.15,1.6,-.2,"y",14),lt(n,.085,.085,.06,e,1.15,1.8,-.2,"y",14),Kn(n,{type:"flat",x0:-1.15,x1:.35,y:2.42,w:1.3,thick:.08,lip:.06,material:t,postMat:t,posts:[[-1.08,-.6,1.12],[-1.08,.6,1.12],[.28,-.6,1.12],[.28,.6,1.12]]}),go(n,2.2,.62,i,2.55,.02,0,{a:.6,t:.03,endPlates:!0,edgeMat:s}),U(n,.06,.12,2.2,e,2.38,.55,0);for(let u of[-1,1])Ee(n,[2.38,.35,u*.55],[1.05,.45,u*.5],.08,.1,e,.02);lt(n,.045,.045,.7,ut.chrome(),2.05,.85,0,"y",12),U(n,.35,.5,1.5,e,-1.35,.75,0,.03);for(let u of[-1,1])Ee(n,[-1.4,.6,u*.7],[-1.75,0,u*.95],.08,.1,e,.02),U(n,.28,.05,.22,s,-1.8,.03,u*.98);lt(n,.12,.12,1.1,e,-1.6,1.15,0,"y",20);let o=[-1.62,1.55,0],c=[-2.2,3.15,0],l=[-3.05,1.35,0];Ee(n,o,c,.18,.24,e,.03),Ee(n,c,l,.14,.2,e,.03),Qt(n,[-1.55,1.2,0],[-1.95,2.6,0],.06,e),Qt(n,[-1.75,2,0],[-2.15,2.95,0],.035,ut.chrome()),Qt(n,[-2,3,0],[-2.7,2.2,0],.05,e);let h=Ae(n,-3.08,1.2,0,0,0,.9);Ve(h,[[0,0],[.42,0],[.48,.12],[.42,.36],[.12,.42],[0,.3]],.5,i,0,-.2,0,{bevel:.01});for(let u=0;u<4;u++)U(h,.1,.03,.04,s,.48,-.15,-.18+u*.12);return n}function Uh(n){let t=new le,e=J(n.color,.5,.12),i=ut.dark(),s=n.gauge;for(let o of[-1,1])if(lc(t,{z:o*s/2,xs:n.xs,ys:n.ys,rs:n.rs,xi:n.xi,yi:n.yi,ri:n.ri,wheels:n.wheels,rw:n.rw,t:.06,w:n.tw,material:e,trackMat:J(3879982,.85,.4),wheelMat:n.spokedWheels?e:i,spokedWheels:n.spokedWheels,carriers:n.carriers,pitch:.17}),n.springs)for(let c of n.springs)lt(t,.07,.07,.28,e,c,.45,o*s/2-o*.04,"x",14);if(U(t,n.bodyL,.5,s-n.tw-.04,e,n.bodyX,.85,0,.03),_o(t,n.hood.x0,n.hood.x1,1.05,n.hood.y1,n.hood.w,e,{rFront:n.hood.rFront??.1,rBack:.04,bevel:.03}),n.hood.louvers)for(let o of[-1,1])tn(t,n.hood.x0+.25,n.hood.x1-.35,1.2,n.hood.y1-.12,o*(n.hood.w/2+.012),12,i);if(n.hood.open)for(let o of[-1,1])U(t,(n.hood.x1-n.hood.x0)*.6,(n.hood.y1-1.05)*.7,.05,ut.engine(),(n.hood.x0+n.hood.x1)/2,1.05+(n.hood.y1-1.05)*.4,o*(n.hood.w/2-.03)),dn(t,[[n.hood.x0+.3,1.35,o*(n.hood.w/2+.03)],[n.hood.x0+.7,1.45,o*(n.hood.w/2+.05)],[n.hood.x1-.3,1.38,o*(n.hood.w/2+.03)]],.025,i,16,8);if(U(t,.05,(n.hood.y1-1.05)*.7,n.hood.w*.75,i,n.hood.x1+.01,1.05+(n.hood.y1-1.05)*.45,0,.01),n.grille==="h")for(let o=0;o<8;o++)U(t,.03,.025,n.hood.w*.72,e,n.hood.x1+.04,1.12+o*(n.hood.y1-1.2)*.7/8,0);if(n.grille==="v")for(let o=0;o<9;o++)U(t,.03,(n.hood.y1-1.05)*.6,.025,e,n.hood.x1+.04,1.05+(n.hood.y1-1.05)*.45,-n.hood.w*.32+o*n.hood.w*.08);lt(t,.06,.06,.08,e,n.hood.x1-.2,n.hood.y1+.03,0,"y",14);for(let o of[-1,1])U(t,n.fenderL,.04,n.tw+.08,e,n.fenderX,n.fenderY,o*s/2);cc(t,{...n.cab,material:e,roofMat:n.cab.roofColor?J(n.cab.roofColor,.5,.1):e}),n.tank&&(lt(t,.32,.32,1.05,e,n.tank.x,n.tank.y,0,"z",24),lt(t,.05,.05,.12,i,n.tank.x,n.tank.y+.34,.2,"y",10)),hs(t,n.exhaust.x,n.hood.y1,n.exhaust.y1,n.exhaust.z,.05,ut.dark()),n.exhaust.capColor&&lt(t,.07,.07,.08,J(n.exhaust.capColor),n.exhaust.x,n.exhaust.y1+.02,n.exhaust.z,"y",14),n.airCleaner&&(lt(t,.09,.09,.45,i,n.airCleaner.x,n.hood.y1+.22,n.airCleaner.z,"y",14),lt(t,.12,.08,.14,J(14606046),n.airCleaner.x,n.hood.y1+.5,n.airCleaner.z,"y",14));let r=n.blade,a=J(r.color??n.color,r.color?.4:.5,r.color?.55:.12);go(t,r.w,r.h,a,r.x,.03,0,{a:.65,t:.04,endPlates:!0,edgeMat:i});for(let o of[-1,1])Ee(t,[r.x-.12,.38,o*(s/2+n.tw/2+.06)],[r.armX,.5,o*(s/2+n.tw/2+.06)],.09,.12,e,.02);if(r.cyl&&(Qt(t,[r.x-.2,.75,0],[n.hood.x1-.05,1.45,0],.06,e),Qt(t,[r.x-.25,.72,0],[r.x-.65,.95,0],.035,ut.chrome())),n.hitch){U(t,.3,.25,.9,J(13116204),n.cab.x0-.2,.8,0,.03);for(let o of[-1,1])Ee(t,[n.cab.x0-.25,.7,o*.35],[n.cab.x0-.75,.45,o*.4],.06,.07,J(13116204))}return t}function Nh(n,t,e,i,s,r,a=.025){let o=t.map(h=>new j(h[0],h[1])),c=[],l=[];for(let h=0;h<o.length;h++){let u=o[Math.max(0,h-1)],d=o[Math.min(o.length-1,h+1)],f=new j().subVectors(d,u).normalize(),g=new j(-f.y,f.x);c.push([o[h].x+g.x*e/2,o[h].y+g.y*e/2]),l.push([o[h].x-g.x*e/2,o[h].y-g.y*e/2])}return Ve(n,c.concat(l.reverse()),i,r,0,0,s,{bevel:a})}function jg(){let n=new le,t=J(3109567,.42,.15),e=ut.white(),i=ut.dark(),s=J(15921903,.5,.1),r=.47,a=2.25;[a,-1.33,-2.45].forEach((f,g)=>{for(let x of[-1,1]){let p=x*(g?.885:.935);yn(n,r,.24,f,r,p,g===0&&x>0?t:s,{lugs:26,rimR:.26,nuts:!0,hubMat:s})}U(n,.14,.16,g?1.6:1.7,i,f,r,0,.03),lt(n,.16,.16,.24,i,f,r,0,"y",16)});for(let f of[-1,1])U(n,6,.2,.08,i,-.25,.86,f*.43);for(let f of[-1,1])for(let g of[-1.33,-2.45])U(n,1,.07,.07,i,g,.68,f*.7);let c=Ve(n,Ys(1.55,1,3.18,1.82,[0,0,.14,.04],8),1,t,0,0,0,{bevel:.07});c.scale.z=1;for(let f of[-1,1])tn(n,2,2.75,1.38,1.62,f*.505,9,J(2378106)),U(n,1.55,.012,.012,J(2378106),2.38,1.78,f*.43);U(n,.08,.66,.84,t,3.2,1.36,0,.05),U(n,.03,.56,.7,J(1909030),3.24,1.33,0,.01);for(let f=0;f<13;f++)U(n,.04,.54,.018,J(10134444,.35,.7,{kind:"plain"}),3.26,1.33,-.33+f*.055);us(n,"PRAGA",.4,.075,{color:"#e9edf0",weight:800,x:3.252,y:1.71,z:0,ry:Math.PI/2,size:160});for(let f of[-1,1])Nh(n,[[1.5,.8],[1.52,1.1],[1.75,1.16],[2.25,1.15],[2.6,1.1],[2.95,1],[3.22,.9],[3.36,.8]],.06,.5,f*.9,t),Zs(n,a,r,.6,.06,f*1.13,t,.25,Math.PI-.45,.04),Qe(n,3.3,.98,f*.82,.11,t),Qt(n,[3.22,.92,f*.82],[3.3,.98,f*.82],.03,t),U(n,.06,.05,.1,ut.orangeRefl(),3.2,1.26,f*.98);U(n,.2,.22,2.26,t,3.46,.72,0,.03);for(let f of[-1,1])re(n,new un(.06,.018,8,16,Math.PI*1.4),i,3.6,.68,f*.55,0,0,Math.PI/2);Ve(n,[[.35,.98],[1.58,.98],[1.6,1.86],[1.5,2.6],[1.42,2.74],[.42,2.76],[.35,2.66]],2,t,0,0,0,{bevel:.05}),Ve(n,Ys(.36,2.66,1.47,2.86,[0,0,.08,.06],6),2.02,e,0,0,0,{bevel:.04}),lt(n,.25,.26,.08,e,.82,2.9,.38,"y",30);let l=ut.glass();for(let f of[-1,1])U(n,.02,.66,.86,l,1.565,2.22,f*.47,0,[0,0,.13]),U(n,.8,.56,.02,l,.98,2.25,f*1.015),U(n,.012,.95,.012,J(2378106),.47,1.6,f*1.02),U(n,.012,.95,.012,J(2378106),1.42,1.6,f*1.02),U(n,.12,.03,.03,ut.chrome(),.62,1.82,f*1.03),U(n,.55,.05,.22,i,.95,.62,f*.98),Qt(n,[1.45,2.32,f*1],[1.62,2.4,f*1.22],.012,i),U(n,.02,.2,.13,i,1.62,2.48,f*1.24),Qt(n,[1.58,1.9,f*.45],[1.5,2.45,f*.6],.008,i);U(n,.05,.7,.06,t,1.565,2.22,0,0,[0,0,.13]),U(n,.02,.38,1.1,l,.335,2.35,0);let h=-3.46,u=.22,d=1.18;U(n,u-h,.1,2.24,t,(h+u)/2,d,0,.01);for(let f=0;f<7;f++)U(n,.08,.12,2.2,i,h+.3+f*.52,d-.1,0);for(let f of[-1,1]){U(n,u-h,.5,.04,t,(h+u)/2,d+.3,f*1.1,.01);for(let g=0;g<3;g++)U(n,u-h-.04,.02,.012,J(2378106),(h+u)/2,d+.14+g*.15,f*1.125);for(let g=0;g<4;g++)U(n,.06,.52,.06,t,h+.2+g*(u-h-.4)/3,d+.3,f*1.13);U(n,.08,.05,.1,ut.orangeRefl(),h+.4,.98,f*1.1),U(n,.1,.08,.04,ut.red(),h+.05,.9,f*.9)}return U(n,.04,.5,2.24,t,h+.02,d+.3,0,.01),U(n,.06,1,2.24,t,u,d+.5,0,.01),lt(n,.2,.2,.7,i,-.55,.62,.62,"x",18),n}function Qg(){let n=new le,t=J(15790314,.42,.08),e=J(13116191,.42,.12),i=ut.dark(),s=J(12370373,.3,.7,{kind:"plain"}),r=.56,a=2.9;[a,-1.35,-2.67].forEach((h,u)=>{for(let d of[-1,1])yn(n,r,.3,h,r,d*1,e,{lugs:26,rimR:.3,nuts:!0,hubMat:e});U(n,.16,.18,1.7,i,h,r,0,.03)}),U(n,.32,.32,.3,i,-2,r+.1,0,.04);for(let h of[-1,1])U(n,7.6,.24,.1,i,-.2,.98,h*.45);Ve(n,[[1.72,1.05],[3.62,1.05],[3.98,1.2],[3.98,1.42],[3.78,1.74],[3.4,1.86],[1.72,1.96]],1.08,t,0,0,0,{bevel:.1});for(let h of[-1,1]){let u=Ae(n,3.9,1.56,h*.21,0,0,.56);U(u,.04,.5,.26,e,0,0,0,.02);for(let d=0;d<7;d++)U(u,.03,.46,.012,J(8000786),.02,0,-.105+d*.035);tn(n,2.2,3.25,1.35,1.72,h*.545,12,J(14277074))}U(n,.012,.012,1.9,J(13816523),2.8,1.97,0);for(let h of[-1,1])Nh(n,[[1.66,.86],[1.7,1.3],[2.1,1.38],[2.9,1.36],[3.4,1.27],[3.8,1.1],[4,.92]],.07,.58,h*.98,e,.03),Zs(n,a,r,.7,.08,h*1.25,e,.15,Math.PI-.35,.05),Qe(n,3.86,1.16,h*.95,.12,e),Qt(n,[3.75,1.36,h*1.2],[3.75,1.85,h*1.2],.012,t);U(n,.22,.26,2.48,e,4.1,.86,0,.04),Ve(n,[[.5,1.06],[1.74,1.06],[1.77,1.95],[1.66,2.55],[1.56,2.62],[.58,2.64],[.5,2.56]],2.24,t,0,0,0,{bevel:.08}),Ve(n,Ys(.5,2.58,1.6,2.72,[0,0,.06,.06],6),2.26,e,0,0,0,{bevel:.03}),lt(n,.23,.24,.1,e,1.05,2.78,0,"y",30);let c=ut.glass();for(let h of[-1,1])U(n,.02,.56,.95,c,1.725,2.25,h*.53,0,[0,0,.18]),U(n,.72,.5,.02,c,1.08,2.22,h*1.13),U(n,.012,1,.012,J(13619144),.62,1.6,h*1.135),U(n,.12,.03,.03,ut.chrome(),.78,1.84,h*1.14),Qt(n,[1.62,2.18,h*1.1],[1.82,2.24,h*1.32],.012,i),U(n,.02,.2,.13,i,1.82,2.32,h*1.35),U(n,.5,.05,.22,i,1.1,.75,h*1.06);U(n,.05,.58,.06,t,1.725,2.25,0,0,[0,0,.18]),U(n,4.7,.62,2.36,e,-1.88,1.32,0,.03);for(let h of[-1,1])for(let u=0;u<4;u++)U(n,1,.44,.02,J(11673114),-3.62+u*1.12,1.3,h*1.19,.006),U(n,.1,.03,.03,ut.chrome(),-3.62+u*1.12,1.42,h*1.205);re(n,new hn(1,1,4.55,48,1),s,-1.88,2.28,0,0,0,Math.PI/2).scale.set(.66,1,1.13);for(let h of[-4.155,.395])re(n,new Dn(1,32,16,0,Math.PI*2,0,Math.PI/2),s,h,2.28,0,0,0,h<0?Math.PI/2:-Math.PI/2).scale.set(.66,.16,1.13);for(let h of[-3.7,-2.4,-1.1,0])re(n,new un(.665,.02,8,48),s,h,2.28,0,0,Math.PI/2,0).scale.set(1,1,1.7);for(let h=0;h<3;h++)lt(n,.2,.2,.14,s,-3.3+h*1.4,2.98,0,"y",22),lt(n,.22,.22,.03,s,-3.3+h*1.4,3.06,0,"y",22);for(let h of[-1,1]){Qt(n,[-4,3.12,h*.32],[.3,3.12,h*.32],.018,s);for(let u=0;u<6;u++)Qt(n,[-3.9+u*.84,2.92,h*.32],[-3.9+u*.84,3.12,h*.32],.014,s)}U(n,4.2,.03,.42,J(10133669,.6,.5,{kind:"checker"}),-1.88,2.97,0),yn(n,r,.3,-3.78,1.22,-1.32,e,{lugs:26,rimR:.3,hubMat:e}),U(n,.24,.26,2.36,e,-4.3,.86,0,.03);for(let h of[-1,1])U(n,.04,.1,.16,ut.red(),-4.43,.98,h*.95);return n}var tx={1:Yg,2:()=>pn({color:13605420,rearD:1.5,rearW:.5,rearTrack:1.6,frontD:1.15,frontW:1.3,wb:3.1,platformY:1.15,hood:{x0:-.7,x1:1.75,y1:1.8,w:.95,rFront:.28,rBack:.08,grille:!1},exhausts:[{x:.55,y1:2.8,r:.05,color:13619151}],steerZ:-.35,steerH:.85,seat:!0,lights:[{x:1.78,y:1.42,z:.36},{x:1.78,y:1.42,z:-.36}],extras:(n,t)=>{U(n,.55,.55,t.gap-.1,t.C,t.xr-.95,t.platY+.3,0,.03),Jn(n,.24,t.xr+.1,t.platY+.55,.62,J(1907997),"z",4,.02),U(n,.8,.45,.012,ut.dark(),.6,1.3,.481);for(let e of[-1,1])U(n,.05,.05,.03,J(9060272),t.xf+.62,.5,e*.75)}}),3:()=>pn({color:15908888,rearD:1.5,rearW:.5,rearTrack:1.65,frontD:1.15,frontW:1.3,wb:3.1,platformY:1.15,hood:{x0:-.7,x1:1.75,y1:1.9,w:1,rFront:.3,rBack:.08,grille:!1,louvers:{groups:[[.35,.62]],n:1,y0:.35,y1:.75,horizontal:!0}},exhausts:[{x:-.72,y1:2.3,r:.045,z:.15,color:13684944},{x:-.72,y1:2.3,r:.045,z:-.15,color:13684944}],lights:[{x:1.8,y:1.55,z:.33},{x:1.8,y:1.55,z:-.33}],canopy:{type:"flat",x0:-2.05,x1:-.15,y:3,w:1.7,thick:.08,lip:.05},extras:(n,t)=>{U(n,.02,.18,.26,ut.red(),1.815,1.45,0,.01);for(let e of[-1,1])for(let i=0;i<2;i++)tn(n,.3,.95,1.25+i*.22,1.4+i*.22,e*.512,1,ut.dark(),!0);for(let e of[-1,1])for(let i=0;i<9;i++)U(n,.05,.012,.02,ut.dark(),.3+i*.08,1.33,e*.512)}}),4:()=>pn({color:2906682,wheelColor:13159625,rearD:1.1,rearW:.4,rearTrack:1.3,frontD:1,frontW:1,wb:1.9,platformY:.95,frameTop:.85,hood:{x0:-.45,x1:.85,y1:1.6,w:.78,rFront:.05,rBack:.04,grille:!1,louvers:{groups:[[.2,.75]],n:10,y0:.3,y1:.8}},exhausts:[{x:.95,y0:1.55,y1:2.45,z:.3,r:.045,color:13619924}],canopy:{type:"arch",x0:-1.35,x1:.15,y:2.5,w:1.4,rise:.14,thick:.03,postColor:2906682},steerColor:15658734,seatColor:6965810,fenders:!1,extras:(n,t)=>{lt(n,.17,.17,.42,t.C,t.xf,1.62,0,"y",24),lt(n,.24,.24,.36,t.C,t.xf-.05,1.98,0,"y",28),re(n,new Dn(.24,24,12,0,Math.PI*2,0,Math.PI/2),t.C,t.xf-.05,2.16,0),U(n,.28,.16,.012,ut.alu(),.25,1.25,-.395,.004);for(let e of[-1,1])for(let i=0;i<3;i++)lt(n,.06,.06,.03,t.WH,t.xr+Math.cos(i*2.1)*.25,t.rearR+Math.sin(i*2.1)*.25,e*(t.zr+.21),"z",14);for(let e=0;e<10;e++)U(n,.04,.015,.02,ut.dark(),t.xf-.1,1.42+e*.012,.18+e*.004);Jn(n,.12,t.xr+.15,t.platY+.5,.45,J(15658734),"x",3,.015)}}),5:()=>pn({color:3968469,wheelColor:14699050,rearD:1.4,rearW:.45,rearTrack:1.4,frontD:1.15,frontW:1,wb:2.15,split:!1,platformY:1.05,hood:{x0:-.55,x1:1.25,y1:1.9,w:.9,rFront:.3,rBack:.1,grille:!1,topSlots:3,mesh:[[.25,.6,.2,.75],[.68,.85,.3,.65]]},canopy:{type:"flat",x0:-1.75,x1:.35,y:2.85,w:1.7,thick:.06,postColor:15921906},scraperColor:15921906,steerZ:0,extras:(n,t)=>{Qt(n,[t.xr-.2,1.3,.47],[1.1,1.4,.47],.015,ut.white()),U(n,.2,.08,.1,ut.dark(),t.xr-.95,.5,0)}}),6:()=>pn({color:4045629,wheelColor:14168607,rearD:1.55,rearW:.5,rearTrack:1.5,frontD:1.25,frontW:1.1,wb:2.45,split:!1,platformY:1.15,hood:{x0:-.6,x1:1.45,y1:2.05,w:.98,rFront:.32,rBack:.1,grille:!1,topSlots:3,mesh:[[.25,.6,.2,.75],[.68,.85,.3,.65]],plate:"alu"},canopy:{type:"flat",x0:-1.95,x1:.4,y:3,w:1.8,thick:.06},lights:[{x:1.4,y:1.8,z:.56,r:.08},{x:1.4,y:1.8,z:-.56,r:.08}],steerZ:0,rearHoles:4}),7:()=>pn({color:15234588,wheelColor:9410204,forkColor:9410204,rearD:1.45,rearW:.45,rearTrack:1.45,frontD:1.1,frontW:1,wb:2.4,platformY:1.05,swan:!0,vertWheel:!0,hood:{x0:-.55,x1:.85,y1:1.75,w:.85,rFront:.12,rBack:.06,grille:!1},canopy:{type:"arch",x0:-1.7,x1:.95,y:2.62,w:1.75,rise:.18,thick:.03,color:9212568,postColor:9212568,valance:{h:.18,material:J(14708778,.8,0)}},exhausts:[{x:.4,y0:1.7,y1:2.35,z:-.2,r:.045,color:6712176}],fenders:!1,extras:(n,t)=>{Un(n,.36,.1,.15,1.45,.58,J(9410204),J(9410204),6,{tread:J(11872800),rimT:.05,hubR:.07,spokeT:.04,spokeW:.05}),lt(n,.48,.48,.08,t.C,0,1.35,-.6,"z",40),Un(n,.28,.08,.35,1.95,-.55,J(9410204),J(9410204),6,{tread:J(11872800),rimT:.04,hubR:.06,spokeT:.035,spokeW:.04}),U(n,.5,.12,.012,t.C,-.2,.75,-.45,.004)}}),8:()=>pn({color:15906844,wheelColor:13183518,frontColor:13183518,rearD:1.5,rearW:.45,rearTrack:1.45,frontD:1.1,frontW:1,wb:2.5,platformY:1.1,spoked:!0,spokes:6,frontSpoked:!0,hood:{x0:-.5,x1:.95,y1:1.45,w:.8,rFront:.06,rBack:.04,grille:!1},fenders:!1,canopy:{type:"flat",x0:-1.75,x1:.9,y:2.65,w:1.75,thick:.05},extras:(n,t)=>{lt(n,.2,.2,.75,t.C,.15,1.75,.05,"x",24),U(n,.45,.3,.45,t.C,.6,1.62,-.15,.03),U(n,.7,.55,.55,ut.engine(),-.05,1.15,0,.03),lt(n,.38,.38,.06,ut.white(),.1,1.45,.62,"z",40),re(n,new un(.38,.03,8,40),J(13183518),.1,1.45,.655),dn(n,[[.1,1.45,.67],[.28,1.55,.7],[.32,1.75,.72],[.45,1.8,.72]],.02,J(13183518),16,8),lt(n,.11,.11,.85,t.C,t.xr+.45,t.platY+.45,.6,"y",20),re(n,new Dn(.11,16,8,0,Math.PI*2,0,Math.PI/2),t.C,t.xr+.45,t.platY+.88,.6),lt(n,.03,.03,.1,ut.brass(),t.xr+.45,t.platY+1.02,.6,"y",10),Un(n,.36,.06,t.xr+.35,.7,-.55,J(5593696),J(5593696),10,{tread:J(5593696),rimT:.06,hubR:.06,spokeT:.03,spokeW:.04});for(let e of[-1,1])hc(n,-.9,.9,.62,e*.36,14,t.C,.014);for(let e of[-1,1])for(let i=0;i<3;i++)re(n,new un(.03,.01,6,12),J(13183518),t.xr-.55,.45+i*.03,e*(t.zr-.2),0,Math.PI/2,0);U(n,.25,.08,.12,ut.dark(),t.xr-.95,.55,0)}}),9:()=>pn({color:5030972,wheelColor:5030972,rimColor:14343643,rearInset:.09,rearD:1.45,rearW:.48,rearTrack:1.45,frontD:1.1,frontW:1,wb:2.45,split:!1,frontHoles:6,platformY:1.05,hood:{x0:-.45,x1:1.4,y1:1.75,w:.85,rFront:.35,rBack:.2,grille:!1,stripe:14173482},canopy:{type:"flat",x0:-1.65,x1:.15,y:2.72,w:1.65,thick:.05,postColor:10133411,postR:.022},steerColor:13116188,steerZ:-.35,steerTilt:.85,fenders:!0,extras:(n,t)=>{U(n,.55,.32,.012,J(13159632,.4,.6),.5,1.3,.432),lt(n,.12,.12,.012,t.C,.45,1.05,.43,"z",20),lt(n,.28,.28,1,t.C,t.xr-.75,t.platY+.32,0,"z",24),U(n,.35,.28,.35,t.C,t.xr-.7,t.platY+.16,.6,.02);for(let e of[-1,1])Qt(n,[-1.6,1.05,e*.8],[-1,2.67,e*.8],.016,J(10133411));for(let e of[-1,1])Qt(n,[.1,1.75,e*.8],[-.4,2.67,e*.8],.016,J(10133411))}}),10:()=>pn({color:15230492,rearD:1.55,rearW:.48,rearTrack:1.65,frontD:1.1,frontW:1.1,wb:2.5,platformY:1.1,frameTop:1,hood:{x0:0,x1:1.45,y1:1.8,w:1,rFront:.12,rBack:.04,grille:!1,louvers:{groups:[[.55,.85]],n:7,y0:.4,y1:.75}},cab:{x0:-1.6,x1:.05,ySill:1.65,y1:2.82,w:1.45,roofR:.12,roofT:.12,pillar:.07},exhausts:[{x:-1.68,y0:1.2,y1:2.85,z:.45,r:.05,color:2763306}],lights:[{x:1.42,y:1.65,z:.58},{x:1.42,y:1.65,z:-.58}],seat:!0,extras:(n,t)=>{for(let e of[-1,1])hc(n,.1,1.35,1.12,e*.51,10,t.C)}}),11:()=>pn({color:15230492,rearD:1.6,rearW:.5,rearTrack:1.75,frontD:1.2,frontW:1.15,wb:2.9,platformY:1.12,frameTop:1,hood:{x0:-.35,x1:1.85,y1:1.75,w:1,rFront:.18,rBack:.04,grille:!1,louvers:{groups:[[.22,.34],[.42,.54],[.62,.74],[.82,.92]],n:5,y0:.4,y1:.8}},cab:{x0:-1.85,x1:-.3,ySill:1.65,y1:2.72,w:1.5,roofR:.03,roofT:.08,pillar:.06},exhausts:[{x:-.25,y0:1.7,y1:2.72,z:.35,r:.05,color:13619924}],lights:[{x:1.82,y:1.55,z:.42}],extras:(n,t)=>{for(let e of[-1,1])for(let i=0;i<8;i++)lt(n,.02,.02,.012,ut.dark(),-.2+i*.25,1.68,e*.51,"z",10)}}),12:()=>pn({color:3500879,wheelColor:4869970,frontColor:3500879,rearD:1.3,rearW:.42,rearTrack:1.45,frontD:1,frontW:1,wb:2.5,platformY:1,hood:{x0:-.55,x1:1,y1:1.6,w:.85,rFront:.06,rBack:.04,grille:!1,holes:7,louvers:{groups:[[.15,.45]],n:8,y0:.15,y1:.55}},canopy:{type:"corr",x0:-1.6,x1:.15,y:2.7,w:1.55,material:null,color:3500879,postColor:3500879,postR:.02},exhausts:[{x:-.45,y0:1.55,y1:2.45,z:.25,r:.045,color:13619924}],extras:(n,t)=>{lt(n,.36,.36,.55,t.C,t.xf-.08,1.5,0,"x",32),lt(n,.37,.3,.08,t.C,t.xf+.23,1.5,0,"x",32),lt(n,.1,.1,.02,ut.brass(),t.xf+.28,1.55,0,"x",24),U(n,.03,.42,.62,ut.dark(),1.02,1.28,0,.01);for(let e=0;e<8;e++)U(n,.012,.03,.6,t.C,1.04,1.1+e*.05,0,0,[.4,0,0]);for(let e of[-1,1])for(let i=0;i<12;i++)lt(n,.012,.012,.012,ut.dark(),t.xr+Math.cos(i*.52)*.55,t.rearR+Math.sin(i*.52)*.55,e*(t.zr+.215),"z",6)}}),13:qg,14:Zg,15:$g,16:Jg,17:()=>qs({color:15493663,rimColor:1908514,bladeColor:1908514,drawbar:"A",frame:"straight",handwheelColor:15493663,towHitch:!0,seatZ:.5}),18:()=>qs({color:15314978,bladeColor:2764081,drawbar:"pole",frame:"curved",topWheel:!0,handwheelColor:1908514}),19:()=>qs({color:15769642,bladeColor:3882820,drawbar:"A",frame:"curved",handwheelColor:15769642}),20:()=>qs({color:15909914,bladeColor:2764081,drawbar:"A",frame:"curved",topWheel:!0,handwheelColor:1908514,standLeg:!0}),21:()=>qs({color:15245360,bladeColor:5925496,drawbar:"A",frame:"straight",canopy:!0,hydraulic:!0,stripes:!0,rails:!0,handwheelColor:15245360}),22:Kg,23:()=>Uh({color:14177322,gauge:1.33,tw:.39,xs:-1,ys:.62,rs:.33,xi:1.15,yi:.42,ri:.3,wheels:[-.55,-.15,.3,.7],rw:.17,carriers:[-.3,.45],springs:[-.35,.5],bodyL:2,bodyX:.1,hood:{x0:0,x1:1.75,y1:1.65,w:.88,louvers:!0},fenderL:2.3,fenderX:.05,fenderY:1,cab:{x0:-1.05,x1:.05,y0:1,ySill:1.62,y1:2.55,w:1.25,roofColor:15921904,roofR:.1,roofT:.12,pillar:.07},exhaust:{x:1.3,y1:2.45,z:.25,capColor:13116188},airCleaner:{x:1.1,z:-.25},blade:{w:2.56,h:.85,x:1.95,armX:0,color:10133670,cyl:!0},hitch:!0,grille:"h"}),24:()=>Uh({color:3107658,gauge:1.38,tw:.39,xs:-1.05,ys:.68,rs:.32,xi:1.15,yi:.4,ri:.3,wheels:[-.55,-.15,.3,.7],rw:.16,spokedWheels:!0,carriers:[-.2,.5],springs:[-.35,.5],bodyL:2,bodyX:.05,hood:{x0:-.1,x1:1.6,y1:1.62,w:.82,open:!0,rFront:.08},fenderL:2.2,fenderX:0,fenderY:1.02,cab:{x0:-1.1,x1:-.05,y0:1,ySill:1.7,y1:2.6,w:1.3,roofR:.15,roofT:.12,pillar:.09},tank:{x:-1.35,y:1.42},exhaust:{x:1.2,y1:2.35,z:.22},blade:{w:2.3,h:.7,x:1.85,armX:-.1},grille:"v"}),25:jg,26:Qg};function Oh(n,t={}){let e=tx[n],i=e();i.name=`stroj-${n}`;let s=new Pn().setFromObject(i),r=s.getCenter(new R);i.position.x-=r.x,i.position.z-=r.z,i.position.y-=s.min.y;let a=new le;if(a.add(i),a.userData.size=s.getSize(new R),t.human){let o=s.getSize(new R),c=Dh(a,-o.x/2+.35,-(o.z/2+.75),0);c.visible=t.human!=="hidden"}return a}function ex(n){for(let t=n;t;t=t.parent)if(t.userData&&t.userData.isHuman)return!0;return!1}function nx(n){n.updateMatrixWorld(!0);let t=new pe().copy(n.matrixWorld).invert(),e=new Map,i=new pe;n.traverse(r=>{if(!r.isMesh||ex(r)||!r.visible)return;let a=r.geometry.clone();a.applyMatrix4(i.multiplyMatrices(t,r.matrixWorld)),a.index&&(a=a.toNonIndexed()),a.attributes.normal||a.computeVertexNormals(),a.attributes.uv||a.setAttribute("uv",new Le(new Float32Array(a.attributes.position.count*2),2));for(let o of Object.keys(a.attributes))["position","normal","uv"].includes(o)||a.deleteAttribute(o);a.morphAttributes={},e.has(r.material)||e.set(r.material,[]),e.get(r.material).push(a)});let s=new le;for(let[r,a]of e){let o=Th(a,!1);if(!o)continue;let c=new Jt(o,r);c.castShadow=!r.transparent,c.receiveShadow=!0,s.add(c),a.forEach(l=>l.dispose())}return s}function $s(n,t,e){let i=document.createElement("canvas");i.width=n,i.height=t,e(i.getContext("2d"),n,t);let s=new $n(i);return s.colorSpace=ce,s.anisotropy=8,s}var ix=(n,t)=>$s(512,160,(e,i,s)=>{let r=e.createLinearGradient(0,0,i,s);r.addColorStop(0,"#e6cb8a"),r.addColorStop(1,"#9c7536"),e.fillStyle=r,e.fillRect(0,0,i,s),e.strokeStyle="rgba(40,30,15,.55)",e.lineWidth=6,e.strokeRect(10,10,i-20,s-20),e.fillStyle="#2b2213",e.font='700 86px Georgia, "Times New Roman", serif',e.textBaseline="middle",e.textAlign="left",e.fillText(String(n).padStart(2,"0"),34,s/2+4),e.font='500 52px "Courier New", monospace',e.textAlign="right",e.fillText(t,i-34,s/2+6);for(let[a,o]of[[22,22],[i-22,22],[22,s-22],[i-22,s-22]])e.beginPath(),e.arc(a,o,6,0,7),e.fillStyle="#6e5022",e.fill()}),sx=()=>$s(256,256,(n,t,e)=>{let i=n.createRadialGradient(t/2,e/2,0,t/2,e/2,t/2);i.addColorStop(0,"rgba(255,236,200,0.55)"),i.addColorStop(.45,"rgba(255,226,180,0.22)"),i.addColorStop(1,"rgba(255,220,170,0)"),n.fillStyle=i,n.fillRect(0,0,t,e)}),rx=()=>{let n=$s(512,512,(t,e,i)=>{t.fillStyle="#26221d",t.fillRect(0,0,e,i);for(let s=0;s<9e3;s++){let r=30+Math.random()*26;t.fillStyle=`rgba(${r+8},${r+4},${r},${Math.random()*.35})`,t.fillRect(Math.random()*e,Math.random()*i,2,2)}t.strokeStyle="rgba(0,0,0,.35)",t.lineWidth=3,t.beginPath(),t.moveTo(0,1),t.lineTo(e,1),t.moveTo(1,0),t.lineTo(1,i),t.stroke()});return n.wrapS=n.wrapT=Zn,n},ox=()=>{let n=$s(1024,256,(t,e,i)=>{t.fillStyle="#1b1c1d",t.fillRect(0,0,e,i);for(let s=0;s<12e3;s++){let r=24+Math.random()*30;t.fillStyle=`rgba(${r},${r},${r+2},${Math.random()*.5})`,t.fillRect(Math.random()*e,Math.random()*i,2,2)}t.fillStyle="#e8b20a";for(let s=0;s<e;s+=128)t.fillRect(s+16,i/2-7,72,14);t.fillStyle="rgba(235,235,230,.85)",t.fillRect(0,10,e,8),t.fillRect(0,i-18,e,8)});return n.wrapS=Zn,n},ax=n=>$s(512,256,(t,e,i)=>{t.clearRect(0,0,e,i),t.fillStyle="rgba(232,226,214,.78)",t.font='700 170px Georgia, "Times New Roman", serif',t.textAlign="center",t.textBaseline="middle",t.fillText(n,e/2,i/2+10)});async function Fh(n,t,e){let i=new le;n.add(i);let s=7.2,r=2.4,a=.62,o=[0,3.2],c=[],l=sx(),h=new He({color:986636,roughness:.7,metalness:.1}),u=new He({color:11767114,roughness:.35,metalness:.85});for(let M=0;M<t.length;M++){let _=t[M],y=M%2,P=Oh(_.id,{human:!1}),T=P.userData.size.clone(),A=nx(P);P.traverse(W=>{W.geometry&&W.geometry.dispose()});let F=y===0?-a:a,b=Math.abs(T.x*Math.cos(F))+Math.abs(T.z*Math.sin(F)),w=o[y]+b/2;o[y]+=b+r;let N=(y===0?-1:1)*(s+Math.abs(T.x*Math.sin(F))*.18),X=new le;X.position.set(w,.16,N),X.rotation.y=F,X.add(A),i.add(X);let Q=T.x+1.1,L=T.z+1.1,O=new Jt(new ze(Q,.17,L),h);O.position.set(w,.085,N),O.rotation.y=F,O.receiveShadow=!0,i.add(O);let V=new Jt(new ze(Q+.05,.035,L+.05),u);V.position.set(w,.135,N),V.rotation.y=F,i.add(V);let K=Math.max(T.x,T.z)*.8+1.4,q=new Jt(new ln(K*2,K*2),new In({map:l,transparent:!0,depthWrite:!1,blending:Rr,opacity:.85}));q.rotation.x=-Math.PI/2,q.position.set(w,.012,N),i.add(q);let Y=w+1*0,nt=N+(y===0?1:-1)*(L/2*Math.cos(F)+.55),tt=new Jt(new ln(1.1,.34),new He({map:ix(_.id,_.rok_text.split(" (")[0]),roughness:.35,metalness:.6}));tt.position.set(Y,.55,nt),tt.rotation.y=y===0?0:Math.PI,tt.rotation.x=y===0?-.35:.35,y===1&&tt.rotation.set(-.35,Math.PI,0,"YXZ"),i.add(tt);let _t=new Jt(new hn(.025,.025,.5,10),u);_t.position.set(Y,.27,nt+(y===0?-.06:.06)),i.add(_t),c.push({id:_.id,pos:new R(w,.16,N),yaw:F,size:T,row:y,center:new R(w,.16+T.y*.45,N)}),X.userData.id=_.id,e&&e(M+1,t.length),await new Promise(W=>setTimeout(W,0))}let d=Math.max(o[0],o[1])+6,f=rx();f.repeat.set(d/4,40/4);let g=new Jt(new ln(d+30,44),new He({map:f,color:9076856,roughness:.62,metalness:0}));g.rotation.x=-Math.PI/2,g.position.set(d/2-4,0,0),g.receiveShadow=!0,i.add(g);let x=ox();x.repeat.set((d+10)/16,1);let p=new Jt(new ln(d+10,4.2),new He({map:x,roughness:.85,metalness:0}));p.rotation.x=-Math.PI/2,p.position.set(d/2-2,.006,0),p.receiveShadow=!0,i.add(p);let m=new Map;c.forEach((M,_)=>{let y=Math.floor(t[_].rok/10)*10;m.has(y)||m.set(y,M.pos.x)});for(let[M,_]of m){let y=new Jt(new ln(2.6,1.3),new In({map:ax(String(M)),transparent:!0,depthWrite:!1}));y.rotation.x=-Math.PI/2,y.rotation.z=Math.PI/2,y.position.set(_-1.2,.013,1.25),i.add(y)}return{group:i,spots:c,length:d}}function Bh(n,t){let e=new Qi(t);n.environment=e.fromScene(new mo(t),.04).texture,n.environmentIntensity=.3,n.background=new $t(789258),n.fog=new Zr(789258,22,70),n.add(new io(16773596,1709586,.22));let i=new so(16771529,900,40,.62,.55,1.6);i.castShadow=!0,i.shadow.mapSize.set(2048,2048),i.shadow.bias=-2e-4,i.shadow.normalBias=.03,n.add(i),n.add(i.target);let s=new oo(13621503,.35);return s.position.set(-10,14,12),n.add(s),{key:i,fill:s}}var cx=JSON.parse(document.getElementById("data").textContent),zh=cx.machines,fc=new Map(zh.map(n=>[n.id,n])),Js=[...zh].sort((n,t)=>n.rok-t.rok||n.id-t.id),dc=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Ks="\xA0",kh=n=>n.toLocaleString("cs-CZ").replace(/\s/g,Ks)+Ks+"K\u010D",oe=(n,t=document)=>t.querySelector(n),mn=oe("#detail");function lx(n){return[["V\xFDrobce",n.vyrobce],["M\xEDsto",n.misto+" \xB7 "+n.zeme_tehdy],["Rok v\xFDroby",n.rok_text],["Hmotnost",n.hmotnost],["Pohon",n.motor],["Rozm\u011Bry",n.rozmery]].map(([t,e])=>`<div><dt>${t}</dt><dd>${e}</dd></div>`).join("")}var Hh=null;function Vh(n){let t=fc.get(n);if(!t)return;Hh=n;let e=[t.studio,...t.foto];oe("#dt-body").innerHTML=`
    <div class="dt-gal"><img class="dt-main" src="${e[0]}" alt="${t.nazev}" width="1600" height="1000">
      <div class="dt-thumbs">${e.map((i,s)=>`<button type="button" data-img="${i}" aria-label="Zobrazit obr\xE1zek ${s+1}"${s===0?' aria-current="true"':""}><img src="${i}" alt="" width="320" height="200"></button>`).join("")}</div></div>
    <div class="dt-info">
      <p class="eyebrow">${String(t.id).padStart(2,"0")} \xB7 ${t.kategorie}</p>
      <h3>${t.nazev}</h3>
      <p class="dt-sub">${t.podtitul}</p>
      <div class="dt-price"><span>Nab\xEDdkov\xE1 cena</span><b>${kh(t.cena)}</b><small>\u2248${Ks}${t.cena_eur.toLocaleString("cs-CZ").replace(/\s/g,Ks)}${Ks}\u20AC</small></div>
      <dl class="dt-plate">${lx(t)}</dl>
      <p class="dt-story">${t.pribeh}</p>
      <ul class="dt-facts">${t.zajimavosti.map(i=>`<li>${i}</li>`).join("")}</ul>
      <p class="dt-note"><b>Stav.</b> ${t.stav}</p>
      <p class="dt-note"><b>Pro kupce.</b> ${t.pro_kupce}</p>
      <div class="dt-actions"><button type="button" class="btn" data-hall="${t.id}">Uk\xE1zat ve virtu\xE1ln\xED hale</button></div>
    </div>`,mn.open||mn.showModal(),mn.scrollTop=0}mn.addEventListener("click",n=>{let t=n.target.closest("[data-img]");t&&(oe(".dt-main",mn).src=t.dataset.img,mn.querySelectorAll("[data-img]").forEach(i=>i.removeAttribute("aria-current")),t.setAttribute("aria-current","true")),n.target.closest("[data-close]")&&mn.close();let e=n.target.closest("[data-step]");if(e){let i=Js.findIndex(s=>s.id===Hh);Vh(Js[(i+Number(e.dataset.step)+Js.length)%Js.length].id)}n.target===mn&&mn.close()});document.addEventListener("click",n=>{let t=n.target.closest("[data-detail]");t&&(n.preventDefault(),Vh(Number(t.dataset.detail)));let e=n.target.closest("[data-hall]");e&&(n.preventDefault(),mn.open&&mn.close(),oe("#prohlidka").scrollIntoView({behavior:dc?"auto":"smooth"}),Qs().then(()=>uc(Number(e.dataset.hall))))});document.querySelectorAll(".filt").forEach(n=>n.addEventListener("click",()=>{document.querySelectorAll(".filt").forEach(e=>e.setAttribute("aria-pressed",String(e===n)));let t=n.dataset.f;document.querySelectorAll(".lot").forEach(e=>{e.hidden=!(t==="vse"||e.dataset.cat===t)})}));var fs=oe("#hall"),bi=oe("#hall-canvas"),hx=oe("#hall-labels"),jn=oe("#hall-info"),te=null,yo=null,pc=0,vo=!1,On=null,Mo=!1,ds=0;function ux(){try{let n=document.createElement("canvas");return!!(n.getContext("webgl2")||n.getContext("webgl"))}catch{return!1}}function Qs(){return yo||(ux()?(fs.classList.add("loading"),yo=(async()=>{let n=new Ls({canvas:bi,antialias:!0,powerPreference:"high-performance"});n.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),n.outputColorSpace=ce,n.toneMapping=Ka,n.toneMappingExposure=1.05,n.shadowMap.enabled=!0,n.shadowMap.type=Ja;let t=new ts,{key:e}=Bh(t,n),i=new we(42,16/9,.1,160),s=new po(i,bi);s.enableDamping=!0,s.dampingFactor=.08,s.maxPolarAngle=Math.PI/2-.05,s.minDistance=3,s.maxDistance=45;let r=oe("#hall-progress i"),a=await Fh(t,Js,(l,h)=>{r.style.width=l/h*100+"%",oe("#hall-progress span").textContent=`Stav\xEDm halu: ${l} / ${h}`}),o=a.spots.map(l=>{let h=fc.get(l.id),u=document.createElement("button");return u.type="button",u.className="hl",u.innerHTML=`<b>${String(h.id).padStart(2,"0")}</b> ${h.nazev}<span>${h.rok_text.split(" (")[0]}</span>`,u.addEventListener("click",()=>{Qn(),uc(l.id)}),hx.appendChild(u),u});te={renderer:n,scene:t,camera:i,controls:s,key:e,hall:a,labels:o,current:-1},Gh(),Yh(!0),fs.classList.remove("loading"),fs.classList.add("live");let c=null;bi.addEventListener("pointerdown",l=>{c=[l.clientX,l.clientY],Qn()}),bi.addEventListener("pointerup",l=>{if(!c||Math.hypot(l.clientX-c[0],l.clientY-c[1])>6)return;let h=bi.getBoundingClientRect(),u=new ao;u.setFromCamera(new j((l.clientX-h.left)/h.width*2-1,-(l.clientY-h.top)/h.height*2+1),i);let d=u.intersectObjects(a.group.children,!0)[0];if(d){for(let f=d.object;f;f=f.parent)if(f.userData&&f.userData.id){uc(f.userData.id);break}}}),bo()})(),yo):(oe("#hall-start").textContent="V\xE1\u0161 prohl\xED\u017Ee\u010D nepodporuje 3D",Promise.reject()))}function Gh(){if(!te)return;let n=fs.getBoundingClientRect();te.renderer.setSize(n.width,n.height,!1),te.camera.aspect=n.width/n.height,te.camera.updateProjectionMatrix()}window.addEventListener("resize",Gh);var fx=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;function Wh(n,t,e=1400){let{camera:i,controls:s}=te;dc&&(e=1),On={t0:performance.now(),ms:e,p0:i.position.clone(),q0:s.target.clone(),p1:n,q1:t}}function Xh(n,t){te.key.position.set(n.x-2.5,10.5,n.z+t*3.5),te.key.target.position.copy(n)}function Yh(n){let t=te.hall.length;te.current=-1;let e=new R(Math.min(18,t*.3),.8,0),i=new R(-7,7.5,.01);Xh(new R(6,0,0),1),n?(te.camera.position.copy(i),te.controls.target.copy(e),te.controls.update()):Wh(i,e),Zh(null)}function qh(n){let t=te.hall.spots[n];te.current=n;let e=t.row===0?1:-1,s=new R(Math.cos(t.yaw),0,-Math.sin(t.yaw)).multiplyScalar(.85).add(new R(0,0,e)).normalize(),r=Math.max(t.size.x,t.size.y*1.6,t.size.z)*1.05+3.2,a=t.center.clone().addScaledVector(s,r).add(new R(0,1.6+t.size.y*.25,0));Wh(a,t.center.clone()),Xh(t.center,e),Zh(t.id)}function uc(n){if(!te)return;let t=te.hall.spots.findIndex(e=>e.id===n);t>=0&&qh(t)}function js(n){if(!te)return;let t=te.hall.spots.length;qh(((te.current<0?n>0?-1:0:te.current)+n+t)%t)}function Zh(n){if(!n){jn.hidden=!0;return}let t=fc.get(n);jn.hidden=!1,oe("#hi-no",jn).textContent=String(t.id).padStart(2,"0")+" / 26",oe("#hi-name",jn).textContent=t.nazev,oe("#hi-meta",jn).textContent=`${t.rok_text} \xB7 ${t.misto}, ${t.zeme_dnes}`,oe("#hi-sub",jn).textContent=t.podtitul,oe("#hi-price",jn).textContent=kh(t.cena),oe("#hi-detail",jn).dataset.detail=String(t.id)}function $h(){js(1),pc=setTimeout($h,dc?9e3:7200)}function Jh(){Qs().then(()=>{vo=!0,oe("#hall-tour").textContent="Zastavit prohl\xEDdku",oe("#hall-tour").setAttribute("aria-pressed","true"),clearTimeout(pc),$h()})}function Qn(){vo&&(vo=!1,clearTimeout(pc),oe("#hall-tour").textContent="Spustit prohl\xEDdku",oe("#hall-tour").setAttribute("aria-pressed","false"))}oe("#hall-start").addEventListener("click",()=>Jh());oe("#hall-tour").addEventListener("click",()=>vo?Qn():Jh());oe("#hall-prev").addEventListener("click",()=>{Qn(),Qs().then(()=>js(-1))});oe("#hall-next").addEventListener("click",()=>{Qn(),Qs().then(()=>js(1))});oe("#hall-over").addEventListener("click",()=>{Qn(),Qs().then(()=>Yh(!1))});fs.addEventListener("keydown",n=>{n.key==="ArrowRight"&&(Qn(),js(1)),n.key==="ArrowLeft"&&(Qn(),js(-1))});var Nn=new R;function dx(){let{camera:n,hall:t,labels:e}=te,i=bi.clientWidth,s=bi.clientHeight;t.spots.forEach((r,a)=>{Nn.copy(r.center),Nn.y+=r.size.y*.6+.5;let o=n.position.distanceTo(Nn);Nn.project(n);let c=e[a],l=Nn.z<1&&Math.abs(Nn.x)<1.05&&Math.abs(Nn.y)<1.05&&o<26;c.classList.toggle("on",l),c.classList.toggle("cur",a===te.current),l&&(c.style.transform=`translate(${(Nn.x*.5+.5)*i}px, ${(-Nn.y*.5+.5)*s}px) translate(-50%, -100%)`,c.style.opacity=String(Math.max(.25,Math.min(1,1.6-o/18))))})}function bo(){if(ds=0,!!te){if(On){let n=Math.min(1,(performance.now()-On.t0)/On.ms),t=fx(n);te.camera.position.lerpVectors(On.p0,On.p1,t),te.controls.target.lerpVectors(On.q0,On.q1,t),n>=1&&(On=null)}te.controls.update(),dx(),te.renderer.render(te.scene,te.camera),Mo&&!document.hidden&&(ds=requestAnimationFrame(bo))}}new IntersectionObserver(([n])=>{Mo=n.isIntersecting,Mo&&te&&!ds&&(ds=requestAnimationFrame(bo))},{threshold:.02}).observe(fs);document.addEventListener("visibilitychange",()=>{!document.hidden&&Mo&&te&&!ds&&(ds=requestAnimationFrame(bo))});var px=[...document.querySelectorAll(".nav a")],mx=new IntersectionObserver(n=>n.forEach(t=>{t.isIntersecting&&px.forEach(e=>e.classList.toggle("on",e.getAttribute("href")==="#"+t.target.id))}),{rootMargin:"-45% 0px -50% 0px"});document.querySelectorAll("main > section[id]").forEach(n=>mx.observe(n));})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
