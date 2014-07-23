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

// Describe layout of application
Heron.layout = {
	xtype: 'panel',

	/* Optional ExtJS Panel properties here, like "border", see ExtJS API docs. */
	id: 'hr-container-main',
	layout: 'border',
	border: false,

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
										color: '#333333'
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
							title: __('Parcel Search Results'),
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
					border: true,
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

//Feature selection style
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