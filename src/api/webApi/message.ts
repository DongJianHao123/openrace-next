import { webRequest } from "@/services/request"
import { PageListParams, ResponseListType } from "@/types"
import { IDealMessageParams, IMessage } from "@/types/message"

export const apiGetMessageList = (params: IMessage & PageListParams) => {
    return webRequest.post<ResponseListType<IMessage>>('/raceMessage/getListPager', params)
}

export const apiReadMessage = (messageId: number) => {
    return webRequest.post<IMessage>('/raceMessage/readAndGet', { messageId })
}

export const apiDealMessage = (params: IDealMessageParams) => {
    return webRequest.post<IMessage>('/raceMessage/dealMessage', params)
}

export const apiGetUnReadCount = () => {
    return webRequest.post('/raceMessage/getUnReadMessageCount')
}