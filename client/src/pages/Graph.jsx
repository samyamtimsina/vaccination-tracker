import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Manually parsed CSV data for male children
const maleGrowthData = [
    { "Month": 0, "L": 0.3809, "M": 3.2322, "S": 0.14171, "SD3neg": 0, "SD2neg": 0, "SD1neg": 2, "SD0": 3.2, "SD1": 2.5, "SD2": 4.2, "SD3": 4 },
    { "Month": 1, "L": 0.1714, "M": 4.1873, "S": 0.13724, "SD3neg": 0, "SD2neg": 0, "SD1neg": 3, "SD0": 4.2, "SD1": 3.3, "SD2": 5.5, "SD3": 5.1 },
    { "Month": 2, "L": 0.0962, "M": 5.1282, "S": 0.13, "SD3neg": 0, "SD2neg": 0, "SD1neg": 3.9, "SD0": 5.1, "SD1": 4.3, "SD2": 6.6, "SD3": 6.3 },
    { "Month": 3, "L": 0.0402, "M": 5.8458, "S": 0.12619, "SD3neg": 0, "SD2neg": 0, "SD1neg": 4.5, "SD0": 5.8, "SD1": 5, "SD2": 7.5, "SD3": 7.2 },
    { "Month": 4, "L": -0.005, "M": 6.4237, "S": 0.12402, "SD3neg": 0, "SD2neg": 0, "SD1neg": 4.9, "SD0": 6.4, "SD1": 5.6, "SD2": 8.2, "SD3": 7.8 },
    { "Month": 5, "L": -0.043, "M": 6.8985, "S": 0.12274, "SD3neg": 0, "SD2neg": 0, "SD1neg": 5.3, "SD0": 6.9, "SD1": 6, "SD2": 8.8, "SD3": 8.5 },
    { "Month": 6, "L": -0.0756, "M": 7.297, "S": 0.12204, "SD3neg": 0, "SD2neg": 0, "SD1neg": 5.7, "SD0": 7.3, "SD1": 6.4, "SD2": 9.2, "SD3": 8.8 },
    { "Month": 7, "L": -0.1042, "M": 7.6385, "S": 0.12168, "SD3neg": 0, "SD2neg": 0, "SD1neg": 5.9, "SD0": 7.6, "SD1": 6.7, "SD2": 9.7, "SD3": 9.2 },
    { "Month": 8, "L": -0.1293, "M": 7.9351, "S": 0.12154, "SD3neg": 0, "SD2neg": 0, "SD1neg": 6.2, "SD0": 7.9, "SD1": 6.8, "SD2": 10.1, "SD3": 9.6 },
    { "Month": 9, "L": -0.1517, "M": 8.1963, "S": 0.12156, "SD3neg": 0, "SD2neg": 0, "SD1neg": 6.4, "SD0": 8.2, "SD1": 7.1, "SD2": 10.4, "SD3": 9.9 },
    { "Month": 10, "L": -0.1718, "M": 8.4287, "S": 0.1217, "SD3neg": 0, "SD2neg": 0, "SD1neg": 6.7, "SD0": 8.4, "SD1": 7.4, "SD2": 10.7, "SD3": 10.2 },
    { "Month": 11, "L": -0.1901, "M": 8.636, "S": 0.1219, "SD3neg": 0, "SD2neg": 0, "SD1neg": 6.8, "SD0": 8.6, "SD1": 7.5, "SD2": 11, "SD3": 10.5 },
    { "Month": 12, "L": -0.2066, "M": 8.8252, "S": 0.12215, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7, "SD0": 8.8, "SD1": 7.7, "SD2": 11.2, "SD3": 10.7 },
    { "Month": 13, "L": -0.2217, "M": 9.006, "S": 0.12248, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.2, "SD0": 9, "SD1": 7.9, "SD2": 11.4, "SD3": 11 },
    { "Month": 14, "L": -0.2356, "M": 9.1724, "S": 0.12284, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.4, "SD0": 9.2, "SD1": 8.1, "SD2": 11.7, "SD3": 11.4 },
    { "Month": 15, "L": -0.2483, "M": 9.3308, "S": 0.12323, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.5, "SD0": 9.3, "SD1": 8.4, "SD2": 11.9, "SD3": 11.5 },
    { "Month": 16, "L": -0.2603, "M": 9.4795, "S": 0.12365, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.6, "SD0": 9.5, "SD1": 8.5, "SD2": 12.1, "SD3": 11.7 },
    { "Month": 17, "L": -0.2714, "M": 9.6231, "S": 0.12409, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.7, "SD0": 9.6, "SD1": 8.6, "SD2": 12.3, "SD3": 12 },
    { "Month": 18, "L": -0.2818, "M": 9.7573, "S": 0.12455, "SD3neg": 0, "SD2neg": 0, "SD1neg": 7.8, "SD0": 9.8, "SD1": 8.8, "SD2": 12.5, "SD3": 12.2 },
    { "Month": 19, "L": -0.2915, "M": 9.8863, "S": 0.12502, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8, "SD0": 9.9, "SD1": 8.9, "SD2": 12.7, "SD3": 12.5 },
    { "Month": 20, "L": -0.3006, "M": 10.0101, "S": 0.12551, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8.1, "SD0": 10.1, "SD1": 9.1, "SD2": 12.9, "SD3": 12.7 },
    { "Month": 21, "L": -0.3093, "M": 10.1274, "S": 0.126, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8.2, "SD0": 10.2, "SD1": 9.3, "SD2": 13.1, "SD3": 12.9 },
    { "Month": 22, "L": -0.3175, "M": 10.2435, "S": 0.12651, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8.3, "SD0": 10.3, "SD1": 9.4, "SD2": 13.3, "SD3": 13.2 },
    { "Month": 23, "L": -0.3253, "M": 10.3552, "S": 0.12702, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8.5, "SD0": 10.4, "SD1": 9.5, "SD2": 13.4, "SD3": 13.4 },
    { "Month": 24, "L": -0.3327, "M": 10.463, "S": 0.12755, "SD3neg": 0, "SD2neg": 0, "SD1neg": 8.7, "SD0": 10.5, "SD1": 9.7, "SD2": 13.6, "SD3": 13.6 },
];
// Manually parsed CSV data for female children
const femaleGrowthData = [
    { "Month": 0, "L": 0.3487, "M": 3.3464, "S": 0.14602, "SD3neg": 2.1, "SD2neg": 2.5, "SD1neg": 2.9, "SD0": 3.3, "SD1": 3.9, "SD2": 4.4, "SD3": 5 },
    { "Month": 1, "L": 0.2297, "M": 4.4709, "S": 0.13395, "SD3neg": 2.9, "SD2neg": 3.4, "SD1neg": 3.9, "SD0": 4.5, "SD1": 5.1, "SD2": 5.8, "SD3": 6.6 },
    { "Month": 2, "L": 0.197, "M": 5.5675, "S": 0.12385, "SD3neg": 3.8, "SD2neg": 4.3, "SD1neg": 4.9, "SD0": 5.6, "SD1": 6.3, "SD2": 7.1, "SD3": 8 },
    { "Month": 3, "L": 0.1738, "M": 6.3762, "S": 0.11727, "SD3neg": 4.4, "SD2neg": 5, "SD1neg": 5.7, "SD0": 6.4, "SD1": 7.2, "SD2": 8, "SD3": 9 },
    { "Month": 4, "L": 0.1553, "M": 7.0023, "S": 0.11316, "SD3neg": 4.9, "SD2neg": 5.6, "SD1neg": 6.2, "SD0": 7, "SD1": 7.8, "SD2": 8.7, "SD3": 9.7 },
    { "Month": 5, "L": 0.1395, "M": 7.5105, "S": 0.1108, "SD3neg": 5.3, "SD2neg": 6, "SD1neg": 6.7, "SD0": 7.5, "SD1": 8.4, "SD2": 9.3, "SD3": 10.4 },
    { "Month": 6, "L": 0.1257, "M": 7.934, "S": 0.10958, "SD3neg": 5.7, "SD2neg": 6.4, "SD1neg": 7.1, "SD0": 7.9, "SD1": 8.8, "SD2": 9.8, "SD3": 11 },
    { "Month": 7, "L": 0.1134, "M": 8.2974, "S": 0.1092, "SD3neg": 6, "SD2neg": 6.7, "SD1neg": 7.5, "SD0": 8.3, "SD1": 9.2, "SD2": 10.3, "SD3": 11.5 },
    { "Month": 8, "L": 0.1022, "M": 8.6186, "S": 0.10935, "SD3neg": 6.2, "SD2neg": 7, "SD1neg": 7.8, "SD0": 8.6, "SD1": 9.6, "SD2": 10.8, "SD3": 12.1 },
    { "Month": 9, "L": 0.0919, "M": 8.9056, "S": 0.10986, "SD3neg": 6.4, "SD2neg": 7.2, "SD1neg": 8.1, "SD0": 8.9, "SD1": 9.9, "SD2": 11.1, "SD3": 12.5 },
    { "Month": 10, "L": 0.0826, "M": 9.1672, "S": 0.1106, "SD3neg": 6.6, "SD2neg": 7.4, "SD1neg": 8.3, "SD0": 9.2, "SD1": 10.2, "SD2": 11.5, "SD3": 12.9 },
    { "Month": 11, "L": 0.074, "M": 9.4085, "S": 0.1115, "SD3neg": 6.8, "SD2neg": 7.6, "SD1neg": 8.5, "SD0": 9.4, "SD1": 10.5, "SD2": 11.8, "SD3": 13.3 },
    { "Month": 12, "L": 0.066, "M": 9.6338, "S": 0.11248, "SD3neg": 6.9, "SD2neg": 7.8, "SD1neg": 8.7, "SD0": 9.6, "SD1": 10.8, "SD2": 12.1, "SD3": 13.6 },
    { "Month": 13, "L": 0.0585, "M": 9.8458, "S": 0.11352, "SD3neg": 7.1, "SD2neg": 7.9, "SD1neg": 8.9, "SD0": 9.8, "SD1": 11, "SD2": 12.3, "SD3": 13.9 },
    { "Month": 14, "L": 0.0514, "M": 10.046, "S": 0.1146, "SD3neg": 7.2, "SD2neg": 8.1, "SD1neg": 9.1, "SD0": 10, "SD1": 11.2, "SD2": 12.6, "SD3": 14.2 },
    { "Month": 15, "L": 0.0446, "M": 10.2355, "S": 0.11571, "SD3neg": 7.3, "SD2neg": 8.2, "SD1neg": 9.2, "SD0": 10.2, "SD1": 11.4, "SD2": 12.8, "SD3": 14.5 },
    { "Month": 16, "L": 0.0381, "M": 10.4143, "S": 0.11684, "SD3neg": 7.4, "SD2neg": 8.4, "SD1neg": 9.4, "SD0": 10.4, "SD1": 11.6, "SD2": 13.1, "SD3": 14.8 },
    { "Month": 17, "L": 0.0318, "M": 10.5847, "S": 0.11798, "SD3neg": 7.5, "SD2neg": 8.5, "SD1neg": 9.5, "SD0": 10.6, "SD1": 11.8, "SD2": 13.3, "SD3": 15 },
    { "Month": 18, "L": 0.0258, "M": 10.7472, "S": 0.11913, "SD3neg": 7.6, "SD2neg": 8.6, "SD1neg": 9.7, "SD0": 10.7, "SD1": 12, "SD2": 13.5, "SD3": 15.3 },
    { "Month": 19, "L": 0.02, "M": 10.903, "S": 0.12028, "SD3neg": 7.7, "SD2neg": 8.7, "SD1neg": 9.8, "SD0": 10.9, "SD1": 12.2, "SD2": 13.7, "SD3": 15.6 },
    { "Month": 20, "L": 0.0144, "M": 11.0527, "S": 0.12142, "SD3neg": 7.8, "SD2neg": 8.8, "SD1neg": 9.9, "SD0": 11, "SD1": 12.4, "SD2": 13.9, "SD3": 15.8 },
    { "Month": 21, "L": 0.0089, "M": 11.1963, "S": 0.12257, "SD3neg": 7.9, "SD2neg": 9, "SD1neg": 10.1, "SD0": 11.2, "SD1": 12.5, "SD2": 14.1, "SD3": 16.1 },
    { "Month": 22, "L": 0.0036, "M": 11.3346, "S": 0.12369, "SD3neg": 8, "SD2neg": 9.1, "SD1neg": 10.2, "SD0": 11.3, "SD1": 12.7, "SD2": 14.3, "SD3": 16.3 },
    { "Month": 23, "L": -0.0016, "M": 11.4674, "S": 0.12479, "SD3neg": 8.1, "SD2neg": 9.2, "SD1neg": 10.3, "SD0": 11.5, "SD1": 12.8, "SD2": 14.5, "SD3": 16.6 },
    { "Month": 24, "L": -0.0067, "M": 11.5954, "S": 0.12586, "SD3neg": 8.2, "SD2neg": 9.3, "SD1neg": 10.5, "SD0": 11.6, "SD1": 13, "SD2": 14.7, "SD3": 16.8 },
];

