---
title: "Basics of Data Smoothing and Filtering: Exponential Moving Average"
description: The article explains the exponential moving average (EMA).
date: 2025-03-04
---

When working with data — whether it’s sensor readings, financial time series, or other measurements — we often encounter noise. Noise is random fluctuations that obscure the true signal we’re trying to analyze. To extract meaningful information, we use smoothing and filtering techniques. One of the simplest and most effective methods is the **exponential moving average (EMA)**. This article explains its fundamentals, how it works, and its practical applications.

### What is Smoothing and Why Do We Need It?

Smoothing is a technique used to reduce noise in data while preserving the underlying trend or pattern. Imagine you’re tracking the temperature outside with a sensor. Due to environmental factors or sensor imperfections, the readings might fluctuate wildly from second to second. Smoothing helps you see the general temperature trend without getting distracted by these short-term variations.

The exponential moving average is particularly useful because it gives more weight to recent data points, making it responsive to changes while still smoothing out noise.

### The Simple Moving Average

Before diving into the EMA, let’s consider a simpler method: the **simple moving average (SMA)**. The SMA calculates the average of a fixed number of past data points. 

A filter, in its simplest form, is a mathematical algorithm for this "smoothing." The algorithm takes measured values of something as input and produces smoothed values as output. There are a vast number of such mechanisms, each with its own operating principle and area of application. For example, you can calculate the arithmetic mean over the last few measurements. In this case, the adjustable parameter of the filter is the so-called local window — the number of recent measurements used in the averaging to obtain the current value. For example, four:

If you have a time series \( x_1, x_2, x_3, x_4 \), the SMA over a window of \( 4 \) points at time \( t \) is:

$$
X_t = \frac{x_t + x_{t-1} + x_{t-2} + x_{t-3}}{4}
$$

Generalized formula for a local window \( n \):

\[
X_t = \frac{\sum_{i=0}^{n-1} x_{t-i}}{n}
\]

While the SMA is easy to compute, it has a drawback: all points in the window are weighted equally, and older data has the same influence as newer data. This makes the SMA slow to react to sudden changes in the trend.

### Exponential Moving Average

The **exponential moving average (EMA)** addresses this limitation by assigning exponentially decreasing weights to older data points. This means recent values have a stronger influence on the average, allowing the EMA to adapt more quickly to changes.

The EMA is defined recursively. For a time series \( x_t \), the EMA at time \( t \), denoted \( X_t \), is calculated as:

\[
X_t = \alpha \cdot x_t + (1 - \alpha) \cdot X_{t-1}
\]

Where:
- \( x_t \) is the current data point,
- \( X_{t-1} \) is the previous EMA value,
- \( \alpha \) (alpha) is the smoothing factor, a value between 0 and 1.

The smoothing factor \( \alpha \) determines how much weight is given to the current observation versus the historical average. A higher \( \alpha \) (closer to 1) makes the EMA more responsive to new data, while a lower \( \alpha \) (closer to 0) makes it smoother and less reactive.

#### Initial Value
To start the recursion, you need an initial value for \( X_0 \). A common choice is to set \( X_0 = x_1 \) (the first data point) or use the SMA over the first few points.

#### Relation to Window Size
The smoothing factor \( \alpha \) can be related to the window size \( n \) of an SMA using the formula:

\[
\alpha = \frac{2}{n + 1}
\]

For example, if you want the EMA to behave like an SMA with a 10-point window, you’d set \( \alpha = \frac{2}{10 + 1} = \frac{2}{11} \approx 0.18 \).

### Advantages of EMA

1. **Responsiveness**: The EMA reacts quickly to changes because it prioritizes recent data.
2. **Simplicity**: It’s computationally efficient, requiring only the previous EMA value and the current data point.
3. **Flexibility**: You can tune \( \alpha \) to balance smoothness and sensitivity.

### Applications

The EMA is widely used in:
- **Finance**: To analyze stock prices, detect trends, or trigger trading signals.
- **Engineering**: To filter noisy sensor data (e.g., in robotics or avionics).
- **Data Science**: To preprocess time series data for machine learning models.

### Exploring the Demo

It’s time to get hands-on with EMA filtering. In the program below, the red line represents the actual value. The white dots are the measured values of the actual quantity, which include some "error." The green line shows the result of the filter’s work. The adjustable parameter "alpha" can be changed using the vertical slider on the right.

