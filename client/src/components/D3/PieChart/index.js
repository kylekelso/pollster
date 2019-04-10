import React, { Component } from "react";
import * as d3 from "d3";
import "./PieChart.css";

const defaults = {
  boxSize: 15,
  boxSpacing: 6,
  padding: 10,
  arcOpacity: 0.7,
  text_short: 12,
  text_long: 20,
  margin: { top: 15, right: 0, bottom: 15, left: 0 }
};
class Piechart extends Component {
  constructor(props) {
    super(props);
    Object.assign(this, defaults, defaults);
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.radius =
      Math.min(
        props.width - this.margin.left - this.margin.right - this.padding,
        props.height - this.margin.bottom - this.margin.top - this.padding
      ) / 2;
  }

  componentDidMount = () => {
    this.drawFrame();
    this.drawArcs();
    this.drawTooltips();
    this.drawLegend();
  };

  removeChart = () => {
    const chart = document.getElementsByClassName("pie-chart-content");
    const tooltip = document.getElementsByClassName("tooltip");
    if (chart[0] !== undefined) {
      chart[0].remove();
    }
    if (tooltip[0] !== undefined) {
      tooltip[0].remove();
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.removeChart();
      this.drawFrame();
      this.drawArcs();
      this.drawTooltips();
      this.drawLegend();
    }
  }

  drawFrame() {
    let { width, height } = this.props;

    this.graph = d3
      .select("#pie-chart")
      .style("padding-bottom", 100 * ((height + 45) / width) + "%");

    this.svg = this.graph
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("pie-chart-content", true)
      .append("g")
      .attr("transform", "translate(160,100)");
  }

  drawArcs() {
    let { props, radius, colors } = this;

    var pie = d3
      .pie()
      .value(d => d.value)
      .sort(null);

    var arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    var arcs = d3
      .select("g")
      .selectAll("arc")
      .data(pie(props.data))
      .enter()
      .append("g")
      .attr("class", "arc");

    this.paths = arcs
      .append("path")
      .attr("fill", (d, i) => {
        return colors(i);
      })
      .attr("d", arc)
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0.7);
  }

  drawTooltips() {
    let { graph, paths, text_short } = this;
    var tooltip = graph.append("div").attr("class", "tooltip");

    tooltip.append("div").attr("class", "label");

    tooltip.append("div").attr("class", "value");

    paths.on("mouseover", d => {
      tooltip
        .select(".label")
        .html(this.truncateLabel(d.data.label, text_short));
      tooltip.select(".value").html("(" + d.data.value + ")");
      tooltip.style("display", "block");
    });

    paths.on("mouseout", function() {
      tooltip.style("display", "none");
    });

    paths.on("mousemove", function() {
      tooltip
        .style("top", d3.event.layerY + 10 + "px")
        .style("left", d3.event.layerX + 10 + "px");
    });
  }

  drawLegend() {
    let { props, svg, colors, radius, boxSize, boxSpacing, text_long } = this;

    var legend = svg
      .selectAll(".legend")
      .data(props.data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        var boxHeight = boxSize + boxSpacing;
        var offset = (boxHeight * props.data.length) / 2;
        var x_offset = radius + 10;
        var y_offset = i * boxHeight - offset;
        return "translate(" + x_offset + "," + y_offset + ")";
      });

    legend
      .append("circle")
      .attr("cx", boxSize / 2)
      .attr("cy", boxSize / 2)
      .attr("r", boxSize / 2)
      .style("fill", (d, i) => {
        return colors(i);
      })
      .style("stroke", (d, i) => {
        return colors(i);
      })
      .style("opacity", 0.7);
    // legend
    //   .append("rect")
    //   .attr("width", boxSize)
    //   .attr("height", boxSize)
    //   .style("fill", (d, i) => {
    //     return colors(i);
    //   })
    //   .style("stroke", (d, i) => {
    //     return colors(i);
    //   })
    //   .style("opacity", 0.7);
    legend
      .append("text")
      .attr("x", boxSize + boxSpacing)
      .attr("y", boxSize - boxSpacing / 2)
      .text(d => {
        return this.truncateLabel(d.label, text_long);
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
