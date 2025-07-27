import {MonitorData} from "@/hook/use-data-collector-socket";

export enum Groups {
    SMT_INPUT = "SMT INPUT",
    SPI1 = "SPI1",
    REFLOW_VI1 = "REFLOW VI1",
    AOI_B2 = "AOI B2",
}

export type HourData = {
    hour: number;
    total: number;
    fail_test: number
    data: MonitorData[];
}

export function collectDataByGroupAndHour(data: MonitorData[], groups: string[] = []): Map<string, Map<number, HourData>> {


    const result = new Map<string, Map<number, HourData>>();

    // Filter data by groups if specified
    const filteredData = groups.length > 0
        ? data.filter(item => groups.includes(item.GROUP_NAME))
        : data;

    console.log("filtered",filteredData)

    filteredData.forEach(item => {
        const stationTime = new Date(item.IN_STATION_TIME);
        const hour = stationTime.getHours();
        const groupName = item.GROUP_NAME;

        // Initialize group map if it doesn't exist
        if (!result.has(groupName)) {
            result.set(groupName, new Map<number, HourData>());
        }

        const groupMap = result.get(groupName)!;

        // Initialize hour data if it doesn't exist
        if (!groupMap.has(hour)) {
            groupMap.set(hour, {
                hour: hour,
                total: 0,
                fail_test: 0,
                data: []
            });
        }

        const hourData = groupMap.get(hour)!;

        // Update counters and data
        hourData.total++;
        if (item.ERROR_FLAG === "1") {
            hourData.fail_test++;
        }
        hourData.data.push(item);
    });

    console.log(result)

    return result;
}
