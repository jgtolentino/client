// Simplified Philippine GeoJSON data for better map visualization
export const philippineGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Luzon"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [120.0, 18.5],
          [122.0, 18.5],
          [122.5, 16.0],
          [121.5, 14.0],
          [120.5, 14.5],
          [119.5, 16.0],
          [120.0, 18.5]
        ]]
      }
    },
    {
      "type": "Feature", 
      "properties": {
        "name": "Visayas"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [123.0, 11.5],
          [125.5, 11.5],
          [125.5, 9.0],
          [123.0, 9.0],
          [123.0, 11.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mindanao"
      },
      "geometry": {
        "type": "Polygon", 
        "coordinates": [[
          [124.0, 9.5],
          [127.0, 9.5],
          [126.5, 5.5],
          [124.5, 5.5],
          [124.0, 9.5]
        ]]
      }
    }
  ]
};

// Philippine city coordinates for accurate location mapping
export const philippineCities = {
  "Manila": [14.5995, 120.9842],
  "Cebu": [10.3157, 123.8854], 
  "Davao": [7.1907, 125.4553],
  "Iloilo": [10.7202, 122.5621],
  "Cagayan de Oro": [8.4542, 124.6319],
  "Zamboanga": [6.9214, 122.0790],
  "Bacolod": [10.6770, 122.9500],
  "General Santos": [6.1164, 125.1716]
} as const;