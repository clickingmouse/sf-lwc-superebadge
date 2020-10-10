import { LightningElement, api, track, wire } from "lwc";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import { NavigationMixin } from "lightning/navigation";
// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  @track boatReviews;
  isLoading;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    console.log("gettering:" + this.boatId);
    return this.boatId;
  }

  //@api
  set recordId(value) {
    console.log("settering:" + value);
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
    console.log("settered: " + this.boatId);
    //get reviews associated with boatId
    //this.boatReviews =
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    console.log("boatReviews.reiviewsToShow().tboatReviews" + this.boatReviews);

    return this.boatReviews && this.boatReviews.length > 0 ? true : false;
    // return this.boatReviews != undefined &&
    //   this.boatReviews != null &&
    //   this.boatReviews != ""
    //   ? true
    //   : false;
    //return this.boatReviews ? true : false;
  }

  // Public method to force a refresh of the reviews invoking getReviews
  ////////////////////////////////////////////////////////////////////////
  //TO DO
  @api
  refresh() {
    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    console.log("boatReviews.getReviews().tboatId: " + this.boatId);
    console.log("boatReviews.getReviews().trecordId: " + this.recordId);
    // if (this.boatId == "" || this.boatId == null) {
    //   console.log("!!" + this.boatId);
    //   return;
    // }

    if (!this.recordId) {
      return;
    }
    this.isLoading = true;

    getAllReviews({ boatId: this.recordId })
      .then((results) => {
        console.log(results);
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
    //event.preventDefault();

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attrubutes: {
        recordId: event.target.dataset.recordId,
        actionName: "view"
      }
    });
  }
}
