<?php
//dl("php_mapscript.so");
/*Profile Engine v1.2
  by Steve Borgstrom
  April, 2013
  */


//Search function
  function run_query ($connection, $apn, $layer_name, $attribute, $threshold, $pctYN) {
           $resultsArray=array(); //establish array to hold result
           //[0]: attribute column from analysis layer
           //[1]: area of the intersect between parcel poly and layer poly
           //[2]: area of parcel
           //
           //Select based on intersect between parcel layer and analysis layer where apn=passed apn
           $qryString = "SELECT $attribute, st_area(st_intersection(reverse(parcels.the_geom), $layer_name.the_geom)) as iarea, st_area
                         (parcels.the_geom) from parcels, $layer_name where parcels.the_geom && $layer_name.the_geom and
                         st_intersects($layer_name.the_geom, parcels.the_geom) and parcels.apn='$apn' order by iarea desc";   //added "reverse" to hopefully take care of odd geometry
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
                    $resultsArray[]=$value." ($pct_parcel%)";
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
//Initialize a few variables, format APN, and construct tile tags
    //error_reporting(1); //turn off error reporting
  	//$time_beg = microtime(true);  //start timing query
    //$userIP = getenv('REMOTE_ADDR');  //grab user's IP to cram into usage-tracking database
    $special_flag = 0; //set special area flag to 0.  will increment this if any specialness is found.  used for correct verbage
    $hostIP = "localhost";
    
  //Grab passed apn, omit hyphens if entered that way (apn database is not encoded
  //with hypens), but reconstruct with hyphens for sake of presentation

 	$map_path=dirname(__FILE__)."/maps/";

  //establish database connection
 	 $connection = pg_connect("host=$hostIP dbname=sccpln_gis user=gisuser password=gisuser");
  //test connection
 	 if (!$connection) {
 	 	?>
     <div id="notfound">
     	<br><br>
	    <img src="images/warning.gif">
	    <h1>Database Connection FAILED.<br><br>Please contact the Planning Office.</h1>
	      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
     </div>
 	 	
 	   	<?php
  	  exit;
	  }
  //BASIC INFORMATION QUERY
  //check to see if APN exists, fold in query for legalowner, siteaddress, site city,
  //recorded sq. ft, recorded acreage, computed area, centroid, 
  	$qry_apn = pg_query($connection, 
  	"SELECT apn, apn, address, city_st_zi, square_foo, acres_2,
	   area(the_geom), x(centroid(the_geom)), y(centroid(the_geom)) from parcels where apn = '$passed_apn'");
  	$rcount = pg_num_rows($qry_apn);
  	if ($rcount == 0) {   //bonk if returned record count = 0
     ?>
     <div id="notfound">
     	<br><br>
	    <img src="images/warning.gif">
	    <h1>Sorry, but APN <u><?php echo $passed_apn ?></u> was not found.</h1>
	      <br><br>
	      <div id="notfoundtips">
					<ul>
				    <li>Did you mistype the APN?</li>
				  	<li>Make sure the APN contains only numbers and dashes.</li>
				  	<li>APNs can and do change.  Contact the County Assessor for more information.</li>
				  </ul>
				</div>
				<br><br><br><br><br><br>
     </div>


<?php
   	  exit;    //exit script
	}	  
 //Display information from basic information query
	$row = pg_fetch_row($qry_apn);
   // $apnMapLink = "http://www.gisatscc/gisprod/amb/Annual_2008_Roll_Map/".substr($hyph_apn, 0, 6).".pdf"; //construct URL to assessor map
    
    
	?>


<div id="reportheader">
		<img class="sealimg" src="images/county_seal2.jpg"></img>
	  <div id="addressblock">
			COUNTY OF SANTA CLARA PLANNING OFFICE<br>
			70 W. HEDDING ST., SAN JOSE, CA 95110<br>
			(408) 299-5770
		</div>
    <h2>Santa Clara County<br/>Department of Planning and Development</h2>
    <h1>Online Property Profile</h1><br>
    <hr>
</div> <!--END REPORTHEADER -->
	<div class="date"><?php 
		print("".date('F d\, Y h:i:s A'));?>.&nbsp The GIS data used in this analysis 
					was compiled from various sources. While deemed reliable, the Planning Office 
					assumes no liability.	
  </div>


	<div id="themap_wrapper">
		<div id="themap">

    <script type="text/javascript">
    	init();
<?php
	$qry_geo = pg_query($connection, 
	"SELECT ST_X(ST_transform(centroid(the_geom),900913)),ST_Y(ST_transform(centroid(the_geom),900913)), ST_XMin(ST_transform((the_geom),900913)),
	ST_YMin(ST_transform((the_geom),900913)),ST_XMax(ST_transform((the_geom),900913)), ST_YMax(ST_transform((the_geom),900913)) from parcels where apn='$passed_apn';");
	$georow = pg_fetch_row($qry_geo);
    $lon = $georow[0];
    $lat = $georow[1];
    $xmin = $georow[2];
    $ymin = $georow[3];
    $xmax = $georow[4];
    $ymax = $georow[5];
    echo "var lat = $lat;\n";
    echo "var lon = $lon;\n";
    $theExtent = $xmin.', '.$ymin.', '.$xmax.', '.$ymax;
	echo "parcelExtent = new OpenLayers.Bounds($theExtent);\n";  
  //$theString = "map.addLayer(new OpenLayers.Layer.GML(\"GML Layer\", \"googleapn.php?apn=$passed_apn\", {styleMap: myStyle} ));\n";
 // echo $theString;
	
	echo "      var markers = new OpenLayers.Layer.Markers ('Markers', {displayInLayerSwitcher:false});
				var parcels = new OpenLayers.Layer.WMS('parclabels','http://sccplanning.org/gisprofile/cgi-bin/mapserv?map=/Library/Webserver/Documents/maps/sccpln.map&TRANSPARENT=true',
				{
				layers:'parcels',
				projection:'EPSG:900913',
			    format:'image/gif',
			    transparent:'true',
			    isBaseLayer:'false',
				displayInLayerSwitcher:false
			  },
			  {singleTile: true,displayInLayerSwitcher:false}
				); 
	
      map.addLayers ([parcels, markers]);
      var size = new OpenLayers.Size(40,40);
      var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
      var icon = new OpenLayers.Icon('pushpin.png',size,offset);
      markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat($lon,$lat),icon));
	  var theControl = new OpenLayers.Control.LayerSwitcher();
	  map.addControl(theControl);\n";

	
?>
		 map.zoomToExtent(parcelExtent);
    	</script>
		</div>
		<br />
	</div>


<!--LOCATION AND JURISDICTION---------------------------->
	
	<h3 class="sectiontitle">Location and Jurisdiction</h3>
	<div class="reportcontent">
	<?php
		//Leftovers from first query
		$siteAddress = $row[2]; 	   //site address
		$cityStateZIP = $row[3];	   //city, state, and ZIP
		$recordedAcres = round($row[5],2);      //recorded size of parcel
		$computedAcres = round($row[6]/43560,2); //GIS-computed size of parcel in acres
	  //Jurisdiction-----------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"citylimits", "name", 1, "N");
	  if (count($queryLayer) > 0) {
		  foreach ($queryLayer as $a)
		  $jurisdiction = "Incorporated ($a)";
	  } else {
		  $jurisdiction = "Unincorporated";
	  }
	
	  //USA----------------------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"urbanservicearea", "usa", 1, "N");
	  $usastring="<a href='http://www.santaclara.lafco.ca.gov/pdf-files/USAPolicies2003.pdf' target='_blank'>USA:</a> <strong>";
	  
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a)
	      $usa=$usa."$a, ";
		  $usa=trim($usa, ", ");
	  } else {
	     $usa = "None";
	  }
	  
	  //SOI------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"spheresofinfluence", "soi", 1, "N");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a)
	      $soi=$soi."$a, ";
		  $soi=trim($soi, ", ");
	  } else {
	     $soi = "None";
	  }

	  //Supervisor District: District Number-------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"supervisor_district_2001_area", "district", 1, "N");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a)
	      $supDistrict=$a;
	    }		
