mapboxgl.accessToken = 'pk.eyJ1IjoiY21jMTIyNCIsImEiOiJjbGc1cWE0aWswNXZzM2ZsaW16cmYzb3BkIn0.6GQ2v6YsggVcqkW-VpgidA';


const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/cmc1224/clhp8sej9002601p8379dhiy8', // style URL
    center: [-89.43683345193182, 38.25167175363515], // starting position [lng, lat]
    zoom: 3, // starting zoom
    pitch: 0,
});

map.scrollZoom.disable();

let hoveredStateId = null;

$.getJSON('data/cropvalues_state.geojson', function (data) {

    // clean the data to convert total agricultural export value (in millions) from strings to numbers
    const cleanFeatures = data.features.map(function (feature) {
        const newFeature = feature
        newFeature.properties['cropvalues_state_Total agricultural exports'] = parseFloat(feature.properties['cropvalues_state_Total agricultural exports'])
        return newFeature
    })

    map.on('load', function () {

        //agricultural export values (in millions) by state 
        map.addSource('cropvalues_state', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: cleanFeatures
            },
            generateId: true
        })

        //share of NAICS Code 11 (Agriculture & related, industry) of state workforce in decimal form
        map.addSource('agricultural_employment_state', {
            type: 'geojson',
            data: agricultural_employment
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
                    100,
                    '#DAD7CD',
                    500,
                    '#A3B18A',
                    1000,
                    '#7E9971',
                    2500,
                    '#588157',
                    5000,
                    '#3A5A40',
                    10000,
                    '#344E41',
                ]
            }
        })

        map.addLayer({
            'id': 'line-state-highlight',
            'type': 'fill',
            'source': 'cropvalues_state',
            'layout': {},
            'paint': {
                'fill-color': '#283E34',
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0
                ]
            }
        })

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
        //point sized relative to share of NAICS Code 11 (Agriculture & related, industry) of state workforce in decimal form 
        map.addLayer({
            id: 'ag_employment_share_state',
            type: 'circle',
            source: 'agricultural_employment_state',
            paint: {
                'circle-opacity': 0.6,
                'circle-color': '#C6C3BA',
                'circle-stroke-color': '#3A5A40',
                'circle-stroke-width': 1,
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'NAICS 11 share of total employment (as decimal)'],
                    0,
                    1,
                    0.002,
                    10,
                    0.004,
                    20,
                    0.006,
                    30,
                    0.008,
                    40,
                    .01,
                    50,
                ]

            }

        })


        map.on('click', 'fill-cropvalues-totalexports', (e) => {

            const state_name = e.features[0].properties['name']
            const total_exports_value_millions = parseFloat(e.features[0].properties['cropvalues_state_Total agricultural exports'] * 1000000)
            const total_exports_value = (e.features[0].properties['cropvalues_state_Total agricultural exports'])
            const largest_export = (e.features[0].properties['cropvalues_state_Largest Export'])
            const beef_and_veal = parseFloat(e.features[0].properties['cropvalues_state_Beef and veal'])
            const broiler_meat = parseFloat(e.features[0].properties['cropvalues_state_Broiler meat'])
            const corn = parseFloat(e.features[0].properties['cropvalues_state_Corn'])
            const cotton = parseFloat(e.features[0].properties['cropvalues_state_Cotton'])
            const dairy = parseFloat(e.features[0].properties['cropvalues_state_Dairy products'])
            const Feeds_and_other_feed_grains = parseFloat(e.features[0].properties['cropvalues_state_Feeds and other feed grains'])
            const Fruits_fresh = parseFloat(e.features[0].properties['cropvalues_state_Fruits, fresh'])
            const Fruits_processed = parseFloat(e.features[0].properties['cropvalues_state_Fruits, processed'])
            const Grain_products = parseFloat(e.features[0].properties['cropvalues_state_Grain products'])
            const Hides_and_skins = parseFloat(e.features[0].properties['cropvalues_state_Hides and skins'])
            const Other_livestock_products = parseFloat(e.features[0].properties['cropvalues_state_Other livestock products'])
            const Other_oilseeds_and_products = parseFloat(e.features[0].properties['cropvalues_state_Other oilseeds and products'])
            const Other_plant_products = parseFloat(e.features[0].properties['cropvalues_state_Other plant products'])
            const Other_poultry_products = parseFloat(e.features[0].properties['cropvalues_state_Other poultry products'])
            const Pork = parseFloat(e.features[0].properties['cropvalues_state_Pork'])
            const Rice = parseFloat(e.features[0].properties['cropvalues_state_Rice'])
            const Soybean_meal = parseFloat(e.features[0].properties['cropvalues_state_Soybean meal'])
            const Soybeans = parseFloat(e.features[0].properties['cropvalues_state_Soybeans'])
            const Tobacco = parseFloat(e.features[0].properties['cropvalues_state_Tobacco'])
            const Tree_nuts = parseFloat(e.features[0].properties['cropvalues_state_Tree nuts'])
            const Vegetable_oils = parseFloat(e.features[0].properties['cropvalues_state_Vegetable oils'])
            const Vegetables_fresh = parseFloat(e.features[0].properties['cropvalues_state_Vegetables, fresh'])
            const Vegetables_processed = parseFloat(e.features[0].properties['cropvalues_state_Vegetables, processed'])
            const Wheat = parseFloat(e.features[0].properties['cropvalues_state_Wheat'])

            $('#sidebar').html(
                `<div>
                <h2>
                    ${state_name} 
                </h2>
                <p>${state_name} exported $${(total_exports_value_millions).toLocaleString('en-US')} 
                worth in agricultural products in 2021. Their largest export is ${largest_export}. </p>
                <h3>Value of State Exports</h3>
                <dt> <h4>Product</h4>
                <dd> <h4>Export Value (in millions)</h4>
                <dd> <h4>% of total</h4>
                <dt> Beef and Veal 
                <dd> $ ${beef_and_veal.toLocaleString('en-US')}
                <dd> ${((beef_and_veal) / (total_exports_value) * 100).toFixed(2)}% 
                <dt>Broiler Meat  
                <dd>$ ${broiler_meat.toLocaleString('en-US')} 
                <dd> ${((broiler_meat) / (total_exports_value) * 100).toFixed(2)}%
                <dt>Corn  
                <dd>$ ${corn.toLocaleString('en-US')}
                <dd> ${((corn) / (total_exports_value) * 100).toFixed(2)}% 
                <dt>Cotton 
                <dd>$ ${cotton.toLocaleString('en-US')} 
                <dd> ${((cotton) / (total_exports_value) * 100).toFixed(2)} %
                <dt> Dairy 
                <dd>$ ${dairy.toLocaleString('en-US')} 
                <dd> ${((dairy) / (total_exports_value) * 100).toFixed(2)} %
                <dt>Feeds and other feed grains 
                <dd>$ ${Feeds_and_other_feed_grains.toLocaleString('en-US')} 
                <dd> ${((Feeds_and_other_feed_grains) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Fruits, fresh
                <dd>$ ${Fruits_fresh.toLocaleString('en-US')} 
                <dd> ${((Fruits_fresh) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Fruits, processed
                <dd>$ ${Fruits_processed.toLocaleString('en-US')} 
                <dd> ${((Fruits_processed) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Grain products
                <dd>$ ${Grain_products.toLocaleString('en-US')} 
                <dd> ${((Grain_products) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Hides and skins
                <dd>$ ${Hides_and_skins.toLocaleString('en-US')} 
                <dd> ${((Hides_and_skins) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Other livestock products
                <dd>$ ${Other_livestock_products.toLocaleString('en-US')} 
                <dd> ${((Other_livestock_products) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Other oilseeds and products
                <dd>$ ${Other_oilseeds_and_products.toLocaleString('en-US')} 
                <dd> ${((Other_oilseeds_and_products) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Other plant products
                <dd>$ ${Other_plant_products.toLocaleString('en-US')} 
                <dd> ${((Other_plant_products) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Other poultry products
                <dd>$ ${Other_poultry_products.toLocaleString('en-US')} 
                <dd> ${((Other_poultry_products) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Pork
                <dd>$ ${Pork.toLocaleString('en-US')} 
                <dd> ${((Pork) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Rice
                <dd>$ ${Rice.toLocaleString('en-US')} 
                <dd> ${((Rice) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Soybean meal
                <dd>$ ${Soybean_meal.toLocaleString('en-US')} 
                <dd> ${((Soybean_meal) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Soybeans
                <dd>$ ${Soybeans.toLocaleString('en-US')} 
                <dd> ${((Soybeans) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Tobacco
                <dd>$ ${Tobacco.toLocaleString('en-US')} 
                <dd> ${((Tobacco) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Tree_nuts
                <dd>$ ${Tree_nuts.toLocaleString('en-US')} 
                <dd> ${((Tree_nuts) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Vegetable oils
                <dd>$ ${Vegetable_oils.toLocaleString('en-US')} 
                <dd> ${((Vegetable_oils) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Vegetables, fresh
                <dd>$ ${Vegetables_fresh.toLocaleString('en-US')} 
                <dd> ${((Vegetables_fresh) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Vegetables, processed
                <dd>$ ${Vegetables_processed.toLocaleString('en-US')} 
                <dd> ${((Vegetables_processed) / (total_exports_value) * 100).toFixed(2)} % 
                <dt>Wheat
                <dd>$ ${Wheat.toLocaleString('en-US')} 
                <dd> ${((Wheat) / (total_exports_value) * 100).toFixed(2)} % 
            </div>
            <div>
            <br></br>
                <button id="resetbutton" class="button-28" role="button" onclick="myFunction()">Reset</button>
            </div>`)
        }),



            //highlight on hover
            map.on('mousemove', 'line-state-highlight', (e) => {
                if (e.features.length > 0) {
                    if (hoveredStateId !== null) {
                        map.setFeatureState(
                            { source: 'cropvalues_state', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = e.features[0].id;
                    map.setFeatureState(
                        { source: 'cropvalues_state', id: hoveredStateId },
                        { hover: true }
                    );
                }

                // When the mouse leaves the state-fill layer, update the feature state of the
                // previously hovered feature.
                map.on('mouseleave', 'line-state-highlight', () => {
                    if (hoveredStateId !== null) {
                        map.setFeatureState(
                            { source: 'cropvalues_state', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = null;
                });
                map.on('mouseenter', 'fill-cropvalues-totalexports', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'fill-cropvalues-totalexports', () => {
                    map.getCanvas().style.cursor = '';
                });
                map.on('mouseenter', 'ag_employment_share_state', (e) => {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = 'pointer';

                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const employment = e.features[0].properties['NAICS 11 share of total employment (as decimal)'];
                    const state = e.features[0].properties['State']
                    const popup = new mapboxgl.Popup()

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup
                        .setLngLat(coordinates)
                        .setHTML(`${numeral(employment).format ('0.00%')} of the workforce in ${state} works in the agricultural industry`)
                        .addTo(map);

                    map.on('mouseleave', 'ag_employment_share_state', () => {
                        map.getCanvas().style.cursor = '';
                        popup.remove();
                    })

                    //button actions

                    $('#fly-to-alaska').on('click', function () {
                        map.flyTo({
                            center: [-151.30148325488983, 65.48942304758057],
                            zoom: 3,
                        })
                    }),

                        $('#fly-to-hawaii').on('click', function () {
                            map.flyTo({
                                center: [-156.7600002487613, 20.951584107540913],
                                zoom: 3,
                            })
                        }),


                        $('#fly-to-continentalUS').on('click', function () {
                            map.flyTo({
                                center: [-92.19968288822557, 34.89277754376434],
                                zoom: 3,
                            })
                        }),

                        $('#reset').on('click', function () {
                            map.flyTo({
                                center: [-92.19968288822557, 34.89277754376434],
                                zoom: 3,
                            })
                        })

                });
            });
    })
})