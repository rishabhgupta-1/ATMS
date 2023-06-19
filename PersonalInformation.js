import { LightningElement, track, api } from 'lwc';
import savePageOneDetails from '@salesforce/apex/PersonalInformationAadharEntry.savePageOneDetails';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class personalInformation extends NavigationMixin(LightningElement) {
    @track firstName = '';
    @track middleName = '';
    @track lastName = '';
    @track dob = '';
    @track gender = '';
    @api recId;

    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];
    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }
    handleMiddleNameChange(event) {
        this.middleName = event.target.value;
    }
    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }
    handleDobChange(event) {
        this.dob = event.target.value;
    }
    handleGenderChange(event) {
        this.gender = event.target.value;
    }

    handleSave(){
        console.log(this.firstName, this.middleName, this.lastName, this.dob, this.gender);
        savePageOneDetails({firstName: this.firstName, middleName: this.middleName, lastName: this.lastName, dob: this.dob, gender: this.gender })
        .then(result => {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.recId = result;
            console.log(result)
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
    
    handleNext() {

        let cmpDef = {
            componentDef: 'c:contactDetails', 
            attributes: {
            recordId: this.recId
            } 
        };

        let encodedDef = btoa(JSON.stringify(cmpDef));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "/one/one.app#" + encodedDef
                

            }
        });
        
    }
}
