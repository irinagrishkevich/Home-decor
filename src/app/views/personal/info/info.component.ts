import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/shared/services/user.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { DeliveryType } from 'src/types/delivery.type';
import { PaymentType } from 'src/types/payment.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {



  deliveryType: DeliveryType = DeliveryType.delivery
  deliveryTypes = DeliveryType
  paymentTypes = PaymentType

  userInfoForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: ['']
  })

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.userService.getUserinfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        const userInfo: UserInfoType = data as UserInfoType

        const paramsToUpdate = {
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          email: userInfo.email ? userInfo.email : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : ''
        }

        this.userInfoForm.setValue(paramsToUpdate)
      if(userInfo.deliveryType){
        this.deliveryType = userInfo.deliveryType
      }
      })

  }
  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type

    this.userInfoForm.markAsDirty()
  }

  updateUserInfo(){
    if (this.userInfoForm.valid) {

      const paramsObject: UserInfoType = {
        email: this.userInfoForm.value.email ? this.userInfoForm.value.email : '',
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.value.paymentType ? this.userInfoForm.value.paymentType : PaymentType.cashToCourier,

    }

    if(this.userInfoForm.value.firstName){
      paramsObject.firstName = this.userInfoForm.value.firstName
    }
    if(this.userInfoForm.value.lastName){
      paramsObject.lastName = this.userInfoForm.value.lastName
    }
    if(this.userInfoForm.value.fatherName){
      paramsObject.fatherName = this.userInfoForm.value.fatherName
    }
    if(this.userInfoForm.value.phone){
      paramsObject.phone = this.userInfoForm.value.phone
    }
    if(this.userInfoForm.value.street){
      paramsObject.street = this.userInfoForm.value.street
    }
    if(this.userInfoForm.value.house){
      paramsObject.house = this.userInfoForm.value.house
    }
    if(this.userInfoForm.value.entrance){
      paramsObject.entrance = this.userInfoForm.value.entrance
    }
    if(this.userInfoForm.value.apartment){
      paramsObject.apartment = this.userInfoForm.value.apartment
    }

      this.userService.updateUserinfo(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message)
              throw new Error(data.message)
            }
            this._snackBar.open('Личные данные обновлены')
            this.userInfoForm.markAsPristine()
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
               } else {
              this._snackBar.open('Ошибка при обновлении личных данных')
            }
          }
        })

    }

  }

}