///////////////////SPECIAL DISTRICTS-------------------------------------------------------------		
	  
	  //-----Fire Protection District
	  $queryLayer = run_query($connection, $passed_apn,"fire_protection_districts", "district_n", 1, "N");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a)
	      $fireProtection=$fireProtection."$a, ";
		  $fireProtection=trim($fireProtection, ", ");
	    } else {
			$fireProtection = "N/A";
		}
		
	  //-----Sanitary Districts
	  $queryLayer = run_query($connection, $passed_apn,"sanitary_districts", "district_n", 1, "N");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a)
	      $sanitaryDistrict=$sanitaryDistrict."$a, ";
		  $sanitaryDistrict=trim($sanitaryDistrict, ", ");
	    } else {
			$sanitaryDistrict = "N/A";
		}	

	  //-----Water Districts
	  $queryLayer = run_query($connection, $passed_apn,"water_districts", "district_n", 1, "N");
	  if (count($queryLayer) >= 2) { //need >= 2 because Santa Clara Valley Water District is always a hit
	    foreach ($queryLayer as $a)
		  if ($a != "Santa Clara Valley Water District") {$waterDistrict=$waterDistrict."$a, ";}
		  $waterDistrict=trim($waterDistrict, ", ");
	    } else {
			$waterDistrict = "N/A";
		}			
	?>
	
    APN: <strong><?php echo "$hyph_apn ";?></strong><span class="assessortext"></span> <br>
	Site Address: <strong><?php echo "$siteAddress";?></strong><br>
	City/State/ZIP: <strong><?php echo "$cityStateZIP";?></strong><br>
	Jurisdiction: <strong><?php echo "$jurisdiction";?></strong><br>
	<a href="http://www.santaclara.lafco.ca.gov/sclafcopolicies.html" target="_blank">Urban Service Area</a>: <strong><?php echo "$usa";?></strong><br>
	<a href="http://www.santaclara.lafco.ca.gov/sclafcopolicies.html" target="_blank">Sphere of Influence</a>: <strong><?php echo "$soi";?></strong><br>
	<a href="http://www.sccgov.org/sites/bos/Pages/default.aspx" target="_blank">Supervisor District</a>: <strong><?php echo "$supDistrict";?></strong><br>
	<a href="http://www.santaclara.lafco.ca.gov/specialdistricts.html" target="_blank">Special Districts</a>:<br>
		 <ul>
	     <li style="margin-left:10px">Fire Protection District: <strong><?php echo "$fireProtection";?></strong></li>
		 <li style="margin-left:10px">Sanitary District: <strong><?php echo "$sanitaryDistrict";?></strong></li>
		 <li style="margin-left:10px">Water District: <strong><?php echo "$waterDistrict";?></strong></li>
		 </ul>
    </div>
  
