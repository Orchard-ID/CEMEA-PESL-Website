/* jshint node: true, esversion: 6 */
/* global CKEDITOR */
module.exports = function (template) {
	var inc = 0;

	return {
		name: 'ckeditor',
		template: template,
		props: {
			value: {
				type: String
			},
			global: {
				type: Object,
				default: function () {
					return {};
				}
			},
			id: {
				type: String,
				default: function () {
					return 'editor-' + (++inc);
				}
			},
			types: {
				type: String,
				default: function () {
					return 'classic';
				}
			},
			mode: {
				type: Number,
				default: function () {
					return 2;
				}
			},
			empty: {
				type: String,
				default: function () {
					return '&nbsp;&nbsp;';
				}
			},
			config: {
				type: Object,
				default: function () {
					return {};
				}
			}
		},
		computed: {
			instance: function () {
				return CKEDITOR.instances[this.id];
			}
		},
		beforeUpdate: function () {
			if (this.value !== this.instance.getData()) {
				this.instance.setData(this.value);
			}
		},
		mounted: function () {
			var config = {
				entities_latin: false,
				entities_additional: '',
				fillEmptyBlocks: false,
				enterMode: this.mode
			};

			if (config.enterMode !== 1) {
				config.toolbar = [
					{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
					'/',
					{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
					{ name: 'insert', items: [ 'Image', 'SpecialChar' ] },
					'/',
					{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] }
				];
			}

			if (this.types === 'inline') {
				CKEDITOR.inline(this.id, Object.assign({}, config, this.config));
			} else {
				CKEDITOR.replace(this.id, Object.assign({}, config, this.config));
			}
			this.instance.on('blur', () => {
				console.log(this.empty);
				var data = this.instance.getData().replace(/^(&nbsp;)+$/g, '');
				if (!data) {
					this.instance.setData(this.empty);
				}
				//console.log('test', data, !!data);
			});
			this.instance.on('change', () => {
				var html = this.instance.getData();
				if (html !== this.value) {
					this.$emit('input', html);
				}
			});
		},
		beforeDestroy: function () {
			if (this.instance) {
				this.instance.focusManager.blur(true);
				this.instance.removeAllListeners();
				this.instance.destroy();
				this.instance = null;
			}
		}
	};
};