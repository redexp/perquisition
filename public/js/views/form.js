define('views/form', [
	'view'
], function (
	View
) {

	function Form() {
		View.apply(this, arguments);

		this.callbacks = {};
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
			this.callbacks.save = params.save;

			this.set('state', 'open');
			this.trigger('open', params);
		},

		close: function () {
			this.set('state', 'close');
			this.trigger('close');
		},

		submit: function (e) {
			e.preventDefault();

			var data = this.getValues();

			if (this.validate(data)) {
				this.save(data);
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
			data = data || this.getValues();

			this.set('state', 'saving');
			this.trigger('save', data);

			var save = this.callbacks.save;

			if (!save) return;

			var form = this;

			if (save.length === 2) {
				save(data, function () {
					form.close();
				});
			}
			else {
				save(data);
				form.close();
			}
		},

		callCallback: function (name) {
			if (this.callbacks[name] && this.callbacks.hasOwnProperty(name)) {
				this.callbacks[name].apply(this, Array.prototype.slice.call(arguments, 1));
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
					'submit': 'submit'
				}
			},

			'@submit': {
				prop: {
					'disabled': {
						'@state': function (state) {
							return state === 'saving';
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