<!--Area--------------------------------->
	<h3 class="sectiontitle">Area Information</h3>
	<div class="reportcontent">  
		Recorded Size (<i>source: Assessor's office</i>): <strong><?php echo "$recordedAcres";?> acres</strong><br>
	<!--	Computed Size (<i>source: GIS</i>): <strong><?php echo "$computedAcres";?> acres</strong><br>-->

	</div>
	
<!--County General Plan Land Use---------------------------------->
  <h3 class="sectiontitle">General Plan Land Use</h3>
  	<div class="reportcontent">
	<?php
	  //Land Use Plan----------------------------------------------------------------------------------------
	  // $queryLayer = run_query($connection, $passed_apn,"generalplan", "gen_plan", 5, "Y");
	  // if (count($queryLayer) >= 1) {
	    // foreach ($queryLayer as $a)
	      // $landUse=$landUse."$a, ";
		  // $landUse=trim($landUse, ", ");
	  // } else {
	     // $landUse = "Urban Service Area"; //not possible, but leave the code for recycling
	  // }

	  //Land Use Plan----------------------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"generalplan", "gen_plan", 5, "Y");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a) {
	      $templandUse=$templandUse."$a, ";
		  $templandUse=trim($templandUse, ", ");
		  }
		  $landUse = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/GeneralPlan/Pages/GP.aspx' target='_blank'>Land Use Plan Designation</a>: <strong> $templandUse </strong><br>";
	  } else {
		if ($jurisdiction == "Unincorporated") {
			$landUse = "Land Use Plan Designation: Urban Service Area"; //not possible, but leave the code for recycling
			} else {
			$landUse = "Land Use Plan Designation: Consult city planning department";
			}
	  }
	  
	  //Site Specific Amendment ----------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"genplanamendments", "genplan", 1, "N");
	  if (count($queryLayer) >= 1) {
	    $gpAmendments = "Site Specific Amendment: <strong>";
	    foreach ($queryLayer as $a)
	      $gpAmendments=$gpAmendments."$a, ";
		  $gpAmendments=trim($gpAmendments, ", ");
		  $gpAmendments = $gpAmendments."</strong><br>";
	  } else {
	     $gpAmendments = "";
	  }
	  
	  //San Martin----------------------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"sanmartinboundary", "gen_plan", 1, "N");
	  if (count($queryLayer) >= 1) {
		$sanMartin = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/SanMartin/Pages/San-Martin.aspx' target='_blank'>San Martin Planning Area</a>: <strong>IN</strong><br>";
	  } else {
		$sanMartin = "";
	  }	  

	  //San Martin Commercial Area-----------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"sanmartincommercial", "sanmartincommercial.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$sanMartinCommercial = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/SanMartin/Pages/San-Martin.aspx' target='_blank'>San Martin Commercial Use Permit Area</a>: <strong>IN</strong><br>";
	  } else {
		$sanMartinCommercial = "";
	  }	
	  
	  //San Martin Industrial Area-----------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"sanmartinindustrial", "sanmartinindustrial.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$sanMartinIndustrial = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/SanMartin/Pages/San-Martin.aspx' target='_blank'>San Martin Industrial Use Permit Area</a>: <strong>IN</strong><br>";
	  } else {
		$sanMartinIndustrial = "";
	  }	

	  //New Almaden Historical Area------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"newalmadenhistoric", "newalmadenhistoric.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$newAlmadenHistoric = "New Almaden Historical Area: <strong>IN</strong><br>";
	  } else {
		$newAlmadenHistoric = "";
	  }		 
	  
	  /*LOS GATOS WATERSHED/SPECIFIC COMMENTED OUT PER BILL SHOE 05/08/2013
	  //Los Gatos Watershed-----------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"losgatoswatershed", "losgatoswatershed.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$losGatosWatershed = "Los Gatos Watershed Area: <strong>IN</strong><br>";
	  } else {
		$losGatosWatershed = "";
	  }		 

	  //Los Gatos Hillside Specific Plan-------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"losgatoshillsideplanarea", "losgatoshillsideplanarea.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$losGatosHillside = "Los Gatos Hillside Specific Plan: <strong>IN</strong><br>";
	  } else {
		$losGatosHillside = "";
	  }	
	  */
	  
	  //Monterey Highway Use Permit-------------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"montereyup", "montereyup.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$montereyUP = "Monterey Highway Use Permit Area:<strong>IN</strong><br>";
	  } else {
		$montereyUP = "";
	  }	
	  
	  //Guadalupe Watershed Area of Critical Environmental Concern-------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"guadalupewatershed", "guadalupewatershed.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$guadalupeWatershed = "Guadalupe Watershed Area of Critical Environmental Concern: <strong>IN</strong><br>";
	  } else {
		$guadalupeWatershed = "";
	  }	
	  
	  //Stanford University Community Plan Designation---------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"stanford_land_use", "ludesignat", 5, "Y");
	  if (count($queryLayer) >= 1) {
	  $stanfordlandUse = "<a href='http://lbre.stanford.edu/GUP_community_plan' target='_blank'>Stanford University Community Plan Designation</a>: <strong>";
	    foreach ($queryLayer as $a)
	      $stanfordlandUse=$stanfordlandUse."$a, ";
		  $stanfordlandUse=trim($stanfordlandUse, ", ");
		  $stanfordlandUse = $stanfordlandUse."</strong>";
	  }   
	?>	  

	<?php echo "$landUse";?>
	<?php echo "$gpAmendments";?>
	<?php echo "$sanMartin";?>
	<?php echo "$sanMartinCommercial";?>	
	<?php echo "$sanMartinIndustrial";?>
	<?php echo "$newAlmadenHistoric";?>
	<?php echo "$losGatosWatershed";?>
	<?php echo "$losGatosHillside";?>
	<?php echo "$montereyUP";?>
	<?php echo "$guadalupeWatershed";?>
	<?php echo "$stanfordlandUse";?>
	</div>
	
