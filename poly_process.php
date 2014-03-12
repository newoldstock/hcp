<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
	
	// Main analysis function
	function run_query ($connection, $poly, $layer_name, $attribute, $threshold, $pctYN) {
			 $resultsArray = array(); //establish array to hold result
			 //[0]: attribute column from analysis layer
			 //[1]: area of the intersect between parcel poly and layer poly
			 //[2]: area of parcel
			 //
			 //Select based on intersect between parcel layer and analysis layer where apn=passed apn

			 $qryString = "SELECT $attribute, sum(st_area(st_intersection($poly, $layer_name.the_geom))) as iarea, sum(st_area
						   ($poly)) from $layer_name where $poly && $layer_name.the_geom and
						   st_intersects($layer_name.the_geom, $poly) group by $attribute";   

			$qry_results = pg_query($connection, $qryString);

			 $the_count = pg_num_rows($qry_results);
			 if ($the_count == 0) { //no results were returned
			   //do nothing -- return no results;
			 }
			 else { //there is at least one record
			   while ($row = pg_fetch_row($qry_results)) { //while there are rows left in the returned results...
				 $value = $row[0];  //grab attribute value
				 $pct_parcel = round(($row[1]/$row[2])*100, 1);  //calculate percent of parcel in attribute polygon
				 if ($value <> "" && $pct_parcel >= $threshold ) { //if attribute has a value and percent of parcel > X then...
					if ($pctYN == "Y") { //if $pctYN flag set to "Y", tag on percent
						$acres = round($row[1]/43560, 2);
						$resultsArray[]=$value." ($acres acres)";				
					  //$resultsArray[]=$value." ($row[1] sq ft)";
					}
					else { //if $pctYN set to "N", just the value
					  $resultsArray[]=$value;
					}
				 }
				 else { //either no attribute value or percent < threshold
				   if ($pct_parcel < $threshold) { //if percent is too small, then...
					 //do nothing and do it well
				   }
				   else {
					 $resultsArray[]="<em>Not Determined</em>"; //area meets threshold, but no value found
				   }
				 }
			   }
			 }
			 $unique_results = array_unique($resultsArray); //make results array unique
			 return $unique_results; //return results

	}	
	
	//Function to format and spit out results into a table
	function formatResults ($rowName, $results) {
		echo '<tr><td>'.$rowName.'</td><td>';

		if (count($results) >= 1) {
		  echo '<ul>';
		  foreach ($results as $a)
			echo '<li>'.$a.'</li>';
		  echo '</ul>';	
		} else {
			echo '<span style="color:red">N/A</span></td></tr>';
		}	
	}
?>
<link rel="stylesheet" type="text/css" href="appcss.css"/>
	
<?php	
	// Grab passed polygon
	$rawpoly = $_GET['poly'];
	$uniqueID = $_GET['guid'];
	$vertcount = $_GET['vertcount'];
	
	// Halt the process if vertex count > 250 or < 3
	if ($vertcount > 250) {
		echo '<tr><td><h1><span style="color:red"><p>There are too many vertices in your polygon for the analysis to progress.  Please reduce the complexity of the analysis footprint.</span></h1></td></tr>';
		exit;
	}

	if ($vertcount < 3) {
		echo '<tr><td><h1><span style="color:red"><p>There were not enough points to form a polygon.  Please try the analysis again.</span></h1></td></tr>';
		exit;
	}	
	//Convert polygon from EPSG:900913 to EPSG:2227
	$polyString = "ST_Transform(ST_GeomFromText('".$rawpoly."', 900913), 2227)";
	
	// Connecting, selecting database
	$dbconn = pg_connect("host=localhost dbname=sccgis user=gisadmin password=g1s*dm1n")
	    or die('Could not connect: ' . pg_last_error());

	//Bail out if polygon is tweaked	
	$validityQuery = "SELECT ST_IsValid($polyString)";
	$result = pg_query($validityQuery) or die('Query failed: ' . pg_last_error());
	$row = pg_fetch_row($result);
	if ( $row[0] == 'f') {
		echo '<tr><td><h1><span style="color:red"><p>There is a problem with the polygon you drew (it likely crosses over itself). <br>Please try the analysis again.</span></h1></td></tr>';
		exit;
	}

	// Insert polygon footprint with GUID into hcp_report_footprints table
	$insertQuery = "INSERT INTO hcp_report_footprints (the_geom, uniqueid) values (ST_GeomFromText('$rawpoly', 900913), '$uniqueID')";
	$result = pg_query($insertQuery) or die('Query failed: ' . pg_last_error());	
	
	//Grab GID from database using passed UID
	$gidQuery = "SELECT gid from hcp_report_footprints WHERE uniqueid = '$uniqueID'";
	$result = pg_query($gidQuery) or die('Query failed: ' . pg_last_error());	
	$row = pg_fetch_row($result);
	$gid = $row[0];
	//$gid = pg_fetch_row($result)[0];
	
	// Get area in square feet from reprojected geometry
	$query = "SELECT round(ST_Area($polyString))";
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	
	while ($row = pg_fetch_row($result)) {
		$theArea = round($row[0]/43560, 2); //convert to acres
	}
	$shpLink = "http://www.hcpmaps.com/geoserver/HCP/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=hcp_report_footprints&featureID=hcp_report_footprints.".$gid."&srsName=EPSG:2227&outputFormat=shape-zip";
	echo '<a href="'.$shpLink.'" style="text-decoration: none" title="Click to download analysis polygon as ESRI Shapefile"><div id="download" style="width: 120px; margin: 0 auto; color:#0000AA;" class="no-print"><h1 align="center" style="background-color:#EEEEEE; padding: 5px;">Download Analysis Polygon</h1></div></a>';
	echo '<body>';
	echo '<img src="./resources/scv_header.jpg" height="135" width="700" style="display: block; margin: auto;">';
	echo '<br><hr><br>';
	//echo '<a href="'.$shpLink.'" target="_blank">Download Footprint as ESRI Shapefile</a>';
	echo '<h1>General Information</h1>';
	echo '<table cellpadding="0" cellspacing="0" class="db-table">';	
	echo '<tr><td>Digitized Area</td><td>'.$theArea.' acres</td><th rowspan="4" width="300"><div id="report-map"></div></th></tr>';	
	//echo '<tr><td>Digitized Area</td> <td>'.$theArea.' acres</td><th rowspan="6" width="300"><div id="report-map"></div></th></tr>';
	

