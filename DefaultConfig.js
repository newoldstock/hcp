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
Ext.namespace("Heron");
Ext.namespace("Heron.options");
Ext.namespace("Heron.options.layertree");

/**
 * Defines the entire layout of a Heron webapp using ExtJS-style.
 *
 * The layout specifies a hierarchy of ExtJS (Panel) components.
 * Each component is either a container of components (xtype: 'panel', i.e. an ExtJS Panel)
 * or a specific leaf component like a map panel (xtype: 'hr_mappanel') or simple HTML
 * panel (xtype: 'hr_htmlpanel'). Each component has a 'xtype' string and component-specific options.
 * The 'xtype' defines the component widget class .
 * For a container-type (xtype: 'panel') the options should include a 'layout' (like 'border' or 'card',
 * and an array of 'items' with each element being a component (another container or a leaf widget component).
 *
 * In order to distinguish ExtJS-specific config options from those that are Heron-specific,
 * the later are prefixed with "hr". These are defined outside this file to allow quick custimization.
 *
 * Specific config options for ExtJS components can be found in the API docs:
 * http://docs.sencha.com/ext-js/3-4/#!/api
 *
 * This is the core config, mainly the layout of a Heron browser application for all examples.
 * Many of the options refer to Javascript variables that are defined within
 * the DefaultOptions*.js. In particular Layers and specific widgets. This has been done
 * to create a reusable config for all examples. Each example may also add a 3rd refinement
 * using a local Config.js file. The names of the config files and variables like Heron.options.bookmarks
 * don't matter. They are just a convenience as to break up a large configuration into
 * the more stable common parts and the more variable parts. As it is all JSON/JavaScript, we
 * can use variables, in our case namespaced, like "Heron.options.bookmarks" as to avoid conflicts in
 * the global JS namespace. (If we would have XML configs we would have to resort to xlinks).
 *
 **/

Heron.layout = {
	xtype: 'panel',

	/* Optional ExtJS Panel properties here, like "border", see ExtJS API docs. */
	id: 'hr-container-main',
	layout: 'border',
	border: true,

    /** Any classes in "items" and nested items are automatically instantiated (via "xtype") and added by ExtJS. */
	items: [	
		{
			xtype: 'panel',
			id: 'hr-menu-left-container',
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch',
				pack: 'start'
			},
			//layout: 'accordion',
			region : "west",
			width: 325,
			collapsible: true,
			border: false,
			items: [
                {
                    xtype: 'hr_searchcenterpanel',
					//height: 240,
					flex: 2,
					hropts: {
						searchPanel: {
							xtype: 'hr_formsearchpanel',
							showTopToolbar: true,
							header: true,
							title: __('Search by APN'),
							border: false,
							protocol: new OpenLayers.Protocol.WFS({
								version: "1.1.0",
								url: ['http://www.hcpmaps.com/cgi-bin/proxy.cgi?url=http://www.hcpmaps.com:8080/geoserver/wfs?'],
								srsName: "EPSG:900913",
								featureType: "parcels_proj"
							}),
							items: [
								{
									xtype: "textfield",
									name: "apn__like",
									value: '',
									fieldLabel: "  APN"
								},
								{
									xtype: "label",
									id: "helplabel",
									html: 'Enter a partial or complete APN (no dashes), and then click \'Search\' to locate a property.<br><br>Visit the <a href="https://www.sccassessor.org/" target="_blank">Santa Clara County Assessor\'s website</a> to determine the APN of a property.',
									style: {
										fontSize: '10px',
										color: '#AAAAAA'
									}
								}
							],
							hropts: {
								onSearchCompleteZoom: 10,
								autoWildCardAttach: true,
								caseInsensitiveMatch: true,
								logicalOperator: OpenLayers.Filter.Logical.AND,
								statusPanelOpts: {
									html: '&nbsp;',
									height: 'auto',
									preventBodyReset: true,
									bodyCfg: {
										style: {
											padding: '6px',
											border: '0px'
										}
									},
									style: {
										marginTop: '2px',
										paddingTop: '2px',
										fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
										fontSize: '11px',
										color: '#0000C0'
									}
								}
							}
						},
						resultPanel: {
							xtype: 'hr_featuregridpanel',
							id: 'hr-featuregridpanel',
							header: true,
							autoConfig: true,
							title: __('Search Results'),
							border: false,
							downloadable: false,
							columns: [
								{
									header: "APN",
									width: 58,
									dataIndex: "apn"
								},
								{
									header: "Address",
									width: 203,
									dataIndex: "situs_addr"
								},
								{
									header: "Acres",
									width: 55,
									dataIndex: "acres_rec"
								}				
							],
							//exportFormats: ['XLS', 'CSV'],
							hropts: {
								zoomOnRowDoubleClick: true,
								zoomOnFeatureSelect: false,
								zoomLevelPointSelect: 8
							}
						}
					}
                },
				{
					xtype: 'hr_layertreepanel',
					//height: 450,
					flex: 3,
					// Optional, use internal default if not set
					hropts : Heron.options.layertree,

				}				
			]
		},
		{
			xtype: 'panel',
			id: 'hr-map-and-info-container',
			layout:'border',
			region:'center',
			width:'100%',
			collapsible:false,
			split:false,
			border:false,
			items: [
				{
					xtype: 'hr_mappanel',
					id: 'hr-map',
					title: '&nbsp;',
					region: 'center',
					collapsible : false,
					border: false,
					hropts: Heron.options.map
				}
			]
		},
		{
			xtype: 'panel',
			id: 'hr-menu-right-container',
			layout: 'fit',			
			region : "east",
			width: 250,
			collapsible: true,
			split	: false,
			border: false,
			items: [
				{
					xtype: 'hr_layerlegendpanel',
					id: 'hr-layerlegend-panel',
					border: false,
					defaults: {
						useScaleParameter : true,
						baseParams: {
							FORMAT: 'image/png',
							LEGEND_OPTIONS: 'fontSize:9'
						}
					},
					hropts: {
						// Preload Legends on initial startup
						// Will fire WMS GetLegendGraphic's for WMS Legends
						// Otherwise Legends will be loaded only when Layer
						// becomes visible. Default: false
						prefetchLegends: false
					}
				}
			]
		},
		{
			xtype: 'panel',
			id: 'banner',
			region : "north",
			html: '<div id=\'banner_container\'><div id=\'banner_main\'><img src=\'final_banner.jpg\'/></div></div>',
			height: 80,
			collapsible: false,
			border: false,
			items: [
			]
		}		
	]
};

