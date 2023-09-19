// for NFTs Statistics

function projectstatistics() {
  'use strict'

setTimeout(()=>{
  var options = {
    series: [{
      name: 'Sales',
      data: [44, 42, 57, 86, 58, 55, 70, 43, 23, 54, 77, 34],
      },{
      name: 'Earnings',
      data: [-34, -22, -37, -56, -21, -35, -60, -34, -56, -78, -89,-53],
    }],
    chart: {
      stacked: true,
      type: 'bar',
      height: 380,
      toolbar: {
        show: false
      }
    },
    grid: {
        borderColor: '#f2f6f7',
      },
    colors: ["rgba(" + myVarVal + ", 0.95)", ,"#4876e6"],
    plotOptions: {
      bar: {
        borderRadius: 0,
        borderRadiusOnAllStackedSeries: true,
        colors: {
          ranges: [{
          from: -100,
          to: -46,
          color: '#4876e6'
          }, {
          from: -45,
          to: 0,
          color: '#4876e6'
          }]
        },
        columnWidth: '25%',
      }
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: 'top',
      fontFamily:"Mulish",
      markers: {
        width: 10	,
        height: 10,
      }
    },
    yaxis: {
        labels: {
        formatter: function (y) {
          return y.toFixed(0) + "";
        }
      }
    },
    xaxis: {
      type: 'month',
      categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
      axisBorder: {
            show: true,
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
      labels: {
        rotate: -90
      }
    }
  };
  document.getElementById('projectstatistics').innerHTML = ''
  var chart = new ApexCharts(document.querySelector("#projectstatistics"), options);
  chart.render();
}, 300);
}


// Sales By Category
var options = {
    plotOptions: {
        pie: {
          size: 10,
          donut: {
            size: '70%'
          }
        }
    },
    dataLabels: {
        enabled: false,
    },
    series: [55, 34, 51, 20],
    labels: ['Electronics', 'Women\'s', 'Men\'s', 'Kid\'s'],
    chart: {
      type: 'donut',
      fontFamily: 'Poppins, Arial, sans-serif',
      height: 300,
    },
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      labels: {
        colors: '#5d6162',
    },
    },
    responsive: [{
      breakpoint: 0,
      options: {
        chart: {
          width: 100,
        },
        legend: {
          show: true,
          fontSize: '14px',
          position: 'bottom',
        }
      },
    }]
  };
  var chart2 = new ApexCharts(document.querySelector("#salesDonut"), options);
  chart2.render();

  function salesDonut(){
      chart2.updateOptions({
      colors: ["rgba(" + myVarVal + ", 0.95)",   '#e791bc', '#f68466', '#f5b849'],
    })
  }



var markers = [
    {
    name: 'Usa - 238',
    coords: [40.3, -101.38]
},
{
    name: 'India - 205',
    coords: [20.5937, 78.9629]
},
{
    name: 'Canada - 192',
    coords: [56.1304, -106.3468]
},
{
    name: 'Vatican City - 184',
    coords: [41.90, 12.45]
},
{
    name: 'Palau - 163',
    coords: [7.35, 134.46]
},
{
    name: 'São Tomé and Príncipe - 147',
    coords: [0.33, 6.73]
},
];
var map = new jsVectorMap({
    map: 'world_merc',
    selector: '#country-sales',
    markersSelectable: true,
    zoomOnScroll: false,
    zoomButtons: false,

    onMarkerSelected(index, isSelected, selectedMarkers) {
        console.log(index, isSelected, selectedMarkers);
    },

    // -------- Labels --------
    labels: {
        markers: {
            render: function (marker) {
                return marker.name
            },
        },
    },

    // -------- Marker and label style --------
    markers: markers,
    markerStyle: {
        hover: {
            stroke: "#DDD",
            strokeWidth: 3,
            fill: '#FFF'
        },
        selected: {
            fill: '#ff525d'
        }
    },
    markerLabelStyle: {
        initial: {
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: 500,
            fill: '#35373e',
        },
    },
})