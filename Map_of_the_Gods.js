/*jslint browser: true*/
/*global d3*/

// Width and height
var width = document.getElementById('container').offsetWidth-60,
    height = 500,
    centered;

// Use the geoMercator to visualize the projection.
var projection = d3.geoMercator()
    .center([0,35])
    .scale((width) / 1.9 / Math.PI)
    .translate([width / 2, height / 1.9]);

//Will be used to create the path
var path = d3.geoPath().projection(projection);

//Creates zoom variable for later pan/zoom functionality
var zoom = d3.zoom().scaleExtent([1,8]).on("zoom", zoomed);


//Create the canvas
var svg = d3.select("#container")
	        .append("svg")
	        .attr("width", width)
	        .attr("height", height)
            .append("g");

//Create secondary layer to canvas SVG
var g = svg.append("g");

//boolean variable for buttons?
//var state = false;

//Create tooltip to be used for information on circles
var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

//Call zoom and further functions
svg.call(zoom);

//Function to zoom and transform the page
function zoomed() {
  console.log('zoom');
  // Transform all the attributes that are attached to the var g
  g.attr("transform", d3.event.transform);
}

d3.select(self.frameElement).style("height", height + "px");

//Parse the data
//Data will be graabed from countries.geo.json and Map_of_Gods.csv
//Below code was supplemented from LA v SF group	
d3.json("countries.geo.json").then(function(json) {
        console.log(json);
    
        d3.csv("Map_of_the_Gods.csv").then(function(data){
            console.log(data);

        // Go through each element of the csv
		for (var i = 0; i < data.length; i++) {
			// Get data for csv element
        	var csvName = data[i].name;
        	var csvCulture = data[i].culture;
            var csvLocation = data[i].location;
            var csvGender = data[i].gender;
            var csvSpecies  = data[i].species;
            var csvType = data[i].type;
            var csvWikiLink = data[i].linkwik;
            var csvGCLink = data[i].linkgc;
            var csvPicture = data[i].picture;
        	// Go through each element of the json looking for a country
        	//		to match the country of the csv.
			for (var j = 0; j < json.features.length; j++) {
				var jsonCountry = json.features[j].properties.name;
                //console.log(jsonCountry);
                //console.log(j);
				if (csvLocation == jsonCountry) {
					// Assign the color retrieved from the csv to the
					// 		matching json element.
					json.features[j].properties.Name = csvName;
                    json.features[j].properties.Culture = csvCulture;
                    json.features[j].properties.Location = csvLocation;
                    json.features[j].properties.Gender = csvGender;
                    json.features[j].properties.Species = csvSpecies;
                    json.features[j].properties.Type = csvType;
                    json.features[j].properties.WikiLink = csvWikiLink;
                    json.features[j].properties.GCLink = csvGCLink;
                    json.features[j].properties.Picture = csvPicture;
					break;
                }//if(csvLocation == jsonCountry
            }//for loop
        }//outer for loop
       
        //This moves all the paths to the svg/g canvas
        //Color scheme for initial countries is from GodChecker.com
        g.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         // When a region is clicked on, call the clicked function to zoom in. 
         .on("click", clicked)
         // set the boundary color in between countries
         .attr("id", "boundary")
         .style("fill", function(d) {
            var country = d.properties.Location;
            if(country === "Mexico") {
                   return "#BE79DF";}//purple  
            if(country === "Greece") {
                   return "#035AA6";}//aqua
            if(country === "Japan") {
                   return "#c90e0e";}//red
            if(country === "United Kingdom") {
                   return "#194719";}
            if(country === "Ireland") {
                   return "#194719";}//green        
            if(country === "Nigeria") {
                   return "#ff9900";}//light brown
            if(country === "Peru") {
                   return "#85ad33";}//green yellow
            if(country === "Egypt") {
                   return "#ff5050";}//salmony
            if(country === "Denmark") {
                   return "#0A97B0";}//bluegrey
            if(country === "Finland") {
                   return "#0A97B0";}
            if(country === "Norway") {
                   return "#0A97B0";}
            if(country === "Sweden") {
                   return "#0A97B0";}
            else {
                // light grey 
//                return "#D3D3D3";}
                return "rgb(213,222,217)";}
        });//This is for the style attribute for the path
            
     // Separate data into shapes based on gender
     // Square for Female
     // Circle for Male
     g.selectAll(".shapes")
			.data(data)
			.enter()
			.append(function(d){
                 console.log(d);
                 if (d.gender === "Female") {
                 return document.createElementNS('http://www.w3.org/2000/svg', "rect");
                 } else {
                   return document.createElementNS('http://www.w3.org/2000/svg', "circle");
                 }
      })
      .attr("class", "shapes")
            
     // Create all of the circles 
        g.selectAll("circle")
         //.data(data)
         //.enter()
         //.append("circle")
         .attr("class", "circle")
         .attr("cx", function(d) {
                return projection([d.lon,d.lat])[0];})
          .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];})
          .attr("r", 2)
          
          //.style("fill", "black")
//                 function(d) {
//                    var typeOfGod = d.type;
//                    if(typeOfGod === "Storm" ) {
//                        return "yellow";}
//                    else if(typeOfGod ==="Sky"){
//                        return "#87CEFA";}
//                    else if(typeOfGod === "Death") {
//                        return "black";}
//                    else if(typeOfGod === "Agriculture") {
//                        return "#006300";}
//                    else if(typeOfGod === "Motherhood") {
//                        return "#99FF99";}
//                    else if(typeOfGod === "War" ) {
//                        return "#9e0e0e";}
//                    else if(typeOfGod === "Moon") {
//                        return "white";}
//                    else if(typeOfGod === "Sun") {
//                        return "orange";}
//                    else if(typeOfGod === "Love") {
//                        return "#ff99ff";}
//                    else if(typeOfGod ===  "Wisdom") {
//                        return "#9900ff";}
//                    else if(typeOfGod === "Sea") {
//                        return "blue";}
//                      
//                    else{
//                        return "grey";}
//                })//These brackets match to the style for circles and end the selectALL()
        
         // Add tooltip so that it appears over mouseover on the circle
         .on('mouseover', function(d) {
//            tooltip.transition()
//                   .duration(400)
//                   .style("opacity", 0);
            tooltip.transition()
                   .duration(100)
                   .style("fill", "black")
                   .style("opacity", ".9");
            // Format the tooltip
//            tooltip.html("<img src = " + d.picture+">" + "<br>" + "Name: " + d.name + "<br>"
//                         + "Type: " + d.type + "<br>" 
//                        + "Culture: " + d.culture + "<br>" + "Region: " + d.location + "<br>"
//                        + "Gender: " + d.gender + "<br>" + "Species: " + d.species + "<br>" +
//                        '<a href = "' + d.linkwik + '">' + "Wikipedia Source" + "</a>" + "<br>" +
//                        '<a href = "' + d.linkgc + '">' + "GodChecker" + "</a>")
            tooltip.html(
             "<table>" 
             + "<tr>" + "<td style= 'text-align:left;'> Name </td>" 
                      + "<td style= 'text-align:center;'>  :  </td>" + 
                      "<td style= 'text-align:right;'>" + d.name + "</td>" 
             + "</tr>" 
             + "<tr>" + "<td style= 'text-align:left;'>" + "Type" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.type + "</td>" 
             + "</tr>" 
              + "<tr>" + "<td style= 'text-align:left;'>" + "Culture" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.culture + "</td>" 
             + "</tr>" 
             + "<tr>" + "<td style= 'text-align:left;'>" + "Gender" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.gender + "</td>" 
             + "</tr>" 
             + "</table>")
                   .style("left", (d3.event.pageX ) + "px")
                   .style("top", (d3.event.pageY) + "px")})
            // Deactivate the tooltip
           .on("mouseout", function(d) {
             tooltip.transition()
               .duration(500)
               .style("opacity", 0);
           });
            
        // Create all of the Squares
        g.selectAll("rect")
//         .data(data)
//         .enter()
//         .append("rect")
         .attr("class", "rect")
         .attr("x", function(d) {
                return projection([d.lon,d.lat])[0];})
          .attr("y", function(d) {
                return projection([d.lon, d.lat])[1];})
          .attr("width", "4")
          .attr("height", "4")
          
          //.style("fill", "black")
//                 function(d) {
//                    var typeOfGod = d.type;
//                    if(typeOfGod === "Storm" ) {
//                        return "yellow";}
//                    else if(typeOfGod ==="Sky"){
//                        return "#87CEFA";}
//                    else if(typeOfGod === "Death") {
//                        return "black";}
//                    else if(typeOfGod === "Agriculture") {
//                        return "#006300";}
//                    else if(typeOfGod === "Motherhood") {
//                        return "#99FF99";}
//                    else if(typeOfGod === "War" ) {
//                        return "#9e0e0e";}
//                    else if(typeOfGod === "Moon") {
//                        return "white";}
//                    else if(typeOfGod === "Sun") {
//                        return "orange";}
//                    else if(typeOfGod === "Love") {
//                        return "#ff99ff";}
//                    else if(typeOfGod ===  "Wisdom") {
//                        return "#9900ff";}
//                    else if(typeOfGod === "Sea") {
//                        return "blue";}
//                      
//                    else{
//                        return "grey";}
//                })//These brackets match to the style for circles and end the selectALL()
         // Add tooltip so that it appears over mouseover on the circle
         .on('mouseover', function(d) {
//            tooltip.transition()
//                   .duration(400)
//                   .style("opacity", 0);
            tooltip.transition()
                   .duration(100)
                   .style("fill", "black")
                   .style("opacity", ".9");
            // Format the tooltip
//            tooltip.html("<img src = " + d.picture+">" + "<br>" + "Name: " + d.name + "<br>"
//                         + "Type: " + d.type + "<br>" 
//                        + "Culture: " + d.culture + "<br>" + "Region: " + d.location + "<br>"
//                        + "Gender: " + d.gender + "<br>" + "Species: " + d.species + "<br>" +
//                        '<a href = "' + d.linkwik + '">' + "Wikipedia Source" + "</a>" + "<br>" +
//                        '<a href = "' + d.linkgc + '">' + "GodChecker" + "</a>")
            tooltip.html(
             "<table>" 
             + "<tr>" + "<td style= 'text-align:left;'> Name </td>" 
                      + "<td style= 'text-align:center;'>  :  </td>" + 
                      "<td style= 'text-align:right;'>" + d.name + "</td>" 
             + "</tr>" 
             + "<tr>" + "<td style= 'text-align:left;'>" + "Type" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.type + "</td>" 
             + "</tr>" 
              + "<tr>" + "<td style= 'text-align:left;'>" + "Culture" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.culture + "</td>" 
             + "</tr>" 
             + "<tr>" + "<td style= 'text-align:left;'>" + "Gender" + "</td>" 
                      + "<td style= 'text-align:center;'>" + ":" +  "</td>" + 
                      "<td style= 'text-align:right;'>" + d.gender + "</td>" 
             + "</tr>" 
             + "</table>")
            
                   .style("left", (d3.event.pageX ) + "px")
                   .style("top", (d3.event.pageY) + "px")})
            // Deactivate the tooltip
           .on("mouseout", function(d) {
             tooltip.transition()
               .duration(500)
               .style("opacity", 0);
           });
    
            
            
    });//These bracets are for d3.csv line above
});//These brackets are for d3.json line


