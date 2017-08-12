define('views/paginator', [
	'view'
], function (
	View
) {

	function Paginator() {
		View.apply(this, arguments);

		this.on('@count set/page', function () {
			var pagesCount = this.getPagesCount(),
				page = this.data.page,
				dots = this.data.dots;

			var before = [],
				middle = [],
				after = [];

			var i, len;

			if (pagesCount < 13) { // ||||
				for (i = 1, len = pagesCount; i <= len; i++) {
					before.push(i);
				}
			}
			else if (page < 7) { // |||||..||
				for (i = 1, len = Math.max(5, page + 2); i <= len; i++) {
					before.push(i);
				}
				before.push(dots);
				for (i = pagesCount - 1, len = pagesCount; i <= len; i++) {
					after.push(i);
				}
			}
			else if (page >= pagesCount - 5) { // ||..|||||
				for (i = 1, len = 2; i <= len; i++) {
					before.push(i);
				}
				before.push(dots);
				for (i = Math.min(page - 2, pagesCount - 4), len = pagesCount; i <= len; i++) {
					after.push(i);
				}
			}
			else { // ||..|||||..||
				for (i = 1, len = 2; i <= len; i++) {
					before.push(i);
				}
				before.push(dots);
				for (i = page - 2, len = page + 2; i <= len; i++) {
					middle.push(i);
				}
				after.push(dots);
				for (i = pagesCount - 1, len = pagesCount; i <= len; i++) {
					after.push(i);
				}
			}

			this.model('pages').reset(before.concat(middle, after));

			if (this.data.hideOnZeroCount) {
				this.set('visible', this.data.pages.length > 1);
			}
		});
	}

	View.extend({
		constructor: Paginator,

		data: function () {
			return {
				pages: [],
				page: 1,
				count: 0,
				limit: 10,
				dots: '...',
				visible: false,
				hideOnZeroCount: true
			};
		},

		ui: {
			pages: '@root'
		},

		getPagesCount: function () {
			return Math.ceil(this.data.count / this.data.limit);
		},

		setPage: function (page) {
			if (page === this.data.dots) return;

			this.set('page', page);
		},

		template: {
			'@root': {
				visible: '@visible'
			},

			'@pages': {
				each: {
					prop: 'pages',
					view: Page
				}
			}
		}
	});

	function Page() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Page,

		data: {
			value: 0
		},

		ui: {
			pageNumber: '[data-page-number]'
		},

		setPage: function () {
			this.parent.setPage(this.data.value);
		},

		template: {
			'@root': {
				toggleClass: {
					'active': function () {
						return this.data.value === this.parent.data.page;
					},

					'disabled': function () {
						return this.data.value === this.parent.data.dots;
					}
				},

				on: {
					'click': '!setPage'
				}
			},

			'@pageNumber': {
				text: '=value'
			}
		}
	});

	return Paginator;
});