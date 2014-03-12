<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
	
	function run_query ($connection, $apn, $layer_name, $attribute, $threshold, $pctYN) {
			 $resultsArray=array(); //establish array to hold result
			 //[0]: attribute column from analysis layer
			 //[1]: area of the intersect between parcel poly and layer poly
			 //[2]: area of parcel
			 //
			 //Select based on intersect between parcel layer and analysis layer where apn=passed apn

			 $qryString = "SELECT $attribute, sum(st_area(st_intersection(parcels.the_geom, $layer_name.the_geom))) as iarea, sum(st_area
						   (parcels.the_geom)) from parcels, $layer_name where parcels.the_geom && $layer_name.the_geom and
						   st_intersects($layer_name.the_geom, parcels.the_geom) and parcels.apn='$apn' group by $attribute";   
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
						$acres = round($row[1]/43560, 1);
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
	$x = $_GET['x'];
	$y = $_GET['y'];
	$apn = '';
	// Connecting, selecting database
	$dbconn = pg_connect("host=localhost dbname=sccgis user=gisadmin password=g1s*dm1n")
	    or die('Could not connect: ' . pg_last_error());

	// Performing SQL query
	//$query = 'SELECT apn, sq_ft_rec from google_parcels where apn like \'2961404%\'';
	//$query = 'select apn from parcels where ST_Intersects(parcels.geom, ST_Transform(ST_GeomFromText(\'POINT('.$x.' '.$y.')\',900913), 2227))';
	$query = 'select apn from parcels where ST_Intersects(parcels.the_geom, ST_Transform(ST_GeomFromText(\'POINT('.$x.' '.$y.')\',900913), 2227))';	
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	
	while ($row = pg_fetch_row($result)) {
		$apn = $row[0];
	}
	
	//If no APN is returned, say so and exit.
    if ($apn == '') {
		echo '<p>No APN located';
		exit;
		}
	//Set up query for parcel extent to pass to report window.  Hide this value in "extent" div to pass to main application. Surely there's a better way to do this.
	$query = 'select st_xmin(st_extent(st_transform(the_geom, 900913))),st_ymin(st_extent(st_transform(the_geom, 900913))), st_xmax(st_extent(st_transform(the_geom, 900913))),st_ymax(st_extent(st_transform(the_geom, 900913))) from parcels where apn = \''.$apn.'\'';
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	$firstResult = pg_fetch_row($result);
	$xMin = $firstResult[0];
	$yMin = $firstResult[1];	
	$xMax = $firstResult[2];
	$yMax = $firstResult[3];	
	$extentString = $xMin.','.$yMin.','.$xMax.','.$yMax;
	
	//Set up query for basic property information
	$query = 'select situs_addr, acres_rec from parcels where apn = \''.$apn.'\'';
	//echo $query;
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	$firstResult = pg_fetch_row($result);
	$address = $firstResult[0];
	$acres_rec = $firstResult[1];
	// while ($row = pg_fetch_row($result)) {
	// 	$apn = $row[0];
	// }
	echo '<body>';
	echo '<div id="extent" style="visibility: hidden;">'.$extentString.'</div>';
	echo '<img src="./resources/scv_header.jpg" height="135" width="700" style="display: block; margin: auto;">';
	echo '<br><hr><br>';
	echo '<h1>General Information</h1>';
	echo '<table cellpadding="0" cellspacing="0" class="db-table">';		
	echo '<tr><td>APN</td><td>'.$apn.'</td><th rowspan="6" width="300"><div id="report-map"></div></th></tr>';
	echo '<tr><td>Address</td><td>'.$address.'</td></tr>';	
	echo '<tr><td>Recorded Area</td><td>'.$acres_rec.' acres</td></tr>';	
	
//City-------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"citylimits", "name", 1, "Y");
	formatResults ("City", $queryLayer);

//USA-------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"urbanservicearea", "usa", 1, "Y");
	formatResults ("Urban Service Area", $queryLayer);	

