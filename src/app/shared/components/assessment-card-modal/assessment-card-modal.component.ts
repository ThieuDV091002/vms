import { ConfigStateService, CurrentUserDto, ListService, LocalizationService } from '@abp/ng.core';
import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { AssessmentCommentHistoryDto, AssessmentDto, CreateUpdateAssessmentResultDto, AssessmentTypeDto, AssessmentSummaryDto, CreateUpdateAssessmentResultAttachmentDto, AssessmentGuidelineDto } from '@apis/ticket/assessment-management/dtos';
import { AssessmentResultAttachmentService, AssessmentResultService, AssessmentService, AssessmentTypeService } from '@apis/ticket/assessment-management';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StandardService } from '@apis/general/services/widget';
import { StandardDto } from '@apis/general/dtos/widget';
import { DatePipe } from '@angular/common';
import { CardEditorComponent } from '../../../dashboard/card-editor/card-editor.component';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { forkJoin, switchMap, tap } from 'rxjs';
import { MobileCardCreatorComponent } from '../../../mobile/mobile-card-creator/mobile-card-creator.component';
import { ActivityCardService } from '@apis/ticket/activity-card.service';
import { GetActivityCardListDto } from '@apis/ticket/dtos/models';

@Component({
  selector: 'app-assessment-card',
  templateUrl: './assessment-card-modal.component.html',
  styleUrl: './assessment-card-modal.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AssessmentCardComponent',
    },
    DatePipe
  ]
})
export class AssessmentCardComponent implements OnInit {
  @Input() assessmentCard: AssessmentDto;
  @Output() isAssessmentCardVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('canvasElement') canvasElement: ElementRef;
  @ViewChild('standardModal') standardModal: TemplateRef<any>;
  @ViewChild('photoModal') photoModal: TemplateRef<any>;

  ratings = [
    { label: '0', control: 0, color: '#ed1c24', selected: false },
    { label: '1', control: 1, color: '#ff7f27', selected: false },
    { label: '2', control: 2, color: '#ffc90e', selected: false },
    { label: '3', control: 3, color: '#b5e61d', selected: false },
    { label: '4', control: 4, color: '#22b14c', selected: false },
    //{ label: '5', control: 5, color: '#22b14c', selected: false },
  ];

  isQuestionInfoVisible: boolean = false;

  currentUser: CurrentUserDto;
  guidelineDtos: AssessmentGuidelineDto[] = [];
  currentguidelineDto: AssessmentGuidelineDto;
  assessmentType: AssessmentTypeDto;
  isShowGuideline: boolean = false;
  currentIndex: number = 0;
  currentRating: number;
  currentYesOrNo: string;
  currentComment: string;
  questionDescription: string;
  thumbUp: boolean;
  showPhotoModal: boolean = false;
  cardsCount: number = 0;
  currentPhotos: any[] = [];
  uploadedPhotos: any[] = [];
  currentHistoryComments: AssessmentCommentHistoryDto[];

  showCommentHistory: boolean = false;
  uploadFile: any;
  selectedPhotos: any[] = [];
  selectedPhoto: any;
  isModalVisibleSummary: boolean = false;
  summaryData: AssessmentSummaryDto;
  isShowSummary: boolean = false;
  standardDto: StandardDto;
  isShowStandard: boolean = false;
  standardsData: StandardDto[];
  isCollapsed: boolean = true;

  inProgressStateId: string;
  completeStateId: string;

  showActivityCardListModal: boolean = false;
  activityCardsList: GetActivityCardListDto[] = [];
  currentAssessmentId: string;
  currentAssessmentResultId: string;

  constructor(
    public configService: ConfigStateService,
    private assessmentTypeService: AssessmentTypeService,
    private assessmentResultService: AssessmentResultService,
    private assessmentService: AssessmentService,
    private modalService: NgbModal,
    private standardService: StandardService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private assessmentResultAttachmentService: AssessmentResultAttachmentService,
    private confirmationService: ConfirmationService,
    private activityCardService: ActivityCardService,
  ) {
    this.currentUser = this.configService.getOne('currentUser');
    // console.log(this.currentUser.id);
  }

  ngOnInit(): void {
    this.getGuidelineDtos();
  }

  closeModal() {
    this.isAssessmentCardVisibleChange.emit(false);
  }

  toggleQuestionInfo() {
    this.isQuestionInfoVisible = !this.isQuestionInfoVisible;
  }