<!--Zoning District----------------------------->	
  <h3 class="sectiontitle">Zoning District</h3>
  	<div class="reportcontent">
	<?php
	
	  $queryLayer = run_query($connection, $passed_apn,"zoning", "zoning", 1, "Y");
	  if (count($queryLayer) >= 1) {
	    foreach ($queryLayer as $a) {
	      $tempZoning=$tempZoning."$a, ";
		  $tempZoning=trim($tempZoning, ", ");
		  }
		  $zoning = "<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/ZoningOrdinance/Pages/ZoningOrdinance.aspx' target='_blank'>Zoning</a>: <strong> $tempZoning </strong><br>";
		  } else {
			 $zoning = "Zoning: Consult city planning department"; //not possible, but leave the code for recycling
		  }
		  
	echo "$zoning";
	if ($zoning == "Zoning: Consult city planning department") {  //BREAK HERE IF PROPERTY IS INCORPORATED
		pg_close($connection); //that's about enough out of you  
		exit;
		}
	?>
	</div>
	  

<!--Other Planning Information------------------------->	
	<?php
	$otherPlanning = FALSE; //set boolean value to check if we have any Other to determine inclusion of header
   //Williamson Act--------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"waparcels", "waparcels.type", 1, "N");
	  $willstring = "";
	  if (count($queryLayer) >= 1) {
		$otherPlanning = TRUE;
		foreach ($queryLayer as $a)
			if ($a == "C") { //if contract is current, then get contract number
					$newQuery = run_query($connection, $passed_apn, "waparcels", "waparcels.contract", 1, "N");
					foreach ($newQuery as $contract)
						$willstring = "Property under <a href='http://www.sccgov.org/sites/planning/PlansPrograms/Williamson/Pages/WA.aspx' target='_blank'>Williamson Act</a> (contract $contract)<br>";
			}
			else  //contract was/will be terminated
			{
				$newQuery = run_query($connection, $passed_apn, "waparcels", "extract(DAY from termdate - now())", 1, "N");
				foreach ($newQuery as $daysLeft)
					if ($daysLeft < 0) {
						$willstring = ""; //contract has been terminated
					}
					else
					{
						$contractQuery = run_query($connection, $passed_apn, "waparcels", "waparcels.contract", 1, "N");
						foreach ($contractQuery as $contract)
							$theContract = $contract;
						$termQuery = run_query($connection, $passed_apn, "waparcels", "waparcels.terminatio", 1, "N");
						foreach ($termQuery as $termd)
							$termDate = $termd;
						
						$willstring = "Property under <a href='http://www.sccgov.org/sites/planning/PlansPrograms/Williamson/Pages/WA.aspx' target='_blank'>Williamson Act</a> (contract $theContract) - <b>WILL TERMINATE $termDate</b><br>";
					}
			}
	  } 
	  
	  //Open Space Easements------------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"openspaceeasements", "contractnu", 1, "N");
	  $osestring="";
	  if (count($queryLayer) >= 1) {
		$otherPlanning = TRUE;	  
	  	$osestring = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/Williamson/Pages/WA.aspx' target='_blank'>Open Space Easement Agreement</a> (contract ";
	    foreach ($queryLayer as $a)
	      $osestring=$osestring."$a)";
	    $osestring=$osestring."<br/>\n";
	  }	  
  	  
	//HCP Study Area-------------------------------------------------------------------------
		$queryLayer = run_query($connection, $passed_apn,"hcpstudyarea", "hcpstudyarea.gid", 1, "N");
		if (count($queryLayer) >= 1) {
		  $otherPlanning = TRUE;
		  $hcpStudyArea = "<a href='http://www.scv-habitatplan.org/www/default.aspx' target='_blank'>HCP Study Area</a>: <strong>IN</strong><br>\n";
		}
		else {
		$hcpStudyArea = "";
		} 
 
	//HCP Rural Development Areas----------
		$queryLayer = run_query($connection, $passed_apn,"hcp_rural_development_areas", "hcp_rural_development_areas.gid", 1, "N");
		if (count($queryLayer) >= 1) {
		  $otherPlanning = TRUE;
		  $hcpRuralDevelopment = "<a href='http://www.scv-habitatplan.org/www/default.aspx' target='_blank'>HCP Rural Development Areas</a>: <strong>IN</strong><br>\n";
		}
		else {
		$hcpRuralDevelopment = "";
		} 
		
	  //Anderson/Coyote Reservoir Basin------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"andersoncoyotewatershed", "andersoncoyotewatershed.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
		$otherPlanning = TRUE;	  
		$andersonCoyoteWatershed = "Anderson/Coyote Reservoir Basin: <strong>IN</strong><br>";
	  } else {
		$andersonCoyoteWatershed = "";
	  }		

	  //Substandard Subdivisions----------------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"substandardsubdivisions", "name", 1, "N");
	  $subSubdivisions="";
	  if (count($queryLayer) >= 1) {
		$otherPlanning = TRUE;	  
	  	$subSubdivisions = "Named Substandard Hillside Subdivision: <strong>";
	    foreach ($queryLayer as $a)
	      $subSubdivisions=$subSubdivisions."$a";
	    $subSubdivisions=$subSubdivisions."</strong><br/>\n";
	  }

	
	//Include section header only if $otherPlanning = TRUE;	  
	if ($otherPlanning) {
		echo "<h3 class='sectiontitle'>Other Planning Information</h3>\n";
		echo "<div class='reportcontent'>\n";
		echo "$willstring";
		echo "$osestring";
		echo "$hcpStudyArea";
		echo "$hcpRuralDevelopment";
		echo "$andersonCoyoteWatershed";
		echo "$subSubdivisions";
		echo "</div>";
		}
	?>

