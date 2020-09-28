import { LightningElement, api, track, wire } from "lwc";
//import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { publish, MessageContext } from "lightning/messageService";
// imports
//import PICTURE_FIELD from "@salesforce/schema/Boat__c.Picture__c";
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
export default class BoatTile extends LightningElement {
  //@wire(getRecord, { recordId: "$selectedBoatId" })
  @api boat;
  @api selectedBoatId;

  // Getter for dynamically setting the background image for the picture
  get backgroundStyle() {
    console.log(this.boat);
    return `background-image:url(${this.boat.Picture__c})`;
    //getFieldValue(this.selectedBoatId, PICTURE_FIELD);
  }

  // Getter for dynamically setting the tile class based on whether the
  // current boat is selected
  get tileClass() {
    return this.selectedBoatId == this.boat.Id
      ? TILE_WRAPPER_SELECTED_CLASS
      : TILE_WRAPPER_UNSELECTED_CLASS;
  }

  // Fires event with the Id of the boat that has been selected.
  selectBoat(event) {
    event.preventDefault();
    //this.selectedBoatId = event.detail.value
    let boatId = this.boat.Id;
    //this.selectedBoatTypeId
    //{ boatId: this.boat.Id }
    const boatselect = new CustomEvent("boatselect", {
      detail: boatId
    });
    this.dispatchEvent(boatselect);
  }
}
