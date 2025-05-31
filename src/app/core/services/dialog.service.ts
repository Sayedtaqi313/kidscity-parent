// confirm.service.ts
import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogComponentRef?: ComponentRef<DialogComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(
    message: string,
    title = 'Confirm',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.destroyExistingDialog();

      const factory =
        this.componentFactoryResolver.resolveComponentFactory(DialogComponent);

      this.dialogComponentRef = factory.create(this.injector);
      const instance = this.dialogComponentRef.instance;

      instance.title = title;
      instance.message = message;
      instance.confirmText = confirmText;
      instance.cancelText = cancelText;

      instance.confirmed.subscribe((result) => {
        this.destroyDialog();
        resolve(result);
      });

      this.appRef.attachView(this.dialogComponentRef.hostView);
      const domElem = (this.dialogComponentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    });
  }

  private destroyExistingDialog() {
    if (this.dialogComponentRef) {
      this.destroyDialog();
    }
  }

  private destroyDialog() {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = undefined;
    }
  }
}
