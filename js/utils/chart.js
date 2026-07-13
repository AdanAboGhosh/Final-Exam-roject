// make a simple bar chart with svg
// data is a list of { label, value }, max is the top value of the chart
export function barChart(data, max, unit = "") {
    const width = 520;
    const height = 250;
    const space = 40; // space for the axis

    const innerW = width - space * 2;
    const innerH = height - space * 2;

	// if max is 0 use 1 so we don't divide by zero
    const topValue = max || 1;

    // width for each bar
    let slot = 0;
    if (data.length > 0) {
        slot = innerW / data.length;
    }
    const barWidth = slot * 0.55;

    let svg = "";

   // grid lines and numbers on the left (0, 25, 50, 75, 100)
    for (let i = 0; i <= 4; i++) {
        const y = space + innerH - (innerH * i) / 4;
        const number = Math.round((topValue * i) / 4);
        svg += `<line x1="${space}" y1="${y}" x2="${width - space}" y2="${y}" stroke="currentColor" opacity="0.15"/>`;
        svg += `<text x="${space - 6}" y="${y + 3}" text-anchor="end" font-size="10" fill="currentColor" opacity="0.6">${number}</text>`;
    }

    // the two axis lines
    svg += `<line x1="${space}" y1="${space}" x2="${space}" y2="${space + innerH}" stroke="currentColor" opacity="0.4"/>`;
    svg += `<line x1="${space}" y1="${space + innerH}" x2="${width - space}" y2="${space + innerH}" stroke="currentColor" opacity="0.4"/>`;

    // draw a bar for each item
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const x = space + slot * i + (slot - barWidth) / 2;
        const barHeight = innerH * (item.value / topValue);
         const y = space + innerH - barHeight;

         svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="#3b82f6"/>`;
        svg += `<text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-size="11" fill="currentColor">${item.value}${unit}</text>`;
        svg += `<text x="${x + barWidth / 2}" y="${height - space + 15}" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.7">${item.label}</text>`;
    }

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" style="max-width:${width}px">${svg}</svg>`;
}