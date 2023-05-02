import { blueIcon, redIcon, greenIcon, orangeIcon, violetIcon, greyIcon, blackIcon } from "./map-markers.js";

const tucson = [32.2462035, -110.9719826];
const bcc = [32.2461891,-110.9698481];
const default_zoom = 14;

const pointToLayer = (feature, latlng) => {
  if (!feature.properties) {
    return L.marker(latlng, { icon: greyIcon });
  }

  switch (feature.properties.status) {
    case "Purgatory":                  return L.marker(latlng, { icon: greyIcon });
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

const filterFeatureByStatus = (feature, status) => {
  if (feature.properties) {
    return feature.properties.status === status
  }
  console.log(`feature ${feature} has no properties`);
  return false;
}

const mapSomeData = (data) => {
  const map = L.map('map').setView(tucson, default_zoom);

  const osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  osmTiles.addTo(map);

  L.marker(bcc, { icon: blackIcon }).addTo(map);

  const purgatory = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Purgatory') }
  }).addTo(map);

  const submitted = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Submitted Requests') }
  }).addTo(map);

  const ready_for_contact = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Ready for Contact & Survey') }
  }).addTo(map);

  const surveyed = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Surveyed') }
  }).addTo(map);

  const ready_for_install = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Ready for Install') }
  }).addTo(map);

  const installed = L.geoJSON(data['features'], {
    'pointToLayer': pointToLayer,
    'onEachFeature': onEachFeature,
    'filter': (feature) => { return filterFeatureByStatus(feature, 'Installed') }
  }).addTo(map);

  const baseMaps = {
    'OpenStreetMap': osmTiles
  };

  const overlayMaps = {
    'Purgatory': purgatory,
    'Submitted Requests': submitted,
    'Ready for Contact & Survey': ready_for_contact,
    'Surveyed': surveyed,
    'Ready for Install': ready_for_install,
    'Installed': installed
  };

  const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
}

const geoJSONRequest = new Request("mesh.geojson");
fetch(geoJSONRequest)
  .then((response) => response.json())
  .then((data) => mapSomeData(data));