  getGuidelineDtos() {
    this.assessmentTypeService.get(this.assessmentCard.typeId).pipe(
      switchMap(res => {
        this.assessmentType = res;
        return this.assessmentTypeService.getRevision(this.assessmentCard.typeId, res.activeRevision);
      })
    ).subscribe(assessmentType => {
      this.guidelineDtos = assessmentType.guideLines.sort((a, b) => a.questionNo - b.questionNo);
      this.currentIndex = 0;
      this.currentguidelineDto = this.guidelineDtos[this.currentIndex];
      this.questionDescription = this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription;
      this.getCurrentStandards();
      this.getAssessmentGuideline();
      this.isShowGuideline = true;
    });
  }

  getCurrentStandards() {
    // 对 this.currentguidelineDto.standards 遍历并获取标准数据
    const standardsRequests = this.currentguidelineDto.standards.map(standard =>
      this.standardService.get(standard.standardId)
    );
    // 使用 forkJoin 获取所有 Standard 数据
    forkJoin(standardsRequests).subscribe(standards => {
      this.standardsData = standards;
    });
  }

  onRatingSelected(rating: number) {
    this.currentRating = rating;
    if (rating === 4) {
      this.thumbUp = true;
    }else {
      this.thumbUp = false;
    }
  }

  openActivityCardEditor(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('cards-count')) {
      return;
    }
    const savedPhotos = this.currentPhotos.filter(photo => photo.isSaved === true);

    const cardData = {
      cardTypeId: this.assessmentType.activityCardTypeId || '',
      categoryId: this.assessmentType.activityCardCategoryId || '',
      instructions: this.currentguidelineDto.questionLocal || this.currentguidelineDto.question,
      longInstruction: this.currentComment || this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription,
      
      dataTierType: this.assessmentCard.dataTierType,
      dataTierId: this.assessmentCard.dataTierId,

      assignedOwnerId: this.assessmentCard.ownerId || this.currentUser.id,

      assessmentData: {
      // assessmentId: this.assessmentCard.id,
      questionId: this.currentguidelineDto.id,
      questionNo: this.currentguidelineDto.questionNo,
      question: this.currentguidelineDto.questionLocal || this.currentguidelineDto.question,
      longDescription: this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription,
      comment: this.currentComment,
      rating: this.currentRating,
      yesNo: this.currentYesOrNo,
      photos: savedPhotos,
      assessmentTypeId: this.assessmentType.id,
      assessmentId: this.currentAssessmentId,
      assessmentResultId: this.currentAssessmentResultId
    }
      
    };
  
    const modalRef = this.modalService.open(MobileCardCreatorComponent, { 
      size: 'fullscreen',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'mobile-card-creator-modal'
    });
    
    modalRef.componentInstance.initialCardData = cardData;
    modalRef.componentInstance.hideBackButton = true;

