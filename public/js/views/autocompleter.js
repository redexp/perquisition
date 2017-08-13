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

		this.paginator = new Paginator({
			node: this.find('[data-paginator]')
		});

		this.listenOn(this.paginator, 'set/page', function (page) {
			this.set({
				page: page,
				offset: (page - 1) * this.data.limit
			});
		});

		this.on('set/offset', this.updateList);
		this.on('set/value open', utils.debounce(300, this.updateList));
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
				limit: 10
			};
		},

		ui: {
			empty: '[data-empty]',
			list: '[data-list]'
		},

		open: function (options) {
			this.callbacks.change = options.change;
			this.callbacks.clear = options.clear;

			if (this.input && this.input.get(0) === options.input.get(0)) return;

			if (this.input) {
				this.stopListening(this.input);
			}

			this.input = options.input;

			this.node.insertAfter(this.input);

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

			this.listenOn(this.input, 'keyup', function () {
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
			if (this.input) {
				if (!this.data.item) {
					this.input.val(this.data.defaultValue);
				}
				this.stopListening(this.input);
				this.input = null;
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
			return this.callbacks.getList({
				value: this.data.value,
				offset: this.data.offset,
				limit: this.data.limit
			});
		},

		getItemTitle: function (item) {
			return this.callbacks.getItemTitle(item);
		},

		selectItem: function (item) {
			this.callbacks.change(item);
			this.set('item', item);
			this.input.val(this.getItemTitle(item));
			this.close();
		},

		focusInput: function () {
			if (this.input) this.input.focus();
		},

		template: {
			'@root': {
				visible: '@visible',
				on: {
					'click': 'focusInput'
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