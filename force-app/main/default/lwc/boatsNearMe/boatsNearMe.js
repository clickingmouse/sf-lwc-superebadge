import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
// imports
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  @api
  boatTypeId;

  mapMarkers = [];
  /*.push({
    title: LABEL_YOU_ARE_HERE,
    icon: ICON_STANDARD_USER,
    location: { longitude, latitude }
  });*/
  @track
  isLoading = true;

  isRendered;
  @api
  latitude;
  @api
  longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    longitude: "$longitude",
    latitude: "$latitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (error) {
      //If an error occurred, show the error message in a toast error event (use the constant ERROR_VARIANT), with the title equals to the constant ERROR_TITLE.
      const event = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.message,
        variant: ERROR_VARIANT
        //mode: "dismissable"
      });
      this.dispatchEvent(event);
    }

    if (data) {
      //If the result contains any data, invoke the function createMapMarkers(), passing the data as a parameter.
      this.isLoading = false;
      this.createMapMarkers(data);
      //this.isLoading = true;
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (this.isRendered == false) {
      this.getLocationFromBrowser();
      this.isRendered = true;
    }
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    //
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    });
  }

  // Creates the map markers
  //including the right mapMarkers, title, Latitude (Geolocation__Latitude__s), Longitude (Geolocation__Longitude__s), the correct constants, stopping the loading spinner, and using the proper case-sensitivity and consistent quotation.
  createMapMarkers(boatData) {
    // const newMarkers = boatData.map(boat => {...});
    const newMarkers = boatData.map((boat) => {
      //The other marks on that list must be generated from the boatData parameter. For each marker, the title must be the boat name, and the marker must have the boat’s latitude and longitude.
      return {
        title: boat.Name,
        location: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s
        }
      };
    });
    //push to beginning
    // newMarkers.unshift({...});
    newMarkers.unshift({
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER,
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude
      }
    });
    this.mapMarkers = newMarkers;
    this.isLoading = false;
  }
}
