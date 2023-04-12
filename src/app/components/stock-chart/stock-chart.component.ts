import * as am5 from "@amcharts/amcharts5";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from '@amcharts/amcharts5/themes/Responsive';
import * as am5xy from "@amcharts/amcharts5/xy";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateTime } from 'luxon';


@Component({
  selector: 'stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss'],
})
export class StockChartComponent implements OnInit {
  transactiondata: any = [];

  ngOnInit(): void {
    this.stock_chart()
  }

  stock_chart() {
    /**
  * ---------------------------------------
  * This demo was created using amCharts 5.
  * 
  * For more information visit:
  * https://www.amcharts.com/
  * 
  **/

    // Create root element
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element


    var root = am5.Root.new("chartdiv");


    // Set themes
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/concepts/themes/


    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create a stock chart
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Instantiating_the_chart


    var stockChart = root.container.children.push(am5stock.StockChart.new(root, {
    }));


    // Set global number format
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/


    root.numberFormatter.set("numberFormat", "#,###.00");


    // Create a main stock panel (chart)
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels


    var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true
    }));


    // Create value axis
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/


    var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
      }),
      extraMin: 0.1, // adds some space for for main series
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: "#,###.00",
      extraTooltipPrecision: 2
    }));

    var dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));


    // Add series
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/


    var valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
      name: "MSFT",
      clustered: false,
      valueXField: "adate",
      valueYField: "transactionvalue",
      highValueYField: "ahigh",
      lowValueYField: "alow",
      openValueYField: "aopen",
      calculateAggregates: true,
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText: "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
      legendRangeValueText: "",
      tooltip: am5.Tooltip.new(root, {})
    }));

    // Add transaction series

    valueSeries.bullets.push((root: am5.Root, series: any, dataItem: any) => {
      if (dataItem.dataContext.transactiontype == "Buy" || dataItem.dataContext.transactiontype == "Buy Cover") {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 6,
            tooltipText: '{labeltext}',
            fill: am5.color(0x39FF74),
            stroke: am5.color(0xffffff),
            strokeWidth: 0,
          })
        });
      }
      else {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 6,
            tooltipText: '{labeltext}',
            fill: am5.color(0xFF7439),
            stroke: am5.color(0xffffff),
            strokeWidth: 0
          })
        });
      }
    });

    var tooltip: any = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      getLabelFillFromSprite: false,
      tooltipText: 'labeltext'
    });

    // set tooltip text 

    valueSeries.columns.template.adapters.add("tooltipText", (text: any, target: any) => {
      if (target.dataItem.dataContext && target.dataItem.dataContext.transactionvalue && (target.dataItem.dataContext.transactiontype == 'Buy' || target.dataItem.dataContext.transactiontype == 'Buy Cover')) {
        return target.dataItem.labeltext;
      } else {
        return text; // returns default label text
      }
    });

    // set background collor 

    valueSeries.columns.template.adapters.add("fill", (fill: any, target: any) => {
      if (target.dataItem.dataContext && target.dataItem.dataContext.transactionvalue && (target.dataItem.dataContext.transactiontype == 'Buy' || target.dataItem.dataContext.transactiontype == 'Buy Cover')) {
        return am5.color(0x39FF74);
      }
      else {
        return am5.color(0xFF7439);
      }
    });

    valueSeries.set("tooltip", tooltip);

    // Set main value series

    stockChart.set("stockSeries", valueSeries);

    // Add a stock legend
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/stock-legend/


    var valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
      stockChart: stockChart
    }));


    // Create volume axis
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    var volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
      inside: true
    });

    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    var volumeValueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
      numberFormat: "#.#a",
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer
    }));

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/


    var volumeSeries = mainPanel.series.push(am5xy.ColumnSeries.new(root, {
      name: "Volume",
      clustered: false,
      valueXField: "adate",
      valueYField: "Volume",
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
    }));

    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5
    });

    // color columns by stock rules

    volumeSeries.columns.template.adapters.add("fill", function (fill, target) {
      var dataItem = target.dataItem;
      if (dataItem) {
        return stockChart.getVolumeColor(dataItem);
      }
      return fill;
    })


    // Set main series
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series


    stockChart.set("volumeSeries", volumeSeries);
    valueLegend.data.setAll([valueSeries, volumeSeries]);


    // Add cursor(s)
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/


    mainPanel.set("cursor", am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!"
    }));


    // Add scrollbar
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/


    var scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    }));
    stockChart.toolsContainer.children.push(scrollbar);

    var sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {})
    }));

    var sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    var sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
      valueYField: "transactionvalue",
      valueXField: "adate",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis
    }));

    sbSeries.fills.template.setAll({
      visible: true,
      fillOpacity: 0.3
    });

    // Set up series type switcher
    // -------------------------------------------------------------------------------
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/series-type-control/

    var seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
      stockChart: stockChart
    });

    seriesSwitcher.events.on("selected", (ev: any) => {
      setSeriesType(ev.item.id);
    });

    function getNewSettings(series: any) {
      var newSettings: any = [];
      am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "stroke", "fill"], function (setting) {
        newSettings[setting] = series.get(setting);
      });
      return newSettings;
    }

    function setSeriesType(seriesType: any) {
      // Get current series and its settings
      var currentSeries: any = stockChart.get("stockSeries");
      var newSettings = getNewSettings(currentSeries);

      // Remove previous series
      var data = currentSeries.data.values;
      mainPanel.series.removeValue(currentSeries);

      // Create new series
      var series: any;
      switch (seriesType) {
        case "line":
          series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
          break;
        case "candlestick":
        case "procandlestick":
          newSettings.clustered = false;
          series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
          if (seriesType == "procandlestick") {
            series.columns.template.get("themeTags").push("pro");
          }
          break;
        case "ohlc":
          newSettings.clustered = false;
          series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
          break;
      }

      // Set new series as stockSeries
      if (series) {
        valueLegend.data.removeValue(currentSeries);
        series.data.setAll(data);
        stockChart.set("stockSeries", series);
        var cursor = mainPanel.get("cursor");
        if (cursor) {
          cursor.set("snapToSeries", [series]);
        }
        valueLegend.data.insertIndex(0, series);
      }
    }


    // Stock toolbar Start
    // https://www.amcharts.com/docs/v5/charts/stock/toolbar/

    var toolbar = am5stock.StockToolbar.new(root, {
      container: document.getElementById("chartcontrols") as HTMLElement,
      stockChart: stockChart,
      controls: [
        am5stock.IndicatorControl.new(root, {
          stockChart: stockChart,
          legend: valueLegend
        }),
        am5stock.DateRangeSelector.new(root, {
          stockChart: stockChart
        }),
        am5stock.PeriodSelector.new(root, {
          stockChart: stockChart
        }),
        seriesSwitcher,
        am5stock.DrawingControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.ResetControl.new(root, {
          stockChart: stockChart
        }),
        am5stock.SettingsControl.new(root, {
          stockChart: stockChart
        })
      ]
    })


    var tooltip: any = am5.Tooltip.new(root, {
      getStrokeFromSprite: false,
      getFillFromSprite: false
    });

    tooltip.get("background").setAll({
      strokeOpacity: 1,
      stroke: am5.color(0x000000),
      fillOpacity: 1,
      fill: am5.color(0xffffff)
    });


    function makeEvent(date: any, letter: any, color: any, description: any) {
      var dataItem = dateAxis.createAxisRange(dateAxis.makeDataItem({ value: date }))
      var grid = dataItem.get("grid");
      if (grid) {
        grid.setAll({ visible: true, strokeOpacity: 0.2, strokeDasharray: [3, 3] })
      }

      var bullet = am5.Container.new(root, {
        dy: -100
      });

      var circle = bullet.children.push(am5.Circle.new(root, {
        radius: 10,
        stroke: color,
        fill: am5.color(0xffffff),
        tooltipText: description,
        tooltip: tooltip,
        tooltipY: 0
      }));

      var label = bullet.children.push(am5.Label.new(root, {
        text: letter,
        centerX: am5.p50,
        centerY: am5.p50
      }));

      dataItem.set("bullet", am5xy.AxisBullet.new(root, {
        location: 0,
        stacked: true,
        sprite: bullet
      }));
    }
    // Stock toolbar end 

    // fetch data from json start

    fetch('../../../../assets/json/instrument-amazon-transactions.json').then(res => res.json())
      .then((transdata: any) => {
        this.transactiondata = transdata.map((res: any) => {
          if (res.adate) {
            var splitdata = res.adate.split('T');
            var gettime = new Date(splitdata[0]).getTime();
            return { ...res, adate: gettime };
          }
        })
      })
    fetch('../../../../assets/json/instrument-amazon-chart-data.json').then(res => res.json())
      .then((data: any) => {
        let result = data.map((res: any) => {
          if (res.adate) {
            var splitdata = res.adate.split('T');
            var gettime = new Date(splitdata[0]).getTime();
            return { ...res, adate: gettime };
          }
        })
        var getdata = result.filter((res: any) => {
          return this.transactiondata.map(function (data: any) {
            if (res.adate === data.adate) {
              const datatype = data.type ? data.type : '';
              const shares = data.shares ? data.shares : '';
              const pricepershare = data.price_per_share ? data.price_per_share.toFixed(2) : '';
              const fundname = data.fund_name ? data.fund_name : '';
              const multistrategy = data.multistrategy_name ? data.multistrategy_name : '';
              res.labeltext = datatype + ' ' + shares + ' @ ' + pricepershare + ' ' + fundname + ' ' + multistrategy;
              res.transactionvalue = res.aclose_111617;
              res.transactiontype = data.type;
              return res;
            }
          });
        })
        // fetch data from json end


        // set data to all series start

        valueSeries.data.setAll(getdata);
        volumeSeries.data.setAll(getdata);
        sbSeries.data.setAll(getdata);

        // set data to all series end
      })

  }


}