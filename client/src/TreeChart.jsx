/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeChart = ({ data }) => {

  const svgRef = useRef();

  useEffect(() => {
    if (data) {
      renderGraph(data);
    }}, [data]);

  const renderGraph = (data) => {
    d3.select(svgRef.current).selectAll('*').remove();

    const marginTop = 100;
    const marginBottom = 10;
    const marginLeft = 50;


    const root = d3.hierarchy(data);
    const width = root.height * 200;
    const dx = 50;
    const dy = width / (root.height + 1);
    
    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', dx)
      .attr('viewBox', [0, 0, width, dx])
      .attr('style', 'max-width: 100%; height: auto; font: 12px sans-serif; user-select: none;');

    const gLink = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 4);

    const gNode = svg
      .append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    function update(event, source) {
      const duration = 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition = svg.transition()
        .duration(duration)
        .attr('height', height)
        .attr('viewBox', [-marginLeft, left.x - marginTop, width, height + 20]);

      const node = gNode.selectAll('g')
        .data(nodes, d => d.id);

      const nodeEnter = node.enter().append('g')
        .attr('transform', d => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', (event, d) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      nodeEnter.append('circle')
        .attr('r', 4)
        .attr('fill', d => d._children ? '#555' : '#999')
        .attr('stroke-width', 10);

      nodeEnter.append('text')
        .attr('dy', d => d._children ? '-0.75em' : '0.31em')
        .attr('x', d => d._children ? 0 : 6)
        .attr('text-anchor', d => d._children ? 'middle' : 'start')
        .text(d => d.data.name === 'identifier' ? d.data.name + ": " + d.data.text : d.data.name)
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .attr('paint-order', 'stroke');

      node.merge(nodeEnter).transition(duration)
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

      node.exit().transition(transition).remove()
        .attr('transform', d => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

      const link = gLink.selectAll('path')
        .data(links, d => d.target.id);

      const linkEnter = link.enter().append('path')
        .attr('d', d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition)
        .attr('d', diagonal);

      link.exit().transition(transition).remove()
        .attr('d', d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

    }

    root.x0 = dx / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      // if (d.children) {
      //   d.children = null;
      // }
    });

    update(null, root);
    
  }

  return <svg ref={svgRef} />;
};

export default TreeChart;