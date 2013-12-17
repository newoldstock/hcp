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
/** This config assumes the DefaultOptionsNL.js to be included first!! */

//Ext.namespace("Heron.options.map.settings");

/** api: example[layertree]
 *  LayerTree
 *  ---------
 *  Build a custom layer tree for base layers and thematic overlays.
 */

// This is an example how to create arbitrary Layer trees within the Layer Browser
// See widgets/LayerTreePanel.js

// This is the default tree, used here just for reference

Ext.namespace("Heron.examples");

/** Define new default selection styles
 */
 
OpenLayers.Feature.Vector.style={
	"default":{
		fillColor:"#ee9900",
		fillOpacity:0.0,
		hoverFillColor:"white",
		hoverFillOpacity:0.8,
		strokeColor:"#FFFF00",
		strokeOpacity:0.8,
		strokeWidth:3,
		strokeLinecap:"round",
		strokeDashstyle:"solid",
		hoverStrokeColor:"red",
		hoverStrokeOpacity:1,
		hoverStrokeWidth:0.2,
		pointRadius:6,
		hoverPointRadius:1,
		hoverPointUnit:"%",
		pointerEvents:"visiblePainted",
		cursor:"inherit",
		fontColor:"#000000",
		labelAlign:"cm",
		labelOutlineColor:"white",
		labelOutlineWidth:3
		},

	select:{
		fillColor:"blue",
		fillOpacity:0.0,
		hoverFillColor:"white",
		hoverFillOpacity:0.8,
		strokeColor:"#FF0000",
		strokeOpacity:1,
		strokeWidth:6,
		strokeLinecap:"round",
		strokeDashstyle:"solid",
		hoverStrokeColor:"red",
		hoverStrokeOpacity:1,
		hoverStrokeWidth:0.2,
		pointRadius:6,
		hoverPointRadius:1,
		hoverPointUnit:"%",
		pointerEvents:"visiblePainted",
		cursor:"pointer",
		fontColor:"#000000",
		labelAlign:"cm",
		labelOutlineColor:"white",
		labelOutlineWidth:3},
		
	temporary:{
		fillColor:"#66cccc",
		fillOpacity:0.2,
		hoverFillColor:"white",
		hoverFillOpacity:0.8,
		strokeColor:"#66cccc",
		strokeOpacity:1,
		strokeLinecap:"round",
		strokeWidth:2,
		strokeDashstyle:"solid",
		hoverStrokeColor:"red",
		hoverStrokeOpacity:1,
		hoverStrokeWidth:0.2,
		pointRadius:6,
		hoverPointRadius:1,
		hoverPointUnit:"%",
		pointerEvents:"visiblePainted",
		cursor:"inherit",
		fontColor:"#000000",
		labelAlign:"cm",
		labelOutlineColor:"white",
		labelOutlineWidth:3},
		
	"delete":{
		display:"none"}
	};

	/** Create a config for the search panel. This panel may be embedded into the accordion
	 * or bound to the "find" button in the toolbar. Here we use the toolbar button.
	 */

 
	 
	 