// Function to implement click-to-zoom via transform 
function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


//Legend
//  svg.append("rect")
//        .attr("x", width-220)
//        .attr("y", height-190)
//        .attr("width", 200)
//        .attr("rx", 10)
//        .attr("ry", 10)
//        .style("opacity",0.5)
//        .attr("height", 180)
//        .attr("fill", "lightgrey")
//        .style("stroke-size", "1px");
//
//    svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-175)
//        .style("fill", "#87CEFA");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-172)
//        .style("text-anchor", "end")
//        .text("Sky");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-40)
//        .attr("cy", height-175)
//        .style("fill", "yellow");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -50)
//        .attr("y", height-172)
//        .style("text-anchor", "end")
//        .text("Storm");
//
//
//    svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-150)
//        .style("fill", "white");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-150)
//        .style("text-anchor", "end")
//        .text("Moon");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-40)
//        .attr("cy", height-150)
//        .style("fill", "orange");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -50)
//        .attr("y", height-150)
//        .style("text-anchor", "end")
//        .text("Sun");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-125)
//        .style("fill", "#006300");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-125)
//        .style("text-anchor", "end")
//        .text("Agriculture");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-40)
//        .attr("cy", height-125)
//        .style("fill", "blue");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -50)
//        .attr("y", height-125)
//        .style("text-anchor", "end")
//        .text("Sea");
//
//  svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-100)
//        .style("fill", "#9e0e0e");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-100)
//        .style("text-anchor", "end")
//        .text("War");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-40)
//        .attr("cy", height-100)
//        .style("fill", "#ff99ff");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -50)
//        .attr("y", height-100)
//        .style("text-anchor", "end")
//        .text("Love");
//
//  svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-75)
//        .style("fill", "#99FF99");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-75)
//        .style("text-anchor", "end")
//        .text("Motherhood");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-40)
//        .attr("cy", height-75)
//        .style("fill", "black");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -50)
//        .attr("y", height-75)
//        .style("text-anchor", "end")
//        .text("Death");
//
//   svg.append("circle")
//        .attr("r", 5)
//        .attr("cx", width-120)
//        .attr("cy", height-50)
//        .style("fill", "#9900ff");
//
//    svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -130)
//        .attr("y", height-50)
//        .style("text-anchor", "end")
//        .text("Wisdom");

