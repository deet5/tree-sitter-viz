/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Sample data for the tree
const TreeChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data) {
      renderGraph(data);
    }}, [data]);

  const renderGraph = (data) => {
    const root = d3.hierarchy(data);
    const width = root.height * 290;
    const dx = 100;
    const dy = width / (root.height + 1);
    const tree = d3.tree().nodeSize([dx, dy]);

    tree(root);

    // Compute x and y ranges
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const height = x1 - x0 + dx * 2;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-dy / 3, x0 - dx, width + 80, height])
      .attr('style', 'max-width: 100%; height: auto; font: 16px sans-serif; user-select: none;');

    // Links
    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 3.0)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
      );

    // Nodes
    const node = svg
      .append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');
    
    node
      .append('circle')
      .attr('fill', d => (d.children ? '#555' : '#999'))
      .attr('r', 3.5);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', d => (d.children ? -10 : 10))
      .attr('text-anchor', d => (d.children ? 'end' : 'start'))
      .text(d => d.data.name === 'identifier' ? d.data.name + ": " + d.data.text : d.data.name)
      .attr('stroke', 'white')
      .attr('paint-order', 'stroke');

    
  }

  return <svg ref={svgRef} />;
};

export default TreeChart;