var treeDefault = [
	{
		nodeType: "gx_overlaylayercontainer",
		expanded: true,

		// render the nodes inside this container with a radio button,
		// and assign them the group "foo".
		loader: {
			baseAttrs: {
				/*radioGroup: "foo", */
				uiProvider: "layerNodeUI"
			}
		}
	},
	{
		nodeType: "gx_baselayercontainer",
		text: 'Base Layers',
		expanded: true
	}
];

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
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:NAIP2012", tiled: true},
		{singleTile: false, isBaseLayer: true, visibility: false, noLegend: false, numZoomLevels: 21}
	),
	new OpenLayers.Layer("None", {isBaseLayer: true, numZoomLevels: 21}),	
	
	
    /*
     * ==================================
     *       All Other Layers
     * ==================================
     */
	
	new OpenLayers.Layer.WMS(
		"Urban Service Areas",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:urbanservicearea", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 1.0, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"City Limits",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:citylimits", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.6, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Planning Limits of Urban Growth",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:planning_limits_of_urban_growth", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Priority Reserve Areas",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:priority_reserve_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Urban Reserve System Interface Zones",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:urban_reserve_system", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),
	new OpenLayers.Layer.WMS(
		"Valley Oak and Blue Oak Woodlands",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:valley_and_blue_oak_woodlands", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Category 1 Stream Buffers and Setbacks",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:category_1_stream_setbacks", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Known Occurrences of Covered Plants: 1/4 Mi Buffer",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:known_occurrences_covered_plants", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
		
	new OpenLayers.Layer.WMS(
		"Plant Survey Areas",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:plant_survey_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
	new OpenLayers.Layer.WMS(
		"Wildlife Survey Areas",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:wildlife_survey_areas", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Burrowing Owl Survey and Fee Zones",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:burrowing_owl_survey", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Serpentine Fee Zones",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:serpentine_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Wetland Fee Zones",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:wetland_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Land Cover Fee Zones",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:land_cover_fee_zones", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	// new OpenLayers.Layer.WMS(
		// "FEE ZONES",
		// 'http://www.hcpmaps.com/geoserver/HCP/wms?',
		// {layers: "HCP:grp_fee_zones", transparent: true, format: 'image/png', tiled: true},
		// {singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	// ),		
	new OpenLayers.Layer.WMS(
		"Land Cover",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:hcp_land_cover", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.7, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),		
	new OpenLayers.Layer.WMS(
		"Private Development Areas",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:private_development_coverage_areas_2", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.8, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml' }
	),	
	new OpenLayers.Layer.WMS(
		"Parcels",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:parcels_proj", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 1.0, isBaseLayer: false, visibility: false, noLegend: false, featureInfoFormat: 'application/vnd.ogc.gml', maxResolution: 19.109257068634033}
	),
	
	new OpenLayers.Layer.WMS(
		"Habitat Plan Permit Area",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:hcp_boundary", transparent: true, format: 'image/png', tiled: false, styles: "slash"},
		{singleTile: false, opacity: 0.70, isBaseLayer: false, visibility: false, noLegend: false,  featureInfoFormat: 'application/vnd.ogc.gml'}
		),	
			
	// new OpenLayers.Layer.WMS(
		// "Habitat Plan Permit Area:Dots",
		// 'http://www.hcpmaps.com/geoserver/HCP/wms?',
		// {layers: "HCP:hcp_boundary", transparent: true, format: 'image/png', tiled: false, styles: "dots"},
		// {singleTile: false, opacity: 0.80, isBaseLayer: false, visibility: true, noLegend: false,  featureInfoFormat: 'application/vnd.ogc.gml'}
		// ),	
		
	// new OpenLayers.Layer.WMS(
		// "Habitat Plan Permit Area",
		// 'http://www.hcpmaps.com/geoserver/HCP/wms?',
		// {layers: "HCP:hcp_boundary", transparent: true, format: 'image/png', tiled: true},
		// {singleTile: false, opacity: 0.50, isBaseLayer: false, visibility: false, noLegend: false,  featureInfoFormat: 'application/vnd.ogc.gml'}
		// ),	
	new OpenLayers.Layer.WMS(
		"Santa Clara County Boundary",
		'http://www.hcpmaps.com/geoserver/HCP/wms?',
		{layers: "HCP:county_boundary_area", transparent: true, format: 'image/png', tiled: true},
		{singleTile: false, opacity: 0.9, isBaseLayer: false, visibility: true, noLegend: false}
	)
 ];
 
// Layers are organized in the application using the Layer Tree below:
var newLayertree = [
	{
		text:'HCP Data', expanded: true, children:
			[
				{nodeType: 'gx_layer', layer: 'Habitat Plan Permit Area'},
				// {nodeType: 'gx_layer', layer: 'Habitat Plan Permit Area:Dots'},
				// {nodeType: 'gx_layer', layer: 'Habitat Plan Permit Area:Slash'},				
				{nodeType: 'gx_layer', layer: 'Private Development Areas'},		
				{nodeType: 'gx_layer', layer: 'Land Cover'},
				
				{text: 'Fee Zones', expanded: false, children:
					[
						{nodeType: 'gx_layer', layer: 'Land Cover Fee Zones'},
						{nodeType: 'gx_layer', layer: 'Wetland Fee Zones'},
						{nodeType: 'gx_layer', layer: 'Serpentine Fee Zones'},
						{nodeType: 'gx_layer', layer: 'Burrowing Owl Survey and Fee Zones'}						
					]
				},
				
				{nodeType: 'gx_layer', layer: 'Wildlife Survey Areas'},	
				
				{text: 'Plant Survey Areas', expanded: false, children:
					[
						{nodeType: 'gx_layer', layer: 'Plant Survey Areas'},	
						{nodeType: 'gx_layer', layer: 'Known Occurrences of Covered Plants: 1/4 Mi Buffer'},						
					]
				},

				{text: 'Habitat Plan Conditions', expanded: false, children:
					[
						{nodeType: 'gx_layer', layer: 'Category 1 Stream Buffers and Setbacks'},
						{nodeType: 'gx_layer', layer: 'Valley Oak and Blue Oak Woodlands'},
						{nodeType: 'gx_layer', layer: 'Urban Reserve System Interface Zones'}						
					]
				},
				
				{nodeType: 'gx_layer', layer: 'Priority Reserve Areas'},					
			]
	},
	{
		text:'General Data', expanded: true, children:
			[
				{nodeType: 'gx_layer', layer: 'Santa Clara County Boundary'},	
				{nodeType: 'gx_layer', layer: 'Parcels'},					
				{nodeType: 'gx_layer', layer: 'City Limits'},
				{nodeType: 'gx_layer', layer: 'Urban Service Areas'},		
				{nodeType: 'gx_layer', layer: 'Planning Limits of Urban Growth'}					
			]
	},
	{
		text:'Base Layers', nodeType: "gx_baselayercontainer", expanded: true
	}	
];




// Replace default layer browser DefaultConfig.js
// Pass our theme tree config as an option
Ext.namespace("Heron.options.layertree");
Heron.options.layertree.tree = newLayertree;

