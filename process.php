<?php
	$x = $_GET['x'];
	$y = $_GET['y'];
	
	// Connecting, selecting database
	$dbconn = pg_connect("host=localhost dbname=sccgis user=gisadmin password=g1s*dm1n")
	    or die('Could not connect: ' . pg_last_error());

	// Performing SQL query
	//$query = 'SELECT apn, sq_ft_rec from google_parcels where apn like \'2961404%\'';
	//$query = 'select apn from parcels where ST_Intersects(parcels.the_geom, ST_Transform(ST_GeomFromText(\'POINT('.$x.' '.$y.')\',900913), 2227))';
	$query = 'select apn from parcels where ST_Intersects(parcels.the_geom, ST_Transform(ST_GeomFromText(\'POINT('.$x.' '.$y.')\',900913), 2227))';	
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	
	while ($row = pg_fetch_row($result)) {
		$apn = $row[0];
	}

	$query = 'select name from citylimits, parcels where apn = \''.$apn.'\' and st_intersects (citylimits.the_geom, parcels.the_geom)';
	//echo $query;
	$result = pg_query($query) or die('Query failed: ' . pg_last_error());
	$firstResult = pg_fetch_row($result);
	$apn = $firstResult[0];
	
	// while ($row = pg_fetch_row($result)) {
	// 	$apn = $row[0];
	// }
	echo $apn;
	// Free resultset
	pg_free_result($result);

	// Closing connection
	pg_close($dbconn);


?>

