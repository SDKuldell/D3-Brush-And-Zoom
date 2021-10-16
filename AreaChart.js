// input: selector for a chart container e.g., ".chart"
export default function AreaChart(container) {
  // initialization
  const margin = { top: 20, left: 50, right: 20, bottom: 20 };
  const totalWidth = 650;
  const totalHeight = 500;
  const width = totalWidth - margin.left - margin.right,
    height = totalHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3.scaleTime().range([0, width]);

  const yScale = d3.scaleLinear().range([height, 0]);

  svg.append("path").attr("class", "areaUpdate");

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg.append("g").attr("class", "axis y-axis");

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("end", brushed);

  const listeners = { brushed: null };

  function brushed(event) {
    if (event.selection) {
      listeners["brushed"](event.selection.map(xScale.invert));
    }
  }

  function update(data) {
    // update scales, encodings, axes (use the total count)

    xScale.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );

    yScale.domain([0, d3.max(data, (d) => d.total)]);

    const area = d3
      .area()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.total))
      .y1(yScale(0));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("class", "areaUpdate")
      .attr("d", area);

    const xAxis = d3.axisBottom(xScale);

    svg.select(".x-axis").call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    svg.select(".y-axis").call(yAxis);

    svg.append("g").attr("class", "brush").call(brush);
  }

  function on(event, listener) {
    listeners[event] = listener;
  }

  return {
    update, // ES6 shorthand for "update": update
    on,
  };
}
