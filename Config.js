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
						{nodeType: 'gx_layer', layer: 'Known Occurences of Covered Plants: 1/4 Mi Buffer'},						
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

