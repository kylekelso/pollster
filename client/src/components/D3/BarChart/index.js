import React, { Component } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const defaults = {
  barPadding: 5,
  axisPadding: 5,
  tickSize: 10,
  textCutoff: 11,
  margin: { top: 15, right: 0, bottom: 50, left: 100 }
};

class BarChart extends Component {
  constructor(props) {
    super(props);
    Object.assign(this, defaults, defaults);
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.outerDimensions = [props.width, props.height];
    this.innerDimensions = [
      props.width - this.margin.left - this.margin.right,
      props.height - this.margin.top - this.margin.bottom
    ];
  }

  componentDidMount() {
    this.drawFrame();
    this.drawAxes();
    this.drawBars();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.removeChart();
      this.drawFrame();
      this.drawAxes();
      this.drawBars();
    }
  }

  removeChart = () => {
    const chart = document.getElementsByClassName("bar-chart-content");
    if (chart[0] !== undefined) {
      chart[0].remove();
    }
  };

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
    let { width, height } = this.props;

    this.graph = d3
      .select("#bar-chart")
      .style("padding-bottom", (100 * height) / width + "%");

    this.svg = this.graph
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("bar-chart-content", true)
      .append("g")
      .attr("transform", "translate(100,15)");
  }

  drawAxes() {
    let { svg, tickSize, axisPadding } = this;
    let { data } = this.props;

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
    svg = svg.transition();
    svg.select(".chart__axis--x").call(this.xAxis);

    svg.select(".chart__axis--y").call(this.yAxis);
  }

  drawBars() {
    const { svg, scaleX, scaleY, colors, barPadding, innerDimensions } = this;
    const { data } = this.props;
    let innerWidth = innerDimensions[0];
    let innerHeight = innerDimensions[1];
    let barThickness = innerHeight / data.length - barPadding;
    const bar = svg.selectAll(".chart__bar").data(data);

    const row = svg.selectAll(".chart__row").data(data);

    row
      .enter()
      .append("rect")
      .attr("class", "chart__row");

    svg
      .selectAll(".chart__row")
      .attr("y", data => scaleY(data.label) - barThickness / 2)
      .attr("rx", barThickness / 2)
      .attr("ry", barThickness / 2)
      .attr("height", barThickness)
      .attr("width", innerWidth);

    row.exit().remove();

    bar
      .enter()
      .append("rect")
      .attr("class", "chart__bar");

    svg
      .selectAll(".chart__bar")
      .attr("y", data => scaleY(data.label) - barThickness / 2)
      .attr("rx", barThickness / 2)
      .attr("ry", barThickness / 2)
      .attr("height", barThickness)
      .style("fill", (d, i) => {
        return colors(i);
      })
      .transition()
      .ease(d3.easeLinear)
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
