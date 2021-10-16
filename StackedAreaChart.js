export default function StackedAreaChart(container) {
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

  const colorScale = d3.scaleOrdinal();

  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);

  svg.append("g").attr("class", "axis y-axis");

  function update(data) {
    const keys = data.columns.slice(1);

    const stackedData = d3.stack().keys(keys)(data);

    xScale.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );

    yScale.domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))]);

    colorScale.domain(keys).range(d3.schemeCategory10);

    const area = d3
      .area()
      .x((d) => xScale(d.data.date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const areas = svg.selectAll(".area").data(stackedData, (d) => d.key);

    areas.join("path").attr("d", area);

    areas.exit().remove();

    svg
      .append("path")
      .data(stackedData)
      .attr("fill", (d) => colorScale(d.key))
      .attr("d", area);

    const xAxis = d3.axisBottom(xScale);

    svg.select(".x-axis").call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    svg.select(".y-axis").call(yAxis);
  }
  return {
    update,
  };
}
