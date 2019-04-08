import React, { Component } from "react";
import * as d3 from "d3";
import "./PieChart.css";

class Piechart extends Component {
  constructor(props) {
    super(props);
    this.boxSize = 15;
    this.boxSpacing = 6;
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.radius =
      Math.min(props.size / 2 - props.padding, props.size / 2 - props.padding) /
      2;
  }
  componentDidMount = () => {
    this.drawFrame();
    this.drawArcs();
    this.drawTooltips();
    this.drawLegend();
  };

  drawFrame() {
    this.svg = d3
      .select("#pie-chart")
      .append("svg")
      .attr("width", "100%")
      .attr("height", this.props.size / 2)
      .append("g")
      .attr("transform", function() {
        let width = this.parentNode.clientWidth / 2 - 84;
        let height = this.parentNode.clientHeight / 2;
        console.dir(this);
        return "translate(" + width + "," + height + ")";
      });
  }

  drawArcs() {
    var pie = d3
      .pie()
      .value(d => d.value)
      .sort(null);
    var arc = d3
      .arc()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius);
    var arcs = d3
      .select("g")
      .selectAll("arc")
      .data(pie(this.props.data))
      .enter()
      .append("g")
      .attr("class", "arc");
    this.paths = arcs
      .append("path")
      .attr("fill", (d, i) => {
        return this.colors(i);
      })
      .attr("d", arc);
  }

  drawTooltips() {
    var tooltip = d3
      .select("#pie-chart")
      .append("div")
      .attr("class", "tooltip");

    tooltip.append("div").attr("class", "label");

    tooltip.append("div").attr("class", "value");

    this.paths.on("mouseover", d => {
      tooltip.select(".label").html(this.truncateLabel(d.data.label, 12));
      tooltip.select(".value").html("(" + d.data.value + ")");
      tooltip.style("display", "block");
    });

    this.paths.on("mouseout", function() {
      tooltip.style("display", "none");
    });

    this.paths.on("mousemove", function(d) {
      tooltip
        .style("top", d3.event.layerY + 10 + "px")
        .style("left", d3.event.layerX + 10 + "px");
    });
  }

  drawLegend() {
    let { svg, colors, radius, boxSize, boxSpacing } = this;

    var legend = svg
      .selectAll(".legend")
      .data(this.props.data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        var boxHeight = boxSize + boxSpacing;
        var offset = (boxHeight * this.props.data.length) / 2;
        var x_offset = radius + 10;
        var y_offset = i * boxHeight - offset;
        return "translate(" + x_offset + "," + y_offset + ")";
      });

    legend
      .append("rect")
      .attr("width", boxSize)
      .attr("height", boxSize)
      .style("fill", (d, i) => {
        return colors(i);
      })
      .style("stroke", (d, i) => {
        return colors(i);
      });
    legend
      .append("text")
      .attr("x", boxSize + boxSpacing)
      .attr("y", boxSize - boxSpacing / 2)
      .text(d => {
        return this.truncateLabel(d.label, 20);
      });
  }

  truncateLabel(text, charCutoff) {
    var truncated = text.substring(0, charCutoff);
    if (text.length > charCutoff) {
      truncated += "...";
    }

    return truncated;
  }

  render() {
    return <div id="pie-chart" />;
  }
}

export default Piechart;
