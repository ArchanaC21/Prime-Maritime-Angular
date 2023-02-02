import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINER } from 'src/app/models/liner';
import { LINERSERVICE } from 'src/app/models/linerservice';
import { CommonService } from 'src/app/services/common.service';
import { LinerService } from 'src/app/services/liner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liner-service',
  templateUrl: './liner-service.component.html',
  styleUrls: ['./liner-service.component.scss'],
})
export class LinerServiceComponent implements OnInit {
  LinerServiceform: FormGroup;
  LinerServiceform1: FormGroup;
  ServiceList: any[] = [];
  submitted: boolean;
  isUpdate: boolean = false;
  portList: any[] = [];
  linerService: LINERSERVICE = new LINERSERVICE();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _linerService: LinerService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.LinerServiceform = this._formBuilder.group({
      ID: [0],
      LINER_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.LinerServiceform1 = this._formBuilder.group({
      LINER_CODE: [''],
      SERVICE_NAME: [''],
      PORT_CODE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetServiceList();
    this.getDropDown();
  }

  get f() {
    return this.LinerServiceform.controls;
  }

  Search() {
    debugger
    var  LINER_CODE = this.LinerServiceform.value.LINER_CODE;
    var  SERVICE_NAME = this.LinerServiceform.value. SERVICE_NAME;
    var PORT_CODE=this.LinerServiceform.value. PORT_CODE;
    var VIA_NO=this.LinerServiceform.value.VIA_NO;
    var STATUS = this.LinerServiceform.value.STATUS;
    var FROM_DATE = this.LinerServiceform.value.FROM_DATE;
    var TO_DATE = this.LinerServiceform.value.TO_DATE;

    if (
      LINER_CODE == '' &&
      SERVICE_NAME == '' && 
      PORT_CODE == '' &&
      VIA_NO == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == '' 
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    } else if (FROM_DATE > TO_DATE) {
      alert('From Date should be less than To Date !');
      return;
    }

    // this.schedule.LINER_CODE = LINER_CODE;
    // this.schedule.SERVICE_NAME = SERVICE_NAME;
    
    // this.schedule.PORT_CODE=PORT_CODE;
    // this.schedule.STATUS = STATUS;
    // this.schedule.FROM_DATE = FROM_DATE;
    // this.schedule.TO_DATE = TO_DATE;
    // this.isLoading = true;
    // this.GetScheduleList();
  }

  Clear() {}

  GetServiceList() {
    this._commonService.destroyDT();

    this._linerService.getServiceList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ServiceList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetServiceDetails(ID: number) {
    this._linerService.GetServiceDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.LinerServiceform.patchValue(res.Data);
      }
    });
  }

  InsertService() {
    this.submitted = true;
    if (this.LinerServiceform.invalid) {
      return;
    }

    this.LinerServiceform.get('CREATED_BY')?.setValue(
      localStorage.getItem('username')
    );

    this._linerService
      .postService(JSON.stringify(this.LinerServiceform.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetServiceList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  getDropDown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });
  }

  UpdateService() {
    this.submitted = true;
    if (this.LinerServiceform.invalid) {
      return;
    }

    this._linerService
      .updateService(JSON.stringify(this.LinerServiceform.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetServiceList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteService(ID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._linerService.deleteService(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetServiceList();
          }
        });
      }
    });
  }

  ClearForm() {
    this.LinerServiceform.reset();
    this.LinerServiceform.get('ID')?.setValue(0);
    this.LinerServiceform.get('PORT_CODE')?.setValue('');
  }

  openModal(linerID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (linerID > 0) {
      this.isUpdate = true;
      this.GetServiceDetails(linerID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