const getAgeInMonths = (birthDateStr, measureDateStr) => {
    const birth = new Date(birthDateStr);
    const measure = new Date(measureDateStr);
    const diffMs = measure - birth;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays / 30.4375;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 border rounded-md shadow-md">
                <p className="font-bold">{`Age: ${label} months`}</p>
                {data.MyWeight && (
                    <p className="text-blue-600">{`Child's Weight: ${data.MyWeight.toFixed(1)} kg`}</p>
                )}
                <p className="text-gray-600">{`Standard Range: ${data.SD3neg.toFixed(1)} - ${data.SD3.toFixed(1)} kg`}</p>
                <p className="text-gray-600">{`Median Weight: ${data.SD0.toFixed(1)} kg`}</p>
            </div>
        );
    }
    return null;
};

const Graph = () => {
    const location = useLocation();
    const [selectedChild, setSelectedChild] = useState(null);
    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        if (location.state && location.state.childrenData) {
            setSelectedChild(location.state.childrenData);
        }
    }, [location.state]);

    useEffect(() => {
        if (!selectedChild) return;

        const gender = selectedChild.gender.toLowerCase();
        let standardData = gender === 'male' ? maleGrowthData : femaleGrowthData;
        standardData = standardData.filter(item => item.Month <= 24);

        // 1. Process reference data only (WHO standards)
        const referenceData = standardData.map(item => ({
            Month: item.Month,
            base: item.SD3neg,
            dangerousLow: item.SD1neg - item.SD3neg,
            normalZone: item.SD1 - item.SD1neg,
            safeZone: item.SD3 - item.SD1,
            // Keep SD values for tooltip
            SD3neg: item.SD3neg,
            SD1neg: item.SD1neg,
            SD1: item.SD1,
            SD3: item.SD3,
            SD0: item.SD0,
        }));

        // 2. Process child's weight data separately
        const childWeightData = selectedChild.weightRecords
            .map(rec => ({
                Month: getAgeInMonths(selectedChild.birthDate, rec.date),
                MyWeight: rec.weight
            }))
            .filter(point => point.Month >= 0 && point.Month <= 24)
            .sort((a, b) => a.Month - b.Month);

        // 3. Merge child weight data into reference data without affecting the areas
        const procData = referenceData.map(refPoint => {
            const childPoint = childWeightData.find(c => Math.abs(c.Month - refPoint.Month) < 0.1);
            return {
                ...refPoint,
                MyWeight: childPoint ? childPoint.MyWeight : null
            };
        });

        setProcessedData(procData);
    }, [selectedChild]);

    const childLineName = selectedChild ? `${selectedChild.fullName}'s Weight` : "Child's Weight";

    const firstYearData = processedData.filter(item => item.Month <= 12);
    const secondYearData = processedData.filter(item => item.Month > 12);

    const firstYearWeightTicks = Array.from({ length: 14 }, (_, i) => i);
    const secondYearWeightTicks = Array.from({ length: 14 }, (_, i) => i + 3);

    const firstYearMonthTicks = Array.from({ length: 13 }, (_, i) => i);
    const secondYearMonthTicks = Array.from({ length: 13 }, (_, i) => i + 12);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">
                WHO Child Growth Standards: Weight-for-age
            </h1>
            {selectedChild && (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold">
                        {`${selectedChild.fullName}'s Weight-for-age (${selectedChild.gender === 'MALE' ? 'Boys' : 'Girls'})`}
                    </h2>
                    <div className="flex w-full" style={{ height: 400 }}>
                        <div style={{ width: '50%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={firstYearData}
                                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Month" domain={[0, 12]} ticks={firstYearMonthTicks} label={{ value: "Month (First Year)", position: "insideBottom", offset: 0 }} />
                                    <YAxis domain={[0, 13]} ticks={firstYearWeightTicks} interval={0} label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }} />
                                    <Tooltip content={<CustomTooltip />} />

                                    {/* Base area from 0 */}
                                    <Area
                                      type="monotone"
                                      dataKey="base"
                                      stackId="1"
                                      stroke="none"
                                      fill="transparent"
                                      isAnimationActive={false}
                                    />

                                    {/* Red zone */}
                                    <Area
                                      type="monotone"
                                      dataKey="dangerousLow"
                                      stackId="1"
                                      stroke="none"
                                      fill="#F44336"
                                      fillOpacity={0.3}
                                      name="Very Dangerous"
                                      isAnimationActive={false}
                                    />

                                    {/* Yellow zone */}
                                    <Area
                                      type="monotone"
                                      dataKey="normalZone"
                                      stackId="1"
                                      stroke="none"
                                      fill="#FFC107"
                                      fillOpacity={0.3}
                                      name="Dangerous"
                                      isAnimationActive={false}
                                    />

                                    {/* Green zone */}
                                    <Area
                                      type="monotone"
                                      dataKey="safeZone"
                                      stackId="1"
                                      stroke="none"
                                      fill="#4CAF50"
                                      fillOpacity={0.3}
                                      name="Good"
                                      isAnimationActive={false}
                                    />

                                    {/* Child's weight line - rendered last to be on top */}
                                    <Line
                                      type="monotone"
                                      dataKey="MyWeight"
                                      stroke="#3b82f6"
                                      strokeWidth={3}
                                      dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                                      name={childLineName}
                                      connectNulls={true}
                                      isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ width: '50%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={secondYearData}
                                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Month" domain={[12, 24]} ticks={secondYearMonthTicks} label={{ value: "Month (Second Year)", position: "insideBottom", offset: 0 }} />
                                    <YAxis domain={[3, 16]} ticks={secondYearWeightTicks} interval={0} label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }} />
                                    <Tooltip content={<CustomTooltip />} />

                                    {/* Base area up to the -3 standard deviation line */}
                                    <Area
                                        type="monotone"
                                        dataKey="base"
                                        stackId="1"
                                        stroke="none"
                                        fill="transparent"
                                        isAnimationActive={false}
                                    />

                                    {/* Red area for Very Dangerous */}
                                    <Area
                                        type="monotone"
                                        dataKey="dangerousLow"
                                        stackId="1"
                                        stroke="none"
                                        fill="#F44336"
                                        fillOpacity={0.3}
                                        name="Very Dangerous"
                                        isAnimationActive={false}
                                    />

                                    {/* Yellow area for Dangerous */}
                                    <Area
                                        type="monotone"
                                        dataKey="normalZone"
                                        stackId="1"
                                        stroke="none"
                                        fill="#FFC107"
                                        fillOpacity={0.3}
                                        name="Dangerous"
                                        isAnimationActive={false}
                                    />

                                    {/* Green area for Good */}
                                    <Area
                                        type="monotone"
                                        dataKey="safeZone"
                                        stackId="1"
                                        stroke="none"
                                        fill="#4CAF50"
                                        fillOpacity={0.3}
                                        name="Good"
                                        isAnimationActive={false}
                                    />

                                    {/* Child's weight line */}
                                    <Line
                                        type="monotone"
                                        dataKey="MyWeight"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        name={childLineName}
                                        connectNulls={true}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center mr-6">
                            <div className="w-4 h-4 bg-red-500 mr-2"></div>
                            <p>Red: Very Dangerous</p>
                        </div>
                        <div className="flex items-center mr-6">
                            <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                            <p>Yellow: Dangerous</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 mr-2"></div>
                            <p>Green: Good</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Graph;