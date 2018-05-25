const NEIGHBORHOOD_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const DISTRICT_GEOSHAPES = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CRIMES = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
const HOUSING = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

var testingArrange =
{
	"1" : ["test1"],
	"2" : ["test2"],
	"3" : ["test3"],
	"4" : ["test4"],
	"5" : ["test5"],
	"6" : ["test6"],
	"7" : ["test7"],
	"8" : ["test8"],
	"9" : ["test9"],
	"10" : ["test10"]
}	

var ids = Object.keys( testingArrange );
var map;
var polygons;
var bounds;

function whatodo( _myJson, _URL, _map )
{
	if( _URL === NEIGHBORHOOD_NAMES )
	{

	}
	else if( _URL === DISTRICT_GEOSHAPES )
	{
		polygons = new Array( 5 );
		for( i = 0; i < 5; i++ )
		{
			polygons[i] = new Array( 100 );
			//for( j = 0; j < 100; j++ ) polygons[i][j] = new Array( 2 );
		}
		var boro;
		var cd;
		var coords;
		var marker;
		for( i = 0; i < _myJson.features.length; i++ )
		{
			aux_coords = new Array( );
			coords = new Array( );
			bounds = new Array(80);
			for(j = 0; j < 80; j++ ) bounds[j] = new  google.maps.LatLngBounds( );
			if( _myJson.features[i].geometry.coordinates.length === 1 )
			{
				for( k = 0; k < _myJson.features[i].geometry.coordinates[0].length; k++ )
				{
					aux_coords[k] = 
					{
						lat: _myJson.features[i].geometry.coordinates[0][k][1], 
						lng: _myJson.features[i].geometry.coordinates[0][k][0]
					};
					bounds[i].extend( aux_coords[k] );
				}
				coords[0] = aux_coords;
				
			}
			else
			{
				for( j = 0; j < _myJson.features[i].geometry.coordinates.length; j++ )
				{
					aux_coords = new Array( );
					for( k = 0; k < _myJson.features[i].geometry.coordinates[j][0].length; k++ )
					{
						aux_coords[k] = 
						{
							lat: _myJson.features[i].geometry.coordinates[j][0][k][1], 
							lng: _myJson.features[i].geometry.coordinates[j][0][k][0]
						};
						if( j === 0 )
					bounds[i].extend( aux_coords[k] );
					}
					coords[j] = aux_coords;
					
				}
			}
			boro = Math.floor( _myJson.features[i].properties.BoroCD / 100 );
			cd = _myJson.features[i].properties.BoroCD - ( boro * 100 );
			//console.log('' + ( boro - 1 ) + ', ' + ( cd - 1 ) );
			polygons[boro - 1][cd - 1] = new google.maps.Polygon
			({
				paths: coords,
				strokeColor: '#000000',
          	strokeOpacity: 0.8,
          	strokeWeight: 0.5,
          	fillColor: '#AA1000',
          	fillOpacity: 0.2
			});
			polygons[boro - 1][cd - 1].setMap( _map );
			/*marker = new google.maps.Marker
			({
    			position: coords[coords.length - 1][coords[coords.length - 1].length -1],
    			map: _map,
    			title: _myJson.features[i].id.toString( )
  			});*/
			//polygons[boro - 1][cd - 1].addListener( 'click', function(e){polygonClick(e,boro, cd,this);} );
			var message = new google.maps.InfoWindow;
			message.setContent( 'boro: ' + boro + 'cd: ' + cd );
  			 message.setPosition( /*coords[coords.length - 1][coords[coords.length - 1].length -1]*/bounds[i].getCenter( ) );
			message.open( _map );
		}
	}
	else if( _URL === CRIMES )
	{

	}
	else if( _URL === HOUSING ) 
	{

	}
}

function polygonClick( e,boro, cd, polygon )
{
	var message = new google.maps.InfoWindow;
	message.setContent( 'boro: ' + boro + 'cd: ' + cd );
   message.setPosition( e.latLng );
	message.open( polygon.get( 'map' ) );
}

function getDataSet( _URL, _map )
{
	var xhttp = new XMLHttpRequest( );
 	xhttp.onreadystatechange = function( )
 	{
  		if( this.readyState == 4 && this.status == 200 )
  		{
  			var myJson = JSON.parse( this.responseText );
  			whatodo( myJson, _URL, _map );
  		}
  	};
  xhttp.open( "GET", _URL, true );
  xhttp.send( );
}


/* HERE I GET DATASET
function getDataFromURL( URL )
{
	var data = $.get( URL, function( )
		{
			console.log( URL )
		} 
	)
	.done( function( )
		{
			//Success
			//console.log(data);
			DATASETS_API_SERIES_ID[data.responseJSON.request.series_id].push(data.responseJSON.series[0].data);
		}
	)
	.fail( function( error )
		{
			console.error( error );
		}
	)
}
*/

function updateTable( _top3 )
{
	tableReference = $( "#top" )[0];
	var row, col;
	$( "#top tr" ).remove( );
	for( var id of ids )
	{
		if( _top3 === true && id == "4" ) break;

		row = tableReference.insertRow( 0 );
		col = row.insertCell( 0 );
		col.innerHTML = testingArrange[id][0];
		row.setAttribute( "class", "tableClick" );
		row.setAttribute( "data-id", id );
	}
}

function updatetop3( )
{
	
	updateTable( true );
}

function update( )
{
	updateTable( false );
}

//---------------------------------  D3.JS  ---------------------------------------




//------------------------------------------ Google Maps ---------------------------------------------

function onGoogleMapResponse( )
{
	map = new google.maps.Map( document.getElementById( 'googleMapContainer' ), 
		{
			zoom: 10, center: { lat: 40.7291, lng: -73.9965 }
		}
	);

	update( );
	getDataSet( DISTRICT_GEOSHAPES, map );

	var marker = new google.maps.Marker
	(
		{
    		position: { lat: 40.7291, lng: -73.9965 },
    		map: map,
    		title: 'NYU'
  		}
  	);

}

//------------------------------------------ Google Maps ---------------------------------------------**/

$( document ).ready
( 
	function( )
	{
		$( "#onoff" ).on( "click", update );
		$( "#safety" ).on( "click", update );
		$( "#distance" ).on( "click", update );
		$( "#affordability" ).on( "click", update );
		$( "#top3" ).on( "click", updatetop3 );
		$( "#tableScroll" ).on( "click", ".tableClick", function( )
			{
				console.log($(this).data("id"));
				console.log("clic");
			}
		);
	}
)
