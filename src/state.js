import { atom, selector } from "recoil";
import { radiansToDegrees, radiansToX, radiansToY, width, radius, outerRadius, height, color, margin, Cmargin, defaultColors } from './helpers';
import { data } from "./data3";
import * as d3 from 'd3';
import cloneDeep from 'lodash/cloneDeep';
import { shuffle } from "lodash";

import ForceEdgeBundling from './ForceEdgeBundling';

// export const circleNodeNames = data.circlenodes.map((e, i) => [i, e.name])
// export const circleNodeSortedIdx = circleNodeNames.sort((a, b) => a[1].localeCompare(b[1]))

export const fullDataAtom = atom({
    key: 'radtrix$fullData',
    default: data
})

export const circleNodeNames = selector({
    key: 'radtrix$circleNodeNames',
    get: ({ get }) => get(fullDataAtom).circlenodes.map((e, i) => [i, e.name])
})

export const circleNodeSortedIdx = selector({
    key: 'radtrix$circleNodeSortedIdx',
    get: ({ get }) => {
        const arr = cloneDeep(get(circleNodeNames))
        return arr.sort((a, b) => a[1].localeCompare(b[1]))
    }
})

export const dataAtom = atom({
    key: 'radtrix$data',
    default: data
})

export const getIndexSelector = selector({
    key: 'radtrix$getIndex',
    get: ({ get }) => {
        return get(fullDataAtom).nodes.reduce((a, e) => {
            a[e.name] = e.index
            return a
        }, {})
    }
})

export const optionsSelector = selector({
    key: 'radtrix$options',
    get: ({ get }) => {
        const getIndex = cloneDeep(get(getIndexSelector))
        return Object.keys(getIndex).map((e, i) => {
            return {
                label: e,
                value: getIndex[e],
                key: i
            }
        })
    }
})

export const colorsAtom = atom({
    key: 'radtrix$colors',
    default: data.nodes.reduce((a, e) => {
        a[e.name] = defaultColors[e.index % defaultColors.length]
        return a
    }, {})
})

export const cmColorsAtom = atom({
    key: 'radtrix$cmColors',
    default: {
        circlenodes: '#ff0000',
        matrixDiagonal: '#2FA52F',
        matrixNonDiagonal: '#1f77b4'
    }
})

export const currentIndexAtom = atom({
    key: 'radtrix$currentIndex',
    default: data.nodes.reduce((a, e) => {
        a[e.name] = e.index
        return a
    }, {})
})

export const edgeTypeAtom = atom({
    key: 'radtrix$edgeType',
    default: 1
})

export const orderTypeAtom = atom({
    key: 'radtrix$orderType',
    default: 1
})

export const matrixScaleSelector = selector({
    key: 'radtrix$matrixScale',
    // @ts-ignore
    get: ({ get }) => d3.scaleBand().range([0, width]).domain(d3.range(get(dataAtom).nodes.length))
});

export const opacityScaleSelector = selector({
    key: 'radtrix$opacityScale',
    get: ({ get }) => d3.scaleLinear().domain([0, get(dataAtom).circlenodes.length]).range([0.05, 1.0]).clamp(true)
})

export const opacityScale1Selector = selector({
    key: 'radtrix$opacityScale1',
    get: ({ get }) => d3.scaleLinear().domain([0, get(dataAtom).circlenodes.length * 2]).range([0.05, 1.0]).clamp(true)
})

// d3.scaleOrdinal(["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6"])//
export const colorScaleSelector = selector({
    key: 'radtrix$colorScale',
    get: () => d3.scaleOrdinal([...d3.schemeCategory10, ...d3.schemeCategory10])
})

export const totalItemsSelector = selector({
    key: 'radtrix$totalItems',
    get: ({ get }) => get(dataAtom).nodes.length
})

export const dradius = selector({
    key: 'radtrix$dradius',
    get: ({ get }) => {
        const maxCircles = get(fullDataAtom).circlenodes.length
        const currCircles = get(dataAtom).circlenodes.length

        return (0.6 + ((currCircles / maxCircles) * 0.4)) * radius
    }
})

export const dOuterRadius = selector({
    key: 'radtrix$dOuterRadius',
    get: ({ get }) => {
        const rad = get(dradius)
        return rad + Cmargin
    }
})

