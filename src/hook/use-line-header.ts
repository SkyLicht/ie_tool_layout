import lines_header from '@/data/lines_header.json'

type LineHeader = {
    name: string;
    uph: number;
    oee: number;
    model: string;
    sku: string;
    planed_hours: number;
    head_count: number;
    ict: number;
    ft: number;
};


export function useLineHeader(): LineHeader {
    return lines_header[0] as LineHeader
}