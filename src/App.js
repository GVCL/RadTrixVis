import './App.css';
import React from 'react';
import RadTrix from './RadTrix';
import { Button, Col, Collapse, ColorPicker, Input, InputNumber, Layout, PageHeader, Popover, Radio, Row, Select, Tag, Transfer, Typography, Upload, message } from 'antd';
import { CopyrightOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { color, labels } from './helpers';
import Papa from 'papaparse';
import { data as data2 } from './data2';
import { data as data3 } from './data3';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { circleNodeSortedIdx, circleSelector, currentIndexAtom, dataAtom, edgeTypeAtom, fullDataAtom, orderTypeAtom, getIndexSelector, optionsSelector, colorsAtom, cmColorsAtom } from './state';
import { cloneDeep, range, intersection } from 'lodash';

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;
const { Option } = Select;
const { Title, Text } = Typography;

// const headerStyle = {
//     textAlign: 'center',
//     // color: '#fff',
//     height: 64,
//     paddingInline: 48,
//     lineHeight: '64px',
//     backgroundColor: '#f5f5f5',
//     background: '#223a5f',
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: '24px',
//     fontFamily: 'Arial, sans-serif',
// };

// const contentStyle = {
//     // textAlign: 'center',
//     // minHeight: 120,
//     // lineHeight: '120px',
//     // color: '#fff',
//     backgroundColor: '#f5f5f5',
// };

const siderStyle = {
    // textAlign: 'center',
    // lineHeight: '120px',
    // color: '#fff',
    backgroundColor: '#f0f2f5',
    fontSize: '16px',
    margin: '5px',
    fontFamily: 'Arial, sans-serif',
};

// const footerStyle = {
//     textAlign: 'center',
//     // color: '#fff',
//     backgroundColor: '#f5f5f5',
// };

const headerStyle = {
    background: '#223a5f',
    color: '#fff',
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
};
  
// const siderStyle = {
//     background: '#f0f2f5',
//     color: '#223a5f',
//     fontSize: '16px',
//     fontFamily: 'Georgia, serif',
// };
  
const contentStyle = {
    background: '#f9fafc',
    color: '#223a5f',
    fontSize: '18px',
    fontFamily: 'Roboto, sans-serif',
};
  
const footerStyle = {
    background: '#223a5f',
    color: '#fff',
    textAlign: 'center',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
};

const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
};

let check = -1;