export const nodesMatrixSelector = selector({
    key: 'radtrix$matrix',
    get: ({ get }) => {
        const data = get(dataAtom);
        const cmColors = get(cmColorsAtom);
        const nodes = cloneDeep(data.nodes);
        const matrix = []
        const totalItems = nodes.length;
        nodes.forEach(node => {
            node.count = 0;
            matrix[node.index] = d3.range(totalItems).map(idx => {
                return {
                    x: idx,
                    y: node.index,
                    z: 0,
                    c: idx === node.index ? cmColors.matrixDiagonal : cmColors.matrixNonDiagonal
                }
            })
        })
        data.links.forEach(link => {
            matrix[link.source][link.target].z += link.value;
            matrix[link.target][link.source].z += link.value;
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
        })
        return [nodes, matrix]
    }
})

export const circleSelector = selector({
    key: 'radtrix$circle',
    get: ({ get }) => {
        const data = get(dataAtom);
        const [nodes, matrix] = get(nodesMatrixSelector);
        const matrixScale = get(matrixScaleSelector);
        const circleNodes = cloneDeep(data.circlenodes);
        const circleEdges = cloneDeep(data.circleedges);
        const currentIndex = get(currentIndexAtom);
        const edgeType = get(edgeTypeAtom);
        const orderType = get(orderTypeAtom);
        const colors = get(colorsAtom)
        const cmColors = get(cmColorsAtom)

        const drad = get(dradius)
        const dor = get(dOuterRadius)

        // const getOrientation = (a, b, c) => {
        //     var val = ((b[1]-a[1])*(c[0]-b[0]))-((b[0]-a[0])*(c[1]-b[1]));
        //     if (val === 0) { return 0; } // collinear
        //     else if (val < 0) { return 2; } // anti-clockwise
        //     else { return 1; }  //clockwise
        // }

        // const onLine = (l1, p) => { //check whether p is on the line or not
        //     if(p[0] <= Math.max(l1[0][0], l1[1][0]) && p[0] <= Math.min(l1[0][0], l1[1][0]) &&
        //             (p[1] <= Math.max(l1[0][1], l1[1][1]) && p[1] <= Math.min(l1[0][1], l1[1][1])))
        //         { return true; }
        //     return false;
        // }

        // const checkIntersection = (l1, l2) => {
        //     const dir1 = getOrientation(l1[0], l1[1], l2[0]);
        //     const dir2 = getOrientation(l1[0], l1[1], l2[1]);
        //     const dir3 = getOrientation(l2[0], l2[1], l1[0]);
        //     const dir4 = getOrientation(l2[0], l2[1], l1[1]);

        //     if(dir1 != dir2 && dir3 != dir4) { return true; } //they are intersecting
        //     if(dir1==0 && onLine(l1, l2[0])) { return true; } //when p2 of line2 are on the line1
        //     if(dir2==0 && onLine(l1, l2[1])) { return true; } //when p1 of line2 are on the line1
        //     if(dir3==0 && onLine(l2, l1[0])) { return true; } //when p2 of line1 are on the line2
        //     if(dir4==0 && onLine(l2, l1[1])) { return true; } //when p1 of line1 are on the line2
        //     return false;
        // }

        // const computeEdgeCrossings = (circle_edges) => {
        //     const bucket_0 = []
        //     const bucket_1 = []
        //     const bucket_2 = []
        //     const bucket_3 = []
        //     const ec_count = [0,0,0,0];
        //     for(var e=0; e<circle_edges.length; e++) {
        //         if(circle_edges[e].bucket == 0)
        //             bucket_0.push(circle_edges[e])
        //         else if(circle_edges[e].bucket == 1)
        //             bucket_1.push(circle_edges[e])
        //         else if(circle_edges[e].bucket == 2)
        //             bucket_2.push(circle_edges[e])
        //         else if(circle_edges[e].bucket == 3)
        //             bucket_3.push(circle_edges[e])
        //     }
        //     for(var i = 0; i<4; i++) {
        //         var bucket;
        //         var ec;
        //         if(i == 0) {
        //             bucket = bucket_0;
        //             ec = 0;
        //         }
        //         else if(i==1) { 
        //             bucket = bucket_1;
        //             ec = 1;
        //         }
        //         else if(i==2) {
        //             bucket = bucket_2;
        //             ec = 2;
        //         }
        //         else  { 
        //             bucket = bucket_3;
        //             ec = 3;
        //         }
        //         for(var j=0; j<bucket.length; j++) {
        //             for(var k=j+1; k<bucket.length; k++) {
        //                 if(bucket[j].x2 == bucket[k].x2 && bucket[j].y2 == bucket[k].y2) {}
        //                 else {
        //                     if( checkIntersection( [[bucket[j].x1, bucket[j].y1], [bucket[j].x2, bucket[j].y2]], 
        //                                             [[bucket[k].x1, bucket[k].y1], [bucket[k].x2, bucket[k].y2]] ) == true ) 
        //                         {ec_count[ec] +=1 ;}
        //                 }
        //             }
        //         }
        //     }
        //     return ec_count;                    
        // }

        const getBarycentricOrdering = (nodes_list, circle_edges, matrix_nodes) => {
            const bucket_0 = []
            const bucket_1 = []
            const bucket_2 = []
            const bucket_3 = []

            const total_matrix_nodes = matrix_nodes.length;
            for (let i = 0; i < nodes_list.length; i++) {
                let numerator = 0
                let denominator = 0
                for (let j = 0; j < circle_edges.length; j++) {
                    if (circle_edges[j].source === nodes_list[i].name) {
                        let target_node_id = 0;
                        for (let k = 0; k < matrix_nodes.length; k++) {
                            if (matrix_nodes[k]["name"] === circle_edges[j].target) {
                                if (nodes_list[i].bucket === 0 || nodes_list[i].bucket === 1) {
                                    target_node_id = matrix_nodes[k]["index"]+1;
                                }
                                else {
                                    target_node_id = total_matrix_nodes - matrix_nodes[k]["index"];
                                }                                        
                            }
                        }
                        numerator = numerator + target_node_id;
                        denominator = denominator + 1;
                    }
                }
                nodes_list[i]["barycentre"] = (numerator/denominator); // Handle the case when denominator = 0
                if(nodes_list[i].bucket === 0)
                    bucket_0.push(nodes_list[i])
                else if(nodes_list[i].bucket === 1)
                    bucket_1.push(nodes_list[i])
                else if(nodes_list[i].bucket === 2)
                    bucket_2.push(nodes_list[i])
                else if(nodes_list[i].bucket === 3)
                    bucket_3.push(nodes_list[i])
            }
            bucket_0.sort((a, b) => a.barycentre - b.barycentre); 
            bucket_1.sort((a, b) => a.barycentre - b.barycentre); 
            bucket_2.sort((a, b) => a.barycentre - b.barycentre); 
            bucket_3.sort((a, b) => a.barycentre - b.barycentre);
            const barycentric_ordering = bucket_0.concat(bucket_1, bucket_2, bucket_3);
            return barycentric_ordering; 
        }

        let finalCircleNodes = []
        // const c_nodes_deg_dict = {};
        // for (let i = 0; i < circleEdges.length; i++) {
        //     if (circleEdges[i].source in c_nodes_deg_dict) 
        //         c_nodes_deg_dict[circleEdges[i].source] += 1;
        //     else 
        //         c_nodes_deg_dict[circleEdges[i].source] = 1;
        // }
        // for (let i = 0; i < circleNodes.length; i++) 
        //         if (!(circleNodes[i].name in c_nodes_deg_dict))
        //             c_nodes_deg_dict[circleNodes[i].name] = 0
        // const c_nodes_deg = Object.keys(c_nodes_deg_dict).map(
        //     key => [key, c_nodes_deg_dict[key]]
        // ); 
        // c_nodes_deg.sort((first, second) => first[1] - second[1]);
        // const ordered_c_nodes = [];
        // for (let i = 0; i < circleNodes.length; i++) 
        //     ordered_c_nodes.push({"name": c_nodes_deg[i][0]});
        // let segment_nodes = Math.floor(circleNodes.length / 4);
        // let rem_nodes = circleNodes.length % 4;
        // let v_1 = 0, v_2 = 0;
        // const shuffled_c_nodes = [];
        // for (let i = 0; i < circleNodes.length; i++) {
        //     let v = v_1 + (v_2 * 4);
        //     if (v_1 < 4 && v_2 >= segment_nodes) {
        //         if (rem_nodes > 0) {
        //             ordered_c_nodes[v]["bucket"] = v_1
        //             shuffled_c_nodes.push(ordered_c_nodes[v]);
        //             rem_nodes -=1;
        //         }
        //         v_2 = 0;
        //         v_1 += 1;
        //     }
        //     v = v_1 + (v_2 * 4);
        //     if (v_1 < 4) {
        //         ordered_c_nodes[v]["bucket"] = v_1
        //         shuffled_c_nodes.push(ordered_c_nodes[v]);
        //     }
        //     v_2 += 1;
        // }

        const ordered_c_nodes = [];
        const lexico_c_nodes = [];
        const deg_c_nodes = {};
        circleNodes.forEach(e => {
            ordered_c_nodes.push({name: e.name, rank: e.rank, geneSource: e.geneSource})
            lexico_c_nodes.push({name: e.name, rank: e.rank, geneSource: e.geneSource})
            let cnt = 0;
            circleEdges.forEach(f => f.source === e.name ? cnt += 1 : null)
            deg_c_nodes[e.name] = cnt;
        })
        ordered_c_nodes.sort((a, b) => deg_c_nodes[a.name] - deg_c_nodes[b.name] === 0 ? a.rank - b.rank : deg_c_nodes[a.name] - deg_c_nodes[b.name])
        lexico_c_nodes.sort((a, b) => a.name.localeCompare(b.name))
        const shuffled_c_nodes = shuffle(ordered_c_nodes)

        // if (edgeType === 2) {
        //     if (orderType === 1) {
        //         const barycentric_c_nodes = getBarycentricOrdering(shuffled_c_nodes, circleEdges, nodes);
        //         finalCircleNodes = barycentric_c_nodes;
        //     }
        //     else if (orderType === 2) finalCircleNodes = ordered_c_nodes;
        //     else if (orderType === 3) finalCircleNodes = shuffled_c_nodes;
        // } else {
        if (orderType === 1) finalCircleNodes = ordered_c_nodes;
        else if (orderType === 2) finalCircleNodes = shuffled_c_nodes;
        else if (orderType === 3) finalCircleNodes = lexico_c_nodes;
        // }

        const currentIndexCount = Object.keys(currentIndex).length;
        const numNodes = finalCircleNodes.length;
        const range = Math.PI * 2;
        const radianSepration = range / numNodes;

        finalCircleNodes.forEach((node, i) => {
            node.radians = i * radianSepration;
            node.degrees = radiansToDegrees(node.radians); // degree
            let bucket = 0;
            if ((node.degrees > 45) && (node.degrees <= 135)) bucket = 1;
            else if ((node.degrees > 135) && (node.degrees <= 225)) bucket = 2;
            else if ((node.degrees > 225) && (node.degrees <= 315)) bucket = 3;
            node.bucket = bucket;
            node.x = radiansToX(node.radians, drad); // cx
            node.y = radiansToY(node.radians, drad); // cy
        })

        if (edgeType === 2) {
            if (orderType === 1) {
                const barycentric_c_nodes = getBarycentricOrdering(shuffle(finalCircleNodes), circleEdges, nodes);
                finalCircleNodes = barycentric_c_nodes;
            }
        }

        const dict = [];
        let minDegree = 10
        let maxDegree = 0
        finalCircleNodes.forEach(node => {
            let count = 0;
            circleEdges.forEach(edgex => {
                if (edgex.source === node.name) {
                    count += 1;
                }
            })
            const di = {};
            di[node.name] = count;
            dict.push(di);
            node.nodeDegree = count; //nodeDegree
            minDegree = Math.min(node.nodeDegree, minDegree)
            maxDegree = Math.max(node.nodeDegree, maxDegree)
        })
        finalCircleNodes.forEach(node => {
            let radI = 2;
            // const totalItems = data.nodes.length;
            // dict.forEach(dValue => {
            //     const nodeName = Object.keys(dValue)[0];
            //     if (nodeName === node.name) {
            //         const checkVal1 = (20 * totalItems) / 100;
            //         const checkVal2 = (80 * totalItems) / 100;
            //         if (dValue[nodeName] <= checkVal1) {
            //             radI = checkVal1
            //         }
            //         else if (dValue[nodeName] > checkVal2) {
            //             radI = checkVal2
            //         }
            //         else {
            //             radI = totalItems / 2
            //         }
            //     }
            // })
            if (minDegree >= maxDegree) node.r = 2;
            else node.r = ((node.nodeDegree - minDegree) / (maxDegree - minDegree)) * radI + 2; // r
        })
        finalCircleNodes.forEach(node => {
            node.text_anchor = (Math.sin(node.radians) < 0) ? 'end' : 'begin';
            node.dx = (Math.sin(node.radians) < 0) ? '-1em' : '1em';
            let degrees = node.degrees - 90;
            let xTranslate = drad;
            if (Math.sin(node.radians) < 0) {
                degrees -= 180;
                xTranslate *= -1;
            }
            node.transform = 'rotate(' + degrees + ') translate(' + xTranslate + ', 0)';
            node.fillStroke = cmColors.circlenodes
        })
        const nodeDict = {}
        finalCircleNodes.forEach(node => {
            nodeDict[node.name] = {
                degree: node.degrees,
                x: node.x,
                y: node.y,
                r: node.r
            }
        })
        
        // console.log(nodeDict)
        circleEdges.forEach(edge => {
            const idx = currentIndex[edge.target];
            edge.stroke = colors[edge.target];
            edge.x1 = nodeDict[edge.source].x + dor;
            edge.y1 = nodeDict[edge.source].y + dor;
            const checkDegree = nodeDict[edge.source].degree;
            let x2 = matrixScale(matrix[idx][idx].x) + drad;
            if (checkDegree > 225 && checkDegree <= 305) {
                x2 = (x2 - ((width / currentIndexCount) * idx)); // Left
            }
            else if (checkDegree >= 45 && checkDegree < 135) {
                x2 = (x2 + width - ((width / currentIndexCount) * idx)); //Right
            }
            else {
                x2 = (x2 + (width / currentIndexCount) * 0.5);
            }
            let y2 = matrixScale(matrix[idx][idx].y) + drad;
            if (checkDegree >= 135 && checkDegree <= 225) {
                y2 = (y2 + height); // Bottom
            }
            else if ((checkDegree > 225 && checkDegree <= 305) || (checkDegree >= 45 && checkDegree < 135)) {
                y2 = (y2 + (height / currentIndexCount) * (idx + 0.5)); //left & right
            }
            let bucket = 0;
            if ((checkDegree > 45) && (checkDegree <= 135)) bucket = 1;
            else if ((checkDegree > 135) && (checkDegree <= 225)) bucket = 2;
            else if ((checkDegree > 225) && (checkDegree <= 315)) bucket = 3;
            edge.x2 = x2 + (width / 4);
            edge.y2 = y2 - matrixScale(idx) + (height / 4);
            edge.bucket = bucket;
        })

        if (edgeType === 2) {    
            let combinedNodesRes = {};
            let combinedEdgesRes = [];
            for (let i = 0; i < finalCircleNodes.length; i++) {
                combinedNodesRes[finalCircleNodes[i].name] = {
                    "x": finalCircleNodes[i].x + dor + margin.top, 
                    "y": finalCircleNodes[i].y + dor + margin.left
                };
            }
            for (let i = 0; i < nodes.length; i++) {
                let x =  matrixScale(matrix[i][i].x) + margin.left + dor - (width/2) + matrixScale.bandwidth()/2;
                let y =  matrixScale(matrix[i][i].x) + margin.top + dor - (height/2) + matrixScale.bandwidth()/2;

                combinedNodesRes[nodes[i].name+"0"] = {"x": x, "y": margin.left + dor - height/2};
                
                combinedNodesRes[nodes[i].name+"1"] = {"x": margin.left + dor + width/2, "y": y};
                
                combinedNodesRes[nodes[i].name+"2"] = {"x": x, "y": margin.left + dor + height/2};
                
                combinedNodesRes[nodes[i].name+"3"] = {"x": margin.left + dor - width/2, "y": y};
            }
            for (let i = 0; i < circleEdges.length; i++) {
                let tgt = "";
                if (circleEdges[i].bucket === 0) {tgt = circleEdges[i].target+"0";}
                else if (circleEdges[i].bucket === 1) {tgt = circleEdges[i].target+"1";}
                else if (circleEdges[i].bucket === 2) {tgt = circleEdges[i].target+"2";}
                else if (circleEdges[i].bucket === 3) {tgt = circleEdges[i].target+"3";}

                combinedEdgesRes.push({
                    "source": tgt, 
                    "target": circleEdges[i].source, 
                    "target_color": circleEdges[i].target
                });
            }
            // @ts-ignore
            const fbundling = ForceEdgeBundling()
                        .nodes(combinedNodesRes)
                        .edges(combinedEdgesRes);
            const results = fbundling();
            results.forEach(e => {
                e.stroke = colors[e["info"].target_color]
            })

            return [finalCircleNodes, results]
        }
        return [finalCircleNodes, circleEdges]
    }
})
