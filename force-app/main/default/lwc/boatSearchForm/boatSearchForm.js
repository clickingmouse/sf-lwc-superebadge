import { LightningElement, wire, track } from "lwc";
import { reduceErrors } from "c/ldsUtils";
// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

export default class BoatSearchForm extends LightningElement {
  //@api
  selectedBoatTypeId = "";

  // Private
  error = undefined;

  // Needs explicit track due to nested data
  @track
  searchOptions;

  // Wire a custom Apex method

  //   getBoatTypes().then(data=>{
  //   this.searchOptions = data.map((type) => {
  //     return { label: type.Name, value: type.Id };
  //      });
  //    this.searchOptions.unshift({ label: "All Types", value: "" });
  // }).catch(error=>{
  //   this.errors = reduceErrors(error);
  // })

  @wire(getBoatTypes)
  boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map((type) => {
        return { label: type.Name, value: type.Id };
      });
      this.searchOptions.unshift({ label: "All Types", value: "" });
    } else if (error) {
      this.searchOptions = undefined;
      this.errors = reduceErrors(error);
    }
  }

  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  //handleSearchOptionChange
  handleSearchOptionChange(event) {
    // Prevents the anchor element from navigating to a URL.
    //event.preventDefault();
    // Creates the event with the contact ID data.
    //const selectedEvent = new CustomEvent('selected', { detail: this.contact.Id });
    // Dispatches the event.
    //this.dispatchEvent(selectedEvent);

    //event.preventDefault();
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    console.log("selectedBoatTypeId= " + event.detail.value);
    this.selectedBoatTypeId = event.detail.value;
    const searchEvent = new CustomEvent("search", {
      detail:
        //this.selectedBoatTypeId
        { boatTypeId: this.selectedBoatTypeId }
    });
    // searchEvent;
    //this.dispatchEvent(selectedEvent);
    this.dispatchEvent(searchEvent);
  }
}
