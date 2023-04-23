// Note: Some Emscripten settings will significantly limit the speed of the generated code.
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module.exports = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (ENVIRONMENT_IS_WEB) {
    Module['print'] = function(x) {
      console.log(x);
    };
    Module['printErr'] = function(x) {
      console.log(x);
    };
    this['Module'] = Module;
  } else if (ENVIRONMENT_IS_WORKER) {
    // We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2 + 2*i;
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+7)>>3)<<3); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+7)>>3)<<3); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = ((((DYNAMICTOP)+7)>>3)<<3); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= (+(1)) ? (tempDouble > (+(0)) ? ((Math.min((+(Math.floor((tempDouble)/(+(4294967296))))), (+(4294967295))))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+(4294967296)))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0
}
Module['stringToUTF32'] = stringToUTF32;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledInit = false, calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addOnPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
}
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 110856;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
var _stdin;
var _stdin = _stdin=allocate([0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([60,32,37,108,108,117,32,37,111,32,37,48,50,111,10,0,62,9,9,37,108,108,117,32,37,111,32,48,49,10,0,0,62,9,9,37,108,108,117,32,37,111,32,48,51,10,0,0,37,108,108,111,0,0,0,0,114,98,0,0,0,0,0,0,37,111,0,0,0,0,0,0,114,0,0,0,0,0,0,0,67,111,114,101,46,98,105,110,0,0,0,0,0,0,0,0,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:35,EIDRM:36,ECHRNG:37,EL2NSYNC:38,EL3HLT:39,EL3RST:40,ELNRNG:41,EUNATCH:42,ENOCSI:43,EL2HLT:44,EDEADLK:45,ENOLCK:46,EBADE:50,EBADR:51,EXFULL:52,ENOANO:53,EBADRQC:54,EBADSLT:55,EDEADLOCK:56,EBFONT:57,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:74,EDOTDOT:76,EBADMSG:77,ENOTUNIQ:80,EBADFD:81,EREMCHG:82,ELIBACC:83,ELIBBAD:84,ELIBSCN:85,ELIBMAX:86,ELIBEXEC:87,ENOSYS:88,ENOTEMPTY:90,ENAMETOOLONG:91,ELOOP:92,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:106,EPROTOTYPE:107,ENOTSOCK:108,ENOPROTOOPT:109,ESHUTDOWN:110,ECONNREFUSED:111,EADDRINUSE:112,ECONNABORTED:113,ENETUNREACH:114,ENETDOWN:115,ETIMEDOUT:116,EHOSTDOWN:117,EHOSTUNREACH:118,EINPROGRESS:119,EALREADY:120,EDESTADDRREQ:121,EMSGSIZE:122,EPROTONOSUPPORT:123,ESOCKTNOSUPPORT:124,EADDRNOTAVAIL:125,ENETRESET:126,EISCONN:127,ENOTCONN:128,ETOOMANYREFS:129,EUSERS:131,EDQUOT:132,ESTALE:133,ENOTSUP:134,ENOMEDIUM:135,EILSEQ:138,EOVERFLOW:139,ECANCELED:140,ENOTRECOVERABLE:141,EOWNERDEAD:142,ESTRPIPE:143};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"No message of desired type",36:"Identifier removed",37:"Channel number out of range",38:"Level 2 not synchronized",39:"Level 3 halted",40:"Level 3 reset",41:"Link number out of range",42:"Protocol driver not attached",43:"No CSI structure available",44:"Level 2 halted",45:"Deadlock condition",46:"No record locks available",50:"Invalid exchange",51:"Invalid request descriptor",52:"Exchange full",53:"No anode",54:"Invalid request code",55:"Invalid slot",56:"File locking deadlock error",57:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",74:"Multihop attempted",76:"Cross mount point (not really error)",77:"Trying to read unreadable message",80:"Given log. name not unique",81:"f.d. invalid for this operation",82:"Remote address changed",83:"Can   access a needed shared lib",84:"Accessing a corrupted shared lib",85:".lib section in a.out corrupted",86:"Attempting to link in too many libs",87:"Attempting to exec a shared library",88:"Function not implemented",90:"Directory not empty",91:"File or path name too long",92:"Too many symbolic links",95:"Operation not supported on transport endpoint",96:"Protocol family not supported",104:"Connection reset by peer",105:"No buffer space available",106:"Address family not supported by protocol family",107:"Protocol wrong type for socket",108:"Socket operation on non-socket",109:"Protocol not available",110:"Can't send after socket shutdown",111:"Connection refused",112:"Address already in use",113:"Connection aborted",114:"Network is unreachable",115:"Network interface is not configured",116:"Connection timed out",117:"Host is down",118:"Host is unreachable",119:"Connection already in progress",120:"Socket already connected",121:"Destination address required",122:"Message too long",123:"Unknown protocol",124:"Socket type not supported",125:"Address not available",126:"Connection reset by network",127:"Socket is already connected",128:"Socket is not connected",129:"Too many references",131:"Too many users",132:"Quota exceeded",133:"Stale file handle",134:"Not supported",135:"No medium (in tape drive)",138:"Illegal byte sequence",139:"Value too large for defined data type",140:"Operation canceled",141:"State not recoverable",142:"Previous owner died",143:"Streams pipe error"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var VFS=undefined;
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path, ext) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var f = PATH.splitPath(path)[2];
        if (ext && f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
        }
        return f;
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.filter(function(p, index) {
          if (typeof p !== 'string') {
            throw new TypeError('Arguments to path.join must be strings');
          }
          return p;
        }).join('/'));
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },mount:function (mount) {
        return MEMFS.create_node(null, '/', 0040000 | 0777, 0);
      },create_node:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek
          };
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap
          };
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          };
          node.stream_ops = {};
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          };
          node.stream_ops = FS.chrdev_stream_ops;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.create_node(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.create_node(parent, newname, 0777 | 0120000, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            assert(buffer.length);
            if (canOwn && buffer.buffer === HEAP8.buffer && offset === 0) {
              node.contents = buffer; // this is a subarray of the heap, and we can own it
              node.contentMode = MEMFS.CONTENT_OWNING;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 0x02) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        },handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + new Error().stack;
        return ___setErrNo(e.errno);
      },cwd:function () {
        return FS.currentPath;
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.currentPath, path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            return path ? PATH.join(node.mount.mountpoint, path) : node.mount.mountpoint;
          }
          path = path ? PATH.join(node.name, path) : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          if (node.parent.id === parent.id && node.name === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        var node = {
          id: FS.nextInode++,
          name: name,
          mode: mode,
          node_ops: {},
          stream_ops: {},
          rdev: rdev,
          parent: null,
          mount: null
        };
        if (!parent) {
          parent = node;  // root node sets parent to itself
        }
        node.parent = parent;
        node.mount = parent.mount;
        // compatibility
        var readMode = 292 | 73;
        var writeMode = 146;
        // NOTE we must use Object.defineProperties instead of individual calls to
        // Object.defineProperty in order to make closure compiler happy
        Object.defineProperties(node, {
          read: {
            get: function() { return (node.mode & readMode) === readMode; },
            set: function(val) { val ? node.mode |= readMode : node.mode &= ~readMode; }
          },
          write: {
            get: function() { return (node.mode & writeMode) === writeMode; },
            set: function(val) { val ? node.mode |= writeMode : node.mode &= ~writeMode; }
          },
          isFolder: {
            get: function() { return FS.isDir(node.mode); },
          },
          isDevice: {
            get: function() { return FS.isChrdev(node.mode); },
          },
        });
        FS.hashAddNode(node);
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 0170000) === 0100000;
      },isDir:function (mode) {
        return (mode & 0170000) === 0040000;
      },isLink:function (mode) {
        return (mode & 0170000) === 0120000;
      },isChrdev:function (mode) {
        return (mode & 0170000) === 0020000;
      },isBlkdev:function (mode) {
        return (mode & 0170000) === 0060000;
      },isFIFO:function (mode) {
        return (mode & 0170000) === 0010000;
      },isSocket:function (mode) {
        return (mode & 0140000) === 0140000;
      },flagModes:{"r":0,"rs":8192,"r+":2,"w":1537,"wx":3585,"xw":3585,"w+":1538,"wx+":3586,"xw+":3586,"a":521,"ax":2569,"xa":2569,"a+":522,"ax+":2570,"xa+":2570},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 3;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 1024)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.currentPath) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 3) !== 0 ||  // opening for write
              (flags & 1024)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        // compatibility
        Object.defineProperties(stream, {
          object: {
            get: function() { return stream.node; },
            set: function(val) { stream.node = val; }
          },
          isRead: {
            get: function() { return (stream.flags & 3) !== 1; }
          },
          isWrite: {
            get: function() { return (stream.flags & 3) !== 0; }
          },
          isAppend: {
            get: function() { return (stream.flags & 8); }
          }
        });
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },mount:function (type, opts, mountpoint) {
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
        }
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 0100000;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 0001000;
        mode |= 0040000;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 0020000;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        path = PATH.normalize(path);
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 512)) {
          mode = (mode & 4095) | 0100000;
        } else {
          mode = 0;
        }
        var node;
        try {
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 0200000)
          });
          node = lookup.node;
          path = lookup.path;
        } catch (e) {
          // ignore
        }
        // perhaps we need to create the node
        if ((flags & 512)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 2048)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~1024;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 1024)) {
          FS.truncate(node, 0);
        }
        // register the stream with the filesystem
        var stream = FS.createStream({
          path: path,
          node: node,
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 8) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 3) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 3) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.errnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },staticInit:function () {
        FS.nameTable = new Array(4096);
        FS.root = FS.createNode(null, '/', 0040000 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(path, mode | 146);
          var stream = FS.open(path, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(path, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var ___dirent_struct_layout={__size__:1040,d_ino:0,d_name:4,d_off:1028,d_reclen:1032,d_type:1036};function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 1024;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 512;
        flags |= 8;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var ret = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return (ret == -1) ? 0 : ret;
    }
  function _random() {
  Module['printErr']('missing function: random'); abort(-1);
  }
  var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 0040000 | 0777, 0);
      },nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 0140000, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {} : ['binary'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          var handleMessage = function(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (0 /* XXX missing C define POLLRDNORM */ | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (0 /* XXX missing C define POLLRDNORM */ | 1);
          }
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 2;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 1:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }
  function _lseek(fildes, offset, whence) {
      // off_t lseek(int fildes, off_t offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/lseek.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        return FS.llseek(stream, offset, whence);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fseek(stream, offset, whence) {
      // int fseek(FILE *stream, long offset, int whence);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fseek.html
      var ret = _lseek(stream, offset, whence);
      if (ret == -1) {
        return -1;
      }
      stream = FS.getStream(stream);
      stream.eof = false;
      return 0;
    }
  function _ftell(stream) {
      // long ftell(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ftell.html
      stream = FS.getStream(stream);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      if (FS.isChrdev(stream.node.mode)) {
        ___setErrNo(ERRNO_CODES.ESPIPE);
        return -1;
      } else {
        return stream.position;
      }
    }
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStream(stream);
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop()
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(stream, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      _fsync(stream);
      return _close(stream);
    }
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      // We use file descriptor numbers and FILE* streams interchangeably.
      return stream;
    }
  function __isFloat(text) {
      return !!(/^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?$/.exec(text));
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
        __scanString.whiteSpace[' '] = 1;
        __scanString.whiteSpace['\t'] = 1;
        __scanString.whiteSpace['\n'] = 1;
        __scanString.whiteSpace['\v'] = 1;
        __scanString.whiteSpace['\f'] = 1;
        __scanString.whiteSpace['\r'] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC)
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            var last = 0;
            next = get();
            while (next > 0) {
              buffer.push(String.fromCharCode(next));
              if (__isFloat(buffer.join(''))) {
                last = buffer.length;
              }
              next = get();
            }
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math.abs(tempDouble))) >= (+(1)) ? (tempDouble > (+(0)) ? ((Math.min((+(Math.floor((tempDouble)/(+(4294967296))))), (+(4294967295))))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+(4294967296)))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16)
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text)
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text)
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j]
              }
              break;
          }
          fields++;
        } else if (format[formatIndex] in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }
  function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStream(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var streamObj = FS.getStream(stream);
      if (!streamObj) {
        return -1;
      }
      var buffer = [];
      var get = function() {
        var c = _fgetc(stream);
        buffer.push(c);
        return c;
      };
      var unget = function() {
        _ungetc(buffer.pop(), stream);
      };
      return __scanString(format, get, unget, varargs);
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  var ___flock_struct_layout={__size__:16,l_type:0,l_whence:2,l_start:4,l_len:8,l_pid:12,l_xxx:14};function _fcntl(fildes, cmd, varargs, dup2) {
      // int fcntl(int fildes, int cmd, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/fcntl.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      switch (cmd) {
        case 0:
          var arg = HEAP32[((varargs)>>2)];
          if (arg < 0) {
            ___setErrNo(ERRNO_CODES.EINVAL);
            return -1;
          }
          var newStream;
          try {
            newStream = FS.open(stream.path, stream.flags, 0, arg);
          } catch (e) {
            FS.handleFSError(e);
            return -1;
          }
          return newStream.fd;
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4:
          var arg = HEAP32[((varargs)>>2)];
          stream.flags |= arg;
          return 0;
        case 7:
        case 20:
          var arg = HEAP32[((varargs)>>2)];
          var offset = ___flock_struct_layout.l_type;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=3
          return 0;
        case 8:
        case 9:
        case 21:
        case 22:
          // Pretend that the locking is successful.
          return 0;
        case 6:
        case 5:
          // These are for sockets. We don't have them fully implemented yet.
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        default:
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
      }
      // Should never be reached. Only to silence strict warnings.
      return -1;
    }
  Module["_memcpy"] = _memcpy;
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;
  function _free() {
  }
  Module["_free"] = _free;
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (window.scrollX + rect.left);
              y = t.pageY - (window.scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (window.scrollX + rect.left);
            y = event.pageY - (window.scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
var Math_min = Math.min;
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var cttz_i8=env.cttz_i8|0;
  var ctlz_i8=env.ctlz_i8|0;
  var _stdin=env._stdin|0;
  var NaN=+env.NaN;
  var Infinity=+env.Infinity;
  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var Math_min=env.min;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_iii=env.invoke_iii;
  var invoke_vi=env.invoke_vi;
  var _lseek=env._lseek;
  var _malloc=env._malloc;
  var __scanString=env.__scanString;
  var _random=env._random;
  var _fclose=env._fclose;
  var _fprintf=env._fprintf;
  var _pread=env._pread;
  var __isFloat=env.__isFloat;
  var _close=env._close;
  var _fflush=env._fflush;
  var _fopen=env._fopen;
  var __reallyNegative=env.__reallyNegative;
  var _open=env._open;
  var ___setErrNo=env.___setErrNo;
  var _fwrite=env._fwrite;
  var _fseek=env._fseek;
  var _send=env._send;
  var _write=env._write;
  var _fgetc=env._fgetc;
  var _ftell=env._ftell;
  var _fcntl=env._fcntl;
  var _fread=env._fread;
  var _read=env._read;
  var __formatString=env.__formatString;
  var _free=env._free;
  var _recv=env._recv;
  var _fileno=env._fileno;
  var _pwrite=env._pwrite;
  var _fsync=env._fsync;
  var _fscanf=env._fscanf;
  var _ungetc=env._ungetc;
// EMSCRIPTEN_START_FUNCS
function stackAlloc(size){size=size|0;var ret=0;ret=STACKTOP;STACKTOP=STACKTOP+size|0;STACKTOP=STACKTOP+7>>3<<3;return ret|0}function stackSave(){return STACKTOP|0}function stackRestore(top){top=top|0;STACKTOP=top}function setThrew(threw,value){threw=threw|0;value=value|0;if((__THREW__|0)==0){__THREW__=threw;threwValue=value}}function copyTempFloat(ptr){ptr=ptr|0;HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1|0]=HEAP8[ptr+1|0];HEAP8[tempDoublePtr+2|0]=HEAP8[ptr+2|0];HEAP8[tempDoublePtr+3|0]=HEAP8[ptr+3|0]}function copyTempDouble(ptr){ptr=ptr|0;HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1|0]=HEAP8[ptr+1|0];HEAP8[tempDoublePtr+2|0]=HEAP8[ptr+2|0];HEAP8[tempDoublePtr+3|0]=HEAP8[ptr+3|0];HEAP8[tempDoublePtr+4|0]=HEAP8[ptr+4|0];HEAP8[tempDoublePtr+5|0]=HEAP8[ptr+5|0];HEAP8[tempDoublePtr+6|0]=HEAP8[ptr+6|0];HEAP8[tempDoublePtr+7|0]=HEAP8[ptr+7|0]}function setTempRet0(value){value=value|0;tempRet0=value}function setTempRet1(value){value=value|0;tempRet1=value}function setTempRet2(value){value=value|0;tempRet2=value}function setTempRet3(value){value=value|0;tempRet3=value}function setTempRet4(value){value=value|0;tempRet4=value}function setTempRet5(value){value=value|0;tempRet5=value}function setTempRet6(value){value=value|0;tempRet6=value}function setTempRet7(value){value=value|0;tempRet7=value}function setTempRet8(value){value=value|0;tempRet8=value}function setTempRet9(value){value=value|0;tempRet9=value}function runPostSets(){}function _BacktraceAdd($State,$Cause){$State=$State|0;$Cause=$Cause|0;return}function _ChannelRoutine($State){$State=$State|0;return}function _ShiftToDeda($State,$Data){$State=$State|0;$Data=$Data|0;return}function _OverflowCorrected($Value){$Value=$Value|0;return($Value>>>1&16384|$Value&16383)&65535|0}function _SignExtend($Word){$Word=$Word|0;var $conv=0;$conv=$Word<<16>>16;return $conv<<1&32768|$conv&32767|0}function _AddSP16($Addend1,$Addend2){$Addend1=$Addend1|0;$Addend2=$Addend2|0;var $add=0,$Sum_0=0,label=0;label=1;while(1)switch(label|0){case 1:$add=$Addend2+$Addend1|0;if(($add&65536|0)==0){$Sum_0=$add;label=3;break}else{label=2;break};case 2:$Sum_0=$add+1&65535;label=3;break;case 3:return $Sum_0|0}return 0}function _CounterPINC($Counter){$Counter=$Counter|0;var $0=0,$and=0,$i_1=0,$Overflow_0=0,label=0;label=1;while(1)switch(label|0){case 1:$0=HEAP16[$Counter>>1]|0;if($0<<16>>16==16383){$Overflow_0=1;$i_1=0;label=3;break}else{label=2;break};case 2:$and=$0+1&32767;$Overflow_0=0;$i_1=($and<<16>>16==0)+$and&65535;label=3;break;case 3:HEAP16[$Counter>>1]=$i_1;return $Overflow_0|0}return 0}function _CounterMINC($Counter){$Counter=$Counter|0;var $0=0,$and=0,$i_1=0,$Overflow_0=0,label=0;label=1;while(1)switch(label|0){case 1:$0=HEAP16[$Counter>>1]|0;if($0<<16>>16==16384){$Overflow_0=1;$i_1=32767;label=3;break}else{label=2;break};case 2:$and=$0+32767&32767;$Overflow_0=0;$i_1=(($and<<16>>16==32767)<<31>>31)+$and&65535;label=3;break;case 3:HEAP16[$Counter>>1]=$i_1;return $Overflow_0|0}return 0}function _CounterPCDU($Counter){$Counter=$Counter|0;var $0=0;$0=HEAP16[$Counter>>1]|0;HEAP16[$Counter>>1]=$0+1&32767;return $0<<16>>16==32767|0}function _CounterMCDU($Counter){$Counter=$Counter|0;var $0=0;$0=HEAP16[$Counter>>1]|0;HEAP16[$Counter>>1]=$0+32767&32767;return $0<<16>>16==0|0}function _CounterSHINC($Counter){$Counter=$Counter|0;var $0=0;$0=HEAP16[$Counter>>1]|0;HEAP16[$Counter>>1]=$0<<1&16382;return($0&65535)>>>13&1|0}function _CounterSHANC($Counter){$Counter=$Counter|0;var $0=0;$0=HEAP16[$Counter>>1]|0;HEAP16[$Counter>>1]=$0<<1&16382|1;return($0&65535)>>>13&1|0}function _peek($addr){$addr=$addr|0;return HEAP16[8656+(($addr&255)<<1)>>1]|0}function _poke($addr,$val){$addr=$addr|0;$val=$val|0;var $arrayidx=0,$conv=0;$arrayidx=8656+(($addr&255)<<1)|0;$conv=HEAP16[$arrayidx>>1]|0;HEAP16[$arrayidx>>1]=$val&32767;return $conv|0}function _qinit($q){$q=$q|0;HEAP32[$q+4096>>2]=0;HEAP32[$q+4100>>2]=0;return}function _qsend($q,$packet){$q=$q|0;$packet=$packet|0;var $tail=0,$0=0,$and=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$tail=$q+4096|0;$0=HEAP32[$tail>>2]|0;$and=$0+4&4095;if(($and|0)==(HEAP32[$q+4100>>2]|0)){$retval_0=0;label=3;break}else{label=2;break};case 2:HEAP8[$q+$0|0]=HEAP8[$packet]|0;HEAP8[$q+((HEAP32[$tail>>2]|0)+1)|0]=HEAP8[$packet+1|0]|0;HEAP8[$q+((HEAP32[$tail>>2]|0)+2)|0]=HEAP8[$packet+2|0]|0;HEAP8[$q+((HEAP32[$tail>>2]|0)+3)|0]=HEAP8[$packet+3|0]|0;HEAP32[$tail>>2]=$and;$retval_0=4;label=3;break;case 3:return $retval_0|0}return 0}function _qrecv($q,$packet){$q=$q|0;$packet=$packet|0;var $head=0,$0=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$head=$q+4100|0;$0=HEAP32[$head>>2]|0;if(($0|0)==(HEAP32[$q+4096>>2]|0)){$retval_0=0;label=3;break}else{label=2;break};case 2:HEAP8[$packet]=HEAP8[$q+$0|0]|0;HEAP8[$packet+1|0]=HEAP8[$q+((HEAP32[$head>>2]|0)+1)|0]|0;HEAP8[$packet+2|0]=HEAP8[$q+((HEAP32[$head>>2]|0)+2)|0]|0;HEAP8[$packet+3|0]=HEAP8[$q+((HEAP32[$head>>2]|0)+3)|0]|0;HEAP32[$head>>2]=(HEAP32[$head>>2]|0)+4&4095;$retval_0=4;label=3;break;case 3:return $retval_0|0}return 0}function _ReadIO($State,$Address){$State=$State|0;$Address=$Address|0;var $arrayidx=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:if($Address>>>0>511){$retval_0=0;label=7;break}else{label=2;break};case 2:if((HEAP32[27042]|0)==0){label=4;break}else{label=3;break};case 3:$arrayidx=97864+($Address<<2)|0;HEAP32[$arrayidx>>2]=(HEAP32[$arrayidx>>2]|0)+1;label=4;break;case 4:if(($Address-1|0)>>>0<2){label=5;break}else{label=6;break};case 5:$retval_0=HEAP16[$State+8+($Address<<1)>>1]|0;label=7;break;case 6:$retval_0=HEAP16[$State+86024+($Address<<1)>>1]|0;label=7;break;case 7:return $retval_0|0}return 0}function _WriteIO($State,$Address,$Value){$State=$State|0;$Address=$Address|0;$Value=$Value|0;var $and=0,$arrayidx=0,$Value_addr_0_ph_off0=0,$conv17=0,label=0;label=1;while(1)switch(label|0){case 1:$and=$Value&32767;if($Address>>>0>511){label=11;break}else{label=2;break};case 2:if((HEAP32[27042]|0)==0){label=4;break}else{label=3;break};case 3:$arrayidx=95816+($Address<<2)|0;HEAP32[$arrayidx>>2]=(HEAP32[$arrayidx>>2]|0)+1;label=4;break;case 4:if(($Address-1|0)>>>0<2){label=5;break}else{label=6;break};case 5:HEAP16[$State+8+($Address<<1)>>1]=$and&65535;$Value_addr_0_ph_off0=$and&65535;label=8;break;case 6:if(($Address|0)==27){label=7;break}else{label=9;break};case 7:$Value_addr_0_ph_off0=HEAP16[$State+86024+($Address<<1)>>1]|31744;label=8;break;case 8:HEAP16[$State+86024+($Address<<1)>>1]=$Value_addr_0_ph_off0;label=11;break;case 9:$conv17=$and&65535;HEAP16[$State+86024+($Address<<1)>>1]=$conv17;if(($Address|0)==8){label=10;break}else{label=11;break};case 10:HEAP16[$State+87050+(($Value>>>11&15)<<1)>>1]=$conv17;label=11;break;case 11:return}}function _main(){var $i_02=0,$inc=0,label=0;label=1;while(1)switch(label|0){case 1:_agc_engine_init(8648,88,0,0)|0;$i_02=0;label=2;break;case 2:_agc_engine(8648)|0;$inc=$i_02+1|0;if(($inc|0)<934){$i_02=$inc;label=2;break}else{label=3;break};case 3:return 0}return 0}function _advance(){var $i_02=0,$inc=0,label=0;label=1;while(1)switch(label|0){case 1:$i_02=0;label=2;break;case 2:_agc_engine(8648)|0;$inc=$i_02+1|0;if(($inc|0)<934){$i_02=$inc;label=2;break}else{label=3;break};case 3:return 0}return 0}function _sendPort($port,$val,$mask){$port=$port|0;$val=$val|0;$mask=$mask|0;var $Packet=0,$arraydecay=0,$arraydecay9=0,$retval_0=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$Packet=sp|0;if(($port&128|0)==0){label=2;break}else{label=4;break};case 2:$arraydecay=$Packet|0;if((_FormIoPacket($port+256|0,$mask,$arraydecay)|0)==0){label=3;break}else{$retval_0=0;label=6;break};case 3:if((_qsend(4528,$arraydecay)|0)==0){$retval_0=0;label=6;break}else{label=4;break};case 4:$arraydecay9=$Packet|0;if((_FormIoPacket($port,$val,$arraydecay9)|0)==0){label=5;break}else{$retval_0=0;label=6;break};case 5:$retval_0=_qsend(4528,$arraydecay9)|0;label=6;break;case 6:STACKTOP=sp;return $retval_0|0}return 0}function _scanPort($mask){$mask=$mask|0;var $chan=0,$val=0,$arraydecay=0,$0=0,$retval_0=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$chan=sp+8|0;$val=sp+16|0;$arraydecay=sp|0;label=2;break;case 2:if((_qrecv(424,$arraydecay)|0)==0){$retval_0=0;label=5;break}else{label=3;break};case 3:_ParseIoPacket($arraydecay,$chan,$val,sp+24|0)|0;$0=HEAP32[$chan>>2]|0;if((1<<$0&$mask|0)!=0|($mask&1|0)!=0&($0|0)>115){label=4;break}else{label=2;break};case 4:$retval_0=(HEAP32[$chan>>2]<<16)+(HEAP32[$val>>2]|0)|0;label=5;break;case 5:STACKTOP=sp;return $retval_0|0}return 0}function _readPort(){var $chan=0,$val=0,$arraydecay=0,$retval_0=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$chan=sp+8|0;$val=sp+16|0;$arraydecay=sp|0;if((_qrecv(424,$arraydecay)|0)==0){$retval_0=0;label=3;break}else{label=2;break};case 2:_ParseIoPacket($arraydecay,$chan,$val,sp+24|0)|0;$retval_0=(HEAP32[$chan>>2]<<16)+(HEAP32[$val>>2]|0)|0;label=3;break;case 3:STACKTOP=sp;return $retval_0|0}return 0}function _rfopen($Filename,$mode){$Filename=$Filename|0;$mode=$mode|0;return _fopen($Filename|0,$mode|0)|0}function _Initialize(){var $i_03=0,$inc=0,label=0;label=1;while(1)switch(label|0){case 1:if((HEAP32[2158]|0)==0){label=2;break}else{label=4;break};case 2:HEAP32[2158]=1;_qinit(4528);_qinit(424);$i_03=0;label=3;break;case 3:HEAP32[108184+($i_03<<2)>>2]=32767;$inc=$i_03+1|0;if(($inc|0)<256){$i_03=$inc;label=3;break}else{label=4;break};case 4:return}}function _ChannelOutput($State,$Channel,$Value){$State=$State|0;$Channel=$Channel|0;$Value=$Value|0;var $Packet=0,$conv=0,$arraydecay=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$Packet=sp|0;_Initialize();if(($Channel|0)==7){label=2;break}else if(($Channel|0)==11){label=3;break}else{label=5;break};case 2:$conv=$Value&112;HEAP16[$State+87048>>1]=$conv;HEAP16[$State+86038>>1]=$conv;label=7;break;case 3:if(($Value&384|0)!=384|(HEAP32[27044]|0)!=0){label=5;break}else{label=4;break};case 4:HEAP16[$State+76>>1]=HEAP32[23952]&65535;HEAP16[$State+78>>1]=HEAP32[23948]&65535;HEAP16[$State+80>>1]=HEAP32[23950]&65535;label=5;break;case 5:$arraydecay=$Packet|0;if((_FormIoPacket($Channel,$Value,$arraydecay)|0)==0){label=6;break}else{label=7;break};case 6:_qsend(424,$arraydecay)|0;label=7;break;case 7:STACKTOP=sp;return}}function _ChannelInput($State){$State=$State|0;var $Channel=0,$Value=0,$uBit=0,$0=0,$arraydecay=0,$and=0,$4=0,$call15=0,$or=0,$11=0,$13=0,$15=0,$17=0,$and45=0,$retval_0=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+32|0;label=1;while(1)switch(label|0){case 1:$Channel=sp|0;$Value=sp+8|0;$uBit=sp+16|0;$0=HEAP32[27302]|0;if(($0|0)>0){label=2;break}else{label=3;break};case 2:HEAP32[27302]=$0-1;$retval_0=0;label=18;break;case 3:HEAP32[27302]=HEAP32[26];_Initialize();$arraydecay=sp+24|0;if((_qrecv(4528,$arraydecay)|0)==0){$retval_0=0;label=18;break}else{label=4;break};case 4:if((_ParseIoPacket($arraydecay,$Channel,$Value,$uBit)|0)==0){label=5;break}else{$retval_0=0;label=18;break};case 5:$and=HEAP32[$Value>>2]&32767;HEAP32[$Value>>2]=$and;$4=HEAP32[$Channel>>2]|0;if((HEAP32[$uBit>>2]|0)==0){label=7;break}else{label=6;break};case 6:HEAP32[108184+($4<<2)>>2]=$and;$retval_0=0;label=18;break;case 7:if(($4&128|0)==0){label=9;break}else{label=8;break};case 8:_UnprogrammedIncrement($State,$4,$and);$retval_0=1;label=18;break;case 9:HEAP32[$Value>>2]=HEAP32[108184+($4<<2)>>2]&$and;$call15=_ReadIO($State,HEAP32[$Channel>>2]|0)|0;$or=HEAP32[$Value>>2]|$call15&~HEAP32[108184+(HEAP32[$Channel>>2]<<2)>>2];HEAP32[$Value>>2]=$or;_WriteIO($State,HEAP32[$Channel>>2]|0,$or);$11=HEAP32[$Channel>>2]|0;switch($11|0){case 13:{label=10;break};case 123:{label=11;break};case 118:{label=12;break};case 119:{label=13;break};case 120:{label=14;break};case 25:{label=15;break};default:{$retval_0=0;label=18;break}}break;case 10:HEAP8[$State+87089|0]=1;$retval_0=0;label=18;break;case 11:HEAP16[$State+82>>1]=HEAP32[$Value>>2]&32767;HEAP8[$State+87091|0]=1;$retval_0=0;label=18;break;case 12:$13=HEAP32[$Value>>2]|0;HEAP32[23952]=$13;_ChannelOutput($State,HEAP32[$Channel>>2]|0,$13);$retval_0=0;label=18;break;case 13:$15=HEAP32[$Value>>2]|0;HEAP32[23948]=$15;_ChannelOutput($State,HEAP32[$Channel>>2]|0,$15);$retval_0=0;label=18;break;case 14:$17=HEAP32[$Value>>2]|0;HEAP32[23950]=$17;_ChannelOutput($State,HEAP32[$Channel>>2]|0,$17);$retval_0=0;label=18;break;case 15:_ChannelOutput($State,$11,HEAP32[$Value>>2]|0);$and45=HEAP32[$Value>>2]&16384;if((HEAP32[104]|0)!=0&($and45|0)==0){label=16;break}else{label=17;break};case 16:HEAP8[$State+87094|0]=1;label=17;break;case 17:HEAP32[104]=$and45;$retval_0=0;label=18;break;case 18:STACKTOP=sp;return $retval_0|0}return 0}function _CpuWriteIO($State,$Address,$Value){$State=$State|0;$Address=$Address|0;$Value=$Value|0;var $Downlink=0,$Downlink3=0,$Downlink6=0,$4=0,$CycleCounter=0,$add$0=0,$DownruptTime=0,label=0;label=1;while(1)switch(label|0){case 1:_WriteIO($State,$Address,$Value);_ChannelOutput($State,$Address,$Value&32767);if(($Address|0)==28){label=2;break}else if(($Address|0)==29){label=3;break}else{label=4;break};case 2:$Downlink=$State+87112|0;HEAP32[$Downlink>>2]=HEAP32[$Downlink>>2]|1;label=4;break;case 3:$Downlink3=$State+87112|0;HEAP32[$Downlink3>>2]=HEAP32[$Downlink3>>2]|2;label=4;break;case 4:$Downlink6=$State+87112|0;if((HEAP32[$Downlink6>>2]|0)==3){label=5;break}else{label=6;break};case 5:$4=$State+87096|0;HEAP32[$4>>2]=HEAP32[$4>>2]|8;$CycleCounter=$State|0;$add$0=_i64Add(HEAP32[$CycleCounter>>2]|0,HEAP32[$CycleCounter+4>>2]|0,1706,0)|0;$DownruptTime=$State+87104|0;HEAP32[$DownruptTime>>2]=$add$0;HEAP32[$DownruptTime+4>>2]=tempRet0;HEAP32[$Downlink6>>2]=0;label=6;break;case 6:return}}function _CounterDINC($State,$CounterNum,$Counter){$State=$State|0;$CounterNum=$CounterNum|0;$Counter=$Counter|0;var $0=0,$inc=0,$_=0,$dec=0,$_16=0,$RetVal_2=0,$i_0=0,label=0;label=1;while(1)switch(label|0){case 1:$0=HEAP16[$Counter>>1]|0;if(($0<<16>>16|0)==0|($0<<16>>16|0)==32767){label=2;break}else{label=4;break};case 2:if(($CounterNum|0)==0){$i_0=$0;$RetVal_2=0;label=9;break}else{label=3;break};case 3:_ChannelOutput($State,$CounterNum|128,15);$i_0=$0;$RetVal_2=0;label=9;break;case 4:if(($0&16384)==0){label=7;break}else{label=5;break};case 5:$inc=$0+1&65535;$_=($inc<<16>>16==32767)<<31>>31;if(($CounterNum|0)==0){$i_0=$inc;$RetVal_2=$_;label=9;break}else{label=6;break};case 6:_ChannelOutput($State,$CounterNum|128,14);$i_0=$inc;$RetVal_2=$_;label=9;break;case 7:$dec=$0-1&65535;$_16=$dec<<16>>16==0|0;if(($CounterNum|0)==0){$i_0=$dec;$RetVal_2=$_16;label=9;break}else{label=8;break};case 8:_ChannelOutput($State,$CounterNum|128,13);$i_0=$dec;$RetVal_2=$_16;label=9;break;case 9:HEAP16[$Counter>>1]=$i_0;return $RetVal_2|0}return 0}function _UnprogrammedIncrement($State,$Counter,$IncType){$State=$State|0;$Counter=$Counter|0;$IncType=$IncType|0;var $and=0,$arrayidx1=0,$arrayidx2=0,label=0;label=1;while(1)switch(label|0){case 1:$and=$Counter&127;$arrayidx1=$State+8+($and<<1)|0;if((HEAP32[27042]|0)==0){label=3;break}else{label=2;break};case 2:$arrayidx2=99944+($and<<2)|0;HEAP32[$arrayidx2>>2]=(HEAP32[$arrayidx2>>2]|0)+1;label=3;break;case 3:switch($IncType|0){case 0:{label=4;break};case 1:case 17:{label=5;break};case 2:{label=8;break};case 3:case 19:{label=9;break};case 4:{label=12;break};case 5:{label=13;break};case 6:{label=14;break};default:{label=15;break}}break;case 4:_CounterPINC($arrayidx1)|0;label=15;break;case 5:if(($and-26|0)>>>0<3){label=6;break}else{label=7;break};case 6:_PushCduFifo($State,$and,$IncType);label=15;break;case 7:_CounterPCDU($arrayidx1)|0;label=15;break;case 8:_CounterMINC($arrayidx1)|0;label=15;break;case 9:if(($and-26|0)>>>0<3){label=10;break}else{label=11;break};case 10:_PushCduFifo($State,$and,$IncType);label=15;break;case 11:_CounterMCDU($arrayidx1)|0;label=15;break;case 12:_CounterDINC($State,$and,$arrayidx1)|0;label=15;break;case 13:_CounterSHINC($arrayidx1)|0;label=15;break;case 14:_CounterSHANC($arrayidx1)|0;label=15;break;case 15:return}}function _PushCduFifo($State,$Counter,$IncType){$State=$State|0;$Counter=$Counter|0;$IncType=$IncType|0;var $Interval_0$0=0,$Interval_0$1=0,$Base_0=0,$1=0,$CycleCounter=0,$2$1=0,$sub=0,$Size=0,$3=0,$Ptr=0,$CycleCounter12=0,$add13$0=0,$NextUpdate=0,$add17=0,$sub18=0,$sub22_sub18=0,$arrayidx25=0,$6=0,$inc35=0,label=0,tempVarArgs=0,sp=0;sp=STACKTOP;label=1;while(1)switch(label|0){case 1:if(($Counter-26|0)>>>0>2){label=14;break}else{label=2;break};case 2:if(($IncType|0)==3){label=3;break}else if(($IncType|0)==17){label=4;break}else if(($IncType|0)==19){label=5;break}else if(($IncType|0)==1){$Base_0=0;$Interval_0$1=0;$Interval_0$0=213;label=6;break}else{label=14;break};case 3:$Base_0=1073741824;$Interval_0$1=0;$Interval_0$0=213;label=6;break;case 4:$Base_0=-2147483648;$Interval_0$1=0;$Interval_0$0=13;label=6;break;case 5:$Base_0=-1073741824;$Interval_0$1=0;$Interval_0$0=13;label=6;break;case 6:$1=HEAP32[27304]|0;if(($1|0)==0){label=8;break}else{label=7;break};case 7:$CycleCounter=$State|0;$2$1=HEAP32[$CycleCounter+4>>2]|0;_fprintf($1|0,8,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+32|0,HEAP32[tempVarArgs>>2]=HEAP32[$CycleCounter>>2],HEAP32[tempVarArgs+8>>2]=$2$1,HEAP32[tempVarArgs+16>>2]=$Counter,HEAP32[tempVarArgs+24>>2]=$IncType,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;label=8;break;case 8:$sub=$Counter-26|0;$Size=109228+($sub*536|0)|0;$3=HEAP32[$Size>>2]|0;$Ptr=109224+($sub*536|0)|0;if(($3|0)==0){label=9;break}else{label=10;break};case 9:HEAP32[$Ptr>>2]=0;HEAP32[$Size>>2]=1;HEAP32[109248+($sub*536|0)>>2]=$Base_0|1;$CycleCounter12=$State|0;$add13$0=_i64Add(HEAP32[$CycleCounter12>>2]|0,HEAP32[$CycleCounter12+4>>2]|0,$Interval_0$0,$Interval_0$1)|0;$NextUpdate=109240+($sub*536|0)|0;HEAP32[$NextUpdate>>2]=$add13$0;HEAP32[$NextUpdate+4>>2]=tempRet0;HEAP32[109232+($sub*536|0)>>2]=1;label=14;break;case 10:$add17=(HEAP32[$Ptr>>2]|0)+$3|0;$sub18=$add17-1|0;$sub22_sub18=($sub18|0)>127?$add17-129|0:$sub18;$arrayidx25=109248+($sub*536|0)+($sub22_sub18<<2)|0;$6=HEAP32[$arrayidx25>>2]|0;if(($6&-1073741824|0)==($Base_0|0)){label=13;break}else{label=11;break};case 11:if(($3|0)>127){label=14;break}else{label=12;break};case 12:HEAP32[$Size>>2]=$3+1;$inc35=$sub22_sub18+1|0;HEAP32[109248+($sub*536|0)+((($inc35|0)>127?$sub22_sub18-127|0:$inc35)<<2)>>2]=$Base_0|1;label=14;break;case 13:HEAP32[$arrayidx25>>2]=$6+1;label=14;break;case 14:STACKTOP=sp;return}}function _agc_engine($State){$State=$State|0;var $AccPair=0,$Div16=0,$WordPair=0,$1=0,$CycleCounter=0,$3$1=0,$DownruptTime=0,$4$1=0,$CycleCounter2=0,$7$0=0,$7$1=0,$inc$0=0,$inc$1=0,$9$1=0,$10=0,$11=0,$add$0=0,$conv=0,$call=0,$20=0,$24=0,$25=0,$26=0,$30=0,$arrayidx70=0,$31=0,$35=0,$38=0,$41=0,$44=0,$48=0,$51=0,$arrayidx184=0,$arrayidx192=0,$_pr=0,$57=0,$_=0,$59=0,$sub204=0,$add219=0,$63=0,$sub224=0,$64=0,$_821=0,$_be=0,$cmp242=0,$sub246$0=0,$71$0=0,$71$1=0,$sub252$0=0,$sub252$1=0,$$etemp$23$1=0,$add256$0=0,$call258=0,$call260=0,$arrayidx265=0,$74=0,$arrayidx286=0,$76=0,$arrayidx307=0,$78=0,$arrayidx310=0,$79=0,$arrayidx313=0,$80=0,$arrayidx316=0,$81=0,$conv317746=0,$call319=0,$cmp321=0,$arrayidx325=0,$82=0,$call327=0,$83=0,$84=0,$conv345=0,$86=0,$call346=0,$and351=0,$arrayidx411=0,$93=0,$i408_0=0,$i408_1=0,$inc419=0,$_inc419=0,$arrayidx425=0,$sExtraCode_1=0,$Instruction_0=0,$and457=0,$and460=0,$and463=0,$98=0,$i469_0=0,$IndexValue489=0,$add495=0,$conv496=0,$shr501748=0,$conv510=0,$conv540=0,$call563=0,$and565=0,$conv572889=0,$conv547801=0,$call549=0,$conv572852=0,$call583=0,$conv572855=0,$Operand16_0853=0,$conv633=0,$arrayidx639=0,$conv640796=0,$call647=0,$call648=0,$and649=0,$Msw_0_off0=0,$call663=0,$call679=0,$cmp681=0,$arrayidx686=0,$conv687793=0,$call703=0,$Lsw_0859=0,$conv714794_sink=0,$cmp706860=0,$Lsw_0858=0,$call716=0,$and722=0,$Msw_2=0,$call736=0,$conv737=0,$and738=0,$conv792=0,$arrayidx811=0,$127=0,$arrayidx815=0,$call848=0,$129=0,$arrayidx851=0,$conv864=0,$call865=0,$arrayidx873=0,$call884=0,$conv889=0,$call890=0,$conv913=0,$call910=0,$conv937=0,$call955=0,$conv963=0,$call988=0,$conv997=0,$conv1019=0,$storemerge787=0,$conv1053=0,$arrayidx1059=0,$call1069=0,$arrayidx1077=0,$150=0,$arrayidx1080=0,$conv1099=0,$arrayidx1102=0,$arrayidx1112=0,$arrayidx1128=0,$155=0,$arrayidx1150=0,$conv1152=0,$conv1165=0,$call1190=0,$conv1217=0,$arrayidx1229=0,$call1249=0,$conv1258=0,$call1277=0,$164=0,$call1279=0,$Accumulator_1_off0=0,$conv1288=0,$call1303=0,$conv1323=0,$conv1348=0,$conv1367=0,$call1386=0,$conv1399=0,$arrayidx1410=0,$and1412=0,$call1422=0,$conv1427=0,$conv1437=0,$call1456=0,$conv1469=0,$arrayidx1480=0,$or1482=0,$call1492=0,$conv1497=0,$conv1507=0,$call1525=0,$conv1546=0,$WhereWord_1=0,$arrayidx1568=0,$arrayidx1571=0,$arrayidx1572=0,$call1574=0,$177=0,$call1577=0,$178=0,$call1580=0,$cmp1588=0,$cmp1592=0,$call1641=0,$call1643=0,$rem=0,$conv1688=0,$call1689=0,$and1704=0,$ui_0=0,$uj_0=0,$sub1708=0,$diff_0_off0=0,$conv1743=0,$arrayidx1762=0,$184=0,$arrayidx1766=0,$call1785=0,$arrayidx1788=0,$call1790=0,$conv1802=0,$call1803=0,$cmp1805=0,$Operand161801_0=0,$Increment_0=0,$call1826=0,$conv1844=0,$call1845=0,$cmp1847=0,$Operand161842_0=0,$and1858=0,$Increment1843_0=0,$call1876=0,$conv1891=0,$arrayidx1897=0,$call1907=0,$arrayidx1928=0,$add_ptr1975=0,$conv1980=0,$arrayidx1991=0,$call2010=0,$arrayidx2035=0,$add_ptr2086=0,$conv2091=0,$call2111=0,$213=0,$call2114=0,$Accumulator_2_off0=0,$conv2133=0,$call2135=0,$OtherOperand16_0=0,$conv2148=0,$call2187=0,$call2191=0,$arrayidx2197=0,$MsWord_0=0,$LsWord_0=0,$KeepExtraCode_0=0,$OutputChannel7=0,$and2220=0,$223=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+24|0;label=1;while(1)switch(label|0){case 1:$AccPair=sp|0;$Div16=sp+8|0;$WordPair=sp+16|0;$1=$State+87096|0;if((HEAP32[$1>>2]&8|0)==0){label=4;break}else{label=2;break};case 2:$CycleCounter=$State|0;$3$1=HEAP32[$CycleCounter+4>>2]|0;$DownruptTime=$State+87104|0;$4$1=HEAP32[$DownruptTime+4>>2]|0;if($3$1>>>0<$4$1>>>0|$3$1>>>0==$4$1>>>0&(HEAP32[$CycleCounter>>2]|0)>>>0<(HEAP32[$DownruptTime>>2]|0)>>>0){label=4;break}else{label=3;break};case 3:HEAP8[$State+87092|0]=1;HEAP32[$1>>2]=HEAP32[$1>>2]&-9;label=4;break;case 4:$CycleCounter2=$State|0;$7$0=HEAP32[$CycleCounter2>>2]|0;$7$1=HEAP32[$CycleCounter2+4>>2]|0;$inc$0=_i64Add($7$0,$7$1,1,0)|0;$inc$1=tempRet0;HEAP32[$CycleCounter2>>2]=$inc$0;HEAP32[$CycleCounter2+4>>2]=$inc$1;$9$1=HEAP32[27035]|0;if((HEAP32[27036]|0)==0|($inc$1>>>0<$9$1>>>0|$inc$1>>>0==$9$1>>>0&$inc$0>>>0<(HEAP32[27034]|0)>>>0)){label=6;break}else{label=5;break};case 5:$10=HEAP32[27038]|0;$11=HEAP16[$State+8+($10<<1)>>1]|0;$add$0=_i64Add($7$0,$7$1,42667,0)|0;HEAP32[27034]=$add$0;HEAP32[27035]=tempRet0;_ShiftToDeda($State,$10>>>6&7);_ShiftToDeda($State,(HEAP32[27038]|0)>>>3&7);_ShiftToDeda($State,HEAP32[27038]&7);_ShiftToDeda($State,0);$conv=$11<<16>>16;_ShiftToDeda($State,$conv>>>12&7);_ShiftToDeda($State,$conv>>>9&7);_ShiftToDeda($State,$conv>>>6&7);_ShiftToDeda($State,$conv>>>3&7);_ShiftToDeda($State,$conv&7);label=6;break;case 6:HEAP32[23942]=(HEAP32[23942]|0)+3;if((HEAP32[2160]|0)==0){label=7;break}else{label=8;break};case 7:_ChannelRoutine($State);label=8;break;case 8:HEAP32[2160]=(HEAP32[2160]|0)+1&8191;$call=_ChannelInput($State)|0;if((HEAP32[27040]|$call|0)==0){label=9;break}else{label=299;break};case 9:$20=HEAP32[$1>>2]|0;if(($20&7|0)==0){label=11;break}else{label=10;break};case 10:HEAP32[$1>>2]=$20+7&7|$20&-8;label=299;break;case 11:$24=$State+87092|0;$25=HEAP32[$24>>2]|0;if(($25&268435456|0)==0){label=14;break}else{label=12;break};case 12:$26=$25>>>29;if(($26|0)==0){label=14;break}else{label=13;break};case 13:HEAP32[$24>>2]=($26<<29)-536870912|$25&536870911;label=299;break;case 14:if((_ServiceCduFifo($State)|0)==0){label=15;break}else{label=299;break};case 15:$30=HEAP32[23942]|0;if(($30|0)>159){label=16;break}else{label=31;break};case 16:HEAP32[23942]=$30-160;$arrayidx70=$State+86032|0;if((_CounterPINC($arrayidx70)|0)==0){label=18;break}else{label=17;break};case 17:$31=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$31+1&7|$31&-8;_CounterPINC($State+86030|0)|0;label=18;break;case 18:if((HEAP16[$arrayidx70>>1]&15)==0){label=19;break}else{label=25;break};case 19:$35=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$35+1&7|$35&-8;if((_CounterPINC($State+50|0)|0)==0){label=21;break}else{label=20;break};case 20:$38=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$38+1&7|$38&-8;_CounterPINC($State+48|0)|0;label=21;break;case 21:$41=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$41+1&7|$41&-8;if((_CounterPINC($State+52|0)|0)==0){label=23;break}else{label=22;break};case 22:HEAP8[$State+87087|0]=1;label=23;break;case 23:$44=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$44+1&7|$44&-8;if((_CounterPINC($State+56|0)|0)==0){label=25;break}else{label=24;break};case 24:HEAP8[$State+87086|0]=1;label=25;break;case 25:if((HEAP16[$arrayidx70>>1]&15)==8){label=26;break}else{label=28;break};case 26:$48=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$48+1&7|$48&-8;if((_CounterPINC($State+54|0)|0)==0){label=28;break}else{label=27;break};case 27:HEAP8[$State+87088|0]=1;label=28;break;case 28:$51=HEAP32[$1>>2]|0;HEAP32[$1>>2]=$51+1&7|$51&-8;if((_CounterDINC($State,0,$State+58|0)|0)==0){label=299;break}else{label=29;break};case 29:if((HEAP16[$State+86046>>1]&16384)==0){label=299;break}else{label=30;break};case 30:HEAP8[$State+87085|0]=1;label=299;break;case 31:$arrayidx184=$State+86048|0;if((HEAP16[$arrayidx184>>1]&512)==0){label=36;break}else{label=32;break};case 32:$arrayidx192=$State+86|0;if((HEAP16[$arrayidx192>>1]|0)==0){label=36;break}else{label=33;break};case 33:$_pr=HEAP32[24984]|0;if(($_pr|0)==0){label=35;break}else{$57=$_pr;label=34;break};case 34:$_=($57|0)>2047?2047:$57;_ChannelOutput($State,127,HEAP32[23944]|$_);$59=HEAP32[24984]|0;$sub204=$59-$_|0;HEAP32[24984]=$sub204;if(($59|0)==($_|0)){label=35;break}else{$57=$sub204;label=34;break};case 35:HEAP32[24984]=HEAP16[$arrayidx192>>1]|0;HEAP16[$arrayidx192>>1]=0;HEAP32[23944]=HEAPU16[$arrayidx184>>1]<<6&30720;HEAP32[24982]=127994;label=36;break;case 36:$add219=(HEAP32[24982]|0)+6|0;HEAP32[24982]=$add219;if($add219>>>0>127999){$63=$add219;label=37;break}else{label=40;break};case 37:$sub224=$63-128e3|0;HEAP32[24982]=$sub224;$64=HEAP32[24984]|0;if(($64|0)==0){$_be=$sub224;label=39;break}else{label=38;break};case 38:$_821=($64|0)>1024?1024:$64;_ChannelOutput($State,127,HEAP32[23944]|$_821);HEAP32[24984]=(HEAP32[24984]|0)-$_821;$_be=HEAP32[24982]|0;label=39;break;case 39:if($_be>>>0>127999){$63=$_be;label=37;break}else{label=40;break};case 40:$cmp242=(HEAP16[$arrayidx184>>1]&28672)==0;if((HEAP32[24978]|0)!=0|$cmp242){label=42;break}else{label=41;break};case 41:$sub246$0=_i64Add(HEAP32[$CycleCounter2>>2]|0,HEAP32[$CycleCounter2+4>>2]|0,-6400,-1)|0;HEAP32[24980]=$sub246$0;HEAP32[24981]=tempRet0;label=42;break;case 42:if($cmp242){label=45;break}else{label=43;break};case 43:$71$0=HEAP32[24980]|0;$71$1=HEAP32[24981]|0;$sub252$0=_i64Subtract(HEAP32[$CycleCounter2>>2]|0,HEAP32[$CycleCounter2+4>>2]|0,$71$0,$71$1)|0;$sub252$1=tempRet0;$$etemp$23$1=0;if($sub252$1>>>0>$$etemp$23$1>>>0|$sub252$1>>>0==$$etemp$23$1>>>0&$sub252$0>>>0>6399>>>0){label=44;break}else{label=45;break};case 44:$add256$0=_i64Add($71$0,$71$1,6400,0)|0;HEAP32[24980]=$add256$0;HEAP32[24981]=tempRet0;HEAP32[24978]=_BurstOutput($State,16384,40,124)|0;$call258=_BurstOutput($State,8192,41,125)|0;HEAP32[24978]=HEAP32[24978]|$call258;$call260=_BurstOutput($State,4096,42,126)|0;HEAP32[24978]=HEAP32[24978]|$call260;label=45;break;case 45:$arrayidx265=$State+68|0;$74=HEAP16[$arrayidx265>>1]|0;if($74<<16>>16==0){label=48;break}else{label=46;break};case 46:if((HEAP16[$arrayidx184>>1]&1024)==0){label=48;break}else{label=47;break};case 47:_ChannelOutput($State,122,$74<<16>>16);HEAP16[$arrayidx265>>1]=0;label=48;break;case 48:$arrayidx286=$State+66|0;$76=HEAP16[$arrayidx286>>1]|0;if($76<<16>>16==0){label=51;break}else{label=49;break};case 49:if((HEAP16[$arrayidx184>>1]&2048)==0){label=51;break}else{label=50;break};case 50:_ChannelOutput($State,121,$76<<16>>16);HEAP16[$arrayidx286>>1]=0;label=51;break;case 51:$arrayidx307=$State+14|0;$78=HEAP16[$arrayidx307>>1]|0;$arrayidx310=$State+16|0;$79=HEAP16[$arrayidx310>>1]|0;$arrayidx313=$State+20|0;$80=HEAP16[$arrayidx313>>1]|0;$arrayidx316=$State+8|0;$81=HEAP16[$arrayidx316>>1]|0;$conv317746=$81&65535;$call319=_ValueOverflowed($conv317746)|0;$cmp321=$call319<<16>>16!=0;$arrayidx325=$State+18|0;$82=HEAP16[$arrayidx325>>1]|0;$call327=_FindMemoryWord($State,$82&65535)|0;$83=HEAP32[$24>>2]|0;if(($83&134217728|0)==0){label=53;break}else{label=52;break};case 52:$84=HEAP16[$State+38>>1]|0;$Instruction_0=$84&32767;$sExtraCode_1=($84&65535)>>>15;label=66;break;case 53:$conv345=$83>>>24&1;$86=HEAP16[$State+87082>>1]|0;$call346=_SignExtend($86)|0;$and351=(_OverflowCorrected(_AddSP16($call346,_SignExtend(HEAP16[$call327>>1]|0)|0)|0)|0)&32767;if((HEAP32[92]|0)==0){$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break}else{label=54;break};case 54:if(($83&117440512|0)==33554432&$86<<16>>16==0){label=55;break}else{$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break};case 55:if(($83&268435456|0)!=0|$cmp321){$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break}else{label=56;break};case 56:if((_ValueOverflowed(HEAP16[$State+10>>1]|0)|0)<<16>>16==0){label=57;break}else{$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break};case 57:if((_ValueOverflowed(HEAP16[$State+12>>1]|0)|0)<<16>>16==0){label=58;break}else{$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break};case 58:if(($and351<<16>>16|0)==6|($and351<<16>>16|0)==4|($and351<<16>>16|0)==3){$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break}else{label=59;break};case 59:$arrayidx411=$State+87084|0;$93=HEAP8[$arrayidx411]|0;if($93<<24>>24==0){label=60;break}else{$i408_0=$93<<24>>24;label=61;break};case 60:HEAP8[$arrayidx411]=10;$i408_0=10;label=61;break;case 61:$i408_1=$i408_0;label=62;break;case 62:$inc419=$i408_1+1|0;$_inc419=($inc419|0)>10?1:$inc419;$arrayidx425=$State+87084+$_inc419|0;if((HEAP8[$arrayidx425]|0)==0){label=65;break}else{label=63;break};case 63:if((HEAP32[368+($_inc419<<2)>>2]|0)==0){label=65;break}else{label=64;break};case 64:_BacktraceAdd($State,$_inc419);HEAP8[$arrayidx425]=0;HEAP8[$arrayidx411]=$_inc419&255;HEAP16[$State+34>>1]=$82;HEAP16[$State+38>>1]=$and351;HEAP32[$24>>2]=HEAP32[$24>>2]|67108864;HEAP32[23946]=($_inc419<<2)+2048;$KeepExtraCode_0=0;label=290;break;case 65:if(($_inc419|0)==($i408_0|0)){$Instruction_0=$and351;$sExtraCode_1=$conv345;label=66;break}else{$i408_1=$_inc419;label=62;break};case 66:$and457=$Instruction_0&4095;$and460=$Instruction_0&1023;$and463=$Instruction_0&511;$98=HEAP32[$24>>2]|0;if(($98&268435456|0)==0){label=67;break}else{label=69;break};case 67:$i469_0=HEAP32[(($98&16777216|0)==0?112:240)+(($Instruction_0&65535)>>>10<<2)>>2]|0;if(($i469_0|0)==0){label=70;break}else{label=68;break};case 68:HEAP32[$24>>2]=$98&268435455|$i469_0<<29|268435456;label=299;break;case 69:HEAP32[$24>>2]=$98&-268435457;label=70;break;case 70:$IndexValue489=$State+87082|0;HEAP16[$IndexValue489>>1]=0;HEAP32[$24>>2]=HEAP32[$24>>2]&-134217729;$add495=(HEAP16[$arrayidx325>>1]|0)+1|0;HEAP32[23946]=$add495;$conv496=$add495&65535;HEAP16[$arrayidx325>>1]=$conv496;$shr501748=($Instruction_0&65535)>>>9;switch(($sExtraCode_1<<16>>16==0?$shr501748:$shr501748|64)&65535|0){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:{label=71;break};case 8:case 9:{label=78;break};case 10:case 11:case 12:case 13:case 14:case 15:{label=87;break};case 16:case 17:{label=88;break};case 18:case 19:{label=112;break};case 20:case 21:{label=117;break};case 22:case 23:{label=120;break};case 24:case 25:case 26:case 27:case 28:case 29:case 30:case 31:{label=125;break};case 32:case 33:case 34:case 35:case 36:case 37:case 38:case 39:{label=129;break};case 40:case 41:{label=134;break};case 104:case 105:case 106:case 107:case 108:case 109:case 110:case 111:{label=138;break};case 42:case 43:{label=147;break};case 44:case 45:{label=155;break};case 46:case 47:{label=165;break};case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:{label=169;break};case 56:case 57:case 58:case 59:case 60:case 61:case 62:case 63:{label=175;break};case 64:{label=178;break};case 65:{label=181;break};case 66:{label=184;break};case 67:{label=187;break};case 68:{label=190;break};case 69:{label=193;break};case 70:{label=196;break};case 71:{label=199;break};case 72:case 73:{label=200;break};case 74:case 75:case 76:case 77:case 78:case 79:{label=215;break};case 80:case 81:{label=217;break};case 82:case 83:{label=226;break};case 84:case 85:{label=231;break};case 86:case 87:{label=239;break};case 88:case 89:case 90:case 91:case 92:case 93:case 94:case 95:{label=249;break};case 96:case 97:case 98:case 99:case 100:case 101:case 102:case 103:{label=260;break};case 112:case 113:{label=271;break};case 114:case 115:case 116:case 117:case 118:case 119:{label=277;break};case 120:case 121:case 122:case 123:case 124:case 125:case 126:case 127:{label=280;break};default:{$KeepExtraCode_0=0;label=290;break}}break;case 71:$conv510=$and457&65535;if(($and457<<16>>16|0)==3){label=72;break}else if(($and457<<16>>16|0)==4){label=73;break}else if(($and457<<16>>16|0)==6){label=74;break}else{label=75;break};case 72:HEAP32[$24>>2]=HEAP32[$24>>2]|33554432;$KeepExtraCode_0=0;label=290;break;case 73:HEAP32[$24>>2]=HEAP32[$24>>2]&-33554433;$KeepExtraCode_0=0;label=290;break;case 74:HEAP32[$24>>2]=HEAP32[$24>>2]|16777216;$KeepExtraCode_0=1;label=290;break;case 75:_BacktraceAdd($State,0);if($and457<<16>>16==2){label=77;break}else{label=76;break};case 76:HEAP16[$State+12>>1]=HEAP32[23946]&65535;label=77;break;case 77:HEAP32[23946]=$conv510;$KeepExtraCode_0=0;label=290;break;case 78:$conv540=$and460&65535;if(($and460&65535)<3){label=80;break}else{label=79;break};case 79:$call563=_FindMemoryWord($State,$conv540)|0;$and565=HEAP16[$call563>>1]&32767;HEAP16[$arrayidx316>>1]=_dabs($and565)|0;$conv572889=$and565&65535;_AssignFromPointer($State,$call563,$conv572889);$Operand16_0853=$and565;$conv572855=$conv572889;label=82;break;case 80:$conv547801=HEAPU16[$State+8+($conv540<<1)>>1]|0;$call549=_OverflowCorrected($conv547801)|0;HEAP16[$arrayidx316>>1]=(_odabs($conv547801)|0)&65535;$conv572852=$call549<<16>>16;_AssignFromPointer($State,$call327,$conv572852);$call583=_ValueOverflowed(HEAPU16[$State+8+($conv540<<1)>>1]|0)|0;if(($call583<<16>>16|0)==32766){label=81;break}else if(($call583<<16>>16|0)==1){$KeepExtraCode_0=0;label=290;break}else{$Operand16_0853=$call549;$conv572855=$conv572852;label=82;break};case 81:HEAP32[23946]=(HEAP32[23946]|0)+2;$KeepExtraCode_0=0;label=290;break;case 82:if(($Operand16_0853<<16>>16|0)==0){label=83;break}else if(($Operand16_0853<<16>>16|0)==32767){label=84;break}else{label=85;break};case 83:HEAP32[23946]=(HEAP32[23946]|0)+1;$KeepExtraCode_0=0;label=290;break;case 84:HEAP32[23946]=(HEAP32[23946]|0)+3;$KeepExtraCode_0=0;label=290;break;case 85:if(($conv572855&16384|0)==0){$KeepExtraCode_0=0;label=290;break}else{label=86;break};case 86:HEAP32[23946]=(HEAP32[23946]|0)+2;$KeepExtraCode_0=0;label=290;break;case 87:_BacktraceAdd($State,0);HEAP32[23946]=$and457&65535;$KeepExtraCode_0=0;label=290;break;case 88:$conv633=$and460&65535;if($and460<<16>>16==1){label=89;break}else{label=94;break};case 89:$arrayidx639=$State+10|0;$conv640796=HEAPU16[$arrayidx639>>1]|0;$call647=_AddSP16($conv640796,$conv640796)|0;$call648=_AddSP16($conv317746,$conv317746)|0;$and649=$call647&49152;if(($and649|0)==16384){label=90;break}else{label=91;break};case 90:$Msw_0_off0=(_AddSP16($call648,1)|0)&65535;label=93;break;case 91:if(($and649|0)==32768){label=92;break}else{$Msw_0_off0=$call648&65535;label=93;break};case 92:$Msw_0_off0=(_AddSP16($call648,_SignExtend(32766)|0)|0)&65535;label=93;break;case 93:$call663=_OverflowCorrected($call647)|0;HEAP16[$arrayidx316>>1]=$Msw_0_off0;HEAP16[$arrayidx639>>1]=(_SignExtend($call663)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 94:$call679=_FindMemoryWord($State,$conv633)|0;$cmp681=($and460&65535)<3;$arrayidx686=$State+10|0;$conv687793=HEAPU16[$arrayidx686>>1]|0;if($cmp681){label=95;break}else{label=96;break};case 95:$Lsw_0859=_AddSP16($conv687793,HEAPU16[$State+8+($conv633<<1)>>1]|0)|0;label=97;break;case 96:$call703=_AddSP16($conv687793,_SignExtend(HEAP16[$call679>>1]|0)|0)|0;if(($and460&65535)<4){$Lsw_0859=$call703;label=97;break}else{label=98;break};case 97:$Lsw_0858=$Lsw_0859;$cmp706860=1;$conv714794_sink=HEAPU16[$State+8+($conv633-1<<1)>>1]|0;label=99;break;case 98:$Lsw_0858=$call703;$cmp706860=0;$conv714794_sink=_SignExtend(HEAP16[$call679-2>>1]|0)|0;label=99;break;case 99:$call716=_AddSP16($conv317746,$conv714794_sink)|0;$and722=$Lsw_0858&49152;if(($and722|0)==16384){label=100;break}else if(($and722|0)==32768){label=101;break}else{$Msw_2=$call716;label=102;break};case 100:$Msw_2=_AddSP16($call716,1)|0;label=102;break;case 101:$Msw_2=_AddSP16($call716,_SignExtend(32766)|0)|0;label=102;break;case 102:$call736=_OverflowCorrected($Lsw_0858)|0;$conv737=$call736<<16>>16;$and738=$Msw_2&49152;if(($and738|0)==32768){label=103;break}else if(($and738|0)==16384){label=104;break}else{label=105;break};case 103:HEAP16[$arrayidx316>>1]=(_SignExtend(32766)|0)&65535;label=106;break;case 104:HEAP16[$arrayidx316>>1]=1;label=106;break;case 105:HEAP16[$arrayidx316>>1]=0;label=106;break;case 106:HEAP16[$arrayidx686>>1]=0;if($cmp681){label=107;break}else{label=108;break};case 107:HEAP16[$State+8+($conv633<<1)>>1]=(_SignExtend($call736)|0)&65535;label=109;break;case 108:_AssignFromPointer($State,$call679,$conv737);label=109;break;case 109:if($cmp706860){label=110;break}else{label=111;break};case 110:HEAP16[$State+8+($conv633-1<<1)>>1]=$Msw_2&65535;$KeepExtraCode_0=0;label=290;break;case 111:_AssignFromPointer($State,$call679-2|0,(_OverflowCorrected($Msw_2)|0)<<16>>16);$KeepExtraCode_0=0;label=290;break;case 112:$conv792=$and460&65535;if(($and460<<16>>16|0)==7){label=113;break}else if(($and460<<16>>16|0)==1){$KeepExtraCode_0=0;label=290;break}else{label=114;break};case 113:HEAP16[$State+10>>1]=0;$KeepExtraCode_0=0;label=290;break;case 114:if(($and460&65535)<3){label=115;break}else{label=116;break};case 115:$arrayidx811=$State+10|0;$127=HEAP16[$arrayidx811>>1]|0;$arrayidx815=$State+8+($conv792<<1)|0;HEAP16[$arrayidx811>>1]=HEAP16[$arrayidx815>>1]|0;HEAP16[$arrayidx815>>1]=$127;$KeepExtraCode_0=0;label=290;break;case 116:$call848=_FindMemoryWord($State,$conv792)|0;$129=HEAP16[$call848>>1]|0;$arrayidx851=$State+10|0;_AssignFromPointer($State,$call848,(_OverflowCorrected(HEAPU16[$arrayidx851>>1]|0)|0)<<16>>16);HEAP16[$arrayidx851>>1]=(_SignExtend($129)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 117:$conv864=$and460&65535;$call865=_FindMemoryWord($State,$conv864)|0;if(($and460&65535)<3){label=118;break}else{label=119;break};case 118:$arrayidx873=$State+8+($conv864<<1)|0;HEAP16[$arrayidx873>>1]=(_AddSP16(1,HEAPU16[$arrayidx873>>1]|0)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 119:$call884=_AddSP16(1,_SignExtend(HEAP16[$call865>>1]|0)|0)|0;_AssignFromPointer($State,$call865,(_OverflowCorrected($call884)|0)<<16>>16);_InterruptRequests($State,$and460,$call884);$KeepExtraCode_0=0;label=290;break;case 120:$conv889=$and460&65535;$call890=_FindMemoryWord($State,$conv889)|0;if($and460<<16>>16==0){label=121;break}else{label=122;break};case 121:HEAP16[$arrayidx316>>1]=(_AddSP16($conv317746,$conv317746)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 122:if(($and460&65535)<3){label=123;break}else{label=124;break};case 123:$conv913=(_AddSP16($conv317746,HEAPU16[$State+8+($conv889<<1)>>1]|0)|0)&65535;HEAP16[$arrayidx316>>1]=$conv913;HEAP16[$State+8+($conv889<<1)>>1]=$conv913;$KeepExtraCode_0=0;label=290;break;case 124:$call910=_AddSP16($conv317746,_SignExtend(HEAP16[$call890>>1]|0)|0)|0;HEAP16[$arrayidx316>>1]=$call910&65535;_AssignFromPointer($State,$call890,(_OverflowCorrected($call910)|0)<<16>>16);$KeepExtraCode_0=0;label=290;break;case 125:$conv937=$and457&65535;if($and457<<16>>16==0){$KeepExtraCode_0=0;label=290;break}else{label=126;break};case 126:if(($and457&65535)<3){label=127;break}else{label=128;break};case 127:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv937<<1)>>1]|0;$KeepExtraCode_0=0;label=290;break;case 128:$call955=_FindMemoryWord($State,$conv937)|0;HEAP16[$arrayidx316>>1]=(_SignExtend(HEAP16[$call955>>1]|0)|0)&65535;_AssignFromPointer($State,$call955,HEAP16[$call955>>1]|0);$KeepExtraCode_0=0;label=290;break;case 129:$conv963=$and457&65535;if($and457<<16>>16==0){label=130;break}else{label=131;break};case 130:HEAP16[$arrayidx316>>1]=~$81;$KeepExtraCode_0=0;label=290;break;case 131:if(($and457&65535)<3){label=132;break}else{label=133;break};case 132:HEAP16[$arrayidx316>>1]=~HEAP16[$State+8+($conv963<<1)>>1];$KeepExtraCode_0=0;label=290;break;case 133:$call988=_FindMemoryWord($State,$conv963)|0;HEAP16[$arrayidx316>>1]=(_SignExtend(_NegateSP(HEAP16[$call988>>1]|0)|0)|0)&65535;_AssignFromPointer($State,$call988,HEAP16[$call988>>1]|0);$KeepExtraCode_0=0;label=290;break;case 134:$conv997=$and460&65535;if($and460<<16>>16==15){label=139;break}else{label=135;break};case 135:if(($and460&65535)<3){label=136;break}else{label=137;break};case 136:HEAP16[$IndexValue489>>1]=_OverflowCorrected(HEAP16[$State+8+($conv997<<1)>>1]|0)|0;$KeepExtraCode_0=0;label=290;break;case 137:HEAP16[$IndexValue489>>1]=HEAP16[(_FindMemoryWord($State,$conv997)|0)>>1]|0;$KeepExtraCode_0=0;label=290;break;case 138:$conv1019=$and457&65535;if($and457<<16>>16==30){label=139;break}else{label=143;break};case 139:if((HEAP32[$24>>2]&67108864|0)==0){label=141;break}else{label=140;break};case 140:_BacktraceAdd($State,255);label=142;break;case 141:_BacktraceAdd($State,0);label=142;break;case 142:HEAP32[23946]=HEAP16[$State+34>>1]|0;HEAP32[$24>>2]=HEAP32[$24>>2]&-67108865;$KeepExtraCode_0=0;label=290;break;case 143:if(($and457&65535)<3){label=144;break}else{label=145;break};case 144:$storemerge787=_OverflowCorrected(HEAP16[$State+8+($conv1019<<1)>>1]|0)|0;label=146;break;case 145:$storemerge787=HEAP16[(_FindMemoryWord($State,$conv1019)|0)>>1]|0;label=146;break;case 146:HEAP16[$IndexValue489>>1]=$storemerge787;$KeepExtraCode_0=1;label=290;break;case 147:$conv1053=$and460&65535;if($and460<<16>>16==1){label=148;break}else{label=149;break};case 148:$arrayidx1059=$State+10|0;HEAP16[$arrayidx1059>>1]=(_SignExtend(_OverflowCorrected(HEAP16[$arrayidx1059>>1]|0)|0)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 149:$call1069=_FindMemoryWord($State,$conv1053)|0;if(($and460&65535)<3){label=150;break}else{label=151;break};case 150:$arrayidx1077=$State+8+($conv1053<<1)|0;$150=HEAP16[$arrayidx1077>>1]|0;$arrayidx1080=$State+10|0;HEAP16[$arrayidx1077>>1]=HEAP16[$arrayidx1080>>1]|0;HEAP16[$arrayidx1080>>1]=$150;label=152;break;case 151:$conv1099=(_SignExtend(HEAP16[$call1069>>1]|0)|0)&65535;$arrayidx1102=$State+10|0;_AssignFromPointer($State,$call1069,(_OverflowCorrected(HEAP16[$arrayidx1102>>1]|0)|0)<<16>>16);HEAP16[$arrayidx1102>>1]=$conv1099;label=152;break;case 152:$arrayidx1112=$State+10|0;HEAP16[$arrayidx1112>>1]=(_SignExtend(_OverflowCorrected(HEAP16[$arrayidx1112>>1]|0)|0)|0)&65535;if(($and460&65535)<4){label=153;break}else{label=154;break};case 153:$arrayidx1128=$State+8+($conv1053-1<<1)|0;$155=HEAP16[$arrayidx1128>>1]|0;HEAP16[$arrayidx1128>>1]=HEAP16[$arrayidx316>>1]|0;HEAP16[$arrayidx316>>1]=$155;$KeepExtraCode_0=0;label=290;break;case 154:$arrayidx1150=$call1069-2|0;$conv1152=(_SignExtend(HEAP16[$arrayidx1150>>1]|0)|0)&65535;_AssignFromPointer($State,$arrayidx1150,(_OverflowCorrected(HEAP16[$arrayidx316>>1]|0)|0)<<16>>16);HEAP16[$arrayidx316>>1]=$conv1152;$KeepExtraCode_0=0;label=290;break;case 155:$conv1165=$and460&65535;if(($and460<<16>>16|0)==0){label=156;break}else if(($and460<<16>>16|0)==5){label=158;break}else{label=160;break};case 156:if($cmp321){label=157;break}else{$KeepExtraCode_0=0;label=290;break};case 157:HEAP32[23946]=(HEAP32[23946]|0)+1;$KeepExtraCode_0=0;label=290;break;case 158:HEAP32[23946]=$conv317746&32767;if($cmp321){label=159;break}else{$KeepExtraCode_0=0;label=290;break};case 159:HEAP16[$arrayidx316>>1]=(_SignExtend($call319)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 160:if(($and460&65535)<3){label=161;break}else{label=162;break};case 161:HEAP16[$State+8+($conv1165<<1)>>1]=$81;label=163;break;case 162:$call1190=_FindMemoryWord($State,$conv1165)|0;_AssignFromPointer($State,$call1190,(_OverflowCorrected($conv317746)|0)<<16>>16);label=163;break;case 163:if($cmp321){label=164;break}else{$KeepExtraCode_0=0;label=290;break};case 164:HEAP16[$arrayidx316>>1]=(_SignExtend($call319)|0)&65535;HEAP32[23946]=(HEAP32[23946]|0)+1;$KeepExtraCode_0=0;label=290;break;case 165:$conv1217=$and460&65535;if($and460<<16>>16==0){$KeepExtraCode_0=0;label=290;break}else{label=166;break};case 166:if(($and460&65535)<3){label=167;break}else{label=168;break};case 167:$arrayidx1229=$State+8+($conv1217<<1)|0;HEAP16[$arrayidx316>>1]=HEAP16[$arrayidx1229>>1]|0;HEAP16[$arrayidx1229>>1]=$81;$KeepExtraCode_0=0;label=290;break;case 168:$call1249=_FindMemoryWord($State,$conv1217)|0;HEAP16[$arrayidx316>>1]=(_SignExtend(HEAP16[$call1249>>1]|0)|0)&65535;_AssignFromPointer($State,$call1249,(_OverflowCorrected($conv317746)|0)<<16>>16);$KeepExtraCode_0=0;label=290;break;case 169:$conv1258=$and457&65535;if($and457<<16>>16==0){label=170;break}else{label=171;break};case 170:$Accumulator_1_off0=(_AddSP16($conv317746,$conv317746)|0)&65535;label=174;break;case 171:if(($and457&65535)<3){label=172;break}else{label=173;break};case 172:$Accumulator_1_off0=(_AddSP16($conv317746,HEAPU16[$State+8+($conv1258<<1)>>1]|0)|0)&65535;label=174;break;case 173:$call1277=_FindMemoryWord($State,$conv1258)|0;$164=HEAP16[$call1277>>1]|0;$call1279=_AddSP16($conv317746,_SignExtend($164)|0)|0;_AssignFromPointer($State,$call1277,$164<<16>>16);$Accumulator_1_off0=$call1279&65535;label=174;break;case 174:HEAP16[$arrayidx316>>1]=$Accumulator_1_off0;$KeepExtraCode_0=0;label=290;break;case 175:$conv1288=$and457&65535;if(($and457&65535)<3){label=176;break}else{label=177;break};case 176:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1288<<1)>>1]&$81;$KeepExtraCode_0=0;label=290;break;case 177:$call1303=_OverflowCorrected($conv317746)|0;HEAP16[$arrayidx316>>1]=$call1303;HEAP16[$arrayidx316>>1]=(_SignExtend(HEAP16[(_FindMemoryWord($State,$conv1288)|0)>>1]&$call1303)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 178:$conv1323=$and463&65535;if(($and463-1&65535)<2){label=179;break}else{label=180;break};case 179:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1323<<1)>>1]|0;$KeepExtraCode_0=0;label=290;break;case 180:HEAP16[$arrayidx316>>1]=(_SignExtend((_ReadIO($State,$conv1323)|0)&65535)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 181:$conv1348=$and463&65535;if(($and463-1&65535)<2){label=182;break}else{label=183;break};case 182:HEAP16[$State+8+($conv1348<<1)>>1]=$81;$KeepExtraCode_0=0;label=290;break;case 183:_CpuWriteIO($State,$conv1348,(_OverflowCorrected($conv317746)|0)<<16>>16);$KeepExtraCode_0=0;label=290;break;case 184:$conv1367=$and463&65535;if(($and463-1&65535)<2){label=185;break}else{label=186;break};case 185:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1367<<1)>>1]&$81;$KeepExtraCode_0=0;label=290;break;case 186:$call1386=_OverflowCorrected($conv317746)|0;HEAP16[$arrayidx316>>1]=(_SignExtend($call1386&65535&(_ReadIO($State,$conv1367)|0)&65535)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 187:$conv1399=$and463&65535;if(($and463-1&65535)<2){label=188;break}else{label=189;break};case 188:$arrayidx1410=$State+8+($conv1399<<1)|0;$and1412=HEAP16[$arrayidx1410>>1]&$81;HEAP16[$arrayidx1410>>1]=$and1412;HEAP16[$arrayidx316>>1]=$and1412;$KeepExtraCode_0=0;label=290;break;case 189:$call1422=_OverflowCorrected($conv317746)|0;$conv1427=$call1422&65535&(_ReadIO($State,$conv1399)|0)&65535;_CpuWriteIO($State,$conv1399,$conv1427<<16>>16);HEAP16[$arrayidx316>>1]=(_SignExtend($conv1427)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 190:$conv1437=$and463&65535;if(($and463-1&65535)<2){label=191;break}else{label=192;break};case 191:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1437<<1)>>1]|$81;$KeepExtraCode_0=0;label=290;break;case 192:$call1456=_OverflowCorrected($conv317746)|0;HEAP16[$arrayidx316>>1]=(_SignExtend(($call1456&65535|(_ReadIO($State,$conv1437)|0))&65535)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 193:$conv1469=$and463&65535;if(($and463-1&65535)<2){label=194;break}else{label=195;break};case 194:$arrayidx1480=$State+8+($conv1469<<1)|0;$or1482=HEAP16[$arrayidx1480>>1]|$81;HEAP16[$arrayidx1480>>1]=$or1482;HEAP16[$arrayidx316>>1]=$or1482;$KeepExtraCode_0=0;label=290;break;case 195:$call1492=_OverflowCorrected($conv317746)|0;$conv1497=($call1492&65535|(_ReadIO($State,$conv1469)|0))&65535;_CpuWriteIO($State,$conv1469,$conv1497<<16>>16);HEAP16[$arrayidx316>>1]=(_SignExtend($conv1497)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 196:$conv1507=$and463&65535;if(($and463-1&65535)<2){label=197;break}else{label=198;break};case 197:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1507<<1)>>1]^$81;$KeepExtraCode_0=0;label=290;break;case 198:$call1525=_OverflowCorrected($conv317746)|0;HEAP16[$arrayidx316>>1]=(_SignExtend(($call1525&65535^(_ReadIO($State,$conv1507)|0))&65535)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 199:HEAP16[$State+34>>1]=$conv496;HEAP32[$24>>2]=HEAP32[$24>>2]|67108864;_BacktraceAdd($State,0);HEAP32[23946]=0;$KeepExtraCode_0=0;label=290;break;case 200:$conv1546=$and460&65535;if($and460<<16>>16==0){label=201;break}else{label=202;break};case 201:HEAP16[$Div16>>1]=_OverflowCorrected($conv317746)|0;$WhereWord_1=$Div16;label=205;break;case 202:if(($and460&65535)<3){label=203;break}else{label=204;break};case 203:HEAP16[$Div16>>1]=_OverflowCorrected(HEAP16[$State+8+($conv1546<<1)>>1]|0)|0;$WhereWord_1=$Div16;label=205;break;case 204:$WhereWord_1=_FindMemoryWord($State,$conv1546)|0;label=205;break;case 205:$arrayidx1568=$AccPair|0;HEAP16[$arrayidx1568>>1]=_OverflowCorrected($conv317746)|0;$arrayidx1571=$State+10|0;$arrayidx1572=$AccPair+2|0;HEAP16[$arrayidx1572>>1]=HEAP16[$arrayidx1571>>1]|0;$call1574=_SpToDecent($arrayidx1572)|0;_DecentToSp($call1574,$arrayidx1572);$177=HEAP16[$arrayidx1568>>1]|0;$call1577=_AbsSP($177)|0;$178=HEAP16[$WhereWord_1>>1]|0;$call1580=_AbsSP($178)|0;if($call1577<<16>>16>$call1580<<16>>16){label=207;break}else{label=206;break};case 206:$cmp1588=$call1577<<16>>16==$call1580<<16>>16;$cmp1592=(_AbsSP(HEAP16[$arrayidx1572>>1]|0)|0)<<16>>16==0;if($cmp1592|$cmp1588^1){label=208;break}else{label=207;break};case 207:HEAP16[$arrayidx1571>>1]=(_random()|0)&65535;HEAP16[$arrayidx316>>1]=(_random()|0)&65535;$KeepExtraCode_0=0;label=290;break;case 208:if($cmp1588&$cmp1592){label=209;break}else{label=210;break};case 209:HEAP16[$arrayidx1571>>1]=(_SignExtend($178)|0)&65535;HEAP16[$arrayidx316>>1]=(_SignExtend($177<<16>>16==$178<<16>>16?16383:16384)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 210:$call1641=_agc2cpu2($call1574)|0;$call1643=_agc2cpu($178<<16>>16)|0;$rem=($call1641|0)%($call1643|0)|0;HEAP16[$arrayidx316>>1]=(_SignExtend((_cpu2agc(($call1641|0)/($call1643|0)|0)|0)&65535)|0)&65535;if(($rem|0)==0){label=211;break}else{label=214;break};case 211:if(($call1641|0)>-1){label=212;break}else{label=213;break};case 212:HEAP16[$arrayidx1571>>1]=0;$KeepExtraCode_0=0;label=290;break;case 213:HEAP16[$arrayidx1571>>1]=(_SignExtend(32767)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 214:HEAP16[$arrayidx1571>>1]=(_SignExtend((_cpu2agc($rem)|0)&65535)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 215:if(($81<<16>>16|0)==(-1|0)|($81<<16>>16|0)==0){label=216;break}else{$KeepExtraCode_0=0;label=290;break};case 216:_BacktraceAdd($State,0);HEAP32[23946]=$and457&65535;$KeepExtraCode_0=0;label=290;break;case 217:$conv1688=$and460&65535;$call1689=_FindMemoryWord($State,$conv1688)|0;if(($and460&65535)<3){label=218;break}else{label=219;break};case 218:$uj_0=HEAPU16[$State+8+($conv1688<<1)>>1]|0;$ui_0=$conv317746;label=220;break;case 219:$and1704=(_OverflowCorrected($conv317746)|0)&32767;$uj_0=HEAP16[$call1689>>1]&32767;$ui_0=$and1704;label=220;break;case 220:$sub1708=$ui_0-$uj_0|0;if(($sub1708|0)<0){label=221;break}else{$diff_0_off0=$sub1708&65535;label=222;break};case 221:$diff_0_off0=$sub1708+65535&65535;label=222;break;case 222:if($and460<<16>>16==2){label=223;break}else{label=224;break};case 223:HEAP16[$arrayidx316>>1]=$diff_0_off0;$KeepExtraCode_0=0;label=290;break;case 224:HEAP16[$arrayidx316>>1]=(_SignExtend($diff_0_off0&32767)|0)&65535;if(($and460-16&65535)<4){label=225;break}else{$KeepExtraCode_0=0;label=290;break};case 225:_AssignFromPointer($State,$call1689,HEAP16[$call1689>>1]|0);$KeepExtraCode_0=0;label=290;break;case 226:$conv1743=$and460&65535;if(($and460<<16>>16|0)==7){label=227;break}else if(($and460<<16>>16|0)==2){$KeepExtraCode_0=0;label=290;break}else{label=228;break};case 227:HEAP16[$State+12>>1]=0;$KeepExtraCode_0=0;label=290;break;case 228:if(($and460&65535)<3){label=229;break}else{label=230;break};case 229:$arrayidx1762=$State+12|0;$184=HEAP16[$arrayidx1762>>1]|0;$arrayidx1766=$State+8+($conv1743<<1)|0;HEAP16[$arrayidx1762>>1]=HEAP16[$arrayidx1766>>1]|0;HEAP16[$arrayidx1766>>1]=$184;$KeepExtraCode_0=0;label=290;break;case 230:$call1785=_FindMemoryWord($State,$conv1743)|0;$arrayidx1788=$State+12|0;$call1790=_OverflowCorrected(HEAP16[$arrayidx1788>>1]|0)|0;HEAP16[$arrayidx1788>>1]=(_SignExtend(HEAP16[$call1785>>1]|0)|0)&65535;_AssignFromPointer($State,$call1785,$call1790<<16>>16);$KeepExtraCode_0=0;label=290;break;case 231:$conv1802=$and460&65535;$call1803=_FindMemoryWord($State,$conv1802)|0;$cmp1805=($and460&65535)<3;if($cmp1805){label=232;break}else{label=233;break};case 232:$Operand161801_0=HEAP16[$State+8+($conv1802<<1)>>1]|0;label=234;break;case 233:$Operand161801_0=_SignExtend(HEAP16[$call1803>>1]|0)|0;label=234;break;case 234:if(($Operand161801_0&32768|0)==0){$Increment_0=1;label=236;break}else{label=235;break};case 235:$Increment_0=(_SignExtend(32766)|0)&65535;label=236;break;case 236:$call1826=_AddSP16($Increment_0,$Operand161801_0&65535)|0;if($cmp1805){label=237;break}else{label=238;break};case 237:HEAP16[$State+8+($conv1802<<1)>>1]=$call1826&65535;$KeepExtraCode_0=0;label=290;break;case 238:_AssignFromPointer($State,$call1803,(_OverflowCorrected($call1826)|0)<<16>>16);_InterruptRequests($State,$and460,$call1826);$KeepExtraCode_0=0;label=290;break;case 239:$conv1844=$and460&65535;$call1845=_FindMemoryWord($State,$conv1844)|0;$cmp1847=($and460&65535)<3;if($cmp1847){label=240;break}else{label=241;break};case 240:$Operand161842_0=HEAP16[$State+8+($conv1844<<1)>>1]|0;label=242;break;case 241:$Operand161842_0=_SignExtend(HEAP16[$call1845>>1]|0)|0;label=242;break;case 242:$and1858=$Operand161842_0&65535;if(($and1858|0)==0){$KeepExtraCode_0=0;label=290;break}else{label=243;break};case 243:if(($and1858|0)==(_SignExtend(32767)|0)){$KeepExtraCode_0=0;label=290;break}else{label=244;break};case 244:if(($Operand161842_0&32768|0)==0){label=245;break}else{$Increment1843_0=1;label=246;break};case 245:$Increment1843_0=(_SignExtend(32766)|0)&65535;label=246;break;case 246:$call1876=_AddSP16($Increment1843_0,$and1858)|0;if($cmp1847){label=247;break}else{label=248;break};case 247:HEAP16[$State+8+($conv1844<<1)>>1]=$call1876&65535;$KeepExtraCode_0=0;label=290;break;case 248:_AssignFromPointer($State,$call1845,(_OverflowCorrected($call1876)|0)<<16>>16);$KeepExtraCode_0=0;label=290;break;case 249:$conv1891=$and457&65535;if($and457<<16>>16==1){label=250;break}else{label=251;break};case 250:$arrayidx1897=$State+10|0;HEAP16[$arrayidx1897>>1]=(_SignExtend(_OverflowCorrected(HEAP16[$arrayidx1897>>1]|0)|0)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 251:$call1907=_FindMemoryWord($State,$conv1891)|0;if(($and457&65535)<3){label=252;break}else{label=253;break};case 252:HEAP16[$State+10>>1]=HEAP16[$State+8+($conv1891<<1)>>1]|0;label=254;break;case 253:HEAP16[$State+10>>1]=(_SignExtend(HEAP16[$call1907>>1]|0)|0)&65535;label=254;break;case 254:$arrayidx1928=$State+10|0;HEAP16[$arrayidx1928>>1]=(_SignExtend(_OverflowCorrected(HEAP16[$arrayidx1928>>1]|0)|0)|0)&65535;if(($and457&65535)<4){label=255;break}else{label=256;break};case 255:HEAP16[$arrayidx316>>1]=HEAP16[$State+8+($conv1891-1<<1)>>1]|0;$KeepExtraCode_0=0;label=290;break;case 256:HEAP16[$arrayidx316>>1]=(_SignExtend(HEAP16[$call1907-2>>1]|0)|0)&65535;if(($and457-16&65535)<4){label=257;break}else{label=258;break};case 257:_AssignFromPointer($State,$call1907,HEAP16[$call1907>>1]|0);label=258;break;case 258:if(($and457-17&65535)<4){label=259;break}else{$KeepExtraCode_0=0;label=290;break};case 259:$add_ptr1975=$call1907-2|0;_AssignFromPointer($State,$add_ptr1975,HEAP16[$add_ptr1975>>1]|0);$KeepExtraCode_0=0;label=290;break;case 260:$conv1980=$and457&65535;if($and457<<16>>16==1){label=261;break}else{label=262;break};case 261:HEAP16[$arrayidx316>>1]=~$81;$arrayidx1991=$State+10|0;HEAP16[$arrayidx1991>>1]=(_SignExtend(_OverflowCorrected(~HEAP16[$arrayidx1991>>1]<<16>>16)|0)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 262:$call2010=_FindMemoryWord($State,$conv1980)|0;if(($and457&65535)<3){label=263;break}else{label=264;break};case 263:HEAP16[$State+10>>1]=~HEAP16[$State+8+($conv1980<<1)>>1];label=265;break;case 264:HEAP16[$State+10>>1]=((_SignExtend(HEAP16[$call2010>>1]|0)|0)^65535)&65535;label=265;break;case 265:$arrayidx2035=$State+10|0;HEAP16[$arrayidx2035>>1]=(_SignExtend(_OverflowCorrected(HEAP16[$arrayidx2035>>1]|0)|0)|0)&65535;if(($and457&65535)<4){label=266;break}else{label=267;break};case 266:HEAP16[$arrayidx316>>1]=~HEAP16[$State+8+($conv1980-1<<1)>>1];$KeepExtraCode_0=0;label=290;break;case 267:HEAP16[$arrayidx316>>1]=((_SignExtend(HEAP16[$call2010-2>>1]|0)|0)^65535)&65535;if(($and457-16&65535)<4){label=268;break}else{label=269;break};case 268:_AssignFromPointer($State,$call2010,HEAP16[$call2010>>1]|0);label=269;break;case 269:if(($and457-17&65535)<4){label=270;break}else{$KeepExtraCode_0=0;label=290;break};case 270:$add_ptr2086=$call2010-2|0;_AssignFromPointer($State,$add_ptr2086,HEAP16[$add_ptr2086>>1]|0);$KeepExtraCode_0=0;label=290;break;case 271:$conv2091=$and460&65535;if($and460<<16>>16==0){label=272;break}else{label=273;break};case 272:$Accumulator_2_off0=(_SignExtend(32767)|0)&65535;label=276;break;case 273:if(($and460&65535)<3){label=274;break}else{label=275;break};case 274:$Accumulator_2_off0=(_AddSP16($conv317746,HEAPU16[$State+8+($conv2091<<1)>>1]^65535)|0)&65535;label=276;break;case 275:$call2111=_FindMemoryWord($State,$conv2091)|0;$213=HEAP16[$call2111>>1]|0;$call2114=_AddSP16($conv317746,_SignExtend(_NegateSP($213)|0)|0)|0;_AssignFromPointer($State,$call2111,$213<<16>>16);$Accumulator_2_off0=$call2114&65535;label=276;break;case 276:HEAP16[$arrayidx316>>1]=$Accumulator_2_off0;$KeepExtraCode_0=0;label=290;break;case 277:if($81<<16>>16==0){label=279;break}else{label=278;break};case 278:if(($conv317746&32768|0)==0){$KeepExtraCode_0=0;label=290;break}else{label=279;break};case 279:_BacktraceAdd($State,0);HEAP32[23946]=$and457&65535;$KeepExtraCode_0=0;label=290;break;case 280:$conv2133=$and457&65535;$call2135=_OverflowCorrected($conv317746)|0;if(($and457&65535)<3){label=281;break}else{label=282;break};case 281:$OtherOperand16_0=_OverflowCorrected(HEAP16[$State+8+($conv2133<<1)>>1]|0)|0;label=283;break;case 282:$OtherOperand16_0=HEAP16[(_FindMemoryWord($State,$conv2133)|0)>>1]|0;label=283;break;case 283:$conv2148=$OtherOperand16_0<<16>>16;if(($OtherOperand16_0<<16>>16|0)==0|($OtherOperand16_0<<16>>16|0)==32767){$LsWord_0=0;$MsWord_0=0;label=289;break}else{label=284;break};case 284:if(($call2135<<16>>16|0)==0){label=285;break}else if(($call2135<<16>>16|0)==32767){label=286;break}else{label=288;break};case 285:if(($conv2148&16384|0)==0){label=287;break}else{$LsWord_0=32767;$MsWord_0=32767;label=289;break};case 286:if(($conv2148&16384|0)==0){$LsWord_0=32767;$MsWord_0=32767;label=289;break}else{label=287;break};case 287:$LsWord_0=0;$MsWord_0=0;label=289;break;case 288:$call2187=_agc2cpu(_SignExtend($call2135)|0)|0;$call2191=_cpu2agc2(Math_imul(_agc2cpu(_SignExtend($OtherOperand16_0)|0)|0,$call2187)|0)|0;$arrayidx2197=$WordPair+2|0;_DecentToSp(($call2191&268435456|0)==0?$call2191:$call2191|536870912,$arrayidx2197);$LsWord_0=HEAP16[$arrayidx2197>>1]|0;$MsWord_0=HEAP16[$WordPair>>1]|0;label=289;break;case 289:HEAP16[$arrayidx316>>1]=(_SignExtend($MsWord_0)|0)&65535;HEAP16[$State+10>>1]=(_SignExtend($LsWord_0)|0)&65535;$KeepExtraCode_0=0;label=290;break;case 290:if((HEAP32[$24>>2]&268435456|0)==0){label=291;break}else{label=299;break};case 291:HEAP16[$State+22>>1]=0;$OutputChannel7=$State+87048|0;$and2220=HEAP16[$OutputChannel7>>1]&112;HEAP16[$OutputChannel7>>1]=$and2220;HEAP16[$State+86038>>1]=$and2220;HEAP16[$arrayidx325>>1]=HEAP32[23946]&65535;if(($KeepExtraCode_0|0)==0){label=292;break}else{label=293;break};case 292:HEAP32[$24>>2]=HEAP32[$24>>2]&-16777217;label=293;break;case 293:$223=HEAP16[$arrayidx313>>1]|0;if($80<<16>>16==$223<<16>>16){label=295;break}else{label=294;break};case 294:HEAP16[$arrayidx310>>1]=$223&31744;HEAP16[$arrayidx307>>1]=HEAP16[$arrayidx313>>1]<<8&1792;label=298;break;case 295:if($78<<16>>16==(HEAP16[$arrayidx307>>1]|0)){label=296;break}else{label=297;break};case 296:if($79<<16>>16==(HEAP16[$arrayidx310>>1]|0)){label=298;break}else{label=297;break};case 297:HEAP16[$arrayidx313>>1]=(HEAPU16[$arrayidx307>>1]|0)>>>8&7|HEAP16[$arrayidx310>>1]&31744;label=298;break;case 298:HEAP16[$arrayidx307>>1]=HEAP16[$arrayidx307>>1]&1792;HEAP16[$arrayidx310>>1]=HEAP16[$arrayidx310>>1]&31744;HEAP16[$arrayidx313>>1]=HEAP16[$arrayidx313>>1]&31751;label=299;break;case 299:STACKTOP=sp;return 0}return 0}function _ValueOverflowed($Value){$Value=$Value|0;var $and=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$and=$Value&49152;if(($and|0)==32768){label=2;break}else if(($and|0)==16384){$retval_0=1;label=4;break}else{label=3;break};case 2:$retval_0=32766;label=4;break;case 3:$retval_0=0;label=4;break;case 4:return $retval_0|0}return 0}function _odabs($Input){$Input=$Input|0;var $Input_addr_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($Input&32768|0)==0){$Input_addr_0=$Input;label=3;break}else{label=2;break};case 2:$Input_addr_0=$Input&65535^65535;label=3;break;case 3:return(($Input_addr_0|0)>1?$Input_addr_0-1|0:0)|0}return 0}function _dabs($Input){$Input=$Input|0;var $Input_addr_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($Input&16384)==0){$Input_addr_0=$Input;label=3;break}else{label=2;break};case 2:$Input_addr_0=$Input&16383^16383;label=3;break;case 3:return($Input_addr_0<<16>>16>1?$Input_addr_0-1&65535:0)|0}return 0}function _NegateSP($Value){$Value=$Value|0;return $Value&32767^32767|0}function _AbsSP($Value){$Value=$Value|0;var $retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($Value&16384)==0){$retval_0=$Value;label=3;break}else{label=2;break};case 2:$retval_0=$Value&32767^32767;label=3;break;case 3:return $retval_0|0}return 0}function _agc2cpu2($Input){$Input=$Input|0;var $and2=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$and2=$Input&268435455;if(($Input&268435456|0)==0){$retval_0=$and2;label=3;break}else{label=2;break};case 2:$retval_0=-($and2^268435455)|0;label=3;break;case 3:return $retval_0|0}return 0}function _agc2cpu($Input){$Input=$Input|0;var $and2=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$and2=$Input&16383;if(($Input&16384|0)==0){$retval_0=$and2;label=3;break}else{label=2;break};case 2:$retval_0=-($and2^16383)|0;label=3;break;case 3:return $retval_0|0}return 0}function _cpu2agc($Input){$Input=$Input|0;return(($Input|0)<0?$Input+32767|0:$Input)&32767|0}function _cpu2agc2($Input){$Input=$Input|0;var $retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:if(($Input|0)<0){label=2;break}else{label=3;break};case 2:$retval_0=-$Input&268435455^536870911;label=4;break;case 3:$retval_0=$Input&268435455;label=4;break;case 4:return $retval_0|0}return 0}function _FindMemoryWord($State,$Address12){$State=$State|0;$Address12=$Address12|0;var $and=0,$shr3522=0,$and36=0,$AdjustmentFB_0=0,$and52=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$and=$Address12&4095;if($and>>>0<256){label=2;break}else{label=3;break};case 2:$retval_0=$State+8+(($Address12&255)<<1)|0;label=16;break;case 3:if($and>>>0<512){label=4;break}else{label=5;break};case 4:$retval_0=$State+520+(($Address12&255)<<1)|0;label=16;break;case 5:if($and>>>0<768){label=6;break}else{label=7;break};case 6:$retval_0=$State+1032+(($Address12&255)<<1)|0;label=16;break;case 7:if($and>>>0<1024){label=8;break}else{label=9;break};case 8:$retval_0=$State+8+(((HEAPU16[$State+14>>1]|0)>>>8&7)<<9)+(($Address12&255)<<1)|0;label=16;break;case 9:if($and>>>0<2048){label=10;break}else{label=13;break};case 10:$shr3522=(HEAPU16[$State+16>>1]|0)>>>10;$and36=$shr3522&31;if(($shr3522&24|0)==24){label=11;break}else{$AdjustmentFB_0=$and36;label=12;break};case 11:$AdjustmentFB_0=(HEAP16[$State+87048>>1]&64)==0?$and36:$and36+8|0;label=12;break;case 12:$retval_0=$State+4104+($AdjustmentFB_0<<11)+(($Address12&1023)<<1)|0;label=16;break;case 13:$and52=$Address12&1023;if($and>>>0<3072){label=14;break}else{label=15;break};case 14:$retval_0=$State+8200+($and52<<1)|0;label=16;break;case 15:$retval_0=$State+10248+($and52<<1)|0;label=16;break;case 16:return $retval_0|0}return 0}function _Assign($State,$Bank,$Offset,$Value){$State=$State|0;$Bank=$Bank|0;$Offset=$Offset|0;$Value=$Value|0;var $arrayidx8=0,$extract_t=0,$shr35=0,$shr2434=0,$and30=0,$Value_addr_0_off0=0,$Value_addr_0_off049=0,label=0;label=1;while(1)switch(label|0){case 1:if($Bank>>>0>7|$Offset>>>0>255){label=21;break}else{label=2;break};case 2:if((HEAP32[27042]|0)==0){label=4;break}else{label=3;break};case 3:$arrayidx8=99944+($Bank<<10)+($Offset<<2)|0;HEAP32[$arrayidx8>>2]=(HEAP32[$arrayidx8>>2]|0)+1;label=4;break;case 4:$extract_t=$Value&65535;if(($Bank|0)==0){label=5;break}else{label=20;break};case 5:switch($Offset|0){case 5:{label=6;break};case 16:{label=7;break};case 17:{label=10;break};case 18:{label=13;break};case 19:{label=16;break};case 7:{$Value_addr_0_off049=0;label=18;break};default:{$Value_addr_0_off0=$extract_t;label=17;break}}break;case 6:HEAP32[23946]=$Value&4095;$Value_addr_0_off049=$extract_t;label=18;break;case 7:$shr35=$Value>>>1&16383;if(($Value&1|0)==0){label=9;break}else{label=8;break};case 8:$Value_addr_0_off0=($shr35|16384)&65535;label=17;break;case 9:$Value_addr_0_off049=$shr35&65535;label=18;break;case 10:$shr2434=$Value>>>1&16383;if(($Value&16384|0)==0){label=12;break}else{label=11;break};case 11:$Value_addr_0_off0=($shr2434|16384)&65535;label=17;break;case 12:$Value_addr_0_off049=$shr2434&65535;label=18;break;case 13:$and30=$Value<<1;if(($Value&16384|0)==0){label=15;break}else{label=14;break};case 14:$Value_addr_0_off0=($and30|1)&65535;label=17;break;case 15:$Value_addr_0_off049=$and30&65535;label=18;break;case 16:$Value_addr_0_off049=$Value>>>7&127;label=18;break;case 17:if(($Offset|0)>2|($Offset-16|0)>>>0<4){$Value_addr_0_off049=$Value_addr_0_off0;label=18;break}else{label=19;break};case 18:HEAP16[$State+8+($Offset<<1)>>1]=$Value_addr_0_off049&32767;label=21;break;case 19:HEAP16[$State+8+($Offset<<1)>>1]=$Value_addr_0_off0;label=21;break;case 20:HEAP16[$State+8+($Bank<<9)+($Offset<<1)>>1]=$extract_t&32767;label=21;break;case 21:return}}function _ServiceCduFifo($State){$State=$State|0;var $0=0,$Size=0,$CycleCounter=0,$2$1=0,$NextUpdate=0,$3$1=0,$arrayidx3=0,$Ptr=0,$5=0,$6=0,$7$1=0,$add10=0,$9=0,$10$1=0,$add16=0,$dec=0,$inc=0,$16$1=0,$IntervalType=0,$tobool44=0,$18$0=0,$18$1=0,$storemerge25$0=0,$storemerge24$0=0,$storemerge26=0,$RetVal_0=0,$inc66=0,label=0,tempVarArgs=0,sp=0;sp=STACKTOP;label=1;while(1)switch(label|0){case 1:$0=HEAP32[27708]|0;$Size=109228+($0*536|0)|0;if((HEAP32[$Size>>2]|0)>0){label=2;break}else{$RetVal_0=0;label=18;break};case 2:$CycleCounter=$State|0;$2$1=HEAP32[$CycleCounter+4>>2]|0;$NextUpdate=109240+($0*536|0)|0;$3$1=HEAP32[$NextUpdate+4>>2]|0;if($2$1>>>0<$3$1>>>0|$2$1>>>0==$3$1>>>0&(HEAP32[$CycleCounter>>2]|0)>>>0<(HEAP32[$NextUpdate>>2]|0)>>>0){$RetVal_0=0;label=18;break}else{label=3;break};case 3:$arrayidx3=$State+8+($0+26<<1)|0;$Ptr=109224+($0*536|0)|0;$5=HEAP32[109248+($0*536|0)+(HEAP32[$Ptr>>2]<<2)>>2]|0;if(($5&1073741824|0)==0){label=6;break}else{label=4;break};case 4:_CounterMCDU($arrayidx3)|0;$6=HEAP32[27304]|0;if(($6|0)==0){label=8;break}else{label=5;break};case 5:$7$1=HEAP32[$CycleCounter+4>>2]|0;$add10=(HEAP32[27708]|0)+26|0;_fprintf($6|0,40,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempVarArgs>>2]=HEAP32[$CycleCounter>>2],HEAP32[tempVarArgs+8>>2]=$7$1,HEAP32[tempVarArgs+16>>2]=$add10,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;label=8;break;case 6:_CounterPCDU($arrayidx3)|0;$9=HEAP32[27304]|0;if(($9|0)==0){label=8;break}else{label=7;break};case 7:$10$1=HEAP32[$CycleCounter+4>>2]|0;$add16=(HEAP32[27708]|0)+26|0;_fprintf($9|0,24,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+24|0,HEAP32[tempVarArgs>>2]=HEAP32[$CycleCounter>>2],HEAP32[tempVarArgs+8>>2]=$10$1,HEAP32[tempVarArgs+16>>2]=$add16,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;label=8;break;case 8:$dec=$5-1|0;if(($dec&1073741823|0)==0){label=10;break}else{label=9;break};case 9:HEAP32[109248+($0*536|0)+(HEAP32[$Ptr>>2]<<2)>>2]=$dec;label=12;break;case 10:HEAP32[$Size>>2]=(HEAP32[$Size>>2]|0)-1;$inc=(HEAP32[$Ptr>>2]|0)+1|0;HEAP32[$Ptr>>2]=$inc;if(($inc|0)>127){label=11;break}else{label=12;break};case 11:HEAP32[$Ptr>>2]=0;label=12;break;case 12:if((HEAP32[$NextUpdate>>2]|0)==0&(HEAP32[$NextUpdate+4>>2]|0)==0){label=13;break}else{label=14;break};case 13:$16$1=HEAP32[$CycleCounter+4>>2]|0;HEAP32[$NextUpdate>>2]=HEAP32[$CycleCounter>>2];HEAP32[$NextUpdate+4>>2]=$16$1;label=14;break;case 14:$IntervalType=109232+($0*536|0)|0;$tobool44=($5|0)<0;$18$0=HEAP32[$NextUpdate>>2]|0;$18$1=HEAP32[$NextUpdate+4>>2]|0;if((HEAP32[$IntervalType>>2]|0)<2){label=15;break}else{label=16;break};case 15:$storemerge25$0=_i64Add($18$0,$18$1,$tobool44?13:213,$tobool44?0:0)|0;HEAP32[$NextUpdate>>2]=$storemerge25$0;HEAP32[$NextUpdate+4>>2]=tempRet0;$storemerge26=(HEAP32[$IntervalType>>2]|0)+1|0;label=17;break;case 16:$storemerge24$0=_i64Add($18$0,$18$1,$tobool44?14:214,$tobool44?0:0)|0;HEAP32[$NextUpdate>>2]=$storemerge24$0;HEAP32[$NextUpdate+4>>2]=tempRet0;$storemerge26=0;label=17;break;case 17:HEAP32[$IntervalType>>2]=$storemerge26;$RetVal_0=1;label=18;break;case 18:$inc66=(HEAP32[27708]|0)+1|0;HEAP32[27708]=($inc66|0)>2?0:$inc66;STACKTOP=sp;return $RetVal_0|0}return 0}function _BurstOutput($State,$DriveBitMask,$CounterRegister,$Channel){$State=$State|0;$DriveBitMask=$DriveBitMask|0;$CounterRegister=$CounterRegister|0;$Channel=$Channel|0;var $cmp=0,$DriveCountSaved_0_in=0,$DriveCountSaved_0=0,$arrayidx11=0,$conv12=0,$DriveCount_030=0,$DriveCountSaved_1=0,$3=0,$DriveCountSaved_2=0,$_DriveCountSaved_2=0,$DriveCountSaved_3=0,$DriveCountSaved_4=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$cmp=($CounterRegister|0)==40;if($cmp){$DriveCountSaved_0_in=110856;label=4;break}else{label=2;break};case 2:if(($CounterRegister|0)==42){label=3;break}else if(($CounterRegister|0)==41){$DriveCountSaved_0_in=110848;label=4;break}else{$retval_0=0;label=15;break};case 3:$DriveCountSaved_0_in=110840;label=4;break;case 4:$DriveCountSaved_0=HEAP32[$DriveCountSaved_0_in>>2]|0;if((HEAP16[$State+86048>>1]&$DriveBitMask|0)==0){$DriveCount_030=0;label=7;break}else{label=5;break};case 5:$arrayidx11=$State+8+($CounterRegister<<1)|0;$conv12=HEAP16[$arrayidx11>>1]|0;HEAP16[$arrayidx11>>1]=0;if(($conv12&16384|0)==0){$DriveCount_030=$conv12;label=7;break}else{label=6;break};case 6:$DriveCountSaved_1=$DriveCountSaved_0-($conv12^32767)|0;label=8;break;case 7:$DriveCountSaved_1=$DriveCount_030+$DriveCountSaved_0|0;label=8;break;case 8:$3=$DriveCountSaved_1>>31&16384;$DriveCountSaved_2=($DriveCountSaved_1|0)<0?-$DriveCountSaved_1|0:$DriveCountSaved_1;$_DriveCountSaved_2=($DriveCountSaved_2|0)<24?$DriveCountSaved_2:24;if(($_DriveCountSaved_2|0)>0){label=9;break}else{$DriveCountSaved_3=$DriveCountSaved_2;label=10;break};case 9:_ChannelOutput($State,$Channel,$_DriveCountSaved_2|$3);$DriveCountSaved_3=$DriveCountSaved_2-$_DriveCountSaved_2|0;label=10;break;case 10:$DriveCountSaved_4=($3|0)==0?$DriveCountSaved_3:-$DriveCountSaved_3|0;if($cmp){label=11;break}else{label=12;break};case 11:HEAP32[27714]=$DriveCountSaved_4;$retval_0=$DriveCountSaved_4;label=15;break;case 12:if(($CounterRegister|0)==41){label=13;break}else if(($CounterRegister|0)==42){label=14;break}else{$retval_0=$DriveCountSaved_4;label=15;break};case 13:HEAP32[27712]=$DriveCountSaved_4;$retval_0=$DriveCountSaved_4;label=15;break;case 14:HEAP32[27710]=$DriveCountSaved_4;$retval_0=$DriveCountSaved_4;label=15;break;case 15:return $retval_0|0}return 0}function _AssignFromPointer($State,$Pointer,$Value){$State=$State|0;$Pointer=$Pointer|0;$Value=$Value|0;var $sub_ptr_sub=0,$sub_ptr_div=0,label=0;label=1;while(1)switch(label|0){case 1:$sub_ptr_sub=$Pointer-($State+8)|0;$sub_ptr_div=$sub_ptr_sub>>1;if(($sub_ptr_sub+1|0)>>>0<4097){label=2;break}else{label=3;break};case 2:_Assign($State,($sub_ptr_div|0)/256|0,$sub_ptr_div&255,$Value);label=3;break;case 3:return}}function _InterruptRequests($State,$Address10,$Sum){$State=$State|0;$Address10=$Address10|0;$Sum=$Sum|0;var label=0;label=1;while(1)switch(label|0){case 1:if((_ValueOverflowed($Sum)|0)<<16>>16==0){label=8;break}else{label=2;break};case 2:switch($Address10<<16>>16){case 21:{label=3;break};case 25:{label=4;break};case 24:{label=5;break};case 22:{label=6;break};case 23:{label=7;break};default:{label=8;break}}break;case 3:_CounterPINC($State+48|0)|0;label=8;break;case 4:HEAP8[$State+87085|0]=1;label=8;break;case 5:HEAP8[$State+87086|0]=1;label=8;break;case 6:HEAP8[$State+87087|0]=1;label=8;break;case 7:HEAP8[$State+87088|0]=1;label=8;break;case 8:return}}function _SpToDecent($LsbSP){$LsbSP=$LsbSP|0;var $0=0,$1=0,$call=0,$and11=0,$Msb_1=0,$Lsb_1=0,$shl=0,$or63=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$0=HEAP16[$LsbSP-2>>1]|0;$1=HEAP16[$LsbSP>>1]|0;if(($0<<16>>16|0)==0|($0<<16>>16|0)==32767){label=2;break}else{label=3;break};case 2:$call=_SignExtend($1)|0;$retval_0=(($call&32768|0)==0?$call:$call|1073676288)&1073741823;label=10;break;case 3:$and11=$0&16384;if(($1&16384|0)==($and11|0)){$Lsb_1=$1;$Msb_1=$0;label=9;break}else{label=4;break};case 4:if(($1<<16>>16|0)==0|($1<<16>>16|0)==32767){label=5;break}else{label=6;break};case 5:$Lsb_1=($and11|0)==0?0:32767;$Msb_1=$0;label=9;break;case 6:if(($and11|0)==0){label=7;break}else{label=8;break};case 7:$Lsb_1=$1+16385&32767;$Msb_1=$0-1&65535;label=9;break;case 8:$Lsb_1=-16384-$1&32767^32767;$Msb_1=32766-$0&32767^32767;label=9;break;case 9:$shl=$Msb_1<<16>>16<<14;$or63=$shl&536854528|$Lsb_1&16383;$retval_0=($shl&268435456|0)==0?$or63:$or63|536870912;label=10;break;case 10:return $retval_0|0}return 0}function _DecentToSp($Decent,$LsbSP){$Decent=$Decent|0;$LsbSP=$LsbSP|0;var $conv=0;$conv=$Decent&16383;HEAP16[$LsbSP>>1]=($Decent&536870912|0)==0?$conv:$conv|16384;HEAP16[$LsbSP-2>>1]=_OverflowCorrected($Decent>>>14&65535)|0;return}function _agc_load_binfile($State,$RomImage){$State=$State|0;$RomImage=$RomImage|0;var $In=0,$call=0,$cmp=0,$call2=0,$div=0,$arraydecay=0,$j_026=0,$i_025=0,$Bank_024=0,$inc=0,$Bank_1=0,$j_1=0,$inc50=0,$RetVal_0=0,$RetVal_022=0,$RetVal_020=0,label=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+8|0;label=1;while(1)switch(label|0){case 1:$In=sp|0;$call=_rfopen($RomImage,64)|0;$cmp=($call|0)==0;if($cmp){$RetVal_020=1;label=18;break}else{label=2;break};case 2:_fseek($call|0,0,2)|0;$call2=_ftell($call|0)|0;if(($call2&1|0)==0){label=3;break}else{$RetVal_022=3;label=17;break};case 3:$div=($call2|0)/2|0;if(($call2|0)>73729){$RetVal_0=2;label=16;break}else{label=4;break};case 4:_fseek($call|0,0,0)|0;if(($State|0)==0){$RetVal_0=4;label=16;break}else{label=5;break};case 5:$arraydecay=$In|0;if(($call2|0)>1){label=6;break}else{$RetVal_0=5;label=16;break};case 6:$Bank_024=2;$i_025=0;$j_026=0;label=7;break;case 7:if((_fread($arraydecay|0,1,2,$call|0)|0)==2){label=8;break}else{$RetVal_0=5;label=16;break};case 8:if(($Bank_024|0)>35){$RetVal_0=2;label=16;break}else{label=9;break};case 9:$inc=$j_026+1|0;HEAP16[$State+4104+($Bank_024<<11)+($j_026<<1)>>1]=(((HEAPU8[$arraydecay]|0)<<8|(HEAPU8[$In+1|0]|0))&65535)>>>1;if(($inc|0)==1024){label=10;break}else{$j_1=$inc;$Bank_1=$Bank_024;label=15;break};case 10:if(($Bank_024|0)==3){label=11;break}else if(($Bank_024|0)==0){label=12;break}else if(($Bank_024|0)==1){label=13;break}else if(($Bank_024|0)==2){$j_1=0;$Bank_1=3;label=15;break}else{label=14;break};case 11:$j_1=0;$Bank_1=0;label=15;break;case 12:$j_1=0;$Bank_1=1;label=15;break;case 13:$j_1=0;$Bank_1=4;label=15;break;case 14:$j_1=0;$Bank_1=$Bank_024+1|0;label=15;break;case 15:$inc50=$i_025+1|0;if(($inc50|0)<($div|0)){$Bank_024=$Bank_1;$i_025=$inc50;$j_026=$j_1;label=7;break}else{$RetVal_0=5;label=16;break};case 16:if($cmp){$RetVal_020=$RetVal_0;label=18;break}else{$RetVal_022=$RetVal_0;label=17;break};case 17:_fclose($call|0)|0;$RetVal_020=$RetVal_022;label=18;break;case 18:STACKTOP=sp;return $RetVal_020|0}return 0}function _FormIoPacket($Channel,$Value,$Packet){$Channel=$Channel|0;$Value=$Value|0;$Packet=$Packet|0;var $retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:if($Channel>>>0>511|$Value>>>0>32767|($Packet|0)==0){$retval_0=1;label=3;break}else{label=2;break};case 2:HEAP8[$Packet]=$Channel>>>3&255;HEAP8[$Packet+1|0]=($Channel<<3&56|$Value>>>12&7|64)&255;HEAP8[$Packet+2|0]=($Value>>>6&63|128)&255;HEAP8[$Packet+3|0]=($Value|192)&255;$retval_0=0;label=3;break;case 3:return $retval_0|0}return 0}function _ParseIoPacket($Packet,$Channel,$Value,$uBit){$Packet=$Packet|0;$Channel=$Channel|0;$Value=$Value|0;$uBit=$uBit|0;var $conv=0,$arrayidx2=0,$conv3=0,$arrayidx9=0,$arrayidx16=0,$retval_0=0,label=0;label=1;while(1)switch(label|0){case 1:$conv=HEAPU8[$Packet]|0;if(($conv&192|0)==0){label=2;break}else{$retval_0=1;label=6;break};case 2:$arrayidx2=$Packet+1|0;$conv3=HEAPU8[$arrayidx2]|0;if(($conv3&192|0)==64){label=3;break}else{$retval_0=1;label=6;break};case 3:$arrayidx9=$Packet+2|0;if((HEAP8[$arrayidx9]&-64)<<24>>24==-128){label=4;break}else{$retval_0=1;label=6;break};case 4:$arrayidx16=$Packet+3|0;if((HEAP8[$arrayidx16]&-64)<<24>>24==-64){label=5;break}else{$retval_0=1;label=6;break};case 5:HEAP32[$Channel>>2]=$conv3>>>3&7|$conv<<3&248;HEAP32[$Value>>2]=(HEAPU8[$arrayidx9]|0)<<6&4032|(HEAPU8[$arrayidx2]|0)<<12&28672|HEAP8[$arrayidx16]&63;HEAP32[$uBit>>2]=HEAP8[$Packet]&32;$retval_0=0;label=6;break;case 6:return $retval_0|0}return 0}function _agc_engine_init($State,$RomImage,$CoreDump,$AllOrErasable){$State=$State|0;$RomImage=$RomImage|0;$CoreDump=$CoreDump|0;$AllOrErasable=$AllOrErasable|0;var $lli=0,$i=0,$j=0,$CycleCounter=0,$2=0,$arrayidx28=0,$8=0,$OutputChannel7=0,$IndexValue=0,$DownruptTime=0,$Downlink=0,$call52=0,$call62=0,$inc72=0,$Bank_186=0,$call82=0,$inc100=0,$inc103=0,$call107=0,$22=0,$call114=0,$call120=0,$call127=0,$call134=0,$call141=0,$call148=0,$call15982=0,$cmp16084=0,$inc168=0,$call159=0,$cmp160=0,$call181=0,$inc190=0,$call194=0,$call201=0,$call208=0,$call215=0,$70$1=0,$call221=0,$RetVal_0=0,$RetVal_079=0,label=0,tempVarArgs=0,sp=0;sp=STACKTOP;STACKTOP=STACKTOP+24|0;label=1;while(1)switch(label|0){case 1:$lli=sp|0;$i=sp+8|0;$j=sp+16|0;_UnblockSocket(_fileno(HEAP32[_stdin>>2]|0)|0);if(($RomImage|0)==0){label=3;break}else{label=2;break};case 2:_agc_load_binfile($State,$RomImage)|0;label=3;break;case 3:_memset($State+86024|0,0,1024);HEAP32[$i>>2]=512;HEAP16[$State+86072>>1]=16383;HEAP16[$State+86074>>1]=32767;HEAP16[$State+86076>>1]=32767;HEAP16[$State+86078>>1]=32767;_memset($State+8|0,0,4096);HEAP16[$State+18>>1]=2048;$CycleCounter=$State|0;HEAP32[$CycleCounter>>2]=0;HEAP32[$CycleCounter+4>>2]=0;$2=$State+87092|0;HEAP32[$2>>2]=HEAP32[$2>>2]&-50331649;$arrayidx28=$State+87092|0;HEAP8[$arrayidx28]=1;HEAP32[$2>>2]=HEAP32[$2>>2]&268435455;$8=$State+87096|0;HEAP32[$8>>2]=HEAP32[$8>>2]&-8;$OutputChannel7=$State+87048|0;HEAP16[$OutputChannel7>>1]=0;_memset($State+87050|0,0,32);$IndexValue=$State+87082|0;HEAP16[$IndexValue>>1]=0;_memset($State+87084|0,0,11);HEAP32[$j>>2]=11;HEAP32[$2>>2]=HEAP32[$2>>2]&-201326593;HEAP32[$8>>2]=HEAP32[$8>>2]|8;$DownruptTime=$State+87104|0;HEAP32[$DownruptTime>>2]=0;HEAP32[$DownruptTime+4>>2]=0;$Downlink=$State+87112|0;HEAP32[$Downlink>>2]=0;if(($CoreDump|0)==0){$RetVal_079=0;label=42;break}else{label=4;break};case 4:$call52=_fopen($CoreDump|0,80)|0;if(($call52|0)==0){label=6;break}else{label=5;break};case 5:HEAP32[$i>>2]=0;label=8;break;case 6:$RetVal_079=($AllOrErasable|0)==0?0:6;label=42;break;case 7:$Bank_186=0;label=12;break;case 8:$call62=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$j,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call62|0)==1){label=9;break}else{$RetVal_0=5;label=40;break};case 9:if(($AllOrErasable|0)==0){label=11;break}else{label=10;break};case 10:HEAP16[$State+86024+(HEAP32[$i>>2]<<1)>>1]=HEAP32[$j>>2]&65535;label=11;break;case 11:$inc72=(HEAP32[$i>>2]|0)+1|0;HEAP32[$i>>2]=$inc72;if(($inc72|0)<512){label=8;break}else{label=7;break};case 12:HEAP32[$j>>2]=0;label=13;break;case 13:$call82=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call82|0)==1){label=14;break}else{$RetVal_0=5;label=40;break};case 14:if(($AllOrErasable|0)!=0|($Bank_186|0)>0){label=16;break}else{label=15;break};case 15:if((HEAP32[$j>>2]|0)>7){label=16;break}else{label=17;break};case 16:HEAP16[$State+8+($Bank_186<<9)+(HEAP32[$j>>2]<<1)>>1]=HEAP32[$i>>2]&65535;label=17;break;case 17:$inc100=(HEAP32[$j>>2]|0)+1|0;HEAP32[$j>>2]=$inc100;if(($inc100|0)<256){label=13;break}else{label=18;break};case 18:$inc103=$Bank_186+1|0;if(($inc103|0)<8){$Bank_186=$inc103;label=12;break}else{label=19;break};case 19:if(($AllOrErasable|0)==0){$RetVal_0=0;label=40;break}else{label=20;break};case 20:$call107=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call107|0)==1){label=21;break}else{$RetVal_0=5;label=40;break};case 21:$22=HEAP32[$i>>2]|0;HEAP32[$CycleCounter>>2]=$22;HEAP32[$CycleCounter+4>>2]=($22|0)<0?-1:0;$call114=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call114|0)==1){label=22;break}else{$RetVal_0=5;label=40;break};case 22:HEAP32[$2>>2]=HEAP32[$2>>2]&-16777217|HEAP32[$i>>2]<<24&16777216;$call120=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call120|0)==1){label=23;break}else{$RetVal_0=5;label=40;break};case 23:HEAP32[$2>>2]=HEAP32[$2>>2]&-33554433|HEAP32[$i>>2]<<25&33554432;$call127=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call127|0)==1){label=24;break}else{$RetVal_0=5;label=40;break};case 24:HEAP32[$2>>2]=HEAP32[$2>>2]&-268435457|HEAP32[$i>>2]<<28&268435456;$call134=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call134|0)==1){label=25;break}else{$RetVal_0=5;label=40;break};case 25:HEAP32[$2>>2]=HEAP32[$2>>2]&536870911|HEAP32[$i>>2]<<29;$call141=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call141|0)==1){label=26;break}else{$RetVal_0=5;label=40;break};case 26:HEAP32[$8>>2]=HEAP32[$8>>2]&-8|HEAP32[$i>>2]&7;$call148=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call148|0)==1){label=27;break}else{$RetVal_0=5;label=40;break};case 27:HEAP16[$OutputChannel7>>1]=HEAP32[$i>>2]&65535;HEAP32[$j>>2]=0;$call15982=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;$cmp16084=($call15982|0)!=1;label=28;break;case 28:if($cmp16084){$RetVal_0=5;label=40;break}else{label=29;break};case 29:HEAP16[$State+87050+(HEAP32[$j>>2]<<1)>>1]=HEAP32[$i>>2]&65535;$inc168=(HEAP32[$j>>2]|0)+1|0;HEAP32[$j>>2]=$inc168;$call159=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;$cmp160=($call159|0)!=1;if(($inc168|0)<16){$cmp16084=$cmp160;label=28;break}else{label=30;break};case 30:if($cmp160){$RetVal_0=5;label=40;break}else{label=31;break};case 31:HEAP16[$IndexValue>>1]=HEAP32[$i>>2]&65535;HEAP32[$j>>2]=0;label=32;break;case 32:$call181=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call181|0)==1){label=33;break}else{$RetVal_0=5;label=40;break};case 33:HEAP8[(HEAP32[$j>>2]|0)+($State+87084)|0]=HEAP32[$i>>2]&255;$inc190=(HEAP32[$j>>2]|0)+1|0;HEAP32[$j>>2]=$inc190;if(($inc190|0)<11){label=32;break}else{label=34;break};case 34:HEAP8[$arrayidx28]=1;$call194=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call194|0)==1){label=35;break}else{$RetVal_0=5;label=40;break};case 35:HEAP32[$2>>2]=HEAP32[$2>>2]&-67108865|HEAP32[$i>>2]<<26&67108864;$call201=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call201|0)==1){label=36;break}else{$RetVal_0=5;label=40;break};case 36:HEAP32[$2>>2]=HEAP32[$2>>2]&-134217729|HEAP32[$i>>2]<<27&134217728;$call208=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call208|0)==1){label=37;break}else{$RetVal_0=5;label=40;break};case 37:HEAP32[$8>>2]=HEAP32[$8>>2]&-9|HEAP32[$i>>2]<<3&8;$call215=_fscanf($call52|0,56,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$lli,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call215|0)==1){label=38;break}else{$RetVal_0=5;label=40;break};case 38:$70$1=HEAP32[$lli+4>>2]|0;HEAP32[$DownruptTime>>2]=HEAP32[$lli>>2];HEAP32[$DownruptTime+4>>2]=$70$1;$call221=_fscanf($call52|0,72,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=$i,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;if(($call221|0)==1){label=39;break}else{$RetVal_0=5;label=40;break};case 39:HEAP32[$Downlink>>2]=HEAP32[$i>>2];$RetVal_0=0;label=40;break;case 40:if(($call52|0)==0){$RetVal_079=$RetVal_0;label=42;break}else{label=41;break};case 41:_fclose($call52|0)|0;$RetVal_079=$RetVal_0;label=42;break;case 42:STACKTOP=sp;return $RetVal_079|0}return 0}function _UnblockSocket($SocketNum){$SocketNum=$SocketNum|0;var tempVarArgs=0,sp=0;sp=STACKTOP;_fcntl($SocketNum|0,4,(tempVarArgs=STACKTOP,STACKTOP=STACKTOP+8|0,HEAP32[tempVarArgs>>2]=16384,tempVarArgs)|0)|0;STACKTOP=tempVarArgs;STACKTOP=sp;return}function _strlen(ptr){ptr=ptr|0;var curr=0;curr=ptr;while(HEAP8[curr]|0){curr=curr+1|0}return curr-ptr|0}function _memset(ptr,value,num){ptr=ptr|0;value=value|0;num=num|0;var stop=0,value4=0,stop4=0,unaligned=0;stop=ptr+num|0;if((num|0)>=20){value=value&255;unaligned=ptr&3;value4=value|value<<8|value<<16|value<<24;stop4=stop&~3;if(unaligned){unaligned=ptr+4-unaligned|0;while((ptr|0)<(unaligned|0)){HEAP8[ptr]=value;ptr=ptr+1|0}}while((ptr|0)<(stop4|0)){HEAP32[ptr>>2]=value4;ptr=ptr+4|0}}while((ptr|0)<(stop|0)){HEAP8[ptr]=value;ptr=ptr+1|0}}function _memcpy(dest,src,num){dest=dest|0;src=src|0;num=num|0;var ret=0;ret=dest|0;if((dest&3)==(src&3)){while(dest&3){if((num|0)==0)return ret|0;HEAP8[dest]=HEAP8[src]|0;dest=dest+1|0;src=src+1|0;num=num-1|0}while((num|0)>=4){HEAP32[dest>>2]=HEAP32[src>>2];dest=dest+4|0;src=src+4|0;num=num-4|0}}while((num|0)>0){HEAP8[dest]=HEAP8[src]|0;dest=dest+1|0;src=src+1|0;num=num-1|0}return ret|0}function _i64Add(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var l=0;l=a+c>>>0;return(tempRet0=b+d+(l>>>0<a>>>0|0)>>>0,l|0)|0}function _i64Subtract(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var h=0;h=b-d>>>0;h=b-d-(c>>>0>a>>>0|0)>>>0;return(tempRet0=h,a-c>>>0|0)|0}function _bitshift64Shl(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high<<bits|(low&(1<<bits)-1<<32-bits)>>>32-bits;return low<<bits}tempRet0=low<<bits-32;return 0}function _bitshift64Lshr(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high>>>bits;return low>>>bits|(high&(1<<bits)-1)<<32-bits}tempRet0=0;return high>>>bits-32|0}function _bitshift64Ashr(low,high,bits){low=low|0;high=high|0;bits=bits|0;if((bits|0)<32){tempRet0=high>>bits;return low>>>bits|(high&(1<<bits)-1)<<32-bits}tempRet0=(high|0)<0?-1:0;return high>>bits-32|0}function _llvm_ctlz_i32(x){x=x|0;var ret=0;ret=HEAP8[ctlz_i8+(x>>>24)|0]|0;if((ret|0)<8)return ret|0;ret=HEAP8[ctlz_i8+(x>>16&255)|0]|0;if((ret|0)<8)return ret+8|0;ret=HEAP8[ctlz_i8+(x>>8&255)|0]|0;if((ret|0)<8)return ret+16|0;return(HEAP8[ctlz_i8+(x&255)|0]|0)+24|0}function _llvm_cttz_i32(x){x=x|0;var ret=0;ret=HEAP8[cttz_i8+(x&255)|0]|0;if((ret|0)<8)return ret|0;ret=HEAP8[cttz_i8+(x>>8&255)|0]|0;if((ret|0)<8)return ret+8|0;ret=HEAP8[cttz_i8+(x>>16&255)|0]|0;if((ret|0)<8)return ret+16|0;return(HEAP8[cttz_i8+(x>>>24)|0]|0)+24|0}function ___muldsi3($a,$b){$a=$a|0;$b=$b|0;var $1=0,$2=0,$3=0,$6=0,$8=0,$11=0,$12=0;$1=$a&65535;$2=$b&65535;$3=Math_imul($2,$1)|0;$6=$a>>>16;$8=($3>>>16)+(Math_imul($2,$6)|0)|0;$11=$b>>>16;$12=Math_imul($11,$1)|0;return(tempRet0=($8>>>16)+(Math_imul($11,$6)|0)+((($8&65535)+$12|0)>>>16)|0,$8+$12<<16|$3&65535|0)|0}function ___divdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $1$0=0,$1$1=0,$2$0=0,$2$1=0,$4$0=0,$4$1=0,$7$0=0,$7$1=0,$10$0=0;$1$0=$a$1>>31|(($a$1|0)<0?-1:0)<<1;$1$1=(($a$1|0)<0?-1:0)>>31|(($a$1|0)<0?-1:0)<<1;$2$0=$b$1>>31|(($b$1|0)<0?-1:0)<<1;$2$1=(($b$1|0)<0?-1:0)>>31|(($b$1|0)<0?-1:0)<<1;$4$0=_i64Subtract($1$0^$a$0,$1$1^$a$1,$1$0,$1$1)|0;$4$1=tempRet0;$7$0=$2$0^$1$0;$7$1=$2$1^$1$1;$10$0=_i64Subtract((___udivmoddi4($4$0,$4$1,_i64Subtract($2$0^$b$0,$2$1^$b$1,$2$0,$2$1)|0,tempRet0,0)|0)^$7$0,tempRet0^$7$1,$7$0,$7$1)|0;return(tempRet0=tempRet0,$10$0)|0}function ___remdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $rem=0,$1$0=0,$1$1=0,$2$0=0,$2$1=0,$4$0=0,$4$1=0,$6$0=0,$10$0=0,$10$1=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;$rem=__stackBase__|0;$1$0=$a$1>>31|(($a$1|0)<0?-1:0)<<1;$1$1=(($a$1|0)<0?-1:0)>>31|(($a$1|0)<0?-1:0)<<1;$2$0=$b$1>>31|(($b$1|0)<0?-1:0)<<1;$2$1=(($b$1|0)<0?-1:0)>>31|(($b$1|0)<0?-1:0)<<1;$4$0=_i64Subtract($1$0^$a$0,$1$1^$a$1,$1$0,$1$1)|0;$4$1=tempRet0;$6$0=_i64Subtract($2$0^$b$0,$2$1^$b$1,$2$0,$2$1)|0;___udivmoddi4($4$0,$4$1,$6$0,tempRet0,$rem)|0;$10$0=_i64Subtract(HEAP32[$rem>>2]^$1$0,HEAP32[$rem+4>>2]^$1$1,$1$0,$1$1)|0;$10$1=tempRet0;STACKTOP=__stackBase__;return(tempRet0=$10$1,$10$0)|0}function ___muldi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $x_sroa_0_0_extract_trunc=0,$y_sroa_0_0_extract_trunc=0,$1$0=0,$1$1=0;$x_sroa_0_0_extract_trunc=$a$0;$y_sroa_0_0_extract_trunc=$b$0;$1$0=___muldsi3($x_sroa_0_0_extract_trunc,$y_sroa_0_0_extract_trunc)|0;$1$1=tempRet0;return(tempRet0=(Math_imul($a$1,$y_sroa_0_0_extract_trunc)|0)+(Math_imul($b$1,$x_sroa_0_0_extract_trunc)|0)+$1$1|$1$1&0,$1$0|0|0)|0}function ___udivdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $1$0=0;$1$0=___udivmoddi4($a$0,$a$1,$b$0,$b$1,0)|0;return(tempRet0=tempRet0,$1$0)|0}function ___uremdi3($a$0,$a$1,$b$0,$b$1){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;var $rem=0,__stackBase__=0;__stackBase__=STACKTOP;STACKTOP=STACKTOP+8|0;$rem=__stackBase__|0;___udivmoddi4($a$0,$a$1,$b$0,$b$1,$rem)|0;STACKTOP=__stackBase__;return(tempRet0=HEAP32[$rem+4>>2]|0,HEAP32[$rem>>2]|0)|0}function ___udivmoddi4($a$0,$a$1,$b$0,$b$1,$rem){$a$0=$a$0|0;$a$1=$a$1|0;$b$0=$b$0|0;$b$1=$b$1|0;$rem=$rem|0;var $n_sroa_0_0_extract_trunc=0,$n_sroa_1_4_extract_shift$0=0,$n_sroa_1_4_extract_trunc=0,$d_sroa_0_0_extract_trunc=0,$d_sroa_1_4_extract_shift$0=0,$d_sroa_1_4_extract_trunc=0,$4=0,$17=0,$37=0,$51=0,$57=0,$58=0,$66=0,$78=0,$88=0,$89=0,$91=0,$92=0,$95=0,$105=0,$119=0,$125=0,$126=0,$130=0,$q_sroa_1_1_ph=0,$q_sroa_0_1_ph=0,$r_sroa_1_1_ph=0,$r_sroa_0_1_ph=0,$sr_1_ph=0,$d_sroa_0_0_insert_insert99$0=0,$d_sroa_0_0_insert_insert99$1=0,$137$0=0,$137$1=0,$carry_0203=0,$sr_1202=0,$r_sroa_0_1201=0,$r_sroa_1_1200=0,$q_sroa_0_1199=0,$q_sroa_1_1198=0,$147=0,$149=0,$r_sroa_0_0_insert_insert42$0=0,$r_sroa_0_0_insert_insert42$1=0,$150$1=0,$151$0=0,$152=0,$r_sroa_0_0_extract_trunc=0,$r_sroa_1_4_extract_trunc=0,$155=0,$carry_0_lcssa$0=0,$carry_0_lcssa$1=0,$r_sroa_0_1_lcssa=0,$r_sroa_1_1_lcssa=0,$q_sroa_0_1_lcssa=0,$q_sroa_1_1_lcssa=0,$q_sroa_0_0_insert_ext75$0=0,$q_sroa_0_0_insert_ext75$1=0,$_0$0=0,$_0$1=0;$n_sroa_0_0_extract_trunc=$a$0;$n_sroa_1_4_extract_shift$0=$a$1;$n_sroa_1_4_extract_trunc=$n_sroa_1_4_extract_shift$0;$d_sroa_0_0_extract_trunc=$b$0;$d_sroa_1_4_extract_shift$0=$b$1;$d_sroa_1_4_extract_trunc=$d_sroa_1_4_extract_shift$0;if(($n_sroa_1_4_extract_trunc|0)==0){$4=($rem|0)!=0;if(($d_sroa_1_4_extract_trunc|0)==0){if($4){HEAP32[$rem>>2]=($n_sroa_0_0_extract_trunc>>>0)%($d_sroa_0_0_extract_trunc>>>0);HEAP32[$rem+4>>2]=0}$_0$1=0;$_0$0=($n_sroa_0_0_extract_trunc>>>0)/($d_sroa_0_0_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}else{if(!$4){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0|0;HEAP32[$rem+4>>2]=$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}}$17=($d_sroa_1_4_extract_trunc|0)==0;do{if(($d_sroa_0_0_extract_trunc|0)==0){if($17){if(($rem|0)!=0){HEAP32[$rem>>2]=($n_sroa_1_4_extract_trunc>>>0)%($d_sroa_0_0_extract_trunc>>>0);HEAP32[$rem+4>>2]=0}$_0$1=0;$_0$0=($n_sroa_1_4_extract_trunc>>>0)/($d_sroa_0_0_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}if(($n_sroa_0_0_extract_trunc|0)==0){if(($rem|0)!=0){HEAP32[$rem>>2]=0;HEAP32[$rem+4>>2]=($n_sroa_1_4_extract_trunc>>>0)%($d_sroa_1_4_extract_trunc>>>0)}$_0$1=0;$_0$0=($n_sroa_1_4_extract_trunc>>>0)/($d_sroa_1_4_extract_trunc>>>0)>>>0;return(tempRet0=$_0$1,$_0$0)|0}$37=$d_sroa_1_4_extract_trunc-1|0;if(($37&$d_sroa_1_4_extract_trunc|0)==0){if(($rem|0)!=0){HEAP32[$rem>>2]=$a$0|0;HEAP32[$rem+4>>2]=$37&$n_sroa_1_4_extract_trunc|$a$1&0}$_0$1=0;$_0$0=$n_sroa_1_4_extract_trunc>>>((_llvm_cttz_i32($d_sroa_1_4_extract_trunc|0)|0)>>>0);return(tempRet0=$_0$1,$_0$0)|0}$51=(_llvm_ctlz_i32($d_sroa_1_4_extract_trunc|0)|0)-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;if($51>>>0<=30){$57=$51+1|0;$58=31-$51|0;$sr_1_ph=$57;$r_sroa_0_1_ph=$n_sroa_1_4_extract_trunc<<$58|$n_sroa_0_0_extract_trunc>>>($57>>>0);$r_sroa_1_1_ph=$n_sroa_1_4_extract_trunc>>>($57>>>0);$q_sroa_0_1_ph=0;$q_sroa_1_1_ph=$n_sroa_0_0_extract_trunc<<$58;break}if(($rem|0)==0){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0|0;HEAP32[$rem+4>>2]=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}else{if(!$17){$119=(_llvm_ctlz_i32($d_sroa_1_4_extract_trunc|0)|0)-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;if($119>>>0<=31){$125=$119+1|0;$126=31-$119|0;$130=$119-31>>31;$sr_1_ph=$125;$r_sroa_0_1_ph=$n_sroa_0_0_extract_trunc>>>($125>>>0)&$130|$n_sroa_1_4_extract_trunc<<$126;$r_sroa_1_1_ph=$n_sroa_1_4_extract_trunc>>>($125>>>0)&$130;$q_sroa_0_1_ph=0;$q_sroa_1_1_ph=$n_sroa_0_0_extract_trunc<<$126;break}if(($rem|0)==0){$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}HEAP32[$rem>>2]=$a$0|0;HEAP32[$rem+4>>2]=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$1=0;$_0$0=0;return(tempRet0=$_0$1,$_0$0)|0}$66=$d_sroa_0_0_extract_trunc-1|0;if(($66&$d_sroa_0_0_extract_trunc|0)!=0){$88=(_llvm_ctlz_i32($d_sroa_0_0_extract_trunc|0)|0)+33-(_llvm_ctlz_i32($n_sroa_1_4_extract_trunc|0)|0)|0;$89=64-$88|0;$91=32-$88|0;$92=$91>>31;$95=$88-32|0;$105=$95>>31;$sr_1_ph=$88;$r_sroa_0_1_ph=$91-1>>31&$n_sroa_1_4_extract_trunc>>>($95>>>0)|($n_sroa_1_4_extract_trunc<<$91|$n_sroa_0_0_extract_trunc>>>($88>>>0))&$105;$r_sroa_1_1_ph=$105&$n_sroa_1_4_extract_trunc>>>($88>>>0);$q_sroa_0_1_ph=$n_sroa_0_0_extract_trunc<<$89&$92;$q_sroa_1_1_ph=($n_sroa_1_4_extract_trunc<<$89|$n_sroa_0_0_extract_trunc>>>($95>>>0))&$92|$n_sroa_0_0_extract_trunc<<$91&$88-33>>31;break}if(($rem|0)!=0){HEAP32[$rem>>2]=$66&$n_sroa_0_0_extract_trunc;HEAP32[$rem+4>>2]=0}if(($d_sroa_0_0_extract_trunc|0)==1){$_0$1=$n_sroa_1_4_extract_shift$0|$a$1&0;$_0$0=$a$0|0|0;return(tempRet0=$_0$1,$_0$0)|0}else{$78=_llvm_cttz_i32($d_sroa_0_0_extract_trunc|0)|0;$_0$1=$n_sroa_1_4_extract_trunc>>>($78>>>0)|0;$_0$0=$n_sroa_1_4_extract_trunc<<32-$78|$n_sroa_0_0_extract_trunc>>>($78>>>0)|0;return(tempRet0=$_0$1,$_0$0)|0}}}while(0);if(($sr_1_ph|0)==0){$q_sroa_1_1_lcssa=$q_sroa_1_1_ph;$q_sroa_0_1_lcssa=$q_sroa_0_1_ph;$r_sroa_1_1_lcssa=$r_sroa_1_1_ph;$r_sroa_0_1_lcssa=$r_sroa_0_1_ph;$carry_0_lcssa$1=0;$carry_0_lcssa$0=0}else{$d_sroa_0_0_insert_insert99$0=$b$0|0|0;$d_sroa_0_0_insert_insert99$1=$d_sroa_1_4_extract_shift$0|$b$1&0;$137$0=_i64Add($d_sroa_0_0_insert_insert99$0,$d_sroa_0_0_insert_insert99$1,-1,-1)|0;$137$1=tempRet0;$q_sroa_1_1198=$q_sroa_1_1_ph;$q_sroa_0_1199=$q_sroa_0_1_ph;$r_sroa_1_1200=$r_sroa_1_1_ph;$r_sroa_0_1201=$r_sroa_0_1_ph;$sr_1202=$sr_1_ph;$carry_0203=0;while(1){$147=$q_sroa_0_1199>>>31|$q_sroa_1_1198<<1;$149=$carry_0203|$q_sroa_0_1199<<1;$r_sroa_0_0_insert_insert42$0=$r_sroa_0_1201<<1|$q_sroa_1_1198>>>31|0;$r_sroa_0_0_insert_insert42$1=$r_sroa_0_1201>>>31|$r_sroa_1_1200<<1|0;_i64Subtract($137$0,$137$1,$r_sroa_0_0_insert_insert42$0,$r_sroa_0_0_insert_insert42$1)|0;$150$1=tempRet0;$151$0=$150$1>>31|(($150$1|0)<0?-1:0)<<1;$152=$151$0&1;$r_sroa_0_0_extract_trunc=_i64Subtract($r_sroa_0_0_insert_insert42$0,$r_sroa_0_0_insert_insert42$1,$151$0&$d_sroa_0_0_insert_insert99$0,((($150$1|0)<0?-1:0)>>31|(($150$1|0)<0?-1:0)<<1)&$d_sroa_0_0_insert_insert99$1)|0;$r_sroa_1_4_extract_trunc=tempRet0;$155=$sr_1202-1|0;if(($155|0)==0){break}else{$q_sroa_1_1198=$147;$q_sroa_0_1199=$149;$r_sroa_1_1200=$r_sroa_1_4_extract_trunc;$r_sroa_0_1201=$r_sroa_0_0_extract_trunc;$sr_1202=$155;$carry_0203=$152}}$q_sroa_1_1_lcssa=$147;$q_sroa_0_1_lcssa=$149;$r_sroa_1_1_lcssa=$r_sroa_1_4_extract_trunc;$r_sroa_0_1_lcssa=$r_sroa_0_0_extract_trunc;$carry_0_lcssa$1=0;$carry_0_lcssa$0=$152}$q_sroa_0_0_insert_ext75$0=$q_sroa_0_1_lcssa;$q_sroa_0_0_insert_ext75$1=0;if(($rem|0)!=0){HEAP32[$rem>>2]=$r_sroa_0_1_lcssa;HEAP32[$rem+4>>2]=$r_sroa_1_1_lcssa}$_0$1=($q_sroa_0_0_insert_ext75$0|0)>>>31|($q_sroa_1_1_lcssa|$q_sroa_0_0_insert_ext75$1)<<1|($q_sroa_0_0_insert_ext75$1<<1|$q_sroa_0_0_insert_ext75$0>>>31)&0|$carry_0_lcssa$1;$_0$0=($q_sroa_0_0_insert_ext75$0<<1|0>>>31)&-2|$carry_0_lcssa$0;return(tempRet0=$_0$1,$_0$0)|0}function dynCall_ii(index,a1){index=index|0;a1=a1|0;return FUNCTION_TABLE_ii[index&1](a1|0)|0}function dynCall_v(index){index=index|0;FUNCTION_TABLE_v[index&1]()}function dynCall_iii(index,a1,a2){index=index|0;a1=a1|0;a2=a2|0;return FUNCTION_TABLE_iii[index&1](a1|0,a2|0)|0}function dynCall_vi(index,a1){index=index|0;a1=a1|0;FUNCTION_TABLE_vi[index&1](a1|0)}function b0(p0){p0=p0|0;abort(0);return 0}function b1(){abort(1)}function b2(p0,p1){p0=p0|0;p1=p1|0;abort(2);return 0}function b3(p0){p0=p0|0;abort(3)}
// EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_ii = [b0,b0];
  var FUNCTION_TABLE_v = [b1,b1];
  var FUNCTION_TABLE_iii = [b2,b2];
  var FUNCTION_TABLE_vi = [b3,b3];
  return { _strlen: _strlen, _main: _main, _peek: _peek, _memset: _memset, _scanPort: _scanPort, _memcpy: _memcpy, _readPort: _readPort, _poke: _poke, _sendPort: _sendPort, _advance: _advance, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_iii: dynCall_iii, dynCall_vi: dynCall_vi };
})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_ii": invoke_ii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "invoke_vi": invoke_vi, "_lseek": _lseek, "_malloc": _malloc, "__scanString": __scanString, "_random": _random, "_fclose": _fclose, "_fprintf": _fprintf, "_pread": _pread, "__isFloat": __isFloat, "_close": _close, "_fflush": _fflush, "_fopen": _fopen, "__reallyNegative": __reallyNegative, "_open": _open, "___setErrNo": ___setErrNo, "_fwrite": _fwrite, "_fseek": _fseek, "_send": _send, "_write": _write, "_fgetc": _fgetc, "_ftell": _ftell, "_fcntl": _fcntl, "_fread": _fread, "_read": _read, "__formatString": __formatString, "_free": _free, "_recv": _recv, "_fileno": _fileno, "_pwrite": _pwrite, "_fsync": _fsync, "_fscanf": _fscanf, "_ungetc": _ungetc, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity, "_stdin": _stdin }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _main = Module["_main"] = asm["_main"];
var _peek = Module["_peek"] = asm["_peek"];
var _memset = Module["_memset"] = asm["_memset"];
var _scanPort = Module["_scanPort"] = asm["_scanPort"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _readPort = Module["_readPort"] = asm["_readPort"];
var _poke = Module["_poke"] = asm["_poke"];
var _sendPort = Module["_sendPort"] = asm["_sendPort"];
var _advance = Module["_advance"] = asm["_advance"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// TODO: strip out parts of this we do not need
//======= begin closure i64 code =======
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */
var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };
  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0;  // force into 32 signed bits.
    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0;  // force into 32 signed bits.
  };
  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};
  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }
    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };
  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };
  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };
  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.
  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;
  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);
  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);
  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };
  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };
  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (this.isZero()) {
      return '0';
    }
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };
  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };
  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };
  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };
  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };
  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };
  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };
  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };
  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }
    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }
    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };
  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };
  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };
  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }
    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }
      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }
      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };
  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };
  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };
  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };
  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };
  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };
  //======= begin jsbn =======
  var navigator = { appName: 'Modern Browser' }; // polyfill a little
  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/
  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);
  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }
  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }
  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y);	// "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }
  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3;		// y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }
  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }
  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }
  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2)	// pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // jsbn2 stuff
  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }
  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }
  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;
  //======= end jsbn =======
  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();
