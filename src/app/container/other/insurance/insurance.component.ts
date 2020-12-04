import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmBoxComponent, ConfirmDialogModel } from 'src/app/confirm-box/confirm-box.component';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { InsuranceAddComponent } from '../insurance-add/insurance-add.component';
import { InsuranceEditComponent } from '../insurance-edit/insurance-edit.component';
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {


   responseData:any = []
   accessPermission:boolean;
  constructor(public _access:AccessServiceService, public dialog: MatDialog, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getList()
  }

  // Get Employee List
 async getList(){
  this.ngxService.start();
  await(this._api.showInsurance().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      console.log(response.data);
      let arr = [];

      for(let item of response.data){
        if(arr.find(e => e.insuranceName == item.insurance_Name)){

        }else{
          arr.push({
            insuranceName:item.insurance_Name,
            date: item.expiry_Date,
            data:[]
          })
        }
      }
      for(let item of response.data){
        for (let ar of arr){
          if(ar.insuranceName == item.insurance_Name){
            ar.data.push(item);
          }
        }
      }
      console.log(arr)

      this.responseData = arr;
      console.log(this.responseData);
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

// Delete Insurance
async deleteInsurance(id){
  this.ngxService.start();
  let formData = {
    "insuranceDetailId":id,
    "ip_Address":"111"
  }
  await(this._api.deleteInsurance(formData).subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.openSnackBar(response.message);
      this.getList();
    }else{
      this.openErrrorSnackBar(response.message);
    }


    console.log(res);
  }, err => {
    const error = err.error;
    this.openErrrorSnackBar(error.message);
    this.ngxService.stop();
  }));

}
  // open add Employee modal
  openSubAddModal(name,date) {
    const dialogRef = this.dialog.open(InsuranceAddComponent, {
      data: {
        insurance: JSON.stringify({name:name,date:date})
      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }

  // open add Employee modal
  openSubEditModal(e) {
    let data  = this.responseData.filter(item => e.id == item.user_id);
    const dialogRef = this.dialog.open(InsuranceEditComponent, {
      data: {
        employee: JSON.stringify(data[0])
      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getList()
    });
  }

  // alert message after api response success
openSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-alert']
  });
}
// alert message after api response failure
openErrrorSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['failure-alert']
  });
}
  // confirm message
confirmDialog(id): void {
  const message = `Are you sure you want to delete this?`;

  const dialogData = new ConfirmDialogModel('Confirm Action', message);

  const dialogRef = this.dialog.open(ConfirmBoxComponent, {
    maxWidth: '400px',
    data: dialogData
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult){
      this.deleteInsurance(id);
    }
  });
}

}