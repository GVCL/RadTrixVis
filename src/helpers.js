export const radiansToDegrees = radians => (radians / Math.PI) * 180;

export const radiansToX = (radians, radius) => Math.sin(radians) * radius;

export const radiansToY = (radians, radius) => Math.cos(radians) * -radius;

export const getIndex = { 'BRCA': 0, 'KICH': 1, 'KIRC': 2, 'KIRP': 3, 'LUSC': 4, 'PAAD': 5, 'STAD': 6 };
export const color = { 0: '#66c2a5', 1: '#fc8d62', 2: '#8da0cb', 3: '#e78ac3', 4: '#a6d854', 5: '#ffd92f', 6: '#e5c494' };
export const defaultColors = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#e5c494','#b3b3b3'] 
export const labels = {
    circlenodes: 'Circle Nodes',
    matrixDiagonal: 'Matrix Diagonal',
    matrixNonDiagonal: 'Matrix Non Diagonal'
}

//For Matrix
export const margin = { top: 200, right: 200, bottom: 200, left: 200 }, width = 100, height = 100;
// For Circles
export const radius = 550, Cmargin = 75, outerRadius = radius + Cmargin;

/*
        let finalCircleNodes = []
        const c_nodes_deg_dict = {};
        for (let i = 0; i < circleEdges.length; i++) {
            if (circleEdges[i].source in c_nodes_deg_dict) 
                c_nodes_deg_dict[circleEdges[i].source] += 1;
            else 
                c_nodes_deg_dict[circleEdges[i].source] = 1;
        }
        for (let i = 0; i < circleNodes.length; i++) 
                if (!(circleNodes[i].name in c_nodes_deg_dict))
                    c_nodes_deg_dict[circleNodes[i].name] = 0
        const c_nodes_deg = Object.keys(c_nodes_deg_dict).map(
            key => [key, c_nodes_deg_dict[key]]
        ); 
        c_nodes_deg.sort((first, second) => first[1] - second[1]);
        const ordered_c_nodes = [];
        for (let i = 0; i < circleNodes.length; i++) 
            ordered_c_nodes.push({"name": c_nodes_deg[i][0]});
        let segment_nodes = Math.floor(circleNodes.length / 4);
        let rem_nodes = circleNodes.length % 4;
        let v_1 = 0, v_2 = 0;
        const shuffled_c_nodes = [];
        for (let i = 0; i < circleNodes.length; i++) {
            let v = v_1 + (v_2 * 4);
            if (v_1 < 4 && v_2 >= segment_nodes) {
                if (rem_nodes > 0) {
                    ordered_c_nodes[v]["bucket"] = v_1
                    shuffled_c_nodes.push(ordered_c_nodes[v]);
                    rem_nodes -=1;
                }
                v_2 = 0;
                v_1 += 1;
            }
            v = v_1 + (v_2 * 4);
            if (v_1 < 4) {
                ordered_c_nodes[v]["bucket"] = v_1
                shuffled_c_nodes.push(ordered_c_nodes[v]);
            }
            v_2 += 1;
        }
        if (edgeType === 2) {
            if (orderType === 1) {
                const barycentric_c_nodes = getBarycentricOrdering(shuffled_c_nodes, circleEdges, nodes);
                finalCircleNodes = barycentric_c_nodes;
            }
            else if (orderType === 2) finalCircleNodes = ordered_c_nodes;
            else if (orderType === 3) finalCircleNodes = shuffled_c_nodes;
        } else {
            if (orderType === 1 || orderType === 3) finalCircleNodes = ordered_c_nodes;
            else finalCircleNodes = shuffled_c_nodes;
        }
*/

/*
        let finalCircleNodes = []
        if (edgeType === 2) {
            const c_nodes_deg_dict = {};
            for (let i = 0; i < circleEdges.length; i++) {
                if (circleEdges[i].source in c_nodes_deg_dict) 
                    c_nodes_deg_dict[circleEdges[i].source] += 1;
                else 
                    c_nodes_deg_dict[circleEdges[i].source] = 1;
            }
            for (let i = 0; i < circleNodes.length; i++) 
                if (!(circleNodes[i].name in c_nodes_deg_dict))
                    c_nodes_deg_dict[circleNodes[i].name] = 0
            const c_nodes_deg = Object.keys(c_nodes_deg_dict).map(
                key => [key, c_nodes_deg_dict[key]]
            ); 
            c_nodes_deg.sort((first, second) => first[1] - second[1]);
            const ordered_c_nodes = [];
            for (let i = 0; i < circleNodes.length; i++) 
                ordered_c_nodes.push({"name": c_nodes_deg[i][0]});
            let segment_nodes = Math.floor(circleNodes.length / 4);
            let rem_nodes = circleNodes.length % 4;
            let v_1 = 0, v_2 = 0;
            const shuffled_c_nodes = [];
            for (let i = 0; i < circleNodes.length; i++) {
                let v = v_1 + (v_2 * 4);
                if (v_1 < 4 && v_2 >= segment_nodes) {
                    if (rem_nodes > 0) {
                        ordered_c_nodes[v]["bucket"] = v_1
                        shuffled_c_nodes.push(ordered_c_nodes[v]);
                        rem_nodes -=1;
                    }
                    v_2 = 0;
                    v_1 += 1;
                }
                v = v_1 + (v_2 * 4);
                if (v_1 < 4) {
                    ordered_c_nodes[v]["bucket"] = v_1
                    shuffled_c_nodes.push(ordered_c_nodes[v]);
                }
                v_2 += 1;
            }
            const barycentric_c_nodes = getBarycentricOrdering(shuffled_c_nodes, circleEdges, nodes);
            if (orderType === 1) finalCircleNodes = barycentric_c_nodes;
            else if (orderType === 2) finalCircleNodes = ordered_c_nodes;
            else if (orderType === 3) finalCircleNodes = shuffled_c_nodes;
        } else {
            finalCircleNodes = circleNodes;
        }
*/