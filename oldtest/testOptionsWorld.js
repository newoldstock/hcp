/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Defines settings for the Heron App layout wihtin Layout.js.
 *
 * The layout specifies a hierarchy of ExtJS (Panel) and GeoExt and Heron MC components.
 * For convenience specific settings within this layout are defined here
 * for structuring and reuse purposes.
 *
 **/

OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.4.0/resources/images/default/s.gif';

/*
 * Common settings for MapPanel
 * These will be assigned as "hropts" within the MapPanel config
 */
Ext.namespace("Heron.options.map");
	Heron.options.map.settings = {
							projection: 'EPSG:900913',
							displayProjection: new OpenLayers.Projection("EPSG:4326"),
							units: 'm',
							resolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 
							9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 
							305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 
							9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 
							0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 
							0.009330691928043961, 0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 
							2.915841227513738E-4, 1.457920613756869E-4],							
							maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
							restrictedExtent: new OpenLayers.Bounds(-13670713, 4393119, -13438956, 4539114),
							center: '-13553000, 4465500',
							//maxExtent: 'auto',
							//maxResolution: 'auto',
							//xy_precision: 1,
							zoom: 10,
							theme: null,
							numZoomLevels: 21,

    /**
     * Useful to always have permalinks enabled. default is enabled with these settings.
     * MapPanel.getPermalink() returns current permalink
     *
     **/
    permalinks: {
        /** The prefix to be used for parameters, e.g. map_x, default is 'map' */
        paramPrefix: 'map',

        /** Encodes values of permalink parameters ? default false*/
        encodeType: false,
        /** Use Layer names i.s.o. OpenLayers-generated Layer Id's in Permalinks */
        prettyLayerNames: true
    }

    /** You can always control which controls are to be added to the map. */
    /* controls : [
     new OpenLayers.Control.Attribution(),
     new OpenLayers.Control.ZoomBox(),
     new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
     new OpenLayers.Control.LoadingPanel(),
     new OpenLayers.Control.PanPanel(),
     new OpenLayers.Control.ZoomPanel(),
     new OpenLayers.Control.OverviewMap(),
     new OpenLayers.Control.ScaleLine({geodesic: true, maxWidth: 200})
     ] */
};

// TODO see how we can set/override Map OpenLayers Controls
//Heron.options.map.controls = [new OpenLayers.Control.ZoomBox(),
//			new OpenLayers.Control.ScaleLine({geodesic: true, maxWidth: 200})];

/*
 * Layers to be added to the map.
 * Syntax is defined in OpenLayers Layer API.
 * ("isBaseLayer: true" means the layer will be added as base/background layer).
 */
