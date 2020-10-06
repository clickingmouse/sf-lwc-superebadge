import { LightningElement, api, wire } from "lwc";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import { NavigationMixin } from "lightning/navigation";
// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading;

  // Getter and Setter to allow for logic to run on recordId change
  get recordId() {
    return this.boatId;
  }

  @api
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.boatReviews = this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return this.boatReviews ? true : false;
  }

  // Public method to force a refresh of the reviews invoking getReviews
  ////////////////////////////////////////////////////////////////////////
  //TO DO
  @api
  refresh() {}

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if (this.boatId == "" || this.boatId == null) {
      return;
    }
    this.isLoading = true;

    getAllReviews({ boatId: this.boatId })
      .then((results) => {
        this.boatReviews = results;
      })
      .catch((error) => {
        this.error = error.body.message;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    event.preventDefault();

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attrubutes: {
        recordId: event.target.dataset.recordId,
        actionName: "view"
      }
    });
  }
}
