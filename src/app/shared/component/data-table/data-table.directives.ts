import { Directive, TemplateRef, inject, input } from '@angular/core';
import { CellContext } from './data-table.types';

/** <ng-template appCell="status" let-row let-value="value">...</ng-template> */
@Directive({ selector: 'ng-template[appCell]' })
export class CellTemplateDirective {
  readonly field = input.required<string>({ alias: 'appCell' });
  readonly template = inject<TemplateRef<CellContext>>(TemplateRef);
}

/** <ng-template appRowActions let-row>...botões...</ng-template> */
@Directive({ selector: 'ng-template[appRowActions]' })
export class RowActionsTemplateDirective {
  readonly template = inject<TemplateRef<{ $implicit: any }>>(TemplateRef);
}