Heron.options.map.layers = [

    /*
     * ==================================
     *            BaseLayers
     * ==================================
     */
	
	gHyb = new OpenLayers.Layer.Google(
			"Google Satellite",
			{type: google.maps.MapTypeId.HYBRID, visibility: true},
			{singleTile: false, buffer: 0, isBaseLayer: true}

	), 
	
	new OpenLayers.Layer.Google(
			"Google Terrain",
			{type: google.maps.MapTypeId.TERRAIN, visibility: false, numZoomLevels: 16},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),
	
	new OpenLayers.Layer.Google(
			"Google Streets", // the default
			{type: google.maps.MapTypeId.ROADMAP, visibility: false},
			{singleTile: false, buffer: 0, isBaseLayer: true}
	),


	new OpenLayers.Layer.WMS(
		"<a href='http://www.fsa.usda.gov/FSA/apfoapp?area=home&subject=prog&topic=nai' target='_blank'>NAIP Imagery, 2012</a>",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:NAIP2012", tiled: true},
		{singleTile: false, isBaseLayer: true, visibility: false, noLegend: false, numZoomLevels: 21}
	),
	new OpenLayers.Layer("None", {isBaseLayer: true}),	
	
	
    /*
     * ==================================
     *       All Other Layers
     * ==================================
     */
	

	new OpenLayers.Layer.WMS(
		"Planning Limits of Urban Growth",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:planning_limits_of_urban_growth", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Priority Reserve Areas",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:priority_reserve_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Urban Reserve System Interface Zones",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:urban_reserve_system", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Valley Oak and Blue Oak Woodlands",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:hcp_oak_woodlands", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Category 1 Stream Buffers",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:category_1_stream_buffers", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Setback Distances for Category 1 Streams",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:streams_and_setbacks", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	

	new OpenLayers.Layer.WMS(
		"Known Occurences of Covered Plants: 1/4 Mi Buffer",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:known_occurrences_covered_plants", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
		
	new OpenLayers.Layer.WMS(
		"Plant Survey Areas",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:plant_survey_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
	new OpenLayers.Layer.WMS(
		"Wildlife Survey Areas",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:wildlife_survey_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Burrowing Owl Survey and Fee Zones",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:burrowing_owl_survey", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Serpentine Fee Zones",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:serpentine_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Wetland Fee Zones",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:wetland_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Land Cover Fee Zones",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:land_cover_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	// new OpenLayers.Layer.WMS(
		// "FEE ZONES",
		// 'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		// {layers: "HCP:grp_fee_zones", transparent: true, format: 'image/png', tiled: true},
		// {singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	// ),		
	new OpenLayers.Layer.WMS(
		"Land Cover",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:hcp_land_cover", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
	new OpenLayers.Layer.WMS(
		"Private Development Areas",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:private_development_coverage_areas_2", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Parcels",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:parcels", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 1.0, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml', maxResolution: 19.109257068634033}
	),
        new OpenLayers.Layer.WMS(
		"Habitat Plan Permit Area",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:hcp_boundary", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.50, isBaseLayer: false, visibility: true, noLegend: false}
        ),	
	new OpenLayers.Layer.WMS(
		"Santa Clara County Boundary",
		'http://www.hcpmaps.com:8080/geoserver/HCP/wms?',
		{layers: "HCP:county_boundary_area", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false}
	)
 ];

// See ToolbarBuilder.js : each string item points to a definition
// in Heron.ToolbarBuilder.defs. Extra options and even an item create function
// can be passed here as well. "-" denotes a separator item.
Heron.options.map.toolbar = [
//    {type: "scale", options: {width: 110}},
    {type: "-"} ,
    {type: "featureinfo", options: {
        popupWindow: {
            width: 500,
            height: 200,
            featureInfoPanel: {
                // Option values are 'Grid', 'Tree' and 'XML', default is 'Grid' (results in no display menu)
               // displayPanels: ['Grid', 'XML', 'Tree'],
                // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
                exportFormats: ['CSV', 'XLS'],
                // Export to download file. Option values are 'CSV', 'XLS', default is no export (results in no export menu).
                // exportFormats: ['CSV', 'XLS'],
                maxFeatures: 10
            }
        }
    }},
    {type: "-"} ,
    {type: "pan"},
    {type: "zoomin"},
    {type: "zoomout"},
    {type: "zoomvisible"},
    {type: "coordinatesearch", options: {onSearchCompleteZoom: 8, fieldLabelX: 'lon', fieldLabelY: 'lat'}},
    {type: "-"} ,
    {type: "zoomprevious"},
    {type: "zoomnext"},
    {type: "-"},
    {type: "measurelength", options: {geodesic: true,
            control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                persist: true,
                immediate: true,
                displayClass: "olControlMeasureDistance", // css-Cursor
                displaySystem: 'english',
                handlerOptions: {
                    layerOptions: {styleMap: new OpenLayers.StyleMap({
                        "default": new OpenLayers.Style(null, {
                            rules: [new OpenLayers.Rule({
                                symbolizer: {
                                    "Point": {
                                        pointRadius: 10,
                                        graphicName: "square",
                                        fillColor: "white",
                                        fillOpacity: 0.25,
                                        strokeWidth: 1,
                                        strokeOpacity: 1,
                                        strokeColor: "#333333"
                                    },
                                    "Line": {
                                        strokeWidth: 1,
                                        strokeOpacity: 1,
                                        strokeColor: "#FF0000",
                                        strokeDashstyle: "solid"
                                    }
                                }
                            })]
                        })
                    })}
                }
            })
    }},
    {type: "measurearea", options: {geodesic: true,
			control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
				persist: true,
				immediate: true,
				displayClass: "olControlMeasureArea", // css-Cursor
                displaySystem: 'english',
				handlerOptions: {
					layerOptions: {styleMap: new OpenLayers.StyleMap({
						"default": new OpenLayers.Style(null, {
							rules: [new OpenLayers.Rule({
								symbolizer: {
									/*
									 "Point": {
									 pointRadius: 4,
									 graphicName: "square",
									 fillColor: "white",
									 fillOpacity: 1,
									 strokeWidth: 1,
									 strokeOpacity: 1,
									 strokeColor: "#333333"
									 },
									 "Polygon": {
									 strokeWidth: 2,
									 strokeOpacity: 1,
									 strokeColor: "#666666",
									 fillColor: "white",
									 fillOpacity: 0.3
									 }
									 */
									"Point": {
										pointRadius: 10,
										graphicName: "square",
										fillColor: "white",
										fillOpacity: 0.25,
										strokeWidth: 1,
										strokeOpacity: 1,
										strokeColor: "#333333"
									},
									"Polygon": {
										strokeWidth: 1,
										strokeOpacity: 1,
										strokeColor: "#FF0000",
										strokeDashstyle: "solid",
										fillColor: "#FFFFFF",
										fillOpacity: 0.5
                                    }
                                }
                            })]
                        })
                    })}
                }
            })
    }}
];

// The content of the HTML info panel.
Ext.namespace("Heron.options.info");
Heron.options.info.html =
        '<div class="hr-html-panel-body">' +
                '<p>This is a demo app of the <a href="http://heron-mc.org" target="_new">Heron Mapping Client</a>.</p>' +
                '<p>A complete configuration is defined via two JS files: </p>' +
                '<ul>' +
                '<li><a href="../DefaultConfig.js" target="_new">DefaultConfig.js</a> : defines this page layout and its panels/widgets</li>' +
                '<li><a href="../DefaultOptionsWorld.js" target="_new">DefaultOptionsWorld.js</a> : defines options like Layers for that page layout</li>' +
                '</ul>' +
                '<p>This split (into layout/options) is just an example for a convenient way to structure a Heron layout.</p>' +
                '<p>Different (CSS) styles and languages for this same demo app can also be defined by overruling the default options, style and language. Examples:</p>' +
                '<ul>' +
                '<li><a href="../defaultnl/index.html">Same style with Dutch Language and Layers</a> using <a href="../DefaultOptionsNL.js" target="_new">DefaultOptionsNL.js</a></li>' +
                '</ul>' +
                '<p>Note: Feature Info, "I" button in toolbar, is only available for World Cities Layer.</p>' +
                '<p>Base WMS Layers provided by the <a href="http://www.demis.nl" target="_new">Demis (NL)</a></p>' +
                '<p>Overlay WMS/WFS Layers provided by the <a href="http://www.fao.org" target="_new">FAO</a></p>' +
                '<p>Various WMS/WFS Layers provided by the <a href="http://opengeo.org" target="_new">OpenGeo</a></p>' +
                '<p><i>Thanks to Wolfram Winter from <a href="http://www.bahn.de" target="_new">Deutsche Bahn</a> for providing the initial version and drive for this demo.</i></p>' +
                '</div>';

/*
 * Values for BookmarksPanel (bookmarks to jump to specific
 * layers/zoom/center on map. 
 */
Ext.namespace("Heron.options.bookmarks");
Heron.options.bookmarks =
        [
            {
                id: 'id_world_europe',
                name: 'World schematic+cities',
                desc: 'Europe',
                layers: ['World schematic', 'World Cities (FAO)'],
                x: 9.272,
                y: 50.142,
                zoom: 4
            },
            {
                id: 'id_world_northamerica',
                name: 'World image - North America',
                desc: 'North America',
                layers: ['World image'],
                x: -96.328,
                y: 47.461,
                zoom: 2
            }
        ];
Ext.namespace("Heron.options.layertree");	
Heron.options.layertree =
	[
		{
			text: "All layers"
		}
	];
	