//Planning Limits of Urban Growth--------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"planning_limits_of_urban_growth", "name", 1, "Y");
	formatResults ("Planning Limits of Urban Growth", $queryLayer);	
	
	echo '</table><br><br>';
	
	
/*
 HCP Analysis Begins Here 
*/
	echo '<h1>Habitat Plan Information</h1>';
	echo '<table cellpadding="0" cellspacing="0" class="db-table">';	
	
//HCP Study Area-----------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"hcp_boundary", "area_acres", 1, "N");
	if (count($queryLayer) >= 1) {
	  echo '<tr><td>Habitat Plan Study Area</td><td>YES</td></tr>';
	} else {
	   echo '<tr><td><span style="color:red"><p>Not located within the Habitat Plan Study area.  Analysis complete.</span></td></tr>';
		exit;
	}

//Private Development Areas---------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"private_development_coverage_areas_2", "zone", 0, "Y");
	formatResults ("Private Development Areas", $queryLayer);
	
//Land Cover----------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"land_cover", "land_cover", 0, "Y");
	formatResults ("Land Cover", $queryLayer);
	
//Land Cover Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"land_cover_fee_zones", "fee_zone", 0, "Y");
	formatResults ("Land Cover Fee Zones", $queryLayer);

//Wetland Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"wetland_fee_zones", "land_cover", 0, "Y");
	formatResults ("Wetland Fee Zones", $queryLayer);

//Serpentine Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"serpentine_fee_zones", "land_cover", 0, "Y");
	formatResults ("Serpentine Fee Zones", $queryLayer);
		
//Burrowing Owl Survey and Fee Zones---------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"occupiednestingburrowingowlhabitat", "name", 0, "Y");
	formatResults ("Burrowing Owl Survey and Fee Zone", $queryLayer);
				
//Wildlife Survey Areas-------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"wildlife_survey_areas", "species", 0, "Y");
	formatResults ("Wildlife Survey Areas", $queryLayer);

//Plant Survey Areas-------------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"plant_survey_areas", "land_cover", 0, "Y");
	formatResults ("Plant Survey Areas", $queryLayer);

//Known Occurrences of Covered Plants----------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"known_occurrences_covered_plants", "commonname", 0, "Y");
	formatResults ("Known Occurrences of Covered Plants (1/4 mile radius)", $queryLayer);

//Category 1 Stream Buffers and Setbacks--------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"category_1_stream_buffers", "geobrowser_note", 0, "Y");
	formatResults ("Category 1 Streams and Setbacks", $queryLayer);

//Valley Oak and Blue Oak Woodlands-----------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"valley_and_blue_oak_woodlands", "land_cover", 0, "Y");
	formatResults ("Valley Oak and Blue Oak Woodland", $queryLayer);

//Urban Reserve System Interface Zones----------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"urbanreservesysteminterfacezones", "note", 0, "Y");
	formatResults ("Urban Reserve System Interface Zones", $queryLayer);
	
//Priority Reserve Areas--------------------------------------------------------------------
	$queryLayer = run_query($dbconn, $apn,"conservationanalysiszones_high_mod", "priority", 0, "Y");
	formatResults ("Priority Reserve Areas", $queryLayer);	
	


// Closing connection
pg_close($dbconn);


?>
</table>
<br>
<div style="margin: auto;"><p style="text-align: center; font-size:7px; color:#555555;">All information provided in official Santa Clara Valley Habitat Agency (SCVHA) websites is provided for informational purposes only and does not constitute a legal contract between the SCVHA and any person or entity. Information on the websites is subject to change without prior notice. Although every reasonable effort is made to present current and accurate information, the SCVHA makes no guarantees of any kind.<br>
The SCVHA, its employees, officers, content providers, affiliates or other representatives are not liable for damages of any kind (including, without limitation, lost profits, direct, indirect, compensatory, consequential, exemplary, special, incidental, or punitive damages) arising out of your use of, your inability to use, or the performance of this website or the content whether or not we have been advised of the possibility of such damages.</p></div>
</body>

</html>
