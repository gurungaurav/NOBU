import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PieChart({ data, width, height }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    // Create a color scale based on data labels
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(d3.schemeCategory10);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arcs = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2}, ${height / 1})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .on("mouseover", function (event, d) {
        // Show tooltip on mouseover
        const tooltip = d3.select("#tooltip");
        tooltip.html(`${d.data.label}: ${d.data.value}`);
        tooltip.style("opacity", 0.9);
        tooltip.style("left", event.pageX + 10 + "px");
        tooltip.style("top", event.pageY + 10 + "px");
      })
      .on("mouseout", function () {
        // Hide tooltip on mouseout
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 0);
      });

    // Append tooltip element
    svg
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px");

    // Append legend
    const legend = svg
      .selectAll(".legend")
      .data(data.map((d) => d.label))
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d);
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
