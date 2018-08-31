import d3 from 'd3';
import * as nwt from '../utils/contour-utils';
import Contour from '../core/contour';

function title(titleText, layer) {
    const svg = d3.select(this.container[0][0].firstChild);
    const xVal = 5;
    const yVal = 14;
    svg.append('text')
        .attr('x', xVal)
        .attr('y', yVal)
        .style('font-size', '1.0625rem')
        .text(titleText);
}

Contour.export('title', title);
