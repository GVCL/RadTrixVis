import './RadTrix.css';
import React from 'react';
import * as d3 from 'd3';
import { margin, width, height, outerRadius, radius } from './helpers';
import { useRecoilValue } from 'recoil';
import { circleSelector, colorScaleSelector, edgeTypeAtom, matrixScaleSelector, nodesMatrixSelector, opacityScale1Selector, opacityScaleSelector } from './state'

function RadTrix() {

    const matrixScale = useRecoilValue(matrixScaleSelector);
    const opacityScale = useRecoilValue(opacityScaleSelector);
    const opacityScale1 = useRecoilValue(opacityScale1Selector);
    const colorScale = useRecoilValue(colorScaleSelector);
    const [nodes, matrix] = useRecoilValue(nodesMatrixSelector);
    const [circleNodes, circleEdges] = useRecoilValue(circleSelector);
    const edgeType = useRecoilValue(edgeTypeAtom)

    const mouseOverCircle = src => {
        const lines = (edgeType === 1) ? d3.selectAll('line.edge')._groups[0] : d3.selectAll('path.path')._groups[0];
        const nodeText = d3.selectAll('text.nodetext')._groups[0];
        lines.forEach(e => {
            const source = e.getAttribute('source');
            if (source === src) {
                e.style.strokeWidth = 2;
            } else {
                e.style.strokeWidth = 0.2;
            }
        })
        nodeText.forEach(e => {
            const source = e.getAttribute('name');
            if (source === src) {
                e.style.fontSize = '15px';
            } else {
                e.style.fontSize = '10px';
            }
        })
    }

    const mouseOverRows = (src, n1, n2) => {
        d3.selectAll(".row text").classed("active", (d, i) => { return i === src.y; });
        d3.selectAll(".column text").classed("active", (d, i) => { return i === src.x; });
        const lines = (edgeType === 1) ? d3.selectAll('line.edge')._groups[0] : d3.selectAll('path.path')._groups[0];
        lines.forEach(e => {
            const target = e.getAttribute('targ');
            if ((target === n1) || (target === n2)) {
                e.style.strokeWidth = 2;
            } else {
                e.style.strokeWidth = 0.2;
            }
        })
    }

    const mouseOut = () => {
        const lines = (edgeType === 1) ? d3.selectAll('line.edge')._groups[0] : d3.selectAll('path.path')._groups[0];
        const nodeText = d3.selectAll('text.nodetext')._groups[0];
        d3.selectAll(".row text").classed("active", (d, i) => { return false; });
        d3.selectAll(".column text").classed("active", (d, i) => { return false; });
        lines.forEach(e => {
            e.style.strokeWidth = 0.6;
        })
        nodeText.forEach(e => {
            e.style.fontSize = '10px';
        })
    }

    return (
        <div className="App">
            {matrix &&
            <svg
                width={2.5 * radius}
                height={height + margin.top + 8 * margin.bottom}
                className='radtrix'
            >
                <g transform={"translate(" + (outerRadius - width / 2) + "," + (outerRadius - height / 2) + ")"}>
                    <rect
                        className='background'
                        width={width}
                        height={height}
                    ></rect>
                    {matrix.map((e, i) => {
                        return (
                            <g className='row' transform={'translate(0,' + matrixScale(i) + ')'} key={nodes[i].name + '_matrix'}>
                                {e.map((f, j) => {
                                    return (
                                        // TODO: Add the mouseover events
                                        <rect
                                            className='cell'
                                            x={matrixScale(f.x)}
                                            width={matrixScale.bandwidth()}
                                            height={matrixScale.bandwidth()}
                                            id={nodes[j].name}
                                            key={nodes[i].name + '_matrix_' + nodes[j].name}
                                            style={{
                                                fillOpacity: f.x === f.y ? opacityScale1(f.z) : opacityScale(f.z),
                                                fill: f.x === f.y ? "green" : colorScale(1)
                                            }}
                                            onMouseOver={() => mouseOverRows(f, nodes[i].name, nodes[j].name)}
                                            onMouseLeave={mouseOut}
                                        ></rect>
                                    )
                                })}
                                <text 
                                    className='label' 
                                    x={-5}
                                    y={matrixScale.bandwidth() / 2}
                                    dy='0.32em'
                                    textAnchor='end'
                                >
                                    {nodes[i].name}
                                </text>
                                <line stroke='white' x2={width}></line>
                            </g>
                        )
                    })}
                    {matrix.map((e, i) => {
                        return (
                            <g className='column' transform={'translate(' + matrixScale(i) + ')rotate(-90)'} key={nodes[i].name + '_matrix_text'}>
                                <text 
                                    className='label' 
                                    y={matrixScale.bandwidth() / 2}
                                    dy='0.32em'
                                    textAnchor='start'
                                >
                                    {nodes[i].name}
                                </text>
                                <line stroke='white' x1={-width}></line>
                            </g>
                        )
                    })}
                </g>
                <g transform={'translate(' + outerRadius + ', ' + outerRadius + ')'}>
                    <circle className='main-circle'></circle>
                    {circleNodes.map((e, i) => {
                        // TODO: Mouse Events
                        return (
                            <circle
                                className='node'
                                cx={e.x}
                                cy={e.y}
                                degree={e.degrees}
                                id={e.name}
                                key={e.name + '_' + edgeType}
                                nodedegree={e.nodeDegree}
                                r={e.r}
                                onMouseOver={() => mouseOverCircle(e.name)}
                                onMouseLeave={mouseOut}
                            />                            
                        )
                    })}
                    {circleNodes.map((e, i) => {
                        // TODO: Mouse Events
                        return (
                            <text
                                className='nodetext'
                                name={e.name}
                                textAnchor={e.text_anchor}
                                dy='0.3em'
                                dx={e.dx}
                                transform={e.transform}
                                fontSize='10px'
                                key={e.name + '_text'}
                                onMouseOver={() => mouseOverCircle(e.name)}
                                onMouseLeave={mouseOut}
                            >
                                {e.name}
                            </text>
                        )
                    })}
                </g>
                
                {edgeType === 1 ? 
                    <g> {
                        circleEdges.map((e, i) => {
                            return <line
                                className='edge'
                                strokeWidth={0.6}
                                stroke={e.stroke}
                                fill={e.stroke}
                                source={e.source}
                                targ={e.target}
                                x1={e.x2}
                                y1={e.y2}
                                x2={e.x1}
                                y2={e.y1}
                                key={"edge_"+i}
                            />
                        })
                    } </g> : 
                    <g transform={'translate(-' + margin.left + ',-' + margin.top + ')'}> {
                        circleEdges.map((e, i) => {
                            const d3line = d3.line()
                                .x(function(d){ return d.x; })
                                .y(function(d){ return d.y; })
                                .curve(d3.curveNatural);
                            return <path 
                                className='path'
                                d={d3line(e['points'])}
                                strokeWidth={0.6}
                                fill="none"
                                stroke={e.stroke}
                                source={e.info.source}
                                targ={e.info.target_color}
                                key={"path_"+i}
                            />
                        })
                    } </g>
                }
            </svg>
            }
            <div 
                className='tooltip'
                style={{
                    opacity: 0
                }}
            ></div>
        </div>
    );
}

export default RadTrix;
