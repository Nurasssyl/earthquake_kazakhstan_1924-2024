
var kazakhstan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
  .filter(ee.Filter.eq('country_co', 'KZ'));


var earthquakes = ee.FeatureCollection('projects/sat-io/open-datasets/USGS/usgs_earthquakes_1923-2023');

var filtered = earthquakes.filterBounds(kazakhstan)
  .filterDate('1924-01-01', '2024-12-31')
  .filter(ee.Filter.gte('mag', 2.5));  // Фильтр по магнитуде (например, магнитуда >= 2.5)

var visParams = {
  color: 'red',
  pointSize: 5,
  pointShape: 'circle'
};

var image = filtered.style(visParams).clip(kazakhstan.geometry());

var exportParams = {
  scale: 1000,
  region: kazakhstan.geometry(),
  fileFormat: 'GeoTIFF'
};

Export.image.toDrive({
  image: image,
  description: 'Earthquakes_in_Kazakhstan',
  scale: 1000,
  region: kazakhstan.geometry(),
  fileFormat: 'GeoTIFF'
});

var whiteBackground = ee.Image.constant(1).clip(kazakhstan.geometry()).visualize({
  min: 0,
  max: 1,
  opacity: 1,
  palette: ['ffffff']
});

var borderParams = {
  color: 'black',
  fillColor: '00000000', 
  width: 2
};

var styledKazakhstan = kazakhstan.style(borderParams);


Map.centerObject(kazakhstan, 5);
Map.addLayer(whiteBackground, {}, 'White Background'); 
Map.addLayer(image, {}, 'Earthquakes');  
Map.addLayer(styledKazakhstan, {}, 'Kazakhstan Border');  

filtered = filtered.map(function(feature) {
  return feature.set({magnitude: feature.get('mag')});
});

print('Earthquakes in Kazakhstan:', filtered);
