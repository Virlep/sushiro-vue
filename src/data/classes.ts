import axios from 'axios';
const corsAnywhereUrl = 'https://cors.freehi.workers.dev/?'

export interface ReturnData {
    status: string,
    data?: unknown | unknown[]
}

export interface ResponseStore {
    id: number,
    storeStatus: string,
    netTicketStatus: string,
    name: string,
    address: string,
    area: string,
    latitude: number,
    longitude: number,
    wait: number
    queue: number[],
}
export class Store {
    id: number;
    storeStatus: string;
    netTicketStatus: string;
    name: string;
    address: string;
    area: string;
    location: number[];
    wait: number;
    queue: number[];
    boothQueue: number[];
    isBookmark: boolean;
    latitude?: number;
    longitude?: number;
    waitingNo:number | null;
    waitingNoBetween:number | null;
    constructor(id: number, storeStatus: string, netTicketStatus: string, wait: number, name: string, address: string, area: string, latitude: number, longitude: number) {
        this.id = id;
        this.storeStatus = storeStatus;
        this.netTicketStatus = netTicketStatus;
        this.name = name;
        this.address = address;
        this.area = area;
        this.location = [latitude, longitude];
        this.wait = wait;
        this.queue = [];
        this.boothQueue = [];
        this.isBookmark = false;
        this.waitingNo = null;
        this.waitingNoBetween = null;
    }
    async getQueue(): Promise<void> {
        try {
            const response = await axios(`${corsAnywhereUrl}https://sushipass.sushiro.com.hk/api/2.0/remote/groupqueues?region=HK&storeid=${this.id}`);
            this.queue = response.data.storeQueue
            this.boothQueue = response.data.boothQueue

            // this.boothQueue = [101,102,103] -- testing
            if (this.waitingNo) {
                console.log('this.waitingNo:' + this.waitingNo)
                await this.checkWaitingStatus()
            }
        } catch (err) {
            console.error(err)
        }
    }
    async updateWaitingNo(number:number): Promise<void> {
        this.waitingNo = number;
        this.checkWaitingStatus();
    }
    async checkWaitingStatus(): Promise<void> {
        const maxNum = Math.max(...this.boothQueue);
        if (this.waitingNo && this.boothQueue.length != 0) {
            this.waitingNoBetween = this.waitingNo - maxNum;
        }else{
            this.waitingNoBetween = null;
        }
    }
}

export interface Queue{
    storeId: number,
    data: (string | number)[]
}