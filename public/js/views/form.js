define('views/form', [
	'view',
	'jquery'
], function (
	View,
	$
) {

	function Form() {
		View.apply(this, arguments);

		this.callbacks = {};

		this.listenOn(this.model('errors'), 'add', this.showError);
		this.listenOn(this.model('errors'), 'remove', this.hideError);
	}

	View.extend({
		constructor: Form,

		ui: {
			form: '@root',
			submit: '[data-submit], [type="submit"]'
		},

		data: function () {
			return {
				state: 'close',
				errors: []
			};
		},

		open: function (params) {
			this.context = params.context;

			if (params.save) {
				this.callbacks.save = params.save;
			}

			this.model('errors').removeAll();

			this.set('state', 'open');
			this.trigger('open', params);
		},

		close: function () {
			this.set('state', 'close');
			this.trigger('close');

			if (this.callbacks.close) {
				this.callbacks.close();
			}
		},

		submit: function () {
			var data = this.getValues();

			if (this.validate(data)) {
				this.save(data);
			}
			else {
				this.set('state', 'error');
			}
		},

		getValues: function () {
			return deparam(this.ui.form.find(':input'));
		},

		validate: function (data) {
			data = data || this.getValues();

			var errors = [];

			this.trigger('validate', data, errors);
			this.callCallback('validate', data, errors);

			this.model('errors').reset(errors);

			return errors.length === 0;
		},

		save: function (data) {
			this.set('state', 'saving');

			data = data || this.getValues();

			this.trigger('save', data);

			var save = this.callbacks.save;

			if (!save) return;

			var form = this;

			var done = function (err) {
				if (
					err === false ||
					err instanceof Error ||
					(
						err &&
						err.responseText &&
						typeof err.status === 'number' &&
						err.status !== 200
					)
				) {
					form.set('state', 'error');
					console.error(err);
				}
				else {
					form.close();
				}
			};

			if (save.length === 2) {
				save(data, done);
			}
			else {
				var p = save(data);

				if (p && typeof p.then === 'function') {
					p.then(done, done);
				}
				else {
					form.close();
				}
			}
		},

		callCallback: function (name) {
			if (this.callbacks[name] && this.callbacks.hasOwnProperty(name)) {
				this.callbacks[name].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},

		showError: function (error) {
			this.getErrorNode(error).addClass('error visible');
		},

		hideError: function (error) {
			this.getErrorNode(error).removeClass('visible');
		},

		getErrorNode: function (error) {
			if (typeof error === 'string') {
				return this.find(error);
			}
			else if (error instanceof $) {
				return error;
			}
			else {
				return error.node;
			}
		},

		propValueTemplateOf: function (modelName) {
			var tpl = {};
			var props = this.get(modelName);

			for (var prop in props) {
				if (!props.hasOwnProperty(prop)) continue;

				tpl['[name="' + prop + '"]'] = {
					prop: {
						'value': '@' + modelName + '.' + prop
					}
				};
			}

			return tpl;
		},

		template: {
			'@root': {
				attr: {
					'data-form-state': '@state'
				}
			},

			'@form': {
				on: {
					'submit': '!submit'
				}
			},

			'@submit': {
				prop: {
					'disabled': {
						'@state': function (state) {
							return state === 'saving';
						}
					}
				},

				toggleClass: {
					'btn-danger': {
						'@state': function (state) {
							return state === 'error';
						}
					}
				}
			}
		}
	});

	function deparam(inputs){
		var digit = /^\d+$/,
			keyBreaker = /([^\[\]]+)|(\[\])/g,
			data = {};

		for (var i = 0, iLen = inputs.length; i < iLen; i++) {
			var current = data,
				input = inputs[i];

			if (
				(input.type === 'radio' || input.type === 'checkbox') &&
				input.checked === false
			) {
				continue;
			}

			if (!input.name) continue;

			var value = input.value,
				parts = input.name.match(keyBreaker);

			for (var j = 0, jLen = parts.length - 1; j < jLen; j++) {
				var part = parts[j];

				if (!current[part]) {
					current[part] = parts[j + 1] === "[]" || digit.test(parts[j + 1]) ? [] : {}
				}

				current = current[part];
			}

			var lastPart = parts[jLen];

			if (lastPart === "[]") {
				current.push(value)
			}
			else {
				current[lastPart] = value;
			}
		}

		return data;
	}

	return Form;
});