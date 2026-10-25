import { DestroyRef, Directive, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/** Mensagens padrão (pt-BR) por tipo de erro de validação. */
const DEFAULT_MESSAGES: Record<string, (e: any) => string> = {
  required: () => 'Este campo é obrigatório.',
  email: () => 'Informe um e-mail válido.',
  minlength: (e) => `Mínimo de ${e.requiredLength} caracteres.`,
  maxlength: (e) => `Máximo de ${e.requiredLength} caracteres.`,
  min: (e) => `O valor mínimo é ${e.min}.`,
  max: (e) => `O valor máximo é ${e.max}.`,
  pattern: () => 'Formato inválido.',
};

/**
 * Base para campos de formulário reutilizáveis (input, select, ...).
 * Implementa ControlValueAccessor e exibe a mensagem de erro automaticamente.
 */
@Directive()
export abstract class BaseControl<T = unknown> implements ControlValueAccessor, OnInit {
  protected readonly ngControl = inject(NgControl, { self: true, optional: true });

  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly required = input<boolean>(false);
  readonly controlId = input<string>(`app-field-${nextId++}`);
  /** Sobrescreve mensagens por tipo de erro. Ex.: { required: 'Informe o nome' } */
  readonly errorMessages = input<Record<string, string>>({});

  private readonly destroyRef = inject(DestroyRef);
  /** Incrementa quando o FormControl muda (touched, status, valor) — mantém OnPush atualizado. */
  private readonly controlTick = signal(0);

  readonly value = signal<T | null>(null);
  readonly disabled = signal(false);

  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.ngControl?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlTick.update((n) => n + 1));
  }

  /** Mensagem de erro (somente após o campo ser tocado). */
  get errorText(): string | null {
    this.controlTick(); // dependência reativa para OnPush
    const control = this.ngControl?.control;
    if (!control || !control.touched || !control.errors) return null;
    const [key, err] = Object.entries(control.errors)[0];
    return this.errorMessages()[key] ?? DEFAULT_MESSAGES[key]?.(err) ?? 'Valor inválido.';
  }

  writeValue(value: T | null): void { this.value.set(value); }
  registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  protected update(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }
  markTouched(): void { this.onTouched(); }
}