<!--Special Resources/Hazards/Constraints Areas----------------------->	
  <h3 class="sectiontitle">Special Resources/Hazards/Constraints Areas</h3>
  	<div class="reportcontent">
	<?php
	  //Predefine $historicResource = '' and change to YES if either historic parcels or heritage trees is hit.
	  $historicResource = "";
	  //Historic Parcels-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"historic_parcels", "historic_parcels.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
	  	  $historicResource = "<a href='http://www.sccgov.org/sites/planning/PlanningStudies/OtherStudies/HistoricPreservation/Pages/Historic-Preservation-Ordinance.aspx' target='_blank'>Historic Parcel</a>: <strong>YES</strong><br>\n";
	  }

	  //Heritage Trees-----------------------------  
	  /////NEED UNIQUE ROUTINE FOR NOW BECAUSE TREES ARE POINT FEATURE//////////////
		$qry_apn = pg_query($connection, 
		"SELECT site_num from heritage_trees, parcels where apn='$passed_apn' and st_intersects (heritage_trees.the_geom, parcels.the_geom)");
		$rcount = pg_num_rows($qry_apn);
		  if ($rcount > 0) {
			  $historicResource = "<a href='http://www.sccgov.org/sites/planning/PlanningStudies/OtherStudies/HistoricPreservation/Pages/Historic-Preservation-Ordinance.aspx' target='_blank'>Historic Resource</a>: <strong>YES</strong><br>\n";
		  } 
	//Oak Woodlands--------------------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"oak_woodlands", "oak_woodlands.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
	  	$oakWoodlands = "Oak Woodlands: <strong>YES</strong><br>\n";
	  }
	  else {
		$oakWoodlands = "";
	  }
	  
	//ALUC: Airport Influence Area (AIA)----------------------
	  $queryLayer = run_query($connection, $passed_apn,"aluc_aia", "aluc_aia.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
	  	$aluc_AIA = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/ALUC/Pages/ALUC.aspx' target='_blank'>Airport Influence Area</a>: <strong>YES</strong><br>\n";
	  }
	  else {
		$aluc_AIA = "";
	  }	

	//ALUC: Airport Safety Zone----------------------
	  $queryLayer = run_query($connection, $passed_apn,"aluc_safetyzone", "aluc_safetyzone.gid", 1, "N");
	  if (count($queryLayer) >= 1) {
	  	$aluc_safetyZone = "<a href='http://www.sccgov.org/sites/planning/PlansPrograms/ALUC/Pages/ALUC.aspx' target='_blank'>Airport Safety Zone</a>: <strong>YES</strong><br>\n";
	  }
	  else {
		$aluc_safetyZone = "";
	  }	
	  
	//FEMA Flood zones
	  $queryLayer = run_query($connection, $passed_apn,"femaflood", "fld_zone", 1, "Y");  
	  $femaFlood="";
	  if (count($queryLayer) >= 1) {
			  $femaFlood="<a href='https://msc.fema.gov/webapp/wcs/stores/servlet/info?storeId=10001&catalogId=10001&langId=-1&content=floodZones&title=FEMA%2520Flood%2520Zone%2520Designations' target='_blank'>FEMA Flood Zone</a>: <strong>";
			  foreach ($queryLayer as $a)
				$femaFlood=$femaFlood."$a, ";
				$femaFlood=trim($femaFlood, ", ");
				$femaFlood=$femaFlood."</strong></br>\n";
		  }
	  else {
		$femaFlood = "";
	  }	
	  
	 // WUIFA--------------------------------------------
	  $queryLayer = run_query($connection, $passed_apn,"wuifa", "wuitext", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $wuifa="<a href='http://www.sccgov.org/sites/fmo/waterandaccess/Wildland%20Urban%20Interface/Documents/WILDLAND-URBAN-INTERFACE-FAQ-PDF.pdf' target='_blank'>Wildland Urban Interface Fire Area</a>:<strong> ";
		  foreach ($queryLayer as $a)
		  if ($a <> "<em>Not Determined</em>") {
			$wuifa=$wuifa."$a, ";
				} else {
				$wuifa="";}  //need this tweak to blank out "Undetermined"...ugly
				
			$wuifa=trim($wuifa, ", ");
			$wuifa=$wuifa."</strong></br>\n";		
		}
	  else {
		$wuifa = "";
	  }	  

	//GEOHAZARDS-------------------------------
	  //County fault rupture hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_faultrupture", "source", 1, "N");
	  if (count($queryLayer) >= 1) {
	  	  $geohaz_fault = "<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>County Fault Rupture Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_fault = "";
	  }	
	  
	  //County landslide hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_landslide", "source", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $geohaz_landslide = "<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>County Landslide Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_landslide = "";
	  }	   
	  
	  //County liquefaction hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_liquefaction", "source", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $geohaz_liquefaction="<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>County Liquefaction Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_liquefaction = "";
	  }	  
	  
	  //County compressible soils hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_compressible", "zone", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $geohaz_compressible="<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>County Compressible Soils Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_compressible = "";
	  }	   
	  
	  //County dike failure hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_dikefailure", "zone", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $geohaz_dikefailure="<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>County Dike Failure Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_dikefailure = "";
	  }	 
	  
	  //State fault hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_statefault", "type", 1, "N");
	  if (count($queryLayer) >= 1) {
		  $geohaz_statefault="<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>State Fault Hazard Zone</a>: <strong>IN</strong><br>\n";
	  }
	  else {
		$geohaz_statefault = "";
	  }	   
		
	  //State seismic hazard zone-----------------------------  
	  $queryLayer = run_query($connection, $passed_apn,"geohaz_stateseismic", "hz_type", 1, "N");
	  $geohaz_stateseis_liq = "";
	  $geohaz_stateseis_land = "";
	  
	  foreach ($queryLayer as $thevalue) {
		if ($thevalue == "lq") {
			$geohaz_stateseis_liq = "<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>State Seismic Hazard Zone (liquefaction)</a>: <strong>IN</strong><br>\n";
		}
		if ($thevalue == "ls") {
			$geohaz_stateseis_land = "<a href='http://www.sccgov.org/sites/planning/PermitsDevelopment/GeoHazards/Pages/GeoHazards.aspx' target='_blank'>State Seismic Hazard Zone (earthquake induced landslides)</a>: <strong>IN</strong><br>\n";
		}  	
	  }		  
	  
	 ///////Output Results---------------------------------------------
	 echo "$aluc_AIA";
	 echo "$aluc_safetyZone";
	 echo "$historicResource";
	 echo "$oakWoodlands";
	 echo "$femaFlood";
	 echo "$wuifa";
	 echo "$geohaz_fault";
	 echo "$geohaz_landslide";
	 echo "$geohaz_liquefaction";
	 echo "$geohaz_compressible";
	 echo "$geohaz_dikefailure";
	 echo "$geohaz_statefault";
	 echo "$geohaz_stateseis_liq";
	 echo "$geohaz_stateseis_land";
	 
	 ?>

	</div>

<?php
    
  //Process and feed usage info into database for general monitoring or something whatever
  $qry = "SELECT localtimestamp";
  $qry_results = pg_query($connection, $qry);
  $the_result = pg_fetch_row($qry_results);
  $thetime = $the_result[0];
  $time_end=microtime(true);  //stop timing overall process
  $time_elapsed = $time_end-$time_beg;
  $statsarray = array("ip" => $userIP, "timestamp" => $thetime, "querytime" => $time_elapsed, "apn" =>$passed_apn);
  pg_insert($connection, 'access_log_pp', $statsarray);
  pg_close($connection); //that's about enough out of you  
?>
  

