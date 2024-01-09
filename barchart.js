// Fetch the dataset
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(data => {
        // Parse the dataset
        const dataset = data.data;

        // Create the chart
        const svgWidth = 800;
        const svgHeight = 400;
        const padding = 40;

        const svg = d3.select("#graphic")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        
        // Append the tooltip to the body
        const tooltip = d3.select("#graphic")
            .append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0);

        // Create the title
        svg.append("text")
            .attr("id", "title")
            .attr("x", svgWidth / 2)
            .attr("y", padding)
            .attr("text-anchor", "middle")
            .text("GDP Data Visualization");

        // Create the x-axis
        const xScale = d3.scaleTime()
            .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
            .range([padding, svgWidth - padding]);

        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (svgHeight - padding) + ")")
            .call(xAxis);

        // Create the y-axis
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .range([svgHeight - padding, padding]);

        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        // Create the bars
        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("data-date", (d, i) => d[0]) // Set "data-date" property to the date value
            .attr("data-gdp", d => d[1]) // Set "data-gdp" property to the GDP value
            .attr("x", d => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", (svgWidth - 2 * padding) / dataset.length)
            .attr("height", d => svgHeight - padding - yScale(d[1]))
            .on("mouseover", (d, i) => {
                // Show tooltip
                tooltip.style("opacity", 1)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .attr("data-date", d[0]) // Set "data-date" property to the date value
                    .html(`Date: ${d[0]}<br>GDP: ${d[1]}`);
            })
            .on("mouseout", () => {
                // Hide tooltip
                tooltip.style("opacity", 0);
            });
    });