//     svg.append("text")
//        .attr("class", "label")
//        .attr("x", width -120)
//        .attr("y", height-15)
//        .style("text-anchor", "middle")
//        .style("fill", "black") 
//        .attr("font-size", "20px")
//        .text("Type of Diety");   

// Legend 



 svg.append("rect")
        .attr("x", width-200)
        .attr("y", height-120)
        .attr("width", 200)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("opacity",0.5)
        .attr("height", 120)
        .attr("fill", "lightgrey")
//        .attr("fill", "#696969")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-120)
        .attr("cy", height-75)
        .style("fill", "#85ad33");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -130)
        .attr("y", height-70)
        .style("text-anchor", "end")
        .text("Inca");

   svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-40)
        .attr("cy", height-75)
        .style("fill", "BE79DF");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -50)
        .attr("y", height-70)
        .style("text-anchor", "end")
        .text("Aztec");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-120)
        .attr("cy", height-55)
        .style("fill", "194719");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -130)
        .attr("y", height-50)
        .style("text-anchor", "end")
        .text("Celtic");

   svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-40)
        .attr("cy", height-55)
        .style("fill", "ff5050");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -50)
        .attr("y", height-50)
        .style("text-anchor", "end")
        .text("Egyptian");

   svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-120)
        .attr("cy", height-35)
        .style("fill", "#0A97B0");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -130)
        .attr("y", height-30)
        .style("text-anchor", "end")
        .text("Norse");

   svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-40)
        .attr("cy", height-35)
        .style("fill", "ff9900");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -50)
        .attr("y", height-30)
        .style("text-anchor", "end")
        .text("Yoruba");

  svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-120)
        .attr("cy", height-15)
        .style("fill", "#035AA6");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -130)
        .attr("y", height-10)
        .style("text-anchor", "end")
        .text("Greek");

   svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-40)
        .attr("cy", height-15)
        .style("fill", "#c90e0e");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -50)
        .attr("y", height-10)
        .style("text-anchor", "end")
        .text("Japanese");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -100)
        .attr("y", height-90)
        .style("text-anchor", "middle")
        .style("fill", "black") 
        .attr("font-size", "20px")
        .text("Culture"); 

// Legend for symbols
 svg.append("rect")
        .attr("x", width-1300)
        .attr("y", height-100)
        .attr("width", 125)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("opacity",0.5)
        .attr("height", 100)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

     svg.append("circle")
            .attr("r", 5)
            .attr("cx", width-1220)
            .attr("cy", height-40)
            .attr("fill", "#E8E4E1")
            .attr("stroke", "black");

     svg.append("text")
            .attr("class", "label")
            .attr("x", width -1240)
            .attr("y", height-35)
            .style("text-anchor", "end")
            .text("Male");

    svg.append("rect")
            .attr("x", width-1225)
            .attr("y", height-15)
            .attr("width", 9)
            .attr("height", 9)
            .attr("fill", "#484848")
            .attr("troke", "black");
     svg.append("text")
            .attr("class", "label")
            .attr("x", width -1240)
            .attr("y", height-10)
            .style("text-anchor", "end")
            .text("Female");

     svg.append("text")
            .attr("class", "label")
            .attr("x", width -1230)
            .attr("y", height-60)
            .style("text-anchor", "middle")
            .style("fill", "black") 
            .attr("font-size", "18px")
            .text("Gender"); 

