<template>
  <div class="line-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

export default {
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: props.chartData,
        options: props.options
      });
    };

    onMounted(() => {
      renderChart();
    });

    watch([() => props.chartData, () => props.options], () => {
      renderChart();
    });

    return {
      chartCanvas
    };
  }
};
</script>

<style scoped>
.line-chart {
  position: relative;
  height: 400px;
}
</style>
