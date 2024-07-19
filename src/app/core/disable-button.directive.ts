import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
    selector: '[myButtonDisable]'
})
export class DisableButtonDirective implements OnInit {

    //showLoginMessage
    @Input()
    appDisableButton?: boolean;

    //ElementRef and Renderer2
    //<button [cartDisableButton]>
    //add css, remove css, add and remove html attribute
    constructor(private el: ElementRef, private renderer: Renderer2) {

    }


    ngOnInit(): void {
        this.updateButtonState();
    }


    //button
    private updateButtonState() {
        if (this.appDisableButton) {
            this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
        } else {
            this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
        }
    }
}