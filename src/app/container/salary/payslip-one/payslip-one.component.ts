import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonServiceService } from 'src/app/service/comman-service.service';
@Component({
  selector: 'app-payslip-one',
  templateUrl: './payslip-one.component.html',
  styleUrls: ['./payslip-one.component.scss']
})
export class PayslipOneComponent implements OnInit {
  @Input() data:any;
  allData:any;
  responseData:any = [];
  demoData:any;
  salData:any = [];
  currentDate = moment().format('DD MMM YYYY')
  currentMonth = moment().format('MMM YYYY');
  count = 0
  constructor(public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.count = this.data && this.data.count;
    this.allData = this.data;
    this.getEmployeeList();
  }
  // Get Employee List
  async getEmployeeList(){
    this.ngxService.start();
    await(this._api.getEmployee().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        console.log(response.data);
        let arr = []
      for(let item of response.data){
        if(item.status == 1){
          arr.push(item)
        }
      }
      this.responseData = arr;
        for(let item of this.responseData){
          let total = 0
          let salAr = [];
          if(item.salaryBalance != null){
            let sal = JSON.parse(item.salaryBalance)
            for(let i =0;i< sal.length;i++){
              for (var key in sal[i]) {
                salAr.push({label:key,value:sal[i][key]})
                total+= parseInt(sal[i][key]);
              }
            }
          }

          item['salary'] =  isNaN(total)?0:total;
          item['salaryArray'] = salAr;
        }
        this.demoData = this.responseData[this.count];
        console.log(this.demoData)
      }else{
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.ngxService.stop();
    }));

    }
    getCount(){
      if(this.count < (this.responseData.length-1)){
        this.count++
        this.demoData = this.responseData[this.count]
        console.log(this.count)
      }
    }
    getJoinDate(d){
      return moment(d).format('DD/MM/YYYY')
    }
}
