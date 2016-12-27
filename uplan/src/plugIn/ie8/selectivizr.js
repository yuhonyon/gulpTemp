(function(win){

var ieUserAgent=navigator.userAgent.match(/MSIE (\d+)/);if(!ieUserAgent){return false;}
var doc=document;var root=doc.documentElement;var xhr=getXHRObject();var ieVersion=ieUserAgent[1];
if(doc.compatMode!='CSS1Compat'||ieVersion<6||ieVersion>8||!xhr){return;}

var selectorEngines={"NW":"*.Dom.select","MooTools":"$$","DOMAssistant":"*.$","Prototype":"$$","YAHOO":"*.util.Selector.query","Sizzle":"*","jQuery":"*","dojo":"*.query"};var selectorMethod;var enabledWatchers=[]; var domPatches=[];var ie6PatchID=0; var patchIE6MultipleClasses=true; var namespace="slvzr"; var RE_COMMENT=/(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g;var RE_IMPORT=/@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))\s*([^;]*);/g;var RE_ASSET_URL=/(behavior\s*?:\s*)?\burl\(\s*(["']?)(?!data:)([^"')]+)\2\s*\)/g;var RE_PSEUDO_STRUCTURAL=/^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;var RE_PSEUDO_ELEMENTS=/:(:first-(?:line|letter))/g;var RE_SELECTOR_GROUP=/((?:^|(?:\s*})+)(?:\s*@media[^{]+{)?)\s*([^\{]*?[\[:][^{]+)/g;var RE_SELECTOR_PARSE=/([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g;var RE_LIBRARY_INCOMPATIBLE_PSEUDOS=/(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;var RE_PATCH_CLASS_NAME_REPLACE=/[^\w-]/g; var RE_INPUT_ELEMENTS=/^(INPUT|SELECT|TEXTAREA|BUTTON)$/;var RE_INPUT_CHECKABLE_TYPES=/^(checkbox|radio)$/;var BROKEN_ATTR_IMPLEMENTATIONS=ieVersion>6?/[\$\^*]=(['"])\1/:null; var RE_TIDY_TRAILING_WHITESPACE=/([(\[+~])\s+/g;var RE_TIDY_LEADING_WHITESPACE=/\s+([)\]+~])/g;var RE_TIDY_CONSECUTIVE_WHITESPACE=/\s+/g;var RE_TIDY_TRIM_WHITESPACE=/^\s*((?:[\S\s]*\S)?)\s*$/; var EMPTY_STRING="";var SPACE_STRING=" ";var PLACEHOLDER_STRING="$1";
function patchStyleSheet(cssText){return cssText.replace(RE_PSEUDO_ELEMENTS,PLACEHOLDER_STRING).replace(RE_SELECTOR_GROUP,function(m,prefix,selectorText){var selectorGroups=selectorText.split(",");for(var c=0,cs=selectorGroups.length;c<cs;c++){var selector=normalizeSelectorWhitespace(selectorGroups[c])+SPACE_STRING;var patches=[];selectorGroups[c]=selector.replace(RE_SELECTOR_PARSE,function(match,combinator,pseudo,attribute,index){if(combinator){if(patches.length>0){domPatches.push({selector:selector.substring(0,index),patches:patches})
patches=[];}
return combinator;}
else{var patch=(pseudo)?patchPseudoClass(pseudo):patchAttribute(attribute);if(patch){patches.push(patch);return"."+patch.className;}
return match;}});}
return prefix+selectorGroups.join(",");});};function patchAttribute(attr){return(!BROKEN_ATTR_IMPLEMENTATIONS||BROKEN_ATTR_IMPLEMENTATIONS.test(attr))?{className:createClassName(attr),applyClass:true}:null;}; function patchPseudoClass(pseudo){var applyClass=true;var className=createClassName(pseudo.slice(1));var isNegated=pseudo.substring(0,5)==":not(";var activateEventName;var deactivateEventName;if(isNegated){pseudo=pseudo.slice(5,-1);} 
var bracketIndex=pseudo.indexOf("(")
if(bracketIndex>-1){pseudo=pseudo.substring(0,bracketIndex);} 
if(pseudo.charAt(0)==":"){switch(pseudo.slice(1)){case"root":applyClass=function(e){return isNegated?e!=root:e==root;}
break;case"target": if(ieVersion==8){applyClass=function(e){var handler=function(){var hash=location.hash;var hashID=hash.slice(1);return isNegated?(hash==EMPTY_STRING||e.id!=hashID):(hash!=EMPTY_STRING&&e.id==hashID);};addEvent(win,"hashchange",function(){toggleElementClass(e,className,handler());})
return handler();}
break;}
return false;case"checked":applyClass=function(e){if(RE_INPUT_CHECKABLE_TYPES.test(e.type)){addEvent(e,"propertychange",function(){if(event.propertyName=="checked"){toggleElementClass(e,className,e.checked!==isNegated);}})}
return e.checked!==isNegated;}
break;case"disabled":isNegated=!isNegated;case"enabled":applyClass=function(e){if(RE_INPUT_ELEMENTS.test(e.tagName)){addEvent(e,"propertychange",function(){if(event.propertyName=="$disabled"){toggleElementClass(e,className,e.$disabled===isNegated);}});enabledWatchers.push(e);e.$disabled=e.disabled;return e.disabled===isNegated;}
return pseudo==":enabled"?isNegated:!isNegated;}
break;case"focus":activateEventName="focus";deactivateEventName="blur";case"hover":if(!activateEventName){activateEventName="mouseenter";deactivateEventName="mouseleave";}
applyClass=function(e){addEvent(e,isNegated?deactivateEventName:activateEventName,function(){toggleElementClass(e,className,true);})
addEvent(e,isNegated?activateEventName:deactivateEventName,function(){toggleElementClass(e,className,false);})
return isNegated;}
break; default:
 if(!RE_PSEUDO_STRUCTURAL.test(pseudo)){return false;}
break;}}
return{className:className,applyClass:applyClass};};function applyPatches(){var elms,selectorText,patches,domSelectorText;for(var c=0;c<domPatches.length;c++){selectorText=domPatches[c].selector;patches=domPatches[c].patches;
domSelectorText=selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS,EMPTY_STRING);
if(domSelectorText==EMPTY_STRING||domSelectorText.charAt(domSelectorText.length-1)==SPACE_STRING){domSelectorText+="*";} 
try{elms=selectorMethod(domSelectorText);}catch(ex){ log("Selector '"+selectorText+"' threw exception '"+ex+"'");}
if(elms){for(var d=0,dl=elms.length;d<dl;d++){var elm=elms[d];var cssClasses=elm.className;for(var f=0,fl=patches.length;f<fl;f++){var patch=patches[f];if(!hasPatch(elm,patch)){if(patch.applyClass&&(patch.applyClass===true||patch.applyClass(elm)===true)){cssClasses=toggleClass(cssClasses,patch.className,true);}}}
elm.className=cssClasses;}}}}; function hasPatch(elm,patch){return new RegExp("(^|\\s)"+patch.className+"(\\s|$)").test(elm.className);};function createClassName(className){return namespace+"-"+((ieVersion==6&&patchIE6MultipleClasses)?ie6PatchID++:className.replace(RE_PATCH_CLASS_NAME_REPLACE,function(a){return a.charCodeAt(0)}));}; function log(message){if(win.console){win.console.log(message);}};
 function trim(text){return text.replace(RE_TIDY_TRIM_WHITESPACE,PLACEHOLDER_STRING);}; function normalizeWhitespace(text){return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE,SPACE_STRING);}; function normalizeSelectorWhitespace(selectorText){return normalizeWhitespace(selectorText.replace(RE_TIDY_TRAILING_WHITESPACE,PLACEHOLDER_STRING).replace(RE_TIDY_LEADING_WHITESPACE,PLACEHOLDER_STRING));}; function toggleElementClass(elm,className,on){var oldClassName=elm.className;var newClassName=toggleClass(oldClassName,className,on);if(newClassName!=oldClassName){elm.className=newClassName;elm.parentNode.className+=EMPTY_STRING;}};
 function toggleClass(classList,className,on){var re=RegExp("(^|\\s)"+className+"(\\s|$)");var classExists=re.test(classList);if(on){return classExists?classList:classList+SPACE_STRING+className;}else{return classExists?trim(classList.replace(re,PLACEHOLDER_STRING)):classList;}};function addEvent(elm,eventName,eventHandler){elm.attachEvent("on"+eventName,eventHandler);};function getXHRObject(){if(win.XMLHttpRequest){return new XMLHttpRequest;}
try{return new ActiveXObject('Microsoft.XMLHTTP');}catch(e){return null;}};function loadStyleSheet(url){xhr.open("GET",url,false);xhr.send();return(xhr.status==200)?xhr.responseText:EMPTY_STRING;};
 function resolveUrl(url,contextUrl,ignoreSameOriginPolicy){function getProtocol(url){return url.substring(0,url.indexOf("//"));};function getProtocolAndHost(url){return url.substring(0,url.indexOf("/",8));};if(!contextUrl){contextUrl=baseUrl;} 
if(url.substring(0,2)=="//"){url=getProtocol(contextUrl)+url;} 
if(/^https?:\/\//i.test(url)){return!ignoreSameOriginPolicy&&getProtocolAndHost(contextUrl)!=getProtocolAndHost(url)?null:url;} 
if(url.charAt(0)=="/"){return getProtocolAndHost(contextUrl)+url;} 
var contextUrlPath=contextUrl.split(/[?#]/)[0]; if(url.charAt(0)!="?"&&contextUrlPath.charAt(contextUrlPath.length-1)!="/"){contextUrlPath=contextUrlPath.substring(0,contextUrlPath.lastIndexOf("/")+1);}
return contextUrlPath+url;};

function parseStyleSheet(url){if(url){return loadStyleSheet(url).replace(RE_COMMENT,EMPTY_STRING).replace(RE_IMPORT,function(match,quoteChar,importUrl,quoteChar2,importUrl2,media){var cssText=parseStyleSheet(resolveUrl(importUrl||importUrl2,url));return(media)?"@media "+media+" {"+cssText+"}":cssText;}).replace(RE_ASSET_URL,function(match,isBehavior,quoteChar,assetUrl){quoteChar=quoteChar||EMPTY_STRING;return isBehavior?match:" url("+quoteChar+resolveUrl(assetUrl,url,true)+quoteChar+") ";});}
return EMPTY_STRING;};function getStyleSheets(){var url,stylesheet;for(var c=0;c<doc.styleSheets.length;c++){stylesheet=doc.styleSheets[c];if(stylesheet.href!=EMPTY_STRING){url=resolveUrl(stylesheet.href);if(url){stylesheet.cssText=stylesheet["rawCssText"]=patchStyleSheet(parseStyleSheet(url));}}}};function init(){applyPatches();
if(enabledWatchers.length>0){setInterval(function(){for(var c=0,cl=enabledWatchers.length;c<cl;c++){var e=enabledWatchers[c];if(e.disabled!==e.$disabled){if(e.disabled){e.disabled=false;e.$disabled=true;e.disabled=true;}
else{e.$disabled=e.disabled;}}}},250)}}; var baseTags=doc.getElementsByTagName("BASE");var baseUrl=(baseTags.length>0)?baseTags[0].href:doc.location.href;getStyleSheets();ContentLoaded(win,function(){ for(var engine in selectorEngines){var members,member,context=win;if(win[engine]){members=selectorEngines[engine].replace("*",engine).split(".");while((member=members.shift())&&(context=context[member])){}
if(typeof context=="function"){selectorMethod=context;init();return;}}}});
 function ContentLoaded(win,fn){var done=false,top=true,init=function(e){if(e.type=="readystatechange"&&doc.readyState!="complete")return;(e.type=="load"?win:doc).detachEvent("on"+e.type,init,false);if(!done&&(done=true))fn.call(win,e.type||e);},poll=function(){try{root.doScroll("left");}catch(e){setTimeout(poll,50);return;}
init('poll');};if(doc.readyState=="complete")fn.call(win,EMPTY_STRING);else{if(doc.createEventObject&&root.doScroll){try{top=!win.frameElement;}catch(e){}
if(top)poll();}
addEvent(doc,"readystatechange",init);addEvent(win,"load",init);}};})(this);