import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // google maps zoom level
  public zoom: number = 8;

  // initial center position for the map
  public latitude: number = 51.673858;
  public longitude: number = 7.815982;
  public maxSpeed: number;
  public polyline: Array<any>;
  public polylines: Array<any>;
  public markers: marker[];

  ngOnInit() {

    //set google maps defaults
    this.zoom = 3;
    this.maxSpeed = 40;
    this.latitude = 21.291;
    this.longitude = -122.214;

    this.markers = [
      {
        latitude: 51.673858,
        longitude: 7.815982,
        label: 'A',
        draggable: true
      },
      {
        latitude: 51.373858,
        longitude: 7.215982,
        label: 'B',
        draggable: false
      },
      {
        latitude: 51.723858,
        longitude: 7.895982,
        label: 'C',
        draggable: true
      }
    ]

    this.polyline = [
      {
        latitude: 39.8282,
        longitude: -98.5795,
        speed: 50
      },
      {
        latitude: 38.8282,
        longitude: -108.5795,
        speed: 50
      },
      {
        latitude: 37.772,
        longitude: -122.214,
        speed: 20
      },
      {
        latitude: 21.291,
        longitude: -157.821,
        speed: 20
      },
      {
        latitude: -18.142,
        longitude: 178.431,
        speed: 20
      },
      {
        latitude: -27.467,
        longitude: 153.027,
        speed: 25
      }
    ]
    this.polylines = this.rebuildPolylines();

    //set current position
    this.setCurrentPosition();
  }

  private rebuildPolylines() {
    let polylines = [];
    let i = 0;
    let newPolyline = { path: [], color: 'blue' };
    for (let point of this.polyline) {
      console.log(point)
      newPolyline.path.push(point);
      const speedChanged = this.polyline[i + 1] && (point.speed < this.maxSpeed && this.polyline[i + 1].speed < this.maxSpeed) || (point.speed > this.maxSpeed && this.polyline[i + 1].speed > this.maxSpeed)
      if (point.speed > this.maxSpeed) {
        newPolyline.color = 'red';
      }
      if (speedChanged) {
        newPolyline.path.push(this.polyline[i + 1]);
        polylines.push(newPolyline);
        newPolyline = { path: [], color: 'blue' };
      }
      i++;
    }
    console.log(polylines);
    return polylines;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      latitude: $event.coords.lat,
      longitude: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

}

// just an interface for type safety.
interface marker {
  latitude: number;
  longitude: number;
  label?: string;
  draggable: boolean;
}
