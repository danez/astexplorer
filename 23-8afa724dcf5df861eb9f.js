webpackJsonp([23],{"./node_modules/webidl2/index.js":function(module,exports,__webpack_require__){module.exports=__webpack_require__("./node_modules/webidl2/lib/webidl2.js")},"./node_modules/webidl2/lib/webidl2.js":function(module,exports){!function(){var tokenise=function(str){var tokens=[],re={"float":/^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/,integer:/^-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/,identifier:/^[A-Z_a-z][0-9A-Z_a-z]*/,string:/^"[^"]*"/,whitespace:/^(?:[\t\n\r ]+|[\t\n\r ]*((\/\/.*|\/\*(.|\n|\r)*?\*\/)[\t\n\r ]*))+/,other:/^[^\t\n\r 0-9A-Z_a-z]/},types=[];for(var k in re)types.push(k);for(;str.length>0;){for(var matched=!1,i=0,n=types.length;n>i;i++){var type=types[i];if(str=str.replace(re[type],function(tok){return tokens.push({type:type,value:tok}),matched=!0,""}),matched)break}if(!matched)throw new Error("Token stream not progressing")}return tokens},parse=function(tokens,opt){var line=1;tokens=tokens.slice();var FLOAT="float",INT="integer",ID="identifier",STR="string",OTHER="other",WebIDLParseError=function(str,line,input,tokens){this.message=str,this.line=line,this.input=input,this.tokens=tokens};WebIDLParseError.prototype.toString=function(){return this.message+", line "+this.line+" (tokens: '"+this.input+"')\n"+JSON.stringify(this.tokens,null,4)};var error=function(str){for(var tok="",numTokens=0,maxTokens=5;maxTokens>numTokens&&tokens.length>numTokens;)tok+=tokens[numTokens].value,numTokens++;throw new WebIDLParseError(str,line,tok,tokens.slice(0,5))},last_token=null,consume=function(type,value){return tokens.length&&tokens[0].type===type&&("undefined"==typeof value||tokens[0].value===value)?(last_token=tokens.shift(),type===ID&&(last_token.value=last_token.value.replace(/^_/,"")),last_token):void 0},ws=function(){if(tokens.length&&"whitespace"===tokens[0].type){var t=tokens.shift();return t.value.replace(/\n/g,function(m){return line++,m}),t}},all_ws=function(store,pea){for(var t={type:"whitespace",value:""};;){var w=ws();if(!w)break;t.value+=w.value}if(t.value.length>0){if(store){var w=t.value,re={ws:/^([\t\n\r ]+)/,"line-comment":/^\/\/(.*)\n?/m,"multiline-comment":/^\/\*((?:.|\n|\r)*?)\*\//},wsTypes=[];for(var k in re)wsTypes.push(k);for(;w.length;){for(var matched=!1,i=0,n=wsTypes.length;n>i;i++){var type=wsTypes[i];if(w=w.replace(re[type],function(tok,m1){return store.push({type:type+(pea?"-"+pea:""),value:m1}),matched=!0,""}),matched)break}if(!matched)throw new Error("Surprising white space construct.")}}return t}},integer_type=function(){var ret="";return all_ws(),consume(ID,"unsigned")&&(ret="unsigned "),all_ws(),consume(ID,"short")?ret+"short":consume(ID,"long")?(ret+="long",all_ws(),consume(ID,"long")?ret+" long":ret):void(ret&&error("Failed to parse integer type"))},float_type=function(){var ret="";return all_ws(),consume(ID,"unrestricted")&&(ret="unrestricted "),all_ws(),consume(ID,"float")?ret+"float":consume(ID,"double")?ret+"double":void(ret&&error("Failed to parse float type"))},primitive_type=function(){var num_type=integer_type()||float_type();return num_type?num_type:(all_ws(),consume(ID,"boolean")?"boolean":consume(ID,"byte")?"byte":consume(ID,"octet")?"octet":void 0)},const_value=function(){if(consume(ID,"true"))return{type:"boolean",value:!0};if(consume(ID,"false"))return{type:"boolean",value:!1};if(consume(ID,"null"))return{type:"null"};if(consume(ID,"Infinity"))return{type:"Infinity",negative:!1};if(consume(ID,"NaN"))return{type:"NaN"};var ret=consume(FLOAT)||consume(INT);if(ret)return{type:"number",value:1*ret.value};var tok=consume(OTHER,"-");if(tok){if(consume(ID,"Infinity"))return{type:"Infinity",negative:!0};tokens.unshift(tok)}},type_suffix=function(obj){for(;;)if(all_ws(),consume(OTHER,"?"))obj.nullable&&error("Can't nullable more than once"),obj.nullable=!0;else{if(!consume(OTHER,"["))return;all_ws(),consume(OTHER,"]")||error("Unterminated array type"),obj.array?(obj.array++,obj.nullableArray.push(obj.nullable)):(obj.array=1,obj.nullableArray=[obj.nullable]),obj.nullable=!1}},single_type=function(){var name,value,prim=primitive_type(),ret={sequence:!1,generic:null,nullable:!1,array:!1,union:!1};if(prim)ret.idlType=prim;else{if(!(name=consume(ID)))return;if(value=name.value,all_ws(),consume(OTHER,"<"))return"sequence"===value&&(ret.sequence=!0),ret.generic=value,ret.idlType=type()||error("Error parsing generic type "+value),all_ws(),consume(OTHER,">")||error("Unterminated generic type "+value),type_suffix(ret),ret;ret.idlType=value}return type_suffix(ret),ret.nullable&&!ret.array&&"any"===ret.idlType&&error("Type any cannot be made nullable"),ret},union_type=function(){if(all_ws(),consume(OTHER,"(")){var ret={sequence:!1,generic:null,nullable:!1,array:!1,union:!0,idlType:[]},fst=type()||error("Union type with no content");for(ret.idlType.push(fst);;){if(all_ws(),!consume(ID,"or"))break;var typ=type()||error("No type after 'or' in union type");ret.idlType.push(typ)}return consume(OTHER,")")||error("Unterminated union type"),type_suffix(ret),ret}},type=function(){return single_type()||union_type()},argument=function(store){var ret={optional:!1,variadic:!1};ret.extAttrs=extended_attrs(store),all_ws(store,"pea");var opt_token=consume(ID,"optional");if(opt_token&&(ret.optional=!0,all_ws()),ret.idlType=type(),!ret.idlType)return void(opt_token&&tokens.unshift(opt_token));var type_token=last_token;ret.optional||(all_ws(),tokens.length>=3&&"other"===tokens[0].type&&"."===tokens[0].value&&"other"===tokens[1].type&&"."===tokens[1].value&&"other"===tokens[2].type&&"."===tokens[2].value&&(tokens.shift(),tokens.shift(),tokens.shift(),ret.variadic=!0)),all_ws();var name=consume(ID);return name?(ret.name=name.value,ret.optional&&(all_ws(),ret["default"]=default_()),ret):(opt_token&&tokens.unshift(opt_token),void tokens.unshift(type_token))},argument_list=function(store){var ret=[],arg=argument(store?ret:null);if(arg)for(ret.push(arg);;){if(all_ws(store?ret:null),!consume(OTHER,","))return ret;var nxt=argument(store?ret:null)||error("Trailing comma in arguments list");ret.push(nxt)}},type_pair=function(){all_ws();var k=type();if(k&&(all_ws(),consume(OTHER,","))){all_ws();var v=type();if(v)return[k,v]}},simple_extended_attr=function(store){all_ws();var name=consume(ID);if(name){var ret={name:name.value,arguments:null};all_ws();var eq=consume(OTHER,"=");if(eq){var rhs;if(all_ws(),rhs=consume(ID))ret.rhs=rhs;else if(consume(OTHER,"(")){rhs=[];var id=consume(ID);id&&(rhs=[id.value]),identifiers(rhs),consume(OTHER,")")||error("Unexpected token in extended attribute argument list or type pair"),ret.rhs={type:"identifier-list",value:rhs}}if(!ret.rhs)return error("No right hand side to extended attribute assignment")}if(all_ws(),consume(OTHER,"(")){var args,pair;(args=argument_list(store))?ret.arguments=args:(pair=type_pair())?ret.typePair=pair:ret.arguments=[],all_ws(),consume(OTHER,")")||error("Unexpected token in extended attribute argument list or type pair")}return ret}},extended_attrs=function(store){var eas=[];if(all_ws(store),!consume(OTHER,"["))return eas;for(eas[0]=simple_extended_attr(store)||error("Extended attribute with not content"),all_ws();consume(OTHER,",");)eas.push(simple_extended_attr(store)||error("Trailing comma in extended attribute")),all_ws();return consume(OTHER,"]")||error("No end of extended attribute"),eas},default_=function(){if(all_ws(),consume(OTHER,"=")){all_ws();var def=const_value();if(def)return def;if(consume(OTHER,"["))return consume(OTHER,"]")||error("Default sequence value must be empty"),{type:"sequence",value:[]};var str=consume(STR)||error("No value for default");return str.value=str.value.replace(/^"/,"").replace(/"$/,""),str}},const_=function(store){if(all_ws(store,"pea"),consume(ID,"const")){var ret={type:"const",nullable:!1};all_ws();var typ=primitive_type();typ||(typ=consume(ID)||error("No type for const"),typ=typ.value),ret.idlType=typ,all_ws(),consume(OTHER,"?")&&(ret.nullable=!0,all_ws());var name=consume(ID)||error("No name for const");ret.name=name.value,all_ws(),consume(OTHER,"=")||error("No value assignment for const"),all_ws();var cnt=const_value();return cnt?ret.value=cnt:error("No value for const"),all_ws(),consume(OTHER,";")||error("Unterminated const"),ret}},inheritance=function(){if(all_ws(),consume(OTHER,":")){all_ws();var inh=consume(ID)||error("No type in inheritance");return inh.value}},operation_rest=function(ret,store){all_ws(),ret||(ret={});var name=consume(ID);return ret.name=name?name.value:null,all_ws(),consume(OTHER,"(")||error("Invalid operation"),ret.arguments=argument_list(store)||[],all_ws(),consume(OTHER,")")||error("Unterminated operation"),all_ws(),consume(OTHER,";")||error("Unterminated operation"),ret},callback=function(store){all_ws(store,"pea");var ret;if(consume(ID,"callback")){all_ws();var tok=consume(ID,"interface");if(tok)return tokens.unshift(tok),ret=interface_(),ret.type="callback interface",ret;var name=consume(ID)||error("No name for callback");return ret={type:"callback",name:name.value},all_ws(),consume(OTHER,"=")||error("No assignment in callback"),all_ws(),ret.idlType=return_type(),all_ws(),consume(OTHER,"(")||error("No arguments in callback"),ret.arguments=argument_list(store)||[],all_ws(),consume(OTHER,")")||error("Unterminated callback"),all_ws(),consume(OTHER,";")||error("Unterminated callback"),ret}},attribute=function(store){all_ws(store,"pea");var grabbed=[],ret={type:"attribute","static":!1,stringifier:!1,inherit:!1,readonly:!1};consume(ID,"static")?(ret["static"]=!0,grabbed.push(last_token)):consume(ID,"stringifier")&&(ret.stringifier=!0,grabbed.push(last_token));var w=all_ws();if(w&&grabbed.push(w),consume(ID,"inherit")){(ret["static"]||ret.stringifier)&&error("Cannot have a static or stringifier inherit"),ret.inherit=!0,grabbed.push(last_token);var w=all_ws();w&&grabbed.push(w)}if(consume(ID,"readonly")){ret.readonly=!0,grabbed.push(last_token);var w=all_ws();w&&grabbed.push(w)}if(!consume(ID,"attribute"))return void(tokens=grabbed.concat(tokens));all_ws(),ret.idlType=type()||error("No type in attribute"),ret.idlType.sequence&&error("Attributes cannot accept sequence types"),all_ws();var name=consume(ID)||error("No name in attribute");return ret.name=name.value,all_ws(),consume(OTHER,";")||error("Unterminated attribute"),ret},return_type=function(){var typ=type();if(!typ){if(consume(ID,"void"))return"void";error("No return type")}return typ},operation=function(store){all_ws(store,"pea");for(var ret={type:"operation",getter:!1,setter:!1,creator:!1,deleter:!1,legacycaller:!1,"static":!1,stringifier:!1};;)if(all_ws(),consume(ID,"getter"))ret.getter=!0;else if(consume(ID,"setter"))ret.setter=!0;else if(consume(ID,"creator"))ret.creator=!0;else if(consume(ID,"deleter"))ret.deleter=!0;else{if(!consume(ID,"legacycaller"))break;ret.legacycaller=!0}if(ret.getter||ret.setter||ret.creator||ret.deleter||ret.legacycaller)return all_ws(),ret.idlType=return_type(),operation_rest(ret,store),ret;if(consume(ID,"static"))return ret["static"]=!0,ret.idlType=return_type(),operation_rest(ret,store),ret;if(consume(ID,"stringifier"))return ret.stringifier=!0,-all_ws(),consume(OTHER,";")?ret:(ret.idlType=return_type(),operation_rest(ret,store),ret);if(ret.idlType=return_type(),all_ws(),consume(ID,"iterator")){if(all_ws(),ret.type="iterator",consume(ID,"object"))ret.iteratorObject="object";else if(consume(OTHER,"=")){all_ws();var name=consume(ID)||error("No right hand side in iterator");ret.iteratorObject=name.value}return all_ws(),consume(OTHER,";")||error("Unterminated iterator"),ret}return operation_rest(ret,store),ret},identifiers=function(arr){for(;;){if(all_ws(),!consume(OTHER,","))break;all_ws();var name=consume(ID)||error("Trailing comma in identifiers list");arr.push(name.value)}},serialiser=function(store){if(all_ws(store,"pea"),consume(ID,"serializer")){var ret={type:"serializer"};if(all_ws(),consume(OTHER,"=")){if(all_ws(),consume(OTHER,"{")){ret.patternMap=!0,all_ws();var id=consume(ID);id&&"getter"===id.value?ret.names=["getter"]:id&&"inherit"===id.value?(ret.names=["inherit"],identifiers(ret.names)):id?(ret.names=[id.value],identifiers(ret.names)):ret.names=[],all_ws(),consume(OTHER,"}")||error("Unterminated serializer pattern map")}else if(consume(OTHER,"[")){ret.patternList=!0,all_ws();var id=consume(ID);id&&"getter"===id.value?ret.names=["getter"]:id?(ret.names=[id.value],identifiers(ret.names)):ret.names=[],all_ws(),consume(OTHER,"]")||error("Unterminated serializer pattern list")}else{var name=consume(ID)||error("Invalid serializer");ret.name=name.value}return all_ws(),consume(OTHER,";")||error("Unterminated serializer"),ret}return consume(OTHER,";")||(ret.idlType=return_type(),all_ws(),ret.operation=operation_rest(null,store)),ret}},iterable_type=function(){return consume(ID,"iterable")?"iterable":consume(ID,"legacyiterable")?"legacyiterable":consume(ID,"maplike")?"maplike":consume(ID,"setlike")?"setlike":void 0},readonly_iterable_type=function(){return consume(ID,"maplike")?"maplike":consume(ID,"setlike")?"setlike":void 0},iterable=function(store){all_ws(store,"pea");var grabbed=[],ret={type:null,idlType:null,readonly:!1};if(consume(ID,"readonly")){ret.readonly=!0,grabbed.push(last_token);var w=all_ws();w&&grabbed.push(w)}var consumeItType=ret.readonly?readonly_iterable_type:iterable_type,ittype=consumeItType();if(!ittype)return void(tokens=grabbed.concat(tokens));var secondTypeRequired="maplike"===ittype,secondTypeAllowed=secondTypeRequired||"iterable"===ittype;if(ret.type=ittype,"maplike"!==ret.type&&"setlike"!==ret.type&&delete ret.readonly,all_ws(),consume(OTHER,"<")){if(ret.idlType=type()||error("Error parsing "+ittype+" declaration"),all_ws(),secondTypeAllowed){var type2=null;consume(OTHER,",")&&(all_ws(),type2=type(),all_ws()),type2?ret.idlType=[ret.idlType,type2]:secondTypeRequired&&error("Missing second type argument in "+ittype+" declaration")}consume(OTHER,">")||error("Unterminated "+ittype+" declaration"),all_ws(),consume(OTHER,";")||error("Missing semicolon after "+ittype+" declaration")}else error("Error parsing "+ittype+" declaration");return ret},interface_=function(isPartial,store){if(all_ws(isPartial?null:store,"pea"),consume(ID,"interface")){all_ws();var name=consume(ID)||error("No name for interface"),mems=[],ret={type:"interface",name:name.value,partial:!1,members:mems};for(isPartial||(ret.inheritance=inheritance()||null),all_ws(),consume(OTHER,"{")||error("Bodyless interface");;){if(all_ws(store?mems:null),consume(OTHER,"}"))return all_ws(),consume(OTHER,";")||error("Missing semicolon after interface"),ret;var ea=extended_attrs(store?mems:null);all_ws();var cnt=const_(store?mems:null);if(cnt)cnt.extAttrs=ea,ret.members.push(cnt);else{var mem=opt.allowNestedTypedefs&&typedef(store?mems:null)||iterable(store?mems:null)||serialiser(store?mems:null)||attribute(store?mems:null)||operation(store?mems:null)||error("Unknown member");mem.extAttrs=ea,ret.members.push(mem)}}}},partial=function(store){if(all_ws(store,"pea"),consume(ID,"partial")){var thing=dictionary(!0,store)||interface_(!0,store)||error("Partial doesn't apply to anything");return thing.partial=!0,thing}},dictionary=function(isPartial,store){if(all_ws(isPartial?null:store,"pea"),consume(ID,"dictionary")){all_ws();var name=consume(ID)||error("No name for dictionary"),mems=[],ret={type:"dictionary",name:name.value,partial:!1,members:mems};for(isPartial||(ret.inheritance=inheritance()||null),all_ws(),consume(OTHER,"{")||error("Bodyless dictionary");;){if(all_ws(store?mems:null),consume(OTHER,"}"))return all_ws(),consume(OTHER,";")||error("Missing semicolon after dictionary"),ret;var ea=extended_attrs(store?mems:null);all_ws(store?mems:null,"pea");var required=consume(ID,"required"),typ=type()||error("No type for dictionary member");all_ws();var name=consume(ID)||error("No name for dictionary member"),dflt=default_();required&&dflt&&error("Required member must not have a default"),ret.members.push({type:"field",name:name.value,required:!!required,idlType:typ,extAttrs:ea,"default":dflt}),all_ws(),consume(OTHER,";")||error("Unterminated dictionary member")}}},exception=function(store){if(all_ws(store,"pea"),consume(ID,"exception")){all_ws();var name=consume(ID)||error("No name for exception"),mems=[],ret={type:"exception",name:name.value,members:mems};for(ret.inheritance=inheritance()||null,all_ws(),consume(OTHER,"{")||error("Bodyless exception");;){if(all_ws(store?mems:null),consume(OTHER,"}"))return all_ws(),consume(OTHER,";")||error("Missing semicolon after exception"),ret;var ea=extended_attrs(store?mems:null);all_ws(store?mems:null,"pea");var cnt=const_();if(cnt)cnt.extAttrs=ea,ret.members.push(cnt);else{var typ=type();all_ws();var name=consume(ID);all_ws(),typ&&name&&consume(OTHER,";")||error("Unknown member in exception body"),ret.members.push({type:"field",name:name.value,idlType:typ,extAttrs:ea})}}}},enum_=function(store){if(all_ws(store,"pea"),consume(ID,"enum")){all_ws();var name=consume(ID)||error("No name for enum"),vals=[],ret={type:"enum",name:name.value,values:vals};all_ws(),consume(OTHER,"{")||error("No curly for enum");for(var saw_comma=!1;;){if(all_ws(store?vals:null),consume(OTHER,"}"))return all_ws(),consume(OTHER,";")||error("No semicolon after enum"),ret;var val=consume(STR)||error("Unexpected value in enum");ret.values.push(val.value.replace(/"/g,"")),all_ws(store?vals:null),consume(OTHER,",")?(store&&vals.push({type:","}),all_ws(store?vals:null),saw_comma=!0):saw_comma=!1}}},typedef=function(store){if(all_ws(store,"pea"),consume(ID,"typedef")){var ret={type:"typedef"};all_ws(),ret.typeExtAttrs=extended_attrs(),all_ws(store,"tpea"),ret.idlType=type()||error("No type in typedef"),all_ws();var name=consume(ID)||error("No name in typedef");return ret.name=name.value,all_ws(),consume(OTHER,";")||error("Unterminated typedef"),ret}},implements_=function(store){all_ws(store,"pea");var target=consume(ID);if(target){var w=all_ws();if(consume(ID,"implements")){var ret={type:"implements",target:target.value};all_ws();var imp=consume(ID)||error("Incomplete implements statement");return ret["implements"]=imp.value,all_ws(),consume(OTHER,";")||error("No terminating ; for implements statement"),ret}tokens.unshift(w),tokens.unshift(target)}},definition=function(store){return callback(store)||interface_(!1,store)||partial(store)||dictionary(!1,store)||exception(store)||enum_(store)||typedef(store)||implements_(store)},definitions=function(store){if(!tokens.length)return[];for(var defs=[];;){var ea=extended_attrs(store?defs:null),def=definition(store?defs:null);if(!def){ea.length&&error("Stray extended attributes");break}def.extAttrs=ea,defs.push(def)}return defs},res=definitions(opt.ws);return tokens.length&&error("Unrecognised tokens"),res},inNode="undefined"!=typeof module&&module.exports,obj={parse:function(str,opt){opt||(opt={});var tokens=tokenise(str);return parse(tokens,opt)}};inNode?module.exports=obj:self.WebIDL2=obj}()}});