/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
}

// Declarações para Google Maps API
declare namespace google {
  namespace maps {
    // Nova API com importLibrary
    function importLibrary(libraryName: "places"): Promise<PlacesLibrary>;

    interface PlacesLibrary {
      Place: typeof Place;
      AutocompleteSessionToken: typeof AutocompleteSessionToken;
      AutocompleteSuggestion: typeof AutocompleteSuggestion;
    }

    class AutocompleteSessionToken {
      constructor();
    }

    class AutocompleteSuggestion {
      static fetchAutocompleteSuggestions(
        request: AutocompletionRequest
      ): Promise<{
        suggestions: Array<{
          placePrediction: {
            text: {
              text: string;
              matches: Array<{
                length: number;
                offset: number;
              }>;
            };
            place: {
              id: string;
              displayName: {
                text: string;
                languageCode: string;
              };
              formattedAddress: string;
              location: {
                lat: number;
                lng: number;
              };
            };
            toPlace(): Place;
          };
        }>;
      }>;
    }

    class Place {
      constructor(placeId: string);
      id: string;
      displayName: string;
      formattedAddress: string;
      fetchFields(options: { fields: string[] }): Promise<void>;
      location: LatLng;
    }

    namespace places {
      // APIs legadas (mantidas para compatibilidade)
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      // APIs legadas (mantidas para compatibilidade)
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: HTMLDivElement | google.maps.Map);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (
            result: PlaceResult | null,
            status: PlacesServiceStatus
          ) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        sessionToken?: google.maps.AutocompleteSessionToken;
        locationRestriction?: {
          west: number;
          north: number;
          east: number;
          south: number;
        };
        includedPrimaryTypes?: string[];
        language?: string;
        region?: string;
        // Propriedades legadas
        componentRestrictions?: ComponentRestrictions;
        types?: string[];
      }

      interface ComponentRestrictions {
        country: string | string[];
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
      }

      interface PlaceResult {
        geometry?: {
          location?: google.maps.LatLng;
        };
        formatted_address?: string;
        place_id?: string;
      }

      enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        INVALID_REQUEST = "INVALID_REQUEST",
        NOT_FOUND = "NOT_FOUND",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
      }
    }

    class Geocoder {
      geocode(
        request: GeocoderRequest,
        callback: (
          results: GeocoderResult[] | null,
          status: GeocoderStatus
        ) => void
      ): void;
    }

    interface GeocoderRequest {
      placeId?: string;
      address?: string;
    }

    interface GeocoderResult {
      geometry: {
        location: LatLng;
      };
      formatted_address: string;
    }

    enum GeocoderStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
  }
}
