webpackJsonp([1],{

/***/ 571:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _BaseController = __webpack_require__(513);

	var _BaseController2 = _interopRequireDefault(_BaseController);

	var _view = __webpack_require__(572);

	var _view2 = _interopRequireDefault(_view);

	var _model = __webpack_require__(573);

	var actions = _interopRequireWildcard(_model);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _class = function (_Controller) {
	    _inherits(_class, _Controller);

	    function _class() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, _class);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.name = 'List', _this.View = _view2.default, _this.actions = actions, _this.initialState = {
	            topics: [],
	            showMenu: false,
	            searchKey: {
	                page: 1,
	                limit: 20,
	                tab: 'all',
	                mdrender: true
	            },
	            userInfo: {}
	        }, _this.methods = {
	            openMenu: function openMenu() {
	                var SET_MENU_STATUS = this.store.actions.SET_MENU_STATUS;


	                SET_MENU_STATUS(true);
	            },
	            closeMenu: function closeMenu() {
	                var SET_MENU_STATUS = this.store.actions.SET_MENU_STATUS;


	                SET_MENU_STATUS(false);
	            },
	            handleScroll: function handleScroll() {
	                var FETCH_NEXT_TOPICS = this.store.actions.FETCH_NEXT_TOPICS;

	                var scrollHeight = window.innerHeight + window.scrollY;
	                var pageHeight = document.body.clientHeight + document.body.scrollHeight;

	                if (pageHeight - scrollHeight <= 200) {
	                    FETCH_NEXT_TOPICS();
	                }
	            }
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    return _class;
	}(_BaseController2.default);

	exports.default = _class;

/***/ }

});