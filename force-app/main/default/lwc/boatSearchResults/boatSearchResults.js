import { LightningElement, api, wire, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
// ...
const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
//Boat’s Name, Length, Price, and Description fields
const COLUMNS = [
  { label: "Name", fieldName: "Name", editable: "true", type: "text" },
  {
    label: "Length",
    fieldName: "Length__c",
    editable: "true",
    type: "number"
  },
  {
    label: "Price",
    fieldName: "Price__c",
    editable: "true",
    type: "currency"
  },
  {
    label: "Description",
    fieldName: "Description__c",
    editable: "true",
    type: "text"
  }
];
/////////////////////////////////////////////////////////////////
export default class BoatSearchResults extends LightningElement {
  selectedBoatId = "";
  columns = COLUMNS;
  //
  rowOffset = 0;
  @track draftValues = [];
  boatTypeId = "";
  @track boats;
  error = undefined;
  isLoading = false;

  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(result) {
    //this.boats = result;
    console.log(result);
    this.boats = result;
    if (result.error) {
      this.error = result.error;
      this.boats = undefined;
      console.log("error: " + result.error);
    }
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    // this.boatTypeId = boatTypeId;
    // this.notifyLoading();
    console.log("boatSearchResults.searchBoats()" + boatTypeId);
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    this.boatTypeId = boatTypeId;
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  //On success, call the function refresh(), that must trigger the loading spinner, invoke refreshApex() to refresh a wired property and then stop the spinner.
  //The refreshApex() function returns a Promise.
  @api async refresh() {
    //load spinner
    //this.notifyLoading();
    //invoke refreshApex
    //refreshApex(this.boats).then(this.notifyLoading());
    //stop spinner

    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // this function must update selectedBoatId and call sendMessageService
  //+to update the information about the currently selected boat Id based on the event.
  updateSelectedTile(event) {
    //event.preventDefault();
    //console.log("preventdefault");

    //    if(event.detail.boatId) {

    this.selectedBoatId = event.detail.boatId;
    console.log(
      "boatSearchResults.upateSelectedTile.selectedBoatId:" +
        this.selectedBoatId
    );
    this.sendMessageService(this.selectedBoatId);
    console.log("e:updateSelectedTile>>" + event.detail.boatId);
    //   }
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    console.log("publishing:" + boatId);
    //debugger;
    publish(this.messageContext, BOATMC, { recordId: boatId });
    //debugger;
  }

  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    const recordInputs = event.detail.draftValues.slice().map((draft) => {
      const fields = Object.assign({}, draft);
      return { fields };
    });
    const promises = recordInputs.map((recordInput) => {
      //update boat record - updateRecord
      return updateRecord(recordInput);
    });
    Promise.all(promises)
      .then(() => {
        // save changes

        const successToastEvent = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(successToastEvent);
      })
      .catch((error) => {
        //show toastError
        const errorToastEvent = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(errorToastEvent);
      })
      .finally(() => {
        this.notifyLoading(false);
        return this.refresh();
      });
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  //In this component, you need to dispatch a custom event called either loading or doneloading when searching for the boats. Make sure to use the isLoading private property to dispatch the event only when needed

  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent("loading"));
    } else {
      this.dispatchEvent(new CustomEvent("doneloading"));
    }

    // const loadingEvent = new CustomEvent("loading", {
    //   detail: "loading"
    // });
    // //this.dispatchEvent(loadingEvent);

    // const doneloadingEvent = new CustomEvent("doneloading", {
    //   detail: "doneloading"
    // });
    // //this.dispatchEvent(doneloadingEvent);

    // isLoading
    //   ? this.dispatchEvent(loadingEvent)
    //   : this.dispatchEvent(doneloadingEvent);
  }
}
