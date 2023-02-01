"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _actions = require("./actions");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Adds query to location.
 * Utilises the search prop of location to construct query.
 */
var injectQuery = function injectQuery(location) {
  if (location && location.query) {
    // Don't inject query if it already exists in history
    return location;
  }
  var searchQuery = location && location.search;
  if (typeof searchQuery !== 'string' || searchQuery.length === 0) {
    return _objectSpread(_objectSpread({}, location), {}, {
      query: {}
    });
  }

  // Ignore the `?` part of the search string e.g. ?username=codejockie
  var search = searchQuery.substring(1);
  // Split the query string on `&` e.g. ?username=codejockie&name=Kennedy
  var queries = search.split('&');
  // Contruct query
  var query = queries.reduce(function (acc, currentQuery) {
    // Split on `=`, to get key and value
    var _currentQuery$split = currentQuery.split('='),
      _currentQuery$split2 = _slicedToArray(_currentQuery$split, 2),
      queryKey = _currentQuery$split2[0],
      queryValue = _currentQuery$split2[1];
    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, queryKey, queryValue));
  }, {});
  return _objectSpread(_objectSpread({}, location), {}, {
    query: query
  });
};
var createConnectRouter = function createConnectRouter(structure) {
  var fromJS = structure.fromJS,
    merge = structure.merge;
  var createRouterReducer = function createRouterReducer(history) {
    var initialRouterState = fromJS({
      location: injectQuery(history.location),
      action: history.action
    });

    /*
    * This reducer will update the state with the most recent location history
    * has transitioned to.
    */
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialRouterState;
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref.type,
        payload = _ref.payload;
      if (type === _actions.LOCATION_CHANGE) {
        var location = payload.location,
          action = payload.action,
          isFirstRendering = payload.isFirstRendering;
        // Don't update the state ref for the first rendering
        // to prevent the double-rendering issue on initilization
        return isFirstRendering ? state : merge(state, {
          location: fromJS(injectQuery(location)),
          action: action
        });
      }
      return state;
    };
  };
  return createRouterReducer;
};
var _default = createConnectRouter;
exports["default"] = _default;