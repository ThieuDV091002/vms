import { LocalizationService } from '@abp/ng.core';
import { inject, Injectable, ComponentFactoryResolver, Type } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomErrorComponent } from '../components/custom-error/custom-error.component';
import { HttpErrorResponse } from "@angular/common/http";
import { CustomHttpErrorHandlerService } from "@abp/ng.theme.shared";
import { CUSTOM_HTTP_ERROR_HANDLER_PRIORITY } from "@abp/ng.theme.shared";
import { ToasterService } from "@abp/ng.theme.shared";

@Injectable({ providedIn: "root" })

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService implements CustomHttpErrorHandlerService
{
  // You can write any number here, ex: 9999
  readonly priority = CUSTOM_HTTP_ERROR_HANDLER_PRIORITY.veryHigh;
  private error: HttpErrorResponse | undefined = undefined;
  // to prevent multiple modals
  private isModalOpen = false;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private modalService: NgbModal,private localizationService: LocalizationService) {}
  private specifiedComponent: Type<any> = CustomErrorComponent;

  /**
   * Generate formatted steps message for KochId connection errors
   */
  private generateKochIdStepsMessage(): string {
    const followingSteps = this.localizationService.instant('::MSG_FollowingSteps');
    const vpnTitle = this.localizationService.instant('::MSG_VPNVerification');
    const vpnStep1 = this.localizationService.instant('::MSG_VPNVerificationStepOne');
    
    const networkTitle = this.localizationService.instant('::MSG_InternalNetworkVerification');
    const networkStep1 = this.localizationService.instant('::MSG_InternalNetworkVerificationOne');
    const networkStep2 = this.localizationService.instant('::MSG_InternalNetworkVerificationTwo');
    
    const issueTitle = this.localizationService.instant('::MSG_IssueReporting');
    const issueStep1 = this.localizationService.instant('::MSG_IssueReportingOne');

    return `
${followingSteps}<br>
<u>${vpnTitle}</u>
${vpnStep1}<br>
<u>${networkTitle}</u>
${networkStep1} <a href='https://directory.int.kochid.com' target='_blank'>https://directory.int.kochid.com</a>. 
${networkStep2}<br>
<u>${issueTitle}</u>
${issueStep1}`;}

  /**
   * Format error details for display
   */
  private formatErrorDetails(hash: string, traceId: string = '', errorCode: string, errorTitle: string = ''): string {
    const ui = hash.replace("#", "");
    return `UI: ${ui} | Trace Id: ${traceId} | Error Code: ${errorCode} | Error Message: ${errorTitle}`;
  }

  // What kind of error should be handled by this service? You can decide it in this method. If error is suitable to your case then return true; otherwise return false.
  canHandle(error: unknown): boolean {
    if (error instanceof HttpErrorResponse &&  error.status === 403) {
      this.error = error;
      return true;
    }
    else if (error instanceof HttpErrorResponse && error.status === 404) {
      this.error = error;
      return true;

    }
    else if (error instanceof HttpErrorResponse && error.status === 500) {
      this.error = error;
      return true;

    }
    else if (error instanceof HttpErrorResponse && error.status === 0) {
      this.error = error;
      this.error.error.error=error;
      this.error.error.error.details =JSON.stringify( {NextAction:this.localizationService.instant('::MSG_ContactAdmin'),TraceId:'',ErrorTitle:'',code:'403'});
      return true;
    }
    return false;
  }

  // If this service is picked from ErrorHandler, this execute method will be called.
  execute() {
    // If modal is already open, do not open again
    if (this.isModalOpen) {
      return;
    }
    // Display the modal with the component using Bootstrap
    const modalRef = this.modalService.open(this.specifiedComponent,{ centered: true, backdrop: 'static' });
    this.isModalOpen = true;
    const errorCode = this.error.error?.error?.code || "403";
    let errorMessage =this.error.error?.error?.message?.value|| this.error.error?.error?.message ||this.localizationService.instant('::ERROR_AccessDenied')  ;

     if(errorMessage.indexOf('kochid.com')>0){
        errorMessage = this.localizationService.instant('::MSG_UnableConnect') +'<a href="https://directory.int.kochid.com" target="_blank">https://directory.int.kochid.com</a>. ';      
      }

    let errorDetails = typeof this.error.error === 'string' ? JSON.parse(this.error.error).error?.details || '' : this.error.error?.error?.details || '';
    if(!this.error.error){
        const urlParts = (this.error.url || '').split('?')[0].split('/').filter(Boolean);
        const lastTwoParts =" \""+urlParts.slice(-2).join('/')+"\"";
        errorMessage = this.localizationService.instant('::ERROR_NoPermission', lastTwoParts);
        errorDetails= { error: { code: errorCode, message: errorMessage, details: JSON.stringify({ NextAction: this.localizationService.instant('::MSG_GrantPermission'), TraceId: '', ErrorTitle: '', code: errorCode }) } };
      }
    let parsedDetails: any = {};
    try {
      parsedDetails = JSON.parse(errorDetails);
    } catch (e) {
      console.error("Failed to parse error details:", e);
    }

    const formattedMessage = `${errorMessage}`;
    
    // Generate nextAction based on error type
    const nextAction = errorMessage.indexOf('kochid.com') > 0 
      ? this.generateKochIdStepsMessage()
      : (parsedDetails.NextAction || this.localizationService.instant('::MSG_ContactAdmin'));
    
    const formattedDetails = this.formatErrorDetails(location.hash, parsedDetails.TraceId, errorCode, parsedDetails.ErrorTitle);
    
    // Set modal component data
    modalRef.componentInstance.data = formattedMessage;
    modalRef.componentInstance.nextAction = nextAction;
    modalRef.componentInstance.details = formattedDetails;
    modalRef.componentInstance.modalRef = modalRef;

    // When modal is closed, reset the flag
    modalRef.result.finally(() => {
      this.isModalOpen = false;
    });
  }
}
