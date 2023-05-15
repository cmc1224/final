mapboxgl.accessToken = 'pk.eyJ1IjoiY21jMTIyNCIsImEiOiJjbGc1cWE0aWswNXZzM2ZsaW16cmYzb3BkIn0.6GQ2v6YsggVcqkW-VpgidA';

const NYC_Coordinates = [-73.99863751113894, 40.75334755796155]

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-101.43084079316468, 39.12071916433891], // starting position [lng, lat]
    zoom: 3, // starting zoom
    pitch: 0
});

map.addControl(new mapboxgl.NavigationControl());

$.getJSON('data/cropvalues_state.geojson', function (data) {

    // clean the data to convert pop2010 strings to numbers
    const cleanFeatures = data.features.map(function (feature) {
        const newFeature = feature
        newFeature.properties['cropvalues_state_Total agricultural exports'] = parseFloat(feature.properties['cropvalues_state_Total agricultural exports'])
        return newFeature
    })

    console.log('cleanFeatures', cleanFeatures)

    map.on('load', function () {
        //crop values by state 
        map.addSource('cropvalues_state', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: cleanFeatures
            },
            generateId: true
        })

        //state fill
        map.addLayer({
            id: 'fill-cropvalues-totalexports',
            type: 'fill',
            source: 'cropvalues_state',
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'cropvalues_state_Total agricultural exports'],
                    50,
                    '#eff3ff',
                    100,
                    '#c6dbef',
                    500,
                    '#9ecae1',
                    1000,
                    '#6baed6',
                    5000,
                    '#3182bd',
                    10000,
                    '#08519c',
                    
                ]
            }
        })

        map.addLayer({
            'id': 'line-state-highlight',
            'type': 'line',
            'source': 'cropvalues_state',
            'layout': {},
            'paint': {
                'line-color': '#1F51FF',
                'line-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0
                ]
            }
        });
                // states border
        map.addLayer({
            id: 'outline-states',
            type: 'line',
            source: 'cropvalues_state',
            paint: {
                'line-color': '#000',
                'line-width': 0.5
            }
        })



    });
});