//======= end closure i64 code =======
// === Auto-generated postamble setup entry stuff ===
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + (new Error().stack);
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
(function() {
function assert(check, msg) {
  if (!check) throw msg + new Error().stack;
}
    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);
        if (this.crunched) {
          var ddsHeader = byteArray.subarray(0, 128);
          var that = this;
          requestDecrunch(this.name, byteArray.subarray(128), function(ddsData) {
            byteArray = new Uint8Array(ddsHeader.length + ddsData.length);
            byteArray.set(ddsHeader, 0);
            byteArray.set(ddsData, 128);
            that.finish(byteArray);
          });
        } else {
          this.finish(byteArray);
        }
      },
      finish: function(byteArray) {
        var that = this;
        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Runtime.warn('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        this.requests[this.name] = null;
      },
    };
      new DataRequest(0, 73728, 0, 0).open('GET', '/Core.bin');
    if (!Module.expectedDataFileDownloads) {
      Module.expectedDataFileDownloads = 0;
      Module.finishedDataFileDownloads = 0;
    }
    Module.expectedDataFileDownloads++;
    var PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    var PACKAGE_NAME = '/static/agc.data';
    var REMOTE_PACKAGE_NAME = '/static/agc.data';
    var PACKAGE_UUID = '30dc62bf-cee8-4c41-b500-d2548b06823c';
    function fetchRemotePackage(packageName, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        if (event.loaded && event.total) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: event.total
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/Core.bin"].onload();
          Module['removeRunDependency']('datafile_agc.data');
    };
    Module['addRunDependency']('datafile_agc.data');
    function handleError(error) {
      console.error('package error:', error);
    };
    if (!Module.preloadResults)
      Module.preloadResults = {};
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      fetchRemotePackage(REMOTE_PACKAGE_NAME, processPackageData, handleError);
})();
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}
