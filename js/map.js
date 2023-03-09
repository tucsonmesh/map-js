import { blueIcon, redIcon, greenIcon, orangeIcon, violetIcon, greyIcon } from "./map-markers.js";

const tucson = [32.2462035, -110.9719826];
const default_zoom = 14;

const pointToLayer = (feature, latlng) => {
  if (!feature.properties) {
    return L.marker(latlng, { icon: greyIcon });
  }

  switch (feature.properties.status) {
    case "Submitted Requests":         return L.marker(latlng, { icon: blueIcon });
    case "Ready for Contact & Survey": return L.marker(latlng, { icon: redIcon });
    case "Surveyed":                   return L.marker(latlng, { icon: greenIcon });
    case "Ready for Install":          return L.marker(latlng, { icon: orangeIcon });
    case "Installed":                  return L.marker(latlng, { icon: violetIcon });
    default:                           return L.marker(latlng, { icon: greyIcon });
  }
};

const onEachFeature = (feature, layer) => {
  let popupContents = 'oops nothing to say here';

  if (feature.properties) {
    popupContents  = `<p>${feature.properties['title']}</p>`;
    popupContents += `<p>Status: ${feature.properties['status']}</p>`;
    popupContents += `<p>More info: <a href='${feature.properties['link']}'>Click Here</a></p>`;
  }

  layer.bindPopup(popupContents);
};

const mapSomeData = (data) => {
  let map = L.map('map').setView(tucson, default_zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature
  }).addTo(map);
}

const geoJSONRequest = new Request("mesh.geojson");
fetch(geoJSONRequest)
  .then((response) => response.json())
  .then((data) => mapSomeData(data));
