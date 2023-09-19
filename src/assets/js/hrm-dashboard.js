/*  sales overview chart */

var options = {
  series: [
    {
      name: "TEAM A",
      type: "bar",
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 40],
    },
    {
      name: "TEAM B",
      type: "area",
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 44],
    },
    {
      name: "TEAM C",
      type: "column",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 11],
    },
  ],
  chart: {
    toolbar: {
      show: false,
    },
    height: 310,
    type: "line",
    stacked: false,
  },
  stroke: {
    width: [0, 1, 1],
    curve: "smooth",
  },
  plotOptions: {
    bar: {
      columnWidth: "40%",
    },
  },
  colors: [
    "rgba(0, 144, 172, 0.95)",
    "rgba(0, 144, 172, 0.05)",
    "#ffa891",
  ],
  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: "light",
      type: "vertical",
      opacityFrom: 0.65,
      opacityTo: 0.15,
      stops: [0, 100, 100, 100],
    },
  },

  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  markers: {
    size: 0,
  },
  xaxis: {
    type: "month",
  },
  yaxis: {
    title: {
      text: "Points",
    },
    min: 0,
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " points";
        }
        return y;
      },
    },
  },
  legend: {
    show: false,
  },
};

var chart = new ApexCharts(document.querySelector("#hrmstatistics"), options);
chart.render();
function hrmstatistics() {
  chart.updateOptions({
    colors: [
      "rgba(" + myVarVal + ", 0.95)",
      "rgba(" + myVarVal + ", 0.05)",
      "#ffa891",
    ],
  });

}
