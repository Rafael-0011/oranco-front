import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the error dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should display string error message', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('error', 'Falha ao salvar produto');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-message')?.textContent).toContain('Falha ao salvar produto');
  });

  it('should display HttpErrorResponse details and status badge', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {
        message: 'Produto já existe',
        errors: ['Código de barras duplicado']
      }
    });

    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('error', error);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-message')?.textContent).toContain('Produto já existe');
    expect(compiled.querySelector('.badge-code')?.textContent).toContain('400');
    expect(compiled.querySelector('.error-details-box')?.textContent).toContain('Código de barras duplicado');
  });

  it('should close dialog and emit confirmed on dismiss', () => {
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    let emitted = false;
    component.confirmed.subscribe(() => {
      emitted = true;
    });

    (component as any).onDismiss();
    expect(component.visible()).toBe(false);
    expect(emitted).toBe(true);
  });
});
