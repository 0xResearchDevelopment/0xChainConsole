function filestore() {
  var options = {
    series: [70],
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    colors: ["rgba(" + myVarVal + ", 0.95)", "rgba(" + myVarVal + ", 0.15)"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "80%",
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: ["rgba(" + myVarVal + ", 0.15)"],
            opacity: 1,
            blur: 1,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "22px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    labels: ["Average Results"],
  };
  var chart2 = new ApexCharts(document.querySelector("#filestore"), options);
  chart2.render();
}

(function () {
  "use strict";

  var myElement1 = document.getElementById("files-main-nav");
  new SimpleBar(myElement1, { autoHide: true });

  var myElement2 = document.getElementById("file-folders-container");
  new SimpleBar(myElement2, { autoHide: true });

  /* filepond */
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImageEdit,
    FilePondPluginFileValidateType,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );

  /* multiple upload */
  const MultipleElement = document.querySelector(".multiple-filepond");
  FilePond.create(MultipleElement);

  document.querySelectorAll(".files-type").forEach((element) => {
    element.onclick = () => {
      if (window.screen.width <= 575) {
        document.querySelector(".file-manager-folders").classList.add("open");
        document
          .querySelector(".file-manager-navigation")
          .classList.add("close");
      }
    };
  });
  document.querySelector("#folders-close-btn").onclick = ()=>{
      document.querySelector(".file-manager-navigation").classList.remove("close")
      document.querySelector(".file-manager-folders").classList.remove("open")
  }

  window.addEventListener("resize", () => {
    if (window.screen.width > 576) {
      document
        .querySelector(".file-manager-navigation")
        .classList.remove("close");
    }
  });
})();
