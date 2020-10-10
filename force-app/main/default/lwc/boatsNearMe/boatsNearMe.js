import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { reduceErrors } from "c/ldsUtils";
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

  isLoading = true;
  isRendered = false;
  latitude;
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
    if (data) {
      //If the result contains any data, invoke the function createMapMarkers(), passing the data as a parameter.
      this.isLoading = true;
      console.log(data);
      this.createMapMarkers(data);
      //this.isLoading = true;
    } else if (error) {
      //If an error occurred, show the error message in a toast error event (use the constant ERROR_VARIANT), with the title equals to the constant ERROR_TITLE.
      const event = new ShowToastEvent({
        title: ERROR_TITLE,
        message: error.message,
        variant: ERROR_VARIANT
        //mode: "dismissable"
      });
      this.dispatchEvent(event);
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    console.log("boatsNearMe");
    if (this.isRendered == false) {
      this.getLocationFromBrowser();

      this.isRendered = true;
    }
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    console.log("!!");
    //
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log("!!!");
      },
      (error) => {
        //this.errors = reduceErrors(error);
        console.log(error);
      }
    );
  }

  // Creates the map markers
  //including the right mapMarkers, title, Latitude (Geolocation__Latitude__s), Longitude (Geolocation__Longitude__s), the correct constants, stopping the loading spinner, and using the proper case-sensitivity and consistent quotation.
  createMapMarkers(boatData) {
    // const newMarkers = boatData.map(boat => {...});
    console.log(boatData);
    //const newMarkers = boatData.map((boat) => {
    this.mapMarkers = JSON.parse(boatData).map((boat) => {
      //The other marks on that list must be generated from the boatData parameter. For each marker, the title must be the boat name, and the marker must have the boat’s latitude and longitude.
      console.log(boat.Name);
      console.log(boat.Geolocation__Latitude__s);
      console.log(boat.Geolocation__Longitude__s);

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
    //newMarkers.unshift({
    this.mapMarkers.unshift({
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER,
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude
      }
    });
    //this.mapMarkers = newMarkers;
    this.isLoading = false;
  }
}