    modalRef.result.then(
      (result) => {
        this.loadActivityCards();
      },
      (dismissed) => {
        this.loadActivityCards();
      }
    );
  }

  nextQuestion() {
    if (this.currentguidelineDto.answerType === 'Rating (0 ~ 5)' && this.currentRating === undefined) {
      this.toasterService.warn('::LABEL_SelectRatingWarning');
      return;
    }
    if (this.currentguidelineDto.answerType === 'Yes or No' && this.currentYesOrNo === undefined) {
      this.toasterService.warn('::LABEL_SelectYesOrNoWarning');
      return;
    }
    if (this.currentguidelineDto.answerType === 'Comment' && this.currentComment === undefined) {
      this.toasterService.warn('::LABEL_EnterCommentWarning');
      return;
    }
    let answerType = this.currentguidelineDto.answerType;
    if (answerType === 'Rating (0 ~ 5)') {
      answerType = 'Rating';
    }
    if (answerType === 'Yes or No') {
      answerType = 'YesOrNo';
    }
    // 保存当前问题的回答
    const request: CreateUpdateAssessmentResultDto = {
      question: this.currentguidelineDto.question,
      questionId: this.currentguidelineDto.id,
      answerType: answerType,
      assessmentId: this.assessmentCard.id,
      questionNo: this.currentguidelineDto.questionNo,
      rating: this.currentRating,
      comment: this.currentComment,
      yesNo: this.currentYesOrNo,
      thumbUp: this.currentguidelineDto.answerType === 'Rating (0 ~ 5)' ? this.thumbUp : false,
      longDescription: this.currentguidelineDto.longDescription,
      recordUser: this.currentUser.id
    };
    this.assessmentService.recordResultByResultDto(request).subscribe(response => {
      this.savePhotos();
      this.currentIndex++;
      if (this.currentIndex === this.guidelineDtos.length) {
        this.currentIndex--;
        this.assessmentService.getSummaryByAssessmentId(this.assessmentCard.id).subscribe((summary) => {
          this.summaryData = summary;
          this.summaryData.questionSummaries.sort((a, b) => a.questionNo - b.questionNo);
          this.summaryData.commentSummaries.sort((a, b) => a.questionNo - b.questionNo);
          this.isShowGuideline = false;
          this.isShowSummary = true;
          });
      } else {
        this.currentguidelineDto = this.guidelineDtos[this.currentIndex];
        this.questionDescription = this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription;
        this.currentComment = undefined;
        this.currentRating = undefined;
        this.currentYesOrNo = undefined;
        this.getAssessmentGuideline();
        this.getCurrentStandards();
      }
    });
  }

  fromSummaryToQuestion() {
    this.isShowSummary = false;
    this.isShowGuideline = true;
    this.currentIndex = this.guidelineDtos.length - 1;
    this.currentguidelineDto = this.guidelineDtos[this.currentIndex];
    this.questionDescription = this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription;
    this.getAssessmentGuideline();
    this.getCurrentStandards();
  }

  previousQuestion() {
    this.savePhotos();
    this.currentIndex--;
    this.currentguidelineDto = this.guidelineDtos[this.currentIndex];
    this.questionDescription = this.currentguidelineDto.longDescriptionLocal || this.currentguidelineDto.longDescription;
    this.getAssessmentGuideline();
    this.getCurrentStandards();
  }

  // 拿到历史记录，拿到用户之前填入的数据
  getAssessmentGuideline() {
    const commentHistory$ = this.assessmentService.getCommentHistoryByAssessmentGuidelineIdAndDataTierId(this.currentguidelineDto.id, this.assessmentCard.dataTierId);
    const resultList$ = this.assessmentResultService.getList({
      recordUser: this.currentUser.id,
      questionId: this.currentguidelineDto.id,
      assessmentId: this.assessmentCard.id,
      maxResultCount: 10,
      sorting: 'creationTime desc',
    });
    
    // 先获取评论历史和结果列表
    forkJoin([commentHistory$, resultList$]).subscribe(([commentHistory, resultList]) => {
      this.currentHistoryComments = commentHistory;
      this.currentComment = commentHistory.find(comment => comment.userName === this.currentUser.userName && comment.assessmentId === this.assessmentCard.id)?.comment;
      this.currentRating = resultList.items[0]?.rating;
      this.currentYesOrNo = resultList.items[0]?.yesNo;
  
      if (this.currentguidelineDto.answerType === 'Rating (0 ~ 5)' && this.currentRating === 4) {
        this.thumbUp = true;
      } else {
        this.thumbUp = false;
      }
  
      if (resultList.items && resultList.items.length > 0) {
        const assessmentResultId = resultList.items[0].id;
        this.currentAssessmentResultId = resultList.items[0].id;
        this.currentAssessmentId = resultList.items[0].assessmentId;

        this.loadActivityCards();
        
        // Use AssessResultId to retrieve attachments
        this.assessmentResultAttachmentService.getList({
          assessmentResultId: assessmentResultId, 
          maxResultCount: 100,
        }).subscribe(attachments => {
          this.currentPhotos = attachments.items.map(attachment => ({
            id: attachment.id,
            attachment: `data:${attachment.mimeType};base64,${attachment.attachment}`,
            mimeType: attachment.mimeType,
            attachmentType: attachment.attachmentType,
            isSaved: true 
          }));
        });
      } else {
        this.currentPhotos = [];
      }
    });
  }


  savePhotos() {
    // Filter saved photos
    const unsavedPhotos = this.currentPhotos.filter(photo => !photo.isSaved);
    
    if (unsavedPhotos.length === 0) {
      return; 
    }
    
    // 先获取当前问题的评估结果ID
    this.assessmentResultService.getList({
      recordUser: this.currentUser.id,
      questionId: this.currentguidelineDto.id,
      assessmentId: this.assessmentCard.id,
      maxResultCount: 10,
      sorting: 'creationTime desc',
    }).subscribe(resultList => {
      if (resultList.items && resultList.items.length > 0) {
        const assessmentResultId = resultList.items[0].id;
        
        // Create photo attachments using the assessmentResultId
        const saveRequests = unsavedPhotos.map(photo => {
          const attachment: CreateUpdateAssessmentResultAttachmentDto = {
            assessmentResultId: assessmentResultId,
            attachment: photo.attachment.split(',')[1],
            mimeType: photo.mimeType,
            attachmentType: 'General',
          };
          return this.assessmentResultAttachmentService.create(attachment);
        });
        
        if (saveRequests.length > 0) {
          forkJoin(saveRequests).subscribe(() => {
            unsavedPhotos.forEach(photo => photo.isSaved = true);
          });
        }
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + '+00:00');
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    // }) + ', ' + date.toLocaleTimeString('en-GB', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit',
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.uploadFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;
      this.uploadedPhotos.push(base64String);
      this.uploadPhoto(base64String);
    };
    reader.readAsDataURL(file);
  }

  uploadPhoto(dataUrl: string, fileName?: string, mimeType?: string) {
    const photo = {
      id: 'photo_' + new Date().getTime(),
      attachment: dataUrl,
      mimeType: mimeType || this.uploadFile.type,
      attachmentType: 'General',
    };
    this.currentPhotos.push(photo);
  }

  capturePhoto() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const photo = canvas.toDataURL('image/png');
          this.uploadedPhotos.push(photo);
          this.uploadPhoto(photo, 'captured_photo.png', 'image/png');
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(err => {
        console.error("Error accessing camera: ", err);
      });
  }

  deleteSelectedPhotos() {
    if (!this.selectedPhotos || this.selectedPhotos.length === 0) {
      return;
    }
    
    const savedPhotoIds = this.selectedPhotos
      .filter(photo => photo.isSaved && photo.id)
      .map(photo => photo.id);
    
    // 1.Remove from client array
    this.selectedPhotos.forEach(photo => {
      const index = this.currentPhotos.indexOf(photo);
      if (index > -1) {
        this.currentPhotos.splice(index, 1);
      }
    });
    
    // 2. Delete saved photos from the server
    if (savedPhotoIds.length > 0) {
      const deleteRequests = savedPhotoIds.map(id => 
        this.assessmentResultAttachmentService.delete(id)
      );
      
      forkJoin(deleteRequests).subscribe(
        () => {
          this.toasterService.success('::LABEL_PhotosDeletedSuccessfully', '');
        },
        error => {
          this.toasterService.error('::LABEL_ErrorDeletingPhotos', '');
          this.getAssessmentGuideline();
        }
      );
    }
    this.selectedPhotos = [];
  }

  previewPhoto(photo: any) {
    this.selectedPhoto = photo;
  const modalRef = this.modalService.open(this.photoModal, {
    centered: true,
    size: 'lg'
  });
  }

  selectPhoto(event: any, photo: any) {
    const checked = event.target.checked;
    if (!this.selectedPhotos) {
      this.selectedPhotos = [];
    }
    
    if (checked) {
      this.selectedPhotos.push(photo);
    } else {
      const index = this.selectedPhotos.findIndex(p => p === photo);
      if (index > -1) {
        this.selectedPhotos.splice(index, 1);
      }
    }
  }

  openStandardWidget(standardId: string) {
    this.standardService.get(standardId).pipe(
      tap(standard => {
        this.isShowStandard = true;
        this.standardDto = standard;
      })
    ).subscribe();
  }

  clickSubmit() {
    this.confirmationService
      .warn('::LABEL_SubmitConfirmationMessage', '')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.assessmentService.submitResultByAssessmentId(this.assessmentCard.id).subscribe(_ => {
            this.isAssessmentCardVisibleChange.emit(true);
            this.toasterService.success('::LABEL_SuccessfullySubmited', '');
          });
        }
      });
  }

  getDisplayQuestion(): string {
    if (!this.currentguidelineDto) {
      return '';
    }

    const { questionLocal, question } = this.currentguidelineDto;

    if (!questionLocal || questionLocal === '') {
      return question || '';
    }

    return questionLocal;
  }

  openActivityCardListModal(event: MouseEvent) {
    event.stopPropagation(); // 阻止事件冒泡
    this.showActivityCardListModal = true;
  }

  loadActivityCards() {
    this.cardsCount = 0;
    this.activityCardsList = [];
    this.activityCardService.getActivityCardByAssessmentByInput({
      assessmentId: this.currentAssessmentId,
      assessmentResultId: this.currentAssessmentResultId
    }).subscribe(res => {
      this.activityCardsList = res.activityCardList || [];
      this.cardsCount = this.activityCardsList.length;
    });
  }
  }