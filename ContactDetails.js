import { LightningElement, track,api, wire } from 'lwc';
import saveContactDetails from '@salesforce/apex/PersonalInformationAadharEntry.saveContactDetails';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import AADHAR_ENTRY from '@salesforce/schema/Aadhar_Entry__c';
import state_field from '@salesforce/schema/Aadhar_Entry__c.State__c';
import city_field from '@salesforce/schema/Aadhar_Entry__c.City__c';
//import PARSER from '@salesforce/resourceUrl/PapaParse';

export default class ContactDetails extends LightningElement {
    @track contactNumber;
    @track email;
    @track addressLine1;
    @track addressLine2;
    @track state;
    @track city;
    @track pincode;
    @api recordId;
    @track stateOptions;
    @track cityData;
    @track cityOptions;
    @track loadScript;

    // parserInitialized = false;

    // renderedCallback() {
    //     if(!this.parserInitialized){
    //         loadScript(this, PARSER)
    //             .then(() => {
    //                 this.parserInitialized = true;
    //             })
    //             .catch(error => console.error(error));
    //     }
    // }

    // handleImport(event){
    //     if(event.target.files.length > 0){
    //         const file = event.target.files[0];
    //         this.loading = true;
    //         Papa.parse(file, {
    //             quoteChar: '"',
    //             header: 'true',
    //             complete: (results) => {
    //                 this._rows = results.data;
    //                 this.loading = false;
    //             },
    //             error: (error) => {
    //                 console.error(error);
    //                 this.loading = false;
    //             }
    //         })
    //     }
    // }

    //@track csvData;

    // handleUploadFinished(event){
    //     this.csvData = event.detail.files[0].data;
    // }
    //   processImportData(data) {
    //     const records = data.map(record => {
    //       return {
    //         FirstName: record.firstname,
    //         MiddleName: record.middlename,
    //         LastName: record.lastname,
    //         Birthdate: record.dob,
    //         Gender: record.gender,
    //         Email: record.email,
    //         AddressLine1: record.addressLine1,
    //         AddressLine2: record.addressLine2,
    //         State: record.state,
    //         City: record.city,
    //         Pincode: record.pincode
    //       };
    //     });
    //     console.log('Processed data:', records);
    //   }
    

    @wire(getObjectInfo, {objectApiName: AADHAR_ENTRY})
    aadharInfo;

    @wire(getPicklistValues, {recordTypeId: '$aadharInfo.data.defaultRecordTypeId', fieldApiName: city_field})
    picklistCityInfo({data,error}){
        if(data){
            this.cityData = data;
            console.log(this.cityData);
        }
        if(error){
            console.log(error);
        }
        
    }

    @wire(getPicklistValues, {recordTypeId: '$aadharInfo.data.defaultRecordTypeId', fieldApiName: state_field})
    picklistStateInfo({data,error}){
        if(data){
            this.stateOptions = data.values;
            console.log(this.stateOPtions);
        }
        if(error){
            console.log(error);
        }
        
    }

    // stateOptions = [
    //     {label: 'Maharashtra', value: 'Maharashtra'},
    //     {label: 'Uttar Pradesh', value: 'Uttar Pradesh'},
    //     {label: 'Madhya Pradesh', value: 'Madhya Pradesh'},
    //     {label: 'Karnataka', value: 'Karnataka'},
    //     {label: 'Bihar', value: 'Bihar'}
    // ];

    // cityOptions = [
    //     {label: 'Mumbai', value: 'Mumbai'},
    //     {label: 'Pune', value: 'Pune'},
    //     {label: 'Lucknow', value: 'Lucknow'},
    //     {label: 'Noida', value: 'Noida'},
    //     {label: 'Bhopal', value: 'Bhopal'},
    //     {label: 'Indore', value: 'Indore'},
    //     {label: 'Bengaluru', value: 'Bengaluru'},
    //     {label: 'Mysuru', value: 'Mysuru'},
    //     {label: 'Patna', value: 'Patna'},
    //     {label: 'Gaya', value: 'Gaya'}
    // ];

    handleContactNumberChange(event){
        this.contactNumber = event.target.value;
    }
    handleEmailChange(event){
        this.email = event.target.value;
    }
    handleAddress1Change(event){
        this.addressLine1 = event.target.value;
    }
    handleAddress2Change(event){
        this.addressLine2 = event.target.value;
    }
    handleStateChange(event){
        let key = this.cityData.controllerValues[event.target.value];
        this.cityOptions=this.cityData.values.filter(opt => opt.validFor.includes(key));
        this.state = event.target.value;
    }
    handleCityChange(event){
        this.city = event.target.value;
    }
    handlePinChange(event){
        this.pincode = event.target.value;
    }
    handleSave(){
        console.log(this.contactNumber, this.email, this.addressLine1, this.addressLine2, this.state, this.city, this.pincode);
        saveContactDetails({recId: this.recordId, contactNumber: this.contactNumber, email: this.email, addressLine1: this.addressLine1, addressLine2: this.addressLine2, state: this.state, city: this.city, pincode: this.pincode})
        // eslint-disable-next-line no-unused-vars
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Record Created',
                variant: 'success'
            }));
            this.handleReset();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            })
        }
        handleReset(){
            this.template.querySelectorAll('.fields').forEach(item => {
                item.value = "";
            })
        }
        handlePrevious(){
            window.history.back();
        }
    }