//City-------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "citylimits", "name", 1, "Y");
	formatResults ("City", $queryLayer);	
	
//USA-------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString,"urbanservicearea", "usa", 1, "Y");
	formatResults ("Urban Service Area", $queryLayer);	

//Planning Limits of Urban Growth--------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString,"planning_limits_of_urban_growth", "name", 1, "Y");
	formatResults ("Planning Limits of Urban Growth", $queryLayer);	
	
	echo '</table><br><br>';
	
	
/*
 HCP Analysis Begins Here 
*/
	echo '<h1>Habitat Plan Information</h1>';
	echo '<table cellpadding="0" cellspacing="0" class="db-table">';	
	
//HCP Study Area-----------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString,"hcp_boundary", "area_acres", 1, "N");
	if (count($queryLayer) >= 1) {
	  echo '<tr><td>Habitat Plan Study Area</td><td>YES</td></tr>';
	} else {
	   echo '<tr><td><span style="color:red"><p>Not located within the Habitat Plan Study area.  Analysis complete.</span></td></tr>';
		exit;
	}

//Private Development Areas---------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "private_development_coverage_areas_2", "zone", 1, "Y");
	formatResults ("Private Development Areas", $queryLayer);
	
//Land Cover----------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "land_cover", "land_cover", 0.5, "Y");
	formatResults ("Land Cover", $queryLayer);
	
//Land Cover Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "land_cover_fee_zones", "fee_zone", 1, "Y");
	formatResults ("Land Cover Fee Zones", $queryLayer);

//Wetland Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "wetland_fee_zones", "land_cover", 1, "Y");
	formatResults ("Wetland Fee Zones", $queryLayer);

//Serpentine Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "serpentine_fee_zones", "land_cover", 1, "Y");
	formatResults ("Serpentine Fee Zones", $queryLayer);
		
//Burrowing Owl Survey and Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "occupiednestingburrowingowlhabitat", "name", 1, "Y");
	formatResults ("Burrowing Owl Survey and Fee Zone", $queryLayer);
				
//Wildlife Survey Areas-------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "wildlife_survey_areas", "species", 1, "Y");
	formatResults ("Wildlife Survey Areas", $queryLayer);

//Plant Survey Areas-------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "plant_survey_areas", "land_cover", 1, "Y");
	formatResults ("Plant Survey Areas", $queryLayer);

//Known Occurrences of Covered Plants----------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "known_occurrences_covered_plants", "commonname", 1, "Y");
	formatResults ("Known Occurrences of Covered Plants (1/4 mile radius)", $queryLayer);

//Category 1 Stream Buffers and Setbacks--------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "category_1_stream_buffers", "geobrowser_note", 1, "Y");
	formatResults ("Category 1 Streams and Setbacks", $queryLayer);

//Valley Oak and Blue Oak Woodlands-----------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "valley_and_blue_oak_woodlands", "land_cover", 1, "Y");
	formatResults ("Valley Oak and Blue Oak Woodland", $queryLayer);

//Urban Reserve System Interface Zones----------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "urbanreservesysteminterfacezones", "note", 1, "Y");
	formatResults ("Urban Reserve System Interface Zones", $queryLayer);
	
//Priority Reserve Areas--------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $polyString, "conservationanalysiszones_high_mod", "priority", 1, "Y");
	formatResults ("Priority Reserve Areas", $queryLayer);	
	


// Closing connection
pg_close($dbconn);
?>

</table>
<div style="margin: auto;"><p style="text-align: center; font-size:7px; color:#555555;">All information provided in official Santa Clara Valley Habitat Agency (SCVHA) websites is provided for informational purposes only and does not constitute a legal contract between the SCVHA and any person or entity. Information on the websites is subject to change without prior notice. Although every reasonable effort is made to present current and accurate information, the SCVHA makes no guarantees of any kind.<br>
The SCVHA, its employees, officers, content providers, affiliates or other representatives are not liable for damages of any kind (including, without limitation, lost profits, direct, indirect, compensatory, consequential, exemplary, special, incidental, or punitive damages) arising out of your use of, your inability to use, or the performance of this website or the content whether or not we have been advised of the possibility of such damages.</p></div>
</body>

</html>
