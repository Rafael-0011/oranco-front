import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model, output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-search-box',
  imports: [InputTextModule, IconFieldModule, InputIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-iconfield>
      <p-inputicon class="pi pi-search" />
      <input
        pInputText type="text"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-label]="placeholder()"
        (input)="onInput($event)"
      />
    </p-iconfield>
  `,
  styles: `:host { display: inline-block; } input { min-width: 18rem; max-width: 100%; }`,
})
export class SearchBoxComponent {
  readonly placeholder = input<string>('Buscar...');
  /** Atraso (ms) antes de emitir a busca. */
  readonly debounce = input<number>(250);
  readonly value = model<string>('');
  readonly search = output<string>();

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.value.set(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search.emit(text), this.debounce());
  }
}
