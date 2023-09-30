import {html, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {FormButtonWidgetBase} from '../includes/form-button-widget/FormButtonWidgetBase.js';
import {LabelledCheckboxOrRadioMixin} from '../includes/form-button-widget/LabelledCheckboxOrRadio.js';
import styles from './vscode-checkbox.styles.js';

/**
 * @attr name - Name which is used as a variable name in the data of the form-container.
 * @attr label - Attribute pair of the `label` property.
 * @prop label - Label text. It is only applied if componnet's innerHTML doesn't contain any text.
 *
 * @cssprop [--font-family=var(--vscode-font-family)]
 * @cssprop [--font-size=var(--vscode-font-size)]
 * @cssprop [--font-weight=var(--vscode-font-weight)]
 * @cssprop [--foreground=var(--vsc-foreground-translucent)] - Label font color. 90% transparency version of `--vscode-foreground` by default.
 * @cssprop [--icon-background=var(--vscode-settings-checkboxBackground)]
 * @cssprop [--icon-border=var(--vscode-settings-checkboxBorder)]
 * @cssprop [--icon-foreground=var(--vscode-settings-checkboxForeground)]
 * @cssprop [--focus-border=var(--vscode-focusBorder)]
 */
@customElement('vscode-checkbox')
export class VscodeCheckbox extends LabelledCheckboxOrRadioMixin(
  FormButtonWidgetBase
) {
  static styles = styles;

  static formAssociated = true;

  @property({type: Boolean, reflect: true})
  set checked(val: boolean) {
    this._checked = val;
    this._indeterminate = false;
    this.setAttribute('aria-checked', val ? 'true' : 'false');
  }
  get checked(): boolean {
    return this._checked;
  }

  @property({reflect: true})
  name: string | undefined = undefined;

  @property({reflect: true})
  role = 'checkbox';

  @property()
  value = '';

  @property({type: Boolean, reflect: true})
  disabled = false;

  @property({type: Boolean, reflect: true})
  set indeterminate(val: boolean) {
    this._indeterminate = val;
  }
  get indeterminate(): boolean {
    return this._indeterminate;
  }

  @property({type: Boolean, reflect: true})
  required = false;

  get form(): HTMLFormElement | null {
    return this._internals.form;
  }

  get type(): 'checkbox' {
    return 'checkbox';
  }

  get validity(): ValidityState {
    return this._internals.validity;
  }

  get validationMessage(): string {
    return this._internals.validationMessage;
  }

  get willValidate(): boolean {
    return this._internals.willValidate;
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-checked', this._checked ? 'true' : 'false');
    this._manageRequired();
  }

  @state()
  private _checked = false;

  @state()
  private _indeterminate = false;

  private _internals: ElementInternals;

  private _setOfferedFormValue() {
    let providedValue = '';

    if (this.checked) {
      providedValue = !this.value ? 'on' : this.value;
    }

    this._internals.setFormValue(providedValue);
  }

  protected _handleClick(): void {
    if (this.disabled) {
      return;
    }

    this._checked = !this._checked;
    this._indeterminate = false;
    this.setAttribute('aria-checked', this._checked ? 'true' : 'false');

    this.dispatchEvent(
      new CustomEvent('vsc-change', {
        detail: {
          checked: this._checked,
          label: this.label,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );

    this._setOfferedFormValue();
    this._manageRequired();
  }

  protected _handleKeyDown(ev: KeyboardEvent): void {
    if (!this.disabled && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      this._checked = !this._checked;
      this.setAttribute('aria-checked', this._checked ? 'true' : 'false');
      // TODO: dispatch event

      this._setOfferedFormValue();
      this._manageRequired();
    }
  }

  private _manageRequired() {
    if (!this.checked && this.required) {
      this._internals.setValidity(
        {
          valueMissing: true,
        },
        'Please check this box if you want to proceed.'
      );
    } else {
      this._internals.setValidity({});
    }
  }

  render(): TemplateResult {
    const iconClasses = classMap({
      icon: true,
      checked: this._checked,
      indeterminate: this._indeterminate,
    });
    const labelInnerClasses = classMap({
      'label-inner': true,
    });

    const icon = html`<svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
      />
    </svg>`;
    const check = this._checked && !this._indeterminate ? icon : nothing;
    const indeterminate = this._indeterminate
      ? html`<span class="indeterminate-icon"></span>`
      : nothing;

    return html`
      <div class="wrapper">
        <input
          id="${this._uid}"
          class="checkbox"
          type="checkbox"
          ?checked="${this._checked}"
          value="${this.value}"
          tabindex="-1"
        />
        <div class="${iconClasses}">${indeterminate}${check}</div>
        <label for="${this._uid}" class="label" @click="${this._handleClick}">
          <span class="${labelInnerClasses}">
            ${this._renderLabelAttribute()}
            <slot @slotchange="${this._handleSlotChange}"></slot>
          </span>
        </label>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-checkbox': VscodeCheckbox;
  }
}
