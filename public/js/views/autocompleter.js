define('views/autocompleter', [
	'view',
	'views/paginator',
	'utils'
], function (
	View,
	Paginator,
	utils
) {

	function Autocompleter(options) {
		View.apply(this, arguments);

		this.callbacks = {};
		this.callbacks.getList = options.getList;
		this.callbacks.getItemTitle = options.getItemTitle;

		this.options = {};
		this.options.titleProp = options.titleProp;
		this.options.hiddenProp = options.hiddenProp;
		this.options.asHint = options.asHint;

		this.paginator = new Paginator({
			node: this.find('[data-paginator]')
		});

		this.listenOn(this.paginator, 'set/page', function (page) {
			this.set({
				page: page,
				offset: (page - 1) * this.data.limit
			});
		});

		this.on('set/visible', function (visible) {
			if (!visible) {
				this.set('left', 0);
				this.node.detach();
			}
			else {
				this.node.insertAfter(this.input);

				var inp = this.input.get(0).getBoundingClientRect(),
					dd = this.ui.dropdown.get(0).getBoundingClientRect();

				this.set('left', inp.left - dd.left);
			}
		});
		this.on('set/value', function (value) {
			var item = this.data.item;
			if (item && this.data.visible && value !== this.getItemTitle(item)) {
				this.set('item', null);
			}
		});
		this.on('open set/offset', this.updateList);
		this.on('set/value', utils.debounce(300, function () {
			if (this.data.visible) {
				this.updateList();
			}
		}));
		this.on('set/item', function (item) {
			if (item === null) {
				this.hidden && this.hidden.val('');
			}
			else {
				this.input.val(this.getItemTitle(item));
				this.hidden && this.hidden.val(this.getHiddenValue(item));
			}
		});

		if (options.input) {
			this.listenOn(options.input, 'focus', function () {
				this.open({
					input: options.input,
					hidden: options.hidden
				});
			});
		}

		this.node.detach();
	}

	View.extend({
		constructor: Autocompleter,

		data: function () {
			return {
				visible: false,
				empty: false,
				list: [],
				item: null,
				defaultValue: '',
				value: '',
				page: 1,
				offset: 0,
				limit: 10,
				left: 0
			};
		},

		ui: {
			dropdown: '[data-dropdown]',
			list: '[data-list]',
			empty: '[data-empty]'
		},

		open: function (options) {
			this.callbacks.change = options.change;
			this.callbacks.clear = options.clear;

			this.options.query = options.query;

			if (
				this.input &&
				this.input.get(0) === options.input.get(0)
			) {
				this.node.insertAfter(this.input);
				this.trigger('open');
				return;
			}

			if (this.input) {
				this.stopListening(this.input);
			}

			this.input = options.input;
			this.hidden = options.hidden;

			this.set({
				defaultValue: this.input.val(),
				value: this.input.val(),
				item: null
			});
			this.model('list').removeAll();
			this.paginator.set({
				count: 0,
				page: 1
			});

			this.listenOn(this.input, 'keyup', function (e) {
				this.set('value', this.input.val());
			});

			this.listenOn(this.input, 'blur', utils.debounce(100, function () {
				if (this.input && !this.input.is(':focus')) {
					this.close();
				}
			}));

			this.trigger('open');
		},

		close: function () {
			this.set('visible', false);
			this.model('list').removeAll();

			if (!this.options.asHint && !this.data.item) {
				this.set('value', this.data.defaultValue);
				this.input.val(this.data.defaultValue);
			}
		},

		updateList: function () {
			var view = this;

			return this.getList().then(function (list) {
				if (list.rows) {
					view.model('list').reset(list.rows);
					view.paginator.set('count', list.count);
				}
				else {
					view.model('list').reset(list);
					view.paginator.set('visible', false);
				}

				view.set('visible', true);
				view.set('empty', view.data.list.length === 0);

				return list;
			});
		},

		getList: function () {
			var query = {
				offset: this.data.offset,
				limit: this.data.limit
			};

			query[this.options.titleProp || 'value'] = this.data.value;

			if (this.options.query) {
				utils.extend(query, this.options.query);
			}

			return this.callbacks.getList(query);
		},

		getItemTitle: function (item) {
			if (this.callbacks.getItemTitle) {
				return this.callbacks.getItemTitle(item);
			}
			else if (this.options.titleProp) {
				return item[this.options.titleProp];
			}
		},

		getHiddenValue: function (item) {
			return item[this.options.hiddenProp];
		},

		selectItem: function (item) {
			this.set('item', item);
			this.callbacks.change && this.callbacks.change(item);
			this.close();
		},

		template: {
			'@root': {
				visible: '@visible'
			},

			'@dropdown': {
				style: {
					'left': '@left'
				}
			},

			'@list': {
				each: {
					prop: 'list',
					view: Item,
					viewProp: 'item'
				}
			},

			'@empty': {
				visible: '@empty'
			}
		}
	});

	function Item() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Item,

		ui: {
			title: '@root'
		},

		selectItem: function () {
			this.parent.selectItem(this.data.item);
		},

		template: {
			'@root': {
				on: {
					'click': '!selectItem'
				}
			},

			'@title': {
				text: function () {
					return this.parent.getItemTitle(this.data.item);
				}
			}
		}
	});

	Autocompleter.Item = Item;

	return Autocompleter;
});