import './App.css';
import React from 'react';
import RadTrix from './RadTrix';
import { Button, Col, Input, InputNumber, Radio, Row, Select, Transfer, Typography } from 'antd';
import { getIndex } from './helpers';
import { data } from './data2';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentIndexAtom, dataAtom, edgeTypeAtom, orderTypeAtom } from './state';
import { cloneDeep, range } from 'lodash';

function App() {
    const options = Object.keys(getIndex).map(e => {
        return {
            label: e,
            value: getIndex[e]
        }
    });
    const transferData = data.circlenodes.map(e => {
        return {
            key: e.name,
            title: `${e.name} (Rank: ${e.rank})`,
            chosen: 0
        }
    })
    const [selOpt, setSelOpt] = React.useState(range(options.length));
    const [selTransfer, setSelTransfer] = React.useState(data.circlenodes.map(e => e.name));
    const setData = useSetRecoilState(dataAtom);
    const setCurrentIndex = useSetRecoilState(currentIndexAtom);
    const [edgeType, setEdgeType] = useRecoilState(edgeTypeAtom);
    const [orderType, setOrderType] = useRecoilState(orderTypeAtom);
    const [topK, setTopK] = React.useState(Math.min(100, data.circlenodes.length));
    const [rankSelString, setRankSelString] = React.useState("")
    const [lexSelString, setLexSelString] = React.useState("")

    React.useEffect(() => {
        const newData = cloneDeep(data);

        // Handling Changes to Circle Nodes
        newData.circlenodes = newData.circlenodes.filter(e => selTransfer.findIndex(f => f === e.name) !== -1);
        newData.circleedges = newData.circleedges.filter(e => selTransfer.findIndex(f => f === e.source) !== -1);

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

        if (newData.circlenodes.length !== selTransfer.length) {
            setSelTransfer(newData.circlenodes.map(e => e.name))
        }

        console.log(newData)

        setData(newData);
        setCurrentIndex(currentIndex);
    }, [selOpt, selTransfer, setData, setCurrentIndex]);

    const topKGenesSelector = () => {
        const newData = cloneDeep(data);

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
            console.log(ranges)
            const res = ranges.reduce((acc, rangeStr) => {
                const [start, stop, step] = rangeStr.split(":").map(Number);
                if (stop >= start) {
                    for (let i = start; i <= stop; i += step) {
                        acc.push(i - 1);
                    }
                }
                return acc
            }, [])
            console.log("Res:", res)
            const uniqueRes = [...new Set(res)]
            uniqueRes.sort((a, b) => a - b)
            return uniqueRes
        } catch {
            return []
        }
    }

    const rankGenesSelector = () => {
        const circleNodeRanks = parseArrString(rankSelString)
        console.log(circleNodeRanks)
        if (circleNodeRanks.length < 4) {
            alert('Please enter valid string and ensure atleast 4 valid genes.')
            return
        }

        const newData = cloneDeep(data);

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
        <div className="App">
            <Row style={{textAlign: 'left'}}>
                <Col span={12}>
                    <Typography>Cancer Type: </Typography>
                    <Select
                        mode='tags'
                        size='default'
                        placeholder="Please select"
                        options={options}
                        value={selOpt}
                        onChange={e => (e.length > 0) ? setSelOpt([...e]): null}
                        style={{width: '75%'}}
                    />
                    <Typography>Cancer Genes:</Typography>
                    <Transfer 
                        dataSource={transferData}
                        showSearch
                        render={item => item.title}
                        listStyle={{width: '35%', height: 400}}
                        targetKeys={selTransfer}
                        onChange={e => e.length >= 4 ? setSelTransfer([...e]) : alert('Ensure atleast 4 genes in the pool.')}
                        titles={['Hidden', 'Shown']}
                        filterOption={(i, o) => o.title.toUpperCase().indexOf(i.toUpperCase()) > -1}
                    />
                </Col>
                <Col>
                    <Typography>Edge Type:</Typography>
                    <Radio.Group onChange={e => setEdgeType(e.target.value)} value={edgeType}>
                        <Radio value={1}>Straight Edges</Radio>
                        <Radio value={2}>Curved Edges</Radio>
                    </Radio.Group>
                    <Typography>Node Ordering:</Typography>
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
                    <Typography>Top K Genes:</Typography>
                    <InputNumber min={4} max={data.circlenodes.length} value={topK} onChange={e => setTopK(e)} />
                    <Button onClick={topKGenesSelector}>Select Top K Genes</Button>
                    <Typography>Rank Based Gene Selection:</Typography>
                    <Input value={rankSelString} onChange={e => setRankSelString(e.target.value)} />
                    <Button onClick={rankGenesSelector}>Select Ranks</Button>
                    <Typography>Lexicographical Gene Selection:</Typography>
                    <Input value={lexSelString} onChange={e => setLexSelString(e.target.value)} />
                    <Button>Select Positions</Button>
                </Col>
            </Row>
            <Row>
                <Col flex={15} >  
                    <RadTrix />
                </Col>
            </Row>
        </div>
    );
}

export default App;
