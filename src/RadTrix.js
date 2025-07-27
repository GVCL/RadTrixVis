import './RadTrix.css';
import React, {useRef} from 'react';
import * as d3 from 'd3';
import { margin, width, height } from './helpers';
import * as htmlToImage from 'html-to-image';
import { useRecoilValue } from 'recoil';
import { dradius, circleSelector, colorScaleSelector, edgeTypeAtom, matrixScaleSelector, nodesMatrixSelector, opacityScale1Selector, opacityScaleSelector, dOuterRadius } from './state'
import { Button, Tooltip } from 'antd';
import { DownloadOutlined, QuestionOutlined } from '@ant-design/icons';

function RadTrix({ svgRef, legendRef, handleExport }) {
    // const svgRef = useRef(null);
    // const legendRef = useRef(null);

    const matrixScale = useRecoilValue(matrixScaleSelector);
    const opacityScale = useRecoilValue(opacityScaleSelector);
    const opacityScale1 = useRecoilValue(opacityScale1Selector);
    const colorScale = useRecoilValue(colorScaleSelector);
    const [nodes, matrix] = useRecoilValue(nodesMatrixSelector);
    const [circleNodes, circleEdges] = useRecoilValue(circleSelector);
    const edgeType = useRecoilValue(edgeTypeAtom);

    const selectedSummary = useRef(null);

    const radius = useRecoilValue(dradius);
    const oradius = useRecoilValue(dOuterRadius);

    // const handleExport = () => {
    //     if (svgRef.current) {
    //         const svgNode = svgRef.current;
    //         htmlToImage.toPng(svgNode, { pixelRatio: 3 }) // Set a high pixel ratio for high resolution
    //             .then((dataUrl) => {
    //                 // Create a link element to download the image
    //                 const link = document.createElement('a');
    //                 link.download = 'exported-image.png';
    //                 link.href = dataUrl;
    //                 link.click();
    //             })
    //             .catch((error) => {
    //                 console.error('Error exporting image:', error);
    //             });
    //     }
    // }

    // const handleExport = () => {
    //     if (svgRef.current && legendRef.current) {
    //         Promise.all([
    //             htmlToImage.toPng(svgRef.current, { pixelRatio: 3 }),
    //             htmlToImage.toPng(legendRef.current, { pixelRatio: 3 })
    //         ]).then(images => {
    //             const canvas = document.createElement('canvas')
    //             const ctx = canvas.getContext('2d')

    //             const img1 = new Image()
    //             img1.src = images[0]

    //             const img2 = new Image()
    //             img2.src = images[1]

    //             img1.onload = () => {
    //                 canvas.width = img1.width + img2.width;
    //                 canvas.height = Math.max(img1.height, img2.height);
    //                 ctx.drawImage(img1, 0, 0);
            
    //                 img2.onload = () => {
    //                     ctx.drawImage(img2, img1.width, 0);
                
    //                     // Trigger download of the composite image
    //                     const link = document.createElement('a');
    //                     link.download = 'composite_image.png';
    //                     link.href = canvas.toDataURL('image/png');
    //                     link.click();
    //                 };
    //             };
    //         })
    //     }
    // }

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
        const nodes = d3.selectAll('circle.node')._groups[0];
        const t = {}
        lines.forEach(e => {
            const target = e.getAttribute('targ');
            const src = e.getAttribute('source');
            if ((target === n1) || (target === n2)) {
                if(!(src in t)) {
                    t[src] = 1;
                } else {
                    t[src] += 1;
                }
            }
        })
        let numEdges = 0;
        lines.forEach(e => {
            const target = e.getAttribute('targ');
            const source = e.getAttribute('source');
            if (n1 === n2) {
                if ((target === n1) || (target === n2)) {
                    e.style.strokeWidth = 2;
                    numEdges += 1;
                } else {
                    e.style.strokeWidth = 0;
                }
            } else {
                if (((target === n1) || (target === n2))) {
                    if (t[source] === 2) e.style.strokeWidth = 2;
                    else e.style.strokeWidth = 0.5;
                    numEdges += 1;
                } else {
                    e.style.strokeWidth = 0;
                }
            }
        })
        nodes.forEach(e => {
            const name = e.getAttribute('id')
            if (name in t) {
                if (n1 === n2) {
                    e.style.fill = 'blue'
                    e.style.stroke = 'blue'
                } else {
                    if (t[name] === 2) {
                        e.style.fill = 'blue'
                        e.style.stroke = 'blue'
                    } else {
                        e.style.fill = 'violet'
                        e.style.stroke = 'violet'
                    }
                }
            }
        })
        selectedSummary.current.innerHTML = `
            <div style="position: absolute; top: 125px; left: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 100; width: 150px; font-family: Arial, sans-serif;">
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 12px; color: #495057;">Highlighted Summary</div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
                    <span>Nodes:</span>
                    <span style="color: #0d6efd; font-weight: bold;">${Object.keys(t).length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px;">
                    <span>Matrix Rows:</span>
                    <span style="color: #0d6efd; font-weight: bold;">${n1 === n2 ? 1 : 2}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>Edges:</span>
                    <span style="color: #0d6efd; font-weight: bold;">${numEdges}</span>
                </div>
            </div>`;
    }

    const mouseOut = () => {
        const lines = (edgeType === 1) ? d3.selectAll('line.edge')._groups[0] : d3.selectAll('path.path')._groups[0];
        const nodes = d3.selectAll('circle.node')._groups[0];
        const nodeText = d3.selectAll('text.nodetext')._groups[0];
        d3.selectAll(".row text").classed("active", (d, i) => { return false; });
        d3.selectAll(".column text").classed("active", (d, i) => { return false; });
        lines.forEach(e => {
            e.style.strokeWidth = 0.6;
        })
        nodeText.forEach(e => {
            e.style.fontSize = '10px';
        })
        nodes.forEach(e => {
            e.style.fill = 'red'
            e.style.stroke = 'red'
        })

        selectedSummary.current.innerHTML = '';
    }

    return (
        <div className="App">
            <div style={{width: '200px', height: '400px', position: 'absolute', left: '-9999px'}}>
                <svg width="100%" height="100%" ref={legendRef}>
                    {circleNodes.reduce((u, i) => {
                        if (!u.some(e => e.nodeDegree === i.nodeDegree)) {
                            u.push(i)
                        }
                        return u;
                    }, []).map((e, index) => (
                        <g key={`circle-${index}`}>
                            <circle cx={30} cy={20 + index * 40} r={e.r} fill={e.fillStroke} stroke={e.fillStroke} />
                            <text x={50} y={25 + index * 40} fill="black">Node Degree: {e.nodeDegree}</text>
                        </g>
                    ))}
                    {circleEdges.reduce((u, i) => {
                        if (!u.some(e => e.target === i.target)) {
                            u.push(i)
                        }
                        return u;
                    }, []).map((e, index) => (
                        <g key={`line-${e.target}`}>
                            <line x1={30} y1={200 + index * 30} x2={70} y2={200 + index * 30} stroke={e.stroke} />
                            <text x={80} y={205 + index * 30} fill={e.stroke}>{e.target}</text>
                        </g>
                    ))}
                </svg>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <Tooltip 
                    title={
                        <div style={{width: '200px', height: '400px', backgroundColor: '#f0f0f0', borderRadius: '5px', boxShadow: '2px 2px 2px grey'}}>
                            <svg width="100%" height="100%">
                                {circleNodes.reduce((u, i) => {
                                    if (!u.some(e => e.nodeDegree === i.nodeDegree)) {
                                        u.push(i)
                                    }
                                    return u;
                                }, []).map((e, index) => (
                                    <g key={`circle-${index}`}>
                                        <circle cx={30} cy={20 + index * 40} r={e.r} fill={e.fillStroke} stroke={e.fillStroke} />
                                        <text x={50} y={25 + index * 40} fill="black" fontWeight="bold">Node Degree: {e.nodeDegree}</text>
                                    </g>
                                ))}
                                {circleEdges.reduce((u, i) => {
                                    if (!u.some(e => e.target === i.target)) {
                                        u.push(i)
                                    }
                                    return u;
                                }, []).map((e, index) => (
                                    <g key={`line-${e.target}`}>
                                        <line x1={30} y1={200 + index * 30} x2={70} y2={200 + index * 30} stroke={e.stroke} strokeWidth={4} />
                                        <text x={80} y={205 + index * 30} fill={e.stroke} fontWeight="bold">{e.target}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    } 
                    placement='left'
                    color='transparent'
                    overlayInnerStyle={{
                        backgroundColor: '#f0f0f0',
                        boxShadow: 'none',
                        margin: 0,
                        padding: 0
                    }}
                    destroyTooltipOnHide={{
                        keepParent: true
                    }}
                >
                    <Button
                        type="primary"
                        icon={<QuestionOutlined style={{ color: 'blue' }} />}
                        style={{ background: 'transparent', border: 'none' }}
                    />
                </Tooltip>
                <Tooltip title='Download Image' placement='left'>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined style={{ color: 'blue' }} />}
                        style={{ background: 'transparent', border: 'none' }}
                        onClick={handleExport}
                    />
                </Tooltip>
            </div>
            {matrix &&
            <div ref={svgRef} style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '5px',
                    padding: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    width: '150px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px', color: '#495057' }}>
                        RadTrix Summary
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                        <span>Nodes:</span>
                        <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>{circleNodes.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                        <span>Matrix Rows:</span>
                        <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>{matrix.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span>Edges:</span>
                        <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>{circleEdges.length}</span>
                    </div>
                </div>
                <div ref={selectedSummary}></div>
                
            <svg
                width={2.4 * radius}
                height={(2.45 - (0.08 * (radius / 550))) * radius}
                className='radtrix'
            >
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
                <g transform={"translate(" + (oradius - width / 2) + "," + (oradius - height / 2) + ")"}>
                    <rect
                        className='background'
                        width={width}
                        height={height}
                    />
                    {matrix.map((e, i) => {
                        return (
                            <g className='row' transform={'translate(0,' + matrixScale(i) + ')'} key={nodes[i].name + '_matrix'}>
                                {e.map((f, j) => {
                                    return (
                                        // TODO: Add the mouseover events
                                        <Tooltip 
                                            title={`${nodes[i].name === nodes[j].name ? nodes[i].name : nodes[i].name + ' and ' + nodes[j].name}: ${f.z / 2}`}
                                            placement='right'
                                        >
                                            <rect
                                                className='cell'
                                                x={matrixScale(f.x)}
                                                width={matrixScale.bandwidth()}
                                                height={matrixScale.bandwidth()}
                                                id={nodes[j].name}
                                                key={nodes[i].name + '_matrix_' + nodes[j].name}
                                                style={{
                                                    fillOpacity: f.x === f.y ? opacityScale1(f.z) : opacityScale(f.z),
                                                    fill: f.c // f.x === f.y ? "green" : colorScale(1)
                                                }}
                                                onMouseOver={() => mouseOverRows(f, nodes[i].name, nodes[j].name)}
                                                onMouseLeave={mouseOut}
                                            ></rect>
                                        </Tooltip>
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
                <g transform={'translate(' + oradius + ', ' + oradius + ')'}>
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
                                fill={e.fillStroke}
                                stroke={e.fillStroke}
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
                
                
            </svg>
            </div>
            }
        </div>
    );
}

export default RadTrix;
