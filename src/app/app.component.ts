import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'world-map-project';
  hoveredCountryName: string | null = null; // Variable to store the hovered country name
  countryInfo: any | null = null; // Variable to store the country information

  constructor(private http: HttpClient) {}

  @ViewChild('worldMap', { static: false }) worldMap!: ElementRef<SVGSVGElement>; 

  ngAfterViewInit() { 
    this.addEventListenersToPaths(); 
  } 

  addEventListenersToPaths() { 
    const svgElement = this.worldMap.nativeElement; 
    const pathElements = svgElement.querySelectorAll('path'); 
    pathElements.forEach((path) => {
      const pathId = path.getAttribute('id');

      if (!pathId || pathId === 'null') {
        // Skip paths without valid IDs
        return;
      }

      path.addEventListener('mouseover', (event) => this.onMouseOver(event)); 
      path.addEventListener('mouseout', (event) => this.onMouseOut(event)); 
      path.addEventListener('click', (event) => this.onClick(event)); 
    }); 
  } 

  onMouseOver(event: MouseEvent) { 
    // Handle mouse over event here 
    const target = event.target as SVGPathElement; 
    const pathId = target.getAttribute('id');
    
    this.http.get<any[]>(`https://api.worldbank.org/V2/country/${pathId}?format=json`)
    .subscribe(
      (response) => {
        // Log the full API response to the console
        console.log('Full API Response:', response);

        if (response.length > 1) {
          const countryName = response[1][0].name;
          this.hoveredCountryName = countryName; // Store the country name for the tooltip
        } else {
          this.hoveredCountryName = null; // No data found, reset the tooltip
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    // Now you have the path ID and can use it to make API calls or perform other actions 
  } 

  onMouseOut(event: MouseEvent) { 
    this.hoveredCountryName = null; // Reset the tooltip when mouse leaves the path
  } 

  onClick(event: MouseEvent) { 
    // Handle click event here 
    const target = event.target as SVGPathElement; 
    const pathId = target.getAttribute('id'); 
    
    if (!pathId || pathId === 'null') {
      console.log('Path ID is null, skipping API call.');
      return;
    }

    console.log(pathId + ' clicked'); 
    // Now you have the path ID and can use it to make API calls or perform other actions 

    // Fetch country information and display it in the right column upon clicking
    this.http.get<any[]>(`https://api.worldbank.org/V2/country/${pathId}?format=json`)
    .subscribe(
      (response) => {
        if (response.length > 1) {
          this.countryInfo = response[1][0]; // Store the full country information for the clicked country
        } else {
          this.countryInfo = null; // No data found, reset the country information
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  } 

}
