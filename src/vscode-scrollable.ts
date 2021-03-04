import { LitElement, html, css, property, customElement, CSSResult, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('vscode-scrollable')
export class VscodeScrollable extends LitElement {
  @property({ type: Boolean }) shadow = true;
  @property({ type: Boolean, reflect: false }) scrolled = false;

  private scrollableContainer: HTMLDivElement | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.requestUpdate().then(() => {
      this.scrollableContainer = this.shadowRoot?.querySelector('.scrollable-container') as HTMLDivElement;
      this.scrollableContainer.addEventListener(
        'scroll',
        this.onScrollableContainerScroll.bind(this)
      );
    });
  }

  private onScrollableContainerScroll() {
    this.scrolled = (this.scrollableContainer as HTMLDivElement).scrollTop > 0;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        position: relative;
      }

      .scrollable-container {
        height: 100%;
        overflow: auto;
      }

      .scrollable-container::-webkit-scrollbar {
        cursor: default;
        width: 10px;
      }

      .scrollable-container::-webkit-scrollbar-button {
        display: none;
      }

      .scrollable-container:hover::-webkit-scrollbar-button {
        display: none;
      }

      .scrollable-container::-webkit-scrollbar-track {
        background-color: transparent;
        width: 10px;
      }

      .scrollable-container::-webkit-scrollbar-thumb {
        background-color: transparent;
      }

      .scrollable-container:hover::-webkit-scrollbar-thumb {
        background-color: var(--vscode-scrollbarSlider-background);
      }

      .scrollable-container:hover::-webkit-scrollbar-thumb:hover {
        background-color: var(--vscode-scrollbarSlider-hoverBackground);
      }

      .scrollable-container:hover::-webkit-scrollbar-thumb:active {
        background-color: var(--vscode-scrollbarSlider-activeBackground);
      }

      .shadow {
        box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
        display: none;
        height: 3px;
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 0;
        z-index: 1;
        width: 100%;
      }

      .shadow.visible {
        display: block;
      }

      .content {
        overflow: hidden;
      }
    `;
  }

  render(): TemplateResult {
    const shadowClasses = classMap({ shadow: true, visible: this.scrolled });

    return html`
      <div class="scrollable-container">
        <div class="${shadowClasses}"></div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vscode-scrollable': VscodeScrollable;
  }
}
