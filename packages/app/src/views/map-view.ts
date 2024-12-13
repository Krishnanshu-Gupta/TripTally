import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import mapboxgl from "mapbox-gl";
import mapboxSdk from "@mapbox/mapbox-sdk";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import reset from "../styles/reset.css";
import tokens from "../styles/tokens.css";
import { Experience } from "server/models";

export class MapViewElement extends LitElement {
  private _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  private _user = new Auth.User();

  @state() authenticated = false;
  @state() experiences: Array<any> = [];
  @state() searchQuery: string = "";

  private map?: mapboxgl.Map;
  private mapboxClient: ReturnType<typeof mapboxSdk>;
  private geocoder: ReturnType<typeof mapboxGeocoding>;

  @state() accessToken: string;

  constructor() {
    super();
    this.accessToken =
      "pk.eyJ1Ijoia3Jpc2huYW5zaHVnIiwiYSI6ImNtNGttbWQzeTBlc2IybXB0ZXNmc3E0aGcifQ.LfM1-jDmlIxknj3aqPRn8w";
    mapboxgl.accessToken = this.accessToken;
    this.mapboxClient = mapboxSdk({ accessToken: this.accessToken });
    this.geocoder = mapboxGeocoding(this.mapboxClient);
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      this._user = user || new Auth.User();
      this.authenticated = !!user;
    });
    this.fetchExperiences();
  }

  async fetchExperiences() {
    try {
      const res = await fetch("/api/experiences", {
        headers: Auth.headers(this._user),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch experiences: ${res.status}`);
      }

      const data = await res.json();
      this.experiences = await Promise.all(
        data.map(async (exp: Experience) => ({
          ...exp,
          coordinates: await this.getCoordinatesForLocation(exp.location),
        }))
      );

      if (this.map) {
        this.addSymbolLayer();
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
    }
  }

  async getCoordinatesForLocation(
    location: string
  ): Promise<{ longitude: number; latitude: number } | null> {
    try {
      const response = await this.geocoder
        .forwardGeocode({
          query: location,
          autocomplete: false,
          limit: 1,
        })
        .send();

      if (response.body?.features?.[0]?.center) {
        const [longitude, latitude] = response.body.features[0].center;
        return { longitude, latitude };
      }
      return null;
    } catch (error) {
      console.error(`Error geocoding location '${location}':`, error);
      return null;
    }
  }

  firstUpdated() {
    this.initializeMap();
  }

  initializeMap() {
    const mapElement = this.shadowRoot?.querySelector("#map") as HTMLElement;

    if (!mapElement) return;

    this.map = new mapboxgl.Map({
      container: mapElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    this.map.on("load", () => {
      this.addSymbolLayer();
    });
  }

  addSymbolLayer() {
    if (!this.map || this.map.getSource("points")) return;

    const features: GeoJSON.Feature<GeoJSON.Point>[] = this.experiences.map(
      (exp) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [exp.coordinates.longitude, exp.coordinates.latitude],
        },
        properties: {
          title: exp.title || "Untitled",
          location: exp.location,
          id: exp.id,
        },
      })
    );

    this.map.loadImage(
      "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      (error, image) => {
        if (error || !image) {
          console.error("Error loading image:", error);
          return;
        }

        if (!this.map?.hasImage("custom-marker")) {
          this.map!.addImage("custom-marker", image);
        }

        this.map!.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
        });

        this.map!.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            "text-field": ["get", "title"],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.25],
            "text-anchor": "top",
          },
        });

        this.map!.on("click", "points", (e) => {
          const properties = e.features?.[0]?.properties;
          if (properties && properties.id) {
            const experienceId = properties.id;
            window.location.href = `/app/experience/${experienceId}`;
          }
        });

        this.map!.on("mouseenter", "points", () => {
          this.map!.getCanvas().style.cursor = "pointer";
        });

        this.map!.on("mouseleave", "points", () => {
          this.map!.getCanvas().style.cursor = "";
        });

        const bounds = new mapboxgl.LngLatBounds();
        features.forEach((feature) => {
          if (feature.geometry.coordinates.length === 2) {
            bounds.extend(feature.geometry.coordinates as [number, number]);
          } else {
            console.warn(
              "Invalid coordinates for feature:",
              feature.geometry.coordinates
            );
          }
        });
        if (!bounds.isEmpty()) {
          this.map!.fitBounds(bounds, { padding: 40 });
        }
      }
    );
  }

  render() {
    return html`
      <main class="map-container">
        <section class="map-header">
          <div class="header-content">
            <h1>Explore Global Experiences</h1>
          </div>
        </section>
        <section class="map-section">
          <div id="map" class="map-view"></div>
        </section>
      </main>
    `;
  }

  static styles = [
    reset.styles,
    tokens.styles,
    css`
      :host {
        display: block;
      }
      .map-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .map-header {
        margin-bottom: 1rem;
      }
      .map-section {
        height: 85vh;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }
      #map {
        width: 100%;
        height: 100%;
      }
      .map-popup {
        max-width: 250px;
      }
      h1 {
        font-size: 2.5rem;
        padding-top: 1rem;
        color: var(--primary-color);
      }
    `,
  ];
}

customElements.define("map-view", MapViewElement);
