// src/HotelCheckInOutGraph.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const HotelCheckInOutGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.selectAll('*').remove(); // Clear previous graph (if any)

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.checkIns, d.checkOuts))])
      .nice()
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.day) + margin.left)
      .attr('y', d => yScale(d.checkIns) + margin.top)
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.checkIns))
      .attr('fill', 'steelblue');

    svg.selectAll('.bar2') // Changed class name for the second set of bars
      .data(data) // Changed data source to the same as the first set of bars
      .enter()
      .append('rect')
      .attr('class', 'bar2') // Changed class name for the second set of bars
      .attr('x', d => xScale(d.day) + margin.left)
      .attr('y', d => yScale(d.checkOuts) + margin.top)
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.checkOuts))
      .attr('fill', 'orange');
  }, [data]);

  return (
    <svg ref={svgRef} width={600} height={600}></svg>
  );
};

export default HotelCheckInOutGraph;