function App() {
    
    const getIndex = useRecoilValue(getIndexSelector);
    const [colors, setColors] = useRecoilState(colorsAtom);
    const [cmColors, setCMColors] = useRecoilState(cmColorsAtom);
    const options = useRecoilValue(optionsSelector);

    const rankOptions = [
        {
            value: 'Rank Based',
            label: 'Rank Based',
            key: '1'
        },
        {
            key: '2',
            label: 'Lexicographic Based',
            value: 'Lexicographic Based'
        }
    ]

    const renderTag = v => {
        return (
            // <span style={{color: color[v.value], backgroundColor: '#f5f5f5', padding: '4px', margin: '4px', borderRadius: '10px'}}>
            //     {v.label} 
            // </span>
            <Tag
                style={{background: colors[v.value]}}
            >
                {v.label}
            </Tag>
        )
    }
    const downloadJsonFile = () => {
        const jsonStr = JSON.stringify(saveData, null, 2); // Adding indentation (2 spaces)
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // Function to convert data to CSV format
    function convertToCSV(data) {
        const headers = Object.keys(data[0]); // Assuming first object has all keys
        const csvRows = [headers.join(',')]; // Add header row
        data.forEach(row => {
            const csvRow = headers.map(header => row[header] ? row[header].toString() : '');
            csvRows.push(csvRow.join(','));
        });
        return csvRows.join('\n');
    }
    const downloadCsvFile = () => {
        const processedNodes = Object.fromEntries(circleNodes.map(e => [e.name, {degree: e.nodeDegree, rank: e.rank, geneSource: e.geneSource}]))
        const csvEntries = circleEdges.map(e => {
            return {
                source: e.source,
                target: e.target,
                rank: processedNodes[e.source].rank,
                degree: processedNodes[e.source].degree,
                geneSource: processedNodes[e.source].geneSource
            }
        })
        const csvContent = convertToCSV(csvEntries); // Convert data to CSV format
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };
    
    const [fullData, setFullData] = useRecoilState(fullDataAtom)
    const [selectedData, setSelectedData] = React.useState(1)
    const [fileContent, setFileContent] = React.useState({format: 'json', content: data3})

    const selectedDataCallback = (e) => {
        setSelectedData(e.target.value)
        if (e.target.value !== 3) {
            setFileContent(e.target.value === 1 ? {format: 'json', content: data3} : {format: 'json', content: data2})
        }
    }

    const parseCSV = (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (result) => {
                    resolve(result.data);
                },
                error: (error) => {
                    reject(error);
                },
                header: true, // Assuming CSV has a header row
            });
        });
    };

    const parseJSON = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    };

    const handleUpload = async (info) => {
        const { status, originFileObj } = info.file;
        if (status !== 'done') {
            // message.error(`${info.file.name} file upload failed.`);
            return;
        }
        try {
            let parsedData;
            if (info.file.type === 'text/csv' || info.file.name.endsWith('.csv')) {
                parsedData = await parseCSV(originFileObj);
                console.log('Parsed CSV data:', parsedData);
                setFileContent({
                    format: 'csv',
                    content: parsedData
                })
            } else if (info.file.type === 'application/json' || info.file.name.endsWith('.json')) {
                parsedData = await parseJSON(originFileObj);
                console.log('Parsed JSON data:', parsedData);
                setFileContent({
                    format: 'json',
                    content: parsedData
                })
            } else {
                message.error('Unsupported file type!');
                return;
            }
            // Process the parsed data as needed
        } catch (error) {
            console.error('Error parsing file:', error);
            message.error('Error parsing file.');
        }
    }
    

    const transferData = fullData.circlenodes.map(e => {
        return {
            key: e.name,
            title: `${e.name} (Rank: ${e.rank})`,
            chosen: 0
        }
    })
    
    const cnsi = useRecoilValue(circleNodeSortedIdx)
    const [selOpt, setSelOpt] = React.useState(range(options.length));
    const [selTransfer, setSelTransfer] = React.useState(fullData.circlenodes.map(e => e.name));
    const [saveData, setData] = useRecoilState(dataAtom);
    const setCurrentIndex = useSetRecoilState(currentIndexAtom);
    const [edgeType, setEdgeType] = useRecoilState(edgeTypeAtom);
    const [orderType, setOrderType] = useRecoilState(orderTypeAtom);
    const [topK, setTopK] = React.useState(Math.min(100, fullData.circlenodes.length));
    const [rankType, setRankType] = React.useState(rankOptions[0].value);
    const [minRank, setMinRank] = React.useState(1)
    const [maxRank, setMaxRank] = React.useState(100)
    const [stepSize, setStepSize] = React.useState(1)
    const [circleNodes, circleEdges] = useRecoilValue(circleSelector);

    // React.useEffect(() => {
    //     const newData = cloneDeep(data);

    //     const targets = selOpt.map(e => Object.keys(getIndex).find(f => getIndex[f] === e));
    //     const targetsSet = new Set(targets);

    //     const validEdges = newData.circleedges.filter(e => targetsSet.has(e.target));


    // }, [selOpt])

    const changeMainData = React.useCallback(() => {
        if (fileContent.format === 'json') {
            setFullData(fileContent.content)
            setSelTransfer(fileContent.content.circlenodes.map(e => e.name))
            setTopK(Math.min(100, fileContent.content.circlenodes.length))
            setSelOpt(range(fileContent.content.nodes.length))
            setColors(fileContent.content.nodes.reduce((a, e) => {
                a[e.index] = colors[e.index % colors.length]
                return a
            }, {}))
        } else if (fileContent.format === 'csv') {
            const parsedData = cloneDeep(fileContent.content);

            const circleNodesSet = new Set();
            parsedData.forEach(row => {
                const { source, rank, geneSource } = row;
                circleNodesSet.add(`${source}_${rank}_${geneSource}`)
            })
            const circleNodes = [...circleNodesSet].map(e => {
                const [name, rank, geneSource] = e.split('_');
                return {
                    name,
                    rank,
                    geneSource
                }
            })

            const uniqueTargets = [...new Set(parsedData.map(row => row.target))].sort();
            const nodes = uniqueTargets.map((e, i) => {
                return {
                    index: i,
                    name: e
                }
            })

            const circleEdges = parsedData.map(row => {
                const { source, target } = row;
                return { source, target }
            });

            const sourcesPerTarget = new Map();
            parsedData.forEach(row => {
                const { source, target } = row;
                // If the target is not already in the map, create a new set for it
                if (!sourcesPerTarget.has(target)) {
                    sourcesPerTarget.set(target, new Set());
                }
                // Add the source to the set for the current target
                sourcesPerTarget.get(target).add(source);
            });

            const links = []
            nodes.forEach(e => {
                nodes.forEach(f => {
                    links.push({
                        source: e.index,
                        target: f.index, 
                        value: e.index === f.index ? sourcesPerTarget.get(e.name).size : new Set(intersection([...sourcesPerTarget.get(e.name)], [...sourcesPerTarget.get(f.name)])).size
                    })
                })
            })

            const jsonData = {
                nodes: nodes,
                links: links,
                circlenodes: circleNodes,
                circleedges: circleEdges
            }

            setFullData(jsonData)
            setSelTransfer(jsonData.circlenodes.map(e => e.name))
            setTopK(Math.min(100, jsonData.circlenodes.length))
            setSelOpt(range(jsonData.nodes.length))
            setColors(jsonData.nodes.reduce((a, e) => {
                a[e.index] = colors[e.index % colors.length]
                return a
            }, {}))
        }
    }, [fileContent])

    React.useEffect(() => {
        const newData = cloneDeep(fullData);

        // Handling Changes to Circle Nodes
        if (check === 1 || check === -1) {
            newData.circlenodes = newData.circlenodes.filter(e => selTransfer.findIndex(f => f === e.name) !== -1);
            newData.circleedges = newData.circleedges.filter(e => selTransfer.findIndex(f => f === e.source) !== -1);
        }

        // Handling the changes to the Square Nodes
        newData.nodes = newData.nodes.filter(e => selOpt.findIndex(f => f === e.index) !== -1);
        newData.links = newData.links.filter(e => (selOpt.findIndex(f => f === e.source) !== -1) && (selOpt.findIndex(f => f === e.target) !== -1));
        const selNames = selOpt.map(e => Object.keys(getIndex).find(f => getIndex[f] === e));
        newData.circleedges = newData.circleedges.filter(e => selNames.findIndex(f => f === e.target) !== -1);

        const indexMap = {};
        const currentIndex = {};
        newData.nodes.forEach((e, i) => {
            indexMap[e.index] = i;
            e.index = i;
            currentIndex[e.name] = e.index;
        })
        newData.links.forEach(e => {
            e.source = indexMap[e.source];
            e.target = indexMap[e.target];
        });

        newData.circlenodes = newData.circlenodes.filter(e => {
            let cnt = 0;
            newData.circleedges.forEach(f => f.source === e.name ? cnt += 1 : null)
            if (cnt === 0) return false;
            return true;
        })

        const processList = (d) => {
            const result = {};
        
            for (let i = 0; i < d.length; i++) {
                const target1 = d[i].target;

                result[`${target1},${target1}`] = {
                    source: currentIndex[target1],
                    target: currentIndex[target1],
                    value: newData.circleedges.filter(e => e.target === target1).length,
                };
            
                for (let j = i + 1; j < d.length; j++) {
                    const target2 = d[j].target;
            
                    if (target1 !== target2) {
                        if (!result[`${target1},${target2}`]) {
                            result[`${target1},${target2}`] = {
                                source: currentIndex[target1],
                                target: currentIndex[target2],
                                value: 0,
                            };
                        }
                        if (!result[`${target2},${target1}`]) {
                            result[`${target2},${target1}`] = {
                                source: currentIndex[target2],
                                target: currentIndex[target1],
                                value: 0,
                            };
                        }
                        if (d[i].source === d[j].source) {
                            result[`${target1},${target2}`].value += 1;
                            result[`${target2},${target1}`].value += 1;
                        }
                    }
                }
            }
        
            return Object.values(result).sort((a, b) => a.source === b.source ? a.target - b.target : a.source - b.source);
        };    

        newData.links = processList(newData.circleedges)

        if (newData.circlenodes.length !== selTransfer.length) {
            setSelTransfer(newData.circlenodes.map(e => e.name))
        }

        setData(newData);
        setCurrentIndex(currentIndex);

        if (check === -1) {
            check = 1
            topKGenesSelector()
        }
    }, [selOpt, selTransfer, fullData, setData, setCurrentIndex]);

    const topKGenesSelector = () => {
        check = 1
        const newData = cloneDeep(fullData);

        // Handling the changes to the Square Nodes
        newData.nodes = newData.nodes.filter(e => selOpt.findIndex(f => f === e.index) !== -1);
        newData.links = newData.links.filter(e => (selOpt.findIndex(f => f === e.source) !== -1) && (selOpt.findIndex(f => f === e.target) !== -1));
        const selNames = selOpt.map(e => Object.keys(getIndex).find(f => getIndex[f] === e));
        newData.circleedges = newData.circleedges.filter(e => selNames.findIndex(f => f === e.target) !== -1);
        const indexMap = {};
        const currentIndex = {};
        newData.nodes.forEach((e, i) => {
            indexMap[e.index] = i;
            e.index = i;
            currentIndex[e.name] = e.index;
        })
        newData.links.forEach(e => {
            e.source = indexMap[e.source];
            e.target = indexMap[e.target];
        });
        newData.circlenodes = newData.circlenodes.filter(e => {
            let cnt = 0;
            newData.circleedges.forEach(f => f.source === e.name ? cnt += 1 : null)
            if (cnt === 0) return false;
            return true;
        });
        newData.circlenodes = newData.circlenodes.slice(0, Math.min(topK, newData.circlenodes.length))
        // console.log(newData.circlenodes)
        newData.circleedges = newData.circleedges.filter(e => newData.circlenodes.findIndex(f => f.name === e.source) !== -1);
        
        // console.log(newData)

        setSelTransfer(newData.circlenodes.map(e => e.name))
        
        setData(newData);
        setCurrentIndex(currentIndex);
    }

    const parseArrString = str => {
        try {
            const ranges = str.split(",")
            // console.log(ranges)
            const res = ranges.reduce((acc, rangeStr) => {
                const [start, stop, step] = rangeStr.split(":").map(Number);
                if (stop >= start) {
                    for (let i = start; i <= stop; i += step) {
                        acc.push(i - 1);
                    }
                }
                return acc
            }, [])
            // console.log("Res:", res)
            const uniqueRes = [...new Set(res)]
            uniqueRes.sort((a, b) => a - b)
            return uniqueRes
        } catch {
            return []
        }
    }

    const rankGenesSelector = () => {
        check = 1
        const circleNodeRanks = parseArrString(`${minRank}:${maxRank}:${stepSize}`)
        // console.log(circleNodeRanks)
        if (circleNodeRanks.length < 4) {
            alert('Please enter valid string and ensure atleast 4 valid genes.')
            return
        }

        const newData = cloneDeep(fullData);

        // Handling the changes to the Square Nodes
        newData.nodes = newData.nodes.filter(e => selOpt.findIndex(f => f === e.index) !== -1);
        newData.links = newData.links.filter(e => (selOpt.findIndex(f => f === e.source) !== -1) && (selOpt.findIndex(f => f === e.target) !== -1));
        const selNames = selOpt.map(e => Object.keys(getIndex).find(f => getIndex[f] === e));
        newData.circleedges = newData.circleedges.filter(e => selNames.findIndex(f => f === e.target) !== -1);
        const indexMap = {};
        const currentIndex = {};
        newData.nodes.forEach((e, i) => {
            indexMap[e.index] = i;
            e.index = i;
            currentIndex[e.name] = e.index;
        })
        newData.links.forEach(e => {
            e.source = indexMap[e.source];
            e.target = indexMap[e.target];
        });
        newData.circlenodes = newData.circlenodes.filter(e => {
            let cnt = 0;
            newData.circleedges.forEach(f => f.source === e.name ? cnt += 1 : null)
            if (cnt === 0) return false;
            return true;
        });
        newData.circlenodes = newData.circlenodes.filter((_, i) => circleNodeRanks.includes(i))
        newData.circleedges = newData.circleedges.filter(e => newData.circlenodes.findIndex(f => f.name === e.source) !== -1);

        setSelTransfer(newData.circlenodes.map(e => e.name))
        
        setData(newData);
        setCurrentIndex(currentIndex);
    }

    const lexGeneSelector = () => {
        check = 1
        const lexNodeRanks = parseArrString(`${minRank}:${maxRank}:${stepSize}`)

        const circleNodeRanks = lexNodeRanks.map(i => cnsi[i][0])
        // console.log(circleNodeRanks)
        if (circleNodeRanks.length < 4) {
            alert('Please enter valid string and ensure atleast 4 valid genes.')
            return
        }

        const newData = cloneDeep(fullData);

        // Handling the changes to the Square Nodes
        newData.nodes = newData.nodes.filter(e => selOpt.findIndex(f => f === e.index) !== -1);
        newData.links = newData.links.filter(e => (selOpt.findIndex(f => f === e.source) !== -1) && (selOpt.findIndex(f => f === e.target) !== -1));
        const selNames = selOpt.map(e => Object.keys(getIndex).find(f => getIndex[f] === e));
        newData.circleedges = newData.circleedges.filter(e => selNames.findIndex(f => f === e.target) !== -1);
        const indexMap = {};
        const currentIndex = {};
        newData.nodes.forEach((e, i) => {
            indexMap[e.index] = i;
            e.index = i;
            currentIndex[e.name] = e.index;
        })
        newData.links.forEach(e => {
            e.source = indexMap[e.source];
            e.target = indexMap[e.target];
        });
        newData.circlenodes = newData.circlenodes.filter(e => {
            let cnt = 0;
            newData.circleedges.forEach(f => f.source === e.name ? cnt += 1 : null)
            if (cnt === 0) return false;
            return true;
        });
        newData.circlenodes = newData.circlenodes.filter((_, i) => circleNodeRanks.includes(i))
        newData.circleedges = newData.circleedges.filter(e => newData.circlenodes.findIndex(f => f.name === e.source) !== -1);

        setSelTransfer(newData.circlenodes.map(e => e.name))
        
        setData(newData);
        setCurrentIndex(currentIndex);
    }

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                RadTrixVis
            </Header>
            <Layout>
                <Sider width="25%" style={siderStyle}>
                    <Collapse>
                        <Title level={3}>Data</Title>
                        <Panel header="Main Data:" key="0">
                            <div>
                                <Radio.Group onChange={selectedDataCallback} value={selectedData}>
                                    <Radio value={1}>Augmented Correlation</Radio>
                                    <Radio value={2}>Graph Based</Radio>
                                    <Radio value={3}>Custom Load</Radio>
                                </Radio.Group>
                            </div>
                            {selectedData === 3 && 
                                <div>
                                    <Upload
                                        onChange={handleUpload}
                                        customRequest={({file, onSuccess}) => {
                                            setTimeout(() => {
                                                onSuccess("ok")
                                            }, 0)
                                        }}
                                        maxCount={1}
                                    >
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
                                </div>
                            }
                            <div>
                                <Button onClick={changeMainData} icon={<UploadOutlined />}>Load Data</Button>
                            </div>
                        </Panel>
                        <Panel header="Cancer Type: " key="1">
                            <Select
                                mode='tags'
                                size='default'
                                placeholder="Please select"
                                // options={options}
                                value={selOpt}
                                onChange={e => {
                                    if (e.length > 0) {
                                        check = 0
                                        setSelOpt([...e])
                                    }
                                }}
                                style={{width: '75%'}}
                                tagRender={renderTag}
                            >
                                {options.map(e => (
                                    <Option value={e.value}  key={e.label} style={{background: colors[e.value]}}>
                                        {e.label}
                                    </Option>
                                ))}
                            </Select>
                        </Panel>
                        <Panel header="Cancer Genes: " key="2">
                            <Transfer 
                                dataSource={transferData}
                                showSearch
                                render={item => item.title}
                                listStyle={{width: '35%', height: 400}}
                                targetKeys={selTransfer}
                                onChange={e => {
                                    check = 1
                                    e.length >= 4 ? setSelTransfer([...e]) : alert('Ensure atleast 4 genes in the pool.')
                                }}
                                titles={['Hidden', 'Shown']}
                                filterOption={(i, o) => o.title.toUpperCase().indexOf(i.toUpperCase()) > -1}
                            />
                        </Panel>
                        <Panel header="Top K Genes: " key="5">
                            <InputNumber min={4} max={fullData.circlenodes.length} value={topK} onChange={e => setTopK(e)} />
                            <Button onClick={topKGenesSelector}>Select Top K Genes</Button>
                        </Panel>
                        <Panel header="Gene Selection: " key="6">
                            <Row gutter={[8, 8]}>
                                <Col span={12}>
                                    <Typography.Text>Ranking Type: </Typography.Text>
                                </Col>
                                <Col span={12}>
                                    <Select 
                                        onChange={(value) => setRankType(value)}
                                        options={rankOptions}
                                        defaultValue="Rank Based"
                                        style={{ width: 240 }}
                                    />
                                </Col>

                                <Col span={12}>
                                    <InputNumber addonBefore='Min Rank:' style={{ width: 200 }} value={minRank} onChange={v => setMinRank(v)} />
                                </Col>
                                <Col span={12}>
                                    <InputNumber addonBefore='Max Rank:' style={{ width: 200 }} value={maxRank} onChange={v => setMaxRank(v)} />
                                </Col>

                                <Col span={12}>
                                    <InputNumber addonBefore='Step Size:' style={{ width: 200 }} value={stepSize} onChange={v => setStepSize(v)} />
                                </Col>
                                <Col span={12}>
                                    <Button onClick={rankType.includes('Rank') ? rankGenesSelector : lexGeneSelector}>Update Genes</Button>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="Download Data" key="7">
                            <Button onClick={downloadJsonFile}>Download Data (JSON)</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={downloadCsvFile}>Download Data (CSV)</Button>
                        </Panel>
                        <Title level={3}>Aesthetics</Title>
                        <Panel header="Edge Type: " key="3">
                            <Radio.Group onChange={e => setEdgeType(e.target.value)} value={edgeType}>
                                <Radio value={1}>Straight Edges</Radio>
                                <Radio value={2}>Curved Edges</Radio>
                            </Radio.Group>
                        </Panel>
                        <Panel header="Node Ordering: " key="4">
                            {edgeType === 2 ? 
                                <Radio.Group onChange={e => setOrderType(e.target.value)} value={orderType}>
                                    <Radio value={1}>Barycentric ordering</Radio>
                                    <Radio value={2}>Increasing order of degree</Radio>
                                    <Radio value={3}>Random order</Radio>
                                </Radio.Group>
                                : <Radio.Group onChange={e => setOrderType(e.target.value)} value={orderType}>
                                    <Radio value={1}>Increasing order of degree</Radio>
                                    <Radio value={2}>Random order</Radio>
                                    <Radio value={3}>Lexicographically order</Radio>
                                </Radio.Group>
                            }
                            {console.log(colors)}
                        </Panel>
                        <Panel header="Disease Colors: " key="44">
                            <table>
                                {saveData.nodes.map(e => {
                                    return <tr>
                                        <td><Text>{`${e.name}: `}</Text></td>
                                        <td>
                                            <ColorPicker
                                                onChange={(f, ff) => {
                                                    setColors({
                                                        ...colors,
                                                        [e.index]: ff
                                                    })
                                                }}
                                                value={colors[e.index]}
                                                showText
                                            />
                                        </td>
                                    </tr>
                                })}
                            </table>
                        </Panel>
                        <Panel header="Other Colors: " key="44">
                            <table>
                                {Object.keys(cmColors).map(e => {
                                    return <tr>
                                        <td><Text>{`${labels[e]}: `}</Text></td>
                                        <td>
                                            <ColorPicker
                                                onChange={(f, ff) => {
                                                    setCMColors({
                                                        ...colors,
                                                        [e]: ff
                                                    })
                                                }}
                                                value={cmColors[e]}
                                                showText
                                            />
                                        </td>
                                    </tr>
                                })}
                            </table>
                        </Panel>
                    </Collapse>
                </Sider>
                <Content style={contentStyle}>
                    <div> 
                        <RadTrix />
                    </div>
                </Content>
            </Layout>
            <Footer style={footerStyle}><CopyrightOutlined /> 2019-2024 GVCL</Footer>
        </Layout>
    );
}

export default App;
