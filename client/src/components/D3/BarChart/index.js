import React, { Component } from "react";
import * as d3 from "d3";
import "./BarChart.css";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.outerDimensions = [props.width, props.height];
    this.innerDimensions = [
      props.width - props.margin.left - props.margin.right,
      props.height - props.margin.top - props.margin.bottom
    ];
  }

  componentDidMount() {
    this.drawFrame();
    this.drawAxes();
    this.drawBars();
  }

  getMaxValue(data) {
    return data.reduce((p, n, i) => {
      if (p.value > n.value) {
        return p;
      } else {
        return n;
      }
    }).value;
  }

  drawFrame() {
    const { margin, width, height, tickSize, axisPadding, data } = this.props;

    this.graph = d3.select("#bar-chart");
    const svg = (this.svg = this.graph
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`));

    const scaleX = (this.scaleX = d3
      .scaleLinear()
      .domain([0, this.getMaxValue(data)])
      .range([0, this.innerDimensions[0]]));
    const scaleY = (this.scaleY = d3
      .scalePoint()
      .domain(data.map(d => d.label))
      .range([this.innerDimensions[1], 0]));
    const xAxis = (this.xAxis = d3
      .axisBottom(scaleX)
      .ticks(3)
      .tickPadding(8)
      .tickSize(tickSize));
    const yAxis = (this.yAxis = d3
      .axisLeft(scaleY)
      .ticks(data.length)
      .tickPadding(8)
      .tickSize(tickSize)).tickFormat(d => {
      return this.truncateLabel(d, 11);
    });

    svg
      .append("g")
      .attr("class", "chart__axis chart__axis--x")
      .attr(
        "transform",
        `translate(0, ${this.innerDimensions[1] + axisPadding + 8})`
      )
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "chart__axis chart__axis--y")
      .attr("transform", `translate(${-axisPadding}, 0)`)
      .call(yAxis);
  }

  drawAxes() {
    let { svg } = this;
    svg = svg.transition();
    svg.select(".chart__axis--x").call(this.xAxis);

    svg.select(".chart__axis--y").call(this.yAxis);
  }

  drawBars() {
    const { svg, scaleX, scaleY, innerDimensions } = this;
    const { barPadding, data } = this.props;
    let innerWidth = innerDimensions[0];
    let innerHeight = innerDimensions[1];
    let barThickness = innerHeight / data.length - barPadding;
    const bar = svg.selectAll(".chart__bar").data(data);

    const column = svg.selectAll(".chart__column").data(data);

    column
      .enter()
      .append("rect")
      .attr("class", "chart__column");

    svg
      .selectAll(".chart__column")
      .transition()
      .ease(d3.easeLinear)
      .attr("y", data => scaleY(data.label) - barThickness / 2)
      .attr("rx", barThickness / 2)
      .attr("ry", barThickness / 2)
      .attr("height", barThickness)
      .attr("width", innerWidth);

    column.exit().remove();

    bar
      .enter()
      .append("rect")
      .attr("class", "chart__bar");

    svg
      .selectAll(".chart__bar")
      .transition()
      .ease(d3.easeLinear)
      .attr("y", data => scaleY(data.label) - barThickness / 2)
      .attr("rx", barThickness / 2)
      .attr("ry", barThickness / 2)
      .attr("height", barThickness)
      .attr("width", data => {
        return scaleX(data.value);
      });

    bar.exit().remove();
  }

  truncateLabel(text, charCutoff) {
    var truncated = text.substring(0, charCutoff);
    if (text.length > charCutoff) {
      truncated += "...";
    }

    return truncated;
  }

  render() {
    return <div id="bar-chart" />;
  }
}

export default BarChart;
