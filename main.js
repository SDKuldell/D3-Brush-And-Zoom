import AreaChart from "./AreaChart.js";
import StackedAreaChart from "./StackedAreaChart.js";

let data;

d3.csv("unemployment.csv", d3.autoType).then((d) => {
  data = d;

  for (let i = 0; i < data.length; i++) {
    let tot =
      data[i]["Agriculture"] +
      data[i]["Business services"] +
      data[i]["Construction"] +
      data[i]["Education and Health"] +
      data[i]["Finance"] +
      data[i]["Government"] +
      data[i]["Information"] +
      data[i]["Leisure and hospitality"] +
      data[i]["Manufacturing"] +
      data[i]["Mining and Extraction"] +
      data[i]["Other"] +
      data[i]["Self-employed"] +
      data[i]["Transportation and Utilities"] +
      data[i]["Wholesale and Retail Trade"];

    data[i]["total"] = tot;
  }

  const areaChart1 = AreaChart(".chart-container1");

  areaChart1.update(data);

  const stackedAreaChart1 = StackedAreaChart(".chart-container2");

  stackedAreaChart1.update(data);

  areaChart1.on("brushed", (range) => {
    stackedAreaChart1.filterByDate(range); // coordinating with stackedAreaChart
  });
});
