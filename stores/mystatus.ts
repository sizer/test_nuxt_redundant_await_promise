import { defineStore } from "pinia";

export const useMystatusStore = defineStore('mystatus', {
    state: () => ({
        status: 'default',
    }),
    actions: {
        setStatus(status: string) {
            this.status = status
        },
        reset() {
            this.status = 'default'
        }
    }
})