<script src="/js/chart.js"></script>
<style>
    .chart-container {
        align-items: center;
        margin: 2em 0;
    }
    canvas {
        background: var(--colorBackgroundOpaque);
        border-radius: var(--roundness);
    }
    .controls {
        display: grid;
        grid-template-columns: 33.33333% 33.33333% 33.33333%;
        align-items: center;
        justify-content: center;
    }
    .controls > * {
        width: 100%;
        padding: 0 5%;
    }
    label {
        font-size: calc(var(--globalFontSize) - 2px);
        width: 90%;
    }
    input[type="range"] {
        width: 90%;
    }
</style>

<div class="chart-container">
    <div class="controls">
        <div>
            <label for="alpha">Alpha (0-1): <span id="alphaValue">0.5</span></label><br>
            <input type="range" id="alpha" min="0" max="1" step="0.001" value="0.5">
        </div>
        <div>
            <label for="error">Error (0-2): <span id="errorValue">0.5</span></label><br>
            <input type="range" id="error" min="0" max="2" step="0.01" value="0.5">
        </div>
        <div>
            <label for="freq">Frequency (0-10): <span id="freqValue">1</span></label><br>
            <input type="range" id="freq" min="0" max="10" step="0.01" value="1">
        </div>
    </div>
    <canvas id="chart"></canvas>
</div>

<script>
    const ctx = document.getElementById('chart').getContext('2d');

    const alphaSlider = document.getElementById('alpha');
    const errorSlider = document.getElementById('error');
    const freqSlider = document.getElementById('freq');

    const alphaValue = document.getElementById('alphaValue');
    const errorValue = document.getElementById('errorValue');
    const freqValue = document.getElementById('freqValue');

    let alpha = parseFloat(alphaSlider.value);
    let error = parseFloat(errorSlider.value);
    let freq = parseFloat(freqSlider.value);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Actual (Red)',
                    data: [],
                    borderColor: 'red',
                    pointRadius: 0,
                    borderWidth: 2
                },
                {
                    label: 'Measured (White Dots)',
                    data: [],
                    type: 'scatter',
                    backgroundColor: 'white',
                    pointRadius: 2
                },
                {
                    label: 'Smoothed (Green)',
                    data: [],
                    borderColor: '#00FE00',
                    pointRadius: 0,
                    borderWidth: 5
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 100,
                    display: false
                },
                y: {
                    min: -1.5,
                    max: 1.5,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            },
            animation: false,
            events: []
        }
    });

    let t = 0;
    let smoothedValue = 0;

    function generateData() {
        const actualValue = Math.sin(t * 0.02 * freq);

        const noise = (Math.random() - 0.5) * 2 * error;
        const measuredValue = actualValue + noise;

        smoothedValue = alpha * measuredValue + (1 - alpha) * smoothedValue;

        chart.data.datasets[0].data.push({ x: t, y: actualValue });
        chart.data.datasets[1].data.push({ x: t, y: measuredValue });
        chart.data.datasets[2].data.push({ x: t, y: smoothedValue });

        if (chart.data.datasets[0].data.length > 160) {
            chart.data.datasets[0].data.shift();
            chart.data.datasets[1].data.shift();
            chart.data.datasets[2].data.shift();
        }

        chart.options.scales.x.min = Math.max(0, t - 160);
        chart.options.scales.x.max = t;

        chart.update();
        t++;
    }

    alphaSlider.addEventListener('input', () => {
        alpha = parseFloat(alphaSlider.value);
        alphaValue.textContent = alpha.toFixed(3);
    });
    errorSlider.addEventListener('input', () => {
        error = parseFloat(errorSlider.value);
        errorValue.textContent = error.toFixed(2);
    });
    freqSlider.addEventListener('input', () => {
        freq = parseFloat(freqSlider.value);
        freqValue.textContent = freq.toFixed(2);
    });

    function animate() {
        generateData();
        setTimeout(() => requestAnimationFrame(animate), 21);
    }
    animate();
</script>


When alpha is close to 1, filtering is almost nonexistent: the result is mostly influenced by the latest measurement. As alpha decreases, you can observe the green line becoming smoother. However, as smoothness increases, the green line starts lagging behind the red line. This is called a phase shift. The stronger the filtering, the greater the phase shift.

There’s always a need to find a balance: a result that’s smooth enough while keeping the phase shift small enough. But if the measurement error is too high, achieving the desired compromise becomes impossible. You can easily see this by setting error = 1: the error becomes comparable to significant changes in the actual value.

A similar property is observed in mechanical damping. Although this process is much more complex due to natural frequencies and the physical properties of dampers, an analogy with the exponential filter can be drawn: the softer the damper (the smaller the alpha), the more vibrations are suppressed, but at the same time, significant changes in the system might be missed.