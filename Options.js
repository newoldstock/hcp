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

OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.4.0/resources/images/default/s.gif';

// Settings for main map
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
							zoom: 9,
							theme: null,
							numZoomLevels: 21
};

//Define elements of toolbar
Heron.options.map.toolbar = [
//    {type: "scale", options: {width: 110}},

    {type: "-"} ,
	{
		// Instead of an internal "type", or using the "any" type
		// provide a create factory function.
		// MapPanel and options (see below) are always passed
		create: function (mapPanel, options) {

			// A trivial handler
			options.handler = function () {
					win.show(this);
			};

			// Provide an ExtJS Action object
			// If you use an OpenLayers control, you need to provide a GeoExt Action object.
			return new Ext.Action(options);
		},

		/* Options to be passed to your create function. */
		options: {
			tooltip: 'Show Help',
			iconCls: "icon-instructions",
			id: "myitem",
			text: "Instructions"
		}
	},
    {type: "-"} ,	
    {type: "pan"},
    {type: "zoomin"},
    {type: "zoomout"},
    {type: "zoomvisible"},
    {type: "coordinatesearch", options: {projEpsg: 'EPSG:4326', onSearchCompleteZoom: 11, fieldLabelX: 'lon (X)', fieldLabelY: 'lat (Y)', fieldEmptyTextX: 'Enter'}},
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
    }},
    {type: "-"} ,
    {type: "featureinfo", options: {
        popupWindow: {
			title: 'Feature Information',
            width: 500,
            height: 200,
            featureInfoPanel: {
				layout: 'fit',
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

	{
		create: function (mapPanel, options) {
			var map = mapPanel.getMap();
			
			return new GeoExt.Action({
				text: "Report",
				iconCls: "icon-report",	
			
				control: new OpenLayers.Control({
				    type: OpenLayers.Control.TYPE_TOOL,
				    initialize: function(userFunction, options) {
				        OpenLayers.Control.prototype.initialize.apply(this, [options]);
				    }, 
				    draw: function() {
				        this.handler = new OpenLayers.Handler.Polygon(this,
						 			{done: this.identify});
				    },
					identify: function(aPoly) {
						var content;
						var GUID = 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
											var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
											return v.toString(16);
										});
						var vertCount = aPoly.getVertices().length;
 						var theURL = "process.php?poly=" + aPoly + "&guid=" + GUID + "&vertcount=" + vertCount;
						$.blockUI({ message: '<p style="font-family: Arial, Helvetica, sans-serif; font-weight: bold; padding: 25px;"><img src="busy.gif" /> Running Analysis...</h1>' }); 
						setTimeout(function(){}, 1000);
						//get the file
						$.ajax({
						  type: "GET",
						  url: theURL,
						  dataType: "html",
						  success : function(data) {
										$.unblockUI();
						                content = data;
										Ext.fly("report-content").update(content);
										reportWin.show(this);
										reportMapInit();
										var polyFeature = new OpenLayers.Feature.Vector(aPoly);
										var polyExtent = aPoly.getBounds();
										var polyLayer = new OpenLayers.Layer.Vector("Poly Layer");
										polyLayer.addFeatures(polyFeature);
										reportmap.addLayer(polyLayer);
										reportmap.zoomToExtent(polyExtent);
						            }
						});	 
				    }										
				}),
				
				map: mapPanel.getMap(),
				// button options
				enableToggle: true,
				pressed: false,
            	toggleGroup: "toolGroup",
				allowDepress: false,
				tooltip: "Click on Parcel to Generate Report",
				// check item options
				group: "draw"
			})
		}
	}
];

Ext.namespace("Heron.options.layertree");	
Heron.options.layertree =
	[
		{
			text: "All layers"
		}
	];
	